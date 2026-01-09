

// import { Container, CircularProgress, Button } from "@mui/material";
// import useProcessForm from "./useProcessForm";
// import ProcessForm from "./ProcessForm";
// import { saveProcessRecord } from "./api";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useSelector } from "react-redux";

// export default function ProcessFormPage({ 
//   pcbSerial, 
//   stageId, 
//   assignmentId, 
//   FilteredData, 
//   actionType, 
//   onClose,
//   onSaveComplete,
//   initialLogData // <--- CRITICAL: Data passed from OperatorPage (Database Row)
// }) {
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
//   // Safety check for FilteredData
//   const formFilteredData = (FilteredData || []).filter(item => item.serialNo == pcbSerial);
  
//   // This hook handles the API fetching from backend endpoints if they exist
//   const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);

//   if (loading) return <CircularProgress />;
//   if (!form) return <p>No Form Template Found</p>;
  
//   let user = JSON.parse(localStorage.getItem("user"));

//   const handleSave = async (formValues, statusToSubmit) => {
//     console.log("STATUS TO SUB: " ,statusToSubmit)
//     // Safety check if filter found nothing
//     const currentItem = formFilteredData[0] || {};

//     const payload = {
//       PCBserialNoPartNumber: formFilteredData[0].PCBserialNoPartNumber,
//       current_step_id: formFilteredData[0].currentStepId,
//       assignment_id: formFilteredData[0].assignmentid,
//       Task_Status: statusToSubmit === "Started" ? "Started" : "Completed",
//       Task_Name: form.stage_name,
//       operator_staff_no: user?.id,
//       log_Data: formValues,
//       userID: user?.id,
//       userRole: user?.userRole,
//       userName: user?.username,
//       userSBU: user?.sbu,
//       userSBUDiv: user?.subdivision,
//       start_time: savedData?.start_datetime || new Date().toISOString(),
//       end_time: new Date().toISOString(),
//     };

//     console.log(`===== SAVING (${statusToSubmit}) =====`, payload);
//     // console.log("my try: ",configDetails)
//     await saveProcessRecord(payload,configDetails);
//     console.log("")
    
//     // --- CRITICAL: Reload page on Complete ---
//     if (statusToSubmit === "Completed") {
//       window.location.reload(); 
//       return; 
//     }
    
//     // For "Start", just notify parent to refresh table
//     if (onSaveComplete) {
//       onSaveComplete(); 
//     } else if (onClose) {
//       onClose();
//     }
//   };

//   // --- CRITICAL: Merge logic for autofill ---
//   // 1. savedData = Data from useProcessForm hook (API)
//   // 2. initialLogData = Data from OperatorPage (View API / Database)
//   // const effectiveSavedData = savedData || (initialLogData ? { operator_Json_log: initialLogData } : null);
//    const effectiveSavedData = initialLogData  ? { operator_Json_log: initialLogData } : null;
//    console.log("initialLogData",initialLogData)
  
//   console.log("effectiveSavedData",effectiveSavedData)

//   return (
//     <Container maxWidth="md" sx={{ mt: 3 }}>
      
//       <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ mb: 2 }}>
//         Back to List
//       </Button>

//       <ProcessForm
//         form={form}
//         savedData={effectiveSavedData} // <--- Pass the merged data
//         onSubmit={handleSave}
//         FilteredData={FilteredData}
//         actionType={actionType} 
//       />
      
//     </Container>
//   );
// }















import { Container, CircularProgress, Button } from "@mui/material";
import useProcessForm from "./useProcessForm";
import ProcessForm from "./ProcessForm";
import { saveProcessRecord, fetchLastLog, fetchLogBySerial } from "./api"; // Added fetchLogBySerial import
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from "react-redux";

export default function ProcessFormPage({ 
  pcbSerial, 
  stageId, 
  assignmentId, 
  FilteredData, 
  actionType, 
  onClose,
  onSaveComplete,
  initialLogData 
}) {
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
  // Safety check for FilteredData
  const formFilteredData = (FilteredData || []).filter(item => item.serialNo == pcbSerial);
  
  // This hook handles the API fetching from backend endpoints if they exist
  const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);

  if (loading) return <CircularProgress />;
  if (!form) return <p>No Form Template Found</p>;
  
  let user = JSON.parse(localStorage.getItem("user"));

  const handleSave = async (formValues, statusToSubmit) => {
    console.log("STATUS TO SUB: " ,statusToSubmit)
    // Safety check if filter found nothing
    const currentItem = formFilteredData[0] || {};

    const payload = {
      PCBserialNoPartNumber: formFilteredData[0].PCBserialNoPartNumber,
      current_step_id: formFilteredData[0].currentStepId,
      assignment_id: formFilteredData[0].assignmentid,
      Task_Status: statusToSubmit === "Started" ? "Started" : "Completed",
      Task_Name: form.stage_name,
      operator_staff_no: user?.id,
      log_Data: formValues,
      userID: user?.id,
      userRole: user?.userRole,
      userName: user?.username,
      userSBU: user?.sbu,
      userSBUDiv: user?.subdivision,
      start_time: savedData?.start_datetime || new Date().toISOString(),
      end_time: new Date().toISOString(),
    };

    console.log(`===== SAVING (${statusToSubmit}) =====`, payload);
    // console.log("my try: ",configDetails)
    await saveProcessRecord(payload,configDetails);
    console.log("")
    
    // --- CRITICAL: Reload page on Complete ---
    if (statusToSubmit === "Completed") {
      if (onSaveComplete) {
         onSaveComplete(pcbSerial, stageId); 
      } else {
         window.location.reload(); 
      }
      return; 
    }
    
    // For "Start", just notify parent to refresh table
    if (onSaveComplete) {
      onSaveComplete(); 
    } else if (onClose) {
      onClose();
    }
  };

  // --- Handler to fetch last log from DB (Paste Last) ---
  const handleFetchLastData = async () => {
    try {
      const data = await fetchLastLog(user?.id, stageId, configDetails);
      return data?.log_Data || null;
    } catch (error) {
      console.error("Error fetching last log:", error);
      return null;
    }
  };

  // --- NEW: Handler to fetch by Serial Number (Search) ---
  const handleFetchDataBySerial = async (targetSerial) => {
    try {
      const data = await fetchLogBySerial(targetSerial, stageId, configDetails);
      return data?.log_Data || null;
    } catch (error) {
      console.error("Error fetching serial log:", error);
      return null;
    }
  };

  // --- CRITICAL: Merge logic for autofill ---
  // 1. savedData = Data from useProcessForm hook (API)
  // 2. initialLogData = Data from OperatorPage (View API / Database)
  // const effectiveSavedData = savedData || (initialLogData ? { operator_Json_log: initialLogData } : null);
   const effectiveSavedData = initialLogData  ? { operator_Json_log: initialLogData } : null;
   console.log("initialLogData",initialLogData)
  
  console.log("effectiveSavedData",effectiveSavedData)

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      
      <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ mb: 2 }}>
        Back to List
      </Button>

      <ProcessForm
        form={form}
        savedData={effectiveSavedData} // <--- Pass the merged data
        onSubmit={handleSave}
        FilteredData={FilteredData}
        actionType={actionType}
        onFetchLastData={handleFetchLastData} // <--- Pass the DB Fetch Handler (Last)
        onFetchDataBySerial={handleFetchDataBySerial} // <--- Pass the DB Search Handler (Serial)
      />
      
    </Container>
  );
}