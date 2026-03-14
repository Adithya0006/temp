// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { fetchFormTemplate, fetchProcessRecord } from "./api";
// import { LOCAL_FORM_CONFIGS } from "./formConfigs";

// export default function useProcessForm(pcbSerial, stageId) {

//   const [form, setForm] = useState(null);
//   const [savedData, setSavedData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       setForm(LOCAL_FORM_CONFIGS[stageId] || null);
//       console.log("STAGE ID: ",stageId)
      

//       // Attempt data fetch
//       try {
//         const record = await fetchProcessRecord(pcbSerial, stageId,configDetails);
//         // console.log("record in use form: ",record)
//         setSavedData(record);
//       } catch {
//         setSavedData(null);
//       }

//       setLoading(false);
//     }

//     load();
//   }, [pcbSerial, stageId]);

//   return { form, savedData, loading };
// }













// File: useProcessForm.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchProcessRecord } from "./api"; //
import { LOCAL_FORM_CONFIGS } from "./formConfigs"; //
import { LOCAL_WATCHER_URL } from "./api";
export default function useProcessForm(pcbSerial, stageId) {
  const [form, setForm] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({});

  // --- NEW STATES FOR FILE HANDLING ---
  const [file, setFile] = useState(null); // Real File object for the endpoint
  const [previewUrl, setPreviewUrl] = useState(null); // URL for the iframe preview
  
  // Logic: Complete is enabled and Save is disabled if a file is present
  const isFileReady = !!file || !!previewUrl;

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);

  // --- CONVERT AUTO-GENERATED FILE TO REAL FILE OBJECT ---
  // const syncAutoFile = async (machineId, filename) => {
  //   try {
  //     // Fetch binary data from Node.js watcher
  //     const response = await fetch(`http://localhost:8082/machine-file/${machineId}/${filename}`);
      
  //     if (response.ok) {
  //       const blob = await response.blob();
        
  //       // Construct a REAL File object from the blob
  //       // This ensures the endpoint receives a 'file' rather than a 'blob'
  //       const realFile = new File([blob], filename, { type: blob.type });
        
  //       setFile(realFile); // Store for endpoint submission
  //       setPreviewUrl(URL.createObjectURL(realFile)); // Create preview for UI
  //     }
  //   } catch (error) {
  //     console.error("Failed to sync auto-generated file:", error);
  //   }
  // };
  // Inside useProcessForm.js

const syncAutoFile = async (machineId, filename) => {
  try {
    const response = await fetch(`${LOCAL_WATCHER_URL}/machine-file/${machineId}/${filename}`);
    if (response.ok) {
      const blob = await response.blob();
      
      // 1. Create the real File object from the blob
      const realFile = new File([blob], filename, { type: blob.type });

      // 2. Find the key for the file field in your LOCAL_FORM_CONFIGS
      const stageConfig = LOCAL_FORM_CONFIGS[stageId];
      const fileField = stageConfig?.fields?.find(f => f.type === "file");

      if (fileField) {
        // 3. Update the values state with the real file
        // This ensures 'file' data is present when onSubmit is called
        setValues(prev => ({
          ...prev,
          [fileField.key]: {
            name: filename,
            file: realFile, // The actual binary data
            preview: URL.createObjectURL(realFile),
            auto: true
          }
        }));
      }
    }
  } catch (error) {
    console.error("Auto-sync fetch failed:", error);
  }
};

  // Manual upload fallback logic
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      setForm(LOCAL_FORM_CONFIGS[stageId] || null); //

      try {
        const record = await fetchProcessRecord(pcbSerial, stageId, configDetails); //
        setSavedData(record);
      } catch {
        setSavedData(null);
      }

      setLoading(false);
    }

    load();
  }, [pcbSerial, stageId]);

  return { 
    form, 
    savedData, 
    loading, 
    file, 
    previewUrl, 
    isFileReady, 
    handleFileChange, 
    syncAutoFile 
  };
}