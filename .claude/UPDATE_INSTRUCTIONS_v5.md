# Push v5.0 Update Instructions — Handoff to Next Claude Code Session

**创建时间：** 2026-04-18
**目标分支基线：** `style/v8.2-premium-editorial`（领先 main 139 commits）
**上一份 handoff：** `.claude/handoff-v8.3.md`（v4.x 体系，已过时）
**本次升级类别：** 战略重定位（v4.1 → v5.0），非单纯 polish

---

## 0. TL;DR（30 秒版）

Push 的**商业叙事**要从 _"Performance-based creator marketing platform / marketplace"_ 改成 **_"AI-Powered Customer Acquisition Agency"_**。

三条硬核变化必须同时落地，否则整改无意义：

1. **定价语言：** 删除 `$19.99 / $69 / $199` 的月订阅锚点 → 改为 `$0 Pilot → $500/月 min + $40/顾客` 的 outcome-based pricing
2. **AI 叙事：** AI 不再是"matching"层辅助 → AI 是 **Day-1 可 demo 的验证核心**（Claude Vision + QR OCR + geo 比对）
3. **Beachhead 收窄：** F&B + dessert + beauty → **咖啡一个品类 × Williamsburg 一个 ZIP × 60 天**

配套：所有 "marketplace / platform" 字样 → "agency / customer acquisition OS"。保留 QR 归因、6-tier creator、Two-Tier Offer、commission + milestone。

---

## 1. 背景与触发原因

### 1.1 为什么现在要改
- YC S25 中 88%、W26 中 70%+ 是 day-zero AI 公司
- YC Spring 2026 RFS 明确写："The 'add AI to your app' era is over" — Push 当前 Phase-0 叙事会被判为错误一侧
- Creator economy / local marketplace 不在 2026 RFS 八大主题里；**AI-Powered Agencies 是 RFS #5**
- `$19.99` SaaS 锚点和"卖验证顾客"的 outcome 叙事自我矛盾；outcome-based YC 公司均价是 $500–2000/月
- 5 人团队同时做 F&B + dessert + beauty 三个品类不现实；收窄咖啡 + Williamsburg 可在 60 天内做到"饱和市场"级故事密度

### 1.2 v5.0 一句话定位（对外 pitch 唯一版本）
> **"Push 不是双边 marketplace，是一家用 AI 操作 creator 网络、按已验证顾客计费的本地获客代理公司。"**

对外英文版：
> _"Push is an AI-powered customer acquisition agency. Tell us how many new customers you need. Our AI + creator network delivers them — or it's free."_

### 1.3 五维转变总表（v4.x → v5.0）

| 维度 | v4.x（旧） | v5.0（新） |
|---|---|---|
| 商业实体 | 双边 marketplace / SaaS platform | AI 代理公司（Push = operator, creators = AI 管理的网络） |
| 售卖单位 | SaaS 订阅 + 服务费 | 已验证顾客（per-customer billing） |
| 起步定价 | $19.99/$69/$199 月订阅 | $0 Pilot → $500/月 min + $40/顾客 → $2000/月 performance |
| AI 落地时机 | Phase 0 手动，50+ campaigns 后才上 AI | Day-1 多模态 AI 验证（Claude Vision + QR OCR + geo 一致性） |
| 对外 pitch | "连接 creator 和本地商家" | "告诉我们要多少顾客，AI + creator 网络负责交付" |
| YC 叙事类别 | Creator economy / local marketplace | AI-Powered Agencies（Spring 2026 RFS #5） |
| Beachhead | F&B + dessert + beauty × 1 ZIP | 咖啡一个品类 × Williamsburg × 60 天 |

### 1.4 五个新战略支柱（替换旧版）
1. **Outcome Engine** — 商家告诉 Push 要多少新顾客；保证交付或免费（替换旧版 Offer OS）
2. **Creator OS** — Creator 是 Push AI 管理的 operator 网络；tier/score 不可迁移（替换旧版 Creator Credit）
3. **AI Verification Layer** — Day-1 多模态自动验证 + 人工兜底 20%（替换旧版 Attribution）
4. **Agentic Campaign Engine** — 商家输入目标 → agent 60s 输出匹配 + brief + ROI 预测（替换旧版 Demand Surface）
5. **Data Moat** — 每 campaign 训练 matching agent；5000 campaigns 后对手追不上（替换旧版 Liquidity Layer）

### 1.5 Invariants（以下不得违反）
- 只奖励可验证、可重复的价值创造
- 商家付钱单位 = 顾客，不是 impression / follower / post
- Creator credit 在 Push 外不可迁移
- 从不在商家完成第一次免费试跑前收钱
- 设计系统（Design.md）所有视觉规范继续适用

---

## 2. 现状审计结果

### 2.1 代码库状态（✅ 已就绪的底层资产）
- Next.js 16.2.3 + Turbopack，`npm run build` 绿灯，`npx tsc --noEmit` 干净
- **56 个页面已存在**（3 波 parallel-agent 产出），路由分组清晰：`(marketing)` / `(creator)` / `(merchant)` / `(admin)` / `(public)` / `/scan`
- **Supabase 已初始化**：schema v1 + `/api/attribution/scan` 是第一个真实后端路由
- Design system 一致：`border-radius: 0`、6 色、Darky + CS Genio Mono、8px 网格、Light mode
- Mock data 抽象层完整：`lib/data/{types,mock-store,api-client}.ts` + `NEXT_PUBLIC_USE_MOCK=1` 切换

### 2.2 部署现状
- Vercel 预览：`https://push-git-style-v82-premium-editorial-jiamingws-projects.vercel.app/`
- 生产 URL：`https://push-six-flax.vercel.app/`（Wave 2 snapshot，v4.x 语言）
- 主分支 `main` 落后 `style/v8.2-premium-editorial` 139 commits

### 2.3 v5.0 gap 审计（逐维度）

#### 🔴 定位（positioning）gap — P0
| 位置 | 现状 | v5.0 目标 |
|---|---|---|
| `app/(marketing)/page.tsx` Hero eyebrow | `Performance-Based Creator Marketing` | `AI-Powered Customer Acquisition Agency` |
| Hero H1 | `Turn creators into results.` | `Tell us how many new customers you need.` |
| Hero subhead | `Pay only when a creator drives a verified visit — tracked by QR code. Zero guesswork.` | `Our AI verifies every customer. Our creator network delivers them. Pay only for what walks through your door.` |
| JSON-LD `description` | `Creator marketplace for NYC businesses. Pay per verified visit.` | `AI-powered customer acquisition agency for local businesses. Pay only for verified customer visits.` |
| JSON-LD `offers.price` | `19.99` | 删除（改为 contact sales 或 $0 Pilot） |
| Hero stats | `$19.99/月 · 6 tiers · 24h to launch` | `$0 Pilot · Day-1 AI verified · 60-day beachhead` |

**硬搜清单（grep 全局替换）：**
```
"marketplace" × N 处      → "agency" / "customer acquisition OS"
"Performance-Based Creator Marketing" × 多处 → "AI-Powered Customer Acquisition Agency"
"Pay per visit" / "pay only for results" → "Pay only for verified customers"
"$19.99" × 8 文件 20 处   → 删除或替换为 outcome pricing
```

#### 🔴 内容（content）gap — P0
| 模块 | 现状 | v5.0 目标 |
|---|---|---|
| Pricing 页 | 3 档 SaaS: Starter $19.99 / Growth $69 / Scale $199 | 2 档 outcome: **Pilot $0（前 10 位商家）** + **Performance $500/月 min + $40/verified customer** |
| How It Works | 3 步（post campaign → creator visits → verify & pay） | 3 步（**tell agent your goal → AI matches + runs → delivered customers or free**） |
| About 页时间线 | 仍叙述 "Feb 14 first QR visit / NYC pilot / city-wide expansion" 通用故事 | 改为 **Coffee × Williamsburg 60 天冷启动叙事**（Week 1-2 AI MVP / Week 3-4 签 10 咖啡店 + 20 creators / Week 5-8 跑 20 campaigns / Week 9-10 转付费） |
| For-Merchants 页 | 通用 F&B + retail + beauty 示例 | **咖啡优先**，mock 案例全部换成咖啡店（如 `Blank Street Soho` → `Sey Coffee Williamsburg`）|
| FAQ | "How is a visit verified? Customers scan a unique QR code" | 加入 "How does the AI verify?" — 明确 Claude Vision + receipt OCR + geo 三重校验 |
| 社会证明引用 | "$200 → 47 verified visits" 月报式数字 | 改为 "Push agent 60s 输出了 14 个 Williamsburg 咖啡 creators 的匹配" 类 agentic 叙事 |

#### 🟡 设计（design）gap — P1
- 设计系统本身 **不需要改**（保留 6 色 + Darky + CS Genio Mono + 直角 + 8px 网格）
- **但需要新增一个视觉组件：Agent Output UI**（模仿终端/AI 响应卡片）— 用来呈现 "60s 输出匹配+brief+ROI" 的 agentic 体验
  - 放在 Hero 右侧（当前右侧为空 — premium audit 发现的缺口）
  - 使用 Steel Blue `#669bbc` + Graphite `#4a5568` 冷色锚定（避免 Champagne + Pearl Stone 过暖）
- Hero stats 视觉权重需降低，让位给 Agent Output UI
- 新增一个 Trust 元素：**"AI Verification Layer"** 小徽章（Claude Vision + OCR + geo 三图标）

#### 🟡 架构（architecture）gap — P1/P2
| 层 | 现状 | v5.0 目标 |
|---|---|---|
| API 验证逻辑 | `/api/attribution/scan` 是首个真实路由，目前只做"记录扫码" | 升级为 **多模态验证**：接收 scan + receipt 图片 + geo location，调 Claude Vision API 做 receipt 金额/商家名 OCR，比对 geo 与商家登记地 ≤ 200m |
| Agent 服务 | 无 | 新增 `/api/agent/match-creators`（输入 merchant goal，输出 N 个候选 creators + brief 草稿 + ROI 预测）— 使用 Claude 作为 matching agent |
| Merchant 入驻流 | `/merchant/onboarding` 假数据 | 改为 **"goal input"** 为核心：商家输入"我要 X 个新顾客 / 预算 Y / 品类咖啡" → agent 响应 |
| Creator 网络 | 全部 tier 平行展示 | 咖啡 creators 优先置顶，添加 `category: "coffee"` 字段 |
| Supabase schema | 6 tables（users/creators/merchants/campaigns/applications/scans） | 新增表：`ai_verifications`（存 Vision 输出 + 人工 override）+ `agent_runs`（存 matching agent 的 input/output/latency） |
| 定价数据 | `lib/pricing/*`（若存在）仍是 $19.99/$69/$199 | 改为 $0 Pilot + outcome-based tiers |
| mock data | 80% 非咖啡商家 | 40% 咖啡商家权重 + 所有 Williamsburg 示例商家标记 `beachhead: true` |

### 2.4 保留不改的东西
- Design.md 所有规范（border-radius 0 / 6 色 / Darky+CSGM / 8px / Light mode / GSAP+Lenis）
- QR 归因机制 + 30 天 last-click 窗口
- 6-tier creator 系统（Seed→Explorer→Operator→Proven→Closer→Partner）+ 材质色
- Two-Tier Offer（Hero + Sustained）
- Commission + Milestone bonus 结构
- middleware.ts demo-role 机制
- 56 个现有页面的路由和信息架构
- 所有 `(creator)` / `(merchant)` / `(admin)` 仪表盘（这些是产品内部，不受外向 pitch 改变影响）

---

## 3. 执行计划（按优先级分 Phase）

### P0 — 对外叙事 hard reset（目标：1 个工作日内完成，用户可 demo v5.0 版 landing）

**P0.1 文案层全局替换（不动逻辑，只动 string）**
- 文件清单：
  - `app/(marketing)/page.tsx` — hero、pricing、proof、CTA 整体改写
  - `app/(marketing)/pricing/page.tsx` — 3 档 SaaS → 2 档 outcome
  - `app/(marketing)/how-it-works/page.tsx` — 3 步改为 agent-driven 流程
  - `app/(marketing)/for-merchants/page.tsx` — beachhead 叙事 + 咖啡示例
  - `app/(marketing)/for-creators/page.tsx` — 改为"被 AI agent 调度的 operator 网络"叙事
  - `app/(marketing)/about/page.tsx` — 时间线全改为 Williamsburg coffee 60 天
  - `app/(marketing)/faq/page.tsx` — 加 AI verification 问答
  - `app/layout.tsx` + `app/opengraph-image.tsx` — meta 描述、OG image 标语
  - `app/(marketing)/api-docs/page.tsx` — 定价/描述刷一遍
  - `app/(marketing)/legal/terms/page.tsx` — 定义 "verified customer" 时刷一遍术语

- **硬搜关键词（一定要 0 命中）**:
  ```bash
  grep -r "19\.99\|Performance-Based Creator Marketing\|creator marketplace" app/
  ```
- **验收：** 上述 grep 在 (marketing) 下返回空；npm run build 绿灯

**P0.2 Landing page hero 重构**
替换 `app/(marketing)/page.tsx` 第 159-220 行 hero section。建议 copy：

```tsx
{/* Hero eyebrow */}
<span className="eyebrow">AI-Powered Customer Acquisition Agency</span>

{/* Hero H1 */}
<h1 id="hero-h" className="hero-h">
  <span className="hero-l1">
    <span className="hw-conn">Tell us how many</span>{" "}
    <span className="hw-key">customers</span>
  </span>
  <span className="hero-l2">
    <span className="hw-conn">you need.</span>{" "}
    <em className="hw-accent">We deliver.</em>
  </span>
</h1>

{/* Hero subhead */}
<p className="hero-sub">
  Our AI verifies every customer through QR scan, receipt OCR, and geo-match.
  Our creator network delivers them. Pay only for who walks through your door.
</p>

{/* Hero CTAs */}
<Link href="/merchant/pilot" className="btn-fill">Start $0 Pilot</Link>
<Link href="#how-it-works" className="btn-outline-light">See the AI in action</Link>

{/* Hero stats */}
<StatCounter value={0} prefix="$" /> Pilot for first 10 merchants
<StatCounter value={60} suffix="s" /> AI match time
<StatCounter value={100} suffix="%" /> Customer verified
```

**P0.3 Pricing page 重构为 outcome-based 2 档**

替换 `app/(marketing)/pricing/page.tsx` 的 `PLANS` 数组：

```tsx
const PLANS = [
  {
    name: "Pilot",
    price: "$0",
    period: "for first 10 merchants",
    desc: "Run your first campaign. Only pay if the AI delivers verified customers.",
    features: [
      "Up to 10 verified customers free",
      "AI creator matching in 60 seconds",
      "Claude Vision receipt verification",
      "QR + geo attribution",
      "Weekly performance review",
    ],
    featured: false,
    cta: "Apply for pilot",
    href: "/merchant/pilot",
  },
  {
    name: "Performance",
    price: "$500",
    period: "/mo min + $40/customer",
    desc: "You set the target. The agent delivers. Pay only for AI-verified visits.",
    features: [
      "Unlimited AI-matched campaigns",
      "Dedicated AI agent tuning",
      "Two-Tier Hero + Sustained offers",
      "Creator tier 2–6 access (Proven+ priority)",
      "Day-1 multi-modal verification",
      "Dispute SLA: 24h",
    ],
    featured: true,
    badge: "Outcome-Based",
    cta: "Talk to agent",
    href: "/merchant/signup",
  },
];
```

同步删除 Scale/Pro 档位卡、比较表里所有 19.99 相关单元格。

**P0.4 JSON-LD schema + metadata 刷新**

`app/(marketing)/page.tsx` 第 131-146 行 JSON-LD 改为：

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Push",
  description:
    "AI-powered customer acquisition agency. We deliver verified new customers to local businesses through an AI-managed creator network.",
  url: "https://pushnyc.co",
  serviceType: "Customer Acquisition Agency",
  areaServed: { "@type": "City", name: "New York" },
  makesOffer: {
    "@type": "Offer",
    name: "Customer Acquisition Pilot",
    description: "Free pilot for first 10 merchants — pay only for verified customers",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      price: "0",
    },
  },
};
```

---

### P1 — Agent UX 层落地（目标：3–5 个工作日，用户可 demo "agent 60s 输出"）

**P1.1 新增 Hero 右侧 Agent Output UI 组件**
- 新文件：`components/landing/AgentOutputDemo.tsx`
- 视觉参考：终端/AI response 卡片；用 Steel Blue `#669bbc` + Graphite `#4a5568` 冷色锚；直角边框 `border: 2px solid var(--dark)`
- 内容：模拟一次 agent run — 商家输入"我要 20 个新顾客 / 咖啡 / Williamsburg / 1 周" → 60s 后输出 5 个 creator 匹配（带 tier 色块、score、预计 ROI）
- 动画：逐行打字（monospace）、进度条、每秒刷一条，符合 CS Genio Mono 编辑美学
- 放入 `app/(marketing)/page.tsx` hero section 右侧（现在为空）

**P1.2 新增 `/merchant/pilot` 专属 landing**
- 新文件：`app/(marketing)/merchant/pilot/page.tsx`（或 `(marketing)/pilot/page.tsx`）
- 结构：
  - Hero："First 10 merchants. $0 pilot. AI delivers or it's free."
  - Eligibility：Williamsburg / Greenpoint / Bushwick 咖啡店优先
  - 3-step flow：Apply → AI brief preview → Launch within 7 days
  - 底部 form：business name / IG handle / Google Maps URL / "how many customers do you want?"

**P1.3 Onboarding 流程改为"goal-first"**
- 修改 `app/(merchant)/merchant/onboarding/page.tsx`
- Step 1：商家输入 goal（e.g., "20 new customers this month"）+ 预算 + 品类
- Step 2：agent 调 `/api/agent/match-creators` 返回候选 creators + brief 预览
- Step 3：商家 approve → 进入主 dashboard
- 先走 mock agent（固定返回），Phase 2 再接 Claude API

**P1.4 新增 AI Verification 视觉元素**
- 新组件 `components/landing/VerificationBadge.tsx` — 3 图标并列（QR / Vision / Geo）
- 放 landing page 的 "For Merchants" section 下方（替换现有 Attribution Dashboard 或并列）

---

### P2 — 后端能力补齐（目标：1–2 周，AI 验证可 live demo）

**P2.1 Supabase schema 扩展**
- 迁移文件：`supabase/migrations/*_add_ai_verifications.sql`
- 新表：
  ```sql
  create table ai_verifications (
    id uuid primary key,
    scan_id uuid references scans(id),
    receipt_image_url text,
    vision_response jsonb,        -- 存 Claude Vision 的完整 JSON 响应
    merchant_match_confidence numeric(3,2), -- 0.00–1.00
    amount_extracted numeric(10,2),
    geo_distance_meters integer,
    verdict text check (verdict in ('auto_verified','auto_rejected','manual_review')),
    reviewed_by_human boolean default false,
    created_at timestamptz default now()
  );
  create table agent_runs (
    id uuid primary key,
    merchant_id uuid references merchants(id),
    agent_type text check (agent_type in ('match_creators','draft_brief','predict_roi')),
    input jsonb,
    output jsonb,
    latency_ms integer,
    model_used text,              -- 'claude-opus-4-6' 等
    cost_usd numeric(10,6),
    created_at timestamptz default now()
  );
  ```
- RLS 策略：merchant 只能读自己的 agent_runs；admin 可全读

**P2.2 AI Verification API**
- 升级 `app/api/attribution/scan/route.ts`
- 入参：`qrId`, `merchantId`, `receiptImageBase64`, `geoLat`, `geoLng`
- 流程：
  1. 记录 raw scan
  2. 调 Anthropic Messages API (`claude-opus-4-6` 或 `claude-sonnet-4-6`) + Vision 输入：receipt 图
  3. prompt：从图片提取 merchant name / transaction amount / timestamp
  4. 比对提取出的 merchant name 与数据库 merchant.name（fuzzy match ≥ 0.85）
  5. 比对 geo：scan 坐标 vs merchant 登记坐标 ≤ 200m
  6. verdict = `auto_verified` 若三者皆过；`manual_review` 若任一 < 阈值；`auto_rejected` 若 merchant name 完全不符
  7. 写 `ai_verifications` 表；通过则写 `payouts` 表
- 前端变化：`/creator/verify` 流程新增 receipt upload 步骤

**P2.3 Matching Agent API**
- 新文件：`app/api/agent/match-creators/route.ts`
- 入参：`merchantId`, `goal`（"20 new customers this month"）, `budget`, `category`, `zip`
- 流程：
  1. 查询 creators 表：category 交集 + 地理 ≤ 5 miles + tier ≥ Operator（Pilot）或 ≥ Proven（Performance）
  2. 发给 Claude：系统 prompt 定义 Push 的 matching 规则 + creators 列表（去标识化） + merchant goal
  3. Claude 输出 top 5 匹配 + 每个 creator 的匹配理由 + 预计带来多少顾客
  4. 写 `agent_runs` 表
  5. 返回前端
- 目标：端到端 latency ≤ 60s（Sonnet 通常 5–15s 可达）

**P2.4 Fraud/review queue 改造**
- `/admin/verifications` 已存在。改为读 `ai_verifications.verdict = 'manual_review'` 的记录
- Admin decision 写回 `reviewed_by_human = true` + `verdict` 覆盖

---

### P3 — 增长与内容（目标：持续，不 block 对外 pitch）

**P3.1 Coffee × Williamsburg 专属着陆页**
- 新路由：`/neighborhoods/williamsburg-coffee`
- 内容：Williamsburg 咖啡店 map + local creators + 已跑过的 campaign 案例（mock 即可）
- SEO：`Coffee customer acquisition in Williamsburg` 长尾关键词

**P3.2 YC application 材料页（可 unlisted）**
- `/yc-2027`（noindex）— 1-page pitch：problem / solution / traction / team / ask
- 完整 deck PDF 下载（放 `public/yc-2027-deck.pdf`）
- 用 Deep Space Blue `#003049` 暗色背景，editorial 大字

**P3.3 Changelog 首条 v5.0 条目**
- `app/(marketing)/changelog/page.tsx`
- 新增首条：`April 2026 — Push v5.0: From marketplace to AI agency`
- Changelog 内容详细解释 5 个战略转变，让 SEO / 投资人 / 老用户看懂升级

**P3.4 Blog 首篇 v5.0 解释文**
- 新 post：`2026-04-18-push-v5-what-changed.mdx`
- 写清楚：为什么从 SaaS 改为 outcome-based、为什么收窄咖啡、什么是 Day-1 AI verification

---

## 4. 全局文案替换参考表（copy-paste 级精度）

以下是关键 string 的 **精确替换对照表**，新 session 可以直接全局查找替换。

| 旧 string | 新 string |
|---|---|
| `Performance-Based Creator Marketing` | `AI-Powered Customer Acquisition Agency` |
| `Turn creators into results.` | `Tell us how many customers you need. We deliver.` |
| `Pay only when a creator drives a verified visit` | `Pay only for AI-verified customers that walk through your door` |
| `Creator marketplace for NYC businesses` | `AI-powered customer acquisition agency for local businesses` |
| `Pay per visit, keep full control.` | `$0 Pilot. Only pay if AI delivers verified customers.` |
| `$19.99/mo` / `$19/.99` / `19.99` | 删除（视上下文改为 `$0 Pilot` 或 `$500/mo min + $40/customer`） |
| `$69/mo` (Growth)  | 删除，合并至 Performance |
| `$199/mo` (Scale/Pro) | 删除（如需 Enterprise 才保留，并改名 Enterprise Agency） |
| `no agency markup` | `no legacy agency markup — we are the agency, powered by AI` |
| `AI matching` (仅作为 feature bullet) | `Claude-powered creator matching in 60s` |
| `How is a visit verified?` → `scan QR code` | `How does the AI verify a customer?` → `Three-layer check: QR scan + Claude Vision receipt OCR + geo-match within 200m` |
| `NYC Founding Cohort` | `Williamsburg Coffee Pilot — First 10 Merchants` |
| `Ready to pay only for results?` | `Ready to hand customer acquisition to an AI agency?` |
| `Start Free — Merchants` | `Apply for $0 Pilot` |

---

## 5. 文件级改动地图（按目录分）

```
app/(marketing)/
├── page.tsx                    [P0] hero + pricing + proof + FAQ + CTA 重写
├── landing.css                 [P1] 新增 .agent-output 样式组
├── pricing/page.tsx            [P0] PLANS 数组改为 2 档 outcome-based
├── how-it-works/page.tsx       [P0] 3 步流程重写为 agent-driven
├── for-merchants/page.tsx      [P0] beachhead 叙事 + 咖啡示例 + 2 档定价
├── for-creators/page.tsx       [P0] "operator 网络" 叙事
├── about/page.tsx              [P0] 时间线改为 Williamsburg coffee 60-day
├── faq/page.tsx                [P0] 加 AI verification 问答
├── changelog/page.tsx          [P3] 新增 v5.0 首条
├── blog/                       [P3] 新增 v5.0 解释 post
├── api-docs/page.tsx           [P0] 描述语言统一
├── legal/terms/page.tsx        [P0] "verified customer" 定义更新
├── legal/privacy/page.tsx      [P0] 顺手 double-check
├── neighborhoods/
│   └── williamsburg-coffee/    [P3] 新 landing
└── pilot/                      [P1] 新增 $0 Pilot 专属 landing

app/(merchant)/merchant/
├── onboarding/page.tsx         [P1] goal-first flow
└── dashboard/page.tsx          [P1] Agent Output UI 卡片

app/api/
├── attribution/scan/route.ts   [P2] 升级为 multi-modal 验证
└── agent/match-creators/route.ts  [P2] 新建

components/
├── landing/
│   ├── AgentOutputDemo.tsx     [P1] 新
│   └── VerificationBadge.tsx   [P1] 新
├── merchant/
│   └── GoalInput.tsx           [P1] 新

lib/
├── ai/
│   ├── vision.ts               [P2] 新 — Claude Vision 封装
│   ├── matching.ts             [P2] 新 — matching agent prompts
│   └── prompts.ts              [P2] 新 — 系统 prompt 模板
└── pricing/                    [P0] 若存在，更新 data

supabase/migrations/
└── 2026XXXX_add_ai_verifications_and_agent_runs.sql  [P2] 新

app/layout.tsx                  [P0] meta description
app/opengraph-image.tsx         [P0] OG 标语
app/robots.ts                   [P0] 确保 /pilot 可索引

.claude/skills/
├── push-hub/SKILL.md           [P0] 更新路由器 + 一句话 pitch
├── push-strategy/SKILL.md      [P0] agentic-roadmap.md 内容提升到 SKILL 主文件
├── push-pricing/SKILL.md       [P0] 改 outcome-based 章节
├── push-brand-voice/SKILL.md   [P0] 新 tagline + FAQ 模板
└── push-gtm/SKILL.md           [P0] 90 天 Williamsburg coffee 冷启动
```

---

## 6. 验收标准（done 的定义）

### P0 完成标准
- [ ] `grep -rEn "19\.99|Performance-Based Creator Marketing|creator marketplace" app/(marketing)` → 0 命中
- [ ] 访问 `/`, `/pricing`, `/how-it-works`, `/for-merchants`, `/for-creators`, `/about`, `/faq`：文案全部 v5.0 语言
- [ ] OG image 与 meta description 反映新 pitch
- [ ] `npx tsc --noEmit` 干净；`npm run build` 绿灯
- [ ] Vercel preview 部署成功，人工视觉检查所有页面无品牌色 / 字体 / 直角违规

### P1 完成标准
- [ ] Hero 右侧有 Agent Output 演示（可见打字动画）
- [ ] `/pilot` 页面可访问，form 可提交到 mock API 后返回成功
- [ ] `/merchant/onboarding` 第一步是 goal input
- [ ] VerificationBadge 组件 3 图标齐全

### P2 完成标准
- [ ] 扫一张真实咖啡店 receipt，Claude Vision 正确识别商家名 + 金额（手动测试）
- [ ] `/api/agent/match-creators` 发真实请求返回 top 5 creators，latency ≤ 60s
- [ ] `ai_verifications` 和 `agent_runs` 表有真实数据写入
- [ ] Admin 可在 `/admin/verifications` 看到 `manual_review` 记录并 override

### P3 完成标准
- [ ] `/neighborhoods/williamsburg-coffee` 上线并 SEO 可索引
- [ ] Changelog 首条 v5.0 条目已发布
- [ ] Blog v5.0 解释 post 已发布

---

## 7. 执行约束（读之前必知）

### 7.1 品牌视觉绝对不动
- 所有 UI 代码修改前**必读 `Design.md`**
- 品牌色 6 个：`#c1121f` / `#780000` / `#f5f2ec` / `#003049` / `#669bbc` / `#c9a96e` — 不得新增
- 字体只有 Darky + CS Genio Mono
- `border-radius: 0` 全局（例外仅 3 处：map pins 50% / filter chips 50vh / back-to-top 50%）
- 8px 网格；Light Mode only；Pearl Stone 背景
- 任何偏离必须先 update Design.md 再动代码

### 7.2 用户偏好（继承自 v8.3 handoff）
- 用户 UX 水平高，**厌恶**：AI slop、glassmorphism、aurora gradients、corporate template、过度居中
- **喜欢**：negative space、左对齐、900 weight 大字、ghost text、Apple 级交互
- 所有 AI Output 展示组件用 editorial / terminal 风格，**禁止**用 chat-bubble 风格

### 7.3 工作习惯
- 用户中文回复 / 代码注释英文 / git commit 英文
- 简洁输出，不啰嗦 narration
- **小而精的 edit 优先于大重写**
- Commit prefix: `feat:` / `fix:` / `style:` / `refactor:` / `content:`（v5.0 文案类可用 `content:`）

### 7.4 技术注意事项（来自 v8.3 经验）
- Turbopack 偶发 persistent cache race — `rm -rf .next` 重启解决
- Next 16：动态 route `params: Promise<>`；`ssr:false` dynamic import 必须在 client component
- 不要同时跑 `npm run dev` 和 `rm -rf .next`
- `gh` CLI **未认证** — PR 走浏览器或先 `gh auth login`
- 避免再次用 parallel agent 大批生成页面（上次 60 页 mock 用户可能不想重复）；**本次优先深改少量核心页面**

### 7.5 商业红线
- **不要**在 v4.1 现有商家完成 pilot 前就给他们改价 — 只对新进商家 apply $0 Pilot + $500/月 min
- **不要**把 `6-tier creator` 改掉 — 这是保留项
- **不要**触碰 creator 端仪表盘的核心逻辑，只动语言层面
- **不要**上线前删除 `/api/admin/*` — 这些在 v5.0 继续被用

---

## 8. 首个 session 的具体起步动作

新 session 开场建议：

```
1. git status（确认 clean）
2. git branch --show-current（确认在 style/v8.2-premium-editorial 或新建 style/v5.0-agency）
3. cat .claude/UPDATE_INSTRUCTIONS_v5.md（即本文档，全文读）
4. cat Design.md（确认视觉约束）
5. cat .auto-memory/push_concept_v5.md（战略源文件）
6. grep -rEn "19\.99|Performance-Based Creator Marketing|creator marketplace" app/(marketing)/ | wc -l（应 ≥ 20）
7. 和用户确认：新建 style/v5.0-agency 分支还是续用 style/v8.2-premium-editorial？
8. 开始 P0.1（文案全局替换），从 app/(marketing)/page.tsx 开始
9. 每完成 1 个 P0 文件就 commit，prefix 用 content:
10. 全部 P0 完成后部署到 Vercel preview，让用户验收；确认后再进 P1
```

---

## 9. 决策已锁定（Locked 2026-04-18）

以下 8 题用户已拍板，新 session **不要再问**，直接按决策执行：

1. **分支策略 ✅：** **新建 branch `style/v5.0-agency`**，基于 `style/v8.2-premium-editorial` 拉出。v5.0 是独立里程碑，便于 rollback 和 PR review。不要在 v8.2 上继续叠 commits。

2. **老商家 grandfather ✅：** 若生产环境已有"founding cohort"商家在 $19.99 老价，**继续 grandfather 他们**（按老合同走）。$0 Pilot + $500/月 min + $40/customer 的新定价**只应用于新进商家**。这意味着数据库需要在 `merchants` 表加字段 `pricing_tier: 'legacy_starter' | 'legacy_growth' | 'legacy_scale' | 'v5_pilot' | 'v5_performance'`，前端不显示 legacy tier 给新用户。

3. **AI 模型选择 ✅：** **两层都用 `claude-sonnet-4-6`**。用户明确要求"更便宜但优秀，要快速"。
   - Vision 验证：Sonnet 4.6 的多模态能力对 receipt OCR 完全够用（商家名 + 金额 + 时间戳），延迟 3-8s，成本约为 Opus 的 1/5
   - Matching agent：Sonnet 4.6 原生适配 ≤60s 目标，reasoning 能力对 creator 匹配绰绰有余
   - 若后续发现 Vision 准确率 < 90%，再考虑升 Opus；默认全 Sonnet
   - 环境变量：`ANTHROPIC_MODEL_VISION=claude-sonnet-4-6`、`ANTHROPIC_MODEL_MATCHING=claude-sonnet-4-6`

4. **Pilot 条款 ✅：** **前 10 个 verified customers 免费**，第 11 个起开始按 $40/customer 计费。理由：merchant 容易理解、单位经济清晰（Push 成本 ≈ creator base rate $20-32，前 10 个是 acquisition cost）。不按"前 X 个 campaign"是因为 campaign 粒度模糊、不同 campaign 规模差太多。

5. **YC 申请时机 ✅：** **Summer 2027 批次**（不是 Winter 2027）。用户选择给产品多 6 个月时间积累 traction。这意味着：
   - 冷启动执行周期从 12 周拉长到 ~30 周
   - Williamsburg 咖啡饱和后可扩一个品类或邻接 ZIP（Greenpoint / Bushwick）
   - Week 20+ 才开始准备申请材料（~2026-09）
   - 目标 traction：Summer 2027 申请时 50+ merchants、500+ campaigns、$50K+ GMV

6. **Push_Portal 同步升级 ✅：** **本次不动 Portal**（维持"暂不处理"）。焦点放在主 Next.js 产品 (`/mnt/Push`)。Portal 的 v5.0 同步是后续独立任务。

7. **项目名称 ⏸️：** **项目名未定**，用户正在重新考虑。当前文案可继续用 "Push"（已有资产）。所有域名相关决策（`pushnyc.co` / 其他）**延后到定名后再处理**。这意味着：
   - 新 session 的 JSON-LD、`<meta property="og:url">`、robots.ts 中的 URL 暂用 `https://push-six-flax.vercel.app`（Vercel 默认）
   - 不要急于把"Push"全局替换成其他名字
   - 看到 pushnyc.co 的引用保留原样，待定名后批量替换

8. **旧 pricing redirect ✅：** 在 `middleware.ts` 或 `next.config.ts` 加 redirect 规则：
   - `/pricing?plan=starter` → `/pilot`（Starter 用户是最小体量，送到 $0 Pilot 最合适）
   - `/pricing?plan=growth` → `/pricing#performance`（Growth 用户量级对应 Performance 档）
   - `/pricing?plan=scale` → `/pricing#performance`（Scale 用户同样进 Performance）
   - 所有 301 permanent redirect，保留 SEO 权重

### 对 P0 执行的具体影响

- §3 P0.1 的文件清单保留，但**不要**替换域名 `pushnyc.co`（第 7 题待定）
- §3 P0.3 的 Pricing 卡片 copy 保留（$0 Pilot + $500/mo min + $40/customer），但 **Pilot 描述加一句**："First 10 customers free. No catch. If the AI can't deliver, you don't pay."
- §3 P0.4 JSON-LD 的 `url` 暂写 `https://push-six-flax.vercel.app`
- §5 文件级地图 **新增两条**：
  - `middleware.ts` [P0] — 加 `/pricing?plan=*` 的 301 redirect
  - `supabase/migrations/*_add_pricing_tier_to_merchants.sql` [P2] — 加 `pricing_tier` 字段
- §6 P0 验收新增一条：
  - [ ] `curl -I http://localhost:3000/pricing?plan=starter` 返回 `301 → /pilot`

---

## 10. Critical 文件路径快速参考

| 用途 | 路径 |
|---|---|
| Design system 源头 | `/sessions/ecstatic-nifty-cerf/mnt/Push/Design.md` |
| v5.0 战略 memory | `/sessions/ecstatic-nifty-cerf/mnt/.auto-memory/push_concept_v5.md` |
| 当前 handoff（v4.x 时期） | `/sessions/ecstatic-nifty-cerf/mnt/Push/.claude/handoff-v8.3.md` |
| 本文档 | `/sessions/ecstatic-nifty-cerf/mnt/Push/.claude/UPDATE_INSTRUCTIONS_v5.md` |
| Landing 主页 | `/sessions/ecstatic-nifty-cerf/mnt/Push/app/(marketing)/page.tsx` |
| Landing CSS | `/sessions/ecstatic-nifty-cerf/mnt/Push/app/(marketing)/landing.css` |
| Root layout + meta | `/sessions/ecstatic-nifty-cerf/mnt/Push/app/layout.tsx` |
| OG image | `/sessions/ecstatic-nifty-cerf/mnt/Push/app/opengraph-image.tsx` |
| Middleware | `/sessions/ecstatic-nifty-cerf/mnt/Push/middleware.ts` |
| Skills 集 | `/sessions/ecstatic-nifty-cerf/mnt/Push/.claude/skills/push-*/` |
| Supabase schema | `/sessions/ecstatic-nifty-cerf/mnt/Push/supabase/` |
| Mock data 层 | `/sessions/ecstatic-nifty-cerf/mnt/Push/lib/data/` |

---

## 11. 风险与 rollback

**最大风险：** 文案全改但 Vercel prod 部署出错，网站展示旧 v4.x 内容和新 hero 错位。
**缓解：** 每改完一个 marketing 页面单独 commit；部署 preview 而非直推 prod；`main` 分支不动直到用户确认。

**回滚路径：** `git checkout style/v8.2-premium-editorial` 即恢复 v4.x 状态。文案改动不涉及 schema，不需要 DB 回滚。

---

*End of v5.0 Update Instructions.*
*下一个 session 读完本文档 + `push_concept_v5.md` + `Design.md` 即可开工。P0 预估 1 工作日内可完成。*
