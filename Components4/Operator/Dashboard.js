import React, { useMemo, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

// --------------------------------------------
// Get staffNumber from user object consistently
// --------------------------------------------
const getStaffId = (currentUser) => {
  if (!currentUser) return null;
  return (
    currentUser.staffNumber ||
    currentUser.staff_number ||
    currentUser.staff ||
    currentUser.staffId ||
    null
  );
};

export default function OperatorDashboard({
  onLogout,
  role,
  currentUser,
  inActionPCBs = [],
  updateInActionPCBs,
}) {
  const staffId = getStaffId(currentUser);

  // ----------------------------------------------------
  // Find all PCBs where THIS operator has assigned ops
  // ----------------------------------------------------
  const assignedPCBs = useMemo(() => {
    return inActionPCBs
      .map((pcb) => {
        const pcbKey = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;

        // assignedTo is array of { staffNumber, name }
        const assignedOps = (pcb.linkedOperations || [])
          .map((op, idx) => ({
            ...op,
            __globalIndex: idx, // for seq control
          }))
          .filter((op) =>
            (op.assignedTo || []).some(
              (a) => String(a.staffNumber) === String(staffId)
            )
          );

        if (assignedOps.length === 0) return null;

        return {
          pcb,
          pcbKey,
          serial: pcb[pcbKey],
          assignedOps,
        };
      })
      .filter(Boolean);
  }, [inActionPCBs, staffId]);

  // active tab index per PCB
  const [activeTabMap, setActiveTabMap] = useState({});
  const setActiveFor = (pcbSerial, idx) =>
    setActiveTabMap((prev) => ({ ...prev, [pcbSerial]: idx }));

  // --------------------------------------------
  // Check if operation is unlocked (sequential)
  // --------------------------------------------
  const isOpUnlocked = (pcb, opGlobalIndex) => {
    if (opGlobalIndex === 0) return true;

    const prevOp = pcb.linkedOperations[opGlobalIndex - 1];
    if (!prevOp) return true;

    return prevOp.status === "Completed";
  };

  // --------------------------------------------
  // MARK OPERATION AS COMPLETED
  // --------------------------------------------
  const handleCompleteOperation = (pcbSerial, opGlobalIndex) => {
    if (typeof updateInActionPCBs !== "function") {
      alert("updateInActionPCBs missing — cannot save!");
      return;
    }

    updateInActionPCBs((prev) =>
      prev.map((pcb) => {
        const key = pcb._pcb_key_id || PCB_SERIAL_KEY_FALLBACK;
        if (pcb[key] === pcbSerial) {
          const updatedOps = [...pcb.linkedOperations];
          updatedOps[opGlobalIndex] = {
            ...updatedOps[opGlobalIndex],
            status: "Completed",
          };

          return {
            ...pcb,
            linkedOperations: updatedOps,
          };
        }
        return pcb;
      })
    );

    alert("Operation marked as COMPLETED");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <AppBar position="static" sx={{ bgcolor: "info.main" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Operator Dashboard
          </Typography>

          <Typography variant="body2" sx={{ mr: 2 }}>
            {currentUser?.name} ({currentUser?.staffNumber})
          </Typography>

          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Assigned Work
        </Typography>

        {/* If operator has NO assignments */}
        {assignedPCBs.length === 0 ? (
          <Paper sx={{ p: 3 }}>
            <Typography>
              No assigned operations found for you right now.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {assignedPCBs.map(({ pcb, pcbKey, serial, assignedOps }) => {
              // Sort by actual PCB sequence (S.No)
              const ordered = assignedOps.sort(
                (a, b) => a.__globalIndex - b.__globalIndex
              );

              const activeIndex = activeTabMap[serial] ?? 0;

              return (
                <Grid item xs={12} md={6} key={serial}>
                  <Card>
                    <CardContent>
                      {/* PCB header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle1">
                          PCB: {serial}
                        </Typography>

                        <Chip
                          label={`${ordered.length} assigned`}
                          size="small"
                        />
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Tabs */}
                      <Tabs
                        value={activeIndex}
                        onChange={(e, newIdx) => {
                          const targetOp = ordered[newIdx];
                          if (!targetOp) return;

                          const globalIndex = targetOp.__globalIndex;

                          if (
                            isOpUnlocked(pcb, globalIndex) ||
                            pcb.linkedOperations[globalIndex].status ===
                              "Completed"
                          ) {
                            setActiveFor(serial, newIdx);
                          } else {
                            alert(
                              "Previous operation is not completed yet!"
                            );
                          }
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                      >
                        {ordered.map((op, idx) => {
                          const globalIndex = op.__globalIndex;
                          const opStatus =
                            pcb.linkedOperations[globalIndex].status;

                          const unlocked =
                            isOpUnlocked(pcb, globalIndex) ||
                            opStatus === "Completed";

                          return (
                            <Tab
                              key={op["Operation Name"] + idx}
                              label={`${op["S.No"]}. ${op["Operation Name"]}`}
                              disabled={!unlocked}
                            />
                          );
                        })}
                      </Tabs>

                      {/* TAB PANEL */}
                      <Box sx={{ mt: 2 }}>
                        {ordered.map((op, idx) => {
                          if (idx !== activeIndex) return null;

                          const globalIndex = op.__globalIndex;
                          const opObj =
                            pcb.linkedOperations[globalIndex];

                          const opStatus = opObj.status;

                          const unlocked =
                            isOpUnlocked(pcb, globalIndex) ||
                            opStatus === "Completed";

                          return (
                            <Box key={op["Operation Name"] + "-panel"}>
                              <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                              >
                                {op["Operation Name"]}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                PCB: <strong>{serial}</strong> • S.No:{" "}
                                {op["S.No"]} • Status:{" "}
                                <strong>{opStatus}</strong>
                              </Typography>

                              {/* Show assigned operators */}
                              <Typography sx={{ mb: 2 }}>
                                Assigned Operators:{" "}
                                {opObj.assignedTo
                                  .map(
                                    (a) =>
                                      `${a.name} (${a.staffNumber})`
                                  )
                                  .join(", ")}
                              </Typography>

                              {/* ACTION BUTTONS */}
                              <Box sx={{ display: "flex", gap: 2 }}>
                                {/* COMPLETE BUTTON */}
                                <Button
                                  variant="contained"
                                  color="primary"
                                  disabled={
                                    !unlocked ||
                                    opStatus === "Completed"
                                  }
                                  onClick={() =>
                                    handleCompleteOperation(
                                      serial,
                                      globalIndex
                                    )
                                  }
                                >
                                  Mark Completed
                                </Button>

                                {/* NEXT BUTTON */}
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    const next = idx + 1;
                                    if (next >= ordered.length)
                                      return;

                                    const nextOp = ordered[next];
                                    const nextGlobalIndex =
                                      nextOp.__globalIndex;

                                    if (
                                      isOpUnlocked(
                                        pcb,
                                        nextGlobalIndex
                                      ) ||
                                      pcb.linkedOperations[
                                        nextGlobalIndex
                                      ].status === "Completed"
                                    ) {
                                      setActiveFor(serial, next);
                                    } else {
                                      alert(
                                        "Next operation is locked until previous is finished."
                                      );
                                    }
                                  }}
                                >
                                  Next
                                </Button>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
