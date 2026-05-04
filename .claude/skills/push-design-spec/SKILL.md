---
name: push-design-spec
description: "Figma-synced design spec (v12). Authoritative source for all Push UI: exact CSS values for every component, token-to-CSS mappings, typography scale, panel/section rules, button system, liquid glass. Load BEFORE touching any CSS or component. Sub-files: tokens.md, components.md, panels.md"
---

# Push Design Spec v12 — Figma Source of Truth

> Extracted from Figma file `vjlMQtghdV76EIAUt20r3h` via `/Users/jiamingw/Documents/Claude/Projects/Project Push/design-spec.html`.
> This skill takes precedence over any hand-written approximation. When in doubt, read the spec HTML directly (in chunks, file is large).

## CRITICAL RULES (memorize these)

1. **Audit design-spec.html FIRST** — before implementing any component. Read lines 1–500 for CSS, lines 501–620 for footer, lines 620–1350 for components.
2. **8px is the universal panel radius** — every card, panel, tile, button uses `border-radius: 8px`. Exceptions: KPI card (16px), sidebar demo wrap (16px), nav float (20px), Candy Panel (28px), footer top corners (8px).
3. **3 fonts only** — Magvix (hero/wordmark/divider), Darky (display/heading/numeral), CS Genio Mono (body/UI/label). No others.
4. **Closed color list** — only Design.md §2 tokens in production CSS. See `tokens.md` for Figma→token mapping.
5. **Bottom-right hover shift on every clickable** — `translate(2px, 2px)` hover, `translate(3px, 3px) scale(0.98)` active. Exceptions documented below.

---

## Quick-Reference Tables

### Sub-Files

| File | Contains |
|------|----------|
| `tokens.md` | Figma hex → Design.md CSS token mapping; all 10 palette colors |
| `components.md` | Exact CSS for every component (nav, hero, panel, card, button, glass tile, KPI, table, subscribe, footer) |
| `panels.md` | Panel/section layout rules, grid, spacing tokens, responsive breakpoints |

---

## Typography Scale (Figma v12 — EXACT)

| Role | Font | Size | Weight | LH | LS |
|------|------|------|--------|-----|-----|
| Header 1 / Magvix Hero | Magvix Regular | clamp(64px, 9vw, 200px) | 400 | 0.85 | -0.02em |
| Header 2 / Darky Display | Darky | clamp(56px, 8vw, 128px) | 900 | 0.85 | -0.03em |
| Header 3 / Darky Large ✦NEW | Darky | 110px (fixed) | 800 | 0.95 | -0.036em |
| Header 4 / Magvix Italic | Magvix Italic | 80px | 400 | 0.90 | -0.025em |
| H1 section title | Darky | 40px | 800 | 1.05 | -0.02em |
| Body | CS Genio Mono | 20px | 400 | 1.40 | -0.1em |
| Body small | CS Genio Mono | 16px | 400 | 1.55 | -0.02em |
| Caption / Eyebrow | CS Genio Mono | 10px (12px min in production) | 600 | 1.40 | +0.4em UPPERCASE |
| Label / UI | CS Genio Mono | 12–14px | 600 | 1 | 0.04–0.12em |
| Article headline | Darky | clamp(28px, 4vw, 56px) | 700 | 1.05 | -0.02em |
| Footer wordmark | Magvix Regular | clamp(80px, 14vw, 200px) | 400 | 0.85 | -0.04em |
| KPI numeral | Darky | clamp(36px, 4.5vw, 56px) | 800 | 1 | -0.03em |

**CSS variables:** `--font-hero: 'Magvix'` / `--font-display: 'Darky'` / `--font-body: 'CSGenioMono'`

---

## Button System (5 variants — Figma exact)

All buttons share:
```css
font-family: var(--font-body);
font-size: 14px; /* 16px on dark panels */
font-weight: 600;
letter-spacing: 0.04em;
text-transform: uppercase;
border-radius: 8px;
padding: 14px 28px;
border: none;
cursor: pointer;
transition: transform 0.12s ease;
```
```css
.btn:hover  { transform: translate(2px, 2px); }
.btn:active { transform: translate(3px, 3px) scale(0.98); }
```

| Variant | Background | Color | Token |
|---------|-----------|-------|-------|
| Primary | `var(--brand-red)` | `var(--snow)` | `#c1121f` |
| Secondary | `var(--n2w-blue)` | `var(--snow)` | `#0085ff` |
| Ink | `var(--ink)` | `var(--snow)` | dark surfaces only |
| Ghost | transparent | `var(--ink)` or `var(--snow)` on dark | 1px border |
| Pill | `var(--surface-3)` | `var(--ink)` | pill-radius, 8px 18px |

**No hover shift on:** GA Tri-Color nav pills, Ticket Panel grommets, footer wordmark, Magvix Italic divider.

---

## Hover Shift Rule

Every clickable interactive element:
```css
transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
/* hover: */ transform: translate(2px, 2px);
/* active: */ transform: translate(3px, 3px) scale(0.98);
```
iOS 26 spring easing. Class: `click-shift` (defined in globals.css).

---

## Panel Radius Reference

| Component | radius |
|-----------|--------|
| Standard panel / card | 8px |
| Button | 8px |
| Input | 8px |
| Pill button / label | 50vh (full pill) |
| KPI card | 16px |
| Sidebar demo wrap | 16px |
| Nav float (liquid glass) | 20px |
| Candy Panel | 28px |
| Footer (top only) | 8px 8px 0 0 |
| Full-bleed Photo Card Hero | 0 |
| Editorial Hero Tile | 0 |

---

## Liquid Glass Surface Specs

```css
/* Tile (floating widget) */
.glass-tile {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.50) inset;
  border-radius: 8px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.30);
}

/* Nav float */
.nav-float {
  background:
    radial-gradient(ellipse at 25% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%),
    radial-gradient(ellipse at 90% 100%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%),
    rgba(255,255,255,0.22);
  backdrop-filter: blur(32px) saturate(180%);
  border: 0.5px solid rgba(255,255,255,0.40);
  border-radius: 20px;
  box-shadow:
    0 8px 24px rgba(10,10,10,0.08),
    0 2px 6px rgba(10,10,10,0.05),
    inset 0 1px 0 rgba(255,255,255,0.50),
    inset 0 -1px 0 rgba(10,10,10,0.05);
}

/* Sidebar full panel */
.sidebar {
  background:
    radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 55%),
    radial-gradient(ellipse at 95% 100%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 60%),
    rgba(255,255,255,0.60);
  backdrop-filter: blur(32px) saturate(180%);
  border-right: 0.5px solid rgba(255,255,255,0.40);
}
```

---

## Ticket Panel / Subscribe Block Spec

```css
.ticket-panel {
  background: var(--ga-orange);  /* #ff5e2b */
  border-radius: 8px;
  padding: 64px 96px;
  position: relative;
  overflow: hidden;
  text-align: center;
}

/* Grommets — SOLID circles, NOT outline */
.grommet {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--ink);  /* solid ink fill */
}
/* Left grommets: left: 16px, justified top/bottom */
/* Right grommets: right: 16px, justified top/bottom */

/* Perforations */
.perf-left  { left: 40px;  border-left: 2px dashed rgba(0,0,0,0.28); }
.perf-right { right: 40px; border-left: 2px dashed rgba(0,0,0,0.28); }

/* Headline */
font-family: var(--font-hero); /* Magvix Italic */
font-style: italic;
font-size: clamp(40px, 6vw, 80px);
color: var(--ink);  /* dark on orange */
line-height: 1.0;
letter-spacing: -0.01em;

/* Body */
font-family: var(--font-body);
font-size: 16px; color: var(--ink-2);
max-width: 480px; line-height: 1.55;

/* CTA button: Filled Ink — dark bg, snow text */
```

---

## Footer Spec (Figma node 1:218)

```css
footer {
  background: var(--ink-2);   /* #171614 in Figma → closest token var(--ink-2) */
  border-radius: 8px 8px 0 0;
  padding: 120px 64px 32px;
  margin-top: 80px;
}

.footer-inner {
  max-width: 1140px; margin: 0 auto;
  display: flex; align-items: flex-end; gap: 80px;
}

.footer-wordmark {
  font-family: var(--font-hero);  /* Magvix Regular, NOT italic */
  font-size: clamp(80px, 14vw, 200px);
  font-weight: 400; line-height: 0.85; letter-spacing: -0.04em;
  color: var(--snow); flex-shrink: 0;
}

.footer-col-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: var(--ink-6);
  border: 1px solid color-mix(in srgb, var(--ink-6) 40%, transparent);
  border-radius: 50vh; padding: 4px 12px; margin-bottom: 20px;
}

.footer-col a {
  font-family: var(--font-body);
  font-size: 16px; line-height: 1.40; letter-spacing: -0.01em;
  color: var(--ink-6);
  text-decoration: underline; text-underline-offset: 3px;
  text-align: right; display: block;
}
.footer-col a:hover { color: var(--snow); }

.footer-col ul { align-items: flex-end; }  /* right-aligned links */

.footer-bottom {
  max-width: 1140px; margin: 80px auto 0;
  display: flex; justify-content: flex-end;
  border-top: 1px solid color-mix(in srgb, var(--snow) 8%, transparent);
  padding-top: 24px;
}

.footer-copy {
  font-family: var(--font-body); font-size: 12px;
  color: color-mix(in srgb, var(--ink-6) 60%, transparent);
  letter-spacing: 0.02em;
}
```

---

## KPI Card Spec (§8.14)

```css
.kpi-card {
  background: var(--surface);   /* #f8f4e8 */
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  padding: 24px;
  transition: transform 120ms ease;
}
.kpi-card:hover { transform: translate(2px, 2px); }

.kpi-card__eyebrow {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 700; /* 11px in spec, 12px production minimum */
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-3); margin-bottom: 8px;
}

.kpi-card__numeral {
  font-family: var(--font-display);
  font-size: clamp(36px, 4.5vw, 56px);
  font-weight: 800; line-height: 1; letter-spacing: -0.03em;
  color: var(--ink); margin-bottom: 8px;
}
.kpi-card__numeral--primary { color: var(--brand-red); }

.kpi-card__delta { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; }
.kpi-card__delta--up   { color: #22c55e; }
.kpi-card__delta--down { color: var(--brand-red); }
.kpi-card__delta--flat { color: var(--ink-3); }
```

---

## Editorial Table Spec (§8.15 Cinema Selects)

```css
.cs-row {
  display: grid;
  grid-template-columns: 28% 72%;
  align-items: baseline;
  padding: 20px 0;
  border-bottom: 1px dotted rgba(26,26,26,0.20);
  gap: 24px;
}

.cs-row__label {  /* first col — Darky */
  font-family: var(--font-display);
  font-size: 18px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em;
  color: var(--ink);
}

.cs-row__value {  /* second col — mono */
  font-family: var(--font-body);
  font-size: 15px; line-height: 1.55; letter-spacing: -0.01em;
  color: var(--ink-3);
}

/* Table headers */
.table-header-cell {
  font-family: var(--font-body);
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.2em; color: var(--ink-4);
  padding-bottom: 16px; border-bottom: 1px dotted rgba(26,26,26,0.25);
}
.table-header-cell:last-child { text-align: right; }
```

---

## Section / Panel Layout Rules

```css
section {
  padding: 96px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06); /* light theme: rgba(0,0,0,0.06) */
}

.container {
  max-width: 1140px; margin: 0 auto; padding: 0 64px;
}

/* Panel (dark surface) */
.panel {
  background: var(--ink-2);   /* dark panels */
  border-radius: 8px;         /* ALWAYS 8px */
  padding: 40px;
  margin-bottom: 24px;
}

/* Section eyebrow */
.section-eyebrow {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: var(--ink-4);  /* or ink-3 on light bg */
  margin-bottom: 16px;
}

/* Section title (H2) */
.section-title {
  font-family: var(--font-display);
  font-size: 40px; font-weight: 800;
  line-height: 1.05; letter-spacing: -0.02em;
  color: var(--ink);  /* or snow on dark bg */
  margin-bottom: 56px;
}
```

---

## Sidebar Spec (§8.13)

```css
/* Width */ 248px; flex-shrink: 0;

/* Logo area */ height: 64px; padding: 0 16px;
/* Monogram */ 32×32, border-radius: 10px, dark bg, white Darky 14px 700
/* Wordmark */ Darky 16px 700 uppercase ls 0.04em

/* Section label */ 10px mono 700, ls 0.16em, uppercase, rgba(26,26,26,0.38)

/* Nav item */
padding: 9px 12px; border-radius: 8px; margin: 1px 8px;
font: 14px mono 500; color: rgba(26,26,26,0.55);
/* Hover: */ bg rgba(255,255,255,0.55) + shadow
/* Active: */ bg rgba(255,255,255,0.85) + stronger shadow, font-weight 600

/* Search input */ height 32px, bg rgba(255,255,255,0.55), radius 8px
```

---

## Nav Float Spec (§8.12)

```css
/* Container */ liquid glass, 20px radius, padding 10px 16px, gap 16px
/* Monogram */ 32×32 circle, dark bg, white, Darky 14px 700
/* Pills */
  font: 13px mono 600 uppercase ls 0.04em; padding: 7px 16px; radius 50vh
  Home:      bg #ff5e2b (--ga-orange), white text
  Creators:  bg #4ade80 (--ga-green), dark text
  Merchants: bg #93c5fd (--ga-sky), dark text
  Pricing:   bg var(--surface-3), var(--char) text
/* CTA button */ bg var(--brand-red), white, radius 8px, 7px 18px, hover shift
/* NO hover translate on pills — color-state only (brightness filter) */
```

---

## Article Card Spec

```css
/* Large card (1:1.5 grid) */
.article-large { grid-template-columns: 1fr 1.5fr; gap: 40px; bg var(--ink); radius 8px; p 40px; }
.article-photo { aspect-ratio: 4/5; radius 8px; }
.article-headline { Darky clamp(28px,4vw,56px) 700, lh 1.05, ls -0.02em, color var(--snow) }
.article-body    { mono 16px, lh 1.55, color var(--ink-4) }
.article-meta    { mono 11px uppercase ls 0.2em, color var(--ink-4) }
.article-caption { mono 12px, color var(--ink-4) }

/* Small card (1:1 grid) */
.article-small { grid-template-columns: 1fr 1fr; gap 24px; bg var(--ink); radius 8px; p 40px; }
.article-small-img { aspect-ratio: 4/5; radius 8px; }
.article-small-title { Darky 18px 700, lh 1.1, color var(--snow) }
hover: translate(2px, 2px)
```

---

## Color Token Map (Figma → Design.md CSS)

| Figma Color | Hex | Design.md Token | Use |
|-------------|-----|-----------------|-----|
| Background 1 | #0F0E0E | `var(--ink)` | Near-black text/surface |
| Background 2 | #1F1F1F | `var(--ink-2)` | Dark panel bg |
| Divider | #555659 | `var(--ink-4)` | Dividers, metadata |
| Paragraph 3 | #8C8D92 | `var(--ink-5)` | Tertiary labels |
| Paragraph 4 | #D1D2D8 | `var(--ink-6)` | Links on dark, placeholder |
| Headline 1 | #F6F8FB | `var(--snow)` | Headings on dark |
| White | #FFFFFF | `var(--snow)` | Pure white |
| Orange | #FF5700 | `var(--ga-orange)` | GA nav pill / Ticket bg |
| Green | #32CE57 | `var(--ga-green)` | GA nav pill |
| Blue | #A3CAFF | `var(--ga-sky)` | GA nav pill |
| Footer bg | #171614 | `var(--ink-2)` | Footer only |

> When using Figma colors with opacity: use `color-mix(in srgb, var(--token) X%, transparent)` instead of raw rgba values.

---

## How to Audit a Page

1. Read design-spec.html chunks relevant to the component (see chunk map in memory)
2. Check panel border-radius (should be 8px for standard, 16px for KPI, 28px for Candy)
3. Check typography: body = 20px / lh 1.40 / ls -0.1em; headings follow table above
4. Check buttons: all 5 variants use the system; no custom per-page buttons
5. Check hover behavior: every card/link/button has translate(2px,2px) on hover
6. Check colors: only Design.md tokens, no hardcoded hex in production CSS
7. Check section padding: 96px vertical (56px mobile / 80px tablet)
8. Check eyebrow labels: Marketing uses parenthetical `(LABEL)`, Product uses canonical `LABEL`
