/**
 * InActionTab.js
 * -----------------------------------------
 * UPDATED features:
 * 1. "Select Flow" Dropdown
 * 2. "Apply Flow" Button
 * 3. Bulk Logic to update unassigned PCBs
 */

import React, { useState, useEffect } from "react";
import {
  Container,
  Stack,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import BoltIcon from "@mui/icons-material/Bolt"; // Icon for "Action"

// Service to fetch available flows
// import { flowService } from "../../services/flowService";
import { flowService } from "../services/flowService";
const PCB_KEY_FALLBACK = "serial number";

// Helper to find serial key safely
const detectKey = (pcb) =>
  pcb._pcb_key_id ||
  Object.keys(pcb).find((k) => k !== "id" && k !== "linkedOperations") ||
  PCB_KEY_FALLBACK;

export default function InActionTab({
  inActionPCBs = [],
  setInActionPCBs, // <--- Required to update state
  handleAssignWork,
}) {
  // --- STATE ---
  const [availableFlows, setAvailableFlows] = useState([]);
  const [selectedFlowId, setSelectedFlowId] = useState("");

  // --- 1. LOAD FLOWS ON MOUNT ---
  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      const flows = await flowService.getAllFlows();
      setAvailableFlows(flows);
    } catch (err) {
      console.error("Failed to load flows", err);
    }
  };

  // --- 2. BULK APPLY LOGIC ---
  const handleBulkApply = () => {
    if (!selectedFlowId) return alert("Please select a Flow first.");

    // 1. Find the actual flow object
    const flowToApply = availableFlows.find(f => f.id === selectedFlowId);
    if (!flowToApply) return;

    // 2. Count eligible PCBs (Fresh PCBs with 0 ops)
    const freshPCBs = inActionPCBs.filter(
      (pcb) => !pcb.linkedOperations || pcb.linkedOperations.length === 0
    );

    if (freshPCBs.length === 0) {
      return alert("No fresh PCBs (0 assignments) found to apply this flow to.");
    }

    if (!window.confirm(`Apply "${flowToApply.name}" to ${freshPCBs.length} PCBs?`)) {
      return;
    }

    // 3. Create NEW list with flow applied
    const updatedList = inActionPCBs.map((pcb) => {
      // Check if this PCB is "Fresh"
      const isFresh = !pcb.linkedOperations || pcb.linkedOperations.length === 0;

      if (isFresh) {
        // CONVERT FLOW STEPS -> PCB OPERATIONS
        const newOps = flowToApply.steps.map((step) => ({
          sno: step.opId,
          name: step.opName,
          // Map assignedStaff objects to just staffNumbers (or keep full object depending on your backend)
          assignedTo: step.assignedStaff.map(s => s.id),
          status: "Not Started",
          startTime: null,
          endTime: null
        }));

        return {
          ...pcb,
          linkedOperations: newOps,
          isWorkAssigned: true
        };
      }

      // If not fresh, return as is
      return pcb;
    });

    // 4. Update Parent State
    if (setInActionPCBs) {
      setInActionPCBs(updatedList);
      alert("Flow Applied Successfully!");
      setSelectedFlowId(""); // Reset dropdown
    } else {
      console.error("setInActionPCBs prop is missing!");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>

      {/* --- HEADER & BULK CONTROLS --- */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        
        {/* Title */}
        <Stack direction="row" spacing={1} alignItems="center">
          <InventoryIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6">
            In-Action PCBs ({inActionPCBs.length})
          </Typography>
        </Stack>

        {/* Bulk Flow Selector */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Flow to Apply</InputLabel>
            <Select
              value={selectedFlowId}
              label="Select Flow to Apply"
              onChange={(e) => setSelectedFlowId(e.target.value)}
            >
              {availableFlows.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name} ({f.steps.length} Steps)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<BoltIcon />}
            onClick={handleBulkApply}
            disabled={!selectedFlowId}
          >
            Apply to New
          </Button>
        </Box>
      </Paper>

      {/* --- DATA TABLE --- */}
      <Paper sx={{ borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: "65vh" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell>Serial</TableCell>
                <TableCell>Common Info</TableCell>
                <TableCell>Assigned Ops</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inActionPCBs.map((pcb) => {
                const key = detectKey(pcb);
                const serial = pcb[key] ?? pcb[PCB_KEY_FALLBACK] ?? "N/A";

                // Calculate assignment status
                const assignedOpsCount = (pcb.linkedOperations || []).filter(
    (op) => op.assignedTo && op.assignedTo.length > 0
  ).length;
  const isAssigned = assignedOpsCount > 0;

                return (
                  <TableRow key={pcb.id || serial} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{serial}</Typography>
                    </TableCell>

                    <TableCell>
                      {/* Show first 2-3 fields for context */}
                      {Object.entries(pcb)
                        .filter(([k]) => !["id", "linkedOperations", "_pcb_key_id", "isWorkAssigned"].includes(k))
                        .slice(0, 2)
                        .map(([k, v]) => (
                          <div key={k}>
                            <Typography variant="caption" color="text.secondary">{k}:</Typography>{" "}
                            <Typography variant="body2" component="span">{String(v)}</Typography>
                          </div>
                        ))}
                    </TableCell>

                    <TableCell>
                      {isAssigned ? (
                        <Box>
                          <Typography variant="body2" sx={{ color: "success.main", fontWeight: "bold" }}>
                            {assignedOpsCount} Steps Assigned
                          </Typography>
                          {/* Show name of first operation as preview */}
                          {pcb.linkedOperations[0] && (
                            <Typography variant="caption" display="block">
                              Next: {pcb.linkedOperations.find(o => o.status !== "Completed")?.name || "All Done"}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Waiting for Flow...
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleAssignWork(serial)}
                        variant={isAssigned ? "outlined" : "contained"} // Highlight button if needs assignment
                        color={isAssigned ? "primary" : "warning"}
                      >
                        {isAssigned ? "Edit" : "Assign"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}