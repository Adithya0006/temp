//Flow Assignment card

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container
} from "@mui/material";

// Icons
import TableViewIcon from '@mui/icons-material/TableView';
import HomeIcon from '@mui/icons-material/Home';
import axios from "axios";
import { useSelector } from "react-redux";

// 1. DUMMY DATA (Replace this with API response later)
const DUMMY_DATA = [
  { id: 101, projectName: "Alpha Protocol", manager: "Alice Smith", status: "Active", budget: "$12,000", deadline: "2025-10-15" },
  { id: 102, projectName: "Beta Build", manager: "Bob Jones", status: "Pending", budget: "$5,000", deadline: "2025-11-01" },
  { id: 103, projectName: "Gamma Test", manager: "Charlie Day", status: "Completed", budget: "$8,500", deadline: "2025-09-20" },
  { id: 104, projectName: "Delta Deployment", manager: "Diana Prince", status: "Active", budget: "$22,000", deadline: "2025-12-10" },
  { id: 105, projectName: "Epsilon Analytics", manager: "Ethan Hunt", status: "Rejected", budget: "$0", deadline: "2025-08-05" },
];

// Define columns for the table header
const COLUMNS = ["ID", "PCB Operation Id", "Pcb Process Name", "Assigned To", "Assigned To Name", "Assigned To Name Initial", "Assigned To Name MRL", "Assigned To Name MRL Expiry"];

export default function FlowAssigment() {

  // State to store API data
  const [tableData, setTableData] = useState([]);

  // State for loading/error handling (Optional but recommended)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // State for Tab switching
  const [currentTab, setCurrentTab] = useState("view"); // Default to 'view' or 'home'


  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
  var API1 = "/getdefflow"

  var fetchDefaultFlowPCB = "http://192.168.0.20:8082" + API1

  if (configDetails != undefined) {

    if (configDetails.project[0].ServerIP != undefined) {

      


      if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

        fetchDefaultFlowPCB = configDetails.project[0].ServerIP[0].NodeServerIP + API1
      }


    }

  }




  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };



  useEffect(() => {
    // Only fetch if we are on the 'view' tab to save bandwidth
    if (currentTab === "view") {
      setLoading(true);

      // Replace with your actual API URL
      axios.get(fetchDefaultFlowPCB)
        .then((response) => {
          // Assuming your API returns an array or an object containing the array
          // Adjust 'response.data.PcbData' based on your actual API structure
          const data = response.data.PcbData || response.data || [];
          setTableData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("Failed to load data");
          setLoading(false);
        });
    }
  }, [currentTab]); // specific dependency ensures it runs when tab changes

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>

        {/* TABS HEADER */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            centered
          >
            {/* <Tab icon={<HomeIcon />} iconPosition="start" label="Home" value="home" /> */}
            <Tab icon={<TableViewIcon />} iconPosition="start" label="View Data" value="view" />
          </Tabs>
        </Box>

        {/* TAB PANEL 1: HOME (Just placeholder content) */}
        {/* {currentTab === "home" && (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <Typography variant="h5" color="text.secondary">
              Welcome to the Dashboard
            </Typography>
            <Typography variant="body1">
              Click the <b>"View Data"</b> tab to see the table.
            </Typography>
          </Box>
        )} */}

        {/* TAB PANEL 2: VIEW DATA TABLE */}
        {currentTab === "view" && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Project Details
            </Typography>

            <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">

                {/* Table Head */}
                <TableHead>
                  <TableRow>
                    {COLUMNS.map((col) => (
                      <TableCell
                        key={col}
                        sx={{ fontWeight: "bold", bgcolor: "#eeeeee" }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
                  ) : tableData.length > 0 ? (
                    tableData.map((row) => (
                      <TableRow hover key={row.id || row.id}> {/* Use unique key from DB */}
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.pcbOperationId}</TableCell>
                        <TableCell>{row.pcbProcessName}</TableCell>
                        {/* Map other fields based on your API keys */}
                        <TableCell>{row.assignedTo}</TableCell>
                        <TableCell>{row.assignedToName}</TableCell>
                        <TableCell>{row.assignedToNameInitial}</TableCell>
                        <TableCell>{row.assignedToNameMRL}</TableCell>
                        <TableCell>{row.assignedToNameMRLExpiry}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={6} align="center">No Data Found</TableCell></TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
          </Box>
        )}

      </Paper>
    </Container>
  );
}