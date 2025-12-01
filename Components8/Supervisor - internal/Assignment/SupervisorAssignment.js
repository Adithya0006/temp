/**
 * SupervisorAssignment.js
 * -----------------------------------------
 * MAIN CONTROLLER for Supervisor Assignment module.
 *
 * This file:
 * - Manages all state
 * - Handles assignment logic
 * - Calls helper functions
 * - Passes data to child components
 *
 * No UI logic was changed — only split into components.
 */

import React, { useMemo, useState } from "react";

// UI COMPONENTS
import AssignmentHeader from "./AssignmentHeader";
import OperationSelector from "./OperationSelector";
import OperatorSelector from "./OperatorSelector";
import AddOperationBox from "./AddOperationBox";
import AssignmentTable from "./AssignmentTable";

// HELPERS
import {
  getEligiblePCBs,
  applyAssignment
} from "./assignmentHelpers";

export default function SupervisorAssignment({
  goBack,
  inActionPCBs = [],
  setInActionPCBs,
  operations = [],
  setOperations,
  operators = []
}) {

  // Selected dropdown values
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedOperators, setSelectedOperators] = useState([]);

  // Add new operation
  const [newOperationName, setNewOperationName] = useState("");

  // Selected PCBs
  const [selectedPcbs, setSelectedPcbs] = useState(new Set());

  /**
   * Filter PCBs that are available for assignment
   */
  const eligiblePCBs = useMemo(
    () => getEligiblePCBs(inActionPCBs, selectedOperation),
    [inActionPCBs, selectedOperation]
  );

  /**
   * Add new operation dynamically
   */
  const handleAddOperation = () => {

    if (!newOperationName.trim())
      return alert("Enter operation name.");

    const sno = operations.length + 1;

    const newOp = {
      sno,
      name: newOperationName.trim(),
    };

    setOperations((prev) => [...prev, newOp]);

    setNewOperationName("");
  };

  /**
   * Apply assignment to selected PCBs
   */
  const handleAssignWork = () => {

    if (!selectedOperation)
      return alert("Select operation.");

    if (!selectedOperators.length)
      return alert("Select operators.");

    if (!selectedPcbs.size)
      return alert("Select at least one PCB.");

    if (!window.confirm("Confirm assignment?"))
      return;

    const updated = applyAssignment({
      inActionPCBs,
      selectedPcbs,
      selectedOperation,
      selectedOperators,
    });

    // Update global list
    setInActionPCBs(updated);

    // Reset selection
    setSelectedPcbs(new Set());
    setSelectedOperators([]);
    setSelectedOperation(null);

    alert("Assignment successful!");
    goBack();
  };

  return (
    <div>

      {/* HEADER */}
      <AssignmentHeader onBack={goBack} />

      {/* TOP CONTROLS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "16px" }}>

        {/* OPERATION SELECT */}
        <OperationSelector
          operations={operations}
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
        />

        {/* OPERATOR SELECT */}
        <OperatorSelector
          operatorOptions={operators}
          selectedOperators={selectedOperators}
          setSelectedOperators={setSelectedOperators}
        />

      </div>

      {/* ADD OPERATION */}
      <div style={{ padding: "16px" }}>
        <AddOperationBox
          newOperationName={newOperationName}
          setNewOperationName={setNewOperationName}
          handleAddOperation={handleAddOperation}
        />
      </div>

      {/* ASSIGNMENT TABLE */}
      <div style={{ padding: "16px" }}>
        <AssignmentTable
          selectedOperation={selectedOperation}
          selectedOperators={selectedOperators}
          pcbs={eligiblePCBs}
          selectedPcbs={selectedPcbs}
          setSelectedPcbs={setSelectedPcbs}
          handleAssignWork={handleAssignWork}
        />
      </div>

    </div>
  );
}
