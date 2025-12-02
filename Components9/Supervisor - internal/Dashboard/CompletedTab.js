/**
 * CompletedTab.js
 * -----------------------------------------
 * Shows all COMPLETED PCBs.
 *
 * Supervisor can:
 * - View serial number
 * - See completed operations count
 */

import React from "react";
import {
  Container,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

const PCB_KEY_FALLBACK = "serial number";

// Detect PCB serial key safely
const detectKey = (pcb) =>
  pcb._pcb_key_id ||
  Object.keys(pcb).find((k) => k !== "id" && k !== "linkedOperations") ||
  PCB_KEY_FALLBACK;

export default function CompletedTab({ completedPCBs = [] }) {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>

      {/* Title */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Completed PCBs ({completedPCBs.length})
      </Typography>

      {/* Empty state */}
      {!completedPCBs.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography>
            No completed PCBs yet.
          </Typography>
        </Paper>
      ) : (

        // Completed table
        <Paper sx={{ borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader size="small">

              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell>PCB Serial</TableCell>
                  <TableCell>Completed OP Count</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {completedPCBs.map((pcb) => {

                  const key = detectKey(pcb);
                  const serial = pcb[key] ?? pcb[PCB_KEY_FALLBACK] ?? "N/A";

                  const completedCount =
                    (pcb.linkedOperations || [])
                      .filter(op => op.status === "Completed")
                      .length;

                  return (
                    <TableRow key={pcb.id || serial}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {serial}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {completedCount}
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
}
