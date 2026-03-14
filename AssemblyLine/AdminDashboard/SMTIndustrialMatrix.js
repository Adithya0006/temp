

import React, { useState } from 'react';
import {
  Box, Grid, Paper, Typography, Stack
} from '@mui/material';
import {
  AlertTriangle, CheckCircle2, Clock, Zap, ArrowUpRight
} from 'lucide-react';
import { styled, keyframes } from '@mui/system';

/* ---------------- Animations ---------------- */

const pulseRed = keyframes`
  0% { box-shadow: 0 0 0px #ef4444 }
  50% { box-shadow: 0 0 15px #ef4444 }
  100% { box-shadow: 0 0 0px #ef4444 }
`;

const glowIndicator = keyframes`
  0% { transform: scale(1) }
  50% { transform: scale(1.2) }
  100% { transform: scale(1) }
`;

/* ---------------- Styled Components ---------------- */

const MachineTile = styled(Paper)(({ isbreakdown }) => ({
  position: "relative",
  borderRadius: 12,
  overflow: "hidden",
  background: "#fff",
  border: isbreakdown ? "2px solid #ef4444" : "1px solid #e2e8f0",
  transition: "0.25s",
  animation: isbreakdown ? `${pulseRed} 2s infinite` : "none"
}));

const ImageContainer = styled(Box)({
  width: "100%",
  height: 110,
  overflow: "hidden"
});

const StyledImg = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover"
});

const StatusLamp = styled(Box)(({ statuscolor, blinking }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: statuscolor,
  border: "2px solid white",
  boxShadow: `0 0 10px ${statuscolor}`,
  animation: blinking ? `${glowIndicator} 1s infinite` : "none"
}));

/* -------- Hover Info (Overlay — does NOT change layout) -------- */

const HoverInfo = styled(Box)(({ visible }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  background: "rgba(15,23,42,0.95)",
  color: "white",
  padding: 12,
  fontSize: 12,
  transform: visible ? "translateY(0)" : "translateY(100%)",
  transition: "0.3s"
}));

/* ---------------- Mock Data ---------------- */
// const customImages = {
//   "Solder Printer": "http://googleusercontent.com/image_collection/image_retrieval/1825745648016117464", // Your printer image
//   "3D SPI": "http://googleusercontent.com/image_collection/image_retrieval/15948338372038917545",         // Your SPI image
//   "Mounter": "http://googleusercontent.com/image_collection/image_retrieval/10491836863442308952",        // Your Pick & Place image
//   "Reflow Oven": "http://googleusercontent.com/image_collection/image_retrieval/6388947297201480976"      // Your Reflow image
// };
// const MACHINES = Array.from({ length: 5 }, (_, i) => ({
//   id: `LINE-A-${String(i + 1).padStart(2, "0")}`,
//   name: ["Solder Printer", "3D SPI", "Mounter", "Reflow Oven"][i % 4],
//   status:
//     i === 3 || i === 8
//       ? "BREAKDOWN"
//       : i % 5 === 0
//       ? "PM_DUE"
//       : "RUNNING",
//   img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
//   efficiency: "92%",
//   operator: "Tech_042",
//   temp: "245°C"
// }));

const customImages = {
  // Just start with a forward slash. The slash means "start at the public folder"
  "Cleaning": "/Icons/cleaningofbarepcb.jpg", 
  "Labelling": "/Icons/labelingofbarepcb.jpg",
  "Solder Paste Printing": "/Icons/solderingandpasteandpriniting.png",
  "Solder Paste Inspection": "/Icons/soliderpasterinspection.png",
  "Pick and Place": "/Icons/Pick_and_place_internals_of_surface_mount_machine.jpg",
  "Reflow": "/Icons/relow.jpg",

};

export const MACHINES = Array.from({ length: 7 }, (_, i) => {
  const machineName = ["Cleaning","Labelling","Solder Paste Printing","Solder Paste Inspection","Pick and Place","Reflow"][i % 6];

  return {
    id: `LINE-A-${String(i + 1).padStart(2, "0")}`,
    name: machineName,
    status: i === 3 || i === 8 ? "BREAKDOWN" : i % 5 === 0 ? "PM_DUE" : "RUNNING",
    
    // This will correctly attach the public folder path
    img: customImages[machineName], 
    
    efficiency: "92%",
    operator: "Tech_042",
    temp: "245°C"
  };
});
/* ---------------- Component ---------------- */

const SMTIndustrialMatrix = () => {

  const [hoveredId, setHoveredId] = useState(null);

  const getStatus = (status) => {
    switch (status) {
      case "RUNNING":
        return { color: "#0ea5e9", blinking: true, icon: <Zap size={14}/> };
      case "PM_DUE":
        return { color: "#f59e0b", blinking: false, icon: <Clock size={14}/> };
      case "BREAKDOWN":
        return { color: "#ef4444", blinking: true, icon: <AlertTriangle size={14}/> };
      default:
        return { color: "#10b981", blinking: false, icon: <CheckCircle2 size={14}/> };
    }
  };

  return (

    <Box sx={{ p: 3, bgcolor: "#0f172a", minHeight: "100vh" }}>

      <Grid container spacing={2}>

        {MACHINES.map((m) => {

          const config = getStatus(m.status);
          const hovered = hoveredId === m.id;

          return (

            <Grid item xs={6} sm={4} md={3} lg={2.4} key={m.id}>

              <MachineTile
                isbreakdown={m.status === "BREAKDOWN"}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
              >

                {/* Machine Image */}

                <ImageContainer>

                  <StatusLamp
                    statuscolor={config.color}
                    blinking={config.blinking}
                  />

                  <StyledImg src={m.img} />

                </ImageContainer>

                {/* Machine Name */}

                <Box sx={{ p: 1.5 }}>

                  <Typography
                    fontSize={10}
                    fontWeight={800}
                    sx={{ color: config.color }}
                  >
                    {m.id}
                  </Typography>

                  <Typography fontSize={14} fontWeight={700}>
                    {m.name}
                  </Typography>

                </Box>

                {/* Hover Panel */}

                <HoverInfo visible={hovered}>

                  <Stack spacing={0.5}>

                    <Stack direction="row" justifyContent="space-between">
                      <span>OEE</span>
                      <b>{m.efficiency}</b>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <span>Temp</span>
                      <b>{m.temp}</b>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <span>Operator</span>
                      <b>{m.operator}</b>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        mt: 1,
                        fontSize: 11,
                        gap: 0.5
                      }}
                    >
                      <ArrowUpRight size={12}/>
                      ANALYTICS
                    </Stack>

                  </Stack>

                </HoverInfo>

              </MachineTile>

            </Grid>

          );

        })}

      </Grid>

    </Box>

  );

};

export default SMTIndustrialMatrix;
