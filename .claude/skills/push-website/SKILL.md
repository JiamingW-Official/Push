---
name: push-website
description: "Push website design system, brand guidelines, UI rules, content standards, and portal structure. MUST READ before any UI/frontend work."
---

# Push Website & Design — Complete Reference

## 1. Design System Rules (MANDATORY)

> **完整组件规范在 `Design.md` 中。** 本 skill 是品牌概览和内容指南；实现具体组件时必须读 Design.md。

### Color Palette (6 Brand Colors + Surface System)

| Color | Name | Hex | Role |
|-------|------|-----|------|
| Primary | Flag Red | `#c1121f` | CTA, brand accent, alerts |
| Accent | Molten Lava | `#780000` | Hover states, deep emphasis, dramatic accents |
| Surface | Pearl Stone | `#f5f2ec` | Page backgrounds, card surfaces, warm neutral base |
| Dark | Deep Space Blue | `#003049` | Dark panels, text, headers, hero backgrounds |
| Tertiary | Steel Blue | `#669bbc` | Info, links, badges, secondary actions |
| Premium | Champagne Gold | `#c9a96e` | Premium identity, recommended highlights, payout accents |

**Surface System (Layered):**
| Token | Hex | Role |
|-------|-----|------|
| `--surface` | `#f5f2ec` | Base background |
| `--surface-bright` | `#fafaf8` | Card/panel backgrounds |
| `--surface-elevated` | `#ffffff` | Elevated elements (modals, slide panels) |

- Text: `#003049` (primary) / `#4a5568` (graphite/secondary) / `#669bbc` (muted)
- Background: `#f5f2ec` (Pearl Stone, not white)

| Graphite | Graphite | `#4a5568` | Secondary text, icons, subtle UI |

### Tier Identity Colors (v4.1)
Tier colors are independent of the 6 brand colors. Each tier has a unique hue:
| Tier | Material | Color | CSS Variable |
|------|----------|-------|-------------|
| Seed | Clay | `#b8a99a` | `--tier-clay` |
| Explorer | Bronze | `#8c6239` | `--tier-bronze` |
| Operator | Steel | `#4a5568` | `--tier-steel` |
| Proven | Gold | `#c9a96e` | `--tier-gold` |
| Closer | Ruby | `#9b111e` | `--tier-ruby` |
| Partner | Obsidian | `#1a1a2e` | `--tier-obsidian` |

> Full badge, rail, and card specs in Design.md → Tier Identity System v4.1.

### Color Combination Warning
- **Pearl Stone `#f5f2ec` + Champagne `#c9a96e` used together can skew warm.** When Champagne elements appear, ensure a cool anchor (`--dark` or `--tertiary`) is nearby for balance.
- **Champagne sparingly:** Only for premium moments — partner tier, milestone celebrations, featured badges. If a page has more than 3 champagne elements, review for overuse.

### Typography

| Role | Font | Usage |
|------|------|-------|
| **Headings/Display** | `Darky` | H1–H3, page titles, hero text, display type |
| **Body/Labels** | `CS Genio Mono` | Paragraphs, subtitles, buttons, captions, nav, UI text |

- Darky for headings only. CS Genio Mono for everything else.
- No other fonts. Custom `@font-face` imports, not Google Fonts.

### Sharp Corners (直角)
ALL UI elements: `border-radius: 0`. No rounded corners.
Exceptions: map pins (50%), filter chips (50vh), back-to-top (50%).

### Spacing (8px Grid)
All spacing: multiples of 8 — 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px.

### Light Mode Only
No dark mode.

### Interaction References
- **ashleybrookecs.com**: Editorial style, massive display typography (12vw+), numbered sections (01/02/03), scroll-driven reveals
- **sanrita.ca**: Minimal artsy, scroll-to-enter, monospace aesthetic, extreme whitespace
- **Sticky Grid Scroll**: GSAP + Lenis progressive reveal grid for showcase sections

### Component Override Rule
Third-party components: ALWAYS override rounded corners to 0.

## 2. Route Map — v5.0 (Next.js App Router)

> v5.0 app lives under `app/` with route groups `(marketing)`, `(merchant)`, `(creator)`, `(admin)`. Portal reference site (legacy static HTML) retained at the end of this section for archival context.

### 2.1 Marketing Routes `(marketing)/`

| Route | Status | Purpose | SEO |
|-------|--------|---------|-----|
| `/` | v5.0 rewrite | Landing. Hero: **"Tell us how many customers you need. We deliver."** + `<AgentOutputDemo>` in hero (desktop ≥1100px) + `<VerificationBadge>` in merchant section | Indexable |
| `/pricing` | v5.0 rewrite | 2-tier outcome plans (Pilot + Performance), compare table, guarantee section | Indexable |
| `/how-it-works` | v5.0 rewrite | 3-step agent-driven flow: Goal → Match → Deliver | Indexable |
| `/for-merchants` | v5.0 rewrite | Williamsburg coffee eyebrow, outcome pricing, agent-run case study pull quote | Indexable |
| `/for-creators` | v5.0 rewrite | "AI-managed operator network" framing, agent-routed campaigns | Indexable |
| `/about` | v5.0 rewrite | Timeline rewritten as Williamsburg coffee 60-day cold start | Indexable |
| `/merchant/pilot` | **NEW v5.0** | $0 Pilot apply page (`(marketing)/merchant/pilot/`). Client component. 4-field form + mock submit + champagne-border thanks state | Indexable |
| `/neighborhoods/williamsburg-coffee` | **NEW v5.0** | Beachhead landing. **Static route that wins over `[slug]`.** JSON-LD Service offer | Indexable |
| `/yc-2027` | **NEW v5.0 (unlisted)** | Unlisted pitch page. `robots: { index: false, follow: false }`. **Not linked from nav.** | **noindex, nofollow** |

### 2.2 Portal Routes (unchanged by v5.0)

| Group | Route prefix | Purpose |
|-------|--------------|---------|
| Merchant | `/merchant/...` | Merchant dashboard (campaigns, attribution, settings) |
| Creator | `/creator/...` | Creator dashboard (tier, earnings, campaign feed) |
| Admin | `/admin/...` | Admin console |
| Admin — AI review | `/admin/ai-verifications` | **NEW v5.0.** Manual-review queue for `ai_verifications` rows. Behind admin role |

> Portal structure (merchant / creator / admin dashboards) is preserved from v4.x — v5.0 only adds the `/admin/ai-verifications` queue and the `/merchant/pilot` marketing page.

### 2.3 Redirects (`next.config.ts`)

All 301, preserve query behavior via App Router redirect rules:

| From | To | Reason |
|------|-----|--------|
| `/pricing?plan=starter` | `/pilot` | v4.x Starter tier retired; becomes $0 Pilot |
| `/pricing?plan=growth` | `/pricing#performance` | v4.x Growth tier folded into Performance |
| `/pricing?plan=scale` | `/pricing#performance` | v4.x Pro/Scale tier folded into Performance |
| `/merchant/signup?plan=starter` | `/merchant/pilot` | Old signup path → new Pilot apply page |

Source of truth: `next.config.ts` `redirects()`. Skill stays in sync when adding new v5.0 redirects.

### 2.4 Root Metadata (`app/layout.tsx`)

| Key | Value |
|-----|-------|
| `metadata.title` (default) | `"Push — AI-Powered Customer Acquisition Agency \| $0 Pilot for Local Businesses"` |
| `metadataBase` | `https://push-six-flax.vercel.app` |
| OG image | Deep Space Blue `#003049` bg, headline **"Tell us how many customers you need. We deliver."** |

**`metadataBase` rationale:** Vercel preview URL used as baseline because the production domain is still pending (§9.7 project naming). All `og:image` / `twitter:image` URLs resolve against this base until the domain is finalized; update in one place when that happens.

### 2.5 v5.0 Reusable Components (landing)

| Component | Path | Used on |
|-----------|------|---------|
| `AgentOutputDemo` | `components/landing/AgentOutputDemo.tsx` | `/` hero (desktop ≥1100px); reusable on `/how-it-works`, `/for-merchants` if needed |
| `VerificationBadge` | `components/landing/VerificationBadge.tsx` | `/` merchant section; reusable anywhere verification proof is shown |

Treat both as building blocks — do not inline their markup in other pages.

### 2.6 Legacy Portal Site (archival)

Pre-v5.0 static HTML portal at https://jiamingw-official.github.io/Push_Portal/ — retained for historical reference during transition. Not part of the Next.js app.

<details>
<summary>Legacy portal page list</summary>

| Page | URL | Purpose |
|------|-----|---------|
| Home | index.html | Main landing, vision, how it works |
| Project Intro | project-intro.html | Detailed Push explanation |
| Strategy Core | push-strategy-core.html | Strategic framework |
| Platform Value | platform-value.html | Value proposition deep-dive |
| Challenges | challenges.html | Problem analysis |
| Prospects | prospects.html | Market opportunity |
| Standby Mechanism | standby-mechanism.html | Standby system explanation |
| Attribution | attribution.html | Attribution framework |
| Economics | economics.html | Unit economics |
| Fraud & Integrity | fraud-integrity.html | Fraud prevention |
| GTM Launch | gtm-launch.html | Go-to-market plan |
| Metrics Dashboard | metrics-dashboard.html | Metrics framework |
| Risk Defense | risk-defense.html | Risk management |
| Retention Defense | retention-defense.html | Retention strategy |
| Pitch Deck | pitch-deck.html | Investor pitch |
| Investor Q&A | investor-qa.html | Investor FAQ |
| NDA | nda.html | NDA page |
| Team Dashboard | push-team-dashboard.html | Team overview |

</details>

## 3. Website Content Standards

> **Copy is authoritatively maintained in `push-brand-voice` skill.** This section captures route-level copy anchors that must match brand-voice templates. When copy conflicts, brand-voice wins.

### Voice & Tone (v5.0)
- Direct, confident, no fluff
- Agency + outcome language (not marketplace/platform cliches)
- Focus on delivered customers and verification, not features
- Never say: "connecting creators with businesses" (too generic)
- Always say: "AI-powered customer acquisition" or "verified customers delivered"

### Key Copy Points — v5.0 (current)
- **Push = AI-Powered Customer Acquisition Agency** (not a marketplace, not SaaS)
- **Tagline:** "Tell us how many customers you need. We deliver."
- **Pricing (outcome-based):** $0 Pilot → Performance ($500/month minimum + $40/verified customer)
- **Verification core:** Claude Vision + OCR + geo-match, Day-1 validation
- **Beachhead:** Williamsburg coffee × 60 days (NYC, narrow not broad)
- **Route-level copy anchors:**
  - `/` hero: "Tell us how many customers you need. We deliver."
  - `/pricing`: "Outcome pricing. Pay for verified customers, not impressions."
  - `/how-it-works`: Goal → Match → Deliver (3-step agent flow)
  - `/for-merchants`: Williamsburg coffee eyebrow + agent-run case study pull quote
  - `/for-creators`: "AI-managed operator network" — agent-routed campaigns
  - `/about`: 60-day cold-start timeline (Williamsburg coffee origin story)
  - `/merchant/pilot`: "$0 Pilot. Zero risk. Verified results."
  - `/neighborhoods/williamsburg-coffee`: Neighborhood-specific outcome promise (JSON-LD Service offer)

### v4.x Historical Anchors (archived, do NOT use in new copy)
- ~~Starter $19.99/mo | Growth $69/mo | Pro $199/mo~~ → replaced by Pilot + Performance
- ~~"Stop guessing which creators work. Start buying verified results."~~ → replaced by "Tell us how many customers you need. We deliver."
- ~~"$19.99/month. Less than one Instagram ad."~~ → retired with SaaS-tier pricing
- 6-tier creator system, Commission + Milestone Bonus, Campaign Difficulty Multiplier, 35% platform margin — still operational internally; de-emphasized in public marketing copy.

## 4. v5.0 Surface Checklist (what exists / what's required)

Marketing surfaces:
- `/` landing (hero rewrite + AgentOutputDemo + VerificationBadge) — v5.0
- `/pricing` 2-tier outcome plans + guarantee section — v5.0
- `/how-it-works` 3-step agent flow — v5.0
- `/for-merchants` Williamsburg coffee eyebrow + case study pull quote — v5.0
- `/for-creators` AI-managed operator network framing — v5.0
- `/about` 60-day cold-start timeline — v5.0
- `/merchant/pilot` $0 Pilot apply form (4 fields + mock submit + champagne thanks state) — v5.0 NEW
- `/neighborhoods/williamsburg-coffee` beachhead landing + JSON-LD Service offer — v5.0 NEW
- `/yc-2027` unlisted pitch page (noindex) — v5.0 NEW

Portal surfaces (preserved, unchanged by v5.0 unless noted):
- Merchant dashboard (campaigns, attribution, settings)
- Creator dashboard (tier, earnings, campaign feed)
- Admin console
- `/admin/ai-verifications` — v5.0 NEW, admin-only AI review queue

Tech stack: Next.js App Router + React + Vercel + Supabase (see `.claude/handoff-v8.3.md` for v4.x debt context).

## 5. Design Patterns

### Buttons
- Primary: `#c1121f` bg, white text, border-radius: 0
- Secondary: `#f5f2ec` bg, `#003049` border, dark text, border-radius: 0
- Ghost: transparent bg, `1px solid var(--line)`, dark text
- Disabled: muted bg (#d0d0d0), border-radius: 0
- Font: CS Genio Mono, uppercase, weight 700

### Cards
- `#f5f2ec` bg, 1px border (`var(--line)`), border-radius: 0
- 24px padding
- Optional left border accent (4px, brand color)

### Forms
- Input: border-radius: 0, 1px border var(--line), 16px padding, CS Genio Mono
- Focus: border color → `#c1121f`
- Error: border color → `#c1121f` + CS Genio Mono error text below

### Tables
- No border-radius on cells
- Header: `rgba(0,48,73,0.04)` bg, CS Genio Mono bold
- Alternating rows optional

### Navigation
- Top nav: `#f5f2ec` bg, bottom border 1px
- Active link: `#c1121f` underline or text color
- Logo: Darky font
- Links: CS Genio Mono, uppercase

## 6. Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Max content width: 1180px
- Use 8px grid for all responsive spacing

## 7. Post-Task Design Review
After EVERY task involving UI: review Design.md, compare against decisions, update if new patterns established.
