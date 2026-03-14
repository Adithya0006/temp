// // import {
// //   Box, TextField, Button, Typography, Paper, Stack, CircularProgress,
// //   InputAdornment, IconButton, Checkbox, FormControlLabel, FormGroup,
// //   Accordion, AccordionSummary, AccordionDetails, Divider, Alert, Tooltip, Chip
// // } from "@mui/material";
// // import { useState, useEffect, useMemo } from "react";
// // import {
// //   ContentPaste as ContentPasteIcon,
// //   Search as SearchIcon,
// //   ExpandMore as ExpandMoreIcon,
// //   LibraryAddCheck as LibraryAddCheckIcon,
// //   Delete as DeleteIcon,
// //   RestartAlt as RestartAltIcon,
// //   FilePresent as FilePresentIcon,
// //   FileDownloadOff as FileDownloadOffIcon
// // } from "@mui/icons-material";
// // import { checkForLocalFile, checkBatchFilesLocal } from "./api";

// // export default function ProcessForm({ 
// //   form, savedData, onSubmit, FilteredData, actionType, 
// //   onFetchLastData, onFetchDataBySerial, currentSerial 
// // }) {
// //   const [values, setValues] = useState({});
// //   const [batchSelection, setBatchSelection] = useState({});
// //   const [batchFileStatus, setBatchFileStatus] = useState({}); // { "102": true/false }
// //   const [isValid, setIsValid] = useState(false);
// //   const [pasting, setPasting] = useState(false);
// //   const [searching, setSearching] = useState(false);
// //   const [searchSerial, setSearchSerial] = useState("");

// //   const hasFileField = useMemo(() => form.fields.some(f => f.type === "file"), [form]);

// //   const otherPcbs = useMemo(() => {
// //     return (FilteredData || []).filter(item => 
// //       item.serialNo !== currentSerial && item.serialNo !== "null" && item.serialNo !== null
// //     );
// //   }, [FilteredData, currentSerial]);

// //   // --- NEW: Reset Form ---
// //   const handleResetForm = () => {
// //     if (window.confirm("Are you sure you want to clear all inputs for this PCB?")) {
// //       setValues({});
// //     }
// //   };


// //   const handlePastePrevious = async () => {
// //     if (!onFetchLastData) return;
// //     setPasting(true);
// //     const dbData = await onFetchLastData();
// //     setPasting(false);
// //     if (dbData && Object.keys(dbData).length > 0) {
// //       setValues(prev => ({ ...prev, ...dbData }));
// //     } else {
// //       alert("No previous data found for this stage.");
// //     }
// //   };


// //   // --- NEW: Batch File Presence Indicators ---
// //   useEffect(() => {
// //     const checkBatch = async () => {
// //       if (otherPcbs.length > 0) {
// //         const serials = otherPcbs.map(p => p.serialNo);
// //         const results = await checkBatchFilesLocal(serials);
// //         setBatchFileStatus(results);
// //       }
// //     };
// //     checkBatch();
// //   }, [otherPcbs]);

// //   // Auto-link main file
// //   useEffect(() => {
// //     const autoLink = async () => {
// //       if (actionType !== 'view' && currentSerial) {
// //         const result = await checkForLocalFile(currentSerial);
// //         if (result.found) {
// //           const fileField = form.fields.find(f => f.type === "file");
// //           if (fileField && !values[fileField.key]) handleChange(fileField.key, result.fileName);
// //         }
// //       }
// //     };
// //     autoLink();
// //   }, [currentSerial, actionType, form.fields]);

// //   useEffect(() => {
// //     if (savedData) {
// //       const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;
// //       if (dataToLoad && Object.keys(dataToLoad).length > 0) setValues(dataToLoad);
// //     }
// //   }, [savedData]);

// //   // --- VALIDATION: STRICT FILE CHECK ---
// //   useEffect(() => {
// //     const allFilled = form.fields.every(field => {
// //       if (field.type === "checkbox") return true;
// //       if (field.type === "file") return values[field.key] && values[field.key].length > 0;
// //       const val = values[field.key];
// //       return val !== undefined && val !== null && val.toString().trim() !== "";
// //     });

// //     // Check if any selected batch PCB is missing a file
// //     const selectedSerials = Object.keys(batchSelection).filter(k => batchSelection[k]);
// //     const batchFilesMissing = selectedSerials.some(s => !batchFileStatus[s]);

// //     setIsValid(allFilled && !batchFilesMissing);
// //   }, [values, form, batchSelection, batchFileStatus]);

// //   const handleChange = (key, value) => setValues(prev => ({ ...prev, [key]: value }));

// //   const handleBatchToggle = (serial) => {
// //     setBatchSelection(prev => ({ ...prev, [serial]: !prev[serial] }));
// //   };

// //   const handleSelectAllBatch = (e) => {
// //     const newSelection = {};
// //     if (e.target.checked) otherPcbs.forEach(p => { newSelection[p.serialNo] = true; });
// //     setBatchSelection(newSelection);
// //   };

// //   const handleSave = () => onSubmit(values, "Started", Object.keys(batchSelection).filter(k => batchSelection[k]));
// //   const handleComplete = () => onSubmit(values, "Completed", Object.keys(batchSelection).filter(k => batchSelection[k]));

// //   return (
// //     <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
// //       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
// //         <Typography variant="h5" fontWeight="bold" color="primary">{form.stage_name}</Typography>
// //         <Stack direction="row" spacing={1}>
// //           <Button startIcon={<RestartAltIcon />} color="warning" size="small" onClick={handleResetForm} disabled={actionType === 'view'}>Reset Form</Button>
// //           {actionType !== 'view' && (
// //             <Button variant="outlined" size="small" startIcon={pasting ? <CircularProgress size={16} /> : <ContentPasteIcon />} onClick={handlePastePrevious}>Paste Last</Button>
// //           )}
// //         </Stack>
// //       </Stack>

// //       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
// //         {form.fields.map(f => (
// //           <Box key={f.key}>
// //             {f.type === "file" ? (
// //               <Stack direction="row" spacing={1} alignItems="center">
// //                 <Button variant="outlined" component="label" fullWidth sx={{ p: 2, borderStyle: 'dashed' }}>
// //                   {values[f.key] ? `✅ ${values[f.key]}` : `📂 Upload ${f.label} *`}
// //                   <input type="file" hidden onChange={e => handleChange(f.key, e.target.files[0]?.name)} />
// //                 </Button>
// //                 {values[f.key] && actionType !== 'view' && (
// //                   <IconButton color="error" onClick={() => handleChange(f.key, "")}><DeleteIcon /></IconButton>
// //                 )}
// //               </Stack>
// //             ) : f.type === "checkbox" ? (
// //               <FormControlLabel control={<Checkbox checked={!!values[f.key]} onChange={e => handleChange(f.key, e.target.checked)} />} label={f.label} />
// //             ) : (
// //               <TextField label={f.label} fullWidth value={values[f.key] || ""} onChange={e => handleChange(f.key, e.target.value)} />
// //             )}
// //           </Box>
// //         ))}
// //       </Box>

// //       {otherPcbs.length > 0 && actionType !== 'view' && (
// //         <Accordion sx={{ mt: 4 }}>
// //           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
// //             <Typography fontWeight="bold">Batch Select (File Sync Verification)</Typography>
// //           </AccordionSummary>
// //           <AccordionDetails>
// //             <FormControlLabel label="Select All" control={<Checkbox onChange={handleSelectAllBatch} />} />
// //             <Divider sx={{ my: 1 }} />
// //             <FormGroup row>
// //               {otherPcbs.map(pcb => {
// //                 const hasFile = batchFileStatus[pcb.serialNo];
// //                 return (
// //                   <Box key={pcb.serialNo} sx={{ width: '33%', display: 'flex', alignItems: 'center' }}>
// //                     <Checkbox checked={!!batchSelection[pcb.serialNo]} onChange={() => handleBatchToggle(pcb.serialNo)} />
// //                     <Typography variant="body2" sx={{ mr: 1 }}>{pcb.serialNo}</Typography>
// //                     {hasFile ? <Tooltip title="File Found"><FilePresentIcon color="success" fontSize="small" /></Tooltip> : 
// //                                <Tooltip title="File Missing"><FileDownloadOffIcon color="error" fontSize="small" /></Tooltip>}
// //                   </Box>
// //                 );
// //               })}
// //             </FormGroup>
// //           </AccordionDetails>
// //         </Accordion>
// //       )}

// //       <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
// //         {actionType === 'Start' && <Button variant="outlined" onClick={handleSave}>Save Progress</Button>}
// //         <Button variant="contained" color="success" onClick={handleComplete} disabled={!isValid}>
// //           Complete Task
// //         </Button>
// //       </Stack>
// //     </Paper>
// //   );
// // }













































// import {
//   Box, TextField, Button, Typography, Paper, Stack, CircularProgress,
//   InputAdornment, IconButton, Checkbox, FormControlLabel, FormGroup,
//   Accordion, AccordionSummary, AccordionDetails, Divider, Alert, Tooltip, Chip
// } from "@mui/material";
// import { useState, useEffect, useMemo } from "react";
// import {
//   ContentPaste as ContentPasteIcon,
//   Search as SearchIcon,
//   ExpandMore as ExpandMoreIcon,
//   LibraryAddCheck as LibraryAddCheckIcon,
//   Delete as DeleteIcon,
//   RestartAlt as RestartAltIcon,
//   FilePresent as FilePresentIcon,
//   FileDownloadOff as FileDownloadOffIcon
// } from "@mui/icons-material";
// // import { checkForLocalFile, checkBatchFilesLocal } from "./api";
// import { SaveIcon } from "lucide-react";
// import { checkForLocalFile, checkBatchFilesLocal } from "./api";
// import { LOCAL_WATCHER_URL } from "./api";

// export default function ProcessForm({ 
//   form, savedData, onSubmit, FilteredData, actionType, 
//   onFetchLastData, onFetchDataBySerial, currentSerial 
// }) {
//   const [values, setValues] = useState({});
//   const [batchSelection, setBatchSelection] = useState({});
//   const [batchFileStatus, setBatchFileStatus] = useState({}); // { "102": true/false }
//   const [isValid, setIsValid] = useState(false);
//   const [pasting, setPasting] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
  
//   // console.log("formformform from ProcessForm",form)
//   // --- NEW: State for Search ---
//   const [searching, setSearching] = useState(false);
//   const [searchSerial, setSearchSerial] = useState("");

//   const hasFileField = useMemo(() => form?.fields?.some(f => f.type === "file"), [form?.fields]);
//   const machineId = form?.machine_folder;
//   const otherPcbs = useMemo(() => {
//     return (FilteredData || []).filter(item => 
//       item.serialNo !== currentSerial && item.serialNo !== "null" && item.serialNo !== null
//     );
//   }, [FilteredData, currentSerial]);

//   // --- Reset Form ---
//   const handleResetForm = () => {
//     if (window.confirm("Are you sure you want to clear all inputs for this PCB?")) {
//       setValues({});
//     }
//   };

//   const handlePastePrevious = async () => {
//     if (!onFetchLastData) return;
//     setPasting(true);
//     const dbData = await onFetchLastData();
//     setPasting(false);
//     if (dbData && Object.keys(dbData).length > 0) {
//       setValues(prev => ({ ...prev, ...dbData }));
//     } else {
//       alert("No previous data found for this stage.");
//     }
//   };

//   // --- NEW: Handle Search by Serial ---
//   const handleSearchBySerial = async () => {
//     // console.log("entered!")
//     if (!searchSerial.trim()) {
//         alert("Please enter a PCB Serial Number");
//         return;
//     }
//     if (!onFetchDataBySerial) return;

//     setSearching(true);
//     const dbData = await onFetchDataBySerial(searchSerial);
//     setSearching(false);
//     // console.log("dbData: ",dbData)

//     if (dbData && Object.keys(dbData[0]?.log_Data).length > 0) {
//       // Merge retrieved data into current form values
//       setValues(prev => ({ ...prev, ...dbData[0]?.log_Data }));
//       // console.log("values: ",values)
//     } else {
//       alert("No data found for this Serial Number in the current stage.");
//     }
//   };

//   // --- Batch File Presence Indicators ---
//   useEffect(() => {
//     const checkBatch = async () => {
//       if (otherPcbs.length > 0 && hasFileField && machineId) {
//         const serials = otherPcbs.map(p => p.serialNo);
//         const results = await checkBatchFilesLocal(machineId, serials);
//         setBatchFileStatus(results);
//       }
//     };
//     checkBatch();
//   }, [otherPcbs, hasFileField, machineId]);

//   // Auto-link main file
//   useEffect(() => {
//     const autoLink = async () => {
//       if (actionType !== 'view' && currentSerial && hasFileField && machineId) {
//         const result = await checkForLocalFile(machineId, currentSerial);
//         // if (result.found) {
//         //   const fileField = form.fields.find(f => f.type === "file");
//         //   if (fileField && !values[fileField.key]) handleChange(fileField.key, result.fileName);
//         // }
//         if (result.found) {
//   const fileField = form.fields.find(f => f.type === "file");

//   if (fileField && !values[fileField.key]) {
//     const previewUrl =`${LOCAL_WATCHER_URL}/machine-file/${machineId}/${result.fileName}`;

//     handleChange(fileField.key, {
//       name: result.fileName,
//       url: previewUrl,
//       auto: true
//     });
//   }
// }
//       }
//     };
//     autoLink();
//   }, [currentSerial, actionType, form?.fields, hasFileField, machineId]);


//   useEffect(() => {
//   return () => {
//     Object.values(values).forEach(v => {
//       if (v?.preview) URL.revokeObjectURL(v.preview);
//     });
//   };
// }, [values]);



//   useEffect(() => {
//     if (savedData) {
//       const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;
//       if (dataToLoad && Object.keys(dataToLoad).length > 0) setValues(dataToLoad);
//     }
//   }, [savedData]);

//   // --- VALIDATION: STRICT FILE CHECK ---
// // Inside ProcessForm.js - Update this specific useEffect
// useEffect(() => {
//   const allFilled = form?.fields?.every(field => {
//     if (field.type === "checkbox") return true;
    
//     const val = values[field.key];
//     // if (field.type === "file") {
//     //   // FIX: Check if it's a File object OR a string with length
//     //   return val && (val instanceof File || (typeof val === 'string' && val.length > 0));
//     // }
//     if (field.type === "file") {
//   return (
//     val &&
//     (
//       val instanceof File ||
//       typeof val === "string" ||
//       val?.url ||
//       val?.file
//     )
//   );
// }
    
//     return val !== undefined && val !== null && val.toString().trim() !== "";
//   });

//   const selectedSerials = Object.keys(batchSelection).filter(k => batchSelection[k]);
//   const batchFilesMissing = hasFileField 
//      ? selectedSerials.some(s => !batchFileStatus[s])
//      : false;

//   setIsValid(allFilled && !batchFilesMissing);
// }, [values, form, batchSelection, batchFileStatus, hasFileField]);

//   const handleChange = (key, value) => {
//     // console.log("key in me: ",key," val in me: ",value)
//     setValues(prev => ({ ...prev, [key]: value }))};

//   const handleBatchToggle = (serial) => {
//     setBatchSelection(prev => ({ ...prev, [serial]: !prev[serial] }));
//   };

//   const handleSelectAllBatch = (e) => {
//     const newSelection = {};
//     if (e.target.checked) otherPcbs.forEach(p => { newSelection[p.serialNo] = true; });
//     setBatchSelection(newSelection);
//   };

//   const handleSave = () => onSubmit(values, "Started", Object.keys(batchSelection).filter(k => batchSelection[k]));
//   const handleComplete = () => onSubmit(values, "Completed", Object.keys(batchSelection).filter(k => batchSelection[k]));
//   const handleFileChange = (key, file) => {
//   if (!file) return;

//   const preview = URL.createObjectURL(file);

//   handleChange(key, {
//     name: file.name,
//     file: file,
//     preview: preview,
//     auto: false
//   });
// };
//   return (
//    <Paper
//   elevation={0}
//   sx={{
//     p: 4,
//     borderRadius: 3,
//     background: "linear-gradient(145deg, #ffffff, #f8fafc)",
//     border: "1px solid #e2e8f0",
//     boxShadow: `
//       0 10px 30px rgba(0, 0, 0, 0.08),
//       0 4px 12px rgba(99, 102, 241, 0.08)
//     `,
//     transition: "all 0.3s ease",

//     "&:hover": {
//       boxShadow: `
//         0 18px 50px rgba(88, 158, 114, 0.43),
//         0 8px 20px rgba(41, 43, 156, 0.48)
//       `,
//       // transform: "translateY(-3px)"
//     }
//   }}
// >
//       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//         <Typography variant="h5" fontWeight="bold" color="primary">{form?.stage_name}</Typography>

//         {/* <Stack direction="row" spacing={1}>
//           <Button startIcon={<RestartAltIcon />} color="warning" size="small" onClick={handleResetForm} disabled={actionType === 'view'}>Reset Form</Button>
//           {actionType !== 'view' && (
//             <Button variant="outlined" size="small" startIcon={pasting ? <CircularProgress size={16} /> : <ContentPasteIcon />} onClick={handlePastePrevious}>Paste Last</Button>
//           )}
//         </Stack> */}

//         <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
// <Button
//   startIcon={<RestartAltIcon fontSize="small" />}
//   size="small"
//   onClick={handleResetForm}
//   disabled={actionType === 'view'}
//   sx={{
//     minHeight: 32,
//     px: 2,
//     fontSize: "0.75rem",
//     fontWeight: 700,
//     borderRadius: "8px",
//     textTransform: "none",
//     backgroundColor: "#e99e4d",   // Soft orange
//     color: "#ffffff",
//     boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
//     "&:hover": {
//       backgroundColor: "#e35e17",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
//     },
//     "&:disabled": {
//       backgroundColor: "#e2e8f0",
//       color: "#94a3b8",
//       boxShadow: "none"
//     }
//   }}
// >
//   Reset
// </Button>

// {actionType !== "view" && (
//   <Button
//     size="small"
//     variant="outlined"
//     startIcon={
//       pasting
//         ? <CircularProgress size={14} color="inherit" />
//         : <ContentPasteIcon fontSize="small" />
//     }
//     onClick={handlePastePrevious}
//     sx={{
//       minHeight: 32,
//       px: 2,
//       fontSize: "0.69rem",
//       fontWeight: 700,
//       borderRadius: "8px",
//       borderWidth:"2.5px",
//       textTransform: "none",
//       borderColor: "#71a6d2",      // Professional blue
//       color: "#3b82f6",
//       "&:hover": {
//         backgroundColor: "#206ae3",
//         color: "#ffffff",
//         borderColor: "#2563eb"
//       },
//       "&:disabled": {
//         borderColor: "#cbd5e1",
//         color: "#94a3b8"
//       }
//     }}
//   >
//    Copy last Record
//   </Button>
// )}
// </Stack>
//       </Stack>

//       {/* --- NEW: Search Box Section --- */}
//       {actionType !== 'view' && (
//           // <Box sx={{ mb: 3, p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px dashed #cbd5e1" }}>
//           //   <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
//           //     COPY DATA FROM ANOTHER PCB
//           //   </Typography>
//           //   <Stack direction="row" spacing={1}>
//           //     <TextField 
//           //       size="small" 
//           //       placeholder="Enter PCB Serial No..." 
//           //       value={searchSerial}
//           //       onChange={(e) => setSearchSerial(e.target.value)}
//           //       sx={{ bgcolor: "white", flexGrow: 1 }}
//           //     />
//           //     <Button 
//           //       variant="contained" 
//           //       color="secondary" 
//           //       startIcon={searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
//           //       onClick={handleSearchBySerial}
//           //       disabled={searching || !searchSerial}
//           //     >
//           //       Search & Copy
//           //     </Button>
//           //   </Stack>
//           // </Box>

//           <Box
//   sx={{
//     mb: 3,
//     p: 3, // Increased padding for better spacing
//     bgcolor: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', // Soft gradient background
//     borderRadius: 3, // Rounded corners for a modern look
//     border: '1px solid #cbd5e1', // Subtle border
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
//   }}
// >
//   <Typography
//     variant="caption"
//     fontWeight="bold"
//     color="text.secondary"
//     sx={{
//       mb: 1,
//       display: 'block',
//       fontSize: '0.95rem', // Adjust font size for better readability
//       letterSpacing: '0.5px', // Slight letter spacing for clarity
//     }}
//   >
//     COPY DATA FROM ANOTHER PCB
//   </Typography>
  
//   <Stack direction="row" spacing={2} alignItems="center">
//     <TextField
//       size="small"
//       placeholder="Enter PCB Serial No..."
//       value={searchSerial}
//       onChange={(e) => setSearchSerial(e.target.value)}
//       sx={{
//         bgcolor: 'white',
//         flexGrow: 1,
//         borderRadius: '8px', // Rounded corners for input field
//         padding: '8px 16px', // Comfortable padding
//         '& .MuiOutlinedInput-root': {
//           '& fieldset': {
//             borderColor: '#cbd5e1', // Light border color
//           },
//           '&:hover fieldset': {
//             borderColor: '#81c784', // Green border on hover
//           },
//           '&.Mui-focused fieldset': {
//             borderColor: '#4caf50', // Green border when focused
//           },
//         },
//       }}
//     />
//     <Button
//       variant="contained"
//       color="secondary"
//       startIcon={searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
//       onClick={handleSearchBySerial}
//       disabled={searching || !searchSerial}
//       sx={{
//         background: 'linear-gradient(145deg, #088dc6, #77da7c)', // Gradient background
//         color: 'white',
//         fontWeight: 'bold',
//         padding: '8px 16px',
//         borderRadius: '30px',
//         '&:hover': {
//           background: 'linear-gradient(145deg, #81c784, #2bc9cb)', // Reverse gradient on hover
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Shadow effect on hover
//         },
//         '&:disabled': {
//           background: '#bdbdbd', // Disabled button background
//           color: '#757575', // Disabled text color
//         },
//       }}
//     >
//       Search & Copy
//     </Button>
//   </Stack>
// </Box>
//       )}

//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>


// {form?.fields.map(f => (
//   <Box key={f?.key}>
//     {f?.type === "file" ? (
//       <Stack direction="column" spacing={1}>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <Button variant="outlined" component="label" fullWidth sx={{ p: 2, borderStyle: 'dashed' }}>
//             {/* CRITICAL FIX: Check if values[f.key] is an object (File). 
//                If it is, render value.name. If it's a string, render value.
//             */}
//             {values[f?.key] 
//               ? (typeof values[f?.key] === 'object' ? `✅ ${values[f?.key]?.name}` : `✅ ${values[f?.key]}`)
//               : `📂 Upload ${f?.label} *`}
            
//             <input 
//               type="file" 
//               hidden 
//               onChange={e => {
//   const file = e.target.files[0];
//   if (file) {
//     handleFileChange(f.key, file);
//   }
// }}
//             />
//           </Button>

//           {/* Display Auto-Linked chip only if the value is a string (from machine folder) */}
//           {values[f?.key]?.auto && machineId && (
//   <Tooltip title={`Auto-linked from ${machineId}`}>
//     <Chip label="Auto-Linked" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
//   </Tooltip>
// )}

//           {values[f?.key] && actionType !== 'view' && (
//             <IconButton color="error" onClick={() => handleChange(f.key, null)}>
//               <DeleteIcon />
//             </IconButton>
//           )}
//         </Stack>

//         {/* --- File Preview Section --- */}
//         {values[f.key] && (
//   <Box sx={{ mt: 1 }}>
//     <iframe
//       src={
//         values[f.key]?.url ||
//         values[f.key]?.preview ||
//         (values[f.key]?.file ? URL.createObjectURL(values[f.key].file) : "")
//       }
//       width="100%"
//       height="250px"
//       style={{ border: "none" }}
//     />
//   </Box>
// )}
//       </Stack>
//     ) : f?.type === "checkbox" ? (
//       <FormControlLabel 
//         control={<Checkbox checked={!!values[f?.key]} onChange={e => handleChange(f?.key, e.target.checked)} />} 
//         label={f.label} 
//       />
//     ) : (
//       <TextField 
//         label={f.label} 
//         fullWidth 
//         value={values[f?.key] || ""} 
//         onChange={e => handleChange(f.key, e.target.value)} 
//       />
//     )}
//   </Box>
// ))}
//       </Box>

//       {otherPcbs.length > 0 && actionType !== 'view' && (
//         <Accordion sx={{ mt: 4 }}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Typography fontWeight="bold">
//               {hasFileField ? "Batch Select (File Sync Verification)" : "Apply Data to Other PCBs"}
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <FormControlLabel label="Select All" control={<Checkbox onChange={handleSelectAllBatch} />} />
//             <Divider sx={{ my: 1 }} />
//             <FormGroup row>
//               {otherPcbs.map(pcb => {
//                 const hasFile = batchFileStatus[pcb.serialNo];
//                 return (
//                   <Box key={pcb.serialNo} sx={{ width: '33%', display: 'flex', alignItems: 'center' }}>
//                     <Checkbox checked={!!batchSelection[pcb.serialNo]} onChange={() => handleBatchToggle(pcb.serialNo)} />
//                     <Typography variant="body2" sx={{ mr: 1 }}>{pcb.serialNo}</Typography>
//                     {hasFileField && (
//                         hasFile ? <Tooltip title="File Found"><FilePresentIcon color="success" fontSize="small" /></Tooltip> : 
//                                <Tooltip title="File Missing"><FileDownloadOffIcon color="error" fontSize="small" /></Tooltip>
//                     )}
//                   </Box>
//                 );
//               })}
//             </FormGroup>
//           </AccordionDetails>
//         </Accordion>
//       )}

//       <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
//         {/* {actionType === 'Start' && <Button variant="outlined" onClick={handleSave}>Save Progress</Button>} */}
//         {actionType === 'Start' && (
//   <Button
//     variant="contained"
//     onClick={handleSave}
//     sx={{
//       width:"fit-content",
//       background: 'linear-gradient(145deg, #95e698, #91cf94)', // Gradient background
//       color: '#fff', // White text
//       fontWeight: '600', // Bold text
//       padding: '10px 20px', // Padding for a comfortable size
//       borderRadius: '30px', // Rounded corners
//       textTransform: 'none', // Keeping text case normal
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
//       '&:hover': {
//         background: 'linear-gradient(145deg, #4c9a50, #4c904d)', // Reverse gradient on hover
//         boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
//       },
//       '&:disabled': {
//         background: '#bdbdbd', // Disabled button background
//         boxShadow: 'none', // Remove shadow when disabled
//         color: '#757575', // Disabled text color
//       },
//     }}
//   >
//     <SaveIcon sx={{ mr: 1 }} /> Save Progress {/* Adding a Save icon for better UX */}
//   </Button>
// )}
//         {/* <Button variant="contained" color="success" onClick={handleComplete} disabled={!isValid}> Complete Task </Button> */}
//         <Button
//   variant="contained"
//   color="success"
//   onClick={handleComplete}
//   disabled={!isValid}
//   sx={{
//     width:"fit-content",
//     background: 'linear-gradient(145deg, #66bb6a, #81c784)', // Gradient background
//     color: '#fff', // White text
//     fontWeight: '600', // Bold text
//     padding: '10px 20px', // Comfortable size
//     borderRadius: '30px', // Rounded corners
//     textTransform: 'none', // Keeping text case normal
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
//     '&:hover': {
//       background: 'linear-gradient(145deg, #81c784, #66bb6a)', // Reverse gradient on hover
//       boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
//     },
//     '&:disabled': {
//       background: '#bdbdbd', // Disabled button background
//       boxShadow: 'none', // Remove shadow when disabled
//       color: '#757575', // Disabled text color
//     },
//   }}
// >
//   Complete Task
// </Button>
        
//       </Stack>
//     </Paper>
//   );
// }













































import {
  Box, TextField, Button, Typography, Paper, Stack, CircularProgress,
  InputAdornment, IconButton, Checkbox, FormControlLabel, FormGroup,
  Accordion, AccordionSummary, AccordionDetails, Divider, Alert, Tooltip, Chip
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import {
  ContentPaste as ContentPasteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  LibraryAddCheck as LibraryAddCheckIcon,
  Delete as DeleteIcon,
  RestartAlt as RestartAltIcon,
  FilePresent as FilePresentIcon,
  FileDownloadOff as FileDownloadOffIcon
} from "@mui/icons-material";
import { SaveIcon } from "lucide-react";
import { checkForLocalFile, checkBatchFilesLocal, LOCAL_WATCHER_URL } from "./api";

export default function ProcessForm({ 
  form, savedData, onSubmit, FilteredData, actionType, 
  onFetchLastData, onFetchDataBySerial, currentSerial 
}) {
  const [values, setValues] = useState({});
  const [batchSelection, setBatchSelection] = useState({});
  const [batchFileStatus, setBatchFileStatus] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [pasting, setPasting] = useState(false);

  const [searching, setSearching] = useState(false);
  const [searchSerial, setSearchSerial] = useState("");

  const hasFileField = useMemo(() => form?.fields?.some(f => f.type === "file"), [form?.fields]);
  const machineId = form?.machine_folder;
  
  const otherPcbs = useMemo(() => {
    return (FilteredData || []).filter(item => 
      item.serialNo !== currentSerial && item.serialNo !== "null" && item.serialNo !== null
    );
  }, [FilteredData, currentSerial]);

  // --- Reset Form ---
  const handleResetForm = () => {
    if (window.confirm("Are you sure you want to clear all inputs for this PCB?")) {
      setValues({});
    }
  };

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

  const handleSearchBySerial = async () => {
    if (!searchSerial.trim()) {
        alert("Please enter a PCB Serial Number");
        return;
    }
    if (!onFetchDataBySerial) return;

    setSearching(true);
    const dbData = await onFetchDataBySerial(searchSerial);
    setSearching(false);

    if (dbData && dbData[0]?.log_Data && Object.keys(dbData[0]?.log_Data).length > 0) {
      setValues(prev => ({ ...prev, ...dbData[0]?.log_Data }));
    } else {
      alert("No data found for this Serial Number in the current stage.");
    }
  };

  // --- Batch File Presence Indicators ---
  useEffect(() => {
    const checkBatch = async () => {
      if (otherPcbs.length > 0 && hasFileField && machineId) {
        const serials = otherPcbs.map(p => p.serialNo);
        const results = await checkBatchFilesLocal(machineId, serials);
        setBatchFileStatus(results);
      }
    };
    checkBatch();
  }, [otherPcbs, hasFileField, machineId]);

  // --- Auto-link machine file logic ---
  useEffect(() => {
    const autoLink = async () => {
      if (actionType !== 'view' && currentSerial && hasFileField && machineId) {
        const result = await checkForLocalFile(machineId, currentSerial);
        if (result.found) {
          const fileField = form.fields.find(f => f.type === "file");
          
          // Only auto-link if the user hasn't manually uploaded or already linked a file
          if (fileField && !values[fileField.key]) {
            const previewUrl = `${LOCAL_WATCHER_URL}/machine-file/${machineId}/${result.fileName}`;
            
            // Updates state with file metadata for previewing and submission
            handleChange(fileField.key, {
              name: result.fileName,
              url: previewUrl,
              auto: true // Flag to identify auto-linked files
            });
          }
        }
      }
    };
    autoLink();
  }, [currentSerial, actionType, form?.fields, hasFileField, machineId]);

  // Cleanup for object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(values).forEach(v => {
        if (v?.preview) URL.revokeObjectURL(v.preview);
      });
    };
  }, [values]);

  useEffect(() => {
    if (savedData) {
      const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;
      if (dataToLoad && Object.keys(dataToLoad).length > 0) setValues(dataToLoad);
    }
  }, [savedData]);

  // --- VALIDATION AND BUTTON TOGGLING ---
 // --- VALIDATION AND BUTTON TOGGLING ---
  // This effect runs every time an input value, form config, or batch selection changes
  useEffect(() => {
    // 1. Check if all mandatory fields in the form are filled
    const allFilled = form?.fields?.every(field => {
      // Checkboxes are optional by default in this logic
      if (field.type === "checkbox") return true;
      
      const val = values[field.key];

      // File Field Validation logic
      if (field.type === "file") {
        // A file field is valid if it contains:
        // - A standard JS File object (from manual upload)
        // - A URL or preview string (from auto-sync/D:drive)
        // - A simple string (from previously saved database records)
        return !!(
          val && 
          (val instanceof File || val?.url || val?.file || val?.preview || typeof val === "string")
        );
      }
      
      // Text, Number, and TextArea validation
      // Ensures the value isn't null, undefined, or just empty whitespace
      return val !== undefined && val !== null && val.toString().trim() !== "";
    });

    // 2. Batch Synchronization Validation
    // Get list of serial numbers selected in the "Batch Apply" section
    const selectedSerials = Object.keys(batchSelection).filter(k => batchSelection[k]);

    // Check if any of the selected batch PCBs are missing their machine files on the D: drive
    // This only triggers if the current stage actually has a file field (hasFileField)
    const batchFilesMissing = hasFileField 
       ? selectedSerials.some(s => !batchFileStatus[s])
       : false;

    // 3. Set Final Validity
    // The "Complete Task" button will enable ONLY if:
    // - All fields in the current form are filled (allFilled)
    // - AND no selected batch PCBs are missing required files (!batchFilesMissing)
    setIsValid(allFilled && !batchFilesMissing);

  }, [values, form, batchSelection, batchFileStatus, hasFileField]);
  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleBatchToggle = (serial) => {
    setBatchSelection(prev => ({ ...prev, [serial]: !prev[serial] }));
  };

  const handleSelectAllBatch = (e) => {
    const newSelection = {};
    if (e.target.checked) otherPcbs.forEach(p => { newSelection[p.serialNo] = true; });
    setBatchSelection(newSelection);
  };

  const handleSave = () => onSubmit(values, "Started", Object.keys(batchSelection).filter(k => batchSelection[k]));
  const handleComplete = () => onSubmit(values, "Completed", Object.keys(batchSelection).filter(k => batchSelection[k]));
  
  const handleFileChange = (key, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    handleChange(key, {
      name: file.name,
      file: file,
      preview: preview,
      auto: false
    });
  };

  const isFileReady = useMemo(() => {
  // Find the key for the file field in your form config
  const fileField = form?.fields?.find(f => f.type === "file");
  if (!fileField) return false;

  const val = values[fileField.key];
  
  // Return true if value exists and is a File object, a preview URL, or a string
  return !!(
    val && 
    (val instanceof File || val?.url || val?.preview || val?.file || typeof val === "string")
  );
}, [values, form?.fields]);


  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        background: "linear-gradient(145deg, #ffffff, #f8fafc)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(99, 102, 241, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 18px 50px rgba(88, 158, 114, 0.43), 0 8px 20px rgba(41, 43, 156, 0.48)",
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">{form?.stage_name}</Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            startIcon={<RestartAltIcon fontSize="small" />}
            size="small"
            onClick={handleResetForm}
            disabled={actionType === 'view'}
            sx={{
              minHeight: 32, px: 2, fontSize: "0.75rem", fontWeight: 700, borderRadius: "8px",
              textTransform: "none", backgroundColor: "#e99e4d", color: "#ffffff",
              "&:hover": { backgroundColor: "#e35e17" }
            }}
          >
            Reset
          </Button>

          {actionType !== "view" && (
            <Button
              size="small"
              variant="outlined"
              startIcon={pasting ? <CircularProgress size={14} /> : <ContentPasteIcon fontSize="small" />}
              onClick={handlePastePrevious}
              sx={{
                minHeight: 32, px: 2, fontSize: "0.69rem", fontWeight: 700, borderRadius: "8px",
                borderWidth: "2.5px", textTransform: "none", borderColor: "#71a6d2", color: "#3b82f6",
                "&:hover": { backgroundColor: "#206ae3", color: "#ffffff", borderColor: "#2563eb" }
              }}
            >
              Copy last Record
            </Button>
          )}
        </Stack>
      </Stack>

      {actionType !== 'view' && (
        <Box sx={{ mb: 3, p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', fontSize: '0.95rem' }}>
            COPY DATA FROM ANOTHER PCB
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Enter PCB Serial No..."
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              sx={{ bgcolor: 'white', flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              startIcon={searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              onClick={handleSearchBySerial}
              disabled={searching || !searchSerial}
              sx={{ borderRadius: '30px', fontWeight: 'bold' }}
            >
              Search & Copy
            </Button>
          </Stack>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
        {form?.fields.map(f => (
          <Box key={f?.key}>
            {f?.type === "file" ? (
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button variant="outlined" component="label" fullWidth sx={{ p: 2, borderStyle: 'dashed' }}>
                    {values[f?.key] 
                      ? (typeof values[f?.key] === 'object' ? `✅ ${values[f?.key]?.name}` : `✅ ${values[f?.key]}`)
                      : `📂 Upload ${f?.label} *`}
                    <input type="file" hidden onChange={e => handleFileChange(f.key, e.target.files[0])} />
                  </Button>

                  {values[f?.key]?.auto && machineId && (
                    <Tooltip title={`Auto-linked from ${machineId}`}>
                      <Chip label="Auto-Linked" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
                    </Tooltip>
                  )}

                  {values[f?.key] && actionType !== 'view' && (
                    <IconButton color="error" onClick={() => handleChange(f.key, null)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>

                {values[f.key] && (
                  <Box sx={{ mt: 1 }}>
                    <iframe
                      src={values[f.key]?.url || values[f.key]?.preview || (values[f.key]?.file ? URL.createObjectURL(values[f.key].file) : "")}
                      width="100%"
                      height="350px"
                      style={{ border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    />
                  </Box>
                )}
              </Stack>
            ) : f?.type === "checkbox" ? (
              <FormControlLabel 
                control={<Checkbox checked={!!values[f?.key]} onChange={e => handleChange(f?.key, e.target.checked)} />} 
                label={f.label} 
              />
            ) : (
              <TextField 
                label={f.label} fullWidth 
                value={values[f?.key] || ""} 
                onChange={e => handleChange(f.key, e.target.value)} 
              />
            )}
          </Box>
        ))}
      </Box>

      {otherPcbs.length > 0 && actionType !== 'view' && (
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">
              {hasFileField ? "Batch Select (File Sync Verification)" : "Apply Data to Other PCBs"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel label="Select All" control={<Checkbox onChange={handleSelectAllBatch} />} />
            <Divider sx={{ my: 1 }} />
            <FormGroup row>
              {otherPcbs.map(pcb => {
                const hasFile = batchFileStatus[pcb.serialNo];
                return (
                  <Box key={pcb.serialNo} sx={{ width: '33%', display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={!!batchSelection[pcb.serialNo]} onChange={() => handleBatchToggle(pcb.serialNo)} />
                    <Typography variant="body2" sx={{ mr: 1 }}>{pcb.serialNo}</Typography>
                    {hasFileField && (
                        hasFile ? <Tooltip title="File Found"><FilePresentIcon color="success" fontSize="small" /></Tooltip> : 
                                   <Tooltip title="File Missing"><FileDownloadOffIcon color="error" fontSize="small" /></Tooltip>
                    )}
                  </Box>
                );
              })}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
        {actionType === 'Start' && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isFileReady} // Disable SAVE when file is auto-linked or manually uploaded
            sx={{
              width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
              background: 'linear-gradient(145deg, #95e698, #91cf94)',
              "&:hover": { background: 'linear-gradient(145deg, #4c9a50, #4c904d)' }
            }}
          >
            <SaveIcon sx={{ mr: 1 }} /> Save Progress
          </Button>
        )}
        <Button
          variant="contained" color="success" onClick={handleComplete}
          disabled={!isValid} // Enabled only if file and all fields are present
          sx={{
            width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
            background: 'linear-gradient(145deg, #66bb6a, #81c784)',
            "&:hover": { background: 'linear-gradient(145deg, #81c784, #66bb6a)' }
          }}
        >
          Complete Task
        </Button>
      </Stack>
    </Paper>
  );
}
