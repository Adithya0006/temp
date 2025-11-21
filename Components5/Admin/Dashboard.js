import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Grid,
  IconButton,
  Container,
  Stack,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const PCB_SERIAL_KEY_FALLBACK = 'serial number'; // <- user confirmed exact field
const STATUS_KEY = 'Status';
const STATUS_NOT_YET_ASSIGNED = 'Not Yet Assigned';
const STATUS_ASSIGNED = 'Assigned';

// helper: load JSON from localStorage safely
const getInitialStateLocal = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    return JSON.parse(saved);
  } catch (e) {
    return defaultValue;
  }
};

// read excel/csv file -> normalized JSON rows
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson = XLSX.utils.sheet_to_json(worksheet);
        if (!rawJson || rawJson.length === 0) { resolve([]); return; }
        const normalizedJson = rawJson.map((row, index) => {
          const newRow = { id: `row-${Date.now()}-${index}` };
          for (const key in row) {
            const trimmedKey = key.trim();
            newRow[trimmedKey] = row[key];
          }
          return newRow;
        });
        resolve(normalizedJson);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

// format timestamp for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleString();
};

// Utility: detect a probable serial key from list of column names (case-insensitive)
const detectSerialKeyFromKeys = (keys = []) => {
  if (!keys || keys.length === 0) return PCB_SERIAL_KEY_FALLBACK;
  // Prefer exact match (case insensitive) to the user-provided fallback
  const fallbackLower = PCB_SERIAL_KEY_FALLBACK.toLowerCase();
  for (const k of keys) {
    if (!k || typeof k !== 'string') continue;
    if (k.trim().toLowerCase() === fallbackLower) return k; // preserve original casing/spacing
  }
  // Otherwise, choose the first key that contains 'serial' (case-insensitive)
  for (const k of keys) {
    if (!k || typeof k !== 'string') continue;
    if (/serial/i.test(k)) return k;
  }
  // last resort: return first non-id key
  return keys.find(k => k !== 'id') || PCB_SERIAL_KEY_FALLBACK;
};

// Normalize serial value for comparisons
const normalizeSerialValue = (val) => {
  if (val === undefined || val === null) return '';
  return String(val).trim().toLowerCase();
};

export default function AdminDashboard({ onLogout, addInActionPCBs, deleteInActionPCB }) {
  // core persistent states
  const [masterList, setMasterList] = useState(getInitialStateLocal('adminMasterList', []));
  const [inActionList, setInActionList] = useState(getInitialStateLocal('adminInActionList', []));
  const [fileName, setFileName] = useState(getInitialStateLocal('adminFileName', null));
  // pcbSerialKey persists chosen column name used as canonical PCB key (defaults to fallback)
  const [pcbSerialKey, setPcbSerialKey] = useState(getInitialStateLocal('adminPcbSerialKey', PCB_SERIAL_KEY_FALLBACK));

  // preview / upload states
  const [uploadedPreviewData, setUploadedPreviewData] = useState(null);
  const [previewColumns, setPreviewColumns] = useState([]);

  // selection & timestamps
  const [selectedIds, setSelectedIds] = useState(new Set(getInitialStateLocal('adminSelectedIds', [])));
  const [masterListCreated, setMasterListCreated] = useState(getInitialStateLocal('adminMasterListCreated', null));
  const [inActionLastUpdated, setInActionLastUpdated] = useState(getInitialStateLocal('adminInActionLastUpdated', null));

  // view state: 'home' | 'master' | 'inaction' | 'create' | 'preview' | 'profile'
  const [view, setView] = useState(getInitialStateLocal('adminView', 'home'));

  // persistors
  useEffect(() => { localStorage.setItem('adminMasterList', JSON.stringify(masterList)); }, [masterList]);
  useEffect(() => { localStorage.setItem('adminInActionList', JSON.stringify(inActionList)); }, [inActionList]);
  useEffect(() => { localStorage.setItem('adminPcbSerialKey', pcbSerialKey); }, [pcbSerialKey]);
  useEffect(() => { localStorage.setItem('adminFileName', fileName); }, [fileName]);
  useEffect(() => { localStorage.setItem('adminView', view); }, [view]);
  useEffect(() => { localStorage.setItem('adminSelectedIds', JSON.stringify(Array.from(selectedIds))); }, [selectedIds]);
  useEffect(() => { localStorage.setItem('adminMasterListCreated', masterListCreated); }, [masterListCreated]);
  useEffect(() => { localStorage.setItem('adminInActionLastUpdated', inActionLastUpdated); }, [inActionLastUpdated]);

  // --- Upload handlers ---
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const data = await readFile(file);
      if (data.length === 0) { alert('Uploaded file contains no rows'); return; }
      const columns = Object.keys(data[0]).filter(k => k !== 'id');
      // ensure Status column exists
      if (!columns.includes(STATUS_KEY)) columns.push(STATUS_KEY);

      // choose discovered pcb key heuristically (prefer user fallback 'serial number')
      const discoveredPcbKey = detectSerialKeyFromKeys(columns);
      setPcbSerialKey(discoveredPcbKey);

      // set preview
      setPreviewColumns(columns);
      // ensure each row has status default
      const normalized = data.map(r => ({ ...r, [STATUS_KEY]: r[STATUS_KEY] || STATUS_NOT_YET_ASSIGNED }));
      setUploadedPreviewData(normalized);
      setView('preview');
    } catch (err) {
      console.error(err);
      alert('Error reading file. Ensure it is valid CSV / Excel.');
    }
  };

  const handleAddRow = () => {
    if (!previewColumns || previewColumns.length === 0) return;
    const newRow = { id: `row-${Date.now()}-new` };
    previewColumns.forEach(c => newRow[c] = '');
    newRow[STATUS_KEY] = STATUS_NOT_YET_ASSIGNED;
    setUploadedPreviewData(prev => [...(prev || []), newRow]);
  };

  const handleDeletePreviewRow = (id) => {
    if (!window.confirm('Delete this preview row?')) return;
    setUploadedPreviewData(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdatePreviewCell = (rowId, colKey, value) => {
    setUploadedPreviewData(prev => prev.map(r => r.id === rowId ? ({ ...r, [colKey]: value }) : r));
  };

  const handleSaveToMasterList = () => {
    if (!uploadedPreviewData || uploadedPreviewData.length === 0) { alert('No preview data to save.'); return; }
    if (!window.confirm('Confirm saving previewed rows to Master List?')) return;

    // incoming records become Not Yet Assigned
    const incoming = uploadedPreviewData.map(r => ({ ...r, [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED }));

    // detect serial key from preview columns (if present)
    const discovered = detectSerialKeyFromKeys(previewColumns);
    setPcbSerialKey(discovered);

    // dedupe based on pcbSerialKey against existing masterList (compare normalized)
    if (masterList.length === 0) {
      setMasterList(incoming);
    } else {
      const existingSerials = new Set(masterList.map(r => normalizeSerialValue(r[discovered])));
      const uniqueNew = incoming.filter(r => {
        const serial = normalizeSerialValue(r[discovered]);
        return serial && !existingSerials.has(serial);
      });
      setMasterList(prev => [...prev, ...uniqueNew]);
      const skipped = incoming.length - uniqueNew.length;
      if (skipped > 0) {
        alert(`Saved ${uniqueNew.length} rows. ${skipped} duplicate(s) skipped.`);
      }
    }

    setMasterListCreated(new Date().toISOString());
    // clear preview
    setUploadedPreviewData(null);
    setPreviewColumns([]);
    setView('home');
    alert('Saved to Master List.');
  };

  // --- Master list selection & mark-as-assigned ---
  const handleMasterCheckbox = (id) => {
    const row = masterList.find(r => r.id === id);
    // do not allow selecting already assigned rows
    if (row && row[STATUS_KEY] === STATUS_ASSIGNED) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleMarkSelectedAssigned = () => {
    if (selectedIds.size === 0) { alert('Select rows to mark as Assigned'); return; }
    if (!window.confirm(`Mark ${selectedIds.size} selected row(s) as Assigned and send to In-Action list?`)) return;

    const itemsToMove = [];
    const updatedMaster = masterList.map(item => {
      if (selectedIds.has(item.id) && item[STATUS_KEY] !== STATUS_ASSIGNED) {
        itemsToMove.push(item);
        return { ...item, [STATUS_KEY]: STATUS_ASSIGNED };
      }
      return item;
    });

    if (itemsToMove.length === 0) { alert('No unassigned items selected.'); return; }

    setMasterList(updatedMaster);
    // prepare items for inActionList and call prop to share with Supervisor
    const outgoing = itemsToMove.map(item => ({
      ...item,
      [STATUS_KEY]: 'Incomplete',
      _movedAt: new Date().toISOString(),
      _pcb_key_id: pcbSerialKey,
      isWorkAssigned: false,
      linkedOperations: item.linkedOperations || [],
    }));

    // Update local Admin inAction mirror
    setInActionList(prev => [...prev, ...outgoing]);
    // notify parent App to add to central inAction store (so Supervisors see them)
    if (typeof addInActionPCBs === 'function') addInActionPCBs(itemsToMove, pcbSerialKey);

    setSelectedIds(new Set());
    setInActionLastUpdated(new Date().toISOString());
    alert(`${itemsToMove.length} item(s) moved to In-Action and shared with Supervisor.`);
    setView('inaction');
  };

  // --- Move back: from admin's inActionList back to masterList ---
  const handleMoveBackToMaster = (rowId) => {
    const row = inActionList.find(r => r.id === rowId);
    if (!row) return;

    // Determine serial using our canonical key, fallback to searching keys on the row
    const keyUsed = pcbSerialKey || detectSerialKeyFromKeys(Object.keys(row));
    const serialRaw = row[keyUsed] ?? row[PCB_SERIAL_KEY_FALLBACK] ?? row['SNo'] ?? '';
    const serialNormalized = normalizeSerialValue(serialRaw);

    if (!serialNormalized) {
      alert('Cannot determine PCB serial for this row; move back cancelled.');
      return;
    }

    if (!window.confirm(`Move PCB ${serialRaw} back to Master List for editing? This will remove it from Supervisor's list.`)) return;

    // 1. set MasterList status back to Not Yet Assigned for same serial (normalized comparison)
    setMasterList(prev => prev.map(item => {
      // detect key for each item (prefer pcbSerialKey but fallback to detect from item keys)
      const itemKey = pcbSerialKey || detectSerialKeyFromKeys(Object.keys(item));
      const itemSerial = normalizeSerialValue(item[itemKey]);
      if (itemSerial && itemSerial === serialNormalized) {
        // only modify matching records
        return { ...item, [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED };
      }
      return item;
    }));

    // 2. remove from admin's inAction mirror
    setInActionList(prev => prev.filter(p => {
      const pKey = pcbSerialKey || detectSerialKeyFromKeys(Object.keys(p));
      const pSerial = normalizeSerialValue(p[pKey]);
      return pSerial !== serialNormalized;
    }));

    // 3. inform parent to delete from central inActionPCBs (pass the raw serial string)
    if (typeof deleteInActionPCB === 'function') deleteInActionPCB(serialRaw);

    setInActionLastUpdated(new Date().toISOString());
    alert(`PCB ${serialRaw} moved back to Master List.`);
  };

  // --- Preview row editing helpers (already implemented) ---
  // Render functions:

  const HomeCards = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Admin Home</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center', cursor: 'pointer', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} elevation={3}
            onClick={() => setView('master')}>
            <Box>
              <StorageIcon sx={{ fontSize: 44, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ mt: 1 }}>Master List</Typography>
              <Typography variant="body2" color="text.secondary">View all master rows & mark as Assigned</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption">Created: <strong>{formatDate(masterListCreated)}</strong></Typography>
              <Button size="small">Open</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center', cursor: 'pointer', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} elevation={3}
            onClick={() => setView('inaction')}>
            <Box>
              <PlayForWorkIcon sx={{ fontSize: 44, color: 'success.main' }} />
              <Typography variant="h6" sx={{ mt: 1 }}>In-Action</Typography>
              <Typography variant="body2" color="text.secondary">PCBs already moved to supervisor</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption">Updated: <strong>{formatDate(inActionLastUpdated)}</strong></Typography>
              <Button size="small">Open</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center', cursor: 'pointer', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} elevation={3}
            onClick={() => setView('create')}>
            <Box>
              <UploadFileIcon sx={{ fontSize: 44, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ mt: 1 }}>Create Project</Typography>
              <Typography variant="body2" color="text.secondary">Upload CSV/Excel → Preview → Save to Master</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption">File: <strong>{fileName || 'None'}</strong></Typography>
              <Button size="small">Open</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center', cursor: 'pointer', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} elevation={3}
            onClick={() => setView('profile')}>
            <Box>
              <PersonAddIcon sx={{ fontSize: 44, color: 'secondary.main' }} />
              <Typography variant="h6" sx={{ mt: 1 }}>Profile Creation</Typography>
              <Typography variant="body2" color="text.secondary">Coming soon — add operator/profile details here</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button size="small">Open</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  // Master list view (ONLY master table with timestamps and Mark as Assigned)
  const MasterView = () => {
    const columns = masterList.length > 0 ? Object.keys(masterList[0]).filter(k => k !== 'id') : [];
    return (
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setView('home')}><ArrowBackIcon /></IconButton>
            <Typography variant="h6">Master List</Typography>
          </Stack>
          <Typography variant="caption">Created At: <strong>{formatDate(masterListCreated)}</strong></Typography>
        </Box>

        {masterList.length === 0 ? (
          <Paper sx={{ p: 3 }}><Typography>No master records yet. Upload from Create Project.</Typography></Paper>
        ) : (
          <Paper>
            <TableContainer sx={{ maxHeight: '60vh' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell padding="checkbox">Select</TableCell>
                    {columns.map(col => <TableCell key={col}>{col}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {masterList.map(row => {
                    const isAssigned = row[STATUS_KEY] === STATUS_ASSIGNED;
                    const statusColor = isAssigned ? 'success.dark' : (row[STATUS_KEY] === STATUS_NOT_YET_ASSIGNED ? 'warning.dark' : 'text.primary');
                    return (
                      <TableRow key={row.id} sx={{ bgcolor: isAssigned ? '#f0fff0' : 'white' }}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isAssigned || selectedIds.has(row.id)}
                            onChange={() => handleMasterCheckbox(row.id)}
                            disabled={isAssigned}
                          />
                        </TableCell>
                        {columns.map(col => (
                          <TableCell key={`${row.id}-${col}`}>
                            {col === STATUS_KEY ? <Typography sx={{ fontWeight: 'bold', color: statusColor }}>{row[col]}</Typography> : row[col]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption">Created At: <strong>{formatDate(masterListCreated)}</strong></Typography>
              <Button variant="contained" color="primary" disabled={selectedIds.size === 0} onClick={handleMarkSelectedAssigned}>
                Mark Selected as 'Assigned' and Send to In-Action ({selectedIds.size})
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    );
  };

  // In-Action view (ONLY in-action table; move back to master)
  const InactionView = () => {
    // columns detection
    const currentKey = inActionList.length > 0 ? (inActionList[0]._pcb_key_id || pcbSerialKey || PCB_SERIAL_KEY_FALLBACK) : pcbSerialKey || PCB_SERIAL_KEY_FALLBACK;
    const baseColumns = inActionList.length > 0 ? Object.keys(inActionList[0]).filter(k => !['id','linkedOperations','isWorkAssigned','_pcb_key_id','_movedAt'].includes(k)) : [];
    const displayColumns = [...baseColumns, 'Move Back'];

    return (
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setView('home')}><ArrowBackIcon /></IconButton>
            <Typography variant="h6">In-Action PCBs ({inActionList.length})</Typography>
          </Stack>
          <Typography variant="caption">Last Updated: <strong>{formatDate(inActionLastUpdated)}</strong></Typography>
        </Box>

        {inActionList.length === 0 ? (
          <Paper sx={{ p: 3 }}><Typography>No PCBs are currently In-Action.</Typography></Paper>
        ) : (
          <Paper>
            <TableContainer sx={{ maxHeight: '60vh' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    {displayColumns.map(col => <TableCell key={col}>{col}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActionList.map((row) => {
                    const serial = row[currentKey];
                    return (
                      <TableRow key={row.id}>
                        {baseColumns.map(col => (
                          <TableCell key={`${row.id}-${col}`}>
                            {col === currentKey ? (
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{row[col]}</Typography>
                            ) : (
                              row[col]
                            )}
                          </TableCell>
                        ))}

                        <TableCell>
                          <Button startIcon={<EditIcon />} size="small" onClick={() => alert('Supervisor assignment/edit happens in Supervisor UI.')}>
                            Edit
                          </Button>
                          <Button startIcon={<DeleteIcon />} size="small" color="error" onClick={() => handleMoveBackToMaster(row.id)}>
                            Move Back
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    );
  };

  // Create Project view (upload -> preview -> save)
  const CreateProjectView = () => (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => setView('home')}><ArrowBackIcon /></IconButton>
          <Typography variant="h6">Create Project (Upload CSV / Excel)</Typography>
        </Stack>
        <Typography variant="caption">File: <strong>{fileName || 'None'}</strong></Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>Upload a CSV or Excel file. You will be able to preview and edit rows before saving to Master List.</Typography>

        <input
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          id="admin-file-upload"
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <Button variant="contained" component="label" htmlFor="admin-file-upload" startIcon={<UploadFileIcon />}>
          Choose File
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2">Note</Typography>
          <Typography variant="body2" color="text.secondary">After upload you'll preview data and can add/delete/edit rows. Status column will be added if missing.</Typography>
        </Box>
      </Paper>
    </Container>
  );

  // Preview view (reuse preview editing UI)
  const PreviewView = () => {
    return (
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setView('create')}><ArrowBackIcon /></IconButton>
            <Typography variant="h6">File Preview & Manual Editing</Typography>
          </Stack>
          <Typography variant="caption">Rows: <strong>{uploadedPreviewData?.length || 0}</strong></Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddRow}>Add New Row</Button>
            <Button color="error" variant="outlined" onClick={() => { if (window.confirm('Cancel upload & go back?')) { setUploadedPreviewData(null); setPreviewColumns([]); setView('home'); }}}>Cancel Upload</Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 400, mb: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {previewColumns.map(col => <TableCell key={col} sx={{ fontWeight: 'bold' }}>{col}</TableCell>)}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedPreviewData.map(row => (
                  <TableRow key={row.id}>
                    {previewColumns.map(col => (
                      <TableCell key={`${row.id}-${col}`} sx={{ p: 0.5 }}>
                        <TextField
                          value={row[col] ?? ''}
                          size="small"
                          fullWidth
                          disabled={col === STATUS_KEY}
                          onChange={(e) => handleUpdatePreviewCell(row.id, col, e.target.value)}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeletePreviewRow(row.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" size="large" onClick={handleSaveToMasterList}>Save to Master List</Button>
          </Box>
        </Paper>
      </Container>
    );
  };

  const ProfileView = () => (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => setView('home')}><ArrowBackIcon /></IconButton>
        <Typography variant="h6">Profile Creation (Coming Soon)</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2">Profile creation UI will be added here. You can use this area to add operator profiles or admin profiles later.</Typography>
      </Paper>
    </Container>
  );

  // top-level render
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb', pb: 6 }}>
      <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #eee' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Box>
            <Button onClick={() => setView('home')} sx={{ mr: 1 }}>Home</Button>
            <Button variant="outlined" color="inherit" onClick={onLogout}>Logout</Button>
          </Box>
        </Container>
      </Box>

      {view === 'home' && <HomeCards />}
      {view === 'master' && <MasterView />}
      {view === 'inaction' && <InactionView />}
      {view === 'create' && <CreateProjectView />}
      {view === 'preview' && uploadedPreviewData && <PreviewView />}
      {view === 'profile' && <ProfileView />}
    </Box>
  );
}
