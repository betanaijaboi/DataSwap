# DataSwap

> **DataSwap** is a Nigerian fintech mobile app that lets users buy and sell mobile data bundles, purchase airtime, and manage a digital wallet — all in one place. Built with React Native (Expo SDK 54), targeting MTN, Airtel, Glo, and 9Mobile.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started (Fresh PC)](#getting-started-fresh-pc)
- [Running the App](#running-the-app)
- [Demo Account](#demo-account)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Buy Data** — purchase data bundles for MTN, Airtel, Glo, and 9Mobile
- **Sell Data** — sell unused data back to DataSwap at 76% of market value; funds hit your wallet instantly
- **Buy Airtime** — top up any Nigerian number
- **Digital Wallet** — fund via card or bank transfer; withdraw to any Nigerian bank account
- **KYC Verification** — CBN-compliant identity verification (BVN + NIN + selfie)
- **Transaction History** — searchable, filterable audit trail
- **Biometric Login** — fingerprint / face ID support via `expo-local-authentication`
- **PIN Security** — 6-digit transaction PIN, bcrypt-hashed, never transmitted in plaintext

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile Framework | React Native 0.79.2 |
| Dev Toolchain | Expo SDK 54 (New Architecture / Fabric) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State Management | React Context API (AuthContext + WalletContext) |
| Icons | `@expo/vector-icons` — Ionicons |
| Local Storage | `expo-secure-store` + `@react-native-async-storage/async-storage` |
| Camera / Picker | `expo-camera`, `expo-image-picker`, `expo-document-picker` |
| Biometrics | `expo-local-authentication` |
| Animations | `react-native-reanimated`, `lottie-react-native` |
| Payments | Paystack |
| KYC | Smile ID / Dojah |
| VTU Provider | VTPass |
| OTP / SMS | Termii |
| Backend | Node.js on AWS ECS + PostgreSQL (RDS) + Redis (ElastiCache) |

---

## Prerequisites

Install these on your machine before anything else.

### 1. Node.js (v18 or higher)

Download from [https://nodejs.org](https://nodejs.org) — choose the **LTS** version.

Verify:
```bash
node -v   # should print v18.x.x or higher
npm -v    # should print 9.x.x or higher
```

### 2. Git

Download from [https://git-scm.com](https://git-scm.com).

Verify:
```bash
git --version
```

### 3. Expo Go (on your phone)

Install **Expo Go** from the App Store or Google Play Store on your Android or iOS device. You'll use it to preview the app live on your phone.

- Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

> Alternatively you can use an Android emulator (Android Studio) or iOS Simulator (Xcode on Mac).

---

## Getting Started (Fresh PC)

Follow these steps in order on a brand-new machine.

### Step 1 — Clone the repository

```bash
git clone https://github.com/betanaijaboi/DataSwap.git
cd DataSwap
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json` into a local `node_modules/` folder. It takes a minute or two on the first run.

### Step 3 — Set up environment variables *(optional for demo)*

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then open `.env` and fill in your keys (see [Environment Variables](#environment-variables)).

> For a quick local demo run, you do **not** need a real backend or any API keys — the app includes mock service responses. Just skip this step and use the [Demo Account](#demo-account).

### Step 4 — Start the development server

```bash
npm start
```

This launches the **Expo Metro bundler**. A QR code will appear in the terminal and a browser window will open at `http://localhost:8081`.

---

## Running the App

### On your physical phone (recommended)

1. Make sure your phone and PC are on the **same Wi-Fi network**.
2. Run `npm start`.
3. Open **Expo Go** on your phone.
4. Scan the QR code shown in the terminal or browser.

The app will bundle and open on your phone within about 30 seconds.

### On an Android emulator

1. Install [Android Studio](https://developer.android.com/studio) and set up an Android Virtual Device (AVD).
2. Start the emulator from Android Studio.
3. Run:
   ```bash
   npm run android
   ```

### On an iOS simulator (macOS only)

1. Install Xcode from the Mac App Store.
2. Run:
   ```bash
   npm run ios
   ```

### In the browser (limited)

React Native web support is partial — navigation and native features won't work fully, but you can inspect basic UI:

```bash
npm run web
```

---

## Demo Account

The app ships with a pre-verified demo account so you can explore all features immediately — **no real BVN or NIN required**.

| Field | Value |
|---|---|
| Phone | `08000000000` |
| Password | `Demo@1234` |
| KYC Status | Verified |
| Starting Balance | ₦12,260 |

On the login screen, tap the **"Use Demo Account"** banner to auto-fill the credentials.

> **Security note:** Real BVN or NIN is never required for testing. All demo and test scenarios use dummy placeholder values only.

---

## Project Structure

```
DataSwap/
├── App.js                        # Entry point
├── app.json                      # Expo config (name, slug, icons, splash)
├── babel.config.js               # Babel config
├── package.json                  # Dependencies and scripts
│
├── assets/
│   ├── icon.png                  # App icon
│   ├── splash.png                # Splash screen
│   ├── adaptive-icon.png         # Android adaptive icon
│   ├── favicon.png               # Web favicon
│   └── networks/
│       ├── mtn.png               # MTN brand logo
│       ├── airtel.png            # Airtel brand logo (white-tinted on red bg)
│       ├── glo.png               # Glo brand logo
│       └── 9mobile.png           # 9Mobile brand logo
│
├── src/
│   ├── components/
│   │   ├── Button.js             # Reusable button (primary / outline / ghost)
│   │   ├── Input.js              # Text input with label, error, left icon
│   │   └── PINInput.js           # 6-dot PIN entry component
│   │
│   ├── context/
│   │   ├── AuthContext.js        # Auth state: login, register, OTP, KYC
│   │   └── WalletContext.js      # Wallet state: balance, transactions, buy/sell
│   │
│   ├── navigation/
│   │   └── AppNavigator.js       # Stack + bottom tab navigator, auth gate
│   │
│   ├── screens/
│   │   ├── OnboardingScreen.js   # First-launch slides
│   │   ├── SuccessScreen.js      # Generic success confirmation screen
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── OTPScreen.js
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   ├── KYCScreen.js
│   │   │   └── PINSetupScreen.js
│   │   └── main/
│   │       ├── HomeScreen.js
│   │       ├── BuyDataScreen.js
│   │       ├── SellDataScreen.js
│   │       ├── BuyAirtimeScreen.js
│   │       ├── FundWalletScreen.js
│   │       ├── WithdrawScreen.js
│   │       ├── TransactionsScreen.js
│   │       └── ProfileScreen.js
│   │
│   ├── services/
│   │   ├── authService.js        # API calls: register, login, OTP, KYC
│   │   └── walletService.js      # API calls: balance, fund, buy, sell, withdraw
│   │
│   └── utils/
│       ├── constants.js          # Colors, sizes, networks, data plans, storage keys
│       ├── formatters.js         # Currency, date, phone formatters + icon name map
│       └── validators.js         # Phone, email, password, BVN, NIN validators
│
├── scripts/
│   └── generate-assets.js        # Asset generation helper
│
└── docs/                         # Full documentation suite (17 files)
    ├── 01_PRD.md
    ├── 02_USER_STORIES.md
    ├── 03_USER_FLOWS.md
    ├── 04_DATABASE_ERD.md
    ├── 05_SYSTEM_ARCHITECTURE.md
    ├── 06_API_DOCUMENTATION.md
    ├── 07_UI_DESIGN.md
    ├── 08_DESIGN_SYSTEM.md
    ├── 09_FUNCTIONAL_REQUIREMENTS.md
    ├── 10_NON_FUNCTIONAL_REQUIREMENTS.md
    ├── 11_SECURITY_REQUIREMENTS.md
    ├── 12_ACCEPTANCE_CRITERIA.md
    ├── 13_PROJECT_ROADMAP.md
    ├── 14_TEST_PLAN.md
    └── 15_DEPLOYMENT_MAINTENANCE.md
```

---

## Documentation

The `docs/` folder contains a complete professional documentation suite:

| # | Document |
|---|----------|
| 01 | [Product Requirements Document](docs/01_PRD.md) |
| 02 | [User Stories](docs/02_USER_STORIES.md) |
| 03 | [User Flows](docs/03_USER_FLOWS.md) |
| 04 | [Database ERD](docs/04_DATABASE_ERD.md) |
| 05 | [System Architecture](docs/05_SYSTEM_ARCHITECTURE.md) |
| 06 | [API Documentation](docs/06_API_DOCUMENTATION.md) |
| 07 | [UI Design](docs/07_UI_DESIGN.md) |
| 08 | [Design System](docs/08_DESIGN_SYSTEM.md) |
| 09 | [Functional Requirements](docs/09_FUNCTIONAL_REQUIREMENTS.md) |
| 10 | [Non-Functional Requirements](docs/10_NON_FUNCTIONAL_REQUIREMENTS.md) |
| 11 | [Security Requirements](docs/11_SECURITY_REQUIREMENTS.md) |
| 12 | [Acceptance Criteria](docs/12_ACCEPTANCE_CRITERIA.md) |
| 13 | [Project Roadmap](docs/13_PROJECT_ROADMAP.md) |
| 14 | [Test Plan](docs/14_TEST_PLAN.md) |
| 15 | [Deployment & Maintenance Plan](docs/15_DEPLOYMENT_MAINTENANCE.md) |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API
API_BASE_URL=https://api.dataswap.ng/v1

# Paystack (get from https://dashboard.paystack.com/#/settings/developer)
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx

# KYC — Smile ID or Dojah
KYC_PARTNER_ID=xxxxxxxx
KYC_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# VTU — VTPass
VTPASS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
VTPASS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# OTP / SMS — Termii (https://termii.com)
TERMII_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

> The app runs fully in demo/mock mode without any of these keys. Real keys are only needed when connecting to a live backend.

---

## Troubleshooting

### `npm install` fails

Make sure you're on Node.js v18 or higher:
```bash
node -v
```
If not, download the LTS from [nodejs.org](https://nodejs.org).

---

### Metro bundler won't start / hangs

Clear the Expo cache and restart:
```bash
npx expo start --clear
```

---

### App won't load on Expo Go — "Network request failed"

Your phone and PC must be on the **same Wi-Fi network**. If you're behind a VPN or a strict router, use tunnel mode:
```bash
npx expo start --tunnel
```
*(requires `npm install -g @expo/ngrok` if prompted)*

---

### `Unable to resolve module` error

Dependencies may not be installed correctly. Delete `node_modules` and reinstall:

**Mac / Linux:**
```bash
rm -rf node_modules
npm install
```

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

---

### Android emulator not detected

Make sure the emulator is fully booted, then verify `adb` can see it:
```bash
adb devices
```
Then run `npm run android` again.

---

### Expo SDK version mismatch warning in Expo Go

Update Expo Go on your phone from the App Store / Play Store, or fix SDK versions automatically:
```bash
npx expo install --fix
```

---

### `EMFILE: too many open files` on Windows

Install `expo-cli` globally and increase the file watcher limit:
```bash
npm install -g expo-cli
```
Or run with the `--max-old-space-size` flag:
```bash
node --max-old-space-size=4096 node_modules/.bin/expo start
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

---

## License

This project is private and proprietary. All rights reserved — **betanaijaboi / DataSwap**.

---

*DataSwap — Phase 1 MVP · Jun 2026*
