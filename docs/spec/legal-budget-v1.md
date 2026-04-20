# Push P2-5 — Legal Budget & Counsel Scope v1

**Status:** DRAFT v1
**Owner:** Jiaming (founder)
**Deliverable date:** 2026-05-04 (Day 14)
**Reviewers:** Jiaming; fractional-GC or first engaged counsel (for confirmation pass); investor-facing rollup via `docs/v5_2_status/P1_rollup.md §P2`
**Pre-reads:**
- [`docs/legal/counsel-engagement-plan.md`](../legal/counsel-engagement-plan.md) — authoritative for counsel TYPES + sequencing
- [`docs/legal/corporate-hygiene-checklist.md`](../legal/corporate-hygiene-checklist.md) — authoritative for signing-gates + audit trails
- [`docs/v5_2_status/audits/03-legal-compliance-register.md`](../v5_2_status/audits/03-legal-compliance-register.md) — 34-row P0/P1/P2 register this budget operationalizes
- [`docs/legal/founders-ip-assignment-CIIAA-TEMPLATE.md`](../legal/founders-ip-assignment-CIIAA-TEMPLATE.md) — CIIAA template for Jiaming/Prum/Milly
- [`docs/v5_2_status/numeric_reconciliation.md`](../v5_2_status/numeric_reconciliation.md) — single source of truth for all quoted dollar figures in investor artifacts

**Relationship to `counsel-engagement-plan.md`:** that document names counsel TYPES (general corporate, employment, IP, securities, tax, privacy, marketing/FTC) and their initial-engagement budget envelopes. THIS document specifies the DELIVERABLES (documents, filings, policies, insurance) that have to exist by gate-date, and sequences them under the hard constraint of a founder-capital-only pre-F&F runway. Read both together.

---

## §1. Required Deliverables

Every row sourced to an existing artifact + triggering event. Deliverables are ordered by Formation → Fundraise → Pre-Pilot → Pre-Scale → Insurance.

| # | Document | Source / Path | Estimated Cost | Category | Deadline (relative) | Blocker for |
|---|---|---|---|---|---|---|
| 1 | Founder RSA templates (×3 — Jiaming/Prum/Milly; not ×5 as originally scoped — no co-founder stock beyond three) | Clerky standalone OR outside counsel formation bundle | $300–800 (Clerky) or bundled in $1,500 counsel formation package | Formation | Day 3 (W0 of sprint) | 83(b) filings; founders IP cleanliness |
| 2 | CIIAAs (×3 founders) — uses [`docs/legal/founders-ip-assignment-CIIAA-TEMPLATE.md`](../legal/founders-ip-assignment-CIIAA-TEMPLATE.md) | Counsel review of template + execution | $500–800 (bundled with §1) | Formation | Day 3 (W0) | Seed-round due-diligence; trade-secret posture |
| 3 | SAFE template (F&F) | Clerky YC post-money SAFE (free) + counsel review | $0 + $200–500 counsel review | Fundraise | Before F&F close (~Week 8) | F&F close |
| 4 | Delaware C-Corp formation + NY foreign qualification | Stripe Atlas ($500) OR Gunderson Dettmer seed package (~$1,500) | $500–1,500 | Formation | Immediately (if not already filed; see hygiene checklist §1.1–§1.8) | Everything downstream — bank account, bylaws, board consents |
| 5 | 83(b) election filings (×3 founders) | Self-file via certified mail + return receipt | $0 + ~$50 certified mail | Formation | T+30 from founder-stock issuance (hygiene §2.5) | Tax exposure; CRITICAL 30-day deadline |
| 6 | Privacy Policy (CCPA/CPRA-compliant; baseline GDPR scaffold) | TermsFeed (DIY) OR privacy counsel | $100–500 (TermsFeed) OR $1,500–3,000 (counsel) | Pre-pilot | Before paid-ad traffic OR data collection at scale | Privacy policy page live on push.nyc; remediation of register item #24 |
| 7 | Terms of Service (website + merchant ToS) | Counsel drafted; template start from YC/Bessemer libraries | $500–1,500 | Pre-pilot | Before first pilot merchant signup | Pilot LOI stack; register item #19 |
| 8 | FTC Disclosure Policy (company-side, per 16 CFR § 255) | Marketing/FTC counsel (bundled with §9 or §15) | $300–800 | Pre-pilot | Before first creator post under paid program | DisclosureBot v0 launch (P2-4); register item #3 |
| 9 | Pilot LOI template + first pilot contract | Counsel-drafted template + founder-negotiated per-deal terms | $200–500 (template); $500–1,500 per negotiated pilot contract | Pilot | Week 1 pilot outreach (P2-1) | First pilot merchant signing |
| 10 | Standard Creator RSA for T5 / T6 | Securities counsel | $500–1,000 (first template); $500 per instance if unique terms | Pre-T5-grant | Before first T5 Ruby promotion under Rule 701 analysis | Creator equity (register item #8) |
| 11 | Advisor Agreement (YC FAST-based) — adaptation | Securities + employment counsel review of YC template | $300–500 | Pre-ML-Advisor-sign | Before ML Advisor countersigns (v5.3 W2) | ML Advisor equity grant |
| 12 | TCPA compliance review (opinion letter) | TCPA-specialist counsel | $500–1,500 | Pre-SMS | Before v5.3 Week 7 (first loyalty-card SMS send) | P2-2 SMS compliance launch |
| 13 | FTC Disclosure counsel review (DisclosureBot v0 legal sign-off) | Marketing/FTC specialist counsel | $500–1,500 | Pre-DisclosureBot | Before v5.3 Week 10 | P2-4 DisclosureBot v0 launch |
| 14 | NYC LL-144 AEDT pre-use notice + bias-audit plan | Employment counsel (NYC-specialized) | $500–1,500 | Pre-creator-onboard-at-scale | Before v5.3 Week 8 (first NYC creator onboarded into Push Score tier progression) | push-creator §5.5 compliance; register item #11 |
| 15 | NDA template (mutual) | Counsel OR EFF template | $100–300 | Pre-diligence | Before first investor / partner deep-dive | Investor & partner conversations |
| 16 | E&O Insurance (covers DisclosureBot v0 + attribution/verification liability) | Insurance broker (Embroker / Newfront / Vouch / Founder Shield) | $3,000–8,000 annual premium | Pre-scale | Before v5.3 Week 10 OR before 50-merchant scale (whichever first) | Platform liability; merchant-indemnity clauses |
| 17 | D&O Insurance (first external board seat) | Broker | $4,000–10,000 annual premium | Pre-seed-close | Before Series Seed term sheet OR first non-founder director | Investor terms demanding D&O |
| 18 | Cyber liability insurance (breach response + ransomware) | Broker | $5,000–15,000 annual premium | Pre-scale | Before PII at scale / first Supabase DPA event | Breach-notification readiness; register item #28 |

**Row count: 18.** Categories: Formation (5), Fundraise (1), Pre-pilot (3), Pilot (1), Pre-scale (5), Insurance (3). Every row maps to at least one open row in `audits/03-legal-compliance-register.md`.

---

## §2. Total Estimate

**Year 1 legal spend (counsel + templates only; excludes insurance premiums):**
- Low scenario: **$8K–12K.** Uses Clerky + TermsFeed DIY paths; single fractional-GC for Phase B+C work; no custom negotiation on pilot contracts.
- Realistic: **$15K–25K.** Mixes a seed-native firm formation package + hour-banked fractional-GC + standalone TCPA and FTC specialists as needed.
- High: **$30K+.** If pilot contracts substantively negotiated, two creator RSA instances bespoke, and Rule 701 memo requires refresh inside year one.

**Year 1 insurance spend (Pre-scale / Pre-seed insurance trifecta):**
- Minimum (E&O only, D&O deferred, cyber deferred): **$3K–8K.**
- Seed-close-complete (E&O + D&O): **$7K–18K.**
- Full trifecta (E&O + D&O + Cyber at PII scale): **$12K–33K.**

**Combined Year 1 target envelope (counsel + insurance):**
- Low: **$11K–20K** (pre-F&F survival mode — only Phase A + Phase B1 + minimal E&O)
- **Realistic: $25K–40K** (pre-scale posture — all three phases + E&O + D&O)
- High: **$50K+** (includes cyber liability + SOC 2 Type I kickoff, which is out of scope for Phase D here)

**Founder capital exposure pre-F&F close:** $2,500–3,000 maximum. All remaining spend is post-F&F allocated from a $15K legal reserve out of the $50K–100K target F&F raise.

---

## §3. Phasing (date-anchored, gate-linked)

Four phases, each with explicit what's-in / prerequisite / gate / cumulative-cost. Phases A through C close within v5.3 sprint (Weeks 0–10 from 2026-04-20). Phase D is forward-looking for Series Seed planning.

### Phase A — Pre-Sprint End (Day 14, 2026-05-04)

**What's in:** Items #1 (Founder RSA ×3) + #2 (CIIAAs ×3) + #4 (Delaware formation / NY foreign qual) + #5 (83(b) filings ×3).
**Prerequisite:** Jiaming/Prum/Milly commitment to founder-stock split confirmed in writing.
**Gates:** all 3 founders have counter-signed CIIAAs; 83(b) receipts archived (hygiene §6.4); Delaware certificate date-stamped.
**Cost (Phase A total):** **$800–1,500** realistic; $300 absolute floor if Clerky DIY end-to-end.
**Funding source:** 100% Jiaming founder capital.
**Exit criterion:** hygiene checklist §1 + §3 all flipped to [✓]. Must close before any external fundraise conversation begins.

### Phase B — Pre-Pilot (v5.3 Week 4, target 2026-06-01)

**What's in:** Items #6 (Privacy Policy) + #7 (ToS) + #8 (FTC Disclosure Policy) + #9 (Pilot LOI template) + #11 (Advisor Agreement adaptation).
**Prerequisite:** Phase A complete; first pilot merchant conversation has advanced to LOI stage.
**Gates:** Privacy Policy + ToS + FTC disclosure live on www.push.nyc before any paid-ad traffic OR first pilot merchant signing (trigger via P2-1 + P2-4); first ML Advisor countersigning uses the Phase B advisor template.
**Cost (Phase B total):** **$1,400–3,800** realistic.
**Funding source:** ~$1,000 Jiaming founder capital (bridges to F&F close); balance from F&F proceeds post-Week 8.
**Exit criterion:** all register P1 items (#7, #10, #11, #18, #19, #20, #24) either closed or counsel-engagement-letter signed.

### Phase C — Pre-Scale (v5.3 Week 10, target ~2026-07-06)

**What's in:** Items #10 (Creator RSA template T5/T6) + #12 (TCPA review) + #13 (FTC DisclosureBot counsel opinion) + #14 (AEDT pre-use notice + bias-audit plan) + #15 (NDA template).
**Prerequisite:** Phase B complete; F&F closed with ≥$15K legal reserve available; at least one counsel engaged on retainer.
**Gates:** first loyalty-card SMS send (P2-2) holds until TCPA opinion letter in hand; DisclosureBot v0 launch (P2-4) holds until FTC counsel sign-off; first NYC creator at scale holds until LL-144 notice published.
**Cost (Phase C total):** **$2,400–6,500** realistic.
**Funding source:** F&F legal reserve.
**Exit criterion:** all register rows tied to P2-2, P2-4, and LL-144 (#8, #11) closed or counsel-engagement-letter signed.

### Phase D — Pre-Series-A (Month 12–18, out-of-scope for immediate budget)

**What's in (plan-only, not budgeted here):** Item #17 (D&O at first board seat) + #18 (Cyber liability) + SOC 2 Type I kickoff + trademark filings ("ConversionOracle™", "Vertical AI for Local Commerce").
**Combined envelope:** $40K–100K (insurance + SOC 2 audit firm + IP filings + tax engagement).
**Funding source:** Series Seed proceeds.
**Note:** D&O is a Series Seed term-sheet gate, not a Push-initiated purchase. E&O (#16) lives in Phase C, not Phase D.

### Ongoing retainer (Month 3+, overlapping Phases B–D)

**$500–1,500/month** for fractional-GC OR hour-banked specialist counsel (~10 hours/month at $200–400/hr marketplace rate). Kicks in once Phase B closes. Before Phase B the spend is one-time per-deliverable, not a retainer. Total ongoing retainer envelope for Year 1: **$3K–10K** (6–8 months at retainer rate, assuming Phase B closes ~Week 4).

**Phase summary table:**

| Phase | Close date | Items | Cost (low) | Cost (high) | Funding |
|---|---|---|---|---|---|
| Phase A | 2026-05-04 | 1, 2, 4, 5 | $800 | $1,500 | Founder capital |
| Phase B | 2026-06-01 | 6, 7, 8, 9, 11 | $1,400 | $3,800 | Founder + F&F |
| Phase C | 2026-07-06 | 10, 12, 13, 14, 15 | $2,400 | $6,500 | F&F reserve |
| Phase A+B+C | — | 14 items | **$4,600** | **$11,800** | — |
| Phase D | Month 12–18 | 17, 18, SOC 2, TM | $40K | $100K | Series Seed |
| Ongoing retainer (12 mo) | — | — | $3K | $10K | Revenue + Seed |

**Phase A+B+C aggregated: $4,600 (low) / $11,800 (high).** This is the total legal-counsel spend through Series Seed readiness, excluding insurance premiums.

---

## §4. Counsel Recommendations (NYC startup-focused, sequenced)

### §4.1 Full-service firms (for formation + securities + ongoing corporate)

Three seed-native firms to RFQ:

- **Cooley LLP** — runs a seed-stage fixed-fee formation package (typically $5K–10K for C-corp + founders-package + first SAFE review); $700–1,000/hr partner rate for ad-hoc work; strong securities + privacy benches; NY + SF offices.
- **Gunderson Dettmer** — arguably the most seed-native firm on the coast; founders-package often discounted or deferred-billed for early-stage; strongest securities and venture-finance bench. Formation package ~$5–8K; $650–900/hr.
- **Perkins Coie** — deeper tech-transactions + marketing/FTC practice than Cooley; competitive seed program; $700–950/hr partner.

Also viable if above are oversubscribed: **Fenwick & West** (IP-forward), **Wilson Sonsini** (traditional big-firm seed program; slower).

**When to use:** Phase A formation package; Phase C securities memo for Creator RSA; Phase D Series Seed term-sheet negotiation.

### §4.2 Fractional-GC services (for ongoing retainer)

- **Rally Legal** — $3K–5K/month; corporate + employment + light privacy; strong seed-stage ops fit.
- **Outlaw (now part of Filevine)** — contract-lifecycle + fractional counsel; $3K–6K/month.
- **Lumen Legal** — staffing-model fractional; $3K–5K/month.
- **PilotLegal / Priori on-retainer** — $3K–5K/month fractional-GC placements.

**When to use:** Month 3+ once Phase B closes and predictable monthly work exists across corporate + employment + privacy. Do not retain a fractional-GC before Phase B — the fixed monthly cost exceeds per-deliverable spend.

### §4.3 Marketplace / junior counsel (for one-off reviews)

- **Lawtrades** — $200–400/hr; good for NDA reviews, pilot LOIs, low-stakes contract turns.
- **Priori Legal** — curated marketplace; $250–500/hr; quality slightly higher than Lawtrades average.
- **UpCounsel** — cheapest tier; variable quality; always ask for bar admissions + malpractice insurance certificate before engagement.

**When to use:** Items #9 pilot LOI template, #15 NDA template, initial SAFE review (#3). Do NOT use marketplace counsel for securities work (Rule 701, Creator RSA), AEDT opinion, or TCPA review — specialization matters and the fee differential is small.

### §4.4 DIY-friendly platforms (for templates Jiaming can self-serve)

- **Clerky** — best-in-class for formation, SAFE documents, founder stock purchase agreements, option-pool adoption, board consents. Flat-fee packages $300–800.
- **Stripe Atlas** — $500 formation + registered agent + Delaware filing + tax ID. Good if Push has not yet filed.
- **TermsFeed / iubenda / Termly** — privacy policy + ToS generators. $100–500/year. Acceptable for Phase B Privacy Policy at low-risk scale; swap to counsel-drafted by Phase C.
- **LexCheck** — contract redlining AI; useful for vendor/pilot contract review before paying counsel.
- **EFF template library** (nda, CIIAA starting points) — free, attorney-reviewed originals, no signature authority.

### §4.5 Insurance brokers (startup-focused)

- **Embroker** — strongest digital-native broker for tech startups; D&O $4–10K, E&O $3–8K, cyber $5–15K typical seed quotes; all-in-one platform.
- **Newfront Insurance** — fast-growing tech-startup broker; comparable pricing; stronger service bench.
- **Vouch Insurance** — startup-only carrier; bundles D&O/E&O/cyber; seed-stage quotes often lowest on market.
- **Founder Shield** — specialist seed-to-Series-C broker; negotiates harder on defense cost coverage.

Typical seed-stage insurance quotes (confirm in RFQ):
- D&O $1M/$1M: **$4,000–10,000/year**
- E&O (Tech) $1M/$1M: **$3,000–8,000/year**
- Cyber liability $1M: **$5,000–15,000/year**
- Combined bundle discount: ~10–15% off sum if all three with one carrier.

---

## §5. Funding Source & Cash-Flow Model

### Pre-F&F phase (today through ~Week 8, 2026-06-15)

**Available capital:** Jiaming founder capital only. No creditor financing; no vendor deferrals beyond Clerky / Stripe Atlas standard net-30 terms.

**Spend drawdown (cumulative):**
- Day 0 → Day 14 (Phase A): $800–1,500
- Week 3 → Week 4 (Phase B partial — Advisor template + SAFE counsel review + Pilot LOI template starter): ~$1,000–1,500

**Running cash need through Week 8:** **$1,800–3,000.**

### F&F close (Week 8, target amount $50K–100K raise)

**Allocation rubric out of F&F proceeds:**
- **$15K reserved for legal (Phase B remainder + Phase C).** This is the hard-number allocation to lock during F&F SAFE negotiation with family/friends investors.
- Remaining $35K–85K allocated to: product/engineering (majority), ML Advisor onboarding incidentals, first pilot-cohort creator capital ($500–1,000), admin/ops.

### Post-F&F phase (Week 9+, 2026-06-22 onward)

- **$500–1,500/month** fractional-GC or hour-bank retainer (starts Month 3 per §3; before that spend is per-deliverable).
- **$15K reserve** carried forward for Phase D + insurance (staged drawdown).
- Insurance (#16 E&O) bound by Week 10: **$3,000–8,000 premium** first annual.

### Cash-flow summary (first 12 months)

| Month | Legal counsel | Insurance | Cumulative | Source |
|---|---|---|---|---|
| M0 (sprint W0–W4) | $1,800–3,000 | $0 | $1,800–3,000 | Founder capital |
| M1 (W5–W8) | $1,000–1,500 | $0 | $2,800–4,500 | Founder + F&F mix |
| M2 (W9–W10, Phase C start) | $2,400–6,500 | $3,000–8,000 (E&O bind) | $8,200–19,000 | F&F reserve |
| M3 (ongoing retainer begins) | $500–1,500 | $0 | $8,700–20,500 | F&F reserve |
| M3–M12 | $500–1,500/mo × 10 | $0 | +$5,000–15,000 | F&F + early revenue |
| **End of Year 1** | **~$14K–35K** | **$3K–8K** | **$17K–43K** | — |

Year 1 total target against §2 envelope: **realistic line fits the $25K–40K combined target.**

---

## §6. Priority Sequencing (in the actual calendar)

| Week | Actions | Spend (this week) |
|---|---|---|
| W0–W1 (2026-04-20 → 2026-05-03) | RFQ 3 counsel options (1 firm, 1 fractional-GC, 1 marketplace for one-offs); decide engagement model; kickoff Clerky / Stripe Atlas formation if not filed | $0 (RFQ is free) |
| W1–W2 (2026-04-27 → 2026-05-10) | Engage first counsel (likely full-service firm for Phase A); execute Items #1 + #2 + #4 + #5 (formation + CIIAAs + 83(b)) | $1,500 |
| W2–W3 (2026-05-04 → 2026-05-17) | Item #11 advisor agreement template review; Item #3 SAFE template counsel review | $700 |
| W4 (2026-05-18 → 2026-05-24) | Items #7 ToS + #8 FTC disclosure policy + #9 Pilot LOI template | $1,500 |
| W5 (2026-05-25 → 2026-05-31) | Item #6 Privacy Policy + Item #15 NDA template | $500 |
| W6 (2026-06-01 → 2026-06-07) | Phase B close review with counsel; prep F&F SAFE drafts with counsel note | $300 |
| W7 (2026-06-08 → 2026-06-14) | Item #12 TCPA counsel review (opinion letter) for P2-2 SMS | $1,000 |
| W8 (2026-06-15 → 2026-06-21) — **F&F close trigger** | Close F&F; release $15K legal reserve; begin Phase C spending | $0 (transition week) |
| W8–W9 (2026-06-15 → 2026-06-28) | Item #10 Creator RSA template; Item #14 AEDT pre-use notice + bias-audit plan | $1,500 |
| W10 (2026-06-29 → 2026-07-05) | Item #13 FTC DisclosureBot counsel opinion; Item #16 E&O insurance bind (quotes RFQ in W8) | $1,500 + $5,000 premium |
| **Cumulative through W10** | | **~$12,000 counsel + $5,000 insurance = $17,000** |

Gate triggers baked into the calendar:
- **W2:** cannot raise F&F until Phase A gates closed (hygiene §3 all [✓], 83(b) filings archived).
- **W4:** cannot ship paid-ad landing-page traffic until Item #6 + #7 + #8 live. Block any marketing spend before.
- **W7:** cannot send first TCPA loyalty-card SMS until Item #12 opinion letter in hand.
- **W10:** cannot launch DisclosureBot v0 until Item #13 sign-off. Cannot scale to 50+ merchants until Item #16 E&O bound.

---

## §7. Owner & Triggers

### Ownership handoff ladder

- **Day 0 → fractional-GC engagement (target ~Month 3):** Jiaming (founder) owns every counsel interaction, every engagement-letter countersignature, and every gate-close confirmation.
- **Fractional-GC engagement (target Month 3) → Series Seed close:** fractional-GC owns Phase B+ sequencing, escalates per-item cost overruns to Jiaming; Jiaming retains final approve authority on every engagement-letter > $2K.
- **Post-Series Seed:** GC role transitions to a part-time or full-time internal counsel if cap-table complexity + contract volume warrants. Not in scope of Year 1 budget.

### Gate definitions (no self-certification; all have an external artifact)

| Gate | Close definition | Artifact |
|---|---|---|
| **Phase A close** | All 3 founders signed CIIAA + all 3 founders' 83(b) filed with USPS certified-mail receipts + Delaware formation certificate date-stamped + bylaws + initial board consents in Clerky | CIIAA PDFs with notarized signatures; certified-mail green cards scanned to minute book; Delaware certificate image |
| **Phase B close** | Privacy policy + ToS + FTC disclosure policy live on www.push.nyc (public URLs verified); advisor agreement template approved by counsel; pilot LOI template + NDA template in Clerky deal room | URLs published; template PDFs with counsel sign-off email |
| **Phase C close** | TCPA + FTC counsel opinion letters in hand (PDF); AEDT pre-use notice drafted + approved for first NYC creator onboard; E&O insurance bound with certificate of insurance (COI) received | Opinion letter PDFs; AEDT notice draft; E&O COI |
| **F&F close trigger** | Phase B completion gives Push a shippable legal foundation. Family/Friends SAFEs signed from the 2nd half of Week 8 onward, post Phase B close | SAFE instruments archived in Clerky |
| **Series Seed readiness** | Phase C closed + Item #17 D&O bound + IP trademarks filed (Phase D) + founders/cap-table due-diligence package ready in Carta Portal or DocSend | All Phase C gates + D&O COI + USPTO filing receipts |

### Escalation triggers (force same-week counsel engagement, regardless of sequenced plan)

Inherited from `counsel-engagement-plan.md §Escalation Triggers`, reiterated here because they override this budget:

- Any regulator inquiry (FTC, NYC DCWP, NY AG, DOL, FinCEN, SEC).
- Cease-and-desist / DMCA / TM-infringement notice.
- Investor term sheet (even informal).
- Data breach or PII disclosure.
- Merchant/creator litigation threat.
- Press inquiry from a named outlet before Item #13 FTC DisclosureBot sign-off.

Any of these triggers pulls forward spend; Jiaming should assume a $2K–5K same-week counsel retainer on top of the planned calendar.

---

## Appendix A — Request-For-Quote (RFQ) template for 3 counsel options

Send identical RFQ text to three candidate counsel (one full-service firm, one fractional-GC, one marketplace placement). Responses returned within 10 business days enable a W1 engagement decision.

```
Subject: Push, Inc. — Seed-stage counsel scoping RFQ

Dear [Counsel Name],

Push, Inc. is a pre-seed Delaware C-corporation operating out of New York City. We are a creator-powered local-commerce platform in pilot phase. Our founding team is 3 (Jiaming, Prum, Milly). We are raising a $50K–100K Friends & Family round in Q2 2026 and a Series Seed in Q4 2026.

We are scoping counsel for the following deliverables over the next 10 weeks:

Phase A (by 2026-05-04):
- Delaware formation hygiene confirmation (bylaws, board consents, EIN)
- Founder Restricted Stock Purchase Agreements × 3 with 4-year vesting, 1-year cliff
- CIIAAs × 3 (template ready, ~3 sections of tailoring required)
- 83(b) election filing-instruction walkthrough

Phase B (by 2026-06-01):
- Privacy Policy (CCPA/CPRA baseline; GDPR-ready scaffold)
- Website Terms of Service
- FTC 16 CFR §255 disclosure policy (company-side)
- Pilot merchant LOI template + first-contract review
- Advisor Agreement (YC FAST-based) template adaptation

Phase C (by 2026-07-06):
- Creator RSA for T5/T6 tier (Rule 701 analysis)
- TCPA compliance opinion letter
- FTC DisclosureBot counsel review (opinion letter for company-owned AI-mediated disclosure product)
- NYC LL-144 AEDT pre-use notice + bias-audit plan
- Mutual NDA template

Specific questions:
1. What is your seed-stage engagement model? Fixed-fee package, hourly, or hybrid?
2. What is your all-in hourly rate for [partner / associate / paralegal]?
3. Do you offer a founders-package for formation + CIIAA + SAFE template? If yes, price?
4. What is your bench depth on each of: securities, employment (NYC LL-144 specialty), FTC/marketing, TCPA?
5. Can you defer a portion of billables to close-of-F&F (Week 8) or Series Seed (Month 12)?
6. Do you accept payment via Mercury / Brex ACH or wire only?
7. Estimated total Phase A+B+C budget envelope based on the above scope.
8. Do you have any disqualifying conflicts with: Shopify, Square, Stripe, Toast, Yelp, Meta, TikTok, or any YC-backed creator-monetization platform?

Please respond by [10 business days]. If selected, we target engagement-letter signature in Week 1 (2026-04-28).

Regards,
Jiaming Wang
Founder, Push, Inc.
wangjiamingaas@gmail.com
```

### Scorecard for comparing responses

| Criterion | Weight | Firm A | Firm B | Fractional-GC C | Marketplace D |
|---|---|---|---|---|---|
| Phase A+B+C total quote vs §3 budget | 25% | | | | |
| Bench depth (5 of 7 specialties) | 20% | | | | |
| Payment terms (deferred billing) | 15% | | | | |
| NYC LL-144 AEDT specialty experience | 15% | | | | |
| Turnaround SLA on engagement-letter | 10% | | | | |
| Conflicts cleared | 10% | | | | |
| Communication responsiveness (proxy: RFQ reply speed) | 5% | | | | |

---

## Appendix B — Cost-control playbook (using counsel efficiently)

1. **Never have counsel start from a blank page.** Every request includes: a draft or template (ours or YC / Clerky / EFF), a list of deviations from the template, and the specific counsel questions we have. This cuts associate time 40–60%.
2. **Bundle questions into scheduled weekly calls.** 30-min standing call with primary counsel every Thursday; ad-hoc urgent items only by email-with-deadline. Prevents fragmented billing + context-switch premium.
3. **Cap billable per deliverable.** Every engagement-letter amendment or SoW includes "not-to-exceed" cap at 1.2× estimate. Hard-stop at cap forces counsel to scope-reset if over.
4. **Triage first, redline second.** For every inbound contract (pilot, advisor, vendor), Jiaming does a first-pass self-review using the counsel-provided playbook (cf. `legal:review-contract` skill equivalent). Counsel then reviews only the flagged sections. Cuts contract review ~50%.
5. **Use junior counsel for template work; partner for judgment calls.** Template adaptation, filings, initial drafts → associate ($400–550/hr). Securities-law judgment, AEDT bias-audit sign-off, Rule 701 analysis → partner ($700–1,000/hr). Never get a partner to do what an associate can do; never get an associate to do what a partner's judgment is required for.
6. **Keep a deliverable inventory + receipt file.** Each counsel-generated artifact has: date, counsel name, billable hours, invoice-matched. Forces discipline on counsel's end and supports Series Seed due-diligence without post-hoc reconstruction.
7. **Front-load specialists.** TCPA, AEDT, FTC DisclosureBot — these need specialist counsel, not a generalist. Pay the $500–1,500 per opinion letter once; don't keep a generalist running in circles billing $2K–4K trying to substitute.
8. **Defer 409A + trademark filings to Phase D.** Neither blocks a pre-seed / F&F close. 409A required only for first RSA grant (Month 8+ when T5 creators promote). Trademark filings are cheaper in bulk post-Series Seed. §3 Phase A+B+C deliberately omits both.
9. **Use Clerky for cap-table + equity grants from Day 0.** Free signature workflow, integrates with Carta, satisfies every board-consent audit trail requirement. Do NOT email PDFs around for signatures.
10. **Track counsel spend against §5 cash-flow monthly.** If M2 or M3 tracks >20% over §5 cumulative line, pause non-urgent Phase C items until F&F reserve replenished.

---

## Appendix C — Red-flag cost items (expenses that balloon if not managed)

1. **Scope creep on pilot contracts.** A single pilot LOI typically runs 3–5 hours counsel time; a substantively negotiated master services agreement can balloon to 20–40 hours ($8K–20K). Mitigation: Item #7 ToS + Item #9 pilot LOI template are standardized; deviations require Jiaming sign-off before counsel engages on bespoke drafting.
2. **Trademark filings discovered mid-marketing push.** A reactive "ConversionOracle™" filing during a press cycle runs 2x the normal $1,500–2,500 flat fee because of expedited-examination premium ($400 USPTO surcharge + counsel rush markup). Mitigation: defer to Phase D per §3, OR if press window compresses, file via legalZoom flat-fee non-counsel path ($500 total) with counsel reviewing the filing wording only (~1 hour).
3. **Bespoke Creator RSA per T5/T6 instance.** Item #10 template costs $500–1,000; each unique per-creator negotiation can add $500–2,000. Mitigation: three standard terms (equity %, vesting, cliff) — any deviation is founder-approved in advance and quoted before counsel engages.
4. **Insurance premium escalation from claim history or product-category repricing.** E&O premiums for "AI-mediated consumer-facing product" have risen 20–40% year-over-year since 2024. Mitigation: bind Item #16 by W10 before the 2026-Q3 renewal cycle (typically Sept–Oct); lock rate for 12 months.
5. **Fractional-GC scope creep beyond 10 hours/month.** At $3K–5K/month retainer, counsel often "helpfully" takes on 20–30 hours of work, which triggers an over-retainer hourly bill of $500/hr on excess. Mitigation: monthly usage review; scale retainer up (to 20 hours) OR push excess to marketplace counsel at $250–400/hr instead.
6. **Delayed 83(b) filing (past 30 days).** Not a counsel cost per se, but a tax exposure that can reach $30K–100K over 4-year vest on even modest founder valuations. Mitigation: Item #5 filing is a hygiene checklist gate; Jiaming owns same-week filing for every founder.
7. **AEDT bias-audit vendor lock-in.** NYC LL-144 requires independent bias audit; vendors like BLDS, Parity, ORCAA charge $15K–50K per audit. Mitigation: Item #14 counsel-drafted plan is a process document, NOT the audit itself; audit is deferred to Phase D when Push Score has enough production data to audit (post-Month 6+). Budget $15K–25K reserve post-Series Seed.
8. **Privacy counsel over-scoping GDPR on a US-only product.** Full GDPR compliance counsel work can run $10K–25K; Push is US-only through Year 1. Mitigation: Item #6 is CCPA/CPRA-primary with GDPR-ready scaffold only; full GDPR deferred until EU expansion decision.
9. **Forgotten annual filings.** Delaware franchise tax ($400+ minimum), NY foreign-qual biennial report, registered-agent annual fee ($150–400). Mitigation: hygiene §1.6 calendar; Clerky / Stripe Atlas automates.
10. **Legal counsel invoice opacity.** 25–35% of seed-stage counsel invoices contain billable entries that are unclear or duplicative. Mitigation: Jiaming reviews every invoice within 5 business days of receipt; disputes flagged before payment releases.

---

## Appendix D — Alternatives to each deliverable (DIY risk levels)

Risk rubric:
- **Low risk:** DIY acceptable; counsel review optional.
- **Medium risk:** DIY acceptable for Phase A/B cost management; swap to counsel-drafted by Phase C.
- **High risk:** counsel required; DIY creates material legal exposure.

| # | Deliverable | DIY path | Counsel path | Risk |
|---|---|---|---|---|
| 1 | Founder RSA | Clerky standalone ($300–800 flat) | Bundled in firm formation package ($1,500–5,000) | **Low** (Clerky templates are attorney-drafted) |
| 2 | CIIAA | Template in repo (`founders-ip-assignment-CIIAA-TEMPLATE.md`) — self-serve | Counsel review of template $500–800 | **Medium** — §3 invention-assignment scope varies by founder jurisdiction; counsel review recommended |
| 3 | SAFE | YC free post-money SAFE via Clerky | Counsel review $200–500 | **Low** for YC template; **High** if custom terms |
| 4 | Delaware formation | Stripe Atlas $500 | Counsel formation package $1,500 | **Low** — Stripe Atlas is production-quality for standard C-corp |
| 5 | 83(b) filing | Self-file certified mail ($50) | N/A (not a counsel deliverable) | **Low** mechanically; **High** if missed 30-day window |
| 6 | Privacy Policy | TermsFeed $100–500 | Counsel $1,500–3,000 | **Medium** — TermsFeed OK for Phase B; counsel-drafted for Phase C |
| 7 | Terms of Service | TermsFeed / Termly $100–500 | Counsel $500–1,500 | **Medium** — DIY OK for website ToS; counsel required for merchant ToS |
| 8 | FTC Disclosure Policy | FTC Guides 16 CFR §255 self-draft | Counsel $300–800 | **High** — direct FTC §5 exposure; counsel required |
| 9 | Pilot LOI | Repo template (none yet) / self-draft | Counsel $200–500 template | **Medium** — template OK; negotiated deal needs counsel |
| 10 | Creator RSA (T5/T6) | N/A — Rule 701 compliance is non-DIY | Counsel $500–1,000 template | **High** — Rule 701 violation is a material securities-law issue |
| 11 | Advisor Agreement | YC FAST template self-serve | Counsel adaptation $300–500 | **Medium** — YC template is solid; counsel swap when agreement deviates materially |
| 12 | TCPA review | N/A — DIY not acceptable for SMS compliance | Counsel $500–1,500 opinion letter | **High** — TCPA class-action exposure is $500–$1,500 per violation |
| 13 | FTC DisclosureBot opinion | N/A | Counsel $500–1,500 | **High** — AI-mediated disclosure is novel territory; counsel required |
| 14 | AEDT pre-use notice | N/A | Counsel $500–1,500 | **High** — NYC LL-144 penalties + reputation risk |
| 15 | NDA | EFF template / Y Combinator one-way NDA | Counsel $100–300 mutual | **Low** — templates OK for investor / partner conversations |
| 16 | E&O insurance | N/A — must go through broker | Broker $3,000–8,000 annual | **Medium** — bind before 50-merchant scale; shop 2 brokers |
| 17 | D&O insurance | N/A | Broker $4,000–10,000 annual | **High** — Series Seed term-sheet gate; bind before first non-founder director |
| 18 | Cyber insurance | N/A | Broker $5,000–15,000 annual | **Medium** — bind before PII at scale; can defer to Phase D |

**DIY-total budget estimate (absolute minimum, all low/medium-risk items self-served):** ~$2,500 counsel + $3,000 E&O = **$5,500 Year 1.** This is the floor if everything high-risk is deferred to Phase D. Not recommended — TCPA, AEDT, and FTC DisclosureBot are Phase C blockers.

**Counsel-total budget estimate (recommended — high-risk items counsel-drafted; medium-risk DIY initially then counsel-upgrade Phase C):** ~$15K counsel + $3K–8K E&O = **$18K–23K Year 1.** This matches the §2 realistic target.

---

*This spec is counsel-preparation work product and budget planning, not legal advice. Push has not engaged any of the counsel, brokers, or platforms named here as of 2026-04-20. Every deliverable in §1 and every firm / broker in §4 is a placeholder for Jiaming's RFQ — no endorsement or engagement is implied. Treat every dollar figure as a planning estimate subject to confirmation in the Appendix A RFQ process.*
