# Security Requirements
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

> DataSwap handles real money and sensitive identity data. Security is not optional — it is a launch blocker. This document defines all security controls required before production deployment.

---

## 1. Threat Model

### Assets to Protect
| Asset | Sensitivity | Impact if Compromised |
|-------|------------|----------------------|
| User wallet balance | Critical | Direct financial loss |
| BVN / NIN data | Critical | Identity theft, regulatory fine |
| Password / PIN | High | Account takeover |
| JWT tokens | High | Account takeover |
| KYC documents (ID images, selfies) | High | Identity fraud |
| Transaction history | Medium | Privacy violation |
| Email / phone | Medium | Spam, phishing |

### Primary Threats
1. **Account Takeover** — brute force, credential stuffing, phishing
2. **Wallet Fraud** — unauthorized withdrawals, double-spend attempts
3. **Identity Theft** — exfiltration of BVN/NIN/KYC documents
4. **Man-in-the-Middle** — intercepting API traffic
5. **SQL Injection / API Abuse** — unauthorized data access
6. **Insider Threat** — malicious admin, database access

---

## 2. Authentication Security (SR-AUTH)

### SR-AUTH-001 — Password Requirements
The system shall enforce passwords with:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character from: `!@#$%^&*()_+-=[]{}|;:,.<>?`
- Maximum 128 characters
- Reject passwords in top-10,000 common password list (Phase 2)

Storage: bcrypt with minimum cost factor 12.

---

### SR-AUTH-002 — PIN Security
- 4-digit numeric PIN stored as bcrypt hash (cost factor 10)
- 5 consecutive wrong PINs: lock PIN entry for 30 minutes
- PIN must differ from the 5 most recently used PINs (Phase 2)
- PIN required for: withdraw, buy data > ₦5,000, sell data

---

### SR-AUTH-003 — Token Security
```
Access Token:
  Algorithm: RS256 (asymmetric — private key signs, public key verifies)
  Expiry: 24 hours
  Payload: { sub, phone, kycStatus, iat, exp }
  Storage (mobile): expo-secure-store (hardware-backed keychain)

Refresh Token:
  Algorithm: RS256
  Expiry: 30 days
  Rotation: New refresh token issued on each use (one-time use)
  Storage: httpOnly, secure, sameSite=Strict cookie (web) / SecureStore (mobile)
  Invalidation: Stored in Redis with TTL; checked on every refresh
```

---

### SR-AUTH-004 — OTP Security
- OTPs: cryptographically random 6-digit codes (not sequential)
- Stored as bcrypt hash (cost 10) — never plaintext
- Valid for exactly 10 minutes
- Single-use (marked used immediately on first successful verify)
- Rate limit: 3 OTP requests per phone per hour
- Failed attempt limit: 3 attempts → 5-minute lockout
- OTP delivery channel: SMS only (not email in v1.0)

---

### SR-AUTH-005 — Brute Force Protection
| Attack Surface | Limit | Lockout |
|----------------|-------|---------|
| Login attempts | 5 per account | 15 minutes |
| OTP verification | 3 per session | 5 minutes |
| PIN entry | 5 per session | 30 minutes |
| Password reset OTP | 3 per hour | 1 hour |
| API (general) | 100 req/min per user | 429 response |
| API (auth endpoints) | 20 req/min per IP | 429 response |

Implementation: Redis with sliding window rate limiter.

---

### SR-AUTH-006 — Session Invalidation
The system shall invalidate sessions when:
- User logs out explicitly
- Password is changed (all existing tokens invalidated)
- PIN is changed
- Account is locked/suspended
- Token is revoked by admin
- Suspicious activity detected (automatic)

---

## 3. Data Protection (SR-DATA)

### SR-DATA-001 — Data Classification

| Data Type | Classification | Storage | Transmission |
|-----------|---------------|---------|--------------|
| BVN | Restricted | SHA-256 hash only | Never transmitted to client |
| NIN | Restricted | SHA-256 hash only | Never transmitted to client |
| ID images | Confidential | S3 private, AES-256 | Signed URL (1hr expiry) |
| Selfie images | Confidential | S3 private, AES-256 | Signed URL (1hr expiry) |
| Password | Restricted | bcrypt hash | Never stored/transmitted plain |
| PIN | Restricted | bcrypt hash | Never stored/transmitted plain |
| Wallet balance | Confidential | PostgreSQL (encrypted at rest) | HTTPS only |
| Transaction data | Confidential | PostgreSQL (encrypted at rest) | HTTPS only |
| Phone / Email | Internal | PostgreSQL | HTTPS only |

---

### SR-DATA-002 — BVN/NIN Handling
```
COLLECTION:
  User enters BVN in app → transmitted over HTTPS
  
SERVER PROCESSING:
  1. BVN received in request body
  2. SHA-256 hash computed immediately
  3. Hash stored in database (for uniqueness checking only)
  4. BVN forwarded to NIMC/BVN verification API via encrypted channel
  5. Plaintext BVN discarded from memory immediately after verification call
  6. NEVER written to logs, NEVER stored in database

API RESPONSES:
  All API responses with KYC data mask BVN/NIN:
  "bvn": "***7890" (show last 4 digits only)
  
ADMIN ACCESS:
  Admins see: masked BVN, verification result (match/no-match), not raw BVN
```

---

### SR-DATA-003 — Encryption at Rest
- Database: AWS RDS with AES-256 encryption enabled
- S3 buckets: Server-side encryption (SSE-S3 with AES-256)
- Sensitive fields (ID numbers): additional application-level AES-256-GCM encryption
- Encryption keys managed by AWS KMS (automatic rotation every 90 days)

---

### SR-DATA-004 — Encryption in Transit
- All API endpoints: HTTPS/TLS 1.3 mandatory
- TLS 1.0 and 1.1: disabled at load balancer level
- Weak cipher suites: disabled (only TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256)
- HTTP Strict Transport Security (HSTS) header: `max-age=31536000; includeSubDomains`
- Certificate pinning in mobile app (Phase 2 — post-launch hardening)

---

### SR-DATA-005 — Data Minimization
- Only collect data necessary for KYC compliance
- Do not log PII (phone, BVN, NIN, amounts) in application logs
- Use structured logging with PII fields redacted: `phone: "0801****678"`
- Analytics events shall not include wallet amounts or identity data

---

## 4. API Security (SR-API)

### SR-API-001 — Input Validation
Every API endpoint shall:
- Validate all inputs using Zod schema validation (server-side)
- Reject requests with unexpected fields (strict mode)
- Enforce maximum field lengths
- Sanitize all string inputs before database insertion
- Use parameterized queries exclusively (no string interpolation in SQL)

---

### SR-API-002 — CORS Policy
```
Allowed origins: https://dataswap.ng, https://admin.dataswap.ng
Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: Content-Type, Authorization
Credentials: true (for cookie-based refresh)
Max age: 86400 seconds
```
Mobile app uses direct HTTPS — CORS applies to web/admin only.

---

### SR-API-003 — Security Headers
All API responses shall include:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

---

### SR-API-004 — Webhook Security
Paystack webhooks shall be verified by:
1. Computing HMAC-SHA512 of raw request body using Paystack secret key
2. Comparing with `x-paystack-signature` header (constant-time comparison)
3. Rejecting any webhook that fails signature verification
4. Idempotency: process each webhook reference only once (deduplication via Redis)

---

### SR-API-005 — Audit Logging
The system shall log all of the following to immutable audit trail:
- User login (success + failure with IP, device)
- Password changes, PIN changes
- KYC submission and status changes
- All wallet transactions (debit/credit)
- Admin actions (approve/reject KYC, freeze account, manual credit)
- Failed authorization attempts
- Token revocation

Audit logs: write-only (no delete/update) for 5 years.

---

## 5. Mobile App Security (SR-MOBILE)

### SR-MOBILE-001 — Secure Storage
| Data | Storage Mechanism |
|------|------------------|
| JWT access token | `expo-secure-store` (AES via Keystore/Keychain) |
| Refresh token | `expo-secure-store` |
| Biometric enabled flag | `expo-secure-store` |
| PIN hash | `expo-secure-store` |
| Onboarding seen flag | `AsyncStorage` (non-sensitive) |

SecureStore key naming: alphanumeric + `.`, `-`, `_` only (enforced by expo).

---

### SR-MOBILE-002 — Jailbreak/Root Detection
- Phase 1: Warn user if jailbreak/root detected (don't block)
- Phase 2: Block app on jailbroken/rooted devices (use `expo-device` + native check)

---

### SR-MOBILE-003 — Screenshot Protection
- Screens showing wallet balance and transaction history: disable screenshots on Android (`FLAG_SECURE`)
- KYC screens (showing ID images): disable screenshots
- Other screens: screenshots allowed

---

### SR-MOBILE-004 — Auto-Lock
- App locks (returns to PIN entry) after 5 minutes of background
- Full logout after 24 hours of inactivity
- Biometric re-authentication on foreground after 5-minute lock

---

### SR-MOBILE-005 — Debug/Reverse Engineering Protection
- Strip debug symbols in production builds (`hermes` bytecode, not raw JS)
- Obfuscate sensitive API URLs in production
- Remove all `console.log` statements in production builds
- Disable React Native DevTools in production

---

## 6. Infrastructure Security (SR-INFRA)

### SR-INFRA-001 — Network Security
- All services in private VPC subnets (no direct internet access)
- API Gateway / ALB only public-facing component
- Database: no public endpoint, VPC-only access
- Redis: VPC-only, no public endpoint
- S3 buckets: all private ACL, no public access

---

### SR-INFRA-002 — Access Control
- Principle of least privilege for all IAM roles
- No hardcoded AWS credentials anywhere in codebase
- Secrets via AWS Secrets Manager (not environment variables for production)
- Admin console: IP allowlisting for known office/VPN IPs
- MFA required for all admin AWS console access

---

### SR-INFRA-003 — Vulnerability Management
- Dependency scanning: `npm audit` in CI pipeline (fail on high/critical)
- Container scanning: AWS ECR image scanning
- OWASP dependency check monthly
- Penetration testing annually (Phase 2 — before public launch)

---

## 7. Fraud Prevention (SR-FRAUD)

### SR-FRAUD-001 — Transaction Monitoring
The system shall automatically flag for review:
- Single transaction ≥ ₦500,000
- Total daily withdrawals ≥ ₦1,000,000
- More than 10 withdrawal attempts in one hour
- Sell data ≥ 50 units in one transaction
- Login from new device within 24 hours of password change

---

### SR-FRAUD-002 — Velocity Checks
| Action | Limit (per 24h) | Behaviour on Exceed |
|--------|----------------|---------------------|
| Data purchases | 20 | Block + admin review |
| Airtime purchases | 10 | Block + admin review |
| Data sales | 10 | Block + admin review |
| Withdrawal attempts | 3 | Block + admin review |
| Fund wallet attempts | 5 | Block + require verification |

---

### SR-FRAUD-003 — Duplicate Transaction Prevention
- Idempotency keys required for all wallet mutations
- Same reference cannot be processed twice (Redis deduplication, 24-hour window)
- Payment webhook deduplication via reference uniqueness

---

## 8. Incident Response

### SR-INC-001 — Classification
| Severity | Definition | Response Time | Examples |
|----------|-----------|---------------|---------|
| P1 | Financial data breach or unauthorized wallet access | 15 minutes | DB compromised, wallets drained |
| P2 | Authentication bypass or mass account lockout | 1 hour | OTP bypass, JWT secret leaked |
| P3 | Data leak (non-financial) | 4 hours | Phone numbers exposed |
| P4 | Security bug found (not exploited) | 24 hours | XSS found in admin panel |

---

### SR-INC-002 — User Notification
- Affected users notified within 72 hours of confirmed data breach
- Notification includes: what happened, what data affected, what user should do
- NITDA notified within 72 hours (NDPR requirement)

---

## Security Checklist (Launch Gate)

Before any production deployment, ALL of the following must be verified:

- [ ] All API endpoints use HTTPS only
- [ ] No BVN/NIN in database in plaintext
- [ ] No passwords/PINs in database in plaintext
- [ ] No sensitive data in application logs
- [ ] Paystack webhook signature verification working
- [ ] Account lockout working for login, OTP, PIN
- [ ] SecureStore used for all sensitive mobile data
- [ ] All S3 buckets have private ACL
- [ ] Database not publicly accessible
- [ ] `npm audit` shows 0 high/critical vulnerabilities
- [ ] All hardcoded test credentials removed from code
- [ ] Rate limiting active on all auth endpoints
- [ ] Security headers present on all responses
- [ ] Demo account (`08000000000`) has dummy BVN/NIN only (`00000000000`)
