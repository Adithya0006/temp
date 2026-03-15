import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Chip,
  CircularProgress,
  Typography,
  Tooltip,
  Avatar,
  Stack,
  Divider
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

/* =====================================================
   STYLING CONSTANTS & COLOR LOGIC
===================================================== */
const COLORS = {
  expert: "#6b21a8", // Purple
  skilled: "#166534", // Green
  medium: "#854d0e", // Gold
  risk: "#991b1b", // Red
  header: "#0f172a",
  bg: "#f8fafc",
  border: "#e2e8f0"
};

function getColor(mrlString) {
  if (!mrlString) return "#64748b";
  const level = parseInt(mrlString.split("-")[1]);
  if (level === 8) return COLORS.expert;
  if (level >= 6) return COLORS.skilled;
  if (level >= 4) return COLORS.medium;
  if (level === 3) return COLORS.risk;
  return "#475569";
}

export default function SkillMatrixDashboard() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------
     FETCH REAL API DATA
  ---------------------------------------------- */
  useEffect(() => {
    setLoading(true);
    // Fetching from your updated FastAPI endpoint
    axios.get("http://localhost:8000/getmrldetails_dashboard")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  /* ----------------------------------------------
     DATA TRANSFORMATION
  ---------------------------------------------- */
  
  // Extract and sort unique Stage IDs numerically
  const allMrls = data.flatMap(d => d.mrls);
  const sortedStages = [...new Map(allMrls.map(m => [m.stage_id, m.stage_name])).entries()]
    .sort((a, b) => a[0] - b[0]); 

  // Cell data lookup
  const getCellData = (staffNo, stageId) => {
    const staff = data.find(d => d.staff_no === staffNo);
    return staff?.mrls.find(m => m.stage_id === stageId);
  };

  /* ----------------------------------------------
     ANALYTICS PREP
  ---------------------------------------------- */
  const mrlCounts = {};
  allMrls.forEach(m => { mrlCounts[m.mrl] = (mrlCounts[m.mrl] || 0) + 1; });
  const mrlChart = Object.keys(mrlCounts).map(k => ({ name: k, value: mrlCounts[k] }));

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: COLORS.bg }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress thickness={5} size={60} />
        <Typography variant="h6" color="textSecondary">Loading Production Data...</Typography>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: COLORS.bg, minHeight: "100vh" }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
            Skill Matrix Management
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
            Real-time Competency Tracking & MRL Certification Dashboard
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          Last Updated: {new Date().toLocaleString()}
        </Typography>
      </Box>

      <Tabs 
        value={tab} 
        onChange={(e, v) => setTab(v)}
        sx={{ 
          mb: 3, 
          '& .MuiTab-root': { fontWeight: 700, fontSize: '1rem', textTransform: 'none' }
        }}
      >
        <Tab label="Production Matrix" />
        <Tab label="Workforce Analytics" />
      </Tabs>

      {/* =====================================================
         MATRIX TAB with FIXED COLUMN & HEADERS
      ===================================================== */}
      {tab === 0 && (
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            border: `1px solid ${COLORS.border}`, 
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          }}
        >
          {/* Scrollable Container with defined height */}
          <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {/* FIXED COLUMN HEADER */}
                  <TableCell 
                    sx={{ 
                      bgcolor: COLORS.header, 
                      color: "white", 
                      fontWeight: 800, 
                      position: "sticky", 
                      left: 0, 
                      zIndex: 100, // Highest Z-index for the corner
                      minWidth: 240,
                      borderBottom: "2px solid #1e293b"
                    }}
                  >
                    Operator & Staff No.
                  </TableCell>
                  
                  {/* STICKY ROW HEADERS */}
                  {sortedStages.map(([id, name]) => (
                    <Tooltip key={id} title={name} arrow placement="top">
                      <TableCell 
                        align="center" 
                        sx={{ 
                          bgcolor: COLORS.header, 
                          color: "white", 
                          fontWeight: 700, 
                          minWidth: 100,
                          cursor: "help",
                          zIndex: 50,
                          borderLeft: "1px solid #1e293b",
                          borderBottom: "2px solid #1e293b"
                        }}
                      >
                        S{id}
                      </TableCell>
                    </Tooltip>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((staff) => (
                  <TableRow key={staff.staff_no} hover>
                    {/* FIXED LEFT COLUMN */}
                    <TableCell 
                      sx={{ 
                        position: "sticky", 
                        left: 0, 
                        bgcolor: "white", 
                        zIndex: 40,
                        borderRight: `2px solid ${COLORS.bg}`,
                        boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)"
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: "#3b82f6", width: 32, height: 32, fontSize: '0.85rem', fontWeight: 700 }}>
                          {staff.staff_name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, color: "#1e293b" }}>
                            {staff.staff_name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                            {staff.staff_no}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* MATRIX DATA CELLS */}
                    {sortedStages.map(([id]) => {
                      const mrlInfo = getCellData(staff.staff_no, id);
                      return (
                        <TableCell key={id} align="center" sx={{ borderLeft: `1px solid ${COLORS.border}` }}>
                          {mrlInfo ? (
                            <Box sx={{ py: 0.5 }}>
                              <Chip 
                                label={mrlInfo.mrl} 
                                size="small"
                                sx={{ 
                                  bgcolor: getColor(mrlInfo.mrl), 
                                  color: "white", 
                                  fontWeight: 900,
                                  fontSize: '0.65rem',
                                  height: 20,
                                  borderRadius: '4px'
                                }} 
                              />
                              <Typography sx={{ fontSize: "0.6rem", mt: 0.2, color: "#64748b", fontWeight: 700 }}>
                                {mrlInfo.exp}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography sx={{ color: "#e2e8f0", fontWeight: 900 }}>·</Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* =====================================================
         ANALYTICS TAB
      ===================================================== */}
      {tab === 1 && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" }, gap: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}` }} elevation={0}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>MRL Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={mrlChart} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5}
                >
                  {mrlChart.map((entry, i) => <Cell key={i} fill={getColor(entry.name)} />)}
                </Pie>
                <ChartTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}` }} elevation={0}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>Qualified Processes per Operator</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.map(s => ({ name: s.staff_name, count: s.mrls.length }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip cursor={{fill: COLORS.bg}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      )}
    </Box>
  );
}