/**
 * OperatorHeader.js
 * ---------------------------------
 * This component renders the TOP BLUE BAR for Operator Dashboard.
 * It shows:
 *  - Title (Operator Dashboard)
 *  - Operator name
 *  - Logout button
 *
 * This file is PURE UI.
 * It does not manage state.
 */

import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function OperatorHeader({ onLogout, currentUser }) {
  return (
    <AppBar position="static">
      <Toolbar>

        {/* LEFT TITLE */}
        <Typography sx={{ flexGrow: 1 }}>
          Operator Dashboard
        </Typography>

        {/* USER NAME */}
        <Typography sx={{ mr: 2 }}>
          {currentUser?.name}
        </Typography>

        {/* LOGOUT */}
        <Button color="inherit" onClick={onLogout}>
          Logout
        </Button>

      </Toolbar>
    </AppBar>
  );
}
