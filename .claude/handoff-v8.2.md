# Push v8.2 Session Handoff

## Current State

**Branch:** `style/v8.2-premium-editorial` (no PR yet, needs merge to main)
**Vercel:** auto-deploys on push, preview URL on this branch
**Dev server:** `npm run dev` on port 3000

---

## What Was Done This Session

### 1. Landing Page v8.2 Redesign (app/(marketing)/page.tsx + landing.css)
- **Logical typography hierarchy:** "Turn"(weight 300, muted) + "creators"(900, white) + "into"(300, muted) + "results."(900, red italic)
- **Dual font enforcement:** Darky for display headings, CSGenioMono explicitly assigned to ALL labels/badges/metadata/buttons/descriptions
- **Ghost text pattern:** Bold heading + faded continuation (weight 300, rgba opacity 0.12 light / 0.16 dark) on every section
- **Section-unique layouts:** asymmetric hero, split merchant grid, editorial step list, vertical-rule pricing, single pull-quote
- **Apple iOS 26 interactions:** spring curve `cubic-bezier(0.32, 0.72, 0, 1)` on all transitions, `:active` haptic scale(0.97), magnetic buttons (via LandingInteractivity.tsx), dashboard hover lift, step red-line reveal
- **Container narrowed to 1080px** (override from global 1200px)
- **Section padding:** 160px light / 180px dark / 120px compact / 200px CTA
- **CTA section left-aligned** (was centered)
- **Minimum font size floor: 10px** (was 8px). Body text 13px, features 12px, labels 11px, buttons 11px

### 2. Dark Section Contrast Fix
- All white-on-dark text opacities boosted (labels 0.45, body 0.55, ghost 0.16, tier material 0.4, descriptions 0.45)
- Tier cards: stronger background (0.04 base / 0.07 featured), visible top borders
- Buttons outline-light: border 0.15, text 0.5
- Proof strip names stronger (opacity 0.3)

### 3. Creator Dashboard — 100 NYC Campaigns
- **File:** `app/(creator)/creator/dashboard/page.tsx`
- **100 DEMO_CAMPAIGNS** across 30+ real NYC neighborhoods (Manhattan, Brooklyn, Queens, Bronx)
- All campaigns have Unsplash placeholder images (verified all load)
- Tier distribution: ~42% seed, 19% explorer, 24% operator, 7% proven, 5% closer, 3% partner
- Category mix: Food 37, Lifestyle 16, Fitness 13, Coffee 13, Beauty 13, Retail 12
- Recommended cards also show images (was letter fallback)

### 4. LandingInteractivity.tsx Fixes
- Corrected selectors: `.btn-fill, .btn-outline, .btn-outline-light` (was `.btn-primary, .btn-ghost`)
- Corrected hero headline selector: `.hero-h` (was `.hero-headline`)
- Magnetic buttons: hero CTAs strength 0.25/radius 80, all other buttons 0.15/50

---

## Key Files

| File | Purpose |
|------|---------|
| `app/(marketing)/page.tsx` | Landing homepage (~565 lines) |
| `app/(marketing)/landing.css` | Landing styles (~1340 lines) |
| `components/layout/LandingInteractivity.tsx` | Hero spotlight, magnetic buttons, scroll parallax |
| `components/layout/ScrollRevealInit.tsx` | IntersectionObserver .reveal -> .visible |
| `app/(creator)/creator/dashboard/page.tsx` | Creator dashboard with 100 demo campaigns |
| `app/(creator)/creator/dashboard/dashboard.css` | Creator dashboard styles |
| `Design.md` | Design system source of truth |
| `app/globals.css` | Design tokens, font declarations, container defaults |

---

## Design System (MUST READ before any UI work)

Read `Design.md` at project root. Core constraints:
- **border-radius: 0** everywhere (exceptions: map pins 50%, filter chips 50vh, back-to-top 50%)
- **6 brand colors only:** Flag Red #c1121f, Molten Lava #780000, Pearl Stone #f5f2ec, Deep Space Blue #003049, Steel Blue #669bbc, Champagne Gold #c9a96e
- **2 fonts only:** Darky (display/headings, weights 100-900) + CS Genio Mono (body/labels/UI)
- **Light mode only**, 8px spacing grid
- **Interactions:** GSAP ScrollTrigger + Lenis smooth scroll, Apple spring curves
- **References:** ashleybrookecs.com (editorial big type) + sanrita.ca (minimal art feel)

---

## Pending / Next Steps

### Immediate
1. **Create PR** for `style/v8.2-premium-editorial` -> main and merge
2. **Landing page refinement** — user is a UX expert, may have more feedback on specific sections
3. **Verify Vercel production deploy** after merge

### Feature Development
4. **Merchant dashboard** — `app/(merchant)/merchant/dashboard/page.tsx` exists but may need similar polish
5. **Creator detail panel** — slide-out panel when clicking a campaign card (exists but may need image support)
6. **QR code attribution flow** — core product feature, see `.claude/skills/push-attribution`
7. **Campaign creation flow** — merchant-side, see `app/(merchant)/merchant/campaigns/new/`
8. **Payment/payout flow** — creator earnings, milestone tracking

### Design Polish
9. **Mobile responsive** — landing page responsive breakpoints exist (1024/768/640/400px) but not verified recently
10. **Header** — always-dark premium gradient style (done in prior session, merged to main)
11. **Footer** — may need design refresh to match v8.2 aesthetic
12. **for-merchants page** — `app/(marketing)/for-merchants/page.tsx` exists, may need v8.2 treatment

---

## Architecture Notes

- **Next.js App Router** with route groups: `(marketing)` for public pages, `(creator)` for creator dashboard, `(merchant)` for merchant dashboard
- **Demo mode:** cookie `push-demo-role=creator` set via `/demo/creator` entry page, detected by `checkDemoMode()` in dashboard
- **Supabase** for auth/data (real mode), demo mode uses hardcoded `DEMO_*` constants
- **MapView** component: Leaflet-based, dynamically imported (no SSR)
- **SmoothScroll** wrapper in marketing layout for Lenis
- **CustomCursor** component: red dot that follows mouse (fixed position, intentional design element)
- **StatCounter** component: animated number counting for hero stats

---

## User Preferences

- All replies in Chinese, code comments in English, git commits in English
- Concise output, no unnecessary explanation
- Understand before acting, small precise changes, verify after changes
- User is a UX design expert — expects premium, editorial, 2026-aesthetic design
- Hates: AI slop, glassmorphism, aurora gradients, corporate/template feel, too-centered layouts
- Loves: negative space, left-alignment, logical typography weight, bold weights (900), readable ghost text, Apple-grade interactions
