---
name: push-design-spec/tokens
description: "Figma v12 → Design.md CSS token mapping. Complete color palette, shadow system, and CSS variable reference. Load when implementing colors or checking token compliance."
---

# Design Spec Tokens — Figma v12

> Source: design-spec.html root `:root` block (lines 37–59) + Design.md §2

## Figma Color Palette (node 1:42) → CSS Variables

These 10 values are the production palette. **No other hex values may appear in production CSS.** Photos and SVG visual effects are exempt.

| Figma Name | Figma Hex | CSS Variable | Actual Value | Notes |
|------------|-----------|--------------|--------------|-------|
| Background 1 | `#0F0E0E` | `var(--ink)` | `#0a0a0a` | Near-black text + surface. Closest to Figma bg1. |
| Background 2 | `#1F1F1F` | `var(--ink-2)` | `#1f1f1f` | Dark panel bg. **Exact match.** |
| Divider | `#555659` | `var(--ink-4)` | `#6a6a6a` | Dividers, meta text |
| Paragraph 3 | `#8C8D92` | `var(--ink-5)` | `#9a9a9a` | Tertiary labels, icon-secondary |
| Paragraph 4 / Links | `#D1D2D8` | `var(--ink-6)` | `#cfcfcf` | Light links on dark, placeholders |
| Headline 1 | `#F6F8FB` | `var(--snow)` | `#ffffff` | Headings on dark (warm near-white) |
| Background 4 | `#FFFFFF` | `var(--snow)` | `#ffffff` | Pure white |
| Orange Accent | `#FF5700` | `var(--ga-orange)` | `#ff5e2b` | Ticket Panel / nav Home pill |
| Green Accent | `#32CE57` | `var(--ga-green)` | `#4ade80` | GA nav Active pill |
| Blue Accent | `#A3CAFF` | `var(--ga-sky)` | `#93c5fd` | GA nav Last pill |
| Footer bg (unique) | `#171614` | `var(--ink-2)` | `#1f1f1f` | Footer ONLY; not in main palette |

## Additional Design.md Tokens (v11)

| Token | Value | Role |
|-------|-------|------|
| `--surface` | `#f8f4e8` | Ivory Cream — default page bg |
| `--surface-2` | `#f5f3ee` | Pearl Stone — nested cards |
| `--surface-3` | `#ece9e0` | Bone — button hover, muted |
| `--mist` | `#d8d4c8` | Card borders, divider bands |
| `--ink-3` | `#61605c` | Body copy — locked |
| `--char` | `#3a3835` | Warm dark panel alternative |
| `--graphite` | `#2c2a26` | Mid-strong heading color |
| `--obsidian` | `#000000` | Editorial poster backdrop |
| `--brand-red` | `#c1121f` | Primary CTA |
| `--n2w-blue` | `#0085ff` | Secondary CTA |
| `--champagne` | `#bfa170` | Ceremonial (≤3/page) |
| `--editorial-blue` | `#1e5fad` | Old footer (retired for footer) |
| `--editorial-pink` | `#e8447d` | Single CTA stamp (≤1/page) |

## Opacity Compositing (without rgb variables)

Since Design.md doesn't define `--X-rgb` channel variants, use CSS `color-mix()`:

```css
/* Instead of: rgba(209,210,216, 0.40) */
color-mix(in srgb, var(--ink-6) 40%, transparent)

/* Instead of: rgba(255,255,255,0.08) */
color-mix(in srgb, var(--snow) 8%, transparent)

/* Instead of: rgba(0,0,0,0.28) */
color-mix(in srgb, var(--ink) 28%, transparent)

/* Instead of: rgba(26,26,26,0.06) */
color-mix(in srgb, var(--ink) 6%, transparent)
```

These are supported in all modern browsers (Chrome 111+, Safari 16.2+, Firefox 113+).

## Shadow System

```css
/* Figma shadows — exact */
--shadow-1: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
--shadow-2: 0 4px 12px rgba(0,0,0,0.14), 0 2px 4px rgba(0,0,0,0.06);
--shadow-3: 0 12px 32px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.08);
--shadow-glass: 0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.50) inset;

/* iOS 26 soft shadows (Design.md v11) */
--shadow-ios-1: 0 1px 4px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.04);
--shadow-ios-2: 0 4px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06);
--shadow-ios-3: 0 12px 40px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.06);
```

## GA Tri-Color (Nav Only)

```css
/* These colors appear ONLY in the sticky nav — forbidden in section content */
.nav-pill-home:     { background: var(--ga-orange); color: var(--snow); }     /* #ff5e2b */
.nav-pill-creators: { background: var(--ga-green);  color: var(--ink);  }     /* #4ade80 */
.nav-pill-merchants:{ background: var(--ga-sky);    color: var(--ink);  }     /* #93c5fd */
.nav-pill-pricing:  { background: var(--surface-3); color: var(--char); }     /* #ece9e0 */
```

## Brand Colors

```css
/* Role-locked: no mixing */
var(--brand-red)   /* Primary CTA only */
var(--n2w-blue)    /* Secondary CTA only */
var(--champagne)   /* Ceremonial: badges, awards — ≤3 per viewport */
```

## Editorial Moments (≤1 per viewport)

```css
var(--editorial-pink) /* Single highlight CTA stamp — ≤1 per page */
```
(Editorial Blue `#1e5fad` is retired from footer use — now only for special editorial sections if needed)
