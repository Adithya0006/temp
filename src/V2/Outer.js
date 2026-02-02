import React from "react";
import { Box } from "@mui/material";
import CARD from "./CARD";

export default function Outer({ tempdata }) {
  if (!tempdata.length) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          p: 2,
          backgroundColor: "yellow",
          border: "2px solid black",
          borderRadius: "40px",
          mt: 3,
        }}
      >
        <CARD data={tempdata} />
      </Box>
    </Box>
  );
}
