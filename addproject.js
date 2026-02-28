
// AddProject.js - Final Refined Version
// Optimized for Large Datasets, Strict Validation, and Specific Preview Layout
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import axios from "axios";

// =====================
// MUI COMPONENTS
// =====================
import {
  Box, Typography, Button, Grid, Table, TableHead, TableRow, TableCell,
  TableBody, Checkbox, Snackbar, Alert, Tabs, Tab, Paper, TableContainer,
  Stack, Chip, FormControl, InputLabel, Select, MenuItem, LinearProgress,
  TablePagination, TextField, InputAdornment
} from "@mui/material";

// =====================
// MUI ICONS
// =====================
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StorageIcon from "@mui/icons-material/Storage";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";

// ==========================================
// 1. CENTRALIZED CONFIGURATION
// ==========================================
const APP_CONFIG = {
  UPLOAD_BATCH_SIZE: 50, // Limits rows per API call to prevent server timeout
  DISPLAY_COLUMNS: ["serialNo", "partNumber", "productionOrder", "quantity"],
  IGNORED_COLUMNS: [
    "SMT Status", "SAP Material issue", "Labour hour booking", 
    "Type", "id", "_id", "status", "__v", "createdAt", "updatedAt", "source", "type"
  ],
  PROJECT_TYPES: [
    { value: "HEXA", label: "HEXA" },
    { value: "OCTA", label: "OCTA" }
  ],
  FILTER_CATEGORIES: ["All", "HEXA-CHILD", "HEXA-MAIN", "OCTA-CHILD", "OCTA-MAIN"]
};

// Resolves the server address from Redux store or local fallback
const getApiBaseUrl = (configDetails) => {
  if (configDetails?.project?.[0]?.ServerIP?.[0]?.NodeServerIP) {
    return configDetails.project[0].ServerIP[0].NodeServerIP;
  }
  return "http://localhost:8082";
};

export default function AddProject() {
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  const API_BASE = getApiBaseUrl(configDetails);

  // --- STATE MANAGEMENT ---
  const [tab, setTab] = useState("upload");
  const [selectedType, setSelectedType] = useState(APP_CONFIG.PROJECT_TYPES[0].value);
  const [uploadSource, setUploadSource] = useState("");
  const [fileName, setFileName] = useState("");

  // --- DATA STORAGE ---
  const [fullPreviewData, setFullPreviewData] = useState([]); // Stores expanded Excel rows
  const [previewColumns, setPreviewColumns] = useState([]); // Dynamic columns from Excel
  const [serialColumn, setSerialColumn] = useState(""); // Stores detected serial key
  const [masterList, setMasterList] = useState([]); // "Yet To Assign" data
  const [inactiveList, setInactiveList] = useState([]); // "Yet To Start" data

  // --- UI & SEARCH ---
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [masterFilter, setMasterFilter] = useState("All");
  const [inactiveFilter, setInactiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMasterIds, setSelectedMasterIds] = useState([]); // Multi-select tracking
  const [alert, setAlert] = useState({ open: false, msg: "", type: "error" });

  // --- PAGINATION ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const showAlert = (msg, type) => setAlert({ open: true, msg, type });

  // Reset pagination when switching tabs or filters to avoid out-of-bounds errors
  useEffect(() => { setPage(0); }, [tab, masterFilter, inactiveFilter]);

  // --- 1. DATA SYNCHRONIZATION ---
  const fetchAllData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/pcb/history`);
      const allData = res.data?.PcbData || [];
      const active = [];
      const inactive = [];

      allData.forEach((item, index) => {
        // Normalizes composite Type (e.g., HEXA-MAIN)
        const typeStr = item.Type || (item.type && item.source ? `${item.type}-${item.source}`.toUpperCase() : "UNKNOWN");
        const formatted = { ...item, id: item._id || `${item.serialNo}-${index}`, Type: typeStr };
        
        // Categorize based on backend status
        if (item.status === "Inaction" || item.status === "Assigned") {
          inactive.push(formatted);
        } else if (item.status === "New") {
          active.push(formatted);
        }
      });

      setMasterList(active);
      setInactiveList(inactive);
    } catch (err) { showAlert("Server Connection Error.", "error"); }
  };

  useEffect(() => { fetchAllData(); }, [API_BASE]);

  // --- 2. EXCEL PARSING & BREAKDOWN LOGIC ---
  const handleFileUpload = (e, source) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = new Uint8Array(evt.target.result);
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];

        // VALIDATION: Check first row title against selected project configuration
        const headerRaw = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
        const excelTitle = headerRaw && headerRaw[0] ? headerRaw[0].toString().toUpperCase().replace(/\s+/g, ' ').trim() : "";
        const expectedTerm = `${selectedType} ${source.toUpperCase()}`;

        if (!excelTitle.includes(expectedTerm)) {
          throw new Error(`Invalid File! Header must contain "${expectedTerm}". Found: "${excelTitle}"`);
        }

        // PARSING: Reads data starting from headers (Row 2)
        const json = XLSX.utils.sheet_to_json(ws, { range: 1, defval: "" });
        if (json.length === 0) throw new Error("Excel is empty below header row.");

        const firstRowKeys = Object.keys(json[0]);
        // Identify crucial columns by substring match to handle minor naming variations
        const sCol = firstRowKeys.find(c => c.toLowerCase().replace(/\s/g, "").includes("serial"));
        const qCol = firstRowKeys.find(c => c.toLowerCase().replace(/\s/g, "").includes("quantity"));

        if (!sCol) throw new Error("Serial Number column not detected. Please verify Excel headers.");

        const expanded = [];
        json.forEach((row, idx) => {
          const rawSerial = String(row[sCol] || "").trim();
          if (!rawSerial) return;

          const cleanSerial = rawSerial.replace(/\s/g, "");
          const qty = parseInt(row[qCol]) || 1;

          // LOGIC: Breakdown Serial Range (e.g., 100-105)
          if (cleanSerial.includes("-")) {
            const [start, end] = cleanSerial.split("-").map(v => parseInt(v, 10));
            if (isNaN(start) || isNaN(end) || start > end) throw new Error(`Invalid range: ${rawSerial} at Row ${idx + 2}`);
            for (let i = start; i <= end; i++) {
              expanded.push({ ...row, [sCol]: i.toString(), serialNo: i.toString(), quantity: 1, id: `EXP-${idx}-${i}` });
            }
          } 
          // LOGIC: Breakdown Quantity > 1 (starting from single numeric serial)
          else if (qty > 1) {
            const startSerial = parseInt(cleanSerial, 10);
            if (isNaN(startSerial)) throw new Error(`Quantity breakdown requires numeric serial at Row ${idx + 2}`);
            for (let i = 0; i < qty; i++) {
              const currentSerial = (startSerial + i).toString();
              expanded.push({ ...row, [sCol]: currentSerial, serialNo: currentSerial, quantity: 1, id: `QTY-${idx}-${i}` });
            }
          } 
          // LOGIC: Standard single entry
          else {
            expanded.push({ ...row, serialNo: rawSerial, quantity: 1, id: `ROW-${idx}` });
          }
        });

        setSerialColumn(sCol);
        setPreviewColumns(firstRowKeys.filter(k => !APP_CONFIG.IGNORED_COLUMNS.includes(k)));
        setFullPreviewData(expanded);
        setUploadSource(source);
        setFileName(file.name);
        setTab("preview");
        showAlert(`Successfully expanded to ${expanded.length} records.`, "success");

      } catch (err) { 
        showAlert(err.message, "error"); 
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null; // Clears input for re-uploading the same file
  };

  // --- 3. DATABASE SUBMISSION ---
  const saveToMaster = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Map internal rows to Backend Schema
    const payload = fullPreviewData.map(row => ({
      partNumber: row["partNumber"] || row["Part Number"] || row["partnumber"] || "UNKNOWN",
      serialNo: row.serialNo,
      PCBserialNoPartNumber: `${row.serialNo}$${row["partNumber"] || row["Part Number"] || "UNKNOWN"}`,
      productionOrder: row["productionOrder"] || row["Production order"] || row["productionorder"],
      quantity: 1,
      description: row["description"] || row["Description"] || "",
      userID: user?.id,
      userName: user?.username,
      Type: `${selectedType}-${uploadSource}`.toUpperCase(),
    }));

    try {
      const totalBatches = Math.ceil(payload.length / APP_CONFIG.UPLOAD_BATCH_SIZE);
      for (let i = 0; i < totalBatches; i++) {
        const batch = payload.slice(i * APP_CONFIG.UPLOAD_BATCH_SIZE, (i + 1) * APP_CONFIG.UPLOAD_BATCH_SIZE);
        await axios.post(`${API_BASE}/api/pcb/upload-bulk`, { type: selectedType, source: uploadSource, csvDataJSON: batch });
        setUploadProgress(Math.round(((i + 1) / totalBatches) * 100));
      }
      showAlert("Upload Successful.", "success");
      setTab("master");
      setFullPreviewData([]);
      fetchAllData();
    } catch (err) {
      showAlert("Upload Failed. Check network connection.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // --- 4. TABLE RENDER LOGIC ---
  const renderTable = (dataList, isMaster, filterVal, isPreview = false) => {
    // Filter data based on category and search query
    const categoryData = filterVal === "All" ? dataList : dataList.filter(d => d.Type === filterVal);
    const filtered = categoryData.filter(item => {
      const q = searchQuery.toLowerCase();
      return (
        item.serialNo?.toString().toLowerCase().includes(q) || 
        item.partNumber?.toString().toLowerCase().includes(q) || 
        (item["Part Number"]?.toString().toLowerCase().includes(q)) ||
        item.productionOrder?.toString().toLowerCase().includes(q) ||
        (item["Production order"]?.toString().toLowerCase().includes(q))
      );
    });

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Paper variant="outlined">
        <TableContainer sx={{ maxHeight: '65vh' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {/* Checkbox only for Master (Yet To Assign) tab */}
                {isMaster && !isPreview && <TableCell padding="checkbox" sx={{ bgcolor: '#f8f9fa' }} />}
                
                {/* Dynamically generated headers for Preview; Config-based for others */}
                {isPreview 
                  ? previewColumns.map(col => (<TableCell key={col} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>{col.toUpperCase()}</TableCell>))
                  : APP_CONFIG.DISPLAY_COLUMNS.map(col => (<TableCell key={col} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>{col.toUpperCase()}</TableCell>))
                }

                {/* Status and Action columns excluded from Preview tab */}
                {!isPreview && (
                  <>
                    <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>STATUS</TableCell>
                    {!isMaster && <TableCell align="center" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>ACTION</TableCell>}
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((row) => (
                <TableRow key={row.id} hover selected={selectedMasterIds.includes(row.id)}>
                  {isMaster && !isPreview && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedMasterIds.includes(row.id)} onChange={() => {
                        setSelectedMasterIds(prev => prev.includes(row.id) ? prev.filter(i => i !== row.id) : [...prev, row.id]);
                      }} />
                    </TableCell>
                  )}

                  {/* Cell Data Logic */}
                  {isPreview ? (
                    previewColumns.map(col => <TableCell key={col}>{row[col]}</TableCell>)
                  ) : (
                    <>
                      <TableCell>{row.serialNo}</TableCell>
                      <TableCell>{row.partNumber || row["Part Number"]}</TableCell>
                      <TableCell>{row.productionOrder || row["Production order"]}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                    </>
                  )}

                  {/* Action/Status Rendering logic (Skipped for Preview) */}
                  {!isPreview && (
                    <>
                      <TableCell>
                        <Chip 
                          label={row.status === "New" || !row.status ? "Yet To Assign" : "Yet To Start"} 
                          size="small" 
                          color={row.status === "New" || !row.status ? "primary" : "error"} 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      {!isMaster && (
                        <TableCell align="center">
                          <Button size="small" variant="outlined" onClick={() => {
                            axios.put(`${API_BASE}/api/pcb/update-status`, { 
                              type: row.Type.split("-")[0], 
                              serialNos: [row.PCBserialNoPartNumber], 
                              status: "New" 
                            }).then(() => fetchAllData());
                          }}>Restore</Button>
                        </TableCell>
                      )}
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
      </Paper>
    );
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#f4f6f8', minHeight: '100vh', p: 3 }}>
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        {/* TOP NAVIGATION TABS */}
        <Tabs value={tab} onChange={(e, v) => setTab(v)} indicatorColor="primary" textColor="primary">
          <Tab label="Import" value="upload" icon={<CloudUploadIcon />} iconPosition="start" />
          <Tab label="Preview" value="preview" icon={<AddIcon />} iconPosition="start" disabled={!fullPreviewData.length} />
          <Tab label={`Yet To Assign (${masterList.length})`} value="master" icon={<StorageIcon />} iconPosition="start" />
          <Tab label={`Yet To Start (${inactiveList.length})`} value="inaction" icon={<BlockIcon />} iconPosition="start" />
        </Tabs>

        {/* TAB 1: UPLOAD SCREEN */}
        {tab === "upload" && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <FormControl sx={{ minWidth: 250, mb: 4 }}>
              <InputLabel>Project Type</InputLabel>
              <Select value={selectedType} label="Project Type" onChange={(e) => setSelectedType(e.target.value)}>
                {APP_CONFIG.PROJECT_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={3} justifyContent="center">
              {["child", "main"].map(src => (
                <Box key={src} component="label" sx={{ flex: 1, maxWidth: 300, border: '2px dashed #ccc', p: 4, borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f0f7ff', borderColor: 'primary.main' } }}>
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, src)} accept=".xlsx, .xls" />
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{src} Excel</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* TAB 2: PREVIEW SCREEN (No Status/Action Columns) */}
        {tab === "preview" && (
          <Box sx={{ p: 2 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}><Typography variant="subtitle2">Total Breakdown: <strong>{fullPreviewData.length}</strong></Typography></Grid>
                <Grid item xs={3}><Typography variant="subtitle2">Start Serial: <strong>{fullPreviewData[0]?.serialNo}</strong></Typography></Grid>
                <Grid item xs={3}><Typography variant="subtitle2">End Serial: <strong>{fullPreviewData[fullPreviewData.length - 1]?.serialNo}</strong></Typography></Grid>
                <Grid item xs={3} align="right">
                  <Button variant="contained" onClick={saveToMaster} disabled={isUploading}>{isUploading ? "Uploading..." : "Save to DB"}</Button>
                </Grid>
              </Grid>
            </Paper>
            {isUploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />}
            {renderTable(fullPreviewData, false, "All", true)}
          </Box>
        )}

        {/* TAB 3 & 4: DATABASE VIEWS */}
        {(tab === "master" || tab === "inaction") && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select value={tab === "master" ? masterFilter : inactiveFilter} onChange={(e) => tab === "master" ? setMasterFilter(e.target.value) : setInactiveFilter(e.target.value)}>
                  {APP_CONFIG.FILTER_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField 
                size="small" 
                placeholder="Search Serial / Part / Production Number..." 
                fullWidth 
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} /> }} 
              />
              {tab === "master" && (
                <Button variant="contained" color="warning" disabled={!selectedMasterIds.length} onClick={() => {
                  const selected = masterList.filter(item => selectedMasterIds.includes(item.id));
                  const serials = selected.map(i => i.PCBserialNoPartNumber);
                  axios.put(`${API_BASE}/api/pcb/update-status`, { type: selectedType, serialNos: serials, status: "Inaction" }).then(() => { 
                    fetchAllData(); setSelectedMasterIds([]); setTab("inaction"); 
                  });
                }} sx={{ minWidth: 150 }}>Assign</Button>
              )}
            </Stack>
            {renderTable(tab === "master" ? masterList : inactiveList, tab === "master", tab === "master" ? masterFilter : inactiveFilter)}
          </Box>
        )}
      </Paper>
      <Snackbar open={alert.open} autoHideDuration={5000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.type}>{alert.msg}</Alert>
      </Snackbar>
    </Box>
  );
}






















































Good 👍 you gave both versions — this makes it much easier.

Your **frontend is not crashing**.
The **500 error is coming from backend** during upload.

The problem is in this part of your **NEW saveToMaster()**:

```js
const payload = fullPreviewData.map(row => ({
  partNumber: row["partNumber"] || row["Part Number"] || row["partnumber"] || "UNKNOWN",
  serialNo: row.serialNo,
  PCBserialNoPartNumber: `${row.serialNo}$${row["partNumber"] || row["Part Number"] || "UNKNOWN"}`,
  productionOrder: row["productionOrder"] || row["Production order"] || row["productionorder"],
  quantity: 1,
  description: row["description"] || row["Description"] || "",
  userID: user?.id,
  userName: user?.username,
  Type: `${selectedType}-${uploadSource}`.toUpperCase(),
}));
```

---

# 🔴 What Is Wrong?

### ❌ 1. You Removed Duplicate Protection (VERY IMPORTANT)

In OLD working code you had:

```js
const processedMap = new Map();

processedMap.set(sNo, { ... });
const cleanPayload = Array.from(processedMap.values());
```

That means:

* Same serial number → only one record saved
* No duplicate `PCBserialNoPartNumber`

---

### 🚨 In New Code

You are directly doing:

```js
fullPreviewData.map(...)
```

So if:

* Excel has duplicate serials
* Quantity expansion creates duplicates
* Range overlaps
* User uploads same file twice

Then backend receives duplicate `PCBserialNoPartNumber`.

If your Mongo schema has:

```js
PCBserialNoPartNumber: { type: String, unique: true }
```

Then Mongo throws:

```
E11000 duplicate key error
```

Which becomes:

```
500 Internal Server Error
```

---

# ❌ 2. You Removed Safe Column Finder Logic

Old version had this powerful logic:

```js
const findValue = (keys) => {
  const rowKeys = Object.keys(row);
  const match = rowKeys.find(k => 
    keys.includes(k.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );
  return match ? row[match] : null;
};
```

That handled:

* `Part Number`
* `part_number`
* `PartNumber`
* `PART NUMBER`

Your new version only checks:

```js
row["partNumber"] || row["Part Number"]
```

If Excel column is slightly different →
`partNumber` becomes `"UNKNOWN"`.

Then this line becomes dangerous:

```js
PCBserialNoPartNumber: `${row.serialNo}$UNKNOWN`
```

Now many records become:

```
1001$UNKNOWN
1002$UNKNOWN
1003$UNKNOWN
```

If serial is same → duplicate crash.

---

# ❌ 3. You Removed These Fields

Old working code sent:

```js
userRole
userSBU
userSBUDIV
```

If backend now expects those fields →
it may throw validation error → 500.

---

# ❌ 4. Assign Button Wrong Type (Another Hidden Bug)

In new code:

```js
axios.put(`${API_BASE}/api/pcb/update-status`, { 
  type: selectedType,   // ❌ WRONG
  serialNos: serials, 
  status: "Inaction" 
})
```

Old working code grouped by actual type:

```js
const type = item.Type.includes("HEXA") ? "HEXA" : "OCTA";
```

Now if you select mixed HEXA + OCTA records
you send wrong type → backend may fail.

---

# 🎯 MAIN ROOT CAUSE (99% sure)

This is the real issue:

> You removed the Map-based deduplication logic.

That causes Mongo duplicate key error → 500.

---

# ✅ PROPER FIX

Replace your new saveToMaster with this safer version:

```js
const saveToMaster = async () => {
  setIsUploading(true);
  setUploadProgress(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const processedMap = new Map();

  fullPreviewData.forEach((row) => {
    const part =
      row["partNumber"] ||
      row["Part Number"] ||
      row["partnumber"] ||
      "UNKNOWN";

    const serial = row.serialNo;
    if (!serial) return;

    const key = `${serial}$${part}`;

    if (!processedMap.has(key)) {
      processedMap.set(key, {
        partNumber: part,
        serialNo: serial,
        PCBserialNoPartNumber: key,
        productionOrder:
          row["productionOrder"] ||
          row["Production order"] ||
          row["productionorder"],
        quantity: 1,
        description:
          row["description"] ||
          row["Description"] ||
          "",
        userID: user?.id,
        userName: user?.username,
        Type: `${selectedType}-${uploadSource}`.toUpperCase(),
      });
    }
  });

  const payload = Array.from(processedMap.values());

  try {
    const totalBatches = Math.ceil(payload.length / APP_CONFIG.UPLOAD_BATCH_SIZE);

    for (let i = 0; i < totalBatches; i++) {
      const batch = payload.slice(
        i * APP_CONFIG.UPLOAD_BATCH_SIZE,
        (i + 1) * APP_CONFIG.UPLOAD_BATCH_SIZE
      );

      await axios.post(`${API_BASE}/api/pcb/upload-bulk`, {
        type: selectedType,
        source: uploadSource,
        csvDataJSON: batch,
      });

      setUploadProgress(
        Math.round(((i + 1) / totalBatches) * 100)
      );
    }

    showAlert("Upload Successful.", "success");
    setTab("master");
    setFullPreviewData([]);
    fetchAllData();

  } catch (err) {
    console.error(err.response?.data || err.message);
    showAlert("Upload Failed. Check server logs.", "error");
  } finally {
    setIsUploading(false);
  }
};
```

---

# 🔍 How To Confirm

Open browser console and check:

```js
console.log(err.response?.data)
```

If you see:

```
E11000 duplicate key error
```

Then yes — duplicate key was the cause.

---

# 🧠 Why Old Code Worked

Because:

* It removed duplicates
* It normalized column names
* It grouped types correctly
* It handled large data safely

---

If you want, send me:

* The exact 500 error from backend console
* Your Mongo schema for PCB

Then I’ll pinpoint it 100% accurately.






























































































  

/**
 * Component: TaskTabsView
 * Description: Displays the tabs for different process steps and the table of PCBs.
 * Enhanced with safety checks to prevent crashes when tasks are empty.
 */
const TaskTabsView = ({ currentUser, tableData = [], AllData = [], onOpenForm, onTriggerRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Logic for Handlers ---
  const handleStartClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: (row.currentStepId || 1) - 1, // Safe fallback for calculation
      stageName: row.currentProcessName || "Unknown Stage",
      ...row,
    };
    if (onTriggerRefresh) onTriggerRefresh();
    onOpenForm(formData, AllData.filter(item => item.currentStepId == row.currentStepId), 'Start');
  };

  const handleCompleteClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: (row.currentStepId || 1) - 1, // Safe fallback for calculation
      stageName: row.currentProcessName || "Unknown Stage",
      ...row
    };
    onOpenForm(formData, AllData.filter(item => item.currentStepId == row.currentStepId), 'complete');
  };

  // Memoized grouping logic to avoid unnecessary re-renders
  const groupedTasks = useMemo(() => {
    const groups = {};
    // Safely iterate through the master tableData (the steps this operator is qualified for)
    if (tableData && tableData.length > 0) {
      tableData.forEach((task) => {
        const id = task.flowStepId;
        if (!groups[id]) {
          groups[id] = { 
            processName: task.processName || `Step ${id}`, 
            count: 0, 
            hasStarted: false 
          };
        }
      });
    }

    // Tally actual PCB counts from the AllData array
    if (AllData && AllData.length > 0) {
      AllData.forEach((item) => {
        if (item.currentStepId && groups[item.currentStepId]) {
          groups[item.currentStepId].count++;
          // Check if any specific unit in this group is already "Started"
          const activeTask = item.tasks?.find(t => t.flowStepId === item.currentStepId);
          if (["STARTED", "Start", "In Progress"].includes(activeTask?.status)) {
            groups[item.currentStepId].hasStarted = true;
          }
        }
      });
    }
    return groups;
  }, [tableData, AllData]);
  
  const stepIds = Object.keys(groupedTasks).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Handling layout splits for many tabs
  const MAX_LEFT = 10;
  const leftSideIds = stepIds.slice(0, MAX_LEFT);
  const rightSideIds = stepIds.length > MAX_LEFT ? stepIds.slice(MAX_LEFT) : [];

  const activeStepId = stepIds[activeTab];
  
  // Filter current stage data + search term safety
  const FilteredData = useMemo(() => {
    if (!activeStepId) return [];
    return AllData.filter(item => {
      const matchesStage = item.currentStepId == activeStepId;
      const matchesSearch = item.serialNo?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [AllData, activeStepId, searchTerm]);
  
  const getChipColor = (group) => {
    if (group.hasStarted) return "#ed6c02"; // Orange for In-Progress
    if (group.count > 0) return "#d32f2f";  // Red for Queued
    return "#2e7d32";                       // Green for Clear
  };

  const renderTabButton = (id) => {
    const index = stepIds.indexOf(id);
    const isActive = activeTab === index;
    const group = groupedTasks[id];
    return (
      <Card
        key={id}
        onClick={() => { setActiveTab(index); setPage(0); setSearchTerm(""); }}
        elevation={0}
        sx={{
          p: 1.5, mb: 1, cursor: 'pointer', borderRadius: 2,
          border: '1px solid',
          borderColor: isActive ? UI_THEME.primary : '#e2e8f0',
          bgcolor: isActive ? '#f0f7ff' : '#ffffff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          transition: 'all 0.2s ease',
          "&:hover": { borderColor: UI_THEME.primary, bgcolor: '#f8fafc' }
        }}
      >
        <Typography sx={{ 
          fontWeight: isActive ? 700 : 500, 
          fontSize: '0.75rem', 
          color: isActive ? UI_THEME.primary : '#475569',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: 1.2,
          pr: 1
        }}>
          {group.processName.toUpperCase()}
        </Typography>
        <Chip label={group.count} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: getChipColor(group), color: 'white', fontWeight: 'bold' }} />
      </Card>
    );
  };

  // --- CRITICAL: BLANK PAGE PROTECTION ---
  if (stepIds.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
        <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom>
          No Tasks Assigned
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You are not currently qualified for the stages assigned to these PCBs.
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          (System Note: Check Operator Step Mapping for stages 16-43)
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Centered Title Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -0.5 }}>
          {groupedTasks[activeStepId]?.processName.toUpperCase() || "SELECT A STAGE"}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
                Total Units: <b>{FilteredData.length}</b>
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Stack direction="row" spacing={1.5} alignItems="center">
                {[['#d32f2f', 'Queued'], ['#ed6c02', 'Started'], ['#2e7d32', 'Clear']].map(([color, label]) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{label}</Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
      </Box>

      {/* Modern Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: '4px 12px', display: 'flex', alignItems: 'center', width: 450,
            border: '2px solid #e2e8f0', borderRadius: '12px',
            bgcolor: '#ffffff', '&:focus-within': { borderColor: UI_THEME.primary, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)' }
          }}
        >
          <VisibilityIcon sx={{ color: '#94a3b8', mr: 1 }} />
          <input
            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px', fontSize: '1rem', fontWeight: '500' }}
            placeholder="Enter Serial Number to filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Paper>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={2.5}>
          <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 0.5 }}>
            {leftSideIds.map(id => renderTabButton(id))}
          </Box>
        </Grid>

        <Grid item xs={12} md={rightSideIds.length > 0 ? 7 : 9.5}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: '800', fontSize: '0.85rem' }}>SNO</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: '800', fontSize: '0.85rem' }}>PCB SERIAL</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: '800', fontSize: '0.85rem' }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: '800', fontSize: '0.85rem' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {FilteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  // SAFETY CHECK: row.tasks could be empty or undefined
                  const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);
                  const status = activeTask?.status || "Pending";
                  const isDone = status === "Completed";
                  const isStarted = ["STARTED", "Start", "In Progress"].includes(status);
                  const isLocked = row.canExecute === true;
                  const canComplete = isStarted && !isDone && !isLocked;
                  
                  // Check if logs exist safely
                  const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
                  const isLogFilled = logLength > 0;

                  return (
                    <TableRow key={row.serialNo || index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{(page * rowsPerPage) + index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{row.serialNo}</TableCell>
                      <TableCell>
                        <Chip 
                          label={status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 700, height: 22, fontSize: '0.65rem',
                            bgcolor: isDone ? '#dcfce7' : isStarted ? '#fef3c7' : '#f1f5f9',
                            color: isDone ? '#166534' : isStarted ? '#b45309' : '#475569',
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button 
                            variant={isStarted ? "text" : "contained"} 
                            size="small" 
                            sx={{ fontWeight: 'bold', textTransform: 'none', borderRadius: 1.5 }}
                            disabled={isLogFilled || isLocked || isDone}
                            onClick={() => handleStartClick(row)}
                          >
                            {isStarted ? "Started" : "Start"}
                          </Button>
                          <Button 
                            variant={isDone ? "outlined" : "contained"} 
                            color={isDone ? "inherit" : "success"}
                            size="small" 
                            sx={{ fontWeight: 'bold', textTransform: 'none', borderRadius: 1.5 }}
                            disabled={!canComplete && !isDone}
                            onClick={() => handleCompleteClick(row)}
                          >
                            {isDone ? "View Log" : "Execute"}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={FilteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </TableContainer>
        </Grid>

        {rightSideIds.length > 0 && (
          <Grid item xs={12} md={2.5}>
            <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pl: 0.5 }}>
              {rightSideIds.map(id => renderTabButton(id))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

