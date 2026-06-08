# Non-Functional Requirements
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

> Non-Functional Requirements (NFRs) define HOW the system performs, not what it does. These requirements define quality attributes that the entire system must satisfy.

---

## 1. Performance Requirements

### NFR-PERF-001 — API Response Time
| Endpoint Category | P50 Target | P95 Target | P99 Target |
|-------------------|-----------|-----------|-----------|
| Auth (login, register) | < 300ms | < 800ms | < 1,500ms |
| Balance fetch | < 150ms | < 400ms | < 800ms |
| Transaction list (paginated) | < 200ms | < 600ms | < 1,200ms |
| Buy data / airtime | < 500ms | < 1,200ms | < 2,500ms |
| Sell data | < 300ms | < 800ms | < 1,500ms |
| KYC submission (with uploads) | < 3,000ms | < 8,000ms | < 15,000ms |
| Withdrawal initiation | < 800ms | < 2,000ms | < 4,000ms |

---

### NFR-PERF-002 — App Startup Time
- **Cold start** (app not in memory): < 3 seconds on a mid-range Android device (2GB RAM)
- **Warm start** (app backgrounded): < 1 second
- Splash screen shall be hidden within 500ms of first render
- Data plan list shall appear within 300ms (served from cache)

---

### NFR-PERF-003 — Concurrent Users
The backend shall support:
- 500 concurrent active users at launch
- 5,000 concurrent users by Month 6
- 25,000 concurrent users by Month 12
- Auto-scaling triggered at 70% CPU utilization

---

### NFR-PERF-004 — Transaction Throughput
- Minimum 50 transactions/second (burst)
- Sustained 20 transactions/second (steady state)
- No degradation above these thresholds (graceful queuing)

---

### NFR-PERF-005 — App Bundle Size
- Initial download: < 20MB (APK / IPA compressed)
- OTA update delta: < 2MB per update
- RAM usage at idle: < 150MB
- RAM usage during transaction: < 250MB

---

## 2. Availability & Reliability Requirements

### NFR-AVAIL-001 — System Uptime
| Service | Target Uptime | Max Monthly Downtime |
|---------|--------------|---------------------|
| API (core + auth) | 99.9% | 43.8 minutes |
| Payment processing | 99.95% | 21.9 minutes |
| KYC service | 99.5% | 3.65 hours |
| Admin dashboard | 99.0% | 7.3 hours |

---

### NFR-AVAIL-002 — Planned Maintenance
- Maintenance windows: Sundays 2:00–4:00 AM WAT (low-traffic)
- Users notified 24 hours in advance via push notification
- Read-only mode (view balance/history) during maintenance

---

### NFR-AVAIL-003 — Disaster Recovery
- Recovery Time Objective (RTO): < 1 hour for P1 incidents
- Recovery Point Objective (RPO): < 15 minutes (maximum data loss window)
- Automated database backups every 15 minutes
- Cross-region backup stored in AWS Lagos (af-south-1) + London (eu-west-2)

---

### NFR-AVAIL-004 — Fault Tolerance
- API service: 2 replicas minimum (N+1 redundancy)
- Database: Multi-AZ RDS with automatic failover (< 60 seconds)
- Payment gateway: Failover to Flutterwave if Paystack unavailable
- VTU provider: Failover to secondary provider if primary fails
- Queue-based processing for non-time-critical operations

---

## 3. Scalability Requirements

### NFR-SCALE-001 — Horizontal Scaling
- API servers shall scale horizontally (stateless, no server-side sessions)
- Auto-scaling group: min 2, max 20 instances
- Scale-out triggered: CPU > 70% for 3 minutes
- Scale-in triggered: CPU < 30% for 10 minutes

---

### NFR-SCALE-002 — Database Scaling
- Read replicas for analytics queries (1 replica minimum)
- Connection pooling via PgBouncer (max 100 app connections per instance)
- Partition transactions table by month after 1M records

---

### NFR-SCALE-003 — Growth Targets
The system shall remain within performance targets at:
- Year 1: 50,000 users, 200,000 monthly transactions
- Year 2: 500,000 users, 2,000,000 monthly transactions
- Year 3: 2,000,000 users, 10,000,000 monthly transactions

---

## 4. Security Requirements (Summary — see Doc 11 for full detail)

### NFR-SEC-001 — Data Encryption
- All API traffic: TLS 1.3 (TLS 1.2 minimum, 1.0/1.1 disabled)
- PII at rest: AES-256-GCM
- Passwords/PINs: bcrypt (cost ≥ 12)
- BVN/NIN: SHA-256 hash only (no plaintext ever)

---

### NFR-SEC-002 — Authentication
- JWT access tokens: 24-hour expiry, RS256 signing
- Refresh tokens: 30-day expiry, stored in httpOnly cookie
- Account lockout: 15 minutes after 5 failed login attempts
- OTP lockout: 5 minutes after 3 failed OTP attempts

---

### NFR-SEC-003 — Input Validation
- All inputs validated on both client and server
- SQL injection prevention: parameterized queries only (no string concatenation)
- No raw user input included in log messages (prevent log injection)

---

## 5. Usability Requirements

### NFR-USE-001 — Learnability
- A new user shall complete their first transaction within 5 minutes of download
- Onboarding shall not require external documentation
- All form validation errors shall appear inline (not in alerts)

---

### NFR-USE-002 — Error Recovery
- Any failed transaction shall show a clear error message with next steps
- No dead ends — every error screen shall have a "Try Again" or "Back to Home" action
- Form data shall be preserved if user navigates back (not wiped)

---

### NFR-USE-003 — Accessibility
- Minimum touch target: 44×44 points (Apple HIG / Google Material)
- Text contrast: 4.5:1 for body text (WCAG 2.1 AA)
- All interactive elements shall have `accessibilityLabel`
- Color shall not be the sole method of conveying information

---

### NFR-USE-004 — Localisation
- v1.0: English only
- All currency displayed in Nigerian Naira (₦) format
- Date format: "Jun 8, 2026" (no ambiguous MM/DD/YYYY)
- Phone numbers displayed in national format: 080XXXXXXXX

---

### NFR-USE-005 — Offline Handling
- Show clear "No internet connection" message (not a crash)
- Cached data (balance, transaction history) displayed when offline
- All wallet actions shall fail gracefully with "Check your connection" message
- No data corruption if app is force-closed mid-transaction

---

## 6. Maintainability Requirements

### NFR-MAINT-001 — Code Quality
- Test coverage: ≥ 80% for business logic (wallet, auth, KYC)
- Linting: ESLint with Airbnb config; zero warnings in CI
- No hardcoded strings (use constants file)
- All API errors handled (no unhandled promise rejections)

---

### NFR-MAINT-002 — Deployment
- Continuous deployment pipeline (GitHub Actions)
- Zero-downtime deployments (rolling updates on ECS)
- Feature flags for gradual rollout of new features
- One-command local dev setup (`npm install && npx expo start`)

---

### NFR-MAINT-003 — Monitoring & Observability
- Error tracking: Sentry (mobile + backend)
- Application metrics: AWS CloudWatch
- Uptime monitoring: Pingdom (1-minute checks)
- Database performance: AWS RDS Performance Insights
- Custom business metrics dashboard: Grafana
- Alert channels: PagerDuty (P1 incidents), Slack (P2/P3)

---

### NFR-MAINT-004 — Documentation
- All API endpoints documented (this document suite)
- Code-level JSDoc for public functions and context methods
- Runbooks for common operational tasks
- Incident response playbooks for P1 scenarios

---

## 7. Compliance Requirements

### NFR-COMP-001 — CBN Regulations
- Wallet transaction limits shall comply with CBN tiered KYC:
  | KYC Tier | Daily Limit | Balance Limit |
  |----------|------------|---------------|
  | Tier 1 (phone only) | ₦5,000 | ₦20,000 |
  | Tier 2 (BVN) | ₦50,000 | ₦300,000 |
  | Tier 3 (full KYC) | ₦1,000,000 | Unlimited |

---

### NFR-COMP-002 — NDPR (Nigeria Data Protection Regulation)
- Users must provide explicit consent before KYC data collection
- Users can request data deletion (processed within 30 days)
- Data processing purposes disclosed in Privacy Policy
- KYC data retained for 5 years (minimum, per regulation)

---

### NFR-COMP-003 — AML/KYC
- Transactions ≥ ₦500,000 flagged for manual review
- Suspicious activity patterns trigger automatic account review
- Transaction records retained for 7 years (CBN requirement)

---

## 8. Compatibility Requirements

### NFR-COMPAT-001 — Android
- Minimum supported: Android 8.0 (API 26)
- Target: Android 14 (API 34)
- Screen sizes: 360dp – 430dp width
- Architecture: ARM64-v8a, ARMv7a (x86_64 for emulators)

---

### NFR-COMPAT-002 — iOS (Phase 2)
- Minimum supported: iOS 15
- Target: iOS 17
- Devices: iPhone 8 and newer

---

### NFR-COMPAT-003 — Network
- App must function on 3G connections (minimum 1 Mbps)
- Graceful degradation on 2G (images compressed, lazy-loaded)
- No hard dependency on WiFi

---

## NFR Summary Matrix

| Category | Count | Critical |
|----------|-------|---------|
| Performance | 5 | All |
| Availability | 4 | AVAIL-001, 003 |
| Scalability | 3 | SCALE-001 |
| Security | 3 | All |
| Usability | 5 | USE-001, 002, 005 |
| Maintainability | 4 | MAINT-001, 003 |
| Compliance | 3 | All |
| Compatibility | 3 | COMPAT-001 |
| **Total** | **30** | |
