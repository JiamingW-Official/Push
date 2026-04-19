# Creator Workspace — Audit & 重构方案 v1.0

**Date:** 2026-04-18
**Scope:** `mnt/Push`（v5.1 主产品）
**Goal:** 把目前 8 个割裂的 creator 区域（Dashboard / Discover / 想起 / Publish / Post-campaign / Calendar / Messages / Notifications）收敛为一个**心智统一的 workspace**，20x UX 改进。

---

## 0. TL;DR（先读这一段）

目前 Creator 端的"混乱"不是视觉问题，是**两层错位**造成的：

**错位 A — 战略 vs IA：**
v5.1 战略说 campaign 由 matching agent 主动 DM 推送（2h 响应窗口，no open board），但 UI 把"Discover 地图浏览"放在 C 位。创作者被迫用"逛市场"的动作完成"接 DM"的任务。

**错位 B — JTBD vs 导航：**
创作者真实的心智只有 4 件事（响应 / 进行中 / 已完成 / 探索），但被拆成了 8 个词。每个词都要创作者自己在脑子里重新组合上下文。

**结论：** 从"8 个功能区"收敛到 **4 个 JTBD 区域**，以 Inbox 为 C 位，Discover 降级；Dashboard / Calendar / Messages / Notifications 全部融合为一个**Workspace Shell**，双路径（被动接单 + 主动发布）用**模式切换**而非**路径分叉**解决。

---

## 1. 现状地图（代码事实）

### 1.1 存在的页面与体量

| 路径 | 文件 | 行数 | 角色 |
|---|---|---|---|
| `/creator/dashboard` | `app/(creator)/creator/dashboard/page.tsx` | **1591** | 三视图 monolith：Discover / My Campaigns / Earnings |
| `/creator/post-campaign` | `app/(creator)/creator/post-campaign/page.tsx` | 730 | 完成后的庆祝页（tier 解锁 + 心跳动画） |
| `/creator/profile` | `app/(creator)/creator/profile/page.tsx` | 578 | 个人设置 / 公开 profile |
| `/creator/campaigns/[id]` | `.../CampaignPageClient.tsx` | 873 | Campaign 全页详情 + 里程碑 checklist |
| `/creator/public/[id]` | `.../CreatorPublicPageClient.tsx` | 332 | 对外公开页 |
| `/creator/onboarding` | `app/(creator)/creator/onboarding/page.tsx` | 875 | 注册后引导 |
| `/explore` | `app/explore/page.tsx` | **727** | **另一个**公开 campaign 浏览页（未登录态） |
| `/dashboard`（旧） | `app/(creator)/dashboard/page.tsx` | 184 | **僵尸页** — 与 `/creator/dashboard` 重复 |

### 1.2 用户提到但**不存在**的区域

| 区域 | 当前实际 | 问题 |
|---|---|---|
| 想起（recall） | 无 | 没有"暂存 / 稍后 / 看过的"页面 |
| 发布（publish） | 无 | 没有内容提交流程；创作者提交链接/截图发生在 `CampaignChecklist` 里，被埋在 campaign 详情深处 |
| Calendar | 无 | 无日程视图，"3d left"只在卡片角落标记 |
| Messages | 无 | 这是 v5.1 最严重的缺口 — **matching agent DM 推送是 v5.1 核心接单通路，但没有收信箱** |
| Notifications | 无 | 里程碑 / 上币 / tier 升级 / invite 全部无提醒面板 |

### 1.3 代码层裂痕（audit 发现）

**D1 — 双 Dashboard 僵尸**
`/dashboard`（184 行）+ `/creator/dashboard`（1591 行）共存。旧路径还在 routes tree 里，是隐藏的技术债。

**D2 — 双 Discover 路径**
`/explore`（公开，727 行）和 `/creator/dashboard` 的 Discover view（~300 行地图+卡片）几乎是同一件事做两遍。代码零共享（两套 `Campaign` type、两套 `SORT_OPTIONS`、两套过滤逻辑、两套地图初始化）。

**D3 — 双 Campaign 详情**
Dashboard 里用**右侧 slide panel**；`/creator/campaigns/[id]` 用**独立全页**。同一份数据两套渲染。链接哪个？用户无法形成稳定的 URL mental model。

**D4 — 1591 行 monolith**
`dashboard/page.tsx` 塞了：topbar、view switcher、map、左侧 panel（3 视图各自内部逻辑）、右侧 slide panel、底部 status bar、first-paycheck modal — 全在一个 client component 里。state 抬到最顶层且互相耦合（`activeId`、`hoveredId`、`selectedCampaign`、`view` 相互 gate）。

**D5 — 视图切换靠 top-center button group**
三视图（Discover / My Campaigns / Earnings）不是路由切换，是 `useState<DashView>`。结果：
- 无法 URL 直达"我的 campaigns"
- 无法 browser back 回到 Discover
- 深链接不存在
- `localStorage` 也不持久化上次位置

**D6 — Nav / Header 两套**
主站 `components/layout/Header.tsx`（带 NAV_LINKS + 大屏 hamburger）vs Dashboard 自己在 page 内部 render 的 `dash-topbar`。用户从 marketing → login → dashboard 的路径上，头部会跳两次（组件、高度、字体、logo 样式全不同）。

**D7 — Post-campaign 是"孤岛"**
730 行庆祝页没有 persistent shell — 打开它就脱离了所有导航、所有同期任务。回到主 workspace 只能靠顶部一个小 "back" 链接。

---

## 2. 心智模型诊断

### 2.1 现在的创作者"思考路径"（失败的动线）

> "我今天要做什么？"
> 1. 打开 Dashboard
> 2. 默认落在 Discover — 地图 + 卡片
> 3. **但我不是来逛市场的，我昨天晚上收到 merchant 的邀请，不知道今天截止时间**
> 4. 点 "My Campaigns" 切换 view → 看到 active list
> 5. **想看哪个今天必须到店 → 没有日历视图**
> 6. 点进某个 campaign → slide panel 打开 → 点击 "full page" 跳到 `/creator/campaigns/[id]`
> 7. 找到 checklist → 看到"submit proof"按钮
> 8. **提交链接在哪？跟我对话的 merchant 在哪？**
> 9. 找不到 → 返回 Dashboard → 重新开始

**核心问题：** 心智模型被 IA 撕成 3 次上下文切换：1. 市场浏览 2. 任务管理 3. 执行提交。但创作者的真实脑内模型只有 1 条线 —— "今天我要为哪几个 merchant 交付什么？"

### 2.2 v5.1 战略给的心智模型（正确的）

引用 `push-creator/SKILL.md`：

> "Campaigns are **routed by the matching agent reading ConversionOracle**, not browsed by creators."
> "Top 5 creators per goal are selected. They receive a **DM invitation** with a CreatorGPT-drafted brief. **No open board, no application queue**. Creator accepts or declines **in-DM** within a **2-hour response window**."

这是 push-notification / inbox 心智模型，不是 marketplace-browse 心智模型。当前 UI 与这个定位**完全相反**。

### 2.3 双路径澄清

用户回答问卷时说"两者都是一级任务"：
- **路径 A（被动接单）：** merchant plan → agent match → DM 创作者 → 创作者 2h 内接受/拒绝 → 执行 → 发布 → 结算
- **路径 B（主动发布）：** 创作者自己有了内容想法 → 选择 / 创建一个 merchant 合作关系 → 发布 → 归因 → 拿 commission

这两条路径**共享 80% 的后半段**（执行 / 发布 / 归因 / 结算），只有**入口**不同。所以新 IA 不应该把它们做成平行的独立区，而是**一个共同的 Active Work 区**，入口处提供"Inbox（A 路径）"和"Create（B 路径）"两个触发点。

---

## 3. 新 IA — 4-Zone Workspace（替代 8 个割裂区）

### 3.1 顶层导航：4 个 JTBD 区 + 2 个 utility

```
┌─────────────────────────────────────────────────────────────────────┐
│  Push   [ Inbox · Work · Portfolio · Discover ]    Search    Avatar │
│         ↑ 4 JTBD primary                          utility  utility  │
└─────────────────────────────────────────────────────────────────────┘
```

| # | 区域 | Mental Question | 替代现在的 |
|---|---|---|---|
| 1 | **Inbox** | "我要回应什么？" | Messages + Notifications + agent invites |
| 2 | **Work** | "我现在在做什么？" | My Campaigns + Calendar + Publish + Post-campaign 的连接线 |
| 3 | **Portfolio** | "我积累了什么？" | Profile + Tier/Score + Earnings + 历史完成 |
| 4 | **Discover** | "还有什么机会？" | Discover view + /explore |

**关键原则：Inbox 是默认落地页**，不是 Discover。因为 v5.1 是 push model 不是 pull model。

### 3.2 每个区域的职责边界

#### ZONE 1: Inbox（C 位）

**职责：** Agent invites + merchant 消息 + 系统通知 —— **所有待响应项一处聚合**。

**子分 3 tab（不切换 URL，切换 filter）：**
- `All` — 时间倒序统一流（默认）
- `Invites` — 来自 matching agent 的 campaign 邀请，带 2h 倒计时
- `Messages` — merchant / support 对话
- `System` — tier 升级 / 里程碑 / 支付 / 合规提醒

**关键 UI pattern：**
- 左侧列表（密度：40-56px/行） + 右侧预览/线程（类 Gmail + Linear）
- 每条 invite 条目**直接可操作**：Accept / Decline / Counter（协商时间）—— 不用跳转
- 未读计数出现在顶部 nav 的 `Inbox` tab 上作为唯一的 badge 来源
- 空状态用 editorial tone：不是"暂无消息"，是"Clear inbox. Agent's still matching — new invite ~4h."（给等待以叙事）

**取代当前：** 主站右上的 notification bell（不存在）、dashboard 右上 avatar 按钮（仅账户）、post-campaign 之后的 toast 提示。

#### ZONE 2: Work（执行层）

**职责：** 已接下来的 / 进行中的 / 即将到期的 campaigns + 提交入口。

**视图（用户可切，URL sticky）：**
- `Today`（默认）— 今日议程，时间轴 08:00 – 22:00，标注到店时段 + 提交截止
- `Pipeline`（= 现在的 My Campaigns）— 状态流 milestone dots 列表
- `Calendar` — 月/周视图，橙色 = 未完成，灰色 = 已完成
- `Drafts` — 写了一半的内容 / 保存的草稿 —— **这就是用户说的"想起/recall"的正确语义化**

**关键 UI pattern：**
- 每个 campaign 有一个 **thread view**（不是单独一页），内含 Brief / Timeline / Submit / Chat with merchant 四个 section（纵向）
- `Submit` section = 原来的 "publish" 流程。不做独立页面，做成 Work 里的 inline 提交区
- 完成后 **不再跳去 post-campaign 独立页**，而是：
  - Thread 内 inline 展开"你已完成"卡片（带评分 / 收入 / tier 推进 mini-view）
  - 同时触发一次 full-screen overlay 做情绪点（可跳过）—— 复用现有 `FirstPaycheck` 组件
- 右侧永远保留的 "Next up" 小面板：提示下一个到期项

**取代当前：** Dashboard 的 "My Campaigns" view + `/creator/campaigns/[id]` 全页 + `/creator/post-campaign` 孤岛 + 不存在的 Calendar。

#### ZONE 3: Portfolio（积累层）

**职责：** creator 的可炫耀身份 + 账本。

**3 tab：**
- `Identity` — tier badge、score、progression rail、解锁物
- `Earnings` — payout 历史 + pending + 税务摘要
- `Work archive` — 已完成 campaign 列表（= 替代"post-campaign"作为一个历史展示而非单次庆祝页）

**关键 UI pattern：**
- Identity tab 顶部用**大字体 editorial 排版**（Darky 900 + Darky 200 对比），完全按 Design.md 的"Editorial Scroll"哲学
- Earnings 保留现有 stat cards，但移除"Simulate First Paycheck" demo 按钮（移到 Identity 的 demo-only 抽屉）
- Archive 每条引用 post-campaign 的情绪叙事（tagline + score delta），但**以密度优先**展示

**取代当前：** `/creator/profile`（拆分为 Identity + public settings） + Dashboard Earnings view + post-campaign 孤岛页。

#### ZONE 4: Discover（降级探索）

**职责：** 灵感 / 跨域浏览 / 空闲时看看。**不再是落地页**。

**变化：**
- 保留地图 + 卡片 + 筛选（移植现有 1591 行里的 Discover view）
- 顶部加入"Agent is matching — you'll get invites automatically. Browse here if you want to explore."—— 明确这不是接单主通路
- 合并 `/explore`：公开 `/explore` 页面改为静态"预览"，登录后所有 browse 流量指向 `Workspace/Discover`
- 彻底删除旧 `/dashboard` zombie route

**取代当前：** Dashboard Discover view + 独立 `/explore` + 旧 `/dashboard`。

### 3.3 全局元素

**Persistent shell（always visible on desktop ≥1024px）：**
- 顶部 56px 主 nav（上面的 4-zone + Search + Avatar）
- 左侧 240px contextual sub-nav（根据当前 zone 切换）
- 右侧 320px context panel（可折叠，默认展开）—— 根据上下文：Inbox 显示"下一条"，Work 显示"今日进度条"，Portfolio 显示"distance to next tier"
- 底部不保留固定 status bar（目前 `dash-bottom` 的 5 个数字移到 Portfolio 首屏的 top strip，或在 Inbox/Work 的右侧 context panel）

**Mobile (<768px)：**
- 顶部 nav 折叠为 hamburger + logo + avatar
- 底部 `MobileNav`（Design.md 已有规范）：4 个 icon —— Inbox / Work / Portfolio / Discover
- 左/右 panel 都收起；点击进入 overlay

### 3.4 命名重构表（用户原词 → 新名）

| 用户原词 | 现在的含义 | 新语义 | 归属区 |
|---|---|---|---|
| Dashboard | 1591 行 monolith | 取消这个词 — 用 Zone 名称 | — |
| Discover / 发现 | 地图浏览 | **Discover**（保留，但降级） | Zone 4 |
| 想起 / recall | 无定义 | **Drafts** 或 **Saved for later** | Zone 2 sub-tab |
| 发布 / publish | 无页面 | **Submit**（inline 操作，不是页面） | Zone 2 内 |
| Post-campaign | 孤岛庆祝页 | **Archive** + inline 完成动画 | Zone 3 + Zone 2 overlay |
| Calendar | 不存在 | **Work → Calendar view** | Zone 2 view |
| Messages | 不存在 | **Inbox → Messages tab** | Zone 1 tab |
| Notifications | 不存在 | **Inbox → System tab** | Zone 1 tab |

**语义化原则：** 名字要回答"我按下这个按钮会看到什么？"，不是回答"系统有什么功能？"

---

## 4. 双路径在新 IA 下的动线

### 4.1 路径 A（被动接单 — v5.1 主通路）

```
Push notification / email  →  Inbox / Invites tab (2h countdown)
                                    ↓
                            Accept in-line  (no page jump)
                                    ↓
                   移入 Work / Today（自动调度到今日或指定日）
                                    ↓
                   到店时间触发 push reminder → Work / Today thread
                                    ↓
                     Thread 里 submit 链接 + 截图 → verify 进度条
                                    ↓
                  Work / Archive 移入 + full-screen 完成 overlay
                                    ↓
                    Portfolio / Earnings 数字更新（可选跳转）
```

**上下文切换次数：1**（从 push → Inbox）。当前是 4+。

### 4.2 路径 B（主动发布 — 长尾）

```
Workspace 顶部 Search / "+ Create" 按钮
                                    ↓
              搜索 merchant → 匹配到已签约的 → 选择 campaign
                                    ↓
             （若 merchant 未签约：引导 referral — 走 T5/T6 rev-share）
                                    ↓
                     进入 Work thread（同 A 路径的后半）
```

**关键：** 入口不是独立的 "发布" 页，是 Workspace 顶 bar 的一个 `Search + Create` affordance。这样路径 A 和 B **后半段的 UI 完全复用**。

### 4.3 两个路径共享的 "Work thread" 规格

这是整个重构最重要的组件。一个 thread 代表"一个 creator 与一个 merchant 的一次 campaign 合作"，包含：

```
Thread Header: merchant name + campaign title + tier badge + status pill
┌─────────────────────────────────────────────────────────────────┐
│ 📋 Brief          —  what to do, 由 CreatorGPT 起草          │
│ 🗓  Timeline       —  milestone dots + countdown              │
│ 💬 Chat            —  merchant + creator 直接对话（可选 agent）│
│ 📤 Submit          —  粘 URL / 传图 / QR 扫描记录              │
│ ✅ Verify          —  Claude Vision OCR 状态 + 归因进度        │
│ 💰 Earnings        —  base + commission + milestone bonus     │
└─────────────────────────────────────────────────────────────────┘
```

Thread 是**一个纵向滚动长页**（不是 tabs），因为 creator 在 campaign 生命周期内需要反复在 Brief / Chat / Submit 之间回跳 —— 让 scroll 替代 tab click。

---

## 5. 视觉层级 & 排版建议

Design.md 里 **component-level** 规范很完整（880 行），但**workspace-level** 规范几乎没有。以下是缺口补丁方向（详见 `DESIGN_MD_PATCH.md`）。

### 5.1 密度分层（新 token）

当前 Design.md 没区分**密度**。Inbox / Work pipeline 需要高密度（40-56px/行），Portfolio Identity 需要低密度（editorial 大字 + 大留白）。建议引入：

```
--density-compact   : line-height 1.25, row-height 40px   (Inbox list, earnings row)
--density-default   : line-height 1.4,  row-height 56px   (cards, form rows)
--density-editorial : line-height 1.5,  row-height auto   (Portfolio Identity, Discover featured)
```

### 5.2 Workspace Shell（新 pattern）

Design.md 缺的最关键 pattern — 工作台的 3-pane grid：

```
grid-template-columns: 240px 1fr 320px
grid-template-rows: 56px 1fr
+ middle column 可独占（hide side panels）
+ right panel 可折叠
```

### 5.3 Thread View（新 pattern）

每个 campaign 用统一的 thread 渲染（见 §4.3）。Design.md 里没有 thread 组件，建议新增 `.thread`、`.thread-section`、`.thread-section-label`。

### 5.4 Inbox List Item（新 pattern）

需要新增的组件，因为 Design.md 里没有"Gmail-like list item"：
- 左侧 24px status dot（颜色 = tier / invite / system）
- 中间主文 + 副文（Darky 600 16px + CS Genio Mono 13px）
- 右侧 meta：时间 + countdown（invite 类） + action icons（reply / archive）
- Unread = 左侧 3px primary bar + weight +100
- Row height: 64px default, 56px compact
- **Hover：整行 `--surface-bright` 背景**，不做 lift（不适合 list）

### 5.5 Calendar View（新 pattern）

当前 Design.md 完全没有 calendar。建议 v1 用最小可行版本：
- 月视图 grid 7x5-6
- 每格：日期（Darky 500 16px）+ 最多 3 个 event pill（CS Genio Mono 10px + 底色 tier color）
- 切换周视图时 expand 成 time-axis grid
- 用 Design.md 现有的 `--primary` / `--tertiary` / tier colors，不引入新色

### 5.6 层级优先级修正

目前 Dashboard 视觉焦点（L1）被以下元素分散：
1. 地图（最大面积）
2. 左侧 panel title（Discover / My Campaigns / Earnings）
3. 右上 tier strip
4. 底部 5-stat bar
5. 右侧 slide panel（开启时）

**5 个 L1 = 没有 L1**。新 IA 规定：
- 每个 Zone 只有**一个 L1**，由 Darky 900+ 大字标题承载
- L2 是左侧 contextual sub-nav（CS Genio Mono 700 uppercase）
- L3 是 list item / card title
- **无 hero 的情况下，首屏第一个元素必须是 L1**

---

## 6. Before / After 对比表

| 维度 | Before | After | Delta |
|---|---|---|---|
| 顶层概念数 | 8（Dash/Disc/想起/Pub/Post-C/Cal/Msg/Notif） | **4 zones** | -50% |
| URL 深链接 | 无（view 是 state） | 每 zone/tab/thread 都有 URL | ∞ |
| monolith 最大行数 | 1591 | 目标每 page ≤ 400 | -75% |
| 并存的 Discover 入口 | 2（`/explore` + dash view） | 1 | -1 |
| 并存的 Campaign 详情 | 2（slide + full page） | 1（thread） | -1 |
| 并存的 Dashboard | 2（`/dashboard` + `/creator/dashboard`） | 0（删除 shell 取代） | -2 |
| 接单路径上下文切换 | 4+ | 1 | -75% |
| Messages 存在？ | ❌ | ✅ | new |
| Notifications 存在？ | ❌ | ✅（合并 Inbox System） | new |
| Calendar 存在？ | ❌ | ✅ | new |
| Post-campaign 归属？ | 孤岛 | Work overlay + Archive 列表 | 归位 |

---

## 7. 实施优先级

**P0 — 必做，阻塞其他一切（Week 1-2）**
- 建立 Workspace Shell（顶 nav + 左 sub-nav + 右 context panel 的 layout primitive）
- 拆掉 1591 行 monolith，三视图抽成路由页
- 删除 `/dashboard` zombie
- 合并 `/explore` 登录后逻辑进 Workspace/Discover

**P1 — 重要，v5.1 定位要求（Week 3-5）**
- 建 Inbox Zone（即使 agent 还没联调，先把 UI + 空态做出来，接 mock data）
- 建 Work/Today + Calendar（至少月视图）
- 把 post-campaign 独立页改成 Work thread 的 inline 完成状态 + 可选 overlay

**P2 — 体验升级（Week 6-8）**
- Messages 真实打通 merchant 端对话（需要 merchant side 配套）
- Work/Drafts（"想起"语义化兑现）
- Portfolio Identity 的 editorial 大字排版

**P3 — 打磨（ongoing）**
- Design.md 增量更新（workspace shell、inbox list、thread、calendar、density tokens）
- 无障碍 AA 审计（目前 slide panel 焦点陷阱、map 的键盘导航都缺失）
- 响应式从 desktop-first 补齐到 mobile-first

---

## 8. 风险与取舍

1. **删除"主动 Discover 地图首屏"会不会让 creator 感觉"无事可做"？**
   - 缓解：Inbox 空态写"Agent is still matching — ~X new invites today."，并在 Discover 保留"手动探索"入口
   - 监测：Week 4 后看 Discover DAU vs Inbox DAU ratio

2. **Thread view 纵向长滚 vs tabs — 滚动疲劳？**
   - 缓解：Thread 顶部 sticky mini-nav（Brief / Chat / Submit / Earnings），点击 smooth scroll 到 section；默认首屏展示 Brief + Timeline

3. **Messages 要真人客服或 agent？**
   - 先做 merchant ↔ creator 直连；agent 介入（CreatorGPT）作为"建议回复"按钮而非自动发言
   - 合规：所有 agent 建议发言必须显式确认（不得静默 send）

4. **Desktop-first 布局在 mobile 会不会崩？**
   - 3-pane 在 mobile 退化为单 pane + 底 tab；所有 thread section 可 accordion 折叠
   - 每个 Zone 的 mobile 专门设计（不是等比缩放）

---

## 9. 验收标准（写完不算完）

**创作者在 app 里执行以下任务，各自上下文切换 ≤ 1：**
- ✅ 接受一个 invite
- ✅ 查看今天要到哪家店
- ✅ 提交一个已发布内容
- ✅ 看这个月赚了多少
- ✅ 回复 merchant 消息
- ✅ 看距离下个 tier 还差多少

**技术指标：**
- 无 page 超过 400 行（分 sub-components）
- 无 state 跨越 3+ Zone（用 URL 持久化）
- 所有主要视图都有 URL（/inbox、/inbox/invites、/work/today、/work/campaign/:id、/portfolio/earnings 等）

---

## 10. 下一步

1. 阅读 `CLAUDE_CODE_V5_1_CREATOR_WORKSPACE.md`（工程落地 instructions — P0 开始）
2. 阅读 `DESIGN_MD_PATCH.md`（Design.md 增量更新，补 workspace-level 规范）
3. 团队 review 这份 audit（Z 技术可行性 / Milly 视觉 / Lucy 创作者侧反馈）
4. 起工程 kick-off：优先 P0 的 Workspace Shell + monolith 拆分

---

**附录 A — 用户原问题与回答的映射：**
- "8 个区都不联在一起" → §3 给出 4-zone 收敛
- "心智 / 动线 / 排版混乱" → §2 诊断 + §4 新动线 + §5 视觉层级
- "20x 体验优化" → §6 Before/After + §9 验收标准
- "Design system 太破碎" → §5 给缺口定位 + DESIGN_MD_PATCH.md 兑现
