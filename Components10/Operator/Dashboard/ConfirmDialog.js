/**
 * ConfirmDialog.js
 * -----------------------------------------
 * This dialog is used when user clicks:
 * - Stop
 * - Complete
 * - Reset
 *
 * It just shows confirmation popup.
 * The actual update logic is handled outside.
 */

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onClose}>

      <DialogTitle>Confirm</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button onClick={onConfirm}>
          Yes
        </Button>
      </DialogActions>

    </Dialog>
  );
}
