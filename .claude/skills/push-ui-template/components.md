# Push UI Template — Component Specs

> Detailed specs for every reusable component. Colors/fonts from Design.md.

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
