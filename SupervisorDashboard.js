import React, { useState } from 'react';
import * as XLSX from 'xlsx'; 
import './Dashboard.css'; 

// Key for Operations file
const PRIMARY_KEY_FLOW = 'operation seq number'; 
const FLOW_COLUMNS = ['operation seq number', 'operation name', 'Status'];

// Key for Admin's PCB data (MUST match AdminDashboard.js)
const PCB_SERIAL_KEY = 'PCB Serial Number'; 

// Utility Function: Read and Parse File (Robust with Header Trimming)
const readFile = (file) => { /* ... (Same readFile function as AdminDashboard.js) ... */
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rawJson = XLSX.utils.sheet_to_json(worksheet);
                
                if (rawJson.length === 0) { resolve([]); return; }
                
                const normalizedJson = rawJson.map((row, index) => {
                    const newRow = { id: `temp-${index + 1}` };
                    for (const key in row) {
                        const trimmedKey = key.trim(); 
                        newRow[trimmedKey] = row[key];
                    }
                    return newRow;
                });
                resolve(normalizedJson);
            } catch (error) { reject(error); }
        };
        reader.onerror = (error) => { reject(error); };
        reader.readAsArrayBuffer(file);
    });
};


function SupervisorDashboard({ onLogout, role, onCreateOperator, inActionPCBs }) { 
    // State for Operator Creation Form
    const [staffNumber, setStaffNumber] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    
    // States for Flow Control
    const [uploadedData, setUploadedData] = useState([]); 
    const [flowControlData, setFlowControlData] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set()); 
    const [activeView, setActiveView] = useState('creation'); 
    const [fileName, setFileName] = useState(null);
    const [tableColumns, setTableColumns] = useState([]); 
    
    // State for PCB Details
    const [selectedPCB, setSelectedPCB] = useState(null);


    // --- Operator Creation Logic ---
    const handleCreate = (e) => {
        e.preventDefault();
        if (!staffNumber || !name || !password) {
            alert("All fields are required to create a new operator.");
            return;
        }
        const success = onCreateOperator(staffNumber, name, password);
        if (success) {
            alert(`Operator "${name}" (Staff No: ${staffNumber}) created successfully!`);
            setStaffNumber('');
            setName('');
            setPassword('');
        }
    };
    
    // --- Upload CSV (Operations) Logic ---
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setActiveView('creation'); 
            try {
                const data = await readFile(file); 
                if (data.length > 0) {
                    const fileColumns = Object.keys(data[0]).filter(key => key !== 'id');
                    setTableColumns(fileColumns);
                    setUploadedData(data);
                    setSelectedIds(new Set()); 
                } else {
                    alert("File uploaded but no data found. Please check the sheet.");
                    setUploadedData([]);
                }
            } catch (error) {
                console.error("Error processing file:", error);
                alert("Error processing the file. Ensure it is a valid CSV/Excel format.");
                setUploadedData([]);
            }
        }
    };

    // --- Checkbox Logic ---
    const handleCheckboxChange = (id) => {
        const newSelectedIds = new Set(selectedIds);
        newSelectedIds.has(id) ? newSelectedIds.delete(id) : newSelectedIds.add(id);
        setSelectedIds(newSelectedIds);
    };

    // --- Save to FlowControl Logic ---
    const handleSaveToFlowControl = () => {
        if (selectedIds.size === 0) {
            alert("Please select at least one row to save to FlowControl.");
            return;
        }

        const itemsToSave = uploadedData.filter(item => selectedIds.has(item.id));
        const existingKeys = new Set(flowControlData.map(item => item[PRIMARY_KEY_FLOW]));

        const newFlowItems = itemsToSave
            .filter(item => {
                const key = item[PRIMARY_KEY_FLOW]; 
                if (!key) {
                    console.warn(`Skipping item with blank primary key.`);
                    return false;
                }
                return !existingKeys.has(key);
            })
            .map(item => ({
                ...item,
                Status: item.Status || 'Pending' 
            }));

        const duplicateCount = itemsToSave.length - newFlowItems.length;

        setFlowControlData(prevData => [...prevData, ...newFlowItems]); 
        setUploadedData([]); 
        setSelectedIds(new Set()); 

        let alertMessage = `${newFlowItems.length} unique operation(s) saved to FlowControl.`;
        if (duplicateCount > 0) {
            alertMessage += ` (${duplicateCount} duplicate(s) skipped.)`;
        }
        alert(alertMessage);
        
        setActiveView('flowcontrol'); 
    };

    // --- Rendering Functions ---

    const renderUploadTable = () => { /* ... (omitted for brevity) ... */
        if (uploadedData.length === 0) {
            return <p className="table-status">Upload a CSV/Excel file to see the staging table.</p>;
        }
        return (
            <>
                <h3 className="table-title">Staging Operations Table</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            {tableColumns.map(col => <th key={col}>{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {uploadedData.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.has(row.id)}
                                        onChange={() => handleCheckboxChange(row.id)}
                                    />
                                </td>
                                {tableColumns.map(colKey => (
                                    <td key={`${row.id}-${colKey}`}>{row[colKey]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="save-button-container">
                    <button 
                        onClick={handleSaveToFlowControl} 
                        disabled={selectedIds.size === 0}
                        className="save-flow-btn"
                    >
                        Save Selected to FlowControl ({selectedIds.size})
                    </button>
                </div>
            </>
        );
    };

    const renderFlowControlTable = () => { /* ... (omitted for brevity) ... */
        if (flowControlData.length === 0) {
            return <p className="table-status">The FlowControl memory is currently empty.</p>;
        }
        
        const displayColumns = flowControlData.length > 0 ? 
                                Object.keys(flowControlData[0]).filter(key => key !== 'id') : 
                                FLOW_COLUMNS; 

        return (
            <>
                <h3 className="table-title">FlowControl Operations ({flowControlData.length} items)</h3>
                <table className="data-table flow-table">
                    <thead>
                        <tr>
                            {displayColumns.map(col => <th key={col}>{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {flowControlData.map((row, index) => (
                            <tr key={row[PRIMARY_KEY_FLOW] || index}> 
                                {displayColumns.map(colKey => (
                                    <td key={`${index}-${colKey}`}>{row[colKey]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };

    // NEW Rendering Function for In-Action PCBs
    const renderInActionPCBsTable = () => {
        if (inActionPCBs.length === 0) {
            return <p className="table-status">No PCBs have been marked 'In-Action' by the Admin yet.</p>;
        }

        const displayColumns = Object.keys(inActionPCBs[0]).filter(key => key !== 'id');
        
        return (
            <>
                <h3 className="table-title">PCBs Pending Action ({inActionPCBs.length})</h3>
                {selectedPCB && (
                    <div className="pcb-detail-card">
                        <h4>Details for PCB: {selectedPCB[PCB_SERIAL_KEY]}</h4>
                        <ul>
                            {Object.keys(selectedPCB).filter(k => k !== 'id').map(key => (
                                <li key={key}><strong>{key}:</strong> {selectedPCB[key]}</li>
                            ))}
                        </ul>
                        <button onClick={() => setSelectedPCB(null)} className="close-detail-btn">Close Details</button>
                    </div>
                )}
                <table className="data-table flow-table">
                    <thead>
                        <tr>
                            {displayColumns.map(col => <th key={col}>{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {inActionPCBs.map((row, index) => (
                            <tr key={row[PCB_SERIAL_KEY] || index}> 
                                {displayColumns.map(colKey => (
                                    <td key={`${index}-${colKey}`}>
                                        {/* MAKE PCB SERIAL NUMBER CLICKABLE */}
                                        {colKey === PCB_SERIAL_KEY ? (
                                            <a 
                                                href="#" 
                                                onClick={(e) => { e.preventDefault(); setSelectedPCB(row); }}
                                                style={{ fontWeight: 'bold', color: '#007bff', cursor: 'pointer' }}
                                            >
                                                {row[PCB_SERIAL_KEY]}
                                            </a>
                                        ) : (
                                            row[colKey]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };


    return (
        <div className="sup-dashboard-wrapper">
            <header className="sup-header">
                <h1>✅ Supervisor Control Panel</h1>
                <button onClick={onLogout} className="sup-logout-btn">
                    Logout
                </button>
            </header>

            <div className="sup-dashboard-container">
                <div className="control-tabs">
                    <button 
                        onClick={() => setActiveView('creation')} 
                        className={`control-tab-btn ${activeView === 'creation' ? 'active' : ''}`}
                    >
                        Account Creation / Staging
                    </button>
                    <button 
                        onClick={() => setActiveView('flowcontrol')}
                        className={`control-tab-btn ${activeView === 'flowcontrol' ? 'active' : ''}`}
                    >
                        FlowControl Memory ({flowControlData.length})
                    </button>
                    <button onClick={() => setActiveView('pcbs')} className={`control-tab-btn ${activeView === 'pcbs' ? 'active' : ''}`}>
                        In-Action PCBs ({inActionPCBs.length})
                    </button>
                </div>

                {activeView === 'creation' && (
                    <div className="view-content">
                        <h2>Account Management & Operations Staging</h2>
                        
                        {/* SIDE-BY-SIDE CONTAINER */}
                        <div className="control-card-group">
                            
                            {/* Create Operator Card */}
                            <div className="create-card">
                                <h3>➕ Create Operator Account</h3>
                                <form onSubmit={handleCreate}>
                                    <div className="form-group-inline"><label>Staff Number:</label><input type="text" value={staffNumber} onChange={(e) => setStaffNumber(e.target.value)} required/></div>
                                    <div className="form-group-inline"><label>Name:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required/></div>
                                    <div className="form-group-inline"><label>Password:</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/></div>
                                    <button type="submit" className="create-btn">Create Operator</button>
                                </form>
                            </div>
                            
                            {/* Upload CSV (Operations) Card */}
                            <div className="upload-flow-card">
                                <h3>🔗 Upload CSV (Operations)</h3>
                                <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} id="flow-upload" style={{ display: 'none' }}/>
                                <label htmlFor="flow-upload" className="file-upload-label flow-label">{fileName ? `File Selected: ${fileName}` : 'Choose Operations CSV/Excel File'}</label>
                                {fileName && <p className="file-status">File: **{fileName}**</p>}
                            </div>
                        
                        </div>

                        {/* Conditional Table Display (Staging) */}
                        {uploadedData.length > 0 && renderUploadTable()}
                    </div>
                )}
                
                {activeView === 'flowcontrol' && (
                    <div className="view-content">
                        {renderFlowControlTable()}
                    </div>
                )}
                
                {activeView === 'pcbs' && (
                    <div className="view-content">
                        {renderInActionPCBsTable()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SupervisorDashboard;