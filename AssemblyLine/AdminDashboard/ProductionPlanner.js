// import React, { useState } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   TextField,
//   Button,
//   Typography
// } from "@mui/material";
// import ProcessUtilizationChart from "./ProcessUtilizationChart";

// /* =========================================================
// CONFIGURATION SECTION
// Easy to modify later
// ========================================================= */

// const WORKING_DAYS_PER_MONTH = 25;
// const UTILIZATION_WARNING = 75;

// /* =========================================================
// MONTH LIST
// ========================================================= */

// const months = [
//   "Jan","Feb","Mar","Apr","May","Jun",
//   "Jul","Aug","Sep","Oct","Nov","Dec"
// ];

// /* =========================================================
// STAGE LIST
// ========================================================= */

// const stages = [
//   "SMT line",
//   "Ionic Contamination",
//   "FPT",
//   "Gap welding",
//   "ERSA",
//   "Xray",
//   "AOI",
//   "Varnish",
//   "Cleaning",
//   "Visual Inspection",
//   "ATE 1",
//   "ATE 2"
// ];

// export default function ProductionPlanningDashboard() {

//   /* =========================================================
//   TAB STATE
//   ========================================================= */

//   const [tab, setTab] = useState(0);

//   /* =========================================================
//   TAB1 → DEMAND DATA
//   ========================================================= */

//   const [rows, setRows] = useState(
//     months.map((month) => ({
//       month,
//       hexa: "",
//       octa: "",
//       saved: false
//     }))
//   );

//   /* =========================================================
//   TAB2 → MACHINE CAPACITY DATA
//   ========================================================= */

//   const [stageRows, setStageRows] = useState(
//     stages.map((stage) => ({
//       stage,
//       hoursPerShift: "",
//       shiftsPerDay: "",
//       manufacturingTime: "",
//       saved: false
//     }))
//   );

//   /* =========================================================
//   DEMAND TABLE INPUT HANDLER
//   ========================================================= */

//   const handleChange = (index, field, value) => {

//     const updated = [...rows];
//     updated[index][field] = value;

//     setRows(updated);
//   };

//   const handleSave = (index) => {

//     const updated = [...rows];
//     updated[index].saved = true;

//     setRows(updated);
//   };

//   const handleEdit = (index) => {

//     const updated = [...rows];
//     updated[index].saved = false;

//     setRows(updated);
//   };

//   /* =========================================================
//   STAGE INPUT HANDLER
//   ========================================================= */

//   const handleStageChange = (index, field, value) => {

//     const updated = [...stageRows];
//     updated[index][field] = value;

//     setStageRows(updated);
//   };

//   const handleStageSave = (index) => {

//     const updated = [...stageRows];
//     updated[index].saved = true;

//     setStageRows(updated);
//   };

//   const handleStageEdit = (index) => {

//     const updated = [...stageRows];
//     updated[index].saved = false;

//     setStageRows(updated);
//   };

//   /* =========================================================
//   CALCULATE TOTAL TARGET UNITS
//   (Equivalent to Excel cell F19)
//   ========================================================= */

//   const totalTargetUnits = rows.reduce((sum, r) => {

//     return sum +
//       (Number(r.hexa) || 0) +
//       (Number(r.octa) || 0);

//   }, 0);

//   /* =========================================================
//   UTILIZATION CALCULATION
//   ========================================================= */

//   const calculateUtilisation = (units, mfgTime, availableHours) => {

//     if (!mfgTime || !availableHours) return 0;

//     const demandHours =
//       (units * mfgTime) / 60;

//     const utilisation =
//       (demandHours / availableHours) * 100;

//     return Math.ceil(utilisation);
//   };

//   const mockChartData = stages.map((stage) => ({
//     process: stage,
//     target: 1000, 
//     maxCapacity: Math.floor(Math.random() * 1000) + 800 // Random capacity between 800-1800 for testing
//   }));

//   return (

//     <Box sx={{ width: "100%", p: 3 }}>

//       <Paper elevation={2}>

//         {/* =====================================================
//         TAB HEADER
//         ===================================================== */}

//         <Tabs
//           value={tab}
//           onChange={(e, v) => setTab(v)}
//         >
//            <Tab label="Stage Capacity"/>
//           <Tab label="Monthly Demand"/>
//           <Tab label="Utilisation Analysis"/>
//           <Tab label="Capacity Graph"/>
//         </Tabs>

//         {/* =====================================================
//         TAB1 → DEMAND TABLE
//         ===================================================== */}

//         {tab === 1 && (

//           <Box sx={{ p: 3 }}>

//             <Typography variant="h6">
//               Monthly Production Demand
//             </Typography>

//             <Table>

//               <TableHead>

//                 <TableRow>

//                   <TableCell>Month</TableCell>
//                   <TableCell>Hexa</TableCell>
//                   <TableCell>Octa</TableCell>
//                   <TableCell>Total</TableCell>
//                   <TableCell>Action</TableCell>

//                 </TableRow>

//               </TableHead>

//               <TableBody>

//                 {rows.map((row, i) => {

//                   const total =
//                     (Number(row.hexa) || 0) +
//                     (Number(row.octa) || 0);

//                   return (

//                     <TableRow key={i}>

//                       <TableCell>{row.month}</TableCell>

//                       <TableCell>

//                         <TextField
//                           size="small"
//                           type="number"
//                           value={row.hexa}
//                           disabled={row.saved}
//                           onChange={(e) =>
//                             handleChange(i,"hexa",e.target.value)
//                           }
//                         />

//                       </TableCell>

//                       <TableCell>

//                         <TextField
//                           size="small"
//                           type="number"
//                           value={row.octa}
//                           disabled={row.saved}
//                           onChange={(e) =>
//                             handleChange(i,"octa",e.target.value)
//                           }
//                         />

//                       </TableCell>

//                       <TableCell>{total}</TableCell>

//                       <TableCell>

//                         {!row.saved ? (
//                           <Button
//                             variant="contained"
//                             size="small"
//                             onClick={() => handleSave(i)}
//                           >
//                             Save
//                           </Button>
//                         ) : (
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             onClick={() => handleEdit(i)}
//                           >
//                             Edit
//                           </Button>
//                         )}

//                       </TableCell>

//                     </TableRow>

//                   );

//                 })}

//               </TableBody>

//             </Table>

//           </Box>
//         )}

//         {/* =====================================================
//         TAB2 → MACHINE CAPACITY
//         ===================================================== */}

//         {tab === 0 && (

//           <Box sx={{ p: 3 }}>

//             <Typography variant="h6">
//               Stage Capacity Configuration
//             </Typography>

//             <Table>

//               <TableHead>

//                 <TableRow>

//                   <TableCell>Stage</TableCell>
//                   <TableCell>Hours/Shift</TableCell>
//                   <TableCell>Shifts/Day</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Minutes/Day</TableCell>
//                   <TableCell>Hours/Month</TableCell>
//                   <TableCell>Mfg Time/Board</TableCell>
//                   <TableCell>Units/Day</TableCell>
//                   <TableCell>Action</TableCell>

//                 </TableRow>

//               </TableHead>

//               <TableBody>

//                 {stageRows.map((row, i) => {

//                   const hoursPerDay =
//                     (Number(row.hoursPerShift) || 0) *
//                     (Number(row.shiftsPerDay) || 0);

//                   const minutesPerDay =
//                     hoursPerDay * 60;

//                   const hoursPerMonth =
//                     hoursPerDay * WORKING_DAYS_PER_MONTH;

//                   const unitsPerDay =
//                     row.manufacturingTime
//                       ? Math.ceil(
//                           minutesPerDay /
//                           Number(row.manufacturingTime)
//                         )
//                       : 0;

//                   return (

//                     <TableRow key={i}>

//                       <TableCell>{row.stage}</TableCell>

//                       <TableCell>

//                         <TextField
//                           size="small"
//                           type="number"
//                           value={row.hoursPerShift}
//                           disabled={row.saved}
//                           onChange={(e)=>
//                             handleStageChange(
//                               i,
//                               "hoursPerShift",
//                               e.target.value
//                             )
//                           }
//                         />

//                       </TableCell>

//                       <TableCell>

//                         <TextField
//                           size="small"
//                           type="number"
//                           value={row.shiftsPerDay}
//                           disabled={row.saved}
//                           onChange={(e)=>
//                             handleStageChange(
//                               i,
//                               "shiftsPerDay",
//                               e.target.value
//                             )
//                           }
//                         />

//                       </TableCell>

//                       <TableCell>{hoursPerDay}</TableCell>

//                       <TableCell>{minutesPerDay}</TableCell>

//                       <TableCell>{hoursPerMonth}</TableCell>

//                       <TableCell>

//                         <TextField
//                           size="small"
//                           type="number"
//                           value={row.manufacturingTime}
//                           disabled={row.saved}
//                           onChange={(e)=>
//                             handleStageChange(
//                               i,
//                               "manufacturingTime",
//                               e.target.value
//                             )
//                           }
//                         />

//                       </TableCell>

//                       <TableCell>{unitsPerDay}</TableCell>

//                       <TableCell>

//                         {!row.saved ? (
//                           <Button
//                             variant="contained"
//                             size="small"
//                             onClick={() => handleStageSave(i)}
//                           >
//                             Save
//                           </Button>
//                         ) : (
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             onClick={() => handleStageEdit(i)}
//                           >
//                             Edit
//                           </Button>
//                         )}

//                       </TableCell>

//                     </TableRow>

//                   );

//                 })}

//               </TableBody>

//             </Table>

//           </Box>
//         )}

//         {/* =====================================================
//         TAB3 → UTILIZATION TABLE
//         ===================================================== */}

//         {tab === 2 && (

//           <Box sx={{ p: 3 }}>

//             <Typography variant="h6">
//               Utilisation Analysis
//             </Typography>

//             <Table>

//               <TableHead>

//                 <TableRow>

//                   <TableCell>Sl No</TableCell>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Available Hours</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Days Required</TableCell>

//                   {months.map((m)=>(
//                     <TableCell key={m}>{m}</TableCell>
//                   ))}

//                 </TableRow>

//               </TableHead>

//               <TableBody>

//                 {stageRows.map((stage,i)=>{

//                   const hoursPerDay =
//                     stage.hoursPerShift *
//                     stage.shiftsPerDay;

//                   const minutesPerDay =
//                     hoursPerDay * 60;

//                   const hoursPerMonth =
//                     hoursPerDay * WORKING_DAYS_PER_MONTH;

//                   const unitsPerDay =
//                     stage.manufacturingTime
//                       ? Math.ceil(
//                           minutesPerDay /
//                           stage.manufacturingTime
//                         )
//                       : 0;

//                   const daysRequired =
//                     unitsPerDay
//                       ? Math.ceil(
//                           totalTargetUnits /
//                           unitsPerDay
//                         )
//                       : 0;

//                   return (

//                     <TableRow key={i}>

//                       <TableCell>{i+1}</TableCell>

//                       <TableCell>{stage.stage}</TableCell>

//                       <TableCell>{hoursPerMonth}</TableCell>

//                       <TableCell>{hoursPerDay}</TableCell>

//                       <TableCell>{daysRequired}</TableCell>

//                       {months.map((m,mi)=>{

//                         const units =
//                           (Number(rows[mi]?.hexa)||0) +
//                           (Number(rows[mi]?.octa)||0);

//                         const utilisation =
//                           calculateUtilisation(
//                             units,
//                             stage.manufacturingTime,
//                             hoursPerMonth
//                           );

//                         return (

//                           <TableCell
//                             key={mi}
//                             sx={{
//                               backgroundColor:
//                                 utilisation >= UTILIZATION_WARNING
//                                   ? "#ffcccc"
//                                   : "inherit"
//                             }}
//                           >
//                             {utilisation}%
//                           </TableCell>

//                         );

//                       })}

//                     </TableRow>

//                   );

//                 })}

//               </TableBody>

//             </Table>

//           </Box>
//         )}
//         {tab === 3 && (
//           <ProcessUtilizationChart data={mockChartData} />
//         )}

//       </Paper>

//     </Box>
//   );
// }































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   TextField,
//   Button,
//   Typography
// } from "@mui/material";
// import ProcessUtilizationChart from "./ProcessUtilizationChart";

// /* =========================================================
// CONFIGURATION SECTION
// ========================================================= */
// const WORKING_DAYS_PER_MONTH = 25;
// const UTILIZATION_WARNING = 75;
// const API_BASE_URL = "http://127.0.0.1:2000"; // FastAPI backend URL

// const months = [
//   "Jan","Feb","Mar","Apr","May","Jun",
//   "Jul","Aug","Sep","Oct","Nov","Dec"
// ];

// const stages = [
//   "SMT line", "Ionic Contamination", "FPT", "Gap welding", 
//   "ERSA", "Xray", "AOI", "Varnish", "Cleaning", 
//   "Visual Inspection", "ATE 1", "ATE 2"
// ];

// export default function ProductionPlanningDashboard() {

//   const [tab, setTab] = useState(0);

//   /* =========================================================
//   STATE INITIALIZATION (With fallback default values)
//   ========================================================= */
//   const [rows, setRows] = useState(
//     months.map((month) => ({
//       id: null, // Will hold DB id once saved
//       month,
//       hexa: 100, // Fallback mock value
//       octa: 50,  // Fallback mock value
//       saved: true
//     }))
//   );

//   const [stageRows, setStageRows] = useState(
//     stages.map((stage) => ({
//       id: null,
//       stage,
//       hoursPerShift: 7, // Fallback mock value
//       shiftsPerDay: 2,  // Fallback mock value
//       manufacturingTime: 45, // Fallback mock value
//       saved: true
//     }))
//   );

//   /* =========================================================
//   API FETCH DATA ON LOAD
//   ========================================================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch Stages
//         const stageRes = await axios.get(`${API_BASE_URL}/stages/`);
//         console.log("data from api : ",stageRes)
//         if (stageRes.data && stageRes.data.length > 0) {
//           // Map DB models to frontend state structure
//           const fetchedStages = stages.map(stageName => {
//             const dbStage = stageRes.data.find(s => s.name === stageName);
//             return dbStage ? {
//               id: dbStage.id,
//               stage: dbStage.name,
//               hoursPerShift: dbStage.hours_per_shift,
//               shiftsPerDay: dbStage.shifts_per_day,
//               manufacturingTime: dbStage.manufacturing_time_mins,
//               saved: true
//             } : { id: null, stage: stageName, hoursPerShift: "", shiftsPerDay: "", manufacturingTime: "", saved: false };
//           });
//           setStageRows(fetchedStages);
//         }

//         // Fetch Demands for 2026
//         const demandRes = await axios.get(`${API_BASE_URL}/demands/?year=2026`);
//         if (demandRes.data && demandRes.data.length > 0) {
//           const fetchedDemands = months.map(monthName => {
//             const dbDemand = demandRes.data.find(d => d.month === monthName);
//             return dbDemand ? {
//               id: dbDemand.id,
//               month: dbDemand.month,
//               hexa: dbDemand.hexa_target,
//               octa: dbDemand.octa_target,
//               saved: true
//             } : { id: null, month: monthName, hexa: "", octa: "", saved: false };
//           });
//           setRows(fetchedDemands);
//         }
//       } catch (error) {
//         console.warn("Backend not running or unreachable, using fallback mock data.");
//       }
//     };
    
//     fetchData();
//   }, []);

//   /* =========================================================
//   DEMAND TABLE INPUT HANDLER & API SAVING
//   ========================================================= */
//   const handleChange = (index, field, value) => {
//     const updated = [...rows];
//     updated[index][field] = value;
//     setRows(updated);
//   };

//   const handleSave = async (index) => {
//     const updated = [...rows];
//     const rowToSave = updated[index];
    
//     try {
//       console.log("inside!")
//       const payload = {
//         year: 2026,
//         month: rowToSave.month,
//         hexa_target: Number(rowToSave.hexa) || 0,
//         octa_target: Number(rowToSave.octa) || 0
//       };

//       if (rowToSave.id) {
//         // Update existing via PUT
//         await axios.put(`${API_BASE_URL}/demands/${rowToSave.id}`, payload);
//       } else {
//         // Create new via POST
//         const res = await axios.post(`${API_BASE_URL}/demands/`, payload);
//         rowToSave.id = res.data.id; // Store new DB id
//       }
//     } catch (error) {
//       console.error("Failed to save demand to DB:", error);
//     }

//     rowToSave.saved = true;
//     setRows(updated);
//   };

//   const handleEdit = (index) => {
//     const updated = [...rows];
//     updated[index].saved = false;
//     setRows(updated);
//   };

//   /* =========================================================
//   STAGE INPUT HANDLER & API SAVING
//   ========================================================= */
//   const handleStageChange = (index, field, value) => {
//     const updated = [...stageRows];
//     updated[index][field] = value;
//     setStageRows(updated);
//   };

//   const handleStageSave = async (index) => {
//     const updated = [...stageRows];
//     const stageToSave = updated[index];

//     try {
//       const payload = {
//         name: stageToSave.stage,
//         hours_per_shift: Number(stageToSave.hoursPerShift) || 0,
//         shifts_per_day: Number(stageToSave.shiftsPerDay) || 0,
//         manufacturing_time_mins: Number(stageToSave.manufacturingTime) || 0
//       };

//       if (stageToSave.id) {
//         await axios.put(`${API_BASE_URL}/stages/${stageToSave.id}`, payload);
//       } else {
//         const res = await axios.post(`${API_BASE_URL}/stages/`, payload);
//         stageToSave.id = res.data.id;
//       }
//     } catch (error) {
//       console.error("Failed to save stage to DB:", error);
//     }

//     stageToSave.saved = true;
//     setStageRows(updated);
//   };

//   const handleStageEdit = (index) => {
//     const updated = [...stageRows];
//     updated[index].saved = false;
//     setStageRows(updated);
//   };

//   /* =========================================================
//   CALCULATIONS
//   ========================================================= */
//   const totalTargetUnits = rows.reduce((sum, r) => sum + (Number(r.hexa) || 0) + (Number(r.octa) || 0), 0);

//   const calculateUtilisation = (units, mfgTime, availableHours) => {
//     if (!mfgTime || !availableHours) return 0;
//     const demandHours = (units * mfgTime) / 60;
//     const utilisation = (demandHours / availableHours) * 100;
//     return Math.ceil(utilisation);
//   };

//   /* =========================================================
//   DYNAMIC CHART DATA GENERATION
//   ========================================================= */
  
//   // 1. Bar Chart Data (Target vs Max Capacity)
//   const dynamicBarData = stageRows.map(stage => {
//     const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
//     console.log("hoursPerDay: ",hoursPerDay," stage.manufacturingTime: ",stage.manufacturingTime)
//     const maxCapacity = stage.manufacturingTime ? Math.floor(((hoursPerDay * WORKING_DAYS_PER_MONTH )* 60) / Number(stage.manufacturingTime)) : 0;
//     console.log("maxCapacity: ",maxCapacity)
    
//     return {
//       process: stage.stage,
//       target: totalTargetUnits, // Annual total across all months
//       maxCapacity: maxCapacity * 12 // Annualizing the monthly max capacity for an apples-to-apples comparison
//     };
//   });

//   // 2. Line Chart Data (Utilization percentage per month per stage)
//   const dynamicLineData = months.map((m, mi) => {
//     const monthData = { month: m };
//     const unitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
    
//     stageRows.forEach(stage => {
//       const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
//       const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//       monthData[stage.stage] = calculateUtilisation(unitsThisMonth, stage.manufacturingTime, hoursPerMonth);
//     });
//     return monthData;
//   });

//   // 3. Gantt Chart Data (Cumulative time mapping)
//   let currentStartTime = 0;
//   const dynamicGanttData = stageRows.map(stage => {
//     const duration = Number(stage.manufacturingTime) || 0;
//     const startTime = currentStartTime;
//     const endTime = currentStartTime + duration;
//     currentStartTime = endTime; // Set up next stage to start when this one finishes
    
//     return {
//       process: stage.stage,
//       time: [startTime, endTime],
//       duration: duration
//     };
//   });

//   /* =========================================================
//   RENDER
//   ========================================================= */
//   return (
//     <Box sx={{ width: "100%", p: 3 }}>
//       <Paper elevation={2}>

//         <Tabs value={tab} onChange={(e, v) => setTab(v)}>
//           <Tab label="Stage Capacity"/>
//           <Tab label="Monthly Demand"/>
//           <Tab label="Utilisation Analysis"/>
//           <Tab label="Capacity Graph"/>
//         </Tabs>

//         {/* TAB 1: DEMAND TABLE */}
//         {tab === 1 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Monthly Production Demand</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Month</TableCell>
//                   <TableCell>Hexa</TableCell>
//                   <TableCell>Octa</TableCell>
//                   <TableCell>Total</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rows.map((row, i) => {
//                   const total = (Number(row.hexa) || 0) + (Number(row.octa) || 0);
//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{row.month}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.hexa} disabled={row.saved} onChange={(e) => handleChange(i,"hexa",e.target.value)} />
//                       </TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.octa} disabled={row.saved} onChange={(e) => handleChange(i,"octa",e.target.value)} />
//                       </TableCell>
//                       <TableCell>{total}</TableCell>
//                       <TableCell>
//                         {!row.saved ? (
//                           <Button variant="contained" size="small" onClick={() => handleSave(i)}>Save</Button>
//                         ) : (
//                           <Button variant="outlined" size="small" onClick={() => handleEdit(i)}>Edit</Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 2: MACHINE CAPACITY */}
//         {tab === 0 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Stage Capacity Configuration</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Hours/Shift</TableCell>
//                   <TableCell>Shifts/Day</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Minutes/Day</TableCell>
//                   <TableCell>Hours/Month</TableCell>
//                   <TableCell>Mfg Time/Board</TableCell>
//                   <TableCell>Units/Day</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((row, i) => {
//                   const hoursPerDay = (Number(row.hoursPerShift) || 0) * (Number(row.shiftsPerDay) || 0);
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = row.manufacturingTime ? Math.ceil(minutesPerDay / Number(row.manufacturingTime)) : 0;
                  
//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{row.stage}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.hoursPerShift} disabled={row.saved} onChange={(e)=> handleStageChange(i, "hoursPerShift", e.target.value)} />
//                       </TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.shiftsPerDay} disabled={row.saved} onChange={(e)=> handleStageChange(i, "shiftsPerDay", e.target.value)} />
//                       </TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
//                       <TableCell>{minutesPerDay}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.manufacturingTime} disabled={row.saved} onChange={(e)=> handleStageChange(i, "manufacturingTime", e.target.value)} />
//                       </TableCell>
//                       <TableCell>{unitsPerDay}</TableCell>
//                       <TableCell>
//                         {!row.saved ? (
//                           <Button variant="contained" size="small" onClick={() => handleStageSave(i)}>Save</Button>
//                         ) : (
//                           <Button variant="outlined" size="small" onClick={() => handleStageEdit(i)}>Edit</Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 3: UTILIZATION TABLE */}
//         {tab === 2 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Utilisation Analysis</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Sl No</TableCell>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Available Hours</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Days Required</TableCell>
//                   {months.map((m)=>(<TableCell key={m}>{m}</TableCell>))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((stage,i)=>{
//                   const hoursPerDay = stage.hoursPerShift * stage.shiftsPerDay;
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = stage.manufacturingTime ? Math.ceil(minutesPerDay / stage.manufacturingTime) : 0;
//                   const daysRequired = unitsPerDay ? Math.ceil(totalTargetUnits / unitsPerDay) : 0;
//                   console.log("unitsPerDay: ",unitsPerDay," totalTargetUnits: ",totalTargetUnits," ")

//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{i+1}</TableCell>
//                       <TableCell>{stage.stage}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
//                       <TableCell>{daysRequired}</TableCell>
                      
//                       {months.map((m,mi)=>{
//                         const units = (Number(rows[mi]?.hexa)||0) + (Number(rows[mi]?.octa)||0);
//                         const utilisation = calculateUtilisation(units, stage.manufacturingTime, hoursPerMonth);
                        
//                         return (
//                           <TableCell key={mi} sx={{ backgroundColor: utilisation >= UTILIZATION_WARNING ? "#ffcccc" : "inherit" }}>
//                             {utilisation}%
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 4: ADVANCED GRAPHS */}
//         {tab === 3 && (
//           <ProcessUtilizationChart 
//             barData={dynamicBarData} 
//             lineData={dynamicLineData} 
//             ganttData={dynamicGanttData} 
//           />
//         )}

//       </Paper>
//     </Box>
//   );
// }













// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   TextField,
//   Button,
//   Typography
// } from "@mui/material";
// import ProcessUtilizationChart from "./ProcessUtilizationChart";
// import { useSelector } from "react-redux";

// /* =========================================================
// CONFIGURATION SECTION
// ========================================================= */
// const WORKING_DAYS_PER_MONTH = 25;
// const UTILIZATION_WARNING = 75;
// // const API_BASE_URL = "http://127.0.0.1:2001"; // FastAPI backend URL
// const CURRENT_YEAR = 2026; // Setting year for the dropdown label

// const months = [
//   "Jan","Feb","Mar","Apr","May","Jun",
//   "Jul","Aug","Sep","Oct","Nov","Dec"
// ];

// const stages = [
//   "SMT line", "Ionic Contamination", "FPT", "Gap welding", 
//   "ERSA", "Xray", "AOI", "Varnish", "Cleaning", 
//   "Visual Inspection", "ATE 1", "ATE 2"
// ];

// export default function ProductionPlanningDashboard() {

//   const [tab, setTab] = useState(0);
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
//   var API_BASE_URL=""
//   // var API_1 = "/operator/view";
//   // var API_2 = ""
//   if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
//     API_BASE_URL = configDetails.project[0].ServerIP[0].PythonServerIP
//     // opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
//   }

//   /* =========================================================
//   STATE INITIALIZATION (With fallback default values)
//   ========================================================= */
//   const [rows, setRows] = useState(
//     months.map((month) => ({
//       id: null, 
//       month,
//       hexa: 0, 
//       octa: 0,  
//       saved: true
//     }))
//   );

//   const [stageRows, setStageRows] = useState(
//     stages.map((stage) => ({
//       id: null,
//       stage,
//       hoursPerShift: 7, 
//       shiftsPerDay: 2,  
//       manufacturingTime: 45, 
//       saved: true
//     }))
//   );

//   /* =========================================================
//   API FETCH DATA ON LOAD
//   ========================================================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch Stages
//         console.log(API_BASE_URL,"/stages/")
//         const stageRes = await axios.get(`${API_BASE_URL}/stages/`);
//         if (stageRes.data && stageRes.data.length > 0) {
//           const fetchedStages = stages.map(stageName => {
//             const dbStage = stageRes.data.find(s => s.name === stageName);
//             return dbStage ? {
//               id: dbStage.id,
//               stage: dbStage.name,
//               hoursPerShift: dbStage.hours_per_shift,
//               shiftsPerDay: dbStage.shifts_per_day,
//               manufacturingTime: dbStage.manufacturing_time_mins,
//               saved: true
//             } : { id: null, stage: stageName, hoursPerShift: "", shiftsPerDay: "", manufacturingTime: "", saved: false };
//           });
//           setStageRows(fetchedStages);
//         }

//         // Fetch Demands for current year
//         const demandRes = await axios.get(`${API_BASE_URL}/demands/?year=${CURRENT_YEAR}`);
//         console.log("demandres: ",demandRes)
//         // console.log("rows: ",demandRes)
//         if (demandRes.data && demandRes.data.length > 0) {
//           const fetchedDemands = months.map(monthName => {
//             const dbDemand = demandRes.data.find(d => d.month === monthName);
//             return dbDemand ? {
//               id: dbDemand.id,
//               month: dbDemand.month,
//               hexa: dbDemand.hexa_target,
//               octa: dbDemand.octa_target,
//               saved: true
//             } : { id: null, month: monthName, hexa: "", octa: "", saved: false };
//           });
//           setRows(fetchedDemands);

//         }
//       } catch (error) {
//         // console.warn("Backend not running or unreachable, using fallback mock data.");
//       }
//     };
    
//     fetchData();
//   }, []);

//   /* =========================================================
//   DEMAND TABLE INPUT HANDLER & API SAVING
//   ========================================================= */
//   const handleChange = (index, field, value) => {
//     const updated = [...rows];
//     updated[index][field] = value;
//     setRows(updated);
//   };

//   const handleSave = async (index) => {
//     // console.log("handle save")
//     const updated = [...rows];
//     const rowToSave = updated[index];
//     // console.log("handle save")
//     try {
//       const payload = {
//         year: CURRENT_YEAR,
//         month: rowToSave.month,
//         hexa_target: Number(rowToSave.hexa) || 0,
//         octa_target: Number(rowToSave.octa) || 0,
//         total_quantity : (Number(rowToSave.hexa) +Number(rowToSave.octa)) || 0,
        
//       };
//       console.log(payload)

//       if (rowToSave.id) {
//         console.log("am inisde if")
//         await axios.put(`${API_BASE_URL}/demands/${rowToSave.id}`, payload);
//       } else {
//         console.log("payload: ",payload)
//         const res = await axios.post(`${API_BASE_URL}/demands/`, payload);
//         rowToSave.id = res.data.id; 
//       }
//     } catch (error) {
//       // console.error("Failed to save demand to DB:", error);
//     }

//     rowToSave.saved = true;
//     setRows(updated);
//   };

//   const handleEdit = (index) => {
//     const updated = [...rows];
//     updated[index].saved = false;
//     setRows(updated);
//   };

//   /* =========================================================
//   STAGE INPUT HANDLER & API SAVING
//   ========================================================= */
//   const handleStageChange = (index, field, value) => {
//     const updated = [...stageRows];
//     updated[index][field] = value;
//     setStageRows(updated);
//   };

//   const handleStageSave = async (index) => {
//     const updated = [...stageRows];
//     const stageToSave = updated[index];

//     try {
//       const payload = {
//         name: stageToSave.stage,
//         hours_per_shift: Number(stageToSave.hoursPerShift) || 0,
//         shifts_per_day: Number(stageToSave.shiftsPerDay) || 0,
//         manufacturing_time_mins: Number(stageToSave.manufacturingTime) || 0
//       };

//       if (stageToSave.id) {
//         await axios.put(`${API_BASE_URL}/stages/${stageToSave.id}`, payload);
//       } else {
//         const res = await axios.post(`${API_BASE_URL}/stages/`, payload);
//         stageToSave.id = res.data.id;
//       }
//     } catch (error) {
//       // console.error("Failed to save stage to DB:", error);
//     }

//     stageToSave.saved = true;
//     setStageRows(updated);
//   };

//   const handleStageEdit = (index) => {
//     const updated = [...stageRows];
//     updated[index].saved = false;
//     setStageRows(updated);
//   };

//   /* =========================================================
//   CALCULATIONS
//   ========================================================= */
//   const totalTargetUnits = rows.reduce((sum, r) => sum + (Number(r.hexa) || 0) + (Number(r.octa) || 0), 0);

//   const calculateUtilisation = (units, mfgTime, availableHours) => {
    
//     if (!mfgTime || !availableHours) return 0;
//     const demandHours = (units * mfgTime) / 60;
//     const utilisation = (demandHours / availableHours) * 100;
//     // console.log("units: ",units," mfgTime: ",mfgTime," availableHours: ",availableHours," demandHours: ",demandHours," utilisation: ")
//     return Math.ceil(utilisation);
//   };

//   /* =========================================================
//   DYNAMIC CHART DATA GENERATION
//   ========================================================= */
  
//   // 1. Bar Chart Data - Grouped by Month for the Dropdown
//   const dynamicBarDataByMonth = {};
//   months.forEach((m, mi) => {
//     // The target units specific to the current month in the loop
//     const targetUnitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
    
//     dynamicBarDataByMonth[m] = stageRows.map(stage => {
//       const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
      
//       // Maximum capacity for ONE month (25 days)
//       const maxCapacityPerMonth = stage.manufacturingTime 
//         ? Math.floor((hoursPerDay * WORKING_DAYS_PER_MONTH * 60) / Number(stage.manufacturingTime)) 
//         : 0;
      
//       return {
//         process: stage.stage,
//         target: targetUnitsThisMonth,
//         maxCapacity: maxCapacityPerMonth
//       };
//     });
//   });

//   // 2. Line Chart Data (Utilization percentage per month per stage)
//   const dynamicLineData = months.map((m, mi) => {
//     const monthData = { month: m };
//     const unitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
    
//     stageRows.forEach(stage => {
//       const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
//       const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//       monthData[stage.stage] = calculateUtilisation(unitsThisMonth, stage.manufacturingTime, hoursPerMonth);
//     });
//     return monthData;
//   });

//   // 3. Gantt Chart Data (Cumulative time mapping)
//   let currentStartTime = 0;
//   const dynamicGanttData = stageRows.map(stage => {
//     const duration = Number(stage.manufacturingTime) || 0;
//     const startTime = currentStartTime;
//     const endTime = currentStartTime + duration;
//     currentStartTime = endTime; 
    
//     return {
//       process: stage.stage,
//       time: [startTime, endTime],
//       duration: duration
//     };
//   });

//   const calculateUtilisationtable=(hoursPerDay,total_no_of_days_required,hoursPerMonth)=>{
//     console.log("hoursPerDay: ",hoursPerDay, " total_no_of_days_required: ",total_no_of_days_required, " hoursPerMonth: ",hoursPerMonth)

//     return (((hoursPerDay*total_no_of_days_required)/hoursPerMonth)*100)

//   }

//   /* =========================================================
//   RENDER
//   ========================================================= */
//   return (
//     <Box sx={{ width: "100%", p: 3 }}>
//       <Paper elevation={2}>

//         <Tabs value={tab} onChange={(e, v) => setTab(v)}>
//           <Tab label="Stage Capacity"/>
//           <Tab label="Monthly Demand"/>
//           <Tab label="Utilisation Analysis"/>
//           <Tab label="Capacity Graph"/>
//         </Tabs>

//         {/* TAB 1: DEMAND TABLE */}
//         {tab === 1 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Monthly Production Demand</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Month</TableCell>
//                   <TableCell>Hexa</TableCell>
//                   <TableCell>Octa</TableCell>
//                   <TableCell>Total</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rows.map((row, i) => {
//                   const total = (Number(row.hexa) || 0) + (Number(row.octa) || 0);
//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{row.month}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.hexa} disabled={row.saved} onChange={(e) => handleChange(i,"hexa",e.target.value)} />
//                       </TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.octa} disabled={row.saved} onChange={(e) => handleChange(i,"octa",e.target.value)} />
//                       </TableCell>
//                       <TableCell>{total}</TableCell>
//                       <TableCell>
//                         {!row.saved ? (
//                           <Button variant="contained" size="small" onClick={() => handleSave(i)}>Save</Button>
//                         ) : (
//                           <Button variant="outlined" size="small" onClick={() => handleEdit(i)}>Edit</Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 2: MACHINE CAPACITY */}
//         {tab === 0 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Stage Capacity Configuration</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Hours/Shift</TableCell>
//                   <TableCell>Shifts/Day</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Minutes/Day</TableCell>
//                   <TableCell>Hours/Month</TableCell>
//                   <TableCell>Mfg Time/Board</TableCell>
//                   <TableCell>Units/Day</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((row, i) => {
//                   const hoursPerDay = (Number(row.hoursPerShift) || 0) * (Number(row.shiftsPerDay) || 0);
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = row.manufacturingTime ? Math.ceil(minutesPerDay / Number(row.manufacturingTime)) : 0;
                  
//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{row.stage}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.hoursPerShift} disabled={row.saved} onChange={(e)=> handleStageChange(i, "hoursPerShift", e.target.value)} />
//                       </TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.shiftsPerDay} disabled={row.saved} onChange={(e)=> handleStageChange(i, "shiftsPerDay", e.target.value)} />
//                       </TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
//                       <TableCell>{minutesPerDay}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.manufacturingTime} disabled={row.saved} onChange={(e)=> handleStageChange(i, "manufacturingTime", e.target.value)} />
//                       </TableCell>
//                       <TableCell>{unitsPerDay}</TableCell>
//                       <TableCell>
//                         {!row.saved ? (
//                           <Button variant="contained" size="small" onClick={() => handleStageSave(i)}>Save</Button>
//                         ) : (
//                           <Button variant="outlined" size="small" onClick={() => handleStageEdit(i)}>Edit</Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 3: UTILIZATION TABLE */}
//         {/* {tab === 2 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Utilisation Analysis</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Sl No</TableCell>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Available Hours</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Days Required</TableCell>
//                   {months.map((m)=>(<TableCell key={m}>{m}</TableCell>))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((stage,i)=>{
//                   const hoursPerDay = stage.hoursPerShift * stage.shiftsPerDay;
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = stage.manufacturingTime ? Math.ceil(minutesPerDay / stage.manufacturingTime) : 0;
                 
//                   const daysRequired = unitsPerDay ? Math.ceil(totalTargetUnits / unitsPerDay) : 0;
//                    console.log("unitsPerDay: ",unitsPerDay," daysRequired: ",daysRequired," totalTargetUnits: ",totalTargetUnits)

//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{i+1}</TableCell>
//                       <TableCell>{stage.stage}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
//                       <TableCell>{daysRequired}</TableCell>
                      
//                       {months.map((m,mi)=>{
//                         const units = (Number(rows[mi]?.hexa)||0) + (Number(rows[mi]?.octa)||0);
//                         const utilisation = calculateUtilisation(units, stage.manufacturingTime, hoursPerMonth);
                        
//                         return (
//                           <TableCell key={mi} sx={{ backgroundColor: utilisation >= UTILIZATION_WARNING ? "#ffcccc" : "inherit" }}>
//                             {utilisation}%
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )} */}




//         {/* TAB 3: UTILIZATION TABLE */}
//         {tab === 2 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Utilisation Analysis</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Sl No</TableCell>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Available Hours</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   {/* Removed the global "Days Required" column. 
//                       Added sub-headers to the month columns instead! */}
//                   {months.map((m) => (
//                     <TableCell key={m} align="center">
//                       {m} <br/> 
//                       <Typography variant="caption" color="textSecondary">
//                         (Days | Util %)
//                       </Typography>
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((stage, i) => {
//                   // Base machine capacity math
//                   const hoursPerDay = stage.hoursPerShift * stage.shiftsPerDay;
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = stage.manufacturingTime ? Math.ceil(minutesPerDay / stage.manufacturingTime) : 0;

//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{i + 1}</TableCell>
//                       <TableCell>{stage.stage}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
                      
//                       {/* Loop through each month to calculate Days and Util % individually */}
//                       {months.map((m, mi) => {
//                         // 1. Get units for THIS specific month
//                         const unitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
                        
//                         // 2. Calculate Utilization %
//                         // const utilisation = calculateUtilisation(unitsThisMonth, stage.manufacturingTime, hoursPerMonth);
//                          const daysRequiredThisMonth = unitsPerDay && unitsThisMonth 
//                           ? Math.ceil(unitsThisMonth / unitsPerDay) 
//                           : 0;
                        
//                         const utilisation = calculateUtilisationtable(hoursPerDay, daysRequiredThisMonth, hoursPerMonth);
                        
//                         // 3. Calculate Days Required specifically for THIS month
                       
//                         return (
//                           <TableCell 
//                             key={mi} 
//                             align="center"
//                             sx={{ 
//                               backgroundColor: utilisation >= UTILIZATION_WARNING ? "#ffcccc" : "inherit",
//                               borderLeft: "1px solid #e0e0e0" // Adds a subtle divider between months
//                             }}
//                           >
//                             <Typography variant="body2" fontWeight="bold">
//                               {daysRequiredThisMonth} days
//                             </Typography>
//                             <Typography variant="caption">
//                               {Math.round(utilisation)}
//                             </Typography>
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 4: ADVANCED GRAPHS */}
//         {tab === 3 && (
//           <ProcessUtilizationChart 
//             barDataByMonth={dynamicBarDataByMonth} 
//             lineData={dynamicLineData} 
//             ganttData={dynamicGanttData} 
//             months={months}
//             year={CURRENT_YEAR}
//           />
//         )}

//       </Paper>
//     </Box>
//   );
// }import React, { useState, useEffect } from "react";











































import axios from "axios";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
  Typography,
  TableContainer,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  SettingsSuggest as SettingsIcon,
  DateRange as DateRangeIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon
} from "@mui/icons-material";
import ProcessUtilizationChart from "./ProcessUtilizationChart";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";

/* =========================================================
CONFIGURATION SECTION
========================================================= */
const WORKING_DAYS_PER_MONTH = 25;
const UTILIZATION_WARNING = 75;
const CURRENT_YEAR = 2026;

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const stages = [
  "SMT line", "Ionic Contamination", "FPT", "Gap welding",
  "ERSA", "Xray", "AOI", "Varnish", "Cleaning",
  "Visual Inspection", "ATE 1", "ATE 2"
];

export default function ProductionPlanningDashboard() {
  const [tab, setTab] = useState(0);
  const configDetails = useSelector((state) => state.MROTDataSavingReducer.configDetails);
  let API_BASE_URL = "";

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    API_BASE_URL = configDetails.project[0].ServerIP[0].PythonServerIP;
  }

  /* =========================================================
  STATE INITIALIZATION
  ========================================================= */
  const [rows, setRows] = useState(
    months.map((month) => ({
      id: null,
      month,
      hexa: 0,
      octa: 0,
      saved: true
    }))
  );

  const [stageRows, setStageRows] = useState(
    stages.map((stage) => ({
      id: null,
      stage,
      hoursPerShift: 7,
      shiftsPerDay: 2,
      manufacturingTime: 45,
      saved: true
    }))
  );

  /* =========================================================
  API FETCH DATA ON LOAD
  ========================================================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stageRes = await axios.get(`${API_BASE_URL}/stages/`);
        if (stageRes.data && stageRes.data.length > 0) {
          const fetchedStages = stages.map((stageName) => {
            const dbStage = stageRes.data.find((s) => s.name === stageName);
            return dbStage
              ? {
                  id: dbStage.id,
                  stage: dbStage.name,
                  hoursPerShift: dbStage.hours_per_shift,
                  shiftsPerDay: dbStage.shifts_per_day,
                  manufacturingTime: dbStage.manufacturing_time_mins,
                  saved: true
                }
              : { id: null, stage: stageName, hoursPerShift: "", shiftsPerDay: "", manufacturingTime: "", saved: false };
          });
          setStageRows(fetchedStages);
        }

        const demandRes = await axios.get(`${API_BASE_URL}/demands/?year=${CURRENT_YEAR}`);
        if (demandRes.data && demandRes.data.length > 0) {
          const fetchedDemands = months.map((monthName) => {
            const dbDemand = demandRes.data.find((d) => d.month === monthName);
            return dbDemand
              ? {
                  id: dbDemand.id,
                  month: dbDemand.month,
                  hexa: dbDemand.hexa_target,
                  octa: dbDemand.octa_target,
                  saved: true
                }
              : { id: null, month: monthName, hexa: "", octa: "", saved: false };
          });
          setRows(fetchedDemands);
        }
      } catch (error) {
        // Silent catch fallback
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  /* =========================================================
  HANDLERS & CALCULATIONS
  ========================================================= */
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSave = async (index) => {
    const updated = [...rows];
    const rowToSave = updated[index];
    try {
      const payload = {
        year: CURRENT_YEAR,
        month: rowToSave.month,
        hexa_target: Number(rowToSave.hexa) || 0,
        octa_target: Number(rowToSave.octa) || 0,
        total_quantity: (Number(rowToSave.hexa) + Number(rowToSave.octa)) || 0
      };

      if (rowToSave.id) {
        await axios.put(`${API_BASE_URL}/demands/${rowToSave.id}`, payload);
      } else {
        const res = await axios.post(`${API_BASE_URL}/demands/`, payload);
        rowToSave.id = res.data.id;
      }
    } catch (error) {}

    rowToSave.saved = true;
    setRows(updated);
  };

  const handleEdit = (index) => {
    const updated = [...rows];
    updated[index].saved = false;
    setRows(updated);
  };

  const handleStageChange = (index, field, value) => {
    const updated = [...stageRows];
    updated[index][field] = value;
    setStageRows(updated);
  };

  const handleStageSave = async (index) => {
    const updated = [...stageRows];
    const stageToSave = updated[index];

    try {
      const payload = {
        name: stageToSave.stage,
        hours_per_shift: Number(stageToSave.hoursPerShift) || 0,
        shifts_per_day: Number(stageToSave.shiftsPerDay) || 0,
        manufacturing_time_mins: Number(stageToSave.manufacturingTime) || 0
      };

      if (stageToSave.id) {
        await axios.put(`${API_BASE_URL}/stages/${stageToSave.id}`, payload);
      } else {
        const res = await axios.post(`${API_BASE_URL}/stages/`, payload);
        stageToSave.id = res.data.id;
      }
    } catch (error) {}

    stageToSave.saved = true;
    setStageRows(updated);
  };

  const handleStageEdit = (index) => {
    const updated = [...stageRows];
    updated[index].saved = false;
    setStageRows(updated);
  };

  const totalTargetUnits = rows.reduce((sum, r) => sum + (Number(r.hexa) || 0) + (Number(r.octa) || 0), 0);

  const calculateUtilisation = (units, mfgTime, availableHours) => {
    if (!mfgTime || !availableHours) return 0;
    const demandHours = (units * mfgTime) / 60;
    const utilisation = (demandHours / availableHours) * 100;
    return Math.ceil(utilisation);
  };

  const calculateUtilisationtable = (hoursPerDay, total_no_of_days_required, hoursPerMonth) => {
    return (((hoursPerDay * total_no_of_days_required) / hoursPerMonth) * 100);
  };

  /* =========================================================
  DYNAMIC CHART DATA GENERATION
  ========================================================= */
  const dynamicBarDataByMonth = {};
  months.forEach((m, mi) => {
    const targetUnitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
    dynamicBarDataByMonth[m] = stageRows.map(stage => {
      const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
      const maxCapacityPerMonth = stage.manufacturingTime
        ? Math.floor((hoursPerDay * WORKING_DAYS_PER_MONTH * 60) / Number(stage.manufacturingTime))
        : 0;
      return {
        process: stage.stage,
        target: targetUnitsThisMonth,
        maxCapacity: maxCapacityPerMonth
      };
    });
  });

  const dynamicLineData = months.map((m, mi) => {
    const monthData = { month: m };
    const unitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
    stageRows.forEach(stage => {
      const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
      const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
      monthData[stage.stage] = calculateUtilisation(unitsThisMonth, stage.manufacturingTime, hoursPerMonth);
    });
    return monthData;
  });

  let currentStartTime = 0;
  const dynamicGanttData = stageRows.map(stage => {
    const duration = Number(stage.manufacturingTime) || 0;
    const startTime = currentStartTime;
    const endTime = currentStartTime + duration;
    currentStartTime = endTime;
    return {
      process: stage.stage,
      time: [startTime, endTime],
      duration: duration
    };
  });

  /* =========================================================
  UI STYLING CONFIGURATIONS
  ========================================================= */
  const tableHeaderStyle = {
    backgroundColor: "#f4f6f8",
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    fontSize: "0.85rem"
  };

  /* =========================================================
  RENDER
  ========================================================= */
  return (
    <Box sx={{ width: "100%", maxWidth: "1400px", margin: "0 auto", p: { xs: 2, md: 4 } }}>
      
     

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Styled Tabs */}
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fafafa" }}
        >
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Stage Capacity" sx={{ fontWeight: 600 }} />
          <Tab icon={<DateRangeIcon />} iconPosition="start" label="Monthly Demand" sx={{ fontWeight: 600 }} />
          <Tab icon={<AssessmentIcon />} iconPosition="start" label="Utilisation Analysis" sx={{ fontWeight: 600 }} />
          <Tab icon={<BarChartIcon />} iconPosition="start" label="Capacity Graph" sx={{ fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 3, bgcolor: "#ffffff" }}>
          
          {/* TAB 0: MACHINE CAPACITY */}
          {tab === 0 && (
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                  Stage Capacity Configuration
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table size="small" hover>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderStyle}>Stage</TableCell>
                        <TableCell sx={tableHeaderStyle}>Hours/Shift</TableCell>
                        <TableCell sx={tableHeaderStyle}>Shifts/Day</TableCell>
                        <TableCell sx={tableHeaderStyle}>Hours/Day</TableCell>
                        <TableCell sx={tableHeaderStyle}>Minutes/Day</TableCell>
                        <TableCell sx={tableHeaderStyle}>Hours/Month</TableCell>
                        <TableCell sx={tableHeaderStyle}>Mfg Time/Board (m)</TableCell>
                        <TableCell sx={tableHeaderStyle}>Units/Day</TableCell>
                        <TableCell sx={tableHeaderStyle} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stageRows.map((row, i) => {
                        const hoursPerDay = (Number(row.hoursPerShift) || 0) * (Number(row.shiftsPerDay) || 0);
                        const minutesPerDay = hoursPerDay * 60;
                        const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
                        const unitsPerDay = row.manufacturingTime ? Math.ceil(minutesPerDay / Number(row.manufacturingTime)) : 0;

                        return (
                          <TableRow key={i} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>{row.stage}</TableCell>
                            <TableCell>
                              <TextField size="small" variant={row.saved ? "standard" : "outlined"} type="number" value={row.hoursPerShift} disabled={row.saved} onChange={(e) => handleStageChange(i, "hoursPerShift", e.target.value)} InputProps={{ disableUnderline: row.saved }} sx={{ width: "80px" }} />
                            </TableCell>
                            <TableCell>
                              <TextField size="small" variant={row.saved ? "standard" : "outlined"} type="number" value={row.shiftsPerDay} disabled={row.saved} onChange={(e) => handleStageChange(i, "shiftsPerDay", e.target.value)} InputProps={{ disableUnderline: row.saved }} sx={{ width: "80px" }} />
                            </TableCell>
                            <TableCell>{hoursPerDay}</TableCell>
                            <TableCell>{minutesPerDay}</TableCell>
                            <TableCell>{hoursPerMonth}</TableCell>
                            <TableCell>
                              <TextField size="small" variant={row.saved ? "standard" : "outlined"} type="number" value={row.manufacturingTime} disabled={row.saved} onChange={(e) => handleStageChange(i, "manufacturingTime", e.target.value)} InputProps={{ disableUnderline: row.saved }} sx={{ width: "80px" }} />
                            </TableCell>
                            <TableCell>{unitsPerDay}</TableCell>
                            <TableCell align="center">
                              {!row.saved ? (
                                <Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={() => handleStageSave(i)} disableElevation>Save</Button>
                              ) : (
                                <Button variant="outlined" color="secondary" size="small" startIcon={<EditIcon />} onClick={() => handleStageEdit(i)}>Edit</Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* TAB 1: DEMAND TABLE */}
          {tab === 1 && (
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                  Monthly Production Demand
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderStyle}>Month</TableCell>
                        <TableCell sx={tableHeaderStyle}>Hexa Target</TableCell>
                        <TableCell sx={tableHeaderStyle}>Octa Target</TableCell>
                        <TableCell sx={tableHeaderStyle}>Total Target</TableCell>
                        <TableCell sx={tableHeaderStyle} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, i) => {
                        const total = (Number(row.hexa) || 0) + (Number(row.octa) || 0);
                        return (
                          <TableRow key={i} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell sx={{ fontWeight: 500 }}>{row.month}</TableCell>
                            <TableCell>
                              <TextField size="small" variant={row.saved ? "standard" : "outlined"} type="number" value={row.hexa} disabled={row.saved} onChange={(e) => handleChange(i, "hexa", e.target.value)} InputProps={{ disableUnderline: row.saved }} sx={{ width: "100px" }} />
                            </TableCell>
                            <TableCell>
                              <TextField size="small" variant={row.saved ? "standard" : "outlined"} type="number" value={row.octa} disabled={row.saved} onChange={(e) => handleChange(i, "octa", e.target.value)} InputProps={{ disableUnderline: row.saved }} sx={{ width: "100px" }} />
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>{total}</TableCell>
                            <TableCell align="center">
                              {!row.saved ? (
                                <Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={() => handleSave(i)} disableElevation>Save</Button>
                              ) : (
                                <Button variant="outlined" color="secondary" size="small" startIcon={<EditIcon />} onClick={() => handleEdit(i)}>Edit</Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: UTILIZATION TABLE */}
          {tab === 2 && (
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                  Utilisation Analysis
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer sx={{ maxHeight: '600px' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ ...tableHeaderStyle, minWidth: '40px' }}>No.</TableCell>
                        <TableCell sx={{ ...tableHeaderStyle, minWidth: '150px' }}>Stage</TableCell>
                        <TableCell sx={tableHeaderStyle}>Avail Hours</TableCell>
                        <TableCell sx={tableHeaderStyle}>Hours/Day</TableCell>
                        {months.map((m) => (
                          <TableCell key={m} align="center" sx={{ ...tableHeaderStyle, borderLeft: "1px solid #e0e0e0" }}>
                            {m} <br />
                            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "normal", fontSize: '0.7rem' }}>
                              (Days | Util %)
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stageRows.map((stage, i) => {
                        const hoursPerDay = stage.hoursPerShift * stage.shiftsPerDay;
                        const minutesPerDay = hoursPerDay * 60;
                        const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
                        const unitsPerDay = stage.manufacturingTime ? Math.ceil(minutesPerDay / stage.manufacturingTime) : 0;

                        return (
                          <TableRow key={i} hover>
                            <TableCell >{i + 1}</TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{stage.stage}</TableCell>
                            <TableCell>{hoursPerMonth}</TableCell>
                            <TableCell>{hoursPerDay}</TableCell>

                            {months.map((m, mi) => {
                              const unitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
                              const daysRequiredThisMonth = unitsPerDay && unitsThisMonth
                                ? Math.ceil(unitsThisMonth / unitsPerDay)
                                : 0;

                              const utilisation = calculateUtilisationtable(hoursPerDay, daysRequiredThisMonth, hoursPerMonth);
                              const isWarning = utilisation >= UTILIZATION_WARNING;

                              return (
                                <TableCell
                                  key={mi}
                                  align="center"
                                  sx={{
                                    backgroundColor: isWarning ? "error.light" : "inherit",
                                    color: isWarning ? "error.contrastText" : "inherit",
                                    borderLeft: "1px solid #eeeeee",
                                    transition: "background-color 0.2s"
                                  }}
                                >
                                  <Typography variant="body2" sx={{ fontWeight: isWarning ? "bold" : 500 }}>
                                    {daysRequiredThisMonth} d
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {Math.round(utilisation)}%
                                  </Typography>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: ADVANCED GRAPHS */}
          {tab === 3 && (
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                  Capacity & Utilization Overview
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <ProcessUtilizationChart
                  barDataByMonth={dynamicBarDataByMonth}
                  lineData={dynamicLineData}
                  ganttData={dynamicGanttData}
                  months={months}
                  year={CURRENT_YEAR}
                />
              </CardContent>
            </Card>
          )}
        </Box>
      </Paper>
    </Box>
  );
}





































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   TextField,
//   Button,
//   Typography
// } from "@mui/material";
// import ProcessUtilizationChart from "./ProcessUtilizationChart";
// import { useSelector } from "react-redux";

// /* =========================================================
// CONFIGURATION SECTION
// ========================================================= */
// const WORKING_DAYS_PER_MONTH = 25;
// const UTILIZATION_WARNING = 75;
// // const API_BASE_URL = "http://127.0.0.1:2001"; // FastAPI backend URL
// const CURRENT_YEAR = 2026; // Setting year for the dropdown label

// const months = [
//   "Jan","Feb","Mar","Apr","May","Jun",
//   "Jul","Aug","Sep","Oct","Nov","Dec"
// ];

// const stages = [
//   "SMT line", "Ionic Contamination", "FPT", "Gap welding", 
//   "ERSA", "Xray", "AOI", "Varnish", "Cleaning", 
//   "Visual Inspection", "ATE 1", "ATE 2"
// ];

// export default function ProductionPlanningDashboard() {

//   const [tab, setTab] = useState(0);
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
//   var API_BASE_URL=""
//   // var API_1 = "/operator/view";
//   // var API_2 = ""
//   if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
//     API_BASE_URL = configDetails.project[0].ServerIP[0].PythonServerIP
//     // opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
//   }

//   /* =========================================================
//   STATE INITIALIZATION (With fallback default values)
//   ========================================================= */
//   const [rows, setRows] = useState(
//     months.map((month) => ({
//       id: null, 
//       month,
//       hexa: 0, 
//       octa: 0,  
//       saved: true
//     }))
//   );

//   const [stageRows, setStageRows] = useState(
//     stages.map((stage) => ({
//       id: null,
//       stage,
//       hoursPerShift: 7, 
//       shiftsPerDay: 2,  
//       manufacturingTime: 45, 
//       saved: true
//     }))
//   );

//   /* =========================================================
//   API FETCH DATA ON LOAD
//   ========================================================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch Stages
//         console.log(API_BASE_URL,"/stages/")
//         const stageRes = await axios.get(`${API_BASE_URL}/stages/`);
//         if (stageRes.data && stageRes.data.length > 0) {
//           const fetchedStages = stages.map(stageName => {
//             const dbStage = stageRes.data.find(s => s.name === stageName);
//             return dbStage ? {
//               id: dbStage.id,
//               stage: dbStage.name,
//               hoursPerShift: dbStage.hours_per_shift,
//               shiftsPerDay: dbStage.shifts_per_day,
//               manufacturingTime: dbStage.manufacturing_time_mins,
//               saved: true
//             } : { id: null, stage: stageName, hoursPerShift: "", shiftsPerDay: "", manufacturingTime: "", saved: false };
//           });
//           setStageRows(fetchedStages);
//         }

//         // Fetch Demands for current year
//         const demandRes = await axios.get(`${API_BASE_URL}/demands/?year=${CURRENT_YEAR}`);
//         console.log("demandres: ",demandRes)
//         // console.log("rows: ",demandRes)
//         if (demandRes.data && demandRes.data.length > 0) {
//           const fetchedDemands = months.map(monthName => {
//             const dbDemand = demandRes.data.find(d => d.month === monthName);
//             return dbDemand ? {
//               id: dbDemand.id,
//               month: dbDemand.month,
//               hexa: dbDemand.hexa_target,
//               octa: dbDemand.octa_target,
//               saved: true
//             } : { id: null, month: monthName, hexa: "", octa: "", saved: false };
//           });
//           setRows(fetchedDemands);

//         }
//       } catch (error) {
//         // console.warn("Backend not running or unreachable, using fallback mock data.");
//       }
//     };
    
//     fetchData();
//   }, []);

//   /* =========================================================
//   DEMAND TABLE INPUT HANDLER & API SAVING
//   ========================================================= */
//   const handleChange = (index, field, value) => {
//     const updated = [...rows];
//     updated[index][field] = value;
//     setRows(updated);
//   };

//   const handleSave = async (index) => {
//     // console.log("handle save")
//     const updated = [...rows];
//     const rowToSave = updated[index];
//     // console.log("handle save")
//     try {
//       const payload = {
//         year: CURRENT_YEAR,
//         month: rowToSave.month,
//         hexa_target: Number(rowToSave.hexa) || 0,
//         octa_target: Number(rowToSave.octa) || 0,
//         total_quantity : (Number(rowToSave.hexa) +Number(rowToSave.octa)) || 0,
        
//       };
//       console.log(payload)

//       if (rowToSave.id) {
//         console.log("am inisde if")
//         await axios.put(`${API_BASE_URL}/demands/${rowToSave.id}`, payload);
//       } else {
//         // console.log("payload: ",payload)
//         // console.log("payload: ",payload)
//         const res = await axios.post(`${API_BASE_URL}/demands/`, payload);
//         rowToSave.id = res.data.id; 
//       }
//     } catch (error) {
//       // console.error("Failed to save demand to DB:", error);
//     }

//     rowToSave.saved = true;
//     setRows(updated);
//   };

//   const handleEdit = (index) => {
//     const updated = [...rows];
//     updated[index].saved = false;
//     setRows(updated);
//   };

//   /* =========================================================
//   STAGE INPUT HANDLER & API SAVING
//   ========================================================= */
//   const handleStageChange = (index, field, value) => {
//     const updated = [...stageRows];
//     updated[index][field] = value;
//     setStageRows(updated);
//   };

//   const handleStageSave = async (index) => {
//     const updated = [...stageRows];
//     const stageToSave = updated[index];

//     try {
//       const payload = {
//         name: stageToSave.stage,
//         hours_per_shift: Number(stageToSave.hoursPerShift) || 0,
//         shifts_per_day: Number(stageToSave.shiftsPerDay) || 0,
//         manufacturing_time_mins: Number(stageToSave.manufacturingTime) || 0
//       };

//       if (stageToSave.id) {
//         await axios.put(`${API_BASE_URL}/stages/${stageToSave.id}`, payload);
//       } else {
//         const res = await axios.post(`${API_BASE_URL}/stages/`, payload);
//         stageToSave.id = res.data.id;
//       }
//     } catch (error) {
//       // console.error("Failed to save stage to DB:", error);
//     }

//     stageToSave.saved = true;
//     setStageRows(updated);
//   };

//   const handleStageEdit = (index) => {
//     const updated = [...stageRows];
//     updated[index].saved = false;
//     setStageRows(updated);
//   };

//   /* =========================================================
//   CALCULATIONS
//   ========================================================= */
//   const totalTargetUnits = rows.reduce((sum, r) => sum + (Number(r.hexa) || 0) + (Number(r.octa) || 0), 0);

//   const calculateUtilisation = (units, mfgTime, availableHours) => {
    
//     if (!mfgTime || !availableHours) return 0;
//     const demandHours = (units * mfgTime) / 60;
//     const utilisation = (demandHours / availableHours) * 100;
//     // console.log("units: ",units," mfgTime: ",mfgTime," availableHours: ",availableHours," demandHours: ",demandHours," utilisation: ")
//     return Math.ceil(utilisation);
//   };

//   /* =========================================================
//   DYNAMIC CHART DATA GENERATION
//   ========================================================= */
  
//   // 1. Bar Chart Data - Grouped by Month for the Dropdown
//   const dynamicBarDataByMonth = {};
//   months.forEach((m, mi) => {
//     // The target units specific to the current month in the loop
//     const targetUnitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
    
//     dynamicBarDataByMonth[m] = stageRows.map(stage => {
//       const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
      
//       // Maximum capacity for ONE month (25 days)
//       const maxCapacityPerMonth = stage.manufacturingTime 
//         ? Math.floor((hoursPerDay * WORKING_DAYS_PER_MONTH * 60) / Number(stage.manufacturingTime)) 
//         : 0;
      
//       return {
//         process: stage.stage,
//         target: targetUnitsThisMonth,
//         maxCapacity: maxCapacityPerMonth
//       };
//     });
//   });

//   // 2. Line Chart Data (Utilization percentage per month per stage)
//   const dynamicLineData = months.map((m, mi) => {
//     const monthData = { month: m };
//     const unitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
    
//     stageRows.forEach(stage => {
//       const hoursPerDay = (Number(stage.hoursPerShift) || 0) * (Number(stage.shiftsPerDay) || 0);
//       const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//       monthData[stage.stage] = calculateUtilisation(unitsThisMonth, stage.manufacturingTime, hoursPerMonth);
//     });
//     return monthData;
//   });

//   // 3. Gantt Chart Data (Cumulative time mapping)
//   let currentStartTime = 0;
//   const dynamicGanttData = stageRows.map(stage => {
//     const duration = Number(stage.manufacturingTime) || 0;
//     const startTime = currentStartTime;
//     const endTime = currentStartTime + duration;
//     currentStartTime = endTime; 
    
//     return {
//       process: stage.stage,
//       time: [startTime, endTime],
//       duration: duration
//     };
//   });

//   const calculateUtilisationtable=(hoursPerDay,total_no_of_days_required,hoursPerMonth)=>{
//     console.log("hoursPerDay: ",hoursPerDay, " total_no_of_days_required: ",total_no_of_days_required, " hoursPerMonth: ",hoursPerMonth)

//     return (((hoursPerDay*total_no_of_days_required)/hoursPerMonth)*100)

//   }

//   /* =========================================================
//   RENDER
//   ========================================================= */
//   return (
//     <Box sx={{ width: "100%", p: 3 }}>
//       <Paper elevation={2}>

//         <Tabs value={tab} onChange={(e, v) => setTab(v)}>
//           <Tab label="Stage Capacity"/>
//           <Tab label="Monthly Demand"/>
//           <Tab label="Utilisation Analysis"/>
//           <Tab label="Capacity Graph"/>
//         </Tabs>

//         {/* TAB 1: DEMAND TABLE */}
//         {tab === 1 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Monthly Production Demand</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Month</TableCell>
//                   <TableCell>Hexa</TableCell>
//                   <TableCell>Octa</TableCell>
//                   <TableCell>Total</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rows.map((row, i) => {
//                   const total = (Number(row.hexa) || 0) + (Number(row.octa) || 0);
//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{row.month}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.hexa} disabled={row.saved} onChange={(e) => handleChange(i,"hexa",e.target.value)} />
//                       </TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.octa} disabled={row.saved} onChange={(e) => handleChange(i,"octa",e.target.value)} />
//                       </TableCell>
//                       <TableCell>{total}</TableCell>
//                       <TableCell>
//                         {!row.saved ? (
//                           <Button variant="contained" size="small" onClick={() => handleSave(i)}>Save</Button>
//                         ) : (
//                           <Button variant="outlined" size="small" onClick={() => handleEdit(i)}>Edit</Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 2: MACHINE CAPACITY */}
//         {tab === 0 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Stage Capacity Configuration</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Hours/Shift</TableCell>
//                   <TableCell>Shifts/Day</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Minutes/Day</TableCell>
//                   <TableCell>Hours/Month</TableCell>
//                   <TableCell>Mfg Time/Board</TableCell>
//                   <TableCell>Units/Day</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((row, i) => {
//                   const hoursPerDay = (Number(row.hoursPerShift) || 0) * (Number(row.shiftsPerDay) || 0);
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = row.manufacturingTime ? Math.ceil(minutesPerDay / Number(row.manufacturingTime)) : 0;
                  
//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{row.stage}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.hoursPerShift} disabled={row.saved} onChange={(e)=> handleStageChange(i, "hoursPerShift", e.target.value)} />
//                       </TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.shiftsPerDay} disabled={row.saved} onChange={(e)=> handleStageChange(i, "shiftsPerDay", e.target.value)} />
//                       </TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
//                       <TableCell>{minutesPerDay}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>
//                         <TextField size="small" type="number" value={row.manufacturingTime} disabled={row.saved} onChange={(e)=> handleStageChange(i, "manufacturingTime", e.target.value)} />
//                       </TableCell>
//                       <TableCell>{unitsPerDay}</TableCell>
//                       <TableCell>
//                         {!row.saved ? (
//                           <Button variant="contained" size="small" onClick={() => handleStageSave(i)}>Save</Button>
//                         ) : (
//                           <Button variant="outlined" size="small" onClick={() => handleStageEdit(i)}>Edit</Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 3: UTILIZATION TABLE */}
//         {/* {tab === 2 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Utilisation Analysis</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Sl No</TableCell>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Available Hours</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   <TableCell>Days Required</TableCell>
//                   {months.map((m)=>(<TableCell key={m}>{m}</TableCell>))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((stage,i)=>{
//                   const hoursPerDay = stage.hoursPerShift * stage.shiftsPerDay;
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = stage.manufacturingTime ? Math.ceil(minutesPerDay / stage.manufacturingTime) : 0;
                 
//                   const daysRequired = unitsPerDay ? Math.ceil(totalTargetUnits / unitsPerDay) : 0;
//                    console.log("unitsPerDay: ",unitsPerDay," daysRequired: ",daysRequired," totalTargetUnits: ",totalTargetUnits)

//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{i+1}</TableCell>
//                       <TableCell>{stage.stage}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
//                       <TableCell>{daysRequired}</TableCell>
                      
//                       {months.map((m,mi)=>{
//                         const units = (Number(rows[mi]?.hexa)||0) + (Number(rows[mi]?.octa)||0);
//                         const utilisation = calculateUtilisation(units, stage.manufacturingTime, hoursPerMonth);
                        
//                         return (
//                           <TableCell key={mi} sx={{ backgroundColor: utilisation >= UTILIZATION_WARNING ? "#ffcccc" : "inherit" }}>
//                             {utilisation}%
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )} */}




//         {/* TAB 3: UTILIZATION TABLE */}
//         {tab === 2 && (
//           <Box sx={{ p: 3 }}>
//             <Typography variant="h6">Utilisation Analysis</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Sl No</TableCell>
//                   <TableCell>Stage</TableCell>
//                   <TableCell>Available Hours</TableCell>
//                   <TableCell>Hours/Day</TableCell>
//                   {/* Removed the global "Days Required" column. 
//                       Added sub-headers to the month columns instead! */}
//                   {months.map((m) => (
//                     <TableCell key={m} align="center">
//                       {m} <br/> 
//                       <Typography variant="caption" color="textSecondary">
//                         (Days | Util %)
//                       </Typography>
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stageRows.map((stage, i) => {
//                   // Base machine capacity math
//                   const hoursPerDay = stage.hoursPerShift * stage.shiftsPerDay;
//                   const minutesPerDay = hoursPerDay * 60;
//                   const hoursPerMonth = hoursPerDay * WORKING_DAYS_PER_MONTH;
//                   const unitsPerDay = stage.manufacturingTime ? Math.ceil(minutesPerDay / stage.manufacturingTime) : 0;

//                   return (
//                     <TableRow key={i}>
//                       <TableCell>{i + 1}</TableCell>
//                       <TableCell>{stage.stage}</TableCell>
//                       <TableCell>{hoursPerMonth}</TableCell>
//                       <TableCell>{hoursPerDay}</TableCell>
                      
//                       {/* Loop through each month to calculate Days and Util % individually */}
//                       {months.map((m, mi) => {
//                         // 1. Get units for THIS specific month
//                         const unitsThisMonth = (Number(rows[mi]?.hexa) || 0) + (Number(rows[mi]?.octa) || 0);
                        
//                         // 2. Calculate Utilization %
//                         // const utilisation = calculateUtilisation(unitsThisMonth, stage.manufacturingTime, hoursPerMonth);
//                          const daysRequiredThisMonth = unitsPerDay && unitsThisMonth 
//                           ? Math.ceil(unitsThisMonth / unitsPerDay) 
//                           : 0;
                        
//                         const utilisation = calculateUtilisationtable(hoursPerDay, daysRequiredThisMonth, hoursPerMonth);
                        
//                         // 3. Calculate Days Required specifically for THIS month
                       
//                         return (
//                           <TableCell 
//                             key={mi} 
//                             align="center"
//                             sx={{ 
//                               backgroundColor: utilisation >= UTILIZATION_WARNING ? "#ffcccc" : "inherit",
//                               borderLeft: "1px solid #e0e0e0" // Adds a subtle divider between months
//                             }}
//                           >
//                             <Typography variant="body2" fontWeight="bold">
//                               {daysRequiredThisMonth} days
//                             </Typography>
//                             <Typography variant="caption">
//                               {Math.round(utilisation)}
//                             </Typography>
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         )}

//         {/* TAB 4: ADVANCED GRAPHS */}
//         {tab === 3 && (
//           <ProcessUtilizationChart 
//             barDataByMonth={dynamicBarDataByMonth} 
//             lineData={dynamicLineData} 
//             ganttData={dynamicGanttData} 
//             months={months}
//             year={CURRENT_YEAR}
//           />
//         )}

//       </Paper>
//     </Box>
//   );
// }