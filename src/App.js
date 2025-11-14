import React, { useState,useEffect } from 'react';
import LoginPage from './Components1/Admin/Login.component';
import OperatorLoginPage from './Components1/Operator/Login';
// import EmptyDashboard from './Components1/Admin/Dashboard';
import AdminDashboard from './Components1/Admin/Dashboard';
import OperatorDashboard from './Components1/Operator/Dashboard';
import './App.css'; 
import SupervisorDashboard from './Components1/Supervisor - internal/Dashboard';
import SupervisorLoginPage from './Components1/Supervisor - internal/Login';
import AssignmentEditor from './Components1/Supervisor - internal/Assignement';
// --- Configuration Constants ---
const PCB_SERIAL_KEY_FALLBACK = 'PCB Serial Number'; 

// --- MANDATORY OPERATIONS LIST (40 items) ---
const DEFAULT_OPERATIONS_LIST = [
    { "S.No": "1", "Operation Name": "Labeling & Traceability of Bare PCB", "Status": "Not Started" },
    { "S.No": "2", "Operation Name": "Cleaning of Bare PCB", "Status": "Not Started" },
    { "S.No": "3", "Operation Name": "Baking of Bare PCB", "Status": "Not Started" },
    { "S.No": "4", "Operation Name": "Preparation / Screen Printing / SPI for Top Side", "Status": "Not Started" },
    { "S.No": "5", "Operation Name": "SMT Loading / Pick n Place / Unloading for Top Side", "Status": "Not Started" },
    { "S.No": "6", "Operation Name": "Reflow for Top Side", "Status": "Not Started" },
    { "S.No": "7", "Operation Name": "X-Ray & AOI for First PCB Top Side", "Status": "Not Started" },
    { "S.No": "8", "Operation Name": "Application of Amicon D125 FS DR", "Status": "Not Started" },
    { "S.No": "9", "Operation Name": "Preparation / Screen Printing / SPI for Bottom Side", "Status": "Not Started" },
    { "S.No": "10", "Operation Name": "SMT Loading / Pick n Place / Unloading for Bottom Side", "Status": "Not Started" },
    { "S.No": "11", "Operation Name": "Reflow for Bottom Side", "Status": "Not Started" },
    { "S.No": "12", "Operation Name": "X-Ray & AOI for First PCB Bottom Side", "Status": "Not Started" },
    { "S.No": "13", "Operation Name": "Traceability of BGA & Circulators", "Status": "Not Started" },
    { "S.No": "14", "Operation Name": "Cleaning of PCBA", "Status": "Not Started" },
    { "S.No": "15", "Operation Name": "AOI", "Status": "Not Started" },
    { "S.No": "16", "Operation Name": "X-Ray Inspection", "Status": "Not Started" },
    { "S.No": "17", "Operation Name": "Ersascope Inspection", "Status": "Not Started" },
    { "S.No": "18", "Operation Name": "Visual Inspection", "Status": "Not Started" },
    { "S.No": "19", "Operation Name": "AOI Correction / Rework", "Status": "Not Started" },
    { "S.No": "20", "Operation Name": "Cleaning of PCBA", "Status": "Not Started" },
    { "S.No": "21", "Operation Name": "Visual Inspection After Rework", "Status": "Not Started" },
    { "S.No": "22", "Operation Name": "HSTT", "Status": "Not Started" },
    { "S.No": "23", "Operation Name": "Fly Probe Test (FPT)", "Status": "Not Started" },
    { "S.No": "24", "Operation Name": "Connector Assembly", "Status": "Not Started" },
    { "S.No": "25", "Operation Name": "X-Ray via Filling of Connectors", "Status": "Not Started" },
    { "S.No": "26", "Operation Name": "Cleaning After Connector Assembly", "Status": "Not Started" },
    { "S.No": "27", "Operation Name": "Contamination Check", "Status": "Not Started" },
    { "S.No": "28", "Operation Name": "Masking", "Status": "Not Started" },
    { "S.No": "29", "Operation Name": "Conformal Coating", "Status": "Not Started" },
    { "S.No": "30", "Operation Name": "De Masking", "Status": "Not Started" },
    { "S.No": "31", "Operation Name": "Adhesion Test", "Status": "Not Started" },
    { "S.No": "32", "Operation Name": "Canon Prep", "Status": "Not Started" },
    { "S.No": "33", "Operation Name": "Intermediate Control", "Status": "Not Started" },
    { "S.No": "34", "Operation Name": "Cover Mounting & Braking of Screws", "Status": "Not Started" },
    { "S.No": "35", "Operation Name": "HASS", "Status": "Not Started" },
    { "S.No": "36", "Operation Name": "ATE1", "Status": "Not Started" },
    { "S.No": "37", "Operation Name": "ATE2", "Status": "Not Started" },
    { "S.No": "38", "Operation Name": "EMI Shield Mounting", "Status": "Not Started" },
    { "S.No": "39", "Operation Name": "Final Control", "Status": "Not Started" },
    { "S.No": "40", "Operation Name": "Clearance Control", "Status": "Not Started" },
];

const DUMMY_CREDENTIALS = {
  admin: { staff_number: '12345', password: 'adminpassword' },
  supervisor: { staff_number: '98765', password: 'supervisorpassword' },
};
const INITIAL_OPERATOR_ACCOUNTS = [
    { staff_number: '54321', password: 'operatorpassword', name: 'Default Operator' },
    { staff_number: '54322', password: 'op2password', name: 'Operator Jane' },
    { staff_number: '54323', password: 'op3password', name: 'Operator Mike' },
];


// Helper function to safely get initial state from localStorage
const getInitialState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Could not parse localStorage key "${key}"`, e);
        }
    }
    return defaultValue;
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('admin');
  
  // Initialize states from Local Storage
  const [operatorAccounts, setOperatorAccounts] = useState(
      getInitialState('operatorAccounts', INITIAL_OPERATOR_ACCOUNTS)
  );
  const [inActionPCBs, setInActionPCBs] = useState(
      getInitialState('inActionPCBs', [])
  );
  const [viewingPCB, setViewingPCB] = useState(null); 


  // Use useEffect to sync data to Local Storage whenever it changes
  useEffect(() => {
    localStorage.setItem('operatorAccounts', JSON.stringify(operatorAccounts));
  }, [operatorAccounts]);

  useEffect(() => {
    localStorage.setItem('inActionPCBs', JSON.stringify(inActionPCBs));
  }, [inActionPCBs]);


  // --- HANDLER FUNCTIONS ---

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewingPCB(null); 
  };
  
  const addInActionPCBs = (newPCBs, pcbSerialKey) => { 
      setInActionPCBs(prevPCBs => {
          const currentKey = pcbSerialKey || PCB_SERIAL_KEY_FALLBACK; 
          
          const existingSerials = new Set(prevPCBs.map(p => p[currentKey]));
          
          const uniqueNewPCBs = newPCBs
              .filter(pcb => !existingSerials.has(pcb[currentKey]))
              .map(pcb => ({
                  ...pcb,
                  isWorkAssigned: false, 
                  linkedOperations: DEFAULT_OPERATIONS_LIST.map(op => ({...op, assignedTo: null})), 
                  _pcb_key_id: currentKey, 
              }));
          
          return [...prevPCBs, ...uniqueNewPCBs];
      });
  };

  const handleFinalAssignmentSave = (serialNumber, assignedOperations) => {
      setInActionPCBs(prevPCBs => prevPCBs.map(pcb => {
          const pcbKey = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
          if (pcb[pcbKey] === serialNumber) {
              return { 
                  ...pcb, 
                  // isWorkAssigned is ALREADY TRUE from handleAssignWork
                  linkedOperations: assignedOperations, 
              };
          }
          return pcb;
      }));
      setViewingPCB(null); 
      alert(`Assignment mapping for PCB ${serialNumber} successfully saved!`);
  };


  const handleAssignWork = (serialNumber) => {
      let pcbToView = null;
      let alreadyAssigned = false;

      // 1. Check/Set the assignment status in the global state
      const updatedPCBs = inActionPCBs.map(pcb => {
          const pcbKey = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
          
          if (pcb[pcbKey] === serialNumber) {
              if (pcb.isWorkAssigned) {
                  alreadyAssigned = true;
                  pcbToView = pcb; 
              } else {
                  // Perform the lock and status flip immediately
                  pcbToView = { ...pcb, isWorkAssigned: true }; 
                  return pcbToView;
              }
          }
          return pcb;
      });
      
      setInActionPCBs(updatedPCBs);

      // 2. Handle redirection based on status
      if (alreadyAssigned) {
          alert("Work has already been permanently assigned and mapped for this PCB.");
          setViewingPCB(pcbToView);
      } else if (pcbToView) {
          alert(`PCB ${serialNumber} status updated to 'Assigned'. Opening mapping editor...`);
          setViewingPCB(pcbToView);
      }
  };

  const createOperatorAccount = (newStaffNumber, newName, newPassword) => {
    if (operatorAccounts.some(op => op.staff_number === newStaffNumber)) {
        alert("Error: Staff Number already exists for an Operator.");
        return false;
    }
    const newOperator = { staff_number: newStaffNumber, name: newName, password: newPassword };
    setOperatorAccounts(prevAccounts => [...prevAccounts, newOperator]);
    return true;
  };

  const handleLogin = (staffNumber, password) => {
    const staticCreds = DUMMY_CREDENTIALS[role];
    if (staticCreds && staffNumber === staticCreds.staff_number && password === staticCreds.password) {
        setIsLoggedIn(true); return;
    }
    if (role === 'operator') {
        const foundOperator = operatorAccounts.find(op => op.staff_number === staffNumber && op.password === password);
        if (foundOperator) { setIsLoggedIn(true); return; }
    }
    alert(`Login Failed. Check your staff number and password for the ${role} role.`);
  };


  // --- RENDER FUNCTIONS ---
  
  const renderLoginPage = () => { 
    if (role === 'operator') return <OperatorLoginPage onLogin={handleLogin} accounts={operatorAccounts} />;
    switch (role) {
      case 'admin': return <LoginPage onLogin={handleLogin} />;
      case 'supervisor': return <SupervisorLoginPage onLogin={handleLogin} />;
      default: return <LoginPage onLogin={handleLogin} />;
    }
  };
  
  const renderDashboard = () => { 
      // Supervisor Redirection Check
      if (role === 'supervisor' && viewingPCB) {
          return (
              <AssignmentEditor 
                  pcb={viewingPCB} 
                  operators={operatorAccounts} 
                  onSave={handleFinalAssignmentSave}
                  onCancel={() => setViewingPCB(null)} 
                  onLogout={handleLogout} 
              />
          );
      }
      
      // Standard Dashboard Rendering
      switch (role) {
        case 'admin':
          return <AdminDashboard onLogout={handleLogout} role={role} addInActionPCBs={addInActionPCBs} />;
        case 'operator':
          return <OperatorDashboard onLogout={handleLogout} role={role} />;
        case 'supervisor':
          return <SupervisorDashboard 
                     onLogout={handleLogout} 
                     role={role} 
                     onCreateOperator={createOperatorAccount}
                     inActionPCBs={inActionPCBs}
                     handleAssignWork={handleAssignWork} 
                 />;
        default:
          return <AdminDashboard onLogout={handleLogout} role={role} />;
      }
  };


  return (
    <div className="app-container">
      {isLoggedIn ? (
        renderDashboard()
      ) : (
        <>
          <div className="role-switcher">
            <button onClick={() => setRole('admin')} style={{ background: role === 'admin' ? '#007bff' : '#ddd', color: role === 'admin' ? 'white' : 'black' }}>Admin</button>
            <button onClick={() => setRole('operator')} style={{ background: role === 'operator' ? '#1a7fa3' : '#ddd', color: role === 'operator' ? 'white' : 'black', marginLeft: '10px' }}>Operator</button>
            <button onClick={() => setRole('supervisor')} style={{ background: role === 'supervisor' ? '#27ae60' : '#ddd', color: role === 'supervisor' ? 'white' : 'black', marginLeft: '10px' }}>Supervisor</button>
          </div>
          {renderLoginPage()}
        </>
      )}
    </div>
  );
}

export default App;