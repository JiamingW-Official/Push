---
name: push-hub
description: "Master routing skill for Push. Start here for ANY Push-related task. Routes to the correct domain skill based on the task type."
---

# Push Hub — Master Router

## What is Push
Push is an AI-powered customer acquisition agency. Push is NOT a generic influencer marketplace, discovery app, or loyalty platform.

**Core Invariant:** Push only rewards verified, repeatable value creation.

**Primary Line:** "Push is an AI-powered customer acquisition agency. Tell us how many customers you need — our AI matches creators, verifies every visit, and you pay only for delivered customers."

## Quick Reference

### Latest Key Numbers (Updated 2026-04-18)
- **Merchant Pricing:** $0 Pilot (first 10 merchants, first 10 customers free) + $500/mo min + $40 per AI-verified customer. Legacy $19.99 / $69 / $199 tiers grandfathered for founding cohort only.
- **Creator Tiers:** 6-tier system v4.1 — Seed(Clay)/Explorer(Bronze)/Operator(Steel)/Proven(Gold)/Closer(Ruby)/Partner(Obsidian)
- **AI Stack:** Claude Sonnet 4.6 for matching (60s) + Vision OCR for verification (<8s). Env-gated mock fallback via ANTHROPIC_API_KEY unset.
- **Verification:** 3-layer check — QR scan + Claude Vision receipt OCR + geo-match ≤ 200m. Verdicts: auto_verified / auto_rejected / manual_review.
- **Beachhead:** Williamsburg coffee × 60 days. 6 shops signed, 20 operators in network.
- **Attribution:** Last-click, 30-day window, consumer-scans-merchant QR code (zero merchant ops burden)
- **Commission:** Operator 3% → Proven 5% → Closer 7% → Partner 10% + Referral Milestone Bonus ($15/$30/$50/$80 at 30/40/60/80 txns/mo)
- **Base Rate:** $12/$20/$32/$55/$100 × Campaign Difficulty Multiplier (Standard 1.0x / Premium 1.3x / Complex 1.6x)
- **Seed Upgrade:** 2 campaigns + score ≥ 40 → Explorer (+ $5 cash bonus on 2nd completion)
- **Fast Track:** score ≥ 55 + avg merchant rating ≥ 4.0 → Operator
- **Demotion:** 30-day grace window + commission drops to next tier
- **Promotion Model:** Two-Tier Offer System (Hero Offer 限量 + Sustained Offer 持续折扣, merchant configurable)
- **Target Margin:** 35% per campaign
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

## Team (5 people)
Jiaming (founder/strategy), Z (tech), Lucy (marketing/creator relations), Prum (ops), Milly (design/content)

## Beachhead
One NYC ZIP code → café + dessert + beauty → prove repeat before expanding
