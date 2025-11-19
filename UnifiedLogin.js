
// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Box,
// } from "@mui/material";

// // Default fallback credentials
// const DEFAULT_DUMMY = {
//   admin: {
//     staffNumber: "12345",
//     password: "adminpassword",
//     name: "Admin User",
//   },
//   "supervisor-internal": {
//     staffNumber: "98765",
//     password: "supervisorpassword",
//     name: "Supervisor Internal",
//   },
//   "supervisor-external": {
//     staffNumber: "88888",
//     password: "supervisorexternal",
//     name: "Supervisor External",
//   },
//   operator: {
//     staffNumber: "54321",
//     password: "operatorpassword",
//     name: "Default Operator",
//   },
// };

// export default function UnifiedLogin({
//   onLogin,
//   operatorAccounts = [],
//   dummyCreds = DEFAULT_DUMMY,
// }) {
//   const [staffNumberInput, setStaffNumberInput] = useState("");
//   const [password, setPassword] = useState("");
//   const [roleType, setRoleType] = useState("admin");
//   const [loading, setLoading] = useState(false);

//   // Internal → App.js role mapping
//   const roleMapForApp = (role) => {
//     if (role === "supervisor-internal") return "supervisor";
//     if (role === "supervisor-external") return "supervisor-external";
//     return role;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const staff = String(staffNumberInput).trim();

//     // ----------------------------------------------------------
//     // 1) SERVER AUTH — axios.get() (if server is online)
//     // ----------------------------------------------------------
//     try {
//       const resp = await axios.get("/api/auth/login", {
//         params: {
//           staffNumber: staff,
//           password,
//           roleType,
//         },
//         timeout: 4000,
//       });

//       if (resp?.data?.success) {
//         const serverUser = resp.data;

//         const user = {
//           staffNumber: String(serverUser.staffNumber || staff),
//           name: serverUser.name || "User",
//           role: roleMapForApp(roleType),
//         };

//         setLoading(false);
//         onLogin(user);
//         return;
//       }
//     } catch (err) {
//       // Do nothing — will fall back to dummy login
//       console.log("Server OFFLINE → using fallback");
//     }

//     // ----------------------------------------------------------
//     // 2) DUMMY LOGIN FALLBACK
//     // ----------------------------------------------------------
//     const dummy = dummyCreds[roleType];

//     if (
//       dummy &&
//       String(dummy.staffNumber) === staff &&
//       dummy.password === password
//     ) {
//       onLogin({
//         staffNumber: String(dummy.staffNumber),
//         name: dummy.name,
//         role: roleMapForApp(roleType),
//       });
//       setLoading(false);
//       return;
//     }

//     // ----------------------------------------------------------
//     // 3) OPERATOR ACCOUNTS (Created by Supervisor)
//     // ----------------------------------------------------------
//     if (roleType === "operator" && Array.isArray(operatorAccounts)) {
//       const found = operatorAccounts.find(
//         (op) =>
//           String(op.staffNumber) === staff && op.password === password
//       );

//       if (found) {
//         onLogin({
//           staffNumber: String(found.staffNumber),
//           name: found.name || "Operator",
//           role: "operator",
//         });
//         setLoading(false);
//         return;
//       }
//     }

//     // ----------------------------------------------------------
//     // 4) FAILURE
//     // ----------------------------------------------------------
//     alert("Login failed — Invalid staff number / password / role.");
//     setLoading(false);
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         px: 2,
//         background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: 480,
//           borderRadius: 3,
//           boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
//           background: "#ffffff",
//         }}
//       >
//         <CardContent sx={{ p: 4 }}>
//           <Typography
//             variant="h4"
//             align="center"
//             sx={{
//               mb: 1,
//               color: "#0D47A1",
//               fontWeight: "bold",
//               letterSpacing: 1,
//             }}
//           >
//             NPTRM
//           </Typography>

//           <Typography
//             align="center"
//             sx={{
//               mb: 3,
//               color: "#455A64",
//               fontWeight: 500,
//               letterSpacing: 0.5,
//             }}
//           >
//             Unified Login Portal
//           </Typography>

//           <form onSubmit={handleSubmit}>
//             {/* STAFF NUMBER */}
//             <TextField
//               label="Staff Number"
//               value={staffNumberInput}
//               onChange={(e) => setStaffNumberInput(e.target.value)}
//               fullWidth
//               required
//               margin="normal"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 2,
//                   background: "#fafafa",
//                   "& fieldset": {
//                     borderColor: "#90A4AE",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "#0D47A1",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "#1565C0",
//                     borderWidth: 2,
//                   },
//                 },
//               }}
//             />

//             {/* PASSWORD */}
//             <TextField
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               fullWidth
//               required
//               margin="normal"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 2,
//                   background: "#fafafa",
//                   "& fieldset": {
//                     borderColor: "#90A4AE",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "#0D47A1",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "#1565C0",
//                     borderWidth: 2,
//                   },
//                 },
//               }}
//             />

//             {/* ROLE */}
//             <FormControl
//               fullWidth
//               margin="normal"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 2,
//                   background: "#fafafa",
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "#1565C0",
//                 },
//               }}
//             >
//               <InputLabel>Role</InputLabel>
//               <Select
//                 value={roleType}
//                 label="Role"
//                 onChange={(e) => setRoleType(e.target.value)}
//               >
//                 <MenuItem value="admin">Admin</MenuItem>
//                 <MenuItem value="supervisor-internal">
//                   Supervisor — Internal
//                 </MenuItem>
//                 <MenuItem value="supervisor-external">
//                   Supervisor — External
//                 </MenuItem>
//                 <MenuItem value="operator">Operator</MenuItem>
//               </Select>
//             </FormControl>

//             {/* SUBMIT BUTTON */}
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={loading}
//               sx={{
//                 mt: 3,
//                 py: 1.2,
//                 fontSize: 16,
//                 borderRadius: 3,
//                 fontWeight: "bold",
//                 background: "#1565C0",
//                 boxShadow: "0 4px 15px rgba(21,101,192,0.3)",
//                 "&:hover": {
//                   background: "#0D47A1",
//                   boxShadow: "0 4px 20px rgba(21,101,192,0.5)",
//                 },
//               }}
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>

//           <Typography
//             align="center"
//             sx={{ mt: 3, fontSize: 12, color: "#607D8B" }}
//           >
//             Attempts server login → if offline uses dummy credentials.
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
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
  admin: { staffNumber: "12345", password: "adminpassword", name: "Admin User" },
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

  const roleMapForApp = (role) => {
    if (role === "supervisor-internal") return "supervisor";
    if (role === "supervisor-external") return "supervisor-external";
    return role;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await axios.get("/api/auth/login", {
        params: {
          staffNumber: staffNumberInput,
          password,
          roleType,
        },
        timeout: 4000,
      });

      if (resp?.data?.success) {
        onLogin({
          staffNumber: resp.data.staffNumber || staffNumberInput,
          name: resp.data.name || "User",
          role: roleMapForApp(roleType),
        });
        setLoading(false);
        return;
      }
    } catch (e) {}

    const dummy = dummyCreds[roleType];

    if (
      dummy &&
      dummy.staffNumber === staffNumberInput &&
      dummy.password === password
    ) {
      onLogin({
        staffNumber: dummy.staffNumber,
        name: dummy.name,
        role: roleMapForApp(roleType),
      });
      setLoading(false);
      return;
    }

    if (roleType === "operator") {
      const found = operatorAccounts.find(
        (op) =>
          op.staffNumber === staffNumberInput && op.password === password
      );
      if (found) {
        onLogin({
          staffNumber: found.staffNumber,
          name: found.name,
          role: "operator",
        });
        setLoading(false);
        return;
      }
    }

    alert("Invalid Login Credentials!");
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        background: `
          linear-gradient(135deg, #ff9a9e 0%, #fad0c4 30%, #fad0c4 60%, #fbc2eb 90%),
          radial-gradient(circle at top left, #a18cd1 0%, transparent 50%),
          radial-gradient(circle at bottom right, #fbc2eb 0%, transparent 50%)
        `,
        backgroundBlendMode: "overlay",
        animation: "bgShift 12s ease infinite",
        "@keyframes bgShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 4,
          p: 1,
          background:
            "linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <Box
          sx={{
            background: "white",
            borderRadius: 3,
            p: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 1,
                background: "linear-gradient(90deg, #ff0080, #7928CA)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: "bold",
              }}
            >
              NPTRM LOGIN
            </Typography>

            <Typography
              align="center"
              sx={{
                mb: 3,
                color: "#444",
                fontWeight: 500,
              }}
            >
              Secure Unified Access Portal
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "#fff",
                    transition: "0.3s",
                    "&:hover fieldset": {
                      borderColor: "#ff66b2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff0080",
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "#fff",
                    "&:hover fieldset": {
                      borderColor: "#7928CA",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a100ff",
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleType}
                  label="Role"
                  onChange={(e) => setRoleType(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: "#fff",
                  }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="supervisor-internal">Supervisor — Internal</MenuItem>
                  <MenuItem value="supervisor-external">Supervisor — External</MenuItem>
                  <MenuItem value="operator">Operator</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.3,
                  fontSize: 16,
                  fontWeight: "bold",
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #ff0080, #7928CA, #4A00E0)",
                  boxShadow: "0 6px 20px rgba(121,40,202,0.4)",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 8px 25px rgba(255,0,128,0.6)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <Typography align="center" sx={{ mt: 3, fontSize: 12, color: "#555" }}>
              Attempts server login → If offline uses dummy credentials.
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
