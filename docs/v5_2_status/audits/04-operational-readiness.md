# Audit 04 — Operational Readiness ("Monday-Morning Test")

**Audit owner:** Wave 2 QA (read-only pass)
**Status date:** 2026-04-20
**Branch:** `creator-workspace-v1`
**Target audience:** Founder + ops lead preparing for Week 0 kickoff

> **Mission.** Could a new ops hire, handed a laptop and read-only repo access on their first Monday, execute each P1 deliverable end-to-end from just the committed docs? "Executable" means no Slack pings required, no tribal knowledge, no "Jiaming will know" shortcut. Anywhere execution depends on information that isn't on disk → that's a gap.

This audit scans five workflows in scope for Wave 1 / P1 and scores each on a 12-point readiness rubric, then inventories every gap that blocks Monday-morning execution.

---

## §1 Executive Summary

**Overall readiness score: 46 / 100**

| Band | Meaning |
|---|---|
| 90–100 | Monday-morning executable end-to-end by a new hire. |
| 70–89 | Executable with ≤2 hrs of onboarding. |
| 50–69 | Executable with a senior shadow and named account logins. |
| 30–49 | Partially executable; key assets missing; 1–2 days of prep required. |
| 0–29 | Not executable; critical inputs absent. |

**Rubric rollup (per-workflow):**

| # | Workflow | Score (out of 12) | Band |
|---|---|---|---|
| WF-1 | Williamsburg pilot outreach | 5 / 12 | 30–49 |
| WF-2 | ML Advisor outreach | 7 / 12 | 50–69 |
| WF-3 | T1 creator dispute resolution | 5 / 12 | 30–49 |
| WF-4 | SLR monthly report | 5 / 12 | 30–49 |
| WF-5 | Investor first call | 6 / 12 | 30–49 |
| **Total** | | **28 / 60** | **47%** |

**Verdict.** Wave 1 P1 deliverables are well-documented at the *policy* level (what to do, why) but thinly specified at the *execution* level (which account, which URL, which signed contract). The strongest workflow is ML Advisor outreach (WF-2); the weakest are WF-1, WF-3, and WF-4, each of which requires artefacts not yet committed. Wave 1 is NOT Monday-morning executable by a new hire without named owners handing over ~12 hrs of setup material.

---

## §2 Readiness Rubric Per Workflow

**Dimensions (each scored 0 / 1 / 2):**

- **D1. Has owner** — is the single DRI named unambiguously in the doc?
- **D2. Has inputs** — are the input artefacts (lists, URLs, accounts, templates) committed or explicitly linked?
- **D3. Has decision logic** — is the "go/no-go / branch A vs B" rule written down?
- **D4. Has outputs** — does the doc specify the artefact produced + where it's filed?
- **D5. Has failure path** — is the escalation / retry path defined?
- **D6. Has escalation** — is the named person or channel for stuck cases specified?

Score key: **0 = absent**, **1 = partial / placeholder**, **2 = executable from doc alone**.

### Scorecard

| WF | D1 Owner | D2 Inputs | D3 Decision | D4 Outputs | D5 Failure | D6 Escalation | Sum |
|---|---|---|---|---|---|---|---|
| WF-1 Pilot outreach | 2 (Prum) | 0 (no shop list, no script) | 1 (Day-4 rule set; LOI-prob threshold vague) | 1 (log template present; LOI contract not) | 1 (walk-in + pivot, no QR activation) | 0 (no named counsel/founder on stuck cases) | **5** |
| WF-2 ML Advisor | 2 (Jiaming) | 1 (tracker present, no LinkedIn URLs, no Cal link, no FAST agreement PDF) | 2 (rubric + cadence) | 2 (tracker + archive + granted folder) | 1 (Day-10 / Day-14 escalations written, Upwork fallback) | 0 (no named counsel for conflicts) | **8** → downgraded to **7** on missing conflict-check list |
| WF-3 T1 dispute | 1 (ops lead, role vague) | 0 (no dispute UI, no $15 Stripe path, no Push Score entry point) | 2 (5-branch decision tree) | 0 (no ticket system, no output artefact defined) | 1 (Integrity review SLA defined, no runbook) | 1 (dispute review within 48h; no named person) | **5** |
| WF-4 SLR monthly | 1 (ops lead "until data analyst", vague) | 0 (time_logs table not built, role_category enum not defined) | 2 (targets + decomposition) | 1 (dashboard spec; no chart tool named) | 1 (playbook present; 2-month trigger → founder) | 0 (founder named but no data-team path) | **5** |
| WF-5 Investor call | 1 (Jiaming; no backup if he's unavailable) | 1 (Matrix 2 present, numbers in reconciliation; no deck, no data room) | 2 (Matrix 1/2/3/4 + trigger-response) | 1 (no CRM, no call-log template, no follow-up email template) | 1 (no "lost deal" path) | 0 (no counsel on-call for regulated-investor questions) | **6** |

Methodology: each dimension scored by ability to execute *from doc content alone*, without access to side-channels. A "1" means the doc references the asset but the asset isn't committed.

---

## §3 Gap Inventory

Gaps ordered first by workflow, then within workflow by severity. "Blocker?" = Y if the gap prevents Day-1 execution; N if it only degrades quality.

### WF-1 Williamsburg Pilot Outreach

| # | Gap | Blocker? | Proposed Resolution | Owner | Effort (hrs) |
|---|---|---|---|---|---|
| 1.1 | No actual 10-merchant list (name / address / owner / phone / IG handle) for zips 11249 / 11211 | **Y** | Prum builds seed list from Google Maps + Yelp; commit as `docs/week-0/pilot/williamsburg_target_list.md` | Prum | 4 |
| 1.2 | No sample cold-call / walk-in script tied to v5.2 messaging (merchant line from Matrix 1) | **Y** | Draft 90-sec script + 3 objection responses from `push-strategy` Matrix 2 Q4 (pilot→beachhead pricing objection) | Prum + Jiaming | 2 |
| 1.3 | No pilot LOI / pilot contract template — the outreach can succeed but no paper to sign | **Y** | Draft 1-page pilot LOI via Clerky template; gate C on 2026-04-22 | Counsel + Jiaming | 3 |
| 1.4 | No QR activation steps when a merchant says yes (which account creates the QR, which Stripe Connect onboarding flow, which signage) | **Y** | Write `docs/week-0/pilot/qr_activation_runbook.md`: (1) create merchant row in `merchants` table, (2) mint QR via admin endpoint, (3) print signage from `/admin/qr-print` | Ops lead + Eng | 4 |
| 1.5 | "LOI probability L/M/H" rubric undefined — what merchant signal = H vs M? | N | Add rubric rows to log template: H = verbal yes + follow-up scheduled; M = positive + asks for terms; L = lukewarm / must check with partner | Prum | 0.5 |
| 1.6 | No record of WHO on Push's side makes the Day-4 decision (go/no-go). Kickoff meeting lists "Jiaming + Prum" but silence on tiebreaker | N | Add explicit decision rule in log §Escalation: "Day-4 call held by Prum + Jiaming; tie → Jiaming decides" | Jiaming | 0.25 |
| 1.7 | No record-retention path for the outreach log (what happens after Day-4?) | N | Snapshot to `docs/week-0/pilot/archive/<YYYY-MM-DD>-outreach-log.md` and freeze | Prum | 0.25 |
| 1.8 | No do-not-contact list for merchants (we have one for hiring only) | N | Create `docs/week-0/pilot/merchant-dnc.md` with the 3–5 "local-influencer-burned" shops that rejected prior outreach | Prum | 0.5 |

**WF-1 subtotal: 8 gaps, 4 blockers.**

### WF-2 ML Advisor Outreach

| # | Gap | Blocker? | Proposed Resolution | Owner | Effort (hrs) |
|---|---|---|---|---|---|
| 2.1 | 15 actual LinkedIn URLs / emails not yet in tracker (all rows are `[ ]`) | **Y** | Jiaming builds list using playbook §1 ICP + §2 channels; target: 15 complete rows by Day 0 | Jiaming | 6 |
| 2.2 | No Cal.com / Calendly link in any InMail draft (placeholder called out in playbook TODO) | **Y** | Set up Cal.com page `cal.com/jiaming-push/advisor-intro` with 25-min slots, paste into both InMail variants | Jiaming | 0.75 |
| 2.3 | No signed YC FAST advisor agreement PDF committed — `RSA_TEMPLATE.md` is a markdown placeholder that explicitly says "NOT legally binding" | **Y** | Counsel drafts final FAST-based RSA via Clerky; file in `docs/week-0/legal/equity/granted/template-fast-v1.pdf` | Counsel + Jiaming | 3 |
| 2.4 | Clerky account setup: no evidence Push, Inc. has a Clerky admin account. Checklist §Execution assumes login works | **Y** | Confirm Clerky account + admin seats for Jiaming and counsel; capture screenshot of "Documents → New → RSA" path | Jiaming | 1 |
| 2.5 | No direct-competitor list for conflict pre-check — playbook TODO explicitly flags this | **Y** | Pull competitor list from push-strategy and commit as `docs/hiring/direct-competitor-list.md` | Jiaming | 1 |
| 2.6 | `docs/hiring/do-not-contact.md` doesn't exist (TODO flagged) | N | Create empty file with schema: name / email / opt-out-date / reason | Jiaming | 0.25 |
| 2.7 | Background-check vendor not selected (TODO: Checkr vs Certn) — blocks grants ≥0.3% | N (not blocker for outreach; blocker for signing) | Decide + open account; document in checklist | Jiaming + Counsel | 2 |
| 2.8 | No conflicts-of-interest disclosure form template | N | Counsel drafts 1-page COI disclosure; commit under `docs/week-0/legal/coi_template.md` | Counsel | 1 |
| 2.9 | "Board consent" referenced in checklist but no board consent template or named board secretary | N | Template + board secretary assignment (Jiaming interim) | Jiaming + Counsel | 1.5 |
| 2.10 | 409A valuation for FMV purchase price ($0.00001/share) not confirmed; checklist says "aligned to most recent 409A" — no 409A exists yet for a pre-seed company | N | Board resolution setting FMV at common-stock par; counsel confirm | Counsel | 2 |

**WF-2 subtotal: 10 gaps, 5 blockers.** (Strongest workflow — most gaps are named TODOs with owners.)

### WF-3 T1 Creator Dispute Resolution

| # | Gap | Blocker? | Proposed Resolution | Owner | Effort (hrs) |
|---|---|---|---|---|---|
| 3.1 | No dispute-review interface (web UI or even a ticket form) — the decision tree is policy, not tooling | **Y** | Ship MVP `/admin/disputes` page: list open disputes, show campaign evidence, radio buttons for 5 branches, submit → writes `dispute_resolutions` row + triggers Stripe payout | Eng (2 days work) | 16 |
| 3.2 | "Merchant QR offline >6 hr" — no monitoring job exists; we can't prove the QR was offline from committed data | **Y** | Build `qr_heartbeat` table + cron every 5 min; dispute UI surfaces continuous-downtime windows | Eng | 6 |
| 3.3 | No Stripe path for "$15 goodwill payment to T1 creator" — creator is not yet onboarded to Stripe Connect in Pilot phase per pricing §7 | **Y** | Pre-onboard T1 creators to Stripe Connect Express at signup (not at first payout) | Eng + Ops | 4 |
| 3.4 | "$25 retroactive bill to merchant" (Branch 1) — no Stripe subscription item / metered-billing plumbing for retro bills in Pilot phase | **Y** | Add `merchant_adjustments` ledger + monthly reconciliation; or defer "Beachhead+" clause and only apply branch 1 after Month 2 | Eng + Finance | 6 |
| 3.5 | Push Score entry point: decision tree prescribes –15 / –8 / –25, but the `scores` table update method is not documented anywhere in the repo | **Y** | Document `scripts/update-push-score.ts <creator_id> <delta> <reason>` + audit trail table | Eng | 2 |
| 3.6 | "Ops lead" named as owner but role title not defined in Week-0 kickoff (Prum is listed as pilot lead, not ops lead) | N | Kickoff meeting: confirm Prum = ops lead for dispute review OR hire a dedicated dispute analyst | Jiaming | 0.5 |
| 3.7 | "Integrity review within 5 business days" — no Integrity function exists yet | N | Interim: Jiaming + Prum rotate integrity reviews; document SLA clock start time | Jiaming | 1 |
| 3.8 | No creator-facing dispute response template (the creator who gets $0 + –15 score — what email do they get?) | N | Draft 3 canned emails: paid-$15, denied-$0, fraud-suspended | Milly + Counsel | 2 |
| 3.9 | "3 triggering events per year" anti-gaming cap — no counter exists in data model | N | Add `t1_guarantee_events` counter on `creators` table; decrement on Jan 1 | Eng | 1 |

**WF-3 subtotal: 9 gaps, 5 blockers.**

### WF-4 SLR Monthly Report

| # | Gap | Blocker? | Proposed Resolution | Owner | Effort (hrs) |
|---|---|---|---|---|---|
| 4.1 | `time_logs` table does not exist in the repo (grep confirms) — the authoritative SQL is un-runnable | **Y** | Ship `time_logs` Supabase table: `id`, `user_id`, `role_category`, `hours`, `logged_at`, `notes` + RLS policy | Eng | 3 |
| 4.2 | `role_category` enum not defined — SQL filters on `'ops','verification','onboarding','disputes'` but no CHECK constraint | **Y** | Add Postgres enum `role_category_enum`; migration file under `supabase/migrations/` | Eng | 0.5 |
| 4.3 | "Ops lead" data owner title is vague — Prum? Jiaming? Both? | N | Kickoff meeting names exact owner; update skill §6.x.1 | Jiaming | 0.25 |
| 4.4 | "Weekly Monday review" cadence referenced but no weekly report template | **Y** | Create `docs/templates/weekly-slr-report.md` with sections: SLR value, 4-lever decomp, week-over-week delta, commentary | Ops lead | 1.5 |
| 4.5 | "ConversionOracle Accuracy vs Target" chart references `precision` and `recall` but there's no evidence schema captures verified-vs-actual labels | **Y** | Add `verification_outcomes` table: `campaign_id`, `oracle_decision`, `human_decision`, `agreed (bool)`, `reviewed_at` | Eng | 3 |
| 4.6 | No dashboard tool selected (Metabase? Superset? Vercel analytics? spreadsheet?) | N | Decide tool; install; connect read-only role | Ops lead | 4 |
| 4.7 | "Month-6 ≥12" / "Month-12 ≥25" — no baseline snapshot yet (Month 1 is April 2026, zero campaigns live). Rule for handling zero-denominator is absent | N | Add rule: "If ops FTE = 0, SLR undefined; emit `n/a` with reason" | Ops lead | 0.25 |
| 4.8 | Escalation to founder at "SLR < 50% of target for 2 consecutive months" — no PagerDuty / alerting path | N | Add to weekly-report template: red-flag checkbox → Jiaming email within 24h | Ops lead | 0.5 |
| 4.9 | Competitor benchmark table (§6.x.3) labeled "Very Low" / "Low" confidence for 3 of 5 rows — potential investor-deck liability if quoted externally | N | Footnote "internal planning only; not for external citation" in every slide | Jiaming | 0.5 |
| 4.10 | No data dictionary for `campaigns.status` values — SQL filters on `'live','scheduled','verifying'` but the source-of-truth enum is undocumented | N | Add `docs/data-dictionary.md` with every enum used | Eng | 1 |

**WF-4 subtotal: 10 gaps, 3 blockers.**

### WF-5 Investor First Call

| # | Gap | Blocker? | Proposed Resolution | Owner | Effort (hrs) |
|---|---|---|---|---|---|
| 5.1 | No investor deck exists in repo — trigger-response playbook assumes one | **Y** | Draft 10–12 slide deck: problem, v5.2 positioning, ConversionOracle, SLR, unit economics, pilot plan, team, ask | Jiaming + Designer | 12 |
| 5.2 | No data-room URL / contents list (Dropbox? Notion? Drive folder?) | **Y** | Create read-only data room: cap table, incorporation docs, FTC-compliant landing, unit-economics xlsx, pilot plan | Jiaming | 4 |
| 5.3 | Financial model `xlsx` not present in repo — rollup §Executive Summary admits "SKILL.md markdown remains source of truth" | **Y** | Build single-sheet model from pricing §5 numbers; commit as `docs/finance/v5_2_unit_economics.xlsx` | Jiaming + CFO advisor | 6 |
| 5.4 | "Can Meta/Yelp copy this in 24 months?" — Matrix 2 answer cites ConversionOracle training data lock + Creator Productivity Lock, but no quantified comparison (e.g., "Meta would need 10k labeled events + 6-mo field partnerships") | N | Expand Matrix 2 Q7 to include quantified defense | Jiaming | 1 |
| 5.5 | No competitor battle cards by name (OpenTable, Yelp, Whalar, Meta Ads) | **Y** | Draft 1-pager per competitor: their model, our win line, data source for any number | Jiaming | 4 |
| 5.6 | No CRM / investor-pipeline log (Airtable? HubSpot? spreadsheet?) | N | Set up Airtable pipeline: stage, last-contact, next-action, notes | Jiaming | 1.5 |
| 5.7 | No call-log / follow-up-email templates | N | Template: Intro-call summary email; "here's the deck" email; "here's the data room" email | Jiaming | 2 |
| 5.8 | No "Jiaming is unavailable" backup — if he's on a plane the week a Tier-1 investor asks for a call, no named alternate | N | Designate Prum as ops-only backup for scheduling (not pitching); Milly for creator-story questions | Jiaming | 0.25 |
| 5.9 | "Traction? Pre-pilot." is honest but the unlock date (2026-Q2 W4) isn't clearly attached to any specific deliverable in the deck | N | Deck slide: explicit "Next milestone: 10-merchant verified walk-in results by 2026-06-12" | Jiaming | 0.5 |

**WF-5 subtotal: 9 gaps, 4 blockers.**

**Total gaps inventoried: 46. Total blockers: 21.**

---

## §4 Workflow-by-Workflow Deep Dive

### WF-1. Williamsburg Pilot Outreach (Prum, Week 0)

**Current state.** Outreach log template exists (`docs/week-0/pilot/williamsburg_outreach_log_TEMPLATE.md`) with 10 empty rows pre-populated with the target zip codes (11249, 11211). Kickoff meeting Gate C has the deadline 2026-04-23 EOD. Decision framework for Day 4 is sketched: # reached, # interested, top 3 candidates. Escalation rules present (walk-in block if <5 reached; sprint freeze if <3 interested).

**What a new hire would hit on Monday.** The log has a zip code but no actual shop name. To fill row 1, they'd need to open Google Maps, filter for coffee shops in 11249, cross-reference Yelp reviews (which is fine, they can do that), but then they hit a wall: they can't make an informed cold call because (a) no call script, (b) no pilot LOI to send on interest, (c) no idea what they'd do if a merchant says "yes, how do I start?" because the QR activation runbook doesn't exist. They'd Slack Jiaming asking "what's our offer?" and "who writes the LOI?" within 30 minutes.

**Monday-morning execution plan (with gaps filled):**

1. **Day 0 AM** — Prum pulls [list from `docs/week-0/pilot/williamsburg_target_list.md` (PLACEHOLDER — gap 1.1 closed)] of 15 shops (filter to 10 based on Coffee+ category fit).
2. **Day 0 PM** — Prum rehearses [90-sec cold-call script (PLACEHOLDER — gap 1.2 closed)] with Jiaming on Zoom.
3. **Day 1** — First 5 calls. For any "yes", Prum sends [1-page LOI (PLACEHOLDER — gap 1.3 closed)] via Clerky signature request.
4. **Day 1–3** — Calls + walk-ins. On signature: Prum triggers [QR activation runbook (PLACEHOLDER — gap 1.4 closed)] → merchant row created, QR minted, signage printed and delivered by Day 3.
5. **Day 4 EOD** — Prum + Jiaming review log. If # interested ≥3 → sprint proceeds. If <3 → pivot conversation scheduled for Day 7.

**Suggested immediate fix (if only 1 thing):** commit the 10-merchant seed list + 90-sec script. That unblocks the Day 0 start; contracts/LOI can land in parallel Day 1–2.

### WF-2. ML Advisor Outreach (Jiaming, Week 0–2)

**Current state.** Strongest of the five. Tracker (`docs/hiring/ml_advisor_outreach_tracker.md`) has 15 pre-labeled rows with priority bands (P0/P1/P2), InMail drafts (`inmail_drafts.md`) has 5 archetypes × 2 variants each = 10 personalization templates, compliance envelope is rigorous (NY LL-32 pay transparency, CAN-SPAM opt-out, LinkedIn ToS). Playbook (`advisor-sourcing-playbook.md`) has ICP, 6-channel ranked sourcing, screening rubric, cadence, qualification-call script, negotiation cheatsheet, deal-breakers, record retention. Pre-signing checklist (`advisor-agreement-checklist.md`) has 7 sections with ~30 checkpoints.

**What a new hire would hit on Monday.** They'd open the tracker, read the legend, and realize every row is `[ ]` — the actual targets haven't been identified. The InMail drafts reference `{{first_name}}`, `{{mutual}}`, and `{{product_name}}` placeholders but no Cal.com link. The RSA template is explicitly "NOT legally binding until executed via Clerky with counsel review" — so even if they got a yes, there's nothing to send.

**Monday-morning execution plan (with gaps filled):**

1. **Day 0 AM** — Jiaming populates 15 tracker rows with real LinkedIn URLs / emails, running each through [direct-competitor-list.md (PLACEHOLDER — gap 2.5 closed)] for conflict pre-check.
2. **Day 0 PM** — Jiaming creates [Cal.com link (PLACEHOLDER — gap 2.2 closed)] and pastes into Variant A and B.
3. **Day 4–6** — Personalization sweep; each of 10 drafts gets a paper / talk / shipped-product reference filled in.
4. **Day 7** — Batch send of 5 InMails + 5 emails (max 5 InMails/day per LinkedIn spam threshold). Compliance sign-off block in tracker checked by Jiaming.
5. **Day 8–10** — Response tracking.
6. **Day 10** — If 0 replies → open Upwork posting (escalation rule already doc'd).
7. **Day 14** — Ship criterion: ≥1 real conversation.
8. **Day 14–21** — If qualified: trigger [FAST advisor agreement via Clerky (PLACEHOLDER — gap 2.3 closed)] → counter-sign → cap table update → Carta.

**Suggested immediate fix:** Close gaps 2.1 + 2.2 + 2.3 (list + calendar + signed agreement PDF) simultaneously on Day 0. Without those three, Day 7 send is a non-starter.

### WF-3. T1 Creator Dispute Resolution (Ops lead, Week 1+)

**Current state.** Policy is crisp: the 5-branch decision tree in `push-creator` §2 covers every known failure mode (QR offline, creator no-show, creator performed but 0 scans, fraud, ambiguous). Financial math is solid: $15 payout, $0.30/verified-customer allocational reserve, 26.7% GM preserved. GAAP treatment documented. Creator-facing disclosure language is written verbatim for Creator Terms §X.

**What a new hire would hit on Monday.** The first real T1 dispute lands in their inbox (or Slack, or a creator emails support@push.com which may or may not exist). They open the dispute-review interface — except there isn't one. They'd need to: (a) manually read the campaign table in Supabase Studio to find the campaign, (b) decide which branch applies, (c) manually Stripe dashboard → send $15 → but wait, is the creator onboarded to Stripe Connect? Pilot creators per pricing §7 are paid "from Push F&F budget" — no Stripe rails. They'd need to Venmo the creator $15, which has no audit trail. Push Score update: they'd open `scripts/...` except there isn't one. They'd Slack Jiaming.

**Monday-morning execution plan (with gaps filled):**

1. **Dispute received** (email / Slack / web form) → auto-row created in [`/admin/disputes` queue (PLACEHOLDER — gap 3.1 closed)].
2. **Ops lead reviews** — surfaces [QR heartbeat history (PLACEHOLDER — gap 3.2 closed)] + creator posts + scan log.
3. **Ops lead applies decision tree** → selects branch → UI submits resolution.
4. **If branch 1 or 3 (pay $15)** → UI triggers Stripe Connect payout to creator's [pre-onboarded Stripe Connect Express account (PLACEHOLDER — gap 3.3 closed)] within 15 days SLA.
5. **If branch 1 (merchant fault)** → UI posts $25 to [`merchant_adjustments` ledger (PLACEHOLDER — gap 3.4 closed)] to bill on next invoice.
6. **If branch 2 or 4 (creator fault / fraud)** → UI runs [`update-push-score.ts` (PLACEHOLDER — gap 3.5 closed)] with delta –15 or –25.
7. **Ops lead sends** [canned creator email (PLACEHOLDER — gap 3.8 closed)] with resolution rationale.
8. **Branch 4 (fraud)** → Integrity review subqueue, 5-BD SLA.

**Suggested immediate fix:** Gap 3.1 (dispute UI MVP) is the single highest-leverage item — it forces 3.2, 3.3, 3.5 to get named + wired. A 2-day build by 1 eng unblocks every downstream case.

### WF-4. SLR Monthly Report (Data owner, Month 1 end)

**Current state.** Metric definition is authoritative: Active Campaigns / Ops FTE with precise definitions ("verifying" state counts 48h, ops FTE excludes advisors/eng/product/marketing unless doing ops). Targets are banded (M-6 ≥12 / M-12 ≥25 / M-24 ≥50). Decomposition identifies 4 levers with impact weights. Playbook covers per-lever remediation. Competitor benchmarks exist with confidence-flagged sources.

**What a new hire would hit on Monday.** April 30th approaches. The data owner (who?) opens the SQL in skill §6.x.1 and runs it against production Supabase. First error: `relation "time_logs" does not exist`. They look in `supabase/migrations/` — no `time_logs` migration. They can't log ops hours because the table doesn't exist. Even if they manually create it, the `role_category` values in the SQL WHERE clause are hardcoded strings with no enforcing enum. And "ops lead" as data owner is an unassigned role — Prum is pilot lead; Jiaming is founder. Who runs this?

**Monday-morning execution plan (with gaps filled):**

1. **Week 0** (one-time) — Eng ships [`time_logs` table + `role_category` enum (PLACEHOLDERS — gaps 4.1, 4.2 closed)] and a simple entry form for ops hours.
2. **Every day** (ops hours logged) — Prum + Milly + any contractor logs hours against a role_category.
3. **Every Monday** — Data owner (confirmed name per [kickoff meeting decision (PLACEHOLDER — gap 4.3 closed)]) runs SQL, fills [weekly SLR report template (PLACEHOLDER — gap 4.4 closed)], emails founder + team.
4. **Last business day of month** — Formal snapshot filed to `docs/v5_2_status/slr/<YYYY-MM>.md`.
5. **Dashboard** — Monthly trend chart via [chosen viz tool (PLACEHOLDER — gap 4.6 closed)].
6. **ConversionOracle accuracy** — Twin-line chart fed by [`verification_outcomes` table (PLACEHOLDER — gap 4.5 closed)].
7. **Below-target 2 consecutive months** → founder review escalation.

**Suggested immediate fix:** Gap 4.1 (ship `time_logs`). Without it the SQL is fantasy. Everything else can iterate after Month 1 baseline.

### WF-5. Investor First Call (Jiaming, any day)

**Current state.** Matrix 1 (audience × channel × line), Matrix 2 (7 objections → responses), Matrix 3 (positive proof for each "Push is NOT"), Matrix 4 (words we use vs avoid), plus Trigger-Response playbook for common questions ("Traction?" → "Pre-pilot…"). Numeric reconciliation file backs every quotable number to source + commit SHA.

**What a new hire would hit on Monday.** A VC emails: "Loved the landing; can we see the deck?" Jiaming isn't available for 24 hours. There's no deck committed. There's no data room URL. There's no backup person authorized to pitch. Even if Jiaming were available, he'd be assembling the deck live at 2am before the call. The financial model the deck needs to cite is markdown text in `push-pricing` §5, not an xlsx an investor can download.

**Monday-morning execution plan (with gaps filled):**

1. **Pre-call** — Jiaming sends [deck PDF + data room link (PLACEHOLDERS — gaps 5.1, 5.2 closed)] 24h before call.
2. **Call start** — Opening: Matrix 1 Investors line ("Outcome-priced AI for local; SLR ≥ 25 at Month 12; ConversionOracle + Creator Productivity Lock = moat.")
3. **Objection volley** — Use Matrix 2 responses verbatim for 7 known objections; for "Can Meta/Yelp copy this in 24 months?" use [expanded quantified defense (PLACEHOLDER — gap 5.4 closed)].
4. **Numbers cited** — All quoted from numeric reconciliation master table (unit economics, LTV/CAC, per-customer fees).
5. **Competitor question** — Pull [battle card for named competitor (PLACEHOLDER — gap 5.5 closed)].
6. **Traction question** — "Pre-pilot. First verified results 2026-06-12." Cite pilot plan slide.
7. **Post-call** — [Follow-up email template (PLACEHOLDER — gap 5.7 closed)] with deck, model, next-step link. Log in [CRM (PLACEHOLDER — gap 5.6 closed)].

**Suggested immediate fix:** Gaps 5.1 + 5.2 + 5.3 (deck + data room + xlsx model). These are the "can't send anything" assets. Battle cards and CRM can wait a week.

---

## §5 Top 10 Pre-Execution Blockers

Ranked by (blocker-severity × days-of-work-lost-if-missed). All blockers listed in §3 as "Y"; this is the prioritized cut.

| Rank | # | Workflow | Blocker | Owner | Effort (hrs) |
|---|---|---|---|---|---|
| 1 | 3.1 | WF-3 | No dispute-review interface (policy without tooling = Slack-driven ad hoc decisions) | Eng | 16 |
| 2 | 4.1 | WF-4 | `time_logs` table not built → SLR SQL un-runnable → no Month 1 baseline | Eng | 3 |
| 3 | 5.1 | WF-5 | No investor deck → can't respond to inbound VC request | Jiaming + Designer | 12 |
| 4 | 1.1 | WF-1 | No 10-merchant seed list → Prum can't start calls Day 0 | Prum | 4 |
| 5 | 1.3 | WF-1 | No pilot LOI template → interested merchants can't sign | Counsel + Jiaming | 3 |
| 6 | 1.4 | WF-1 | No QR activation runbook → signed merchant can't be launched | Ops + Eng | 4 |
| 7 | 2.3 | WF-2 | No signed FAST advisor agreement PDF → qualified advisor can't counter-sign | Counsel + Jiaming | 3 |
| 8 | 2.1 | WF-2 | 15 tracker rows are all empty `[ ]` → Day 7 batch send has nothing to send | Jiaming | 6 |
| 9 | 3.3 | WF-3 | T1 creators not onboarded to Stripe Connect in Pilot → $15 goodwill payout has no rails | Eng + Ops | 4 |
| 10 | 5.3 | WF-5 | No xlsx unit-economics model → investor asks "send your model" → markdown won't do | Jiaming + CFO advisor | 6 |

**Total effort to close Top 10: 61 hours ≈ 1.5 engineering-weeks + 1 founder-week + 1 counsel-day.** Parallelizable across 4–5 owners.

---

## §6 Recommended Week-0 Focus (If only 3 gaps can close this week)

The top 3 deliver the most leverage per hour and unblock the most downstream work.

### Pick 1: Gap 4.1 — Ship `time_logs` table + `role_category` enum (3 hrs eng)
- **Why:** The smallest dollar-and-time cost on this list. Unblocks WF-4 (SLR baseline by April 30) and enables the Monday cadence to start. Without it, v5.2's entire North Star is aspirational. With it, the first monthly number lands 2026-04-30 and sets the M-6 / M-12 / M-24 trajectory.
- **Dependency:** None. Eng can ship today.

### Pick 2: Gap 1.1 + 1.3 + 1.4 combined — "Pilot kit": seed list + LOI + QR runbook (11 hrs across Prum + Counsel + Eng)
- **Why:** These three gaps are a single logical bundle — each is necessary for the Week-0 pilot to finish by 2026-04-23 EOD per kickoff Gate C. Missing any one kills the sprint. Closing them together turns the outreach log from a template into a live instrument.
- **Dependency:** LOI needs counsel sign-off (parallelizable with list build and runbook draft).

### Pick 3: Gap 2.1 + 2.2 — ML Advisor list + Cal link (7 hrs Jiaming)
- **Why:** The P1-2 wave has a Day-7 ship clock. If Day 0 = Week 0 Monday, then by Friday Jiaming needs: 15 real LinkedIn URLs populated, Cal.com link live, and the first Variant-A InMail personalized. Without these two closures, the Day-7 batch becomes Day-14, cascading the Day-14 "≥1 real conversation" ship criterion into Week 3.
- **Dependency:** Competitor list (gap 2.5) should land in the same afternoon; it's a 1-hr copy-paste from `push-strategy`.

**Why NOT pick the investor deck (gap 5.1) this week?** It's higher effort (12 hrs) and has no external clock — an investor can wait a week for a deck and it actually signals competence. Pilot and advisor outreach have external clocks (Williamsburg shop availability, LinkedIn InMail cadence) that bind us.

**Why NOT pick the dispute UI (gap 3.1) this week?** It's the highest-ranked blocker but only triggers once a T1 dispute actually lands. Pilot doesn't start until Week 0 EOD at earliest; first dispute wouldn't be until Week 2–3. Week-0 focus should be on assets that unblock *this week's* external deadlines.

---

## §7 Methodology Notes & Limitations

- **Read-only scan.** No files modified. No git commands. No existing-infra verification beyond file-system reads.
- **Scoring is human-judgment, not automated.** The 12-point rubric per workflow is deliberate but subjective. A second reviewer could score ±1 per dimension.
- **"Monday-morning executable" is a high bar.** Many startups routinely operate at 30–49% on this rubric by tribal knowledge. The point of this audit is not that Push is broken, but that scaling past 2–3 people requires closing these gaps.
- **Effort estimates are planning-level** (±50%). Dispute UI could be 8 hrs or 24 hrs depending on reuse of `/admin/merchants` scaffolding.
- **Three gaps are interlocked with hiring**, not build**: 2.7 (background-check vendor), 2.10 (409A FMV), 5.8 (pitch backup). These can't close from a keyboard — they require decisions or external vendors.

---

*Audit version: v5.2-readiness-04 — 2026-04-20.*
*Filed under `docs/v5_2_status/audits/` per Wave 2 QA protocol. No existing files modified.*
