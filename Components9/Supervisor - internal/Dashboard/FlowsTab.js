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
import SaveIcon from "@mui/icons-material/Save";
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
  operators = []     
}) {
  const [savedFlows, setSavedFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Builder State
  const [flowName, setFlowName] = useState("");
  const [currentSteps, setCurrentSteps] = useState([]);

  // Selections
  const [selectedOp, setSelectedOp] = useState(null); // From Dropdown
  const [customOpName, setCustomOpName] = useState(""); // For "CRUD" Manual Entry
  const [selectedStaff, setSelectedStaff] = useState([]);

  // Load Flows
  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    setIsLoading(true);
    try {
      const data = await flowService.getAllFlows();
      setSavedFlows(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStep = () => {
    // 1. Determine Operation Name (Dropdown OR Custom Text)
    let finalOpName = "";
    let finalOpId = "";

    if (customOpName.trim()) {
      // User typed a custom name (CRUD Create)
      finalOpName = customOpName.trim();
      finalOpId = "CUST_" + Date.now(); // Generate unique ID
    } else if (selectedOp) {
      // User selected from list
      finalOpName = selectedOp.name || selectedOp["Operation Name"];
      finalOpId = selectedOp.sno || selectedOp["S.No"];
    } else {
      return alert("Please select an Operation OR type a Custom Operation name.");
    }

    if (selectedStaff.length === 0) return alert("Select at least one Operator.");

    // 2. Add to list
    const newStep = {
      opId: finalOpId,
      opName: finalOpName,
      assignedStaff: selectedStaff.map(s => ({ id: s.staffNumber, name: s.name }))
    };

    setCurrentSteps([...currentSteps, newStep]);

    // 3. Reset Inputs
    setSelectedOp(null);
    setCustomOpName("");
    setSelectedStaff([]);
  };

  const handleSaveFlow = async () => {
    if (!flowName.trim()) return alert("Please name your Flow.");
    if (currentSteps.length === 0) return alert("Add at least one step.");

    try {
      await flowService.saveFlow({ name: flowName, steps: currentSteps });
      alert("Flow Saved!");
      setFlowName("");
      setCurrentSteps([]);
      loadFlows();
    } catch (err) {
      alert("Error saving flow.");
    }
  };

  const handleDeleteFlow = async (id) => {
    if (!window.confirm("Delete this flow?")) return;
    await flowService.deleteFlow(id);
    loadFlows();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, pb: 5 }}>
      <Grid container spacing={3}>

        {/* LEFT: BUILDER */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Create New Flow</Typography>
            
            <TextField
              fullWidth
              label="Flow Name"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* --- ADD STEP BOX --- */}
            <Box sx={{ border: "1px dashed #ccc", p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "primary.main" }}>
                Add Operation Step
              </Typography>

              {/* Using Stack to prevent squashing */}
              <Stack spacing={2}>
                
                {/* 1. SELECT EXISTING OPERATION */}
                <OperationSelector
                  operations={operations}
                  selectedOperation={selectedOp}
                  setSelectedOperation={(val) => {
                    setSelectedOp(val);
                    if(val) setCustomOpName(""); // Clear custom if dropdown used
                  }}
                />

                <Divider>OR TYPE NEW (CRUD)</Divider>

                {/* 2. CUSTOM OPERATION INPUT (CRUD Feature) */}
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Type Custom Operation Name" 
                  value={customOpName}
                  onChange={(e) => {
                    setCustomOpName(e.target.value);
                    if(e.target.value) setSelectedOp(null); // Clear dropdown if typing
                  }}
                  helperText="Use this if the operation is not in the dropdown list."
                />

                {/* 3. ASSIGN OPERATOR */}
                <OperatorSelector
                  operatorOptions={operators}
                  selectedOperators={selectedStaff}
                  setSelectedOperators={setSelectedStaff}
                />

                {/* 4. ADD BUTTON */}
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddStep}
                  size="large"
                >
                  Add Step to Sequence
                </Button>
              </Stack>
            </Box>

            {/* PREVIEW LIST */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Sequence Preview</Typography>
              <List dense>
                {currentSteps.map((step, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => {
                        const upd = [...currentSteps];
                        upd.splice(index, 1);
                        setCurrentSteps(upd);
                      }}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    }
                    sx={{ bgcolor: "white", mb: 1, borderRadius: 1, border: "1px solid #eee" }}
                  >
                    <ListItemText
                      primary={<strong>{index + 1}. {step.opName}</strong>}
                      secondary={`Assigned: ${step.assignedStaff.map(s => s.name).join(", ")}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSaveFlow}
              disabled={!flowName || currentSteps.length === 0}
              sx={{ mt: 2 }}
            >
              Save Flow Template
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT: LIST */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Available Flows</Typography>
            {isLoading ? <Typography>Loading...</Typography> : (
              <List>
                {savedFlows.map((flow) => (
                  <Paper key={flow.id} elevation={1} sx={{ mb: 2, borderLeft: "4px solid #1976d2" }}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <IconButton onClick={() => handleDeleteFlow(flow.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={<b>{flow.name}</b>}
                        secondary={`${flow.steps.length} steps configured`}
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}