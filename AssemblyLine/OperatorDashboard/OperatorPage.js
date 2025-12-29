

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Avatar,
  CardActionArea,
  Grid,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TableContainer,
  TablePagination,
  Button
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as FormIcon,
  Lock as LockIcon
} from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";


// Ensure this path matches your project structure
import ProcessFormPage from "./ProcessForms/ProcessFormPage";
import { useSelector } from "react-redux";

const API_URL = "http://192.168.0.20:2000/operator/view";

// --- 1. DUMMY DATA ---
const DUMMY_USER = {
  name: "Demo Operator",
  staffNumber: "OP-101"
};

const DUMMY_PCBS = [
  {
    "PCB Serial Number": "SN-2023-001",
    linkedOperations: [
      {
        "S.No": "1",
        "Operation Name": "Labelling & Traceability",
        assignedTo: ["OP-101"],
        status: "Pending",
        startTime: null,
        endTime: null
      }
    ]
  }
];

// --- Sub-Component: Form Dialog ---
const ProcessFormDialog = ({ open, setOpen, activeForm, currentUser, onSaveSuccess, FilteredData, actionType }) => {
  if (!activeForm) return null;
  // Assuming your big object is named 'activeForm'

  // 1. Find the specific task that matches the current step
  const currentTask = activeForm.tasks?.find(
    (task) => task.flowStepId === activeForm.currentStepId
  );

  // 2. Extract the log (safely handle if task isn't found)
  const operatorLog = currentTask ? currentTask.operator_Json_log : null;

  console.log(operatorLog);
  // Output: { cleaning_program_no: "t" }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#f5f5f5", borderBottom: 1, borderColor: "divider" }}>
        {actionType === 'start' ? "Start Task: " : "Complete Task: "}
        {activeForm.stageName} ({activeForm.pcbSerial})
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {console.log("active form: ",activeForm)}
        <ProcessFormPage
          pcbSerial={activeForm.pcbSerial}
          stageId={activeForm.stageId+1}
          assignmentId={activeForm.assignmentid}
          FilteredData={FilteredData}
          actionType={actionType}
          onClose={() => setOpen(false)}
          operator={currentUser}
          // UPDATED: Pass existing log_Data if available in the row
          // initialLogData={activeForm.log_Data}
          initialLogData={operatorLog}


          onSaveComplete={() => {
            // Argument removed here ---------------------------------------vv
            onSaveSuccess(activeForm.pcbSerial, activeForm.flowStepId);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

// --- Sub-Component: Task Tabs View ---
const TaskTabsView = ({ currentUser, tableData = [], AllData = [], onOpenForm, onTriggerRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const groupedTasks = useMemo(() => {
    const groups = {};
    if (tableData && tableData.length > 0) {
      tableData.forEach((task) => {
        const id = task.flowStepId;
        if (!groups[id]) {
          groups[id] = {
            processName: task.processName || `Step ${id}`,
            items: []
          };
        }
        groups[id].items.push(task);
      });
    }
    return groups;
  }, [tableData]);

  const stepIds = Object.keys(groupedTasks).sort((a, b) => parseInt(a) - parseInt(b));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const activeStepId = stepIds[activeTab];
  const currentGroup = groupedTasks[activeStepId];

  const validRows = currentGroup
    ? currentGroup.items.filter(item => item.serialNo !== null && item.serialNo !== "null" && item.flowStepId == activeStepId)
    : [];

  // Calculate FilteredData (All Items for this step)
  const FilteredData = AllData.filter(item => item.currentStepId == activeStepId);

  // console.log("FilteredData", FilteredData)

  // --- Handlers for Buttons ---
  const handleStartClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: row.currentStepId - 1,
      stageName: row.processName,
      ...row,// This includes log_Data if it exists!

      if(onTriggerRefresh) {
        onTriggerRefresh();
      }
    };
    console.log("formData", formData)

    onOpenForm(formData, FilteredData, 'Start');
  };

  const handleCompleteClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: row.currentStepId - 1,
      stageName: row.processName,
      ...row // This includes log_Data if it exists!
    };
    onOpenForm(formData, FilteredData, 'complete');
  };

  if (stepIds.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No processes assigned.</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {stepIds.map((id) => (
            <Tab key={id} label={groupedTasks[id].processName} />
          ))}
        </Tabs>
      </Paper>

      <TableContainer component={Paper} elevation={1} sx={{ border: "1px solid #e0e0e0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>Step Order</strong></TableCell>
              <TableCell><strong>PCB Serial</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              {/* <TableCell><strong>Timing</strong></TableCell> */}
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {FilteredData.map((row, index) => {

              console.log("row", row)




              // const isDone = row.status === "Completed";

              // const inProgress = row.status === "Start" || row.status === "In Progress"||row.status === "STARTED";
              // const isLocked = row.canExecute === false;


              //             const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);

              // // 2. GET THE STATUS from that task
              // const status = activeTask?.status || "Pending"; // e.g., "STARTED"

              // // 3. Use this status for your logic
              // const isDone = status === "Completed";
              // const isStarted = status === "STARTED" || status === "Start" || status === "In Progress";
              // const isLocked = row.canExecute === false;

              // // 4. Also get the Log Data correctly for the button check
              // const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
              // const isLogFilled = logLength > 0;








              const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);
              // console.log("active task: ",activeTask)
              // console.log("status: ",status)
              // Default to empty string to avoid null/undefined issues
              const status = activeTask?.status || "";
              console.log("active status: ",activeTask.status)

              // 2. Define Explicit States
              const isDone = status === "Completed";
              // STRICT check: Only these exact strings count as "Started"
              const isStarted = status === "STARTED" || status === "Start" || status === "In Progress";
              const isLocked = row.canExecute === true;

              // 3. Define Enable Logic
              // The button is ENABLED only if:
              // - It is actually started
              // - AND it is not done yet
              const canComplete = isStarted && !isDone && !isLocked;

              // 4. Also get Log Data for Start Button
              const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
              const isLogFilled = logLength > 0;

              return (
                <TableRow key={index} hover>
                  <TableCell>{row.currentStepId}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{row.serialNo}</Typography>
                    {isLocked && (
                      <Chip icon={<LockIcon />} label="Locked" size="small" sx={{ mt: 0.5 }} />
                    )}
                  </TableCell>

                  {/* <TableCell>
                    <Chip 
                      label={row.status || "Pending"} 
                      color={isDone ? "success" : inProgress ? "warning" : "default"}
                      size="small" 
                      variant={inProgress ? "filled" : "outlined"}
                    />
                  </TableCell> */}

                  <TableCell>
                    <Chip
                      label={status}
                      color={isDone ? "success" : isStarted ? "warning" : "default"}
                      size="small"
                      variant={isStarted ? "filled" : "outlined"}
                    />
                  </TableCell>

                  {/* <TableCell>
                    <Stack spacing={0.5}>
                       {row.start_time ? (
                         <Typography variant="caption" display="block">
                           Start: {new Date(row.start_time).toLocaleTimeString()}
                         </Typography>
                       ) : <Typography variant="caption" color="text.secondary">-</Typography>}
                       
                       {row.end_time ? (
                         <Typography variant="caption" color="success.main" display="block">
                           End: {new Date(row.end_time).toLocaleTimeString()}
                         </Typography>
                       ) : null}
                    </Stack>
                  </TableCell> */}







                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">

                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        // Disable if: Log is filled OR Locked OR Done
                        disabled={isLogFilled || isLocked || isDone}
                        onClick={() => handleStartClick(row)}
                      >
                        Start
                      </Button>

                      <Button
                        variant={isDone ? "outlined" : "contained"}
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}

                        // --- UPDATED LOGIC ---
                        // If it is NOT 'canComplete', then it must be disabled.
                        // But we also want to allow "View" mode if it is done.
                        disabled={!canComplete && !isDone}
                        // ---------------------

                        onClick={() => handleCompleteClick(row)}
                      >
                        {isDone ? "View" : "Complete"}
                      </Button>

                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            {validRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                    No active PCBs found for {currentGroup?.processName}.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={validRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

// --- Main Page Component ---
const OperatorPage = ({ inActionPCBs, updateInActionPCBs, onLogout }) => {



  let user = JSON.parse(localStorage.getItem("user"));
  const activeUser = user || DUMMY_USER;

  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentStepIdAllData, SetcurrentStepIdAllData] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)


  var API = "/operator/view"
  var fetchOperatorApi = "http://172.195.121.91:2000" + API
  

  if (configDetails != undefined) {

    if (configDetails.project[0].ServerIP != undefined) {

      if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {

        fetchOperatorApi = configDetails.project[0].ServerIP[0].PythonServerIP + API
  
      }


    }

  }

  // Fetch API Data
  useEffect(() => {
    if (!user?.id) return;

    const requestParams = { staff_no: user?.id };
    setLoading(true);

    axios.get(fetchOperatorApi, { params: requestParams })
      .then((response) => {
        const tasks = response.data.pcbs[0]?.tasks || [];
        setTableData(tasks);
        setLoading(false);
        SetcurrentStepIdAllData(response.data.pcbs)
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [user?.id, refreshCounter]);

  const [localPCBs, setLocalPCBs] = useState([]);

  useEffect(() => {
    if (inActionPCBs && inActionPCBs.length > 0) {
      setLocalPCBs(inActionPCBs);
    } else {
      setLocalPCBs(DUMMY_PCBS);
    }
  }, [inActionPCBs, refreshCounter]);



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

  // UPDATED: Accept savedFormData to update local state
  // const handleSaveSuccess = async (pcbSerial, flowStepId, savedFormData) => {
  //   const now = new Date().toISOString();

  //   // 1. Update tableData
  //   setTableData((prevData) => {
  //       return prevData.map(item => {
  //           if (item.serialNo === pcbSerial && item.flowStepId === flowStepId) {
  //               return { 
  //                   ...item, 
  //                    status: actionType === 'complete' ? "Completed" : "In Progress", 
  //                    end_time: actionType === 'complete' ? now : item.end_time,
  //                    start_time: item.start_time || now,
  //                    // Store the form data locally!
  //                    log_Data: savedFormData || item.log_Data
  //               };
  //           }
  //           return item;
  //       });
  //   });

  //   // 2. Update currentStepIdAllData (Source of Truth for Table)
  //   SetcurrentStepIdAllData((prevData) => {
  //     return prevData.map(item => {
  //         // Check both flowStepId OR currentStepId for safety
  //         if (item.serialNo === pcbSerial && (item.flowStepId === flowStepId || item.currentStepId === flowStepId)) {
  //             return { 
  //                 ...item, 
  //                  status: actionType === 'complete' ? "Completed" : "In Progress", 
  //                  end_time: actionType === 'complete' ? now : item.end_time,
  //                  start_time: item.start_time || now,
  //                  // Store the form data locally!
  //                  log_Data: savedFormData || item.log_Data
  //             };
  //         }
  //         return item;
  //     });
  //   });

  //   setSnackbar({ open: true, msg: "Task updated successfully!" });
  // };
  // Argument removed --------------------------------vv
  const handleSaveSuccess = async (pcbSerial, flowStepId) => {
    const now = new Date().toISOString();

    // 1. Update tableData
    setTableData((prevData) => {
      return prevData.map(item => {
        if (item.serialNo === pcbSerial && item.flowStepId === flowStepId) {
          return {
            ...item,
            status: actionType === 'complete' ? "Completed" : "In Progress",
            end_time: actionType === 'complete' ? now : item.end_time,
            start_time: item.start_time || now
            // log_Data line is deleted!
          };
        }
        return item;
      });
    });

    // 2. Update currentStepIdAllData
    SetcurrentStepIdAllData((prevData) => {
      return prevData.map(item => {
        if (item.serialNo === pcbSerial && (item.flowStepId === flowStepId || item.currentStepId === flowStepId)) {
          return {
            ...item,
            status: actionType === 'complete' ? "Completed" : "In Progress",
            end_time: actionType === 'complete' ? now : item.end_time,
            start_time: item.start_time || now
            // log_Data line is deleted!
          };
        }
        return item;
      });
    });
    handleTriggerRefresh();
    setSnackbar({ open: true, msg: "Task updated successfully!" });
  };

  const handleTriggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={5}>
            <Card
              elevation={3}
              sx={{ borderRadius: 4, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' } }}
            >
              <CardActionArea onClick={() => setSelectedView('tasks')} sx={{ height: '100%', p: 4 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 80, height: 80, mb: 3, mx: 'auto' }}>
                    <FormIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>My Tasks</Typography>
                  <Typography color="text.secondary">View assigned stages and process pending PCBs.</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  };

  const THEME = {
    bg: "#f8fafc",
    primary: "#1e293b",
    accent: "#f59e0b",
    cardBg: "#ffffff",
    textSecondary: "#64748b"
  };

  if (loading) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Loading tasks...</Box>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f4f6f8" }}>

      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          {selectedView ? (
            <IconButton onClick={() => setSelectedView(null)} color="primary" sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" sx={{ mr: 2, cursor: "default" }}>
              <Avatar sx={{ bgcolor: THEME.accent, color: "black", mr: 2, fontWeight: 'bold' }}>O</Avatar>
            </IconButton>
          )}

          <Typography variant="h6" sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 600,
          }}>
            {selectedView === 'tasks' ? "My Tasks" : "Operator Dashboard"}
          </Typography>

          <Typography variant="caption" sx={{ mr: 2, color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
            Logged in as: {user?.id}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {selectedView === 'tasks' ? (
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 1, minHeight: "80vh" }}>
            {renderContent()}
          </Box>
        ) : (
          renderContent()
        )}
      </Box>

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
        <Alert severity="success" variant="filled">{snackbar.msg}</Alert>
      </Snackbar>

    </Box>
  );
};

export default OperatorPage;