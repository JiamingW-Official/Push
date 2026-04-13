# Push UI Template — Interactions & Animations

> All scroll effects, hover states, parallax, counters, carousels, and micro-interactions.
> Colors/fonts from Design.md. This file is behavior-only.

---

## 1. Scroll-Triggered Animations

### 1.1 AOS (Animate On Scroll) — Global
```js
AOS.init({
  offset: 30,
  delay: 0,
  duration: 650,
  easing: 'ease',
  once: true  // trigger only once
});
```
- Apply `data-aos="fade-up"` on elements
- Stagger with `data-aos-delay="50"`, `"100"`, `"150"` etc.
- Used on: service cards, info items, list items

### 1.2 Typewriter Effect
- **Library**: typewriter-effect
- **Trigger**: IntersectionObserver (fires once when element enters viewport)
- **HTML Pattern**:
  ```html
  <div class="wrapper">
    <span class="tw-height h1"><span class="text">Target Text</span></span>
    <h1 class="type" data-text="Target Text">Target Text</h1>
  </div>
  ```
- `.tw-height` holds space (invisible), `.type` receives the typewriter
- Config: `autoStart: false`, cursor hidden
- Observer unobserves after triggering

### 1.3 Counter Animation (CountUp.js)
- **Trigger**: IntersectionObserver (fires once)
- **Duration**: 3 seconds
- **HTML**: `<span class="countNum" data-value="240" data-suffix="+" data-prefix="0">`
- Supports: `data-prefix`, `data-suffix`, `data-separator`
- Counter animates from 0 to `data-value`

### 1.4 Animated Underline
- **Trigger**: IntersectionObserver with `rootMargin: "80px"`, `threshold: 0.75`
- **Behavior**: Sets `width: 100%` when 75% visible, `0` otherwise
- **CSS**: transition on width property (~600ms)
- Used on: Join section's number underline

### 1.5 Progress Bar Animation
- **Library**: ProgressBar.js
- **Trigger**: IntersectionObserver (fires once)
- **Duration**: 700ms
- **HTML**: `<span class="progressLine" data-value="85" data-fill="colorHex">`
- Step callback updates stroke color and value text

### 1.6 Share Panel Slide-In
- **Trigger**: IntersectionObserver on `.share_panel`
- **Behavior**: Sets `animationPlayState = "running"` when visible
- **CSS**: `@keyframes panel` — slides in from right over 1s

---

## 2. Header Behaviors

### 2.1 Sticky Header
- On scroll > 0: adds `.sticky` class (fixed positioning)
- Returns to normal at scroll = 0 (if mobile menu not active)

### 2.2 Headroom.js — Smart Hide/Show
```js
Headroom({
  offset: 500,
  classes: {
    pinned: 'header--pinned',    // visible: scrolling up
    unpinned: 'header--unpinned' // hidden: scrolling down
  }
})
```
- Hides header when scrolling down past 500px
- Shows header when scrolling up (any amount)

### 2.3 Mobile Menu
- Trigger: `#headerTrigger` click
- Opens: `.active` on trigger + nav, `.opened` + `.sticky` on header, `fixed` on `<html>`
- Closes: Removes all classes, restores scrolling
- Auto-closes on window resize

### 2.4 Dropdown Menus
- **Desktop (>992px)**: Hover to show. Adds `.active` on mouseover, removes on mouseleave
- **Mobile (<992px)**: Click to toggle. Adds `.active` + `.collapse` on click

### 2.5 Active Page Highlighting
- Matches `data-page` attribute on nav items to current page
- Adds `.current` class to matching nav links

---

## 3. Carousel/Slider Configurations

### 3.1 Common Swiper Options
```js
{
  autoplay: { disableOnInteraction: true, pauseOnMouseEnter: true },
  loop: true,
  keyboard: { enabled: true, onlyInViewport: false }
}
```

### 3.2 Chart Slider (Coverflow 3D)
```js
{
  effect: "coverflow",
  centeredSlides: true,
  slidesPerView: "auto",
  spaceBetween: 30,  // 0 on mobile
  initialSlide: 2,
  speed: 700,
  coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: false }
}
```

### 3.3 Gallery Slider
```js
{
  autoplay: true, speed: 1500,
  breakpoints: {
    0: { slidesPerView: 1, spaceBetween: 20 },
    768: { slidesPerView: 2, spaceBetween: 30 },
    992: { slidesPerView: 2, spaceBetween: 40 },
    1200: { slidesPerView: 2, spaceBetween: 50 }
  }
}
```

### 3.4 Testimonials Slider
```js
{
  autoplay: true, speed: 1200,
  breakpoints: {
    0: { slidesPerView: 1, spaceBetween: 30 },
    768: { slidesPerView: 1, spaceBetween: 40 },
    992: { slidesPerView: 2, spaceBetween: 50 },
    1200: { slidesPerView: "auto", spaceBetween: 50 }
  }
}
```
- Calculates left padding from container to align properly

### 3.5 Recent Posts (Responsive Destroy)
- **≤1199px**: Initialize Swiper (1→2→3 slides per breakpoint)
- **≥1200px**: Destroy Swiper, show as CSS grid instead
- Resize listener recreates/destroys as needed

---

## 4. Hover & Click Interactions

### 4.1 Button Hover — Neon Shadow
- Default: `box-shadow: 3px 3px 0 $accent` (hard-edge, no blur)
- Hover: `box-shadow: 6px 6px 0 $headerColor` (shifts out + color change)
- Transition: 400ms ease-in-out

### 4.2 Navigation Link Underline
- `::after` pseudo-element, `width: 0` → `width: 100%` on hover
- Bottom position, 2px height
- Transition: 300ms ease-in-out

### 4.3 Card/Service Item Hover
- Shadow overlay fades in via opacity (0 → visible)
- Transition: 400ms ease-in-out

### 4.4 Icon Rotation on Hover
- Nav arrows: rotate 90°–220° depending on context
- Transition: 400ms ease-in-out

### 4.5 Accordion Toggle
- Bootstrap collapse events: `show.bs.collapse` / `hide.bs.collapse`
- `.transform` class toggles on icon → CSS rotates 180°

### 4.6 Video Popup
- Trigger: `.videoTrigger` click
- Popup: `.videoPopup` — adds `.visible` + `.fadeIn`
- Close: Click outside video → remove `.visible`, add `.fadeOut`, stop video
- YouTube player via youtube-player library

### 4.7 Blog Filter (Shuffle.js)
- Click filter button → add `.current` class, remove from others
- `shuffleInstance.filter(dataTarget)`
- On resize: `shuffleInstance.layout()`

### 4.8 Gallery Lightbox
- Library: baguettebox.js
- Trigger: Click on `.gallery` images → fullscreen lightbox view

---

## 5. CSS Animations

### 5.1 @keyframes

| Name | Duration | Properties | Usage |
|------|----------|-----------|-------|
| `fadeIn` | 400ms | opacity 0→1 | Modal/popup entrance |
| `fadeOut` | 400ms | opacity 1→0 | Modal/popup exit |
| `blink` | 0.9s infinite | opacity 1→0→1 | Typewriter cursor |
| `float` | 10s infinite | translateY(0 → -30px → 0) | Decorative image bobbing |
| `panel` | 1s | slide in from right | Article share panel |

### 5.2 Standard Transition Durations
| Duration | Usage |
|----------|-------|
| 300ms | Form placeholders, checkboxes, underlines, links |
| 400ms | Buttons, headers, icons, footer links, cards, dropdowns |
| 600ms | Animated underline width |

### 5.3 Easing
- Standard: `ease-in-out` for all interactive transitions
- Scroll animations: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances

### 5.4 Decorative Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
```
- Applied to featured images/illustrations
- 10s duration, infinite loop

---

## 6. Parallax Effects

### 6.1 Implementation
- Library: react-scroll-parallax (React component)
- Speed: `-10` (moves opposite to scroll direction)
- Applied to: decorative images within features sections
- Creates depth effect as user scrolls

---

## 7. Ticker/Marquee

### 7.1 Implementation
- Library: react-easy-marquee (React component)
- Duration: 15000ms (15s per full cycle)
- Direction: Reverse (right-to-left)
- Content source: Hidden `.ticker-item` spans, collected into marquee
- Full-bleed stripe across viewport width

---

## 8. Lazy Loading

```js
new LazyLoad({ repeat: true, smooth: true });
```
- Auto-applied to all `.lazy` images
- Uses `data-src` and `data-srcset` attributes
- Smooth fade-in on load

---

## 9. Form Validation

### 9.1 Validation Rules
- `.required` class → field must not be empty
- `data-type="email"` → regex: `/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/`
- `data-type="tel"` → must be numeric (isNaN check)
- Error: adds `.error` class to field
- Clear: on `input` event, removes `.error`

### 9.2 Success Notifications (SweetAlert2)
- Toast position: `top-end`
- Timer: 3000ms auto-dismiss
- Types: feedback, signup, search, reply — each with different message

### 9.3 Signup Modal
- Trigger: `.signUpTrigger` click
- SweetAlert2 popup with custom classes
- Show animation: `fadeIn`, hide: `fadeOut`
- Close button with icon

---

## 10. Utility Behaviors

### 10.1 Prevent Default
- All `href="#"` links: `preventDefault()`
- All forms: `preventDefault()` on submit

### 10.2 Dynamic Year
- `#currentYear` element: `new Date().getFullYear()`

### 10.3 Scroll To Top
- `#scrollToTop` click: `window.scrollTo(0, 0)`

### 10.4 Edge Padding Calculator
- Gets container's `margin-left + padding-left`
- Used to align testimonials slider with page grid

---

## 11. Exact CSS Specs (20 Precise Details from Source)

### 11.1 CSS Reset & Base
```css
* { margin: 0; padding: 0; box-sizing: border-box; outline: none; }
html { scroll-behavior: smooth; overflow-x: hidden; }
a, input, button, textarea { transition: all .3s ease-in-out; } /* global default */
textarea { resize: none; }
img { display: block; width: 100%; object-fit: cover; }
```

### 11.2 Custom Scrollbar
```css
*::-webkit-scrollbar { width: 5px; }
*::-webkit-scrollbar-track { background: var(--dark); }
*::-webkit-scrollbar-thumb { background-color: var(--primary); border-radius: 0; }
/* Firefox */
* { scrollbar-width: auto; scrollbar-color: var(--primary) var(--dark); }
```
5px wide, brand-colored thumb, no border-radius.

### 11.3 Container Exact Spec
```css
.container {
  max-width: 1105px; /* template = 1105px → Push uses 1180px */
  padding: 0 20px;   /* mobile */
}
@media (min-width: 768px)  { .container { padding: 0 30px; } }
@media (min-width: 1200px) { .container { padding: 0; } }      /* flush at desktop */
```

### 11.4 Header Exact Spec
```css
.header {
  height: 70px;          /* mobile */
  z-index: 110000;
  will-change: transform;
  transition: all .4s ease-in-out;
  border-bottom: 2px solid var(--dark); /* ::before pseudo */
}
@media (min-width: 992px) {
  .header { height: 103px; }
  .header.sticky { height: 88px; }
}
/* Headroom classes: */
.header--pinned   { transform: translateY(0%); }
.header--unpinned { transform: translateY(-100%); }
/* Sticky compensator: header.sticky + main { margin-top: 70px (mobile) / 88px (desktop) } */
```

### 11.5 Button Exact Spec — Neon Mixin
```css
.btn {
  height: 48px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1;
  border-radius: 0; /* Push override — template has border-radius: 2px */
}
.btn--neon {
  background: var(--primary);
  color: #fff;
  border: 1px solid var(--dark);
  box-shadow: 3px 3px 0 var(--accent); /* hard-edge, no blur */
}
.btn--neon:hover, .btn--neon:focus {
  box-shadow: 6px 6px 0 var(--dark); /* offset expands, color shifts */
}
.btn--arrow {
  height: unset; font-size: 14px; letter-spacing: 0.3px;
  /* Arrow icon: margin-left 5px → 10px + opacity 0 → 1 on hover */
}
```

### 11.6 Form Field Exact Spec
```css
.field {
  height: 48px;
  padding: 11px 16px;
  border: 1px solid var(--dark);
  border-radius: 0; /* Push override */
  box-shadow: 0 0 0 transparent;
  background: var(--surface);
}
.field::placeholder { opacity: 1; transition: opacity .3s ease-in-out; }
.field:focus::placeholder { opacity: 0; } /* placeholder fades on focus */
.field:focus { box-shadow: 3px 3px 0 var(--primary); }
.field.error { box-shadow: 3px 3px 0 red; }
textarea.field { height: 140px; margin-bottom: 35px; }
```

### 11.7 Nav Link Underline — Desktop
```css
.nav-item_text::before {
  content: '';
  position: absolute;
  bottom: -10px; left: 0;
  width: 0; height: 2px;
  background: var(--primary);
  transition: width .3s ease-in-out;
}
.nav-item:hover .nav-item_text::before,
.nav-item.current .nav-item_text::before { width: 100%; }
```

### 11.8 Dropdown Menu Exact Spec
```css
.dropdown-menu {
  border: 2px solid var(--dark);
  border-top: none;
  position: absolute;
  top: calc(100% + 2px); /* 2px gap from nav */
  opacity: 0; visibility: hidden;
  transition: opacity .3s ease;
}
.dropdown-menu.active { opacity: 1; visibility: visible; }
/* Items: padding 20px 30px, border-bottom 2px, hover: bg lightgray */
```

### 11.9 Typewriter Caret
```css
.tw-height {
  display: block; position: relative;
}
.tw-height .text { opacity: 0; } /* invisible placeholder preserving height */
.type { position: absolute; top: 0; } /* overlaid typewriter output */
.type .caret {
  display: inline-block;
  width: 22px; height: 13px;
  background: var(--primary);
  animation: blink 0.9s infinite both;
}
/* ::before on .tw-height in feedback: same caret at bottom: 0, left: 0 */
```

### 11.10 Animated Underline Exact Spec
```css
.animatedUnderline {
  position: absolute;
  height: 16px;      /* md: 22px */
  width: 100%;       /* controlled by JS: 0 → 100% */
  background: var(--primary);
  left: 0; bottom: -2px; /* md: bottom: 2px (below baseline) */
  border-radius: 0;  /* Push override */
  z-index: -1;       /* behind text */
  transition: width .6s ease-in-out;
}
```

### 11.11 Testimonial Slide Exact Spec
```css
.testimonials_slider-slide {
  border: 1px solid var(--dark);
  box-shadow: 3px 3px 0 var(--accent);
  background: var(--surface);
  padding: 30px; /* sm: 55px 25px 45px 70px */
  border-radius: 0; /* Push override */
  overflow: visible; /* avatar image bleeds outside */
}
/* Opening quote mark (sm+): ::before { content: '"'; 33×30px; accent bg; top: 25px; left: 25px } */
/* Active slide avatar: opacity 0 → 1 (transition .4s) */
/* Avatar: absolute positioned, bottom: -30px right: 10px (bleeds below card) */
```

### 11.12 Video Play Button Exact Spec
```css
.video-btn {
  width: 70px; height: 70px;
  border-radius: 50%; /* functional exception */
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 2px 2px 0 var(--accent);
}
.video-btn:hover { box-shadow: 2px 2px 0 var(--dark); }
.video .cover { /* poster image overlay */
  position: absolute; width: 100%; height: 100%; top: 0; left: 0;
  transition: opacity .4s ease-in-out;
}
.video .cover.hidden { opacity: 0; visibility: hidden; }
```

### 11.13 Video Popup Exact Spec
```css
.videoPopup {
  position: fixed; width: 100%; height: 100%;
  top: 0; left: 0; z-index: 400000;
  visibility: hidden; transition: all .4s ease-in-out;
}
.videoPopup.visible { visibility: visible; }
.video_frame {
  background: var(--surface); padding: 30px;
  min-height: 300px (mobile) → 350px → 450px → 600px;
  border: 1px solid var(--dark);
  box-shadow: 3px 3px 0 var(--accent);
}
/* Close button: absolute, right: 0, top: -40px (above frame); xl: right: -60px, top: -60px */
```

### 11.14 Social Icons Exact Spec
```css
.socials-item .link {
  width: 38px; height: 38px;
  border: 1px solid transparent;
  border-radius: 0; /* Push override */
  display: inline-flex; align-items: center; justify-content: center;
}
.socials-item .link:hover {
  border-color: var(--dark);
  box-shadow: 2px 2px 0 var(--primary);
  color: var(--dark);
}
```

### 11.15 Challenges Section Exact Spec
```css
.challenges { padding: 60px 0; } /* → 100px → 120px */
.challenges_list-item .number {
  width: 34px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
  background: var(--primary); color: var(--surface);
}
.challenges_list-item .separator {
  display: block; width: 100%; height: 2px;
  margin: 20px 0 10px; /* between number and title */
}
/* Grid: 2-col on sm+ (calc(50% - 20px)), gap 30px 40px */
/* Header: margin-right 80px → 100px on lg+ */
```

### 11.16 Join Section Exact Spec
```css
.join { padding: 60px 0; } /* → 100px → 110px 0 120px */
.join_list { margin: 20px 0 30px; }
.join_list-item .icon { margin-right: 15px; font-size: 14px; }
.join_btn { width: 250px; } /* sm+ */
/* max-width of header block: 800px centered on lg+ */
/* decorative media: hidden until 1200px, then absolute full-size */
```

### 11.17 Accordion Exact Spec
```css
.faq_wrapper {
  border: 2px solid var(--dark);
  box-shadow: 3px 3px 0 var(--accent);
  padding: 20px 20px 0; /* → 40px → 80px */
}
.accordion_item { border-bottom: 2px solid var(--dark); }
.accordion_item-wrapper .title {
  padding: 25px 0;
  transition: .4s ease-in-out;
}
.title[aria-expanded="true"] { padding-bottom: 15px; } /* tightens on open */
.title_icon.transform .icon { transform: rotate(180deg); }
.accordion .body { margin-bottom: 30px; }
/* Sub-item number badge: 35×30px, accent bg, margin-right: 15px */
```

### 11.18 Stripe / Ticker Exact Spec
```css
.stripe {
  overflow: hidden; padding: 30px 0;
  background: var(--primary);
}
.stripe_block {
  width: 240px; color: #fff; padding-left: 25px;
  border-right: 12px solid var(--accent); /* thick accent divider */
}
.stripe_block-icon { transform: rotate(130deg); font-size: 48px; margin-right: 15px; }
.ticker { color: #fff; }
.ticker-component { height: 38px (mobile) → 65px (desktop) }
.ticker-text { padding: 0 15px → 20px → 25px }
.ticker-item { visibility: hidden; } /* source elements hidden, JS uses content */
```

### 11.19 Post Card Timeline Effect
```css
/* Blog sidebar: .post-item on md+ gets a left timeline line */
.post-item::before {
  content: '';
  position: absolute;
  width: 1px; height: 100%;
  background: var(--dark);
  left: -15.5px; /* outside card, between cards */
  top: 0;
}
/* Card image: height 370px (mobile) → 430px (md+), object-fit: cover */
```

### 11.20 Feedback Section Layout
```css
.feedback { padding: 50px 0 45px; } /* → 80px → 120px */
.feedback_main { max-width: 540px; } /* lg+, left column */
/* Lottie media lg+: height 500px, positioned: top: 60%, translateY(-50%) */
/* Decorative shapes: only visible at 1400px+, bleeds -40% left, -22% right */
/* textarea: height 140px */
/* Form fields stacked with margin-bottom: 20px between inputs */
```
