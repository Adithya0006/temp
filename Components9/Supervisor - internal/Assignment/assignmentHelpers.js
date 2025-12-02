/**
 * assignmentHelpers.js
 * -----------------------------------------
 * Helper functions used during Supervisor assignment.
 *
 * These functions were directly extracted from SupervisorAssignement.js.
 * No logic changed.
 */

/**
 * Convert PCB list into only working PCBs (filtering)
 */
export const getEligiblePCBs = (pcbs, selectedOperation) => {
  if (!selectedOperation) return [];
  return pcbs.filter((pcb) => pcb.isWorkAssigned !== true);
};

/**
 * Create assignment payload for storing into PCB
 */
export const applyAssignment = ({
  inActionPCBs,
  selectedPcbs,
  selectedOperation,
  selectedOperators,
}) => {

  return inActionPCBs.map((pcb) => {

    if (!selectedPcbs.has(pcb.id)) return pcb;

    const updatedOps = [...(pcb.linkedOperations || [])];

    updatedOps.push({
      sno: selectedOperation.sno,
      name: selectedOperation.name,
      assignedTo: selectedOperators.map(op => op.staffNumber),
      status: "Not Started",
      startTime: null,
      endTime: null,
    });

    return {
      ...pcb,
      linkedOperations: updatedOps,
      isWorkAssigned: true,
    };
  });
};
