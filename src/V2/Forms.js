import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import Outer from "./Outer";

export default function Forms() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    age: "",
    bg: "",
  });

  // ARRAY for multiple cards
  const [data, setData] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setData(prev => [
      ...prev,
      {
        year: formData.fname,
        month: formData.lname,
        date: formData.age,
        title: formData.bg,
      },
    ]);

    // reset form
    setFormData({
      fname: "",
      lname: "",
      age: "",
      bg: "",
    });
  }

  return (
    <>
      <Box
        sx={{
          border: "2px solid black",
          borderRadius: "5px",
          width: "fit-content",
          p: 2,
        }}
      >
        <TextField
          label="year"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
          sx={{ m: 1 }}
        />

        <TextField
          label="month"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
          sx={{ m: 1 }}
        />

        <TextField
          label="date"
          name="age"
          value={formData.age}
          onChange={handleChange}
          sx={{ m: 1 }}
        />

        <TextField
          label="title"
          name="bg"
          value={formData.bg}
          onChange={handleChange}
          sx={{ m: 1 }}
        />
      </Box>

      <Button
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        SUBMIT
      </Button>

      <Outer tempdata={data} />
    </>
  );
}
