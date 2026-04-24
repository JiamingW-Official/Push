# Push — Design System v7

> **Authority**: This document is the single source of truth for all UI styling in the Push project.
> Any code that touches layout, color, typography, or component shape **MUST** conform to the tokens defined below.
>
> **v7 Status** (2026-04-24): Ink + Champagne Gold + 6 category colors · iOS 26 continuous corner · three-layer soft elevation · Darky 900 bold modular. Supersedes v6 (Papaya Whip / hard-angle / 5-6 color brand).

---

## Core Principles (Non-Negotiable)

1. **iOS 26 continuous corner** — radii from the `8 / 12 / 14 / 20 / 28 / 32 / pill / circle` scale. `border-radius: 0` is **forbidden**.
2. **Ink + 1 brand accent + 1 ceremonial gold + 6 category colors** — no new brand colors without updating this file first.
3. **Two fonts, forever** — Darky (display) + CS Genio Mono (body/UI). No third font ever.
4. **8px base grid** — spacing tokens 8 / 16 / 24 / 32 / 40 / 48 / 56 / 64 / 80 / 96 / 128.
5. **Premium warm white background** — `#fbfaf7` Ivory. Not pure white, not Papaya Whip.
6. **Light mode only** — no dark mode.
7. **GSAP ScrollTrigger + Lenis** — scroll-driven animation. iOS 26 spring timing `cubic-bezier(0.34, 1.56, 0.64, 1)` on interactive press.
8. **Three-layer soft elevation + glass morphism** on sticky/overlay surfaces. Hard-offset Brutalist shadows are **retired**.
9. **Bold Modular blocks** — few large 28–32px radius modules per section, not dense grids. 96–128px vertical breathing room on desktop.

---

## Color Palette

### Foundation — Ink Ladder (text, icons, hairlines)

Replaces v6 `--dark` / `--graphite` / `--gray-*` family. Six grayscale stops carry all text and non-accent UI.

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--ink` | Ink | `#0a0a0a` | Primary text, all headings, icon strokes |
| `--ink-2` | Ink 2 | `#1f1f1f` | Secondary heading, emphasized body, dark panel bg |
| `--ink-3` | Ink 3 | `#3a3a3a` | Body copy |
| `--ink-4` | Ink 4 | `#6a6a6a` | Secondary label, metadata |
| `--ink-5` | Ink 5 | `#9a9a9a` | Tertiary metadata, icon-secondary |
| `--ink-6` | Ink 6 | `#cfcfcf` | Placeholder, disabled, lightest chip fill |

### Foundation — Surface Ladder (backgrounds, hairlines)

Three surface tones build depth through layering. Background is **warm ivory**, not pure white — retains Push's premium editorial warmth but more refined than v6 Papaya Whip.

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--surface` | Ivory Warm White | `#fbfaf7` | Default page background, elevated cards |
| `--surface-2` | Pearl Stone | `#f5f3ee` | Nested cards on `--surface` page, alternating sections |
| `--surface-3` | Bone | `#ece9e0` | Button hover, muted block, inactive tab |
| `--hairline` | Hairline | `rgba(10, 10, 10, 0.08)` | Standard 1px divider / card border |
| `--hairline-2` | Hairline Strong | `rgba(10, 10, 10, 0.14)` | Emphasized divider, focused input border |

### Brand Signatures

Two brand colors with clear division of labor. Flag Red = action / CTA / brand identity. Champagne Gold = ceremonial / Partner tier / premium moment.

#### Flag Red (primary action, brand signature)

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-red` | `#c1121f` | Primary CTA, brand accent line, logo, active tab, Closer tier |
| `--brand-red-deep` | `#9b0e19` | Hover / pressed, error text on light bg |
| `--brand-red-tint` | `rgba(193, 18, 31, 0.08)` | Error banner bg, tinted alert surface |
| `--brand-red-focus` | `rgba(193, 18, 31, 0.18)` | Focus ring (4px outer glow) |

#### Champagne Gold (ceremonial, premium moments)

Optimized from v6 `#c9a96e` → `#bfa170` — slightly cooler, more saturated gold (less beige). Inspired by iPhone Desert Titanium + antique gold leaf.

| Token | Hex | Usage |
|-------|-----|-------|
| `--champagne` | `#bfa170` | Partner tier, premium badge, award moment, ceremonial CTA |
| `--champagne-deep` | `#9d8256` | Hover / pressed, icon on light bg |
| `--champagne-light` | `#e8dcc3` | Featured badge bg, award card tint, warm premium surface |
| `--champagne-tint` | `rgba(191, 161, 112, 0.14)` | Partner-context panel bg |

**Rule**: Champagne cannot appear more than 3 times per viewport. If Champagne and Flag Red appear in the same module, a neutral anchor (`--ink` / `--surface-2`) must separate them.

### Category Colors (6 categories, unified tone)

Every Push listing belongs to a category. All 6 category colors live at the same saturation/value layer (sat 45–60%, value 40–55%) — they read as one family but each is instantly identifiable.

**Critical usage rule**: category color appears **only within that category's context** (listing card for that category, its detail page, its filter chip). Never use a category color for global UI. This is Airbnb's "Rausch for Homes, Teal for Experiences" discipline.

| Token | Name | Hex | Category | Mood |
|-------|------|-----|----------|------|
| `--cat-dining` | Saffron Terracotta | `#b8624a` | 餐饮 Dining | Warm / appetite |
| `--cat-travel` | Horizon Blue | `#4a7a8c` | 旅行 Travel | Cool / distance |
| `--cat-beauty` | Dusty Rose | `#b5807f` | 美容 Beauty | Warm / gentle |
| `--cat-fashion` | Aubergine Plum | `#5d4a6b` | 服装 Fashion | Cool / runway |
| `--cat-fitness` | Sage Green | `#7a8d6e` | 健身 Fitness / Wellness | Cool / nature |
| `--cat-ent` | Wine Deep | `#8b3a4c` | 娱乐 Entertainment | Warm / nightlife |

Each category color has a matching tint for tinted backgrounds and a deep variant for pressed/hover:

```css
--cat-dining-tint:  rgba(184,  98,  74, 0.12);
--cat-dining-deep:  #8f4632;

--cat-travel-tint:  rgba( 74, 122, 140, 0.12);
--cat-travel-deep:  #2f5a6b;

--cat-beauty-tint:  rgba(181, 128, 127, 0.12);
--cat-beauty-deep:  #8f5957;

--cat-fashion-tint: rgba( 93,  74, 107, 0.12);
--cat-fashion-deep: #3d2f47;

--cat-fitness-tint: rgba(122, 141, 110, 0.12);
--cat-fitness-deep: #58684f;

--cat-ent-tint:     rgba(139,  58,  76, 0.12);
--cat-ent-deep:     #5c242f;
```

### Semantic (iOS SF-inspired)

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#34c759` | Verified, approved, positive delta (iOS SF Green) |
| `--warning` | `#ff9500` | Pending, caution (iOS SF Orange) |
| `--danger` | `var(--brand-red)` | Destructive, error — reuses Flag Red, does not introduce new color |
| `--info` | `var(--ink)` | Links, info — use ink + underline or `--brand-red` for links. No info-blue. |

### Color Rules

- **No new brand colors** without updating this file first.
- **Background is `--surface`** (`#fbfaf7` Ivory). Never pure white. Never `#fdf0d5` Papaya Whip (retired).
- **Text color hierarchy**: headings → `--ink`; body → `--ink-3`; secondary → `--ink-4`; metadata → `--ink-5`.
- **Links**: `--brand-red` fill or `--ink` + 1px underline. No blue links.
- **Category color**: only in category-context elements. Never for global nav, CTA, or chrome.
- **Champagne**: premium moments only (Partner tier, featured badge, award). Max 3 instances per viewport.
- **Hairlines always** use `--hairline` (or `--hairline-2` for focus). No hardcoded rgba values.
- **Any hex** in the codebase not in this file + permitted `#ffffff` / `#000000` is **noise** — migrate to a token.

---

## Typography

Push's editorial signature lives in **weight contrast**, not color. Two fonts carry everything.

| Token | Font Family | Usage |
|-------|-------------|-------|
| **Display / Headline** | `Darky` | All headings (h1–h4), hero, display typography, numerals |
| **Body / Label** | `CS Genio Mono` | Body copy, buttons, labels, navigation, metadata, captions |

### Type Scale (v7 — bigger, bolder, tighter than v6)

| Element | Font | Size | Weight | Letter-Spacing |
|---------|------|------|--------|---------------|
| Display (Hero) | Darky | `clamp(72px, 14vw, 200px)` | 900 | `-0.07em` |
| H1 | Darky | `clamp(56px, 8vw, 104px)` | 800 | `-0.06em` |
| H2 | Darky | `44px` | 800 | `-0.04em` |
| H3 | Darky | `28px` | 700 | `-0.03em` |
| H4 | Darky | `22px` | 600 | `-0.02em` |
| Body | CS Genio Mono | `16px` / `1rem` | 400 | `0` |
| Small / Label | CS Genio Mono | `14px` | 400 | `0.01em` |
| Caption | CS Genio Mono | `12px` | 400 | `0.02em` |
| Eyebrow | CS Genio Mono | `11px` | 700 | `0.12em` (uppercase) |
| Numbered Section | CS Genio Mono | `14px` | 600 | `0.04em` |

### Darky Weight System (all available)

| Weight | File | Typical Use |
|--------|------|-------------|
| 100 Thin | `Darky-Thin.ttf` | Oversized decorative numbers, ghost text |
| 200 ExtraLight | `Darky-ExtraLight.ttf` | Large pull-quote numbers, weight-contrast stat |
| 300 Light | `Darky-Light.ttf` | Secondary display text |
| 400 Regular | `Darky-Regular.ttf` | Fallback heading |
| 500 Medium | `Darky-Medium.ttf` | Mid-weight accent |
| 600 SemiBold | `Darky-SemiBold.ttf` | H4 |
| 700 Bold | `Darky-Bold.ttf` | H3 |
| 800 ExtraBold | `Darky-ExtraBold.ttf` | H1, H2 |
| 900 Black | `Darky-Black.ttf` | Display, hero headline, card titles |

### Core Principle — Weight Contrast = Visual Depth

In a palette built around Ink + 1 accent + 1 ceremonial gold, page rhythm must come from **weight jumps**, not hue jumps:

- Hero: Darky 900 super-size headline ⟂ Darky 200 stat number beside it
- Section: Darky 800 title ⟂ CS Genio Mono 11px 700 uppercase eyebrow
- Card: Darky 700 card title ⟂ CS Genio Mono 14px 400 metadata
- **Forbidden**: three or more same-weight text blocks in one section (reads flat)

### Typography Rules

- Darky is **only** for display/headings. Never body copy.
- CS Genio Mono is monospaced — gives editorial-technical character. Use for everything else.
- Display type uses negative tracking (`-0.04em` to `-0.07em`). Body and small stay at `0` tracking.
- Import both via `@font-face` in `globals.css`. No Google Fonts imports.
- Fallback stack: `Darky, sans-serif` for headings; `'CS Genio Mono', 'SF Mono', 'Fira Code', monospace` for body.

---

## Shape & Radii (iOS 26 Continuous Corner)

`border-radius: 0` is **retired**. v7 uses the iOS 26 continuous corner scale.

### Radius Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--r-sm` | `8px` | Badges, tags, status pills, small indicators |
| `--r-md` | `12px` | Inputs (text/textarea/select), tooltips |
| `--r-lg` | `14px` | Buttons (square variant), dropdown menus, small cards |
| `--r-xl` | `20px` | Standard cards (listing, content), image containers |
| `--r-2xl` | `28px` | Modals, drawers, sheets, booking panels |
| `--r-3xl` | `32px` | Hero blocks, large modular sections |
| `--r-pill` | `50vh` | Pill buttons, filter chips, status tags |
| `--r-full` | `50%` | Avatars, circular icon buttons, map pins, carousel arrows |

### Element-to-Radius Mapping

| Element | Radius |
|---------|--------|
| Page hero / large modular block | `32px` |
| Modal / drawer / sheet / booking panel | `28px` |
| Standard card (listing, content, feed item) | `20px` |
| Image container (hero, listing, avatar card) | `20–24px` |
| Button (filled/ghost/secondary) | `14px` |
| Button (pill variant) | `50vh` |
| Input / textarea / select | `12px` |
| Badge / tier badge / small chip | `8px` |
| Status tag / filter chip / status pill | `50vh` |
| Avatar / icon circle / carousel arrow / back-to-top / map pin | `50%` |

### Shape Rules

- All containers, cards, modals, inputs use tokens above.
- Third-party components that ship with different radii must be **overridden** to match this scale.
- Category-colored cards share the same radius as neutral cards — category color never changes radius.

---

## Elevation & Depth

### Shadow Tokens (iOS 26 three-layer soft elevation)

```css
--shadow-1:   0 1px 2px rgba(10, 10, 10, 0.04),
              0 1px 4px rgba(10, 10, 10, 0.04);
              /* subtle — card hover, chip pressed */

--shadow-2:   0 0 0 1px rgba(10, 10, 10, 0.04),
              0 4px 12px rgba(10, 10, 10, 0.06),
              0 2px 4px rgba(10, 10, 10, 0.04);
              /* standard — resting card elevation */

--shadow-3:   0 0 0 1px rgba(10, 10, 10, 0.04),
              0 12px 32px rgba(10, 10, 10, 0.10),
              0 4px 12px rgba(10, 10, 10, 0.06);
              /* signature — modal, sticky booking panel */

--shadow-focus:   0 0 0 4px var(--brand-red-focus);
                  /* accent focus ring for all interactive elements */
```

### Elevation Rules

- Default resting listing card: no shadow (sits on surface via radius + hairline border).
- On hover, listing card → `--shadow-1` and `translateY(-4px)`.
- Elevated card (booking panel, featured card): `--shadow-2` resting.
- Modal / sheet / sticky floating panel: `--shadow-3`.
- **Removed**: `box-shadow: 3px 3px 0 var(--accent)` hard-edge Brutalist button shadow. Migrate all buttons to § Buttons specs below.

### Glass Morphism (sticky nav, sheet, toast, bottom CTA)

```css
--glass-bg:     rgba(255, 255, 255, 0.72);
--glass-blur:   backdrop-filter: blur(24px) saturate(1.8);
--glass-border: 1px solid rgba(255, 255, 255, 0.5);
```

Glass is reserved for "floating above content" — sticky top nav on scroll, modal overlay, bottom-fixed mobile CTA, toast notifications. Never on resting page content.

---

## Layout & Bold Modular Blocks

### Section Padding Scale

| Breakpoint | Section vertical padding | Block gap |
|------------|--------------------------|-----------|
| Desktop ≥1180px | `128px` | `96px` |
| Laptop 1024–1179px | `112px` | `80px` |
| Tablet 768–1023px | `96px` | `64px` |
| Mobile <768px | `72px` | `48px` |

### Spacing Tokens

| Token | Value |
|-------|-------|
| `--space-1` | `8px` |
| `--space-2` | `16px` |
| `--space-3` | `24px` |
| `--space-4` | `32px` |
| `--space-5` | `40px` |
| `--space-6` | `48px` |
| `--space-8` | `64px` |
| `--space-10` | `80px` |
| `--space-12` | `96px` |
| `--space-16` | `128px` |

### Bold Modular Block Pattern

iOS 26 premium feel comes from **few large blocks, each self-sufficient**, not many small elements tightly packed.

```
┌────────────────────────────────────────────┐
│   MODULE A — Hero                          │
│   radius: 32px · height: 800–1000px        │
│   Ink bg + Champagne eyebrow + Darky 900   │
└────────────────────────────────────────────┘
              ↕ 96–128px breathing
┌────────────────────┐  ┌────────────────────┐
│   MODULE B (28px)  │  │   MODULE C (28px)  │
│   Surface or Cat-  │  │   Champagne Cere-  │
│   color themed     │  │   monial moment    │
└────────────────────┘  └────────────────────┘
              ↕ 96px
┌────────────────────────────────────────────┐
│   MODULE D — Feature strip (32px)          │
└────────────────────────────────────────────┘
```

### Module Block Spec

- Radius: `28px` (sub-module) or `32px` (hero module)
- Internal padding: `48–80px` desktop / `24–32px` mobile
- Background: neutral (`--surface`, `--surface-2`, `--ink`) or category-themed full-bleed
- Max 2–3 modules per viewport row (never 4+ dense grid)
- Each module carries: 1 eyebrow + 1 title + 1 primary CTA or hero KPI

### Sticky Right-Rail Detail Page Pattern

Used on campaign detail, merchant detail, moderation detail pages.

- Left column: main content (~58% width)
- Right column: sticky conversion panel (~36% width, 6% gutter)
- Panel: `--r-2xl` radius, `--shadow-3`, pinned `120px` below viewport top on scroll
- Mobile: panel collapses to bottom-fixed glass CTA bar with price/KPI + primary button

### Grid & Max Width

- Max content width: `--content-width: 1180px`; wide showcase may use up to `1440px`.
- Listing feed grid: 1 col mobile, 2 col ≥640px, 3 col ≥1024px, 4 col ≥1440px.
- Featured card spans 2 columns ≥1024px.

---

## Buttons (iOS 26 Hierarchy)

Seven variants. All use CS Genio Mono 14–16px weight 500–600. All press with `transform: scale(0.97)` + spring timing. All focus with `--shadow-focus`.

| Variant | Bg | Text | Radius | Padding | Usage |
|---------|-----|------|--------|---------|-------|
| **Primary Filled** | `--brand-red` | white | `14px` | `14 × 24px` | Core CTA: Apply, Launch, Reserve |
| **Ink Filled** | `--ink` | white | `14px` | `14 × 24px` | Main action, non-brand: Save, Submit, Next |
| **Champagne Filled** | `--champagne` | `--ink` | `14px` | `14 × 24px` | Premium moment: Partner invite, Featured action |
| **Category Filled** | `var(--cat-*)` | white | `14px` | `14 × 24px` | Action within a category context only |
| **Glass Secondary** | `--glass-bg` + blur | `--ink` | `14px` | `14 × 24px` | Overlay buttons, floating actions |
| **Ghost Tertiary** | transparent + `1px solid --hairline-2` | `--ink` | `14px` | `12 × 20px` | Cancel, secondary, inline actions |
| **Pill Primary** | `--brand-red` | white | `50vh` | `14 × 28px` | Mobile bottom-fixed CTA, sticky floating |
| **Icon Circle** | `--surface-3` or `--glass-bg` | `--ink` | `50%` | `40×40` or `44×44` | Back, share, wishlist, carousel arrow |
| **Destructive** | `--brand-red` | white | `14px` | `14 × 24px` | Delete, cancel subscription |

### Button Common Behaviors

- **Press**: `transform: scale(0.97)` + `cubic-bezier(0.34, 1.56, 0.64, 1)` 180ms (Primary/Ink get `scale(0.96)` — slightly heavier)
- **Hover**: background darkens 6% (or `*-deep` variant if defined)
- **Focus**: `--shadow-focus` 4px outer ring (keyboard nav)
- **Disabled**: `opacity: 0.4`, cursor `not-allowed`, no press animation
- **Loading**: replace label with spinner, keep width stable
- **Icon+Label**: 8px gap between icon and text, icon 18px

---

## Motion

### Technology Stack (preserved)

- GSAP + ScrollTrigger for scroll-driven animation
- Lenis for smooth scrolling physics
- Framer Motion or CSS keyframes for component-level motion

### Keyframe Tokens

| Keyframe | Duration | Easing | Usage |
|----------|----------|--------|-------|
| `shimmer` | 1.5s loop | linear | Skeleton loading |
| `pulse` | 1.8s loop | ease-in-out | Active status dot, live indicator |
| `fadeIn` | 300ms | ease forwards | Card / section entrance |
| `scrollReveal` | 700ms | cubic-bezier(0.22, 1, 0.36, 1) | Section entrance on scroll (translateY(40px) → 0) |
| `stickyGridItem` | 500ms | cubic-bezier(0.22, 1, 0.36, 1) | Sticky grid child reveal |
| `feedCardIn` | 500ms | cubic-bezier(0.22, 1, 0.36, 1) | Feed card entrance with stagger |
| `scoreRingFill` | 1s | cubic-bezier(0.4, 0, 0.2, 1) | Score ring stroke |
| `progressFill` | 800ms | ease-out | Progress bars |
| `badgeShimmer` | 2.8s loop | linear | Closer / Partner tier badge shimmer |
| `obsidianPulse` | 2.4s loop | — | Partner tier pulse ring |
| `modalSlideUp` | 360ms | cubic-bezier(0.32, 0.72, 0, 1) | Modal entrance (iOS-native) |
| `sheetSlideUp` | 420ms | cubic-bezier(0.32, 0.72, 0, 1) | Bottom sheet entrance |

### iOS 26 Spring Timing (core curves)

```css
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);   /* interactive press, hover lift */
--ease-ios:       cubic-bezier(0.32, 0.72, 0, 1);       /* modal, sheet, iOS-native feel */
--ease-out-soft:  cubic-bezier(0.22, 1, 0.36, 1);       /* scroll reveal, long transitions */
```

### Micro-Interactions

| Interaction | Property | Duration | Easing |
|-------------|----------|----------|--------|
| Card hover lift | `translateY(-4px)` + `--shadow-1` | 420ms | `--ease-spring` |
| Image hover zoom | `scale(1.08)` | 600ms | `--ease-out-soft` |
| Primary button press | `scale(0.96)` | 180ms | `--ease-spring` |
| Ghost button press | `scale(0.97)` | 180ms | `--ease-spring` |
| Modal open | opacity 0→1 + `translateY(24px) → 0` | 360ms | `--ease-ios` |
| Bottom sheet slide | `translateY(100%) → 0` | 420ms | `--ease-ios` |
| Link underline slide | width `0 → 100%` from left | 300ms | ease |

### Motion Rules

- Animate only `transform` and `opacity`. Never `width` / `height` / `top` / `left`.
- `will-change: transform` only on frequently animated elements.
- Respect `prefers-reduced-motion: reduce` — disable all animations.
- Entrance animations ≤ `700ms`. Looping animations feel calm, never twitchy.
- Scroll-driven animations use GSAP ScrollTrigger (not CSS-only) for precision.

---

## Tier Identity System (v7 — remapped for Ink + Champagne palette)

Creator 6-tier retains the material metaphor (Clay / Bronze / Steel / Gold / Ruby / Obsidian). Visuals follow a **grayscale ladder with Flag Red and Champagne capstones**: the first four tiers progress through Ink shades (cool, pre-contract, accumulating gravity); Closer is the first appearance of `--brand-red` (brand commitment); Partner closes with Ink + Champagne ceremonial border (the anchor).

### Tier → Color Mapping

| Tier | Material | Bg | Text | Accent | Animation |
|------|----------|-----|------|--------|-----------|
| Seed | Clay | `--surface-2` | `--ink-4` | `2px dashed --hairline-2` border | — |
| Explorer | Bronze | `--ink-6` (`#cfcfcf`) | `--ink-2` | — | — |
| Operator | Steel | `--ink-4` (`#6a6a6a`) | white | — | — |
| Proven | Gold | `--ink-2` (`#1f1f1f`) | white | — | — |
| Closer | Ruby | `--brand-red` (`#c1121f`) | white | — | `badgeShimmer 2.8s` |
| Partner | Obsidian | `--ink` (`#0a0a0a`) | white | `3px --champagne` left-border | `badgeShimmer 2.4s` + `obsidianPulse` |

### Semantic Progression

- Seed → Explorer → Operator → Proven — cool grayscale deepening ("earning gravity, still pre-contract")
- Proven → Closer — **first appearance of Flag Red** ("crossed the contract threshold, now brand inner circle")
- Closer → Partner — Ink deepest + Champagne capstone ("ceremonial senior, the anchor")

### WCAG AA Contrast Check

| Tier | Bg | Text | Contrast | Pass |
|------|-----|------|----------|------|
| Seed | `#f5f3ee` | `#6a6a6a` | 4.6:1 | AA normal |
| Explorer | `#cfcfcf` | `#1f1f1f` | 11.0:1 | AAA |
| Operator | `#6a6a6a` | `#ffffff` | 5.8:1 | AA |
| Proven | `#1f1f1f` | `#ffffff` | 16.0:1 | AAA |
| Closer | `#c1121f` | `#ffffff` | 7.1:1 | AA + AAA large |
| Partner | `#0a0a0a` | `#ffffff` | 20.0:1 | AAA |

### Badge Component Spec

- Font: CS Genio Mono `10px` weight `700` uppercase, `letter-spacing: 0.08em`
- Padding: `5px 12px`
- Radius: `--r-sm` (`8px`)
- Format: `[Material] · [Tier Name]` — e.g., `Steel · Operator`
- Icon: 14×14px SVG to the left of text (material-specific)
- Closer + Partner badges use `badgeShimmer` animation

### Badge Variants

| Variant | Bg | Text | Border | Animation |
|---------|-----|------|--------|-----------|
| `.badge-clay` | `--surface-2` | `--ink-4` | `1.5px dashed --hairline-2` | — |
| `.badge-bronze` | `--ink-6` | `--ink-2` | none | — |
| `.badge-steel` | `--ink-4` | white | none | — |
| `.badge-gold` | `--ink-2` | white | none | — |
| `.badge-ruby` | `--brand-red` | white | none | `badgeShimmer 2.8s` |
| `.badge-obsidian` | `--ink` | white | `3px solid --champagne` left | `badgeShimmer 2.4s` |

### Tier Card Header (border-top accent)

| Tier | Accent |
|------|--------|
| Clay | `3px dashed --hairline-2` |
| Bronze | `3px solid --ink-6` |
| Steel | `3px solid --ink-4` |
| Gold | `3px solid --ink-2` |
| Ruby | `3px solid --brand-red` |
| Obsidian | `4px solid --champagne` |

### Progression Rail (TierJourney)

- 6 nodes on horizontal rail
- Node: `48px` square (`--r-sm` radius), tier-color fill, Darky `14px` weight `800` number (01–06)
- Label below: CS Genio Mono `11px` weight `700` uppercase (tier name)
- Sub-label: CS Genio Mono `9px` `--ink-5` uppercase (material name)
- Score threshold: CS Genio Mono `10px` `--ink-5`
- Connecting line: `2px solid --hairline` between nodes
- Seed node: dashed border, transparent fill
- Partner node: `obsidianPulse` animation + Champagne border

```css
@keyframes obsidianPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(191, 161, 112, 0.4); }
  50%      { box-shadow: 0 0 0 8px rgba(191, 161, 112, 0); }
}
```

---

## Reusable UI Patterns

### Navbar (Creator / Merchant)

- Height: `56px`
- Background: `--glass-bg` with `--glass-blur` on scroll; solid `--surface` at top
- Border-bottom: `1px solid --hairline` on scroll
- Logo: Darky, `1.625rem`, weight `900`, italic, `letter-spacing: -0.06em`, with `2px` `--brand-red` underline accent
- Nav links: CS Genio Mono, `0.8125rem`, weight `700`, uppercase, `letter-spacing: 0.06em`
- Active link: `--brand-red` text + `2px` bottom underline (not left border)
- Right section: separated by `--hairline` vertical divider
- Avatar: `36px` circle, `2px --brand-red` outline ring on hover
- Tier badge inline: see Tier Identity System
- Mobile: collapses to hamburger at `768px` with slide-in drawer

### Homepage Hero

- Full-viewport height (or `min-height: 720px`)
- Background: `--surface` page + optional full-bleed image at `--r-3xl` below
- Eyebrow: CS Genio Mono `11px` uppercase weight `700`, `--brand-red`, `0.12em` tracking
- Numbered marker: CS Genio Mono `14px` `01 /` format, `--ink-5`
- Headline: Darky `clamp(72, 14vw, 200)` weight `900`, `-0.07em` tracking, `--ink`
- Subtitle: CS Genio Mono `18px` `--ink-3`
- Stats bar (optional): 3 stat blocks, Darky `clamp(48, 6vw, 80)` weight `200` for numbers (weight contrast with headline 900), CS Genio Mono `14px` `--ink-4` labels
- CTA row: Primary Filled + Ghost Tertiary pair

### Page Header Bar

- Height: `48px`
- Background: `--surface`
- Border-bottom: `1px solid --hairline`
- Title: CS Genio Mono weight `600` `--ink`
- Meta: CS Genio Mono `13px` `--ink-4`

### Campaign Card (category-aware)

Editorial magazine-cover card. **Category color only in card chrome; background image carries the subject.**

- Hero image: `240px` height (`256px` on ≥1200px), `object-fit: cover`, `--r-xl` top corners
- Category color strip: 3px top-border in `var(--cat-<category>)`
- Soft gradient overlay: `linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.55) 100%)`
- Payout badge: top-left flush, Darky `1.1rem` weight `900`, white on `rgba(10,10,10,0.75)` pill bg with `--r-sm` radius
- Meta chips: `--glass-bg` + `--glass-blur`, CS Genio Mono `9px` weight `600` uppercase
- Card body:
  - Category label: CS Genio Mono `10px` weight `800` uppercase `0.12em` tracking, `var(--cat-<category>)`
  - Business meta: CS Genio Mono `10px` weight `600` uppercase `--ink-5`
  - Title: Darky `1.18rem` (`1.22rem` desktop) weight `900`, `-0.035em`, `--ink`, 2-line clamp; on hover → `--brand-red`
  - Footer: deadline + spots + Apply CTA
- Deadline urgency: warning → `var(--cat-*-tint)` bg; urgent → `--brand-red-tint` bg + pulse
- Card container: `--r-xl` radius, `1px solid --hairline`, no shadow at rest, `--shadow-1` on hover
- Hover: `translateY(-4px)` over 420ms `--ease-spring`
- Image hover: `scale(1.08)` over 600ms
- Apply CTA: Ghost Tertiary → on hover fills `--brand-red` with white text

### Feed Grid (Discovery)

- Grid: 1 col mobile, 2 col ≥640px, 3 col ≥1024px, 4 col ≥1440px
- Featured card: first card spans 2 columns ≥1024px
- Row gap: `24px` base, `32px` ≥1024px, `40px` ≥1440px
- Card entrance: `feedCardIn` 500ms with staggered delays (0–900ms), `translateY(32px) scale(0.97)` origin
- Gradient fade: `160px` multi-stop gradient curtain from transparent to `--surface`
- Progress bar: full-width `2px` track with `--brand-red` fill, `400ms` animated width
- Showing count: CS Genio Mono `13px` weight `800` tabular-nums, editorial slash separator
- Load more button: `56px` height, full-width, Ghost Tertiary variant; hover → `--brand-red` border + `--brand-red-tint`
- Back to top: `48px` circle, `--ink` bg, white icon; hover → `--brand-red` with soft glow; `--r-full`
- Sticky Grid Scroll variant: for showcase pages, wrap in sticky container with GSAP ScrollTrigger progressive reveal

### Filter Bar

- Background: `--glass-bg` + blur (sticky on scroll) or `--surface` (resting)
- Border-bottom: `1px solid --hairline`
- Radius: `--r-xl` (wrapping pill container) or `0` bottom when edge-to-edge
- Search input: `48px` height, `--r-md` radius, `2px solid --hairline`; focus → `--brand-red` border + `--shadow-focus`; CS Genio Mono placeholder
- Result count: Darky `20px` weight `800` `--ink` + CS Genio Mono `11px` weight `600` uppercase `--ink-4`
- Sort dropdown: Ghost Tertiary with sort icon prefix, `--r-lg` menu
- Filters button: Ghost Tertiary, `34px` height; active → `--brand-red` border + `--brand-red-tint`; count badge: `18px` circle (`--r-full`), `--brand-red` bg, white text
- Filter chips: `--r-pill`, `--surface-2` bg, `--ink` text; active → `--brand-red` bg, white text
- Global shortcut: `/` focuses search input
- Collapses to stacked layout on mobile with `40px` min touch targets

### Login Page

- Split panel layout: 50/50 desktop, single-column mobile
- Left panel: `--ink` bg, full-bleed, `--r-3xl` outer radius (desktop only), large Darky 900 logo, subtitle CS Genio Mono, `--brand-red` accent stat bars
- Right panel: `--surface` bg, centered form card `--r-2xl` + `--shadow-2`, max-width `440px`, CS Genio Mono labels
- Inputs: `--r-md`, `1px solid --hairline`, focus → `--brand-red` border + `--shadow-focus`
- Primary button full-width Pill Primary

### ContentCard (Creator Portfolio)

Four variants, all `--r-xl` radius, `1px solid --hairline`, `--shadow-1` on hover, `translateY(-6px)` lift.

- **image**: Full-bleed 4:3 aspect, hover overlay reveals campaign title + merchant name + star rating
- **instagram**: Gradient icon, post shortcode in CS Genio Mono, `border-top: 3px solid #e1306c`
- **tiktok**: TikTok icon, `border-top: 3px solid --ink`
- **link**: Chain-link icon in `--ink-4`, hostname in CS Genio Mono
- Feature button: `26×26px`, `--warning` (amber `#ff9500`) on active

### Portfolio Management Page

Creator's `/creator/portfolio`:

- Featured bar: `--warning`-tint banner (`rgba(255, 149, 0, 0.08)`), `--r-xl`
- Filter chips: pill `--r-pill` (see Filter Bar)
- "Add External Work" form: CS Genio Mono labels, max-width `520px`, inputs `--r-md`
- External work list: full-width rows with `--hairline` separators, "Remove" in `--brand-red`

### InviteCreatorModal (3-step wizard)

- Modal: `--r-2xl`, `--shadow-3`, `--surface` bg
- Backdrop: `rgba(10, 10, 10, 0.5)` with `blur(12px)`
- Step indicator: 3 dots (`8px` `--r-full`); active stretches to `20px` wide in `--brand-red`; completed in `--ink-4`
- Creator strip: `--surface-2` bar `--r-md` with CS Genio Mono name/handle + inline tier badge
- Step 1: radio campaign rows with tier badge + slot availability badge, `--r-md` row container
- Step 2: textarea `--r-md`, CS Genio Mono, char counter turns `--brand-red` at 180+
- Step 3: bordered summary card `--r-md`; Send Invite uses Primary Filled
- Error banner: `--brand-red-tint` bg, `1px solid --brand-red-deep`, `--r-md`

### Outreach Dashboard

Merchant `/merchant/outreach`:

- Stats row: 4-column grid, cards `--r-xl`, `--shadow-1`; collapses 2×2 at ≤900px
- Table: `36×36` avatar with tier-colored border, CS Genio Mono name/handle/tier
- Status badges (`--r-pill`, uppercase CS Genio Mono):
  - `pending` — `--surface-3` bg, `--ink-3` text
  - `accepted` — `--success` tint bg, `--success` text
  - `declined` — `--brand-red-tint` bg, `--brand-red` text
- Creator mini-card: `40×40` avatar, CS Genio Mono name, tier pip + score

### Template Selector

Pre-filled starting point picker for wizards:

- 2–3 column card grid, cards `--r-xl`, `1px solid --hairline`
- Icon + Darky name + CS Genio Mono description
- "Start from scratch" dashed-border separator card
- Goal-type color chips (category-aware when known):
  - `trial` → `--brand-red`
  - `off_peak` → `--cat-travel`
  - `soft_launch` → `--cat-fashion`
  - `sampling` → `--cat-beauty`
  - `event` → `--cat-ent`

### Usage Warning Banners

- Radius: `--r-lg`
- **Amber warning** (≥80%): bg `rgba(255, 149, 0, 0.08)`, border `1px solid --warning`, text `#7a4500`
- **Red danger** (≥100%): bg `--brand-red-tint`, border `1px solid --brand-red`, text `--brand-red`
- Layout: icon + CS Genio Mono message + auto-margin CTA link
- `role="alert"` for a11y

### PlanCard (Billing)

- Card: `--r-xl`, `1px solid --hairline`, `--shadow-1`
- Current plan: `2px solid --brand-red`, `--brand-red-tint` bg
- Most Popular: `border-top: 3px solid --ink` accent
- Price: Darky `2rem` weight `900`; CS Genio Mono `/mo` suffix `--ink-5`
- Feature list: check icon in `--success`
- Upgrade CTA: full-width Primary Filled

### Billing Page Layout

- Top: 2-column (plan + payment/usage), collapses at `720px`
- Usage bars: `--ink` fill → `--warning` at ≥80% → `--brand-red` at ≥90%
- Invoice table: CS Genio Mono, status pills with `6px` dot (`--r-full`)
- Cancel modal: retention offer first (Champagne tone), then confirm (Destructive)

### TierJourney

See Tier Identity System above. Horizontal rail of 6 tier nodes from Seed/Clay → Partner/Obsidian.

### FirstCampaignGuide

Onboarding for 0-campaign creators:

- Full-width banner `--r-xl`, `--surface-2` bg with `3px top-border --brand-red`
- Darky headline + CS Genio Mono body
- 3-step checklist: Apply → Visit → Publish
- Dismissible `×` button (top-right, `--r-full`)
- Rendered above feed, not in modal

### SearchBar (Global)

- Full-width input, CS Genio Mono, magnifying glass icon in `--ink-4`
- `--r-md`, `1px solid --hairline`
- Focus: `--brand-red` border + `--shadow-focus`
- Debounced 300ms
- Dropdown: `--surface` bg, `--r-lg`, `--shadow-2`, `--hairline` border

### MobileNav

Bottom fixed ≤768px:

- `56px` height, full-width, `--glass-bg` + `--glass-blur`
- Border-top: `1px solid --hairline`
- 4–5 icon+label items
- Active: `--brand-red` icon + label color, `--r-sm` tinted pill background behind icon
- CS Genio Mono labels: `10px` weight `600` uppercase
- Safe-area-inset-bottom padding for iOS

### HealthDashboard

- 2×2 or 3-column metric card grid
- Cards `--r-xl`, `--shadow-1`
- Darky metric value: `2rem` weight `700`
- CS Genio Mono label: `12px` uppercase `--ink-4`
- Trend arrow: `--success` up, `--brand-red` down
- Sparkline: inline SVG `80×32`, `stroke: --brand-red`, no fill

---

## Loading States

- `.skeleton` utility class from `globals.css`
- Match exact dimensions of real counterpart
- Skeleton radius: matches element radius (card `--r-xl`, button `--r-lg`, text `--r-sm`)
- No borders or shadows on skeletons
- Stack multiple lines for text blocks (`200px + 160px + 120px`)

### Loading Hierarchy

1. Route segment: `loading.tsx`
2. Section: `<Suspense fallback={<SkeletonComponent />}>`
3. Inline: skeleton divs in component's loading branch

---

## Error Boundaries

- React Error Boundaries for client components that may throw
- Fallback: `.empty-state` with exclamation icon, short message, retry button
- Retry button: Ghost Tertiary
- Never show raw stack traces to end users

---

## Toast Notifications

- Position: fixed bottom-left, `bottom: 24px; left: 24px`
- Max 3 visible; auto-dismiss at 4s
- Width: `320px` max
- Container: `--glass-bg` + `--glass-blur`, `--r-xl`, `--shadow-2`, `border-left: 4px solid <variant-color>`
- Variants:
  - `success`: `--success`
  - `error`: `--brand-red`
  - `warning`: `--warning`
  - `info`: `--ink`
- Dismiss: `×` button (Icon Circle, `--r-full`); click elsewhere does NOT dismiss
- Animation: slide in from left over `420ms --ease-ios`, fade out on dismiss

### Confirm Dialogs

- Overlay: `rgba(10, 10, 10, 0.5)` + `blur(12px)`
- Panel: `--surface` bg, `--r-2xl`, `--shadow-3`, max `440px` width
- Header: variant-color icon + Darky title
- Body: CS Genio Mono in `--ink-3`
- Actions: Ghost "Cancel" + Primary/Destructive "Confirm"
- Full-width on mobile

---

## Responsive Breakpoints

| Name | Value | Target |
|------|-------|--------|
| xs | `375px` | iPhone SE, small phones |
| sm | `640px` | Large phones, small tablets |
| md | `768px` | Tablets, MobileNav threshold |
| lg | `1024px` | Laptops, sidebar layouts |
| xl | `1180px` | Content max-width |
| 2xl | `1440px` | Wide showcase |

### Breakpoint Rules

- Mobile-first: base styles target `375px+`, layer complexity upward
- ≤768px: hide `.desktop-only`, show `.mobile-only`, collapse grids to 1 col, show MobileNav, sticky panels → bottom CTA bar
- ≤640px: reduce padding to `--space-2`, stack form grids, full-width buttons
- ≤375px: reduce headline scale, reduce card padding to `--space-1`

---

## SaaS Template Patterns (Structural Blueprint)

Structural patterns from `saas-company-website-template/`. Full details in `push-ui-template` skill. Use Push tokens from above sections — these patterns define **how** to build pages, not colors/fonts.

### Page Structure Blueprint

```
header.header → Sticky nav (Headroom hide on scroll-down, pin on scroll-up, offset 500px)
  hero section → Full-viewport split (text left + media/Lottie right)
main
  content sections → Optional decorative SVG shapes (absolute, z-index: -1)
  join/CTA section → Counter animation embedded in headline
  testimonials → Swiper carousel + ticker marquee
footer → Logo, nav links, socials, back-to-top
```

### Section Layout Patterns

| Pattern | Structure | Used For |
|---------|-----------|----------|
| Split Hero | `d-xl-flex` → text (typewriter h1 + CTA) + Lottie media | Landing pages |
| Numbered About | Image left + numbered list (01, 02) right | How it works |
| Icon Card List | 4 vertical cards with stagger | Services, features |
| Stats Counter | 3 counter blocks around central image + parallax | Social proof |
| Challenges Grid | Header left + 6-item numbered grid (2×3) right | Problem/solution |
| Video Embed | Poster + play → YouTube popup | Demo |
| CTA + Counter | Counter in headline + checkmarks + button | Conversion |
| Testimonial + Ticker | Swiper above + full-bleed marquee below | Social proof |
| Pricing 3-Column | 3 equal cards + features | Plans |
| Collapsible Table | Header left + expandable rows right | Feature comparison |
| Blog Filter Grid | Shuffle.js filter buttons + responsive grid | Discovery |
| Article + Share | Floating share panel + narrow text + progress | Long-form |
| FAQ Accordion | Bootstrap collapse, first open, arrow rotation | FAQ |
| Form + Lottie | Form left + Lottie animation right | Contact, signup |

### Interaction Library Stack

| Library | Purpose |
|---------|---------|
| GSAP + ScrollTrigger | Scroll-driven animation |
| Lenis | Smooth scrolling physics |
| AOS | Simple animate-on-scroll |
| Swiper | Carousels |
| CountUp.js | Number counter |
| Headroom.js | Smart sticky header |
| Shuffle.js | Filterable grid |
| Lottie Player | JSON vector animations |
| SweetAlert2 | Modal popups |
| Vanilla LazyLoad | Image lazy loading |
| ProgressBar.js | Animated progress indicators |

### Data Attribute System

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-text` | Typewriter source | `data-text="Your headline"` |
| `data-value` | Counter/progress target | `data-value="8100"` |
| `data-prefix` / `data-suffix` | Counter formatting | `data-prefix="0"` → "01" |
| `data-separator` | Thousands separator | `data-separator=","` |
| `data-aos` / `data-aos-delay` | Scroll animation | `data-aos="fade-up" data-aos-delay="100"` |

### Standard Transition Timing

| Duration | Usage |
|----------|-------|
| `180ms` | Button press (spring) |
| `300ms` | Form fields, links, underlines |
| `420ms` | Buttons, cards, hover lifts |
| `600ms` | Image zooms, hero transitions |
| `700ms` | Section scroll reveals |

### Decorative Shape System

Sections may include absolutely-positioned decorative SVGs:

- Container: `.section_shapes` (absolute, full-size, `z-index: -1`)
- Children: circles, ovals, lines — border-only or `opacity < 0.15`
- Pattern: left/right halves with big/small circle pairs
- Never interactive, purely visual depth
- Prefer `--hairline-2` or `--ink-5` for stroke color

---

## Design System Page

Internal showcase at `/design-system` (dev-only; 404 in production).

| Section | Contents |
|---------|----------|
| Colors | Foundation, brand, category, semantic swatches with CSS vars |
| Typography | Darky + CS Genio Mono type scale with metadata |
| Spacing | Visual spacer blocks for all `--space-*` tokens |
| Shadows | All `--shadow-*` token previews |
| Radii | All `--r-*` token previews |
| Components | Buttons, status pills, tier badges, score rings, skeletons |
| Icons | SVG icon gallery |
| Forms | Input, textarea, select, checkbox, radio |
| Animations | Live demos of all keyframes |

Floating `DS` button (`--brand-red`, fixed bottom-right `24px`, Icon Circle, `zIndex: 9999`) links to this page in dev mode.

---

## Dependencies (Design-Related)

| Package | Purpose | Required For |
|---------|---------|--------------|
| GSAP | Scroll-driven animation, ScrollTrigger | Sticky Grid Scroll, scroll reveals |
| Lenis | Smooth scrolling physics | Global smooth scroll |
| Material Symbols | Icon system | Nav, UI icons |

Install: `npm install gsap lenis`

Register GSAP ScrollTrigger at app entry:

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

---

## Migration Notes (v6 → v7)

When touching existing code, migrate in this order:

1. **CSS variables** — rename `--primary` → `--brand-red`, `--dark` → `--ink`, `--tertiary` → `--ink-4` (where used for secondary text) or `--brand-red` (where used for links), `--accent` (old Molten Lava) → remove. Old `--surface` Papaya Whip → `--surface` Ivory (`#fbfaf7`).
2. **Radii** — replace every `border-radius: 0` with the appropriate token from the Element-to-Radius Mapping table. Avatars / circles remain `50%`.
3. **Button shadows** — remove every `box-shadow: 3px 3px 0 ...` hard-offset shadow. Replace the button itself with the matching § Buttons variant.
4. **Tier visuals** — remap per Tier → Color Mapping table. `TierBadge.tsx` class names (`.badge-clay`, `.badge-bronze`, ...) remain; internal token references change.
5. **Category colors** — any page or component that displays listings by category should pick up `var(--cat-<category>)` for the card top-border and category label. Other chrome stays neutral.
6. **Type scale** — Darky display size `clamp(64,12vw,160)` → `clamp(72,14vw,200)`; tracking `-0.06em` → `-0.07em`. H2 weight 700 → 800.
7. **Shadows** — introduce `--shadow-1 / 2 / 3` tokens, retire all one-off `box-shadow` declarations.

The `app/globals.css` token block should be migrated in one PR; component CSS can follow incrementally.

---

---

# v8 · Editorial Bento Composition Layer

> **Status (2026-04-24):** Adds layout / composition primitives and a premium anti-cliché playbook on top of v7. **Does not introduce new tokens.** Every color, radius, shadow, font, and spacing value below is already defined in v7 sections above — this layer is *how to compose them like an editor, not like a SaaS template.*
>
> Reference DNA: **OFFtrail** (single warm accent + hard color-block sections + adventure photography), **Crème Curated** (texture as the only decoration, zero brand color, asymmetric stacks), **POISE** (intimate close-up photography, organic dividers, restrained handwritten accent). The goal is to feel **edited**, not configured.

---

## v7 → v8 Reconciliation Map

The Editorial Bento patterns appended in v7.5 used generic tokens (`--c1…c7`, `--r-sm/md/lg/xl`, `--shadow-md/lg`, `--font-display/text`). v8 maps every one of those to a v7 canonical token. **Use only the right-hand column.** The left column is gone.

| v7.5 generic (retired) | v8 canonical (use this) |
|---|---|
| `--bg` page color | `--surface` (`#fbfaf7` Ivory Warm White) |
| `--surface` cream card | `--surface-2` (`#f5f3ee` Pearl Stone) |
| `--ink` near-black | `--ink` (`#0a0a0a`) — already aligned |
| `--ink-inv` warm cream on dark | `--surface` on dark — invert the surface, do not invent a token |
| `--c1` orange-red punch | `--brand-red` (`#c1121f`) |
| `--c2` lemon / fluoro | **not allowed** — Push has no fluorescent accent. Use `--champagne` (`#bfa170`) for the ceremonial moment instead. |
| `--c3` candy pink | `--cat-beauty` (`#b5807f`) — only inside Beauty category context |
| `--c4` deep teal / navy | `--cat-travel` (`#4a7a8c`) — only inside Travel category context |
| `--c5` olive / sage | `--cat-fitness` (`#7a8d6e`) — only inside Fitness category context |
| `--c6` mystery purple | `--cat-fashion` (`#5d4a6b`) — only inside Fashion category context |
| `--c7` warm kraft | `--surface-3` (`#ece9e0` Bone) — neutral muted block |
| `--r-sm` 10px | `--r-sm` (`8px`) — keep token name, value follows v7 iOS 26 |
| `--r-md` 16px | `--r-md` (`12px`) |
| `--r-lg` 24px | `--r-xl` (`20px`) for cards · `--r-2xl` (`28px`) for bento blocks |
| `--r-xl` 32px | `--r-3xl` (`32px`) — hero only |
| `--r-pill` 999px | `--r-pill` (`50vh`) |
| `--shadow-md` decorative | `--shadow-1` (resting card hover) |
| `--shadow-lg` decorative | `--shadow-2` or `--shadow-3` (modal / sticky) — never on a bento block at rest |
| `--font-display` (any sans) | `Darky` |
| `--font-text` (matching) | `CS Genio Mono` |
| `--gap` 8–12px | `--space-1` (`8px`) base · `--space-2` (`16px`) wide |
| `--pad` 20–24px | `--space-3` (`24px`) |
| `--pad-lg` 32–40px | `--space-4`–`--space-5` |

**Pattern-level conflicts resolved:**

1. *v7.5 Pattern 03 used `border-radius: 24px 24px 0 0`.* That violates v7's "no `border-radius: 0`" rule. v8 **rewrites** Pattern 03 — see below — using full `--r-xl` on every card with negative-margin overlap to keep the stacked-paper metaphor.
2. *v7.5 Pattern 04 was a candy-color jigsaw with white text forbidden.* v8 **rewrites** as Linked Card Train using category tints (`--cat-*-tint`) with Ink text — same overlap charm, on-brand color, AA-passing contrast.
3. *v7.5 said "可加一款 display serif 做日期/星期".* **v8 vetoes.** Two-font rule from v7 is non-negotiable. Use Darky weight contrast (e.g., 200 ExtraLight numerals next to 900 Black headline) for editorial feel — that *is* the Push signature.

---

## Why Editorial Bento (one paragraph)

A SaaS dashboard separates content with hairlines, gradients, and floating cards. An editorial layout separates content with **color, weight, and air**. v8 picks the editorial path: a few large bento blocks per viewport, each carrying one job; oversized numerals where charts would normally go; restrained photography where icons would normally go. The reaction-element rule (one playful object per section) keeps it from collapsing into stock-template silence.

---

## The 12-Column Bento Grid

Push v8's primary composition primitive. Use this *or* Bold Modular Blocks (§ Layout) — never both in the same section.

```css
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(80px, auto);
  gap: var(--space-1);              /* 8px desktop · 12px ≥1180px */
  max-width: var(--content-width);  /* 1180px */
  padding: 0 var(--space-3);
}

@media (min-width: 1180px) { .bento { gap: var(--space-2); } }
@media (max-width: 768px)  {
  .bento { grid-template-columns: repeat(6, 1fr); gap: var(--space-1); }
}
```

### Cell Spans (allowed)

| Span | Use | Notes |
|---|---|---|
| `2 cols × 1 row` | KPI chip, sparkline | Only inside dense bento; not standalone |
| `3 cols × 2 rows` | Stat block (`Numeral as Logo` pattern) | Pairs well with span-9 hero |
| `4 cols × 3 rows` | Standard tile (image + label + value) | Most common cell |
| `5 cols × 2 rows` | Wide tile (chart + caption) | Use sparingly — breaks 12-grid rhythm |
| `6 cols × full` | Half-bleed image · long-form text · category navigator | Pair with another 6 |
| `8 cols × 4 rows` | Hero tile (one big idea) | Dominant cell |
| `12 cols × 1 row` | Section-spanning ticker / divider photo | Once per page max |

### Rhythm Rule (the discipline)

**Adjacent cells must differ on at least 2 of these 3 axes:**

| Axis | Examples |
|---|---|
| Size | small (3-col) ↔ large (8-col) |
| Tone | warm category (`--cat-dining`, `--cat-ent`) ↔ cool category (`--cat-travel`, `--cat-fashion`) ↔ neutral (`--surface-2`, `--ink`) |
| Density | one oversized numeral ↔ a 6-row table ↔ a single photograph |

A bento section where every cell is the same size, in a similar tone, with similar density, *will* read as a SaaS dashboard. Differ on 2 axes per neighbor and the page reads as edited.

### Internal Bento Block Spec

- **Radius:** `--r-2xl` (`28px`) on every cell. No exceptions, no zero corners.
- **Padding:** `--space-3` (`24px`) base · `--space-4` (`32px`) on cells ≥ 6 cols · `--space-6` (`48px`) on hero (8-col).
- **Border:** `1px solid --hairline` only on neutral surface cells. Color-filled cells (Ink, Brand Red, Champagne, category) have no border — color *is* the boundary.
- **Shadow:** **none at rest.** This is the v7 Reconciliation: bento blocks rely on color-block hierarchy, not elevation. Hover lift (`translateY(-2px) + --shadow-1`) is allowed only on cells that link to another page.
- **Internal alignment:** label / eyebrow top-left, primary numeral or photograph centered, unit / metadata pinned to bottom-right. Never center-stack everything.

---

## Numeral as Logo (the v8 hero pattern)

The single most recognizable Push-v8 move. Inherits Darky weight contrast from § Typography.

> One number per viewport gets sized as if it were the brand mark. Everything else compresses around it.

| Role | Font | Size | Weight | Tracking | Color |
|---|---|---|---|---|---|
| **Hero numeral** | Darky | `clamp(96px, 14vw, 200px)` | `900` | `-0.07em` | `--ink` (or category color when inside category context) |
| **Counter-numeral** (paired smaller) | Darky | `clamp(48px, 6vw, 80px)` | `200` (ExtraLight) | `-0.04em` | same family |
| **Label / unit (right-pinned)** | CS Genio Mono | `11px` | `700` | `+0.18em` (uppercase) | `--ink-4` |
| **Caption (one line max)** | CS Genio Mono | `13px` | `400` | `0` | `--ink-3` |

**Weight contrast 900 ↔ 200 between two numerals in the same tile is the Push editorial signature.** Borrowed from Strava year-in-review treatment, locked to Darky's full weight ladder. Do not skip the ExtraLight; without the contrast it reads as "big number" not "edited".

**Where to use:**
- Campaign hero (payout amount as the logo)
- Creator profile (lifetime visits attributed)
- Merchant dashboard (this-week verified scans)
- Pricing tile (price as the hero, period as ExtraLight)

**Where NOT to use:**
- Inside form fields (data-input chrome stays calm)
- Tier badges (badge typography is locked, see § Tier Identity System)
- Anywhere there are already two oversized elements competing

---

## Color Block Hierarchy (no inner shadow)

Bento sections build depth through **color jumps, not elevation.** This is what separates editorial from SaaS.

### The Block Voicing System

| Block voice | Bg | Text | When |
|---|---|---|---|
| **Quiet** | `--surface` Ivory | `--ink` | Default cell, photography backdrop |
| **Hush** | `--surface-2` Pearl | `--ink-2` | Nested cells, alternating stripe |
| **Mute** | `--surface-3` Bone | `--ink-3` | Pre-state, disabled, neutral KPI |
| **Anchor** | `--ink` Ink | `--surface` Ivory (yes — invert, don't use white) | Hero, pricing CTA, "the result" |
| **Spark** | `--brand-red` | `#ffffff` (white is OK *only* on `--brand-red` and `--ink`) | One per viewport — primary CTA, live indicator, urgency |
| **Ceremony** | `--champagne` | `--ink` | Partner tier, award, "earned" moment — max 1 per viewport |
| **Category** | `var(--cat-*)` | white on dark cats / `--ink` on Beauty + Fitness tints | Only inside that category's context |
| **Category Tint** | `var(--cat-*-tint)` | `--ink` | Soft category context — filter row, badge background, supporting cell |

### The Section Composition Rule

Every bento section uses **one Anchor or Spark + one Ceremony (optional) + 60–80% Quiet/Hush.** That ratio is what makes Push read premium not hectic. Two Sparks side-by-side cancel each other out. Two Categories side-by-side is fine *only* if both categories belong to the same listing/campaign context.

### Why no shadow on bento cells

Shadow is a SaaS instinct. v8 cells sit on the page through (a) color contrast against `--surface`, (b) `--r-2xl` radius reading as a continuous-corner block, (c) `--hairline` border on neutral cells. Adding `--shadow-2` to a color-filled bento cell makes it look like a Figma component pasted onto a page — the worst possible signal. Shadows return on:

- **Floating-above-content surfaces** (`--shadow-3`): modals, sticky right-rail booking panel, mobile bottom CTA.
- **Hover lift on linkable cards** (`--shadow-1`): tightly scoped to cells with `cursor: pointer`.

---

## The 5 v8 Editorial Patterns (all v7-compliant)

Each pattern is a layout primitive — composes from v7 tokens, no new variables. Companion runnable demos live at `design-patterns.html` (Pattern numbers map 1:1).

### Pattern 01 — Vertical Story Strip

For year-in-review, creator wrap, campaign recap, "earnings dropped" share-cards (9:16 or 1:2 portrait).

```
┌─────────────────────────────┐ Brand bar — `--ink` bg · CS Genio Mono 11px white
├─────────────────────────────┤
│  HEADER — `--surface`        │ Darky 900 headline · 1 line
├─────────────────────────────┤
│  USER — `--surface-2`        │ Avatar 56px · CS Genio Mono name
├──────────────┬──────────────┤
│  STAT A      │  STAT B      │ category color OR `--brand-red` · oversized numeral
│  (split)     │              │
├──────────────┴──────────────┤
│  STAT C — full bleed         │ `--cat-travel` (or any single category) · numeral 14vw
├─────────────────────────────┤
│  STAT D — full bleed         │ `--cat-fitness` · numeral
├─────────────────────────────┤
│  CTA — `--ink`               │ "See the full year →" Pill Primary on Champagne or Brand Red
└─────────────────────────────┘
```

**Rules:**
- Each strip ≥ 130px tall. No two adjacent strips are the same color.
- One **reaction element** per strip — small SVG (a circle, an arrow, a confetti dot, a tiny topographic line). Lives in the corner, max 64px, opacity ≤ 0.4. *Never an emoji.*
- Unit / label pinned **bottom-right**, CS Genio Mono 11px uppercase. Hours / Visits / $ Earned / Scans.
- Border-radius `--r-xl` (`20px`) on the outer container. Internal strips share the same outer radius — cropped by `overflow: hidden`. No internal border-radius:0.
- Export: html-to-png at 1080×2400 (9:20). PNG is the deliverable; never serve this layout as a live web page — it's a story card.

### Pattern 02 — Bento Dashboard

Product home, weekly digest, merchant pulse page, internal ops scoreboard.

```
12-column grid, --space-2 gap (16px ≥1180px)

┌──────────────────────────────┬──────────────┬──────────┐
│  HERO TILE   8 cols × 4 rows │ NAV   4 × 1  │  CTA 4×1 │
│  Numeral as Logo             ├──────────────┴──────────┤
│  --ink anchor                │  STAT       4 cols × 2  │
│                              │  +18.4%     `--cat-*`   │
│                              │                          │
├──────────────────┬───────────┴────────┬─────────────────┤
│  6 × 2  IMAGE    │ 4 × 2  TICKER LIST │ 2 × 2  DATE     │
│  full-bleed photo│ CS Genio Mono rows │ Darky 200 "17"  │
│  --r-2xl         │ separated by line  │ + caption       │
└──────────────────┴────────────────────┴─────────────────┘
```

**Rules:**
- Hero anchor (8×4) is **always** `--ink` background with `--surface` text + 1 numeral. Sets the tone for the rest of the bento.
- Exactly **one** Spark cell (`--brand-red`) — usually the CTA.
- Exactly **one** Ceremony cell (`--champagne`) **only if** there's a Partner / award / earned moment to celebrate. Otherwise omit.
- The "ticker list" cell (rows of CS Genio Mono numbers) is the density anchor — counterweights the oversized numeral. Required: every Bento Dashboard has at least one dense list cell.
- Image cell uses real photography (see § Premium Anti-Cliché — no stock illustration).
- Section breathing: `96px` above and below the bento. Bento doesn't bleed edge-to-edge; it sits inside the `--content-width: 1180px` rail.

### Pattern 03 — Stacked Receipt Feed (rewritten — no border-radius:0)

Transaction list, scan log, application timeline, message inbox. Replaces v7.5's broken `24px 24px 0 0` version.

```
Each row:
┌───────────────────────────────────────────────┐  --r-xl  (20px ALL corners)
│  [icon] CATEGORY    SCAN VALUE    →           │  CS Genio Mono 10px uppercase + Darky 22px
│  Merchant Name · 3:42pm                       │  CS Genio Mono 13px --ink-4
└───────────────────────────────────────────────┘

Stack with margin-top: -8px on every row except the first.
overflow: visible on the list container.
Each row: position: relative; z-index increases with index.
Hover row → translateY(-4px) + --shadow-1 (lifts the card OUT of the stack).
```

**Rules:**
- Row height `72px` (mobile) / `88px` (≥768px). All-corners `--r-xl`. The stack is built by **negative margin overlap of 8px**, not by zeroing the bottom corners. The `--shadow-1` inset on hover is what reveals the full radius beneath.
- Color: each row a different category tint (`--cat-*-tint`) or a quiet alternation between `--surface` ↔ `--surface-2`. **Never** a candy palette.
- Text: always `--ink` / `--ink-3`. Never white on tint (contrast fails).
- Last row: subtle gradient curtain `160px` from transparent → `--surface` to imply "more below" (CSS-only, no JS).
- Tap target: full row clickable; an Icon Circle (`44px`, `--r-full`) on the right grows the active state.

### Pattern 04 — Linked Card Train (jigsaw replacement)

Onboarding step cards, tier progression, multi-stage campaign timeline. Replaces v7.5's candy jigsaw.

```
┌──────────────────────────────┐
│  CARD A    `--cat-travel-tint` │
│  Ink text on tint background  │
│  Step 01 · "Apply"           │
└────────────●─────────────────┘  --brand-red 36px circle, vertically straddling
┌────────────●─────────────────┐
│  CARD B    `--cat-fitness-tint`│
│  Step 02 · "Visit"           │
└────────────●─────────────────┘
┌────────────●─────────────────┐
│  CARD C    `--cat-dining-tint` │
│  Step 03 · "Get paid"        │
└──────────────────────────────┘
```

**Rules:**
- Card radius `--r-2xl` (`28px`). Cards alternate quiet category tints.
- The link bead is a `36–40px` circle (`--r-full`), filled with `--brand-red`, pinned at `bottom: -18px; left: 50%; transform: translateX(-50%);` — straddles the boundary between two cards.
- Two beads vertically aligned read as one continuous spine; visually "links" the cards. *This is the v8 jigsaw — flat, brand-aligned, AA-passing.*
- Card text is **always Ink**. White text on tint = ban (contrast).
- On mobile, swap to horizontal scroll: cards `min-width: 280px`, scrollbar hidden, beads still pinned but rotated 90° (left/right walls).

### Pattern 05 — Editorial Hero Tile

The "magazine cover" home unit. Ranks above § Homepage Hero in the spec — when both apply, this wins.

```
8-col × 5-row tile, --r-3xl (32px), --ink background.

┌──────────────────────────────────────────────────────────────┐
│ [eyebrow]   01 / NEW THIS WEEK                                │  CS Genio Mono 11px champagne
│                                                                │
│   $4,200                                       [reaction-svg] │  Darky 900 14vw + 64px abstract shape
│   /MONTH                                                       │  Darky 200 ExtraLight 6vw
│                                                                │
│   The Brooklyn dinner crowd                                    │  Darky 700 36px --surface
│   pays out before payroll runs.                                │
│                                                                │
│   [Pill Primary: Apply Now]   [Ghost Tertiary: How it works]  │
└──────────────────────────────────────────────────────────────┘
```

**Rules:**
- One numeral. One photograph (optional, full-bleed right) OR one reaction-element SVG. Never both.
- No gradient background. Solid `--ink` fill, period.
- The reaction element is the editorial signature: a single hand-drawn-style SVG in `--champagne` or `--brand-red` at 64–96px — a topographic line, an off-axis circle, a hand-drawn arrow, a tiny mountain. Choose ONE motif per page and reuse it across the tile, the bento, the share card. **Never an emoji. Never a 3D render. Never a Lottie blob.**
- Hero copy: 1 numeral, 1 short headline (≤ 9 words), 2 buttons. If you're tempted to add a third sentence, delete the second.

---

## Premium Anti-Cliché Playbook

Eight moves drawn from OFFtrail / Crème / POISE references — translated to Push tokens. These are *the* difference between v8 reading as premium and reading as a Webflow template.

### 1 · One Warm Accent on Restrained Neutral

OFFtrail uses one golden accent on white + photography. Crème uses zero brand color, only texture. Push v8 already has the right palette — the discipline is restraint. **One Spark and at most one Ceremony per viewport.** If a screen has two Brand Red CTAs it's broken.

### 2 · Hard Section Color-Block Transitions

OFFtrail cuts from photography to `--ink` to color-block with no fade. v8 absorbs this: section-to-section uses **flat color jumps**, not gradient fades or shadow ramps. The page should feel *montaged*, not *scrolled*.

Implementation: alternate `--surface` → `--ink` → category-themed full-bleed → `--surface-2`. Each transition is a hard line. No `linear-gradient(to bottom, surfaceA, surfaceB)` between sections — that's the SaaS-template tell.

### 3 · Texture as the Only Decoration (Crème move)

Crème replaces decoration with a vertical-stripe texture in the background. v8 absorbs this through one **opt-in** texture: faint diagonal hatching at 3–5% Ink opacity, applied to *one* surface block per page maximum (typically the merchant-context section background). Never on the hero. Never animated.

```css
.texture-hatch {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(10,10,10,0.04) 0 1px,
    transparent 1px 6px
  );
}
```

Use for: merchant testimonial section background · "trusted by" strip · admin internal pages where the user dwells. Skip everywhere else.

### 4 · Tactile Close-Up Photography (POISE move)

Close-up photography reads premium because it implies a real photographer was there. Push v8 photography direction:

- **Hands and surfaces over faces.** A hand placing a phone on a register, a thumb on a QR code, a receipt with a coffee ring. Not a smiling stock-model headshot.
- **Natural light, mixed temperature.** Shoot at golden hour or against a window. Avoid evenly-lit studio softbox plate.
- **Crop tight.** 4:3 or 1:1 landscape; no full-body shots. Faces, when they appear, should be partial — half-frame, side-profile, mid-laugh.
- **One real merchant per page.** Real Williamsburg storefront names visible. *That* is what makes Push feel local.

Banned imagery: stock laptop-and-coffee flat lays, stock smiling team-of-four, stock cityscape blue-hour drone shots, AI-generated faces, AI-generated illustrations of people.

### 5 · Asymmetric Stack, Never Centered Hero

OFFtrail floats text over images. Crème tucks text into the texture corner. POISE crops and offsets. **Push v8 default home hero stops being centered.** The Editorial Hero Tile (Pattern 05 above) stacks left-aligned with the photograph (when present) bleeding off-axis to the right. Centered headline + centered subhead + centered CTA pair = retired.

### 6 · One Reaction Element Per Page (the editorial signature)

Each Push page picks **one** small hand-drawn-feeling SVG motif and reuses it 2–3 times across the page — once at hero scale (64–96px), once as a section accent (24–32px), optionally once as a stamp at the footer. Candidate motifs:

- A single off-circle / wobble-circle (Crème stripe energy)
- A topographic contour line (OFFtrail outdoors energy)
- A hand-drawn arrow with one curve (POISE handwritten energy)
- A receipt-paper jagged tear edge (Push native)
- A QR-code corner crop (Push native, instantly readable)

**Rules:** stroke-only SVG, `--ink` or `--champagne` color, max two strokes wide, never animated, never inside Lottie. The motif is a **stamp**, not a sticker.

### 7 · Display Type at 14–16% of Viewport Width

POISE and OFFtrail hero headlines read at ~12–16vw on desktop. Push's `clamp(72px, 14vw, 200px)` already nails this — the discipline is using it. Most teams quietly cap headlines at 64px. v8 says: **the hero numeral is the logo of the page.** If the headline doesn't make a stranger pause when they screenshot, it's too small.

### 8 · Handwritten / Editorial Accent — But Without a Third Font

POISE uses handwritten script for 1–2 word accents. v7 forbids a third font. v8's reconciliation: **use Darky 200 ExtraLight at huge scale as the editorial accent** — paired with Darky 900 at the same scale, the weight contrast does what the script font does in POISE. ExtraLight numerals next to Black headlines is *the* Push voice.

When you absolutely need a "handwritten" feeling — for a single signature, a single tier-name flourish, a single award stamp — use a **hand-drawn SVG**, not a font. (See move 6.)

---

## Five Anti-Cliché Bans (drawn from references)

These are now hard rules, not suggestions.

| Ban | Why | What to use instead |
|---|---|---|
| **No multi-stop linear gradients** as backgrounds (hero, section, button, modal) | Reads as 2024 SaaS template. None of the references use one. | Solid `--surface`, `--ink`, or category-fill blocks. Hard transitions. |
| **No 3D blob shapes, glass orbs, or Lottie hero animations** | Generic motion-designer cliché. | Static SVG reaction-element (move 6). |
| **No stock photography of teams smiling at laptops** | Strongest AI-slop tell. | Real merchant close-ups (move 4). |
| **No symmetric centered hero** (centered headline + sub + CTA) | Webflow default. | Editorial Hero Tile (Pattern 05) — left-aligned, asymmetric. |
| **No more than one Brand Red Spark or one Champagne Ceremony per viewport** | Two of either cancel each other out and read as visual panic. | Use Ink as the gravity. Spark / Ceremony is the punctuation, not the sentence. |

---

## Social & Engagement Tactics (Push-specific)

Push is a creator marketplace — design must feel *social* without sliding into TikTok-app aesthetics. Six moves that signal community without sacrificing premium:

1. **Real names, real faces, real handles.** Always show creator name + tier + score together as a unit (CS Genio Mono 11px tier, Darky 16px name, `--ink-5` 13px handle). Never "@user_842". When the system has no real data, show fewer cards rather than placeholder names.
2. **Live indicators are dots, not gifs.** A `6px` `--brand-red` filled circle with `pulse` keyframe (1.8s ease-in-out) next to a creator card = "live this hour." A green dot = "verified scan in last 24h." Both ride at the top-right of the card. No emoji.
3. **Scan-counter ticker.** A 12-col-spanning ticker strip (`--ink` bg, `--surface` text, CS Genio Mono uppercase) between sections that increments live: "23 scans verified in Brooklyn this hour · 4 creators paid out today · 1 Partner ceremony Friday." Updates every 30s. Implies the marketplace is alive — without showing fake activity.
4. **Creator quote in the merchant flow, merchant quote in the creator flow.** Cross-pollinate testimonials. Inside the merchant onboarding bento, surface a real creator's one-line quote (Darky 22px italic, photo 56px circle, handle CS Genio Mono). Inside the creator onboarding, surface a real merchant's. Both sides see the other side caring.
5. **Tier ceremony moments.** When a creator hits Closer or Partner, the dashboard renders a Ceremony cell (`--champagne` bg, the badge, the moment) with `obsidianPulse` keyframe for 6 seconds, then fades to a Hush cell. This is the only place gold appears for that user that day. Earned, ceremonial, *mentionable*.
6. **Share-card export everywhere.** Every dashboard tile has a tiny `Share` Icon Circle in the top-right (24px, `--ink-4`, hover `--brand-red`) that exports the tile as a 1080×1080 PNG using Pattern 01 voicing. Creators *will* post these. Make it one click.

---

## Decision Tree — Which Pattern, When?

```
What are you building?
│
├─ A share-card / weekly recap / annual review
│  └─ Pattern 01 — Vertical Story Strip
│
├─ A product home / merchant dashboard / weekly digest
│  ├─ Heavy data, multiple KPIs ──── Pattern 02 — Bento Dashboard
│  └─ Editorial moment, one big idea ─ Pattern 05 — Editorial Hero Tile
│
├─ A list / feed / inbox / scan log
│  └─ Pattern 03 — Stacked Receipt Feed
│
├─ A multi-step flow / onboarding / tier journey
│  └─ Pattern 04 — Linked Card Train
│
├─ A landing page hero
│  ├─ Want premium-magazine read ──── Pattern 05 — Editorial Hero Tile
│  └─ Want dashboard-feel preview ── Pattern 02 — Bento Dashboard, hero = 8-col anchor
│
└─ A category browse / discovery feed
   └─ Existing § Feed Grid (v7) — Pattern 02 only inside hero strip above the feed
```

---

## v8 Build Checklist (before opening a PR)

1. **No new tokens introduced.** Every color, radius, shadow, font is from v7. Diff `:root` in `app/globals.css` — should be unchanged.
2. **No `border-radius: 0` anywhere.** Including the formerly-broken Pattern 03.
3. **One Spark + max one Ceremony per viewport.** Run the page through this manually.
4. **Each bento section passes the Rhythm Rule** — adjacent cells differ on ≥ 2 of {size, tone, density}.
5. **Photography is real, close-up, hands-and-surfaces direction.** No stock smiling teams. No AI-generated illustrations.
6. **One reaction-element motif per page, used 2–3 times.** SVG only, stroke-only, no Lottie.
7. **Numeral as Logo present on at least one viewport.** Darky 900 paired with a Darky 200 counter-numeral.
8. **No multi-stop gradients, no glass on resting content, no 3D blobs.**
9. **Hero is asymmetric.** No centered hero pattern remains in the page.
10. **AA contrast verified** — especially category tint cells with Ink text and Brand Red Spark cells with white text.

---

## What Changed Between v7.5 (appended Editorial Bento) and v8

| | v7.5 (retired) | v8 (canonical) |
|---|---|---|
| Token system | Two parallel (Push v7 + generic `--c1…c7`) | One — Push v7 only |
| Pattern 03 | `border-radius: 24px 24px 0 0` (violates v7 rule) | Full `--r-xl` + negative-margin stack |
| Pattern 04 | Candy palette + jigsaw, white-on-color | Category tints + link bead, Ink-on-tint |
| Third font allowed | "可加 display serif" | Banned — Darky weight contrast is the editorial signature |
| Anti-cliché guidance | TL;DR mentions | Eight specific moves with token-level implementation |
| Behance reference DNA | Not encoded | Encoded as concrete moves |
| Push-specific (creator/merchant) tactics | Absent | Six engagement moves |

---

*v8 last updated: 2026-04-24. Authority: this layer composes from v7. Conflicts resolve to v7. New tokens require updating both v7 sections above and CLAUDE.md before merge.*

---

# v8.1 · Vibrant Foundation + Mystic Dream Display

> **Status (2026-04-24, evening):** Layered on top of v8 (does not replace it). Adds three things — a third typeface for hero/poster moments only (Mystic Dream), one new vibrant accent color (Volt Indigo), and a sharper monochrome discipline (Obsidian / Snow extreme-contrast pair). All existing v7 + v8 tokens still hold; v8.1 only **extends**.
>
> Reference DNA injected: **organimo.com** (one warm vibrant accent on warm-bias darks/lights, intentional negative space, display face as visual material), **AOtis Branding** (cool/warm accent tension over near-achromatic foundation, photography-led layouts, type-gets-out-of-the-way discipline). Goal: vibrant + premium + harmonious + fresh — never tropical-smoothie loud.

---

## What v8.1 Adds (and What Stays)

| Layer | What |
|---|---|
| **New** | `Mystic Dream` typeface — heavy artistic display, hero/poster only |
| **New** | `--volt` cool-vibrant accent (Volt Indigo `#2d3aff`) — single cool counterweight to Flag Red |
| **New** | `--obsidian` (`#000000`) + `--snow` (`#ffffff`) — extreme-contrast pair for one element per page |
| **New** | Vibrancy Harmony Rules (4) — when vibrant stays premium |
| **New** | Mystic Dream + Darky pairing rules (3) — how heavy display coexists with the geometric grotesque |
| **Stays** | Every v7 token (Ink ladder, Flag Red, Champagne, 6 categories, iOS 26 radii, three-layer shadows) |
| **Stays** | All v8 patterns and bento composition |
| **Retired (was suggested but never adopted)** | nothing — v8.1 is purely additive |

---

## Vibrancy Harmony — The Four Rules

Vibrant accents read premium when they sit on **extreme value separation** with **tonally aligned neutrals**, used **once or twice max**, surrounded by **deliberate negative space.** Every v8.1 page must pass all four checks.

### Rule 1 · Extreme Value Separation

Vibrant accents only sing against ≤ 12% lightness darks or ≥ 92% lightness lights. **Mid-gray kills vibrancy** — that's the Webflow-vibrant tell.

```
Allowed surfaces under a vibrant accent:
  --surface  (#fbfaf7  ≈ 98% L)   ← Ivory Warm White
  --snow     (#ffffff  = 100% L)  ← Snow (limited use, see § Monochrome Foundation)
  --ink      (#0a0a0a  ≈ 4%  L)   ← Editorial Ink
  --obsidian (#000000  = 0%  L)   ← Obsidian (limited use)

NOT allowed:
  --surface-2  (#f5f3ee  ≈ 95% L)   borderline — use sparingly
  --surface-3  (#ece9e0  ≈ 91% L)   too muddy under vibrant
  --ink-3 / 4  / 5  / 6              all forbidden under a vibrant fill
```

### Rule 2 · Tonal Harmony (Push leans warm — keep it warm)

Push v7's foundation is warm-biased: Ivory `#fbfaf7`, Pearl `#f5f3ee`, Bone `#ece9e0`, all sit on the warm side of true neutral. **Vibrants must respect this bias.**

| Vibrant token | Bias | Pairs with |
|---|---|---|
| `--brand-red` `#c1121f` | warm | Champagne, Ivory, Ink — *primary* |
| `--champagne` `#bfa170` | warm | Ink, Ivory — *ceremonial* |
| `--volt` `#2d3aff` (NEW) | cool — **the only cool vibrant allowed** | Snow, Obsidian, Ivory — never warm grays |

Mixing cool vibrants on warm-bias gray (e.g., Volt on `--surface-3` Bone) will read amateur. Volt always sits on **Ivory, Snow, or Obsidian** — never on Pearl or Bone.

### Rule 3 · Single OR Dual Accent — Never Three

Per viewport you may use **at most two** of `--brand-red`, `--volt`, `--champagne`. Three reads as visual panic.

The intentional-tension play (AOtis move): **Flag Red + Volt** in the same viewport creates editorial drama (warm/cool opposition). Use this once per page maximum. Champagne is incompatible with Volt in the same viewport — pick one of the three pairs:

| Pair | Mood | When |
|---|---|---|
| `--brand-red` + `--champagne` | warm × ceremonial | Partner moments, premium upsell, reward states |
| `--brand-red` + `--volt` | warm × cool tension | Editorial hero, share cards, "fresh launch" moments |
| `--volt` + `--champagne` | cool × warm tension | Awards, year-in-review hero — rare, aspirational |

Solo accent (one vibrant, no counterweight) is always allowed and often the calmest premium move.

### Rule 4 · Negative Space = Status Signal

The fastest premium tell is breathing room. Push v7 already specifies 96–128px section padding on desktop — **v8.1 makes this non-negotiable when vibrant accents are present**. A vibrant fill inside cramped padding reads cheap.

| Surface containing a vibrant accent | Min padding |
|---|---|
| Hero block (`--r-3xl`) | `--space-12` (96px) all sides desktop |
| Bento cell (`--r-2xl`) | `--space-4` (32px) all sides — never less |
| Pill button containing vibrant fill | `14 × 28px` Pill Primary spec — already correct |
| Stat card with vibrant numeral | `--space-3` (24px) all sides + `--space-1` (8px) extra bottom-right where unit/label sits |

---

## Monochrome Foundation — Ink Ladder + Obsidian Extreme

Push's existing 6-step Ink ladder (`#0a0a0a → #cfcfcf`) is warm-bias and stays the default. v8.1 adds an **extreme-contrast pair** for one editorial moment per page.

| Token | Hex | Role | Allowed where |
|---|---|---|---|
| `--obsidian` | `#000000` | Pure black — colder, sharper, more graphic than Ink | Pattern 05 hero alternative · share-card brand bar · single editorial poster section per page · Mystic Dream display backdrop |
| `--snow` | `#ffffff` | Pure white — colder than Ivory, signals max contrast | Text on `--obsidian` only · single Mystic Dream display character set · share-card export background |

**Rules:**

- **Obsidian and Snow are paired.** They appear together or not at all. White text on `--ink` is fine (already in v7); white text on `--obsidian` is also fine; black text on `--snow` is also fine. **Never mix** — don't put `--ink` text on `--snow`, don't put `--surface` text on `--obsidian`. Pure on pure, warm on warm.
- **One Obsidian/Snow component per page.** The contrast differential (vs. the warm-bias rest of the page) is what makes it read as editorial. Two Obsidian sections cancel the effect.
- **Obsidian is the only place** Mystic Dream display type may appear in white. Everywhere else, Mystic Dream uses `--ink` or `--brand-red`.

### Why two blacks (Ink #0a0a0a + Obsidian #000)?

Same reason iOS uses both `systemBackground` and `secondarySystemBackground`. **Ink** is the warm everyday black for body, headings, UI chrome. **Obsidian** is the editorial moment — a poster, a billboard, a magazine cover where the page wants to *snap*. The 4% lightness gap is invisible side-by-side but huge in feel.

---

## Typography v8.1 — Three Faces, Three Roles

Push now ships three typefaces. **The two-font discipline is preserved** because Mystic Dream's role is so narrow it doesn't compete with Darky in normal use.

| Face | Role | Allowed at | Forbidden at |
|---|---|---|---|
| **Mystic Dream** | Hero / poster display only — the editorial anchor | Hero numerals, Pattern 05 hero headlines, share-card titles, year-in-review wraps, partner-ceremony moments, single landing-page billboard | Body, UI labels, navigation, buttons, badges, captions, anywhere Darky 700+ already lives |
| **Darky** | Display + heading workhorse — every screen, every section | h1–h4, dashboard stat numerals, section titles, card titles, hero subtitles, *all* numeric data presentation | Body copy, monospaced data, UI labels |
| **CS Genio Mono** | Body + UI + label — the technical voice | Body copy, captions, eyebrows, button labels, navigation, table cells, metadata, status pills | Hero display, stat numerals, anything ≥ 32px |

### Mystic Dream — Where, How, and Critically When NOT

**Where Mystic Dream wins over Darky 900:**

| Situation | Why |
|---|---|
| Marketing / landing page hero headline | Mystic Dream's heavy artistic forms read as a *brand poster*, not just a big sans. Builds cultural weight. |
| Year-in-review share card title (Pattern 01) | Personality moment — share cards travel through social channels and need a recognizable wordmark feel. |
| Partner / Closer ceremonial billboard section | Earned-moment language: Mystic Dream is the only display face that signals "this is special." |
| Editorial Hero Tile (Pattern 05) — when the page is a story, not a dashboard | Story = Mystic Dream. Data = Darky 900. |

**Where Darky 900 stays:**

| Situation | Why |
|---|---|
| Stat numerals (Numeral as Logo pattern) | Darky's geometric precision reads as data. Mystic Dream's character would compete with the number itself. |
| In-product dashboards, settings, forms, lists | Mystic Dream inside product chrome would feel like marketing leaking into UX. |
| Anywhere a numeral and a headline appear together | The Numeral-as-Logo pattern *requires* Darky's weight ladder. Mystic Dream has one weight. |

### The Three Pairing Rules

**Rule 1 — One Mystic Dream moment per page, max.** Mystic Dream + Darky display in the same viewport is forbidden. If the hero uses Mystic Dream, every subsequent section uses Darky. The artistic display gets one stage; everything else holds steady.

**Rule 2 — Mystic Dream sits on solid color, never gradient or photograph backdrop.** Per the agent reference DNA: heavy artistic display + watercolor background = the trendy-Webflow tell. Mystic Dream lives on `--ink`, `--obsidian`, `--surface`, `--snow`, or `--brand-red` — and that's the entire allowed surface list. Never on a category fill, never on photography, never on a gradient.

**Rule 3 — Mystic Dream pairs with CS Genio Mono for body, never with Darky.** The body-paragraph below a Mystic Dream headline is always CS Genio Mono. Darky as body under Mystic Dream creates a three-way visual collision.

### Type Scale Update — Mystic Dream tier

Add this row above the existing v7 type scale:

| Element | Font | Size | Weight | Letter-Spacing | Color |
|---|---|---|---|---|---|
| **Mystic Dream Hero** | Mystic Dream | `clamp(80px, 16vw, 240px)` | normal (Mystic Dream has one weight) | `-0.02em` | `--ink` / `--obsidian` / `--brand-red` only |
| **Mystic Dream Section Title** | Mystic Dream | `clamp(56px, 8vw, 120px)` | normal | `-0.015em` | same |
| **Mystic Dream Tag/Eyebrow** | Mystic Dream | `28–40px` | normal | `0` | same |

Mystic Dream **never** appears below `28px`. Below that size its decorative forms become illegible.

### `@font-face` declaration

```css
@font-face {
  font-family: 'Mystic Dream';
  src: url('/fonts/MysticDream-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

Source file: `Mystic Dream.ttf` lives in `/Push/Fonts/Mystic Dream/`. v8.1 ships a copy at `/Push/public/fonts/MysticDream-Regular.ttf` for production loading.

---

## Volt Indigo — The Cool Vibrant

`--volt` (Volt Indigo, `#2d3aff`) is Push's first and only cool-vibrant accent. It exists to create AOtis-grade warm/cool tension with Flag Red, and to give "fresh launch" / "kinetic" / "live now" moments a visual signal that doesn't duplicate Brand Red's role.

| Token | Hex | Usage |
|---|---|---|
| `--volt` | `#2d3aff` | Live-now indicator, "fresh drop" pill, kinetic moment, share-card share-button fill, single section accent in hero/launch context |
| `--volt-deep` | `#1c26d6` | Hover / pressed state |
| `--volt-tint` | `rgba(45, 58, 255, 0.10)` | Live-now badge background, fresh-drop banner |
| `--volt-focus` | `rgba(45, 58, 255, 0.22)` | Focus ring on Volt-fill buttons |

### Where Volt is allowed

- "Live now" / "Just dropped" / "Fresh launch" pill or chip
- A *single* CTA on a launch / what's-new section — when paired with Brand Red CTA elsewhere on the page (warm/cool pair)
- Year-in-review numerical highlight on Obsidian background (one per share card)
- Selection / focus ring on form fields in the Editorial Hero Tile context (replaces Brand Red focus when the hero already uses Brand Red as primary)
- Mystic Dream display *occasionally* — but only on `--snow` background, and only once per page

### Where Volt is forbidden

- Inside any category-context UI (don't crowd the 6 category colors with a 7th vibrant)
- As body text (cobalt at body size = pre-2010 hyperlink cliché)
- On Pearl or Bone surfaces — kills the saturation
- As a tier badge color (the tier system is locked, see § Tier Identity)
- More than once per viewport

### Contrast / Accessibility

| Combo | Ratio | Pass |
|---|---|---|
| `--volt` on `--snow` | 8.6 : 1 | AAA normal |
| `--volt` on `--surface` (Ivory) | 8.5 : 1 | AAA normal |
| `--snow` on `--volt` | 8.6 : 1 | AAA normal |
| `--volt` on `--obsidian` | 2.7 : 1 | **fails** — never put Volt text on Obsidian. Use `--snow` text on `--volt` fill instead. |
| `--volt` on `--ink` | 2.6 : 1 | **fails** — same |

The "Volt on dark" pattern is achieved by **filling a section with Volt and writing in Snow**, not by writing Volt text on Ink/Obsidian.

---

## Three Anti-Cliché Bans (vibrant + heavy-display edition)

Hard rules added to the existing v8 anti-cliché playbook.

| Ban | Why | What to do instead |
|---|---|---|
| **No heavy artistic display (Mystic Dream) over a gradient, watercolor, blurred photo, or noise-textured background.** | Trendy-Webflow tell from 2022–2024. Premium design uses solid color or one crisp photograph, never both. | Mystic Dream on `--ink`, `--obsidian`, `--surface`, `--snow`, or `--brand-red` — solid fill only. |
| **No hairline / ultra-thin display type at body or sub-headline scale.** | Late-2010s "luxury fashion website" cliché — already dated. | Mystic Dream at `≥ 28px` only. Below that, Darky weights or CS Genio Mono. |
| **No rainbow vibrant palette.** Volt + Flag Red + Champagne in the same viewport, or Volt + any two category colors as decorative accents = forbidden. | Tropical-smoothie loud. Premium is restraint, not abundance. | Pick one or two accents per viewport per the Pair table above. Categories live only inside category context. |

---

## Updated Decision Tree — Pick the Display Face

```
Building a hero / opening / billboard moment?
│
├─ It's a story / brand / share / launch / ceremonial moment
│  └─ Mystic Dream  (clamp(80, 16vw, 240) on solid surface)
│
├─ It's a numeral or data hero (price, count, KPI)
│  └─ Darky 900   (clamp(72, 14vw, 200) — Numeral as Logo pattern)
│
├─ It's a section title inside an in-product page
│  └─ Darky 800 / 700  (28–44px — never Mystic Dream)
│
└─ It's a paragraph, label, or UI element
   └─ CS Genio Mono  (always)
```

---

## v8.1 Build Checklist (additive to v8 checklist)

1. **At most one Mystic Dream block per page.** If two pages of the same flow both use Mystic Dream, only the first qualifies (year-in-review wrap-card → first share card has it; subsequent product pages don't).
2. **At most two vibrant accents per viewport.** Run a color-eyedrop pass — count distinct vibrant fills (Brand Red, Volt, Champagne, any category color outside its category context). If > 2, cut.
3. **Volt only sits on Snow / Ivory / Obsidian.** Never on Pearl / Bone / category tints.
4. **Mystic Dream never below 28px.** Set up a CSS lint or Stylelint rule if possible.
5. **Obsidian / Snow appear together or not at all.** Audit any `#000000` / `#ffffff` literals.
6. **Three-typeface viewport check.** Mystic Dream + Darky display in the same viewport = forbidden. Pages combining both must separate them by ≥ 800px scroll distance.
7. **Vibrancy Harmony Rule 4** — every section containing a vibrant fill gets `--space-12` (desktop) or `--space-8` (mobile) padding minimum.

---

## What Changed Between v8 and v8.1

| | v8 | v8.1 |
|---|---|---|
| Typefaces | Darky + CS Genio Mono (locked) | Darky + CS Genio Mono + Mystic Dream (Mystic Dream restricted to hero/poster only — discipline preserved) |
| Vibrant accents | `--brand-red` + `--champagne` (both warm) | + `--volt` `#2d3aff` (one cool — the AOtis tension move) |
| Monochrome | Ink ladder warm-bias | + `--obsidian` `#000` and `--snow` `#fff` (extreme-contrast pair, paired use only) |
| Vibrancy guidance | Anti-cliché section in v8 | Formalized as 4 Vibrancy Harmony Rules + 3 anti-cliché bans + dual-accent pair table |
| Reference DNA | OFFtrail / Crème / POISE | + organimo (warm vibrant on warm-bias monos) + AOtis (cool/warm tension on near-achromatic foundation) |

---

*v8.1 last updated: 2026-04-24 evening. Authority: extends v8, which extends v7. Conflicts always resolve to the lower-numbered (more foundational) version. Adding a fourth typeface, a third vibrant, or any new monochrome token requires updating this section, the v7 sections above, and CLAUDE.md before merge.*
