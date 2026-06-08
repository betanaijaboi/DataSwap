# API Documentation
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026  |  **Base URL:** `https://api.dataswap.ng/v1`

---

## Conventions

| Item | Convention |
|------|-----------|
| Protocol | HTTPS only (TLS 1.3) |
| Format | JSON (`Content-Type: application/json`) |
| Auth | `Authorization: Bearer <token>` on all protected routes |
| Dates | ISO 8601 UTC strings (`2026-06-08T14:30:00Z`) |
| Amounts | Always in **Naira** as decimal strings (`"1000.00"`) |
| Errors | Consistent `{ success: false, error: "...", code: "ERR_CODE" }` |
| IDs | ULID strings with prefix (e.g., `usr_01HXYZ...`, `txn_01HXYZ...`) |

---

## Response Envelope

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
```

### Error
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERR_INVALID_OTP",
  "details": { "field": "otp", "reason": "expired" }
}
```

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "ERR_VALIDATION",
  "details": {
    "fields": {
      "phone": "Enter a valid Nigerian phone number",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

## Error Codes Reference

| Code | HTTP | Meaning |
|------|------|---------|
| `ERR_VALIDATION` | 400 | Input validation failed |
| `ERR_PHONE_TAKEN` | 409 | Phone already registered |
| `ERR_EMAIL_TAKEN` | 409 | Email already registered |
| `ERR_INVALID_CREDENTIALS` | 401 | Wrong phone or password |
| `ERR_ACCOUNT_LOCKED` | 423 | Too many failed attempts |
| `ERR_INVALID_OTP` | 400 | Wrong OTP code |
| `ERR_OTP_EXPIRED` | 400 | OTP has expired |
| `ERR_OTP_MAX_ATTEMPTS` | 429 | Too many OTP attempts |
| `ERR_UNAUTHORIZED` | 401 | Missing or invalid token |
| `ERR_FORBIDDEN` | 403 | Not allowed (e.g., wrong user) |
| `ERR_NOT_FOUND` | 404 | Resource not found |
| `ERR_INSUFFICIENT_BALANCE` | 422 | Wallet balance too low |
| `ERR_KYC_REQUIRED` | 403 | Feature requires KYC verification |
| `ERR_PAYMENT_FAILED` | 402 | Gateway payment failed |
| `ERR_DELIVERY_FAILED` | 500 | VTU delivery failed (auto-reversed) |
| `ERR_RATE_LIMIT` | 429 | Too many requests |
| `ERR_SERVER` | 500 | Internal server error |

---

## 1. AUTH ENDPOINTS

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "fullName": "Adewale Johnson",
  "phone": "08012345678",
  "email": "adewale@example.com",
  "password": "SecurePass@1",
  "confirmPassword": "SecurePass@1"
}
```

**Validations:**
- `fullName`: 2–100 chars, letters and spaces only
- `phone`: Valid Nigerian format (07x, 08x, 09x, 11 digits)
- `email`: Valid email format
- `password`: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- `confirmPassword`: Must match `password`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_01HXZ4BKJMN",
    "phone": "08012345678",
    "message": "OTP sent to 0801***5678"
  }
}
```

**Error Responses:**
- `400 ERR_VALIDATION` — field errors
- `409 ERR_PHONE_TAKEN` — phone already registered
- `409 ERR_EMAIL_TAKEN` — email already registered

---

### POST /auth/otp/send
Request a new OTP (verify phone or reset password).

**Request Body:**
```json
{
  "phone": "08012345678",
  "purpose": "phone_verify"
}
```
`purpose`: `"phone_verify"` | `"password_reset"`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "maskedPhone": "0801***5678",
    "expiresIn": 600,
    "retryAfter": 60
  }
}
```

---

### POST /auth/otp/verify
Verify the submitted OTP code.

**Request Body:**
```json
{
  "phone": "08012345678",
  "code": "483921",
  "purpose": "phone_verify"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 ERR_INVALID_OTP` — wrong code
- `400 ERR_OTP_EXPIRED` — code expired
- `429 ERR_OTP_MAX_ATTEMPTS` — 3 wrong attempts

---

### POST /auth/login
Authenticate with phone and password.

**Request Body:**
```json
{
  "phone": "08012345678",
  "password": "SecurePass@1"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "dGhpcyBp...",
    "expiresIn": 86400,
    "user": {
      "id": "usr_01HXZ4BKJMN",
      "phone": "08012345678",
      "fullName": "Adewale Johnson",
      "kycStatus": "verified",
      "hasPIN": true,
      "biometricEnabled": false
    }
  }
}
```

**Error Responses:**
- `401 ERR_INVALID_CREDENTIALS`
- `423 ERR_ACCOUNT_LOCKED` — with `lockUntil` timestamp

---

### POST /auth/refresh
Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "dGhpcyBp..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "expiresIn": 86400
  }
}
```

---

### POST /auth/logout
Invalidate current tokens.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{ "success": true }
```

---

### POST /auth/password/forgot
Initiate password reset.

**Request Body:**
```json
{ "phone": "08012345678" }
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "OTP sent to 0801***5678" }
}
```

---

### POST /auth/password/reset
Complete password reset after OTP verification.

**Request Body:**
```json
{
  "phone": "08012345678",
  "resetToken": "eyJhbGci...",
  "newPassword": "NewPass@456",
  "confirmPassword": "NewPass@456"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Password updated successfully" }
}
```

---

### POST /auth/pin/setup
Set up 4-digit transaction PIN (first time).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "pin": "1234",
  "confirmPin": "1234"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "hasPIN": true }
}
```

---

### POST /auth/pin/verify
Verify PIN before sensitive actions.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{ "pin": "1234" }
```

**Response 200:**
```json
{
  "success": true,
  "data": { "verifyToken": "short-lived-verify-jwt", "expiresIn": 300 }
}
```

---

## 2. USER / KYC ENDPOINTS

### GET /users/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "usr_01HXZ4BKJMN",
    "phone": "08012345678",
    "email": "adewale@example.com",
    "fullName": "Adewale Johnson",
    "kycStatus": "verified",
    "hasPIN": true,
    "biometricEnabled": false,
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

### POST /kyc/submit
Submit KYC verification documents.

**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| dateOfBirth | string (YYYY-MM-DD) | Yes |
| address | string | Yes |
| state | string | Yes |
| bvn | string (11 digits) | Yes |
| nin | string (11 digits) | No |
| idType | enum | Yes |
| idNumber | string | Yes |
| idFrontImage | file (JPG/PNG, max 5MB) | Yes |
| idBackImage | file (JPG/PNG, max 5MB) | Conditional |
| selfieImage | file (JPG/PNG, max 5MB) | Yes |
| ndprConsent | boolean | Yes |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "kycId": "kyc_01HXZ4BKJMN",
    "status": "pending",
    "submittedAt": "2026-06-08T14:30:00Z",
    "message": "KYC submitted. Review takes 1–2 business days."
  }
}
```

---

### GET /kyc/status
Get current KYC status.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "verified",
    "submittedAt": "2026-06-08T14:30:00Z",
    "reviewedAt": "2026-06-09T10:15:00Z",
    "rejectionReason": null
  }
}
```

---

## 3. WALLET ENDPOINTS

### GET /wallet/balance
Get current wallet balance.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "balance": "12260.00",
    "currency": "NGN",
    "lastUpdated": "2026-06-08T14:29:59Z"
  }
}
```

---

### POST /wallet/fund/initiate
Initiate a wallet funding session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": "5000.00",
  "method": "card"
}
```
`method`: `"card"` | `"bank_transfer"` | `"ussd"`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "sessionId": "pay_01HXZ4BKJMN",
    "reference": "DSWP-20260608-ABC123",
    "paystackAuthorizationUrl": "https://checkout.paystack.com/xxxx",
    "virtualAccount": null,
    "ussdCode": null,
    "expiresAt": "2026-06-08T15:00:00Z"
  }
}
```
> `virtualAccount` populated for `bank_transfer`; `ussdCode` for `ussd`; `paystackAuthorizationUrl` for `card`.

---

### POST /wallet/fund/verify
Verify payment completion (called after Paystack callback).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{ "reference": "DSWP-20260608-ABC123" }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "amountFunded": "5000.00",
    "newBalance": "17260.00",
    "transactionId": "txn_01HXZ4BKJMN"
  }
}
```

---

### POST /wallet/withdraw
Initiate bank withdrawal.

**Headers:** `Authorization: Bearer <token>`  
**Requires:** KYC verified, PIN verified (verifyToken in body)

**Request Body:**
```json
{
  "amount": "3000.00",
  "bankCode": "058",
  "accountNumber": "0123456789",
  "verifyToken": "short-lived-verify-jwt"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_01HXZWITHDRAW",
    "status": "pending",
    "amountDebited": "3000.00",
    "fee": "30.00",
    "amountToReceive": "2970.00",
    "accountName": "Adewale Johnson",
    "bankName": "GTBank",
    "estimatedArrival": "Within 24 business hours",
    "newBalance": "9260.00"
  }
}
```

**Error Responses:**
- `422 ERR_INSUFFICIENT_BALANCE`
- `403 ERR_KYC_REQUIRED`

---

### GET /wallet/transactions
Get transaction history.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page (max 100) |
| type | string | all | Filter: `buy_data | sell_data | buy_airtime | fund_card | fund_transfer | withdraw` |
| status | string | all | Filter: `pending | success | failed` |
| from | date | — | ISO date (e.g., `2026-01-01`) |
| to | date | — | ISO date |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_01HXZ4BKJMN",
        "type": "buy_data",
        "amount": "1000.00",
        "fee": "0.00",
        "status": "success",
        "description": "MTN 5GB (30 Days) → 08012345678",
        "reference": "TXN-20260608-XYZ",
        "network": "mtn",
        "createdAt": "2026-06-08T13:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 47,
      "totalPages": 3
    }
  }
}
```

---

## 4. DATA PLANS ENDPOINTS

### GET /data/plans
Get available data plans.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| network | string | Filter: `mtn | airtel | glo | 9mobile` |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "pln_01HXZMTN5GB",
        "network": "mtn",
        "name": "MTN 5GB (30 Days)",
        "sizeGb": 5,
        "durationDays": 30,
        "marketPrice": "1500.00",
        "buyPrice": "1000.00",
        "sellPayout": "1140.00",
        "inStock": true
      }
    ]
  }
}
```

---

### POST /data/buy
Purchase a data plan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "planId": "pln_01HXZMTN5GB",
  "recipientPhone": "08012345678",
  "verifyToken": "short-lived-verify-jwt"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_01HXZBUYDATA",
    "status": "success",
    "planName": "MTN 5GB (30 Days)",
    "recipientPhone": "08012345678",
    "amountPaid": "1000.00",
    "newBalance": "11260.00",
    "deliveryRef": "MTN-2026060812345"
  }
}
```

---

### POST /data/sell
Sell a data plan to DataSwap.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "planId": "pln_01HXZMTN5GB",
  "quantity": 3
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_01HXZSELLDATA",
    "status": "success",
    "planName": "MTN 5GB (30 Days)",
    "quantity": 3,
    "marketValue": "4500.00",
    "amountCredited": "3420.00",
    "newBalance": "14680.00"
  }
}
```

---

## 5. AIRTIME ENDPOINT

### POST /airtime/buy
Buy airtime for any Nigerian network.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "network": "mtn",
  "recipientPhone": "08012345678",
  "amount": "500.00",
  "verifyToken": "short-lived-verify-jwt"
}
```

**Validations:**
- `amount`: min ₦50, max ₦50,000

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_01HXZBUYAIRTIME",
    "status": "success",
    "network": "mtn",
    "recipientPhone": "08012345678",
    "amountSent": "500.00",
    "newBalance": "11760.00"
  }
}
```

---

## 6. ACCOUNT VERIFICATION

### GET /banks/list
Get list of Nigerian banks.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "banks": [
      { "code": "058", "name": "GTBank", "slug": "guaranty-trust-bank" },
      { "code": "011", "name": "First Bank", "slug": "first-bank-of-nigeria" }
    ]
  }
}
```

---

### POST /banks/verify-account
Verify a bank account number.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "accountNumber": "0123456789",
  "bankCode": "058"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accountName": "Adewale Johnson",
    "accountNumber": "0123456789",
    "bankCode": "058",
    "bankName": "GTBank"
  }
}
```

---

## 7. WEBHOOK (Paystack → DataSwap)

### POST /webhooks/paystack
Receives payment confirmation from Paystack.

**Auth:** `x-paystack-signature` header (HMAC SHA-512 of payload with secret key)

**Payload:**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "DSWP-20260608-ABC123",
    "amount": 500000,
    "status": "success",
    "customer": { "email": "adewale@example.com" }
  }
}
```

**Response:** `200 OK` (must respond within 5 seconds)

**Processing:**
1. Verify HMAC signature
2. Find payment session by reference
3. If status `success` and session status `pending`:
   a. Credit wallet
   b. Record transaction
   c. Update payment session status to `success`
4. Send push notification to user

---

## SDK Usage (React Native Mock → Production)

Current development uses in-memory mock services. To switch to the real API:

```js
// src/services/api.js (to be created for production)
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://api.dataswap.ng/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      const res = await axios.post('/auth/refresh', { refreshToken });
      await SecureStore.setItemAsync('auth_token', res.data.data.accessToken);
      error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```
