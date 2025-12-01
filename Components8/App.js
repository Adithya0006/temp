import React, { useState } from "react";
import { Box, Container } from "@mui/material";

// Background image
import bgImage from "../Components8/background.jpg";

// Old individual login screens (not used now, but kept for reference)
// import LoginPage from "./Admin/Login.component";
// import OperatorLoginPage from "./Operator/Login";
// import SupervisorLoginPage from "./Supervisor - internal/Login";

// Dashboards
// import AdminDashboard from "./Admin/Dashboard";
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
import SupervisorDashboard from "./Supervisor - internal/Dashboard";
import SupervisorExternalDashboard from "./Supervisor - External/Dashboard";
import OperatorDashboard from "./Operator/Dashboard";

// Supervisor assignment editor (old internal screen)
import NewAssignmentEditor from "./Supervisor - internal/Assignement";

// Unified login that you’re using now
import UnifiedLogin from "./UnifiedLogin";

// 40 operations (unchanged)
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

const INITIAL_OPERATOR_ACCOUNTS = [
  { staffNumber: "op1", password: "123", name: "Operator One" },
  { staffNumber: "op2", password: "123", name: "Operator Two" },
  { staffNumber: "op3", password: "123", name: "Operator Three" },
];

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
  const [inActionList, setInActionList] = useState([]); // Admin in-action list

  const [inActionPCBs, setInActionPCBs] = useState([]); // Supervisor / Operator worklist
  const [viewingPCB, setViewingPCB] = useState(null); // For supervisor assignment screen

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
    // NOTE:
    // We DO NOT clear masterList / inActionList / inActionPCBs here
    // so that data survives until full page refresh.
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
          linkedOperations: DEFAULT_OPERATIONS_LIST.map((op) => ({
            ...op,
            assignedTo: [],
            status: "Not Started",
          })),
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
  // SUPERVISOR: OPEN ASSIGNMENT EDITOR
  // ---------------------------
  const handleAssignWork = (serialNumber) => {
    const pcb = inActionPCBs.find((p) => {
      const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
      return p[key] === serialNumber;
    });

    if (!pcb) return alert("PCB not found!");

    // Mark as "work assigned" for that PCB
    setInActionPCBs((prev) =>
      prev.map((p) => {
        const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        return p[key] === serialNumber ? { ...p, isWorkAssigned: true } : p;
      })
    );

    // Show assignment editor
    setViewingPCB(pcb);
  };

  const handleFinalAssignmentSave = (serialNumber, assignedOperations) => {
    setInActionPCBs((prev) =>
      prev.map((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        return pcb[key] === serialNumber
          ? { ...pcb, linkedOperations: assignedOperations }
          : pcb;
      })
    );

    setViewingPCB(null);
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
  //            ROLE-BASED "ROUTING" (NO REACT-ROUTER)
  // ======================================================
  const renderDashboard = () => {
    // Special case: supervisor opened assignment editor for a PCB
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

    // Normal role-based dashboards
    switch (role) {
      case "admin":
        return (
          <AdminDashboard
            onLogout={handleLogout}
            addInActionPCBs={addInActionPCBs}
            deleteInActionPCB={deleteInActionPCB}
            // Global states
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
            onCreateOperator={createOperatorAccount}
            handleAssignWork={handleAssignWork}
            operatorAccounts={operatorAccounts}
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
        // After login → show dashboard based on role
        renderDashboard()
      ) : (
        // Before login → full-screen background + unified login
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
