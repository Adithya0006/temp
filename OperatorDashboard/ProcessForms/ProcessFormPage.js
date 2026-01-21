

// // import { Container, CircularProgress, Button } from "@mui/material";
// // import useProcessForm from "./useProcessForm";
// // import ProcessForm from "./ProcessForm";
// // import { saveProcessRecord } from "./api";
// // import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// // import { useSelector } from "react-redux";

// // export default function ProcessFormPage({ 
// //   pcbSerial, 
// //   stageId, 
// //   assignmentId, 
// //   FilteredData, 
// //   actionType, 
// //   onClose,
// //   onSaveComplete,
// //   initialLogData // <--- CRITICAL: Data passed from OperatorPage (Database Row)
// // }) {
// //   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
// //   // Safety check for FilteredData
// //   const formFilteredData = (FilteredData || []).filter(item => item.serialNo == pcbSerial);
  
// //   // This hook handles the API fetching from backend endpoints if they exist
// //   const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);

// //   if (loading) return <CircularProgress />;
// //   if (!form) return <p>No Form Template Found</p>;
  
// //   let user = JSON.parse(localStorage.getItem("user"));

// //   const handleSave = async (formValues, statusToSubmit) => {
// //     console.log("STATUS TO SUB: " ,statusToSubmit)
// //     // Safety check if filter found nothing
// //     const currentItem = formFilteredData[0] || {};

// //     const payload = {
// //       PCBserialNoPartNumber: formFilteredData[0].PCBserialNoPartNumber,
// //       current_step_id: formFilteredData[0].currentStepId,
// //       assignment_id: formFilteredData[0].assignmentid,
// //       Task_Status: statusToSubmit === "Started" ? "Started" : "Completed",
// //       Task_Name: form.stage_name,
// //       operator_staff_no: user?.id,
// //       log_Data: formValues,
// //       userID: user?.id,
// //       userRole: user?.userRole,
// //       userName: user?.username,
// //       userSBU: user?.sbu,
// //       userSBUDiv: user?.subdivision,
// //       start_time: savedData?.start_datetime || new Date().toISOString(),
// //       end_time: new Date().toISOString(),
// //     };

// //     console.log(`===== SAVING (${statusToSubmit}) =====`, payload);
// //     // console.log("my try: ",configDetails)
// //     await saveProcessRecord(payload,configDetails);
// //     console.log("")
    
// //     // --- CRITICAL: Reload page on Complete ---
// //     if (statusToSubmit === "Completed") {
// //       window.location.reload(); 
// //       return; 
// //     }
    
// //     // For "Start", just notify parent to refresh table
// //     if (onSaveComplete) {
// //       onSaveComplete(); 
// //     } else if (onClose) {
// //       onClose();
// //     }
// //   };

// //   // --- CRITICAL: Merge logic for autofill ---
// //   // 1. savedData = Data from useProcessForm hook (API)
// //   // 2. initialLogData = Data from OperatorPage (View API / Database)
// //   // const effectiveSavedData = savedData || (initialLogData ? { operator_Json_log: initialLogData } : null);
// //    const effectiveSavedData = initialLogData  ? { operator_Json_log: initialLogData } : null;
// //    console.log("initialLogData",initialLogData)
  
// //   console.log("effectiveSavedData",effectiveSavedData)

// //   return (
// //     <Container maxWidth="md" sx={{ mt: 3 }}>
      
// //       <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ mb: 2 }}>
// //         Back to List
// //       </Button>

// //       <ProcessForm
// //         form={form}
// //         savedData={effectiveSavedData} // <--- Pass the merged data
// //         onSubmit={handleSave}
// //         FilteredData={FilteredData}
// //         actionType={actionType} 
// //       />
      
// //     </Container>
// //   );
// // }















// import { Container, CircularProgress, Button } from "@mui/material";
// import useProcessForm from "./useProcessForm";
// import ProcessForm from "./ProcessForm";
// import { saveProcessRecord, fetchLastLog, fetchLogBySerial } from "./api"; // Added fetchLogBySerial import
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
//   initialLogData 
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
//       if (onSaveComplete) {
//          onSaveComplete(pcbSerial, stageId); 
//       } else {
//          window.location.reload(); 
//       }
//       return; 
//     }
    
//     // For "Start", just notify parent to refresh table
//     if (onSaveComplete) {
//       onSaveComplete(); 
//     } else if (onClose) {
//       onClose();
//     }
//   };

//   // --- Handler to fetch last log from DB (Paste Last) ---
//   const handleFetchLastData = async () => {
//     try {
//       const data = await fetchLastLog(user?.id, stageId, configDetails);
//       return data?.log_Data || null;
//     } catch (error) {
//       console.error("Error fetching last log:", error);
//       return null;
//     }
//   };

//   // --- NEW: Handler to fetch by Serial Number (Search) ---
//   const handleFetchDataBySerial = async (targetSerial) => {
//     try {
//       const data = await fetchLogBySerial(targetSerial, stageId, configDetails);
//       return data?.log_Data || null;
//     } catch (error) {
//       console.error("Error fetching serial log:", error);
//       return null;
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
//         onFetchLastData={handleFetchLastData} // <--- Pass the DB Fetch Handler (Last)
//         onFetchDataBySerial={handleFetchDataBySerial} // <--- Pass the DB Search Handler (Serial)
//       />
      
//     </Container>
//   );
// }

































import { Container, CircularProgress, Button, Backdrop, Typography, Box } from "@mui/material";
import useProcessForm from "./useProcessForm";
import ProcessForm from "./ProcessForm";
import { saveProcessRecord, fetchLastLog, fetchLogBySerial } from "./api"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from "react-redux";
import { useState } from "react";

/**
 * Component: ProcessFormPage
 * Description: Wrapper page that manages the API connections and data flow for the Form.
 * Features:
 * - Fetches Form Configuration via useProcessForm hook.
 * - Handles "Save" and "Complete" actions.
 * - Orchestrates BATCH SAVING for multiple PCBs.
 * - Handles DB Fetching (Last Log / Search by Serial).
 */
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
  // --- Redux Config ---
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
  
  // Safety check: Filter data for the CURRENT PCB
  const formFilteredData = (FilteredData || []).filter(item => item.serialNo == pcbSerial);
  
  // --- Hooks ---
  // Fetches the form template and existing data for the current serial
  const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);
  
  // Local Loading State for Saving Action (needed for batch processing)
  const [isSaving, setIsSaving] = useState(false);

  // --- Early Returns ---
  if (loading) return <CircularProgress />;
  if (!form) return <p>No Form Template Found</p>;
  
  let user = JSON.parse(localStorage.getItem("user"));

  // --- Helper: Create Payload ---
  // Generates the JSON object required by the API for a specific PCB
  const createPayload = (targetSerial, targetItem, formValues, statusToSubmit, startTime) => ({
    PCBserialNoPartNumber: targetItem.PCBserialNoPartNumber,
    current_step_id: targetItem.currentStepId,
    assignment_id: targetItem.assignmentid,
    Task_Status: statusToSubmit === "Started" ? "Started" : "Completed",
    Task_Name: form.stage_name,
    operator_staff_no: user?.id,
    log_Data: formValues,
    userID: user?.id,
    userRole: user?.userRole,
    userName: user?.username,
    userSBU: user?.sbu,
    userSBUDiv: user?.subdivision,
    start_time: startTime || new Date().toISOString(), // Use existing start time or now
    end_time: new Date().toISOString(),
  });

  // --- Main Save Handler ---
  // Called by ProcessForm.js. Handles Single + Batch saving.
  const handleSave = async (formValues, statusToSubmit, batchSerials = []) => {
    setIsSaving(true);
    console.log(`===== SAVING MAIN (${statusToSubmit}) =====`, pcbSerial);

    try {
      // 1. Save the MAIN PCB (The one currently open)
      const mainItem = formFilteredData[0] || {};
      const mainStartTime = savedData?.start_datetime || new Date().toISOString();
      const mainPayload = createPayload(pcbSerial, mainItem, formValues, statusToSubmit, mainStartTime);
      
      await saveProcessRecord(mainPayload, configDetails);

      // 2. Process Batch PCBs (if any selected)
      if (batchSerials && batchSerials.length > 0) {
        console.log("Processing Batch:", batchSerials);
        
        // Loop through selected serials
        for (const serial of batchSerials) {
          // Find the specific data object for this serial from FilteredData list
          const targetItem = FilteredData.find(item => item.serialNo === serial);
          
          if (targetItem) {
            // For batch items, we use current time as start time if they haven't started yet
            const batchPayload = createPayload(serial, targetItem, formValues, statusToSubmit, null);
            console.log(` -> Batch Saving: ${serial}`);
            await saveProcessRecord(batchPayload, configDetails);
            
            // Optional: Notify parent for each item if granular updates needed
            if (onSaveComplete && statusToSubmit === "Completed") {
              // We call onSaveComplete for other items to update UI, but mainly we do a full refresh at end
            }
          }
        }
      }

      // 3. Post-Save Actions
      console.log("All saves completed.");
      
      if (statusToSubmit === "Completed") {
        // If passed a handler, call it (Optimistic update in Parent)
        if (onSaveComplete) {
           // We pass the main serial. The parent might need to refresh all to see batch changes.
           onSaveComplete(pcbSerial, stageId); 
        } else {
           // Fallback reload
           window.location.reload(); 
        }
        return; 
      }
      
      // For "Start" action
      if (onSaveComplete) {
        onSaveComplete(); 
      } else if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error("Error saving process:", error);
      alert("Error saving data. Please check console.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DB Helper: Fetch Last Log ---
  const handleFetchLastData = async () => {
    try {
      const data = await fetchLastLog(user?.id, stageId, configDetails);
      return data?.log_Data || null;
    } catch (error) {
      console.error("Error fetching last log:", error);
      return null;
    }
  };

  // --- DB Helper: Fetch Log By Serial ---
  const handleFetchDataBySerial = async (targetSerial) => {
    try {
      const data = await fetchLogBySerial(targetSerial, stageId, configDetails);
      return data?.log_Data || null;
    } catch (error) {
      console.error("Error fetching serial log:", error);
      return null;
    }
  };

  // --- Data Merging Logic ---
  // Prioritize initial data passed from parent, then fallback to API data
  const effectiveSavedData = initialLogData  ? { operator_Json_log: initialLogData } : null;

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      
      {/* --- Loading Overlay (Visible during Batch Save) --- */}
      <Backdrop open={isSaving} sx={{ color: '#fff', zIndex: 9999, flexDirection: 'column' }}>
        <CircularProgress color="inherit" />
        <Box mt={2}><Typography variant="h6">Saving Data...</Typography></Box>
        <Typography variant="caption">Please wait while we update records.</Typography>
      </Backdrop>

      <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ mb: 2 }}>
        Back to List
      </Button>

      {/* --- Form Component --- */}
      <ProcessForm
        form={form}
        currentSerial={pcbSerial} // Passed to exclude self from batch list
        savedData={effectiveSavedData} 
        onSubmit={handleSave}
        FilteredData={FilteredData} // Passed to find other PCBs
        actionType={actionType}
        onFetchLastData={handleFetchLastData} 
        onFetchDataBySerial={handleFetchDataBySerial} 
      />
      
    </Container>
  );
}