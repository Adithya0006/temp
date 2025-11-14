import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; 
import './Dashboard.css'; 

const PCB_SERIAL_KEY_FALLBACK = 'PCB Serial Number'; 
const STATUS_KEY = 'Status'; 
const STATUS_NOT_YET_ASSIGNED = 'Not Yet Assigned';
const STATUS_ASSIGNED = 'Assigned';

// Helper function to safely get initial state from localStorage (local to AdminDashboard)
const getInitialStateLocal = (key, defaultValue) => {
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

// --- Utility Function: Read and Parse File (retained) ---
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
                    const newRow = { id: `row-${Date.now()}-${index}` }; 
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
    // Initialize states from Local Storage for persistence
    const [masterList, setMasterList] = useState(getInitialStateLocal('adminMasterList', []));
    const [inActionList, setInActionList] = useState(getInitialStateLocal('adminInActionList', []));
    
    // Preview states
    const [uploadedPreviewData, setUploadedPreviewData] = useState(null); 
    const [previewColumns, setPreviewColumns] = useState([]); 
    
    // UI states
    const [activeTab, setActiveTab] = useState('master');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [fileName, setFileName] = useState(getInitialStateLocal('adminFileName', null));
    const [view, setView] = useState(getInitialStateLocal('adminView', 'upload')); 

    // Dynamic key state (initializes from master list if available, else fallback)
    const [pcbSerialKey, setPcbSerialKey] = useState(
        getInitialStateLocal('adminPcbSerialKey', PCB_SERIAL_KEY_FALLBACK)
    ); 

    // Use useEffect to sync local data to Local Storage
    useEffect(() => {
        localStorage.setItem('adminMasterList', JSON.stringify(masterList));
        localStorage.setItem('adminInActionList', JSON.stringify(inActionList));
    }, [masterList, inActionList]);

    useEffect(() => {
        localStorage.setItem('adminPcbSerialKey', pcbSerialKey);
        localStorage.setItem('adminFileName', fileName);
        localStorage.setItem('adminView', view);
    }, [pcbSerialKey, fileName, view]);


    // --- File Upload Logic ---
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            try {
                const data = await readFile(file); 
                
                if (data.length > 0) {
                    const fileColumns = Object.keys(data[0]).filter(key => key !== 'id');
                    
                    if (!fileColumns.includes(STATUS_KEY)) {
                        fileColumns.push(STATUS_KEY);
                    }

                    // Dynamically set the PCB Serial Key to the first column found
                    const discoveredPcbKey = fileColumns.length > 0 ? fileColumns[0] : PCB_SERIAL_KEY_FALLBACK;
                    setPcbSerialKey(discoveredPcbKey);

                    setPreviewColumns(fileColumns);
                    setUploadedPreviewData(data);
                    setView('preview'); 
                } else {
                    alert("File uploaded but no data found.");
                }
            } catch (error) {
                console.error("Error processing file:", error);
                alert("Error processing the file. Please check the file format.");
            }
        }
    };
    
    // --- PREVIEW CRUD Logic ---
    const handleAddRow = () => {
        const newRow = { id: `row-${Date.now()}-new` };
        previewColumns.forEach(col => newRow[col] = '');
        newRow[STATUS_KEY] = STATUS_NOT_YET_ASSIGNED;
        setUploadedPreviewData(prev => [...prev, newRow]);
    };
    
    const handleDeleteRow = (rowId) => {
        if (window.confirm("Are you sure you want to delete this row? This action cannot be undone.")) {
            setUploadedPreviewData(prev => prev.filter(row => row.id !== rowId));
        }
    };
    
    const handleUpdateCell = (rowId, colKey, newValue) => {
        setUploadedPreviewData(prev => 
            prev.map(row => 
                row.id === rowId ? { ...row, [colKey]: newValue } : row
            )
        );
    };

    // --- SAVE Preview to Master List (FIXED DUPLICATE CHECK) ---
    const handleSaveToMasterList = () => {
        if (window.confirm("Are you sure you want to confirm these changes and save the data to the Master List?")) {
            
            const incomingData = uploadedPreviewData.map(row => ({ 
                ...row, 
                [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED 
            }));
            
            let newUniqueData = [];
            let skippedCount = 0;

            // FIX: Use the existing check for duplicates
            if (masterList.length === 0) {
                newUniqueData = incomingData;
                skippedCount = 0;
            } else {
                const existingSerials = new Set(masterList.map(row => row[pcbSerialKey]));

                newUniqueData = incomingData.filter(row => {
                    const serial = row[pcbSerialKey];
                    return serial && !existingSerials.has(serial);
                });
                
                skippedCount = incomingData.length - newUniqueData.length;
            }
            
            setMasterList(prevList => [...prevList, ...newUniqueData]);

            setUploadedPreviewData(null);
            setView('dashboard');
            setActiveTab('master');

            let alertMsg = `Successfully added ${newUniqueData.length} unique records to the Master List.`;
            if (skippedCount > 0) {
                 alertMsg += ` (${skippedCount} duplicate PCB Serial Number(s) skipped.)`;
            }
            alert(alertMsg);
        }
    };

    // --- MASTER LIST Logic (retained) ---
    const handleCheckboxChange = (id) => {
        const row = masterList.find(r => r.id === id);
        if (row && row[STATUS_KEY] === STATUS_ASSIGNED) {
            return;
        }

        const newSelectedIds = new Set(selectedIds);
        newSelectedIds.has(id) ? newSelectedIds.delete(id) : newSelectedIds.add(id);
        setSelectedIds(newSelectedIds);
    };

    const handleSave = () => {
        if (selectedIds.size === 0) {
            alert("Please select at least one row to mark as Assigned.");
            return;
        }

        const itemsToMove = [];
        let anyUnassigned = false;

        const updatedMasterList = masterList.map(item => {
            if (selectedIds.has(item.id)) {
                itemsToMove.push(item);
                anyUnassigned = true;
                return { ...item, [STATUS_KEY]: STATUS_ASSIGNED };
            }
            return item;
        });
        
        if (!anyUnassigned) {
             alert("No unassigned items were selected.");
             return;
        }

        setMasterList(updatedMasterList); 
        
        const newItemsForInAction = itemsToMove.map(item => ({ 
            ...item, 
            [STATUS_KEY]: 'Incomplete'
        }));
        setInActionList(prevList => [...prevList, ...newItemsForInAction]);

        // Pass the dynamic key to the global function
        addInActionPCBs(itemsToMove, pcbSerialKey); 
        setSelectedIds(new Set());

        alert(`${itemsToMove.length} item(s) marked 'Assigned', moved to In-Action List, and shared with Supervisor.`);
        setActiveTab('inaction');
    };
    
    // --- Rendering Functions (retained) ---

    const renderDataTab = (data, isMasterList) => {
        let currentColumns = masterList.length > 0 ? Object.keys(masterList[0]).filter(k => k !== 'id') : [];
        if (currentColumns.length === 0 && data.length > 0) {
             currentColumns = Object.keys(data[0]).filter(k => k !== 'id');
        }

        if (data.length === 0) {
            return <p style={{textAlign: 'center', margin: '30px', color: '#666'}}>No data to display in this list.</p>;
        }

        return (
            <>
            <table className="data-table">
                <thead>
                    <tr>
                        {isMasterList && <th>Select</th>}
                        {currentColumns.map(col => <th key={col}>{col}</th>)} 
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => {
                        const isAssigned = row[STATUS_KEY] === STATUS_ASSIGNED;

                        return (
                            <tr key={row.id} style={{backgroundColor: isAssigned ? '#f0fff0' : 'white'}}>
                                {isMasterList && (
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={isAssigned || selectedIds.has(row.id)} 
                                            onChange={() => handleCheckboxChange(row.id)}
                                            disabled={isAssigned} 
                                        />
                                    </td>
                                )}
                                {currentColumns.map(colKey => (
                                    <td key={`${row.id}-${colKey}`}>
                                        {colKey === STATUS_KEY ? 
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: isAssigned ? '#27ae60' : (row[STATUS_KEY] === STATUS_NOT_YET_ASSIGNED ? '#f39c12' : '#e74c3c')
                                            }}>
                                                {row[colKey]}
                                            </span>
                                            : row[colKey]
                                        }
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {isMasterList && (
                <div className="save-button-container">
                    <button onClick={handleSave} disabled={selectedIds.size === 0}>
                        Mark Selected as 'Assigned' and Send to In-Action List ({selectedIds.size})
                    </button>
                </div>
            )}
            </>
        );
    };

    const renderPreview = () => (
        <div className="preview-container">
            <h2>File Preview & Manual Editing 📝</h2>
            <p>Review and perform CRUD operations on the data before saving to the Master List. Total rows: {uploadedPreviewData.length}</p>
            
            <div className="preview-controls">
                <button onClick={handleAddRow} className="preview-action-btn add-btn">➕ Add New Row</button>
                <button onClick={() => setView('upload')} className="preview-action-btn cancel-btn">❌ Cancel/Re-Upload</button>
            </div>
            
            <div className="table-responsive">
                <table className="data-table preview-table">
                    <thead>
                        <tr>
                            {previewColumns.map(col => <th key={col}>{col}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadedPreviewData.map((row) => (
                            <tr key={row.id}>
                                {previewColumns.map(colKey => (
                                    <td key={`${row.id}-${colKey}`} className="editable-cell">
                                        <input
                                            type="text"
                                            value={row[colKey] || ''}
                                            onChange={(e) => handleUpdateCell(row.id, colKey, e.target.value)}
                                            className="preview-input"
                                            disabled={colKey === STATUS_KEY}
                                        />
                                    </td>
                                ))}
                                <td>
                                    <button onClick={() => handleDeleteRow(row.id)} className="delete-row-btn">🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="save-preview-footer">
                <button onClick={handleSaveToMasterList} className="save-preview-btn">
                    Save to Master List (Confirm)
                </button>
            </div>
        </div>
    );
    
    const renderUploadCard = () => (
        <div className="upload-card">
            <h3>📥 Upload Project Sheet (CSV/Excel)</h3>
            <p>Upload a new file to start the process. Current file: {fileName || 'None'}</p>
            <input 
                type="file" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
                id="file-upload"
                style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="file-upload-label">
                Choose File
            </label>
        </div>
    );

    const renderDashboardTabs = () => (
        <>
            <button onClick={() => setView('upload')} className="secondary-action-btn">Upload New Sheet</button>
                        
            <div className="tabs-container">
                <button className={`tab-button ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>Master List ({masterList.length})</button>
                <button className={`tab-button ${activeTab === 'inaction' ? 'active' : ''}`} onClick={() => setActiveTab('inaction')}>In-Action List ({inActionList.length})</button>
            </div>
            
            <div className="tab-content">
                {activeTab === 'master' && renderDataTab(masterList, true)}
                {activeTab === 'inaction' && renderDataTab(inActionList, false)}
            </div>
        </>
    );

    // --- Main Component Render Logic (retained) ---
    const renderContent = () => {
        switch (view) {
            case 'upload':
                return renderUploadCard();
            case 'preview':
                if (uploadedPreviewData && uploadedPreviewData.length > 0) {
                    return renderPreview();
                }
                return renderUploadCard(); 
            case 'dashboard':
                if (masterList.length === 0) {
                    return renderUploadCard();
                }
                return renderDashboardTabs();
            default:
                return renderUploadCard();
        }
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
                <h1>Project Data Management </h1>
                
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminDashboard;