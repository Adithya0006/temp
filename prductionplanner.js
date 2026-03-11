import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
  Typography
} from "@mui/material";

/* =========================================================
CONFIGURATION SECTION
Easy to modify later
========================================================= */

const WORKING_DAYS_PER_MONTH = 25;
const UTILIZATION_WARNING = 75;

/* =========================================================
MONTH LIST
========================================================= */

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

/* =========================================================
STAGE LIST
========================================================= */

const stages = [
  "SMT line",
  "Ionic Contamination",
  "FPT",
  "Gap welding",
  "ERSA",
  "Xray",
  "AOI",
  "Varnish",
  "Cleaning",
  "Visual Inspection",
  "ATE 1",
  "ATE 2"
];

export default function ProductionPlanningDashboard() {

  /* =========================================================
  TAB STATE
  ========================================================= */

  const [tab, setTab] = useState(0);

  /* =========================================================
  TAB1 → DEMAND DATA
  ========================================================= */

  const [rows, setRows] = useState(
    months.map((month) => ({
      month,
      hexa: "",
      octa: "",
      saved: false
    }))
  );

  /* =========================================================
  TAB2 → MACHINE CAPACITY DATA
  ========================================================= */

  const [stageRows, setStageRows] = useState(
    stages.map((stage) => ({
      stage,
      hoursPerShift: "",
      shiftsPerDay: "",
      manufacturingTime: "",
      saved: false
    }))
  );

  /* =========================================================
  DEMAND TABLE INPUT HANDLER
  ========================================================= */

  const handleChange = (index, field, value) => {

    const updated = [...rows];
    updated[index][field] = value;

    setRows(updated);
  };

  const handleSave = (index) => {

    const updated = [...rows];
    updated[index].saved = true;

    setRows(updated);
  };

  const handleEdit = (index) => {

    const updated = [...rows];
    updated[index].saved = false;

    setRows(updated);
  };

  /* =========================================================
  STAGE INPUT HANDLER
  ========================================================= */

  const handleStageChange = (index, field, value) => {

    const updated = [...stageRows];
    updated[index][field] = value;

    setStageRows(updated);
  };

  const handleStageSave = (index) => {

    const updated = [...stageRows];
    updated[index].saved = true;

    setStageRows(updated);
  };

  const handleStageEdit = (index) => {

    const updated = [...stageRows];
    updated[index].saved = false;

    setStageRows(updated);
  };

  /* =========================================================
  CALCULATE TOTAL TARGET UNITS
  (Equivalent to Excel cell F19)
  ========================================================= */

  const totalTargetUnits = rows.reduce((sum, r) => {

    return sum +
      (Number(r.hexa) || 0) +
      (Number(r.octa) || 0);

  }, 0);

  /* =========================================================
  UTILIZATION CALCULATION
  ========================================================= */

  const calculateUtilisation = (units, mfgTime, availableHours) => {

    if (!mfgTime || !availableHours) return 0;

    const demandHours =
      (units * mfgTime) / 60;

    const utilisation =
      (demandHours / availableHours) * 100;

    return Math.ceil(utilisation);
  };

  return (

    <Box sx={{ width: "100%", p: 3 }}>

      <Paper elevation={2}>

        {/* =====================================================
        TAB HEADER
        ===================================================== */}

        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
        >
          <Tab label="Monthly Demand"/>
          <Tab label="Stage Capacity"/>
          <Tab label="Utilisation Analysis"/>
        </Tabs>

        {/* =====================================================
        TAB1 → DEMAND TABLE
        ===================================================== */}

        {tab === 0 && (

          <Box sx={{ p: 3 }}>

            <Typography variant="h6">
              Monthly Production Demand
            </Typography>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>Month</TableCell>
                  <TableCell>Hexa</TableCell>
                  <TableCell>Octa</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Action</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {rows.map((row, i) => {

                  const total =
                    (Number(row.hexa) || 0) +
                    (Number(row.octa) || 0);

                  return (

                    <TableRow key={i}>

                      <TableCell>{row.month}</TableCell>

                      <TableCell>

                        <TextField
                          size="small"
                          type="number"
                          value={row.hexa}
                          disabled={row.saved}
                          onChange={(e) =>
                            handleChange(i,"hexa",e.target.value)
                          }
                        />

                      </TableCell>

                      <TableCell>

                        <TextField
                          size="small"
                          type="number"
                          value={row.octa}
                          disabled={row.saved}
                          onChange={(e) =>
                            handleChange(i,"octa",e.target.value)
                          }
                        />

                      </TableCell>

                      <TableCell>{total}</TableCell>

                      <TableCell>

                        {!row.saved ? (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSave(i)}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleEdit(i)}
                          >
                            Edit
                          </Button>
                        )}

                      </TableCell>

                    </TableRow>

                  );

                })}

              </TableBody>

            </Table>

          </Box>
        )}

        {/* =====================================================
        TAB2 → MACHINE CAPACITY
        ===================================================== */}

        {tab === 1 && (

          <Box sx={{ p: 3 }}>

            <Typography variant="h6">
              Stage Capacity Configuration
            </Typography>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>Stage</TableCell>
                  <TableCell>Hours/Shift</TableCell>
                  <TableCell>Shifts/Day</TableCell>
                  <TableCell>Hours/Day</TableCell>
                  <TableCell>Minutes/Day</TableCell>
                  <TableCell>Hours/Month</TableCell>
                  <TableCell>Mfg Time/Board</TableCell>
                  <TableCell>Units/Day</TableCell>
                  <TableCell>Action</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {stageRows.map((row, i) => {

                  const hoursPerDay =
                    (Number(row.hoursPerShift) || 0) *
                    (Number(row.shiftsPerDay) || 0);

                  const minutesPerDay =
                    hoursPerDay * 60;

                  const hoursPerMonth =
                    hoursPerDay * WORKING_DAYS_PER_MONTH;

                  const unitsPerDay =
                    row.manufacturingTime
                      ? Math.ceil(
                          minutesPerDay /
                          Number(row.manufacturingTime)
                        )
                      : 0;

                  return (

                    <TableRow key={i}>

                      <TableCell>{row.stage}</TableCell>

                      <TableCell>

                        <TextField
                          size="small"
                          type="number"
                          value={row.hoursPerShift}
                          disabled={row.saved}
                          onChange={(e)=>
                            handleStageChange(
                              i,
                              "hoursPerShift",
                              e.target.value
                            )
                          }
                        />

                      </TableCell>

                      <TableCell>

                        <TextField
                          size="small"
                          type="number"
                          value={row.shiftsPerDay}
                          disabled={row.saved}
                          onChange={(e)=>
                            handleStageChange(
                              i,
                              "shiftsPerDay",
                              e.target.value
                            )
                          }
                        />

                      </TableCell>

                      <TableCell>{hoursPerDay}</TableCell>

                      <TableCell>{minutesPerDay}</TableCell>

                      <TableCell>{hoursPerMonth}</TableCell>

                      <TableCell>

                        <TextField
                          size="small"
                          type="number"
                          value={row.manufacturingTime}
                          disabled={row.saved}
                          onChange={(e)=>
                            handleStageChange(
                              i,
                              "manufacturingTime",
                              e.target.value
                            )
                          }
                        />

                      </TableCell>

                      <TableCell>{unitsPerDay}</TableCell>

                      <TableCell>

                        {!row.saved ? (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleStageSave(i)}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleStageEdit(i)}
                          >
                            Edit
                          </Button>
                        )}

                      </TableCell>

                    </TableRow>

                  );

                })}

              </TableBody>

            </Table>

          </Box>
        )}

        {/* =====================================================
        TAB3 → UTILIZATION TABLE
        ===================================================== */}

        {tab === 2 && (

          <Box sx={{ p: 3 }}>

            <Typography variant="h6">
              Utilisation Analysis
            </Typography>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>Sl No</TableCell>
                  <TableCell>Stage</TableCell>
                  <TableCell>Available Hours</TableCell>
                  <TableCell>Hours/Day</TableCell>
                  <TableCell>Days Required</TableCell>

                  {months.map((m)=>(
                    <TableCell key={m}>{m}</TableCell>
                  ))}

                </TableRow>

              </TableHead>

              <TableBody>

                {stageRows.map((stage,i)=>{

                  const hoursPerDay =
                    stage.hoursPerShift *
                    stage.shiftsPerDay;

                  const minutesPerDay =
                    hoursPerDay * 60;

                  const hoursPerMonth =
                    hoursPerDay * WORKING_DAYS_PER_MONTH;

                  const unitsPerDay =
                    stage.manufacturingTime
                      ? Math.ceil(
                          minutesPerDay /
                          stage.manufacturingTime
                        )
                      : 0;

                  const daysRequired =
                    unitsPerDay
                      ? Math.ceil(
                          totalTargetUnits /
                          unitsPerDay
                        )
                      : 0;

                  return (

                    <TableRow key={i}>

                      <TableCell>{i+1}</TableCell>

                      <TableCell>{stage.stage}</TableCell>

                      <TableCell>{hoursPerMonth}</TableCell>

                      <TableCell>{hoursPerDay}</TableCell>

                      <TableCell>{daysRequired}</TableCell>

                      {months.map((m,mi)=>{

                        const units =
                          (Number(rows[mi]?.hexa)||0) +
                          (Number(rows[mi]?.octa)||0);

                        const utilisation =
                          calculateUtilisation(
                            units,
                            stage.manufacturingTime,
                            hoursPerMonth
                          );

                        return (

                          <TableCell
                            key={mi}
                            sx={{
                              backgroundColor:
                                utilisation >= UTILIZATION_WARNING
                                  ? "#ffcccc"
                                  : "inherit"
                            }}
                          >
                            {utilisation}%
                          </TableCell>

                        );

                      })}

                    </TableRow>

                  );

                })}

              </TableBody>

            </Table>

          </Box>
        )}

      </Paper>

    </Box>
  );
}
