# 📜 You Can't Escape From Me

> **An Unforgiving E-Ink Strict Accountability Pomodoro & Automatic Work Hour Audit System**

[![Platform - macOS](https://img.shields.io/badge/Platform-macOS%20%7C%20Desktop-black?style=for-the-badge&logo=apple)](https://github.com)
[![Framework - Electron](https://img.shields.io/badge/Electron-31.0-47848F?style=for-the-badge&logo=electron)](https://electronjs.org)
[![React - 19.0](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript - 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS - 4.0](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License - MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 👁️ Overview

**You Can't Escape From Me** is not your average relaxed productivity timer. Built for individuals who struggle with distraction and procrastination, it combines a crisp **Kindle/Pebble E-Ink high-density interface** with relentless, high-pressure supervision from simulated strict parental figures (**Father Arthur** and **Uncle Dave**).

Every focus session is monitored, every tab switch is penalized, and every minute worked is logged directly into an audit ledger that exports to real **Microsoft Excel (`.xlsx`)** workbooks and **Microsoft Word (`.doc`)** progression sheets.

---

## 📸 Visual Walkthrough

<div align="center">

### 1. The High-Density E-Ink Control Chassis
*A retro electronic paper frame featuring low-distraction pixel-perfect typography, physical action toggles, and live countdown timers.*


<img width="1042" height="784" alt="Screenshot 2026-07-31 at 8 20 36 AM" src="https://github.com/user-attachments/assets/3048a177-d5c0-47bf-a88a-8f7d10a385af" />


<br/>

### 2. Strict Auditor Setup & Registration
*Select your active auditor (Father Arthur or Uncle Dave), specify your task objectives, and lock in your enforcement strictness.*

<img width="1002" height="761" alt="Screenshot 2026-07-31 at 8 19 47 AM" src="https://github.com/user-attachments/assets/ab18ff2b-f58b-49fd-a1ae-a33c5b042d3a" />

<img width="1002" height="761" alt="Screenshot 2026-07-31 at 8 20 05 AM" src="https://github.com/user-attachments/assets/d255283b-e38f-4334-beb1-01ba3230f046" />


<br/>

### 3. Real-Time Warning and Tab Switch Detection
*Samples of Warning Detection*

<img width="1136" height="880" alt="Screenshot 2026-07-31 at 8 49 33 AM" src="https://github.com/user-attachments/assets/8e8ed2c9-9893-49c3-bf14-f84d54b25448" />

<img width="1042" height="784" alt="Screenshot 2026-07-31 at 8 31 25 AM" src="https://github.com/user-attachments/assets/40e88836-484e-432b-b799-af71657f1847" />


<br/>

### 4. Automated Excel & Word Audit Export Center
*Generate multi-sheet `.xlsx` workbooks containing complete audit summaries and detailed timestamped work ledgers.*

<img width="1042" height="784" alt="Screenshot 2026-07-31 at 8 21 10 AM" src="https://github.com/user-attachments/assets/ead796a6-dc2e-48cc-ac3a-35c5c6c001f0" />

<img width="1042" height="784" alt="Screenshot 2026-07-31 at 8 20 59 AM" src="https://github.com/user-attachments/assets/3bef1b5f-4a2c-4b5f-8073-43ae823885e4" />


</div>

---

## 🔥 Key Features

### 👴 1. Dual Supervisor Personalities
*   **Arthur (Father & Head of Household)**: Demanding, disappointed, and obsessed with long study streaks and structured routine.
*   **Uncle Dave (Opinionated Relative)**: Unhinged, hyper-critical, and constantly comparing your focus metrics to your cousin Timmy (who works 14 hours a day with zero breaks).

### 🛡️ 2. Anti-Slacking Sentinel & Tab-Switch Lock
Uses browser visibility APIs and desktop focus event hooks. If you switch tabs, change windows, or browse distracting sites, the application locks down and forces you to type an apology phrase (*"I AM SORRY COUSIN TIMMY IS INDEED SUPERIOR"*) while logging an irrevocable **strike** on your record.

### 🎯 3. Three Strictness Enforcement Levels
*   **⚠️ Demanding Mode**: 3 emergency pauses allowed, moderate spot audit frequency.
*   **🔥 Ruthless Mode**: 1 emergency pause allowed, tab-switch detection active, strikes logged for delays.
*   **💀 Unhinged Mode**: 0 pauses allowed. Tab switching invalidates the session immediately.

### 📊 4. One-Click Excel & Word Audit Generation
*   **Excel (`.xlsx`)**: Generates structured workbooks with two dedicated sheets (`AUDIT OVERVIEW` with performance grades from `A+` to `F`, and `DETAILED LEDGER` with session subtasks, pauses, and comments).
*   **Word (`.doc`)**: Formats an official signed Progression & Study Audit document with supervisor sign-off lines and stamp headers.

---

## 🛠️ Tech Stack

*   **Core Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Desktop Shell**: [Electron 31](https://www.electronjs.org/) + [Electron Builder](https://www.electron.build/)
*   **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) + Custom E-Ink Design Tokens
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Data Export**: [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) + HTML-MIME Word Blob Generator
*   **Build Tool**: [Vite 6](https://vitejs.dev/)

---

## 🚀 Installation & Build Guide

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.0 or higher)
*   [npm](https://www.npmjs.com/) (v9.0 or higher)
*   macOS (for building native `.dmg` installers)

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/you-cant-escape-from-me.git
cd you-cant-escape-from-me
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Mode
Run the Vite development server in your browser:
```bash
npm run dev
```

Or run the desktop application directly in Electron:
```bash
npm run desktop:run
```

---

### 📦 Packaging for macOS (.dmg)

To compile the production assets and package the standalone macOS Disk Image (`.dmg`):

```bash
npm run desktop:dist
```

Once the build finishes, open the newly created `dist-desktop` folder:
*   `You Can't Escape From Me-1.0.0.dmg` — Double-click to mount and drag into `/Applications`!

---

## 🍏 Fixing macOS "App is Damaged / Malware / Moved to Trash" Warning

When you download custom or self-packaged `.dmg` files or zip archives from the web that are not signed with a paid Apple Developer Certificate ($99/yr), **macOS Gatekeeper / XProtect automatically tags the file with a quarantine attribute (`com.apple.quarantine`)** and displays:
> *"App is damaged and cannot be opened. You should move it to the Trash."* or *"macOS cannot verify that this app is free from malware."*

### How to open and run it safely on your Mac:

#### Option 1: Build directly on your Mac (Recommended & Safest)
Because macOS automatically trusts binaries compiled on your own local system:
1. Export/download the project `.zip` to your Mac.
2. Open terminal in the unzipped folder and run:
   ```bash
   npm install
   npm run desktop:dist
   ```
3. Open `dist-desktop/` and double click `You Can't Escape From Me-1.0.0.dmg`. Since it was built on your Mac, Gatekeeper will let you install and open it smoothly!

#### Option 2: Clear the macOS Quarantine attribute (If installing an existing DMG)
If macOS blocks the installed app or `.dmg`, run this simple terminal command to remove the quarantine flag:

```bash
# Remove quarantine attribute from the installed application:
sudo xattr -rd com.apple.quarantine "/Applications/You Can't Escape From Me.app"
```

Or for the downloaded `.dmg` file before opening:
```bash
xattr -d com.apple.quarantine ~/Downloads/"You Can't Escape From Me-1.0.0.dmg"
```

Once executed, open the app normally — macOS will launch it safely without warnings or moving it to trash!

---

## 📂 Project Structure

```
you-cant-escape-from-me/
├── electron-main.cjs          # Electron main process & native window setup
├── package.json               # Dependencies & Electron Builder configuration
├── vite.config.ts             # Vite build configuration (relative base paths)
├── src/
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Main state machine & navigation controller
│   ├── index.css              # Custom E-Ink CSS variables & flat borders
│   ├── types.ts               # Shared TypeScript interfaces & types
│   ├── data/
│   │   └── supervisors.ts     # Father & Uncle dialogue, quotes, & spot checks
│   ├── utils/
│   │   └── export.ts          # Excel (.xlsx) and Word (.doc) generator engine
│   └── components/
│       ├── EInkCard.tsx       # Reusable E-Ink retro card container
│       ├── SupervisorSetup.tsx# Registration form & strictness selector
│       ├── SupervisorFeedback.tsx # Dynamic dialogue speech bubble & tab lock modal
│       ├── TimerView.tsx      # Countdown core timer with chip audio feedback
│       ├── StatsView.tsx      # E-Ink weekly distribution bar chart & metrics
│       └── LogsView.tsx       # Session ledger table & export controls
└── README.md
```

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more details.

---

<div align="center">
  <sub>Built with strictness and craft for restless minds. Remember: <b>Cousin Timmy is watching.</b></sub>
</div>
