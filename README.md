# 💸 PayDash

### A secure, offline-first PWA to calculate pay from multiple zero-hour contracts.

---

## 🚀 Live Demo & Install

You can use or install the app directly from this link:

**[https://paydash-cyberguardian2494.netlify.app/](https://paydash-cyberguardian2494.netlify.app/)**

---

## 🎯 The Problem

Calculating your monthly paycheck when you have multiple zero-hour contract jobs is a confusing mess.
* **Job 1** might pay from the 15th to the 14th.
* **Job 2** might pay from the 4th Monday to the 3rd Friday.
* This makes it impossible to know how much your *next* paycheck will be until it arrives.

**PayDash** solves this by being a simple, dedicated calculator that understands overlapping pay cycles. You log your hours, define your pay periods, and it does the math for you.

## ✨ Key Features

* **Custom Jobs:** Set custom names and hourly rates for two different jobs.
* **Daily Hour Logging:** A fast, simple interface for logging daily shifts.
* **Precise Pay Calculation:** Automatically calculates your total gross pay based on custom, overlapping pay period dates.
* **🔒 Secure PIN Lock:** Protects your financial data with a 4-digit PIN. (See Security section below).
* **Offline-First (PWA):** Works 100% offline. All your data is stored securely on your device, not in the cloud.
* **Installable:** Can be installed on any Android, Windows, or Mac device for a native-app feel.
* **Data Reset:** A "factory reset" option to clear all shifts and settings without removing your PIN.

## 🛠️ Tech Stack

* **HTML5** (Structure)
* **Tailwind CSS** (Styling)
* **JavaScript (ES6+)** (Logic)
* **Progressive Web App (PWA)** (Service Worker for offline capability & `manifest.json` for installation)
* **Web Crypto API** (`SubtleCrypto` for SHA-256 PIN hashing)
* **Browser `localStorage`** (On-device data storage)

## 📖 How to Use (New User Guide)

Using the app is a simple 3-step process: **Set**, **Log**, and **Calculate**.

### Step 1: Set Up Your Jobs (In "Settings")
This is the first thing you should do.

1.  Tap the **"Settings"** tab in the bottom navigation.
2.  In the "Job Configuration" section, enter the names (e.g., "Starbucks") and hourly rates (e.g., "14.50") for your jobs.
3.  These are saved automatically.

### Step 2: Log Your Hours (In "Log")
This is what you'll do every day.

1.  Tap the **"Log"** tab.
2.  The job dropdown will now show your custom job names.
3.  Select a date, the job you worked, and the hours.
4.  Click "Log Shift." Your shift is now saved.

### Step 3: Calculate Your Pay (In "Paycheck")
This is what you'll do once a month to see your paycheck.

1.  Tap the **"Paycheck"** tab.
2.  Your custom job names and rates are displayed (read-only).
3.  Your only task is to enter the **Pay Period Dates**.
    * For "Job 1," enter the start and end date for the paycheck you're expecting.
    * For "Job 2," do the same.
4.  The "Results" at the bottom will **automatically update** as you enter the dates, showing you a precise, real-time calculation of your total gross pay.

## 🔒 A Note on Security

Your financial data is sensitive. This app ensures it stays private.

* **100% On-Device:** No data ever leaves your phone or computer. There is no server or cloud database.
* **Secure PIN Hashing:** When you set a 4-digit PIN, the app **does not store your PIN**. It uses the standard **SHA-256** hashing algorithm to create a unique, irreversible fingerprint of your PIN. When you unlock the app, it hashes your input and compares the *hashes*, not the PINs.
* **Secure Reset:** The "Reset App Data" button intentionally **does not** remove your PIN, allowing you to clear your shifts and job data without compromising your app's security.

## 🚧 Future Plans (V2.0)

This app was a fantastic "vibe coding" project. The next major version will focus on a complete architectural refactor to add:

* **Biometric Security:** The option to use your device's fingerprint or face scanner to unlock the app (using the WebAuthn API).
* **Dynamic Jobs:** The ability to add, edit, and delete *unlimited* jobs, not just two.

## 📲 How to Install

This is a PWA and can be installed on most modern devices.

### On Android
1.  Visit the [live demo link](https://paydash-cyberguardian2494.netlify.app/) in Chrome.
2.  Tap the "..." menu in the top-right corner.
3.  Tap **"Install app"**.
4.  The app will be added to your home screen and app drawer.

### On Desktop (Chrome/Edge)
1.  Visit the [live demo link](https://paydash-cyberguardian2494.netlify.app/).
2.  An "Install" icon (a computer with a down-arrow) will appear in the URL bar.
3.  Click it to install the app.

---

## ⚖️ License

This project is licensed under the **MIT License**.
