/**
 * CreateProjectView.js
 * -----------------------------------------
 * This screen is used to UPLOAD EXCEL/CSV file
 * and move user to Preview screen.
 *
 * This file:
 * - Handles file selection
 * - Reads excel
 * - Extracts columns
 * - Detects serial number column
 * - Stores preview data
 * - Redirects to Preview page
 */

import React from "react";
import { Container, Typography, Button, Paper, Stack, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { readFile } from "../utils/excelReader";
import { detectSerialKeyFromKeys } from "../utils/helpers";

const STATUS_KEY = "Status";
const STATUS_NOT_YET_ASSIGNED = "Not Yet Created";

export default function CreateProjectView({
  setUploadedPreviewData,
  setPreviewColumns,
  setPcbSerialKey,
  setView,
}) {

  /**
   * Called when file is selected
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Read Excel file
      const data = await readFile(file);

      if (!data.length) {
        alert("Uploaded file contains no rows");
        return;
      }

      // Extract column names
      const columns = Object.keys(data[0]).filter((k) => k !== "id");

      // Ensure Status column exists
      if (!columns.includes(STATUS_KEY)) {
        columns.push(STATUS_KEY);
      }

      // Detect Serial Number column
      const discoveredKey = detectSerialKeyFromKeys(columns);
      setPcbSerialKey(discoveredKey);

      // Normalize Status column for all rows
      const normalized = data.map((row, index) => ({
        id: `row-${Date.now()}-${index}`,
        ...row,
        [STATUS_KEY]: row[STATUS_KEY] || STATUS_NOT_YET_ASSIGNED,
      }));

      // Save preview data in parent(AdminDashboard)
      setPreviewColumns(columns);
      setUploadedPreviewData(normalized);

      // Open preview screen
      setView("preview");

    } catch (error) {
      console.error(error);
      alert("Error reading file. Upload valid Excel or CSV.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>

      {/* Back Button */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("home")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Create Project
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>

        {/* Instructions */}
        <Typography variant="body2" sx={{ mb: 2 }}>
          Upload a CSV or Excel file to generate project rows.
        </Typography>

        {/* Hidden File Input */}
        <input
          id="upload-file"
          type="file"
          accept=".csv, .xlsx, .xls"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        {/* Upload Button */}
        <Button
          variant="contained"
          component="label"
          htmlFor="upload-file"
          startIcon={<UploadFileIcon />}
        >
          Choose File
        </Button>

      </Paper>
    </Container>
  );
}
