/**
 * services/flowService.js
 * ------------------------------------------------
 * FIXED: Mock Data now matches the UI structure correctly.
 * Included 'assignedStaff' array of objects to prevent .map() crashes.
 */

// Mock database with CORRECT structure
let MOCK_DB_FLOWS = [
  {
    id: "flow_001",
    name: "Standard Morning Shift",
    steps: [
      { 
        opId: "1", 
        opName: "Labeling & Traceability", 
        // FIX: The UI expects 'assignedStaff' (Array of Objects), not just IDs
        assignedStaff: [
          { id: "op1", name: "Operator One" },
          { id: "op2", name: "Operator Two" }
        ]
      }
    ]
  }
];

export const flowService = {

  getAllFlows: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_DB_FLOWS]), 300);
    });
  },

  /**
   * SAVE (Create or Update)
   * Checks for existing ID to prevent duplicates.
   */
  saveFlow: async (flowData) => {
    return new Promise((resolve) => {
      
      // 1. Check if this is an UPDATE
      if (flowData.id) {
        const index = MOCK_DB_FLOWS.findIndex(f => f.id === flowData.id);
        
        if (index !== -1) {
          // UPDATE EXISTING
          MOCK_DB_FLOWS[index] = flowData;
          setTimeout(() => resolve(flowData), 300);
          return;
        }
      }

      // 2. CREATE NEW
      const newFlow = { 
        ...flowData, 
        id: flowData.id || `flow_${Date.now()}` 
      };
      
      MOCK_DB_FLOWS.push(newFlow);
      setTimeout(() => resolve(newFlow), 300);
    });
  },

  deleteFlow: async (flowId) => {
    return new Promise((resolve) => {
      MOCK_DB_FLOWS = MOCK_DB_FLOWS.filter(f => f.id !== flowId);
      setTimeout(() => resolve(true), 300);
    });
  }
};