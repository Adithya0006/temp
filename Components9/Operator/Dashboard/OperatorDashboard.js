// // This file controls operator screen flow
// import React, { useMemo, useState, useEffect } from "react";
// import { Box } from "@mui/material";

// import OperatorHeader from "./OperatorHeader";
// import OperatorTabs from "./OperatorTabs";
// import ProcessTable from "./ProcessTable";
// import ConfirmDialog from "./ConfirmDialog";
// import ProcessFormDialog from "./ProcessFormDialog";

// import {
//   getStaffId,
//   fmt,
//   getAssignedOperations,
//   pcbsForTab,
//   isRowLocked,
//   isTabLocked,
//   performActionHelper
// } from "./operatorHelpers";

// const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

// export default function OperatorDashboard({
//   onLogout,
//   role,
//   currentUser,
//   inActionPCBs = [],
//   updateInActionPCBs,
//   pageSizeDefault = 10,
// }) {
//   const staffId = String(getStaffId(currentUser) || "");

//   const [openForm, setOpenForm] = useState(false);
//   const [activeForm, setActiveForm] = useState(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmPayload, setConfirmPayload] = useState(null);
//   const [lockedMessage, setLockedMessage] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);

//   const assignedOperations = useMemo(
//     () => getAssignedOperations(inActionPCBs, staffId),
//     [inActionPCBs, staffId]
//   );

//   useEffect(() => {
//     if (activeTab >= assignedOperations.length) setActiveTab(0);
//   }, [assignedOperations, activeTab]);

//   const applyUpdate = (updater) => {
//     if (typeof updateInActionPCBs === "function") {
//       updateInActionPCBs((prev) => updater(Array.isArray(prev) ? prev : []));
//     }
//   };

//   const performAction = (payload) => {
//     applyUpdate((prev) =>
//       performActionHelper(prev, payload, PCB_SERIAL_KEY_FALLBACK)
//     );
//   };

//   return (
//     <Box sx={{ minHeight: "100vh" }}>
//       <OperatorHeader onLogout={onLogout} currentUser={currentUser} />

//       <OperatorTabs
//         assignedOperations={assignedOperations}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         isTabLocked={idx => isTabLocked(idx, activeTab, assignedOperations, inActionPCBs)}
//         setLockedMessage={setLockedMessage}
//       />

//       {lockedMessage && <p style={{color:"orange"}}>{lockedMessage}</p>}

//       <ProcessTable
//         rows={pcbsForTab(inActionPCBs, assignedOperations, activeTab, staffId)}
//         pageSize={pageSizeDefault}
//         performAction={performAction}
//         setOpenForm={setOpenForm}
//         setActiveForm={setActiveForm}
//       />

//       <ConfirmDialog
//         open={confirmOpen}
//         onClose={() => setConfirmOpen(false)}
//         onConfirm={() => {
//           performAction(confirmPayload);
//           setConfirmOpen(false);
//         }}
//       />

//       <ProcessFormDialog
//         open={openForm}
//         setOpen={setOpenForm}
//         activeForm={activeForm}
//         currentUser={currentUser}
//         performAction={performAction}
//       />
//     </Box>
//   );
// }








































/**
 * OperatorDashboard.js (FINAL VERSION)
 * -----------------------------------------
 * Features:
 * 1. TABBED VIEW with Auto-Sorting & Stats.
 * 2. CREATIVE STYLING (Glow effects, Color coding).
 * 3. DYNAMIC FORMS: Opens ProcessFormDialog on "Start".
 */

import React, { useState, useMemo } from "react";
import {
  Box, Container, Typography, Paper, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Stack,
  Tabs, Tab, LinearProgress, IconButton, Tooltip
} from "@mui/material";

// Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment"; // Form Icon

// Import your existing Dialog
import ProcessFormDialog from "./ProcessFormDialog";

// --- HELPERS ---
const getStaffId = (user) => user?.staffNumber || "";

const fmt = (iso) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } 
  catch { return iso; }
};

export default function OperatorDashboard({
  currentUser,
  inActionPCBs = [],
  updateInActionPCBs,
  onLogout
}) {
  const staffId = getStaffId(currentUser);
  const [activeTab, setActiveTab] = useState(0);

  // --- FORM STATE ---
  const [openForm, setOpenForm] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // { pcbSerial, stageId }

  // 1. IDENTIFY ASSIGNED OPERATIONS
  const myOperationTypes = useMemo(() => {
    if (!staffId) return [];
    const uniqueOps = new Map();

    inActionPCBs.forEach(pcb => {
      (pcb.linkedOperations || []).forEach(op => {
        if (op.assignedTo && Array.isArray(op.assignedTo) && op.assignedTo.includes(staffId)) {
          const key = op.sno || op["S.No"];
          if (!uniqueOps.has(key)) {
            uniqueOps.set(key, { id: key, name: op.name || op["Operation Name"] });
          }
        }
      });
    });
    return Array.from(uniqueOps.values()).sort((a, b) => a.id - b.id);
  }, [inActionPCBs, staffId]);


  // 2. GET ROWS FOR ACTIVE TAB
  const currentTabRows = useMemo(() => {
    if (myOperationTypes.length === 0) return [];
    
    const targetOpId = myOperationTypes[activeTab]?.id;
    const rows = [];

    inActionPCBs.forEach(pcb => {
      const ops = pcb.linkedOperations || [];
      const opIndex = ops.findIndex(op => (op.sno || op["S.No"]) == targetOpId);
      
      if (opIndex !== -1) {
        const op = ops[opIndex];
        if (op.assignedTo && op.assignedTo.includes(staffId)) {
          // Check Lock
          let isLocked = false;
          if (opIndex > 0) {
            const prevOp = ops[opIndex - 1];
            if (prevOp.status !== "Completed") isLocked = true;
          }

          rows.push({
            pcb,
            op,
            opIndex, // Needed for form dialog
            opId: op.sno || op["S.No"],
            isLocked,
            serial: pcb["PCB Serial Number"] || pcb["serial number"] || pcb._pcb_key_id
          });
        }
      }
    });

    // Sort: In Progress -> Not Started -> Locked -> Completed
    return rows.sort((a, b) => {
      const score = (status, locked) => {
        if (status === "Completed") return 4;
        if (locked) return 3;
        if (status === "Not Started") return 2;
        if (status === "In Progress") return 1; 
        return 2;
      };
      return score(a.op.status, a.isLocked) - score(b.op.status, b.isLocked);
    });

  }, [inActionPCBs, myOperationTypes, activeTab, staffId]);


  // 3. STATS
  const stats = useMemo(() => {
    const total = currentTabRows.length;
    const completed = currentTabRows.filter(r => r.op.status === "Completed").length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : (completed / total) * 100;
    return { total, completed, pending, progress };
  }, [currentTabRows]);


  // 4. ACTION HANDLER (Handles Buttons & Form Callbacks)
  // Supports both direct calls (serial, opId, action) AND object payload ({ pcbSerial, opIndex, action }) from Dialog
  const handleAction = (arg1, arg2, arg3) => {
    let pcbSerial, opId, action;

    if (typeof arg1 === 'object') {
      // Called from ProcessFormDialog with object payload
      pcbSerial = arg1.pcbSerial;
      // Convert index to ID if needed, or handle index directly
      // Note: Your dialog passes opIndex. We need to find the Op ID for that index if we use IDs.
      // However, simplified logic:
      action = arg1.action;
      // We will handle the update logic to support finding by serial
    } else {
      // Called from buttons
      pcbSerial = arg1;
      opId = arg2;
      action = arg3;
    }

    // UPDATE LOGIC
    updateInActionPCBs(prev => prev.map(pcb => {
      const key = pcb._pcb_key_id || "PCB Serial Number";
      const serial = pcb[key] || pcb["PCB Serial Number"];
      
      if (serial !== pcbSerial) return pcb;

      const newOps = pcb.linkedOperations.map((op, index) => {
        const currentId = op.sno || op["S.No"];
        
        // Match by ID (from buttons) OR by Index (from Dialog)
        const isMatch = opId ? (currentId == opId) : (index === arg1.opIndex);

        if (isMatch) {
          const now = new Date().toISOString();
          let newStatus = op.status;
          let startTime = op.startTime;
          let endTime = op.endTime;

          if (action === "start") {
            newStatus = "In Progress";
            startTime = now;
          } else if (action === "complete") {
            newStatus = "Completed";
            endTime = now;
          } else if (action === "reset") {
            newStatus = "Not Started";
            startTime = null;
            endTime = null;
          }
          return { ...op, status: newStatus, startTime, endTime };
        }
        return op;
      });
      return { ...pcb, linkedOperations: newOps };
    }));

    // IF STARTING -> OPEN FORM
    if (action === "start") {
      // Find the ID if we only have index, or vice versa
      // Ideally we set activeForm with what the Dialog expects
      // Your ProcessFormDialog expects { pcbSerial, stageId } where stageId is usually 1-based index or Op ID
      // Let's pass the Op ID as the stageId
      setActiveForm({ pcbSerial, stageId: opId }); 
      setOpenForm(true);
    }
  };

  // Helper to open form manually
  const openManualForm = (serial, opId) => {
    setActiveForm({ pcbSerial: serial, stageId: opId });
    setOpenForm(true);
  };

  // --- RENDER ---
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f2f5" }}>
      
      {/* HEADER */}
      <Paper elevation={2} sx={{ borderRadius: 0, bgcolor: "white", px: 3, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            {currentUser?.name?.charAt(0) || "O"}
          </Box>
          <Box>
            <Typography variant="h6" lineHeight={1.2}>Operator Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">ID: {staffId}</Typography>
          </Box>
        </Stack>
        <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={onLogout}>Logout</Button>
      </Paper>

      <Container maxWidth="xl" sx={{ mt: 3, pb: 5 }}>

        {/* TABS */}
        {myOperationTypes.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">No operations assigned yet.</Typography>
          </Paper>
        ) : (
          <>
            <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ bgcolor: "white", borderBottom: 1, borderColor: "divider" }}
              >
                {myOperationTypes.map(type => (
                  <Tab key={type.id} label={`${type.id}. ${type.name}`} sx={{ py: 3 }} />
                ))}
              </Tabs>

              {/* STATS PANEL */}
              <Box sx={{ p: 3, bgcolor: "#fafafa" }}>
                <Stack direction="row" spacing={4} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Progress for <strong>{myOperationTypes[activeTab]?.name}</strong>
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip size="small" label={`Pending: ${stats.pending}`} color="warning" variant="outlined" />
                    <Chip size="small" label={`Completed: ${stats.completed}`} color="success" variant="outlined" />
                  </Stack>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.progress} 
                  sx={{ height: 8, borderRadius: 4, bgcolor: "#e0e0e0", "& .MuiLinearProgress-bar": { bgcolor: stats.progress === 100 ? "success.main" : "primary.main" } }} 
                />
              </Box>
            </Paper>

            {/* TASK TABLE */}
            <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: "#eeeeee" }}>
                  <TableRow>
                    <TableCell><strong>PCB Serial</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Timing</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentTabRows.map((row) => {
                    const { serial, op, isLocked, opId } = row;
                    const isCompleted = op.status === "Completed";
                    const isInProgress = op.status === "In Progress";

                    // Styles
                    let rowBg = "white";
                    let opacity = 1;
                    if (isCompleted) { rowBg = "#f1f8e9"; opacity = 0.6; }
                    else if (isInProgress) { rowBg = "#e3f2fd"; }
                    else if (isLocked) { rowBg = "#f5f5f5"; opacity = 0.7; }

                    return (
                      <TableRow key={serial} sx={{ bgcolor: rowBg, opacity, transition: "0.3s" }}>
                        
                        <TableCell>
                          <Typography fontWeight={isInProgress ? "bold" : "normal"}>{serial}</Typography>
                          {isLocked && (
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                              <LockIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                              <Typography variant="caption" color="text.secondary">Locked</Typography>
                            </Stack>
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip 
                            label={isLocked ? "Locked" : (op.status || "Not Started")} 
                            size="small"
                            color={isCompleted ? "success" : isInProgress ? "primary" : "default"}
                            variant={isInProgress ? "filled" : "outlined"}
                            icon={isCompleted ? <CheckCircleIcon /> : undefined}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.5}>
                            {op.startTime && (
                              <Typography variant="caption" display="flex" alignItems="center" gap={0.5}>
                                <AccessTimeIcon fontSize="inherit" /> Start: {fmt(op.startTime)}
                              </Typography>
                            )}
                            {op.endTime && (
                              <Typography variant="caption" color="success.main" display="flex" alignItems="center" gap={0.5}>
                                <CheckCircleIcon fontSize="inherit" /> End: {fmt(op.endTime)}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            
                            {!isCompleted && !isInProgress && (
                              <Button 
                                variant="contained" 
                                size="small" 
                                startIcon={<PlayArrowIcon />}
                                disabled={isLocked}
                                // 🔥 CLICKING START OPENS FORM + UPDATES STATUS
                                onClick={() => handleAction(serial, opId, "start")}
                              >
                                Start
                              </Button>
                            )}

                            {isInProgress && (
                              <>
                                {/* Manual Open Form Button */}
                                <Tooltip title="Open Dynamic Form">
                                  <IconButton 
                                    size="small" 
                                    color="primary" 
                                    onClick={() => openManualForm(serial, opId)}
                                    sx={{ border: "1px solid #90caf9", bgcolor: "white" }}
                                  >
                                    <AssignmentIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Button 
                                  variant="contained" 
                                  color="success" 
                                  size="small" 
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleAction(serial, opId, "complete")}
                                >
                                  Finish
                                </Button>
                              </>
                            )}

                            {(isInProgress || isCompleted) && (
                              <Tooltip title="Reset">
                                <IconButton size="small" onClick={() => handleAction(serial, opId, "reset")}>
                                  <RefreshIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                          </Stack>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>

      {/* DYNAMIC FORM DIALOG */}
      <ProcessFormDialog
        open={openForm}
        setOpen={setOpenForm}
        activeForm={activeForm}
        currentUser={currentUser}
        performAction={handleAction} // Pass the handler so form can save/complete
      />

    </Box>
  );
}