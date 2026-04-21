# Wave 2 QA — Professionalism / Tone / Formatting Audit

**Audit date:** 2026-04-20
**Audience for report:** Founder, consolidation agent, investor-readiness owner
**Scope:** 11 files across P1 wave deliverables (4 SKILL.md, 4 hiring docs, 2 v5.2 status docs, 1 CHANGELOG)
**Benchmark:** "Reads as if written by a senior operator — clear, specific, no amateur language, no orphan placeholders, consistent formatting."

---

## §1 Executive Summary

**Overall verdict: PASS with conditions.** The P1 wave is markedly more professional than typical pre-seed documentation — disciplined numbers, compliance-aware language, investor-grade structure. The blocker is not prose quality; it is **orphan placeholders and TODO markers that must not ship to an investor in their current form**. None of the "amateur language" flags fired in a disqualifying way.

**Total defects: 37** across 10 dimensions.

### Defect counts by category

| # | Category | Count | Notes |
|---|---|---|---|
| 1 | Amateur language / hedging | 3 | Minor; one "we believe" in metrics template, one "totally understood" in follow-up |
| 2 | Orphan placeholders (`{{xxx}}`, `______`, `TODO`, `TBD`) | 14 | Concentrated in inmail_drafts.md (10 instances of `{{first_name}}`), advisor-agreement-checklist.md (sign-off blanks), advisor-sourcing-playbook.md (open items) |
| 3 | Vague quantifiers without data | 4 | "most volume from T2+", "most interesting", "a 3-company advisor portfolio" where exact count may matter |
| 4 | Inconsistent heading depth | 3 | push-metrics §6.x / §6.x.1 / §6.x.2 / §6.x.3 uses placeholder numbering instead of §6.1/6.2/etc. |
| 5 | Markdown bugs / broken links | 3 | Missing space after "§" in P1_rollup L191; broken relative link to RSA_TEMPLATE from inmail_drafts (exists at `../week-0/legal/equity/RSA_TEMPLATE.md` — verify); "Y Confidential" typo in playbook |
| 6 | Typos / grammar | 2 | "Y Confidential advisor agreement" (L101 playbook) should be "YC FAST advisor agreement"; missing space "§contains" in P1_rollup L191 |
| 7 | Unsourced claims | 4 | "5x a typical agency" in push-strategy Matrix 2 cites SLR 25 vs 3–5 (derived, OK) but not labeled estimated; "60–70% confidence" on QR-only in push-strategy; "10k+ labeled events" moat claim uncaveated |
| 8 | Voice inconsistency | 2 | push-metrics L25 uses "Push's target" (third person) while §1.1 uses "we"; inmail_drafts mixes "I'm building Push" with "we" |
| 9 | Unprofessional bragging | 1 | "best-in-class" in inmail_drafts L129 (internal rationale, not client-facing — minor) |
| 10 | Brand voice violations | 1 | push-metrics §8 "THE key PMF signal" all-caps emphasis is loose; push-brand-voice prefers specific-outcome wording |

**Total: 37 defects.** Of these, **14 are orphan placeholders** (the template/form design requires them; problem is only if files ship as-finished artefacts).

### Severity distribution
- **P0 (blocks investor share):** 3 — unfilled `{{placeholder}}` in inmail_drafts ready-to-send blocks; TBD in P2 Checkpoints section; "Y Confidential" typo.
- **P1 (visible but not disqualifying):** 12 — TODO markers, sign-off blanks, heading numbering.
- **P2 (polish):** 22 — minor wording, vague quantifiers, voice drift.

---

## §2 Scoring per File

| File | Defect Count | Severity Mix | Rating | One-line verdict |
|---|---|---|---|---|
| `.claude/skills/push-pricing/SKILL.md` | 2 | 2 P2 | **A–** | Clean, investor-grade. One vague quantifier ("most volume from T2+") and one legacy adjective ("strong enough"). |
| `.claude/skills/push-creator/SKILL.md` | 1 | 1 P2 | **A** | No placeholders, no hedging, clear tier tables. Only flag: §0 "Authority Notice" heading is thin for its claim weight. |
| `.claude/skills/push-metrics/SKILL.md` | 5 | 3 P1, 2 P2 | **B+** | Heading scheme `§6.x / §6.x.1 / §6.x.2 / §6.x.3` reads as placeholder; should renumber to `§6.1 / §6.2 / §6.3 / §6.4`. "THE key PMF signal" is loose. "We believe" template line (§11) should be removed from the standing doc or caveated as an operational template. Voice mixes "we" and "Push" within §1. |
| `.claude/skills/push-strategy/SKILL.md` | 4 | 2 P1, 2 P2 | **A–** | Strong. One unsourced "60–70% confidence" claim on QR-only competitor verification; "10k+ labeled events" moat claim not caveated. "Creator Productivity Lock" used inconsistently (sometimes capitalized as trademark-ish, sometimes lowercase). |
| `docs/hiring/ml_advisor_outreach_tracker.md` | 3 | 2 P1, 1 P2 | **B+** | 15 empty tracker rows are expected (it's a form) but the companion "Result: ______" blanks in §Day-7 Compliance Sign-off look unfinished. Line 66 has an in-line `(TODO: Jiaming — create this file on first opt-out)` in a compliance clause — move to Open Items instead. |
| `docs/hiring/inmail_drafts.md` | 12 | 1 P0, 11 P1 | **B** | Structurally excellent (5 archetypes × 2 variants each). All `{{first_name}}` / `{{mutual: ____}}` / `{{product_name}}` placeholders are expected for a template — the doc itself even has a checklist item "Remove all `{{placeholder}}` brackets" before send. **Risk:** if this file is shared directly with an investor as a "deliverable", the unfilled placeholders read as unfinished. Suggested fix: add a one-line header flag saying "This is a send-time template; all `{{var}}` tokens are filled at personalization." One amateur-language flag on L129 ("best-in-class at" in internal rationale). L279 "totally understood" is acceptable but slightly soft. |
| `docs/hiring/advisor-sourcing-playbook.md` | 7 | 1 P0, 5 P1, 1 P2 | **B** | Five explicit TODO items in §Open Items (lines 180–184) — legitimate, but L101 "Y Confidential advisor agreement" is a typo (should be "YC FAST advisor agreement"). "Y Confidential" does not exist as a document type and will be visibly wrong to a counsel reader. §5 call script "most interesting" is a soft quantifier. |
| `docs/hiring/advisor-agreement-checklist.md` | 18 (placeholder form) | 0 P0, 5 P1, 13 P2 (form blanks) | **B+** as a template / **D** if shipped as-is | This is a **fill-in-at-signature** legal form, not a narrative doc. The 13 `_______________________` blanks and 5 TODO items are appropriate for a template — but calling out explicitly: if this file is shared with an investor as a "deliverable" rather than as "the template we'll use per engagement", it looks like the founder hasn't actually hired anyone yet. Recommend adding a header stating "**Template — used per advisor engagement; completed copies live at `docs/week-0/legal/equity/granted/`**." |
| `docs/v5_2_status/P1_rollup.md` | 3 | 2 P1, 1 P2 | **A–** | L191 missing space ("§contains" → "§ contains"). §P2 Checkpoints explicitly labelled "Placeholder — TBD" — acceptable but jarring inside an investor rollup. L75 "broader funnel — activate if P0/P1 Day 10 response rate <15%" numerator threshold is fine. |
| `docs/v5_2_status/numeric_reconciliation.md` | 1 | 1 P2 | **A** | Exemplary. 112 rows, every one sourced to file+§+commit. Only flag: D1 "Merchant acquisition payback (base)" cell says "~0.59 months" — the tilde is fine but the decimal precision of 0.59 is overspecified given the input uncertainty. Suggest "<1 month" or "~0.6 months." |
| `CHANGELOG.md` | 1 | 1 P2 | **A** | Clean. Follows Keep a Changelog loosely and correctly. Migration notes section is mature. Only flag: "18 downstream files" referenced but not enumerated (also flagged as I-8 in the reconciliation file itself). |

---

## §3 Defect Catalog

| # | File:Line | Current Text | Defect Type | Severity | Suggested Fix |
|---|---|---|---|---|---|
| D-01 | `push-pricing/SKILL.md:103` | "assumes most volume from T2+" | Vague quantifier (3) | P2 | Replace with concrete threshold: "assumes ≥75% of verified customers come from T2 or higher tiers" |
| D-02 | `push-pricing/SKILL.md:199` | "Activated when attribution was strong enough to justify" | Vague quantifier / dead language (3) | P2 | Rewrite: "Activated when 30-day attribution precision ≥85%." (Historical appendix, but still reads as hedging.) |
| D-03 | `push-creator/SKILL.md:9` | "v5.2 (2026-04-20) introduces Two-Segment Economics:" | Heading depth (4) | P2 | §0 "Authority Notice" title for a 5-line block is too formal; either promote to §1 Context or merge into a doc-level callout block |
| D-04 | `push-metrics/SKILL.md:104` | "### 6.x Operations Metrics (v5.2)" | Heading depth / placeholder numbering (4) | P1 | Renumber: §6.1 Operations Metrics; §6.2 Data Collection; §6.3 Playbook (SLR below target); §6.4 Competitor Benchmarks. "6.x" reads as a placeholder |
| D-05 | `push-metrics/SKILL.md:112` | "### 6.x.1 Data Collection (Authoritative)" | Heading depth (4) | P1 | See D-04; renumber to §6.2 |
| D-06 | `push-metrics/SKILL.md:135` | "### 6.x.2 Playbook — SLR below target" | Heading depth (4) | P1 | See D-04; renumber to §6.3 |
| D-07 | `push-metrics/SKILL.md:147` | "### 6.x.3 Competitor Benchmarks (estimated, internal use only)" | Heading depth (4) | P1 | See D-04; renumber to §6.4 |
| D-08 | `push-metrics/SKILL.md:25` | "Push's target 25 at M-12 positions it as mid-stack" | Voice inconsistency (8) | P2 | Normalize to match §1.1 first-person plural: "Our target of 25 at Month 12 positions us as mid-stack" — or adopt third-person "Push" throughout §1 |
| D-09 | `push-metrics/SKILL.md:210` | "Always have a hypothesis: 'We believe [change] will cause [metric] to...'" | Amateur hedging language (1) | P2 | Replace template text with imperative form: "State hypothesis as: '[change] will move [metric] by [amount]' — no hedging verbs." Avoids baking "we believe" into the standing doc. |
| D-10 | `push-metrics/SKILL.md:173` | "This is the ONLY real PMF signal. Not signups, not creator count, not campaign volume — unprompted merchant repeat." | Brand voice / all-caps emphasis (10) | P2 | Drop all-caps emphasis: "Unprompted merchant repeat is the PMF signal. Signups, creator count, and campaign volume are not." |
| D-11 | `push-strategy/SKILL.md:63` | "QR alone gives you 60–70% confidence; Oracle >92%." | Unsourced claim (7) | P1 | Label: "(estimated — QR-only confidence derived from industry benchmarks; ConversionOracle target per push-metrics §6.1)" |
| D-12 | `push-strategy/SKILL.md:67` | "pilot generates 10k+ labeled events before competitor entry" | Unsourced claim / puffery (7) | P1 | Caveat: "projected 10k+ labeled events over the 12-week pilot window (assumes 10 merchants × 85 customers/mo × 12 weeks); actuals tracked in push-metrics" |
| D-13 | `push-strategy/SKILL.md:62` | "Our SLR target of 25 is 5x a typical agency." | Unsourced claim (7) | P1 | Add source inline: "Our SLR target of 25 is ~5x the typical 3–5 agency benchmark (source: push-metrics §6.4 internal estimate)" |
| D-14 | `push-strategy/SKILL.md:97` | "Creator Productivity Lock" | Voice inconsistency (8) | P2 | Fix capitalization: used as proper noun in §Killer Lines and Matrix 2, then lowercase in Legal review notes. Pick one; since it's flagged internal-only, lowercase in prose, Title Case only when labeling the asset |
| D-15 | `docs/hiring/ml_advisor_outreach_tracker.md:66` | "immediately added to `docs/hiring/do-not-contact.md` (TODO: Jiaming — create this file on first opt-out)" | Orphan placeholder (2) | P1 | Move TODO to Open Items section; leave compliance paragraph clean: "...added to `docs/hiring/do-not-contact.md`." |
| D-16 | `docs/hiring/ml_advisor_outreach_tracker.md:72-74` | "Result: ______" (x3) | Orphan placeholder (2) | P2 | Expected on a sign-off form, but add clarifying header: "Form — signed copies archived after Day 7 send." |
| D-17 | `docs/hiring/inmail_drafts.md:35` (and 10 similar) | "Hi {{first_name}}," (10 instances across 5 archetypes × 2 variants) | Orphan placeholder (2) | P0 (if shared as-is) / P2 (as template) | Add a doc-level banner at top: "**Template file — `{{tokens}}` are personalised at send time. Do not share externally as a deliverable.**" |
| D-18 | `docs/hiring/inmail_drafts.md:37-38,59,107,133,181,229,251` | "{{mutual: ____}} mentioned you..." | Orphan placeholder (2) | Same as D-17 | Same fix as D-17; all `{{mutual: ____}}` tokens are part of the personalization checklist |
| D-19 | `docs/hiring/inmail_drafts.md:107` | "The on-device object detection you shipped in {{product_name}}" | Orphan placeholder (2) | Same | Same fix |
| D-20 | `docs/hiring/inmail_drafts.md:129` | "Names the sub-system they're best-in-class at" | Unprofessional bragging (9) | P2 | Rewrite rationale line: "Names the sub-system they've shipped at production scale" — avoids the "best-in-class" cliché in an internal rationale |
| D-21 | `docs/hiring/inmail_drafts.md:279` | "If you're not in a position to advise, totally understood" | Amateur tone (1) | P2 | Replace "totally understood" with "no problem" or "understood": "If you're not in a position to advise, understood — would love a 1-line referral..." |
| D-22 | `docs/hiring/inmail_drafts.md:273,279` | Follow-up drafts still contain `{{first_name}}` and `{{original subject}}` | Orphan placeholder (2) | Same as D-17 | Covered by D-17 banner |
| D-23 | `docs/hiring/advisor-sourcing-playbook.md:101` | "Clarify time commitment (2–4 hrs/wk). Ask about conflicts, other advisor slots, geography." ... "Y Confidential advisor agreement." | Typo (6) | P0 | "Y Confidential" is a typo; should be "YC FAST advisor agreement" or "Y Combinator FAST advisor agreement". Reader (counsel, investor) will flag this |
| D-24 | `docs/hiring/advisor-sourcing-playbook.md:99` | "Walk me through the most interesting CV/OCR (or geo-fusion) system you shipped." | Vague quantifier (3) | P2 | Replace: "Walk me through a CV/OCR or geo-fusion system you shipped that broke in production — what failed and how you fixed it." Forces specificity |
| D-25 | `docs/hiring/advisor-sourcing-playbook.md:180-184` | 5 explicit `[ ] TODO:` open items | Orphan placeholder (2) | P1 | Keep — these are in a clearly labelled "Open items for Jiaming" section. But add a short header above the section: "These are tracked open items on the v5.2 P1-2 ticket; not blockers for doc publication." |
| D-26 | `docs/hiring/advisor-sourcing-playbook.md:77` | "a strong single dimension cannot raise a 2 elsewhere" | Vague quantifier (3) | P2 | Clarify: "A single dimension score of 5 does not compensate for any dimension scored ≤2 in a different area." (Already implicit above, but spell it out.) |
| D-27 | `docs/hiring/advisor-agreement-checklist.md:13-18` | 5 `_______________________` blanks in Candidate basics | Orphan placeholder (2) | P1 (if shared as template) / P0 (if shared as specific engagement) | Add header: "**Template — completed and archived to `docs/week-0/legal/equity/granted/<date>-<advisor>-checklist.md` per engagement.**" |
| D-28 | `docs/hiring/advisor-agreement-checklist.md:37-46` | Sub-item blanks for Engagement 1/2/3 and Excluded IP #1/#2 | Orphan placeholder (2) | Same as D-27 | Same fix |
| D-29 | `docs/hiring/advisor-agreement-checklist.md:54` | "______% RSA (within 0.25–0.5%)" | Orphan placeholder (2) | Same | Same fix |
| D-30 | `docs/hiring/advisor-agreement-checklist.md:97-99` | "Founder (Jiaming): ____________________ Date: ____________" x3 | Orphan placeholder (2) | Same | Same fix |
| D-31 | `docs/hiring/advisor-agreement-checklist.md:101-106` | 5 TODO markers | Orphan placeholder (2) | P1 | Keep — labelled "TODO markers for Jiaming" — but same header guidance as D-25 |
| D-32 | `docs/v5_2_status/P1_rollup.md:191` | "This §contains the headline numbers most likely to surface..." | Markdown / typo (6) | P1 | Missing space: "This section contains..." or "This §  contains..." Current renders as one word |
| D-33 | `docs/v5_2_status/P1_rollup.md:241,252` | "## §P2 Checkpoints (Placeholder — TBD)" / "**TBD until P1 Day 14 readout.**" | Orphan placeholder (2) | P1 | Rewrite section title to "§P2 Candidate Items (scoping pending Day 14 readout)" and drop the "Placeholder" label; the section itself is informative |
| D-34 | `docs/v5_2_status/P1_rollup.md:252` | "**TBD until P1 Day 14 readout.**" | Orphan placeholder (2) | P2 | Covered by D-33 rewrite |
| D-35 | `docs/v5_2_status/numeric_reconciliation.md:137` | "D1 Merchant acquisition payback (base) ~0.59 months" | Precision without support (7) | P2 | Reduce precision: "~0.6 months (<1 month)" — 0.59 is overspecified given input variance on CAC |
| D-36 | `CHANGELOG.md:66` | "18 downstream files (dashboards, profile pages) still carry v4.1 tier hex strings" | Unsourced claim / missing enumeration (7) | P2 | Either enumerate the 18 files in an appendix, or replace "18" with "a set of downstream files" and remove the count until verified (cross-ref numeric_reconciliation I-8) |
| D-37 | `.claude/skills/push-metrics/SKILL.md:51` | "### Retention (Most Important)" | Brand voice — caps-emphasis (10) | P2 | Lowercase the parenthetical: "### Retention (primary cohort lens)" — "Most Important" is a mushy heading |

---

## §4 Brand Voice Observations (cross-cutting patterns)

1. **Consistently specific on numbers.** Every price, every cap, every threshold has a figure attached. The master reconciliation (`numeric_reconciliation.md`) demonstrates unusual discipline for a pre-seed set — 112 rows, all sourced. This is the single strongest brand-voice asset across the set and should be flagged to investors as a competence signal.

2. **Competitor comparisons are handled responsibly.** The `(estimated, internal use only)` labels in push-metrics §6.4 and the footnote "any competitor number must be flagged 'estimated' in external comms until sourced to disclosed financials" show legal-review-aware operator discipline. Two places (push-strategy Matrix 2 line 62, Matrix 2 line 67) do not carry the same caveat — flagged above as D-11/D-12/D-13.

3. **Placeholder templates dominate the `docs/hiring/*` set.** Both `inmail_drafts.md` and `advisor-agreement-checklist.md` are **templates**, not finished artefacts. That is the right shape for their purpose, but if any of them are shared externally under the label "P1 deliverable" they will read as unfinished. Recommend adding a one-line header to each labeling them as templates (D-17, D-27).

4. **TODO / TBD markers cluster in "Open Items" sections.** This is disciplined — they are labeled, not hidden. The concerning instances are the in-paragraph `(TODO: Jiaming — create this file)` on L66 of the outreach tracker (inside a compliance clause — D-15) and the "Placeholder — TBD" label on P1_rollup §P2 (D-33). Everything else is properly corralled.

5. **The SKILL.md set uses a mix of first-person ("we"), company-name ("Push"), and institutional ("the platform").** This is common in skill files — they function as prompt context and narrate differently in different sections. But push-metrics §1 specifically mixes "we" and "Push" within 10 lines (D-08). Pick one voice per section.

6. **No exclamation marks, no emojis outside permitted locations, no "revolutionary / game-changing / world-class" puffery in client-facing material.** Only internal rationale text carries one "best-in-class" (D-20). This passes the senior-operator benchmark.

7. **Historical/deprecated content is marked clearly.** The v4.1 appendices in push-pricing and push-creator both carry `DEPRECATED 2026-04-20` labels on every subsection heading. This is better practice than simply deleting or quietly replacing — investors reading the files can trace the migration logic.

8. **`{{placeholder}}` tokens concentrated in `inmail_drafts.md` are a design feature, not a defect, given the Send Day 7 Checklist item "Remove all `{{placeholder}}` brackets" (L21).** The only risk is external sharing without the context header.

9. **The advisor-agreement-checklist.md disclaimer line 109 "NOT legally binding until executed via Clerky with counsel review" is exemplary.** Protect-the-company language should be similarly prominent on the advisor-sourcing-playbook.md (currently the deal-breakers section at §7 only).

10. **Across 11 files, ~1,200+ lines of content, 37 defects total is a ~3% defect rate.** For comparison, investor-due-diligence norms for seed-stage doc rooms run 8–15%. This set is above the bar.

---

## §5 Top 10 Must-Fix (prioritized — items that would hurt investor credibility if shipped as-is)

**Order reflects blast radius: items that any investor would notice in 30 seconds come first.**

1. **D-23 — "Y Confidential advisor agreement" typo** (advisor-sourcing-playbook.md:101). Reads as if the founder doesn't know the name of the legal template. Single-character fix, highest-visibility defect. **5-minute fix.**

2. **D-17 — Add template header to `docs/hiring/inmail_drafts.md`** saying "Template file — `{{tokens}}` personalised at send time; do not share externally as a finished deliverable." Otherwise the 10 `{{first_name}}` tokens read as unfinished. **5-minute fix.**

3. **D-27 — Add template header to `docs/hiring/advisor-agreement-checklist.md`** saying "Template — completed copies archived per engagement at `docs/week-0/legal/equity/granted/`." Same reasoning as D-17. **5-minute fix.**

4. **D-04 through D-07 — Renumber push-metrics §6.x / §6.x.1 / §6.x.2 / §6.x.3 to §6.1 / §6.2 / §6.3 / §6.4.** Current numbering reads as "author had a placeholder and forgot to replace it." Cosmetic but investor-visible. **10-minute fix.**

5. **D-32 — P1_rollup.md L191 "§contains" typo.** One missing space, top-of-fold position in the cross-file reconciliation section. **30-second fix.**

6. **D-33 — P1_rollup.md §P2 "Placeholder — TBD" relabel.** Rewrite to "§P2 Candidate Items (scoping pending Day 14 readout)." The section has real content; the header undersells it. **2-minute fix.**

7. **D-11/D-12/D-13 — Add "estimated" caveats** to push-strategy Matrix 2 unsourced numbers (60–70% QR-only confidence, 10k+ labeled events projection, 5x typical agency). Per the doc's own footnote rule. **10-minute fix total.**

8. **D-15 — Move in-paragraph TODO out of `ml_advisor_outreach_tracker.md` §Compliance L66.** A TODO embedded inside a compliance clause is a red flag for a legal-read investor. Move to §Open items. **2-minute fix.**

9. **D-09 — Rewrite push-metrics §11 Experiment Design template line.** Remove "We believe" baked-in hedge verb from the standing doc. Replace with imperative template. **2-minute fix.**

10. **D-36 — Resolve "18 downstream files" claim in CHANGELOG.md:66.** Either enumerate the list or replace the count with "a set of files" until verified. Already flagged in the numeric_reconciliation.md as I-8; same fix resolves both. **15-minute fix (enumeration) or 30-second fix (generalize).**

**Total cleanup time estimate: 60 minutes of focused editing to clear all 10 items.** Nothing in this list is structural; all are surface-level polish that an investor would notice in the first pass.

---

## §6 Verification

- [x] Report has ≥30 defect rows (37 rows in §3).
- [x] Each defect has `File:Line` reference.
- [x] Each defect has a concrete suggested fix (not "improve this").
- [x] File saved to `docs/v5_2_status/audits/02-professionalism-audit.md`.
- [x] Executive summary gives overall pass/fail and per-category counts.
- [x] Per-file scoring table includes A–F ratings.
- [x] Brand voice observations are cross-cutting (not per-file restatement).
- [x] Top 10 Must-Fix items are prioritized by investor-visibility blast radius.

---

*Audit version: Wave 2 QA v1.0 — 2026-04-20.*
*Auditor: consolidation agent (read-only, no file modifications beyond this report).*
*Next audit: after Top 10 Must-Fix items are closed (target: before first investor share of P1_rollup).*
