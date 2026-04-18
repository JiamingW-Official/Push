---
name: push-website
description: "Push website design system, brand guidelines, UI rules, content standards, portal structure, and v5.1 Vertical AI for Local Commerce route map. MUST READ before any UI/frontend work."
---

# Push Website & Design — Complete Reference (v5.1)

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

## 2. Route Map — v5.1 (Next.js App Router)

> v5.1 app lives under `app/` with route groups `(marketing)`, `(merchant)`, `(creator)`, `(admin)`. Portal reference site (legacy static HTML) retained at the end of this section for archival context.
>
> **v5.1 positioning:** Push = **Vertical AI for Local Commerce**, powered by the **ConversionOracle** verification engine and **DisclosureBot** trust layer. All public surfaces must align with this framing; do not reintroduce retired v4.x language.

### 2.1 Marketing Routes `(marketing)/`

| Route | Status | Purpose | SEO |
|-------|--------|---------|-----|
| `/` | v5.0 rewrite | Landing. Hero: **"Tell us how many customers you need. We deliver."** + `<AgentOutputDemo>` in hero (desktop ≥1100px) + `<VerificationBadge>` in merchant section | Indexable |
| `/pricing` | v5.0 rewrite | Outcome-based plans overview, compare table, guarantee section. Links into per-category pages | Indexable |
| `/pricing/[category]` | **NEW v5.1** | Static category pricing pages. 5 slugs: `coffee`, `coffee-plus`, `dessert`, `fitness`, `beauty`. Category-specific ConversionOracle economics + case references. **Static route (not a dynamic `[slug]`)** — each slug is a generated static path | Indexable |
| `/how-it-works` | v5.0 rewrite | 3-step AI flow: Goal → Match → Deliver | Indexable |
| `/for-merchants` | v5.0 rewrite | Williamsburg coffee eyebrow, outcome pricing, AI-run case study pull quote | Indexable |
| `/for-creators` | v5.0 rewrite | "AI-managed operator network" framing, AI-routed campaigns | Indexable |
| `/about` | v5.0 rewrite | Timeline rewritten as Williamsburg coffee 60-day cold start | Indexable |
| `/merchant/pilot` | v5.0 | $0 Pilot apply page (`(marketing)/merchant/pilot/`). Client component. 4-field form + mock submit + champagne-border thanks state | Indexable |
| `/merchant/pilot/economics` | **NEW v5.1** | Transparent pilot economics calculator. Shows SLR (Self-Liquidating Revenue) math, verified-customer unit economics, break-even inputs. Reads ConversionOracle accuracy baseline for honest worst-case scenarios | Indexable |
| `/conversion-oracle` | **NEW v5.1** | Main moat explainer. How ConversionOracle works: Claude Vision + OCR + geo-match + cohort signals. Includes `<AgentOutputDemo showVideoCTA />` to push visitors to deep dive | Indexable |
| `/conversion-oracle/accuracy` | **NEW v5.1** | Public accuracy dashboard. Live precision/recall/manual-override rate from `ai_verifications` aggregates. Radical transparency page — designed to be citable by investors and press | Indexable |
| `/trust/disclosure` | **NEW v5.1** | DisclosureBot explainer. How automated creator/merchant disclosure (FTC + platform-native) is generated, inserted, and audited. Links to risk register | Indexable |
| `/trust/risk-register` | **NEW v5.1** | Public risk register. Known failure modes, incident history, mitigation posture. Uses `RiskReveal` client-side scroll reveal | Indexable |
| `/neighborhood-playbook` | **NEW v5.1** | Expansion product page. Packaged neighborhood-level AI playbook (beachhead pattern → new vertical/geo). Positions neighborhood expansion as a product, not a service | Indexable |
| `/neighborhoods/williamsburg-coffee` | v5.0 | Beachhead landing. **Static route that wins over `[slug]`.** JSON-LD Service offer | Indexable |
| `/case-studies/williamsburg-coffee-5` | **NEW v5.1** | First pilot case study — Williamsburg coffee cohort of 5 merchants. Outcome numbers, ConversionOracle verification stats, DisclosureBot audit references | Indexable |
| `/yc-2027` | v5.0 (unlisted) | Unlisted pitch page. `robots: { index: false, follow: false }`. **Not linked from nav.** | **noindex, nofollow** |

### 2.2 Portal Routes

| Group | Route | Purpose | SEO |
|-------|-------|---------|-----|
| Merchant | `/merchant/...` | Merchant dashboard (campaigns, attribution, settings). Auth-gated | noindex |
| Merchant — SLR widget host | `/merchant/dashboard` | Hosts `<SLRWidget>` as dashboard north-star KPI (Self-Liquidating Revenue). Auth-gated | noindex |
| Creator | `/creator/...` | Creator dashboard (tier, earnings, campaign feed). Auth-gated | noindex |
| Creator — equity pool | `/creator/equity-pool` | **NEW v5.1.** T5/T6 equity signup flow. Uses `equity-pool-client.tsx`. Auth-gated (creator role + tier gate) | **noindex** |
| Admin | `/admin/...` | Admin console. Auth-gated (admin role) | noindex |
| Admin — AI review | `/admin/ai-verifications` | v5.0. Manual-review queue for `ai_verifications` rows. Feeds ConversionOracle accuracy numbers. Admin role | noindex |
| Admin — disclosure audits | `/admin/disclosure-audits` | **NEW v5.1.** DisclosureBot audit trail. Uses `DisclosureAuditsClient.tsx` to render filterable audit table. Admin role | **noindex** |
| Admin — YC hub | `/admin/yc-application` | **NEW v5.1.** Private YC Summer 2027 application hub (materials, drafts, deck links). Admin role | **noindex** |

> Portal structure (merchant / creator / admin dashboards) is preserved from v4.x — v5.1 adds the SLR widget on merchant dashboard, the creator equity pool page, and the two new admin surfaces (disclosure audits + YC hub) on top of the v5.0 AI review queue.

### 2.3 Redirects (`next.config.ts`)

All 301, preserve query behavior via App Router redirect rules:

| From | To | Reason |
|------|-----|--------|
| `/pricing?plan=starter` | `/merchant/pilot` | v4.x Starter tier retired; becomes $0 Pilot |
| `/pricing?plan=growth` | `/pricing` | v4.x Growth tier folded into outcome plans |
| `/pricing?plan=scale` | `/pricing` | v4.x Pro/Scale tier folded into outcome plans |
| `/merchant/signup?plan=starter` | `/merchant/pilot` | Old signup path → new Pilot apply page |

Source of truth: `next.config.ts` `redirects()`. Skill stays in sync when adding new v5.1 redirects (category pricing + trust pages must never 301 into generic `/pricing` — they are distinct SEO surfaces).

### 2.4 Root Metadata (`app/layout.tsx`)

| Key | Value |
|-----|-------|
| `metadata.title` (default) | `"Push — Vertical AI for Local Commerce \| $0 Pilot for Local Businesses"` |
| `metadataBase` | `https://push-six-flax.vercel.app` |
| OG image | Deep Space Blue `#003049` bg, headline **"Tell us how many customers you need. We deliver."** |

**`metadataBase` rationale:** Vercel preview URL used as baseline because the production domain is still pending (§9.7 project naming). All `og:image` / `twitter:image` URLs resolve against this base until the domain is finalized; update in one place when that happens.

### 2.4a Per-Route Metadata Flags (noindex surfaces)

Every surface marked **noindex** above must set `robots: { index: false, follow: false }` in its `generateMetadata` / `export const metadata`. The complete noindex set in v5.1:

- `/yc-2027`
- `/creator/equity-pool`
- `/admin/yc-application`
- `/admin/disclosure-audits`
- `/admin/ai-verifications`
- All `/merchant/...`, `/creator/...`, `/admin/...` portal routes (via group `layout.tsx` metadata or explicit per-route)

Indexable surfaces are everything else in §2.1 — notably `/pricing/[category]`, `/conversion-oracle`, `/conversion-oracle/accuracy`, `/trust/disclosure`, `/trust/risk-register`, `/neighborhood-playbook`, `/merchant/pilot/economics`, and `/case-studies/williamsburg-coffee-5` must remain indexable.

### 2.5 Reusable Components

**v5.0 landing building blocks (still in use):**

| Component | Path | Used on |
|-----------|------|---------|
| `AgentOutputDemo` | `components/landing/AgentOutputDemo.tsx` | `/` hero (desktop ≥1100px); `/conversion-oracle` (with `showVideoCTA` prop); reusable on `/how-it-works`, `/for-merchants` if needed |
| `VerificationBadge` | `components/landing/VerificationBadge.tsx` | `/` merchant section; reusable anywhere verification proof is shown |

**v5.1 additions:**

| Component | Path | Used on | Notes |
|-----------|------|---------|-------|
| `SLRWidget` | `components/merchant/SLRWidget.tsx` | `/merchant/dashboard` (north-star KPI tile) | Self-Liquidating Revenue widget — shows verified-customer revenue vs. spend. Reads from merchant aggregates. |
| `AgentOutputDemo` (extended) | `components/landing/AgentOutputDemo.tsx` | `/conversion-oracle`, `/` hero | v5.1 adds **`showVideoCTA?: boolean`** prop. When `true`, renders a secondary "Watch the 60-second deep dive" CTA anchored to the ConversionOracle explainer. Default `false` preserves legacy hero behavior. |
| `RiskReveal` | `components/trust/RiskReveal.tsx` | `/trust/risk-register` | Client-side scroll reveal for risk entries. Each risk block fades/slides in on viewport enter. Respects `prefers-reduced-motion`. |
| `DisclosureAuditsClient` | `components/admin/DisclosureAuditsClient.tsx` | `/admin/disclosure-audits` | Client table for DisclosureBot audit trail. Filters by creator, merchant, platform (IG/TikTok/YT), and disclosure verdict (inserted / missing / flagged). Admin-only. |
| `equity-pool-client.tsx` | `components/creator/equity-pool-client.tsx` | `/creator/equity-pool` | Creator equity signup flow client. Handles tier gate (T5/T6), signature capture, and submission. Noindex + auth-gated host route. |

Treat all of the above as building blocks — do not inline their markup in other pages. When extending any of them, update this table and any affected route row in §2.1–§2.2.

### 2.6 Legacy Portal Site (archival)

Pre-v5.x static HTML portal at https://jiamingw-official.github.io/Push_Portal/ — retained for historical reference during transition. Not part of the Next.js app.

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

### Voice & Tone (v5.1)
- Direct, confident, no fluff
- Outcome + vertical-AI language (not horizontal-platform cliches)
- Focus on delivered customers, ConversionOracle verification, and DisclosureBot trust — not features
- Never say: "connecting creators with businesses" (too generic)
- Always say: "Vertical AI for Local Commerce" at the positioning level; "verified customers delivered" at the outcome level

### Key Copy Points — v5.1 (current)
- **Push = Vertical AI for Local Commerce** (not a generic platform, not SaaS)
- **Tagline:** "Tell us how many customers you need. We deliver."
- **Moat:** ConversionOracle (verification prediction engine) + DisclosureBot (automated compliance)
- **Pricing:** $0 Pilot → outcome-based per-verified-customer rates, category-tiered by vertical (`/pricing/[category]`)
- **Verification core:** Claude Vision + OCR + geo-match, Day-1 validation — surfaced publicly via `/conversion-oracle/accuracy`
- **Beachhead:** Williamsburg coffee × 60 days (NYC, narrow not broad)
- **Expansion product:** Neighborhood Playbook — packaged neighborhood-level AI playbook for new verticals/geos
- **Route-level copy anchors:**
  - `/` hero: "Tell us how many customers you need. We deliver."
  - `/pricing`: "Outcome pricing. Pay for verified customers, not impressions."
  - `/pricing/[category]`: Per-vertical outcome economics (coffee / coffee-plus / dessert / fitness / beauty)
  - `/how-it-works`: Goal → Match → Deliver (3-step AI flow)
  - `/for-merchants`: Williamsburg coffee eyebrow + AI-run case study pull quote
  - `/for-creators`: "AI-managed operator network" — AI-routed campaigns
  - `/about`: 60-day cold-start timeline (Williamsburg coffee origin story)
  - `/merchant/pilot`: "$0 Pilot. Zero risk. Verified results."
  - `/merchant/pilot/economics`: Transparent SLR math; no hidden assumptions
  - `/conversion-oracle`: "Our moat. How ConversionOracle predicts and proves every walk-in."
  - `/conversion-oracle/accuracy`: "Public accuracy, updated live."
  - `/trust/disclosure`: "DisclosureBot — compliance that runs itself."
  - `/trust/risk-register`: Named risks, named mitigations, no spin
  - `/neighborhood-playbook`: Neighborhood as product, not service
  - `/neighborhoods/williamsburg-coffee`: Neighborhood-specific outcome promise (JSON-LD Service offer)
  - `/case-studies/williamsburg-coffee-5`: First-cohort numbers, ConversionOracle + DisclosureBot trail

### Historical Anchors (archived, do NOT use in new copy)
- Retired SaaS-tier monthly subscriptions → replaced by $0 Pilot + outcome-based pricing
- ~~"Stop guessing which creators work. Start buying verified results."~~ → replaced by "Tell us how many customers you need. We deliver."
- ~~Flat per-customer rates~~ → replaced by category-tiered economics on `/pricing/[category]`
- 6-tier creator system, Commission + Milestone Bonus, Campaign Difficulty Multiplier, 35% platform margin — still operational internally; de-emphasized in public copy.

## 4. v5.1 Surface Checklist (what exists / what's required)

Marketing surfaces (indexable):
- `/` landing (hero rewrite + AgentOutputDemo + VerificationBadge) — v5.0
- `/pricing` outcome-plan overview + compare + guarantee — v5.0
- `/pricing/[category]` per-vertical pricing (5 static slugs: coffee, coffee-plus, dessert, fitness, beauty) — v5.1 NEW
- `/how-it-works` 3-step AI flow — v5.0
- `/for-merchants` Williamsburg coffee eyebrow + case study pull quote — v5.0
- `/for-creators` AI-managed operator network framing — v5.0
- `/about` 60-day cold-start timeline — v5.0
- `/merchant/pilot` $0 Pilot apply form — v5.0
- `/merchant/pilot/economics` transparent SLR calculator — v5.1 NEW
- `/conversion-oracle` moat explainer (hosts `<AgentOutputDemo showVideoCTA />`) — v5.1 NEW
- `/conversion-oracle/accuracy` public accuracy dashboard — v5.1 NEW
- `/trust/disclosure` DisclosureBot explainer — v5.1 NEW
- `/trust/risk-register` public risk register (`RiskReveal` scroll reveal) — v5.1 NEW
- `/neighborhood-playbook` Neighborhood Playbook product page — v5.1 NEW
- `/neighborhoods/williamsburg-coffee` beachhead landing + JSON-LD Service offer — v5.0
- `/case-studies/williamsburg-coffee-5` first pilot cohort case study — v5.1 NEW

Unlisted / noindex marketing:
- `/yc-2027` unlisted pitch page — v5.0

Portal surfaces (auth-gated, noindex):
- Merchant dashboard (campaigns, attribution, settings) with SLR widget — v5.0 + v5.1 widget add
- Creator dashboard (tier, earnings, campaign feed)
- `/creator/equity-pool` — v5.1 NEW, T5/T6 equity signup
- Admin console
- `/admin/ai-verifications` — v5.0, admin-only AI review queue
- `/admin/disclosure-audits` — v5.1 NEW, DisclosureBot audit trail
- `/admin/yc-application` — v5.1 NEW, private YC Summer 2027 hub

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
