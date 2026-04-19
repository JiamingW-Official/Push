# Claude Code — Creator Workspace 重构执行手册

**配套文档：** 先读 `CREATOR_WORKSPACE_AUDIT.md`（战略/IA），再读 `DESIGN_MD_PATCH.md`（视觉规范）
**目标：** 把当前 8 个割裂区整合为 4-Zone Workspace Shell
**约束：** 不碰 v5.1 定价/tier/attribution；只动 Creator 前端与其 API 边界
**命令约定：** 所有 commit 用 `refactor(creator-ws): xxx` / `feat(creator-ws): xxx`

---

## 0. 开工前 checklist

- [ ] 创建 feature branch：`git checkout -b creator-workspace-v1`
- [ ] 备份当前 `/creator/dashboard/page.tsx`（后面要拆）：`cp app/\(creator\)/creator/dashboard/page.tsx app/\(creator\)/creator/dashboard/page.tsx.bak`
- [ ] 在 `docs/` 建 `CREATOR_WORKSPACE_MIGRATION_LOG.md`，每次拆分记录映射：`旧位置 → 新位置`
- [ ] 读 `Design.md` + `DESIGN_MD_PATCH.md` 一次，记住"直角/5+1色/双字体/8px 网格/Papaya Whip→Pearl Stone `#f5f2ec`"
- [ ] 跑一次 grep 禁用词自检：grep `agency`、`marketplace`、`$19.99`、`Performance-Based`、`flat $40` —— 必须 0 命中

---

## 1. P0 — Workspace Shell + Monolith 拆分（Week 1-2）

### 1.1 新建 Workspace Shell layout

**创建文件：** `app/(creator)/creator/(workspace)/layout.tsx`

这是一个新的 **route group**（括号 = 共享 layout 但不影响 URL）。所有 creator workspace 页面（inbox / work / portfolio / discover）共享这个 shell。

**规格：**
- Layout 组件包含 3 个 slot：`<TopNav />`、`<SideNav>`、`<ContextPanel>`，children 渲染在主内容区
- Grid: `grid-template-columns: 240px 1fr 320px; grid-template-rows: 56px 1fr`
- 使用 CSS variable `--ws-side-nav-w: 240px; --ws-context-w: 320px; --ws-topnav-h: 56px`
- Mobile 断点 `< 768px`：shell 退化为单列，SideNav 进 drawer，ContextPanel 进 thread-bottom sheet
- **禁止在 layout 里放 state 或 fetch**（保持 server component）

**创建组件：**
- `components/creator/workspace/TopNav.tsx`（56px nav）
  - 4 个 Zone 链接：Inbox / Work / Portfolio / Discover（使用 `usePathname` 判断 active）
  - 左侧 logo（Darky 900 italic, `1.625rem`）+ 右侧 search + avatar
  - Active Zone：左侧 3px `--primary` border + 背景 `rgba(193,18,31,0.06)`
  - **Unread badge 只出现在 Inbox**，数字来自 `useInboxUnread()` hook（先 mock，后接 API）
- `components/creator/workspace/SideNav.tsx`（240px contextual nav）
  - 根据当前 Zone 渲染不同 sub-nav 项
  - Zone → Sub-nav 映射表见 §1.3
- `components/creator/workspace/ContextPanel.tsx`（320px right panel）
  - 可折叠，state 存 `localStorage`（`push-ws-context:collapsed`）
  - 折叠动画：transform translateX + 收到 `calc(100% - 40px)`
  - 每 Zone 传入不同 children

**测试验收：** 4 个 Zone URL 分别访问，shell 稳定不重渲染；collapse/expand context panel 动画顺滑；mobile 宽度下 side/context 正确退化。

### 1.2 路由结构落地

```
app/(creator)/creator/
├── (workspace)/
│   ├── layout.tsx                    ← 新 shell
│   ├── inbox/
│   │   ├── page.tsx                  ← 默认 = All
│   │   ├── invites/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── system/page.tsx
│   │   └── [threadId]/page.tsx       ← thread preview
│   ├── work/
│   │   ├── page.tsx                  ← 默认 = today
│   │   ├── today/page.tsx
│   │   ├── pipeline/page.tsx         ← 原 My Campaigns
│   │   ├── calendar/page.tsx
│   │   ├── drafts/page.tsx           ← 用户说的"想起"
│   │   └── campaign/[id]/page.tsx    ← 新 Thread view
│   ├── portfolio/
│   │   ├── page.tsx                  ← 默认 = identity
│   │   ├── identity/page.tsx
│   │   ├── earnings/page.tsx
│   │   └── archive/page.tsx
│   └── discover/
│       └── page.tsx                  ← 移植原 Discover view
├── dashboard/                        ← 保留但 redirect → /creator/inbox
├── campaigns/[id]/                   ← 保留但 redirect → /creator/work/campaign/[id]
├── post-campaign/                    ← 保留但 redirect → /creator/work/campaign/[id]?celebrate=1
├── profile/                          ← 保留但 redirect → /creator/portfolio
├── public/[id]/                      ← 公开页，不动
├── onboarding/                       ← 不动
├── login/、signup/、reset-password/  ← 不动
```

**所有 redirect 用 Next.js `redirect()`**（不要用 meta refresh）。保留 30 天后再删除旧路径。

### 1.3 Zone → SideNav 项映射

```ts
// components/creator/workspace/side-nav-config.ts
export const SIDE_NAV = {
  inbox: [
    { href: "/creator/inbox",          label: "All",      icon: "inbox"  },
    { href: "/creator/inbox/invites",  label: "Invites",  icon: "mail+"  },
    { href: "/creator/inbox/messages", label: "Messages", icon: "chat"   },
    { href: "/creator/inbox/system",   label: "System",   icon: "bell"   },
  ],
  work: [
    { href: "/creator/work/today",     label: "Today",    icon: "sun"    },
    { href: "/creator/work/pipeline",  label: "Pipeline", icon: "flow"   },
    { href: "/creator/work/calendar",  label: "Calendar", icon: "cal"    },
    { href: "/creator/work/drafts",    label: "Drafts",   icon: "draft"  },
  ],
  portfolio: [
    { href: "/creator/portfolio/identity", label: "Identity", icon: "id"   },
    { href: "/creator/portfolio/earnings", label: "Earnings", icon: "cash" },
    { href: "/creator/portfolio/archive",  label: "Archive",  icon: "box"  },
  ],
  discover: [
    // 只有 1 项，SideNav 在 discover zone 收起；或显示 filter 控件
  ],
} as const;
```

**命名禁令：** 不要在 UI 字符串里出现 "Dashboard"、"Post-campaign"、"想起" —— 全用上面的英文标签。

### 1.4 拆分 1591 行 monolith

**目标：** `app/(creator)/creator/dashboard/page.tsx` 拆完后 ≤ 50 行，只做 redirect。

**步骤：**
1. **抽数据 hooks** 到 `lib/creator/hooks/`：
   - `useCreatorProfile()` — 提取行 500-700 的 creator fetch
   - `useCampaigns()` — 行 400-480
   - `useApplications()` — 行 480-540
   - `usePayouts()` — 对应 earnings view 数据
   - `useTierProgress()` — 行 740-780
2. **抽组件**：
   - `CampaignList` — 行 1012-1094（包含 map + card）→ `components/creator/lists/CampaignList.tsx`
   - `ApplicationList` — 行 1127-1207 → `components/creator/lists/ApplicationList.tsx`
   - `EarningsSummary` — 行 1212-1292 → `components/creator/portfolio/EarningsSummary.tsx`
   - `CampaignDetailPanel` — 行 1295-1548（slide panel）→ **删除**，改成 thread view 首屏
3. **三视图落地：**
   - Discover view → 移到 `app/(creator)/creator/(workspace)/discover/page.tsx`
   - My Campaigns view → 移到 `.../work/pipeline/page.tsx`
   - Earnings view → 移到 `.../portfolio/earnings/page.tsx`
4. **状态从 local → URL：**
   - `view` state 删除（URL 本身就是 view）
   - `filter` / `sortKey` / `appStatusFilter` 用 `useSearchParams` + `useRouter.replace`
   - `activeId` / `hoveredId` 保留 local
   - `selectedCampaign` / `slideOpen` 删除（换成路由到 `/work/campaign/[id]`）
5. **map 抽成 reusable：** `MapView` 组件已存在，保留；增加 prop `mode: 'discover' | 'today-route'`

**验收：** 跑 `wc -l app/(creator)/creator/dashboard/page.tsx` → ≤ 50；新的四个 workspace zone 各自 page.tsx ≤ 200 行。

### 1.5 删除 / 合并清理

**必删：**
- `app/(creator)/dashboard/page.tsx`（僵尸 184 行） → 文件整体删除
- `app/(creator)/creator/dashboard/dashboard.css` 里 `.dash-view-switcher` 等仅为三视图切换的样式

**必合并：**
- `app/explore/page.tsx`（公开 727 行）和 `workspace/discover/page.tsx` 共用组件：
  - 提取 `components/creator/discover/DiscoverFeed.tsx`（含 filter + sort + map + list）
  - `/explore` 作为**未登录 shell**调用它（无 workspace 包装）；登录后 `/creator/discover` 在 shell 内调用它
  - 两套 `DEMO_CAMPAIGNS` 删除，统一从 `lib/creator/demo-data.ts` 导入

---

## 2. P1 — Inbox + Work + 完成动画归位（Week 3-5）

### 2.1 Inbox Zone

**空态设计（Milly/Jiaming 文案确认后）：**
```
Clear inbox.
Agent's still matching.
New invite typically lands within 4h.
                                             [Browse Discover →]
```
- Darky 900 48px 首行"Clear inbox."
- CS Genio Mono 14px graphite 副文
- 底部 text-only 链接，不是按钮（避免抢焦点）

**Invite list item 组件：** `components/creator/inbox/InviteRow.tsx`
- 64px 高
- 左 3px status bar（未读 `--primary`，已读 `--line`）
- Avatar 40px（merchant logo）
- 主文：`{merchant_name}` Darky 600 15px + 副文 `{campaign_title}` CS Genio Mono 13px graphite
- 右 meta：$payout（Darky 700 16px）+ 2h 倒计时（CS Genio Mono 11px，红色 pulse 若 <30min）
- Hover：整行 `--surface-bright` 背景 + 右侧露出 `Accept` / `Decline` ghost 按钮
- 点击行：打开右侧 ContextPanel 的 thread preview（不跳转）

**API 边界（先 mock）：**
```ts
// lib/creator/api/inbox.ts
export async function getInboxItems(filter?: 'invites'|'messages'|'system')
export async function respondToInvite(inviteId: string, action: 'accept'|'decline')
export async function markRead(itemIds: string[])
```

### 2.2 Work Thread View（最大单体组件）

**路由：** `app/(creator)/creator/(workspace)/work/campaign/[id]/page.tsx`

替代：
- 原 `/creator/campaigns/[id]/CampaignPageClient.tsx`（873 行）
- dashboard 的 slide panel（删）
- `/creator/post-campaign` 孤岛（改成此页 `?celebrate=1` 的 overlay 参数）

**组件树：**
```
<ThreadShell>
  <ThreadHeader merchant tier status countdown />
  <ThreadSection id="brief"    title="Brief">     <BriefRenderer /> </ThreadSection>
  <ThreadSection id="timeline" title="Timeline">  <MilestoneRail /> </ThreadSection>
  <ThreadSection id="chat"     title="Chat">      <MerchantChat />  </ThreadSection>
  <ThreadSection id="submit"   title="Submit">    <SubmitForm />    </ThreadSection>
  <ThreadSection id="verify"   title="Verify">    <VerifyStatus />  </ThreadSection>
  <ThreadSection id="earnings" title="Earnings">  <PayoutSummary /> </ThreadSection>

  {celebrateParam && <FirstPaycheckOverlay />}   ← 复用现有 FirstPaycheck 组件
</ThreadShell>
```

**要点：**
- 整页**纵向滚动**，sticky mini-nav 在 header 下方（`position: sticky; top: 56px`）
- 默认滚动位置：URL 无 hash → `#brief`；`?step=submit` → 自动滚到 submit
- ThreadSection 用 `scroll-margin-top: 112px`（避开 topnav + mini-nav）
- **删掉原 `CampaignChecklist.tsx` 组件**，把内容吸收进 `MilestoneRail`

### 2.3 Today view

**路由：** `/creator/work/today`

**规格：**
- 顶部大字"Today"（Darky 800 48px）+ 副文日期
- 时间轴布局：左侧时间刻度 06:00 → 23:00，右侧事件卡
- 事件卡 = 该 campaign 今日相关的 milestone（到店 / 截止 / 发布 deadline）
- 空态：`No commitments today.` + `[Check pipeline]`
- 右侧 ContextPanel 显示 "Next up: {campaign} — starts in {X}"

### 2.4 Calendar view

**路由：** `/creator/work/calendar`

**v1 最小版：**
- 月视图 7x6 grid，使用 `date-fns`（已有依赖，确认 package.json）
- 每格最多 3 个 event pill：底色 = merchant 类别 color（参考 dashboard 的 `CATEGORY_DOT_COLOR`）
- 顶部：`< April 2026 >` 切换 + `Today` 快捷按钮 + `Month/Week` 切换
- Event 点击：跳 `/creator/work/campaign/[id]#timeline`

**v1 不做：**
- 不支持拖拽改期（到 v2）
- 不支持 recurring events（我们没有这种需求）

### 2.5 Drafts（"想起"的兑现）

**路由：** `/creator/work/drafts`

**定义：** creator 开始填但没提交的任何内容 —— submit form 的草稿、保存的 chat drafts、未发送的 decline 理由。

**v1：** 简单列表，每条展示 merchant + campaign + "Last edited X ago" + `Resume` 按钮

### 2.6 Post-campaign 归位

**不删文件**，但改造：
1. `app/(creator)/creator/post-campaign/page.tsx` 改成 redirect：`redirect('/creator/work/campaign/' + campaignId + '?celebrate=1')`
2. 把页面里的 `CheckSVG`、tagline 逻辑、tier journey 部分提取到 `components/creator/thread/CompletionOverlay.tsx`
3. Thread view 根据 `?celebrate=1` 参数挂载 overlay 一次，关闭后参数从 URL 移除
4. 同一份完成记录也进入 `/creator/portfolio/archive` 的列表（静态版，不是情绪版）

---

## 3. P2 — 体验打磨（Week 6-8）

### 3.1 Messages 真实对话

**前置：** merchant 端也要有 conversation ui（新开 ticket）
**新建 API：** `app/api/creator/messages/route.ts` + `app/api/creator/messages/[threadId]/route.ts`
**实时：** v1 用 3s 轮询（Supabase realtime 留 v2 再接）
**CreatorGPT 集成（可选）：** 在输入框下方加"Suggest reply"按钮，调用 Sonnet 4.6 生成草稿（**显式确认才发**，严禁静默 send — 合规）

### 3.2 Portfolio Identity 视觉升级

执行 Design.md "Editorial Scroll" 哲学：
- `Portfolio / Identity` 首屏：Darky 900 `12vw` 大字显示 tier 名 + Material 名
- 下方 Darky 200 light 小字：score / rank / distance to next tier
- 用 `obsidianPulse` / `tierShimmer` 动画点缀

### 3.3 Search（全局）

顶 nav 右侧 search 接口：`Cmd+K` 聚焦
- 搜索域：merchant name / campaign title / invite subject / message content
- 结果分组：`Active campaigns` / `Archive` / `Messages` / `Merchants`

---

## 4. P3 — 打磨 & 技术债（ongoing）

- [ ] 无障碍：slide panel 焦点陷阱（用 `focus-trap-react` 或手写）；map 键盘导航
- [ ] `next/image` 替换所有 `<img>` 原生标签
- [ ] 所有 workspace pages 加 loading.tsx 骨架屏（Design.md 已有规范）
- [ ] Error boundaries 包裹每个 Zone
- [ ] 响应式审计：768-1024 中断点单独设计（目前只有 <768 和 ≥1024 两档）
- [ ] 删除已迁移完的 css class（compact `dashboard.css` 从 ~800 行降到 ≤ 100 行）

---

## 5. Commit 序列建议（干净的 git log）

```
refactor(creator-ws): add workspace route group + shell layout skeleton     # §1.1
refactor(creator-ws): extract creator data hooks from dashboard monolith    # §1.4 step 1
refactor(creator-ws): extract CampaignList / ApplicationList components     # §1.4 step 2
feat(creator-ws): add inbox zone routes + mock data                         # §2.1
feat(creator-ws): add work/today + calendar + pipeline + drafts             # §2.3-2.5
refactor(creator-ws): migrate campaign detail from slide panel to thread    # §2.2
refactor(creator-ws): redirect legacy /dashboard, /campaigns, /post-campaign # §1.2
refactor(creator-ws): unify /explore and /creator/discover via DiscoverFeed # §1.5
feat(creator-ws): portfolio zone identity/earnings/archive                  # §1.2 portfolio
feat(creator-ws): implement real messaging threads                          # §3.1
style(creator-ws): editorial type scale for portfolio identity              # §3.2
feat(creator-ws): global search cmd+k                                       # §3.3
chore(creator-ws): accessibility pass + remove legacy dashboard.css rules   # §4
```

---

## 6. 禁止做的事（红线）

1. **不要引入新字体**（除了 Darky + CS Genio Mono）
2. **不要引入新品牌色**（5+1 色：Flag Red / Molten Lava / Pearl Stone / Deep Space Blue / Steel Blue / Champagne Gold）
3. **不要加 border-radius**（除 Design.md 已批准的 3 个例外）
4. **不要把 agent 消息静默 send** — 所有 CreatorGPT 建议必须显式确认（合规）
5. **不要删除 redirect** 在未跑完 30 天过渡期前 — creator 可能有旧书签
6. **不要在 workspace layout 里做 data fetch** — 保持 layout 为 server component 且无状态
7. **不要用 React Context 做跨 Zone 状态** — 用 URL + SWR cache；Context 只在 Zone 内部用
8. **不要保留 `/dashboard` zombie** — 旧路径第一步就删
9. **不要把 "post-campaign" 作为独立 URL 留给 merchant 链接** — 所有链接必须是 `/work/campaign/[id]`
10. **不要加 Instagram/TikTok icon 新颜色** — 延用 Design.md 的 `ContentCard` 变体色值

---

## 7. 与其他 Skills 的交互

| 操作 | 应调用 skill |
|---|---|
| 改 tier 颜色 / 命名 | `push-creator` — 必须走 Two-Segment v5.1 |
| 改归因 UI / QR 扫描流程 | `push-attribution` |
| Campaign 详情字段变化 | `push-campaign` |
| 任何对外文案（brief 模板 / 邀请 DM 模板 / 空态） | `push-brand-voice` — 过 voice 模板 |
| 新页面视觉 / 组件 | `push-website` + Design.md — 先读再写 |

---

## 8. 完工判定

**技术验收：**
- 所有 `.tsx` 页面 ≤ 400 行
- 0 个 `app/**/*.tsx` 含 view-switching useState（view 必须 URL）
- 所有 Zone 的空态都有文案
- grep 禁止词（agency / marketplace / $19.99 / Performance-Based）= 0
- 旧 `/dashboard`、`/campaigns/[id]`、`/post-campaign` 触发 301/302 redirect（不是 200）

**UX 验收（手跑 6 条任务各自 ≤ 1 次上下文切换）：**
1. 接受一个 invite
2. 查看今天到哪家店
3. 提交一个已发布内容
4. 看这个月赚了多少
5. 回复 merchant 消息
6. 看距离下 tier 还差多少

**性能：**
- `/creator/inbox` LCP ≤ 1.5s（含 mock data）
- `/creator/work/campaign/[id]` bundle ≤ 180kB gzipped

---

## 9. 开工命令

```bash
cd "/sessions/peaceful-relaxed-archimedes/mnt/Push"
git checkout -b creator-workspace-v1
mkdir -p "app/(creator)/creator/(workspace)"/{inbox,work,portfolio,discover}
mkdir -p components/creator/{workspace,inbox,thread,portfolio,lists,discover}
mkdir -p lib/creator/{hooks,api}

# 第一步：建 shell layout + 路由骨架（只有空页面 + layout）
# 第二步：跑 npm run dev，手动点每个 Zone URL，确认 404 / layout 正确
# 第三步：开始拆 monolith（§1.4）
```

---

**Working copy principles：** 每次拆一块就跑 `npm run build + lint`，不要憋大 PR。每个 commit 必须独立可 revert。
