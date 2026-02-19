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
import { checkForLocalFile, checkBatchFilesLocal } from "./api";

export default function ProcessForm({ 
  form, savedData, onSubmit, FilteredData, actionType, 
  onFetchLastData, onFetchDataBySerial, currentSerial 
}) {
  const [values, setValues] = useState({});
  const [batchSelection, setBatchSelection] = useState({});
  const [batchFileStatus, setBatchFileStatus] = useState({}); // { "102": true/false }
  const [isValid, setIsValid] = useState(false);
  const [pasting, setPasting] = useState(false);
  
  // --- State for Search ---
  const [searching, setSearching] = useState(false);
  const [searchSerial, setSearchSerial] = useState("");

  // Check if the current form has a file upload requirement
  const hasFileField = useMemo(() => form.fields.some(f => f.type === "file"), [form]);
  
  // NEW: Identify which machine folder this stage should trace files from
  const machineId = form.machine_folder; 

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

  // --- Handle Search by Serial ---
  const handleSearchBySerial = async () => {
    if (!searchSerial.trim()) {
        alert("Please enter a PCB Serial Number");
        return;
    }
    if (!onFetchDataBySerial) return;

    setSearching(true);
    const dbData = await onFetchDataBySerial(searchSerial);
    setSearching(false);

    if (dbData && Object.keys(dbData[0]?.log_Data).length > 0) {
      // Merge retrieved data into current form values
      setValues(prev => ({ ...prev, ...dbData[0]?.log_Data }));
    } else {
      alert("No data found for this Serial Number in the current stage.");
    }
  };

  // --- UPDATED: Batch File Presence Indicators ---
  // Now uses machineId to look in the correct stage-specific folder
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

  // --- UPDATED: Auto-link main file ---
  // Now uses machineId to ensure it links the file from the correct machine
  useEffect(() => {
    const autoLink = async () => {
      if (actionType !== 'view' && currentSerial && hasFileField && machineId) {
        const result = await checkForLocalFile(machineId, currentSerial);
        if (result.found) {
          const fileField = form.fields.find(f => f.type === "file");
          if (fileField && !values[fileField.key]) handleChange(fileField.key, result.fileName);
        }
      }
    };
    autoLink();
  }, [currentSerial, actionType, form.fields, hasFileField, machineId]);

  useEffect(() => {
    if (savedData) {
      const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;
      if (dataToLoad && Object.keys(dataToLoad).length > 0) setValues(dataToLoad);
    }
  }, [savedData]);

  // --- VALIDATION: STRICT FILE CHECK ---
  useEffect(() => {
    const allFilled = form.fields.every(field => {
      if (field.type === "checkbox") return true;
      if (field.type === "file") return values[field.key] && values[field.key].length > 0;
      const val = values[field.key];
      return val !== undefined && val !== null && val.toString().trim() !== "";
    });

    // Check if any selected batch PCB is missing a file in the specific machine folder
    const selectedSerials = Object.keys(batchSelection).filter(k => batchSelection[k]);
    const batchFilesMissing = hasFileField && machineId
       ? selectedSerials.some(s => !batchFileStatus[s])
       : false;

    setIsValid(allFilled && !batchFilesMissing);
  }, [values, form, batchSelection, batchFileStatus, hasFileField, machineId]);

  const handleChange = (key, value) => setValues(prev => ({ ...prev, [key]: value }));

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

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">{form.stage_name}</Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<RestartAltIcon />} color="warning" size="small" onClick={handleResetForm} disabled={actionType === 'view'}>Reset Form</Button>
          {actionType !== 'view' && (
            <Button variant="outlined" size="small" startIcon={pasting ? <CircularProgress size={16} /> : <ContentPasteIcon />} onClick={handlePastePrevious}>Paste Last</Button>
          )}
        </Stack>
      </Stack>

      {/* Search Box Section */}
      {actionType !== 'view' && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px dashed #cbd5e1" }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              COPY DATA FROM ANOTHER PCB
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField 
                size="small" 
                placeholder="Enter PCB Serial No..." 
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                sx={{ bgcolor: "white", flexGrow: 1 }}
              />
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                onClick={handleSearchBySerial}
                disabled={searching || !searchSerial}
              >
                Search & Copy
              </Button>
            </Stack>
          </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
        {form.fields.map(f => (
          <Box key={f.key}>
            {f.type === "file" ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" component="label" fullWidth sx={{ p: 2, borderStyle: 'dashed' }}>
                  {values[f.key] ? `✅ ${values[f.key]}` : `📂 Upload ${f.label} *`}
                  <input type="file" hidden onChange={e => handleChange(f.key, e.target.files[0]?.name)} />
                </Button>
                
                {/* Visual Indicator for automated tracing */}
                {values[f.key] && machineId && (
                    <Tooltip title={`File traced from machine: ${machineId}`}>
                        <Chip label="Auto-Linked" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
                    </Tooltip>
                )}

                {values[f.key] && actionType !== 'view' && (
                  <IconButton color="error" onClick={() => handleChange(f.key, "")}><DeleteIcon /></IconButton>
                )}
              </Stack>
            ) : f.type === "checkbox" ? (
              <FormControlLabel control={<Checkbox checked={!!values[f.key]} onChange={e => handleChange(f.key, e.target.checked)} />} label={f.label} />
            ) : (
              <TextField label={f.label} fullWidth value={values[f.key] || ""} onChange={e => handleChange(f.key, e.target.value)}   />
            )}
          </Box>
        ))}
      </Box>

      {otherPcbs.length > 0 && actionType !== 'view' && (
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">
              {hasFileField && machineId ? `Batch Select (Traced from ${machineId})` : "Apply Data to Other PCBs"}
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
                    {hasFileField && machineId && (
                        hasFile ? <Tooltip title="File Found in Machine Folder"><FilePresentIcon color="success" fontSize="small" /></Tooltip> : 
                               <Tooltip title="File Missing in Machine Folder"><FileDownloadOffIcon color="error" fontSize="small" /></Tooltip>
                    )}
                  </Box>
                );
              })}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
        {actionType === 'Start' && <Button variant="outlined" onClick={handleSave}>Save Progress</Button>}
        <Button variant="contained" color="success" onClick={handleComplete} disabled={!isValid}>
          Complete Task
        </Button>
      </Stack>
    </Paper>
  );
}
