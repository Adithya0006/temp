import { Box, Card, Typography } from "@mui/material";
import React from "react";

export default function CARD({ data }) {
  return (
    <>
      {data.map((item, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "blue",
            width: "500px",
            mb: 2,
            p: 2,
            borderRadius: 5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Card sx={{ p: 1, mr: 3, width: "200px" }}>
              <Typography>{item.month}</Typography>
              <Typography>{item.year}</Typography>
              <Typography>{item.date}</Typography>
            </Card>

            <Typography
              sx={{
                ml: "auto",
                color: "white",
                fontWeight: "bolder",
              }}
            >
              {item.title}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
