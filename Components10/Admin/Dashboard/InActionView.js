/**
 * InActionView.js
 * -----------------------------------------
 * This page shows all PCBs that are currently
 * in "In-Action" stage.
 *
 * Admin can:
 * - View current PCBs
 * - Move PCB back to Master List
 */

import React from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Button,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

// Utilities
import {
  normalizeSerialValue,
  detectSerialKeyFromKeys
} from "../utils/helpers";

// Fallback if serial column not detected
const PCB_SERIAL_KEY_FALLBACK = "serial number";

export default function InActionView({
  inActionList,
  deleteInActionPCB,
  pcbSerialKey,
  setView
}) {

  /**
   * Move PCB BACK from In-Action → Master
   */
  const handleMoveBackToMaster = (rowId) => {

    // Find clicked PCB row
    const row = inActionList.find((r) => r.id === rowId);
    if (!row) return;

    // Detect which column is serial number
    const keyUsed =
      pcbSerialKey || detectSerialKeyFromKeys(Object.keys(row));

    // Read serial number from row
    const serialRaw =
      row[keyUsed] ??
      row[PCB_SERIAL_KEY_FALLBACK] ??
      row["SNo"] ??
      "";

    const serialNormalized = normalizeSerialValue(serialRaw);

    if (!serialNormalized)
      return alert("Cannot detect serial number.");

    if (!window.confirm(`Move PCB ${serialRaw} back to Master List?`))
      return;

    // Ask App.js to delete PCB from global InActionPCBs
    deleteInActionPCB(serialRaw);

    alert(`Moved ${serialRaw} back to Master List.`);
  };

  // Which column is serial number
  const key =
    inActionList?.[0]?._pcb_key_id || pcbSerialKey;

  // Determine columns dynamically
  const baseCols =
    inActionList.length > 0
      ? Object.keys(inActionList[0]).filter(
          (k) =>
            ![
              "id",
              "linkedOperations",
              "isWorkAssigned",
              "_pcb_key_id",
            ].includes(k)
        )
      : [];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>

      {/* Header with Back button */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("home")}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6">
          In-Action PCBs ({inActionList.length})
        </Typography>
      </Stack>

      {/* No data state */}
      {!inActionList.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No PCBs in In-Action.</Typography>
        </Paper>
      ) : (

        // Table
        <Paper sx={{ borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader size="small">

              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  {baseCols.map((c) => (
                    <TableCell key={c}>{c}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {inActionList.map((row) => (
                  <TableRow key={row.id}>

                    {/* Data cells */}
                    {baseCols.map((c) => (
                      <TableCell key={`${row.id}-${c}`}>
                        {c === key ? (
                          <Typography sx={{ fontWeight: 600 }}>
                            {row[c]}
                          </Typography>
                        ) : (
                          row[c]
                        )}
                      </TableCell>
                    ))}

                    {/* Action column */}
                    <TableCell>

                      <Button
                        startIcon={<DeleteIcon />}
                        size="small"
                        color="error"
                        onClick={() => handleMoveBackToMaster(row.id)}
                      >
                        Move Back
                      </Button>

                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

      )}

    </Container>
  );
}
