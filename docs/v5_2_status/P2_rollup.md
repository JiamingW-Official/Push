# Push v5.2 — P2 Wave Rollup

**Status date:** 2026-04-20
**Owner:** Jiaming (founder)
**Audience:** founder, board (when formed), F&F investors, future-Series-Seed reviewers
**Source artefacts:**
- 6 P2 specs in [`docs/spec/`](../spec/)
- 7 audits in [`docs/spec/audits/`](../spec/audits/)
- Wave 1 commit `321904e`, Wave 2 `be72389`, Wave 3 audits `a73dc82`, Wave 3 fixes `426b71d`

---

## §Executive Summary

P2 wave produced 6 spec deliverables covering consumer-facing QR + loyalty (P2-1), TCPA/CCPA SMS compliance (P2-2), expansion math reconciliation (P2-3), DisclosureBot v0 FTC enforcement (P2-4), legal budget + counsel sequencing (P2-5), and Pilot→Paid conversion stress-test (P2-6).

Each spec went through 3 internal rounds: **Wave 1 draft → Wave 2 deepen (RACI / runbook / measurement / FAQ / cross-refs) → Wave 3 fresh-eyes audit + fix-round**. Total ~5,000 lines of spec content + ~1,970 lines of audit findings + 6 P0 reconciliation patches. **20 agent runs** were attempted across 4 waves; ~5 hit API capacity overload mid-flight but most left their files written before timing out (recovered without retry).

The wave is **NOT a green light to start coding any P2 item**. It is a green light to begin the legal-engagement and procurement gates that block code start. Specifically:

1. **Founder must engage legal counsel within 14 days** (P2-5 Phase A) to unblock everything else
2. **Apple Developer + Google Pay onboarding must start v5.3 W1**, not W5 (4-10 day approval each per P2-1 audit)
3. **Twilio A2P 10DLC brand+campaign registration must start v5.3 W1** (2-4 weeks elapsed per P2-2)
4. **ML Advisor signing target Day 14 (P1-2 W2 ship)** is the gate for P2-4 architectural work
5. **Day-15 readiness score** per integration audit: **30%** (most external timelines have not started)

The integration audit (`docs/spec/audits/00-integration-audit.md`) recommends **de-scoping P2-4 v0 to v0.5** (manual creator-paste workflow only) to absorb Z's bandwidth conflict between P2-1 and P2-4. Decision requires founder sign-off; default = v0.5 unless founder declines.

---

## §P2-1 Consumer-Facing QR + Loyalty (`docs/spec/consumer-facing-v1.md`)

**Status:** v1 spec finalized; 690 lines, 36 sections. Ready for code-start gating.

**Owner:** Z (engineering).

**Code-start trigger (hard gate):** 2nd paying Beachhead merchant has delivered ≥10 verified customers (anticipated v5.3 W6 at earliest, ~2026-07-06).

**Launch target:** v5.3 W10 (~2026-07-27) with first Apple Wallet integration; v5.3 W11+ Google Wallet.

**Critical outputs from Wave 2/3:**
- 13-node mermaid state machine; 13 edge cases; 12 risk register rows
- WCAG 2.1 AA conformance plan; performance budget (TTI/LCP)
- Full DDL for `consumer_visits`, `loyalty_cards`, `wallet_pass_meta`
- Apple Developer + Google Pay onboarding timeline + cert management
- §10 RACI; §12 Production Runbook (T-7 → T+7 day-by-day); §13 FAQ (12 Qs)

**Wave 3 audit findings closed:**
- F1 Pepper storage divergence with P2-2 (env var → KMS) — fixed in §4 PII-hashing note
- F2 FTC disclosure copy passive-voice — flagged for outside counsel review (Wave 5)
- F3 Unsigned campaign URL — open; needs HMAC + creator binding before launch (Wave 5)

**Open items / blockers for code start:**
- ML Advisor signed (P1-2)
- 2nd Beachhead merchant active (post-Pilot W12)
- Apple Developer account approved (start W1, not W5)
- P2-2 SMS opt-in flow live (gates redeem step)
- P2-4 DisclosureBot live (gates creator-attribution surface)

---

## §P2-2 SMS Compliance (`docs/spec/sms-compliance-v1.md`)

**Status:** v1 spec finalized; 900 lines, 53 sections. Counsel-engagement-ready.

**Owner:** Jiaming (founder) → outside TCPA counsel (TBD; target Davis & Gilbert / Kelley Drye / Frankfurt Kurnit).

**Code-start trigger (hard gate):** TCPA counsel written opinion received + A2P 10DLC brand+campaign registered with Twilio + consent_log/opt_out_log/disclosure_versions tables in production.

**Launch target:** v5.3 W7 (first loyalty card SMS); A2P 10DLC registration must start v5.3 W1 (2-4 weeks elapsed).

**Critical outputs from Wave 2/3:**
- Cited statutes: 47 USC §227(b)(3) discretionary enhancement (Wave 3 corrected from "trebled"), §227(f) savings clause (Wave 3 corrected from §227(e)), CCPA §§1798.100-1798.199.100, FL §501.059, OK 15 Stat. §775B.1 (Wave 3 corrected from §775C.1), WA RCW 19.190, CT Conn. Gen. Stat. §42-288a, MD §14-3301
- Reassigned-number doctrine corrected: 2015 Omnibus safe harbor was vacated by *ACA International v. FCC* (D.C. Cir. 2018); current regime is RND per 47 CFR §64.1200(a)(1)(iv) (Wave 3 fix)
- Double-opt-in flow specified; consent_log + opt_out_log + disclosure_versions DDL
- §10 RACI; §11 Incident Response Runbook (6 scenarios); §13 Pre-Deploy Checklist (30 items); §14 Counsel FAQ (14 Qs)

**Wave 3 audit findings closed:**
- 4 statutory cite errors corrected (above)
- Pepper-rotation contradiction internal to spec (§4.6 vs §12.2) — annual on first Monday of April; documented in cross-spec invariant with P2-1 §4

**Open items / blockers for code start:**
- TCPA opinion letter (3-5 weeks counsel timeline per Wave 3 audit; engage by 2026-05-04)
- A2P 10DLC brand registration approved by carriers (5-15 business days; ~5-10% rejection rate first submission; trigger early)
- D&O insurance bound (per audit 02 §11.7 platform gap)
- 24×7 ops on-call rotation (per audit 02 §11.7 platform gap; alternative: response-hours-only SLA + outbound-pause policy)

---

## §P2-3 Expansion Math + SLR Reconciliation (`docs/spec/expansion-math-v1.md`)

**Status:** v1 spec finalized; 729 lines. Fixes the v5.1 contradiction (SLR ≥ 25 AND Top-5 metro by M18 = 480 ops FTE = agency).

**Owner:** Jiaming (founder).

**Trigger:** any external pitch deck containing M18+ projections MUST cite this spec, NOT v5.1.

**Critical outputs:**
- Campaigns/mo/merchant baseline corrected: 4 (v5.1 implicit) → 1.0 (v5.2 base) with 0.5/1.5 sensitivity bounds
- Corrected expansion pace (M12 → M48): Williamsburg 25 → NYC-dense 200 → 2 metros 600 → 2-3 metros 1,000
- Revenue forecast (40% Pilot→Paid base): M12 $16K MRR / M24 $288K / M36 $1.06M / M48 $1.84M
- Series Seed pitch narrative: $16K MRR / $192K ARR by M12; Series A pitch: $10M ARR threshold cleared by M36 (40% base)
- §10 Bull/Base/Bear scenarios (probability-weighted 30/50/20)
- §11 Sensitivity heat maps (2D)
- §12 Expansion Readiness Gates (5 KPI thresholds per phase)

**Wave 3 audit findings closed:**
- M12 MRR drift ($25K spec vs $19K-derived vs $2,620 SoT per-merchant) reconciled in §5.1 with explicit per-merchant ramp + 40%/60% scenario columns
- Per-merchant MRR ramp now documented: $1,000 immature mix M12 → $2,200-$2,300 mature Coffee+ M24+

**Downstream skill files needing updates** (per spec §7 + §9; not yet applied):
- `.claude/skills/push-gtm/SKILL.md` (remove "Top-5 metro by M18")
- `.claude/skills/push-metrics/SKILL.md` §1.1 + §1.4 + §6.4
- `.claude/skills/push-pricing/SKILL.md` §5

---

## §P2-4 DisclosureBot v0 (`docs/spec/disclosurebot-v0.md`)

**Status:** v0 spec finalized; 851 lines. Conditional FTC opinion-letter readiness (counsel will redline).

**Owner:** Z (eng) + ML Advisor (post-onboard, joint).

**Code-start trigger (hard gate):** ML Advisor onboarded (v5.3 W3) + outside FTC counsel opinion letter received.

**Launch target:** v5.3 W10 (~2026-07-27); IF de-scoped to v0.5 (manual paste only), 4-6 weeks Z time saved.

**Critical outputs:**
- v0 rule engine: pattern-match on first 100 chars / first 4 hashtags; required tokens #ad, #sponsored, #paidpartnership, "paid partnership", "in partnership with"; auto-append `(#ad via @push_local)` if missing (with creator consent)
- Full DDL for `disclosure_audit_log` + (Wave 3 added) `creator_consent_events`
- §11 RACI; §12 Counsel Defense Brief (10 design decisions); §13 Creator Onboarding + 15-Q quiz; §14 Audit Program
- Strict-mode category list (Wave 3 expanded): health, financial, children-targeted, alcohol, cannabis/CBD/hemp, weight-loss/supplements, AI-generated content, gambling, telehealth (was 3 categories, now 9)

**Wave 3 audit findings closed:**
- §3.3 HMAC architecture inadequate for FTC consent evidence — added `creator_consent_events` table DDL in §16.1
- Strict-mode category list under-covered FTC 2024 priorities — expanded
- Quiz Q10/Q11/Q14 answer-key drift — corrections in §16.3 (version-bump to v0.2)
- Counsel timeline corrected 1-2wk → 6-8wk

**Open decisions:**
- **De-scope to v0.5 (manual paste only)** — pending founder sign-off per §16.5

**Open items / blockers for code start:**
- ML Advisor signed (P1-2)
- FTC counsel opinion letter (6-8 weeks)
- Instagram Graph + TikTok for Business API access (Business Center verification 2-3 weeks; if v0.5 de-scope adopted, defer)

---

## §P2-5 Legal Budget (`docs/spec/legal-budget-v1.md`)

**Status:** v1 spec finalized; 861 lines. Wave 3 audit found this UNDERBUDGETED by ~40%.

**Owner:** Jiaming (founder) until first counsel engaged.

**Trigger:** F&F close (~Week 8). Phase A starts immediately Day 1 (now).

**Critical outputs:**
- 18 deliverables (post-Wave 3: 26 line items including 8 missing items added)
- 4 phases: A pre-sprint-end ($800-1500), B pre-pilot ($1400-3800), C pre-scale ($2400-6500), D pre-Series-A ($40K-100K combined insurance + SOC 2)
- §8 Counsel-RFQ template (ready to send Day 0)
- §9 Negotiation playbook
- §10 Deep-dives on top-3 risk items (Privacy Policy, Creator RSA, E&O Insurance)
- §11 Budget-vs-Risk matrix
- §12 Investor FAQ (11 Qs)

**Wave 3 audit findings closed (§14):**
- Cost corrections: #13 FTC opinion $500-1500 → $1,800-4,800; #16 E&O $3K-8K → $6K-12K; #17 D&O $4K-10K → $6K-15K
- 8 missing line items added: tax counsel, Form D, blue-sky filings, subprocessor DPAs, Stripe Connect MSB analysis, first-pilot contract negotiation, IP FTO search, NYC DCWP inquiry reserve, 20% contingency
- Year-1 envelope reconciled: $57K-$120K (mid $88K), not $25K-$40K
- First 90-day spend: $10K-$15K
- Cooley/Gunderson cold-RFQ posture: warm intro required at scale

**Open items:**
- Founder Day-1 action: send RFQ to 3 firms (template in §8)
- Backup plan if no warm intro: fractional-GC services (Rally Legal, Outlaw, PilotLegal)

---

## §P2-6 Conversion Assumption Stress-Test (`docs/spec/conversion-assumption-v1.md`)

**Status:** v1 spec finalized; 609 lines. Wave 3 audit corrected math + statistical posture.

**Owner:** Prum (data) + Jiaming (modeling + investor comms).

**Trigger:** Pilot Week 4 EOW first interim signal; Pilot Week 12 EOW final cohort rate.

**Critical outputs:**
- 4 stress-test scenarios × Model B all-in CAC: 60% → 4.5x, 40% → 3.3x, 25% → 2.3x, 15% → 1.4x (breaches 3x VC floor)
- Pilot Week 4 / Week 8 / Week 12 recalibration calendar with named investor-facing artifacts
- §8 RACI; §9 Data Schema (`pilot_merchants` + exit_interview DDL); §10 Investor Output Artifacts (W4/W8/W12 templates); §11 Leading-Indicator Research Plan; §12 FAQ (10 Qs)
- Leading-indicator hypothesis: Week-2 verified-customer count → conversion (r ≥ 0.78 for adoption per Wave 3 fix)

**Wave 3 audit findings closed (§14):**
- Model A LTV/CAC arithmetic withdrawn (15.1x/10.4x/6.5x/3.9x do NOT derive from CAC=$420 fixed); Model B exclusive
- r-threshold raised 0.5 → 0.78 (Fisher z 95% CI clears zero only at r ≥ 0.78 with N=10)
- §7 framing line corrected (Week 8 actuals first hard signal, not Week 4 intent)

**Open items:**
- Pilot LOI must spell out Beachhead conversion path (no surprise pricing at W4)
- `pilot_merchants` + `pilot_merchant_exit_interview` table migrations needed v5.3 W1
- N=10 cohort statistically thin; cohort-2 (Beachhead first wave) provides joint evidence

---

## §Cross-Spec Numeric Reconciliation Summary

Per integration audit 00 + Wave 3 fix-round, the following numbers are **authoritative across all P2 specs**:

| Metric | Authoritative Value | Source |
|---|---|---|
| M12 MRR base case | $16K (40% Pilot→Paid) | numeric_reconciliation row 134 |
| M12 MRR upside | $25K (60% Pilot→Paid) | numeric_reconciliation row 135 |
| Pilot→Paid baseline | 40% | numeric_reconciliation row 141 |
| LTV/CAC framework | Model B all-in | numeric_reconciliation rows 144-147 |
| LTV/CAC (40% base) | 3.3× | numeric_reconciliation row 145 |
| Phone-pepper storage | KMS | P2-1 §4 + P2-2 §4.6 (Wave 3 reconciled) |
| Pepper rotation cadence | first Monday of April | numeric_reconciliation row 165 |
| Year-1 legal envelope | $57K-$120K (mid $88K) | numeric_reconciliation row 153/154 |
| TCPA opinion timeline | 3-5 weeks | numeric_reconciliation row 156 |
| FTC opinion timeline | 6-8 weeks | numeric_reconciliation row 157 |
| DisclosureBot launch gate | 2026-06-15 | numeric_reconciliation row 160 |
| Pilot W12 final-data window | week of 2026-07-27 | numeric_reconciliation row 167 |

---

## §Open Risks + Escalation Triggers (post-P2)

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| 1 | Counsel timeline cascade slips v5.3 W10 launch | M | H | Engage all 4 counsel types in parallel from W2; warm-intro first | Jiaming |
| 2 | A2P 10DLC carrier rejection (5-10%) | L | M | Pre-submit W1; rework brand registration if rejected | Jiaming + Z |
| 3 | Apple Developer / Google Pay onboarding slip | M | M | Start W1 not W5; treat 10-day SLA as worst case | Z |
| 4 | Pilot→Paid actual lands <25% (Pilot W12) | L-M | H | Per P2-6 §14: alternative pricing model rewrite; F&F call within 7 days | Jiaming |
| 5 | Z bandwidth conflict P2-1 + P2-4 parallel | H | M | De-scope P2-4 v0 → v0.5; founder approves | Jiaming + Z |
| 6 | TCPA violation in production SMS | L | VH | Outbound gate fail-closed; opt-out 10s SLA; counsel emergency retainer | Z + Jiaming |
| 7 | FTC inquiry on DisclosureBot enforcement | L | H | §16.1 creator_consent_events table is evidence record; counsel SLA 24h | Jiaming + counsel |
| 8 | NYC DCWP gig-platform inquiry (15-25% Y1) | M | H | $5K-$25K reserve in legal budget §14.2; AEDT compliance per push-creator §5.5 | Jiaming + counsel |
| 9 | Founders IP CIIAA not signed before first non-founder grant | M | H | Phase A Day-14 includes CIIAA sign per docs/legal/corporate-hygiene-checklist §3 | Jiaming + each founder |
| 10 | Insurance market hardening (D&O/E&O/cyber 2025) | M | M | Quote-gathering in Phase C; budget reserved $15K-32K | Jiaming + broker |

---

## §What Next (P3 wave, post-Pilot W12)

- **P3-1**: empirical recalibration of unit economics from Pilot data (replaces all assumed numbers)
- **P3-2**: Series Seed deck + data-room build (post-Pilot W12 + 2 weeks)
- **P3-3**: Beachhead expansion ops playbook (NYC neighborhoods 2-5)
- **P3-4**: ML Advisor first quarterly review (ConversionOracle precision/recall actuals)
- **P3-5**: Annual NYC LL-144 AEDT bias audit kick-off (per push-creator §5.5)

---

## §Commit Log (today's P2 wave)

```
426b71d  fix(spec): P2 Wave 3 fix-round — apply 6 P0 reconciliation items from integration audit
a73dc82  docs(spec): P2 Wave 3 — 6 fresh-eyes audits + cross-spec integration audit
be72389  feat(spec): P2 Wave 2 deepen — RACI, runbook, measurement, FAQ, cross-refs (5x each)
321904e  feat(spec): P2 Wave 1 — 6 spec drafts (consumer-facing, SMS, expansion math, DisclosureBot, legal budget, conversion stress-test)
```

Plus this rollup commit (Wave 4 consolidation) — see CHANGELOG.md.

---

*This rollup is a snapshot at end of Wave 3 fix-round. The 6 P2 specs themselves are the authoritative deliverables; this document is the navigation aid + integration check. Re-read after each waveline (Wave 4 done, P3 start, Pilot W4 EOW, etc.) to recalibrate.*
