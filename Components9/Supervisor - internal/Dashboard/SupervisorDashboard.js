/**
 * SupervisorDashboard.js
 * -----------------------------------------
 * Updated to include the new "Flows" tab.
 *
 * NOTE: Ensure 'setInActionPCBs' is passed from App.js!
 * We need it to update the data when a Bulk Flow is applied.
 */

import React, { useState } from "react";
import { Box } from "@mui/material";

// UI Components
import SupervisorHeader from "./SupervisorHeader";
import SupervisorTabs from "./SupervisorTabs";

// The 5 Tab Screens (Updated Imports)
// import InActionTab from "./tabs/InActionTab";       // <--- We will update this next
// import FlowsTab from "./tabs/FlowsTab";             // <--- Your NEW file
import OperatorsTab from "./OperatorsTab";
import CreateOperatorTab from "./CreateOperatorTab";
import CompletedTab from "./CompletedTab";
import InActionTab from "./InActionTab";
import FlowsTab from "./FlowsTab";
export default function SupervisorDashboard({
  onLogout,
  inActionPCBs = [],
  setInActionPCBs,
  onCreateOperator,
  handleAssignWork,
  operatorAccounts = [],
  operationsList = [] // <--- Received from App.js
}) {
  const [tabIndex, setTabIndex] = useState(0);

  // --- RESTORED MISSING STATE (Fixes Crash) ---
  const [newOperator, setNewOperator] = useState({ name: "", phone: "" });

  const handleCreateSubmit = () => {
    if (!newOperator.name || !newOperator.phone) {
      alert("Please enter both Name and Phone.");
      return;
    }
    const staffNumber = "OP" + Date.now().toString().slice(-4);
    const success = onCreateOperator(staffNumber, newOperator.name, "123");

    if (success) {
      alert(`Operator Created!\nStaff ID: ${staffNumber}`);
      setNewOperator({ name: "", phone: "" });
      setTabIndex(2); // Switch to Operators List
    }
  };
  // --------------------------------------------

  const tabs = [
    { label: "In-Action PCBs" },
    { label: "Flow Management" }, 
    { label: "Operators List" },
    { label: "Create Operator" },
    { label: "Completed PCBs" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", pb: 4 }}>
      <SupervisorHeader onLogout={onLogout} />

      <SupervisorTabs
        tabs={tabs}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />

      <Box sx={{ mt: 2 }}>
        
        {/* TAB 0: In-Action */}
        {tabIndex === 0 && (
          <InActionTab
            inActionPCBs={inActionPCBs}
            setInActionPCBs={setInActionPCBs}
            handleAssignWork={handleAssignWork}
          />
        )}

        {/* TAB 1: Flow Management */}
        {tabIndex === 1 && (
          <FlowsTab
            // We combine the standard list + any custom ones you might want to add later
            operations={operationsList} 
            operators={operatorAccounts}
          />
        )}

        {/* TAB 2: Operators List */}
        {tabIndex === 2 && (
          <OperatorsTab
            operators={operatorAccounts}
            handleOperatorSelect={(op) => alert(`Selected ${op.name}`)}
          />
        )}

        {/* TAB 3: Create Operator (FIXED) */}
        {tabIndex === 3 && (
          <CreateOperatorTab
            newOperator={newOperator}
            setNewOperator={setNewOperator}
            handleCreateOperator={handleCreateSubmit}
          />
        )}

        {/* TAB 4: Completed PCBs */}
        {tabIndex === 4 && (
          <CompletedTab completedPCBs={inActionPCBs} />
        )}
      </Box>
    </Box>
  );
}