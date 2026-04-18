# Push UI Template — Component Specs

> Detailed specs for every reusable component. Colors/fonts from Design.md.
> Sections 0.x are the v5.0 reusable components (added April 2026). Sections 1–20 are the original SaaS template library — still the source of truth for nav, cards, forms, pricing, etc. Don't describe the design tokens here; see Design.md.

---

## 0.1. AgentOutputDemo (v5.0)

**Path:** `components/landing/AgentOutputDemo.tsx`
**Animation CSS:** `.agent-demo*` selectors in `app/(marketing)/landing.css`
**Currently used on:** `app/(marketing)/page.tsx` (hero right column)

### Purpose
Cinematic terminal-style card that simulates one agent run in ~3 seconds. This is a **fixture**, not real-time streaming — don't wire it to an API. Use when a marketing surface needs to show "the agent works" without actually running an agent.

### Structure
```
div.agent-demo[aria-hidden="true"]
├── div.agent-demo-bar                 ← window chrome
│   ├── span.agent-demo-dot
│   ├── span.agent-demo-title          "push-agent"
│   └── span.agent-demo-meta           "claude-sonnet-4-6"
└── div.agent-demo-body
    ├── div.agent-demo-row--prompt     goal line, starts with ">"
    ├── div.agent-demo-row--status     progress-bar track + "matching creators…"
    └── div.agent-demo-output
        ├── div.agent-demo-out-label   "Top 5 matches · 47s"
        ├── ul.agent-demo-list         ← 5 staggered li.agent-demo-item
        │   └── li (dot + handle + tier + score + est customers)
        └── div.agent-demo-footer      "Est. deliverable" / champagne-edged
```

### Visual rules
- **Background:** `rgba(10, 22, 35, 0.92)` (Deep Space Blue, dark terminal)
- **Accents:** Steel Blue `#669bbc` (primary cold hue), Graphite `#4a5568` (tier dot variant), Champagne `#c9a96e` (footer stripe only)
- **Typography:** CS Genio Mono throughout — never Darky
- **Per-item stagger:** `animationDelay: 1.6 + i * 0.35s` (see component for inline style), feeds a fade-up keyframe in landing.css
- **Tier dot color:** passed inline via `style={{ background: tierColor }}`; palette: Steel `#4a5568`, Gold `#c9a96e`, Bronze `#8c6239`
- **Per-creator est:** free-text string like `"6 customers"` — not a formatted number; keep in MATCHES fixture

### Responsive
Hidden below **1100px** via CSS (`.agent-demo { display: none }` inside the breakpoint). Mobile hero stays editorial / text-only. Do not try to adapt this card to narrow viewports.

### Accessibility
- Whole card is `aria-hidden="true"` — decorative only, no reader exposure
- `@media (prefers-reduced-motion: reduce)` in landing.css should zero out all `.agent-demo*` animations

### Use when
- Landing hero needs a "proof of life" of the agent
- Section needs a visual anchor that says "AI running"

### Don't use when
- You need to stream real agent output → build a streaming surface instead
- Viewport is mobile-first / text-only page
- The surface already has a full-width `.agent-preview` card (section 0.5) — don't stack two agent visualizations

---

## 0.2. VerificationBadge (v5.0)

**Path:** `components/landing/VerificationBadge.tsx`
**Currently used on:** `app/(marketing)/page.tsx`, `app/(marketing)/merchant/pilot/page.tsx`, `app/(marketing)/neighborhoods/williamsburg-coffee/page.tsx`

### Purpose
3-column trust strip showing the AI verification stack: **QR scan → Claude Vision → Geo-match**. Core brand artifact of v5.0 positioning — use on any marketing page that needs to explain verification in one glance.

### Structure
```
div.verify-badge
├── div.verify-badge-head              ← rule line + eyebrow "AI Verification Layer"
├── div.verify-badge-row               ← 3 × .verify-badge-col
│   └── div.verify-badge-col
│       ├── div.verify-badge-icon      ← hand-rolled SVG (22×22, stroke currentColor)
│       ├── span.verify-badge-label    "QR Scan" / "Claude Vision" / "Geo-match"
│       ├── span.verify-badge-sub      subtitle
│       └── span.verify-badge-connector  →  (arrow to next col; last col omits)
└── p.verify-badge-tagline             "All three must pass within 8 seconds. No verification, no charge."
```

### Visual rules
- **Surface:** Surface Elevated `#ffffff` (light card)
- **Icon chip:** `rgba(102, 155, 188, 0.08)` background, `rgba(102, 155, 188, 0.25)` 1px border (Steel Blue family)
- **SVG style:** `strokeLinecap="square"`, `strokeWidth="1.5"`, no rounded stroke ends (matches the zero-radius house rule)
- **Per-col delay:** `transitionDelay: i * 90ms` via inline style — adds a read-as-sequence feel
- **Three icons shipped:** `QrIcon` (nested rects), `VisionIcon` (eye w/ crosshair), `GeoIcon` (pin w/ dot)

### Responsive
- Breakpoint < 760px: collapse to single column, hide `.verify-badge-connector` arrows
- Don't resize the SVG icons — they're fixed 22×22 for optical consistency

### Use when
- Any v5.0 marketing page needs to answer "how do you verify this is a real customer?"
- Landing surface, pilot-merchant page, neighborhood page — already wired on all three

### Don't use when
- You just need a single verification icon (pull icon out of this file)
- You need to show live verification state (green/yellow/red) — this is a static explainer, not a dashboard widget

---

## 0.3. Merchant Goal Input form (v5.0)

**Path:** `app/(merchant)/merchant/onboarding/page.tsx` — `GoalStep` component
**Related marketing surface:** `app/(marketing)/merchant/pilot/page.tsx`
**CSS class prefix:** `.ob2-*` (onboarding v2)

### Purpose
The **only** input a merchant gives the agent. Replaces the legacy 7-step brief. Five fields that together parameterize one agent run.

### Fields (in order)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Business name | `input[type=text]` | yes | Placeholder: `"Sey Coffee"` |
| Category | `select` | yes | Options: `CATEGORIES` — Coffee / Restaurant / Bar·Nightlife / Retail / Beauty·Wellness / Fitness / Other |
| ZIP / Neighborhood | `input[type=text]` | yes | Placeholder: `"11211 — Williamsburg"` |
| Customer target | `select` | yes | Options: `GOAL_OPTIONS` — 10 / 20 / 50 / 100 (with timeframe labels) |
| Monthly budget (USD) | `input[type=number]` min=500 step=100 | yes | Placeholder `"800"` |

### Structure
```
.ob2-field                ← vertical group (label + input)
.ob2-label                ← uppercase CS Genio Mono label
.ob2-input / .ob2-select  ← zero-radius field
.ob2-field-row            ← side-by-side pair (use for Category + ZIP)
.ob2-input-hint           ← small help text under budget
.ob2-step-actions         ← wraps primary CTA
.ob2-btn-primary          ← disabled until all 5 fields filled
```

### v5.0 pricing copy (MANDATORY on this form)
Under the budget field, this exact phrasing:
> "Performance tier: $500/mo min + $40 per AI-verified customer. Pilot merchants (first 10 in Williamsburg coffee) get the first 10 customers on us."

### Primary CTA
Label: `"Send to agent →"` (en dash, rightward arrow). **Disabled until** `businessName`, `customerGoal`, `budget`, and `zip` are all non-empty.

### Use when
- Any v5.0 merchant-facing onboarding surface
- Pilot landing CTA that asks "tell the agent your goal"

### Don't use when
- Legacy multi-step brief form — that pattern is deprecated by v5.0

---

## 0.4. Agent Pending state (v5.0)

**CSS:** `app/(merchant)/merchant/onboarding/agent-onboarding.css` — selectors `.agent-pending-*`
**TSX example:** `AgentPreviewStep` in `app/(merchant)/merchant/onboarding/page.tsx`

### Purpose
Shown while the agent is running (1–3 seconds). Gives the merchant a deterministic "something is happening" without a spinner.

### Structure
```
div.agent-pending
├── div.agent-pending-header
│   ├── span.agent-pending-dot              ← pulsing green dot
│   └── span.agent-pending-label            "claude-sonnet-4-6 · matching creators"
├── div.agent-pending-bar                   ← bar track
│   └── div.agent-pending-bar-fill          ← sliding fill (30% width, translates)
└── ul.agent-pending-list                   ← 4 status lines, staggered
    ├── li  "Parsing goal — {N} customers"
    ├── li  "Scanning creator network for {category} · {zip}"
    ├── li  "Ranking by score + geo + verified-conversion history"
    └── li  "Drafting campaign brief + ROI prediction"
```

### Animations (all defined in agent-onboarding.css)
| Element | Keyframe | Duration | Detail |
|---------|----------|----------|--------|
| `.agent-pending-dot` | `agent-pulse` | 1.6s ease-in-out infinite | opacity `1 → 0.3 → 1` |
| `.agent-pending-bar-fill` | `agent-slide` | 1.8s linear infinite | fill 30% wide, translates `0% → 100%` |
| `.agent-pending-list li:nth-child(1)` | `agent-line-in` | 0.5s forwards | delay `0.1s` |
| `.agent-pending-list li:nth-child(2)` | `agent-line-in` | 0.5s forwards | delay `0.45s` |
| `.agent-pending-list li:nth-child(3)` | `agent-line-in` | 0.5s forwards | delay `0.8s` |
| `.agent-pending-list li:nth-child(4)` | `agent-line-in` | 0.5s forwards | delay `1.15s` |

All three keyframes are disabled via `@media (prefers-reduced-motion: reduce)` at the bottom of the file.

### Use when
- The merchant has just submitted the goal form and the agent is running
- Any "AI is thinking" interstitial in an agent-led workflow

### Don't use when
- You need an indeterminate loading state for a non-agent request → use the generic app spinner instead

---

## 0.5. Agent Preview / Summary card (v5.0)

**CSS:** `app/(merchant)/merchant/onboarding/agent-onboarding.css` — selectors `.agent-preview-*`
**TSX example:** `AgentPreviewStep` (second half) in `app/(merchant)/merchant/onboarding/page.tsx`

### Purpose
Generic "the AI returned this" surface. Shows a 4-stat summary + matched creators + draft brief. Reuse for any page that needs to display an agent result.

### Structure
```
div.agent-preview
├── div.agent-preview-summary               ← dark card with champagne 3px left border
│   ├── .agent-preview-summary-head → .agent-preview-summary-eyebrow "Agent result · 1.8s"
│   └── .agent-preview-summary-grid         ← 4-column stat row
│       └── .agent-preview-summary-stat × 4
│           ├── .agent-preview-summary-num     (Darky-800 32px, Champagne color)
│           └── .agent-preview-summary-label   (CS Genio Mono 10px uppercase)
├── div.agent-preview-section  ← "Top 5 matches"
│   └── ul.agent-preview-matches
│       └── li.agent-preview-match
│           ├── .agent-preview-match-head
│           │   ├── .agent-preview-match-dot      (tierColor bg)
│           │   ├── .agent-preview-match-handle   ("@maya.eats.nyc")
│           │   ├── .agent-preview-match-tier     (tierColor + tierTextColor pill)
│           │   ├── .agent-preview-match-score    ("94" + score label)
│           │   └── .agent-preview-match-est      ("+6 customers")
│           └── p.agent-preview-match-reason
└── div.agent-preview-section  ← "Draft brief"
    └── .agent-preview-brief → dl (dt "Headline"/"CTA"/"Tone"/"Offer hook" + dd values)
```

### Visual rules
- **Summary card bg:** Deep Space Blue dark surface
- **Left border:** 3px Champagne `#c9a96e` — the visual signature of "AI returned this"
- **Stat row:** 4 equal columns on desktop, wraps on narrow
- **Stat number:** Darky-800 32px, Champagne color
- **Stat label:** CS Genio Mono 10px, uppercase
- **Tier pill:** background = `tierColor`, text = `tierTextColor` (both passed per-match)
- **Match row:** single horizontal flex strip on wide, wraps on narrow

### Four summary stats (convention from onboarding)
1. Est. verified customers (int)
2. Agent confidence (percent — `Math.round(confidence * 100)`)
3. Est. spend (`$${spend}`, derived `$40 × customers`)
4. Projected ROI (`3.2×` format — one decimal + multiplication sign)

### Use when
- Any surface that shows an agent-generated result — campaign previews, dashboard drill-ins, admin overrides
- Campaign summary card after launch

### Don't use when
- Live streaming agent output (use AgentOutputDemo variant with terminal styling)
- Non-AI content surfaces (don't retrofit this card onto static data)

---

## 0.6. AI Verification Review queue (v5.0)

**Path:** `app/(admin)/admin/ai-verifications/page.tsx` + `app/(admin)/admin/ai-verifications/ai-verifications.css`
**Data source:** `lib/admin/mock-ai-verifications` — types `MockAiVerification`, `AiVerdict`
**CSS class prefix:** `.aiv-*`

### Purpose
Admin queue for reviewing manual_review verdicts from the 3-layer AI verification pipeline. Two-pane layout: filterable table on the left, sticky detail/approve sidebar on the right.

### Page shell
```
.aiv-page
├── header.aiv-header
│   ├── .aiv-eyebrow "Admin · AI Verification Layer"
│   ├── h1.aiv-h1 "Manual review <span.aiv-h1-light>queue</span>"
│   ├── p.aiv-sub
│   └── .aiv-stats  ← 3 stat cells (in review / auto-verified / auto-rejected)
├── .aiv-filter-bar  ← pill buttons (all / manual_review / auto_verified / auto_rejected); active pill gets .aiv-filter-btn--active
└── .aiv-layout  ← 2-col
    ├── .aiv-table-wrap → table.aiv-table (9 cols)
    └── aside.aiv-detail (sticky 420px)
```

### Table — 9 columns
`scan | merchant | creator | amount | name-match % | geo | vision % | verdict | when`
- Rows use `.aiv-row`; selected row adds `.aiv-row--active`
- Mono cells (IDs, handles): `.aiv-mono`
- Verdict badges: `.aiv-badge` + modifier — `aiv-badge--ok` (verified/approved, green), `aiv-badge--rej` (rejected, red), `aiv-badge--pending` (manual_review, champagne)
- Empty state: single `td.aiv-empty` spanning 9 cols

### Verdict taxonomy (source: `AiVerdict` type)
- `auto_verified` — pipeline green-lit (green badge)
- `auto_rejected` — pipeline rejected (red badge)
- `manual_review` — sent to queue (champagne badge)
- `human_approved` — admin override to verified (green)
- `human_rejected` — admin override to rejected (red)

### Detail sidebar
- Empty state: `.aiv-detail-empty` with `.aiv-detail-empty-h` + body
- Row selected: `.aiv-detail-card` containing 8-cell info grid + approve/reject buttons + review-note textarea
- Approve/reject buttons call `resolve('human_approved' | 'human_rejected')` which rewrites the row's verdict

### Number formatting helpers (colocated in page.tsx, reuse verbatim)
- `formatRelative(iso)` — "5m ago" / "3h ago" / "2d ago"
- `formatAmount(n)` — `$12.50` or `—`
- `formatConfidence(v)` — `97%` or `—` (takes 0–1 float)
- `formatGeo(m)` — `120 m` under 1km, `1.2 km` at/over 1km, `—` if null

### Use when
- Building admin tooling that lets a human resolve AI verification edge cases
- Any "queue of flagged events that need a binary approve/reject decision" UX — the shell generalizes

### Don't use when
- You need creator-facing or merchant-facing verification UI (this is admin-only)
- You only have 1–2 verdict cases (overkill — use a simple status pill)

---

## 1. Navigation (Header)

### Structure
```
header.header (d-lg-flex, align-items-center)
└── container (d-flex, align-items-center, flex-wrap, flex-lg-nowrap)
    ├── a.logo (icon + text)
    ├── nav.header_nav.collapse
    │   └── ul.header_nav-list
    │       ├── li.dropdown → a.dropdown-toggle + div.dropdown-menu
    │       ├── li → a.nav-item (single links)
    │       └── li.header_nav-list_btn → a.btn (mobile CTA)
    ├── a.header_btn.btn--neon (desktop CTA)
    └── button.header_trigger (hamburger, < 992px)
```

### Behaviors
- **Sticky**: Fixed on scroll > 0
- **Headroom**: Hidden on scroll-down (past 500px), shown on scroll-up
- **Active State**: `.current` class on nav item matching `data-page`
- **Mobile**: Hamburger toggle at < 992px, opens full-height menu
- **Dropdowns**: Hover on desktop, click on mobile

### Key Details
- Logo: icon img + text span
- Dropdown arrow: `.icon-arrow-left` rotated
- Nav item indicator: `.icon-circle` dot inside link text
- CTA button: `.btn--neon` style (hard-edge shadow)

---

## 2. Buttons

### Variants
| Class | Style | Shadow |
|-------|-------|--------|
| `.btn--neon` | Filled primary, white text | `3px 3px 0 accent` → `6px 6px 0` on hover |
| `.btn--white` | White/surface bg, dark text | Same shadow pattern |
| `.btn--arrow` | Text + arrow icon, link-style | No shadow, underline on hover |

### Behaviors
- Hover: Shadow shifts from 3px→6px offset (hard-edge, no blur)
- Transition: 400ms ease-in-out
- All buttons: `border-radius: 0`

---

## 3. Cards

### Service Card (Full-Width, Horizontal)
```
li.services_list-item
├── div.media
│   ├── picture → img (lazy loaded)
│   └── span.media_icon → i.icon
└── div.main
    ├── h4.main_title
    ├── p.main_text
    ├── ul.main_list → li (icon-circle + text bullets)
    └── a.main_btn.btn--neon
```
- Image with icon overlay
- Title + description + feature bullets + CTA
- Horizontal layout on desktop, stacked on mobile

### Service Card (Compact, Vertical)
```
a.services_list-item (d-flex, flex-column)
├── i.icon
├── span.title.h5
└── p.text
```
- Icon top, title, description
- AOS fade-up with stagger delays
- Hover: shadow overlay fades in

### Blog Post Card (Grid)
```
div.blog_posts-item.post-item[data-groups]
└── div.wrapper
    ├── div.main
    │   ├── a.main_title.h5
    │   └── div.main_meta (d-flex)
    │       ├── span.main_meta-bookmark (optional)
    │       └── p.main_meta-item (date, author, comments)
    └── div.media → picture → img.lazy
```
- Filterable via Shuffle.js using `data-groups`
- Meta row: bookmark icon + date + author + comment count

### Blog Post Card (Sidebar List)
```
li.blog_posts-item
├── div.media → picture → img.lazy
└── div.main
    ├── a.main_title.h4 (larger title)
    ├── div.main_meta (same as grid)
    ├── p.main_preview (excerpt text)
    └── a.btn.btn--arrow (Read More + icon-arrow-right)
```
- Vertical card: image on top, full text below
- Includes preview/excerpt text
- Read More button with arrow

### Testimonial Card (Slider)
```
div.swiper-slide
├── div.main
│   ├── p.main_review (quote text)
│   ├── h6.main_author
│   └── span.main_company
└── picture → img (avatar)
```
- Inside Swiper carousel
- Review text + author name + company

---

## 4. Pricing Cards

### Structure
```
li.pricing_list-item
├── div.media (optional SVG on featured card)
├── div.pricing_list-item_header
│   ├── h5.title (plan name)
│   └── span.price
│       ├── span.sign ("$")
│       ├── span.int (whole number)
│       └── span.float (decimals)
├── ul.pricing_list-item_list
│   └── li.list-item → i.icon-circle + feature text
└── a.btn or span.btn (CTA or disabled current plan)
```

### Layout
- 3 columns on md+ (`d-flex, flex-md-row, flex-wrap`)
- Stacked on mobile
- Featured card: extra SVG decoration in `.media`
- Price split into 3 spans for independent styling

---

## 5. Accordion (FAQ)

### Structure
```
div.accordion#faq_accordion
└── div.accordion_item
    └── div.accordion_item-wrapper
        ├── h4.title[data-bs-toggle="collapse", aria-expanded]
        │   ├── question text
        │   └── span.title_icon.transform → i.icon-arrow-left
        └── div.accordion-collapse.collapse[.show on first]
            └── div.body → div.main
                ├── p.main_general
                └── ul.main_list → li.main_list-item
                    ├── span.number.countNum[data-prefix, data-value]
                    └── div.main → h6.title + p.text
```

### Behaviors
- Bootstrap collapse mechanism
- First item open by default (`.show`)
- Arrow icon rotates 180° via `.transform` class toggle
- Sub-items have counter animations that fire on expand

---

## 6. Collapsible Table

### Structure
```
div.model_table
├── div.model_table-header → 3 column labels (h6)
└── div.model_table-col (multiple rows)
    ├── span.cell.cell--trigger[data-bs-toggle="collapse"]
    │   ├── span.label (row name)
    │   └── i.icon-angle-left (rotates on toggle)
    └── div.cell-collapse.collapse
        └── span.cell → label + content (for each column)
```

### Behaviors
- Click row header → expand detail cells
- Icon rotates on open/close
- Each expanded row shows 2-3 cells of comparison data

---

## 7. Forms

### Input Pattern
```
form.form (d-flex, flex-column)
├── input.field.required[placeholder, name]
├── input.field.required[data-type="email"]
├── textarea.field.required
└── button.btn.btn--neon
```

### Validation
- `.required` → must not be empty
- `data-type="email"` → email regex
- `data-type="tel"` → numeric check
- Error: adds `.error` class (border color change)
- Clear: on input event, removes `.error`

### Success
- SweetAlert2 toast: `top-end`, 3000ms timer
- Form resets on success
- POST to form `action` attribute

---

## 8. Video Popup

### Structure
```
div.videoPopup (d-flex, align-items-center, justify-content-center)
└── div.container
    └── div.video_frame
        ├── i.icon-times.video_frame-close.btn--white (close button)
        └── div#YTplayer (YouTube player container)
```

### Trigger
- `.videoTrigger` click → adds `.visible` + `.fadeIn` to popup
- YouTube player loads and auto-plays
- Click outside frame → `.fadeOut` + `.visible` removed, video stops

---

## 9. Gallery Lightbox

### Structure
```
div.page_slider.swiper.gallery
└── div.swiper-wrapper
    └── div.swiper-slide
        └── a[data-role="gallery-link"] → picture → img.lazy
```

### Behavior
- Swiper handles sliding between images
- Click opens baguettebox.js fullscreen lightbox
- Lazy loading on all images

---

## 10. Ticker/Marquee Stripe

### Structure
```
div.stripe (d-flex, align-items-center)
├── div.stripe_block (d-none, d-sm-flex)
│   ├── span.stripe_block-icon → i.icon
│   └── ul.stripe_block-list (stats text)
└── div.ticker.h3#ticker (React marquee component)

div.d-none (hidden source)
└── span.ticker-item (repeated text items)
```

### Behavior
- Full-bleed horizontal stripe
- Left block: icon + stats (hidden on xs)
- Right: infinite scrolling marquee (15s cycle, RTL)
- Content sourced from hidden `.ticker-item` elements

---

## 11. Breadcrumbs

### Structure
```
ul.breadcrumbs (d-flex, flex-wrap)
├── li.breadcrumbs_item → a.link (parent pages)
└── li.breadcrumbs_item.current → span#currentpage
```
- Separator via CSS `::before` pseudo-element (slash or arrow)
- Current page: non-linked span

---

## 12. Share Panel (Article)

### Structure
```
div.share_panel
├── span.share_panel-label ("Share")
└── ul.share_panel-list (d-flex, flex-column)
    └── li → a.link → i.icon-{social}
```
- Floats to side of article main image (absolute positioned)
- Slide-in animation via `@keyframes panel` (1s, from right)
- Triggered by IntersectionObserver when in viewport
- Social icons: link, facebook, instagram, twitter, linkedin, whatsapp

---

## 13. Progress Bars (Article)

### Structure
```
div.article_progress
├── h5.article_progress-header
└── div.article_progress-main (d-flex, flex-column)
    └── div.block
        ├── div.block_header → span.number.h3 + span.label
        ├── span.progressLine[data-value, data-fill]
        └── div.progressLine-legend → span.label (start/end)
```
- ProgressBar.js animates width from 0 to `data-value`%
- 700ms duration, scroll-triggered
- Color from `data-fill` attribute

---

## 14. Pagination

### Structure
```
ul.pagination (d-flex, flex-wrap, align-items-center, justify-content-end)
├── li.pagination_item → a.link.current (active page)
├── li.pagination_item → a.link (other pages)
└── li.pagination_item → a.control (next arrow)
```
- Right-aligned
- `.current` class on active page
- Arrow icon for next page

---

## 15. Back-to-Top Button

### Structure
```
a.footer_scroll#scrollToTop → i.icon-arrow-up
```
- Fixed position, bottom-right
- Click: `window.scrollTo(0, 0)`
- Shows on scroll past threshold

---

## 16. Signup/Modal Popup (SweetAlert2)

### Configuration
```js
Swal.fire({
  customClass: {
    container: 'signup_container',
    popup: 'signup_popup',
    htmlContainer: 'signup_wrapper'
  },
  showClass: { popup: 'fadeIn' },
  hideClass: { popup: 'fadeOut' },
  showConfirmButton: false,
  showCloseButton: true,
  closeButtonHtml: '<i class="icon-times"></i>'
})
```
- Triggered by `.signUpTrigger` click
- Closes mobile menu first if open
- Contains form with validation
- Custom fade animations

---

## 17. Lazy Loading Images

### Pattern
```html
<picture>
  <source data-srcset="path.webp" srcset="placeholder.jpg" type="image/webp" />
  <img class="lazy" data-src="path.jpg" src="placeholder.jpg" alt="..." />
</picture>
```
- Vanilla LazyLoad: `{ repeat: true, smooth: true }`
- Uses `data-src` / `data-srcset` for deferred loading
- Smooth fade-in on load complete

---

## 18. Decorative Shapes

### Pattern
```
div.section_shapes (position: absolute, full-size, z-index: -1)
├── div.half--left
│   ├── span.circle--big
│   └── span.circle--small
└── div.half--right
    ├── span.circle--big
    └── span.circle--small
```
- CSS circles/ovals with border-only or filled styles
- Positioned at edges of sections
- Low z-index, non-interactive
- Optional: SVG shapes loaded as `<img>` tags

---

## 19. Lottie Animations

### Pattern
```html
<lottie-player
  class="lottie"
  src="lottie/animation.json"
  background="transparent"
  speed="0.5"
  style="width: 100%; height: 100%"
  loop
  autoplay
></lottie-player>
```
- Used for: hero illustrations, form sections, page headers
- Loaded via `@lottiefiles/lottie-player` script
- JSON-based vector animations
- Speed: 0.5 (hero) or 1.0 (other sections)

---

## 20. Map Component

### Setup
- Google Maps JS API Loader
- Uses AdvancedMarkerElement with custom SVG marker
- Theme: desaturated (grayscale) with accent color on landscape
- `disableDefaultUI: true` for clean look
- zoom: 10, centered on coordinates
