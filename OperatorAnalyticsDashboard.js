import React, { useMemo, useState } from "react";
import {
  Box, Grid, Paper, Typography, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, TablePagination, Stack, Divider
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend
} from "recharts";
import { Activity, CheckCircle, Package, History, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";

const OperatorAnalyticsDashboard = ({ data }) => {
  const { operator_id, Productivity_History = [], Assembly_Line_Traceability = [] } = data;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 1. Day-wise Trend Data (Line Chart)
  const dayWiseTrend = useMemo(() => {
    const dailyCounts = Productivity_History.reduce((acc, log) => {
      const date = format(parseISO(log.completedAt), "MMM dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(dailyCounts).map(date => ({ 
      date, 
      count: dailyCounts[date] 
    })).reverse();
  }, [Productivity_History]);

  // 2. Stage-Wise Completion Data (Horizontal Bar)
  const stageWiseData = useMemo(() => {
    const processCounts = Productivity_History.reduce((acc, log) => {
      const stage = log.stageName;
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(processCounts).map(name => ({ 
      name: name, 
      completions: processCounts[name]
    })).sort((a, b) => b.completions - a.completions);
  }, [Productivity_History]);

  // Dynamic height for the scrollable bar chart based on number of stages
  const chartHeight = Math.max(stageWiseData.length * 40, 300);

  return (
    <Box sx={{ width: "100%" }}>
      {/* KPI Section */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "TASKS DONE", value: Productivity_History.length, icon: <CheckCircle size={20} color="#4f46e5" />, bg: "#eef2ff" },
          { label: "LINE TOTAL", value: Assembly_Line_Traceability.length, icon: <Package size={20} color="#059669" />, bg: "#ecfdf5" },
          { label: "OPERATOR ID", value: operator_id, icon: <Activity size={20} color="#d97706" />, bg: "#fffbeb" },
        ].map((kpi, idx) => (
          <Grid item xs={4} key={idx}>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: kpi.bg, borderColor: "transparent" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                {kpi.icon}
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">{kpi.label}</Typography>
                  <Typography variant="h6" fontWeight="800" lineHeight={1.2}>{kpi.value}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Day-Wise Trend (Line Chart) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 350, border: "1px solid #e2e8f0" }} elevation={0}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <TrendingUp size={18} color="#4f46e5" />
              <Typography variant="subtitle2" fontWeight="bold">Daily Completion Trend</Typography>
            </Stack>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={dayWiseTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" style={{ fontSize: '10px' }} />
                <YAxis style={{ fontSize: '10px' }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Stage-Wise Horizontal Bar (With Scrollbar) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 350, border: "1px solid #e2e8f0", display: 'flex', flexDirection: 'column' }} elevation={0}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Stage-Wise Performance</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', pr: 1 }}>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={stageWiseData} layout="vertical" margin={{ left: 5, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} style={{ fontSize: '10px', fontWeight: 600 }} />
                  <Tooltip />
                  <Bar dataKey="completions" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent History */}
        <Grid item xs={12} md={5}>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, height: 350 }}>
            <Box sx={{ p: 1.5, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <History size={16} />
                <Typography variant="subtitle2" fontWeight="bold">My Recent Logs (5)</Typography>
              </Stack>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '11px' }}>Stage Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '11px' }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Productivity_History.slice(0, 5).map((log, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: '10px' }}>{log.stageName}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '10px', color: 'text.secondary' }}>
                      {format(parseISO(log.completedAt), "dd MMM, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Traceability Table */}
        <Grid item xs={12} md={7}>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, height: 350, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1.5, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <Typography variant="subtitle2" fontWeight="bold">Assembly Line Traceability</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '11px' }}>Serial No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '11px' }}>Stage</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '11px' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Assembly_Line_Traceability.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontSize: '10px', fontWeight: 'bold' }}>{row.serialNo}</TableCell>
                      <TableCell>
                        <Chip label={row.currentStage} size="small" variant="filled" sx={{ height: 18, fontSize: '9px', bgcolor: '#f1f5f9' }} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '10px' }}>
                        {format(parseISO(row.assignedDate), "dd/MM/yy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={Assembly_Line_Traceability.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              sx={{ borderTop: "1px solid #e2e8f0", ".MuiTablePagination-toolbar": { minHeight: 35 } }}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};
export default OperatorAnalyticsDashboard;