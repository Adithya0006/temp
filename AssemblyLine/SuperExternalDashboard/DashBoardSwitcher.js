import React, { useState } from 'react';
import { Box, MenuItem, FormControl, Select, InputLabel, Typography } from '@mui/material';
import AnalyticalDashboard from './AnalyticalDashboard';
import AnalyticalDashboard1 from './AnalyticalDashboard1';
import { useSelector } from 'react-redux';



let user = JSON.parse(localStorage.getItem("user"));
const DashboardSwitcher = () => {
    const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  
  // Logic to determine API IP
  let fetchDashBase = "http://192.168.1.12:8000"; 
  if (configDetails !== undefined) {
    if (configDetails.project?.[0]?.ServerIP?.[0]?.PythonServerIP !== undefined) {
      fetchDashBase = configDetails.project[0].ServerIP[0].PythonServerIP;
    }
  }


  const [view, setView] = useState('option1');

  const handleChange = (event) => {
    setView(event.target.value);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 2000, mx: 'auto', mt: 0 }}>
      
      {/* 1. The Professional Dropdown */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="component-switcher-label">Select View</InputLabel>
        <Select
          labelId="component-switcher-label"
          value={view}
          label="Select View"
          onChange={handleChange}
          sx={{
            borderRadius: '12px',
            bgcolor: '#ffffff',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
          }}
        >
          <MenuItem value="option1">Analytical Dashboard - 1</MenuItem>
          <MenuItem value="option2">Analytical Dashboard - 2</MenuItem>
        </Select>
      </FormControl>

      {/* 2. Conditional Rendering Block */}
      <Box sx={{ transition: 'all 0.3s ease' }}>
        {view === 'option1' && <AnalyticalDashboard  apiBaseUrl={fetchDashBase} 
          user={user}/>}
        {view === 'option2' && <AnalyticalDashboard1  apiBaseUrl={fetchDashBase} 
            user={user}/>}
      </Box>

    </Box>
  );
};

export default DashboardSwitcher;