# Deployment & Maintenance Plan
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

---

## 1. Deployment Overview

DataSwap uses a **two-track deployment strategy**:
1. **Mobile App** — React Native/Expo, deployed to Google Play Store (and future App Store)
2. **Backend API** — Node.js on AWS ECS, deployed via GitHub Actions CI/CD

---

## 2. Mobile App Deployment

### 2.1 Build Variants

| Variant | Purpose | Command | Distribution |
|---------|---------|---------|--------------|
| Development | Local testing with Expo Go | `npx expo start` | Expo Go app |
| Preview (APK) | Internal QA and UAT | `eas build --profile preview` | Direct APK download |
| Production (AAB) | Google Play Store submission | `eas build --profile production` | Google Play |

### 2.2 Expo EAS Build Configuration (`eas.json`)

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

### 2.3 Over-the-Air (OTA) Updates

For JavaScript-only changes (no native module changes), use Expo Updates:

```bash
# Push OTA update (available to users without re-download)
eas update --branch production --message "Fix: transaction sort order"
```

**OTA Update Policy:**
- Bug fixes: OTA update (instant, no store submission)
- New screens/features: Store submission required
- Native module changes: Full store submission required
- Security patches: OTA if JS-only, store submission otherwise

### 2.4 App Versioning

```
Format: MAJOR.MINOR.PATCH
  MAJOR: Breaking changes or complete redesign (1.x → 2.x)
  MINOR: New features (1.0 → 1.1)
  PATCH: Bug fixes (1.0.0 → 1.0.1)

app.json:
  "version": "1.0.0"           — display version (users see this)
  "android.versionCode": 1      — internal build number (increment every submission)
```

### 2.5 Google Play Submission Checklist

Before submitting to Google Play:
- [ ] `versionCode` incremented in `app.json`
- [ ] `version` updated if applicable
- [ ] No `console.log` in production code
- [ ] All test/demo credentials cannot be activated in production build
- [ ] `app.json` scheme does not expose internal URLs
- [ ] Privacy Policy URL added to store listing
- [ ] App screenshots updated for new features
- [ ] What's New section updated

**Release Tracks:**
1. **Internal** → 5 internal testers (immediate)
2. **Closed testing (Alpha)** → 100 invited users (1-day review)
3. **Open testing (Beta)** → Public beta (1–3 day review)
4. **Production** → Staged rollout: 10% → 25% → 50% → 100%

---

## 3. Backend API Deployment

### 3.1 Infrastructure (AWS)

```
Production Environment:
  Region: af-south-1 (Cape Town) — lowest latency for Nigeria
  Backup Region: eu-west-2 (London)

Services:
  ECS Fargate (API containers — auto-scaling)
  RDS PostgreSQL 15 (Multi-AZ, db.t3.medium)
  ElastiCache Redis (cache.t3.small)
  S3 (KYC document storage, private)
  CloudFront (CDN + DDoS)
  API Gateway (rate limiting, SSL termination)
  SQS (async job queues)
  CloudWatch (logging + alerts)
  KMS (encryption key management)
  Secrets Manager (API keys and DB credentials)
```

### 3.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml (simplified)
name: Deploy API

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit --audit-level=high   # Fail on high CVEs
      - run: npm test                        # Unit + integration tests
      - run: npm run lint                    # Zero lint errors

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t dataswap-api:${{ github.sha }} .
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS ...
          docker push $ECR_REGISTRY/dataswap-api:${{ github.sha }}
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster dataswap-prod \
            --service dataswap-api \
            --force-new-deployment
      
      - name: Notify Slack
        run: curl -X POST $SLACK_WEBHOOK -d '{"text":"API deployed ✅"}'
```

### 3.3 Zero-Downtime Deployment Process

1. New Docker image built and pushed to ECR
2. ECS starts new task with new image
3. Health check: `/health` endpoint returns 200 with DB + Redis status
4. Load balancer shifts traffic to new task (rolling update)
5. Old task drained (waits for in-flight requests to complete, max 30s)
6. Old task terminated
7. Total deployment time: ~3 minutes
8. If health check fails: automatic rollback to previous task

### 3.4 Database Migrations

```bash
# Run migrations before deployment
npm run db:migrate

# Rollback if needed
npm run db:migrate:undo

# Rules:
# - All migrations are backwards-compatible (no DROP COLUMN in production)
# - Columns removed in 2-step: Step 1 (stop using) → Step 2 (remove column, separate deployment)
# - All migrations tested in staging environment first
```

---

## 4. Environments

| Environment | Purpose | URL | Deploy Trigger |
|-------------|---------|-----|----------------|
| Local | Development | localhost:3000 | Manual |
| Staging | QA, integration testing | staging-api.dataswap.ng | PR merge to `develop` |
| Production | Live users | api.dataswap.ng | PR merge to `main` (manual approval) |

### Staging vs Production Differences
| Config | Staging | Production |
|--------|---------|-----------|
| Paystack | Test keys (sandbox) | Live keys |
| KYC provider | Sandbox mode | Live mode |
| VTU provider | Sandbox/test | Live |
| SMS OTP | Actual SMS sent | Actual SMS sent |
| Database | Separate DB (seed data) | Live DB |
| Log level | DEBUG | INFO |
| Rate limits | Relaxed (10× limit) | Standard |

---

## 5. Monitoring & Alerting

### 5.1 Error Tracking
**Tool:** Sentry (free tier initially → Team plan at 10,000 MAU)

```js
// Already integrated in App.js and API
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% of transactions for performance
});
```

### 5.2 Uptime Monitoring
**Tool:** UptimeRobot (free tier — 5-minute checks)

Monitors:
- `https://api.dataswap.ng/health` → 200 OK
- `https://dataswap.ng` → 200 OK

**Alert channels:** Email + WhatsApp on downtime

### 5.3 Application Metrics (CloudWatch Dashboards)

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| API error rate (5xx) | > 1% of requests | PagerDuty page |
| API response time p99 | > 2,000ms | Slack alert |
| DB CPU | > 80% | Slack alert + scale |
| ECS CPU | > 70% | Auto-scale out |
| Failed login attempts | > 50/min | Slack alert (possible attack) |
| Failed transactions | > 5% | Immediate investigation |
| Wallet reconciliation diff | Any | P1 incident |

### 5.4 Business Metrics Dashboard (Grafana)

Real-time:
- Active users (last 5 minutes)
- Transactions per minute (by type)
- Revenue today vs yesterday

Daily:
- New registrations vs KYC completions
- Transaction success rate
- Wallet balance movements (total funded vs withdrawn)

Weekly:
- GMV, revenue by stream
- D7 retention cohort
- KYC approval rate

---

## 6. Maintenance Procedures

### 6.1 Scheduled Maintenance Window
- **Day:** Sunday
- **Time:** 2:00 AM – 4:00 AM WAT
- **Frequency:** Monthly (or as needed)
- **User notification:** Push notification 24 hours before

### 6.2 Database Maintenance
```
Automated (AWS handles):
  - Automated backups: Daily at 3:00 AM WAT, retained 7 days
  - Point-in-time recovery available for any moment in last 7 days
  - Minor version upgrades: During maintenance window (auto)
  - Major version upgrades: Manual, staged (staging first)

Manual tasks (quarterly):
  - VACUUM ANALYZE on large tables (transactions, audit_logs)
  - Review and prune expired OTP codes (cron job handles this)
  - Rotate database credentials in Secrets Manager
  - Review slow query log and add missing indexes
```

### 6.3 Secret Rotation
| Secret | Rotation Frequency | Method |
|--------|-------------------|--------|
| JWT signing key | Every 90 days | AWS KMS auto-rotation |
| Database password | Every 90 days | AWS Secrets Manager rotation |
| Paystack secret key | On suspicion/annually | Manual |
| KYC API key | Annually | Manual |
| VTU API key | Annually | Manual |
| AWS IAM access keys | Every 90 days | Automated |

### 6.4 Log Retention Policy
| Log Type | Retention | Storage |
|----------|-----------|---------|
| API access logs | 30 days | CloudWatch (auto-delete) |
| Application error logs | 90 days | CloudWatch + Sentry |
| Audit logs | 5 years | S3 (Glacier after 1 year) |
| Security events | 7 years | S3 (Glacier after 1 year) |
| Database slow query log | 30 days | CloudWatch |

---

## 7. Incident Response Runbook

### P1 Incident — Unauthorized Wallet Access
```
Detection: Automated alert OR user report
1. [ ] Confirm scope: how many users, how much money
2. [ ] Immediately revoke ALL JWT tokens (redis flush: token:*)
3. [ ] Enable read-only mode (disable all wallet mutations)
4. [ ] Preserve evidence (take DB snapshot before any changes)
5. [ ] Identify attack vector from audit logs
6. [ ] Patch the vulnerability
7. [ ] Restore wallet balances if incorrect (use transaction log)
8. [ ] Re-enable wallet mutations
9. [ ] Notify affected users within 72 hours
10.[ ] Notify NITDA within 72 hours (NDPR requirement)
11.[ ] Post-mortem within 5 business days
```

### P2 Incident — Payment Gateway Down (Paystack)
```
Detection: Webhook failures OR user reports
1. [ ] Check Paystack status page (status.paystack.com)
2. [ ] If Paystack down: activate Flutterwave fallback
   - Change PAYMENT_GATEWAY env var to "flutterwave"
   - Deploy (OTA update or config change via Secrets Manager)
3. [ ] If partial outage: queue payment verifications for retry
4. [ ] Notify users via push: "Payments may be delayed"
5. [ ] When Paystack restored: process queued verifications
6. [ ] Verify all wallet balances reconcile
```

### P2 Incident — VTU Delivery Failures
```
Detection: Automated alert (> 5% failure rate)
1. [ ] Check VTU provider status
2. [ ] If provider down: switch to secondary VTU provider
3. [ ] For failed transactions: confirm wallet reversal happened
4. [ ] If wallet not reversed: manually credit affected users
5. [ ] Update status page: "Data delivery may be delayed"
6. [ ] When resolved: process any stuck transactions
```

---

## 8. Cost Optimization

### Monthly Infrastructure Costs (Production)
| Resource | Cost (USD) | Optimization |
|----------|-----------|-------------|
| EC2/ECS (2× t3.small) | $30 | Scale down nights/weekends |
| RDS (db.t3.medium) | $45 | Reserved instance after 6 months (40% discount) |
| ElastiCache (cache.t3.small) | $15 | Share across services |
| CloudFront + S3 | $10 | KYC images served via CDN |
| API Gateway | $5 | Low volume initially |
| CloudWatch | $5 | Log retention limits |
| **Total** | **~$110/month** | |

### Variable Costs
| Service | Cost | Volume Driver |
|---------|------|--------------|
| Paystack transactions | 1.5% + ₦100 (capped ₦2,000) | Transaction count |
| KYC verification | ~₦200/user | KYC submissions |
| SMS (OTP) | ~₦3/SMS | Registrations + logins |
| VTU fulfillment | 0.5% commission | Data/airtime volume |

---

## 9. Backup & Recovery

### Backup Schedule
```
Database:
  - Automated daily snapshots (AWS RDS) — retained 7 days
  - Point-in-time recovery: any second in last 7 days
  - Weekly manual export to S3 — retained 1 year
  - Monthly export to cold storage (Glacier) — retained 7 years

Application:
  - Docker images: ECR with lifecycle policy (keep last 10 images)
  - Source code: GitHub (primary) + private backup

KYC Documents (S3):
  - Cross-region replication: af-south-1 → eu-west-2
  - Versioning enabled (protect against accidental deletion)
```

### Recovery Procedures
| Scenario | RTO | RPO | Procedure |
|----------|-----|-----|-----------|
| Single API pod crash | 30 sec | 0 | ECS auto-restart |
| Full API failure | 5 min | 0 | ECS auto-replace from task definition |
| Database failure | 60 sec | < 15 min | RDS Multi-AZ auto-failover |
| Full region failure | 1 hour | < 15 min | Manual failover to eu-west-2 |
| Ransomware / data corruption | 2 hours | < 24 hours | Restore from daily snapshot |

---

## 10. App Store Maintenance

### Google Play Requirements (Ongoing)
- Target API level must be within 1 year of latest Android release
  - Currently: target API 34 (Android 14) → must upgrade to 35 by August 2025
- Annual privacy policy review and update
- Respond to user reviews within 5 business days
- Address any Google Play policy warnings within 30 days

### App Update Cadence
| Update Type | Frequency | Examples |
|-------------|-----------|---------|
| Security patches | As needed (within 48h) | JWT bug, auth bypass |
| Bug fix releases | Weekly during active development | Crash fixes |
| Feature releases | Sprint-based (2 weeks) | New screens |
| Major version | Quarterly | New architecture |

---

## 11. End-of-Life & Data Deletion

### User Account Deletion
When a user requests account deletion:
1. Mark account as `deletion_requested` with timestamp
2. 30-day grace period (user can cancel)
3. After 30 days:
   - Delete personal data (name, email, phone)
   - Delete KYC images from S3
   - Anonymize transactions (replace user_id with `DELETED_USER`)
   - Retain anonymized transaction data 7 years (CBN requirement)
4. Notify user via email confirmation

### Data Processing Note
Per NDPR: Users can request their data be deleted. However, transaction records must be retained 7 years per CBN regulations — these are anonymized on deletion, not fully erased.
