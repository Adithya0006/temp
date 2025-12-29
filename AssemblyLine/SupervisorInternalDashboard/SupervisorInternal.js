// //Overall DAshboard where all cards are displayed!

// import React, { useState, useEffect } from "react"; // Import useEffect
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   AppBar,
//   Toolbar,
//   Alert,
//   Container,
//   CardActionArea,
//   Avatar,
//   Stack,
//   Divider,
//   Checkbox,
//   Chip,
//   IconButton,
//   CircularProgress, // Import for loading state
//   Snackbar // Import for notifications
// } from "@mui/material";
// import AssignPCB from "./InActionPCB/AssignPCB";

// // Icons
// import LogoutIcon from "@mui/icons-material/Logout";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import BuildIcon from "@mui/icons-material/Build";
// import PersonIcon from "@mui/icons-material/Person";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import RefreshIcon from "@mui/icons-material/Refresh"; // Import Refresh

// import AccountTreeIcon from "@mui/icons-material/AccountTree"; // Icon for Flow Assignment

// import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
// // import FlowAssigment from "./FlowAssigment";
// import FlowAssigment from "./InActionPCB/FlowAssigment";
// import axios from "axios";
// import { useSelector } from "react-redux";

// // --- Theme Colors ---
// const THEME = {
//   bg: "#f8fafc", 
//   primary: "#1e293b", 
//   accent: "#f59e0b", 
//   cardBg: "#ffffff",
//   textSecondary: "#64748b"
// };

// const SupervisorInternal = ({
//   onLogout,
//   // inActionPCBs = [], // You might not need this prop anymore if fetching internally
//   handleAssignWork, // Assuming this is still a function passed from parent to handle the logic
// }) => {
//   const [currentView, setCurrentView] = useState("home");
  
//   // --- New State for Database Fetching ---
//   const [dbPCBs, setDbPCBs] = useState([]); // Stores the fetched PCBs
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [selected, setSelected] = useState([]);
//   const [taskgraph,setTaskGraph]= useState([]);
//   // ---------------------------------------

//   const [operators, setOperators] = useState([]);
//   const [selectedPCB, setSelectedPCB] = useState(null);
//   const [newOperator, setNewOperator] = useState({
//     name: "",
//     email: "",
//     skill: "",
//   });
//   const [tableData, setTableData] = useState([]);

//   // State for loading/error handling (Optional but recommended)
//   const [loading, setLoading] = useState(false);

//   const COLORS = ["#6366f1", "#10b981"]; 

//   // Derived data for charts (You might want to base this on dbPCBs now, or keep using props if Dashboard is global)
//   // const taskData = [
//   //   { name: "Pending", value: dbPCBs.filter((p) => !p.isWorkAssigned).length },
//   //   { name: "Assigned", value: dbPCBs.filter((p) => p.isWorkAssigned).length },
//   // ];

//   // const DUMMY_DATA = [
//   //   { id: 1, serialNumber: "PCB-001", partNumber: "PN-101", overallStatus: "Active", currentStage: "Solder Paste", currentOperator: "Alice Smith", stepStatus: "Pending" },
//   //   { id: 2, serialNumber: "PCB-002", partNumber: "PN-102", overallStatus: "Hold",   currentStage: "Reflow",       currentOperator: "Bob Jones",   stepStatus: "Stopped" },
//   //   { id: 3, serialNumber: "PCB-003", partNumber: "PN-103", overallStatus: "Active", currentStage: "AOI Inspection",currentOperator: "Charlie Day", stepStatus: "In Progress" },
//   // ];



//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)

  

//   var API1 = "/supervisor/view"

//   var fetchTobeAssignedPCB = "http://192.168.0.20:2000" + API1

//   var API2 = "/supervisor/assign"

//   var fetchAssignedPCB = "http://192.168.0.20:2000" + API2


//   if (configDetails != undefined) {

//     if (configDetails.project[0].ServerIP != undefined) {

      
//       if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {

//         fetchTobeAssignedPCB = configDetails.project[0].ServerIP[0].PythonServerIP + API1

//         fetchAssignedPCB = configDetails.project[0].ServerIP[0].PythonServerIP + API2
//       }


//     }

//   }


//   useEffect(() => {
//     // Only fetch if we are on the 'view' tab to save bandwidth
//     if (currentView === "assignTask") {
//       setLoading(true);

//       // Replace with your actual API URL
//       axios.get(fetchAssignedPCB)
//         .then((response) => {
//           // Assuming your API returns an array or an object containing the array
//           // Adjust 'response.data.PcbData' based on your actual API structure
//           console.log(response.data)
//           const data = response.data || [];
//           setTableData(data);
//           console.log("*******")
//           setLoading(false);
//         })
//         .catch((err) => {
//          console.error("Error fetching data:", err);
     
//           // setTableData(DUMMY_DATA)
      
//           setLoading(false);
//         });
//     }
//   }, [currentView]); // specific dependency ensures it runs when tab changes

//   let user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     // Only fetch if we are on the 'view' tab to save bandwidth
//     if (currentView === "dashboard") {
//       setLoading(true);
//       const requestParams = { staff_no: user?.id };
//       // Replace with your actual API URL
//       axios.get(fetchTobeAssignedPCB, { params: requestParams })
//         .then((response) => {
//           // Assuming your API returns an array or an object containing the array
//           // Adjust 'response.data.PcbData' based on your actual API structure
//           console.log(response.data)
//           const data = response.data || [];
//           setTaskGraph(data);
//           console.log("11111111111111",response.data)
//           setLoading(false);
//         })
//         .catch((err) => {
//          console.error("Error fetching data:", err);
     
//           // setTableData(DUMMY_DATA)
      
//           setLoading(false);
//         });
//     }
//   }, [currentView]); // specific dependency ensures it runs when tab changes




//   // --- Handlers ---
//   const handleAddOperator = () => {
//     if (!newOperator.name || !newOperator.email) return alert("Fill all details");
//     setOperators([...operators, newOperator]);
//     setNewOperator({ name: "", email: "", skill: "" });
//   };




//   const navCards = [
//     { 
//       id: "dashboard", 
//       title: "Overview Stats", 
//       desc: "View charts and workload distribution",
//       icon: <DashboardIcon sx={{ fontSize: 50, color: "#6366f1" }} />,
//       color: "#e0e7ff"
//     },
//     // { 
//     //   id: "createOperator", 
//     //   title: "Manage Operators", 
//     //   desc: "Add new staff and view team roster",
//     //   icon: <GroupAddIcon sx={{ fontSize: 50, color: "#10b981" }} />,
//     //   color: "#d1fae5"
//     // },
//     { 
//       id: "assignTask", 
//       title: "Assign Tasks", 
//       desc: `Manage Active PCBs`,
//       icon: <AssignmentIcon sx={{ fontSize: 50, color: "#f59e0b" }} />,
//       color: "#fef3c7"
//     },
//     // --- NEW TAB HERE ---
//     { 
//       id: "flowAssignment", 
//       title: "Flow Assignment", 
//       desc: "Create sequences & assign operators",
//       icon: <AccountTreeIcon sx={{ fontSize: 50, color: "#8b5cf6" }} />, 
//       color: "#ede9fe"
//     },
//     // --------------------
//     // { 
//     //   id: "corrections", 
//     //   title: "Corrections", 
//     //   desc: "Handle process correction tickets",
//     //   icon: <BuildIcon sx={{ fontSize: 50, color: "#ef4444" }} />,
//     //   color: "#fee2e2"
//     // },
// ];

//   /** ===========================
//    * RENDER HELPERS
//    * =========================== */



//   const renderAssignPCB = () => {
    
//     // 1. Define Dummy Data (Fallback)
//     const DUMMY_DATA = [
//       { id: 1, serialNumber: "PCB-001", partNumber: "PN-101", overallStatus: "Active", currentStage: "Solder Paste", currentOperator: "Alice Smith", stepStatus: "Pending" },
//       { id: 2, serialNumber: "PCB-002", partNumber: "PN-102", overallStatus: "Hold",   currentStage: "Reflow",       currentOperator: "Bob Jones",   stepStatus: "Stopped" },
//       { id: 3, serialNumber: "PCB-003", partNumber: "PN-103", overallStatus: "Active", currentStage: "AOI Inspection",currentOperator: "Charlie Day", stepStatus: "In Progress" },
//     ];

//     // 2. Determine Data Source
//     const displayData = (tableData && tableData.length > 0) ? tableData : DUMMY_DATA;
//     //const displayData = (tableData && tableData.length > 0) ? tableData : DUMMY_DATA;
//     // 3. Columns Definition
//     const COLUMNS = ["Serial Number", "Part Number", "Overall Status", "Current Stage", "Current Operator", "Step Status"];

//     // --- SELECTION STATE & HANDLERS ---
//     // We need state to track selected IDs. 
//     // Note: If you are inside a functional component, ensure 'selected' state is defined at the top level.
//     // Assuming 'selected' and 'setSelected' are passed in or defined in the parent:
//     // const [selected, setSelected] = useState([]); 

//     // Helper: Select All
//     const handleSelectAllClick = (event) => {
//       if (event.target.checked) {
//         const newSelecteds = tableData.map((n) => n.id);
//         setSelected(newSelecteds);
//         return;
//       }
//       setSelected([]);
//     };

//     // const handleSelectAllClick = (event) => {
//     //   if (event.target.checked) {
//     //     // Use the same fallback logic here
//     //     const newSelecteds = displayData.map((n) => n.id || n.pcb_id || n.serial_number || n.serialNumber);
//     //     setSelected(newSelecteds);
//     //     return;
//     //   }
//     //   setSelected([]);
//     // };

//     // Helper: Select One
//     const handleClick = (event, id) => {
//       const selectedIndex = selected.indexOf(id);
//       let newSelected = [];

//       if (selectedIndex === -1) {
//         newSelected = newSelected.concat(selected, id);
//       } else if (selectedIndex === 0) {
//         newSelected = newSelected.concat(selected.slice(1));
//       } else if (selectedIndex === selected.length - 1) {
//         newSelected = newSelected.concat(selected.slice(0, -1));
//       } else if (selectedIndex > 0) {
//         newSelected = newSelected.concat(
//           selected.slice(0, selectedIndex),
//           selected.slice(selectedIndex + 1)
//         );
//       }
//       setSelected(newSelected);
//     };

//     const isSelected = (id) => selected.indexOf(id) !== -1;

//     // Helper: Assign Action
//     // const handleAssign = () => {
//     //     // Filter the data to get full objects of selected IDs
//     //     const selectedDetails = displayData.filter(row => selected.includes(row.id));
        
//     //     console.log("Sending Details for:", selectedDetails);
//     //     alert(`Sending details for ${selectedDetails.length} rows to API... (Check Console)`);
        
//     //     // Example API Call:
//     //     // axios.post('/api/assign', { assignments: selectedDetails });
//     // };


//     // Helper: Assign Action
//     const handleAssign = async () => {
//       // 1. Get Current User ID (Supervisor)
//       let supervisorId = 900; // Default fallback
//       const userStr = localStorage.getItem("user");
//       if (userStr) {
//           try {
//               const user = JSON.parse(userStr);
//               // Adjust 'id' to whatever property your user object uses (e.g., user.staffId, user.id)
//               supervisorId = user.id || user.staffNumber || 900; 
//           } catch (e) {
//               console.error("Error parsing user from local storage", e);
//           }
//       }

//       // 2. Construct Payload
//       // 'selected' is already an array of IDs like [1, 2, 3] because of how handleClick works
//       const payload = {
//           supervisor_staff_no: 900, 
//           pcb_id: selected
//       };
      
//       console.log("Posting Payload:", payload);

//       try {
//           // 3. Send POST Request
//           // Replace URL with your specific endpoint
//           await axios.post(fetchAssignedPCB, payload);
          
          
//           alert(`Successfully assigned ${selected.length} PCBs!`);
//           setSelected([]); // Clear selection after success
//       } catch (error) {
//           console.error("Assignment failed:", error);
//           alert("Failed to assign tasks. Check console for details.");
//       }
//   };

//     // --- RENDER ---

//     if (isLoading) {
//         return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
//     }

//     if (error) {
//         return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
//     }

//     return (
//       <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h6">Available PCBs (InAction)</Typography>
//         </Box>

//         <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 2 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 {/* CHECKBOX HEADER */}
//                 <TableCell padding="checkbox" sx={{ bgcolor: "#eeeeee" }}>
//                   <Checkbox
//                     color="primary"
//                     indeterminate={selected.length > 0 && selected.length < tableData.length}
//                     checked={tableData.length > 0 && selected.length === tableData.length}
//                     onChange={handleSelectAllClick}
//                   />
//                 </TableCell>

//                 {COLUMNS.map((col) => (
//                   <TableCell key={col} sx={{ fontWeight: "bold", bgcolor: "#eeeeee" }}>
//                     {col}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//                 {tableData.map((row, index) => {
//                   const isItemSelected = isSelected(row.id);
//                   const labelId = `enhanced-table-checkbox-${index}`;

//                   return (
//                     <TableRow 
//                         hover 
//                         key={row.id || index}
//                         role="checkbox"
//                         aria-checked={isItemSelected}
//                         selected={isItemSelected}
//                         sx={{ cursor: 'pointer' }}
//                     >
                   
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           color="primary"
//                           checked={isItemSelected}
//                           onClick={(event) => handleClick(event, row.id)}
//                           inputProps={{ 'aria-labelledby': labelId }}
//                         />
//                       </TableCell>

//                       <TableCell>{row.serial_number || "N/A"}</TableCell>
//                       <TableCell>{row.part_number || "N/A"}</TableCell>
//                       <TableCell>
//                           <Chip 
//                               label={row.overall_status} 
//                               color={row.overall_status === "Active" ? "success" : "warning"} 
//                               size="small" 
//                           />
//                       </TableCell>
//                       <TableCell>{row.current_stage || "N/A"}</TableCell>
//                       <TableCell>{row.current_operator || "Unassigned"}</TableCell>
//                       <TableCell>{row.step_status || "N/A"}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </Paper>

//         {/* ASSIGN BUTTON BELOW TABLE */}
//         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
//             <Button 
//                 variant="contained" 
//                 color="primary" 
//                 size="large"
//                 onClick={handleAssign}
//                 disabled={selected.length === 0}
//             >
//                 Assign Selected ({selected.length})
//             </Button>
//         </Box>

//       </Box>
//     );
//   };
//   // --- Views ---

//   // 1. The "Home" Grid View
//   const renderHomeGrid = () => (
//     <Container maxWidth="lg" sx={{ mt: 4 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" fontWeight="800" color="text.primary">
//           Welcome, Internal Supervisor
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Select a module to begin managing operations.
//         </Typography>
//       </Box>

//       <Grid container spacing={4}>
//         {navCards.map((card) => (
//           <Grid item xs={12} sm={6} md={3} key={card.id}>
//             <Card 
//               sx={{ 
//                 height: "100%", 
//                 borderRadius: 4, 
//                 boxShadow: 3,
//                 transition: "transform 0.2s",
//                 "&:hover": { transform: "translateY(-5px)", boxShadow: 6 }
//               }}
//             >
//               <CardActionArea 
//                 sx={{ height: "100%", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
//                 onClick={() => setCurrentView(card.id)}
//               >
//                 <Box sx={{ 
//                   p: 2, 
//                   borderRadius: "50%", 
//                   bgcolor: card.color, 
//                   mb: 2,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center'
//                 }}>
//                   {card.icon}
//                 </Box>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom>
//                   {card.title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {card.desc}
//                 </Typography>
//               </CardActionArea>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );

//   // 2. The Inner Module View
//   const renderModuleContent = () => {

//     console.log("taskgraph",taskgraph)
//     switch (currentView) {
//       case "dashboard":


//       const chartData = [
//         { name: "Inaction", value: taskgraph.Inaction_PCB_Count || 0 },
//         { name: "Assigned", value: taskgraph.Assigned_PCB_Count || 0 },
//         { name: "Completed", value: taskgraph.Completed_PCB_Count || 0 },
//         // Optional: You can add MasterList here, but usually MasterList is the total sum, 
//         // so adding it to a pie chart might distort the percentages. 
//         // If you want to show it, uncomment the line below:
//         // { name: "Master List", value: taskgraph.MasterList_PCB_Count || 0 }, 
//     ];

//     // Filter out zero values to avoid ugly empty chart slices (optional)
//     const activeData = chartData.filter(d => d.value > 0);
//         return (
//           // <Grid container spacing={3}>
//           //   <Grid item xs={12} md={7}>
//           //     <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
//           //       <CardContent>
//           //         <Typography variant="h6" gutterBottom>Workload Distribution (Fetched Data)</Typography>
//           //         <Box sx={{ height: 300, width: '100%' }}>
//           //             <ResponsiveContainer>
//           //                 <PieChart>
//           //                 <Pie
//           //                     //data={taskgraph}
//           //                     cx="50%"
//           //                     cy="50%"
//           //                     innerRadius={60}
//           //                     outerRadius={80}
//           //                     paddingAngle={5}
//           //                     dataKey="value"
//           //                 >
//           //                     {/* {taskgraph.map((entry, index) => (
//           //                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           //                     ))} */}
//           //                 </Pie>
//           //                 <Tooltip />
//           //                 <Legend verticalAlign="bottom" height={36}/>
//           //                 </PieChart>
//           //             </ResponsiveContainer>
//           //         </Box>
//           //       </CardContent>
//           //     </Card>
//           //   </Grid>
//           //   <Grid item xs={12} md={5}>
//           //     <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
//           //       <CardContent>
//           //         <Typography variant="h6" gutterBottom>Quick Stats</Typography>
//           //         <Stack spacing={2} sx={{ mt: 2 }}>
//           //             <Paper sx={{ p: 2, borderLeft: `5px solid ${THEME.primary}` }}>
//           //                 <Typography variant="caption" color="text.secondary">Assigned_PCB_Count</Typography>
//           //                 <Typography variant="h4">{taskgraph.Assigned_PCB_Count}</Typography>
//           //             </Paper>
//           //             <Paper sx={{ p: 2, borderLeft: `5px solid ${COLORS[1]}` }}>
//           //                 <Typography variant="caption" color="text.secondary">Completed_PCB_Count</Typography>
//           //                 <Typography variant="h4">{taskgraph.Completed_PCB_Count}</Typography>
//           //             </Paper>
//           //             <Paper sx={{ p: 2, borderLeft: `5px solid ${COLORS[0]}` }}>
//           //                 <Typography variant="caption" color="text.secondary">Inaction_PCB_Count</Typography>
//           //                 <Typography variant="h4">{taskgraph.Inaction_PCB_Count}</Typography>
//           //             </Paper>
//           //             <Paper sx={{ p: 2, borderLeft: `5px solid ${COLORS[0]}` }}>
//           //                 <Typography variant="caption" color="text.secondary">MasterList_PCB_Count</Typography>
//           //                 <Typography variant="h4">{taskgraph.MasterList_PCB_Count}</Typography>
//           //             </Paper>
//           //         </Stack>
//           //       </CardContent>
//           //     </Card>
//           //   </Grid>
//           // </Grid>

//           <Grid container spacing={3}>
//             <Grid item xs={12} md={7}>
//               <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>PCBS Datachart</Typography>
//                   <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                       {loading ? (
//                           <CircularProgress />
//                       ) : (
//                           <ResponsiveContainer>
//                               <PieChart>
//                                 <Pie
//                                     data={activeData} // Pass the transformed array
//                                     cx="50%"
//                                     cy="50%"
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={5}
//                                     dataKey="value"
//                                     nameKey="name"
//                                 >
//                                     {activeData.map((entry, index) => (
//                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                                 <Legend verticalAlign="bottom" height={36}/>
//                               </PieChart>
//                           </ResponsiveContainer>
//                       )}
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={5}>
//               <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>Quick Stats</Typography>
//                   {loading ? (
//                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
//                   ) : (
//                     <Stack spacing={2} sx={{ mt: 2 }}>
//                         {/* Display the raw data from taskgraph object */}
//                         <Paper sx={{ p: 2, borderLeft: `5px solid ${COLORS[0]}` }}>
//                             <Typography variant="caption" color="text.secondary">Inaction PCBs (Available)</Typography>
//                             <Typography variant="h4">{taskgraph.Inaction_PCB_Count || 0}</Typography>
//                         </Paper>
//                         <Paper sx={{ p: 2, borderLeft: `5px solid ${COLORS[1]}` }}>
//                             <Typography variant="caption" color="text.secondary">Assigned PCBs</Typography>
//                             <Typography variant="h4">{taskgraph.Assigned_PCB_Count || 0}</Typography>
//                         </Paper>
//                         <Paper sx={{ p: 2, borderLeft: `5px solid ${COLORS[2]}` }}>
//                             <Typography variant="caption" color="text.secondary">Completed PCBs</Typography>
//                             <Typography variant="h4">{taskgraph.Completed_PCB_Count || 0}</Typography>
//                         </Paper>
//                         <Paper sx={{ p: 2, borderLeft: `5px solid #94a3b8` }}>
//                             <Typography variant="caption" color="text.secondary">Total Master List</Typography>
//                             <Typography variant="h4">{taskgraph.MasterList_PCB_Count || 0}</Typography>
//                         </Paper>
//                     </Stack>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         );
//       case "flowAssignment":
//         return <FlowAssigment />;
//         // <FlowAssignment/>;
//         // <ViewDetailsComponent />;
//       case "createOperator":
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={4}>
//                 <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//                     <CardContent>
//                         <Stack spacing={2}>
//                             <Typography variant="h6" sx={{ display:'flex', alignItems:'center', gap: 1 }}>
//                                 <PersonIcon color="primary"/> New Profile
//                             </Typography>
//                             <Divider />
//                             <TextField
//                                 label="Full Name"
//                                 size="small"
//                                 fullWidth
//                                 value={newOperator.name}
//                                 onChange={(e) => setNewOperator({ ...newOperator, name: e.target.value })}
//                             />
//                             <TextField
//                                 label="Email"
//                                 size="small"
//                                 fullWidth
//                                 value={newOperator.email}
//                                 onChange={(e) => setNewOperator({ ...newOperator, email: e.target.value })}
//                             />
//                             <TextField
//                                 label="Skill Set"
//                                 size="small"
//                                 fullWidth
//                                 value={newOperator.skill}
//                                 onChange={(e) => setNewOperator({ ...newOperator, skill: e.target.value })}
//                             />
//                             <Button 
//                                 variant="contained" 
//                                 onClick={handleAddOperator}
//                                 sx={{ bgcolor: THEME.primary, '&:hover': { bgcolor: '#334155' } }}
//                             >
//                                 Add Member
//                             </Button>
//                         </Stack>
//                     </CardContent>
//                 </Card>
//             </Grid>
//             <Grid item xs={12} md={8}>
//                 <Card sx={{ borderRadius: 3, boxShadow: 2, minHeight: 300 }}>
//                     <CardContent>
//                         <Typography variant="h6" gutterBottom>Team Roster</Typography>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Name</TableCell>
//                                     <TableCell>Skill</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {operators.map((op, i) => (
//                                     <TableRow key={i}>
//                                         <TableCell>
//                                             <Typography variant="body2" fontWeight="bold">{op.name}</Typography>
//                                             <Typography variant="caption" color="text.secondary">{op.email}</Typography>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Chip label={op.skill} size="small" />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                                 {operators.length === 0 && (
//                                   <TableRow>
//                                     <TableCell colSpan={2} align="center" sx={{ py: 3, color: 'text.secondary' }}>
//                                       No operators found.
//                                     </TableCell>
//                                   </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </Grid>
//           </Grid>
//         );

//       case "assignTask":
//         // return renderAssignPCB();
//         return <AssignPCB/>;
      

//       case "corrections":
//         return (
//           <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', borderRadius: 3, boxShadow: 1 }}>
//             <BuildIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
//             <Typography variant="h5" color="text.secondary">Maintenance Mode</Typography>
//             <Typography sx={{ mt: 1 }}>
//               Correction tickets and maintenance requests will appear in this feed.
//             </Typography>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: THEME.bg }}>
      
//       {/* --- Top Header --- */}
//       <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e2e8f0" }}>
//         <Toolbar>
//            {/* If not home, show Back button. If home, show Avatar/Logo */}
//            {currentView !== "home" ? (
//              <IconButton onClick={() => setCurrentView("home")} sx={{ mr: 2 }}>
//                 <ArrowBackIcon />
//              </IconButton>
//            ) : (
//             <Avatar sx={{ bgcolor: THEME.accent, color: "black", mr: 2, fontWeight: 'bold' }}>S</Avatar>
//            )}

//           <Typography variant="h6" sx={{
//                position: 'absolute',      // Takes it out of the flex flow
//                left: '50%',               // Moves to middle
//                transform: 'translateX(-50%)', // Adjusts for its own width
//                fontWeight: 600,
//            }}>
//             {currentView === "home" ? "INTERNAL SUPERVISOR DASHBOARD" : navCards.find(c => c.id === currentView)?.title.toUpperCase()}
//           </Typography>

//           {/* <Button 
//             startIcon={<LogoutIcon />} 
//             color="error" 
//             onClick={onLogout}
//             sx={{ fontWeight: 'bold' }}
//           >
//             Logout
//           </Button> */}
//         </Toolbar>
//       </AppBar>

//       {/* --- Main Content Body --- */}
//       <Box sx={{ p: 3 }}>
//         {currentView === "home" ? (
//           renderHomeGrid()
//         ) : (
//           <Container maxWidth="xl" sx={{ animation: "fadeIn 0.3s" }}>
//              {renderModuleContent()}
//           </Container>
//         )}
//       </Box>

//       {/* Simple animation style */}
//       <style>
//         {`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}
//       </style>
//     </Box>
//   );
// };

// export default SupervisorInternal;




















//Overall DAshboard where all cards are displayed!

import React, { useState, useEffect } from "react"; // Import useEffect
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Alert,
  Container,
  CardActionArea,
  Avatar,
  Stack,
  Divider,
  Checkbox,
  Chip,
  IconButton,
  CircularProgress, // Import for loading state
  Snackbar, // Import for notifications
  Tabs,
  Tab,
  InputAdornment,
  TableContainer,
  Fade
} from "@mui/material";
import AssignPCB from "./InActionPCB/AssignPCB";

// Icons
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh"; // Import Refresh
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AccountTreeIcon from "@mui/icons-material/AccountTree"; // Icon for Flow Assignment
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TableViewIcon from '@mui/icons-material/TableView';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
// import FlowAssigment from "./FlowAssigment";
import FlowAssigment from "./InActionPCB/FlowAssigment";
import axios from "axios";
import { useSelector } from "react-redux";

// --- Theme Colors & Styles ---
const THEME = {
  bg: "#f0f4f8", // Lighter, cooler gray for background
  primary: "#1e293b", 
  accent: "#3b82f6", // Brighter blue for accents
  cardBg: "#ffffff",
  textSecondary: "#64748b",
  gradientCard: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  shadowSoft: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  shadowHover: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
};

const SupervisorInternal = ({
  onLogout,
  // inActionPCBs = [], // You might not need this prop anymore if fetching internally
  handleAssignWork, // Assuming this is still a function passed from parent to handle the logic
}) => {
  const [currentView, setCurrentView] = useState("home");
  
  // --- New State for Database Fetching ---
  const [dbPCBs, setDbPCBs] = useState([]); // Stores the fetched PCBs
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selected, setSelected] = useState([]);
  const [taskgraph,setTaskGraph]= useState({ 
    Inaction_PCB_Count: 0, 
    Assigned_PCB_Count: 0, 
    Completed_PCB_Count: 0, 
    MasterList_PCB_Count: 0, 
    pcbs: [] 
  });
  // ---------------------------------------

  const [operators, setOperators] = useState([]);
  const [selectedPCB, setSelectedPCB] = useState(null);
  const [newOperator, setNewOperator] = useState({
    name: "",
    email: "",
    skill: "",
  });
  const [tableData, setTableData] = useState([]);

  // State for loading/error handling (Optional but recommended)
  const [loading, setLoading] = useState(false);

  // --- Dashboard Specific State ---
  const [dashTab, setDashTab] = useState("stats"); // 'stats' | 'traceability'
  const [searchTrace, setSearchTrace] = useState("");

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"]; 

  // Derived data for charts (You might want to base this on dbPCBs now, or keep using props if Dashboard is global)
  // const taskData = [
  //   { name: "Pending", value: dbPCBs.filter((p) => !p.isWorkAssigned).length },
  //   { name: "Assigned", value: dbPCBs.filter((p) => p.isWorkAssigned).length },
  // ];

  // const DUMMY_DATA = [
  //   { id: 1, serialNumber: "PCB-001", partNumber: "PN-101", overallStatus: "Active", currentStage: "Solder Paste", currentOperator: "Alice Smith", stepStatus: "Pending" },
  //   { id: 2, serialNumber: "PCB-002", partNumber: "PN-102", overallStatus: "Hold",   currentStage: "Reflow",       currentOperator: "Bob Jones",   stepStatus: "Stopped" },
  //   { id: 3, serialNumber: "PCB-003", partNumber: "PN-103", overallStatus: "Active", currentStage: "AOI Inspection",currentOperator: "Charlie Day", stepStatus: "In Progress" },
  // ];



  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)

  

  var API1 = "/supervisor/view"

  var fetchTobeAssignedPCB = "http://192.168.0.20:2000" + API1

  var API2 = "/supervisor/assign"

  var fetchAssignedPCB = "http://192.168.0.20:2000" + API2


  if (configDetails != undefined) {

    if (configDetails.project[0].ServerIP != undefined) {

      
      if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {

        fetchTobeAssignedPCB = configDetails.project[0].ServerIP[0].PythonServerIP + API1

        fetchAssignedPCB = configDetails.project[0].ServerIP[0].PythonServerIP + API2
      }


    }

  }


  useEffect(() => {
    // Only fetch if we are on the 'view' tab to save bandwidth
    if (currentView === "assignTask") {
      setLoading(true);

      // Replace with your actual API URL
      axios.get(fetchAssignedPCB)
        .then((response) => {
          // Assuming your API returns an array or an object containing the array
          // Adjust 'response.data.PcbData' based on your actual API structure
          console.log(response.data)
          const data = response.data || [];
          setTableData(data);
          console.log("*******")
          setLoading(false);
        })
        .catch((err) => {
         console.error("Error fetching data:", err);
     
          // setTableData(DUMMY_DATA)
      
          setLoading(false);
        });
    }
  }, [currentView]); // specific dependency ensures it runs when tab changes

  let user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Only fetch if we are on the 'view' tab to save bandwidth
    if (currentView === "dashboard") {
      setLoading(true);
      const requestParams = { staff_no: user?.id };
      // Replace with your actual API URL
      axios.get(fetchTobeAssignedPCB, { params: requestParams })
        .then((response) => {
          // Assuming your API returns an array or an object containing the array
          // Adjust 'response.data.PcbData' based on your actual API structure
          console.log(response.data)
          const data = response.data || {};
          setTaskGraph(data);
          console.log("11111111111111",response.data)
          setLoading(false);
        })
        .catch((err) => {
         console.error("Error fetching data:", err);
     
          // setTableData(DUMMY_DATA)
      
          setLoading(false);
        });
    }
  }, [currentView]); // specific dependency ensures it runs when tab changes




  // --- Handlers ---
  const handleAddOperator = () => {
    if (!newOperator.name || !newOperator.email) return alert("Fill all details");
    setOperators([...operators, newOperator]);
    setNewOperator({ name: "", email: "", skill: "" });
  };




  const navCards = [
    { 
      id: "dashboard", 
      title: "Overview Stats", 
      desc: "View charts, workload distribution, and PCB analytics.",
      icon: <DashboardIcon sx={{ fontSize: 60, color: "#6366f1" }} />,
      color: "#e0e7ff",
      gradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)"
    },
    // { 
    //   id: "createOperator", 
    //   title: "Manage Operators", 
    //   desc: "Add new staff and view team roster",
    //   icon: <GroupAddIcon sx={{ fontSize: 50, color: "#10b981" }} />,
    //   color: "#d1fae5"
    // },
    { 
      id: "assignTask", 
      title: "Assign Tasks", 
      desc: `Manage Active PCBs and allocate tasks to operators.`,
      icon: <AssignmentIcon sx={{ fontSize: 60, color: "#f59e0b" }} />,
      color: "#fef3c7",
      gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
    },
    // --- NEW TAB HERE ---
    { 
      id: "flowAssignment", 
      title: "Flow Assignment", 
      desc: "Create sequences, configure workflows & assign operators.",
      icon: <AccountTreeIcon sx={{ fontSize: 60, color: "#8b5cf6" }} />, 
      color: "#ede9fe",
      gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)"
    },
    // --------------------
    // { 
    //   id: "corrections", 
    //   title: "Corrections", 
    //   desc: "Handle process correction tickets",
    //   icon: <BuildIcon sx={{ fontSize: 50, color: "#ef4444" }} />,
    //   color: "#fee2e2"
    // },
];

  /** ===========================
   * RENDER HELPERS
   * =========================== */



  const renderAssignPCB = () => {
    
    // 1. Define Dummy Data (Fallback)
    const DUMMY_DATA = [
      { id: 1, serialNumber: "PCB-001", partNumber: "PN-101", overallStatus: "Active", currentStage: "Solder Paste", currentOperator: "Alice Smith", stepStatus: "Pending" },
      { id: 2, serialNumber: "PCB-002", partNumber: "PN-102", overallStatus: "Hold",   currentStage: "Reflow",       currentOperator: "Bob Jones",   stepStatus: "Stopped" },
      { id: 3, serialNumber: "PCB-003", partNumber: "PN-103", overallStatus: "Active", currentStage: "AOI Inspection",currentOperator: "Charlie Day", stepStatus: "In Progress" },
    ];

    // 2. Determine Data Source
    const displayData = (tableData && tableData.length > 0) ? tableData : DUMMY_DATA;
    //const displayData = (tableData && tableData.length > 0) ? tableData : DUMMY_DATA;
    // 3. Columns Definition
    const COLUMNS = ["Serial Number", "Part Number", "Overall Status", "Current Stage", "Current Operator", "Step Status"];

    // --- SELECTION STATE & HANDLERS ---
    // We need state to track selected IDs. 
    // Note: If you are inside a functional component, ensure 'selected' state is defined at the top level.
    // Assuming 'selected' and 'setSelected' are passed in or defined in the parent:
    // const [selected, setSelected] = useState([]); 

    // Helper: Select All
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = tableData.map((n) => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };

    // const handleSelectAllClick = (event) => {
    //   if (event.target.checked) {
    //     // Use the same fallback logic here
    //     const newSelecteds = displayData.map((n) => n.id || n.pcb_id || n.serial_number || n.serialNumber);
    //     setSelected(newSelecteds);
    //     return;
    //   }
    //   setSelected([]);
    // };

    // Helper: Select One
    const handleClick = (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Helper: Assign Action
    // const handleAssign = () => {
    //     // Filter the data to get full objects of selected IDs
    //     const selectedDetails = displayData.filter(row => selected.includes(row.id));
        
    //     console.log("Sending Details for:", selectedDetails);
    //     alert(`Sending details for ${selectedDetails.length} rows to API... (Check Console)`);
        
    //     // Example API Call:
    //     // axios.post('/api/assign', { assignments: selectedDetails });
    // };


    // Helper: Assign Action
    const handleAssign = async () => {
      // 1. Get Current User ID (Supervisor)
      let supervisorId = 900; // Default fallback
      const userStr = localStorage.getItem("user");
      if (userStr) {
          try {
              const user = JSON.parse(userStr);
              // Adjust 'id' to whatever property your user object uses (e.g., user.staffId, user.id)
              supervisorId = user.id || user.staffNumber || 900; 
          } catch (e) {
              console.error("Error parsing user from local storage", e);
          }
      }

      // 2. Construct Payload
      // 'selected' is already an array of IDs like [1, 2, 3] because of how handleClick works
      const payload = {
          supervisor_staff_no: 900, 
          pcb_id: selected
      };
      
      console.log("Posting Payload:", payload);

      try {
          // 3. Send POST Request
          // Replace URL with your specific endpoint
          await axios.post(fetchAssignedPCB, payload);
          
          
          alert(`Successfully assigned ${selected.length} PCBs!`);
          setSelected([]); // Clear selection after success
      } catch (error) {
          console.error("Assignment failed:", error);
          alert("Failed to assign tasks. Check console for details.");
      }
  };

    // --- RENDER ---

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Available PCBs (InAction)</Typography>
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {/* CHECKBOX HEADER */}
                <TableCell padding="checkbox" sx={{ bgcolor: "#eeeeee" }}>
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < tableData.length}
                    checked={tableData.length > 0 && selected.length === tableData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>

                {COLUMNS.map((col) => (
                  <TableCell key={col} sx={{ fontWeight: "bold", bgcolor: "#eeeeee" }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
                {tableData.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow 
                        hover 
                        key={row.id || index}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                    >
                   
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row.id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>

                      <TableCell>{row.serial_number || "N/A"}</TableCell>
                      <TableCell>{row.part_number || "N/A"}</TableCell>
                      <TableCell>
                          <Chip 
                              label={row.overall_status} 
                              color={row.overall_status === "Active" ? "success" : "warning"} 
                              size="small" 
                          />
                      </TableCell>
                      <TableCell>{row.current_stage || "N/A"}</TableCell>
                      <TableCell>{row.current_operator || "Unassigned"}</TableCell>
                      <TableCell>{row.step_status || "N/A"}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>

        {/* ASSIGN BUTTON BELOW TABLE */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleAssign}
                disabled={selected.length === 0}
            >
                Assign Selected ({selected.length})
            </Button>
        </Box>

      </Box>
    );
  };
  // --- Views ---

  // 1. The "Home" Grid View
  const renderHomeGrid = () => (
    <Container maxWidth="xl" sx={{ mt: 4, height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="800" sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
          Internal Supervisor Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1, fontWeight: 400 }}>
          Select a module to begin managing operations
        </Typography>
      </Box>

      {/* Grid container with justifyContent="center" to center the cards */}
      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {navCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
            <Card 
              sx={{ 
                height: 320, // Fixed height for uniformity
                borderRadius: 5, 
                background: THEME.gradientCard,
                boxShadow: THEME.shadowSoft,
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.8)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": { 
                  transform: "translateY(-10px) scale(1.02)", 
                  boxShadow: THEME.shadowHover 
                },
                // Hover effect logic
                "&:hover .hover-content": {
                  opacity: 1,
                  transform: "translateY(0)"
                },
                "&:hover .default-content": {
                  opacity: 0.3,
                  transform: "translateY(-20px)"
                }
              }}
            >
              <CardActionArea 
                sx={{ height: "100%", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                onClick={() => setCurrentView(card.id)}
              >
                {/* Default Visible Content */}
                <Box className="default-content" sx={{ transition: "all 0.4s ease", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ 
                    p: 4, 
                    borderRadius: "50%", 
                    background: card.gradient,
                    mb: 3,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="700" sx={{ color: "#334155" }}>
                    {card.title}
                  </Typography>
                </Box>

                {/* Hover Reveal Content */}
                <Box 
                  className="hover-content"
                  sx={{ 
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "40%", // Covers bottom portion
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    opacity: 0, // Hidden by default
                    transform: "translateY(100%)", // Pushed down by default
                    transition: "all 0.3s ease-in-out",
                    borderTop: "1px solid #e2e8f0"
                  }}
                >
                  <Typography variant="body1" color="text.secondary" fontWeight="500">
                    {card.desc}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  // 2. The Inner Module View
  const renderModuleContent = () => {

    console.log("taskgraph",taskgraph)
    switch (currentView) {
      case "dashboard":
      
      const chartData = [
        { name: "Inaction", value: taskgraph.Inaction_PCB_Count || 0 },
        { name: "Assigned", value: taskgraph.Assigned_PCB_Count || 0 },
        { name: "Completed", value: taskgraph.Completed_PCB_Count || 0 },
      ];

      // Filter out zero values to avoid ugly empty chart slices (optional)
      const activeData = chartData.filter(d => d.value > 0);

      // --- TRACEABILITY LOGIC ---
      // Filter out "Inaction" items (To Be Assigned)
      // Assuming 'taskgraph.pcbs' contains the list based on reuse of the API
      // If taskgraph only contains counts, we would need to fetch, but usually 'taskgraph' stores the response data.
      // Based on AssignPCB reuse, we assume the API returns { pcbs: [...] } or the data IS the list with props.
      // However, initial code setTaskGraph(data). Let's assume data.pcbs exists.
      
      const rawTraceData = taskgraph.pcbs || [];
      const traceData = rawTraceData.filter(item => {
          // Filter out "Inaction" status to show only Assigned and Completed
          // Adjust property name based on your API (item.status or item.Overall_PCB_status)
          const status = item.Overall_PCB_status || item.status;
          return status !== 'Inaction' && status !== 'New';
      });

      // Search Filtering
      const filteredTraceData = traceData.filter(row => {
          if (!searchTrace) return true;
          const query = searchTrace.toLowerCase();
          return (
             (row.serialNo || "").toLowerCase().includes(query) ||
             (row.partNumber || "").toLowerCase().includes(query) ||
             (row.currentProcessOpeName || "").toLowerCase().includes(query)
          );
      });

      const handleDashTabChange = (event, newValue) => {
          setDashTab(newValue);
      };

        return (
          <Box>
            {/* SUB-NAVIGATION TABS */}
            <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
                <Tabs value={dashTab} onChange={handleDashTabChange} aria-label="dashboard tabs">
                    <Tab 
                        icon={<AnalyticsIcon />} 
                        iconPosition="start" 
                        label="Dashboard" 
                        value="stats" 
                        sx={{ fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
                    />
                    <Tab 
                        icon={<TableViewIcon />} 
                        iconPosition="start" 
                        label="Traceability" 
                        value="traceability" 
                        sx={{ fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
                    />
                </Tabs>
            </Box>

            {/* TAB 1: STATISTICS (Existing) */}
            {dashTab === "stats" && (
                <Fade in={true}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                        <Card sx={{ height: "100%", borderRadius: 4, boxShadow: THEME.shadowSoft }}>
                            <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#334155' }}>PCBs Datachart</Typography>
                            <Box sx={{ height: 350, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={activeData} // Pass the transformed array
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80} // Increased radius for better look
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                nameKey="name"
                                                stroke="none"
                                            >
                                                {activeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} md={5}>
                        <Card sx={{ height: "100%", borderRadius: 4, boxShadow: THEME.shadowSoft }}>
                            <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#334155' }}>Quick Stats</Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                            ) : (
                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    {/* Display the raw data from taskgraph object */}
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f1f5f9', borderLeft: `6px solid ${COLORS[0]}` }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="600">Inaction PCBs (Available)</Typography>
                                        <Typography variant="h4" fontWeight="800" color="text.primary">{taskgraph.Inaction_PCB_Count || 0}</Typography>
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#ecfdf5', borderLeft: `6px solid ${COLORS[1]}` }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="600">Assigned PCBs</Typography>
                                        <Typography variant="h4" fontWeight="800" color="text.primary">{taskgraph.Assigned_PCB_Count || 0}</Typography>
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#fffbeb', borderLeft: `6px solid ${COLORS[2]}` }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="600">Completed PCBs</Typography>
                                        <Typography variant="h4" fontWeight="800" color="text.primary">{taskgraph.Completed_PCB_Count || 0}</Typography>
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', borderLeft: `6px solid #94a3b8` }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="600">Total Master List</Typography>
                                        <Typography variant="h4" fontWeight="800" color="text.primary">{taskgraph.MasterList_PCB_Count || 0}</Typography>
                                    </Paper>
                                </Stack>
                            )}
                            </CardContent>
                        </Card>
                        </Grid>
                    </Grid>
                </Fade>
            )}

            {/* TAB 2: TRACEABILITY (New Table) */}
            {dashTab === "traceability" && (
                <Fade in={true}>
                    <Box>
                        {/* Search Bar */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                             <TextField
                                placeholder="Search Serial No, Part No..."
                                size="small"
                                value={searchTrace}
                                onChange={(e) => setSearchTrace(e.target.value)}
                                sx={{ width: 300, bgcolor: 'white' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTrace && (
                                        <IconButton size="small" onClick={() => setSearchTrace("")}>
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>

                        <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: THEME.shadowSoft }}>
                            <TableContainer sx={{ maxHeight: '65vh' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>SERIAL NO</TableCell>
                                            <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>PART NUMBER</TableCell>
                                            <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>CURRENT STAGE</TableCell>
                                            <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>OPERATOR</TableCell>
                                            <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>STEP STATUS</TableCell>
                                            <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>OVERALL STATUS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                             <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                                        ) : filteredTraceData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                                    No Assigned or Completed tasks found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredTraceData.map((row, index) => (
                                                <TableRow key={index} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{row.serialNo}</TableCell>
                                                    <TableCell>{row.partNumber}</TableCell>
                                                    
                                                    {/* Stage Info */}
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="600">{row.currentProcessName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Step: {row.currentStepOrder}</Typography>
                                                    </TableCell>

                                                    {/* Operator Info */}
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <PersonIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="500">
                                                                    {row.currentProcessOpeName || "Unassigned"}
                                                                </Typography>
                                                                {row.currentProcessOpeStaffno && (
                                                                    <Typography variant="caption" color="text.secondary">ID: {row.currentProcessOpeStaffno}</Typography>
                                                                )}
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>

                                                    {/* Step Status */}
                                                    <TableCell>
                                                        <Chip 
                                                            label={row.currentProcessstatus || "Pending"} 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: row.currentProcessstatus === "Start" ? "#dbeafe" : "#f1f5f9",
                                                                color: row.currentProcessstatus === "Start" ? "#1e40af" : "#475569",
                                                                fontWeight: 600 
                                                            }}
                                                        />
                                                    </TableCell>

                                                    {/* Overall Status */}
                                                    <TableCell>
                                                        <Chip 
                                                            label={row.Overall_PCB_status} 
                                                            size="small"
                                                            color={row.Overall_PCB_status === "Completed" ? "success" : "default"}
                                                            variant={row.Overall_PCB_status === "Completed" ? "filled" : "outlined"}
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </Fade>
            )}
          </Box>
        );

      case "flowAssignment":
        return <FlowAssigment />;
        // <FlowAssignment/>;
        // <ViewDetailsComponent />;
      case "createOperator":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="h6" sx={{ display:'flex', alignItems:'center', gap: 1 }}>
                                <PersonIcon color="primary"/> New Profile
                            </Typography>
                            <Divider />
                            <TextField
                                label="Full Name"
                                size="small"
                                fullWidth
                                value={newOperator.name}
                                onChange={(e) => setNewOperator({ ...newOperator, name: e.target.value })}
                            />
                            <TextField
                                label="Email"
                                size="small"
                                fullWidth
                                value={newOperator.email}
                                onChange={(e) => setNewOperator({ ...newOperator, email: e.target.value })}
                            />
                            <TextField
                                label="Skill Set"
                                size="small"
                                fullWidth
                                value={newOperator.skill}
                                onChange={(e) => setNewOperator({ ...newOperator, skill: e.target.value })}
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleAddOperator}
                                sx={{ bgcolor: THEME.primary, '&:hover': { bgcolor: '#334155' } }}
                            >
                                Add Member
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, minHeight: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Team Roster</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Skill</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {operators.map((op, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{op.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{op.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={op.skill} size="small" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {operators.length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={2} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                      No operators found.
                                    </TableCell>
                                  </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
          </Grid>
        );

      case "assignTask":
        // return renderAssignPCB();
        return <AssignPCB/>;
      

      case "corrections":
        return (
          <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', borderRadius: 3, boxShadow: 1 }}>
            <BuildIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">Maintenance Mode</Typography>
            <Typography sx={{ mt: 1 }}>
              Correction tickets and maintenance requests will appear in this feed.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: THEME.bg, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
      
      {/* --- Top Header --- */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
        <Toolbar>
           {/* If not home, show Back button. If home, show Avatar/Logo */}
           {currentView !== "home" ? (
             <IconButton onClick={() => setCurrentView("home")} sx={{ mr: 2 }}>
                <ArrowBackIcon />
             </IconButton>
           ) : (
            <Avatar sx={{ bgcolor: THEME.accent, color: "white", mr: 2, fontWeight: 'bold', boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)" }}>S</Avatar>
           )}

          <Typography variant="h6" sx={{
               position: 'absolute',      // Takes it out of the flex flow
               left: '50%',               // Moves to middle
               transform: 'translateX(-50%)', // Adjusts for its own width
               fontWeight: 700,
               color: '#1e293b',
               letterSpacing: '0.5px'
           }}>
            {currentView === "home" ? "INTERNAL SUPERVISOR DASHBOARD" : navCards.find(c => c.id === currentView)?.title.toUpperCase()}
          </Typography>

          {/* <Button 
            startIcon={<LogoutIcon />} 
            color="error" 
            onClick={onLogout}
            sx={{ fontWeight: 'bold' }}
          >
            Logout
          </Button> */}
        </Toolbar>
      </AppBar>

      {/* --- Main Content Body --- */}
      <Box sx={{ p: 3 }}>
        {currentView === "home" ? (
          renderHomeGrid()
        ) : (
          <Container maxWidth="xl" sx={{ animation: "fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
             {renderModuleContent()}
          </Container>
        )}
      </Box>

      {/* Simple animation style */}
      <style>
        {`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}
      </style>
    </Box>
  );
};

export default SupervisorInternal;