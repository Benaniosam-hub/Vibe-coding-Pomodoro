# You Can't Escape From Me — Desktop App Installation Guide

This is a strict accountability E-Ink styled Pomodoro timer with automated work logging and offline spreadsheet (`.xlsx` / `.doc`) progression sheet generation.

Since you want to run this as a **native desktop application** and install it via a **DMG installer on macOS**, follow these simple steps to build and pack it on your Mac.

---

## Why did you get the "Missing script" error?
You received the `npm ERR! Missing script: "desktop:dist"` error because you downloaded the `.zip` archive **before** the package scripts were fully updated. 

To solve this:
1. Open the **Settings menu** (gear icon) in the top right of your Google AI Studio workspace.
2. Click **Export to ZIP** to download the latest updated codebase containing the active Electron desktop configuration.
3. Extract the new `.zip` file on your Mac and open your terminal in that folder.

---

## macOS Desktop Build Instructions

Once you have extracted the updated folder, run the following commands in your Mac terminal:

### 1. Install Dependencies
Install all core application and desktop development dependencies (including Electron and Electron Builder):
```bash
npm install
```

### 2. Build the Production Files & Package the macOS DMG
Generate the distribution files and bundle them into a native macOS Disk Image (`.dmg`):
```bash
npm run desktop:dist
```

---

## Where is my DMG file?
Once the build completes, a folder named `dist-desktop` will be created in your directory. Inside `dist-desktop`, you will find:
*   `You Can't Escape From Me-1.0.0.dmg` — **Your double-clickable installer file!**
*   `You Can't Escape From Me.app` — The raw macOS application bundle.

Double-click the `.dmg` file, drag **You Can't Escape From Me** into your Applications folder, and launch it!

---

## App Features (Tailored for macOS)
*   **Chassis Styling**: Embedded within an authentic Kindle/Pebble E-Ink screen bezel.
*   **Window Titlebar**: Uses a native translucent `hiddenInset` macOS titlebar for a clean Apple design.
*   **Local Exports**: Generates and downloads real Microsoft Excel (`.xlsx`) ledgers and Microsoft Word (`.doc`) progression reports locally on your machine.
*   **Anti-Tab-Escape Sentinel**: Monitors focus states. Changing windows or desktop spaces logs warning strikes directly in your supervisor's daily audit sheet.
