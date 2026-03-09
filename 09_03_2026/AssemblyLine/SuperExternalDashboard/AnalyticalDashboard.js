



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box, Grid, Paper, Typography, Divider, CircularProgress, Alert, Card,
//   CardContent, useTheme, IconButton, Button, Tooltip as MuiTooltip
// } from '@mui/material';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer, PieChart, Line, Pie, Cell, AreaChart, Area,
//   LabelList, ComposedChart
// } from 'recharts';
// import {
//   TrendingUp, WarningAmber, Speed, Inventory, ChevronLeft,
//   ChevronRight, Dashboard, Assignment, InfoOutlined
// } from '@mui/icons-material';
// import BentoBox from './BentoBox';

// // --- PROFESSIONAL COLOR PALETTE ---
// const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
// const GRID_COLOR = "#f1f5f9";

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <Paper elevation={4} sx={{ p: 1.5, border: 'none', borderRadius: 2 }}>
//         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{label}</Typography>
//         {payload.map((entry, index) => (
//           <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//             <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
//             <Typography variant="caption" color="black">
//               {entry.name}: <span style={{ color: '#000', fontWeight: 600 }}>{entry.value}</span>
//             </Typography>
//           </Box>
//         ))}
//       </Paper>
//     );
//   }
//   return null;
// };

// const AnalyticalDashboard = ({ apiBaseUrl, user }) => {
//   const theme = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);
//   const [activeChart, setActiveChart] = useState(0);
//   const [isIdleDialogOpen, setIsIdleDialogOpen] = useState(false);
//   const chartCategories = [
//     { id: 0, name: "Status Overview", icon: <Dashboard fontSize="small" /> },
//     { id: 1, name: "Production Flow", icon: <TrendingUp fontSize="small" /> },
//     { id: 2, name: "Operator Analysis", icon: <Assignment fontSize="small" /> },
//     { id: 3, name: "Performance Metrics", icon: <Speed fontSize="small" /> }
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${apiBaseUrl}/dashboard/analytics`, { params: {Operator_no: user?.id } });
//         processData(response.data);
//         console.log("response: ",response)
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load analytical data.");
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [apiBaseUrl, user]);

//   const processData = (rawData) => {
//     const pcbTypes = Object.entries(rawData.pcb_types || {}).map(([key, value]) => ({ name: key, value }));
//     const pcbStatuses = Object.entries(rawData.pcb_statuses || {}).map(([key, value]) => ({ name: key, value }));
//     const orderTrend = (rawData.order_trend || []).map(item => ({
//         ...item,
//         date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
//     }));
//     setData({ ...rawData, pcbTypesArray: pcbTypes, pcbStatusesArray: pcbStatuses, orderTrendFormatted: orderTrend });
//   };

//   const ChartWrapper = ({ title, description, children, height = 400 }) => (
//     <Paper elevation={0} sx={{ 
//       p: 2.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, 
//       height: height, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper',
//       transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }
//     }}>
//       <Box mb={2} display="flex" justifyContent="space-between" alignItems="flex-start">
//         <Box>
//           <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>{title}</Typography>
//           <Typography variant="caption" color="black">{description}</Typography>
//         </Box>
//         <MuiTooltip title="Analytics Info"><IconButton size="small"><InfoOutlined fontSize="inherit" /></IconButton></MuiTooltip>
//       </Box>
//       <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
//     </Paper>
//   );

//   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress thickness={2} /></Box>;
//   if (error) return <Alert severity="error" variant="outlined" sx={{ m: 2, borderRadius: 2 }}>{error}</Alert>;



//   const handleIdleClick = () => {
//     // Ensure the list exists and has items before opening
//     if (data.batch_aging?.stuck_list?.length > 0) {
//       setIsIdleDialogOpen(true);
//     } else {
//       // Optional: Show a small toast or log if there is nothing to show
//       console.log("No idle PCBs to display.");
//     }
//   };

//   return (
//     <Box p={3} sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       {/* Header Section */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//         <Box>
//           <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">Dashboard</Typography>
//           <Typography variant="body2" color="black">Real-time production & operator performance insights</Typography>
//         </Box>
        
//         <Box sx={{ display: 'flex', bgcolor: 'white', p: 0.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
//           {chartCategories.map((cat) => (
//             <Button
//               key={cat.id}
//               onClick={() => setActiveChart(cat.id)}
//               variant={activeChart === cat.id ? "contained" : "text"}
//               startIcon={cat.icon}
//               sx={{ 
//                 px: 2, borderRadius: 2.5, textTransform: 'none', fontWeight: 600,
//                 boxShadow: activeChart === cat.id ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
//               }}
//             >
//               {cat.name}
//             </Button>
//           ))}
//         </Box>
//       </Box>

//       {/* KPI Section */}
//   {/* KPI Section */}
// {/* KPI Section */}
// <Grid container spacing={3} mb={4}>
//   {[
//     { 
//       title: "AVERAGE STARTUP DELAY", 
//       val: `${data.batch_aging?.average_wip_age_days || 0}d`, 
//       icon: <Speed />, 
//       col: '#4f46e5',
//       desc: "Mean duration between PCB assignment and actual commencement of work." 
//     },
//     { 
//       title: "IDLE PCBS", 
//       val: data.batch_aging?.stuck_count, 
//       icon: <WarningAmber />, 
//       col: '#ef4444',
//       /* 1. Attach the function reference here */
//       onClick: handleIdleClick,
//       desc: "Assigned PCBs reaching a 5-day threshold with zero tasks started." 
//     },
//     { 
//       title: "ACTIVE WIP", 
//       val: data.production_flow?.reduce((a, c) => a + c.active_pcbs, 0), 
//       icon: <Inventory />, 
//       col: '#10b981',
//       desc: "Total quantity of PCBs currently assigned to operators." 
//     },
//     { 
//       title: "NEW RECEIVED TODAY", 
//       val: data.orderTrendFormatted?.slice(-1)[0]?.count || 0, 
//       icon: <TrendingUp />, 
//       col: '#f59e0b',
//       desc: "Total quantity of new units inducted within the last 24 hours." 
//     }
//   ].map((kpi, i) => (
//     <Grid item xs={12} sm={6} md={3} key={i}>
//       <Paper 
//         /* 2. EXECUTING THE HANDLER: This is the critical connection */
//         onClick={() => kpi.onClick && kpi.onClick()} 
//         sx={{ 
//           p: 3, 
//           borderRadius: 4, 
//           display: 'flex', 
//           flexDirection: 'column', 
//           justifyContent: 'space-between',
//           border: '1px solid #e2e8f0', 
//           height: '100%',
//           transition: '0.3s',
          
//           /* 3. UX IMPROVEMENT: Show pointer only if the card has an onClick */
//           cursor: kpi.onClick ? 'pointer' : 'default',
          
//           '&:hover': { 
//             boxShadow: kpi.onClick 
//               ? `0 10px 25px ${kpi.col}25` // Special glow for clickable card
//               : '0 4px 20px rgba(0,0,0,0.05)',
//             transform: kpi.onClick ? 'translateY(-2px)' : 'none'
//           }
//         }}
//       >
//         {/* Header: Icon and Highlighted Title */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
//           <Box sx={{ 
//             p: 1, 
//             borderRadius: 2, 
//             bgcolor: `${kpi.col}15`, 
//             color: kpi.col, 
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             {kpi.icon}
//           </Box>
//           <Typography 
//             variant="caption" 
//             sx={{ 
//               color: kpi.col, 
//               fontWeight: 800, 
//               letterSpacing: '0.05rem',
//               textTransform: 'uppercase' 
//             }}
//           >
//             {kpi.title}
//           </Typography>
//         </Box>

//         {/* Content: Value and Description */}
//         <Box>
//           <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 0.5 }}>
//             {kpi.val}
//           </Typography>
//           <Typography 
//             variant="caption" 
//             sx={{ 
//               color: 'black', 
//               fontSize: '0.75rem', 
//               lineHeight: 1.4,
//               display: 'block',
//               minHeight: '40px' 
//             }}
//           >
//             {kpi.desc}
//           </Typography>

//           {/* 4. OPTIONAL: Visual hint for the user */}
//           {kpi.onClick && (
//             <Typography 
//               variant="caption" 
//               sx={{ color: kpi.col, fontWeight: 700, mt: 1.5, display: 'block', fontSize: '0.65rem' }}
//             >
//               VIEW DETAILS →
//             </Typography>
//           )}
//         </Box>
//       </Paper>
//     </Grid>
//   ))}
// </Grid>

//       {/* Dynamic Content */}
//       <Grid container spacing={3}>
//         {activeChart === 0 && (
//           <>
//             <Grid item xs={12} md={6}>
//               <ChartWrapper title="Production Order Trend" description="Daily incoming unit count">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={data.orderTrendFormatted}>
//                     <defs>
//                       <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
//                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
//                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fill="url(#chartColor)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </ChartWrapper>
//             </Grid>
//             {/* <Grid item xs={12} md={5}>
//               <ChartWrapper title="Status Breakdown" description="Current manufacturing stages">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie data={data.pcbStatusesArray} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
//                       {data.pcbStatusesArray.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </ChartWrapper>
//             </Grid> */}
//             <Grid item xs={12} md={6}>
//             <ChartWrapper 
//                 title="Current Status Distribution" 
//                 description="Breakdown of all units by their current status."
//                 height={500} // <--- INCREASED HEIGHT
//               >
//                  <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data.pcbStatusesArray}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={160} // Increased radius for better visibility
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {data.pcbStatusesArray.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend verticalAlign="bottom" />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </ChartWrapper>
//             </Grid>

//             <Grid item xs={12} md={6}>
//           <ChartWrapper 
//             title="Product Mix" 
//             description="Distribution of active orders by PCB Type."
//             height={350}
//           >
//              <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={data.pcbTypesArray}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {data.pcbTypesArray.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend verticalAlign="bottom" height={36}/>
//               </PieChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>
//           </>
//         )}

//         {activeChart === 1 && (
//           <Grid item xs={12}>
//             {/* <ChartWrapper title="Production Flow vs Capacity" description="IdentifyOperatoring bottlenecks per station">
//               <Box sx={{ width: '100%', height: '100%', overflowX: 'auto', pb: 1 }}>
//                 <div style={{ minWidth: data.production_flow?.length * 100 || 1000, height: '100%' }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={data.production_flow} margin={{ top: 30, bottom: 50 }}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
//                       <XAxis dataKey="step" angle={-40} textAnchor="end" interval={0} tick={{fontSize: 11}} axisLine={false} />
//                       <YAxis axisLine={false} tickLine={false} />
//                       <Tooltip content={<CustomTooltip />} />
//                       <Legend verticalAlign="top" align="right" iconType="rect" />
//                       <Bar dataKey="active_pcbs" name="WIP" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={25}>
//                          <LabelList dataKey="active_pcbs" position="top" style={{fontSize: 10, fontWeight: 600}} />
//                       </Bar>
//                       <Bar dataKey="staff_capacity" name="Capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={25}>
//                          <LabelList dataKey="staff_capacity" position="top" style={{fontSize: 10}} />
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </Box>
//             </ChartWrapper> */}


// <ChartWrapper
//     title="Active PCBs &Operator Capacity"
//     description="Active WIP vs. QualifiedOperator Capacity per step. Scroll down to see all 40+ operations."
//     height={500}
//     scrollable={true}
//     dataLength={data.production_flow?.length || 0}
//   >
//     <ResponsiveContainer width="100%" height="100%">
//       <BarChart
//         layout="horizontal" // "horizontal" layout produces vertical bars
//         data={data.production_flow}
//         margin={{ top: 20, right: 30, left: 20, bottom: 60 }} // Increased top margin for labels
//         barGap={2}
//       >
//         <CartesianGrid strokeDasharray="3 3" vertical={false} />
        
//         {/* XAxis for Categories (Steps) */}
//         <XAxis 
//           dataKey="step" 
//           type="category" 
//           tick={{fontSize: 11}} 
//           interval={0} 
//           angle={-45} // Angled labels often help in vertical charts with many steps
//           textAnchor="end"
//           height={80}
//         />
        
//         {/* YAxis for Numerical Values */}
//         <YAxis type="number" />
        
//         <Tooltip content={<CustomTooltip />} />
//         <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}}/>
        
//         <Bar 
//           dataKey="active_pcbs" 
//           name="Active WIP (Units)" 
//           fill="#82ca9d" 
//           radius={[4, 4, 0, 0]} // Rounded top corners
//           barSize={20}
//         >
//           {/* Added LabelList for counts on top */}
//           <LabelList dataKey="active_pcbs" position="top" style={{ fontSize: '10px', fill: '#666' }} />
//         </Bar>

//         <Bar 
//           dataKey="staff_capacity" 
//           name="Staff Capacity" 
//           fill="#8884d8" 
//           radius={[4, 4, 0, 0]} // Rounded top corners
//           barSize={20}
//         >
//           {/* Added LabelList for counts on top */}
//           <LabelList dataKey="staff_capacity" position="top" style={{ fontSize: '10px', fill: '#666' }} />
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   </ChartWrapper>
//           </Grid>
//         )}

//         {activeChart === 2 && (
//           <>
//             <Grid item xs={12} md={6}>
//               {/* <ChartWrapper title="Operator Load" description="Total PCBs currently assigned per user">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data.operator_load} margin={{top: 30, bottom: 40}}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
//                     <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 11}} height={60} />
//                     <YAxis axisLine={false} tickLine={false} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="pcb_count" radius={[4, 4, 0, 0]} barSize={35}>
//                       {data.operator_load?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                       <LabelList dataKey="pcb_count" position="top" style={{fontWeight: 700, fontSize: 12}} />
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </ChartWrapper> */}

// <ChartWrapper 
//         title="Operator Workload" 
//         description="Number of PCBs actively assigned to each operator."
//         height={600} 
//         scrollable={true} 
//         dataLength={data.operator_load?.length || 0}
//       >
//         <ResponsiveContainer width="100%" height="100%">
      
//           <BarChart 
//             data={data.operator_load} 
//             margin={{ top: 30, right: 20, left: 20, bottom: 60 }} // Added bottom margin for names
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
            
         
//             <XAxis 
//               dataKey="name" 
//               fontSize={12}
//               interval={0} // Ensures all names are shown
//               angle={-45}  // Slants names so they don't overlap
//               textAnchor="end"
//               height={60}
//             />
//             <YAxis 
//               type="number" 
//               allowDecimals={false} 
//               fontSize={12} 
//             />
            
//             <Tooltip content={<CustomTooltip />} />
            
//             <Bar 
//               dataKey="pcb_count" 
//               name="Assigned PCBs" 
//               radius={[4, 4, 0, 0]} 
//               barSize={40}
//             >
          
//               {data.operator_load.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}

           
//               <LabelList 
//                 dataKey="pcb_count" 
//                 position="top" 
//                 style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }} 
//               />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </ChartWrapper>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {/* <ChartWrapper title="Operational Reach" description="Unique stations handled by operator">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <ComposedChart data={data.operator_presence} margin={{top: 30, bottom: 40}}>
//                     <XAxis dataKey="staff_no" tick={{fontSize: 11}} />
//                     <YAxis axisLine={false} tickLine={false} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="presence_count" name="Operations" fill="#f1f5f9" radius={[4, 4, 0, 0]} barSize={40} />
//                     <Line type="monotone" dataKey="presence_count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5, fill: '#4f46e5' }} />
//                   </ComposedChart>
//                 </ResponsiveContainer>
//               </ChartWrapper> */}


// <BentoBox 
//     title="Operations per Operator" 
//     icon={Assignment} 
//     color="#FF8442"
//   >
//     <ResponsiveContainer width="100%" height={400}>
//       <ComposedChart 
//         data={data.operator_presence} 
//         margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//       >
//         <CartesianGrid strokeDasharray="3 3" vertical={false} />
//         <XAxis 
//           dataKey="staff_no" 
//           fontSize={11} 
//           tickLine={false} 
//           axisLine={false} 
//         />
//         <YAxis 
//           fontSize={11} 
//           tickLine={false} 
//           axisLine={false} 
//           allowDecimals={false}
//         />
//         <Tooltip content={<CustomTooltip />} />
        
//         {/* The Bar */}
//         <Bar 
//           dataKey="presence_count" 
//           name="Assigned Operations" 
//           fill="#FF8442" 
//           radius={[4, 4, 0, 0]} 
//           barSize={30} 
//         >
//           {/* 1. This makes each bar a different color */}
//           {/* {data.operator_presence.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))} */}

//           {/* 2. This shows the count on top of the bars */}
//           <LabelList 
//             dataKey="presence_count" 
//             position="top" 
//             style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }} 
//           />
//           </Bar>
        

//         {/* The Line with Dots */}
//         <Line 
//           type="monotone" 
//           dataKey="presence_count" 
//           stroke="#4f46e5" // Indigo color
//           strokeWidth={2}
//           dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2 }}
//           activeDot={{ r: 6 }}
//         />
//       </ComposedChart>
//     </ResponsiveContainer>
//   </BentoBox>
//             </Grid>
//           </>
//         )}

//         {activeChart === 3 && (
//           <Grid item xs={12}>
//             <ChartWrapper title="Cycle Time by Stage" description="Avg. processing time in minutes" height={500}>
//                <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data.cycle_time} margin={{top: 30, bottom: 80}}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
//                     <XAxis dataKey="step_name" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 11}} height={100} />
//                     <YAxis axisLine={false} tickLine={false} unit="min" />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="avg_time_minutes" name="Minutes" radius={[4, 4, 0, 0]} barSize={45}>
//                       {data.cycle_time?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />)}
//                       <LabelList dataKey="avg_time_minutes" position="top" formatter={(v) => `${v}min`} style={{fontWeight: 700}} />
//                     </Bar>
//                   </BarChart>
//                </ResponsiveContainer>
//             </ChartWrapper>
//           </Grid>
//         )}
//       </Grid>
//     </Box>
//   );
// };

// export default AnalyticalDashboard;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box, Grid, Paper, Typography, Divider, CircularProgress, Alert, Card,
//   CardContent, useTheme, IconButton, Button, Tooltip as MuiTooltip,
//   Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, 
//   TableHead, TableRow
// } from '@mui/material';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer, PieChart, Line, Pie, Cell, AreaChart, Area,
//   LabelList, ComposedChart
// } from 'recharts';
// import {
//   TrendingUp, WarningAmber, Speed, Inventory, ChevronLeft,
//   ChevronRight, Dashboard, Assignment, InfoOutlined, Close
// } from '@mui/icons-material';
// import BentoBox from './BentoBox';

// // --- PROFESSIONAL COLOR PALETTE ---
// const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
// const GRID_COLOR = "#f1f5f9";

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <Paper elevation={4} sx={{ p: 1.5, border: 'none', borderRadius: 2 }}>
//         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{label}</Typography>
//         {payload.map((entry, index) => (
//           <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//             <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
//             <Typography variant="caption" color="black">
//               {entry.name}: <span style={{ color: '#000', fontWeight: 600 }}>{entry.value}</span>
//             </Typography>
//           </Box>
//         ))}
//       </Paper>
//     );
//   }
//   return null;
// };

// const AnalyticalDashboard = ({ apiBaseUrl, user }) => {
//   const theme = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);
//   const [activeChart, setActiveChart] = useState(0);
//   const [isIdleDialogOpen, setIsIdleDialogOpen] = useState(false);

//   const chartCategories = [
//     { id: 0, name: "Status Overview", icon: <Dashboard fontSize="small" /> },
//     { id: 1, name: "Production Flow", icon: <TrendingUp fontSize="small" /> },
//     { id: 2, name: "Operator Analysis", icon: <Assignment fontSize="small" /> },
//     { id: 3, name: "Performance Metrics", icon: <Speed fontSize="small" /> }
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${apiBaseUrl}/dashboard/analytics`, { params: {Operator_no: user?.id } });
//         processData(response.data);
//         console.log("response: ", response);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load analytical data.");
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [apiBaseUrl, user]);

//   const processData = (rawData) => {
//     const pcbTypes = Object.entries(rawData.pcb_types || {}).map(([key, value]) => ({ name: key, value }));
//     const pcbStatuses = Object.entries(rawData.pcb_statuses || {}).map(([key, value]) => ({ name: key, value }));
//     const orderTrend = (rawData.order_trend || []).map(item => ({
//       ...item,
//       date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
//     }));
//     setData({ ...rawData, pcbTypesArray: pcbTypes, pcbStatusesArray: pcbStatuses, orderTrendFormatted: orderTrend });
//   };

//   const ChartWrapper = ({ title, description, children, height = 400 }) => (
//     <Paper elevation={0} sx={{ 
//       p: 2.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, 
//       height: height, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper',
//       transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }
//     }}>
//       <Box mb={2} display="flex" justifyContent="space-between" alignItems="flex-start">
//         <Box>
//           <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>{title}</Typography>
//           <Typography variant="caption" color="black">{description}</Typography>
//         </Box>
//         <MuiTooltip title="Analytics Info"><IconButton size="small"><InfoOutlined fontSize="inherit" /></IconButton></MuiTooltip>
//       </Box>
//       <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
//     </Paper>
//   );

//   const handleIdleClick = () => {
//     if (data?.batch_aging?.stuck_list?.length > 0) {
//       setIsIdleDialogOpen(true);
//     } else {
//       console.log("No idle PCBs to display.");
//     }
//   };

//   if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress thickness={2} /></Box>;
//   if (error) return <Alert severity="error" variant="outlined" sx={{ m: 2, borderRadius: 2 }}>{error}</Alert>;

//   return (
//     <>

//     <Grid container spacing={3} mb={4}>
//         {[
//           { 
//             title: "AVERAGE STARTUP DELAY", 
//             val: `${data.batch_aging?.average_wip_age_days?.toFixed(1) || 0}d`, 
//             icon: <Speed />, 
//             col: '#4f46e5',
//             desc: "Mean duration between PCB assignment and actual commencement of work." 
//           },
//           { 
//             title: "IDLE PCBS", 
//             val: data.batch_aging?.stuck_count || 0, 
//             icon: <WarningAmber />, 
//             col: '#ef4444',
//             onClick: handleIdleClick,
//             desc: "Assigned PCBs reaching a 5-day threshold with zero tasks started." 
//           },
//           { 
//             title: "ACTIVE WIP", 
//             val: data.production_flow?.reduce((a, c) => a + c.active_pcbs, 0), 
//             icon: <Inventory />, 
//             col: '#10b981',
//             desc: "Total quantity of PCBs currently assigned to operators." 
//           },
//           { 
//             title: "NEW ORDERS RECEIVED RECENTLY", 
//             val: data.orderTrendFormatted?.slice(-1)[0]?.count || 0, 
//             icon: <TrendingUp />, 
//             col: '#f59e0b',
//             desc: "Total quantity of new orders recevied from recent PO" 
//           }
//         ].map((kpi, i) => (
//           <Grid item xs={12} sm={6} md={3} key={i}>
//             <Paper 
//               onClick={() => kpi.onClick && kpi.onClick()} 
//               sx={{ 
//                 p: 3, 
//                 borderRadius: 4, 
//                 display: 'flex', 
//                 flexDirection: 'column', 
//                 justifyContent: 'space-between',
//                 border: '1px solid #e2e8f0', 
//                 height: '100%',
//                 transition: '0.3s',
//                 cursor: kpi.onClick ? 'pointer' : 'default',
//                 '&:hover': { 
//                   boxShadow: kpi.onClick ? `0 10px 25px ${kpi.col}25` : '0 4px 20px rgba(0,0,0,0.05)',
//                   transform: kpi.onClick ? 'translateY(-2px)' : 'none'
//                 }
//               }}
//             >
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
//                 <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${kpi.col}15`, color: kpi.col, display: 'flex', alignItems: 'center' }}>
//                   {kpi.icon}
//                 </Box>
//                 <Typography variant="caption" sx={{ color: kpi.col, fontWeight: 800, letterSpacing: '0.05rem', textTransform: 'uppercase' }}>
//                   {kpi.title}
//                 </Typography>
//               </Box>

//               <Box>
//                 <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 0.5 }}>
//                   {kpi.val}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: 'black', fontSize: '0.75rem', lineHeight: 1.4, display: 'block', minHeight: '40px' }}>
//                   {kpi.desc}
//                 </Typography>
//                 {kpi.onClick && (
//                   <Typography variant="caption" sx={{ color: kpi.col, fontWeight: 700, mt: 1.5, display: 'block', fontSize: '0.65rem' }}>
//                     VIEW DETAILS →
//                   </Typography>
//                 )}
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* --- IDLE PCBS TABLE DIALOG --- */}
//       <Dialog 
//         open={isIdleDialogOpen} 
//         onClose={() => setIsIdleDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: 3 } }}
//       >
//         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
//           <Box display="flex" alignItems="center" gap={1}>
//             <WarningAmber color="error" />
//             Idle PCBs (PCBs Not Yet Started {'>'} 5 Days)
//           </Box>
//           <Button variant='contained' onClick={() => setIsIdleDialogOpen(false)} sx={{width:"fit-content"}}>Close</Button>
         
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: 0 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>PCB ID</TableCell>
//                 <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Current Step Number</TableCell>
//                 <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Current Step Name</TableCell>
//                 {/* <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Assignment ID</TableCell> */}
//                 <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Days Stationary</TableCell>
                
//                 {/* <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Status</TableCell> */}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.batch_aging?.stuck_list?.map((pcb, index) => (
//                 <TableRow key={index} hover>
//                   <TableCell sx={{ fontWeight: 600 }}>{pcb.pcb_id}</TableCell>
//                   {/* <TableCell>#{pcb.assignment_id}</TableCell> */}
//                   <TableCell sx={{ color: '#ef4444', fontWeight: 700 }}>
//                     {pcb.age_days.toFixed(1)} Days
//                   </TableCell>
//                   {/* <TableCell>
//                     <Box sx={{ 
//                       px: 1.5, py: 0.5, borderRadius: 1.5, bgcolor: '#fee2e2', color: '#b91c1c', 
//                       display: 'inline-block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' 
//                     }}>
//                       Action Required
//                     </Box>
//                   </TableCell> */}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </DialogContent>
//       </Dialog>



//     <Box p={3} sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       {/* Header Section */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//         <Box>
//           {/* <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">Dashboard</Typography>
//           <Typography variant="body2" color="black">Real-time production & operator performance insights</Typography> */}
//         </Box>
        
//         <Box sx={{ display: 'flex', bgcolor: 'white', p: 0.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
//           {/* {console.log("chartCategories: ",chartCategories)} */}
//           {chartCategories.map((cat) => (
//             <Button
//               key={cat.id}
//               onClick={() => setActiveChart(cat.id)}
//               variant={activeChart === cat.id ? "contained" : "text"}
//               startIcon={cat.icon}
//               sx={{ 
//                 px: 2, borderRadius: 2.5, textTransform: 'none', fontWeight: 600,
//                 boxShadow: activeChart === cat.id ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
//               }}
//             >
//               {cat.name}
//             </Button>
//           ))}
//         </Box>
//       </Box>

//       {/* KPI Section */}
      

//       {/* Dynamic Content */}
//       <Grid container spacing={3}>
//       {activeChart === 0 && (
//         <>
//           <Grid item xs={12} md={6}>
//             <ChartWrapper title="Production Order Trend" description="Daily incoming unit count" height={350}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={data.orderTrendFormatted}>
//                   <defs>
//                     <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
//                       <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
//                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
//                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fill="url(#chartColor)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </ChartWrapper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <ChartWrapper
//               title="Current Status Distribution"
//               description="Breakdown of all units by their current status."
//               height={350}
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={data.pcbStatusesArray}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     dataKey="value"
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {data.pcbStatusesArray.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend verticalAlign="bottom" />
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartWrapper>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <ChartWrapper
//               title="Product Mix"
//               description="Distribution of active orders by PCB Type."
//               height={350}
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={data.pcbTypesArray}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={2}
//                     dataKey="value"
//                   >
//                     {data.pcbTypesArray.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend verticalAlign="bottom" height={36}/>
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartWrapper>
//           </Grid>
//         </>
//       )}

//       {activeChart === 1 && (
//         <Grid item xs={12}>
//           <ChartWrapper
//             title="Active PCBs &Operator Capacity"
//             description="Active WIP vs. QualifiedOperator Capacity per step."
//             height={500}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data.production_flow} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis
//                   dataKey="step"
//                   type="category"
//                   tick={{fontSize: 11}}
//                   interval={0}
//                   angle={-45}
//                   textAnchor="end"
//                   height={80}
//                 />
//                 <YAxis type="number" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}}/>
//                 <Bar dataKey="active_pcbs" name="Active WIP (Units)" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={20}>
//                   <LabelList dataKey="active_pcbs" position="top" style={{ fontSize: '10px', fill: '#666' }} />
//                 </Bar>
//                 <Bar dataKey="staff_capacity" name="Staff Capacity" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={20}>
//                   <LabelList dataKey="staff_capacity" position="top" style={{ fontSize: '10px', fill: '#666' }} />
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>
//       )}

//       {activeChart === 2 && (
//         <>
//           <Grid item xs={12} md={6}>
//             <ChartWrapper
//               title="Operator Workload"
//               description="Number of PCBs actively assigned to each operator."
//               height={600}
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data.operator_load} margin={{ top: 30, right: 20, left: 20, bottom: 60 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis dataKey="name" fontSize={12} interval={0} angle={-45} textAnchor="end" height={60} />
//                   <YAxis type="number" allowDecimals={false} fontSize={12} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar dataKey="pcb_count" name="Assigned PCBs" radius={[4, 4, 0, 0]} barSize={40}>
//                     {data.operator_load.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                     <LabelList dataKey="pcb_count" position="top" style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }} />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartWrapper>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <BentoBox title="Operations per Operator" icon={Assignment} color="#FF8442">
//               <ResponsiveContainer width="100%" height={400}>
//                 {console.log("30 : ",data)}
//                 <ComposedChart data={data.operator_presence} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis dataKey="staff_no" fontSize={11} tickLine={false} axisLine={false} />
//                   <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar dataKey="presence_count" name="Assigned Operations" fill="#FF8442" radius={[4, 4, 0, 0]} barSize={30}>
//                     <LabelList dataKey="presence_count" position="top" style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }} />
//                   </Bar>
//                   <Line type="monotone" dataKey="presence_count" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2 }} activeDot={{ r: 6 }} />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </BentoBox>
//           </Grid>
//         </>
//       )}

//       {activeChart === 3 && (
//         <Grid item xs={12}>
//           <ChartWrapper title="Cycle Time by Stage" description="Avg. processing time in minutes" height={500}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data.cycle_time} margin={{top: 30, bottom: 80}}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
//                 <XAxis dataKey="step_name" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 11}} height={100} />
//                 <YAxis axisLine={false} tickLine={false} unit="min" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="avg_time_minutes" name="Minutes" radius={[4, 4, 0, 0]} barSize={45}>
//                   {data.cycle_time?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />)}
//                   <LabelList dataKey="avg_time_minutes" position="top" formatter={(v) => `${v}min`} style={{fontWeight: 700}} />
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>
//       )}
//     </Grid>
//     </Box>
//     </>
//   );
// };

// export default AnalyticalDashboard;












































import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Grid, Paper, Typography, Divider, CircularProgress, Alert, Card,
  CardContent, useTheme, IconButton, Button, Tooltip as MuiTooltip,
  Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, 
  TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, getIconButtonUtilityClass
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Line, Pie, Cell, AreaChart, Area,
  LabelList, ComposedChart
} from 'recharts';
import {
  TrendingUp, WarningAmber, Speed, Inventory, Dashboard, Assignment, InfoOutlined, Close
} from '@mui/icons-material';
import BentoBox from './BentoBox';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
const GRID_COLOR = "#f1f5f9";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={4} sx={{ p: 1.5, border: 'none', borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{label}</Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
            <Typography variant="caption" color="black">
              {entry.name}: <span style={{ color: '#000', fontWeight: 600 }}>{entry.value}</span>
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

const AnalyticalDashboard = ({ apiBaseUrl, user }) => {
  const pcbtypenames={
    "Assigned":0,
    "Yet to assign":0,
    "Yet to assign by admin":0
  }
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeChart, setActiveChart] = useState(0);
  const [isIdleDialogOpen, setIsIdleDialogOpen] = useState(false);

  const [timeView, setTimeView] = useState('live'); 
  const [groupView, setGroupView] = useState('operation'); 

  const chartCategories = [
    { id: 0, name: "Production Overview", icon: <Dashboard fontSize="small" /> },
    { id: 1, name: "Production Flow", icon: <TrendingUp fontSize="small" /> },
    { id: 2, name: "Operator Analysis", icon: <Assignment fontSize="small" /> },
    { id: 3, name: "Performance Metrics", icon: <Speed fontSize="small" /> }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/dashboard/analytics`, { params: {Operator_no: user?.id } });
        processData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load analytical data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl, user]);

  const processData = (rawData) => {
    const pcbTypes = Object.entries(rawData.pcb_types || {}).map(([key, value]) => ({ name: key, value }));
    const pcbStatuses = Object.entries(rawData.pcb_statuses || {}).map(([key, value]) => ({ name: key, value }));
    const orderTrend = (rawData.order_trend || []).map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));
    setData({ ...rawData, pcbTypesArray: pcbTypes, pcbStatusesArray: pcbStatuses, orderTrendFormatted: orderTrend });
    // console.log("data: ",data)
  };


  
  const getDynamicFlowConfig = () => {
    if (!data) return { chartData: [], xKey: '', yKey: '', label: '' };

    if (timeView === 'live') {
      if (groupView === 'operation') {
        return { chartData: data.production_flow || [], xKey: 'step', yKey: 'active_pcbs', label: 'Work In Progress' };
      } else {
        return { chartData: data.operator_load || [], xKey: 'name', yKey: 'pcb_count', label: 'Live Load' };
      }
    } else {
      if (groupView === 'operation') {
        return { chartData: data.Overall_Task_Data || [], xKey: 'step', yKey: 'staff_capacity', label: 'Current Eligible Operators Count For Each Operation' };
      } else {
        // Requirement: x =Operator_no, y = total operations qualified
        return { chartData: data.overall_operator_wise || [], xKey: 'staff_no', yKey: 'count', label: 'Count of Number of Operation(s) That Each Operator can Perform' };
      }
    }
  };

  const dynamicConfig = getDynamicFlowConfig();

  const ChartWrapper = ({ title, description, children, height = 400, extraHeader = null }) => (
    <Paper elevation={0} sx={{ 
      p: 2.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, 
      height: height, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper',
      transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }
    }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>{title}</Typography>
          <Typography  color="black"  sx={{opacity:0.8,fontWeight:600}}>{description}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {extraHeader}
          <MuiTooltip title="Analytics Info"><IconButton size="small"><InfoOutlined fontSize="inherit" /></IconButton></MuiTooltip>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );

  const handleIdleClick = () => {
    if (data?.batch_aging?.stuck_list?.length >= 0) {
      setIsIdleDialogOpen(true);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress thickness={2} /></Box>;
  if (error) return <Alert severity="error" variant="outlined" sx={{ m: 2, borderRadius: 2 }}>{error}</Alert>;

  const formattedChartData = data.pcbStatusesArray.map(item => ({
    ...item,
    name: item.name === "Inaction" ? "Yet To Start" : (item.name === "New" ? "Yet To Assign":"In Progress")
  }));

 

  return (
    <>




    
      <Grid container spacing={3} mb={4}>
        {[
          { 
            title: "AVERAGE STARTUP DELAY", 
            val: `${data.batch_aging?.average_wip_age_days?.toFixed(1) || 0}d`, 
            icon: <Speed />, 
            col: '#4f46e5',
            desc: "Mean duration between PCB assignment and actual commencement of work." 
          },
          { 
            title: "IDLE PCBS", 
            val: data.batch_aging?.stuck_count || 0, 
            icon: <WarningAmber />, 
            col: '#ef4444',
            onClick: handleIdleClick,
            desc: "Assigned PCBs reaching a 3-day threshold with zero tasks started." 
          },
          { 
            title: "In Progress PCBs", 
            val: data.production_flow?.reduce((a, c) => a + (c.active_pcbs || 0), 0), 
            icon: <Inventory />, 
            col: '#10b981',
            desc: "Total quantity of PCBs currently assigned to operators." 
          },
          { 
            title: "Recent PO PCBs", 
            totalCount : data.orderTrendFormatted?.reduce((sum, item) => sum + item.count, 0) || 0,
            recentCount : data.orderTrendFormatted?.slice(-1)[0]?.count || 0, 
           
            icon: <TrendingUp />, 
            col: '#f59e0b',
            desc: "Total quantity of new PCBs received in recent production order" 
          }
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper 
              onClick={() => kpi.onClick && kpi.onClick()} 
              sx={{ 
                p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', 
                justifyContent: 'space-between', border: '1px solid #e2e8f0', height: '100%',
                transition: '0.3s', cursor: kpi.onClick ? 'pointer' : 'default',
                '&:hover': { 
                  boxShadow: kpi.onClick ? `0 10px 25px ${kpi.col}25` : '0 4px 20px rgba(0,0,0,0.05)',
                  transform: kpi.onClick ? 'translateY(-2px)' : 'none'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${kpi.col}15`, color: kpi.col, display: 'flex', alignItems: 'center' }}>
                  {kpi.icon}
                </Box>
                
                <Typography variant="caption" sx={{ color: kpi.col, fontWeight: 800, letterSpacing: '0.05rem', textTransform: 'uppercase' }}>
                  {kpi.title}
                </Typography>
              </Box>

              <Box>
                
                <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 0.5 }}>{kpi.val}</Typography>
               

                                      {kpi.title == "IDLE PCBS"?
                        <Typography variant="h1" sx={{ color: 'blue', lineHeight: 1.4,  fontSize:"1rem",display: 'block', minHeight: '40px',textDecoration:"underline", fontWeight: 600,opacity: 0.8 }}>{kpi.desc}</Typography>
                        :
                        <Typography sx={{ color: 'black', fontSize: '0.85rem',fontWeight: 600,opacity: 0.8, lineHeight: 1.4, display: 'block', minHeight: '40px' }}>{kpi.desc}</Typography>
                      }

                    {kpi.title == "Recent PO PCBs"?
                    <>
                    <Typography variant="h1" sx={{  lineHeight: 1.4,  fontSize:"1.0rem",display: 'block', minHeight: '40px', fontWeight: 600,opacity: 0.8, }}>Overall PO: {kpi.totalCount}</Typography>
                    <Typography variant="h1" sx={{  lineHeight: 1.4,  fontSize:"1.0rem",display: 'block', minHeight: '40px', fontWeight: 600,opacity: 0.8 }}>Recent PO: {kpi.recentCount}</Typography></>
                    :<></>
                  

                    }
                
                {kpi.onClick && (
                  <Typography variant="caption" sx={{ color: kpi.col, fontWeight: 700, mt: 1.5, display: 'block', fontSize: '0.65rem' }}>
                    
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={isIdleDialogOpen} 
        onClose={() => setIsIdleDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {/* {console.log("data in idle: ",data,isIdleDialogOpen)} */}
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningAmber color="error" />
            Idle PCBs (Inactive for more than 3 Days)
          </Box>
          {/* <IconButton onClick={() => setIsIdleDialogOpen(false)}><Close /></IconButton> */}
          <Button variant='contained' size='small' onClick={() => setIsIdleDialogOpen(false)} sx={{width:"12rem"}}  >
                Back To Dashboard
                </Button>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>PCB ID</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Current Step Name</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Days Idle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.batch_aging?.stuck_list?.map((pcb, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{pcb.pcb_id}</TableCell>
                  <TableCell>{pcb.current_step_name}</TableCell>
                  <TableCell sx={{ color: '#ef4444', fontWeight: 700 }}>
                    {pcb.age_days.toFixed(1)} Days
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Box p={3} sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box />
          <Box sx={{ display: 'flex', bgcolor: 'white', p: 0.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
            {chartCategories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setActiveChart(cat.id)}
                variant={activeChart === cat.id ? "contained" : "text"}
                startIcon={cat.icon}
                sx={{ 
                  px: 2, borderRadius: 2.5, textTransform: 'none', fontWeight: 600,
                  boxShadow: activeChart === cat.id ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                }}
              >
                {cat.name}
              </Button>
            ))}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {activeChart === 0 && (
            <>
              <Grid item xs={12} md={6}>
                <ChartWrapper title="Production Order Trend" sx={{color:"black"}} description="Production Order wise Trend" height={380}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.orderTrendFormatted}>
                      <defs>
                        <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/> 
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12,fill:"black",fontWeight:"bold"}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12,fill:"black",fontWeight:"bold"}} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fill="url(#chartColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </Grid>

              {/* <Grid item xs={12} md={6}>
                <ChartWrapper title="Current Status Distribution" description="Breakdown of all units by their current status." height={380}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.pcbStatusesArray}
                        cx="50%" cy="50%" outerRadius={110} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {console.log("data:  ",data.pcbStatusesArray)}
                        {data.pcbStatusesArray.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </Grid> */}



   

<Grid item xs={12} md={6}>
  <ChartWrapper title="Current Status Distribution" description="Breakdown of all units by their current status."  height={380}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={formattedChartData} // Use the transformed array here
          cx="50%" cy="50%" 
          outerRadius={110} 
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {formattedChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  </ChartWrapper>
</Grid>
            </>
          )}

          {activeChart === 1 && (
            <Grid item xs={12}>
              <ChartWrapper
                title="Active PCBs & Operator Capacity"
                description="Monitor workload distribution in assembly line"
                height={550}
                extraHeader={
                  <Box display="flex" gap={1.5}>
                    <FormControl size="large" sx={{ minWidth: 100 }}>
                      <Select value={timeView} onChange={(e) => setTimeView(e.target.value)} sx={{ fontWeight:"bold",fontSize: '1rem', height: 32, borderRadius: 2 }}>
                        <MenuItem value="live" sx={{fontWeight:"bold"}}>Live</MenuItem>
                        <MenuItem value="overall" sx={{fontWeight:"bold"}}>Overall</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select value={groupView} onChange={(e) => setGroupView(e.target.value)} sx={{ fontWeight:"bold",fontSize: '1rem', height: 32, borderRadius: 2 }}>
                        <MenuItem value="operation" sx={{fontWeight:"bold"}}>Operation Wise</MenuItem>
                        <MenuItem value="operator" sx={{fontWeight:"bold"}}>Operator Wise</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicConfig.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} />
                    <XAxis
                      dataKey={dynamicConfig.xKey}
                      fontSize={12}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={100}
                      tick={{fontWeight:"bold", fill:"black"}}
                      
                    />
                    <YAxis tick={{fontWeight:"bold", fill:"black"}} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend  verticalAlign="top" wrapperStyle={{fontWeight:"bold",paddingBottom: '20px'}}/>
                    <Bar dataKey={dynamicConfig.yKey}  name={dynamicConfig.label} fill={timeView === 'live' ? "#4f46e5" : "green"} radius={[4, 4, 0, 0]} barSize={30}>
                      <LabelList dataKey={dynamicConfig.yKey} position="top" style={{ fontSize: '13px', fill: 'black',fontWeight:"bold" }}  />
                    </Bar>
                    {timeView === 'live' && groupView === 'operation' && (
                      <Bar dataKey="staff_capacity" sx={{fontWeight:"bold",color:"rgb(117 29 209)" }} name="Operator Capacity" fill="#f5440c" radius={[4, 4, 0, 0]} barSize={30}>
                        <LabelList dataKey="staff_capacity" position="top" style={{ fontSize: '13px', fill: 'black',fontWeight:"bold" }} />
                      </Bar>
                    )}label
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </Grid>
          )}

          {activeChart === 2 && (
            <>
              <Grid item xs={12} md={6}>
                <ChartWrapper title="Operator Workload" description="Number of PCBs actively assigned to each operator" height={600}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.operator_load} margin={{ top: 30, right: 20, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                      fontSize={12}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={100}
                      tick={{fontWeight:"bold", fill:"black"}} dataKey="name"   />
                      <YAxis tick={{fontWeight:"bold", fill:"black"}} type="number" allowDecimals={false} fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="pcb_count" name="Assigned PCBs" radius={[4, 4, 0, 0]} barSize={40}>
                        {data.operator_load.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <LabelList dataKey="pcb_count" position="top" style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </Grid>
              <Grid item xs={12} md={6}>
                <BentoBox title="Operations per Operator"  icon={Assignment} color="#FF8442">
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={data.operator_presence} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis fontSize={12}
                      interval={0}
                      angle={-90}
                      textAnchor="end"
                      height={100}
                      tick={{fontWeight:"bold", fill:"black"}} dataKey="staff_no" tickLine={false} axisLine={false} />
                      <YAxis tick={{fontWeight:"bold", fill:"black"}} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="presence_count" name="Eligible Operations " fill="#FF8442" radius={[4, 4, 0, 0]} barSize={30}>
                        <LabelList dataKey="presence_count" position="top" style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }} />
                      </Bar>
                      <Line type="monotone" dataKey="presence_count" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </BentoBox>
              </Grid>
            </>
          )}

          {activeChart === 3 && (
            <Grid item xs={12}>
              <ChartWrapper title="Cycle Time by Stage" description="Avg. processing time in minutes" height={500}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.cycle_time} margin={{top: 30, bottom: 80}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
                    <XAxis fontSize={12}
                      interval={0}
                      angle={-40}
                      textAnchor="end"
                      height={100}
                      tick={{fontWeight:"bold", fill:"black"}} dataKey="step_name"   />
                    <YAxis tick={{fontWeight:"bold", fill:"black"}} axisLine={false} tickLine={false} unit="min" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avg_time_minutes" name="Minutes" radius={[4, 4, 0, 0]} barSize={45}>
                      {data.cycle_time?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />)}
                      <LabelList dataKey="avg_time_minutes" position="top" formatter={(v) => `${v}min`} style={{fontWeight: 700}} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default AnalyticalDashboard;



