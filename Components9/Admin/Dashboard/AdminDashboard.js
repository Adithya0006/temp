/**
 * AdminDashboard.js
 * ----------------------------------------------------
 * This file ONLY controls which Admin page is visible.
 * It does NOT contain table logic or file handling.
 * It just switches between pages (Home, Master, InAction, Create, Preview, Profile)
 */

import React, { useState } from "react";
import { Box } from "@mui/material";

import AdminHeader from "./AdminHeader";
import HomeCards from "./HomeCards";
import MasterView from "./MasterView";
import InActionView from "./InActionView";
import CreateProjectView from "./CreateProjectView";
import PreviewView from "./PreviewView";
import ProfileView from "./ProfileView";

// This component receives all data from App.js
export default function AdminDashboard({
  onLogout,
  addInActionPCBs,
  deleteInActionPCB,
  masterList,
  setMasterList,
  inActionList,
  setInActionList
}) {

  // Which screen is currently visible
  const [view, setView] = useState("home");

  // Preview upload states
  const [uploadedPreviewData, setUploadedPreviewData] = useState(null);
  const [previewColumns, setPreviewColumns] = useState([]);

  // Detected PCB Serial Number column name
  const [pcbSerialKey, setPcbSerialKey] = useState("serial number");

  // Selected checkboxes inside Master list
  const [selectedIds, setSelectedIds] = useState(new Set());

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
      }}
    >

      {/* Top Bar */}
      <AdminHeader
        onLogout={onLogout}
        onHome={() => setView("home")}
      />

      {/* Dashboard router */}
      {view === "home" && <HomeCards setView={setView} />}

      {view === "master" && (
        <MasterView
          masterList={masterList}
          setMasterList={setMasterList}
          setInActionList={setInActionList}
          addInActionPCBs={addInActionPCBs}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          setPcbSerialKey={setPcbSerialKey}
          setView={setView}
        />
      )}

      {view === "inaction" && (
        <InActionView
          inActionList={inActionList}
          deleteInActionPCB={deleteInActionPCB}
          pcbSerialKey={pcbSerialKey}
          setView={setView}
        />
      )}

      {view === "create" && (
        <CreateProjectView
          setUploadedPreviewData={setUploadedPreviewData}
          setPreviewColumns={setPreviewColumns}
          setPcbSerialKey={setPcbSerialKey}
          setView={setView}
        />
      )}

      {view === "preview" && uploadedPreviewData && (
        <PreviewView
          uploadedPreviewData={uploadedPreviewData}
          previewColumns={previewColumns}
          setUploadedPreviewData={setUploadedPreviewData}
          setPreviewColumns={setPreviewColumns}
          setMasterList={setMasterList}
          setView={setView}
        />
      )}

      {view === "profile" && <ProfileView setView={setView} />}

    </Box>
  );
}
