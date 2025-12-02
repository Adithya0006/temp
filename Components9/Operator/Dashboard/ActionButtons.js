/**
 * ActionButtons.js
 * -----------------------------------------
 * This component renders ALL buttons for each PCB row:
 *  - Start
 *  - Stop
 *  - Complete
 *  - Reset
 *  - Open Form
 *
 * NO LOGIC CHANGED — only extracted from OperatorDashboard
 */

import React from "react";
import { Stack, IconButton, Button } from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RestoreIcon from "@mui/icons-material/Restore";

export default function ActionButtons({
  status,
  pcbSerial,
  opIndex,
  pcb,
  performAction,
  setActiveForm,
  setOpenForm,
}) {

  /**
   * Check if previous stage is completed
   * If not, disable current row
   */
  const isRowLocked = (pcb, opIndex) => {
    const ops = pcb.linkedOperations || [];
    if (!ops || opIndex <= 0) return false;
    return ops[opIndex - 1]?.status !== "Completed";
  };

  const rowLocked = isRowLocked(pcb, opIndex);

  return (
    <Stack direction="row" spacing={1}>

      {/* START */}
      <IconButton
        onClick={() => {
          performAction({ action: "start", pcbSerial, opIndex });

          // ✅ Open form automatically on start
          setActiveForm({ pcbSerial, stageId: opIndex + 1 });
          setOpenForm(true);
        }}
        disabled={status !== "Not Started" || rowLocked}
      >
        <PlayArrowIcon />
      </IconButton>

      {/* STOP */}
      <IconButton
        onClick={() => performAction({ action: "stop", pcbSerial, opIndex })}
        disabled={status !== "In Progress"}
      >
        <PauseIcon />
      </IconButton>

      {/* COMPLETE */}
      <IconButton
        onClick={() => performAction({ action: "complete", pcbSerial, opIndex })}
        disabled={status === "Completed" || rowLocked}
      >
        <DoneAllIcon />
      </IconButton>

      {/* RESET */}
      <IconButton
        onClick={() => performAction({ action: "reset", pcbSerial, opIndex })}
      >
        <RestoreIcon />
      </IconButton>

      {/* OPEN FORM */}
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
}
