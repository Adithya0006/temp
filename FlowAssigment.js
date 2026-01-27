



// //Flow Assignment card

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Tabs,
//   Tab,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Container,
//   Stack,
//   CardContent,
//   Button,
//   Alert,
//   Card,
//   CircularProgress
// } from "@mui/material";
// import StorageIcon from '@mui/icons-material/Storage';
// import SaveIcon from '@mui/icons-material/Save';
// import * as XLSX from "xlsx";
// // Icons
// import TableViewIcon from '@mui/icons-material/TableView';
// import HomeIcon from '@mui/icons-material/Home';
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ListAltIcon from '@mui/icons-material/ListAlt';
// import AssignmentIcon from '@mui/icons-material/Assignment';

// // 1. DUMMY DATA (Replace this with API response later)
// const DUMMY_DATA = [
//   { id: 101, projectName: "Alpha Protocol", manager: "Alice Smith", status: "Active", budget: "$12,000", deadline: "2025-10-15" },
//   { id: 102, projectName: "Beta Build", manager: "Bob Jones", status: "Pending", budget: "$5,000", deadline: "2025-11-01" },
//   { id: 103, projectName: "Gamma Test", manager: "Charlie Day", status: "Completed", budget: "$8,500", deadline: "2025-09-20" },
//   { id: 104, projectName: "Delta Deployment", manager: "Diana Prince", status: "Active", budget: "$22,000", deadline: "2025-12-10" },
//   { id: 105, projectName: "Epsilon Analytics", manager: "Ethan Hunt", status: "Rejected", budget: "$0", deadline: "2025-08-05" },
// ];

// // Define columns for the table header
// const COLUMNS = ["ID", "PCB Operation Id", "Pcb Process Name", "Assigned To", "Assigned To Name", "Assigned To Name Initial", "Assigned To Name MRL", "Assigned To Name MRL Expiry"];

// const BUTTON_OPTS = [
//   { id: "1", name: "VIEW FLOW ASSIGNMENT", icon: <ListAltIcon /> },
//   { id: "2", name: "UPLOAD FLOW ASSIGNMENT", icon: <AssignmentIcon /> },
// ];
// const PROJECT_TYPES = [
//   { value: "HEXA", label: "HEXA" },
//   { value: "OCTA", label: "OCTA" }
// ];


// const fetchAllData = async () => {
//   try {
//     const [hexaRes, octaRes] = await Promise.all([
//       //axios.get(fetchPCB, { params: { type: "HEXA" } }),
//       //axios.get(fetchPCB, { params: { type: "OCTA" } })
//     ]);

//     const hexaData = hexaRes.data?.PcbData || [];
//     const octaData = octaRes.data?.PcbData || [];
    
//     // 1. Combine raw data
//     const rawData = [...hexaData, ...octaData];

//     // 2. DEDUPLICATE: Use a Map to ensure unique Serial Numbers
//     // This fixes the "Double Records" issue if the API returns overlaps
//     const uniqueMap = new Map();
//     rawData.forEach((item) => {
//       if (item.serialNo) {
//         uniqueMap.set(item.serialNo, item);
//       }
//     });
//     const allData = Array.from(uniqueMap.values());

//     // Helper to ensure Type exists
//     const processItem = (item) => {
//       let compositeType = item.Type;
//       if (!compositeType && item.type && item.source) {
//            compositeType = `${item.type}-${item.source}`.toUpperCase();
//       }
//       return compositeType || "UNKNOWN";
//     };

//     const activeItems = allData
//       //  .filter((item) => item.status !== "Inaction")
// //this condition to display table data only when it new
//       .filter((item) => item.status === "New")
//       .map((item) => ({
//         id: item.serialNo, 
//         ...item,
//         Type: processItem(item),
//         status: item.status,
//       }));

//     const inactiveItems = allData
//             //this condition to display table data only when it is Inaction
//       // .filter((item) => item.status != "New")
//      .filter((item) => item.status === "Inaction")
//       .map((item) => ({
//         id: item.serialNo,
//         ...item,
//         Type: processItem(item),
//         status: item.status,
//       }));

//     //setMasterList(activeItems);
//     //setInactiveList(inactiveItems);

//   } catch (err) {
//     console.error("Fetch Error:", err);
//     //showAlert("Failed to load data.", "error");
//   }
// };
// export default function FlowAssigment() {

//   // State to store API data
//   const [tableData, setTableData] = useState([]);
//   const [Bid, SetBid] = React.useState("1");
//   const [fileName, setFileName] = useState("");
//   const [uploadSource, setUploadSource] = useState();
//   const [previewColumns, setPreviewColumns] = useState([]);
//   const [previewRows, setPreviewRows] = useState([]);
//   const [serialColumn, setSerialColumn] = useState(""); 
//   const [tab, setTab] = useState("upload");


//   var UploadBulkPCB = "http://192.168.0.20:8082" + API1
//   const [alert, setAlert] = useState({ open: false, msg: "", type: "error" });


//   const showAlert = (msg, type) => setAlert({ open: true, msg, type });
//   function dataSelection(id) {
//     SetBid(id);
//     setError(null); // Clear errors when switching tabs
//   }








//   // State for loading/error handling (Optional but recommended)
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false); 
//   // State for Tab switching
//   const [currentTab, setCurrentTab] = useState("view"); // Default to 'view' or 'home'
//   const [masterList, setMasterList] = useState([]);
//   const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0].value);


//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
//   var API1 = "/getdefflow";
//   var API2="/upload_task_data"

//   var fetchDefaultFlowPCB = "http://192.168.0.20:8082" + API1
//   var postAssFlow="http://172.195.121.91:2000";

//   if (configDetails != undefined) {

//     if (configDetails.project[0].ServerIP != undefined) {

      


//       if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

//         fetchDefaultFlowPCB = configDetails.project[0].ServerIP[0].NodeServerIP + API1;
//         postAssFlow= configDetails.project[0].ServerIP[0].PythonServerIP + API2;
//       }


//     }

//   }




//   // Handle Tab Change
//   const handleTabChange = (event, newValue) => {
//     setCurrentTab(newValue);
//   };



//   useEffect(() => {
//     // Only fetch if we are on the 'view' tab to save bandwidth
//     if (currentTab === "view") {
//       setLoading(true);

//       // Replace with your actual API URL
//       axios.get(fetchDefaultFlowPCB)
//         .then((response) => {
//           // Assuming your API returns an array or an object containing the array
//           // Adjust 'response.data.PcbData' based on your actual API structure
//           const data = response.data.PcbData || response.data || [];
//           setTableData(data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error fetching data:", err);
//           setError("Failed to load data");
//           setLoading(false);
//         });
//     }
//   }, [currentTab]); // specific dependency ensures it runs when tab changes





//   const [file,setFile]=useState();
//   const handleFileUpload = async(event) => {
    

  
//      setFile(event.target.files[0]);
//     console.log("file: ",file)
//     if (file) {
//         if (!file) {
//             alert("Please select a file.");  // Or display a more user-friendly message
//             return;
//           }
//         // saveToMaster()
//         // .then(data => {
//         //    // Handle successful upload (e.g., display a message)
//         //    console.log("Upload successful:", data);
//         // })
//         // .catch(error => {
//         //    //Handle error
//         //    console.error("Upload failed:", error);
//         // });
//     }
//   };




//   const saveToMaster= async () =>  {
//     console.log("form data init: ",file)
//     // let user = JSON.parse(localStorage.getItem("user"));
//     // const existingSerials = new Set(
//     //   masterList.map((item) => String(item.serialNo || "").trim().toLowerCase())
//     // );

//     // try {
//         const formData = new FormData();
//         formData.append('file', file); //Append the file object
//         console.log("form data: ",formData)
//         const response = await axios.post(postAssFlow, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data' // Crucial header for file uploads
//           }
//         });
        
//         console.log('File uploaded successfully:', response.data);
//         console.log("response data: ",response.data);
//         return response.data; // or handle success as needed
    
//     //   } catch (error) {
//     //     console.error('Error uploading file:', error);
//     //     throw error; // Re-throw for handling in the component
//     //   }
//   };
//   return (
//     <Container maxWidth="xxl" sx={{ mt: 4 }}>



//         {/* 1. PROFESSIONAL BUTTONS SECTION */}
//         <Container sx={{ mt: 3, mb: 3 }}>
//             <Paper elevation={3} sx={{ borderRadius: '50px', width: 'fit-content', mx: 'auto', p: 0.5, bgcolor: '#f5f5f5' }}>
//                 <Stack direction="row" spacing={1}>
//                     {BUTTON_OPTS.map((item) => {
//                         const isActive = Bid === item.id;
//                         return (
//                             <Button
//                                 key={item.id}
//                                 onClick={() => dataSelection(item.id)}
//                                 variant={isActive ? "contained" : "text"}
//                                 startIcon={item.icon}
//                                 sx={{
//                                     borderRadius: '50px',
//                                     px: 4,
//                                     py: 1,
//                                     fontWeight: 'bold',
//                                     textTransform: 'none',
//                                     transition: 'all 0.3s ease',
//                                     backgroundColor: isActive ? 'primary.main' : 'transparent',
//                                     color: isActive ? 'white' : 'text.secondary',
//                                     boxShadow: isActive ? 4 : 0,
//                                     '&:hover': {
//                                         backgroundColor: isActive ? 'primary.dark' : 'rgba(0,0,0,0.05)',
//                                     }
//                                 }}
//                             >
//                                 {item.name}
//                             </Button>
//                         )
//                     })}
//                 </Stack>
//             </Paper>
//         </Container>

//              {/* Error Display */}
//              {error && (
//             <Alert severity="error" sx={{ mb: 2, mx: 2 }}>{error}</Alert>
//         )}


//      {/* Loading Display */}
//      {isLoading && (
//             <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
//                 <CircularProgress />
//             </Box>
//         )}



// {Bid === "1" && !isLoading && (
//             <>
//                   <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>

// {/* TABS HEADER */}
// <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5" }}>
//   <Tabs
//     value={currentTab}
//     onChange={handleTabChange}
//     textColor="primary"
//     indicatorColor="primary"
//     centered
//   >
//     {/* <Tab icon={<HomeIcon />} iconPosition="start" label="Home" value="home" /> */}
//     <Tab icon={<TableViewIcon />} iconPosition="start" label="View Data" value="view" />
//   </Tabs>
// </Box>

// {/* TAB PANEL 1: HOME (Just placeholder content) */}
// {/* {currentTab === "home" && (
//   <Box sx={{ p: 5, textAlign: "center" }}>
//     <Typography variant="h5" color="text.secondary">
//       Welcome to the Dashboard
//     </Typography>
//     <Typography variant="body1">
//       Click the <b>"View Data"</b> tab to see the table.
//     </Typography>
//   </Box>
// )} */}

// {/* TAB PANEL 2: VIEW DATA TABLE */}
// {currentTab === "view" && (
//   <Box sx={{ p: 3 }}>
//     <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//       Project Details
//     </Typography>

//     <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 440 }}>
//       <Table stickyHeader aria-label="sticky table">

//         {/* Table Head */}
//         <TableHead>
//           <TableRow>
//             {COLUMNS.map((col) => (
//               <TableCell
//                 key={col}
//                 sx={{ fontWeight: "bold", bgcolor: "#eeeeee" }}
//               >
//                 {col}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         {/* Table Body */}
//         <TableBody>
//           {loading ? (
//             <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
//           ) : tableData.length > 0 ? (
//             tableData.map((row) => (
//               <TableRow hover key={row.id || row.id}> {/* Use unique key from DB */}
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.pcbOperationId}</TableCell>
//                 <TableCell>{row.pcbProcessName}</TableCell>
//                 {/* Map other fields based on your API keys */}
//                 <TableCell>{row.assignedTo}</TableCell>
//                 <TableCell>{row.assignedToName}</TableCell>
//                 <TableCell>{row.assignedToNameInitial}</TableCell>
//                 <TableCell>{row.assignedToNameMRL}</TableCell>
//                 <TableCell>{row.assignedToNameMRLExpiry}</TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow><TableCell colSpan={6} align="center">No Data Found</TableCell></TableRow>
//           )}
//         </TableBody>

//       </Table>
//     </TableContainer>
//   </Box>
// )}

// </Paper>


             
//             </>
//         )}

// {Bid === "2" && !isLoading && (
//   <>
//           <Card elevation={3} sx={{ borderRadius: 3, mt: 4, maxWidth: 850, mx: 'auto' }}>
//           <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
//             <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>Upload Data</Typography>
            
//             {/* <FormControl sx={{ minWidth: 200, mb: 4 }} size="small">
//               <InputLabel>Select Project Type</InputLabel>
//               <Select value={selectedType} label="Select Project Type" onChange={(e) => setSelectedType(e.target.value)}>
//                   {PROJECT_TYPES.map((type) => (
//                       <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
//                   ))}
//               </Select>
//             </FormControl> */}

//             <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center" alignItems="stretch">
//               {/* <Box component="label" sx={{ flex: 1, border: '2px dashed', borderColor: 'primary.light', borderRadius: 2, bgcolor: 'primary.50', p: 4, cursor: 'pointer', '&:hover': { bgcolor: 'primary.100' } }}>
//                 <input type="file" hidden onChange={(e) => handleFileUpload(e, "child")} accept=".xlsx, .xls" />
//                 <Stack alignItems="center" spacing={2}>
//                   <CategoryIcon color="primary" sx={{ fontSize: 40 }} />
//                   <Typography variant="h6" color="primary.main">Child Excel</Typography>
//                 </Stack>
//               </Box> */}

//               <Box component="label" sx={{ flex: 1, border: '2px dashed', borderColor: 'secondary.light', borderRadius: 2, bgcolor: 'secondary.50', p: 4, cursor: 'pointer', '&:hover': { bgcolor: 'secondary.100' } }}>
//                  <input type="file" hidden onChange={(e) => handleFileUpload(e)} accept=".xlsx, .xls" />
//                 <Stack alignItems="center" spacing={2}>
//                   <StorageIcon color="secondary" sx={{ fontSize: 40 }} />
//                   <Typography variant="h6" color="secondary.main">Task Excel</Typography>
//                 </Stack>
//               </Box>
//             </Stack>

//             {/* {fileName && (
//               <Chip label={`${uploadSource.toUpperCase()} DATA: ${fileName}`} color={uploadSource === "main" ? "secondary" : "primary"} onDelete={() => { setFileName(""); setUploadSource(""); }} sx={{ mt: 4, fontWeight: 'bold' }} />
//             )} */}
//             <Button variant="contained" sx={{mt:3}} startIcon={<SaveIcon />} onClick={saveToMaster}>Save Flow</Button>
//           </CardContent>
//         </Card>
//         {/* <Button variant="contained" startIcon={<SaveIcon />} onClick={saveToMaster}>Save</Button> */}

        
//   </>

// )}



//     </Container>
//   );
// }


























// // Flow Assignment Card - UI Enhanced

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Tabs,
//   Tab,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Container,
//   Stack,
//   CardContent,
//   Button,
//   Alert,
//   Card,
//   CircularProgress,
//   Snackbar,
//   IconButton,
//   Divider,
//   Fade
// } from "@mui/material";

// // Icons
// import StorageIcon from '@mui/icons-material/Storage';
// import SaveIcon from '@mui/icons-material/Save';
// import TableViewIcon from '@mui/icons-material/TableView';
// import ListAltIcon from '@mui/icons-material/ListAlt';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CloseIcon from '@mui/icons-material/Close';

// import axios from "axios";
// import { useSelector } from "react-redux";

// // --- Constants & Config ---
// const COLUMNS = [
//   "ID", 
//   "PCB Operation Id", 
//   "PCB Process Name", 
//   "Assigned To", 
//   "Assigned To Name", 
//   "Initial", 
//   "MRL", 
//   "MRL Expiry"
// ];

// const BUTTON_OPTS = [
//   { id: "1", name: "VIEW FLOW ASSIGNMENT", icon: <ListAltIcon /> },
//   { id: "2", name: "UPLOAD FLOW ASSIGNMENT", icon: <AssignmentIcon /> },
// ];

// export default function FlowAssigment() {

//   // --- State Management ---
//   const [tableData, setTableData] = useState([]);
//   const [Bid, SetBid] = React.useState("1"); // Current Main Tab
//   const [currentTab, setCurrentTab] = useState("view"); // Sub-tab for View

//   // Upload State
//   const [file, setFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   // UI State
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   // Notification State
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "info" // 'success' | 'error' | 'warning' | 'info'
//   });

//   // --- Redux & API Configuration (Existing Logic) ---
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
//   var API1 = "/get_flow_data";
//   var API2 = "/upload_task_data";

//   var fetchDefaultFlowPCB = "http://192.168.0.20:8000" + API1;
//   var postAssFlow = "http://172.195.121.91:2000" + API2; // Note: Original code didn't append API2 in default var, fixed logic below based on your block

//   // Correct URL construction based on your provided logic
//   if (configDetails != undefined) {
//     if (configDetails.project[0].ServerIP != undefined) {
//       if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {
//         fetchDefaultFlowPCB = configDetails.project[0].ServerIP[0].PythonServerIP + API1;
//         // Based on your original code logic:
//         postAssFlow = configDetails.project[0].ServerIP[0].PythonServerIP + API2; 
//       }
//     }
//   }

//   // --- Handlers ---

//   function dataSelection(id) {
//     SetBid(id);
//     setError(null);
//     setFile(null); // Reset file selection on tab switch
//   }

//   const handleTabChange = (event, newValue) => {
//     setCurrentTab(newValue);
//   };

//   // Helper for Snackbar
//   const showNotification = (message, severity = "info") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // --- Fetch Data Effect (Tab 1) ---
//   useEffect(() => {
//     if (currentTab === "view" && Bid === "1") {
//       setLoading(true);
//       axios.get(fetchDefaultFlowPCB)
//         .then((response) => {
//           const data = response.data.PcbData || response.data || [];
//           setTableData(data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error fetching data:", err);
//           setError("Failed to load data. Please check server connection.");
//           setLoading(false);
//         });
//     }
//   }, [currentTab, Bid]);


//   // --- File Upload Logic (Tab 2) ---

//   const handleFileUpload = (event) => {
//     const selectedFile = event.target.files[0];
    
//     if (selectedFile) {
//         setFile(selectedFile);
//         console.log("File selected:", selectedFile);
//         showNotification(`File selected: ${selectedFile.name}`, "info");
//     } else {
//         // Handle Cancel
//     }
//   };

//   const saveToMaster = async () => {
//     if (!file) {
//         showNotification("Please select an Excel file first.", "warning");
//         return;
//     }

//     setIsUploading(true); // Start Loading Spinner

//     try {
//         const formData = new FormData();
//         formData.append('file', file);

//         console.log("Uploading to:", postAssFlow);
        
//         const response = await axios.post(postAssFlow, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
        
//         console.log('File uploaded successfully:', response.data);
//         showNotification("Flow Assignment uploaded successfully!", "success");
//         setFile(null); // Clear file after success
    
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         showNotification("Upload failed. Check console for details.", "error");
//     } finally {
//         setIsUploading(false); // Stop Loading Spinner
//     }
//   };

//   return (
//     <Container maxWidth="xxl" sx={{ mt: 4, fontFamily: 'Roboto, sans-serif' }}>
        
//         {/* --- 1. Header Navigation --- */}
//         <Container sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center' }}>
//             <Paper elevation={0} sx={{ borderRadius: '50px', bgcolor: '#e2e8f0', p: 0.5 }}>
//                 <Stack direction="row" spacing={1}>
//                     {BUTTON_OPTS.map((item) => {
//                         const isActive = Bid === item.id;
//                         return (
//                             <Button
//                                 key={item.id}
//                                 onClick={() => dataSelection(item.id)}
//                                 variant={isActive ? "contained" : "text"}
//                                 startIcon={item.icon}
//                                 sx={{
//                                     borderRadius: '50px',
//                                     px: 4,
//                                     py: 1.2,
//                                     fontWeight: isActive ? '700' : '500',
//                                     textTransform: 'none',
//                                     transition: 'all 0.3s ease',
//                                     backgroundColor: isActive ? 'white' : 'transparent',
//                                     color: isActive ? '#1e293b' : '#64748b',
//                                     boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
//                                     '&:hover': {
//                                         backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.5)',
//                                     }
//                                 }}
//                             >
//                                 {item.name}
//                             </Button>
//                         )
//                     })}
//                 </Stack>
//             </Paper>
//         </Container>

//         {/* Error Display */}
//         {error && (
//             <Alert severity="error" sx={{ mb: 2, mx: 'auto', maxWidth: 800, borderRadius: 2 }}>{error}</Alert>
//         )}

//         {/* =========================================================
//             TAB 1: VIEW FLOW ASSIGNMENT
//            ========================================================= */}
//         {Bid === "1" && (
//             <Fade in={true} timeout={500}>
//                 <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: "hidden" }}>
                    
//                     {/* Sub-Tabs Header */}
//                     <Box sx={{ borderBottom: 1, borderColor: "#e2e8f0", bgcolor: "#f8fafc", px: 2, pt: 1 }}>
//                         <Tabs
//                             value={currentTab}
//                             onChange={handleTabChange}
//                             textColor="primary"
//                             indicatorColor="primary"
//                             sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' } }}
//                         >
//                             <Tab icon={<TableViewIcon />} iconPosition="start" label="Data Grid" value="view" />
//                         </Tabs>
//                     </Box>

//                     {/* Table Content */}
//                     <Box sx={{ p: 0 }}>
//                         <TableContainer sx={{ maxHeight: '65vh' }}>
//                             <Table stickyHeader aria-label="flow table">
//                                 <TableHead>
//                                     <TableRow>
//                                         {COLUMNS.map((col) => (
//                                             <TableCell
//                                                 key={col}
//                                                 sx={{ 
//                                                     fontWeight: "700", 
//                                                     bgcolor: "#f1f5f9", 
//                                                     color: '#475569',
//                                                     whiteSpace: 'nowrap'
//                                                 }}
//                                             >
//                                                 {col}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {loading ? (
//                                         <TableRow>
//                                             <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
//                                                 <CircularProgress size={40} />
//                                                 <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Loading Flow Data...</Typography>
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : tableData.length > 0 ? (
//                                         tableData.map((row, index) => (
//                                             <TableRow hover key={row.id || index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
//                                                 <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{row.id || index + 1}</TableCell>
//                                                 <TableCell>{row.pcbOperationId}</TableCell>
//                                                 <TableCell>
//                                                     <Chip label={row.pcbProcessName} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 500 }} />
//                                                 </TableCell>
//                                                 <TableCell>{row.assignedTo}</TableCell>
//                                                 <TableCell>
//                                                     <Stack direction="row" alignItems="center" spacing={1}>
//                                                         <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
//                                                             {row.assignedToNameInitial || "?"}
//                                                         </Box>
//                                                         <Typography variant="body2">{row.assignedToName}</Typography>
//                                                     </Stack>
//                                                 </TableCell>
//                                                 <TableCell>{row.assignedToNameInitial}</TableCell>
//                                                 <TableCell>
//                                                     {row.assignedToNameMRL && (
//                                                         <Chip label={`MRL: ${row.assignedToNameMRL}`} size="small" variant="outlined" />
//                                                     )}
//                                                 </TableCell>
//                                                 <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.assignedToNameMRLExpiry}</TableCell>
//                                             </TableRow>
//                                         ))
//                                     ) : (
//                                         <TableRow>
//                                             <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 8 }}>
//                                                 <Typography variant="h6" color="text.secondary">No Flow Data Found</Typography>
//                                                 <Typography variant="body2" color="text.disabled">Check the server connection or upload new data.</Typography>
//                                             </TableCell>
//                                         </TableRow>
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Box>
//                 </Paper>
//             </Fade>
//         )}

//         {/* =========================================================
//             TAB 2: UPLOAD FLOW ASSIGNMENT (Interactive)
//            ========================================================= */}
//         {Bid === "2" && (
//             <Fade in={true} timeout={500}>
//                 <Card elevation={0} sx={{ 
//                     borderRadius: 4, 
//                     mt: 2, 
//                     maxWidth: 700, 
//                     mx: 'auto', 
//                     border: '1px solid #e2e8f0',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
//                 }}>
//                     <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
                        
//                         <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
//                             <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: '50%', color: '#3b82f6' }}>
//                                 <CloudUploadIcon sx={{ fontSize: 40 }} />
//                             </Box>
//                             <Typography variant="h5" sx={{ fontWeight: '800', color: '#1e293b' }}>
//                                 Upload Flow Assignment
//                             </Typography>
//                             <Typography variant="body1" color="text.secondary">
//                                 Import task workflows using an Excel file (.xlsx, .xls)
//                             </Typography>
//                         </Stack>

//                         {/* Interactive Upload Area */}
//                         <Box 
//                             component="label" 
//                             sx={{ 
//                                 display: 'block',
//                                 border: '2px dashed', 
//                                 borderColor: file ? '#10b981' : '#cbd5e1', 
//                                 borderRadius: 3, 
//                                 bgcolor: file ? '#f0fdf4' : '#f8fafc', 
//                                 p: 5, 
//                                 cursor: 'pointer', 
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': { 
//                                     bgcolor: file ? '#f0fdf4' : '#f1f5f9',
//                                     borderColor: file ? '#10b981' : '#94a3b8' 
//                                 } 
//                             }}
//                         >
//                             <input 
//                                 type="file" 
//                                 hidden 
//                                 onChange={handleFileUpload} 
//                                 accept=".xlsx, .xls" 
//                             />
                            
//                             {!file ? (
//                                 <Stack alignItems="center" spacing={1}>
//                                     <StorageIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
//                                     <Typography variant="h6" color="text.primary" fontWeight="600">
//                                         Click to Browse
//                                     </Typography>
//                                     <Typography variant="caption" color="text.secondary">
//                                         Support for .xlsx files
//                                     </Typography>
//                                 </Stack>
//                             ) : (
//                                 <Stack alignItems="center" spacing={2}>
//                                     <InsertDriveFileIcon sx={{ fontSize: 48, color: '#10b981' }} />
//                                     <Box>
//                                         <Typography variant="h6" color="text.primary" fontWeight="600">
//                                             {file.name}
//                                         </Typography>
//                                         <Typography variant="caption" color="text.secondary">
//                                             {(file.size / 1024).toFixed(2)} KB
//                                         </Typography>
//                                     </Box>
//                                     <Chip 
//                                         icon={<CheckCircleIcon />} 
//                                         label="Ready to Upload" 
//                                         color="success" 
//                                         variant="outlined" 
//                                         sx={{ bgcolor: 'white' }}
//                                     />
//                                     <Button 
//                                         size="small" 
//                                         color="error" 
//                                         onClick={(e) => {
//                                             e.preventDefault(); 
//                                             setFile(null);
//                                         }}
//                                         sx={{ mt: 1 }}
//                                     >
//                                         Remove File
//                                     </Button>
//                                 </Stack>
//                             )}
//                         </Box>

//                         <Divider sx={{ my: 4 }} />

//                         {/* Actions */}
//                         <Button 
//                             variant="contained" 
//                             size="large"
//                             disabled={!file || isUploading}
//                             onClick={saveToMaster}
//                             sx={{ 
//                                 py: 1.5, 
//                                 px: 6, 
//                                 borderRadius: 2, 
//                                 fontSize: '1rem',
//                                 fontWeight: 700,
//                                 textTransform: 'none',
//                                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                             }}
//                             startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
//                         >
//                             {isUploading ? "Uploading..." : "Save Flow Assignment"}
//                         </Button>

//                     </CardContent>
//                 </Card>
//             </Fade>
//         )}

//         {/* --- Notifications (Snackbar) --- */}
//         <Snackbar
//             open={snackbar.open}
//             autoHideDuration={4000}
//             onClose={handleCloseSnackbar}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//             <Alert 
//                 onClose={handleCloseSnackbar} 
//                 severity={snackbar.severity} 
//                 variant="filled" 
//                 sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
//             >
//                 {snackbar.message}
//             </Alert>
//         </Snackbar>

//     </Container>
//   );
// }
















// done by me @jan26


import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Paper, Tabs, Tab, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Container, Stack,
  CardContent, Button, Alert, Card, CircularProgress, Snackbar,
  IconButton, Divider, Fade, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Autocomplete
} from "@mui/material";

// Icons
import StorageIcon from '@mui/icons-material/Storage';
import SaveIcon from '@mui/icons-material/Save';
import TableViewIcon from '@mui/icons-material/TableView';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import axios from "axios";
import { useSelector } from "react-redux";

const COLUMNS = [
  "ID", "PCB Operation Id", "PCB Process Name", "Assigned To", 
  "Assigned To Name", "Initial", "MRL", "MRL Expiry", "Actions"
];

const BUTTON_OPTS = [
  { id: "1", name: "VIEW FLOW ASSIGNMENT", icon: <ListAltIcon /> },
  { id: "2", name: "UPLOAD FLOW ASSIGNMENT", icon: <AssignmentIcon /> },
];

export default function FlowAssigment() {
  const [tableData, setTableData] = useState([]);
  const [Bid, SetBid] = useState("1");
  const [currentTab, setCurrentTab] = useState("view");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [operatorSuggestions, setOperatorSuggestions] = useState([]);
  const [processSuggestions, setProcessSuggestions] = useState([]);

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
  const API_GET = "/get_flow_data";
  const API_UPLOAD = "/upload_task_data";
  const API_CREATE = "/create_flow_mapping";
  const API_UPDATE = "/update_flow_mapping";
  const API_DELETE = "/delete_flow_mapping/";
  const API_OPS = "/get_all_operators"; 
  const API_PROCS = "/get_all_processes";

  let basePy = "http://192.168.0.20:8000";
  let uploadUrl = "http://172.195.121.91:2000" + API_UPLOAD;

  if (configDetails?.project?.[0]?.ServerIP?.[0]) {
    basePy = configDetails.project[0].ServerIP[0].PythonServerIP;
    uploadUrl = basePy + API_UPLOAD;
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(basePy + API_GET);
      setTableData(response.data.PcbData || response.data || []);
    } catch (err) {
      setError("Failed to load table data.");
    } finally {
      setLoading(false);
    }
  }, [basePy]);

  const fetchSuggestions = useCallback(async () => {
    try {
      const [ops, procs] = await Promise.all([
        axios.get(basePy + API_OPS),
        axios.get(basePy + API_PROCS)
      ]);
      setOperatorSuggestions(ops.data.operators || []);
      setProcessSuggestions(procs.data.processes || []);
    } catch (err) {
      console.error("Suggestions fetch failed");
    }
  }, [basePy]);

  useEffect(() => {
    if (Bid === "1") {
      fetchData();
      fetchSuggestions();
    }
  }, [Bid, fetchData, fetchSuggestions]);

  const showNotification = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAdd = () => {
    setSelectedRow({
      id: null,
      pcbProcessName: "",
      assignedTo: "",
      assignedToName: "",
      assignedToNameInitial: "",
      assignedToNameMRL: "",
      assignedToNameMRLExpiry: ""
    });
    setEditDialogOpen(true);
  };

  const handleOpenEdit = (row) => {
    setSelectedRow({ ...row });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const url = selectedRow.id ? basePy + API_UPDATE : basePy + API_CREATE;
      const method = selectedRow.id ? 'put' : 'post';
      await axios[method](url, selectedRow);
      showNotification(selectedRow.id ? "Updated!" : "Created!", "success");
      setEditDialogOpen(false);
      fetchData();
    } catch (err) {
      showNotification("Save failed.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(basePy + API_DELETE + id);
      showNotification("Record removed.", "warning");
      fetchData();
    } catch (err) {
      showNotification("Delete failed.", "error");
    }
  };

  const saveToMaster = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(uploadUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showNotification("Upload successful!", "success");
      setFile(null);
      fetchData();
    } catch (error) {
      showNotification("Upload failed.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 4 }}>
      {/* Navigation */}
      <Container sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={0} sx={{ borderRadius: '50px', bgcolor: '#e2e8f0', p: 0.5 }}>
          <Stack direction="row" spacing={1}>
            {BUTTON_OPTS.map((item) => (
              <Button
                key={item.id}
                onClick={() => SetBid(item.id)}
                variant={Bid === item.id ? "contained" : "text"}
                startIcon={item.icon}
                sx={{ borderRadius: '50px', px: 4, py: 1.2, textTransform: 'none', backgroundColor: Bid === item.id ? 'white' : 'transparent', color: Bid === item.id ? '#1e293b' : '#64748b' }}
              >
                {item.name}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Container>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {Bid === "1" && (
        <Fade in={true}>
          <Box>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: 2, bgcolor: '#10b981' }}>Add New Entry</Button>
            </Stack>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: '60vh' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {COLUMNS.map((col) => <TableCell key={col} sx={{ fontWeight: "700", bgcolor: "#f1f5f9" }}>{col}</TableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow> : 
                      tableData.map((row, index) => (
                      <TableRow hover key={row.id || index}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.pcbOperationId || "N/A"}</TableCell>
                        <TableCell><Chip label={row.pcbProcessName} size="small" variant="outlined" color="primary" /></TableCell>
                        <TableCell>{row.assignedTo}</TableCell>
                        <TableCell>{row.assignedToName}</TableCell>
                        <TableCell>{row.assignedToNameInitial}</TableCell>
                        <TableCell>{row.assignedToNameMRL}</TableCell>
                        <TableCell>{row.assignedToNameMRLExpiry}</TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}><EditIcon fontSize="small" /></IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Fade>
      )}

      {Bid === "2" && (
        <Card elevation={0} sx={{ borderRadius: 4, mt: 2, maxWidth: 500, mx: 'auto', border: '1px solid #e2e8f0', p: 4, textAlign: 'center' }}>
            <input type="file" id="file-up" hidden onChange={(e) => setFile(e.target.files[0])} accept=".xlsx, .xls" />
            <label htmlFor="file-up">
                <Box sx={{ border: '2px dashed #cbd5e1', p: 4, borderRadius: 2, cursor: 'pointer', bgcolor: '#f8fafc' }}>
                    <CloudUploadIcon fontSize="large" color="primary" />
                    <Typography>{file ? file.name : "Select Excel File"}</Typography>
                </Box>
            </label>
            <Button variant="contained" sx={{ mt: 3 }} disabled={!file || isUploading} onClick={saveToMaster}>{isUploading ? "Uploading..." : "Save Master"}</Button>
        </Card>
      )}

      {/* --- THE MODAL --- */}
      <Dialog open={editDialogOpen} onClose={() => !isProcessing && setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>{selectedRow?.id ? "Edit Entry" : "New Entry"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            
            <Autocomplete
              freeSolo
              options={processSuggestions}
              value={selectedRow?.pcbProcessName || ""}
              onInputChange={(e, val) => setSelectedRow({...selectedRow, pcbProcessName: val})}
              renderInput={(params) => <TextField {...params} label="Process Name" placeholder="Select or type..." />}
            />

            <Autocomplete
              options={operatorSuggestions}
              getOptionLabel={(opt) => `${opt.name} (${opt.staff_no})`}
              value={operatorSuggestions.find(o => o.staff_no === selectedRow?.assignedTo) || null}
              onChange={(e, val) => {
                // FIXED: Explicitly mapping all operator fields for auto-fill
                if (val) {
                  setSelectedRow({
                    ...selectedRow, 
                    assignedTo: val.staff_no, 
                    assignedToName: val.name, 
                    assignedToNameInitial: val.initial, 
                    assignedToNameMRL: val.mrl, 
                    assignedToNameMRLExpiry: val.expiry
                  });
                }
              }}
              renderInput={(params) => <TextField {...params} label="Select Operator" />}
            />

            <Stack direction="row" spacing={2}>
                <TextField label="Staff ID" disabled value={selectedRow?.assignedTo || ""} fullWidth />
                <TextField label="Initial" disabled value={selectedRow?.assignedToNameInitial || ""} fullWidth />
            </Stack>
            
            <Stack direction="row" spacing={2}>
                <TextField 
                  label="MRL Level" 
                  disabled 
                  value={selectedRow?.assignedToNameMRL || ""} 
                  fullWidth 
                />
                <TextField 
                  label="MRL Expiry (MMYY)" 
                  placeholder="e.g. 0427"
                  fullWidth 
                  value={selectedRow?.assignedToNameMRLExpiry || ""} 
                  onChange={(e) => setSelectedRow({...selectedRow, assignedToNameMRLExpiry: e.target.value})} 
                />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={isProcessing}>{isProcessing ? <CircularProgress size={24} /> : "Save"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
































// // Flow Assignment card - WITH CRUD & AUTO-UPLOAD

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Tabs,
//   Tab,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Container,
//   Stack,
//   CardContent,
//   Button,
//   Alert,
//   Card,
//   CircularProgress,
//   Snackbar,
//   IconButton,
//   Divider,
//   Fade,
//   TextField,
//   Tooltip
// } from "@mui/material";

// // Icons
// import StorageIcon from '@mui/icons-material/Storage';
// import SaveIcon from '@mui/icons-material/Save';
// import TableViewIcon from '@mui/icons-material/TableView';
// import ListAltIcon from '@mui/icons-material/ListAlt';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CloseIcon from '@mui/icons-material/Close';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import CancelIcon from '@mui/icons-material/Cancel';

// import * as XLSX from "xlsx"; // Ensure xlsx is installed: npm install xlsx
// import axios from "axios";
// import { useSelector } from "react-redux";

// // --- Constants & Config ---
// const COLUMNS = [
//   "ID", 
//   "PCB Process Name", 
//   "Assigned To (Staff No)", 
//   "Assigned To Name", 
//   "Initial", 
//   "MRL", 
//   "MRL Expiry"
// ];

// const BUTTON_OPTS = [
//   { id: "1", name: "VIEW FLOW ASSIGNMENT", icon: <ListAltIcon /> },
//   { id: "2", name: "UPLOAD FLOW ASSIGNMENT", icon: <AssignmentIcon /> },
// ];

// export default function FlowAssigment() {

//   // --- State Management ---
//   const [tableData, setTableData] = useState([]);
//   const [Bid, SetBid] = React.useState("1"); // Current Main Tab
//   const [currentTab, setCurrentTab] = useState("view"); // Sub-tab for View

//   // CRUD / Edit Mode State
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedData, setEditedData] = useState([]); // Temporary state for edits

//   // Upload State
//   const [file, setFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   // UI State
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   // Notification State
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "info" 
//   });

//   // --- Redux & API Configuration ---
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
//   // CHANGED: Point API1 to your new Python endpoint
//   var API1 = "/get_flow_data"; 
//   var API2 = "/upload_task_data";

//   // CHANGED: Use PythonServerIP for both endpoints now
//   var fetchDefaultFlowPCB = "http://192.168.0.20:2000" + API1; 
//   var postAssFlow = "http://192.168.0.20:2000" + API2; 

//   if (configDetails != undefined) {
//     if (configDetails.project[0].ServerIP != undefined) {
//       if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {
//         // CHANGED: Both now use PythonServerIP
//         fetchDefaultFlowPCB = configDetails.project[0].ServerIP[0].PythonServerIP + API1;
//         postAssFlow = configDetails.project[0].ServerIP[0].PythonServerIP + API2; 
//       }
//     }
//   }

//   // --- Handlers ---

//   function dataSelection(id) {
//     SetBid(id);
//     setError(null);
//     setFile(null);
//     setIsEditing(false); // Reset edit mode when switching tabs
//   }

//   const handleTabChange = (event, newValue) => {
//     setCurrentTab(newValue);
//   };

//   const showNotification = (message, severity = "info") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // --- Fetch Data Effect (Tab 1) ---
//   const fetchData = () => {
//     setLoading(true);
//     axios.get(fetchDefaultFlowPCB)
//       .then((response) => {
//         const data = response.data.PcbData || response.data || [];
//         setTableData(data);
//         // Initialize editedData with fetched data for editing
//         setEditedData(data); 
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         setError("Failed to load data. Please check server connection.");
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     if (currentTab === "view" && Bid === "1") {
//       fetchData();
//     }
//   }, [currentTab, Bid]);


//   // =========================================================
//   // CRUD HANDLERS
//   // =========================================================

//   const toggleEditMode = () => {
//     if (isEditing) {
//       // Cancel Action: Revert changes
//       setEditedData(tableData);
//       setIsEditing(false);
//     } else {
//       // Start Edit Action: Sync state
//       setEditedData([...tableData]);
//       setIsEditing(true);
//     }
//   };

//   // Handle Input Change in Table
//   const handleRowChange = (index, field, value) => {
//     const updatedData = [...editedData];
//     updatedData[index] = { ...updatedData[index], [field]: value };
//     setEditedData(updatedData);
//   };

//   // Delete Row
//   const handleDeleteRow = (index) => {
//     const updatedData = editedData.filter((_, i) => i !== index);
//     setEditedData(updatedData);
//   };

//   // Add New Row
//   const handleAddRow = () => {
//     const newRow = {
//         pcbProcessName: "",
//         assignedTo: "",
//         assignedToName: "",
//         assignedToNameInitial: "",
//         assignedToNameMRL: "",
//         assignedToNameMRLExpiry: ""
//     };
//     setEditedData([...editedData, newRow]);
//   };

//   // =========================================================
//   // APPLY HANDLER (Generate Excel & Upload)
//   // =========================================================
  
// //   const handleApplyChanges = async () => {
// //     if (editedData.length === 0) {
// //         showNotification("No data to apply.", "warning");
// //         return;
// //     }

// //     setIsUploading(true);

// //     try {
// //         // 1. Prepare Data for Excel
// //         // Map editedData to the EXACT column names Python expects
// //         const excelData = editedData.map(row => ({
// //             "pcbProcessName": row.pcbProcessName,
// //             "assignedTo": row.assignedTo,
// //             "assignedToName": row.assignedToName,
// //             "assignedToNameInitial": row.assignedToNameInitial,
// //             "assignedToNameMRL": row.assignedToNameMRL,
// //             "assignedToNameMRLExpiry": row.assignedToNameMRLExpiry
// //         }));

// //         // 2. Generate Excel File (Blob)
// //         const worksheet = XLSX.utils.json_to_sheet(excelData);
// //         const workbook = XLSX.utils.book_new();
// //         XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
        
// //         // Write to buffer
// //         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
// //         const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
// //         // Create a File object from Blob
// //         const virtualFile = new File([blob], "edited_flow_data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

// //         // 3. Send to Python Backend
// //         const formData = new FormData();
// //         formData.append('file', virtualFile);

// //         console.log("Applying changes via upload to:", postAssFlow);
        
// //         const response = await axios.post(postAssFlow, formData, {
// //           headers: {
// //             'Content-Type': 'multipart/form-data'
// //           }
// //         });
        
// //         console.log('Changes applied successfully:', response.data);
// //         showNotification("Flow successfully updated!", "success");
        
// //         // 4. Cleanup
// //         setIsEditing(false);
// //         fetchData(); // Refresh data from Node server to see updates (assuming Python syncs to DB)
    
// //     } catch (error) {
// //         console.error('Error applying changes:', error);
// //         showNotification("Failed to apply changes. Check console.", "error");
// //     } finally {
// //         setIsUploading(false);
// //     }
// //   };
// const handleApplyChanges = async () => {
//     if (editedData.length === 0) {
//         showNotification("No data to apply.", "warning");
//         return;
//     }

//     setIsUploading(true);

//     try {
//         // 1. Prepare Data for Excel
//         const excelData = editedData.map(row => ({
//             "pcbProcessName": row.pcbProcessName,
//             "assignedTo": row.assignedTo,
//             "assignedToName": row.assignedToName,
//             "assignedToNameInitial": row.assignedToNameInitial,
//             "assignedToNameMRL": row.assignedToNameMRL,
//             "assignedToNameMRLExpiry": row.assignedToNameMRLExpiry
//         }));

//         // 2. Generate Excel File (Blob) - ROBUST COMPATIBILITY FIX
//         const worksheet = XLSX.utils.json_to_sheet(excelData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
        
//         // FIX: Use 'binary' type instead of 'array' to avoid "Unrecognized type" error
//         const excelOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

//         // Helper function to convert binary string to ArrayBuffer (Standard Fix)
//         const s2ab = (s) => {
//             const buf = new ArrayBuffer(s.length);
//             const view = new Uint8Array(buf);
//             for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
//             return buf;
//         };
        
//         // Create Blob from the binary buffer
//         const blob = new Blob([s2ab(excelOutput)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
//         // Create a File object from Blob
//         const virtualFile = new File([blob], "edited_flow_data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

//         // 3. Send to Python Backend
//         const formData = new FormData();
//         formData.append('file', virtualFile);

//         console.log("Applying changes via upload to:", postAssFlow);
        
//         const response = await axios.post(postAssFlow, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
        
//         console.log('Changes applied successfully:', response.data);
//         showNotification("Flow successfully updated!", "success");
        
//         // 4. Cleanup
//         setIsEditing(false);
//         fetchData(); // Refresh data to show new grid
    
//     } catch (error) {
//         console.error('Error applying changes:', error);
//         showNotification(`Failed to apply changes: ${error.message}`, "error");
//     } finally {
//         setIsUploading(false);
//     }
//   };

//   // --- Manual File Upload Logic (Tab 2) ---
//   const handleFileUpload = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//         setFile(selectedFile);
//         showNotification(`File selected: ${selectedFile.name}`, "info");
//     }
//   };

//   const saveToMaster = async () => {
//     if (!file) {
//         showNotification("Please select an Excel file first.", "warning");
//         return;
//     }
//     setIsUploading(true);
//     try {
//         const formData = new FormData();
//         formData.append('file', file);
//         const response = await axios.post(postAssFlow, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         showNotification("Flow Assignment uploaded successfully!", "success");
//         setFile(null);
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         showNotification("Upload failed.", "error");
//     } finally {
//         setIsUploading(false);
//     }
//   };

//   return (
//     <Container maxWidth="xxl" sx={{ mt: 4, fontFamily: 'Roboto, sans-serif' }}>
        
//         {/* --- 1. Header Navigation --- */}
//         <Container sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center' }}>
//             <Paper elevation={0} sx={{ borderRadius: '50px', bgcolor: '#e2e8f0', p: 0.5 }}>
//                 <Stack direction="row" spacing={1}>
//                     {BUTTON_OPTS.map((item) => {
//                         const isActive = Bid === item.id;
//                         return (
//                             <Button
//                                 key={item.id}
//                                 onClick={() => dataSelection(item.id)}
//                                 variant={isActive ? "contained" : "text"}
//                                 startIcon={item.icon}
//                                 sx={{
//                                     borderRadius: '50px',
//                                     px: 4,
//                                     py: 1.2,
//                                     fontWeight: isActive ? '700' : '500',
//                                     textTransform: 'none',
//                                     transition: 'all 0.3s ease',
//                                     backgroundColor: isActive ? 'white' : 'transparent',
//                                     color: isActive ? '#1e293b' : '#64748b',
//                                     boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
//                                     '&:hover': {
//                                         backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.5)',
//                                     }
//                                 }}
//                             >
//                                 {item.name}
//                             </Button>
//                         )
//                     })}
//                 </Stack>
//             </Paper>
//         </Container>

//         {/* Error Display */}
//         {error && (
//             <Alert severity="error" sx={{ mb: 2, mx: 'auto', maxWidth: 800, borderRadius: 2 }}>{error}</Alert>
//         )}

//         {/* =========================================================
//             TAB 1: VIEW & EDIT FLOW ASSIGNMENT
//            ========================================================= */}
//         {Bid === "1" && (
//             <Fade in={true} timeout={500}>
//                 <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: "hidden" }}>
                    
//                     {/* Toolbar Header */}
//                     <Box sx={{ borderBottom: 1, borderColor: "#e2e8f0", bgcolor: "#f8fafc", px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Tabs value={currentTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
//                             <Tab icon={<TableViewIcon />} iconPosition="start" label="Data Grid" value="view" />
//                         </Tabs>

//                         {/* EDIT ACTIONS */}
//                         <Stack direction="row" spacing={2}>
//                             {isEditing ? (
//                                 <>
//                                     <Button 
//                                         variant="outlined" 
//                                         color="error" 
//                                         startIcon={<CancelIcon />}
//                                         onClick={toggleEditMode}
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button 
//                                         variant="contained" 
//                                         color="success" 
//                                         startIcon={isUploading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
//                                         onClick={handleApplyChanges}
//                                         disabled={isUploading}
//                                     >
//                                         Apply Changes
//                                     </Button>
//                                 </>
//                             ) : (
//                                 <Button 
//                                     variant="contained" 
//                                     color="primary" 
//                                     startIcon={<EditIcon />}
//                                     onClick={toggleEditMode}
//                                 >
//                                     Edit Flow
//                                 </Button>
//                             )}
//                         </Stack>
//                     </Box>

//                     {/* Table Content */}
//                     <Box sx={{ p: 0 }}>
//                         <TableContainer sx={{ maxHeight: '65vh' }}>
//                             <Table stickyHeader aria-label="flow table" size={isEditing ? "small" : "medium"}>
//                                 <TableHead>
//                                     <TableRow>
//                                         {COLUMNS.map((col) => (
//                                             <TableCell key={col} sx={{ fontWeight: "700", bgcolor: "#f1f5f9", color: '#475569', whiteSpace: 'nowrap' }}>
//                                                 {col}
//                                             </TableCell>
//                                         ))}
//                                         {isEditing && <TableCell sx={{ fontWeight: "700", bgcolor: "#f1f5f9" }}>Action</TableCell>}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {loading ? (
//                                         <TableRow>
//                                             <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 6 }}>
//                                                 <CircularProgress size={40} />
//                                                 <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Loading Flow Data...</Typography>
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : (
//                                         // RENDER EDITED DATA OR READ-ONLY DATA
//                                         (isEditing ? editedData : tableData).map((row, index) => (
//                                             <TableRow hover key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                
//                                                 {/* ID (Index + 1) */}
//                                                 <TableCell sx={{ color: '#64748b' }}>{index + 1}</TableCell>

//                                                 {/* Process Name */}
//                                                 <TableCell>
//                                                     {isEditing ? (
//                                                         <TextField 
//                                                             size="small" fullWidth variant="outlined" 
//                                                             value={row.pcbProcessName || ""} 
//                                                             onChange={(e) => handleRowChange(index, "pcbProcessName", e.target.value)}
//                                                         />
//                                                     ) : (
//                                                         <Chip label={row.pcbProcessName} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 500 }} />
//                                                     )}
//                                                 </TableCell>

//                                                 {/* Assigned To (Staff No) */}
//                                                 <TableCell>
//                                                     {isEditing ? (
//                                                         <TextField 
//                                                             size="small" fullWidth
//                                                             value={row.assignedTo || ""} 
//                                                             onChange={(e) => handleRowChange(index, "assignedTo", e.target.value)}
//                                                         />
//                                                     ) : row.assignedTo}
//                                                 </TableCell>

//                                                 {/* Assigned To Name */}
//                                                 <TableCell>
//                                                     {isEditing ? (
//                                                         <TextField 
//                                                             size="small" fullWidth
//                                                             value={row.assignedToName || ""} 
//                                                             onChange={(e) => handleRowChange(index, "assignedToName", e.target.value)}
//                                                         />
//                                                     ) : (
//                                                         <Stack direction="row" alignItems="center" spacing={1}>
//                                                             <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
//                                                                 {row.assignedToNameInitial || "?"}
//                                                             </Box>
//                                                             <Typography variant="body2">{row.assignedToName}</Typography>
//                                                         </Stack>
//                                                     )}
//                                                 </TableCell>

//                                                 {/* Initial */}
//                                                 <TableCell>
//                                                     {isEditing ? (
//                                                         <TextField 
//                                                             size="small" sx={{ width: 80 }}
//                                                             value={row.assignedToNameInitial || ""} 
//                                                             onChange={(e) => handleRowChange(index, "assignedToNameInitial", e.target.value)}
//                                                         />
//                                                     ) : row.assignedToNameInitial}
//                                                 </TableCell>

//                                                 {/* MRL */}
//                                                 <TableCell>
//                                                     {isEditing ? (
//                                                         <TextField 
//                                                             size="small" sx={{ width: 100 }}
//                                                             value={row.assignedToNameMRL || ""} 
//                                                             onChange={(e) => handleRowChange(index, "assignedToNameMRL", e.target.value)}
//                                                         />
//                                                     ) : (
//                                                         row.assignedToNameMRL && <Chip label={`MRL: ${row.assignedToNameMRL}`} size="small" variant="outlined" />
//                                                     )}
//                                                 </TableCell>

//                                                 {/* Expiry */}
//                                                 <TableCell>
//                                                     {isEditing ? (
//                                                         <TextField 
//                                                             size="small"
//                                                             value={row.assignedToNameMRLExpiry || ""} 
//                                                             onChange={(e) => handleRowChange(index, "assignedToNameMRLExpiry", e.target.value)}
//                                                         />
//                                                     ) : (
//                                                         <Typography variant="caption" color="text.secondary">{row.assignedToNameMRLExpiry}</Typography>
//                                                     )}
//                                                 </TableCell>

//                                                 {/* DELETE BUTTON (Edit Mode Only) */}
//                                                 {isEditing && (
//                                                     <TableCell>
//                                                         <IconButton size="small" color="error" onClick={() => handleDeleteRow(index)}>
//                                                             <DeleteIcon fontSize="small" />
//                                                         </IconButton>
//                                                     </TableCell>
//                                                 )}
//                                             </TableRow>
//                                         ))
//                                     )}
//                                     {/* ADD ROW BUTTON */}
//                                     {isEditing && (
//                                         <TableRow>
//                                             <TableCell colSpan={8} align="center" sx={{ p: 2 }}>
//                                                 <Button 
//                                                     startIcon={<AddCircleIcon />} 
//                                                     onClick={handleAddRow}
//                                                     variant="dashed" 
//                                                     sx={{ color: 'text.secondary', border: '1px dashed #cbd5e1', width: '100%' }}
//                                                 >
//                                                     Add New Step
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Box>
//                 </Paper>
//             </Fade>
//         )}

//         {/* =========================================================
//             TAB 2: UPLOAD FLOW ASSIGNMENT (Unchanged logic)
//            ========================================================= */}
//         {Bid === "2" && (
//             <Fade in={true} timeout={500}>
//                 <Card elevation={0} sx={{ borderRadius: 4, mt: 2, maxWidth: 700, mx: 'auto', border: '1px solid #e2e8f0' }}>
//                     <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
//                         <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
//                             <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: '50%', color: '#3b82f6' }}>
//                                 <CloudUploadIcon sx={{ fontSize: 40 }} />
//                             </Box>
//                             <Typography variant="h5" sx={{ fontWeight: '800', color: '#1e293b' }}>
//                                 Upload Flow Assignment
//                             </Typography>
//                         </Stack>
//                         <Box 
//                             component="label" 
//                             sx={{ display: 'block', border: '2px dashed', borderColor: file ? '#10b981' : '#cbd5e1', borderRadius: 3, bgcolor: file ? '#f0fdf4' : '#f8fafc', p: 5, cursor: 'pointer' }}
//                         >
//                             <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls" />
//                             {!file ? (
//                                 <Stack alignItems="center" spacing={1}>
//                                     <StorageIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
//                                     <Typography variant="h6">Click to Browse</Typography>
//                                 </Stack>
//                             ) : (
//                                 <Stack alignItems="center" spacing={2}>
//                                     <InsertDriveFileIcon sx={{ fontSize: 48, color: '#10b981' }} />
//                                     <Typography variant="h6">{file.name}</Typography>
//                                     <Button size="small" color="error" onClick={(e) => { e.preventDefault(); setFile(null); }}>Remove File</Button>
//                                 </Stack>
//                             )}
//                         </Box>
//                         <Divider sx={{ my: 4 }} />
//                         <Button 
//                             variant="contained" size="large" disabled={!file || isUploading} onClick={saveToMaster}
//                             sx={{ py: 1.5, px: 6 }} startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
//                         >
//                             {isUploading ? "Uploading..." : "Save Flow Assignment"}
//                         </Button>
//                     </CardContent>
//                 </Card>
//             </Fade>
//         )}

//         {/* --- Notifications (Snackbar) --- */}
//         <Snackbar
//             open={snackbar.open}
//             autoHideDuration={4000}
//             onClose={handleCloseSnackbar}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//             <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
//                 {snackbar.message}
//             </Alert>
//         </Snackbar>

//     </Container>
//   );
// }
























































