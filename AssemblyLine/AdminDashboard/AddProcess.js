// process card (Add process)


import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function AddProcess() {
  const [form, setForm] = useState({ processName: "", description: "" });

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!form.processName || !form.description) {
      console.log("form.processName ",typeof(form.processName))
      alert("Please fill all fields!");
      return;
    }
    // Placeholder: in real app you'd call a prop to save to DB
    alert(`Process "${form.processName}" added (local demo).`);
    setForm({ processName: "", description: "" });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>Add Process</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={1} maxWidth={420} >
        <TextField label="Process Name" value={form.processName} onChange={(e) => setForm({ ...form, processName: e.target.value })} size="small" />
        <TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} size="small" />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button type="submit" variant="contained">Save Process</Button>
        </Box>
      </Box>
    </Paper>
  );
}
