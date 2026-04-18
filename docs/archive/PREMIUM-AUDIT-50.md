# Push Landing Page — Premium Design Audit

> **审计对象：** `push-six-flax.vercel.app`
> **日期：** 2026-04-13
> **参考标杆：** Linear.app · Stripe.com · Vercel.com · Arc.net · Aesop.com · Rapha.cc

---

## A. 结构性破损 — 必须立即修复

### 01 · 7 个 `.reveal` 元素永远不可见
**问题：** IntersectionObserver 未对 7 个 `.reveal` 添加 `.visible` class。受影响：Tier展示卡（Clay→Ruby）、Creator底部文案、How it Works标题+3步卡片。占页面内容 ~40%。
**根因：** `ScrollRevealInit.tsx` 的 `useEffect` 在 hydration 时注册 observer，但这7个元素可能因 Next.js streaming/partial hydration 延迟而未被 `querySelectorAll('.reveal')` 捕获。
**修复：** 改用 `MutationObserver` 动态捕获新增 `.reveal` 元素，或在 observer 注册前加 `requestIdleCallback` 延迟。备选：给 `.reveal` 加 CSS fallback `animation: revealFallback 0s 2s forwards` 让 2 秒后自动显示。

### 02 · Pricing 三张卡片完全不可见
**问题：** 3 张 pricing card（Starter $19.99 / Growth $69 / Pro $199）`opacity: 0`，从未获得 `.visible`。用户看不到定价 = 零转化。
**修复：** 同 #01。这是同一个 IntersectionObserver bug 的延续。

### 03 · Nav 链接在浅色背景上几乎看不见
**数据：** 固定 nav 的链接颜色 `rgba(0,48,73,0.65)` 在 `rgba(245,242,236,0.95)` 背景上——对比度仅约 3.2:1，不满足 WCAG AA（需 4.5:1）。
**修复：** 浅色 nav 状态下链接用 `rgba(0,48,73,0.85)` 或更深。参考 Linear：导航链接在浅色背景上是纯深色。

### 04 · "35% Platform margin target" 暴露内部指标
**问题：** Hero 统计条第三个数据「35% — Platform margin target per campaign」是内部财务指标，不是用户关心的价值点。
**修复：** 替换为面向用户的指标，如 `100% — Verified foot traffic` 或 `24h — Campaign launch time`。

---

## B. 排版系统 — Typography

### 05 · H1 weight 应为 900 而非 800
**数据：** `font-weight: 800`（ExtraBold）。Design.md 明确规定 Display/Hero 用 `900`（Black）。
**修复：** `.hero h1 { font-weight: 900; }`。900 vs 200 的 weight contrast 是 Push 的编辑式签名。

### 06 · "into" 字的 opacity 太低，读不清
**问题：** "Turn creators **into** results" 中的 "into" 用了极低 opacity（约 0.25），在 Deep Space Blue 背景上几乎不可见。意图是轻量 → 重量的对比，但过度了。
**修复：** 将 "into" 的 opacity 提升到 0.45–0.55，或改用 Darky weight 200（轻但清晰），而非降 opacity。参考 Aesop：他们用 weight 差异做层次，从不降 opacity 到不可读。

### 07 · H2 应更大更有冲击力
**数据：** Section H2 是 `54.56px`。Design.md 规定 H1 是 `clamp(48px, 6vw, 80px)`。当前 H2 接近 H1 但缺少视觉跳跃感。
**修复：** H2 用 `clamp(36px, 5vw, 64px)`，并确保 weight 700→800 之间有差异。每个 section 的标题应该像杂志封面的副标题——大胆但明显低于 hero。

### 08 · Eyebrow 字号 11px 太小
**数据：** "NYC'S CREATOR ACQUISITION ENGINE" 是 `11px`，在 1280px 屏幕上像灰尘。
**修复：** 提升到 `12px`–`13px`。保持 uppercase + `0.08em` letter-spacing。参考 Stripe：他们的 eyebrow 是 12–14px，monospace，有足够存在感但不抢标题。

### 09 · Body text 行高比偏大
**数据：** Body 文字 `16px / 28.8px`（line-height 1.8）。对等宽字体来说偏松。
**修复：** 等宽字体最佳行高 1.55–1.65。改为 `line-height: 1.6`（25.6px）。Vercel 的 mono body 用 1.6。

### 10 · Hero body text 颜色太淡
**数据：** "Push matches local businesses..." 的颜色是 `rgba(0,48,73,0.55)` 在深蓝背景上——实际渲染为极淡的蓝灰，对比度不足。
**修复：** 在暗色背景上 body 应用 `rgba(245,242,236,0.75)` 或 `rgba(255,255,255,0.7)`。暗底浅字需要比浅底深字更高的 opacity。

### 11 · Section 编号（01, 02...）和标签缺少视觉层级联动
**问题：** "01 · For Merchants" 作为 section tag 存在但在视觉上没有形成强标记系统。编号和标签是并列的，没有利用 weight contrast。
**修复：** 编号用 Darky weight 200（超轻巨大数字，如 `48px`）作为 section 的装饰定位号，标签用 CSGenioMono `11px` uppercase 叠在下方。参考 ashleybrookecs.com 的编号式布局——编号本身就是装饰元素。

---

## C. 布局与间距 — Layout & Spacing

### 12 · Hero 右侧 50% 完全空白
**问题：** 1280px 宽度下，Hero 内容全部堆在左侧。右半边是纯色深蓝。没有任何视觉锚点。
**修复：** 添加 hero 右侧视觉——QR code 扫描流程动画（Lottie）、抽象化的手机模拟、或一个巨大的装饰数字/图形。参考 Linear.app：hero 右侧有产品截图；参考 Arc.net：右侧有 browser preview。Push 可以用一个 stylized QR → phone → verified 的三步 flow 作为右侧视觉。

### 13 · Hero 顶部留白过大
**问题：** Hero 高度 1171px，内容开始于 ~388px 处。顶部有 320px+ 的纯深蓝空白。
**修复：** 将 hero `padding-top` 减少，或让 eyebrow 更靠上。hero 应在首屏（viewport height）内包含完整信息（headline + subtitle + CTA）。当前在 900px viewport 高度下，CTA 按钮被裁剪。

### 14 · Stats bar 被 hero 和 section-bright 的过渡区夹住
**问题：** 三个统计数字（$19.99 / 6 / 35%）位于 hero 底部但视觉上与 hero 脱节——它们用白色字在深蓝底上，紧贴着浅色 section 的起点。过渡突兀。
**修复：** 给 stats bar 独立的视觉容器：一个 `--surface-elevated` 白色条带，`box-shadow` 抬升，跨越 hero 和 section 之间的边界（负 margin 向上叠入 hero）。参考 Stripe 的 metric strip：独立浮动的卡片条。

### 15 · Section padding 120px 垂直空白过大
**数据：** 每个 section 的 padding 是 `120px 0px`。加上内容本身的 margin，section 之间的视觉间距接近 200px。
**修复：** 桌面端 section padding 减至 `88px 0`–`96px 0`。移动端已经正确缩减到 `64px`。参考 Linear：section 间距约 80px–100px。

### 16 · Container 宽度未设置 max-width
**数据：** `.container` 没有显式 max-width（计算结果取决于父级）。在超宽屏幕（2560px+）上内容会拉得很散。
**修复：** `.container { max-width: 1200px; margin: 0 auto; }`。1200px 是编辑式布局的最佳宽度——够宽但保持阅读舒适度。

### 17 · Split layout 比例不对称但不够有张力
**问题：** For Merchants section 用 split layout（文字左 + 视觉右），但右侧 `.split-visual` 是空的（没有图片/插图），只有背景色块。
**修复：** 右侧应有具体视觉——QR 码 mock、dashboard 截图、或归因流程图解。如果暂无素材，用一个 CSS-only 的 abstract composition（彩色色块 + 数字 overlay）。参考 Aesop：即使没有照片也用精心设计的色块和排版作为视觉。

### 18 · CTA section 用纯白背景，与 Surface 系统脱节
**数据：** `.cta-section` 背景 `rgb(255,255,255)` = `#ffffff`。Design.md 的 surface 系统规定 `--surface-elevated`（Pure White）用于 elevated 元素，但 section 级别应该是 `--surface`（Pearl Stone `#f5f2ec`）或 `--surface-bright`（Snow `#fafaf8`）。
**修复：** `.cta-section { background: var(--surface-bright); }` 保持三层 surface 系统的一致性。

---

## D. 色彩与视觉节奏 — Color & Visual Rhythm

### 19 · 页面背景色交替模式太单调
**问题：** 当前节奏：深蓝(hero) → 浅色 → 深蓝 → 浅色 → 浅色 → 白 → 深蓝(footer)。中间有两个连续浅色 section（How it Works + Pricing），破坏了交替节奏。
**修复：** Pricing section 改为 `--surface`（Pearl Stone）或加入一个微妙的色调变化（如 champagne-tinted header band）打破单调。参考 Stripe：每个 section 有独特的背景处理，即使都是浅色也有纹理/渐变差异。

### 20 · Champagne Gold 完全未出现在 Landing Page
**数据：** `--champagne: #c9a96e` 是品牌色之一，在 Design.md 中标注为 "premium identity color"，但 Landing Page 上没有任何元素使用它。
**修复：** 在 Proven/Gold tier 卡片的 border-top、Pricing "Most Popular" 标签、或 hero 统计数字的装饰线上使用 Champagne Gold。克制使用（≤3处），但不能完全缺席。

### 21 · Steel Blue 仅用于 eyebrow，存在感太低
**数据：** `--tertiary: #669bbc` 只出现在 hero eyebrow（11px 字）上。作为品牌五色之一，它应该在 links、次要 CTA、info badges 等处出现。
**修复：** Section tag labels（"For Merchants" 等）改用 Steel Blue；"or try the demo" link 改用 Steel Blue；feature list 的 checkmarks/bullets 用 Steel Blue。

### 22 · 暗色 section 缺少深度层次
**问题：** Hero 和 For Creators section 都是纯 `--dark` (#003049) 背景。没有渐变、纹理、或 subtle pattern 增加视觉深度。
**修复：** 添加 subtle radial gradient：`background: radial-gradient(ellipse at 20% 50%, rgba(102,155,188,0.08), transparent 70%), var(--dark);`。这个极微弱的 Steel Blue 光晕会增加深度感而不破坏品牌色纯度。参考 Vercel：暗色 hero 有微妙的 spotlight 效果。

### 23 · Hard-edge shadow 缺失于多个应有的按钮
**数据：** "Start for $19.99/mo" 有正确的 `3px 3px 0 var(--accent)` 硬阴影。但 "Join as Creator — Start Free" 的 shadow 是 `none`。
**修复：** Ghost/outlined 按钮也应有硬阴影——用更轻的版本：`2px 2px 0 rgba(0,48,73,0.15)`。这维持了品牌的 "印刷感" 签名。

---

## E. 内容与文案 — Content & Copy

### 24 · Hero subtitle/body 文案太技术化
**当前：** "Push matches local businesses with creators who drive real foot traffic — verified by QR code attribution at the transaction level."
**问题：** "QR code attribution at the transaction level" 是产品规格，不是价值主张。首次访客不关心归因技术。
**修复：** 重写为情感+结果导向："Creators post. Customers show up. You only pay when it works." 把技术细节留给 For Merchants section。

### 25 · "NYC'S CREATOR ACQUISITION ENGINE" 太机器化
**问题：** Eyebrow 读起来像内部产品代号，不像面向用户的定位。
**修复：** 改为 "NYC'S LOCAL CREATOR MARKETPLACE" 或更有人味的 "WHERE NYC BUSINESSES FIND THEIR NEXT CREATOR"。

### 26 · For Merchants — feature list 缺少数字佐证
**当前：** "Creators matched by performance score, location, and tier" / "Campaign live in under 24 hours" 等。
**问题：** 没有社会证明或具体成效数字。"in under 24 hours" 是唯一的具体承诺。
**修复：** 增加 proof points："87% creator match rate within 2 miles" / "Average $3.20 customer acquisition cost" / "Zero ops burden — we handle everything"。即使是 projected 数字也比没有强。

### 27 · For Creators — tier 数据和 Design.md 不一致
**数据对比：**
| Tier | 页面显示 | Design.md / push-creator skill |
|------|---------|-------------------------------|
| Proven | $32 + 5% | 应为 $32 + 5% ✓ |
| Closer | $55 + 7% | 应为 $55 + 7% ✓ |
| Partner | 缺失 | 页面上没有 Partner/Obsidian tier |

Partner tier 完全缺席。6-tier system 只展示了 5 个。
**修复：** 添加 Partner/Obsidian tier 卡片，使用 `--tier-obsidian` 色 + `obsidianPulse` 动画。

### 28 · CTA section 文案缺少紧迫感
**当前：** "Your next customer is already on Instagram. Launch a campaign in under 24 hours."
**问题：** 没有 FOMO、没有 scarcity、没有时间限制。对一个早期产品来说，应该有 founding/early-access 的紧迫感。
**修复：** 加入 "NYC founding cohort — limited spots" 或 "First 50 merchants get priority matching"。

### 29 · Footer 描述 "The AI engine that..." 与 Hero 定位矛盾
**Footer：** "The AI engine that turns creators into measurable customer acquisition..."
**Hero：** "NYC's Creator Acquisition Engine"
**问题：** Footer 突然引入 "AI engine" 概念，Landing Page 其他部分从未提及 AI。
**修复：** Footer 描述和 hero 保持一致："NYC-first marketplace connecting businesses with creators who drive verified foot traffic."

### 30 · "or try the demo — no account needed →" 链接太隐蔽
**问题：** Demo 链接用极浅的颜色（与 body text 同 opacity），夹在两个大按钮下方。Demo 是 Push 最强的转化路径之一（低摩擦），应该更突出。
**修复：** 给 demo link 独立行、加 underline animation、用 `--tertiary` 色。或做成第三个按钮。

---

## F. 交互与动效 — Interaction & Motion

### 31 · GSAP + Lenis 在运行时都未加载
**数据：** `typeof gsap === 'undefined'` 和 `typeof Lenis === 'undefined'` 均为 true。`package.json` 有依赖但运行时未挂载。
**修复：** 确保 `SmoothScroll.tsx` 和 GSAP 在 layout.tsx 中正确 import 并渲染。Lenis smooth scroll 是 Push 设计语言的核心——没有它整个页面的滚动手感是普通的。

### 32 · 页面没有任何 scroll-driven 动画
**问题：** Design.md 定义了完整的 GSAP ScrollTrigger 动画系统（sticky grid、parallax、counter animation），但页面只有基础的 fade-in（还 broken）。
**修复：** 实现至少 3 种 scroll-driven 效果：(1) Hero headline 随滚动 scale down，(2) Stats bar counter 动画（0→数值），(3) Tier cards 渐进式展示（sticky grid pattern）。

### 33 · 按钮没有 press 反馈
**数据：** Design.md 规定 `Button press: scale(0.97), instant`。当前无 `:active` 样式。
**修复：** 所有按钮加 `.btn:active { transform: scale(0.97); }`。

### 34 · 卡片没有 hover lift 效果
**数据：** Design.md 规定 `Card hover lift: translateY(-10px), 360ms`。pricing cards、tier cards 都没有 hover 交互。
**修复：** `.pricing-card:hover, .tier-card:hover { transform: translateY(-10px); transition: 360ms cubic-bezier(0.22,1,0.36,1); }`

### 35 · 链接没有 underline slide-in 动画
**数据：** Design.md 规定 "Link hover: underline slides in from left, 300ms, ease"。当前链接无 hover 特效。
**修复：** 用 `::after` pseudo-element 实现 `width: 0→100%` 的下划线滑入。

---

## G. 信息架构与转化 — IA & Conversion

### 36 · Landing Page 没有任何社会证明
**问题：** 没有 testimonials、client logos、creator 头像、success stories、数字 proof。对一个 marketplace 来说，双边信任是核心。
**修复：** 在 For Merchants 和 For Creators 之间加一个 "proof strip"——哪怕只是 "Trusted by 12 NYC businesses" + 3-4 个 logo（或 placeholder 色块）。参考 Linear：首页有 "Thousands of teams" + logo grid。

### 37 · 没有 FAQ section
**问题：** 对一个新品类产品（performance-based local creator marketplace），用户有大量疑问：佣金怎么算？QR码怎么工作？如何保证不作弊？
**修复：** 在 Pricing 和 CTA 之间加 FAQ accordion。Design.md 已有 FAQ Accordion pattern spec。6-8 个问题足够。

### 38 · Pricing 卡片缺少 recommended/highlighted 状态
**数据：** Growth 卡片有 "Most Popular" 标签但背景仅 `#ffffff`（其他是 `#fafaf8`）。差异太微妙。
**修复：** Growth 卡片应有 `border: 2px solid var(--primary)` + `box-shadow: 0 8px 32px rgba(0,48,73,0.12)` + champagne gold "Most Popular" badge。参考 Stripe 的 pricing：推荐方案有明显的视觉权重提升。

### 39 · 没有 merchant → creator 的交叉引导
**问题：** For Merchants section 没有说 "See creator perspective →"，For Creators section 没有说 "See what merchants offer →"。双边 marketplace 应该让两边用户互相了解。
**修复：** 每个 section 底部加一行 cross-link："Curious what creators see? → Preview the creator experience"。

### 40 · Demo 入口不够突出
**问题：** Demo 是 Push 最好的转化利器（零摩擦体验产品），但在 hero 只有一行 12px 文字链接。
**修复：** 在 How it Works section 的每一步旁边加 "See it live →" 链接到对应的 demo 视角。或在 hero 右侧放一个 demo preview 截图 + "Try the demo" CTA。

---

## H. 移动端 — Mobile

### 41 · Mobile hero H1 字号仍然偏大
**数据：** 375px 宽度下 H1 是 `64.35px`。对 375px 来说还可以，但 "Turn creators" 一行刚好填满宽度，"into results." 换行后 "results." 一个词独占一行，排版不够紧凑。
**修复：** Mobile 上 H1 尝试 `clamp(48px, 14vw, 72px)`，让 headline 在 1.5 行内完成。或者修改文案让手机上断行更自然。

### 42 · Mobile stats bar 第三项占满宽度
**数据：** 前两个 stat（$19.99 / 6）各占 229px，第三个（35%）占 457px（全宽）。布局不均匀。
**修复：** 三个 stat 应在移动端变为 3×1 垂直堆叠，每个等宽；或 2+1 网格但让第三个居中。

### 43 · Mobile nav hamburger 缺少动画
**问题：** 汉堡菜单图标是静态三线。
**修复：** 添加 open → X 的过渡动画（标准 300ms 旋转变形）。

### 44 · Mobile CTA 按钮间距太紧
**数据：** 两个 CTA（红色 + ghost）紧挨，中间几乎没有间距。
**修复：** CTA 之间加 `12px` 间距（`gap: 12px` 或 `margin-top`）。

---

## I. 微细节与 Premium 感知 — Micro-details

### 45 · 缺少 loading 或 skeleton 状态
**问题：** 首次访问时，字体加载期间（`document.fonts.status === 'loading'`）页面内容闪烁或出现 fallback font。
**修复：** 实现 `font-display: swap` + 首屏用 skeleton loading pattern（Design.md 已有 `shimmer` animation）。或对关键文字用 `font-display: block` 配合 layout-stable fallback metrics。

### 46 · 缺少 favicon 和 OG meta
**问题：** 默认 Vercel/Next.js favicon。没有品牌化的 browser tab 体验。
**修复：** 制作 Push "P" favicon（Darky Black weight, Flag Red 背景）。添加 og:image、og:description、twitter:card meta。

### 47 · Footer 社交链接只有文字，没有图标
**数据：** "TWITTER INSTAGRAM LINKEDIN" 是纯文字。
**修复：** 用 SVG 图标（或 Lucide icons）替代文字。每个图标 20×20px，`--tertiary` 色，hover 变 `--primary`。图标有更好的扫视效率。

### 48 · 缺少 "Back to top" 按钮
**问题：** 6700px 长页面没有回到顶部的快捷方式。
**修复：** 固定在右下角，`border-radius: 50%`（Design.md 允许的例外），当滚动超过 500px 时 fade in。

### 49 · 页面标题 "Push — Local Creator Acquisition" 太通用
**问题：** Browser tab 标题是功能描述，不是品牌宣言。
**修复：** "Push — Turn Creators into Results" 或 "Push — NYC's Creator Marketplace"。

### 50 · 缺少 cursor 自定义和微交互的 "personality layer"
**问题：** 网站在功能层面可以工作，但缺少让人记住的 "personality moment"。参考 Arc.net 的彩色光标、Linear 的 keyboard shortcut hints、Rapha.cc 的 parallax product shots。
**修复建议：**
- Hero 的 "results." 字在 hover 时轻微 shimmer（Champagne Gold 光泽）
- Stats 数字用 CountUp.js 从 0 滚动到目标值
- Section 切换时背景色有 `200ms` 的平滑过渡（CSS `scroll-snap` + `transition`）
- Pricing "Most Popular" card 在 viewport 进入时有一个微妙的 `scale(0.98→1)` bounce
- Footer 的 "Push" logo 在 hover 时 italic → non-italic 切换

---

## 修复优先级路线图

| 阶段 | 项目 | 预计影响 |
|------|------|---------|
| **P0 — 今天** | #01-02 IntersectionObserver 修复 | 恢复 40% 页面内容可见性 |
| **P0 — 今天** | #03 Nav 链接对比度 | WCAG 合规 + 可用性 |
| **P0 — 今天** | #04 移除 35% 内部指标 | 防止信息泄露 |
| **P1 — 本周** | #05-10 排版修复 | 编辑式品牌感回归 |
| **P1 — 本周** | #12-13 Hero 右侧视觉 + 留白 | 首屏冲击力翻倍 |
| **P1 — 本周** | #24-25 文案重写 | 转化率核心 |
| **P2 — 下周** | #31-35 动效系统上线 | 品牌体验质感 |
| **P2 — 下周** | #36-37 社会证明 + FAQ | 信任构建 |
| **P3 — 两周内** | #19-23 色彩节奏优化 | Premium 感知 |
| **P3 — 两周内** | #38-40 转化路径优化 | 漏斗效率 |
| **P4 — 月内** | #45-50 微细节 + Personality | 品牌记忆度 |
