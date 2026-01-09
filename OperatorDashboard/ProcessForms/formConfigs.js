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
   "3": {
    "stage_name": "Baking of Bare PCB",
    "fields": [
      { "key": "profile_name", label: "Profile Name", type: "text" },
      { "key": "max_temp", label: "Max Temp (°C)", type: "number" },
      { "key": "pdf_report", label: "Upload Report", type: "file" },
      { "key": "equipment_name", "label": "Equipment Name", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" }
    ]
  },
   "4": {
    "stage_name": "Solder Paste Printing - Top Side",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "equipment_name", "label": "Equipment Name", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" },
      {"key": "stencil_details", "label": "Stencil Details", "type": "text" },
      {"key": "thawing_details", "label": "Thawing Details", "type": "text" },
      { "key": "solder_gr_details", "label": "Solder GR Details", "type": "text" },
      { "key": "solder_batch_code", "label": "Solder Batch Code", "type": "text" },
      { "key": "shelf_life_date", "label": "Shelf Life Date", "type": "date" }
    ]
  },
  "5": {
    "stage_name": "Solder Paste Inspection - Top Side",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "spc_data_ovenrider", "label": "SPC Data from Ovenrider", "type": "text" },
      { "key": "profile_data_file", "label": "Profile Data from machine (.pdf)", "type": "file", "accept": ".pdf" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" }
    ]
  },
   "6": {
    "stage_name": "Pick n Place - Top side",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "traceability_data_file", "label": "Traceability Data from machine (.html)", "type": "file", "accept": ".html,.htm" },
      { "key": "equipment_name", "label": "Equipment Name", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" }
    ]
  },
   "7": {
    "stage_name": "Reflow-Top side",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "spc_data_ovenrider", "label": "SPC Data from Ovenrider", "type": "text" },
      { "key": "profile_data_file", "label": "Profile Data from machine (.pdf)", "type": "file", "accept": ".pdf" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" }
    ]
  },

  "8": {
    "stage_name": "Application of Amicon D",
    "fields": [
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "baking_details", "label": "Baking Details", "type": "textarea" },
      { "key": "glue_gr_details", "label": "Glue GR Details", "type": "text" },
      { "key": "glue_batch_code", "label": "Glue Batch Code", "type": "text" },
      { "key": "glue_shelf_life_date", "label": "Glue Shelf Life Date", "type": "date" }
    ]
  },
  "9": {
    "stage_name": "Solder Paste Printing-BOTTOM side",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "stencil_details", "label": "Stencil Details", "type": "text" },
      { "key": "thawing_details", "label": "Thawing Details", "type": "text" },
      { "key": "paste_gr_details", "label": "Solder Paste GR Details", "type": "text" },
      { "key": "paste_batch_code", "label": "Solder Paste Batch Code", "type": "text" },
      { "key": "paste_shelf_life_date", "label": "Solder Paste Shelf Life Date", "type": "date" }
    ]
  },
  "10": {
    "stage_name": "Solder Paste Inspection-BOTTOM side",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "spc_data_ovenrider", "label": "SPC Data from Ovenrider", "type": "text" },
      { "key": "profile_data_file", "label": "Profile Data from machine (.pdf)", "type": "file", "accept": ".pdf" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" }
    ]
  },
  "11": {
    "stage_name": "Pick n Place-BOTTOM side",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "traceability_data_file", "label": "Traceability Data from machine (.html)", "type": "file", "accept": ".html,.htm" },
        { "key": "equipment_name", "label": "Equipment Name", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" }
    ]
  },
  "12": {
    "stage_name": "Reflow-BOTTOM side",
    "fields": [
         { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "spc_data_ovenrider", "label": "SPC Data from Ovenrider", "type": "text" },
      { "key": "profile_data_file", "label": "Profile Data from machine (.pdf)", "type": "file", "accept": ".pdf" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "equipment_id", "label": "Equipment ID", "type": "text" }
    ]
  },
  "13": {
    "stage_name": "Traceability of BGA & Circulator",
    "fields": [
      { "key": "traceability_file", "label": "Traceability file from system (.pdf)", "type": "file", "accept": ".pdf" },
    ]
  },
  "14": {
    "stage_name": "Cleaning of PCBA",
    "fields": [
      { "key": "cleaning_program_no", "label": "Cleaning Program No", "type": "text" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "agent_gr_details", "label": "Cleaning Agent GR Details", "type": "text" },
      { "key": "agent_batch_code", "label": "Cleaning Agent Batch Code", "type": "text" },
      { "key": "agent_shelf_life_date", "label": "Cleaning Agent Shelf Life Date", "type": "date" }
    ]
  },
   "15": {
    "stage_name": "AOI Inspection",
    "fields": [
      { "key": "aoi_remarks_file", "label": "AOI Remarks File", "type": "file" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" }
    ]
  },
  "16": {
    "stage_name": "X-ray Inspection",
    "fields": [
      { "key": "xray_images", "label": "Captured X-ray Images", "type": "file", "multiple": true },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "xray_remarks", "label": "X-ray Remarks", "type": "textarea" }
    ]
  },
  "17": {
    "stage_name": "Endoscope Inspection",
    "fields": [
      { "key": "defect_image", "label": "Image of Defect", "type": "file" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "ersa_remarks", "label": "Ersa Remarks", "type": "textarea" }
    ]
  },
  "18": {
    "stage_name": "Visual Inspection",
    "fields": [
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "vi_remarks", "label": "VI Remarks", "type": "textarea" }
    ]
  },
  "19": {
    "stage_name": "AOI correction",
    "fields": [
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "reply_remarks", "label": "Reply to remarks (01 to 04)", "type": "textarea" },
      { "key": "traceability_data", "label": "Traceability Data (if components replaced)", "type": "textarea" }
    ]
  },
  "20": {
    "stage_name": "Cleaning of PCBA",
    "fields": [
     
      { "key": "cleaning_program_no", "label": "Cleaning Program No", "type": "text" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "agent_gr_details", "label": "Cleaning Agent GR Details", "type": "text" },
      { "key": "agent_batch_code", "label": "Cleaning Agent Batch Code", "type": "text" },
      { "key": "agent_shelf_life", "label": "Cleaning Agent Shelf Life Date", "type": "date" }
    ]
  },
  "21": {
    "stage_name": "Visual Inspection after rework",
    "fields": [
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "vi_remarks", "label": "VI Remarks", "type": "textarea" }
    ]
  },
  "22": {
    "stage_name": "HSTT",
    "fields": [
      { "key": "hstt_program_details", "label": "HSTT Program Details", "type": "text" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" }
    ]
  },
  "23": {
    "stage_name": "Fly Probe Test (FPT)",
    "fields": [
      { "key": "fpt_program_details", "label": "FPT Program Details", "type": "text" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "fpt_remarks", "label": "FPT Remarks", "type": "textarea" }
    ]
  },
  "24": {
    "stage_name": "Connector assembly",
    "fields": [
      
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "baking_details", "label": "Baking Details", "type": "textarea" },
      { "key": "baking_oven_details", "label": "Baking Oven Details", "type": "text" },
      { "key": "connector_batch_details", "label": "Connector Batch Details", "type": "text" },
      { "key": "consumables_gr_details", "label": "GR Details (Cleaning Agent )", "type": "textarea" },
      { "key": "consumables_batch_code", "label": "Batch Code (Cleaning Agent)", "type": "text" },
      { "key": "consumables_shelf_life", "label": "Shelf Life Date (Cleaning Agent)", "type": "date" },
      { "key": "consumables_gr_details", "label": "GR Details (Solder Wire)", "type": "textarea" },
      { "key": "consumables_batch_code", "label": "Batch Code (Solder Wire)", "type": "text" },
      { "key": "consumables_shelf_life", "label": "Shelf Life Date (Solder Wire)", "type": "date" },
    ]
  },
  "25": {
    "stage_name": "X-ray of via fill",
    "fields": [
      { "key": "xray_images", "label": "Captured X-ray Images", "type": "file", "multiple": true },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "xray_remarks", "label": "X-ray Remarks", "type": "textarea" }
    ]
  },
  "26": {
    "stage_name": "Cleaning after connector assembly",
    "fields": [
      
      { "key": "cleaning_program_no", "label": "Cleaning Program No", "type": "text" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "agent_gr_details", "label": "Cleaning Agent GR Details", "type": "text" },
      { "key": "agent_batch_code", "label": "Cleaning Agent Batch Code", "type": "text" },
      { "key": "agent_shelf_life", "label": "Cleaning Agent Shelf Life Date", "type": "date" }
    ]
  },
  "27": {
    "stage_name": "Contamination Check",
    "fields": [
      { "key": "contamination_report", "label": "Contamination Report", "type": "file" },
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "pcb_serial_number", "label": "PCB S/N Tested", "type": "text" },
      { "key": "ipa_gr_details", "label": "IPA GR Details", "type": "text" },
      { "key": "ipa_batch_code", "label": "IPA Batch Code", "type": "text" },
      { "key": "ipa_shelf_life", "label": "IPA Shelf Life Date", "type": "date" }
    ]
  },
  "28": {
    "stage_name": "Conformal Coating",
    "fields": [
      { "key": "viscosity_varnish", "label": "Viscosity of Varnish Mix", "type": "text" },
      { "key": "thickness_adhesion_report", "label": "Thickness & Adhesion Report", "type": "file" },
      { "key": "baking_details", "label": "Baking Details", "type": "textarea" },
      { "key": "material_gr_details", "label": "Varnish & Thinner GR Details", "type": "textarea" },
      { "key": "material_batch_code", "label": "Batch Code (Varnish/Thinner)", "type": "text" },
      { "key": "material_shelf_life", "label": "Shelf Life Date (Varnish/Thinner)", "type": "date" }
    ]
  },
  "29": {
    "stage_name": "Parallel Gap welding",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" }
    ]
  },
  "30": {
    "stage_name": "Intermediate Control",
    "fields": [
      { "key": "remarks", "label": "Remarks (Next step based on this)", "type": "textarea" },
      { "key": "checklist_completed", "label": "Checklist Completed", "type": "checkbox" }
    ]
  },
  "31": {
    "stage_name": "Scotch weld Gluing",
    "fields": [
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" },
      { "key": "baking_details", "label": "Baking Details", "type": "textarea" },
      { "key": "glue_gr_details", "label": "Glue GR Details", "type": "text" },
      { "key": "glue_batch_code", "label": "Glue Batch Code", "type": "text" },
      { "key": "glue_shelf_life", "label": "Glue Shelf Life Date", "type": "date" }
    ]
  },
  "32": {
    "stage_name": "HASS",
    "fields": [
    
      { "key": "hass_program_details", "label": "HASS Program Details", "type": "text" },
   
      { "key": "equipment_details", "label": "Equipment Details", "type": "text" }
    ]
  },
  "33": {
    "stage_name": "ATE1",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "remarks", "label": "Remarks (Next step based on this)", "type": "textarea" }
    ]
  },
  "34": {
    "stage_name": "ATE2",
    "fields": [
      { "key": "program_details", "label": "Program Details", "type": "text" },
      { "key": "remarks", "label": "Remarks (Next step based on this)", "type": "textarea" }
    ]
  },
  "35": {
    "stage_name": "EMI shield mounting",
    "fields": [
    
    ]
  },
  "36": {
    "stage_name": "Final Control",
    "fields": [
      { "key": "checklist_completed", "label": "Checklist Completed", "type": "checkbox" },
      { "key": "remarks", "label": "Remarks (Next step based on this)", "type": "textarea" }
    ]
  },
  "37": {
    "stage_name": "Clearance Control",
    "fields": [
      { "key": "dcs_documents", "label": "Upload DCS and other documents", "type": "file", "multiple": true }
    ]
  }
};
