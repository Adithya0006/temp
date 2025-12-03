
# Home Cards Component

## File Name
HomeCards.js

---

## Purpose
This component displays the **four main cards** on the Admin Home screen.
Each card is used for navigation to different sections of the Admin Dashboard.

---

## Cards Displayed

1. Master List
2. In-Action
3. Create Project
4. Profile Creation

---

## What This File Does

- Displays home dashboard cards
- Shows icons and labels
- Handles navigation on card click
- Sends selected view to AdminDashboard

---

## What This File Does NOT Do

- Does NOT store data
- Does NOT fetch API data
- Does NOT update database
- Does NOT manage logic of Master / InAction

---

## Props Used

| Prop Name | Purpose |
|-----------|---------|
| setView | Switches screen in AdminDashboard |

---

## Navigation Flow

When user clicks a card:

```js
setView(card.view)
```

AdminDashboard receives the selected screen and loads the component.

---

## Card Configuration

Each card is defined inside an array:

| Card | View Trigger |
|------|--------------|
| Master List | master |
| In-Action | inaction |
| Create Project | create |
| Profile Creation | profile |

---

## UI Features

- Material UI components
- Grid layout
- Hover animations
- Responsive design
- Icon display using MUI Icons

---

## Folder Example

```
Admin/
├── HomeCards.js ✅
├── AdminDashboard.js
├── MasterView.js
├── InActionView.js
└── ...
```

---

## Summary

HomeCards.js is the **entry navigation page** for Admin users.
It visually guides the user to the correct section using clickable cards.

---
