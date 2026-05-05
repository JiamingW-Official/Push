# Push — Design System v12

> **Authority**: Single source of truth for every UI surface in Push. Color, typography, shape, grid, spacing, components, motion — all conform to the tokens below.
>
> **Status (2026-05-01, consolidated)**: v11 editorial register + v12 Figma-synced typography. Three fonts (Magvix / Darky / CS Genio Mono), 11-stop warm-gray ladder, light mode only, 8px grid, 12-column desktop grid, 5 unified buttons, bottom-right hover shift, GA Tri-Color nav chrome. § 0's three-tier rule classification (🔒 STRICT / 📐 STRUCTURED / 🎨 OPEN) governs every rule below.
>
> **Last calibrated**: 2026-05-01 (consolidation pass — historical migration notes pruned, GA Tri-Color hex aligned to Figma, sticky/floating navbar specs merged, Build Checklist folded into § 1 Quick Reference).
> **Next planned review**: After Williamsburg Tier 0 pilot launches (2026-05-23).

---

## Contents

| § | Section | Tier |
|---|---------|------|
| 0 | Three-Tier Rule Classification — read first | — |
| 1 | Core Principles — the 12 non-negotiables | 🔒 |
| 2 | Color Palette — Closed Allowed-Color List | 🔒 |
| 3 | Typography — Figma-synced type scale | 🔒 |
| 4 | Shape & Radii — iOS 26 continuous corner | 🔒 |
| 5 | Grid System — 8px atomic + 12 / 8 / 4 column | 🔒 |
| 6 | Negative-Space Tokens — locked per container | 🔒 |
| 7 | Corner-Anchored Title Rules | 📐 |
| 8 | Component Specifications | 🔒 / 📐 |
| 9 | Unified Button System — 5 variants | 🔒 |
| 10 | Layout & Spacing Tokens | 🔒 |
| 11 | Elevation & Depth | 🔒 |
| 12 | Motion | 🔒 |
| 13 | Icon System | 🔒 |
| 14 | Responsive Breakpoints | 📐 |
| 15 | Modular Panel Discipline | 📐 |
| 16 | Hover Behavior — bottom-right shift signature | 🔒 |
| 17 | Build Checklist | — |
| 18 | Authority & Conflict Resolution | — |
| 19 | Component Library — Figma Audit (GA Dark Register) | 🔒 / 📐 |

---

## 0. Three-Tier Rule Classification (READ FIRST)

Push's design system is 3 layers stacked. **Every rule in this document carries one of three tags** — read the tag before you decide whether you can deviate.

### 🔒 STRICT — Identity (the bones that make Push recognizable)

Cross-page invariant. Cannot be modified per-page, per-context, or per-mood. Changing a STRICT rule requires a Design.md PR with user (Jiaming) sign-off.

**Examples:** the 11-stop warm-gray ladder color tokens, the 3 fonts and their roles, the 8px atomic grid, the 5 unified button variants, the GA Tri-Color nav structure, the Footer pattern (Editorial Blue panel + Darky Giant Wordmark bottom-left), the page background `#ffffff` Snow, body color `#61605c`, the bottom-right hover shift, the editorial-moment palette (Editorial Blue / Pink / GA Orange), the closed Allowed-Color List rule, the 12px font floor.

### 📐 STRUCTURED — Composition (how content arranges)

Has a finite allowed-variant set. Designer picks ONE variant from the set; cannot improvise outside the set. Adding a new variant requires Design.md update.

**Examples:** the modular panel inventory (10 panel types in § 15.1), corner-anchored title placement rules (3 anchor positions), negative-space tokens per container type (every container's text-to-edge / text-to-line / text-to-vector / text-to-text spacing is in § 6 tables), the 12 / 8 / 4 column grid, cell-span vocabulary (12, 6+6, 4+4+4, 3×4, 8+4 — no custom 7+5), the radii scale (`4 / 8 / 10 / 12 / 16 / 20 / 28 / 40 / pill / circle`), the 3 selective `border-radius: 0` exceptions, the liquid-glass tile pattern (where it can peek, how many per panel), the image-card patterns (Photo Card with overlay vs framed photo tile vs decorative collage), the Editorial Table Cinema-Selects layout, the Magvix Italic Signature Divider phrasing library, Mono Eyebrow Parenthetical vs Canonical register split.

### 🎨 OPEN — Voice (editorial judgment within bounds)

Designer can improvise. The bounds are still set by STRICT and STRUCTURED rules above, but within those bounds the designer makes the call.

**Examples:** which photograph to feature in a hero, which Magvix Italic phrasing to use for the divider (`End of campaign · Fin ·` vs `Posted · Scanned · Verified ·` — pick what fits the surrounding panels), which adjective in the eyebrow (`(WHY THIS EXISTS)` vs `(WHAT WE DO)`), which inner-card layout (4+4+4 row vs 6+6 split vs 8+4 hero+sidebar), whether to use the Editorial Pink CTA stamp this page or skip it (≤1 per page max), whether to use the Bright Yellow stat tile, which Magvix Italic inline accent word to highlight in a hero headline, which liquid-glass tile to anchor where (within § 8.9's allowed positions), the order of stories in a Photo Grid panel, the tone (warm / cool) chosen for the Adventure router panel.

### How to read this doc

- Every rule body in this document is preceded by one of: **🔒 STRICT** / **📐 STRUCTURED** / **🎨 OPEN**.
- If a rule has no tag, default it to **STRICT** (this preserves system integrity in ambiguous cases).
- When implementing a new page, work top-down: ① obey all STRICT rules ② pick from STRUCTURED variants ③ improvise within OPEN bounds.
- When auditing an existing page, work bottom-up: ① flag deviations from STRICT first (these must be fixed) ② flag STRUCTURED off-list choices second ③ leave OPEN choices alone unless they break the page's editorial coherence.

---

## 1. Core Principles 🔒 STRICT

The 12 non-negotiables. Every other section is the implementation detail of one of these:

1. **Closed Allowed-Color List.** Production CSS may only use color tokens listed in § 2. Photos and SVG visual effects exempt. New colors require a documented PR.
2. **8px grid, enforced.** Every width / height / padding / margin / gap / top / left snaps to 8px. Half-grid (4px) only for hairlines and chip gaps. § 5 has the full system.
3. **Negative-space tokens are locked per container.** § 6 lists every container's text-to-edge / text-to-line / text-to-vector / text-to-text spacing. Eyeballing is forbidden.
4. **Three fonts, role-locked.** Magvix (Regular + Italic) for hero / wordmark / signature divider — max 1 hero block per page; Darky for display / heading / numerals / footer giant wordmark; CS Genio Mono for body / UI / labels / parenthetical eyebrow. Magvix never below 28px.
5. **Corner-anchored titles for editorial moments.** Hero title hugs panel **bottom-left**, section titles hug **top-left**, footer Giant Wordmark hugs **bottom-left**. Centered titles only inside Ticket Panel + Photo Card overlay + Modal.
6. **iOS 26 continuous corner — selective use.** Radii scale `4 / 8 / 10 / 12 / 16 / 20 / 28 / 40 / pill / circle`. `border-radius: 0` permitted in 3 places only: full-bleed Photo Card Hero, Editorial Hero Tile billboard, image-collage card. Everything else uses the scale.
7. **Unified button system, 5 variants only.** § 9 is the single source. Every button on every page renders identically.
8. **Bottom-right hover shift** is the Push interaction signature — `translate(1px, 1px)` on hover, `translate(2px, 2px) scale(0.98)` on active. Static badges, GA nav pills, Ticket Panel grommets, Footer Giant Wordmark do NOT shift.
9. **Marketing vs Product registers must NOT mix in the same viewport.** Marketing (Home / Landing / Showcase / About / Pricing / Blog) uses Ticket Panel + Magvix Italic Divider + Photo Card with gradient + Editorial Table + Parenthetical Eyebrow + corner-anchored Magvix hero. Product (Dashboard / Settings / Forms / Onboarding / In-app) uses Candy-Panel + canonical Eyebrow + clean component voice.
10. **Light mode only.** Page bg `--snow #ffffff`. All product UI shells, pages, main content, and card surfaces render on `#ffffff` — cards defined by `--shadow-1/2/3` alone, no border. Cream tokens (`--surface` / `--surface-2` / `--surface-3`) reserved for Marketing register. Body text `--ink-3 #61605c`; headings `--ink #0a0a0a`.
11. **12px minimum font floor**, with two exceptions: Footer Giant Wordmark up to 320px, Hero Magvix up to 200px (Caption is a third documented exception at 10px).
12. **Responsive is naturally adaptive, not redrawn per breakpoint.** Same composition / same hierarchy across mobile / iPad / desktop — only spacing scale + column count adjust. § 14 has the breakpoint table.

---

## 2. Color Palette (Closed Allowed-Color List)

These are the only color tokens that may appear in production CSS. Any new color requires a documented update to this file. Photos and SVG visual effects are exempt.

### 2.1 The 11-stop Warm-Gray Ladder (foundation — text, surfaces, dividers, dark UI)

The Push warm-gray ladder runs from pure snow to absolute obsidian, all warm-leaning, all derived from the same hue family. Three of the eleven stops (`--graphite`, `--mist`, `--char`) are warm-neutral tokens introduced to fill historical gaps; use them when the existing ink stops feel too cool or too contrasty.

| # | Token | Name | Hex | Role |
|---|-------|------|-----|------|
| 1 | `--snow` | Snow | `#ffffff` | **Default page background** — page chrome, main shells, all product UI cards. Also: text on dark surfaces (Editorial Blue, Ink, Char, Obsidian, GA Orange Ticket). |
| 2 | `--surface` | Ivory Cream | `#f8f4e8` | Marketing register only — Candy Panel fill, Editorial section bg. **NOT** for product UI page or card backgrounds. |
| 3 | `--surface-2` | Pearl Stone | `#f5f3ee` | Marketing register — alternate Candy Panel, Photo Card frame inset, Ticket Panel inner. |
| 4 | `--surface-3` | Bone | `#ece9e0` | Button hover, Pill button fill, muted block, inactive tab background. |
| 5 | **`--mist`** | Mist | `#d8d4c8` | Card frame border, divider band, hover state on light surface, image card backdrop |
| 6 | `--ink-6` | Ink 6 | `#cfcfcf` | Placeholder text, disabled state, lightest chip fill |
| 7 | `--ink-5` | Ink 5 | `#9a9a9a` | Tertiary metadata, icon-secondary |
| 8 | `--ink-4` | Ink 4 | `#6a6a6a` | Secondary label, metadata |
| 9 | `--ink-3` | Warm Body | `#61605c` | **Body copy** (locked — every paragraph, every caption descender) |
| 10 | **`--char`** | Char | `#3a3835` | Dark panel alternative to `--ink` (softer, warmer); editorial dark-card background; hover state on Ink panel |
| 11 | **`--graphite`** | Graphite | `#2c2a26` | Mid-strong heading color (between `--ink` H1 and `--ink-3` body); secondary CTA text on light surface; nav text |
| 12 | `--ink-2` | Ink 2 | `#1f1f1f` | Secondary heading, emphasized body, dark panel surface |
| 13 | `--ink` | Ink | `#0a0a0a` | **Primary text, all headings, icon strokes, default UI ink** |
| 14 | `--obsidian` | Obsidian | `#000000` | Reserved — Darky giant wordmark surface only (footer interior contrast); not a body / heading color |

**Hairlines (subset of gray ladder)**:

| Token | Value | Use |
|-------|-------|-----|
| `--hairline` | `rgba(10, 10, 10, 0.08)` | Section divider (border-top / border-bottom), Ghost button border (§ 9.4), input idle border, glass-tile bezel. **NOT used as a 4-sided card border.** |
| `--hairline-2` | `rgba(10, 10, 10, 0.14)` | Emphasized divider, focused input border |
| `--hairline-dotted` | `repeating-linear-gradient(to right, rgba(10,10,10,0.20) 0 4px, transparent 4px 8px)` | Editorial Table row divider, Ticket Panel perforation edge |

**🔒 STRICT — All page + card backgrounds are pure white `#ffffff`.** Page chrome (body, main shell, rail, dashboard, all product UI surfaces) renders on `#ffffff`. Cards are also `#ffffff`. White-on-white surfaces are defined by `--shadow-1/2/3` elevation alone — no border, no tint, no contrast fill. This is the Apple iOS / Notion-style aesthetic: shadow does the work, the page breathes uniformly, and cards float instead of being framed.

**🔒 STRICT — Card surfaces have NO border.** Standard cards (`-card`, `-panel`, `-tile`, `-surface`, `-wrap`, `-modal` containers) are defined ONLY by `--shadow-1/2/3` elevation. A 1px hairline on top reads as visual chrome and creates the "extra strip" / corner-notch artifact whenever inset elements (e.g., the OVERDUE 4px top bar) are positioned via `top:0/left:0` against the card's padding-box. Functional borders (Ghost buttons, inputs, selects, pills, glass-tile bezels) are exempt — they need the border for affordance, not for boundary definition. Cream tokens (`--surface`, `--surface-2`, `--surface-3`) remain available for Marketing register only (Candy Panels, Editorial moments) — never for Product UI page or card backgrounds.

### 2.2 Brand Signatures (3 colors, role-locked)

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `--brand-red` | `#c1121f` | **Primary CTA** | Apply, Launch, Reserve, Submit — every primary commitment button, every active tab, brand accent line, logo |
| `--accent-blue` | `#0085ff` | **Secondary CTA** | "Learn more", "Read docs", "View pricing", informational link, chart axis accent |
| `--champagne` | `#bfa170` | **Ceremonial** | Partner tier, premium badge, award moment, ceremonial CTA. Max 3 instances per viewport. |

Brand-Red and Champagne in the same module require a neutral anchor between them. N2W Blue + Brand Red can co-exist in the same viewport (complementary roles), but never both primary buttons in the same row.

#### Brand color tints (derivative tokens, OK to use)

```css
--brand-red-deep: #9b0e19;   --brand-red-tint:  rgba(193,18,31,0.08);   --brand-red-focus: rgba(193,18,31,0.18);
--accent-blue-deep: #0077b5; --accent-blue-tint: rgba(0,133,255,0.10);
--champagne-deep: #9d8256;   --champagne-light:  #e8dcc3;                --champagne-tint:  rgba(191,161,112,0.14);
```

### 2.3 Editorial Moments (3 saturated tokens — page-level punctuation, ≤1 per viewport)

| Token | Hex | Role |
|-------|-----|------|
| `--editorial-blue` | `#1e5fad` | **Footer panel** (only allowed instance per page). Optional: 1 hero billboard per landing page max. Snow text only. |
| `--editorial-pink` | `#e8447d` | Single editorial CTA pill OR share-card stamp per page. Snow text only. |
| `--ga-orange` | `#ff5700` | **Ticket Panel fill** + Nav Home pill fill. Snow text on Nav pill, Ink text inside Ticket Panel. (Figma source of truth: node 1:42) |

Derivative tokens (OK to use):

```css
--editorial-blue-deep: #144a8a;   --editorial-blue-tint: rgba(30,95,173,0.10);
--editorial-pink-deep: #c8336a;   --editorial-pink-tint: rgba(232,68,125,0.10);
--ga-orange-deep:      #cc4500;   --ga-orange-tint:      rgba(255,87,0,0.12);
```

**Editorial Moment Rules**

- The three may co-exist on one page (Editorial Blue footer + 1 Pink CTA stamp + 1 GA Orange Ticket Panel) but **≤1 saturated editorial moment visible per viewport** at any scroll position.
- GA Tri-Color nav (Orange / Green / Sky) appears in nav chrome on every page and does NOT count as a "moment" because it is global chrome — it lives in a separate visual register from page content.
- Forbidden as section background colors outside their assigned container.

### 2.4 GA Tri-Color Nav (3 tokens — global chrome ONLY)

| Token | Hex | Pill Position | Pairs With |
|-------|-----|---------------|-----------|
| `--ga-orange` | `#ff5700` | Home pill (leftmost) | `--snow` text |
| `--ga-green` | `#32ce57` | Active page pill | `--ink` text |
| `--ga-sky` | `#a3caff` | Last pill (About / Sign in) | `--ink` text |

> Hex values are Figma source of truth (node 1:42). Older Design.md versions used `#ff5e2b / #4ade80 / #93c5fd` — these are deprecated; use the Figma-exact hex above.

**These three are nav-only. Forbidden as section bg, button fill, card fill, or any other surface.** They live exclusively inside `<nav>` chrome at the top of every page. CTA buttons elsewhere on the page still use Brand Red / N2W Blue / Editorial Pink — the nav and the CTA system speak different languages on purpose.

### 2.5 Status Semantics (3 tokens — system feedback ONLY) 📐 STRUCTURED

Status colors communicate the outcome of a system event (transaction settled, form invalid, scan in review). They are functional, not editorial — semantically locked to a single role each so users learn the visual language across portals (merchant dashboard, creator earnings, applicant review, etc.).

| Token | Hex | Role | Allowed surfaces |
|-------|-----|------|------------------|
| `--success` | `#34c759` | "Done / approved / paid" — terminal positive state | Status badge fill (with `--snow` text), bullet/dot indicator, micro-icon, progress-bar complete state |
| `--success-dark` | `#1f7a39` | "Done / approved / paid" — text on light bg | Status text label on `--surface` / `--surface-2`, table cell value (e.g. "Settled +$240") |
| `--warning` | `#ff9500` | "Needs attention / pending / fair" — non-blocking caution | Password-strength "fair" bar, soft warning badge, pending-review status text, low-priority alert icon |
| `--error` | `var(--brand-red)` | "Invalid / failed / blocked" — alias of Brand Red | Form-field error message text, failed-state badge, validation icon |

**Discipline:**
1. **Status colors are NOT editorial moments.** They never count toward the "≤1 saturated editorial moment per viewport" limit, but they also never replace editorial moments — a celebratory hero stamp uses `--editorial-pink`, not `--success`.
2. **Role-locked. Do not cross.** `--success` cannot fill a CTA button. `--warning` cannot fill a section background. `--error` is a Brand Red alias for form/validation contexts — outside forms, write `--brand-red` directly so intent is legible.
3. **Avoid red-as-anxiety.** Use `--warning` (orange) for cautions that are not failures (e.g. "12% of QRs pending review"). Reserve `--error` / `--brand-red` for hard validation failures and rejected states.
4. **Status badges only — never section bg.** A `--success`-filled banner spanning a full panel is forbidden. Status colors live in ≤120px-wide chips, dots, micro-icons, or single-line text labels.
5. **Pair with neutral container.** Status badges sit on `--surface`, `--surface-2`, or a card fill — never on another saturated color.
6. **Light Mode contrast minimums.** `--success-dark #1f7a39` on `--surface #f8f4e8` = 6.4:1 (AA pass). `--warning #ff9500` on `--surface` is below AA for body text — use it for ≥14px 600 weight or icon-only contexts; for warning **text** on light bg, use `--ink` with a `--warning` left border or icon prefix.

### 2.6 Color Discipline Rules

1. **Allowed-Color List is closed.** Production CSS uses only the tokens in §§ 2.1-2.5. Photos and SVG visual effects exempt.
2. **Body / paragraph copy is always `--ink-3` warm gray.** Never colored.
3. **Headings = `--ink` or `--graphite` (mid-strong) or `--char` (display on dark surface).**
4. **Saturated editorial moments ≤1 per viewport.**
5. **GA Tri-Color is nav-only. Brand reds/blues/champagne are CTA-only.** Cross-bleed is forbidden.
6. **Adjacent panels alternate warm/cool tone.**
7. **Champagne ≤3 instances per viewport.**
8. **Pure black `--obsidian` is footer-interior only.** All other "black" UI uses `--ink` (or `--char` / `--graphite` for editorial dark cards).

---

## 3. Typography

### 3.1 Type Scale (Figma source of truth)

Vertical rhythm: every type size uses a line-height that lands on the 8px grid. Display sizes lock to `0.85 / 0.90 / 0.95` line-height; body locks to `1.40`. No arbitrary line-heights.

| Element | Font | Size | Weight | Line-Height | Letter-Spacing |
|---------|------|------|--------|-------------|---------------|
| **Header 1 / Magvix Hero** — landing only, 1 per page max | Magvix Regular | `clamp(64px, 9vw, 200px)` | 400 | `0.85` | `-0.02em` (-4px @ 200px) |
| **Magvix Italic / Header 4** — wordmark, italic hero | Magvix Italic | `80px` | 400 italic | `0.90` | `-0.025em` (-2px @ 80px) |
| **Magvix Italic Signature Divider** | Magvix Italic | `clamp(28px, 3vw, 40px)` | 400 italic | `1.15` | `-0.005em` |
| **Darky Giant Footer Wordmark** | Darky | `clamp(140px, 18vw, 320px)` | 800 | `0.85` | `-0.045em` |
| **Header 2 / Darky Display** — non-Magvix hero pages | Darky | `clamp(56px, 8vw, 128px)` | 900 | `0.85` | `-0.03em` (-4px @ 128px) |
| **Header 3 / Darky Large** — intermediate display | Darky | `110px` | 800 | `0.95` | `-0.036em` (-4px @ 110px) |
| H1 (page title) | Darky | `clamp(40px, 5vw, 72px)` | 800 | `1.0` | `-0.025em` |
| H2 (section title) | Darky | `40px` | 800 | `1.05` | `-0.02em` |
| H3 (sub-section / card title) | Darky | `28px` | 700 | `1.15` | `-0.015em` |
| **Header 5 / H4** (card body title) | Darky | `24px` | 700 | `1.40` | `-0.083em` (-2px @ 24px) |
| H5 (small block title) | Darky | `20px` | 600 | `1.3` | `-0.005em` |
| **Body / Paragraph 1 (default)** | CS Genio Mono | `20px` | 400 | `1.40` | `-0.1em` (-2px @ 20px) |
| Body small / Paragraph 2 | CS Genio Mono | `16px` | 400 | `1.40` | `-0.125em` (-2px @ 16px) |
| Small / Label | CS Genio Mono | `14px` | 500 | `1.45` | `0.01em` |
| **Caption** (documented min-floor exception) | CS Genio Mono | `10px` | 400 | `1.40` | `0.4em` (+4px @ 10px) UPPERCASE |
| **Eyebrow Canonical** (Product UI) | CS Genio Mono | `12px` | 700 | `1.3` | `0.12em` UPPERCASE |
| **Eyebrow Parenthetical** (Marketing) — `(LINKS)` `(WHY THIS EXISTS)` | CS Genio Mono | `12px` | 700 | `1.3` | `0.12em` UPPERCASE — parens literal |
| **Editorial Table Header** | CS Genio Mono | `12px` | 700 | `1.3` | `0.12em` UPPERCASE |
| **Editorial Table First Cell** | Darky | `18px` (mobile) / `20px` (desktop) | 700 | `1.4` | `-0.01em` |
| **Editorial Table Body Cell** | CS Genio Mono | `16px` | 400 | `1.40` | `-0.125em` |
| **Photo Card Title Overlay** (marketing only) | Darky | `20px` (desktop) / `18px` (mobile) | 700 | `1.25` | `-0.005em` color `--snow` |
| **Photo Card Metadata Overlay** | CS Genio Mono | `12px` | 500 | `1.3` | `0.04em` UPPERCASE color `rgba(255,255,255,0.85)` |
| Numbered Section marker | CS Genio Mono | `14px` | 600 | `1.3` | `0.04em` |
| Stat numeral (large KPI) | Darky | `clamp(40px, 5vw, 72px)` | 700 | `1.0` | `-0.02em` |
| Stat caption | CS Genio Mono | `14px` | 500 | `1.4` | `0.02em` |
| **Forbidden** | — | `< 10px` OR `> 200px` (Footer Wordmark exempt to 320px; Caption 10px is sole documented exception below 12px) | — | — | — |

> **Ink color note:** Figma source uses `#0f0e0e` (warmer near-black). CSS token `--ink` remains `#0a0a0a`; treat as equivalent for production — do not introduce `#0f0e0e` as a new token.

### 3.2 Vertical Rhythm Module

**Baseline = 8px.** All vertical spacing snaps to 8px increments. The closest size-to-rhythm anchors:

| Type | Used line-height in px | Rounds to grid (multiple of 8) |
|------|------------------------|-------------------------------|
| Body 20px × 1.40 | 28px | 32px (1 row) |
| Body small 16px × 1.40 | 22.4px | round to 24px |
| Small 14px × 1.45 | 20.3px | round to 24px |
| H4 24px × 1.40 | 33.6px | round to 32px |
| H3 28px × 1.15 | 32.2px | 32px |
| H2 40px × 1.05 | 42px | 48px |
| H1 desktop 72px × 1.0 | 72px | 72px (9 rows) |
| Header 3 110px × 0.95 | 104.5px | round to 104px (13 rows) |
| Display 128px × 0.85 | 108.8px | round to 112px (14 rows) |

Use `margin-bottom` in 8 / 16 / 24 / 32 / 48 / 64 / 80 / 96px steps to seat each block on the rhythm grid. Avoid arbitrary `margin-bottom: 22px`.

### 3.3 Font Faces

| Token | Family | Role |
|-------|--------|------|
| `var(--font-hero)` | Magvix (Regular + Italic) | Hero block, wordmark, signature divider, inline accent |
| `var(--font-display)` | Darky (100-900 weight) | All headings, numerals, **footer giant wordmark** |
| `var(--font-mono)` | CS Genio Mono | Body, UI, labels, captions, parenthetical eyebrow |

```css
@font-face {
  font-family: 'Magvix';
  src: url('/fonts/Magvix-Regular.ttf') format('truetype');
  font-weight: normal; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Magvix';
  src: url('/fonts/Magvix-Italic.ttf') format('truetype');
  font-weight: normal; font-style: italic; font-display: swap;
}
/* Darky 100-900 individual weight files + CS Genio Mono — declared in globals.css */
```

### 3.4 Typography Rules

1. **Type sizes are the scale above, period.** Never random Tailwind `text-*` mix. Build a custom Tailwind theme exposing only these tokens.
2. **Line-heights match the scale.** Display `0.85–0.95`; headings `1.0–1.3`; body + body small `1.40`. Never `1.5+` on display sizes, never `1.7` / `2.0` anywhere.
3. **One H1 per page. One H2 per panel.** H3/H4 only inside cards or table cells.
4. **Eyebrow always CS Genio Mono 12px 700 uppercase 0.12em.** Parenthetical variant on Marketing surfaces; canonical (no parens) on Product UI. The two registers do not mix in the same viewport.
5. **Magvix is hero-only OR signature-divider-only.** Below 28px Magvix becomes illegible. Allowed surfaces: solid color (Ink / Obsidian / Surface / Snow / Brand Red / Candy Panel / GA Orange Ticket / Editorial Blue). Never on gradient or photo.
6. **Magvix Italic = brand wordmark + signature divider + inline accent.** Magvix Regular = hero block headline. Hero block max 1 per page.
7. **Darky giant footer wordmark = 1 instance per page**, footer-only, ≤320px.
8. **Body paragraph = CS Genio Mono.** Never Darky body.
9. **Display tracking is negative** — Darky -0.025 to -0.045em, Magvix -0.02 to -0.025em. Body and small stay at 0.
10. **Hero title hugs panel top-left**, not centered. (See § 7.1 Corner-Anchored Title Rules.)

### 3.5 Magvix Inline Accent Pattern

A single Magvix Italic word may appear inside a Darky 900 hero headline as `<em>` at `font-size: 1.08em`. Max 1 accent word per headline. Max 1 such headline per panel. Max 3 panels using this pattern per page. Accent word must carry semantic weight.

```css
.mixed-headline em {
  font-family: var(--font-hero);
  font-style: italic;
  font-weight: normal;
  font-size: 1.08em;
  letter-spacing: -0.025em;
  vertical-align: baseline;
}
```

---

## 4. Shape & Radii

### 4.1 Radii Scale (iOS 26 continuous corner)

| Token | Value | Use |
|-------|-------|-----|
| `--r-xs` | `4px` | Toggles, micro-indicators |
| `--r-sm` | `8px` | **Buttons, badges, status pills, small chips** (locked — every button is 8px) |
| `--r-md` | `10px` | **Inputs, tooltips, standard cards, Ticket Panel container** |
| `--r-lg` | `12px` | Dropdown menus, **icon tiles** (40×40) |
| `--r-xl` | `16px` | Floating liquid-glass tiles, mid panels |
| `--r-2xl` | `20px` | Modals, drawers, sheets, photo containers, inner tiles in Candy Panels |
| `--r-3xl` | `28px` | **Standard Candy Panel** |
| `--r-4xl` | `40px` | **Footer rounded-top** + oversized hero panel |
| `--r-pill` | `50vh` | Pill buttons, **GA Tri-Color nav pills**, filter chips |
| `--r-full` | `50%` | Avatars, circular icon buttons, **Ticket Panel grommet circles** |

### 4.2 Selective `border-radius: 0`
`border-radius: 0` is permitted in exactly 3 editorial contexts:

1. **Full-bleed Photo Card Hero** — when a Photo Card spans the entire viewport width as the hero of a landing page (cinematic frame). Subordinate Photo Cards in a grid still use `--r-md` (10px).
2. **Editorial Hero Tile billboard** — single 1-per-page hero tile (the OFFTRAIL Pattern 05 move) carries `border-radius: 0` to read as a documentary print.
3. **Image-collage card inside a panel** — when 3-5 small images compose as a tactile collage (vintage media reference: VHS / cassette / telegram), each piece is `border-radius: 0` to read as a found object.

**All other surfaces** — standard cards, buttons, inputs, panels, modals, Candy Panels, Ticket Panel, Photo Card grids, footer — use the radii scale, never 0.

### 4.3 Element-to-Radius Mapping

| Element | Radius |
|---------|--------|
| **Footer panel (rounded-top)** | `--r-4xl` (40px) all corners + `overflow:hidden` parent clip |
| Oversized hero panel | `--r-4xl` (40px) |
| **Standard Candy Panel** | `--r-3xl` (28px) |
| Modal / drawer / sheet | `--r-2xl` (20px) |
| Floating liquid-glass tile | `--r-xl` (16px) |
| **Standard card** | `--r-md` (10px) |
| Image / photo container (in card) | `--r-md` (10px) |
| **Ticket Panel container** | `--r-md` (10px) — with grommets + dashed perforation, see § 8 |
| Pricing plan card | `--r-2xl` (20px) |
| **All buttons (filled / ghost / secondary)** | `--r-sm` (8px) — locked, no exceptions |
| Pill button + GA nav pill + filter chip | `--r-pill` (50vh) |
| **Input / textarea / select** | `--r-sm` (8px) |
| Badge / tier badge / small chip | `--r-sm` (8px) |
| Icon tile (40×40 / 48×48) | `--r-lg` (12px) |
| Avatar / icon circle / Ticket Panel grommet | `--r-full` (50%) |
| **Selective `border-radius: 0`** | Full-bleed Photo Card Hero / Editorial Hero Tile / Image-collage card |

### 4.4 Shape Discipline

- All containers use tokens above.
- Third-party components must override radii to match this scale (not 0, unless they are one of the 3 selective exceptions).
- Category-colored cards share radius with neutral cards — category color never changes radius.

---

## 5. Grid System 🔒 STRICT

### 5.1 The 8px Atomic Grid

Every dimension snaps to 8px increments. Allowed values: `8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 320, 384, 480, 640`. Half-grid (4px) allowed only for hairlines and small chip gaps.

```css
:root {
  --grid:        8px;
  --grid-half:   4px;

  /* Spacing scale (multiples of grid) */
  --space-1:   8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-5:  40px;
  --space-6:  48px;
  --space-7:  56px;
  --space-8:  64px;
  --space-9:  80px;
  --space-10: 96px;
  --space-11: 128px;
  --space-12: 160px;
  --space-13: 192px;
  --space-14: 240px;
  --space-15: 320px;
}
```

### 5.2 The 12-Column Layout Grid (desktop ≥1024px)

| Property | Value |
|----------|-------|
| Columns | 12 |
| Gutter | 24px |
| Outer page margin | 64px (left + right) |
| Container max-width | 1140px |
| Column width (calculated) | `(1140 - 11×24) / 12 = ~73px per column` |

Implementation:

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 64px;
}
```

### 5.3 The 8-Column Layout Grid (iPad 768-1023px)

| Property | Value |
|----------|-------|
| Columns | 8 |
| Gutter | 20px |
| Outer page margin | 48px |
| Container | `100% - 96px` |

### 5.4 The 4-Column Layout Grid (mobile <768px)

| Property | Value |
|----------|-------|
| Columns | 4 |
| Gutter | 16px |
| Outer page margin | 24px |
| Container | `100% - 48px` |

### 5.5 Cell-span vocabulary

A panel spans 12 / 8 / 4 columns (full bleed) on desktop / iPad / mobile respectively. A card may span 4-12 columns desktop; common spans:

| Pattern | Desktop span | iPad span | Mobile span |
|---------|--------------|-----------|-------------|
| Full-bleed panel | 12 | 8 | 4 |
| Two-up split | 6 + 6 | 4 + 4 | 4 + 4 (stacked) |
| Three-up grid | 4 + 4 + 4 | 4 + 4 (third wraps) | 4 (stacked) |
| Four-up grid | 3 + 3 + 3 + 3 | 4 + 4 + 4 + 4 (2 rows) | 4 (stacked) |
| Asymmetric (hero + sidebar) | 8 + 4 | 5 + 3 | 4 (stacked) |
| Sticky right rail (detail page) | 8 main + 4 rail | 8 main + 4 rail (sticky becomes inline at iPad) | 4 stacked |

### 5.6 Grid Discipline

1. **Every element snaps to 8px.** Width, height, padding, margin, gap, top, left, right, bottom — all 8px multiples.
2. **No arbitrary `padding: 22px`** or `margin: 35px`. Round to grid.
3. **Container max-width = 1140px desktop**, never wider on text content.
4. **Cell-span vocabulary above is exhaustive** — no custom 7+5 or 9+3 splits without documented reason.
5. **Adjacent panels respect the alternating warm/cool rule** plus snap their internal grids to the page grid (panels can offset internally using a sub-grid, but the panel boundary aligns to the 8px main grid).

---

## 6. Negative Space Tokens 🔒 STRICT — locked per container

Every container type has explicit text-to-edge / text-to-line / text-to-vector / text-to-text spacing. Eyeball spacing is forbidden.

### 6.1 Container Padding (text-to-edge)

The distance from a container's outer edge to its inner content (text or first child).

| Container | Desktop | iPad | Mobile |
|-----------|---------|------|--------|
| Page section vertical padding | 96px (top + bottom) | 80px | 56px |
| Page section horizontal padding | 64px (left + right, if not container-bound) | 48px | 24px |
| Container max-width | 1140px (mx-auto) | n/a (uses page padding) | n/a |
| Standard Candy Panel | 96px (all sides) | 64px | 48px |
| Ticket Panel | `64px 96px` (vertical / horizontal) | `48px 56px` | `32px 24px` |
| Modal / drawer | 48px | 40px | 32px |
| Standard card | 24px | 24px | 20px |
| Hero card (large) | 40px | 32px | 24px |
| Liquid-glass tile (in Candy Panel) | 32px | 24px | 20px |
| Footer panel | 96px (interior) | 80px | 56px |
| Editorial Table panel (with surrounding fill) | `48px 56px` | `40px 40px` | `32px 24px` |
| Photo Card text overlay (gradient bottom) | 24px (bottom + sides) | 20px | 16px |
| Nav bar interior | `16px 32px` (vertical / horizontal) | `12px 24px` | `12px 16px` |

### 6.2 Text-to-Text Spacing (block rhythm)

The vertical distance between successive text blocks.

| Block | After it | Desktop | iPad | Mobile |
|-------|----------|---------|------|--------|
| Eyebrow | → H1 / H2 | 16px | 16px | 16px |
| Hero title (Magvix or Darky Display) | → subtitle | 32px | 24px | 16px |
| Hero title | → CTA cluster | 48px | 40px | 32px |
| H1 | → body | 24px | 24px | 16px |
| H2 | → body | 24px | 24px | 16px |
| H3 | → body | 16px | 16px | 16px |
| H4 | → body | 16px | 16px | 16px |
| Body paragraph | → next body paragraph | 16px | 16px | 16px |
| Body | → CTA cluster | 32px | 24px | 24px |
| Stat numeral | → caption | 16px | 16px | 16px |
| Caption | → next caption | 8px | 8px | 8px |
| Section divider (Magvix Italic) | → next section panel | 64px above + 64px below | 48px each | 32px each |

### 6.3 Text-to-Line / Text-to-Hairline Spacing

| Position | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Text → 1px hairline below | 24px | 16px | 16px |
| Hairline → next text below | 24px | 16px | 16px |
| Editorial Table header → dotted divider | 24px | 16px | 16px |
| Editorial Table dotted divider → first row | 16px | 16px | 16px |
| Editorial Table row content | `20px 0` (vertical padding inside cell) | `16px 0` | `12px 0` |

### 6.4 Text-to-Vector / Text-to-Icon Spacing

| Pairing | Desktop | iPad | Mobile |
|---------|---------|------|--------|
| Icon (40×40 tile) → adjacent text label | 16px | 16px | 12px |
| Inline icon (24×24) → adjacent text | 12px | 12px | 8px |
| Eyebrow icon (12×12) → eyebrow text | 8px | 8px | 8px |
| CTA button text → trailing arrow icon | 8px | 8px | 8px |
| Avatar (40×40) → adjacent name text | 12px | 12px | 12px |
| Bullet → list item text | 16px | 16px | 12px |

### 6.5 Button-Cluster Spacing

| Position | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Adjacent buttons in a row (gap) | 16px | 16px | 12px |
| Button → secondary text link below it | 16px | 16px | 12px |
| Button group → next text block | 32px | 24px | 24px |

### 6.6 Card / Tile Spacing

| Position | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Card grid gap (between cards) | 24px | 20px | 16px |
| Card title → card body | 12px | 12px | 8px |
| Card body → card metadata footer | 16px | 16px | 12px |
| Photo Card (gradient overlay) title → metadata | 8px | 8px | 8px |

### 6.7 Negative Space Discipline

1. **Use the table values directly.** Never eyeball, never approximate.
2. **All values are 8px multiples.** Half-grid (4px) only allowed for hairlines.
3. **If a container is not listed**, default to `--space-3` (24px) padding desktop / `--space-2` (16px) mobile.
4. **Vertical rhythm is maintained** — text-to-text spacing always pairs with the type scale's line-height to land each subsequent block on the 8px grid.

---

## 7. Corner-Anchored Title Rules
Editorial composition treats the panel as a stage; the title hugs a corner rather than centering. SaaS billboard composition centers everything — Push is editorial, not SaaS-billboard.

### 7.1 Where titles anchor by container type

| Container | Title placement |
|-----------|-----------------|
| Hero panel (landing page entry) | **Bottom-left** of panel (the title sits 96px from the bottom, 64px from the left edge). Photo / image fills the upper area, title pressed-bottom is the GA "Grain Archive" wordmark composition. |
| Section panel (Adventure / Proof / Resources / Anchor) | **Top-left** of panel (eyebrow + title in upper-left corner; supporting content fills the rest) |
| Standard card | **Top-left** of card content area, after eyebrow |
| Footer panel | **Bottom-left** of footer (Darky Giant Wordmark pressed-bottom-left) |
| Ticket Panel | **Centered** (allowed exception — ticket reads as a stamped notice) |
| Editorial Table | **Top-left** of table panel, above the table |
| Photo Card with Bottom Gradient Overlay | **Bottom-left** of overlay (24px from bottom + left) |
| Modal / drawer | **Top-left** of dialog interior |
| Editorial Hero Tile billboard | Title placement defined by the chosen variant — anchor matches the surrounding composition (see § 8.10) |

### 7.2 Anchor offset spec

For a corner-anchored title, the offset from the corner equals the container's text-to-edge value. So a Hero panel with 96px desktop interior padding has its bottom-left title sitting 96px from the bottom and 64px from the left (when section padding is 64px). The title is NOT padded inward beyond the container's interior padding.

### 7.3 Centered title — only allowed inside

- Ticket Panel (Magvix Italic centered)
- Editorial Hero Tile billboard (a documented Pattern 05 variant)
- Modal dialog (when title is a single short prompt)

Everywhere else, default is corner-anchored. If a designer wants centered, they must justify it in the PR description.

### 7.4 Composition example — Landing Hero

```
┌─────────────────────────────────────────────┐
│                                             │   ← top of hero panel
│                                             │
│                                             │
│         [hero photo / illustration]         │
│                                             │
│                                             │
│                                             │
│  (NYC LOCAL)            ← eyebrow           │
│  Local performance                          │   ← Magvix Hero corner-anchored bottom-left
│  marketing.                                 │
│                                             │   ← 96px from bottom edge
└─────────────────────────────────────────────┘
       ↑ 64px from left edge
```

---

## 8. Component Specifications

### 8.1 GA Tri-Color Nav 🔒 STRICT — global chrome, every page

The pill structure (Home / Active / Last in GA Tri-Color) is invariant. The **container** has two interchangeable modes — pick one per project, then keep it consistent across every page in that project.

**Common to both modes (🔒 STRICT):**

| Element | Value |
|---------|-------|
| Monogram (left) | 32×32px circle, `background: var(--ink); color: var(--snow);` Magvix Italic 14px centered glyph (e.g. "P" or "•P•"). `border-radius: var(--r-full);` |
| Pill row (center) | `display: flex; gap: 8px;` |
| Each pill | `padding: 8px 18px; border-radius: var(--r-pill);` CS Genio Mono 14px 600 uppercase 0.04em |
| Home pill | `background: var(--ga-orange); color: var(--snow);` |
| Active page pill | `background: var(--ga-green); color: var(--ink);` |
| Last pill | `background: var(--ga-sky); color: var(--ink);` |
| Optional right CTA | Brand Red Filled Primary (§ 9.1) |
| Hover on pills | NO transform shift. `filter: brightness(1.08)` only — subtle LIGHTEN. Hover never darkens (§ 9.0). |
| Active/press on pills | `filter: brightness(0.92)` — DARKEN, the press-in moment. Still no transform. |
| Hover on right CTA | Bottom-right shift `translate(1px, 1px)` (Filled Primary spec). |
| Mobile (<768px) | Collapses to monogram + hamburger; full-screen overlay stacks the 3 pills vertically. |

**Mode A — Sticky bar 📐 STRUCTURED** (full-width chrome at top, the default for dashboards and product surfaces):

```css
.nav-sticky {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--hairline);
  padding: 16px 32px;
  display: flex; align-items: center; justify-content: space-between;
  max-width: 1140px; margin: 0 auto;
}
```

**Mode B — Floating Liquid-Glass capsule 📐 STRUCTURED** (centered floating pill, fades in on scroll, the marketing-page default):

```css
.nav-float {
  position: fixed; top: 16px; left: 50%;
  transform: translateX(-50%) translateY(-140%);
  opacity: 0; pointer-events: none;
  /* iOS 26 Liquid Glass — Light Variant from § 8.9.1 */
  background:
    radial-gradient(ellipse at 25% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%),
    radial-gradient(ellipse at 90% 100%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%),
    rgba(255,255,255,0.22);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 0.5px solid rgba(255,255,255,0.40);
  border-radius: 20px;        /* --r-2xl floating capsule, not pill */
  padding: 10px 16px;
  display: flex; align-items: center; gap: 16px;
  width: max-content;
  max-width: min(840px, calc(100vw - 32px));
  z-index: 1000;
  box-shadow:
    0 8px 24px rgba(10,10,10,0.08),
    0 2px 6px rgba(10,10,10,0.05),
    inset 0 1px 0 rgba(255,255,255,0.50),
    inset 0 -1px 0 rgba(10,10,10,0.05);
  transition:
    opacity 280ms ease,
    transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-float.is-visible { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }

/* Scroll script: add .is-visible once user scrolls past hero (≥80px). */

@media (max-width: 768px) {
  .nav-float { max-width: calc(100vw - 24px); top: 8px; border-radius: 16px; padding: 10px 12px; gap: 8px; }
}
@media (prefers-reduced-transparency: reduce) {
  .nav-float { background: rgba(255,255,255,0.95); backdrop-filter: none; -webkit-backdrop-filter: none; }
}
@media (prefers-reduced-motion: reduce) {
  .nav-float { transition: opacity 150ms ease; transform: translateX(-50%) translateY(0); }
  .nav-float:not(.is-visible) { opacity: 0; }
}
```

**Push-specific nav content (🎨 OPEN — pick labels per page):**

| Slot | Content | Notes |
|------|---------|-------|
| Monogram | "P" Magvix Italic, 32×32 Ink circle | Always present |
| Home pill | "HOME" — GA Orange | Always GA Orange |
| Page pill 2 | "CREATORS" — GA Green when on /creators, `--surface-3` otherwise | |
| Page pill 3 | "MERCHANTS" — GA Sky when on /merchants, `--surface-3` otherwise | |
| Page pill 4 (optional) | "PRICING" — `--surface-3` always (no dedicated GA color) | |
| Right CTA | "GET ACCESS" — Brand Red Filled Primary | Links to waitlist / sign-up |

### 8.2 Ticket Panel

Push signature container — orange perforated ticket with grommets + Magvix Italic headline + Ink CTA. Marketing only. Max 1 per page.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Container background | `var(--ga-orange)` | same | same |
| Container radius | `var(--r-md)` (10px) | same | same |
| Interior padding | `64px 96px` | `48px 56px` | `32px 24px` |
| Aspect ratio (recommended) | ~5:2 | ~4:3 | ~1:1 |
| Perforation top edge | `position: absolute; top: 14px; left: 24px; right: 24px; height: 0; border-top: 2px dashed rgba(10,10,10,0.55);` | same | same |
| Perforation bottom edge | mirror — `bottom: 14px;` | same | same |
| Grommets (×4) | 16px ink-solid circles, 24px inset from each corner | 16px, 20px inset | 12px, 16px inset |
| Headline | Magvix Italic `clamp(40px, 5vw, 56px)` color `--ink`, centered | same scale | scales down via clamp |
| Headline → subhead spacing | 16px | 16px | 12px |
| Subhead | CS Genio Mono 16px 400 color `--ink`, centered, max-width 480px, mx-auto | same | scales |
| Subhead → CTA spacing | 32px | 32px | 24px |
| CTA button | Filled Ink variant (see § 9.3) | same | same |
| Box shadow | none (flat) | same | same |
| Hover on CTA | bottom-right shift | same | same |
| Hover on grommets / perforation | none (decorative) | same | same |

### 8.3 Darky Giant Footer Wordmark

Footer = Editorial Blue rounded-top panel + 2 floating liquid-glass tiles peeking above + Darky 800 giant "PUSH" pressed-bottom-left.

| Element | Value |
|---------|-------|
| Footer panel | `background: var(--editorial-blue); color: var(--snow); border-radius: var(--r-4xl) (40px all corners); overflow: hidden;` Page wrapper has `overflow: hidden` clipping bottom 40px |
| Footer interior padding | 96px desktop / 80px iPad / 56px mobile |
| Floating glass tiles (Newsletter + Socials) | Peek above top edge by 40-60px. `position: absolute; top: -40px;` `background: rgba(255,255,255,0.12); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.18); border-radius: var(--r-xl);` (16px) |
| Footer content grid | 3-column desktop (LINKS / CONNECT / Copyright), 2-column iPad (LINKS-CONNECT row + Copyright row), 1-column mobile (stacked) |
| Column header | Parenthetical Eyebrow — `(LINKS)` `(CONNECT)` color `rgba(255,255,255,0.65)` |
| Column links | CS Genio Mono 16px 400 color `--snow` line-height 1.6, hover underline 4px offset |
| Copyright + tagline | CS Genio Mono 12px 500 color `rgba(255,255,255,0.65)` |
| **Giant Wordmark** | Darky `clamp(140px, 18vw, 320px)` weight 800 uppercase color `--snow` line-height 0.85 letter-spacing -0.045em |
| Wordmark position | **Bottom-left of footer**, full-bleed left-anchored, `margin-top: 96px` (creates breathing space between content grid and brand stamp) |
| Wordmark behavior | Static. No hover, no animation. |

### 8.4 Mono Eyebrow with Parenthetical

Marketing surfaces use `(LINKS)` `(CONNECT)` `(WHY THIS EXISTS)` form. Product UI surfaces use canonical `LINKS` `CONNECT` `BILLING` form. Two registers do not mix in the same viewport.

```css
.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-3);
  margin: 0 0 16px;
}
/* Parenthetical: parens are literal text characters in the markup */
```

| Surface | Variant | Color |
|---------|---------|-------|
| Marketing landing / About / Blog / Showcase | Parenthetical `(WHY THIS EXISTS)` | `--ink-3` on light surface, `rgba(255,255,255,0.65)` on dark |
| Footer column headers | Parenthetical `(LINKS)` `(CONNECT)` | `rgba(255,255,255,0.65)` |
| Dashboard / Settings / Forms / Onboarding | Canonical `LINKS` (no parens) | `--ink-3` |
| Editorial Table column headers | Canonical `FILM` `YEAR` `MOOD` `WHY WATCH` | `--ink-3` |

### 8.5 Magvix Italic Signature Divider

Between sections — a typographic breath. Replaces "leave whitespace gap".

| Property | Value |
|----------|-------|
| Element | Centered short phrase + middle-dot separators |
| Font | Magvix Italic `clamp(28px, 3vw, 40px)` weight normal line-height 1.15 letter-spacing -0.005em |
| Color | `--ink-3` warm gray (NOT full Ink) |
| Separator | Middle-dot `·` (U+00B7) wrapped in spaces |
| Padding | 64px above + 64px below (desktop), 48px each (iPad), 32px each (mobile) |
| Background | Inherits page surface |
| Max per page | 2 |
| Animation | None |
| Hover | None (not a link) |

**Push-specific phrasings** (use these, don't make up new ones unless they map to a real Push concept):

- `End of campaign · Fin ·`
- `Posted · Scanned · Verified ·`
- `Cut · Print · Wrap ·`
- `End of receipt · Fin ·`
- `Story · Scan · Pay ·`
- `Merchant · Creator · Customer ·`
- `Real · Local · Verified ·`

### 8.6 Editorial Table

Cinema-Selects style for Pricing / Compare / KPI / Stats on Marketing surfaces. Dashboard (Product UI) tables stay on the card-grid pattern.

| Element | Value |
|---------|-------|
| Title | Darky `clamp(40px, 5vw, 64px)` weight 800 color `--ink` margin-bottom 56px, **top-left of table panel** (not centered) |
| Container | `background: var(--surface-2); border-radius: var(--r-md);` `padding: 48px 56px` desktop / `40px 40px` iPad / `32px 24px` mobile. May also live unboxed on `--surface` Ivory. |
| Header row | CS Genio Mono 12px 700 uppercase 0.12em color `--ink-3` parenthetical form `(FILM)` |
| Header → divider spacing | 24px |
| Header divider | `border-bottom: 1px dotted rgba(10,10,10,0.30);` |
| First column cell | Darky 18px (mobile) / 20px (desktop) weight 700 color `--ink` |
| Other column cells | CS Genio Mono 16px 400 color `--ink-3` |
| Last column ("Why" / "Outcome") | Right-aligned |
| Row divider | `border-bottom: 1px dotted rgba(10,10,10,0.18);` lighter than header divider |
| Row vertical padding | 20px desktop / 16px mobile |
| Mobile (<768px) | Table collapses to vertical stack — each row becomes a card with header labels above values, dotted divider between cards. Last column drops right-alignment. |

### 8.7 Photo Card with Bottom Gradient Overlay

Marketing-only card pattern. Image fills card, bottom 35% black gradient, Darky title + mono metadata on overlay.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Container | `position: relative; overflow: hidden;` | same | same |
| Aspect ratio | `4 / 5` portrait OR `1 / 1` square | same | same |
| Border radius | `--r-md` (10px) — except full-bleed Photo Card Hero variant which uses `border-radius: 0` (see § 4.2) | same | same |
| Image | `object-fit: cover; width: 100%; height: 100%;` | same | same |
| Gradient overlay | `position: absolute; inset: auto 0 0 0; height: 35%; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.78) 100%);` | same | same |
| Text overlay padding | 24px from each edge (left + right + bottom) | 20px | 16px |
| Title | Darky 20px (desktop) / 18px (mobile) weight 700 color `--snow` | 20px | 18px |
| Title → metadata gap | 8px | 8px | 8px |
| Metadata | CS Genio Mono 12px 500 uppercase 0.04em color `rgba(255,255,255,0.85)` | same | same |
| Hover | bottom-right shift `translate(1px, 1px)` (subtle), NO image zoom, NO gradient lift | same | same |

### 8.8 Candy Panel

The Push workhorse panel — full-bleed bento cell with warm tonal saturation, Ink text on top, often hosting a floating liquid-glass tile or inner card grid. Snaps to the 8px grid + negative-space tokens, corner-anchors its title, and respects the Marketing / Product register split. Used heavily in Adventure / Proof / Resources panel slots and as the primary Dashboard card surface.

#### 8.8.1 Container Spec

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Background fill | One of `--panel-butter` / `--panel-peach` / `--panel-blush` / `--panel-sky` (see § 2.4) | same | same |
| Border radius | `--r-3xl` (28px) all corners | `--r-3xl` (28px) | `--r-2xl` (20px) on mobile only |
| Interior padding | 96px (all sides) | 64px | 48px |
| Span (column grid) | 12 cols full-bleed OR 6+6 split OR 8+4 hero+sidebar | 8 cols full / 4+4 split | 4 cols full (stacked) |
| Box shadow | `--shadow-1` (subtle lift) | same | none |
| Min-height (recommended) | `~480px` for Hero / Anchor variants, `~320px` for standard | `~400px` / `~280px` | natural content height |
| Tone alternation rule | Adjacent panel must be opposite warm/cool tone | same | same |

#### 8.8.2 Internal Vertical Rhythm (8px-grid locked)

Stack order from top to bottom (omit slots not used; spacing only applies between consecutive slots that ARE used):

```
[ Eyebrow ]                       ← (LINKS) parenthetical (Marketing) OR LINKS canonical (Product)
   ↓ 16px (locked, all breakpoints)
[ Title ]                         ← Darky 36-72px corner-anchored top-left
   ↓ 24px desktop / 24px iPad / 16px mobile
[ Body paragraph(s) ]             ← CS Genio Mono 18px line-height 1.55
   ↓ 32px desktop / 24px iPad / 24px mobile
[ CTA cluster ]                   ← 1-2 buttons from § 9 unified system, gap 16px / 12px mobile
   ↓ 56px desktop / 40px iPad / 32px mobile (only if inner-content slot follows)
[ Optional: Inner card grid OR image card OR liquid-glass tile ]
```

All values come directly from § 6 negative-space tokens. No eyeball spacing.

#### 8.8.3 Title Placement (corner-anchored)

| Panel role | Title placement | Justification |
|------------|-----------------|---------------|
| Hero panel (landing entry) | **Bottom-left** of panel — title sits 96px from bottom, 64px from left (desktop) | Editorial composition (GA Hero pattern). Photo / illustration fills upper area |
| Section panel (Adventure / Proof / Resources / Anchor) | **Top-left** of panel | Inside upper-left corner, eyebrow + title clustered. Supporting content (cards / tile / image) fills the rest of the panel |
| Product Dashboard card | **Top-left** of card content area, after eyebrow | Same as section panel — Product register uses identical anchor |
| Modal / drawer / sheet (when wrapped in Candy fill) | **Top-left** of dialog interior | Same |
| Centered title | **Forbidden inside Candy Panel.** Centered is reserved for Ticket Panel / Photo Card overlay / Modal short prompts only |

#### 8.8.4 Marketing vs Product Register on Candy Panel

| Element | Marketing surface | Product surface |
|---------|-------------------|-----------------|
| Eyebrow form | Parenthetical — `(WHY THIS EXISTS)` `(STEP 03)` | Canonical — `WHY THIS EXISTS` (no parens) |
| Title font (typical) | Darky H2 40px or H1 `clamp(40,5vw,72)px` | Darky H2 40px or H3 28px |
| Magvix Italic inline accent in title | Allowed (≤1 per panel, ≤3 panels per page) | **Forbidden** — Product UI keeps Darky-only |
| Body text color | `--ink-3` warm gray | `--ink-3` warm gray |
| CTA variants allowed | Filled Primary / Filled Secondary / Ghost | Filled Primary / Filled Secondary / Ghost / Pill |
| Image card variant | Photo Card with Bottom Gradient Overlay (see § 8.7) | Plain image tile in `--r-2xl` (20px) frame, no overlay |
| Liquid-glass tile inside | Allowed (see § 8.8.6) | Allowed (see § 8.8.6) |
| Magvix Italic Signature Divider INSIDE | Forbidden — divider sits BETWEEN panels, not inside | Same forbidden |

#### 8.8.5 Inner Card Grid Inside Candy Panel

Common pattern: Adventure router shows 3-4 cards inside a Candy Panel.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Inner card span | 4+4+4 (3-up) OR 3+3+3+3 (4-up) | 4+4 (2 per row) | 4 cols full (stacked) |
| Inner card radius | `--r-xl` (16px) — steps DOWN from panel's 28px | same | same |
| Inner card fill | `rgba(255,255,255,0.55)` semi-translucent OR `--surface-2` Pearl Stone OR matching panel-tint token | same | same |
| Inner card padding | 24px (all sides) | 24px | 20px |
| Grid gap between cards | 24px | 20px | 16px |
| Card title | Darky 24px H4 weight 700 color `--ink` | same | Darky 20px |
| Card body | CS Genio Mono 16px line-height 1.5 | same | same |
| Card hover | bottom-right shift (Push interaction signature) | same | same |

#### 8.8.6 Floating Liquid-Glass Tile Inside Candy Panel

Max 1 floating liquid-glass tile per Candy Panel.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Background | `rgba(255,255,255,0.55)` glass + `backdrop-filter: blur(12px)` | same | same |
| Border | `1px solid rgba(255,255,255,0.65)` | same | same |
| Border radius | `--r-xl` (16px) | same | same |
| Box shadow | `--shadow-glass` | same | same |
| Padding | 32px | 24px | 20px |
| Position (typical) | `position: absolute; top: 32px; right: 32px;` (peeks from upper-right corner of the panel) OR docked bottom-right | same | inline-flow on mobile, no float |
| Content | Stat numeral (Darky `clamp(40,5vw,72)px` weight 700) + caption (CS Genio Mono 14px 500) OR small badge / status | same | same |
| Numeral → caption gap | 16px | 16px | 16px |
| Hover | bottom-right shift | same | same |

#### 8.8.7 Image Card Inside Candy Panel

Photography on a Candy Panel sits inside its own framed tile — never bleeds to panel edge. The panel color is the framing device; the photograph is the subject.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Image container radius | `--r-2xl` (20px) | same | same |
| Image inset from panel interior padding | 32px (so image edge is 96+32=128px from panel outer edge) | 24px (88px total) | 16px (64px total) |
| Image aspect ratio | 4:5 OR 16:9 OR 3:2 (pick one per panel) | same | same |
| Object-fit | `cover` | same | same |
| Image hover | none (the image is not the click target — the surrounding card or button is) | same | same |
| Marketing variant: Photo Card with Bottom Gradient Overlay | Replaces plain image tile when title needs to overlay (see § 8.7) | same | same |

#### 8.8.8 What's Forbidden Inside a Candy Panel

These elements do NOT live inside a Candy Panel — they are page-level or chrome-level:

- **Ticket Panel** (page-level editorial moment, max 1 per page; lives as its own panel slot, not inside)
- **GA Tri-Color nav pills** (global chrome only)
- **Editorial Pink CTA stamp** (page-level moment ≤1; if a Candy Panel needs a strong CTA, use Filled Primary Brand Red or Filled Secondary N2W Blue)
- **Magvix Italic Signature Divider** (sits BETWEEN panels, never inside)
- **Darky Giant Footer Wordmark** (footer-only)
- **Editorial Hero Tile billboard** (own panel slot, not inside)
- **`border-radius: 0` content** (Candy Panel context demands the 28px rounded container — square content inside reads as a mistake)
- **Category colors as background fill of inner card** (categories are content-context only; inner cards use semi-translucent white or `--surface-2` Pearl Stone)
- **Magvix > 96px inside the panel** (Magvix Hero is page-level hero only; inside a Candy Panel, max Magvix size is the Section Title scale `clamp(40,5vw,72)px`)

#### 8.8.9 Adjacent-Panel Tone Alternation

The adjacent warm/cool alternation rule applies to every panel in a page stack:

| Panel | Tone | Pairs well next to |
|-------|------|--------------------|
| Candy Butter `#fff2d5` | Warm | Sky / Editorial Table on Pearl Stone / Anchor on Char/Ink |
| Candy Peach `#fdbc97` | Warm (saturated) | Sky / Editorial Table / Anchor / Photo Grid on Surface |
| Candy Blush `#f9ebe4` | Warm (soft) | Sky / Editorial Table / Anchor / Ticket Panel |
| Candy Sky `#c8e2ff` | Cool | Butter / Peach / Blush / Anchor on Char |
| Editorial Table on Surface-2 `#f5f3ee` | Neutral-warm | Butter / Peach / Sky / Anchor |
| Photo Grid on Surface `#f8f4e8` | Neutral-warm | Sky / Anchor / Ticket Panel |
| Ticket Panel `--ga-orange` | Warm (saturated) | Sky / Editorial Table / Surface |
| Anchor panel on `--char` or `--ink` | Dark | Butter / Peach / Blush / Sky / Surface |
| Footer `--editorial-blue` | Cool dark | Anything (it's the page exit) |

Two warm Candy Panels stacked = orange-tinted page. Two Sky Candy Panels stacked = cold page. Both forbidden.

#### 8.8.10 Implementation Reference

```css
.candy-panel {
  background: var(--panel-butter); /* OR --panel-peach / --panel-blush / --panel-sky */
  border-radius: var(--r-3xl); /* 28px */
  padding: 96px;
  box-shadow: var(--shadow-1);
  position: relative;
  /* Title placement is a layout concern handled by the inner grid, not the panel itself */
}

.candy-panel__inner {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  /* When Hero variant: title sits in bottom-left grid area; image fills upper area */
  /* When Section variant: eyebrow + title sit in top-left; content fills the rest */
}

.candy-panel__eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-3);
  margin: 0 0 16px;
  /* Marketing register: parenthetical form `(LINKS)` */
  /* Product register: canonical `LINKS` */
}

.candy-panel__title {
  font-family: var(--font-display); /* Darky */
  font-size: 40px; /* H2 default; H1 clamp(40,5vw,72) for Hero variant */
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0 0 24px;
  /* Hero variant: anchor bottom-left via grid placement, NOT centered */
  /* Section variant: anchor top-left via grid placement */
}

.candy-panel__body {
  font-family: var(--font-mono);
  font-size: 18px;
  line-height: 1.55;
  color: var(--ink-3);
  margin: 0 0 32px;
  max-width: 60ch;
}

.candy-panel__cta-cluster {
  display: flex;
  gap: 16px;
  /* Mobile: gap: 12px */
}

.candy-panel__glass-tile {
  position: absolute;
  top: 32px;
  right: 32px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: var(--r-xl); /* 16px */
  box-shadow: var(--shadow-glass);
  padding: 32px;
  /* contains stat numeral + caption */
}

@media (max-width: 1023px) {
  .candy-panel { padding: 64px; }
  .candy-panel__glass-tile { top: 24px; right: 24px; padding: 24px; }
}

@media (max-width: 767px) {
  .candy-panel {
    padding: 48px;
    border-radius: var(--r-2xl); /* 20px on mobile only */
  }
  .candy-panel__glass-tile {
    position: static; /* glass tile flows inline on mobile */
    margin-top: 32px;
    padding: 20px;
  }
  .candy-panel__title { font-size: clamp(32px, 8vw, 48px); }
  .candy-panel__cta-cluster { gap: 12px; flex-direction: column; align-items: stretch; }
}
```

### 8.9 Liquid Glass System 📐 STRUCTURED

Push's "floating glass" surface — semi-translucent white with backdrop blur — is one of the system's most recognizable signatures. **6 documented use cases.** Always pair the glass effect with the same shadow + radius + border tokens; pick the use case from the list below.

#### 8.9.1 Universal Liquid-Glass Token Set (🔒 STRICT — modeled on iOS 26 Liquid Glass)

Push's liquid glass replicates the iOS 26 Liquid Glass material on the web. The goals: **volumetric thickness** (the surface has a sense of glass-bezel depth, not flat translucency), **specular light effects** (a subtle highlight suggesting light hitting a curved glass surface from above-left), **restrained brightness** (almost-clear base tint, not milky frosted plastic), and **environmental color pickup** (heavy backdrop-blur + saturate pulls color from beneath without hiding it).

**Concept:** the tile feels like a real piece of curved glass set 1-2mm above the page. Light from above catches the top edge (specular highlight); the bottom edge picks up subtle shadow (depth); the body is mostly transparent with a hint of warm tint; everything underneath blurs and saturates as it would through a real glass.

Every liquid-glass surface across all 6 use cases uses these exact properties — never deviate:

```css
/* ───────────────────────────────────────────────────────────────
   iOS 26 Liquid Glass — Light Variant
   For surfaces over Ivory Cream / Pearl Stone / light photographs
   ─────────────────────────────────────────────────────────────── */
.lg-surface {
  background:
    /* Specular highlight — radial gradient from upper-left; reads as light hitting glass */
    radial-gradient(ellipse at 25% 0%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 55%),
    /* Counter-specular at bottom-right — subtle for fall-off */
    radial-gradient(ellipse at 90% 100%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 60%),
    /* Base glass tint — restrained at 0.22; heavier values read milky plastic, not glass */
    rgba(255, 255, 255, 0.22);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  backdrop-filter: blur(32px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.40);
  border-radius: var(--r-xl); /* 16px standard; pill variant uses --r-pill */
  box-shadow:
    /* Outer drop — tile floats 8px above surface */
    0 8px 24px rgba(10, 10, 10, 0.08),
    0 2px 6px rgba(10, 10, 10, 0.05),
    /* Inner top edge highlight — light from above hits the bezel */
    inset 0 1px 0 rgba(255, 255, 255, 0.50),
    /* Inner bottom edge shadow — gives the glass perceived thickness */
    inset 0 -1px 0 rgba(10, 10, 10, 0.05);
  color: var(--ink);
}

/* ───────────────────────────────────────────────────────────────
   iOS 26 Liquid Glass — Dark Variant
   For surfaces over photographs / Editorial Blue / Ink / Char
   The base tint warm-shifts toward the parent surface so it picks
   up environmental color (not a generic gray glass).
   ─────────────────────────────────────────────────────────────── */
.lg-surface--dark {
  background:
    radial-gradient(ellipse at 25% 0%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%),
    radial-gradient(ellipse at 90% 100%, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 60%),
    /* Base tint — warm dark, picks up Editorial Blue or photo. NOT generic gray. */
    rgba(40, 36, 32, 0.32);
  -webkit-backdrop-filter: blur(36px) saturate(160%);
  backdrop-filter: blur(36px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.20);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.22),
    0 4px 8px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 0 rgba(0, 0, 0, 0.18);
  color: var(--snow);
}

/* ───────────────────────────────────────────────────────────────
   Variant tuning per use case (rare — only when structurally needed)
   ─────────────────────────────────────────────────────────────── */

/* Footer Tile Pair — sits half above Editorial Blue, half above Ivory.
   Slightly heavier shadow because tile is more elevated above the seam. */
.lg-surface--footer-tile {
  /* inherits .lg-surface--dark, override base tint to pick up Editorial Blue */
  background:
    radial-gradient(ellipse at 25% 0%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0) 55%),
    radial-gradient(ellipse at 90% 100%, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0) 60%),
    rgba(30, 95, 173, 0.18); /* Editorial Blue at 0.18 — picks up the panel underneath */
}

/* Photo Card Floating Badge — smaller, lower-elevation glass over photo */
.lg-surface--badge {
  /* inherits .lg-surface--dark, smaller shadow */
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.20),
    0 1px 4px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 0 rgba(0, 0, 0, 0.18);
}

/* ───────────────────────────────────────────────────────────────
   Reduced-transparency / motion accessibility fallback
   ─────────────────────────────────────────────────────────────── */
@media (prefers-reduced-transparency: reduce) {
  .lg-surface,
  .lg-surface--dark {
    background: var(--surface-2);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  .lg-surface--dark {
    background: var(--char);
    color: var(--snow);
  }
}

/* Fallback for browsers without backdrop-filter support */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .lg-surface       { background: rgba(255, 255, 255, 0.85); }
  .lg-surface--dark { background: rgba(40, 36, 32, 0.85); }
}
```

**The 4 visual layers (from back to front), each with a job:**

| Layer | Property | Visual job |
|-------|----------|-----------|
| 1. Backdrop blur + saturate | `backdrop-filter: blur(32px) saturate(180%)` | Refracts the content beneath; pulls up color/contrast like real glass would |
| 2. Base tint | `rgba(255,255,255,0.22)` (light) or `rgba(40,36,32,0.32)` (dark) | Gives the glass *some* materiality without becoming milky/opaque |
| 3. Specular gradient (radial) | Top-left peak `rgba(255,255,255,0.55)` fading to transparent | The light effect — suggests a curved glass surface catching ambient light |
| 4. Bezel shadows (4 layers) | Outer drop + inner top highlight + inner bottom shadow | Volume — the glass has thickness; light comes from above |

**Anti-patterns (forbidden):**

- ❌ `background: rgba(255,255,255,0.55)` flat solid — reads as milky frosted plastic, not glass
- ❌ Single drop shadow only (no inset highlight/shadow) — flat, no perceived thickness
- ❌ `border: 1px solid` — too heavy; the bezel is visualized via inset shadow, not via border
- ❌ `backdrop-filter: blur(8px)` or less — too crisp; iOS 26 Liquid Glass uses heavy blur (28-36px)
- ❌ Saturate values below 140% — under-saturate makes the glass feel "cold and synthetic"; over 200% reads psychedelic
- ❌ Dark variant with cool gray base (`rgba(60,60,60,...)`) — generic; iOS 26 uses warm-shifted base that picks up environmental color
- ❌ Adding shadow tokens (`--shadow-1/2/3`) on top of the glass spec — the multi-layer shadow IS the glass shadow, do not double-shadow

#### 8.9.2 Use Case 1 — Footer Tile Pair (preserved from v10)

Two liquid-glass tiles peek above the rounded-top edge of the Editorial Blue footer panel — Newsletter (left) + Socials (right). See § 8.3 for footer integration.

| Property | Value |
|----------|-------|
| Position | `position: absolute; top: -40px;` |
| Width | 360px (Newsletter, left) / 280px (Socials, right) |
| Padding | 24px 32px |
| Mobile (<768px) | Stacks inline above footer, full container width, 24px gap between |
| Surface variant | `.lg-surface--dark` (Editorial Blue is dark) |

#### 8.9.3 Use Case 2 — Candy Panel Stat Tile

One liquid-glass stat tile per Candy Panel, anchored upper-right or lower-right corner. See § 8.8.6 for full integration.

| Property | Value |
|----------|-------|
| Position | `position: absolute; top: 32px; right: 32px;` (default upper-right) OR `bottom: 32px; right: 32px;` |
| Padding | 32px desktop / 24px iPad / 20px mobile |
| Content | Stat numeral (Darky `clamp(40,5vw,72)px` 700) + caption (CS Genio Mono 14px 500) |
| Mobile (<768px) | Drops out of `position: absolute`, flows inline below body, full-width |
| Surface variant | `.lg-surface` (Candy Panel fills are light) |

#### 8.9.4 Use Case 3 — Hero Photo Stat Peek
When a Hero panel uses a full-bleed photograph as its background and Magvix Italic title is bottom-left anchored, a liquid-glass tile peeks from the **opposite corner** (typically upper-right) carrying a single key stat or merchant name — adds depth without crowding the corner-anchored title.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Position | `position: absolute; top: 96px; right: 64px;` | `top: 80px; right: 48px;` | hidden (mobile drops the peek; the photo + title carry alone) |
| Width | 280-360px | 240-280px | n/a |
| Padding | 32px | 24px | n/a |
| Content allowed | (1) Single stat numeral + caption (`23 merchants` / `1.4M scans`) OR (2) Single quote + attribution OR (3) Single status badge ("Now serving Williamsburg") | same | n/a |
| Max per Hero panel | 1 (more competes with the bottom-left title) | same | 0 (mobile hides) |
| Surface variant | `.lg-surface` if photo is bright, `.lg-surface--dark` if photo is dark | same | n/a |
| Hover | Bottom-right shift `translate(1px, 1px)` only if interactive (e.g. links to merchant page) | same | n/a |

**Concept**: The peek tile is the editorial "second voice" on a Hero panel. The Magvix Italic title makes the page-level statement; the peek tile gives a single sharp data point that grounds it.

#### 8.9.5 Use Case 4 — Sticky Filter / Sort Rail
On Photo Grid pages (Archive, Showcase, Search), a horizontal liquid-glass pill rail sticks below the GA Tri-Color nav, carrying filter chips and sort controls — replaces a solid-background filter bar.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Position | `position: sticky; top: 80px;` (sits 16px below the GA nav) | `top: 76px;` | `top: 72px;` |
| Width | Container max 1140px, mx-auto | container 100%-96px | container 100%-48px |
| Padding | 16px 24px | 16px 20px | 12px 16px |
| Border radius | `--r-pill` (50vh) — pill shape, not rectangle | same | same |
| Content | Filter chips (use Pill button variant `.btn-pill` from § 9.5) + optional Sort dropdown right-aligned | same | overflow-x: scroll if too many chips |
| Z-index | 95 (just below GA nav's 100) | same | same |
| Hover on chips | bottom-right shift (chip behavior) | same | same |
| Surface variant | `.lg-surface` (light page bg) | same | same |

**Concept**: The filter rail floats — it doesn't pin to surface, doesn't have full-width chrome. The Photo Grid behind it remains visually primary.

#### 8.9.6 Use Case 5 — Photo Card Floating Badge
A small liquid-glass badge anchored to a Photo Card (with Bottom Gradient Overlay) carrying tier / category / status / date. Adds metadata without competing with the card's own title overlay.

| Property | Value |
|----------|-------|
| Position | `position: absolute; top: 16px; right: 16px;` (within Photo Card frame) |
| Padding | 8px 14px |
| Border radius | `--r-pill` (50vh) — pill shape |
| Font | CS Genio Mono 12px 600 uppercase 0.04em |
| Content | Single token — tier name (`Bronze`) OR status (`Sold out`) OR date stamp (`Aug 21`) OR category (`Film`). Max 1 token. |
| Mobile (<768px) | Same — stays inside card frame top-right |
| Surface variant | `.lg-surface--dark` (Photo Card image is photographic, behaves as dark surface — text reads white) |
| Hover | none (badge is decorative, not separately clickable; the entire Photo Card is the click target) |

**Concept**: The badge is editorial garnish. It tells you ONE thing about the card — never two. If you need two pieces of metadata, put both in the bottom-overlay metadata strip and skip the floating badge.

#### 8.9.7 Use Case 6 — Scroll Progress Pill / Anchored Action Pop
For long-form Marketing pages (article, case study, About): a small liquid-glass pill anchored bottom-right of the viewport that either ① shows scroll progress as a percentage OR ② carries a sticky CTA ("Subscribe" / "Apply now") that pops into view after the user scrolls past the hero.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Position | `position: fixed; bottom: 32px; right: 32px;` | `bottom: 24px; right: 24px;` | `bottom: 16px; right: 16px;` |
| Width | auto (content-sized) | same | same |
| Min-width | 120px | 120px | 100px |
| Padding | 12px 20px | 12px 18px | 10px 16px |
| Border radius | `--r-pill` (50vh) | same | same |
| Font | CS Genio Mono 14px 600 uppercase 0.04em | same | 12px |
| Content | EITHER scroll progress (`23% read`) OR sticky CTA (`Subscribe` / `Apply now`) — choose ONE, not both | same | same |
| Z-index | 90 | same | same |
| Show / hide | Hidden until user scrolls past hero (offset 600px); fades in over 240ms | same | same |
| Surface variant | `.lg-surface` (default light), `.lg-surface--dark` if page bg below hero is dark | same | same |
| Hover | bottom-right shift if it's a CTA; none if scroll progress | same | same |
| Max per page | 1 (scroll progress OR CTA, not both) | same | same |

**Concept**: This is the page's "ambient companion." It hovers in peripheral vision, gives one piece of meta-info or one persistent action, and never demands attention.

#### 8.9.8 Liquid Glass Discipline (🔒 STRICT)

1. **The 6 use cases above are exhaustive.** New use cases require Design.md update.
2. **All 6 use the same `.lg-surface` token set** — never invent a new transparent value, blur radius, or border.
3. **Maximum 3 ANCHORED CHROME liquid-glass surfaces visible per viewport.** Anchored chrome = Footer Tile Pair (2) / Hero Photo Stat Peek / Sticky Filter Rail / Scroll Progress Pill. Per-card decorative Floating Badges (Use Case 5, § 8.9.6) are part of their parent card and are NOT counted toward the 3-cap — a 4-up Photo Card row may carry 4 badges, that's fine. Candy Panel Stat Tiles (§ 8.9.3) are part of their parent panel and also NOT counted toward the 3-cap.
4. **Liquid-glass surface always pairs with `--shadow-glass`**, never `--shadow-1/2/3` (those are for solid surfaces).
5. **`backdrop-filter: blur(12px)` is non-negotiable.** If the browser doesn't support backdrop-filter, fall back to `background: rgba(255,255,255,0.85)` solid (more opaque to compensate for missing blur).
6. **Liquid-glass on a photographic background uses the `--dark` variant.** Don't put light-surface glass over a dark photo — it reads dirty.
7. **Hover behavior depends on whether the surface is interactive.** Static glass (footer tile, photo card badge) does NOT shift; interactive glass (sticky CTA pop, filter chip) DOES shift.
8. **Liquid-glass surfaces do not nest.** A liquid-glass tile cannot contain another liquid-glass tile.
9. **Liquid-glass is forbidden inside Ticket Panel, GA Tri-Color nav, Editorial Hero Tile billboard.** These are flat by design.

#### 8.9.9 Where to Use Each Variant — Decision Map

| Page type | Recommended liquid-glass usage |
|-----------|--------------------------------|
| Landing / Home | Footer pair (2) + Hero Photo Peek (1) = 3 max. Optional Scroll Progress Pill if page is long. |
| Archive / Photo Grid | Footer pair (2) + Sticky Filter Rail (1) + per-card Floating Badges (multiple but only 1 per card) |
| Showcase (Creator / Merchant) | Footer pair (2) + Hero Peek (1) + per-card Floating Badge for tier (multiple but 1/card) |
| About | Footer pair (2). Optional Hero Peek if About has a hero photo. |
| Article (long-form) | Footer pair (2) + Scroll Progress Pill OR Sticky CTA (1) |
| Pricing | Footer pair (2) + ONE Candy Panel Stat Tile per pricing tier card |
| Dashboard | Footer pair (2) + per-Candy-Panel Stat Tile (1 per panel) |
| Settings / Forms | Footer pair (2) only |
| Modal / Drawer (transient) | None (modals are themselves elevated surfaces; double-elevation reads cluttered) |

### 8.10 Image-First Layout Patterns (📐 STRUCTURED)

GA's pages are image-led — a Push Marketing surface should match that density. 4 image patterns are documented below; pick ONE per panel based on the panel's role.

#### 8.10.1 Pattern A — Full-Bleed Hero Photograph

Single photograph spans the entire hero panel; Magvix Italic title is bottom-left anchored on top. Optional liquid-glass Hero Peek (§ 8.9.4) sits upper-right.

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Container | Full viewport width, height `clamp(560px, 80vh, 880px)` | `clamp(480px, 70vh, 720px)` | `clamp(400px, 60vh, 560px)` |
| Border radius | **`border-radius: 0`** (one of the 3 documented exceptions in § 4.2) for cinematic frame | OR `--r-2xl` (20px) if rounded variant chosen | `--r-md` (10px) on mobile if rounded variant |
| Image | `object-fit: cover; object-position: center;` | same | same |
| Image overlay tint | `background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%);` over the photo (helps title legibility) | same | same |
| Title (Magvix or Darky Display) | Bottom-left, 96px from bottom, 64px from left, color `--snow` | 80/48 | 56/24 |
| Eyebrow above title | `(SECTION 01)` or `(NYC LOCAL)` parenthetical, 16px above title | same | same |
| Liquid-glass Hero Peek | Upper-right (see § 8.9.4) | same | hidden mobile |
| Variant: Sub-hero | Same pattern but `clamp(360px, 50vh, 480px)` height | same | scales |

**When to use**: Page entry, single dominant message, 1 photograph carries the page. **Forbidden inside other panels** — this is hero-only.

#### 8.10.2 Pattern B — Photo Card with Bottom Gradient Overlay (existing § 8.7, expanded usage)

Card grid where each card's photograph fills it, gradient overlay carries title + metadata. See § 8.7 for full spec.

**Grid layouts allowed:**

| Layout | Desktop span | iPad span | Mobile span |
|--------|--------------|-----------|-------------|
| 2-up | 6 + 6 | 4 + 4 | 4 (stacked) |
| 3-up | 4 + 4 + 4 | 4 + 4 (third wraps) | 4 (stacked) |
| 4-up | 3 + 3 + 3 + 3 | 4 + 4 + 4 + 4 (2 rows) | 4 (stacked) |
| Asymmetric (1 hero + 2 small) | 8 + 4 (4 split into 2 stacked) | 8 + 4 same | 4 (stacked) |

**When to use**: Archive index, Creator showcase, Merchant case study grid, Campaign archive. Each card's image IS the entry point.

#### 8.10.3 Pattern C — Framed Photo Tile Inside Candy Panel

Photograph sits inside its own `--r-2xl` (20px) frame, inset 32px from the Candy Panel interior padding (so the panel color is the framing device, never the photo). Caption sits as a separate text block beside or below the tile, NOT overlaid. See § 8.8.7 for integration spec.

**When to use**: Proof / Resources panels where the photograph supports a longer text block (testimonial + photo, case study + photo). The text is primary; photo is supportive evidence.

#### 8.10.4 Pattern D — Decorative Photo Collage (GA About-page reference)

Multiple small photographs (3-7) scattered horizontally near the top of an Anchor / About / Story panel, each `border-radius: 0` (one of the 3 documented exceptions in § 4.2), positioned with deliberate negative space between them. Reads as "found objects on a tabletop" — vintage media reference (record / VHS / cassette / telegram / book).

| Property | Desktop | iPad | Mobile |
|----------|---------|------|--------|
| Container | Full panel width, height `auto` | same | same |
| Number of pieces | 4-7 | 3-5 | 2-3 (the rest hide on mobile) |
| Each piece dimensions | width 80-200px, height 80-180px (varied for organic feel) | scales 70% | scales 50% |
| Border radius | **`border-radius: 0`** (3rd documented exception in § 4.2) | same | same |
| Position | `position: absolute;` with hand-placed `top` / `left` per piece, slight rotation `transform: rotate(-3deg)` to `rotate(4deg)` for organic scatter | same | tighter spacing on iPad/mobile |
| Box shadow | `--shadow-1` (subtle lift to suggest physical objects on a surface) | same | same |
| Min spacing between pieces | 32px desktop / 24px iPad / 16px mobile | same | same |
| Responsive | Pieces rearrange but never overlap; smallest 2-3 hide first on mobile | same | hides smallest |

**When to use**: About page top, story / archive intro, "what we collected this season" type editorial panels. Should appear ≤1 per page.

**Concept**: The collage gives the page a tactile, hand-curated feel — a counterweight to the otherwise grid-locked geometry. It's the editorial system's equivalent of a maker's mark.

#### 8.10.5 Pattern Selection Decision Map

| Panel role | Pattern |
|------------|---------|
| Page hero (entry point) | Pattern A — Full-Bleed Hero Photograph |
| Archive / Showcase / Browse / Search results | Pattern B — Photo Card with Bottom Gradient Overlay grid |
| Proof / Testimonial / Case Study (text-led) | Pattern C — Framed Photo Tile Inside Candy Panel |
| About / Story intro / "What we collected" editorial | Pattern D — Decorative Photo Collage |
| Anchor panel with single hero stat + photo | Pattern A (sub-hero variant) OR Pattern C |
| Inside Ticket Panel | NONE — Ticket Panel is solid GA Orange, no photo content |
| Inside Editorial Table | NONE — table is text-and-numbers |

#### 8.10.6 Image Discipline (🔒 STRICT)

1. **Every image uses one of the 4 patterns above.** Don't invent a new image treatment per page.
2. **`border-radius: 0` for images is allowed only in Pattern A (full-bleed hero) and Pattern D (decorative collage).** All other image surfaces use `--r-md` (10px) or `--r-2xl` (20px) per the radii scale.
3. **Photo content is exempt from the Allowed-Color List** (§ 2.7) — photographic images can carry any color. But CSS-applied colors (overlays, gradients, borders) must come from the token list.
4. **Maximum 1 Pattern A or Pattern D per page.** Pattern B and Pattern C can repeat freely within their grid / panel context.

### 8.11 Custom Scrollbar System (🔒 STRICT)

System default scrollbars (Chromium gray slabs / native macOS overlay) clash with Push's editorial register. Every page replaces them with a refined warm-neutral scrollbar that matches the 11-stop ladder + the bottom-right hover-shift interaction signature.

#### 8.11.1 Concept

The scrollbar is **almost invisible at rest** — `--mist` (`#d8d4c8`) thumb on a transparent track reads as part of the page texture, not chrome. On hover, the thumb darkens to `--ink-4` confirming "this is grabbable." On active drag, it darkens to `--ink-3` (the same warm body-text gray) — the press-feedback hierarchy from § 9.0 applies here too: hover never darkens beyond `--ink-4`; only active drag goes to `--ink-3`.

**Width = 8px (snaps to grid).** Pill-radius (`--r-pill`) thumb. No track styling visible. Dark variant (for modal content over Editorial Blue / Ink / Char) uses translucent white.

#### 8.11.2 Universal Scrollbar Token Set

```css
/* ───────────────────────────────────────────────────────────────
   Push Custom Scrollbar — Light Variant (default, all surfaces)
   Refined warm-neutral; barely visible at rest; matches button hover hierarchy.
   ─────────────────────────────────────────────────────────────── */

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--mist) transparent;
}

/* Chromium / WebKit */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--mist); /* #d8d4c8 — warm pale rest state */
  border-radius: var(--r-pill);
  /* 1.5px transparent border on each side via background-clip:
     keeps the visible thumb 5px slim while the hit area stays a generous 8px. */
  border: 1.5px solid transparent;
  background-clip: padding-box;
  transition: background 180ms ease;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--ink-4); /* #6a6a6a — confirmed grabbable */
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:active {
  background: var(--ink-3); /* #61605c — press feedback (same as body text gray) */
  background-clip: padding-box;
}
::-webkit-scrollbar-corner {
  background: transparent;
}

/* ───────────────────────────────────────────────────────────────
   Dark Variant — for modal content / scrollable panels over
   Editorial Blue / Ink / Char / dark photo
   Apply by adding .scrollbar--dark to the scrolling container.
   ─────────────────────────────────────────────────────────────── */
.scrollbar--dark {
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}
.scrollbar--dark::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  background-clip: padding-box;
}
.scrollbar--dark::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.45);
  background-clip: padding-box;
}
.scrollbar--dark::-webkit-scrollbar-thumb:active {
  background: rgba(255, 255, 255, 0.60);
  background-clip: padding-box;
}

/* ───────────────────────────────────────────────────────────────
   Horizontal-Only Variant — for inline horizontal scroll surfaces
   (e.g. the Sticky Filter Rail, sideways photo strip, code block)
   Slimmer (6px) since horizontal scrollbars feel intrusive when wide.
   Apply by adding .scrollbar--horizontal to the container.
   ─────────────────────────────────────────────────────────────── */
.scrollbar--horizontal {
  overflow-x: auto;
  overflow-y: hidden;
}
.scrollbar--horizontal::-webkit-scrollbar {
  height: 6px;
}

/* ───────────────────────────────────────────────────────────────
   Hidden-Scrollbar Variant — for surfaces where scrollbar would
   conflict (e.g. Photo Card with Bottom Gradient Overlay, Ticket
   Panel interior). Content still scrolls; scrollbar visually hides.
   Apply by adding .scrollbar--hidden.
   ─────────────────────────────────────────────────────────────── */
.scrollbar--hidden {
  scrollbar-width: none; /* Firefox */
}
.scrollbar--hidden::-webkit-scrollbar {
  display: none; /* Chromium / WebKit */
}

/* ───────────────────────────────────────────────────────────────
   Reduced-motion accessibility
   ─────────────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  ::-webkit-scrollbar-thumb {
    transition: none;
  }
}
```

#### 8.11.3 Where Each Variant Applies

| Surface | Scrollbar variant |
|---------|-------------------|
| Page-level vertical scroll (default `<html>` / `<body>`) | Light variant (default) |
| Modal / drawer scrolling content (light surface) | Light variant |
| Modal / drawer over Editorial Blue / Ink / Char | `.scrollbar--dark` |
| Sticky Filter Rail (horizontal pill row that overflows) | `.scrollbar--horizontal` (6px height) |
| Sideways photo card strip (Showcase carousel) | `.scrollbar--horizontal` |
| Photo Card with Bottom Gradient Overlay (image surface, never scrolls anyway) | `.scrollbar--hidden` |
| Editorial Table (when overflowing on narrow viewports) | Light variant horizontal |
| Code blocks (long monospace lines) | `.scrollbar--horizontal` |
| Liquid Glass tile interior (Stat Tile / Hero Peek / Footer Tile — short content, rarely scrolls) | `.scrollbar--hidden` (the glass effect breaks if a chrome scrollbar appears inside) |

#### 8.11.4 Scrollbar Discipline (🔒 STRICT)

1. **Never use system-default scrollbars.** Every Push page imports the Universal Scrollbar Token Set (§ 8.11.2) into `globals.css` at boot.
2. **Width is always 8px** (vertical) **or 6px** (horizontal `.scrollbar--horizontal`). Never wider — wide scrollbars compete with content for attention.
3. **Track is always transparent.** No track fill, no track border. The thumb floats over the page color.
4. **Thumb radius is always `--r-pill`.** Never square corners.
5. **Color comes from the 11-stop ladder + white-alpha for dark variant.** No new scrollbar colors.
6. **Hover state DARKENS thumb (mist → ink-4); active state DARKENS further (ink-4 → ink-3).** This is the one place the "hover never darkens" rule (§ 9.0) flips — because the scrollbar isn't a button, it's an indicator. Going from invisible-at-rest to visible-on-hover IS the lightening; the color "darkening" is simply going from invisible-warm-pale to visible-darker-warm.
7. **Cross-browser**: `scrollbar-width` + `scrollbar-color` for Firefox; `::-webkit-scrollbar-*` pseudo-elements for Chromium/Safari/Edge. Both must be present.
8. **macOS native overlay scrollbars** (the ones that auto-hide when not scrolling) are overridden by `::-webkit-scrollbar` styling. This is intentional — Push's scrollbar is a deliberate brand element, not a system afterthought.
9. **No scrollbar inside Liquid Glass tiles** — use `.scrollbar--hidden`. A chrome scrollbar appearing inside a glass tile breaks the iOS 26 glass illusion (real glass doesn't have a scrollbar engraved in it).
10. **Mobile (<768px)**: Most mobile browsers don't render explicit scrollbars (touch-scroll). The CSS still applies for the rare mobile browser that does (Firefox Mobile). No special mobile spec needed.

---

### 8.12 Unified Sidebar — Narrow Rail Nav 🔒 STRICT — Product UI register

> **Source of truth**: `components/shell/UnifiedSidebar.tsx` + `unified-sidebar.css`. One component, three role configs (creator / merchant / admin), rendered at every authenticated layout shell — `app/(creator)/creator/(workspace)/layout.tsx`, `app/(merchant)/layout.tsx`, `app/(admin)/admin/layout.tsx`.
>
> Product UI register: no parenthetical eyebrows, no Magvix Italic body, no Ticket Panel, no GA Orange. The Marketing-register Floating Liquid-Glass capsule (§ 8.1 Mode B) is for marketing surfaces only — never on a workspace shell.

#### 8.12.1 Sidebar Anatomy

```
┌──────────┐
│    P     │  ← logo strip 48px (Darky 26px 900 italic, no caption)
│          │     12px gap below
├──────────┤
│   ⌂      │
│  TODAY   │  ← active pill — white gradient + red 4px dot below caption
│          │     border 0.5px ink, multi-layer inset+outer shadow
├──────────┤
│   ⌫      │
│  GIGS    │  ← idle row — icon at 0.78 opacity, transparent bg
├──────────┤
│   ✦      │
│  FIND    │
├──────────┤
│   ↗      │
│  PAY     │
├──────────┤
│   ▭      │
│  STATS   │
├──────────┤
│   ✉      │
│  INBOX   │
├──────────┤
│   ▽      │
│  RANKS   │
│          │
│   ⋯      │  ← .us-foot — 0.5px hairline divider above (margin 8px 12px)
│          │
├──────────┤
│   🔔     │
│  ALERTS  │  ← bell with red badge dot when unread
├──────────┤
│   ⚙      │
│ SETTINGS │
├──────────┤
│   (A)    │  ← 28px avatar circle, gradient ink fill + initial
│   ME     │
└──────────┘
   96px
```

#### 8.12.2 Token Set 🔒 STRICT (CSS custom properties — match exactly)

Set these on the `.unified-sidebar` root; every other rule reads from them:

| Token | Value | Role |
|-------|-------|------|
| `--us-w` | `96px` | Rail width (desktop). Mobile collapses to 56px bottom dock. |
| `--us-pad-x` | `12px` | Outer rail padding (left, right, top, bottom) |
| `--us-item-inset` | `10px` | Pill horizontal inset from rail edges |
| `--us-item-gap` | `6px` | Vertical gap between adjacent pills |
| `--us-tile` | `40px` | Icon tile (square) |
| `--us-icon` | `22px` | Icon glyph size inside tile |
| `--us-cap-size` | `11px` | Caption font-size (CS Genio Mono) |
| `--us-radius` | `14px` | Pill border-radius |
| `--us-trans` | `260ms cubic-bezier(0.4, 0, 0.2, 1)` | Background / shadow / border transition |

#### 8.12.3 Property Table

| Property | Value |
|----------|-------|
| Width | `--us-w` (`96px` desktop) |
| Position | `fixed; left: 0; top: 0; height: 100vh; z-index: 200;` |
| Background | Page surface inherits — the rail sits over `--snow #ffffff`. **Not Liquid Glass** (the rail is opaque chrome, not floating glass). |
| Right edge | `0.5px solid rgba(40,36,32,0.06)` hairline (warm-ink low alpha) |
| Padding | `12px` all sides |
| Layout | `display: flex; flex-direction: column;` |
| `.us-nav` (top group) | `flex: 1` (expands), `padding-top: 8px`, `gap: 6px`, `overflow-y: auto`, scrollbar hidden |
| `.us-foot` (bottom group) | `padding-top: 12px`, `margin-top: 8px`, `gap: 6px` |
| `.us-foot ::before` (divider) | `0.5px solid rgba(40,36,32,0.10)`, margin `8px 12px` (separates top group from foot) |
| Logo strip | 48px height, Darky 26px 900 italic "P", color `var(--ink)`, no caption, no hover bg, no active dot. `margin-bottom: 12px;` |
| **Pill (item)** — idle | `width: calc(100% - 20px)` (= rail − 2×inset), `min-height: 56px` (icon + caption + padding), `border-radius: 14px`, transparent fill, no border, no shadow. Caption visible below icon. |
| **Pill — hover** (non-active) | Background `linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,244,232,0.55) 100%)` + `backdrop-filter: blur(20px)`. Icon opacity → 1.0. Caption color → `--ink`. No transform shift (the rail is chrome, follows § 8.1 nav rule). |
| **Pill — active** | Background `linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,244,232,0.78) 50%, rgba(245,243,238,0.72) 100%)` + `border: 0.5px solid rgba(40,36,32,0.10)` + multi-layer shadow (inset top + inset bottom + 1px outer tight + 4–12px outer diffused). Icon opacity 1.0. Caption color `--ink`, weight stays 600. |
| **Active red dot** | 4×4 circle, `bottom: -3px; left: 50%; transform: translateX(-50%); background: var(--brand-red) #c1121f; box-shadow: 0 0 0 1.5px var(--snow);` (snow ring isolates the dot from the pill edge) |
| Pill internal layout | `display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 6px;` |
| Icon tile | 40×40 (`--us-tile`), centered. Icon glyph 22px (`--us-icon`), color matches caption. Default opacity 0.78 → hover/active 1.0. |
| Caption | CS Genio Mono `--us-cap-size` (11px) 600 uppercase 0.02em. `max-width: 68px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` |
| Caption color | Idle `--ink-4` `#6a6a6a` · Hover/Active `--ink` `#0a0a0a` |
| Transition | `background var(--us-trans), border-color var(--us-trans), box-shadow var(--us-trans), color 180ms ease, opacity 180ms ease` |
| Bell badge (Alerts) | Same pill structure; small red `--brand-red` 6×6 dot at top-right of icon tile (top: -2px; right: -2px; box-shadow ring) when `data-unread="true"` |
| Avatar pill (Me) | 28px circle, background `linear-gradient(135deg, rgba(40,36,32,0.18), rgba(40,36,32,0.06))` + `border: 0.5px solid rgba(40,36,32,0.20)` + inset highlight. Initial: Darky 12px 800 `#1c1814`. If photo: `<img object-fit: cover>` clips to circle. Caption "ME" below. Hover deepens border + bg gradient. |

#### 8.12.4 Role Configs 🔒 STRICT — order is invariant

The component takes a `role` prop and renders one of three nav configs. Items map to routes; order does not change.

| Role | Top group (.us-nav) | Bottom group (.us-foot) |
|------|---------------------|-------------------------|
| **creator** | Today · Gigs · Find · Pay · Stats · Inbox · Ranks | Alerts · Settings · Me |
| **merchant** | Today · Campaigns · Creators · Pay · Stats · Inbox · QR | Alerts · Settings · Me |
| **admin** | Today · Operations · Disputes · Pay · Stats · Audit · Health | Alerts · Settings · Me |

> Adding a new top-level page = adding an item to one of these arrays in `UnifiedSidebar.tsx`. New items must carry an icon at the same 22px size. Inserting between groups requires updating this table.

#### 8.12.5 Mobile (≤768px) — Bottom Dock

The vertical rail collapses to a horizontal bottom dock at mobile width. Same component, breakpoint-driven layout swap.

| Property | Value |
|----------|-------|
| Position | `fixed; bottom: 0; left: 0; right: 0; top: auto;` |
| Height | 56px |
| Layout | `flex-direction: row; gap: 0;` items distributed `space-around` |
| Item | Same icon (22px) + caption (9px Mono uppercase 0.02em — shrunk from 11px). No pill widening on active; active state shows the red dot below caption only. |
| `.us-foot` | Inline with `.us-nav` — divider hidden on mobile (the bottom group merges visually with primary group; padding/spacing reads them as a 10-icon row) |
| Page padding | `padding-bottom: 56px;` on `<body>` to clear the dock |

#### 8.12.6 Implementation Reference (canonical CSS, abbreviated)

```css
.unified-sidebar {
  --us-w: 96px;
  --us-pad-x: 12px;
  --us-item-inset: 10px;
  --us-item-gap: 6px;
  --us-tile: 40px;
  --us-icon: 22px;
  --us-cap-size: 11px;
  --us-radius: 14px;
  --us-trans: 260ms cubic-bezier(0.4, 0, 0.2, 1);

  position: fixed; left: 0; top: 0;
  width: var(--us-w); height: 100vh;
  padding: var(--us-pad-x);
  display: flex; flex-direction: column;
  border-right: 0.5px solid rgba(40, 36, 32, 0.06);
  z-index: 200;
}

.us-logo {
  height: 48px;
  display: grid; place-items: center;
  font-family: var(--font-hero); font-style: italic;
  font-weight: 900; font-size: 26px;
  color: var(--ink);
  margin-bottom: 12px;
}

.us-nav  { flex: 1; display: flex; flex-direction: column; gap: var(--us-item-gap);
           padding-top: 8px; overflow-y: auto; scrollbar-width: none; }
.us-foot { display: flex; flex-direction: column; gap: var(--us-item-gap);
           padding-top: 12px; margin-top: 8px; position: relative; }
.us-foot::before {
  content: ""; position: absolute; top: 0; left: 12px; right: 12px;
  border-top: 0.5px solid rgba(40, 36, 32, 0.10);
}

.us-item {
  position: relative;
  width: calc(100% - 2 * var(--us-item-inset)); margin: 0 auto;
  min-height: 56px;
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 8px 6px;
  border-radius: var(--us-radius);
  border: 0.5px solid transparent;
  text-decoration: none; cursor: pointer;
  transition: background var(--us-trans), border-color var(--us-trans),
              box-shadow var(--us-trans), color 180ms ease;
}
.us-item__icon { width: var(--us-tile); height: var(--us-tile);
                 display: grid; place-items: center;
                 opacity: 0.78; transition: opacity 180ms ease; }
.us-item__icon svg { width: var(--us-icon); height: var(--us-icon); }
.us-item__cap { font-family: var(--font-mono); font-size: var(--us-cap-size);
                font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;
                color: var(--ink-4); max-width: 68px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.us-item:hover {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,244,232,0.55) 100%);
  backdrop-filter: blur(20px);
}
.us-item:hover .us-item__icon { opacity: 1; }
.us-item:hover .us-item__cap  { color: var(--ink); }

.us-item.is-active {
  background:
    linear-gradient(180deg,
      rgba(255,255,255,0.95) 0%,
      rgba(248,244,232,0.78) 50%,
      rgba(245,243,238,0.72) 100%);
  border-color: rgba(40, 36, 32, 0.10);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.80),
    inset 0 -1px 0 rgba(40,36,32,0.04),
    0 1px 2px rgba(40,36,32,0.06),
    0 4px 12px rgba(40,36,32,0.04);
}
.us-item.is-active .us-item__icon { opacity: 1; }
.us-item.is-active .us-item__cap  { color: var(--ink); }

/* Red active dot — sits 3px below the pill, centered horizontally */
.us-item.is-active::after {
  content: ""; position: absolute;
  bottom: -3px; left: 50%; transform: translateX(-50%);
  width: 4px; height: 4px;
  border-radius: 50%; background: var(--brand-red);
  box-shadow: 0 0 0 1.5px var(--snow);
}

/* Logo: no hover, no active dot */
.us-logo:hover, .us-logo.is-active { background: transparent; box-shadow: none; }
.us-logo.is-active::after { display: none; }

/* Mobile bottom dock (≤768px) */
@media (max-width: 768px) {
  .unified-sidebar {
    top: auto; bottom: 0; right: 0; width: 100%; height: 56px;
    padding: 0 8px;
    flex-direction: row; align-items: center; justify-content: space-around;
    border-right: none;
    border-top: 0.5px solid rgba(40, 36, 32, 0.06);
  }
  .us-logo { display: none; }
  .us-nav, .us-foot { flex: 1; flex-direction: row; gap: 0;
                      padding-top: 0; margin-top: 0; }
  .us-foot::before { display: none; }
  .us-item { min-height: 48px; flex: 1; padding: 4px; }
  .us-item__cap { font-size: 9px; }
  body { padding-bottom: 56px; }
}
```

#### 8.12.7 Discipline 🔒 STRICT

1. **Single source of truth = `UnifiedSidebar.tsx`.** Do not fork the component per role; pass `role` prop instead. Per-role nav lists live in the same file, in the table at § 8.12.4.
2. **Width is `96px` desktop, `56px` mobile.** No `120px`, no `64px`. The icon (22px) + caption (11px) + padding stack is calibrated for 96px exactly.
3. **Pills do NOT shift on hover** — this is global chrome (same rule as § 8.1 GA nav). Hover lightens via gradient + blur; active darkens slightly via the white-cream stops + adds the red dot.
4. **The active red dot is `--brand-red` 4px** with a 1.5px snow ring. Never use Editorial Pink, never use GA Orange — this is the system's "you are here" signal and it stays Brand Red.
5. **Caption `text-transform: uppercase` + `letter-spacing: 0.02em`** is locked. Title-case captions read as Marketing eyebrow voice and break the Product register.
6. **No search bar in the rail** — search lives in the page header where each page needs it (Find page, Inbox page, etc.), not in the chrome.
7. **The `.us-foot` divider is `0.5px` warm-ink at 0.10 alpha.** This is the only hairline visible inside the rail; the right edge of the rail itself is at 0.06 alpha (subtler).
8. **Logo "P" is Darky 26px 900 italic** — not Magvix, not lighter weight. Italic + 900 reads as a stamped brand mark; lighter weights look weak at 26px in the rail.
9. **Avatar pill ("Me") is the only circular shape in the rail.** The 28px circle establishes "this represents a person, not a feature." Don't replace with a square avatar.

---

### 8.13 Agent Status Bar 📐 STRUCTURED — Product UI register

> **Source of truth**: `app/(creator)/creator/dashboard/page.tsx` (`.cd-agent-bar` block) + `grid.css`. Lives at the top of the workspace content area (Today / Dashboard pages) — NOT inside the layout shell, so each page that needs it renders it inline. Communicates the agent's run state, count of items needing user input, pending payout total, and last activity timestamp.

#### 8.13.1 Anatomy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ●  Push is active   ·   1 NEEDS YOU   ·   $50 pending           last action 2m ago  │
│  ↑                       ↑                  ↑                    ↑                   │
│  green pulse 7×7         brand-red button   ink-2 mono           ink-4 mono right    │
└──────────────────────────────────────────────────────────────────────────────┘
   ↑ liquid-glass surface, 14px radius, min-height 48px
```

#### 8.13.2 Property Table

| Property | Value |
|----------|-------|
| Container | `display: flex; align-items: center; flex-wrap: wrap; gap: 12px;` `min-height: 48px; padding: 13px 20px;` `border-radius: 14px;` |
| Background | iOS 26 Liquid Glass — Light Variant (`.lg-surface` token from § 8.9.1: white-alpha base + radial specular highlight + multi-layer inset shadow + `backdrop-filter: blur(32px) saturate(180%)`) |
| Border | `0.5px solid rgba(255, 255, 255, 0.40)` |
| Pulse dot (`.cd-agent-pulse`) | 7×7 circle, `background: var(--status-done) #16a34a`, `border-radius: 50%`. Animation: 2.8s scale + opacity loop (`@keyframes cd-pulse: 0%/100% scale(1) opacity(1) → 50% scale(1.6) opacity(0.45)`). |
| Label (`.cd-agent-label`) | "Push is active" — CS Genio Mono 13px 600, color `var(--ink-2)`, letter-spacing 0.01em |
| Separator (`.cd-agent-sep`) | Middle-dot `·` — color `var(--ink-5)`, 13px |
| Needs-you button (`.cd-agent-needs-you`) | "{N} NEEDS YOU" — CS Genio Mono 12px 700 uppercase 0.04em, color `var(--brand-red)`. Renders as `<button>` (clickable — opens the action queue). Hover: bottom-right shift `translate(1px, 1px)` (this one IS interactive, so it gets the standard button hover). Hidden when `actionsNeeded === 0`. |
| Detail (`.cd-agent-detail`) | "${pendingTotal} pending" — CS Genio Mono 12px 500, color `var(--ink-4)` |
| Last action (`.cd-agent-last`) | "last action 2m ago" — CS Genio Mono 12px 500, color `var(--ink-5)`, `margin-left: auto` (right-aligned). Mobile: wraps to next line. |
| Spacing | 12px gap between every inline element. Right-side last-action pushes via `margin-left: auto`. |
| Mobile (<768px) | Container becomes 2-row stack: row 1 = pulse + label + needs-you button; row 2 = detail + last action. `padding: 12px 16px`. |

#### 8.13.3 Data Sources

| Field | Source |
|-------|--------|
| Pulse + "Push is active" | Hardcoded — present whenever the workspace is loaded (the agent is "active" iff the user is signed in and not paused) |
| `actionsNeeded` count | Derived from page state — for creator: `TIMELINE.filter(t => t.status === "OVERDUE").length`. For merchant: count of disputes / unverified scans. |
| `pendingTotal` | Derived sum of OVERDUE + ON_GOING slot payouts |
| Last action timestamp | Updated on every server mutation event subscribed to via WebSocket. Formats as relative time (`Xs / Xm / Xh / Xd ago`). Refreshes client-side every 30s. |

#### 8.13.4 Discipline 🔒 STRICT

1. **Lives at the top of the workspace content area** — the Today / Dashboard / Operations page mounts it as the first child. It is **not** part of the `UnifiedSidebar` shell layout (because it carries page-level state, not chrome-level navigation).
2. **The Needs-You button uses `--brand-red`** — never Editorial Pink, never GA Orange. Same reason as the active rail dot: this is "you must act."
3. **The pulse is `--status-done` green** — same token as the success state in § 2.5. Other statuses (warning / error) DO NOT replace the dot color; if the agent is in an error state, render an error banner ABOVE this bar (separate component), not by recoloring the pulse.
4. **The bar collapses from view at `actionsNeeded === 0 && pendingTotal === 0`** only on optional surfaces — on the Today page it is always visible (renders an "all clear" state with just the pulse + label).
5. **Liquid-glass surface follows § 8.9.1 tokens exactly** — do not invent a new transparent value or blur radius.
6. **Mobile wraps to 2 rows.** Do not horizontally scroll on narrow screens; the right-side timestamp drops below.

---

### 8.14 Dashboard KPI Card Grid (📐 STRUCTURED — Product UI register)

> Standard layout for the metrics overview area — the first panel a creator or merchant sees after login. Follows Product UI register: no parenthetical eyebrows, no Magvix Italic, no GA Orange.

#### 8.14.1 KPI Card Anatomy

```
┌─────────────────────────────┐
│  (EYEBROW)  TOTAL SCANS     │  ← CS Genio Mono 11px 700 uppercase --ink-3
│                             │
│  2,847                      │  ← Darky Bold clamp(40,5vw,64)px --ink
│                             │
│  ▲ +12.4% vs last week     │  ← CS Genio Mono 12px delta: green/red
└─────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Card background | `var(--surface-2)` Pearl Stone OR `rgba(255,255,255,0.80)` |
| Border radius | `var(--r-xl)` (16px) |
| Box shadow | `var(--shadow-1)` |
| Padding | `24px` all sides (desktop) / `20px` (mobile) |
| Eyebrow | CS Genio Mono 11px 700 uppercase letter-spacing 0.12em `--ink-3` |
| Eyebrow → numeral gap | 8px |
| KPI numeral | Darky Bold `clamp(40px, 5vw, 64px)` `--ink` (Brand Red for primary metric only) |
| Numeral → delta gap | 16px |
| Delta text | CS Genio Mono 12px 500 · `▲` positive `color: #22c55e` · `▼` negative `color: var(--brand-red)` · neutral `--ink-3` |
| Hover | Bottom-right shift `translate(1px,1px)` if card is clickable; no shift if display-only |
| Grid desktop | 3-up (4+4+4 col span) gap 24px |
| Grid iPad | 2-up (4+4 col span) gap 20px |
| Grid mobile | 1-up full-width gap 16px |
| Max KPI cards per row | 4 — beyond 4, break to a second row |

#### 8.14.2 Secondary Data Sections (within Dashboard)

Below the KPI card row, use **panel sections** with the Cinema Selects text pattern (§ 8.15) for:
- Recent activity logs (timestamp · action · status)
- Attribution events (QR scanned · store · creator · amount)
- Campaign summaries (name · reach · conversions · revenue)

Each secondary section is a separate white / `--surface-2` panel with `--r-xl` radius, `--shadow-1`, padding 24px.

```css
.dashboard-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.kpi-card {
  background: var(--surface-2);
  border-radius: var(--r-xl); /* 16px */
  box-shadow: var(--shadow-1);
  padding: 24px;
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 180ms ease;
}
.kpi-card:hover  { transform: translate(1px, 1px); }
.kpi-card:active { transform: translate(2px, 2px) scale(0.98); }

.kpi-card__eyebrow {
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--ink-3);
  margin: 0 0 8px;
}

.kpi-card__numeral {
  font-family: var(--font-display);
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  margin: 0 0 16px;
}

.kpi-card__numeral--primary { color: var(--brand-red); }

.kpi-card__delta {
  font-family: var(--font-mono);
  font-size: 12px; font-weight: 500;
  display: flex; align-items: center; gap: 4px;
}
.kpi-card__delta--up   { color: #22c55e; }
.kpi-card__delta--down { color: var(--brand-red); }
.kpi-card__delta--flat { color: var(--ink-3); }

@media (max-width: 1024px) {
  .dashboard-kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}
@media (max-width: 768px) {
  .dashboard-kpi-grid { grid-template-columns: 1fr; gap: 16px; }
  .kpi-card { padding: 20px; }
}
```

---

### 8.15 Cinema Selects Text Pattern — Q&A / Data / Prose (📐 STRUCTURED)

> The Editorial Table (§ 8.6) establishes the visual grammar: **dotted hairline row separators** + **Darky first column** + **CS Genio Mono remaining columns**. This § extends that grammar to **prose contexts** — Q&A sections, feature comparisons, founder bios, attribution event logs, FAQ blocks. The layout is not a table element; it's a series of `<dl>`, `<div>` rows, or flex rows following the same visual rhythm.

#### 8.15.1 Row Structure

Each "row" in the Cinema Selects pattern has exactly two zones:

| Zone | Role | Typography |
|------|------|------------|
| **Label / Question** | Left zone, ~30% width | Darky 18-20px 700 `--ink`, top-aligned, no wrap preferred |
| **Value / Answer** | Right zone, ~70% width | CS Genio Mono 16px 400 `--ink-3`, line-height 1.6, wraps normally |

Between every row: `border-top: 1px dotted rgba(10,10,10,0.20)` (the `--hairline-dotted` token).

#### 8.15.2 Variants

**A — Q&A / FAQ**  
Label zone = the question (Darky 18px 700 ink). Value zone = the answer prose (Mono 16px ink-3). Used on About / Story / Help pages.

**B — Data Event Log** (dashboard)  
Label zone = timestamp + source in Mono 12px ink-4. Value zone = event description in Mono 14px ink + status pill right-aligned. Used inside dashboard panels.

**C — Feature Comparison**  
Label zone = feature name (Darky 18px 700). Value zone = ✓ Creators / ✓ Merchants / — (not available) using Mono 14px 600 + color: ga-green or --ink-4. Used on Pricing page.

**D — Founder / Creator Bio Row**  
Label zone = person photo (40×40 circle) + name (Darky 16px 700). Value zone = role + one-line quote (Mono 14px ink-3 italic). Used on About / Team section.

#### 8.15.3 Section Header

Every Cinema Selects block opens with a section header above the first dotted row:

```
(CATEGORY LABEL)          ← Mono Eyebrow Parenthetical, 12px 700 uppercase, --ink-3
Section Title             ← Darky 28-40px 700 --ink, top-left anchored, margin-bottom 32px
━━━━━━━━━━━━━━━━━━━━━━   ← solid 1px hairline (NOT dotted — this is the opening rule)
```

Then all subsequent rows use `dotted` separators.

#### 8.15.4 Implementation

```css
/* Cinema Selects Block */
.cs-block {
  padding: 0;
}

.cs-block__eyebrow {
  font-family: var(--font-mono);
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--ink-3);
  margin: 0 0 16px;
}

.cs-block__title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 32px;
  line-height: 1.1;
}

/* Opening solid hairline */
.cs-block__opening-rule {
  border: none;
  border-top: 1px solid var(--hairline);
  margin: 0 0 0;
}

/* Each row */
.cs-row {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  padding: 24px 0;
  border-top: 1px dotted var(--hairline-dotted);
}

/* First row: dotted top matches the opening rule visually — keep it */

.cs-row__label {
  font-family: var(--font-display);
  font-size: 18px; font-weight: 700;
  color: var(--ink);
  line-height: 1.3;
  flex: 0 0 28%;          /* ~30% width */
  min-width: 0;
}

.cs-row__value {
  font-family: var(--font-mono);
  font-size: 16px; font-weight: 400;
  color: var(--ink-3);
  line-height: 1.65;
  flex: 1;                /* fills remaining ~70% */
  min-width: 0;
}

/* Variant B — Data Event Log (smaller, tighter) */
.cs-row--log {
  padding: 12px 0;
  align-items: center;
}
.cs-row--log .cs-row__label {
  font-family: var(--font-mono);
  font-size: 12px; font-weight: 500;
  color: var(--ink-4);
}
.cs-row--log .cs-row__value {
  font-size: 14px; font-weight: 500;
  color: var(--ink);
  display: flex; justify-content: space-between; align-items: center;
}

/* Status pill inside data log rows */
.cs-status {
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: var(--r-pill);
}
.cs-status--verified  { background: rgba(74,222,128,0.15); color: #166534; }
.cs-status--pending   { background: rgba(191,161,112,0.20); color: #92400e; }
.cs-status--declined  { background: rgba(193,18,31,0.10);  color: var(--brand-red); }

/* Mobile: stack label over value */
@media (max-width: 768px) {
  .cs-row { flex-direction: column; gap: 8px; padding: 20px 0; }
  .cs-row__label { flex: none; width: 100%; font-size: 16px; }
  .cs-row__value { flex: none; width: 100%; }
}
```

#### 8.15.5 Discipline

1. **🔒 STRICT — Always open with a solid hairline, continue with dotted.** The opening rule is solid (marks the boundary); row dividers are dotted (the Cinema Selects visual signature).
2. **🔒 STRICT — Label zone is Darky (display font) in standard variant.** Exception: Variant B (data log) uses Mono for the timestamp label — because timestamps are data, not prose.
3. **📐 STRUCTURED — Flex-basis split is 28% label / 72% value.** Do not use 50/50 — label column must be clearly subordinate in width to the value.
4. **🎨 OPEN — Row padding** is 24px standard; 12px for compact log rows. No other values.
5. **📐 STRUCTURED — Status pills** use only the 3 states above (verified / pending / declined). Do not invent new colors.

---

## 9. Unified Button System 🔒 STRICT

**5 button variants. Every button on every page renders identically. No per-page custom buttons. No exceptions without a documented PR justification.**

### 9.0 Hover-vs-Press Direction Rule (🔒 STRICT — read first)

The Push button system follows a single physical metaphor:

- **Default state**: button at rest, base color
- **Hover state** (desktop only): surface RISES toward the user → button feels "more alive" → either color UNCHANGED (when transform shift is doing the work) OR color slightly LIGHTER. **Never darker.**
- **Active / pressed state**: surface PUSHES into the page → button feels "pressed in" → color DARKENS to the `*-deep` token (or filter brightness <1 for nav pills) + transform translate (3px, 3px) + scale(0.98)

**The anti-rule is non-negotiable**: a hover state that DARKENS the button is forbidden. It reads as "disabled" or "already pressed" and breaks the user's spatial intuition. Pressing makes things darker (the press-in moment). Hovering makes things lighter (the lift toward you). If you find yourself writing `.btn:hover { background: var(--*-deep); }` — stop, it goes on `:active`.

Two valid hover approaches:

| Pattern | When to use | Hover changes |
|---------|------------|---------------|
| **Transform-only** (default for all buttons WITH bottom-right shift) | Filled Primary / Filled Secondary / Filled Ink / Ghost / Pill / Editorial Pink — every standard button | `transform: translate(1px, 1px)` only. Color unchanged on hover. |
| **Brightness-only** (used when transform is forbidden) | GA Tri-Color nav pills (`.btn-pill--nav`) — these must NOT shift to preserve flat-chrome reading | `filter: brightness(1.08)` only. No transform. |

Active state always combines: `transform: translate(2px, 2px) scale(0.98)` + the color darkening (or `filter: brightness(0.92)` for nav pills).

### 9.1 Filled Primary

The committed-action button — Apply, Launch, Reserve, Submit, Buy.

```css
.btn-primary {
  background: var(--brand-red);
  color: var(--snow);
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 14px 28px;
  border: none;
  border-radius: var(--r-sm); /* 8px */
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
              background 180ms ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Hover: transform shift only — color UNCHANGED. The shift IS the interactivity signal. */
.btn-primary:hover  { transform: translate(1px, 1px); }

/* Active/press: transform deeper + scale + DARKEN to brand-red-deep — the press-in moment */
.btn-primary:active { transform: translate(2px, 2px) scale(0.98); background: var(--brand-red-deep); }

.btn-primary:focus-visible { outline: 4px solid var(--brand-red-focus); outline-offset: 2px; }
.btn-primary:disabled { background: var(--ink-6); color: var(--ink-4); cursor: not-allowed; transform: none; }

/* Mobile sizing */
@media (max-width: 768px) {
  .btn-primary { padding: 12px 24px; font-size: 14px; }
}
```

### 9.2 Filled Secondary

Informational action — Learn more, Read docs, View pricing, See examples.

```css
.btn-secondary {
  background: var(--accent-blue);
  color: var(--snow);
  /* All other base properties identical to .btn-primary */
}
.btn-secondary:hover  { transform: translate(1px, 1px); }
.btn-secondary:active { transform: translate(2px, 2px) scale(0.98); background: var(--accent-blue-deep); }
```

### 9.3 Filled Ink (Ticket Panel + dark surface CTA)

Used inside Ticket Panel (where Brand Red would clash with GA Orange) and on dark surfaces where Ink fill reads as the press-here moment.

```css
.btn-ink {
  background: var(--ink);
  color: var(--snow);
  /* All other base properties identical to .btn-primary */
}
.btn-ink:hover  { transform: translate(1px, 1px); }
/* Note: Ink is already maximum dark — pressing "darker" is impossible.
   We use --char (slightly lighter warm dark) on press as the only visible color shift moment. */
.btn-ink:active { transform: translate(2px, 2px) scale(0.98); background: var(--char); }
```

### 9.4 Ghost (cancel / dismiss / secondary action)

Outlined, no fill. Lower-stakes pair to Filled Primary in dialog actions.

```css
.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 14px 28px;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
              background 180ms ease;
}
/* Hover: transform shift only. Background stays transparent. */
.btn-ghost:hover  { transform: translate(1px, 1px); }
/* Active: fill with --surface-3 (the press-in feedback) + transform deeper. */
.btn-ghost:active { transform: translate(2px, 2px) scale(0.98); background: var(--surface-3); }
```

### 9.5 Pill (filter chip / status tag / GA nav)

Pill-radius, smaller padding, used for non-primary repeated chips.

```css
.btn-pill {
  background: var(--surface-3);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 8px 18px;
  border: none;
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
              background 180ms ease, filter 180ms ease;
}
/* Hover: transform only. Background stays at --surface-3. */
.btn-pill:hover  { transform: translate(1px, 1px); }
/* Active: transform deeper + DARKEN to --mist (the press-in moment). */
.btn-pill:active { transform: translate(2px, 2px) scale(0.98); background: var(--mist); }
/* Selected state (sticky on after click): full ink fill + snow text. */
.btn-pill[aria-pressed="true"] { background: var(--ink); color: var(--snow); }
.btn-pill[aria-pressed="true"]:hover  { transform: translate(1px, 1px); }
.btn-pill[aria-pressed="true"]:active { transform: translate(2px, 2px) scale(0.98); background: var(--char); }

/* ────────────────────────────────────────────────────────────────────
   GA Tri-Color nav pill variant — flat chrome, no transform shift.
   Hover = filter brightness(1.08) (subtle LIGHTEN, the only feedback
   that fits "this is global chrome, not a content button").
   Active = filter brightness(0.92) (the press-in darken).
   ──────────────────────────────────────────────────────────────────── */
.btn-pill--nav { transition: filter 180ms ease; }
.btn-pill--nav.btn-pill--home   { background: var(--ga-orange); color: var(--snow); }
.btn-pill--nav.btn-pill--active { background: var(--ga-green);  color: var(--ink); }
.btn-pill--nav.btn-pill--last   { background: var(--ga-sky);    color: var(--ink); }
.btn-pill--nav:hover  { transform: none; filter: brightness(1.08); }  /* LIGHTEN, never darken on hover */
.btn-pill--nav:active { transform: none; filter: brightness(0.92); }  /* DARKEN on press — the only press feedback */
```

### 9.6 Editorial Pink (single editorial CTA stamp per page max)

Optional sixth flavor — reserved for ONE per-page editorial CTA stamp. Identical mechanics to Filled Primary, different color.

```css
.btn-editorial {
  background: var(--editorial-pink);
  color: var(--snow);
  /* All other base properties identical to .btn-primary */
}
.btn-editorial:hover  { transform: translate(1px, 1px); }
.btn-editorial:active { transform: translate(2px, 2px) scale(0.98); background: var(--editorial-pink-deep); }
```

### 9.7 Button Discipline

1. **Use the 5 (or 6 with Editorial Pink) variants above. No custom buttons.**
2. **Brand Red = primary commitment; N2W Blue = informational; Ink = on-Ticket-or-dark; Ghost = cancel/dismiss; Pill = chip/filter/nav; Editorial Pink = ≤1 per page.**
3. **Every button gets the bottom-right hover shift** except `.btn-pill--nav` (GA Tri-Color nav) which uses `filter: brightness(1.08)` on hover instead.
4. **🔒 STRICT — Hover NEVER darkens.** Hover either keeps the color identical (relying on transform shift for the interactive signal) OR slightly LIGHTENS via `filter: brightness(1.08)` (when transform is forbidden, e.g. nav pills). Darkening is ONLY for `:active` press state — see § 9.0 for the physical metaphor. A hover-darkens pattern reads as "disabled" or "already pressed" and breaks user spatial intuition.
5. **🔒 STRICT — Active/press always darkens.** Use the matching `--*-deep` token (Filled Primary → `--brand-red-deep`, Filled Secondary → `--accent-blue-deep`, Editorial Pink → `--editorial-pink-deep`) OR `filter: brightness(0.92)` for nav pills. Combined with `transform: translate(2px, 2px) scale(0.98)`.
6. **Buttons live in clusters** — primary + ghost in dialogs; primary alone in hero; pill row in filter bar.
7. **Button cluster spacing** = 16px gap between buttons (desktop + iPad), 12px (mobile). See § 6.5.
8. **Disabled state** = `--ink-6` background, `--ink-4` text, no hover shift, `cursor: not-allowed`.
9. **Focus state** = 4px outer focus ring in the button's brand color at 0.18 opacity.
10. **Mobile tap target** = minimum 44×44 hit area (achieved naturally with the padding above + button content).
11. **Icons inside buttons** — use 16-20px icon, gap 8px before label text.

---

## 10. Layout & Spacing Tokens (locked)

```css
:root {
  /* Spacing scale (multiples of 8px grid) */
  --space-1:   8px;   --space-9:  80px;
  --space-2:  16px;   --space-10: 96px;
  --space-3:  24px;   --space-11: 128px;
  --space-4:  32px;   --space-12: 160px;
  --space-5:  40px;   --space-13: 192px;
  --space-6:  48px;   --space-14: 240px;
  --space-7:  56px;   --space-15: 320px;
  --space-8:  64px;
}
```

| Surface | Padding |
|---------|---------|
| Page section vertical (panel-to-panel breath) | 96px desktop / 80px iPad / 56px mobile |
| Page section horizontal | 64px desktop / 48px iPad / 24px mobile |
| Container max-width | 1140px |
| Block gap (between text blocks within a panel) | 56px desktop / 40px iPad / 32px mobile |
| Card grid gap | 24px desktop / 20px iPad / 16px mobile |

Section dividers (Magvix Italic) take 64px above + 64px below desktop / 48px each iPad / 32px each mobile.

---

## 11. Elevation & Depth

```css
--shadow-1: 0 1px 2px rgba(10,10,10,0.04), 0 1px 4px rgba(10,10,10,0.04);
--shadow-2: 0 0 0 1px rgba(10,10,10,0.04), 0 4px 8px rgba(10,10,10,0.06), 0 8px 24px rgba(10,10,10,0.04);
--shadow-3: 0 0 0 1px rgba(10,10,10,0.04), 0 8px 16px rgba(10,10,10,0.08), 0 16px 48px rgba(10,10,10,0.06);
--shadow-glass: inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 32px rgba(10,10,10,0.08);
```

| Token | Use |
|-------|-----|
| `--shadow-1` | Subtle hover, chip pressed |
| `--shadow-2` | Standard card lift, sticky nav |
| `--shadow-3` | Modal, drawer, sheet |
| `--shadow-glass` | Floating liquid-glass tiles in Candy Panels (paired with `backdrop-filter: blur(12px)`) |

**Flat surfaces (no shadow):**

- Ticket Panel — perforation + grommets do the elevation work conceptually
- GA Tri-Color nav pills — flat saturation reads "this is chrome"
- Darky Giant Footer Wordmark — brand stamp, not interactive
- Editorial Hero Tile billboard — documentary print, not lifted

---

## 12. Motion

- **Library**: GSAP ScrollTrigger + Lenis smooth-scroll.
- **Spring timing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` on hover / press / panel-enter.
- **Standard durations**: 180ms button hover, 240ms card hover, 320ms modal open, 480ms panel scroll-in fade-up.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all transforms / transitions, falls back to opacity-only fade.

**Static (do NOT animate):**

- Ticket Panel container — appears flat, stays flat
- Magvix Italic Signature Divider — typographic breath, not a moment
- Darky Giant Footer Wordmark — pinned brand stamp
- GA Tri-Color nav pills — color-state only, no transform on hover

---

## 13. Icon System

- **One icon family per page** — Lucide OR Material Symbols. Not both on the same page.
- **Every icon sits in a 40×40px tile** with `--r-lg` (12px) corner. Background: `--surface` / `--surface-2` / `--ink` / `--char`. Naked SVG on a Candy Panel or Ticket Panel is forbidden.
- **Icon size inside tile**: 20-24px. Stroke 1.75-2px (Lucide) or weight 400 (Material Symbols).
- **Icon color** matches surface — `--ink` on light surfaces, `--snow` on dark, never colored.
- **Icon-to-text spacing**: 16px desktop (40×40 tile → text), 12px inline (24×24 → text), 8px eyebrow (12×12 → text). See § 6.4.

---

## 14. Responsive Breakpoints — natural adaptive

Same composition / same hierarchy across mobile / iPad / desktop — only spacing scale + column count adjust. No alternate layouts per breakpoint.

| Breakpoint | Width | Grid | Section padding (V) | Section padding (H) | Container | Body | Hero (Magvix) | Footer Wordmark |
|-----------|-------|------|--------------------|--------------------|-----------|------|---------------|-----------------|
| **Mobile** | <768px | 4-column, 16px gutter | 56px | 24px | `100% - 48px` | 18px | clamp pulls to ~64px | clamp pulls to ~140px |
| **iPad** | 768-1023px | 8-column, 20px gutter | 80px | 48px | `100% - 96px` | 18px | clamp pulls to ~96px | clamp pulls to ~200px |
| **Desktop** | 1024-1439px | 12-column, 24px gutter | 96px | 64px | 1140px max, mx-auto | 18px | up to 144px | up to 280px |
| **Wide** | ≥1440px | 12-column, 24px gutter | 96px | 64px | 1140px (caps) | 18px | up to 160px | up to 320px |

**Component-specific responsive notes:**

- **GA Tri-Color Nav**: Mobile collapses to monogram + hamburger, opens full-screen overlay with stacked pills.
- **Ticket Panel**: Aspect shifts ~5:2 (desktop) → ~4:3 (iPad) → ~1:1 (mobile). Padding `64px 96px` → `48px 56px` → `32px 24px`.
- **Editorial Table**: Mobile collapses to vertical card stack — each row becomes a card with header labels above values.
- **Photo Card**: Aspect locked at 4:5 OR 1:1 across all breakpoints. Text overlay padding 24px → 20px → 16px.
- **Footer**: 3-column grid → 2-column iPad → 1-column mobile stacked.
- **Magvix Italic Signature Divider**: Padding 64+64px → 48+48px → 32+32px above/below.
- **Hero corner-anchored title**: Offset stays equal to the section padding (96/80/56px from bottom + 64/48/24px from left).

**Touch targets**: All interactive elements ≥ 44×44 hit area on mobile (achieved naturally via § 9 button padding).

---

## 15. Modular Panel Discipline

Marketing pages compose as 3-5 stacked panels, alternating warm/cool tone.

### 15.1 Panel inventory

| Panel Type | Surface | Use |
|------------|---------|-----|
| **Hero** | Magvix headline corner-anchored on Surface, OR Darky Display on Ink, OR Magvix on Brand Red + image | Page entry |
| **Adventure** (router) | Candy Panel Peach or Butter, multiple inner cards | "Choose your adventure" |
| **Proof** | Candy Panel Blush or Surface-2, testimonial / merchant case + Photo Card | Social proof |
| **Resources** | Candy Panel Sky, link grid + thumbnails | Content / docs |
| **Anchor** | Ink or Char dark panel, large numeral KPI + Magvix Italic accent + dark photo | Single big stat moment |
| **Image** | Full-bleed photo in `--r-md` container, no overlay | Pure visual moment |
| **Editorial Table** | Surface-2 Pearl Stone, Darky title top-left + dotted-line table | "Look at the numbers" |
| **Photo Grid** | Surface, 2-3 col Photo Card with Bottom Gradient Overlay | Showcase grid |
| **Ticket** | GA Orange Ticket Panel | Newsletter / waitlist / single-stamp CTA |
| **Footer** | Editorial Blue rounded-top + Darky Giant Wordmark bottom-left | Page exit |

### 15.2 Composition Rules

- **3-5 panels per page.** Less = unfinished. More = scroll fatigue.
- **Adjacent panels alternate warm/cool tone.**
- **Each panel hosts ≤1 floating liquid-glass tile and ≤1 image card.**
- **Each panel hosts ≤1 saturated editorial moment.**
- **Magvix Italic Signature Divider may sit between any 2 adjacent panels** as a typographic breath. Max 2 dividers per page.
- **Hero title corner-anchored bottom-left** (Magvix or Darky Display); section titles corner-anchored top-left.

### 15.3 Push Marketing Page Default Stack

```
1. NAV (GA Tri-Color, sticky)
2. HERO panel — Magvix Italic accent in Darky 900 hero on Surface, title bottom-left corner-anchored
3. ADVENTURE panel — Candy Peach, "Choose your adventure" 3-card row, title top-left
   ─── divider: Posted · Scanned · Verified · ───
4. PROOF panel — Candy Blush, merchant case study + Photo Card grid
5. EDITORIAL TABLE panel — Surface-2, "Why Push beats Yelp / Groupon" table, title top-left
   ─── divider: End of receipt · Fin · ───
6. TICKET panel — GA Orange, "Tune into the signal" newsletter, headline centered (allowed exception)
7. FOOTER — Editorial Blue rounded-top + Darky Giant "PUSH" bottom-left
```

---

## 16. Hover Behavior — Bottom-Right Shift (Push interaction signature)

```css
.btn, .card, .pill, .clickable {
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn:hover  { transform: translate(1px, 1px); }
.btn:active { transform: translate(2px, 2px) scale(0.98); }
```

### Gets the shift

- All buttons (5 unified variants)
- All cards (campaign card, photo card, content card, listing card)
- Icon buttons, icon tiles
- Pills (status chip, filter chip)
- Ticket Panel CTA button

### Does NOT shift

- Footer giant wordmark (brand stamp)
- Ticket Panel grommets / perforation (decorative)
- GA Tri-Color nav pills (color-state only)
- Magvix Italic Signature Divider (typographic breath)
- Static badges, static eyebrows, body text

---

## 17. Build Checklist (before opening a PR)

### Marketing surfaces (Home / Landing / About / Pricing / Blog / Showcase)

- [ ] Page composed of 3-5 stacked panels, adjacent panels alternate warm/cool tone
- [ ] GA Tri-Color nav at top, sticky, monogram + 3 pills, no hover shift on pills
- [ ] Hero title corner-anchored bottom-left of hero panel (NOT centered)
- [ ] Section titles corner-anchored top-left of each panel
- [ ] ≤1 saturated editorial moment per viewport
- [ ] All buttons use one of the 5 unified variants from § 9 — Brand Red / N2W Blue / Ink / Ghost / Pill (or Editorial Pink ≤1/page)
- [ ] All eyebrows use Parenthetical form `(LINKS)` `(WHY THIS EXISTS)`
- [ ] Up to 2 Magvix Italic Signature Dividers between sections
- [ ] If Ticket Panel: ≤1 instance, headline Magvix Italic centered, CTA Filled Ink
- [ ] If Editorial Table: dotted-line dividers, mono parenthetical headers, Darky 18-20px first column, mono 16px other columns, last column right-aligned, title top-left
- [ ] If Photo Card: 4:5 or 1:1, bottom gradient overlay, Darky title + mono metadata, hover shifts (no zoom)
- [ ] Footer: Editorial Blue rounded-top, 2 floating glass tiles peeking, parenthetical column headers, Darky 800 giant "PUSH" bottom-left, ≤320px
- [ ] All clickable elements except GA nav + Ticket grommets get bottom-right hover shift

### Product surfaces (Dashboard / Settings / Onboarding / Forms / In-app messaging)

- [ ] Page does NOT use Ticket Panel, Magvix Italic Divider, Photo Card with Gradient Overlay, Editorial Table, Parenthetical Eyebrows, or corner-anchored Magvix hero
- [ ] Page uses canonical Eyebrow form (no parens), Candy Panel cards, clean Product UI component voice
- [ ] All buttons still use the 5 unified variants from § 9 (button system is global)
- [ ] Page has GA Tri-Color nav at top + Editorial Blue + Darky Giant Wordmark footer (chrome is global)

### Cross-cutting (every page)

- [ ] Every dimension (width / height / padding / margin / gap) snaps to 8px grid (4px allowed only for hairlines)
- [ ] Layout uses 12-column desktop / 8-column iPad / 4-column mobile grid
- [ ] Negative-space tokens from § 6 used directly — no eyeball spacing
- [ ] Color values come from the Allowed-Color List in § 2 only — photos / SVG visual effects exempt
- [ ] Body text = `--ink-3` warm gray, headings = `--ink` (or `--graphite` for mid-strong, `--char` on dark surface)
- [ ] No body text < 12px, no display text > 160px (Hero Magvix), > 320px (Footer Wordmark only exception)
- [ ] Three fonts loaded via `@font-face` — Magvix-Regular, Magvix-Italic, Darky-*, CS Genio Mono
- [ ] Tailwind theme exposes only the 12 type-scale sizes + radii scale + 8px spacing scale + Allowed-Color List
- [ ] All colors come from CSS custom properties — no hardcoded hex outside `:root`
- [ ] Mobile (<768px) tap targets ≥ 44×44
- [ ] Same composition + hierarchy across mobile / iPad / desktop — only spacing + column count adjust
- [ ] `prefers-reduced-motion` disables transforms / transitions
- [ ] `npm run type-check && npm run test && npm run build` all pass

---

## 18. Authority & Conflict Resolution

- This document supersedes Design.md v10 and earlier as the styling authority.
- v11 introduced: 12-column Grid, Negative-Space tokens, Unified Button system, 3 new warm neutrals (`--graphite` `--mist` `--char`), the Closed Allowed-Color List rule, Corner-Anchored Title rules, the 3 selective `border-radius:0` exceptions, GA Tri-Color nav, Ticket Panel, Editorial Table, Photo Card with gradient overlay, Magvix Italic Signature Divider, Darky Giant Footer Wordmark, and the 6-use-case Liquid Glass System.
- v12 layered Figma-synced typography (Hero raised to 200px max, body 18→20px, 110px Header 3, Caption lowered to 10px) and the GA Dark-Register components in § 19.
- v11.1 (2026-04-26): page bg unified to `#ffffff` Snow (was Ivory Cream); product UI cards have no border (defined by shadow alone); cream tokens reserved for Marketing register only.
- Conflicts between historical Design.md and the current text resolve to the current text.
- Deviations from this doc require user sign-off (Jiaming) AND a doc update in the same PR.

---

## 19. Component Library — Figma Audit (2026-04-26)

> **Source**: Visual audit of Figma file `vjlMQtghdV76EIAUt20r3h` (push), Pages 1 & 2. § 19.1–19.9 = Page 1 component library. § 19.10–19.11 = Page 2 /archive page Body content container. Note: Page 2 ("untitled") contains only the /archive page design; /article and /about frames do not exist in this Figma file as of 2026-04-26.
> All 9 components are dark-register (Grain Archive editorial surface). Background `#0F0E0E` / `#1F1F1F`.
> These components operate in the **Grain Archive dark register** — a sister register to Push's light marketing surface. GA = dark canvas; Push marketing = light canvas. Both share the same three fonts, the same button mechanics (hover shift), and the same GA Tri-Color nav chrome.

### 19.0 GA Dark-Register Token Set

> GA Tri-Color is defined in § 2.4 (Figma source of truth: node 1:42 — `--ga-orange #ff5700` / `--ga-green #32ce57` / `--ga-sky #a3caff`). The dark-canvas neutrals below are exclusive to GA components and live alongside the warm-gray ladder (§ 2.1):

| Role | Hex | Token |
|------|-----|-------|
| Near-black bg (canvas) | `#0F0E0E` | `--fig-bg1` |
| Dark panel | `#1F1F1F` | `--fig-bg2` |
| Mid gray | `#555659` | `--fig-mid` |
| Light gray | `#8C8D92` | `--fig-light` |
| Mist | `#D1D2D8` | `--fig-mist` |
| Near-white | `#F6F8FB` | `--fig-pale` |

### 19.1 Nav item (Figma node 1:55)

**📐 STRUCTURED** — 6 variants across 3 pages × 2 states (pill / text-only).

| Property | Value |
|----------|-------|
| Figma node | 1:55 |
| Dimensions | W: 650px, H: 92px |
| Variants | 6: Home-pill, Archive-pill, About-pill, Home-text, Archive-text, About-text |
| Background | Dark (#0F0E0E) |
| Pill variant bg | GA Orange / GA Green / GA Sky per page |
| Pill label color | Snow `#fff` (orange/green) OR Ink `#0F0E0E` (sky, light bg) |
| Pill radius | `--r-pill` (50vh) |
| Pill padding | `8px 18px` |
| Text-only variant | No fill; label text only, same font |
| Font | CS Genio Mono 14px 600 uppercase 0.04em |

```css
.nav-item--pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border-radius: 50vh;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
}
.nav-item--home    { background: #FF5700; color: #fff; }
.nav-item--archive { background: #32CE57; color: #0F0E0E; }
.nav-item--about   { background: #A3CAFF; color: #0F0E0E; }
```

### 19.2 Navigation (Figma node 1:68)

**🔒 STRICT** — global chrome on every Grain Archive page.

| Property | Value |
|----------|-------|
| Figma node | 1:68 |
| Dimensions | W: 1320px, H: 184px |
| Variants | 2: Desktop, Mobile |
| Background | `#1F1F1F` dark (NOT the light ivory used on Push marketing nav) |
| Layout | `display: flex; align-items: center; justify-content: space-between;` |
| Left | "GA" monogram — Darky font, ~32px circle, dark fill `#0F0E0E`, snow text |
| Center | 3 pills row: Home (orange) + Archive (green) + About (sky) |
| Pill gap | 8px |
| Mobile (<768px) | Collapses to monogram + hamburger icon |
| Hover on pills | `filter: brightness(1.08)` — LIGHTEN only, no transform shift |
| Sticky | `position: sticky; top: 0; z-index: 100;` |

```css
.ga-nav {
  position: sticky;
  top: 0;
  background: #1F1F1F;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}
.ga-nav__monogram {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #0F0E0E;
  color: #fff;
  display: grid; place-items: center;
  font-family: var(--font-display);
  font-size: 14px; font-weight: 700;
}
.ga-nav__pills { display: flex; gap: 8px; }
```

### 19.3 Article - large (Figma node 1:81)

**📐 STRUCTURED** — primary editorial article display, 2-column layout.

| Property | Value |
|----------|-------|
| Figma node | 1:81 |
| Dimensions | W: 1310px, H: 740px |
| Variants | 2: Default, Alternate (image/text column swap) |
| Background | `#0F0E0E` |
| Layout | 2-column: left col ~4:5 photo card + caption, right col hero text |
| Left: image | 4:5 portrait photo, `border-radius: 8px` (Figma uses 8px panel radius) |
| Left: caption | CS Genio Mono 12px, color `#555659`, below image |
| Right: headline | Darky `clamp(40px, 5vw, 72px)` weight 700, color `#F6F8FB` |
| Right: body | CS Genio Mono 16px line-height 1.55, color `#8C8D92` |
| Right: metadata | CS Genio Mono 12px uppercase, color `#555659` |
| Hover | Bottom-right shift on entire article card |

### 19.4 Article - small (Figma node 1:100)

**📐 STRUCTURED** — compact article grid tile, 6 variants.

| Property | Value |
|----------|-------|
| Figma node | 1:100 |
| Dimensions | W: 700px, H: 1236px |
| Variants | 6 (2 photo states × 3 layout orientations) |
| Background | `#0F0E0E` |
| Grid | 2-column, 4:5 portrait photos |
| Caption placement | **BELOW the image** (not overlaid) |
| Image radius | `8px` |
| Caption font | CS Genio Mono 12px, color `#555659` |
| Title | Darky 20px weight 700, color `#F6F8FB`, below caption |
| Gap between image and caption | 8px |
| Gap between caption and title | 12px |
| Card hover | Bottom-right shift |

> **Key rule**: Article - small captions appear BELOW the image frame. This contrasts with Photo Card with Bottom Gradient Overlay (§ 8.7) where text overlays the image. In GA's editorial register, image and text are separate — never overlaid.

### 19.5 Button - large (Figma node 1:149)

**🔒 STRICT** — section-level CTA spanning full container width. 2 variants.

| Property | Desktop | Mobile |
|----------|---------|--------|
| Figma node | 1:149 | — |
| Dimensions | W: 1300px, H: 332px | scales |
| Variants | Default (ghost/text style), Hover (orange fill) |
| Default state | No fill; "View all" label in Magvix Italic, color `#F6F8FB` |
| Hover state | `background: #FF5700` GA Orange fill, same Magvix Italic label in `#0F0E0E` |
| Label font | Magvix Italic `clamp(56px, 8vw, 128px)` |
| Layout | Full-width, centered label |
| Border | Default: `1px solid #555659` hairline; Hover: none (fill replaces) |
| Transition | `background 240ms ease, color 240ms ease` |

```css
.btn-large {
  width: 100%;
  height: 332px;
  display: grid; place-items: center;
  font-family: 'Magvix', serif;
  font-style: italic;
  font-size: clamp(56px, 8vw, 128px);
  color: #F6F8FB;
  background: transparent;
  border: 1px solid #555659;
  cursor: pointer;
  transition: background 240ms ease, color 240ms ease;
}
.btn-large:hover {
  background: #FF5700;
  color: #0F0E0E;
  border-color: transparent;
}
```

### 19.6 Button - small (Figma node 1:154)

**🔒 STRICT** — inline action button. 2 variants.

| Property | Value |
|----------|-------|
| Figma node | 1:154 |
| Dimensions | W: 182px, H: 196px |
| Variants | 2: Default (dark fill), Hover |
| Label | "Subscribe" |
| Default fill | `#1F1F1F` dark panel |
| Label color | `#F6F8FB` near-white |
| Radius | `8px` |
| Padding | `14px 28px` |
| Font | CS Genio Mono 16px 600 uppercase 0.04em |
| Hover | Bottom-right shift `translate(2px, 2px)` |

```css
.btn-small {
  padding: 14px 28px;
  background: #1F1F1F;
  color: #F6F8FB;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 16px; font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-small:hover  { transform: translate(2px, 2px); }
.btn-small:active { transform: translate(3px, 3px) scale(0.98); }
```

### 19.7 Table row (Figma node 1:159)

**📐 STRUCTURED** — editorial film/music/article table. 2 variants.

| Property | Value |
|----------|-------|
| Figma node | 1:159 |
| Dimensions | W: 1272px, H: 180px |
| Variants | 2: Desktop, Mobile |
| Background | `#0F0E0E` |
| Column structure | 4 cols: Title / Year / Mood / Description |
| Col 1 (Title) | Darky 20px weight 700 color `#F6F8FB` |
| Col 2 (Year) | CS Genio Mono 16px color `#8C8D92` |
| Col 3 (Mood/Tag) | CS Genio Mono 16px color `#8C8D92` |
| Col 4 (Description) | CS Genio Mono 16px color `#555659`, right-aligned |
| Row divider | `border-bottom: 1px dotted rgba(255,255,255,0.15)` |
| Row vertical padding | `20px 0` |
| Mobile | Collapses — title full-width top, year/mood inline below, description drops |
| Hover | Bottom-right shift on entire row |

**Example content**: `Static Bloom | 2023 | Hazy, melancholic | For the light leaks and long silences`

```css
.table-row {
  display: grid;
  grid-template-columns: 2fr 80px 1fr 2fr;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.table-row:hover { transform: translate(2px, 2px); }
.table-row__title { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: #F6F8FB; }
.table-row__meta  { font-family: var(--font-mono); font-size: 16px; color: #8C8D92; }
.table-row__desc  { font-family: var(--font-mono); font-size: 16px; color: #555659; text-align: right; }
```

### 19.8 Subscribe container (Figma node 1:168)

**📐 STRUCTURED** — GA Orange newsletter CTA. Ticket Panel variant in GA dark register. 3 breakpoints.

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Figma node | 1:168 | — | — |
| Dimensions | W: 1240px, H: 1340px Hug | shrinks | shrinks |
| Variants | 3: Desktop, Tablet, Mobile |
| Background | `#FF5700` GA Orange |
| Layout | Auto layout, vertical, centered |
| Grommets | 6 black solid circles (3 left edge, 3 right edge), 16px diameter |
| Perforation | Dashed 2px lines running left + right sides (inset ~14px from edge) |
| Headline | Magvix Italic `clamp(56px, 8vw, 96px)` color `#0F0E0E`, **centered** |
| Headline text | "Tune into the signal" |
| Body | CS Genio Mono 16px-18px, color `#1F1F1F` centered, max-width 480px |
| Body text | "No noise—just deep cuts on music, film, and culture" |
| CTA button | Dark fill `#0F0E0E` + snow text, `border-radius: 8px` (Filled Ink variant) |
| CTA label | "Subscribe" |
| Interior padding | `64px 96px` desktop / `48px 56px` tablet / `32px 24px` mobile |
| Shadow | None (flat — Ticket Panel spec) |

> **Note**: This is the Grain Archive implementation of the Ticket Panel (§ 8.2). In GA dark register, the grommet dots are on left + right sides (not corners). The centered title exception applies per § 7.3.

```css
.subscribe-container {
  background: #FF5700;
  padding: 64px 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}
.subscribe-container__headline {
  font-family: 'Magvix', serif;
  font-style: italic;
  font-size: clamp(56px, 8vw, 96px);
  color: #0F0E0E;
  text-align: center;
  line-height: 1.0;
}
.subscribe-container__body {
  font-family: var(--font-mono);
  font-size: 18px;
  color: #1F1F1F;
  text-align: center;
  max-width: 480px;
}
```

### 19.9 Photo row (Figma node 1:306)

**📐 STRUCTURED** — 5-up horizontal editorial photo strip. 4 labeled rows on Page 1 (Photo row 1–4).

| Property | Value |
|----------|-------|
| Figma node | 1:306 (Photo row 1) |
| Dimensions | W: 1360px Fill, H: 280px Hug |
| Variants | None (each "Photo row" is a separate frame; 4 rows total) |
| Layout | Auto layout horizontal, gap 20px |
| Number of photos | 5 per row |
| Each photo | ~256×256px square (approx: (1360 − 4×20) / 5 = 256px per cell) |
| Image radius | None (or minimal — editorial square crop) |
| Caption | "Link" text below each photo in CS Genio Mono 12px `#555659` |
| Caption gap | 8px below image |
| Background | Transparent / page bg (#0F0E0E) |
| Hover | Bottom-right shift on individual photo card |
| Responsive | 5-up → 3-up (iPad) → 2-up (mobile), remaining cards wrap or hide |

```css
.photo-row {
  display: flex;
  gap: 20px;
  width: 100%;
}
.photo-row__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.photo-row__item:hover { transform: translate(2px, 2px); }
.photo-row__img {
  aspect-ratio: 1;
  object-fit: cover;
  width: 100%;
}
.photo-row__caption {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #555659;
}
```

### 19.10 Archive Page — Hero Section (📐 STRUCTURED · Figma Page 2)

> **Source**: Figma Page 2 ("untitled"), Body content container › Hero section. GA dark-register application of Image-First Layout Pattern A (§ 8.10).

Full-bleed editorial photograph on a `#0F0E0E` canvas. The masthead title ("Grain Archive") is the only text — no eyebrow, no body, no CTA inside the hero panel. The section-level "View all" Button-large (§ 19.5) immediately follows as a visual separator before the article grid.

| Property | Value |
|----------|-------|
| Section background | `#0F0E0E` |
| Photo | Full-bleed, `object-fit: cover`, fills entire hero frame |
| Title font | Darky Bold, `clamp(72px, 9vw, 160px)` white (`#ffffff`) |
| Title anchor | **Bottom-left** (48px from bottom, 64px from left, desktop) |
| `border-radius` | `0` — allowed exception 1 (full-bleed hero) |
| Section height | Minimum 560px desktop; auto on mobile |
| Image overlay | Optional: `#0F0E0E` at 20–35% opacity for legibility |
| Hover | No shift — hero is not a click target |
| What follows | Button-large (§ 19.5) full-width separator → Articles list |

**Rule**: No Candy Panel wrapper — this is direct canvas, `#0F0E0E` background. Do not round the corners.

```css
.ga-archive-hero {
  position: relative;
  width: 100%;
  min-height: 560px;
  background: #0f0e0e;
  overflow: hidden;
  border-radius: 0; /* documented exception */
  display: flex;
  align-items: flex-end;
}

.ga-archive-hero__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Optional dark overlay via mix-blend-mode or ::after pseudo */
}

.ga-archive-hero__title {
  position: relative;        /* sits above the photo */
  font-family: var(--font-display); /* Darky */
  font-size: clamp(72px, 9vw, 160px);
  font-weight: 700;
  color: #ffffff;
  line-height: 0.92;
  padding: 0 64px 48px;      /* bottom-left anchor */
  z-index: 1;
}

@media (max-width: 768px) {
  .ga-archive-hero__title { font-size: clamp(48px, 12vw, 80px); padding: 0 24px 32px; }
}
```

---

### 19.11 Archive Page — Featured Album Section (📐 STRUCTURED · Figma Page 2, node 2:3688)

> **Source**: Figma Page 2 ("untitled"), Body content container › Featured album section. NEW — not present in Page 1 component library.

A full-viewport-width editorial spotlight panel for a single album, film, or release. The background is a desaturated (B&W) grain photograph at 60% opacity over `#141414`, creating a "dark room" atmosphere. The featured item (album art) is centered horizontally within a content column shifted right from the left edge, leaving a large text-only zone on the left for the section title.

**Figma-measured dimensions (Page 2, Desktop 1280px baseline):**

| Property | Value |
|----------|-------|
| Section W | 1780 Fill |
| Section H | 1446 Hug (content-driven) |
| Section fill | B&W photo at **60% opacity** + `#141414` solid at **100%** (photo layered on top of color) |
| Section padding | top 10 / right 290 / bottom 60 / left 10 |
| Auto layout gap | 32px (between title row and album display) |
| Background `border-radius` | 0 (full-bleed editorial moment) |

**Child 1 — Section title ("Featured Album")**

| Property | Value |
|----------|-------|
| Typography | Darky Bold, ~72px white (`#ffffff`) |
| Anchor | **Top-left** of section |
| Form | Two-line: "Featured" / "Album" |

**Child 2 — Album display (node 2:3690)**

| Property | Value |
|----------|-------|
| W | 1760 Fill |
| H | 1096 Hug |
| Layout | Auto layout, vertical, gap 32 |
| Left padding | 200px (pushes album card to center-right zone) |

**Album art card** (inside Album display):

| Property | Value |
|----------|-------|
| Shape | Square (1:1 aspect ratio) |
| Album cover | Full-bleed photograph / artwork |
| Badge — left | `"ARTIFACT"` — rectangular pill, white 1px border, white CS Genio Mono 12px 700 uppercase |
| Badge — right | `"GA-03"` — oval outline pill, white 1px border, white CS Genio Mono 12px |
| Badge position | Absolute, bottom of the album card, inset 16px from left/right edges |

**Metadata row** (below album art card):

| Property | Value |
|----------|-------|
| Artist line | `"False Memory by Artifact"` — CS Genio Mono 16px, white `#F6F8FB` |
| CTA link | `"▶ Listen now"` — Magvix Italic ~24px, white |
| Gap | 8px between artist line and CTA |

**Tone discipline**: This panel lives in the **GA dark register** (§ 19). Background is always dark (`#141414` + photo). Text is always white/near-white (`#F6F8FB`). No Candy Panel wrapper. No Brand Red / N2W Blue CTA — the "Listen now" link uses Magvix Italic as the only interactive affordance.

```css
.ga-featured-album {
  position: relative;
  width: 100%;
  padding: 10px 290px 60px 10px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  /* Background: dark solid + BW photo on top */
  background-color: #141414;
  overflow: hidden;
}

.ga-featured-album__bg-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  opacity: 0.6; /* 60% as Figma */
  z-index: 0;
}

.ga-featured-album__title {
  position: relative;
  z-index: 1;
  font-family: var(--font-display); /* Darky */
  font-size: clamp(56px, 7vw, 96px);
  font-weight: 700;
  color: #ffffff;
  line-height: 0.95;
}

.ga-album-display {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-left: 200px; /* shifts to center-right zone */
}

.ga-album-art {
  position: relative;
  width: min(520px, 100%);
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.ga-album-art img { width: 100%; height: 100%; object-fit: cover; }

.ga-album-art__badges {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ga-album-badge {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ffffff;
  border: 1px solid #ffffff;
  padding: 4px 10px;
  border-radius: 4px; /* left "ARTIFACT" badge */
}

.ga-album-badge--oval {
  border-radius: 999px; /* right "GA-03" oval */
}

.ga-album-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ga-album-meta__artist {
  font-family: var(--font-mono);
  font-size: 16px;
  color: #F6F8FB;
}

.ga-album-meta__cta {
  font-family: var(--font-brand); /* Magvix */
  font-style: italic;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ga-album-meta__cta:hover { transform: translate(1px, 1px); }
.ga-album-meta__cta:active { transform: translate(2px, 2px) scale(0.98); }

/* Responsive */
@media (max-width: 1024px) {
  .ga-featured-album { padding: 10px 48px 48px 10px; }
  .ga-album-display { padding-left: 48px; }
}

@media (max-width: 768px) {
  .ga-featured-album { padding: 16px 24px 40px; }
  .ga-album-display { padding-left: 0; }
  .ga-featured-album__title { font-size: clamp(40px, 12vw, 64px); }
}
```

---

### 19.12 Component Discipline

1. **🔒 STRICT — GA register = dark canvas.** All components in § 19 use `#0F0E0E`, `#141414`, or `#1F1F1F` backgrounds. Do not mix with the light Push marketing surface (`#f8f4e8`) in the same viewport.
2. **🔒 STRICT — Caption placement**: In GA editorial components, captions always appear BELOW the image (never overlaid). Push Photo Card (§ 8.7) uses overlay. Two different visual registers, two different rules.
3. **📐 STRUCTURED — Button - large** spans full container width and uses Magvix Italic. This is the GA "section footer" pattern — it concludes an article section with a large typographic CTA. Max 1 per section.
4. **📐 STRUCTURED — Photo row** always runs 5-up on desktop. Do not reduce the count inside a row; instead wrap to a new row.
5. **🔒 STRICT — Table row column order**: Title / Year / Mood / Description (4 cols). Do not reorder. Last column right-aligned always.
6. **🔒 STRICT — Subscribe container headline is centered** (exception to corner-anchored rule per § 7.3 — Ticket Panel class containers use centered Magvix Italic).
7. **📐 STRUCTURED — Navigation dark bg**: GA nav uses `#1F1F1F`, not the light `rgba(248,244,232,0.85)` from Push marketing nav (§ 8.1). Two separate nav specs for two registers.
8. **📐 STRUCTURED — Featured Album Section**: background is always `#141414` + BW photo at 60%. No Brand Red / Blue CTA — use Magvix Italic "Listen now" link only. Section title top-left (Darky Bold). Album display is a content column, not a card — no border, no shadow, no Candy Panel.
9. **📐 STRUCTURED — Archive Hero Section**: no panel wrapper, no border-radius. Title anchored bottom-left directly on the photo. No interactive affordance on the hero frame — the Button-large that follows is the CTA.

---
