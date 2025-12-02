/**
 * NewAssignmentEditor.js
 * (Replaces SupervisorAssignment.js or Assignement.js)
 * -----------------------------------------
 * This is the "Single PCB Editor" screen.
 * * FIXED: 
 * 1. Auto-loads existing operators when you select an operation.
 * 2. Saves changes correctly back to App.js.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Button,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

// Reuse your existing components

import OperationSelector from "./Assignment/OperationSelector";
import OperatorSelector from "./Assignment/OperatorSelector";

export default function NewAssignmentEditor({
  pcb,               // The PCB we are editing (passed from App.js)
  operators = [],    // Master list of all operators
  onSave,            // Function to save back to App.js
  onCancel           // Function to go back
}) {
  
  // -- STATE --
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedOperators, setSelectedOperators] = useState([]);
  
  // We keep a local copy of the PCB's operations to edit before saving
  const [localOperations, setLocalOperations] = useState([]);

  // 1. Load PCB data on mount
  useEffect(() => {
    if (pcb && pcb.linkedOperations) {
      setLocalOperations(pcb.linkedOperations);
    }
  }, [pcb]);

  // 2. AUTO-FILL LOGIC (The Fix)
  // When user selects an operation, look up if anyone is already assigned!
  useEffect(() => {
    if (!selectedOperation) {
      setSelectedOperators([]);
      return;
    }

    // Identify the operation ID (handle both "sno" and "S.No" formats)
    const opId = selectedOperation.sno || selectedOperation["S.No"];

    // Find this operation in the PCB's current list
    const existingOp = localOperations.find(op => 
      (op.sno || op["S.No"]) == opId
    );

    if (existingOp && existingOp.assignedTo && existingOp.assignedTo.length > 0) {
      // We found assigned IDs (e.g. ["op1", "op2"])
      // We need to convert them to FULL OBJECTS for the dropdown to display names
      const fullOperatorObjects = operators.filter(staff => 
        existingOp.assignedTo.includes(staff.staffNumber)
      );
      
      setSelectedOperators(fullOperatorObjects);
    } else {
      // No one assigned yet
      setSelectedOperators([]);
    }

  }, [selectedOperation, localOperations, operators]);


  // 3. Update Local State when "Assign" is clicked (or real-time)
  const handleUpdateLocalState = () => {
    if (!selectedOperation) return alert("Select an operation first.");
    
    // Create updated list
    const opId = selectedOperation.sno || selectedOperation["S.No"];
    
    const updatedOps = localOperations.map(op => {
      const currentId = op.sno || op["S.No"];
      if (currentId == opId) {
        return {
          ...op,
          // Save IDs, not full objects (to keep data clean)
          assignedTo: selectedOperators.map(o => o.staffNumber), 
          status: op.status || "Not Started" 
        };
      }
      return op;
    });

    setLocalOperations(updatedOps);
    alert(`Updated assignments for Step ${opId}`);
  };

  // 4. Final Save back to App.js
  const handleSaveAndExit = () => {
    // Determine the ID key safely
    const serialKey = pcb._pcb_key_id || "PCB Serial Number";
    const serial = pcb[serialKey];
    
    onSave(serial, localOperations);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", pb: 4 }}>
      
      {/* HEADER */}
      <Box sx={{ p: 2, bgcolor: "white", borderBottom: "1px solid #ddd", mb: 3 }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={onCancel}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">
              Editing: {pcb["Serial Number"] || pcb["PCB Serial Number"] || "Unknown PCB"}
            </Typography>
            <Box flexGrow={1} />
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />}
              onClick={handleSaveAndExit}
            >
              Save All Changes
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* EDITING AREA */}
      <Container maxWidth="md">
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Modify Assignments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select an operation below. If operators are already assigned, they will appear automatically.
          </Typography>

          <Stack spacing={3}>
            {/* OPERATION SELECTOR */}
            <OperationSelector 
              operations={localOperations} // Show the PCB's own operations list
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
            />

            {/* OPERATOR SELECTOR */}
            <OperatorSelector 
              operatorOptions={operators}
              selectedOperators={selectedOperators}
              setSelectedOperators={setSelectedOperators}
            />

            {/* UPDATE BUTTON */}
            <Button 
              variant="contained" 
              color="secondary"
              onClick={handleUpdateLocalState}
              disabled={!selectedOperation}
            >
              Update This Step
            </Button>
          </Stack>

        </Paper>

        {/* PREVIEW OF CURRENT ASSIGNMENTS */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Status Preview:</Typography>
          {localOperations.map(op => {
             const assignedCount = (op.assignedTo || []).length;
             if (assignedCount === 0) return null; // Hide empty ones
             
             // Resolve names for display
             const names = operators
               .filter(s => (op.assignedTo || []).includes(s.staffNumber))
               .map(s => s.name)
               .join(", ");

             return (
               <Paper key={op.sno || op["S.No"]} sx={{ p: 2, mb: 1, bgcolor: "#e3f2fd" }}>
                 <Typography variant="body2" fontWeight="bold">
                   Step {op.sno || op["S.No"]}: {op.name || op["Operation Name"]}
                 </Typography>
                 <Typography variant="body2">
                   Assigned to: {names}
                 </Typography>
               </Paper>
             )
          })}
        </Box>

      </Container>
    </Box>
  );
}