// SupervisorExternal.js

import React, { useState } from 'react';
import { useSelector } from 'react-redux/es/exports';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle,
  BarChart as BarChartIcon,
  DateRange,
  TableChart as TableChartIcon
} from '@mui/icons-material';

// Import your sub-components
import ProductionLiveDashboard from './ProductionLiveDashboard';
import AnalyticalDashboard from './AnalyticalDashboard';
import AnalyticalDashboard1 from './AnalyticalDashboard1';
// import SampleDashboard from './SampleDashboard';
// import SmartManufacturingDashboard from './SmartManufacturingDashboard';
import MaterialDashboard from './MaterialDashboard';
import DashboardSwitcher from './DashBoardSwitcher';
import OperatorAnalyis from './OperatorAnalysis';

const SupervisorExternal = () => {
  const [activeTab, setActiveTab] = useState(0);
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
  // Logic to determine API IP
  let fetchDashBase = "http://192.168.1.12:8000"; 
  if (configDetails !== undefined) {
    if (configDetails.project?.[0]?.ServerIP?.[0]?.PythonServerIP !== undefined) {
      fetchDashBase = configDetails.project[0].ServerIP[0].PythonServerIP;
    }
  }

  let user = JSON.parse(localStorage.getItem("user"));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', minHeight: '100vh', paddingBottom: 4 }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', color: '#333' }}>
        
  <Toolbar>
  <Box mb={4} sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>
    Generated Time:  
         <Chip icon={<DateRange />} label={new Date().toLocaleString()} size="large" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}} />
      </Box>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '800', color: '#1a237e', letterSpacing: '-0.5px' }}>
      PCB PRODUCTION TRACKER
    </Typography>
   

 

    <Box display="flex" alignItems="center" gap={2}>
      <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
        
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>
          {user?.userRole || 'Supervisor'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#777' }}>
          {user?.id ? user.id.replace('_', ' ') : ''}
        </Typography>
      </Box>
      <Tooltip title={user.id.replace('_', ' ') + " \n" + user.userRole}>  
      <Avatar sx={{ bgcolor: '#1a237e', fontWeight: 'bold', width: 32, height: 32 }}>
  
  <AccountCircle />
</Avatar>
</Tooltip>
    </Box>
  </Toolbar>
</AppBar>
<Tabs
      value={activeTab}
      onChange={handleTabChange}
      textColor="primary"
      indicatorColor="primary"
      sx={{ flexGrow: 0,alignItems:"center",justifyContent:"center" }} // Important: Remove excessive flex-grow,
      
    >
      <Tab icon={<TableChartIcon fontSize='small' />} iconPosition="start" label="Live Production" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1rem"}} />
      <Tab icon={<BarChartIcon fontSize='small' />} iconPosition="start" label="Analytics" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1rem"}} />
      <Tab icon={<BarChartIcon fontSize='small' />} iconPosition="start" label="Operator Activity Analysis" sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1rem"}}  />
    </Tabs>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {activeTab === 0 && (
          <ProductionLiveDashboard 
            apiBaseUrl={fetchDashBase} 
            user={user} 
          />
        )}
        
        {/* Pass API props to Analytics now */}
        {activeTab === 1 && (
          // <AnalyticalDashboard 
          //   apiBaseUrl={fetchDashBase} 
          //   user={user}
          // />
          <DashboardSwitcher/>
        )}
        {activeTab === 2 && (
          <OperatorAnalyis
            apiBaseUrl={fetchDashBase} 
            user={user}
          />
        )}
        {/* {activeTab === 2 && (
          <AnalyticalDashboard1
            apiBaseUrl={fetchDashBase} 
            user={user}
          />
        )} */}
      </Container>
    </Box>
  );
};

export default SupervisorExternal;