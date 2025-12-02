/**
 * OperatorSelector.js
 * -----------------------------------------
 * FIXED: Uses 'op.name' correctly.
 */

import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

export default function OperatorSelector({
  operatorOptions = [],
  selectedOperators = [],
  setSelectedOperators,
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>Assign to Operators</InputLabel>

      <Select
        multiple
        label="Assign to Operators"
        value={selectedOperators.map((op) => op.staffNumber)}
        onChange={(e) => {
          const staffNumbers = e.target.value; // Array of IDs
          // Find the full objects
          const selectedObjs = operatorOptions.filter((op) =>
            staffNumbers.includes(op.staffNumber)
          );
          setSelectedOperators(selectedObjs);
        }}
        renderValue={(selectedIds) => {
           // Show names in the box after selection
           return operatorOptions
             .filter(op => selectedIds.includes(op.staffNumber))
             .map(op => op.name)
             .join(", ");
        }}
      >
        {operatorOptions.map((op) => (
          <MenuItem key={op.staffNumber} value={op.staffNumber}>
            <Checkbox checked={selectedOperators.some(s => s.staffNumber === op.staffNumber)} />
            {/* FIXED: We use op.name, not op.label */}
            <ListItemText primary={op.name} secondary={op.staffNumber} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}