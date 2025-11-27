import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InventoryIcon from "@mui/icons-material/Inventory";

/**
 * Supervisor (Internal) Dashboard
 *
 * Props expected:
 * - onLogout: () => void
 * - inActionPCBs: array of PCB objects (from App.js)
 * - onCreateOperator: (staffNumber, name, password) => boolean (returns true on success)
 * - handleAssignWork: (serialNumber) => void  // opens assignment editor in parent
 * - operatorAccounts? (optional) - array of existing operator objects (optional)
 *
 * Behavior:
 * - FIRST tab: In-Action PCBs
 * - Other tabs: Operators List, Create Operator, Completed PCBs
 *
 * No localStorage. Fresh on every refresh.
 */

const PCB_KEY_FALLBACK = "serial number";

const detectKey = (pcb) => pcb._pcb_key_id || Object.keys(pcb).find(k => k !== "id" && k !== "linkedOperations") || PCB_KEY_FALLBACK;

export default function SupervisorDashboard({
  onLogout,
  inActionPCBs = [],
  onCreateOperator,
  handleAssignWork,
  operatorAccounts = [], // optional; App.js may pass it in later
}) {
  const [tabIndex, setTabIndex] = useState(0);

  // Local view of operators so supervisor sees created accounts immediately.
  // Parent still receives create via onCreateOperator; this local list is only for display.
  const [localOperators, setLocalOperators] = useState(operatorAccounts || []);
  const operatorsToShow = useMemo(() => {
    // Merge operatorAccounts prop (if passed) with localOperators, dedupe by staffNumber
    const map = new Map();
    (operatorAccounts || []).forEach((o) => map.set(o.staffNumber, o));
    localOperators.forEach((o) => map.set(o.staffNumber, o));
    return Array.from(map.values());
  }, [operatorAccounts, localOperators]);

  // Create operator form
  const [newStaff, setNewStaff] = useState("");
  const [newName, setNewName] = useState("");
  const [newPass, setNewPass] = useState("");

  // Helpers
  const assignedCount = inActionPCBs.length || 0;

  // Completed PCBs computed from inActionPCBs
  const completedPCBs = useMemo(() => {
    return inActionPCBs.filter((pcb) => {
      const ops = pcb.linkedOperations || [];
      if (!ops.length) return false;
      return ops.every((op) => op.status === "Completed");
    });
  }, [inActionPCBs]);

  // Handler for create operator
  const handleCreateOperator = () => {
    const staff = String(newStaff || "").trim();
    const name = String(newName || "").trim();
    const pass = String(newPass || "").trim();

    if (!staff || !name || !pass) {
      alert("Provide staff number, name and password.");
      return;
    }

    // Call parent creation function (keeps core behavior unchanged)
    let ok = true;
    if (typeof onCreateOperator === "function") {
      ok = onCreateOperator(staff, name, pass);
    }

    if (ok) {
      // show created operator in local UI immediately
      setLocalOperators((prev) => {
        if (prev.some((p) => p.staffNumber === staff)) return prev;
        return [...prev, { staffNumber: staff, name, password: pass }];
      });
      setNewStaff("");
      setNewName("");
      setNewPass("");
      alert("Operator created.");
    } else {
      alert("Failed to create operator (duplicate staff maybe).");
    }
  };

  // Render helpers
  const InactionTab = () => {
    const keyForDisplay = (pcb) => detectKey(pcb);

    return (
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InventoryIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6">In-Action PCBs ({assignedCount})</Typography>
          </Stack>
        </Stack>

        {!inActionPCBs.length ? (
          <Paper sx={{ p: 3 }}>
            <Typography>No PCBs are currently in-action. Ask Admin to move PCBs from Master List.</Typography>
          </Paper>
        ) : (
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
                    const key = keyForDisplay(pcb);
                    const serial = pcb[key] ?? pcb[PCB_KEY_FALLBACK] ?? "N/A";
                    const assignedOps = (pcb.linkedOperations || []).filter(op => (op.assignedTo || []).length > 0);
                    return (
                      <TableRow key={pcb.id || serial}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600 }}>{serial}</Typography>
                        </TableCell>

                        <TableCell>
                          {/* Show a couple of common fields if present */}
                          {Object.entries(pcb)
                            .filter(([k]) => !["id", "linkedOperations", "_pcb_key_id", "isWorkAssigned"].includes(k))
                            .slice(0, 3)
                            .map(([k, v]) => (
                              <Typography key={k} variant="body2">
                                <strong>{k}:</strong> {String(v)}
                              </Typography>
                            ))}
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {assignedOps.length} assigned operation(s)
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                // Core behavior: call handleAssignWork(serial) to open assignment editor
                                if (typeof handleAssignWork === "function") {
                                  handleAssignWork(serial);
                                } else {
                                  alert("Assign function not available.");
                                }
                              }}
                            >
                              Assign / Edit
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              onClick={() => {
                                // remove from supervisor view only - this will call parent's delete if provided
                                if (window.confirm("Remove PCB from Supervisor In-Action list?")) {
                                  // call parent delete via prop if present: App.js uses deleteInActionPCB for Admin; Supervisor doesn't have that prop here.
                                  // We only remove locally (no persistence).
                                  // But to keep core functionality, we do nothing to parent unless such prop is passed.
                                  alert("To remove centrally, Admin must move it back (or implement central deletion).");
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    );
  };

  const OperatorsTab = () => (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Operators ({operatorsToShow.length})</Typography>
        <Button onClick={() => setTabIndex(2)}>Create Operator</Button>
      </Stack>

      {!operatorsToShow.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No operators available. Create one using Create Operator tab.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell>Staff Number</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {operatorsToShow.map((op) => (
                  <TableRow key={op.staffNumber}>
                    <TableCell>{op.staffNumber}</TableCell>
                    <TableCell>{op.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => alert("Operator details coming soon")}>View</Button>
                        <Button size="small" color="error" onClick={() => {
                          if (!window.confirm(`Remove operator ${op.staffNumber}?`)) return;
                          // local removal only (parent state remains unless parent implements removal)
                          setLocalOperators(prev => prev.filter(p => p.staffNumber !== op.staffNumber));
                        }}>Remove</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );

  const CreateOperatorTab = () => (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setTabIndex(1)}><ArrowBackIcon /></IconButton>
        <Typography variant="h6">Create Operator</Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Staff Number (short id)"
            value={newStaff}
            onChange={(e) => setNewStaff(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            size="small"
            fullWidth
            helperText="Use short password for testing (e.g. 123)"
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={() => {
              setNewStaff(""); setNewName(""); setNewPass("");
            }}>Clear</Button>

            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleCreateOperator}>
              Create Operator
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );

  const CompletedTab = () => (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Completed PCBs ({completedPCBs.length})</Typography>
        <Button onClick={() => setTabIndex(0)}>Back to In-Action</Button>
      </Stack>

      {!completedPCBs.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No completed PCBs yet.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell>Serial</TableCell>
                  <TableCell>Summary</TableCell>
                  <TableCell>Completed At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {completedPCBs.map(pcb => {
                  const key = detectKey(pcb);
                  const serial = pcb[key] ?? pcb[PCB_KEY_FALLBACK] ?? "N/A";
                  const completedAt = (() => {
                    const ops = pcb.linkedOperations || [];
                    // last op endTime
                    const last = ops[ops.length - 1];
                    return last?.endTime ?? "N/A";
                  })();

                  return (
                    <TableRow key={pcb.id || serial}>
                      <TableCell><Typography sx={{ fontWeight: 600 }}>{serial}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2">{(pcb.description || pcb.notes || '').toString().slice(0, 120)}</Typography>
                      </TableCell>
                      <TableCell>{completedAt === "N/A" ? "N/A" : new Date(completedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );

  // Tab order per your request: first = In-Action, then Operators List, Create Operator, Completed
  const tabs = [
    { label: "In-Action PCBs", node: <InactionTab /> },
    { label: "Operators", node: <OperatorsTab /> },
    { label: "Create Operator", node: <CreateOperatorTab /> },
    { label: "Completed", node: <CompletedTab /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f9" }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: "white", borderBottom: "1px solid #e0e0e0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Supervisor Internal Dashboard</Typography>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onLogout}>Logout</Button>
          </Stack>
        </Container>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mt: 2, mx: 2, borderRadius: 1 }} elevation={0}>
        <Tabs
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{ bgcolor: "#fafafa", borderBottom: "1px solid #eee", px: 2 }}
        >
          {tabs.map((t, i) => (
            <Tab key={t.label} label={t.label} sx={{ textTransform: "none" }} />
          ))}
        </Tabs>
      </Paper>

      {/* Active tab content */}
      <Box>
        {tabs[tabIndex].node}
      </Box>
    </Box>
  );
}
