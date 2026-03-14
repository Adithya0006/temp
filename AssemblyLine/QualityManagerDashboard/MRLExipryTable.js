


import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
  Stack,
  Button,
  useTheme,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination, // Added for pagination
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  WarningAmber as WarningIcon,
  ErrorOutline as ErrorIcon,
  CheckCircleOutline as CheckIcon,
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  UploadFile as UploadFileIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

// --- UTILS ---
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const stringAvatar = (name) => {
  const nameParts = name ? name.split(' ') : ['?', '?'];
  return {
    sx: {
      bgcolor: stringToColor(name || 'User'),
      width: 32,
      height: 32,
      fontSize: '0.8rem',
      fontWeight: 'bold',
    },
    children: `${nameParts[0][0]}${nameParts[1] ? nameParts[1][0] : ''}`,
  };
};

const MRLExpiryTable = () => {
  const theme = useTheme();

  // --- STATE ---
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- EDIT STATE ---
  const [editingId, setEditingId] = useState(null);
  const [tempDate, setTempDate] = useState("");

  // --- FILE UPLOAD STATE ---
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [viewPdfOpen, setViewPdfOpen] = useState(false);
  const [currentPdfToView, setCurrentPdfToView] = useState(null);

  // --- NOTIFICATION STATE ---
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // const API_URL = 'http://localhost:8000/getmrllist';
  // const UPLOAD_API_URL = 'http://localhost:8000/mrlrevalidationdocsupload';
  // const [api,setApi]=useState({
  //   "Api_1":"","Api_2":"","Api_3":""
  // })






// const [pythonBaseUrl,setPythonBaseUrl]=useState("http://localhost:8000");

// const [API1,setApi_1]=useState("/getmrllist")
// const [API2,setAPI2]=useState("/mrlrevalidationdocsupload")
// const [API3,setAPI3]=useState("/updatemrldate")
// const [load,setLoad]=useState(false)
// // var Api_1="/getmrllist"
  useEffect(() => {
    fetchData();
  }, []);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("/config.json");
//         let data = response.data.project[0].ServerIP[0];
//         // console.log("data: ", data);
//         setPythonBaseUrl(data?.PythonServerIP);
//         //Corrected API_URL Update:  We only need to update API_URL *after* pythonBaseUrl is set
//         if (pythonBaseUrl) {
//           setLoad(true)
//           setApi_1(pythonBaseUrl + "/getmrllist");
//           setAPI2(pythonBaseUrl+"/mrlrevalidationdocsupload")
//           setAPI3(pythonBaseUrl+"/updatemrldate")
//           // console.log("Api_url: ",API1)
//         }
//       } catch (error) {
//         // console.error("Error fetching config:", error); // Use console.error for errors
//         setPythonBaseUrl("http://localhost:8000"); // Default value
//       }
//     };

//     fetchData(); // Call the async function
//   }, []);

//   useEffect(() => {
//     // This useEffect is to re-fetch the data when pythonBaseUrl changes
//     // If you want to use the new API_URL immediately after setting it, this is the place
//     // console.log("API_URL updated:", API1);
//     fetchData()
//     handleSaveRow()
//   }, [API1,API2,API3]); 


  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);

  var API_1 = "/getmrllist";
  var API_2="/mrlrevalidationdocsupload"
  var API_3="/updatemrldate"
  var API1 = "http://172.195.121.91:2000" + API_1;
  var API2="http://172.195.121.91:2000" + API_2;
  var API3="http://172.195.121.91:2000" + API_3;

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    API1 = configDetails.project[0].ServerIP[0].PythonServerIP + API_1;
    API2=configDetails.project[0].ServerIP[0].PythonServerIP + API_2;
    API3=configDetails.project[0].ServerIP[0].PythonServerIP + API_3;
  }

  // console.log(API1,API2,API3)



  

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || '123';

      const response = await axios.get(API1, { params: { staff_no: userId } });
      // console.log("RESPONSE: ",response)
      setAllStaff(response.data);
    } catch (err) {
      // console.error("Fetch error", err);
      setAllStaff([
        { staff_no: '1001', name: 'Alice Johnson', initial: 'AJ', ope_mrl: 'L4', ope_exp: '2025-10-01' },
        { staff_no: '1002', name: 'Bob Smith', initial: 'BS', ope_mrl: 'L3', ope_exp: '2023-05-15' },
        { staff_no: '1003', name: 'Charlie Davis', initial: 'CD', ope_mrl: 'L2', ope_exp: '2023-12-01' },
        { staff_no: '1004', name: 'David Lee', initial: 'DL', ope_mrl: 'L1', ope_exp: '2026-01-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC ---
  const getDaysRemaining = (dateString) => {
    if (!dateString) return 999;
    const today = new Date();
    const exp = new Date(dateString);
    const diffTime = exp - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const processedData = useMemo(() => {
    let data = allStaff;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(item =>
        item.name?.toLowerCase().includes(lower) ||
        item.staff_no?.toString().includes(lower)
      );
    }
    if (tabValue === 0) {
      data = data.filter(item => getDaysRemaining(item.ope_exp) > 30);
    } else {
      data = data.filter(item => getDaysRemaining(item.ope_exp) <= 30);
    }
    return data.sort((a, b) => new Date(a.ope_exp) - new Date(b.ope_exp));
  }, [allStaff, searchTerm, tabValue]);

  // PAGINATION LOGIC: Slice the data for the current page
  const paginatedData = useMemo(() => {
    return processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  const Count = allStaff.filter(i => getDaysRemaining(i.ope_exp) >= 30).length;
  const criticalCount = allStaff.filter(i => getDaysRemaining(i.ope_exp) <= 30).length;

  // --- HANDLERS ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    setEditingId(row.staff_no);
    setTempDate(row.ope_exp ? new Date(row.ope_exp).toISOString().split('T')[0] : "");
  };

  const handleCancel = (staffNo) => {
    setEditingId(null);
    setTempDate("");
    if (uploadedFiles[staffNo] && !uploadedFiles[staffNo].saved) {
      setUploadedFiles(prev => {
        const newState = { ...prev };
        delete newState[staffNo];
        return newState;
      });
    }
  };

  const handleSaveRow = async (staffNo) => {
    const isDateEdited = editingId === staffNo && tempDate;
    const fileData = uploadedFiles[staffNo];
    const hasUnsavedFile = fileData && !fileData.saved;

    if (!isDateEdited && !hasUnsavedFile) {
      showNotification("No changes to save.", "info");
      return;
    }

    const promises = [];
    if (isDateEdited) {
      const newExpDate = new Date(tempDate);
      const month = String(newExpDate.getMonth() + 1).padStart(2, '0');
      const year = String(newExpDate.getFullYear()).slice(-2);
      const dbFormattedDate = `${month}${year}.0`;

      const dateUpdatePromise = axios.put(API3, {
        staff_no: staffNo,
        ope_exp: dbFormattedDate
      }).then(() => {
        const newUiDate = newExpDate.toISOString().split('T')[0];
        setAllStaff(prev => prev.map(item =>
          item.staff_no === staffNo ? { ...item, ope_exp: newUiDate } : item
        ));
      });
      promises.push(dateUpdatePromise);
    }

    if (hasUnsavedFile) {
      const formData = new FormData();
      formData.append('file', fileData.rawFile);
      formData.append('operatorid', staffNo);
      const fileUploadPromise = axios.post(API2, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      promises.push(fileUploadPromise);
    }

    try {
      await Promise.all(promises);
      showNotification(`Changes for staff ${staffNo} saved successfully!`);
      if (hasUnsavedFile) {
        setUploadedFiles(prev => ({
          ...prev,
          [staffNo]: { ...prev[staffNo], rawFile: null, saved: true }
        }));
      }
      setEditingId(null);
    } catch (error) {
      // console.error("Save failed:", error);
      showNotification("Error: Failed to save changes.", "error");
    }
  };

  // --- FILE HANDLERS ---
  const handleFileUpload = (e, row) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        showNotification("Only PDF files are allowed.", "error");
        e.target.value = null;
        return;
      }
      const fileUrl = URL.createObjectURL(file);
      setUploadedFiles(prev => ({
        ...prev,
        [row.staff_no]: { url: fileUrl, name: file.name, rawFile: file, saved: false }
      }));
      
      const baseDate = new Date();
      // console.log("row.ope_exp: ",baseDate)
      baseDate.setFullYear(baseDate.getFullYear() + 2);
      setEditingId(row.staff_no);
      setTempDate(baseDate.toISOString().split('T')[0]);
      showNotification("File staged. Expiry date updated to +2 years. Click Save to confirm.");
      e.target.value = null;
    }
  };

  // Remaining handlers (handleDeleteFile, handleOpenPdfView, etc.) stay the same...
  const handleDownload = () => {
    const blob = new Blob(["Sample Data"], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded_file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderStatusChip = (dateStr) => {
    const days = getDaysRemaining(dateStr);
    if (days < 0) {
      return (
        <Chip icon={<ErrorIcon sx={{ fontSize: '16px !important' }} />} label="Expired" size="small"
          sx={{ bgcolor: '#ffebee', color: '#d32f2f', fontWeight: 'bold', border: `1px solid #ffcdd2` }} />
      );
    } else if (days <= 30) {
      return (
        <Chip icon={<WarningIcon sx={{ fontSize: '16px !important' }} />} label={`${days} Days Left`} size="small"
          sx={{ bgcolor: '#fff3e0', color: '#ed6c02', fontWeight: 'bold', border: `1px solid #ffe0b2` }} />
      );
    } else {
      return (
        <Chip icon={<CheckIcon sx={{ fontSize: '16px !important' }} />} label="Active" size="small"
          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold', border: '1px solid #c8e6c9' }} />
      );
    }
  };

  const columns = ['Staff Member', 'Initial', 'MRL Level', 'Expiration Date', 'Status'];
  if (tabValue === 1) columns.push('Actions');

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', height: '50vh', alignItems: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4, fontFamily: 'Inter, sans-serif' }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper sx={{ p: 2, bgcolor: notification.severity === 'error' ? '#ef4444' : '#22c55e', color: 'white', fontWeight: 'bold' }}>
          {notification.message}
        </Paper>
      </Snackbar>

      <Card sx={{ maxWidth: 2000, mx: 'auto', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'visible' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ bgcolor: '#f1f5f9', p: 0.5, borderRadius: 3, display: 'flex', border: '1px solid #e2e8f0' }}>
            <Button
              onClick={() => { setTabValue(0); setPage(0); }} startIcon={<PersonIcon />}
              sx={{
                px: 3, py: 1, borderRadius: 2.5, textTransform: 'none', fontWeight: 700,
                color: tabValue === 0 ? 'green' : '#64748b', bgcolor: tabValue === 0 ? '#fff' : 'transparent',
                boxShadow: tabValue === 0 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Active Staff
              {Count > 0 && <Box sx={{ ml: 1, px: 0.8, py: 0.2, borderRadius: 10, bgcolor: 'green', color: 'white', fontSize: '0.7rem' }}>{Count}</Box>}
            </Button>
            <Button
              onClick={() => { setTabValue(1); setPage(0); }} startIcon={<WarningIcon />}
              sx={{
                px: 3, py: 1, borderRadius: 2.5, textTransform: 'none', fontWeight: 700,
                color: tabValue === 1 ? '#d32f2f' : '#64748b', bgcolor: tabValue === 1 ? '#fff' : 'transparent',
                boxShadow: tabValue === 1 ? '0 2px 8px rgba(211, 47, 47, 0.15)' : 'none',
              }}
            >
              Action Required
              {criticalCount > 0 && <Box sx={{ ml: 1, px: 0.8, py: 0.2, borderRadius: 10, bgcolor: 'red', color: 'white', fontSize: '0.7rem' }}>{criticalCount}</Box>}
            </Button>
          </Box>
          {tabValue === 1 && (
            //<Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload} size="small" sx={{ mt: 2, px: 2 }}>Download</Button>
            <Tooltip title="Download">
              <Button
                size="small"
                color="success"
                onClick={handleDownload}
                sx={{
                  minWidth: 50, // Try 50px, 60px, or even 100px to see if it takes effect
                  p: 1,
                  backgroundColor: "#e8f5e9",
                  mr: 0.5,
                  // Add this to *force* it if nothing else works:
                  width: '100px', // or whatever value, mirroring minWidth
                  textTransform: "none", boxShadow: 10
                }}
              >
                <DownloadIcon fontSize="small" /> Download
              </Button>
            </Tooltip>

          )}
          <TextField
            size="small" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" fontSize="small" /></InputAdornment>), sx: { borderRadius: 3, bgcolor: '#f8fafc' } }}
          />
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((head) => (
                  <TableCell key={head} sx={{ bgcolor: tabValue === 1 ? '#fef2f2' : '#f8fafc', color: tabValue === 1 ? '#222326' : '#64748b', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', textAlign: "center", py: 2, borderBottom: `2px solid ${tabValue === 1 ? '#fecaca' : '#e2e8f0'}` }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => {
                  const isEditing = editingId === row.staff_no;
                  const daysLeft = getDaysRemaining(row.ope_exp);
                  const isCriticalRow = daysLeft <= 30;
                  const fileData = uploadedFiles[row.staff_no];
                  const hasUnsavedFile = fileData && !fileData.saved;

                  return (
                    <TableRow key={row.staff_no} hover sx={{ bgcolor: isCriticalRow && tabValue === 1 ? '#fffafa' : 'inherit' }}>
                      <TableCell sx={{ borderLeft: isCriticalRow && tabValue === 1 ? '4px solid #ef4444' : '4px solid transparent' }}>
                        <Box display="flex" alignItems="center" gap={2} ml={2}>
                          <Avatar {...stringAvatar(row.name)} />
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <Typography variant="body1" fontWeight="700" color="#1e293b">{row.name}</Typography>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', px: 0.8, py: 0.25, width: 'fit-content' }}>
                              <PersonOutlineIcon sx={{ fontSize: 15, color: '#64748b' }} />
                              <Typography variant="caption" fontFamily="Monospace" fontWeight="bold" color="#475569" sx={{ lineHeight: 1, fontSize: '0.8rem' }}>{row.staff_no}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}><Typography variant="body2" color="#222326" sx={{ fontWeight: 'bold' }}>{row.initial || 'NA'}</Typography></TableCell>
                      <TableCell sx={{ textAlign: "center" }}><Chip label={row.ope_mrl} size="small" variant="outlined" sx={{ borderRadius: 1, fontWeight: 'bold' }} /></TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {isEditing ? (
                          <TextField type="date" size="small" value={tempDate} onChange={(e) => setTempDate(e.target.value)} sx={{ width: 150 }} InputProps={{ sx: { fontSize: '0.85rem' } }} />
                        ) : (
                          <Typography variant="body2" fontWeight="600" color={daysLeft < 0 ? '#d32f2f' : (daysLeft <= 30 ? '#ed6c02' : '#334155')}>
                            {new Date(row.ope_exp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{!isEditing && renderStatusChip(row.ope_exp)}</TableCell>
                      {tabValue === 1 && (
                        <TableCell sx={{ textAlign: "center" }}>
                          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                            {!fileData && !isEditing && (
                              <>
                                <input accept="application/pdf" type="file" id={`upload-${row.staff_no}`} style={{ display: "none" }} onChange={(e) => handleFileUpload(e, row)} />
                                <label htmlFor={`upload-${row.staff_no}`}>
                                  <Tooltip title="Upload file">
                                    <Button component="span" size="small" color="success" title="Upload New Document" sx={{ textTransform: "none", boxShadow: 10 }}>
                                      <UploadFileIcon />
                                    </Button></Tooltip>
                                  {/* <Button variant="contained" size="small" color="success"  title="Upload New Document" startIcon={<UploadFileIcon />}  sx={{ textTransform: "none", boxShadow: 0 }}></Button> */}
                                </label>
                                {/* <IconButton component="span" size="small" onClick={() => handleEdit(row)} title="Edit Date Manually">
                                  <EditIcon fontSize="small" />
                                </IconButton> */}
                                <Tooltip title="Edit Date Manually">
                                  <Button size="small" color="warning" onClick={() => handleEdit(row)} sx={{ minWidth: "auto", p: 0.75, backgroundColor: "#fff3e0", mr: 0.5, width: "60px", boxShadow: 10 }}><EditIcon fontSize="small" /></Button>
                                </Tooltip>
                              </>
                            )}
                            {(isEditing || hasUnsavedFile) && (
                              <>
                                {/* <IconButton component="span" size="small" color="success" onClick={() => handleSaveRow(row.staff_no)} title="Save Changes">
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                                <IconButton component="span" size="small" color="error" onClick={() => handleCancel(row.staff_no)} title="Cancel Changes">
                                  <CloseIcon fontSize="small" />
                                </IconButton> */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                  <Button size="small" component="span" color="success" onClick={() => handleSaveRow(row.staff_no)} title="Save Changes" sx={{ textTransform: "none", boxShadow: 10 }}><SaveIcon /></Button>
                                  <Button size="small" component="span" color="error" onClick={() => handleCancel(row.staff_no)} title="Cancel Changes" sx={{ boxShadow: 10, Width: "200px" }}><CloseIcon /> </Button>
                                </Box>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={tabValue === 1 ? 6 : 5} align="center" sx={{ py: 6 }}><Typography color="text.secondary" fontStyle="italic">No records found for this category.</Typography></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION COMPONENT */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={processedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #e2e8f0' }}
        />
      </Card>

      {/* PDF View Dialog stays as is... */}
    </Box>
    
  );
};

export default MRLExpiryTable;