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
  Tab
} from '@mui/material';
import {
  AccountCircle,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';

// Import your sub-components
import ProductionLiveDashboard from './ProductionLiveDashboard';
import AnalyticalDashboard from './AnalyticalDashboard';

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '800', color: '#1a237e', letterSpacing: '-0.5px' }}>
            PCB PRODUCTION TRACKER 
          </Typography>
          
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            textColor="primary" 
            indicatorColor="primary"
            sx={{ mr: 4 }}
          >
            <Tab icon={<TableChartIcon fontSize='small' />} iconPosition="start" label="Live Production" sx={{ fontWeight: 'bold' }} />
            <Tab icon={<BarChartIcon fontSize='small' />} iconPosition="start" label="Analytics" sx={{ fontWeight: 'bold' }} />
          </Tabs>

          <Box display="flex" alignItems="center" gap={2} sx={{ ml: 'auto' }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>
                    {user?.userRole || 'Supervisor'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#777' }}>
                    {user?.id ? user.id.replace('_', ' ') : ''}
                </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#1a237e', fontWeight: 'bold' }}>
                <AccountCircle />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {activeTab === 0 && (
          <ProductionLiveDashboard 
            apiBaseUrl={fetchDashBase} 
            user={user} 
          />
        )}
        
        {/* Pass API props to Analytics now */}
        {activeTab === 1 && (
          <AnalyticalDashboard 
            apiBaseUrl={fetchDashBase} 
            user={user}
          />
        )}
      </Container>
    </Box>
  );
};

export default SupervisorExternal;