/**
 * FlowsTab.js
 * -----------------------------------------
 * This tab allows the Supervisor to create "Master Flows".
 * A Flow is a sequence of Operations pre-assigned to Operators.
 *
 * FEATURES:
 * - Build a sequence (Step 1 -> Step 2 -> Step 3)
 * - Save the sequence as a "Flow" (e.g., "Night Shift Flow")
 * - View/Delete existing flows.
 */

import React, { useState, useEffect } from "react";
import {
    Stack,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // New Icon
import SaveIcon from "@mui/icons-material/Save";
import UpdateIcon from "@mui/icons-material/Update"; // New Icon
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

// Reusing your existing selectors (Modularity!)
import OperatorSelector from "../Assignment/OperatorSelector";
// import OperatorSelector from "../Assignment/OperatorSelector";
import OperationSelector from "../Assignment/OperationSelector"

// Service Layer
// import { flowService } from "./services/flowService"; // Adjust path as needed
import { flowService } from "../services/flowService";


export default function FlowsTab({
  operations = [],   
  operators = [],
  onFlowUpdate // <--- Received from Dashboard
}) {
  const [savedFlows, setSavedFlows] = useState([]);
  
  // Builder State
  const [editingId, setEditingId] = useState(null); // ID of flow being edited
  const [flowName, setFlowName] = useState("");
  const [currentSteps, setCurrentSteps] = useState([]);

  // Selectors
  const [selectedOp, setSelectedOp] = useState(null);
  const [customOpName, setCustomOpName] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => { loadFlows(); }, []);

  const loadFlows = async () => {
    try {
      const data = await flowService.getAllFlows();
      setSavedFlows(data);
    } catch (err) {console.error(err)};
  };

  // --- 1. ADD STEP LOGIC ---
  const handleAddStep = () => {
    // 1. Validation (Get Op Name & ID)
    let finalOpName = "";
    let finalOpId = "";

    if (customOpName.trim()) {
      finalOpName = customOpName.trim();
      finalOpId = "CUST_" + Date.now();
    } else if (selectedOp) {
      finalOpName = selectedOp.name || selectedOp["Operation Name"];
      finalOpId = selectedOp.sno || selectedOp["S.No"];
    } else {
      return alert("Please select an Operation OR type a Custom Operation name.");
    }

    if (selectedStaff.length === 0) return alert("Select at least one Operator.");

    // 2. SMART UPDATE LOGIC (The Fix)
    // Check if this step is already in the list
    const existingIndex = currentSteps.findIndex(s => String(s.opId) === String(finalOpId));

    if (existingIndex !== -1) {
      // SCENARIO: STEP EXISTS -> UPDATE IT
      // We assume the user wants to change the operators for this step
      const updatedSteps = [...currentSteps];
      updatedSteps[existingIndex] = {
        opId: finalOpId,
        opName: finalOpName,
        assignedStaff: selectedStaff.map(s => ({ id: s.staffNumber, name: s.name }))
      };
      
      setCurrentSteps(updatedSteps);
      // Optional: Visual feedback
      // alert(`Updated Step ${finalOpId}: Operators changed.`);
      
    } else {
      // SCENARIO: NEW STEP -> ADD IT
      const newStep = {
        opId: finalOpId,
        opName: finalOpName,
        assignedStaff: selectedStaff.map(s => ({ id: s.staffNumber, name: s.name }))
      };
      setCurrentSteps([...currentSteps, newStep]);
    }

    // 3. Reset Inputs
    setSelectedOp(null);
    setCustomOpName("");
    setSelectedStaff([]);
  };

  // --- 2. EDIT MODE LOGIC ---
  const handleEditClick = (flow) => {
    setEditingId(flow.id);
    setFlowName(flow.name);
    setCurrentSteps(flow.steps); // Load steps into builder
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFlowName("");
    setCurrentSteps([]);
  };

  // --- 3. SAVE / UPDATE LOGIC ---
  const handleSaveFlow = async () => {
    if (!flowName.trim() || currentSteps.length === 0) return alert("Invalid Flow");

    // CRITICAL: We must pass the 'editingId' so the service knows to Update, not Create.
    const payload = {
      id: editingId, // <--- IF THIS IS NULL, IT CREATES NEW. IF HAS ID, IT UPDATES.
      name: flowName,
      steps: currentSteps
    };

    try {
      // 1. Save to Backend (Now handles updates correctly)
      const savedData = await flowService.saveFlow(payload);
      
      // 2. TRIGGER SYNC (Updates the PCBs)
      // Since the ID is preserved, the PCBs will match this ID and update!
      if (editingId && onFlowUpdate) {
        onFlowUpdate(savedData); 
      }

      alert(editingId ? "Flow Updated & Synced!" : "Flow Created!");
      
      // Reset Form
      handleCancelEdit();
      loadFlows();
    } catch (err) {
      alert("Error saving flow.");
    }
  };

  const handleDeleteFlow = async (id) => {
    if (!window.confirm("Delete this flow? (This won't affect assigned PCBs)")) return;
    await flowService.deleteFlow(id);
    loadFlows();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, pb: 5 }}>
      <Grid container spacing={3}>

        {/* LEFT: BUILDER */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderTop: editingId ? "4px solid orange" : "4px solid #1976d2" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {editingId ? "Edit Flow Template" : "Create New Flow"}
              </Typography>
              {editingId && (
                <Button size="small" onClick={handleCancelEdit}>Cancel Edit</Button>
              )}
            </Stack>

            <TextField
              fullWidth label="Flow Name" value={flowName}
              onChange={(e) => setFlowName(e.target.value)} sx={{ mb: 3 }}
            />

            {/* ADD STEP BOX */}
            <Box sx={{ border: "1px dashed #ccc", p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}>
              <Stack spacing={2}>
                <OperationSelector 
                  operations={operations} 
                  selectedOperation={selectedOp} 
                  setSelectedOperation={(v)=>{setSelectedOp(v); if(v) setCustomOpName("");}} 
                />
                <Divider>OR</Divider>
                <TextField 
                  size="small" placeholder="Custom Operation Name" 
                  value={customOpName} 
                  onChange={(e)=>{setCustomOpName(e.target.value); if(e.target.value) setSelectedOp(null);}} 
                />
                <OperatorSelector 
                  operatorOptions={operators} 
                  selectedOperators={selectedStaff} 
                  setSelectedOperators={setSelectedStaff} 
                />
                <Button variant="contained" startIcon={<AddCircleIcon />} onClick={handleAddStep}>
                  Add Step
                </Button>
              </Stack>
            </Box>

            {/* PREVIEW */}
            <List dense sx={{ mt: 2 }}>
              {currentSteps.map((step, i) => (
                <ListItem key={i} sx={{ border: "1px solid #eee", mb: 1, borderRadius: 1 }}
                  secondaryAction={
                    <IconButton onClick={() => {
                      const n = [...currentSteps]; n.splice(i, 1); setCurrentSteps(n);
                    }}><DeleteIcon color="error"/></IconButton>
                  }
                >
                  <ListItemText 
                    primary={<b>{i+1}. {step.opName}</b>} 
                    secondary={step.assignedStaff.map(s=>s.name).join(", ")} 
                  />
                </ListItem>
              ))}
            </List>

            <Button 
              fullWidth variant="contained" size="large" 
              color={editingId ? "warning" : "primary"}
              startIcon={editingId ? <UpdateIcon /> : <SaveIcon />}
              onClick={handleSaveFlow}
              sx={{ mt: 2 }}
            >
              {editingId ? "Update Flow & Sync PCBs" : "Save New Flow"}
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT: LIST */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Available Flows</Typography>
            <List>
              {savedFlows.map((flow) => (
                <Paper key={flow.id} elevation={1} sx={{ mb: 2, borderLeft: "4px solid #1976d2" }}>
                  <ListItem alignItems="flex-start" secondaryAction={
                    <Stack direction="row">
                       {/* EDIT BUTTON */}
                      <IconButton onClick={() => handleEditClick(flow)} color="primary">
                        <EditIcon />
                      </IconButton>
                       {/* DELETE BUTTON */}
                      <IconButton onClick={() => handleDeleteFlow(flow.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }>
                    <ListItemText primary={<b>{flow.name}</b>} secondary={`${flow.steps.length} steps`} />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}