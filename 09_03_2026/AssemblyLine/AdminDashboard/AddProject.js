
// // // AddProject.js - Refactored for clear Status Management
// // import React, { useState, useEffect } from "react";
// // import { useSelector } from "react-redux";
// // import * as XLSX from "xlsx";
// // import axios from "axios";

// // // =====================
// // // MUI COMPONENTS
// // // =====================
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Typography,
// //   Button,
// //   Grid,
// //   IconButton,
// //   Table,
// //   TableHead,
// //   TableRow,
// //   TableCell,
// //   TableBody,
// //   TextField,
// //   Checkbox,
// //   Snackbar,
// //   Alert,
// //   Tabs,
// //   Tab,
// //   Paper,
// //   TableContainer,
// //   Stack,
// //   Divider,
// //   Chip,
// //   useTheme,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Accordion,
// //   AccordionSummary,
// //   AccordionDetails,
// // } from "@mui/material";

// // // =====================
// // // MUI ICONS
// // // =====================
// // import DashboardIcon from "@mui/icons-material/Dashboard";
// // import FilterListIcon from "@mui/icons-material/FilterList";
// // import UploadFileIcon from "@mui/icons-material/UploadFile";
// // import AddIcon from "@mui/icons-material/Add";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import ReplayIcon from "@mui/icons-material/Replay";
// // import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// // import StorageIcon from "@mui/icons-material/Storage";
// // import BlockIcon from "@mui/icons-material/Block";
// // import SaveIcon from "@mui/icons-material/Save";
// // import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
// // import CategoryIcon from "@mui/icons-material/Category";
// // import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


// // // ==========================================
// // // CONFIGURATION
// // // ==========================================
// // // API Endpoint for fetching and updating PCB data
// // // const API_URL = "http://172.195.121.91:8082/api/pcb"; 

// // // Dropdown options for project types
// // const PROJECT_TYPES = [
// //   { value: "HEXA", label: "HEXA" },
// //   { value: "OCTA", label: "OCTA" }
// // ];

// // // Categories used for filtering the Master/Inactive lists
// // const FILTER_CATEGORIES = [
// //   "All",
// //   "HEXA-CHILD",
// //   "HEXA-MAIN",
// //   "OCTA-CHILD",
// //   "OCTA-MAIN"
// // ];

// // // Helper list to iterate over when "All" filter is selected
// // const ALL_CATEGORIES = [
// //   "HEXA-CHILD",
// //   "HEXA-MAIN",
// //   "OCTA-CHILD",
// //   "OCTA-MAIN"
// // ];

// // // Columns to ignore during Excel processing
// // const IGNORED_COLUMNS = [
// //   "SMT Status", 
// //   "SAP Material issue", 
// //   "Labour hour booking",
// //   "Type", 
// //   "id", "_id", "status", "__v", "createdAt", "updatedAt", "source", "type"
// // ];

// // export default function AddProject() {
// //   const theme = useTheme();
  
// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)


// //   var API = "/api/pcb/history"
// //   var fetchPCB = "http://127.0.0.1:8082" + API
// //   var API_URL="http://172.195.121.91:8082"; 


// //   var API1 = "/api/pcb/upload-bulk"
// //   var UploadBulkPCB = "http://127.0.0.1:8082" + API1


// //   var API2 = "/api/pcb/update-status"
// //   var UppdatePCBStatus = "http://127.0.0.1:8082" + API2
// //   var API3="/api/pcb"

// //   if (configDetails != undefined) {

// //     if (configDetails.project[0].ServerIP != undefined) {

      


// //       if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

// //         fetchPCB = configDetails.project[0].ServerIP[0].NodeServerIP + API

// //         UploadBulkPCB = configDetails.project[0].ServerIP[0].NodeServerIP + API1

// //         UppdatePCBStatus = configDetails.project[0].ServerIP[0].NodeServerIP + API2
// //         API_URL=configDetails.project[0].ServerIP[0].NodeServerIP+API3;
// //         // console.log("PythonServerIP from ExperimentonSearch",PythonServerIP)
// //         // console.log("configDetails from ExperimentonSearch",configDetails.project[0].ServerIP[0])
// //       }

// // console.log("fetchPCB UploadBulkPCB  UppdatePCBStatus:  ",fetchPCB,UploadBulkPCB,UppdatePCBStatus,API_URL)
// //     }

// //   }
// //   // ==========================================
// //   // STATE MANAGEMENT
// //   // ==========================================
// //   const [tab, setTab] = useState("upload"); // Controls current view (Upload, Preview, Master, Inaction)
// //   const desiredColumns = [ 'serialNo', 'partNumber', 'productionOrder', 'quantity'];
// //   // -- Upload States --
// //   const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0].value); // HEXA or OCTA
// //   const [uploadSource, setUploadSource] = useState(""); // "main" or "child"
// //   const [fileName, setFileName] = useState("");

// //   // -- Data States --
// //   const [previewRows, setPreviewRows] = useState([]); // Temporary rows from Excel before saving
// //   const [previewColumns, setPreviewColumns] = useState([]); // Columns detected in Excel
// //   const [masterList, setMasterList] = useState([]); // Active items (Status: New, WIP, etc.)
// //   const [inactiveList, setInactiveList] = useState([]); // Inactive items (Status: Inaction)
  
// //   // -- Filters --
// //   const [masterFilter, setMasterFilter] = useState("All");
// //   const [inactiveFilter, setInactiveFilter] = useState("All");
// //   const [temp,setTemp]=useState([]);
// //   // -- SELECTION STATE (NEW) --
// //   // Instead of changing the row's status to "Assigned", we just store the selected IDs here.
// //   // This keeps the UI selection separate from the actual Data status.
// //   const [selectedMasterIds, setSelectedMasterIds] = useState([]);

// //   // -- Helper State --
// //   const [serialColumn, setSerialColumn] = useState(""); // Auto-detected Serial Number column name
// //   const [alert, setAlert] = useState({ open: false, msg: "", type: "error" }); // Notification system

// //   // ==========================================
// //   // 1. FETCH DATA (The "Truth" Source)
// //   // ==========================================
// //   const fetchAllData = async () => {
// //     try {
// //       // Fetch both HEXA and OCTA data in parallel
// //       const [hexaRes, octaRes] = await Promise.all([
// //         axios.get(`${API_URL}/history`, { params: { type: "HEXA" } }),
// //         axios.get(`${API_URL}/history`, { params: { type: "OCTA" } })
// //       ]);

// //       const hexaData = hexaRes.data?.PcbData || [];
// //       const octaData = octaRes.data?.PcbData || [];
      
// //       // Combine raw data
// //       const rawData = [...hexaData, ...octaData];
// //       setTemp(rawData);
// //       console.log("temp data: ",rawData);
// //       // DEDUPLICATE: Ensure we don't show the same serial number twice
// //       const uniqueMap = new Map();
// //       rawData.forEach((item) => {
// //         if (item.serialNo) {
// //           uniqueMap.set(item.serialNo, item);
// //         }
// //       });
// //       const allData = Array.from(uniqueMap.values());

// //       // Helper to normalize the "Type" field (e.g., HEXA-MAIN)
// //       const processItem = (item) => {
// //         let compositeType = item.Type;
// //         if (!compositeType && item.type && item.source) {
// //              compositeType = `${item.type}-${item.source}`.toUpperCase();
// //         }
// //         return compositeType || "UNKNOWN";
// //       };

// //       // SPLIT INTO TWO LISTS based on backend status
// //       // List 1: Master List (Everything NOT "Inaction")
// //       const activeItems = allData
// //         .filter((item) => item.status === "New")
// //         .map((item) => ({
// //           id: item.serialNo, 
// //           ...item,
// //           Type: processItem(item),
// //           // IMPORTANT: We keep the real status from the DB here! 
// //           // (No longer forcing "Not Assigned")
// //         }));
        
// //       // List 2: Inactive List (Only "Inaction")
// //       // console.log("all data: ",allData);
// //       const inactiveItems = allData
// //         .filter((item) => item.status === "Inaction" || item.status === "Assigned") 
// //         .map((item) => ({
// //           id: item.serialNo,
// //           ...item,
// //           Type: processItem(item),
// //         }));

// //       setMasterList(activeItems);
// //       setInactiveList(inactiveItems);
// //       // setSelectedMasterIds([]); // Reset selection when data reloads

// //     } catch (err) {
// //       console.error("Fetch Error:", err);
// //       showAlert("Failed to load data from server.", "error");
// //     }
// //   };

// //   // Load data when component mounts
// //   useEffect(() => {
// //     fetchAllData();
// //   }, []);

// //   // ==========================================
// //   // 2. EXCEL UPLOAD LOGIC
// //   // ==========================================
// //   const handleFileUpload = (e, source) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setFileName(file.name);
// //     setUploadSource(source); 

// //     const reader = new FileReader();
// //     reader.onload = (evt) => {
// //       const buffer = new Uint8Array(evt.target.result);
// //       const wb = XLSX.read(buffer, { type: "array" });
// //       const ws = wb.Sheets[wb.SheetNames[0]];
// //       let json = XLSX.utils.sheet_to_json(ws);

// //       if (json.length === 0) {
// //         showAlert("Excel file is empty!", "error");
// //         return;
// //       }

// //       // Filter valid columns
// //       const originalCols = Object.keys(json[0]);
// //       const validCols = originalCols.filter(col => !IGNORED_COLUMNS.includes(col));
// //       setPreviewColumns(validCols);

// //       // Attempt to auto-detect the Serial Number column
// //       const serialCol = validCols.find(
// //         (c) => c.toLowerCase().replace(/\s+/g, "") === "serialnumber"
// //       );
// //       setSerialColumn(serialCol);

// //       // Create preview rows with unique temporary IDs
// //       const rows = json.map((row, i) => {
// //         const cleanRow = { id: Date.now() + "-" + i }; 
// //         validCols.forEach(col => {
// //             cleanRow[col] = row[col]; 
// //         });
// //         return cleanRow;
// //       });

// //       setPreviewRows(rows);
// //       setTab("preview"); // Switch to Preview tab
// //     };
// //     reader.readAsArrayBuffer(file);
// //     e.target.value = null; // Reset input
// //   };

// //   const handleFileUpload = async (e, source) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setFileName(file.name);
// //     setUploadSource(source);

// //     const reader = new FileReader();
// //     reader.onload = async (evt) => {
// //         const buffer = new Uint8Array(evt.target.result);
// //         try {
// //             const wb = XLSX.read(buffer, { type: "array" });
// //             const ws = wb.Sheets[wb.SheetNames[0]];
// //             let json = XLSX.utils.sheet_to_json(ws);

// //             if (json.length === 0) {
// //                 showAlert("Excel file is empty!", "error");
// //                 return;
// //             }

// //             const originalCols = Object.keys(json[0]);
// //             const validCols = originalCols.filter(col => !IGNORED_COLUMNS.includes(col));
// //             setPreviewColumns(validCols);

// //             const serialCol = validCols.find(
// //                 (c) => c.toLowerCase().replace(/\s+/g, "") === "serialnumber"
// //             );
// //             setSerialColumn(serialCol);

// //             //Data Preprocessing and Validation before preview
// //             const initialData = json.map((row, i) => ({
// //                 id: Date.now() + "-" + i,
// //                 ...Object.keys(row).reduce((acc, key) => {
// //                     if (validCols.includes(key)) {
// //                         acc[key] = row[key];
// //                     }
// //                     return acc;
// //                 }, {})
// //             }));

// //             //Validate quantity
// //              const bulkData = initialData.flatMap(record => {
// //                 const slNo = String(record.slNo);
// //                 const productionOrder = String(record.productionOrder);
// //                 const partNumber = String(record.partNumber);
// //                 const quantity = parseInt(record.quantity); // Convert quantity to an integer

// //                 if (isNaN(quantity)) {
// //                     showAlert("Invalid quantity, please check your data", "error");
// //                     return [];
// //                 }


// //                 if (quantity > 1) {
// //                     const serialNumber = String(record.serialNumber);
// //                     const serialNumberRange = serialNumber.split('-');

// //                     const startSerial = parseInt(serialNumberRange[0]);
// //                     const endSerial = parseInt(serialNumberRange[1]);

// //                     if (startSerial && endSerial) {
// //                         const rangeArray = Array.from({ length: endSerial - startSerial + 1 }, (_, i) => startSerial + i);
// //                         return rangeArray.map(i => ({
// //                             // slNo: slNo,
// //                             productionOrder: productionOrder,
// //                             partNumber: partNumber,
// //                             quantityStart: String(startSerial),
// //                             quantityEnd: String(i),
// //                             serialNumber: String(i),
// //                             description: String(record.description),
// //                             smtStatus: String(record.smtStatus),
// //                             sapMaterialIssue: String(record.sapMaterialIssue),
// //                             labourHourBooking: String(record.labourHourBooking)
// //                         }));
// //                     } else {
// //                         showAlert("Invalid Serial Number Format. Please check your serial number", "error");
// //                         return [];
// //                     }
// //                 } else {
// //                     return [{
// //                         // slNo: slNo,
// //                         productionOrder: productionOrder,
// //                         partNumber: partNumber,
// //                         quantityStart: String(quantity),
// //                         quantityEnd: String(quantity),
// //                         serialNumber: String(record.serialNumber),
// //                         description: String(record.description),
// //                         smtStatus: String(record.smtStatus),
// //                         sapMaterialIssue: String(record.sapMaterialIssue),
// //                         labourHourBooking: String(record.labourHourBooking)
// //                     }];
// //                 }
// //             });
// //             // Check if bulkData is empty after processing
// //             if (bulkData.length === 0) {
// //                 showAlert("No valid data after processing.", "error");
// //                 return;
// //             }

// //             setPreviewRows(bulkData);
// //             setTab("preview");

// //         } catch (error) {
// //             console.error("Error processing Excel file:", error);
// //             showAlert("Error processing Excel file. Please check the file format.", "error");
// //         }
// //     };
// //     reader.readAsArrayBuffer(file);
// //     e.target.value = null;
// // };

// //   // ==========================================
// //   // 3. PREVIEW & SAVE LOGIC
// //   // ==========================================
// //   const addRow = () => {
// //     const newRow = { id: Date.now() };
// //     previewColumns.forEach((c) => (newRow[c] = ""));
// //     setPreviewRows((p) => [...p, newRow]);
// //   };

// //   const deleteRow = (id) => {
// //     setPreviewRows((p) => p.filter((row) => row.id !== id));
// //   };

// //   const updateCell = (id, key, value) => {
// //     setPreviewRows((p) =>
// //       p.map((row) => (row.id === id ? { ...row, [key]: value } : row))
// //     );
// //   };

// //   const saveToMaster = () => {
// //     let user = JSON.parse(localStorage.getItem("user")); // Get current admin user
// //     const existingSerials = new Set(
// //       masterList.map((item) => String(item.serialNo || "").trim().toLowerCase())
// //     );

// //     let uniqueRows = [];
// //     let duplicateCount = 0;

// //     // Filter out duplicates against current Master List
// //     previewRows.forEach((r) => {
// //       const rawSerialValue = serialColumn ? r[serialColumn] : null;
// //       const checkSerial = String(rawSerialValue || "").trim().toLowerCase();

// //       if (!rawSerialValue || existingSerials.has(checkSerial)) {
// //         duplicateCount++;
// //       } else {
// //         uniqueRows.push({ ...r });
// //         existingSerials.add(checkSerial); 
// //       }
// //     });

// //     if (uniqueRows.length === 0) {
// //       if (duplicateCount > 0) showAlert(`All duplicates skipped.`, "warning");
// //       else showAlert("No valid data to save.", "info");
// //       return;
// //     }

// //     // Prepare payload for Backend
// //     const backendPayload = uniqueRows.map((row) => {
// //       // Helper to find loosely matching column names (e.g., "Part No" vs "partNumber")
// //       const findValue = (possibleHeaders) => {
// //         const keys = Object.keys(row);
// //         const match = keys.find(k => {
// //           const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, "");
// //           return possibleHeaders.some(h => cleanKey === h);
// //         });
// //         return match ? row[match] : null;
// //       };

// //       // Construct the composite Type (e.g., HEXA-CHILD)
// //       let Type = "UNKNOWN";
// //       if(selectedType === "HEXA" && uploadSource === "child") Type = "HEXA-CHILD";
// //       if(selectedType === "HEXA" && uploadSource === "main") Type = "HEXA-MAIN";
// //       if(selectedType === "OCTA" && uploadSource === "child") Type = "OCTA-CHILD";
// //       if(selectedType === "OCTA" && uploadSource === "main") Type = "OCTA-MAIN";

// //       return {
// //         partNumber: findValue(["partnumber", "partno", "pno", "model"]) || "UNKNOWN",
// //         serialNo: row[serialColumn] || findValue(["serialno", "serialnumber", "serial"]),
// //         // Creates a unique key like "SN123$PN456"
// //         PCBserialNoPartNumber: (row[serialColumn] || findValue(["serialno", "serialnumber", "serial"]))+"$"+(findValue(["partnumber", "partno", "pno", "model"]) || "UNKNOWN"),
// //         productionOrder: row["Production order"],
// //         quantity: row["Quantity"],
// //         description: row["Description"],
// //         userID: user?.id,
// //         userName: user?.username,
// //         userRole: user?.userRole,
// //         userSBU: user?.sbu,
// //         userSBUDIV: user?.subdivision,
// //         Type: Type,
// //       };
// //     });
    
// //     // Send to Backend
// //     axios.post(`${API_URL}/upload-bulk`, { 
// //         type: selectedType,    
// //         source: uploadSource,  
// //         csvDataJSON: backendPayload 
// //     })
// //       .then(() => {
// //         showAlert(`Successfully saved ${backendPayload.length} records.`, "success");
// //         setTab("master"); // Go to Master List
// //         setPreviewRows([]); 
// //         setUploadSource(""); 
// //         setFileName("");
// //         fetchAllData(); // Refresh list from DB
// //       })
// //       .catch((err) => {
// //         console.error(err);
// //         showAlert("Failed to save data to server.", "error");
// //       });
// //   };

// //   // ==========================================
// //   // 4. NEW SELECTION & STATUS LOGIC
// //   // ==========================================

// //   // Toggle Selection: Adds/Removes ID from the selectedMasterIds array
// //   const handleToggleSelect = (id) => {
// //     setSelectedMasterIds(prev => {
// //         if (prev.includes(id)) {
// //             return prev.filter(item => item !== id); // Uncheck
// //         } else {
// //             return [...prev, id]; // Check
// //         }
// //     });
// //   };

// //   // Select All Group: Adds all IDs in a specific category to selection
// //   const handleSelectGroup = (isChecked, categoryRows) => {
// //     const rowIds = categoryRows.map(r => r.id);
    
// //     setSelectedMasterIds(prev => {
// //         if (isChecked) {
// //             // Merge new IDs, avoiding duplicates
// //             const newSelection = [...prev];
// //             rowIds.forEach(id => {
// //                 if (!newSelection.includes(id)) newSelection.push(id);
// //             });
// //             return newSelection;
// //         } else {
// //             // Filter out IDs from this category
// //             return prev.filter(id => !rowIds.includes(id));
// //         }
// //     });
// //   };

// //   // ACTION: Move Selected Items to Inaction List
// //   const pushToInactive = () => {
// //     if (selectedMasterIds.length === 0) return showAlert("Please select items first.", "warning");

// //     // 1. Identify items to move
// //     const selectedItems = masterList.filter(item => selectedMasterIds.includes(item.id));

// //     // 2. Group them by Type (API requirement)
// //     const groups = {};
// //     selectedItems.forEach(item => {
// //         const genericType = item.Type.includes("HEXA") ? "HEXA" : "OCTA";
// //         if (!groups[genericType]) groups[genericType] = [];
// //         groups[genericType].push(item.serialNo);
// //     });

// //     // 3. Send API Requests for each group
// //     const promises = Object.keys(groups).map(type => 
// //         axios.put(`${API_URL}/update-status`, { 
// //             type: type, 
// //             serialNos: groups[type], 
// //             status: "Inaction" 
// //         })
// //     );

// //     Promise.all(promises)
// //     .then(() => {
// //         // 4. Update UI Optimistically (Instant Feedback)
// //         const movedItems = selectedItems.map(item => ({ ...item, status: "Inaction" }));
        
// //         setInactiveList(prev => [...prev, ...movedItems]); // Add to Inactive
// //         setMasterList(prev => prev.filter(item => !selectedMasterIds.includes(item.id))); // Remove from Master
        
// //         setSelectedMasterIds([]); // Clear Checkboxes
// //         showAlert(`Moved ${selectedItems.length} items to Inaction List.`, "success");
// //         setTab("inaction"); // Jump to Inaction tab to show user
// //     })
// //     .catch(() => showAlert("Error updating status on server.", "error"));
// //   };

// //   // ACTION: Restore Item from Inaction -> Master
// //   const reassign = (id) => {
// //     const item = inactiveList.find((r) => r.id === id);
// //     if (!item) return;

// //     const type = item.Type.includes("HEXA") ? "HEXA" : "OCTA";

// //     axios.put(`${API_URL}/update-status`, { 
// //         type: type, 
// //         serialNos: [item.serialNo], 
// //         status: "New" // Reset status to New
// //     })
// //     .then(() => {
// //         // Optimistic Update
// //         const updated = { ...item, status: "New" };
// //         setMasterList((p) => [...p, updated]); // Add back to Master
// //         setInactiveList((p) => p.filter((r) => r.id !== id)); // Remove from Inactive
// //         showAlert("Item reassigned to Master Database.", "success");
// //         setTab("master"); // Jump back to Master tab
// //     })
// //     .catch(() => showAlert("Error reassigning item.", "error"));
// //   };

// //   // Helper: Returns color for the Status Chip
// //   const getStatusColor = (status) => {
// //       const s = (status || "").toLowerCase();
// //       if (s === "new") return "info";       // Blue
// //       if (s === "inaction") return "error"; // Red
// //       if (s === "completed") return "success"; // Green
// //       if (s === "wip") return "warning";    // Orange
// //       return "default"; // Grey
// //   };

// //   const showAlert = (msg, type) => setAlert({ open: true, msg, type });
// //   const handleTabChange = (e, v) => setTab(v);

// //   // ==========================================
// //   // 5. RENDERER FOR CATEGORY TABLES
// //   // ==========================================
// //   // ==========================================
// //   // UPDATED RENDERER: INDUSTRIAL STYLE
// //   // ==========================================
// //   const renderCategoryTables = (dataList, filter, isMaster) => {
// //     const categoriesToShow = filter === "All" ? ALL_CATEGORIES : [filter];

// //     return categoriesToShow.map((category) => {
// //       const categoryRows = dataList.filter(d => d.Type === category);

// //       // Skip empty categories unless explicitly filtered
// //       if (categoryRows.length === 0) {
// //         if (filter !== "All") {
// //              return (
// //                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa', borderStyle: 'dashed' }}>
// //                   <Typography color="black">No records found for {category}.</Typography>
// //                </Paper>
// //              );
// //         }
// //         return null; 
// //       }

// //       // Calculate "Select All" Checkbox State
// //       const currentCategoryIds = categoryRows.map(r => r.id);
// //       const allSelected = currentCategoryIds.length > 0 && currentCategoryIds.every(id => selectedMasterIds.includes(id));
// //       const someSelected = currentCategoryIds.some(id => selectedMasterIds.includes(id)) && !allSelected;

// //       return (
// //         <Paper key={category} variant="outlined" sx={{ mb: 3, overflow: 'hidden', borderColor: '#e0e0e0', borderRadius: 1 }}>
// //             {/* Panel Header - ERP Style */}
// //             <Box sx={{ 
// //                 px: 2, 
// //                 py: 1.5, 
// //                 bgcolor: '#f8f9fa', 
// //                 borderBottom: '1px solid #e0e0e0',
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 justifyContent: 'space-between'
// //             }}>
// //                 <Stack direction="row" spacing={1} alignItems="center">
// //                     <Chip 
// //                         label={category} 
// //                         size="small" 
// //                         sx={{ 
// //                             borderRadius: '4px', 
// //                             fontWeight: 700,
// //                             bgcolor: theme.palette.primary.main,
// //                             color: 'white',
// //                             fontSize: '0.75rem'
// //                         }} 
// //                     />
// //                     <Typography variant="body2" sx={{ color: 'black', fontWeight: 500 }}>
// //                          <strong>{categoryRows.length}</strong> Records Found
// //                     </Typography>
// //                 </Stack>
                
// //                 {/* Group Select Action */}
// //                 {isMaster && (
// //                     <Stack direction="row" alignItems="center" spacing={1}>
// //                         <Typography variant="caption" sx={{ fontWeight: 600, color: 'black', textTransform: 'uppercase' }}>
// //                             Select Group
// //                         </Typography>
// //                         <Checkbox 
// //                             size="small"
// //                             checked={allSelected}
// //                             indeterminate={someSelected}
// //                             onChange={(e) => handleSelectGroup(e.target.checked, categoryRows)}
// //                             sx={{ p: 0.5 }}
// //                         />
// //                     </Stack>
// //                 )}
// //             </Box>

// //             {/* Data Table */}
// //             <TableContainer sx={{ maxHeight: '50vh' }}>
// //               <Table stickyHeader size="small">
// //                 <TableHead>
// //                   <TableRow>
// //                     {isMaster && (
// //                        <TableCell padding="checkbox" sx={{ bgcolor: '#fff', borderBottom: '2px solid #f0f0f0' }} />
// //                     )}
// //                     {desiredColumns.map((col) => (
// //                       <TableCell key={col} sx={{ 
// //                           fontWeight: 700, 
// //                           color: '#4a5568',
// //                           bgcolor: '#fff',
// //                           borderBottom: '2px solid #f0f0f0',
// //                           fontSize: '0.75rem',
// //                           textTransform: 'uppercase',
// //                           letterSpacing: '0.05em'
// //                       }}>
// //                           {col.replace(/([A-Z])/g, ' $1').trim()}
// //                       </TableCell>
// //                     ))}
// //                     <TableCell sx={{ fontWeight: 700, color: '#4a5568', bgcolor: '#fff', borderBottom: '2px solid #f0f0f0', fontSize: '0.75rem', textTransform: 'uppercase' }}>
// //                         Status
// //                     </TableCell>
// //                     {!isMaster && (
// //                         <TableCell align="center" sx={{ fontWeight: 700, color: '#4a5568', bgcolor: '#fff', borderBottom: '2px solid #f0f0f0', fontSize: '0.75rem', textTransform: 'uppercase' }}>
// //                             Action
// //                         </TableCell>
// //                     )}
// //                   </TableRow>
// //                 </TableHead>
// //                 <TableBody>
// //                   {categoryRows.map((row) => {
// //                     const isSelected = selectedMasterIds.includes(row.id);
// //                     return (
// //                         <TableRow 
// //                             key={row.id} 
// //                             hover 
// //                             selected={isSelected}
// //                             sx={{ '&:nth-of-type(even)': { bgcolor: '#fafafa' } }} // Zebra Striping
// //                         >
// //                         {isMaster && (
// //                             <TableCell padding="checkbox">
// //                             <Checkbox 
// //                                 size="small"
// //                                 checked={isSelected} 
// //                                 onChange={() => handleToggleSelect(row.id)} 
// //                             />
// //                             </TableCell>
// //                         )}
// //                         {desiredColumns.map((col) => (
// //                             <TableCell key={col} sx={{ fontSize: '0.8125rem', color: '#2d3748' }}>
// //                                 {row[col]}
// //                             </TableCell>
// //                         ))}
// //                         <TableCell>
// //                             <Chip 
// //                                 label={row.status || "Unknown"} 
// //                                 size="small" 
// //                                 color={getStatusColor(row.status)}
// //                                 variant="outlined" // Outlined looks cleaner in lists
// //                                 sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, border: '1px solid' }}
// //                             />
// //                         </TableCell>
// //                         {!isMaster && (
// //                             <TableCell align="right">
// //                               {row.status !== "Inaction" ? (
// //                                 <Button disabled size="small" sx={{ fontSize: '0.7rem' }}>Processed</Button>
// //                               ) : (
// //                                 <Button 
// //                                     startIcon={<ReplayIcon sx={{ fontSize: 16 }} />} 
// //                                     size="small" 
// //                                     onClick={() => reassign(row.id)}
// //                                     color="primary"
// //                                     sx={{ textTransform: 'none', fontWeight: 600 }}
// //                                 >
// //                                   Restore
// //                                 </Button>
// //                               )}
// //                             </TableCell>
// //                         )}
// //                         </TableRow>
// //                     );
// //                   })}
// //                 </TableBody>
// //               </Table>
// //             </TableContainer>
// //         </Paper>
// //       );
// //     });
// //   };

// //   const TableLegend = ({id}) => (
// //     <Paper
// //       variant="outlined"
// //       sx={{
// //         mb: 2,
// //         p: 1,
// //         // bgcolor: 'primary.light', // Soft primary color
// //         // borderColor: '1px solid primary', //Primary border
// //         display: 'flex',
// //         alignItems: 'center',
// //         flexWrap: 'wrap',
// //         gap: 0.5,
// //         borderRadius: 1 //Rounded corner
// //       }}
// //     >
// //       <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
// //         <Typography variant="caption" sx={{ color: 'primary.dark' }}>
// //           <strong>SERIAL NO:</strong> Unique PCB Unit ID
// //         </Typography>
// //         <Divider orientation="vertical" flexItem sx={{ height: 8, my: 'auto'  }} />
// //         <Typography variant="caption" sx={{ color: 'primary.dark'}}>
// //           <strong>PART NUMBER:</strong> Component / Model ID
// //         </Typography>
// //         <Divider orientation="vertical" flexItem sx={{ height: 8, my: 'auto' }} />
// //         <Typography variant="caption" sx={{ color: 'primary.dark' }}>
// //           <strong>PRODUCTION ORDER:</strong> Batch Reference Code
// //         </Typography>
// //         <Divider orientation="vertical" flexItem sx={{ height: 8, my: 'auto' }} />
// //         <Typography variant="caption" sx={{ color: 'primary.dark' }}>
// //           <strong>QUANTITY:</strong> Total Units in Batch
// //         </Typography>
// //         <Divider orientation="vertical" flexItem sx={{ height: 8, my: 'auto' }} />
// //         { id !="master" && <Typography variant="caption" sx={{ color: 'primary.dark' }}>
// //           <strong>Status</strong> 
// //         </Typography>}
// //       </Box>
// //     </Paper>
// //   );

// //  // ==========================================
// //   // MAIN UI RENDER
// //   // ==========================================
// //   return (
// //     <Box sx={{ width: '100%', typography: 'body1', bgcolor: '#f4f6f8', minHeight: '100vh', p: 3 }}>
      
// //       {/* 1. DASHBOARD HEADER */}
// //       {/* 2. NAVIGATION TABS (Sub-nav style) */}
// //       <Paper elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
// //         <Tabs 
// //             value={tab} 
// //             onChange={handleTabChange} 
// //             indicatorColor="primary" 
// //             textColor="primary"
// //             sx={{ 
// //                 bgcolor: '#fff',
// //                 '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 56 }
// //             }}
// //         >
// //           <Tab icon={<CloudUploadIcon />} label="Import Data" value="upload" iconPosition="start" />
// //           <Tab icon={<AddIcon />} label="Verification" value="preview" iconPosition="start" disabled={previewRows.length === 0} />
// //           <Tab icon={<StorageIcon />} label="Master Database" value="master" iconPosition="start" />
// //           <Tab icon={<BlockIcon />} label="Hold / Inaction" value="inaction" iconPosition="start" />
// //         </Tabs>

// //       {/* VIEW 1: UPLOAD SCREEN */}
// //       {tab === "upload" && (
// //         <Box sx={{ p: 4, bgcolor: '#fff' }}>
// //             <Grid container spacing={4} justifyContent="center">
// //                 <Grid item xs={12} md={8}>
// //                      <Box sx={{ mb: 4, textAlign: 'center' }}>
// //                          <Typography variant="h6" gutterBottom>Select Configuration</Typography>
// //                          <FormControl size="small" sx={{ minWidth: 250 }}>
// //                             <InputLabel>Project Type</InputLabel>
// //                             <Select value={selectedType} label="Project Type" onChange={(e) => setSelectedType(e.target.value)}>
// //                                 {PROJECT_TYPES.map((type) => (
// //                                     <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
// //                                 ))}
// //                             </Select>
// //                         </FormControl>
// //                      </Box>

// //                     <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
// //                         {/* File Drop Zone A */}
// //                         <Box component="label" sx={{ 
// //                             flex: 1, 
// //                             border: '1px dashed #cbd5e0', 
// //                             borderRadius: 2, 
// //                             bgcolor: '#f7fafc', 
// //                             p: 4, 
// //                             textAlign: 'center', 
// //                             cursor: 'pointer',
// //                             transition: 'all 0.2s',
// //                             '&:hover': { bgcolor: '#ebf8ff', borderColor: 'primary.main' }
// //                         }}>
// //                             <input type="file" hidden onChange={(e) => handleFileUpload(e, "child")} accept=".xlsx, .xls" />
// //                             <CategoryIcon color="primary" sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
// //                             <Typography variant="subtitle2" fontWeight="bold" color="text.primary">Child Excel</Typography>
// //                             <Typography variant="caption" color="black">Click to browse files</Typography>
// //                         </Box>

// //                         {/* File Drop Zone B */}
// //                         <Box component="label" sx={{ 
// //                             flex: 1, 
// //                             border: '1px dashed #cbd5e0', 
// //                             borderRadius: 2, 
// //                             bgcolor: '#f7fafc', 
// //                             p: 4, 
// //                             textAlign: 'center', 
// //                             cursor: 'pointer',
// //                             transition: 'all 0.2s',
// //                             '&:hover': { bgcolor: '#fff5f5', borderColor: 'secondary.main' }
// //                         }}>
// //                             <input type="file" hidden onChange={(e) => handleFileUpload(e, "main")} accept=".xlsx, .xls" />
// //                             <StorageIcon color="secondary" sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
// //                             <Typography variant="subtitle2" fontWeight="bold" color="text.primary">Main Excel</Typography>
// //                             <Typography variant="caption" color="black">Click to browse files</Typography>
// //                         </Box>
// //                     </Stack>

// //                     {fileName && (
// //                         <Alert severity="success" variant="outlined" sx={{ mt: 3, bgcolor: '#f0fff4', borderColor: '#c6f6d5' }}>
// //                            <strong>File Ready:</strong> {fileName} ({uploadSource.toUpperCase()})
// //                         </Alert>
// //                     )}
// //                 </Grid>
// //             </Grid>
// //         </Box>
// //       )}

// //       {/* VIEW 2: PREVIEW SCREEN */}
// //       {tab === "preview" && (
// //         <Box>
// //           <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //             <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'black' }}>
// //                 Previewing {previewRows.length} rows
// //             </Typography>
// //             <Stack direction="row" spacing={2}>
// //               <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addRow}>Add Entry</Button>
// //               <Button variant="contained" disableElevation size="small" startIcon={<SaveIcon />} onClick={saveToMaster}>Commit to Database</Button>
// //             </Stack>
// //           </Box>
// //           <TableContainer sx={{ maxHeight: '60vh' }}>
// //             <Table stickyHeader size="small">
// //               <TableHead>
// //                 <TableRow>
// //                   {previewColumns.map((c) => (
// //                       <TableCell key={c} sx={{ fontWeight: 700, bgcolor: '#fafafa', color: '#4a5568', fontSize: '0.75rem' }}>{c.toUpperCase()}</TableCell>
// //                   ))}
// //                   <TableCell align="center" sx={{ fontWeight: 700, bgcolor: '#fafafa', color: '#4a5568', fontSize: '0.75rem' }}>ACTION</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {previewRows.map((row) => (
// //                   <TableRow key={row.id} hover>
// //                     {previewColumns.map((c) => (
// //                       <TableCell key={c} sx={{ p: 1 }}>
// //                         <TextField 
// //                             variant="standard" 
// //                             size="small" 
// //                             fullWidth 
// //                             value={row[c] || ""} 
// //                             onChange={(e) => updateCell(row.id, c, e.target.value)} 
// //                             InputProps={{ disableUnderline: true, style: { fontSize: '0.875rem' } }} 
// //                         />
// //                       </TableCell>
// //                     ))}
// //                     <TableCell align="center">
// //                       <IconButton size="small" color="error" onClick={() => deleteRow(row.id)}><DeleteIcon fontSize="small" /></IconButton>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //         </Box>
// //       )}

// //       {tab === "master" && (
// //         <Box sx={{ p: 3, bgcolor: '#f9fafb' }}>
// //           {/* Toolbar */}
// //           <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //              <Stack direction="row" spacing={2} alignItems="center">
// //                 <FilterListIcon color="action" />
// //                 <FormControl size="small" sx={{ minWidth: 200 }}>
// //                     <InputLabel>Filter Category</InputLabel>
// //                     <Select value={masterFilter} label="Filter Category" onChange={(e) => setMasterFilter(e.target.value)}>
// //                         {FILTER_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
// //                     </Select>
// //                 </FormControl>
// //              </Stack>
            
// //              <Button 
// //                 variant="contained" 
// //                 color="warning" 
// //                 disableElevation
// //                 startIcon={<AssignmentReturnIcon />} 
// //                 onClick={pushToInactive}
// //                 disabled={selectedMasterIds.length === 0}
// //                 sx={{ fontWeight: 600 }}
// //              >
// //              Move Selected To Inaction List ({selectedMasterIds.length})
// //             </Button>
           
            
// //           </Paper>

// //           {/* INSERT LEGEND HERE */}
// //           {/* <TableLegend /> */}
          
// //           {/* Dynamic Table Rendering */}
// //           <TableLegend id="master" />
// //           {renderCategoryTables(masterList, masterFilter, true)}
// //         </Box>
// //       )}

// //       {/* VIEW 4: INACTION LIST (Trash/Hold) */}
// //       {tab === "inaction" && (
// //         <Box sx={{ p: 3, bgcolor: '#f9fafb' }}>
// //           <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
// //              <Stack direction="row" spacing={2} alignItems="center">
// //                 <FilterListIcon color="action" />
// //                 <FormControl size="small" sx={{ minWidth: 200 }}>
// //                     <InputLabel>Filter Category</InputLabel>
// //                     <Select value={inactiveFilter} label="Filter Category" onChange={(e) => setInactiveFilter(e.target.value)}>
// //                         {FILTER_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
// //                     </Select>
// //                 </FormControl>
// //              </Stack>
// //           </Paper>

// //            {/* INSERT LEGEND HERE */}
// //            <TableLegend />

// //            {/* Dynamic Table Rendering */}
// //            {renderCategoryTables(inactiveList, inactiveFilter, false)}
// //         </Box>
// //       )}

// //       </Paper> {/* End of Main Navigation Paper Wrapper */}

// //       {/* GLOBAL NOTIFICATION SNACKBAR */}
// //       <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
// //         <Alert severity={alert.type} variant="filled" onClose={() => setAlert({ ...alert, open: false })} sx={{ boxShadow: 4 }}>{alert.msg}</Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // }

// // // End of AddProject.js






































// // AddProject.js - Optimized for 2000+ Records with Pagination & Fix for Doubling
// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import axios from "axios";

// // =====================
// // MUI COMPONENTS
// // =====================
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   IconButton,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   Checkbox,
//   Snackbar,
//   Alert,
//   Tabs,
//   Tab,
//   Paper,
//   TableContainer,
//   Stack,
//   Divider,
//   Chip,
//   useTheme,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   LinearProgress,
//   TablePagination, // ADDED: For handling large datasets
// } from "@mui/material";

// // =====================
// // MUI ICONS
// // =====================
// import FilterListIcon from "@mui/icons-material/FilterList";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ReplayIcon from "@mui/icons-material/Replay";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import StorageIcon from "@mui/icons-material/Storage";
// import BlockIcon from "@mui/icons-material/Block";
// import SaveIcon from "@mui/icons-material/Save";
// import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
// import CategoryIcon from "@mui/icons-material/Category";
// import DownloadIcon from "@mui/icons-material/Download";

// // ==========================================
// // 1. CENTRALIZED CONFIGURATION
// // ==========================================
// const APP_CONFIG = {
//   EXCEL_START_ROW: 1,
//   UPLOAD_BATCH_SIZE: 50,
//   DISPLAY_COLUMNS: ["serialNo", "partNumber", "productionOrder", "quantity"],
//   IGNORED_COLUMNS: [
//     "SMT Status", "SAP Material issue", "Labour hour booking",
//     "Type", "id", "_id", "status", "__v", "createdAt", "updatedAt", "source", "type"
//   ],
//   PROJECT_TYPES: [
//     { value: "HEXA", label: "HEXA" },
//     { value: "OCTA", label: "OCTA" }
//   ],
//   FILTER_CATEGORIES: ["All", "HEXA-CHILD", "HEXA-MAIN", "OCTA-CHILD", "OCTA-MAIN"]
// };

// // ==========================================
// // 2. HELPER FUNCTIONS
// // ==========================================

// /**
//  * Resolves the API Base URL from Redux or Env variables
//  */
// const getApiBaseUrl = (configDetails) => {
//   if (configDetails?.project?.[0]?.ServerIP?.[0]?.NodeServerIP) {
//     return configDetails.project[0].ServerIP[0].NodeServerIP;
//   }
//   if (process.env.REACT_APP_API_URL) {
//     return process.env.REACT_APP_API_URL;
//   }
//   return "http://localhost:8082";
// };

// /**
//  * Handles Excel range expansion (e.g., 100-105 -> 100, 101, 102...)
//  */
// const expandExcelRows = (rawJson, serialCol) => {
//   const expanded = [];
//   rawJson.forEach((row, index) => {
//     const val = row[serialCol];
//     if (!val || String(val).trim() === "") return;

//     const rangeMatch = String(val).match(/^(\d+)\s*-\s*(\d+)$/);
//     if (rangeMatch) {
//       const start = parseInt(rangeMatch[1], 10);
//       const end = parseInt(rangeMatch[2], 10);
//       if (end >= start && (end - start) < 10000) {
//         for (let i = start; i <= end; i++) {
//           const newRow = { ...row };
//           newRow[serialCol] = i.toString();
//           newRow.id = `EXP-${index}-${i}`;
//           if (newRow["Quantity"] !== undefined) newRow["Quantity"] = 1;
//           expanded.push(newRow);
//         }
//         return;
//       }
//     }
//     expanded.push({ ...row, id: `ROW-${index}` });
//   });
//   return expanded;
// };

// // ==========================================
// // MAIN COMPONENT
// // ==========================================
// export default function AddProject() {
//   const theme = useTheme();
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
//   const API_BASE = getApiBaseUrl(configDetails);

//   // --- STATE ---
//   const [tab, setTab] = useState("upload");
//   const [selectedType, setSelectedType] = useState(APP_CONFIG.PROJECT_TYPES[0].value);
//   const [uploadSource, setUploadSource] = useState("");
//   const [fileName, setFileName] = useState("");

//   // --- DATA STORAGE ---
//   const fullDataRef = useRef([]);
//   const [previewRows, setPreviewRows] = useState([]);
//   const [previewColumns, setPreviewColumns] = useState([]);
//   const [serialColumn, setSerialColumn] = useState("");
//   const [masterList, setMasterList] = useState([]);
//   const [inactiveList, setInactiveList] = useState([]);

//   // --- UI & PAGINATION ---
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [masterFilter, setMasterFilter] = useState("All");
//   const [inactiveFilter, setInactiveFilter] = useState("All");
//   const [selectedMasterIds, setSelectedMasterIds] = useState([]);
//   const [alert, setAlert] = useState({ open: false, msg: "", type: "error" });

//   // ADDED: Pagination State for Master/Inaction tabs
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);

//   const showAlert = (msg, type) => setAlert({ open: true, msg, type });

//   // Reset pagination when filter or tab changes to prevent out-of-bounds errors
//   useEffect(() => {
//     setPage(0);
//   }, [tab, masterFilter, inactiveFilter]);

//   // --- 1. FETCH DATA (FIXED: CLEAR STATE BEFORE LOADING) ---
//   const fetchAllData = async () => {
//     if (!API_BASE) return showAlert("Configuration Error: API URL not found.", "error");

//     try {
//       const [hexaRes] = await Promise.all([
//         axios.get(`${API_BASE}/api/pcb/history`),
//         // axios.get(`${API_BASE}/api/pcb/history`, { params: { type: "OCTA" } })
//       ]);

//       // Combine Raw Data
//       // const allData = [...(hexaRes.data?.PcbData || []), ...(octaRes.data?.PcbData || [])];
//       const allData = [...(hexaRes.data?.PcbData || [])];

//       const processItem = (item) => {
//         let compositeType = item.Type;
//         if (!compositeType && item.type && item.source) {
//           compositeType = `${item.type}-${item.source}`.toUpperCase();
//         }
//         return compositeType || "UNKNOWN";
//       };

//       const activeItems = [];
//       const inactiveItems = [];

//       allData.forEach((item, index) => {
//         // Use DB ID (_id) to ensure strict uniqueness and prevent doubling in UI
//         const uniqueId = item._id || `${item.serialNo}-${item.partNumber}-${index}`;

//         const formatted = {
//           ...item,
//           id: uniqueId,
//           Type: processItem(item)
//         };

//         if (item.status === "Inaction" || item.status === "Assigned") {
//           inactiveItems.push(formatted);
//         } else if (item.status === "New") {
//           activeItems.push(formatted);
//         }
//       });

//       // OVERWRITE state (don't append) to fix the 2300 -> 4600 doubling issue
//       setMasterList(activeItems);
//       setInactiveList(inactiveItems);

//     } catch (err) {
//       console.error("Fetch Error:", err);
//       showAlert(`Connection failed. Check server status.`, "error");
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, [API_BASE]);


//   // --- 2. EXCEL UPLOAD LOGIC ---
//   const handleFileUpload = (e, source) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setFileName(file.name);
//     setUploadSource(source);
   
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const buffer = new Uint8Array(evt.target.result);
      
//       const wb = XLSX.read(buffer, { type: "array" });
//       const ws = wb.Sheets[wb.SheetNames[0]];
//       console.log("ws: ",ws)
//       const json = XLSX.utils.sheet_to_json(ws, { range: APP_CONFIG.EXCEL_START_ROW });
//       console.log("json: ",json)
//       if (json.length === 0) {
//         showAlert("Excel file appears empty.", "error");
//         return;
//       }

//       const originalCols = Object.keys(json[0]);
//       const validCols = originalCols.filter(col => !APP_CONFIG.IGNORED_COLUMNS.includes(col));
//       setPreviewColumns(validCols);

//       const serialCol = validCols.find(
//         (c) => c.toLowerCase().replace(/[^a-z]/g, "") === "serialnumber"
//       ) || validCols.find(c => c.toLowerCase().includes("serial"));

//       setSerialColumn(serialCol);

//       const cleanJson = json.filter(r => {
//         const val = r[serialCol];
//         return val !== undefined && val !== null && String(val).trim() !== "";
//       });

//       const processedRows = serialCol ? expandExcelRows(cleanJson, serialCol) : cleanJson.map((r, i) => ({ ...r, id: `ROW-${i}` }));
//       fullDataRef.current = processedRows;

//       // Show snippet in preview
//       const head = processedRows.slice(0, 5);
//       const tail = processedRows.length > 10 ? processedRows.slice(-5) : [];
//       setPreviewRows(tail.length > 0 ? [...head, { isGap: true, id: 'GAP' }, ...tail] : head);

//       setTab("preview");
//       showAlert(`Parsed ${processedRows.length} rows.`, "success");
//     };
//     reader.readAsArrayBuffer(file);
//     e.target.value = null;
//   };

//   // --- 3. DOWNLOAD PROCESSED DATA ---
//   const handleDownloadProcessed = () => {
//     try {
//       if (!fullDataRef.current.length) return showAlert("No data found.", "warning");
//       const cleanData = fullDataRef.current.map(({ id, ...rest }) => rest);
//       const ws = XLSX.utils.json_to_sheet(cleanData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Processed_Data");
//       XLSX.writeFile(wb, `Processed_${fileName || "Data"}.xlsx`);
//     } catch (err) {
//       showAlert("Download failed.", "error");
//     }
//   };


//   // --- 4. SAVE TO MASTER (COMMIT TO DB) ---
//   const saveToMaster = async () => {
//     const rawData = fullDataRef.current;
//     if (rawData.length === 0) return showAlert("No data to save.", "warning");

//     setIsUploading(true);
//     setUploadProgress(0);
//     let user = JSON.parse(localStorage.getItem("user"));
//     const processedMap = new Map();

//     rawData.forEach((row) => {
//       const findValue = (keys) => {
//         const rowKeys = Object.keys(row);
//         const match = rowKeys.find(k => keys.includes(k.toLowerCase().replace(/[^a-z0-9]/g, "")));
//         return match ? row[match] : null;
//       };

//       let Type = `${selectedType}-${uploadSource}`.toUpperCase();
//       const sNo = row[serialColumn] || findValue(["serialno", "serialnumber", "serial"]);
//       if (!sNo) return;

//       processedMap.set(sNo, {
//         partNumber: findValue(["partnumber", "partno", "pno", "model"]) || "UNKNOWN",
//         serialNo: sNo,
//         PCBserialNoPartNumber: `${sNo}$${findValue(["partnumber", "partno", "pno", "model"]) || "UNKNOWN"}`,
//         productionOrder: row["Production order"],
//         quantity: row["Quantity"],
//         description: row["Description"],
//         userID: user?.id,
//         userName: user?.username,
//         userRole: user?.userRole,
//         userSBU: user?.sbu,
//         userSBUDIV: user?.subdivision,
//         Type: Type,
//       });
//     });

//     const cleanPayload = Array.from(processedMap.values());
//     const totalBatches = Math.ceil(cleanPayload.length / APP_CONFIG.UPLOAD_BATCH_SIZE);
//     let successCount = 0;

//     for (let i = 0; i < totalBatches; i++) {
//       const batch = cleanPayload.slice(i * APP_CONFIG.UPLOAD_BATCH_SIZE, (i + 1) * APP_CONFIG.UPLOAD_BATCH_SIZE);
//       try {
//         await axios.post(`${API_BASE}/api/pcb/upload-bulk`, { type: selectedType, source: uploadSource, csvDataJSON: batch });
//         successCount += batch.length;
//       } catch (err) { console.error("Batch failed", err); }
//       setUploadProgress(Math.round(((i + 1) / totalBatches) * 100));
//     }

//     setIsUploading(false);
//     showAlert(`Saved ${successCount} records.`, "success");
//     if (successCount > 0) {
//       setTab("master");
//       fetchAllData();
//     }
//   };


//   // --- 5. UI ACTIONS ---
//   const handleToggleSelect = (id) => {
//     setSelectedMasterIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
//   };

//   const handleSelectGroup = (isChecked, categoryRows) => {
//     const rowIds = categoryRows.map(r => r.id);
//     setSelectedMasterIds(prev => isChecked ? [...new Set([...prev, ...rowIds])] : prev.filter(id => !rowIds.includes(id)));
//   };

//   const pushToInactive = () => {
//     if (selectedMasterIds.length === 0) return;
//     const selectedItems = masterList.filter(item => selectedMasterIds.includes(item.id));
//     console.log("selcted iteems: ",selectedItems)
//     const groups = {};
//     selectedItems.forEach(item => {
//       const type = item.Type.includes("HEXA") ? "HEXA" : "OCTA";
//       if (!groups[type]) groups[type] = [];
//       // groups[type].push(item.serialNo);
//       groups[type].push(item.PCBserialNoPartNumber);
//     });
//     console.log("groups: ",groups)
//     Promise.all(Object.keys(groups).map(type => 
//       axios.put(`${API_BASE}/api/pcb/update-status`, { type, serialNos: groups[type], status: "Inaction" })
//     )).then(() => {
//       fetchAllData();
//       showAlert(`Successfully Assigned ${selectedItems.length} PCBs`)
//       setSelectedMasterIds([]);
//       setTab("inaction");
//     });
//   };

//   const reassign = (id) => {
//     const item = inactiveList.find(r => r.id === id);
//     if (!item) return;
//     const type = item.Type.includes("HEXA") ? "HEXA" : "OCTA";
//     // axios.put(`${API_BASE}/api/pcb/update-status`, { type, serialNos: [item.serialNo], status: "New" })
//     axios.put(`${API_BASE}/api/pcb/update-status`, { type, serialNos: [item.PCBserialNoPartNumber], status: "New" })
//       .then(() => { fetchAllData(); setTab("master"); });
//   };

//   const getStatusColor = (status) => {
//     const s = (status || "").toLowerCase();
//     if (s === "new") return "primary";
//     if (s === "inaction") return "error";
//     if (s ==="Assigned") return "success"
//     if (s === "completed") return "success";
//     return "default";
//   };

//   // --- 6. PAGINATED TABLE RENDERER ---
//   // Using useMemo to prevent performance lag during checkbox clicks
//   const renderCategoryTables = (dataList, filter, isMaster) => {
//     // Filter by type
//     var categoryData = filter === "All" ? dataList : dataList.filter(d => d.Type === filter);
//     console.log("dataList: ",dataList)
//     // Slice for current page
//     const paginatedData = categoryData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     if (categoryData.length === 0) return <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>No records found.</Paper>;

//     const allOnPageSelected = paginatedData.length > 0 && paginatedData.every(r => selectedMasterIds.includes(r.id));

//     return (
//       <Paper variant="outlined" sx={{ mb: 3, borderRadius: 1, overflow: 'hidden' }}>
//   <Box sx={{ px: 2, py: 1, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//     <Typography variant="caption" sx={{ fontWeight: 700 }}>{filter} - ({categoryData.length} TOTAL)</Typography>
//     {isMaster && (
//       <Stack direction="row" spacing={1} alignItems="center">
//         <Typography variant="body2" sx={{fontWeight:"bold"}}>SELECT ALL IN CURRENT PAGE</Typography>
//         <Checkbox size="small" checked={allOnPageSelected} onChange={(e) => handleSelectGroup(e.target.checked, paginatedData)} />
//       </Stack>
//     )}
//   </Box>
//   <TableContainer>
//     <Table size="small" stickyHeader>
//       <TableHead>
//         <TableRow>
//           {isMaster && <TableCell padding="checkbox" />}
//           {APP_CONFIG.DISPLAY_COLUMNS.map(col => (
//             <TableCell key={col} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>{col.toUpperCase()}</TableCell>
//           ))}
//           <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>STATUS</TableCell>
//           {!isMaster && <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1rem' }}>ACTION</TableCell>}
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {paginatedData.map((row) => {
//           const isSelected = selectedMasterIds.includes(row.id);
          
//           // Logic Constants for readability
//           const isNew = row.status === "New";
//           const isInaction = row.status === "Inaction";
//           const isAssigned = row.status === "Assigned";
//           return (
//             <TableRow key={row.id} hover selected={isSelected}>
//               {isMaster && (
//                 <TableCell padding="checkbox" sx={{opacity:0.8,fontWeight:600}}>
//                   {console.log("sjfosnfndsvnsfnjsdnjs: ",row)}
//                   <Checkbox size="medium" checked={isSelected} onChange={() => handleToggleSelect(row.id)} />
//                 </TableCell>
//               )}
              
//               {APP_CONFIG.DISPLAY_COLUMNS.map(col => (
//                 <TableCell key={col} sx={{opacity:0.8,fontWeight:600}}>{row[col]}</TableCell>
//               ))}
              
//               <TableCell>
//                 <Chip 
//                   label={row.status == "Inaction"?"Yet to Start":(row.status== "New"?"Yet to Assign":"In Progress")} 
//                   size="large" 
//                   color={getStatusColor(row.status)} 
//                   sx={{ height: 20, fontSize: '0.8rem',fontWeight:"bold" }} 
//                 />
//               </TableCell>

//               {!isMaster && (
//                 <TableCell align="center">
//                   {/* Hide completely if New, otherwise show button */}
//                   {!isNew && (
//                     <Button 
//                       size="small" 
//                       onClick={() => reassign(row.id)}
//                       disabled={isAssigned} // Disable if Inaction
//                     >
//                       Restore
//                     </Button>
//                   )}
//                 </TableCell>
//               )}
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   </TableContainer>
//   <TablePagination
//     component="div"
//     count={categoryData.length}
//     page={page}
//     onPageChange={(e, newPage) => {
//       setPage(newPage); // Update page first
//       setSelectedMasterIds([]); // Then reset selectedMasterIds
//     }}
//     rowsPerPage={rowsPerPage}
//     onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
//     rowsPerPageOptions={[10, 25, 50, 100]}
//   />
// </Paper>


//     );
//   };

//   // --- 7. FINAL RENDER ---
//   return (
//     <Box sx={{ width: '100%', bgcolor: '#f4f6f8', minHeight: '100vh', p: 3 }}>
//       <Paper elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
//         <Tabs value={tab} onChange={(e, v) => setTab(v)} indicatorColor="primary" textColor="primary">
//           <Tab sx={{fontSize:"1.2rem" ,color:"black"}} icon={<CloudUploadIcon />} label="Import" value="upload" iconPosition="start" />
//           <Tab sx={{fontSize:"1.2rem" ,color:"black"}} icon={<AddIcon />} label="Preview" value="preview" iconPosition="start" disabled={!fullDataRef.current.length} />
//           <Tab sx={{fontSize:"1.2rem" ,color:"black"}} icon={<StorageIcon />} label="Yet To Assign" value="master" iconPosition="start" ></Tab>
//           <Tab sx={{fontSize:"1.2rem" ,color:"black"}} icon={<BlockIcon />} label="Yet To Start" value="inaction" iconPosition="start" />
//         </Tabs>

//         {tab === "upload" && (
//           <Box sx={{ p: 4, textAlign: 'center' }}>
//             <FormControl size="large" sx={{ minWidth: 250, mb: 4 }}>
//               <InputLabel>Project Type</InputLabel>
//               <Select value={selectedType} label="Project Type" onChange={(e) => setSelectedType(e.target.value)}>
//                 {APP_CONFIG.PROJECT_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
//               </Select>
//             </FormControl>
//             <Stack direction="row" spacing={3} justifyContent="center">
//               {["child", "main"].map((src) => (
//                 <Box key={src} component="label" sx={{ flex: 1,maxWidth: 300, border: '1px solid #ccc', p: 4, cursor: 'pointer', fontSize:"1rem",borderRadius: 2, '&:hover': { bgcolor: '#f0f7ff' } }}>
//                   <input type="file" hidden onChange={(e) => handleFileUpload(e, src)} accept=".xlsx, .xls" />
//                   <Typography variant="h6" sx={{ textTransform: 'capitalize'}}>{src} Excel</Typography>
//                 </Box>
//               ))}
//             </Stack>
//             {fileName && <Alert severity="info" sx={{ mt: 2, display: 'inline-flex'  }}>Selected: {fileName}</Alert>}
//           </Box>
//         )}

//         {tab === "preview" && (
//           <Box sx={{ p: 2 }}>
//             <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
//               <Typography>Total Processed: {fullDataRef.current.length}</Typography>
//               <Stack direction="row" spacing={2}>
//                 {/* <Button variant="outlined" onClick={handleDownloadProcessed} startIcon={<DownloadIcon />}>Download</Button> */}
//                 <Button variant="contained" sx={{width:"fit-content"}} onClick={saveToMaster} disabled={isUploading}>{isUploading ? "Uploading..." : "Save to DB"}</Button>
//               </Stack>
//             </Stack>
//             {isUploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />}
//             <TableContainer component={Paper} variant="outlined">
//               <Table size="small">
//                 <TableHead><TableRow>{previewColumns.map(c => <TableCell key={c} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>{c}</TableCell>)}</TableRow></TableHead>
//                 <TableBody>
//                   {previewRows.map((row, i) => (
//                     <TableRow key={row.id} sx={{opacity:0.8,fontWeight:600}}>
//                       {row.isGap ? <TableCell colSpan={100} align="center">...</TableCell> : previewColumns.map(c => <TableCell sx={{opacity:0.8,fontWeight:600}} key={c}>{row[c]}</TableCell>)}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         )}

//         {(tab === "master" || tab === "inaction") && (
          
//           <Box sx={{ p: 3 }}>
//             <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
//               <FormControl size="small" sx={{ minWidth: 200 }}>
//                 <Select value={tab === "master" ? masterFilter : inactiveFilter} onChange={(e) => tab === "master" ? setMasterFilter(e.target.value) : setInactiveFilter(e.target.value)}>
//                   {APP_CONFIG.FILTER_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//                 </Select>
//               </FormControl>
//               {tab === "master" && (
//                 <Button variant="contained" color="warning" onClick={pushToInactive} disabled={!selectedMasterIds.length}>
//                   Move Selected ({selectedMasterIds.length})
//                 </Button>
//               )}
//             </Box>
//             {/* Call the Paginated Table Renderer */}
//             {console.log("master list",masterList)}
//             {renderCategoryTables(
              
//               tab === "master" ? masterList : inactiveList,
//               tab === "master" ? masterFilter : inactiveFilter,
//               tab === "master"
//             )}
//           </Box>
//         )}
//       </Paper>
//       <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
//         <Alert severity={alert.type}>{alert.msg}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }


























































// // AddProject.js - Final Refined Version
// // Optimized for Large Datasets, Strict Validation, and Specific Preview Layout
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import axios from "axios";

// // =====================
// // MUI COMPONENTS
// // =====================
// import {
//   Box, Typography, Button, Grid, Table, TableHead, TableRow, TableCell,
//   TableBody, Checkbox, Snackbar, Alert, Tabs, Tab, Paper, TableContainer,
//   Stack, Chip, FormControl, InputLabel, Select, MenuItem, LinearProgress,
//   TablePagination, TextField, InputAdornment
// } from "@mui/material";

// // =====================
// // MUI ICONS
// // =====================
// import SearchIcon from "@mui/icons-material/Search";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import StorageIcon from "@mui/icons-material/Storage";
// import BlockIcon from "@mui/icons-material/Block";
// import AddIcon from "@mui/icons-material/Add";

// // ==========================================
// // 1. CENTRALIZED CONFIGURATION
// // ==========================================
// const APP_CONFIG = {
//   UPLOAD_BATCH_SIZE: 50, // Limits rows per API call to prevent server timeout
//   DISPLAY_COLUMNS: ["serialNo", "partNumber", "productionOrder", "quantity"],
//   IGNORED_COLUMNS: [
//     "SMT Status", "SAP Material issue", "Labour hour booking", 
//     "Type", "id", "_id", "status", "__v", "createdAt", "updatedAt", "source", "type"
//   ],
//   PROJECT_TYPES: [
//     { value: "HEXA", label: "HEXA" },
//     { value: "OCTA", label: "OCTA" }
//   ],
//   FILTER_CATEGORIES: ["All", "HEXA-CHILD", "HEXA-MAIN", "OCTA-CHILD", "OCTA-MAIN"]
// };

// // Resolves the server address from Redux store or local fallback
// const getApiBaseUrl = (configDetails) => {
//   if (configDetails?.project?.[0]?.ServerIP?.[0]?.NodeServerIP) {
//     return configDetails.project[0].ServerIP[0].NodeServerIP;
//   }
//   return "http://localhost:8082";
// };

// export default function AddProject() {
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
//   const API_BASE = getApiBaseUrl(configDetails);

//   // --- STATE MANAGEMENT ---
//   const [tab, setTab] = useState("upload");
//   const [selectedType, setSelectedType] = useState(APP_CONFIG.PROJECT_TYPES[0].value);
//   const [uploadSource, setUploadSource] = useState("");
//   const [fileName, setFileName] = useState("");

//   // --- DATA STORAGE ---
//   const [fullPreviewData, setFullPreviewData] = useState([]); // Stores expanded Excel rows
//   const [previewColumns, setPreviewColumns] = useState([]); // Dynamic columns from Excel
//   const [serialColumn, setSerialColumn] = useState(""); // Stores detected serial key
//   const [masterList, setMasterList] = useState([]); // "Yet To Assign" data
//   const [inactiveList, setInactiveList] = useState([]); // "Yet To Start" data

//   // --- UI & SEARCH ---
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [masterFilter, setMasterFilter] = useState("All");
//   const [inactiveFilter, setInactiveFilter] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedMasterIds, setSelectedMasterIds] = useState([]); // Multi-select tracking
//   const [alert, setAlert] = useState({ open: false, msg: "", type: "error" });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);

//   const showAlert = (msg, type) => setAlert({ open: true, msg, type });

//   // Reset pagination when switching tabs or filters to avoid out-of-bounds errors
//   useEffect(() => { setPage(0); }, [tab, masterFilter, inactiveFilter]);

//   // --- 1. DATA SYNCHRONIZATION ---
//   const fetchAllData = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/api/pcb/history`);
//       const allData = res.data?.PcbData || [];
//       const active = [];
//       const inactive = [];

//       allData.forEach((item, index) => {
//         // Normalizes composite Type (e.g., HEXA-MAIN)
//         const typeStr = item.Type || (item.type && item.source ? `${item.type}-${item.source}`.toUpperCase() : "UNKNOWN");
//         const formatted = { ...item, id: item._id || `${item.serialNo}-${index}`, Type: typeStr };
        
//         // Categorize based on backend status
//         if (item.status === "Inaction" || item.status === "Assigned") {
//           inactive.push(formatted);
//         } else if (item.status === "New") {
//           active.push(formatted);
//         }
//       });

//       setMasterList(active);
//       setInactiveList(inactive);
//     } catch (err) { showAlert("Server Connection Error.", "error"); }
//   };

//   useEffect(() => { fetchAllData(); }, [API_BASE]);

//   // --- 2. EXCEL PARSING & BREAKDOWN LOGIC ---
//   const handleFileUpload = (e, source) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const buffer = new Uint8Array(evt.target.result);
//         const wb = XLSX.read(buffer, { type: "array" });
//         const ws = wb.Sheets[wb.SheetNames[0]];

//         // VALIDATION: Check first row title against selected project configuration
//         const headerRaw = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
//         const excelTitle = headerRaw && headerRaw[0] ? headerRaw[0].toString().toUpperCase().replace(/\s+/g, ' ').trim() : "";
//         const expectedTerm = `${selectedType} ${source.toUpperCase()}`;

//         if (!excelTitle.includes(expectedTerm)) {
//           throw new Error(`Invalid File! Header must contain "${expectedTerm}". Found: "${excelTitle}"`);
//         }

//         // PARSING: Reads data starting from headers (Row 2)
//         const json = XLSX.utils.sheet_to_json(ws, { range: 1, defval: "" });
//         if (json.length === 0) throw new Error("Excel is empty below header row.");

//         const firstRowKeys = Object.keys(json[0]);
//         // Identify crucial columns by substring match to handle minor naming variations
//         const sCol = firstRowKeys.find(c => c.toLowerCase().replace(/\s/g, "").includes("serial"));
//         const qCol = firstRowKeys.find(c => c.toLowerCase().replace(/\s/g, "").includes("quantity"));

//         if (!sCol) throw new Error("Serial Number column not detected. Please verify Excel headers.");

//         const expanded = [];
//         json.forEach((row, idx) => {
//           const rawSerial = String(row[sCol] || "").trim();
//           if (!rawSerial) return;

//           const cleanSerial = rawSerial.replace(/\s/g, "");
//           const qty = parseInt(row[qCol]) || 1;

//           // LOGIC: Breakdown Serial Range (e.g., 100-105)
//           if (cleanSerial.includes("-")) {
//             const [start, end] = cleanSerial.split("-").map(v => parseInt(v, 10));
//             if (isNaN(start) || isNaN(end) || start > end) throw new Error(`Invalid range: ${rawSerial} at Row ${idx + 2}`);
//             for (let i = start; i <= end; i++) {
//               expanded.push({ ...row, [sCol]: i.toString(), serialNo: i.toString(), quantity: 1, id: `EXP-${idx}-${i}` });
//             }
//           } 
//           // LOGIC: Breakdown Quantity > 1 (starting from single numeric serial)
//           else if (qty > 1) {
//             const startSerial = parseInt(cleanSerial, 10);
//             if (isNaN(startSerial)) throw new Error(`Quantity breakdown requires numeric serial at Row ${idx + 2}`);
//             for (let i = 0; i < qty; i++) {
//               const currentSerial = (startSerial + i).toString();
//               expanded.push({ ...row, [sCol]: currentSerial, serialNo: currentSerial, quantity: 1, id: `QTY-${idx}-${i}` });
//             }
//           } 
//           // LOGIC: Standard single entry
//           else {
//             expanded.push({ ...row, serialNo: rawSerial, quantity: 1, id: `ROW-${idx}` });
//           }
//         });

//         setSerialColumn(sCol);
//         setPreviewColumns(firstRowKeys.filter(k => !APP_CONFIG.IGNORED_COLUMNS.includes(k)));
//         setFullPreviewData(expanded);
//         setUploadSource(source);
//         setFileName(file.name);
//         setTab("preview");
//         showAlert(`Successfully expanded to ${expanded.length} records.`, "success");

//       } catch (err) { 
//         showAlert(err.message, "error"); 
//       }
//     };
//     reader.readAsArrayBuffer(file);
//     e.target.value = null; // Clears input for re-uploading the same file
//   };

//   // --- 3. DATABASE SUBMISSION ---
//   const saveToMaster = async () => {
//     setIsUploading(true);
//     setUploadProgress(0);
//     const user = JSON.parse(localStorage.getItem("user"));
    
//     // Map internal rows to Backend Schema
//     const payload = fullPreviewData.map(row => ({
//       partNumber: row["partNumber"] || row["Part Number"] || row["partnumber"] || "UNKNOWN",
//       serialNo: row.serialNo,
//       PCBserialNoPartNumber: `${row.serialNo}$${row["partNumber"] || row["Part Number"] || "UNKNOWN"}`,
//       productionOrder: row["productionOrder"] || row["Production order"] || row["productionorder"],
//       quantity: 1,
//       description: row["description"] || row["Description"] || "",
//       userID: user?.id,
//       userName: user?.username,
//       Type: `${selectedType}-${uploadSource}`.toUpperCase(),
//     }));

//     try {
//       const totalBatches = Math.ceil(payload.length / APP_CONFIG.UPLOAD_BATCH_SIZE);
//       for (let i = 0; i < totalBatches; i++) {
//         const batch = payload.slice(i * APP_CONFIG.UPLOAD_BATCH_SIZE, (i + 1) * APP_CONFIG.UPLOAD_BATCH_SIZE);
//         await axios.post(`${API_BASE}/api/pcb/upload-bulk`, { type: selectedType, source: uploadSource, csvDataJSON: batch });
//         setUploadProgress(Math.round(((i + 1) / totalBatches) * 100));
//       }
//       showAlert("Upload Successful.", "success");
//       setTab("master");
//       setFullPreviewData([]);
//       fetchAllData();
//     } catch (err) {
//       showAlert("Upload Failed. Check network connection.", "error");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // --- 4. TABLE RENDER LOGIC ---
//   const renderTable = (dataList, isMaster, filterVal, isPreview = false) => {
//     // Filter data based on category and search query
//     const categoryData = filterVal === "All" ? dataList : dataList.filter(d => d.Type === filterVal);
//     const filtered = categoryData.filter(item => {
//       const q = searchQuery.toLowerCase();
//       return (
//         item.serialNo?.toString().toLowerCase().includes(q) || 
//         item.partNumber?.toString().toLowerCase().includes(q) || 
//         (item["Part Number"]?.toString().toLowerCase().includes(q)) ||
//         item.productionOrder?.toString().toLowerCase().includes(q) ||
//         (item["Production order"]?.toString().toLowerCase().includes(q))
//       );
//     });

//     const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     return (
//       <Paper variant="outlined">
//         <TableContainer sx={{ maxHeight: '65vh' }}>
//           <Table size="small" stickyHeader>
//             <TableHead>
//               <TableRow>
//                 {/* Checkbox only for Master (Yet To Assign) tab */}
//                 {isMaster && !isPreview && <TableCell padding="checkbox" sx={{ bgcolor: '#f8f9fa' }} />}
                
//                 {/* Dynamically generated headers for Preview; Config-based for others */}
//                 {isPreview 
//                   ? previewColumns.map(col => (<TableCell key={col} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>{col.toUpperCase()}</TableCell>))
//                   : APP_CONFIG.DISPLAY_COLUMNS.map(col => (<TableCell key={col} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>{col.toUpperCase()}</TableCell>))
//                 }

//                 {/* Status and Action columns excluded from Preview tab */}
//                 {!isPreview && (
//                   <>
//                     <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>STATUS</TableCell>
//                     {!isMaster && <TableCell align="center" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>ACTION</TableCell>}
//                   </>
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginated.map((row) => (
//                 <TableRow key={row.id} hover selected={selectedMasterIds.includes(row.id)}>
//                   {isMaster && !isPreview && (
//                     <TableCell padding="checkbox">
//                       <Checkbox checked={selectedMasterIds.includes(row.id)} onChange={() => {
//                         setSelectedMasterIds(prev => prev.includes(row.id) ? prev.filter(i => i !== row.id) : [...prev, row.id]);
//                       }} />
//                     </TableCell>
//                   )}

//                   {/* Cell Data Logic */}
//                   {isPreview ? (
//                     previewColumns.map(col => <TableCell key={col}>{row[col]}</TableCell>)
//                   ) : (
//                     <>
//                       <TableCell>{row.serialNo}</TableCell>
//                       <TableCell>{row.partNumber || row["Part Number"]}</TableCell>
//                       <TableCell>{row.productionOrder || row["Production order"]}</TableCell>
//                       <TableCell>{row.quantity}</TableCell>
//                     </>
//                   )}

//                   {/* Action/Status Rendering logic (Skipped for Preview) */}
//                   {!isPreview && (
//                     <>
//                       <TableCell>
//                         <Chip 
//                           label={row.status === "New" || !row.status ? "Yet To Assign" : "Yet To Start"} 
//                           size="small" 
//                           color={row.status === "New" || !row.status ? "primary" : "error"} 
//                           sx={{ fontWeight: 'bold' }}
//                         />
//                       </TableCell>
//                       {!isMaster && (
//                         <TableCell align="center">
//                           <Button size="small" variant="outlined" onClick={() => {
//                             axios.put(`${API_BASE}/api/pcb/update-status`, { 
//                               type: row.Type.split("-")[0], 
//                               serialNos: [row.PCBserialNoPartNumber], 
//                               status: "New" 
//                             }).then(() => fetchAllData());
//                           }}>Restore</Button>
//                         </TableCell>
//                       )}
//                     </>
//                   )}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination component="div" count={filtered.length} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
//       </Paper>
//     );
//   };

//   return (
//     <Box sx={{ width: '100%', bgcolor: '#f4f6f8', minHeight: '100vh', p: 3 }}>
//       <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
//         {/* TOP NAVIGATION TABS */}
//         <Tabs value={tab} onChange={(e, v) => setTab(v)} indicatorColor="primary" textColor="primary">
//           <Tab label="Import" value="upload" icon={<CloudUploadIcon />} iconPosition="start" />
//           <Tab label="Preview" value="preview" icon={<AddIcon />} iconPosition="start" disabled={!fullPreviewData.length} />
//           <Tab label={`Yet To Assign (${masterList.length})`} value="master" icon={<StorageIcon />} iconPosition="start" />
//           <Tab label={`Yet To Start (${inactiveList.length})`} value="inaction" icon={<BlockIcon />} iconPosition="start" />
//         </Tabs>

//         {/* TAB 1: UPLOAD SCREEN */}
//         {tab === "upload" && (
//           <Box sx={{ p: 4, textAlign: 'center' }}>
//             <FormControl sx={{ minWidth: 250, mb: 4 }}>
//               <InputLabel>Project Type</InputLabel>
//               <Select value={selectedType} label="Project Type" onChange={(e) => setSelectedType(e.target.value)}>
//                 {APP_CONFIG.PROJECT_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
//               </Select>
//             </FormControl>
//             <Stack direction="row" spacing={3} justifyContent="center">
//               {["child", "main"].map(src => (
//                 <Box key={src} component="label" sx={{ flex: 1, maxWidth: 300, border: '2px dashed #ccc', p: 4, borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f0f7ff', borderColor: 'primary.main' } }}>
//                   <input type="file" hidden onChange={(e) => handleFileUpload(e, src)} accept=".xlsx, .xls" />
//                   <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{src} Excel</Typography>
//                 </Box>
//               ))}
//             </Stack>
//           </Box>
//         )}

//         {/* TAB 2: PREVIEW SCREEN (No Status/Action Columns) */}
//         {tab === "preview" && (
//           <Box sx={{ p: 2 }}>
//             <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={3}><Typography variant="subtitle2">Total Breakdown: <strong>{fullPreviewData.length}</strong></Typography></Grid>
//                 <Grid item xs={3}><Typography variant="subtitle2">Start Serial: <strong>{fullPreviewData[0]?.serialNo}</strong></Typography></Grid>
//                 <Grid item xs={3}><Typography variant="subtitle2">End Serial: <strong>{fullPreviewData[fullPreviewData.length - 1]?.serialNo}</strong></Typography></Grid>
//                 <Grid item xs={3} align="right">
//                   <Button variant="contained" onClick={saveToMaster} disabled={isUploading}>{isUploading ? "Uploading..." : "Save to DB"}</Button>
//                 </Grid>
//               </Grid>
//             </Paper>
//             {isUploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />}
//             {renderTable(fullPreviewData, false, "All", true)}
//           </Box>
//         )}

//         {/* TAB 3 & 4: DATABASE VIEWS */}
//         {(tab === "master" || tab === "inaction") && (
//           <Box sx={{ p: 3 }}>
//             <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
//               <FormControl size="small" sx={{ minWidth: 200 }}>
//                 <Select value={tab === "master" ? masterFilter : inactiveFilter} onChange={(e) => tab === "master" ? setMasterFilter(e.target.value) : setInactiveFilter(e.target.value)}>
//                   {APP_CONFIG.FILTER_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//                 </Select>
//               </FormControl>
//               <TextField 
//                 size="small" 
//                 placeholder="Search Serial / Part / Production Number..." 
//                 fullWidth 
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} /> }} 
//               />
//               {tab === "master" && (
//                 <Button variant="contained" color="warning" disabled={!selectedMasterIds.length} onClick={() => {
//                   const selected = masterList.filter(item => selectedMasterIds.includes(item.id));
//                   const serials = selected.map(i => i.PCBserialNoPartNumber);
//                   axios.put(`${API_BASE}/api/pcb/update-status`, { type: selectedType, serialNos: serials, status: "Inaction" }).then(() => { 
//                     fetchAllData(); setSelectedMasterIds([]); setTab("inaction"); 
//                   });
//                 }} sx={{ minWidth: 150 }}>Assign</Button>
//               )}
//             </Stack>
//             {renderTable(tab === "master" ? masterList : inactiveList, tab === "master", tab === "master" ? masterFilter : inactiveFilter)}
//           </Box>
//         )}
//       </Paper>
//       <Snackbar open={alert.open} autoHideDuration={5000} onClose={() => setAlert({ ...alert, open: false })}>
//         <Alert severity={alert.type}>{alert.msg}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }




























































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