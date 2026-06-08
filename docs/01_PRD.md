# Product Requirements Document (PRD)
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026  |  **Owner:** Product Team  |  **Status:** Approved

---

## 1. Problem Statement

### The Problem
Nigeria has over **219 million active SIM cards** and is one of the world's largest mobile data markets. However, Nigerians routinely lose hundreds of millions of naira worth of unused data every month because:

1. **Data plans expire before being fully used** — a user buys a 10GB plan but only uses 4GB; the remaining 6GB expires worthless.
2. **There is no marketplace to monetize unused data** — users cannot resell, transfer (across different phones), or receive value for leftover allocations.
3. **Buying data is still expensive through official channels** — telcos charge retail rates; there is no discount marketplace.
4. **Airtime top-ups are inconvenient** — users often need airtime for others but must use unreliable USSD or third-party apps with high failure rates.
5. **Informal resellers exist but are unsafe** — data hawkers on WhatsApp and social media exist, but buyers face fraud risk with no recourse.

### The Opportunity
DataSwap creates a **trusted, CBN-compliant, KYC-verified marketplace** where:
- Sellers convert unused data into real wallet money (instant, fair rate)
- Buyers get data and airtime at market-competitive prices with guaranteed delivery
- The company earns a sustainable margin on every transaction

---

## 2. Target Users

### Primary: Data Sellers
- **Demographics:** Nigerian adults 18–45, students and working professionals
- **Behavior:** Regularly buy data bundles, often have leftover data nearing expiry
- **Pain Point:** Losing money when purchased data expires unused
- **Job to be Done:** Get fair compensation for data I already paid for but won't use

### Secondary: Data & Airtime Buyers
- **Demographics:** Nigerian adults 18–55, all income levels
- **Behavior:** Frequently top up data/airtime for self, family, employees
- **Pain Point:** Official channels are expensive; informal channels are risky
- **Job to be Done:** Buy data/airtime at a fair price from a trustworthy source

### Tertiary: Power Users (Both)
- **Demographics:** Students, small business owners, market traders
- **Behavior:** Buy data in bulk to resell; sell frequently to fund wallet for purchases
- **Pain Point:** No scalable, safe tool to manage data as a micro-income stream
- **Job to be Done:** Manage data as both inventory and currency efficiently

### Non-Target (for v1.0)
- Corporate/enterprise bulk buyers (Phase 2)
- International users outside Nigeria
- Users without smartphone or internet access

---

## 3. User Goals

| User Type | Goal | Priority |
|-----------|------|----------|
| Seller | Get instant wallet credit for unused data | Critical |
| Seller | Know the payout rate before committing | Critical |
| Seller | Trust that payment will be immediate | Critical |
| Buyer | Buy data at competitive or lower-than-telco price | High |
| Buyer | Send data to any phone number instantly | High |
| Buyer | Fund wallet easily via existing payment methods | High |
| All | Withdraw earned money to bank account | Critical |
| All | Track all transactions in one place | Medium |
| All | Feel secure — money and identity are protected | Critical |
| All | Complete verification once, not repeatedly | High |

---

## 4. Business Goals

### Primary (Year 1)
| Goal | Target | Timeline |
|------|--------|----------|
| Register verified users | 50,000 KYC-verified accounts | 12 months |
| Monthly transaction volume | ₦500M GMV | Month 12 |
| Data plans processed | 200,000 transactions/month | Month 12 |
| App store rating | ≥ 4.4 stars | Month 6 |

### Revenue Goals
| Stream | Description | Target (Year 1) |
|--------|-------------|-----------------|
| Buy/Sell Spread | Buy at 76%, sell at 100% → 24% margin | ₦48M |
| Withdrawal Fee | 1% capped at ₦50 per withdrawal | ₦2.4M |
| **Total Year 1 Revenue** | | **₦50.4M** |

### Strategic Goals
1. Become the **#1 trusted data resale platform** in Nigeria within 2 years
2. Establish compliance-first reputation with CBN and NIMC
3. Build data infrastructure to offer **B2B bulk data deals** by Year 2
4. Position for **Series A fundraising** by end of Year 2

---

## 5. Success Metrics (KPIs)

### Acquisition
| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|
| Total Downloads | 5,000 | 20,000 | 80,000 |
| KYC Verified Users | 2,000 | 12,000 | 50,000 |
| KYC Completion Rate | ≥ 60% | ≥ 65% | ≥ 70% |

### Engagement
| Metric | Target |
|--------|--------|
| DAU/MAU Ratio | ≥ 25% |
| Avg. Sessions per User/Week | ≥ 3 |
| Avg. Transactions per User/Month | ≥ 5 |
| D7 Retention | ≥ 40% |
| D30 Retention | ≥ 25% |

### Financial
| Metric | Target |
|--------|--------|
| Monthly GMV Growth | ≥ 20% MoM (first 6 months) |
| Average Transaction Value | ≥ ₦800 |
| Wallet Funding Conversion | ≥ 55% of registered users fund wallet in Month 1 |
| Sell-to-Buy Ratio | 1:3 (for every ₦1 sold, ₦3 bought) |

### Quality
| Metric | Target |
|--------|--------|
| Transaction Success Rate | ≥ 99.5% |
| App Crash Rate | < 0.1% of sessions |
| API Uptime | ≥ 99.9% |
| KYC Approval Turnaround | ≤ 24 hours |
| Customer Support Response | ≤ 2 hours |

---

## 6. Feature Prioritization (MoSCoW)

### MUST HAVE (MVP — Launch Blocker)
| # | Feature | Rationale |
|---|---------|-----------|
| M1 | User registration + phone OTP | Core onboarding |
| M2 | KYC (BVN + NIN + ID + selfie) | CBN compliance |
| M3 | 4-digit transaction PIN | Financial security |
| M4 | Wallet balance & history | Core wallet experience |
| M5 | Fund wallet (card + bank transfer) | Users need money in app |
| M6 | Withdraw to bank account | Users need to get money out |
| M7 | Buy data (MTN, Airtel, Glo, 9Mobile) | Core value proposition |
| M8 | Sell data to company | Core differentiator |
| M9 | Buy airtime | High frequency use case |
| M10 | Transaction history | Trust & transparency |

### SHOULD HAVE (Post-MVP, within 60 days)
| # | Feature | Rationale |
|---|---------|-----------|
| S1 | Biometric login (Face ID / fingerprint) | Security UX improvement |
| S2 | Push notifications (transaction alerts) | Engagement & trust |
| S3 | Forgot password flow | Standard auth feature |
| S4 | Admin KYC review dashboard (web) | Required for verification ops |
| S5 | Referral program (earn ₦500 per referral) | Viral growth |
| S6 | Bank account management (save accounts) | UX improvement for repeat withdrawals |
| S7 | USSD payment option | Reach users without card |

### COULD HAVE (Phase 2, 90+ days)
| # | Feature | Rationale |
|---|---------|-----------|
| C1 | Data gifting (send to contacts) | Social feature |
| C2 | Recurring buy schedule | Convenience for regular buyers |
| C3 | Bill payments (electricity, DSTV) | Super-app expansion |
| C4 | Bulk data purchase (B2B) | Business market |
| C5 | Loyalty/cashback program | Retention |
| C6 | In-app chat support | Support cost reduction |
| C7 | Data usage tracker widget | Engagement |

### WON'T HAVE (v1.0)
| # | Feature | Reason |
|---|---------|--------|
| W1 | Crypto wallet | CBN regulatory risk |
| W2 | International transfers | Out of scope, regulatory complexity |
| W3 | Data lending/credit | Risk model not ready |
| W4 | Web version | Mobile-first strategy |

---

## 7. Assumptions & Dependencies

### Assumptions
- CBN maintains current mobile money policy throughout development
- Paystack API remains available and reliable (SLA ≥ 99.9%)
- NIMC NIN verification API accessible via licensed gateway
- Telco APIs (MTN VTU, Airtel, Glo, 9Mobile) available for data top-up
- App Store and Google Play approve the app without financial service restrictions

### Dependencies
| Dependency | Owner | Risk | Mitigation |
|-----------|-------|------|-----------|
| Paystack integration | Engineering | Medium | Test with sandbox; have Flutterwave as fallback |
| NIMC NIN API | Compliance | High | Use licensed aggregator (Smile ID / Dojah) |
| CBN compliance approval | Legal | High | Engage CBN-licensed mobile money operator as partner |
| Telco VTU APIs | Engineering | Medium | Use VTU aggregator (VTpass / Recharge & Get) |
| App Store approval | Product | Low | Follow financial app guidelines strictly |

---

## 8. Out of Scope (v1.0)
- Admin web dashboard (documented but not built in v1.0 — manual KYC review via email)
- iOS-specific Apple Pay integration
- Offline transaction queuing
- Multi-currency support
- Voice/USSD interface

---

*Approved by: Product, Engineering, Compliance*  
*Next PRD review: September 2026*
