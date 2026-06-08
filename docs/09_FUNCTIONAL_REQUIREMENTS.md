# Functional Requirements
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

> **Format:** FR-[MODULE]-[NUMBER] — unique identifier for each requirement.  
> **Priority:** P1 (Critical MVP) | P2 (Post-MVP) | P3 (Phase 2)

---

## MODULE 1: Authentication (FR-AUTH)

### FR-AUTH-001 — User Registration
**Priority:** P1  
The system shall allow new users to register with:
- Full name (2–100 chars, letters and spaces)
- Phone number (valid Nigerian: 07x, 08x, 09x — 11 digits)
- Email address (valid RFC 5322 format)
- Password (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char)
- Password confirmation (must match password)

The system shall reject registration if:
- Phone number is already registered
- Email is already registered
- Any field fails validation

On success, the system shall send a 6-digit OTP to the registered phone number.

---

### FR-AUTH-002 — OTP Verification
**Priority:** P1  
The system shall:
- Generate cryptographically random 6-digit OTPs
- Expire OTPs after 10 minutes
- Allow maximum 3 verification attempts before a 5-minute lockout
- Provide a "Resend Code" option after 60 seconds
- Mark phone as verified on successful OTP entry
- Accept purpose parameter: `phone_verify` or `password_reset`

---

### FR-AUTH-003 — User Login
**Priority:** P1  
The system shall authenticate users via phone number + password.

The system shall:
- Return JWT access token (24-hour expiry) on success
- Return refresh token (30-day expiry) in httpOnly cookie
- Lock account for 15 minutes after 5 consecutive failed attempts
- Track and reset failed attempt counter on success

---

### FR-AUTH-004 — Password Reset
**Priority:** P2  
The system shall allow password reset via:
1. Enter registered phone → receive OTP
2. Verify OTP → receive reset token
3. Enter new password + confirmation → update password

New password must meet the same complexity requirements as registration.

---

### FR-AUTH-005 — PIN Setup
**Priority:** P1  
The system shall:
- Allow users to set a 4-digit numeric PIN on first login
- Require PIN confirmation (enter twice)
- Store PIN as bcrypt hash (never plaintext)
- Allow "skip" with option to set PIN later from Profile
- Require PIN for sensitive wallet actions (withdraw, large purchases)

---

### FR-AUTH-006 — Biometric Authentication
**Priority:** P2  
The system shall:
- Allow users to enable Face ID / fingerprint login
- Check device biometric availability before showing the option
- Use `expo-local-authentication` for biometric challenge
- Store biometric preference in `expo-secure-store` (flag only — no biometric data stored)
- Allow toggling biometric on/off from Profile → Security

---

### FR-AUTH-007 — Session Management
**Priority:** P1  
The system shall:
- Persist authentication state across app restarts using SecureStore
- Automatically refresh access token when expired using refresh token
- Log out user and clear all stored tokens on explicit logout
- Clear session on account lockout

---

## MODULE 2: KYC Verification (FR-KYC)

### FR-KYC-001 — KYC Submission
**Priority:** P1  
The system shall collect the following via a 4-step wizard:

**Step 1 — Personal Info:**
- Full name, Date of birth (must be 18+ years ago), Home address, State

**Step 2 — Documents:**
- BVN (11 digits, required)
- NIN (11 digits, optional)
- Government ID type: National ID | Driver's License | International Passport | Voter's Card
- ID front image (JPG/PNG, max 5MB)
- ID back image (required except Passport)

**Step 3 — Selfie:**
- Front-facing photo capture

**Step 4 — Review & Submit:**
- Display masked BVN/NIN (first 7 digits as `*******`, show last 4)
- NDPR consent checkbox (required before submission)

---

### FR-KYC-002 — KYC Status Management
**Priority:** P1  
The system shall maintain KYC status with 4 states:
- `not_started` — user has not submitted
- `pending` — submitted, awaiting review
- `verified` — approved by admin
- `rejected` — rejected with reason

Status transitions:
- `not_started → pending` (on submission)
- `pending → verified` (admin approves)
- `pending → rejected` (admin rejects)
- `rejected → pending` (user resubmits)

---

### FR-KYC-003 — KYC Status Display
**Priority:** P1  
The system shall:
- Display KYC status badge on Profile screen (colour-coded)
- Show non-blocking KYC prompt banner on Home screen when not verified
- Show rejection reason when status is `rejected`
- Show "1–2 business days" message when status is `pending`
- Block withdrawal feature when KYC is not verified

---

### FR-KYC-004 — Document Storage
**Priority:** P1  
The system shall:
- Store ID images and selfie in private cloud storage (S3)
- Generate signed URLs (1-hour expiry) for admin review
- Never expose raw BVN/NIN in API responses
- Store BVN as SHA-256 hash for uniqueness checking only

---

## MODULE 3: Wallet (FR-WAL)

### FR-WAL-001 — Balance Display
**Priority:** P1  
The system shall:
- Display wallet balance in Nigerian Naira (₦) format with 2 decimal places
- Show balance on Home screen header card
- Provide show/hide balance toggle (eye icon)
- Update balance in real-time after each successful transaction
- Support pull-to-refresh to re-fetch balance

---

### FR-WAL-002 — Fund via Card
**Priority:** P1  
The system shall:
- Accept Visa, Mastercard, and Verve debit/credit cards
- Process payments via Paystack
- Enforce minimum ₦100, maximum ₦2,000,000 per transaction
- Display quick-select amount chips: ₦500, ₦1,000, ₦2,000, ₦5,000, ₦10,000, ₦20,000
- Allow custom amount entry
- Credit wallet immediately on Paystack webhook `charge.success`
- Show success screen with funded amount and new balance on completion

---

### FR-WAL-003 — Fund via Bank Transfer
**Priority:** P1  
The system shall:
- Assign a unique Paystack virtual account number per user
- Credit wallet within 1–5 minutes of successful bank transfer
- Display virtual account details and amount on screen during flow

---

### FR-WAL-004 — Fund via USSD
**Priority:** P2  
The system shall:
- Display USSD codes for major Nigerian banks (*737#, *901#, *822#, etc.)
- Pre-fill amount in USSD string where supported
- Credit wallet after USSD confirmation webhook

---

### FR-WAL-005 — Withdrawal
**Priority:** P1  
The system shall:
- Require KYC verification before any withdrawal
- Enforce minimum withdrawal of ₦500
- Display Nigerian banks list (40+ banks) for selection
- Verify account name via Paystack account lookup API before processing
- Calculate and display processing fee (1% of amount, capped at ₦50)
- Debit wallet balance immediately on confirmation
- Process payout via Paystack Transfers API
- Show estimated arrival: "Within 24 business hours"

---

### FR-WAL-006 — Transaction Recording
**Priority:** P1  
Every wallet movement shall create a transaction record containing:
- Unique transaction ID (ULID)
- Transaction type
- Amount and fee
- Balance snapshot before/after
- Status
- Timestamp
- Reference number
- Relevant metadata (recipient phone, network, bank details)

---

### FR-WAL-007 — Transaction History
**Priority:** P1  
The system shall:
- Display paginated transaction list (20 per page)
- Support filtering by type: All | Data | Airtime | Sold | Funded | Withdrawn
- Show for each item: icon, type, description, date/time, amount, status badge
- Display credits in green (#10B981), debits in default text color
- Support pull-to-refresh

---

## MODULE 4: Data Marketplace (FR-DATA)

### FR-DATA-001 — Data Plan Catalogue
**Priority:** P1  
The system shall:
- Display data plans for MTN, Airtel, Glo, and 9Mobile
- Show for each plan: name/size, duration, price
- Indicate popular plans
- Cache plan list for 5 minutes to reduce API calls

---

### FR-DATA-002 — Buy Data
**Priority:** P1  
The system shall:
- Guide user through: Network selection → Plan selection → Recipient phone + Confirm
- Validate recipient phone as valid Nigerian number
- Perform balance check before confirmation
- Check inventory before deducting balance
- Fulfil from company inventory first, falling back to VTU API
- Reverse wallet deduction if delivery fails
- Show success screen with delivery confirmation

---

### FR-DATA-003 — Sell Data
**Priority:** P1  
The system shall:
- Display payout rate (76% of market price) upfront on rate banner
- Show market value vs payout side-by-side for each plan
- Provide quantity selector (1–100 units)
- Calculate live payout as quantity changes
- Require confirmation dialog before processing
- Credit wallet immediately on confirmation
- Add sold units to company inventory

---

## MODULE 5: Airtime (FR-AIR)

### FR-AIR-001 — Buy Airtime
**Priority:** P1  
The system shall:
- Support all 4 major networks: MTN, Airtel, Glo, 9Mobile
- Accept recipient phone (validated Nigerian)
- Display amount chips: ₦50, ₦100, ₦200, ₦500, ₦1,000, ₦2,000, ₦5,000
- Accept custom amount: min ₦50, max ₦50,000
- Perform balance check before processing
- Show success confirmation after delivery

---

## MODULE 6: Profile & Settings (FR-PROF)

### FR-PROF-001 — Profile Display
**Priority:** P1  
The system shall display:
- User avatar (initials-based, first letter of first + last name)
- Full name and phone number
- KYC status badge (colour-coded)

---

### FR-PROF-002 — Logout
**Priority:** P1  
The system shall:
- Show "Log Out" option in Profile
- Display confirmation dialog before logout
- Clear JWT tokens and biometric flags from SecureStore
- Navigate to Login screen

---

### FR-PROF-003 — Change PIN
**Priority:** P2  
The system shall allow PIN change by:
1. Verifying current PIN
2. Entering new PIN + confirmation
3. Rejecting if new PIN matches old PIN

---

### FR-PROF-004 — Biometric Toggle
**Priority:** P2  
The system shall allow enabling/disabling biometric login from Profile → Security section.

---

## MODULE 7: Navigation (FR-NAV)

### FR-NAV-001 — Auth Guard
**Priority:** P1  
The system shall:
- Redirect unauthenticated users to Login/Onboarding
- Redirect authenticated users away from auth screens
- Show Onboarding only on first app launch (flag in AsyncStorage)

---

### FR-NAV-002 — Bottom Tab Navigation
**Priority:** P1  
The system shall provide bottom tab navigation with 4 tabs:
- Home (🏠)
- Data (📡)
- Airtime (📲)
- Profile (👤)

Active tab highlighted with primary blue color.

---

### FR-NAV-003 — Deep Linking
**Priority:** P3  
The system shall support deep links for:
- `dataswap://fund` → Fund Wallet screen
- `dataswap://kyc` → KYC screen
- `dataswap://transactions` → Transactions screen

---

## MODULE 8: Notifications (FR-NOTIF)

### FR-NOTIF-001 — Push Notifications
**Priority:** P2  
The system shall send push notifications for:
- Wallet funded: "₦5,000 added to your DataSwap wallet"
- Data purchase: "MTN 5GB delivered to 08012345678"
- Data sale: "₦760 credited for your data sale"
- Withdrawal: "₦4,950 withdrawal initiated"
- KYC approved: "Identity verified! Full access unlocked"
- KYC rejected: "KYC review: action required"

---

## Summary Table

| Module | FR Count | P1 | P2 | P3 |
|--------|----------|----|----|-----|
| Auth | 7 | 5 | 2 | 0 |
| KYC | 4 | 4 | 0 | 0 |
| Wallet | 7 | 6 | 1 | 0 |
| Data | 3 | 3 | 0 | 0 |
| Airtime | 1 | 1 | 0 | 0 |
| Profile | 4 | 2 | 2 | 0 |
| Navigation | 3 | 2 | 0 | 1 |
| Notifications | 1 | 0 | 1 | 0 |
| **Total** | **30** | **23** | **6** | **1** |
