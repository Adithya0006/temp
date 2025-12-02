/**
 * OperatorTabs.js
 * -----------------------------------------
 * This component displays the TOP TABS
 * for each operation assigned to the operator.
 *
 * Tabs are LOCKED if previous operation is not completed.
 */

import React from "react";
import { Tabs, Tab, Alert, Box } from "@mui/material";

export default function OperatorTabs({
  assignedOperations,
  activeTab,
  setActiveTab,
  isTabLocked,
  setLockedMessage,
}) {

  const handleTabChange = (e, idx) => {
    setActiveTab(idx);

    // If previous process is incomplete, show warning
    if (isTabLocked(idx)) {
      setLockedMessage("Previous process not completed!");
    } else {
      setLockedMessage(null);
    }
  };

  return (
    <Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {assignedOperations.map((op) => (
          <Tab
            key={op.sno}
            label={`${op.sno}. ${op.name}`}
          />
        ))}
      </Tabs>

    </Box>
  );
}
