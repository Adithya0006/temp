import axios from "axios";
export var LOCAL_WATCHER_URL = "http://192.168.0.20:2000";
export function DynamicApi(configDetails){
  var APIURL="http://192.168.0.20:2000";

  if (configDetails) {
    if (configDetails.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
        APIURL = configDetails.project[0].ServerIP[0].PythonServerIP;
        LOCAL_WATCHER_URL = configDetails.project[0].ServerIP[0].NodeServerIP;
    }
  }
  return APIURL;
}

     

// Local Watcher helpers
// api.js

export const checkForLocalFile = async (machineId, serial) => {
    console.log("Checking for Machine:", machineId, "Serial:", serial);
    if (!machineId || !serial) return { found: false }; 

    try {
        // Updated to include both machineId and serial in the path
        const res = await axios.get(`${LOCAL_WATCHER_URL}/check-file/${machineId}/${serial}`);
        return res.data;
    } catch (err) { 
        console.error("Local file check error:", err);
        return { found: false }; 
    }
};

export const checkBatchFilesLocal = async (machineId, serials) => {
    if (!machineId || !serials) return {};
    try {
        // Updated to include machineId in the path
        const res = await axios.post(`${LOCAL_WATCHER_URL}/check-batch-files/${machineId}`, { serials });
        return res.data;
    } catch (err) { return {}; }
};

// Existing API calls
export const saveProcessRecord = async (payload,configDetails) => {
  // console.log("my try: ",configDetails)
  const STATUS_API_URL = DynamicApi(configDetails);  
  // console.log("saved process data: ",payload,typeof(payload.start_time));
  
  return axios.post(`${STATUS_API_URL}/operator/updatestatus`, payload);
};

export const fetchProcessRecord = async (pcbSerial, stageId, configDetails) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const STATUS_API_URL = DynamicApi(configDetails);
  return axios.get(`${STATUS_API_URL}/operator/view`, { params: { staff_no: user?.id } });
};

export const fetchFormTemplate = async (stageId, configDetails) => {
    return axios.get(`/process-forms/${stageId}`);
};

export const fetchLastLog = async (staffNo, stageId, configDetails) => {
  // console.log("am insdie!")
  const STATUS_API_URL = DynamicApi(configDetails);
  // console.log("STATUS_API_URL: ",staffNo, stageId)
  return axios.get(`${STATUS_API_URL}/operator/last-log`, { params: { staff_no: staffNo, stage_id: stageId } });
};

export const fetchLogBySerial = async (targetSerial, stageId, configDetails) => {
  const STATUS_API_URL = DynamicApi(configDetails);
  return axios.get(`${STATUS_API_URL}/operator/log-by-serial`, { params: { target_serial: targetSerial, stage_id: stageId } });
};
