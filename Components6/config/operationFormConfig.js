// Field definitions for each process
// Type can be: text, number, date, select, textarea

const operationFormConfig = {
  "AOI Inspection": [
    { key: "programNumber", label: "Program Number", type: "text", required: true },
    { key: "profile", label: "Profile Used", type: "text" },
    { key: "result", label: "Result", type: "select", options: ["PASS", "FAIL"], required: true },
    { key: "remarks", label: "Remarks", type: "textarea" }
  ],

  "X-Ray Inspection": [
    { key: "xrayMachine", label: "X-Ray Machine", type: "text", required: true },
    { key: "resolution", label: "Resolution", type: "text" },
    { key: "result", label: "Result", type: "select", options: ["PASS", "FAIL"], required: true },
    { key: "remarks", label: "Remarks", type: "textarea" }
  ],

  "Cleaning of PCBA": [
    { key: "solventUsed", label: "Solvent Used", type: "select", options: ["IPA", "DI Water", "Other"] },
    { key: "duration", label: "Duration (minutes)", type: "number", required: true },
    { key: "batchNo", label: "Batch Number", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" }
  ],

  // Add the remaining processes later similarly
};

export default operationFormConfig;
