


// AddProject.js - Version with Pre-Save Duplicate Validation and Breakdown Fix
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
// 1. CONFIGURATION
// ==========================================
const APP_CONFIG = {
  UPLOAD_BATCH_SIZE: 50, 
  DISPLAY_COLUMNS: ["serialNo", "partNumber", "productionOrder", "quantity"],
  IGNORED_COLUMNS: [
    "Quantity","Sl No.",
    "SMT Status", "SAP Material issue", "Labour hour booking", 
    "Type", "id", "_id", "status", "__v", "createdAt", "updatedAt", "source", "type"
  ],
  PROJECT_TYPES: [
    { value: "HEXA", label: "HEXA" },
    { value: "OCTA", label: "OCTA" }
  ],
  FILTER_CATEGORIES: ["All", "HEXA-CHILD", "HEXA-MAIN", "OCTA-CHILD", "OCTA-MAIN"]
};

const getApiBaseUrl = (configDetails) => {
  if (configDetails?.project?.[0]?.ServerIP?.[0]?.NodeServerIP) {
    return configDetails.project[0].ServerIP[0].NodeServerIP;
  }
  return "http://localhost:8082";
};

export default function AddProject() {
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  const API_BASE = getApiBaseUrl(configDetails);

  // --- STATE ---
  const [tab, setTab] = useState("upload");
  const [selectedType, setSelectedType] = useState(APP_CONFIG.PROJECT_TYPES[0].value);
  const [uploadSource, setUploadSource] = useState("");
  const [fileName, setFileName] = useState("");

  // --- DATA STORAGE ---
  const [fullPreviewData, setFullPreviewData] = useState([]);
  const [previewColumns, setPreviewColumns] = useState([]);
  const [serialColumn, setSerialColumn] = useState("");
  const [masterList, setMasterList] = useState([]);
  const [inactiveList, setInactiveList] = useState([]);

  // --- UI & SEARCH ---
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [masterFilter, setMasterFilter] = useState("All");
  const [inactiveFilter, setInactiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMasterIds, setSelectedMasterIds] = useState([]);
  const [alert, setAlert] = useState({ open: false, msg: "", type: "error" });
  const [typeexcel,settypeexcel]=useState("")
  // --- PAGINATION ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const showAlert = (msg, type) => setAlert({ open: true, msg, type });

  useEffect(() => { setPage(0); }, [tab, masterFilter, inactiveFilter]);

  // --- 1. FETCH DATA ---
  const fetchAllData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/pcb/history`);
      const allData = res.data?.PcbData || [];
      const active = [];
      const inactive = [];

      allData.forEach((item, index) => {
        const typeStr = item.Type || (item.type && item.source ? `${item.type}-${item.source}`.toUpperCase() : "UNKNOWN");
        const formatted = { ...item, id: item._id || `${item.serialNo}-${index}`, Type: typeStr };
        if (item.status === "Inaction" || item.status === "Assigned") {
          inactive.push(formatted);
        } else if (item.status === "New") {
          active.push(formatted);
        }
      });
      setMasterList(active);
      setInactiveList(inactive);
    } catch (err) { showAlert("Sync Error.", "error"); }
  };

  useEffect(() => { fetchAllData(); }, [API_BASE]);

  // --- 2. EXCEL UPLOAD & BREAKDOWN LOGIC ---
  const handleFileUpload = (e, source) => {
    settypeexcel(source)
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = new Uint8Array(evt.target.result);
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];

        // Title Validation
        const headerRaw = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
        const excelTitle = headerRaw && headerRaw[0] ? headerRaw[0].toString().toUpperCase().trim() : "";
        const expected = `${selectedType} ${source.toUpperCase()}`;

        if (!excelTitle.includes(expected)) {
          throw new Error(`Title Mismatch! Header must contain "${expected}".`);
        }

        const json = XLSX.utils.sheet_to_json(ws, { range: 1, defval: "" });
        const firstRowKeys = Object.keys(json[0]);
        const sCol = firstRowKeys.find(c => c.toLowerCase().replace(/\s/g, "").includes("serial"));
        const qCol = firstRowKeys.find(c => c.toLowerCase().replace(/\s/g, "").includes("quantity"));

        if (!sCol) throw new Error("Serial Column not detected.");

        const expanded = [];
        json.forEach((row, idx) => {
          const rawSerial = String(row[sCol] || "").trim();
          const qty = parseInt(row[qCol]) || 1;
          if (!rawSerial) return;

          const cleanSerial = rawSerial.replace(/\s/g, "");

          // BREAKDOWN: Handles "-" Delimiter
          if (cleanSerial.includes("-")) {
            const [start, end] = cleanSerial.split("-").map(v => parseInt(v.trim(), 10));
            if (isNaN(start) || isNaN(end) || start > end) throw new Error(`Invalid range at Row ${idx + 2}`);
            for (let i = start; i <= end; i++) {
              expanded.push({ 
                ...row, 
                [sCol]: i.toString(), 
                serialNo: i.toString(), 
                quantity: 1, // Fix: Each unit in breakdown is qty 1
                id: `EXP-${idx}-${i}` 
              });
            }
          } 
          // BREAKDOWN: Handle Quantity > 1 without delimiter
          else if (qty > 1) {
            const startNum = parseInt(cleanSerial, 10);
            for (let i = 0; i < qty; i++) {
              const currentSNo = (startNum + i).toString();
              expanded.push({ 
                ...row, 
                [sCol]: currentSNo, 
                serialNo: currentSNo, 
                quantity: 1, // Fix: Each unit in breakdown is qty 1
                id: `QTY-${idx}-${i}` 
              });
            }
          } 
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
        showAlert(`Parsed ${expanded.length} total PCBs.`, "success");
      } catch (err) { showAlert(err.message, "error"); }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  // --- 3. SAVE TO MASTER (WITH DUPLICATE VALIDATION) ---
  const saveToMaster = async () => {
    // PRE-SAVE VALIDATION: Check for duplicates within the uploaded file
    const seenInFile = new Set();
    const duplicates = [];

    fullPreviewData.forEach(row => {
      if (seenInFile.has(row.serialNo)) {
        duplicates.push(row.serialNo);
      }
      seenInFile.add(row.serialNo);
    });

    if (duplicates.length > 0) {
      return showAlert(`Duplicate Serials found in file: ${duplicates.slice(0, 3).join(", ")}...`, "error");
    }

    setIsUploading(true);
    setUploadProgress(0);
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Prepare final payload for Backend
    const payload = fullPreviewData.map(row => ({
      partNumber: row["partNumber"] || row["Part Number"] || row["partnumber"] || "UNKNOWN",
      serialNo: row.serialNo,
      PCBserialNoPartNumber: `${row.serialNo}$${row["partNumber"] || row["Part Number"] || "UNKNOWN"}`,
      productionOrder: row["productionOrder"] || row["Production order"] || row["productionorder"] || "",
      quantity: 1, // Strictly 1 for individual records
      description: row["description"] || row["Description"] || "",
      userID: user?.id,
      userName: user?.username,
      userRole: user?.userRole,
      userSBU: user?.sbu,
      userSBUDIV: user?.subdivision,
      Type: `${selectedType}-${uploadSource}`.toUpperCase(),
      status: "New"
    }));

    try {
      const totalBatches = Math.ceil(payload.length / APP_CONFIG.UPLOAD_BATCH_SIZE);
      for (let i = 0; i < totalBatches; i++) {
        const batch = payload.slice(i * APP_CONFIG.UPLOAD_BATCH_SIZE, (i + 1) * APP_CONFIG.UPLOAD_BATCH_SIZE);
        await axios.post(`${API_BASE}/api/pcb/upload-bulk`, { 
          type: selectedType, 
          source: uploadSource, 
          csvDataJSON: batch 
        });
        setUploadProgress(Math.round(((i + 1) / totalBatches) * 100));
      }
      setTab("master");
      setFullPreviewData([]);
      fetchAllData();
      showAlert("Upload Successful.", "success");
    } catch (err) { 
        const serverMsg = err.response?.data?.message || "Internal Server Error (500).";
        showAlert(serverMsg, "error"); 
    }
    finally { setIsUploading(false); }
  };

  // --- 4. SELECTION HELPERS ---
  const handleSelectGroup = (isChecked, pageData) => {
    const pageIds = pageData.map(r => r.id);
    setSelectedMasterIds(prev => isChecked ? [...new Set([...prev, ...pageIds])] : prev.filter(id => !pageIds.includes(id)));
  };

  const pushToInactive = () => {
    const selected = masterList.filter(item => selectedMasterIds.includes(item.id));
    const serials = selected.map(i => i.PCBserialNoPartNumber);
    console.log("serials: ",serials)
    axios.put(`${API_BASE}/api/pcb/update-status`, { serialNos: serials, status: "Inaction" })
      .then(() => { fetchAllData(); setSelectedMasterIds([]); setTab("inaction"); });
  };

  // --- 5. TABLE RENDERER ---
  const renderTable = (dataList, isMaster, filterVal, isPreview = false) => {
    const categoryData = filterVal === "All" ? dataList : dataList.filter(d => d.Type === filterVal);
    const filtered = categoryData.filter(item => {
      const q = searchQuery.toLowerCase();
      return (item.serialNo?.toString().toLowerCase().includes(q) || item.partNumber?.toString().toLowerCase().includes(q));
    });
    
    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const allOnPageSelected = paginated.length > 0 && paginated.every(r => selectedMasterIds.includes(r.id));

    return (
      <Paper variant="outlined">
        <Box sx={{ p: 1, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* {console.log("category data: ",filterVal)} */}
            { isPreview && <Typography  sx={{ fontWeight: 'bold',fontSize:"1rem"}}>TYPE: {selectedType} {typeexcel.toUpperCase()}</Typography>}
            {isMaster && !isPreview && (
              <Stack direction="row" spacing={1} alignItems="center" >
                <Checkbox size="medium" checked={allOnPageSelected} onChange={(e) => handleSelectGroup(e.target.checked, paginated)} />
                <Typography variant="body2"  sx={{fontWeight:'bold'}}>SELECT ALL IN CURRENT PAGE</Typography>
                
              </Stack>
            )}
        </Box>

        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {isMaster && !isPreview && <TableCell padding="checkbox" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}} />}
                {(isPreview ? previewColumns : APP_CONFIG.DISPLAY_COLUMNS).map(col => (
                  // console.log("previewColumns: ",col),
                  <TableCell key={col} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>{col.toUpperCase()}</TableCell>
                ))}
                {!isPreview && <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>STATUS</TableCell>}
                {tab === "inaction" && <TableCell align="center" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>ACTION</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((row) => (
                <TableRow key={row.id} hover>
                  {isMaster && !isPreview && (
                    <TableCell padding="checkbox" sx={{opacity:0.8,fontWeight:600}}>
                      <Checkbox checked={selectedMasterIds.includes(row.id)} onChange={() => {
                        setSelectedMasterIds(prev => prev.includes(row.id) ? prev.filter(i => i !== row.id) : [...prev, row.id]);
                      }} />
                    </TableCell>
                  )}
                  {isPreview ? previewColumns.map(col => <TableCell key={col}>{row[col]}</TableCell>) : (
                    <>
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{row.serialNo}</TableCell>
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{row.partNumber || row["Part Number"]}</TableCell>
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{row.productionOrder || row["Production order"]}</TableCell>
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{row.quantity}</TableCell>
                    </>
                  )}
                  {!isPreview && (
                    <TableCell sx={{opacity:0.8,fontWeight:600}}>
                      <Chip label={row.status === "New" ? "Yet To Assign" : "Yet To Start"} size="small" color={row.status === "New" ? "primary" : "error"} />
                    </TableCell>
                  )}
                  {tab === "inaction" && (
                    <TableCell align="center" sx={{opacity:0.8,fontWeight:600}}>
                      {/* {console.log("inactive: ",row.status)} */}
                      {row.status === "Assigned"?(<Button disabled size="medium" variant="contained" sx={{width:"fit-content"}} >Assigned</Button>):(



<Button size="medium" variant="contained" sx={{width:"fit-content"}} onClick={() => {
  axios.put(`${API_BASE}/api/pcb/update-status`, { serialNos: [row.PCBserialNoPartNumber], status: "New" }).then(() => fetchAllData());
}}>Restore</Button>
                      )}
                    
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(e, p) => {setPage(p)
         setSelectedMasterIds([])
         }} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
      </Paper>
    );
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#f4f6f8', minHeight: '100vh', p: 3 }}>
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} indicatorColor="primary" textColor="primary">
          <Tab label="Import" value="upload" icon={<CloudUploadIcon />} iconPosition="start" />
          <Tab label="Preview" value="preview" icon={<AddIcon />} iconPosition="start" disabled={!fullPreviewData.length} />
          <Tab label={`Yet To Assign (${masterList.length})`} value="master" icon={<StorageIcon />} iconPosition="start" />
          <Tab label={`Yet To Start (${inactiveList.length})`} value="inaction" icon={<BlockIcon />} iconPosition="start" />
        </Tabs>

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
                <Box key={src} component="label" sx={{ flex: 1, maxWidth: 300, border: '2px dashed #ccc', p: 4, borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f0f7ff' } }}>
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, src)} accept=".xlsx, .xls" />
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{src} Excel</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {tab === "preview" && (
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography sx={{fontWeight:"500",color:"black"}}>Total Records Found: <strong>{fullPreviewData.length}</strong></Typography>
              <Button variant="contained" sx={{width:"fit-content"}} onClick={saveToMaster} disabled={isUploading}>{isUploading ? "Uploading..." : "Proceed To Production"}</Button>
            </Stack>
            {isUploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />}
            {renderTable(fullPreviewData, false, "All", true)}
          </Box>
        )}

        {(tab === "master" || tab === "inaction") && (
          <Box sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
          >
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={tab === "master" ? masterFilter : inactiveFilter}
                onChange={(e) =>
                  tab === "master" ? setMasterFilter(e.target.value) : setInactiveFilter(e.target.value)
                }
              >
                {APP_CONFIG.FILTER_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Search..."
                fullWidth={false} // Make TextField smaller
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} /> }}
              />
              {tab === "master" && (
                <Button
                  variant="contained"
                  color="warning"
                  disabled={!selectedMasterIds.length}
                  onClick={pushToInactive}
                  sx={{ width: 200 }}
                >
                  Assign ({selectedMasterIds.length})
                </Button>
              )}
            </Stack>
          </Stack>
          {renderTable(
            tab === "master" ? masterList : inactiveList,
            tab === "master",
            tab === "master" ? masterFilter : inactiveFilter
          )}
        </Box>
        )}
      </Paper>
      <Snackbar open={alert.open} autoHideDuration={5000} onClose={() => setAlert({ ...alert, open: false })}><Alert severity={alert.type}>{alert.msg}</Alert></Snackbar>
    </Box>
  );
}