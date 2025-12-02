/**
 * MasterView.js
 * -----------------------------------------
 * This screen shows MASTER LIST TABLE.
 *
 * Admin can:
 * - View all uploaded PCBs
 * - Select rows
 * - Move selected rows to In-Action list
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
  Checkbox,
  Stack,
  Button,
  IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Utilities
import {
  normalizeSerialValue,
  detectSerialKeyFromKeys
} from "../utils/helpers";

// Constants
const STATUS_KEY = "Status";
const STATUS_ASSIGNED = "Created";
const STATUS_NOT_YET_ASSIGNED = "Not Yet Created";

export default function MasterView({
  masterList,
  setMasterList,
  setInActionList,
  addInActionPCBs,
  selectedIds,
  setSelectedIds,
  setPcbSerialKey,
  setView
}) {

  /**
   * Toggle row checkbox
   */
  const handleMasterCheckbox = (id) => {

    const row = masterList.find((r) => r.id === id);

    // Do not select already assigned rows
    if (row?.[STATUS_KEY] === STATUS_ASSIGNED) return;

    setSelectedIds((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  /**
   * Move selected rows to In-Action list
   */
  const handleMarkSelectedAssigned = () => {

    if (!selectedIds.size)
      return alert("Select rows to assign.");

    if (!window.confirm(`Assign ${selectedIds.size} rows and send to In-Action?`))
      return;

    const itemsToMove = [];

    const updatedMaster = masterList.map((item) => {

      if (selectedIds.has(item.id) && item[STATUS_KEY] !== STATUS_ASSIGNED) {
        itemsToMove.push(item);
        return { ...item, [STATUS_KEY]: STATUS_ASSIGNED };
      }

      return item;
    });

    if (!itemsToMove.length)
      return alert("No unassigned rows selected.");

    // Update Master list UI
    setMasterList(updatedMaster);

    // Detect serial number column from headers
    const discoveredKey = detectSerialKeyFromKeys(Object.keys(itemsToMove[0]));
    setPcbSerialKey(discoveredKey);

    // Prepare in-action objects
    const outgoing = itemsToMove.map((item) => ({
      ...item,
      [STATUS_KEY]: "Incomplete",
      _pcb_key_id: discoveredKey,
      isWorkAssigned: false,
      linkedOperations: item.linkedOperations || [],
    }));

    // Update In-action list globally
    setInActionList((prev) => [...prev, ...outgoing]);

    // Notify App.js to update Supervisor dashboard
    addInActionPCBs(itemsToMove, discoveredKey);

    // Clear selection
    setSelectedIds(new Set());

    // Go to In-action Page
    setView("inaction");

    alert("Moved to In-Action.");
  };

  // Column names
  const cols =
    masterList.length > 0
      ? Object.keys(masterList[0]).filter((k) => k !== "id")
      : [];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>

      {/* Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("home")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Master List
        </Typography>
      </Stack>

      {/* No records */}
      {!masterList.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No master records. Upload a file first.</Typography>
        </Paper>
      ) : (

        <Paper sx={{ borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader size="small">

              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell padding="checkbox">
                    Select
                  </TableCell>

                  {cols.map((c) => (
                    <TableCell key={c}>
                      {c}
                    </TableCell>
                  ))}

                </TableRow>
              </TableHead>

              <TableBody>
                {masterList.map((row) => {
                  const isAssigned = row[STATUS_KEY] === STATUS_ASSIGNED;

                  return (
                    <TableRow
                      key={row.id}
                      sx={{ bgcolor: isAssigned ? "#f0fff0" : "white" }}
                    >

                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            isAssigned || selectedIds.has(row.id)
                          }
                          onChange={() => handleMasterCheckbox(row.id)}
                          disabled={isAssigned}
                        />
                      </TableCell>

                      {cols.map((c) => (
                        <TableCell key={`${row.id}-${c}`}>
                          {c === STATUS_KEY ? (
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                color: isAssigned
                                  ? "success.main"
                                  : "warning.dark",
                              }}
                            >
                              {row[c]}
                            </Typography>
                          ) : (
                            row[c]
                          )}
                        </TableCell>
                      ))}

                    </TableRow>
                  );
                })}
              </TableBody>

            </Table>
          </TableContainer>

          {/* Action Bar */}
          <div style={{ padding: "16px", textAlign: "right" }}>
            <Button
              variant="contained"
              disabled={!selectedIds.size}
              onClick={handleMarkSelectedAssigned}
            >
              Assign & Move to In-Action ({selectedIds.size})
            </Button>
          </div>

        </Paper>
      )}

    </Container>
  );
}
