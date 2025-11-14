import React, { useState } from 'react';
import * as XLSX from 'xlsx'; 
import './Dashboard.css'; 

const PCB_SERIAL_KEY = 'PCB Serial Number'; 

// Utility Function: Read and Parse File (Robust with Header Trimming)
const readFile = (file) => {
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


function AdminDashboard({ onLogout, role, addInActionPCBs }) { 
    const [activeTab, setActiveTab] = useState('master');
    const [masterList, setMasterList] = useState([]);
    const [inActionList, setInActionList] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [fileName, setFileName] = useState(null);
    const [columns, setColumns] = useState([]); 

    const getFinalColumns = (fileColumns) => {
        if (!fileColumns.includes('Status')) {
            return [...fileColumns, 'Status'];
        }
        return fileColumns;
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            try {
                const data = await readFile(file); 
                
                if (data.length > 0) {
                    const fileColumns = Object.keys(data[0]).filter(key => key !== 'id');
                    setColumns(getFinalColumns(fileColumns));
                    setMasterList(data);
                    setActiveTab('master');
                    setSelectedIds(new Set());
                } else {
                    alert("File uploaded but no data found.");
                    setMasterList([]);
                }
            } catch (error) {
                console.error("Error processing file:", error);
                alert("Error processing the file. Please check the file format.");
                setMasterList([]);
            }
        }
    };
    
    const handleCheckboxChange = (id) => {
        const newSelectedIds = new Set(selectedIds);
        newSelectedIds.has(id) ? newSelectedIds.delete(id) : newSelectedIds.add(id);
        setSelectedIds(newSelectedIds);
    };

    // --- Data Transfer Logic (UPDATED to use addInActionPCBs) ---
    const handleSave = () => {
        if (selectedIds.size === 0) {
            alert("Please select at least one row to save to the In-Action List.");
            return;
        }

        const itemsToMove = [];
        const remainingItems = [];

        masterList.forEach(item => {
            if (selectedIds.has(item.id)) {
                itemsToMove.push(item);
            } else {
                remainingItems.push(item);
            }
        });

        // Add to local In-Action List with status
        const newItemsForInAction = itemsToMove
            .map(item => ({
                ...item,
                Status: 'Incomplete' 
            }));
            
        setInActionList(prevList => [...prevList, ...newItemsForInAction]);

        // 🚨 SEND DATA TO GLOBAL STATE (Supervisor)
        addInActionPCBs(itemsToMove); 

        // Delete from Master List
        setMasterList(remainingItems);
        setSelectedIds(new Set());

        alert(`${itemsToMove.length} item(s) moved to In-Action List and shared with Supervisor.`);
        setActiveTab('inaction');
    };

    // --- Rendering Functions (omitted renderTable for brevity, assuming existing correct implementation) ---
    const renderTable = (data, isMasterList) => {
        if (data.length === 0) {
            return <p style={{textAlign: 'center', margin: '30px', color: '#666'}}>No data to display in this list.</p>;
        }

        return (
            <>
            <table className="data-table">
                <thead>
                    <tr>
                        {isMasterList && <th>Select</th>}
                        {columns.map(col => <th key={col}>{col}</th>)} 
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            {isMasterList && (
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.has(row.id)}
                                        onChange={() => handleCheckboxChange(row.id)}
                                    />
                                </td>
                            )}
                            {columns.map(colKey => (
                                <td key={`${row.id}-${colKey}`}>
                                    {colKey === 'Status' && row[colKey] === 'Incomplete' ? 
                                        <span style={{color: '#e74c3c', fontWeight: 'bold'}}>{row[colKey]}</span> : 
                                        row[colKey]
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isMasterList && (
                <div className="save-button-container">
                    <button onClick={handleSave} disabled={selectedIds.size === 0}>
                        Move Selected to In-Action List ({selectedIds.size})
                    </button>
                </div>
            )}
            </>
        );
    };

    return (
        <div className="dashboard-wrapper">
            <header className="header">
                <h1>📊 Admin Dashboard</h1>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </header>

            <div className="dashboard-container">
                <h2>Admin Panel ({role.toUpperCase()})</h2>
                
                {/* Upload Card */}
                <div className="upload-card">
                    <h3>📥 Upload Staff Data (CSV/Excel)</h3>
                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} id="file-upload" style={{ display: 'none' }}/>
                    <label htmlFor="file-upload" className="file-upload-label">
                        {fileName ? `File Selected: ${fileName}` : 'Choose CSV or Excel File'}
                    </label>
                    {fileName && <p className="file-status">File: **{fileName}** | Records loaded: **{masterList.length}**</p>}
                </div>
                
                <hr/>

                {/* Tabs */}
                <div className="tabs-container">
                    <button className={`tab-button ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>Master List ({masterList.length})</button>
                    <button className={`tab-button ${activeTab === 'inaction' ? 'active' : ''}`} onClick={() => setActiveTab('inaction')}>In-Action List ({inActionList.length})</button>
                </div>
                
                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'master' && renderTable(masterList, true)}
                    {activeTab === 'inaction' && renderTable(inActionList, false)}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;