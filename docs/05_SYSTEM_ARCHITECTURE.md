# System Architecture
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

---

## Architecture Overview

DataSwap follows a **3-tier mobile-first architecture**: React Native mobile client → RESTful API backend → PostgreSQL data store, with external service integrations for payments, KYC, and telco fulfillment.

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
├────────────────────────┬────────────────────────────────────────┤
│  Android App           │  iOS App                               │
│  React Native 0.79.2   │  React Native 0.79.2                  │
│  Expo SDK 54           │  Expo SDK 54                           │
│  (Primary)             │  (Secondary — Phase 2)                │
└───────────┬────────────┴───────────────┬────────────────────────┘
            │  HTTPS / TLS 1.3           │
            │  JWT Bearer Token          │
            ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                  │
│               (AWS API Gateway + CloudFront CDN)                │
│    Rate Limiting · DDoS Protection · SSL Termination           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐
│  AUTH SERVICE       │   │  CORE API SERVICE   │
│  Node.js / Express  │   │  Node.js / Express  │
│                     │   │                     │
│  · Registration     │   │  · Wallet CRUD      │
│  · Login / Logout   │   │  · Transactions     │
│  · OTP verify       │   │  · Buy Data         │
│  · Password reset   │   │  · Sell Data        │
│  · JWT issuance     │   │  · Buy Airtime      │
│  · PIN management   │   │  · Withdraw         │
│  · Biometric flags  │   │  · Data Plans       │
└──────────┬──────────┘   └──────────┬──────────┘
           │                          │
           └──────────┬───────────────┘
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
┌─────────────────────┐   ┌─────────────────────┐
│   KYC SERVICE       │   │  NOTIFICATION SVC   │
│                     │   │                     │
│  · Submit KYC       │   │  · SMS (OTP)        │
│  · Get status       │   │  · Push notifs      │
│  · Admin review     │   │  · Email            │
│  · BVN/NIN verify   │   │                     │
└──────────┬──────────┘   └──────────┬──────────┘
           │                          │
           ▼                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────┐    ┌──────────────────────────────┐  │
│   │  PostgreSQL DB  │    │  Redis Cache                 │  │
│   │  (Primary)      │    │                              │  │
│   │                 │    │  · Session tokens            │  │
│   │  · Users        │    │  · OTP rate limits           │  │
│   │  · Wallets      │    │  · Data plan cache (5min)    │  │
│   │  · Transactions │    │  · Balance cache (30sec)     │  │
│   │  · KYC Data     │    │  · Inventory cache (1min)    │  │
│   │  · Data Plans   │    │                              │  │
│   │  · Inventory    │    └──────────────────────────────┘  │
│   └─────────────────┘                                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## External Integrations

```
┌──────────────────────────────────────────────────────────────┐
│                EXTERNAL SERVICES                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PAYMENT                    KYC / IDENTITY                   │
│  ┌─────────────────┐        ┌─────────────────────────────┐ │
│  │   Paystack      │        │   Smile Identity / Dojah    │ │
│  │                 │        │                             │ │
│  │ · Card payments │        │ · BVN verification          │ │
│  │ · Bank transfer │        │ · NIN verification          │ │
│  │ · Virtual accts │        │ · Liveness check            │ │
│  │ · USSD          │        │ · Document OCR              │ │
│  │ · Payouts       │        └─────────────────────────────┘ │
│  └─────────────────┘                                         │
│                                                              │
│  TELCO / VTU                INFRASTRUCTURE                   │
│  ┌─────────────────┐        ┌─────────────────────────────┐ │
│  │  VTpass / NGSub │        │   AWS                       │ │
│  │                 │        │                             │ │
│  │ · MTN VTU API   │        │ · EC2 (App servers)         │ │
│  │ · Airtel VTU    │        │ · RDS (PostgreSQL)          │ │
│  │ · Glo VTU       │        │ · ElastiCache (Redis)       │ │
│  │ · 9Mobile VTU   │        │ · S3 (KYC doc storage)      │ │
│  │ · Airtime APIs  │        │ · CloudFront (CDN)          │ │
│  └─────────────────┘        │ · SQS (message queue)       │ │
│                              │ · CloudWatch (monitoring)   │ │
│  SMS GATEWAY                 │ · KMS (key management)      │ │
│  ┌─────────────────┐        └─────────────────────────────┘ │
│  │  Termii / AFRO  │                                         │
│  │  MESSAGE        │                                         │
│  │ · OTP delivery  │                                         │
│  │ · Alerts        │                                         │
│  └─────────────────┘                                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Mobile App Architecture (React Native)

```
src/
├── App.js                    — Root: providers, splash, nav
├── navigation/
│   └── AppNavigator.js       — Stack + Tab navigators
├── context/
│   ├── AuthContext.js        — Auth state + actions (global)
│   └── WalletContext.js      — Wallet state + actions (global)
├── screens/
│   ├── OnboardingScreen.js   — 3-slide onboarding
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── OTPScreen.js
│   │   ├── KYCScreen.js
│   │   ├── KYCPendingScreen.js
│   │   └── PINSetupScreen.js
│   └── main/
│       ├── HomeScreen.js
│       ├── BuyDataScreen.js
│       ├── SellDataScreen.js
│       ├── BuyAirtimeScreen.js
│       ├── FundWalletScreen.js
│       ├── WithdrawScreen.js
│       ├── TransactionsScreen.js
│       ├── ProfileScreen.js
│       └── SuccessScreen.js
├── components/
│   ├── Input.js              — Animated TextInput wrapper
│   ├── Button.js             — Pressable with loading state
│   └── [shared components]
├── services/
│   ├── authService.js        — Mock auth (→ real API)
│   ├── walletService.js      — Mock wallet (→ real API)
│   ├── dataService.js        — Mock data marketplace
│   └── kycService.js         — Mock KYC submission
└── utils/
    ├── constants.js          — COLORS, SIZES, app config
    ├── validators.js         — phone, email, BVN, NIN, etc.
    └── formatters.js         — currency, date, masks
```

---

## State Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  GLOBAL STATE (React Context)                │
├──────────────────────────┬──────────────────────────────────┤
│     AuthContext          │      WalletContext               │
│  ─────────────────────   │  ─────────────────────────────  │
│  · user (object)         │  · balance (number)             │
│  · isAuthenticated       │  · transactions (array)         │
│  · isLoading             │  · isLoading                    │
│  · hasPIN                │                                 │
│  · biometricEnabled      │  Actions:                       │
│                          │  · getBalance()                 │
│  Actions:                │  · fundWallet(amount, method)  │
│  · login(creds)          │  · buyData(plan, phone)         │
│  · register(data)        │  · sellData(plan, qty)          │
│  · logout()              │  · buyAirtime(network, phone)  │
│  · verifyOTP(code)       │  · withdraw(amount, bank)       │
│  · submitKYC(data)       │  · getTransactions()            │
│  · setPIN(pin)           │                                 │
│  · authenticate()        │                                 │
└──────────────────────────┴──────────────────────────────────┘

LOCAL STATE (useState / useRef — per screen)
  · Form values (phone, password, amount, etc.)
  · Validation errors
  · Loading states per action
  · Animation values (Animated.Value)
  · UI state (show/hide password, selected tab)
```

---

## API Architecture (Backend — Phase 2 Production)

### Base URL
```
Production:  https://api.dataswap.ng/v1
Staging:     https://staging-api.dataswap.ng/v1
```

### Authentication
```
All protected endpoints require:
  Authorization: Bearer <JWT_ACCESS_TOKEN>

JWT Payload:
{
  "sub": "usr_xxxxxxxxxx",
  "phone": "08012345678",
  "kyc_status": "verified",
  "iat": 1717200000,
  "exp": 1717286400     // 24 hours
}

Refresh flow:
  POST /auth/refresh with refresh_token cookie (httpOnly, 30 days)
```

### Rate Limiting
| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 attempts | 15 min per IP |
| POST /auth/otp/send | 3 requests | 60 min per phone |
| POST /auth/otp/verify | 3 attempts | 10 min per phone |
| All other | 100 requests | 1 min per user |

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TRANSPORT       HTTPS/TLS 1.3 everywhere                   │
│                  Certificate pinning in mobile app          │
│                                                             │
│  AUTHENTICATION  JWT (access: 24h, refresh: 30d)           │
│                  bcrypt passwords (cost 12)                 │
│                  bcrypt PINs (cost 10)                      │
│                  expo-secure-store for device secrets       │
│                                                             │
│  AUTHORIZATION   Role-based: user | admin | super_admin    │
│                  Resource ownership check (can only        │
│                  access own wallet/transactions)            │
│                                                             │
│  DATA            AES-256-GCM for PII at rest               │
│                  SHA-256 hash for BVN/NIN (lookup only)    │
│                  S3 private buckets + signed URLs           │
│                  PostgreSQL row-level security (RLS)        │
│                                                             │
│  NETWORK         AWS WAF rules                             │
│                  DDoS protection via CloudFront            │
│                  IP allowlisting for admin dashboard        │
│                                                             │
│  APPLICATION     Input validation (Zod schemas)            │
│                  SQL injection prevention (parameterised)   │
│                  XSS prevention (output encoding)           │
│                  CSRF tokens for web endpoints              │
│                                                             │
│  MONITORING      CloudWatch alerts: failed logins, errors  │
│                  Automated account lockout                  │
│                  Fraud scoring on large transactions        │
│                  Real-time wallet reconciliation job        │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
                     ┌─────────────┐
                     │   Route53   │  DNS
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │ CloudFront  │  CDN + DDoS
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │ API Gateway │  Rate limit, auth
                     └──────┬──────┘
                            │
               ┌────────────┴────────────┐
               │                         │
        ┌──────▼──────┐         ┌────────▼──────┐
        │  ECS Task   │         │   ECS Task    │
        │  Auth Svc   │         │   Core API    │
        │  (t3.small) │         │   (t3.medium) │
        └──────┬──────┘         └────────┬──────┘
               │                         │
               └──────────┬──────────────┘
                          │
            ┌─────────────┴──────────────┐
            │                            │
     ┌──────▼──────┐             ┌───────▼──────┐
     │  RDS Multi  │             │  ElastiCache  │
     │  PostgreSQL │             │  Redis        │
     │  (db.t3.med)│             │  (cache.t3.sm)│
     └─────────────┘             └───────────────┘
```

---

## Development vs Production Comparison

| Aspect | Development (Current) | Production (Target) |
|--------|----------------------|---------------------|
| Auth | In-memory mock | JWT + PostgreSQL |
| Storage | JavaScript Map/Array | PostgreSQL + Redis |
| Payments | Simulated | Paystack live API |
| KYC | Mock status | Smile ID / Dojah |
| VTU | Simulated delivery | VTpass API |
| SMS/OTP | Console.log | Termii SMS gateway |
| Push Notifs | None | Expo Push Notifications |
| Hosting | Expo Go local | AWS ECS + CloudFront |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (p50) | < 200ms |
| API Response Time (p99) | < 1,000ms |
| App Cold Start | < 3 seconds |
| Transaction Processing | < 2 seconds (buy/sell) |
| Wallet Balance Load | < 500ms |
| Data Plan List Load | < 300ms (cached) |
| App Bundle Size | < 20MB |
| API Availability | 99.9% (< 8.7 hrs/year downtime) |
