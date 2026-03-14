
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Snackbar, Alert, AppBar, Toolbar, IconButton, Container, Avatar,
  CardActionArea, Grid, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  Stack, TableContainer, TablePagination, Button, Badge,
  Divider, TextField, styled
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
import { Activity, LayoutDashboardIcon, SearchIcon } from "lucide-react";
import ProcessFormPage from "./ProcessForms/ProcessFormPage";
import OperatorAnalyticsDashboard from "./OperatorAnalyticsDashboard";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from "@mui/icons-material/Close";
//import SearchIcon from '@mui/icons-material/Search'; // Importing the magnifying glass icon


// --- Configuration & Constants ---
const API_URL = "http://192.168.0.20:2000/operator/view";
const API_URL1= "http://192.168.0.20:2000/getequipment_consumables"
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
const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '20px', // Slightly rounded corners
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // More pronounced shadow
  overflow: 'hidden',
  height: 'fit-content',
  backgroundColor: 'white', // Ensure a clean background
}));

/**
 * Component: ProcessFormDialog
 * Description: Pop-up modal that contains the ProcessFormPage.
 */
const ProcessFormDialog = ({ open, setOpen, activeForm, currentUser, onSaveSuccess, FilteredData, actionType,handleFinalSubmission }) => {
  if (!activeForm) return null;

  // Extract log data if available
  const currentTask = activeForm.tasks?.find(
    (task) => task.flowStepId === activeForm.currentStepId
  );
  const operatorLog = currentTask ? currentTask.operator_Json_log : null;

  const handleDialogClose = () => {
  setOpen(false);
};

// Define common styles for TableCells
  const tableCellStyles = {
    fontWeight: 500,
    color: '#1e293b',
    fontSize: '0.75rem',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '12px 16px', // Consistent padding
  };

  const tableHeadStyles = {
    bgcolor: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    fontWeight: '800',
    fontSize: '0.95rem',
    textAlign: 'center',
    borderRadius: '10px 10px 0 0',
    padding: '12px 16px' //Consistent padding
  };

  const tableContainerStyles = {
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    height: 'fit-content',
  };

  return (


<Dialog 
  open={open} 
  onClose={() => setOpen(false)} 
  maxWidth="md" 
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      overflow: "hidden",
      background: "linear-gradient(145deg,#ffffff,#f8fafc)",
      boxShadow: "0 25px 60px rgba(0,0,0,0.15)"
    }
  }}
>
  
  {/* ===== HEADER ===== */}
  <DialogTitle
  sx={{
    position: "relative",
    px: 3,
    py: 2.5,
    background: "linear-gradient(90deg,#eef2ff,#f8fafc)",
    borderBottom: "1px solid #e2e8f0"
  }}
>

  {/* Accent Strip */}
  <Box
    sx={{
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "6px"
    }}
  />

  {/* Top Row (Icon + Title + Close Button) */}
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
  >
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >
        <FactCheckIcon color="primary" />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          letterSpacing: 0.3,
          color: "#1e293b"
        }}
      >
        {actionType === 'start'
          ? "Start Task"
          : actionType === 'view'
            ? "View Task"
            : "Execute Task"}
      </Typography>
    </Stack>

    {/* Close Button */}
    <Box
  sx={{
    position: "absolute",
    right: 16,
    top: 16
  }}
>
  <IconButton
    onClick={handleDialogClose}
    size="small"
    sx={{
      width: 36,
      height: 36,
      borderRadius: "12px",
      background: "rgba(120, 118, 118, 0.7)",
      backdropFilter: "blur(6px)",
      boxShadow: "0 4px 14px rgba(42, 39, 39, 0.08)",
      transition: "all 0.25s ease",
      color: "#711111",

      "&:hover": {
        background: "#9c2121",
        color: "#0c0a0a",
        transform: "scale(1.08) rotate(90deg)",
        boxShadow: "0 6px 18px rgba(220,38,38,0.25)"
      },

      "&:active": {
        transform: "scale(0.95)"
      }
    }}
  >
    <CloseIcon fontSize="medium" />
  </IconButton>
</Box>
  </Stack>

  {/* Subtitle Row */}
  <Typography
    variant="body2"
    sx={{
      mt: 1,
      color: "#475569",
      fontWeight: 500
    }}
  >
    {activeForm.stageName} • SN:
    <Box component="span" sx={{ fontWeight: 800, ml: 0.5 }}>
      {activeForm.pcbSerial}
    </Box>
  </Typography>

</DialogTitle>


  {/* ===== CONTENT ===== */}
   <DialogContent
    sx={{
      px: 0,
      py: 3,
      background: "linear-gradient(135deg,#ffffff,#f1f5f9)"
    }}
  > 

    {/* <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: "blue",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        border: "1px solid #e2e8f0"
      }}
    > */}

      {/* <ProcessFormPage
        pcbSerial={activeForm.pcbSerial}
        stageId={activeForm.stageId + 1}
        assignmentId={activeForm.assignmentid}
        FilteredData={FilteredData}
        actionType={actionType}
        onClose={() => setOpen(false)}
        operator={currentUser}
        
        initialLogData={operatorLog}
        onSaveComplete={(serial, stepId) => {
          const s = serial || activeForm.pcbSerial;
          const step = stepId || activeForm.flowStepId;
          onSaveSuccess(s, step);
          setOpen(false);
        }}
      /> */}


 
 <ProcessFormPage
    pcbSerial={activeForm.pcbSerial}
    stageId={activeForm.stageId + 1}
    assignmentId={activeForm.assignmentid}
    FilteredData={FilteredData}
    actionType={actionType}
    onClose={() => setOpen(false)}
    operator={currentUser}
    machineId={activeForm.machine_folder} // Pass machine_folder for auto-detection
    initialLogData={operatorLog}
    // Update this callback to receive the file
    onSaveComplete={(values, status, batchSerials, file) => {
        handleFinalSubmission(values, status, batchSerials, file);
    }}
/> 

   {/* </Box>*/}
  </DialogContent>

</Dialog>
  );
};



const CustomTabLabel = ({ name, count, isActive, isVertical }) => {
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      justifyContent={isVertical ? "space-between" : "center"} 
      spacing={1}
      sx={{ width: '100%', overflow: 'hidden' }} // Prevent overflow issues
    >
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 'inherit',
          whiteSpace: 'nowrap',       // Keep text on one line
          overflow: 'hidden',         // Hide overflow
          textOverflow: 'ellipsis',   // Add ... if it's STILL too long
          maxWidth: isVertical ? '220px' : 'auto', // Give text plenty of room
          textAlign: 'left'
        }}
      >
        {name}
      </Typography>
      
      <Chip 
        label={count} 
        size="small" 
        sx={{ 
          height: 20, 
          minWidth: 24, // Ensure chip has minimum width
          fontSize: '0.7rem', 
          fontWeight: 'bold',
          bgcolor: isActive ? UI_THEME.primary : '#e2e8f0',
          color: isActive ? 'white' : '#475569'
        }} 
      />
    </Stack>
  );
};



const TaskTabsView = ({ currentUser, tableData = [], AllData = [], onOpenForm, onTriggerRefresh }) => {
  // console.log("all data in paina: ",typeof(AllData))
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- Logic for Handlers ---
  const handleStartClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: (row.currentStepId || 1) - 1, // Safe fallback for calculation
      stageName: row.currentProcessName || "Unknown Stage",
      ...row,
    };
    if (onTriggerRefresh) onTriggerRefresh();
    onOpenForm(formData, AllData.filter(item => item.currentStepId == row.currentStepId), 'Start');
  };

  const handleCompleteClick = (row) => {
    const formData = {
      pcbSerial: row.serialNo,
      flowStepId: row.flowStepId,
      stageId: (row.currentStepId || 1) - 1, // Safe fallback for calculation
      stageName: row.currentProcessName || "Unknown Stage",
      ...row
    };
    onOpenForm(formData, AllData.filter(item => item.currentStepId == row.currentStepId), 'complete');
  };



  // Add this inside the OperatorPage component

  // Memoized grouping logic to avoid unnecessary re-renders
  const groupedTasks = useMemo(() => {
    tableData=AllData
    // console.log("all data: ",AllData)
    // console.log("tableData: ",tableData)
    const groups = {};
    // Safely iterate through the master tableData (the steps this operator is qualified for)
    if (tableData && tableData.length > 0) {
      tableData.forEach((task) => {
        if(task?.tasks.length > 0){
          // console.log("afnaonfouanfadnfn",task.tasks.flowStepId)
          task.tasks.forEach((task)=>{
            const id = task.flowStepId;
          if (!groups[id]) {
            groups[id] = { 
              processName: task.processName || `Step ${id}`, 
              count: 0, 
              hasStarted: false 
            };
          }
          })
          
        }
        
        
      });
    }

    // Tally actual PCB counts from the AllData array
    if (AllData && AllData.length > 0) {
      // console.log("groups: ",groups)
      AllData.forEach((item) => {
        if (item.currentStepId && groups[item.currentStepId]) {
          groups[item.currentStepId].count++;
          // Check if any specific unit in this group is already "Started"
          const activeTask = item.tasks?.find(t => t.flowStepId === item.currentStepId);
          if (["STARTED", "Start", "In Progress"].includes(activeTask?.status)) {
            groups[item.currentStepId].hasStarted = true;
          }
        }
      });
    }
    return groups;
  }, [tableData, AllData]);




  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  const [equi_conumDet,setequi_conumDet]=useState(null)
  // const [consumDet,setConsumDet]=useState(null)
  // --- Dynamic API Configuration ---
  var EQUPAPI = "/getequipment_consumables";
  // var API1="/operatordashboard"
  // var fetchOperatorApi = "http://172.195.121.91:2000" + API;
  var eq_com="http://172.195.121.91:2000" + EQUPAPI;

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    eq_com = configDetails.project[0].ServerIP[0].PythonServerIP + EQUPAPI;
    // opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
  }



  const stepIds = Object.keys(groupedTasks).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Handling layout splits for many tabs
  const MAX_LEFT = 10;
  const leftSideIds = stepIds.slice(0, MAX_LEFT);
  const rightSideIds = stepIds.length > MAX_LEFT ? stepIds.slice(MAX_LEFT) : [];

  const activeStepId = stepIds[activeTab];
  // console.log("activeStepId: ",activeStepId)
  // tempcall(activeStepId);







    useEffect(() => {
      const tempcall = async (activeStepId) => {
        const t1 = parseInt(activeStepId);
        // console.log("called tempcall: ", t1, typeof(t1));
  
        try {
          const data = await axios.get(eq_com, { params: { stageid: t1 } });
           // Log the actual data
          // Handle the data here, e.g., update state
          setequi_conumDet(data?.data)
          // global_equi_conumDet()
          // console.log("data from my api: ", equi_conumDet);
        } catch (e) {
          // console.error("Error fetching data:", e); // More informative error logging
        }
      };
  
      if (activeStepId !== undefined) { // Important: Check if stageid is defined
        tempcall(activeStepId);
      }
      else{
        console.warn("Stage ID is undefined.  Skipping API call.");
      }
  
    }, [activeStepId]); 
  
    // console.log("groupedTasks: ",groupedTasks)

  
  // Filter current stage data + search term safety
  const FilteredData = useMemo(() => {
    if (!activeStepId) return [];
    return AllData.filter(item => {
      const matchesStage = item.currentStepId == activeStepId;
      const matchesSearch = item.serialNo?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [AllData, activeStepId, searchTerm]);
  
  const getChipColor = (group) => {
    if (group.hasStarted) return "#ed6c02"; // Orange for In-Progress
    if (group.count > 0) return "#d32f2f";  // Red for Queued
    return "#2e7d32";                       // Green for Clear
  };

  const renderTabButton = (id) => {
    const index = stepIds.indexOf(id);
    const isActive = activeTab === index;
    const group = groupedTasks[id];
    // console.log("stepIds: ",stepIds)
    // console.log("tableData[0]: ",tableData)
    // console.log("clicked!")
    return (
    
      <Card
        key={id}
        onClick={() => { setActiveTab(index); setPage(0); setSearchTerm("") }}
        elevation={0}
        sx={{
          p: 1.5, mb: 1, cursor: 'pointer', borderRadius: 2,
          border: '1px solid',
          borderColor: isActive ? UI_THEME.primary : '#e2e8f0',
          bgcolor: isActive ? '#f0f7ff' : '#ffffff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          transition: 'all 0.2s ease',
          "&:hover": { borderColor: UI_THEME.primary, bgcolor: '#f8fafc' }
        }}
      >
        <Typography sx={{ 
    fontWeight: 800,        // Make fully bold
    fontSize: "0.75rem",    // Slightly clearer
    letterSpacing: 0.4,
    color: isActive ? "primary.main" : "#1e293b",
    textAlign:"left",
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: 1.2,
          pr: 1
        }}>
          {group.processName.toUpperCase()}
        </Typography>
        <Chip label={group.count} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: getChipColor(group), color: 'white', fontWeight: 'bold' }} />
      </Card>
    );
  };
 

  // --- CRITICAL: BLANK PAGE PROTECTION ---
  // console.log("stepIds: ",stepIds)
  if (stepIds.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
        <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom>
          No Active PCBs Allocated To Perform Operations
        </Typography>
      </Box>
    );
  }



return(
<Box
    sx={{
      width: "100%",
      minHeight: "100vh",
      p: 1,
      background: "linear-gradient(135deg,#f1f5f9,#eef2ff)"
    }}
  >
    <Grid container spacing={3}>

      {/* ====================== */}
      {/* MAIN CONTENT - SIDEBARS */}
      {/* ====================== */}

      <Grid item xs={12} md={3}>
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 4,
      height: "85vh",
      overflowY: "auto",
      background: "white",
      boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
    }}
  >

    {/* Header Section */}
    <Box sx={{ mb: 2, textAlign:"center" }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 800, color: "#1e293b" }}
      >
        STAGES
      </Typography>

      {/* Stack directly below title */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 1 }}
      >
        {[['#d32f2f', 'Queued'], ['#ed6c02', 'Started'], ['#2e7d32', 'Clear']].map(([color, label]) => (
          <Box
            key={label}
            sx={{ display: 'flex' ,alignItems: 'center', gap: 0.5 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: color
              }}
            />
            <Typography sx={{ fontSize: '0.66rem', fontWeight: 700 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Proper horizontal divider */}
      <Divider sx={{ mt: 1.5 }} />
    </Box>

    {/* Stage List */}
    {leftSideIds.map(id => renderTabButton(id))}

  </Paper>
</Grid>


      {/* ====================== */}
      {/* SUB CONTENT - CENTER */}
      {/* ====================== */}

      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}
        >

       <Box sx={{ mb: 4 }}>

  {/* Title */}
  <Typography
    variant="h5"
    sx={{
      fontWeight: 900,
      color: '#1e293b',
      letterSpacing: -0.5,
      textAlign: 'center'
    }}
  >
    {groupedTasks[activeStepId]?.processName.toUpperCase() || "SELECT A STAGE"}
  </Typography>

  {/* Total Units (Left) + Search (Right) */}
  <Box
    sx={{
      mt: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      ml:3
    }}
  >

    {/* Left Side - Total Units */}
    <Typography variant="body2" color="text.secondary">
      Total Units: <b>{FilteredData.length}</b>
    </Typography>

    {/* Right Side - Search */}
    <Paper
      elevation={3}
      sx={{
        p: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        width: 250,
        border: '1px solid #9c98d9',
        borderRadius: '12px',
        bgcolor: '#f7fafc',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          borderColor: UI_THEME.primary,
          boxShadow: '0 4px 16px rgba(79, 70, 229, 0.15)'
        },
        '&:focus-within': {
          borderColor: UI_THEME.primary,
          boxShadow: '0 4px 16px rgba(79, 70, 229, 0.15)'
        },
      }}
    >
      <SearchIcon sx={{ color: '#6b7280', mr: 2, fontSize: '1.5rem' }} />
      <input
        style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          borderRadius: '8px',
          padding: '2px 1px',
          fontSize: '0.95rem',
          fontWeight: '500',
          color: '#333',
        }}
        placeholder="Enter Serial Number to filter..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </Paper>

  </Box>
</Box>















{/* {equi_conumDet ? (
   <>
    {console.log("equi_conumDet: ",equi_conumDet," equi_conumDet[equi_conumDet.length -2] ",equi_conumDet[equi_conumDet.length -2]," active step id: ",activeStepId)}
    {equi_conumDet[equi_conumDet.length -2].is_euip_present === true && (
      <>

<Typography variant="body" sx={{ fontSize: "15px", fontWeight: "bold" }}>
      EQUIPMENT DETAILS
    </Typography>
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        height:"fit-content",
        
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Equipment Number
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Equipment Name
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Equipment Make
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Equipment Model
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Equipment Due Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {equi_conumDet.map((item, index) => ( 
             // Assuming you have equipmentList array

             item.eqpt_no && (
            <TableRow
              key={item.eqpt_no} // Use a unique key from the item
              hover
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { backgroundColor: "#f1f5f9" },
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.75rem",
                  textAlign: "center",
            
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_no}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.75rem",
                  textAlign: "center",
            
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_name}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.75rem",
                  textAlign: "center",
            
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_make}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.75rem",
                  textAlign: "center",
            
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_model}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.75rem",
                  textAlign: "center",
            
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_due_date}
              </TableCell>
            </TableRow>)
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>)}
 </>
):(<></>)

  }
 */}


{equi_conumDet ? (
   <>
  
    {equi_conumDet[equi_conumDet.length -2].is_euip_present === true && (
      <>
  
 <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, color: '#388eea'  }}>
      EQUIPMENT DETAILS
    </Typography>
    <TableContainer
      component={Paper}
      elevation={5}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // Increased shadow
        overflow: "hidden",
        height:"fit-content",
         backgroundColor: '#f5f5f5'
      }}
    >
      <Table stickyHeader size="small" aria-label="equipment table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                bgcolor: '#f0f7ff',  // Lighter green header background
                fontWeight: "700",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
                color: 'black', // Darker Green color for text
              }}
            >
              Equipment Number
            </TableCell>
            <TableCell
              align="center"
              sx={{
                bgcolor: '#f0f7ff',
                fontWeight: "700",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
                color: 'black',
              }}
            >
              Equipment Name
            </TableCell>
            <TableCell
              align="center"
              sx={{
                bgcolor: '#f0f7ff',
                fontWeight: "700",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
                color: '#black',
              }}
            >
              Equipment Make
            </TableCell>
            <TableCell
              align="center"
              sx={{
                bgcolor: '#f0f7ff',
                fontWeight: "700",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
                color: '#black',
              }}
            >
              Equipment Model
            </TableCell>
            <TableCell
              align="center"
              sx={{
                // bgcolor: '#c8e6c9',
                bgcolor: '#f0f7ff',
                fontWeight: "700",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
                color: '#black',
              }}
            >
              Equipment Due Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equi_conumDet.map((item, index) => (
            item.eqpt_no && (
            <TableRow
              key={item.eqpt_no} // Use a unique key from the item
              hover
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { backgroundColor: "#d1e8ff" }, //Light Blue on hover
              }}
            >
              <TableCell
                align="center"
                sx={{
                  fontWeight: 500,
                  color: "#333", // Darker text color
                  fontSize: "0.8rem",
                  textAlign: "center",
                  backgroundColor: "#fff", //White background
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_no}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 500,
                  color: "#333",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_name}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 500,
                  color: "#333",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_make}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 500,
                  color: "#333",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_model}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 500,
                  color: "#333",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.eqpt_due_date}
              </TableCell>
            </TableRow>)
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>)}
 </>
):(<></>)
  
  }
  {/* //conusmables table! */}




  
{/* {equi_conumDet ? (
   <>
    {console.log("equi_conumDet: ",equi_conumDet," equi_conumDet[equi_conumDet.length -2] ",equi_conumDet[equi_conumDet.length -2]," active step id: ",activeStepId)}
    {equi_conumDet[equi_conumDet.length -1].is_consumable_present === true && (
      <>

<Typography variant="body" sx={{ fontSize: "15px", fontWeight: "bold" }}>
      CONSUMABLE DETAILS
    </Typography>
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Consumable Material Number
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Consumable Material Name
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
            Consumable Material GR Number
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Consumable Material Year
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                fontWeight: "800",
                fontSize: "0.95rem",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                padding: "12px 16px",
              }}
            >
              Consumable Material Shelf Life
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {equi_conumDet.map((item, index) => (  // Assuming you have equipmentList array
          item.consumable_material_number && 
            (<TableRow
              key={item.consumable_material_number} // Use a unique key from the item
              hover
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { backgroundColor: "#f1f5f9" },
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "12px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.consumable_material_number}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "12px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.consumable_material_name}
              </TableCell>
             
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "12px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.consumable_gr_number}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "12px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.consumable_year}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#1e293b",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "12px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {item.consumable_shelf_life}
              </TableCell>
            </TableRow>)
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>)}
 </>
):(<></>)

  } */}

{equi_conumDet ? (
  <>
    {/* {console.log("equi_conumDet: ", equi_conumDet, " equi_conumDet[equi_conumDet.length -2] ", equi_conumDet[equi_conumDet.length - 2], " active step id: ", activeStepId)} */}
    {equi_conumDet[equi_conumDet.length - 1].is_consumable_present === true && (
      <>
        <Typography variant="h6" sx={{ ml: 2, mt: 2, fontSize: "1.2rem", fontWeight: "700", color: "#388eea", mb: 1 }}>
          CONSUMABLE DETAILS
        </Typography>

        <TableContainer
          component={Paper}
          elevation={5}
          sx={{
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            margin: "0 auto", // Center the table
            maxWidth: "95vw", // Ensure responsive width
            overflow: "hidden",
            mt: 1,
            mb: 3,
            height:"fit-content",
          }}
        >
          <Table stickyHeader size="small" aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "#f0f7ff",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    borderRadius: "12px 12px 0 0",
                    padding: "10px",
                    color: "#1a2027",
                    borderBottom: "2px solid #e0e3e5",
                  }}
                >
                  Consumable Material Number
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "#f0f7ff",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    borderRadius: "12px 12px 0 0",
                    padding: "10px",
                    color: "#1a2027",
                    borderBottom: "2px solid #e0e3e5",
                  }}
                >
                  Consumable Material Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "#f0f7ff",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    borderRadius: "12px 12px 0 0",
                    padding: "10px",
                    color: "#1a2027",
                    borderBottom: "2px solid #e0e3e5",
                  }}
                >
                  Consumable Material GR Number
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "#f0f7ff",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    borderRadius: "12px 12px 0 0",
                    padding: "10px",
                    color: "#1a2027",
                    borderBottom: "2px solid #e0e3e5",
                  }}
                >
                  Consumable Material Year
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "#f0f7ff",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    borderRadius: "12px 12px 0 0",
                    padding: "10px",
                    color: "#1a2027",
                    borderBottom: "2px solid #e0e3e5",
                  }}
                >
                  Consumable Material Shelf Life
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equi_conumDet.map((item, index) => (
                item.consumable_material_number && ( //Check for consumable_material_number before mapping
                  <TableRow
                    key={item.consumable_material_number} // Use consumable_material_number as the key
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0  },
                      "&:hover": { backgroundColor: "#f5faff" }, // A slightly darker hover color
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 500,
                        color: "#2f4858",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        padding: "1px",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {item.consumable_material_number}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 500,
                        color: "#2f4858",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        padding: "1px",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {item.consumable_material_name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 500,
                        color: "#2f4858",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        padding: "1px",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {item.consumable_gr_number}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 500,
                        color: "#2f4858",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        padding: "1px",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {item.consumable_year}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 500,
                        color: "#2f4858",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        padding: "1px",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {item.consumable_shelf_life}
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )}
  </>
) : (
  <></>
)}
















        

          {/* Table */}
          <Typography variant="h6" sx={{ ml: 2, mt: 2, fontSize: "1.2rem", fontWeight: "700", color: "green", mb: 1 }}>
      ASSIGNED PCBs
    </Typography>
    <TableContainer component={Paper} elevation={8} sx={{
      borderRadius: '24px',
      border: 'none',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      maxWidth: '100%', // Ensure it fits within the page
      margin: '0 auto', // Center the table horizontally
    }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{
              bgcolor: '#c8e6c9', // Light gray header
              fontWeight: '700',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '12px 16px',
              color: 'black',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid black',
            }}>SNO</TableCell>
            <TableCell sx={{
              bgcolor: '#c8e6c9',
              fontWeight: '700',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '12px 16px',
              color: 'black',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid black',
            }}>PCB SERIAL</TableCell>
            <TableCell sx={{
              bgcolor: '#c8e6c9',
              fontWeight: '700',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '12px 16px',
              color: 'black',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid black',
            }}>STATUS</TableCell>
            <TableCell sx={{
              bgcolor: '#c8e6c9',
              fontWeight: '700',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '12px 16px',
              color: 'black',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid black',
            }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {FilteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
            const activeTask = row.tasks?.find(t => t.flowStepId === row.currentStepId);
            const status = activeTask?.status || "Pending";
            const isDone = status === "Completed";
            const isStarted = ["STARTED", "Start", "In Progress"].includes(status);
            const isLocked = row.canExecute === true;
            const canComplete = isStarted && !isDone && !isLocked;
            const logLength = activeTask?.operator_Json_log ? Object.keys(activeTask.operator_Json_log).length : 0;
            const isLogFilled = logLength > 0;

            return (
              <TableRow key={row.serialNo || index} hover sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: '#fafafa' },
              }}>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#555555',
                  textAlign: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e0e0e0',
                  borderRadius: '0 0 8px 0'
                }}>{(page * rowsPerPage) + index + 1}</TableCell>
                <TableCell sx={{
                  fontWeight: 700,
                  color: '#374151',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e0e0e0'
                }}>{row.serialNo}</TableCell>
                <TableCell sx={{
                  textAlign: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <Chip
                    label={status}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      height: 22,
                      fontSize: '0.75rem',
                      bgcolor: isDone ? '#d4edda' : isStarted ? '#fff9c4' : '#e0f2fe',
                      color: isDone ? '#1b5e20' : isStarted ? '#fbc02d' : '#1976d2',
                      borderRadius: '12px',
                      textTransform: 'none',
                    }}
                  />
                </TableCell>
                <TableCell sx={{
                  textAlign: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant={isStarted ? "text" : "contained"}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '12px',
                        backgroundColor: isStarted ? 'rgba(0,0,0,0.1)' : '#2196f3',
                        color: isStarted ? '#424242' : '#ffffff',
                        border: '1px solid #b0bec5',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                      disabled={isStarted || isLogFilled || isLocked || isDone}
                      onClick={() => handleStartClick(row)}
                    >
                      {isStarted ? "Started" : "Start"}
                    </Button>
                    <Button
                      variant={isDone ? "outlined" : "contained"}
                      color={isDone ? "inherit" : "primary"}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '12px',
                        backgroundColor: isDone ? 'transparent' : '#3f51b5',
                        color: isDone ? '#424242' : '#ffffff',
                        border: '1px solid #3f51b5',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                      disabled={!canComplete && !isDone}
                      onClick={() => handleCompleteClick(row)}
                    >
                      
                    {isDone ? "View Log" : "Execute"}
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[10, 25, 50]}
      component="div"
      count={FilteredData.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(e, p) => setPage(p)}
      onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
    />
  </TableContainer>
        </Paper>
      </Grid>


      {/* RIGHT MAIN SIDEBAR */}
      {rightSideIds.length > 0 && (
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              height: "85vh",
              overflowY: "auto",
              background: "white",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
            }}
          >
            {/* <Typography
              variant="h6"
              sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}
            >
              MORE STAGES
            </Typography> */}

            {rightSideIds.map(id => renderTabButton(id))}
          </Paper>
        </Grid>
      )}

    </Grid>
  </Box>
);
};





/**
 * Component: OperatorPage
 * Description: Main Dashboard container. Handles API Data Fetching.
 */
const OperatorPage = ({ inActionPCBs, updateInActionPCBs, onLogout }) => {
  let user = JSON.parse(localStorage.getItem("user"));
  // console.log("user: ",user)
  const activeUser = user || DUMMY_USER;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStepIdAllData, SetcurrentStepIdAllData] = useState([]);
  const [showpage,SetShowPage] = useState('false')
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [cardcount, setCardCount] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  // const [global_equi_conumDet,global_setequi_conumDet]=useState(null)
  // --- Dynamic API Configuration ---
  var API = "/operator/view";
  var API1="/operatordashboard"
  var fetchOperatorApi = "http://172.195.121.91:2000" + API;
  var opdashboard="http://172.195.121.91:2000" + API1;
  var API_BASE_URL="http://localhost:2000"

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    fetchOperatorApi = configDetails.project[0].ServerIP[0].PythonServerIP + API;
    opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
    API_BASE_URL=configDetails.project[0].ServerIP[0].PythonServerIP 
  }

  // --- Fetch API Data ---
  useEffect(() => {
    // console.log("agdjsigji")
    if (!user?.id) return;
    const requestParams = { staff_no: user?.id };
    setLoading(true);
    axios.get(fetchOperatorApi, { params: requestParams })
      .then((response) => {
        const tasks = response.data.pcbs[0]?.tasks || [];
        // console.log("data on page: ",response.data.flag)
        SetShowPage(response.data.flag)
        setTableData(tasks);
        // console.log("response: ",response)
        setLoading(false);
        SetcurrentStepIdAllData(response.data.pcbs);
        setCardCount(response.data.pcbs.length);
      })
      .catch((err) => {
        // console.error("Error fetching data:", err);
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
      // console.log("setAnalyticsData: ",analyticsData)
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
    // Object.assign(row,equi_conumDet)
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



  const AssemblyLineTable = () => {
    // console.log("ana;lytics data : ",analyticsData)
    // console.log("analu: ",typeof(analyticsData?.openames))

    if (!analyticsData || !Array.isArray(analyticsData?.openames)) {
      return <p>Error: analyticsData must be a valid array.</p>;
    }
  // Add this inside the OperatorPage component

    return (
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, mt: 3, maxHeight: 650, overflowY: 'auto' }}>
        <Box sx={{ p: 1.5, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <Typography  fontWeight="bold" sx={{fontSize:"1.15rem"}}>Assembly Line StageWise</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1rem"}}>Stage Name</TableCell>
                <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1rem"}}>PCBs Present</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyticsData?.openames.map((row, index) => (
                
                <TableRow key={index}>
                  {/* {console.log("row: ",row)} */}
                  <TableCell sx={{opacity:0.8,fontWeight:600}}>{row?.openames}</TableCell>
                  <TableCell sx={{opacity:0.8,fontWeight:600}}>{row?.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    );
  };
  // File: OperatorPage.js

// const handleFinalSubmission = async (values, status, batchSerials, fileObject) => {
//     try {
//         const formData = new FormData();
//         formData.append("pcb_serial", activeFormData.pcbSerial);
//         formData.append("stage_id", activeFormData.stageId + 1);
//         formData.append("status", status);
//         formData.append("log_data", JSON.stringify(values));

//         // Only append the file if the stage requires it AND it exists
//         if (fileObject) {
//             const actualFile = fileObject.file || fileObject;
//             // Standard check to ensure we aren't sending a null/undefined string
//             if (actualFile instanceof File) {
//                 formData.append("file", actualFile);
//             }
//         }

//         const response = await axios.post(`${API_BASE_URL}/operator/upload_manual_file`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//         });

//         if (response.status === 200) {
//             handleSaveSuccess();
//             setOpenFormDialog(false);
//         }
//     } catch (error) {
//         console.error("Submission failed", error);
//     }
// };


// --- Inside OperatorPage.js ---

const handleFinalSubmission = async (values, status, batchSerials, fileObject) => {
  try {
    const formData = new FormData();
    
    // Standard metadata
    formData.append("pcb_serial", activeFormData.pcbSerial);
    formData.append("stage_id", activeFormData.stageId + 1);
    formData.append("status", status);
    formData.append("log_data", JSON.stringify(values));

    // 1. Check if a file was passed directly or exists in the 'values' state
    let fileToUpload = null;

    if (fileObject?.file instanceof File) {
      fileToUpload = fileObject.file;
    } else if (fileObject instanceof File) {
      fileToUpload = fileObject;
    } else {
      // Fallback: search values for any File object
      const fileKey = Object.keys(values).find(key => values[key]?.file instanceof File);
      if (fileKey) fileToUpload = values[fileKey].file;
    }

    // 2. Append to FormData (matches the 'file: UploadFile' name in Python)
    if (fileToUpload) {
      formData.append("file", fileToUpload);
    }

    const response = await axios.post(`${API_BASE_URL}/operator/upload_manual_file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.status === 200) {
      handleSaveSuccess();
      setOpenFormDialog(false);
    }
  } catch (error) {
    console.error("Upload failed", error);
    alert("Error saving task and file.");
  }
};

const renderContent = () => {
  if (selectedView === 'tasks') {
    return (
      <>
        
      {String(showpage).toLowerCase() === 'true' ? (
  <>
  {/* {console.log("AllData: in me: ",currentStepIdAllData)} */}
    <TaskTabsView
      currentUser={activeUser}
      tableData={tableData}
      AllData={currentStepIdAllData}
      onOpenForm={handleOpenForm}
      onTriggerRefresh={handleTriggerRefresh}
    />
  </>
) : (
  <Paper elevation={2} sx={{ p: 5, textAlign: 'center', mt: 5, borderRadius: 2 }}>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <LockIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
      <Typography variant="h5" color="error" fontWeight="bold">
        MRL EXPIRED
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        You do not have the access to perform Operations.
      </Typography>
    </Box>
  </Paper>
)}
      </>

  
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
    height: 'fit-content',
    borderRadius: 4, 
    // Increased border visibility and added a subtle shadow by default
    border: "1px solid #d1d5db", 
    display: 'flex',
    flexDirection: 'column',
    bgcolor: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: "all 0.2s ease-in-out",
    "&:hover": { 
      borderColor: "#4f46e5", 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)' 
    },
    "&:active": {
      transform: 'translateY(0px) scale(0.98)',
    }
  }}
>
  <CardActionArea 
    onClick={() => setSelectedView('tasks')} 
    sx={{ 
      flexGrow: 0, 
      p: 3, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      textAlign: 'center'
    }}
  >
    {/* Icon Container with a "Pressed" or "Button" look */}
    <Box sx={{
      p: 2,
      borderRadius: '50%',
      bgcolor: '#4f46e5', // Solid color makes it pop immediately
      display: 'inline-flex',
      mb: 0,
      boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)', // Glow effect
    }}>
      <LayoutDashboardIcon size={32} color="#ffffff" />
    </Box>
    
    <Typography variant="h6" fontWeight="800" color="#1e293b">
      My Production Tasks
    </Typography>
    
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Process and log pending PCBs
    </Typography>

    <Divider sx={{ width: '100%', mb: 3, borderColor: '#e2e8f0' }} />
    
    {/* High-Contrast Footer Button */}
    <Box sx={{ 
      mt: 'auto', 
      width: '100%', 
      py: 1.5, 
      borderRadius: 2, 
      bgcolor: '#4f46e5', // Primary color background by default
      border: '1px solid #4f46e5',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Typography 
        variant="caption" 
        fontWeight="bold" 
        sx={{ 
          color: '#ffffff', // White text for immediate "button" recognition
          letterSpacing: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          textDecoration:"underline"
        }}
      >
        CLICK TO START TASK EXECUTION
        {/* <span style={{ fontSize: '1.2rem' ,textDecoration:"none" }}>→</span> */}
      </Typography>
    </Box>
  </CardActionArea>
</Card>
          {/* <PCBTable></PCBTable> */}
          <AssemblyLineTable></AssemblyLineTable>
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
  

    <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)"
  }}
>

  {/* Top Navbar */}
  <AppBar
    position="sticky"
    elevation={0}
    sx={{
      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.75)",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    }}
  >
    <Toolbar sx={{ px: 3 }}>
      {selectedView && (
        <ArrowBackIosNewIcon
          onClick={() => setSelectedView(null)}
          sx={{
            mr: 2,
            cursor: "pointer",
            color: "#475569",
            transition: "0.2s",
            "&:hover": { color: UI_THEME.primary, transform: "scale(1.1)" }
          }}
        />
      )}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: "#1e293b",
          flexGrow: 1,
          textAlign: "center",
          letterSpacing: 0.5
        }}
      >
        {selectedView === "tasks"
          ? "My Dashboard"
          : "Operator Dashboard"}
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
            {user.username || "Operator"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {user.id}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: UI_THEME.primary,
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          {user.username
            ? user.username[0].toUpperCase()
            : <AccountCircle />}
        </Avatar>
      </Box>
    </Toolbar>
  </AppBar>

  {/* Main Content Area */}
  <Box
    sx={{
      flexGrow: 1,
      px: 1,
      py: 1,
      width: "100%"
    }}
  >
    {selectedView === "tasks" ? (
      <Box
       
      >
        {renderContent()}
      </Box>
    ) : (
      renderContent()
    )}
  </Box>

  {/* Dialogs and Popups (unchanged logic) */}
  {/* <ProcessFormDialog
    open={openFormDialog}
    setOpen={setOpenFormDialog}
    activeForm={activeFormData}
    currentUser={activeUser}
    FilteredData={activeFilteredData}
    actionType={actionType}
    onSaveSuccess={handleSaveSuccess}
  /> */}

  {/* Dialogs and Popups */}
  <ProcessFormDialog
    open={openFormDialog}
    setOpen={setOpenFormDialog}
    activeForm={activeFormData}
    currentUser={activeUser}
    FilteredData={activeFilteredData}
    actionType={actionType}
    onSaveSuccess={handleSaveSuccess}
    // ADD THIS PROP HERE
    handleFinalSubmission={handleFinalSubmission} 
  />

  <Snackbar
    open={snackbar.open}
    autoHideDuration={3000}
    onClose={() =>
      setSnackbar({ ...snackbar, open: false })
    }
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      severity="success"
      variant="filled"
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
      }}
    >
      {snackbar.msg}
    </Alert>
  </Snackbar>

</Box>
  );
};

export default OperatorPage;
