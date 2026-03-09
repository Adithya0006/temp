import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';

const BentoBox = ({ title, icon: Icon, color, children }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        height: '100%', 
        borderRadius: 4, 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        {Icon && (
          <Box 
            sx={{ 
              display: 'flex', 
              p: 0.5, 
              borderRadius: 1.5, 
              bgcolor: `${color}20`, // Light transparency version of the color
              color: color 
            }}
          >
            <Icon fontSize="small" />
          </Box>
        )}
        <Box>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography  color="black" sx={{opacity:0.8,fontWeight:600}}>
          Number of Operation(s) can be done by Each Operator
        </Typography>
        </Box>
      </Stack>
      <Box sx={{ flexGrow: 1, minHeight: 300 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default BentoBox;