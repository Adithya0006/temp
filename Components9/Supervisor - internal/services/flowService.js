/**
 * services/flowService.js
 * ------------------------------------------------
 * Service layer for handling Flow/Template operations.
 *
 * FRONTEND DEV NOTE:
 * We are using mock data here. When Backend is ready:
 * 1. Import axios.
 * 2. Replace the 'resolve' calls with actual API requests.
 * 3. e.g., return axios.post('/api/flows', flowData);
 */

// Mock database for now
let MOCK_DB_FLOWS = [
  {
    id: "flow_001",
    name: "Standard Morning Shift",
    steps: [
      { opId: 1, opName: "Labeling", assignedTo: ["op1", "op2"] }
    ]
  }
];

export const flowService = {

  /**
   * FETCH all saved flows from the backend.
   */
  getAllFlows: async () => {
    // TODO: BACKEND INTEGRATION
    // return axios.get('/api/flows');

    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_DB_FLOWS]), 500);
    });
  },

  /**
   * SAVE a new flow template.
   * @param {Object} newFlow - { name, steps: [] }
   */
  saveFlow: async (newFlow) => {
    // TODO: BACKEND INTEGRATION
    // return axios.post('/api/flows', newFlow);

    return new Promise((resolve) => {
      const flowWithId = { ...newFlow, id: `flow_${Date.now()}` };
      MOCK_DB_FLOWS.push(flowWithId);
      setTimeout(() => resolve(flowWithId), 500);
    });
  },

  /**
   * DELETE a flow.
   */
  deleteFlow: async (flowId) => {
    // TODO: BACKEND INTEGRATION
    // return axios.delete(`/api/flows/${flowId}`);

    return new Promise((resolve) => {
      MOCK_DB_FLOWS = MOCK_DB_FLOWS.filter(f => f.id !== flowId);
      setTimeout(() => resolve(true), 500);
    });
  }
};