import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import OperatorAnalyticsDashboard from "../OperatorDashboard/OperatorAnalyticsDashboard";
import { Typography } from "antd";

const OperatorAnalysis = ({
  apiBaseUrl,
  user,
  label = "Select Operator Staff Number",
  onSelectApi,
  valueKey = "id",
  labelKey = "name",
  sx = {},
  fullWidth = true,
}) => {
  
  const [options, setOptions] = useState([]); // Initialize as an empty array
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  var API = "/operatorlistanalysis";
  var API1="/operatordashboard"
  var opelist = "http://172.195.121.91:8000" + API;
  var opedashboard =  "http://172.195.121.91:8000" + API1;

  if (configDetails !== undefined) {
    if (configDetails.project?.[0]?.ServerIP?.[0]?.PythonServerIP !== undefined) {
      apiBaseUrl = configDetails.project[0].ServerIP[0].PythonServerIP + API;
      opedashboard = configDetails.project[0].ServerIP[0].PythonServerIP + API1;
      // console.log("apiBaseUrl: ", apiBaseUrl);
    }
  }

  // 🔹 Fetch dropdown values from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(apiBaseUrl); // Use apiBaseUrl directly
        setOptions(res?.data);
      } catch (err) {
        // console.error("Error fetching dropdown data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiBaseUrl]); // Dependency is apiBaseUrl.  Re-fetch if it changes.

  // 🔹 When user selects option
  const handleChange = async (event) => {
    const value = event.target.value;
    setSelected(value);

    try {
      const response = await axios.get(
        opedashboard,
        { params: { staff_no: value } }
      );
      setAnalyticsData(response.data);
    } catch (err) {
      // console.error("Analytics fetch error:", err);
    }
  };

  // Fetch initial data when the component mounts
  useEffect(() => {
    if (options.length > 0) { //Only request data when options is available
      const initialValue = "E169";
      setSelected(initialValue); // Set the initial selected value.
      handleChange({ target: { value: initialValue } }); //Trigger the same step of selected
    }
  }, [options]); // Dependency array: Run when options become available

  return (
    <>
      <FormControl  sx={{ width: 200, ...sx }}>
        <InputLabel>{label}</InputLabel>
        <Select 
          value={selected}
          label={label}
          onChange={handleChange}
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            options.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {analyticsData ? (
        <OperatorAnalyticsDashboard  data={analyticsData} />
      ) : (
        <Typography variant="h6" color="text.secondary">
          Loading Insights...
        </Typography>
      )}
    </>
  );
};

export default OperatorAnalysis;