/**
 * ProcessFormDialog.js
 * -----------------------------------------
 * This file shows the PROCESS FORM dialog window.
 *
 * It opens when operator:
 * - Clicks Start
 * - Clicks Open Form
 *
 * It loads ProcessFormPage and closes automatically
 * when Save is clicked.
 */

import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

// Existing form page (NO CHANGE)
import ProcessFormPage from "../ProcessForms/ProcessFormPage";

export default function ProcessFormDialog({
  open,
  setOpen,
  activeForm,
  currentUser,
  performAction,
}) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={() => setOpen(false)}
    >
      <DialogTitle>Process Form</DialogTitle>

      <DialogContent>
        {activeForm && (
          <ProcessFormPage
            pcbSerial={activeForm.pcbSerial}
            stageId={activeForm.stageId}
            operator={currentUser}

            onSaveComplete={() => {

              // ✅ Mark process Complete
              performAction({
                action: "complete",
                pcbSerial: activeForm.pcbSerial,
                opIndex: activeForm.stageId - 1
              });

              // ✅ Close dialog
              setOpen(false);
            }}
          />
        )}
      </DialogContent>

    </Dialog>
  );
}
