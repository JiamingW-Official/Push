# Push UI Template — Section Patterns

> Full HTML structure reference for every section type. Use Push colors/fonts from Design.md.

---

## 1. Hero Section — Split Layout (Home 1)

```
section.hero
├── div.hero_bg → img (full-width SVG background shape)
└── div.container (d-xl-flex)
    ├── div.hero_main
    │   ├── span.tw-height.h1 → span.text (height-placeholder for typewriter)
    │   ├── h1.hero_main-title.type[data-text="..."] (typewriter animation)
    │   ├── p.hero_main-text
    │   └── a.hero_main-btn.btn.btn--neon
    └── div.hero_media
        └── lottie-player[autoplay, loop, speed=0.5]
```
**Layout**: Text left, Lottie right. Stacks on mobile (column).
**Animation**: Typewriter types the h1. Lottie loops indefinitely.
**CTA**: Single neon-style button.

---

## 2. Hero Section — Typewriter + Video + Lottie (Home 2)

```
header.page
├── img.page_bg (SVG cutout background)
├── div.page_shapes → div.ball → lottie-player[loop, autoplay]
└── div.container
    └── div.page_main
        ├── h5.page_main-subtitle (eyebrow text)
        ├── div.wrapper
        │   ├── span.tw-height.h1 → span.text
        │   └── h1.page_main-title.type[data-text="..."]
        └── div.page_main-action (d-flex, flex-column, flex-sm-row)
            ├── a.btn.btn--neon (primary CTA)
            └── span.play-wrapper.videoTrigger (d-inline-flex, align-items-center)
                ├── a.video-btn.btn.btn--neon → i.icon-play
                └── "Play video" (text label)
```
**Layout**: Centered content. Lottie floats as decorative ball shape.
**Animation**: Typewriter + floating Lottie shape.
**Actions**: Two side-by-side: button + video play trigger.

---

## 3. About Section — Numbered Items

```
section.about.section
└── div.container (d-xl-flex)
    ├── div.about_media → picture → img
    └── div.about_main
        ├── h3.about_main-title
        └── ul.about_main-list (d-flex, flex-column, flex-lg-row)
            └── li.about_main-list_item
                ├── span.number.countNum[data-prefix="0", data-value="1"] → "01"
                └── div.main
                    ├── h5.main_title
                    └── p.main_text
```
**Layout**: Image left, text+numbered list right. 2-column list on lg+.
**Animation**: Numbers animate from 0 via CountUp.js on scroll into view.
**Pattern**: Numbered items (01, 02) with paragraph descriptions.

---

## 4. Services List Section — Icon Cards

```
div.services
├── img.services_shape (decorative SVG, absolute)
└── div.container (d-flex, flex-column-reverse, flex-xl-row)
    ├── div.services_media → img (SVG illustration)
    └── ul.services_list
        └── li.wrapper[data-aos="fade-up", data-aos-delay="{stagger}"]
            └── a.services_list-item (d-flex, flex-column)
                ├── i.icon (icomoon icon)
                ├── span.title.h5
                └── p.text
```
**Layout**: Cards left, illustration right (reversed on mobile).
**Animation**: AOS fade-up with staggered delays (0, 50, 100, 150ms).
**Cards**: 4 vertical items, each with icon + title + description.

---

## 5. Features/Stats Section — Counter Numbers

```
div.features.section
└── div.container (d-md-flex, flex-wrap, align-items-center)
    ├── div.features_media → picture → img
    ├── div.features_item[data-order="1"]
    │   ├── h6.title
    │   └── span.countNum.number.h1[data-value="240", data-suffix="+"]
    ├── div.features_item[data-order="2"] ...
    ├── div.features_item[data-order="3"] ...
    └── div.features_group
        ├── div.features_group-bg → picture → img
        └── picture → img.features_group-girl.parallaxEl
```
**Layout**: Stats positioned around central image. 3 counter blocks.
**Animation**: CountUp on scroll. Parallax on girl image.
**Responsive**: On mobile, stats stack in `.features_list` container.

---

## 6. Challenges Grid — Numbered + Separator

```
section.challenges.section
├── div.challenges_shapes (left/right circles, absolute)
└── div.container (d-lg-flex, align-items-center)
    ├── div.challenges_header
    │   ├── h3.challenges_header-title (d-flex, align-items-end)
    │   │   ├── span.text
    │   │   └── i.icon-arrow-left (rotated arrow)
    │   └── p.challenges_header-text
    └── ul.challenges_list (d-flex, flex-column, flex-sm-row, flex-wrap)
        └── li.challenges_list-item
            ├── span.number.countNum[data-prefix="0", data-value="N"]
            ├── span.separator (horizontal line)
            └── h5.title
```
**Layout**: Header left, 6-item grid right (2x3 on sm+, stacked on mobile).
**Animation**: Counter animates numbers. Decorative circles in background.
**Pattern**: Number → separator line → title. Clean minimal grid.

---

## 7. Video Embed Section

```
section.video.section
└── div.container
    ├── h4.video_header (blockquote-style headline)
    └── div.video_content.video
        ├── span.cover
        │   ├── picture → img (poster image)
        │   └── a.video-btn.btn.btn--neon → i.icon-play
        └── iframe[YouTube embed, hidden until play]
```
**Behavior**: Cover image + play button. Click triggers YouTube popup.
**Animation**: Cover fades, popup slides in with `.fadeIn` class.

---

## 8. Join / CTA Section — Counter in Headline

```
section.join.section
├── div.join_media (left/right decorative SVGs, absolute)
└── div.container (d-md-flex, flex-column, align-items-center)
    ├── h3.join_header
    │   └── span.join_header-wrapper
    │       ├── span.number.countNum[data-value="68000", data-suffix="+", data-separator=","]
    │       └── span.animatedUnderline (width 0→100% on scroll)
    ├── ul.join_list (d-flex, flex-column, flex-md-row, justify-content-md-center)
    │   └── li.join_list-item → i.icon-check + text
    └── a.join_btn.btn.btn--neon
```
**Layout**: Centered. Counter embedded inline in headline text.
**Animation**: Number counts up + underline width animates on IntersectionObserver (threshold 0.75).
**Pattern**: Big number CTA → 3 checkmark benefits → button.

---

## 9. Testimonials + Ticker Stripe

```
section.testimonials.section
└── div.container
    ├── h4.testimonials_header
    ├── div.testimonials_controls (prev/next buttons)
    └── div.testimonials_wrapper
        └── div.testimonials_slider.swiper
            └── div.swiper-wrapper
                └── div.swiper-slide
                    ├── div.main
                    │   ├── p.main_review
                    │   ├── h6.main_author
                    │   └── span.main_company
                    └── picture → img (avatar)

div.stripe (d-flex, align-items-center)
├── div.stripe_block (d-none, d-sm-flex)
│   ├── span.stripe_block-icon → i.icon-arrow-left
│   └── ul.stripe_block-list (stats list)
└── div.ticker.h3#ticker (React marquee, 15s, reverse direction)
    └── [hidden .ticker-item spans as source]
```
**Swiper Config**: Loop, autoplay 1200ms, keyboard. 1→2→auto slides per breakpoint.
**Ticker**: Horizontal infinite scroll marquee below testimonials.
**Layout**: Testimonials above, full-bleed ticker stripe below.

---

## 10. Pricing Cards — 3-Column

```
section.pricing.section
└── div.container
    ├── div.pricing_header → h4 + p
    └── ul.pricing_list (d-flex, flex-column, flex-md-row, flex-wrap)
        └── li.pricing_list-item
            ├── div.media (optional SVG decoration on featured card)
            ├── div.pricing_list-item_header
            │   ├── h5.title (plan name)
            │   └── span.price
            │       ├── span.sign → "$"
            │       ├── span.int → "19"
            │       └── span.float → ".99"
            ├── ul.pricing_list-item_list → li.list-item (features)
            └── a.btn (CTA) or span.btn (disabled for current plan)
```
**Layout**: 3 equal columns on md+, stacked on mobile.
**Price Display**: Split into sign/int/float spans for styling control.
**Pattern**: Title → Price → Features list → CTA button.

---

## 11. Collapsible Comparison Table

```
section.model.section
└── div.container (d-xl-flex, align-items-center, justify-content-between)
    ├── div.model_header → h4 + subtitle + text + CTA button
    └── div.model_table
        ├── div.model_table-header → h6 labels (3 column names)
        └── div.model_table-col (repeating expandable rows)
            ├── span.cell.cell--trigger[data-bs-toggle="collapse"]
            │   ├── span.label (row name)
            │   └── i.icon-angle-left (rotates on expand)
            └── div.cell-collapse.collapse
                └── span.cell → span.cell-label + span.cell-content
```
**Behavior**: Bootstrap collapse. Click row → expand to show detail cells.
**Icon**: Rotates 180° on expand/collapse via `.transform` class.
**Layout**: Header left, table right on xl+. Stacked on mobile.

---

## 12. Gallery Slider (About Page)

```
div.page_header
├── div.page_slider-controls → prev/next buttons
└── div.page_slider.swiper.gallery
    └── div.swiper-wrapper
        └── div.swiper-slide
            └── a[data-role="gallery-link"] → picture → img.lazy
```
**Swiper Config**: Autoplay 1500ms. 1→2 slides per breakpoint. 20→50px gap.
**Lightbox**: baguettebox.js opens on click for fullscreen gallery view.

---

## 13. Blog Filter Grid

```
ul.blog_filters (d-flex, flex-wrap) → li → a.blog_filters-item[data-target]
div.blog_posts (Shuffle.js container)
└── div.blog_posts-item.post-item[data-groups='["cat1","cat2"]']
    └── div.wrapper
        ├── div.main → a.main_title + div.main_meta
        └── div.media → picture → img.lazy
```
**Filter**: Click filter → Shuffle.js filters by `data-groups` matching `data-target`.
**Active State**: `.current` class on active filter button.
**Layout**: Grid with responsive columns (1→2→3→4).

---

## 14. FAQ Accordion

```
div.accordion#faq_accordion
└── div.accordion_item
    └── div.accordion_item-wrapper
        ├── h4.title[data-bs-toggle="collapse", collapsed]
        │   ├── text
        │   └── span.title_icon.transform → i.icon-arrow-left
        └── div.accordion-collapse.collapse[.show on first item]
            └── div.body → div.main
                ├── p.main_general
                └── ul.main_list → li (numbered sub-items with countNum)
```
**Behavior**: Bootstrap collapse. First item open by default (`.show`).
**Icon**: Arrow rotates via `.transform` toggle.
**Content**: General text + numbered sub-list with counter animations.

---

## 15. Feedback Form + Lottie

```
section.feedback.section
├── div.feedback_shapes (decorative, absolute)
└── div.container (d-lg-flex, align-items-center)
    ├── div.feedback_main
    │   ├── div.feedback_main-header → animated title + text
    │   └── form.feedback_main-form.form (d-flex, flex-column)
    │       ├── input.field.required[placeholder, name]
    │       ├── input.field.required[data-type="email"]
    │       ├── textarea.field.required
    │       └── button.btn.btn--neon
    └── div.feedback_media → lottie-player
```
**Layout**: Form left, Lottie right on lg+. Stacked on mobile.
**Validation**: JS validates `.required` fields, `data-type="email"` for email regex.
**Success**: SweetAlert2 toast notification (top-end, 3s timer).

---

## 16. Article/Post Layout

```
article.article
├── div.article_media--main
│   ├── picture → img.lazy
│   └── div.share_panel (floating side panel)
│       ├── span.share_panel-label → "Share"
│       └── ul.share_panel-list (d-flex, flex-column) → social icon links
├── h4.article_header.container--sm
├── p.article_text.container--sm (multiple paragraphs)
├── div.article_media--secondary → picture → img
├── q.article_quote.h4 (blockquote)
├── div.article_progress (animated progress bars)
│   └── div.block → span.progressLine[data-value, data-fill]
├── div.article_tags → tag links
└── div.navigation → prev/next post links with titles
```
**Share Panel**: Absolute-positioned, animates in via CSS `@keyframes panel` on IntersectionObserver.
**Progress Bars**: ProgressBar.js, 700ms animation on scroll into view.
**Container--sm**: Narrower max-width for text readability.

---

## 17. Footer

```
footer.footer
└── div.container
    ├── div.footer_top
    │   ├── a.logo → icon + text (larger h2 size)
    │   └── ul.footer_top-nav → li → a.link.h5 + arrow icon
    ├── div.footer_bottom
    │   ├── div.footer_bottom-contacts → email link + phone link
    │   └── div.footer_bottom-socials → ul.socials → 9 social icons
    └── p.footer_copyright → dynamic year via #currentYear
└── a.footer_scroll#scrollToTop → i.icon-arrow-up
```
**Back-to-top**: Click → `window.scrollTo(0, 0)`.
**Dynamic year**: JS sets `new Date().getFullYear()`.
