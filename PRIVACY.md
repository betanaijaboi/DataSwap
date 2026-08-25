# Privacy Policy — DataSwap

Last updated: 2026-08-25

DataSwap collects sensitive personal and financial data. This policy is
written to NDPA 2023's higher bar for sensitive personal data, not the
baseline consent flow.

## What we collect

- **Account info:** name, email, phone number.
- **KYC / sensitive identity data:** Bank Verification Number (BVN),
  National Identity Number (NIN), and a selfie photo, verified through
  Smile ID/Dojah.
- **Financial data:** wallet balance, transaction history, funding/
  withdrawal bank account details (processed by Paystack).
- **Security data:** hashed transaction PIN (bcrypt — never stored or
  transmitted in plaintext), biometric login is handled on-device by your
  phone's OS and never transmitted to us.
- **Device data:** used for fraud detection and OTP delivery (via Termii).

## Why we collect it

- BVN/NIN/selfie: required for CBN-aligned KYC identity verification
  before enabling data-selling, wallet withdrawal, or transactions above
  set limits.
- Transaction data: to process purchases, maintain your wallet balance,
  and provide your transaction history.
- Device/OTP data: fraud prevention and account security.

## Legal basis and consent

We collect BVN/NIN/selfie only with your explicit, informed consent,
given when you go through KYC verification. You can decline, but this
limits which features you can use (e.g., no wallet withdrawal without
verified KYC).

## Who we share it with

- **Smile ID / Dojah** — identity verification (BVN, NIN, selfie match).
- **Paystack** — payment processing, wallet funding/withdrawal.
- **VTPass** — fulfilling data/airtime purchases.
- **Termii** — OTP/SMS delivery.
- **AWS (ECS/RDS/ElastiCache)** — infrastructure hosting.
- We do not sell your personal data to third parties for marketing.

## Security

- Transaction PINs are bcrypt-hashed, never stored or sent in plaintext.
- Sensitive data is encrypted in transit (HTTPS) and at rest (RDS
  encryption).
- Given the sensitivity of BVN/NIN data, a formal Data Protection Impact
  Assessment (DPIA) is recommended before this handles real users at
  scale — see [[Legal Protection Guide]] for what that involves.

## Your rights (NDPA 2023)

You can request access to, correction of, or deletion of your data. Note:
some KYC and transaction records must be retained for a minimum period
under Nigerian anti-money-laundering rules even after a deletion request
— we'll tell you what can and can't be deleted when you ask.

## Data retention

Account and transaction data is retained while your account is active and
for the period required by applicable financial-recordkeeping law after
closure.

## Contact / Data Protection queries

Budoessien2331@outlook.com
