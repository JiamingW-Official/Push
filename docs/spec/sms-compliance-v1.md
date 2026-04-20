# SMS Compliance Spec — Push, Inc. (P2-2, v1)

**Status:** DRAFT v1 — **counsel review required before any deploy.** Not a legal opinion.
**Owner:** Jiaming (founder) + [TCPA counsel TBD — target Cooley / Kelley Drye / Davis & Gilbert]
**Deliverable date:** 2026-05-04 (Day 14 from spec kickoff 2026-04-20)
**Reviewers:** outside TCPA counsel (required); Jiaming (founder); Z (eng impl); Prum (ops owner for opt-out SLA)
**Cross-references:**
- [`docs/legal/counsel-engagement-plan.md`](../legal/counsel-engagement-plan.md) §2 Employment, §6 Privacy, §7 Marketing/FTC
- [`docs/legal/corporate-hygiene-checklist.md`](../legal/corporate-hygiene-checklist.md) §5.2 Creator Terms, §7 Regulatory Readiness
- [`docs/v5_2_status/audits/03-legal-compliance-register.md`](../v5_2_status/audits/03-legal-compliance-register.md) — legal risk register
- `docs/spec/consumer-facing-v1.md` (P2-1) — cross-ref for SMS-gated consumer flow

**Pre-reads (primary sources — read before reviewing this spec):**
- Telephone Consumer Protection Act, 47 U.S.C. §227 (statute)
- FCC implementing regulations, 47 C.F.R. §64.1200 (all subsections)
- FCC Report & Order, *In the Matter of Rules and Regulations Implementing the Telephone Consumer Protection Act of 1991*, CG Docket No. 02-278 (Feb 15, 2012) — the "2012 Order" establishing "prior express written consent" for marketing
- FCC Declaratory Ruling, CG Docket No. 02-278 (July 10, 2015) ("2015 Omnibus")
- California Consumer Privacy Act, Cal. Civ. Code §§1798.100–1798.199.100 (CCPA/CPRA)
- Florida Telephone Solicitation Act, Fla. Stat. §501.059 (as amended by SB 1120, 2021)
- Washington Commercial Electronic Mail Act, Wash. Rev. Code §19.190
- CTIA Messaging Principles and Best Practices (current edition)

**Hard gate — no SMS sent to any consumer under any circumstance until all of:**
1. TCPA counsel written opinion letter received on consent language, schema, and flow (§6.2).
2. Push registered with The Campaign Registry (brand + campaign) via Twilio A2P 10DLC (§5.2).
3. `consent_log`, `opt_out_log`, and `disclosure_versions` tables in production with monitoring (§5.3).
4. Opt-out SLA alert in place with 10-second target and 30-second escalation (§5.6).
5. Internal ops runbook for opt-out escalation published (owner: Prum).
6. First loyalty-card merchant has been briefed on the consumer-opt-in-required flow (§9).

---

## §1. Regulatory Scope

This section is authoritative; all downstream decisions derive from these statutes. **Every assertion in §1 requires counsel confirmation before external use.**

### 1.1 Federal: Telephone Consumer Protection Act (TCPA)

**Primary statute:** 47 U.S.C. §227. **Primary implementing regulation:** 47 C.F.R. §64.1200.

Push intends to send marketing text messages (loyalty-card promotions, campaign invitations, reward notifications) to consumer wireless numbers on behalf of Push's merchants and creators. The TCPA squarely applies.

1. **Prior express written consent required.** 47 C.F.R. §64.1200(a)(2) bars telemarketing SMS to wireless numbers using an automatic telephone dialing system ("ATDS") or prerecorded voice absent prior express written consent. The FCC's 2012 Order (CG Docket No. 02-278, released Feb 15, 2012) imposed this heightened standard for marketing, replacing "prior express consent" which remains sufficient only for non-marketing.

2. **Definition, 47 C.F.R. §64.1200(f)(9).** A written agreement that: (a) bears the recipient's signature, (b) clearly authorizes the seller to deliver advertisements/telemarketing via automatic dialing to a designated number, (c) includes that number, and (d) includes a clear-and-conspicuous disclosure that by signing the recipient authorizes the seller to deliver telemarketing via automatic dialing AND that the recipient is not required to sign as a condition of purchase.

3. **Statutory damages, 47 U.S.C. §227(b)(3).** Private right of action; **$500 per violation**, trebled to **up to $1,500 per violation** on willful/knowing violation. Per-message; class actions routinely certified.

4. **Standing.** *TransUnion LLC v. Ramirez*, 594 U.S. 413 (2021) requires concrete injury; receipt of an unwanted text is treated as sufficient (*Drazen v. Pinto*, 74 F.4th 1336 (11th Cir. 2023)).

5. **Pre-emption.** TCPA does not pre-empt stricter state laws (47 U.S.C. §227(e)). Compliance requires federal-plus-state floor analysis for every message.

### 1.2 California: CCPA / CPRA

**Primary statute:** Cal. Civ. Code §§1798.100–1798.199.100. Push collects phone numbers ("personal information" under §1798.140(v)) from California consumers. CCPA/CPRA applies directly only if Push meets §1798.140(d)(1) thresholds ($25M revenue, 100K consumers, or 50% revenue from sale/sharing); Push is sub-threshold at seed but inherits obligations as a service provider. **Compliance by design** from v1.

1. **Notice-at-collection, §1798.100(a)** — satisfied by §2 disclosure language.
2. **Right to know / delete, §§1798.105 and 1798.110** — phone numbers and consent records in scope, subject to compliance-records exception at §1798.105(d)(1). See §4.5.
3. **Right to opt-out of sale/sharing, §1798.120** — Push does not sell numbers; any future change requires re-review.
4. **Statutory damages for breach, §1798.150** — $100–$750 per consumer per incident for non-encrypted/non-redacted PII. Separate from TCPA.

### 1.3 State Mini-TCPAs (Rising Risk)

Push must comply with the strictest applicable state law for each recipient (proxy: phone NPA-NXX + last-known address).

1. **Florida — Fla. Stat. §501.059 (FTSA), amended by SB 1120 (2021) and HB 761 (2023).** Prior express written consent + time-of-day restriction (8 a.m.–8 p.m. local). Damages: $500 / $1,500. HB 761 added a 15-day pre-suit notice-and-cure.
2. **Oklahoma — OTCPA, 15 Okla. Stat. §775C.1 et seq.** Modeled on FTSA; private right of action.
3. **Washington — Wash. Rev. Code §19.190 + RCW 80.36.400.** Commercial-text restrictions; sender identification + functional opt-out; per-message damages.
4. **Connecticut — Conn. Gen. Stat. §42-288a (Public Act 23-56, 2023).** Written consent for SMS + time-of-day limits.
5. **Maryland — Md. Code, Com. Law §14-3301 et seq.** Emerging enforcement.

**Implementation rule:** All SMS must observe the strictest floor of (TCPA, FTSA, OTCPA, WA, CT, MD) applicable to the recipient, including time-of-day (default safe window: 10:00 a.m.–8:00 p.m. local unless the consumer initiated a service-related exchange within 24 hours).

### 1.4 CAN-SPAM (out of scope) & GDPR (out of scope today)

**CAN-SPAM** (15 U.S.C. §§7701–7713) governs email, not SMS; its parallel opt-out architecture informs §3 but does not apply directly. **GDPR** (Regulation (EU) 2016/679) does not apply until Push knowingly messages EU consumers, at which point a revision adds Art. 6 lawful-basis and Art. 7 withdrawal mechanics. Push's public GDPR-readiness claim (see audit register row #1) must be reviewed by privacy counsel before any EU-facing SMS.

---

## §2. Opt-In Flow Requirements

### 2.1 Consent Language (exact text — 2 variants for A/B testing, each requires counsel sign-off before deploy)

**Variant A — primary:**

> I agree to receive marketing text messages from [Merchant Legal Name] via Push (message frequency varies, typically 2–4 msgs/month). Message and data rates may apply. Reply STOP to opt out at any time. Reply HELP for help. Consent is not required as a condition of any purchase.

**Variant B — condensed (for mobile ≤ 320px viewports only):**

> I agree to receive marketing text messages from [Merchant Legal Name] via Push. Msg frequency varies; msg & data rates may apply. Reply STOP to opt out. Consent not required to purchase.

**Drafting rules (apply to both variants):**

- Merchant legal name must be the registered entity name, not a DBA, unless DBA is also registered with The Campaign Registry.
- "via Push" identifies the platform per 47 C.F.R. §64.1200(b)(1) caller-ID identification guidance.
- "Consent not required as a condition of purchase" language satisfies 47 C.F.R. §64.1200(f)(9)(ii) (the "not-required" disclosure).
- "Msg frequency varies" satisfies CTIA best-practice frequency disclosure.
- "Msg & data rates may apply" satisfies CTIA best-practice carrier-cost disclosure.
- Language is plain English, ≤ Flesch-Kincaid grade 8.

### 2.2 Disclosure Placement (visual and structural)

Clear-and-conspicuous requirement per FCC 2012 Order and 47 C.F.R. §64.1200(f)(9).

- Disclosure text is **≥14px** font size, **regular weight or heavier**, **#003049 Deep Space Blue on #f5f2ec Pearl Stone** (contrast ratio ≥ 7.0 — exceeds WCAG AA 4.5:1 floor).
- Disclosure is placed **directly above the phone-number input field**, in the main document flow. Not in a tooltip, not behind a "Learn more" expand/collapse, not in a modal triggered on-submit.
- Checkbox is placed **directly below the disclosure and above the submit button**, with label unambiguously tied to the checkbox via `<label for="...">`.
- Checkbox is **never pre-checked** (FCC 2012 Order explicitly disallows pre-checked boxes as "prior express written consent").
- Mobile viewports (< 375px width): disclosure text wraps without truncation; no horizontal scroll; checkbox remains above submit in source order.
- Submit button is labeled "Send me the code" (not "Sign up" or "Submit") to reinforce that this is a verification step, not a finalization of consent.

### 2.3 Affirmative Action Requirement

Exactly one path is permitted for v1:

**Primary path — web checkbox + double-opt-in via Twilio Verify:**
1. Consumer enters phone number (validated E.164 by Twilio Lookup before consent is stored).
2. Consumer checks the unchecked-by-default disclosure checkbox.
3. Consumer clicks "Send me the code."
4. Push calls Twilio Verify, which sends: *"Your Push verification code is XXXXXX. Reply STOP to opt out."*
5. Consumer enters the 6-digit code on the web form.
6. On successful code verification, Push sends the welcome SMS (§2.5 Step 4).
7. Only upon successful delivery of the welcome SMS is the opt-in marked `status='completed'` in `consent_log`.

**No alternate path in v1.** Counsel may approve additional paths (in-store QR code + SMS keyword opt-in, for example) in later revisions; until then, the checkbox path is the sole permitted onboarding.

### 2.4 Capture Requirements per Opt-In Event

Every opt-in event writes one row to `consent_log` with all of the following fields populated. Insert-only; no updates permitted (amendments are new rows referencing the prior row via `supersedes_consent_id`).

| Field | Type | Notes |
|---|---|---|
| `consent_id` | UUID | Primary key |
| `consumer_phone_e164` | `text` (encrypted at rest) | E.164 format, validated by Twilio Lookup |
| `phone_hash` | `char(64)` | SHA-256 with peppered salt (pepper rotates annually; see §4.6) |
| `merchant_id` | UUID | FK to `merchants` |
| `campaign_id` | UUID, nullable | FK to `campaigns` if opt-in tied to a specific campaign |
| `opt_in_timestamp` | `timestamptz` | UTC; microsecond precision |
| `ip_address_hash` | `char(64)` | SHA-256 of full client IP with same pepper as phone_hash |
| `user_agent` | `text` | Raw UA string, non-PII |
| `disclosure_version` | `text` | FK to `disclosure_versions.version_id` |
| `exact_consent_text_shown` | `text` | Full snapshot of the consent string displayed, merchant-name substituted, rendered at display time |
| `consent_method` | `enum` | One of: `web-checkbox-plus-twilio-verify`, `future-method-pending-counsel` |
| `consenting_party` | `enum` | Always `consumer` for v1 (never `creator` or `merchant` on behalf of consumer) |
| `status` | `enum` | `pending-verification` → `completed` → `opted-out` (see §3) |
| `opt_out_timestamp` | `timestamptz`, nullable | Set on opt-out; never nulled once set |
| `opt_out_method` | `enum`, nullable | `sms-keyword`, `web-self-service`, `ops-manual`, `compliance-forced` |
| `opt_out_keyword_received` | `text`, nullable | Actual keyword received from consumer, if SMS-keyword method |
| `supersedes_consent_id` | UUID, nullable | FK to prior `consent_log.consent_id` if this is a re-opt-in |
| `pepper_version` | `int` | Year of pepper rotation used for phone_hash |

**Exclusions:** no full raw IP address is stored in `consent_log` (hashed only; minimization per CCPA). Device fingerprints are not captured. Geo-location is not captured.

### 2.5 Double-Opt-In Flow (recommended best practice; not strictly TCPA-required but substantially reduces dispute surface)

**Step 1 — Web consent event.**
Consumer enters phone, checks disclosure box, clicks "Send me the code." A row is inserted in `consent_log` with `status='pending-verification'`.

**Step 2 — Verification SMS.**
Twilio Verify sends: *"Your Push verification code is XXXXXX. Reply STOP to opt out."* (10 minutes TTL on code).

**Step 3 — Code entry + ownership proof.**
Consumer enters code. On verify success, `consent_log.status` advances to `verification-passed` (intermediate state). If the consumer replies STOP to this verification SMS, that reply is routed through the opt-out handler (§3) which sets `status='opted-out'` and halts the welcome step.

**Step 4 — Welcome SMS.**
Push sends: *"Welcome to [Merchant Legal Name] rewards via Push. Reply STOP to opt out. Msg & data rates may apply."* Only upon successful delivery (Twilio callback confirms `delivered` status) does `consent_log.status` advance to `completed`.

**Step 5 — First marketing message permitted.**
No marketing SMS may be sent to the consumer until `consent_log.status = 'completed'`. Every outbound marketing SMS must be preceded by a fresh lookup (§5.5).

**Timeout behavior.** If the consumer does not enter the code within 10 minutes, `consent_log.status` remains `pending-verification` and is automatically advanced to `expired-unverified` after 72 hours. `expired-unverified` rows do not grant SMS permission and must not be counted as opt-ins.

---

## §3. Opt-Out Flow Requirements

### 3.1 Recognized Opt-Out Keywords (case-insensitive, whole-word match)

Push honors any inbound SMS from a consumer containing any of the following as the full trimmed message body:

- `STOP`
- `STOPALL`
- `UNSUBSCRIBE`
- `END`
- `QUIT`
- `CANCEL`
- `OPT OUT`
- `OPTOUT`
- `REMOVE`

Keyword matching is case-insensitive, leading/trailing whitespace is trimmed, and the match is against the entire message body (not a substring). Messages containing an opt-out keyword as part of a larger sentence (e.g., "I don't want to stop getting these") do not trigger opt-out. This matches CTIA guidance.

### 3.2 Opt-Out Confirmation SMS (exact text, counsel-reviewed before deploy)

On first qualifying opt-out message, Push sends exactly one confirmation SMS:

> You are opted out from [Merchant Legal Name] via Push. No further marketing messages will be sent. Reply HELP for help.

No additional SMS is sent to that (consumer, merchant) pair thereafter unless the consumer explicitly re-opts-in via a fresh §2 flow.

### 3.3 Scope of Opt-Out

Opt-out is scoped to the `(consumer_phone_hash, merchant_id)` pair. Opting out from Merchant A does not automatically opt out from Merchant B. This is consistent with TCPA + CTIA treatment of separate senders.

**Exception:** if the consumer sends `STOPALL`, Push treats this as an opt-out from **all** merchants the consumer has ever consented to via Push. The `opt_out_log` is updated with one row per (consumer_phone_hash, merchant_id) and the confirmation SMS is sent once (from the most recent merchant), referencing the `STOPALL` scope.

### 3.4 Opt-Out Propagation SLA

- **Target:** opt-out event must propagate from Twilio webhook receipt to `consent_log` status update and downstream send-gate in **≤ 10 seconds** (p95).
- **Escalation:** if average propagation exceeds 30 seconds over any 5-minute window, page on-call ops (Prum) immediately.
- **Fail-closed:** if the webhook handler fails to confirm write, the consumer's `phone_hash` is added to an in-memory deny-list that is checked in parallel with the database; any outbound send attempt fails closed.

### 3.5 HELP Keyword

On inbound `HELP` (case-insensitive) from a consumer, Push sends:

> [Merchant Legal Name] via Push: msg frequency varies. Msg & data rates may apply. Reply STOP to opt out.

HELP keyword is always permitted (does not require prior consent).

### 3.6 Operational Requirements

Opt-out handler is tier-1: Twilio webhook → Push internal handler → `opt_out_log` insert → `consent_log` status update → Twilio outbound confirmation, transactionally. On failure, the event enqueues (Supabase Queue) with up to 3 retries over 30 minutes; after 3 failed retries, escalate to Prum via PagerDuty with full payload for manual processing within 4 hours. Latency p50/p95/p99 dashboarded; violations trigger Slack alert.

---

## §4. Data Retention & Governance

### 4.1 `consent_log` Retention (opt-in records)

**Retain 4 years from `opt_in_timestamp`.** Justification: 4-year federal SOL per 28 U.S.C. §1658(a); state SOLs are shorter (FL Stat. §95.11(3)(f) 4 yr; NY CPLR §214(2) 3 yr; Cal. CCP §338(a) 3 yr). After 4 years + 30-day grace, records purge; the purge event is logged in `consent_log_purge_log` (record counts only, no PII).

### 4.2 `opt_out_log` Retention

**Retain indefinitely.** CCPA §1798.105(d)(1) exempts records needed to "comply with a legal obligation." Defending against "you texted me after I opted out" claims requires proof for the life of any potential claim; re-opt-in followed by alleged violation can span > 4 years. Privacy policy discloses indefinite retention.

### 4.3 `disclosure_versions` Retention

**Retain forever.** Immutable audit trail. Each version stored with version string (`v1.0.0-2026-05-04`), full text, effective range, and counsel-review record (name, date, opinion-letter reference). `consent_log.disclosure_version` FK; no row deletable.

### 4.4 Access Controls

Production read: ops role (Prum, Jiaming) SELECT-only. Production write: app role INSERT-only on `consent_log`/`opt_out_log`; no UPDATE/DELETE. Schema changes via versioned migration reviewed by Z + Jiaming. Admin dashboard never exposes raw `consumer_phone_e164` — operators see last-4 + salted hash only.

### 4.5 CCPA Right-to-Delete Handling

On CCPA §1798.105 deletion request, Push invokes the §1798.105(d)(1) compliance exception. Response template (sent within 45 days per §1798.130(a)(2)): *"Your request has been received. Under Cal. Civ. Code §1798.105(d)(1), records demonstrating compliance with federal and state telecommunications consent laws are retained for the period required by those laws. Your consent record is retained for this purpose only; no marketing activity remains associated with your phone number. Confirm opt-out status or submit other privacy requests at privacy@push.nyc."* Response + timestamp logged.

### 4.6 Phone Pepper Rotation

`phone_hash = SHA-256(consumer_phone_e164 || pepper_[year])`. Pepper is a 32-byte secret stored in KMS, rotated annually on January 1. `pepper_version` stored per row; old peppers retained 4 years for hash regeneration. `phone_pepper_rotations` is append-only; rotation events follow ops change-management.

---

## §5. Implementation Architecture

### 5.1 Twilio Configuration

- Messaging Service via Twilio with A2P 10DLC (Application-to-Person 10-digit long code) registered through The Campaign Registry (TCR).
- Short codes are not used in v1 (6–8 week provisioning lead time + $500–$1,500/month recurring cost is disproportionate to seed-stage volume).
- Every outbound SMS carries: sending brand ID, campaign ID, and Twilio caller-ID identification per 47 C.F.R. §64.1200(b).

### 5.2 A2P 10DLC Registration

- **Brand registration:** via Twilio Trust Hub → The Campaign Registry. One-time fee ~$4. Lead time: 2–4 weeks for standard vetting; 4–8 weeks for enhanced vetting if Push opts in.
- **Campaign registration:** one or more campaigns registered under the brand. Recurring fee ~$1.50/campaign/month. Lead time: 1–2 weeks.
- **Throughput tier T1** (standard brand, low-volume) supports ~4,500 messages per minute across all carriers, ≥50,000 messages/day. Adequate for seed and early Series Seed volumes.
- **Trigger:** brand registration must start no later than v5.3 Week 1 (2026-05-04) to complete before the first loyalty-card launch (v5.3 Week 7, 2026-06-29).

### 5.3 Database Schema (DDL)

The following schema is authoritative for the v1 implementation. Migration name: `2026-05-04-sms-compliance-v1.sql`.

```sql
-- enums
CREATE TYPE consent_status AS ENUM (
  'pending-verification',
  'verification-passed',
  'completed',
  'expired-unverified',
  'opted-out'
);

CREATE TYPE consent_method AS ENUM (
  'web-checkbox-plus-twilio-verify',
  'future-method-pending-counsel'
);

CREATE TYPE consenting_party AS ENUM (
  'consumer'
);

CREATE TYPE opt_out_method AS ENUM (
  'sms-keyword',
  'web-self-service',
  'ops-manual',
  'compliance-forced'
);

-- main tables
CREATE TABLE consent_log (
  consent_id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_phone_e164   text NOT NULL, -- encrypted-at-rest via Supabase Vault
  phone_hash            char(64) NOT NULL,
  merchant_id           uuid NOT NULL REFERENCES merchants(id),
  campaign_id           uuid REFERENCES campaigns(id),
  opt_in_timestamp      timestamptz NOT NULL DEFAULT now(),
  ip_address_hash       char(64) NOT NULL,
  user_agent            text NOT NULL,
  disclosure_version    text NOT NULL REFERENCES disclosure_versions(version_id),
  exact_consent_text_shown text NOT NULL,
  consent_method        consent_method NOT NULL,
  consenting_party      consenting_party NOT NULL DEFAULT 'consumer',
  status                consent_status NOT NULL DEFAULT 'pending-verification',
  opt_out_timestamp     timestamptz,
  opt_out_method        opt_out_method,
  opt_out_keyword_received text,
  supersedes_consent_id uuid REFERENCES consent_log(consent_id),
  pepper_version        int NOT NULL
);

CREATE UNIQUE INDEX idx_consent_active_pair
  ON consent_log (phone_hash, merchant_id)
  WHERE status = 'completed';

CREATE INDEX idx_consent_lookup ON consent_log (phone_hash, merchant_id, status);

CREATE TABLE opt_out_log (
  opt_out_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_hash          char(64) NOT NULL,
  merchant_id         uuid, -- NULL means STOPALL (global)
  opt_out_timestamp   timestamptz NOT NULL DEFAULT now(),
  opt_out_method      opt_out_method NOT NULL,
  source_consent_id   uuid REFERENCES consent_log(consent_id),
  keyword_received    text,
  twilio_message_sid  text,
  pepper_version      int NOT NULL
);

CREATE INDEX idx_opt_out_lookup ON opt_out_log (phone_hash, merchant_id);

CREATE TABLE disclosure_versions (
  version_id           text PRIMARY KEY, -- 'v1.0.0-2026-05-04'
  effective_start      timestamptz NOT NULL,
  effective_end        timestamptz,
  full_text            text NOT NULL,
  counsel_reviewer     text NOT NULL,
  counsel_review_date  date NOT NULL,
  counsel_opinion_ref  text,
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE phone_pepper_rotations (
  pepper_version       int PRIMARY KEY,
  rotation_timestamp   timestamptz NOT NULL DEFAULT now(),
  rotated_by           text NOT NULL,
  kms_key_reference    text NOT NULL,
  previous_version     int REFERENCES phone_pepper_rotations(pepper_version)
);

-- RLS
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE opt_out_log ENABLE ROW LEVEL SECURITY;
-- Service role bypasses; app role INSERT-only; ops role SELECT-only.
```

### 5.4 Internal Consent Service

- Location: `app/api/internal/consent/*`
- Gated by `INTERNAL_API_SECRET` in `middleware.ts`; never exposed to client code.
- Routes:
  - `POST /api/internal/consent/initiate` — accepts phone, merchant_id, disclosure_version, consent_text_snapshot, IP, UA; creates `consent_log` row with `status='pending-verification'`; triggers Twilio Verify; returns `verification_sid`.
  - `POST /api/internal/consent/verify` — accepts `verification_sid` + code; calls Twilio Verify; on success, advances `status='verification-passed'`; triggers welcome SMS.
  - `POST /api/internal/consent/welcome-delivered` — Twilio webhook for welcome SMS delivery callback; advances `status='completed'`.
  - `POST /api/internal/consent/opt-out` — Twilio inbound-message webhook; matches opt-out keywords; inserts `opt_out_log`, updates `consent_log.status='opted-out'`, dispatches confirmation SMS.
  - `GET /api/internal/consent/check` — service-to-service; accepts `phone_hash + merchant_id`; returns boolean permission plus latest `consent_id`.

All five routes use `lib/db/index.ts` (service role) because they operate on RLS-protected tables and require audit-trail writes.

### 5.5 Outbound Message Gating (fail-closed)

- Every outbound marketing SMS, without exception, calls `GET /api/internal/consent/check` immediately before dispatch (< 1 second TTL on the check).
- If the check returns `permitted=false`, the send is blocked and an alert is raised with the message ID and attempted recipient hash.
- If the check call fails (network, DB error), the send is blocked (fail-closed). This is explicitly preferred over allowing the send; a false-negative (blocked send) is operationally recoverable; a false-positive (unauthorized send) is a statutory violation.
- All outbound attempts (permitted or blocked) are logged to `outbound_message_attempts` (append-only) for post-hoc audit.

### 5.6 Observability

- **Dashboard panels (Prum-owned):**
  - Opt-in rate (24h, 7d, 30d).
  - Opt-out rate (24h, 7d, 30d); opt-out latency p50/p95/p99.
  - Verification completion rate (% of `initiate` that reach `completed`).
  - Gate-block events (outbound send attempts blocked due to failed consent check).
  - Twilio delivery rate / failure rate.
- **Alerts (PagerDuty, on-call ops):**
  - Opt-out latency p95 > 30s over any 5-minute window → page.
  - Any gate-block event where attempted recipient is on `opt_out_log` → **P0 page** (indicates a bug allowed the send path to reach a blocked number).
  - Twilio webhook failure rate > 1% over 15 minutes → page.
  - Welcome-SMS delivery rate < 95% over 1 hour → alert.

### 5.7 Enumeration / Abuse Back-Off

- Twilio Verify endpoint is rate-limited per source IP (max 5 initiations per hour per IP).
- Per-phone-number verification attempts limited to 3 in any 24-hour window; exceeded attempts are silently accepted by the web form (returning a generic success message) but do not generate SMS.
- Verification code entry allows 5 attempts before the verification session is invalidated.
- These limits prevent using Push's consent flow for phone-number enumeration or to spam verification codes to unwilling consumers.

---

## §6. Legal Review Process

### 6.1 v0 Spec Review (Internal, Day 14)

- Jiaming + Z read full spec on Day 14 (2026-05-04).
- Z produces implementation-questions list (migration, service topology, observability).
- Jiaming produces counsel-questions list (see Appendix D).
- No code is written against this spec until §6.2 is complete.

### 6.2 Outside TCPA Counsel Engagement (required before any deploy)

- **Scope of engagement:**
  - Review consent language (both variants) and approve or redline.
  - Review `consent_log` schema for sufficiency as a TCPA defense-of-consent record.
  - Review opt-in flow wireframes and the double-opt-in narrative.
  - Review opt-out flow including exact keywords and confirmation SMS text.
  - Review retention schedule and CCPA §1798.105(d)(1) reliance.
  - Review state-law overlay (§1.3) and confirm which states Push must treat as stricter than TCPA.
- **Deliverable:** written opinion letter plus redlined version of this spec.
- **Estimated cost:** $500–$1,500 (single-issue TCPA specialist, 2–4 hours). If bundled with privacy/CCPA counsel review, $2,000–$4,000.
- **Target firms:** Kelley Drye & Warren (Reed Freeman-era TCPA practice); Davis & Gilbert (ad-law specialist with TCPA bench); Cooley (bundled with privacy). Alternate: Ifrah Law, Klein Moynihan Turco.
- **Engagement letter** signed by Jiaming on behalf of Push, Inc.; retainer paid; counsel name added to disclosure_versions record.

### 6.3 Twilio Registration (parallel)

- Brand + campaign registration via Twilio Trust Hub / TCR starts in parallel with §6.2 (not sequential) because Twilio lead times are external and cannot be compressed.
- Campaign use-case: "Marketing" with sub-use-case "Customer Care" if applicable.
- The registered campaign references the approved consent language from §2.1 as the "opt-in language" field in TCR.

### 6.4 Pre-Series-A TCPA Compliance Audit (out of scope for v0)

- Before external growth-marketing spend or Series-A diligence, Push engages a TCPA specialist for a full compliance audit: log review, consent-record audit, incident log, disclosure-version governance review, operations review.
- **Estimated cost:** $5,000–$10,000.
- Deliverable: audit report plus remediation plan.

---

## §7. Timeline

| Dates | Milestone | Owner | Dependency |
|---|---|---|---|
| 2026-04-20 → 2026-05-04 (Days 0–14) | Spec finalization; Jiaming review; counsel engagement RFP sent to 3 firms | Jiaming | — |
| 2026-05-05 → 2026-05-11 (v5.3 W1) | Counsel selected and retained; Twilio A2P 10DLC brand registration submitted | Jiaming | Counsel engagement letter signed |
| 2026-05-12 → 2026-06-01 (v5.3 W2–4) | Counsel review + redline; schema migration prepared; internal API scaffold written (not yet shipped) | Z + counsel | Counsel retained |
| 2026-06-02 → 2026-06-22 (v5.3 W5–7) | Counsel opinion received; disclosure_versions v1.0.0 recorded; schema migrated to prod; internal service deployed with feature flag off; consumer-facing flow build (depends on P2-1 consumer-facing-v1) | Z + Jiaming | Counsel sign-off + A2P 10DLC brand approval |
| 2026-06-23 → 2026-06-28 (v5.3 W8) | End-to-end test with Twilio trial numbers; ops runbook published; PagerDuty alerts configured | Prum + Z | Service deployed |
| 2026-06-29 → 2026-07-05 (v5.3 W9) | First loyalty-card launch — SMS flow live with one merchant; daily compliance review for first 7 days | Jiaming + Prum | All §9 hard-gate items closed |
| Ongoing | Disclosure-version governance (per-change counsel review); annual pepper rotation; quarterly opt-out-log spot-check; pre-Series-A TCPA audit before external growth marketing | Jiaming + ops | — |

---

## §8. Owner & Working Group

- **Primary owner:** Jiaming (founder) until general counsel (GC) is engaged; handoff to GC upon engagement.
- **TCPA counsel:** [TBD — target Kelley Drye / Davis & Gilbert / Cooley]. Engagement target 2026-05-11.
- **Engineering implementation:** Z.
- **Ops owner (opt-out SLA monitoring, dashboard, runbook):** Prum.
- **Incident escalation path:**
  1. Engineering on-call (first responder).
  2. Prum (ops escalation, within 30 min).
  3. Jiaming (founder, within 1 hour for any P0 TCPA risk — e.g., outbound send to opted-out number).
  4. Outside TCPA counsel (same-day for any potential statutory violation; retainer pre-authorizes 2-hour emergency call).

---

## §9. Trigger (Hard Gate — no exceptions)

**No SMS is sent by Push to any consumer under any circumstance until ALL of the following are true:**

1. **TCPA counsel written opinion letter is received**, covering consent language (§2.1), schema (§5.3), opt-in flow (§2.5), and opt-out flow (§3). The opinion letter is archived in the legal folder with counsel firm name, counsel attorney name, and opinion date.
2. **A2P 10DLC brand + campaign registered** with The Campaign Registry via Twilio; registration confirmation email archived; throughput tier assigned.
3. **Database tables in production** (`consent_log`, `opt_out_log`, `disclosure_versions`, `phone_pepper_rotations`) with RLS enabled and access roles verified by Z.
4. **Opt-out SLA alert configured** — PagerDuty rule firing on opt-out latency p95 > 30s; test page to Prum confirmed received.
5. **Internal ops runbook published** — written by Prum; reviewed by Jiaming; stored in `docs/ops/sms-opt-out-runbook.md`; includes escalation tree, manual-override procedure, and weekly-review cadence.
6. **First loyalty-card merchant briefed** in a recorded call on the SMS-only-if-consumer-opts-in architecture; merchant countersigns a one-page acknowledgement that Push will not send SMS on their behalf to any consumer who has not completed §2.5 opt-in.

All six items are checklist-tracked in the launch readiness doc. Any "no" answer is a launch blocker; no exceptions, no provisional deploys, no "just one test message" precedents.

---

## Appendix A — Reference Statutes and Primary Citations

1. **47 U.S.C. §227** — Telephone Consumer Protection Act of 1991, as amended. Federal statute establishing consent requirements for marketing calls/texts to wireless numbers.
2. **47 C.F.R. §64.1200** — FCC regulations implementing the TCPA, including the "prior express written consent" definition at §64.1200(f)(9).
3. **FCC Report and Order, CG Docket No. 02-278 (Feb 15, 2012)** — the "2012 Order" establishing "prior express written consent" for marketing SMS.
4. **FCC Declaratory Ruling and Order, CG Docket No. 02-278 (July 10, 2015)** — the "2015 Omnibus" addressing revocation of consent and reassigned-number safe harbors.
5. **Cal. Civ. Code §§1798.100–1798.199.100** — California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA). Notice, deletion, and compliance-exception provisions.
6. **Fla. Stat. §501.059** — Florida Telephone Solicitation Act, as amended by SB 1120 (2021) and HB 761 (2023).
7. **15 Okla. Stat. §775C.1 et seq.** — Oklahoma Telephone Solicitation Act (OTCPA).
8. **Wash. Rev. Code §19.190** — Washington Commercial Electronic Mail Act and related RCW 80.36.400.
9. **Conn. Gen. Stat. §42-288a** — Connecticut telemarketing restrictions (as amended 2023).
10. **Md. Code, Com. Law §14-3301 et seq.** — Maryland Telephone Solicitations Act.
11. **28 U.S.C. §1658(a)** — 4-year federal statute of limitations.
12. **15 U.S.C. §§7701–7713** — CAN-SPAM Act (for parallel opt-out architecture reference).
13. **TransUnion LLC v. Ramirez, 594 U.S. 413 (2021)** — Article III standing in class actions.
14. **Drazen v. Pinto, 74 F.4th 1336 (11th Cir. 2023)** — single unwanted text sufficient for Article III standing in TCPA cases.

---

## Appendix B — Pre-Flight Checklist (20+ items)

Each item has an owner and a due date. Checked only when the deliverable is in production or the artifact is archived. No item may be self-checked; cross-verification by a second party is required for items marked **(verify)**.

| # | Item | Owner | Due | Status |
|---|---|---|---|---|
| B1 | TCPA counsel selected and retainer paid | Jiaming | 2026-05-11 | [ ] |
| B2 | Counsel opinion letter on consent language received | Counsel | 2026-06-01 | [ ] |
| B3 | Counsel opinion letter on schema received | Counsel | 2026-06-01 | [ ] |
| B4 | A2P 10DLC brand registration submitted to TCR | Z | 2026-05-11 | [ ] |
| B5 | A2P 10DLC brand approved by TCR | TCR | 2026-06-08 | [ ] |
| B6 | A2P 10DLC campaign registered with approved opt-in language | Z | 2026-06-15 | [ ] |
| B7 | `consent_log` + `opt_out_log` + `disclosure_versions` + `phone_pepper_rotations` migrated to prod | Z | 2026-06-15 | [ ] |
| B8 | RLS policies verified on all four tables (verify) | Z + Jiaming | 2026-06-15 | [ ] |
| B9 | Pepper v2026 generated and stored in KMS; `phone_pepper_rotations` seeded | Z | 2026-06-15 | [ ] |
| B10 | Internal consent service deployed with feature flag OFF | Z | 2026-06-22 | [ ] |
| B11 | Twilio Verify integration end-to-end test passed with trial numbers | Z | 2026-06-22 | [ ] |
| B12 | Outbound gate-check (§5.5) integration test — verified blocks unauthorized send (verify) | Z + Prum | 2026-06-22 | [ ] |
| B13 | Opt-out keyword integration test — all 9 keywords recognized (verify) | Z | 2026-06-22 | [ ] |
| B14 | Opt-out confirmation SMS text matches §3.2 byte-for-byte (verify) | Prum | 2026-06-22 | [ ] |
| B15 | HELP keyword response test passed | Z | 2026-06-22 | [ ] |
| B16 | PagerDuty opt-out-latency alert configured; test page delivered to Prum | Prum | 2026-06-22 | [ ] |
| B17 | Dashboard panels live on ops Grafana / Supabase Studio | Prum | 2026-06-22 | [ ] |
| B18 | Ops runbook published at `docs/ops/sms-opt-out-runbook.md` | Prum | 2026-06-22 | [ ] |
| B19 | Privacy policy updated with SMS consent + retention disclosure | Jiaming + privacy counsel | 2026-06-22 | [ ] |
| B20 | Disclosure-versions table populated with v1.0.0-2026-05-04 including counsel reviewer | Jiaming | 2026-06-15 | [ ] |
| B21 | First merchant briefed + acknowledgement countersigned | Jiaming | 2026-06-28 | [ ] |
| B22 | Feature flag flipped ON for first merchant only | Z | 2026-06-29 | [ ] |
| B23 | Day-1 post-launch review: opt-in rate, opt-out rate, delivery rate, any gate-block events | Prum + Jiaming | 2026-06-30 | [ ] |

---

## Appendix C — Common TCPA Violations to Avoid (12 items)

Drawn from reported TCPA class-action dockets. Not exhaustive.

1. **Pre-checked consent boxes** — disallowed by FCC 2012 Order. Cf. *Satterfield v. Simon & Schuster*, 569 F.3d 946 (9th Cir. 2009).
2. **Disclosure hidden in ToS** — consent must be clear-and-conspicuous per §64.1200(f)(9). *Van Patten v. Vertical Fitness Group, LLC*, 847 F.3d 1037 (9th Cir. 2017).
3. **Continuing to message after STOP** — *Johansen v. National Gas & Electric*, 2018 WL 3933472 (N.D. Ill. 2018) (single post-opt-out message sufficient).
4. **Relying on third-party / data-broker consent** — consent must run from the consumer to the specific seller.
5. **No proof of consent** — defendants routinely lose TCPA class actions because they cannot produce the record. See §5.3 `consent_log`.
6. **Sending during prohibited hours** — FTSA 8 a.m.–8 p.m. local; observe strictest state window.
7. **ATDS without prior express written consent** — *Facebook, Inc. v. Duguid*, 592 U.S. 395 (2021) narrowed but did not eliminate ATDS liability; state mini-TCPAs unaffected.
8. **Reassigned-number exposure** — FCC 2015 Omnibus one-call safe harbor; 2019 RND available. Query RND or accept safe-harbor risk.
9. **Text from unregistered A2P 10DLC number** — Twilio/carrier throttling and fines pass through.
10. **Omission of sender identity** — §64.1200(b) caller-ID identification, satisfied via brand + campaign.
11. **Confusing opt-out instructions** — "Reply STOP to opt out" is the only safe phrasing.
12. **Promotional content in opt-out confirmation** — permitted phrasing only; no marketing.

---

## Appendix D — Open Questions for Outside TCPA Counsel (10+ items)

Counsel is requested to provide written answers to each of the following in the opinion letter.

1. Do both consent-language variants in §2.1 satisfy 47 C.F.R. §64.1200(f)(9) for "prior express written consent," and is there a preferred variant for Push's fact pattern?
2. Is the `consent_log` schema in §5.3 sufficient as a defense-of-consent record in a TCPA class action, or should additional fields be captured (geolocation, screen recording, device fingerprint)?
3. Is Push's double-opt-in design (§2.5) required or merely best practice? If best practice, should Push retain single-opt-in as an alternative flow for counsel-approved scenarios?
4. Should Push implement Reassigned Number Database (RND) queries before sending any marketing SMS, or does the §64.1200(a)(1)(iv) safe harbor sufficiently mitigate?
5. Does Push's status as a platform (with merchant-specific consent) create any additional TCPA exposure compared to a direct-to-consumer sender, and if so, should the consent language name Push in addition to the merchant?
6. How should `STOPALL` be legally treated — as opt-out from Push (the platform) or opt-out from each merchant individually? Does the confirmation SMS need to enumerate each merchant?
7. For state mini-TCPAs (§1.3), which state residency proxy is most defensible (phone NPA-NXX vs. self-declared address), and how should conflicts be handled?
8. Does the 4-year retention schedule in §4.1 adequately cover the longest applicable statute of limitations, given class-tolling doctrines and state SOLs?
9. For CCPA right-to-delete requests, is Push's reliance on §1798.105(d)(1) (compliance exception) the correct posture, or should Push offer partial deletion (e.g., purge phone E.164 but retain hash)?
10. Is the current confirmation SMS text (§3.2) compliant with the "no marketing content in opt-out confirmation" CTIA guidance while also being clear about the scope of the opt-out?
11. If Push subsequently expands to creator-initiated SMS flows (creator sends message to their own consumer audience through Push), does this change the consent architecture, and what additional safeguards are required?
12. For the first 6 months post-launch, should Push send any consumer-initiated transactional messages (e.g., appointment reminders on behalf of a merchant) under the same consent record, or should transactional consent be captured separately?
13. What notice obligations does Push have to consumers when the pepper used for their `phone_hash` is rotated, if any?
14. For the §5.5 fail-closed gate, if a consent check times out and a send is blocked, what obligation (if any) does Push have to notify the merchant that their campaign did not reach this recipient?

---

## Appendix E — Disclosure Version Governance

Every material change to consent language (§2.1), opt-in flow (§2.5), opt-out confirmation (§3.2), or HELP response (§3.5) requires a new `disclosure_versions` row before deploy. Each new version requires counsel review, Jiaming approval, reviewer name, review date, and opinion-letter reference. The `consent_log.disclosure_version` FK makes every consent record traceable to the exact text shown — the defense-of-consent workhorse in litigation. Effective-date ranges are non-overlapping.

---

## Appendix F — Glossary

**A2P 10DLC** — Application-to-Person via 10-digit long codes (the US business-SMS registration framework). **ATDS** — Automatic Telephone Dialing System (47 U.S.C. §227(a)(1), narrowed by *Facebook v. Duguid*). **CTIA** — wireless industry trade body; publishes Messaging Principles carriers enforce. **E.164** — international phone format (e.g., `+14155552671`). **RND** — Reassigned Number Database (Somos, FCC authority). **TCR** — The Campaign Registry, central A2P 10DLC registry. **STOPALL** — consumer-initiated global opt-out across all brands on the same platform.

---

### §10. RACI — SMS Compliance Launch

Responsible = does the work. Accountable = single approver who signs off. Consulted = expertise input before decision. Informed = notified after. One Accountable per row; multiple Responsibles acceptable only when the work is genuinely split. Counsel is Accountable on every legal-language row — engineering cannot self-approve disclosure text.

| # | Activity | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|---|
| R1 | Draft consent language v1 (§2.1 Variants A/B) + counsel review | Jiaming | Outside TCPA counsel | Z (display constraints), Prum (ops review) | Board; first pilot merchant |
| R2 | A2P 10DLC brand registration (Twilio Trust Hub → TCR) | Z | Jiaming | Twilio account team; counsel (opt-in language submission) | Prum; board |
| R3 | A2P 10DLC campaign registration (use-case, sample-message submission) | Z | Jiaming | Counsel (references approved §2.1 language) | Prum |
| R4 | `consent_log` DDL + migration `2026-05-04-sms-compliance-v1.sql` | Z | Z | Jiaming (schema approval); counsel (field sufficiency, §6.2) | Prum |
| R5 | `opt_out_log` DDL + indefinite-retention RLS policy | Z | Z | Jiaming; counsel (CCPA §1798.105(d)(1) posture, §4.5) | Prum |
| R6 | Twilio Verify integration (double opt-in orchestrator; §2.5) | Z | Z | Jiaming (copy review); counsel (flow approval) | Prum |
| R7 | Outbound message send-gate — fail-closed wrapper around every SMS dispatch (§5.5) | Z | Z | Prum (alerting hooks); counsel (fail-closed posture) | Jiaming |
| R8 | Pepper rotation infrastructure — KMS key, `phone_pepper_rotations` table, dual-read window logic (§4.6; §12) | Z | Jiaming | Counsel (PII posture); security reviewer (pre-A audit partner when engaged) | Prum |
| R9 | Opt-out SLA dashboard — 10-second target, 30-second escalation, PagerDuty rule (§3.4; §5.6) | Prum | Prum | Z (metric instrumentation) | Jiaming; counsel (evidence of SLA honored) |
| R10 | Incident-response runbook + tabletop rehearsal (§11) | Prum | Jiaming | Counsel (scenario 5/6 escalation tree); Z (containment hooks) | Board (post-rehearsal readiness report) |
| R11 | Merchant briefing + countersigned acknowledgement (§9, item 6) | Jiaming | Jiaming | Counsel (acknowledgement text); Prum (attended the call) | Merchant; Z |
| R12 | Disclosure-version governance — `disclosure_versions` write-ops, immutable audit, counsel review on every change (§12) | Jiaming | Outside TCPA counsel | Z (storage); Prum (ops awareness of version-in-flight) | Board |

**Role legend.**
- Responsible = does the work (multiple OK).
- Accountable = single sign-off, no delegation.
- Both Responsible and Accountable rows above must be staffed before §9 hard gate is released.

**Escalation paths.** P0 (outbound to opted-out number) escalates: on-call engineer → Prum (≤ 30 min) → Jiaming (≤ 1 hr) → outside TCPA counsel (same-day emergency call, pre-authorized retainer). P1 (opt-out SLA p95 breach, Twilio webhook failures > 1%) escalates to Prum hourly, Jiaming daily digest, counsel weekly. P2 stays inside engineering.

---

### §11. Incident Response Runbook (TCPA violation scenarios)

Six-step template per scenario: **Detection → Containment → Investigation → Notification → Remediation → Post-mortem**. P0 targets < 60 min to containment; P1 < 4 hr. Owner Prum; counsel-reviewed before §9 gate 5 closes.

#### 11.1 Scenario — Outbound SMS sent to an opted-out number (P0)

- **Detection.** §5.6 P0 page: any gate-block where `attempted_recipient_phone_hash` is present in `opt_out_log`. Also: direct consumer complaint (email, social, follow-up STOP).
- **Containment.** Within 10 min: feature-flag OFF for sending merchant; set `outbound_blocklist_override=true` until root-cause identified; pause Twilio Messaging Services on brand (Console → suspend campaign).
- **Investigation.** Pull `outbound_message_attempts` row; trace send orchestrator logs; read `consent_log` history including `supersedes_consent_id` chain; read Twilio delivery callback; confirm whether §5.5 check fired and returned wrong answer or was bypassed.
- **Notification.** Direct apology SMS to consumer within 24 hr from same A2P 10DLC campaign: *"A message was sent in error after your opt-out. You remain opted out. We're sorry. Reply HELP for help."* Email outside TCPA counsel same-day with payload (message SID, consent_log IDs, opt_out_log ID, gate-check log). Jiaming + Prum on call within 24 hr.
- **Remediation.** Re-confirm opt-out (`compliance-forced` row); add permanent blocklist with `forbid-reactivation=true`; if pilot-merchant campaign spend involved, refund the SMS cost and offer $50 good-faith credit (policy pending counsel confirmation).
- **Post-mortem.** 5-business-day written post-mortem; new `disclosure_versions` row only if consent/opt-out language changes (not for pure infra fixes). Archive at `docs/ops/incidents/YYYY-MM-DD-scenario-1.md`.

#### 11.2 Scenario — Outbound SMS sent without any consent record (P0)

- **Detection.** §5.6 P0 page: `outbound_message_attempts` row dispatched where no `consent_log` row with `status='completed'` exists for `(phone_hash, merchant_id)`. Or consumer complaint: "I never signed up."
- **Containment.** Pause sending campaign in Twilio; feature-flag OFF for that merchant; halt scheduled sends for the pair. Within 60 min: halt all outbound for the brand pending triage.
- **Investigation.** Did §5.5 check fail open (fail-closed broken)? Did a code path skip the check? Was `consent_log` row purged early (§4.1 should prevent for 4 yr)? Pull consent-service app logs from 72 hr prior.
- **Notification.** Consumer apology SMS (template per 11.1); counsel same-day; if multi-consumer gap, counsel advises whether voluntary FCC/state-AG disclosure is appropriate. Jiaming-to-board within 48 hr if class-action exposure possible.
- **Remediation.** Root-cause fix deployed with verification test; backfill affected `phone_hash` rows to `opt_out_log` as `compliance-forced`; internal Code Orange — no outbound until remediated + counsel sign-off.
- **Post-mortem.** 5-business-day post-mortem; triggers §12 disclosure-version rotation if the gap was process (not pure code). Pre-Series-A TCPA audit scope expands to cover.

#### 11.3 Scenario — `consent_log` bulk-deleted accidentally (P0)

- **Detection.** Schema-monitor alert (row-count drop > 0.1% in 5 min); failed-check rate on §5.5 gate spikes; ops discovery in dashboard.
- **Containment.** Revoke the Supabase role that issued the delete; pause all outbound SMS; freeze schema migrations.
- **Investigation.** Pull Supabase audit logs (PITR + WAL); identify the SQL statement and actor; confirm whether backups cover the time range; assess which `(phone_hash, merchant_id)` pairs lost evidence.
- **Notification.** Counsel same-day — loss of defense-of-consent evidence is elevated litigation risk. If restore impossible, treat affected consumers as expired; re-opt-in SMS not permitted (would be first-contact without consent). Merchant informed audience is off-limits until consumer re-initiates §2.5.
- **Remediation.** Restore from backup if available; otherwise mark affected rows `status='expired-unverified'` with data-loss annotation; verify §4.4 INSERT-only RLS is enforced; add row-deletion alarm to §5.6.
- **Post-mortem.** 10-business-day post-mortem (process failure, not code bug). Pepper rotation NOT triggered (data loss does not imply pepper compromise).

#### 11.4 Scenario — Twilio webhook outage (opt-out not received) (P1)

- **Detection.** Twilio webhook failure rate > 1% over 15 minutes (§5.6 alert); or Twilio status page indicates platform incident; or inbound-SMS test traffic fails.
- **Containment.** Enter Twilio-degraded mode: outbound marketing sends pause for the duration of the outage (fail-closed preferred over a missed opt-out). In-memory deny-list continues to operate for already-known opt-outs.
- **Investigation.** Work with Twilio support in parallel; pull Twilio's `messages` API to reconcile any inbound messages Push did NOT webhook-receive during the window; run the reconciliation batch job (below).
- **Notification.** Counsel informed within 4 hours if outage exceeds 30 minutes; merchants on the affected sending campaigns informed that their outbound queue paused. No direct consumer notification until reconciliation completes.
- **Remediation.** Reconciliation batch job runs against Twilio `messages` API for the outage window; any inbound message matching an opt-out keyword is treated as if its webhook had fired — `opt_out_log` rows inserted retroactively with the Twilio-reported `date_received` timestamp; `outbound_message_attempts` from that window are reviewed for any post-outage send to those newly-detected opt-outs (should be zero because outbound was paused; any such row escalates to §11.1).
- **Post-mortem.** 3-business-day post-mortem; revises §5.6 alerting if outage was detected late. Twilio outage falls under Twilio's SLA, not Push's — but Push's fail-closed architecture is what prevents this from becoming a §11.1 incident.

#### 11.5 Scenario — State AG inquiry letter received (P1, escalates to P0 on response)

- **Detection.** Receipt of a letter from a state AG's office (via legal@push.nyc, postal mail, or service of process on the registered agent). Usually Florida, Washington, or California given Push's footprint.
- **Containment.** Do not respond unilaterally. Jiaming forwards same-day to outside TCPA counsel + general corporate counsel. Litigation hold enters effect on all `consent_log`, `opt_out_log`, `disclosure_versions`, `outbound_message_attempts`, Twilio logs, and relevant Slack/email threads.
- **Investigation.** Counsel-led. Push engineering produces a data-export of all rows matching the AG's cited phone numbers or date range within 5 business days. Disclosure-version history is compiled. Gate-block event log is compiled.
- **Notification.** Consumer notification depends entirely on counsel direction; default is no direct notification. Board notified within 24 hours. Investors notified only if counsel advises material-adverse-change threshold is met.
- **Remediation.** Counsel drafts response. Remediation of any identified practice (e.g., a state requires stricter time-of-day window) is implemented within the AG's stipulated window or counsel-negotiated timeline.
- **Post-mortem.** Written by counsel (privileged); internal distillation in `docs/ops/incidents/` captures process learnings. Disclosure version bumps if the inquiry forces a language change.

#### 11.6 Scenario — Class-action demand letter received (P0)

- **Detection.** Receipt of a demand letter from plaintiffs' counsel, typically alleging one or more violations of 47 U.S.C. §227(b) and requesting records plus a pre-suit resolution offer (FL FTSA 15-day pre-suit notice-and-cure also lives here for FL-focused letters).
- **Containment.** Jiaming forwards same-day to outside TCPA counsel. Automatic litigation hold on all compliance records. D&O insurer is notified immediately per policy language (most policies require notice within 30 days of a claim; do it within 5 business days to be safe).
- **Investigation.** Counsel-led, privileged. Push produces the proof-of-consent binder (§13 audit group) for the named plaintiffs within 10 business days.
- **Notification.** Named plaintiffs only via counsel. No direct contact with plaintiffs. Board notified within 24 hours; if the claim plausibly exceeds $500K gross exposure, a board resolution memorializes counsel engagement and reserves for fees.
- **Remediation.** Dependent on counsel strategy — pre-suit settle, cure-notice response (FL HB 761 15-day window), or full-defense posture. If a practice is identified as non-compliant, remediate regardless of outcome on the specific claim (stop the harm now; defend the past separately).
- **Post-mortem.** Post-case only; during active litigation, privileged counsel work-product is the only written record. Disclosure version bumps if the case surfaces a language defect.

#### 11.7 Gaps surfaced by this runbook (platform-side readiness deltas — must close before §9 gate 5)

1. **No 24x7 on-call rotation.** Prum is sole ops-SLA owner. Sub-60-min P0 containment requires a rotation OR a written response-hours-only SLA (e.g., 9 a.m.–9 p.m. ET) plus an outbound-pause policy outside the window.
2. **Twilio reconciliation batch job (§11.4) does not exist.** Must be written and tested before launch; owner Z.
3. **Point-in-time-recovery (§11.3) assumes Supabase PITR enabled.** Verify plan tier supports PITR and retention covers a 4-yr litigation-exposure period; otherwise export-to-archive nightly job required.
4. **D&O insurance (§11.6) is not yet bound** (audit register row #26). A class-action demand letter today lands on an uninsured balance sheet. Treat D&O as §9-gate-adjacent.
5. **No pre-authorized counsel retainer for emergency calls.** Engagement letter (§6.2) must specify 2-hr emergency-call availability with hourly-rate cap; otherwise same-day response in §11.1/§11.2 is best-effort only.

---

### §12. Governance Log (disclosure version + pepper rotation)

Source of truth for "which consent text did we show the consumer on date X, and who approved it?" Per *Van Patten* and progeny, a defendant who cannot produce the exact text shown loses on the consent element — this is the TCPA defense workhorse.
#### 12.1 `disclosure_versions` — extended contract

- `version_id` (PK, text): monotonic tag following `v<MAJOR>.<MINOR>.<PATCH>-YYYY-MM-DD` (e.g., `v1.0.0-2026-05-04`). MAJOR bumps on counsel-redlined rewrite; MINOR on text change (word order, added phrase); PATCH on typo fix only (must still be counsel-confirmed as non-substantive).
- `disclosure_text` (text, not null): exact verbatim text shown to the consumer. Merchant-name placeholder stays as `[Merchant Legal Name]` in this table; the substituted final string lives in `consent_log.exact_consent_text_shown`.
- `effective_from_timestamp` / `effective_to_timestamp` (timestamptz; second is nullable): live window. Exactly one row per scope has `effective_to_timestamp IS NULL` at any instant.
- `approved_by` (text, not null): legal name of the Push approver (Jiaming or GC when engaged).
- `legal_review_id` (text, not null): opaque reference to counsel opinion / redline (e.g., `kelley-drye-2026-05-04-opinion.pdf`) in the privileged legal folder.
- `change_reason` (enum: `initial`, `counsel-redline`, `state-law-update`, `twilio-policy-update`, `typo-fix`, `regulatory-update`, `incident-driven`).
- `previous_version_id` (nullable FK back to `disclosure_versions`): lineage for diff.
- `counsel_firm` / `counsel_attorney` (text, not null for non-`typo-fix` rows).

**Rotation triggers (exhaustive list — any one triggers a new version before re-deploy).**

1. Counsel-approved text change of any kind.
2. State-law update that touches timing, scope, or language (e.g., new state mini-TCPA passed).
3. Platform-terms update — Twilio, CTIA, or TCR publishes a new requirement or recommended language.
4. FCC rulemaking (NPRM final or declaratory ruling) that affects consent.
5. Merchant entity-name change (triggers a new version scoped to that merchant only — the template text is unchanged but the substituted-display text differs).
6. Incident-driven — §11.1 or §11.2 where counsel advises prospective language tightening.

#### 12.2 Pepper rotation — operational contract

- **Cadence.** Annual, on the first Monday of April (e.g., 2027-04-05). This deliberately misaligns from calendar-year roll to avoid conflicting with December retail peak and end-of-year close.
- **Dual-read window.** 90 days following rotation, the consent-lookup service computes the hash under both `pepper_N` and `pepper_N+1` and accepts a match under either. After Day 90, `pepper_N` is retired from the read path (still retained in KMS for §4.6 4-year recovery).
- **Atomic switch.** The `consent_log.pepper_version` column is not backfilled; each row retains its original pepper_version. New rows written during the dual-read window use `pepper_N+1`.
- **Authority.** Jiaming is the sole approver; Z performs the rotation; Prum verifies hashes match for a spot-check sample of 50 rows in production before the rotation is marked complete.

#### 12.3 Audit log — append-only

```sql
CREATE TABLE governance_log (
  governance_event_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_timestamp      timestamptz NOT NULL DEFAULT now(),
  event_type           text NOT NULL CHECK (event_type IN (
    'disclosure_version_created',
    'disclosure_version_effective',
    'disclosure_version_superseded',
    'pepper_rotation_initiated',
    'pepper_rotation_dual_read_start',
    'pepper_rotation_dual_read_end',
    'pepper_rotation_completed',
    'counsel_opinion_received',
    'state_law_scan_performed',
    'incident_post_mortem_archived'
  )),
  actor                text NOT NULL,
  subject_version_id   text REFERENCES disclosure_versions(version_id),
  subject_pepper_version int REFERENCES phone_pepper_rotations(pepper_version),
  payload              jsonb NOT NULL DEFAULT '{}',
  immutable_hash       char(64) NOT NULL -- SHA-256 of all preceding fields; computed at insert
);

CREATE INDEX idx_governance_event_timestamp ON governance_log (event_timestamp DESC);
CREATE INDEX idx_governance_event_type ON governance_log (event_type, event_timestamp DESC);

ALTER TABLE governance_log ENABLE ROW LEVEL SECURITY;
-- Service role INSERT only. Ops role SELECT only. No UPDATE / DELETE by any role.

CREATE TABLE pepper_rotations (
  pepper_version             int PRIMARY KEY,
  rotation_initiated_at      timestamptz NOT NULL,
  dual_read_start_at         timestamptz NOT NULL,
  dual_read_end_at           timestamptz NOT NULL,
  rotation_completed_at      timestamptz,
  initiated_by               text NOT NULL,
  completed_by               text,
  kms_key_reference          text NOT NULL,
  previous_pepper_version    int REFERENCES pepper_rotations(pepper_version),
  spot_check_sample_count    int,
  spot_check_passed          boolean,
  notes                      text
);

ALTER TABLE pepper_rotations ENABLE ROW LEVEL SECURITY;
-- Service role INSERT / UPDATE until rotation_completed_at is set; then row is effectively frozen.
-- Ops role SELECT only.
```

**Immutability.** `governance_log.immutable_hash` chains each row to the SHA-256 of the prior row's hash concatenated with the current row's contents, producing a lightweight hash-chain. Tampering downstream is detectable on audit. `pepper_rotations` is INSERT-only once `rotation_completed_at` is set; pre-completion UPDATEs are permitted only to advance the workflow fields (`dual_read_start_at` → `dual_read_end_at` → `rotation_completed_at`).

**Replaces** the earlier `phone_pepper_rotations` sketch in §5.3 — the DDL above is the authoritative version. The migration `2026-05-04-sms-compliance-v1.sql` should use these definitions.

---

### §13. Pre-Deploy Checklist (30 items, owner per item)

Expands Appendix B (23 items) into a 30-item Monday-morning readiness list grouped by function. Each row has a single owner, verification step, status. Items marked **(verify)** require second-party sign-off. All 30 must close before §9 hard gate releases.

#### 13.1 Legal (6 items)

| # | Item | Owner | Verification | Status |
|---|---|---|---|---|
| PD-L1 | Engagement letter signed with outside TCPA counsel; retainer paid | Jiaming | Counter-signed engagement letter PDF archived | [ ] |
| PD-L2 | Counsel opinion letter received covering §2.1 consent language, §5.3 schema, §2.5 flow, §3 opt-out (verify) | Jiaming + counsel | Opinion letter PDF archived; `legal_review_id` recorded in `disclosure_versions` row | [ ] |
| PD-L3 | Counsel opinion on state-law overlay (§1.3) — list of states to treat as stricter than TCPA produced | Counsel | Written memo, at minimum FL/OK/WA/CT/MD covered | [ ] |
| PD-L4 | Counsel opinion on CCPA §1798.105(d)(1) compliance-exception posture for opt-out records (§4.2) | Privacy counsel (possibly bundled) | Written memo | [ ] |
| PD-L5 | Fresh state-law scan — all 50 states surveyed for mini-TCPA / new-law changes in the 120 days preceding launch | Counsel (or assistant under counsel) | Dated memo | [ ] |
| PD-L6 | FCC 2024 robocall/robotext-update review — confirm no unhonored obligations (e.g., one-to-one consent rule developments) | Counsel | Written memo | [ ] |

#### 13.2 Technical (10 items)

| # | Item | Owner | Verification | Status |
|---|---|---|---|---|
| PD-T1 | A2P 10DLC brand approved by TCR via Twilio Trust Hub | Z | Twilio console shows brand status = `APPROVED`; confirmation email archived | [ ] |
| PD-T2 | A2P 10DLC campaign registered with approved §2.1 opt-in language | Z | Twilio console shows campaign status = `REGISTERED`; opt-in language matches `disclosure_versions` row byte-for-byte | [ ] |
| PD-T3 | Database migration `2026-05-04-sms-compliance-v1.sql` applied to production | Z | `consent_log`, `opt_out_log`, `disclosure_versions`, `pepper_rotations`, `governance_log`, `outbound_message_attempts` tables exist; `\d+` spot-check of each; RLS enabled on all | [ ] |
| PD-T4 | RLS policies verified on all compliance tables (verify) | Z + Jiaming | Attempt from each role (service / app / ops) confirms the policy matrix | [ ] |
| PD-T5 | Pepper v2026 generated, stored in KMS, seeded in `pepper_rotations` | Z | KMS reference in `kms_key_reference` column; test hash roundtrip | [ ] |
| PD-T6 | Internal consent service deployed with feature flag OFF | Z | Service live at `/api/internal/consent/*`; feature-flag check blocks all traffic; synthetic healthcheck green | [ ] |
| PD-T7 | Twilio Verify integration end-to-end test passed with trial numbers (happy path + code-timeout path) | Z | Test log archived showing both outcomes | [ ] |
| PD-T8 | Outbound send-gate §5.5 integration test — blocks unauthorized send across 5 counter-example fixtures (verify) | Z + Prum | Test log with each fixture showing `permitted=false` and no Twilio-send-attempt | [ ] |
| PD-T9 | Inbound opt-out keyword handler — all 9 keywords recognized including case + whitespace variants (verify) | Z | Integration test suite passing | [ ] |
| PD-T10 | Twilio webhook reconciliation batch job (§11.4) deployed, dry-run over a past 24-hour window succeeds | Z | Log shows zero missed opt-outs reconciled from test window | [ ] |

#### 13.3 Operational (6 items)

| # | Item | Owner | Verification | Status |
|---|---|---|---|---|
| PD-O1 | PagerDuty opt-out-latency rule configured at p95 > 30s threshold; test page delivered to Prum | Prum | PagerDuty rule config screenshot + on-call ack received | [ ] |
| PD-O2 | P0 page for gate-block-on-opted-out-number tested end-to-end | Prum | Test page delivered; Jiaming cc'd | [ ] |
| PD-O3 | Dashboard panels live (opt-in rate, opt-out latency p50/p95/p99, gate-block events, Twilio delivery rate) | Prum | Grafana / Supabase Studio URL with all 5 panels visible; each panel queries live data | [ ] |
| PD-O4 | Incident-response runbook §11 rehearsed as a tabletop (all 6 scenarios walked through) | Prum + Jiaming + Z | Tabletop minutes archived; gaps (§11.7) tracked to closure | [ ] |
| PD-O5 | Ops on-call coverage defined — either 24x7 rotation OR written response-hours-only SLA with outbound-pause policy outside the window | Prum + Jiaming | Rotation roster or policy memo signed | [ ] |
| PD-O6 | Weekly compliance-review cadence scheduled in Prum's calendar for the first 13 post-launch weeks | Prum | Calendar series created with agenda template | [ ] |

#### 13.4 Communication (4 items)

| # | Item | Owner | Verification | Status |
|---|---|---|---|---|
| PD-C1 | Consumer-facing copy (§2.1 + §3.2 + §3.5) reviewed byte-for-byte across every surface that renders it (web form, Wallet card, email) | Jiaming | Surface-level screenshots attached to the `disclosure_versions` row; Cross-ref to P2-1 consumer-facing §1 user journey step 5 | [ ] |
| PD-C2 | First pilot merchant briefed in a recorded call covering consumer-opt-in-required architecture; recording retained | Jiaming | Recording URL + attendance list archived | [ ] |
| PD-C3 | First pilot merchant countersigned the one-page §9 acknowledgement; PDF archived | Jiaming | Counter-signed PDF archived in legal folder | [ ] |
| PD-C4 | Privacy Policy updated with SMS consent, retention, and CCPA-exception language; Cross-ref to audit register row #24 | Jiaming + privacy counsel | Privacy Policy live at `/privacy`; version bump recorded | [ ] |

#### 13.5 Audit (4 items)

| # | Item | Owner | Verification | Status |
|---|---|---|---|---|
| PD-A1 | Proof-of-Compliance binder Day-0 snapshot assembled (consent language; A2P 10DLC approval; RLS proof; disclosure_version v1.0.0 payload) | Prum | Binder PDF archived in legal folder | [ ] |
| PD-A2 | Proof-of-Compliance binder has a rotation schedule — Day 7, Day 30, Day 90 snapshots scheduled | Prum | Calendar events created; snapshot template defined | [ ] |
| PD-A3 | `governance_log` hash-chain integrity check scheduled weekly for first 13 weeks | Z | Cron job or scheduled task archived; first run green | [ ] |
| PD-A4 | First-90-days external-audit-readiness memo drafted — what would we hand a TCPA auditor if they arrived tomorrow | Jiaming + counsel | Memo archived; referenced in pre-Series-A audit scope (§6.4) | [ ] |

**Total: 30 items.** Any "no" answer is a launch blocker.

---

### §14. FAQ / Counsel Pre-Reads

Questions an outside TCPA specialist is most likely to ask on a first read, with Push's proposed answer, spec-evidence pointer, and known gap. This is the prep doc Jiaming brings to the §6.2 counsel call.

1. **"Show me the exact consent language shown to the consumer. Is it clear and conspicuous?"**
   - **Answer.** Two variants in §2.1 (Variant A primary, Variant B condensed for ≤ 320px). §2.2 specifies ≥14px font, #003049 on #f5f2ec (contrast ≥ 7.0), placement directly above the phone-input, checkbox-never-pre-checked, no tooltip or expand/collapse hiding.
   - **Evidence.** §2.1, §2.2; `disclosure_versions` table (§5.3 + §12); `consent_log.exact_consent_text_shown` per row. **Gap.** None structural; pending counsel redline.
2. **"What record of each opt-in event do you retain?"**
   - **Answer.** One `consent_log` row per event with 19 fields including exact consent text shown, IP hash, UA, timestamp, and pepper version. Retained 4 years from opt-in. Insert-only; amendments are new rows.
   - **Evidence.** §2.4 table; §4.1 retention; §5.3 DDL. **Gap.** Counsel may request screen-capture / session replay (see FAQ #2 overlap) — current design excludes them per CCPA minimization.
3. **"How do you handle STOP replies received outside business hours?"**
   - **Answer.** Opt-out handler is always-on via Twilio webhook. Latency target p95 ≤ 10s, p99 < 30s regardless of time-of-day. §3.4 fail-closed in-memory deny-list protects against webhook-handler backlog. §11.7 flags that Push does not yet have 24x7 human on-call, but the machine-side opt-out propagation is 24x7 by design.
   - **Evidence.** §3.4; §3.6; §5.5 deny-list; §11.7 gap. **Gap.** Human escalation outside business hours is a §11.7 gap; manual-override tickets might accrue overnight.
4. **"What's your position on reassigned numbers (consumer X's number later assigned to Y)?"**
   - **Answer.** Open question for counsel, raised as Appendix D item #4. Interim posture: do not query the Reassigned Number Database in v1; rely on §64.1200(a)(1)(iv) one-call safe harbor for the first verification-SMS; §2.5 double-opt-in materially reduces the window in which a reassigned number is silent.
   - **Evidence.** Appendix D #4; §2.5 step 2. **Gap.** Counsel may require RND queries before §9 gate is released. RND subscription cost estimated $1.50 per-query; budgeted line-item not yet in §legal-budget-v1.
5. **"How do you handle international numbers in your flow?"**
   - **Answer.** Twilio Lookup rejects any non-US/Canada E.164 at the `/initiate` endpoint in v1. Consumer sees "This service is currently US-only" copy. GDPR / non-US compliance deferred to a later revision.
   - **Evidence.** §1.4 (GDPR out of scope); §5.4 `/initiate` validates via Twilio Lookup. **Gap.** Copy for the US-only rejection is not yet written; add to PD-C1 consumer-facing review.
6. **"Do you send any transactional SMS (non-marketing) and how is that distinguished?"**
   - **Answer.** v1 does not send transactional SMS. The verification SMS during §2.5 double-opt-in is the sole non-marketing send; it is required for consent establishment and is sent only to numbers where the consumer affirmatively submitted the web form. No appointment reminders, order confirmations, or other transactional traffic in v1. Counsel question pending (Appendix D #12) on whether bundling future transactional consent with marketing consent is acceptable.
   - **Evidence.** §2.5 step 2; Appendix D #12. **Gap.** Transactional architecture will require a v2 spec if/when merchants request it.
7. **"What's the TCPA exposure on welcome/verification SMS during the double-opt-in flow itself?"**
   - **Answer.** The verification SMS is content-neutral and time-bounded (10-minute code TTL, §2.5 step 2). It is sent only to numbers where the consumer affirmatively entered the number and checked the disclosure — the act-of-submission is prior express consent for the single verification SMS under existing precedent (*In re Rules and Regulations Implementing the TCPA*, CG Docket No. 02-278, confirmatory-text analysis). The welcome SMS (§2.5 step 4) is sent only after code confirmation and includes the STOP reminder.
   - **Evidence.** §2.5; Appendix D #3 for counsel confirmation. **Gap.** Counsel opinion should confirm both sends are permissible without additional consent capture.
8. **"Have you reviewed FCC 2024 robocall/robotext updates?"**
   - **Answer.** The FCC's 2023–2024 rulemaking on "one-to-one consent" (revocation of lead-generator aggregated consent) was stayed by the 11th Circuit in *Insurance Marketing Coalition v. FCC* (Jan 2025). Push's architecture already treats consent as one-to-one between consumer and merchant (§2.4 `consenting_party='consumer'`, no third-party-originated consent accepted), so Push is structurally aligned regardless of where the rulemaking lands. PD-L6 tracks counsel's full review.
   - **Evidence.** §2.3 primary-path-only; §2.4 schema; PD-L6. **Gap.** Counsel confirmation of current FCC posture on-date-of-launch is required.
9. **"Are pilot merchants required to sign a sub-processor agreement?"**
   - **Answer.** Pilot merchants are the **senders of record** (the "[Merchant Legal Name]" in §2.1 consent text), not sub-processors. Push is the **platform/vendor**. The acknowledgement referenced in §9 item 6 captures the merchant's agreement that (a) Push will not send SMS on their behalf absent §2.5 opt-in and (b) the merchant will not instruct Push to override consent checks. Whether an additional DPA or sub-processor attachment is needed is a corporate-hygiene row (#5.1 MSA), not a TCPA-specific requirement.
   - **Evidence.** §9 item 6; `docs/legal/corporate-hygiene-checklist.md` §5.1. **Gap.** Merchant-acknowledgement template text not yet drafted; add to PD-L4 scope or a new sub-item.
10. **"What's the process if a consumer's phone is passed to a non-opted-in family member?"**
    - **Answer.** Reply STOP propagates identically regardless of which human holds the phone; §3 opt-out is keyed to `(phone_hash, merchant_id)`. If the new holder replies STOP, opt-out is recorded. If they do not reply and complain downstream, the record of prior explicit consent from the previously-associated consumer is our defense under existing TCPA caselaw — `consent_log.ip_address_hash` + `consent_log.user_agent` support the authenticity-of-consent evidence.
    - **Evidence.** §3.3 scope; §2.4 schema. **Gap.** Practical — the distinction between "reassigned" and "family-passed" may be counsel-relevant per Appendix D #4 analysis.
11. **"How do you reconcile opt-out across merchants (one brand vs platform-wide)?"**
    - **Answer.** Per-merchant by default. STOPALL opts out across all merchants the consumer has ever consented to via Push (§3.3 exception). Default scope mirrors CTIA treatment of separate senders; STOPALL provides a platform-level escape hatch. Appendix D #6 flags this for counsel confirmation.
    - **Evidence.** §3.3; Appendix D #6. **Gap.** STOPALL confirmation-SMS language under counsel-review; verify it enumerates scope clearly.
12. **"What's your A/B testing policy for consent text?"**
    - **Answer.** Both Variant A and Variant B must individually pass counsel review before either is deployed. A/B test split must be tied to a single `disclosure_version` row in `disclosure_versions`, with Variant B being a separate row if it differs materially. Impressions for each variant are tied to `consent_log.disclosure_version` — there is no orphan A/B event. Counsel sign-off is required on each variant before that variant is deployed; we do not A/B-test language that is un-reviewed.
    - **Evidence.** §2.1; §12 rotation triggers; Appendix D #1. **Gap.** Counsel may prefer we ship only Variant A for v1 and defer Variant B. If so, §2.1 retires Variant B pending a later revision.
13. **"What notice do you give consumers when the pepper used for their `phone_hash` is rotated?"**
    - **Answer.** None — the rotation is a server-side hashing change, not a change to the consumer's data or consent. No user-facing surface displays or references the pepper. Appendix D #13 flags this for counsel confirmation; if counsel disagrees, a notice template is required in the privacy policy rather than direct SMS (which would itself be a marketing message requiring consent).
    - **Evidence.** §4.6; §12.2; Appendix D #13. **Gap.** Counsel opinion on notice obligation.
14. **"If a consent check times out and a send is blocked (fail-closed), what is our obligation to notify the merchant that their campaign didn't reach this recipient?"**
    - **Answer.** We notify the merchant via the merchant-facing campaign dashboard; blocked-send events are aggregated and exposed as "consent-check-blocked: N recipients" with drilldown available. No PII is exposed. The merchant has visibility and can decide whether to retry via a re-opt-in offer (ephemeral on their next visit) or accept that the audience is off-limits. Appendix D #14 flags this for counsel confirmation.
    - **Evidence.** §5.5; Appendix D #14. **Gap.** Merchant dashboard UI for this event is a P2-3 surface, not yet built.

---

### §15. Cross-Spec Dependencies

This spec does not stand alone. Below: where a change in another spec forces a revision here (and vice-versa). Any surfaced contradiction is a same-day ping to Jiaming.
- **P2-1 consumer-facing-v1 — direct dependency.** SMS opt-in flow spec (§2.5) is consumed by consumer-facing §1 user journey step 5. Any change to consent copy, checkbox placement, or double-opt-in narrative forces a P2-1 re-review; `PD-C1` binds the byte-for-byte review across both specs. Consumer-facing table `loyalty_cards.sms_opt_in_ip` + `phone_hash` align with `consent_log.ip_address_hash` + `phone_hash` — a schema change in either spec is a breaking change to the other.
- **P2-4 DisclosureBot-v0 — parallel, no direct dependency.** DisclosureBot handles FTC 16 CFR §255 creator-disclosure monitoring, a separate statutory regime. No data or flow overlap in v1. Shared only in counsel budget: both require specialist review under the same counsel-engagement track.
- **P2-5 legal-budget-v1 — cross-reference item #12.** TCPA counsel opinion ($500–1,500) + A2P 10DLC registration ($4 one-time brand + $1.50/campaign/month) appear as line items in legal-budget-v1 §12. Budget changes (e.g., counsel firm swap) do not revise this spec but do update the engagement-target row in §8 working group.
- **Infrastructure — Supabase schema migration.** `consent_log`, `opt_out_log`, `disclosure_versions`, `pepper_rotations`, `governance_log`, `outbound_message_attempts` sit alongside existing `users`, `loyalty_cards`, `merchants`, `campaigns` tables. Migration `2026-05-04-sms-compliance-v1.sql` must land cleanly; a schema conflict with consumer-facing-v1's `consumer_sms_optout` table name is one known conflict — the canonical name is `opt_out_log`, and the consumer-facing spec should reference the canonical name in any subsequent revision. Flag: audit-register row #20 (Supabase DPA) must close before production writes, per `lib/db/index.ts` service-role-key boot guard.
- **Contradictions to watch.** (1) **A2P 10DLC rejection (~5–10% first-submission per Twilio).** If rejected, v5.3 Week 7 loyalty-card launch slips by re-registration (2–4 wk); mitigation — submit no later than v5.3 Week 1 (PD-T1 target 2026-05-11, 7-wk buffer). (2) **Counsel turnaround.** 2–4 hr billable + 5–10 calendar days redline; if > 2 wk slip, launch slips; mitigation — PD-L1 v5.3 Week 1, ≥ 6 wk review window. (3) **State-law change between scan and launch.** Unmitigable external risk; PD-L5 re-scan within 14 days of launch. (4) **Twilio platform-term change (TCR throughput, new requirements).** Treated as `disclosure_version` rotation (§12.1 #3); material change pauses launch for re-registration. (5) **Consumer-facing-v1 `loyalty_cards.sms_opt_in_ip` storing raw IP** conflicts with §2.4 here (`ip_address_hash` only). Resolution: consumer-facing-v1 changes on next revision; interim, API hashes IP before write, so no raw-IP lands in DB.

---

*This spec is counsel-preparation work product, not legal advice. Every normative claim (citation, interpretation, implementation guidance) requires counsel confirmation before external use. Push has not engaged TCPA counsel as of 2026-04-20. Firm suggestions are placeholders. Version: v1 DRAFT, 2026-04-20.*
