# Database Design / Entity Relationship Diagram
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

---

## Overview

DataSwap uses a **relational database** (PostgreSQL in production) with the following core entities. The mobile app's current in-memory mock service mirrors this schema for development/testing.

---

## Entity Relationship Diagram (ASCII)

```
┌──────────────────────────────┐
│           USERS              │
├──────────────────────────────┤
│ PK  id             VARCHAR   │
│     phone          VARCHAR   │◄─────────────────────┐
│     email          VARCHAR   │                      │
│     full_name      VARCHAR   │                      │
│     password_hash  VARCHAR   │                      │
│     pin_hash       VARCHAR   │                      │
│     is_phone_verified BOOL   │                      │
│     biometric_enabled BOOL   │                      │
│     kyc_status     ENUM      │                      │
│     wallet_balance DECIMAL   │                      │
│     created_at     TIMESTAMP │                      │
│     updated_at     TIMESTAMP │                      │
│     last_login     TIMESTAMP │                      │
│     is_active      BOOL      │                      │
│     is_locked      BOOL      │                      │
│     failed_attempts INT      │                      │
│     lock_until     TIMESTAMP │                      │
└──────────┬───────────────────┘                      │
           │ 1                                        │
           │                                          │
     ┌─────┴──────┐   ┌─────────────────────┐        │
     │            │   │                     │        │
     │ 1..1       │   │ 1..1                │        │
     ▼            ▼   ▼                     │        │
┌────────────┐ ┌──────────────────────┐     │        │
│  KYC_DATA  │ │     WALLET           │     │        │
├────────────┤ ├──────────────────────┤     │        │
│ PK id      │ │ PK  id               │     │        │
│ FK user_id │ │ FK  user_id          │     │        │
│ bvn_hash   │ │     balance  DECIMAL │     │        │
│ nin_hash   │ │     currency VARCHAR │     │        │
│ dob DATE   │ │     created_at       │     │        │
│ address    │ │     updated_at       │     │        │
│ state      │ └──────────┬───────────┘     │        │
│ id_type    │            │ 1               │        │
│ id_number  │            │ 1..*            │        │
│ id_front   │            ▼                 │        │
│ id_back    │ ┌──────────────────────────┐ │        │
│ selfie_url │ │      TRANSACTIONS        │ │        │
│ status     │ ├──────────────────────────┤ │        │
│ submitted  │ │ PK  id          VARCHAR  │ │        │
│ reviewed   │ │ FK  user_id     VARCHAR  │─┘        │
│ reviewer   │ │ FK  wallet_id   VARCHAR  │          │
│ reason     │ │     type        ENUM     │          │
│ created_at │ │     amount      DECIMAL  │          │
└────────────┘ │     fee         DECIMAL  │          │
               │     status      ENUM     │          │
               │     description VARCHAR  │          │
               │     reference   VARCHAR  │          │
               │     recipient   VARCHAR  │          │
               │     network     ENUM     │          │
               │     plan_id     VARCHAR  │─────────►│
               │     bank_code   VARCHAR  │          │
               │     acct_no     VARCHAR  │          │
               │     acct_name   VARCHAR  │          │
               │     metadata    JSONB    │          │
               │     created_at  TIMESTAMP│          │
               │     updated_at  TIMESTAMP│          │
               └──────────────────────────┘          │
                                                      │
┌──────────────────────────────┐                     │
│        DATA_PLANS            │◄────────────────────┘
├──────────────────────────────┤
│ PK  id          VARCHAR      │
│     network     ENUM         │
│     size_gb     DECIMAL      │
│     duration_days INT        │
│     name        VARCHAR      │
│     market_price DECIMAL     │
│     buy_price   DECIMAL      │  (price to buyer)
│     sell_payout DECIMAL      │  (76% of market)
│     is_active   BOOL         │
│     created_at  TIMESTAMP    │
└──────────┬───────────────────┘
           │ 1
           │ 1..*
           ▼
┌──────────────────────────────┐
│       INVENTORY              │
├──────────────────────────────┤
│ PK  id          VARCHAR      │
│ FK  plan_id     VARCHAR      │
│     quantity    INT          │
│     acquired_at TIMESTAMP    │
│     source      VARCHAR      │  (user_sell | manual | api)
│     cost_price  DECIMAL      │
└──────────────────────────────┘

┌──────────────────────────────┐
│       OTP_CODES              │
├──────────────────────────────┤
│ PK  id          VARCHAR      │
│     phone       VARCHAR      │
│     code        VARCHAR      │  (hashed)
│     purpose     ENUM         │  (verify | reset)
│     expires_at  TIMESTAMP    │
│     used        BOOL         │
│     attempts    INT          │
│     created_at  TIMESTAMP    │
└──────────────────────────────┘

┌──────────────────────────────┐
│     PAYMENT_SESSIONS         │
├──────────────────────────────┤
│ PK  id            VARCHAR    │
│ FK  user_id       VARCHAR    │
│     reference     VARCHAR    │  (Paystack ref)
│     amount        DECIMAL    │
│     method        ENUM       │  (card|transfer|ussd)
│     status        ENUM       │  (pending|success|failed)
│     gateway       VARCHAR    │  (paystack|flutterwave)
│     gateway_ref   VARCHAR    │
│     created_at    TIMESTAMP  │
│     completed_at  TIMESTAMP  │
└──────────────────────────────┘

┌──────────────────────────────┐
│      AUDIT_LOGS              │
├──────────────────────────────┤
│ PK  id          VARCHAR      │
│ FK  user_id     VARCHAR      │
│     action      VARCHAR      │
│     entity_type VARCHAR      │
│     entity_id   VARCHAR      │
│     old_value   JSONB        │
│     new_value   JSONB        │
│     ip_address  INET         │
│     device_id   VARCHAR      │
│     created_at  TIMESTAMP    │
└──────────────────────────────┘
```

---

## Table Definitions

### USERS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK, NOT NULL | ULID format `usr_xxxxxxxxxx` |
| phone | VARCHAR(15) | UNIQUE, NOT NULL | Nigerian phone (+234 format stored) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Lowercase, validated |
| full_name | VARCHAR(100) | NOT NULL | Min 2 chars, letters + spaces |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt, cost 12 |
| pin_hash | VARCHAR(255) | NULLABLE | bcrypt of 4-digit PIN |
| is_phone_verified | BOOLEAN | DEFAULT false | Set true on OTP verify |
| biometric_enabled | BOOLEAN | DEFAULT false | |
| kyc_status | ENUM | NOT NULL | `not_started | pending | verified | rejected` |
| wallet_balance | DECIMAL(15,2) | DEFAULT 0.00 | Denominated in NGN kobo (× 100) |
| created_at | TIMESTAMPTZ | NOT NULL | UTC |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| last_login | TIMESTAMPTZ | NULLABLE | |
| is_active | BOOLEAN | DEFAULT true | |
| is_locked | BOOLEAN | DEFAULT false | |
| failed_attempts | INTEGER | DEFAULT 0 | Reset on success |
| lock_until | TIMESTAMPTZ | NULLABLE | 15-minute window |

---

### KYC_DATA
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK | `kyc_xxxxxxxxxx` |
| user_id | VARCHAR(26) | FK → USERS, UNIQUE | One KYC record per user |
| bvn_hash | VARCHAR(255) | NOT NULL | SHA-256 of BVN (never stored plain) |
| nin_hash | VARCHAR(255) | NULLABLE | SHA-256 of NIN |
| date_of_birth | DATE | NOT NULL | |
| address | TEXT | NOT NULL | |
| state | VARCHAR(50) | NOT NULL | Nigerian state |
| id_type | ENUM | NOT NULL | `national_id | drivers_license | passport | voters_card` |
| id_number | VARCHAR(50) | NOT NULL | Encrypted AES-256 |
| id_front_url | VARCHAR(500) | NOT NULL | S3/CloudFront URL |
| id_back_url | VARCHAR(500) | NULLABLE | Not required for passport |
| selfie_url | VARCHAR(500) | NOT NULL | |
| status | ENUM | NOT NULL | `pending | verified | rejected` |
| submitted_at | TIMESTAMPTZ | NOT NULL | |
| reviewed_at | TIMESTAMPTZ | NULLABLE | |
| reviewed_by | VARCHAR(26) | NULLABLE | FK → ADMINS |
| rejection_reason | TEXT | NULLABLE | |
| created_at | TIMESTAMPTZ | NOT NULL | |

---

### WALLET
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK | `wal_xxxxxxxxxx` |
| user_id | VARCHAR(26) | FK → USERS, UNIQUE | |
| balance | DECIMAL(15,2) | DEFAULT 0.00 CHECK ≥ 0 | Balance in NGN |
| currency | VARCHAR(3) | DEFAULT 'NGN' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

> **Note:** Wallet balance is the **source of truth**. It is derived from transactions but cached here for fast reads. A background reconciliation job runs every 5 minutes to verify consistency.

---

### TRANSACTIONS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK | `txn_xxxxxxxxxx` |
| user_id | VARCHAR(26) | FK → USERS, NOT NULL | |
| wallet_id | VARCHAR(26) | FK → WALLET, NOT NULL | |
| type | ENUM | NOT NULL | `fund_card | fund_transfer | fund_ussd | buy_data | sell_data | buy_airtime | withdraw` |
| amount | DECIMAL(15,2) | NOT NULL, CHECK > 0 | |
| fee | DECIMAL(15,2) | DEFAULT 0.00 | Platform fee |
| balance_before | DECIMAL(15,2) | NOT NULL | Snapshot |
| balance_after | DECIMAL(15,2) | NOT NULL | Snapshot |
| status | ENUM | NOT NULL | `pending | success | failed | reversed` |
| description | VARCHAR(255) | NOT NULL | Human-readable |
| reference | VARCHAR(100) | UNIQUE, NOT NULL | Internal ref `TXN-XXXXXXXX` |
| recipient_phone | VARCHAR(15) | NULLABLE | For data/airtime delivery |
| network | ENUM | NULLABLE | `mtn | airtel | glo | 9mobile` |
| plan_id | VARCHAR(26) | FK → DATA_PLANS, NULLABLE | |
| bank_code | VARCHAR(10) | NULLABLE | For withdrawals |
| account_number | VARCHAR(10) | NULLABLE | NUBAN |
| account_name | VARCHAR(100) | NULLABLE | Verified account name |
| payment_ref | VARCHAR(100) | NULLABLE | Paystack/gateway ref |
| metadata | JSONB | NULLABLE | Extra context |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

### DATA_PLANS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK | `pln_xxxxxxxxxx` |
| network | ENUM | NOT NULL | `mtn | airtel | glo | 9mobile` |
| size_gb | DECIMAL(6,2) | NOT NULL | e.g., 1.5 for 1.5GB |
| duration_days | INTEGER | NOT NULL | e.g., 30 |
| display_name | VARCHAR(100) | NOT NULL | "MTN 5GB (30 Days)" |
| market_price | DECIMAL(10,2) | NOT NULL | Telco retail price (NGN) |
| our_buy_price | DECIMAL(10,2) | NOT NULL | What we pay users (76%) |
| our_sell_price | DECIMAL(10,2) | NOT NULL | What buyers pay us |
| is_active | BOOLEAN | DEFAULT true | |
| sort_order | INTEGER | DEFAULT 0 | Display ordering |
| created_at | TIMESTAMPTZ | NOT NULL | |

---

### INVENTORY
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK | `inv_xxxxxxxxxx` |
| plan_id | VARCHAR(26) | FK → DATA_PLANS, NOT NULL | |
| quantity | INTEGER | NOT NULL, CHECK ≥ 0 | Available units |
| low_stock_threshold | INTEGER | DEFAULT 10 | Alert below this |
| source | ENUM | DEFAULT 'user_sell' | `user_sell | manual | api_purchase` |
| last_restocked_at | TIMESTAMPTZ | NULLABLE | |
| created_at | TIMESTAMPTZ | NOT NULL | |

---

### OTP_CODES
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK | |
| phone | VARCHAR(15) | NOT NULL | |
| code_hash | VARCHAR(255) | NOT NULL | bcrypt of 6-digit code |
| purpose | ENUM | NOT NULL | `phone_verify | password_reset` |
| expires_at | TIMESTAMPTZ | NOT NULL | 10 minutes from creation |
| used | BOOLEAN | DEFAULT false | Single-use |
| attempt_count | INTEGER | DEFAULT 0 | Max 3 before lockout |
| created_at | TIMESTAMPTZ | NOT NULL | |

---

### PAYMENT_SESSIONS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(26) | PK | |
| user_id | VARCHAR(26) | FK → USERS, NOT NULL | |
| reference | VARCHAR(100) | UNIQUE, NOT NULL | Paystack reference |
| amount | DECIMAL(15,2) | NOT NULL | |
| method | ENUM | NOT NULL | `card | bank_transfer | ussd` |
| status | ENUM | DEFAULT 'pending' | `pending | success | failed | expired` |
| gateway | VARCHAR(20) | DEFAULT 'paystack' | |
| gateway_reference | VARCHAR(100) | NULLABLE | |
| callback_data | JSONB | NULLABLE | Raw webhook payload |
| created_at | TIMESTAMPTZ | NOT NULL | |
| completed_at | TIMESTAMPTZ | NULLABLE | |

---

## Relationships Summary

| Parent | Child | Cardinality | FK |
|--------|-------|-------------|-----|
| USERS | KYC_DATA | 1:1 | kyc_data.user_id |
| USERS | WALLET | 1:1 | wallet.user_id |
| USERS | TRANSACTIONS | 1:N | transactions.user_id |
| USERS | OTP_CODES | 1:N | otp_codes.phone |
| USERS | PAYMENT_SESSIONS | 1:N | payment_sessions.user_id |
| USERS | AUDIT_LOGS | 1:N | audit_logs.user_id |
| WALLET | TRANSACTIONS | 1:N | transactions.wallet_id |
| DATA_PLANS | INVENTORY | 1:1 | inventory.plan_id |
| DATA_PLANS | TRANSACTIONS | 1:N | transactions.plan_id |

---

## Enum Reference

### `kyc_status`
```sql
CREATE TYPE kyc_status AS ENUM ('not_started', 'pending', 'verified', 'rejected');
```

### `transaction_type`
```sql
CREATE TYPE transaction_type AS ENUM (
  'fund_card', 'fund_transfer', 'fund_ussd',
  'buy_data', 'sell_data', 'buy_airtime',
  'withdraw'
);
```

### `transaction_status`
```sql
CREATE TYPE transaction_status AS ENUM ('pending', 'success', 'failed', 'reversed');
```

### `network`
```sql
CREATE TYPE network AS ENUM ('mtn', 'airtel', 'glo', '9mobile');
```

### `id_type`
```sql
CREATE TYPE id_type AS ENUM ('national_id', 'drivers_license', 'passport', 'voters_card');
```

---

## Indexes

```sql
-- Users lookups
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);

-- Transaction queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- OTP cleanup
CREATE INDEX idx_otp_phone_purpose ON otp_codes(phone, purpose);
CREATE INDEX idx_otp_expires_at ON otp_codes(expires_at);

-- Payment sessions
CREATE INDEX idx_payment_reference ON payment_sessions(reference);
CREATE INDEX idx_payment_user_id ON payment_sessions(user_id);
```

---

## Data Retention Policy

| Entity | Retention | Reason |
|--------|-----------|--------|
| USERS | Indefinite (while active) | Account data |
| TRANSACTIONS | 7 years | CBN financial regulation |
| KYC_DATA (docs) | 5 years after account closure | NDPR / KYC compliance |
| OTP_CODES | 24 hours after expiry | Auto-deleted by cron |
| AUDIT_LOGS | 5 years | Fraud investigation |
| PAYMENT_SESSIONS | 2 years | Dispute resolution |

---

## Security Notes

- **BVN / NIN**: Never stored in plaintext. Stored as SHA-256 hash (for uniqueness checking). Actual lookup via NIMC API only at KYC submission time.
- **Passwords / PINs**: bcrypt with cost factor 12.
- **ID numbers**: AES-256-GCM encrypted at rest; decryption key in AWS KMS.
- **KYC images**: S3 bucket with private ACL, CloudFront signed URLs (1-hour expiry), no public access.
- **Wallet balance**: `CHECK (balance >= 0)` constraint prevents negative balances at DB level. Application also validates.
