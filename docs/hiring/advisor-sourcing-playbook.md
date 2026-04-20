# Advisor Sourcing Playbook (v5.2 P1-2)

Operational playbook for the ML Advisor search. Pairs with [`ml_advisor_outreach_tracker.md`](./ml_advisor_outreach_tracker.md), [`inmail_drafts.md`](./inmail_drafts.md), and [`advisor-agreement-checklist.md`](./advisor-agreement-checklist.md). Advisor compensation instrument references [`docs/week-0/legal/equity/RSA_TEMPLATE.md`](../week-0/legal/equity/RSA_TEMPLATE.md).

**Owner:** Jiaming. **Audience:** founding team + counsel review. **Status:** v5.2-p1-2, 2026-04-20.

---

## §1 Ideal Candidate Profile (ICP)

### Experience bands (pick 1 primary)
- **Senior IC (7–12 yrs):** Staff/Principal ML at Google, Meta, Waymo, Cruise, DoorDash, Uber, Apple, Amazon, or a Series-B+ ML-native company. Shipped at least one production CV, OCR, or sensor-fusion system.
- **Research-to-production (10+ yrs):** PhD in CV / CS / ML with 5+ yrs industry tenure, peer-reviewed publications, at least one model in production.
- **ML-consulting founder (5+ yrs independent):** Has run 2–5 seed-stage advisor engagements, verifiable case studies.

### Must-haves (5)
1. Direct production experience with at least two of: CV, OCR, edge inference, geo/sensor fusion, marketplace matching.
2. Can commit 2–4 hours/week, including ≥1 synchronous 45-min review monthly.
3. Clean conflict profile: not an active employee/advisor at a direct competitor (see push-strategy §competition).
4. Comfort signing Y Combinator FAST (or equivalent) advisor agreement with IP assignment.
5. Residence/employment in a jurisdiction where we can paper the advisor agreement cleanly (US preferred; non-US accepted with counsel review).

### Nice-to-haves (5)
1. Prior advisor experience at a funded company (reference-checkable).
2. NY / SF / LA proximity for occasional in-person (NY preferred — Push HQ).
3. Network we can draw on for future ML hires.
4. Public artifacts (talks, blog, OSS) we can attribute in investor materials.
5. Second domain overlap: trust & safety, fraud, payments, marketplace operations.

### Red flags (5)
1. Signed advisor agreements at ≥4 companies concurrently — attention dilution.
2. Any current or former role at a direct competitor within 24 months.
3. Pending litigation, SEC enforcement, or regulatory action (do-not-contact until resolved).
4. Requests cash compensation or ≥1.0% equity — outside band; signals misread of advisor role.
5. Unwilling to sign IP assignment or non-solicitation — structural misalignment.

---

## §2 Sourcing Channels Ranked

Prioritise top-to-bottom; do not go deeper until you've exhausted the tier above.

| Rank | Channel | Expected response rate | Cost | Compliance notes |
|---|---|---|---|---|
| 1 | LinkedIn warm intro (mutual founder/VC/alum) | 40–60% | $0 | Disclosure: warm intro must not share confidential info that the target hasn't opted in to receive. |
| 2 | LinkedIn cold InMail (personalised) | 10–20% | LinkedIn Premium, ~$80/mo | NY LL-32 compensation range; personalization mandatory; opt-out sentence; max 5 InMails/day to avoid LinkedIn spam heuristics. |
| 3 | GitHub contributors to CV/OCR projects (issues, PRs on tesseract, EasyOCR, PaddleOCR, docTR, relevant Papers-With-Code repos) | 15–25% | $0 | GitHub email must be public or use the noreply routing with opt-in. Respect ToS — no scraping beyond public profile. |
| 4 | Advisor networks — NYU CDS, Stanford HAI, CMU MLD alum Slack / listservs | 20–30% | $0 / modest donation | Must follow each community's posting etiquette; many ban recruiter posts. Post as founder, not HR. |
| 5 | ML Slack communities — MLOps.community, Papers-We-Love, SF ML, vertical AI Slack | 8–15% | $0 | Re-read each community's rules — several ban DMs cold. Prefer posting in #job-board channel and inviting replies. |
| 6 | Twitter/X ML community (replies + DMs to active-thread participants) | 5–10% | $0 | Public DMs only if the target has DMs open; otherwise tweet-reply and ask permission to DM. Avoid DM-blast automation. |

### Disqualifying sources
- Paid advisor-as-a-service marketplaces (e.g., AdvisoryCloud, Clarity, PhDAdvisors) — quality floor too low for our ICP and we cannot match their cash model with equity.
- Resume databases (Indeed, ZipRecruiter) — wrong audience.
- Mass-blast tools (Apollo, Instantly) — violate CAN-SPAM + LinkedIn ToS for our scale.

---

## §3 Screening Rubric

Six dimensions, 1–5 scale. Threshold to advance past the qualification call: **average ≥ 4.0 with no single score ≤ 2**. Any single score of 1 is an automatic pass. Two independent scorers (Jiaming + one other founder/advisor) must agree within ±0.5 on the average.

| # | Dimension | 1 | 3 | 5 |
|---|---|---|---|---|
| 1 | Technical depth (CV/OCR/geo) | Knows terminology | Shipped one production system | Built and debugged 3+ production systems, can dive into failure modes |
| 2 | Vertical fit (local commerce, marketplace, attribution) | No relevant context | Has read the domain | Has operated in two-sided marketplace + attribution problems |
| 3 | Availability | <1 hr/wk | 2 hr/wk | 3–4 hr/wk guaranteed, plus ad hoc for crises |
| 4 | Comp alignment | Wants cash or >1% | Fits band but wants custom cliff | Accepts 0.25–0.5% FAST terms without renegotiation |
| 5 | Communication | Slow / unclear | Clear async, slow sync | Writes precise docs, explains trade-offs clearly, pushes back respectfully |
| 6 | Cultural add | Overlaps with existing team strengths | Neutral | Adds an underweight perspective (e.g., research rigor where we're product-heavy) |

Rubric file-of-record: append a completed rubric as comment rows in the tracker next to the candidate row.

### Evaluator bias checks
- Explicit: review each score against behavioural evidence, not generic impressions.
- Blind comparison: score each rubric dimension before discussing the candidate with the second evaluator.
- Reject halo: a strong single dimension cannot raise a 2 elsewhere.

---

## §4 Outreach Cadence

| Day | Action | Who | Artifact |
|---|---|---|---|
| Day 0 | Initial InMail (Variant A from `inmail_drafts.md`) | Jiaming | Tracker row: Sent Date set, status `sent` |
| Day 4 | Nudge (different angle; ref Variant B if Variant A sent initially) | Jiaming | Tracker row: note "nudged" |
| Day 10 | Last-chance message; explicitly offers 15-min slot + referral ask | Jiaming | Tracker row: note "last-chance sent" |
| Day 21 | Closed-lost: mark Outcome = `nonresponse`, archive copy to `docs/hiring/archive/` | Jiaming | Retention-until = Day 0 + 12 months |

Do not re-engage a closed-lost candidate for at least 6 months. After 6 months, a materially different outreach angle is required (new product milestone, funded round, new mutual).

---

## §5 Qualification Call Script (25 min total)

**Format:** Zoom/Google Meet with recording disclosure. Recording kept in private folder, retention per §8.

- **0:00 – 3:00 Context (3 min).** Jiaming: who is Push, v5.2 positioning, pre-pilot status, ConversionOracle architecture overview, why we're hiring an advisor now.
- **3:00 – 11:00 Their experience (8 min).** Ask open-ended: "Walk me through the most interesting CV/OCR (or geo-fusion) system you shipped. What broke in production?" Listen for depth, failure-mode intuition, humility.
- **11:00 – 19:00 Push moat discussion (8 min).** Open ConversionOracle threat model and creator-productivity-lock summary. Ask: "What would you try first? What would you refuse to do?" Score technical depth (rubric #1) and vertical fit (#2) here.
- **19:00 – 23:00 Compensation & logistics (4 min).** Re-state the band: 0.25–0.5% equity, 2-year vest, 6-month cliff, no cash, Y Confidential advisor agreement. Clarify time commitment (2–4 hrs/wk). Ask about conflicts, other advisor slots, geography.
- **23:00 – 25:00 Next steps (2 min).** Outline: references (≥2), conflict-of-interest disclosure, agreement drafted in Clerky. Commit to a decision window of ≤7 days from call.

### Must-cover topics (cannot end the call without)
- Compensation range stated out loud (NY LL-32 parallel-channel compliance — verbal counts).
- Conflict-of-interest check: "Are you an employee, advisor, or consultant to any of the following companies: {{list of direct competitors from push-strategy skill}}?"
- IP assignment expectation.
- Termination rights (either-side, 30-day notice).
- Advisor's existing portfolio count (want ≤3 concurrent).
- Decision timeline on both sides.

---

## §6 Negotiation Cheatsheet

### Equity band justification
- 0.25%: standard for FAST Level 1 ("occasional advice, light involvement"); use for 2 hrs/wk or less.
- 0.35–0.4%: midpoint for 3 hrs/wk with quarterly deep reviews; our default open.
- 0.5%: ceiling for "material involvement" — monthly review + ad-hoc calls + intro flow + public vouching.

Hard ceiling 0.5%. Anything above requires board consent + dilution analysis + written rationale. Never go above 1% for an advisor.

### Vest schedule flex
- Default 2-year monthly vest.
- Acceptable variations: 24-month linear with monthly milestones tied to deliverables (use sparingly — tax complexity).
- Do NOT accelerate the full grant on change-of-control; allow double-trigger only.

### Cliff flex
- Default 6-month cliff.
- Acceptable variations: 3-month cliff in exchange for a tighter scope and a mutual-termination clause. 12-month cliff only if the advisor requests more skin in the game.
- No zero-cliff grants — creates a short-timer incentive.

### IP assignment boilerplate
"Advisor assigns to Push, Inc. all right, title, and interest in any deliverables, code, designs, documents, or other work product created in the course of or relating to the advisory engagement. Pre-existing IP retained by Advisor is scheduled on Exhibit A." — final language in Y Combinator FAST Section 5; our `RSA_TEMPLATE.md` references the same clause.

### Non-compete considerations
- Federal guidance (FTC 2024 rule, partially enjoined) and NY State AB A1278 have narrowed non-compete enforceability. Do not include a non-compete clause; rely on:
  - IP assignment (above).
  - Confidentiality (mutual NDA, 24-month term).
  - 12-month non-solicit of Push employees, contractors, customers, and creators.
- Do not ask for a customer / industry non-compete.

### Termination rights
- Either party may terminate with 30 days' written notice.
- For cause termination: unvested shares forfeited, vested shares retained subject to repurchase right at FMV.
- Change-of-control: unvested shares accelerate only on double-trigger (acquisition + advisor offered no equivalent role).

---

## §7 Deal-breakers

Trigger immediate closure of the candidate (outcome = `disqualified`):
1. **Active competitor employment / advisorship** within past 24 months or currently active; check against push-strategy §competition list.
2. **Criminal history affecting fiduciary trust** — fraud, embezzlement, insider trading, SEC enforcement. Background check is a pre-signing requirement for any advisor with >0.3% equity.
3. **Unvested conflicting equity** — if advisor holds unvested equity in a competitor, the conflict survives the employment end date; decline.
4. **Inability to sign IP assignment** — structural mismatch; decline.
5. **Request for cash compensation** above a one-time $500 reimbursement for demonstrable expenses (travel, test hardware). We are pre-revenue; cash advisors are not our model.
6. **Active do-not-contact or pending litigation** involving Push or its officers.

Log any deal-breaker encounter in the tracker's `Response` column with a short note, and move the row to archive immediately.

---

## §8 Record Retention

Retention policy mirrors the tracker's `Retention Until` column and aligns with EEOC 29 CFR §1602 and general US employment-records guidance.

| Record type | Retention | Storage | Owner |
|---|---|---|---|
| Non-hire outreach records (message copy, response, rubric) | 12 months from last contact | `docs/hiring/archive/<YYYY-MM-DD>-<name>.md` | Jiaming |
| Hire / advisor-signed records (agreement, board consent, 83(b), background check) | 7 years from termination of advisory engagement | `docs/week-0/legal/equity/granted/<YYYY-MM-DD>-<name>.md` + Clerky vault | Jiaming + counsel |
| Qualification-call recordings | 90 days, then purge unless hired | Private folder, access limited to founding team | Jiaming |
| Do-not-contact list | Indefinite (honour opt-out forever unless retracted in writing) | `docs/hiring/do-not-contact.md` | Jiaming |

**Purge cadence:** monthly sweep on the first business day of each month. Any file past its retention date is archived to cold storage (encrypted zip) and deleted from active paths.

---

## Open items for Jiaming
- [ ] TODO: create `docs/hiring/do-not-contact.md` on first opt-out.
- [ ] TODO: confirm with counsel whether NYC Local Law 144 (automated employment decision tool) applies to advisor rubric (unlikely given manual scoring, but confirm).
- [ ] TODO: decide whether NY state is the default governing-law jurisdiction for the FAST advisor agreement (vs Delaware).
- [ ] TODO: seed list of "direct competitors" for conflict check — pull from push-strategy skill and paste into this file.
- [ ] TODO: insert Jiaming's Cal.com / Calendly link into both InMail variants before send.

*Playbook version: v5.2-p1-2 — 2026-04-20.*
