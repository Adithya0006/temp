import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, List, TableContainer, Paper } from '@mui/material';
import { Visibility } from '@mui/icons-material';

const PCBTable = ({ pcbData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null); // Store the selected stage order

  const handleViewClick = (stageOrder) => {
    setSelectedStage(stageOrder);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStage(null); // Reset selected stage when closing
  };

  // Extract unique stage orders
  const stageOrders = [...new Set(pcbData.map(item => item.current_step_order))];

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell  sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Stage ID</TableCell>
            <TableCell  sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Stage Name</TableCell>
            <TableCell  sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>No of PCBs</TableCell>
            <TableCell  sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>View</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stageOrders.map((stageOrder) => {
            const stagePcbCount = pcbData.filter(item => item.current_step_order === stageOrder).length;
            const stagePcbList = pcbData.filter(item => item.current_step_order === stageOrder);
            const stageName = pcbData.find(item => item.current_step_order === stageOrder).current_step; // Get stage name

            return (
              <TableRow key={stageOrder}>
                <TableCell sx={{opacity:0.8,fontWeight:600}}>{stageOrder}</TableCell>
                <TableCell sx={{opacity:0.8,fontWeight:600}}>{stageName}</TableCell>
                <TableCell sx={{opacity:0.8,fontWeight:600}}>{stagePcbCount}</TableCell>
                <TableCell>
                  <Button variant="outlined" sx={{width:"fit-content"}} onClick={() => handleViewClick(stageOrder)}>
                  <Visibility></Visibility>  
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
  <DialogTitle>PCB Details - Stage {selectedStage}</DialogTitle>
  <DialogContent>
    <List>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Serial No</TableCell>
              <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Part Number</TableCell>
              <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Current Stage Number</TableCell>
              <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Current Stage Name</TableCell>
              <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: '700', color: '#475569' }}>Operator Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pcbData.filter(item => item.current_step_order === selectedStage).map((pcb, index) => (
              <TableRow key={pcb.serial_no || index}> {/* Use index as the last resort */}
                <TableCell>{pcb.serial_no || 'N/A'}</TableCell>
                <TableCell>{pcb.part_number || 'N/A'}</TableCell>
                <TableCell>{pcb.current_step_order || 'N/A'}</TableCell>
                <TableCell>{pcb.current_step || 'N/A'}</TableCell>
                <TableCell>{pcb.operator.name || 'YET TO START'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </List>
  </DialogContent>
</Dialog>
    </>
  );
};

export default PCBTable;