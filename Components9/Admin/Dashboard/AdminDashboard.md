
# Admin Dashboard Component

## File Name
AdminDashboard.js

---

## Purpose
This is the **main controller page** for the Admin panel.

It controls:
- Which screen is visible
- Navigation between pages
- Global state passing between views

This file acts as a **view router and coordinator** for all Admin screens.

---

## What This File Does

- Controls page switching using `view` state
- Loads different screens dynamically
- Stores common states like:
  - Uploaded preview data
  - Column headers
  - Selected rows
  - PCB serial column
- Passes data between components
- Displays Admin header
- Keeps layout consistent

---

## What This File Does NOT Do

- Does NOT handle file reading
- Does NOT manage tables
- Does NOT save data to database
- Does NOT process business logic
- Does NOT validate Excel data

---

## Screens Managed

AdminDashboard controls the following views:

| Screen | Component |
|--------|-----------|
| Home | HomeCards |
| Master List | MasterView |
| In-Action | InActionView |
| Create Project | CreateProjectView |
| Preview | PreviewView |
| Profile | ProfileView |

---

## Navigation System

Navigation is controlled using:

```js
const [view, setView] = useState("home");
```

Each screen is rendered conditionally:

```js
{view === "home" && <HomeCards setView={setView} />}
```

---

## Props Received from Parent

| Prop Name | Purpose |
|------------|---------|
| onLogout | Logs out admin |
| addInActionPCBs | Sends data to supervisor system |
| deleteInActionPCB | Removes PCB from In-Action |
| masterList | Master records |
| setMasterList | Updates master |
| inActionList | Active PCBs |
| setInActionList | Updates InAction list |

---

## Internal State

| State | Usage |
|--------|-------|
| view | Active screen |
| uploadedPreviewData | Stores Excel preview |
| previewColumns | Column headers |
| pcbSerialKey | PCB number field |
| selectedIds | Checkbox selection |

---

## UI Layout

- Full-screen layout
- Gradient background
- Header always visible
- Content changes dynamically

---

## Folder Structure Example

```
Admin/
├── AdminDashboard.js ✅
├── AdminHeader.js
├── HomeCards.js
├── CreateProjectView.js
├── PreviewView.js
├── MasterView.js
├── InActionView.js
└── ProfileView.js
```

---

## How to Add a New Screen

Steps:
1. Create new component file
2. Import into AdminDashboard
3. Add new condition:

```js
{view === "reports" && <ReportsView />}
```

4. Navigate using:

```js
setView("reports");
```

---

## Summary

AdminDashboard.js is the **brain of the Admin UI**.

It does:
✅ Controls navigation  
✅ Shares state  
✅ Loads pages  
✅ Manages selection  

It does NOT:
❌ Read Excel  
❌ Save data  
❌ Handle backend  
❌ Store database  

---
