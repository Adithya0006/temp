
# 🏭 PCB Manufacturing Process Management System

A React-based manufacturing workflow system supporting Admin, Supervisor, and Operator roles with offline fallbacks.

---

## 📁 Project Structure

```
src/
│
├── App.js
│
├── Admin/
│   ├── Dashboard/
│   │   ├── AdminDashboard.js
│   │   ├── AdminHeader.js
│   │   ├── HomeCards.js
│   │   ├── MasterView.js
│   │   ├── InActionView.js
│   │   ├── CreateProjectView.js
│   │   ├── PreviewView.js
│   │   ├── ProfileView.js
│   │
│   └── utils/
│       ├── excelReader.js
│       └── helpers.js
│
├── Supervisor/
│   ├── Dashboard/
│   │   ├── SupervisorDashboard.js
│   │   ├── SupervisorHeader.js
│   │   ├── SupervisorTabs.js
│   │   ├── InActionTab.js
│   │   ├── OperatorsTab.js
│   │   ├── CreateOperatorTab.js
│   │   ├── CompletedTab.js
│   │
│   └── Assignment/
│       ├── SupervisorAssignment.js
│       ├── AssignmentHeader.js
│       ├── OperationSelector.js
│       ├── OperatorSelector.js
│       ├── AddOperationBox.js
│       ├── AssignmentTable.js
│       └── assignmentHelpers.js
│
├── Operator/
│   ├── Dashboard/
│   │   ├── OperatorDashboard.js
│   │   ├── OperatorHeader.js
│   │   ├── OperatorTabs.js
│   │   ├── ProcessTable.js
│   │   ├── ActionButtons.js
│   │   ├── ConfirmDialog.js
│   │   ├── ProcessFormDialog.js
│   │
│   └── ProcessForms/
│       ├── api.js
│       ├── formConfigs.js
│       ├── ProcessForm.js
│       ├── ProcessFormPage.js
│       └── useProcessForm.js
│
├── UnifiedLogin.js
└── index.js
```

---

## 🔑 User Roles

### Admin
- Upload PCBs by Excel
- Maintain master list
- Move PCBs to production

### Supervisor
- Assign operations and operators
- View production progress
- Create operators

### Operator
- Execute operations
- Fill process forms
- Update status

---

## ⚙️ App.js
Main controller that decides which dashboard to show based on role. Holds global PCB state and routes accordingly.

---

## 👨‍💼 Admin Module

| File | Description |
|------|-------------|
| AdminDashboard.js | Main controller |
| AdminHeader.js | Header UI |
| HomeCards.js | Home screen cards |
| MasterView.js | Master PCB list |
| InActionView.js | Production list |
| CreateProjectView.js | Upload Excel |
| PreviewView.js | Edit before save |
| ProfileView.js | Placeholder |

---

## 🧑‍💼 Supervisor Module

### Dashboard
Handles tabs & navigation across supervisor tasks.

### Assignment
Used to assign operations to PCBs and operators.

---

## 👷 Operator Module

Displays assigned PCBs and controls workflow of production via actions and forms.

---

## 🌐 Offline Support

Implemented in `useProcessForm.js`:
- Attempts API first
- Falls back to `formConfigs.js` if offline

---

## ▶️ Run Project

```bash
npm install
npm start
```

---

## 🔐 Dummy Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | 123 |
| Supervisor | sup1 | 123 |
| Operator | op1 | 123 |

---

## 🚀 Future Additions

- Cloud API integration
- Role-based access
- Excel exports
- Audit trails
