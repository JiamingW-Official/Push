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

*Next entry will be created at P1 Day 14 readout (2026-05-04) or P2 scoping kickoff, whichever comes first.*
