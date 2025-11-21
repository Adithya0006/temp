import React, { useState, useEffect } from 'react';
import { Box, Button, AppBar, Toolbar, Typography, Container } from '@mui/material';
// import LoginPage from './LoginPage';
import bgImage from "../../src/Test/background.jpg";
import LoginPage from './Admin/Login.component';
// import OperatorLoginPage from './OperatorLoginPage';
import OperatorLoginPage from './Operator/Login';
// import SupervisorLoginPage from './SupervisorLoginPage';
import SupervisorLoginPage from './Supervisor - internal/Login';
// import AdminDashboard from './AdminDashboard';
import AdminDashboard from './Admin/Dashboard';
// import SupervisorDashboard from './SupervisorDashboard';
import SupervisorDashboard from './Supervisor - internal/Dashboard';
// import AssignmentEditor from './AssignmentEditor';
// import AssignmentEditor from './Supervisor - internal/Assignement';
import NewAssignmentEditor from './Supervisor - internal/Assignement'
// import EmptyDashboard from './EmptyDashboard';
import EmptyDashboard from './Operator/Dashboard';
import UnifiedLogin from './UnifiedLogin';
import SupervisorExternalDashboard from './Supervisor - External/Dashboard';
import OperatorDashboard from './Operator/Dashboard';

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
  { staffNumber: "op3", password: "123", name: "Operator Three" }
];

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

export default function App() {

  // ---------------------------
  // LOGIN STATES
  // ---------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ---------------------------
  // Operators (dummy)
  // ---------------------------
  const [operatorAccounts, setOperatorAccounts] = useState(INITIAL_OPERATOR_ACCOUNTS);

  // ---------------------------
  // GLOBAL PCB STATES (IMPORTANT UPDATE)
  // ---------------------------
  const [masterList, setMasterList] = useState([]);     // ← moved from AdminDashboard
  const [inActionList, setInActionList] = useState([]); // ← moved from AdminDashboard

  const [inActionPCBs, setInActionPCBs] = useState([]); // Supervisor/Operator work list
  const [viewingPCB, setViewingPCB] = useState(null);

  // ---------------------------
  // LOGIN / LOGOUT
  // ---------------------------
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setRole(user.role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    // NOTE: WE DO NOT CLEAR masterList/inActionList/inActionPCBs
    // BECAUSE YOU WANT THEM TO PERSIST UNTIL FULL PAGE REFRESH
  };

  // ---------------------------
  // ADMIN: Add PCB to In-Action
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
  // SUPERVISOR: Assign work
  // ---------------------------
  const handleAssignWork = (serialNumber) => {
    const pcb = inActionPCBs.find((p) => {
      const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
      return p[key] === serialNumber;
    });

    if (!pcb) return alert("PCB not found!");

    setInActionPCBs((prev) =>
      prev.map((p) => {
        const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        return p[key] === serialNumber ? { ...p, isWorkAssigned: true } : p;
      })
    );

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

  // OPERATOR updating progress
  const updateInActionPCBs = (updater) => {
    if (typeof updater === "function") {
      setInActionPCBs((prev) => updater(prev));
    } else {
      setInActionPCBs(updater);
    }
  };

  // ---------------------------
  // SUPERVISOR: Create operator
  // ---------------------------
  const createOperatorAccount = (staffNumber, name, password) => {
    if (operatorAccounts.some((op) => op.staffNumber === staffNumber)) {
      alert("Staff number already exists!");
      return false;
    }
    setOperatorAccounts((prev) => [...prev, { staffNumber, name, password }]);
    return true;
  };

  // ---------------------------
  // DASHBOARD ROUTER
  // ---------------------------
  const renderDashboard = () => {
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

    switch (role) {
      case "admin":
        return (
          <AdminDashboard
            onLogout={handleLogout}
            addInActionPCBs={addInActionPCBs}
            deleteInActionPCB={deleteInActionPCB}

            // IMPORTANT: PASS GLOBAL STATES
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
  // RENDER
  // ---------------------------
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {isLoggedIn ? (
        renderDashboard()
      ) : (
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
    flexDirection: "column"
  }}
>
            <UnifiedLogin
              onLogin={handleLogin}
              operatorAccounts={operatorAccounts}
              dummyCreds={{
                admin: [
                  { staffNumber: "admin", password: "123", name: "Admin" },
                  { staffNumber: "AD01", password: "123", name: "Admin 2" }
                ],
                "supervisor-internal": [
                  { staffNumber: "sup1", password: "123", name: "Sup Internal" },
                  { staffNumber: "SI01", password: "123", name: "Supervisor Internal 2" }
                ],
                "supervisor-external": [
                  { staffNumber: "sup2", password: "123", name: "Sup External" },
                  { staffNumber: "SE01", password: "123", name: "Supervisor External 2" }
                ],
                operator: [
                  { staffNumber: "op1", password: "123", name: "Operator One" },
                  { staffNumber: "op2", password: "123", name: "Operator Two" },
                  { staffNumber: "OP01", password: "123", name: "Operator Three" }
                ]
              }}
            />

          </Box>
        </Container>
      )}
    </Box>
  );
}