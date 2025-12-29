



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


























// Flow Assignment Card - UI Enhanced

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
  Stack,
  CardContent,
  Button,
  Alert,
  Card,
  CircularProgress,
  Snackbar,
  IconButton,
  Divider,
  Fade
} from "@mui/material";

// Icons
import StorageIcon from '@mui/icons-material/Storage';
import SaveIcon from '@mui/icons-material/Save';
import TableViewIcon from '@mui/icons-material/TableView';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

import axios from "axios";
import { useSelector } from "react-redux";

// --- Constants & Config ---
const COLUMNS = [
  "ID", 
  "PCB Operation Id", 
  "PCB Process Name", 
  "Assigned To", 
  "Assigned To Name", 
  "Initial", 
  "MRL", 
  "MRL Expiry"
];

const BUTTON_OPTS = [
  { id: "1", name: "VIEW FLOW ASSIGNMENT", icon: <ListAltIcon /> },
  { id: "2", name: "UPLOAD FLOW ASSIGNMENT", icon: <AssignmentIcon /> },
];

export default function FlowAssigment() {

  // --- State Management ---
  const [tableData, setTableData] = useState([]);
  const [Bid, SetBid] = React.useState("1"); // Current Main Tab
  const [currentTab, setCurrentTab] = useState("view"); // Sub-tab for View

  // Upload State
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Notification State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" // 'success' | 'error' | 'warning' | 'info'
  });

  // --- Redux & API Configuration (Existing Logic) ---
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
  var API1 = "/getdefflow";
  var API2 = "/upload_task_data";

  var fetchDefaultFlowPCB = "http://192.168.0.20:8082" + API1;
  var postAssFlow = "http://172.195.121.91:2000" + API2; // Note: Original code didn't append API2 in default var, fixed logic below based on your block

  // Correct URL construction based on your provided logic
  if (configDetails != undefined) {
    if (configDetails.project[0].ServerIP != undefined) {
      if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {
        fetchDefaultFlowPCB = configDetails.project[0].ServerIP[0].NodeServerIP + API1;
        // Based on your original code logic:
        postAssFlow = configDetails.project[0].ServerIP[0].PythonServerIP + API2; 
      }
    }
  }

  // --- Handlers ---

  function dataSelection(id) {
    SetBid(id);
    setError(null);
    setFile(null); // Reset file selection on tab switch
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Helper for Snackbar
  const showNotification = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // --- Fetch Data Effect (Tab 1) ---
  useEffect(() => {
    if (currentTab === "view" && Bid === "1") {
      setLoading(true);
      axios.get(fetchDefaultFlowPCB)
        .then((response) => {
          const data = response.data.PcbData || response.data || [];
          setTableData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("Failed to load data. Please check server connection.");
          setLoading(false);
        });
    }
  }, [currentTab, Bid]);


  // --- File Upload Logic (Tab 2) ---

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
        setFile(selectedFile);
        console.log("File selected:", selectedFile);
        showNotification(`File selected: ${selectedFile.name}`, "info");
    } else {
        // Handle Cancel
    }
  };

  const saveToMaster = async () => {
    if (!file) {
        showNotification("Please select an Excel file first.", "warning");
        return;
    }

    setIsUploading(true); // Start Loading Spinner

    try {
        const formData = new FormData();
        formData.append('file', file);

        console.log("Uploading to:", postAssFlow);
        
        const response = await axios.post(postAssFlow, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('File uploaded successfully:', response.data);
        showNotification("Flow Assignment uploaded successfully!", "success");
        setFile(null); // Clear file after success
    
    } catch (error) {
        console.error('Error uploading file:', error);
        showNotification("Upload failed. Check console for details.", "error");
    } finally {
        setIsUploading(false); // Stop Loading Spinner
    }
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 4, fontFamily: 'Roboto, sans-serif' }}>
        
        {/* --- 1. Header Navigation --- */}
        <Container sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={0} sx={{ borderRadius: '50px', bgcolor: '#e2e8f0', p: 0.5 }}>
                <Stack direction="row" spacing={1}>
                    {BUTTON_OPTS.map((item) => {
                        const isActive = Bid === item.id;
                        return (
                            <Button
                                key={item.id}
                                onClick={() => dataSelection(item.id)}
                                variant={isActive ? "contained" : "text"}
                                startIcon={item.icon}
                                sx={{
                                    borderRadius: '50px',
                                    px: 4,
                                    py: 1.2,
                                    fontWeight: isActive ? '700' : '500',
                                    textTransform: 'none',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: isActive ? 'white' : 'transparent',
                                    color: isActive ? '#1e293b' : '#64748b',
                                    boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                                    }
                                }}
                            >
                                {item.name}
                            </Button>
                        )
                    })}
                </Stack>
            </Paper>
        </Container>

        {/* Error Display */}
        {error && (
            <Alert severity="error" sx={{ mb: 2, mx: 'auto', maxWidth: 800, borderRadius: 2 }}>{error}</Alert>
        )}

        {/* =========================================================
            TAB 1: VIEW FLOW ASSIGNMENT
           ========================================================= */}
        {Bid === "1" && (
            <Fade in={true} timeout={500}>
                <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: "hidden" }}>
                    
                    {/* Sub-Tabs Header */}
                    <Box sx={{ borderBottom: 1, borderColor: "#e2e8f0", bgcolor: "#f8fafc", px: 2, pt: 1 }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' } }}
                        >
                            <Tab icon={<TableViewIcon />} iconPosition="start" label="Data Grid" value="view" />
                        </Tabs>
                    </Box>

                    {/* Table Content */}
                    <Box sx={{ p: 0 }}>
                        <TableContainer sx={{ maxHeight: '65vh' }}>
                            <Table stickyHeader aria-label="flow table">
                                <TableHead>
                                    <TableRow>
                                        {COLUMNS.map((col) => (
                                            <TableCell
                                                key={col}
                                                sx={{ 
                                                    fontWeight: "700", 
                                                    bgcolor: "#f1f5f9", 
                                                    color: '#475569',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {col}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                                                <CircularProgress size={40} />
                                                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Loading Flow Data...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : tableData.length > 0 ? (
                                        tableData.map((row, index) => (
                                            <TableRow hover key={row.id || index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{row.id || index + 1}</TableCell>
                                                <TableCell>{row.pcbOperationId}</TableCell>
                                                <TableCell>
                                                    <Chip label={row.pcbProcessName} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 500 }} />
                                                </TableCell>
                                                <TableCell>{row.assignedTo}</TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
                                                            {row.assignedToNameInitial || "?"}
                                                        </Box>
                                                        <Typography variant="body2">{row.assignedToName}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>{row.assignedToNameInitial}</TableCell>
                                                <TableCell>
                                                    {row.assignedToNameMRL && (
                                                        <Chip label={`MRL: ${row.assignedToNameMRL}`} size="small" variant="outlined" />
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.assignedToNameMRLExpiry}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 8 }}>
                                                <Typography variant="h6" color="text.secondary">No Flow Data Found</Typography>
                                                <Typography variant="body2" color="text.disabled">Check the server connection or upload new data.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Paper>
            </Fade>
        )}

        {/* =========================================================
            TAB 2: UPLOAD FLOW ASSIGNMENT (Interactive)
           ========================================================= */}
        {Bid === "2" && (
            <Fade in={true} timeout={500}>
                <Card elevation={0} sx={{ 
                    borderRadius: 4, 
                    mt: 2, 
                    maxWidth: 700, 
                    mx: 'auto', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
                }}>
                    <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
                        
                        <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
                            <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: '50%', color: '#3b82f6' }}>
                                <CloudUploadIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: '800', color: '#1e293b' }}>
                                Upload Flow Assignment
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Import task workflows using an Excel file (.xlsx, .xls)
                            </Typography>
                        </Stack>

                        {/* Interactive Upload Area */}
                        <Box 
                            component="label" 
                            sx={{ 
                                display: 'block',
                                border: '2px dashed', 
                                borderColor: file ? '#10b981' : '#cbd5e1', 
                                borderRadius: 3, 
                                bgcolor: file ? '#f0fdf4' : '#f8fafc', 
                                p: 5, 
                                cursor: 'pointer', 
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    bgcolor: file ? '#f0fdf4' : '#f1f5f9',
                                    borderColor: file ? '#10b981' : '#94a3b8' 
                                } 
                            }}
                        >
                            <input 
                                type="file" 
                                hidden 
                                onChange={handleFileUpload} 
                                accept=".xlsx, .xls" 
                            />
                            
                            {!file ? (
                                <Stack alignItems="center" spacing={1}>
                                    <StorageIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                                    <Typography variant="h6" color="text.primary" fontWeight="600">
                                        Click to Browse
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Support for .xlsx files
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack alignItems="center" spacing={2}>
                                    <InsertDriveFileIcon sx={{ fontSize: 48, color: '#10b981' }} />
                                    <Box>
                                        <Typography variant="h6" color="text.primary" fontWeight="600">
                                            {file.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        icon={<CheckCircleIcon />} 
                                        label="Ready to Upload" 
                                        color="success" 
                                        variant="outlined" 
                                        sx={{ bgcolor: 'white' }}
                                    />
                                    <Button 
                                        size="small" 
                                        color="error" 
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            setFile(null);
                                        }}
                                        sx={{ mt: 1 }}
                                    >
                                        Remove File
                                    </Button>
                                </Stack>
                            )}
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Actions */}
                        <Button 
                            variant="contained" 
                            size="large"
                            disabled={!file || isUploading}
                            onClick={saveToMaster}
                            sx={{ 
                                py: 1.5, 
                                px: 6, 
                                borderRadius: 2, 
                                fontSize: '1rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        >
                            {isUploading ? "Uploading..." : "Save Flow Assignment"}
                        </Button>

                    </CardContent>
                </Card>
            </Fade>
        )}

        {/* --- Notifications (Snackbar) --- */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert 
                onClose={handleCloseSnackbar} 
                severity={snackbar.severity} 
                variant="filled" 
                sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>

    </Container>
  );
}