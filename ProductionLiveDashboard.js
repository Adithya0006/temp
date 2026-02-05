import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
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
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Stack,
  Avatar,
  Tab,
  Tabs,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Engineering,
  DateRange,
  Assessment,
  Close as CloseIcon,
  Person,
  AccessTime,
  Timer,
  VerifiedUser,
  DataObject,
  Clear
} from '@mui/icons-material';
import { useSelector } from 'react-redux/es/exports';
import PCBTable from './PCBTable';
// import { Tabs } from 'antd';
// import { Tab } from 'bootstrap';

// --- MOCK DATA ---
const MOCK_DATA = {
  meta: { generated_at: new Date().toISOString() },
  pcb_summary: { completed_today: 45, completed: 130, inaction: 0 },
  operational_health: { wip_pcbs: 5 },
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
      "log_Data": { "pcb_date_code": "78", "label_gr_details": "UKYU" },
      "operator_name": "SANTOSH KUMAR",
      "operator_MRL": "MRL-6",
      "userRole": "Operator",
      "start_time": "2025-12-31T21:36:01.730000",
      "Task_Status": "Completed",
      "PCBserialNoPartNumber": "32401$62005774DA",
      "operator_staff_no": "E169",
      "userID": "E169",
      "operator_initial": "SNK",
      "operator_MRL_Expiry": "427.0",
      "userName": "Santosh Kumar",
      "end_time": "2025-12-31T21:36:10.298000"
    }
  ],
  "Durations": [8.568]
};

// --- HELPER COMPONENTS ---
const StatCard = ({ title, value, icon, subtext, color = "primary", isUnique = false, isActive = false }) => (
  <Card 
    elevation={isActive ? 6 : 1} 
    sx={{ 
      height: '100%', 
      borderRadius: 4, 
      // Effect: Active card gets a blue border and subtle lift
      border: isActive ? `2px solid #1976d2` : '1px solid #e0e0e0',
      // Unique styling: 'Completed Today' gets a distinctive soft green background
      bgcolor: isUnique ? '#f0fdf4' : 'white',
      transition: 'all 0.2s ease-in-out',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      cursor: 'pointer'
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          {/* Classic Text Style: All-caps, bold, standardized sizing */}
          <Typography 
            color="text.secondary" 
            variant="caption" 
            fontWeight="700" 
            sx={{ letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight="800" 
            color={isUnique ? "success.main" : "text.primary"} 
            sx={{ mt: 0.5, mb: 0.5 }}
          >
            {value}
          </Typography>
          {subtext && (
            <Chip 
              label={subtext} 
              size="small" 
              variant="outlined" 
              sx={{ borderRadius: 1, height: 20, fontSize: '0.65rem', fontWeight: '700', borderColor: '#eee', bgcolor: '#fafafa' }} 
            />
          )}
        </Box>
        <Box 
          sx={{ 
            p: 1.2, 
            borderRadius: 2.5, 
            bgcolor: isUnique ? 'success.light' : `${color}.light`, 
            color: isUnique ? 'success.main' : `${color}.main`, 
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

const DetailItem = ({ label, value, highlight = false }) => (
  <Box mb={1.5}>
    <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5 }}>{label}</Typography>
    <Typography variant="body2" fontWeight={highlight ? 700 : 500} sx={{ wordBreak: 'break-word' }}>{value || '-'}</Typography>
  </Box>
);

const ProductionLiveDashboard = ({ apiBaseUrl, user }) => {
  const [tabValue, setTabValue] = useState(0);

const handleTabChange = (event, newValue) => {
  setTabValue(newValue);
};

  const [data, setData] = useState(null);
  const [tabledata,setTableData]=useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPcbTimeline, setSelectedPcbTimeline] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
    // --- CHANGE 1: New state for inline table data ---

    
  const [activeCategoryData, setActiveCategoryData] = useState(null);
  const [liveCategoryData, setLiveCategoryData] = useState(true);

  const [activeCategoryTitle, setActiveCategoryTitle] = useState('');

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  const DASHBOARD_API = "/supervisor/external/dashboard";
  var API3 = "/supervisor/typepcbdetails"
  var fetachTypePcbDetails = "http://192.168.0.20:2000" + API3

  if (configDetails !== undefined) {
    if (configDetails.project?.[0]?.ServerIP?.[0]?.PythonServerIP !== undefined) {
      // fetchDashBase = configDetails.project[0].ServerIP[0].PythonServerIP;
      fetachTypePcbDetails = configDetails.project[0].ServerIP[0].PythonServerIP + API3
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardUrl = apiBaseUrl + DASHBOARD_API;
        const response = await axios.get(dashboardUrl, { params: { staff_no: user?.id } });
        console.log("sup ext data: ", response.data)
        setData(response.data);
        setTableData(response?.data?.pcbs)
        // setData(MOCK_DATA); // Fallback
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Live connection failed. Using local cached data.");
        setData(MOCK_DATA);
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl, user?.id]);

  const handlePcbClick = async (serialNo) => {
    try {
      const timelineUrl = `${apiBaseUrl}/timeline`;
      const response = await axios.get(timelineUrl, { params: { SerialNo: serialNo } });
      setSelectedPcbTimeline(response.data);
      // setSelectedPcbTimeline(MOCK_TIMELINE_RESPONSE); 
      setDialogOpen(true);
    } catch (err) {
      setSelectedPcbTimeline(MOCK_TIMELINE_RESPONSE);
      setDialogOpen(true);
    }
  };

  const formatTime = (isoString) => isoString ? new Date(isoString).toLocaleString() : "--:--";
  const getStatusColor = (status) => {
    switch (status) { case 'IN_PROGRESS': return 'primary'; case 'COMPLETED': return 'success'; case 'STUCK': return 'error'; default: return 'default'; }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setOpenDialog(false);
    setSelectedPcbTimeline(null);
  };


  // const handleCardClick = async (title) => {
  //   const requestParams = { staff_no: user?.id, type: title };
  //   setLoading(true);
  //   try {
  //     console.log("requestParams: ", requestParams);
  //     const response = await axios.get(fetachTypePcbDetails, { params: requestParams });
  //     const data = response.data;
  //     console.log("Data from API:", data);
  //     if (!data || data.length === 0) {
  //       setDialogContent(
  //         <Box>
  //           No PCB data available for this type.
  //         </Box>
  //       );
  //       setDialogTitle(data.Serial_No);
  //       setOpenDialog(true);
  //       return; // Exit if there's no data
  //     }
  //     if (Array.isArray(data)) {
  //       setDialogContent(
  //         <Box>
  //           <TableContainer component={Paper}>
  //             <Table aria-label="simple table">
  //               <TableHead>
  //                 <TableRow>
  //                   <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Serial No</TableCell>
  //                   <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Part Number</TableCell>
  //                   <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Production Order</TableCell>
  //                   <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Type</TableCell>
  //                   <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Description</TableCell>
  //                 </TableRow>
  //               </TableHead>
  //               <TableBody>
  //                 {data.map((item, index) => ( // Use index as the key ONLY if no other reliable key exists
  //                   console.log("data: ", data),
  //                   <TableRow key={item.serialNo || item.Serial_No || index}> {/* Use index as the last resort */}
  //                     <TableCell>{item.Serial_No || item.serialNo || 'N/A'}</TableCell>
  //                     <TableCell>{item.Part_Number || item.partNumber || 'N/A'}</TableCell>
  //                     <TableCell>{item.Production_Order || item.productionOrder || 'N/A'}</TableCell>
  //                     <TableCell>{item.Type || item.type || 'N/A'}</TableCell>
  //                     <TableCell>{item.Description || item.description || 'N/A'}</TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </TableContainer>
  //         </Box>
  //       );
  //     } else {
  //       setDialogContent(<Box>Invalid Data Format</Box>);
  //       setDialogTitle("Error");
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setDialogContent(<Box>Error fetching details: {error.message}</Box>);
  //     setDialogTitle("Error");
  //   } finally {
  //     setLoading(false);
  //     setOpenDialog(true);
  //   }
  // };
 
   // --- CHANGE 2: Updated handleCardClick to set data for the inline table ---
   const handleCardClick = async (title) => {
    const requestParams = { staff_no: user?.id, type: title };
    setLoading(true);
    try {
      const response = await axios.get(fetachTypePcbDetails, { params: requestParams });
      const responseData = response.data;
      
      if (Array.isArray(responseData)) {
        setActiveCategoryData(responseData);
        setActiveCategoryTitle(title);
        setLiveCategoryData(null);
        
      } else {
        setActiveCategoryData([]); // Handle empty or unexpected format
        setActiveCategoryTitle(title);
        setLiveCategoryData(null);

        

      }
    } catch (error) {
      console.error('Error fetching card data:', error);
      setActiveCategoryData(null);
      setLiveCategoryData(null);

    } finally {
      setLoading(false);

    }
  };


  
  const tooltipMessages = {
    Completed: "Number of tasks of PCBs completed today.",
    Assigned: "View details of PCBs currently present in Assembly Line",
    Total: " Total number of PCBs Completed.",
    Inaction: "PCBs yet to be  assigned to operators",
    New: "View details of PCBs present in the master list.",
  };
  return (
    <Box>
      {error && <Fade in={true}><Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert></Fade>}

      {/* --- UPDATED METRICS GRID SECTION --- */}
      <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
        
        {/* Metric 1: Tasks Completed Today (UNIQUE) */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Tooltip 
            title={tooltipMessages.Completed} 
            sx={{'& .MuiTooltip-tooltip': { backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'black', fontSize: '0.9rem', padding: '8px 12px', borderRadius: '4px' }}}
          >
            <Box onClick={() => handleCardClick('Completed')}>
              <StatCard
                title="Tasks Completed Today"
                value={data.pcb_summary.completed_today}
                subtext="Count of Tasks"
                icon={<CheckCircle fontSize="small" />}
                isUnique={true} 
                isActive={activeCategoryTitle === 'Completed'}
              />
            </Box>
          </Tooltip>
        </Grid>

        {/* Metric 2: In-Progress */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Tooltip title={tooltipMessages.Assigned}>
            <Box onClick={() => handleCardClick('Assigned')}>
              <StatCard
                title="In-progress PCB's"
                value={data.operational_health.wip_pcbs}
                subtext="Units on Line"
                icon={<Engineering fontSize="small" />}
                color="primary"
                isActive={activeCategoryTitle === 'Assigned'}
              />
            </Box>
          </Tooltip>
        </Grid>

        {/* Metric 3: Total Completed */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Tooltip title={tooltipMessages.Total}>
            <Box>
              <StatCard
                title="Total Pcbs Completed"
                value={data.pcb_summary.completed}
                subtext="Total Output"
                icon={<Assessment fontSize="small" />}
                color="success"
                isActive={activeCategoryTitle === 'Total'} // Logic placeholder if you want to click it
              />
            </Box>
          </Tooltip>
        </Grid>

        {/* Metric 4: Yet to Start */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Tooltip title={tooltipMessages.Inaction}>
            <Box onClick={() => handleCardClick('Inaction')}>
              <StatCard
                title="Yet To Start"
                value={data.pcb_summary.inaction}
                subtext="Idle Units"
                icon={<Timer fontSize="small" />}
                color="primary"
                isActive={activeCategoryTitle === 'Inaction'}
              />
            </Box>
          </Tooltip>
        </Grid>

        {/* Metric 5: Master List */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Tooltip title={tooltipMessages.New}>
            <Box onClick={() => handleCardClick('New')}>
              <StatCard
                title="PCBs in Master List"
                value={data.pcb_summary.new || 0}
                subtext="Count of New PCBs"
                icon={<DataObject fontSize="small" />}
                color="info"
                isActive={activeCategoryTitle === 'New'}
              />
            </Box>
          </Tooltip>
        </Grid>
      </Grid>

      {/* --- INLINE TABLE SECTION --- */}
      {activeCategoryData && (
        <Fade in={true}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #1976d2', overflow: 'hidden', mb: 4 }}>
            <Box p={2} bgcolor="#e3f2fd" display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="800" color="primary.main">
                Detailed View: {activeCategoryTitle}
              </Typography>
              <IconButton size="small" onClick={() => {setActiveCategoryData(null); setLiveCategoryData(true); setActiveCategoryTitle('');}}>
                <Clear color="error" />
              </IconButton>
            </Box>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: '700', bgcolor: '#f1f5f9' }}>Serial No</TableCell>
                    <TableCell sx={{ fontWeight: '700', bgcolor: '#f1f5f9' }}>Part Number</TableCell>
                    <TableCell sx={{ fontWeight: '700', bgcolor: '#f1f5f9' }}>Production Order</TableCell>
                    <TableCell sx={{ fontWeight: '700', bgcolor: '#f1f5f9' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: '700', bgcolor: '#f1f5f9' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCategoryData.length > 0 ? activeCategoryData.map((item, index) => (
                    <TableRow key={item.serialNo || item.Serial_No || index} hover>
                      <TableCell>{item.Serial_No || item.serialNo || 'N/A'}</TableCell>
                      <TableCell>{item.Part_Number || item.partNumber || 'N/A'}</TableCell>
                      <TableCell>{item.Production_Order || item.productionOrder || 'N/A'}</TableCell>
                      <TableCell>{item.Type || item.type || 'N/A'}</TableCell>
                      <TableCell>{item.Description || item.description || 'N/A'}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No PCB data available for this type.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Fade>
      )}

      {/* --- LIVE TRACEABILITY SECTION --- */}
      {liveCategoryData && (
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <Box p={3} borderBottom="1px solid #f0f0f0" sx={{textAlign:"center"}}>
            <Typography variant="h6" fontWeight="800" color="#333">Live Traceability</Typography>
          </Box>
          <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ px: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Tab label="Live PCB Status" />
            <Tab label="Stage Wise Pcb Tracebility" />
          </Tabs>

          {tabValue === 0 && (
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {['Serial No', 'Part Number', 'Stage', 'Active Status of Operator', 'Status'].map(h => (
                      <TableCell key={h} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.pcbs?.map((pcb) => (
                    <TableRow key={pcb.pcb_serial} hover onClick={() => handlePcbClick(pcb.serial_no)} sx={{ cursor: 'pointer' }}>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>{pcb.serial_no}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{pcb.part_number}</TableCell>
                      <TableCell>{pcb.current_step}</TableCell>
                      <TableCell>{pcb.operator?.name}</TableCell>
                      <TableCell><Chip label={pcb.status} color={getStatusColor(pcb.status)} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <Box p={2}><PCBTable pcbData={tabledata} /></Box>
          )}
        </Paper>
      )}

      {/* --- TIMELINE DIALOG --- */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3, minHeight: '70vh' } }}>
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
                <Button variant='contained' onClick={handleCloseDialog} sx={{ minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.75rem', textTransform: 'none' }}>
                  <CloseIcon sx={{ fontSize: 18, mr: 0.5 }} /> Close
                </Button>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ py: 3, px: 4, bgcolor: '#f8f9fa' }}>
              <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', bgcolor: 'white' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4} lg={3}><DetailItem label="Description" value={selectedPcbTimeline.Description} highlight /></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}><DetailItem label="Production Order" value={selectedPcbTimeline.Production_Order} highlight /></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}><DetailItem label="Type" value={selectedPcbTimeline.Type} /></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}><DetailItem label="Total Steps Completed" value={selectedPcbTimeline.ope_log_details?.length || 0} /></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}><DetailItem label="Assigned Time" value={formatTime(selectedPcbTimeline.Assigned_time)} /></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}><DetailItem label="Created At (New)" value={formatTime(selectedPcbTimeline.New_Time)} /></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}><DetailItem label="Last Update (Inaction)" value={formatTime(selectedPcbTimeline.Inaction_time)} /></Grid>
                </Grid>
              </Paper>

              <Divider sx={{ mb: 3 }} textAlign="left">
                <Chip label="PROCESS EXECUTION TIMELINE" size="small" sx={{ fontWeight: 'bold' }} />
              </Divider>

              <Stepper orientation="vertical" activeStep={selectedPcbTimeline.ope_log_details?.length || 0} sx={{ px: 2 }}>
                {selectedPcbTimeline.ope_log_details?.map((step, index) => (
                  <Step key={index} expanded>
                    <StepLabel StepIconProps={{ style: { color: step.Task_Status === 'Completed' ? '#2e7d32' : '#1976d2' } }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>{step.Task_Name}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Paper elevation={0} sx={{ p: 0, bgcolor: 'white', border: '1px solid #ddd', borderRadius: 2, mt: 1, overflow: 'hidden' }}>
                        <Box p={2} bgcolor="#fcfcfc" borderBottom="1px solid #eee">
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#e3f2fd', color: '#1976d2' }}><Person fontSize="small" /></Avatar>
                                <Box><Typography variant="caption" display="block" color="text.secondary">Operator Name</Typography><Typography variant="body2" fontWeight="600">{step.operator_name}</Typography></Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#f3e5f5', color: '#9c27b0' }}><AccessTime fontSize="small" /></Avatar>
                                <Box><Typography variant="caption" display="block" color="text.secondary">Start & End Time</Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{formatTime(step.start_time).split(',')[1]} - {formatTime(step.end_time).split(',')[1]}</Typography></Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#e8f5e9', color: '#2e7d32' }}><Timer fontSize="small" /></Avatar>
                                <Box><Typography variant="caption" display="block" color="text.secondary">Duration</Typography>
                                <Typography variant="body2" fontWeight="600">{selectedPcbTimeline.Durations?.[index] !== undefined ? `${parseFloat(selectedPcbTimeline.Durations[index]).toFixed(2)}s` : 'N/A'}</Typography></Box>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box p={3}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                              <Typography variant="caption" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><VerifiedUser fontSize="inherit" sx={{ mr: 0.5 }} /> OPERATOR DETAILS</Typography>
                              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fbff', borderRadius: 2 }}>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}><DetailItem label="Staff No" value={step.operator_staff_no} /></Grid>
                                  <Grid item xs={6}><DetailItem label="User ID" value={step.userID} /></Grid>
                                  <Grid item xs={6}><DetailItem label="Username" value={step.userName} /></Grid>
                                  <Grid item xs={6}><DetailItem label="Role" value={step.userRole} /></Grid>
                                  <Grid item xs={6}><DetailItem label="MRL Level" value={step.operator_MRL} /></Grid>
                                  <Grid item xs={6}><DetailItem label="MRL Expiry" value={step.operator_MRL_Expiry} /></Grid>
                                  <Grid item xs={6}><DetailItem label="Initials" value={step.operator_initial} /></Grid>
                                </Grid>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Typography variant="caption" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><DataObject fontSize="inherit" sx={{ mr: 0.5 }} /> PROCESS DATA</Typography>
                              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, height: '100%' }}>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', mb: 1 }}>Captured Parameters</Typography>
                                {step.log_Data && Object.keys(step.log_Data).length > 0 ? (
                                  <Box display="flex" flexWrap="wrap" gap={1}>
                                    {Object.entries(step.log_Data).map(([key, val]) => (
                                      <Chip key={key} label={`${key}: ${val}`} size="small" variant="outlined" sx={{ borderRadius: 1, bgcolor: '#fafafa', fontWeight: 500 }} />
                                    ))}
                                  </Box>
                                ) : ( <Typography variant="caption" fontStyle="italic" color="text.secondary">No dynamic parameters logged.</Typography> )}
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

      {/* Legacy Dialog fallback for handleCardClick */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
            <Typography>{dialogContent}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductionLiveDashboard;