import React, { useState } from 'react';
import './Assignement.css'
const PCB_SERIAL_KEY = 'PCB Serial Number'; 

function AssignmentEditor({ pcb, operators, onSave, onCancel, onLogout }) {
    // State to hold the temporary mapping of operations to operators
    const [assignedOperations, setAssignedOperations] = useState(
        pcb.linkedOperations.map(op => ({
            ...op,
            // Initialize assignedTo with existing data or null
            assignedTo: op.assignedTo || '' 
        }))
    );
    
    // Total mandatory operations
    const totalOperations = assignedOperations.length;

    // Handle dropdown change for a specific operation
    const handleAssignmentChange = (operationSNo, staffNumber) => {
        setAssignedOperations(prevOps => prevOps.map(op => {
            if (op['S.No'] === operationSNo) {
                return { ...op, assignedTo: staffNumber };
            }
            return op;
        }));
    };

    // Final Save Action
    const handleFinalSave = () => {
        const unassignedCount = assignedOperations.filter(op => !op.assignedTo).length;

        if (unassignedCount > 0) {
            if (!window.confirm(`WARNING: ${unassignedCount} operations are unassigned. Do you want to save anyway?`)) {
                return;
            }
        }
        
        // Pass the final map back to App.js to update the global state
        onSave(pcb[PCB_SERIAL_KEY], assignedOperations);
    };

    return (
        <div className="assignment-editor-wrapper">
            <header className="assignment-header">
                <h1>⚙️ Assign Work for PCB: {pcb[PCB_SERIAL_KEY]}</h1>
                <button onClick={onLogout} className="logout-btn">Logout</button>
            </header>

            <div className="assignment-container">
                <div className="assignment-info">
                    <p><strong>Status:</strong> Mapping Operator to {totalOperations} Mandatory Operations</p>
                    <p><strong>Available Operators:</strong> {operators.length}</p>
                </div>

                <div className="operations-table-container">
                    <table className="operations-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Operation Name</th>
                                <th>Current Status</th>
                                <th>Assign Operator</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedOperations.map(op => (
                                <tr key={op['S.No']}>
                                    <td>{op['S.No']}</td>
                                    <td>{op['Operation Name']}</td>
                                    <td>{op['Status']}</td>
                                    <td>
                                        <select
                                            value={op.assignedTo || ''}
                                            onChange={(e) => handleAssignmentChange(op['S.No'], e.target.value)}
                                            className="operator-dropdown"
                                        >
                                            <option value="">-- Select Operator --</option>
                                            {operators.map(operator => (
                                                <option key={operator.staff_number} value={operator.staff_number}>
                                                    {operator.name} ({operator.staff_number})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="assignment-footer">
                    <button onClick={onCancel} className="footer-btn cancel-btn">
                        Cancel & Back
                    </button>
                    <button onClick={handleFinalSave} className="footer-btn save-btn">
                        Confirm & Save Assignment (Final)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AssignmentEditor;