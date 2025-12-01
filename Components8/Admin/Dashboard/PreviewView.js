/**
 * PreviewView.js
 * -----------------------------------------
 * This screen appears AFTER uploading Excel file.
 *
 * It allows:
 * - Editing cells
 * - Adding Rows
 * - Deleting Rows
 * - Saving to Master List
 * - Cancelling upload
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
  TextField,
  Stack,
  Button,
  IconButton,
  Box
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Constants
const STATUS_KEY = "Status";
const STATUS_NOT_YET_ASSIGNED = "Not Yet Created";

export default function PreviewView({
  uploadedPreviewData,
  previewColumns,
  setUploadedPreviewData,
  setPreviewColumns,
  setMasterList,
  setView
}) {

  /**
   * Add new row manually
   */
  const handleAddRow = () => {

    const newRow = {
      id: `row-${Date.now()}-new`,
    };

    previewColumns.forEach(c => newRow[c] = "");

    newRow[STATUS_KEY] = STATUS_NOT_YET_ASSIGNED;

    setUploadedPreviewData(prev => [...prev, newRow]);
  };

  /**
   * Update any cell value
   */
  const handleUpdatePreviewCell = (rowId, colKey, val) => {

    setUploadedPreviewData(prev =>
      prev.map(r =>
        r.id === rowId
          ? { ...r, [colKey]: val }
          : r
      )
    );
  };

  /**
   * Delete a row
   */
  const handleDeletePreviewRow = (id) => {

    if (!window.confirm("Delete this row?")) return;

    setUploadedPreviewData(prev =>
      prev.filter(r => r.id !== id)
    );
  };

  /**
   * Save file data to Master List
   */
  const handleSaveToMasterList = () => {

    if (!uploadedPreviewData?.length)
      return alert("No preview data to save.");

    if (!window.confirm("Save preview rows to Master List?")) return;

    const incoming = uploadedPreviewData.map(row => ({
      ...row,
      [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED,
    }));

    // First time save
    setMasterList(prev =>
      prev.length === 0
        ? incoming
        : [...prev, ...incoming]
    );

    // Reset preview data
    setUploadedPreviewData(null);
    setPreviewColumns([]);

    // Back to Home
    setView("home");

    alert("Saved to Master List.");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      {/* Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("create")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Preview & Edit
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddRow}
          >
            Add Row
          </Button>

          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              if (window.confirm("Cancel upload?")) {
                setUploadedPreviewData(null);
                setPreviewColumns([]);
                setView("home");
              }
            }}
          >
            Cancel
          </Button>
        </Box>

        {/* Preview Table */}
        <TableContainer component={Paper} sx={{ maxHeight: "55vh" }}>
          <Table size="small" stickyHeader>

            <TableHead>
              <TableRow>
                {previewColumns.map(c => (
                  <TableCell
                    key={c}
                    sx={{ fontWeight: 600 }}
                  >
                    {c}
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {uploadedPreviewData.map(row => (
                <TableRow key={row.id}>

                  {previewColumns.map(c => (
                    <TableCell
                      key={`${row.id}-${c}`}
                      sx={{ p: 0.5 }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        disabled={c === STATUS_KEY}
                        value={row[c] || ""}
                        onChange={(e) =>
                          handleUpdatePreviewCell(
                            row.id,
                            c,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  ))}

                  {/* Delete Button */}
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeletePreviewRow(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

        {/* Save Button */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSaveToMasterList}
          >
            Save to Master List
          </Button>
        </Box>

      </Paper>
    </Container>
  );
}
