# DataSwap — Project Documentation

> **DataSwap** is a Nigerian fintech mobile application that lets users buy and sell mobile data bundles, purchase airtime, and manage a digital wallet — all from one app. Built with React Native (Expo SDK 54) and targeting the Nigerian telecom market (MTN, Airtel, Glo, 9Mobile).

---

## About This Repository

This repository contains the complete professional documentation suite for the DataSwap app — covering everything from product requirements and user stories through to deployment runbooks and maintenance procedures.

All documents follow industry-standard formats: MoSCoW prioritisation, Gherkin acceptance criteria, IEEE SRS structure, and Agile sprint planning.

---

## Documentation Index

| # | Document | Description |
|---|----------|-------------|
| 01 | [Product Requirements Document](01_PRD.md) | Vision, scope, MoSCoW-prioritised features, personas, success metrics |
| 02 | [User Stories](02_USER_STORIES.md) | 23 user stories across 6 epics in Gherkin format with story map |
| 03 | [User Flows](03_USER_FLOWS.md) | 12 ASCII flow diagrams — onboarding, login, buy/sell data, wallet, KYC |
| 04 | [Database ERD](04_DATABASE_ERD.md) | Full entity-relationship diagram: tables, columns, indexes, relationships |
| 05 | [System Architecture](05_SYSTEM_ARCHITECTURE.md) | 3-tier architecture, AWS deployment, external integrations, security layers |
| 06 | [API Documentation](06_API_DOCUMENTATION.md) | All REST endpoints with request/response schemas, error codes, SDK notes |
| 07 | [UI Design](07_UI_DESIGN.md) | ASCII high-fidelity mockups for every screen, component states, colour map |
| 08 | [Design System](08_DESIGN_SYSTEM.md) | Colour tokens, typography, spacing grid, component library, iconography |
| 09 | [Functional Requirements](09_FUNCTIONAL_REQUIREMENTS.md) | 30 functional requirements (FR-AUTH, FR-KYC, FR-WAL, FR-DATA, FR-PROF) |
| 10 | [Non-Functional Requirements](10_NON_FUNCTIONAL_REQUIREMENTS.md) | Performance, availability, scalability, security, WCAG AA, CBN compliance |
| 11 | [Security Requirements](11_SECURITY_REQUIREMENTS.md) | Threat model, BVN/NIN handling policy, fraud detection, incident response |
| 12 | [Acceptance Criteria](12_ACCEPTANCE_CRITERIA.md) | Given/When/Then scenarios for every feature; Definition of Done checklist |
| 13 | [Project Roadmap](13_PROJECT_ROADMAP.md) | 3-phase roadmap: MVP → Post-MVP → Scale; sprints, risks, cost breakdown |
| 14 | [Test Plan](14_TEST_PLAN.md) | Unit, integration, component, E2E, and security test suites; exit criteria |
| 15 | [Deployment & Maintenance Plan](15_DEPLOYMENT_MAINTENANCE.md) | EAS builds, CI/CD pipeline, zero-downtime deploy, monitoring, runbooks |

---

## App Overview

### Core Features
- **Buy Data** — purchase data bundles for any Nigerian network at competitive rates
- **Sell Data** — sell unused data bundles back to DataSwap for instant wallet credit (76% of market value)
- **Buy Airtime** — top up any Nigerian number across all four networks
- **Digital Wallet** — fund via card/bank transfer, withdraw to any Nigerian bank account
- **KYC Verification** — CBN-compliant 3-tier identity verification (BVN + NIN + selfie)
- **Transaction History** — full audit trail with filtering and search

### Supported Networks
| Network | Brand Colour |
|---------|-------------|
| MTN | `#FFCC00` |
| Airtel | `#E31E24` |
| Glo | `#007A3D` |
| 9Mobile | `#006633` |

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Mobile App | React Native 0.79.2, Expo SDK 54 (New Architecture) |
| State Management | React Context API (AuthContext + WalletContext) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| Icons | Expo Vector Icons — Ionicons |
| Payments | Paystack |
| KYC | Smile ID / Dojah |
| VTU Provider | VTPass |
| OTP / SMS | Termii |
| Backend Infra | AWS ECS + RDS (PostgreSQL) + ElastiCache (Redis) |

---

## Architecture Summary

```
┌─────────────────────────────────────┐
│         React Native App            │
│  (Expo SDK 54 / New Architecture)   │
└──────────────┬──────────────────────┘
               │ HTTPS / REST
┌──────────────▼──────────────────────┐
│         Node.js API Server          │
│    (AWS ECS — Auto Scaling)         │
├─────────────────────────────────────┤
│  PostgreSQL (RDS)  │  Redis (Cache) │
└──────────────┬──────────────────────┘
               │
   ┌───────────┼───────────┐
   ▼           ▼           ▼
Paystack    Smile ID    VTPass
(Payments)   (KYC)      (VTU)
```

---

## Security Highlights

- BVN and NIN are **never stored in plaintext** — SHA-256 hash only, never transmitted to the client
- All API traffic over TLS 1.3
- JWT access tokens (15 min TTL) + refresh tokens (30 days)
- 6-digit transaction PIN, bcrypt-hashed
- OTP brute-force protection (5 attempts → 15-min lockout)
- CBN KYC Tier compliance (Tier 1 / Tier 2 / Tier 3 limits enforced)
- NDPR data processing consent captured at registration

---

## Project Phases

| Phase | Timeline | Milestone |
|-------|----------|-----------|
| **Phase 1 — MVP** | Jun – Aug 2026 | Core wallet, buy/sell data, KYC, Paystack integration |
| **Phase 2 — Post-MVP** | Sep – Nov 2026 | Admin dashboard, push notifications, referrals, iOS |
| **Phase 3 — Scale** | 2027 | B2B API, bill payments, savings, super-app features |

---

## Demo Account

A pre-verified demo account is available for testing without requiring real personal data:

| Field | Value |
|-------|-------|
| Phone | `08000000000` |
| Password | `Demo@1234` |
| KYC Status | Verified |
| Balance | ₦12,260 |

> **Note:** Real BVN or NIN is never required for testing. The demo account uses placeholder identity values.

---

## Repository Structure

```
docs/
├── 01_PRD.md
├── 02_USER_STORIES.md
├── 03_USER_FLOWS.md
├── 04_DATABASE_ERD.md
├── 05_SYSTEM_ARCHITECTURE.md
├── 06_API_DOCUMENTATION.md
├── 07_UI_DESIGN.md
├── 08_DESIGN_SYSTEM.md
├── 09_FUNCTIONAL_REQUIREMENTS.md
├── 10_NON_FUNCTIONAL_REQUIREMENTS.md
├── 11_SECURITY_REQUIREMENTS.md
├── 12_ACCEPTANCE_CRITERIA.md
├── 13_PROJECT_ROADMAP.md
├── 14_TEST_PLAN.md
├── 15_DEPLOYMENT_MAINTENANCE.md
├── SRS.md
└── WIREFRAMES.md
```

---

## Author

**betanaijaboi** — DataSwap Project

---

*Documentation generated as part of the DataSwap MVP development cycle — Phase 1 (Jun 2026)*
