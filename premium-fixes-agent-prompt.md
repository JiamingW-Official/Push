# Push Premium Fixes — Claude Code Agent 执行指令

> **使用方法：** 复制 `---` 以下全部内容，粘贴给 Claude Code agent。
> **工作目录：** `/Users/jiamingw/Documents/GitHub/Push`
> **涉及文件：** `app/(marketing)/page.tsx` · `app/(marketing)/landing.css` · `styles/tier-identity.css`

---

你的任务是执行 Push landing page 的 premium 修复清单。共 7 项改动，全部有精确的文件路径和代码指引。**先读后改**，每个文件修改完立刻验证。

## 前置：读取权威来源

先读以下内容确认色值和数据正确：
1. `Design.md` → "Tier Identity System (v4.1)" 章节（六色 spec）
2. `.claude/skills/push-creator/SKILL.md` → 6-Tier 表（base rate 和 commission）
3. `.claude/skills/push-hub/SKILL.md` → Quick Reference 数字

---

## Fix 1：Seed 颜色错误 — `styles/tier-identity.css`

**文件：** `styles/tier-identity.css`

**问题：** Seed (`tier--seed`) 和 Operator (`tier--operator`) 都用了 `#4a5568`（graphite），视觉上无法区分。Seed 应该是 Clay `#b8a99a`（warm taupe）。

**修改所有 Seed 相关规则：**

```css
/* 替换前 */
.tier--seed {
  --tier-color:  #4a5568;
  --tier-bg:     #f7f7f7;
  --tier-accent: #718096;
}

.tier-badge--seed {
  --tier-color:  #4a5568;
  --tier-bg:     #f7f7f7;
  --tier-accent: #718096;
}

.tier-pill--seed {
  --tier-color:  #4a5568;
  --tier-bg:     #f7f7f7;
  --tier-accent: #718096;
}

.tier-progress--seed { background-color: #4a5568; }
.ring--seed          { --ring-fill: #4a5568; }
.ring--seed > svg circle,
.ring--seed > svg path { stroke: #4a5568; }

.tier-header--seed {
  background: linear-gradient(90deg, #718096 0%, #4a5568 100%);
}

.tier-stamp--seed {
  border-color: #4a5568;
  color:        #4a5568;
}

.tier-glow--seed { box-shadow: none; }

.tier-card--seed {
  --tier-color:  #4a5568;
  --tier-bg:     #f7f7f7;
  --tier-accent: #718096;
}
```

```css
/* 替换后 */
.tier--seed {
  --tier-color:  #7a6b5d;        /* readable brown on taupe bg */
  --tier-bg:     #f0ece6;        /* slightly richer than Clay */
  --tier-accent: #b8a99a;        /* Clay — the tier color itself */
}

.tier-badge--seed {
  --tier-color:  #7a6b5d;
  --tier-bg:     #f0ece6;
  --tier-accent: #b8a99a;
}

.tier-pill--seed {
  --tier-color:  #7a6b5d;
  --tier-bg:     #f0ece6;
  --tier-accent: #b8a99a;
}

.tier-progress--seed { background-color: #b8a99a; }
.ring--seed          { --ring-fill: #b8a99a; }
.ring--seed > svg circle,
.ring--seed > svg path { stroke: #b8a99a; }

.tier-header--seed {
  background: linear-gradient(90deg, #d4c8be 0%, #b8a99a 100%);
}

.tier-stamp--seed {
  border-color: #b8a99a;
  color:        #7a6b5d;
}

/* Seed has a subtle taupe glow instead of no glow */
.tier-glow--seed {
  box-shadow: 0 0 12px 2px rgba(184, 169, 154, 0.25);
}

.tier-card--seed {
  --tier-color:  #7a6b5d;
  --tier-bg:     #f0ece6;
  --tier-accent: #b8a99a;
}
```

**验证：**
```bash
grep -n "#4a5568\|#718096\|#f7f7f7" styles/tier-identity.css | grep -i seed
# 期望：0 匹配（seed 相关行里不再有旧的 graphite 色）
```

---

## Fix 2：Landing page Tier Showcase 替换 emoji — `app/(marketing)/page.tsx`

**文件：** `app/(marketing)/page.tsx`

**问题：** `TIER_SHOWCASE_DATA` 数组使用 emoji 图标（🌱🧭⚙️✅🎯🤝），与 Material Identity System 完全矛盾。

**Step 2a：** 替换 `TIER_SHOWCASE_DATA`

```tsx
/* 替换前 */
const TIER_SHOWCASE_DATA = [
  { icon: "🌱", name: "Seed",     earning: "Free product", ... },
  { icon: "🧭", name: "Explorer", earning: "$12/campaign", ... },
  { icon: "⚙️", name: "Operator", earning: "$20 + 3%",    ... },
  { icon: "✅", name: "Proven",   earning: "$40 + 5%",    ... },
  { icon: "🎯", name: "Closer",   earning: "$65 + 8%",    ... },
  { icon: "🤝", name: "Partner",  earning: "$100 + 10%",  ... },
];
```

```tsx
/* 替换后 */
const TIER_SHOWCASE_DATA = [
  {
    material: "Clay",
    color: "#b8a99a",
    name: "Seed",
    earning: "Free product",
    desc: "Zero followers needed. Get your first campaign.",
    highlight: false,
  },
  {
    material: "Bronze",
    color: "#8c6239",
    name: "Explorer",
    earning: "$12/campaign",
    desc: "Prove consistency. Build your performance score.",
    highlight: false,
  },
  {
    material: "Steel",
    color: "#4a5568",
    name: "Operator",
    earning: "$20 + 3%",
    desc: "Commission kicks in. Milestone bonus at 30 transactions.",
    highlight: true,
  },
  {
    material: "Gold",
    color: "#c9a96e",
    name: "Proven",
    earning: "$32 + 5%",
    desc: "Trusted track record. Higher-value campaigns.",
    highlight: false,
  },
  {
    material: "Ruby",
    color: "#9b111e",
    name: "Closer",
    earning: "$55 + 7%",
    desc: "Top performers. Priority campaign access.",
    highlight: false,
  },
  {
    material: "Obsidian",
    color: "#1a1a2e",
    name: "Partner",
    earning: "$100 + 10%",
    desc: "Elite tier. Up to $80/month milestone bonus.",
    highlight: false,
  },
];
```

**Step 2b：** 更新 `TierShowcaseGrid` 组件，把 `icon` 换成材质色块 + 材质名

```tsx
/* 替换前 */
function TierShowcaseGrid() {
  return (
    <div className="tier-showcase">
      {TIER_SHOWCASE_DATA.map((tier) => (
        <div key={tier.name} className={`tier-showcase-card${tier.highlight ? " tier-showcase-card--current" : ""}`}>
          <span className="tier-showcase-icon" aria-hidden="true">{tier.icon}</span>
          <span className="tier-showcase-name">{tier.name}</span>
          <span className="tier-showcase-earning">{tier.earning}</span>
          <span className="tier-showcase-desc">{tier.desc}</span>
        </div>
      ))}
    </div>
  );
}
```

```tsx
/* 替换后 */
function TierShowcaseGrid() {
  return (
    <div className="tier-showcase">
      {TIER_SHOWCASE_DATA.map((tier) => (
        <div key={tier.name} className={`tier-showcase-card${tier.highlight ? " tier-showcase-card--current" : ""}`}>
          {/* Material color swatch — replaces emoji */}
          <span
            className="tier-showcase-swatch"
            style={{ background: tier.color }}
            aria-hidden="true"
          />
          <span className="tier-showcase-material">{tier.material}</span>
          <span className="tier-showcase-name">{tier.name}</span>
          <span className="tier-showcase-earning">{tier.earning}</span>
          <span className="tier-showcase-desc">{tier.desc}</span>
        </div>
      ))}
    </div>
  );
}
```

**Step 2c：** 在 `landing.css` 里添加 swatch 和 material 样式（在 tier-showcase 相关规则旁边）：

```css
/* Tier showcase — material swatch replaces emoji */
.tier-showcase-swatch {
  display: block;
  width: 100%;
  height: 4px;
  flex-shrink: 0;
  margin-bottom: var(--space-2);
}

.tier-showcase-material {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.55;
  margin-bottom: 2px;
  display: block;
}
```

---

## Fix 3：数据修正 — `app/(marketing)/page.tsx`

**文件：** `app/(marketing)/page.tsx`

以下数据在 landing page 里与 v4.1 spec 不一致，逐一修正：

**3a. Earning preview 组件 — Proven 和 Operator/Partner:**

```tsx
/* 替换前 */
<div className="earning-tier highlight">
  <span className="earning-tier-name">Operator</span>
  <span className="earning-tier-value">$20 + 3% commission + $15 bonus</span>
</div>
```
```tsx
/* 替换后 — milestone threshold 正确 */
<div className="earning-tier highlight">
  <span className="earning-tier-name">Operator</span>
  <span className="earning-tier-value">$20 + 3% commission + $15 bonus at 30 tx/mo</span>
</div>
```

**3b. Feature list — "Milestone bonuses up to $80/month at 80+ transactions"：**
```tsx
/* 替换前 */
"Milestone bonuses up to $80/month at 80+ transactions",
```
```tsx
/* 替换后 */
"Milestone bonuses from $15→$80/month — unlocks at 30 transactions",
```

**3c. TierShowcaseGrid data 已在 Fix 2 中修正（$40 → $32, $65+8% → $55+7%）。确认无遗漏。**

**全局搜索验证：**
```bash
grep -n "\$40\|65.*8%\|80 transactions\|80+ transactions" app/\(marketing\)/page.tsx
# 期望：0 匹配
```

---

## Fix 4：Hero headline 字体尺寸 — `app/(marketing)/landing.css`

**文件：** `app/(marketing)/landing.css`

**问题：** `.hero-headline` 没有设置 `font-size`，继承的是 h1 的 `clamp(48px, 6vw, 80px)`，比 Design.md 规定的 Display 尺寸 `clamp(64px, 12vw, 160px)` 小很多。

```css
/* 替换前 */
.hero-headline {
  font-family: var(--font-display);
  font-size: var(--text-display);      /* 如果这行存在 — 确认 */
  letter-spacing: -0.06em;
  line-height: 0.90;
  color: #fff;
  margin-bottom: var(--space-6);
}
```

如果 `.hero-headline` 没有 `font-size`，添加它；如果有但用的是其他值，替换：

```css
/* 确保是这样 */
.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(64px, 12vw, 160px);  /* Display 级别，editorial impact */
  letter-spacing: -0.06em;
  line-height: 0.90;
  color: #fff;
  margin-bottom: var(--space-6);
}
```

同时确认 `line-height: 0.90` 是否需要调整 — 在非常大的字号下，0.90 可能会让文字重叠。如果 `clamp` 最大值超过 100px，建议改为 `line-height: 0.88`。

---

## Fix 5：Section-bright 背景换成 Pearl Stone — `app/(marketing)/landing.css`

**文件：** `app/(marketing)/landing.css`

**问题：** `section-bright` 用了 `#ffffff` 纯白，与 Design.md 的 Surface 系统（Pearl Stone → Snow → White）矛盾，缺乏温度。

```css
/* 替换前 */
.section-bright {
  background: #fff;
}
```

```css
/* 替换后 */
.section-bright {
  background: var(--surface-bright);   /* Snow #fafaf8 — warm off-white */
}
```

---

## Fix 6：Pricing 区域改为亮色背景 — `app/(marketing)/page.tsx`

**文件：** `app/(marketing)/page.tsx`

**问题：** Pricing section 用 `section-warm`（深海军蓝背景），价格信息在暗背景上读起来缺乏信任感和清晰度。

```tsx
/* 替换前 */
<section id="pricing" className="section section-warm">
```

```tsx
/* 替换后 */
<section id="pricing" className="section section-bright">
```

同时检查 pricing card 的文字颜色是否在亮色背景上正确显示（`color: var(--dark)` 而非 white）。如果 `.pricing-name`、`.pricing-desc`、`.pricing-feature` 等有 `color: #fff` 或 `rgba(255,255,255,...)` 的继承，需要在 CSS 里加 override：

```css
/* 如果 pricing 样式有从 section-warm 继承的白色文字，在 landing.css 里添加 */
.section-bright .pricing-card {
  color: var(--dark);
}
.section-bright .pricing-desc {
  color: var(--graphite);
}
.section-bright .pricing-feature {
  color: var(--dark);
}
```

---

## Fix 7：清理 Ticker 内容 — `app/(marketing)/page.tsx`

**文件：** `app/(marketing)/page.tsx`

**问题：** Ticker 里包含内部财务指标和限制性标签，不是 user benefit。

```tsx
/* 替换前 */
const TICKER_ITEMS = [
  "QR Attribution",
  "Creator Matching",
  "Verified Foot Traffic",
  "AI-Powered",
  "NYC-First",
  "$19.99 / mo",
  "6 Creator Tiers",
  "Zero Setup Fees",
  "35% Margin Target",
  "Transaction-Level Data",
];
```

```tsx
/* 替换后 */
const TICKER_ITEMS = [
  "QR Attribution",
  "Creator Matching",
  "Verified Foot Traffic",
  "Zero Followers Needed",
  "AI-Powered Matching",
  "$19.99 / mo",
  "6 Creator Tiers",
  "Zero Setup Fees",
  "24-Hour Campaign Launch",
  "Transaction-Level Data",
  "No Agency Fees",
  "$100 / Campaign Potential",
];
```

---

## Fix 8：TierVisual 条形图颜色更新 — `app/(marketing)/page.tsx`

**文件：** `app/(marketing)/page.tsx`

**问题：** `TierVisual` 函数里的 6 根条形用的是老品牌色，不是 v4.1 tier 专属色。

```tsx
/* 替换前 */
const tiers = [
  { label: "Seed",     h: 28,  color: "var(--tertiary)", opacity: 0.35 },
  { label: "Explorer", h: 52,  color: "var(--tertiary)", opacity: 0.55 },
  { label: "Operator", h: 80,  color: "var(--dark)",     opacity: 0.45 },
  { label: "Proven",   h: 112, color: "var(--dark)",     opacity: 0.65 },
  { label: "Closer",   h: 148, color: "var(--accent)",   opacity: 0.75 },
  { label: "Partner",  h: 188, color: "var(--primary)",  opacity: 1    },
];
```

```tsx
/* 替换后 — v4.1 tier colors */
const tiers = [
  { label: "Seed",     h: 28,  color: "#b8a99a", opacity: 0.7  },
  { label: "Explorer", h: 52,  color: "#8c6239", opacity: 0.8  },
  { label: "Operator", h: 80,  color: "#4a5568", opacity: 0.85 },
  { label: "Proven",   h: 112, color: "#c9a96e", opacity: 0.9  },
  { label: "Closer",   h: 148, color: "#9b111e", opacity: 0.95 },
  { label: "Partner",  h: 188, color: "#1a1a2e", opacity: 1    },
];
```

同样，更新 tier-strip（6 个小色块）：

```tsx
/* 替换前 */
<div className="tier-strip">
  <span style={{ background: "var(--tertiary)" }} />
  <span style={{ background: "var(--tertiary)", opacity: 0.8 }} />
  <span style={{ background: "var(--dark)" }} />
  <span style={{ background: "var(--dark)", opacity: 0.8 }} />
  <span style={{ background: "var(--accent)" }} />
  <span style={{ background: "var(--primary)" }} />
</div>
```

```tsx
/* 替换后 */
<div className="tier-strip">
  <span style={{ background: "#b8a99a" }} />
  <span style={{ background: "#8c6239" }} />
  <span style={{ background: "#4a5568" }} />
  <span style={{ background: "#c9a96e" }} />
  <span style={{ background: "#9b111e" }} />
  <span style={{ background: "#1a1a2e" }} />
</div>
```

---

## 全局验证

所有修改完成后运行：

```bash
# 1. Seed 颜色不再是旧 graphite
grep -n "tier--seed\|tier-badge--seed\|tier-pill--seed\|tier-card--seed\|tier-stamp--seed" styles/tier-identity.css | grep "#4a5568\|#718096\|#f7f7f7"
# 期望：0 匹配

# 2. Emoji 已清除
grep -n "🌱\|🧭\|⚙️\|✅\|🎯\|🤝" app/\(marketing\)/page.tsx
# 期望：0 匹配

# 3. 旧数据已清除
grep -n "\$40.*5%\|\$65.*8%\|80 transactions\|80+ transactions\|35% Margin\|NYC-First" app/\(marketing\)/page.tsx
# 期望：0 匹配

# 4. Pricing section 已改为亮色
grep -n "section.*pricing\|pricing.*section" app/\(marketing\)/page.tsx | grep "section-warm"
# 期望：0 匹配

# 5. Hero headline 有 font-size
grep -n "hero-headline" app/\(marketing\)/landing.css | grep "font-size"
# 期望：至少 1 匹配

# 6. Section-bright 不再用纯白
grep -n "section-bright" app/\(marketing\)/landing.css | grep "#fff\b\|#ffffff"
# 期望：0 匹配

# 7. Tier visual 用新色值
grep -n "var(--tertiary)\|var(--accent)\|var(--primary)" app/\(marketing\)/page.tsx | grep -i tier
# 期望：0 匹配（tier 上下文中不再用品牌色变量）
```

---

## Commit

```
fix: landing page premium fixes — emoji removal, tier colors, data accuracy, visual hierarchy

- Replace emoji icons with Material·Tier color swatches in tier showcase
- Fix Seed tier color: #4a5568 → #b8a99a (warm taupe, distinct from Operator)
- Fix data: Proven $40→$32, Closer $65/8%→$55/7%, Operator milestone 80→30tx
- Hero headline: explicit font-size clamp(64px,12vw,160px) for editorial impact
- section-bright: #ffffff → var(--surface-bright) for warmth
- Pricing section: section-warm → section-bright for trust/clarity
- Ticker: remove "35% Margin Target" / "NYC-First", add user benefit items
- TierVisual bars: update to v4.1 tier-specific hex colors
```

## 约束

1. 只修改以上 3 个文件：`page.tsx`、`landing.css`、`tier-identity.css`
2. 不修改其他页面（dashboard、signup 等）
3. `border-radius: 0` 保持不变
4. 不引入新的 CSS class，只修改已有样式值
5. 字体 Darky + CS Genio Mono — 不引入其他字体
6. 如果某处原有样式与修复冲突，以 Design.md 为准
