/**
 * OperationSelector.js
 * -----------------------------------------
 * Allows Supervisor to choose an OPERATION
 * while assigning work to operators.
 *
 * Extracted as-is from SupervisorAssignement.js
 * No logic or UI modified.
 */

import React from "react";
import {
  Paper,
  Select,
  MenuItem,
  Typography,
  Stack
} from "@mui/material";

export default function OperationSelector({
  operations = [],
  selectedOperation,
  setSelectedOperation
}) {
  return (
    <Paper sx={{ p: 2 }}>

      <Stack spacing={1}>

        <Typography variant="body2">
          Select Operation
        </Typography>

        {/* Operation Dropdown */}
        <Select
          value={selectedOperation || ""}
          onChange={(e) => setSelectedOperation(e.target.value)}
          fullWidth
          displayEmpty
        >
          <MenuItem value="">
            Select Operation
          </MenuItem>

          {operations.map(op => (
            <MenuItem key={op.sno} value={op}>
              {op.sno}. {op.name}
            </MenuItem>
          ))}
        </Select>

      </Stack>

    </Paper>
  );
}
