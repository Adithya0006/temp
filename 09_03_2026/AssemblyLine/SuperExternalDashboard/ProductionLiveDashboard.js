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
  IconButton,
  
} from '@mui/material';
import { ArrowBack, AssignmentTurnedIn, Autorenew, Inventory, PauseCircleOutline, TaskAlt } from '@mui/icons-material';
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
  Clear,
  TabletAndroidOutlined,

} from '@mui/icons-material';
import { useSelector } from 'react-redux/es/exports';
import PCBTable from './PCBTable';
import { BackpackIcon } from 'lucide-react';
import { fontWeight } from '@mui/system';
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
    elevation={isActive ? 150 : 1} 
    sx={{ 
      height: '100%', 
      borderRadius: 4, 
      border: isActive ? `2px solid #1976d2` : '2px solid #e0e0e0',
      bgcolor: isUnique ? '#f0fdf4' : 'white',
      transition: 'all 0.2s ease-in-out',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      cursor: 'pointer',
      fontWeight:"Bold",
      fontSize:"1rem"
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          {/* Classic Text Style: All-caps, bold, standardized sizing */}
          <Typography 
            color="black" 
            fontWeight="700" 
            sx={{  textTransform: 'uppercase', fontSize: '0.75rem' }}
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
         
              sx={{  height: 20, fontSize: '0.75rem', fontWeight: '700' }} 
            />
          )}
        </Box>
        <Box 
          sx={{ 
            p: 1.2, 
            borderRadius: 2.5, 
            // bgcolor: isUnique ? 'success.light' : `${color}.light`, 
            // color: isUnique ? 'success.main' : `${color}.main`, 
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
    <Typography  display="block" color="black" sx={{ textTransform: 'uppercase', fontSize: '1rem', letterSpacing: 0.5 }}>{label}</Typography>
    <Typography variant="body2" fontWeight="bold"  sx={{ wordBreak: 'break-word' }}>{value || '-'}</Typography>
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
  const [tableTitle,setTableTitle]=useState('')
  const [showTimeLine,setShowTimeLine]=useState(false)
  // const [clickedcompletedcard,setclickedcompletedcard]=useState(f)
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
        // console.log("sup ext data: ", response.data)
        setData(response.data);
        setTableData(response?.data?.pcbs)
        // setData(MOCK_DATA); // Fallback
        setLoading(false);
      } catch (err) {
        // console.error(err);
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
      // console.log("pcbsnpt: ",serialNo)
      const response = await axios.get(timelineUrl, { params: { SerialNo : serialNo } });
      setSelectedPcbTimeline(response.data);
      // setSelectedPcbTimeline(MOCK_TIMELINE_RESPONSE); 
      setDialogOpen(true);
    } catch (err) {
      setSelectedPcbTimeline(MOCK_TIMELINE_RESPONSE);
      setDialogOpen(true);
    }
  };


  const handlePcbClick1 = async (serialno,showTimeLine) => {
    console.log("showTimeLine: ",showTimeLine)
    if (showTimeLine === false){
      return
    } 
    try {
      // console.log("am inside!")
      // const serialNo=serialno + "$" + partNumber
      const timelineUrl = `${apiBaseUrl}/completed_timeline`;
      // console.log("pcbsnpt: ",serialNo)
      const response = await axios.get(timelineUrl, { params: { SerialNo : serialno } });
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

 
   // --- CHANGE 2: Updated handleCardClick to set data for the inline table ---
   const handleCardClick = async (title) => {
 
    const requestParams = { staff_no: user?.id, type: title };
    setLoading(true);
    try {
      const response = await axios.get(fetachTypePcbDetails, { params: requestParams });
      const responseData = response.data;
      
      if (Array.isArray(responseData)) {
        setActiveCategoryData(responseData);
        if(title == "Inaction"){
          setActiveCategoryTitle("Inaction")
          setTableTitle("Yet to Start")
          setLiveCategoryData(null);
          setShowTimeLine(false)
        }
        else if(title=="New"){
          setActiveCategoryTitle("New")
          setTableTitle("Yet to Assign")
          setLiveCategoryData(null);
          setShowTimeLine(false)
        }
        else if(title=="Assigned"){
          setActiveCategoryTitle("In Progress PCBs")
          setTableTitle("In Progress PCBs")
          setLiveCategoryData(null);
          setShowTimeLine(true)
        }
        else if(title=="COMPLETED"){
          setActiveCategoryTitle("Total")
          setTableTitle("Total PCBs Built")
          setLiveCategoryData(null);
          setShowTimeLine(true)
        }
        else{
          setActiveCategoryTitle("Completed Today");
          setTableTitle("Total PCBs Tasks Completed Today")
          setLiveCategoryData(null);
          setShowTimeLine(false)
        }
       
      } else {

        setActiveCategoryData([]); // Handle empty or unexpected format
        setActiveCategoryTitle(title);
        setLiveCategoryData(null);

        

      }
    } catch (error) {
      // console.error('Error fetching card data:', error);
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

  const cardIdentifier = {
    card1:"1",
    card2:"2",
    card3:"3",
    card4:"4"
  }
  return (
    <Box>
      {error && <Fade in={true}><Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert></Fade>}
<Grid container spacing={3} sx={{ mb: 2, width: '100%' }}>
  {/* SECTION 1: Focus Metric */}
  <Grid item xs={12} md={3}>
    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, borderLeft: '4px solid #2e7d32' }}>
      <Box p={2}>
        <Typography  sx={{ fontWeight: 700, color: 'black', letterSpacing: 1 }}>
          Daily Performance
        </Typography>
        <Tooltip title={tooltipMessages.Completed}>
          <Box onClick={() => handleCardClick('Today')} sx={{ cursor: 'pointer', mt: 1 }}>
            <StatCard
              title="Tasks Completed Today"
              value={data.pcb_summary.completed_today}
              subtext="Count of Tasks"
              icon={<TaskAlt fontSize="large" sx={{ color: '#2e7d32' }} />} // Deep Success Green
              isUnique={true} 
              isActive={activeCategoryTitle === 'Completed Today'}
            />
          </Box>
        </Tooltip>
      </Box>
    </Card>
  </Grid>

  {/* SECTION 2: Operational Health Group */}
  <Grid item xs={12} md={9}>
    <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#fafafa' }}>
      <Box p={2}>
        <Typography  sx={{ fontWeight: 700, color: 'black', letterSpacing: 1 }}>
          PCBs Inventory
        </Typography>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          
          {/* In-progress - Refined Indigo instead of Blue */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title={tooltipMessages.Assigned}>
              <Box onClick={() => handleCardClick('Assigned')} sx={{ cursor: 'pointer',bgcolor: '#f0f2ff'}}>
                <StatCard
                  title="In-progress"
                  value={data.operational_health.wip_pcbs}
                  subtext={"Units on Line"}
                  icon={<Autorenew fontSize="large" sx={{ color: '#5c6bc0' }} />} // Indigo/Steel Blue
                  isActive={activeCategoryTitle === 'In Progress PCBs'}
                />
              </Box>
            </Tooltip>
          </Grid>

          {/* Total Completed - Emerald/Teal */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title={tooltipMessages.Total} >
              <Box onClick={() => handleCardClick('COMPLETED')} sx={{ cursor: 'pointer' }}>
                <StatCard
                  title="Total Completed"
                  value={data.pcb_summary.completed}
                  subtext="Total Output"
                  icon={<AssignmentTurnedIn fontSize="large" sx={{ color: '#00897b' }} />} // Teal
                  isActive={activeCategoryTitle === 'Total'}
                />
              </Box>
            </Tooltip>
          </Grid>

          {/* Yet to Start - Warm Amber */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title={tooltipMessages.Inaction}>
              <Box onClick={() => handleCardClick('Inaction')} sx={{ cursor: 'pointer' }}>
                <StatCard
                  title="Yet To Start"
                  value={data.pcb_summary.inaction}
                  subtext="Idle Units"
                  icon={<PauseCircleOutline fontSize="large" sx={{ color: '#ffa000' }} />} // Amber
                  isActive={activeCategoryTitle === 'Inaction'}
                />
              </Box>
            </Tooltip>
          </Grid>

          {/* Master List - Slate Grey */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title={tooltipMessages.New}>
              <Box onClick={() => handleCardClick('New')} sx={{ cursor: 'pointer' }}>
                <StatCard
                  title="YET TO ASSIGN"
                  value={data.pcb_summary.new || 0}
                  subtext="New PCBs"
                  icon={<Inventory fontSize="large" sx={{ color: '#546e7a' }} />} // Slate Blue-Grey
                  isActive={activeCategoryTitle === 'New'}
                />
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </Card>
  </Grid>
</Grid>



    {/* --- CHANGE 3: Inline Table Section (Conditional Rendering) --- */}
    {activeCategoryData && (
        <Fade in={true} >
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #1976d2', overflow: 'hidden', mb: 4 }}>
            <Box p={2} bgcolor="#e3f2fd" display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="800" color="primary.main">
                Detailed View: {tableTitle}
              </Typography>
              {/* <IconButton size="small" onClick={() => {setActiveCategoryData(null);setLiveCategoryData(true)}}> */}
              <Button variant='contained' size='small' onClick={() => {setActiveCategoryData(null);setLiveCategoryData(true)}} sx={{width:"12rem"}}  >
                Back To Dashboard
                </Button>
                {/* <Clear color="error" /> */}
              {/* </IconButton> */}
            </Box>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="large">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Serial No</TableCell>
                    <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Part Number</TableCell>
                    <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Production Order</TableCell>
                    <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Type</TableCell>
                    <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{fontWeight:"bold"}}>
                  {activeCategoryData.length > 0 ? activeCategoryData.map((item, index) => (
                    
                    <TableRow key={item.serialNo || item.Serial_No || index } onClick={() => handlePcbClick1(item.Serial_No,showTimeLine)} hover>
                      {showTimeLine?(<TableCell sx={{ color: 'primary.main', fontWeight: 'bold',textDecoration:"underline",cursor:"pointer"}}>{item.Serial_No || item.serialNo || 'N/A'}</TableCell>):(
                        <TableCell sx={{ color: 'black', fontWeight: 'bold'}}>{item.Serial_No || item.serialNo || 'N/A'}</TableCell>
                      )}
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.Part_Number || item.partNumber || 'N/A'}</TableCell>
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.Production_Order || item.productionOrder || 'N/A'}</TableCell>
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.Type || item.type || 'N/A'}</TableCell>
                      <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.Description || item.description || 'N/A'}</TableCell>
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




{liveCategoryData && (

<Paper
  elevation={0}
  sx={{
    borderRadius: 4,
    border: '1px solid #e0e0e0',
    overflow: 'hidden'
  }}
>
  {/* Header */}
 
  <Box
    p={3}
    borderBottom="1px solid #f0f0f0"
    // display="flex"
    justifyContent="space-between"
    alignItems="center"
    sx={{textAlign:"center"}}
  >
    <Typography  fontWeight="800" color="#333" sx={{textAlign:"center",fontSize:"1.25rem"}}>
     LIVE TRACEABILITY
    </Typography>
    {/* <Chip label="Live Tracking" color="success" size="small" variant="outlined" /> */}
  </Box>
  {/* Tabs */}
  <Tabs
    value={tabValue}
    onChange={handleTabChange}
    indicatorColor="primary"
    textColor="primary"
    sx={{ px: 2, borderBottom: '1px solid #f0f0f0' }}
  >
    {/* <Tab label="Live PCB Status" sx={{color:"black",fontWeight:"bold"}}/> */}
    <Tab label="Stage Wise Pcb Tracebility"  sx={{color:"black",fontWeight:"bold"}} />
  </Tabs>

  {/* Tab 1 */}
  {/* {tabValue === 0 && (
    <TableContainer sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {['Serial No', 'Part Number', 'Stage', 'Active Status of Operator', 'Status'].map(h => (
              <TableCell
                key={h}
                sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {console.log("live prod data: ",data)}
          {data.pcbs?.map((pcb) => (
            <TableRow
              key={pcb.pcb_serial}
              hover
              onClick={() => handlePcbClick(pcb.pcb_serial)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold',textDecoration:"underline" }}>
                {pcb.serial_no}
              </TableCell>
              <TableCell sx={{opacity:0.8,fontWeight:600}}>
                {pcb.part_number}
              </TableCell>
              <TableCell sx={{opacity:0.8,fontWeight:600}}>{pcb.current_step}</TableCell>
              <TableCell sx={{opacity:0.8,fontWeight:600}}>{pcb.operator?.name}</TableCell>
              <TableCell>
                <Chip
                  label={pcb.status}
                  color={getStatusColor(pcb.status)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )} */}

  {/* Tab 2 */}
  {tabValue === 0 && (
    <Box p={2}>
      <PCBTable pcbData={tabledata} />
    </Box>
  )}
  
</Paper>

)}








      {/* Timeline Dialog */}
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
                  <Chip label={`Part Number: ${selectedPcbTimeline.Part_Number}`}  color="primary"size="small" />
                  <Chip label={`Serial Number: ${selectedPcbTimeline.Serial_No}`}  variant="outlined" size="small" />
                  </Stack>
                </Box>
                <Button variant='contained' size='small' onClick={handleCloseDialog} sx={{width:"12rem"}}  >
              <ArrowBack/> Live Production
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
                    <DetailItem sx={{fontWeight:"bold"}} label="Total Steps Completed" value={selectedPcbTimeline.ope_log_details?.length || 0} />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DetailItem label="Assigned Time" value={formatTime(selectedPcbTimeline.Assigned_time)} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DetailItem label="Created At (New)" value={formatTime(selectedPcbTimeline.New_Time)} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DetailItem label="Last Update" value={formatTime(selectedPcbTimeline.Inaction_time)} />
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ mb: 3 }} textAlign="left">
                <Chip label="PROCESS EXECUTION TIMELINE" size="small" sx={{ fontWeight: 'bold', alignItems: "center" }} />
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
                                  <Typography  display="block" color="black">Operator Name</Typography>
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
                                  <Typography  sx={{color:"black"}} display="block" color="black">Start & End Time</Typography>
                                  <Typography variant="body2" sx={{color:"black", fontFamily: 'monospace', fontSize: '0.75rem' }}>
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
                                  <Typography  display="block" color="black">Duration</Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {selectedPcbTimeline.Durations && selectedPcbTimeline.Durations[index] !== undefined
                                      ? `${parseFloat(selectedPcbTimeline.Durations[index]/60).toFixed(2)} minutes`
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
                              <Typography  fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                              <Typography  fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <DataObject fontSize="inherit" sx={{ mr: 0.5 }} /> PROCESS DATA
                              </Typography>
                              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, height: '100%' }}>

                                <Typography  display="block" color="black" sx={{ textTransform: 'uppercase', fontSize: '1rem', mb: 1 }}>
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
                                  <Typography  fontStyle="italic" color="black">
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

export default ProductionLiveDashboard;