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

*This spec is counsel-preparation work product, not legal advice. Every normative claim (citation, interpretation, implementation guidance) requires counsel confirmation before external use. Push has not engaged TCPA counsel as of 2026-04-20. Firm suggestions are placeholders. Version: v1 DRAFT, 2026-04-20.*
