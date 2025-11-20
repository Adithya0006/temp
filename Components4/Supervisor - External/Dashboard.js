// SupervisorExternalDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, AppBar, Toolbar, Typography, Button, Container,
  Paper, Tabs, Tab, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Alert
} from '@mui/material';

const PCB_SERIAL_KEY_FALLBACK = 'PCB Serial Number';

const readLocalMasterList = () => {
  try {
    const raw = localStorage.getItem('adminMasterList');
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore parse errors */ }
  return [];
};

export default function SupervisorExternalDashboard({ onLogout, role, inActionPCBs = [] }) {
  const [activeTab, setActiveTab] = useState('master');
  const [masterList, setMasterList] = useState(null);
  const [inactionList, setInactionList] = useState(null);
  const [loading, setLoading] = useState({ master: false, inaction: false });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadMasterList();
    loadInactionList();
    // eslint-disable-next-line
  }, []);

  const loadMasterList = async () => {
    setLoading(prev => ({ ...prev, master: true }));
    try {
      const resp = await axios.get('/api/admin/masterlist', { timeout: 4000 });
      if (resp && resp.data) {
        setMasterList(Array.isArray(resp.data) ? resp.data : resp.data.list || []);
      } else {
        // fallback
        setMasterList(readLocalMasterList());
      }
    } catch (err) {
      // fallback to localStorage
      setMasterList(readLocalMasterList());
      // optional: keep a message but don't block UX
      // console.warn('Failed to fetch master list from server, using localStorage fallback.', err);
    } finally {
      setLoading(prev => ({ ...prev, master: false }));
    }
  };

  const loadInactionList = async () => {
    setLoading(prev => ({ ...prev, inaction: true }));
    try {
      const resp = await axios.get('/api/supervisor/inaction', { timeout: 4000 });
      if (resp && resp.data) {
        setInactionList(Array.isArray(resp.data) ? resp.data : resp.data.list || inActionPCBs || []);
      } else {
        setInactionList(inActionPCBs || []);
      }
    } catch (err) {
      // fallback to inActionPCBs prop (from App) or localStorage key 'adminInActionList'
      try {
        const fromLS = JSON.parse(localStorage.getItem('adminInActionList') || '[]');
        setInactionList(fromLS.length ? fromLS : (inActionPCBs || []));
      } catch (e) {
        setInactionList(inActionPCBs || []);
      }
      // console.warn('Failed to fetch in-action PCBs from server, using fallback.', err);
    } finally {
      setLoading(prev => ({ ...prev, inaction: false }));
    }
  };

  // display helpers
  const currentPcbKey = (inactionList && inactionList.length > 0) ? (inactionList[0]._pcb_key_id || PCB_SERIAL_KEY_FALLBACK) : PCB_SERIAL_KEY_FALLBACK;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f7fafc' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NPTRM — Supervisor (External) — View Only
          </Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="fullWidth">
            <Tab label="Admin Master List (Read-only)" value="master" />
            <Tab label="In-Action PCBs (Read-only)" value="inaction" />
          </Tabs>
        </Paper>

        {errorMsg && <Alert severity="warning" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        {activeTab === 'master' && (
          <Paper sx={{ p: 2 }}>
            {loading.master && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
            {!loading.master && (!masterList || masterList.length === 0) && (
              <Typography sx={{ p: 3, textAlign: 'center' }}>No Master List data available (server & local fallback empty).</Typography>
            )}
            {!loading.master && masterList && masterList.length > 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      {Object.keys(masterList[0]).filter(k => k !== 'id').map(col => <TableCell key={col}>{col}</TableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {masterList.map((row, idx) => (
                      <TableRow key={row.id || idx}>
                        {Object.keys(masterList[0]).filter(k => k !== 'id').map(col => (
                          <TableCell key={`${row.id || idx}-${col}`}>{row[col]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {activeTab === 'inaction' && (
          <Paper sx={{ p: 2 }}>
            {loading.inaction && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
            {!loading.inaction && (!inactionList || inactionList.length === 0) && (
              <Typography sx={{ p: 3, textAlign: 'center' }}>No In-Action PCBs found.</Typography>
            )}
            {!loading.inaction && inactionList && inactionList.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Showing {inactionList.length} PCB(s). Primary key used: <strong>{currentPcbKey}</strong>
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        {Object.keys(inactionList[0]).filter(k => k !== 'id' && k !== 'linkedOperations' && k !== '_pcb_key_id').map(col => <TableCell key={col}>{col}</TableCell>)}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inactionList.map((row, idx) => (
                        <TableRow key={row.id || idx}>
                          {Object.keys(inactionList[0]).filter(k => k !== 'id' && k !== 'linkedOperations' && k !== '_pcb_key_id').map(col => (
                            <TableCell key={`${row.id || idx}-${col}`}>
                              {col === currentPcbKey ? row[col] : (String(row[col]).length > 100 ? `${String(row[col]).slice(0, 100)}...` : row[col])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
}
