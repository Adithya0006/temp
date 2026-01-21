

// import React, { useState, useMemo, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Snackbar,
//   Alert,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Container,
//   Avatar,
//   CardActionArea,
//   Grid,
//   Chip,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Stack,
//   TableContainer,
//   TablePagination,
//   Button
// } from "@mui/material";
// import {
//   ArrowBack as ArrowBackIcon,
//   CheckCircle as CheckCircleIcon,
//   Assignment as FormIcon,
//   Lock as LockIcon,
//   AccountCircle
// } from "@mui/icons-material";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";


// // Ensure this path matches your project structure
// import ProcessFormPage from "./ProcessForms/ProcessFormPage";
// import { useSelector } from "react-redux";
// import { LayoutDashboardIcon } from "lucide-react";

// const API_URL = "http://192.168.0.20:2000/operator/view";

// // --- 1. DUMMY DATA ---
// const DUMMY_USER = {
//   name: "Demo Operator",
//   staffNumber: "OP-101"
// };

// const DUMMY_PCBS = [
//   {
//     "PCB Serial Number": "SN-2023-001",
//     linkedOperations: [
//       {
//         "S.No": "1",
//         "Operation Name": "Labelling & Traceability",
//         assignedTo: ["OP-101"],
//         status: "Pending",
//         startTime: null,
//         endTime: null
//       }
//     ]
//   }
// ];

// // --- Sub-Component: Form Dialog ---
// const ProcessFormDialog = ({ open, setOpen, activeForm, currentUser, onSaveSuccess, FilteredData, actionType }) => {
//   if (!activeForm) return null;
//   // Assuming your big object is named 'activeForm'

//   // 1. Find the specific task that matches the current step
//   const currentTask = activeForm.tasks?.find(
//     (task) => task.flowStepId === activeForm.currentStepId
//   );

//   // 2. Extract the log (safely handle if task isn't found)
//   const operatorLog = currentTask ? currentTask.operator_Json_log : null;

//   console.log(operatorLog);
//   // Output: { cleaning_program_no: "t" }

//   return (
//     <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ bgcolor: "#f5f5f5", borderBottom: 1, borderColor: "divider" }}>
//         {actionType === 'start' ? "Start Task: " : "Complete Task: "}
//         {activeForm.stageName} ({activeForm.pcbSerial})
//       </DialogTitle>
//       <DialogContent sx={{ mt: 2 }}>
//         {console.log("active form: ",activeForm)}
//         <ProcessFormPage
//           pcbSerial={activeForm.pcbSerial}
//           stageId={activeForm.stageId+1}
//           assignmentId={activeForm.assignmentid}
//           FilteredData={FilteredData}
//           actionType={actionType}
//           onClose={() => setOpen(false)}
//           operator={currentUser}
//           // UPDATED: Pass existing log_Data if available in the row
//           // initialLogData={activeForm.log_Data}
//           initialLogData={operatorLog}


//           onSaveComplete={() => {
//             // Argument removed here ---------------------------------------vv
//             onSaveSuccess(activeForm.pcbSerial, activeForm.flowStepId);
//             setOpen(false);
//           }}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// };

// // --- Sub-Component: Task Tabs View ---
// const TaskTabsView = ({ currentUser, tableData = [], AllData = [], onOpenForm, onTriggerRefresh }) => {
//   const [activeTab, setActiveTab] = useState(0);

//   // Pagination State
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//    console.log("tabe data: ",tableData,"all data: ",AllData)
//   const groupedTasks = useMemo(() => {
//     let i=0;
//     const groups = {};
//     if (tableData && tableData.length > 0) {
     
//       tableData.forEach((task) => {
//         const id = task.flowStepId;
//         console.log("flowStepId:", task.flowStepId);
//         if (!groups[id]) {
//           groups[id] = {
//             processName: task.processName || `Step ${id}`,
//             items: [],
//             count:0
//           };
//         }
//         AllData.forEach((tabcount)=>{
//           if(task.flowStepId === tabcount.currentStepId){
//             groups[id].count++;
//           }
//         })
//         groups[id].items.push(task);    
//       });
//     }
//     return groups;
//   }, [tableData]);

//   const stepIds = Object.keys(groupedTasks).sort((a, b) => parseInt(a) - parseInt(b));

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setPage(0);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const activeStepId = stepIds[activeTab];
//   const currentGroup = groupedTasks[activeStepId];

//   const validRows = currentGroup
//     ? currentGroup.items.filter(item => item.serialNo !== null && item.serialNo !== "null" && item.flowStepId == activeStepId)
//     : [];

//   // Calculate FilteredData (All Items for this step)
//   const FilteredData = AllData.filter(item => item.currentStepId == activeStepId);

//   // console.log("FilteredData", FilteredData)

//   // --- Handlers for Buttons ---
//   const handleStartClick = (row) => {
//     const formData = {
//       pcbSerial: row.serialNo,
//       flowStepId: row.flowStepId,
//       stageId: row.currentStepId - 1,
//       stageName: row.processName,
//       ...row,// This includes log_Data if it exists!

//       if(onTriggerRefresh) {
//         onTriggerRefresh();
//       }
//     };
//     // console.log("formData", formData)

//     onOpenForm(formData, FilteredData, 'Start');
//   };

//   const handleCompleteClick = (row) => {
//     const formData = {
//       pcbSerial: row.serialNo,
//       flowStepId: row.flowStepId,
//       stageId: row.currentStepId - 1,
//       stageName: row.processName,
//       ...row // This includes log_Data if it exists!
//     };
//     onOpenForm(formData, FilteredData, 'complete');
//   };

//   if (stepIds.length === 0) {
//     return (
//       <Paper sx={{ p: 4, textAlign: "center" }}>
//         <Typography color="text.secondary">No processes assigned.</Typography>
//       </Paper>
//     );
//   }

//   return (
//     <Box>
//       <Paper elevation={2} // Slight shadow
//       sx={{
//         mb: 2,            // Margin bottom
//         borderBottom: 1,  // Bottom border
//         borderColor: 'divider',
//         padding: 2,      // Padding inside the Paper
//         '& .MuiTabs-root': {  // Styling the Tabs container
//           bgcolor: 'background.default', //Background color of tabs
//         },
//         '& .MuiTab-root': {  // Styling individual tabs
//           textOverflow: 'ellipsis',    // Truncate long labels
//           whiteSpace: 'nowrap',        // Prevent wrapping
//           overflow: 'hidden',         // Hide overflowed content
//           color: 'text.secondary',     // Default tab color
//           fontWeight: '400',           // Default font weight
//           '&.Mui-selected': {
//             color: 'primary.main',     // Active tab color
//             fontWeight: 'bold',        // Active tab font weight
//           },
//           '&:hover': {
//             bgcolor: 'grey.100',
//           },
//           fontSize:"0.8rem"

//         },
//       }}>
//         <Tabs
//           value={activeTab}
//           onChange={handleTabChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           allowScrollButtonsMobile
//         >
//           {stepIds.map((id) => (
//             <Tab
//               key={id}
//               label={`${groupedTasks[id].processName} (${groupedTasks[id].count})`}
//             />
//           ))}
//         </Tabs>
//       </Paper>

//       <TableContainer component={Paper} elevation={1} sx={{ border: "1px solid #e0e0e0" }}>
//         <Table>
//           <TableHead sx={{ bgcolor: "#f5f5f5" }}>
//             <TableRow>
//               <TableCell><strong>SNO</strong></TableCell>
//               <TableCell><strong>PCB Serial</strong></TableCell>
//               <TableCell><strong>Status</strong></TableCell>
//               {/* <TableCell><strong>Timing</strong></TableCell> */}
//               <TableCell align="center"><strong>Action</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {FilteredData.map((row, index) => {

//               console.log("row", row)




//               // const isDone = row.status === "Completed";

//               // const inProgress = row.status === "Start" || row.status === "In Progress"||row.status === "STARTED";
//               // const isLocked = row.canExecute === false;


//               //             const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);

//               // // 2. GET THE STATUS from that task
//               // const status = activeTask?.status || "Pending"; // e.g., "STARTED"

//               // // 3. Use this status for your logic
//               // const isDone = status === "Completed";
//               // const isStarted = status === "STARTED" || status === "Start" || status === "In Progress";
//               // const isLocked = row.canExecute === false;

//               // // 4. Also get the Log Data correctly for the button check
//               // const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
//               // const isLogFilled = logLength > 0;








//               const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);
//               // console.log("active task: ",activeTask)
//               // console.log("status: ",status)
//               // Default to empty string to avoid null/undefined issues
//               const status = activeTask?.status || "";
//               console.log("active status: ",activeTask.status)

//               // 2. Define Explicit States
//               const isDone = status === "Completed";
//               // STRICT check: Only these exact strings count as "Started"
//               const isStarted = status === "STARTED" || status === "Start" || status === "In Progress";
//               const isLocked = row.canExecute === true;

//               // 3. Define Enable Logic
//               // The button is ENABLED only if:
//               // - It is actually started
//               // - AND it is not done yet
//               const canComplete = isStarted && !isDone && !isLocked;

//               // 4. Also get Log Data for Start Button
//               const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
//               const isLogFilled = logLength > 0;

//               return (
//                 <TableRow key={index} hover>
//                   <TableCell>{index+1}</TableCell>
//                   <TableCell>
//                     <Typography fontWeight="bold">{row.serialNo}</Typography>
//                     {isLocked && (
//                       <Chip icon={<LockIcon />} label="Locked" size="small" sx={{ mt: 0.5 }} />
//                     )}
//                   </TableCell>

//                   {/* <TableCell>
//                     <Chip 
//                       label={row.status || "Pending"} 
//                       color={isDone ? "success" : inProgress ? "warning" : "default"}
//                       size="small" 
//                       variant={inProgress ? "filled" : "outlined"}
//                     />
//                   </TableCell> */}

//                   <TableCell>
//                     <Chip
//                       label={status}
//                       color={isDone ? "success" : isStarted ? "warning" : "default"}
//                       size="small"
//                       variant={isStarted ? "filled" : "outlined"}
//                     />
//                   </TableCell>

//                   {/* <TableCell>
//                     <Stack spacing={0.5}>
//                        {row.start_time ? (
//                          <Typography variant="caption" display="block">
//                            Start: {new Date(row.start_time).toLocaleTimeString()}
//                          </Typography>
//                        ) : <Typography variant="caption" color="text.secondary">-</Typography>}
                       
//                        {row.end_time ? (
//                          <Typography variant="caption" color="success.main" display="block">
//                            End: {new Date(row.end_time).toLocaleTimeString()}
//                          </Typography>
//                        ) : null}
//                     </Stack>
//                   </TableCell> */}







//                   <TableCell align="right">
//                     <Stack direction="row" spacing={1} justifyContent="flex-end">

//                       <Button
//                         variant="contained"
//                         color="primary"
//                         size="small"
//                         startIcon={<PlayArrowIcon />}
//                         // Disable if: Log is filled OR Locked OR Done
//                         disabled={isLogFilled || isLocked || isDone}
//                         onClick={() => handleStartClick(row)}
//                       >
//                         Start
//                       </Button>

//                       <Button
//                         variant={isDone ? "outlined" : "contained"}
//                         color="success"
//                         size="small"
//                         startIcon={<CheckCircleIcon />}

//                         // --- UPDATED LOGIC ---
//                         // If it is NOT 'canComplete', then it must be disabled.
//                         // But we also want to allow "View" mode if it is done.
//                         disabled={!canComplete && !isDone}
//                         // ---------------------

//                         onClick={() => handleCompleteClick(row)}
//                       >
//                         {isDone ? "View" : "Complete"}
//                       </Button>

//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//             {validRows.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
//                     No active PCBs found for {currentGroup?.processName}.
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={validRows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>
//     </Box>
//   );
// };

// // --- Main Page Component ---
// const OperatorPage = ({ inActionPCBs, updateInActionPCBs, onLogout }) => {



//   let user = JSON.parse(localStorage.getItem("user"));
//   const activeUser = user || DUMMY_USER;

//   const [tableData, setTableData] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [currentStepIdAllData, SetcurrentStepIdAllData] = useState([]);
//   const [refreshCounter, setRefreshCounter] = useState(0);
//   const [cardcount,setCardCount]=useState(0);
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)


//   var API = "/operator/view"
//   var fetchOperatorApi = "http://172.195.121.91:2000" + API
  

//   if (configDetails != undefined) {

//     if (configDetails.project[0].ServerIP != undefined) {

//       if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {

//         fetchOperatorApi = configDetails.project[0].ServerIP[0].PythonServerIP + API
  
//       }


//     }

//   }

//   // Fetch API Data
//   useEffect(() => {
//     if (!user?.id) return;

//     const requestParams = { staff_no: user?.id };
//     setLoading(true);
//     axios.get(fetchOperatorApi, { params: requestParams })
//       .then((response) => {
//         const tasks = response.data.pcbs[0]?.tasks || [];
//         // console.log("DATA WHEN LOADED: ",response.data.pcbs)
//         setTableData(tasks);
//         setLoading(false);
//         SetcurrentStepIdAllData(response.data.pcbs)
//         setCardCount(response.data.pcbs.length);
//         console.log("currentStepIdAllData: ",response.data.pcbs)
//       })
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         setLoading(false);
//       });
//   }, [user?.id, refreshCounter]);

//   const [localPCBs, setLocalPCBs] = useState([]);

//   useEffect(() => {
//     if (inActionPCBs && inActionPCBs.length > 0) {
//       setLocalPCBs(inActionPCBs);
//     } else {
//       setLocalPCBs(DUMMY_PCBS);
//     }
//   }, [inActionPCBs, refreshCounter]);



//   const [selectedView, setSelectedView] = useState(null);
//   const [openFormDialog, setOpenFormDialog] = useState(false);
//   const [activeFormData, setActiveFormData] = useState(null);
//   const [activeFilteredData, setActiveFilteredData] = useState([]);
//   const [actionType, setActionType] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, msg: "" });

//   const handleOpenForm = (row, filteredData, type) => {
//     setActiveFormData(row);
//     setActiveFilteredData(filteredData);
//     setActionType(type);
//     setOpenFormDialog(true);
//   };

//   const handleSaveSuccess = async (pcbSerial, flowStepId) => {
//     const now = new Date().toISOString();

//     // 1. Update tableData
//     setTableData((prevData) => {
//       return prevData.map(item => {
//         if (item.serialNo === pcbSerial && item.flowStepId === flowStepId) {
//           return {
//             ...item,
//             status: actionType === 'complete' ? "Completed" : "In Progress",
//             end_time: actionType === 'complete' ? now : item.end_time,
//             start_time: item.start_time || now
//             // log_Data line is deleted!
//           };
//         }
//         return item;
//       });
//     });

//     // 2. Update currentStepIdAllData
//     SetcurrentStepIdAllData((prevData) => {
//       return prevData.map(item => {
//         if (item.serialNo === pcbSerial && (item.flowStepId === flowStepId || item.currentStepId === flowStepId)) {
//           return {
//             ...item,
//             status: actionType === 'complete' ? "Completed" : "In Progress",
//             end_time: actionType === 'complete' ? now : item.end_time,
//             start_time: item.start_time || now
//             // log_Data line is deleted!
//           };
//         }
//         return item;
//       });
//     });
//     handleTriggerRefresh();
//     setSnackbar({ open: true, msg: "Task updated successfully!" });
//   };

//   const handleTriggerRefresh = () => {
//     setRefreshCounter(prev => prev + 1);
//   };

//   const renderContent = () => {
//     if (selectedView === 'tasks') {
//       return (
//         <TaskTabsView
//           currentUser={activeUser}
//           tableData={tableData}
//           AllData={currentStepIdAllData}
//           onOpenForm={handleOpenForm}
//           onTriggerRefresh={handleTriggerRefresh}
//         />
//       );
//     }
   
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Grid container spacing={4} justifyContent="center">
//           <Grid item xs={12} sm={6} md={3} >
//             <Card
//               elevation={3}
//               sx={{ 
//                 height: 300, // Fixed height for uniformity
//                 borderRadius: 5, 
//                 background: THEME.gradientCard,
//                 boxShadow: THEME.shadowSoft,
//                 position: "relative",
//                 overflow: "hidden",
//                 border: "1px solid rgba(255,255,255,0.8)",
//                 transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
//                 "&:hover": { 
//                   transform: "translateY(-10px) scale(1.02)", 
//                   boxShadow: THEME.shadowHover 
//                 },
//                 // Hover effect logic
//                 "&:hover .hover-content": {
//                   opacity: 1,
//                   transform: "translateY(0)"
//                 },
//                 "&:hover .default-content": {
//                   opacity: 0.3,
//                   transform: "translateY(-20px)"
//                 }
//               }}
//             >
//               <CardActionArea onClick={() => setSelectedView('tasks')}  sx={{ height: "100%", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
//                 {/* <CardContent sx={{ textAlign: 'center' }}>
//                   <Avatar sx={{ bgcolor: "#1976d2", width: 80, height: 80, mb: 3, mx: 'auto' }}>
//                     <FormIcon fontSize="large" />
//                   </Avatar>
//                   <Typography variant="h5" fontWeight="bold" gutterBottom>My Tasks</Typography>
//                   <Typography>Total Number of PCB's Assigned to you: {cardcount}</Typography>
//                   {/* <Typography color="text.secondary">View assigned stages and process pending PCBs.</Typography> */}
//                 {/* </CardContent> */} 
//                 <Box className="default-content" sx={{ transition: "all 0.4s ease", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                   <Box sx={{ 
//                     p: 4, 
//                     borderRadius: "50%", 
//                     background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
//                     mb: 3,
//                     boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
//                     display: 'flex', alignItems: 'center', justifyContent: 'center'
//                   }}>
//                     <LayoutDashboardIcon  sx={{ fontSize: 60, color: "#6366f1" }}/>
//                   </Box>
//                   <Typography variant="h5" fontWeight="700" sx={{ color: "#334155" }}>
//                     My Tasks
//                   </Typography>
//                   <Typography  fontWeight="700" sx={{ color: "#339155" }}>Number of PCB's: {cardcount}</Typography>
//                 </Box>

//                 <Box 
//                   className="hover-content"
//                   sx={{ 
//                     position: "absolute",
//                     bottom: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "40%", // Covers bottom portion
//                     background: "rgba(255,255,255,0.95)",
//                     backdropFilter: "blur(10px)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     p: 2,
//                     opacity: 0, // Hidden by default
//                     transform: "translateY(100%)", // Pushed down by default
//                     transition: "all 0.3s ease-in-out",
//                     borderTop: "1px solid #e2e8f0"
//                   }}
//                 >
//                    <Typography variant="body1" color="text.secondary" fontWeight="500">
//                    View assigned stages and process pending PCBs
//                   </Typography>
//                 </Box>
//               </CardActionArea>
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>
//     );
//   };

//   const THEME = {
//     bg: "#f8fafc",
//     primary: "#1e293b",
//     accent: "#f59e0b",
//     cardBg: "#ffffff",
//     textSecondary: "#64748b"
//   };

//   if (loading) {
//     return <Box sx={{ p: 3, textAlign: 'center' }}>Loading tasks...</Box>;
//   }

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f4f6f8" }}>

//       <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
//         <Toolbar>
//           {selectedView ? (
//             <IconButton onClick={() => setSelectedView(null)} color="primary" sx={{ mr: 2 }}>
//               <ArrowBackIcon />
//             </IconButton>
//           ) : (
//             <IconButton >
              
//             </IconButton>
//           )}

//           <Typography variant="h6" sx={{
//             position: 'absolute',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontWeight: 600,
//           }}>
//             {selectedView === 'tasks' ? "My Tasks" : "Operator Dashboard"}
//           </Typography>

//           <Box display="flex" alignItems="center" gap={2} sx={{ ml: 'auto' }}> {/* Add ml: 'auto' to push content to the right */}
//             <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
//                 <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>
//                     {user.userRole}{console.log("user.supervisor_name",user.supervisor_name)}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: '#777' }}>
//                     {user.id.replace('_', ' ')}
//                 </Typography>
//             </Box>
//             <Avatar sx={{ bgcolor: '#1a237e', fontWeight: 'bold' }}>
//                 <AccountCircle />
//             </Avatar>
//           </Box>
//         </Toolbar>
        
//       </AppBar>

//       <Box sx={{ flexGrow: 1, p: 3 }}>
//         {selectedView === 'tasks' ? (
//           <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 1, minHeight: "80vh" }}>
//             {renderContent()}
//           </Box>
//         ) : (
//           renderContent()
//         )}
        
//       </Box>
      

//       <ProcessFormDialog
//         open={openFormDialog}
//         setOpen={setOpenFormDialog}
//         activeForm={activeFormData}
//         currentUser={activeUser}
//         FilteredData={activeFilteredData}
//         actionType={actionType}
//         onSaveSuccess={handleSaveSuccess}
//       />

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert severity="success" variant="filled">{snackbar.msg}</Alert>
//       </Snackbar>

//     </Box>
//   );
// };

// export default OperatorPage;













































import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Snackbar, Alert, AppBar, Toolbar, IconButton, Container, Avatar,
  CardActionArea, Grid, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  Stack, TableContainer, TablePagination, Button, Badge
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Lock as LockIcon,
  AccountCircle,
  FactCheck as FactCheckIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { LayoutDashboardIcon } from "lucide-react";
import ProcessFormPage from "./ProcessForms/ProcessFormPage";

// --- Configuration & Constants ---
const API_URL = "http://192.168.0.20:2000/operator/view";
const DUMMY_USER = { name: "Demo Operator", staffNumber: "OP-101" };
const DUMMY_PCBS = [];

// --- NEW UI THEME CONSTANTS ---
const UI_THEME = {
  primary: "#4f46e5", // Modern Indigo
  secondary: "#10b981", // Emerald Green
  bg: "#f8fafc", // Slate 50
  cardBg: "#ffffff",
  headerBg: "#ffffff",
  tableHeader: "#f1f5f9",
};

/**
 * Component: ProcessFormDialog
 * Description: Pop-up modal that contains the ProcessFormPage.
 */
const ProcessFormDialog = ({ open, setOpen, activeForm, currentUser, onSaveSuccess, FilteredData, actionType }) => {
  if (!activeForm) return null;

  // Extract log data if available
  const currentTask = activeForm.tasks?.find(
    (task) => task.flowStepId === activeForm.currentStepId
  );
  const operatorLog = currentTask ? currentTask.operator_Json_log : null;

  return (
    <Dialog 
      open={open} 
      onClose={() => setOpen(false)} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' } // Rounded corners for modal
      }}
    >
      <DialogTitle sx={{ bgcolor: UI_THEME.tableHeader, borderBottom: 1, borderColor: "divider", py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FactCheckIcon color="primary" />
          <Typography variant="h6" fontWeight="bold" color="#334155">
             {actionType === 'start' ? "Start Task" : actionType === 'view' ? "View Task" : "Execute Task"}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
           {activeForm.stageName} • SN: <b>{activeForm.pcbSerial}</b>
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, bgcolor: "#fafafa" }}>
        <ProcessFormPage
          pcbSerial={activeForm.pcbSerial}
          stageId={activeForm.stageId+1} // Adjust for backend index if needed
          assignmentId={activeForm.assignmentid}
          FilteredData={FilteredData}
          actionType={actionType}
          onClose={() => setOpen(false)}
          operator={currentUser}
          initialLogData={operatorLog}
          onSaveComplete={(serial, stepId) => {
            // Callback when saving is done. 
            const s = serial || activeForm.pcbSerial;
            const step = stepId || activeForm.flowStepId;
            onSaveSuccess(s, step); // Triggers parent refresh
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

/**
 * Component: TaskTabsView
 * Description: Displays the tabs for different process steps and the table of PCBs.
 */
const TaskTabsView = ({ currentUser, tableData = [], AllData = [], onOpenForm, onTriggerRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Group tasks by Step ID
  const groupedTasks = useMemo(() => {
    const groups = {};
    if (tableData && tableData.length > 0) {
      tableData.forEach((task) => {
        const id = task.flowStepId;
        if (!groups[id]) {
          groups[id] = { processName: task.processName || `Step ${id}`, items: [], count: 0 };
        }
        // Count items currently AT this step
        AllData.forEach((tabcount)=>{
          if(task.flowStepId === tabcount.currentStepId){
            groups[id].count++;
          }
        })
        groups[id].items.push(task);    
      });
    }
    return groups;
  }, [tableData, AllData]);

  const stepIds = Object.keys(groupedTasks).sort((a, b) => parseInt(a) - parseInt(b));
  
  const activeStepId = stepIds[activeTab];
  // Filter: Show only PCBs that are CURRENTLY at the active step
  const FilteredData = AllData.filter(item => item.currentStepId == activeStepId);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleStartClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: row.currentStepId - 1,
      stageName: row.processName,
      ...row,
    };
    if(onTriggerRefresh) onTriggerRefresh();
    onOpenForm(formData, FilteredData, 'Start');
  };

  const handleCompleteClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: row.currentStepId - 1,
      stageName: row.processName,
      ...row
    };
    onOpenForm(formData, FilteredData, 'complete');
  };

  if (stepIds.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1px dashed #ccc" }}>
        <Typography variant="h6" color="text.secondary">No active tasks assigned to you.</Typography>
        <Typography variant="body2" color="text.disabled">Enjoy your break!</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* --- Styled Tabs --- */}
      <Paper elevation={0} sx={{ mb: 3, borderBottom: 1, borderColor: '#e2e8f0', bgcolor: 'transparent' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#64748b',
              minHeight: 48,
              '&.Mui-selected': { color: UI_THEME.primary },
            },
            '& .MuiTabs-indicator': { backgroundColor: UI_THEME.primary, height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          {stepIds.map((id) => (
            <Tab
              key={id}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{groupedTasks[id].processName}</span>
                  <Chip 
                    label={groupedTasks[id].count} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      bgcolor: activeTab === stepIds.indexOf(id) ? UI_THEME.primary : '#e2e8f0',
                      color: activeTab === stepIds.indexOf(id) ? 'white' : '#475569'
                    }} 
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* --- Task Table --- */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>PCB Serial Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Current Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {FilteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {

              const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);
              const status = activeTask?.status || "";
              
              // Define State Logic
              const isDone = status === "Completed";
              const isStarted = status === "STARTED" || status === "Start" || status === "In Progress";
              const isLocked = row.canExecute === true; 
              
              // Enable "Complete" if started, not done, and not locked
              const canComplete = isStarted && !isDone && !isLocked;
              
              // Check if logs exist
              const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
              const isLogFilled = logLength > 0;

              return (
                <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ color: '#64748b' }}>
                    {(page * rowsPerPage) + index + 1}
                  </TableCell>
                  
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography fontWeight="600" color="#334155">{row.serialNo}</Typography>
                      {isLocked && <Chip icon={<LockIcon sx={{ fontSize: '14px !important' }}/>} label="Locked" size="small" color="error" variant="outlined"/>}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {/* Status Badge */}
                    <Chip
                      label={status || "Pending"}
                      sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.75rem',
                        bgcolor: isDone ? '#dcfce7' : isStarted ? '#fef3c7' : '#f1f5f9',
                        color: isDone ? '#166534' : isStarted ? '#b45309' : '#475569',
                        border: '1px solid',
                        borderColor: isDone ? '#bbf7d0' : isStarted ? '#fde68a' : '#e2e8f0'
                      }}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      
                      {/* START BUTTON */}
                      <Button
                        variant={isStarted ? "text" : "contained"}
                        color="primary"
                        size="small"
                        startIcon={isStarted ? null : <PlayArrowIcon />}
                        disabled={isLogFilled || isLocked || isDone}
                        onClick={() => handleStartClick(row)}
                        sx={{ 
                           borderRadius: 2, 
                           textTransform: 'none', 
                           boxShadow: 'none',
                           opacity: (isLogFilled || isDone) ? 0.5 : 1
                        }}
                      >
                        {isStarted ? "Started" : "Start"}
                      </Button>

                      {/* COMPLETE / VIEW BUTTON */}
                      <Button
                        variant={isDone ? "outlined" : "contained"}
                        color={isDone ? "inherit" : "success"}
                        size="small"
                        startIcon={isDone ? <VisibilityIcon /> : <CheckCircleIcon />}
                        disabled={!canComplete && !isDone}
                        onClick={() => handleCompleteClick(row)}
                        sx={{ 
                          borderRadius: 2, 
                          textTransform: 'none', 
                          fontWeight: 'bold',
                          boxShadow: isDone ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                          borderColor: '#cbd5e1'
                        }}
                      >
                        {isDone ? "View Log" : "Execute"}
                      </Button>

                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {FilteredData.length === 0 && (
              <TableRow>
                 <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                   No PCBs in this stage yet.
                 </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={FilteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
             setRowsPerPage(parseInt(e.target.value, 10));
             setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

/**
 * Component: OperatorPage
 * Description: Main Dashboard container. Handles API Data Fetching.
 */
const OperatorPage = ({ inActionPCBs, updateInActionPCBs, onLogout }) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const activeUser = user || DUMMY_USER;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStepIdAllData, SetcurrentStepIdAllData] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [cardcount, setCardCount] = useState(0);
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);

  // --- Dynamic API Configuration ---
  var API = "/operator/view";
  var fetchOperatorApi = "http://172.195.121.91:2000" + API;

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    fetchOperatorApi = configDetails.project[0].ServerIP[0].PythonServerIP + API;
  }

  // --- Fetch API Data ---
  useEffect(() => {
    if (!user?.id) return;
    const requestParams = { staff_no: user?.id };
    setLoading(true);
    axios.get(fetchOperatorApi, { params: requestParams })
      .then((response) => {
        const tasks = response.data.pcbs[0]?.tasks || [];
        setTableData(tasks);
        setLoading(false);
        SetcurrentStepIdAllData(response.data.pcbs);
        setCardCount(response.data.pcbs.length);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [user?.id, refreshCounter]);


  // --- UI State ---
  const [selectedView, setSelectedView] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [activeFormData, setActiveFormData] = useState(null);
  const [activeFilteredData, setActiveFilteredData] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "" });

  const handleOpenForm = (row, filteredData, type) => {
    setActiveFormData(row);
    setActiveFilteredData(filteredData);
    setActionType(type);
    setOpenFormDialog(true);
  };

  const handleSaveSuccess = async (pcbSerial, flowStepId) => {
    // Refresh Logic: Increment counter to trigger useEffect re-fetch
    setRefreshCounter(prev => prev + 1);
    setSnackbar({ open: true, msg: "Task updated successfully!" });
  };

  const handleTriggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  // --- Dashboard Renderer ---
  const renderContent = () => {
    if (selectedView === 'tasks') {
      return (
        <TaskTabsView
          currentUser={activeUser}
          tableData={tableData}
          AllData={currentStepIdAllData}
          onOpenForm={handleOpenForm}
          onTriggerRefresh={handleTriggerRefresh}
        />
      );
    }
   
    // Main Landing Cards
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} >
            <Card
              elevation={0}
              sx={{ 
                height: 320,
                borderRadius: 5, 
                background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.8)",
                transition: "all 0.4s ease",
                "&:hover": { 
                  transform: "translateY(-8px)", 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                },
              }}
            >
              <CardActionArea 
                onClick={() => setSelectedView('tasks')}  
                sx={{ height: "100%", p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Box sx={{ 
                  p: 3, 
                  borderRadius: "24px", 
                  background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  mb: 3,
                  boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <LayoutDashboardIcon size={40} color="white" />
                </Box>
                
                <Typography variant="h5" fontWeight="800" sx={{ color: "#1e293b", mb: 1 }}>
                  My Tasks
                </Typography>
                
                <Chip 
                   label={`${cardcount} Pending PCBs`} 
                   color="primary" 
                   sx={{ fontWeight: 'bold', bgcolor: '#e0e7ff', color: '#4338ca' }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  };

  // --- Main Layout Render ---
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f1f5f9" }}>

      {/* Top Navbar */}
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          {selectedView && (
            <IconButton onClick={() => setSelectedView(null)} color="primary" sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', flexGrow: 1 }}>
            {selectedView === 'tasks' ? "My Workbench" : "Operator Dashboard"}
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>
                    {user.userRole || "Operator"}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {user.id}
                </Typography>
            </Box>
            <Avatar sx={{ bgcolor: UI_THEME.primary, fontWeight: 'bold' }}>
                {user.username ? user.username[0].toUpperCase() : <AccountCircle />}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 3, maxWidth: '1600px', mx: 'auto', width: '100%' }}>
        {selectedView === 'tasks' ? (
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: 4, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)", minHeight: "80vh" }}>
            {renderContent()}
          </Box>
        ) : (
          renderContent()
        )}
      </Box>

      {/* Dialogs and Popups */}
      <ProcessFormDialog
        open={openFormDialog}
        setOpen={setOpenFormDialog}
        activeForm={activeFormData}
        currentUser={activeUser}
        FilteredData={activeFilteredData}
        actionType={actionType}
        onSaveSuccess={handleSaveSuccess}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 3 }}>{snackbar.msg}</Alert>
      </Snackbar>

    </Box>
  );
};

export default OperatorPage;