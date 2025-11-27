import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

function LoginPage({ role, onLogin }) {
    const [staffNumber, setStaffNumber] = useState('12345');
    const [password, setPassword] = useState('adminpassword');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(staffNumber, password);
    };

    return (
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 2, textAlign: 'center' }}>
                    {role} Login 🔑
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Staff Number"
                        value={staffNumber}
                        onChange={(e) => setStaffNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        size="small"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        size="small"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Log In
                    </Button>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                        Hint: 12345/adminpassword
                    </Typography>
                </form>
            </CardContent>
        </Card>
    );
}

export default LoginPage;