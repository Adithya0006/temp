import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel, AppBar, Toolbar, Container } from '@mui/material';

const PCB_SERIAL_KEY_FALLBACK = 'PCB Serial Number'; 

function AssignmentEditor({ pcb, operators, onSave, onCancel, onLogout }) {
    // State to hold the temporary mapping of operations to operators
    const [assignedOperations, setAssignedOperations] = useState(
        pcb.linkedOperations.map(op => ({
            ...op,
            assignedTo: op.assignedTo || '' 
        }))
    );
    
    const pcbSerial = pcb[pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK];
    const totalOperations = assignedOperations.length;

    // Handle dropdown change for a specific operation
    const handleAssignmentChange = (operationSNo, staffNumber) => {
        setAssignedOperations(prevOps => prevOps.map(op => {
            if (op['S.No'] === operationSNo) {
                return { ...op, assignedTo: staffNumber };
            }
            return op;
        }));
    };

    // Final Save Action
    const handleFinalSave = () => {
        const unassignedCount = assignedOperations.filter(op => !op.assignedTo).length;

        if (unassignedCount > 0) {
            if (!window.confirm(`WARNING: ${unassignedCount} operations are unassigned. Do you want to save anyway?`)) {
                return;
            }
        }
        
        onSave(pcbSerial, assignedOperations);
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f7f9fa' }}>
            <AppBar position="static" sx={{ bgcolor: '#34495e' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Assigning Work for PCB: {pcbSerial}
                    </Typography>
                    <Button color="inherit" onClick={onLogout} variant="outlined">Logout</Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ pt: 3 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                        Operation Assignment Editor
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Total Mandatory Operations: <strong>{totalOperations}</strong>
                    </Typography>

                    <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.200' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>S.No</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Operation Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Current Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Assign Operator</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignedOperations.map(op => (
                                    <TableRow key={op['S.No']}>
                                        <TableCell>{op['S.No']}</TableCell>
                                        <TableCell>{op['Operation Name']}</TableCell>
                                        <TableCell>{op['Status']}</TableCell>
                                        <TableCell>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Operator</InputLabel>
                                                <Select
                                                    value={op.assignedTo || ''}
                                                    label="Operator"
                                                    onChange={(e) => handleAssignmentChange(op['S.No'], e.target.value)}
                                                >
                                                    <MenuItem value="">-- Select Operator --</MenuItem>
                                                    {operators.map(operator => (
                                                        <MenuItem key={operator.staff_number} value={operator.staff_number}>
                                                            {operator.name} ({operator.staff_number})
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pb: 3 }}>
                    <Button onClick={onCancel} variant="outlined" color="error" size="large">
                        Cancel & Back
                    </Button>
                    <Button onClick={handleFinalSave} variant="contained" color="primary" size="large">
                        Confirm & Save Assignment (Final)
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default AssignmentEditor;