
# Preview View Component

## File Name
PreviewView.js

---

## Purpose
This screen appears after uploading an Excel or CSV file.

It allows the admin to:
- Preview uploaded data
- Edit values
- Add new rows
- Delete rows
- Save data to Master List
- Cancel upload

---

## What This File Does

- Displays uploaded file in table format
- Allows inline editing of cells
- Adds new rows dynamically
- Deletes existing rows
- Resets status column
- Saves data to Master list
- Cancels upload and clears preview data

---

## What This File Does NOT Do

- Does NOT upload file again
- Does NOT read Excel data
- Does NOT store data permanently
- Does NOT handle backend communication

---

## Props Used

| Prop Name | Purpose |
|------------|---------|
| uploadedPreviewData | Preview table data |
| previewColumns | Column names |
| setUploadedPreviewData | Updates preview data |
| setPreviewColumns | Updates column list |
| setMasterList | Saves into master |
| setView | Controls navigation |

---

## Main Actions

### Add Row
Creates a new empty row with default status.

### Edit Cell
Allows inline editing of all columns except Status.

### Delete Row
Removes a selected row after confirmation.

### Save to Master List
Moves all rows to Master list and clears preview.

### Cancel
Clears preview data and returns to Home.

---

## Status Handling

```js
Status = "Not Yet Created"
```
This column is always locked from editing.

---

## UI Features

- Editable table
- Sticky header
- Text fields in cells
- Delete buttons
- Add buttons
- Back navigation
- Save button

---

## Folder Example

```
Admin/
├── PreviewView.js ✅
├── CreateProjectView.js
├── MasterView.js
└── ...
```

---

## Summary

PreviewView.js is the **final validation step** before data is saved.

It does:
✅ Edit data  
✅ Add rows  
✅ Remove rows  
✅ Save to master  

It does NOT:
❌ Read file  
❌ Manage DB  
❌ Assign work  

---
