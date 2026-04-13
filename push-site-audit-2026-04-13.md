# Push Site Audit — 2026-04-13

> Audited URLs:
> - `jiamingw-official.github.io/Push/` (Landing)
> - `jiamingw-official.github.io/Push/creator/signup` (Creator Signup)
> - `jiamingw-official.github.io/Push/demo` (Demo Hub → Creator / Merchant / Customer)

---

## 🔴 Critical — Page-breaking bugs

### 1. Landing page: 12 sections invisible (opacity: 0)

**Root cause:** `.reveal` elements start with `opacity: 0; transform: translateY(24px)` in CSS. The `ScrollRevealInit` component uses `IntersectionObserver` to add `.visible` class on scroll. On the GitHub Pages static export, the observer fires and adds `.visible` to some elements, but **certain `.reveal.visible` elements remain at `opacity: 0`** due to a CSS specificity conflict — landing.css and globals.css both define `.reveal` rules, and something is preventing the transition from completing.

**Affected sections (entirely invisible to visitors):**
- Creator tier showcase (Clay/Seed card + tier progression)
- "03 How it Works" — header + all 3 step cards
- "04 Pricing" — header + all 3 pricing cards
- Total: **12 DOM nodes** with `opacity: 0` despite having `.visible` class

**Impact:** ~60% of the landing page content is invisible. Visitors see only the hero, stats bar, and CTA — they never see the value prop sections, how-it-works, or pricing.

### 2. Landing page: GSAP, ScrollTrigger, and Lenis not loaded

Although `gsap` (3.14.2) and `lenis` (1.3.21) are in `package.json`, runtime checks confirm **none are loaded** on the live page:
- `typeof gsap === 'undefined'` → true
- `typeof ScrollTrigger === 'undefined'` → true  
- `typeof Lenis === 'undefined'` → true

The page does import Lenis in `SmoothScroll.tsx`, but either the component isn't rendering in the static build or the import is tree-shaken away. This means there's no smooth scrolling and the scroll-driven reveal system is entirely CSS-transition based (IntersectionObserver fallback only).

---

## 🟠 High — Functional bugs

### 3. Nav links invisible on scroll

When the sticky nav pins on `section-bright` (light background), the nav links (HOME, FOR MERCHANTS, FOR CREATORS, PRICING) become nearly invisible — they appear to retain a light/white color against the `#fafaf8` background. Only JOIN AS CREATOR and GET STARTED remain visible because they have explicit button styling.

### 4. "Proven+" tier-lock label overlaps card content (Creator Dashboard)

On the Discover feed, campaigns requiring Proven+ tier display a large, semi-transparent "Proven+" text that overlays the campaign name. Glossier "NYC Store Experience" and KITH "Creator Series" titles are unreadable. This should be a small tag/badge, not a full-card overlay.

### 5. Merchant dashboard: first campaign missing data columns

"Free Latte for a 30-Second Reel" row has blank PAYOUT and QR SCANS cells. The other campaigns (Morning Rush, Holiday Blend) show data normally. Either demo data is incomplete or a rendering condition is wrong.

### 6. Merchant dashboard: table right-overflow

The APPLICANTS column is partially clipped on the right edge. The first row shows "Pro..." (truncated). Table needs horizontal scroll or responsive column sizing.

### 7. Creator Signup: form inputs lack `name` attributes

All `<input>` fields have `id` but no `name` attribute. This means form data won't serialize correctly on submission. Every field also has `required: false` — a user could submit a completely empty form.

### 8. Creator Signup: no terms/consent checkbox

No terms of service or privacy policy agreement checkbox exists. This is a legal requirement before collecting user data (especially email + password).

---

## 🟡 Medium — Design system violations

### 9. Landing page: "35% Platform margin target" stat exposed

The hero stats bar shows "35% — Platform margin target per campaign". This is an internal business metric, not a customer-facing value prop. This was previously flagged in `premium-fixes-agent-prompt.md` as bug #7 ("Ticker has internal metrics").

### 10. Status badges have border-radius

ACTIVE/CLOSED (merchant dashboard) and COMPLETED/PENDING/PROCESSING (creator earnings) badges use rounded pill shapes, violating the `border-radius: 0` rule. These are not filter chips (the allowed exception) — they're status indicators.

### 11. Earnings math doesn't add up

The earnings summary shows "$340 TOTAL EARNED", but the visible campaign list sums to ~$130 ($20 + $35 + Free + $75 + Free). Either there are missing/hidden campaigns, or the total is hardcoded incorrectly.

### 12. Earnings map unchanged from Discover

When switching to the EARNINGS tab, the right-panel map still shows campaign price markers ($120, $75, etc.) identical to the Discover view. The map should either show earnings-related data or be hidden.

### 13. Direct URL to /creator/dashboard redirects to /signup

Navigating directly to `/creator/dashboard` (without going through `/demo/creator`) redirects to `/creator/signup`. The demo session state isn't URL-persistent — if a user bookmarks or shares the dashboard URL, it breaks.

---

## 🟢 Low — Polish & improvements

### 14. "Join 40+ creators" claim on signup page

The left panel says "Join 40+ creators earning on Push." Verify this number is accurate and update regularly, or change to a non-specific claim.

### 15. Landing hero right side is empty

The hero section is text-only on the left with no visual on the right ~50% of the viewport. This was previously flagged in the design audit as an opportunity for a QR flow animation or visual.

### 16. Demo banner dot (border-radius: 50%)

The red dot in "PREVIEW MODE" banner uses `border-radius: 50%`. Minor — a dot indicator is a reasonable exception, but not listed in Design.md exceptions.

### 17. Customer scan page — "Confirm Visit" italic heading in CTA

"Confirm Visit" button uses italic Darky, which is unusual for a CTA — body/UI elements should use CS Genio Mono per the type system. The button works fine otherwise (correct colors, hard shadow, 0 border-radius).

---

## ✅ What's working well

- **Hero section** renders correctly with strong editorial typography (Darky 900 vs 200 weight contrast)
- **Creator Signup** layout is clean — split panel, tier path, form sections well-organized
- **Demo hub** choice page is elegant and on-brand
- **Customer scan page** is excellent — clear value prop, minimal, hard-shadow CTA, "NO APP DOWNLOAD REQUIRED" reinforcement
- **Creator Discover feed** has rich, functional campaign cards with map integration
- **Merchant dashboard** structure is solid — campaign table, sidebar nav, plan indicator
- **border-radius: 0** is enforced on all major components (cards, buttons, inputs, modals)
- **Darky + CS Genio Mono** font system loads and renders correctly
- **Pearl Stone (#f5f2ec)** background used consistently
- **Filter chips** correctly use pill shape (50vh exception)

---

## Priority fix order

1. **Fix `.reveal` opacity bug** — this alone will restore 60% of landing page content
2. **Fix nav link colors** on light backgrounds  
3. **Fix "Proven+" overlay** in creator Discover feed
4. **Add `name` attributes** + `required` to signup form inputs
5. **Remove "35% margin" stat** from hero
6. **Fix merchant table data** + overflow
