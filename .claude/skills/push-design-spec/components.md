---
name: push-design-spec/components
description: "Exact CSS specs for every Push component. Load when implementing or auditing a specific component: nav, hero, panel card, button, glass tile, KPI card, table, ticket panel, article card, photo row."
---

# Component Specs — Figma v12 Exact CSS

> All specs extracted directly from `/Users/jiamingw/Documents/Claude/Projects/Project Push/design-spec.html`.
> When spec conflicts with intuition, the spec wins.

---

## § NAV — Sticky Top Bar

```css
nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(15,14,14,0.88); /* dark pages */
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; gap: 16px;
  padding: 0 40px; height: 56px;
}

/* Logo / brand mono */
.nav-mono {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ink-6); margin-right: auto;
}

/* Nav links */
nav a {
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 6px 12px; border-radius: 50vh;
  background: rgba(255,255,255,0.06);
}
```

---

## § HERO

```css
.hero { padding: 120px 0 96px; }

.hero-eyebrow {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.5em; text-transform: uppercase;
  color: var(--ga-orange); margin-bottom: 24px;
}

.hero-title {
  font-family: var(--font-hero); /* Magvix */
  font-size: clamp(64px, 9vw, 160px);
  font-weight: 400; line-height: 0.85; letter-spacing: -0.02em;
  color: var(--snow);   /* or var(--ink) on light pages */
  margin-bottom: 32px;
}

.hero-sub {
  font-family: var(--font-body);
  font-size: 18px; color: var(--ink-5);
  line-height: 1.55; max-width: 600px; letter-spacing: -0.02em;
}

.hero-meta {
  display: flex; gap: 24px; margin-top: 48px;
}

.hero-badge {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--ink-5); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50vh; padding: 6px 14px;
}
```

---

## § PANEL (Generic Dark Surface)

```css
.panel {
  background: var(--ink-2);
  border-radius: 8px;   /* ALWAYS 8px for standard panels */
  padding: 40px;
  margin-bottom: 24px;
}

.panel-label {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: var(--ink-5); margin-bottom: 32px;
}
```

---

## § BUTTON LARGE (Magvix Italic CTA)

Full-width editorial button:
```css
.btn-large {
  width: 100%; height: 160px;
  display: grid; place-items: center;
  font-family: var(--font-hero); font-style: italic;
  font-size: clamp(40px, 6vw, 80px);
  color: var(--snow);
  background: transparent;
  border: 1px solid var(--ink-4);
  border-radius: 8px;
  cursor: pointer;
  transition: background 240ms ease, color 240ms ease, border-color 240ms ease;
}
.btn-large:hover { background: var(--ga-orange); color: var(--ink); border-color: transparent; }
```

## § BUTTON SMALL (Standard UI)

```css
.btn-small {
  display: inline-flex; align-items: center;
  padding: 14px 28px;
  background: var(--ink-2); color: var(--snow);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 16px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.04em;
  cursor: pointer; border: none;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-small:hover { transform: translate(2px, 2px); }
.btn-small:active { transform: translate(3px, 3px) scale(0.98); }
```

---

## § LIQUID GLASS TILE (Floating Widget)

```css
.glass-tile {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.50) inset;
  border-radius: 8px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.30);
}

.glass-tile-label {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.3em; text-transform: uppercase;
  color: rgba(15,14,14,0.70); margin-bottom: 6px;
}

.glass-tile-value {
  font-family: var(--font-display);
  font-size: 40px; font-weight: 800;
  line-height: 1; letter-spacing: -0.03em;
  color: var(--ink);
}
```

---

## § TICKET PANEL / SUBSCRIBE BLOCK

```css
.ticket-panel {
  background: var(--ga-orange);
  border-radius: 8px;            /* NOT 0 — 8px always */
  padding: 64px 96px;
  display: flex; flex-direction: column;
  align-items: center; gap: 20px;
  position: relative; overflow: hidden;
}

/* Grommets — 4 circles, SOLID ink fill (NOT outline) */
.grommet {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--ink);        /* solid fill ONLY */
  /* NO border, NO box-shadow outline */
}
.subscribe-grommets-left  { position: absolute; left: 16px;  top:0; bottom:0; display:flex; flex-direction:column; justify-content:space-around; padding:24px 0; }
.subscribe-grommets-right { position: absolute; right: 16px; top:0; bottom:0; display:flex; flex-direction:column; justify-content:space-around; padding:24px 0; }

/* Perforation lines */
.perf-left  { position: absolute; left: 40px;  top:0; bottom:0; width:0; border-left: 2px dashed rgba(0,0,0,0.28); }
.perf-right { position: absolute; right: 40px; top:0; bottom:0; width:0; border-left: 2px dashed rgba(0,0,0,0.28); }

/* Headline */
.ticket-headline {
  font-family: var(--font-hero); font-style: italic;
  font-size: clamp(40px, 6vw, 80px);
  color: var(--ink); text-align: center;
  line-height: 1.0; letter-spacing: -0.01em;
}

/* Body */
.ticket-body {
  font-family: var(--font-body);
  font-size: 16px; color: var(--ink-2);
  text-align: center; max-width: 480px; line-height: 1.55;
}

/* CTA — Filled Ink variant */
.ticket-cta {
  background: var(--ink); color: var(--snow);
  border-radius: 8px; padding: 14px 28px;
  font-family: var(--font-body); font-size: 16px;
  font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
  border: none; cursor: pointer; margin-top: 8px;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ticket-cta:hover { transform: translate(2px, 2px); }
```

---

## § KPI CARD GRID (§8.14)

```css
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px; margin-bottom: 24px;
}
@media (max-width: 768px) { .kpi-grid { grid-template-columns: 1fr 1fr; gap: 16px; } }

.kpi-card {
  background: var(--surface);
  border-radius: 16px;           /* KPI uses 16px, NOT 8px */
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  padding: 24px;
  cursor: pointer;
  transition: transform 120ms ease;
}
.kpi-card:hover { transform: translate(2px, 2px); }

.kpi-card__eyebrow {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 700;
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

.kpi-card__delta {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
}
.kpi-card__delta--up   { color: #22c55e; }
.kpi-card__delta--down { color: var(--brand-red); }
.kpi-card__delta--flat { color: var(--ink-3); }
```

---

## § EDITORIAL TABLE ROW (Cinema Selects §8.15)

```css
/* Container */
.cs-block { background: var(--surface); border-radius: 12px; padding: 32px 40px; }
.cs-block__eyebrow { /* standard eyebrow pattern */ }
.cs-block__title   { /* standard Darky 28px 800 heading */ }

/* Opening rule */
.cs-block__opening-rule { width: 100%; height: 1px; background: var(--char); }

/* Row */
.cs-row {
  display: grid;
  grid-template-columns: 28% 72%;
  align-items: baseline;
  padding: 20px 0; gap: 24px;
  border-bottom: 1px dotted rgba(26,26,26,0.20);
}
.cs-row:last-child { border-bottom: none; }

.cs-row__label {
  font-family: var(--font-display);
  font-size: 18px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em;
  color: var(--ink);
}
.cs-row__value {
  font-family: var(--font-body);
  font-size: 15px; line-height: 1.55; letter-spacing: -0.01em;
  color: var(--ink-3);
}

/* Log variant (mono label) */
.cs-row--log .cs-row__label {
  font-family: var(--font-body);
  font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--ink-5); align-self: center;
}

/* Status chips */
.cs-status {
  font-family: var(--font-body); font-size: 12px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 50vh;
}
.cs-status--verified { background: rgba(34,197,94,0.12); color: #16a34a; }
.cs-status--pending  { background: rgba(191,161,112,0.18); color: #92701a; }
.cs-status--declined { background: rgba(193,18,31,0.10); color: var(--brand-red); }

/* Horizontal divider */
.cs-divider { width: 100%; height: 1px; background: var(--mist); margin: 40px 0; }
```

---

## § ARTICLE CARD (Large + Small)

```css
/* Large — editorial split */
.article-large {
  display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px;
  background: var(--ink); border-radius: 8px; padding: 40px;
}
.article-photo { aspect-ratio: 4/5; border-radius: 8px; }
.article-headline {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 56px); font-weight: 700;
  color: var(--snow); line-height: 1.05; letter-spacing: -0.02em;
}
.article-body { font-family: var(--font-body); font-size: 16px; line-height: 1.55; color: var(--ink-5); }
.article-meta { font-family: var(--font-body); font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--ink-4); }
.article-caption { font-family: var(--font-body); font-size: 12px; color: var(--ink-4); margin-top: 8px; }

/* Small grid — 2-up */
.article-small { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; background: var(--ink); border-radius: 8px; padding: 40px; }
.article-small-card { display: flex; flex-direction: column; gap: 0; cursor: pointer; transition: transform 180ms ease; }
.article-small-card:hover { transform: translate(2px, 2px); }
.article-small-img { aspect-ratio: 4/5; border-radius: 8px; }
.article-small-caption { font-family: var(--font-body); font-size: 12px; color: var(--ink-4); margin-top: 8px; }
.article-small-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--snow); margin-top: 12px; line-height: 1.1; }
```

---

## § PHOTO ROW (§20.9)

```css
.photo-row { display: flex; gap: 20px; width: 100%; }
.photo-item {
  flex: 1; display: flex; flex-direction: column; gap: 8px;
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.photo-item:hover { transform: translate(2px, 2px); }
.photo-img { aspect-ratio: 1; border-radius: 4px; overflow: hidden; }
.photo-caption { font-family: var(--font-body); font-size: 12px; color: var(--ink-4); }
```

---

## § SIDEBAR (Liquid Glass — §8.13)

```css
.sidebar {
  width: 248px; flex-shrink: 0;
  background:
    radial-gradient(ellipse at 20% 0%,  rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 55%),
    radial-gradient(ellipse at 95% 100%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 60%),
    rgba(255,255,255,0.60);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border-right: 0.5px solid rgba(255,255,255,0.40);
  box-shadow: 1px 0 0 rgba(10,10,10,0.06), inset -1px 0 0 rgba(255,255,255,0.50);
  display: flex; flex-direction: column; z-index: 2;
}

/* Logo area */
.sidebar__logo { height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 16px; flex-shrink: 0; }
.sidebar__monogram {
  width: 32px; height: 32px; border-radius: 10px;
  background: var(--ink); color: var(--snow);
  display: grid; place-items: center;
  font-family: var(--font-display); font-size: 14px; font-weight: 700;
}
.sidebar__wordmark {
  font-family: var(--font-display); font-size: 16px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink);
}

/* Section label */
.sidebar__section-label {
  font-family: var(--font-body); font-size: 12px; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: rgba(26,26,26,0.38); padding: 16px 16px 6px;
}

/* Nav item */
.sidebar__item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 8px; margin: 1px 8px;
  font-family: var(--font-body); font-size: 14px; font-weight: 500;
  color: rgba(26,26,26,0.55); cursor: pointer; text-decoration: none;
  transition: background 180ms, box-shadow 180ms, color 180ms;
}
.sidebar__item:hover {
  background: rgba(255,255,255,0.55);
  box-shadow: 0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.60);
  color: var(--ink);
}
/* Active state — elevated white card, NO left border accent */
.sidebar__item.is-active {
  background: rgba(255,255,255,0.85);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.70);
  color: var(--ink); font-weight: 600;
}

/* Search bar */
.sidebar__search-input {
  width: 100%; height: 32px;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(255,255,255,0.40); border-radius: 8px;
  padding: 0 10px 0 30px;
  font-family: var(--font-body); font-size: 13px; color: var(--ink);
}
.sidebar__search-input:focus {
  background: rgba(255,255,255,0.78);
  box-shadow: 0 0 0 3px rgba(193,18,31,0.08);
}
```
