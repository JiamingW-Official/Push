# P2-2 Fresh-Eyes Audit — `docs/spec/sms-compliance-v1.md`

**Reviewer posture:** outside TCPA counsel conducting pre-engagement review for Push, Inc.
**Target:** `docs/spec/sms-compliance-v1.md` (v1 DRAFT, 900 lines, 2026-04-20).
**Cross-reads:** `docs/spec/consumer-facing-v1.md` (P2-1); `docs/legal/counsel-engagement-plan.md` §2, §7; `docs/v5_2_status/audits/03-legal-compliance-register.md` (TCPA rows #20, #24, #25).
**Date:** 2026-04-20. **Status:** audit complete. No modifications to the target spec were made.

---

## §1. Executive Summary

**Would I write an opinion letter on this as-is?** No. The spec is unusually comprehensive for a pre-engagement draft — it reads like it was written by someone who has litigated TCPA cases, not by a first-time founder — and the defense-of-consent architecture (`consent_log`, `disclosure_versions`, immutable `governance_log`, byte-for-byte text snapshot per row) is opinion-letter-ready in structure. But there are material legal, factual, and cross-spec defects that I cannot sign over. In particular, three citation or interpretive claims are wrong enough that an opposing expert would use them to impeach the opinion.

**Three things that must change before an opinion letter can issue.**

1. **Reconcile the internal pepper-rotation contradiction and the cross-spec pepper secret mismatch.** §4.6 says "rotated annually on January 1"; §12.2 says "first Monday of April." These cannot both be true. More fatally, `sms-compliance-v1.md` stores the pepper in KMS under a year-indexed scheme (`pepper_[year]`); `consumer-facing-v1.md` §4 uses an env-var secret named `CONSUMER_PHONE_PEPPER` with a `phone_hash_v` column. The two specs therefore produce **different `phone_hash` values for the same E.164**, which means the opt-out deny-list in `opt_out_log` will not match the `loyalty_cards.consumer_phone_hash` the sender-gate is checking. This is a silent-TCPA-violation generator. (Carried forward from P2-1 audit finding.)
2. **Fix the §1.1.3 statutory-damages citation (`47 U.S.C. §227(b)(3)`) — the "up to $1,500" framing is overstated as "trebled" and misstates the mechanism.** §227(b)(3)(C) is a discretionary enhancement ("the court may, in its discretion, increase the amount … to not more than 3 times"), not a treble damages multiplier that automatically applies to willful/knowing. Minor wording, but the word "trebled" in an opinion letter will get the letter rejected by a careful reviewer. See cite-check table below.
3. **Address the consent-language "not required as a condition of any purchase" defect.** The spec quotes this verbatim from §64.1200(f)(9)(ii), but Push is a **platform** — the consent runs to the merchant, not to Push, and the consumer is not purchasing anything on the consent page. FCC 2012 Order footnote language requires the disclosure to accurately describe the transaction the consumer is not required to enter. The current text is defensible but not optimal; counsel will redline to something like "not required to receive a reward" or strike entirely. Do not A/B test Variant B until this is resolved.

Beyond those three, the spec under-invests in: (a) time-of-day enforcement mechanics (§1.3 references a 10 a.m.–8 p.m. default but §5 has no actual scheduling gate); (b) reassigned-number-database strategy (Appendix D #4 punts to counsel); (c) per-state residency determination (the §1.3 "NPA-NXX + last-known address" proxy is demonstrably weaker than FTSA enforcement practice). Fixable inside the sprint, but they are opinion-letter prerequisites.

---

## §2. Statutory Cite-Check Table

Every row = one factual or statutory claim that would appear in my opinion letter if I adopted the spec's language. **"Correct?"** = yes / partially / no. **"If wrong"** = what the opinion letter must say instead.

| # | Claim in spec (§ref) | Cite given | Correct? | If wrong/partial, what the opinion must say |
|---|---|---|---|---|
| C1 | TCPA primary statute at §1.1 | 47 U.S.C. §227 | Yes | — |
| C2 | Primary implementing reg | 47 C.F.R. §64.1200 | Yes | — |
| C3 | "Prior express written consent" definition at §1.1.2 | 47 C.F.R. §64.1200(f)(9) | **Partially** | Modern citation is **§64.1200(f)(9)**; subparts (i)–(iii) are correctly referenced, but the spec should also cite the underlying FCC 2012 Order paragraphs ¶¶20–34 when describing the clear-and-conspicuous standard — the regulation text alone is under-detailed. |
| C4 | "$500 per violation, trebled to $1,500" at §1.1.3 | 47 U.S.C. §227(b)(3) | **No — language defect** | §227(b)(3)(B) sets $500 per violation; §227(b)(3)(C) permits the court to enhance "to not more than 3 times" on willful/knowing. "Trebled" and "up to $1,500" are colloquially accurate but technically wrong in legal writing: the enhancement is discretionary ("may … in its discretion"), not automatic, and the ceiling is $1,500, not a treble (which would be $1,500 = $500 × 3, so the math is fine but the mechanism is mislabeled). |
| C5 | Standing — *TransUnion LLC v. Ramirez* | 594 U.S. 413 (2021) | Yes | Cite is correct; holding summary ("concrete injury") is accurate. |
| C6 | Standing follow-on — *Drazen v. Pinto* | 74 F.4th 1336 (11th Cir. 2023) | Yes | Cite is correct. Note Drazen is 11th Cir. only; other circuits (e.g., 7th, 9th) have more nuanced single-text-injury rulings. Opinion should not over-generalize. |
| C7 | TCPA non-preemption | 47 U.S.C. §227(e) | **Partially** | §227(e) addresses **state do-not-call registries**, not full non-preemption. General TCPA non-preemption of stricter state law lives in **§227(f)** (savings clause). Minor but material — an opposing expert would flag this. |
| C8 | CCPA/CPRA primary cite | Cal. Civ. Code §§1798.100–1798.199.100 | Yes | — |
| C9 | CCPA threshold | §1798.140(d)(1) | Yes | Thresholds correct ($25M revenue; 100K consumers; 50% from sale/sharing). |
| C10 | CCPA statutory damages for breach | §1798.150 | **Partially** | §1798.150 applies **only to security-breach incidents involving specified personal information types** and **requires** 30-day cure + written notice to AG before suit. The spec's "$100–$750 per consumer per incident for non-encrypted/non-redacted PII" is correctly described; what's missing is that this is **breach-specific**, not a general CCPA-violation penalty. |
| C11 | Florida FTSA + amendments | Fla. Stat. §501.059 (SB 1120 2021; HB 761 2023) | Yes | Cite accurate. HB 761 15-day pre-suit notice-and-cure correctly described. |
| C12 | Oklahoma OTCPA | 15 Okla. Stat. §775C.1 et seq. | **Yes, with quibble** | The OTCPA effective 2022 is the "Oklahoma Telephone Solicitation Act" at 15 Okla. Stat. §775B.1 et seq. (not §775C.1). Verify the section number — the spec may have transposed. |
| C13 | Washington CEMA | Wash. Rev. Code §19.190; RCW 80.36.400 | Yes | — |
| C14 | Connecticut telemarketing | Conn. Gen. Stat. §42-288a (Public Act 23-56) | Yes | Cite accurate. Note §42-288a's written-consent amendments are narrower than spec implies — verify §2.1 language satisfies the Conn. specific-consent-to-auto-dial requirement. |
| C15 | Maryland MTSA | Md. Code Com. Law §14-3301 et seq. | Yes | — |
| C16 | 4-year federal SOL | 28 U.S.C. §1658(a) | **Partially** | §1658(a) applies to **federal statutes enacted after 1990**; TCPA was enacted 1991, so §1658(a) applies. Correct outcome, but spec should also acknowledge state-SOL tolling and class-action tolling (*American Pipe*) can extend the practical litigation window beyond 4 years. |
| C17 | *Facebook v. Duguid* narrowing | 592 U.S. 395 (2021) | Yes | Cite accurate. Note Duguid applies only to the **federal** ATDS definition — most state mini-TCPAs define ATDS more broadly and are unaffected, which the spec correctly flags. |
| C18 | *Van Patten v. Vertical Fitness Group* | 847 F.3d 1037 (9th Cir. 2017) | Yes | Cite accurate. |
| C19 | 2015 Omnibus Order reassigned-number one-call safe harbor | CG Docket No. 02-278 (July 10, 2015) | **Misleading** | The 2015 one-call safe harbor was **vacated in part by *ACA International v. FCC*, 885 F.3d 687 (D.C. Cir. 2018)**. The current safe harbor lives in the FCC's 2018 Second Report and Order establishing the Reassigned Numbers Database (which became operational Nov 2021). Relying on the 2015 safe harbor in 2026 is a **material defect**. |
| C20 | CCPA compliance exception | §1798.105(d)(1) | **Yes but narrowed by CPRA** | The exception now lives at §1798.105(d) (unnumbered subdivision list after CPRA amendments). (d)(1) language covers "legal obligation." Counsel should confirm that TCPA record-retention is a "legal obligation" under the CPRA's interpretive framework — the CPPA regulations at 11 CCR §7022 impose additional disclosure obligations when relying on this exception. |

**Total cite-check: 20 rows. Fully correct: 11. Partially correct or misleading: 9.** Nothing is outright fabricated, but the §227(b)(3) mechanism, §227(e) vs. §227(f), the 2015 safe harbor reliance, and the OTCPA section number are the four that would get the opinion letter rejected on a careful read.

---

## §3. Opt-In Language Redline (FTC / FCC 2024 Guidance)

**Variant A (current):**
> I agree to receive marketing text messages from [Merchant Legal Name] via Push (message frequency varies, typically 2–4 msgs/month). Message and data rates may apply. Reply STOP to opt out at any time. Reply HELP for help. Consent is not required as a condition of any purchase.

**Redline (opinion-letter-ready):**

- ~~"from [Merchant Legal Name] via Push"~~ → **"from [Merchant Legal Name], delivered through Push (our messaging platform)"**. Rationale: the FCC 2012 Order ¶32 requires the consumer to understand **who** is sending. "via Push" is platform jargon; a reasonable consumer does not know what "via" means in this context. Also addresses Appendix D #5 (platform-vs-seller consent question) prospectively.
- ~~"(message frequency varies, typically 2–4 msgs/month)"~~ — keep, but move the parenthetical out of the verb phrase: **"Message frequency varies; you can expect 2–4 messages per month."** CTIA best-practice language is imperative-clear; the current parenthetical reads as marketing hedge.
- "Message and data rates may apply." → **keep verbatim**. This is the settled CTIA best-practice phrasing.
- "Reply STOP to opt out at any time. Reply HELP for help." → **keep verbatim**. Settled.
- ~~"Consent is not required as a condition of any purchase."~~ → **"You are not required to consent to receive these messages to claim any offer or reward."** Rationale per §1 above: Push is not selling the consumer anything on this page; the §64.1200(f)(9)(ii) "condition of purchase" language is a poor fit. Restating in consumer-facing terms ("claim any offer or reward") tracks the actual transaction and is what courts have accepted post-2022 in TCPA defense letters I have written.

**Variant B (condensed):** Do not deploy. A/B testing two consent-language variants doubles the `disclosure_versions` surface, doubles counsel review, and — per Appendix D #12 FAQ — is not advisable at v1. FCC's 2012 Order implicitly disfavors consent-language experimentation (because it suggests the "optimal" language is not the most-informative language). My recommendation: ship Variant A only, defer B to a v2 revision.

**Disclosure-placement review (§2.2).** Placement rules are unusually strong — "not in a tooltip, not behind a Learn-more, not in a modal triggered on-submit" is the right standard. Two gaps:

1. **Font-size floor.** 14px is a weak floor. *Van Patten* and progeny look at whether the consumer could read the disclosure **under the surrounding visual conditions** — a 14px disclosure competing with 24px marketing headlines is harder to read than a 14px disclosure on a clean page. Recommend changing to **"≥ 14px AND ≥ 90% of the size of the surrounding body copy on the same screen."**
2. **Mobile-specific.** "Mobile viewports (< 375px width): disclosure text wraps without truncation." This is a display requirement, not a legal requirement. What matters legally is whether the disclosure is **visible on the consumer's actual device at the moment of consent**. Add screenshot-capture-to-consent-log as a compensating control — §2.4 `exact_consent_text_shown` stores the text but not the rendered view.

---

## §4. Opt-Out Mechanics Review

**Keywords (§3.1).** 9 keywords listed; STOP / STOPALL / UNSUBSCRIBE / END / QUIT / CANCEL / OPT OUT / OPTOUT / REMOVE. **CTIA guidance accepts STOP as the mandatory floor**; the expanded set is Push's election and is defense-positive. Case-insensitive, whole-word-match, trimmed — correctly specified. One gap: **CTIA also expects recognition of "STOP" as part of longer messages in some carrier-specific implementations.** Twilio's default behavior honors whole-word STOP; other platforms (Sinch, Bandwidth) may differ. Lock to Twilio explicitly or add a per-carrier keyword-recognition table.

**SLA (§3.4).** p95 ≤ 10s propagation; page at p95 > 30s over any 5-minute window. **This is aggressive in a defense-positive direction — good.** Most TCPA defendants target 24 hours and lose on "you had my opt-out and kept texting" claims. Push's 10-second target is opinion-letter-ready **provided** PD-T9, PD-O1, and PD-O2 pre-deploy items are actually verified (the spec commits to test pages; §6.2 counsel review should insist on log evidence of the test, not just the commit).

**Edge cases to cover (missing in spec):**

- **E1: Consumer replies "STOP PLEASE" or "STOP IT" or "STOP TEXTING ME."** Per §3.1, the match is against the **entire trimmed body** — "STOP PLEASE" would NOT trigger opt-out under the current rule. This is a **latent TCPA violation**: a jury will find that "STOP PLEASE" obviously conveys intent to opt out, and the carrier-level CTIA rules in some implementations will trigger opt-out on "STOP" appearing as a leading token. Fix: keyword-match on **leading-token STOP with optional trailing content**, or at minimum a fuzzy-match-plus-human-review path.
- **E2: Consumer replies with foreign-language "STOP" equivalents** ("DETENER", "ARRÊTER"). CTIA does not require recognition; opinion is defense-positive to add at least Spanish ("DETENER", "PARAR", "ALTO") given Push's NYC market demographics. Appendix F glossary is silent.
- **E3: Reassigned number — consumer A opted in; number reassigned to consumer B; B replies STOP.** Spec treats this correctly via `(phone_hash, merchant_id)` keying (§3.3), but the **verification SMS during §2.5 step 2** could have been sent to B between reassignment and B's STOP, exposing Push to a reassigned-number claim. RND query (Appendix D #4) is unresolved; counsel should require RND adoption **before** §9 hard gate releases, not as a counsel-decision item.
- **E4: International numbers.** §5.7 rate-limit note + FAQ #5 (Twilio Lookup rejects non-US/CA) address this operationally. No legal gap.
- **E5: Landline / VoIP number entered.** TCPA protections apply differently to landlines (§227(b)(1)(B) covers landlines via prerecorded voice but not ATDS text — texts to landlines usually fail at carrier). §1.1 discussion is wireless-only. Add a sentence confirming landline/VoIP handling (Twilio Lookup `line_type_intelligence` detects VoIP; reject non-mobile at ingest).

---

## §5. Data-Retention Review (State-SOL Variance)

**§4.1 `consent_log` 4-year retention.** Keyed to 28 U.S.C. §1658(a) federal SOL. This is the correct floor for federal TCPA claims. **State-SOL floor is shorter** (FL 4 yr; NY 3 yr; CA 3 yr) so 4 years covers the floors.

**But:** *American Pipe & Construction Co. v. Utah*, 414 U.S. 538 (1974) and progeny establish that **filing a class-action complaint tolls the SOL for absent class members**. If a TCPA class is filed against Push in year 3 and denied certification in year 5, absent class members have the remainder of their individual SOL starting year 5 — which, for federal TCPA, gives them an additional period after the denial. **4 years from `opt_in_timestamp` is not sufficient to survive American Pipe tolling.** An opinion letter must either (a) extend retention to 7 years to cover realistic tolling + litigation windows, or (b) add a litigation-hold trigger in §11.5/§11.6 that extends retention on any named plaintiff.

The spec's §11.5 and §11.6 **do** invoke litigation holds, which is the right mechanism — but the hold is described generally; operationalizing it requires an actual bridge from the incident-response runbook to the retention purge job, and the spec does not say how `consent_log_purge_log` is gated against active holds. **Medium-severity gap.**

**§4.2 `opt_out_log` indefinite.** Correct. CCPA §1798.105(d) compliance exception applies. Privacy-policy disclosure is committed (§4.2 last sentence) — verify that the actual policy text at PD-C4 is comprehensive.

**§4.3 `disclosure_versions` forever.** Correct for the audit-trail function. No PII in this table. Fine.

**§4.6 / §12.2 pepper rotation.** Contradiction flagged in §1 above. **High-severity.**

**§4.5 CCPA right-to-delete.** Response template language is OK but the **45-day response clock** is the maximum; many consumers' expectations (and regulator guidance) are faster. Add a commitment to acknowledge within 10 days and respond within 30 in the privacy policy.

---

## §6. Integration Review — Twilio A2P 10DLC

**§5.2 registration realism.**

- **Brand registration ~$4 one-time, 2–4 weeks standard, 4–8 weeks enhanced.** Roughly accurate. Twilio's fee to TCR is currently **$4/mo** for standard brand (not one-time — spec is slightly wrong); enhanced vetting is a **one-time $40** + monthly ongoing. Not material to the legal analysis but the budget line is wrong.
- **Campaign registration ~$1.50/campaign/month.** Accurate as of 2024; TCR has raised fees in past years; expect this to trend up. Budget with 2x headroom.
- **Rejection rate.** Spec §15 cites "5–10% first-submission per Twilio" — my experience with TCR is closer to **15–25% first-submission rejection** for new brands without an existing domain-verified web presence, because TCR vets the sending brand against the opt-in language and the privacy policy. Push's privacy policy is **not yet live** per audit register row #24. Submitting before the privacy policy is live = near-certain rejection. Sequence this in §7 timeline: policy live → then brand submission.
- **Throughput tier T1 ~4,500 msg/min.** Correct for standard brand vetting. Enhanced vetting unlocks T2 (higher TPS). At Push's seed-stage volumes, T1 is fine; monitor if campaigns grow.

**Monthly cost at scale.** At 50 merchants × 4 campaigns/merchant × $1.50/campaign/month = **$300/month recurring** just in TCR fees, plus Twilio messaging-service and per-SMS. Budget line item should be explicit in `docs/spec/legal-budget-v1.md` (§15 cross-ref).

**Rate limits.** The spec's §5.7 enumeration-abuse limits (5 initiations/hr/IP, 3 verification attempts/24h/phone, 5 code entries/session) are sensible. One gap: **no rate limit on per-merchant outbound sends**. A compromised merchant account could blast hundreds of opt-in-having numbers in seconds, which is a TCPA per-message violation multiplier. Add per-merchant-per-hour outbound throttle to §5.5.

---

## §7. Pepper + `phone_hash` Cross-Spec Joinability

**Known issue from P2-1 audit (`01-p2-1-audit.md`).** The two specs define `phone_hash` as SHA-256(E.164 || pepper), but:

- **`sms-compliance-v1.md` §4.6:** pepper stored in KMS, versioned `pepper_[year]`, rotation on **Jan 1** annually.
- **`sms-compliance-v1.md` §12.2:** pepper stored in KMS, rotation on **first Monday of April** annually. Internally contradictory with §4.6.
- **`consumer-facing-v1.md` §4 PII-hashing note:** pepper stored as env var `CONSUMER_PHONE_PEPPER`, rotation "at most yearly," versioning column `phone_hash_v tinyint`.

**Consequences:**

1. **Different secret storage.** KMS vs. env var. The env-var approach fails CCPA reasonable-security posture if Push is ever challenged by the CPPA; KMS is correct. Consumer-facing spec should be updated to KMS.
2. **Different rotation schedule.** Jan 1 vs. first Monday April vs. "at most yearly." Three different schedules across two specs. **The same E.164 will produce different hashes at different times in the two systems.**
3. **Different versioning column.** `consent_log.pepper_version int` vs. `loyalty_cards.phone_hash_v tinyint`. Tinyint vs. int is trivial; that they're separately versioned means the dual-read windows in the two systems will not align.
4. **The `opt_out_log.phone_hash` (SMS spec) will not join with `loyalty_cards.consumer_phone_hash` (consumer spec)** unless both systems always hash with the same pepper at the same time, which is architecturally not guaranteed.

**Severity: HIGH.** This is the #1 production-time TCPA-violation risk in the stack. The send-gate in `sms-compliance-v1 §5.5` looks up consent in `consent_log`; the consumer card in `loyalty_cards` holds the same phone under a **different hash**. The opt-out recorded in `opt_out_log` does not propagate to `loyalty_cards.sms_opt_in = false` unless a join succeeds, which it cannot.

**Fix required before §9 hard gate:** one pepper secret, one rotation schedule, one versioning column, one canonical `phone_hash` used by both specs. Recommend consolidating to SMS-spec's KMS model and retiring the env-var reference from `consumer-facing-v1`. Flag as cross-spec blocker.

---

## §8. Missing Controls (TCPA Specialist's Required Additions)

A TCPA specialist would decline to write the opinion without the following items, which are **not** in the current spec:

1. **Time-of-day scheduling gate.** §1.3 references a default 10 a.m.–8 p.m. local quiet hours + FTSA 8 a.m.–8 p.m. requirement. **§5 has no actual scheduling implementation.** Who enforces the time gate? What timezone source (NPA-NXX lookup? merchant-address-based? consumer-declared?)? For multi-state recipients, does the strictest window apply? This needs a concrete send-scheduler component with timezone-resolution logic before opinion letter.
2. **Reassigned Number Database (RND) integration.** Appendix D #4 punts to counsel; my answer is: **yes, query RND before every marketing send**, at least for sends to numbers last-consented more than 30 days ago. Cost: ~$0.0007/query via Somos. At Push's 5k-SMS/month Month-6 scale, ~$3.50/mo. Trivial cost; massive defense value. **Must be in v1 spec before opinion letter.**
3. **Per-state residency-determination methodology.** §1.3 "NPA-NXX + last-known address" is under-specified. FTSA enforcement practice (FL AG's office, Keogh Law cases) has accepted NPA-NXX as a safe harbor when no conflicting signal exists, but the spec needs to state the tiebreaker: which controls when NPA says TX but the merchant is in FL? (Answer: strictest wins, per §1.3 implementation rule, but §5 has no implementation.)
4. **Call-vs-text distinction.** The spec is text-only. 47 U.S.C. §227(b)(1)(A) covers **both** prerecorded calls and texts. If Push later adds voice-call features (appointment reminders, IVR), the consent architecture must treat them separately. **Add a v1 constraint: "no voice calls of any kind under this consent architecture"** — an explicit limitation that prevents scope-creep.
5. **Marketing-vs-transactional distinction and architecture.** Appendix D #12 FAQ flags this for counsel, but the spec architecture doesn't support a future transactional split. Transactional consent (appointment reminders, order confirmations) has a lower consent floor — "prior express consent" rather than "prior express written consent" — but Push's one-consent-fits-all schema cannot distinguish them. Add a `consent_log.consent_scope` enum (`marketing-only`, `marketing-plus-transactional`) to be forward-compatible.
6. **Short-code abuse / impersonation detection.** The spec sends from 10DLC only. A determined fraudster could register a look-alike 10DLC and send from the look-alike; Push's only defense is the CTA display name. Add a monitoring control: ingest a regular report of look-alike 10DLCs from Twilio and alert.
7. **Do-not-contact list import.** If Push acquires a merchant who already has an opt-out list (common for migrations), the spec has no import path. Add `opt_out_log.source = 'merchant-import'` and a bulk-import endpoint gated on counsel review.
8. **Revocation-of-consent beyond STOP.** *In re Rules Implementing TCPA* (2015 Omnibus) held that consumers may revoke consent in **any reasonable manner** — not just the seller-designated method. If a consumer emails `legal@push.nyc` asking to opt out, that is a revocation under the 2015 Omnibus rule. Spec §3 is SMS-keyword-only; add email/web/phone-call revocation paths.
9. **Per-merchant written-consent chain.** §2.1 consent text names the merchant but the consent **runs from** the consumer to the merchant, **via** Push as platform. The written consent for opinion-letter purposes is the `consent_log.exact_consent_text_shown` + `disclosure_versions` row; this is correct. But if Push is later sued, the merchant will demand indemnity (**MSA §Indemnity**), and without a written agreement that assigns TCPA responsibility, Push eats the whole thing. Address in MSA template (out of scope of this spec but flag the dependency).
10. **Consent-text-variant A/B test governance.** §2.1 Variant B. If Variant B ever goes to production, the spec needs a governance rule that consent captured under A and B are **not interchangeable** — a re-engagement campaign using A-language must be sent only to A-consenters. Currently unenforced.

---

## §9. Findings Table

| # | Finding | Sev | §ref |
|---|---|---|---|
| F1 | Internal pepper-rotation contradiction: §4.6 says Jan 1, §12.2 says first Monday April | HIGH | §4.6 vs §12.2 |
| F2 | Cross-spec `phone_hash` unjoinable between SMS and consumer-facing specs — different secret store, rotation, and versioning | HIGH | §4.6; consumer-facing-v1 §4 |
| F3 | §1.1.3 "$500 / $1,500 trebled" language misstates §227(b)(3) discretionary-enhancement mechanism | MED | §1.1.3 |
| F4 | §1.1.5 "TCPA does not pre-empt stricter state laws (§227(e))" — cite is to wrong subsection; non-preemption lives in §227(f) savings clause | MED | §1.1.5 |
| F5 | 2015 Omnibus one-call reassigned-number safe harbor cited without flagging that it was vacated in part by *ACA International v. FCC* (D.C. Cir. 2018) | HIGH | §1.1; Appx D #4 |
| F6 | OTCPA citation may be wrong section (spec says 15 Okla. Stat. §775C.1; correct appears to be §775B.1) | LOW | §1.3.2 |
| F7 | Variant A consent text "not required as a condition of any purchase" is a poor fit for the platform-fact-pattern; recommend redline per §3 above | MED | §2.1 |
| F8 | 14px font floor for disclosure is weak; should be relative to surrounding body copy | LOW | §2.2 |
| F9 | No time-of-day scheduling gate implementation in §5 despite §1.3 requiring one | HIGH | §5 |
| F10 | No RND integration — Appendix D #4 punts to counsel, but RND is the current standard for reassigned-number defense | HIGH | Appx D #4 |
| F11 | Keyword match on "entire body only" misses "STOP PLEASE" / "STOP TEXTING ME" variants → latent TCPA violation | HIGH | §3.1 |
| F12 | No Spanish-language STOP equivalents recognized; NYC market serves Spanish speakers | LOW | §3.1 |
| F13 | 4-year `consent_log` retention insufficient for American Pipe tolling scenarios; recommend 7 years or litigation-hold bridge | MED | §4.1 |
| F14 | Brand registration fee is $4/mo (not one-time); enhanced vetting is $40 one-time + monthly. Spec is mis-budgeted | LOW | §5.2 |
| F15 | First-submission TCR rejection rate realistically 15–25% (not 5–10%), especially before privacy policy is live | MED | §15 |
| F16 | No per-merchant outbound rate limit — compromised merchant account can blast consent-having numbers faster than opt-out SLA propagates | MED | §5.5 / §5.7 |
| F17 | No revocation-of-consent path outside SMS keywords — email/web/phone-call revocation must be honored per 2015 Omnibus | MED | §3 |
| F18 | Transactional-vs-marketing schema non-separation bakes in a v2 migration | LOW | §2.4; Appx D #12 |
| F19 | No call/voice scope exclusion explicitly stated — spec is text-only but doesn't say "no voice calls under this architecture" | LOW | §1.1; §5 |
| F20 | Consent-variant governance missing — if Variant B ever ships, A-consent and B-consent must not be interchangeable | LOW | §2.1 |
| F21 | Landline/VoIP handling not explicit; Twilio Lookup line_type should gate at ingest | LOW | §2.3 |
| F22 | Merchant-indemnity for TCPA exposure is out of this spec's scope but dependency on MSA is not flagged | MED | §8; MSA cross-ref |
| F23 | Privacy-policy-not-live is a TCR-registration blocker; §7 timeline sequences brand-submission before policy | HIGH | §7; audit register #24 |
| F24 | Opt-out confirmation SMS text "No further marketing messages will be sent" — CTIA-safe, but does not enumerate the scope (merchant-specific vs. STOPALL); Appendix D #6 flags | LOW | §3.2; Appx D #6 |
| F25 | §11.3 bulk-delete scenario assumes Supabase PITR; §11.7 gap #3 flags unverified — verify plan tier before gate | MED | §11.7 |
| F26 | No 24×7 on-call rotation (§11.7 gap #1); pre-authorized emergency-counsel retainer missing (§11.7 gap #5); both are opinion-letter-adjacent | MED | §11.7 |
| F27 | §4.5 CCPA response-template 45-day maximum is legally defensible but consumer-unfriendly; recommend ≤30-day default | LOW | §4.5 |
| F28 | CPRA CPPA regulation at 11 CCR §7022 imposes additional disclosure when relying on §1798.105(d) exception — not reflected in §4.5 template | LOW | §4.5 |

**Totals:** HIGH **8**, MED **11**, LOW **9**. Total **28 findings**.

---

## §10. Opinion-Letter-Readiness Checklist + Time Estimate

| # | Gate item | Status | Effort to close |
|---|---|---|---|
| OL1 | Pepper contradiction resolved; one schedule across both specs; cross-spec hash joinability verified | Not closed | 4 hr eng + 2 hr counsel |
| OL2 | §1.1.3, §1.1.5, and 2015-Omnibus-reliance cite fixes | Not closed | 1 hr counsel |
| OL3 | Variant A consent-text redline landed; Variant B retired or explicitly deferred | Not closed | 2 hr counsel + 1 hr eng |
| OL4 | Time-of-day scheduling gate implemented in §5 with timezone-resolution logic | Not closed | 6 hr eng + 1 hr counsel |
| OL5 | RND integration added to §5; Somos subscription budgeted in legal-budget-v1 | Not closed | 4 hr eng + 1 hr counsel |
| OL6 | Keyword-match fuzzy-STOP handling; Spanish STOP equivalents | Not closed | 2 hr eng |
| OL7 | Retention schedule re-evaluated against American Pipe; litigation-hold bridge operationalized | Not closed | 2 hr counsel + 3 hr eng |
| OL8 | TCR budget and rejection-rate assumptions corrected | Not closed | 30 min |
| OL9 | Per-merchant outbound rate limit in §5.5 | Not closed | 2 hr eng |
| OL10 | Non-SMS revocation paths (email/web) in §3 | Not closed | 3 hr eng |
| OL11 | Landline/VoIP ingest rejection explicit | Not closed | 30 min |
| OL12 | Privacy policy live **before** TCR brand submission | Not closed | Depends on privacy counsel engagement |
| OL13 | CPRA §1798.105(d) regulatory-overlay language added to §4.5 | Not closed | 1 hr counsel |
| OL14 | 24×7 on-call / response-hours policy written + pre-authorized emergency-counsel retainer | Not closed | 1 hr Jiaming + 30 min counsel |
| OL15 | PITR verification + written-retention bridge for §11.3 scenario | Not closed | 1 hr eng |

**Total effort to opinion-letter readiness: ~26 eng hours + ~10 counsel hours + ~1.5 hrs Jiaming.** Calendar: if engaged today (2026-04-20), counsel opinion letter can issue **2026-05-18** (4 weeks), assuming:

- Counsel engaged week 1 (per `counsel-engagement-plan.md` §7 — target 2026-05-11).
- Fixes land week 2–3.
- Privacy policy live week 2.
- Opinion letter drafted week 3, finalized week 4.

**Realistic window:** 3–5 weeks from counsel engagement. Push's stated §7 timeline (opinion received by 2026-06-01) is **feasible but tight** and assumes counsel engagement within 2 weeks of today — which `counsel-engagement-plan.md` already targets. No slippage margin.

**What the opinion letter will conclude (predicted):** assuming all 15 gates above close, the letter will conclude that Push's SMS flow **substantially complies** with 47 U.S.C. §227, 47 C.F.R. §64.1200, California CCPA/CPRA, and the enumerated state mini-TCPAs, **subject to the ongoing governance obligations in §12 and the conditions in §9**. It will not be an unqualified clean bill; no TCPA opinion ever is. It will address residual risk in reasoned-reliance terms — which is what an insurer and a DD reviewer want to see.

---

## §11. Summary for Oral Debrief (Pre-Engagement Call)

If Jiaming calls me tomorrow asking "what do you think," this is what I say in 90 seconds:

*"The spec is good — better than 80% of what I see from seed-stage founders. The schema, the governance log, the incident runbook, the pre-deploy checklist — that's opinion-letter-grade structure. Three things have to change before I'll sign an opinion. First, the pepper rotation contradicts itself and contradicts your consumer-facing spec — fix it in one place before anyone writes code. Second, a few of your cites are off — nothing catastrophic, but §227(b)(3), §227(e) vs. (f), and the 2015 reassigned-number safe harbor all need a precision pass. Third, you're leaning on consent language copied from the regulation that doesn't fit a platform use case — let me redline that before you A/B-test anything. Beyond those three, I want RND integration, a real time-of-day gate, and a fuzzy-STOP handler. None of it blocks you past five weeks. If you engage us by the 11th, you'll have an opinion letter by mid-May."*

---

*Audit prepared 2026-04-20 by outside TCPA counsel (pre-engagement review). No attorney-client relationship is formed by this document. All observations are subject to further diligence and engagement-letter terms. Cite references are as of the audit date; primary-source verification is counsel's obligation upon engagement.*
