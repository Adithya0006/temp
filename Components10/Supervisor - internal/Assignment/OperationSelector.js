/**
 * OperationSelector.js
 * -----------------------------------------
 * FIXED: Handles both "Operation Name" and "name" keys.
 */

import React from "react";
import { Paper, Select, MenuItem, Typography, Stack, FormControl, InputLabel } from "@mui/material";

export default function OperationSelector({
  operations = [],
  selectedOperation,
  setSelectedOperation
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>Select Operation</InputLabel>
      <Select
        value={selectedOperation || ""}
        label="Select Operation"
        onChange={(e) => setSelectedOperation(e.target.value)}
        renderValue={(selected) => {
          if (!selected) return "";
          // Handle both data formats safely
          const name = selected.name || selected["Operation Name"];
          const sno = selected.sno || selected["S.No"];
          return `${sno}. ${name}`;
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>

        {operations.map((op, index) => {
          // SAFE CHECK: Handle both key styles
          const name = op.name || op["Operation Name"];
          const sno = op.sno || op["S.No"] || index + 1;

          return (
            <MenuItem key={sno} value={op}>
              {sno}. {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}