
import {
  Box, TextField, Button, Typography, Paper, Stack
} from "@mui/material";
import { useState, useEffect } from "react";

export default function ProcessForm({ form, savedData, onSubmit, FilteredData, actionType }) {

  const [values, setValues] = useState({});

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

  // Triggered by the "Save" button (Start Mode)
  const handleSave = () => {
    // Sends "Started" status
    onSubmit(values, "Started");
  };

  // Triggered by the "Complete" button (Complete Mode)
  const handleComplete = () => {
    // Sends "Completed" status
    onSubmit(values, "Completed");
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>

      <Typography variant="h6" sx={{ mb: 2 }}>
        {form.stage_name}
      </Typography>

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
              {f.label}
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
        
        {/* CASE 1: Start Mode -> Show ONLY Save Button */}
        {actionType === 'Start' && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save (Start Task)
          </Button>
        )}

        {/* CASE 2: Complete Mode -> Show ONLY Complete Button */}
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