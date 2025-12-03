// ROLE: Reads Excel/CSV file

import * as XLSX from "xlsx";

export const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    resolve(XLSX.utils.sheet_to_json(sheet));
  };
  reader.readAsArrayBuffer(file);
});
