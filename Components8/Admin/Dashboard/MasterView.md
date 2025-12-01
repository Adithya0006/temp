
# Master View Component

## File Name
MasterView.js

---

## Purpose
This screen displays the **Master List** of all uploaded PCBs.

Admin can:
- View all PCBs
- Select rows
- Assign work
- Move selected PCBs to In-Action list

---

## What This File Does

- Displays Master list in a table
- Allows row selection using checkboxes
- Disables already assigned rows
- Marks selected rows as Created
- Moves selected rows to In-Action
- Detects serial number column automatically
- Updates status values

---

## What This File Does NOT Do

- Does NOT save data to database
- Does NOT upload files
- Does NOT handle Preview logic
- Does NOT manage file reading

---

## Props Used

| Prop Name | Purpose |
|------------|---------|
| masterList | Master PCB list |
| setMasterList | Updates Master list |
| setInActionList | Updates InAction list |
| addInActionPCBs | Sends data to Supervisor |
| selectedIds | Holds selected rows |
| setSelectedIds | Updates selection |
| setPcbSerialKey | Detects serial column |
| setView | Moves between screens |

---

## Status Values

```js
Status = "Not Yet Created"
Status = "Created"
```
Assigned rows are marked in green.

---

## Main Action Logic

### Assign & Move to In-Action

When user clicks **Assign & Move to In-Action**:

1. Selected rows are checked
2. Confirmation popup appears
3. Status is updated to "Created"
4. PCB serial column is detected
5. Rows are converted to InAction format
6. Parent state is updated
7. User is redirected to InAction screen

---

## Disabled Selection

Rows already marked as **Created**:
- Checkbox is disabled
- Cannot be selected again

---

## Columns Displayed

All columns from uploaded file except:

- id

---

## UI Features

- Material UI table
- Checkbox selection
- Color-coded status
- Scrollable table
- Sticky header
- Action bar
- Back button

---

## Folder Example

```
Admin/
├── MasterView.js ✅
├── InActionView.js
├── AdminDashboard.js
└── ...
```

---

## Summary

MasterView.js is the **Main control screen**.

It does:
✅ Show all PCBs  
✅ Assign work  
✅ Detect serial  
✅ Move to InAction  

It does NOT:
❌ Upload files  
❌ Store data  
❌ Control Preview  

---
