---
name: push-hub
description: "Master routing skill for Push. Start here for ANY Push-related task. Routes to the correct domain skill based on the task type."
---

# Push Hub — Master Router

## What is Push
Push is Vertical AI for Local Commerce — a Customer Acquisition Engine for local Coffee+ operators. Push is NOT a generic creator-discovery app or loyalty platform (and not the two-sided-matching category that v4 once flirted with).

**Core Invariant:** Push only rewards verified, repeatable value creation.

**Primary Line:** "Push is Vertical AI for Local Commerce — a Customer Acquisition Engine that delivers AI-verified customers to local Coffee+ operators. ConversionOracle™ predicts. Claude Vision verifies. Software Leverage Ratio (SLR) measures."

## Quick Reference

### Latest Key Numbers (Updated 2026-04-18, v5.1)
- **Merchant Pricing (3 plans):** Pilot $0 (first 10 Coffee+) · Operator $500/mo min + $15–85/customer by vertical · Neighborhood $8–12K launch + $20–35K MRR target
- **Per-customer by vertical:** pure coffee $15 · Coffee+ $25 · dessert $22 · fitness $60 · beauty $85
- **Retention Add-on:** visit 2 $8 · visit 3 $6 · loyalty opt-in $4 (fitness/beauty tier: $24 / $18 / $12)
- **Per-merchant M6 steady:** $1,051 revenue · $731 GM (70%)
- **Per-customer GM:** $6.97 (27.9%)
- **LTV/CAC:** LTV $6,579 / CAC $420 / 15.7x base / 10.4x stressed
- **Pilot cap:** 10 merchants / $4,200 per neighborhood
- **Creator Two-Segment:** T1–T3 per-customer · T4–T6 retainer + performance + referral rev-share + equity
- **Creator commission (T1–T3):** 3% / 5% / 7% by tier (unchanged)
- **T4 Proven retainer:** $800/mo + $25/customer
- **T5 Closer retainer:** $1,800/mo + $40/customer + 15% rev-share + 0.02% equity
- **T6 Partner retainer:** $3,500/mo + $60/customer + 20% rev-share + 0.05–0.2% equity
- **Milestone bonuses:** $15 / $30 / $50 / $80 at 30 / 40 / 60 / 80 txn/mo (unchanged)
- **SLR targets (Software Leverage Ratio, north-star):** M3=8 / M6=12 / M12=25 / M24=50
- **AI Stack:** Claude Sonnet 4.6 (matching agent + Vision OCR), env-gated mock fallback via ANTHROPIC_API_KEY unset
- **Verification:** 3-layer — QR + Claude Vision OCR + geo 200m + human manual review. Verdicts: auto_verified / auto_rejected / manual_review / human_approved / human_rejected
- **DisclosureBot:** FTC 16 CFR Part 255 architectural pre-screen + $1M E&O + quarterly external audit
- **Beachhead:** Williamsburg Coffee+ (AOV $8–20, ~200 merchants addressable)
- **Expansion:** Neighborhood Playbook = $8–12K launch → $20–35K MRR target M6, 5.1mo payback
- **Attribution:** Last-click, 30-day window, consumer-scans-merchant QR code (zero merchant ops burden)
- **Seed Upgrade:** 2 campaigns + score ≥ 40 → Explorer (+ $5 cash bonus on 2nd completion)
- **Fast Track:** score ≥ 55 + avg merchant rating ≥ 4.0 → Operator
- **Demotion:** 30-day grace window + commission drops to next tier
- **Promotion Model:** Two-Tier Offer System (Hero Offer 限量 + Sustained Offer 持续折扣, merchant configurable)
- **Tier Colors (v4.1):** Clay `#b8a99a` / Bronze `#8c6239` / Steel `#4a5568` / Gold `#c9a96e` / Ruby `#9b111e` / Obsidian `#1a1a2e` — details in Design.md

## Skill Map — Route Here

| Domain Skill | Use When | Replaces Old Docs |
|---|---|---|
| `push-strategy` | Strategic decisions, positioning, agentic roadmap, competitive analysis, "what is Push" questions | Doc 01, 14, 15 |
| `push-creator` | Creator tier system, scoring model, progression, recruitment, retention | Doc 03, 13 |
| `push-pricing` | Pricing, unit economics, revenue model, financial projections, payment flows | Doc 06, 12 |
| `push-attribution` | QR code attribution, verification, fraud detection, integrity ops | Doc 05, 07, 08 |
| `push-campaign` | Campaign design, workflows, operations, SLAs, dispute resolution, settlement | Doc 02, 04 |
| `push-gtm` | Go-to-market, cold start, merchant/creator acquisition, expansion, experiments | Doc 09, 11 |
| `push-metrics` | KPIs, dashboards, data model, cohort analysis, decision rules | Doc 10 |
| `push-website` | Website design system, brand guidelines, UI rules, portal content, copy | Design.md |
| `push-brand-voice` | Brand voice, tone, messaging templates, copy guidelines, email templates, social media | — (new) |
| `push-ui-template` | SaaS template extraction — page structures, section layouts, interaction behaviors, component specs. Sub-files: sections.md, interactions.md, components.md | saas-company-website-template |

## How to Use
1. User describes task → match to domain skill above
2. Load ONLY the relevant domain skill (saves tokens)
3. If task spans multiple domains, load the primary one first
4. Each domain skill is self-contained with ALL rules, numbers, and frameworks

> **v5.1 framing note:** Always use "Vertical AI for Local Commerce" as the category and "Customer Acquisition Engine" as the product name. The v5.0 "a-g-e-n-c-y" framing is retired — do not reintroduce it. **SLR (Software Leverage Ratio) is the north-star metric, not GMV.**

## Team (5 people)
Jiaming (founder/strategy), Z (tech), Lucy (marketing/creator relations), Prum (ops), Milly (design/content)

## Beachhead
One NYC ZIP code → café + dessert + beauty → prove repeat before expanding
