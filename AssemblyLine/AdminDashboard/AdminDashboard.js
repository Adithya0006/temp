//Main Dashboard where all we can see all cards!


import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  PlaylistAdd as PlaylistAddIcon,
  Build as BuildIcon,
  GroupAdd as GroupAddIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  AccountCircle,
} from "@mui/icons-material";


// ======================================================================
// Sub-components -  These are assumed to be defined in other files.
// They represent the different views/forms the admin can access.
import AddProject from "./AddProject";
import AddProcess from "./AddProcess";
import ManageUsers from "./ManageUsers";
import DashboardView from "./DashboardView";
// =========================================================================


// ===========================================================================
// Define menu items with their corresponding components and icons
// This array holds the data for each card/option on the dashboard.
const menuItems = [
  {
    text: "Overview Dashboard", // Text displayed on the card
    description: "", // Description displayed on the card
    icon: <DashboardIcon fontSize="large" />, // Icon for the card
    component: <DashboardView />, // The component to render when the card is clicked
    color: "#1976d2", // Primary Blue - Used to style the icon
  },
  {
    text: "Manage Projects",
    description: "Create new projects",
    icon: <PlaylistAddIcon fontSize="large" />,
    component: <AddProject />,
    color: "#2e7d32", // Green
  },
  // {
  //   text: "Add Process",
  //   description: "Define new manufacturing processes.",
  //   icon: <BuildIcon fontSize="large" />,
  //   component: <AddProcess />,
  //   color: "#ed6c02", // Orange
  // },
  // {
  //   text: "Manage Users",
  //   description: "Administer user roles and permissions.",
  //   icon: <GroupAddIcon fontSize="large" />,
  //   component: <ManageUsers />,
  //   color: "#9c27b0", // Purple
  // },
];
// ===========================================================================



export default function AdminDashboard({ onLogout }) {
  const theme = useTheme();
  // State: 'null' means we are on the Home Card Grid view. 
  // Otherwise, it holds the selected menu item object.
  const [selectedView, setSelectedView] = useState(null);
  let user = JSON.parse(localStorage.getItem("user"));
  console.log("user from my",user)
  // Helper to return to the main grid
  const handleBackToHome = () => {
    setSelectedView(null);
  };

  // ---- The "Home Grid" Component ----
  const HomeCardGrid = () => (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.main">
          Welcome Back Administrator!
        </Typography>
        {/* <Typography variant="subtitle1" color="text.secondary">
          Select an action below to manage the system.
        </Typography> */}
      </Box>
      
      <Grid container spacing={4} justifyContent="center" >
        {menuItems.map((item) => (
          <Grid item key={item.text} xs={12} sm={6} md={4} lg={3} >
            <Card elevation={3}  sx={{height: "100%",borderRadius: 3,transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out","&:hover": {transform: "translateY(-8px)",boxShadow: theme.shadows[10],"& .MuiAvatar-root": {backgroundColor: item.color,color: "white"}},}}>
              <CardActionArea onClick={() => setSelectedView(item)} sx={{ height: "100%", p: 2 }}>
              {/* The onClick handler is passing the entire object representing the selected menu item to the setSelectedView state setter function, updating the component's state and causing it to render the appropriate content. item is not just a value; it's a complex object containing all the information about the card that was clicked. */}
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%"
                  }}
                >
                  {/* Colored Avatar for Icon */}
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.grey[100],
                      color: item.color,
                      width: 70,
                      height: 70,
                      mb: 2,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                    {item.text}
                  </Typography>
                   <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

   // ---- Main Render ----
   const THEME = { // Theme object for consistent styling.
    bg: "#f8fafc",
    primary: "#1e293b",
    accent: "#f59e0b", // Use for the Avatar color and other highlights
    cardBg: "#ffffff",
    textSecondary: "#64748b"
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f4f6f8"}}>
     <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar>
        {selectedView ? (
          <>
            <Tooltip
              title="Back to Dashboard"
              placement="left"
              sx={{
                '& .MuiTooltip-tooltip': {
                  borderRadius: 0, // Force rectangular shape
                  fontSize: '0.9rem', // Slightly smaller tooltip text
                },
                marginRight: '1px', // Adjusts spacing from title
              }}
            >
              <IconButton
                edge="start"
                color="primary"
                onClick={handleBackToHome}
                sx={{
                  mr: 0, // Remove automatic margin
                  color: theme.palette.primary.main, // Ensure icon color
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle hover effect
                  },
                  p: '1px', // Increase padding for a larger clickable area
                  '& .MuiSvgIcon': { // Styles the arrow icon within the IconButton
                      fontSize: '20px', // Increase icon size
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <IconButton edge="start" color="primary" sx={{ mr: 2, cursor: 'default' }} />
        )}
        <Typography variant="h6" component="div" sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 600,
        }}>
          {selectedView ? selectedView.text : "ADMIN DASHBOARD"}
        </Typography>
        <Box display="flex" alignItems="center" sx={{marginLeft: 'auto'}} >
            <AccountCircle />
            <Typography variant="body2" fontWeight="bold">
              {user.userRole}
            </Typography>
          </Box>
      </Toolbar>
    </AppBar>
      {/* Main Content Area - Switches between Grid and Selected Component */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedView ? (
          // Render the component selected from the card
          <Box >
             {selectedView.component}
          </Box>
        ) : (
          // Render the Home Grid
          <HomeCardGrid />
        )}
      </Box>
    </Box>
  );
}