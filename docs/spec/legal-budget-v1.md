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

---

## §8. Counsel-RFQ Template (ready to send)

This is the single-email RFQ Jiaming sends in Week 0 (2026-04-20 → 2026-04-26) to the three candidate firms identified in §4.1. Distinct from Appendix A, which is the formal scoping document; §8 is the Monday-morning email that triggers the 10-business-day clock.

### §8.1 Subject line

`Push, Inc. — Seed-stage counsel RFQ (Phase A close 2026-05-04, $1K–$1.5K)`

Subject line is deliberately scoped: names the company, flags pre-seed stage, puts the close date and budget in the preview so the firm's intake paralegal can triage within 5 minutes.

### §8.2 Company 1-paragraph intro

> Push, Inc. is a pre-seed Delaware C-corp headquartered in New York City. Founders: Jiaming Wang (CEO), Prum (ops), Milly (community). We operate a creator-powered local-commerce platform — creators drive verified walk-ins to NYC restaurants and retailers; merchants pay per verified customer. We are today pre-pilot, pre-revenue, pre-counsel. We are raising a $50K–$100K Friends & Family round in Q2 2026 targeting close in Week 8 (~2026-06-15), and planning a Series Seed in Q4 2026. Our ML advisor signs Week 8; first merchant pilot signs shortly after. We have a 10-week compliance sprint front-loaded onto formation hygiene + securities + marketing/FTC work.

### §8.3 Specific scope (Phase A only for this RFQ; Phase B+C discussed as retainer in §8.5)

**Phase A deliverables (target 2026-05-04, Day 14):**

1. **Delaware C-Corp formation hygiene confirmation.** We will likely have filed via Stripe Atlas or will file as part of this engagement; either way we need a date-stamped certificate, bylaws, initial stockholder + board consents, EIN, registered-agent confirmation, and NY foreign qualification (per `corporate-hygiene-checklist.md` §1.1–§1.11).

2. **Founder Restricted Stock Purchase Agreements ×3** (Jiaming, Prum, Milly). 4-year vest, 1-year cliff, standard Delaware-C-Corp repurchase right on unvested shares, no acceleration for Phase A (keep it simple; counsel can bless adding acceleration later).

3. **CIIAAs ×3** using our in-repo template at [`docs/legal/founders-ip-assignment-CIIAA-TEMPLATE.md`](../legal/founders-ip-assignment-CIIAA-TEMPLATE.md). We ask you to review the template (~3 sections of tailoring expected), flag any jurisdiction-specific issues for NY, and supervise execution. Template is a starting point, not a finished instrument.

4. **SAFE template review** (YC post-money via Clerky). Pre-F&F review; we expect minimal redlining on the YC form and want counsel sign-off before the first family/friends SAFE signs in Week 8.

5. **Advisor Agreement template adaptation** per §1 row #11 + YC FAST base (see [`docs/hiring/advisor-agreement-checklist.md`](../hiring/advisor-agreement-checklist.md)). Target: first ML Advisor countersigns ~Week 8 against this template; IP assignment + non-solicit (12-month, NOT non-compete per FTC 2024) are the two key clauses we expect counsel to confirm.

6. **83(b) election filing walkthrough** ×3 founders (self-file via certified mail; no counsel billable beyond ~30 min of email instructions).

### §8.4 Desired timeline

- **Week 0 (this RFQ, 2026-04-20 → 2026-04-26):** quotes returned.
- **Week 1 (2026-04-27 → 2026-05-03):** engagement-letter signed, retainer paid, work begins.
- **Week 2 (2026-05-04):** Phase A deliverables complete — founders signed + 83(b) mailed + Delaware cert date-stamped.

The 2026-05-04 Phase A close is a hard gate because every external fundraise conversation (F&F, then Series Seed) is blocked until §1 Phase A items are in hand.

### §8.5 Budget comfort

- **Phase A flat-fee target: $1,000–$1,500 all-in** (formation package + founders-package + SAFE/advisor template review). This aligns with seed-stage founders-package pricing at Cooley / Gunderson Dettmer / Perkins Coie per §4.1. If you cannot hit this number, tell us the minimum flat-fee scope you would do at this price; we are willing to trim (e.g., defer SAFE review to Week 6).
- **Phase B (target 2026-06-01): $1,400–$3,800.** Privacy Policy, ToS, FTC disclosure policy, Pilot LOI template. Open to monthly retainer or per-deliverable pricing — you tell us.
- **Phase C (target 2026-07-06): $2,400–$6,500.** Creator RSA template (Rule 701), TCPA counsel review (may route to specialist co-counsel per §4.3), FTC DisclosureBot counsel opinion, NYC LL-144 AEDT pre-use notice, NDA template.
- **Ongoing retainer (post-F&F, Month 3+): $500–$1,500/month** hour-banked or fractional-GC equivalent (~10 hours/month). Prefer to have this conversation after Phase A if the working relationship is good.
- **Year-1 combined target (counsel only, excludes insurance premiums): $8K–$25K.** See `counsel-engagement-plan.md` §Budget Summary for the cross-domain counsel envelope ($32K–$69K Year-1) which includes IP / securities / privacy / marketing/FTC specialists beyond what this RFQ covers.

### §8.6 Questions for the firm (please answer each in reply)

1. **Flat-fee vs hourly:** for each of the six Phase A deliverables, can you quote a flat fee? If no, the hourly rate and estimated hours per deliverable (partner vs associate split).
2. **Startup-stage experience:** how many seed-stage Delaware C-corps did your firm form in calendar 2025? Of those, how many were creator-economy or AI-vertical companies? Two named references we can contact would be ideal (by permission).
3. **Fractional-GC option:** does your firm offer a fractional-GC product, or do you partner with one (Rally, Outlaw, PilotLegal, Priori-on-retainer)?
4. **Turnaround time:** for a standard Delaware formation + founders-package, what is your kickoff-to-signatures turnaround? We need Phase A fully closed by 2026-05-04 — can you meet this if engagement-letter signs Week 1?
5. **Conflict check:** any conflicts with Shopify, Square, Stripe, Toast, Yelp, Meta, TikTok, Whalar, Patreon, Substack, or Cameo? Any YC-backed creator-monetization platforms in your portfolio?
6. **Deferred billing:** can any portion of Phase B+C billables defer to F&F close (Week 8) or Series Seed close (Month 12)? If yes, what deferral-fee or interest applies?
7. **Malpractice insurance:** please state your firm's malpractice policy limits; we archive this in the engagement file. (A green-flag firm volunteers this without being asked.)

### §8.7 Close

> Please respond by **2026-04-30** with quote, questions-answered, and any proposed modifications to scope. We will select one firm and sign the engagement letter the week of 2026-05-04. We appreciate the speed; the 14-day sprint does not allow for a long intake cycle. A 20-minute intro call any afternoon the week of 2026-04-27 is available on request.
>
> Regards,
> Jiaming Wang
> Founder, Push, Inc.
> wangjiamingaas@gmail.com

### §8.8 Attachments (three files, ~60 pages combined)

1. [`docs/legal/corporate-hygiene-checklist.md`](../legal/corporate-hygiene-checklist.md) — operational checklist of what the engagement must close.
2. [`docs/legal/counsel-engagement-plan.md`](../legal/counsel-engagement-plan.md) — counsel TYPES + sequencing across all seven domains.
3. This spec (`docs/spec/legal-budget-v1.md`) — deliverable-level scoping + phasing + budget.

### §8.9 Send-list (three firms in parallel, not sequential)

- **Full-service firm:** Gunderson Dettmer OR Cooley OR Perkins Coie (pick one based on who answered friendliest at the last NYC VC mixer; prefer Gunderson if cold). Expect highest quote but best bench for Series Seed path.
- **Fractional-GC:** Rally Legal OR Outlaw (Filevine) OR PilotLegal. Expect lowest quote but retainer lock-in; best for ongoing work post-F&F.
- **Marketplace:** Priori Legal OR Lawtrades. Expect cheapest per-task pricing; worst fit for Series Seed retention but good backup for NDA / pilot-LOI one-offs.

Three quotes in hand by 2026-04-30 → §9 scorecard run → engagement-letter signed by 2026-05-03.

---

## §9. Negotiation Playbook (how to evaluate 3 firm quotes)

### §9.1 Flat-fee vs hourly scorecard

Sort every Phase A/B/C deliverable into one of two buckets before the quotes arrive. Push the firm hard on commoditized items; accept hourly on bespoke items.

**Commoditized (insist on flat fee):**
- Delaware C-Corp formation + bylaws + initial consents + EIN + registered agent (industry-standard $500–$1,500 flat)
- Founder Restricted Stock Purchase Agreements ×3 with 4-year/1-year-cliff (industry-standard $300–$800 flat, often bundled with formation)
- CIIAA template review + execution (~$500–$800 bundled)
- YC post-money SAFE review (~$200–$500 flat; this is a 30-minute read for a securities associate)
- NDA mutual template (~$100–$300 flat)
- Advisor Agreement template adaptation from YC FAST (~$300–$500 flat)

**Bespoke (hourly acceptable; insist on not-to-exceed cap):**
- TCPA opinion letter (specialist counsel; 2–4 hours at $500–$700/hr; cap at $1,500)
- Rule 701 compliance memo for T5/T6 creator RSA (novel consultant-vs-employee analysis per `securities-pre-analysis.md` §Rule 701 analysis; 4–8 hours at $700–$1,000/hr; cap at $4,000)
- FTC DisclosureBot opinion letter (AI-mediated disclosure is novel territory per `disclosurebot-v0.md` §8.1; 4–8 hours at $450–$600/hr; cap at $4,800)
- NYC LL-144 AEDT pre-use notice + bias-audit plan (NYC-specialist counsel; 3–6 hours at $500–$700/hr; cap at $1,500)
- Negotiated pilot contract (per-deal; budget $500–$1,500 per contract with cap)

**Scoring rule:** any firm that refuses a flat fee on items in the commoditized bucket loses 20 points on the Appendix A scorecard. Any firm that insists on flat fee for items in the bespoke bucket is either underscoping (red flag) or planning to write a short, unhelpful memo (red flag).

### §9.2 Retention strategy — the Series Seed lens

Pick the firm that will be Push's Series Seed firm. Seed-stage pricing ($5K–$10K formation package at Cooley / Gunderson / Perkins) is 30–50% below Series-A-stage pricing from the same firm; locking in the relationship now means you pay 2026 rates on 2027 work. Framework for each quote:

- **Would this firm still accept us as a Series Seed client** (Month 12+) at a $1M–$3M raise? If yes, they are a Tier-1 candidate. If they only want pre-seed and push us to a boutique at Series A, they are a commodity vendor — fine for formation, not a strategic partner.
- **Does the firm have a seed-native practice group?** "Seed-native" means ≥20 seed companies formed in the prior 12 months with formation-package pricing. Gunderson and Cooley clearly do; Wilson Sonsini traditionally does but with slower turnaround.
- **Securities bench for Series Seed:** a firm that will do formation but lateral-refer us on Reg D / Form D for Series Seed is two relationships, not one. Prefer the firm that can do both.
- **Partnering against us in Series A diligence:** ask each firm's engagement partner, *"If the lead investor we approach for Series A has you as their firm, how does that conflict get resolved?"* Firms with a strong response here (typically "we run a conflict check at term sheet, disclose, and you can waive or we lateral-refer") are mature operators.

### §9.3 Red flags (disqualify or heavily discount)

1. **Unwilling to give flat fees for Phase A commoditized items.** This signals either the firm is not seed-native (treats every matter as bespoke + pads the estimate) OR the firm plans to over-associate the work. Hard no.
2. **No startup-stage experience.** Firm cannot name 3 recent seed-stage Delaware formations they did in the prior 12 months, OR the named companies are all $10M+ raises, OR the engagement partner has never done a founders-package before. Hard no.
3. **No malpractice insurance stated on the firm website or in response to §8.6 question 7.** Any firm big enough to take on a tech startup carries $5M+ malpractice; if they dodge the question, they don't carry it or their policy has a stigma claim. Hard no.
4. **Partner-level billed but junior does the work.** Red flag if the engagement partner's name on the engagement letter is a 20-year partner but the work-product comes back signed by a first-year associate without partner review. Mitigation: ask explicitly during intake, *"Who is the primary drafter on each deliverable, and who reviews before it ships to us?"* A green firm answers without hedging; a red firm gets evasive.
5. **Quotes arrive >10 business days after RFQ sent.** Firm's intake is slow → firm's work-product delivery is slow. Do not engage; the Phase A 14-day clock cannot absorb this.
6. **No startup-stage discount program named.** Some firms (Cooley GO, Gunderson Early Stage, Perkins Coie Seed Program, Fenwick Flex) publish seed-stage packages publicly. A firm without a named program at seed stage is billing at full Series A rates.
7. **Engagement letter ambiguous on scope or fee cap.** Every engagement letter must name the deliverable list, the fee (flat or hourly + cap), and the out-of-scope boundaries. Ambiguity is a billing-dispute factory.
8. **Counsel wants to start from a blank page when we have a template.** For items where we supply a template (CIIAA, advisor agreement, pilot LOI), counsel should redline, not rewrite. A firm that insists on starting from scratch is billing 2x what the work needs.

### §9.4 Green flags (prefer / accept)

1. **Published seed-stage discount program.** Cooley GO, Gunderson Early Stage, Fenwick Flex, Perkins Coie Seed — these are named programs with fixed-fee packages and deferred-billing windows to Series Seed close.
2. **Written scope before engagement.** Firm sends a written scope-of-work document (not just an email) with fee breakdown + deliverable list + milestone dates BEFORE the engagement letter is signed. This is how professional shops operate.
3. **References from 2–3 local seed-stage companies.** Firm volunteers (with permission) 2–3 NYC or SF seed-stage founders we can call. Reference calls are the single highest-signal diligence step; skip at your own cost.
4. **Partner-level communication responsiveness.** Engagement partner replies to the RFQ personally within 2 business days (not an intake paralegal). Signals the partner actually wants the book of business.
5. **Deferred-billing option available.** Firm willing to defer 20–40% of Phase B/C billables to F&F close (Week 8) or Series Seed (Month 12). This is a strong signal the firm sees a long-term relationship and is willing to finance early work.
6. **Conflict-check response is specific, not boilerplate.** Firm runs the conflict check against our §8.6 list and replies with either "clean" OR "conflict with [specific company] — we can waive if you agree" — not a generic "we will run conflicts at engagement."
7. **Counsel asks Push questions back.** A mature firm reads the attachments and replies with 3–5 smart questions of their own (e.g., "How is T5/T6 creator equity structured relative to the employee option pool?" or "Has Push registered with The Campaign Registry yet given the Week 7 SMS launch target?"). Silence or surface-level questions signal the firm didn't read the attachments.

### §9.5 The 30-minute founder check

After the first intro call with each firm, before reading the written quote, ask yourself: **"Can I quote this firm's engagement process back in 3 sentences to Prum and Milly right now?"** If the answer is no — if the firm's process feels fuzzy, or the pricing model requires a second read to understand, or the turnaround times are vague — the firm is not communicating clearly. Counsel communication quality compounds: a firm that is vague at intake will be vague at delivery, and billing disputes follow. If three sentences don't come out cleanly, either get back on a call for clarification OR move the firm from Tier-1 to Tier-2 and weight the other quotes heavier.

Example clean 3-sentence summary of a hypothetical Gunderson quote: *"Gunderson offers a $4,500 flat-fee seed package covering Delaware formation, founders RSAs with CIIAAs, SAFE review, and the advisor agreement. Kickoff on engagement-letter sign, signatures in 10 business days. Phase B+C are separately scoped per deliverable with a 10-hour/month retainer at $3,500/month available Month 3+ against a not-to-exceed cap."*

If a firm's quote cannot be summarized this cleanly, it is over-engineered.

---

## §10. Detailed Line-Item Expansion (for 3 top-risk items)

Three line items from §1 get deep-dived here because (a) they carry the highest counsel cost range or (b) they are legally novel — an investor diligence team will read §10 as proof that Push has thought through the hard items, not just estimated cheap ones.

Deep-dives: **#6 Privacy Policy (CCPA/CPRA)**, **#10 Standard Creator RSA (T5/T6)**, **#16 E&O Insurance**.

### §10.1 Line item #6 — Privacy Policy (CCPA/CPRA)

**Source row:** §1 line #6, deadline "Before paid-ad traffic OR data collection at scale," estimated $100–$500 (TermsFeed DIY) or $1,500–$3,000 (counsel-drafted).

**What's in scope (v1, US-only, Push stage):**

- **Notice-at-collection** (Cal. Civ. Code §1798.100(a)): every consumer-facing page collecting PII (phone, email, name, address, IP, user-agent, device ID) surfaces a link to the Privacy Policy before collection; the policy enumerates categories of PI collected + business purposes + third-party sharing.
- **Right-to-know** (§1798.110): routed to `privacy@push.nyc`, 45-day response target per §1798.130(a)(2); requires identity-verification step to prevent SSN-style fraud; output format must include the categories + specific pieces of PI + sources + business purposes + third-parties.
- **Right-to-delete** (§1798.105): same routing, same 45-day window; §1798.105(d)(1) compliance-records exception already invoked in our `sms-compliance-v1.md §4.5` for TCPA consent records (phone hash retained, no marketing association).
- **Right-to-correct** (§1798.106, added by CPRA): 45-day response; technical implementation is trivial (form input + admin review) but the policy must describe it.
- **Sale/sharing opt-out** (§1798.120): Push does not sell or share PI today; policy states so and provides a do-not-sell link as a forward-compatible surface. If any future ad-tech integration changes this, the policy and the opt-out mechanism require a same-day update.
- **Cookie consent** (per register row #25): runtime banner is CCPA/CPRA and GDPR-ready-default. Gated via a cookie-preference center.
- **Subprocessor disclosure** (register row #20): Supabase, Stripe, Vercel, Twilio, plus any analytics (Posthog / Plausible if added), CRM, and email-send tools. DPAs in place before the policy references them.

**What's explicitly excluded from v1 scope (documented as deferred):**

- **GDPR** (Regulation (EU) 2016/679). Push is US-only through Year 1. Full GDPR compliance counsel work runs $10K–$25K; we defer until EU market-entry decision. The privacy policy carries a "GDPR-ready scaffold" comment in the template but does NOT claim GDPR compliance publicly.
- **HIPAA** (45 CFR §§160–164). Push does not process PHI (no healthcare merchants in pilot cohort; if a healthcare merchant is onboarded in Phase D, same-day counsel review of business-associate-agreement requirement).
- **COPPA** (15 U.S.C. §§6501–6506). Push's age-gate requires all users to attest 18+; enforced at signup + Terms-of-Service acceptance. Counsel confirmation required that age-gate + ToS clause is sufficient mitigation without full COPPA compliance; if any creator or consumer is plausibly under 13, Push must immediately restrict access + notify counsel.
- **Biometric privacy statutes** (e.g., Illinois BIPA, Texas CUBI, Washington HB 1493). Push does not collect biometric identifiers today (no face-ID, no fingerprints, no voiceprints). If DisclosureBot v1.2 adds image-overlay OCR per `disclosurebot-v0.md §7.2`, biometric-privacy counsel review required before launch.

**DIY vs counsel economics:**

- **TermsFeed template + DIY: $100–$500/year.** Acceptable for v0 if Push does not claim regulatory compliance publicly and has very low PII volume. Template output is attorney-reviewed but not tailored. Single biggest risk: template says "sell/share" language that doesn't match Push's model → misleading, creates FTC §5 exposure per register row #1. Mitigation: Jiaming reads every section before publishing and flags ambiguity for counsel.
- **TermsFeed + counsel review: $600–$1,000 total.** Generate with TermsFeed (~$200), then $500 counsel review (1–2 hours at $500/hr). Counsel reviews the generated output, redlines per Push's actual practice, signs off for publication. **This is our Phase B default path** per §3.
- **Counsel-drafted from scratch: $1,500–$3,000.** Highest quality, longest turnaround (5–10 business days). Recommended for Phase C upgrade once Push has >5,000 users and is in Series Seed diligence.

**Phase B recommended path:** TermsFeed-generated draft + counsel review = **$600–$1,000 total** (well inside the §3 Phase B $1,400–$3,800 envelope).

**Phase C upgrade path:** counsel-drafted v2 timed to Series Seed due-diligence (Month 10–12) = **$1,500–$3,000** incremental, deferred to Series Seed proceeds.

**Cross-reference:** [`sms-compliance-v1.md §4`](./sms-compliance-v1.md) specifies the SMS-consent-record retention rules that the Privacy Policy must cross-reference. [`corporate-hygiene-checklist.md §5.9`](../legal/corporate-hygiene-checklist.md) tracks publication status. Register row #24 closes when the privacy-policy page is live on push.nyc.

### §10.2 Line item #10 — Standard Creator RSA (T5/T6)

**Source row:** §1 line #10, deadline "Before first T5 Ruby promotion under Rule 701 analysis," estimated $500–$1,000 first template + $500 per-instance unique terms.

**Anchored on the pre-analysis:** [`securities-pre-analysis.md §Rule 701 analysis`](../v5_2_status/investor-prep/securities-pre-analysis.md) flags this as the novel counsel question on Push's cap table. T5/T6 creators earn equity grants (0.02% RSA at T5, 0.05–0.2% RSA at T6) that trigger Rule 701 compliance analysis under 17 CFR §230.701. The consultant-vs-employee question is not a settled area of law for platform-creator equity.

**Three separate billable items (do not bundle these without explicit counsel confirmation):**

**A. Rule 701 + 701(c)(1) consultant-status memo (one-time).** Securities specialist counsel — Gunderson Dettmer, Cooley Securities, or Fenwick. Scope: (i) formal analysis of T5/T6 creator status as "consultant" under §230.701(c)(1); (ii) volume-cap analysis against the $1M / 15%-of-assets / 15%-of-outstanding ceilings; (iii) written opinion letter that Push can cite in Series Seed diligence. **Estimate: $2,000–$4,000** (4–8 hours at $500–$900/hr partner rate). This is the item a lead investor's counsel will re-review before term sheet — getting it right once at seed pricing is 2–3× cheaper than redoing at Series A.

**B. RSA template for T5 first grant (one-time).** Counsel adapts a standard Delaware RSA template (same base form as founders' RSA in §1 row #1) with T5-specific terms: 0.02% FD, 4-year vest, 1-year cliff, §83(b) election mechanics, right-of-first-refusal, drag-along. **Estimate: $500–$1,000** (2–3 hours at $400–$500/hr associate rate) if counsel has the Rule 701 memo in hand. Without the memo, the template cost bumps to $1,500–$2,500 because counsel is doing the 701 analysis inline.

**C. Per-instance negotiation (variable).** For the first 1–3 T5 grants, expect minimal negotiation — Push standardizes the terms and the creator either signs or declines. Per-instance cost: **$500 minimum** (counsel review of creator's signed copy + board consent + 409A plug-in). Materially negotiated terms (custom vest schedule, accelerated cliff, early liquidity put) bump per-instance cost to **$1,500–$2,500**. Push's policy (from §1 row #10 + App C Red-Flag #3): **standard terms only; any deviation requires Jiaming sign-off before counsel engages on bespoke drafting.**

**Anchor firms + alternate:**

- **Primary:** Gunderson Dettmer Securities practice — seed-native, done this analysis repeatedly for creator platforms (Cameo, Patreon analogs). Estimated $2K–$4K for memo + $500–$1,000 template.
- **Alternate:** Cooley Securities — slightly higher rates, strongest bench on novel-structure work. Estimated $3K–$5K for memo + $700–$1,200 template.
- **Do not use marketplace or fractional-GC** for this item. Per §4.3: securities work is specialization-sensitive; the fee differential is small ($500–$1,000) but the defense-posture differential at Series A is material.

**Total Line Item #10 envelope: $3,000–$6,500 first-year** (memo + template + 2–3 instances). This maps to §3 Phase C total $2,400–$6,500 — note that Phase C includes TCPA, FTC, AEDT, NDA as well; Line Item #10 alone consumes 40–70% of Phase C budget, which is why the phase budget range is wide.

**Red flag to avoid:** do NOT issue the first T5 grant before counsel memo is in hand and 409A is engaged per `securities-pre-analysis.md §409A valuation`. An RSA grant without a valid 409A exposes the recipient to immediate income tax + 20% federal penalty (per IRC §409A(a)(1)(B)). This is a personal-tax-exposure issue for the creator, not just a company-level compliance issue; a single botched grant can end a creator relationship.

**Cross-reference:** [`securities-pre-analysis.md`](../v5_2_status/investor-prep/securities-pre-analysis.md) §Open questions for securities counsel items 1–5 are the exact questions the §10.2(A) memo must answer.

### §10.3 Line item #16 — E&O Insurance

**Source row:** §1 line #16, deadline "Before v5.3 Week 10 OR before 50-merchant scale (whichever first)," estimated $3,000–$8,000 annual premium.

**Scope of coverage required:**

1. **DisclosureBot missed-disclosure liability.** Per [`disclosurebot-v0.md §8.3`](./disclosurebot-v0.md), E&O must cover the scenario where DisclosureBot rule-engine returns GREEN on a post that later draws FTC §5 enforcement. The liability is platform secondary-liability per CSGO Lotto / Warner Bros. precedent (see `disclosurebot-v0.md §1.2`). Policy must explicitly name AI-mediated-disclosure tooling as covered; do not accept policies that carve out "algorithmic decision-making" (a common 2024–2026 exclusion).

2. **ConversionOracle verification-error liability.** Push's core product attributes verified-customer events to creators via QR-code-based attribution. If the attribution system produces false positives (creator credited for walk-ins that were not creator-driven) or false negatives (creator uncredited for valid walk-ins), the merchant has a claim. Policy must cover verification-accuracy SLA breach. Typical coverage: per-event verification error up to $10K aggregate per merchant per month.

3. **Platform-general E&O.** Covers pilot-contract performance failures, data-processing errors, sub-processor outages (Supabase, Stripe, Vercel). Standard tech E&O covers this; confirm "cloud services failure" is not excluded (some older policies exclude).

**Typical carriers for AI-mediated platforms (2026 market):**

- **Hiscox** — traditional tech-E&O carrier; $1M/$1M coverage from $4,500/year; conservative underwriting on AI-mediated products; may add exclusion for "decisions produced solely by algorithm." Avoid unless broker negotiates exclusion out.
- **Chubb** — premium carrier; $1M/$1M from $6,000/year; strongest defense-cost coverage in market; flexibility on AI-mediated scope if founder can explain the rule-based nature of DisclosureBot v0 (note: v0 is deterministic rule-engine, not ML — this is easier to underwrite than v1 ML classifier).
- **Vouch Insurance** — startup-only; $1M/$1M from $3,500/year at pre-revenue stage; built their book on AI-vertical startups; often cheapest on our profile; check their renewal-rate-lock terms (some Vouch policies have 30% renewal premium jumps at first profitable year).
- **Embroker** — broker-as-insurer model; bundles D&O/E&O/Cyber with seed-stage pricing; $4,000–$7,000 for E&O alone; strong on streamlined application flow.

**Broker-mediated quote process (recommended):**

- **Embroker or Newfront** as broker (not direct-to-carrier). Brokers run a 3-carrier quote cycle typically in 7–10 business days. Fee: 10–15% of first-year premium, included in carrier's quoted price (you do not pay separately).
- Seed-stage AI company benchmark quotes (per `counsel-engagement-plan.md §Budget Summary` excluded-insurance bucket): **$3K–$8K annual.** Push's profile (pre-revenue, pre-PII-at-scale, rule-based DisclosureBot) should land at the low end.

**Coverage structure to request in RFQ:**

- **Per-claim limit:** $1M–$2M. Below $1M is under-insured for any merchant contract with indemnity language. Above $2M is over-insured at seed stage.
- **Aggregate limit:** $2M–$5M. 2× per-claim minimum; 5× is more defensible at Series A.
- **Deductible:** $5K–$10K self-insured retention (SIR). Below $5K premium spikes; above $10K exposes balance sheet unnecessarily.
- **Defense costs:** inside-limits OR outside-limits? Push should prefer **outside-limits defense** (defense costs do NOT erode the coverage cap) even at a 10% premium premium; class-action defense can consume $500K+ before any settlement.
- **Retroactive date:** match the policy incept date; do not accept a forward-only retro (common seed-stage trap).

**Known exclusions to negotiate against:**

- **Known-loss exclusion.** Standard clause: any incident known to Push before policy-binding date is NOT covered. Mitigation: bind the policy BEFORE any DisclosureBot v0 production launch, not after. This is the §1 row #16 deadline rationale — must bind before Week 10.
- **Intentional-act exclusion.** Standard clause: acts knowingly in violation of law are NOT covered. Not negotiable; coverage wouldn't exist if it were. Mitigation: Push does not operate above-the-law; counsel-approved disclosures only.
- **Pollution / nuclear / war exclusions.** Standard; not applicable to Push.
- **Employment-practices exclusion.** E&O typically excludes employment claims (these live under EPLI, separate coverage). Confirm the policy does not accidentally carve out the independent-contractor-creator scope as "employment."

**Budget recommendation:** target **$4,500–$6,000 Year-1 premium** at $1M/$2M per-claim, $2M/$5M aggregate, $5K SIR, outside-limits defense. Get 3 broker-mediated quotes; select based on exclusion breadth + renewal-terms + broker responsiveness. Bind by W10 (2026-06-29 → 2026-07-05) per §1 line #16 deadline.

**Cross-reference:** [`disclosurebot-v0.md §8.3`](./disclosurebot-v0.md) matches the $3K–$8K estimate. [`corporate-hygiene-checklist.md §4.3`](../legal/corporate-hygiene-checklist.md) tracks bind status.

---

## §11. Budget-vs-Risk Matrix (investor-defensible)

Every deliverable gets a 2-dimensional score: **Cost** (Low = <$500; Medium = $500–$2,000; High = >$2,000 including first-year insurance premium) × **Risk-if-unfunded** (Low = operational inconvenience; Medium = contract blocker or minor regulatory exposure; High = material statutory / enforcement / litigation exposure). Cell classifies priority as **Immediate** (fund now), **Near-term** (fund in Phase B/C from F&F proceeds), or **Deferred** (fund post-Series Seed).

| # | Deliverable | Cost | Risk-if-unfunded | Cell → Priority | Rationale |
|---|---|---|---|---|---|
| 1 | Founder RSA ×3 | Low | High | Immediate | Blocks every downstream equity grant; cheap |
| 2 | CIIAAs ×3 | Low | High | Immediate | Trade-secret posture + DD table stakes |
| 3 | SAFE template | Low | Medium | Near-term | YC template works; low counsel review cost |
| 4 | Delaware formation + NY foreign qual | Medium | High | Immediate | Nothing works without a date-stamped cert |
| 5 | 83(b) filings ×3 | Low | **High** | **Immediate** | 30-day statutory cliff; $30K–$100K tax exposure if missed |
| 6 | Privacy Policy (CCPA/CPRA) | Medium | Medium | Near-term | Blocks paid-ad traffic; TermsFeed-plus-counsel-review path keeps cost low |
| 7 | Terms of Service | Medium | Medium | Near-term | Blocks first merchant signing |
| 8 | FTC Disclosure Policy (company-side) | Low | High | Near-term | Direct FTC §5 exposure; counsel-drafted |
| 9 | Pilot LOI template + first contract | Medium | Medium | Near-term | Blocks first pilot merchant; template controls cost |
| 10 | Standard Creator RSA T5/T6 (Rule 701) | High | High | Phase C (near-term) | Novel consultant analysis; specialist required |
| 11 | Advisor Agreement (FAST adaptation) | Low | Medium | Near-term | Blocks ML Advisor close (Week 8) |
| 12 | TCPA review (opinion letter) | Medium | **High** | Phase C (near-term) | $500–$1,500 per violation, class-certifiable |
| 13 | FTC DisclosureBot opinion | Medium | High | Phase C (near-term) | AI-mediated disclosure is novel; platform 2° liability |
| 14 | NYC LL-144 AEDT pre-use notice | Medium | Medium | Phase C (near-term) | NYC penalties + reputation; manual rubric lower risk |
| 15 | NDA template (mutual) | Low | Low | Near-term | EFF template viable |
| 16 | E&O Insurance | High | High | Phase C (near-term) | Merchant indemnity + platform 2° liability; bind before scale |
| 17 | D&O Insurance | High | High | Deferred (Phase D) | Series Seed term-sheet gate; no board today |
| 18 | Cyber liability insurance | High | Medium | Deferred (Phase D) | PII at scale not today; defer until breach-response posture required |

**Matrix cell summary:**

| | Low-risk | Medium-risk | High-risk |
|---|---|---|---|
| **Low-cost** | #15 (Deferred — EFF template) | #3 (Near-term), #11 (Near-term) | #1 (Immediate), #2 (Immediate), #5 (Immediate), #8 (Near-term) |
| **Medium-cost** | — | #6 (Near-term), #7 (Near-term), #9 (Near-term), #14 (Near-term) | #4 (Immediate), #12 (Phase C), #13 (Phase C) |
| **High-cost** | — | #18 (Deferred) | #10 (Phase C), #16 (Phase C), #17 (Deferred) |

**Investor-defensible reading:** Immediate-priority items are all Low-cost + High-risk or Medium-cost + High-risk (items #1, #2, #4, #5, and #8) — Push has correctly prioritized the hygiene items with smallest $ exposure per unit of risk-closed. High-cost + High-risk items (#10, #16, #17) are sequenced: two in Phase C (#10, #16) funded from F&F, one deferred to Series Seed (#17) matching investor expectation. High-cost + Medium-risk (#18) is deferred correctly. The matrix has NO items in the Low-risk row funded Immediately — Push is not gold-plating low-risk work.

**Spending allocation logic:** of the §3 Phase A+B+C aggregate envelope ($4,600–$11,800), ~40% goes to Immediate-priority items (#1 + #2 + #4 + #5 + #8 ≈ $2,000–$4,500), ~35% to Near-term items (#3 + #6 + #7 + #9 + #11 + #14 + #15 ≈ $1,600–$4,000), and ~25% to Phase-C High-risk items (#10 + #12 + #13 + #16 ≈ $1,000–$3,300 counsel + $5,000 insurance premium). No item exceeds $6,000 in counsel spend; the insurance premium is the only line item >$3,000 single-spend, and it carries matching E&O value.

---

## §12. FAQ for Investor / Board

Ten questions a seed-stage diligence team will reasonably ask, with crisp answers that an analyst can quote into their memo.

### §12.1 "Why is legal so expensive for a pre-seed?"

**Answer.** It isn't, actually. Push's Phase A+B+C aggregate budget is **$4,600–$11,800** counsel (excluding insurance premiums) for a 10-week sprint covering formation + founders' package + privacy + ToS + TCPA + FTC + LL-144 + first RSA template. Peer benchmark for a seed-stage Delaware C-Corp with equivalent compliance surface (creator-economy + SMS + AI-mediated disclosure) runs $15K–$30K; Push's budget is 50–70% below peer because (a) we use Clerky / TermsFeed / EFF templates where low-risk permits, (b) founder does first-pass self-review on pilot contracts and NDAs, (c) specialists are engaged only where specialization saves money (TCPA, FTC, LL-144). See §11 matrix — 40% of spend goes to Immediate-priority High-risk items; 0% goes to Low-risk items.

### §12.2 "Can't you just use Clerky for everything?"

**Answer.** Clerky is exceptional for commoditized work: formation, founder RSAs, SAFE documents, board consents, cap-table management. Push uses Clerky for items §1 #1, #3, #4, #5, and archives every signed equity grant there (per `corporate-hygiene-checklist.md §6.2`). But Clerky does not substitute for counsel on: (a) TCPA opinion letters (§1 #12 — needs specialist counsel signature), (b) Rule 701 consultant-status memos for T5/T6 creators (§1 #10 — novel analysis, see `securities-pre-analysis.md`), (c) NYC LL-144 AEDT pre-use notice (§1 #14 — NYC-specific), (d) FTC DisclosureBot opinion (§1 #13 — AI-mediated disclosure is not in Clerky's template library). The rule: Clerky for commoditized + cap-table; counsel for opinion-letter + specialist + novel. This mix minimizes counsel cost without under-insuring risk.

### §12.3 "What's the risk if we defer SOC 2 beyond Q4 2026?"

**Answer.** Primarily a contract-blocker risk, not a statutory one. SOC 2 is not legally required; it is a commercial requirement for enterprise merchant contracts (chains of 10+ locations; any merchant with in-house procurement). Push's pilot cohort is independent NYC merchants who do not require SOC 2. Series Seed investors do not require SOC 2. Risk materializes at ~50-merchant scale when a chain merchant first asks for it; typical response is "SOC 2 Type I in engagement (target 2026-Q4)" which buys 9–12 months. SOC 2 audit-firm cost is $40K–$80K (out of §3 scope, budgeted under Phase D); deferring Q4 2026 → Q2 2027 is $40K–$80K of cash preserved without any pilot-phase impact. The actual risk is marketing-claim exposure (register row #1): `/security` page currently advertises SOC 2 Type II; we are rectifying that claim per P0 item register #1 BEFORE claiming any audit completion. The rectification is done; the deferral of the actual audit is low-impact.

### §12.4 "Why engage marketing/FTC counsel pre-pilot?"

**Answer.** Three reasons, in order of importance. (1) **Platform secondary liability** for creator non-disclosure is a documented FTC enforcement pattern (CSGO Lotto, Warner Bros., Lord & Taylor per `disclosurebot-v0.md §1.2`); building DisclosureBot v0 with written counsel opinion BEFORE first creator post ships is a fraction of the cost of defending a §5 enforcement action post-hoc ($1.8K–$4.8K counsel vs $50K–$500K defense). (2) **ConversionOracle precision-claim footnotes** (register row #2) are in external collateral already; FTC counsel confirms the "92% target at M-12" footnote language meets truth-in-advertising requirements (estimated $1K–$2K — see register §Counsel Engagement Plan row 2). (3) **Competitive-claim review** for any investor deck or press pitch referencing named competitors. Pre-pilot engagement is the cheapest window; post-pilot engagement under time pressure is 2–3× the cost.

### §12.5 "How does legal spend compare to peer startups at this stage?"

**Answer.** Peer benchmarks drawn from published seed-stage post-mortems (YC alumni blog posts; First Round Review) and `counsel-engagement-plan.md §Budget Summary` cross-domain envelope:

- **Low-end peer (B2B SaaS, single-state, no regulated surface):** $5K–$12K Year-1 counsel. Push sits above this because of TCPA + FTC + LL-144 + Rule 701 creator-equity novel work.
- **Median peer (creator-economy or consumer-platform, US-only, no EU):** $18K–$30K Year-1 counsel. Push's realistic target ($15K–$25K per §2) fits the low-middle of this band.
- **High-end peer (fintech / health / EU-facing):** $40K–$80K Year-1 counsel. Push is not here because we are US-only, not regulated under money-transmitter rules (Stripe intermediates per register row #30), and not processing PHI.

Cross-reference: `counsel-engagement-plan.md §Budget Summary` gives cross-domain envelope of **$32K–$69K Year-1** covering all seven counsel types (General Corporate + Employment + IP + Securities + Tax + Privacy + Marketing/FTC). The $4,600–$11,800 in this spec is counsel-hours only against deliverables; the broader $32K–$69K includes cross-domain work beyond formation (USPTO filings, Rule 701 memo, 409A, tax-nexus, DPAs) — see §13 for reconciliation.

### §12.6 "Why prioritize Phase A over product development?"

**Answer.** Phase A is 10–14 days of elapsed time and $800–$1,500 of spend; Phase A does not displace product development — it runs in parallel. The alternative (skipping Phase A) creates a term-sheet renegotiation risk at Series Seed: standard DD requires founders' CIIAAs + 83(b) filings + date-stamped Delaware cert, and failing to produce these forces a 2–4 week close delay with potential valuation concession (5–15% per our cap-table model). Phase A pays for itself 10–20× at any Series Seed close. Register row #6 calls this out explicitly as "critical gap" P0.

### §12.7 "What happens if the F&F round misses target — can you still close Phase A?"

**Answer.** Yes. Phase A ($800–$1,500) is founder-capital-only per §5; does not depend on F&F close. Jiaming has pre-committed the Phase A capital as a non-negotiable. If F&F misses target (raises <$50K), the cascading effects are: (a) Phase B partial completion via remaining founder capital (ToS + FTC disclosure prioritized; Privacy Policy deferred to TermsFeed DIY); (b) Phase C compressed — TCPA opinion letter still funded (because SMS launch hard-gates on it), but Creator RSA template deferred until first T5 eligibility emerges (typically 6–8 months in); (c) E&O insurance deferred past W10, accepting merchant-contract indemnity exposure until capital is available. Total compressed scenario: ~$3K–$5K Year-1 counsel spend instead of $15K–$25K. This is stress-scenario only; F&F target is tracked as a product-development blocker, not a legal-spend blocker.

### §12.8 "Will you use fractional-GC or law firm?"

**Answer.** Both, sequenced by phase. **Phase A:** full-service law firm (Cooley / Gunderson / Perkins Coie per §4.1) with a founders-package — one relationship, one set of conflicts, one firm that can follow us to Series Seed. **Phase B+:** introduce fractional-GC (Rally / Outlaw / Priori per §4.2) at $500–$1,500/month retainer for corporate + employment ongoing work. **Phase C specialists:** TCPA specialist (Kelley Drye or Ifrah Law), FTC/marketing specialist (Davis & Gilbert or Frankfurt Kurnit), NYC LL-144 employment specialist (Littler Mendelson or Jackson Lewis) — these are one-off engagements, not retainer. The rule per `counsel-engagement-plan.md §5`: do not retain fractional-GC before Phase B — the fixed monthly cost exceeds per-deliverable spend at Phase A volume. See also §9.2 — we prioritize the firm we want at Series Seed to lock in seed-pricing rates on the relationship.

### §12.9 "What's the exit-readiness story on legal hygiene?"

**Answer.** Exit-readiness is tracked in `corporate-hygiene-checklist.md` §6 Audit Trails + §7 Regulatory Readiness. At a Series Seed close, Push will have: (a) clean cap table with 409A, board consents for every grant, Rule 701 memo for creator RSAs, 83(b) filings archived; (b) Supabase / Stripe / Vercel DPAs executed; (c) Privacy Policy + ToS + FTC Disclosure Policy + NDA + Pilot LOI templates in DocSend or Carta Portal; (d) USPTO filings for "ConversionOracle" + "Vertical AI for Local Commerce" in docket (Phase D); (e) E&O + D&O policies bound with COIs on file; (f) SOC 2 Type I in engagement (Phase D). At Series A exit-readiness (Month 18–24), SOC 2 Type II completes and full DD package matches fund-quality diligence. The spending sequence in §3 is explicitly designed to hit Series Seed diligence in one cycle; no retroactive cleanup post-term-sheet. Register row #1 (SOC 2 marketing-claim rectification) is the single item that must close this week to maintain clean-exit narrative.

### §12.10 "Have you budgeted for IP litigation risk?"

**Answer.** Not in Phase A+B+C. IP litigation risk at seed stage is primarily (a) trademark-squatter preemption on "ConversionOracle" or "Vertical AI for Local Commerce" — mitigated by USPTO intent-to-use filings in Phase D ($1.5K–$2.5K per mark + USPTO fees, per §3 Phase D estimate and `counsel-engagement-plan.md §3 IP`); (b) creator IP-ownership disputes on campaign content — mitigated by Creator ToS § X ownership clauses (§1 row #18, register row #18); (c) trade-secret protection for ConversionOracle training corpus (register row #33) — mitigated by CIIAA coverage + departing-employee checklist, no litigation reserve needed pre-Series-Seed. Actual IP litigation (defending or prosecuting a TM infringement suit) costs $100K–$500K+; this is NOT budgeted at seed. It IS insured-against via D&O + E&O in Phase D (D&O covers defense costs for officer decisions; E&O covers platform-liability theories). If a C&D or TM-infringement notice arrives pre-Series-Seed, the §7 Escalation Triggers force same-week counsel engagement at $2K–$5K same-week retainer on top of the planned calendar — this is the contingency.

### §12.11 "How does Push's compliance posture compare on LL-144?"

**Answer (bonus FAQ).** NYC Local Law 144 governs "automated employment decision tools" used to make employment decisions for NYC-based candidates/employees. Push's Push Score (see `push-creator` skill §5.5) is the covered system; the advisor manual rubric (register row #11) is likely non-applicable because it's manual, not automated. Phase C Item #14 ($500–$1,500) engages NYC-specialist employment counsel (Littler Mendelson, Jackson Lewis, or Proskauer) for (a) pre-use notice drafting, (b) bias-audit plan drafting. Actual bias audit is a separate vendor engagement (BLDS, Parity, ORCAA) at $15K–$50K once Push has production data to audit (post-Month 6+; deferred to Phase D per Red-Flag #7). Phase C engagement is the PROCESS document required by LL-144 before first NYC creator onboarded at scale; the AUDIT itself runs post-Series-Seed.

---

## §13. Cross-Spec Dependencies

Every line item in §1 has upstream and downstream spec dependencies. This section makes them explicit so when one spec changes, the corresponding budget line is re-triaged.

### §13.1 P2-2 (TCPA / SMS compliance) → Line Item #12

- **Source:** [`sms-compliance-v1.md §6.2`](./sms-compliance-v1.md) — Outside TCPA Counsel Engagement.
- **Estimate match:** sms-compliance-v1 §6.2 quotes **$500–$1,500** single-issue TCPA specialist (2–4 hours); $2,000–$4,000 if bundled with privacy/CCPA counsel review. Line Item #12 in this spec quotes **$500–$1,500** opinion letter — **direct match** on single-issue scope.
- **Firm roster match:** sms-compliance-v1 §6.2 names Kelley Drye & Warren, Davis & Gilbert, Cooley, Ifrah Law, Klein Moynihan Turco. §4.3 of this spec cross-refers to Davis & Gilbert for marketing/FTC (which includes TCPA-adjacent work). Alternate co-engagement path: Kelley Drye for TCPA specialty + Davis & Gilbert for FTC — both at $500–$700/hr associate rate. Cooley is an option if bundling with Phase A formation work (no double-billing expected since TCPA is a distinct matter).
- **Dependency check:** if sms-compliance-v1 is revised to require additional opinion scope (e.g., Reassigned Number Database compliance — §6.2 Appendix D Q4), Line Item #12 inflates to $1,500–$3,000. Budget impact: +$0–$1,500 on Phase C total, absorbable in §3 envelope.

### §13.2 P2-4 (FTC / DisclosureBot) → Line Item #13

- **Source:** [`disclosurebot-v0.md §8.2`](./disclosurebot-v0.md) — Cost estimate.
- **Estimate match:** disclosurebot-v0 §8.2 quotes **$1.8K–$4.8K** single-issue FTC specialist (4–8 hr at $450–$600/hr); $3K–$8K if bundled with marketing-claim review (SOC 2 / ConversionOracle footnotes). Line Item #13 in this spec quotes **$500–$1,500** counsel review — **DISCREPANCY**: this spec's estimate is materially lower than disclosurebot-v0's.
- **Reconciliation:** this spec's §1 row #13 estimate ($500–$1,500) refers to a narrow counsel review of the rule-set + auto-append + consent signature, NOT the full §8.1 opinion letter scope in disclosurebot-v0. The full opinion letter is $1.8K–$4.8K per disclosurebot-v0. **Decision: raise Line Item #13 estimate to $1,800–$4,800 to match the source spec** — flagged for Wave 4 reconciliation (do not update line item here without re-running §3 Phase C math).
- **Firm roster match:** both specs name Davis & Gilbert, Frankfurt Kurnit Klein + Selz, Kelley Drye as candidate firms. Match confirmed.

### §13.3 P2-6 (Conversion assumption) → Pilot LOI Template (#9)

- **Source:** P2-6 is not a legal spec directly, but the pilot conversion gating language lives in the Pilot LOI template (§1 row #9).
- **Cross-reference:** Pilot LOI template must reflect W4 conversion gating language (e.g., "merchant's first-month-prorate gating per `push-pricing` §10"). If P2-6 revises the conversion model, the Pilot LOI template revises with it. Counsel engagement on Pilot LOI ($200–$500 template) is a one-time baseline; revisions are $200–$400 per materially-changed clause.
- **Dependency check:** any P2-6 change that introduces a new performance-warranty structure triggers a Pilot LOI template revision → counsel review → $300–$600 incremental. Currently not triggered; flagged in `push-pricing §10` open items.

### §13.4 Corporate hygiene checklist → Line Items #1, #2, #4, #5

- **Source:** [`corporate-hygiene-checklist.md`](../legal/corporate-hygiene-checklist.md) §1 Formation & Governance + §2 Cap Table & Equity + §3 Founders' Documents.
- **Mapping:**
  - Checklist §1.1–§1.8 (Certificate of Incorporation, bylaws, board consents, EIN, foreign qual, registered agent) → Line Item #4 (Delaware C-Corp formation + NY foreign qual) → $500–$1,500.
  - Checklist §2.2–§2.4 (founder stock issued, vesting, repurchase right) → Line Item #1 (Founder RSA ×3) → $300–$800 bundled.
  - Checklist §2.5 + §3.6 (83(b) election filed within 30 days) → Line Item #5 (83(b) filings ×3) → $0 + ~$50 certified mail.
  - Checklist §3.2–§3.4 (CIIAA signed by Jiaming / Prum / Milly) → Line Item #2 (CIIAAs ×3) → $500–$800.
- **Phase A closure gate:** per §7 of this spec, Phase A closes when checklist §1 + §3 all flip to [✓] per the table in §7. This is the authoritative closure signal; no other condition substitutes.

### §13.5 Counsel-engagement-plan.md → Year-1 envelope reconciliation

- **Source:** [`counsel-engagement-plan.md §Budget Summary`](../legal/counsel-engagement-plan.md) quotes **$32K–$69K Year-1** across seven counsel types (General Corporate, Employment, IP, Securities, Tax, Privacy, Marketing/FTC). Note this excludes 409A, SOC 2, D&O, E&O, Cyber premiums.
- **This spec §2 quotes:** Year-1 counsel **$8K–$30K+** (depending on scenario); Year-1 combined (counsel + insurance) **$11K–$50K+**.
- **Reconciliation gap:** counsel-engagement-plan's $32K–$69K includes items this spec defers to Phase D (USPTO trademark filings, full 409A engagement, tax-nexus memo, SOC 2 audit firm). This spec's §2 envelope is counsel-hours against deliverables in Phase A+B+C only. **The two numbers are not in conflict but are not directly comparable without the Phase D add-back.**
- **Wave 4 reconciliation action:** produce a side-by-side reconciliation table mapping every counsel-engagement-plan §Budget Summary row to this spec's §1 line items (or Phase D deferred). Confirm that the $32K–$69K and this spec's total-with-Phase-D ($50K–$100K per §3 Phase D estimate) are internally consistent. Expected outcome: this spec's Phase A+B+C + Phase D total **≈ counsel-engagement-plan's Year-1 envelope + IP filings + SOC 2 audit firm**. Any gap >$10K is an error; any gap <$10K is reconciliation noise (hourly-rate variance).
- **Responsibility:** Jiaming owns the reconciliation before the Wave 4 investor-facing rollup in `P1_rollup.md` §P2.

### §13.6 Materially-higher-than-founder-estimate items (explicit callout)

- **Line Item #13 (FTC DisclosureBot opinion)** — founder estimate $500–$1,500; source spec (disclosurebot-v0 §8.2) estimate $1,800–$4,800. **Discrepancy: $1,300–$3,300 underbudget in this spec.** Reason: the founder estimate in §1 row #13 was for a narrow counsel review, but the disclosurebot-v0 §8.1 opinion letter scope is materially broader (rule-set sufficiency + auto-append legality + consent-signature sufficiency + strict-mode carve-out). Wave 4 action: update §1 row #13 and §3 Phase C math.
- **Line Item #10 (Standard Creator RSA T5/T6)** — founder estimate $500–$1,000 first template; source spec (securities-pre-analysis §Rule 701 analysis) makes clear the 701 memo is $2,000–$4,000 separate from the template. Combined first-instance cost is $3,000–$6,500 as deep-dived in §10.2. **Not a discrepancy if template-only; IS a discrepancy if memo not separately budgeted.** Clarification needed in Wave 4; current Phase C envelope absorbs it.
- All other line items align with source spec estimates within ±20%; no further flagged discrepancies.

### §13.7 Forward dependencies (Wave 3 / Wave 4)

- **Wave 3 (product sprint):** no new legal-budget impact expected; revisit if sprint introduces new regulated surface (e.g., if Week 5 work adds fintech features triggering money-transmitter analysis per register row #30).
- **Wave 4 (investor-facing rollup):** reconciliation table per §13.5 produced; §12 FAQ answers validated by fractional-GC or engaged counsel before external use; budget refresh based on actual Phase A quotes from §8 RFQ cycle (expected 2026-05-03).
- **Post-F&F (Week 9+):** fractional-GC retainer kicks in; Phase B/C budget absorbs into retainer hours per §3 ongoing retainer. Budget pivot point: at Month 3, re-cost Phase C remaining items against hour-bank vs per-deliverable pricing.

---

*§§8–13 appended 2026-04-20 in Wave 2 pass to support counsel negotiation + investor defense. Does not supersede §§1–7; reference §§1–7 as the authoritative deliverable + phasing specification. Dollar figures in §§8–13 are cross-referenced to source specs and match where specs align; discrepancies flagged in §13.6 for Wave 4 reconciliation.*
