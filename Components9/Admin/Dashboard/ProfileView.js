/**
 * ProfileView.js
 * -----------------------------------------
 * This screen is currently a PLACEHOLDER.
 *
 * You planned to later:
 * - Create operator profiles
 * - Add new admin users
 * - Assign roles
 *
 * Right now it only shows a simple message.
 */

import React from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProfileView({ setView }) {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>

      {/* Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("home")}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6">
          Profile Creation
        </Typography>
      </Stack>

      {/* Body */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2">
          This area can be used for future profile creation.
        </Typography>
      </Paper>

    </Container>
  );
}
