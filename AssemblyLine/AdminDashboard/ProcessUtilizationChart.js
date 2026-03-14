// import React, { useState } from "react";
// import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   ReferenceLine
// } from "recharts";

// /* =========================================================
//    MOCK DATA 1: Target vs Capacity (Horizontal Bar Chart)
//    ========================================================= */
// const mockBarData = [
//   { process: "SMT line", target: 1000, maxCapacity: 1500 },
//   { process: "Ionic Cont.", target: 1000, maxCapacity: 2100 },
//   { process: "FPT", target: 1000, maxCapacity: 1200 },
//   { process: "Gap welding", target: 1000, maxCapacity: 1400 },
//   { process: "ERSA", target: 1000, maxCapacity: 1800 },
//   { process: "Xray", target: 1000, maxCapacity: 1100 },
//   { process: "AOI", target: 1000, maxCapacity: 1300 },
//   { process: "Varnish", target: 1000, maxCapacity: 1600 },
//   { process: "Cleaning", target: 1000, maxCapacity: 2000 },
//   { process: "Visual Insp.", target: 1000, maxCapacity: 1900 },
//   { process: "ATE 1", target: 1000, maxCapacity: 1050 },
//   { process: "ATE 2", target: 1000, maxCapacity: 950 } // Intentional bottleneck for demo
// ];

// /* =========================================================
//    MOCK DATA 2: Utilization Over Time (Line Chart)
//    ========================================================= */
// const mockLineData = [
//   { month: "Jan", "SMT line": 45, "ATE 2": 60, "Gap welding": 30 },
//   { month: "Feb", "SMT line": 50, "ATE 2": 65, "Gap welding": 35 },
//   { month: "Mar", "SMT line": 55, "ATE 2": 75, "Gap welding": 40 },
//   { month: "Apr", "SMT line": 60, "ATE 2": 82, "Gap welding": 45 },
//   { month: "May", "SMT line": 65, "ATE 2": 88, "Gap welding": 50 },
//   { month: "Jun", "SMT line": 70, "ATE 2": 95, "Gap welding": 55 },
//   { month: "Jul", "SMT line": 75, "ATE 2": 90, "Gap welding": 60 },
//   { month: "Aug", "SMT line": 80, "ATE 2": 85, "Gap welding": 65 },
//   { month: "Sep", "SMT line": 78, "ATE 2": 80, "Gap welding": 62 },
//   { month: "Oct", "SMT line": 85, "ATE 2": 78, "Gap welding": 68 },
//   { month: "Nov", "SMT line": 82, "ATE 2": 75, "Gap welding": 65 },
//   { month: "Dec", "SMT line": 70, "ATE 2": 65, "Gap welding": 55 },
// ];

// /* =========================================================
//    MOCK DATA 3: Production Timeline (Gantt Chart)
//    The 'time' array represents [startMinute, endMinute].
//    ========================================================= */
// const mockGanttData = [
//   { process: "SMT line", time: [0, 65], duration: 65 },
//   { process: "Ionic Cont.", time: [65, 85], duration: 20 },
//   { process: "FPT", time: [85, 130], duration: 45 },
//   { process: "Gap welding", time: [130, 190], duration: 60 },
//   { process: "ERSA", time: [190, 220], duration: 30 },
//   { process: "Xray", time: [220, 250], duration: 30 },
//   { process: "AOI", time: [250, 280], duration: 30 },
//   { process: "Varnish", time: [280, 310], duration: 30 },
//   { process: "ATE 1", time: [310, 355], duration: 45 },
//   { process: "ATE 2", time: [355, 475], duration: 120 }
// ];

// /* =========================================================
//    CUSTOM TOOLTIP FOR GANTT CHART
//    Displays duration cleanly instead of the raw array
//    ========================================================= */
// const GanttTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <Box sx={{ bgcolor: "white", p: 1.5, border: "1px solid #ccc", borderRadius: 1 }}>
//         <Typography variant="subtitle2" fontWeight="bold">{data.process}</Typography>
//         <Typography variant="body2" color="textSecondary">Start: {data.time[0]} min</Typography>
//         <Typography variant="body2" color="textSecondary">End: {data.time[1]} min</Typography>
//         <Typography variant="body2" color="primary" fontWeight="bold">
//           Duration: {data.duration} min
//         </Typography>
//       </Box>
//     );
//   }
//   return null;
// };

// /* =========================================================
//    MAIN COMPONENT
//    ========================================================= */
// export default function ProcessUtilizationChart() {
//   // Local state to manage the sub-tabs within this component
//   const [subTab, setSubTab] = useState(0);

//   return (
//     <Box sx={{ width: "100%", mt: 3 }}>
//       <Paper elevation={3} sx={{ p: 3 }}>
        
//         {/* Component Header and Sub-Tabs */}
//         <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
//           <Typography variant="h6" sx={{ mb: 1 }}>
//             Advanced Process Analytics
//           </Typography>
//           <Tabs 
//             value={subTab} 
//             onChange={(e, newValue) => setSubTab(newValue)}
//             textColor="primary"
//             indicatorColor="primary"
//           >
//             <Tab label="Target vs Capacity" />
//             <Tab label="Utilization Trends" />
//             <Tab label="Production Timeline" />
//           </Tabs>
//         </Box>

//         {/* Dynamic Chart Container - Fixed height ensures UI stability */}
//         <Box sx={{ height: 500, width: "100%" }}>
          
//           {/* ---------------------------------------------------
//               SUB-TAB 0: TARGET VS CAPACITY (Horizontal Bar)
//               --------------------------------------------------- */}
//           {subTab === 0 && (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 layout="vertical"
//                 data={mockBarData}
//                 margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="process" type="category" width={100} tick={{ fontSize: 12 }} />
//                 <Tooltip cursor={{ fill: "#f5f5f5" }} />
//                 <Legend />
//                 <Bar dataKey="target" name="Target Quantity" fill="#1976d2" barSize={15} />
//                 <Bar dataKey="maxCapacity" name="Max PCBs Built" fill="#ed6c02" barSize={15} />
//               </BarChart>
//             </ResponsiveContainer>
//           )}

//           {/* ---------------------------------------------------
//               SUB-TAB 1: UTILIZATION TRENDS (Line Chart)
//               --------------------------------------------------- */}
//           {subTab === 1 && (
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={mockLineData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis label={{ value: "Utilization %", angle: -90, position: "insideLeft" }} />
//                 <Tooltip />
//                 <Legend verticalAlign="top" height={36} />
//                 <ReferenceLine y={75} label="Warning (75%)" stroke="red" strokeDasharray="3 3" />
                
//                 <Line type="monotone" dataKey="SMT line" stroke="#1976d2" strokeWidth={3} activeDot={{ r: 8 }} />
//                 <Line type="monotone" dataKey="ATE 2" stroke="#ed6c02" strokeWidth={3} />
//                 <Line type="monotone" dataKey="Gap welding" stroke="#2e7d32" strokeWidth={3} />
//                  <Line type="monotone" dataKey="Gap welding" stroke="#2e7d32" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           )}

//           {/* ---------------------------------------------------
//               SUB-TAB 2: PRODUCTION TIMELINE (Gantt Chart)
//               --------------------------------------------------- */}
//           {subTab === 2 && (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 layout="vertical"
//                 data={mockGanttData}
//                 margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis 
//                   type="number" 
//                   label={{ value: "Minutes", position: "insideBottom", offset: -10 }} 
//                 />
//                 <YAxis dataKey="process" type="category" tick={{ fontSize: 12 }} />
//                 <Tooltip content={<GanttTooltip />} cursor={{ fill: "transparent" }} />
                
//                 {/* Passing the 'time' array [start, end] to dataKey automatically 
//                   renders it as a range bar in Recharts 
//                 */}
//                 <Bar dataKey="time" fill="#9c27b0" barSize={20} radius={[4, 4, 4, 4]} />
//               </BarChart>
//             </ResponsiveContainer>
//           )}

//         </Box>
//       </Paper>
//     </Box>
//   );
// }












import {
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  ViewTimeline as ViewTimelineIcon
} from "@mui/icons-material";

import React, { useState } from "react";
import { 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

/* =========================================================
   CUSTOM TOOLTIP FOR GANTT CHART
   Displays duration cleanly instead of the raw array
   ========================================================= */
const GanttTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box sx={{ bgcolor: "white", p: 1.5, border: "1px solid #ccc", borderRadius: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">{data.process}</Typography>
        <Typography variant="body2" color="textSecondary">Start: {data.time[0]} min</Typography>
        <Typography variant="body2" color="textSecondary">End: {data.time[1]} min</Typography>
        <Typography variant="body2" color="primary" fontWeight="bold">
          Duration: {data.duration} min
        </Typography>
      </Box>
    );
  }
  return null;
};

/* =========================================================
   MAIN COMPONENT
   Receives dynamic data props from ProductionPlanner.js
   ========================================================= */
export default function ProcessUtilizationChart({ barDataByMonth, lineData, ganttData, months, year }) {
  // Local state to manage the sub-tabs within this component
  const [subTab, setSubTab] = useState(0);
  
  // Local state to manage the selected month for the Bar Chart dropdown
  const [selectedMonth, setSelectedMonth] = useState(months[0]); // Defaults to "Jan"

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        
        {/* Component Header and Sub-Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1,fontWeight:'bold' }}>
            Advanced Process Analytics
          </Typography>
          {/* <Tabs 
            value={subTab} 
            onChange={(e, newValue) => setSubTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Target vs Capacity" />
            <Tab label="Utilization Trends" />
            <Tab label="Production Timeline" />
          </Tabs> */}


          <Tabs 
  value={subTab} 
  onChange={(e, newValue) => setSubTab(newValue)}
  textColor="primary"
  indicatorColor="primary"
>
  <Tab icon={<BarChartIcon />} iconPosition="start" label="Target vs Capacity" />
  <Tab icon={<TimelineIcon />} iconPosition="start" label="Utilization Trends" />
  <Tab icon={<ViewTimelineIcon />} iconPosition="start" label="Production Timeline" />
</Tabs>
        </Box>

        {/* Dynamic Chart Container - Fixed height ensures UI stability */}
        <Box sx={{ height: 500, width: "100%" }}>
          
          {/* ---------------------------------------------------
              SUB-TAB 0: TARGET VS CAPACITY (Horizontal Bar)
              --------------------------------------------------- */}
          {subTab === 0 && (
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
              
              {/* Dropdown for Month/Year Selection */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="month-select-label">Month / Year</InputLabel>
                  <Select
                    labelId="month-select-label"
                    value={selectedMonth}
                    label="Month / Year"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m} {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Bar Chart utilizing the selected month's data */}
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  layout="vertical"
                  data={barDataByMonth[selectedMonth] || []}
                  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="process" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "#f5f5f5" }} />
                  <Legend />
                  <Bar dataKey="target" name="Target Quantity" fill="#1976d2" barSize={15} />
                  <Bar dataKey="maxCapacity" name="Max PCBs Built" fill="#ed6c02" barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* ---------------------------------------------------
              SUB-TAB 1: UTILIZATION TRENDS (Line Chart)
              --------------------------------------------------- */}
          {subTab === 1 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: "Utilization %", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine y={75} label="Warning (75%)" stroke="red" strokeDasharray="3 3" />
                
                <Line type="monotone" dataKey="SMT line" stroke="#1976d2" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="ATE 2" stroke="#ed6c02" strokeWidth={3} />
                <Line type="monotone" dataKey="Gap welding" stroke="#2e7d32" strokeWidth={3} />
                <Line type="monotone" dataKey="Visual Inspection" stroke="#9c27b0" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* ---------------------------------------------------
              SUB-TAB 2: PRODUCTION TIMELINE (Gantt Chart)
              --------------------------------------------------- */}
          {subTab === 2 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ganttData}
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  label={{ value: "Minutes", position: "insideBottom", offset: -10 }} 
                />
                <YAxis dataKey="process" type="category" tick={{ fontSize: 12 }} />
                <Tooltip content={<GanttTooltip />} cursor={{ fill: "transparent" }} />
                <Bar dataKey="time" fill="#9c27b0" barSize={20} radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          )}

        </Box>
      </Paper>
    </Box>
  );
}