

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
  StepContent,
  Tabs,
  Tab
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
import {

  BarChart as BarChartIcon,

  TableChart as TableChartIcon
} from '@mui/icons-material';
import ProductionLiveDashboard from '../SuperExternalDashboard/ProductionLiveDashboard';
import AnalyticalDashboard from '../SuperExternalDashboard/AnalyticalDashboard';

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

const SupervisorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Timeline/Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPcbTimeline, setSelectedPcbTimeline] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
  let user = JSON.parse(localStorage.getItem("user"));

  // --- CONFIGURATION ---
  var DASHBOARD_API = "/supervisor/external/dashboard";
  var API3="/supervisor/typepcbdetails"
  // Base IP
  var fetchDashBase = "http://192.168.1.12:8000";
  var fetachTypePcbDetails="http://192.168.0.20:2000" + API3 
  
  if (configDetails !== undefined) {
    if (configDetails.project?.[0]?.ServerIP?.[0]?.PythonServerIP !== undefined) {
      fetchDashBase = configDetails.project[0].ServerIP[0].PythonServerIP;
      fetachTypePcbDetails = configDetails.project[0].ServerIP[0].PythonServerIP + API3
    }
  }

  // --- 1. FETCH DASHBOARD DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardUrl = fetchDashBase + DASHBOARD_API;
        
        // Uncomment below for real Dashboard API
        const response = await axios.get(dashboardUrl, { params: { staff_no: user?.id } });
        setData(response.data);
        
        // Using Mock Data for Dashboard
        // setData(MOCK_DATA);
        setLoading(false);
        
      } catch (err) {
        // console.error("Dashboard API Error:", err);
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
        // console.log(`Fetching timeline for ${serialNo} from ${timelineUrl}`);
        
        const response = await axios.get(timelineUrl, { 
            params: { SerialNo: serialNo } 
        });

        // console.log("Timeline Response:", response.data);
        setSelectedPcbTimeline(response.data);
        setDialogOpen(true);

    } catch (err) {
        // console.error("Failed to fetch timeline:", err);
        setSelectedPcbTimeline(MOCK_TIMELINE_RESPONSE); 
        setDialogOpen(true);
    }
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


  const handleCardClick = async (title) => {
    const requestParams = { staff_no: user?.id, type: title };
    setLoading(true);
    try {
      // console.log("requestParams: ", requestParams);
      const response = await axios.get(fetachTypePcbDetails, { params: requestParams });
      const data = response.data;
      // console.log("Data from API:", data);
      if (!data || data.length === 0) {
        setDialogContent(
          <Box>
            No PCB data available for this type.
          </Box>
        );
        setDialogTitle(data.Serial_No);
        setOpenDialog(true);
        return; // Exit if there's no data
      }
      if (Array.isArray(data)) {
        setDialogContent(
          <Box>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Serial No</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Part Number</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Production Order</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Type</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => ( // Use index as the key ONLY if no other reliable key exists
                  // console.log("data: ",data),
                    <TableRow key={item.serialNo || item.Serial_No || index}> {/* Use index as the last resort */}
                      <TableCell>{item.Serial_No || item.serialNo || 'N/A'}</TableCell>
                      <TableCell>{item.Part_Number || item.partNumber || 'N/A'}</TableCell>
                      <TableCell>{item.Production_Order || item.productionOrder || 'N/A'}</TableCell>
                      <TableCell>{item.Type || item.type || 'N/A'}</TableCell>
                      <TableCell>{item.Description || item.description || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      } else {
        setDialogContent(<Box>Invalid Data Format</Box>);
        setDialogTitle("Error");
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
      setDialogContent(<Box>Error fetching details: {error.message}</Box>);
      setDialogTitle("Error");
    } finally {
      setLoading(false);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setOpenDialog(false);
    setSelectedPcbTimeline(null);
  };




  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', minHeight: '100vh', paddingBottom: 4 }}>
      
      {/* Navigation Bar */}

    {/* Added by Priya on 16-01-2026 */}
      <Tabs
      value={activeTab}
      onChange={handleTabChange}
      textColor="primary"
      indicatorColor="primary"
      sx={{ flexGrow: 0 }} // Important: Remove excessive flex-grow
    >
      <Tab icon={<TableChartIcon fontSize='small' />} iconPosition="start" label="Live Production" sx={{ fontWeight: 'bold' }} />
      <Tab icon={<BarChartIcon fontSize='small' />} iconPosition="start" label="Analytics" sx={{ fontWeight: 'bold' }} />

    </Tabs>


    <Container maxWidth="xl" sx={{ py: 4 }}>
        {activeTab === 0 && (
          <ProductionLiveDashboard 
            apiBaseUrl={fetchDashBase} 
            user={user} 
          />
        )}
        
        {/* Pass API props to Analytics now */}
        {activeTab === 1 && (
          <AnalyticalDashboard 
            apiBaseUrl={fetchDashBase} 
            user={user}
          />
        )}
      </Container>
    


      {/* <Container maxWidth="xl" sx={{ py: 4 }}>
        
    
        {error && (
            <Fade in={true}>
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Fade>
        )}



       
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

     
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper  onClick={()=>handleCardClick('Completed')}>
            <StatCard 
              title="Tasks Completed Today" 
              value={data.pcb_summary.completed_today} 
              subtext="Units Completed"
              icon={<CheckCircle fontSize="large" />} 
              color="success" />
            </Paper>
            
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
            <Paper  onClick={()=>handleCardClick('Assigned')}>
            <StatCard 
              title="Tasks WIP PCBs" 
              value={data.operational_health.wip_pcbs} 
              subtext="Units Completed"
              icon={<CheckCircle fontSize="large" />} 
              color="success" />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper  onClick={()=>handleCardClick('Inaction')}>
            <StatCard 
              title="Tasks InAction PCBs" 
              value={data.pcb_summary.inaction} 
              subtext="Units Completed"
              icon={<CheckCircle fontSize="large" />} 
              color="success" />
            </Paper>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <DialogTitle>{dialogTitle}</DialogTitle>
                                <DialogContent>
                                  <Typography>{dialogContent}</Typography>
                                </DialogContent>
                              </Dialog>
          </Grid>
        </Grid>

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
      </Container> */}

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
                  <Typography variant="h5" fontWeight="bold">PCB Production Tracker</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <Chip label={`Serial Number: ${selectedPcbTimeline.Serial_No}`} color="primary" size="small" />
                    <Chip label={`Part Number: ${selectedPcbTimeline.Part_Number}`} variant="outlined" size="small" />
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
                             <DetailItem label="Total Steps Completed" value={selectedPcbTimeline.ope_log_details?.length || 0} />
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
                    <Chip label="PROCESS EXECUTION TIMELINE" size="small" sx={{fontWeight:'bold',alignItems:"center"}} />
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
                                                    <DataObject fontSize="inherit" sx={{ mr: 0.5 }} /> PROCESS DATA
                                                </Typography>
                                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, height: '100%' }}>
                                                    {/* <Box mb={2}>
                                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', mb: 0.5 }}>
                                                            Key Reference
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                            {step.PCBserialNoPartNumber}
                                                        </Typography>
                                                    </Box> */}
                                                    
                                                    {/* <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} /> */}

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
export default SupervisorDashboard;