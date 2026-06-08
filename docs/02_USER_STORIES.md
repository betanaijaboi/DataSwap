# User Stories & Use Cases
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

---

## Story Format
> **As a** [user type], **I want to** [action], **so that** [benefit/goal].  
> **Acceptance Criteria:** Bulleted list of conditions that must be true.  
> **Priority:** Must Have / Should Have / Could Have

---

## EPIC 1: Authentication & Onboarding

### US-001 — View Onboarding Slides
**As a** first-time user, **I want to** see an introduction to DataSwap's features, **so that** I understand what the app does before signing up.
- AC: Three slides shown on first launch (Fund Wallet, Buy Data, Sell Data)
- AC: User can skip onboarding at any time
- AC: Onboarding is shown only once; subsequent launches go directly to Login
- **Priority:** Must Have

---

### US-002 — Create Account
**As a** new user, **I want to** register with my phone number, email, and password, **so that** I can create a DataSwap account.
- AC: Full name (min 2 chars, letters only), phone (valid Nigerian), email, password (8+ chars, uppercase, lowercase, number, special), and confirm password are required
- AC: Phone number must not already be registered
- AC: Passwords must match
- AC: On success, OTP is sent to phone and user is taken to OTP screen
- AC: Form shows inline validation errors in real-time
- **Priority:** Must Have

---

### US-003 — Verify Phone Number
**As a** new user, **I want to** verify my phone number via OTP, **so that** DataSwap knows I own the phone number I registered with.
- AC: 6-digit OTP sent via SMS to registered number
- AC: OTP valid for 10 minutes
- AC: Incorrect OTP shows error "Invalid OTP. Please try again."
- AC: Expired OTP shows error with option to resend
- AC: After 3 failed attempts, user must wait 5 minutes before retrying
- AC: "Resend Code" available after 60-second countdown
- AC: On success, user proceeds to KYC
- **Priority:** Must Have

---

### US-004 — Log In
**As a** registered user, **I want to** log in with my phone number and password, **so that** I can access my DataSwap account.
- AC: Phone + password required
- AC: "Account not found" if phone not registered
- AC: "Incorrect password" if password wrong
- AC: After 5 failed attempts, account locked for 15 minutes
- AC: On success, navigate to PIN Setup (first login) or Main App
- AC: "Forgot Password?" link visible on login screen
- **Priority:** Must Have

---

### US-005 — Reset Forgotten Password
**As a** user who forgot their password, **I want to** reset it via OTP, **so that** I can regain access to my account.
- AC: User enters registered phone number
- AC: OTP sent to phone
- AC: User enters OTP + new password + confirm password
- AC: New password must meet complexity requirements
- AC: On success, show "Password reset. Please log in." and redirect to Login
- **Priority:** Should Have

---

### US-006 — Set Up Transaction PIN
**As a** newly logged-in user, **I want to** create a 4-digit PIN, **so that** my wallet transactions are protected.
- AC: PIN is 4 numeric digits
- AC: User enters PIN twice for confirmation
- AC: Mismatch shows error and resets both entries
- AC: Option to "Set up later" available
- AC: PIN stored securely (hashed in device's hardware keychain)
- **Priority:** Must Have

---

### US-007 — Enable Biometric Login
**As a** user, **I want to** enable Face ID / fingerprint login, **so that** I can access the app faster without typing my password.
- AC: Option presented after PIN setup
- AC: Device must have enrolled biometrics (fingerprint or Face ID)
- AC: If device has no biometrics, feature is hidden/disabled
- AC: Biometric flag stored in local storage; actual biometric data never leaves device
- AC: Can be toggled on/off from Profile → Security
- **Priority:** Should Have

---

### US-008 — Log Out
**As a** user, **I want to** log out of DataSwap, **so that** others cannot access my account on my device.
- AC: "Log Out" in Profile screen, under destructive section
- AC: Confirmation dialog before logout ("Are you sure?")
- AC: On confirm, token cleared from SecureStore, navigate to Login
- **Priority:** Must Have

---

## EPIC 2: KYC Verification

### US-009 — Submit KYC
**As a** registered user, **I want to** complete identity verification, **so that** I can access full wallet features and higher transaction limits.
- AC: 4-step wizard: Personal Info → Documents → Selfie → Review
- AC: BVN (11 digits) required; NIN (11 digits) optional
- AC: User must be 18+ (validated via date of birth)
- AC: At least one government ID type must be selected
- AC: Front image of ID is required; back image required except for passport
- AC: Selfie required
- AC: User must consent to NDPR data processing before submitting
- AC: BVN and NIN displayed as masked (****XXXX) in review step
- AC: On submit, status changes to "pending" and user sees KYC pending screen
- **Priority:** Must Have

---

### US-010 — View KYC Status
**As a** user, **I want to** see my KYC verification status, **so that** I know if I'm verified or need to take action.
- AC: Status displayed as badge on Profile screen (Not Started / Pending / Verified / Rejected)
- AC: Colour-coded: grey (not started), amber (pending), green (verified), red (rejected)
- AC: Home screen shows banner if KYC not verified, with CTA to complete
- AC: Pending banner shows "1–2 business days" message without action link
- **Priority:** Must Have

---

### US-011 — Re-submit Rejected KYC
**As a** user whose KYC was rejected, **I want to** re-submit with corrected documents, **so that** I can get verified and unlock full features.
- AC: Rejection reason shown to user (e.g., "ID image is blurry")
- AC: KYC wizard available again on rejection
- AC: Previous submission data pre-filled where allowed (non-sensitive fields only)
- **Priority:** Must Have

---

## EPIC 3: Wallet

### US-012 — View Wallet Balance
**As a** verified user, **I want to** see my wallet balance on the Home screen, **so that** I know how much money I have available.
- AC: Balance shown in large text on Home screen header
- AC: Toggle to show/hide balance (eye icon)
- AC: Pull-to-refresh updates balance
- AC: Balance updates immediately after successful transactions
- **Priority:** Must Have

---

### US-013 — Fund Wallet via Card
**As a** user, **I want to** add money to my DataSwap wallet using my debit/credit card, **so that** I can buy data and airtime.
- AC: Supported: Visa, Mastercard, Verve
- AC: Minimum: ₦100. Maximum: ₦2,000,000 per transaction
- AC: Quick presets: ₦500, ₦1,000, ₦2,000, ₦5,000, ₦10,000, ₦20,000
- AC: Custom amount input available
- AC: Payment processed via Paystack
- AC: On success, wallet balance updated instantly + success screen shown
- AC: Failed payment shows error with retry option
- **Priority:** Must Have

---

### US-014 — Fund Wallet via Bank Transfer
**As a** user, **I want to** fund my wallet via bank transfer, **so that** I can use my existing bank without a card.
- AC: Paystack generates unique virtual account number per user
- AC: Amount credited within 1–5 minutes of transfer confirmation
- AC: Minimum ₦100, maximum ₦2,000,000
- **Priority:** Must Have

---

### US-015 — Fund Wallet via USSD
**As a** user, **I want to** fund my wallet using USSD, **so that** I can top up even with a basic phone or poor internet.
- AC: Supports major Nigerian banks (*737#, *901#, *822#, etc.)
- AC: USSD code displayed with amount pre-filled
- AC: Amount credited after USSD confirmation
- **Priority:** Should Have

---

### US-016 — Withdraw to Bank Account
**As a** verified user, **I want to** withdraw my wallet balance to my bank account, **so that** I can use my money in the real world.
- AC: KYC must be verified before withdrawal is allowed
- AC: Minimum withdrawal: ₦500
- AC: User selects bank from list of 40+ Nigerian banks
- AC: User enters 10-digit NUBAN account number
- AC: Account name auto-verified (shows "John Doe" if correct)
- AC: Processing fee: 1% capped at ₦50 (displayed before confirmation)
- AC: Confirmation dialog shows final amount to receive
- AC: Processing within 24 business hours
- AC: Balance debited immediately on confirmation
- AC: Insufficient balance shows error
- **Priority:** Must Have

---

### US-017 — View Transaction History
**As a** user, **I want to** see a complete list of all my transactions, **so that** I can track my spending and earnings.
- AC: Paginated list showing all transaction types
- AC: Filter chips: All, Data, Airtime, Sold, Funded, Withdrawn
- AC: Each item shows: icon, type label, description, date, amount, status
- AC: Credits shown in green, debits in grey/black
- AC: Status badge: Success (green) or Pending (amber)
- AC: Pull-to-refresh loads latest transactions
- **Priority:** Must Have

---

## EPIC 4: Data Marketplace

### US-018 — Buy Data Plan
**As a** user, **I want to** buy a data plan for any Nigerian network, **so that** I can get internet access or send data to someone.
- AC: 3-step flow: Network → Plan → Phone + Confirm
- AC: Available networks: MTN, Airtel, Glo, 9Mobile
- AC: Each plan shows size, duration, and price
- AC: Recipient phone number required (validated as Nigerian)
- AC: Wallet balance must be sufficient (balance check before payment)
- AC: Insufficient balance redirects to Fund Wallet with alert
- AC: Company inventory checked first; falls back to direct top-up
- AC: Success screen shows delivery confirmation + new balance
- AC: Data cannot be reversed after successful delivery
- **Priority:** Must Have

---

### US-019 — Sell Data Plan
**As a** user with unused data, **I want to** sell my data plan to DataSwap, **so that** I receive instant wallet credit instead of losing the data.
- AC: 3-step flow: Network → Plan → Quantity + Confirm
- AC: Payout rate displayed upfront (₦xxx per unit, 76% of market)
- AC: Quantity selector (1–100 units)
- AC: Market value vs payout value displayed side-by-side
- AC: Confirmation alert before processing
- AC: On success, wallet credited instantly
- AC: Data added to company inventory
- AC: Success screen shows amount credited + new balance
- **Priority:** Must Have

---

### US-020 — Buy Airtime
**As a** user, **I want to** buy airtime for any Nigerian network, **so that** I can make calls or send credit to family.
- AC: Select network, enter phone number, select/enter amount
- AC: Quick denomination chips: ₦50, ₦100, ₦200, ₦500, ₦1,000, ₦2,000, ₦5,000
- AC: Custom amount input: min ₦50, max ₦50,000
- AC: Wallet balance check before payment
- AC: Success screen with confirmation
- **Priority:** Must Have

---

## EPIC 5: Profile & Settings

### US-021 — View Profile
**As a** user, **I want to** see my profile information, **so that** I can verify my account details and status.
- AC: Shows: name, phone, KYC status badge, wallet balance summary
- AC: Shows initials avatar (no photo upload in v1.0)
- **Priority:** Must Have

---

### US-022 — Toggle Biometric from Profile
**As a** user, **I want to** enable or disable biometric login from my profile, **so that** I can manage my security preferences.
- AC: Toggle switch visible in Security section
- AC: Enabling requires biometric confirmation
- AC: Disabling is immediate (no confirmation needed)
- **Priority:** Should Have

---

### US-023 — Change PIN
**As a** user, **I want to** change my transaction PIN, **so that** I can update it if I think it's been compromised.
- AC: Enter old PIN, then new PIN, then confirm new PIN
- AC: Old PIN must be verified before change allowed
- AC: New PIN cannot be the same as old PIN
- **Priority:** Should Have

---

## EPIC 6: Admin Use Cases (Phase 2)

### UC-A01 — Review KYC Submission
**As an** admin, **I want to** review submitted KYC documents, **so that** I can approve or reject user verifications.
- AC: Admin can view all pending KYC submissions in dashboard
- AC: View user's BVN match result, NIN result, ID images, selfie
- AC: Approve or reject with required reason for rejection
- AC: Approved → user notified, account upgraded to verified
- AC: Rejected → user notified with reason, can resubmit
- **Priority:** Must Have (Admin web dashboard — Phase 2)

---

### UC-A02 — Manage Data Inventory
**As an** admin, **I want to** view company data inventory levels, **so that** I can monitor supply and pricing.
- AC: View inventory by network, plan, quantity available
- AC: Receive alert when inventory falls below threshold
- AC: Manually add inventory (off-platform acquisition)
- **Priority:** Should Have (Phase 2)

---

### UC-A03 — View Platform Analytics
**As an** admin, **I want to** see transaction volumes, user growth, and revenue metrics, **so that** I can make data-driven business decisions.
- AC: Daily/weekly/monthly GMV
- AC: New registrations and KYC conversion rate
- AC: Top data plans by volume
- AC: Revenue breakdown by stream
- **Priority:** Could Have (Phase 2)

---

### UC-A04 — Manage User Accounts
**As an** admin, **I want to** search and manage user accounts, **so that** I can handle support tickets and compliance issues.
- AC: Search by phone, email, name, or user ID
- AC: View user's KYC status, wallet balance, transaction history
- AC: Freeze/unfreeze account
- AC: Manually credit or debit wallet (with audit log)
- AC: Flag account for AML review
- **Priority:** Must Have (Phase 2)

---

## Use Case: Happy Path — Buy Data

```
Actor: Verified User
Precondition: User is logged in, KYC verified, wallet balance ≥ plan price

1. User taps "Buy Data" from Home quick actions or bottom tab
2. System displays network selection (MTN, Airtel, Glo, 9Mobile)
3. User selects MTN
4. System displays MTN data plans with sizes, duration, price
5. User selects "5GB - 30 days - ₦1,000"
6. System shows order summary and phone number input
7. User enters recipient: 08012345678
8. User taps "Pay ₦1,000"
9. System verifies: balance ≥ ₦1,000 ✓
10. System checks inventory: MTN 5GB available ✓
11. System deducts ₦1,000 from wallet
12. System fulfils from inventory (or calls telco API)
13. Data delivered to 08012345678
14. Transaction recorded as success
15. Success screen shown with details

Alternate Flow A (Insufficient Balance):
  Step 9 fails → Alert: "Insufficient balance. Fund wallet?" 
  → Tapping "Fund Wallet" navigates to FundWallet screen

Alternate Flow B (Delivery Failure):
  Step 12 fails → Wallet balance reversed → Error shown → User can retry
```

---

## Use Case: Happy Path — Sell Data

```
Actor: Verified User
Precondition: User is logged in, KYC verified

1. User taps "Sell Data" from Home quick actions or bottom tab
2. User sees rate banner: "We buy at 76% of market price"
3. User selects network: Airtel
4. System shows Airtel plans with market price and payout price
5. User selects "2GB - 30 days" (payout: ₦380)
6. System shows sale summary with quantity selector (default: 1)
7. User increases quantity to 3
8. Summary: Market Value ₦1,500 → You Receive ₦1,140
9. User taps "Sell for ₦1,140"
10. Confirmation alert shown
11. User confirms "Sell Now"
12. System credits ₦1,140 to wallet
13. System adds 3× Airtel 2GB to inventory
14. Transaction recorded
15. Success screen shows ₦1,140 credited, new balance displayed
```

---

## Story Map (Priority View)

```
BACKBONE:    Register → Verify → KYC → PIN → Home → Transact → Withdraw

WALKING      Register  OTP      BVN   Set    View   Buy Data   View Bal
SKELETON:    Form      verify   NIN   4-PIN  Bal    Buy Air    Tx Hist
                                      Setup         Sell Data  Withdraw

FEATURES:    Biometric  Docs   Selfie  Skip  Refresh Top-up    Bank
             Login      upload        later  bal     Airtime   Verify

DELIGHTERS:  Onboarding  NDPR   Masked  Quick  Balance Fund Via  Referral
             Slides      Consent review  Amts   Hidden  USSD      Program
```
