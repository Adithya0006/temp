/**
 * AssignmentTable.js
 * -----------------------------------------
 * This table shows:
 *  - Selected operation
 *  - Selected operators
 *  - Assigned PCs
 *  - Save Assignment button
 *
 * EXACT same structure and behavior as original file.
 */

import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Typography
} from "@mui/material";

export default function AssignmentTable({
  selectedOperation,
  selectedOperators,
  pcbs = [],
  selectedPcbs = [],
  setSelectedPcbs,
  handleAssignWork,
}) {

  /**
   * Toggle selection of PCB row
   */
  const togglePCB = (id) => {
    setSelectedPcbs((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  return (
    <Paper sx={{ mt: 2, p: 2 }}>

      {/* Header row */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Assignment Preview
      </Typography>

      {/* TABLE */}
      <Table size="small">

        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>PCB Serial</TableCell>
            <TableCell>Operation</TableCell>
            <TableCell>Operators</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pcbs.map((pcb) => {

            // Detect PCB serial number key safely
            const serial =
              pcb[pcb._pcb_key_id] ||
              pcb["serial number"] ||
              pcb["Serial Number"] ||
              pcb["PCB Serial Number"];

            return (
              <TableRow key={pcb.id || serial}>

                <TableCell>
                  <Checkbox
                    checked={selectedPcbs.has(pcb.id)}
                    onChange={() => togglePCB(pcb.id)}
                  />
                </TableCell>

                <TableCell>
                  {serial}
                </TableCell>

                <TableCell>
                  {selectedOperation?.name || "—"}
                </TableCell>

                <TableCell>
                  {selectedOperators.map(op => op.name).join(", ")}
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>

      </Table>

      {/* ACTION BUTTON */}
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        disabled={!selectedPcbs.size}
        onClick={handleAssignWork}
      >
        Assign Selected
      </Button>

    </Paper>
  );
}
