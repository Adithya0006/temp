/**
 * SupervisorTabs.js
 * -----------------------------------------
 * This component renders the TAB navigation
 * for Supervisor Dashboard.
 *
 * It switches between views:
 * - In-Action PCBs
 * - Operators
 * - Create Operator
 * - Completed
 */

import React from "react";
import { Paper, Tabs, Tab } from "@mui/material";

export default function SupervisorTabs({
  tabs,
  tabIndex,
  setTabIndex
}) {
  return (
    <Paper sx={{ mt: 2, mx: 2, borderRadius: 1 }} elevation={0}>
      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ bgcolor: "#fafafa", borderBottom: "1px solid #eee", px: 2 }}
      >
        {tabs.map((t) => (
          <Tab
            key={t.label}
            label={t.label}
            sx={{ textTransform: "none" }}
          />
        ))}
      </Tabs>
    </Paper>
  );
}
