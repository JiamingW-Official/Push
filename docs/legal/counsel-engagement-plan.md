# Counsel Engagement Plan — Push, Inc. (v5.2)

**Scope:** seed stage through Series Seed close.
**Last updated:** 2026-04-20
**Owner:** Jiaming (founder) until GC engaged.

---

## §Purpose

Push operates in six counsel-sensitive domains simultaneously: corporate (Delaware C-corp), employment (W2 ops + 1099 creators), securities (founder stock + advisor RSA + future creator RSA), IP (ConversionOracle™, Vertical AI for Local Commerce, ML training data), marketing (FTC 16 CFR § 255, truth-in-advertising), and money movement (Stripe Connect across creator/merchant). The P1 wave (commits fa7f9a8 → 87e1fb5) committed strategy without engaging any counsel; every external communication carries elevated risk until the items below close. This plan sequences engagements to minimize cost while unblocking the fastest-clock dependencies first.

Pulls priority items from `docs/v5_2_status/audits/03-legal-compliance-register.md` (34 rows: P0×6 / P1×19 / P2×9).

---

## §Counsel Types Needed

### 1. General Corporate (Delaware / New York)

- **Purpose.** Formation hygiene, founders' agreement, board minutes, cap table management, restricted stock purchase agreements, 83(b) filings, state qualifications (NY foreign qual), EIN, franchise tax, annual reports.
- **Deliverables.** Cleanup of existing corporate records; standard founders' package; board consent templates; signatory authority matrix.
- **Estimated hours.** 10–20 hrs initial setup; 2–4 hrs/month ongoing.
- **Estimated $.** $500/hr typical → $5K–10K initial; $1K–2K/month ongoing. Alternative: fractional GC (e.g., Rally, Outlaw, PilotLegal) at $3K–5K/month retainer.
- **Suggested firms.** Gunderson Dettmer (seed-native), Cooley (mid-market), Wilson Sonsini (big); or fractional-GC services above.
- **Engagement trigger.** **Immediate (P0).** Blocker for: founders IP assignment, first advisor grant, seed term sheet.

### 2. Employment & Labor

- **Purpose.** NY Pay Transparency (LL-32-2022), NYC LL-144 (Automated Employment Decision Tools — applies to Push Score; see push-creator §5.5), FLSA, independent-contractor vs employee classification, advisor agreements (YC FAST base), creator contract language, NY Freelance Isn't Free Act compliance, non-compete exclusions per FTC 2024 guidance.
- **Deliverables.** Review of creator agreement template; advisor agreement template sign-off; Push Score AEDT compliance memo (pre-use notice + bias audit plan); 1099 vs W2 classification memo.
- **Estimated hours.** 8–15 hrs initial; ad-hoc on escalation.
- **Estimated $.** $450–600/hr → $4K–9K initial.
- **Suggested firms.** Littler Mendelson, Jackson Lewis, Proskauer employment group; or solo employment counsel in NY/CA.
- **Engagement trigger.** **P0–P1.** Before first ML Advisor signs (week 8); before first NYC creator is onboarded into Push Score tier progression.

### 3. Intellectual Property

- **Purpose.** Trademark filings (ConversionOracle™, Vertical AI for Local Commerce — USPTO classes 35 advertising/business and 42 SaaS); software IP; trade-secret protection for Push Score model; founders + employee CIIAA review; open-source license audit (if downstream models consume OSS training data).
- **Deliverables.** USPTO intent-to-use applications (both marks); CIIAA template review; trade-secret policy; OSS inventory.
- **Estimated hours.** 6–10 hrs for TM filings; 4–8 hrs for CIIAA + policy.
- **Estimated $.** TM filings ~$1,500–2,500 per mark (counsel fees + USPTO $250–350 per class). CIIAA/policy $2K–4K.
- **Suggested firms.** Wolf Greenfield (boutique IP), Kilpatrick Townsend, Fenwick IP; or TM-only vendors like LegalZoom (lowest cost but no counsel advice).
- **Engagement trigger.** **P0.** Before public-launch marketing spend, before any press pitch using the marks.

### 4. Securities

- **Purpose.** Rule 701 compliance analysis for T5/T6 creator equity + advisor equity; 409A valuation timing; Reg D Rule 506(b) vs 506(c) for seed raise; Form D filings; state blue-sky filings; board consents for every equity grant; option pool sizing; ISO vs NSO analysis for future employees.
- **Deliverables.** Rule 701 compliance memo + quarterly refresh mechanism; 409A engagement with a qualified firm (Carta, Capshare, Aranca); Reg D strategy memo; templates for board consent + subscription agreement.
- **Estimated hours.** 15–25 hrs initial; 3–5 hrs per grant; ongoing per-raise.
- **Estimated $.** $650–900/hr for securities specialists → $10K–22K initial. 409A valuation $3K–6K per instance.
- **Suggested firms.** Gunderson Dettmer (strong securities bench), Cooley, Fenwick.
- **Engagement trigger.** **P0.** Before first non-founder equity grant (ML Advisor week ~8) AND before first Series Seed term sheet.

### 5. Tax

- **Purpose.** State nexus (NY + whatever states host merchants/creators at scale); 1099-NEC/1099-K for creator payouts (Stripe Connect handles mechanics but classification and box/threshold rules are ours); sales tax on services (likely nil for Push's model, confirm); QSBS planning (§1202 gross-exclusion — timing + qualification); R&D credit (§41, for ML/ConversionOracle development hours).
- **Deliverables.** State-nexus memo; 1099 classification confirmation; §1202 readiness; R&D credit eligibility note.
- **Estimated hours.** 6–10 hrs initial + annual review.
- **Estimated $.** $400–550/hr → $3K–6K initial.
- **Suggested firms.** WithumSmith+Brown, Armanino, CohnReznick.
- **Engagement trigger.** **P1** (before 50-merchant scale or before first state other than NY).

### 6. Privacy & Data

- **Purpose.** Privacy policy draft; CCPA/CPRA readiness (creators/merchants in CA); GDPR (no EU activities today but mark as clean default); DPA with Supabase + Stripe + any analytics/CRM subprocessor; PII minimization policy; data-retention policy; incident-response plan.
- **Deliverables.** Privacy policy + ToS update; DPA templates signed with each subprocessor; data-retention schedule; breach-notification runbook.
- **Estimated hours.** 10–15 hrs initial + ongoing.
- **Estimated $.** $500–700/hr → $5K–10K initial.
- **Suggested firms.** Cooley privacy group, Orrick, or boutiques like ZwillGen.
- **Engagement trigger.** **P1.** Before any paid ad traffic hits landing + before enterprise/platform integration (e.g., Shopify).

### 7. Marketing & Advertising / FTC

- **Purpose.** Review "verified customer" claim; ConversionOracle precision/recall footnotes; testimonial compliance (once pilot runs, 16 CFR § 255); competitive comparison claims; any "AI" claim per recent FTC guidance on AI washing.
- **Deliverables.** Marketing review SLA (turnaround time for new claims); approved-claims list; comparative-advertising review when competitors are named.
- **Estimated hours.** 4–8 hrs initial + per-campaign review.
- **Estimated $.** $450–600/hr → $2K–5K initial.
- **Suggested firms.** Davis & Gilbert (ad law specialist), Frankfurt Kurnit Klein + Selz, Kelley Drye.
- **Engagement trigger.** **P0.** Before press cycle, before paid-ad ramp, before first investor-facing pitch (some claims may need footnotes).

---

## §Budget Summary

| Counsel Type | Est hrs | Est $ (initial) | Priority | First Trigger |
|---|---|---|---|---|
| General Corporate | 10–20 | $5K–10K | P0 | Immediate |
| Employment | 8–15 | $4K–9K | P0–P1 | Before ML Advisor signs |
| IP / Trademark | 10–18 | $3K–7K + USPTO fees | P0 | Before public marketing |
| Securities | 15–25 | $10K–22K + $3–6K 409A | P0 | Before non-founder equity grant |
| Tax | 6–10 | $3K–6K | P1 | Before 50-merchant scale |
| Privacy & Data | 10–15 | $5K–10K | P1 | Before paid ad traffic |
| Marketing / FTC | 4–8 | $2K–5K | P0 | Before press / investor pitch |
| **Total Year-1 (low/mid/high)** | **63–111** | **$32K / $48K / $69K** | — | — |

Excludes: 409A x2 ($6–12K), SOC 2 audit firm ($40K–80K if engaged in year 1 vs deferred to year 2), D&O insurance ($4K–10K annual), E&O ($3K–8K annual), cyber ($5K–15K annual).

---

## §Engagement Sequence

**Week 1–2 (before anything else):**
1. Engage **general corporate counsel** (or fractional-GC). They gate every other engagement — corporate records must be clean before securities counsel will touch RSA grants.
2. Founders sign CIIAAs (template: `docs/legal/founders-ip-assignment-CIIAA-TEMPLATE.md`).
3. 83(b) elections verified filed within 30 days of founder stock issuance.

**Week 3–4:**
4. Engage **IP counsel** for USPTO intent-to-use filings.
5. Engage **marketing/FTC counsel** for pre-pitch review of investor and landing copy.

**Week 5–8 (before ML Advisor signs):**
6. Engage **employment counsel**. Draft final advisor agreement + Push Score AEDT pre-use notice.
7. Engage **securities counsel**. Rule 701 compliance memo + first 409A.

**Week 9–12 (before Beachhead pilot → Scale transition):**
8. Engage **privacy counsel** for policy + subprocessor DPAs.
9. Engage **tax counsel** for nexus + 1099 review.

---

## §Risk If Deferred

| Counsel Type | Risk if deferred 30 days | Risk if deferred 90 days |
|---|---|---|
| General Corporate | Founders IP drift; grants invalidated | Series Seed due-diligence failure |
| Employment | Advisor agreement reverse-exposure | NYC LL-144 enforcement risk if score published without bias audit plan |
| IP | TM squatter beats us to USPTO | Competitor preempts "ConversionOracle" mark |
| Securities | Invalid T5/T6 RSA grants | Section 5 violation on seed subscription |
| Tax | No nexus map (minor) | Back-taxes, penalty exposure at scale |
| Privacy | Weak privacy policy published | CCPA / SCC complaint, public enforcement |
| Marketing / FTC | Unfootnoted "verified customer" claim | FTC § 5 inquiry on AI-washing language |

---

## §Next 4 Weeks — Jiaming Monday Asks

**Week of 2026-04-20:**
- [ ] Request quotes from 2 fractional-GC services + 1 mid-size firm (Gunderson seed program)
- [ ] Decide: fractional-GC at $3–5K/mo vs per-hour retainer
- [ ] Schedule IP counsel intro call (USPTO filings ≤ Week 4)

**Week of 2026-04-27:**
- [ ] GC engagement letter signed
- [ ] Founders CIIAA drafted + signed
- [ ] Confirm 83(b) on file for Jiaming/Prum/Milly (if founder stock has been issued)

**Week of 2026-05-04:**
- [ ] IP counsel engaged; TM filings in flight
- [ ] Marketing/FTC counsel review of landing + investor deck
- [ ] Employment counsel scoping call

**Week of 2026-05-11:**
- [ ] Securities counsel engagement letter signed
- [ ] 409A firm scoped
- [ ] Pre-ML-Advisor equity grant mechanics confirmed

---

## §Escalation Triggers

Any of the following escalates to "engage counsel within 72 hours, do not wait for the sequenced plan":

- Press inquiry from a named outlet (Axios, TechCrunch, NY Times, Bloomberg, Bisnow).
- Competitor cease-and-desist, DMCA, or TM-infringement notice.
- Regulator inquiry (FTC, NYC DCWP, NY AG, DOL, FinCEN, SEC).
- Merchant/creator threatening litigation (small-claims or otherwise).
- Investor term sheet delivered (even informal).
- Any data-breach or PII-disclosure event.
- Any employee/contractor alleging discrimination, wage-hour violation, or IP ownership dispute.

---

*This plan is counsel-preparation work product, not legal advice. Push has not engaged any of the counsel listed above as of 2026-04-20. Firm suggestions are placeholders for Jiaming's outreach; no endorsement or engagement is implied.*
