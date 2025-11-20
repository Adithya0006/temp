import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  AppBar,
  Toolbar,
  Container,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';

const PRIMARY_KEY_FLOW = 'operation seq number';
const PCB_SERIAL_KEY_FALLBACK = 'PCB Serial Number';

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson = XLSX.utils.sheet_to_json(worksheet);
        if (!rawJson.length) return resolve([]);
        const normalized = rawJson.map((row, i) => {
          const cleaned = { id: `temp-${i + 1}` };
          for (const k in row) cleaned[k.trim()] = row[k];
          return cleaned;
        });
        resolve(normalized);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

export default function SupervisorDashboard({
  onLogout,
  role,
  onCreateOperator,
  inActionPCBs,
  handleAssignWork,
}) {
  const [staffNumber, setStaffNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [uploadedData, setUploadedData] = useState([]);
  const [flowControlData, setFlowControlData] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeView, setActiveView] = useState('creation');
  const [fileName, setFileName] = useState(null);
  const [tableColumns, setTableColumns] = useState([]);
  const [selectedPCB, setSelectedPCB] = useState(null);

  const isAllCompleted = (pcb) => {
    if (!pcb.linkedOperations) return false;
    return pcb.linkedOperations.every((op) => op.status === 'Completed');
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!staffNumber || !name || !password) return alert("All fields required!");
    const success = onCreateOperator(staffNumber, name, password);
    if (success) {
      alert(`Operator '${name}' created.`);
      setStaffNumber('');
      setName('');
      setPassword('');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const data = await readFile(file);
      if (!data.length) return alert("No rows found.");
      const columns = Object.keys(data[0]).filter((k) => k !== 'id');
      setTableColumns(columns);
      setUploadedData(data);
      setActiveView('creation');
    } catch (err) {
      alert("Error reading file.");
    }
  };

  const handleCheckboxChange = (id) => {
    const newSet = new Set(selectedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSaveToFlowControl = () => {
    if (!selectedIds.size) return alert("Select rows first!");

    const itemsToSave = uploadedData.filter((x) => selectedIds.has(x.id));
    const existingKeys = new Set(flowControlData.map((x) => x[PRIMARY_KEY_FLOW]));

    const unique = [];
    const skipped = [];

    itemsToSave.forEach((item) => {
      if (!existingKeys.has(item[PRIMARY_KEY_FLOW])) {
        unique.push({ ...item, Status: item.Status || "Pending" });
      } else {
        skipped.push(item);
      }
    });

    setFlowControlData((prev) => [...prev, ...unique]);
    setUploadedData([]);
    setSelectedIds(new Set());

    alert(`${unique.length} added. ${skipped.length} duplicates skipped.`);
    setActiveView('flowcontrol');
  };

  const handleAssignClick = (serialNumber) => {
    handleAssignWork(serialNumber);
  };

  const renderUploadTable = () => {
    if (!uploadedData.length)
      return <Typography sx={{ p: 3, textAlign: 'center' }}>Upload CSV to see table.</Typography>;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Staging Table</Typography>

        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.200' }}>
                <TableCell padding="checkbox">Select</TableCell>
                {tableColumns.map((col) => <TableCell key={col}>{col}</TableCell>)}
              </TableRow>
            </TableHead>

            <TableBody>
              {uploadedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </TableCell>

                  {tableColumns.map((col) => (
                    <TableCell key={`${row.id}-${col}`}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={handleSaveToFlowControl}>
            Save to FlowControl ({selectedIds.size})
          </Button>
        </Box>
      </Box>
    );
  };

  const renderFlowControlTable = () => {
    if (!flowControlData.length)
      return <Typography sx={{ p: 3, textAlign: 'center' }}>FlowControl empty.</Typography>;

    const displayColumns = Object.keys(flowControlData[0]).filter((k) => k !== 'id');

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">FlowControl Memory</Typography>
        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>{displayColumns.map((c) => <TableCell key={c}>{c}</TableCell>)}</TableRow>
            </TableHead>

            <TableBody>
              {flowControlData.map((row, idx) => (
                <TableRow key={idx}>
                  {displayColumns.map((c) => <TableCell key={c}>{row[c]}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderInActionPCBs = () => {
    if (!inActionPCBs.length)
      return (
        <Typography sx={{ p: 3, textAlign: 'center' }}>
          No PCBs assigned by Admin yet.
        </Typography>
      );

    const pcbKey = inActionPCBs[0]._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">In-Action PCBs ({inActionPCBs.length})</Typography>

        {selectedPCB && (
          <Alert severity="info" sx={{ mb: 2 }} onClose={() => setSelectedPCB(null)}>
            Viewing PCB {selectedPCB[pcbKey]}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'grey.200' }}>
              <TableRow>
                {Object.keys(inActionPCBs[0]).filter((k) =>
                  !['id', 'linkedOperations', 'isWorkAssigned', '_pcb_key_id'].includes(k)
                ).map((c) => <TableCell key={c}>{c}</TableCell>)}

                <TableCell>Assign</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inActionPCBs.map((row, idx) => {
                const serial = row[pcbKey];

                const completed = isAllCompleted(row);   // check if all operations completed

                return (
                  <TableRow key={idx}>
                    {Object.keys(row).filter((k) =>
                      !['id', 'linkedOperations', 'isWorkAssigned', '_pcb_key_id'].includes(k)
                    ).map((c) => (
                      <TableCell key={`${serial}-${c}`}>{row[c]}</TableCell>
                    ))}

                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color={completed ? "inherit" : "primary"}
                        disabled={completed}  // disable ONLY when all operations completed
                        onClick={() => handleAssignClick(serial)}
                      >
                        {completed ? "Completed" : "Assign Work"}
                      </Button>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'success.dark' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Supervisor Panel</Typography>
          <Button variant="outlined" color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeView}
            onChange={(e, v) => setActiveView(v)}
            variant="fullWidth"
          >
            <Tab label="Account Creation" value="creation" />
            <Tab label="FlowControl" value="flowcontrol" />
            <Tab label={`In-Action PCBs (${inActionPCBs.length})`} value="pcbs" />
          </Tabs>
        </Paper>

        {activeView === 'creation' &&
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">Create Operator</Typography>

                  <form onSubmit={handleCreate}>
                    <TextField size="small" fullWidth label="Staff Number"
                      value={staffNumber} onChange={(e) => setStaffNumber(e.target.value)}
                      sx={{ mt: 2 }}
                    />
                    <TextField size="small" fullWidth label="Name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      sx={{ mt: 2 }}
                    />
                    <TextField size="small" type="password" fullWidth label="Password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      sx={{ mt: 2 }}
                    />

                    <Button variant="contained" color="success" type="submit" sx={{ mt: 2 }}>Create</Button>
                  </form>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">Upload Operations</Typography>

                  <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    Upload CSV
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>

                  {renderUploadTable()}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        }

        {activeView === 'flowcontrol' && renderFlowControlTable()}
        {activeView === 'pcbs' && renderInActionPCBs()}
      </Container>
    </Box>
  );
}
