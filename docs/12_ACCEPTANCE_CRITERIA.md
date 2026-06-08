# Acceptance Criteria
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

> Acceptance Criteria define the conditions that must be true for a feature to be considered "done." Written in **Given / When / Then** (Gherkin) format. Each AC maps to a User Story from `02_USER_STORIES.md`.

---

## AC-001: User Registration (US-002)

**Scenario 1 — Successful registration**
```gherkin
Given: I am on the Register screen
When:  I enter full name "Adewale Johnson"
  And: phone "08012345678"
  And: email "adewale@example.com"
  And: password "SecurePass@1"
  And: confirm password "SecurePass@1"
  And: tap "Create Account"
Then: The app navigates to the OTP screen
  And: The OTP screen shows "We sent a code to 0801***5678"
  And: A 6-digit OTP is delivered via SMS
```

**Scenario 2 — Duplicate phone**
```gherkin
Given: Phone "08012345678" is already registered
When:  I enter that phone and submit
Then:  Inline error appears: "Phone number already in use"
  And: No OTP is sent
```

**Scenario 3 — Invalid password**
```gherkin
Given: I enter password "weakpass"
When:  I submit
Then:  Error appears: "Password must be at least 8 characters with uppercase, number, and special character"
  And: Submit is prevented
```

**Scenario 4 — Passwords mismatch**
```gherkin
Given: I enter password "SecurePass@1" and confirm "SecurePass@2"
When:  I submit
Then:  Error on confirm field: "Passwords do not match"
```

---

## AC-002: OTP Verification (US-003)

**Scenario 1 — Correct OTP**
```gherkin
Given: I am on the OTP screen after registration
When:  I enter the correct 6-digit code within 10 minutes
Then:  App navigates to KYC step 1
  And: My phone is marked as verified
```

**Scenario 2 — Wrong OTP**
```gherkin
Given: I am on the OTP screen
When:  I enter an incorrect 6-digit code
Then:  Error shown: "Invalid OTP. Please try again."
  And: Attempt counter increments
```

**Scenario 3 — Max attempts**
```gherkin
Given: I have entered 3 wrong OTPs
When:  The 3rd attempt fails
Then:  Screen shows: "Too many attempts. Try again in 5 minutes."
  And: OTP entry is disabled for 5 minutes
```

**Scenario 4 — Expired OTP**
```gherkin
Given: I wait more than 10 minutes after OTP is sent
When:  I enter the OTP
Then:  Error shown: "Code has expired. Please request a new one."
  And: "Resend Code" button is available
```

**Scenario 5 — Resend**
```gherkin
Given: I am on the OTP screen
When:  60 seconds have passed since last send
Then:  "Resend Code" button becomes active
  And: Tapping it sends a new OTP to my phone
```

---

## AC-003: Login (US-004)

**Scenario 1 — Successful login (no PIN set)**
```gherkin
Given: I have a registered and phone-verified account with no PIN
When:  I enter correct phone + password
Then:  App navigates to PIN Setup screen
```

**Scenario 2 — Successful login (PIN set)**
```gherkin
Given: I have a fully set-up account with PIN
When:  I enter correct phone + password
Then:  App navigates to Home screen
```

**Scenario 3 — Wrong password**
```gherkin
Given: I enter the correct phone but wrong password
When:  I submit
Then:  Error banner: "Incorrect phone number or password"
  And: Failed attempt count increments
```

**Scenario 4 — Account locked**
```gherkin
Given: I have failed to login 5 times
When:  I try to login again within 15 minutes
Then:  Error: "Account locked. Try again at [time]."
  And: Login button is disabled
```

**Scenario 5 — Demo account login**
```gherkin
Given: I am on the Login screen
When:  I tap the "Try Demo Account" banner
Then:  I am logged in with no form entry
  And: App navigates to Home screen
  And: Wallet shows ₦12,260 balance
  And: KYC status is Verified
```

---

## AC-004: KYC Submission (US-009)

**Scenario 1 — Valid submission**
```gherkin
Given: I am on KYC step 2 (Documents)
  And: I enter BVN "12345678901" (11 digits)
  And: I select "National ID" as ID type
  And: I upload front and back images
  And: I capture a selfie
  And: I accept the NDPR consent
When:  I tap "Submit"
Then:  KYC status changes to "pending"
  And: App shows KYC Pending screen
  And: BVN shown as "****5678901" (masked) in review step
```

**Scenario 2 — Under 18**
```gherkin
Given: I enter a date of birth that makes me 17 years old
When:  I try to proceed to the next step
Then:  Error shown: "You must be 18 or older to use DataSwap"
  And: Cannot proceed to next KYC step
```

**Scenario 3 — Missing consent**
```gherkin
Given: I have filled all KYC fields
  But: I have not checked the NDPR consent checkbox
When:  I tap "Submit"
Then:  Error shown: "You must accept the data processing consent to continue"
  And: Submission is blocked
```

---

## AC-005: Fund Wallet via Card (US-013)

**Scenario 1 — Successful funding**
```gherkin
Given: I am on the Fund Wallet screen
When:  I select ₦5,000
  And: Choose "Card" method
  And: Paystack processes payment successfully
Then:  My wallet balance increases by ₦5,000
  And: Success screen shows "₦5,000 added to your wallet"
  And: New balance is displayed
  And: Transaction recorded as "fund_card" with status "success"
```

**Scenario 2 — Card declined**
```gherkin
Given: I enter a card that Paystack declines
When:  Payment is attempted
Then:  Error shown: "Payment failed. Please check your card details or try another card."
  And: Wallet balance is unchanged
  And: "Try Again" button shown
```

**Scenario 3 — Below minimum**
```gherkin
Given: I enter a custom amount of ₦50
When:  I try to proceed
Then:  Validation error: "Minimum fund amount is ₦100"
  And: Submit is disabled
```

---

## AC-006: Buy Data (US-018)

**Scenario 1 — Successful data purchase**
```gherkin
Given: I have ₦2,000 wallet balance
  And: I am on Buy Data screen
When:  I select MTN, then "MTN 1GB (30 Days) - ₦200"
  And: Enter recipient phone "08012345678"
  And: Tap "Pay ₦200"
Then:  ₦200 is deducted from my wallet
  And: 1GB data is delivered to 08012345678
  And: Success screen shows confirmation
  And: New balance: ₦1,800
```

**Scenario 2 — Insufficient balance**
```gherkin
Given: My wallet balance is ₦150
When:  I select a ₦200 data plan
  And: Tap "Pay ₦200"
Then:  Alert: "Insufficient balance. Would you like to fund your wallet?"
  And: Tapping "Fund Wallet" navigates to Fund Wallet screen
  And: No money is deducted
```

**Scenario 3 — Delivery failure**
```gherkin
Given: I purchase a data plan successfully
  But: VTU delivery fails (network error)
Then:  My wallet is automatically refunded
  And: Error message: "Delivery failed. Your wallet has been refunded."
  And: Transaction shows status "reversed"
```

---

## AC-007: Sell Data (US-019)

**Scenario 1 — Successful data sale**
```gherkin
Given: I am on Sell Data screen
When:  I select Airtel, then "Airtel 2GB (30 Days)"
  And: Set quantity to 3
  And: Payout shows ₦1,140 (3 × ₦380)
  And: I confirm "Sell Now"
Then:  ₦1,140 is credited to my wallet instantly
  And: Success screen: "₦1,140 credited to your wallet"
  And: Transaction recorded as "sell_data" with status "success"
```

**Scenario 2 — Rate visible before commit**
```gherkin
Given: I am on Sell Data step 2 (plan selection)
When:  I view any plan
Then:  Both market price AND payout price are visible
  And: Payout percentage label (76%) is visible
  And: I can see the difference before selecting
```

---

## AC-008: Withdraw to Bank (US-016)

**Scenario 1 — Successful withdrawal**
```gherkin
Given: My KYC is verified
  And: My wallet balance is ₦5,000
When:  I enter amount ₦2,000
  And: Select GTBank (code: 058)
  And: Enter account number "0123456789"
  And: Account name verifies as "Adewale Johnson"
  And: Fee shown: ₦20.00 (1% of ₦2,000)
  And: Amount to receive: ₦1,980
  And: I confirm
Then:  ₦2,000 is debited from my wallet immediately
  And: Balance becomes ₦3,000
  And: Success screen: "₦1,980 arrives within 24 hours"
  And: Transaction recorded as "withdraw" with status "pending"
```

**Scenario 2 — KYC required**
```gherkin
Given: My KYC status is "not_started"
When:  I try to access the Withdraw screen
Then:  Alert: "Complete identity verification to enable withdrawals"
  And: "Verify Now" button navigates to KYC screen
  And: No withdrawal is possible
```

**Scenario 3 — Invalid account**
```gherkin
Given: I enter an account number that cannot be verified
When:  Account verification runs
Then:  Error: "Could not verify account number. Please check and try again."
  And: Continue button disabled until account verifies
```

---

## AC-009: View Transaction History (US-017)

**Scenario 1 — Transactions visible**
```gherkin
Given: I have completed at least 1 transaction
When:  I open the Transactions screen
Then:  I see all transactions in reverse chronological order
  And: Each shows icon, description, time, amount, status
  And: Credit amounts are green
  And: Status badges are colour-coded (green: success, amber: pending)
```

**Scenario 2 — Filter works**
```gherkin
Given: I have mixed transaction types
When:  I tap the "Data" filter chip
Then:  Only buy_data and sell_data transactions are shown
  And: Other types are hidden
```

---

## AC-010: Demo Account (Special Requirement)

**Scenario 1 — Demo access without real data**
```gherkin
Given: I am on the Login screen
  And: I have NOT entered any phone or password
When:  I tap "Try Demo Account"
Then:  I am logged in immediately (< 2 seconds)
  And: Home screen shows wallet balance ₦12,260
  And: KYC status shows "Verified" (green badge)
  And: At least 4 recent transactions are visible
  And: I can navigate all screens without entering real BVN or NIN
  And: All buy/sell/airtime flows work with mock data
```

---

## AC-011: Security Acceptance Criteria

**Scenario 1 — BVN/NIN never exposed**
```gherkin
Given: I have submitted KYC with real BVN
When:  I open the KYC review step or Profile screen
Then:  BVN is shown as "****XXXX" (last 4 digits only)
  And: Full BVN is not accessible in any API response
  And: Full BVN is not in any screen in the app
```

**Scenario 2 — Account lockout**
```gherkin
Given: I enter the wrong password 5 times
When:  The 5th attempt fails
Then:  Error: "Account temporarily locked. Try again in 15 minutes."
  And: Further login attempts are blocked for 15 minutes
  And: Correct password also blocked (not just wrong ones)
```

**Scenario 3 — Logout clears data**
```gherkin
Given: I am logged in and viewing my balance
When:  I log out and the app restarts
Then:  No personal data (balance, name, phone) is visible
  And: App navigates to Login screen
  And: SecureStore tokens are cleared
```

---

## Definition of Done (DoD)

A feature is **Done** when ALL of the following are true:

### Code Quality
- [ ] All acceptance criteria scenarios pass (manual or automated)
- [ ] No ESLint errors or warnings
- [ ] No console.log statements (except intentional debug flags)
- [ ] Error handling for all network calls (try/catch with user feedback)

### Functionality
- [ ] Works on Android 8.0 (minimum supported)
- [ ] Works with both fast internet and simulated 3G (slow connection)
- [ ] Works with Expo Go for development testing
- [ ] Handles offline state gracefully (no crash, clear message)

### UX
- [ ] Matches design mockups in `07_UI_DESIGN.md`
- [ ] Loading states shown for all async operations
- [ ] Back navigation works correctly from all screens
- [ ] No keyboard covering important form fields

### Security
- [ ] No sensitive data in navigation params or AsyncStorage
- [ ] Sensitive data only in SecureStore
- [ ] No hardcoded test credentials in production build

### Testing
- [ ] Unit tests for validators and formatters pass
- [ ] Integration test for happy path flows pass
- [ ] Manually tested by developer + at least 1 other person
