// src/components/AdminDashboard/ManageUsers.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, MenuItem } from "@mui/material";

export default function ManageUsers() {
  const [user, setUser] = useState({ name: "", role: "" });
  const roles = ["Supervisor (Internal)", "Supervisor (External)", "Operator"];

  const handleSubmit = () => {
    if (!user.name || !user.role) {
      alert("Please fill all fields!");
      return;
    }
    alert(`${user.role} created successfully!`);
    setUser({ name: "", role: "" });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Create Supervisor / Operator
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} maxWidth={400}>
        <TextField
          label="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <TextField
          select
          label="Role"
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create User
        </Button>
      </Box>
    </Paper>
  );
}
