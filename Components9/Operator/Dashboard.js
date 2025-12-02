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

/* ✅ ADD THIS IMPORT */
// import { ProcessFormPage } from "../ProcessForms";
import ProcessFormPage from "./ProcessForms/ProcessFormPage";
// import ProcessFormPage from "../../Test/Operator/ProcessForms/ProcessFormPage";

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";



// ------------------ helper functions ------------------

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

// ------------------ component ------------------

export default function OperatorDashboard({
  onLogout,
  role,
  currentUser,
  inActionPCBs = [],
  updateInActionPCBs,
  pageSizeDefault = 10,
}) {
  const staffId = String(getStaffId(currentUser) || "");

  /* ✅ FORM STATE (NEW) */
  const [openForm, setOpenForm] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // { pcbSerial, stageId }

  const assignedOperations = useMemo(() => {
    const map = new Map();
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
    const arr = Array.from(map.values());
    arr.sort((a, b) => Number(a.sno) - Number(b.sno));
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

  const applyUpdate = (updater) => {
    if (typeof updateInActionPCBs === "function") {
      updateInActionPCBs((prev) => updater(Array.isArray(prev) ? prev : []));
    }
  };

  const isRowLocked = (pcb, opIndex) => {
    const ops = pcb.linkedOperations || [];
    if (!ops || opIndex <= 0) return false;
    return ops[opIndex - 1]?.status !== "Completed";
  };

  const performAction = ({ action, pcbSerial, opIndex }) => {
    applyUpdate((prev) =>
      prev.map((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        if (pcb[key] !== pcbSerial) return pcb;
        const ops = pcb.linkedOperations.map((op, idx) => {
          if (idx !== opIndex) return op;
          const now = new Date().toISOString();
          const copy = { ...op };
          if (action === "start") { copy.startTime = now; copy.status = "In Progress"; }
          if (action === "stop") { copy.endTime = now; copy.status = "Stopped"; }
          if (action === "complete") { copy.endTime = now; copy.status = "Completed"; }
          if (action === "reset") {
            copy.startTime = null;
            copy.endTime = null;
            copy.status = "Not Started";
          }
          return copy;
        });
        return { ...pcb, linkedOperations: ops };
      })
    );
  };

  const pcbsForTab = (tabIndex) => {
    const target = assignedOperations[tabIndex];
    if (!target) return [];
    const results = [];

    inActionPCBs.forEach((pcb) => {
      const ops = pcb.linkedOperations || [];
      let index = ops.findIndex(
        (o) => String(o["S.No"]) === String(target.sno)
      );
      if (index === -1) return;

      const op = ops[index];
      if (!op.assignedTo?.some((a) => String(a.staffNumber) === staffId)) return;

      results.push({ pcb, opIndex: index, opObj: op });
    });

    return results;
  };

  const isTabLocked = (tabIndex) => {
    if (tabIndex === 0) return false;
    return !pcbsForTab(tabIndex - 1).every((r) => r.opObj.status === "Completed");
  };

  const handleTabChange = (e, idx) => {
    setActiveTab(idx);
    if (isTabLocked(idx)) {
      setLockedMessage("Previous process not completed!");
    } else {
      setLockedMessage(null);
    }
  };

  const ActionButtons = ({ status, pcbSerial, opIndex, pcb }) => {
    const rowLocked = isRowLocked(pcb, opIndex);

    return (
      <Stack direction="row" spacing={1}>
        {/* START */}
        <IconButton
  onClick={() => {
    performAction({ action: "start", pcbSerial, opIndex });   // ✅ auto start time
    setActiveForm({ pcbSerial, stageId: opIndex + 1 });       // ✅ open form
    setOpenForm(true);
  }}
  disabled={status !== "Not Started" || rowLocked}
>

          <PlayArrowIcon />
        </IconButton>

        {/* STOP */}
        <IconButton
          onClick={() => openConfirm({ action: "stop", pcbSerial, opIndex })}
          disabled={status !== "In Progress"}
        >
          <PauseIcon />
        </IconButton>

        {/* COMPLETE */}
        <IconButton
          onClick={() => openConfirm({ action: "complete", pcbSerial, opIndex })}
          disabled={status === "Completed" || rowLocked}
        >
          <DoneAllIcon />
        </IconButton>

        {/* RESET */}
        <IconButton
          onClick={() => openConfirm({ action: "reset", pcbSerial, opIndex })}
        >
          <RestoreIcon />
        </IconButton>

        {/* ✅ NEW: OPEN FORM */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setActiveForm({ pcbSerial, stageId: opIndex + 1 });
            setOpenForm(true);
          }}
        >
          Open Form
        </Button>
      </Stack>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Operator Dashboard</Typography>
          <Typography>{currentUser?.name}</Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {assignedOperations.map((op) => (
            <Tab key={op.sno} label={`${op.sno}. ${op.name}`} />
          ))}
        </Tabs>

        {lockedMessage && <Alert severity="warning">{lockedMessage}</Alert>}

        <ProcessTable
          rows={pcbsForTab(activeTab)}
          pageSize={pageSize}
          ActionButtons={ActionButtons}
          getPcbSerialKey={getPcbSerialKey}
          isRowLocked={isRowLocked}
        />
      </Container>

      {/* ✅ CONFIRM DIALOG */}
      <Dialog open={confirmOpen} onClose={closeConfirm}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography>Are you sure?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancel</Button>
          <Button
            onClick={() => {
              performAction(confirmPayload);
              closeConfirm();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ PROCESS FORM DIALOG */}
      <Dialog
        open={openForm}
        fullWidth
        maxWidth="md"
        onClose={() => setOpenForm(false)}
      >
        <DialogTitle>Process Form</DialogTitle>
        <DialogContent>
          {activeForm && (
           <ProcessFormPage
  pcbSerial={activeForm.pcbSerial}
  stageId={activeForm.stageId}
  operator={currentUser}

  onSaveComplete={() => {
    // ✅ mark process complete when Save clicked
    performAction({
      action: "complete",
      pcbSerial: activeForm.pcbSerial,
      opIndex: activeForm.stageId - 1
    });

    // ✅ close form dialog
    setOpenForm(false);
  }}
/>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// ------------------ table ------------------

function ProcessTable({ rows, pageSize, ActionButtons, getPcbSerialKey }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>PCB Serial</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ pcb, opIndex, opObj }) => {
            const serial = pcb[getPcbSerialKey(pcb)];
            return (
              <TableRow key={`${serial}-${opIndex}`}>
                <TableCell>{serial}</TableCell>
                <TableCell>{opObj.status}</TableCell>
                <TableCell>{fmt(opObj.startTime)}</TableCell>
                <TableCell>{fmt(opObj.endTime)}</TableCell>
                <TableCell>
                  <ActionButtons
                    status={opObj.status}
                    pcbSerial={serial}
                    opIndex={opIndex}
                    pcb={pcb}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
