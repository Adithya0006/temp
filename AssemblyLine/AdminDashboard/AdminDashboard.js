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
import { Button } from "antd";
import ProductionPlanner from "./ProductionPlanner";
import MonthlyProductionTableFixed from "./ProductionPlanner";
import MonthlyProductionTabs from "./ProductionPlanner";
import MonthlyProductionTwoTabs from "./ProductionPlanner";
import MonthlyProductionThreeTabs from "./ProductionPlanner";
import ProductionPlanningDashboard from "./ProductionPlanner";
import SMTIndustrialMatrix from "./SMTIndustrialMatrix";
import SkillMatrixDashboard from "./SkillMatrixDashboard";
// =========================================================================


// ===========================================================================
// Define menu items with their corresponding components and icons
// This array holds the data for each card/option on the dashboard.
const card = [
  {
    text: "Overview Dashboard", // Text displayed on the card
    description: "View charts, workload distribution, and PCB analytics.", // Description displayed on the card
    icon: <DashboardIcon fontSize="large"  sx={{ fontSize: 60, color: "#6366f1" }}/>, // Icon for the card
    component: <DashboardView  />, // The component to render when the card is clicked
    color: "#1976d2", // Primary Blue - Used to style the icon
  },
  {
    text: "Manage Projects",
    description: "Create new projects",
    icon: <PlaylistAddIcon fontSize="large" sx={{ fontSize: 60, color: "#6366f1" }} />,
    component: <AddProject />,
    color: "#2e7d32", // Green
  },
  {
    text: "Production Planner",
    description: "P",
    icon: <BuildIcon fontSize="large" />,
    component: <ProductionPlanningDashboard />,
    color: "#ed6c02", // Orange
  },
  {
    text: "Machine Module",
    description: "Administer user roles and permissions.",
    icon: <GroupAddIcon fontSize="large" />,
    component: <SMTIndustrialMatrix />,
    color: "#9c27b0", // Purple
  },
  {
    text: "MRL Dashboard",
    description: "Administer user roles and permissions.",
    icon: <GroupAddIcon fontSize="large" />,
    component: <SkillMatrixDashboard />,
    color: "#9c27b0", // Purple
  },
];
// ===========================================================================



export default function AdminDashboard({ onLogout }) {
  const theme = useTheme();
  // State: 'null' means we are on the Home Card Grid view. 
  // Otherwise, it holds the selected menu item object.
  const [selectedView, setSelectedView] = useState(null);
  let user = JSON.parse(localStorage.getItem("user"));
  // console.log("user from my",user)
  // Helper to return to the main grid
  const handleBackToHome = () => {
    setSelectedView(null);
  };

  // ---- The "Home Grid" Component ----
  const HomeCardGrid = () => (
    <Container maxWidth="lg" sx={{  mb: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.main">
          Welcome Back Administrator!
        </Typography>
        {/* <Typography variant="subtitle1" color="text.secondary">
          Select an action below to manage the system.
        </Typography> */}
      </Box>
      
      <Grid container spacing={4} justifyContent="center" >
  {card.map((item) => (
    <Grid item key={item.text} xs={12} sm={6} md={4} lg={3} >
      <Card elevation={3} sx={{
        height: 300,
        borderRadius: 5,
        background: THEME.gradientCard,
        boxShadow: THEME.shadowSoft,
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.8)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "&:hover": {
          transform: "translateY(-10px) scale(1.02)",
          boxShadow: THEME.shadowHover
        },
        "&:hover .hover-content": {
          opacity: 1,
          transform: "translateY(0)"
        },
        "&:hover .default-content": {
          opacity: 0.3,
          transform: "translateY(-20px)"
        }
      }}>
        <CardActionArea onClick={() => setSelectedView(item)} sx={{ height: "100%", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <CardContent>
            <Box className="default-content" sx={{ transition: "all 0.4s ease", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{
                p: 4,
                borderRadius: "50%",
                background: item.gradient, // Use item.gradient
                mb: 3,
                boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {item.icon} 
              </Box>
              <Typography variant="h5" fontWeight="700" sx={{ color: "#334155" }}>
                {item.text} 
              </Typography>
            </Box>
            <Box
              className="hover-content"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "40%",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                opacity: 0,
                transform: "translateY(100%)",
                transition: "all 0.3s ease-in-out",
                borderTop: "1px solid #e2e8f0"
              }}
            >
              <Typography variant="body1" color="text.secondary" fontWeight="500">
                {item.description} 
              </Typography>
            </Box>
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
           
             
                 {/* <Button  onClick={handleBackToHome}   > */}
                 <HomeIcon onClick={handleBackToHome} sx={{cursor:"pointer"}} ></HomeIcon>
                {/* </Button> */}
                
           
           
          </>
        ) : (
          <IconButton edge="start" color="primary" sx={{ mr: 2, cursor: 'default' }} />
        )}
        <Typography variant="h4" component="div" sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 600,
        }}>
          {selectedView ? selectedView.text : "ADMIN DASHBOARD"}
        </Typography>
        <Box display="flex" alignItems="center" gap={2} sx={{ ml: 'auto' }}> {/* Add ml: 'auto' to push content to the right */}
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>
                    {/* {user.userRole}{console.log("user.supervisor_name",user.supervisor_name)} */}
                </Typography>
                <Typography variant="caption" sx={{ color: '#777' }}>
                    {user.id.replace('_', ' ')}
                </Typography>
            </Box>
            <Tooltip title={user.id.replace('_', ' ') + " \n" + user.userRole}>
            <Avatar sx={{ bgcolor: '#1a237e', fontWeight: 'bold' }}>
                <AccountCircle />
            </Avatar>
            </Tooltip>
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