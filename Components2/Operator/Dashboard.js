import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar, Container } from '@mui/material';

function EmptyDashboard({ onLogout, role }) {
    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#e0f7fa', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ bgcolor: 'info.main' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Operator Dashboard
                    </Typography>
                    <Button color="inherit" onClick={onLogout} variant="outlined">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ pt: 5, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {role.toUpperCase()}!
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    This is your minimal work dashboard. Content coming soon!
                </Typography>
            </Container>
        </Box>
    );
}

export default EmptyDashboard;