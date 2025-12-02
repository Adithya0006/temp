/**
 * CreateOperatorTab.js
 * -----------------------------------------
 * This screen is used to CREATE a new operator
 * inside Supervisor dashboard.
 *
 * It contains:
 * - Name input
 * - Phone input
 * - Submit button
 *
 * Validations and behavior are EXACT same as original.
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

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>

      <Paper sx={{ p: 3 }}>

        {/* Title */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Operator
        </Typography>

        {/* Form */}
        <Stack spacing={2}>

          {/* NAME */}
          <TextField
            label="Operator Name"
            value={newOperator.name}
            onChange={(e) =>
              setNewOperator(prev => ({
                ...prev,
                name: e.target.value
              }))
            }
            fullWidth
          />

          {/* PHONE */}
          <TextField
            label="Phone Number"
            value={newOperator.phone}
            onChange={(e) =>
              setNewOperator(prev => ({
                ...prev,
                phone: e.target.value
              }))
            }
            fullWidth
          />

          {/* SUBMIT */}
          <Button
            startIcon={<PersonAddIcon />}
            variant="contained"
            onClick={handleCreateOperator}
          >
            Create Operator
          </Button>

        </Stack>

      </Paper>
    </Container>
  );
}
