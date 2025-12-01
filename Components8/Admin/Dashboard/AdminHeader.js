/**
 * AdminHeader.js
 * -----------------------------------------
 * This file contains the TOP BLUE HEADER BAR
 * shown in Admin Dashboard.
 *
 * It has:
 * - Title (Admin Dashboard)
 * - Home button
 * - Logout button
 *
 * It does NOT manage data.
 * It only triggers navigation actions.
 */

import {
  Box,
  Container,
  Typography,
  Button,
  Stack
} from "@mui/material";

export default function AdminHeader({ onHome, onLogout }) {
  return (
    <Box
      sx={{
        p: 2,
        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        color: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
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
        {/* LEFT SIDE TITLE */}
        <Typography variant="h6">
          Admin Dashboard
        </Typography>

        {/* RIGHT SIDE BUTTONS */}
        <Stack direction="row" spacing={1}>

          {/* Go back to Home */}
          <Button onClick={onHome}>
            Home
          </Button>

          {/* Logout */}
          <Button variant="outlined" onClick={onLogout}>
            Logout
          </Button>

        </Stack>
      </Container>
    </Box>
  );
}
