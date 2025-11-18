import React, { useState } from 'react';
import * as XLSX from 'xlsx'; 
import { Box, Typography, Button, Paper, Tabs, Tab, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, AppBar, Toolbar, Container, Checkbox, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';

const PRIMARY_KEY_FLOW = 'operation seq number'; 
const PCB_SERIAL_KEY_FALLBACK = 'PCB Serial Number'; 

// Utility Function: Read and Parse File (retained from previous steps)
const readFile = (file) => { 
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const rawJson = XLSX.utils.sheet_to_json(worksheet);
                if (rawJson.length === 0) { resolve([]); return; }
                const normalizedJson = rawJson.map((row, index) => {
                    const newRow = { id: `temp-${index + 1}` };
                    for (const key in row) {
                        const trimmedKey = key.trim(); 
                        newRow[trimmedKey] = row[key];
                    }
                    return newRow;
                });
                resolve(normalizedJson);
            } catch (error) { reject(error); }
        };
        reader.onerror = (error) => { reject(error); };
        reader.readAsArrayBuffer(file);
    });
};


function SupervisorDashboard({ onLogout, role, onCreateOperator, inActionPCBs, handleAssignWork }) { 
    // State for forms
    const [staffNumber, setStaffNumber] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    
    // States for Flow Control
    const [uploadedData, setUploadedData] = useState([]); 
    const [flowControlData, setFlowControlData] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set()); 
    const [activeView, setActiveView] = useState('creation'); 
    const [fileName, setFileName] = useState(null);
    const [tableColumns, setTableColumns] = useState([]); 
    const [selectedPCB, setSelectedPCB] = useState(null); 

    // --- Operator Creation Logic (retained) ---
    const handleCreate = (e) => {
        e.preventDefault();
        if (!staffNumber || !name || !password) {
            alert("All fields are required to create a new operator.");
            return;
        }
        const success = onCreateOperator(staffNumber, name, password);
        if (success) {
            alert(`Operator "${name}" (Staff No: ${staffNumber}) created successfully!`);
            setStaffNumber('');
            setName('');
            setPassword('');
        }
    };
    
    // --- Upload CSV (Operations) Logic (retained) ---
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setActiveView('creation'); 
            try {
                const data = await readFile(file); 
                if (data.length > 0) {
                    const fileColumns = Object.keys(data[0]).filter(key => key !== 'id');
                    setTableColumns(fileColumns);
                    setUploadedData(data);
                    setSelectedIds(new Set()); 
                } else {
                    alert("File uploaded but no data found. Please check the sheet.");
                    setUploadedData([]);
                }
            } catch (error) {
                alert("Error processing the file. Ensure it is a valid CSV/Excel format.");
                setUploadedData([]);
            }
        }
    };

    // --- Checkbox and Save Logic (retained) ---
    const handleCheckboxChange = (id) => {
        const newSelectedIds = new Set(selectedIds);
        newSelectedIds.has(id) ? newSelectedIds.delete(id) : newSelectedIds.add(id);
        setSelectedIds(newSelectedIds);
    };

    const handleSaveToFlowControl = () => {
        if (selectedIds.size === 0) {
            alert("Please select at least one row to save to FlowControl.");
            return;
        }

        const itemsToSave = uploadedData.filter(item => selectedIds.has(item.id));
        const existingKeys = new Set(flowControlData.map(item => item[PRIMARY_KEY_FLOW]));

        const newFlowItems = itemsToSave
            .filter(item => {
                const key = item[PRIMARY_KEY_FLOW]; 
                if (!key) {
                    console.warn(`Skipping item with blank primary key.`);
                    return false;
                }
                return !existingKeys.has(key);
            })
            .map(item => ({
                ...item,
                Status: item.Status || 'Pending' 
            }));

        const duplicateCount = itemsToSave.length - newFlowItems.length;

        setFlowControlData(prevData => [...prevData, ...newFlowItems]); 
        setUploadedData([]); 
        setSelectedIds(new Set()); 

        let alertMessage = `${newFlowItems.length} unique operation(s) saved to FlowControl.`;
        if (duplicateCount > 0) {
            alertMessage += ` (${duplicateCount} duplicate(s) skipped.)`;
        }
        alert(alertMessage);
        
        setActiveView('flowcontrol'); 
    };

    // --- Assignment Action ---
    const handleAssignClick = (serialNumber) => {
        if (window.confirm(`Are you sure you want to assign work for PCB: ${serialNumber}? This action cannot be reversed.`)) {
            handleAssignWork(serialNumber); 
        }
    };
    
    // --- Rendering Functions ---

    const renderUploadTable = () => {
        if (uploadedData.length === 0) {
            return <Typography sx={{ p: 3, textAlign: 'center' }}>Upload a CSV/Excel file to see the staging table.</Typography>;
        }
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Staging Operations Table</Typography>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.200' }}>
                                <TableCell padding="checkbox">Select</TableCell>
                                {tableColumns.map(col => <TableCell key={col}>{col}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {uploadedData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={selectedIds.has(row.id)} onChange={() => handleCheckboxChange(row.id)}/>
                                    </TableCell>
                                    {tableColumns.map(colKey => (<TableCell key={`${row.id}-${colKey}`}>{row[colKey]}</TableCell>))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button onClick={handleSaveToFlowControl} disabled={selectedIds.size === 0} variant="contained" color="info">
                        Save Selected to FlowControl ({selectedIds.size})
                    </Button>
                </Box>
            </Box>
        );
    };

    const renderFlowControlTable = () => {
        if (flowControlData.length === 0) {
            return <Typography sx={{ p: 3, textAlign: 'center' }}>The FlowControl memory is currently empty.</Typography>;
        }
        
        const displayColumns = flowControlData.length > 0 ? Object.keys(flowControlData[0]).filter(key => key !== 'id') : []; 

        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>FlowControl Operations ({flowControlData.length} items)</Typography>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.200' }}>
                                {displayColumns.map(col => <TableCell key={col}>{col}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flowControlData.map((row, index) => (
                                <TableRow key={row[PRIMARY_KEY_FLOW] || index}> 
                                    {displayColumns.map(colKey => (<TableCell key={`${index}-${colKey}`}>{row[colKey]}</TableCell>))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };


    const renderInActionPCBsTable = () => {
        if (inActionPCBs.length === 0) {
            return <Typography sx={{ p: 3, textAlign: 'center' }}>No PCBs have been marked 'In-Action' by the Admin yet.</Typography>;
        }

        const currentPcbKey = inActionPCBs.length > 0 ? inActionPCBs[0]._pcb_key_id : PCB_SERIAL_KEY_FALLBACK;
        const baseColumns = Object.keys(inActionPCBs[0]).filter(key => key !== 'id' && key !== 'linkedOperations' && key !== 'isWorkAssigned' && key !== '_pcb_key_id');
        const displayColumns = [...baseColumns, 'Assignment Status', 'Assign']; 
        
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>PCBs Pending Action ({inActionPCBs.length})</Typography>
                
                {selectedPCB && (
                    <Alert severity="info" onClose={() => setSelectedPCB(null)} sx={{ mb: 2 }}>
                        Details for PCB: {selectedPCB[currentPcbKey]}. Mandatory Operations: {selectedPCB.linkedOperations.length}
                    </Alert>
                )}

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.200' }}>
                                {displayColumns.map(col => <TableCell key={col}>{col}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inActionPCBs.map((row, index) => {
                                const isAssigned = row.isWorkAssigned;
                                const serialNumber = row[currentPcbKey];
                                
                                return (
                                    <TableRow key={serialNumber || index}> 
                                        {baseColumns.map(colKey => (
                                            <TableCell key={`${serialNumber}-${colKey}`}>
                                                {colKey === currentPcbKey ? (
                                                    <Button variant="text" size="small" onClick={(e) => { e.preventDefault(); setSelectedPCB(row); }}>
                                                        {serialNumber}
                                                    </Button>
                                                ) : (
                                                    row[colKey]
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell sx={{ fontWeight: 'bold', color: isAssigned ? 'success.dark' : 'warning.dark' }}>
                                            {isAssigned ? 'WORK ASSIGNED' : 'PENDING'}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleAssignClick(serialNumber)}
                                                disabled={isAssigned}
                                                variant="contained"
                                                size="small"
                                                color={isAssigned ? 'default' : 'primary'}
                                            >
                                                {isAssigned ? 'Assigned' : 'Assign Work'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    // --- JSX Render ---
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: 'success.dark' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Supervisor Control Panel
                    </Typography>
                    <Button color="inherit" onClick={onLogout} variant="outlined">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ pt: 3 }}>
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={activeView} onChange={(e, newValue) => setActiveView(newValue)} indicatorColor="primary" textColor="primary" variant="fullWidth">
                        <Tab label="Account Creation / Staging" value="creation" />
                        <Tab label={`FlowControl Memory (${flowControlData.length})`} value="flowcontrol" />
                        <Tab label={`In-Action PCBs (${inActionPCBs.length})`} value="pcbs" />
                    </Tabs>
                </Paper>

                {activeView === 'creation' && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 2 }}>Account Management & Operations Staging</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, bgcolor: '#f0fff0' }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: 'success.dark' }}>➕ Create Operator Account</Typography>
                                    <form onSubmit={handleCreate}>
                                        <TextField label="Staff Number" value={staffNumber} onChange={(e) => setStaffNumber(e.target.value)} fullWidth margin="normal" required size="small"/>
                                        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" required size="small"/>
                                        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required size="small"/>
                                        <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>Create Operator</Button>
                                    </form>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, bgcolor: '#e0f7fa', height: '100%' }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: 'info.dark' }}>🔗 Upload CSV (Operations)</Typography>
                                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} id="flow-upload" style={{ display: 'none' }}/>
                                    <Button component="label" htmlFor="flow-upload" variant="outlined" color="info" fullWidth sx={{ mb: 1 }}>
                                        {fileName ? `File Selected: ${fileName}` : 'Choose Operations CSV/Excel File'}
                                    </Button>
                                    {fileName && <Typography variant="body2" color="text.secondary">File: **{fileName}**</Typography>}
                                </Paper>
                            </Grid>
                        </Grid>
                        {uploadedData.length > 0 && renderUploadTable()}
                    </Box>
                )}
                
                {activeView === 'flowcontrol' && renderFlowControlTable()}
                
                {activeView === 'pcbs' && renderInActionPCBsTable()}
            </Container>
        </Box>
    );
}

export default SupervisorDashboard;