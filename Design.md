# Push — Design System

> **Authority**: This document is the single source of truth for all UI styling in the Push project.
> Any code that touches layout, color, typography, or component shape **MUST** conform to the tokens defined below.

---

## Color Palette

### Brand Colors (Core)

| Token | Name | Hex | CSS Variable | Usage |
|-------|------|-----|-------------|-------|
| **Primary** | Flag Red | `#c1121f` | `--primary` | CTA buttons, key interactive elements, brand accents, alerts |
| **Accent** | Molten Lava | `#780000` | `--accent` | Hover states, deep emphasis, dramatic accents, dark red overlays |
| **Dark** | Deep Space Blue | `#003049` | `--dark` | Dark panels, primary text color, headers, hero backgrounds |
| **Tertiary** | Steel Blue | `#669bbc` | `--tertiary` | Info states, links, badges, secondary actions, data viz |
| **Champagne** | Champagne Gold | `#c9a96e` | `--champagne` | Premium identity color — partner tier accents, luxury highlights, special badges, featured elements |

### Surface System (Layered)

| Token | Name | Hex | CSS Variable | Usage |
|-------|------|-----|-------------|-------|
| **Surface** | Pearl Stone | `#f5f2ec` | `--surface` | Default page background, panels, cards — warm but NOT yellow |
| **Surface Bright** | Snow | `#fafaf8` | `--surface-bright` | Hero bg, high-contrast sections, alternating sections |
| **Surface Elevated** | Pure White | `#ffffff` | `--surface-elevated` | Elevated cards, modals, popups, slide panels — creates depth via layering |
| **Graphite** | Graphite | `#4a5568` | `--graphite` | Secondary text, icons, subtle UI elements — richer than muted, softer than dark |

### Color Rules
- **Color Mode:** `light` only. No dark mode.
- Do **not** introduce new brand colors without updating this file first.
- **Three surface tones create depth:** `--surface` (Pearl Stone, default bg) → `--surface-bright` (Snow, hero/sections) → `--surface-elevated` (Pure White, elevated elements). This layering replaces the old yellow-tinted approach with a cleaner, premium aesthetic.
- **Champagne Gold** (`--champagne`) is the premium identity color. Use sparingly for high-value moments: partner tier highlights, featured campaign badges, earnings milestones, celebration states. Do NOT overuse — it should feel special.
- **Graphite** (`--graphite`) fills the gap between `--dark` and `--text-muted`. Use for secondary text, icon fills, and UI elements that need more weight than muted but less than dark.
- Use opacity variations for lighter shades (e.g., `rgba(0, 48, 73, 0.08)` for tinted panels).
- Text: primary text uses `--dark` (`#003049`); secondary text uses `--graphite` (`#4a5568`); muted text uses `rgba(0, 48, 73, 0.55)`.
- Page background: `--surface` (`#f5f2ec`). Not pure white, not yellow.
- Line/border default: `rgba(0, 48, 73, 0.12)` — referred to as `--line`.
- Surface-muted: `rgba(0, 48, 73, 0.04)` for subtle section backgrounds.
- **Champagne-derived tokens:** `--champagne-light: rgba(201, 169, 110, 0.12)` for tinted backgrounds; `--champagne-border: rgba(201, 169, 110, 0.35)` for borders.
- **Champagne + Surface warmth warning:** When `--champagne` elements appear on `--surface` background, ensure a cool anchor (`--dark`/`--tertiary`/`--graphite`) is nearby to prevent the page from skewing too warm. Champagne should not appear more than 3 times per page.

---

## Typography

| Token | Font Family | Usage |
|-------|-------------|-------|
| **Display / Headline** | `Darky` | All major headings (h1–h3), page titles, hero text, display typography |
| **Body / Label** | `CS Genio Mono` | Paragraph text, subtitles, button labels, captions, UI text, navigation |

### Type Scale

| Element | Font | Size | Weight | Letter-Spacing |
|---------|------|------|--------|---------------|
| Display (Hero) | Darky | `clamp(64px, 12vw, 160px)` | 900 | `-0.06em` |
| H1 | Darky | `clamp(48px, 6vw, 80px)` | 800 | `-0.05em` |
| H2 | Darky | `36px` | 700 | `-0.03em` |
| H3 | Darky | `24px` | 600 | `-0.02em` |
| H4 | Darky | `20px` | 600 | `-0.02em` |
| Body | CS Genio Mono | `16px` / `1rem` | 400 | `0` |
| Small / Label | CS Genio Mono | `14px` | 400 | `0.01em` |
| Caption | CS Genio Mono | `12px` | 400 | `0.02em` |
| Eyebrow | CS Genio Mono | `11px` | 700 | `0.08em` (uppercase) |
| Numbered Section | CS Genio Mono | `14px` | 600 | `0.04em` |

### Darky Weight System (All Available)

| Weight | File | Typical Use |
|--------|------|-------------|
| 100 Thin | `Darky-Thin.ttf` | Oversized decorative numbers, ghost text |
| 200 ExtraLight | `Darky-ExtraLight.ttf` | Large pull-quote numbers, background texture |
| 300 Light | `Darky-Light.ttf` | Secondary display text, subheadings that need elegance |
| 400 Regular | `Darky-Regular.ttf` | Default heading fallback |
| 500 Medium | `Darky-Medium.ttf` | Mid-weight accents |
| 600 SemiBold | `Darky-SemiBold.ttf` | H3, H4 |
| 700 Bold | `Darky-Bold.ttf` | H2, standard headings |
| 800 ExtraBold | `Darky-ExtraBold.ttf` | H1, strong headings |
| 900 Black | `Darky-Black.ttf` | Display/hero, brand headline |

**Weight contrast is a core design tool.** Pair heavy (900) headlines with light (200–300) secondary text for editorial drama.

### Typography Rules
- Darky is **only** for headings and display text. Never use for body copy.
- CS Genio Mono is monospaced — gives editorial-technical character. Use for everything else.
- Headlines should be large, confident, tight-tracked. Think editorial magazine covers.
- **Use weight contrast aggressively**: a Darky-900 title next to a Darky-200 stat number creates the Push editorial signature.
- Import both fonts via `@font-face` in `globals.css`. No Google Fonts fallback — these are custom.
- Fallback stack: `Darky, sans-serif` for headings; `'CS Genio Mono', 'SF Mono', 'Fira Code', monospace` for body.

---

## Shape & Spacing

| Token | Value | Description |
|-------|-------|-------------|
| **Roundedness** | `0` | **No border-radius.** All UI shapes use sharp, right-angle corners. `border-radius: 0` everywhere. |
| **Spacing** | `2` | Normal spacing. Use an 8px base grid (`8px`, `16px`, `24px`, `32px`, `40px`, `48px`, `56px`, `64px`). |

### Shape Rules

1. **No rounded corners** — Buttons, cards, inputs, modals, badges, and all containers must have `border-radius: 0`.
2. Dividers and separators should be straight, hard lines.
3. If a third-party component ships with rounded corners, override them to `0`.

### Shape Exceptions

| Element | Border-Radius | Reason |
|---------|--------------|--------|
| **Map pins** | `50%` (circle) | Cartographic convention |
| **Filter chips** | `50vh` (pill) | Interaction control standard — tappable/toggleable tokens |
| **Back-to-top button** | `50%` (circle) | Functional navigation control |

---

## Interaction & Motion Philosophy

Push's interaction design blends three references:

### 1. Editorial Scroll (ashleybrookecs.com pattern)
- **Massive display typography**: Hero headlines at `12vw`+ viewport-scaled sizes using Darky
- **Numbered sections**: Content organized as `01 / 02 / 03` — monospaced numbers in CS Genio Mono, eyebrow-sized, with the section title in large Darky below
- **Scroll-driven reveals**: Sections fade/slide into view as the user scrolls. Use `IntersectionObserver` or GSAP ScrollTrigger
- **Brand showcase strips**: Horizontal scrolling logo/partner rows
- **Services grid**: Clean grid of offerings with minimal text, strong hierarchy

### 2. Minimal Artsy (sanrita.ca pattern)
- **Scroll-to-enter**: Landing pages may use a "scroll to enter" gate — minimal intro screen that requires scroll to reveal main content
- **Monospace aesthetic**: CS Genio Mono gives the hand-crafted, studio-quality feel. Lean into it for nav, labels, metadata
- **Extreme whitespace**: Let content breathe. Large padding between sections (80px–120px vertical gaps on desktop)
- **Time/context display**: Optional subtle timestamp or location in the UI (e.g., "NYC" or current time in the navbar or footer)
- **Restrained animation**: Smooth, slow transitions (400ms–600ms). Nothing flashy.

### 3. Sticky Grid Scroll (codrops pattern)
- **Progressive reveal grid**: A sticky container holds a grid of images/cards that reveal progressively as the user scrolls
- **Dependencies**: GSAP (animation/scroll-trigger) + Lenis (smooth scrolling)
- **Use case**: Campaign discovery feed, portfolio showcase, brand gallery
- **Implementation**: Container with `position: sticky`, child elements animate `opacity` and `transform` based on scroll progress via GSAP ScrollTrigger
- **Keep lightweight**: Only use on key showcase sections, not every page

### Animation Tokens

| Keyframe | Duration | Easing | Usage |
|----------|----------|--------|-------|
| `shimmer` | 1.5s loop | linear | Skeleton loading screens |
| `pulse` | 1.8s loop | ease-in-out | Active status dot, live indicator |
| `fadeIn` | 300ms | ease forwards | Card/section entrance on mount |
| `slideInRight` | 200ms | ease forwards | Side panels, toast notifications |
| `scrollReveal` | 600ms | cubic-bezier(0.22, 1, 0.36, 1) | Section entrance on scroll (translateY(40px) → 0) |
| `stickyGridItem` | 500ms | cubic-bezier(0.22, 1, 0.36, 1) | Sticky grid child reveal (opacity 0→1, scale 0.95→1) |
| `feedCardIn` | 500ms | cubic-bezier(0.22, 1, 0.36, 1) | Feed grid card-dealing entrance |
| `scoreRingFill` | 1s | cubic-bezier(0.4, 0, 0.2, 1) | Score ring stroke animation |
| `progressFill` | 800ms | ease-out | Progress bars |
| `tierShimmer` | 2.4s loop | linear | Partner tier badge gradient |
| `badgeShimmer` | 2.8s loop | linear | Featured badge shimmer |
| `modalSlideUp` | 250ms | ease | Modal entrance |

### Micro-interactions

| Interaction | Property | Duration | Easing |
|-------------|----------|----------|--------|
| Card hover lift | `translateY(-10px)` | 360ms | cubic-bezier(0.22,1,0.36,1) |
| Image hover zoom | `scale(1.10)` | 600ms | cubic-bezier(0.22,1,0.36,1) |
| Button press | `scale(0.97)` | instant | — |
| Payout badge hover | `scale(1.04) translateX(4px)` | 280ms | cubic-bezier(0.22,1,0.36,1) |
| Bookmark pulse | `scale` keyframe | 300ms | ease-out |
| Link hover | underline slides in from left | 300ms | ease |

### Animation Rules
- Never animate `width`, `height`, or `top/left` — prefer `transform` and `opacity`
- Use `will-change: transform` only on frequently animated elements
- Respect `prefers-reduced-motion: reduce` — disable all animations and transitions
- Entrance animations ≤ 400ms; looping animations should feel calm
- Scroll-driven animations use GSAP ScrollTrigger (not CSS-only) for precision

---

## SaaS Template Patterns (Extracted Blueprint)

> Structural patterns from `saas-company-website-template/`. Full details in `push-ui-template` skill.
> These patterns define HOW to build pages. Use Push colors/fonts from above sections.

### Page Structure Blueprint
```
header.header → Sticky nav (Headroom: hide on scroll-down, pin on scroll-up, offset: 500px)
  hero section → Full-viewport, split layout (text left + media/Lottie right)
main
  content sections → Each with optional decorative SVG shapes (absolute, z-index: -1)
  join/CTA section → Counter animation embedded in headline
  testimonials → Swiper carousel + ticker marquee stripe
footer → Logo, nav links, socials, back-to-top button
```

### Section Layout Patterns
| Pattern | Structure | Used For |
|---------|-----------|----------|
| **Split Hero** | `d-xl-flex` → text (typewriter h1 + CTA) + Lottie media | Landing pages |
| **Numbered About** | Image left + numbered list (01, 02) right | How it works, process |
| **Icon Card List** | 4 vertical cards with AOS fade-up stagger | Services, features |
| **Stats Counter** | 3 counter blocks around central image + parallax | Social proof, metrics |
| **Challenges Grid** | Header left + 6-item numbered grid (2×3) right | Problem/solution lists |
| **Video Embed** | Poster image + play button → YouTube popup | Demo, explainer |
| **CTA + Counter** | Counter in headline + 3 checkmarks + button, centered | Conversion sections |
| **Testimonial + Ticker** | Swiper carousel above + full-bleed marquee below | Social proof |
| **Pricing 3-Column** | 3 equal cards (sign/int/float price split) + features | Plans page |
| **Collapsible Table** | Header left + expandable rows right | Feature comparison |
| **Blog Filter Grid** | Shuffle.js filter buttons + responsive grid | Discovery, listings |
| **Article + Share** | Floating share panel + narrow text + progress bars | Long-form content |
| **FAQ Accordion** | Bootstrap collapse, first item open, arrow rotation | FAQ, help |
| **Form + Lottie** | Form left + Lottie animation right | Contact, signup |

### Interaction Library Stack
| Library | Purpose | Init |
|---------|---------|------|
| GSAP + ScrollTrigger | Scroll-driven animations | Register plugin in app entry |
| Lenis | Smooth scrolling physics | Global init |
| AOS | Animate-on-scroll | `AOS.init({ offset: 30, duration: 650, once: true })` |
| Swiper | Carousels (standard, coverflow, responsive-destroy) | Per-component |
| CountUp.js | Number counter animations (3s duration) | IntersectionObserver trigger |
| Headroom.js | Smart sticky header | Offset 500px |
| Shuffle.js | Filterable grid layout | Container + filter buttons |
| Lottie Player | JSON vector animations | `<lottie-player>` element |
| SweetAlert2 | Modal popups + toast notifications | On form success / signup |
| Vanilla LazyLoad | Image lazy loading | `{ repeat: true, smooth: true }` |
| ProgressBar.js | Animated progress indicators (700ms) | IntersectionObserver trigger |

### Button Shadow System
- Default: `box-shadow: 3px 3px 0 var(--accent)` (hard-edge, no blur)
- Hover: `box-shadow: 6px 6px 0 var(--dark)` (offset expands + color shifts)
- Transition: 400ms ease-in-out
- All buttons: `border-radius: 0`

### Scroll-Triggered Animation Patterns
| Element | Trigger | Behavior |
|---------|---------|----------|
| `.type` elements | IntersectionObserver (once) | Typewriter effect via `data-text` attribute |
| `.countNum` elements | IntersectionObserver (once) | Counter from 0 → `data-value` over 3s |
| `.animatedUnderline` | IntersectionObserver (threshold 0.75) | Width 0→100% |
| `.progressLine` | IntersectionObserver (once) | Bar fills to `data-value`% over 700ms |
| AOS elements | Scroll offset 30px | `data-aos="fade-up"` with stagger delays |
| Decorative images | CSS keyframes | `float` animation: 10s infinite vertical bob (±30px) |

### Data Attribute System
| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-text` | Typewriter source text | `data-text="Your headline"` |
| `data-value` | Counter/progress target | `data-value="8100"` |
| `data-prefix` / `data-suffix` | Counter formatting | `data-prefix="0"` → "01" |
| `data-separator` | Thousands separator | `data-separator=","` → "68,000" |
| `data-aos` / `data-aos-delay` | Scroll animation | `data-aos="fade-up" data-aos-delay="100"` |
| `data-target` / `data-groups` | Filter system | Shuffle.js category matching |

### Standard Transition Timing
| Duration | Usage |
|----------|-------|
| 300ms | Form fields, links, underlines, checkboxes |
| 400ms | Buttons, headers, icons, cards, dropdowns, overlays |
| 600ms | Animated underlines, hero transitions |

### Decorative Shape System
Sections can include absolutely-positioned SVG decorative elements:
- Container: `.section_shapes` (absolute, full-size, `z-index: -1`)
- Children: circles, ovals, lines — border-only or semi-transparent
- Pattern: left/right halves with big/small circle pairs
- Never interactive, purely visual depth

---

## Tier Identity System (v4.1)

Creator tiers use a **material metaphor** inspired by airline loyalty programs. Each tier has a **spectrally unique color** that is instantly recognizable — no two tiers share the same hue family. Progression flows from earthy/muted → metallic/warm → jewel/intense.

### Tier Color Mapping

| Tier | Material | Hex / Treatment | CSS Variable | Badge Style | Shimmer |
|------|----------|----------------|-------------|-------------|---------|
| **Seed** | Clay | `#b8a99a` outlined | `--tier-clay` | Dashed border, `--dark` text | No |
| **Explorer** | Bronze | `#8c6239` solid | `--tier-bronze` | Solid fill, white text | No |
| **Operator** | Steel | `#4a5568` solid | `--tier-steel` | Solid fill, white text | No |
| **Proven** | Gold | `#c9a96e` solid | `--tier-gold` | Solid fill, `--dark` text | No |
| **Closer** | Ruby | `#9b111e` solid | `--tier-ruby` | Solid fill, white text, `badgeShimmer` | Yes (2.8s) |
| **Partner** | Obsidian | `#1a1a2e` solid | `--tier-obsidian` | Solid fill, white text, `badgeShimmer` + `obsidianPulse` | Yes (2.4s) |

### Color Design Rationale
- **Clay `#b8a99a`** — Warm taupe. Earthy, unfired, provisional. Distinct from Surface tones.
- **Bronze `#8c6239`** — True copper-bronze. First "real" material color. Warm metallic.
- **Steel `#4a5568`** — Graphite/gunmetal. Cool, industrial, serious. Uses `--graphite` from brand palette.
- **Gold `#c9a96e`** — Champagne gold. Luxurious warmth. Uses `--champagne` from brand palette.
- **Ruby `#9b111e`** — Vivid jewel red. Deeper than Flag Red, richer than Molten Lava. Unmistakably precious.
- **Obsidian `#1a1a2e`** — Near-black volcanic glass with deep blue undertone. The ultimate — dark, mysterious, powerful.

### CSS Variables (add to `:root`)
```css
/* Tier Identity Colors — v4.1 unique spectrum */
--tier-clay: #b8a99a;
--tier-clay-text: #003049;
--tier-clay-border: rgba(184, 169, 154, 0.5);

--tier-bronze: #8c6239;
--tier-bronze-text: #ffffff;

--tier-steel: #4a5568;        /* = --graphite */
--tier-steel-text: #ffffff;

--tier-gold: #c9a96e;         /* = --champagne */
--tier-gold-text: #003049;

--tier-ruby: #9b111e;
--tier-ruby-text: #ffffff;

--tier-obsidian: #1a1a2e;
--tier-obsidian-text: #ffffff;
```

### Badge Component Spec
- Font: CS Genio Mono, `10px`, weight `700`, uppercase, `letter-spacing: 0.08em`
- Padding: `5px 12px`
- Border-radius: `0` (Push standard)
- Format: `[Material] · [Tier Name]` — e.g., "Steel · Operator"
- Icon: 14x14px SVG to the left of text (tier-specific)
- Ruby + Obsidian badges include `badgeShimmer` animation (see Animation Tokens)
- **Obsidian must retain `3px left-border` accent (`--primary` `#c1121f`):** Obsidian `#1a1a2e` and Steel `#4a5568` are both dark at small badge sizes — the red left-border is Obsidian's key differentiator and must not be omitted.

### Badge Variants
| Variant | Background | Text | Border | Special |
|---------|-----------|------|--------|---------|
| `.badge-clay` | transparent | `--tier-clay-text` | `1.5px dashed --tier-clay-border` | — |
| `.badge-bronze` | `--tier-bronze` | white | none | — |
| `.badge-steel` | `--tier-steel` | white | none | — |
| `.badge-gold` | `--tier-gold` | `--dark` | none | — |
| `.badge-ruby` | `--tier-ruby` | white | none | `badgeShimmer 2.8s` |
| `.badge-obsidian` | `--tier-obsidian` | white | none | `badgeShimmer 2.4s` |

### Tier Card Header
When displaying tier info in cards or profiles, use a `border-top` accent:
- Clay: `3px dashed --tier-clay-border`
- Bronze: `3px solid --tier-bronze`
- Steel: `3px solid --tier-steel`
- Gold: `3px solid --tier-gold`
- Ruby: `3px solid --tier-ruby`
- Obsidian: `4px solid --tier-obsidian`

### Progression Rail (TierJourney Component)
- 6 nodes on horizontal rail (replaces old 5-node design)
- Node: `48px` square, tier color fill, Inter/Darky weight `800`, `14px` number (01–06)
- Label below: CS Genio Mono `11px` weight `700` uppercase (tier name)
- Sub-label: CS Genio Mono `9px` `--tertiary` uppercase (material name)
- Score threshold: CS Genio Mono `10px` `--tertiary`
- Connecting line: `2px solid --line` between nodes
- Obsidian node: `obsidianPulse` animation (see Animation Tokens)
- Clay node: dashed border, transparent fill

### Progression Node Styles
| Node | Fill | Border | Animation |
|------|------|--------|-----------|
| `.dot-clay` | `--surface` | `2px dashed --tier-clay-border` | — |
| `.dot-bronze` | `--tier-bronze` | none | — |
| `.dot-steel` | `--tier-steel` | none | — |
| `.dot-gold` | `--tier-gold` | none | — |
| `.dot-ruby` | `--tier-ruby` | none | — |
| `.dot-obsidian` | `--tier-obsidian` | none | `obsidianPulse 2.4s` |

### Tier-Specific Animations (add to Animation Tokens)
```css
@keyframes obsidianPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(26, 26, 46, 0.3); }
  50% { box-shadow: 0 0 0 8px rgba(26, 26, 46, 0); }
}
```
`obsidianPulse` applies only to Partner/Obsidian tier nodes and avatars.

### Design Rationale
- **Clay** (Seed): Warm taupe, dashed/outlined — communicates "provisional, not yet solidified," like unfired clay
- **Bronze** (Explorer): True copper-bronze. First solid metallic. Signals "you're real now"
- **Steel** (Operator): Gunmetal graphite. Industrial, serious. Matches the behavioral inflection point of earning commission
- **Gold** (Proven): Champagne gold. Warm, luxurious. Connotes earned prestige without being garish
- **Ruby** (Closer): Vivid jewel red. Premium, exclusive. Shimmer effect = rare gemstone
- **Obsidian** (Partner): Near-black volcanic glass. Maximum intensity + animated shimmer + pulse = the pinnacle

The visual progression: earthy taupe → warm bronze → cool graphite → warm gold → jewel red → volcanic black. Each color occupies a unique hue family — instantly distinguishable at a glance.

---

## Reusable UI Patterns

### Navbar (Creator)
Editorial navigation bar for creator-facing pages.
- Height: `56px`
- Background: `--surface` (`#f5f2ec`) with `border-bottom: 1px solid var(--line)`
- Top accent: `3px solid var(--primary)` (`#c1121f`)
- Logo: Darky, `1.625rem`, weight `900`, italic, `letter-spacing: -0.06em`, with `3px` red underline accent (`::after`)
- Nav links: CS Genio Mono, `0.8125rem`, weight `700`, uppercase, `letter-spacing: 0.06em`; active state uses left `3px` red border + tinted background
- Right section: separated by `1px` vertical `var(--line)`; items spaced at `var(--space-2)`
- Avatar: `36px` square, no border-radius, `2px` primary red outline ring on hover
- Tier badge: Uses Tier Identity System badge variants (see above). Format: `[Material] · [Tier]`. Clay/Seed = dashed outline `#b8a99a`, Bronze/Explorer = `#8c6239`, Steel/Operator = `#4a5568`, Gold/Proven = `#c9a96e`, Ruby/Closer = `#9b111e` + shimmer, Obsidian/Partner = `#1a1a2e` + shimmer. `2px` left border accent in tier color.
- Mobile: collapses to hamburger at `768px`; logo Darky `1.5rem` italic in drawer

### Homepage Hero
Editorial-style hero section — inspired by ashleybrookecs.com massive typography.
- Headline: Darky, `clamp(64px, 12vw, 160px)`, weight `900`, `letter-spacing: -0.06em`
- Eyebrow text: CS Genio Mono, `11px`, uppercase, weight `700`, `var(--primary)` color
- Numbered section marker: CS Genio Mono, `14px`, `01 /` format
- Subtitle / body: CS Genio Mono, standard body size, `var(--tertiary)` color
- Stats bar: Darky numbers at `48px`, weight `800`, `letter-spacing: -0.04em`; CS Genio Mono labels in muted text below
- Full-width layout, vertically centered content
- Optional scroll-to-enter gate (sanrita.ca pattern): minimal intro screen with "Scroll" indicator

### Page Header Bar
Slim header bar for detail pages.
- Height: `48px`
- Background: `var(--surface)`
- Border-bottom: `1px solid var(--line)`
- Title: CS Genio Mono, weight 600; meta in `var(--tertiary)` at 13px

### Campaign Card
Editorial magazine-cover card for campaign listings.
- **Hero image**: `240px` height (`256px` on 1200px+), `object-fit: cover`, no border-radius
- **Cinematic gradient overlay**: dual-layer using `--dark` (`#003049`) darkening + subtle `--primary` tint top-left
- **Payout badge**: top-left flush, Darky `1.10rem` / weight 900, `rgba(0,48,73,0.80)` overlay with `3px` red left-accent line
- **Meta chips**: glass morphism (`rgba(0,48,73,0.35)` + `blur(24px)`), CS Genio Mono `9px` weight 600 uppercase
- **Card body**:
  - Business meta: CS Genio Mono `10px`, weight 800, uppercase, `letter-spacing: 0.10em`, `var(--tertiary)`
  - Title: Darky weight 900, `1.18rem` (1.22rem desktop), `-0.035em` tracking, 2-line clamp; turns `--primary` on hover
  - Footer: deadline + spots + CTA button
- **Deadline urgency**: warning = tertiary tinted bg; urgent = red tinted bg + pulse
- **Hover**: `translateY(-10px)` with clean elevation shadow (360ms cubic-bezier)
- **Image hover**: `scale(1.10)` zoom + brightness boost (600ms)
- **Apply CTA**: CS Genio Mono, outline — `--surface` bg, `1px solid var(--dark)` border; hover fills `--primary` with white text
- Border: `1px solid var(--line)`, `border-radius: 0`

### Feed Grid (Discovery)
Editorial gallery layout — supports Sticky Grid Scroll pattern on showcase pages.
- **Grid**: 1 col mobile, 2 col 640px, 3 col 1024px, 4 col 1440px
- **Featured card**: first card spans 2 columns on 1024px+ (full-width mobile/tablet)
- **Row gap rhythm**: base `gap: 16px`; 1024px `row-gap: 32px`; 1440px `row-gap: 40px`
- **Card entrance**: `feedCardIn` 500ms with staggered delays (0ms–900ms), `translateY(32px) scale(0.97)` origin
- **Gradient fade**: 160px multi-stop gradient curtain from transparent to `--surface`
- **Progress bar**: full-width 2px track with `--primary` fill, 400ms animated width
- **Showing count**: CS Genio Mono `13px / weight 800 / tabular-nums`, editorial slash separator
- **Load more button**: 56px height, full-width, sectioned layout; hover: red border + tint
- **Back to top**: 48px circle, `--dark` bg, `#fff` icon; hover → `--primary` with red glow; `border-radius: 50%` (exception)
- **Sticky Grid Scroll variant**: For showcase/discovery pages, wrap grid in a sticky container with GSAP ScrollTrigger for progressive reveal

### Filter Bar
Command-bar filter toolbar — Bloomberg terminal density meets editorial clarity.
- **Bottom border**: `2px solid var(--dark)` for visual anchoring
- **Search**: 48px height, `border: 2px solid var(--line)`; focus: `--primary` border + `4px` box-shadow; CS Genio Mono placeholder
- **Result count**: Darky number `20px / weight 800 / var(--dark)`, CS Genio Mono label `11px / weight 600 / uppercase / var(--tertiary)`
- **Sort dropdown**: CS Genio Mono, bordered with `sort` icon prefix
- **Filters button**: bordered, 34px height; active: primary red border + tinted bg; count badge: 18px square, `--primary` bg, white text
- **Filter chips**: pill-shape (`border-radius: 50vh`) — allowed exception
- **Global shortcut**: `/` focuses search input
- Collapses to stacked layout on mobile with 40px min touch targets

### Login Page
Split-panel authentication layout.
- **Left panel**: `--dark` (`#003049`) background, brand panel with large Darky logo, tagline in CS Genio Mono, `--primary` accent stat bars
- **Right panel**: `--surface` background, centered form with CS Genio Mono labels
- Form inputs: `border: 1px solid var(--line)`, no border-radius, focus → `--primary`
- Full viewport height, 50/50 split on desktop, single-column on mobile

### ContentCard
Creator portfolio content card. Four variants:
- **image**: Full-bleed with aspect-ratio 4:3; hover overlay reveals campaign title, merchant name, star rating
- **instagram**: Card with gradient icon, post shortcode in CS Genio Mono, `border-top: 3px solid #e1306c`
- **tiktok**: Card with TikTok icon, `border-top: 3px solid #010101`
- **link**: Card with chain-link icon in `--tertiary`, hostname in CS Genio Mono
- All variants: `border: 1px solid var(--line)`, `border-radius: 0`, `hover: translateY(-6px)` lift
- Feature button: 26x26px, amber `#f59e0b` on active

### Portfolio Management Page
Creator's `/creator/portfolio` for managing UGC showcase:
- Featured bar: amber-tint banner (`#f59e0b0d`)
- Filter chips: pill-shape (exception)
- "Add External Work" form: CS Genio Mono labels, max-width 520px
- External work list: full-width rows, "Remove" in `--primary`

### InviteCreatorModal
3-step wizard for merchant-to-creator invite flow.
- Step indicator: 3 dots (`8px`); active stretches to `20px` in `--primary`; completed in `--tertiary`
- Creator strip: `--surface` bar with CS Genio Mono name/handle and inline tier badge
- Step 1: radio campaign rows with tier badge (tier color) + slot availability badge
- Step 2: `<textarea>` with `border-radius: 0`, CS Genio Mono, char counter turns `--primary` at 180+
- Step 3: bordered summary card; Send Invite uses `--tertiary` CTA
- Error banner: `rgba(193,18,31,0.06)` bg, `rgba(193,18,31,0.2)` border

### Outreach Dashboard
Merchant `/merchant/outreach` for tracking invites and discovering creators.
- Stats row: 4-column border-separated cards; collapses 2x2 at ≤900px
- Table: 36x36 avatar with tier-colored border, CS Genio Mono name/handle/tier
- Status badges: `pending` = tertiary tint, `accepted` = `--tertiary` fill, `declined` = `--primary` tint; uppercase CS Genio Mono
- Creator mini-card: 40x40 avatar, CS Genio Mono name, tier pip + score

### Template Selector
Pre-filled starting point picker for wizards.
- 2-3 column card grid with icon, Darky name, CS Genio Mono description
- "Start from scratch" dashed border separator
- Goal-type badge colors: `trial` = `--primary`, `off_peak` = `--tertiary`, `soft_launch` = `--accent`, `sampling` = `--dark`, `event` = `#7c3aed`

### Usage Warning Banners
- **Amber warning** (≥80%): bg `rgba(245,158,11,0.08)`, border `#f59e0b`, text `#92400e`
- **Red danger** (≥100%): bg `rgba(193,18,31,0.06)`, border `--primary`, text `--primary`
- Layout: icon + CS Genio Mono message + auto-margin CTA link
- Use `role="alert"` for accessibility

### PlanCard
Billing page plan comparison.
- Card: `border: 1px solid var(--line)`, `border-radius: 0`
- Current plan: `border: 2px solid var(--primary)`, faint red tint bg
- Most Popular: `border-top: 3px solid var(--tertiary)` accent
- Price: Darky 2rem / weight 900; CS Genio Mono `/mo` suffix muted
- Feature list: `check` icon in `--tertiary`
- Upgrade CTA: full-width `--primary` button

### Billing Page Layout
- Top: 2-column (plan + payment/usage), collapses at 720px
- Usage bars: `--tertiary` fill, amber at ≥80%, `--primary` at ≥90%
- Invoice table: CS Genio Mono, status pills with 6px dot (`border-radius: 50%` exception for indicator dots)
- Cancel modal: retention offer first (tertiary), then confirm (red warning)

### TierJourney
Creator tier progression display — uses Tier Identity System (see above).
- Horizontal rail of **6 tiers** (Seed/Clay → Partner/Obsidian)
- Each node: `48px` square, tier color fill, numbered 01–06
- Completed: solid tier-color fill + CS Genio Mono label; current: `--primary` outline; upcoming: muted
- Clay/Seed node: dashed border (provisional feel)
- Obsidian/Partner node: `obsidianPulse` animation + `badgeShimmer`
- Below each node: material name + payout speed + milestone bonus

### FirstCampaignGuide
Onboarding for 0-campaign creators.
- Full-width `--tertiary` accent banner: Darky headline, CS Genio Mono body
- 3-step checklist: Apply → Visit → Publish
- Dismissible `x` button; rendered above feed, not in modal

### SearchBar
Global search for merchant/admin dashboards.
- Full-width input, CS Genio Mono, magnifying glass icon in `var(--tertiary)`
- Focus: `--primary` border + 2px box-shadow ring
- Debounced 300ms
- Dropdown: `var(--surface)` bg, `var(--line)` border, no rounded corners

### MobileNav
Bottom nav bar ≤768px.
- Fixed bottom, full-width, `56px` height
- `--surface` bg, `border-top: 1px solid var(--line)`
- 4-5 icon+label items; active: `--primary` color + 2px top border
- CS Genio Mono labels: 10px / weight 600 / uppercase
- Safe area padding for iOS

### HealthDashboard
Metrics overview for merchant/admin.
- 2x2 or 3-column metric card grid
- Darky metric value: 2rem / weight 700; CS Genio Mono label: 12px / uppercase / `var(--tertiary)`
- Trend: up arrow in green `#10b981`; down in `--primary`
- Sparkline: inline SVG 80x32, `stroke: var(--primary)`, no fill

---

## Loading States

### Skeleton Rules
- Use `.skeleton` utility class from `globals.css`
- Match exact dimensions of real counterpart
- No borders or shadows on skeletons
- Stack multiple lines for text blocks (200px + 160px + 120px)

### Loading Hierarchy
1. Route segment: `loading.tsx`
2. Section: `<Suspense fallback={<SkeletonComponent />}>`
3. Inline: skeleton divs in component's loading branch

---

## Error Boundaries

- React Error Boundaries for client components that may throw
- Fallback: `.empty-state` with exclamation icon, short message, retry button
- Retry button: `.btn .btn-ghost`, calls `onRetry` prop or `window.location.reload()`
- Never show raw stack traces to end users

---

## Toast Notifications

- Position: fixed bottom-left, `bottom: 24px; left: 24px`
- Max 3 visible; auto-dismiss at 4s
- Width: 320px max; `--surface` bg, `border-left: 4px solid <variant-color>`
- Variants:
  - `success`: `#10b981`
  - `error`: `--primary` (`#c1121f`)
  - `warning`: `#f59e0b`
  - `info`: `--tertiary` (`#669bbc`)
- Dismiss: `x` button; click anywhere does NOT dismiss
- Animation: slide in from left, fade out on dismiss

### Confirm Dialogs
- Overlay: `rgba(0, 48, 73, 0.6)` (`--dark` based)
- Panel: `--surface` bg, `1px solid var(--line)`, no border-radius
- Header: `--primary` warning icon, Darky title
- Body: CS Genio Mono in `var(--tertiary)`
- Actions: Ghost "Cancel" + Primary "Confirm" (destructive label)
- 440px max width, centered; full-width on mobile

---

## Responsive Breakpoints

| Name | Value | Target |
|------|-------|--------|
| xs | 375px | iPhone SE, small phones |
| sm | 640px | Large phones, small tablets |
| md | 768px | Tablets, MobileNav threshold |
| lg | 1024px | Laptops, sidebar layouts |
| xl | 1180px | Content max-width (`--content-width`) |

### Breakpoint Rules
- Mobile-first: base styles target 375px+, add complexity upward
- ≤768px: hide `.desktop-only`, show `.mobile-only`, collapse grids to 1 col, show MobileNav
- ≤640px: reduce padding to `var(--space-2)`, stack form grids, full-width buttons
- ≤375px: reduce headline font-size; reduce card padding to `var(--space-1)`

---

## Design System Page

Internal showcase at `/design-system` (dev-only; 404 in production).

| Section | Contents |
|---------|----------|
| Colors | Brand, tier, status, surface, text swatches with CSS vars |
| Typography | Darky + CS Genio Mono type scale with metadata |
| Spacing | Visual spacer blocks for all `--space-*` tokens |
| Shadows | All `--shadow-*` token previews |
| Components | Buttons, status pills, tier badges, score rings, skeletons |
| Icons | SVG icon gallery |
| Forms | Input, textarea, select, checkbox, radio |
| Animations | Live demos of all keyframes |

Floating `DS` button (`--primary`, fixed bottom-right, `zIndex: 9999`) links to this page in dev mode.

---

## Dependencies (Design-Related)

| Package | Purpose | Required For |
|---------|---------|-------------|
| GSAP | Scroll-driven animation, ScrollTrigger | Sticky Grid Scroll, scroll reveals |
| Lenis | Smooth scrolling physics | Global smooth scroll, Sticky Grid Scroll |
| Material Symbols | Icon system | Nav, UI icons |

Install: `npm install gsap lenis`

GSAP ScrollTrigger plugin must be registered in the app entry point:
```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

---

## v5.1 Component Additions

> v5.1 components follow all existing Design.md tokens — no new colors, no new fonts, no new radii.
> All components inherit the 6-color palette, Darky + CS Genio Mono type system, `border-radius: 0`, 8px grid, and animation tokens documented above.

### SLRWidget
**Path:** `components/merchant/SLRWidget.tsx`
North-star dashboard widget surfacing the current SLR value alongside a historical trend line.
- **Current value:** Darky weight `900`, big-number treatment, `--champagne` (`#c9a96e`) color
- **Chart:** inline SVG line chart (no recharts / no external chart lib)
  - Target line: `--tertiary` (Steel Blue `#669bbc`), 1.5px stroke, dashed
  - Actual line: `--champagne` (Champagne Gold `#c9a96e`), 2px stroke, solid
- **Industry baseline caption:** CS Genio Mono `11px`, muted text color (`rgba(0, 48, 73, 0.55)`)
- **Container:** `border: 1px solid var(--line)`, `border-radius: 0`, Surface Elevated background
- **Responsive:**
  - `<640px`: stacks vertically (value → chart → caption)
  - `640px–899px`: compact single-column with inline chart
  - `≥900px`: single-column layout with chart at full widget width

### Risk Card Severity System
**Path:** `app/(marketing)/trust/risk-register/`
Card treatment for enumerated risk entries. Severity is encoded as a left-edge stripe.
- **Card base:** `border: 1px solid var(--line)`, `border-radius: 0`
- **Severity stripe:** `border-left: 4px solid {severity-color}` added to the card base border
- **Severity color mapping:**
  | Level | Color | Token |
  |-------|-------|-------|
  | Critical | `#c1121f` | `--primary` (Flag Red) |
  | High | `#c9a96e` | `--champagne` (Champagne Gold) |
  | Medium | `#669bbc` | `--tertiary` (Steel Blue) |
  | Low | `#4a5568` | `--graphite` (Graphite) |
- **Probability / Impact pills:**
  - Font: CS Genio Mono, small (12px), weight 600, uppercase
  - Border: `1px solid {severity-color}`, no fill
  - `border-radius: 0`
  - Used inline in the card header to express P × I

### Accuracy Chart
**Path:** `app/(marketing)/conversion-oracle/accuracy/`
Inline-SVG accuracy trend visualization for ConversionOracle prediction quality.
- **Implementation:** inline SVG only — no recharts, no D3
- **Target bands** (horizontal reference lines, dashed):
  - 75%: `--tertiary` (Steel Blue `#669bbc`) dashed
  - 85%: `--champagne` (Champagne Gold `#c9a96e`) dashed
  - 90%: `--primary` (Flag Red `#c1121f`) dashed
- **NOW marker:** solid `--primary` circle, `r=4`, with CS Genio Mono label "NOW" anchored right of the point
- **Axis labels:** `--graphite` fill, CS Genio Mono `10px`
- **Background:** transparent (inherits Surface Elevated from parent card)

### Equity-Pool Signup Gate
**Path:** `app/(creator)/creator/equity-pool/`
Three-row eligibility gate rendered before allowing equity-pool enrollment.
- **Card container:** `border: 1px solid var(--line)`, `border-radius: 0`, Surface Bright background
- **Row structure:** each row is a horizontal flex — `icon + label + value + pass/fail chip`
  - Icon: 20px, `--graphite` fill
  - Label: CS Genio Mono 14px, weight 600, `--dark`
  - Value: CS Genio Mono 14px, weight 400, `--graphite`
  - Chip: right-aligned
- **Pass chip:**
  - Background: `#10b981` at 12% opacity (`rgba(16, 185, 129, 0.12)`)
  - Text: `--graphite`
  - CS Genio Mono 11px, weight 700, uppercase
  - `border-radius: 0`, padding `4px 10px`
- **Fail chip:**
  - Background: `--primary` at 12% opacity (`rgba(193, 18, 31, 0.12)`)
  - Text: `--primary` (Flag Red)
  - Same typography and radius as pass chip
- **Row separator:** `1px solid var(--line)` between rows

### DisclosureBot Audit Row
**Path:** `app/(admin)/admin/disclosure-audits/`
Admin table row pattern for FTC/disclosure compliance audit records.
- **Table row layout:** 9 columns, `border-radius: 0` everywhere
  - Timestamp / Creator / Campaign / Platform / Verdict / Confidence / Reviewer / Action / Detail-link
- **Row hover:** `background: rgba(0, 48, 73, 0.04)` (surface-muted)
- **Verdict badge:**
  - Font: CS Genio Mono 10px, weight 700, uppercase, letter-spacing 0.08em
  - Padding: `5px 10px`, `border-radius: 0`
  - Verdict color mapping:
    | Verdict | Background | Text |
    |---------|-----------|------|
    | `auto_pass` | `#10b981` at 12% | `#10b981` |
    | `auto_block` | `--primary` at 12% | `--primary` |
    | `manual_review` | `--champagne` at 12% | `--champagne` darkened |
    | `human_approved` | `#10b981` at 18% | `#10b981` |
    | `human_rejected` | `--primary` at 18% | `--primary` |
- **Sticky detail sidebar:**
  - Width: `420px` fixed on desktop
  - Background: `--surface` (Pearl Stone `#f5f2ec`)
  - `border-left: 3px solid var(--champagne)`
  - `position: sticky; top: 0` within the audit layout
  - Collapses to bottom sheet on `<1024px`

### Pilot-Economics Calculator
**Path:** `app/(marketing)/merchant/pilot/economics/`
Interactive two-panel layout for merchant-facing economics modeling.
- **Layout:** 2-column split
  - **Left (sticky form):** `position: sticky; top: 0`
    - Form background: `--tertiary` at low opacity (`rgba(102, 155, 188, 0.06)`) — the Steel Blue form bg
    - Inputs: `border: 1px solid var(--line)`, `border-radius: 0`, CS Genio Mono labels
    - Focus state: `--primary` border per existing form token
  - **Right (output cards):** 7-card grid, responsive 1 / 2 / 3 columns across breakpoints
- **Output card spec:**
  - Container: `border: 1px solid var(--line)`, Surface Elevated bg, `border-radius: 0`
  - Big number: Darky weight 900, `--champagne` color, clamp sizing (`clamp(32px, 4vw, 48px)`)
  - Label: CS Genio Mono 11px, weight 700, uppercase, `--tertiary`
  - **Collapsible math row:** below label, button reveals the derivation
    - Trigger: CS Genio Mono 12px, `--graphite`, chevron icon rotates on open
    - Content: CS Genio Mono 12px, `--graphite`, shows the formula breakdown
- **Collapses** to single-column `<900px`; form un-sticks on mobile

### Per-Vertical Pricing Card
**Path:** `app/(marketing)/pricing/[category]/`
Vertical-specific pricing explainer — one per category route.
- **Header:**
  - H1: Darky weight 900, vertical name (e.g., "Coffee", "Fitness")
  - Rate display: `--champagne` color, Darky weight 800, prominently sized
- **Unit-econ derivation table:**
  - Columns: `AOV × visits → merchant LTV → Push rate`
  - Table: `border-collapse: collapse`, `border: 1px solid var(--line)`, `border-radius: 0`
  - Header row: CS Genio Mono 11px, weight 700, uppercase, `--graphite`
  - Body rows: CS Genio Mono 14px; numeric cells use `font-variant-numeric: tabular-nums`
  - Row separator: `1px solid var(--line)`
- **Retention Add-on mini-table:**
  - Smaller secondary table below the primary derivation
  - Shares the same border/type tokens
  - Visually demoted via reduced max-width and lower contrast header
- **Container:** Surface Elevated card, `border: 1px solid var(--line)`, `border-radius: 0`
