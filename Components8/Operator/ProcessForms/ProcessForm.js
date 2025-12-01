import {
  Box, TextField, Button, Typography, Paper
} from "@mui/material";
import { useState, useEffect } from "react";

export default function ProcessForm({ form, savedData, onSubmit }) {

  const [values, setValues] = useState({});

  useEffect(() => {
    if (savedData?.process_data) {
      setValues(savedData.process_data);
    }
  }, [savedData]);

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
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

      <Button
        variant="contained"
        onClick={() => onSubmit(values)}
      >
        Save
      </Button>

    </Paper>
  );
}
