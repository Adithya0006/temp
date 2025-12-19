import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Speed,
  WarningAmber,
  CheckCircle,
  Schedule,
  Engineering,
  Menu as MenuIcon,
  Notifications,
  AccountCircle
} from '@mui/icons-material';

// --- 1. MOCK DATA (Fallback) ---
// This acts as your "json file" if the API fails.
const MOCK_DATA = {
  meta: {
    role: "SUPERVISOR_EXTERNAL",
    supervisor_name: "SUPERVISOR INTERNAL",
    generated_at: new Date().toISOString(), // ensuring current date for demo
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

// --- 2. HELPER COMPONENTS ---

// A Reusable Card for Top-level stats
const StatCard = ({ title, value, icon, subtext }) => (
  <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="overline" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
          </Typography>
          {subtext && (
            <Typography variant="caption" color="text.secondary">
              {subtext}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// --- 3. MAIN DASHBOARD COMPONENT ---

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect for Fetching Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ---------------------------------------------------------
        // REAL API CALL (Uncomment and replace URL when ready)
        // ---------------------------------------------------------
        // const response = await axios.get('http://localhost:5000/api/dashboard');
        // setData(response.data);
        
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Using Mock Data for now
        setData(MOCK_DATA);
        setLoading(false);

      } catch (err) {
        console.error("API Error, falling back to JSON:", err);
        // Fallback Logic
        setError("Live connection failed. Using local cached data.");
        setData(MOCK_DATA);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // UI Helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      case 'STUCK': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      
      {/* Navigation Bar */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#1a237e' }}>
            BEL PRODUCTION TRACKER
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Box display="flex" alignItems="center" ml={2} gap={1}>
            <AccountCircle />
            <Typography variant="body2" fontWeight="bold">
              {data.meta.supervisor_name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* Error Alert if API failed */}
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Header Info */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Floor Overview: {data.time_insights?.current_shift || "General"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data Generated: {new Date(data.meta.generated_at).toLocaleString()}
            </Typography>
          </Box>
          <Chip 
            label={`System Status: ${data.operational_health.health_status}`}
            color={data.operational_health.health_status === 'GREEN' ? 'success' : 'error'}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* KPI Cards Row */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Output Today" 
              value={data.pcb_summary.completed_today} 
              subtext="Units Completed"
              icon={<CheckCircle fontSize="large" color="success" />} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Active WIP" 
              value={data.operational_health.wip_pcbs} 
              subtext="Units on Line"
              icon={<Engineering fontSize="large" color="primary" />} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Avg Cycle Time" 
              value={`${data.performance_metrics.avg_completion_time_minutes}m`} 
              subtext={data.performance_metrics.trend_vs_yesterday}
              icon={<Schedule fontSize="large" color="info" />} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Efficiency Rate" 
              value="98%" 
              subtext="No SLA Breaches"
              icon={<Speed fontSize="large" color="warning" />} 
            />
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Grid container spacing={3}>
          
          {/* Left: Active Production Table */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box p={3} borderBottom="1px solid #eee">
                <Typography variant="h6" fontWeight="bold">Real-time Production Queue</Typography>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>Serial No</strong></TableCell>
                      <TableCell><strong>Part Number</strong></TableCell>
                      <TableCell><strong>Stage</strong></TableCell>
                      <TableCell><strong>Operator</strong></TableCell>
                      <TableCell><strong>Duration</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.pcbs && data.pcbs.length > 0 ? (
                      data.pcbs.map((pcb) => (
                        <TableRow key={pcb.pcb_serial} hover>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                            {pcb.serial_no}
                          </TableCell>
                          <TableCell>{pcb.part_number}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box width={8} height={8} borderRadius="50%" bgcolor="#ff9800" />
                              {pcb.current_step}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {pcb.operator.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {pcb.operator.staff_no}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {pcb.time_in_current_step_minutes} mins
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={pcb.status.replace('_', ' ')} 
                              color={getStatusColor(pcb.status)} 
                              size="small" 
                              variant="filled"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          No active production units found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Right: Operational Details */}
          <Grid item xs={12} lg={4}>
            
            {/* Operational Health Card */}
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Operational Health
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">Stuck PCBs</Typography>
                  <Typography fontWeight="bold" color="error">
                    {data.operational_health.stuck_pcbs}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">SLA Breaches</Typography>
                  <Typography fontWeight="bold">
                    {data.alerts.sla_breaches}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Avg WIP Age</Typography>
                  <Typography fontWeight="bold">
                    {data.operational_health.avg_wip_age_minutes} min
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Alerts Panel */}
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff3e0' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <WarningAmber color="warning" />
                <Typography variant="h6" fontWeight="bold">System Alerts</Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
              
              {data.alerts.critical_processes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No critical alerts. All systems nominal.
                </Typography>
              ) : (
                data.alerts.critical_processes.map((alert, i) => (
                  <Typography key={i} color="error" variant="body2">
                    • {alert}
                  </Typography>
                ))
              )}
            </Paper>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default Dashboard;
// // --- 4. APP ENTRY POINT ---













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   CssBaseline,
//   AppBar,
//   Toolbar,
//   Typography,
//   Container,
//   Grid,
//   Paper,
//   Card,
//   CardContent,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   LinearProgress,
//   IconButton,
//   Divider,
//   Alert,
//   Snackbar,
//   ThemeProvider,
//   createTheme
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Refresh as RefreshIcon,
//   WarningAmber as WarningIcon,
//   CheckCircle as CheckCircleIcon,
//   Speed as SpeedIcon,
//   PrecisionManufacturing as FactoryIcon,
//   AccessTime as TimeIcon
// } from '@mui/icons-material';

// // --- 1. MOCK DATA (Strictly following your JSON structure) ---
// const MOCK_DATA = {
//   meta: {
//     role: "SUPERVISOR_EXTERNAL",
//     supervisor_name: "SUPERVISOR INTERNAL",
//     generated_at: new Date().toISOString(),
//     timezone: "UTC"
//   },
//   pcb_summary: {
//     master_total: 1250,
//     new: 45,
//     inaction: 2,
//     assigned: 15,
//     completed: 850,
//     completed_today: 124
//   },
//   performance_metrics: {
//     avg_completion_time_minutes: 42,
//     completed_last_1_hour: 12,
//     completed_last_8_hours: 95,
//     completed_today: 124,
//     trend_vs_yesterday: "STABLE"
//   },
//   operational_health: {
//     wip_pcbs: 8,
//     stuck_pcbs: 1,
//     avg_wip_age_minutes: 25,
//     max_wip_age_minutes: 60,
//     health_status: "GREEN"
//   },
//   wip_by_process: [
//     {
//       step_order: 5,
//       process_name: "AOI CORRECTION",
//       pcb_count: 5,
//       avg_wait_minutes: 10,
//       max_wait_minutes: 15
//     },
//     {
//       step_order: 6,
//       process_name: "SOLDERING",
//       pcb_count: 3,
//       avg_wait_minutes: 5,
//       max_wait_minutes: 8
//     }
//   ],
//   operator_summary: {
//     total_operators: 12,
//     active_operators: 10,
//     idle_operators: 2,
//     avg_tasks_per_operator: 4,
//     top_operator: "Santosh Kumar"
//   },
//   alerts: {
//     delayed_pcbs: 1,
//     sla_breaches: 0,
//     mrl_expiry_risks: 0,
//     critical_processes: ["OVEN_TEMP_High"], 
//     overall_severity: "AMBER" // Changed to AMBER to show alert styling
//   },
//   assignment_effectiveness: {
//     pcbs_assigned_by_supervisor: 20,
//     pcbs_completed_from_assigned: 15,
//     assignment_completion_rate: 75
//   },
//   time_insights: {
//     current_shift: "SHIFT A",
//     shift_start: "08:00",
//     shift_end: "16:00",
//     shift_completion_count: 124
//   },
//   pcbs: [
//     {
//       pcb_serial: "32401$113300033357",
//       serial_no: "32401",
//       part_number: "113300033357",
//       current_step: "AOI CORRECTION",
//       current_step_order: 6,
//       status: "IN_PROGRESS",
//       operator: {
//         staff_no: "E169",
//         name: "Santosh Kumar"
//       },
//       time_in_current_step_minutes: 45
//     },
//     {
//       pcb_serial: "32402$113300033358",
//       serial_no: "32402",
//       part_number: "113300033358",
//       current_step: "SOLDERING",
//       current_step_order: 7,
//       status: "IN_PROGRESS",
//       operator: {
//         staff_no: "E172",
//         name: "Rahul V"
//       },
//       time_in_current_step_minutes: 12
//     }
//   ]
// };

// // --- 2. THEME SETUP ---
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#1976d2' },
//     background: { default: '#f4f6f8', paper: '#fff' },
//     text: { secondary: '#637381' },
//   },
//   typography: {
//     fontFamily: 'Inter, sans-serif',
//     h6: { fontWeight: 600 },
//   },
//   components: {
//     MuiCard: { styleOverrides: { root: { boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', borderRadius: '12px' } } },
//     MuiPaper: { styleOverrides: { root: { borderRadius: '12px' } } }
//   }
// });

// // --- 3. HELPER COMPONENT: KPI CARD ---
// const KpiCard = ({ title, value, icon, color, subtext }) => (
//   <Card sx={{ height: '100%' }}>
//     <CardContent>
//       <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//         <Box>
//           <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>
//             {title.toUpperCase()}
//           </Typography>
//           <Typography variant="h4" sx={{ fontWeight: 700, color: '#212B36' }}>
//             {value}
//           </Typography>
//           {subtext && <Typography variant="caption" color="textSecondary">{subtext}</Typography>}
//         </Box>
//         <Box sx={{ p: 1, borderRadius: '50%', bgcolor: `${color}20`, color: color }}>
//           {icon}
//         </Box>
//       </Box>
//     </CardContent>
//   </Card>
// );

// // --- 4. MAIN DASHBOARD ---
// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState(false);

//   // FETCH DATA LOGIC
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // 1. Attempt Server Call
//       // const res = await axios.get('YOUR_API_ENDPOINT');
//       // setData(res.data);
      
//       // Force error to demonstrate fallback for this demo
//       throw new Error("Server not connected"); 

//     } catch (err) {
//       console.warn("Server unavailable, using Mock Data");
//       setApiError(true);
//       // 2. Fallback to Mock Data
//       // Simulating slight delay for realism
//       setTimeout(() => {
//         setData(MOCK_DATA);
//         setLoading(false);
//       }, 600);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (loading) return <LinearProgress />;

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        
//         {/* APP BAR */}
//         <AppBar position="static" color="inherit" elevation={1}>
//           <Toolbar>
//             <IconButton edge="start" color="inherit" sx={{ mr: 2 }}><MenuIcon /></IconButton>
//             <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
//               Production Analytics: {data.time_insights.current_shift}
//             </Typography>
//             <Box display="flex" alignItems="center" gap={2}>
//                <Chip 
//                   label={`Health: ${data.operational_health.health_status}`} 
//                   color={data.operational_health.health_status === 'GREEN' ? 'success' : 'error'} 
//                   size="small"
//                 />
//                <IconButton onClick={fetchData} color="primary"><RefreshIcon /></IconButton>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         <Container maxWidth="xl" sx={{ py: 4 }}>
          
//           {/* NOTIFICATION SNACKBAR */}
//           <Snackbar open={apiError} autoHideDuration={4000} onClose={() => setApiError(false)}>
//             <Alert severity="info" variant="filled">Displaying local backup data (Server Unreachable)</Alert>
//           </Snackbar>

//           {/* ROW 1: KEY PERFORMANCE METRICS */}
//           <Grid container spacing={3} mb={4}>
//             <Grid item xs={12} sm={6} md={3}>
//               <KpiCard 
//                 title="Completed Today" 
//                 value={data.pcb_summary.completed_today} 
//                 icon={<CheckCircleIcon />} 
//                 color="#00AB55" // Green
//                 subtext={`Target Trend: ${data.performance_metrics.trend_vs_yesterday}`}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <KpiCard 
//                 title="Active WIP" 
//                 value={data.operational_health.wip_pcbs} 
//                 icon={<FactoryIcon />} 
//                 color="#1890FF" // Blue
//                 subtext={`${data.operational_health.stuck_pcbs} Stuck Units`}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <KpiCard 
//                 title="Avg Cycle Time" 
//                 value={`${data.performance_metrics.avg_completion_time_minutes}m`} 
//                 icon={<TimeIcon />} 
//                 color="#FFC107" // Amber
//                 subtext="Last 1 Hour"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <KpiCard 
//                 title="Active Operators" 
//                 value={`${data.operator_summary.active_operators}/${data.operator_summary.total_operators}`} 
//                 icon={<SpeedIcon />} 
//                 color="#7635dc" // Purple
//                 subtext={`Top: ${data.operator_summary.top_operator}`}
//               />
//             </Grid>
//           </Grid>

//           <Grid container spacing={3}>
            
//             {/* ROW 2 LEFT: MAIN TRACKING TABLE */}
//             <Grid item xs={12} md={8}>
//               <Paper sx={{ p: 0, overflow: 'hidden' }}>
//                 <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="h6">Live PCB Tracking</Typography>
//                   <Chip label={`${data.pcbs.length} Active`} size="small" variant="outlined" />
//                 </Box>
//                 <TableContainer>
//                   <Table>
//                     <TableHead sx={{ bgcolor: '#f9fafb' }}>
//                       <TableRow>
//                         <TableCell>SERIAL NO</TableCell>
//                         <TableCell>CURRENT STEP</TableCell>
//                         <TableCell>OPERATOR</TableCell>
//                         <TableCell>DURATION</TableCell>
//                         <TableCell>STATUS</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {data.pcbs.map((pcb) => (
//                         <TableRow key={pcb.pcb_serial} hover>
//                           <TableCell sx={{ fontWeight: 'bold' }}>{pcb.serial_no}</TableCell>
//                           <TableCell>
//                             <Box display="flex" alignItems="center" gap={1}>
//                                <Box width={8} height={8} borderRadius="50%" bgcolor="orange" />
//                                {pcb.current_step}
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2">{pcb.operator.name}</Typography>
//                             <Typography variant="caption" color="textSecondary">{pcb.operator.staff_no}</Typography>
//                           </TableCell>
//                           <TableCell>{pcb.time_in_current_step_minutes} min</TableCell>
//                           <TableCell>
//                             <Chip 
//                               label={pcb.status.replace('_', ' ')} 
//                               size="small" 
//                               color={pcb.status === 'IN_PROGRESS' ? 'primary' : 'default'} 
//                               variant="soft" 
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Paper>
//             </Grid>

//             {/* ROW 2 RIGHT: ALERTS & HEALTH */}
//             <Grid item xs={12} md={4}>
//               {/* Critical Alerts Panel */}
//               <Paper sx={{ p: 3, mb: 3, bgcolor: '#FFF5F5', border: '1px solid #FFD6D6' }}>
//                 <Box display="flex" alignItems="center" gap={1} mb={2}>
//                   <WarningIcon color="error" />
//                   <Typography variant="h6" color="error.main">System Alerts</Typography>
//                 </Box>
//                 {data.alerts.critical_processes.length > 0 ? (
//                   data.alerts.critical_processes.map((alert, idx) => (
//                     <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
//                        <Box width={6} height={6} borderRadius="50%" bgcolor="red" />
//                        <Typography variant="body2" fontWeight="bold">{alert}</Typography>
//                     </Box>
//                   ))
//                 ) : (
//                   <Typography variant="body2" color="textSecondary">No critical alerts.</Typography>
//                 )}
//                 <Divider sx={{ my: 2 }} />
//                 <Box display="flex" justifyContent="space-between">
//                   <Typography variant="body2">Delayed PCBs</Typography>
//                   <Typography variant="body2" fontWeight="bold">{data.alerts.delayed_pcbs}</Typography>
//                 </Box>
//               </Paper>

//               {/* Assignment Effectiveness */}
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>Supervisor Effectiveness</Typography>
//                   <Box display="flex" justifyContent="space-between" mb={1}>
//                     <Typography variant="body2" color="textSecondary">Assigned by You</Typography>
//                     <Typography variant="body2" fontWeight="bold">{data.assignment_effectiveness.pcbs_assigned_by_supervisor}</Typography>
//                   </Box>
//                   <Box display="flex" justifyContent="space-between" mb={2}>
//                      <Typography variant="body2" color="textSecondary">Completed</Typography>
//                      <Typography variant="body2" fontWeight="bold">{data.assignment_effectiveness.pcbs_completed_from_assigned}</Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="caption" display="block" mb={0.5}>Completion Rate</Typography>
//                     <LinearProgress 
//                       variant="determinate" 
//                       value={data.assignment_effectiveness.assignment_completion_rate} 
//                       color="success" 
//                       sx={{ height: 8, borderRadius: 4 }}
//                     />
//                     <Typography variant="caption" align="right" display="block" mt={0.5}>
//                       {data.assignment_effectiveness.assignment_completion_rate}%
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>

//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// }
