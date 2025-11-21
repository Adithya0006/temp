// OperatorDashboard (beautified, compact)
// Replace your existing Dashboard.js operator file with this.
import React, { useMemo, useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, Typography, Button, Container, Paper,
  Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, TableFooter, TablePagination, IconButton, Stack, Tooltip,
  Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Chip
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RestoreIcon from "@mui/icons-material/Restore";

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";
const fmt = (iso) => { if (!iso) return "—"; try { return new Date(iso).toLocaleString(); } catch { return iso; } };
const getStaffId = (u) => u?.staffNumber || u?.staff_number || u?.staff || u?.staffId || null;

export default function OperatorDashboard({
  onLogout, currentUser, inActionPCBs = [], updateInActionPCBs, pageSizeDefault = 10
}) {
  const staffId = String(getStaffId(currentUser) || "");
  // build assigned operations
  const assignedOperations = useMemo(() => {
    const map = new Map();
    inActionPCBs.forEach((pcb) => {
      (pcb.linkedOperations || []).forEach((op, i) => {
        const sno = String(op["S.No"] ?? (i + 1)).trim();
        const name = (op["Operation Name"] || `Op ${sno}`).trim();
        const assigned = (op.assignedTo || []).some(a => String(a.staffNumber) === staffId);
        if (assigned && !map.has(sno)) map.set(sno, { sno, name, exampleIndex: i });
      });
    });
    return Array.from(map.values()).sort((a,b) => (Number(a.sno)||a.sno).toString().localeCompare((Number(b.sno)||b.sno).toString()));
  }, [inActionPCBs, staffId]);

  const [activeTab, setActiveTab] = useState(0);
  useEffect(()=>{ if (activeTab >= assignedOperations.length) setActiveTab(0); }, [assignedOperations, activeTab]);
  const [pageMap, setPageMap] = useState({}); const setPageFor = (t,p)=> setPageMap(prev=>({...prev,[t]:p}));
  const pageSize = pageSizeDefault;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [lockedMessage, setLockedMessage] = useState(null);
  const openConfirm = (p)=>{ setConfirmPayload(p); setConfirmOpen(true); };
  const closeConfirm = ()=>{ setConfirmOpen(false); setConfirmPayload(null); };

  const getPcbSerialKey = (pcb)=> pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
  const applyUpdate = (updater) => {
    if (typeof updateInActionPCBs === "function") updateInActionPCBs(prev => updater(Array.isArray(prev)?prev:[]));
    else console.warn("updateInActionPCBs not provided — changes won't propagate.");
  };

  const isRowLocked = (pcb, opIndex) => {
    const ops = pcb.linkedOperations || [];
    if (!ops || opIndex <= 0) return false;
    const prev = ops[opIndex-1]; if (!prev) return false;
    return prev.status !== "Completed";
  };

  const performAction = ({ action, pcbSerial, opIndex }) => {
    applyUpdate(prev => prev.map(pcb => {
      const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
      if (pcb[key] !== pcbSerial) return pcb;
      const ops = (pcb.linkedOperations || []).map((op, idx) => {
        if (idx !== opIndex) return op;
        const prevOp = (pcb.linkedOperations || [])[idx-1];
        if (prevOp && prevOp.status !== "Completed") return { ...op };
        const now = new Date().toISOString(); const copy = { ...op };
        switch(action){
          case "start": if(!copy.startTime) copy.startTime = now; copy.endTime = copy.endTime||null; copy.status = "In Progress"; break;
          case "stop": copy.endTime = now; copy.status = "Stopped"; break;
          case "complete": copy.endTime = now; copy.status = "Completed"; break;
          case "reset": copy.startTime = null; copy.endTime = null; copy.status = "Not Started"; break;
          default: break;
        }
        return copy;
      });
      return { ...pcb, linkedOperations: ops };
    }));
  };

  const pcbsForTab = (tabIndex) => {
    const op = assignedOperations[tabIndex]; if (!op) return [];
    const target = String(op.sno);
    const results = [];
    inActionPCBs.forEach(pcb => {
      const ops = pcb.linkedOperations || [];
      let matchedIndex = -1;
      for (let i=0;i<ops.length;i++){
        const o = ops[i];
        const oSno = String(o["S.No"] ?? "").trim();
        const oName = (o["Operation Name"]||"").trim();
        if (oSno && oSno === target) { matchedIndex = i; break; }
        if ((!oSno || oSno==="") && oName === op.name) { matchedIndex = i; break; }
      }
      if (matchedIndex === -1) return;
      const opObj = ops[matchedIndex];
      const assignedTo = opObj.assignedTo || [];
      if (!assignedTo.some(a => String(a.staffNumber) === staffId)) return;
      results.push({ pcb, opIndex: matchedIndex, opObj });
    });
    return results.sort((a,b)=>{
      const aKey = a.pcb[getPcbSerialKey(a.pcb)] ?? "";
      const bKey = b.pcb[getPcbSerialKey(b.pcb)] ?? "";
      return String(aKey).localeCompare(String(bKey));
    });
  };

  const isTabLocked = (tabIndex) => {
    if (tabIndex <= 0) return false;
    const prevRows = pcbsForTab(tabIndex-1);
    if (prevRows.length === 0) return false;
    return !prevRows.every(r => r.opObj.status === "Completed");
  };

  const handleTabChange = (e, newIndex) => {
    setActiveTab(newIndex);
    if (isTabLocked(newIndex)) {
      const prevIndex = newIndex - 1;
      const prevOp = assignedOperations[prevIndex];
      const requiredText = prevOp ? `${prevOp.sno}. ${prevOp.name}` : "previous process";
      const prevRows = pcbsForTab(prevIndex);
      const incomplete = prevRows.filter(r => r.opObj.status !== "Completed").length;
      setLockedMessage(`Locked. Complete "${requiredText}" first. (${incomplete} incomplete)`);
    } else setLockedMessage(null);
  };

  const handleConfirmOk = () => {
    if (!confirmPayload) return closeConfirm();
    const { action, pcbSerial, opIndex } = confirmPayload;
    performAction({ action, pcbSerial, opIndex }); closeConfirm();
  };

  const ActionButtons = ({ status, pcbSerial, opIndex, pcb }) => {
    const isCompleted = status === "Completed";
    const isInProgress = status === "In Progress";
    const rowLocked = isRowLocked(pcb, opIndex);
    const sxBtn = { p: .5 };
    return (
      <Stack direction="row" spacing={0.5}>
        <Tooltip title={rowLocked ? "Locked" : "Start"}><span>
          <IconButton size="small" sx={sxBtn} onClick={()=>openConfirm({action:"start",message:"Start?",pcbSerial,opIndex})} disabled={isInProgress||isCompleted||rowLocked}><PlayArrowIcon/></IconButton>
        </span></Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Pause"}><span>
          <IconButton size="small" sx={sxBtn} onClick={()=>openConfirm({action:"stop",message:"Stop?",pcbSerial,opIndex})} disabled={!isInProgress||isCompleted||rowLocked}><PauseIcon/></IconButton>
        </span></Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Complete"}><span>
          <IconButton size="small" sx={sxBtn} onClick={()=>openConfirm({action:"complete",message:"Complete?",pcbSerial,opIndex})} disabled={isCompleted||rowLocked}><DoneAllIcon/></IconButton>
        </span></Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Reset"}><span>
          <IconButton size="small" sx={sxBtn} onClick={()=>openConfirm({action:"reset",message:"Reset?",pcbSerial,opIndex})} disabled={rowLocked}><RestoreIcon/></IconButton>
        </span></Tooltip>
      </Stack>
    );
  };

  const handleCheckboxToggle = (checked, pcbSerial, opIndex, pcb) => {
    if (isRowLocked(pcb, opIndex)) {
      openConfirm({ action: "noop", message: "Cannot change — previous process not completed.", pcbSerial, opIndex });
      return;
    }
    if (!checked) openConfirm({ action: "reset", message: "Reset this process?", pcbSerial, opIndex });
    else openConfirm({ action: "complete", message: "Mark complete?", pcbSerial, opIndex });
  };

  // ---- Layout ----
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f6fb" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent", backgroundImage: "linear-gradient(90deg,#4f46e5,#06b6d4)", color: "white" }}>
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
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider" }}>
              {assignedOperations.map((op, idx) => (
                <Tab key={`${op.sno}-${op.name}`} label={`${op.sno}. ${op.name}`} sx={{ textTransform: "none", fontWeight: 600 }} />
              ))}
            </Tabs>

            {lockedMessage ? (
              <Box sx={{ p: 3 }}><Alert severity="warning">{lockedMessage}</Alert></Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <TabPanel value={activeTab} index={activeTab}>
                  <ProcessTable
                    rows={pcbsForTab(activeTab)}
                    page={pageMap[activeTab]||0}
                    onPageChange={(p)=>setPageFor(activeTab,p)}
                    pageSize={pageSize}
                    getPcbSerialKey={getPcbSerialKey}
                    ActionButtons={ActionButtons}
                    onCheckboxToggle={handleCheckboxToggle}
                    isRowLocked={isRowLocked}
                  />
                </TabPanel>
              </Box>
            )}
          </Paper>
        )}
      </Container>

      <Dialog open={confirmOpen} onClose={closeConfirm}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent><Typography>{confirmPayload?.message || "Confirm action?"}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancel</Button>
          <Button variant="contained" onClick={() => { if (confirmPayload?.action === "noop") { closeConfirm(); return; } handleConfirmOk(); }}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* small helpers below kept inside same file to reduce LOC */
function TabPanel({ children, value, index }) { return value === index ? <Box>{children}</Box> : null; }

function statusColor(status){
  if(!status) return "default";
  const s = status.toLowerCase();
  if(s.includes("completed")) return "success";
  if(s.includes("in progress")) return "info";
  if(s.includes("stopped") || s.includes("paused")) return "warning";
  return "default";
}

function ProcessTable({ rows, page, onPageChange, pageSize, getPcbSerialKey, ActionButtons, onCheckboxToggle, isRowLocked }) {
  const total = rows.length; const start = page * pageSize; const visible = rows.slice(start, Math.min(total, start + pageSize));
  const handleChangePage = (_, p) => onPageChange(p);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#fafafa" }}>
          <TableRow>
            <TableCell>PCB Serial</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start time</TableCell>
            <TableCell>End time</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell>Done</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {visible.map(({ pcb, opIndex, opObj }, idx) => {
            const key = getPcbSerialKey(pcb); const serial = pcb[key] ?? "—";
            const status = opObj.status ?? "Not Started"; const rowLocked = isRowLocked(pcb, opIndex); const disabled = status === "Completed";
            return (
              <TableRow key={`${serial}-${opIndex}-${idx}`} sx={{ bgcolor: disabled ? "#f0fff0" : rowLocked ? "#fffaf0" : "white", opacity: disabled||rowLocked?0.92:1 }}>
                <TableCell><Typography sx={{ fontWeight: 700 }}>{serial}</Typography></TableCell>
                <TableCell><Chip label={status} size="small" color={statusColor(status)} /></TableCell>
                <TableCell>{fmt(opObj.startTime)}</TableCell>
                <TableCell>{fmt(opObj.endTime)}</TableCell>
                <TableCell><ActionButtons status={status} pcbSerial={serial} opIndex={opIndex} pcb={pcb} /></TableCell>
                <TableCell>
                  <Checkbox checked={status === "Completed"} onChange={(e)=>onCheckboxToggle(e.target.checked, serial, opIndex, pcb)} disabled={status === "In Progress" || rowLocked} />
                </TableCell>
              </TableRow>
            );
          })}

          {visible.length === 0 && (
            <TableRow><TableCell colSpan={6} align="center">No PCBs for this process.</TableCell></TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              count={total} page={page} onPageChange={handleChangePage} rowsPerPage={pageSize} rowsPerPageOptions={[pageSize]}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`} component="div"
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
