
# Create Project View Component

## File Name
CreateProjectView.js

---

## Purpose
This screen allows the admin to **upload an Excel or CSV file** and move to the Preview screen.

It prepares project data before saving it into the Master list.

---

## What This File Does

- Allows uploading Excel / CSV files
- Reads file data
- Extracts column names
- Detects PCB serial number column
- Adds default Status column
- Normalizes row data
- Sends data to Preview screen
- Redirects user to Preview page

---

## What This File Does NOT Do

- Does NOT store data permanently
- Does NOT save data to backend
- Does NOT display tables
- Does NOT handle Master list logic

---

## Props Used

| Prop Name | Purpose |
|------------|---------|
| setUploadedPreviewData | Stores uploaded file data for preview |
| setPreviewColumns | Stores column names |
| setPcbSerialKey | Stores detected PCB number column |
| setView | Moves between screens |

---

## Upload Flow

1. User selects a file
2. File is read using `readFile()`
3. Empty file check is done
4. Columns are extracted from first row
5. `Status` column is added if missing
6. PCB serial column is auto-detected
7. Each row receives:
   - unique `id`
   - default status (`Not Yet Created`) if missing
8. Data is passed to parent component
9. Screen changes to Preview

---

## Important Constants

```js
const STATUS_KEY = "Status";
const STATUS_NOT_YET_ASSIGNED = "Not Yet Created";
```

---

## Main Logic

### File Upload Handler

```js
const handleFileUpload = async (e) => {}
```

This function:
- Reads file
- Detects serial number
- Fixes missing Status
- Sends data upward
- Moves user to Preview screen

---

## UI Features

- Back button (goes to Home)
- Upload button
- Hidden file input
- Material UI design
- Central layout container

---

## Folder Example

```
Admin/
├── CreateProjectView.js ✅
├── PreviewView.js
├── MasterView.js
├── AdminDashboard.js
└── ...
```

---

## Error Handling

If:
- File is wrong
- File is empty
- Excel read fails

User sees:
```
Error reading file. Upload valid Excel or CSV.
```

---

## Summary

CreateProjectView.js is the **entry point** for creating a project from Excel.

It does:
✅ Read file  
✅ Prepare data  
✅ Detect PCB column  
✅ Add Status  
✅ Move to Preview  

It does NOT:
❌ Save data  
❌ Talk to database  
❌ Show table  

---
