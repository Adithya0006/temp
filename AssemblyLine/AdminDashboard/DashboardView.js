// src/components/AdminDashboard/DashboardView.jsx
// This file is related to Dashboard Card! Graph
import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#FFD600", "#37474F"];

export default function DashboardView() {
  const data = [
    { name: "Pending Tasks", value: 10 },
    { name: "Completed Tasks", value: 25 },
  ];

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography>Task Status</Typography>
            <PieChart width={300} height={250}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography>Summary</Typography>
            <Typography mt={1}>Total Projects: 8</Typography>
            <Typography>Total Processes: 15</Typography>
            <Typography>Total Operators: 5</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
