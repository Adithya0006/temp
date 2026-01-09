// import axios from 'axios';

// const API = axios.create({
//   baseURL: '/',   // backend compatible
//   timeout: 5000,
// });



// // Define the URL
// const STATUS_API_URL1 = "http://192.168.0.20:2000/operator/view"; 

// export const fetchProcessRecord = async () => {
//   // 1. Get the user from local storage inside the function (to ensure it's fresh)
//   let user = JSON.parse(localStorage.getItem("user"));

//   // 2. Pass the params object correctly
//   const res = await API.get(`${STATUS_API_URL1}`, {
//     params: {
//       staff_no: user?.id  // <--- This generates: ?staff_no=226
      
//     }
//   });
//   console.log("1111111111111 ",res.data );
  
//   return res.data;
// };


// const STATUS_API_URL = "http://127.0.0.1:2000/operator/updatestatus"; 
// // save (create / update)
// export const saveProcessRecord = async (payload) => {
//   console.log("saved process data: ",payload,typeof(payload.start_time));
//   return API.post(`${STATUS_API_URL}`, payload);
// };

// // fetch form structure (optional backend support)
// export const fetchFormTemplate = async (stageId) => {
//   const res = await API.get(`/process-forms/${stageId}`);
//   return res.data;
// };

// import { useSelector } from "react-redux";
// import React from "react";
// import { useState } from "react";
// import axios from "axios";
// export  function DynamicApi(configDetails){
//   // const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
//   var APIURL="http://192.168.0.20:2000";
//   if (configDetails != undefined) {

//     if (configDetails.project[0].ServerIP != undefined) {

//       if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {

//         APIURL = configDetails.project[0].ServerIP[0].PythonServerIP;

//       }
//     }
//   }
//   console.log("my try: ",APIURL)
//  return APIURL
// }


// export const saveProcessRecord = async (payload,configDetails) => {
//   // console.log("my try: ",configDetails)
//   const STATUS_API_URL = DynamicApi(configDetails); 
//   // console.log("saved process data: ",payload,typeof(payload.start_time));
  
//   return axios.post(`${STATUS_API_URL}/operator/updatestatus`, payload);
// };



// export const fetchProcessRecord = async (pcbSerial, stageId,configDetails) => {
//   // 1. Get the user from local storage inside the function (to ensure it's fresh)
//   let user = JSON.parse(localStorage.getItem("user"));
//   const STATUS_API_URL = DynamicApi(configDetails);
//   // 2. Pass the params object correctly
//   const res = await axios.get(`${STATUS_API_URL}/operator/view`, {
//     params: {
//       staff_no: user?.id  // <--- This generates: ?staff_no=226
//     }
//   });
//   // console.log("1111111111111 ",res.data );
  
//   return res.data;
// };


// export const fetchFormTemplate = async (stageId,configDetails) => {
//     const res = await axios.get(`/process-forms/${stageId}`);
//     return res.data;
//   };















import { useSelector } from "react-redux";
import React from "react";
import { useState } from "react";
import axios from "axios";

export function DynamicApi(configDetails){
  // const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  var APIURL="http://192.168.0.20:2000";
  if (configDetails != undefined) {

    if (configDetails.project[0].ServerIP != undefined) {

      if (configDetails.project[0].ServerIP[0].PythonServerIP != undefined) {

        APIURL = configDetails.project[0].ServerIP[0].PythonServerIP;

      }
    }
  }
  console.log("my try: ",APIURL)
 return APIURL
}


export const saveProcessRecord = async (payload,configDetails) => {
  // console.log("my try: ",configDetails)
  const STATUS_API_URL = DynamicApi(configDetails); 
  // console.log("saved process data: ",payload,typeof(payload.start_time));
  
  return axios.post(`${STATUS_API_URL}/operator/updatestatus`, payload);
};



export const fetchProcessRecord = async (pcbSerial, stageId,configDetails) => {
  // 1. Get the user from local storage inside the function (to ensure it's fresh)
  let user = JSON.parse(localStorage.getItem("user"));
  const STATUS_API_URL = DynamicApi(configDetails);
  // 2. Pass the params object correctly
  const res = await axios.get(`${STATUS_API_URL}/operator/view`, {
    params: {
      staff_no: user?.id  // <--- This generates: ?staff_no=226
    }
  });
  // console.log("1111111111111 ",res.data );
  
  return res.data;
};


export const fetchFormTemplate = async (stageId,configDetails) => {
    const res = await axios.get(`/process-forms/${stageId}`);
    return res.data;
};

// --- NEW FUNCTION: FETCH LAST LOG FROM DB ---
export const fetchLastLog = async (staffNo, stageId, configDetails) => {
  const STATUS_API_URL = DynamicApi(configDetails);
  const res = await axios.get(`${STATUS_API_URL}/operator/last-log`, {
    params: {
      staff_no: staffNo,
      stage_id: stageId
    }
  });
  return res.data;
};


export const fetchLogBySerial = async (targetSerial, stageId, configDetails) => {
  const STATUS_API_URL = DynamicApi(configDetails);
  const res = await axios.get(`${STATUS_API_URL}/operator/log-by-serial`, {
    params: {
      target_serial: targetSerial,
      stage_id: stageId
    }
  });
  return res.data;
};