---
name: push-ui-template
description: "SaaS website template extraction — all layout structures, section patterns, interaction behaviors, and component specs. Load before building any page. Sub-files: sections.md, interactions.md, components.md"
---

# Push UI Template — Master Reference

> Extracted from saas-company-website-template. This skill defines the structural blueprint for all Push pages.
> **Colors, fonts, text content** are NOT here — see Design.md for those.
> This skill focuses on: layout structures, section ordering, interaction behaviors, component specs, animation triggers.

## Sub-Files (Load On Demand)

| File | When to Load |
|------|-------------|
| `sections.md` | Building a new page or section — has every section type with full HTML structure |
| `interactions.md` | Adding animations, scroll effects, hover states, parallax, counters, carousels |
| `components.md` | Implementing specific components: nav, cards, accordions, forms, modals, pricing, blog. **v5.0 additions at the top** (AgentOutputDemo, VerificationBadge, goal form, agent pending/preview, AI verification queue) |

## v5.0 New Components — Index

Added April 2026 as part of v5.0 (AI-Powered Customer Acquisition Agency). Full specs in `components.md` sections 0.1–0.6.

| Component | Path | Use on |
|-----------|------|--------|
| `AgentOutputDemo` | `components/landing/AgentOutputDemo.tsx` | Landing hero (≥1100px only) — fixture of one agent run |
| `VerificationBadge` | `components/landing/VerificationBadge.tsx` | Marketing pages — QR / Vision / Geo trust strip |
| Merchant goal form | `app/(marketing)/merchant/pilot/page.tsx` + `app/(merchant)/merchant/onboarding/page.tsx` | Any v5.0 onboarding surface |
| Agent pending (`.agent-pending-*`) | `app/(merchant)/merchant/onboarding/agent-onboarding.css` | While agent runs (1–3s) |
| Agent preview (`.agent-preview-*`) | same file | Surfacing AI-returned results (summary + matches + brief) |
| AI verification queue | `app/(admin)/admin/ai-verifications/page.tsx` | Admin review of manual_review verdicts |

Animation references — for the exact CSS keyframes / delays behind the above:
- `.agent-demo*` in `app/(marketing)/landing.css` (hero terminal card, stagger on `.agent-demo-item`)
- `.agent-pending-*` + `@keyframes agent-pulse` / `agent-slide` / `agent-line-in` in `app/(merchant)/merchant/onboarding/agent-onboarding.css`

## Quick Reference — Page Blueprint

### Global Page Structure
```
<header.header> — Sticky nav with Headroom.js (hide on scroll-down, show on scroll-up)
  <hero/page section> — Full-viewport hero with display type + media/Lottie
<main>
  <section.section> — Repeating content sections with decorative SVG shapes
  <section.join> — CTA section with counter animation
  <section.testimonials> — Swiper carousel + ticker stripe
</main>
<footer.footer> — Logo, nav links, contacts, socials, back-to-top
```

### Page Types Available
| Page | Layout Pattern |
|------|---------------|
| **Home** | Hero (split: text+Lottie) → Services list → About (split: text+media) → Chart slider → Challenges grid → Join CTA → Testimonials |
| **Home 2** | Hero (typewriter+video+Lottie) → About (numbered items) → Features (counter stats+parallax) → Video embed → Challenges (6-grid) → Join CTA → Testimonials + Ticker |
| **About** | Breadcrumb → Gallery slider → Stats counters → Video → Feedback form+Lottie → Recent posts |
| **Services** | Breadcrumb → Service cards (image+icon+bullets+CTA) → Ticker stripe |
| **Service Detail** | Breadcrumb+Lottie → Video+bullets → App section (numbered list) → Features → Join CTA |
| **Prices** | Breadcrumb → 3-column pricing cards → Challenges grid → Collapsible comparison table |
| **Contact** | Breadcrumb → Map+info → FAQ accordion → Feedback form → Ticker |
| **FAQ** | Breadcrumb → 5-item accordion with numbered sub-lists |
| **Blog Grid** | Breadcrumb → Filter buttons → Shuffle.js grid → Pagination |
| **Blog Sidebar** | Breadcrumb → 2-col (posts list + sidebar) → Pagination |
| **Post** | Breadcrumb → Article (share panel, images, quote, progress bars, tags) → Prev/Next nav |
| **404** | Ticker stripe → Centered CTA + SVG illustration (no header/footer) |

### Section Spacing Pattern
- Between sections: `80px–120px` vertical padding (responsive, reduces on mobile)
- Container max-width: matches `--content-width` (1180px)
- Inner elements use 8px grid

### Decorative Shape System
Every section can have positioned SVG shapes:
```
section
├── .section_shapes (absolute positioned container)
│   ├── .half--left → .circle--big, .circle--small
│   └── .half--right → .circle--big, .circle--small
└── .container (actual content)
```
Shapes use `z-index: -1`, absolute positioning, opacity variations.

### Responsive Strategy
- Mobile-first with progressive enhancement
- Breakpoints: 413 / 575 / 768 / 992 / 1200 / 1400 / 1600px
- Flex direction flips: `flex-column` → `flex-row` at breakpoints
- Grid: 1-col → 2-col → 3-col → 4-col
- Mobile nav: hamburger collapse at < 992px
- Swiper carousels: fewer slides on mobile, destroy on desktop if grid preferred

### Library Stack
| Library | Purpose |
|---------|---------|
| GSAP + ScrollTrigger | Scroll-driven animations (Push custom) |
| Lenis | Smooth scrolling |
| AOS | Animate-on-scroll (fade-up, with stagger delays) |
| Swiper | Carousels (coverflow, standard, responsive destroy) |
| CountUp.js | Number counter animations |
| Headroom.js | Smart sticky header |
| Shuffle.js | Filterable grid layout |
| Lottie Player | JSON-based vector animations |
| SweetAlert2 | Modal notifications / signup popups |
| Vanilla LazyLoad | Image lazy loading |
| ProgressBar.js | Animated progress indicators |

### Data Attribute System
| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-text` | Typewriter source | `data-text="Build Connections"` |
| `data-value` | Counter target | `data-value="8100"` |
| `data-prefix` | Counter prefix | `data-prefix="0"` → "01" |
| `data-suffix` | Counter suffix | `data-suffix="+"` → "8100+" |
| `data-separator` | Thousands sep | `data-separator=","` → "68,000" |
| `data-aos` | AOS animation | `data-aos="fade-up"` |
| `data-aos-delay` | AOS stagger | `data-aos-delay="100"` |
| `data-target` | Filter category | `data-target="startups"` |
| `data-groups` | Item categories | `data-groups='["advices","startups"]'` |
| `data-page` | Active nav page | `data-page="about"` |
| `data-type` | Form type | `data-type="email"` |

### CSS State Classes
| Class | Meaning |
|-------|---------|
| `.active` | Toggle visibility/interaction |
| `.current` | Highlight active item (nav, filter, pagination) |
| `.sticky` | Header fixed to top |
| `.opened` | Mobile menu expanded |
| `.visible` | Modal/popup shown |
| `.fadeIn` / `.fadeOut` | Fade transitions |
| `.transform` | Icon rotation state (accordion) |
| `.error` | Form validation error |
| `.hidden` | Dismissed element |
| `.lazy` | Image pending lazy load |
