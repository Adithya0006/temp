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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RestoreIcon from "@mui/icons-material/Restore";

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

// get operator id from currentUser
const getStaffId = (currentUser) => {
  if (!currentUser) return null;
  return (
    currentUser.staffNumber ||
    currentUser.staff_number ||
    currentUser.staff ||
    currentUser.staffId ||
    null
  );
};

const fmt = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

export default function OperatorDashboard({
  onLogout,
  role,
  currentUser,
  inActionPCBs = [],
  updateInActionPCBs,
  pageSizeDefault = 10,
}) {
  const staffId = String(getStaffId(currentUser) || "");

  // Build assigned operations list keyed and ordered by numeric S.No
  const assignedOperations = useMemo(() => {
    const map = new Map(); // key = sno (string) -> { sno, name, globalIndex }
    inActionPCBs.forEach((pcb) => {
      const ops = pcb.linkedOperations || [];
      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        const snoRaw = op["S.No"] ?? String(i + 1);
        const sno = String(snoRaw).trim();
        const name = (op["Operation Name"] || "").trim() || `Op ${sno}`;
        const assignedTo = op.assignedTo || [];
        const isAssignedToThis = assignedTo.some(
          (a) => String(a.staffNumber) === staffId
        );
        if (isAssignedToThis && !map.has(sno)) {
          map.set(sno, { sno, name, exampleIndex: i });
        }
      }
    });
    // Convert to array and sort numerically by sno (if numeric)
    const arr = Array.from(map.values());
    arr.sort((a, b) => {
      const ai = Number(a.sno);
      const bi = Number(b.sno);
      if (!isNaN(ai) && !isNaN(bi)) return ai - bi;
      return a.sno.localeCompare(b.sno);
    });
    return arr;
  }, [inActionPCBs, staffId]);

  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    if (activeTab >= assignedOperations.length) setActiveTab(0);
  }, [assignedOperations, activeTab]);

  const [pageMap, setPageMap] = useState({});
  const setPageFor = (tabIndex, page) =>
    setPageMap((p) => ({ ...p, [tabIndex]: page }));
  const pageSize = pageSizeDefault;

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [lockedMessage, setLockedMessage] = useState(null);

  const openConfirm = (payload) => {
    setConfirmPayload(payload);
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmPayload(null);
  };

  const getPcbSerialKey = (pcb) => pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;

  // safe updater which uses parent updater when present
  const applyUpdate = (updater) => {
    if (typeof updateInActionPCBs === "function") {
      updateInActionPCBs((prev) => {
        const next = updater(Array.isArray(prev) ? prev : []);
        return next;
      });
    } else {
      console.warn("updateInActionPCBs not provided – changes will not propagate up");
    }
  };

  // row-level guard: previous operation for that PCB must be Completed
  const isRowLocked = (pcb, opIndex) => {
    const ops = pcb.linkedOperations || [];
    if (!ops || opIndex <= 0) return false;
    const prev = ops[opIndex - 1];
    if (!prev) return false;
    return prev.status !== "Completed";
  };

  // perform start/stop/complete/reset
  const performAction = ({ action, pcbSerial, opIndex }) => {
    applyUpdate((prev) =>
      prev.map((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        if (pcb[key] !== pcbSerial) return pcb;
        const ops = (pcb.linkedOperations || []).map((op, idx) => {
          if (idx !== opIndex) return op;
          // guard again
          const prevOp = (pcb.linkedOperations || [])[idx - 1];
          if (prevOp && prevOp.status !== "Completed") {
            return { ...op }; // no change
          }
          const now = new Date().toISOString();
          const copy = { ...op };
          switch (action) {
            case "start":
              if (!copy.startTime) copy.startTime = now;
              copy.endTime = copy.endTime || null;
              copy.status = "In Progress";
              break;
            case "stop":
              copy.endTime = now;
              copy.status = "Stopped";
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

  // get PCBs for a tab - match by numeric S.No first, fallback to name
  const pcbsForTab = (tabIndex) => {
    const op = assignedOperations[tabIndex];
    if (!op) return [];
    const targetSno = op.sno;
    const results = [];
    inActionPCBs.forEach((pcb) => {
      const ops = pcb.linkedOperations || [];
      // find matching index: prefer ops[i]["S.No"] == targetSno
      let matchedIndex = -1;
      for (let i = 0; i < ops.length; i++) {
        const o = ops[i];
        const oSno = String(o["S.No"] ?? "").trim();
        const oName = (o["Operation Name"] || "").trim();
        if (oSno && oSno === String(targetSno)) {
          matchedIndex = i;
          break;
        }
        // fallback: if S.No missing on op and names match, accept
        if ((!oSno || oSno === "") && oName && oName === op.name) {
          matchedIndex = i;
          break;
        }
      }
      if (matchedIndex === -1) return;
      const opObj = ops[matchedIndex];
      const assignedTo = opObj.assignedTo || [];
      const isAssignedToThis = assignedTo.some(
        (a) => String(a.staffNumber) === staffId
      );
      if (!isAssignedToThis) return;
      results.push({ pcb, opIndex: matchedIndex, opObj });
    });
    // sort by PCB serial
    results.sort((a, b) => {
      const aKey = a.pcb[getPcbSerialKey(a.pcb)] ?? "";
      const bKey = b.pcb[getPcbSerialKey(b.pcb)] ?? "";
      return String(aKey).localeCompare(String(bKey));
    });
    return results;
  };

  // tab lock: tab 0 unlocked. tab i locked until ALL PCBs for tab i-1 (for this operator) are Completed.
  const isTabLocked = (tabIndex) => {
    if (tabIndex <= 0) return false;
    const prevRows = pcbsForTab(tabIndex - 1);
    if (prevRows.length === 0) return false; // no dependency
    return !prevRows.every((r) => r.opObj.status === "Completed");
  };

  // handle clicking tab (option B): allow click but show helpful message if locked
  const handleTabChange = (e, newIndex) => {
    setActiveTab(newIndex);
    if (isTabLocked(newIndex)) {
      const prevIndex = newIndex - 1;
      const prevOp = assignedOperations[prevIndex];
      const requiredText = prevOp ? `${prevOp.sno}. ${prevOp.name}` : "previous process";
      const prevRows = pcbsForTab(prevIndex);
      const incomplete = prevRows.filter((r) => r.opObj.status !== "Completed").length;
      setLockedMessage(
        `This process is locked. Complete "${requiredText}" first. (${incomplete} incomplete PCB(s) remain)`
      );
    } else {
      setLockedMessage(null);
    }
  };

  const handleConfirmOk = () => {
    if (!confirmPayload) return closeConfirm();
    const { action, pcbSerial, opIndex } = confirmPayload;
    performAction({ action, pcbSerial, opIndex });
    closeConfirm();
  };

  // ActionButtons component
  const ActionButtons = ({ status, pcbSerial, opIndex, pcb }) => {
    const isCompleted = status === "Completed";
    const isInProgress = status === "In Progress";
    const rowLocked = isRowLocked(pcb, opIndex);

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title={rowLocked ? "Locked: previous process not completed" : "Start"}>
          <span>
            <IconButton
              size="small"
              onClick={() =>
                openConfirm({
                  action: "start",
                  message: "Start this process?",
                  pcbSerial,
                  opIndex,
                })
              }
              disabled={isInProgress || isCompleted || rowLocked}
            >
              <PlayArrowIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Stop"}>
          <span>
            <IconButton
              size="small"
              onClick={() =>
                openConfirm({
                  action: "stop",
                  message: "Stop (pause) this process?",
                  pcbSerial,
                  opIndex,
                })
              }
              disabled={!isInProgress || isCompleted || rowLocked}
            >
              <PauseIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Complete"}>
          <span>
            <IconButton
              size="small"
              onClick={() =>
                openConfirm({
                  action: "complete",
                  message: "Mark this process as COMPLETED?",
                  pcbSerial,
                  opIndex,
                })
              }
              disabled={isCompleted || rowLocked}
            >
              <DoneAllIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={rowLocked ? "Locked" : "Reset"}>
          <span>
            <IconButton
              size="small"
              color="inherit"
              onClick={() =>
                openConfirm({
                  action: "reset",
                  message:
                    "Reset this process to Not Started? This will erase start/end times.",
                  pcbSerial,
                  opIndex,
                })
              }
              disabled={rowLocked}
            >
              <RestoreIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    );
  };

  const handleCheckboxToggle = (checked, pcbSerial, opIndex, pcb) => {
    if (isRowLocked(pcb, opIndex)) {
      openConfirm({
        action: "noop",
        message: "Cannot change completion. Previous process for this PCB is not completed.",
        pcbSerial,
        opIndex,
      });
      return;
    }
    if (!checked) {
      openConfirm({
        action: "reset",
        message: "Uncheck to reset this process to Not Started?",
        pcbSerial,
        opIndex,
      });
    } else {
      openConfirm({
        action: "complete",
        message: "Mark this process as Completed?",
        pcbSerial,
        opIndex,
      });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <AppBar position="static" sx={{ bgcolor: "info.main" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Operator Dashboard
          </Typography>

          <Typography variant="body2" sx={{ mr: 2 }}>
            {currentUser?.name} ({currentUser?.staffNumber})
          </Typography>

          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Assigned Processes ({assignedOperations.length})
        </Typography>

        {assignedOperations.length === 0 ? (
          <Paper sx={{ p: 3 }}>
            <Typography>No assigned operations right now.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 1 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {assignedOperations.map((op, idx) => (
                <Tab key={`${op.sno}-${op.name}`} label={`${op.sno}. ${op.name}`} />
              ))}
            </Tabs>

            {lockedMessage ? (
              <Box sx={{ p: 3 }}>
                <Alert severity="warning">{lockedMessage}</Alert>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <TabPanel value={activeTab} index={activeTab} key={`panel-${activeTab}`}>
                  <ProcessTable
                    rows={pcbsForTab(activeTab)}
                    page={pageMap[activeTab] || 0}
                    onPageChange={(p) => setPageFor(activeTab, p)}
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
        <DialogContent>
          <Typography>{confirmPayload?.message || "Confirm action?"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (confirmPayload?.action === "noop") {
                closeConfirm();
                return;
              }
              handleConfirmOk();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function TabPanel({ children, value, index }) {
  return value === index ? <Box>{children}</Box> : null;
}

function ProcessTable({
  rows,
  page,
  onPageChange,
  pageSize,
  getPcbSerialKey,
  ActionButtons,
  onCheckboxToggle,
  isRowLocked,
}) {
  const total = rows.length;
  const start = page * pageSize;
  const end = Math.min(total, start + pageSize);
  const visible = rows.slice(start, end);

  const handleChangePage = (e, newPage) => {
    onPageChange(newPage);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell>PCB Serial Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.map(({ pcb, opIndex, opObj }, idx) => {
              const key = getPcbSerialKey(pcb);
              const serial = pcb[key] ?? "—";
              const status = opObj.status ?? "Not Started";
              const rowLocked = isRowLocked(pcb, opIndex);
              const disabled = status === "Completed";

              return (
                <TableRow
                  key={`${serial}-${opIndex}-${idx}`}
                  sx={{
                    bgcolor: disabled ? "#f0fff0" : rowLocked ? "#fff7e6" : "white",
                    opacity: disabled || rowLocked ? 0.85 : 1,
                  }}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold" }}>{serial}</Typography>
                  </TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>{fmt(opObj.startTime)}</TableCell>
                  <TableCell>{fmt(opObj.endTime)}</TableCell>
                  <TableCell>
                    <ActionButtons status={status} pcbSerial={serial} opIndex={opIndex} pcb={pcb} />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={status === "Completed"}
                      onChange={(e) => onCheckboxToggle(e.target.checked, serial, opIndex, pcb)}
                      disabled={status === "In Progress" || rowLocked}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No PCBs for this process.
                </TableCell>
              </TableRow>
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
    </Box>
  );
}
