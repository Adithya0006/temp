/**
 * InActionTab.js
 * -----------------------------------------
 * Shows all PCBs currently in action.
 *
 * Supervisor can:
 * - View PCB details
 * - Open assignment editor
 */

import React from "react";
import {
  Container,
  Stack,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";

const PCB_KEY_FALLBACK = "serial number";

/**
 * Utility to detect serial number key
 */
const detectKey = (pcb) =>
  pcb._pcb_key_id ||
  Object.keys(pcb).find((k) => k !== "id" && k !== "linkedOperations") ||
  PCB_KEY_FALLBACK;

export default function InActionTab({
  inActionPCBs = [],
  handleAssignWork,
}) {
  const assignedCount = inActionPCBs.length || 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>

      {/* TITLE */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <InventoryIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6">
            In-Action PCBs ({assignedCount})
          </Typography>
        </Stack>
      </Stack>

      {/* EMPTY STATE */}
      {!inActionPCBs.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography>
            No PCBs are currently in-action.
            Ask Admin to move PCBs from Master List.
          </Typography>
        </Paper>
      ) : (

        // DATA TABLE
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

                  const key = detectKey(pcb);
                  const serial = pcb[key] ?? pcb[PCB_KEY_FALLBACK] ?? "N/A";

                  const assignedOps =
                    (pcb.linkedOperations || [])
                      .filter(op => (op.assignedTo || []).length > 0);

                  return (
                    <TableRow key={pcb.id || serial}>

                      {/* PCB SERIAL */}
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {serial}
                        </Typography>
                      </TableCell>

                      {/* COMMON INFO */}
                      <TableCell>
                        {Object.entries(pcb)
                          .filter(([k]) =>
                            !["id", "linkedOperations", "_pcb_key_id", "isWorkAssigned"]
                              .includes(k)
                          )
                          .slice(0, 3)
                          .map(([k, v]) => (
                            <Typography key={k} variant="body2">
                              <strong>{k}:</strong> {String(v)}
                            </Typography>
                          ))}
                      </TableCell>

                      {/* ASSIGNED OPS COUNT */}
                      <TableCell>
                        <Typography variant="body2">
                          {assignedOps.length} assigned operation(s)
                        </Typography>
                      </TableCell>

                      {/* ACTION BUTTON */}
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            if (typeof handleAssignWork === "function") {
                              handleAssignWork(serial);
                            } else {
                              alert("Assign function not available.");
                            }
                          }}
                        >
                          Assign / Edit
                        </Button>
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
