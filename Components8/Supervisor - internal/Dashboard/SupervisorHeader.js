/**
 * SupervisorHeader.js
 * -----------------------------------------
 * Top header bar for Supervisor Dashboard.
 *
 * Shows:
 *  - Dashboard title
 *  - Logout button
 *
 * Pure UI component — no logic here.
 */

import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";

export default function SupervisorHeader({ onLogout }) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT */}
        <Typography variant="h6">
          Supervisor Internal Dashboard
        </Typography>

        {/* RIGHT */}
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onLogout}>
            Logout
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
