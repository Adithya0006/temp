/**
 * operatorHelpers.js
 * -----------------------------------------
 * Contains logic for:
 * 1. Filtering operations for the specific logged-in operator.
 * 2. formatting dates.
 * 3. Handling Start/Stop/Complete actions.
 */

// --- 1. Get Staff ID ---
export const getStaffId = (user) => user?.staffNumber || "";

// --- 2. Format Date ---
export const fmt = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

// --- 3. Get Assigned Operations (FOR TABS) ---
export const getAssignedOperations = (inActionPCBs, staffId) => {
  const uniqueOps = new Map();

  inActionPCBs.forEach((pcb) => {
    (pcb.linkedOperations || []).forEach((op) => {
      // CHECK: Does assignedTo array contain this staffId?
      const isAssigned =
        op.assignedTo &&
        (Array.isArray(op.assignedTo)
          ? op.assignedTo.includes(staffId)
          : op.assignedTo === staffId); // Fallback for old data

      if (isAssigned) {
        // Use S.No as key to avoid duplicates
        const key = op.sno || op["S.No"];
        if (!uniqueOps.has(key)) {
          uniqueOps.set(key, op);
        }
      }
    });
  });

  // Return sorted by S.No
  return Array.from(uniqueOps.values()).sort(
    (a, b) => (a.sno || a["S.No"]) - (b.sno || b["S.No"])
  );
};

// --- 4. Get PCBs for the Active Tab ---
export const pcbsForTab = (inActionPCBs, assignedOperations, activeTab, staffId) => {
  const targetOp = assignedOperations[activeTab];
  if (!targetOp) return [];

  const targetSno = targetOp.sno || targetOp["S.No"];
  const rows = [];

  inActionPCBs.forEach((pcb) => {
    (pcb.linkedOperations || []).forEach((op, index) => {
      const currentSno = op.sno || op["S.No"];

      // 1. Must match the Tab's Operation ID
      if (currentSno == targetSno) {
        // 2. Must be assigned to THIS user
        const isAssigned =
          op.assignedTo &&
          (Array.isArray(op.assignedTo)
            ? op.assignedTo.includes(staffId)
            : op.assignedTo === staffId);

        if (isAssigned) {
          rows.push({
            pcb,
            opIndex: index,
            opObj: op,
          });
        }
      }
    });
  });

  return rows;
};

// --- 5. Check if Tab is Locked ---
export const isTabLocked = (tabIndex, activeTab, assignedOperations, inActionPCBs) => {
  // Logic: You can't work on Step 2 if Step 1 isn't done?
  // For now, return false to allow flexibility.
  // You can add complex locking logic here if needed.
  return false;
};

// --- 6. Perform Action Helper (The Logic Engine) ---
export const performActionHelper = (prevPCBs, payload, serialKey) => {
  const { action, pcbSerial, opIndex } = payload;
  const now = new Date().toISOString();

  return prevPCBs.map((pcb) => {
    // Find PCB by Serial
    const currentSerial = pcb[pcb._pcb_key_id || serialKey];
    if (currentSerial !== pcbSerial) return pcb;

    // Create copy of operations
    const newOps = [...(pcb.linkedOperations || [])];
    const op = { ...newOps[opIndex] };

    // Apply Logic
    if (action === "start") {
      op.status = "In Progress";
      if (!op.startTime) op.startTime = now;
    } else if (action === "stop") {
      op.status = "Paused"; // or keep 'In Progress' depending on preference
    } else if (action === "complete") {
      op.status = "Completed";
      op.endTime = now;
    } else if (action === "reset") {
      op.status = "Not Started";
      op.startTime = null;
      op.endTime = null;
    }

    newOps[opIndex] = op;
    return { ...pcb, linkedOperations: newOps };
  });
};