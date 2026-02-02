
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Snackbar, Alert, AppBar, Toolbar, IconButton, Container, Avatar,
  CardActionArea, Grid, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  Stack, TableContainer, TablePagination, Button, Badge,
  Divider
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Lock as LockIcon,
  AccountCircle,
  FactCheck as FactCheckIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Activity, LayoutDashboardIcon } from "lucide-react";
import ProcessFormPage from "./ProcessForms/ProcessFormPage";
import OperatorAnalyticsDashboard from "./OperatorAnalyticsDashboard";

// --- Configuration & Constants ---
const API_URL = "http://192.168.0.20:2000/operator/view";
const DUMMY_USER = { name: "Demo Operator", staffNumber: "OP-101" };
const DUMMY_PCBS = [];

// --- NEW UI THEME CONSTANTS ---
const UI_THEME = {
  primary: "#4f46e5", // Modern Indigo
  secondary: "#10b981", // Emerald Green
  bg: "#f8fafc", // Slate 50
  cardBg: "#ffffff",
  headerBg: "#ffffff",
  tableHeader: "#f1f5f9",
};

/**
 * Component: ProcessFormDialog
 * Description: Pop-up modal that contains the ProcessFormPage.
 */
const ProcessFormDialog = ({ open, setOpen, activeForm, currentUser, onSaveSuccess, FilteredData, actionType }) => {
  if (!activeForm) return null;

  // Extract log data if available
  const currentTask = activeForm.tasks?.find(
    (task) => task.flowStepId === activeForm.currentStepId
  );
  const operatorLog = currentTask ? currentTask.operator_Json_log : null;

  return (
    <Dialog 
      open={open} 
      onClose={() => setOpen(false)} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' } // Rounded corners for modal
      }}
    >
      <DialogTitle sx={{ bgcolor: UI_THEME.tableHeader, borderBottom: 1, borderColor: "divider", py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FactCheckIcon color="primary" />
          <Typography variant="h6" fontWeight="bold" color="#334155">
             {actionType === 'start' ? "Start Task" : actionType === 'view' ? "View Task" : "Execute Task"}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
           {activeForm.stageName} • SN: <b>{activeForm.pcbSerial}</b>
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, bgcolor: "#fafafa" }}>
        <ProcessFormPage
          pcbSerial={activeForm.pcbSerial}
          stageId={activeForm.stageId+1} // Adjust for backend index if needed
          assignmentId={activeForm.assignmentid}
          FilteredData={FilteredData}
          actionType={actionType}
          onClose={() => setOpen(false)}
          operator={currentUser}
          initialLogData={operatorLog}
          onSaveComplete={(serial, stepId) => {
            // Callback when saving is done. 
            const s = serial || activeForm.pcbSerial;
            const step = stepId || activeForm.flowStepId;
            onSaveSuccess(s, step); // Triggers parent refresh
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

/**
 * Component: TaskTabsView
 * Description: Displays the tabs for different process steps and the table of PCBs.
 */
const TaskTabsView = ({ currentUser, tableData = [], AllData = [], onOpenForm, onTriggerRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Group tasks by Step ID
  const groupedTasks = useMemo(() => {
    const groups = {};
    if (tableData && tableData.length > 0) {
      tableData.forEach((task) => {
        const id = task.flowStepId;
        if (!groups[id]) {
          groups[id] = { processName: task.processName || `Step ${id}`, items: [], count: 0 };
        }
        // Count items currently AT this step
        AllData.forEach((tabcount)=>{
          if(task.flowStepId === tabcount.currentStepId){
            groups[id].count++;
          }
        })
        groups[id].items.push(task);    
      });
    }
    return groups;
  }, [tableData, AllData]);

  const stepIds = Object.keys(groupedTasks).sort((a, b) => parseInt(a) - parseInt(b));
  
  const activeStepId = stepIds[activeTab];
  // Filter: Show only PCBs that are CURRENTLY at the active step
  const FilteredData = AllData.filter(item => item.currentStepId == activeStepId);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleStartClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: row.currentStepId - 1,
      stageName: row.processName,
      ...row,
    };
    if(onTriggerRefresh) onTriggerRefresh();
    onOpenForm(formData, FilteredData, 'Start');
  };

  const handleCompleteClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: row.currentStepId - 1,
      stageName: row.processName,
      ...row
    };
    onOpenForm(formData, FilteredData, 'complete');
  };

  if (stepIds.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1px dashed #ccc" }}>
        <Typography variant="h6" color="text.secondary">No active tasks assigned to you.</Typography>
        <Typography variant="body2" color="text.disabled">Enjoy your break!</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* --- Styled Tabs --- */}
      <Paper elevation={0} sx={{ mb: 3, borderBottom: 1, borderColor: '#e2e8f0', bgcolor: 'transparent' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#64748b',
              minHeight: 48,
              '&.Mui-selected': { color: UI_THEME.primary },
            },
            '& .MuiTabs-indicator': { backgroundColor: UI_THEME.primary, height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          {stepIds.map((id) => (
            <Tab
              key={id}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{groupedTasks[id].processName}</span>
                  <Chip 
                    label={groupedTasks[id].count} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      bgcolor: activeTab === stepIds.indexOf(id) ? UI_THEME.primary : '#e2e8f0',
                      color: activeTab === stepIds.indexOf(id) ? 'white' : '#475569'
                    }} 
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* --- Task Table --- */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>SNO</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>PCB Serial Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Current Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569',textAlign:"center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {FilteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {

              const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);
              const status = activeTask?.status || "";
              
              // Define State Logic
              const isDone = status === "Completed";
              const isStarted = status === "STARTED" || status === "Start" || status === "In Progress";
              const isLocked = row.canExecute === true; 
              
              // Enable "Complete" if started, not done, and not locked
              const canComplete = isStarted && !isDone && !isLocked;
              
              // Check if logs exist
              const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
              const isLogFilled = logLength > 0;

              return (
                <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ color: '#64748b' }}>
                    {(page * rowsPerPage) + index + 1}
                  </TableCell>
                  
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography fontWeight="600" color="#334155">{row.serialNo}</Typography>
                      {isLocked && <Chip icon={<LockIcon sx={{ fontSize: '14px !important' }}/>} label="Locked" size="small" color="error" variant="outlined"/>}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {/* Status Badge */}
                    <Chip
                      label={status || "Pending"}
                      sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.75rem',
                        bgcolor: isDone ? '#dcfce7' : isStarted ? '#fef3c7' : '#f1f5f9',
                        color: isDone ? '#166534' : isStarted ? '#b45309' : '#475569',
                        border: '1px solid',
                        borderColor: isDone ? '#bbf7d0' : isStarted ? '#fde68a' : '#e2e8f0'
                      }}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      
                      {/* START BUTTON */}
                      <Button
                        variant={isStarted ? "text" : "contained"}
                        color="primary"
                        size="small"
                        startIcon={isStarted ? null : <PlayArrowIcon />}
                        disabled={isLogFilled || isLocked || isDone}
                        onClick={() => handleStartClick(row)}
                        sx={{ 
                           borderRadius: 2, 
                           textTransform: 'none', 
                           boxShadow: 'none',
                           opacity: (isLogFilled || isDone) ? 0.5 : 1
                        }}
                      >
                        {isStarted ? "Started" : "Start"}
                      </Button>

                      {/* COMPLETE / VIEW BUTTON */}
                      <Button
                        variant={isDone ? "outlined" : "contained"}
                        color={isDone ? "inherit" : "success"}
                        size="small"
                        startIcon={isDone ? <VisibilityIcon /> : <CheckCircleIcon />}
                        disabled={!canComplete && !isDone}
                        onClick={() => handleCompleteClick(row)}
                        sx={{ 
                          borderRadius: 2, 
                          textTransform: 'none', 
                          fontWeight: 'bold',
                          boxShadow: isDone ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                          borderColor: '#cbd5e1'
                        }}
                      >
                        {isDone ? "View Log" : "Execute"}
                      </Button>

                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {FilteredData.length === 0 && (
              <TableRow>
                 <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                   No PCBs in this stage yet.
                 </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={FilteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
             setRowsPerPage(parseInt(e.target.value, 10));
             setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

/**
 * Component: OperatorPage
 * Description: Main Dashboard container. Handles API Data Fetching.
 */
const OperatorPage = ({ inActionPCBs, updateInActionPCBs, onLogout }) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const activeUser = user || DUMMY_USER;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStepIdAllData, SetcurrentStepIdAllData] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [cardcount, setCardCount] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);

  // --- Dynamic API Configuration ---
  var API = "/operator/view";
  var API1="/operatordashboard"
  var fetchOperatorApi = "http://172.195.121.91:2000" + API;
  var opdashboard="http://172.195.121.91:2000" + API1;

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    fetchOperatorApi = configDetails.project[0].ServerIP[0].PythonServerIP + API;
    opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
  }

  // --- Fetch API Data ---
  useEffect(() => {
    if (!user?.id) return;
    const requestParams = { staff_no: user?.id };
    setLoading(true);
    axios.get(fetchOperatorApi, { params: requestParams })
      .then((response) => {
        const tasks = response.data.pcbs[0]?.tasks || [];
        console.log("data on page: ",response)
        setTableData(tasks);
        setLoading(false);
        SetcurrentStepIdAllData(response.data.pcbs);
        setCardCount(response.data.pcbs.length);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [user?.id, refreshCounter]);


  useEffect(() => {
  if (!user?.id) return;
  
  // Existing logic for tableData...

  // New fetch for Analytics
  axios.get(opdashboard, { params: { staff_no: user.id } })
    .then((res) => {
      setAnalyticsData(res.data);
    })
    .catch((err) => console.error("Analytics fetch error:", err));
}, [user?.id, refreshCounter]);



  // --- UI State ---
  const [selectedView, setSelectedView] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [activeFormData, setActiveFormData] = useState(null);
  const [activeFilteredData, setActiveFilteredData] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "" });

  const handleOpenForm = (row, filteredData, type) => {
    setActiveFormData(row);
    setActiveFilteredData(filteredData);
    setActionType(type);
    setOpenFormDialog(true);
  };

  const handleSaveSuccess = async (pcbSerial, flowStepId) => {
    // Refresh Logic: Increment counter to trigger useEffect re-fetch
    setRefreshCounter(prev => prev + 1);
    setSnackbar({ open: true, msg: "Task updated successfully!" });
  };

  const handleTriggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  // --- Dashboard Renderer ---
const renderContent = () => {
  if (selectedView === 'tasks') {
    return (
      <TaskTabsView
        currentUser={activeUser}
        tableData={tableData}
        AllData={currentStepIdAllData}
        onOpenForm={handleOpenForm}
        onTriggerRefresh={handleTriggerRefresh}
      />
    );
  }

  return (
    <Box sx={{ width: '100%', px: 1 }}>
      <Grid container spacing={2} alignItems="stretch">
        {/* Left Navigation Card - Sized for perfect alignment */}
        <Grid item xs={12} lg={3}>
          <Card
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 4, 
              border: "1px solid #e2e8f0",
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#ffffff',
              transition: "all 0.2s ease-in-out",
              "&:hover": { borderColor: "#4f46e5", boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }
            }}
          >
            <CardActionArea 
              onClick={() => setSelectedView('tasks')} 
              sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}
            >
              <Box sx={{
                p: 2,
                borderRadius: '50%',
                bgcolor: '#eef2ff',
                display: 'inline-flex',
                mb: 2
              }}>
                <LayoutDashboardIcon size={32} color="#4f46e5" />
              </Box>
              
              <Typography variant="h6" fontWeight="800" color="#1e293b">
                My Production Tasks
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Process and log pending PCBs
              </Typography>

              <Divider sx={{ width: '100%', mb: 3 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h2" fontWeight="900" color="#4f46e5" lineHeight={1}>
                  {cardcount}
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  PCBS IN QUEUE
                </Typography>
              </Box>

              <Box sx={{ mt: 'auto', width: '100%', py: 1.2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                <Typography variant="caption" fontWeight="bold" color="#4f46e5">
                  START TASK EXECUTION →
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Right Analytics Dashboard */}
        <Grid item xs={12} lg={9}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: '#ffffff' }}>
            {analyticsData ? (
              <OperatorAnalyticsDashboard data={analyticsData} />
            ) : (
              <Box sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                <Activity className="animate-pulse" size={40} color="#94a3b8" />
                <Typography variant="body2" color="text.secondary">Loading Production Insights...</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

  // --- Main Layout Render ---
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f1f5f9" }}>

      {/* Top Navbar */}
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          {selectedView && (
            <IconButton onClick={() => setSelectedView(null)} color="primary" sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', flexGrow: 1 }}>
            {selectedView === 'tasks' ? "My Dashboard" : "Operator Dashboard"}
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>
                    {user.userRole || "Operator"}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {user.id}
                </Typography>
            </Box>
            <Avatar sx={{ bgcolor: UI_THEME.primary, fontWeight: 'bold' }}>
                {user.username ? user.username[0].toUpperCase() : <AccountCircle />}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 3, maxWidth: '1600px', mx: 'auto', width: '100%' }}>
        {selectedView === 'tasks' ? (
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: 4, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)", minHeight: "80vh" }}>
            {renderContent()}
          </Box>
        ) : (
          renderContent()
        )}
      </Box>

      {/* Dialogs and Popups */}
      <ProcessFormDialog
        open={openFormDialog}
        setOpen={setOpenFormDialog}
        activeForm={activeFormData}
        currentUser={activeUser}
        FilteredData={activeFilteredData}
        actionType={actionType}
        onSaveSuccess={handleSaveSuccess}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 3 }}>{snackbar.msg}</Alert>
      </Snackbar>

    </Box>
  );
};

export default OperatorPage;