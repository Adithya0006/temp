// ROLE: Helper functions to detect serial number column

export const PCB_SERIAL_KEY_FALLBACK = "serial number";

export const normalizeSerialValue = (val) =>
  val ? String(val).trim().toLowerCase() : "";

export const detectSerialKeyFromKeys = (keys) =>
  keys.find((k) => /serial/i.test(k)) || PCB_SERIAL_KEY_FALLBACK;
