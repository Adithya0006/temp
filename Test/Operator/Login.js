import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

function OperatorLoginPage({ onLogin }) {
    const [staffNumber, setStaffNumber] = useState('54321');
    const [password, setPassword] = useState('operatorpassword');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(staffNumber, password);
    };

    return (
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 2, textAlign: 'center', color: 'info.main' }}>
                    Operator Login 🛠️
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Staff Number" value={staffNumber} onChange={(e) => setStaffNumber(e.target.value)} fullWidth margin="normal" required size="small"/>
                    <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required size="small"/>
                    <Button type="submit" variant="contained" color="info" fullWidth sx={{ mt: 2 }}>
                        Log In
                    </Button>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                        Hint: 54321/operatorpassword
                    </Typography>
                </form>
            </CardContent>
        </Card>
    );
}

export default OperatorLoginPage;