// // // //old code but important

// // // import React, { useState, useMemo, useEffect } from "react";
// // // import {
// // //   ComposedChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   ResponsiveContainer,
// // //   ReferenceLine
// // // } from "recharts";
// // // import {
// // //   Box,
// // //   Paper,
// // //   Typography,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   Chip,
// // //   Grid,
// // //   FormControl,
// // //   InputLabel,
// // //   Select,
// // //   MenuItem
// // // } from "@mui/material";

// // // // --- 1. Mock Data Generator ---
// // // const processesList = ["Prep", "Labeling", "Cleaning", "Solder Paste", "Pick & Place", "Reflow", "AOI", "X-Ray", "Testing", "Packaging"];

// // // const generateMockData = () => {
// // //   const operators = ["Alice", "Bob", "Charlie", "Dave", "Eve"];
// // //   const pcbs = ["PCB-1001", "PCB-1002", "PCB-1003", "PCB-1004", "PCB-1005"];
  
// // //   const data = [];
// // //   const now = new Date().getTime();
// // //   const hour = 3600 * 1000;

// // //   pcbs.forEach((pcb, index) => {
// // //     let lastEndTime = now - (Math.random() * 8 * hour) + (index * hour); 

// // //     processesList.forEach((proc, pIndex) => {
// // //       const duration = (0.5 + Math.random()) * hour;
// // //       const startTime = lastEndTime + (Math.random() * 0.1 * hour);
// // //       const endTime = startTime + duration;
      
// // //       const status = endTime < now ? "Completed" : startTime < now ? "In Progress" : "Pending";
      
// // //       data.push({
// // //         id: `${pcb}-${proc}`,
// // //         pcb_serial: pcb,
// // //         task_name: proc,
// // //         operator_name: operators[Math.floor(Math.random() * operators.length)],
// // //         start_time: startTime,
// // //         end_time: endTime,
// // //         duration: duration,
// // //         status: status,
// // //         eligible_operators: [operators[pIndex % operators.length], operators[(pIndex + 1) % operators.length]] 
// // //       });

// // //       lastEndTime = endTime;
// // //     });
// // //   });

// // //   return data.sort((a, b) => a.start_time - b.start_time);
// // // };

// // // // --- 2. Enhanced Custom Tooltip ---
// // // const CustomTooltip = ({ active, payload }) => {
// // //   if (active && payload && payload.length) {
// // //     const dataKey = payload[0].dataKey;
// // //     const data = payload[0].payload[`${dataKey}_data`];
    
// // //     if (!data) return null;

// // //     return (
// // //       <Paper sx={{ p: 1.5, border: "1px solid #ccc", boxShadow: 3, minWidth: 200 }}>
// // //         <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ borderBottom: '1px solid #eee', mb: 1, pb: 0.5 }}>
// // //           {data.task_name} {data.isDot && "(Outside Window)"}
// // //         </Typography>
// // //         <Box sx={{ mb: 1 }}>
// // //             <Typography variant="caption" color="text.secondary" display="block">OPERATOR</Typography>
// // //             <Typography variant="body2" fontWeight="600">{data.operator_name}</Typography>
// // //         </Box>
// // //         <Box sx={{ bgcolor: '#f8fafc', p: 1, borderRadius: 1 }}>
// // //             <Typography variant="caption" display="block">PCB: <b>{data.pcb_serial}</b></Typography>
// // //             <Typography variant="caption" color="text.secondary">
// // //               {new Date(data.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(data.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// // //             </Typography>
// // //         </Box>
// // //       </Paper>
// // //     );
// // //   }
// // //   return null;
// // // };

// // // // --- 3. Thick Bar / Dot Gantt Shape ---
// // // const CustomBarShape = (props) => {
// // //   const { x, y, width, height, payload, taskKey } = props;
// // //   const taskData = payload[`${taskKey}_data`];
  
// // //   if (!taskData) return null;
// // //   const { isDot, task_name, operator_name, fillColor } = taskData;

// // //   // Render DOT if task is far from present
// // //   if (isDot) {
// // //     return (
// // //       <g>
// // //         <circle cx={x + width / 2} cy={y + height / 2} r={6} fill="#94a3b8" />
// // //         <text x={x + width / 2} y={y + height / 2 - 12} fill="#64748b" fontSize={10} textAnchor="middle">
// // //           {task_name}
// // //         </text>
// // //       </g>
// // //     );
// // //   }

// // //   // Ensure minimum width so small tasks are still visible as bars
// // //   const barWidth = Math.max(width, 8);

// // //   // Render Thick Horizontal Bar for Present, Next 3, Prev 3
// // //   return (
// // //     <g>
// // //       {/* Thick Main Bar */}
// // //       <rect x={x} y={y + height * 0.2} width={barWidth} height={height * 0.6} fill={fillColor} rx={4} />
      
// // //       {/* Process Name Above Bar */}
// // //       {barWidth > 40 && (
// // //         <text x={x + barWidth / 2} y={y + height * 0.15} fill="#1e293b" fontSize={11} fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
// // //           {task_name}
// // //         </text>
// // //       )}

// // //       {/* Operator Name Inside Bar (if it fits) */}
// // //       {barWidth > 40 && (
// // //          <text x={x + barWidth / 2} y={y + height * 0.5 + 4} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
// // //            {operator_name}
// // //          </text>
// // //       )}
// // //     </g>
// // //   );
// // // };

// // // const ProductionDashboard = () => {
// // //   const [rawData, setRawData] = useState([]);
// // //   const [viewMode, setViewMode] = useState("both");
// // //   const [timeFilter, setTimeFilter] = useState("all");

// // //   useEffect(() => {
// // //     setRawData(generateMockData());
// // //   }, []);

// // //   const { chartData, flowTableData, dynamicMinTime, dynamicMaxTime } = useMemo(() => {
// // //     if (!rawData.length) return { chartData: [], flowTableData: [], dynamicMinTime: 0, dynamicMaxTime: 0 };

// // //     let filteredData = rawData;
// // //     const maxDataTime = Math.max(...rawData.map(d => d.end_time)); 

// // //     if (timeFilter !== "all") {
// // //       const hoursBack = parseInt(timeFilter, 10);
// // //       const cutoffTime = maxDataTime - (hoursBack * 3600 * 1000);
// // //       filteredData = rawData.filter(d => d.end_time >= cutoffTime);
// // //     }

// // //     if (!filteredData.length) return { chartData: [], flowTableData: [], dynamicMinTime: 0, dynamicMaxTime: 0 };

// // //     const pcbs = [...new Set(filteredData.map(d => d.pcb_serial))];
// // //     const processedChartData = [];
// // //     const processedTableData = [];

// // //     // Group items by PCB to create true horizontal range rows
// // //     pcbs.forEach(pcb => {
// // //       const rowData = { pcb_serial: pcb };
// // //       const pcbTasks = filteredData
// // //         .filter(d => d.pcb_serial === pcb)
// // //         .sort((a, b) => a.start_time - b.start_time);
      
// // //       const presentIndex = pcbTasks.findIndex(t => t.status === "In Progress");

// // //       pcbTasks.forEach((task, idx) => {
// // //         let isDot = false;
// // //         let fillColor = "#cbd5e1"; // Default Grey

// // //         // Assign colors dynamically based on relative position to Present Task
// // //         if (presentIndex !== -1) {
// // //           if (Math.abs(idx - presentIndex) > 3) {
// // //             isDot = true; // Outside window, turn to dot
// // //           } else {
// // //             if (idx === presentIndex) {
// // //               fillColor = "#eab308"; // Present 1: Yellow
// // //             } else if (idx < presentIndex) {
// // //               fillColor = "#10b981"; // Previous 3: Green
// // //             } else {
// // //               fillColor = "#ef4444"; // Next 3: Red
// // //             }
// // //           }
// // //         } else {
// // //           // Fallback if PCB is completely done or entirely pending
// // //           const lastDone = pcbTasks.findLastIndex(t => t.status === "Completed");
// // //           if (lastDone !== -1) {
// // //             if (idx >= lastDone - 2 && idx <= lastDone) fillColor = "#10b981"; // Last 3 Done: Green
// // //             else if (idx > lastDone && idx <= lastDone + 3) fillColor = "#ef4444"; // Next 3 Pending: Red
// // //             else isDot = true;
// // //           } else {
// // //             if (idx < 3) fillColor = "#ef4444"; // Next 3 Pending: Red
// // //             else isDot = true;
// // //           }
// // //         }

// // //         // Native Recharts Range Bar Mapping: [Start, End]
// // //         rowData[task.task_name] = [task.start_time, task.end_time];
        
// // //         // Store payload for custom shapes
// // //         rowData[`${task.task_name}_data`] = {
// // //           ...task,
// // //           isDot,
// // //           fillColor
// // //         };
// // //       });

// // //       processedChartData.push(rowData);

// // //       // Table Data Processing
// // //       let presentTask = null;
// // //       let previousTask = null;
// // //       let nextTask = null;

// // //       if (presentIndex !== -1) {
// // //         presentTask = pcbTasks[presentIndex];
// // //         previousTask = presentIndex > 0 ? pcbTasks[presentIndex - 1] : null;
// // //         nextTask = presentIndex < pcbTasks.length - 1 ? pcbTasks[presentIndex + 1] : null;
// // //       } else {
// // //         const lastDone = pcbTasks.findLastIndex(t => t.status === "Completed");
// // //         if (lastDone !== -1) {
// // //           previousTask = pcbTasks[lastDone];
// // //           nextTask = lastDone < pcbTasks.length - 1 ? pcbTasks[lastDone + 1] : null;
// // //         } else {
// // //           nextTask = pcbTasks[0];
// // //         }
// // //       }

// // //       processedTableData.push({ pcb, previous: previousTask, present: presentTask, next: nextTask });
// // //     });

// // //     const minTime = Math.min(...filteredData.map(d => d.start_time));
// // //     const maxTime = Math.max(...filteredData.map(d => d.end_time));

// // //     return {
// // //       chartData: processedChartData,
// // //       flowTableData: processedTableData,
// // //       dynamicMinTime: minTime,
// // //       dynamicMaxTime: maxTime
// // //     };
// // //   }, [rawData, timeFilter]);

// // //   const formatXAxis = (tickItem) => {
// // //     return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // //   };

// // //   return (
// // //     <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      
// // //       {/* Header & Controls */}
// // //       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
// // //         <Typography variant="h5" fontWeight="bold" color="#1e293b">
// // //           Production Dashboard
// // //         </Typography>

// // //         <Box display="flex" gap={2}>
// // //           <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'white' }}>
// // //             <InputLabel>View Mode</InputLabel>
// // //             <Select value={viewMode} label="View Mode" onChange={(e) => setViewMode(e.target.value)}>
// // //               <MenuItem value="both">Graph & Table</MenuItem>
// // //               <MenuItem value="graph">Graph Only</MenuItem>
// // //               <MenuItem value="table">Table Only</MenuItem>
// // //             </Select>
// // //           </FormControl>

// // //           <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'white' }}>
// // //             <InputLabel>Time Range</InputLabel>
// // //             <Select value={timeFilter} label="Time Range" onChange={(e) => setTimeFilter(e.target.value)}>
// // //               <MenuItem value="all">All Time</MenuItem>
// // //               <MenuItem value="2">Last 2 Hours</MenuItem>
// // //               <MenuItem value="4">Last 4 Hours</MenuItem>
// // //               <MenuItem value="8">Last 8 Hours</MenuItem>
// // //             </Select>
// // //           </FormControl>
// // //         </Box>
// // //       </Box>

// // //       {/* Legend Map */}
// // //       <Box display="flex" gap={3} mb={2} px={1}>
// // //          <Box display="flex" alignItems="center" gap={1}><Box sx={{ width: 14, height: 14, bgcolor: '#10b981', borderRadius: 1 }}/> <Typography variant="caption" fontWeight="bold">Previous 3 (Done)</Typography></Box>
// // //          <Box display="flex" alignItems="center" gap={1}><Box sx={{ width: 14, height: 14, bgcolor: '#eab308', borderRadius: 1 }}/> <Typography variant="caption" fontWeight="bold">Present (Active)</Typography></Box>
// // //          <Box display="flex" alignItems="center" gap={1}><Box sx={{ width: 14, height: 14, bgcolor: '#ef4444', borderRadius: 1 }}/> <Typography variant="caption" fontWeight="bold">Next 3 (Pending)</Typography></Box>
// // //          <Box display="flex" alignItems="center" gap={1}><Box sx={{ width: 10, height: 10, bgcolor: '#94a3b8', borderRadius: '50%' }}/> <Typography variant="caption" fontWeight="bold">Outside View Window</Typography></Box>
// // //       </Box>

// // //       <Grid container spacing={3}>
        
// // //         {/* --- REFINED GANTT CHART --- */}
// // //         {(viewMode === "both" || viewMode === "graph") && (
// // //           <Grid item xs={12}>
// // //             <Paper sx={{ p: 3, borderRadius: 3, height: 520 }}>
// // //               {chartData.length > 0 ? (
// // //                 <ResponsiveContainer width="100%" height="100%">
// // //                   <ComposedChart
// // //                     layout="vertical"
// // //                     data={chartData}
// // //                     margin={{ top: 30, right: 40, left: 40, bottom: 20 }}
// // //                   >
// // //                     <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={true} vertical={false} />
// // //                     <XAxis 
// // //                       type="number" 
// // //                       domain={[dynamicMinTime, dynamicMaxTime]} 
// // //                       tickFormatter={formatXAxis} 
// // //                       orientation="top" 
// // //                       stroke="#64748b" 
// // //                     />
// // //                     <YAxis 
// // //                       type="category" 
// // //                       dataKey="pcb_serial" 
// // //                       width={80} 
// // //                       stroke="#64748b" 
// // //                       tick={{ fill: '#334155', fontWeight: 600 }} 
// // //                     />
                    
// // //                     <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }} shared={false} />
                    
// // //                     {/* Vertical marker for 'Current Time' */}
// // //                     <ReferenceLine x={new Date().getTime()} stroke="#1e293b" strokeDasharray="3 3" strokeWidth={2} label={{ position: 'top', value: 'NOW', fill: '#1e293b', fontSize: 12, fontWeight: 'bold' }} />

// // //                     {processesList.map(proc => (
// // //                        <Bar 
// // //                          key={proc} 
// // //                          dataKey={proc} 
// // //                          shape={(props) => <CustomBarShape {...props} taskKey={proc} />} 
// // //                          isAnimationActive={false} 
// // //                        />
// // //                     ))}
// // //                   </ComposedChart>
// // //                 </ResponsiveContainer>
// // //               ) : (
// // //                 <Box display="flex" height="100%" alignItems="center" justifyContent="center">
// // //                   <Typography color="text.secondary">No data available for this time range.</Typography>
// // //                 </Box>
// // //               )}
// // //             </Paper>
// // //           </Grid>
// // //         )}

// // //         {/* --- HORIZONTAL FLOW TABLE --- */}
// // //         {(viewMode === "both" || viewMode === "table") && (
// // //           <Grid item xs={12}>
// // //             <Paper sx={{ p: 3, borderRadius: 3 }}>
// // //               <Typography variant="h6" mb={2} fontWeight="bold">
// // //                 Real-time Process Flow
// // //               </Typography>
// // //               <TableContainer component={Box} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
// // //                 <Table>
// // //                   <TableHead sx={{ bgcolor: "#f1f5f9" }}>
// // //                     <TableRow>
// // //                       <TableCell width="16%" sx={{ fontWeight: 'bold' }}>PCB Serial</TableCell>
// // //                       <TableCell width="28%" sx={{ fontWeight: 'bold' }}>Previous Task</TableCell>
// // //                       <TableCell width="28%" sx={{ fontWeight: 'bold' }}>Present Task</TableCell>
// // //                       <TableCell width="28%" sx={{ fontWeight: 'bold' }}>Next Task</TableCell>
// // //                     </TableRow>
// // //                   </TableHead>
// // //                   <TableBody>
// // //                     {flowTableData.length > 0 ? flowTableData.map((row) => (
// // //                       <TableRow key={row.pcb} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        
// // //                         <TableCell>
// // //                           <Typography fontWeight="bold" color="#334155" fontSize="1.1rem">{row.pcb}</Typography>
// // //                         </TableCell>
                        
// // //                         <TableCell>
// // //                           {row.previous ? (
// // //                              <Box sx={{ bgcolor: "#dcfce7", p: 1.5, borderRadius: 2, border: '1px solid #bbf7d0' }}>
// // //                                <Box display="flex" justifyContent="space-between" mb={0.5}>
// // //                                  <Typography variant="body2" fontWeight="bold" color="#166534">{row.previous.task_name}</Typography>
// // //                                  <Chip label="Done" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#bbf7d0', color: '#166534' }} />
// // //                                </Box>
// // //                                <Typography variant="caption" color="text.secondary">Op: <b>{row.previous.operator_name}</b></Typography>
// // //                              </Box>
// // //                           ) : <Typography variant="caption" color="text.secondary">N/A</Typography>}
// // //                         </TableCell>

// // //                         <TableCell>
// // //                           {row.present ? (
// // //                              <Box sx={{ bgcolor: "#fef9c3", p: 1.5, borderRadius: 2, border: '1px solid #fde047', boxShadow: '0px 2px 4px rgba(250, 204, 21, 0.2)' }}>
// // //                                <Box display="flex" justifyContent="space-between" mb={0.5}>
// // //                                  <Typography variant="body2" fontWeight="bold" color="#854d0e">{row.present.task_name}</Typography>
// // //                                  <Chip label="Working" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#fde047', color: '#854d0e' }} />
// // //                                </Box>
// // //                                <Typography variant="caption" color="text.secondary">Op: <b>{row.present.operator_name}</b></Typography>
// // //                              </Box>
// // //                           ) : <Typography variant="caption" color="text.secondary">Completed / Not in range</Typography>}
// // //                         </TableCell>

// // //                         <TableCell>
// // //                           {row.next ? (
// // //                              <Box sx={{ bgcolor: "#fee2e2", p: 1.5, borderRadius: 2, border: '1px solid #fecaca' }}>
// // //                                <Box display="flex" justifyContent="space-between" mb={0.5}>
// // //                                  <Typography variant="body2" fontWeight="bold" color="#991b1b">{row.next.task_name}</Typography>
// // //                                  <Chip label="Pending" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#fecaca', color: '#991b1b' }} />
// // //                                </Box>
// // //                                <Typography variant="caption" color="text.secondary">
// // //                                  Eligible: {row.next.eligible_operators.join(', ')}
// // //                                </Typography>
// // //                              </Box>
// // //                           ) : <Typography variant="caption" color="text.secondary">N/A</Typography>}
// // //                         </TableCell>

// // //                       </TableRow>
// // //                     )) : (
// // //                       <TableRow>
// // //                         <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
// // //                           <Typography color="text.secondary">No records found for the selected time range.</Typography>
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     )}
// // //                   </TableBody>
// // //                 </Table>
// // //               </TableContainer>
// // //             </Paper>
// // //           </Grid>
// // //         )}

// // //       </Grid>
// // //     </Box>
// // //   );
// // // };

// // // export default ProductionDashboard;


// // //new code
// // import React, { useState, useMemo, useEffect } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import {
// //   ComposedChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// //   Grid,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   CircularProgress,
// //   Alert
// // } from "@mui/material";

// // // --- 1. Custom Tooltip (Adapted for Step Data) ---
// // const CustomTooltip = ({ active, payload }) => {
// //   if (active && payload && payload.length) {
// //     const dataKey = payload[0].dataKey;
// //     const data = payload[0].payload[`${dataKey}_data`];
// //     if (!data) return null;

// //     return (
// //       <Paper sx={{ p: 1.5, border: "1px solid #ccc", boxShadow: 3, minWidth: 200 }}>
// //         <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ borderBottom: '1px solid #eee', mb: 1, pb: 0.5 }}>
// //           {data.task_name}
// //         </Typography>
// //         <Box sx={{ mb: 1 }}>
// //             <Typography variant="caption" color="text.secondary" display="block">STAFF / OPERATOR</Typography>
// //             <Typography variant="body2" fontWeight="600">{data.operator_name || "Multiple / Eligible"}</Typography>
// //         </Box>
// //         <Box sx={{ bgcolor: '#f8fafc', p: 1, borderRadius: 1 }}>
// //             <Typography variant="caption" display="block">PCB: <b>{data.pcb_serial}</b></Typography>
// //             <Typography variant="caption" color="text.secondary">Status: {data.status}</Typography>
// //         </Box>
// //       </Paper>
// //     );
// //   }
// //   return null;
// // };

// // // --- 2. Custom Thick Bar Shape ---
// // const CustomBarShape = (props) => {
// //   const { x, y, width, height, payload, taskKey } = props;
// //   const taskData = payload[`${taskKey}_data`];
// //   if (!taskData) return null;

// //   const barWidth = Math.max(width, 10);

// //   return (
// //     <g>
// //       <rect x={x} y={y + height * 0.2} width={barWidth} height={height * 0.6} fill={taskData.fillColor} rx={4} />
// //       {barWidth > 60 && (
// //         <text x={x + barWidth / 2} y={y + height * 0.5 + 4} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
// //           {taskData.task_name}
// //         </text>
// //       )}
// //     </g>
// //   );
// // };

// // const ProductionDashboard = () => {
// //   const [rawData, setRawData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [viewMode, setViewMode] = useState("both");

// //   // Redux & URL Logic
// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
// //   const GhanttURL = useMemo(() => {
// //     const API5 = "/ganttchart";
// //     const base = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
// //     return base + API5;
// //   }, [configDetails]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await axios.get(GhanttURL);
// //         setRawData(Array.isArray(response.data) ? response.data : response.data.data || []);
// //         setError(null);
// //       } catch (err) {
// //         setError("Failed to fetch production data. Check connection.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, [GhanttURL]);

// //   // --- 3. UI Transformation Logic ---
// //   const { chartData, flowTableData, processesList } = useMemo(() => {
// //     const allProcessNames = new Set();
// //     const processedChart = [];
// //     const processedTable = [];

// //     rawData.forEach((item) => {
// //       const pcb = item.Serial_No;
// //       const rowData = { pcb_serial: pcb };
      
// //       // Combine all tasks into a sequential array for visualization
// //       const allTasks = [
// //         ...(item.Completed_tasks || []).map(t => ({ name: t.step_name, staff: t.step_Ope_staff_No, status: 'Completed' })),
// //         ...(item.present_tasks || []).map(t => ({ name: t.step_name_str, staff: t.step_name_ope_staff_No, status: 'In Progress' })),
// //         ...(item.Pending_tasks || []).map(t => ({ name: t.TaskName, staff: t.staff_No?.join(", "), status: 'Pending' }))
// //       ];

// //       allTasks.forEach((task, idx) => {
// //         allProcessNames.add(task.name);
        
// //         let fillColor = "#cbd5e1"; // Default
// //         if (task.status === "Completed") fillColor = "#10b981";
// //         if (task.status === "In Progress") fillColor = "#eab308";
// //         if (task.status === "Pending") fillColor = "#ef4444";

// //         // Create a fake timeline: Step 0 is 0-1, Step 1 is 1-2, etc.
// //         rowData[task.name] = [idx, idx + 1];
// //         rowData[`${task.name}_data`] = {
// //           task_name: task.name,
// //           pcb_serial: pcb,
// //           operator_name: task.staff,
// //           fillColor,
// //           status: task.status
// //         };
// //       });

// //       processedChart.push(rowData);

// //       // Table Data
// //       processedTable.push({
// //         pcb,
// //         previous: item.Completed_tasks?.length > 0 ? item.Completed_tasks[item.Completed_tasks.length - 1] : null,
// //         present: item.present_tasks?.length > 0 ? item.present_tasks[0] : null,
// //         next: item.Pending_tasks?.length > 0 ? item.Pending_tasks[0] : null,
// //       });
// //     });

// //     return { 
// //         chartData: processedChart, 
// //         flowTableData: processedTable, 
// //         processesList: Array.from(allProcessNames) 
// //     };
// //   }, [rawData]);

// //   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;

// //   return (
// //     <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      
// //       {/* Header */}
// //       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
// //         <Typography variant="h5" fontWeight="bold" color="#1e293b">Production Dashboard</Typography>
// //         <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'white' }}>
// //           <InputLabel>View Mode</InputLabel>
// //           <Select value={viewMode} label="View Mode" onChange={(e) => setViewMode(e.target.value)}>
// //             <MenuItem value="both">Graph & Table</MenuItem>
// //             <MenuItem value="graph">Graph Only</MenuItem>
// //             <MenuItem value="table">Table Only</MenuItem>
// //           </Select>
// //         </FormControl>
// //       </Box>

// //       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

// //       {/* Legend */}
// //       <Box display="flex" gap={3} mb={2} px={1}>
// //          <Box display="flex" alignItems="center" gap={1}><Box sx={{ width: 14, height: 14, bgcolor: '#10b981', borderRadius: 1 }}/> <Typography variant="caption" fontWeight="bold">Completed</Typography></Box>
// //          <Box display="flex" alignItems="center" gap={1}><Box sx={{ width: 14, height: 14, bgcolor: '#eab308', borderRadius: 1 }}/> <Typography variant="caption" fontWeight="bold">Active (In Progress)</Typography></Box>
// //          <Box display="flex" alignItems="center" gap={1}><Box sx={{ width: 14, height: 14, bgcolor: '#ef4444', borderRadius: 1 }}/> <Typography variant="caption" fontWeight="bold">Pending / Next</Typography></Box>
// //       </Box>

// //       <Grid container spacing={3}>
        
// //         {/* --- REFINED GANTT CHART --- */}
// //         {(viewMode === "both" || viewMode === "graph") && (
// //           <Grid item xs={12}>
// //             <Paper sx={{ p: 3, borderRadius: 3, height: 500 }}>
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <ComposedChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
// //                   <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={true} vertical={false} />
// //                   <XAxis type="number" hide domain={[0, 'dataMax + 1']} />
// //                   <YAxis type="category" dataKey="pcb_serial" width={80} stroke="#64748b" tick={{ fill: '#334155', fontWeight: 600 }} />
// //                   <Tooltip content={<CustomTooltip />} />
// //                   {processesList.map(proc => (
// //                     <Bar key={proc} dataKey={proc} shape={(props) => <CustomBarShape {...props} taskKey={proc} />} isAnimationActive={false} />
// //                   ))}
// //                 </ComposedChart>
// //               </ResponsiveContainer>
// //             </Paper>
// //           </Grid>
// //         )}

// //         {/* --- HORIZONTAL FLOW TABLE --- */}
// //         {(viewMode === "both" || viewMode === "table") && (
// //           <Grid item xs={12}>
// //             <Paper sx={{ p: 3, borderRadius: 3 }}>
// //               <Typography variant="h6" mb={2} fontWeight="bold">Real-time Process Flow</Typography>
// //               <TableContainer component={Box} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
// //                 <Table>
// //                   <TableHead sx={{ bgcolor: "#f1f5f9" }}>
// //                     <TableRow>
// //                       <TableCell width="15%" sx={{ fontWeight: 'bold' }}>Serial No</TableCell>
// //                       <TableCell width="28%" sx={{ fontWeight: 'bold' }}>Last Completed</TableCell>
// //                       <TableCell width="28%" sx={{ fontWeight: 'bold' }}>Present Task</TableCell>
// //                       <TableCell width="28%" sx={{ fontWeight: 'bold' }}>Next Task</TableCell>
// //                     </TableRow>
// //                   </TableHead>
// //                   <TableBody>
// //                     {flowTableData.map((row) => (
// //                       <TableRow key={row.pcb}>
// //                         <TableCell><Typography fontWeight="bold" color="#334155">{row.pcb}</Typography></TableCell>
// //                         <TableCell>
// //                           {row.previous ? (
// //                              <Box sx={{ bgcolor: "#dcfce7", p: 1.5, borderRadius: 2, border: '1px solid #bbf7d0' }}>
// //                                <Typography variant="body2" fontWeight="bold" color="#166534">{row.previous.step_name}</Typography>
// //                                <Typography variant="caption" color="text.secondary">Staff: {row.previous.step_Ope_staff_No}</Typography>
// //                              </Box>
// //                           ) : "---"}
// //                         </TableCell>
// //                         <TableCell>
// //                           {row.present ? (
// //                              <Box sx={{ bgcolor: "#fef9c3", p: 1.5, borderRadius: 2, border: '1px solid #fde047', boxShadow: '0px 2px 4px rgba(250, 204, 21, 0.2)' }}>
// //                                <Typography variant="body2" fontWeight="bold" color="#854d0e">{row.present.step_name_str}</Typography>
// //                                <Typography variant="caption" color="text.secondary">Staff: {row.present.step_name_ope_staff_No}</Typography>
// //                              </Box>
// //                           ) : <Chip label="Idle" size="small" variant="outlined" />}
// //                         </TableCell>
// //                         <TableCell>
// //                           {row.next ? (
// //                              <Box sx={{ bgcolor: "#fee2e2", p: 1.5, borderRadius: 2, border: '1px solid #fecaca' }}>
// //                                <Typography variant="body2" fontWeight="bold" color="#991b1b">{row.next.TaskName}</Typography>
// //                                <Typography variant="caption" color="text.secondary">Eligible: {row.next.staff_No?.join(", ")}</Typography>
// //                              </Box>
// //                           ) : "Done"}
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 </Table>
// //               </TableContainer>
// //             </Paper>
// //           </Grid>
// //         )}
// //       </Grid>
// //     </Box>
// //   );
// // };

// // export default ProductionDashboard;


// // import React, { useState, useMemo, useEffect } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import {
// //   ComposedChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// //   Grid,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   CircularProgress,
// //   Alert
// // } from "@mui/material";

// // // --- 1. Custom Thick Bar Shape with Labels ---
// // const CustomBarShape = (props) => {
// //   const { x, y, width, height, payload, taskKey } = props;
// //   const taskData = payload[`${taskKey}_data`];
// //   if (!taskData) return null;

// //   const barWidth = Math.max(width, 10);
// //   const barHeight = height * 6; // Thicker bar
// //   const barY = y + height * 6;

// //   return (
// //     <g>
// //       {/* Process Name on Top */}
// //       <text 
// //         x={x + barWidth / 2} 
// //         y={barY - 8} 
// //         fill="#475569" 
// //         fontSize={10} 
// //         fontWeight="bold" 
// //         textAnchor="middle"
// //       >
// //         {taskData.task_name}
// //       </text>

// //       {/* Thick Main Bar */}
// //       <rect x={x} y={barY} width={barWidth} height={barHeight} fill={taskData.fillColor} rx={6} />
      
// //       {/* Operator ID inside/below Bar */}
// //       {barWidth > 40 && (
// //         <text 
// //           x={x + barWidth / 2} 
// //           y={barY + barHeight / 2 + 4} 
// //           fill="#fff" 
// //           fontSize={10} 
// //           fontWeight="900" 
// //           textAnchor="middle" 
// //           style={{ pointerEvents: 'none' }}
// //         >
// //           {taskData.operator_name}
// //         </text>
// //       )}
// //     </g>
// //   );
// // };

// // // --- 2. Enhanced Custom Tooltip ---
// // const CustomTooltip = ({ active, payload }) => {
// //   if (active && payload && payload.length) {
// //     const dataKey = payload[0].dataKey;
// //     const data = payload[0].payload[`${dataKey}_data`];
// //     if (!data) return null;

// //     return (
// //       <Paper sx={{ p: 1.5, border: "1px solid #cbd5e1", boxShadow: 4, minWidth: 220 }}>
// //         <Typography variant="subtitle2" fontWeight="bold" color="primary.main" sx={{ borderBottom: '1px solid #e2e8f0', mb: 1, pb: 0.5 }}>
// //           {data.task_name}
// //         </Typography>
// //         <Typography variant="caption" color="text.secondary" display="block">STAFF ASSIGNED</Typography>
// //         <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>{data.operator_name || "N/A"}</Typography>
// //         <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: 1 }}>
// //             <Typography variant="caption" display="block">Serial: <b>{data.pcb_serial}</b></Typography>
// //             <Typography variant="caption" color={data.fillColor} fontWeight="bold">Status: {data.status}</Typography>
// //         </Box>
// //       </Paper>
// //     );
// //   }
// //   return null;
// // };

// // const ProductionDashboard = () => {
// //   const [rawData, setRawData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [viewMode, setViewMode] = useState("both");

// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
// //   const GhanttURL = useMemo(() => {
// //     const API5 = "/ganttchart";
// //     const base = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
// //     return base + API5;
// //   }, [configDetails]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await axios.get(GhanttURL);
// //         setRawData(Array.isArray(response.data) ? response.data : response.data.data || []);
// //       } catch (err) { setError("Data Fetch Failed"); } finally { setLoading(false); }
// //     };
// //     fetchData();
// //   }, [GhanttURL]);

// //   const { chartData, flowTableData, processesList } = useMemo(() => {
// //     const allProcessNames = new Set();
// //     const processedChart = [];
// //     const processedTable = [];

// //     rawData.forEach((item) => {
// //       const pcb = item.Serial_No;
// //       const rowData = { pcb_serial: pcb };
      
// //       const allTasks = [
// //         ...(item.Completed_tasks || []).map(t => ({ name: t.step_name, staff: t.step_Ope_staff_No, status: 'Completed', color: '#10b981' })),
// //         ...(item.present_tasks || []).map(t => ({ name: t.step_name_str, staff: t.step_name_ope_staff_No, status: 'In Progress', color: '#f59e0b' })),
// //         ...(item.Pending_tasks || []).map(t => ({ name: t.TaskName, staff: t.staff_No?.[0] || "Open", status: 'Pending', color: '#ef4444' }))
// //       ];

// //       allTasks.forEach((task, idx) => {
// //         allProcessNames.add(task.name);
// //         rowData[task.name] = [idx, idx + 1];
// //         rowData[`${task.name}_data`] = {
// //           task_name: task.name,
// //           pcb_serial: pcb,
// //           operator_name: task.staff,
// //           fillColor: task.color,
// //           status: task.status
// //         };
// //       });
// //       processedChart.push(rowData);
// //       processedTable.push({ pcb, previous: item.Completed_tasks?.at(-1), present: item.present_tasks?.[0], next: item.Pending_tasks?.[0] });
// //     });

// //     return { chartData: processedChart, flowTableData: processedTable, processesList: Array.from(allProcessNames) };
// //   }, [rawData]);

// //   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;

// //   return (
// //     <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
// //       <Box display="flex" justifyContent="space-between" mb={3}>
// //         <Typography variant="h5" fontWeight="900" color="#1e293b">LIVE PRODUCTION LINE</Typography>
// //         <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'white' }}>
// //           <InputLabel>View Mode</InputLabel>
// //           <Select value={viewMode} label="View Mode" onChange={(e) => setViewMode(e.target.value)}>
// //             <MenuItem value="both">Full View</MenuItem>
// //             <MenuItem value="graph">Gantt Only</MenuItem>
// //             <MenuItem value="table">Table Only</MenuItem>
// //           </Select>
// //         </FormControl>
// //       </Box>

// //       {/* GANTT CHART */}
// //       {(viewMode === "both" || viewMode === "graph") && (
// //         <Paper sx={{ p: 4, borderRadius: 4, height: 550, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
// //           <ResponsiveContainer width="100%" height="100%">
// //             <ComposedChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
// //               <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" horizontal={true} vertical={false} />
// //               <XAxis type="number" hide domain={[0, 'dataMax + 0.5']} />
// //               <YAxis type="category" dataKey="pcb_serial" width={90} stroke="#64748b" tick={{ fill: '#1e293b', fontWeight: 800, fontSize: 13 }} />
// //               <Tooltip content={<CustomTooltip />} />
// //               {processesList.map(proc => (
// //                 <Bar key={proc} dataKey={proc} shape={(props) => <CustomBarShape {...props} taskKey={proc} />} isAnimationActive={false} />
// //               ))}
// //             </ComposedChart>
// //           </ResponsiveContainer>
// //         </Paper>
// //       )}

// //       {/* FLOW TABLE */}
// //       {(viewMode === "both" || viewMode === "table") && (
// //         <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
// //           <TableContainer>
// //             <Table>
// //               <TableHead sx={{ bgcolor: "#f8fafc" }}>
// //                 <TableRow>
// //                   <TableCell sx={{ fontWeight: 900, color: '#475569' }}>PCB SERIAL</TableCell>
// //                   <TableCell sx={{ fontWeight: 900, color: '#475569' }}>LAST COMPLETED</TableCell>
// //                   <TableCell sx={{ fontWeight: 900, color: '#475569' }}>PRESENT TASK</TableCell>
// //                   <TableCell sx={{ fontWeight: 900, color: '#475569' }}>NEXT PENDING</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {flowTableData.map((row) => (
// //                   <TableRow key={row.pcb} hover sx={{ '&:last-child td': { border: 0 } }}>
// //                     <TableCell><Typography variant="h6" fontWeight="900" color="#0f172a">{row.pcb}</Typography></TableCell>
                    
// //                     <TableCell>
// //                       {row.previous && (
// //                         <Box sx={{ borderLeft: '4px solid #10b981', pl: 2, py: 0.5 }}>
// //                           <Typography variant="body2" fontWeight="800" color="#166534">{row.previous.step_name}</Typography>
// //                           <Typography variant="caption" sx={{ bgcolor: '#dcfce7', px: 1, borderRadius: 1, fontWeight: 'bold' }}>USER: {row.previous.step_Ope_staff_No}</Typography>
// //                         </Box>
// //                       )}
// //                     </TableCell>

// //                     <TableCell>
// //                       {row.present && (
// //                         <Box sx={{ borderLeft: '4px solid #f59e0b', pl: 2, py: 1, bgcolor: '#fffbeb', pr: 2, borderRadius: '0 8px 8px 0' }}>
// //                           <Typography variant="body1" fontWeight="900" color="#92400e">{row.present.step_name_str}</Typography>
// //                           <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 'bold' }}>ACTIVE OPERATOR: {row.present.step_name_ope_staff_No}</Typography>
// //                         </Box>
// //                       )}
// //                     </TableCell>

// //                     <TableCell>
// //                       {row.next && (
// //                         <Box sx={{ borderLeft: '4px solid #ef4444', pl: 2, py: 0.5 }}>
// //                           <Typography variant="body2" fontWeight="800" color="#991b1b">{row.next.TaskName}</Typography>
// //                           <Typography variant="caption" color="text.secondary" fontWeight="bold">ELIGIBLE: {row.next.staff_No?.join(", ")}</Typography>
// //                         </Box>
// //                       )}
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //         </Paper>
// //       )}
// //     </Box>
// //   );
// // };

// // export default ProductionDashboard;

// // import React, { useState, useMemo, useEffect } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import {
// //   ComposedChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   CircularProgress,
// //   Alert,
// //   Stack,
// //   TextField,
// //   InputAdornment,
// //   Divider,
// //   Grid
// // } from "@mui/material";
// // import { Search as SearchIcon, Refresh as RefreshIcon, PrecisionManufacturing as FactoryIcon } from "@mui/icons-material";

// // // --- 1. Custom Tooltip ---
// // const CustomTooltip = ({ active, payload }) => {
// //   if (active && payload && payload.length) {
// //     const data = payload[0].payload[`${payload[0].dataKey}_data`];
// //     if (!data) return null;
// //     return (
// //       <Paper sx={{ p: 2, border: "1px solid #e2e8f0", boxShadow: 5 }}>
// //         <Typography variant="subtitle2" fontWeight="800" color="primary.main">{data.task_name}</Typography>
// //         <Typography variant="caption" color="text.secondary">Staff: {data.operator_name || "N/A"}</Typography>
// //         <Divider sx={{ my: 1 }} />
// //         <Typography variant="caption" fontWeight="bold">Serial: #{data.pcb_serial}</Typography>
// //       </Paper>
// //     );
// //   }
// //   return null;
// // };

// // const CustomBarShape = (props) => {
// //   // Destructure 'fill' from props - this is the color passed by the Bar component
// //   const { x, y, width, height, fill, payload, taskKey } = props;
// //   const taskData = payload[`${taskKey}_data`];
// //   if (!taskData) return null;

// //   const barHeight = 15; 
// //   const barY = y + (height - barHeight) / 2; 

// //   return (
// //     <g>
// //       <rect 
// //         x={x} 
// //         y={barY} 
// //         width={width} 
// //         height={barHeight} 
// //         fill={fill} // THIS MUST BE 'fill' to show the colors
// //         rx={4} 
// //         stroke="#fff" // Adding a small white stroke helps separate the segments
// //         strokeWidth={1}
// //       />
// //       {/* Operator text inside the bar */}
// //       {width > 60 && (
// //         <text x={x + width / 2} y={barY + 20} fill="#fff" fontSize={10} fontWeight="900" textAnchor="middle">
// //           {taskData.operator_name}
// //         </text>
// //       )}
// //     </g>
// //   );
// // };

// // const ProductionDashboard = () => {
// //   const [rawData, setRawData] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [viewMode, setViewMode] = useState("both");

// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
// //   const GhanttURL = useMemo(() => {
// //     const API5 = "/ganttchart";
// //     const base = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
// //     return base + API5;
// //   }, [configDetails]);

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get(GhanttURL);
// //       const data = Array.isArray(response.data) ? response.data : response.data.data || [];
// //       setRawData(data);
// //       setError(null);
// //     } catch (err) { setError("Failed to connect to factory server."); } finally { setLoading(false); }
// //   };

// //   useEffect(() => { fetchData(); }, [GhanttURL]);

// //   // Data Filtering and Transformation
// //   // const { chartData, processesList } = useMemo(() => {
// //   //   const allProcessNames = new Set();
// //   //   const processedChart = [];

// //   //   const filtered = rawData.filter(item => item.Serial_No.toLowerCase().includes(searchTerm.toLowerCase()));

// //   //   filtered.forEach((item) => {
// //   //     const pcb = item.Serial_No;
// //   //     const rowData = { pcb_serial: pcb };
      
// //   //     const allTasks = [
// //   //       ...(item.Completed_tasks || []).map(t => ({ name: t.step_name, staff: t.step_Ope_staff_No, color: '#10b981' })),
// //   //       ...(item.present_tasks || []).map(t => ({ name: t.step_name_str, staff: t.step_name_ope_staff_No, color: '#f59e0b' })),
// //   //       ...(item.Pending_tasks || []).map(t => ({ name: t.TaskName, staff: t.staff_No?.[0], color: '#ef4444' }))
// //   //     ];

// //   //     allTasks.forEach((task) => {
// //   //       allProcessNames.add(task.name);

// //   //       let fillColor = "#cbd5e1"; // Default
// //   //            if (task.status === "Completed") fillColor = "#10b981";
// //   //            if (task.status === "In Progress") fillColor = "#eab308";
// //   //            if (task.status === "Pending") fillColor = "#ef4444";
             
// //   //       rowData[task.name] = 1; // Each step takes 1 unit of the horizontal bar
// //   //       rowData[`${task.name}_data`] = {
// //   //         task_name: task.name,
// //   //         pcb_serial: pcb,
// //   //         operator_name: task.staff,
// //   //         fillColor: task.color
// //   //       };
// //   //     });
// //   //     processedChart.push(rowData);
// //   //   });

// //   //   return { chartData: processedChart, processesList: Array.from(allProcessNames) };
// //   // }, [rawData, searchTerm]);

// //   const { chartData, processesList } = useMemo(() => {
// //     const allProcessNames = new Set();
// //     const processedChart = [];

// //     const filtered = rawData.filter(item => item.Serial_No.toLowerCase().includes(searchTerm.toLowerCase()));

// //     filtered.forEach((item) => {
// //       const pcb = item.Serial_No;
// //       const rowData = { pcb_serial: pcb };
      
// //       const allTasks = [
// //         ...(item.Completed_tasks || []).map(t => ({ name: t.step_name, staff: t.step_Ope_staff_No, color: '#10b981', status: 'Completed' })),
// //         ...(item.present_tasks || []).map(t => ({ name: t.step_name_str, staff: t.step_name_ope_staff_No, color: '#f59e0b', status: 'Present' })),
// //         ...(item.Pending_tasks || []).map(t => ({ name: t.TaskName, staff: t.staff_No?.[0], color: '#ef4444', status: 'Pending' }))
// //       ];

// //       allTasks.forEach((task) => {
// //         allProcessNames.add(task.name);
// //         // Each segment is 1 unit wide to show sequence
// //         rowData[task.name] = 1; 
// //         rowData[`${task.name}_data`] = {
// //           task_name: task.name,
// //           pcb_serial: pcb,
// //           operator_name: task.staff,
// //           fillColor: task.color, // Explicitly pass the color
// //           status: task.status
// //         };
// //       });
// //       processedChart.push(rowData);
// //     });

// //     return { chartData: processedChart, processesList: Array.from(allProcessNames) };
// //   }, [rawData, searchTerm]);

// //   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress size={60} /></Box>;

// //   return (
// //     <Box sx={{ p: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
// //       {/* Header */}
// //       <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
// //         <Typography variant="h5" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //             <FactoryIcon color="primary" /> LINE OPERATIONS FEED
// //         </Typography>
// //         <Stack direction="row" spacing={2}>
// //             <TextField 
// //                 placeholder="Filter Serial..." size="small" 
// //                 value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
// //                 InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white' } }}
// //             />
// //             <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'white' }}>
// //                 <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
// //                     <MenuItem value="both">Both View</MenuItem>
// //                     <MenuItem value="graph">Graph Only</MenuItem>
// //                     <MenuItem value="table">Table Only</MenuItem>
// //                 </Select>
// //             </FormControl>
// //         </Stack>
// //       </Box>

// //       {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

// //       {/* GRAPH SECTION */}
// //       {(viewMode === "both" || viewMode === "graph") && (
// //   <Paper sx={{ p: 4, borderRadius: 3, height: Math.max(450, chartData.length * 90), mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
// //     <Typography variant="subtitle2" fontWeight="700" color="text.secondary" mb={3}>PRODUCTION PIPELINE VISUALIZATION</Typography>
// //     <ResponsiveContainer width="100%" height="100%">
// //       <ComposedChart layout="vertical" data={chartData} margin={{ left: 20, right: 30 }}>
// //         <CartesianGrid stroke="#f1f5f9" horizontal={true} vertical={false} strokeWidth={2} />
// //         <XAxis type="number" hide domain={[0, 'dataMax']} />
// //         <YAxis type="category" dataKey="pcb_serial" width={100} stroke="#64748b" tick={{ fontWeight: 900, fill: '#1e293b' }} />
// //         <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
        
// //         {processesList.map((proc) => {
// //           // Find the color for this specific bar segment from the data payload
// //           const sample = chartData.find(d => d[`${proc}_data`]);
// //           const barColor = sample ? sample[`${proc}_data`].fillColor : "#cbd5e1";

// //           return (
// //             <Bar 
// //               key={proc} 
// //               dataKey={proc} 
// //               stackId="pcb_line" // This forces Green, Yellow, and Red into ONE horizontal line
// //               fill={barColor} 
// //               shape={<CustomBarShape />} 
// //               isAnimationActive={false} 
// //             />
// //           );
// //         })}
// //       </ComposedChart>
// //     </ResponsiveContainer>
// //   </Paper>
// // )}

// //       {/* TABLE SECTION */}
// //       {(viewMode === "both" || viewMode === "table") && (
// //         <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
// //           <Table>
// //             <TableHead sx={{ bgcolor: "#1e293b" }}>
// //               <TableRow>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>SERIAL</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>COMPLETED</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>ACTIVE</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>PENDING</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {rawData.filter(item => item.Serial_No.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
// //                 <TableRow key={item.Serial_No} hover>
// //                   <TableCell><Typography variant="subtitle1" fontWeight="900">#{item.Serial_No}</Typography></TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={1.5}>
// //                         {item.Completed_tasks?.map((ct, i) => (
// //                           <Box key={i} sx={{ borderLeft: '4px solid #10b981', pl: 1, py: 0.2, minWidth: '120px' }}>
// //                             <Typography variant="caption" fontWeight="900" color="#166534" display="block">{ct.step_name}</Typography>
// //                             <Typography variant="caption" color="text.secondary">Op: {ct.step_Ope_staff_No}</Typography>
// //                           </Box>
// //                         ))}
// //                     </Stack>
// //                   </TableCell>
// //                   <TableCell>
// //                     {item.present_tasks?.map((pt, i) => (
// //                        <Box key={i} sx={{ bgcolor: '#fffbeb', p: 1.5, borderRadius: 2, border: '1px solid #fde047' }}>
// //                           <Typography variant="body2" fontWeight="900" color="#92400e">{pt.step_name_str}</Typography>
// //                           <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700 }}>Staff: {pt.step_name_ope_staff_No}</Typography>
// //                        </Box>
// //                     ))}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={1.5}>
// //                         {item.Pending_tasks?.map((pt, i) => (
// //                           <Box key={i} sx={{ borderLeft: '4px solid #ef4444', pl: 1, py: 0.2, minWidth: '120px' }}>
// //                             <Typography variant="caption" fontWeight="900" color="#991b1b" display="block">{pt.TaskName}</Typography>
// //                             <Typography variant="caption" color="text.secondary">Staff: {pt.staff_No?.[0]}</Typography>
// //                           </Box>
// //                         ))}
// //                     </Stack>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}
// //     </Box>
// //   );
// // };

// // export default ProductionDashboard;

// // import React, { useState, useMemo, useEffect } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import {
// //   ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// // } from "recharts";
// // import {
// //   Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
// //   TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
// //   CircularProgress, Alert, Stack, TextField, InputAdornment, Divider
// // } from "@mui/material";
// // import { Search as SearchIcon, PrecisionManufacturing as FactoryIcon } from "@mui/icons-material";

// // // --- 1. Custom Tooltip ---
// // const CustomTooltip = ({ active, payload }) => {
// //   if (active && payload && payload.length) {
// //     const dataKey = payload[0].dataKey;
// //     const taskData = payload[0].payload[`${dataKey}_data`];
// //     if (!taskData) return null;

// //     return (
// //       <Paper sx={{ p: 2, border: `2px solid ${taskData.fillColor}`, boxShadow: 5, borderRadius: 2 }}>
// //         <Typography variant="subtitle2" fontWeight="900" sx={{ color: taskData.fillColor }}>
// //           {taskData.task_name}
// //         </Typography>
// //         <Typography variant="caption" fontWeight="bold" color="text.secondary">
// //           STATUS: {taskData.status}
// //         </Typography>
// //         <Divider sx={{ my: 1 }} />
// //         <Typography variant="body2" fontWeight="700">Operator: {taskData.operator_name || "N/A"}</Typography>
// //         <Typography variant="caption" sx={{ fontWeight: 900 }}>Serial: #{taskData.pcb_serial}</Typography>
// //       </Paper>
// //     );
// //   }
// //   return null;
// // };

// // // --- 2. Bar Shape ---
// // const CustomBarShape = (props) => {
// //   const { x, y, width, height, fill } = props;
// //   const barHeight = 32; 
// //   const barY = y + (height - barHeight) / 2; 

// //   return <rect x={x} y={barY} width={width} height={barHeight} fill={fill} rx={4} stroke="#fff" strokeWidth={1} />;
// // };

// // const ProductionDashboard = () => {
// //   const [rawData, setRawData] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [viewMode, setViewMode] = useState("both");

// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
// //   const GhanttURL = useMemo(() => {
// //     const API_BASE = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
// //     return API_BASE + "/ganttchart";
// //   }, [configDetails]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await axios.get(GhanttURL);
// //         setRawData(Array.isArray(response.data) ? response.data : response.data.data || []);
// //       } catch (err) { setError("Server connection failed."); } finally { setLoading(false); }
// //     };
// //     fetchData();
// //   }, [GhanttURL]);

// //   // --- 3. FIX: Move filteredData to its own useMemo so Table can see it ---
// //   const filteredData = useMemo(() => {
// //     return rawData.filter(item => 
// //         item.Serial_No?.toLowerCase().includes(searchTerm.toLowerCase())
// //     );
// //   }, [rawData, searchTerm]);

// //   // --- 4. Chart Data Transformation ---
// //   const { chartData, processesList } = useMemo(() => {
// //     const allProcessNames = new Set();
// //     const processedChart = [];

// //     filteredData.forEach((item) => {
// //       const pcb = item.Serial_No;
// //       const rowData = { pcb_serial: pcb };
      
// //       const allTasks = [
// //         ...(item.Completed_tasks || []).map(t => ({ name: t.step_name, staff: t.step_Ope_staff_No, color: '#10b981', status: 'COMPLETED' })),
// //         ...(item.present_tasks || []).map(t => ({ name: t.step_name_str, staff: t.step_name_ope_staff_No, color: '#f59e0b', status: 'ACTIVE' })),
// //         ...(item.Pending_tasks || []).map(t => ({ name: t.TaskName, staff: t.staff_No?.[0], color: '#ef4444', status: 'PENDING' }))
// //       ];

// //       allTasks.forEach((task) => {
// //         allProcessNames.add(task.name);
// //         rowData[task.name] = 1; 
// //         rowData[`${task.name}_data`] = {
// //           task_name: task.name,
// //           pcb_serial: pcb,
// //           operator_name: task.staff,
// //           fillColor: task.color,
// //           status: task.status
// //         };
// //       });
// //       processedChart.push(rowData);
// //     });

// //     return { chartData: processedChart, processesList: Array.from(allProcessNames) };
// //   }, [filteredData]);

// //   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress size={60} /></Box>;

// //   return (
// //     <Box sx={{ p: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
// //       {/* Header */}
// //       <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
// //         <Typography variant="h5" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //             <FactoryIcon color="primary" /> PRODUCTION MONITOR
// //         </Typography>
// //         <Stack direction="row" spacing={3}>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#10b981', borderRadius: 0.5}}/><Typography variant="caption" fontWeight="900">DONE</Typography></Box>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#f59e0b', borderRadius: 0.5}}/><Typography variant="caption" fontWeight="900">ACTIVE</Typography></Box>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#ef4444', borderRadius: 0.5}}/><Typography variant="caption" fontWeight="900">PENDING</Typography></Box>
// //         </Stack>
// //         <TextField 
// //             placeholder="Search Serial..." size="small" 
// //             value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
// //             InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white' } }}
// //         />
// //       </Box>

// //       {/* GRAPH SECTION */}
// //       {(viewMode === "both" || viewMode === "graph") && (
// //         <Paper sx={{ p: 4, borderRadius: 3, height: Math.max(450, chartData.length * 100), mb: 5 }}>
// //           <ResponsiveContainer width="100%" height="100%">
// //             <ComposedChart layout="vertical" data={chartData} margin={{ left: 20 }}>
// //               <CartesianGrid stroke="#f1f5f9" horizontal={true} vertical={false} strokeWidth={2} />
// //               <XAxis type="number" hide domain={[0, 'dataMax']} />
// //               <YAxis type="category" dataKey="pcb_serial" width={90} stroke="#64748b" tick={{ fontWeight: 900, fill: '#1e293b' }} />
// //               <Tooltip content={<CustomTooltip />} shared={false} cursor={{ fill: 'transparent' }} />
// //               {processesList.map((proc) => {
// //                 const sample = chartData.find(d => d[`${proc}_data`]);
// //                 const barColor = sample ? sample[`${proc}_data`].fillColor : "#cbd5e1";
// //                 return (
// //                   <Bar 
// //                     key={proc} 
// //                     dataKey={proc} 
// //                     stackId="pcb_stack" 
// //                     fill={barColor} 
// //                     shape={<CustomBarShape />} 
// //                     isAnimationActive={false} 
// //                   />
// //                 );
// //               })}
// //             </ComposedChart>
// //           </ResponsiveContainer>
// //         </Paper>
// //       )}

// //       {/* TABLE SECTION */}
// //       {(viewMode === "both" || viewMode === "table") && (
// //         <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
// //           <Table>
// //             <TableHead sx={{ bgcolor: "#1e293b" }}>
// //               <TableRow>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>SERIAL</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>COMPLETED HISTORY</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>ACTIVE STATION</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>UPCOMING TASKS</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {/* NOW USES filteredData CORRECTLY */}
// //               {filteredData.map((row) => (
// //                 <TableRow key={row.Serial_No} hover>
// //                   <TableCell><Typography variant="h6" fontWeight="900">#{row.Serial_No}</Typography></TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={2}>
// //                       {row.Completed_tasks?.map((ct, i) => (
// //                         <Box key={i} sx={{ borderLeft: '4px solid #10b981', pl: 1.5, minWidth: '130px' }}>
// //                           <Typography variant="caption" fontWeight="900" color="#166534" display="block">{ct.step_name}</Typography>
// //                           <Typography variant="caption" color="text.secondary">Op: {ct.step_Ope_staff_No}</Typography>
// //                         </Box>
// //                       ))}
// //                     </Stack>
// //                   </TableCell>
// //                   <TableCell>
// //                     {row.present_tasks?.map((pt, i) => (
// //                       <Box key={i} sx={{ borderLeft: '4px solid #f59e0b', pl: 1.5, bgcolor: '#fffbeb', p: 1, borderRadius: '0 6px 6px 0' }}>
// //                         <Typography variant="body2" fontWeight="900" color="#92400e">{pt.step_name_str}</Typography>
// //                         <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#b45309' }}>USER: {pt.step_name_ope_staff_No}</Typography>
// //                       </Box>
// //                     ))}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={2}>
// //                       {row.Pending_tasks?.map((pt, i) => (
// //                         <Box key={i} sx={{ borderLeft: '4px solid #ef4444', pl: 1.5, minWidth: '130px' }}>
// //                           <Typography variant="caption" fontWeight="900" color="#991b1b" display="block">{pt.TaskName}</Typography>
// //                           <Typography variant="caption" color="text.secondary">Staff: {pt.staff_No?.[0]}</Typography>
// //                         </Box>
// //                       ))}
// //                     </Stack>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}
// //     </Box>
// //   );
// // };

// // export default ProductionDashboard;


// // import React, { useState, useMemo, useEffect } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import {
// //   ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// // } from "recharts";
// // import {
// //   Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
// //   TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
// //   CircularProgress, Alert, Stack, TextField, InputAdornment, Divider, Chip
// // } from "@mui/material";
// // import { Search as SearchIcon, PrecisionManufacturing as FactoryIcon } from "@mui/icons-material";

// // // --- 1. CORRECTED TOOLTIP LOGIC ---
// // const CustomTooltip = ({ active, payload }) => {
// //   // active: true if mouse is over a bar
// //   // payload: contains the data for the SPECIFIC bar segment hovered
// //   if (active && payload && payload.length) {
// //     const dataKey = payload[0].dataKey;
// //     const taskData = payload[0].payload[`${dataKey}_data`];

// //     if (!taskData) return null;

// //     return (
// //       <Paper 
// //         sx={{ 
// //           p: 2, 
// //           border: `2px solid ${taskData.fillColor}`, 
// //           boxShadow: 10, 
// //           borderRadius: 2,
// //           minWidth: 200,
// //           bgcolor: 'rgba(255, 255, 255, 0.95)'
// //         }}
// //       >
// //         <Typography variant="subtitle2" fontWeight="900" sx={{ color: taskData.fillColor, mb: 0.5 }}>
// //           {taskData.task_name}
// //         </Typography>
// //         <Chip 
// //           label={taskData.status} 
// //           size="small" 
// //           sx={{ mb: 1.5, height: 20, fontSize: '0.65rem', fontWeight: 900, bgcolor: taskData.fillColor, color: '#fff' }} 
// //         />
// //         <Stack spacing={0.5}>
// //             <Box>
// //                 <Typography variant="caption" color="text.secondary" display="block">OPERATOR / STAFF</Typography>
// //                 <Typography variant="body2" fontWeight="700">{taskData.operator_name || "Unassigned"}</Typography>
// //             </Box>
// //             <Divider sx={{ my: 1 }} />
// //             <Typography variant="caption" sx={{ fontWeight: 900 }}>
// //               PCB Serial: #{taskData.pcb_serial}
// //             </Typography>
// //         </Stack>
// //       </Paper>
// //     );
// //   }
// //   return null;
// // };

// // // --- 2. BAR SHAPE ---
// // const CustomBarShape = (props) => {
// //   const { x, y, width, height, fill } = props;
// //   const barHeight = 32; 
// //   const barY = y + (height - barHeight) / 2; 

// //   return (
// //     <rect 
// //       x={x} 
// //       y={barY} 
// //       width={width} 
// //       height={barHeight} 
// //       fill={fill} 
// //       rx={4} 
// //       stroke="#fff" 
// //       strokeWidth={1} 
// //     />
// //   );
// // };

// // const ProductionDashboard = () => {
// //   const [rawData, setRawData] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [viewMode, setViewMode] = useState("both");

// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
// //   const GhanttURL = useMemo(() => {
// //     const API_BASE = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
// //     return API_BASE + "/ganttchart";
// //   }, [configDetails]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await axios.get(GhanttURL);
// //         setRawData(Array.isArray(response.data) ? response.data : response.data.data || []);
// //       } catch (err) { setError("Factory server link down."); } finally { setLoading(false); }
// //     };
// //     fetchData();
// //   }, [GhanttURL]);

// //   const filteredData = useMemo(() => {
// //     return rawData.filter(item => item.Serial_No?.toLowerCase().includes(searchTerm.toLowerCase()));
// //   }, [rawData, searchTerm]);

// //   const { chartData, processesList } = useMemo(() => {
// //     const allProcessNames = new Set();
// //     const processedChart = [];

// //     filteredData.forEach((item) => {
// //       const pcb = item.Serial_No;
// //       const rowData = { pcb_serial: pcb };
      
// //       const allTasks = [
// //         ...(item.Completed_tasks || []).map(t => ({ name: t.step_name, staff: t.step_Ope_staff_No, color: '#10b981', status: 'COMPLETED' })),
// //         ...(item.present_tasks || []).map(t => ({ name: t.step_name_str, staff: t.step_name_ope_staff_No, color: '#f59e0b', status: 'ACTIVE' })),
// //         ...(item.Pending_tasks || []).map(t => ({ name: t.TaskName, staff: t.staff_No?.[0], color: '#ef4444', status: 'PENDING' }))
// //       ];

// //       allTasks.forEach((task) => {
// //         allProcessNames.add(task.name);
// //         rowData[task.name] = 1; 
// //         rowData[`${task.name}_data`] = {
// //           task_name: task.name,
// //           pcb_serial: pcb,
// //           operator_name: task.staff,
// //           fillColor: task.color,
// //           status: task.status
// //         };
// //       });
// //       processedChart.push(rowData);
// //     });

// //     return { chartData: processedChart, processesList: Array.from(allProcessNames) };
// //   }, [filteredData]);

// //   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress size={60} /></Box>;

// //   return (
// //     <Box sx={{ p: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
// //       {/* Header Area */}
// //       <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
// //         <Typography variant="h5" fontWeight="900" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //             <FactoryIcon color="primary" /> LINE OPERATIONS
// //         </Typography>
// //         <Stack direction="row" spacing={3}>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#10b981', borderRadius: 0.5}}/><Typography variant="caption" fontWeight="900">DONE</Typography></Box>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#f59e0b', borderRadius: 0.5}}/><Typography variant="caption" fontWeight="900">ACTIVE</Typography></Box>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#ef4444', borderRadius: 0.5}}/><Typography variant="caption" fontWeight="900">PENDING</Typography></Box>
// //         </Stack>
// //         <TextField 
// //             placeholder="Search Serial..." size="small" 
// //             value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
// //             InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white' } }}
// //         />
// //       </Box>

// //       {/* GRAPH SECTION */}
// //       {(viewMode === "both" || viewMode === "graph") && (
// //         <Paper sx={{ p: 4, borderRadius: 3, height: Math.max(450, chartData.length * 100), mb: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
// //           <ResponsiveContainer width="100%" height="100%">
// //             <ComposedChart layout="vertical" data={chartData} margin={{ left: 20 }}>
// //               <CartesianGrid stroke="#f1f5f9" horizontal={true} vertical={false} strokeWidth={2} />
// //               <XAxis type="number" hide domain={[0, 'dataMax']} />
// //               <YAxis type="category" dataKey="pcb_serial" width={90} stroke="#64748b" tick={{ fontWeight: 900, fill: '#1e293b' }} />
              
// //               {/* shared={false} is critical for identifying specific stacked segments */}
// //               <Tooltip content={<CustomTooltip />} shared={false} cursor={{ fill: 'transparent' }} />
              
// //               {processesList.map((proc) => {
// //                 const sample = chartData.find(d => d[`${proc}_data`]);
// //                 const barColor = sample ? sample[`${proc}_data`].fillColor : "#cbd5e1";
// //                 return (
// //                   <Bar 
// //                     key={proc} 
// //                     dataKey={proc} 
// //                     stackId="pcb_stack" 
// //                     fill={barColor} 
// //                     shape={<CustomBarShape />} 
// //                     isAnimationActive={false} 
// //                   />
// //                 );
// //               })}
// //             </ComposedChart>
// //           </ResponsiveContainer>
// //         </Paper>
// //       )}

// //       {/* TABLE SECTION */}
// //       {(viewMode === "both" || viewMode === "table") && (
// //         <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
// //           <Table>
// //             <TableHead sx={{ bgcolor: "#1e293b" }}>
// //               <TableRow>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>SERIAL NO</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>COMPLETED HISTORY</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>ACTIVE STATION</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>UPCOMING PIPELINE</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {filteredData.map((row) => (
// //                 <TableRow key={row.Serial_No} hover>
// //                   <TableCell><Typography variant="h6" fontWeight="900">#{row.Serial_No}</Typography></TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={2}>
// //                       {row.Completed_tasks?.map((ct, i) => (
// //                         <Box key={i} sx={{ borderLeft: '4px solid #10b981', pl: 1.5, minWidth: '130px' }}>
// //                           <Typography variant="caption" fontWeight="900" color="#166534" display="block">{ct.step_name}</Typography>
// //                           <Typography variant="caption" color="text.secondary">Op: {ct.step_Ope_staff_No}</Typography>
// //                         </Box>
// //                       ))}
// //                     </Stack>
// //                   </TableCell>
// //                   <TableCell>
// //                     {row.present_tasks?.map((pt, i) => (
// //                       <Box key={i} sx={{ borderLeft: '4px solid #f59e0b', pl: 1.5, bgcolor: '#fffbeb', p: 1, borderRadius: '0 6px 6px 0' }}>
// //                         <Typography variant="body2" fontWeight="900" color="#92400e">{pt.step_name_str}</Typography>
// //                         <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#b45309' }}>USER ID: {pt.step_name_ope_staff_No}</Typography>
// //                       </Box>
// //                     ))}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={2}>
// //                       {row.Pending_tasks?.map((pt, i) => (
// //                         <Box key={i} sx={{ borderLeft: '4px solid #ef4444', pl: 1.5, minWidth: '130px' }}>
// //                           <Typography variant="caption" fontWeight="900" color="#991b1b" display="block">{pt.TaskName}</Typography>
// //                           <Typography variant="caption" color="text.secondary">Staff: {pt.staff_No?.[0]}</Typography>
// //                         </Box>
// //                       ))}
// //                     </Stack>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}
// //     </Box>
// //   );
// // };

// // export default ProductionDashboard;


// // import React, { useState, useMemo, useEffect } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import {
// //   ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// // } from "recharts";
// // import {
// //   Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
// //   TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
// //   CircularProgress, Alert, Stack, TextField, InputAdornment, Divider, Chip
// // } from "@mui/material";
// // import { Search as SearchIcon, PrecisionManufacturing as FactoryIcon, Assignment as TaskIcon,Person as PersonIcon } from "@mui/icons-material";

// // // --- 1. UPDATED TOOLTIP: SHOWS ALL TASKS FOR THE ROW ---
// // const CustomTooltip = ({ active, payload }) => {
// //   if (active && payload && payload.length) {
// //     // In shared mode, payload contains all the bar segments for that row
// //     const rowData = payload[0].payload;
// //     const pcbSerial = rowData.pcb_serial;

// //     // We collect all task data objects from the payload
// //     const allTasks = payload
// //       .map(p => rowData[`${p.dataKey}_data`])
// //       .filter(Boolean);

// //     return (
// //       <Paper sx={{ p: 2, border: "1px solid #e2e8f0", boxShadow: 10, borderRadius: 3, minWidth: 280, bgcolor: 'rgba(255, 255, 255, 0.98)' }}>
// //         <Box display="flex" alignItems="center" gap={1} mb={1.5}>
// //             <TaskIcon color="primary" fontSize="small" />
// //             <Typography variant="subtitle1" fontWeight="900">PCB: {pcbSerial}</Typography>
// //         </Box>
// //         <Divider sx={{ mb: 1.5 }} />
        
// //         <Stack spacing={1.5}>
// //             {allTasks.map((task, idx) => (
// //                 <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
// //                     <Box sx={{ width: 8, height: 8, mt: 0.7, borderRadius: '50%', bgcolor: task.fillColor, flexShrink: 0 }} />
// //                     <Box>
// //                         <Typography variant="caption" fontWeight="900" sx={{ color: '#475569', textTransform: 'uppercase' }}>
// //                             {task.status} — {task.task_name}
// //                         </Typography>
// //                         <Typography variant="body2" fontWeight="700">
// //                             {task.operator_name || "Unassigned"}
// //                         </Typography>
// //                     </Box>
// //                 </Box>
// //             ))}
// //         </Stack>
// //       </Paper>
// //     );
// //   }
// //   return null;
// // };

// // // --- 2. BAR SHAPE ---
// // const CustomBarShape = (props) => {
// //   const { x, y, width, height, fill } = props;
// //   const barHeight = 28; 
// //   const barY = y + (height - barHeight) / 2; 

// //   return (
// //     <rect 
// //       x={x} 
// //       y={barY} 
// //       width={width} 
// //       height={barHeight} 
// //       fill={fill} 
// //       rx={2} 
// //       stroke="#fff" 
// //       strokeWidth={1} 
// //     />
// //   );
// // };

// // const ProductionDashboard = () => {
// //   const [rawData, setRawData] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [viewMode, setViewMode] = useState("both");

// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
// //   const GhanttURL = useMemo(() => {
// //     const API_BASE = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
// //     return API_BASE + "/ganttchart";
// //   }, [configDetails]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await axios.get(GhanttURL);
// //         setRawData(Array.isArray(response.data) ? response.data : response.data.data || []);
// //       } catch (err) { setError("Factory connection unavailable."); } finally { setLoading(false); }
// //     };
// //     fetchData();
// //   }, [GhanttURL]);

// //   const filteredData = useMemo(() => {
// //     return rawData.filter(item => item.Serial_No?.toLowerCase().includes(searchTerm.toLowerCase()));
// //   }, [rawData, searchTerm]);

// //   const { chartData, processesList } = useMemo(() => {
// //     const allProcessNames = new Set();
// //     const processedChart = [];

// //     filteredData.forEach((item) => {
// //       const pcb = item.Serial_No;
// //       const rowData = { pcb_serial: pcb };


      
// //       const allTasks = [
// //         ...(item.Completed_tasks || []).map(t => ({ name: t.step_name, staff: t.step_Ope_staff_No, color: '#10b981', status: 'Done' })),
// //         ...(item.present_tasks || []).map(t => ({ name: t.step_name_str, staff: t.step_name_ope_staff_No, color: '#f59e0b', status: 'Active' })),
// //         ...(item.Pending_tasks || []).map(t => ({ name: t.TaskName, staff: t.staff_No, color: '#ef4444', status: 'Pending' }))
// //       ];

// //       allTasks.forEach((task) => {
// //         allProcessNames.add(task.name);


// //         const operatorList = Array.isArray(task.staff) 
// //         ? task.staff.join(", ") 
// //         : task.staff;


// //         rowData[task.name] = 1; 
// //         rowData[`${task.name}_data`] = {
// //           task_name: task.name,
// //           pcb_serial: pcb,
// //           operator_name: operatorList,
// //           fillColor: task.color,
// //           status: task.status
// //         };
// //       });
// //       processedChart.push(rowData);
// //     });

// //     return { chartData: processedChart, processesList: Array.from(allProcessNames) };
// //   }, [filteredData]);

// //   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress size={60} /></Box>;

// //   return (
// //     <Box sx={{ p: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
// //       {/* Dashboard Header */}
// //       <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
// //         <Typography variant="h5" fontWeight="900" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //             <FactoryIcon color="primary" /> LINE OPERATIONS
// //         </Typography>
// //         <Stack direction="row" spacing={3}>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#10b981'}}/><Typography variant="caption" fontWeight="900">DONE</Typography></Box>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#f59e0b'}}/><Typography variant="caption" fontWeight="900">ACTIVE</Typography></Box>
// //             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:14, height:14, bgcolor:'#ef4444'}}/><Typography variant="caption" fontWeight="900">PENDING</Typography></Box>
// //             <TextField 
// //             placeholder="Search Serial..." size="small" 
// //             value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
// //             InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white' } }}
// //         />
// //         </Stack>
    
// //       </Box>

// //       {/* GRAPH SECTION */}
// //       {(viewMode === "both" || viewMode === "graph") && (
// //         <Paper sx={{ p: 4, borderRadius: 3, height: Math.max(200, chartData.length * 100), mb: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
// //           <ResponsiveContainer width="100%" height="50%">
// //             <ComposedChart layout="vertical" data={chartData} margin={{ left: 20 }}>
// //               <CartesianGrid stroke="#f1f5f9" horizontal={true} vertical={false} strokeWidth={2} />
// //               <XAxis type="number" hide domain={[0, 'dataMax']} />
// //               <YAxis type="category" dataKey="pcb_serial" width={90} stroke="#64748b" tick={{ fontWeight: 900, fill: '#1e293b' }} />
              
// //               {/* shared={true} ensures we get all tasks for the row in the tooltip */}
// //               <Tooltip content={<CustomTooltip />} shared={true} cursor={{ fill: '#f8fafc', opacity: 0.5 }} />
              
// //               {processesList.map((proc) => {
// //                 const sample = chartData.find(d => d[`${proc}_data`]);
// //                 const barColor = sample ? sample[`${proc}_data`].fillColor : "#cbd5e1";
// //                 return (
// //                   <Bar 
// //                     key={proc} 
// //                     dataKey={proc} 
// //                     stackId="pcb_stack" 
// //                     fill={barColor} 
// //                     shape={<CustomBarShape />} 
// //                     isAnimationActive={false} 
// //                   />
// //                 );
// //               })}
// //             </ComposedChart>
// //           </ResponsiveContainer>
// //         </Paper>
// //       )}

// //       {/* TABLE SECTION */}
// //       {(viewMode === "both" || viewMode === "table") && (
// //         <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
// //           <Table>
// //             <TableHead sx={{ bgcolor: "#1e293b" }}>
// //               <TableRow>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>SERIAL NO</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>COMPLETED HISTORY</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>ACTIVE STATION</TableCell>
// //                 <TableCell sx={{ color: '#fff', fontWeight: 900 }}>UPCOMING PIPELINE</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {filteredData.map((row) => (
// //                 <TableRow key={row.Serial_No} hover>
// //                   <TableCell><Typography variant="h6" fontWeight="900">#{row.Serial_No}</Typography></TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={2}>
// //                       {row.Completed_tasks?.map((ct, i) => (
// //                         <Box key={i} sx={{ borderLeft: '4px solid #10b981', pl: 1.5, minWidth: '130px' }}>
// //                           <Typography variant="caption" fontWeight="900" color="#166534" display="block">{ct.step_name}</Typography>
// //                           {/* <Typography variant="caption" color="text.secondary">USER ID:{ct.step_Ope_staff_No}</Typography> */}
// //                           <Chip
// //   icon={<PersonIcon style={{ fontSize: '1rem' }} />}
// //   label={`OPERATOR: ${ct.step_Ope_staff_No}`}
// //   size="small"
// //   sx={{
// //     mt: 0.5,
// //     height: 20,
// //     fontSize: '0.65rem',
// //     fontWeight: 700,
// //     backgroundColor: 'rgba(0, 0, 0, 0.05)',
// //     border: '1px solid rgba(0, 0, 0, 0.1)',
// //     '& .MuiChip-icon': { color: 'text.secondary' }
// //   }}
// // />
// //                         </Box>
// //                       ))}
// //                     </Stack>
// //                   </TableCell>
// //                   <TableCell>
// //                     {row.present_tasks?.map((pt, i) => (
// //                       <Box key={i} sx={{ borderLeft: '4px solid #f59e0b', pl: 1.5, bgcolor: '#fffbeb', p: 1, borderRadius: '0 6px 6px 0' }}>
// //                         <Typography variant="body2" fontWeight="900" color="#92400e">{pt.step_name_str}</Typography>
// //                         {/* <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#b45309' }}>USER ID: {pt.step_name_ope_staff_No}</Typography> */}
// //                         <Chip
// //   icon={<PersonIcon style={{ fontSize: '1rem' }} />}
// //   label={`OPERATOR: ${pt.step_name_ope_staff_No}`}
// //   size="small"
// //   sx={{
// //     mt: 0.5,
// //     height: 20,
// //     fontSize: '0.65rem',
// //     fontWeight: 700,
// //     backgroundColor: 'rgba(0, 0, 0, 0.05)',
// //     border: '1px solid rgba(0, 0, 0, 0.1)',
// //     '& .MuiChip-icon': { color: 'text.secondary' }
// //   }}
// // />
// //                       </Box>
// //                     ))}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Stack direction="row" flexWrap="wrap" gap={2}>
// //                       {row.Pending_tasks?.map((pt, i) => (
// //                         <Box key={i} sx={{ borderLeft: '4px solid #ef4444', pl: 1.5, minWidth: '130px' }}>
// //                           <Typography variant="caption" fontWeight="900" color="#991b1b" display="block">{pt.TaskName}</Typography>
// //                           {/* <Typography variant="caption" color="text.secondary">USER ID: {pt.staff_No?.[0]}</Typography> */}
// //                           <Chip
// //   icon={<PersonIcon style={{ fontSize: '1rem' }} />}
// //   label={`OPERATOR: ${pt.staff_No}`}
// //   size="small"
// //   sx={{
// //     mt: 0.5,
// //     height: 20,
// //     fontSize: '0.65rem',
// //     fontWeight: 700,
// //     backgroundColor: 'rgba(0, 0, 0, 0.05)',
// //     border: '1px solid rgba(0, 0, 0, 0.1)',
// //     '& .MuiChip-icon': { color: 'text.secondary' }
// //   }}
// // />
// //                         </Box>
// //                       ))}
// //                     </Stack>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}
// //     </Box>
// //   );
// // };

// // export default ProductionDashboard;


// import React, { useState, useMemo, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
// } from "recharts";
// import {
//   Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
//   CircularProgress, Alert, Stack, TextField, InputAdornment, Divider, Chip, Avatar
// } from "@mui/material";
// import { 
//   Search as SearchIcon, 
//   PrecisionManufacturing as FactoryIcon, 
//   Person as PersonIcon 
// } from "@mui/icons-material";

// // --- CONSTANTS ---
// const COLORS = {
//   COMPLETED: '#10b981', // Green
//   PRESENT: '#f59e0b',   // Amber
//   PENDING: '#64748b'    // Gray
// };
// const BAR_HEIGHT = 60; // Taller bar to match image
// const ROW_HEIGHT = 160; // Height per Serial Number row

// // --- 1. CUSTOM BAR SHAPE (Exact Replica of Image) ---
// const CustomTaskBar = (props) => {
//   const { x, y, width, height, fill, payload, value } = props;
  
//   // If no value in this slot, don't render anything
//   if (!value) return null;

//   // Visual Adjustments
//   const gap = 10; // Gap between blocks
//   const blockWidth = width - gap; 
//   const fontSize = 10;
  
//   // Text Positioning
//   const insideTextY = y + height / 2 + 4; 
//   const belowTextY = y + height + 16; 

//   // Access the actual task data hidden in the payload for this specific step
//   // Note: In a stacked chart, 'payload' is the whole row. We need the specific key.
//   // Recharts passes the specific data under props.payload[props.dataKey] if structured correctly, 
//   // but simpler to embed it in the payload structure.
  
//   // For this specific implementation, we will pass the task details directly 
//   // into the dataKey object in the transformation step.
//   const taskDetails = props.payload[props.dataKey]; 

//   if (!taskDetails) return null;

//   return (
//     <g>
//       {/* 1. The Colored Block (with gap) */}
//       <rect 
//         x={x} 
//         y={y} 
//         width={blockWidth} 
//         height={height} 
//         fill={taskDetails.color} 
//         rx={0} // Sharp corners like the image? Or rounded? Image has slight rounding.
//         ry={0}
//       />
      
//       {/* 2. Task Name INSIDE the Block */}
//       <foreignObject x={x} y={y} width={blockWidth} height={height}>
//         <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center', 
//             height: '100%', 
//             textAlign: 'center', 
//             color: '#fff', 
//             fontSize: '12px', 
//             fontWeight: 'bold', 
//             lineHeight: '1.2',
//             padding: '0 4px',
//             wordWrap: 'break-word',
//             textTransform:'uppercase'
//         }}>
//             {taskDetails.taskName}
//         </div>
//       </foreignObject>

//       {/* 3. Operator Label BELOW the Block */}
//       <text
//         x={x + blockWidth / 2}
//         y={belowTextY}
//         textAnchor="middle"
//         fill="#000"
//         fontSize={12}
//         fontWeight="bold"
//       >
//         Operator:
//       </text>

//       {/* 4. Operator IDs List BELOW the label */}
//       <foreignObject x={x} y={belowTextY + 4} width={blockWidth} height={60}>
//          <div style={{ 
//             textAlign: 'center', 
//             fontSize: '12px', 
//             color: '#000', 
//             lineHeight: '1.2',
//             fontWeight: '600',
//             wordWrap: 'break-word'
//         }}>
//             {taskDetails.operators}
//         </div>
//       </foreignObject>
//     </g>
//   );
// };

// // --- 2. TOOLTIP ---
// const CustomGanttTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     // We need to find which specific bar is being hovered. 
//     // Recharts tooltip gives us the whole row. 
//     // Usually, custom tooltips on stacked bars are tricky.
//     // However, the CustomShape covers the visual part.
//     return null; // Disable default tooltip to let the visual representation stand on its own
//   }
//   return null;
// };

// const ProductionDashboard = () => {
//   const [rawData, setRawData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [viewMode, setViewMode] = useState("both");
//   // Default to showing by Task Name
// const [displayType, setDisplayType] = useState("name"); // Options: "name" or "id"

//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
//   const GhanttURL = useMemo(() => {
//     const API_BASE = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
//     return API_BASE + "/ganttchart";
//   }, [configDetails]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(GhanttURL);
//         setRawData(Array.isArray(response.data) ? response.data : response.data.data || []);
//       } catch (err) { setError("Factory connection unavailable."); } finally { setLoading(false); }
//     };
//     fetchData();
//   }, [GhanttURL]);

//   const filteredData = useMemo(() => {
//     return rawData.filter(item => item.Serial_No?.toLowerCase().includes(searchTerm.toLowerCase()));
//   }, [rawData, searchTerm]);

//   // --- 3. DATA TRANSFORMATION FOR "IMAGE-LIKE" ROW LAYOUT ---
//   const { chartData, maxSteps } = useMemo(() => {
//     let maxTaskCount = 0;

//     const transformed = filteredData.map((item) => {
//         const row = { serialNo: item.Serial_No };
//         let taskIndex = 0;

//         // Helper to add a task to the row object
//         const addTask = (name, status, ops, color) => {
//             const key = `step_${taskIndex}`;
//             row[key] = {
//                 val: 1, // The width value for the bar (always 1 unit)
//                 taskName: name,
               
//                 status: status,
//                 operators: Array.isArray(ops) ? ops.join(", ") : ops,
//                 color: color
//             };
//             taskIndex++;
//         };

//         (item.Completed_tasks || []).forEach(t => addTask(t.step_name, 'Completed', t.step_Ope_staff_No, COLORS.COMPLETED));
//         (item.present_tasks || []).forEach(t => addTask(t.step_name_str, 'Active', t.step_name_ope_staff_No, COLORS.PRESENT));
//         (item.Pending_tasks || []).forEach(t => addTask(t.TaskName, 'Pending', t.staff_No, COLORS.PENDING));

//         if (taskIndex > maxTaskCount) maxTaskCount = taskIndex;
//         return row;
//     });

//     return { chartData: transformed, maxSteps: maxTaskCount };
//   }, [filteredData]);

//   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress size={60} /></Box>;

//   return (
//     <Box sx={{ p: 4, bgcolor: "#fff", minHeight: "100vh" }}>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
//         <Typography variant="h5" fontWeight="900" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <FactoryIcon color="primary" /> PROCESS VISUALIZER
//         </Typography>
//         <Stack direction="row" spacing={3}>
//              {/* Legend matching the image */}
//             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:20, height:20, bgcolor: COLORS.COMPLETED}}/><Typography variant="body2" fontWeight="bold">Completed Tasks</Typography></Box>
//             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:20, height:20, bgcolor: COLORS.PRESENT}}/><Typography variant="body2" fontWeight="bold">Present Task (Started)</Typography></Box>
//             <Box display="flex" alignItems="center" gap={1}><Box sx={{width:20, height:20, bgcolor: COLORS.PENDING}}/><Typography variant="body2" fontWeight="bold">Pending Tasks</Typography></Box>
//         </Stack>
//         <TextField 
//             placeholder="Search Serial..." size="small" 
//             value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white' } }}
//         />
//       </Box>

//       {/* --- GRAPH SECTION --- */}
//       {(viewMode === "both" || viewMode === "graph") && (
//         <Paper elevation={0} sx={{ p: 0, height: Math.max(400, chartData.length * ROW_HEIGHT), mb: 5, overflowX: 'auto' }}>
            
//             <div style={{ minWidth: Math.max(1200, maxSteps * 160), height: '100%' }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                         data={chartData}
//                         layout="vertical"
//                         barSize={BAR_HEIGHT}
//                         // CHANGE 1: Increased left margin to 60px to make room for the label
//                         margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
//                     >
//                         <CartesianGrid horizontal={false} vertical={false} />
//                         <XAxis type="number" hide domain={[0, maxSteps]} />
                        
//                         <YAxis 
//                             type="category" 
//                             dataKey="serialNo" 
//                             width={80} // Reserved width for the axis line area
//                             tick={({ x, y, payload }) => (
//                                 <g transform={`translate(${x},${y})`}>
//                                     {/* CHANGE 2: Adjusted dy and x coordinates to center the rotated text */}
//                                     <text 
//                                         x={-40} // Move text further left into the margin space
//                                         y={0} 
//                                         dy={4} // Center vertically relative to the tick
//                                         textAnchor="middle" 
//                                         fill="#1e293b" 
//                                         fontWeight="900" 
//                                         fontSize={14} 
//                                         transform={`rotate(0)`}
//                                     >
//                                         {payload.value}
//                                     </text>
//                                     {/* Axis Line */}
//                                     <line x1={0} y1={-ROW_HEIGHT/2 + 10} x2={0} y2={ROW_HEIGHT/2 - 10} stroke="#cbd5e1" strokeWidth={3} />
//                                 </g>
//                             )}
//                         />
                        
//                         {[...Array(maxSteps)].map((_, index) => (
//                             <Bar 
//                                 key={index} 
//                                 dataKey={`step_${index}.val`} 
//                                 stackId="a" 
//                                 shape={<CustomTaskBar dataKey={`step_${index}`} />} 
//                                 isAnimationActive={false}
//                             />
//                         ))}
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//         </Paper>
//       )}

 
                            
                            


// {/* --- HEADER CONTROLS --- */}
// <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
//         <Typography variant="h5" fontWeight="900" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <FactoryIcon color="primary" /> PROCESS VISUALIZER
//         </Typography>
        
//         <Stack direction="row" spacing={2}>
//             {/* NEW: DISPLAY FILTER DROPDOWN */}
//             <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
//                 <InputLabel>Display By</InputLabel>
//                 <Select 
//                     value={displayType} 
//                     label="Display By" 
//                     onChange={(e) => setDisplayType(e.target.value)}
//                 >
//                     <MenuItem value="name">Task Name</MenuItem>
//                     <MenuItem value="id">Step ID</MenuItem>
//                 </Select>
//             </FormControl>

//             <TextField 
//                 placeholder="Search Serial..." size="small" 
//                 value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white' } }}
//             />
//         </Stack>
//       </Box>

//       {/* --- UNIFIED TABLE SECTION --- */}
//       {(viewMode === "both" || viewMode === "table") && (
//         <TableContainer 
//           component={Paper} 
//           elevation={0}
//           sx={{ 
//             borderRadius: 4, 
//             boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
//             border: '1px solid #e2e8f0',
//             overflow: 'hidden'
//           }}
//         >
//           <Table sx={{ minWidth: 650 }}>
//             <TableHead>
//               <TableRow sx={{ bgcolor: "#f8fafc", borderBottom: '2px solid #e2e8f0' }}>
//                 <TableCell sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>SERIAL NO</TableCell>
//                 <TableCell sx={{ color: '#166534', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>COMPLETED HISTORY</TableCell>
//                 <TableCell sx={{ color: '#b45309', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>CURRENT ACTIVITY</TableCell>
//                 <TableCell sx={{ color: '#52525b', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>UPCOMING TASKS</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filteredData.map((row) => (
//                 <TableRow 
//                   key={row.Serial_No} 
//                   hover 
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                 >
//                   {/* SERIAL NO */}
//                   <TableCell component="th" scope="row" sx={{ verticalAlign: 'top', py: 3, width: 140 }}>
//                     <Box sx={{ bgcolor: '#f1f5f9', borderRadius: 2, p: 1.5, textAlign: 'center', border: '1px solid #cbd5e1' }}>
//                         <Typography variant="caption" display="block" color="text.secondary" fontWeight="bold">PCB SERIAL</Typography>
//                         <Typography variant="h6" fontWeight="900" color="#1e293b">#{row.Serial_No}</Typography>
//                     </Box>
//                   </TableCell>

//                   {/* COMPLETED TASKS */}
//                   <TableCell sx={{ verticalAlign: 'top', py: 3 }}>
//                     <Stack spacing={1.5}>
//                       {row.Completed_tasks?.length ? (
//                         row.Completed_tasks.map((ct, i) => (
//                           <Paper 
//                             key={i} 
//                             elevation={0}
//                             sx={{ p: 1.5, borderLeft: '5px solid #10b981', bgcolor: '#f0fdf4', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}
//                           >
//                             <Typography variant="subtitle2" fontWeight="800" color="#15803d" sx={{ lineHeight: 1.2 ,textTransform:'uppercase'}}>
//                                 {/* CONDITIONAL RENDERING BASED ON FILTER */}
//                                 {displayType === 'name' ? ct.step_name : ct.step_id}
//                             </Typography>
                            
//                             <Stack direction="row" alignItems="center" spacing={1}>
//                                 <PersonIcon sx={{ fontSize: 14, color: '#166534' }} />
//                                 <Typography variant="caption" fontWeight="700" color="#14532d">
//                                     {ct.step_Ope_staff_No}
//                                 </Typography>
//                             </Stack>
//                           </Paper>
//                         ))
//                       ) : (
//                         <Typography variant="caption" color="text.disabled" fontStyle="italic">No history available</Typography>
//                       )}
//                     </Stack>
//                   </TableCell>

//                   {/* ACTIVE STATION */}
//                   <TableCell sx={{ verticalAlign: 'top', py: 3, bgcolor: '#fffbeb' }}>
//                     <Stack spacing={2}>
//                         {row.present_tasks?.map((pt, i) => (
//                           <Paper 
//                             key={i} 
//                             elevation={3} 
//                             sx={{ p: 2, border: '1px solid #fcd34d', borderLeft: '5px solid #f59e0b', bgcolor: '#ffffff', borderRadius: 2 }}
//                           >
//                             <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
//                                 <Typography variant="subtitle2" fontWeight="900" color="#92400e" sx={{ lineHeight: 1.2,textTransform:'uppercase' }}>
//                                     {/* CONDITIONAL RENDERING BASED ON FILTER */}
//                                     {displayType === 'name' ? pt.step_name_str : pt.step_id}
//                                 </Typography>
//                                 <Chip label="ACTIVE" size="small" sx={{ bgcolor: '#f59e0b', color: 'white', height: 18, fontSize: '0.6rem', fontWeight: 'bold' }} />
//                             </Box>
                            
//                             <Divider sx={{ my: 1 }} />
                            
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <Avatar sx={{ width: 24, height: 24, bgcolor: '#fef3c7', color: '#d97706', fontSize: '0.7rem', fontWeight: 'bold' }}>
//                                     <PersonIcon fontSize="inherit" />
//                                 </Avatar>
//                                 <Box>
//                                     <Typography variant="caption" display="block" color="text.secondary" fontWeight="bold" fontSize="0.65rem">OPERATOR</Typography>
//                                     <Typography variant="caption" fontWeight="800" color="#78350f">
//                                         {pt.step_name_ope_staff_No}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                           </Paper>
//                         ))}
//                     </Stack>
//                   </TableCell>

//                   {/* UPCOMING TASKS */}
//                   <TableCell sx={{ verticalAlign: 'top', py: 3 }}>
//                     <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
//                       {row.Pending_tasks?.map((pt, i) => (
//                         <Paper 
//                             key={i} 
//                             variant="outlined"
//                             sx={{ p: 1, borderLeft: '3px solid #94a3b8', borderRadius: 1, width: '100%', maxWidth: '200px', bgcolor: '#f8fafc' }}
//                           >
//                             <Typography variant="subtitle2" fontWeight="700" color="#475569" display="block" sx={{ mb: 0.5, lineHeight: 1.1 }}>
//                                 {/* CONDITIONAL RENDERING BASED ON FILTER */}
//                                 {displayType === 'name' ? pt.TaskName : pt.step_id}
//                             </Typography>
//                             <Chip 
//                                 icon={<PersonIcon style={{ fontSize: '0.8rem' }} />} 
//                                 label={`${pt.staff_No}`}
//                                 size="small" 
//                                 variant="outlined"
//                                 sx={{ height: 18, fontSize: '0.6rem', fontWeight: 'bold', border: '1px solid #cbd5e1' }} 
//                             />
//                           </Paper>
//                       ))}
//                     </Stack>
//                   </TableCell>

//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//     </Box>
//   );
// };

// export default ProductionDashboard;

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert, Stack, TextField, InputAdornment, Divider, Chip, Avatar
} from "@mui/material";
import { 
  Search as SearchIcon, 
  PrecisionManufacturing as FactoryIcon, 
  Person as PersonIcon,
  ViewComfy as ViewComfyIcon, // Optional icon for view mode
  TableChart as TableChartIcon,
  BarChart as BarChartIcon
} from "@mui/icons-material";

// --- CONSTANTS ---
const COLORS = {
  COMPLETED: '#10b981', // Green
  PRESENT: '#f59e0b',   // Amber
  PENDING: '#64748b'    // Gray
};
const BAR_HEIGHT = 60; 
const ROW_HEIGHT = 160; 

// --- 1. CUSTOM BAR SHAPE ---
const CustomTaskBar = (props) => {
  const { x, y, width, height, fill, payload, value } = props;
  
  if (!value) return null;

  const gap = 10; 
  const blockWidth = width - gap; 
  
  const belowTextY = y + height + 16; 

  const taskDetails = props.payload[props.dataKey]; 

  if (!taskDetails) return null;

  return (
    <g>
      <rect 
        x={x} 
        y={y} 
        width={blockWidth} 
        height={height} 
        fill={taskDetails.color} 
        rx={0} 
        ry={0}
      />
      
      <foreignObject x={x} y={y} width={blockWidth} height={height}>
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center', 
            color: '#fff', 
            fontSize: '12px', 
            fontWeight: 'bold', 
            lineHeight: '1.2',
            padding: '0 4px',
            wordWrap: 'break-word',
            textTransform:'uppercase'
        }}>
            {taskDetails.taskName}
        </div>
      </foreignObject>

      <text
        x={x + blockWidth / 2}
        y={belowTextY}
        textAnchor="middle"
        fill="#000"
        fontSize={12}
        fontWeight="bold"
      >
        Operator:
      </text>

      <foreignObject x={x} y={belowTextY + 4} width={blockWidth} height={60}>
         <div style={{ 
            textAlign: 'center', 
            fontSize: '12px', 
            color: '#000', 
            lineHeight: '1.2',
            fontWeight: '600',
            wordWrap: 'break-word'
        }}>
            {taskDetails.operators}
        </div>
      </foreignObject>
    </g>
  );
};

const ProductionDashboard = () => {
  const [rawData, setRawData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- STATE FOR VIEW MODES ---
  const [viewMode, setViewMode] = useState("both"); // Options: "both", "graph", "table"
  const [displayType, setDisplayType] = useState("name"); // Options: "name" or "id"

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
  const GhanttURL = useMemo(() => {
    const API_BASE = configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP || "http://192.168.0.20:2000";
    return API_BASE + "/ganttchart";
  }, [configDetails]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(GhanttURL);
        setRawData(Array.isArray(response.data) ? response.data : response.data.data || []);
      } catch (err) { setError("Factory connection unavailable."); } finally { setLoading(false); }
    };
    fetchData();
  }, [GhanttURL]);

  const filteredData = useMemo(() => {
    return rawData.filter(item => item.Serial_No?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [rawData, searchTerm]);

  // --- DATA TRANSFORMATION ---
  const { chartData, maxSteps } = useMemo(() => {
    let maxTaskCount = 0;

    const transformed = filteredData.map((item) => {
        const row = { serialNo: item.Serial_No };
        let taskIndex = 0;

        const addTask = (name, status, ops, color) => {
            const key = `step_${taskIndex}`;
            row[key] = {
                val: 1, 
                taskName: name,
                status: status,
                operators: Array.isArray(ops) ? ops.join(", ") : ops,
                color: color
            };
            taskIndex++;
        };

        (item.Completed_tasks || []).forEach(t => addTask(t.step_name, 'Completed', t.step_Ope_staff_No, COLORS.COMPLETED));
        (item.present_tasks || []).forEach(t => addTask(t.step_name_str, 'Active', t.step_name_ope_staff_No, COLORS.PRESENT));
        (item.Pending_tasks || []).forEach(t => addTask(t.TaskName, 'Pending', t.staff_No, COLORS.PENDING));

        if (taskIndex > maxTaskCount) maxTaskCount = taskIndex;
        return row;
    });

    return { chartData: transformed, maxSteps: maxTaskCount };
  }, [filteredData]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress size={60} /></Box>;

  return (
    <Box sx={{ p: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      
      {/* --- TOP HEADER (Legend & Global Search) --- */}
      <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
        <Typography variant="h5" fontWeight="900" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FactoryIcon color="primary" /> PROCESS VISUALIZER
        </Typography>
        <Stack direction="row" spacing={3}>
            {/* Legend */}
            <Box display="flex" alignItems="center" gap={1}><Box sx={{width:20, height:20, bgcolor: COLORS.COMPLETED}}/><Typography variant="body2" fontWeight="bold">Completed Tasks</Typography></Box>
            <Box display="flex" alignItems="center" gap={1}><Box sx={{width:20, height:20, bgcolor: COLORS.PRESENT}}/><Typography variant="body2" fontWeight="bold">Present Task</Typography></Box>
            <Box display="flex" alignItems="center" gap={1}><Box sx={{width:20, height:20, bgcolor: COLORS.PENDING}}/><Typography variant="body2" fontWeight="bold">Pending Tasks</Typography></Box>
        </Stack>
      </Box>

            {/* --- MIDDLE CONTROLS (View Mode, Display Type, Search) --- */}
            <Box display="flex" justifyContent="space-between" mb={2} alignItems="center" sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="800" color="#475569">
            Detailed Breakdown
        </Typography>
        
        <Stack direction="row" spacing={2}>
            {/* NEW: VIEW MODE DROPDOWN */}
            <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
                <InputLabel>View Mode</InputLabel>
                <Select 
                    value={viewMode} 
                    label="View Mode" 
                    onChange={(e) => setViewMode(e.target.value)}
                >
                    <MenuItem value="both">Both Views</MenuItem>
                    <MenuItem value="graph">Gantt Chart Only</MenuItem>
                    <MenuItem value="table">Table Only</MenuItem>
                </Select>
            </FormControl>

            {/* EXISTING: DISPLAY FILTER */}
            {/* <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
                <InputLabel>Display By</InputLabel>
                <Select 
                    value={displayType} 
                    label="Display By" 
                    onChange={(e) => setDisplayType(e.target.value)}
                >
                    <MenuItem value="name">Serial Number</MenuItem>
                    <MenuItem value="id">Step ID</MenuItem>
                </Select>
            </FormControl> */}

            {/* EXISTING: SEARCH */}
            <TextField 
                placeholder="Search Serial..." size="small" 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white' } }}
            />
        </Stack>
      </Box>

      {/* --- GRAPH SECTION (Condition: Both or Graph) --- */}
      {(viewMode === "both" || viewMode === "graph") && (
        <Paper elevation={0} sx={{ p: 0, height: Math.max(400, chartData.length * ROW_HEIGHT), mb: 5, overflowX: 'auto' }}>
            <div style={{ minWidth: Math.max(1200, maxSteps * 160), height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        barSize={BAR_HEIGHT}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    >
                        <CartesianGrid horizontal={false} vertical={false} />
                        <XAxis type="number" hide domain={[0, maxSteps]} />
                        <YAxis 
                            type="category" 
                            dataKey="serialNo" 
                            width={80} 
                            tick={({ x, y, payload }) => (
                                <g transform={`translate(${x},${y})`}>
                                    <text 
                                        x={-40} 
                                        y={0} 
                                        dy={4} 
                                        textAnchor="middle" 
                                        fill="#1e293b" 
                                        fontWeight="900" 
                                        fontSize={14} 
                                    >
                                        {payload.value}
                                    </text>
                                    <line x1={0} y1={-ROW_HEIGHT/2 + 10} x2={0} y2={ROW_HEIGHT/2 - 10} stroke="#cbd5e1" strokeWidth={3} />
                                </g>
                            )}
                        />
                        {[...Array(maxSteps)].map((_, index) => (
                            <Bar 
                                key={index} 
                                dataKey={`step_${index}.val`} 
                                stackId="a" 
                                shape={<CustomTaskBar dataKey={`step_${index}`} />} 
                                isAnimationActive={false}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Paper>
      )}



      {/* --- TABLE SECTION (Condition: Both or Table) --- */}
      {(viewMode === "both" || viewMode === "table") && (
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc", borderBottom: '2px solid #e2e8f0' }}>
                <TableCell sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>SERIAL NO</TableCell>
                <TableCell sx={{ color: '#166534', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>COMPLETED HISTORY</TableCell>
                <TableCell sx={{ color: '#b45309', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>CURRENT ACTIVITY</TableCell>
                <TableCell sx={{ color: '#52525b', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>UPCOMING TASKS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((row) => (
                <TableRow 
                  key={row.Serial_No} 
                  hover 
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ verticalAlign: 'top', py: 3, width: 140 }}>
                    <Box sx={{ bgcolor: '#f1f5f9', borderRadius: 2, p: 1.5, textAlign: 'center', border: '1px solid #cbd5e1' }}>
                        <Typography variant="caption" display="block" color="text.secondary" fontWeight="bold">PCB SERIAL</Typography>
                        <Typography variant="h6" fontWeight="900" color="#1e293b">{row.Serial_No}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ verticalAlign: 'top', py: 3 }}>
                    <Stack spacing={1.5}>
                      {row.Completed_tasks?.length ? (
                        row.Completed_tasks.map((ct, i) => (
                          <Paper 
                            key={i} 
                            elevation={0}
                            sx={{ p: 1.5, borderLeft: '5px solid #10b981', bgcolor: '#f0fdf4', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}
                          >
                            <Typography variant="subtitle2" fontWeight="800" color="#15803d" sx={{ lineHeight: 1.2 ,textTransform:'uppercase'}}>
                                {displayType === 'name' ? ct.step_name : ct.step_id}
                            </Typography>
                            
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <PersonIcon sx={{ fontSize: 16, color: '#166534' }} />
                                <Typography variant="body1" fontWeight="700" color="#14532d">
                                    {ct.step_Ope_staff_No}
                                </Typography>
                            </Stack>
                          </Paper>
                        ))
                      ) : (
                        <Typography variant="body1" color="text.disabled" fontStyle="italic">No history available</Typography>
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ verticalAlign: 'top', py: 3, bgcolor: '#fffbeb' }}>
                    <Stack spacing={2}>
                        {row.present_tasks?.map((pt, i) => (
                          <Paper 
                            key={i} 
                            elevation={3} 
                            sx={{ p: 2, border: '1px solid #fcd34d', borderLeft: '5px solid #f59e0b', bgcolor: '#ffffff', borderRadius: 2 }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                <Typography variant="subtitle2" fontWeight="900" color="#92400e" sx={{ lineHeight: 1.2,textTransform:'uppercase' }}>
                                    {displayType === 'name' ? pt.step_name_str : pt.step_id}
                                </Typography>
                                <Chip label="ACTIVE" size="small" sx={{ bgcolor: '#f59e0b', color: 'white', height: 18, fontSize: '0.6rem', fontWeight: 'bold' }} />
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: '#fef3c7', color: '#d97706', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    <PersonIcon fontSize="inherit" />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" display="block" color="text.secondary" fontWeight="bold" fontSize="0.65rem">OPERATOR</Typography>
                                    <Typography variant="body1" fontWeight="800" color="#78350f">
                                        {pt.step_name_ope_staff_No}
                                    </Typography>
                                </Box>
                            </Box>
                          </Paper>
                        ))}
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ verticalAlign: 'top', py: 3 }}>
                    <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
                      {row.Pending_tasks?.map((pt, i) => (
                        <Paper 
                            key={i} 
                            variant="outlined"
                            sx={{ p: 1, borderLeft: '3px solid #94a3b8', borderRadius: 1, width: '100%', maxWidth: '200px', bgcolor: '#f8fafc' }}
                          >
                            <Typography variant="subtitle2" fontWeight="700" color="#475569" display="block" sx={{ mb: 0.5, lineHeight: 1.1 }}>
                                {displayType === 'name' ? pt.TaskName : pt.step_id}
                            </Typography>
                            <Chip 
                                icon={<PersonIcon style={{ fontSize: '1rem' }} />} 
                                label={`${pt.staff_No}`}
                                size="large" 
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #cbd5e1' }} 
                            />
                          </Paper>
                      ))}
                    </Stack>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </Box>
  );
};

export default ProductionDashboard;



