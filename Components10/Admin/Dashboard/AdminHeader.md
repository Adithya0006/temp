
# Admin Header Component

## File Name
AdminHeader.js

---

## Purpose
This file controls the **top blue header bar** in the Admin Dashboard.

---

## What it Displays
- Admin Dashboard title
- Home button
- Logout button

---

## What it Does NOT Do
- Does NOT store data
- Does NOT call APIs
- Does NOT manage database
- Does NOT change application logic

---

## Props Used

| Prop Name | Description |
|------------|-------------|
| onHome | Navigates back to home page |
| onLogout | Logs out the user |

---

## Button Actions

### Home Button
Calls:
```js
onHome()
```
Used to return back to dashboard home.

### Logout Button
Calls:
```js
onLogout()
```
Used to log the admin user out.

---

## UI Design
- Built using **Material UI**
- Blue gradient header
- Responsive layout
- Clean top navigation bar

---

## Folder Example

```
Admin/
├── AdminHeader.js ✅
├── AdminDashboard.js
├── HomeCards.js
└── ...
```

---

## Summary
`AdminHeader.js` is a **UI-only component**.  
Its job is to display the header and send navigation signals to the parent component.
