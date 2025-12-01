// This file controls operator screen flow
import React, { useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";

import OperatorHeader from "./OperatorHeader";
import OperatorTabs from "./OperatorTabs";
import ProcessTable from "./ProcessTable";
import ConfirmDialog from "./ConfirmDialog";
import ProcessFormDialog from "./ProcessFormDialog";

import {
  getStaffId,
  fmt,
  getAssignedOperations,
  pcbsForTab,
  isRowLocked,
  isTabLocked,
  performActionHelper
} from "./operatorHelpers";

const PCB_SERIAL_KEY_FALLBACK = "PCB Serial Number";

export default function OperatorDashboard({
  onLogout,
  role,
  currentUser,
  inActionPCBs = [],
  updateInActionPCBs,
  pageSizeDefault = 10,
}) {
  const staffId = String(getStaffId(currentUser) || "");

  const [openForm, setOpenForm] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [lockedMessage, setLockedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const assignedOperations = useMemo(
    () => getAssignedOperations(inActionPCBs, staffId),
    [inActionPCBs, staffId]
  );

  useEffect(() => {
    if (activeTab >= assignedOperations.length) setActiveTab(0);
  }, [assignedOperations, activeTab]);

  const applyUpdate = (updater) => {
    if (typeof updateInActionPCBs === "function") {
      updateInActionPCBs((prev) => updater(Array.isArray(prev) ? prev : []));
    }
  };

  const performAction = (payload) => {
    applyUpdate((prev) =>
      performActionHelper(prev, payload, PCB_SERIAL_KEY_FALLBACK)
    );
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <OperatorHeader onLogout={onLogout} currentUser={currentUser} />

      <OperatorTabs
        assignedOperations={assignedOperations}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTabLocked={idx => isTabLocked(idx, activeTab, assignedOperations, inActionPCBs)}
        setLockedMessage={setLockedMessage}
      />

      {lockedMessage && <p style={{color:"orange"}}>{lockedMessage}</p>}

      <ProcessTable
        rows={pcbsForTab(inActionPCBs, assignedOperations, activeTab, staffId)}
        pageSize={pageSizeDefault}
        performAction={performAction}
        setOpenForm={setOpenForm}
        setActiveForm={setActiveForm}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          performAction(confirmPayload);
          setConfirmOpen(false);
        }}
      />

      <ProcessFormDialog
        open={openForm}
        setOpen={setOpenForm}
        activeForm={activeForm}
        currentUser={currentUser}
        performAction={performAction}
      />
    </Box>
  );
}
