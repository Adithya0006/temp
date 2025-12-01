export const LOCAL_FORM_CONFIGS = {
  "1": {
    "stage_name": "Labelling & Traceability of the Bare PCB",
    "fields": [



      { "key": "pcb_date_code", "label": "PCB Date Code", "type": "text" },
      { "key": "pcb_gr_number", "label": "PCB GR Number", "type": "text" },

      { "key": "label_gr_details", "label": "Label GR Details", "type": "textarea" }
    ]
  },
  "2": {
    "stage_name": "Cleaning of Bare PCB",
    "fields": [


      { "key": "cleaning_program_no", "label": "Cleaning Program Number", "type": "text" },
      { "key": "concentration_value", "label": "Concentration Value", "type": "number" },



      { "key": "equipment_name", "label": "Equipment Name", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" },

      { "key": "pcb_gr_details", "label": "PCB GR Details", "type": "textarea" }

    ]
  },
  8: {
    stage_name: "Reflow - TOP side",
    fields: [
      { key: "profile_name", label: "Profile Name", type: "text" },
      { key: "max_temp", label: "Max Temp (°C)", type: "number" },
      { key: "pdf_report", label: "Upload Report", type: "file" }
    ]
  }
};
