/**
 * CreateOperatorTab.js
 * -----------------------------------------
 * Updated UI:
 * - Only asks for Staff Number & Password.
 * - Minimal structure for easy future additions.
 */

import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function CreateOperatorTab({
  newOperator,
  setNewOperator,
  handleCreateOperator
}) {

  const handleChange = (field, value) => {
    setNewOperator((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Operator
        </Typography>

        <Stack spacing={2}>

          {/* STAFF NUMBER */}
          <TextField
            label="Staff Number / ID"
            value={newOperator.staffNumber}
            onChange={(e) => handleChange("staffNumber", e.target.value)}
            fullWidth
            required
          />

          {/* NAME (ADDED BACK) */}
          <TextField
            label="Operator Name"
            value={newOperator.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            required
          />

          {/* PASSWORD */}
          <TextField
            label="Password"
            type="password"
            value={newOperator.password}
            onChange={(e) => handleChange("password", e.target.value)}
            fullWidth
            required
          />

          {/* SUBMIT */}
          <Button
            startIcon={<PersonAddIcon />}
            variant="contained"
            onClick={handleCreateOperator}
            disabled={!newOperator.staffNumber || !newOperator.name || !newOperator.password}
            size="large"
          >
            Create Operator
          </Button>

        </Stack>

      </Paper>
    </Container>
  );
}