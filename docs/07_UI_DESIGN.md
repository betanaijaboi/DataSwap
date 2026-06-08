# UI Design — High-Fidelity Mockups
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

> All mockups are ASCII representations of the actual React Native implementation. Dimensions are based on a 390×844px (iPhone 14) viewport scaled to React Native units.

---

## Screen 1: Onboarding (Slide 1 of 3)

```
┌─────────────────────────────────┐
│          STATUS BAR             │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │   [GRADIENT BG #0D47A1] │   │
│  │                         │   │
│  │       📡  ICON          │   │
│  │   (large, centered)     │   │
│  │                         │   │
│  │   ┌───────────────┐     │   │
│  │   │  BUY DATA     │     │   │
│  │   │  INSTANTLY    │     │   │
│  │   │  (H1, white)  │     │   │
│  │   └───────────────┘     │   │
│  │                         │   │
│  │   Get MTN, Airtel, Glo  │   │
│  │   and 9Mobile data at   │   │
│  │   unbeatable prices.    │   │
│  │   (body, rgba white)    │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│        ● ○ ○  (dots)           │
│                                 │
│  ┌─────────────────────────┐   │
│  │     GET STARTED  →      │   │
│  │   [primary blue btn]    │   │
│  └─────────────────────────┘   │
│                                 │
│     Already have account?       │
│       [Log In] (link)           │
│                                 │
└─────────────────────────────────┘
```

---

## Screen 2: Login Screen

```
┌─────────────────────────────────┐
│          STATUS BAR             │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │  [GRADIENT #0D47A1]     │   │
│  │                         │   │
│  │  ⚡ DataSwap            │   │
│  │  (logo row, white, 32px)│   │
│  │                         │   │
│  │  Nigeria's Data &       │   │
│  │  Airtime Marketplace    │   │
│  │  (tagline, rgba white)  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │ ← card, white, rounded-24, shadow
│  │  Welcome Back           │   │
│  │  (H2, gray900, bold)    │   │
│  │  Log in to your account │   │
│  │  (subtitle, gray500)    │   │
│  │                         │   │
│  │  Phone Number           │   │ ← label
│  │  ┌─────────────────────┐│   │
│  │  │📞 080XXXXXXXX       ││   │ ← Input component
│  │  └─────────────────────┘│   │
│  │                         │   │
│  │  Password               │   │
│  │  ┌─────────────────────┐│   │
│  │  │🔒 ••••••••••      👁││   │ ← password + toggle
│  │  └─────────────────────┘│   │
│  │              Forgot?    │   │ ← right-align link
│  │                         │   │
│  │  ┌─────────────────────┐│   │
│  │  │       LOG IN        ││   │ ← primary button
│  │  └─────────────────────┘│   │
│  │                         │   │
│  │  ┌─────────────────────┐│   │
│  │  │ 👆 Use Biometric    ││   │ ← outline button (if enabled)
│  │  └─────────────────────┘│   │
│  │                         │   │
│  │  ─────── OR ───────     │   │
│  │                         │   │
│  │  New to DataSwap?       │   │
│  │  [Create Account]       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │ ← demo banner, #EBF2FF
│  │ 🧪 Try Demo Account  →  │   │
│  │ Explore all features    │   │
│  └─────────────────────────┘   │
│                                 │
│  🛡 256-bit · CBN · KYC        │ ← security note, small gray
└─────────────────────────────────┘
```

---

## Screen 3: Register Screen

```
┌─────────────────────────────────┐
│  ← Back         Create Account  │ ← header
├─────────────────────────────────┤
│                                 │
│  Join DataSwap                  │ ← H1
│  Start selling & buying data    │ ← subtitle
│                                 │
│  Full Name                      │
│  ┌─────────────────────────┐   │
│  │👤 Enter your full name  │   │
│  └─────────────────────────┘   │
│                                 │
│  Phone Number                   │
│  ┌─────────────────────────┐   │
│  │📞 080XXXXXXXX           │   │
│  └─────────────────────────┘   │
│                                 │
│  Email Address                  │
│  ┌─────────────────────────┐   │
│  │✉️  your@email.com       │   │
│  └─────────────────────────┘   │
│                                 │
│  Password                       │
│  ┌─────────────────────────┐   │
│  │🔒 Min 8 chars         👁│   │
│  └─────────────────────────┘   │
│  ✓ 8+ chars ✓ uppercase        │ ← password strength hints
│  ✓ number   ✓ special char     │
│                                 │
│  Confirm Password               │
│  ┌─────────────────────────┐   │
│  │🔒 Repeat password     👁│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │   CREATE ACCOUNT →      │   │
│  └─────────────────────────┘   │
│                                 │
│  By signing up you agree to     │
│  [Terms] and [Privacy Policy]   │
└─────────────────────────────────┘
```

---

## Screen 4: OTP Verification

```
┌─────────────────────────────────┐
│  ← Back         Verify Phone    │
├─────────────────────────────────┤
│                                 │
│          📱                     │ ← large icon
│                                 │
│  Enter Verification Code        │ ← H1
│                                 │
│  We sent a 6-digit code to      │
│  0801***5678                    │ ← masked phone
│                                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │ ← 6 boxes
│  │ 4 │ │ 8 │ │ 3 │ │ _ │ │ _ │ │ _ │ │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ │
│                                 │
│  (last 3 boxes empty, border)   │
│                                 │
│  Code expires in: 08:42         │ ← countdown timer
│                                 │
│  ┌─────────────────────────┐   │
│  │       VERIFY →          │   │
│  └─────────────────────────┘   │
│                                 │
│  Didn't receive it?             │
│  [Resend Code] (disabled 45s)  │
└─────────────────────────────────┘
```

---

## Screen 5: KYC — Step 2 (Documents)

```
┌─────────────────────────────────┐
│  ← Back         Identity Check  │
├─────────────────────────────────┤
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━           │ ← step 2 of 4 progress bar
│  ①Personal  ②Docs  ③Selfie  ④Review│
│                                 │
│  BVN (Bank Verification No.)    │
│  ┌─────────────────────────┐   │
│  │👆 11-digit BVN          │   │ ← finger-print-outline icon
│  └─────────────────────────┘   │
│  11 digits  🔒 Encrypted       │ ← helper + security note
│                                 │
│  NIN (National Ident. No.)      │
│  ┌─────────────────────────┐   │
│  │👆 11-digit NIN (optional)│   │ ← finger-print-outline icon
│  └─────────────────────────┘   │
│                                 │
│  Government-issued ID           │
│  ┌─────────────────────────┐   │
│  │  National ID       ▼    │   │ ← dropdown
│  └─────────────────────────┘   │
│  ○ National ID  ○ Driver's Lic  │
│  ○ Passport     ○ Voter's Card  │
│                                 │
│  ID Front Image  * required     │
│  ┌─────────────────────────┐   │
│  │  📷 Tap to upload       │   │
│  │     (dashed border)     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │     NEXT: SELFIE →      │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

---

## Screen 6: Home Screen

```
┌─────────────────────────────────┐
│  Good morning, Adewale  🔔      │ ← header
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │ ← wallet card, gradient blue
│  │  Wallet Balance         │   │
│  │  ₦12,260.00      👁    │   │ ← balance + hide toggle
│  │                         │   │
│  │  ┌──────────┐ ┌───────┐│   │
│  │  │ + FUND   │ │WITHDRAW│   │ ← action buttons
│  │  └──────────┘ └───────┘│   │
│  └─────────────────────────┘   │
│                                 │
│  Quick Actions                  │ ← section label
│  ┌────────┐┌────────┐┌────────┐│
│  │  📡   ││   📲   ││  💰   ││
│  │ Buy   ││  Buy   ││  Sell  ││ ← 3 grid items
│  │ Data  ││Airtime ││  Data  ││
│  └────────┘└────────┘└────────┘│
│                                 │
│  ─ KYC Status Banner ─         │ ← only if not verified
│  ┌─────────────────────────┐   │
│  │ ⚠️ Complete identity    │   │
│  │ verification to unlock  │   │
│  │ all features  [Do Now →]│   │
│  └─────────────────────────┘   │
│                                 │
│  Recent Transactions            │ ← section label
│  ┌─────────────────────────┐   │
│  │ 📡 MTN 5GB     −₦1,000 │   │ ← transaction row
│  │ Today 2:30 PM  ✅       │   │
│  ├─────────────────────────┤   │
│  │ 💸 Sold Data   +₦760   │   │
│  │ Yesterday      ✅       │   │
│  ├─────────────────────────┤   │
│  │ 💳 Funded      +₦5,000 │   │
│  │ Jun 5          ✅       │   │
│  └─────────────────────────┘   │
│              [View All →]       │
│                                 │
├─────────────────────────────────┤
│  🏠 Home  📡 Data  📲 Air  👤 Me│ ← bottom tab bar
└─────────────────────────────────┘
```

---

## Screen 7: Buy Data Screen

```
┌─────────────────────────────────┐
│  ← Back           Buy Data      │
├─────────────────────────────────┤
│                                 │
│  Select Network                 │
│  ┌──────┐┌──────┐┌──────┐┌─────┐│
│  │  MTN ││AIRTEL││  GLO ││9MOB ││ ← network tabs (chips)
│  └──────┘└──────┘└──────┘└─────┘│
│  (MTN selected = highlighted)   │
│                                 │
│  Choose a Plan                  │
│  ┌─────────────────────────┐   │
│  │ 1GB (30 Days)   ₦200   │   │ ← plan row
│  │ Save vs telco           │   │
│  ├─────────────────────────┤   │
│  │ 2GB (30 Days)   ₦380   │   │ ← plan row (selected = blue border)
│  ├─────────────────────────┤   │
│  │ 5GB (30 Days)   ₦900  ★│   │ ← ★ = popular
│  ├─────────────────────────┤   │
│  │ 10GB (30 Days)  ₦1,700 │   │
│  └─────────────────────────┘   │
│                                 │
│  Recipient Phone Number         │
│  ┌─────────────────────────┐   │
│  │📞 080XXXXXXXX           │   │
│  └─────────────────────────┘   │
│                                 │
│  ─────────────────────────────  │
│  MTN 2GB (30 Days)              │
│  Recipient: 08012345678         │
│  Cost: ₦380                    │
│  Balance after: ₦11,880        │
│                                 │
│  ┌─────────────────────────┐   │
│  │     PAY ₦380 →          │   │
│  └─────────────────────────┘   │
│                                 │
│  💰 Your balance: ₦12,260      │
└─────────────────────────────────┘
```

---

## Screen 8: Success Screen

```
┌─────────────────────────────────┐
│          STATUS BAR             │
├─────────────────────────────────┤
│                                 │
│                                 │
│            ✅                   │ ← large animated checkmark
│         (animated)              │
│                                 │
│    Transaction Successful!      │ ← H1
│                                 │
│  ┌─────────────────────────┐   │ ← details card
│  │ MTN 5GB (30 Days)       │   │
│  │ Delivered to:           │   │
│  │ 08012345678             │   │
│  │                         │   │
│  │ Amount Paid: ₦1,000     │   │
│  │ New Balance: ₦11,260    │   │
│  │ Ref: TXN-20260608-XYZ   │   │
│  │ Date: Jun 8, 2:30 PM    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │     BACK TO HOME        │   │ ← primary button
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │   BUY AGAIN             │   │ ← outline button
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## Screen 9: Transactions Screen

```
┌─────────────────────────────────┐
│        Transactions             │ ← header
├─────────────────────────────────┤
│                                 │
│  ┌─────┐┌─────┐┌─────┐┌─────┐  │ ← filter chips
│  │ All ││Data ││Air  ││Sold │  │
│  └─────┘└─────┘└─────┘└─────┘  │
│                                 │
│  Today                          │ ← date group header
│  ┌─────────────────────────┐   │
│  │📡 Buy Data              │   │
│  │   MTN 5GB → 0801...     │   │
│  │   2:30 PM    −₦1,000 ✅│   │
│  ├─────────────────────────┤   │
│  │💰 Sold Data             │   │
│  │   Airtel 2GB ×3         │   │
│  │   11:15 AM   +₦1,140 ✅│   │
│  └─────────────────────────┘   │
│                                 │
│  Yesterday                      │
│  ┌─────────────────────────┐   │
│  │💳 Wallet Funded         │   │
│  │   Card payment          │   │
│  │   09:00 AM   +₦5,000 ✅│   │
│  ├─────────────────────────┤   │
│  │📲 Buy Airtime           │   │
│  │   MTN → 0802...         │   │
│  │   08:45 AM   −₦500 ✅  │   │
│  └─────────────────────────┘   │
│                                 │
│  [Load More]                    │
├─────────────────────────────────┤
│  🏠 Home  📡 Data  📲 Air  👤 Me│
└─────────────────────────────────┘
```

---

## Screen 10: Profile Screen

```
┌─────────────────────────────────┐
│        Profile                  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │  ┌────┐  Adewale Johnson│   │ ← avatar (initials) + name
│  │  │ AJ │  08012345678    │   │
│  │  └────┘                 │   │
│  │  ✅ Verified (KYC badge)│   │
│  └─────────────────────────┘   │
│                                 │
│  ACCOUNT                        │ ← section header
│  ┌─────────────────────────┐   │
│  │ 🪪 KYC Status  Verified →│   │
│  ├─────────────────────────┤   │
│  │ 💳 My Wallet         →  │   │
│  ├─────────────────────────┤   │
│  │ 📋 Transactions      →  │   │
│  └─────────────────────────┘   │
│                                 │
│  SECURITY                       │
│  ┌─────────────────────────┐   │
│  │ 🔑 Change PIN        →  │   │
│  ├─────────────────────────┤   │
│  │ 👆 Biometric Login  ○●  │   │ ← toggle switch
│  └─────────────────────────┘   │
│                                 │
│  SUPPORT                        │
│  ┌─────────────────────────┐   │
│  │ ❓ Help & Support    →  │   │
│  ├─────────────────────────┤   │
│  │ 📜 Terms of Service  →  │   │
│  ├─────────────────────────┤   │
│  │ 🔒 Privacy Policy    →  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🚪 LOG OUT             │   │ ← destructive red text
│  └─────────────────────────┘   │
│                                 │
│  Version 1.0.0                  │ ← small gray footer
├─────────────────────────────────┤
│  🏠 Home  📡 Data  📲 Air  👤 Me│
└─────────────────────────────────┘
```

---

## Component States Reference

### Input Component States

```
IDLE (unfocused, no error):
┌────────────────────────────────┐
│ 📞 080XXXXXXXX                 │  border: #E5E7EB (gray300)
└────────────────────────────────┘

FOCUSED (animated border transition 180ms):
┌────────────────────────────────┐
│ 📞 080XXXXXXXX                 │  border: #1565C0 (primary)
└────────────────────────────────┘

ERROR (validation failed):
┌────────────────────────────────┐
│ 📞 080XXXXXXXX                 │  border: #EF4444 (error red)
└────────────────────────────────┘
  Enter a valid Nigerian phone number   ← error text, red, small

DISABLED:
┌────────────────────────────────┐
│ 📞 080XXXXXXXX                 │  background: #F9FAFB, text dim
└────────────────────────────────┘
```

### Button States

```
PRIMARY (default):      [    PAY ₦380    ]  bg: #1565C0, white text
PRIMARY (loading):      [  ⟳ Loading... ]  bg: #1565C0, spinner
PRIMARY (disabled):     [    PAY ₦380    ]  bg: #93C5FD, text dimmed
OUTLINE:                [  USE BIOMETRIC ]  border: #1565C0, blue text
DESTRUCTIVE:            [   LOG OUT      ]  bg: #EF4444, white text
```

---

## Color Usage Map

| Screen Element | Color Token | Hex |
|----------------|-------------|-----|
| Primary button BG | COLORS.primary | #1565C0 |
| Header gradient start | — | #0D47A1 |
| Header gradient end | — | #1565C0 |
| Card background | COLORS.white | #FFFFFF |
| Screen background | COLORS.background | #F8FAFC |
| Body text | COLORS.gray900 | #111827 |
| Subtitle / hint | COLORS.gray500 | #6B7280 |
| Input border (default) | COLORS.gray300 | #E5E7EB |
| Error | COLORS.error | #EF4444 |
| Error background | COLORS.errorLight | #FEE2E2 |
| Success | COLORS.success | #10B981 |
| Warning | COLORS.warning | #F59E0B |
| Credit amount (green) | COLORS.success | #10B981 |
| Debit amount (default) | COLORS.gray900 | #111827 |
| Demo banner BG | — | #EBF2FF |
| Demo banner border | — | #C5D8FF |
