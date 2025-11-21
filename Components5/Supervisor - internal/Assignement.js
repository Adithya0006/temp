// Supervisor - internal / Assignement.js
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

// Default 40 operations
const DEFAULT_OPERATIONS_LIST = [
  { "S.No": "1", "Operation Name": "Labeling & Traceability of Bare PCB" },
  { "S.No": "2", "Operation Name": "Cleaning of Bare PCB" },
  { "S.No": "3", "Operation Name": "Baking of Bare PCB" },
  { "S.No": "4", "Operation Name": "Preparation / Screen Printing / SPI for Top Side" },
  { "S.No": "5", "Operation Name": "SMT Loading / Pick n Place / Unloading for Top Side" },
  { "S.No": "6", "Operation Name": "Reflow for Top Side" },
  { "S.No": "7", "Operation Name": "X-Ray & AOI for First PCB Top Side" },
  { "S.No": "8", "Operation Name": "Application of Amicon D125 FS DR" },
  { "S.No": "9", "Operation Name": "Preparation / Screen Printing / SPI for Bottom Side" },
  { "S.No": "10", "Operation Name": "SMT Loading / Pick n Place / Unloading for Bottom Side" },
  { "S.No": "11", "Operation Name": "Reflow for Bottom Side" },
  { "S.No": "12", "Operation Name": "X-Ray & AOI for First PCB Bottom Side" },
  { "S.No": "13", "Operation Name": "Traceability of BGA & Circulators" },
  { "S.No": "14", "Operation Name": "Cleaning of PCBA" },
  { "S.No": "15", "Operation Name": "AOI" },
  { "S.No": "16", "Operation Name": "X-Ray Inspection" },
  { "S.No": "17", "Operation Name": "Ersascope Inspection" },
  { "S.No": "18", "Operation Name": "Throught Hole Component Soldering" },
  { "S.No": "19", "Operation Name": "Selective Soldering" },
  { "S.No": "20", "Operation Name": "Wave Soldering" },
  { "S.No": "21", "Operation Name": "Manual Soldering & Assembly" },
  { "S.No": "22", "Operation Name": "Grinding" },
  { "S.No": "23", "Operation Name": "Touch Up" },
  { "S.No": "24", "Operation Name": "Programming" },
  { "S.No": "25", "Operation Name": "Visual Inspection" },
  { "S.No": "26", "Operation Name": "ICT" },
  { "S.No": "27", "Operation Name": "Contamination Check" },
  { "S.No": "28", "Operation Name": "Masking" },
  { "S.No": "29", "Operation Name": "Conformal Coating" },
  { "S.No": "30", "Operation Name": "De Masking" },
  { "S.No": "31", "Operation Name": "Adhesion Test" },
  { "S.No": "32", "Operation Name": "Canon Prep" },
  { "S.No": "33", "Operation Name": "Intermediate Control" },
  { "S.No": "34", "Operation Name": "Cover Mounting & Braking of Screws" },
  { "S.No": "35", "Operation Name": "HASS" },
  { "S.No": "36", "Operation Name": "ATE1" },
  { "S.No": "37", "Operation Name": "ATE2" },
  { "S.No": "38", "Operation Name": "EMI Shield Mounting" },
  { "S.No": "39", "Operation Name": "Final Control" },
  { "S.No": "40", "Operation Name": "Clearance Control" },
];

export default function NewAssignmentEditor({
  pcb,
  operators = [],
  onSave,
  onCancel,
  onLogout,
}) {
  // base ops
  const initialOps = useMemo(
    () => DEFAULT_OPERATIONS_LIST.map((op) => ({ ...op })),
    []
  );

  const [operations, setOperations] = useState(initialOps);

  // main mapping { operationName: [ {staffNumber, name} ] }
  const [mappings, setMappings] = useState({});

  const [selectedOperation, setSelectedOperation] = useState(
    initialOps[0]["Operation Name"]
  );
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [newOperationName, setNewOperationName] = useState("");

  const pcbKey = pcb?._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
  const pcbSerial = pcb[pcbKey];

  // operator dropdown options
  const operatorOptions = operators.map((op) => ({
    label: `${op.name} (${op.staffNumber})`,
    staffNumber: String(op.staffNumber),
    name: op.name,
  }));

  // 🔥 LOAD PREVIOUS ASSIGNMENTS WHEN PAGE OPENS
  useEffect(() => {
    if (pcb?.linkedOperations) {
      const initial = {};

      pcb.linkedOperations.forEach((op) => {
        const opName = op["Operation Name"];
        const assigned = op.assignedTo || [];

        if (assigned.length > 0) {
          initial[opName] = assigned.map((a) => ({
            staffNumber: String(a.staffNumber),
            name: a.name,
          }));
        }
      });

      setMappings(initial);
    }
  }, [pcb]);

  // ------------------------------ Add new Operation ----------------------------
  const handleAddOperation = () => {
    const name = newOperationName.trim();
    if (!name) return alert("Enter valid operation name");

    if (
      operations.some(
        (op) =>
          op["Operation Name"].toLowerCase() === name.toLowerCase()
      )
    ) {
      return alert("Operation already exists!");
    }

    setOperations((prev) => [
      ...prev,
      {
        "S.No": String(prev.length + 1),
        "Operation Name": name,
      },
    ]);

    setSelectedOperation(name);
    setNewOperationName("");
  };

  // --------------------------- Map operators to selected operation ---------------------------
  const handleMapOperation = () => {
    if (!selectedOperation) return alert("Select operation");
    if (selectedOperators.length === 0)
      return alert("Select operator(s)");

    setMappings((prev) => {
      const existing = prev[selectedOperation] || [];
      const updated = [...existing];

      selectedOperators.forEach((op) => {
        const alreadyThere = updated.some(
          (x) =>
            String(x.staffNumber) === String(op.staffNumber)
        );
        if (!alreadyThere) {
          updated.push({
            staffNumber: op.staffNumber,
            name: op.name,
          });
        }
      });

      return {
        ...prev,
        [selectedOperation]: updated,
      };
    });

    setSelectedOperators([]);
  };

  // remove entire operation mapping
  const handleRemoveMapping = (operationName) => {
    setMappings((prev) => {
      const copy = { ...prev };
      delete copy[operationName];
      return copy;
    });
  };

  // remove a single operator
  const handleRemoveSingle = (operationName, staffNumber) => {
    setMappings((prev) => {
      const copy = { ...prev };
      copy[operationName] = copy[operationName].filter(
        (op) => String(op.staffNumber) !== String(staffNumber)
      );
      if (copy[operationName].length === 0) delete copy[operationName];
      return copy;
    });
  };

  // --------------------------- Build final structure for PCB ---------------------------
  const buildAssignedOperations = () => {
    return operations.map((op) => ({
      ...op,
      assignedTo: mappings[op["Operation Name"]] || [],
      status: "Not Started",
    }));
  };

  const handleSaveAll = () => {
    const finalOps = buildAssignedOperations();

    const empty = finalOps.filter(
      (o) => o.assignedTo.length === 0
    ).length;

    if (
      empty > 0 &&
      !window.confirm(
        `${empty} operation(s) have no operators. Save anyway?`
      )
    ) {
      return;
    }

    onSave(pcbSerial, finalOps);
  };

  // ====================================================================
  // ============================= JSX UI ================================
  // ====================================================================

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      {/* ============== TOP BAR ============== */}
      <AppBar position="static" sx={{ bgcolor: "#2e7d32" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Assign Work — PCB {pcbSerial}
          </Typography>

          <Button variant="outlined" color="inherit" onClick={onCancel}>
            GO BACK
          </Button>

          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 3 }}>
        {/* =================== TOP ACTION BAR =================== */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
              alignItems: "center",
            }}
          >
            {/* BACK button */}
            <Button
              variant="outlined"
              color="primary"
              onClick={onCancel}
            >
              ← Back
            </Button>

            {/* Save + Cancel */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveAll}
              >
                Save All Assignments
              </Button>
            </Box>
          </Box>

          {/* =================== ASSIGN PANEL =================== */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Operation Assignment
          </Typography>

          <Grid container spacing={2}>
            {/* Operation */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Operation</InputLabel>
                <Select
                  label="Operation"
                  value={selectedOperation}
                  onChange={(e) =>
                    setSelectedOperation(e.target.value)
                  }
                >
                  {operations.map((op) => (
                    <MenuItem
                      key={op["Operation Name"]}
                      value={op["Operation Name"]}
                    >
                      {op["S.No"]}. {op["Operation Name"]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Operator Multi-select */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Assign to Operators</InputLabel>

                <Select
                  multiple
                  label="Assign to Operators"
                  value={selectedOperators.map(
                    (op) => op.staffNumber
                  )}
                  onChange={(e) => {
                    const staffNumbers = e.target.value;

                    const selectedObjs =
                      operatorOptions.filter((op) =>
                        staffNumbers.includes(op.staffNumber)
                      );

                    setSelectedOperators(selectedObjs);
                  }}
                  renderValue={(selected) =>
                    operatorOptions
                      .filter((op) =>
                        selected.includes(op.staffNumber)
                      )
                      .map((op) => op.name)
                      .join(", ")
                  }
                >
                  {operatorOptions.map((op) => (
                    <MenuItem
                      key={op.staffNumber}
                      value={op.staffNumber}
                    >
                      {op.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ASSIGN BUTTON */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                onClick={handleMapOperation}
                fullWidth
              >
                ASSIGN
              </Button>
            </Grid>
          </Grid>

          {/* =================== ADD NEW OPERATION =================== */}
          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2">Add New Operation</Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              size="small"
              label="New Operation"
              fullWidth
              value={newOperationName}
              onChange={(e) =>
                setNewOperationName(e.target.value)
              }
            />

            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleAddOperation}
            >
              Add
            </Button>
          </Box>
        </Paper>

        {/* =================== MAPPING TABLE =================== */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Assigned Operations Overview
          </Typography>

          {/* Scrollable Table */}
          <Box
            sx={{
              maxHeight: "68vh",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 1,
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Operation</TableCell>
                    <TableCell>Assigned Operators</TableCell>
                    <TableCell width="80">Remove</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {operations.map((op) => {
                    const assigned =
                      mappings[op["Operation Name"]] || [];

                    return (
                      <TableRow key={op["Operation Name"]}>
                        <TableCell>{op["S.No"]}</TableCell>
                        <TableCell>{op["Operation Name"]}</TableCell>

                        <TableCell>
                          {assigned.length === 0
                            ? "—"
                            : assigned.map((a) => (
                                <Box
                                  key={a.staffNumber}
                                  sx={{
                                    display: "inline-block",
                                    bgcolor: "#e1f5fe",
                                    px: 1,
                                    py: 0.3,
                                    borderRadius: "8px",
                                    mr: 1,
                                    mb: 1,
                                  }}
                                >
                                  {a.name} ({a.staffNumber})
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleRemoveSingle(
                                        op["Operation Name"],
                                        a.staffNumber
                                      )
                                    }
                                  >
                                    x
                                  </Button>
                                </Box>
                              ))}
                        </TableCell>

                        <TableCell>
                          <Button
                            color="error"
                            onClick={() =>
                              handleRemoveMapping(op["Operation Name"])
                            }
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
