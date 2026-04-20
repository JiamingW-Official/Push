# Pilot Demand Proof Plan — Investor Prep

**Audit reference:** `docs/v5_2_status/audits/05-investor-dry-run.md` Q3 + Q14 (both C grade).
**Owner:** Jiaming.
**Last updated:** 2026-04-20.

---

## §The critical gap

The unit-economics package quoted in `push-pricing/SKILL.md` §5 is built on a **9-month average merchant lifetime** assumption. That single number drives:

- LTV: $706 monthly GM × 9 months = $6,354
- LTV/CAC: $6,354 / $420 = 15.1× base
- LTV/CAC stressed (churn 2× / CAC 1.5×): 10.0× — which is the top-line investor metric

Until **week of 2026-06-22 (Week 4 of Q2 2026)** — the first verified-pilot readout — there is **zero empirical data** on merchant retention, repeat-customer rate, or Beachhead-only CAC. Every defensible answer for an investor today is "this is the assumption; here's the sensitivity; here's how we'll prove or refute it within 8 weeks."

A C-grade answer in the dry-run says "9 months because that's what we modeled." A B-grade answer adds the sensitivity table (already in `push-pricing` §5). An A-grade answer adds **what we can show today, what we will show in Week 4, and what we'd ask the investor to do if they want a faster signal**. This document is the A-grade answer.

---

## §What we can show pre-pilot (March–June 2026)

| Artifact | Target Date | What it proves | What it doesn't prove |
|---|---|---|---|
| **10 LOIs from Williamsburg Coffee+ merchants** | 2026-04-23 (Day 4 outreach EOD) per `docs/week-0/pilot/williamsburg_outreach_log_TEMPLATE.md` | Demand exists at $0 Pilot pricing; 10 merchants will sign a pilot contract | Doesn't prove they'd pay $500/mo; doesn't prove retention |
| **20+ Beachhead-window LOIs** (merchants 11–30) | 2026-05-11 (Week 3) | Demand exists at $500/mo + per-customer pricing | Doesn't prove they'll convert; doesn't prove retention |
| **3 merchant reference calls** willing to verbally confirm "I would pay $500/mo + per-verified-customer if the system works" | 2026-05-18 (Week 4) | Investor can hear merchant willingness directly | Soft commitment; doesn't bind |
| **Pilot dashboard live with first real scan events** | 2026-06-08 (Week 7) | The verification pipeline is functioning end-to-end | Doesn't prove accuracy at scale |
| **Pilot Net Promoter Score from first 5 merchants** | 2026-06-15 (Week 8) | Merchant satisfaction signal | NPS is leading, not lagging — doesn't prove retention |
| **First 2 merchants completing 4 weeks** with full verification | 2026-06-22 (Week 4 of Q2) — pilot readout | Verified-customer counts; first month-1 retention signal | Still only month-1; need 3+ months for retention curve |

This is the pre-readout artifact stack. **Each is realistic; none is fabricated.**

---

## §What we will show at pilot readout (2026-06-22)

| Metric | What we will report | Target band | Investor signal |
|---|---|---|---|
| Pilot merchants completed first 4 weeks | 8–10 of 10 | ≥7 | Pilot operationally feasible |
| Total verified customers across pilot | 50–150 (10 merchants × 5–15 each) | ≥50 | ConversionOracle pipeline works |
| ConversionOracle precision | ≥85% | ≥80% acceptable Month 1 | AI works in production |
| Pilot → Beachhead conversion rate | 5–7 of 10 (50–70%) | ≥60% target per `push-pricing` §9 experiment 1 | Willingness-to-pay validated |
| Beachhead Merchant 1 first-month verified customer count | 30–80 | ≥30 | Beachhead unit economics start to emerge |
| Merchant NPS (Pilot cohort) | ≥40 | ≥40 | Retention leading indicator |

**A successful Week 4 readout takes Q3 (and Q3) the unit economics question from "C" to "A" in subsequent investor conversations.** A failed readout (e.g., precision <70%, conversion <30%) requires a strategy update before continuing fundraise.

---

## §Stress test of the 9-month merchant lifetime assumption

Sensitivity to actual merchant lifetime (holding monthly GM = $706, CAC = $420 from `numeric_reconciliation.md` row 84/85):

| Actual lifetime | LTV | LTV/CAC | Investor read |
|---|---|---|---|
| 6 months | $4,236 | 10.1× | Still clears 3× bar — thin but viable |
| 9 months (baseline) | $6,354 | 15.1× | Healthy |
| 12 months | $8,472 | 20.2× | Excellent |
| 18 months | $12,708 | 30.3× | Best-in-category for local commerce |

**Implication for investor conversation:** even at half the assumed lifetime (6 months — almost certainly conservative for outcome-priced + verified pilot delivering value), the unit economics still hit a 10× bar. The assumption is robust to a wide miss.

What would make the unit economics fail:
- Lifetime <4 months → LTV/CAC <6.7×; thin
- Monthly GM <$400 → LTV/CAC <8.5×; thin
- CAC >$700 → LTV/CAC <9×; thin

We monitor all three; pricing experiments in `push-pricing` §9 are designed to keep monthly GM ≥$700.

---

## §Comparable businesses' early-stage retention (estimated, requires validation)

| Reference business | Estimated early-merchant lifetime | Source / confidence |
|---|---|---|
| OpenTable early pilot (2000–2003) | 12–18 months at steady state | Industry conversations / public secondary; **Low confidence** |
| DoorDash early merchant | 9–15 months | Industry conversations; **Low confidence** |
| Yelp ad customer (2010s) | 6–12 months churn-heavy | Public reports; **Medium confidence** |
| Local marketing agency | 3–6 months (high churn, supports Push thesis) | Industry norm; **Medium-Low confidence** |

**Disclaimer required for any external use of this table:** all numbers are estimates from secondary sources or industry conversation; none are sourced to disclosed company financials. Our 9-month assumption sits in the midpoint of the disclosed-or-estimated bands.

---

## §What we ask the investor for

If the investor's diligence team needs the retention question answered faster than 2026-06-22:

1. **A warm intro to two former OpenTable / DoorDash operators** who can pressure-test the retention assumption from their first-hand experience. We'll schedule 30-minute calls and report back.
2. **A pre-pilot reference call** with two of our LOI'd merchants (after we have signed LOIs) — these are real local-commerce operators who can confirm willingness to pay before our system has run a single campaign. We can facilitate.
3. **A staged commitment:** if the investor can commit conditional capital pending pilot readout, we can reduce pilot risk by extending the pilot to 15 merchants instead of 10 (more data, better signal at readout).

---

## §Pilot readout format for investors

The 2026-06-22 readout will be packaged for investor consumption as:

1. **Investor memo (one page):** key numbers, what we shipped, what we learned, what changed in the model, what we're asking for.
2. **Live dashboard link** (read-only) showing real-time pilot data: campaigns, scans, verified customers, merchant NPS.
3. **Three pilot merchant reference availabilities** for direct investor calls (with merchant consent).
4. **Updated `numeric_reconciliation.md`** with actuals replacing assumptions in the relevant rows.
5. **Updated `pilot-demand-proof-plan.md`** (this file) with a §What actually happened section overwriting the §What we will show at pilot readout section above.

---

## §The founder narrative on this question

> "Today the 9-month merchant lifetime is a model assumption, not data. I won't pretend otherwise. What I can show you today is 10 LOIs from real Williamsburg merchants — I'd be happy to put two of them on a call with you. I'll have first verified-pilot data at the week of June 22 — eight weeks from now. The unit economics are robust to a 50% miss on lifetime: even at six months actual, we'd hit 10x LTV/CAC. The pricing-experiment plan in `push-pricing` §9 is designed to keep monthly GM at the level required for that math to hold. If you want to commit conditional capital pending pilot readout, I can extend the pilot to 15 merchants for a stronger signal. Otherwise, the next call should happen the week of June 22."

---

## §Lessons from investor conversations

*(append after each meaningful investor conversation: who, when, what landed, what didn't, what to change next time.)*

| Date | Investor | Round + Stage | What landed | What didn't | Change |
|---|---|---|---|---|---|
| | | | | | |
