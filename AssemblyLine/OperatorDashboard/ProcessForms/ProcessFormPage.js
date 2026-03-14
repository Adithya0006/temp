// import { Container, CircularProgress, Button, Backdrop, Typography, Box } from "@mui/material";
// import useProcessForm from "./useProcessForm";
// import ProcessForm from "./ProcessForm";
// import { saveProcessRecord, checkForLocalFile,fetchLastLog } from "./api"; 
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useSelector } from "react-redux";
// import { useState } from "react";

// export default function ProcessFormPage({ 
//   pcbSerial, stageId, assignmentId, FilteredData, actionType, 
//   onClose, onSaveComplete, initialLogData 
// }) {
  
//   let user = JSON.parse(localStorage.getItem("user"));
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
//   const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);
//   const [isSaving, setIsSaving] = useState(false);
//   const handleFetchLastData = async () => {
//     try {
//       console.log("sfdfhdjbdgiadcdbc")
//       const data = await fetchLastLog(user?.id, stageId, configDetails);
//       return data?.log_Data || null;
//     } catch (error) {
//       console.error("Error fetching last log:", error);
//       return null;
//     }
//   };
//   if (loading) return <CircularProgress />;

//   const createPayload = (targetSerial, targetItem, formValues, statusToSubmit,startTime) => ({
//     PCBserialNoPartNumber: targetItem.PCBserialNoPartNumber,
//     current_step_id: targetItem.currentStepId,
//     assignment_id: targetItem.assignmentid,
//     Task_Status: statusToSubmit === "Started" ? "Started" : "Completed",
//     Task_Name: form.stage_name,
//     operator_staff_no: user?.id,
//     log_Data: formValues,
//     userID: user?.id,
//     userRole: user?.userRole,
//     userName: user?.username,
//     userSBU: user?.sbu,
//     userSBUDiv: user?.subdivision,
//     start_time: startTime || new Date().toISOString(), // Use existing start time or now
//     end_time: new Date().toISOString(),
//   });

//   const handleSave = async (formValues, statusToSubmit, batchSerials = []) => {
//     setIsSaving(true);
//     try {
//       // 1. Save Main
//       await saveProcessRecord(createPayload(pcbSerial, FilteredData.find(i => i.serialNo === pcbSerial), formValues, statusToSubmit), configDetails);

//       // 2. Batch Logic with Blocking
//       for (const serial of batchSerials) {
//         const localFile = await checkForLocalFile(serial);
//         const hasFileField = form.fields.some(f => f.type === "file");
        
//         // CRITICAL: Prevent next stage if file is required but missing in folder
//         if (hasFileField && !localFile.found && statusToSubmit === "Completed") {
//           throw new Error(`PCB ${serial} cannot move to next stage: File not found in local folder.`);
//         }

//         let batchValues = { ...formValues };
//         if (localFile.found) {
//             const fileField = form.fields.find(f => f.type === "file");
//             if (fileField) batchValues[fileField.key] = localFile.fileName;
//         }

//         await saveProcessRecord(createPayload(serial, FilteredData.find(i => i.serialNo === serial), batchValues, statusToSubmit), configDetails);
//       }

//       onSaveComplete ? onSaveComplete(pcbSerial, stageId) : window.location.reload();
//     } catch (error) {
//       alert(error.message);
//     } finally { setIsSaving(false); }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 3 }}>
//       <Backdrop open={isSaving} sx={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
//         <CircularProgress color="inherit" />
//         <Typography variant="h6" mt={2}>Processing PCBs...</Typography>
//       </Backdrop>
//       <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ mb: 2 }}>Back</Button>
//       <ProcessForm
//         form={form}
//         currentSerial={pcbSerial}
//         savedData={initialLogData ? { operator_Json_log: initialLogData } : null}
//         onSubmit={handleSave}
//         onFetchLastData={handleFetchLastData} 
//         FilteredData={FilteredData}
//         actionType={actionType}
//       />
//     </Container>
//   );
// }





































// import { Container, CircularProgress, Button, Backdrop, Typography, Box } from "@mui/material";
// import useProcessForm from "./useProcessForm";
// import ProcessForm from "./ProcessForm";
// import { saveProcessRecord, checkForLocalFile, fetchLastLog, fetchLogBySerial } from "./api"; 
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function ProcessFormPage({ 
//   pcbSerial, stageId, assignmentId, FilteredData, actionType, 
//   onClose, onSaveComplete, initialLogData 
// }) {
  
//   let user = JSON.parse(localStorage.getItem("user"));
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);





//   const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);

//   //console.log("formformform from ProcessFormPage",form?.stage_name)



//   const [isSaving, setIsSaving] = useState(false);

//   const [equi_conumDet,setequi_conumDet]=useState(null)
//   // const [consumDet,setConsumDet]=useState(null)
//   // --- Dynamic API Configuration ---
//   var EQUPAPI = "/getequipment_consumables";
//   // var API1="/operatordashboard"
//   // var fetchOperatorApi = "http://172.195.121.91:2000" + API;
//   var eq_com="http://172.195.121.91:2000" + EQUPAPI;

//   if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
//     eq_com = configDetails.project[0].ServerIP[0].PythonServerIP + EQUPAPI;
//     // opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
//   }


//  useEffect(() => {
//       const tempcall = async (activeStepId) => {
//         const t1 = parseInt(activeStepId);
//         // console.log("called tempcall: ", t1, typeof(t1));
  
//         try {
//           const data = await axios.get(eq_com, { params: { stageid: stageId } });
//            // Log the actual data
//           // Handle the data here, e.g., update state
//           setequi_conumDet(data?.data)
//           // global_equi_conumDet()
//           // console.log("data from my api: ", equi_conumDet);
//         } catch (e) {
//           // console.error("Error fetching data:", e); // More informative error logging
//         }
//       };
  
//       if (stageId !== undefined) { // Important: Check if stageid is defined
//         tempcall(stageId);
//       }
//       else{
//         console.warn("Stage ID is undefined.  Skipping API call.");
//       }
  
//     }, [stageId]);

//   // --- CHANGED: Fixed Paste Last Log Logic ---
//   const handleFetchLastData = async () => {
//     try {
//       // API call returns an Axios response object
//       const response = await fetchLastLog(user?.id, stageId, configDetails);
      
//       // We must access response.data to get the actual backend payload
//       // Assuming backend returns { log_Data: { ... } }
//       if (response.data && response.data.log_Data) {
//           return response.data.log_Data;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error fetching last log:", error);
//       return null;
//     }
//   };

//   // --- NEW: Handle Fetching Data by Serial Number ---
//   const handleFetchDataBySerial = async (targetSerial) => {
//     try {
//       const response = await fetchLogBySerial(targetSerial, stageId, configDetails);
      
//       // Check response structure (adjust based on your specific backend return)
//       if (response.data && response.data.log_Data) {
//         // console.log("response of last: ",response.data);
//           return response.data.log_Data;
//       } else if (response.data) {
//           // Fallback if log_Data isn't nested
//           return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error fetching serial log:", error);
//       alert("Failed to fetch data for that Serial Number.");
//       return null;
//     }
//   };

//   if (loading) return <CircularProgress />;

//   const createPayload = (targetSerial, targetItem, formValues, statusToSubmit, startTime) => (Object.assign(formValues,equi_conumDet),
//   // console.log("form vlues after: ",formValues)
//   {
//     PCBserialNoPartNumber: targetItem.PCBserialNoPartNumber,
//     current_step_id: targetItem.currentStepId,
//     assignment_id: targetItem.assignmentid,
//     Task_Status: statusToSubmit === "Started" ? "Started" : "Completed",
//     Task_Name: form.stage_name,
//     operator_staff_no: user?.id,
//     log_Data: formValues,
//     userID: user?.id,
//     userRole: user?.userRole,
//     userName: user?.username,
//     userSBU: user?.sbu,
//     userSBUDiv: user?.subdivision,
//     start_time: startTime || new Date().toISOString(), // Use existing start time or now
//     end_time: new Date().toISOString(),
//   });

//  const handleSave = async (formValues, statusToSubmit, batchSerials = []) => {

//   setIsSaving(true);

//   try {

//     // STEP 1 — Upload manual files
//     for (const key in formValues) {

//       if (formValues[key]?.file) {

//         const formData = new FormData();
//         formData.append("pcb_serial", pcbSerial);
//         formData.append("stage_id", stageId);
//         formData.append("file", formValues[key].file);

//         await axios.post(
//           `${configDetails.project[0].ServerIP[0].PythonServerIP}/operator/upload_manual_file`,
//           formData
//         );

//         formValues[key] = formValues[key].file.name;
//       }
//     }

//     // STEP 2 — Save process log
//     await saveProcessRecord(
//       createPayload(
//         pcbSerial,
//         FilteredData.find(i => i.serialNo === pcbSerial),
//         formValues,
//         statusToSubmit
//       ),
//       configDetails
//     );

//     onSaveComplete ? onSaveComplete(pcbSerial, stageId) : window.location.reload();

//   } catch (error) {
//     alert(error.message);
//   }

//   finally {
//     setIsSaving(false);
//   }
// };

//   return (
//     <Container maxWidth="md" sx={{ mt: 3, background:"rgba(215, 249, 248, 0.1)" }}>
//       <Backdrop open={isSaving} sx={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
//         <CircularProgress color="inherit" />
//         <Typography variant="h6" mt={2}>Processing PCBs...</Typography>
//       </Backdrop>


//       {/* <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ mb: 2 }}>Back Button</Button> */}
// {/* <Button
//   variant="outlined"
//   startIcon={<ArrowBackIcon />}
//   onClick={onClose}
//   sx={{
//     background: 'linear-gradient(145deg, #2ebcdc)', // Gradient background
//     color: '#fff', // White text for better contrast
//     fontWeight: 'bold', // Bold text
//     padding: '4px 10px', // Reduced padding for smaller button size (1/4th of original size)
//     fontSize: '0.9rem', // Smaller font size
//     borderRadius: '30px', // Rounded corners for the button
//     textTransform: 'none',
//     textAlign:"center",
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
//     width: '100px', // Button width adjusts to content
//     '&:hover': {
//       background: 'linear-gradient(145deg, #0d63a0)', // Reverse gradient on hover
//       boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
//     },
//     '&:disabled': {
//       background: '#d6d6d6', // Disabled button background
//       boxShadow: 'none',
//       color: '#b0b0b0', // Disabled text color
//     },
//     display: 'flex',
//     alignItems: 'center', // Ensures the icon and text are properly aligned
//     justifyContent: 'flex-start', // Align the button to the left side
//   }}
// >
//   Back
// </Button> */}

//     { form!=null && (



//         <ProcessForm
//         form={form}
//         currentSerial={pcbSerial}
//         savedData={initialLogData ? { operator_Json_log: initialLogData } : null}
//         onSubmit={handleSave}
//         onFetchLastData={handleFetchLastData}
//         onFetchDataBySerial={handleFetchDataBySerial} // Pass the new function
//         FilteredData={FilteredData}
//         actionType={actionType}
//         />
     


//     )}
//        </Container>

//   );
// }




import { Container, CircularProgress, Button, Backdrop, Typography, Box } from "@mui/material";
import useProcessForm from "./useProcessForm";
import ProcessForm from "./ProcessForm";
import { saveProcessRecord, checkForLocalFile, fetchLastLog, fetchLogBySerial } from "./api"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProcessFormPage({ 
  pcbSerial, stageId, assignmentId, FilteredData, actionType, 
  onClose, onSaveComplete, initialLogData 
}) {
  
  let user = JSON.parse(localStorage.getItem("user"));
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);





  const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);

  //console.log("formformform from ProcessFormPage",form?.stage_name)



  const [isSaving, setIsSaving] = useState(false);

  const [equi_conumDet,setequi_conumDet]=useState(null)
  // const [consumDet,setConsumDet]=useState(null)
  // --- Dynamic API Configuration ---
  var EQUPAPI = "/getequipment_consumables";
  // var API1="/operatordashboard"
  // var fetchOperatorApi = "http://172.195.121.91:2000" + API;
  var eq_com="http://172.195.121.91:2000" + EQUPAPI;

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    eq_com = configDetails.project[0].ServerIP[0].PythonServerIP + EQUPAPI;
    // opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
  }


 useEffect(() => {
      const tempcall = async (activeStepId) => {
        const t1 = parseInt(activeStepId);
        // console.log("called tempcall: ", t1, typeof(t1));
  
        try {
          const data = await axios.get(eq_com, { params: { stageid: stageId } });
           // Log the actual data
          // Handle the data here, e.g., update state
          setequi_conumDet(data?.data)
          // global_equi_conumDet()
          // console.log("data from my api: ", equi_conumDet);
        } catch (e) {
          // console.error("Error fetching data:", e); // More informative error logging
        }
      };
  
      if (stageId !== undefined) { // Important: Check if stageid is defined
        tempcall(stageId);
      }
      else{
        console.warn("Stage ID is undefined.  Skipping API call.");
      }
  
    }, [stageId]);

  // --- CHANGED: Fixed Paste Last Log Logic ---
  const handleFetchLastData = async () => {
    try {
      // API call returns an Axios response object
      const response = await fetchLastLog(user?.id, stageId, configDetails);
      
      // We must access response.data to get the actual backend payload
      // Assuming backend returns { log_Data: { ... } }
      if (response.data && response.data.log_Data) {
          return response.data.log_Data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching last log:", error);
      return null;
    }
  };

  // --- NEW: Handle Fetching Data by Serial Number ---
  const handleFetchDataBySerial = async (targetSerial) => {
    try {
      const response = await fetchLogBySerial(targetSerial, stageId, configDetails);
      
      // Check response structure (adjust based on your specific backend return)
      if (response.data && response.data.log_Data) {
        // console.log("response of last: ",response.data);
          return response.data.log_Data;
      } else if (response.data) {
          // Fallback if log_Data isn't nested
          return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching serial log:", error);
      alert("Failed to fetch data for that Serial Number.");
      return null;
    }
  };

  if (loading) return <CircularProgress />;

  const createPayload = (targetSerial, targetItem, formValues, statusToSubmit, startTime) => (Object.assign(formValues,equi_conumDet),
  // console.log("form vlues after: ",formValues)
  {
    PCBserialNoPartNumber: targetItem.PCBserialNoPartNumber,
    current_step_id: targetItem.currentStepId,
    assignment_id: targetItem.assignmentid,
    Task_Status: statusToSubmit === "Started" ? "Started" : "Completed",
    Task_Name: form.stage_name,
    operator_staff_no: user?.id,
    file_name: formValues.file_name || null,
file_path: formValues.file_path || null,
file_url: formValues.file_url || null,
    log_Data: formValues,
    userID: user?.id,
    userRole: user?.userRole,
    userName: user?.username,
    userSBU: user?.sbu,
    userSBUDiv: user?.subdivision,
    start_time: startTime || new Date().toISOString(), // Use existing start time or now
    end_time: new Date().toISOString(),
  });

const handleSave = async (formValues, statusToSubmit, batchSerials = []) => {

  setIsSaving(true);

  try {

    // STEP 1 — Upload files
    for (const key in formValues) {

  if (formValues[key]?.file) {

    const formData = new FormData();
    formData.append("pcb_serial", pcbSerial);
    formData.append("stage_id", stageId);
    formData.append("file", formValues[key].file);

    await axios.post(
      `${configDetails.project[0].ServerIP[0].PythonServerIP}/operator/upload_manual_file`,
      formData
    );

    const fileName = formValues[key]?.file?.name;

    formValues[key] = fileName;

    formValues.file_name = fileName;
    formValues.file_path = `uploads/stage_${stageId}/${fileName}`;
    formValues.file_url = `/uploads/stage_${stageId}/${fileName}`;
  }
}

    // STEP 2 — Save main PCB
    await saveProcessRecord(
      createPayload(
        pcbSerial,
        FilteredData.find(i => i.serialNo === pcbSerial),
        formValues,
        statusToSubmit
      ),
      configDetails
    );

    // STEP 3 — Save batch PCBs
    batchSerials = batchSerials.filter(s => s !== pcbSerial);

    for (const serial of batchSerials) {

      const batchValues = { ...formValues };

      await saveProcessRecord(
        createPayload(
          serial,
          FilteredData.find(i => i.serialNo === serial),
          batchValues,
          statusToSubmit
        ),
        configDetails
      );
    }

    onSaveComplete ? onSaveComplete(pcbSerial, stageId) : window.location.reload();

  } catch (error) {
    alert(error.message);
  }

  finally {
    setIsSaving(false);
  }
};

  return (
    <Container maxWidth="md" sx={{ mt: 3, background:"rgba(215, 249, 248, 0.1)" }}>
      <Backdrop open={isSaving} sx={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" mt={2}>Processing PCBs...</Typography>
      </Backdrop>


      {/* <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ mb: 2 }}>Back Button</Button> */}
{/* <Button
  variant="outlined"
  startIcon={<ArrowBackIcon />}
  onClick={onClose}
  sx={{
    background: 'linear-gradient(145deg, #2ebcdc)', // Gradient background
    color: '#fff', // White text for better contrast
    fontWeight: 'bold', // Bold text
    padding: '4px 10px', // Reduced padding for smaller button size (1/4th of original size)
    fontSize: '0.9rem', // Smaller font size
    borderRadius: '30px', // Rounded corners for the button
    textTransform: 'none',
    textAlign:"center",
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
    width: '100px', // Button width adjusts to content
    '&:hover': {
      background: 'linear-gradient(145deg, #0d63a0)', // Reverse gradient on hover
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
    },
    '&:disabled': {
      background: '#d6d6d6', // Disabled button background
      boxShadow: 'none',
      color: '#b0b0b0', // Disabled text color
    },
    display: 'flex',
    alignItems: 'center', // Ensures the icon and text are properly aligned
    justifyContent: 'flex-start', // Align the button to the left side
  }}
>
  Back
</Button> */}

    { form!=null && (



        <ProcessForm
        form={form}
        currentSerial={pcbSerial}
        savedData={initialLogData ? { operator_Json_log: initialLogData } : null}
        onSubmit={handleSave}
        onFetchLastData={handleFetchLastData}
        onFetchDataBySerial={handleFetchDataBySerial} // Pass the new function
        FilteredData={FilteredData}
        actionType={actionType}
        />
     


    )}
       </Container>

  );
}

