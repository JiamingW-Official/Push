---
name: push-design-spec/panels
description: "Panel and section layout rules: grid, spacing tokens, 8px snap, negative-space table, section padding, responsive breakpoints. Load when building or auditing page layout structure."
---

# Panel & Section Layout Rules — Figma v12

---

## § Grid System

```
Desktop:  12 cols / 24px gutter / 64px outer margin / 1140px container max
iPad:      8 cols / 20px gutter / 48px outer margin
Mobile:    4 cols / 16px gutter / 24px outer margin
```

```css
.container { max-width: 1140px; margin: 0 auto; padding: 0 64px; }
@media (max-width: 1023px) { .container { padding: 0 48px; } }
@media (max-width: 767px)  { .container { padding: 0 24px; } }
```

---

## § 8px Grid — ALL dimensions snap

- Every width / height / padding / margin / gap / top / left snaps to 8px
- Half-grid (4px) **only** for hairlines and chip gaps
- NO: `padding: 22px` / `margin: 10px` / `gap: 6px` (use 8px)
- Exception: pill label `padding: 4px 12px` (4px vertical OK for hairline)

```css
/* Accepted spacing values */
4px   /* hairlines + chip padding only */
8px   /* minimum unit */
12px  /* chip / badge / small gap */
16px  /* standard small gap */
24px  /* card inner padding, gutter */
32px  /* section inner gap */
40px  /* panel padding */
48px  /* section title → content */
56px  /* section title margin-bottom (design-spec spec) */
64px  /* container horizontal padding */
80px  /* footer margin-top, section top on large panels */
96px  /* section vertical padding (standard) */
120px /* footer padding-top */
```

---

## § Negative-Space Tokens (Design.md §6 — LOCKED)

| Context | Space | Value |
|---------|-------|-------|
| Hero title → subtitle | gap | 32px |
| Hero subtitle → CTA | gap | 48px |
| Eyebrow → H1/H2 | gap | 16px |
| H1 → body | gap | 24px |
| Body → CTA | gap | 32px |
| Card title → body | gap | 12px |
| Card body → footer | gap | 16px |
| Card grid gap | — | 24px |
| Icon (40px tile) → text | — | 16px |
| Inline icon (24px) → text | — | 12px |
| Eyebrow icon (12px) → text | — | 8px |
| Adjacent buttons (row) | gap | 16px desktop / 12px mobile |

---

## § Section Padding

```css
/* Standard section */
section { padding: 96px 0; }

/* Responsive reduction */
@media (max-width: 1023px) { section { padding: 80px 0; } }
@media (max-width: 767px)  { section { padding: 56px 0; } }
```

---

## § Panel Types & Their Rules

### 1. Standard Panel (Dark)
```css
background: var(--ink-2);  border-radius: 8px;  padding: 40px;
```

### 2. Standard Card (Light)
```css
background: var(--surface-2);  border-radius: 8px;  padding: 24px;
box-shadow: var(--shadow-1);
```

### 3. KPI Card
```css
background: var(--surface);  border-radius: 16px;  padding: 24px;
box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
```

### 4. Candy Panel
```css
border-radius: 28px;  /* distinctive large radius */
```

### 5. Ticket Panel
```css
background: var(--ga-orange);  border-radius: 8px;  padding: 64px 96px;
/* 4 grommet circles + 2 perf lines inside */
```

### 6. Full-Bleed Photo Card Hero
```css
border-radius: 0;  /* permitted 0 only here */
```

### 7. Editorial Hero Tile (Billboard)
```css
border-radius: 0;  /* permitted 0 only here */
box-shadow: none;  /* flat */
```

### 8. Liquid Glass Floating Tile
```css
background: rgba(255,255,255,0.55);
backdrop-filter: blur(12px);
border-radius: 8px;  padding: 20px 24px;
border: 1px solid rgba(255,255,255,0.30);
box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.50) inset;
```

---

## § Marketing Panel Discipline

- 3–5 stacked panels per marketing page
- Alternating warm/cool tone (not same background twice in a row)
- ≤1 floating liquid-glass tile per panel
- ≤1 image card per panel
- ≤1 saturated editorial moment (orange/pink) per panel
- ≤1 Ticket Panel per PAGE (Marketing only — never in Product)
- ≤1 Magvix Italic Signature Divider per 2 panels (≤2 per page)

---

## § Title Anchoring (v11)

- **Hero titles:** bottom-left (NOT centered). Use `align-self: flex-end` or absolute positioning.
- **Section titles:** top-left. Standard block flow.
- **Footer Giant Wordmark:** bottom-left.
- **Centered titles ONLY inside:** Ticket Panel / Photo Card overlay / Modal.

---

## § Responsive Rules

Same layout + hierarchy across breakpoints. Column count and spacing scale; never redraw.

| Breakpoint | Columns | Outer Margin | Section V Pad |
|-----------|---------|-------------|--------------|
| Desktop (≥1024px) | 12 | 64px | 96px |
| iPad (768–1023px) | 8 | 48px | 80px |
| Mobile (<768px) | 4 | 24px | 56px |

Touch targets ≥ 44×44px on mobile.

---

## § Icon System

- One icon family per page
- Every icon in 40×40 tile with `border-radius: 12px` (var(--r-lg)), surface or ink background
- Internal icon: 20–24px
- Naked SVG on Candy Panel or Ticket Panel: **forbidden**

---

## § Modular Sequence for Marketing Pages

Standard section stacking order:
1. Hero (Magvix headline, mono eyebrow, CTA pair)
2. How it Works / Feature strip (3–4 steps or icons)
3. Social proof / Numbers (KPI or Cinema Selects table)
4. Testimonials / Case studies
5. Ticket Panel CTA (≤1 per page)
6. Footer

---

## § Audit Checklist (per page)

Run this when reviewing or building a marketing page:

- [ ] Panel border-radius: 8px standard, 16px KPI, 28px Candy, 0 only on full-bleed
- [ ] Body text: 20px / lh 1.40 / ls -0.1em
- [ ] Hero title: Magvix, clamp(64px,9vw,200px), lh 0.85, ls -0.02em
- [ ] Section headings: Darky 40px 800, lh 1.05, ls -0.02em
- [ ] All spacing on 8px grid
- [ ] Section padding: 96px vertical desktop
- [ ] Container max-width 1140px, 64px horizontal padding
- [ ] No hardcoded hex colors (only token vars)
- [ ] Hover: every card/link/button has translate(2px,2px)
- [ ] ≤1 Ticket Panel, ≤2 Magvix Dividers, ≤1 editorial moment per panel
- [ ] Eyebrows: parenthetical `(LABEL)` on Marketing, canonical `LABEL` on Product
- [ ] 12px minimum font size in production (10px is Figma-only annotation)
- [ ] Touch targets ≥44×44px
