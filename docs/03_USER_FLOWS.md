# User Flow Diagrams
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

> **Key:** [Screen Name] → next step | (condition) → branch | ✅ success terminal | ❌ error state

---

## FLOW 1: First-Time User Complete Journey

```
APP LAUNCH
    │
    ▼
[Onboarding Slide 1: "Buy Data"]
    │  swipe / Next
    ▼
[Onboarding Slide 2: "Sell Data"]
    │  swipe / Next
    ▼
[Onboarding Slide 3: "Earn Money"]
    │  Get Started / Skip
    ▼
[Login Screen]
    │  "Create Account"
    ▼
[Register Screen]
    │  fill: name, phone, email, password, confirm
    │  (validation fails) → inline errors → re-fill
    │  (phone already registered) → "Phone already in use" error
    │  (success)
    ▼
[OTP Verification Screen]
    │  enter 6-digit code
    │  (wrong code) → "Invalid OTP" error → retry (max 3 attempts)
    │  (expired) → "Resend Code" after 60s countdown
    │  (correct)
    ▼
[KYC Screen — Step 1: Personal Info]
    │  name, DOB, address, state
    │  (under 18) → "Must be 18+ to use DataSwap"
    │  Next →
    ▼
[KYC Screen — Step 2: Documents]
    │  BVN, NIN, ID type, front image, back image
    │  (missing required field) → validation error
    │  Next →
    ▼
[KYC Screen — Step 3: Selfie]
    │  camera opens → capture selfie
    │  (blurry/no face detected) → retry capture
    │  Next →
    ▼
[KYC Screen — Step 4: Review & Submit]
    │  masked preview of BVN/NIN
    │  NDPR consent checkbox
    │  (consent not given) → cannot submit
    │  Submit →
    ▼
[KYC Pending Screen]
    │  "Review takes 1–2 business days"
    │  "Continue to App" →
    ▼
[PIN Setup Screen]
    │  enter 4-digit PIN → confirm PIN
    │  (mismatch) → "PINs don't match" → reset both
    │  (match)
    ▼
[Biometric Prompt] (if device supports biometrics)
    │  Enable / Skip
    ▼
[Home Screen] ✅ FIRST-TIME JOURNEY COMPLETE
```

---

## FLOW 2: Returning User Login

```
APP LAUNCH
    │
    ├── (biometric enabled) → [Biometric Prompt]
    │       │  (success) → [Home Screen] ✅
    │       │  (fail/cancel) → fall through to password login
    │
    ▼
[Login Screen]
    │  enter phone + password
    │  "Forgot Password?" → [Forgot Password Flow]
    │  "Try Demo Account" → auto-login as demo → [Home Screen] ✅
    │  (wrong credentials) → "Incorrect phone or password"
    │  (5 failed attempts) → "Account locked for 15 minutes"
    │  (success, no PIN set) → [PIN Setup]
    │  (success, PIN set) → [Home Screen] ✅
```

---

## FLOW 3: Forgot Password

```
[Login Screen]
    │  "Forgot Password?"
    ▼
[Forgot Password Screen]
    │  enter registered phone number
    │  (unregistered phone) → "No account found"
    │  Send OTP →
    ▼
[OTP Screen — Reset Mode]
    │  enter 6-digit code
    │  (wrong / expired) → error + resend option
    │  (correct) →
    ▼
[New Password Screen]
    │  enter new password + confirm
    │  (complexity fails) → validation errors
    │  (match + valid) →
    ▼
✅ "Password reset successfully"
    │
    ▼
[Login Screen] (redirect)
```

---

## FLOW 4: Fund Wallet

```
[Home Screen] → "Fund Wallet" quick action  OR  [Bottom Tab: Wallet]
    │
    ▼
[Fund Wallet Screen]
    │  select amount (preset chips or custom input)
    │  select method: Card / Bank Transfer / USSD
    │
    ├── CARD PAYMENT ─────────────────────────────────────────┐
    │       │  Paystack card sheet opens                      │
    │       │  enter: card number, expiry, CVV                │
    │       │  (3DS verification if required)                 │
    │       │  (card declined) → error + retry                │
    │       │  (success) → balance updated instantly          │
    │       └──────────────────────────────────────────────►  │
    │                                                          │
    ├── BANK TRANSFER ────────────────────────────────────────┤
    │       │  virtual account number displayed               │
    │       │  user transfers from banking app                │
    │       │  polling / webhook → balance updated (1–5 min)  │
    │       └──────────────────────────────────────────────►  │
    │                                                          │
    └── USSD ─────────────────────────────────────────────────┤
            │  USSD code displayed (*737*1*AMOUNT*ACCT#)      │
            │  user dials code on phone                        │
            │  balance updated on confirmation                 │
            └──────────────────────────────────────────────►  │
                                                               │
                                                    [Success Screen]
                                                    amount funded, new balance
                                                    "Back to Home" ✅
```

---

## FLOW 5: Buy Data Plan

```
[Home Screen] → "Buy Data"  OR  [Bottom Tab: Data]
    │
    ▼
[Buy Data Screen — Step 1: Select Network]
    │  MTN | Airtel | Glo | 9Mobile
    │
    ▼
[Buy Data Screen — Step 2: Select Plan]
    │  list of plans: size, duration, price
    │  tap plan to select
    │
    ▼
[Buy Data Screen — Step 3: Confirm]
    │  enter recipient phone number
    │  shows: plan, recipient, price, balance after
    │  (insufficient balance) → "Fund Wallet" alert → [Fund Wallet Flow]
    │  "Pay ₦X" →
    │
    ├── (balance sufficient + inventory available) ───────────────────────────►
    │       system deducts balance
    │       fulfil from inventory (or VTU API)
    │       delivery confirmed
    │
    ├── (balance sufficient + inventory empty) → direct telco API fallback ──►
    │
    └── (VTU API failure) → balance reversed → error screen → retry
                                                                    │
                                                         [Success Screen]
                                                         "5GB delivered to 0801..."
                                                         new balance, transaction ref ✅
```

---

## FLOW 6: Sell Data Plan

```
[Home Screen] → "Sell Data"  OR  [Bottom Tab: Sell]
    │
    ▼
[Sell Data Screen — Step 1: Select Network]
    │  MTN | Airtel | Glo | 9Mobile
    │
    ▼
[Sell Data Screen — Step 2: Select Plan]
    │  plans with: market price, DataSwap payout (76%)
    │
    ▼
[Sell Data Screen — Step 3: Set Quantity]
    │  quantity spinner (1–100)
    │  live calculation: market value vs payout
    │  "Sell for ₦X" →
    │
    ▼
[Confirmation Alert]
    │  "Confirm: Sell 3× MTN 2GB for ₦1,140?"
    │  Cancel | Sell Now
    │
    ▼ (Sell Now)
    system credits wallet ₦X
    adds inventory to DataSwap pool
    records transaction
    │
    ▼
[Success Screen]
    "₦1,140 credited to your wallet"
    new balance displayed ✅
```

---

## FLOW 7: Buy Airtime

```
[Home Screen] → "Buy Airtime"  OR  [Bottom Tab: Airtime]
    │
    ▼
[Buy Airtime Screen]
    │  1. Select network (MTN | Airtel | Glo | 9Mobile)
    │  2. Enter recipient phone number
    │  3. Select amount (chip: ₦50/₦100/₦200/₦500/₦1,000/₦2,000/₦5,000)
    │     OR enter custom amount (₦50–₦50,000)
    │  "Pay ₦X" →
    │
    │  (insufficient balance) → "Fund Wallet?" alert
    │  (success) →
    ▼
[Success Screen]
    "₦500 airtime sent to 0801XXXXXXX" ✅
```

---

## FLOW 8: Withdraw to Bank

```
[Home Screen] → "Withdraw"  OR  [Profile → Withdraw]
    │
    │  (KYC not verified) → "Complete KYC to withdraw" → [KYC Screen]
    ▼
[Withdraw Screen]
    │  1. Enter amount (min ₦500)
    │  2. Select bank (dropdown: 40+ banks)
    │  3. Enter 10-digit account number
    │  4. Account name auto-fills → "Confirm: John Doe?" ✓
    │
    │  (insufficient balance) → validation error
    │  (unverified account number) → "Could not verify account"
    │
    │  fee preview: "₦12 fee applies. You receive ₦988"
    │  "Withdraw ₦1,000" →
    ▼
[Confirmation Dialog]
    │  "Send ₦988 to John Doe at GTBank?"
    │  Cancel | Confirm
    ▼ (Confirm)
    balance debited immediately
    withdrawal queued for processing
    │
    ▼
[Success Screen]
    "Withdrawal initiated. ₦988 arrives within 24hrs" ✅
```

---

## FLOW 9: KYC Re-submission (Rejected)

```
[Home Screen] — red "KYC Rejected" banner
    │  "Fix Now" CTA
    ▼
[KYC Rejection Screen]
    │  rejection reason: "ID image is blurry"
    │  "Re-submit Documents" →
    ▼
[KYC Wizard — Step 2: Documents] (pre-filled safe fields)
    │  user uploads clearer images
    │  → Step 3 Selfie → Step 4 Review → Submit
    ▼
[KYC Pending Screen] ✅
```

---

## FLOW 10: View Transaction History

```
[Home Screen] → "View All" link  OR  [Bottom Tab: Transactions]
    │
    ▼
[Transactions Screen]
    │  filter chips: All | Data | Airtime | Sold | Funded | Withdrawn
    │  scroll through list
    │  (pull-to-refresh) → fetches latest
    │  tap transaction → (Phase 2: transaction detail screen)
    ✅ (no navigation exit — browsing screen)
```

---

## FLOW 11: Navigation Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    APP NAVIGATOR                          │
├──────────────────────────────────────────────────────────┤
│  AUTH STACK (unauthenticated)                            │
│  ┌─────────────┐                                         │
│  │ Onboarding  │ → Login → Register → OTP               │
│  │             │        → KYC (4 steps) → KYC Pending   │
│  │             │        → PINSetup → BiometricSetup      │
│  └─────────────┘                                         │
├──────────────────────────────────────────────────────────┤
│  MAIN APP (authenticated, bottom tab navigator)          │
│  ┌──────────┬──────────┬──────────┬──────────┐          │
│  │  Home    │  Data    │  Airtime │ Profile  │          │
│  │  Tab     │  Tab     │  Tab     │  Tab     │          │
│  └────┬─────┴─────┬────┴────┬─────┴────┬─────┘          │
│       │           │         │          │                 │
│    FundWallet   BuyData  BuyAirtime  Settings           │
│    Withdraw     SellData             KYCStatus          │
│    Transactions                      ChangePin           │
│                                       Logout             │
├──────────────────────────────────────────────────────────┤
│  MODALS (overlay on any screen)                          │
│  SuccessScreen · ConfirmationDialog · ErrorAlert         │
└──────────────────────────────────────────────────────────┘
```

---

## FLOW 12: Screen State Decision Tree

```
App Opens
    │
    ├── First launch? ──YES──► Onboarding
    │
    └── NO
         │
         ├── Auth token valid? ──NO──► Login
         │
         └── YES
              │
              ├── PIN set? ──NO──► PINSetup
              │
              └── YES
                   │
                   ├── Biometric enabled? ──YES──► BiometricPrompt ──►
                   │                                                    │
                   └── NO                                              ▼
                        └────────────────────────────────────► [Home Screen]
                                                                    │
                                                    ┌───────────────┤
                                                    │               │
                                              KYC verified?   Show KYC
                                                    NO         Warning
                                                    │          Banner
                                                    YES         (non-blocking)
                                                    │
                                              Full features
                                              available ✅
```
