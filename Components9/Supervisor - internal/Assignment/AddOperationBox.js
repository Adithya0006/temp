/**
 * AddOperationBox.js
 * -----------------------------------------
 * Allows Supervisor to ADD a new operation
 * into the operations list dynamically.
 *
 * EXACT same logic from original file.
 */

import React from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

export default function AddOperationBox({
  newOperationName,
  setNewOperationName,
  handleAddOperation
}) {
  return (
    <>

      {/* Section title */}
      <Typography variant="subtitle2">
        Add New Operation
      </Typography>

      {/* Input and button */}
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>

        <TextField
          size="small"
          label="New Operation"
          fullWidth
          value={newOperationName}
          onChange={(e) => setNewOperationName(e.target.value)}
        />

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleAddOperation}
        >
          Add
        </Button>

      </Box>
    </>
  );
}
