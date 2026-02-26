

// import React, { useState, useRef } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   Typography,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Box,
//   Divider,
//   IconButton,
//   Tooltip
// } from "@mui/material";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen"; // Icon for Browse
// import SaveIcon from "@mui/icons-material/Save"; // Icon for Save/Upload
// import CloseIcon from "@mui/icons-material/Close"; // Icon for Cancel
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DownloadIcon from "@mui/icons-material/Download";

// const FabricationComponents = () => {
//   // Helper to create row data with an extra 'tempFile' field for the 2-step process
//   const createRow = (id, name) => ({ 
//     id, 
//     documentName: name, 
//     file: null,      // The actual saved file
//     tempFile: null   // The file selected via "Browse" but not yet "Uploaded"
//   });

//   const [partA, setPartA] = useState([
//     createRow(1, "Certificate Of Conformity (COC)"),
//     createRow(2, "First Article Inspection"),
//     createRow(3, "Raw Material Purchased Document"),
//     createRow(4, "Raw Material Test Reports MECHANICAL and CHEMICAL (NABL Approved)."),
//     createRow(5, "Planting or special process certificate With Sample Coupon"),
//     createRow(6, "Ballon Drawing With Inspection Reports"),
//   ]);

//   const [partB, setPartB] = useState([
//     createRow(1, "Certificate Of Conformity (COC)"),
//     createRow(2, "Planting or special process certificate"),
//     createRow(3, "Balloon Drawing with Inspection Reports"),
//   ]);

//   const [viewFile, setViewFile] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   // Hidden file input references
//   const fileInputRefA = useRef(null);
//   const fileInputRefB = useRef(null);
//   const [activeUploadContext, setActiveUploadContext] = useState(null);

//   // 1. Handle File Selection (Browse)
//   const handleFileChange = (event, section) => {
//     const uploadedFile = event.target.files[0];
//     if (!uploadedFile) return;

//     if (uploadedFile.type !== "application/pdf") {
//       alert("Please upload PDF files only.");
//       return;
//     }

//     const { id } = activeUploadContext;
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     // Update 'tempFile' instead of 'file'
//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: uploadedFile } : item
//     );

//     updateState(updatedList);
//     event.target.value = null; 
//   };

//   // 2. Handle Confirm Upload (Save)
//   const handleConfirmUpload = (id, section) => {
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     const updatedList = currentState.map((item) => {
//       if (item.id === id) {
//         return { ...item, file: item.tempFile, tempFile: null }; // Move temp to real file
//       }
//       return item;
//     });
//     updateState(updatedList);
//   };

//   // 3. Handle Cancel Browse
//   const handleCancelBrowse = (id, section) => {
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: null } : item
//     );
//     updateState(updatedList);
//   };


//   const triggerUpload = (id, section) => {
//     setActiveUploadContext({ id, section });
//     if (section === "A") fileInputRefA.current.click();
//     else fileInputRefB.current.click();
//   };

//   const handleDelete = (id, section) => {
//     const confirmDelete = window.confirm("Are you sure you want to remove this PDF?");
//     if (confirmDelete) {
//       const updateState = section === "A" ? setPartA : setPartB;
//       const currentState = section === "A" ? partA : partB;

//       const updatedList = currentState.map((item) =>
//         item.id === id ? { ...item, file: null, tempFile: null } : item
//       );
//       updateState(updatedList);
//     }
//   };

//   const handleView = (file) => {
//     const fileURL = URL.createObjectURL(file);
//     setViewFile({ url: fileURL, name: file.name });
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     if (viewFile) URL.revokeObjectURL(viewFile.url);
//     setViewFile(null);
//   };

//   const handleDownload = (file) => {
//     const fileURL = URL.createObjectURL(file);
//     const link = document.createElement("a");
//     link.href = fileURL;
//     link.download = file.name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(fileURL);
//   };

//   const triggerBrowse = (id, section) => {
//     setActiveUploadContext({ id, section });
//     if (section === "A") fileInputRefA.current.click();
//     else fileInputRefB.current.click();
//   };

//   const RenderTable = ({ data, sectionTitle, sectionKey }) => (
//     <Box sx={{ mb: 4 }}>
//       <Typography variant="h6" sx={{ backgroundColor: "lavender", p: 1 }}>
//         {sectionTitle}
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: "bolder" }}>SL.No</TableCell>
//             <TableCell sx={{ fontWeight: "bolder" }}>Requirement</TableCell>
//             <TableCell sx={{ fontWeight: "bolder" }}>File Status</TableCell>
//             <TableCell sx={{ fontWeight: "bolder", textAlign: "center", minWidth: 200 }}>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {data.map((item, index) => (
//             <TableRow key={item.id}>
//               <TableCell>{index + 1}</TableCell>
//               <TableCell>{item.documentName}</TableCell>
//               <TableCell>
//                 {/* Logic to show status: Uploaded File Name OR Selected Temp File OR Not Uploaded */}
//                 {item.file ? (
//                   <Typography variant="body2" color="primary" fontWeight="bold">
//                     {item.file.name} (Saved)
//                   </Typography>
//                 ) : item.tempFile ? (
//                   <Typography variant="body2" color="orange" fontWeight="bold">
//                     {item.tempFile.name} (Ready to Upload)
//                   </Typography>
//                 ) : (
//                   <span style={{ color: "gray" }}>Not Uploaded</span>
//                 )}
//               </TableCell>
//               <TableCell sx={{ textAlign: "center" }}>
                
//                 {/* Scenario 1: No file saved, No file selected -> SHOW BROWSE */}
//                 {!item.file && !item.tempFile && (
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     startIcon={<FolderOpenIcon />}
//                     onClick={() => triggerBrowse(item.id, sectionKey)}
//                     sx={{ 
//                       minWidth: "auto",      // Overrides default 64px min-width
//                       width: "fit-content",  // Ensures it hugs the text tightly
//                       whiteSpace: "nowrap"   // Prevents text wrapping
//                     }}
//                   >
//                     Browse
//                   </Button>
//                 )}

//                 {/* Scenario 2: File Selected (Browsed) but not Saved -> SHOW UPLOAD & CANCEL */}
//                 {!item.file && item.tempFile && (
//                   <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       color="success"
//                       startIcon={<UploadFileIcon />}
//                       onClick={() => handleConfirmUpload(item.id, sectionKey)}
//                     >
//                       Upload
//                     </Button>

//                     <Button
//                       size="small"
//                       color="error"
//                       onClick={() =>  handleCancelBrowse(item.id, sectionKey)}
//                       title="Delete File"
//                       sx={{ minWidth: "auto", p: 1 }}
//                     >
//                       <DeleteIcon />
//                     </Button>
//                     {/* <Tooltip title="Cancel Selection">
//                       <IconButton size="small" color="error" onClick={() => handleCancelBrowse(item.id, sectionKey)}>
//                         <CloseIcon />
//                       </IconButton>
//                     </Tooltip> */}
//                   </Box>
//                 )}

//                 {/* Scenario 3: File Saved -> SHOW ACTIONS (View, Download, Edit, Delete) */}
//                 {item.file && (
//                   <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                     <Button
//                       size="small"
//                       color="primary"
//                       onClick={() => handleView(item.file)}
//                       title="View PDF"
//                       sx={{ minWidth: "auto", p: 1 }}
//                     >
//                       <VisibilityIcon />
//                     </Button>
//                     <Button
//                       size="small"
//                       color="success"
//                       onClick={() => handleDownload(item.file)}
//                       title="Download PDF"
//                       sx={{ minWidth: "auto", p: 1 }}
//                     >
//                       <DownloadIcon />
//                     </Button>
//                     {/* Edit button resets the row to allow browsing again */}
//                      <Button
//                       size="small"
//                       color="warning"
//                       onClick={() => triggerUpload(item.id, sectionKey)}
//                       title="Edit / Replace File"
//                       sx={{ minWidth: "auto", p: 1 }}
//                     >
//                       <EditIcon />
//                     </Button>
//                     <Button
//                       size="small"
//                       color="error"
//                       onClick={() => handleDelete(item.id, sectionKey)}
//                       title="Delete File"
//                       sx={{ minWidth: "auto", p: 1 }}
//                     >
//                       <DeleteIcon />
//                     </Button>
//                   </Box>
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </Box>
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         FABRICATION - COMPONENTS
//       </Typography>
//       <Divider sx={{ mb: 3 }} />

//       <input
//         type="file"
//         accept="application/pdf"
//         style={{ display: "none" }}
//         ref={fileInputRefA}
//         onChange={(e) => handleFileChange(e, "A")}
//       />
//       <input
//         type="file"
//         accept="application/pdf"
//         style={{ display: "none" }}
//         ref={fileInputRefB}
//         onChange={(e) => handleFileChange(e, "B")}
//       />

//       <RenderTable data={partA} sectionTitle="Part A DOCUMENTS REQUIRED FOR FIRST OF SAMPLE SUPPLY" sectionKey="A" />
//       <RenderTable data={partB} sectionTitle="Part B DOCUMENTS REQUIRED FOR BULK QUANTITY SUPPLY" sectionKey="B" />

//       {/* PDF Viewer Dialog */}
//       <Dialog fullWidth maxWidth="lg" open={dialogOpen} onClose={handleCloseDialog}>
//         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#536e99', color: 'white' }}>
//           {viewFile?.name}
//           <Button onClick={handleCloseDialog} sx={{ backgroundColor: "orange", color: "black", minWidth: '40px' }}>
//             X
//           </Button>
//         </DialogTitle>
//         <DialogContent sx={{ p: 0, height: '80vh' }}>
//           {viewFile && (
//              <iframe
//                src={viewFile.url}
//                title={viewFile.name}
//                width="100%"
//                height="100%"
//                style={{ border: "none" }}
//              />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Notes Section */}
//       <Box sx={{ mt: 5, p: 2, backgroundColor: "#f9f9f9", borderLeft: "4px solid #536e99" }}>
//         <Typography variant="subtitle1" fontWeight="bold">Notes:</Typography>
//         <Typography variant="body2">1. Raw Material Mention in FAI and Inspection Report as per Raw Material Test Report.</Typography>
//         <Typography variant="body2">2. Enclose all documents as per the above sequence order (Part A or Part B as applicable).</Typography>
//         <Typography variant="body2">3. For Additional documents Required, refer PO terms.</Typography>
//       </Box>

//     </Box>
//   );
// };

// export default FabricationComponents;

// #####################################################################################################

// import React, { useState, useRef } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   Typography,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Box,
//   Divider,
//   Paper,
//   TableContainer,
//   Chip,
//   IconButton,
//   useTheme
// } from "@mui/material";

// // Icons
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DownloadIcon from "@mui/icons-material/Download";
// import CloseIcon from "@mui/icons-material/Close";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// const FabricationComponents = () => {
//   const theme = useTheme();

//   // Helper to create row data
//   const createRow = (id, name) => ({
//     id,
//     documentName: name,
//     file: null,
//     tempFile: null
//   });

//   const [partA, setPartA] = useState([
//     createRow(1, "Certificate Of Conformity (COC)"),
//     createRow(2, "First Article Inspection"),
//     createRow(3, "Raw Material Purchased Document"),
//     createRow(4, "Raw Material Test Reports MECHANICAL and CHEMICAL (NABL Approved)"),
//     createRow(5, "Plating or special process certificate With Sample Coupon"),
//     createRow(6, "Balloon Drawing With Inspection Reports"),
//   ]);

//   const [partB, setPartB] = useState([
//     createRow(1, "Certificate Of Conformity (COC)"),
//     createRow(2, "Plating or special process certificate"),
//     createRow(3, "Balloon Drawing with Inspection Reports"),
//   ]);

//   const [viewFile, setViewFile] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   // Hidden file input references
//   const fileInputRefA = useRef(null);
//   const fileInputRefB = useRef(null);
//   const [activeUploadContext, setActiveUploadContext] = useState(null);

//   // --- Logic Handlers (Unchanged) ---
//   const handleFileChange = (event, section) => {
//     const uploadedFile = event.target.files[0];
//     if (!uploadedFile) return;

//     if (uploadedFile.type !== "application/pdf") {
//       alert("Please upload PDF files only.");
//       return;
//     }

//     const { id } = activeUploadContext;
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: uploadedFile } : item
//     );

//     updateState(updatedList);
//     event.target.value = null;
//   };

//   const handleConfirmUpload = (id, section) => {
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     const updatedList = currentState.map((item) => {
//       if (item.id === id) {
//         return { ...item, file: item.tempFile, tempFile: null };
//       }
//       return item;
//     });
//     updateState(updatedList);
//   };

//   const handleCancelBrowse = (id, section) => {
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: null } : item
//     );
//     updateState(updatedList);
//   };

//   const handleDelete = (id, section) => {
//     const confirmDelete = window.confirm("Are you sure you want to remove this PDF?");
//     if (confirmDelete) {
//       const updateState = section === "A" ? setPartA : setPartB;
//       const currentState = section === "A" ? partA : partB;

//       const updatedList = currentState.map((item) =>
//         item.id === id ? { ...item, file: null, tempFile: null } : item
//       );
//       updateState(updatedList);
//     }
//   };

//   const handleView = (file) => {
//     const fileURL = URL.createObjectURL(file);
//     setViewFile({ url: fileURL, name: file.name });
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     if (viewFile) URL.revokeObjectURL(viewFile.url);
//     setViewFile(null);
//   };

//   const handleDownload = (file) => {
//     const fileURL = URL.createObjectURL(file);
//     const link = document.createElement("a");
//     link.href = fileURL;
//     link.download = file.name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(fileURL);
//   };

//   const triggerUpload = (id, section) => {
//     setActiveUploadContext({ id, section });
//     if (section === "A") fileInputRefA.current.click();
//     else fileInputRefB.current.click();
//   };

//   const triggerBrowse = (id, section) => {
//     setActiveUploadContext({ id, section });
//     if (section === "A") fileInputRefA.current.click();
//     else fileInputRefB.current.click();
//   };

//   // --- Render Components ---

//   const RenderTable = ({ data, sectionTitle, sectionKey }) => (
//     <Box sx={{ mb: 6 }}>
//       {/* Section Header */}
//       <Box sx={{ 
//           borderLeft: `5px solid #1976d2`, 
//           bgcolor: "#f4f6f8", 
//           p: 2, 
//           mb: 2, 
//           borderRadius: "0 4px 4px 0" 
//         }}>
//         <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
//           {sectionTitle}
//         </Typography>
//       </Box>

//       {/* Table Container */}
//       <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "5%" }}>#</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "40%" }}>Requirement</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "25%" }}>File Status</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", textAlign: "center", width: "30%" }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>
//                     <Typography variant="body2" fontWeight={500} color="#333">
//                         {item.documentName}
//                     </Typography>
//                 </TableCell>
                
//                 <TableCell>
//                   {/* Status Chips */}
//                   {item.file ? (
//                     <Box>
//                         <Chip 
//                             label="Saved" 
//                             color="success" 
//                             size="small" 
//                             variant="outlined" 
//                             sx={{ fontWeight: "bold", mb: 0.5 }}
//                         />
//                         <Typography variant="caption" display="block" color="text.secondary">
//                             {item.file.name}
//                         </Typography>
//                     </Box>
//                   ) : item.tempFile ? (
//                     <Box>
//                         <Chip 
//                             label="Ready to Upload" 
//                             color="warning" 
//                             size="small" 
//                             variant="filled" 
//                             sx={{ fontWeight: "bold", color: '#fff', mb: 0.5 }}
//                         />
//                         <Typography variant="caption" display="block" color="text.secondary">
//                              {item.tempFile.name}
//                         </Typography>
//                     </Box>
//                   ) : (
//                     <Chip label="Pending" size="small" sx={{ backgroundColor: "#eceff1", color: "#78909c" }} />
//                   )}
//                 </TableCell>

//                 <TableCell sx={{ textAlign: "center" }}>
                  
//                   {/* Scenario 1: Browse */}
//                   {!item.file && !item.tempFile && (
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       startIcon={<FolderOpenIcon />}
//                       onClick={() => triggerBrowse(item.id, sectionKey)}
//                       sx={{ 
//                         minWidth: "auto",
//                         width: "fit-content",
//                         whiteSpace: "nowrap",
//                         textTransform: "none",
//                         borderColor: "#90a4ae",
//                         color: "#546e7a"
//                       }}
//                     >
//                       Browse
//                     </Button>
//                   )}

//                   {/* Scenario 2: Upload & Cancel */}
//                   {!item.file && item.tempFile && (
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         color="success"
//                         startIcon={<UploadFileIcon />}
//                         onClick={() => handleConfirmUpload(item.id, sectionKey)}
//                         sx={{ textTransform: "none", boxShadow: 0 }}
//                       >
//                         Upload
//                       </Button>

//                       <Button
//                         size="small"
//                         color="error"
//                         onClick={() => handleCancelBrowse(item.id, sectionKey)}
//                         title="Cancel"
//                         sx={{ minWidth: "auto", p: 1 }}
//                       >
//                          <CloseIcon />
//                       </Button>
//                     </Box>
//                   )}

//                   {/* Scenario 3: Actions */}
//                   {item.file && (
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                       <Button
//                         size="small"
//                         color="primary"
//                         onClick={() => handleView(item.file)}
//                         title="View PDF"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#e3f2fd" }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </Button>
//                       <Button
//                         size="small"
//                         color="success"
//                         onClick={() => handleDownload(item.file)}
//                         title="Download PDF"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#e8f5e9" }}
//                       >
//                         <DownloadIcon fontSize="small" />
//                       </Button>
//                       <Button
//                         size="small"
//                         color="warning"
//                         onClick={() => triggerUpload(item.id, sectionKey)}
//                         title="Edit / Replace File"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#fff3e0" }}
//                       >
//                         <EditIcon fontSize="small" />
//                       </Button>
//                       <Button
//                         size="small"
//                         color="error"
//                         onClick={() => handleDelete(item.id, sectionKey)}
//                         title="Delete File"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#ffebee" }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </Button>
//                     </Box>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   return (
//     <Box sx={{ p: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
//       <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e", mb: 1 }}>
//         FABRICATION COMPONENTS
//       </Typography>
//       <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 4 }}>
//         Documentation Checklist
//       </Typography>
//       <Divider sx={{ mb: 5 }} />

//       <input
//         type="file"
//         accept="application/pdf"
//         style={{ display: "none" }}
//         ref={fileInputRefA}
//         onChange={(e) => handleFileChange(e, "A")}
//       />
//       <input
//         type="file"
//         accept="application/pdf"
//         style={{ display: "none" }}
//         ref={fileInputRefB}
//         onChange={(e) => handleFileChange(e, "B")}
//       />

//       <RenderTable data={partA} sectionTitle="Part A: Documents Required for First Sample Supply" sectionKey="A" />
//       <RenderTable data={partB} sectionTitle="Part B: Documents Required for Bulk Quantity Supply" sectionKey="B" />

//       {/* PDF Viewer Dialog */}
//       <Dialog fullWidth maxWidth="lg" open={dialogOpen} onClose={handleCloseDialog}>
//         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#37474f', color: 'white' }}>
//           <Typography variant="subtitle1">{viewFile?.name}</Typography>
//           <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: 0, height: '80vh', bgcolor: "#eeeeee" }}>
//           {viewFile && (
//              <iframe
//                src={viewFile.url}
//                title={viewFile.name}
//                width="100%"
//                height="100%"
//                style={{ border: "none" }}
//              />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Notes Section - Professional Look */}
//       <Paper elevation={0} sx={{ mt: 6, p: 3, backgroundColor: "#e3f2fd", borderLeft: "6px solid #2196f3", borderRadius: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//             <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
//             <Typography variant="h6" fontWeight="bold" color="primary">Important Notes</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>1. Raw Material Mention in FAI and Inspection Report as per Raw Material Test Report.</Typography>
//         <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>2. Enclose all documents as per the above sequence order (Part A or Part B as applicable).</Typography>
//         <Typography variant="body2" sx={{ ml: 4 }}>3. For Additional documents Required, refer PO terms.</Typography>
//       </Paper>

//     </Box>
//   );
// };

// export default FabricationComponents;








// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   Typography,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Box,
//   Divider,
//   Paper,
//   TableContainer,
//   Chip,
//   IconButton,
//   useTheme
// } from "@mui/material";

// // Icons
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DownloadIcon from "@mui/icons-material/Download";
// import CloseIcon from "@mui/icons-material/Close";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// const API_BASE_URL = "http://localhost:8000/api";

// const FabricationComponents = () => {
//   const theme = useTheme();

//   // Initial Templates for Rows
//   const initialPartA = [
//     { id: 1, documentName: "Certificate Of Conformity (COC)" },
//     { id: 2, documentName: "First Article Inspection" },
//     { id: 3, documentName: "Raw Material Purchased Document" },
//     { id: 4, documentName: "Raw Material Test Reports MECHANICAL and CHEMICAL (NABL Approved)" },
//     { id: 5, documentName: "Plating or special process certificate With Sample Coupon" },
//     { id: 6, documentName: "Balloon Drawing With Inspection Reports" },
//   ];

//   const initialPartB = [
//     { id: 1, documentName: "Certificate Of Conformity (COC)" },
//     { id: 2, documentName: "Plating or special process certificate" },
//     { id: 3, documentName: "Balloon Drawing with Inspection Reports" },
//   ];

//   // State
//   const [partA, setPartA] = useState(initialPartA.map(i => ({ ...i, file: null, tempFile: null })));
//   const [partB, setPartB] = useState(initialPartB.map(i => ({ ...i, file: null, tempFile: null })));
  
//   const [viewFile, setViewFile] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [activeUploadContext, setActiveUploadContext] = useState(null);

//   // Refs
//   const fileInputRefA = useRef(null);
//   const fileInputRefB = useRef(null);

//   // --- 1. Fetch Data on Load ---
//   useEffect(() => {
//     fetchUploadedFiles();
//   }, []);

//   const fetchUploadedFiles = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/files`);
//       const dbFiles = response.data;

//       // Mapper function: Merges DB data into our UI state
//       const mapFilesToState = (initialList, sectionKey) => {
//         return initialList.map(row => {
//           // Find if there is a file in DB for this Row + Section
//           const found = dbFiles.find(f => f.section_key === sectionKey && f.row_id === row.id);
          
//           if (found) {
//             return {
//               ...row,
//               file: { 
//                 name: found.original_filename, 
//                 db_id: found.id // We need this ID for Delete/View/Download
//               },
//               tempFile: null
//             };
//           }
//           return { ...row, file: null, tempFile: null };
//         });
//       };

//       setPartA(mapFilesToState(initialPartA, "A"));
//       setPartB(mapFilesToState(initialPartB, "B"));

//     } catch (error) {
//       console.error("Error fetching files:", error);
//     }
//   };

//   // --- 2. Browsing (Select File locally) ---
//   const triggerBrowse = (id, section) => {
//     setActiveUploadContext({ id, section });
//     if (section === "A") fileInputRefA.current.click();
//     else fileInputRefB.current.click();
//   };

//   const handleFileChange = (event, section) => {
//     const uploadedFile = event.target.files[0];
//     if (!uploadedFile) return;

//     if (uploadedFile.type !== "application/pdf") {
//       alert("Please upload PDF files only.");
//       return;
//     }

//     const { id } = activeUploadContext;
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     // Update 'tempFile' state only (not sending to server yet)
//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: uploadedFile } : item
//     );

//     updateState(updatedList);
//     event.target.value = null;
//   };

//   const handleCancelBrowse = (id, section) => {
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;
//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: null } : item
//     );
//     updateState(updatedList);
//   };

//   // --- 3. Uploading (Send to Backend) ---
//   const handleConfirmUpload = async (id, section) => {
//     const currentState = section === "A" ? partA : partB;
//     const row = currentState.find(item => item.id === id);

//     if (!row.tempFile) return;

//     const formData = new FormData();
//     formData.append("section_key", section);
//     formData.append("row_id", id);
//     formData.append("document_name", row.documentName);
//     formData.append("file", row.tempFile);

//     try {
//       const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       // Update state with confirmed file from server
//       const updateState = section === "A" ? setPartA : setPartB;
//       const updatedList = currentState.map((item) => {
//         if (item.id === id) {
//           return { 
//             ...item, 
//             file: { name: response.data.original_filename, db_id: response.data.id }, 
//             tempFile: null 
//           };
//         }
//         return item;
//       });
//       updateState(updatedList);
      
//     } catch (error) {
//       console.error("Upload failed", error);
//       alert("Failed to upload file.");
//     }
//   };

//   // --- 4. Actions (Delete, View, Download) ---
//   const handleDelete = async (id, section) => {
//     if (!window.confirm("Are you sure you want to remove this PDF?")) return;

//     const currentState = section === "A" ? partA : partB;
//     const row = currentState.find(item => item.id === id);

//     if (row.file && row.file.db_id) {
//         try {
//             await axios.delete(`${API_BASE_URL}/delete/${row.file.db_id}`);
            
//             // Remove from UI
//             const updateState = section === "A" ? setPartA : setPartB;
//             const updatedList = currentState.map((item) =>
//                 item.id === id ? { ...item, file: null, tempFile: null } : item
//             );
//             updateState(updatedList);
//         } catch (error) {
//             console.error("Delete failed", error);
//             alert("Failed to delete file from server.");
//         }
//     }
//   };

//   const handleView = (fileObj) => {
//     // We use the backend URL to stream the file
//     const fileURL = `${API_BASE_URL}/view/${fileObj.db_id}`;
//     setViewFile({ url: fileURL, name: fileObj.name });
//     setDialogOpen(true);
//   };

//   const handleDownload = (fileObj) => {
//     // Trigger download by changing window location or creating a temp link
//     const downloadURL = `${API_BASE_URL}/download/${fileObj.db_id}`;
//     window.open(downloadURL, "_blank");
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setViewFile(null);
//   };

//   // --- Render Components ---

//   const RenderTable = ({ data, sectionTitle, sectionKey }) => (
//     <Box sx={{ mb: 6 }}>
//       {/* Section Header */}
//       <Box sx={{ 
//           borderLeft: `5px solid #1976d2`, 
//           bgcolor: "#f4f6f8", 
//           p: 2, 
//           mb: 2, 
//           borderRadius: "0 4px 4px 0" 
//         }}>
//         <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
//           {sectionTitle}
//         </Typography>
//       </Box>

//       {/* Table Container */}
//       <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "5%" }}>#</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "40%" }}>Requirement</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "25%" }}>File Status</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", textAlign: "center", width: "30%" }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>
//                     <Typography variant="body2" fontWeight={500} color="#333">
//                         {item.documentName}
//                     </Typography>
//                 </TableCell>
                
//                 <TableCell>
//                   {/* Status Chips */}
//                   {item.file ? (
//                     <Box>
//                         <Chip 
//                             label="Saved" 
//                             color="success" 
//                             size="small" 
//                             variant="outlined" 
//                             sx={{ fontWeight: "bold", mb: 0.5 }}
//                         />
//                         <Typography variant="caption" display="block" color="text.secondary">
//                             {item.file.name}
//                         </Typography>
//                     </Box>
//                   ) : item.tempFile ? (
//                     <Box>
//                         <Chip 
//                             label="Ready to Upload" 
//                             color="warning" 
//                             size="small" 
//                             variant="filled" 
//                             sx={{ fontWeight: "bold", color: '#fff', mb: 0.5 }}
//                         />
//                         <Typography variant="caption" display="block" color="text.secondary">
//                              {item.tempFile.name}
//                         </Typography>
//                     </Box>
//                   ) : (
//                     <Chip label="Pending" size="small" sx={{ backgroundColor: "#eceff1", color: "#78909c" }} />
//                   )}
//                 </TableCell>

//                 <TableCell sx={{ textAlign: "center" }}>
                  
//                   {/* Scenario 1: Browse (No file saved, no file pending) */}
//                   {!item.file && !item.tempFile && (
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       startIcon={<FolderOpenIcon />}
//                       onClick={() => triggerBrowse(item.id, sectionKey)}
//                       sx={{ 
//                         minWidth: "auto",
//                         width: "fit-content",
//                         whiteSpace: "nowrap",
//                         textTransform: "none",
//                         borderColor: "#90a4ae",
//                         color: "#546e7a"
//                       }}
//                     >
//                       Browse
//                     </Button>
//                   )}

//                   {/* Scenario 2: Upload & Cancel (File selected but not saved) */}
//                   {!item.file && item.tempFile && (
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         color="success"
//                         startIcon={<UploadFileIcon />}
//                         onClick={() => handleConfirmUpload(item.id, sectionKey)}
//                         sx={{ textTransform: "none", boxShadow: 0 }}
//                       >
//                         Upload
//                       </Button>

//                       <Button
//                         size="small"
//                         color="error"
//                         onClick={() => handleCancelBrowse(item.id, sectionKey)}
//                         title="Cancel"
//                         sx={{ minWidth: "auto", p: 1 }}
//                       >
//                          <CloseIcon />
//                       </Button>
//                     </Box>
//                   )}

//                   {/* Scenario 3: Actions (File Saved) */}
//                   {item.file && (
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                       <Button
//                         size="small"
//                         color="primary"
//                         onClick={() => handleView(item.file)}
//                         title="View PDF"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#e3f2fd" }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </Button>
//                       <Button
//                         size="small"
//                         color="success"
//                         onClick={() => handleDownload(item.file)}
//                         title="Download PDF"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#e8f5e9" }}
//                       >
//                         <DownloadIcon fontSize="small" />
//                       </Button>
//                       <Button
//                         size="small"
//                         color="warning"
//                         onClick={() => triggerBrowse(item.id, sectionKey)} // Re-trigger browse to replace
//                         title="Edit / Replace File"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#fff3e0" }}
//                       >
//                         <EditIcon fontSize="small" />
//                       </Button>
//                       <Button
//                         size="small"
//                         color="error"
//                         onClick={() => handleDelete(item.id, sectionKey)}
//                         title="Delete File"
//                         sx={{ minWidth: "auto", p: 1, backgroundColor: "#ffebee" }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </Button>
//                     </Box>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   return (
//     <Box sx={{ p: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
//       <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e", mb: 1 }}>
//         FABRICATION COMPONENTS
//       </Typography>
//       <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 4 }}>
//         Documentation Checklist
//       </Typography>
//       <Divider sx={{ mb: 5 }} />

//       {/* Hidden File Inputs */}
//       <input
//         type="file"
//         accept="application/pdf"
//         style={{ display: "none" }}
//         ref={fileInputRefA}
//         onChange={(e) => handleFileChange(e, "A")}
//       />
//       <input
//         type="file"
//         accept="application/pdf"
//         style={{ display: "none" }}
//         ref={fileInputRefB}
//         onChange={(e) => handleFileChange(e, "B")}
//       />

//       <RenderTable data={partA} sectionTitle="Part A: Documents Required for First Sample Supply" sectionKey="A" />
//       <RenderTable data={partB} sectionTitle="Part B: Documents Required for Bulk Quantity Supply" sectionKey="B" />

//       {/* PDF Viewer Dialog */}
//       <Dialog fullWidth maxWidth="lg" open={dialogOpen} onClose={handleCloseDialog}>
//         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#37474f', color: 'white' }}>
//           <Typography variant="subtitle1">{viewFile?.name}</Typography>
//           <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: 0, height: '80vh', bgcolor: "#eeeeee" }}>
//           {viewFile && (
//              <iframe
//                src={viewFile.url}
//                title={viewFile.name}
//                width="100%"
//                height="100%"
//                style={{ border: "none" }}
//              />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Notes Section - Professional Look */}
//       <Paper elevation={0} sx={{ mt: 6, p: 3, backgroundColor: "#e3f2fd", borderLeft: "6px solid #2196f3", borderRadius: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//             <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
//             <Typography variant="h6" fontWeight="bold" color="primary">Important Notes</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>1. Raw Material Mention in FAI and Inspection Report as per Raw Material Test Report.</Typography>
//         <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>2. Enclose all documents as per the above sequence order (Part A or Part B as applicable).</Typography>
//         <Typography variant="body2" sx={{ ml: 4 }}>3. For Additional documents Required, refer PO terms.</Typography>
//       </Paper>

//     </Box>
//   );
// };

// export default FabricationComponents;




// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   Typography,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Box,
//   Divider,
//   Paper,
//   TableContainer,
//   Chip,
//   IconButton,
//   Tooltip
// } from "@mui/material";

// // Icons
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DownloadIcon from "@mui/icons-material/Download";
// import CloseIcon from "@mui/icons-material/Close";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import HistoryIcon from "@mui/icons-material/History"; // New Icon

// const API_BASE_URL = "http://localhost:8000/api";

// const FabricationComponents = () => {

//   // Initial Data
//   const initialPartA = [
//     { id: 1, documentName: "Certificate Of Conformity (COC)" },
//     { id: 2, documentName: "First Article Inspection" },
//     { id: 3, documentName: "Raw Material Purchased Document" },
//     { id: 4, documentName: "Raw Material Test Reports MECHANICAL and CHEMICAL (NABL Approved)" },
//     { id: 5, documentName: "Plating or special process certificate With Sample Coupon" },
//     { id: 6, documentName: "Balloon Drawing With Inspection Reports" },
//   ];

//   const initialPartB = [
//     { id: 1, documentName: "Certificate Of Conformity (COC)" },
//     { id: 2, documentName: "Plating or special process certificate" },
//     { id: 3, documentName: "Balloon Drawing with Inspection Reports" },
//   ];

//   // State
//   const [partA, setPartA] = useState(initialPartA.map(i => ({ ...i, file: null, tempFile: null })));
//   const [partB, setPartB] = useState(initialPartB.map(i => ({ ...i, file: null, tempFile: null })));
  
//   const [viewFile, setViewFile] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
  
//   // History State
//   const [historyOpen, setHistoryOpen] = useState(false);
//   const [historyData, setHistoryData] = useState([]);

//   const [activeUploadContext, setActiveUploadContext] = useState(null);

//   const fileInputRefA = useRef(null);
//   const fileInputRefB = useRef(null);

//   // --- Fetch Main Files ---
//   useEffect(() => {
//     fetchUploadedFiles();
//   }, []);

//   const fetchUploadedFiles = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/files`);
//       const dbFiles = response.data;

//       const mapFilesToState = (initialList, sectionKey) => {
//         return initialList.map(row => {
//           const found = dbFiles.find(f => f.section_key === sectionKey && f.row_id === row.id);
//           if (found) {
//             return {
//               ...row,
//               file: { name: found.original_filename, db_id: found.id },
//               tempFile: null
//             };
//           }
//           return { ...row, file: null, tempFile: null };
//         });
//       };
//       setPartA(mapFilesToState(initialPartA, "A"));
//       setPartB(mapFilesToState(initialPartB, "B"));
//     } catch (error) {
//       console.error("Error fetching files:", error);
//     }
//   };

//   // --- Fetch History ---
//   const fetchHistory = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/history`);
//       setHistoryData(response.data);
//       setHistoryOpen(true);
//     } catch (error) {
//       console.error("Error fetching history:", error);
//       alert("Could not load history");
//     }
//   };

//   // --- Action Handlers ---
//   const triggerBrowse = (id, section) => {
//     setActiveUploadContext({ id, section });
//     if (section === "A") fileInputRefA.current.click();
//     else fileInputRefB.current.click();
//   };

//   const handleFileChange = (event, section) => {
//     const uploadedFile = event.target.files[0];
//     if (!uploadedFile) return;

//     if (uploadedFile.type !== "application/pdf") {
//       alert("Please upload PDF files only.");
//       return;
//     }

//     const { id } = activeUploadContext;
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;

//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: uploadedFile } : item
//     );
//     updateState(updatedList);
//     event.target.value = null;
//   };

//   const handleCancelBrowse = (id, section) => {
//     const updateState = section === "A" ? setPartA : setPartB;
//     const currentState = section === "A" ? partA : partB;
//     const updatedList = currentState.map((item) =>
//       item.id === id ? { ...item, tempFile: null } : item
//     );
//     updateState(updatedList);
//   };

//   const handleConfirmUpload = async (id, section) => {
//     const currentState = section === "A" ? partA : partB;
//     const row = currentState.find(item => item.id === id);

//     if (!row.tempFile) return;

//     const formData = new FormData();
//     formData.append("section_key", section);
//     formData.append("row_id", id);
//     formData.append("document_name", row.documentName);
//     formData.append("file", row.tempFile);

//     try {
//       const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       const updateState = section === "A" ? setPartA : setPartB;
//       const updatedList = currentState.map((item) => {
//         if (item.id === id) {
//           return { 
//             ...item, 
//             file: { name: response.data.original_filename, db_id: response.data.id }, 
//             tempFile: null 
//           };
//         }
//         return item;
//       });
//       updateState(updatedList);
      
//     } catch (error) {
//       console.error("Upload failed", error);
//       alert("Failed to upload file.");
//     }
//   };

//   const handleDelete = async (id, section) => {
//     if (!window.confirm("Are you sure you want to remove this PDF?")) return;

//     const currentState = section === "A" ? partA : partB;
//     const row = currentState.find(item => item.id === id);

//     if (row.file && row.file.db_id) {
//         try {
//             await axios.delete(`${API_BASE_URL}/delete/${row.file.db_id}`);
//             const updateState = section === "A" ? setPartA : setPartB;
//             const updatedList = currentState.map((item) =>
//                 item.id === id ? { ...item, file: null, tempFile: null } : item
//             );
//             updateState(updatedList);
//         } catch (error) {
//             console.error("Delete failed", error);
//             alert("Failed to delete file.");
//         }
//     }
//   };

//   const handleView = (fileObj) => {
//     const fileURL = `${API_BASE_URL}/view/${fileObj.db_id}`;
//     setViewFile({ url: fileURL, name: fileObj.name });
//     setDialogOpen(true);
//   };

//   const handleDownload = (fileObj) => {
//     const downloadURL = `${API_BASE_URL}/download/${fileObj.db_id}`;
//     window.open(downloadURL, "_blank");
//   };

//   // --- UI Sub-Components ---

//   const RenderTable = ({ data, sectionTitle, sectionKey }) => (
//     <Box sx={{ mb: 6 }}>
//       <Box sx={{ 
//           borderLeft: `5px solid #1976d2`, 
//           bgcolor: "#f4f6f8", 
//           p: 2, 
//           mb: 2, 
//           borderRadius: "0 4px 4px 0" 
//         }}>
//         <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
//           {sectionTitle}
//         </Typography>
//       </Box>

//       <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "5%" }}>#</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "40%" }}>Requirement</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "25%" }}>File Status</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: "#546e7a", textAlign: "center", width: "30%" }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>
//                     <Typography variant="body2" fontWeight={500} color="#333">
//                         {item.documentName}
//                     </Typography>
//                 </TableCell>
//                 <TableCell>
//                   {item.file ? (
//                     <Box>
//                         <Chip label="Saved" color="success" size="small" variant="outlined" sx={{ fontWeight: "bold", mb: 0.5 }}/>
//                         <Typography variant="caption" display="block" color="text.secondary">{item.file.name}</Typography>
//                     </Box>
//                   ) : item.tempFile ? (
//                     <Box>
//                         <Chip label="Ready to Upload" color="warning" size="small" variant="filled" sx={{ fontWeight: "bold", color: '#fff', mb: 0.5 }}/>
//                         <Typography variant="caption" display="block" color="text.secondary">{item.tempFile.name}</Typography>
//                     </Box>
//                   ) : (
//                     <Chip label="Pending" size="small" sx={{ backgroundColor: "#eceff1", color: "#78909c" }} />
//                   )}
//                 </TableCell>

//                 <TableCell sx={{ textAlign: "center" }}>
//                   {!item.file && !item.tempFile && (
//                     <Button
//                       variant="outlined" size="small" startIcon={<FolderOpenIcon />}
//                       onClick={() => triggerBrowse(item.id, sectionKey)}
//                       sx={{ minWidth: "auto", width: "fit-content", whiteSpace: "nowrap", textTransform: "none", borderColor: "#90a4ae", color: "#546e7a" }}
//                     >
//                       Browse
//                     </Button>
//                   )}
//                   {!item.file && item.tempFile && (
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                       <Button variant="contained" size="small" color="success" startIcon={<UploadFileIcon />} onClick={() => handleConfirmUpload(item.id, sectionKey)} sx={{ textTransform: "none", boxShadow: 0 }}>Upload</Button>
//                       <Button size="small" color="error" onClick={() => handleCancelBrowse(item.id, sectionKey)} title="Cancel" sx={{ minWidth: "auto", p: 1 }}><CloseIcon /></Button>
//                     </Box>
//                   )}
//                   {item.file && (
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//                       <Button size="small" color="primary" onClick={() => handleView(item.file)} title="View PDF" sx={{ minWidth: "auto", p: 1, backgroundColor: "#e3f2fd" }}><VisibilityIcon fontSize="small" /></Button>
//                       <Button size="small" color="success" onClick={() => handleDownload(item.file)} title="Download PDF" sx={{ minWidth: "auto", p: 1, backgroundColor: "#e8f5e9" }}><DownloadIcon fontSize="small" /></Button>
//                       <Button size="small" color="warning" onClick={() => triggerBrowse(item.id, sectionKey)} title="Edit / Replace File" sx={{ minWidth: "auto", p: 1, backgroundColor: "#fff3e0" }}><EditIcon fontSize="small" /></Button>
//                       <Button size="small" color="error" onClick={() => handleDelete(item.id, sectionKey)} title="Delete File" sx={{ minWidth: "auto", p: 1, backgroundColor: "#ffebee" }}><DeleteIcon fontSize="small" /></Button>
//                     </Box>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   return (
//     <Box sx={{ p: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
      
//       {/* Header with History Button */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//         <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e" }}>
//           FABRICATION COMPONENTS
//         </Typography>
//         <Button 
//           variant="outlined" 
//           startIcon={<HistoryIcon />} 
//           onClick={fetchHistory}
//           sx={{ color: "#1a237e", borderColor: "#1a237e" }}
//         >
//           View Log
//         </Button>
//       </Box>

//       <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 4 }}>
//         Documentation Checklist
//       </Typography>
//       <Divider sx={{ mb: 5 }} />

//       <input type="file" accept="application/pdf" style={{ display: "none" }} ref={fileInputRefA} onChange={(e) => handleFileChange(e, "A")} />
//       <input type="file" accept="application/pdf" style={{ display: "none" }} ref={fileInputRefB} onChange={(e) => handleFileChange(e, "B")} />

//       <RenderTable data={partA} sectionTitle="Part A: Documents Required for First Sample Supply" sectionKey="A" />
//       <RenderTable data={partB} sectionTitle="Part B: Documents Required for Bulk Quantity Supply" sectionKey="B" />

//       {/* PDF Viewer Dialog */}
//       <Dialog fullWidth maxWidth="lg" open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#37474f', color: 'white' }}>
//           <Typography variant="subtitle1">{viewFile?.name}</Typography>
//           <IconButton onClick={() => setDialogOpen(false)} sx={{ color: "white" }}><CloseIcon /></IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: 0, height: '80vh', bgcolor: "#eeeeee" }}>
//           {viewFile && <iframe src={viewFile.url} title={viewFile.name} width="100%" height="100%" style={{ border: "none" }} />}
//         </DialogContent>
//       </Dialog>

//       {/* HISTORY DIALOG */}
//       <Dialog fullWidth maxWidth="md" open={historyOpen} onClose={() => setHistoryOpen(false)}>
//         <DialogTitle sx={{ backgroundColor: '#1a237e', color: 'white' }}>
//           Activity History
//         </DialogTitle>
//         <DialogContent dividers>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>Time</strong></TableCell>
//                   <TableCell><strong>Action</strong></TableCell>
//                   <TableCell><strong>Document Requirement</strong></TableCell>
//                   <TableCell><strong>File Name</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {historyData.map((log) => (
//                   <TableRow key={log.id}>
//                     <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={log.action_type} 
//                         size="small" 
//                         color={log.action_type === "DELETE" ? "error" : log.action_type === "REPLACE" ? "warning" : "success"} 
//                         variant="outlined" 
//                         sx={{fontWeight: 'bold'}}
//                       />
//                     </TableCell>
//                     <TableCell>{log.document_name}</TableCell>
//                     <TableCell>{log.file_name}</TableCell>
//                   </TableRow>
//                 ))}
//                 {historyData.length === 0 && (
//                   <TableRow><TableCell colSpan={4} align="center">No history found.</TableCell></TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </DialogContent>
//       </Dialog>

//       <Paper elevation={0} sx={{ mt: 6, p: 3, backgroundColor: "#e3f2fd", borderLeft: "6px solid #2196f3", borderRadius: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//             <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
//             <Typography variant="h6" fontWeight="bold" color="primary">Important Notes</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>1. Raw Material Mention in FAI and Inspection Report as per Raw Material Test Report.</Typography>
//         <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>2. Enclose all documents as per the above sequence order (Part A or Part B as applicable).</Typography>
//         <Typography variant="body2" sx={{ ml: 4 }}>3. For Additional documents Required, refer PO terms.</Typography>
//       </Paper>

//     </Box>
//   );
// };

// export default FabricationComponents;



import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Divider,
  Paper,
  TableContainer,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";

// Icons
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HistoryIcon from "@mui/icons-material/History"; // New Icon

const API_BASE_URL = "http://localhost:8000/api";

const FabricationComponents = () => {

  // Initial Data
  const initialPartA = [
    { id: 1, documentName: "Certificate Of Conformity (COC)" },
    { id: 2, documentName: "First Article Inspection" },
    { id: 3, documentName: "Raw Material Purchased Document" },
    { id: 4, documentName: "Raw Material Test Reports MECHANICAL and CHEMICAL (NABL Approved)" },
    { id: 5, documentName: "Plating or special process certificate With Sample Coupon" },
    { id: 6, documentName: "Balloon Drawing With Inspection Reports" },
  ];

  const initialPartB = [
    { id: 1, documentName: "Certificate Of Conformity (COC)" },
    { id: 2, documentName: "Plating or special process certificate" },
    { id: 3, documentName: "Balloon Drawing with Inspection Reports" },
  ];

  // State
  const [partA, setPartA] = useState(initialPartA.map(i => ({ ...i, file: null, tempFile: null })));
  const [partB, setPartB] = useState(initialPartB.map(i => ({ ...i, file: null, tempFile: null })));
  
  const [viewFile, setViewFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const [activeUploadContext, setActiveUploadContext] = useState(null);

  const fileInputRefA = useRef(null);
  const fileInputRefB = useRef(null);

  // --- Fetch Main Files ---
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      const dbFiles = response.data;

      const mapFilesToState = (initialList, sectionKey) => {
        return initialList.map(row => {
          const found = dbFiles.find(f => f.section_key === sectionKey && f.row_id === row.id);
          if (found) {
            return {
              ...row,
              file: { name: found.original_filename, db_id: found.id },
              tempFile: null
            };
          }
          return { ...row, file: null, tempFile: null };
        });
      };
      setPartA(mapFilesToState(initialPartA, "A"));
      setPartB(mapFilesToState(initialPartB, "B"));
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // --- Fetch History ---
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      setHistoryData(response.data);
      setHistoryOpen(true);
    } catch (error) {
      console.error("Error fetching history:", error);
      alert("Could not load history");
    }
  };

  // --- Action Handlers ---
  const triggerBrowse = (id, section) => {
    setActiveUploadContext({ id, section });
    // Small timeout ensures state updates before click
    setTimeout(() => {
        if (section === "A") fileInputRefA.current.click();
        else fileInputRefB.current.click();
    }, 50);
  };

  const handleFileChange = (event, section) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      alert("Please upload PDF files only.");
      return;
    }

    const { id } = activeUploadContext;
    const updateState = section === "A" ? setPartA : setPartB;
    const currentState = section === "A" ? partA : partB;

    const updatedList = currentState.map((item) =>
      item.id === id ? { ...item, tempFile: uploadedFile } : item
    );
    updateState(updatedList);
    event.target.value = null;
  };

  const handleCancelBrowse = (id, section) => {
    const updateState = section === "A" ? setPartA : setPartB;
    const currentState = section === "A" ? partA : partB;
    const updatedList = currentState.map((item) =>
      item.id === id ? { ...item, tempFile: null } : item
    );
    updateState(updatedList);
  };

  const handleConfirmUpload = async (id, section) => {
    const currentState = section === "A" ? partA : partB;
    const row = currentState.find(item => item.id === id);

    if (!row.tempFile) return;

    const formData = new FormData();
    formData.append("section_key", section);
    formData.append("row_id", id);
    formData.append("document_name", row.documentName);
    formData.append("file", row.tempFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updateState = section === "A" ? setPartA : setPartB;
      const updatedList = currentState.map((item) => {
        if (item.id === id) {
          return { 
            ...item, 
            file: { name: response.data.original_filename, db_id: response.data.id }, 
            tempFile: null 
          };
        }
        return item;
      });
      updateState(updatedList);
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file.");
    }
  };

  const handleDelete = async (id, section) => {
    if (!window.confirm("Are you sure you want to remove this PDF?")) return;

    const currentState = section === "A" ? partA : partB;
    const row = currentState.find(item => item.id === id);

    if (row.file && row.file.db_id) {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${row.file.db_id}`);
            const updateState = section === "A" ? setPartA : setPartB;
            const updatedList = currentState.map((item) =>
                item.id === id ? { ...item, file: null, tempFile: null } : item
            );
            updateState(updatedList);
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete file.");
        }
    }
  };

  const handleView = (fileObj) => {
    if (!fileObj || !fileObj.db_id) {
        alert("File information missing. Please refresh.");
        return;
    }
    const fileURL = `${API_BASE_URL}/view/${fileObj.db_id}`;
    setViewFile({ url: fileURL, name: fileObj.name });
    setDialogOpen(true);
  };

  const handleDownload = (fileObj) => {
    const downloadURL = `${API_BASE_URL}/download/${fileObj.db_id}`;
    window.open(downloadURL, "_blank");
  };

  // --- UI Sub-Components ---

  const RenderTable = ({ data, sectionTitle, sectionKey }) => (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ 
          borderLeft: `5px solid #1976d2`, 
          bgcolor: "#f4f6f8", 
          p: 2, 
          mb: 2, 
          borderRadius: "0 4px 4px 0" 
        }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
          {sectionTitle}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "5%" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "40%" }}>Requirement</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#546e7a", width: "25%" }}>File Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#546e7a", textAlign: "center", width: "30%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight={500} color="#333">
                        {item.documentName}
                    </Typography>
                </TableCell>
                <TableCell>
                  {item.file ? (
                    <Box>
                        <Chip label="Saved" color="success" size="small" variant="outlined" sx={{ fontWeight: "bold", mb: 0.5 }}/>
                        <Typography variant="caption" display="block" color="text.secondary">{item.file.name}</Typography>
                        {item.tempFile && (
                             <Typography variant="caption" display="block" color="warning.main" fontWeight="bold">
                                New: {item.tempFile.name}
                             </Typography>
                        )}
                    </Box>
                  ) : item.tempFile ? (
                    <Box>
                        <Chip label="Ready to Upload" color="warning" size="small" variant="filled" sx={{ fontWeight: "bold", color: '#fff', mb: 0.5 }}/>
                        <Typography variant="caption" display="block" color="text.secondary">{item.tempFile.name}</Typography>
                    </Box>
                  ) : (
                    <Chip label="Pending" size="small" sx={{ backgroundColor: "#eceff1", color: "#78909c" }} />
                  )}
                </TableCell>

                <TableCell sx={{ textAlign: "center" }}>
                    
                  {/* --- LOGIC FIX START --- */}
                  
                  {item.tempFile ? (
                    // Priority 1: Temp File Exists (Fresh Upload OR Replacement)
                    // Show "Save" and "Cancel" buttons immediately
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Button variant="contained" size="small" color="success" startIcon={<UploadFileIcon />} onClick={() => handleConfirmUpload(item.id, sectionKey)} sx={{ textTransform: "none", boxShadow: 0 }}>Save</Button>
                      <Button size="small" color="error" onClick={() => handleCancelBrowse(item.id, sectionKey)} title="Cancel" sx={{ minWidth: "auto", p: 1 }}><CloseIcon /></Button>
                    </Box>

                  ) : item.file ? (
                    // Priority 2: File is Saved (No temp file pending)
                    // Show Action Buttons
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Button size="small" color="primary" onClick={() => handleView(item.file)} title="View PDF" sx={{ minWidth: "auto", p: 1, backgroundColor: "#e3f2fd" }}><VisibilityIcon fontSize="small" /></Button>
                      <Button size="small" color="success" onClick={() => handleDownload(item.file)} title="Download PDF" sx={{ minWidth: "auto", p: 1, backgroundColor: "#e8f5e9" }}><DownloadIcon fontSize="small" /></Button>
                      <Button size="small" color="warning" onClick={() => triggerBrowse(item.id, sectionKey)} title="Edit / Replace File" sx={{ minWidth: "auto", p: 1, backgroundColor: "#fff3e0" }}><EditIcon fontSize="small" /></Button>
                      <Button size="small" color="error" onClick={() => handleDelete(item.id, sectionKey)} title="Delete File" sx={{ minWidth: "auto", p: 1, backgroundColor: "#ffebee" }}><DeleteIcon fontSize="small" /></Button>
                    </Box>

                  ) : (
                    // Priority 3: Nothing uploaded or selected
                    // Show Browse Button
                    <Button
                      variant="outlined" size="small" startIcon={<FolderOpenIcon />}
                      onClick={() => triggerBrowse(item.id, sectionKey)}
                      sx={{ minWidth: "auto", width: "fit-content", whiteSpace: "nowrap", textTransform: "none", borderColor: "#90a4ae", color: "#546e7a" }}
                    >
                      Browse
                    </Button>
                  )}
                  
                  {/* --- LOGIC FIX END --- */}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
      
      {/* Header with History Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e" }}>
          FABRICATION COMPONENTS
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<HistoryIcon />} 
          onClick={fetchHistory}
          sx={{ color: "#1a237e", borderColor: "#1a237e" }}
        >
          View Log
        </Button>
      </Box>

      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 4 }}>
        Documentation Checklist
      </Typography>
      <Divider sx={{ mb: 5 }} />

      <input type="file" accept="application/pdf" style={{ display: "none" }} ref={fileInputRefA} onChange={(e) => handleFileChange(e, "A")} />
      <input type="file" accept="application/pdf" style={{ display: "none" }} ref={fileInputRefB} onChange={(e) => handleFileChange(e, "B")} />

      <RenderTable data={partA} sectionTitle="Part A: Documents Required for First Sample Supply" sectionKey="A" />
      <RenderTable data={partB} sectionTitle="Part B: Documents Required for Bulk Quantity Supply" sectionKey="B" />

      {/* PDF Viewer Dialog */}
      <Dialog fullWidth maxWidth="lg" open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#37474f', color: 'white' }}>
          <Typography variant="subtitle1">{viewFile?.name}</Typography>
          <IconButton onClick={() => setDialogOpen(false)} sx={{ color: "white" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '80vh', bgcolor: "#eeeeee" }}>
          {viewFile && <iframe src={viewFile.url} title={viewFile.name} width="100%" height="100%" style={{ border: "none" }} />}
        </DialogContent>
      </Dialog>

      {/* HISTORY DIALOG */}
      <Dialog fullWidth maxWidth="md" open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <DialogTitle sx={{ backgroundColor: '#1a237e', color: 'white' }}>
          Activity History
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                  <TableCell><strong>Document Requirement</strong></TableCell>
                  <TableCell><strong>File Name</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyData.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={log.action_type} 
                        size="small" 
                        color={log.action_type === "DELETE" ? "error" : log.action_type === "REPLACE" ? "warning" : "success"} 
                        variant="outlined" 
                        sx={{fontWeight: 'bold'}}
                      />
                    </TableCell>
                    <TableCell>{log.document_name}</TableCell>
                    <TableCell>{log.file_name}</TableCell>
                  </TableRow>
                ))}
                {historyData.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center">No history found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Paper elevation={0} sx={{ mt: 6, p: 3, backgroundColor: "#e3f2fd", borderLeft: "6px solid #2196f3", borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">Important Notes</Typography>
        </Box>
        <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>1. Raw Material Mention in FAI and Inspection Report as per Raw Material Test Report.</Typography>
        <Typography variant="body2" sx={{ ml: 4, mb: 0.5 }}>2. Enclose all documents as per the above sequence order (Part A or Part B as applicable).</Typography>
        <Typography variant="body2" sx={{ ml: 4 }}>3. For Additional documents Required, refer PO terms.</Typography>
      </Paper>

    </Box>
  );
};

export default FabricationComponents;