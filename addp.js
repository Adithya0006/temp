// AddProject.js - Refactored for clear Status Management

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Checkbox,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Paper,
  TableContainer,
  Stack,
  Divider,
  Chip,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";

// Icons for UI
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';
import BlockIcon from '@mui/icons-material/Block';
import SaveIcon from '@mui/icons-material/Save';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axios from "axios";

// ==========================================
// CONFIGURATION
// ==========================================
// API Endpoint for fetching and updating PCB data
const API_URL = "http://192.168.0.20:8082/api/pcb"; 

// Dropdown options for project types
const PROJECT_TYPES = [
  { value: "HEXA", label: "HEXA" },
  { value: "OCTA", label: "OCTA" }
];

// Categories used for filtering the Master/Inactive lists
const FILTER_CATEGORIES = [
  "All",
  "HEXA-CHILD",
  "HEXA-MAIN",
  "OCTA-CHILD",
  "OCTA-MAIN"
];

// Helper list to iterate over when "All" filter is selected
const ALL_CATEGORIES = [
  "HEXA-CHILD",
  "HEXA-MAIN",
  "OCTA-CHILD",
  "OCTA-MAIN"
];

// Columns to ignore during Excel processing
const IGNORED_COLUMNS = [
  "SMT Status", 
  "SAP Material issue", 
  "Labour hour booking",
  "Type", 
  "id", "_id", "status", "__v", "createdAt", "updatedAt", "source", "type"
];

export default function AddProject() {
  const theme = useTheme();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [tab, setTab] = useState("upload"); // Controls current view (Upload, Preview, Master, Inaction)
  
  // -- Upload States --
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0].value); // HEXA or OCTA
  const [uploadSource, setUploadSource] = useState(""); // "main" or "child"
  const [fileName, setFileName] = useState("");

  // -- Data States --
  const [previewRows, setPreviewRows] = useState([]); // Temporary rows from Excel before saving
  const [previewColumns, setPreviewColumns] = useState([]); // Columns detected in Excel
  const [masterList, setMasterList] = useState([]); // Active items (Status: New, WIP, etc.)
  const [inactiveList, setInactiveList] = useState([]); // Inactive items (Status: Inaction)
  
  // -- Filters --
  const [masterFilter, setMasterFilter] = useState("All");
  const [inactiveFilter, setInactiveFilter] = useState("All");

  // -- SELECTION STATE (NEW) --
  // Instead of changing the row's status to "Assigned", we just store the selected IDs here.
  // This keeps the UI selection separate from the actual Data status.
  const [selectedMasterIds, setSelectedMasterIds] = useState([]);

  // -- Helper State --
  const [serialColumn, setSerialColumn] = useState(""); // Auto-detected Serial Number column name
  const [alert, setAlert] = useState({ open: false, msg: "", type: "error" }); // Notification system

  // ==========================================
  // 1. FETCH DATA (The "Truth" Source)
  // ==========================================
  const fetchAllData = async () => {
    try {
      // Fetch both HEXA and OCTA data in parallel
      const [hexaRes, octaRes] = await Promise.all([
        axios.get(`${API_URL}/history`, { params: { type: "HEXA" } }),
        axios.get(`${API_URL}/history`, { params: { type: "OCTA" } })
      ]);

      const hexaData = hexaRes.data?.PcbData || [];
      const octaData = octaRes.data?.PcbData || [];
      
      // Combine raw data
      const rawData = [...hexaData, ...octaData];

      // DEDUPLICATE: Ensure we don't show the same serial number twice
      const uniqueMap = new Map();
      rawData.forEach((item) => {
        if (item.serialNo) {
          uniqueMap.set(item.serialNo, item);
        }
      });
      const allData = Array.from(uniqueMap.values());

      // Helper to normalize the "Type" field (e.g., HEXA-MAIN)
      const processItem = (item) => {
        let compositeType = item.Type;
        if (!compositeType && item.type && item.source) {
             compositeType = `${item.type}-${item.source}`.toUpperCase();
        }
        return compositeType || "UNKNOWN";
      };

      // SPLIT INTO TWO LISTS based on backend status
      // List 1: Master List (Everything NOT "Inaction")
      const activeItems = allData
        .filter((item) => item.status !== "Inaction")
        .map((item) => ({
          id: item.serialNo, 
          ...item,
          Type: processItem(item),
          // IMPORTANT: We keep the real status from the DB here! 
          // (No longer forcing "Not Assigned")
        }));
        
      // List 2: Inactive List (Only "Inaction")
      const inactiveItems = allData
        .filter((item) => item.status === "Inaction") 
        .map((item) => ({
          id: item.serialNo,
          ...item,
          Type: processItem(item),
        }));

      setMasterList(activeItems);
      setInactiveList(inactiveItems);
      setSelectedMasterIds([]); // Reset selection when data reloads

    } catch (err) {
      console.error("Fetch Error:", err);
      showAlert("Failed to load data from server.", "error");
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchAllData();
  }, []);

  // ==========================================
  // 2. EXCEL UPLOAD LOGIC
  // ==========================================
  const handleFileUpload = (e, source) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploadSource(source); 

    const reader = new FileReader();
    reader.onload = (evt) => {
      const buffer = new Uint8Array(evt.target.result);
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(ws);

      if (json.length === 0) {
        showAlert("Excel file is empty!", "error");
        return;
      }

      // Filter valid columns
      const originalCols = Object.keys(json[0]);
      const validCols = originalCols.filter(col => !IGNORED_COLUMNS.includes(col));
      setPreviewColumns(validCols);

      // Attempt to auto-detect the Serial Number column
      const serialCol = validCols.find(
        (c) => c.toLowerCase().replace(/\s+/g, "") === "serialnumber"
      );
      setSerialColumn(serialCol);

      // Create preview rows with unique temporary IDs
      const rows = json.map((row, i) => {
        const cleanRow = { id: Date.now() + "-" + i }; 
        validCols.forEach(col => {
            cleanRow[col] = row[col]; 
        });
        return cleanRow;
      });

      setPreviewRows(rows);
      setTab("preview"); // Switch to Preview tab
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null; // Reset input
  };

  // ==========================================
  // 3. PREVIEW & SAVE LOGIC
  // ==========================================
  const addRow = () => {
    const newRow = { id: Date.now() };
    previewColumns.forEach((c) => (newRow[c] = ""));
    setPreviewRows((p) => [...p, newRow]);
  };

  const deleteRow = (id) => {
    setPreviewRows((p) => p.filter((row) => row.id !== id));
  };

  const updateCell = (id, key, value) => {
    setPreviewRows((p) =>
      p.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const saveToMaster = () => {
    let user = JSON.parse(localStorage.getItem("user")); // Get current admin user
    const existingSerials = new Set(
      masterList.map((item) => String(item.serialNo || "").trim().toLowerCase())
    );

    let uniqueRows = [];
    let duplicateCount = 0;

    // Filter out duplicates against current Master List
    previewRows.forEach((r) => {
      const rawSerialValue = serialColumn ? r[serialColumn] : null;
      const checkSerial = String(rawSerialValue || "").trim().toLowerCase();

      if (!rawSerialValue || existingSerials.has(checkSerial)) {
        duplicateCount++;
      } else {
        uniqueRows.push({ ...r });
        existingSerials.add(checkSerial); 
      }
    });

    if (uniqueRows.length === 0) {
      if (duplicateCount > 0) showAlert(`All duplicates skipped.`, "warning");
      else showAlert("No valid data to save.", "info");
      return;
    }

    // Prepare payload for Backend
    const backendPayload = uniqueRows.map((row) => {
      // Helper to find loosely matching column names (e.g., "Part No" vs "partNumber")
      const findValue = (possibleHeaders) => {
        const keys = Object.keys(row);
        const match = keys.find(k => {
          const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, "");
          return possibleHeaders.some(h => cleanKey === h);
        });
        return match ? row[match] : null;
      };

      // Construct the composite Type (e.g., HEXA-CHILD)
      let Type = "UNKNOWN";
      if(selectedType === "HEXA" && uploadSource === "child") Type = "HEXA-CHILD";
      if(selectedType === "HEXA" && uploadSource === "main") Type = "HEXA-MAIN";
      if(selectedType === "OCTA" && uploadSource === "child") Type = "OCTA-CHILD";
      if(selectedType === "OCTA" && uploadSource === "main") Type = "OCTA-MAIN";

      return {
        partNumber: findValue(["partnumber", "partno", "pno", "model"]) || "UNKNOWN",
        serialNo: row[serialColumn] || findValue(["serialno", "serialnumber", "serial"]),
        // Creates a unique key like "SN123$PN456"
        PCBserialNoPartNumber: (row[serialColumn] || findValue(["serialno", "serialnumber", "serial"]))+"$"+(findValue(["partnumber", "partno", "pno", "model"]) || "UNKNOWN"),
        productionOrder: row["Production order"],
        quantity: row["Quantity"],
        description: row["Description"],
        userID: user?.id,
        userName: user?.username,
        userRole: user?.userRole,
        userSBU: user?.sbu,
        userSBUDIV: user?.subdivision,
        Type: Type,
      };
    });
    
    // Send to Backend
    axios.post(`${API_URL}/upload-bulk`, { 
        type: selectedType,    
        source: uploadSource,  
        csvDataJSON: backendPayload 
    })
      .then(() => {
        showAlert(`Successfully saved ${backendPayload.length} records.`, "success");
        setTab("master"); // Go to Master List
        setPreviewRows([]); 
        setUploadSource(""); 
        setFileName("");
        fetchAllData(); // Refresh list from DB
      })
      .catch((err) => {
        console.error(err);
        showAlert("Failed to save data to server.", "error");
      });
  };

  // ==========================================
  // 4. NEW SELECTION & STATUS LOGIC
  // ==========================================

  // Toggle Selection: Adds/Removes ID from the selectedMasterIds array
  const handleToggleSelect = (id) => {
    setSelectedMasterIds(prev => {
        if (prev.includes(id)) {
            return prev.filter(item => item !== id); // Uncheck
        } else {
            return [...prev, id]; // Check
        }
    });
  };

  // Select All Group: Adds all IDs in a specific category to selection
  const handleSelectGroup = (isChecked, categoryRows) => {
    const rowIds = categoryRows.map(r => r.id);
    
    setSelectedMasterIds(prev => {
        if (isChecked) {
            // Merge new IDs, avoiding duplicates
            const newSelection = [...prev];
            rowIds.forEach(id => {
                if (!newSelection.includes(id)) newSelection.push(id);
            });
            return newSelection;
        } else {
            // Filter out IDs from this category
            return prev.filter(id => !rowIds.includes(id));
        }
    });
  };

  // ACTION: Move Selected Items to Inaction List
  const pushToInactive = () => {
    if (selectedMasterIds.length === 0) return showAlert("Please select items first.", "warning");

    // 1. Identify items to move
    const selectedItems = masterList.filter(item => selectedMasterIds.includes(item.id));

    // 2. Group them by Type (API requirement)
    const groups = {};
    selectedItems.forEach(item => {
        const genericType = item.Type.includes("HEXA") ? "HEXA" : "OCTA";
        if (!groups[genericType]) groups[genericType] = [];
        groups[genericType].push(item.serialNo);
    });

    // 3. Send API Requests for each group
    const promises = Object.keys(groups).map(type => 
        axios.put(`${API_URL}/update-status`, { 
            type: type, 
            serialNos: groups[type], 
            status: "Inaction" 
        })
    );

    Promise.all(promises)
    .then(() => {
        // 4. Update UI Optimistically (Instant Feedback)
        const movedItems = selectedItems.map(item => ({ ...item, status: "Inaction" }));
        
        setInactiveList(prev => [...prev, ...movedItems]); // Add to Inactive
        setMasterList(prev => prev.filter(item => !selectedMasterIds.includes(item.id))); // Remove from Master
        
        setSelectedMasterIds([]); // Clear Checkboxes
        showAlert(`Moved ${selectedItems.length} items to Inaction List.`, "success");
        setTab("inaction"); // Jump to Inaction tab to show user
    })
    .catch(() => showAlert("Error updating status on server.", "error"));
  };

  // ACTION: Restore Item from Inaction -> Master
  const reassign = (id) => {
    const item = inactiveList.find((r) => r.id === id);
    if (!item) return;

    const type = item.Type.includes("HEXA") ? "HEXA" : "OCTA";

    axios.put(`${API_URL}/update-status`, { 
        type: type, 
        serialNos: [item.serialNo], 
        status: "New" // Reset status to New
    })
    .then(() => {
        // Optimistic Update
        const updated = { ...item, status: "New" };
        setMasterList((p) => [...p, updated]); // Add back to Master
        setInactiveList((p) => p.filter((r) => r.id !== id)); // Remove from Inactive
        showAlert("Item reassigned to Master Database.", "success");
        setTab("master"); // Jump back to Master tab
    })
    .catch(() => showAlert("Error reassigning item.", "error"));
  };

  // Helper: Returns color for the Status Chip
  const getStatusColor = (status) => {
      const s = (status || "").toLowerCase();
      if (s === "new") return "info";       // Blue
      if (s === "inaction") return "error"; // Red
      if (s === "completed") return "success"; // Green
      if (s === "wip") return "warning";    // Orange
      return "default"; // Grey
  };

  const showAlert = (msg, type) => setAlert({ open: true, msg, type });
  const handleTabChange = (e, v) => setTab(v);

  // ==========================================
  // 5. RENDERER FOR CATEGORY TABLES
  // ==========================================
  const renderCategoryTables = (dataList, filter, isMaster) => {
    const categoriesToShow = filter === "All" ? ALL_CATEGORIES : [filter];

    return categoriesToShow.map((category) => {
      const categoryRows = dataList.filter(d => d.Type === category);

      // Skip empty categories unless explicitly filtered
      if (categoryRows.length === 0) {
        if (filter !== "All") {
             return <Typography key={category} sx={{p:3, color: 'text.secondary'}}>No records found for {category}.</Typography>;
        }
        return null; 
      }

      // Dynamic Column Detection
      const catCols = Object.keys(categoryRows[0]).filter(key => !IGNORED_COLUMNS.includes(key));

      // Calculate "Select All" Checkbox State
      const currentCategoryIds = categoryRows.map(r => r.id);
      const allSelected = currentCategoryIds.length > 0 && currentCategoryIds.every(id => selectedMasterIds.includes(id));
      const someSelected = currentCategoryIds.some(id => selectedMasterIds.includes(id)) && !allSelected;

      return (
        <Accordion key={category} defaultExpanded sx={{ mb: 2, border: '1px solid #e0e0e0', boxShadow: 0 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.grey[50] }}>
             <Stack direction="row" alignItems="center" spacing={2}>
                <Chip label={category} color="primary" variant="outlined" size="small" />
                <Typography variant="subtitle2" color="text.secondary">
                    {categoryRows.length} Records
                </Typography>
             </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <TableContainer sx={{ maxHeight: '50vh' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {isMaster && (
                       <TableCell padding="checkbox" sx={{ bgcolor: 'white' }}>
                          <Checkbox 
                            checked={allSelected}
                            indeterminate={someSelected}
                            onChange={(e) => handleSelectGroup(e.target.checked, categoryRows)}
                          />
                       </TableCell>
                    )}
                    {catCols.map((col) => (
                        <TableCell key={col} sx={{ fontWeight: 'bold', bgcolor: 'white' }}>{col}</TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'white' }}>Status</TableCell>
                    {!isMaster && <TableCell sx={{ fontWeight: 'bold', bgcolor: 'white' }}>Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryRows.map((row) => {
                    const isSelected = selectedMasterIds.includes(row.id);
                    return (
                        <TableRow key={row.id} hover selected={isSelected}>
                        {isMaster && (
                            <TableCell padding="checkbox">
                            <Checkbox 
                                checked={isSelected} 
                                onChange={() => handleToggleSelect(row.id)} 
                            />
                            </TableCell>
                        )}
                        {catCols.map((col) => <TableCell key={col}>{row[col]}</TableCell>)}
                        <TableCell>
                            {/* Real Data Status Display */}
                            <Chip 
                                label={row.status || "Unknown"} 
                                size="small" 
                                color={getStatusColor(row.status)}
                                variant="filled"
                            />
                        </TableCell>
                        {!isMaster && (
                            <TableCell>
                            <Button startIcon={<ReplayIcon />} size="small" onClick={() => reassign(row.id)}>Reassign</Button>
                            </TableCell>
                        )}
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  // ==========================================
  // MAIN UI RENDER
  // ==========================================
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      
      {/* TABS HEADER */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
          <Tab icon={<CloudUploadIcon />} label="Upload Excel" value="upload" iconPosition="start" />
          <Tab icon={<AddIcon />} label="Preview" value="preview" iconPosition="start" disabled={previewRows.length === 0} />
          <Tab icon={<StorageIcon />} label="Master List" value="master" iconPosition="start" />
          <Tab icon={<BlockIcon />} label="Inaction List" value="inaction" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* VIEW 1: UPLOAD SCREEN */}
      {tab === "upload" && (
        <Card elevation={3} sx={{ borderRadius: 3, mt: 4, maxWidth: 850, mx: 'auto' }}>
          <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>Upload Data</Typography>
            
            <FormControl sx={{ minWidth: 200, mb: 4 }} size="small">
              <InputLabel>Select Project Type</InputLabel>
              <Select value={selectedType} label="Select Project Type" onChange={(e) => setSelectedType(e.target.value)}>
                  {PROJECT_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center" alignItems="stretch">
              <Box component="label" sx={{ flex: 1, border: '2px dashed', borderColor: 'primary.light', borderRadius: 2, bgcolor: 'primary.50', p: 4, cursor: 'pointer', '&:hover': { bgcolor: 'primary.100' } }}>
                <input type="file" hidden onChange={(e) => handleFileUpload(e, "child")} accept=".xlsx, .xls" />
                <Stack alignItems="center" spacing={2}>
                  <CategoryIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" color="primary.main">Child Excel</Typography>
                </Stack>
              </Box>

              <Box component="label" sx={{ flex: 1, border: '2px dashed', borderColor: 'secondary.light', borderRadius: 2, bgcolor: 'secondary.50', p: 4, cursor: 'pointer', '&:hover': { bgcolor: 'secondary.100' } }}>
                 <input type="file" hidden onChange={(e) => handleFileUpload(e, "main")} accept=".xlsx, .xls" />
                <Stack alignItems="center" spacing={2}>
                  <StorageIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" color="secondary.main">Main Excel</Typography>
                </Stack>
              </Box>
            </Stack>

            {fileName && (
              <Chip label={`${uploadSource.toUpperCase()} DATA: ${fileName}`} color={uploadSource === "main" ? "secondary" : "primary"} onDelete={() => { setFileName(""); setUploadSource(""); }} sx={{ mt: 4, fontWeight: 'bold' }} />
            )}
          </CardContent>
        </Card>
      )}

      {/* VIEW 2: PREVIEW SCREEN */}
      {tab === "preview" && (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 2, bgcolor: theme.palette.grey[100], display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Preview Data</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={addRow}>Add Row</Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={saveToMaster}>Save</Button>
            </Stack>
          </Box>
          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {previewColumns.map((c) => <TableCell key={c} sx={{ fontWeight: 'bold' }}>{c}</TableCell>)}
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row.id}>
                    {previewColumns.map((c) => (
                      <TableCell key={c}>
                        <TextField variant="standard" size="small" fullWidth value={row[c] || ""} onChange={(e) => updateCell(row.id, c, e.target.value)} InputProps={{ disableUnderline: true }} />
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Button size="small" color="error" onClick={() => deleteRow(row.id)}><DeleteIcon /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* VIEW 3: MASTER LIST (Main DB) */}
      {tab === "master" && (
        <Paper elevation={3} sx={{ borderRadius: 2, p: 2, bgcolor: '#f5f5f5', minHeight: '70vh' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
             <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">Master Database</Typography>
                <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
                    <InputLabel>Filter Category</InputLabel>
                    <Select value={masterFilter} label="Filter Category" onChange={(e) => setMasterFilter(e.target.value)}>
                        {FILTER_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
             </Stack>
             <Button 
                variant="contained" 
                color="warning" 
                startIcon={<AssignmentReturnIcon />} 
                onClick={pushToInactive}
                disabled={selectedMasterIds.length === 0} // Disable if nothing selected
             >
              Move Selected ({selectedMasterIds.length}) to Inaction
            </Button>
          </Stack>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Dynamic Table Rendering */}
          {renderCategoryTables(masterList, masterFilter, true)}
          
        </Paper>
      )}

      {/* VIEW 4: INACTION LIST (Trash/Hold) */}
      {tab === "inaction" && (
        <Paper elevation={3} sx={{ borderRadius: 2, p: 2, bgcolor: '#f5f5f5', minHeight: '70vh' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
             <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">Inactive / Incomplete Items</Typography>
                <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
                    <InputLabel>Filter Category</InputLabel>
                    <Select value={inactiveFilter} label="Filter Category" onChange={(e) => setInactiveFilter(e.target.value)}>
                        {FILTER_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
             </Stack>
          </Stack>
          <Divider sx={{ mb: 2 }} />

           {/* Dynamic Table Rendering */}
           {renderCategoryTables(inactiveList, inactiveFilter, false)}
        </Paper>
      )}

      {/* GLOBAL NOTIFICATION SNACKBAR */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={alert.type} variant="filled" onClose={() => setAlert({ ...alert, open: false })}>{alert.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

// End of AddProject.js
