import React, { useState } from "react";
import { Box, Container } from "@mui/material";

// Background image
import bgImage from "../Components9/background.jpg";
import OperatorDashboard from "./Operator/Dashboard/OperatorDashboard";
// Dashboards
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
// import SupervisorDashboard from "./Supervisor - internal/Dashboard"; // Ensure this points to your SupervisorDashboard.js
import SupervisorExternalDashboard from "./Supervisor - External/Dashboard";
// import OperatorDashboard from "./Operator/Dashboard";
import SupervisorDashboard from "./Supervisor - internal/Dashboard/SupervisorDashboard";
// Supervisor assignment editor (Kept for manual edits on single PCBs)
import NewAssignmentEditor from "./Supervisor - internal/Assignement";

// Unified login
import UnifiedLogin from "./UnifiedLogin";

// 40 operations (Standard Industry List)
const DEFAULT_OPERATIONS_LIST = [
  { "S.No": "1", "Operation Name": "Labeling & Traceability of Bare PCB", status: "Not Started" },
  { "S.No": "2", "Operation Name": "Cleaning of Bare PCB", status: "Not Started" },
  { "S.No": "3", "Operation Name": "Baking of Bare PCB", status: "Not Started" },
  { "S.No": "4", "Operation Name": "Preparation / Screen Printing / SPI for Top Side", status: "Not Started" },
  { "S.No": "5", "Operation Name": "SMT Loading / Pick n Place / Unloading for Top Side", status: "Not Started" },
  { "S.No": "6", "Operation Name": "Reflow for Top Side", status: "Not Started" },
  { "S.No": "7", "Operation Name": "X-Ray & AOI for First PCB Top Side", status: "Not Started" },
  { "S.No": "8", "Operation Name": "Application of Amicon D125 FS DR", status: "Not Started" },
  { "S.No": "9", "Operation Name": "Preparation / Screen Printing / SPI for Bottom Side", status: "Not Started" },
  { "S.No": "10", "Operation Name": "SMT Loading / Pick n Place / Unloading for Bottom Side", status: "Not Started" },
  { "S.No": "11", "Operation Name": "Reflow for Bottom Side", status: "Not Started" },
  { "S.No": "12", "Operation Name": "X-Ray & AOI for First PCB Bottom Side", status: "Not Started" },
  { "S.No": "13", "Operation Name": "Traceability of BGA & Circulators", status: "Not Started" },
  { "S.No": "14", "Operation Name": "Cleaning of PCBA", status: "Not Started" },
  { "S.No": "15", "Operation Name": "AOI", status: "Not Started" },
  { "S.No": "16", "Operation Name": "X-Ray Inspection", status: "Not Started" },
  { "S.No": "17", "Operation Name": "Ersascope Inspection", status: "Not Started" },
  { "S.No": "18", "Operation Name": "Visual Inspection", status: "Not Started" },
  { "S.No": "19", "Operation Name": "AOI Correction / Rework", status: "Not Started" },
  { "S.No": "20", "Operation Name": "Cleaning of PCBA", status: "Not Started" },
  { "S.No": "21", "Operation Name": "Visual Inspection After Rework", status: "Not Started" },
  { "S.No": "22", "Operation Name": "HSTT", status: "Not Started" },
  { "S.No": "23", "Operation Name": "Fly Probe Test (FPT)", status: "Not Started" },
  { "S.No": "24", "Operation Name": "Connector Assembly", status: "Not Started" },
  { "S.No": "25", "Operation Name": "X-Ray via Filling of Connectors", status: "Not Started" },
  { "S.No": "26", "Operation Name": "Cleaning After Connector Assembly", status: "Not Started" },
  { "S.No": "27", "Operation Name": "Contamination Check", status: "Not Started" },
  { "S.No": "28", "Operation Name": "Masking", status: "Not Started" },
  { "S.No": "29", "Operation Name": "Conformal Coating", status: "Not Started" },
  { "S.No": "30", "Operation Name": "De Masking", status: "Not Started" },
  { "S.No": "31", "Operation Name": "Adhesion Test", status: "Not Started" },
  { "S.No": "32", "Operation Name": "Canon Prep", status: "Not Started" },
  { "S.No": "33", "Operation Name": "Intermediate Control", status: "Not Started" },
  { "S.No": "34", "Operation Name": "Cover Mounting & Braking of Screws", status: "Not Started" },
  { "S.No": "35", "Operation Name": "HASS", status: "Not Started" },
  { "S.No": "36", "Operation Name": "ATE1", status: "Not Started" },
  { "S.No": "37", "Operation Name": "ATE2", status: "Not Started" },
  { "S.No": "38", "Operation Name": "EMI Shield Mounting", status: "Not Started" },
  { "S.No": "39", "Operation Name": "Final Control", status: "Not Started" },
  { "S.No": "40", "Operation Name": "Clearance Control", status: "Not Started" },
];

// Initial dummy operators
const INITIAL_OPERATOR_ACCOUNTS = [
  { staffNumber: "op1", password: "123", name: "Operator One" },
  { staffNumber: "op2", password: "123", name: "Operator Two" },
  { staffNumber: "op3", password: "123", name: "Operator Three" },
];

// Fallback key if backend doesn't provide one
const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

export default function App() {
  // ---------------------------
  // LOGIN STATE
  // ---------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // "admin" | "supervisor" | "supervisor-external" | "operator"
  const [currentUser, setCurrentUser] = useState(null);

  // ---------------------------
  // OPERATOR ACCOUNTS (DUMMY)
  // ---------------------------
  const [operatorAccounts, setOperatorAccounts] = useState(
    INITIAL_OPERATOR_ACCOUNTS
  );

  // ---------------------------
  // GLOBAL PCB STATE
  // (SHARED BETWEEN ADMIN / SUPERVISOR / OPERATOR)
  // ---------------------------
  const [masterList, setMasterList] = useState([]); // Admin master table
  const [inActionList, setInActionList] = useState([]); // Admin in-action list (legacy)

  // This is the MAIN working list for Supervisors & Operators
  const [inActionPCBs, setInActionPCBs] = useState([]); 

  // If this is set, the Supervisor sees the Assignment Editor instead of the Dashboard
  const [viewingPCB, setViewingPCB] = useState(null); 

  // ---------------------------
  // LOGIN / LOGOUT HANDLERS
  // ---------------------------
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setRole(user.role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setRole(null);
    // Data (masterList, inActionPCBs) remains in memory until page refresh
  };

  // ---------------------------
  // ADMIN: MOVE PCBs TO IN-ACTION
  // ---------------------------
  const addInActionPCBs = (newPCBs, serialKey) => {
  setInActionPCBs((prev) => {
    const key = serialKey || PCB_SERIAL_KEY_FALLBACK;
    const existing = new Set(prev.map((p) => p[key]));

    const uniqueNew = newPCBs
      .filter((p) => !existing.has(p[key]))
      .map((p) => ({
        ...p,
        isWorkAssigned: false,
        // FIX: Start with EMPTY operations.
        // We wait for the Supervisor to "Apply a Flow" later.
        linkedOperations: [], 
        _pcb_key_id: key,
      }));

    return [...prev, ...uniqueNew];
  });
};

  const deleteInActionPCB = (serialNumber) => {
    setInActionPCBs((prev) =>
      prev.filter((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        return pcb[key] !== serialNumber;
      })
    );
  };

  // ---------------------------
  // SUPERVISOR: OPEN MANUAL ASSIGNMENT EDITOR
  // ---------------------------
  // This is called when Supervisor clicks "Assign/Edit" on a specific PCB
  const handleAssignWork = (serialNumber) => {
    const pcb = inActionPCBs.find((p) => {
      const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
      return p[key] === serialNumber;
    });

    if (!pcb) return alert("PCB not found!");

    // Mark as "work assigned" so it doesn't get picked up by future bulk flows accidentally
    setInActionPCBs((prev) =>
      prev.map((p) => {
        const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        return p[key] === serialNumber ? { ...p, isWorkAssigned: true } : p;
      })
    );

    // Switch view to the Editor
    setViewingPCB(pcb);
  };

  // Saves the manual edits from NewAssignmentEditor
  const handleFinalAssignmentSave = (serialNumber, assignedOperations) => {
    setInActionPCBs((prev) =>
      prev.map((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        return pcb[key] === serialNumber
          ? { ...pcb, linkedOperations: assignedOperations }
          : pcb;
      })
    );

    setViewingPCB(null); // Go back to Dashboard
    alert(`Assignments saved for PCB ${serialNumber}`);
  };

  // ---------------------------
  // OPERATOR: UPDATE PCB PROGRESS
  // ---------------------------
  const updateInActionPCBs = (updater) => {
    if (typeof updater === "function") {
      setInActionPCBs((prev) => updater(prev));
    } else {
      setInActionPCBs(updater);
    }
  };

  // ---------------------------
  // SUPERVISOR: CREATE OPERATOR ACCOUNT
  // ---------------------------
  const createOperatorAccount = (staffNumber, name, password) => {
    if (operatorAccounts.some((op) => op.staffNumber === staffNumber)) {
      alert("Staff number already exists!");
      return false;
    }
    setOperatorAccounts((prev) => [
      ...prev,
      { staffNumber, name, password },
    ]);
    return true;
  };

  // ======================================================
  //            ROLE-BASED "ROUTING"
  // ======================================================
  const renderDashboard = () => {
    // 1. Check if Supervisor is currently editing a single PCB manually
    if (role === "supervisor" && viewingPCB) {
      return (
        <NewAssignmentEditor
          pcb={viewingPCB}
          operators={operatorAccounts}
          onSave={handleFinalAssignmentSave}
          onCancel={() => setViewingPCB(null)}
          onLogout={handleLogout}
        />
      );
    }

    // 2. Otherwise, show the main dashboard for the role
    switch (role) {
      case "admin":
        return (
          <AdminDashboard
            onLogout={handleLogout}
            addInActionPCBs={addInActionPCBs}
            deleteInActionPCB={deleteInActionPCB}
            masterList={masterList}
            setMasterList={setMasterList}
            inActionList={inActionList}
            setInActionList={setInActionList}
          />
        );

      case "supervisor":
        return (
          <SupervisorDashboard
            onLogout={handleLogout}
            inActionPCBs={inActionPCBs}
            
            // *** CRITICAL UPDATE ***
            // Pass setInActionPCBs so "Flows" can be bulk applied inside the dashboard
            setInActionPCBs={setInActionPCBs}
            
            onCreateOperator={createOperatorAccount}
            handleAssignWork={handleAssignWork} // Opens the manual editor
            operatorAccounts={operatorAccounts}
            operationsList={DEFAULT_OPERATIONS_LIST}
          />
        );

      case "supervisor-external":
        return (
          <SupervisorExternalDashboard
            onLogout={handleLogout}
            inActionPCBs={inActionPCBs}
          />
        );

      case "operator":
        return (
          <OperatorDashboard
            onLogout={handleLogout}
            currentUser={currentUser}
            inActionPCBs={inActionPCBs}
            updateInActionPCBs={updateInActionPCBs}
          />
        );

      default:
        return null;
    }
  };

  // ---------------------------
  // APP ROOT RENDER
  // ---------------------------
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {isLoggedIn ? (
        // Render Dashboard or Editor
        renderDashboard()
      ) : (
        // Login Screen
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            width: "100%",
            padding: 0,
          }}
        >
          <Box
            sx={{
              minHeight: "100vh",
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <UnifiedLogin
              onLogin={handleLogin}
              operatorAccounts={operatorAccounts}
              dummyCreds={{
                admin: [
                  { staffNumber: "admin", password: "123", name: "Admin" },
                  { staffNumber: "AD01", password: "123", name: "Admin 2" },
                ],
                "supervisor-internal": [
                  { staffNumber: "sup1", password: "123", name: "Sup Internal" },
                  {
                    staffNumber: "SI01",
                    password: "123",
                    name: "Supervisor Internal 2",
                  },
                ],
                "supervisor-external": [
                  { staffNumber: "sup2", password: "123", name: "Sup External" },
                  {
                    staffNumber: "SE01",
                    password: "123",
                    name: "Supervisor External 2",
                  },
                ],
                operator: [
                  { staffNumber: "op1", password: "123", name: "Operator One" },
                  { staffNumber: "op2", password: "123", name: "Operator Two" },
                  {
                    staffNumber: "OP01",
                    password: "123",
                    name: "Operator Three",
                  },
                ],
              }}
            />
          </Box>
        </Container>
      )}
    </Box>
  );
}