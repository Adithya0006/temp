import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

const DEFAULT_DUMMY = {
  admin: {
    staffNumber: "AD01",
    password: "123",
    name: "Admin",
  },
  "supervisor-internal": {
    staffNumber: "SI01",
    password: "123",
    name: "Supervisor Internal",
  },
  "supervisor-external": {
    staffNumber: "SE01",
    password: "123",
    name: "Supervisor External",
  },
  operator: {
    staffNumber: "OP01",
    password: "123",
    name: "Operator One",
  },
};


export default function UnifiedLogin({
  onLogin,
  operatorAccounts = [],
  dummyCreds = DEFAULT_DUMMY,
}) {
  const [staffNumberInput, setStaffNumberInput] = useState("");
  const [password, setPassword] = useState("");
  const [roleType, setRoleType] = useState("admin");
  const [loading, setLoading] = useState(false);

  const roleMapForApp = (role) => {
    if (role === "supervisor-internal") return "supervisor";
    if (role === "supervisor-external") return "supervisor-external";
    return role;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const staff = String(staffNumberInput).trim();

    try {
      const resp = await axios.post(
        "/api/auth/login",
        { staffNumber: staff, password, roleType },
        { timeout: 4000 }
      );

      if (resp?.data?.success) {
        const serverUser = resp.data;

        const user = {
          staffNumber: String(
            serverUser.staffNumber ||
            serverUser.staff_number ||
            staff
          ),
          name: serverUser.name || "User",
          role: roleMapForApp(roleType),
        };

        setLoading(false);
        onLogin(user);
        return;
      }
    } catch { }

    const dummyUsers = dummyCreds[roleType];

    if (Array.isArray(dummyUsers)) {
      const found = dummyUsers.find(
        (u) =>
          String(u.staffNumber) === staff &&
          u.password === password
      );

      if (found) {
        onLogin({
          staffNumber: found.staffNumber,
          name: found.name,
          role: roleMapForApp(roleType),
        });

        setLoading(false);
        return;
      }
    }


    if (roleType === "operator" && Array.isArray(operatorAccounts)) {
      const found = operatorAccounts.find(
        (op) =>
          String(op.staffNumber) === staff && op.password === password
      );

      if (found) {
        onLogin({
          staffNumber: String(found.staffNumber),
          name: found.name,
          role: "operator",
        });
        setLoading(false);
        return;
      }
    }

    alert("Login failed. Check staff number/password/role.");
    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 10,
        px: 2,
      }}
    >
      <Card
  sx={{
    borderRadius: 3,
    boxShadow: "0 4px 18px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.75)", // <-- TRANSPARENCY
    backdropFilter: "blur(6px)", // <-- optional glass effect
  }}
>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: "#1976d2",
            }}
          >
            NPTRM Portal
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Access (Admin / Supervisor / Operator)
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Staff Number"
              value={staffNumberInput}
              onChange={(e) => setStaffNumberInput(e.target.value)}
              fullWidth
              required
              margin="normal"
              size="small"
            />

            <TextField
              label="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              size="small"
            />

            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleType}
                label="Role"
                onChange={(e) => setRoleType(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="supervisor-internal">
                  Supervisor — Internal
                </MenuItem>
                <MenuItem value="supervisor-external">
                  Supervisor — External
                </MenuItem>
                <MenuItem value="operator">Operator</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
