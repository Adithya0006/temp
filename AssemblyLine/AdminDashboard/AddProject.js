
// AddProject.js - Refactored for clear Status Management
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import axios from "axios";

// =====================
// MUI COMPONENTS
// =====================
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
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
  AccordionDetails,
} from "@mui/material";

// =====================
// MUI ICONS
// =====================
import DashboardIcon from "@mui/icons-material/Dashboard";
import FilterListIcon from "@mui/icons-material/FilterList";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StorageIcon from "@mui/icons-material/Storage";
import BlockIcon from "@mui/icons-material/Block";
import SaveIcon from "@mui/icons-material/Save";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


// ==========================================
// CONFIGURATION
// ==========================================
// API Endpoint for fetching and updating PCB data
// const API_URL = "http://172.195.121.91:8082/api/pcb"; 

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
  
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)


  var API = "/api/pcb/history"
  var fetchPCB = "http://127.0.0.1:8082" + API
  var API_URL="http://172.195.121.91:8082"; 


  var API1 = "/api/pcb/upload-bulk"
  var UploadBulkPCB = "http://127.0.0.1:8082" + API1


  var API2 = "/api/pcb/update-status"
  var UppdatePCBStatus = "http://127.0.0.1:8082" + API2
  var API3="/api/pcb"

  if (configDetails != undefined) {

    if (configDetails.project[0].ServerIP != undefined) {

      


      if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

        fetchPCB = configDetails.project[0].ServerIP[0].NodeServerIP + API

        UploadBulkPCB = configDetails.project[0].ServerIP[0].NodeServerIP + API1

        UppdatePCBStatus = configDetails.project[0].ServerIP[0].NodeServerIP + API2
        API_URL=configDetails.project[0].ServerIP[0].NodeServerIP+API3;
        // console.log("PythonServerIP from ExperimentonSearch",PythonServerIP)
        // console.log("configDetails from ExperimentonSearch",configDetails.project[0].ServerIP[0])
      }

console.log("fetchPCB UploadBulkPCB  UppdatePCBStatus:  ",fetchPCB,UploadBulkPCB,UppdatePCBStatus,API_URL)
    }

  }
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [tab, setTab] = useState("upload"); // Controls current view (Upload, Preview, Master, Inaction)
  const desiredColumns = [ 'serialNo', 'partNumber', 'productionOrder', 'quantity'];
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
  const [temp,setTemp]=useState([]);
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
      setTemp(rawData);
      console.log("temp data: ",rawData);
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
        .filter((item) => item.status === "New")
        .map((item) => ({
          id: item.serialNo, 
          ...item,
          Type: processItem(item),
          // IMPORTANT: We keep the real status from the DB here! 
          // (No longer forcing "Not Assigned")
        }));
        
      // List 2: Inactive List (Only "Inaction")
      // console.log("all data: ",allData);
      const inactiveItems = allData
        .filter((item) => item.status === "Inaction" || item.status === "Assigned") 
        .map((item) => ({
          id: item.serialNo,
          ...item,
          Type: processItem(item),
        }));

      setMasterList(activeItems);
      setInactiveList(inactiveItems);
      // setSelectedMasterIds([]); // Reset selection when data reloads

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
  // ==========================================
  // UPDATED RENDERER: INDUSTRIAL STYLE
  // ==========================================
  const renderCategoryTables = (dataList, filter, isMaster) => {
    const categoriesToShow = filter === "All" ? ALL_CATEGORIES : [filter];

    return categoriesToShow.map((category) => {
      const categoryRows = dataList.filter(d => d.Type === category);

      // Skip empty categories unless explicitly filtered
      if (categoryRows.length === 0) {
        if (filter !== "All") {
             return (
               <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa', borderStyle: 'dashed' }}>
                  <Typography color="text.secondary">No records found for {category}.</Typography>
               </Paper>
             );
        }
        return null; 
      }

      // Calculate "Select All" Checkbox State
      const currentCategoryIds = categoryRows.map(r => r.id);
      const allSelected = currentCategoryIds.length > 0 && currentCategoryIds.every(id => selectedMasterIds.includes(id));
      const someSelected = currentCategoryIds.some(id => selectedMasterIds.includes(id)) && !allSelected;

      return (
        <Paper key={category} variant="outlined" sx={{ mb: 3, overflow: 'hidden', borderColor: '#e0e0e0', borderRadius: 1 }}>
            {/* Panel Header - ERP Style */}
            <Box sx={{ 
                px: 2, 
                py: 1.5, 
                bgcolor: '#f8f9fa', 
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip 
                        label={category} 
                        size="small" 
                        sx={{ 
                            borderRadius: '4px', 
                            fontWeight: 700,
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            fontSize: '0.75rem'
                        }} 
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        &mdash; <strong>{categoryRows.length}</strong> Records Found
                    </Typography>
                </Stack>
                
                {/* Group Select Action */}
                {isMaster && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                            Select Group
                        </Typography>
                        <Checkbox 
                            size="small"
                            checked={allSelected}
                            indeterminate={someSelected}
                            onChange={(e) => handleSelectGroup(e.target.checked, categoryRows)}
                            sx={{ p: 0.5 }}
                        />
                    </Stack>
                )}
            </Box>

            {/* Data Table */}
            <TableContainer sx={{ maxHeight: '50vh' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {isMaster && (
                       <TableCell padding="checkbox" sx={{ bgcolor: '#fff', borderBottom: '2px solid #f0f0f0' }} />
                    )}
                    {desiredColumns.map((col) => (
                      <TableCell key={col} sx={{ 
                          fontWeight: 700, 
                          color: '#4a5568',
                          bgcolor: '#fff',
                          borderBottom: '2px solid #f0f0f0',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                      }}>
                          {col.replace(/([A-Z])/g, ' $1').trim()}
                      </TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568', bgcolor: '#fff', borderBottom: '2px solid #f0f0f0', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Status
                    </TableCell>
                    {!isMaster && (
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#4a5568', bgcolor: '#fff', borderBottom: '2px solid #f0f0f0', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            Action
                        </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryRows.map((row) => {
                    const isSelected = selectedMasterIds.includes(row.id);
                    return (
                        <TableRow 
                            key={row.id} 
                            hover 
                            selected={isSelected}
                            sx={{ '&:nth-of-type(even)': { bgcolor: '#fafafa' } }} // Zebra Striping
                        >
                        {isMaster && (
                            <TableCell padding="checkbox">
                            <Checkbox 
                                size="small"
                                checked={isSelected} 
                                onChange={() => handleToggleSelect(row.id)} 
                            />
                            </TableCell>
                        )}
                        {desiredColumns.map((col) => (
                            <TableCell key={col} sx={{ fontSize: '0.8125rem', color: '#2d3748' }}>
                                {row[col]}
                            </TableCell>
                        ))}
                        <TableCell>
                            <Chip 
                                label={row.status || "Unknown"} 
                                size="small" 
                                color={getStatusColor(row.status)}
                                variant="outlined" // Outlined looks cleaner in lists
                                sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, border: '1px solid' }}
                            />
                        </TableCell>
                        {!isMaster && (
                            <TableCell align="right">
                              {row.status !== "Inaction" ? (
                                <Button disabled size="small" sx={{ fontSize: '0.7rem' }}>Processed</Button>
                              ) : (
                                <Button 
                                    startIcon={<ReplayIcon sx={{ fontSize: 16 }} />} 
                                    size="small" 
                                    onClick={() => reassign(row.id)}
                                    color="primary"
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                  Restore
                                </Button>
                              )}
                            </TableCell>
                        )}
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
        </Paper>
      );
    });
  };

  const TableLegend = () => (
  <Paper 
    variant="outlined" 
    sx={{ 
      mb: 2, 
      p: 1.5, 
      bgcolor: '#f1f5f9', // Very light blue-grey
      borderColor: '#cbd5e1', 
      display: 'flex', 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      gap: 3 
    }}
  >
     
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: '#475569' }}>
              <strong>SERIAL NO:</strong> Unique PCB Unit ID
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', bgcolor: '#cbd5e1' }} />
          
          <Typography variant="caption" sx={{ color: '#475569' }}>
              <strong>PART NUMBER:</strong> Component / Model ID
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', bgcolor: '#cbd5e1' }} />

          <Typography variant="caption" sx={{ color: '#475569' }}>
              <strong>PRODUCTION ORDER:</strong> Batch Reference Code
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', bgcolor: '#cbd5e1' }} />

          <Typography variant="caption" sx={{ color: '#475569' }}>
              <strong>QUANTITY:</strong> Total Units in Batch
          </Typography>
      </Box>
  </Paper>
);


 // ==========================================
  // MAIN UI RENDER
  // ==========================================
  return (
    <Box sx={{ width: '100%', typography: 'body1', bgcolor: '#f4f6f8', minHeight: '100vh', p: 3 }}>
      
      {/* 1. DASHBOARD HEADER */}
      {/* 2. NAVIGATION TABS (Sub-nav style) */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
            value={tab} 
            onChange={handleTabChange} 
            indicatorColor="primary" 
            textColor="primary"
            sx={{ 
                bgcolor: '#fff',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 56 }
            }}
        >
          <Tab icon={<CloudUploadIcon />} label="Import Data" value="upload" iconPosition="start" />
          <Tab icon={<AddIcon />} label="Verification" value="preview" iconPosition="start" disabled={previewRows.length === 0} />
          <Tab icon={<StorageIcon />} label="Master Database" value="master" iconPosition="start" />
          <Tab icon={<BlockIcon />} label="Hold / Inaction" value="inaction" iconPosition="start" />
        </Tabs>

      {/* VIEW 1: UPLOAD SCREEN */}
      {tab === "upload" && (
        <Box sx={{ p: 4, bgcolor: '#fff' }}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={8}>
                     <Box sx={{ mb: 4, textAlign: 'center' }}>
                         <Typography variant="h6" gutterBottom>Select Configuration</Typography>
                         <FormControl size="small" sx={{ minWidth: 250 }}>
                            <InputLabel>Project Type</InputLabel>
                            <Select value={selectedType} label="Project Type" onChange={(e) => setSelectedType(e.target.value)}>
                                {PROJECT_TYPES.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                     </Box>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
                        {/* File Drop Zone A */}
                        <Box component="label" sx={{ 
                            flex: 1, 
                            border: '1px dashed #cbd5e0', 
                            borderRadius: 2, 
                            bgcolor: '#f7fafc', 
                            p: 4, 
                            textAlign: 'center', 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#ebf8ff', borderColor: 'primary.main' }
                        }}>
                            <input type="file" hidden onChange={(e) => handleFileUpload(e, "child")} accept=".xlsx, .xls" />
                            <CategoryIcon color="primary" sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
                            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">Child Excel</Typography>
                            <Typography variant="caption" color="text.secondary">Click to browse files</Typography>
                        </Box>

                        {/* File Drop Zone B */}
                        <Box component="label" sx={{ 
                            flex: 1, 
                            border: '1px dashed #cbd5e0', 
                            borderRadius: 2, 
                            bgcolor: '#f7fafc', 
                            p: 4, 
                            textAlign: 'center', 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#fff5f5', borderColor: 'secondary.main' }
                        }}>
                            <input type="file" hidden onChange={(e) => handleFileUpload(e, "main")} accept=".xlsx, .xls" />
                            <StorageIcon color="secondary" sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
                            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">Main Excel</Typography>
                            <Typography variant="caption" color="text.secondary">Click to browse files</Typography>
                        </Box>
                    </Stack>

                    {fileName && (
                        <Alert severity="success" variant="outlined" sx={{ mt: 3, bgcolor: '#f0fff4', borderColor: '#c6f6d5' }}>
                           <strong>File Ready:</strong> {fileName} ({uploadSource.toUpperCase()})
                        </Alert>
                    )}
                </Grid>
            </Grid>
        </Box>
      )}

      {/* VIEW 2: PREVIEW SCREEN */}
      {tab === "preview" && (
        <Box>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Previewing {previewRows.length} rows
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addRow}>Add Entry</Button>
              <Button variant="contained" disableElevation size="small" startIcon={<SaveIcon />} onClick={saveToMaster}>Commit to Database</Button>
            </Stack>
          </Box>
          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {previewColumns.map((c) => (
                      <TableCell key={c} sx={{ fontWeight: 700, bgcolor: '#fafafa', color: '#4a5568', fontSize: '0.75rem' }}>{c.toUpperCase()}</TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: '#fafafa', color: '#4a5568', fontSize: '0.75rem' }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row.id} hover>
                    {previewColumns.map((c) => (
                      <TableCell key={c} sx={{ p: 1 }}>
                        <TextField 
                            variant="standard" 
                            size="small" 
                            fullWidth 
                            value={row[c] || ""} 
                            onChange={(e) => updateCell(row.id, c, e.target.value)} 
                            InputProps={{ disableUnderline: true, style: { fontSize: '0.875rem' } }} 
                        />
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => deleteRow(row.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tab === "master" && (
        <Box sx={{ p: 3, bgcolor: '#f9fafb' }}>
          {/* Toolbar */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Stack direction="row" spacing={2} alignItems="center">
                <FilterListIcon color="action" />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter Category</InputLabel>
                    <Select value={masterFilter} label="Filter Category" onChange={(e) => setMasterFilter(e.target.value)}>
                        {FILTER_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
             </Stack>
             
             <Button 
                variant="contained" 
                color="warning" 
                disableElevation
                startIcon={<AssignmentReturnIcon />} 
                onClick={pushToInactive}
                disabled={selectedMasterIds.length === 0}
                sx={{ fontWeight: 600 }}
             >
             Move Selected to Build ({selectedMasterIds.length})
            </Button>
          </Paper>

          {/* INSERT LEGEND HERE */}
          <TableLegend />
          
          {/* Dynamic Table Rendering */}
          {renderCategoryTables(masterList, masterFilter, true)}
        </Box>
      )}

      {/* VIEW 4: INACTION LIST (Trash/Hold) */}
      {tab === "inaction" && (
        <Box sx={{ p: 3, bgcolor: '#f9fafb' }}>
          <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
             <Stack direction="row" spacing={2} alignItems="center">
                <FilterListIcon color="action" />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter Category</InputLabel>
                    <Select value={inactiveFilter} label="Filter Category" onChange={(e) => setInactiveFilter(e.target.value)}>
                        {FILTER_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
             </Stack>
          </Paper>

           {/* INSERT LEGEND HERE */}
           <TableLegend />

           {/* Dynamic Table Rendering */}
           {renderCategoryTables(inactiveList, inactiveFilter, false)}
        </Box>
      )}

      </Paper> {/* End of Main Navigation Paper Wrapper */}

      {/* GLOBAL NOTIFICATION SNACKBAR */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={alert.type} variant="filled" onClose={() => setAlert({ ...alert, open: false })} sx={{ boxShadow: 4 }}>{alert.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

// End of AddProject.js
