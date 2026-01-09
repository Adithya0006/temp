
// import {
//   Box, TextField, Button, Typography, Paper, Stack
// } from "@mui/material";
// import { useState, useEffect } from "react";

// export default function ProcessForm({ form, savedData, onSubmit, FilteredData, actionType }) {

//   const [values, setValues] = useState({});

//   useEffect(() => {
//     // --- CRITICAL: Check multiple keys to ensure data loads from any source
//     console.log("savedData",savedData)
//     if (savedData) {
//       const dataToLoad = 
//         savedData.operator_Json_log ||  // <--- Primary: Data from DB View
//         savedData.log_Data ||           // <--- Secondary: Data from Save Payload
//         savedData.process_data ||       // <--- Fallback
//         savedData;                      // <--- Fallback

//       // Only set if we actually have keys
//       if (dataToLoad && Object.keys(dataToLoad).length > 0) {
//         console.log("Autofilling Form with:111", dataToLoad);
//         setValues(dataToLoad);
//       }
//     }
//   }, [savedData]);

//   const handleChange = (key, value) => {
//     setValues(prev => ({ ...prev, [key]: value }));
//   };

//   // Triggered by the "Save" button (Start Mode)
//   const handleSave = () => {
//     // Sends "Started" status
//     onSubmit(values, "Started");
//   };

//   // Triggered by the "Complete" button (Complete Mode)
//   const handleComplete = () => {
//     // Sends "Completed" status
//     onSubmit(values, "Completed");
//   };

//   return (
//     <Paper sx={{ p: 3, borderRadius: 2 }}>

//       <Typography variant="h6" sx={{ mb: 2 }}>
//         {form.stage_name}
//       </Typography>

//       {form.fields.map(f => (
//         <Box key={f.key} sx={{ mb: 2 }}>

//           {f.type === "textarea" && (
//             <TextField
//               label={f.label}
//               fullWidth
//               multiline
//               rows={3}
//               value={values[f.key] || ""}
//               onChange={e => handleChange(f.key, e.target.value)}
//             />
//           )}

//           {f.type !== "textarea" && f.type !== "file" && (
//             <TextField
//               label={f.label}
//               type={f.type}
//               fullWidth
//               value={values[f.key] || ""}
//               onChange={e => handleChange(f.key, e.target.value)}
//             />
//           )}

//           {f.type === "file" && (
//             <Button variant="outlined" component="label">
//               {f.label}
//               <input
//                 type="file"
//                 hidden
//                 onChange={e => handleChange(f.key, e.target.files[0]?.name)}
//               />
//             </Button>
//           )}

//         </Box>
//       ))}

//       {/* --- CONDITIONAL BUTTON RENDERING --- */}
//       <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
        
//         {/* CASE 1: Start Mode -> Show ONLY Save Button */}
//         {actionType === 'Start' && (
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//           >
//             Save (Start Task)
//           </Button>
//         )}

//         {/* CASE 2: Complete Mode -> Show ONLY Complete Button */}
//         {actionType === 'complete' && (
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleComplete}
//           >
//             Complete Task
//           </Button>
//         )}

//       </Stack>

//     </Paper>
//   );
// }















import {
  Box, TextField, Button, Typography, Paper, Stack, CircularProgress,
  InputAdornment, IconButton, Tooltip
} from "@mui/material";
import { useState, useEffect } from "react";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import SearchIcon from '@mui/icons-material/Search';

export default function ProcessForm({ 
  form, savedData, onSubmit, FilteredData, actionType, 
  onFetchLastData, onFetchDataBySerial 
}) {

  const [values, setValues] = useState({});
  const [pasting, setPasting] = useState(false); // Loading state for paste action
  const [searchSerial, setSearchSerial] = useState(""); // State for search input
  const [searching, setSearching] = useState(false); // Loading state for search action

  useEffect(() => {
    // --- CRITICAL: Check multiple keys to ensure data loads from any source
    console.log("savedData",savedData)
    if (savedData) {
      const dataToLoad = 
        savedData.operator_Json_log ||  // <--- Primary: Data from DB View
        savedData.log_Data ||           // <--- Secondary: Data from Save Payload
        savedData.process_data ||       // <--- Fallback
        savedData;                      // <--- Fallback

      // Only set if we actually have keys
      if (dataToLoad && Object.keys(dataToLoad).length > 0) {
        console.log("Autofilling Form with:111", dataToLoad);
        setValues(dataToLoad);
      }
    }
  }, [savedData]);

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  // --- Paste from Database Logic (Last Data) ---
  const handlePastePrevious = async () => {
    if (!onFetchLastData) return;
    
    setPasting(true);
    const dbData = await onFetchLastData();
    setPasting(false);

    if (dbData && Object.keys(dbData).length > 0) {
      setValues(prev => ({
        ...prev,
        ...dbData // Merge DB data into form
      }));
    } else {
      alert("No previous data found for this stage.");
    }
  };

  // --- NEW: Search & Paste from Specific PCB Logic ---
  const handleSearchAndPaste = async () => {
    if (!onFetchDataBySerial || !searchSerial) return;

    setSearching(true);
    const dbData = await onFetchDataBySerial(searchSerial);
    setSearching(false);

    if (dbData && Object.keys(dbData).length > 0) {
      setValues(prev => ({
        ...prev,
        ...dbData // Merge DB data into form
      }));
      // Optional: Clear search field after successful copy
      // setSearchSerial(""); 
    } else {
      alert(`No data found for PCB Serial: ${searchSerial} at this stage.`);
    }
  };

  // Triggered by the "Save" button (Start Mode)
  const handleSave = () => {
    // Sends "Started" status
    onSubmit(values, "Started");
  };

  // Triggered by the "Complete" button (Direct Complete OR Normal Complete)
  const handleComplete = () => {
    // Sends "Completed" status
    onSubmit(values, "Completed");
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>

      <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
        
        {/* Header Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {form.stage_name}
          </Typography>

          {/* COPY TOOLBAR (Only in Edit Mode) */}
          {actionType !== 'view' && (
            <Stack direction="row" spacing={1} alignItems="center">
              
              {/* 1. Paste Last Data Button */}
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={pasting ? <CircularProgress size={16} /> : <ContentPasteIcon />} 
                onClick={handlePastePrevious}
                disabled={pasting || searching}
                sx={{ textTransform: 'none' }}
              >
                {pasting ? "Fetching..." : "Paste Last"}
              </Button>

            </Stack>
          )}
        </Stack>
        
        {/* NEW: SEARCH BAR ROW (Separate line for better visibility) */}
        {actionType !== 'view' && (
           <Box sx={{ bgcolor: "#f5f5f5", p: 1.5, borderRadius: 1, display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="caption" sx={{ whiteSpace: "nowrap", mr: 1, color: "text.secondary" }}>
                Copy from another PCB:
              </Typography>
              <TextField 
                size="small" 
                placeholder="Enter PCB Serial..." 
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                sx={{ bgcolor: "white", width: "200px" }}
                disabled={searching}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                       <IconButton 
                         onClick={handleSearchAndPaste} 
                         disabled={!searchSerial || searching} 
                         size="small"
                         color="primary"
                       >
                         {searching ? <CircularProgress size={20} /> : <SearchIcon />}
                       </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
           </Box>
        )}

      </Stack>

      {form.fields.map(f => (
        <Box key={f.key} sx={{ mb: 2 }}>

          {f.type === "textarea" && (
            <TextField
              label={f.label}
              fullWidth
              multiline
              rows={3}
              value={values[f.key] || ""}
              onChange={e => handleChange(f.key, e.target.value)}
            />
          )}

          {f.type !== "textarea" && f.type !== "file" && (
            <TextField
              label={f.label}
              type={f.type}
              fullWidth
              value={values[f.key] || ""}
              onChange={e => handleChange(f.key, e.target.value)}
            />
          )}

          {f.type === "file" && (
            <Button variant="outlined" component="label">
              {values[f.key] ? `File Selected: ${values[f.key]}` : f.label}
              <input
                type="file"
                hidden
                onChange={e => handleChange(f.key, e.target.files[0]?.name)}
              />
            </Button>
          )}

        </Box>
      ))}

      {/* --- CONDITIONAL BUTTON RENDERING --- */}
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
        
        {/* CASE 1: Start Mode -> Show BOTH Save AND Complete Buttons */}
        {actionType === 'Start' && (
          <>
            <Button
              variant="outlined" 
              color="primary"
              onClick={handleSave}
            >
              Save Only
            </Button>

            <Button
              variant="contained"
              color="success" 
              onClick={handleComplete}
            >
              Complete Task
            </Button>
          </>
        )}

        {/* CASE 2: Complete Mode (Already Started) -> Show ONLY Complete Button */}
        {actionType === 'complete' && (
          <Button
            variant="contained"
            color="success"
            onClick={handleComplete}
          >
            Complete Task
          </Button>
        )}

      </Stack>

    </Paper>
  );
}