/**
 * AssignmentHeader.js
 * -----------------------------------------
 * Header bar for Supervisor Assignment page.
 *
 * Shows:
 *  - Page title
 *  - Back button
 *
 * Pure UI component.
 */

import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AssignmentHeader({ onBack }) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" spacing={1}>

          {/* BACK BUTTON */}
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>

          {/* TITLE */}
          <Typography variant="h6">
            Assign Operations
          </Typography>

        </Stack>
      </Container>
    </Box>
  );
}
