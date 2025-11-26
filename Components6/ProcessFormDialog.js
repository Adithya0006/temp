import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";

// Hardcoded configs (can connect DB later)
export const operationFieldConfig = {
    "Labeling & Traceability of Bare PCB": [
  { 
    name: "startDateTime", 
    label: "Start Date & Time", 
    type: "datetime-local", 
    required: true 
  },

  { 
    name: "endDateTime", 
    label: "End Date & Time", 
    type: "datetime-local", 
    required: true 
  },

  { 
    name: "pcbSerialNumber", 
    label: "PCB Serial Number", 
    type: "text", 
    required: true 
  },

  { 
    name: "pcbDateCode", 
    label: "Date Code of PCB", 
    type: "text", 
    required: true 
  },

  { 
    name: "pcbGRNumber", 
    label: "GR Number of PCB", 
    type: "text", 
    required: true 
  },

  { 
    name: "operatorDetails", 
    label: "Operator Details", 
    type: "text"
  },

  { 
    name: "labelGRDetails", 
    label: "GR Details of Label", 
    type: "text"
  }
],
  Cleaning: [
    { name: "cleaningProgramNo", label: "Cleaning Program No", type: "text", required: true },
    { name: "cleaningAgent", label: "Cleaning Agent", type: "text" },
    { name: "grBatchNo", label: "GR Batch No", type: "text" },
    { name: "shelfLife", label: "Shelf Life", type: "date" }
  ],

  Reflow: [
    { name: "tempProfile", label: "Temperature Profile", type: "text" },
    { name: "ovenModel", label: "Oven Model", type: "text" },
    { name: "spcFile", label: "SPC Report", type: "file" }
  ],

  AOI: [
    { name: "machine", label: "Machine Name", type: "text" },
    { name: "program", label: "Program No", type: "text" },
    { name: "remarks", label: "Remarks", type: "text" }
  ]
};

export default function ProcessFormDialog({ open, onClose, operationName, pcbSerial, onSave }) {
  const fields = operationFieldConfig[operationName] || [];
  const [formData, setFormData] = useState({});
  const [fileUploads, setFileUploads] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setFileUploads(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = () => {
    onSave({ pcbSerial, operationName, formData, fileUploads });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{operationName} — Additional Details</DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ mb: 2 }}>
          PCB Serial: <b>{pcbSerial}</b>
        </Typography>

        <Grid container spacing={2}>
          {fields.map(field => (
            <Grid item xs={12} key={field.name}>
              {field.type !== "file" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <Box>
                  <Typography>{field.label}</Typography>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                  />
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
