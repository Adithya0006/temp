/**
 * HomeCards.js
 * -----------------------------------------
 * This file shows the FOUR CARDS on Admin Home:
 * 1. Master List
 * 2. In-Action
 * 3. Create Project
 * 4. Profile Creation
 *
 * Clicking on a card changes the view in AdminDashboard
 */

import React from "react";

import {
  Container,
  Typography,
  Paper,
  Grid
} from "@mui/material";

// MUI Icons
import StorageIcon from "@mui/icons-material/Storage";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function HomeCards({ setView }) {

  // Card definitions
  const cards = [
    {
      title: "Master List",
      icon: <StorageIcon sx={{ fontSize: 44, color: "primary.main" }} />,
      body: "View List of Projects",
      view: "master",
    },
    {
      title: "In-Action",
      icon: <PlayForWorkIcon sx={{ fontSize: 44, color: "success.main" }} />,
      body: "List of Active Pcbs",
      view: "inaction",
    },
    {
      title: "Create Project",
      icon: <UploadFileIcon sx={{ fontSize: 44, color: "warning.main" }} />,
      body: "Defining New project",
      view: "create",
    },
    {
      title: "Profile Creation",
      icon: <PersonAddIcon sx={{ fontSize: 44, color: "secondary.main" }} />,
      view: "profile",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{ mb: 3 }}
        style={{ textAlign: "center" }}
      >
        Admin Home
      </Typography>

      {/* Cards Grid */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
      >
        {cards.map((card, index) => (
          <Grid item xs={12} md={3} lg={3} key={index}>
            <Paper
              elevation={6}
              onClick={() => setView(card.view)}
              sx={{
                p: 3,
                cursor: "pointer",
                textAlign: "center",
                borderRadius: 3,

                // Same styles as original for equal cards
                width: "100%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",

                background: "linear-gradient(180deg, #ffffffcc, #ffffffee)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
                transition: "0.25s",

                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
                },
              }}
            >
              {/* Icon */}
              {card.icon}

              {/* Title */}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {card.title}
              </Typography>

              {/* Sub text */}
              <Typography variant="body2" color="text.secondary">
                {card.body}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
