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

// Default fallback credentials
const DEFAULT_DUMMY = {
  admin: {
    staffNumber: "12345",
    password: "adminpassword",
    name: "Admin User",
  },
  "supervisor-internal": {
    staffNumber: "98765",
    password: "supervisorpassword",
    name: "Supervisor Internal",
  },
  "supervisor-external": {
    staffNumber: "88888",
    password: "supervisorexternal",
    name: "Supervisor External",
  },
  operator: {
    staffNumber: "54321",
    password: "operatorpassword",
    name: "Default Operator",
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

  // Internal → App.js role mapping
  const roleMapForApp = (role) => {
    if (role === "supervisor-internal") return "supervisor";
    if (role === "supervisor-external") return "supervisor-external";
    return role; // admin or operator
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const staff = String(staffNumberInput).trim();

    // ------------------------------
    // 1) SERVER AUTH (axios)
    // ------------------------------
    try {
      const resp = await axios.post(
        "/api/auth/login",
        {
          staffNumber: staff,
          password,
          roleType,
        },
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
    } catch (err) {
      // Ignore and fall back
    }

    // ------------------------------
    // 2) DUMMY CREDS FALLBACK
    // ------------------------------
    const dummy = dummyCreds[roleType];

    if (
      dummy &&
      String(dummy.staffNumber) === staff &&
      dummy.password === password
    ) {
      onLogin({
        staffNumber: String(dummy.staffNumber),
        name: dummy.name,
        role: roleMapForApp(roleType),
      });
      setLoading(false);
      return;
    }

    // ------------------------------
    // 3) OPERATOR ACCOUNTS FALLBACK (REAL OPERATORS CREATED BY SUPERVISOR)
    // ------------------------------
    if (roleType === "operator" && Array.isArray(operatorAccounts)) {
      const found = operatorAccounts.find(
        (op) =>
          String(op.staffNumber) === staff && op.password === password
      );

      if (found) {
        onLogin({
          staffNumber: String(found.staffNumber),
          name: found.name || "Operator",
          role: "operator",
        });
        setLoading(false);
        return;
      }
    }

    // ------------------------------
    // 4) FAILURE
    // ------------------------------
    alert(
      "Login failed — server unreachable or invalid credentials. Check staff number/password/role."
    );
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 520, width: "100%", mx: "auto" }}>
      <Card sx={{ mt: 6 }}>
        <CardContent>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            NPTRM
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Unified Login (admin, supervisor, operator)
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* STAFF NUMBER */}
            <TextField
              label="Staff Number"
              value={staffNumberInput}
              onChange={(e) => setStaffNumberInput(e.target.value)}
              fullWidth
              required
              margin="normal"
              size="small"
            />

            {/* PASSWORD */}
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

            {/* ROLE TYPE */}
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

            {/* SUBMIT */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <Box sx={{ mt: 2, fontSize: 12, color: "text.secondary" }}>
            <div>
              Tries server first (axios). If server offline, uses dummy &
              local operator accounts.
            </div>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
