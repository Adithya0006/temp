
// // //below dashboard is adithya's code 

// // import React, { useState, useEffect } from 'react';
// // import { useSelector } from 'react-redux/es/exports';
// // import axios from 'axios';
// // import {
// //   Box,
// //   Container,
// //   Grid,
// //   Card,
// //   CardContent,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Chip,
// //   CircularProgress,
// //   Divider,
// //   Alert,
// //   AppBar,
// //   Toolbar,
// //   IconButton
// // } from '@mui/material';
// // import {
// //   Speed,
// //   WarningAmber,
// //   CheckCircle,
// //   Schedule,
// //   Engineering,
// //   Menu as MenuIcon,
// //   Notifications,
// //   AccountCircle
// // } from '@mui/icons-material';
// // import { autoType } from 'd3';

// // // --- 1. MOCK DATA (Fallback) ---
// // // This acts as your "json file" if the API fails.
// // const MOCK_DATA = {
// //   meta: {
// //     role: "SUPERVISOR_EXTERNAL",
// //     supervisor_name: "SUPERVISOR INTERNAL",
// //     generated_at: new Date().toISOString(), // ensuring current date for demo
// //     timezone: "UTC"
// //   },   
// //   pcb_summary: {
// //     master_total: 150,
// //     new: 5,
// //     inaction: 0,
// //     assigned: 15,
// //     completed: 130,
// //     completed_today: 45
// //   },                                                      
// //   performance_metrics: {
// //     avg_completion_time_minutes: 42,
// //     completed_last_1_hour: 12,
// //     completed_last_8_hours: 90,
// //     completed_today: 45,
// //     trend_vs_yesterday: "STABLE"
// //   },
// //   operational_health: {
// //     wip_pcbs: 5,
// //     stuck_pcbs: 0,
// //     avg_wip_age_minutes: 12,
// //     health_status: "GREEN"
// //   },
// //   alerts: {
// //     delayed_pcbs: 0,
// //     sla_breaches: 0,
// //     overall_severity: "GREEN",
// //     critical_processes: []
// //   },
// //   pcbs: [
// //     {
// //       pcb_serial: "32401$113300033357",
// //       serial_no: "32401",
// //       part_number: "113300033357",
// //       current_step: "AOI CORRECTION",
// //       current_step_order: 6,
// //       status: "IN_PROGRESS",
// //       operator: { staff_no: "E169", name: "Santosh Kumar" },
// //       time_in_current_step_minutes: 45
// //     },
// //     {
// //       pcb_serial: "32402$113300033358",
// //       serial_no: "32402",
// //       part_number: "113300033358",
// //       current_step: "SOLDERING",
// //       current_step_order: 4,
// //       status: "IN_PROGRESS",
// //       operator: { staff_no: "E170", name: "Ravi Teja" },
// //       time_in_current_step_minutes: 12
// //     }
// //   ]
// // };

// // // --- 2. HELPER COMPONENTS ---

// // // A Reusable Card for Top-level stats
// // const StatCard = ({ title, value, icon, subtext }) => (
// //   <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
// //     <CardContent>
// //       <Box display="flex" justifyContent="space-between" alignItems="start">
// //         <Box>
// //           <Typography color="text.secondary" gutterBottom variant="overline" fontWeight="bold">
// //             {title}
// //           </Typography>
// //           <Typography variant="h4" fontWeight="bold" color="text.primary">
// //             {value}
// //           </Typography>
// //           {subtext && (
// //             <Typography variant="caption" color="text.secondary">
// //               {subtext}
// //             </Typography>
// //           )}
// //         </Box>
// //         <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
// //           {icon}
// //         </Box>
// //       </Box>
// //     </CardContent>
// //   </Card>
// // );

// // // --- 3. MAIN DASHBOARD COMPONENT ---

// // const SupervisorExternal = () => {
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
// //   console.log("config details: ",configDetails)

// //   var API = "/supervisor/external/dashboard"
// //   var fetchDash = "http://192.168.0.20:8082" + API
// //   if (configDetails != undefined) {
// //     if (configDetails.project[0].ServerIP != undefined) {
// //       if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {
// //         fetchDash = configDetails.project[0].ServerIP[0].NodeServerIP + API
// //       }
// //     }
// //   }
// //   // useEffect for Fetching Data
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         // ---------------------------------------------------------
// //         // REAL API CALL (Uncomment and replace URL when ready)
// //         // ---------------------------------------------------------
// //         let user = JSON.parse(localStorage.getItem("user"));
// //         const requestParams = { staff_no: user?.id };
// //         console.log("response of ext1 ");
// //         const response = await axios.get(fetchDash,{ params: requestParams });
// //         console.log("response of ext2 : ",response.data);
// //         // console.log("response of ext: ",response.data);
// //         setData(response.data);
        
// //         // Simulating API delay
// //         await new Promise(resolve => setTimeout(resolve, 1200));
        
// //         // Using Mock Data for now
// //         // setData();
// //         setLoading(false);

// //       } catch (err) {
// //         console.error("API Error, falling back to JSON:", err);
// //         // Fallback Logic
// //         setError("Live connection failed. Using local cached data.");
// //         setData(MOCK_DATA);
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   // UI Helpers
// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case 'IN_PROGRESS': return 'primary';
// //       case 'COMPLETED': return 'success';
// //       case 'STUCK': return 'error';
// //       default: return 'default';
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
// //         <CircularProgress size={60} thickness={4} />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box sx={{ flexGrow: 1, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      
// //       {/* Navigation Bar */}
// //       <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
// //         <Toolbar>
// //           {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
// //             <MenuIcon />
// //           </IconButton> */}
// //           <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#1a237e' }}>
// //             PCB PRODUCTION TRACKER
// //           </Typography>
// //           {/* <IconButton color="inherit">
// //             <Notifications />
// //           </IconButton> */}
// //           <Box display="flex" alignItems="center" ml={2} gap={1}>
// //             <AccountCircle />
// //             <Typography variant="body2" fontWeight="bold">
// //               {data.meta.supervisor_name}
// //             </Typography>
// //           </Box>
// //         </Toolbar>
// //       </AppBar>

// //       <Container maxWidth="xl" sx={{ py: 4 }}>
        
// //         {/* Error Alert if API failed */}
// //         {error && (
// //           <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
// //             {error}
// //           </Alert>
// //         )}

// //         {/* Header Info */}
// //         <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
// //           <Box>
// //             <Typography variant="h5" fontWeight="bold" color="text.primary">
// //              {data.time_insights?.current_shift}
// //             </Typography>
// //             <Typography variant="body2" color="text.secondary">
// //               Data Generated: {new Date(data.meta.generated_at).toLocaleString()}
// //             </Typography>
// //           </Box>
// //           {/* <Chip 
// //             label={`System Status: ${data.operational_health.health_status}`}
// //             color={data.operational_health.health_status === 'GREEN' ? 'success' : 'error'}
// //             sx={{ fontWeight: 'bold' }}
// //           /> */}
// //         </Box>

// //         {/* KPI Cards Row */}
// //         <Grid container spacing={3} mb={4}>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <StatCard 
// //               title="Total Tasks Completed Today" 
// //               value={data.pcb_summary.completed_today} 
// //               subtext="Units Completed"
// //               icon={<CheckCircle fontSize="large" color="success" />} 
// //             />
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <StatCard 
// //               title="Active WIP" 
// //               value={data.operational_health.wip_pcbs} 
// //               subtext="Units on Line"
// //               icon={<Engineering fontSize="large" color="primary" />} 
// //             />
// //           </Grid>
// //           {/* <Grid item xs={12} sm={6} md={3}>
// //             <StatCard 
// //               title="Avg Cycle Time" 
// //               value={`${data.performance_metrics.avg_completion_time_minutes}m`} 
// //               subtext={data.performance_metrics.trend_vs_yesterday}
// //               icon={<Schedule fontSize="large" color="info" />} 
// //             />
// //           </Grid> */}
// //           {/* <Grid item xs={12} sm={6} md={3}>
// //             <StatCard 
// //               title="Efficiency Rate" 
// //               value="98%" 
// //               subtext="No SLA Breaches"
// //               icon={<Speed fontSize="large" color="warning" />} 
// //             />
// //           </Grid> */}
// //         </Grid>

// //         {/* Main Content Area */}
// //         <Grid container spacing={3}>
          
// //           {/* Left: Active Production Table */}
// //           {/* <Grid item xs={12} lg={8}>
// //             <Paper elevation={2} sx={{ borderRadius: 2 }} style={{overflowY:autoType}}>
// //               <Box p={3} borderBottom="1px solid #eee">
// //                 <Typography variant="h6" fontWeight="bold">Real-time Production Queue</Typography>
// //               </Box>
// //               <TableContainer sx={{overflowX:"auto"}}>
// //                 <Table sx={{ minWidth: 700 }} aria-label="customized table">
// //                   <TableHead sx={{ bgcolor: '#f5f5f5' }}>
// //                     <TableRow>
// //                       <TableCell><strong>Serial No</strong></TableCell>
// //                       <TableCell><strong>Part Number</strong></TableCell>
// //                       <TableCell><strong>Stage</strong></TableCell>
// //                       <TableCell><strong>Operator</strong></TableCell>
// //                       <TableCell><strong>Duration</strong></TableCell>
// //                       <TableCell><strong>Status</strong></TableCell>
// //                     </TableRow>
// //                   </TableHead>
// //                   <TableBody>
// //                     {data.pcbs && data.pcbs.length > 0 ? (
// //                       data.pcbs.map((pcb) => (
// //                         <TableRow key={pcb.pcb_serial} hover>
// //                         <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
// //                           {pcb?.serial_no ? pcb.serial_no : 'N/A'}
// //                         </TableCell>
// //                         <TableCell>
// //                           {pcb?.part_number ? pcb.part_number : 'N/A'}
// //                         </TableCell>
// //                         <TableCell>
// //                           <Box display="flex" alignItems="center" gap={1}>
// //                             <Box width={8} height={8} borderRadius="50%" bgcolor="#ff9800" />
// //                             {pcb?.current_step ? pcb.current_step : 'N/A'}
// //                           </Box>
// //                         </TableCell>
// //                         <TableCell>
// //                           <Typography variant="body2" fontWeight="500">
// //                             {pcb?.operator?.name ? pcb.operator.name : 'N/A'}
// //                           </Typography>
// //                           <Typography variant="caption" color="text.secondary">
// //                             {pcb?.operator?.staff_no ? pcb.operator.staff_no : 'N/A'}
// //                           </Typography>
// //                         </TableCell>
// //                         <TableCell>
// //                           {pcb.time_in_current_step_minutes ? pcb.time_in_current_step_minutes : 'N/A'}
// //                         </TableCell>
// //                         <TableCell>
// //                           <Chip
// //                             label={pcb?.status?.replace('_', ' ') || 'N/A'} //Handles potential null status before replacing
// //                             color={getStatusColor(pcb?.status || 'unknown')} //Handles null status for color as well
// //                             size="small"
// //                             variant="filled"
// //                           />
// //                         </TableCell>
// //                       </TableRow>
// //                       ))
// //                     ) : (
// //                       <TableRow>
// //                         <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
// //                           No active production units found.
// //                         </TableCell>
// //                       </TableRow>
// //                     )}
// //                   </TableBody>
// //                 </Table>
// //               </TableContainer>
// //             </Paper>
// //           </Grid> */}
// //            <Grid item xs={12} lg={8}>
// //             <Paper elevation={2} sx={{ borderRadius: 2 }}>
// //               <Box p={3} borderBottom="1px solid #eee">
// //                 <Typography variant="h6" fontWeight="bold">Real-time Production Queue</Typography>
// //               </Box>
// //               <TableContainer sx={{ overflowX: 'auto', maxHeight: '450px',textAlign:"center" }}> {/* Add maxHeight for controlled vertical scrolling */}
// //                 <Table sx={{ minWidth: 700 }} aria-label="customized table">
// //                   <TableHead sx={{ bgcolor: '#f5f5f5' }}>
// //                     <TableRow>
// //                       <TableCell><strong>Serial No</strong></TableCell>
// //                       <TableCell><strong>Part Number</strong></TableCell>
// //                       <TableCell ><strong>Stage</strong></TableCell>
// //                       <TableCell><strong>Operator</strong></TableCell>
// //                       {/* <TableCell><strong>Duration</strong></TableCell> */}
// //                       <TableCell><strong>Status</strong></TableCell>
// //                     </TableRow>
// //                   </TableHead>
// //                   <TableBody>
// //                     {data.pcbs && data.pcbs.length > 0 ? (
// //                       data.pcbs.map((pcb) => (
// //                         <TableRow key={pcb.pcb_serial} hover>
// //                           <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
// //                             {pcb?.serial_no ? pcb.serial_no : 'N/A'}
// //                           </TableCell>
// //                           <TableCell>
// //                             {pcb?.part_number ? pcb.part_number : 'N/A'}
// //                           </TableCell>
// //                           <TableCell>
// //                             <Box display="flex" alignItems="center" gap={1}>
// //                               <Box width={8} height={8} borderRadius="50%" bgcolor="#ff9800" />
// //                               {pcb?.current_step ? pcb.current_step : 'N/A'}
// //                             </Box>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Typography variant="body2" fontWeight="500" >
// //                               {pcb?.operator?.name ? pcb.operator.name : 'N/A'}
// //                             </Typography>
// //                             <Typography variant="caption" color="text.secondary">
// //                               {pcb?.operator?.staff_no ? pcb.operator.staff_no : ' '}
// //                             </Typography>
// //                           </TableCell>
// //                           {/* <TableCell>
// //                             {pcb.time_in_current_step_minutes ? pcb.time_in_current_step_minutes : 'N/A'}
// //                           </TableCell> */}
// //                           <TableCell>
// //                             <Chip
// //                               label={pcb?.status?.replace('_', ' ') || 'N/A'} //Handles potential null status before replacing
// //                               color={getStatusColor(pcb?.status || 'unknown')} //Handles null status for color as well
// //                               size="small"
// //                               variant="filled"
// //                             />
// //                           </TableCell>
// //                         </TableRow>
// //                       ))
// //                     ) : (
// //                       <TableRow>
// //                         <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
// //                           No active production units found.
// //                         </TableCell>
// //                       </TableRow>
// //                     )}
// //                   </TableBody>
// //                 </Table>
// //               </TableContainer>
// //             </Paper>
// //           </Grid>

// //           {/* Right: Operational Details */}
// //           <Grid item xs={12} lg={4}>
            
// //             {/* Operational Health Card */}
// //             {/* <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
// //               <CardContent>
// //                 <Typography variant="h6" gutterBottom fontWeight="bold">
// //                   Operational Health
// //                 </Typography>
// //                 <Divider sx={{ mb: 2 }} />
                
// //                 <Box display="flex" justifyContent="space-between" mb={2}>
// //                   <Typography color="text.secondary">Stuck PCBs</Typography>
// //                   <Typography fontWeight="bold" color="error">
// //                     {data.operational_health.stuck_pcbs}
// //                   </Typography>
// //                 </Box>
// //                 <Box display="flex" justifyContent="space-between" mb={2}>
// //                   <Typography color="text.secondary">SLA Breaches</Typography>
// //                   <Typography fontWeight="bold">
// //                     {data.alerts.sla_breaches}
// //                   </Typography>
// //                 </Box>
// //                 <Box display="flex" justifyContent="space-between">
// //                   <Typography color="text.secondary">Avg WIP Age</Typography>
// //                   <Typography fontWeight="bold">
// //                     {data.operational_health.avg_wip_age_minutes} min
// //                   </Typography>
// //                 </Box>
// //               </CardContent>
// //             </Card> */}

// //             {/* Alerts Panel */}
// //             {/* <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff3e0' }}>
// //               <Box display="flex" alignItems="center" gap={1} mb={1}>
// //                 <WarningAmber color="warning" />
// //                 <Typography variant="h6" fontWeight="bold">System Alerts</Typography>
// //               </Box>
// //               <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
              
// //               {data.alerts.critical_processes.length === 0 ? (
// //                 <Typography variant="body2" color="text.secondary">
// //                   No critical alerts. All systems nominal.
// //                 </Typography>
// //               ) : (
// //                 data.alerts.critical_processes.map((alert, i) => (
// //                   <Typography key={i} color="error" variant="body2">
// //                     • {alert}
// //                   </Typography>
// //                 ))
// //               )}
// //             </Paper> */}

// //           </Grid>
// //         </Grid>
// //       </Container>
// //     </Box>
// //   );
// // };
// // export default SupervisorExternal;






// // //response that will be received from sever!
// // // return {
// // //   "meta": {
// // //       "role": "SUPERVISOR_EXTERNAL",
// // //       "supervisor_name": supervisor.username,
// // //       "generated_at": now.isoformat(),
// // //       "timezone": "UTC"
// // //   },
// // //   "pcb_summary": {
// // //       "master_total": master_total,
// // //       "new": new_count,
// // //       "inaction": inaction_count,
// // //       "assigned": assigned_count,
// // //       "completed": completed_count,
// // //       "completed_today": completed_today
// // //   },
// // //   "performance_metrics": {
// // //       "avg_completion_time_minutes": avg_completion_time,
// // //       "completed_last_1_hour": completed_last_1_hour,
// // //       "completed_last_8_hours": completed_last_8_hours,
// // //       "completed_today": completed_today,
// // //       "trend_vs_yesterday": "STABLE"
// // //   },
// // //   "operational_health": {
// // //       "wip_pcbs": wip_pcbs,
// // //       "stuck_pcbs": stuck_pcbs,
// // //       "avg_wip_age_minutes": avg_wip_age,
// // //       "max_wip_age_minutes": max_wip_age,
// // //       "health_status": health_status
// // //   },
// // //   # "wip_by_process": wip_by_process,
// // //   # "operator_summary": {
// // //   #     "total_operators": total_operators,
// // //   #     "active_operators": active_operators,
// // //   #     "idle_operators": idle_operators,
// // //   #     "avg_tasks_per_operator": avg_tasks_per_operator,
// // //   #     "top_operator": None
// // //   # },
// // //   "alerts": {
// // //       "delayed_pcbs": delayed_pcbs,
// // //       "sla_breaches": 0,
// // //       "mrl_expiry_risks": 0,
// // //       "critical_processes": [],
// // //       "overall_severity": overall_severity
// // //   },
// // //   # "assignment_effectiveness": {
// // //   #     "pcbs_assigned_by_supervisor": assigned_by_supervisor,
// // //   #     "pcbs_completed_from_assigned": completed_from_assigned,
// // //   #     "assignment_completion_rate": completion_rate
// // //   # },
// // //   # "time_insights": {
// // //   #     "current_shift": "SHIFT A",
// // //   #     "shift_start": "08:00",
// // //   #     "shift_end": "16:00",
// // //   #     "shift_completion_count": completed_today
// // //   # },
// // //   "pcbs": pcbs






























// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux/es/exports';
// import axios from 'axios';
// import {
//   Box,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   CircularProgress,
//   Divider,
//   Alert,
//   AppBar,
//   Toolbar,
//   Avatar,
//   Stack,
//   Fade
// } from '@mui/material';
// import {
//   CheckCircle,
//   Engineering,
//   AccountCircle,
//   Factory,
//   DateRange,
//   Assessment
// } from '@mui/icons-material';

// // --- 1. MOCK DATA (Fallback) ---
// // This acts as your "json file" if the API fails.

// const MOCK_DATA = {
//   meta: {
//     role: "SUPERVISOR_EXTERNAL",
//     supervisor_name: "SUPERVISOR INTERNAL",
//     generated_at: new Date().toISOString(), // ensuring current date for demo
//     timezone: "UTC"
//   },
//   pcb_summary: {
//     master_total: 150,
//     new: 5,
//     inaction: 0,
//     assigned: 15,
//     completed: 130,
//     completed_today: 45
//   },
//   performance_metrics: {
//     avg_completion_time_minutes: 42,
//     completed_last_1_hour: 12,
//     completed_last_8_hours: 90,
//     completed_today: 45,
//     trend_vs_yesterday: "STABLE"
//   },
//   operational_health: {
//     wip_pcbs: 5,
//     stuck_pcbs: 0,
//     avg_wip_age_minutes: 12,
//     health_status: "GREEN"
//   },
//   alerts: {
//     delayed_pcbs: 0,
//     sla_breaches: 0,
//     overall_severity: "GREEN",
//     critical_processes: []
//   },
//   pcbs: [
//     {
//       pcb_serial: "32401$113300033357",
//       serial_no: "32401",
//       part_number: "113300033357",
//       current_step: "AOI CORRECTION",
//       current_step_order: 6,
//       status: "IN_PROGRESS",
//       operator: { staff_no: "E169", name: "Santosh Kumar" },
//       time_in_current_step_minutes: 45
//     },
//     {
//       pcb_serial: "32402$113300033358",
//       serial_no: "32402",
//       part_number: "113300033358",
//       current_step: "SOLDERING",
//       current_step_order: 4,
//       status: "IN_PROGRESS",
//       operator: { staff_no: "E170", name: "Ravi Teja" },
//       time_in_current_step_minutes: 12
//     }
//   ]
// };

// // --- 2. HELPER COMPONENTS ---

// // A Reusable Card for Top-level stats with realistic styling
// const StatCard = ({ title, value, icon, subtext, color = "primary" }) => (
//   <Card 
//     elevation={0} 
//     sx={{ 
//       height: '100%', 
//       borderRadius: 4,
//       border: '1px solid #e0e0e0',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
//       transition: 'transform 0.2s',
//       '&:hover': {
//         transform: 'translateY(-4px)',
//         boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
//       }
//     }}
//   >
//     <CardContent sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//         <Box>
//           <Typography color="text.secondary" variant="subtitle2" fontWeight="600" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>
//             {title}
//           </Typography>
//           <Typography variant="h3" fontWeight="700" color="text.primary" sx={{ mt: 1, mb: 0.5 }}>
//             {value}
//           </Typography>
//           {subtext && (
//             <Chip 
//               label={subtext} 
//               size="small" 
//               variant="outlined"
//               sx={{ 
//                 borderRadius: 1, 
//                 height: 20, 
//                 fontSize: '0.65rem', 
//                 fontWeight: 'bold',
//                 borderColor: '#eee',
//                 bgcolor: '#fafafa'
//               }} 
//             />
//           )}
//         </Box>
//         <Box 
//           sx={{ 
//             p: 1.5, 
//             borderRadius: 3, 
//             bgcolor: `${color}.light`, 
//             color: `${color}.main`,
//             display: 'flex',
//             opacity: 0.9
//           }}
//         >
//           {icon}
//         </Box>
//       </Box>
//     </CardContent>
//   </Card>
// );

// // --- 3. MAIN DASHBOARD COMPONENT ---

// const SupervisorExternal = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
//   console.log("config details: ",configDetails)
//   let user = JSON.parse(localStorage.getItem("user"));
//   var API = "/supervisor/external/dashboard";
//   var fetchDash = "http://192.168.0.20:8082" + API;
//   if (configDetails != undefined) {
//     if (configDetails.project[0].ServerIP != undefined) {
//       if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {
//         fetchDash = configDetails.project[0].ServerIP[0].PythonServerIP + API
//       }
//     }
//   }
//   // useEffect for Fetching Data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // ---------------------------------------------------------
//         // REAL API CALL (Uncomment and replace URL when ready)
//         // ---------------------------------------------------------
       
//         const requestParams = { staff_no: user?.id };
//         // console.log("response of ext1 ");
//         const response = await axios.get(fetchDash,{ params: requestParams });
//         // console.log("response of ext2 : ",response.data);
//         console.log("response of ext: ",response.data);
//         setData(response.data);
        
//         // Simulating API delay
//         await new Promise(resolve => setTimeout(resolve, 1200));
        
//         // Using Mock Data for now
//         // setData();
//         setLoading(false);

//       } catch (err) {
//         console.error("API Error, falling back to JSON:", err);
//         // Fallback Logic
//         setError("Live connection failed. Using local cached data.");
//         setData(MOCK_DATA);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // UI Helpers
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'IN_PROGRESS': return 'primary';
//       case 'COMPLETED': return 'success';
//       case 'STUCK': return 'error';
//       default: return 'default';
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5">
//         <Stack alignItems="center" spacing={2}>
//             <CircularProgress size={50} thickness={4} sx={{ color: '#1a237e' }} />
//             <Typography variant="body2" color="text.secondary">Loading Dashboard...</Typography>
//         </Stack>
//       </Box>
//     );
//   }
//   const handlePcbClick=(SerialNo)=>{
//     alert(SerialNo)
//   }
//   return (
//     <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', minHeight: '100vh', paddingBottom: 4 }}>
      
//       {/* Navigation Bar */}
//       <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', color: '#333' }}>
//         <Toolbar>
//           {/* <Factory sx={{ color: '#1a237e', mr: 2, fontSize: 30 }} /> */}
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '800', color: '#1a237e', letterSpacing: '-0.5px' }}>
//             PCB PRODUCTION TRACKER 
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

//       <Container maxWidth="xl" sx={{ py: 4 }}>
        
//         {/* Error Alert if API failed */}
//         {error && (
//             <Fade in={true}>
//                 <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
//                     {error}
//                 </Alert>
//             </Fade>
//         )}

//         {/* Header Info Block */}
//         <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
//           <Box>
//             {/* <Typography variant="h4" fontWeight="800" color="#1a237e" gutterBottom>
//               Overview
//             </Typography> */}
//             <Stack direction="row" spacing={2} alignItems="center">
//                 <Chip  
//                     icon={<DateRange sx={{ fontSize: '1rem !important' }} />} 
//                     label={new Date(data.meta.generated_at).toLocaleString()} 
//                     size="small" 
//                     sx={{ bgcolor: 'white', border: '1px solid #ddd' }}
//                 />
//                 {/* <Chip 
//                     label={data.time_insights?.current_shift || "Shift A"} 
//                     color="primary" 
//                     size="small" 
//                     sx={{ fontWeight: 'bold' }}
//                 /> */}
//             </Stack>
//           </Box>
//         </Box>

//         {/* KPI Cards Row */}
//         <Grid container spacing={3} mb={4}>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               title="Tasks Completed Today" 
//               value={data.pcb_summary.completed_today} 
//               subtext="Units Completed"
//               icon={<CheckCircle fontSize="large" />} 
//               color="success"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               title="Active PCB's" 
//               value={data.operational_health.wip_pcbs} 
//               subtext="Units on Line"
//               icon={<Engineering fontSize="large" />} 
//               color="primary"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               title="Total Pcbs Completed" 
//               value={data.pcb_summary.completed} 
//               subtext="Units on Line"
//               icon={<CheckCircle fontSize="large" />} 
//               color="success"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               title="InAction PCB's" 
//               value={data.pcb_summary.inaction} 
//               subtext="Units on Line"
//               icon={<Engineering fontSize="large" />} 
//               color="primary"
//             />
//           </Grid>
//            {/* <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               title="Avg Cycle Time" 
//               value={`${data.performance_metrics.avg_completion_time_minutes}m`} 
//               subtext="Performance"
//               icon={<Assessment fontSize="large" />} 
//               color="info"
//             />
//           </Grid> */}
//           {/* <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               title="Efficiency Rate" 
//               value="98%" 
//               subtext="No SLA Breaches"
//               icon={<Speed fontSize="large" />} 
//               color="warning"
//             />
//           </Grid> 
//           */}
//         </Grid>

//         {/* Main Content Area */}
//         <Grid container spacing={3}>
          
//           {/* FULL WIDTH TABLE */}
//           {/* Changed from lg={8} to xs={12} to take full breadth */}
//           <Grid item xs={12}>
//             <Paper 
//                 elevation={0} 
//                 sx={{ 
//                     borderRadius: 4, 
//                     border: '1px solid #e0e0e0',
//                     overflow: 'hidden',
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
//                 }}
//             >
//               <Box p={3} borderBottom="1px solid #f0f0f0" display="flex" justifyContent="space-between" alignItems="center">
//                 <Box>
//                     <Typography variant="h6" fontWeight="800" color="#333">Production Queue</Typography>
//                     {/* <Typography variant="body2" color="text.secondary">Real-time tracking of active units</Typography> */}
//                 </Box>
//                 <Chip label="Live Tracking" color="success" size="small" variant="outlined" />
//               </Box>
              
//               <TableContainer sx={{ overflowX: 'auto', maxHeight: '350px' }}>
//                 <Table sx={{ minWidth: 800 }} stickyHeader aria-label="production table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Serial No</TableCell>
//                       <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Part Number</TableCell>
//                       <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Stage</TableCell>
//                       <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Operator</TableCell>
//                       {/* <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Duration</TableCell> */}
//                       <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'center' }}>Status</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.pcbs && data.pcbs.length > 0 ? (
//                       data.pcbs.map((pcb) => (
//                         <TableRow 
//                             key={pcb.pcb_serial} 
//                             hover
//                             sx={{ '&:hover': { bgcolor: '#f5f9ff' } }}
//                             onClick={() => handlePcbClick(pcb.serial_no)}
//                         >
//                           <TableCell component="th" scope="row">
//                             <Typography variant="body2" fontWeight="bold" color="primary">
//                                 {pcb?.serial_no ? pcb.serial_no : 'N/A'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
//                                 {pcb?.part_number ? pcb.part_number : 'N/A'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Box display="flex" alignItems="center" gap={1}>
//                               <Box width={8} height={8} borderRadius="50%" bgcolor="#ff9800" sx={{ boxShadow: '0 0 4px #ff9800' }} />
//                               <Typography variant="body2" fontWeight="500">
//                                 {pcb?.current_step ? pcb.current_step : 'N/A'}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box>
//                                 <Typography variant="body2" fontWeight="600" color="#333">
//                                 {pcb?.operator?.name ? pcb.operator.name : 'N/A'}
//                                 </Typography>
//                                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
//                                 ID: {pcb?.operator?.staff_no ? pcb.operator.staff_no : '-'}
//                                 </Typography>
//                             </Box>
//                           </TableCell>
//                           {/* <TableCell>
//                             {pcb.time_in_current_step_minutes ? `${pcb.time_in_current_step_minutes}m` : 'N/A'}
//                           </TableCell> */}
//                           <TableCell align="center">
//                             <Chip
//                               label={pcb?.status?.replace('_', ' ') || 'N/A'}
//                               color={getStatusColor(pcb?.status || 'unknown')}
//                               size="small"
//                               variant="filled"
//                               sx={{ fontWeight: 'bold', minWidth: 100 }}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
//                             <Box display="flex" flexDirection="column" alignItems="center">
//                                 <Assessment sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
//                                 <Typography color="text.secondary">No active production units found in the queue.</Typography>
//                             </Box>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>

//           {/* Right: Operational Details (Commented out in original, kept here hidden or active if needed later) */}
//           {/* To enable full width table, this grid item must remain removed or hidden, 
//               but the code is preserved below if you wish to re-enable it side-by-side later. 
//           */}
          
//           {/* <Grid item xs={12} lg={4}> */}
//             {/* Operational Health Card */}
//             {/* <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom fontWeight="bold">
//                   Operational Health
//                 </Typography>
//                 <Divider sx={{ mb: 2 }} />
                
//                 <Box display="flex" justifyContent="space-between" mb={2}>
//                   <Typography color="text.secondary">Stuck PCBs</Typography>
//                   <Typography fontWeight="bold" color="error">
//                     {data.operational_health.stuck_pcbs}
//                   </Typography>
//                 </Box>
//                 <Box display="flex" justifyContent="space-between" mb={2}>
//                   <Typography color="text.secondary">SLA Breaches</Typography>
//                   <Typography fontWeight="bold">
//                     {data.alerts.sla_breaches}
//                   </Typography>
//                 </Box>
//                 <Box display="flex" justifyContent="space-between">
//                   <Typography color="text.secondary">Avg WIP Age</Typography>
//                   <Typography fontWeight="bold">
//                     {data.operational_health.avg_wip_age_minutes} min
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card> */}

//             {/* Alerts Panel */}
//             {/* <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff3e0' }}>
//               <Box display="flex" alignItems="center" gap={1} mb={1}>
//                 <WarningAmber color="warning" />
//                 <Typography variant="h6" fontWeight="bold">System Alerts</Typography>
//               </Box>
//               <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
              
//               {data.alerts.critical_processes.length === 0 ? (
//                 <Typography variant="body2" color="text.secondary">
//                   No critical alerts. All systems nominal.
//                 </Typography>
//               ) : (
//                 data.alerts.critical_processes.map((alert, i) => (
//                   <Typography key={i} color="error" variant="body2">
//                     • {alert}
//                   </Typography>
//                 ))
//               )}
//             </Paper> */}

//           {/* </Grid> */}
//         </Grid>
//       </Container>
//     </Box>
//   );
// };
// export default SupervisorExternal;


































import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux/es/exports';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  AppBar,
  Toolbar,
  Avatar,
  Stack,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  CheckCircle,
  Engineering,
  AccountCircle,
  DateRange,
  Assessment,
  Close as CloseIcon,
  Person,
  AccessTime,
  Timer,
  Badge,
  VerifiedUser,
  DataObject
} from '@mui/icons-material';

// --- 1. MOCK DATA (Fallback for Dashboard) ---
const MOCK_DATA = {
  meta: {
    role: "SUPERVISOR_EXTERNAL",
    supervisor_name: "SUPERVISOR INTERNAL",
    generated_at: new Date().toISOString(),
    timezone: "UTC"
  },
  pcb_summary: {
    master_total: 150,
    new: 5,
    inaction: 0,
    assigned: 15,
    completed: 130,
    completed_today: 45
  },
  performance_metrics: {
    avg_completion_time_minutes: 42,
    completed_last_1_hour: 12,
    completed_last_8_hours: 90,
    completed_today: 45,
    trend_vs_yesterday: "STABLE"
  },
  operational_health: {
    wip_pcbs: 5,
    stuck_pcbs: 0,
    avg_wip_age_minutes: 12,
    health_status: "GREEN"
  },
  alerts: {
    delayed_pcbs: 0,
    sla_breaches: 0,
    overall_severity: "GREEN",
    critical_processes: []
  },
  pcbs: [
    {
      pcb_serial: "32401$113300033357",
      serial_no: "32401",
      part_number: "113300033357",
      current_step: "AOI CORRECTION",
      current_step_order: 6,
      status: "IN_PROGRESS",
      operator: { staff_no: "E169", name: "Santosh Kumar" },
      time_in_current_step_minutes: 45
    },
    {
      pcb_serial: "32402$113300033358",
      serial_no: "32402",
      part_number: "113300033358",
      current_step: "SOLDERING",
      current_step_order: 4,
      status: "IN_PROGRESS",
      operator: { staff_no: "E170", name: "Ravi Teja" },
      time_in_current_step_minutes: 12
    }
  ]
};

// --- 2. MOCK DATA (Fallback for Timeline) ---
const MOCK_TIMELINE_RESPONSE = {
  "Serial_No": "32401",
  "Part_Number": "62005774DA",
  "Production_Order": "83079796",
  "Description": "6 CHANNELS TR MODULE",
  "Type": "HEXA-CHILD",
  "New_Time": "2025-12-31T20:50:37.052000+05:30",
  "Inaction_time": "2025-12-31T20:50:47.291000+05:30",
  "Assigned_time": "2025-12-31T15:22:24.696002",
  "ope_log_details": [
    {
      "Task_Name": "Labelling & Traceability of the Bare PCB",
      "current_step_id": 1,
      "assignment_id": 1,
      "log_Data": {
        "pcb_date_code": "78",
        "label_gr_details": "UKYU"
      },
      "operator_name": "SANTOSH KUMAR",
      "operator_MRL": "MRL-6",
      "userRole": "Operator",
      "userSBU": "COMPONENTS",
      "start_time": "2025-12-31T21:36:01.730000",
      "Task_Status": "Completed",
      "PCBserialNoPartNumber": "32401$62005774DA",
      "operator_staff_no": "E169",
      "userID": "E169",
      "operator_initial": "SNK",
      "operator_MRL_Expiry": "427.0",
      "userName": "Santosh Kumar",
      "userSBUDiv": "ASSEMBLY",
      "end_time": "2025-12-31T21:36:10.298000"
    }
  ],
  "Durations": [8.568]
};

// --- 3. HELPER COMPONENTS ---

const StatCard = ({ title, value, icon, subtext, color = "primary" }) => (
  <Card 
    elevation={0} 
    sx={{ 
      height: '100%', 
      borderRadius: 4,
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="text.secondary" variant="subtitle2" fontWeight="600" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="700" color="text.primary" sx={{ mt: 1, mb: 0.5 }}>
            {value}
          </Typography>
          {subtext && (
            <Chip 
              label={subtext} 
              size="small" 
              variant="outlined"
              sx={{ 
                borderRadius: 1, 
                height: 20, 
                fontSize: '0.65rem', 
                fontWeight: 'bold',
                borderColor: '#eee',
                bgcolor: '#fafafa'
              }} 
            />
          )}
        </Box>
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: 3, 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            display: 'flex',
            opacity: 0.9
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Helper for Key-Value display in Dialog
const DetailItem = ({ label, value, highlight = false }) => (
  <Box mb={1.5}>
    <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={highlight ? 700 : 500} sx={{ wordBreak: 'break-word' }}>
      {value || '-'}
    </Typography>
  </Box>
);

// --- 4. MAIN DASHBOARD COMPONENT ---

const SupervisorExternal = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Timeline/Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPcbTimeline, setSelectedPcbTimeline] = useState(null);

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
  let user = JSON.parse(localStorage.getItem("user"));

  // --- CONFIGURATION ---
  var DASHBOARD_API = "/supervisor/external/dashboard";
  // Base IP
  var fetchDashBase = "http://192.168.1.12:8000"; 
  
  if (configDetails !== undefined) {
    if (configDetails.project?.[0]?.ServerIP?.[0]?.PythonServerIP !== undefined) {
      fetchDashBase = configDetails.project[0].ServerIP[0].PythonServerIP;
    }
  }

  // --- 1. FETCH DASHBOARD DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardUrl = fetchDashBase + DASHBOARD_API;
        
        // Uncomment below for real Dashboard API
        // const response = await axios.get(dashboardUrl, { params: { staff_no: user?.id } });
        // setData(response.data);
        
        // Using Mock Data for Dashboard
        setData(MOCK_DATA);
        setLoading(false);
        
      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError("Live connection failed. Using local cached data.");
        setData(MOCK_DATA);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDashBase, user?.id]);

  // --- 2. FETCH TIMELINE DATA ---
  const handlePcbClick = async (serialNo) => {
    try {
        const timelineUrl = `${fetchDashBase}/timeline`;
        console.log(`Fetching timeline for ${serialNo} from ${timelineUrl}`);
        
        const response = await axios.get(timelineUrl, { 
            params: { SerialNo: serialNo } 
        });

        console.log("Timeline Response:", response.data);
        setSelectedPcbTimeline(response.data);
        setDialogOpen(true);

    } catch (err) {
        console.error("Failed to fetch timeline:", err);
        setSelectedPcbTimeline(MOCK_TIMELINE_RESPONSE); 
        setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPcbTimeline(null);
  };

  // UI Helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      case 'STUCK': return 'error';
      default: return 'default';
    }
  };

  const formatTime = (isoString) => {
    if(!isoString) return "--:--";
    const date = new Date(isoString);
    return date.toLocaleString(); 
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5">
        <Stack alignItems="center" spacing={2}>
            <CircularProgress size={50} thickness={4} sx={{ color: '#1a237e' }} />
            <Typography variant="body2" color="text.secondary">Loading Dashboard...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', minHeight: '100vh', paddingBottom: 4 }}>
      
      {/* Navigation Bar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', color: '#333' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '800', color: '#1a237e', letterSpacing: '-0.5px' }}>
            PCB PRODUCTION TRACKER 
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2} sx={{ ml: 'auto' }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>
                    {user?.userRole}
                </Typography>
                <Typography variant="caption" sx={{ color: '#777' }}>
                    {user?.id ? user.id.replace('_', ' ') : ''}
                </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#1a237e', fontWeight: 'bold' }}>
                <AccountCircle />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* Error Alert */}
        {error && (
            <Fade in={true}>
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Fade>
        )}

        {/* Header Info Block */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
                <Chip  
                    icon={<DateRange sx={{ fontSize: '1rem !important' }} />} 
                    label={new Date(data.meta.generated_at).toLocaleString()} 
                    size="small" 
                    sx={{ bgcolor: 'white', border: '1px solid #ddd' }}
                />
            </Stack>
          </Box>
        </Box>

        {/* KPI Cards Row */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Tasks Completed Today" 
              value={data.pcb_summary.completed_today} 
              subtext="Units Completed"
              icon={<CheckCircle fontSize="large" />} 
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Active PCB's" 
              value={data.operational_health.wip_pcbs} 
              subtext="Units on Line"
              icon={<Engineering fontSize="large" />} 
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Pcbs Completed" 
              value={data.pcb_summary.completed} 
              subtext="Total Output"
              icon={<CheckCircle fontSize="large" />} 
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="InAction PCB's" 
              value={data.pcb_summary.inaction} 
              subtext="Idle Units"
              icon={<Engineering fontSize="large" />} 
              color="primary"
            />
          </Grid>
        </Grid>

        {/* Main Content Area - Table */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: 4, 
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
            >
              <Box p={3} borderBottom="1px solid #f0f0f0" display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h6" fontWeight="800" color="#333">Production Queue</Typography>
                </Box>
                <Chip label="Live Tracking" color="success" size="small" variant="outlined" />
              </Box>
              
              <TableContainer sx={{ overflowX: 'auto', maxHeight: '350px' }}>
                <Table sx={{ minWidth: 800 }} stickyHeader aria-label="production table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Serial No</TableCell>
                      <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Part Number</TableCell>
                      <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Stage</TableCell>
                      <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Operator</TableCell>
                      <TableCell sx={{ bgcolor: '#f8f9fa', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'center' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.pcbs && data.pcbs.length > 0 ? (
                      data.pcbs.map((pcb) => (
                        <TableRow 
                            key={pcb.pcb_serial} 
                            hover
                            sx={{ '&:hover': { bgcolor: '#f5f9ff', cursor: 'pointer' } }}
                            onClick={() => handlePcbClick(pcb.serial_no)}
                        >
                          <TableCell component="th" scope="row">
                            <Typography variant="body2" fontWeight="bold" color="primary" sx={{textDecoration: 'underline'}}>
                                {pcb?.serial_no ? pcb.serial_no : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {pcb?.part_number ? pcb.part_number : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box width={8} height={8} borderRadius="50%" bgcolor="#ff9800" sx={{ boxShadow: '0 0 4px #ff9800' }} />
                              <Typography variant="body2" fontWeight="500">
                                {pcb?.current_step ? pcb.current_step : 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                                <Typography variant="body2" fontWeight="600" color="#333">
                                {pcb?.operator?.name ? pcb.operator.name : 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                ID: {pcb?.operator?.staff_no ? pcb.operator.staff_no : '-'}
                                </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={pcb?.status?.replace('_', ' ') || 'N/A'}
                              color={getStatusColor(pcb?.status || 'unknown')}
                              size="small"
                              variant="filled"
                              sx={{ fontWeight: 'bold', minWidth: 100 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Assessment sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                                <Typography color="text.secondary">No active production units found in the queue.</Typography>
                            </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* --- TIMELINE DIALOG --- */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, minHeight: '70vh' } }}
      >
        {selectedPcbTimeline && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', pb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold">Production History</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <Chip label={`SN: ${selectedPcbTimeline.Serial_No}`} color="primary" size="small" />
                    <Chip label={`PN: ${selectedPcbTimeline.Part_Number}`} variant="outlined" size="small" />
                  </Stack>
                </Box>
                <Button onClick={handleCloseDialog} color="inherit" sx={{ minWidth: 0, p: 1, borderRadius: '50%' }}>
                  <CloseIcon />
                </Button>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ py: 3, px: 4, bgcolor: '#f8f9fa' }}>
                
                {/* 1. COMPREHENSIVE HEADER DATA */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', bgcolor: 'white' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <DetailItem label="Description" value={selectedPcbTimeline.Description} highlight />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                             <DetailItem label="Production Order" value={selectedPcbTimeline.Production_Order} highlight />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                             <DetailItem label="Type" value={selectedPcbTimeline.Type} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                             <DetailItem label="Total Steps" value={selectedPcbTimeline.ope_log_details?.length || 0} />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                             <DetailItem label="Assigned Time" value={formatTime(selectedPcbTimeline.Assigned_time)} />
                        </Grid>
                         <Grid item xs={12} sm={6} md={4} lg={3}>
                             <DetailItem label="Created At (New)" value={formatTime(selectedPcbTimeline.New_Time)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                             <DetailItem label="Last Update (Inaction)" value={formatTime(selectedPcbTimeline.Inaction_time)} />
                        </Grid>
                    </Grid>
                </Paper>

                <Divider sx={{ mb: 3 }} textAlign="left">
                    <Chip label="PROCESS EXECUTION TIMELINE" size="small" sx={{fontWeight:'bold'}} />
                </Divider>

                {/* 2. DETAILED STEPPER (Accordion Removed, All Data Visible) */}
                <Stepper orientation="vertical" activeStep={selectedPcbTimeline.ope_log_details?.length || 0} sx={{ px: 2 }}>
                    {selectedPcbTimeline.ope_log_details && selectedPcbTimeline.ope_log_details.map((step, index) => (
                        <Step key={index} expanded>
                            <StepLabel 
                                StepIconProps={{ 
                                    style: { color: step.Task_Status === 'Completed' ? '#2e7d32' : '#1976d2' } 
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                    {step.Task_Name}
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <Paper elevation={0} sx={{ p: 0, bgcolor: 'white', border: '1px solid #ddd', borderRadius: 2, mt: 1, overflow: 'hidden' }}>
                                    
                                    {/* A. Header: Operator & Timing Overview */}
                                    <Box p={2} bgcolor="#fcfcfc" borderBottom="1px solid #eee">
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                                                        <Person fontSize="small" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" display="block" color="text.secondary">Operator Name</Typography>
                                                        <Typography variant="body2" fontWeight="600">{step.operator_name}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                     <Avatar sx={{ width: 32, height: 32, bgcolor: '#f3e5f5', color: '#9c27b0' }}>
                                                        <AccessTime fontSize="small" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" display="block" color="text.secondary">Start & End Time</Typography>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                            {formatTime(step.start_time).split(',')[1]} - {formatTime(step.end_time).split(',')[1]}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                     <Avatar sx={{ width: 32, height: 32, bgcolor: '#e8f5e9', color: '#2e7d32' }}>
                                                        <Timer fontSize="small" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" display="block" color="text.secondary">Duration</Typography>
                                                        <Typography variant="body2" fontWeight="600">
                                                            {selectedPcbTimeline.Durations && selectedPcbTimeline.Durations[index] !== undefined
                                                                ? `${parseFloat(selectedPcbTimeline.Durations[index]).toFixed(2)}s` 
                                                                : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* B. Detailed Info Grid (No Dropdown) */}
                                    <Box p={3}>
                                        <Grid container spacing={3}>
                                            
                                            {/* Column 1: Operator Metadata (Filtered) */}
                                            <Grid item xs={12} md={5}>
                                                <Typography variant="caption" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <VerifiedUser fontSize="inherit" sx={{ mr: 0.5 }} /> OPERATOR DETAILS
                                                </Typography>
                                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fbff', borderRadius: 2 }}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6}><DetailItem label="Staff No" value={step.operator_staff_no} /></Grid>
                                                        <Grid item xs={6}><DetailItem label="User ID" value={step.userID} /></Grid>
                                                        <Grid item xs={6}><DetailItem label="Username" value={step.userName} /></Grid>
                                                        <Grid item xs={6}><DetailItem label="Role" value={step.userRole} /></Grid>
                                                        <Grid item xs={6}><DetailItem label="MRL Level" value={step.operator_MRL} /></Grid>
                                                        <Grid item xs={6}><DetailItem label="MRL Expiry" value={step.operator_MRL_Expiry} /></Grid>
                                                        <Grid item xs={6}><DetailItem label="Initials" value={step.operator_initial} /></Grid>
                                                        {/* Filtered out SBU, Division, IDs as requested */}
                                                    </Grid>
                                                </Paper>
                                            </Grid>

                                            {/* Column 2: Log Data & Process Data */}
                                            <Grid item xs={12} md={7}>
                                                <Typography variant="caption" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <DataObject fontSize="inherit" sx={{ mr: 0.5 }} /> PROCESS LOG DATA
                                                </Typography>
                                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, height: '100%' }}>
                                                    <Box mb={2}>
                                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', mb: 0.5 }}>
                                                            Key Reference
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                            {step.PCBserialNoPartNumber}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', mb: 1 }}>
                                                        Captured Parameters
                                                    </Typography>
                                                    
                                                    {step.log_Data && Object.keys(step.log_Data).length > 0 ? (
                                                        <Box display="flex" flexWrap="wrap" gap={1}>
                                                            {Object.entries(step.log_Data).map(([key, val]) => (
                                                                <Chip 
                                                                    key={key} 
                                                                    label={`${key}: ${val}`} 
                                                                    size="small" 
                                                                    color="default" 
                                                                    variant="outlined"
                                                                    sx={{ 
                                                                        borderRadius: 1, 
                                                                        bgcolor: '#fafafa', 
                                                                        fontWeight: 500,
                                                                        border: '1px solid #e0e0e0'
                                                                    }} 
                                                                />
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" fontStyle="italic" color="text.secondary">
                                                            No dynamic parameters logged for this step.
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </Paper>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
          </>
        )}
      </Dialog>

    </Box>
  );
};
export default SupervisorExternal;