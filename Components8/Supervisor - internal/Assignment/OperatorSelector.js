/**
 * OperatorSelector.js
 * -----------------------------------------
 * Multi-select dropdown for choosing operators
 * to assign to the selected operation.
 *
 * EXACT behavior from SupervisorAssignement.js
 */

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

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
          const staffNumbers = e.target.value;

          // Convert selected staffNumbers -> operator objects (same logic as original)
          const selectedObjs = operatorOptions.filter((op) =>
            staffNumbers.includes(op.staffNumber)
          );

          setSelectedOperators(selectedObjs);
        }}
        renderValue={(selected) =>
          operatorOptions
            .filter((op) => selected.includes(op.staffNumber))
            .map((op) => op.name)
            .join(", ")
        }
      >
        {operatorOptions.map((op) => (
          <MenuItem key={op.staffNumber} value={op.staffNumber}>
            {op.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
