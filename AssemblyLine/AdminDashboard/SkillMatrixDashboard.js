


import React, { useState, useEffect } from "react";
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
  Chip
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

/* =====================================================
   MOCK DATA
   -----------------------------------------------------
   This simulates the Excel data you uploaded.
   Later this will come from backend API.
===================================================== */

const mockData = [

  { pcbProcessName: "Printer", assignedToName: "Ravi", assignedToNameMRL: "MRL-6" },
  { pcbProcessName: "PickPlace1", assignedToName: "Ravi", assignedToNameMRL: "MRL-5" },
  { pcbProcessName: "Reflow", assignedToName: "Ravi", assignedToNameMRL: "MRL-3" },

  { pcbProcessName: "Printer", assignedToName: "Kiran", assignedToNameMRL: "MRL-4" },
  { pcbProcessName: "PickPlace1", assignedToName: "Kiran", assignedToNameMRL: "MRL-6" },
  { pcbProcessName: "AOI", assignedToName: "Kiran", assignedToNameMRL: "MRL-5" },

  { pcbProcessName: "Printer", assignedToName: "Suresh", assignedToNameMRL: "MRL-3" },
  { pcbProcessName: "Reflow", assignedToName: "Suresh", assignedToNameMRL: "MRL-6" },

  { pcbProcessName: "AOI", assignedToName: "Mahesh", assignedToNameMRL: "MRL-8" },
  { pcbProcessName: "PickPlace1", assignedToName: "Mahesh", assignedToNameMRL: "MRL-4" }

];


/* =====================================================
   FUNCTION TO DECIDE COLOR BASED ON MRL LEVEL
===================================================== */

function getColor(mrlString) {

  const level = parseInt(mrlString.split("-")[1]);

  if (level === 8) return "#8e24aa";       // purple expert
  if (level >= 6) return "#2e7d32";        // green skilled
  if (level >= 4) return "#f9a825";        // yellow medium
  if (level === 3) return "#c62828";       // red risk

  return "#90a4ae";
}



/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function SkillMatrixDashboard() {

  /* ----------------------------------------------
     TAB STATE
  ---------------------------------------------- */

  const [tab, setTab] = useState(0);


  /* ----------------------------------------------
     DATA STATE
     For now we load mock data
     Later API will replace this
  ---------------------------------------------- */

  const [data, setData] = useState(mockData);


  /* ----------------------------------------------
     FUTURE BACKEND API CALL (COMMENTED)
  ---------------------------------------------- */

  /*
  useEffect(() => {

    axios.get("/api/operator-skill-matrix")
      .then(res => {
        setData(res.data)
      })

  }, [])
  */


  /* ----------------------------------------------
     EXTRACT UNIQUE OPERATORS (Y axis)
  ---------------------------------------------- */

  const operators = [...new Set(data.map(d => d.assignedToName))];


  /* ----------------------------------------------
     EXTRACT UNIQUE STAGES (X axis)
     This allows support for 40+ operations
  ---------------------------------------------- */

  const stages = [...new Set(data.map(d => d.pcbProcessName))];


  /* ----------------------------------------------
     CREATE LOOKUP TABLE
     So we can quickly find cell values
     Example key:
     Ravi-Printer
  ---------------------------------------------- */

  const lookup = {};

  data.forEach(item => {

    const key = item.assignedToName + "-" + item.pcbProcessName;

    lookup[key] = item.assignedToNameMRL;

  });


  /* =====================================================
     ANALYTICS SECTION
     Using simple loops (no useMemo)
  ===================================================== */


  /* ---------- MRL DISTRIBUTION ---------- */

  const mrlDistribution = {};

  data.forEach(d => {

    if (!mrlDistribution[d.assignedToNameMRL]) {

      mrlDistribution[d.assignedToNameMRL] = 0;

    }

    mrlDistribution[d.assignedToNameMRL]++;

  });

  const mrlChart = Object.keys(mrlDistribution).map(k => ({
    name: k,
    value: mrlDistribution[k]
  }));



  /* ---------- OPERATOR SKILL COUNT ---------- */

  const operatorSkills = {};

  data.forEach(d => {

    if (!operatorSkills[d.assignedToName]) {

      operatorSkills[d.assignedToName] = 0;

    }

    operatorSkills[d.assignedToName]++;

  });

  const operatorChart = Object.keys(operatorSkills).map(k => ({
    name: k,
    skills: operatorSkills[k]
  }));



  /* ---------- STAGE COVERAGE ---------- */

  const stageCoverage = {};

  data.forEach(d => {

    if (!stageCoverage[d.pcbProcessName]) {

      stageCoverage[d.pcbProcessName] = 0;

    }

    stageCoverage[d.pcbProcessName]++;

  });

  const stageChart = Object.keys(stageCoverage).map(k => ({
    stage: k,
    operators: stageCoverage[k]
  }));



  /* =====================================================
     UI STARTS HERE
  ===================================================== */

  return (

    <Box sx={{ padding: 2 }}>


      {/* ----------------------------------------------
         TAB SWITCH
      ---------------------------------------------- */}

      <Tabs value={tab} onChange={(e, v) => setTab(v)}>

        <Tab label="Matrix" />
        <Tab label="Analytics" />

      </Tabs>



      {/* =====================================================
         MATRIX TAB
      ===================================================== */}

      {tab === 0 && (

        <Paper sx={{ marginTop: 2, overflow: "auto", borderRadius: 3 }}>

          <Table size="small">

            <TableHead>

              <TableRow sx={{ background: "#111827" }}>

                {/* Sticky operator column */}

                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    position: "sticky",
                    left: 0,
                    background: "#111827"
                  }}
                >
                  Operator
                </TableCell>


                {/* Stage headers */}

                {stages.map(stage => (

                  <TableCell
                    key={stage}
                    align="center"
                    sx={{ color: "white", minWidth: 140 }}
                  >

                    {stage}

                  </TableCell>

                ))}

              </TableRow>

            </TableHead>



            <TableBody>

              {operators.map(operator => (

                <TableRow key={operator} hover>


                  {/* Operator name */}

                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      background: "#f3f4f6",
                      fontWeight: 600
                    }}
                  >

                    {operator}

                  </TableCell>



                  {/* MATRIX CELLS */}

                  {stages.map(stage => {

                    const key = operator + "-" + stage;

                    const value = lookup[key];

                    return (

                      <TableCell key={stage} align="center">

                        {value && (

                          <Chip
                            label={value}
                            sx={{
                              background: getColor(value),
                              color: "white",
                              fontWeight: 600
                            }}
                          />

                        )}

                      </TableCell>

                    );

                  })}

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </Paper>

      )}



      {/* =====================================================
         ANALYTICS TAB
      ===================================================== */}

      {tab === 1 && (

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            marginTop: 2
          }}
        >


          {/* ---------- MRL DISTRIBUTION ---------- */}

          <Paper sx={{ padding: 2, borderRadius: 3 }}>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={mrlChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >

                  {mrlChart.map((entry, i) => (

                    <Cell key={i} fill={getColor(entry.name)} />

                  ))}

                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </Paper>



          {/* ---------- OPERATOR SKILLS ---------- */}

          <Paper sx={{ padding: 2, borderRadius: 3 }}>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={operatorChart}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip />
                <Legend />

                <Bar dataKey="skills" fill="#1976d2" />

              </BarChart>

            </ResponsiveContainer>

          </Paper>



          {/* ---------- STAGE COVERAGE ---------- */}

          <Paper sx={{ padding: 2, borderRadius: 3 }}>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={stageChart}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="stage" />
                <YAxis />

                <Tooltip />
                <Legend />

                <Bar dataKey="operators" fill="#43a047" />

              </BarChart>

            </ResponsiveContainer>

          </Paper>

        </Box>

      )}

    </Box>

  );
}





