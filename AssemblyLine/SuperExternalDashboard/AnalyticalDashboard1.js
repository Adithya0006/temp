// // // AnalyticalDashboard.js

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import {
// //   Box,
// //   Grid,
// //   Paper,
// //   Typography,
// //   Divider,
// //   CircularProgress,
// //   Alert,
// //   Card,
// //   CardContent,
// //   useTheme
// // } from '@mui/material';
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// //   AreaChart,
// //   Area
// // } from 'recharts';
// // import {
// //   InfoOutlined,
// //   TrendingUp,
// //   WarningAmber,
// //   Speed,
// //   Inventory
// // } from '@mui/icons-material';

// // // --- COLORS & STYLES ---
// // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// // // Custom Tooltip Style
// // const CustomTooltip = ({ active, payload, label }) => {
// //   if (active && payload && payload.length) {
// //     return (
// //       <Paper elevation={3} sx={{ p: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
// //         <Typography variant="subtitle2" color="primary" fontWeight="bold">{label}</Typography>
// //         {payload.map((entry, index) => (
// //           <Typography key={index} variant="body2" color="black">
// //             {entry.name}: <b>{entry.value}</b> {entry.unit || ''}
// //           </Typography>
// //         ))}
// //       </Paper>
// //     );
// //   }
// //   return null;
// // };

// // const AnalyticalDashboard = ({ apiBaseUrl, user }) => {
// //   const theme = useTheme();
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [data, setData] = useState(null);

// //   // --- DATA FETCHING ---
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const endpoint = `${apiBaseUrl}/dashboard/analytics`;
        
// //         // --- REAL API CALL ---
// //         const response = await axios.get(endpoint, { 
// //             params: { staff_no: user?.id }
// //         });
// //         console.log("response data: ",response.data)
// //         processData(response.data);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("Analytics Fetch Error:", err);
// //         setError("Failed to load analytical data. Please check connection.");
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [apiBaseUrl, user]);

// //   // --- PROCESS DATA ---
// //   const processData = (rawData) => {
// //     // 1. Convert Dictionary objects to Arrays for Recharts
// //     const pcbTypes = Object.entries(rawData.pcb_types || {}).map(([key, value]) => ({ name: key, value }));
// //     const pcbStatuses = Object.entries(rawData.pcb_statuses || {}).map(([key, value]) => ({ name: key, value }));
    
// //     // 2. Format Order Trend
// //     const orderTrend = (rawData.order_trend || []).map(item => ({
// //         ...item,
// //         date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
// //     }));

// //     // 3. Store formatted data
// //     setData({
// //         ...rawData,
// //         pcbTypesArray: pcbTypes,
// //         pcbStatusesArray: pcbStatuses,
// //         orderTrendFormatted: orderTrend
// //     });
// //   };

// //   // --- CHART WRAPPER (With Scroll Support) ---
// //   const ChartWrapper = ({ title, description, children, height = 350, scrollable = false, dataLength = 0 }) => {
// //     // Calculate dynamic height for scrollable charts
// //     const contentHeight = scrollable && dataLength > 0 ? Math.max(height, dataLength * 50) : '100%';
    
// //     return (
// //       <Paper 
// //         elevation={0} 
// //         sx={{ 
// //           p: 3, 
// //           borderRadius: 3, 
// //           border: `1px solid ${theme.palette.divider}`, 
// //           height: scrollable ? height : '100%', 
// //           // If not scrollable, we allow the Paper to take the height of the content or the fixed height
// //           minHeight: height, 
// //           display: 'flex', 
// //           flexDirection: 'column',
// //           overflow: 'hidden'
// //         }}
// //       >
// //         <Box mb={2} flexShrink={0}>
// //           <Typography variant="h6" fontWeight="bold" color="text.primary">
// //             {title}
// //           </Typography>
// //           <Box display="flex" gap={1} alignItems="center" mt={0.5}>
// //             <InfoOutlined fontSize="small" color="action" />
// //             <Typography  color="black">
// //               {description}
// //             </Typography>
// //           </Box>
// //         </Box>
// //         <Divider sx={{ mb: 2 }} />
        
// //         {/* Chart Container */}
// //         <Box sx={{ 
// //             flexGrow: 1, 
// //             minHeight: 0, 
// //             overflowY: scrollable ? 'auto' : 'hidden',
// //             pr: scrollable ? 1 : 0 
// //         }}>
// //            <div style={{ height: scrollable ? contentHeight : '100%', minHeight: scrollable ? 'auto' : (height - 100), width: '100%' }}>
// //              {children}
// //            </div>
// //         </Box>
// //       </Paper>
// //     );
// //   };

// //   // --- KPI CARD COMPONENT ---
// //   const KpiCard = ({ title, value, subtext, icon, color }) => (
// //     <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, height: '100%' }}>
// //       <CardContent>
// //         <Box display="flex" justifyContent="space-between" alignItems="start">
// //           <Box>
// //             <Typography variant="subtitle2" color="black" gutterBottom>
// //               {title}
// //             </Typography>
// //             <Typography variant="h4" fontWeight="bold" color={color || 'text.primary'}>
// //               {value}
// //             </Typography>
// //             {subtext && <Typography  color="black">{subtext}</Typography>}
// //           </Box>
// //           <Box p={1} bgcolor={`${color}15`} borderRadius={2} color={color}>
// //             {icon}
// //           </Box>
// //         </Box>
// //       </CardContent>
// //     </Card>
// //   );

// //   if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
// //   if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
// //   if (!data) return null;

// //   return (
// //     <Box p={1}>
// //       <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
// //         Production Analytics
// //       </Typography>

// //       {/* 1. KPI SUMMARY ROW */}
// //       <Grid container spacing={3} sx={{ mb: 4 }}>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <KpiCard 
// //             title="Avg. Batch Age" 
// //             value={`${data.batch_aging?.average_wip_age_days || 0} Days`} 
// //             subtext="Time from creation to now"
// //             icon={<Speed />}
// //             color={theme.palette.info.main}
// //           />
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <KpiCard 
// //             title="Stuck Batches" 
// //             value={data.batch_aging?.stuck_count || 0} 
// //             subtext="Units inactive > 5 days"
// //             icon={<WarningAmber />}
// //             color={data.batch_aging?.stuck_count > 0 ? theme.palette.error.main : theme.palette.success.main}
// //           />
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <KpiCard 
// //             title="Active Volume" 
// //             value={data.production_flow?.reduce((acc, curr) => acc + curr.active_pcbs, 0) || 0}
// //             subtext="PCBs currently in progress"
// //             icon={<Inventory />}
// //             color={theme.palette.primary.main}
// //           />
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <KpiCard 
// //             title="Total PCB's" 
// //             value={data.orderTrendFormatted?.length > 0 ? data.orderTrendFormatted[data.orderTrendFormatted.length - 1].count : 0}
// //             subtext="New orders received today"
// //             icon={<TrendingUp />}
// //             color={theme.palette.success.main}
// //           />
// //         </Grid>
// //       </Grid>

// //       <Grid container spacing={3}>

// //         {/* 2. ORDER TREND (AREA CHART) */}
// //         <Grid item xs={12} md={8}>
// //           <ChartWrapper 
// //             title="Order Received" 
// //             description="Daily volume of new PCBs entering the system over time."
// //             height={350}
// //           >
// //             <ResponsiveContainer width="100%" height="100%">
// //               <AreaChart data={data.orderTrendFormatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
// //                 <defs>
// //                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
// //                     <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
// //                     <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
// //                   </linearGradient>
// //                 </defs>
// //                 <XAxis dataKey="date" />
// //                 <YAxis />
// //                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
// //                 <Tooltip content={<CustomTooltip />} />
// //                 <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" name="New Orders" />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //           </ChartWrapper>
// //         </Grid>

// //         {/* 3. PCB TYPES (DONUT) */}
// //         <Grid item xs={12} md={4}>
// //           <ChartWrapper 
// //             title="Product Mix" 
// //             description="Distribution of active orders by PCB Type."
// //             height={350}
// //           >
// //              <ResponsiveContainer width="100%" height="100%">
// //               <PieChart>
// //                 <Pie
// //                   data={data.pcbTypesArray}
// //                   cx="50%"
// //                   cy="50%"
// //                   innerRadius={60}
// //                   outerRadius={80}
// //                   paddingAngle={5}
// //                   dataKey="value"
// //                 >
// //                   {data.pcbTypesArray.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //                 <Legend verticalAlign="bottom" height={36}/>
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartWrapper>
// //         </Grid>

// //         {/* 4. PRODUCTION FLOW (SCROLLABLE BAR CHART) */}
// //         <Grid item xs={12}>
// //           <ChartWrapper 
// //             title="Active PCBs  & Staff Capacity" 
// //             description="Active WIP vs. Qualified Staff Capacity per step. Scroll down to see all 40+ operations."
// //             height={500}
// //             scrollable={true}
// //             dataLength={data.production_flow?.length || 0}
// //           >
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart
// //                 layout="vertical"
// //                 data={data.production_flow}
// //                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                 barGap={2}
// //               >
// //                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
// //                 <XAxis type="number" />
// //                 <YAxis 
// //                     dataKey="step" 
// //                     type="category" 
// //                     width={220} 
// //                     tick={{fontSize: 11}} 
// //                     interval={0}
// //                 />
// //                 <Tooltip content={<CustomTooltip />} />
// //                 <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}}/>
// //                 <Bar dataKey="active_pcbs" name="Active WIP (Units)" fill="#82ca9d" radius={[0, 4, 4, 0]} barSize={15} />
// //                 <Bar dataKey="staff_capacity" name="Staff Capacity" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={15} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartWrapper>
// //         </Grid>


// //         <Grid item xs={12}>
// //           <ChartWrapper 
// //             title="Production  & Staff Capacity" 
// //             description="Active WIP vs. Qualified Staff Capacity per step. Scroll down to see all 40+ operations."
// //             height={500}
// //             scrollable={true}
// //             dataLength={data.Overall_Task_Data?.length || 0}
// //           >
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart
// //                 layout="vertical"
// //                 data={data.Overall_Task_Data}
// //                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                 barGap={2}
// //               >
// //                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
// //                 <XAxis type="number" />
// //                 <YAxis 
// //                     dataKey="step" 
// //                     type="category" 
// //                     width={220} 
// //                     tick={{fontSize: 11}} 
// //                     interval={0}
// //                 />
// //                 <Tooltip content={<CustomTooltip />} />
// //                 <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}}/>
// //                 <Bar dataKey="active_pcbs" name="Active WIP (Units)" fill="#82ca9d" radius={[0, 4, 4, 0]} barSize={15} />
// //                 <Bar dataKey="staff_capacity" name="Staff Capacity" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={15} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartWrapper>
// //         </Grid>



// //         {/* 5. CYCLE TIME ANALYSIS */}
// //         <Grid item xs={12} md={6}>
// //           <ChartWrapper 
// //             title="Cycle Time Analysis" 
// //             description="Average time (minutes) spent per operation step."
// //             height={600} // Matched to left column to keep layout somewhat balanced, though content may be shorter
// //             scrollable={true}
// //             dataLength={data.cycle_time?.length || 0}
// //           >
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart
// //                 layout="vertical"
// //                 data={data.cycle_time}
// //                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //               >
// //                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
// //                 <XAxis type="number" unit=" min" />
// //                 <YAxis dataKey="step_name" type="category" width={180} tick={{fontSize: 11}} interval={0} />
// //                 <Tooltip content={<CustomTooltip />} />
// //                 <Bar dataKey="avg_time_minutes" name="Avg Time" fill="#ffc658" radius={[0, 4, 4, 0]} barSize={20} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartWrapper>
// //         </Grid>

// //         {/* 6. STATUS DISTRIBUTION & OPERATOR LOAD (BIG VERTICAL STACK) */}
// //         <Grid item xs={12} md={6}>
// //           <Grid container spacing={3} direction="column">
            
// //             {/* Status Pie Chart - TALL */}
// //             {/* <Grid item xs={12}>
// //               <ChartWrapper 
// //                 title="Current Status Distribution" 
// //                 description="Breakdown of all units by their current status."
// //                 height={600} // <--- INCREASED HEIGHT
// //               >
// //                  <ResponsiveContainer width="100%" height="100%">
// //                   <PieChart>
// //                     <Pie
// //                       data={data.pcbStatusesArray}
// //                       cx="50%"
// //                       cy="50%"
// //                       outerRadius={160} // Increased radius for better visibility
// //                       dataKey="value"
// //                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
// //                     >
// //                       {data.pcbStatusesArray.map((entry, index) => (
// //                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                       ))}
// //                     </Pie>
// //                     <Tooltip />
// //                     <Legend verticalAlign="bottom" />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               </ChartWrapper>
// //             </Grid> */}
            
// //             {/* Operator Load Bar Chart - TALL */}
// //             <Grid item xs={12}>
// //                <ChartWrapper 
// //                 title="Operator Workload" 
// //                 description="Number of PCBs actively assigned to each operator."
// //                 height={600} // <--- INCREASED HEIGHT
// //                 scrollable={true} // Kept scrollable just in case
// //                 dataLength={data.operator_load?.length || 0}
// //               >
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <BarChart data={data.operator_load} layout="vertical" margin={{ left: 20 }}>
// //                   {console.log("data.operator_load ",data.operator_load)}
// //                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true}/>
// //                     <XAxis type="number" allowDecimals={false} />
// //                     <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
// //                     <Tooltip content={<CustomTooltip />} />
// //                     <Bar dataKey="pcb_count" name="Assigned PCBs" fill="#FF8042" radius={[0, 4, 4, 0]} barSize={40} />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </ChartWrapper>
// //             </Grid>


// //           </Grid>
// //         </Grid>
// //     <Grid item xs={12} md={16} >
// //         <Grid>
// //       <ChartWrapper
// //         title="Operations per Operator"
// //         description="Number of operations per operator."
// //         height={600}
// //         scrollable={true}
// //         dataLength={data.operator_presence.length} // Use transformedData.length
// //       >
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart data={data.operator_presence} layout="vertical" margin={{ left: 20 }}>
// //             <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true}/>
// //             <XAxis type="number" allowDecimals={false} />
// //             <YAxis dataKey="staff_no" type="category" width={100} tick={{fontSize: 12}} />
// //             <Tooltip content={<CustomTooltip />} />
// //             <Bar dataKey="presence_count" name="Assigned Operations" fill="#FF8442" radius={[0, 4, 4, 0]} barSize={40} />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </ChartWrapper>
// //     </Grid>
// //         </Grid>
// //         <Grid item xs={12} >
// //               <ChartWrapper 
// //                 title="Current Status Distribution" 
// //                 description="Breakdown of all units by their current status."
// //                 height={500} // <--- INCREASED HEIGHT
// //               >
// //                  <ResponsiveContainer width="100%" height="100%">
// //                   <PieChart>
// //                     <Pie
// //                       data={data.pcbStatusesArray}
// //                       cx="50%"
// //                       cy="50%"
// //                       outerRadius={160} // Increased radius for better visibility
// //                       dataKey="value"
// //                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
// //                     >
// //                       {data.pcbStatusesArray.map((entry, index) => (
// //                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                       ))}
// //                     </Pie>
// //                     <Tooltip />
// //                     <Legend verticalAlign="bottom" />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               </ChartWrapper>
// //             </Grid>

// //       </Grid>
// //     </Box>
// //   );
// // };

// // export default AnalyticalDashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box, Grid, Paper, Typography, CircularProgress, Alert, Card, 
//   alpha, useTheme, Stack, Avatar, Chip, Divider
// } from '@mui/material';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, 
//   ComposedChart, Line
// } from 'recharts';
// import {
//   TrendingUp, WarningAmber, Speed, Inventory, Analytics, 
//   RadioButtonChecked, Assessment, Timer, People, Assignment
// } from '@mui/icons-material';

// // --- PROFESSIONAL DESIGN TOKENS ---
// const DESIGN = {
//   primary: '#2563eb',
//   success: '#059669',
//   warning: '#d97706',
//   error: '#dc2626',
//   indigo: '#4f46e5',
//   slate: '#475569',
//   chartColors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f43f5e', '#14b8a6']
// };

// const AnalyticalDashboard1 = ({ apiBaseUrl, user }) => {
//   const theme = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${apiBaseUrl}/dashboard/analytics`, { 
//             params: { staff_no: user?.id }
//         });
//         processData(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Network failed to synchronize analytics");
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [apiBaseUrl, user]);

//   const processData = (rawData) => {
//     setData({
//       ...rawData,
//       pcbTypesArray: Object.entries(rawData.pcb_types || {}).map(([name, value]) => ({ name, value })),
//       pcbStatusesArray: Object.entries(rawData.pcb_statuses || {}).map(([name, value]) => ({ name, value })),
//       orderTrendFormatted: (rawData.order_trend || []).map(item => ({
//         ...item,
//         date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
//       })),
//       // Optimization: To keep the dashboard single-page, we show high-impact stages (Top 15)
//       productionFlow: rawData.production_flow?.slice(0, 15) || [],
//       overallTaskData: rawData.Overall_Task_Data?.slice(0, 15) || [],
//       cycleTime: rawData.cycle_time?.slice(0, 15) || [],
//       operatorLoad: rawData.operator_load?.slice(0, 10) || [],
//       operatorPresence: rawData.operator_presence?.slice(0, 10) || []
//     });
//   };

//   const BentoBox = ({ title, children, icon: Icon, flex = 1, color = DESIGN.slate }) => (
//     <Paper 
//       elevation={0} 
//       sx={{ 
//         p: 1.5, height: '100%', display: 'flex', flexDirection: 'column',
//         borderRadius: 3, border: `1px solid ${alpha(DESIGN.slate, 0.1)}`,
//         bgcolor: '#ffffff', flex: flex, overflow: 'hidden'
//       }}
//     >
//       <Stack direction="row" spacing={1} alignItems="center" mb={1}>
//         {Icon && <Icon sx={{ fontSize: 16, color: color }} />}
//         <Typography  sx={{ fontWeight: 800, color: DESIGN.slate, letterSpacing: 0.5 }}>
//           {title.toUpperCase()}
//         </Typography>
//       </Stack>
//       <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
//     </Paper>
//   );

//   const KpiWidget = ({ label, value, color, icon: Icon }) => (
//     <Box sx={{ 
//       flex: 1, p: 1.5, borderRadius: 3, bgcolor: alpha(color, 0.05), 
//       border: `1px solid ${alpha(color, 0.1)}`, display: 'flex', alignItems: 'center', gap: 2 
//     }}>
//       <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}><Icon sx={{ fontSize: 18 }} /></Avatar>
//       <Box>
//         <Typography  sx={{ color: DESIGN.slate, fontWeight: 700, display: 'block' }}>{label}</Typography>
//         <Typography variant="h6" sx={{ fontWeight: 900, color: color, lineHeight: 1 }}>{value}</Typography>
//       </Box>
//     </Box>
//   );

//   if (loading) return <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Box sx={{ height: '100vh', p: 1.5, bgcolor: '#f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
//       {/* HEADER & KPIs */}
//       <Stack direction="row" spacing={2} mb={1.5} alignItems="center">
//         <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 240 }}>
//           <Assessment color="primary" />
//           <Typography variant="h6" fontWeight={900}>Operations Intelligence</Typography>
//         </Stack>
//         <KpiWidget label="BATCH AGING" value={`${data.batch_aging?.average_wip_age_days}d Avg`} color={DESIGN.primary} icon={Timer} />
//         <KpiWidget label="STUCK UNITS" value={data.batch_aging?.stuck_count} color={DESIGN.error} icon={WarningAmber} />
//         <KpiWidget label="WIP VOLUME" value={data.production_flow?.reduce((a, b) => a + b.active_pcbs, 0)} color={DESIGN.success} icon={Inventory} />
//         <KpiWidget label="SYSTEM INTAKE" value={data.orderTrendFormatted?.slice(-1)[0]?.count || 0} color={DESIGN.indigo} icon={TrendingUp} />
//       </Stack>

//       {/* DASHBOARD GRID */}
//       <Grid container spacing={1.5} sx={{ flexGrow: 1, minHeight: 0 }}>
        
//         {/* COL 1: Performance & Tasks */}
//         <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//           <BentoBox title="Flow vs Capacity" icon={Speed} color={DESIGN.primary}>
//             <ResponsiveContainer width="100%" height="100%">
//               <ComposedChart data={data.productionFlow}>
//                 <XAxis dataKey="step" hide />
//                 <YAxis fontSize={9} />
//                 <Tooltip />
//                 <Bar dataKey="active_pcbs" name="WIP" fill={DESIGN.primary} radius={[2, 2, 0, 0]} />
//                 <Line type="monotone" dataKey="staff_capacity" name="Cap" stroke={DESIGN.error} strokeWidth={2} dot={false} />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </BentoBox>
//           <BentoBox title="Task Saturation" icon={Assignment} color={DESIGN.success}>
//             <ResponsiveContainer width="100%" height="100%">
//               <ComposedChart data={data.overallTaskData}>
//                 <XAxis dataKey="step" hide />
//                 <YAxis fontSize={9} />
//                 <Tooltip />
//                 <Bar dataKey="active_pcbs" name="Active" fill={DESIGN.success} radius={[2, 2, 0, 0]} />
//                 <Line type="step" dataKey="staff_capacity" name="Staff" stroke={DESIGN.indigo} strokeWidth={2} dot={false} />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </BentoBox>
//         </Grid>

//         {/* COL 2: Trends & Timing */}
//         <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//           <BentoBox title="Intake Timeline" icon={TrendingUp} color={DESIGN.indigo}>
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={data.orderTrendFormatted}>
//                 <XAxis dataKey="date" fontSize={9} />
//                 <YAxis hide />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="count" stroke={DESIGN.indigo} fill={alpha(DESIGN.indigo, 0.2)} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </BentoBox>
//           <BentoBox title="Cycle Time (Min)" icon={Timer} color={DESIGN.warning}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data.cycleTime} layout="vertical">
//                 <XAxis type="number" hide />
//                 <YAxis dataKey="step_name" type="category" fontSize={8} width={80} />
//                 <Tooltip />
//                 <Bar dataKey="avg_time_minutes" fill={DESIGN.warning} radius={[0, 2, 2, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </BentoBox>
//         </Grid>

//         {/* COL 3: Distribution & Staff */}
//         <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//           <Box sx={{ flex: 1.2, display: 'flex', gap: 1.5 }}>
//             <BentoBox title="Status Mix">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={data.pcbStatusesArray} innerRadius="50%" outerRadius="85%" dataKey="value">
//                     {data.pcbStatusesArray.map((e, i) => <Cell key={i} fill={DESIGN.chartColors[i % 8]} />)}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </BentoBox>
//             <BentoBox title="Product Mix">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={data.pcbTypesArray} outerRadius="85%" dataKey="value">
//                     {data.pcbTypesArray.map((e, i) => <Cell key={i} fill={DESIGN.chartColors[(i+3) % 8]} />)}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </BentoBox>
//           </Box>
          
//           <BentoBox title="Staff Allocation" icon={People} color={DESIGN.slate}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data.operatorLoad} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
//                 <XAxis dataKey="name" fontSize={8} interval={0} />
//                 <YAxis fontSize={9} />
//                 <Tooltip />
//                 <Bar dataKey="pcb_count" name="PCBs" fill={DESIGN.slate} radius={[2, 2, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </BentoBox>

//           <BentoBox title="Operator Presence" icon={RadioButtonChecked} color={DESIGN.slate}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data.operatorPresence} layout="vertical">
//                 <XAxis type="number" hide />
//                 <YAxis dataKey="staff_no" type="category" fontSize={8} width={50} />
//                 <Tooltip />
//                 <Bar dataKey="presence_count" name="Ops" fill={alpha(DESIGN.slate, 0.6)} radius={[0, 2, 2, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </BentoBox>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default AnalyticalDashboard1;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Line,
  Pie,
  Cell,
  AreaChart,
  Area,
  LabelList,
  ComposedChart
} from 'recharts';
import {
  InfoOutlined,
  TrendingUp,
  WarningAmber,
  Speed,
  Inventory
} from '@mui/icons-material';
import BentoBox from './BentoBox'; 
import Assignment from '@mui/icons-material/Assignment';

// --- PROFESSIONAL COLOR PALETTE ---
const DESIGN = {
  success: '#059669',
  indigo: '#4f46e5',
  orange: '#ea580c',
  slate900: '#0f172a',
  slate700: '#334155',
  slate500: '#64748b',
  error: '#dc2626'
};

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// Mapping for Status Pie Chart
const STATUS_MAPPING = {
  'new': 'Yet to Assign',
  'inaction': 'Yet to Start',
  'assigned': 'In Progress'
};

// Custom Tooltip Style (Professional High Contrast)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper 
        elevation={4} 
        sx={{ 
          p: 1.5, 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="subtitle2" sx={{ color: DESIGN.slate900, fontWeight: 800, mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color, fontWeight: 700 }}>
            {entry.name}: <span style={{ color: DESIGN.slate900 }}>{entry.value} {entry.unit || ''}</span>
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const AnalyticalDashboard1 = ({ apiBaseUrl, user }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = `${apiBaseUrl}/dashboard/analytics`;
        const response = await axios.get(endpoint, { 
            params: { staff_no: user?.id }
        });
        processData(response.data);
        setLoading(false);
      } catch (err) {
        // console.error("Analytics Fetch Error:", err);
        setError("Failed to load analytical data. Please check connection.");
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl, user]);

  const processData = (rawData) => {
    // 1. Process Statuses with custom mapping
    const pcbStatuses = Object.entries(rawData.pcb_statuses || {}).map(([key, value]) => ({ 
      name: STATUS_MAPPING[key.toLowerCase()] || key, 
      value 
    }));

    const pcbTypes = Object.entries(rawData.pcb_types || {}).map(([key, value]) => ({ name: key, value }));
    
    const orderTrend = (rawData.order_trend || []).map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    setData({
        ...rawData,
        pcbTypesArray: pcbTypes,
        pcbStatusesArray: pcbStatuses,
        orderTrendFormatted: orderTrend
    });
  };

  const ChartWrapper = ({ title, description, children, height = 350, scrollable = false, dataLength = 0 }) => {
    const contentHeight = scrollable && dataLength > 0 ? Math.max(height, dataLength * 55) : '100%';
    
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          border: '1px solid #e2e8f0', 
          height: scrollable ? height : '100%', 
          minHeight: height, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: '#ffffff'
        }}
      >
        <Box mb={2} flexShrink={0}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: DESIGN.slate900 }}>
            {title}
          </Typography>
          <Box display="flex" gap={1} alignItems="center" mt={0.5}>
            <InfoOutlined sx={{ fontSize: 16, color: DESIGN.indigo }} />
            <Typography variant="body2" sx={{opacity:0.8,fontWeight:600}}>
              {description}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />
        
        <Box sx={{ 
            flexGrow: 1, 
            minHeight: 0, 
            overflowY: scrollable ? 'auto' : 'hidden',
            pr: scrollable ? 1 : 0 
        }}>
           <div style={{ height: scrollable ? contentHeight : '100%', minHeight: scrollable ? 'auto' : (height - 100), width: '100%' }}>
             {children}
           </div>
        </Box>
      </Paper>
    );
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="400px"><CircularProgress thickness={5} sx={{ color: DESIGN.indigo }} /></Box>;
  if (error) return <Alert severity="error" variant="filled" sx={{ m: 2, borderRadius: 2 }}>{error}</Alert>;
  if (!data) return null;

  return (
    <Box p={2} sx={{ bgcolor: '#f8fafc' }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* KPI 1: Average Startup Delay */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            variant="outlined" 
            sx={{ 
              p: 2.5, 
              borderRadius: 4, 
              border: '1px solid #e2e8f0', 
              height: '100%',
              bgcolor: '#ffffff',
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 20px -5px rgba(0,0,0,0.1)' }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#eff6ff', display: 'flex' }}>
                <Speed sx={{ color: DESIGN.indigo }} fontSize="small" />
              </Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: DESIGN.indigo, bgcolor: '#e0e7ff', px: 1.5, py: 0.5, borderRadius: 1.5 }}>
                EFFICIENCY
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: DESIGN.slate900 }}>
              {data.batch_aging?.average_wip_age_days || 0} <span style={{ fontSize: '1rem', color: DESIGN.slate500 }}>Days</span>
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: DESIGN.slate900, mt: 1 }}>
              Avg. Startup Delay
            </Typography>
            <Typography variant="body2" sx={{opacity:0.8,fontWeight:600}}>
              Mean duration from assignment to commencement.
            </Typography>
          </Card>
        </Grid>

        {/* KPI 2: IDLE PCBs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            variant="outlined" 
            sx={{ 
              p: 2.5, 
              borderRadius: 4, 
              borderLeft: `6px solid ${data.batch_aging?.stuck_count > 0 ? DESIGN.error : DESIGN.success}`,
              height: '100%',
              bgcolor: '#ffffff'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningAmber sx={{ color: data.batch_aging?.stuck_count > 0 ? DESIGN.error : DESIGN.success }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: DESIGN.slate900, letterSpacing: 0.5 }}>IDLE PCBS</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: data.batch_aging?.stuck_count > 0 ? DESIGN.error : DESIGN.success }}>
              {data.batch_aging?.stuck_count || 0}
            </Typography>
            <Typography variant="body2" sx={{opacity:0.8,fontWeight:600}}>
              Reached 5-day threshold without activity.
            </Typography>
          </Card>
        </Grid>

        {/* KPI 3: Active WIP */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            variant="outlined" 
            sx={{ p: 2.5, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%', bgcolor: '#ffffff' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
               <Inventory sx={{ color: DESIGN.indigo, mr: 1 }} fontSize="small" />
               <Typography variant="overline" sx={{ fontWeight: 800, color: DESIGN.slate500 }}>Current Flow</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: DESIGN.slate900 }}>
              {data.production_flow?.reduce((acc, curr) => acc + curr.active_pcbs, 0) || 0}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: DESIGN.slate900 }}>In Progress PCBs</Typography>
            <Box sx={{ mt: 2.5, height: 8, width: '100%', bgcolor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: '70%', bgcolor: DESIGN.indigo, borderRadius: 4 }} />
            </Box>
          </Card>
        </Grid>

        {/* KPI 4: Total PCBs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            variant="outlined" 
            sx={{ 
              p: 2.5, 
              borderRadius: 4, 
              background: `linear-gradient(135deg, ${DESIGN.slate900} 0%, #1e293b 100%)`,
              color: 'white',
              height: '100%'
            }}
          >
            <TrendingUp sx={{ color: DESIGN.success, mb: 1.5, fontSize: 32 }} />
            <Typography variant="h3" sx={{ fontWeight: 900 }}>
              {data.orderTrendFormatted?.length > 0 ? data.orderTrendFormatted[data.orderTrendFormatted.length - 1].count : 0}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 1, fontWeight: 700 }}>Total New Orders of Recent PO</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500, mt: 1 }}>
              Recent production order Quantity
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Status Distribution (Pie Chart) */}
        <Grid item xs={12}>
          <ChartWrapper 
            title="Current Status Distribution" 
            description="Operational stages of all PCBs"
            height={500}
          >
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pcbStatusesArray}
                  cx="50%"
                  cy="50%"
                  outerRadius={160}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.pcbStatusesArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span style={{ color: DESIGN.slate900, fontWeight: 700, fontSize: '14px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Grid>

        {/* Order Trend */}
        <Grid item xs={12} md={8}>
          <ChartWrapper 
            title="Production Order Trend" 
            description="Quantity of new PCBs received from all PO"
            height={400}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.orderTrendFormatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={DESIGN.indigo} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={DESIGN.indigo} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: DESIGN.slate900, fontWeight: 700 }} />
                <YAxis tick={{ fill: DESIGN.slate900, fontWeight: 700 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke={DESIGN.indigo} strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" name="New Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Grid>

        {/* Product Mix */}
        <Grid item xs={12} md={4}>
          <ChartWrapper 
            title="PCB Category Distribution" 
            description="Active orders by PCB Type."
            height={400}
          >
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pcbTypesArray}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data.pcbTypesArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  formatter={(value) => <span style={{ color: DESIGN.slate900, fontWeight: 700 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Grid>

        {/* Production & Staff Capacity */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, height: 650, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Box mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: DESIGN.slate900 }}>Production & Operator Capacity</Typography>
              <Typography variant="body2" sx={{ color: DESIGN.slate700, fontWeight: 600 }}>In Progress vs Qualified Operator Capacity per stage</Typography>
            </Box>

            <Box sx={{ width: '100%', height: 500, overflowX: 'auto' }}>
              <div style={{ minWidth: data.Overall_Task_Data.length * 85 }}> 
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart
                    data={data.Overall_Task_Data}
                    margin={{ top: 40, right: 30, left: 20, bottom: 100 }}
                    barGap={10}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="step" 
                      tick={{fontSize: 12, fill: DESIGN.slate900, fontWeight: 800}} 
                      angle={-45} 
                      textAnchor="end" 
                      interval={0} 
                      height={110}
                    />
                    <YAxis tick={{ fill: DESIGN.slate900, fontWeight: 700 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={40} formatter={(value) => <span style={{ color: DESIGN.slate900, fontWeight: 700 }}>{value}</span>}/>

                    <Bar dataKey="active_pcbs" name="Active WIP (Units)" fill={DESIGN.success} radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="active_pcbs" position="top" style={{ fontSize: '11px', fill: DESIGN.slate900, fontWeight: 900 }} />
                    </Bar>

                    <Bar dataKey="staff_capacity" name="Staff Capacity" fill={DESIGN.indigo} radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="staff_capacity" position="top" style={{ fontSize: '11px', fill: DESIGN.slate900, fontWeight: 900 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Box>
          </Paper>
        </Grid>

        {/* Cycle Time Analysis */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: 600, display: 'flex', flexDirection: 'column', borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Box mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: DESIGN.slate900 }}>Cycle Time Analysis</Typography>
              <Typography variant="body2" sx={{ color: DESIGN.slate700, fontWeight: 600 }}>Average minutes spent per operation step</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.cycle_time} margin={{ top: 30, right: 20, left: 0, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="step_name" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{fontSize: 11, fill: DESIGN.slate900, fontWeight: 800}}
                    height={100} 
                  />
                  <YAxis unit="min" tick={{ fill: DESIGN.slate900, fontWeight: 700 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg_time_minutes" radius={[6, 6, 0, 0]} barSize={45}>
                    {data.cycle_time?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <LabelList 
                      dataKey="avg_time_minutes" 
                      position="top" 
                      formatter={(val) => `${val}m`}
                      style={{ fontSize: '12px', fontWeight: 900, fill: DESIGN.slate900 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Operator Workload */}
        <Grid item xs={12} md={6}>
          <ChartWrapper 
            title="Operator Workload" 
            description="Active PCBs assigned per operator."
            height={600} 
            scrollable={true} 
            dataLength={data.operator_load?.length || 0}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.operator_load} margin={{ top: 30, right: 20, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: DESIGN.slate900, fontWeight: 800}}
                  interval={0} 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                />
                <YAxis type="number" allowDecimals={false} tick={{ fill: DESIGN.slate900, fontWeight: 700 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pcb_count" name="Assigned PCBs" radius={[6, 6, 0, 0]} barSize={45}>
                  {data.operator_load.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList dataKey="pcb_count" position="top" style={{ fill: DESIGN.slate900, fontSize: '12px', fontWeight: 900 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Grid>

        {/* Operations per Operator (Bento) */}
        <Grid item xs={12}>
          <BentoBox title="Operations per Operator" icon={Assignment} color={DESIGN.indigo}>
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={data.operator_presence} margin={{ top: 30, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="staff_no" tick={{fontSize: 12, fontWeight: 800, fill: DESIGN.slate900}} />
                <YAxis tick={{fontSize: 12, fontWeight: 800, fill: DESIGN.slate900}} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                
                <Bar dataKey="presence_count" name="Assigned Operations" fill={DESIGN.orange} radius={[6, 6, 0, 0]} barSize={40}>
                  <LabelList dataKey="presence_count" position="top" style={{ fill: DESIGN.slate900, fontSize: '12px', fontWeight: 900 }} />
                </Bar>

                <Line 
                  type="monotone" 
                  dataKey="presence_count" 
                  stroke={DESIGN.indigo} 
                  strokeWidth={4}
                  dot={{ r: 6, fill: DESIGN.indigo, strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </BentoBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticalDashboard1;