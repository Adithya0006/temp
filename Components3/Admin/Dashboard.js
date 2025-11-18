import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; 
import { Box, Typography, Button, Paper, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Tabs, Tab, Alert, AppBar, Toolbar, Container, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const PCB_SERIAL_KEY_FALLBACK = 'PCB Serial Number'; 
const STATUS_KEY = 'Status'; 
const STATUS_NOT_YET_ASSIGNED = 'Not Yet Assigned';
const STATUS_ASSIGNED = 'Assigned';

// Helper function to safely get initial state from localStorage
const getInitialStateLocal = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) { return defaultValue; }
    }
    return defaultValue;
};

// Date formatter
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
};


// --- Utility Function: Read and Parse File ---
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
                    const newRow = { id: `row-${Date.now()}-${index}` }; 
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


function AdminDashboard({ onLogout, role, addInActionPCBs, deleteInActionPCB }) { 
    // State Initialization (with Persistence)
    const [masterList, setMasterList] = useState(getInitialStateLocal('adminMasterList', []));
    const [inActionList, setInActionList] = useState(getInitialStateLocal('adminInActionList', []));
    const [uploadedPreviewData, setUploadedPreviewData] = useState(null); 
    const [previewColumns, setPreviewColumns] = useState([]); 
    const [activeTab, setActiveTab] = useState('master');
    const [selectedIds, setSelectedIds] = useState(new Set(getInitialStateLocal('adminSelectedIds', [])));
    const [fileName, setFileName] = useState(getInitialStateLocal('adminFileName', null));
    const [view, setView] = useState(getInitialStateLocal('adminView', 'upload')); 
    const [pcbSerialKey, setPcbSerialKey] = useState(
        getInitialStateLocal('adminPcbSerialKey', PCB_SERIAL_KEY_FALLBACK)
    ); 

    // NEW: Timestamp states
    const [masterListCreated, setMasterListCreated] = useState(getInitialStateLocal('adminMasterListCreated', null));
    const [inActionLastUpdated, setInActionLastUpdated] = useState(getInitialStateLocal('adminInActionLastUpdated', null));

    // Persistence Hooks
    useEffect(() => { localStorage.setItem('adminMasterList', JSON.stringify(masterList)); }, [masterList]);
    useEffect(() => { localStorage.setItem('adminInActionList', JSON.stringify(inActionList)); }, [inActionList]);
    useEffect(() => { localStorage.setItem('adminPcbSerialKey', pcbSerialKey); }, [pcbSerialKey]);
    useEffect(() => { localStorage.setItem('adminFileName', fileName); }, [fileName]);
    useEffect(() => { localStorage.setItem('adminView', view); }, [view]);
    useEffect(() => { localStorage.setItem('adminSelectedIds', JSON.stringify(Array.from(selectedIds))); }, [selectedIds]);
    useEffect(() => { localStorage.setItem('adminMasterListCreated', masterListCreated); }, [masterListCreated]);
    useEffect(() => { localStorage.setItem('adminInActionLastUpdated', inActionLastUpdated); }, [inActionLastUpdated]);


    // --- Handlers ---
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            try {
                const data = await readFile(file); 
                if (data.length > 0) {
                    const fileColumns = Object.keys(data[0]).filter(key => key !== 'id');
                    if (!fileColumns.includes(STATUS_KEY)) { fileColumns.push(STATUS_KEY); }

                    const discoveredPcbKey = fileColumns.length > 0 ? fileColumns[0] : PCB_SERIAL_KEY_FALLBACK;
                    setPcbSerialKey(discoveredPcbKey);

                    setPreviewColumns(fileColumns);
                    setUploadedPreviewData(data);
                    setView('preview'); 
                } else {
                    alert("File uploaded but no data found.");
                }
            } catch (error) {
                alert("Error processing the file. Check format.");
            }
        }
    };
    
    const handleAddRow = () => {
        const newRow = { id: `row-${Date.now()}-new` };
        previewColumns.forEach(col => newRow[col] = '');
        newRow[STATUS_KEY] = STATUS_NOT_YET_ASSIGNED;
        setUploadedPreviewData(prev => [...prev, newRow]);
    };
    
    const handleDeleteRow = (rowId) => {
        if (window.confirm("Are you sure you want to delete this row?")) {
            setUploadedPreviewData(prev => prev.filter(row => row.id !== rowId));
        }
    };
    
    const handleUpdateCell = (rowId, colKey, newValue) => {
        setUploadedPreviewData(prev => 
            prev.map(row => 
                row.id === rowId ? { ...row, [colKey]: newValue } : row
            )
        );
    };

    const handleSaveToMasterList = () => {
        if (window.confirm("Are you sure you want to confirm these changes and save the data to the Master List?")) {
            const incomingData = uploadedPreviewData.map(row => ({ 
                ...row, 
                [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED 
            }));
            
            let newUniqueData = [];
            let skippedCount = 0;

            if (masterList.length === 0) {
                newUniqueData = incomingData;
                skippedCount = 0;
            } else {
                const existingSerials = new Set(masterList.map(row => row[pcbSerialKey]));

                newUniqueData = incomingData.filter(row => {
                    const serial = row[pcbSerialKey];
                    // Check if serial exists AND if it's not in the existing set
                    return serial && !existingSerials.has(serial);
                });
                
                skippedCount = incomingData.length - newUniqueData.length;
            }
            
            setMasterList(prevList => [...prevList, ...newUniqueData]);
            setMasterListCreated(new Date().toISOString()); 

            setUploadedPreviewData(null);
            setView('dashboard');
            setActiveTab('master');

            let alertMsg = `Successfully added ${newUniqueData.length} unique records to the Master List.`;
            if (skippedCount > 0) {
                 alertMsg += ` (${skippedCount} duplicate PCB Serial Number(s) skipped.)`;
            }
            alert(alertMsg);
        }
    };

    const handleCheckboxChange = (id) => {
        const row = masterList.find(r => r.id === id);
        if (row && row[STATUS_KEY] === STATUS_ASSIGNED) { return; }

        setSelectedIds(prev => {
            const newIds = new Set(prev);
            newIds.has(id) ? newIds.delete(id) : newIds.add(id);
            return newIds;
        });
    };

    const handleSave = () => {
        if (selectedIds.size === 0) { alert("Please select at least one row to mark as Assigned."); return; }

        const itemsToMove = [];
        const updatedMasterList = masterList.map(item => {
            if (selectedIds.has(item.id) && item[STATUS_KEY] !== STATUS_ASSIGNED) {
                itemsToMove.push(item);
                return { ...item, [STATUS_KEY]: STATUS_ASSIGNED };
            }
            return item;
        });
        
        if (itemsToMove.length === 0) { alert("No unassigned items were selected."); return; }

        setMasterList(updatedMasterList); 
        
        const newItemsForInAction = itemsToMove.map(item => ({ 
            ...item, 
            [STATUS_KEY]: 'Incomplete',
            _movedAt: new Date().toISOString(), // Internal tracking for inAction list
            _pcb_key_id: pcbSerialKey // Attach dynamic key for global lookup
        }));
        setInActionList(prevList => [...prevList, ...newItemsForInAction]);

        addInActionPCBs(itemsToMove, pcbSerialKey); 
        setSelectedIds(new Set());
        setInActionLastUpdated(new Date().toISOString()); 

        alert(`${itemsToMove.length} item(s) marked 'Assigned', moved to In-Action List, and shared with Supervisor.`);
        setActiveTab('inaction');
    };
    
    // NEW HANDLER: Move item back from In-Action to Master List
    const handleMoveBackToMaster = (rowId) => {
        const rowToMove = inActionList.find(r => r.id === rowId);

        if (!rowToMove || !window.confirm(`Are you sure you want to move PCB ${rowToMove[pcbSerialKey]} back to Master List for editing? This will delete the record from the Supervisor's pending list.`)) {
            return;
        }

        const serialNumber = rowToMove[pcbSerialKey];

        // 1. Update Master List: Change status back to "Not Yet Assigned"
        setMasterList(prevList => prevList.map(item => {
            if (item[pcbSerialKey] === serialNumber) {
                return { ...item, [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED };
            }
            return item;
        }));

        // 2. Delete from local In-Action List
        setInActionList(prevList => prevList.filter(item => item.id !== rowId));

        // 3. Delete from Supervisor's global list
        deleteInActionPCB(serialNumber); 
        setInActionLastUpdated(new Date().toISOString()); 

        alert(`PCB ${serialNumber} moved back to Master List and is available for re-assignment.`);
        setActiveTab('master');
    };


    // --- Render Components ---

    const renderDataTab = (data, isMasterList) => {
        let currentColumns = masterList.length > 0 ? Object.keys(masterList[0]).filter(k => k !== 'id') : [];
        if (currentColumns.length === 0 && data.length > 0) {
             currentColumns = Object.keys(data[0]).filter(k => k !== 'id');
        }

        if (data.length === 0) {
            return <Typography sx={{ p: 3, textAlign: 'center' }}>No data to display in this list.</Typography>;
        }
        
        const inActionColumns = [...currentColumns, 'Edit']; 
        
        return (
            <Box>
                <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.200' }}>
                                {isMasterList && <TableCell padding="checkbox">Select</TableCell>}
                                {isMasterList ? currentColumns.map(col => <TableCell key={col}>{col}</TableCell>) : inActionColumns.map(col => <TableCell key={col}>{col}</TableCell>)} 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => {
                                const isAssigned = row[STATUS_KEY] === STATUS_ASSIGNED;
                                const statusColor = isAssigned ? 'success.dark' : (row[STATUS_KEY] === STATUS_NOT_YET_ASSIGNED ? 'warning.dark' : 'error.dark');

                                return (
                                    <TableRow key={row.id} sx={{ bgcolor: isAssigned ? '#f0fff0' : 'white', '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {isMasterList && (
                                            <TableCell padding="checkbox">
                                                <Checkbox 
                                                    checked={isAssigned || selectedIds.has(row.id)} 
                                                    onChange={() => handleCheckboxChange(row.id)}
                                                    disabled={isAssigned} 
                                                    color="primary"
                                                />
                                            </TableCell>
                                        )}
                                        {currentColumns.map(colKey => (
                                            <TableCell key={`${row.id}-${colKey}`}>
                                                {colKey === STATUS_KEY ? 
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: statusColor }}>
                                                        {row[colKey]}
                                                    </Typography>
                                                    : row[colKey]
                                                }
                                            </TableCell>
                                        ))}
                                        {!isMasterList && (
                                            <TableCell>
                                                <Button
                                                    onClick={() => handleMoveBackToMaster(row.id)}
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isMasterList ? (
                        <>
                            <Typography variant="caption" color="textSecondary">
                                Created At: <strong>{formatDate(masterListCreated)}</strong>
                            </Typography>
                            <Button variant="contained" color="primary" onClick={handleSave} disabled={selectedIds.size === 0}>
                                Mark Selected as 'Assigned' and Send to In-Action List ({selectedIds.size})
                            </Button>
                        </>
                    ) : (
                        <Typography variant="caption" color="textSecondary">
                            Last Updated At: <strong>{formatDate(inActionLastUpdated)}</strong>
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    };

    const renderPreview = () => (
        <Box component={Paper} sx={{ p: 3, mt: 3, bgcolor: '#fffde7', border: '1px solid #ffeb3b' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                 <Button onClick={() => setView('upload')} variant="outlined" startIcon={<ArrowBackIcon />}>
                    Go Back
                </Button>
                 <Typography variant="h5" color="warning.dark">File Preview & Manual Editing 📝</Typography>
                 <Button onClick={() => setView('upload')} variant="outlined" color="error" startIcon={<DeleteIcon />}>
                    Cancel/Re-Upload
                </Button>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>Review and perform CRUD operations on the data before saving to the Master List. Total rows: {uploadedPreviewData.length}</Typography>
            
            {/* Top Add Row Button */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button onClick={handleAddRow} variant="contained" color="success" startIcon={<AddIcon />}>Add New Row</Button>
            </Box>
            
            <TableContainer component={Paper} sx={{ maxHeight: 400, mb: 3 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {previewColumns.map(col => <TableCell key={col} sx={{ fontWeight: 'bold' }}>{col}</TableCell>)}
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {uploadedPreviewData.map((row) => (
                            <TableRow key={row.id}>
                                {previewColumns.map(colKey => (
                                    <TableCell key={`${row.id}-${colKey}`} sx={{ p: 0.5 }}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={row[colKey] || ''}
                                            onChange={(e) => handleUpdateCell(row.id, colKey, e.target.value)}
                                            disabled={colKey === STATUS_KEY}
                                            sx={{ '& .MuiInputBase-input': { py: 1 } }}
                                        />
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <IconButton onClick={() => handleDeleteRow(row.id)} color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
             {/* Bottom Add Row Button */}
             <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button onClick={handleAddRow} variant="contained" color="success" startIcon={<AddIcon />}>Add New Row</Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button onClick={handleSaveToMasterList} variant="contained" color="primary" size="large">
                    Save to Master List (Confirm)
                </Button>
            </Box>
        </Box>
    );
    
    const renderUploadCard = () => (
        <Paper elevation={3} sx={{ p: 4, mt: 3, textAlign: 'center', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📥 Upload Project Sheet (CSV/Excel)</Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>Current file: {fileName || 'None'}</Typography>
            <input 
                type="file" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
                id="file-upload"
                style={{ display: 'none' }}
            />
            <Button variant="contained" component="label" htmlFor="file-upload" fullWidth>
                Choose File
            </Button>
        </Paper>
    );

    const renderDashboardTabs = () => (
        <Box sx={{ mt: 3 }}>
            <Button onClick={() => setView('upload')} variant="outlined" sx={{ mb: 2 }}>Upload New Sheet</Button>
            <Paper elevation={1} sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} indicatorColor="primary" textColor="primary" variant="fullWidth">
                    <Tab label={`Master List (${masterList.length})`} value="master" />
                    <Tab label={`In-Action List (${inActionList.length})`} value="inaction" />
                </Tabs>
            </Paper>
            
            {activeTab === 'master' && renderDataTab(masterList, true)}
            {activeTab === 'inaction' && renderDataTab(inActionList, false)}
        </Box>
    );

    // --- Main Component Render Logic (retained) ---
    const renderContent = () => {
        switch (view) {
            case 'upload':
                return renderUploadCard();
            case 'preview':
                return uploadedPreviewData && uploadedPreviewData.length > 0 ? renderPreview() : renderUploadCard();
            case 'dashboard':
                if (masterList.length === 0) {
                    return renderUploadCard();
                }
                return renderDashboardTabs();
            default:
                return renderUploadCard();
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Dashboard - Project Data Management
                    </Typography>
                    <Button color="inherit" onClick={onLogout} variant="outlined">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" sx={{ pt: 3 }}>
                {renderContent()}
            </Container>
        </Box>
    );
}

export default AdminDashboard;