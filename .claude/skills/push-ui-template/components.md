# Push UI Template — Component Specs

> Detailed specs for every reusable component. Colors/fonts from Design.md.
> **Sections V1.x are the v5.1 components** (Vertical AI for Local Commerce, Two-Segment creator economics, ConversionOracle + DisclosureBot — added April 2026). Sections 0.x are the v5.0 components. Sections 1–20 are the original SaaS template library — still the source of truth for nav, cards, forms, pricing, etc. Don't describe the design tokens here; see Design.md.

---

## V1.1. SLRWidget (v5.1)

**Path:** `components/merchant/SLRWidget.tsx`
**Used on:** Merchant dashboard only — this is the dashboard's north-star widget
**Positioning:** Vertical AI for Local Commerce — SLR (Store Lift Rate) is the primary outcome metric

### Purpose
Single, unambiguous answer to "is Push working for me?" Shows current SLR as a big number, an inline SVG line chart (actual vs target over time), and an industry baseline caption. The widget is the top of the merchant dashboard — everything else is secondary.

### Props
```ts
interface SLRWidgetProps {
  currentSLR: number;              // e.g., 0.24 → rendered as "24%"
  targetByMonth: number[];         // length matches chart window (e.g., 6 months)
  actualByMonth?: number[];        // optional; if absent, only target line renders
  industryBaseline?: number;       // optional caption reference, e.g., 0.08
  verticalName?: string;           // "Coffee shops" — used in baseline caption
}
```

### Structure
```
div.slr-widget
├── div.slr-widget-header
│   ├── span.slr-widget-eyebrow      "Store Lift Rate · 30d"
│   └── span.slr-widget-helper       link → "How SLR is computed"
├── div.slr-widget-hero
│   ├── span.slr-widget-num           Darky-900, champagne color, ~56px
│   └── span.slr-widget-delta         vs last period (green up / red down)
├── svg.slr-widget-chart              ← inline SVG, NO recharts
│   ├── <polyline class="slr-chart-target">    dashed Steel Blue
│   ├── <polyline class="slr-chart-actual">    solid Champagne
│   └── <circle class="slr-chart-now">         Flag Red, current point
└── p.slr-widget-caption              "Industry baseline for Coffee shops: 8%"
```

### Visual rules
- **Big number:** Darky-900 font, `#c9a96e` (Champagne) color, ~56px size — this is the one spot on the dashboard where Champagne is the main ink, not an accent
- **Champagne accent sparingly:** only the current SLR number, the actual-line stroke, and one hairline under the eyebrow — do NOT bleed it into axis labels, caption text, or deltas
- **Chart is inline SVG — no recharts, no Chart.js.** Hand-rolled `<polyline>`s keep the bundle small and the rendering square-edged
- **Axes:** no axis labels on the widget itself; hover tooltip shows month + %. Y scale 0 → max(target, actual) + 5pp
- **Target line:** Steel Blue `#669bbc`, `stroke-dasharray="4 3"`, 1.5px
- **Actual line:** Champagne `#c9a96e`, solid, 2px
- **NOW marker:** Flag Red `#c1121f` filled circle at the last actual point, 4px radius
- **All corners square** (`rx="0"` everywhere)

### Use when
- Building or extending the merchant dashboard
- Any merchant-facing "is it working?" surface

### Don't use when
- Admin dashboard (admin gets a different rollup, not SLR by account)
- Marketing pages (SLR is an outcome metric, not a promise — marketing uses ConversionOracle accuracy charts instead)

---

## V1.2. Pricing tier card — per-vertical (v5.1)

**Path:** `app/(marketing)/pricing/[category]/page.tsx` (one page per vertical: coffee, restaurant, retail, beauty-wellness, fitness, bar-nightlife)
**Positioning:** Vertical AI for Local Commerce — each vertical has its own pricing because unit economics differ

### Purpose
The per-vertical pricing landing surface. Not a tier-card grid (this is v5.1 — Two-Segment pricing means rates vary by vertical, not by package). The h1 carries the rate, then a unit-economics table shows the derivation, then a retention add-on mini-table covers the optional upsell.

### Structure
```
section.pricing-vertical
├── h1.pricing-vertical-h1               "Coffee shops — $32 per verified new customer"
├── p.pricing-vertical-sub               one-liner on what's included
├── table.pricing-unit-econ              ← 4-row table, read as a proof
│   ├── tr  "Typical AOV"           $8.50
│   ├── tr  "Repeat visits (30d)"   3.2
│   ├── tr  "Derived LTV"           $27.20
│   └── tr  "Push rate"              $32 (with footnote on why ≥ LTV is OK for cohort-1)
└── table.pricing-retention-addon        ← 2-col mini-table
    ├── tr  "Monthly retention %"   optional ConversionOracle retention tracking
    └── tr  "Add-on rate"            $X / month
```

### Visual rules
- **Rate in h1:** Champagne `#c9a96e` for the dollar figure — the rest of the h1 is Darky default ink
- **Background:** Pearl Stone `#f5f2ec` page bg (the default — don't override)
- **Accents:** Steel Blue `#669bbc` for unit-econ row dividers, table borders, and the footnote underline
- **Typography:** h1 in Darky; all table cells in CS Genio Mono
- **All cells left-aligned** (numbers included — the table reads like prose, not a spreadsheet)
- **Derivation footnote:** italic, 12px, CS Genio Mono, Graphite color

### Category-specific values (fixtures, not formulas)
The v5.1 rates are set per-vertical in copy. Don't compute them client-side — hard-code per page:
- Coffee: $32 / verified customer
- Restaurant: $55
- Retail: $48
- Beauty/Wellness: $75
- Fitness: $62
- Bar/Nightlife: $40

### Use when
- Per-vertical pricing landing page
- Any marketing surface that quotes the rate (single source of truth)

### Don't use when
- You need a tier-comparison grid — v5.1 doesn't have one (Two-Segment pricing = per-vertical rate + retention add-on, not packages)
- Merchant dashboard billing view (use a plain invoice table instead)

---

## V1.3. Risk card (9-item grid, v5.1)

**Path:** `app/(marketing)/trust/risk-register/page.tsx`
**Positioning:** Vertical AI for Local Commerce — public risk register is part of the trust story

### Purpose
Public-facing risk register. 9 cards in a responsive grid — each names one risk with its probability, impact, mitigation strategy, and the trigger that would escalate to a playbook response. This is the "what could go wrong and what we'll do about it" page.

### Structure (one card)
```
article.risk-card
├── header.risk-card-head
│   ├── h3.risk-card-title            "Creator fraud ring"
│   └── div.risk-card-pills
│       ├── span.risk-pill.risk-pill--prob   "Probability: Med"
│       └── span.risk-pill.risk-pill--impact "Impact: High"
├── section.risk-card-mitigation
│   ├── h4.risk-card-mitigation-label    "Mitigation"
│   └── p.risk-card-mitigation-body
└── aside.risk-card-trigger              ← callout box
    ├── span.risk-card-trigger-label     "Trigger"
    └── p.risk-card-trigger-body         "If 3+ flagged scans in 7d from one creator..."
```

### Visual rules — severity-colored left edge
The left border is 3px and takes its color from a computed severity. **Severity = max(probability, impact) for ranking:**
- **Critical** → Flag Red `#c1121f`
- **High** → Champagne Gold `#c9a96e`
- **Medium** → Steel Blue `#669bbc`
- **Low** → Graphite `#4a5568`

### Pills
- Two pills per card: probability + impact
- Shape: rectangular, 1px border, zero radius (the house rule — no pill radius on trust pages)
- Color: pills inherit the severity color of their specific axis (probability pill colored by probability level; impact pill colored by impact level)

### Trigger callout
- `aside` with left-border accent (same severity color, 2px)
- Background: Surface Bright `#fafaf8` so it reads as an inset panel
- Label: CS Genio Mono, uppercase, 10px, Graphite
- Body: CS Genio Mono, 13px

### Grid layout
- Desktop (≥1100px): 3 × 3 grid, 24px gap
- Tablet (≥760px): 2-col, last row wraps
- Mobile: 1-col stack

### Use when
- Public risk register page (only location)
- Any trust-and-compliance surface that needs a severity-ranked grid pattern

### Don't use when
- Internal risk tracking (use a table with sort + filter instead)
- Fewer than ~6 risks (the grid feels sparse — use a list)

---

## V1.4. Accuracy chart (inline SVG, v5.1)

**Path:** `app/(marketing)/conversion-oracle/accuracy/page.tsx`
**Positioning:** ConversionOracle is the v5.1 vertical-AI system — this chart is how we show its accuracy publicly

### Purpose
Public accuracy chart for ConversionOracle. Shows weeks on X, verification accuracy % on Y, with three target bands (75% / 85% / 90%) drawn as horizontal dashed lines, and a NOW marker as a Flag Red circle at the current week. **Inline SVG only — no recharts.**

### Structure
```
figure.oracle-accuracy
├── figcaption.oracle-accuracy-caption   "ConversionOracle accuracy · past 24 weeks"
└── svg.oracle-accuracy-chart
    ├── <line class="oracle-band-75">   dashed, Graphite, y = 75%
    ├── <line class="oracle-band-85">   dashed, Steel Blue, y = 85%
    ├── <line class="oracle-band-90">   dashed, Champagne, y = 90%
    ├── <text class="oracle-band-label"> × 3      labels at the right edge of each band
    ├── <polyline class="oracle-accuracy-line">   solid Darky-ink
    ├── <circle class="oracle-accuracy-now">      Flag Red filled, 5px radius
    └── <text class="oracle-accuracy-now-label">  "NOW" above the marker
```

### Visual rules
- **Chart is inline SVG — no libraries.** Same rule as SLRWidget (V1.1)
- **Target bands:** 3 dashed horizontal lines at 75 / 85 / 90%. Dash pattern `stroke-dasharray="3 4"`, 1px
- **Band colors (ascending quality):** 75% = Graphite, 85% = Steel Blue, 90% = Champagne
- **Band labels:** right-edge, CS Genio Mono 10px, same color as the band
- **Accuracy line:** solid, Darky-900 ink, 2px. No fill, no area shading
- **NOW marker:** Flag Red `#c1121f` filled circle at the last data point, 5px radius. "NOW" label 10px above, Flag Red, CS Genio Mono
- **X axis:** weeks (no tick labels — caption carries the range)
- **Y axis:** 50% → 100% (don't start at 0 — bands wouldn't separate visually)
- **All corners square;** chart container has zero border-radius

### Use when
- ConversionOracle accuracy page (only location)
- Any public-facing accuracy surface that needs target-band framing

### Don't use when
- Merchant dashboard (use SLRWidget V1.1 instead — SLR is the dashboard metric, not oracle accuracy)
- You only have 3-4 data points (the line chart looks thin — use a bar chart)

---

## V1.5. Equity pool signup (v5.1)

**Path:** `app/(creator)/creator/equity-pool/*` (landing + form page)
**Positioning:** Two-Segment creator economics, T4-T6 retainer/performance/rev-share track — top tier gets equity via a creator equity pool

### Purpose
Creator equity-pool onboarding. Three gates must pass (tier requirement, conversion threshold, DisclosureBot compliance) before the form unlocks; gated creators see the same card with red X rows. The form captures tax-ID, platform handles, and a signed acknowledgement.

### Structure
```
section.equity-pool
├── article.equity-gate-card             ← 3-gate eligibility card
│   ├── h2.equity-gate-h2                "You must pass all three to enroll"
│   └── ul.equity-gate-list
│       ├── li.equity-gate-row.equity-gate-row--ok     Tier ≥ T4  (green check)
│       ├── li.equity-gate-row.equity-gate-row--no     Conversions ≥ 12 in last 90d  (red X)
│       └── li.equity-gate-row.equity-gate-row--ok     DisclosureBot compliance ≥ 95%  (green check)
├── table.equity-rsa-terms               ← RSA terms (4 rows: pool size, vesting, cliff, claw-back)
└── form.equity-signup-form
    ├── .equity-field  Tax-ID (SSN or EIN)           required
    ├── .equity-field  Platform handles[]            tag-input, repeatable
    └── .equity-field  label + checkbox  "I have read and accept the RSA terms"
```

### Visual rules
- **Gate row states:**
  - `--ok` → green check SVG icon + Graphite body text
  - `--no` → Flag Red X SVG icon + Flag Red body text
  - `--pending` (optional third state) → Champagne dot + Champagne body
- **Icons:** 16×16, square stroke, `strokeLinecap="square"` (house rule)
- **RSA terms table:** 2-col (term / value), left-aligned, CS Genio Mono, 1px Steel Blue borders
- **Tax-ID field:** masked input, format `XXX-XX-XXXX` or `XX-XXXXXXX`. On focus, show a tiny helper "SSN or EIN — we use this for tax reporting only"
- **Platform handles:** tag-input pattern — type + Enter adds a chip; chips are zero-radius with 1px Steel Blue border
- **Submit button:** `.btn--neon` primary, disabled until all 3 gates pass AND acknowledgement checked

### Use when
- Creator equity-pool onboarding (this specific route only)
- Any multi-gate eligibility check (generalize the gate card)

### Don't use when
- Tier-1 creator onboarding (no equity for T1-T3 — they get pay-per-verified-customer instead)
- Non-RSA equity flows (options, RSUs) — those have different legal copy

---

## V1.6. DisclosureBot audit row (v5.1)

**Path:** `app/(admin)/admin/disclosure-audits/*`
**Positioning:** DisclosureBot is the v5.1 FTC-disclosure compliance system — admin queue reviews its verdicts

### Purpose
Admin queue for reviewing DisclosureBot audits. Table row + sticky 420px detail sidebar, same shell as the v5.0 AI verification queue (section 0.6) but tuned for FTC-disclosure decisions (has #ad? correct placement? correct platform-specific tag?).

### Table row
```
tr.db-audit-row
├── td.db-audit-platform     platform icon (IG / TT / YT / X)
├── td.db-audit-handle       "@maya.eats.nyc" (mono)
├── td.db-audit-post         short URL + post-type icon
├── td.db-audit-verdict      <span.db-verdict-badge.db-verdict-badge--{ok|rej|pending}>
├── td.db-audit-when         "12m ago"
└── td.db-audit-actions      "View details →"
```

### Verdict badge taxonomy
- `db-verdict-badge--ok` → green, "Compliant" (auto-approved by DisclosureBot)
- `db-verdict-badge--rej` → Flag Red, "Missing #ad" or "Bad placement"
- `db-verdict-badge--pending` → Champagne, "Manual review"

### Detail sidebar (sticky 420px)
```
aside.db-audit-detail  (position: sticky; top: 24px; width: 420px)
├── header.db-audit-detail-head
│   ├── span.db-audit-detail-eyebrow     "Audit · id#..."
│   └── h3.db-audit-detail-h3            creator handle + platform
├── figure.db-audit-post-preview         ← post preview (image + caption, scrollable)
├── section.db-audit-findings
│   ├── ul.db-audit-missing              list of missing tags/required words
│   └── p.db-audit-position              "Disclosure in bio (required in caption top 3 lines)"
├── dl.db-audit-meta                     dt/dd pairs: model, latency, confidence, scanned_at
└── footer.db-audit-actions
    ├── button.db-audit-btn.db-audit-btn--approve   "Mark compliant"
    ├── button.db-audit-btn.db-audit-btn--reject    "Mark non-compliant"
    └── textarea.db-audit-note                      admin review note (required on reject)
```

### Visual rules
- **Sidebar width locked at 420px** on desktop ≥1200px; collapses below nav on narrower viewports (becomes a modal)
- **Post preview:** Surface Elevated `#ffffff`, 1px Steel Blue border, max-height 320px with internal scroll
- **Missing tags list:** each missing tag renders as a Flag Red pill with `#` prefix (e.g., `#ad`, `#sponsored`)
- **Model + latency meta:** CS Genio Mono, 11px, Graphite — reads like a receipt
- **Approve/reject buttons:** zero radius; approve = Deep Space Blue bg + white text; reject = Flag Red bg + white text
- **Review note required on reject:** button disabled until textarea has ≥10 chars when verdict is reject

### Use when
- Admin DisclosureBot review (only route)
- Any admin "binary approve/reject on one item with post preview" queue — generalize the shell

### Don't use when
- AI verification queue (v5.0 section 0.6 covers that — different data shape)
- Creator-facing disclosure feedback (they see a different, non-admin surface with hints only)

---

## V1.7. Pilot economics calculator (v5.1)

**Path:** `app/(marketing)/merchant/pilot/economics/*`
**Positioning:** Two-Segment pricing means unit economics vary per-vertical — this calculator lets a merchant see their own math before signing

### Purpose
Interactive calculator on the pilot page. Merchant picks a vertical, moves 3 sliders (target customers / avg ticket / repeat visits), and 7 output cards update live with the derived economics. Sticky form on the left, cards on the right.

### Layout
```
section.pilot-econ (d-flex on ≥1100px)
├── aside.pilot-econ-form                ← sticky left column
│   ├── select.pilot-econ-vertical       Coffee / Restaurant / Retail / Beauty-Wellness / Fitness / Bar-Nightlife
│   ├── .pilot-econ-slider               Target customers (10 – 200)
│   ├── .pilot-econ-slider               Avg ticket ($5 – $80)
│   ├── .pilot-econ-slider               Repeat visits / 30d (1 – 8)
│   └── p.pilot-econ-note                "Baselines update when you change vertical."
└── div.pilot-econ-cards                 ← 7 collapsible output cards (right column)
    ├── .pilot-econ-card  1  Projected verified customers
    ├── .pilot-econ-card  2  Per-customer cost
    ├── .pilot-econ-card  3  Total Push cost
    ├── .pilot-econ-card  4  Expected revenue (AOV × visits × customers)
    ├── .pilot-econ-card  5  Derived LTV
    ├── .pilot-econ-card  6  Payback period (weeks)
    └── .pilot-econ-card  7  ROI multiple
```

### Slider behavior
- **Vertical dropdown** sets the per-vertical rate (from V1.2 table) as a hidden dependent input
- **Sliders** update on `input` event — no debounce, the math is trivial
- **Range pills** show min/max/current above each slider: e.g., `10 ........ [62] ........ 200`
- **Current value** rendered in Champagne; range pills in Graphite

### Output card visual rules
- **Collapsible:** each card has a header (metric name + current value) + collapsed body with the formula breakdown. Click header to expand
- **Head value:** Darky-900, 28px. Champagne color ONLY on card 7 (ROI multiple) as the emphasis
- **Formula breakdown:** CS Genio Mono, 12px, with each line showing `term × term = result` — reads like a receipt
- **Card surface:** Surface Elevated `#ffffff`, 1px Steel Blue border, zero radius
- **Stagger on expand:** 60ms per card when "Expand all" is clicked

### Sticky behavior
- **Form column** sticks at `top: 96px` (below sticky nav) on desktop
- **Cards column** scrolls naturally
- Below 1100px: form moves above cards, stickiness disabled

### Use when
- Merchant pilot economics page (only location)
- Any "adjust inputs, watch derived outputs" calculator — generalize the sticky-form-plus-cards pattern

### Don't use when
- Mobile-first surface where sticky form would eat viewport (default to a collapsible accordion instead)
- Non-pilot pricing display (use the pricing-tier card V1.2 for static per-vertical rates)

---

## 0.1. AgentOutputDemo (v5.0)

**Path:** `components/landing/AgentOutputDemo.tsx`
**Animation CSS:** `.agent-demo*` selectors in `app/(marketing)/landing.css`
**Currently used on:** `app/(marketing)/page.tsx` (hero right column)

### Purpose
Cinematic terminal-style card that simulates one agent run in ~3 seconds. This is a **fixture**, not real-time streaming — don't wire it to an API. Use when a marketing surface needs to show "the agent works" without actually running an agent.

### Structure
```
div.agent-demo[aria-hidden="true"]
├── div.agent-demo-bar                 ← window chrome
│   ├── span.agent-demo-dot
│   ├── span.agent-demo-title          "push-agent"
│   └── span.agent-demo-meta           "claude-sonnet-4-6"
└── div.agent-demo-body
    ├── div.agent-demo-row--prompt     goal line, starts with ">"
    ├── div.agent-demo-row--status     progress-bar track + "matching creators…"
    └── div.agent-demo-output
        ├── div.agent-demo-out-label   "Top 5 matches · 47s"
        ├── ul.agent-demo-list         ← 5 staggered li.agent-demo-item
        │   └── li (dot + handle + tier + score + est customers)
        └── div.agent-demo-footer      "Est. deliverable" / champagne-edged
```

### Visual rules
- **Background:** `rgba(10, 22, 35, 0.92)` (Deep Space Blue, dark terminal)
- **Accents:** Steel Blue `#669bbc` (primary cold hue), Graphite `#4a5568` (tier dot variant), Champagne `#c9a96e` (footer stripe only)
- **Typography:** CS Genio Mono throughout — never Darky
- **Per-item stagger:** `animationDelay: 1.6 + i * 0.35s` (see component for inline style), feeds a fade-up keyframe in landing.css
- **Tier dot color:** passed inline via `style={{ background: tierColor }}`; palette: Steel `#4a5568`, Gold `#c9a96e`, Bronze `#8c6239`
- **Per-creator est:** free-text string like `"6 customers"` — not a formatted number; keep in MATCHES fixture

### Responsive
Hidden below **1100px** via CSS (`.agent-demo { display: none }` inside the breakpoint). Mobile hero stays editorial / text-only. Do not try to adapt this card to narrow viewports.

### Accessibility
- Whole card is `aria-hidden="true"` — decorative only, no reader exposure
- `@media (prefers-reduced-motion: reduce)` in landing.css should zero out all `.agent-demo*` animations

### Use when
- Landing hero needs a "proof of life" of the agent
- Section needs a visual anchor that says "AI running"

### Don't use when
- You need to stream real agent output → build a streaming surface instead
- Viewport is mobile-first / text-only page
- The surface already has a full-width `.agent-preview` card (section 0.5) — don't stack two agent visualizations

---

## 0.2. VerificationBadge (v5.0)

**Path:** `components/landing/VerificationBadge.tsx`
**Currently used on:** `app/(marketing)/page.tsx`, `app/(marketing)/merchant/pilot/page.tsx`, `app/(marketing)/neighborhoods/williamsburg-coffee/page.tsx`

### Purpose
3-column trust strip showing the AI verification stack: **QR scan → Claude Vision → Geo-match**. Core brand artifact of v5.0 positioning — use on any marketing page that needs to explain verification in one glance.

### Structure
```
div.verify-badge
├── div.verify-badge-head              ← rule line + eyebrow "AI Verification Layer"
├── div.verify-badge-row               ← 3 × .verify-badge-col
│   └── div.verify-badge-col
│       ├── div.verify-badge-icon      ← hand-rolled SVG (22×22, stroke currentColor)
│       ├── span.verify-badge-label    "QR Scan" / "Claude Vision" / "Geo-match"
│       ├── span.verify-badge-sub      subtitle
│       └── span.verify-badge-connector  →  (arrow to next col; last col omits)
└── p.verify-badge-tagline             "All three must pass within 8 seconds. No verification, no charge."
```

### Visual rules
- **Surface:** Surface Elevated `#ffffff` (light card)
- **Icon chip:** `rgba(102, 155, 188, 0.08)` background, `rgba(102, 155, 188, 0.25)` 1px border (Steel Blue family)
- **SVG style:** `strokeLinecap="square"`, `strokeWidth="1.5"`, no rounded stroke ends (matches the zero-radius house rule)
- **Per-col delay:** `transitionDelay: i * 90ms` via inline style — adds a read-as-sequence feel
- **Three icons shipped:** `QrIcon` (nested rects), `VisionIcon` (eye w/ crosshair), `GeoIcon` (pin w/ dot)

### Responsive
- Breakpoint < 760px: collapse to single column, hide `.verify-badge-connector` arrows
- Don't resize the SVG icons — they're fixed 22×22 for optical consistency

### Use when
- Any v5.0 marketing page needs to answer "how do you verify this is a real customer?"
- Landing surface, pilot-merchant page, neighborhood page — already wired on all three

### Don't use when
- You just need a single verification icon (pull icon out of this file)
- You need to show live verification state (green/yellow/red) — this is a static explainer, not a dashboard widget

---

## 0.3. Merchant Goal Input form (v5.0)

**Path:** `app/(merchant)/merchant/onboarding/page.tsx` — `GoalStep` component
**Related marketing surface:** `app/(marketing)/merchant/pilot/page.tsx`
**CSS class prefix:** `.ob2-*` (onboarding v2)

### Purpose
The **only** input a merchant gives the agent. Replaces the legacy 7-step brief. Five fields that together parameterize one agent run.

### Fields (in order)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Business name | `input[type=text]` | yes | Placeholder: `"Sey Coffee"` |
| Category | `select` | yes | Options: `CATEGORIES` — Coffee / Restaurant / Bar·Nightlife / Retail / Beauty·Wellness / Fitness / Other |
| ZIP / Neighborhood | `input[type=text]` | yes | Placeholder: `"11211 — Williamsburg"` |
| Customer target | `select` | yes | Options: `GOAL_OPTIONS` — 10 / 20 / 50 / 100 (with timeframe labels) |
| Monthly budget (USD) | `input[type=number]` min=500 step=100 | yes | Placeholder `"800"` |

### Structure
```
.ob2-field                ← vertical group (label + input)
.ob2-label                ← uppercase CS Genio Mono label
.ob2-input / .ob2-select  ← zero-radius field
.ob2-field-row            ← side-by-side pair (use for Category + ZIP)
.ob2-input-hint           ← small help text under budget
.ob2-step-actions         ← wraps primary CTA
.ob2-btn-primary          ← disabled until all 5 fields filled
```

### v5.0 pricing copy (MANDATORY on this form)
Under the budget field, this exact phrasing:
> "Performance tier: $500/mo min + $40 per AI-verified customer. Pilot merchants (first 10 in Williamsburg coffee) get the first 10 customers on us."

### Primary CTA
Label: `"Send to agent →"` (en dash, rightward arrow). **Disabled until** `businessName`, `customerGoal`, `budget`, and `zip` are all non-empty.

### Use when
- Any v5.0 merchant-facing onboarding surface
- Pilot landing CTA that asks "tell the agent your goal"

### Don't use when
- Legacy multi-step brief form — that pattern is deprecated by v5.0

---

## 0.4. Agent Pending state (v5.0)

**CSS:** `app/(merchant)/merchant/onboarding/agent-onboarding.css` — selectors `.agent-pending-*`
**TSX example:** `AgentPreviewStep` in `app/(merchant)/merchant/onboarding/page.tsx`

### Purpose
Shown while the agent is running (1–3 seconds). Gives the merchant a deterministic "something is happening" without a spinner.

### Structure
```
div.agent-pending
├── div.agent-pending-header
│   ├── span.agent-pending-dot              ← pulsing green dot
│   └── span.agent-pending-label            "claude-sonnet-4-6 · matching creators"
├── div.agent-pending-bar                   ← bar track
│   └── div.agent-pending-bar-fill          ← sliding fill (30% width, translates)
└── ul.agent-pending-list                   ← 4 status lines, staggered
    ├── li  "Parsing goal — {N} customers"
    ├── li  "Scanning creator network for {category} · {zip}"
    ├── li  "Ranking by score + geo + verified-conversion history"
    └── li  "Drafting campaign brief + ROI prediction"
```

### Animations (all defined in agent-onboarding.css)
| Element | Keyframe | Duration | Detail |
|---------|----------|----------|--------|
| `.agent-pending-dot` | `agent-pulse` | 1.6s ease-in-out infinite | opacity `1 → 0.3 → 1` |
| `.agent-pending-bar-fill` | `agent-slide` | 1.8s linear infinite | fill 30% wide, translates `0% → 100%` |
| `.agent-pending-list li:nth-child(1)` | `agent-line-in` | 0.5s forwards | delay `0.1s` |
| `.agent-pending-list li:nth-child(2)` | `agent-line-in` | 0.5s forwards | delay `0.45s` |
| `.agent-pending-list li:nth-child(3)` | `agent-line-in` | 0.5s forwards | delay `0.8s` |
| `.agent-pending-list li:nth-child(4)` | `agent-line-in` | 0.5s forwards | delay `1.15s` |

All three keyframes are disabled via `@media (prefers-reduced-motion: reduce)` at the bottom of the file.

### Use when
- The merchant has just submitted the goal form and the agent is running
- Any "AI is thinking" interstitial in an agent-led workflow

### Don't use when
- You need an indeterminate loading state for a non-agent request → use the generic app spinner instead

---

## 0.5. Agent Preview / Summary card (v5.0)

**CSS:** `app/(merchant)/merchant/onboarding/agent-onboarding.css` — selectors `.agent-preview-*`
**TSX example:** `AgentPreviewStep` (second half) in `app/(merchant)/merchant/onboarding/page.tsx`

### Purpose
Generic "the AI returned this" surface. Shows a 4-stat summary + matched creators + draft brief. Reuse for any page that needs to display an agent result.

### Structure
```
div.agent-preview
├── div.agent-preview-summary               ← dark card with champagne 3px left border
│   ├── .agent-preview-summary-head → .agent-preview-summary-eyebrow "Agent result · 1.8s"
│   └── .agent-preview-summary-grid         ← 4-column stat row
│       └── .agent-preview-summary-stat × 4
│           ├── .agent-preview-summary-num     (Darky-800 32px, Champagne color)
│           └── .agent-preview-summary-label   (CS Genio Mono 10px uppercase)
├── div.agent-preview-section  ← "Top 5 matches"
│   └── ul.agent-preview-matches
│       └── li.agent-preview-match
│           ├── .agent-preview-match-head
│           │   ├── .agent-preview-match-dot      (tierColor bg)
│           │   ├── .agent-preview-match-handle   ("@maya.eats.nyc")
│           │   ├── .agent-preview-match-tier     (tierColor + tierTextColor pill)
│           │   ├── .agent-preview-match-score    ("94" + score label)
│           │   └── .agent-preview-match-est      ("+6 customers")
│           └── p.agent-preview-match-reason
└── div.agent-preview-section  ← "Draft brief"
    └── .agent-preview-brief → dl (dt "Headline"/"CTA"/"Tone"/"Offer hook" + dd values)
```

### Visual rules
- **Summary card bg:** Deep Space Blue dark surface
- **Left border:** 3px Champagne `#c9a96e` — the visual signature of "AI returned this"
- **Stat row:** 4 equal columns on desktop, wraps on narrow
- **Stat number:** Darky-800 32px, Champagne color
- **Stat label:** CS Genio Mono 10px, uppercase
- **Tier pill:** background = `tierColor`, text = `tierTextColor` (both passed per-match)
- **Match row:** single horizontal flex strip on wide, wraps on narrow

### Four summary stats (convention from onboarding)
1. Est. verified customers (int)
2. Agent confidence (percent — `Math.round(confidence * 100)`)
3. Est. spend (`$${spend}`, derived `$40 × customers`)
4. Projected ROI (`3.2×` format — one decimal + multiplication sign)

### Use when
- Any surface that shows an agent-generated result — campaign previews, dashboard drill-ins, admin overrides
- Campaign summary card after launch

### Don't use when
- Live streaming agent output (use AgentOutputDemo variant with terminal styling)
- Non-AI content surfaces (don't retrofit this card onto static data)

---

## 0.6. AI Verification Review queue (v5.0)

**Path:** `app/(admin)/admin/ai-verifications/page.tsx` + `app/(admin)/admin/ai-verifications/ai-verifications.css`
**Data source:** `lib/admin/mock-ai-verifications` — types `MockAiVerification`, `AiVerdict`
**CSS class prefix:** `.aiv-*`

### Purpose
Admin queue for reviewing manual_review verdicts from the 3-layer AI verification pipeline. Two-pane layout: filterable table on the left, sticky detail/approve sidebar on the right.

### Page shell
```
.aiv-page
├── header.aiv-header
│   ├── .aiv-eyebrow "Admin · AI Verification Layer"
│   ├── h1.aiv-h1 "Manual review <span.aiv-h1-light>queue</span>"
│   ├── p.aiv-sub
│   └── .aiv-stats  ← 3 stat cells (in review / auto-verified / auto-rejected)
├── .aiv-filter-bar  ← pill buttons (all / manual_review / auto_verified / auto_rejected); active pill gets .aiv-filter-btn--active
└── .aiv-layout  ← 2-col
    ├── .aiv-table-wrap → table.aiv-table (9 cols)
    └── aside.aiv-detail (sticky 420px)
```

### Table — 9 columns
`scan | merchant | creator | amount | name-match % | geo | vision % | verdict | when`
- Rows use `.aiv-row`; selected row adds `.aiv-row--active`
- Mono cells (IDs, handles): `.aiv-mono`
- Verdict badges: `.aiv-badge` + modifier — `aiv-badge--ok` (verified/approved, green), `aiv-badge--rej` (rejected, red), `aiv-badge--pending` (manual_review, champagne)
- Empty state: single `td.aiv-empty` spanning 9 cols

### Verdict taxonomy (source: `AiVerdict` type)
- `auto_verified` — pipeline green-lit (green badge)
- `auto_rejected` — pipeline rejected (red badge)
- `manual_review` — sent to queue (champagne badge)
- `human_approved` — admin override to verified (green)
- `human_rejected` — admin override to rejected (red)

### Detail sidebar
- Empty state: `.aiv-detail-empty` with `.aiv-detail-empty-h` + body
- Row selected: `.aiv-detail-card` containing 8-cell info grid + approve/reject buttons + review-note textarea
- Approve/reject buttons call `resolve('human_approved' | 'human_rejected')` which rewrites the row's verdict

### Number formatting helpers (colocated in page.tsx, reuse verbatim)
- `formatRelative(iso)` — "5m ago" / "3h ago" / "2d ago"
- `formatAmount(n)` — `$12.50` or `—`
- `formatConfidence(v)` — `97%` or `—` (takes 0–1 float)
- `formatGeo(m)` — `120 m` under 1km, `1.2 km` at/over 1km, `—` if null

### Use when
- Building admin tooling that lets a human resolve AI verification edge cases
- Any "queue of flagged events that need a binary approve/reject decision" UX — the shell generalizes

### Don't use when
- You need creator-facing or merchant-facing verification UI (this is admin-only)
- You only have 1–2 verdict cases (overkill — use a simple status pill)

---

## 1. Navigation (Header)

### Structure
```
header.header (d-lg-flex, align-items-center)
└── container (d-flex, align-items-center, flex-wrap, flex-lg-nowrap)
    ├── a.logo (icon + text)
    ├── nav.header_nav.collapse
    │   └── ul.header_nav-list
    │       ├── li.dropdown → a.dropdown-toggle + div.dropdown-menu
    │       ├── li → a.nav-item (single links)
    │       └── li.header_nav-list_btn → a.btn (mobile CTA)
    ├── a.header_btn.btn--neon (desktop CTA)
    └── button.header_trigger (hamburger, < 992px)
```

### Behaviors
- **Sticky**: Fixed on scroll > 0
- **Headroom**: Hidden on scroll-down (past 500px), shown on scroll-up
- **Active State**: `.current` class on nav item matching `data-page`
- **Mobile**: Hamburger toggle at < 992px, opens full-height menu
- **Dropdowns**: Hover on desktop, click on mobile

### Key Details
- Logo: icon img + text span
- Dropdown arrow: `.icon-arrow-left` rotated
- Nav item indicator: `.icon-circle` dot inside link text
- CTA button: `.btn--neon` style (hard-edge shadow)

---

## 2. Buttons

### Variants
| Class | Style | Shadow |
|-------|-------|--------|
| `.btn--neon` | Filled primary, white text | `3px 3px 0 accent` → `6px 6px 0` on hover |
| `.btn--white` | White/surface bg, dark text | Same shadow pattern |
| `.btn--arrow` | Text + arrow icon, link-style | No shadow, underline on hover |

### Behaviors
- Hover: Shadow shifts from 3px→6px offset (hard-edge, no blur)
- Transition: 400ms ease-in-out
- All buttons: `border-radius: 0`

---

## 3. Cards

### Service Card (Full-Width, Horizontal)
```
li.services_list-item
├── div.media
│   ├── picture → img (lazy loaded)
│   └── span.media_icon → i.icon
└── div.main
    ├── h4.main_title
    ├── p.main_text
    ├── ul.main_list → li (icon-circle + text bullets)
    └── a.main_btn.btn--neon
```
- Image with icon overlay
- Title + description + feature bullets + CTA
- Horizontal layout on desktop, stacked on mobile

### Service Card (Compact, Vertical)
```
a.services_list-item (d-flex, flex-column)
├── i.icon
├── span.title.h5
└── p.text
```
- Icon top, title, description
- AOS fade-up with stagger delays
- Hover: shadow overlay fades in

### Blog Post Card (Grid)
```
div.blog_posts-item.post-item[data-groups]
└── div.wrapper
    ├── div.main
    │   ├── a.main_title.h5
    │   └── div.main_meta (d-flex)
    │       ├── span.main_meta-bookmark (optional)
    │       └── p.main_meta-item (date, author, comments)
    └── div.media → picture → img.lazy
```
- Filterable via Shuffle.js using `data-groups`
- Meta row: bookmark icon + date + author + comment count

### Blog Post Card (Sidebar List)
```
li.blog_posts-item
├── div.media → picture → img.lazy
└── div.main
    ├── a.main_title.h4 (larger title)
    ├── div.main_meta (same as grid)
    ├── p.main_preview (excerpt text)
    └── a.btn.btn--arrow (Read More + icon-arrow-right)
```
- Vertical card: image on top, full text below
- Includes preview/excerpt text
- Read More button with arrow

### Testimonial Card (Slider)
```
div.swiper-slide
├── div.main
│   ├── p.main_review (quote text)
│   ├── h6.main_author
│   └── span.main_company
└── picture → img (avatar)
```
- Inside Swiper carousel
- Review text + author name + company

---

## 4. Pricing Cards

### Structure
```
li.pricing_list-item
├── div.media (optional SVG on featured card)
├── div.pricing_list-item_header
│   ├── h5.title (plan name)
│   └── span.price
│       ├── span.sign ("$")
│       ├── span.int (whole number)
│       └── span.float (decimals)
├── ul.pricing_list-item_list
│   └── li.list-item → i.icon-circle + feature text
└── a.btn or span.btn (CTA or disabled current plan)
```

### Layout
- 3 columns on md+ (`d-flex, flex-md-row, flex-wrap`)
- Stacked on mobile
- Featured card: extra SVG decoration in `.media`
- Price split into 3 spans for independent styling

---

## 5. Accordion (FAQ)

### Structure
```
div.accordion#faq_accordion
└── div.accordion_item
    └── div.accordion_item-wrapper
        ├── h4.title[data-bs-toggle="collapse", aria-expanded]
        │   ├── question text
        │   └── span.title_icon.transform → i.icon-arrow-left
        └── div.accordion-collapse.collapse[.show on first]
            └── div.body → div.main
                ├── p.main_general
                └── ul.main_list → li.main_list-item
                    ├── span.number.countNum[data-prefix, data-value]
                    └── div.main → h6.title + p.text
```

### Behaviors
- Bootstrap collapse mechanism
- First item open by default (`.show`)
- Arrow icon rotates 180° via `.transform` class toggle
- Sub-items have counter animations that fire on expand

---

## 6. Collapsible Table

### Structure
```
div.model_table
├── div.model_table-header → 3 column labels (h6)
└── div.model_table-col (multiple rows)
    ├── span.cell.cell--trigger[data-bs-toggle="collapse"]
    │   ├── span.label (row name)
    │   └── i.icon-angle-left (rotates on toggle)
    └── div.cell-collapse.collapse
        └── span.cell → label + content (for each column)
```

### Behaviors
- Click row header → expand detail cells
- Icon rotates on open/close
- Each expanded row shows 2-3 cells of comparison data

---

## 7. Forms

### Input Pattern
```
form.form (d-flex, flex-column)
├── input.field.required[placeholder, name]
├── input.field.required[data-type="email"]
├── textarea.field.required
└── button.btn.btn--neon
```

### Validation
- `.required` → must not be empty
- `data-type="email"` → email regex
- `data-type="tel"` → numeric check
- Error: adds `.error` class (border color change)
- Clear: on input event, removes `.error`

### Success
- SweetAlert2 toast: `top-end`, 3000ms timer
- Form resets on success
- POST to form `action` attribute

---

## 8. Video Popup

### Structure
```
div.videoPopup (d-flex, align-items-center, justify-content-center)
└── div.container
    └── div.video_frame
        ├── i.icon-times.video_frame-close.btn--white (close button)
        └── div#YTplayer (YouTube player container)
```

### Trigger
- `.videoTrigger` click → adds `.visible` + `.fadeIn` to popup
- YouTube player loads and auto-plays
- Click outside frame → `.fadeOut` + `.visible` removed, video stops

---

## 9. Gallery Lightbox

### Structure
```
div.page_slider.swiper.gallery
└── div.swiper-wrapper
    └── div.swiper-slide
        └── a[data-role="gallery-link"] → picture → img.lazy
```

### Behavior
- Swiper handles sliding between images
- Click opens baguettebox.js fullscreen lightbox
- Lazy loading on all images

---

## 10. Ticker/Marquee Stripe

### Structure
```
div.stripe (d-flex, align-items-center)
├── div.stripe_block (d-none, d-sm-flex)
│   ├── span.stripe_block-icon → i.icon
│   └── ul.stripe_block-list (stats text)
└── div.ticker.h3#ticker (React marquee component)

div.d-none (hidden source)
└── span.ticker-item (repeated text items)
```

### Behavior
- Full-bleed horizontal stripe
- Left block: icon + stats (hidden on xs)
- Right: infinite scrolling marquee (15s cycle, RTL)
- Content sourced from hidden `.ticker-item` elements

---

## 11. Breadcrumbs

### Structure
```
ul.breadcrumbs (d-flex, flex-wrap)
├── li.breadcrumbs_item → a.link (parent pages)
└── li.breadcrumbs_item.current → span#currentpage
```
- Separator via CSS `::before` pseudo-element (slash or arrow)
- Current page: non-linked span

---

## 12. Share Panel (Article)

### Structure
```
div.share_panel
├── span.share_panel-label ("Share")
└── ul.share_panel-list (d-flex, flex-column)
    └── li → a.link → i.icon-{social}
```
- Floats to side of article main image (absolute positioned)
- Slide-in animation via `@keyframes panel` (1s, from right)
- Triggered by IntersectionObserver when in viewport
- Social icons: link, facebook, instagram, twitter, linkedin, whatsapp

---

## 13. Progress Bars (Article)

### Structure
```
div.article_progress
├── h5.article_progress-header
└── div.article_progress-main (d-flex, flex-column)
    └── div.block
        ├── div.block_header → span.number.h3 + span.label
        ├── span.progressLine[data-value, data-fill]
        └── div.progressLine-legend → span.label (start/end)
```
- ProgressBar.js animates width from 0 to `data-value`%
- 700ms duration, scroll-triggered
- Color from `data-fill` attribute

---

## 14. Pagination

### Structure
```
ul.pagination (d-flex, flex-wrap, align-items-center, justify-content-end)
├── li.pagination_item → a.link.current (active page)
├── li.pagination_item → a.link (other pages)
└── li.pagination_item → a.control (next arrow)
```
- Right-aligned
- `.current` class on active page
- Arrow icon for next page

---

## 15. Back-to-Top Button

### Structure
```
a.footer_scroll#scrollToTop → i.icon-arrow-up
```
- Fixed position, bottom-right
- Click: `window.scrollTo(0, 0)`
- Shows on scroll past threshold

---

## 16. Signup/Modal Popup (SweetAlert2)

### Configuration
```js
Swal.fire({
  customClass: {
    container: 'signup_container',
    popup: 'signup_popup',
    htmlContainer: 'signup_wrapper'
  },
  showClass: { popup: 'fadeIn' },
  hideClass: { popup: 'fadeOut' },
  showConfirmButton: false,
  showCloseButton: true,
  closeButtonHtml: '<i class="icon-times"></i>'
})
```
- Triggered by `.signUpTrigger` click
- Closes mobile menu first if open
- Contains form with validation
- Custom fade animations

---

## 17. Lazy Loading Images

### Pattern
```html
<picture>
  <source data-srcset="path.webp" srcset="placeholder.jpg" type="image/webp" />
  <img class="lazy" data-src="path.jpg" src="placeholder.jpg" alt="..." />
</picture>
```
- Vanilla LazyLoad: `{ repeat: true, smooth: true }`
- Uses `data-src` / `data-srcset` for deferred loading
- Smooth fade-in on load complete

---

## 18. Decorative Shapes

### Pattern
```
div.section_shapes (position: absolute, full-size, z-index: -1)
├── div.half--left
│   ├── span.circle--big
│   └── span.circle--small
└── div.half--right
    ├── span.circle--big
    └── span.circle--small
```
- CSS circles/ovals with border-only or filled styles
- Positioned at edges of sections
- Low z-index, non-interactive
- Optional: SVG shapes loaded as `<img>` tags

---

## 19. Lottie Animations

### Pattern
```html
<lottie-player
  class="lottie"
  src="lottie/animation.json"
  background="transparent"
  speed="0.5"
  style="width: 100%; height: 100%"
  loop
  autoplay
></lottie-player>
```
- Used for: hero illustrations, form sections, page headers
- Loaded via `@lottiefiles/lottie-player` script
- JSON-based vector animations
- Speed: 0.5 (hero) or 1.0 (other sections)

---

## 20. Map Component

### Setup
- Google Maps JS API Loader
- Uses AdvancedMarkerElement with custom SVG marker
- Theme: desaturated (grayscale) with accent color on landscape
- `disableDefaultUI: true` for clean look
- zoom: 10, centered on coordinates
