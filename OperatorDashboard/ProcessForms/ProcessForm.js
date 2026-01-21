
// // import {
// //   Box, TextField, Button, Typography, Paper, Stack
// // } from "@mui/material";
// // import { useState, useEffect } from "react";

// // export default function ProcessForm({ form, savedData, onSubmit, FilteredData, actionType }) {

// //   const [values, setValues] = useState({});

// //   useEffect(() => {
// //     // --- CRITICAL: Check multiple keys to ensure data loads from any source
// //     console.log("savedData",savedData)
// //     if (savedData) {
// //       const dataToLoad = 
// //         savedData.operator_Json_log ||  // <--- Primary: Data from DB View
// //         savedData.log_Data ||           // <--- Secondary: Data from Save Payload
// //         savedData.process_data ||       // <--- Fallback
// //         savedData;                      // <--- Fallback

// //       // Only set if we actually have keys
// //       if (dataToLoad && Object.keys(dataToLoad).length > 0) {
// //         console.log("Autofilling Form with:111", dataToLoad);
// //         setValues(dataToLoad);
// //       }
// //     }
// //   }, [savedData]);

// //   const handleChange = (key, value) => {
// //     setValues(prev => ({ ...prev, [key]: value }));
// //   };

// //   // Triggered by the "Save" button (Start Mode)
// //   const handleSave = () => {
// //     // Sends "Started" status
// //     onSubmit(values, "Started");
// //   };

// //   // Triggered by the "Complete" button (Complete Mode)
// //   const handleComplete = () => {
// //     // Sends "Completed" status
// //     onSubmit(values, "Completed");
// //   };

// //   return (
// //     <Paper sx={{ p: 3, borderRadius: 2 }}>

// //       <Typography variant="h6" sx={{ mb: 2 }}>
// //         {form.stage_name}
// //       </Typography>

// //       {form.fields.map(f => (
// //         <Box key={f.key} sx={{ mb: 2 }}>

// //           {f.type === "textarea" && (
// //             <TextField
// //               label={f.label}
// //               fullWidth
// //               multiline
// //               rows={3}
// //               value={values[f.key] || ""}
// //               onChange={e => handleChange(f.key, e.target.value)}
// //             />
// //           )}

// //           {f.type !== "textarea" && f.type !== "file" && (
// //             <TextField
// //               label={f.label}
// //               type={f.type}
// //               fullWidth
// //               value={values[f.key] || ""}
// //               onChange={e => handleChange(f.key, e.target.value)}
// //             />
// //           )}

// //           {f.type === "file" && (
// //             <Button variant="outlined" component="label">
// //               {f.label}
// //               <input
// //                 type="file"
// //                 hidden
// //                 onChange={e => handleChange(f.key, e.target.files[0]?.name)}
// //               />
// //             </Button>
// //           )}

// //         </Box>
// //       ))}

// //       {/* --- CONDITIONAL BUTTON RENDERING --- */}
// //       <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
        
// //         {/* CASE 1: Start Mode -> Show ONLY Save Button */}
// //         {actionType === 'Start' && (
// //           <Button
// //             variant="contained"
// //             color="primary"
// //             onClick={handleSave}
// //           >
// //             Save (Start Task)
// //           </Button>
// //         )}

// //         {/* CASE 2: Complete Mode -> Show ONLY Complete Button */}
// //         {actionType === 'complete' && (
// //           <Button
// //             variant="contained"
// //             color="success"
// //             onClick={handleComplete}
// //           >
// //             Complete Task
// //           </Button>
// //         )}

// //       </Stack>

// //     </Paper>
// //   );
// // }















// import {
//   Box, TextField, Button, Typography, Paper, Stack, CircularProgress,
//   InputAdornment, IconButton, Tooltip
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';
// import SearchIcon from '@mui/icons-material/Search';

// export default function ProcessForm({ 
//   form, savedData, onSubmit, FilteredData, actionType, 
//   onFetchLastData, onFetchDataBySerial 
// }) {

//   const [values, setValues] = useState({});
//   const [pasting, setPasting] = useState(false); // Loading state for paste action
//   const [searchSerial, setSearchSerial] = useState(""); // State for search input
//   const [searching, setSearching] = useState(false); // Loading state for search action

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

//   // --- Paste from Database Logic (Last Data) ---
//   const handlePastePrevious = async () => {
//     if (!onFetchLastData) return;
    
//     setPasting(true);
//     const dbData = await onFetchLastData();
//     setPasting(false);

//     if (dbData && Object.keys(dbData).length > 0) {
//       setValues(prev => ({
//         ...prev,
//         ...dbData // Merge DB data into form
//       }));
//     } else {
//       alert("No previous data found for this stage.");
//     }
//   };

//   // --- NEW: Search & Paste from Specific PCB Logic ---
//   const handleSearchAndPaste = async () => {
//     if (!onFetchDataBySerial || !searchSerial) return;

//     setSearching(true);
//     const dbData = await onFetchDataBySerial(searchSerial);
//     setSearching(false);

//     if (dbData && Object.keys(dbData).length > 0) {
//       setValues(prev => ({
//         ...prev,
//         ...dbData // Merge DB data into form
//       }));
//       // Optional: Clear search field after successful copy
//       // setSearchSerial(""); 
//     } else {
//       alert(`No data found for PCB Serial: ${searchSerial} at this stage.`);
//     }
//   };

//   // Triggered by the "Save" button (Start Mode)
//   const handleSave = () => {
//     // Sends "Started" status
//     onSubmit(values, "Started");
//   };

//   // Triggered by the "Complete" button (Direct Complete OR Normal Complete)
//   const handleComplete = () => {
//     // Sends "Completed" status
//     onSubmit(values, "Completed");
//   };

//   return (
//     <Paper sx={{ p: 3, borderRadius: 2 }}>

//       <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
        
//         {/* Header Row */}
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6">
//             {form.stage_name}
//           </Typography>

//           {/* COPY TOOLBAR (Only in Edit Mode) */}
//           {actionType !== 'view' && (
//             <Stack direction="row" spacing={1} alignItems="center">
              
//               {/* 1. Paste Last Data Button */}
//               <Button 
//                 variant="outlined" 
//                 size="small" 
//                 startIcon={pasting ? <CircularProgress size={16} /> : <ContentPasteIcon />} 
//                 onClick={handlePastePrevious}
//                 disabled={pasting || searching}
//                 sx={{ textTransform: 'none' }}
//               >
//                 {pasting ? "Fetching..." : "Paste Last"}
//               </Button>

//             </Stack>
//           )}
//         </Stack>
        
//         {/* NEW: SEARCH BAR ROW (Separate line for better visibility) */}
//         {actionType !== 'view' && (
//            <Box sx={{ bgcolor: "#f5f5f5", p: 1.5, borderRadius: 1, display: "flex", gap: 1, alignItems: "center" }}>
//               <Typography variant="caption" sx={{ whiteSpace: "nowrap", mr: 1, color: "text.secondary" }}>
//                 Copy from another PCB:
//               </Typography>
//               <TextField 
//                 size="small" 
//                 placeholder="Enter PCB Serial..." 
//                 value={searchSerial}
//                 onChange={(e) => setSearchSerial(e.target.value)}
//                 sx={{ bgcolor: "white", width: "200px" }}
//                 disabled={searching}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                        <IconButton 
//                          onClick={handleSearchAndPaste} 
//                          disabled={!searchSerial || searching} 
//                          size="small"
//                          color="primary"
//                        >
//                          {searching ? <CircularProgress size={20} /> : <SearchIcon />}
//                        </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//            </Box>
//         )}

//       </Stack>

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
//               {values[f.key] ? `File Selected: ${values[f.key]}` : f.label}
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
        
//         {/* CASE 1: Start Mode -> Show BOTH Save AND Complete Buttons */}
//         {actionType === 'Start' && (
//           <>
//             <Button
//               variant="outlined" 
//               color="primary"
//               onClick={handleSave}
//             >
//               Save Only
//             </Button>

//             <Button
//               variant="contained"
//               color="success" 
//               onClick={handleComplete}
//             >
//               Complete Task
//             </Button>
//           </>
//         )}

//         {/* CASE 2: Complete Mode (Already Started) -> Show ONLY Complete Button */}
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
  InputAdornment, IconButton, Checkbox, FormControlLabel, FormGroup,
  Accordion, AccordionSummary, AccordionDetails, Divider, Alert, Tooltip
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

/**
 * Component: ProcessForm
 * Description: Renders the dynamic form fields based on configuration.
 * Features:
 * - Dynamic inputs (Text, File, Checkbox, Textarea).
 * - "Paste Last" and "Search PCB" functionality to copy data.
 * - Strict Validation: Disables "Complete" until all fields are filled.
 * - Batch Processing: Allows selecting other PCBs to apply the same data.
 */
export default function ProcessForm({ 
  form, 
  savedData, 
  onSubmit, 
  FilteredData, 
  actionType, 
  onFetchLastData, 
  onFetchDataBySerial, 
  currentSerial 
}) {

  // --- State Definitions ---
  const [values, setValues] = useState({}); // Holds form field values
  const [pasting, setPasting] = useState(false); // Loading state for "Paste Last"
  const [searchSerial, setSearchSerial] = useState(""); // Input for "Search PCB"
  const [searching, setSearching] = useState(false); // Loading state for search
  
  // Batch State: Tracks which other PCBs are selected for batch update
  const [batchSelection, setBatchSelection] = useState({});
  const [isBatchExpanded, setIsBatchExpanded] = useState(false); // UI toggle for batch section

  // Validation State: Tracks if the form is ready for completion
  const [isValid, setIsValid] = useState(false);

  // --- Helpers ---

  // Identify other PCBs in the same stage (excluding the current one)
  // This is used to populate the Batch Selection list.
  const otherPcbs = useMemo(() => {
    if (!FilteredData || FilteredData.length === 0) return [];
    return FilteredData.filter(item => 
      item.serialNo !== currentSerial && 
      item.serialNo !== "null" && 
      item.serialNo !== null
    );
  }, [FilteredData, currentSerial]);

  // --- Effects ---

  // 1. Load Initial Data (Autofill)
  useEffect(() => {
    if (savedData) {
      // Handle various data structures that might come from the API
      const dataToLoad = 
        savedData.operator_Json_log || 
        savedData.log_Data || 
        savedData.process_data || 
        savedData;

      if (dataToLoad && Object.keys(dataToLoad).length > 0) {
        setValues(dataToLoad);
      }
    }
  }, [savedData]);

  // 2. Strict Validation Logic
  // Runs every time 'values' or the 'form' config changes.
  useEffect(() => {
    if (!form || !form.fields) return;

    const allFilled = form.fields.every(field => {
      // Checkbox is always valid (true or false are both values)
      if (field.type === "checkbox") return true;

      // File input: Check if a file name string exists
      if (field.type === "file") {
         const val = values[field.key];
         return val && val.length > 0;
      }

      // Text/Number/Date: Must not be undefined, null, or empty string
      const val = values[field.key];
      return val !== undefined && val !== null && val.toString().trim() !== "";
    });

    setIsValid(allFilled);
  }, [values, form]);


  // --- Event Handlers ---

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  // Toggle specific PCB in batch list
  const handleBatchToggle = (serial) => {
    setBatchSelection(prev => ({
      ...prev,
      [serial]: !prev[serial] 
    }));
  };

  // Select/Deselect All PCBs in batch list
  const handleSelectAllBatch = (e) => {
    const isChecked = e.target.checked;
    const newSelection = {};
    otherPcbs.forEach(pcb => {
      newSelection[pcb.serialNo] = isChecked;
    });
    setBatchSelection(newSelection);
  };

  // Fetch data from the logged-in user's last entry for this stage
  const handlePastePrevious = async () => {
    if (!onFetchLastData) return;
    setPasting(true);
    const dbData = await onFetchLastData();
    setPasting(false);
    if (dbData && Object.keys(dbData).length > 0) {
      setValues(prev => ({ ...prev, ...dbData }));
    } else {
      alert("No previous data found for this stage.");
    }
  };

  // Fetch data from a specific PCB serial number
  const handleSearchAndPaste = async () => {
    if (!onFetchDataBySerial || !searchSerial) return;
    setSearching(true);
    const dbData = await onFetchDataBySerial(searchSerial);
    setSearching(false);
    if (dbData && Object.keys(dbData).length > 0) {
      setValues(prev => ({ ...prev, ...dbData }));
    } else {
      alert(`No data found for PCB Serial: ${searchSerial}`);
    }
  };

  // Get list of actually selected serials to send to parent
  const getSelectedBatchSerials = () => {
    return Object.keys(batchSelection).filter(key => batchSelection[key] === true);
  };

  // Submit Handler: Start
  const handleSave = () => {
    onSubmit(values, "Started", getSelectedBatchSerials());
  };

  // Submit Handler: Complete
  const handleComplete = () => {
    onSubmit(values, "Completed", getSelectedBatchSerials());
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

      {/* --- HEADER SECTION --- */}
      <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="600" color="primary.main">
            {form.stage_name}
          </Typography>
          
          {/* Paste Last Button (Only active in Action Mode) */}
          {actionType !== 'view' && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={pasting ? <CircularProgress size={16} /> : <ContentPasteIcon />} 
              onClick={handlePastePrevious}
              disabled={pasting || searching}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Paste Last Log
            </Button>
          )}
        </Stack>
        
        {/* Search By Serial Bar (Only active in Action Mode) */}
        {actionType !== 'view' && (
           <Box sx={{ bgcolor: "#f1f5f9", p: 1, borderRadius: 2, display: "flex", gap: 1, alignItems: "center", border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ whiteSpace: "nowrap", ml:1, color: "text.secondary", fontWeight: 500 }}>
                Copy specific PCB:
              </Typography>
              <TextField 
                size="small" 
                placeholder="Enter Serial No..." 
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                sx={{ bgcolor: "white", width: "220px", '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                disabled={searching}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                       <IconButton onClick={handleSearchAndPaste} disabled={!searchSerial || searching} size="small" color="primary">
                         {searching ? <CircularProgress size={20} /> : <SearchIcon />}
                       </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
           </Box>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* --- DYNAMIC FORM FIELDS RENDERER --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {form.fields.map(f => (
          <Box key={f.key}>
            {f.type === "textarea" ? (
              <TextField
                label={f.label}
                fullWidth
                multiline
                rows={3}
                required // Visual indicator
                variant="outlined"
                value={values[f.key] || ""}
                onChange={e => handleChange(f.key, e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            ) : f.type === "file" ? (
              <Button variant="outlined" component="label" fullWidth sx={{ p: 2, borderRadius: 2, borderStyle: 'dashed' }}>
                {values[f.key] ? `✅ Selected: ${values[f.key]}` : `📂 Upload ${f.label} *`}
                <input type="file" hidden onChange={e => handleChange(f.key, e.target.files[0]?.name)} />
              </Button>
            ) : f.type === "checkbox" ? (
              <FormControlLabel 
                control={
                  <Checkbox checked={!!values[f.key]} onChange={e => handleChange(f.key, e.target.checked)} />
                } 
                label={f.label} 
              />
            ) : (
              <TextField
                label={f.label}
                type={f.type}
                fullWidth
                required // Visual indicator
                variant="outlined"
                value={values[f.key] || ""}
                onChange={e => handleChange(f.key, e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* --- BATCH PROCESSING SECTION (ACCORDION) --- */}
      {actionType !== 'view' && otherPcbs.length > 0 && (
        <Box sx={{ mt: 4, mb: 2 }}>
          <Accordion 
            expanded={isBatchExpanded} 
            onChange={() => setIsBatchExpanded(!isBatchExpanded)}
            sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: '8px !important', '&:before': {display:'none'} }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8fafc' }}>
               <Stack direction="row" alignItems="center" spacing={1}>
                 <LibraryAddCheckIcon color="secondary" />
                 <Typography fontWeight="bold" color="text.secondary">
                    Apply to other PCBs in this stage? ({Object.values(batchSelection).filter(Boolean).length} selected)
                 </Typography>
               </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" sx={{ mb: 2 }}>
                Selected PCBs will be updated with the <b>same data</b> entered above and moved to the same status.
              </Alert>
              <FormControlLabel
                label="Select All"
                control={<Checkbox onChange={handleSelectAllBatch} />}
                sx={{ mb: 1, borderBottom: '1px solid #eee', width: '100%' }}
              />
              <FormGroup row>
                {otherPcbs.map(pcb => (
                  <FormControlLabel
                    key={pcb.serialNo}
                    control={
                      <Checkbox 
                        checked={!!batchSelection[pcb.serialNo]} 
                        onChange={() => handleBatchToggle(pcb.serialNo)} 
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{pcb.serialNo}</Typography>}
                    sx={{ width: '30%' }}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {/* --- FOOTER ACTION BUTTONS --- */}
      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
        
        {/* Save Button (Start Mode Only) - Allows saving partial progress */}
        {actionType === 'Start' && (
          <Button
            variant="outlined" 
            size="large"
            onClick={handleSave}
            // Note: We usually allow saving draft even if incomplete, 
            // but you can add disabled={!isValid} if you want strict saving too.
            sx={{ borderRadius: 2, px: 4, textTransform: 'none' }}
          >
            Save Progress
          </Button>
        )}

        {/* Complete Button - Strict Validation Applied */}
        {(actionType === 'Start' || actionType === 'complete') && (
          <Tooltip title={!isValid ? "Please fill all required fields to complete" : ""}>
            <span> {/* Wrapper span needed for tooltip on disabled button */}
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleComplete}
                disabled={!isValid} // VALIDATION: Disabled if form invalid
                disableElevation
                sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 'bold' }}
              >
                Complete Task {Object.values(batchSelection).filter(Boolean).length > 0 && `( & ${Object.values(batchSelection).filter(Boolean).length} others)`}
              </Button>
            </span>
          </Tooltip>
        )}
      </Stack>

    </Paper>
  );
}