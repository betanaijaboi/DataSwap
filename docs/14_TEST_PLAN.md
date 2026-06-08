# Test Plan
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

---

## 1. Test Objectives

1. Verify all P1 functional requirements from `09_FUNCTIONAL_REQUIREMENTS.md` are implemented correctly
2. Confirm all acceptance criteria in `12_ACCEPTANCE_CRITERIA.md` pass
3. Ensure the app is stable on the minimum supported Android version (8.0)
4. Validate that wallet operations are financially accurate (no double charges, no missed credits)
5. Confirm security requirements from `11_SECURITY_REQUIREMENTS.md` are met
6. Verify the app functions acceptably on a 3G connection (≥ 1 Mbps)

---

## 2. Test Scope

### In Scope
- All 21 screens and their user interactions
- All wallet operations: fund, buy data, sell data, buy airtime, withdraw
- Authentication flows: register, login, OTP, KYC, PIN, logout
- Navigation: all stack navigations and tab transitions
- Error states: validation errors, network errors, insufficient balance
- Edge cases: empty states, minimum/maximum values, special characters

### Out of Scope (Phase 1 Testing)
- iOS device testing (Phase 2)
- Admin dashboard (Phase 2)
- Load/stress testing with real traffic (covered pre-launch with staging)
- Push notification delivery (Phase 2 feature)
- Biometric authentication (Phase 2 feature)

---

## 3. Test Types

### 3.1 Unit Tests
**Scope:** Utility functions, validators, formatters, service business logic  
**Framework:** Jest  
**Location:** `__tests__/utils/`, `__tests__/services/`

#### Validators (src/utils/validators.js)
```
✅ validatePhone
  - Pass: "08012345678" (11 digits, starts 070-090)
  - Pass: "07023456789"
  - Pass: "09098765432"
  - Fail: "0801234567" (10 digits)
  - Fail: "08012345678901" (13 digits)
  - Fail: "0601234567" (invalid prefix)
  - Fail: "abc1234567" (non-numeric)
  - Fail: "" (empty)
  - Fail: null / undefined

✅ validateEmail
  - Pass: "user@example.com"
  - Pass: "user+tag@domain.co.uk"
  - Fail: "notanemail"
  - Fail: "@domain.com"
  - Fail: "user@"
  - Fail: "" (empty)

✅ validatePassword
  - Pass: "SecurePass@1" (8 chars, upper, lower, digit, special)
  - Fail: "weakpass" (no upper, no digit, no special)
  - Fail: "ALLCAPS1!" (no lowercase)
  - Fail: "alllower1!" (no uppercase)
  - Fail: "NoDigits!" (no number)
  - Fail: "NoSpecial1" (no special char)
  - Fail: "Short1!" (under 8 chars)

✅ validateBVN
  - Pass: "12345678901" (exactly 11 digits)
  - Fail: "1234567890" (10 digits)
  - Fail: "123456789012" (12 digits)
  - Fail: "1234567890a" (non-numeric)

✅ validateNIN
  - Same rules as BVN
```

#### Formatters (src/utils/formatters.js)
```
✅ formatCurrency
  - formatCurrency(1000) → "₦1,000.00"
  - formatCurrency(0) → "₦0.00"
  - formatCurrency(1234567.89) → "₦1,234,567.89"
  - formatCurrency(-500) → "-₦500.00"

✅ formatDate
  - formatDate("2026-06-08T10:00:00Z") → "Jun 8, 2026"
  - formatDate("2026-12-01T00:00:00Z") → "Dec 1, 2026"

✅ maskPhone
  - maskPhone("08012345678") → "0801***5678"

✅ maskBVN / maskNIN
  - maskBVN("12345678901") → "****5678901"
```

#### Auth Service (src/services/authService.js)
```
✅ login with valid credentials → { success: true, user: {...} }
✅ login with wrong password → { success: false, error: "..." }
✅ login with unregistered phone → { success: false, error: "..." }
✅ register with new phone → { success: true }
✅ register with existing phone → { success: false, error: "..." }
✅ demo account login (phone: "08000000000") → KYC verified, balance ₦12,260
```

#### Wallet Service (src/services/walletService.js)
```
✅ getBalance returns numeric value ≥ 0
✅ fundWallet(5000) increases balance by 5000
✅ buyData deducts correct amount from balance
✅ sellData credits correct amount (76% of market price)
✅ buyAirtime deducts correct amount
✅ withdraw with sufficient balance → success, balance reduced
✅ withdraw with insufficient balance → { success: false, error: "..." }
✅ balance never goes below 0
✅ transaction history includes all transaction types
```

---

### 3.2 Integration Tests
**Scope:** Context + Service layer interactions, navigation flows  
**Framework:** Jest + React Native Testing Library

```
✅ AuthContext: login updates user state + stores token
✅ AuthContext: logout clears user state + tokens
✅ WalletContext: fundWallet updates balance display
✅ WalletContext: buyData shows success screen
✅ Navigation: unauthenticated → Login screen
✅ Navigation: authenticated + no PIN → PINSetup screen
✅ Navigation: authenticated + PIN set → Home screen
✅ Navigation: first launch → Onboarding screen
```

---

### 3.3 Component Tests
**Scope:** Input, Button components  

```
✅ Input renders with label
✅ Input shows error text when error prop provided
✅ Input border color changes on focus
✅ Input password toggle shows/hides text
✅ Input does not re-render parent on focus (Animated.Value test)
✅ Button renders correct text
✅ Button shows ActivityIndicator when loading=true
✅ Button not pressable when disabled=true
✅ Button onPress fires correctly
```

---

### 3.4 Manual End-to-End Test Cases

#### FLOW 1: Complete New User Onboarding
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Launch app fresh (first time) | Onboarding slide 1 shown | |
| 2. Swipe through all 3 slides | Dots indicate progress | |
| 3. Tap "Get Started" | Navigate to Login screen | |
| 4. Tap "Create Account" | Navigate to Register screen | |
| 5. Fill all fields with valid data | No errors shown | |
| 6. Tap "Create Account" | Navigate to OTP screen | |
| 7. Enter correct 6-digit OTP | Navigate to KYC step 1 | |
| 8. Fill personal info | Progress bar moves to step 2 | |
| 9. Enter BVN, select ID type | BVN shown, image upload shown | |
| 10. Upload front + back ID | Images preview shown | |
| 11. Capture selfie | Selfie preview shown | |
| 12. Review and consent | BVN masked, submit enabled | |
| 13. Submit KYC | KYC Pending screen shown | |
| 14. Tap "Continue to App" | PIN Setup screen shown | |
| 15. Set 4-digit PIN | PIN confirmed, Home screen shown | |
| 16. Home shows ₦0 balance | Balance displayed correctly | |

#### FLOW 2: Demo Account Login
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Open app | Login screen shown | |
| 2. Tap "Try Demo Account" banner | Loading indicator appears | |
| 3. Auto-login completes | Home screen shown (< 2 seconds) | |
| 4. Check wallet balance | ₦12,260 shown | |
| 5. Check KYC badge | "Verified" green badge | |
| 6. Open Transactions | At least 4 transactions visible | |
| 7. All transaction types visible | fund, buy, sell, withdraw types present | |

#### FLOW 3: Buy Data (Demo Account)
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Login as demo | Home screen | |
| 2. Tap "Buy Data" | Network selection screen | |
| 3. Select MTN | MTN data plans shown | |
| 4. Select any plan | Plan highlighted, continue shown | |
| 5. Enter recipient phone "08012345678" | Phone validated | |
| 6. Check balance before | Balance shown in summary | |
| 7. Tap "Pay ₦X" | Loading indicator | |
| 8. Purchase completes | Success screen shown | |
| 9. Success screen has: amount, recipient, new balance, ref | All details present | |
| 10. Tap "Back to Home" | Home screen, balance reduced | |

#### FLOW 4: Sell Data (Demo Account)
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Login as demo | Home screen | |
| 2. Tap "Sell Data" | Network selection + rate banner | |
| 3. Rate banner shows 76% | Visible before selection | |
| 4. Select network | Plans with market + payout shown | |
| 5. Select plan | Side-by-side price comparison shown | |
| 6. Adjust quantity to 2 | Payout recalculates live | |
| 7. Tap "Sell for ₦X" | Confirmation alert shown | |
| 8. Confirm | Success screen shown | |
| 9. Amount credited shown | Correct payout amount | |
| 10. Back to Home, balance increased | Balance updated | |

#### FLOW 5: Fund Wallet (Mock)
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Login as demo | Home screen | |
| 2. Tap "Fund Wallet" | Fund Wallet screen | |
| 3. Select ₦1,000 quick chip | Amount input shows ₦1,000 | |
| 4. Method = Card | Card option selected | |
| 5. Tap "Fund Wallet" | Mock payment processes | |
| 6. Success screen | "₦1,000 added" shown | |
| 7. Home screen | Balance increased by ₦1,000 | |

#### FLOW 6: Withdraw (Demo Account)
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Login as demo (KYC verified) | Home screen | |
| 2. Tap "Withdraw" | Withdraw screen shown | |
| 3. Enter amount ₦500 (above minimum) | Amount accepted | |
| 4. Select bank | Bank list appears | |
| 5. Enter 10-digit account number | Account number field accepts input | |
| 6. Account name auto-fills | "Demo Account" shown | |
| 7. Fee calculated and displayed | 1% fee shown | |
| 8. Confirm | Success screen shown | |
| 9. Balance reduced | Deducted from wallet | |

#### FLOW 7: Input Cursor Stability (Critical Bug Regression)
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Open Register screen | All 5 input fields visible | |
| 2. Tap "Full Name" field | Cursor appears ONLY in Full Name | |
| 3. Wait 3 seconds | Cursor stays in Full Name | |
| 4. Type "Test User" | Text appears correctly | |
| 5. Tap "Phone Number" | Cursor moves ONLY to Phone | |
| 6. Wait 3 seconds | Cursor stays in Phone | |
| 7. Type "08012345678" | No cascade to Email or any other field | |
| 8. Tap "Email" | Cursor moves ONLY to Email | |
| **PASS CRITERIA:** No rapid cursor switching between fields | | |

#### FLOW 8: Offline / Network Error Handling
| Step | Expected Result | Pass/Fail |
|------|----------------|-----------|
| 1. Enable Airplane mode | — | |
| 2. Open Buy Data screen | Screen loads (uses cached data) | |
| 3. Try to purchase data | Error: "Check your internet connection" | |
| 4. No crash | App remains on screen with error | |
| 5. Re-enable network | User can retry and it works | |

---

### 3.5 Security Test Cases

| Test | Expected Result | Pass/Fail |
|------|----------------|-----------|
| Enter incorrect password 5× on login | Account locked for 15 min | |
| Enter wrong OTP 3× | OTP entry locked for 5 min | |
| Try to access Home without token | Redirected to Login | |
| Check KYC review screen | BVN shows only last 4 digits | |
| Logout | All screens inaccessible, token cleared | |
| Try to set custom amount below ₦100 | Validation error shown | |
| Try to withdraw without KYC | Blocked with KYC prompt | |
| Check AsyncStorage (dev tools) | No tokens or sensitive data in AsyncStorage | |
| Check SecureStore contents | Only safe keys (no PII) | |

---

## 4. Test Devices

| Device | Android | RAM | Status |
|--------|---------|-----|--------|
| Samsung Galaxy A03s | 11 | 3GB | Required |
| Samsung Galaxy A54 | 13 | 8GB | Required |
| Tecno Camon 19 | 12 | 6GB | Nice to have |
| Infinix Hot 20i | 12 | 4GB | Nice to have |
| Android Emulator | 14 | 4GB | Always |

---

## 5. Test Environment

| Environment | URL/Access | Purpose |
|-------------|-----------|---------|
| Local (Expo Go) | `npx expo start` | Daily development testing |
| Staging (standalone APK) | Expo EAS Build | Integration + security testing |
| Production | Google Play | Post-launch monitoring |

---

## 6. Bug Classification

| Severity | Definition | SLA to Fix |
|----------|-----------|-----------|
| P1 — Critical | Financial loss, data breach, app crash on launch | Same day |
| P2 — High | Feature broken, no workaround, major UX broken | 3 days |
| P3 — Medium | Feature partially broken, workaround exists | 1 week |
| P4 — Low | Cosmetic, minor UX issue, edge case | Next sprint |

---

## 7. Test Exit Criteria (Launch Gate)

The app shall not launch publicly until:
- [ ] All P1 (Must Have) functional requirements tested and passing
- [ ] Zero open P1 or P2 bugs
- [ ] Cursor glitch regression test (Flow 7) passing on 3 devices
- [ ] Demo account login working (Flow 2) — no BVN/NIN required
- [ ] All wallet math verified: balance calculations accurate to ₦0.01
- [ ] Security test cases all passing
- [ ] Tested on minimum supported Android (8.0)
- [ ] App does not crash on any test flow

---

## 8. Test Data

### Validators Test Data

```js
// Valid Nigerian phone numbers (all should PASS)
const validPhones = [
  '08012345678', '07023456789', '09098765432',
  '08123456789', '07012345678', '09012345678',
];

// Invalid phone numbers (all should FAIL)
const invalidPhones = [
  '0801234567',    // 10 digits
  '080123456789',  // 12 digits
  '06012345678',   // invalid prefix
  '+2348012345678', // international format
  '08012 34567',   // spaces
  'abcdefghijk',   // letters
];

// Passwords that should PASS
const validPasswords = [
  'SecurePass@1', 'MyP@ssw0rd', 'Test123!@#',
];

// Passwords that should FAIL
const invalidPasswords = [
  'weakpassword', 'ALLCAPSNUMBER1', 'no-uppercase1!',
  'NoDigits!', 'Short1!', '', '       ',
];
```

### KYC Test Data (Development Only — Demo)
```
BVN: 00000000000 (11 zeros — demo only, not a real BVN)
NIN: 00000000000 (11 zeros — demo only, not a real NIN)
```
> ⚠️ **Security Note:** NEVER use real BVN or NIN for testing. The demo account and all test scenarios use dummy values (11 zeros) only. See also `11_SECURITY_REQUIREMENTS.md` SR-DATA-002.
