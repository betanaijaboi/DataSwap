# Software Requirements Specification (SRS)
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0.0  
**Date:** June 2026  
**Status:** Draft

---

## Table of Contents
1. Introduction
2. Overall Description
3. User Classes & Characteristics
4. Functional Requirements
5. Non-Functional Requirements
6. System Architecture
7. Data Models
8. API Specification
9. Security Requirements
10. KYC & Compliance
11. Wallet & Financial Logic
12. Error Handling
13. Future Scope
14. Glossary

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for **DataSwap**, a mobile application that enables Nigerian users to buy and sell mobile data plans and airtime across all major networks (MTN, Airtel, Glo, 9Mobile), with an integrated digital wallet for real-money transactions.

### 1.2 Scope
DataSwap is a peer-assisted marketplace where:
- **Sellers** offload unused data plans in exchange for wallet credits
- **The Company** holds purchased inventory and fulfils buyer orders
- **Buyers** purchase data plans and airtime at competitive rates via a secured wallet

The application covers:
- User registration, authentication, and KYC verification
- Wallet funding (card, bank transfer, USSD) and withdrawal (bank transfer)
- Data plan purchase and sale
- Airtime purchase
- Transaction history
- Security (PIN, biometric, encrypted storage)

### 1.3 Definitions
| Term | Definition |
|------|------------|
| BVN | Bank Verification Number — CBN-mandated 11-digit unique identifier |
| NIN | National Identification Number — NIMC-issued 11-digit identifier |
| KYC | Know Your Customer — identity verification process |
| NUBAN | Nigerian Uniform Bank Account Number — standard 10-digit account format |
| NDPR | Nigeria Data Protection Regulation |
| CBN | Central Bank of Nigeria |
| Wallet | In-app stored-value account denominated in Naira (₦) |
| Inventory | Company-held pool of data plans purchased from sellers |
| Sell Rate | Percentage of market price paid to sellers (currently 76%) |

### 1.4 References
- CBN Guidelines on Mobile Money Services
- Nigeria Data Protection Regulation (NDPR) 2019
- NIMC NIN Verification Standards
- Paystack API Documentation (payment gateway)

---

## 2. Overall Description

### 2.1 Product Perspective
DataSwap is a standalone mobile application (React Native / Expo) that communicates with a backend API. The current implementation uses in-memory mock services; production deployment requires a Node.js/Python backend with PostgreSQL/MongoDB.

### 2.2 Product Functions (Summary)
| # | Function |
|---|----------|
| F1 | User registration with phone OTP verification |
| F2 | KYC submission (BVN, NIN, government ID, selfie) |
| F3 | Secure PIN setup and biometric authentication |
| F4 | Wallet funding via card, bank transfer, USSD |
| F5 | Wallet withdrawal to bank account (NUBAN verified) |
| F6 | Data plan purchase for any Nigerian network |
| F7 | Airtime purchase for any Nigerian network |
| F8 | Data plan sale to company inventory |
| F9 | Transaction history with filtering |
| F10 | Profile management |

### 2.3 Operating Environment
- **Platform:** iOS 14+ and Android 10+ (via Expo SDK 54)
- **Architecture:** React Native 0.79.2, React 19, New Architecture (Fabric)
- **Connectivity:** Requires internet for all transactions; displays last-known balance offline
- **Permissions:** Camera, Photo Library, Biometric sensor

### 2.4 Constraints
- All financial transactions must comply with CBN regulations
- KYC is mandatory for transactions above ₦50,000 cumulative monthly
- Biometric authentication requires enrolled hardware (Face ID / fingerprint)
- Minimum withdrawal: ₦500. Maximum single transaction: ₦2,000,000

---

## 3. User Classes & Characteristics

### 3.1 Unregistered User
- Can view onboarding slides
- Can access login and registration screens
- Cannot access wallet or marketplace

### 3.2 Registered (Unverified) User
- Phone verified, KYC not submitted or pending
- Can fund wallet and buy data/airtime with daily limits
- Cannot withdraw funds until KYC is verified

### 3.3 KYC-Verified User
- Full access to all features
- Higher transaction limits
- Can sell data to company inventory
- Can withdraw to bank account

### 3.4 Admin (Future Scope)
- Approve / reject KYC submissions
- Manage data inventory and pricing
- View all user transactions and flag suspicious activity

---

## 4. Functional Requirements

### 4.1 Authentication Module

#### FR-A01: User Registration
- **Input:** Full name, phone number, email, password, confirm password
- **Process:** Validate inputs → Create account → Send OTP to phone
- **Output:** Navigate to OTP verification screen
- **Validation:**
  - Full name: min 2 chars, letters/spaces/hyphens only
  - Phone: valid Nigerian number (07x, 08x, 09x, 11 digits)
  - Email: valid format
  - Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  - Passwords must match
  - Phone must not already be registered

#### FR-A02: OTP Verification
- **Input:** 6-digit OTP (received via SMS)
- **Process:** Validate OTP against stored value with 10-minute expiry
- **Output:** Mark phone as verified → Navigate to KYC
- **Dev Mode:** OTP `123456` accepted for any number

#### FR-A03: OTP Resend
- User can request OTP resend after 60-second cooldown
- New OTP invalidates old OTP

#### FR-A04: User Login
- **Input:** Phone number + password
- **Process:** Validate credentials → Generate session token → Store token in SecureStore
- **Output:** Navigate to PIN Setup (first time) or Main App
- **Error Cases:** Account not found, wrong password, unverified phone

#### FR-A05: PIN Setup
- User creates a 4-digit numeric PIN
- PIN entered twice for confirmation
- PIN hash stored in SecureStore
- User can optionally enable biometric login after PIN setup
- "Set up later" option available

#### FR-A06: Biometric Authentication
- Checks device hardware and enrolled biometrics
- Uses expo-local-authentication for Face ID / fingerprint
- On success: navigates directly to Main App
- Falls back to PIN if biometric fails

#### FR-A07: Password Reset
- **Flow:** Enter phone → Receive reset OTP → Enter OTP + new password
- OTP expires in 10 minutes

#### FR-A08: Logout
- Clears token from SecureStore
- Clears user data from AsyncStorage
- Navigates to Login screen

---

### 4.2 KYC Module

#### FR-K01: KYC Submission (4-step wizard)
**Step 1 — Personal Info:**
- BVN (required): 11 digits
- NIN (optional): 11 digits
- Date of Birth (required): user must be 18+
- Residential Address (required): min 10 characters

**Step 2 — Document Upload:**
- Select document type: National ID, International Passport, Driver's License, Voter's Card
- Upload front image (required): camera or gallery
- Upload back image (optional, not for passport)
- Images captured via expo-image-picker or expo-camera

**Step 3 — Selfie:**
- Take or upload selfie
- Guidance: no sunglasses, plain background, good lighting

**Step 4 — Review & Submit:**
- Display all entered data (BVN/NIN masked)
- NDPR consent checkbox required
- Submit to backend for manual/automated review

#### FR-K02: KYC Status
- **not_started:** user has not begun KYC
- **pending:** submitted, awaiting review (1–2 business days)
- **verified:** approved, full account access
- **rejected:** declined, user can re-submit

#### FR-K03: KYC Status Display
- Home screen shows banner for unverified users
- Profile screen shows KYC badge with status colour
- Pending: yellow/amber; Verified: green; Rejected: red

---

### 4.3 Wallet Module

#### FR-W01: View Balance
- Real-time balance displayed on Home screen
- Toggle balance visibility (show/hide)
- Pull-to-refresh to fetch latest balance

#### FR-W02: Fund Wallet
- **Payment Methods:**
  - Debit/Credit Card (Visa, Mastercard, Verve via Paystack)
  - Bank Transfer (Paystack virtual account)
  - USSD (*737#, *901#, etc.)
- **Minimum:** ₦100
- **Maximum:** ₦2,000,000 per transaction
- Quick amount presets: ₦500, ₦1,000, ₦2,000, ₦5,000, ₦10,000, ₦20,000

#### FR-W03: Withdraw to Bank
- Input: amount, bank name, 10-digit NUBAN account number
- Bank list fetched from Paystack banks API (40+ Nigerian banks)
- Account name auto-verified via Paystack account lookup
- Processing fee: 1% capped at ₦50
- Minimum withdrawal: ₦500
- Maximum: full available balance
- Confirmation dialog before processing
- Processing time: within 24 business hours

#### FR-W04: Transaction History
- Paginated list of all transactions (20 per page)
- Filter by type: All, Data, Airtime, Sold, Funded, Withdrawn
- Each entry shows: type icon, description, date, amount, status badge

---

### 4.4 Data Marketplace Module

#### FR-D01: Buy Data Plan
- Step 1: Select network (MTN, Airtel, Glo, 9Mobile)
- Step 2: Select plan (size, duration, price)
- Step 3: Enter recipient phone number + confirm order
- Checks wallet balance before processing
- If company inventory has the plan → fulfilled from inventory
- Else → direct top-up (API call to telco)
- Success screen with transaction details

#### FR-D02: Sell Data Plan
- Step 1: Select network
- Step 2: Select plan to sell
- Step 3: Set quantity (1–100), view payout calculation
- Payout = `plan.sellPrice × quantity` (76% of market price)
- Confirmation dialog
- On success: credit wallet, add to company inventory

#### FR-D03: Data Plan Pricing
| Network | Plan | Market Price | Sell Price |
|---------|------|-------------|------------|
| MTN | 100MB (1 day) | ₦100 | ₦70 |
| MTN | 500MB (7 days) | ₦200 | ₦150 |
| MTN | 1GB (30 days) | ₦300 | ₦230 |
| MTN | 2GB (30 days) | ₦500 | ₦380 |
| MTN | 5GB (30 days) | ₦1,000 | ₦760 |
| MTN | 10GB (30 days) | ₦2,000 | ₦1,500 |
| MTN | 20GB (30 days) | ₦3,500 | ₦2,600 |
| Airtel | 1GB–10GB | Same as MTN | Same as MTN |
| Glo | 1GB | ₦250 | ₦190 |
| 9Mobile | 1GB–5GB | ₦300–₦1,000 | Proportional |

#### FR-D05: Buy Airtime
- Select network
- Enter recipient phone number
- Select quick amount or enter custom (₦50 – ₦50,000)
- Checks wallet balance
- Success screen

---

### 4.5 Profile Module

#### FR-P01: View Profile
- Display: avatar (initials), full name, phone, KYC status badge
- Display wallet balance summary

#### FR-P02: Biometric Toggle
- Enable / disable biometric login from profile
- Re-prompts biometric confirmation on enable

#### FR-P03: Logout
- Confirmation dialog
- Clears all local session data

---

## 5. Non-Functional Requirements

### 5.1 Performance
| Metric | Requirement |
|--------|-------------|
| App launch to usable | < 3 seconds |
| Transaction processing (mock) | < 2 seconds |
| Balance refresh | < 1 second |
| Screen transitions | 60 FPS (native stack) |
| Image upload compression | ≤ 80% quality (JPEG) |

### 5.2 Security
- Auth tokens stored in `expo-secure-store` (hardware-backed keychain/keystore)
- PIN stored as hash (production: bcrypt, not plain)
- All API communication: HTTPS/TLS 1.3
- SecureStore key names: alphanumeric + `.`, `-`, `_` only (no `@`)
- Biometric auth via device hardware (not stored in app)
- Session timeout: 30 days of inactivity
- Max login attempts: 5 before 15-minute lockout

### 5.3 Usability
- WCAG 2.1 AA contrast ratios on all text
- All interactive elements min 44×44pt touch targets
- Error messages in plain English (no technical codes)
- Loading states on all async operations
- Offline: show cached balance, disable transaction buttons

### 5.4 Reliability
- Transaction idempotency keys to prevent duplicate charges
- All financial operations atomic (all-or-nothing)
- Local transaction log for reconciliation

### 5.5 Scalability
- Stateless API design (JWT tokens)
- Wallet service horizontally scalable
- KYC processor queue-based (handle spikes)

### 5.6 Accessibility
- Screen reader compatible (accessibilityLabel on all interactive elements)
- Supports OS-level font size scaling
- Minimum contrast ratio: 4.5:1

---

## 6. System Architecture

```
┌──────────────────────────────────────────┐
│            React Native App              │
│  ┌──────────┐  ┌───────────────────────┐ │
│  │ Auth     │  │  Navigation           │ │
│  │ Context  │  │  (Native Stack +      │ │
│  ├──────────┤  │   Bottom Tabs)        │ │
│  │ Wallet   │  └───────────────────────┘ │
│  │ Context  │                            │
│  └──────────┘                            │
│  ┌──────────────────────────────────────┐│
│  │              Screens                 ││
│  │  Auth: Login | Register | OTP | KYC  ││
│  │  Main: Home | Buy | Sell | History   ││
│  │         FundWallet | Withdraw        ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │            Services Layer            ││
│  │   authService  |  walletService      ││
│  └──────────────────────────────────────┘│
│  ┌────────────────┐  ┌─────────────────┐ │
│  │  SecureStore   │  │  AsyncStorage   │ │
│  │  (token, PIN)  │  │  (user data,    │ │
│  │                │  │   preferences)  │ │
│  └────────────────┘  └─────────────────┘ │
└────────────────────┬─────────────────────┘
                     │ HTTPS
          ┌──────────▼──────────┐
          │    Backend API      │
          │   (Node.js/Express) │
          ├─────────────────────┤
          │   PostgreSQL DB     │
          │   Redis Cache       │
          │   File Storage (S3) │
          └──────────┬──────────┘
                     │
         ┌───────────▼────────────┐
         │   Third-Party APIs     │
         │  Paystack (payments)   │
         │  NIMC (NIN verify)     │
         │  Telco APIs (data)     │
         └────────────────────────┘
```

---

## 7. Data Models

### 7.1 User
```
User {
  id:              String (UUID)
  phone:           String (unique, 11 digits)
  email:           String (unique)
  fullName:        String
  passwordHash:    String (bcrypt)
  kycStatus:       Enum (not_started | pending | verified | rejected)
  isPhoneVerified: Boolean
  bvn:             String (encrypted)
  nin:             String (encrypted, nullable)
  createdAt:       DateTime
  updatedAt:       DateTime
}
```

### 7.2 Wallet
```
Wallet {
  id:        String (UUID)
  userId:    String (FK → User)
  balance:   Decimal (Naira, 2dp)
  currency:  String (default: NGN)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 7.3 Transaction
```
Transaction {
  id:          String (UUID)
  walletId:    String (FK → Wallet)
  type:        Enum (buy_data | buy_airtime | sell_data | fund_wallet | withdraw | transfer)
  amount:      Decimal (positive = credit, negative = debit)
  description: String
  status:      Enum (pending | success | failed | reversed)
  network:     String (nullable)
  phone:       String (nullable)
  planId:      String (nullable)
  quantity:    Integer (nullable)
  source:      Enum (inventory | direct, nullable)
  reference:   String (payment gateway ref)
  createdAt:   DateTime
}
```

### 7.4 KYCSubmission
```
KYCSubmission {
  id:            String (UUID)
  userId:        String (FK → User)
  bvnHash:       String (hashed for verification)
  ninHash:       String (nullable)
  dateOfBirth:   Date
  address:       String
  docType:       Enum (nin | passport | drivers | voters)
  frontImageUrl: String (S3 path)
  backImageUrl:  String (nullable)
  selfieUrl:     String
  status:        Enum (pending | verified | rejected)
  reviewedBy:    String (nullable, admin ID)
  reviewNote:    String (nullable)
  submittedAt:   DateTime
  reviewedAt:    DateTime (nullable)
}
```

### 7.5 DataInventory
```
DataInventory {
  id:        String (UUID)
  planId:    String
  network:   String
  quantity:  Integer
  unitCost:  Decimal (what company paid)
  listedAt:  DateTime
  updatedAt: DateTime
}
```

---

## 8. API Specification

### 8.1 Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/verify-otp` | Verify phone OTP |
| POST | `/auth/resend-otp` | Resend OTP |
| POST | `/auth/login` | Login with phone + password |
| POST | `/auth/forgot-password` | Request reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |
| POST | `/auth/logout` | Invalidate session token |

### 8.2 KYC Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/kyc/submit` | Submit KYC documents |
| GET | `/kyc/status` | Get KYC status |

### 8.3 Wallet Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet/balance` | Get wallet balance |
| POST | `/wallet/fund` | Initiate wallet funding |
| POST | `/wallet/withdraw` | Initiate withdrawal |
| GET | `/wallet/transactions` | Paginated transaction list |
| GET | `/wallet/banks` | List Nigerian banks |
| POST | `/wallet/verify-account` | Verify NUBAN account |

### 8.4 Marketplace Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/plans` | List all data plans by network |
| POST | `/data/buy` | Purchase data plan |
| POST | `/data/sell` | Sell data plan |
| POST | `/airtime/buy` | Purchase airtime |
| GET | `/inventory` | View company inventory |

### 8.5 Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

{
  "success": false,
  "error": "Error message for user",
  "code": "ERROR_CODE"
}
```

### 8.6 Authentication Header
```
Authorization: Bearer <jwt_token>
```

---

## 9. Security Requirements

### 9.1 Data Storage
| Data | Storage | Notes |
|------|---------|-------|
| Auth token | expo-secure-store | Hardware-backed |
| PIN hash | expo-secure-store | Hardware-backed |
| User profile | AsyncStorage | Non-sensitive |
| Biometric flag | AsyncStorage | Flag only, not biometric data |
| BVN / NIN | Backend (encrypted) | AES-256, never stored on device |
| KYC images | AWS S3 (private bucket) | Signed URLs, auto-delete after review |

### 9.2 SecureStore Key Naming
All SecureStore keys must match: `[a-zA-Z0-9._-]+`
- `dataswap_auth_token`
- `dataswap_pin_hash`
- `dataswap_user_data` (migrated to AsyncStorage)
- `dataswap_biometric`
- `dataswap_onboarding`

### 9.3 Network Security
- All API calls over HTTPS with certificate pinning (production)
- TLS 1.3 minimum
- JWT tokens expire after 30 days; refresh on each request
- Rate limiting: 5 failed logins → 15-minute lockout
- OTP rate limit: max 3 resends per 24 hours per phone

### 9.4 Transaction Security
- Every financial transaction requires PIN verification
- Biometric can substitute PIN if enabled
- Idempotency keys prevent duplicate transactions
- Amount validation server-side (never trust client)

---

## 10. KYC & Compliance

### 10.1 CBN Tiered KYC Framework
| Tier | Requirements | Limits |
|------|-------------|--------|
| Tier 0 (Unverified) | Phone verified only | ₦50k/month, no withdrawal |
| Tier 1 (Basic KYC) | BVN + phone | ₦300k balance, ₦200k/month |
| Tier 2 (Full KYC) | BVN + NIN + ID + selfie | ₦5M balance, ₦2M/month |

### 10.2 BVN Verification Process
1. User enters 11-digit BVN
2. App sends BVN to backend (encrypted in transit)
3. Backend queries CBN NIBSS BVN API
4. Returns: name match, DOB match (boolean only — BVN never returned to app)
5. On mismatch: user notified, submission rejected

### 10.3 NIN Verification Process
1. Optional but recommended
2. Backend queries NIMC API via licensed gateway
3. Returns: NIN validity flag
4. NIN stored as irreversible hash on backend

### 10.4 Document Verification
- Images transmitted to backend, stored in private S3 bucket
- Manual review by compliance team (or Smile ID / Youverify API in production)
- Review SLA: 1–2 business days
- On rejection: user notified via push notification with reason
- User may resubmit after correction

### 10.5 Data Retention (NDPR)
- KYC images: retained for 5 years (regulatory requirement), then deleted
- Transaction records: retained for 7 years (CBN requirement)
- User account data: retained for 2 years after account closure
- Right to erasure: applicable to non-financial personal data only

---

## 11. Wallet & Financial Logic

### 11.1 Balance Consistency
```
Balance = Σ(all successful credit transactions)
        - Σ(all successful debit transactions)
        
Where:
  Credits: fund_wallet, sell_data
  Debits:  buy_data, buy_airtime, withdraw
```

### 11.2 Data Sell Rate Calculation
```
payout = plan.sellPrice × quantity

Where plan.sellPrice = plan.price × SELL_RATE (0.76)

Example: Sell 2× MTN 5GB
  payout = 760 × 2 = ₦1,520
  (market value would be ₦2,000 → company margin: ₦480)
```

### 11.3 Withdrawal Fee Structure
```
fee = min(amount × 0.01, 50)  // 1%, capped at ₦50
you_receive = amount - fee

Example: Withdraw ₦5,000
  fee = min(50, 50) = ₦50
  you_receive = ₦4,950
```

### 11.4 Inventory Fulfilment Priority
```
When a user buys a data plan:
  1. Check company inventory for matching planId + quantity > 0
  2. If available: decrement inventory, fulfil from inventory (cheaper cost base)
  3. If not available: direct API call to telco (higher cost)
  
This allows the company to profit from data resale margin.
```

### 11.5 Company Revenue Model
```
Revenue Streams:
  1. Buy-Sell Spread: Buy at 76%, sell at market price = 24% margin
  2. Withdrawal Fee: 1% capped at ₦50
  3. Future: Premium subscriptions, bulk data deals
```

---

## 12. Error Handling

### 12.1 Network Errors
- All API calls wrapped in try/catch
- User-facing message: "Network error. Check your connection."
- Retry button on fetch failures
- No raw error codes or stack traces shown to user

### 12.2 Validation Errors
- Inline field-level errors on forms (shown below each input)
- Red border + error icon on invalid fields
- Error clears on field change

### 12.3 Transaction Failures
- "Purchase Failed" alert with backend error message
- Wallet balance rolled back atomically on failure
- Reference number shown for support queries

### 12.4 Authentication Errors
- "Account not found": redirect to Register
- "Wrong password": show error, 5 attempts before lockout
- "Session expired": redirect to Login with message

---

## 13. Future Scope

| Feature | Priority | Notes |
|---------|----------|-------|
| Push Notifications | High | Transaction alerts, KYC status |
| Referral Program | High | Earn wallet credit for referrals |
| Data Gifting | Medium | Send data to contacts |
| Bill Payments | Medium | Electricity, cable TV, internet |
| Bulk Data Purchase (B2B) | Medium | For resellers |
| Admin Dashboard | High | Web portal for KYC review, inventory management |
| Auto-Sell Schedule | Low | Schedule recurring data sells |
| Data Usage Tracker | Low | Monitor data consumption |
| Loyalty Points | Low | Rewards for frequent buyers |
| Crypto Wallet Option | Low | Fund via USDT (if CBN permits) |

---

## 14. Glossary

| Term | Meaning |
|------|---------|
| Fabric | React Native's new rendering engine (used in SDK 54) |
| JSI | JavaScript Interface — new RN bridge |
| TurboModules | New native module system in RN 0.79+ |
| SecureStore | expo-secure-store — hardware-backed encrypted key-value storage |
| AsyncStorage | @react-native-async-storage — unencrypted persistent storage |
| NIBSS | Nigeria Inter-Bank Settlement System |
| NIMC | National Identity Management Commission |
| Paystack | Nigerian payment gateway used for card/transfer/USSD payments |
| Smile ID | African KYC verification service (future integration) |
| Youverify | Nigerian KYC/AML verification service (future integration) |

---

*Document maintained by DataSwap Engineering Team.*  
*Next review date: September 2026*
