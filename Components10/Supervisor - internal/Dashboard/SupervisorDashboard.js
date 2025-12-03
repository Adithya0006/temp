/**
 * SupervisorDashboard.js (FINAL INTEGRATED VERSION)
 * -----------------------------------------
 * Features:
 * 1. 5-Tab Navigation.
 * 2. In-Action PCBs with Bulk Flow Application.
 * 3. Flow Management with LIVE SYNC (Updates PCBs when flow changes).
 * 4. Create Operator (Staff ID + Password only).
 * 5. Operators List & Completed View.
 */

import React, { useState } from "react";
import { Box } from "@mui/material";

// UI Components
import SupervisorHeader from "./SupervisorHeader";
import SupervisorTabs from "./SupervisorTabs";

// The 5 Tab Screens
import InActionTab from "./InActionTab";
import FlowsTab from "./FlowsTab";
import OperatorsTab from "./OperatorsTab";
import CreateOperatorTab from "./CreateOperatorTab";
import CompletedTab from "./CompletedTab";

// export default function SupervisorDashboard({
//   onLogout,
//   inActionPCBs = [],
//   setInActionPCBs,      // Required for Bulk Apply & Sync Engine
//   onCreateOperator,     // Function to add new user
//   handleAssignWork,     // Function to open Manual Editor
//   operatorAccounts = [],
//   operationsList = []   // Master list of 40 operations
// }) {
//   const [tabIndex, setTabIndex] = useState(0);

//   // --- STATE: CREATE OPERATOR ---
//   const [newOperator, setNewOperator] = useState({ 
//     staffNumber: "", 
//     password: "" 
//   });

//   // --- HANDLER: CREATE OPERATOR ---
//   const handleCreateSubmit = () => {
//     // 1. Validation
//     if (!newOperator.staffNumber || !newOperator.password) {
//       alert("Please enter both Staff Number and Password.");
//       return;
//     }

//     // 2. Auto-generate Name (since input was removed)
//     const generatedName = `Operator ${newOperator.staffNumber}`;

//     // 3. Call Parent Function
//     const success = onCreateOperator(
//       newOperator.staffNumber, 
//       generatedName, 
//       newOperator.password
//     );

//     if (success) {
//       alert(`Operator Created Successfully!\nStaff ID: ${newOperator.staffNumber}`);
//       setNewOperator({ staffNumber: "", password: "" }); // Reset Form
//       setTabIndex(2); // Switch to "Operators List" tab to see result
//     }
//   };

//   // --- 🔥 HANDLER: LIVE FLOW SYNC ENGINE ---
//   // This is called by FlowsTab when a flow is edited & saved.
//   const handleFlowSync = (updatedFlow) => {
    
//     console.log("Syncing Flow:", updatedFlow.name, "ID:", updatedFlow.id);

//     setInActionPCBs(prevPCBs => prevPCBs.map(pcb => {
      
//       // 1. Check if this PCB is tagged with the updated flow's ID
//       // (This ensures we only update PCBs that are actually using this flow)
//       if (pcb.assignedFlowId === updatedFlow.id) {
        
//         // 2. Map the NEW steps from the updated flow
//         const newOps = updatedFlow.steps.map(step => {
          
//           // 3. Search for an existing step in the PCB to preserve its status
//           // We match by 'sno' (Step ID) to ensure we don't reset "Completed" work.
//           const existingStep = (pcb.linkedOperations || []).find(oldOp => 
//             String(oldOp.sno || oldOp["S.No"]) === String(step.opId)
//           );

//           return {
//             // NEW DATA (From the Flow Update)
//             sno: step.opId,
//             name: step.opName,
//             assignedTo: step.assignedStaff.map(s => s.id), // Updates the operators
            
//             // PRESERVED DATA (From the existing PCB progress)
//             // If the step existed before, keep its status. If it's brand new, set "Not Started".
//             status: existingStep ? existingStep.status : "Not Started",
//             startTime: existingStep ? existingStep.startTime : null,
//             endTime: existingStep ? existingStep.endTime : null,
//           };
//         });

//         // Return the PCB with the updated operations list
//         return { ...pcb, linkedOperations: newOps };
//       }

//       // If PCB is not using this flow, leave it alone
//       return pcb;
//     }));

//     // Optional: Visual Feedback
//     alert(`Global Update Complete: All PCBs following "${updatedFlow.name}" have been synchronized.`);
//   };

//   // --- TABS CONFIG ---
//   const tabs = [
//     { label: "In-Action PCBs" },
//     { label: "Flow Management" }, 
//     { label: "Operators List" },
//     { label: "Create Operator" },
//     { label: "Completed PCBs" },
//   ];

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", pb: 4 }}>
//       {/* 1. HEADER */}
//       <SupervisorHeader onLogout={onLogout} />

//       {/* 2. TABS NAVIGATION */}
//       <SupervisorTabs
//         tabs={tabs}
//         tabIndex={tabIndex}
//         setTabIndex={setTabIndex}
//       />

//       {/* 3. MAIN CONTENT AREA */}
//       <Box sx={{ mt: 2 }}>
        
//         {/* TAB 0: In-Action (Bulk Apply) */}
//         {tabIndex === 0 && (
//           <InActionTab
//             inActionPCBs={inActionPCBs}
//             setInActionPCBs={setInActionPCBs}
//             handleAssignWork={handleAssignWork}
//           />
//         )}

//         {/* TAB 1: Flow Management (CRUD + Sync) */}
//         {tabIndex === 1 && (
//           <FlowsTab
//             operations={operationsList} 
//             operators={operatorAccounts}
//             onFlowUpdate={handleFlowSync} // <--- Passed down for Sync Engine
//           />
//         )}

//         {/* TAB 2: Operators List */}
//         {tabIndex === 2 && (
//           <OperatorsTab
//             operators={operatorAccounts}
//             handleOperatorSelect={(op) => alert(`Selected ${op.name}`)}
//           />
//         )}

//         {/* TAB 3: Create Operator (Simplified) */}
//         {tabIndex === 3 && (
//           <CreateOperatorTab
//             newOperator={newOperator}
//             setNewOperator={setNewOperator}
//             handleCreateOperator={handleCreateSubmit}
//           />
//         )}

//         {/* TAB 4: Completed PCBs */}
//         {tabIndex === 4 && (
//           <CompletedTab completedPCBs={inActionPCBs} />
//         )}
//       </Box>
//     </Box>
//   );
// }




































export default function SupervisorDashboard({
  onLogout,
  inActionPCBs = [],
  setInActionPCBs,
  onCreateOperator,
  handleAssignWork,
  operatorAccounts = [],
  operationsList = [] 
}) {
  const [tabIndex, setTabIndex] = useState(0);

  // --- STATE: CREATE OPERATOR (Included 'name') ---
  const [newOperator, setNewOperator] = useState({ 
    staffNumber: "", 
    name: "",       // <--- ADDED BACK
    password: "" 
  });

  // --- HANDLER: CREATE OPERATOR ---
  const handleCreateSubmit = () => {
    // 1. Validation
    if (!newOperator.staffNumber || !newOperator.name || !newOperator.password) {
      alert("Please enter Staff Number, Name, and Password.");
      return;
    }

    // 2. Call Parent Function
    const success = onCreateOperator(
      newOperator.staffNumber, 
      newOperator.name, // <--- Use manual name
      newOperator.password
    );

    if (success) {
      alert(`Operator Created Successfully!\nName: ${newOperator.name}\nID: ${newOperator.staffNumber}`);
      setNewOperator({ staffNumber: "", name: "", password: "" }); // Reset Form
      setTabIndex(2); // Switch to "Operators List" tab
    }
  };

  // --- 🔥 HANDLER: LIVE FLOW SYNC ENGINE (Kept same as before) ---
  const handleFlowSync = (updatedFlow) => {
    setInActionPCBs(prevPCBs => prevPCBs.map(pcb => {
      if (pcb.assignedFlowId === updatedFlow.id) {
        const newOps = updatedFlow.steps.map(step => {
          const existingStep = (pcb.linkedOperations || []).find(oldOp => 
            String(oldOp.sno || oldOp["S.No"]) === String(step.opId)
          );
          return {
            sno: step.opId,
            name: step.opName,
            assignedTo: step.assignedStaff.map(s => s.id), 
            status: existingStep ? existingStep.status : "Not Started",
            startTime: existingStep ? existingStep.startTime : null,
            endTime: existingStep ? existingStep.endTime : null,
          };
        });
        return { ...pcb, linkedOperations: newOps };
      }
      return pcb;
    }));
    alert(`Global Update: All PCBs using flow "${updatedFlow.name}" have been synchronized!`);
  };

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
      <SupervisorTabs tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />

      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && (
          <InActionTab
            inActionPCBs={inActionPCBs}
            setInActionPCBs={setInActionPCBs}
            handleAssignWork={handleAssignWork}
          />
        )}
        {tabIndex === 1 && (
          <FlowsTab
            operations={operationsList} 
            operators={operatorAccounts}
            onFlowUpdate={handleFlowSync}
          />
        )}
        {tabIndex === 2 && (
          <OperatorsTab
            operators={operatorAccounts}
            handleOperatorSelect={(op) => alert(`Selected ${op.name}`)}
          />
        )}
        {tabIndex === 3 && (
          <CreateOperatorTab
            newOperator={newOperator}
            setNewOperator={setNewOperator}
            handleCreateOperator={handleCreateSubmit}
          />
        )}
        {tabIndex === 4 && (
          <CompletedTab completedPCBs={inActionPCBs} />
        )}
      </Box>
    </Box>
  );
}