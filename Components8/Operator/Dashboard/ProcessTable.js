/**
 * ProcessTable.js
 * -----------------------------------------
 * This component renders the DATA TABLE
 * where operator works on PCBs.
 *
 * It shows:
 * - PCB Serial
 * - Status
 * - Start Time
 * - End Time
 * - Action Buttons
 *
 * This file is UI-only.
 * NO state here.
 */

import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import ActionButtons from "./ActionButtons";

// Helper for date formatting (same logic as original)
const fmt = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

export default function ProcessTable({
  rows = [],
  pageSize,
  performAction,
  setOpenForm,
  setActiveForm,
}) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>

      <Table size="small">

        {/* TABLE HEADER */}
        <TableHead>
          <TableRow>
            <TableCell>PCB Serial</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        {/* TABLE BODY */}
        <TableBody>
          {rows.map(({ pcb, opIndex, opObj }) => {

            // Extract serial number dynamically
            const serial = pcb[pcb._pcb_key_id || "PCB Serial Number"];

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
                    performAction={performAction}
                    setActiveForm={setActiveForm}
                    setOpenForm={setOpenForm}
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
