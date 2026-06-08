# Project Roadmap & Milestones
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

---

## Timeline Overview

```
2026         Jun      Jul      Aug      Sep      Oct      Nov      Dec
             │────────│────────│────────│────────│────────│────────│
PHASE 1      ████████████████████
MVP          │   Dev Complete   │ QA+Beta│ Launch │
             │                  │        │        │
PHASE 2                                  ████████████████████
POST-MVP                                 │ Admin  │ Features │
                                         │ Panel  │ + Growth │
PHASE 3                                                       ████████
SCALE                                                         │B2B+  │
```

---

## Phase 1: MVP (June – August 2026)

### Milestone 1.1 — Development Complete
**Target Date:** July 18, 2026  
**Status:** In Progress 🔄

#### Sprint 1 (Jun 9 – Jun 22): Core App Shell ✅
| Task | Status |
|------|--------|
| App.js splash screen fix | ✅ Done |
| Input.js cursor cascade fix (Animated.Value) | ✅ Done |
| AuthContext, WalletContext setup | ✅ Done |
| Navigator (Auth Stack + Main Tab) | ✅ Done |
| Constants, validators, formatters utils | ✅ Done |

#### Sprint 2 (Jun 23 – Jul 6): Auth + Onboarding
| Task | Target | Status |
|------|--------|--------|
| Onboarding slides (3-screen) | Jun 27 | ✅ Done |
| Login screen + demo account | Jun 27 | ✅ Done |
| Register screen + validation | Jun 28 | ✅ Done |
| OTP verification screen | Jun 30 | ✅ Done |
| PIN setup screen | Jul 1 | ✅ Done |
| Password reset flow | Jul 6 | 🔄 Todo |
| Auth service integration | Jul 6 | ✅ Done (mock) |

#### Sprint 3 (Jul 7 – Jul 13): KYC Flow
| Task | Target | Status |
|------|--------|--------|
| KYC step 1 — Personal Info | Jul 8 | ✅ Done |
| KYC step 2 — Documents | Jul 9 | ✅ Done |
| KYC step 3 — Selfie capture | Jul 10 | ✅ Done |
| KYC step 4 — Review + Submit | Jul 11 | ✅ Done |
| KYC Pending screen | Jul 11 | ✅ Done |
| KYC service (mock) | Jul 12 | ✅ Done |

#### Sprint 4 (Jul 14 – Jul 18): Wallet + Marketplace
| Task | Target | Status |
|------|--------|--------|
| Home screen — wallet card + quick actions | Jul 14 | ✅ Done |
| Fund Wallet screen | Jul 15 | ✅ Done |
| Withdraw screen | Jul 15 | ✅ Done |
| Buy Data screen | Jul 16 | ✅ Done |
| Sell Data screen | Jul 16 | ✅ Done |
| Buy Airtime screen | Jul 17 | ✅ Done |
| Transactions screen | Jul 17 | ✅ Done |
| Profile screen | Jul 18 | ✅ Done |
| Success screen (shared) | Jul 18 | ✅ Done |

---

### Milestone 1.2 — Quality Assurance
**Target Date:** August 1, 2026  

| Task | Target |
|------|--------|
| Manual functional testing (all flows) | Jul 22 |
| Android device testing (multiple devices) | Jul 24 |
| Performance testing (slow 3G simulation) | Jul 25 |
| Security review (OWASP Mobile Top 10) | Jul 28 |
| Bug fixes from QA | Jul 30 |
| UAT with 5 beta users | Aug 1 |

**Exit Criteria:**
- All P1 acceptance criteria passing
- Zero P1 bugs open
- App stable on 3 different Android device models
- Demo account flows fully functional

---

### Milestone 1.3 — Beta Launch
**Target Date:** August 10, 2026  

| Task | Target |
|------|--------|
| Backend API development (replacing mock services) | Aug 5 |
| Paystack integration (sandbox) | Aug 5 |
| KYC provider integration (Smile ID / Dojah — sandbox) | Aug 6 |
| VTU provider integration (VTpass — sandbox) | Aug 7 |
| Invite-only beta: 100 users | Aug 10 |
| Monitor for 2 weeks, fix issues | Aug 24 |

---

### Milestone 1.4 — Public Launch (MVP)
**Target Date:** September 1, 2026  

| Task | Target |
|------|--------|
| Paystack live credentials | Aug 26 |
| KYC provider go-live | Aug 27 |
| VTU provider go-live | Aug 28 |
| Google Play Store submission | Aug 29 |
| Marketing landing page (dataswap.ng) | Aug 30 |
| Social media accounts active | Aug 31 |
| **PUBLIC LAUNCH** 🚀 | Sep 1 |

**Launch Success Criteria:**
- App available on Google Play Store
- 100 downloads in first week
- 50 KYC verifications completed
- Zero P1 (financial/security) bugs
- Transaction success rate ≥ 98%

---

## Phase 2: Post-MVP (September – November 2026)

### Milestone 2.1 — Admin Dashboard (Sep 2026)
| Feature | Target |
|---------|--------|
| Admin web app (React + Tailwind) | Sep 15 |
| KYC review interface | Sep 20 |
| User management (search, freeze, credit) | Sep 25 |
| Transaction monitoring dashboard | Sep 30 |

### Milestone 2.2 — Push Notifications (Oct 2026)
| Feature | Target |
|---------|--------|
| Expo Push Notifications setup | Oct 5 |
| Transaction alerts (funded, purchased, sold, withdrawn) | Oct 8 |
| KYC status notifications | Oct 10 |
| Low balance alerts | Oct 12 |

### Milestone 2.3 — Growth Features (Oct–Nov 2026)
| Feature | Target |
|---------|--------|
| Referral program (₦500 per verified referral) | Oct 20 |
| Biometric login (Face ID / fingerprint) | Oct 25 |
| USSD payment option | Oct 28 |
| Forgot password flow | Nov 1 |
| Save bank accounts (repeat withdrawals) | Nov 5 |
| App Store (iOS) submission | Nov 15 |

### Milestone 2.4 — KPIs at End of Phase 2
| Metric | Target |
|--------|--------|
| Total downloads | 20,000 |
| KYC verified users | 8,000 |
| Monthly transaction volume | ₦100M GMV |
| App store rating | ≥ 4.3 stars |
| D30 retention | ≥ 25% |

---

## Phase 3: Scale (December 2026+)

### Milestone 3.1 — B2B Features (Q1 2027)
- Bulk data purchase portal (corporate clients)
- Business wallet (multi-user)
- Invoice/receipt generation
- API access for resellers

### Milestone 3.2 — Super App Expansion (Q2 2027)
- Bill payments (DSTV, electricity, water)
- Data usage tracker
- Loyalty/cashback program
- Recurring data purchase scheduler

### Milestone 3.3 — Financial Services (Q3 2027)
- CBN Mobile Money Operator partnership
- Savings features (earn interest on idle balance)
- Data-backed micro-loans (data as collateral)
- Bank account integration (view balance in app)

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Paystack API downtime | Low | Critical | Flutterwave as automatic fallback |
| NIMC NIN API slowness | Medium | High | Use licensed aggregator with SLA |
| CBN regulatory change | Low | Critical | Engage CBN-licensed partner early |
| Google Play rejection | Low | High | Follow financial app guidelines strictly |
| VTU delivery failures | Medium | High | Multiple VTU providers, auto-reverse |
| Low KYC completion rate | Medium | High | Simplify KYC UX, progressive disclosure |
| Low adoption in first month | Medium | Medium | Referral program, influencer marketing |
| App crash on specific Android versions | Medium | High | Test on 5+ Android versions in CI |

---

## Resource Plan

### Development Team (Phase 1)
| Role | Count | Notes |
|------|-------|-------|
| Mobile Developer (React Native) | 1 | Full-stack for MVP |
| Backend Developer (Node.js) | 1 | Phase 1.3+ |
| Product Owner | 1 | Doubles as QA |
| Designer | Part-time | UI done in Phase 1 |

### Tools & Infrastructure Costs (Monthly, Production)
| Service | Cost (est.) |
|---------|------------|
| AWS EC2 (2× t3.small) | $30 |
| AWS RDS (db.t3.medium) | $45 |
| AWS ElastiCache | $15 |
| AWS S3 + CloudFront | $10 |
| Paystack (1.5% + ₦100 cap per tx) | Variable |
| Smile ID / Dojah (KYC) | ~₦200/verification |
| VTpass / VTU provider | 0.5% commission |
| Termii SMS | ~₦3/SMS |
| Sentry error tracking | Free tier |
| **Total infrastructure** | **~$100/month** |

---

## Definition of Launch Ready

The app is ready to launch publicly when:
- [ ] All MVP functional requirements implemented and tested
- [ ] All P1 acceptance criteria passing
- [ ] Paystack live integration tested end-to-end
- [ ] KYC integration live with at least 10 test verifications
- [ ] VTU delivery tested with at least 10 live purchases
- [ ] Security checklist in `11_SECURITY_REQUIREMENTS.md` 100% complete
- [ ] Privacy Policy and Terms of Service live at dataswap.ng
- [ ] Customer support channel active (WhatsApp or email)
- [ ] Google Play listing submitted and approved
- [ ] At least 20 beta users have completed the full onboarding + first transaction
