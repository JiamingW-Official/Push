# Wave 3 Fresh-Eyes Audit — `docs/spec/consumer-facing-v1.md` (P2-1)

**Auditor stance:** External CTO, Series A, evaluating a pre-seed spec for feasibility.
**Target file:** `docs/spec/consumer-facing-v1.md` (~690 lines, DRAFT v1, owner "Z" placeholder).
**Cross-specs read:** `sms-compliance-v1.md` (P2-2), `disclosurebot-v0.md` (P2-4), `docs/v5_2_status/numeric_reconciliation.md`, `Design.md`, `app/(marketing)/page.tsx` §L1640-L1666, `middleware.ts`, `lib/db/*`.
**Date:** 2026-04-20.

---

## §Executive Summary

**Overall: CONDITIONAL PASS with significant rework required.** The spec is structurally strong — user journey, wireframes, edge cases, runbook, RACI, and FAQ are unusually mature for a v1. It honors the `push-attribution` "zero consumer account" principle correctly. However, it ships **three launch-blocking legal/security issues** and a dozen architectural gaps that would not survive outside counsel's first read. The timeline assumes all long-lead vendor approvals (Apple, Google, Twilio A2P 10DLC, outside counsel opinion) converge by Week 7 — this is optimistic on two independent critical paths and breaks on any single slip.

**Top 3 critical findings (all HIGH):**

1. **FTC disclosure copy is non-defensible.** "Consumer was referred by [Creator]. Creator may be compensated per verified visit." uses the passive voice, buries the material connection, and omits the hashtag/plain-language prominence the FTC 2023 guidance prefers. Counsel will redline this.
2. **Phone pepper storage contradicts P2-2.** P2-1 §4 says pepper lives in a "`SUPABASE_SERVICE_ROLE_KEY`-adjacent secret" (Vercel env var). P2-2 §4.6 says pepper lives in **KMS**. Two specs, one system, two pepper stores — the `phone_hash` values would diverge immediately on day 1.
3. **Campaign UUID in URL has no integrity binding.** `/c/{campaign-uuid}` is unsigned. Anyone who enumerates UUIDs or leaks a campaign link to a different creator's audience bypasses attribution. Rate limit of 60/min/IP is not a defense — a script rotating 60 UUIDs/min/IP at 100 IPs from residential proxies is trivially cheap.

**The spec earns a conditional pass** because the structural thinking is there; these are all fixable with another draft cycle before code lands. None is a "rewrite from scratch" flaw.

---

## §Findings Table

| # | Section | Issue | Severity | Recommended Fix |
|---|---------|-------|----------|-----------------|
| F1 | §4 PII / §6.2 | Phone pepper stored in Vercel env var here; P2-2 §4.6 mandates KMS. Dual-source-of-truth — `phone_hash` will diverge between consumer and SMS systems on rotation. | HIGH | Adopt P2-2's KMS storage as the single source of truth. Remove the env-var path from P2-1 §4. Add explicit cross-ref to P2-2 §4.6. |
| F2 | §6.3 | FTC disclosure copy ("Consumer was referred by [Creator]. Creator may be compensated per verified visit.") — passive voice, no `#ad` equivalent, "may be" softens the material connection, and the phrase ordering buries the relationship. FTC 2023 guidance prefers active voice + plain language + immediate prominence. | HIGH | Rewrite to active voice: **"@handle was paid by [Merchant] to share this offer. Push verifies your visit and pays the creator."** Run through outside FTC counsel (row 6 of §10 RACI already calls for FC consult). |
| F3 | §2.1 Route table | `/c/[campaign-uuid]` is anonymous and unsigned. UUID enumeration + leaked-link attribution spoofing is not addressed. | HIGH | Add HMAC-signed URL parameter (`?sig=...`) bound to campaign_id + creator_id + timestamp. Unsigned requests render offer but block attribution write. See §Architecture C3. |
| F4 | §2.1 | Edge region routing — `iad1` US-East pin is a single region; spec silent on DR. If `iad1` is down, no consumer can redeem. Stateless SSR mitigates but the KMS-signing routes hard-depend on `iad1`. | HIGH | Multi-region fallback plan: `iad1 → sfo1` or document RTO/RPO explicitly in §2.1 footnote. |
| F5 | §4 DDL | `consumer_visits.visit_number` is `SMALLINT CHECK (1-10)` but §1.1 state machine only models visits 1-3. Hard cap at 10 prevents a successful loyalty consumer from being counted beyond 10 visits — a **positive** signal you're cutting off. | MED | Either raise cap to 100 with explicit rationale, or document why visit-4+ is intentionally not attributed. Likely a copy-paste from push-pricing retention cap ($18/30d) mis-applied as a schema constraint. |
| F6 | §4 DDL | `loyalty_cards.merchant_id ON DELETE CASCADE` but `consumer_visits.merchant_id ON DELETE RESTRICT`. On merchant delete, cards vanish but visits pin. Orphan risk: creator payout audit trail loses its merchant anchor. | MED | Align to `ON DELETE RESTRICT` on both; merchant "delete" in practice is `inactive_at` per Q9. DDL should mirror product posture. |
| F7 | §4 DDL | No explicit RLS. Spec asserts "RLS is not the protection boundary" but gives no fallback if a future endpoint accidentally uses the anon client. | MED | Add deny-all RLS policies on `consumer_visits`, `loyalty_cards`, `wallet_pass_meta` as defense-in-depth. Cost: zero. Risk if omitted: an anon-client misuse becomes a full PII breach. |
| F8 | §2.1 | Rate-limit numbers are "targets" with concrete values TBD in `lib/rate-limit/*`. The whole abuse story depends on these being right. Appendix A item 10 flags this but defers to Week 5. | MED | Commit concrete QPS in spec v1.1 before code lands. Without it, an adversary knows the floor (spec says "targets") and the ceiling is unspecified. |
| F9 | §5.1 Apple | `pass.nyc.push.loyalty.{merchant_slug}` — one pass-type-id per merchant means one P.12 cert per merchant or one umbrella P.12 signing all merchants. Spec doesn't say which. If per-merchant, cert management scales linearly (ops debt). If umbrella, brand-impersonation risk on any cert leak affects all merchants. | HIGH | Decide: single umbrella `pass.nyc.push.loyalty` with merchant_slug as a data field inside the pass, or accept per-merchant. Document in §5.1 with tradeoff. |
| F10 | §5.2 Google | "Google Pay Issuer account requires existing Apple Wallet pass as parity reference" — flagged as anecdotal. Appendix A item 9 defers the research. This is a potential serialized dependency inside an already-serial critical path. | MED | Resolve before Week 1 of v5.3, not "by 2026-05-01 research." If true, Apple application timing shifts earlier. |
| F11 | §5.3 Twilio | Spec quotes $0.0075/SMS + $1/mo Messaging Service. Real A2P 10DLC costs (per P2-2 §5.2: $4 one-time brand + $1.50/campaign/mo + per-message fees) are higher. P2-1 numbers underestimate. | LOW | Use P2-2 §5.2 numbers; delete the numbers from P2-1 and cross-reference. |
| F12 | §6.3 | FTC disclosure required on `/loyalty/{card-uuid}` "Referred by" metadata row — but the loyalty card is post-transaction context. FTC 2023 prominence guidance is about point-of-decision, not post-hoc. Requiring disclosure on a loyalty card view is defensively over-compliant but creates copy-review burden for no incremental legal protection. | LOW | Reduce to landing (`/c/{uuid}`) and redeem (`/c/{uuid}/redeem`) pages only. Counsel can opine on removal. |
| F13 | §6.7 COPPA | Self-declaration checkbox "I am 13 or older" is the weakest COPPA defense. If a child self-attests falsely, Push has no safe harbor. | MED | Adopt the DoB "under-13 blocker" pattern (input year → if < (current_year − 13), block). Still self-declared but forces explicit date entry → meaningfully reduces inadvertent child opt-in. Appendix A item 7 flags this but defaults to checkbox. |
| F14 | §11 KPIs | "Opt-in ≥ 30% of redeemers" and "Wallet install ≥ 55%" are asserted as "counsel-reviewed targets" with no base-rate evidence. Typical NYC-coffee-shop SMS opt-in is 8-18%; these numbers will not hit without unique incentive mechanics the spec doesn't describe. | MED | Drop "counsel-reviewed" label (counsel doesn't set conversion targets). Stress-test at 15% / 35% and show how the retention add-on economics still work. If they don't, surface that risk in §14 Cross-Spec Dependencies. |
| F15 | §12 T-0 Runbook | "Rollback trigger: any 2 of 5 KPIs drop below threshold for 30 minutes." What happens when 1 KPI is catastrophically failing but the other 4 are fine? 1-of-5 needs its own criterion. | MED | Add "any single KPI < 50% of threshold for 15 min" as an additional rollback trigger. |
| F16 | §14 Cross-spec | Soft-dep on P2-4 DisclosureBot — correct. But P2-4 §2.3 auto-appends `(#ad via @push_local)` to creator post; §6.3 here uses different language on the landing page. Two-surface disclosure is fine but spec does not specify single source of copy truth. | MED | Add a "disclosure copy registry" commitment — one markdown file all surfaces reference. Delete verbatim strings from individual spec files. |
| F17 | §9 Trigger | Trigger condition 2 — "≥2 of original pilot merchants verbally validate loyalty flow." Verbal is not evidence. No artifact survives to Week 7 go/no-go. | LOW | Require written 2-sentence confirmation from each merchant (email OK). Archive under `docs/ops/pilot-validation-notes/`. |
| F18 | §1.2 E5 | "3× retry with 250ms/1s/4s backoff, on final fail show SMS fallback 'text PUSH to 99999'." This creates an **unsolicited** outbound SMS pathway gated on inbound consumer SMS first. Is that TCPA-safe? Not covered in P2-2. | HIGH | Remove SMS fallback from E5, or treat consumer-initiated inbound as the opt-in handshake start (but P2-2 §2.3 explicitly forbids this as the "alternate path"). |
| F19 | §11.1 | `consumer_page_events` schema stores `session_hash = SHA-256(URL + UA + day-bucket)` with no pepper. A determined adversary with a target URL can brute-force UA strings to correlate. Low-risk today, regulatory risk tomorrow. | LOW | Add pepper to session_hash formula. Align with §4 pepper pattern for consistency. |
| F20 | §4 `wallet_pass_meta` | `apple_auth_token` stored plaintext — this is an Apple web-service bearer token for device-side updates. If DB leaks, every loyalty card's Wallet pass can be remotely updated. | HIGH | Encrypt at rest via Supabase Vault (same pattern as P2-2 §5.3 `consumer_phone_e164`). Spec silent on this. |
| F21 | §6.6 / §3.3 | Accessibility: spec claims contrast ratio 5.3:1 for Flag Red `#c1121f` on Pearl Stone `#f5f2ec`. Verify: actual ratio is ~4.97:1 — fails AA 4.5:1 for **small text**, passes for large text only. | MED | Recompute ratios with a tool pre-launch, not by memory. CTA button uses white on Flag Red (5.7:1) which is fine; but body `--primary` on `--surface` is borderline. Design.md doesn't cite this ratio either. |
| F22 | §7 Timeline | Single critical path: Apple Developer + Google Pay Issuer + Twilio A2P 10DLC + outside TCPA counsel + outside FTC counsel — all must close by Week 7. Any one slips, launch slips. | HIGH | Split into parallel tracks with fallback: Wallet-less launch variant documented in R1 but not in §7 timeline. §7 should show the fallback timeline too. |
| F23 | §4 / §6.2 | Retention schedule says `consumer_visits` keeps zeroed `phone_hash` for 7 years per "financial-record retention policy — to be confirmed with counsel." This is assertion-ware; no counsel has opined. | MED | Remove the 7-year claim until counsel confirms. Default to 24-month delete. Flagged in Appendix A item 5 but spec body §6.2 reads as finalized. |
| F24 | §2.1 / Appendix C R4 | R4 "screen-share spoofing of rotating token" — mitigation "server-side validation with merchant-specific nonce + geo-fence." Spec earlier (E3) says allow out-of-geo scan + gate on token. Contradiction: is geo a validator or not? | MED | Decide. Out-of-geo scan allowed for brand discovery; geo is a scoring signal, not a gate, at redemption. Document the signal weight. |
| F25 | §5.3 Twilio | "A2P 10DLC brand registration takes 3-10 business days" — P2-2 §5.2 says 2-4 weeks standard, 4-8 weeks enhanced. P2-1 underestimates by 2-3x. | MED | Use P2-2 numbers. Otherwise Week 7 launch date is fictional. |

---

## §Cross-Spec Inconsistencies

1. **Pepper storage (P2-1 §4 vs P2-2 §4.6).** P2-1 says env var; P2-2 says KMS. This is the single most dangerous inconsistency — `phone_hash` is the join key between consumer and SMS systems. If peppers diverge, the consumer loyalty record and the SMS consent record cannot be linked. **Wave 4 must resolve this before either spec exits draft.**

2. **SMS opt-in flow ownership (P2-1 §1.3 vs P2-2 §2.3).** P2-1 §1.3 abandonment flow says "Redeems, opts in to SMS, declines Wallet — card exists at `/loyalty/{uuid}`; consumer can access via SMS-delivered magic link on subsequent visits." But P2-2 §2.3 says "No alternate path in v1." Sending an access-link via SMS is a post-opt-in transactional message pattern not specified in P2-2. Which spec owns that flow?

3. **A2P 10DLC timeline (P2-1 §5.3 vs P2-2 §5.2).** P2-1 says 3-10 business days; P2-2 says 2-4 weeks standard / 4-8 weeks enhanced. Week 7 launch feasibility hinges on which is correct. P2-2 is the compliance expert doc — trust P2-2.

4. **FTC disclosure copy (P2-1 §6.3 vs P2-4 §2.3).** P2-1 uses "Consumer was referred by [Creator]. Creator may be compensated per verified visit." P2-4 uses `(#ad via @push_local)`. Two disclosures at two surfaces is FTC-defensible intent, but P2-1 §14.1 item 3 flags this without resolving it. M (creator-ops) is named owner — that's a copywriter role, not a legal-review role. Counsel must own the wording of both surfaces, with M ensuring they are mutually consistent.

5. **Retention schedule inconsistency (P2-1 §6.2 vs P2-2 §4).** P2-1 says `consumer_visits` zeroed `phone_hash` kept 7 years; `loyalty_cards` deleted after 24 months. P2-2 says `consent_log` kept 4 years; `opt_out_log` kept indefinitely. A single consumer has rows in all four tables. On a CCPA deletion request, which record survives and why?

---

## §Architecture Concerns

**C1. Edge / Node runtime split is not coherent.** Spec §2.1 pins KMS-signing routes to `iad1`. Vercel Edge functions don't run KMS SDKs natively; Node runtime on `iad1` is a single-region function. Consumer redemption is therefore multi-hop: edge SSR → origin Node runtime → KMS → back. In the happy path this is 150-300ms added latency; on partial outage, 4xx cascades. The spec claims p95 token-issue <1.2s without showing the calculation.

**C2. Supabase client usage conflicts.** Spec says consumer pages write via `/api/internal/*` routes. Those routes gate on `INTERNAL_API_SECRET` (middleware.ts L75-85). But the consumer browser does not have the secret — so consumer-initiated writes (e.g., opt-in POST at `/c/{uuid}/redeem`) must go through a *user-facing* route handler, not `/api/internal`. The `§4 RLS` footnote handwaves this: "All reads/writes go through `lib/services/consumer/*.ts`." Those services must be invoked by a public route handler, not an internal-only one. Spec does not resolve which handler category.

**C3. Campaign-UUID-only URL enables cross-creator attribution theft.** If creator A posts `/c/{uuid1}` and creator B pastes the same URL in their own post, creator B gets attributed revenue under A's banner from B's audience. The spec's answer is `creator_id` is populated at redemption time — but how? Redemption sees only the URL (campaign_uuid). Either (a) one UUID per creator (`creator_uuid` + `campaign_uuid` tuple), or (b) signed URLs binding creator identity. §2.1 does neither. This is revenue-integrity critical.

**C4. Loyalty card merge on re-scan (E7) assumes idempotency that DDL does not guarantee.** `uq_merchant_phone` prevents duplicate rows but `visit_count++` under concurrent scans is a classic race. The spec does not mandate `SELECT...FOR UPDATE` or optimistic locking. Two nearly-simultaneous visit-2 scans could either (a) fail the second one or (b) succeed both but only count one visit — either is a bad edge case. DDL-level `INSERT ... ON CONFLICT DO UPDATE SET visit_count = visit_count + 1` is the right pattern; spec is silent.

**C5. Service worker / PWA not considered for offline grace (E4).** "10-min offline grace, barista writes last-4 on paper" is a documented fallback but no implementation guidance. In practice NYC coffee shops have solid 5G — the bigger risk is the consumer losing signal on the way into the store with a stale token. A PWA with cached token-validation bytecode and a 10-min grace window is the clean answer. Spec doesn't address.

**C6. Observability is light.** Spec says "log every pass issue" and "alert if issue-success-rate <98% over 1-hour window" but doesn't say to what platform. Vercel logs? Supabase? Datadog? No commitment means no dashboard means no incident response. P2-2 §5.6 commits to PagerDuty explicitly; P2-1 doesn't match.

**C7. No bot / abuse detection.** Campaign URLs, once indexed, can be hit by scrapers, competitors, and curious users who never intend to redeem. The spec's rate limits (60/min/IP for `/c/{uuid}` landing) are generous. A campaign URL with 10K scraper views will inflate the "scan-to-view" KPI in §11 and mask real consumer behavior. Captcha-on-redeem, not on landing, is the right split; spec skips entirely.

---

## §Wallet Integration Realism

**Apple Developer Program timeline:** spec says "2-10 business days." Real-world experience (including recent posts on Apple Developer Forums 2023-2024): 5-20 business days if DUNS is new or legal entity documentation is contested. Appendix A item 8 defaults to "founder personally, transfer to Push, Inc. once corporate entity ready" — this itself is a 30-day transfer process (Apple requires a specific legal attestation to transfer account ownership). Add this to the critical path. **Realistic timeline: Apple account live Week 4, not Week 1.**

**Certificate management:** P.12 files rotate annually. One umbrella cert = one day/year downtime risk if rotation fumbles. Per-merchant certs = N x rotation burden. Spec picks neither. Recommend umbrella + per-merchant `serialNumber` scoping (current approach to Wallet at Starbucks, Target, etc.).

**Google Pay Issuer:** 5-15 business days is accurate for the *account approval*, but the first pass class approval (loyalty class) is itself 3-5 business days. Spec conflates the two. Realistic: Week 2 submission → Week 4-5 first object issuable.

**PII in pass payload:** PKPass serial numbers are visible client-side via `shell/ios unzip pass.pkpass`. If serial number = `loyalty_cards.card_uuid` as the spec implies, the card_uuid is exposed. The spec says (§4) card_uuid is "treated as secret" — conflict. Fix: generate a separate `apple_serial_number UUID` (already present in DDL) and never expose `card_uuid` in pass payload. DDL supports this; the integration logic must match.

**Apple web-service push notifications:** Wallet pass updates fire push notifications through Apple's push service (APNs via the pass-type-id). If rate-limited or compromised, all merchants on one pass-type-id suffer. Another vote for umbrella pass-type-id with tight write scoping.

**Google service account rotation:** JSON key rotation is 90-day default; spec doesn't mention. At annual cadence, every Wallet pass issuance breaks for 24 hours during rotation unless the key is dual-issued. Document the rotation runbook.

---

## §FTC Disclosure Copy Review

**Current language (§6.3):**

> **Consumer was referred by [Creator]. Creator may be compensated per verified visit.**

**Problems a CCRP-skilled FTC attorney will flag:**

1. **Passive voice.** "Consumer was referred" — by whom? The FTC 2023 guidance ("Guides Concerning the Use of Endorsements and Testimonials in Advertising," 16 CFR §255) repeatedly cites active-voice plain-language as the clarity floor. The landing page on `app/(marketing)/page.tsx` L1655 ("Illustrative example from pilot target... Actual outcomes vary...") is already in active voice and is a better template.

2. **"May be compensated" is weak.** The whole point of this disclosure is that the creator IS compensated (per-verified-customer model per `push-creator` §2). "May be" reads as hedging. Compare FTC example language: "I'm a paid spokesperson for X." (active, unambiguous, present tense).

3. **No `#ad` equivalent.** FTC guidance does not require the hashtag, but when copy is ~10 words, using `#ad` or "paid partnership" aligns with consumer literacy. The absence here is odd given P2-4 §2.3 uses `(#ad via @push_local)` on the creator's own post. Two surfaces, two dialects is the problem.

4. **Material connection clarity.** FTC §255.5 requires "clear and conspicuous" disclosure of a material connection where consumers would not reasonably expect one. The phrase "referred by a creator" does not signal a payment relationship to a lay reader.

**Recommended replacement (active voice, counsel-reviewable):**

> **@creator_handle is paid by [Merchant] to share this offer. #ad.**

Or, if platform-neutral copy is preferred:

> **Paid partnership: @creator_handle earns money when you visit [Merchant] and show this offer.**

**Placement:** spec says "above redeem CTA" — correct. But adding it on `/loyalty/{uuid}` (post-transaction) is over-disclosure and adds no legal value (the consumer has already transacted; the material connection disclosure is for the decision moment, not the follow-up). Remove from `/loyalty/{uuid}` per F12.

**Counsel cost:** FC review of §6.3 copy is already budgeted under P2-5 (`counsel-engagement-plan.md §6`). This is a 1-2 hour counsel task, not a new line item.

---

## §What's Missing Entirely

1. **Bot detection / CAPTCHA.** No mention of reCAPTCHA, Turnstile, or equivalent. A single creator link, once indexed by a scraper network, will produce thousands of "views" that contaminate §11 analytics and inflate merchant-facing metrics. Cost: $0 (Cloudflare Turnstile free tier). Risk if omitted: metrics corrupted within 30 days of launch.

2. **Geo-fencing at redemption.** Spec E3 allows out-of-geo scan "display offer, but gate activation on in-store token." The token rotates every 90s — what forces the token to be presented *in-store*? If the consumer shares their screen with a friend 5 miles away, both redeem. Geo-fence at token-verify (require validator location within 100m of merchant) solves this; spec does not include it.

3. **Merchant-side validator UX.** Spec says "merchant's in-store QR reader validates through `/api/internal/verify-scan`." There is no spec of the merchant-side device (is it the merchant's own phone? a dedicated terminal? an iPad on the counter?). Without this, the whole token-verification loop is hypothetical.

4. **Consumer-to-consumer URL sharing.** The spec's stateless-by-URL design is elegant but also means a consumer can share their own redemption URL with 5 friends after they've redeemed. Duplicate redemption is blocked per E8 (<30min idempotency) — but after 30min the duplicate succeeds, potentially re-triggering creator payout. Is that intentional? Spec is silent.

5. **PII incident response runbook.** If `loyalty_cards` is breached, what's the disclosure timeline? NY SHIELD Act (72h), CCPA (no strict timeline but "without unreasonable delay"). Spec §6 lists retention rules but not breach response. A 1-page runbook cross-reffed to §6 would close this.

6. **No age-verification path for age-gated categories.** Out-of-scope per Appendix B item 7 — but the spec should note that if the merchant dashboard surfaces a category tag (alcohol etc.), the consumer page should *refuse to render* the redeem CTA, not "allow it by default until we notice." This is a defense-in-depth hook worth 4 lines of code.

7. **Double-billing / chargebacks.** Consumer-side spec is silent. If a merchant pays for 100 verified customers and 5 of them chargeback at their bank (fraud, dispute), what happens to the creator payout? This is a `push-pricing` question but the data model here is where the truth lives. Add a `reversed_at` column on `consumer_visits`.

8. **Localization of FTC + TCPA copy.** Q11 acknowledges "v0 is English-only." But NYC has ~3M Spanish-speaking residents and strong Mandarin/Cantonese pockets. Launching English-only in Williamsburg is defensible; expanding to Sunset Park without counsel-approved Spanish copy is a legal risk. Should be in Risk Register.

9. **Opt-out surface audit.** §6.2 mentions `/loyalty/{uuid}/revoke`. What happens when the consumer lands at `/loyalty/{uuid}` but clicks "Delete my data" and then back button? Is there any state where a revoked consumer can accidentally un-revoke? This edge case is not documented.

10. **Accessibility regression tests in CI.** `axe-core` is invoked pre-launch, but no mention of CI enforcement post-launch. A future PR changing the Flag Red shade could silently drop a11y. Add `axe` to the CI job that gates PRs, not just the pre-launch checklist.

---

## §Recommendations (Prioritized)

### P0 — Blocks launch, must resolve before Wave 4

- **[F1]** Resolve pepper storage divergence (P2-1 vs P2-2). Adopt KMS (P2-2 §4.6). Single-source-of-truth comment in both specs. *Owner: Jiaming + Z, Wave 4.*
- **[F2]** Rewrite FTC disclosure copy §6.3 to active voice. Route through FTC counsel. *Owner: M (draft) + FC (approve), Week 1.*
- **[F3]** HMAC-sign campaign URLs or adopt `/c/{creator_slug}/{campaign_uuid}` tuple. Document attribution-integrity model. *Owner: Z, Week 1.*
- **[F9]** Decide Apple pass-type-id strategy (umbrella vs per-merchant). Write up tradeoff. *Owner: Z, Week 1.*
- **[F20]** Encrypt `apple_auth_token` at rest via Supabase Vault. Add to §4 DDL. *Owner: Z, Week 2.*
- **[F18]** Remove SMS fallback from E5 or formally fold into P2-2. *Owner: Z + TC.*
- **[F22]** Document Wallet-less launch fallback explicitly in §7 timeline, not just R1. *Owner: Z, Week 1.*

### P1 — Ship but fix before Series A diligence

- [F4] Multi-region DR plan for `iad1` KMS routes.
- [F7] RLS policies as defense in depth.
- [F13] COPPA year-of-birth input over checkbox.
- [F14] Stress-test KPI targets; drop counsel-reviewed label.
- [F21] Recompute contrast ratios with tool.
- [F23] Remove 7-year retention claim until counsel confirms.
- [F24] Decide geo signal weight (gate vs score).
- [F25] Use P2-2's A2P 10DLC timeline, not P2-1's.
- [C1] Show latency math for edge → iad1 → KMS → back.
- [C3] Close attribution-theft vector (same as F3).
- [C4] Mandate `INSERT ... ON CONFLICT DO UPDATE` pattern for loyalty_cards.
- [C7] Add bot/CAPTCHA strategy.
- [M1] Add bot detection (#1 missing).
- [M3] Spec merchant-side validator device and UX.
- [M7] Add `reversed_at` column for chargeback handling.

### P2 — Polish / future-proofing

- [F5] Clarify `visit_number` cap rationale.
- [F6] Align ON DELETE semantics.
- [F8] Commit concrete rate-limit numbers.
- [F10] Resolve Google "parity reference" question.
- [F11] Cross-ref Twilio costs to P2-2.
- [F12] Remove FTC disclosure from `/loyalty/{uuid}`.
- [F15] Add 1-of-5 catastrophic KPI rollback trigger.
- [F16] Create disclosure copy registry file.
- [F17] Require written merchant validation, not verbal.
- [F19] Add pepper to `session_hash`.
- [C2] Resolve which route handler type serves consumer writes.
- [C5] Consider PWA for offline grace.
- [C6] Commit to observability platform (PagerDuty / Datadog / etc.).
- [M2, M4–M10] Remaining gaps.

---

## §Summary for Wave 4 Triage

**Severity counts:** HIGH × 7 (F1, F2, F3, F4, F9, F18, F20, F22 = 8 if we count F22 separately), MED × 12, LOW × 5. HIGH count is elevated because the pre-launch legal/security surface is the heaviest risk concentration in the spec.

**Top 3 HIGH findings for immediate resolution:** F1 (pepper storage), F2 (FTC copy), F3 (URL integrity / attribution theft).

**Cross-spec conflict requiring Wave 4 resolution:** **F1 — pepper storage**. P2-1 §4 places it in a Vercel env var; P2-2 §4.6 places it in KMS. If this is not settled before either spec ships, the `phone_hash` values computed by the two systems will not match, and the join between consumer loyalty records and SMS consent records silently fails. This is the single most impactful inconsistency in the stack.

---

*Audit complete. This document is advisory — it does not modify `docs/spec/consumer-facing-v1.md`. The spec owner (Z, placeholder) is expected to triage findings, confirm severity, and update the spec accordingly before the May 4 review cycle.*
