import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import (
    RandomForestClassifier, RandomForestRegressor, 
    HistGradientBoostingClassifier, HistGradientBoostingRegressor,
    VotingClassifier, VotingRegressor
)
from sklearn.metrics import classification_report, accuracy_score, f1_score, mean_absolute_error

# =====================================================================
# 1. HELPER FUNCTION: DYNAMIC COLUMN FINDER
# =====================================================================
# In large SAP/ERP exports, column names often change slightly (e.g., 'PR Date' vs 'PR Cr Date').
# This function checks a list of possible names and returns the one that actually exists.
def find_column(possible_names, dataframe):
    for name in possible_names:
        if name in dataframe.columns:
            return name
    return None


# =====================================================================
# 2. DATA LOADING & CLEANING (STRICT EXCEL MODE)
# =====================================================================
print("Initializing Data Pipeline...")
file_path = "ZIMM211.XLSX" # Using your local file name

try:
    # Force pandas to treat this as a zipped Excel binary file
    print("Unzipping and reading Excel binary data (this may take a moment for 500k rows)...")
    df = pd.read_excel(file_path, engine='openpyxl')
    print(f"Successfully loaded {len(df)} true tabular rows using Excel engine.")
except Exception as e:
    raise RuntimeError(f"Failed to read the Excel file. Please ensure you ran 'pip install openpyxl' in your terminal. Error: {e}")

# Clean hidden spaces/tabs from headers that happen during export
df.columns = df.columns.str.strip()

# Print diagnostic information so you can see your exact column names
print("\n[DIAGNOSTIC] First 20 Columns found in this file:")
print(list(df.columns[:20]))

# Dynamically locate the required date columns based on known variations
pr_date_col = find_column(['PR Cr Date', 'PR Creation Date', 'PR Date', 'Created On'], df)
bid_act_col = find_column(['Bid Act Opening Date', 'Bid Opening Date', 'Bid Date', 'Actual Bid Date'], df)

# Failsafe check: Stop the script if the absolute core dates are missing
if not pr_date_col:
    raise KeyError(f"\nCRITICAL ERROR: Could not find the PR Creation Date column! \nAvailable columns: {list(df.columns)}")

# Convert the located date columns into proper Pandas Datetime objects
date_cols = [col for col in [pr_date_col, bid_act_col] if col is not None]
for col in date_cols:
    df[col] = pd.to_datetime(df[col], errors='coerce')

# Dynamically locate text/categorical columns
desc_col = find_column(['Description', 'Material Description', 'Short Text'], df)
pgroup_col = find_column(['PGroup', 'Purchasing Group', 'Pur. Group'], df)
mat_col = find_column(['Material', 'Material Number', 'Item'], df)

# Fill missing values with 'Unknown' or blanks so the Machine Learning models don't crash
df[desc_col] = df[desc_col].fillna('').astype(str) if desc_col else ''
df[pgroup_col] = df[pgroup_col].fillna('Unknown').astype(str) if pgroup_col else 'Unknown'
df[mat_col] = df[mat_col].fillna('Unknown').astype(str) if mat_col else 'Unknown'


# =====================================================================
# 3. TARGET ENGINEERING (CREATING LABELS FOR OUR OBJECTIVES)
# =====================================================================

# Locate numerical columns needed for calculations
lead_time_col = find_column(['Part Lead Time', 'Lead Time', 'Delivery Time'], df)
pr_qty_col = find_column(['PR Qty', 'Quantity', 'Purchase Requisition Qty', 'PO Quantity'], df)
rel_rfq_col = find_column(['PR Rel-RFQ Days', 'Rel to RFQ', 'Days to RFQ'], df)
rfq_rate_col = find_column(['RFQ Rate', 'Rate', 'Price'], df)

# --- OBJECTIVE 1: Operational Priority Class Labels ---
# We create a mathematical risk score: longer lead times + longer RFQ delays = Higher Risk
# We divide by Quantity because low-quantity, high-delay parts are huge bottlenecks.
if lead_time_col and rel_rfq_col and pr_qty_col:
    df['Risk_Score'] = (df[lead_time_col] + df[rel_rfq_col]) / (df[pr_qty_col] + 1)
    
    # Calculate the statistical thresholds (25th, 60th, and 85th percentiles)
    quantiles = df['Risk_Score'].quantile([0.25, 0.60, 0.85]).values

    def assign_priority(score):
        if score >= quantiles[2]: return 0      # Top 15% risk -> Critical
        elif score >= quantiles[1]: return 1     # Top 40% risk -> High Priority
        elif score >= quantiles[0]: return 2     # Top 75% risk -> Medium Priority
        else: return 3                           # Bottom 25% risk -> Low Priority

    # Apply the logic to create our target column
    df['Priority_Label'] = df['Risk_Score'].apply(assign_priority)
else:
    raise KeyError("Missing core numerical columns needed to calculate Priority (Lead Time, PR Qty, or Rel-RFQ Days).")

# Global target names for consistent printing later
target_names = ['Critical', 'High Priority', 'Medium Priority', 'Low Priority']

# --- OBJECTIVES 2 & 3: Total Strategic Procurement Days (Regression Target) ---
# Calculate how many actual days passed between PR Creation and Bid Opening
if bid_act_col and pr_date_col:
    df['Total_Sourcing_Days'] = (df[bid_act_col] - df[pr_date_col]).dt.days
    
    # If the dates are missing for a row, we fall back to summing up the individual cycle time columns
    pr_cycle_col = find_column(['PR Cycle Time', 'Cycle Time'], df)
    bid_cycle_col = find_column(['Bid Cycle Time'], df)
    
    if pr_cycle_col and bid_cycle_col:
        fallback_days = df[pr_cycle_col] + df[rel_rfq_col] + df[bid_cycle_col]
        df['Total_Sourcing_Days'] = df['Total_Sourcing_Days'].fillna(fallback_days)
    else:
        # Ultimate safety fallback: replace missing gaps with the overall median time
        df['Total_Sourcing_Days'] = df['Total_Sourcing_Days'].fillna(df['Total_Sourcing_Days'].median())
else:
    # If there are no dates at all, default to 30 days so the script can still run
    df['Total_Sourcing_Days'] = 30 


# =====================================================================
# 4. PREPROCESSING PIPELINE (FIXED FOR MASSIVE 500K DATASET)
# =====================================================================
# We use OrdinalEncoder instead of OneHotEncoder to prevent the 16 GB RAM crash.
# sparse_threshold=0 ensures the models get a clean, fast matrix.
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), [pr_qty_col, lead_time_col, rfq_rate_col]),
        ('cat', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1), [pgroup_col, mat_col]),
        ('text', TfidfVectorizer(max_features=30), desc_col)
    ],
    sparse_threshold=0
)

# Define our Features (X) and our two Targets (y_cls and y_reg)
X = df[[pgroup_col, mat_col, pr_qty_col, lead_time_col, rfq_rate_col, desc_col]]
y_cls = df['Priority_Label']
y_reg = df['Total_Sourcing_Days']


# =====================================================================
# 5. PART A: CLASSIFICATION TRAINING (Objective 1)
# =====================================================================
print("\n" + "="*50)
print("EXECUTING CLASSIFICATION PIPELINE (OBJECTIVE 1)")
print("="*50)

# Split data into 80% training and 20% testing. Stratify ensures even priority distribution.
X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
    X, y_cls, test_size=0.2, random_state=42, stratify=y_cls
)

# Define High-Performance base algorithms for large datasets
rf_clf = RandomForestClassifier(n_estimators=100, max_depth=8, n_jobs=-1, random_state=42)
hgb_clf = HistGradientBoostingClassifier(max_iter=100, learning_rate=0.1, random_state=42)

# Combine them into a soft-voting ensemble
ensemble_classifier = VotingClassifier(
    estimators=[('rf', rf_clf), ('hgb', hgb_clf)],
    voting='soft'
)

classifiers = {
    "Random Forest": Pipeline([('prep', preprocessor), ('model', rf_clf)]),
    "Gradient Boosting": Pipeline([('prep', preprocessor), ('model', hgb_clf)]),
    "Ensemble (RF + HGB)": Pipeline([('prep', preprocessor), ('model', ensemble_classifier)])
}

classification_results = {}
for name, pipeline in classifiers.items():
    print(f"Training {name} Classification Model...")
    pipeline.fit(X_train_c, y_train_c)
    preds = pipeline.predict(X_test_c)
    classification_results[name] = preds
    print(f"\n[{name}] Evaluation Metrics:")
    print(classification_report(y_test_c, preds, target_names=target_names, zero_division=0))


# =====================================================================
# 6. PART B: REGRESSION TRAINING (Objectives 2 & 3)
# =====================================================================
print("\n" + "="*50)
print("EXECUTING REGRESSION PIPELINE (OBJECTIVES 2 & 3)")
print("="*50)

# Split data for timeline prediction
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X, y_reg, test_size=0.2, random_state=42)

# Fast Regressors for large datasets
rf_reg = RandomForestRegressor(n_estimators=100, max_depth=8, n_jobs=-1, random_state=42)
hgb_reg = HistGradientBoostingRegressor(max_iter=150, learning_rate=0.1, random_state=42)

# Combine them into an average-voting ensemble
ensemble_regressor = VotingRegressor(estimators=[('rf', rf_reg), ('hgb', hgb_reg)])

regressors = {
    "Random Forest Regressor": Pipeline([('prep', preprocessor), ('model', rf_reg)]),
    "Gradient Boosting Regressor": Pipeline([('prep', preprocessor), ('model', hgb_reg)]),
    "Ensemble (RF + HGB)": Pipeline([('prep', preprocessor), ('model', ensemble_regressor)])
}

regression_results = {}
for name, pipeline in regressors.items():
    print(f"Training {name} Regression Model...")
    pipeline.fit(X_train_r, y_train_r)
    preds = pipeline.predict(X_test_r)
    regression_results[name] = preds
    mae = mean_absolute_error(y_test_r, preds)
    print(f"-> {name:30} Mean Absolute Error: {mae:.2f} days")


# =====================================================================
# 7. HEAD-TO-HEAD WINNER EVALUATOR MODULE
# =====================================================================
print("\n" + "="*50)
print("SUMMARY REPORT (Which model won?)")
print("="*50)

# Highest F1 Score wins the Classification
print("\n--- Classification Rank (Higher Macro F1-Score is Better) ---")
for name, preds in classification_results.items():
    f1 = f1_score(y_test_c, preds, average='macro', zero_division=0)
    acc = accuracy_score(y_test_c, preds)
    print(f"Classifier: {name:25} | Macro F1: {f1:.4f} | Accuracy: {acc:.2%}")

# Lowest MAE wins the Regression
print("\n--- Regression Rank (Lower Mean Absolute Error is Better) ---")
for name, preds in regression_results.items():
    mae = mean_absolute_error(y_test_r, preds)
    print(f"Regressor: {name:25} | Mean Absolute Error: {mae:.2f} days")


# =====================================================================
# 8. ACTIONABLE INFERENCE FUNCTION (TESTING ON A NEW PR)
# =====================================================================
# We select the final trained Ensemble pipelines to do our actual business predictions
# We use the winning models for production
chosen_clf_pipeline = classifiers["Gradient Boosting"]
chosen_reg_pipeline = regressors["Gradient Boosting Regressor"]

def evaluate_production_pr(new_pr_input, timeline_deadline_str=None):
    """
    Takes a new Purchase Requisition dictionary and outputs business recommendations.
    """
    single_row_df = pd.DataFrame([new_pr_input])
    
    # 1. Predict Classification Priority
    predicted_class_id = chosen_clf_pipeline.predict(single_row_df)[0]
    priority_output = target_names[predicted_class_id]
    
    # 2. Predict Sourcing and Turnaround Cycle Length
    predicted_internal_sourcing_days = int(np.ceil(chosen_reg_pipeline.predict(single_row_df)[0]))
    total_fulfillment_days = predicted_internal_sourcing_days + int(new_pr_input[lead_time_col])
    
    # 3. Calculate Objective 3: Completion Date if started right now
    current_time = pd.Timestamp.now()
    calculated_completion_date = current_time + pd.Timedelta(days=total_fulfillment_days)
    
    print("\n" + "#"*60)
    print("                LIVE ASSESSMENT INFERENCE REPORT               ")
    print("#"*60)
    print(f"Material Code  : {new_pr_input[mat_col]} | Description: {new_pr_input[desc_col]}")
    print("-" * 60)
    print(f"Objective 1 Result (PR Criticality)     : **{priority_output}**")
    print(f"Objective 3 Result (Completion Date)   : {calculated_completion_date.strftime('%d %B %Y')}")
    
    # 4. Calculate Objective 2: Backwards calculation for an ideal creation date
    if timeline_deadline_str:
        target_deadline = pd.to_datetime(timeline_deadline_str)
        approval_buffer = 5 # Standard padding buffer
        ideal_start_date = target_deadline - pd.Timedelta(days=total_fulfillment_days + approval_buffer)
        print(f"Objective 2 Result (Ideal Creation)    : {ideal_start_date.strftime('%d %B %Y')} (To hit deadline {target_deadline.strftime('%d %B %Y')})")
    print("#"*60 + "\n")


# --- SIMULATE NEW ARRIVING RAW PURCHASE TRANSACTION ---
# Using the dynamic column variables so it never breaks regardless of file format
test_case_pr = {
    pgroup_col: 'E1',
    mat_col: '423280050226',
    pr_qty_col: 50,
    lead_time_col: 45,
    rfq_rate_col: 1500.0,
    desc_col: 'DIODE RECT GEN P DO-201AD LINK II MOD III'
}

# Execute the test function specifying our target operational deadline
evaluate_production_pr(test_case_pr, timeline_deadline_str='2026-12-31')