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
  Avatar
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
  DataObject
} from '@mui/icons-material';

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
const StatCard = ({ title, value, icon, subtext, color = "primary" }) => (
  <Card elevation={0} sx={{ height: '100%', borderRadius: 4, border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="text.secondary" variant="subtitle2" fontWeight="600" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>{title}</Typography>
          <Typography variant="h3" fontWeight="700" color="text.primary" sx={{ mt: 1, mb: 0.5 }}>{value}</Typography>
          {subtext && <Chip label={subtext} size="small" variant="outlined" sx={{ borderRadius: 1, height: 20, fontSize: '0.65rem', fontWeight: 'bold', borderColor: '#eee', bgcolor: '#fafafa' }} />}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}.light`, color: `${color}.main`, display: 'flex', opacity: 0.9 }}>{icon}</Box>
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPcbTimeline, setSelectedPcbTimeline] = useState(null);

  const DASHBOARD_API = "/supervisor/external/dashboard";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardUrl = apiBaseUrl + DASHBOARD_API;
        const response = await axios.get(dashboardUrl, { params: { staff_no: user?.id } });
        setData(response.data);
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

  return (
    <Box>
      {error && <Fade in={true}><Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert></Fade>}
      
      <Box mb={4}>
         <Chip icon={<DateRange />} label={new Date().toLocaleString()} size="small" sx={{ bgcolor: 'white', border: '1px solid #ddd' }} />
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Tasks Completed Today" value={data.pcb_summary.completed_today} subtext="Units Completed" icon={<CheckCircle fontSize="large" />} color="success" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Active PCB's" value={data.operational_health.wip_pcbs} subtext="Units on Line" icon={<Engineering fontSize="large" />} color="primary" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Pcbs Completed" value={data.pcb_summary.completed} subtext="Total Output" icon={<CheckCircle fontSize="large" />} color="success" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="InAction PCB's" value={data.pcb_summary.inaction} subtext="Idle Units" icon={<Engineering fontSize="large" />} color="primary" /></Grid>
      </Grid>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Box p={3} borderBottom="1px solid #f0f0f0" display="flex" justifyContent="space-between"><Typography variant="h6" fontWeight="800" color="#333">Production Queue</Typography><Chip label="Live Tracking" color="success" size="small" variant="outlined" /></Box>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['Serial No', 'Part Number', 'Stage', 'Operator', 'Status'].map(h => <TableCell key={h} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>{h}</TableCell>)}
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
      </Paper>

      {/* Timeline Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        {selectedPcbTimeline && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <Box><Typography variant="h6">Production History</Typography><Chip size="small" label={selectedPcbTimeline.Serial_No} /></Box>
                <Button onClick={() => setDialogOpen(false)}><CloseIcon /></Button>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#f8f9fa', p: 3 }}>
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}><DetailItem label="Desc" value={selectedPcbTimeline.Description} /></Grid>
                        <Grid item xs={3}><DetailItem label="Order" value={selectedPcbTimeline.Production_Order} /></Grid>
                        <Grid item xs={3}><DetailItem label="Type" value={selectedPcbTimeline.Type} /></Grid>
                        <Grid item xs={3}><DetailItem label="Steps" value={selectedPcbTimeline.ope_log_details?.length} /></Grid>
                    </Grid>
                </Paper>
                <Stepper orientation="vertical" activeStep={-1}>
                    {selectedPcbTimeline.ope_log_details?.map((step, index) => (
                        <Step key={index} expanded>
                            <StepLabel>{step.Task_Name}</StepLabel>
                            <StepContent>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'white' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Stack direction="row" spacing={1}><Avatar sx={{ width: 24, height: 24 }}><Person fontSize='small'/></Avatar><Typography variant="body2">{step.operator_name}</Typography></Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6} textAlign="right">
                                             <Typography variant="caption">{formatTime(step.start_time).split(',')[1]} - {formatTime(step.end_time).split(',')[1]}</Typography>
                                        </Grid>
                                        <Grid item xs={12} mt={1}>
                                            {step.log_Data && Object.entries(step.log_Data).map(([k, v]) => <Chip key={k} label={`${k}: ${v}`} size="small" sx={{ mr: 1 }} variant="outlined" />)}
                                        </Grid>
                                    </Grid>
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