import React, { useState, useEffect } from 'react';
import { Box, Button, AppBar, Toolbar, Typography, Container } from '@mui/material';
// import LoginPage from './LoginPage';
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


const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

// Default 40 operations — remains same
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

// Default operator accounts
const INITIAL_OPERATOR_ACCOUNTS = [
  { staffNumber: "54321", password: "operatorpassword", name: "Default Operator" },
  { staffNumber: "54322", password: "op2password", name: "Operator Jane" },
  { staffNumber: "54323", password: "op3password", name: "Operator Mike" },
];

// Load from localStorage
const getInitialState = (key, fallback) => {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [operatorAccounts, setOperatorAccounts] = useState(
    getInitialState("operatorAccounts", INITIAL_OPERATOR_ACCOUNTS)
  );

  const [inActionPCBs, setInActionPCBs] = useState(
    getInitialState("inActionPCBs", [])
  );

  const [viewingPCB, setViewingPCB] = useState(null);

  // persist operator accounts
  useEffect(() => {
    localStorage.setItem("operatorAccounts", JSON.stringify(operatorAccounts));
  }, [operatorAccounts]);

  // persist PCB list
  useEffect(() => {
    localStorage.setItem("inActionPCBs", JSON.stringify(inActionPCBs));
  }, [inActionPCBs]);

  // ----------------------------------------
  // LOGIN
  // ----------------------------------------
  const handleLogin = (user) => {
    setCurrentUser(user);
    setRole(user.role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setRole(null);
    setViewingPCB(null);
  };

  // ----------------------------------------
  // ADMIN → add PCBs
  // ----------------------------------------
  const addInActionPCBs = (newPCBs, pcbSerialKey) => {
    setInActionPCBs((prev) => {
      const key = pcbSerialKey || PCB_SERIAL_KEY_FALLBACK;

      const existing = new Set(prev.map((p) => p[key]));

      const uniqueNew = newPCBs
        .filter((p) => !existing.has(p[key]))
        .map((p) => ({
          ...p,
          isWorkAssigned: false,
          linkedOperations: DEFAULT_OPERATIONS_LIST.map((op) => ({
            ...op,
            assignedTo: [], // { staffNumber, name }
            status: "Not Started",
          })),
          _pcb_key_id: key,
        }));

      return [...prev, ...uniqueNew];
    });
  };

  // delete PCB
  const deleteInActionPCB = (serialNumber) => {
    setInActionPCBs((prev) =>
      prev.filter((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        return pcb[key] !== serialNumber;
      })
    );
  };

  // ----------------------------------------
  // SUPERVISOR → open assignment screen
  // ----------------------------------------
  const handleAssignWork = (serialNumber) => {
    const pcb = inActionPCBs.find((p) => {
      const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
      return p[key] === serialNumber;
    });

    if (!pcb) return alert("PCB not found!");

    // mark PCB as assigned
    setInActionPCBs((prev) =>
      prev.map((p) => {
        const key = p._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        if (p[key] === serialNumber) return { ...p, isWorkAssigned: true };
        return p;
      })
    );

    setViewingPCB(pcb);
  };

  // ----------------------------------------
  // SUPERVISOR → save final assignment
  // ----------------------------------------
  const handleFinalAssignmentSave = (serialNumber, assignedOperations) => {
    setInActionPCBs((prev) =>
      prev.map((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        if (pcb[key] === serialNumber) {
          return {
            ...pcb,
            linkedOperations: assignedOperations,
          };
        }
        return pcb;
      })
    );

    setViewingPCB(null);
    alert(`Assignments saved for PCB ${serialNumber}`);
  };

  // ----------------------------------------
  // OPERATOR → update PCB after completing ops
  // ----------------------------------------
  const updateInActionPCBs = (updater) => {
    if (typeof updater === "function") {
      setInActionPCBs((prev) => {
        const next = updater(prev);
        localStorage.setItem("inActionPCBs", JSON.stringify(next));
        return next;
      });
    } else {
      setInActionPCBs(updater);
      localStorage.setItem("inActionPCBs", JSON.stringify(updater));
    }
  };

  // ----------------------------------------
  // SUPERVISOR → create new operator
  // ----------------------------------------
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

  // ----------------------------------------
  // DASHBOARD ROUTING
  // ----------------------------------------
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

  // ----------------------------------------
  // MAIN RENDER
  // ----------------------------------------
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {isLoggedIn ? (
        renderDashboard()
      ) : (
        <Container maxWidth="lg">
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                NPTRM
              </Typography>
              <Button color="inherit">Help</Button>
            </Toolbar>
          </AppBar>

          <Box
            sx={{ pt: 4, display: "flex", justifyContent: "center" }}
          >
            <UnifiedLogin
              onLogin={handleLogin}
              operatorAccounts={operatorAccounts}
              dummyCreds={{
                admin: {
                  staffNumber: "12345",
                  password: "adminpassword",
                  name: "Admin",
                },
                "supervisor-internal": {
                  staffNumber: "98765",
                  password: "supervisorpassword",
                  name: "Supervisor Internal",
                },
                "supervisor-external": {
                  staffNumber: "88888",
                  password: "supervisorexternal",
                  name: "Supervisor External",
                },
                operator: {
                  staffNumber: "54321",
                  password: "operatorpassword",
                  name: "Operator",
                },
              }}
            />
          </Box>
        </Container>
      )}
    </Box>
  );
}