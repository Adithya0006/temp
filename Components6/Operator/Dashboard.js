// Final beautified OperatorDashboard.js with dynamic form, tooltip, checkbox, start->form->complete
// Place this file at: src/Components6/Operator/OperatorDashboard.js

import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  IconButton,
  Stack,
  Tooltip,
  Checkbox,
  Chip,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RestoreIcon from "@mui/icons-material/Restore";

import ProcessFormDialog from "../ProcessFormDialog";

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";
const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "—");
const getStaffId = (u) => u?.staffNumber || u?.staffId || u?.staff || null;

export default function OperatorDashboard({
  onLogout,
  currentUser,
  inActionPCBs = [],
  updateInActionPCBs,
  pageSizeDefault = 10,
}) {
  // STORE FORM DATA (frontend only for now)
  const [operationForms, setOperationForms] = useState({});

  // DIALOG STATES
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedSerial, setSelectedSerial] = useState(null);
  const [selectedOpIndex, setSelectedOpIndex] = useState(null);

  const handleOpenForm = (operationName, pcbSerial, opIndex) => {
    setSelectedOperation(operationName);
    setSelectedSerial(pcbSerial);
    setSelectedOpIndex(opIndex);
    setDialogOpen(true);
  };

  const handleFormSave = (data) => {
    // save in local state
    setOperationForms((prev) => ({
      ...prev,
      [data.pcbSerial]: {
        ...(prev[data.pcbSerial] || {}),
        [data.operationName]: data.formData,
      },
    }));

    // mark complete (this will set endTime inside performAction)
    performAction({ action: "complete", pcbSerial: data.pcbSerial, opIndex: selectedOpIndex });

    // close dialog
    setDialogOpen(false);

    // FUTURE: call backend here to persist
    // axios.post('/api/saveOperation', data)
  };

  const handleCloseForm = () => setDialogOpen(false);

  const staffId = String(getStaffId(currentUser) || "");

  // BUILD assigned operations list
  const assignedOperations = useMemo(() => {
    const map = new Map();
    inActionPCBs.forEach((pcb) => {
      (pcb.linkedOperations || []).forEach((op, i) => {
        const sno = String(op["S.No"] ?? i + 1).trim();
        const name = (op["Operation Name"] || `Op ${sno}`).trim();
        const assigned = (op.assignedTo || []).some((a) => String(a.staffNumber) === staffId);
        if (assigned && !map.has(sno)) map.set(sno, { sno, name, exampleIndex: i });
      });
    });
    return Array.from(map.values()).sort((a, b) => String(a.sno).localeCompare(String(b.sno)));
  }, [inActionPCBs, staffId]);

  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    if (activeTab >= assignedOperations.length) setActiveTab(0);
  }, [assignedOperations, activeTab]);

  const [pageMap, setPageMap] = useState({});
  const setPageFor = (t, p) => setPageMap((prev) => ({ ...prev, [t]: p }));
  const pageSize = pageSizeDefault;

  const getPcbSerialKey = (pcb) => pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;

  const applyUpdate = (updater) => {
    if (typeof updateInActionPCBs === "function") updateInActionPCBs((prev) => updater(Array.isArray(prev) ? prev : []));
    else console.warn("updateInActionPCBs not provided — changes won't persist outside frontend");
  };

  const isRowLocked = (pcb, opIndex) => {
    const ops = pcb.linkedOperations || [];
    if (opIndex <= 0) return false;
    const prev = ops[opIndex - 1];
    return prev && prev.status !== "Completed";
  };

  // performAction: same logic as original — start/complete/reset
  const performAction = ({ action, pcbSerial, opIndex }) => {
    applyUpdate((prev) =>
      prev.map((pcb) => {
        const key = getPcbSerialKey(pcb);
        if (pcb[key] !== pcbSerial) return pcb;

        const ops = (pcb.linkedOperations || []).map((op, idx) => {
          if (idx !== opIndex) return op;

          const prevOp = pcb.linkedOperations[idx - 1];
          if (prevOp && prevOp.status !== "Completed") return { ...op };

          const now = new Date().toISOString();
          const copy = { ...op };

          switch (action) {
            case "start":
              if (!copy.startTime) copy.startTime = now;
              copy.status = "In Progress";
              break;
            case "complete":
              copy.endTime = now;
              copy.status = "Completed";
              break;
            case "reset":
              copy.startTime = null;
              copy.endTime = null;
              copy.status = "Not Started";
              break;
            default:
              break;
          }

          return copy;
        });

        return { ...pcb, linkedOperations: ops };
      })
    );
  };

  const pcbsForTab = (tabIndex) => {
    const op = assignedOperations[tabIndex];
    if (!op) return [];
    const target = String(op.sno);
    const results = [];

    inActionPCBs.forEach((pcb) => {
      const ops = pcb.linkedOperations || [];
      let matchedIndex = -1;
      for (let i = 0; i < ops.length; i++) {
        const o = ops[i];
        const oSno = String(o["S.No"] ?? "").trim();
        const oName = (o["Operation Name"] || "").trim();
        if (oSno && oSno === target) {
          matchedIndex = i;
          break;
        }
        if ((!oSno || oSno === "") && oName === op.name) {
          matchedIndex = i;
          break;
        }
      }
      if (matchedIndex === -1) return;

      const opObj = ops[matchedIndex];
      const assignedTo = opObj.assignedTo || [];
      if (!assignedTo.some((a) => String(a.staffNumber) === staffId)) return;

      results.push({ pcb, opIndex: matchedIndex, opObj });
    });

    return results.sort((a, b) => {
      const aKey = a.pcb[getPcbSerialKey(a.pcb)] ?? "";
      const bKey = b.pcb[getPcbSerialKey(b.pcb)] ?? "";
      return String(aKey).localeCompare(String(bKey));
    });
  };

  // ActionButtons component — START now auto-starts + opens form, RESET works
  const ActionButtons = ({ status, pcbSerial, opIndex, pcb }) => {
    const isCompleted = status === "Completed";
    const isInProgress = status === "In Progress";
    const rowLocked = isRowLocked(pcb, opIndex);
    const sxBtn = { p: 0.5 };

    return (
      <Stack direction="row" spacing={0.5}>
        <Tooltip title={rowLocked ? "Locked" : "Start"}>
          <span>
            <IconButton
              size="small"
              sx={{ ...sxBtn, color: "#0ea5e9" }}
              onClick={() => {
                // start time auto
                performAction({ action: "start", pcbSerial, opIndex });
                // open form
                handleOpenForm(pcb.linkedOperations[opIndex]["Operation Name"], pcbSerial, opIndex);
              }}
              disabled={isInProgress || isCompleted || rowLocked}
            >
              <PlayArrowIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Pause"}>
          <span>
            <IconButton size="small" sx={sxBtn} disabled={true}>
              <PauseIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Complete"}>
          <span>
            <IconButton size="small" sx={{ ...sxBtn, color: "#10b981" }} disabled={true}>
              <DoneAllIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Reset"}>
          <span>
            <IconButton
              size="small"
              sx={{ ...sxBtn, color: "#ef4444" }}
              onClick={() => performAction({ action: "reset", pcbSerial, opIndex })}
              disabled={rowLocked}
            >
              <RestoreIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    );
  };

  // UI
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef2ff" }}>
      <AppBar position="static" elevation={0} sx={{ backgroundImage: "linear-gradient(90deg,#4f46e5,#06b6d4)", color: "white" }}>
        <Toolbar sx={{ mx: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>Operator Dashboard</Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: .95 }}>{currentUser?.name} ({currentUser?.staffNumber})</Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Your Assigned Processes <Chip label={assignedOperations.length} size="small" sx={{ ml:1 }} /></Typography>

        {!assignedOperations.length ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography>No assigned operations right now.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 1, borderRadius: 2, boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
            <Tabs value={activeTab} onChange={(e, newIndex) => { setActiveTab(newIndex); }} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider" }}>
              {assignedOperations.map((op, idx) => (
                <Tab key={`${op.sno}-${op.name}`} label={`${op.sno}. ${op.name}`} sx={{ textTransform: "none", fontWeight: 600 }} />
              ))}
            </Tabs>

            <Box sx={{ mt: 2 }}>
              <TabPanel value={activeTab} index={activeTab}>
                <ProcessTable
                  rows={pcbsForTab(activeTab)}
                  page={pageMap[activeTab]||0}
                  onPageChange={(p)=>setPageFor(activeTab,p)}
                  pageSize={pageSize}
                  getPcbSerialKey={getPcbSerialKey}
                  ActionButtons={ActionButtons}
                  operationForms={operationForms}
                  performAction={performAction}
                  isRowLocked={isRowLocked}
                />
              </TabPanel>
            </Box>
          </Paper>
        )}
      </Container>

      <ProcessFormDialog
        open={dialogOpen}
        onClose={handleCloseForm}
        operationName={selectedOperation}
        pcbSerial={selectedSerial}
        onSave={handleFormSave}
      />
    </Box>
  );
}

// helpers
function TabPanel({ children, value, index }) { return value === index ? <Box>{children}</Box> : null; }

function ProcessTable({ rows, page, onPageChange, pageSize, getPcbSerialKey, ActionButtons, operationForms, performAction, isRowLocked }) {
  const total = rows.length;
  const start = page * pageSize;
  const visible = rows.slice(start, Math.min(total, start + pageSize));

  const handleChangePage = (_, p) => onPageChange(p);

  const statusColor = (status) => {
    if(!status) return "default";
    const s = status.toLowerCase();
    if(s.includes("completed")) return "success";
    if(s.includes("in progress")) return "info";
    if(s.includes("stopped") || s.includes("paused")) return "warning";
    return "default";
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#fafafa" }}>
          <TableRow>
            <TableCell>PCB Serial</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Done</TableCell>
            <TableCell>Form Data</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {visible.map(({ pcb, opIndex, opObj }, idx) => {
            const key = getPcbSerialKey(pcb);
            const serial = pcb[key] ?? "—";
            const status = opObj.status ?? "Not Started";
            const rowLocked = isRowLocked(pcb, opIndex);
            const disabled = status === "Completed";
            const operationName = opObj["Operation Name"];
            const savedData = operationForms?.[serial]?.[operationName];

            return (
              <TableRow key={`${serial}-${opIndex}-${idx}`} sx={{ bgcolor: disabled ? "#f0fff0" : rowLocked ? "#fffaf0" : "white", opacity: disabled||rowLocked?0.92:1 }}>
                <TableCell><Typography sx={{ fontWeight: 700 }}>{serial}</Typography></TableCell>
                <TableCell><Chip label={status} size="small" color={statusColor(status)} /></TableCell>

                <TableCell>
                  <Checkbox
                    checked={status === "Completed"}
                    onChange={(e)=>{
                      if (e.target.checked) performAction({ action: "complete", pcbSerial: serial, opIndex });
                      else performAction({ action: "reset", pcbSerial: serial, opIndex });
                    }}
                    disabled={status === "In Progress" || rowLocked}
                  />
                </TableCell>

                <TableCell>
                  {savedData ? (
                    <Tooltip title={JSON.stringify(savedData, null, 2)}>
                      <Chip label="View Details" size="small" color="info" />
                    </Tooltip>
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell><ActionButtons status={status} pcbSerial={serial} opIndex={opIndex} pcb={pcb} /></TableCell>
              </TableRow>
            );
          })}

          {visible.length === 0 && (
            <TableRow><TableCell colSpan={5} align="center">No PCBs for this process.</TableCell></TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[pageSize]}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
              component="div"
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
