# Design.md — Creator Workspace 增量补丁 v1.0

**角色：** 这是对 `Design.md`（权威设计系统）的**增量补丁**，不替换原文。
**适用范围：** Creator Workspace Shell 及其下的 Inbox / Work / Portfolio / Discover 四 Zone。
**约束：** 完全服从 Design.md 现有核心约束（直角 / 6 色 / 双字体 / 8px 网格 / light-only / GSAP+Lenis）。

**合并策略：** 待 Jiaming + Milly review 后，把本文件的每个 section 合并进 Design.md 对应大段（§Reusable UI Patterns / §Animation Tokens / §Color 等）。

---

## A. 补 Density Tokens（加到 Color/Spacing 之后）

当前 Design.md 只定义了 8px grid，但没有区分**信息密度层级**。Inbox 是 Bloomberg 密度，Portfolio Identity 是 editorial 排版 —— 它们需要不同 row-height 和 line-height。

**新增（加到 `:root`）：**

```css
/* Density tokens — controls row-height & line-height across workspace zones */
--density-compact-row:    40px;
--density-compact-line:   1.25;
--density-default-row:    56px;
--density-default-line:   1.4;
--density-spacious-row:   80px;
--density-spacious-line:  1.55;
--density-editorial-line: 1.5;   /* no row-height; used for portfolio identity headlines */
```

**使用规则：**

| Density | Where |
|---|---|
| compact | Inbox list, Earnings payout row, Archive 列表行 |
| default | Pipeline campaign card row, Calendar event pill container |
| spacious | Today timeline event block, Thread section separators |
| editorial | Portfolio Identity hero, Discover featured card |

---

## B. 补 Workspace Shell Pattern（新 Pattern，加到 §Reusable UI Patterns 末尾）

这是 Design.md 最大缺口 —— 现在有 Navbar、Homepage Hero、Campaign Card 的规格，但**没有"工作台 shell"**。

### Workspace Shell

Creator-facing workspace 的顶层 layout primitive，所有 `/creator/(workspace)/*` 路由共享。

**Grid：**
```css
.ws-shell {
  display: grid;
  grid-template-columns: var(--ws-side-w, 240px) 1fr var(--ws-context-w, 320px);
  grid-template-rows: var(--ws-topnav-h, 56px) 1fr;
  min-height: 100vh;
  background: var(--surface);
}
.ws-topnav    { grid-column: 1 / -1; }
.ws-sidenav   { grid-column: 1; grid-row: 2; border-right: 1px solid var(--line); }
.ws-main      { grid-column: 2; grid-row: 2; overflow-y: auto; }
.ws-context   { grid-column: 3; grid-row: 2; border-left: 1px solid var(--line); }
```

**TopNav（56px）：**
- Background: `var(--surface)` + `border-bottom: 1px solid var(--line)`
- Logo 左：Darky 900 italic `1.625rem` + 3px `--primary` 下划线（复用现有 Navbar 规格）
- 中间：4-Zone 链接（CS Genio Mono `0.8125rem` weight 700 uppercase letter-spacing `0.06em`）
- Active Zone：`border-left: 3px solid var(--primary)` + `background: rgba(193,18,31,0.06)`
- Hover：下划线从左滑入（复用 Link hover 微交互）
- 右侧：search icon（28px）+ Cmd+K 提示 + 圆形 avatar（36px 方形，无圆角，hover 2px primary ring）

**SideNav（240px contextual）：**
- Background: `var(--surface)`
- Vertical list，每项 44px 高
- CS Genio Mono `13px` weight 600，active 项 `var(--primary)` + 左侧 3px border
- icon 16px，在文本左侧 gap 12px
- 底部可留 collapse toggle（v1 不做，v2 再加）

**ContextPanel（320px）：**
- Background: `var(--surface-bright)`
- 顶部 40px panel header（Title: CS Genio Mono 11px uppercase letter-spacing 0.08em + close/collapse btn 右侧）
- 内容区：根据 Zone 传入（invite preview / today next-up / tier progress / discover quick filter）
- 折叠：`transform: translateX(calc(100% - 40px))`，保留 40px 的 re-expand 把手
- 动画：`transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1)`

**Mobile (<768px)：**
- Grid 退化为单列
- TopNav 高度降到 48px，logo 居中，左侧 hamburger，右侧 avatar
- SideNav 变 drawer（左侧滑入），用 Design.md 的 `modalSlideUp` 改向
- ContextPanel 变成 bottom sheet（从底部滑起，初始 80px 高 "peek"，上拉至全屏）
- 底部固定 `MobileNav` 4 icon（Inbox / Work / Portfolio / Discover），复用 Design.md 既有 MobileNav 规格

---

## C. 补 Inbox List Pattern（新）

Gmail / Linear 风格的 list 组件，Design.md 没有等价物（最接近的是 Campaign Card，但是 card 形态，不是 list row）。

### InboxRow

- **Height**: `var(--density-compact-row)` = 40px default，未读时 64px（给副文空间）
- **Layout**:
  ```
  [3px status bar] [24px gap] [avatar 40px] [12px gap] [主文+副文 flex:1] [right meta] [actions on hover]
  ```
- **Status bar (左 3px)**:
  - Unread: `var(--primary)` solid
  - Read: `var(--line)`
  - Urgent countdown (<30min): `var(--primary)` + `pulse` animation (Design.md 已有 pulse token)
- **主文**: Darky weight 600 `15px` letter-spacing `-0.01em`，unread 时 weight 700
- **副文**: CS Genio Mono `13px` `var(--graphite)`，truncate 1 行
- **Right meta**: 时间（12px tertiary）+ 金额徽章（Darky 700 16px）+ countdown pill（若 invite，CS Genio Mono 10px uppercase）
- **Hover**: 整行 `background: var(--surface-bright)`；右侧 inline 显示 `Accept` / `Decline` / `Archive` ghost btn
- **Selected**: `background: rgba(193,18,31,0.06)` + 左侧 3px `--primary`（替换 unread bar）
- **Focus ring (keyboard)**: `outline: 2px solid var(--primary); outline-offset: -2px`

### Invite Variant
- 额外右侧 pill 显示"2h 14m left"；<30min 时红色 + pulse
- Action icons 默认可见（不靠 hover）以强调紧迫性

### Message Variant
- Avatar 用 merchant logo（circle mask inside 40px 方形，只 pop 头像本身）
- 若有未读消息数：24x16px `--primary` 徽章在副文末尾

### System Variant
- Avatar 换成系统 icon（16px 放在 24x24 badge 里），底色按类别：
  - Tier up: `--champagne`
  - Payout: `--tertiary`
  - Compliance warn: `--primary` tint
  - Verify result: `--graphite` tint

---

## D. 补 Thread View Pattern（新）

替代原 Campaign 全页详情 + slide panel 两种形态。纵向滚动长页 + sticky mini-nav。

### ThreadShell
- Max-width: `960px`, 居中，padding `32px`
- 顶部 `ThreadHeader`（96px 高，不可滚出）
  - 左：merchant logo 56px + 名称（Darky 700 24px）+ campaign title（CS Genio Mono 14px graphite）
  - 右：tier badge（Design.md 既有规格）+ status pill + `$payout` big number（Darky 800 28px）
- `ThreadMiniNav`（44px, sticky below TopNav at `top: 56px`）
  - 锚点：Brief / Timeline / Chat / Submit / Verify / Earnings
  - 每锚点：CS Genio Mono 12px weight 600 uppercase，active 色 `--primary` + 底部 2px 线
  - Smooth scroll 跳转（用 GSAP ScrollTrigger 同步 active 态，不是 CSS-only）

### ThreadSection
- Vertical spacing: `margin: 48px 0`
- `scroll-margin-top: 112px`（topnav 56 + mininav 44 + 12 buffer）
- Section label: CS Genio Mono 11px uppercase letter-spacing 0.08em `--tertiary`（复用 dashboard `dash-detail-section-label` 规格）
- Section title: Darky 700 20px `--dark`
- 左侧 24px 加一条 `border-left: 1px solid var(--line)` 视觉串联所有 section

### MilestoneRail（in Timeline section）
- Horizontal rail，节点间距 56px
- 节点：16px dot
  - Done: `--dark` fill
  - Active: `--primary` fill + 3px 外环
  - Upcoming: `--line`
- Connector: 1px `--line`，已完成段 2px `--dark`
- Node label below: CS Genio Mono 10px uppercase weight 700
- Underneath：ETA / due date（CS Genio Mono 11px graphite）

### MerchantChat
- 使用现有 "Split Hero" + "Form + Lottie" 的 Form pattern
- 输入框：`border: 1px solid var(--line)`，focus `--primary`；border-radius: 0
- 消息气泡：**不用圆角气泡**（直角 5 色系统里气泡圆角不一致）
  - Creator 自己：`background: rgba(0,48,73,0.04)` + 右对齐
  - Merchant：`background: var(--surface-bright)` + 左对齐
  - 宽度上限 480px
  - 时间戳下方 CS Genio Mono 10px graphite
- "Suggest reply" CreatorGPT 按钮：输入框下方，dashed outline，点击填充 draft

### SubmitForm
- 接入当前 `CampaignChecklist` 的 fields，但去除独立 component 形态
- 粘 URL 的 input：`min-height: 48px`, CS Genio Mono placeholder
- 传图按钮：dashed drop-zone，`1.5px dashed var(--line)`；hover `--primary`
- 提交按钮：full-width `--primary` bg + `3px 3px 0 var(--accent)` box-shadow（复用 Design.md button shadow system）

---

## E. 补 Calendar View Pattern（新，v1 最小版）

### Month View
- Grid: 7 cols × 5-6 rows，每格 `min-height: 96px`, `border: 1px solid var(--line)` 外边，内部只留底边
- 日期：Darky 500 16px 右上角
- 今日：日期背景 `--primary` filled 20px 方块白字
- 非本月：日期 `--line` 色
- Event pill（最多 3 个）：
  - `height: 20px`
  - CS Genio Mono `10px` weight 700
  - 底色: merchant category color（复用 `CATEGORY_DOT_COLOR`）
  - 文字：白（除 `Lifestyle` 底色浅色，用 `--dark`）
  - Truncate 1 行
- `+N more`：第 4 个起折叠为 `CS Genio Mono 10px --graphite`

### Week View (v1 可延后)
- 时间轴 6:00-23:00
- 每小时 hr-line `1px dashed var(--line)`
- Event block: absolute positioned, width 100%

### Nav bar
- `< April 2026 >` 中间（Darky 600 20px）
- 左 `Today` 按钮（outlined）
- 右 `Month / Week` 切换（CS Genio Mono chips，复用 filter chip 规格 border-radius: 50vh）

---

## F. 补空状态规范（Editorial Empty States）

Design.md 只提到 `.empty-state` 要有 exclamation icon + retry — 但每 Zone 的 empty state 应该用**叙事文案**而非静态提示。

### Tone Guide

| Zone | Empty state tone | Pattern |
|---|---|---|
| Inbox/All | 稳定期待 | "Clear inbox. Agent's still matching — new invite typically lands ~4h." + [Browse Discover] link |
| Inbox/Invites | 继续你的事 | "No active invites. You're up to date." + 不加 CTA |
| Work/Today | 自主轻松 | "No commitments today. Enjoy the day." |
| Work/Pipeline | 起步引导 | "Pipeline is empty. Accept an invite or explore Discover to start." + [Go to Discover] |
| Work/Calendar | 简短中性 | "No events this month." |
| Work/Drafts | 无 | "No drafts saved." |
| Portfolio/Earnings | 期待未来 | "No payouts yet. Complete your first campaign to earn." |
| Portfolio/Archive | 鼓励前进 | "Archive is empty. Your first completed campaign lands here." |
| Discover | 扩大范围 | "No campaigns match. Try clearing filters." |

### Visual规格

```
.empty-state-editorial {
  padding: var(--space-8) var(--space-4);   /* 64px vertical */
  text-align: left;                          /* NOT centered — feels less "system error" */
}
.empty-state-editorial__title {
  font-family: Darky;
  font-weight: 900;
  font-size: clamp(32px, 5vw, 56px);
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--dark);
}
.empty-state-editorial__body {
  font-family: 'CS Genio Mono';
  font-size: 14px;
  color: var(--graphite);
  margin-top: 12px;
  max-width: 420px;
  line-height: 1.5;
}
.empty-state-editorial__link {
  display: inline-block;
  margin-top: 20px;
  font-family: 'CS Genio Mono';
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary);
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
}
```

**禁止在空状态用：** emoji、大图 illustration、overly cheerful exclamation marks。保持 editorial 冷静。

---

## G. 补 Animation Tokens（加到 §Animation Tokens 表格）

```
inviteCountdownPulse   | 1.2s loop    | ease-in-out                      | <30min 倒计时文字 scale(1→1.05)
threadSectionReveal    | 480ms        | cubic-bezier(0.22, 1, 0.36, 1)   | Thread section 进入视口
sideNavItemActive      | 220ms        | ease-out                         | 左 3px border 从 0 → 3px
contextPanelSlide      | 280ms        | cubic-bezier(0.22, 1, 0.36, 1)   | ContextPanel 折叠/展开
inboxRowEnter          | 240ms        | ease-out                         | 新 invite 从顶部 slide-in
calendarCellHover      | 180ms        | ease                             | 月视图单元格 hover bg
```

---

## H. 补 Navigation Active 状态规范

统一所有 nav 类组件的 active 视觉：

| 层级 | Active 样式 |
|---|---|
| TopNav Zone link | `color: var(--primary)` + 底部 3px 红 border + bg `rgba(193,18,31,0.06)` |
| SideNav 子项 | 左侧 3px `--primary` border + color `--primary` + bg `rgba(193,18,31,0.06)` |
| ThreadMiniNav anchor | 底部 2px `--primary` border + color `--primary` |
| Filter chip | bg `--primary` + color white |
| Calendar event pill | （无 selected 态，点击跳转） |

**一致性规则：** 所有 "navigation 类 active" 都用 `--primary` 作为主色 + 同向的指示 line。不要在不同层级用不同色。

---

## I. 补跨页一致性约束

新增到 Design.md 的"Color Rules"或独立"Workspace Rules" section：

1. **所有 Creator Workspace 页面**必须由 `(workspace)/layout.tsx` 包裹，禁止自建 layout
2. **所有页面标题 (L1)** 必须使用 Darky 800+ ≥ 32px，每页**只能有一个** L1
3. **所有 list 行组件**必须选一个 density token（compact / default / spacious），禁止硬编码 row-height
4. **所有空状态**必须使用 `.empty-state-editorial`（§F 规格），禁止 emoji / centered 大 icon
5. **所有 Zone 切换**必须是 URL-driven，禁止 `useState` 管 view
6. **所有倒计时 UI**当 remaining <30min 时必须加 `inviteCountdownPulse` 动画
7. **所有金额显示**用 Darky 700+，数值与 `$` 同级；禁止用 CS Genio Mono 显示金额（数字在 monospace 里太单薄）
8. **所有 tier 引用**必须用 `--tier-{material}` 变量，禁止直接写 hex（现有 TierBadge 组件规范已覆盖）

---

## J. Design.md 合并建议（给 Milly 操作）

完成本补丁合入后，Design.md 结构建议：

```
§ Color Palette              ← 不动
§ Typography                 ← 不动
§ Shape & Spacing            ← 末尾加 Density Tokens 段 (本文 §A)
§ Interaction & Motion       ← 末尾加 Workspace 动画 token (本文 §G)
§ SaaS Template Patterns     ← 不动
§ Tier Identity System       ← 不动
§ Reusable UI Patterns
  ├─ Navbar (Creator)        ← 不动 (legacy pages 仍用)
  ├─ Workspace Shell         ← 新增 (本文 §B)
  ├─ Inbox List              ← 新增 (本文 §C)
  ├─ Thread View             ← 新增 (本文 §D)
  ├─ Calendar View           ← 新增 (本文 §E)
  ├─ Editorial Empty State   ← 新增 (本文 §F)
  ├─ Homepage Hero           ← 不动
  ├─ ... (其他保留)
§ Loading States             ← 不动
§ Error Boundaries           ← 不动
§ Toast Notifications        ← 不动
§ Navigation Active Rules    ← 新增 (本文 §H)
§ Workspace Consistency      ← 新增 (本文 §I)
```

---

## K. 验收问题（merge 前回答）

- [ ] §B ContextPanel 折叠是否需要在 collapsed 状态下仍显示 icon 提示？—— v1 我建议：仅显示 40px vertical rail 可点击展开
- [ ] §C Invite Row 的 Accept / Decline 是否应该在 hover 前就可见？—— v1 我建议：invite 类默认可见以强调紧迫；其他类 hover 可见
- [ ] §D Thread MerchantChat 是否支持 markdown？—— v1 建议：plain text only + autolink URL；markdown v2 再做
- [ ] §E Calendar 是否必须支持拖拽改期？—— v1 建议：不支持（Pilot 阶段 campaign 时间由 merchant 定，creator 只接受）
- [ ] §F 空状态文案是否走 `push-brand-voice` skill review？—— 强烈建议是
- [ ] 合并 Design.md 前，是否需要出一套 Figma spec？—— 建议 Milly 产出 4 Zone 的高保真各一张即可

---

**变更日志：** v1.0 — 2026-04-18 初稿。下次修订需标明 diff 原因（v5.1 战略 / 用户反馈 / 合规要求）。
