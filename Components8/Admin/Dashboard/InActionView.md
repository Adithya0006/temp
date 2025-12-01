
# In-Action View Component

## File Name
InActionView.js

---

## Purpose
This screen displays all PCBs that are currently in the **In-Action** stage.

Admin can:
- View active PCBs
- Move a PCB back to Master List

---

## What This File Does

- Displays In-Action PCBs in a table
- Detects serial number column automatically
- Highlights serial number value
- Allows moving PCB back to Master List
- Updates list through parent component
- Shows count of active PCBs

---

## What This File Does NOT Do

- Does NOT save data permanently
- Does NOT update database
- Does NOT upload files
- Does NOT change Master list directly

---

## Props Used

| Prop Name | Purpose |
|------------|---------|
| inActionList | List of active PCBs |
| deleteInActionPCB | Removes PCB from In-Action |
| pcbSerialKey | Serial number column name |
| setView | Moves between screens |

---

## Main Action Logic

### Move Back to Master

When user clicks **Move Back**:

1. Finds clicked PCB row
2. Detects serial number column
3. Normalizes value
4. Shows confirmation popup
5. Calls parent function to remove PCB from InAction

---

## Serial Column Detection

The serial number is detected from:
- `pcbSerialKey`
- Row metadata
- Helper function fallback
- Common names like:
  - serial number
  - SNo

---

## Columns Displayed

Columns are automatically derived except:

- id
- linkedOperations
- isWorkAssigned
- _pcb_key_id

---

## UI Features

- Material UI table
- Scrollable table area
- Sticky header
- Highlighted serial number
- Back button
- No-data message handling

---

## Folder Example

```
Admin/
├── InActionView.js ✅
├── MasterView.js
├── AdminDashboard.js
└── ...
```

---

## Summary

InActionView.js is the **Monitoring screen**.

It does:
✅ Show active PCBs  
✅ Move PCB back  
✅ Detect serial  
✅ Display count  

It does NOT:
❌ Store data  
❌ Upload files  
❌ Modify Master directly  

---
