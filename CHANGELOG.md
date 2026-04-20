# Changelog

All notable changes to the Push platform (code, strategy docs, creator/merchant economics, and brand system) are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) loosely; versions track the internal "v5.x" migration cadence used across `.claude/skills/` and `docs/v5_2_status/`, not semver for `package.json`.

---

## [v5.2] — 2026-04-20

P1 wave landed on branch `creator-workspace-v1`. P0 (FTC compliance, landing-page truthing, Week 0 artifact templates) shipped 2026-04-19 and is included in this version. See [`docs/v5_2_status/P1_rollup.md`](./docs/v5_2_status/P1_rollup.md) for the investor/board summary.

### Added
- FTC 16 CFR § 255 disclosure on landing page (`app/page.tsx` + `app/(marketing)/page.tsx`).
- Two-Segment Creator Economics (T1–T3 per-customer; T4–T6 retainer + equity).
- SLR as North Star metric (Software Leverage Ratio, Active Campaigns / Ops FTE).
- ML Advisor outreach tracker + InMail drafts (`docs/hiring/ml_advisor_outreach_tracker.md`, `docs/hiring/inmail_drafts.md`).
- T1 Clay minimum-earning guarantee ($15 if 1 campaign completed / 0 verified customers; merchant fail-to-deliver protection; cap 3/creator/year).
- Week 0 unblock artifact templates (kickoff agenda, pilot outreach log, creator RSA skeleton).
- v5.2 Killer Lines + "Push is NOT" positioning block (5 killer lines, 7 rejected categories, 4-matrix messaging architecture).
- Path A tier color system (tiers source from 6-color brand palette; material names retained via icon + texture).
- Operations Metrics subsection in `push-metrics` §6.x (ConversionOracle precision/recall, manual intervention rate, DisclosureBot FP rate, Ops FTE utilization).
- Authoritative SQL reference for computing monthly SLR (`push-metrics` §6.x.1).
- Playbook for "SLR below target" with gap → lever → action mapping (`push-metrics` §6.x.2).
- Competitor SLR benchmarks (estimated, internal only — `push-metrics` §6.x.3).

### Changed
- Merchant pricing: v4.1 subscription tiers ($19.99 / $69 / $199) → v5.2 Pilot ($0) / Beachhead ($500/mo floor + $15–85/verified customer) / Scale (custom).
- Creator compensation: v4.1 per-campaign + milestone bonus → v5.2 per-verified-customer (T1–T3) + retainer + equity (T4–T6).
- Push Score weights: 50/30/20 (3-dimension) → 30/20/25/15/10 (5-dimension: Completion / Reliability / Content Quality / Merchant Satisfaction / Engagement).
- Push Score "Completion" definition: campaign completion rate → verified customer delivery rate.
- Tier colors: 6 independent hexes → brand-palette aliases (Steel Blue / Champagne / Steel Blue / Flag Red / Molten Lava / Deep Space Blue).
- Landing page: removed 4 pre-pilot fictional testimonials (FTC 16 CFR 255.1(a) compliance).
- North Star metric: v4.x verified repeat customer value → v5.2 Software Leverage Ratio (SLR); repeat customer value retained as secondary health metric.
- Creator-tier graduation rules: v4.1 transaction-count milestones → v5.2 verified-customer thresholds + Push Score thresholds + invite-only above T3.

### Deprecated
- v4.1 subscription tiers (Starter / Growth / Pro) — reference-only in `push-pricing` appendix.
- v4.1 per-campaign creator rates + campaign difficulty multiplier (1.0x / 1.3x / 1.6x) — reference-only in `push-creator` §7.
- v4.1 milestone bonus structure (30/40/60/80 transaction thresholds) — reference-only.
- v4.1 take-rate model on creator payouts — replaced by Retention Add-on (Layer 3 of v5.2).
- "Per campaign" and "milestone bonus" pricing language.
- 15% take rate on creator payouts.
- Term "AI-native agency" (legally conflated with services firms).
- Term "take rate" (replaced by "per-customer fee" or "retention add-on").
- Term "lead" / "visit" in external comms (replaced by "verified customer").
- v4.1 Merchant↔Creator tier linkage (Starter/Growth/Pro access to specific creator tiers).

### Fixed
- Landing page stat "$19.99" was misaligned with outcome-based pricing philosophy (shipped 2026-04-19 with P0-3).
- Creator pure-percent commission previously yielded negligible value on $5–8 F&B transactions ($0.15–0.50/event) — replaced with direct per-verified-customer payout.
- v4.1 subscription cycle churned merchants at Month 3 when campaign results lagged invoice cycle — replaced with outcome-warranty Beachhead pricing (Month 1 prorated if <5 verified customers delivered).

### Compliance
- FTC 16 CFR § 255 disclosure shipped on landing; preview deployed to Vercel (branch `creator-workspace-v1` → preview env only; production untouched).
- All illustrative demo numbers marked `data-mock="true"` with asterisk footnote.
- NY LL-32-2022 pay-transparency language included in every ML Advisor outreach archetype ("0.25–0.5% equity, 2-year vest, 6-month cliff, no cash").
- EEOC 29 CFR §1602 retention: 12 months for non-hire ML Advisor outreach; 7 years for hires.
- Creator-facing T1 minimum-guarantee disclosure drafted verbatim for Creator Terms §X (see `push-creator` §2).
- GAAP treatment documented for T1 reserve (COGS allocation, not pre-funded balance-sheet reserve; classified as "Cost of Revenue — Creator Payouts").

### Security
- No security fixes in this version. `middleware.ts` INTERNAL_API_SECRET gate unchanged. `lib/db/index.ts` production hard-throw on missing `SUPABASE_SERVICE_ROLE_KEY` unchanged.

### Migration notes
- 18 downstream files (dashboards, profile pages) still carry v4.1 tier hex strings but inherit correct colors via `globals.css` cascade; full sweep scheduled P0-6.
- Financial model `.xlsx` not updated (file not present locally); `push-pricing/SKILL.md` + `push-creator/SKILL.md` markdown are the source of truth until xlsx sync (candidate P2 item).
- Vercel Preview env synced to `creator-workspace-v1` branch only; production env untouched.
- `numeric_reconciliation.md` added under `docs/v5_2_status/` as the single source of truth for all quoted v5.2 numbers; fix the quotation, not the reconciliation file, if drift is found.
- `main` branch has not yet received the v5.2 merge; the v5.2 migration lives on `creator-workspace-v1` until P1 Day 14 readout unblocks the merge.

### Known limitations
- Pre-pilot: no customer revenue has moved. All unit economics figures are plan, not actuals. "Traction" language remains disallowed in external comms until 2026-Q2-W4 pilot readout (per `push-strategy` Matrix 1).
- ML Advisor Day 14 ship criterion is "≥1 real conversation"; bar for a signed advisor agreement is not yet set.
- Competitor SLR benchmarks are estimated; flagged "estimated" in all external comms until sourced to disclosed financials.

---

## [v5.2-P2] — 2026-04-20 (same-day P2 spec wave)

P2 wave shipped 6 spec deliverables across 4 sub-waves on `creator-workspace-v1`. See [`docs/v5_2_status/P2_rollup.md`](./docs/v5_2_status/P2_rollup.md) for the investor/board summary and [`docs/spec/audits/00-integration-audit.md`](./docs/spec/audits/00-integration-audit.md) for cross-spec analysis.

### Added (specs)
- `docs/spec/consumer-facing-v1.md` (690 lines) — P2-1 consumer QR scan + loyalty + Apple/Google Wallet flow.
- `docs/spec/sms-compliance-v1.md` (900 lines) — P2-2 TCPA/CCPA compliance; 47 USC §227, CCPA §§1798.100-1798.199.100, FL §501.059, OK 15 Stat. §775B.1, WA RCW 19.190, CT §42-288a, MD §14-3301; double-opt-in; consent_log + opt_out_log + disclosure_versions DDL.
- `docs/spec/expansion-math-v1.md` (729 lines) — P2-3 expansion-pace correction (M12 25 → M48 1,000 merchants); SLR-vs-agency math reconciliation; 40% Pilot→Paid base case.
- `docs/spec/disclosurebot-v0.md` (851 lines) — P2-4 rule-based FTC §255 enforcement; disclosure_audit_log + creator_consent_events DDL; 9-category strict-mode list.
- `docs/spec/legal-budget-v1.md` (861 lines) — P2-5 phased counsel + insurance + tax envelope $57K-$120K Y1 (mid $88K).
- `docs/spec/conversion-assumption-v1.md` (609 lines) — P2-6 4-scenario stress-test on Pilot→Paid; Model B all-in CAC; W4/W8/W12 recalibration calendar.
- `docs/spec/audits/00-integration-audit.md` (198 lines) + 6 per-spec audits (~200-440 lines each) — Wave 3 fresh-eyes review identifying 5 cross-spec contradictions.
- `docs/v5_2_status/P2_rollup.md` — investor/board summary of P2 wave.

### Changed (numeric_reconciliation extension)
- 34 new rows added (134-167) covering P2-derived metrics: M12-M48 MRR forecasts, Pilot→Paid scenarios, LTV/CAC Model B all-in, legal envelope, counsel timelines, pepper rotation cadence, A2P 10DLC window, FTC/TCPA opinion windows.
- §P2 Cross-Spec Reconciliation Notes added documenting Wave 3 fix-round outcomes.

### Fixed (Wave 3 fix-round, commit 426b71d)
- **Numeric drift**: M12 MRR $25K (assumed 100% Pilot→Paid) → $16K base (40%) + $25K upside (60%).
- **TCPA cite errors** (4): §227(b)(3) "trebled" → discretionary enhancement per §227(b)(3)(C); §227(e) preemption → §227(f) savings clause; 15 Okla. Stat. §775C.1 → §775B.1; 2015 Omnibus reassigned-number safe harbor → vacated by *ACA International v. FCC* (D.C. Cir. 2018), current regime is RND per 47 CFR §64.1200(a)(1)(iv).
- **LTV/CAC arithmetic**: Model A values (15.1x/10.4x/6.5x/3.9x) withdrawn (denominator category error); Model B all-in adopted exclusively (4.5x/3.3x/2.3x/1.4x).
- **Legal budget underbudget by ~40%**: corrected #13 FTC opinion ($500-1500 → $1,800-4,800), #16 E&O ($3K-8K → $6K-12K), #17 D&O ($4K-10K → $6K-15K); 8 missing line items added (tax, Form D, blue-sky, subprocessor DPAs, Stripe Connect MSB, first-pilot contract negotiation, IP FTO, NYC DCWP reserve, contingency).
- **Phone-pepper storage**: env var path deprecated in P2-1; KMS adopted as authoritative across P2-1 + P2-2 (would have caused silent join-key break on first rotation).
- **DisclosureBot HMAC inadequacy**: added `creator_consent_events` table DDL — HMAC stays as integrity check on the row, the row reconstructs the click event for FTC inquiry.
- **DisclosureBot strict-mode category list**: expanded from 3 (health/financial/children) to 9 (added alcohol, cannabis/CBD, weight-loss/supplements, AI-generated content, gambling, telehealth) per FTC 2024 priorities.
- **Statistical rigor**: P2-6 r-threshold raised 0.5 → 0.78 for adoption (Fisher z 95% CI clears zero only at r ≥ 0.78 with N=10).

### Compliance
- 7 audit reports + 1 integration audit committed under `docs/spec/audits/` for permanent record.
- Phone_hash cross-spec invariant documented (single SHA-256 with year-versioned KMS pepper across `consumer_visits`, `loyalty_cards`, `consent_log`).
- Counsel-engagement plan + corporate hygiene checklist + founders CIIAA template (from earlier Wave 3) referenced throughout P2 specs.

### Open decisions (require founder sign-off before code starts)
- P2-4 v0 → v0.5 de-scope (manual creator-paste workflow; defer IG/TikTok API to v0.6/Beachhead) — saves Z bandwidth; default to v0.5 unless founder declines per disclosurebot §16.5.
- Counsel firm selection (Cooley/Gunderson cold-RFQ requires warm intro; fractional-GC fallback if no warm intro by Day 14).

### Known limitations
- 6 P2 specs are spec-only; NO code shipped this wave.
- All v5.3 W5+ launch dates assume external timelines (counsel + Apple Developer + A2P 10DLC) start v5.3 W1.
- N=10 Pilot cohort statistically thin for the leading-indicator hypothesis; cohort-2 (Beachhead first wave, target N≥15) provides joint evidence.
- Day-15 readiness score per integration audit: 30% (most external timelines have not started).

---

*P3 wave will be created at Pilot W12 readout (~2026-07-27) when assumed metrics get replaced with actuals.*
