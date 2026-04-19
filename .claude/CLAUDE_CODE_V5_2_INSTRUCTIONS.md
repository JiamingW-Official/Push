# Push v5.2 — Claude Code 周度执行指令

**版本：** v5.2.0  
**创建日期：** 2026-04-19  
**交付周期：** Week 1 - Week 12（12周）  
**最后更新：** 2026-04-19

---

## 📌 快速导航

| 角色 | 关键文件 | 开始阅读 |
|------|--------|--------|
| **Z（商家页面）** | 本文档 §3 | [跳转到 Z 的周度任务](#z-的周度任务—商家侧) |
| **Jiaming（Admin/Creator/后端）** | 本文档 §4 | [跳转到 Jiaming 的周度任务](#jiaming-的周度任务—admin--creator--后端) |
| **Lucy/Prum/Milly** | 本文档 §5 | [跳转到支持角色](#支持角色—lucyprum) |

---

## 1. 总体执行策略

### 1.1 三条金律

1. **Design System First：** 任何代码提交前必读 `/mnt/Push/Design.md`，所有 Tailwind 样式必须严格遵循品牌色/间距/字体规范
2. **Weekly Batch Commits：** 每周五晚上统一做一次 code review + commit，不要零散提交
3. **DB Schema Lock：** Week 1 敲定数据库表，Week 2+ 禁止 schema 改动（只能加新列/表，不改现有）

### 1.2 技术栈与约束

```yaml
Frontend:
  框架: Next.js 14 (App Router)
  样式: Tailwind CSS + Design.md 规范
  图表: Recharts（仪表板）
  数据: React Query + Zustand（状态管理）
  
Backend:
  数据库: Supabase (PostgreSQL)
  认证: Clerk (Creator) + Supabase Auth (Admin)
  后台任务: Bull Queue + Node.js workers
  
禁止:
  - 新增字体（仅 Darky + CS Genio Mono）
  - 新增品牌色（仅 5 色：Red/Lava/Pearl/Blue/Steel）
  - 圆角（radius 必须 = 0，除了 map pins 50%）
  - Dark Mode（仅 Light Mode）
```

### 1.3 开发环境检查清单

**Week 1 第一天：必须完成以下**

- [ ] Clone 最新 Push 代码仓库
- [ ] 运行 `npm install` + `npm run dev`（本地启动无误）
- [ ] 连接 Supabase（`.env.local` 中 `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
- [ ] 连接 Clerk（`.env.local` 中 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`）
- [ ] 读取 `/mnt/Push/Design.md`（全读，不要跳过）
- [ ] 读取 `/mnt/Push/.claude/UPDATE_INSTRUCTIONS_v5_1.md`（第 1-3 节）
- [ ] 读取本文档（§1-2）

**如果上述任何一项失败，停止开工，在 #engineering Slack 频道报告。**

---

## 2. 人员分工与技术链路

### 2.1 角色与职责矩阵

| 角色 | 负责模块 | 周度交付物 |
|-----|---------|----------|
| **Z** | 商家 UI（Dashboard/Report/Appeals） | Z 的周度任务 §3 |
| **Jiaming** | Admin UI + Backend + Creator UI | Jiaming 的周度任务 §4 |
| **Lucy** | QA 测试 + 部署管道 | 周度测试矩阵 + 部署清单 |
| **Prum/Milly** | 产品验证 + 数据收集 | Pilot 指标同步 |

### 2.2 代码审查流程

```
开发者完成功能 (Fri 下班前)
        ↓
提交 Pull Request（附 Description + 截图）
        ↓
同伴 Code Review (Fri 晚 8pm-9pm)
        ↓
修复反馈 (Sat 早)
        ↓
Lucy 做 E2E 测试 (Sat 晚)
        ↓
Merge to main (Sun 晚) + 部署到 staging
```

### 2.3 周度同步

**每周五 20:00 - 20:30（Slack + Loom）：**
- Z 展示商家页面进度（截图 + live demo）
- Jiaming 展示后端 + admin 进度
- 指出阻塞项 & 下周调整

---

## 3. Z 的周度任务—商家侧

### Week 1：商家 Dashboard 框架 + DB 连接

**目标：** 商家登陆后看到空的 Dashboard 页面，能拉到历史数据（来自 Supabase）

**交付物：**

| 文件路径 | 组件 | 状态 |
|---------|------|------|
| `/app/merchant/dashboard/page.tsx` | Dashboard 主页 | 新建 |
| `/components/merchant/DashboardHeader.tsx` | 顶部 Header（logo+merchant name+logout） | 新建 |
| `/components/merchant/MetricsCard.tsx` | 单个 KPI 卡片（可复用） | 新建 |
| `/components/merchant/WeeklyChart.tsx` | Recharts 周度图表骨架 | 新建 |
| `/lib/hooks/useMerchantMetrics.ts` | React Query hook（从 Supabase 拉数据） | 新建 |
| `/types/merchant.ts` | TypeScript interface（Merchant/MerchantMetrics） | 新建 |

**详细需求：**

```typescript
// /types/merchant.ts 必须包含：
interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'T1' | 'T2' | 'T3'; // v5.1 tier
  aoV: number; // Average Order Value
  verified_customers_cumulative: number;
}

interface MerchantMetricsWeekly {
  week_start: Date;
  verified_customers: number;      // 本周新增核实客户
  total_revenue: number;            // 本周总收入
  roi: number;                      // Return on Investment (%)
  top_creators: Array<{id, name, contribution_pct}>;
}
```

**UI 规范：**

- Header：Flag Red (`#c1121f`) 背景，白字 merchant name
- KPI 卡片：Pearl Stone (`#f5f2ec`) 背景，Dark Blue 文字，8px padding
- 图表：Recharts 默认颜色改为品牌色（见 Design.md 色板）
- 字体：Darky（标题） + CS Genio Mono（数字）

**代码示例框架：**

```typescript
// /app/merchant/dashboard/page.tsx
'use client';
import { useAuth } from '@clerk/nextjs';
import { useMerchantMetrics } from '@/lib/hooks/useMerchantMetrics';
import { DashboardHeader } from '@/components/merchant/DashboardHeader';
import { MetricsCard } from '@/components/merchant/MetricsCard';

export default function MerchantDashboard() {
  const { userId } = useAuth();
  const { data: merchant, isLoading } = useMerchantMetrics(userId);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      <DashboardHeader merchant={merchant} />
      <div className="p-8 grid grid-cols-4 gap-8">
        <MetricsCard label="核实客户" value={merchant.verified_customers_cumulative} />
        <MetricsCard label="本周收入" value={`$${merchant.weekly_revenue}`} />
        <MetricsCard label="ROI" value={`${merchant.roi}%`} />
        <MetricsCard label="活跃创作者" value={merchant.creator_count} />
      </div>
      <div className="p-8">
        <WeeklyChart data={merchant.weekly_metrics} />
      </div>
    </div>
  );
}
```

**完成标准：**

- ✅ Dashboard 页面能在浏览器中加载（无报错）
- ✅ 从 Supabase 成功读取 mock 数据
- ✅ KPI 卡片样式完全遵循 Design.md（直角、品牌色、间距）
- ✅ 代码通过 ESLint + Prettier 检查

---

### Week 2-3：Weekly Report Widget + 商家列表

**目标：** 商家能看到上周的完整 Report（邮件同步内容），以及所有创作者排行

**交付物：**

| 文件路径 | 组件 | 说明 |
|---------|------|------|
| `/components/merchant/WeeklyReportWidget.tsx` | Weekly Report 卡片 | 展示上周数据 snapshot |
| `/components/merchant/TopCreatorsTable.tsx` | 创作者排行表 | Top 10 creators by contribution |
| `/app/merchant/reports/[weekId]/page.tsx` | Report 详情页 | 完整周报（可下载为 PDF） |
| `/lib/hooks/useWeeklyReport.ts` | 周报数据 hook | 从 API 拉取报告 |
| `/api/merchant/reports/weekly.ts` | 后端 API endpoint | 返回周报数据 |

**UI 规范：**

- Report 卡片：白色背景 (`#ffffff`)，Steel Blue 标题 (`#669bbc`)
- 排行表：斑马纹（行交替 Pearl/白色），Obsidian 文字 (`#1a1a2e`)
- 按钮：Flag Red 背景，白字，直角，鼠标 hover 时变 Molten Lava

**代码链接：**
- Z 只负责 UI 组件（.tsx 文件）
- Jiaming 负责 API endpoint (`/api/merchant/reports/weekly.ts`)
- 接口契约在文档最后 §API 设计清单

**完成标准：**

- ✅ Weekly Report Widget 在 Dashboard 中展示
- ✅ Top Creators Table 可排序（按 contribution % 降序）
- ✅ Report 详情页能下载为 PDF（使用 jsPDF + html2canvas）
- ✅ 响应式设计（desktop/tablet/mobile）

---

### Week 4-5：Merchant Appeals Widget + 实时更新

**目标：** 商家能看到针对自己的 Creator Appeals，可以提交反驳或同意

**交付物：**

| 文件路径 | 组件 | 说明 |
|---------|------|------|
| `/components/merchant/AppealsWidget.tsx` | Appeals 卡片列表 | 待处理 appeal |
| `/components/merchant/AppealDetailModal.tsx` | Appeal 详情 modal | 展示 appeal 细节 + 反驳表单 |
| `/lib/hooks/useAppeals.ts` | Appeals 数据 hook | 实时同步（Socket.io） |

**实时需求：**

- 当有新 appeal 提交时，商家 Dashboard 实时推送通知（右上角 toast）
- Appeal 状态变更时（creator 升级/降级）实时刷新

**UI 规范：**

- Appeal 卡片：红色左边框 (`border-l-4 border-[#c1121f]`)
- Appeal 状态：待处理（amber）/ 已同意（green）/ 已拒绝（red）
- 按钮：反驳（Steel Blue）/ 同意（Green）/ 拒绝（Red）

**完成标准：**

- ✅ Appeals 列表加载正确
- ✅ 可以打开 detail modal，查看完整信息
- ✅ 实时通知工作（使用 Socket.io 或 Supabase Realtime）
- ✅ 提交反驳表单后，状态实时更新

---

### Week 6-7：Dashboard 增强版 + 性能优化

**目标：** 优化商家 Dashboard 视觉，增加更多可视化，优化加载速度

**任务：**

1. **美化 Dashboard 布局：**
   - 添加 Hero banner（品牌色渐变）
   - 优化卡片布局（4 列 → 2x2 或响应式）
   - 添加快速操作按钮（创建新 campaign、邀请创作者等）

2. **新增可视化：**
   - 客户获取漏斗（Funnel chart：all walks-ins → scanned → verified）
   - 创作者性能热力图（Heatmap：days × hours → conversion rate）
   - 收入趋势（Line chart：4 周 revenue trend）

3. **性能优化：**
   - 图表数据分页（一次最多显示 52 周）
   - 缓存策略（React Query staleTime = 5min）
   - 图片优化（使用 Next.js Image）

**文件清单：**

```
/components/merchant/
  - HeroBanner.tsx
  - CustomerFunnelChart.tsx
  - CreatorHeatmap.tsx
  - RevenueSparkline.tsx
/lib/hooks/
  - useDashboardCache.ts (React Query 缓存)
```

**完成标准：**

- ✅ Dashboard Lighthouse score ≥ 85
- ✅ 所有图表数据正确（单位、小数点、货币符号）
- ✅ 响应式完美（mobile/tablet 下不破裂）

---

### Week 8-9：创作者表现个人资料 + 一键操作

**目标：** 商家能点击创作者名字，看到该创作者的完整表现，可以一键操作（推荐、暂停、移除）

**交付物：**

| 文件路径 | 组件 | 说明 |
|---------|------|------|
| `/app/merchant/creators/[creatorId]/page.tsx` | Creator 个人资料页 | 该创作者的历史数据 |
| `/components/merchant/CreatorStats.tsx` | 创作者 KPI 卡片 | 该创作者的贡献度、ROI 等 |
| `/components/merchant/CreatorActionMenu.tsx` | 操作菜单 | 推荐、暂停、移除等快速操作 |

**UI 规范：**

- Creator 头像：圆形 (`rounded-full`)，边框 Steel Blue
- 操作按钮：
  - 推荐（Green）
  - 暂停（Amber）
  - 移除（Red）

**完成标准：**

- ✅ Creator 个人资料页能加载
- ✅ 所有操作按钮可点击，弹出确认对话框
- ✅ 操作成功后实时刷新数据

---

### Week 10-12：波兰 + QA + 部署

**目标：** 打磨所有商家页面细节，通过完整 E2E 测试

**任务：**

1. **视觉一致性检查：**
   - 所有页面字体统一（Darky/CS Genio Mono）
   - 所有颜色严格遵循 Design.md（无临时色值）
   - 所有间距都是 8px 的倍数

2. **交互打磨：**
   - 所有按钮加 hover 效果（背景色变浅/深）
   - 加载状态（skeleton loading）
   - 错误状态处理（显示友好的错误提示）

3. **性能检查：**
   - 跑 Lighthouse 审计
   - 图表大数据集下性能测试（>1000 records）

4. **跨浏览器测试：**
   - Chrome/Safari/Firefox
   - Mobile Safari (iPad/iPhone)

**交付清单：**

- [ ] 所有 .tsx 文件通过 ESLint（无 warning）
- [ ] 所有样式通过 Tailwind purge 检查
- [ ] 所有图表数据格式正确（无 NaN/undefined）
- [ ] 所有表单输入有 validation + 错误提示
- [ ] 移动端布局完美（Tailwind `md:` breakpoint）
- [ ] 无 console 报错
- [ ] 无内存泄漏（React DevTools Profiler）

---

## 4. Jiaming 的周度任务—Admin + Creator + 后端

### Week 1：数据库 Schema + 后端框架

**目标：** Supabase 中创建所有新表，后端 API 框架就位

**交付物：**

| 文件 | 说明 |
|------|------|
| `/migrations/001_loyalty_cards.sql` | 推荐人卡表 |
| `/migrations/002_ai_accuracy_audits.sql` | AI 验证审计表 |
| `/migrations/003_merchant_metrics_weekly.sql` | 商家周报表 |
| `/migrations/004_creator_recruitment_funnel.sql` | 创作者招募漏斗表 |
| `/migrations/005_claim_appeals.sql` | Appeal 申诉表 |
| `/migrations/006_neighborhood_profiles.sql` | 邻域档案表 |
| `/lib/db/migrations.ts` | 迁移运行脚本 |
| `/api/health.ts` | Health check endpoint |

**数据库 Schema（详见 V5_2_IMPROVEMENTS_SPECIFICATION.md §4）：**

关键表：
- `loyalty_cards` (id, customer_id, creator_id, merchant_id, stamp_count, redeemed_at, created_at)
- `ai_accuracy_audits` (id, week_number, total_auto_verified, false_positive_count, false_positive_rate, manual_approved, audit_date)
- `merchant_metrics_weekly` (id, merchant_id, week_start, verified_customers, total_revenue, roi, created_at)
- `creator_recruitment_funnel` (id, creator_id, tier, status, recruitment_source, signed_date)
- `claim_appeals` (id, creator_id, merchant_id, claim_id, appeal_reason, status, reviewed_at)
- `neighborhood_profiles` (id, neighborhood_name, monthly_target_arr, pricing_tier, seasonality_factor)

**后端框架：**

```
/api/
  /admin/
    /dashboard.ts          (GET: live metrics for investors)
    /merchants/[id].ts     (CRUD merchants)
    /creators/[id].ts      (CRUD creators)
    /claims/[id]/appeals.ts (Appeal workflow)
  /merchant/
    /reports/weekly.ts     (GET: weekly report)
    /appeals.ts            (GET/POST appeals)
  /creator/
    /profile.ts            (GET/PATCH creator profile)
    /campaigns.ts          (GET: assigned campaigns)
  /internal/
    /ai-verify.ts          (POST: verify customer claim)
    /recruitment-sync.ts   (POST: sync funnel status)
/lib/services/
  - AIVerificationService.ts
  - WeeklyMerchantReportService.ts
  - CreatorRecruitmentService.ts
```

**完成标准：**

- ✅ 所有 SQL migration 跑成功（`npm run migrate`）
- ✅ Supabase 中表和索引都创建了
- ✅ `/api/health` 返回 200 OK
- ✅ Clerk 与 Supabase Auth 集成成功（creator login 有效）

---

### Week 2-3：AI 验证服务 + 后端核心

**目标：** AI 验证流程完整，Appeal 机制工作

**交付物：**

| 文件 | 说明 |
|------|------|
| `/lib/services/AIVerificationService.ts` | 核心验证逻辑 |
| `/api/internal/ai-verify.ts` | 验证 endpoint |
| `/api/claims/[id]/appeals.ts` | Appeal CRUD |
| `/lib/services/ClaimAppealService.ts` | Appeal 处理逻辑 |
| `/lib/hooks/useVerifiedClaims.ts` | Frontend hook（Jiaming 也做） |

**AIVerificationService 需求：**

```typescript
class AIVerificationService {
  // 验证客户声明
  async verifyCustomerClaim(claim: VerifiedCustomerClaim): Promise<VerificationResult> {
    // 1. Vision 分析（拍照）
    const visionScore = await this.visionAnalysis(claim.photo_url);
    
    // 2. OCR 分析（收据）
    const ocrScore = await this.ocrAnalysis(claim.receipt_url);
    
    // 3. Geo 分析（地理位置）
    const geoScore = await this.geoAnalysis(claim.merchant_lat, claim.merchant_lon);
    
    // 4. 综合决策
    const finalScore = (visionScore + ocrScore + geoScore) / 3;
    
    if (finalScore >= 0.85) return 'auto_verified';
    if (finalScore >= 0.65) return 'manual_review_required';
    return 'rejected';
  }
  
  // Vision 分析
  private async visionAnalysis(photoUrl: string): Promise<number> {
    // 使用 Google Cloud Vision API
    // 返回 0-1 分数
  }
  
  // OCR 分析
  private async ocrAnalysis(receiptUrl: string): Promise<number> {
    // 使用 Google Cloud Vision OCR
    // 检查金额、时间、商家名称
  }
  
  // Geo 分析
  private async geoAnalysis(lat: number, lon: number): Promise<number> {
    // 检查 GPS 坐标是否在商家 geofence 内
  }
}
```

**API 端点：**

```
POST /api/internal/ai-verify
请求体：
{
  "claim_id": "uuid",
  "photo_url": "s3://...",
  "receipt_url": "s3://...",
  "merchant_lat": 40.7128,
  "merchant_lon": -74.0060,
  "creator_id": "uuid"
}

返回：
{
  "status": "auto_verified" | "manual_review_required" | "rejected",
  "confidence_score": 0.87,
  "reasoning": "Vision: 0.92, OCR: 0.85, Geo: 0.84"
}
```

**Appeal 机制：**

```typescript
// /api/claims/[id]/appeals.ts
POST: 创作者提交申诉
请求体：
{
  "claim_id": "uuid",
  "appeal_reason": "Photo unclear but I was definitely there",
  "supporting_evidence_url": "s3://..."
}

返回：
{
  "appeal_id": "uuid",
  "status": "submitted",
  "review_sla_hours": 24
}

GET: 查询申诉状态
返回：
{
  "appeal_id": "uuid",
  "status": "submitted" | "under_review" | "approved" | "rejected",
  "merchant_decision": "approved",
  "decision_reason": "...",
  "resolved_at": "2026-04-25T..."
}
```

**完成标准：**

- ✅ AIVerificationService 单元测试覆盖率 ≥ 80%
- ✅ API 端点能接收请求、返回正确的 JSON
- ✅ Appeal 工作流可以完整走通（提交 → 商家看到 → 商家同意/拒绝 → 状态更新）
- ✅ 数据库 claim_appeals 表有正确的数据

---

### Week 4-5：Merchant Weekly Report Service + Creator Recruitment

**目标：** 自动化周报生成，创作者招募漏斗完整

**交付物：**

| 文件 | 说明 |
|------|------|
| `/lib/services/WeeklyMerchantReportService.ts` | 周报生成逻辑 |
| `/lib/services/CreatorRecruitmentService.ts` | 创作者招募逻辑 |
| `/api/merchant/reports/weekly.ts` | 周报 API |
| `/api/internal/recruitment-sync.ts` | 招募漏斗同步 |
| `/jobs/weekly-report-job.ts` | Bull Queue job（每周五 9pm 自动跑） |

**WeeklyMerchantReportService：**

```typescript
class WeeklyMerchantReportService {
  // 生成本周商家报告
  async generateWeeklyReport(merchant_id: string, week_start: Date): Promise<MerchantReport> {
    // 1. 计算本周 verified_customers
    const verifiedCount = await this.getVerifiedCustomersCount(merchant_id, week_start);
    
    // 2. 计算本周 revenue
    const revenue = await this.getWeeklyRevenue(merchant_id, week_start);
    
    // 3. 计算 ROI = (revenue - acquisition_cost) / acquisition_cost * 100
    const acquisitionCost = await this.getAcquisitionCost(merchant_id);
    const roi = (revenue - acquisitionCost) / acquisitionCost * 100;
    
    // 4. 获取 Top 5 creators
    const topCreators = await this.getTopCreators(merchant_id, week_start, 5);
    
    // 5. 生成邮件
    const email = this.formatReportEmail(merchant, verifiedCount, revenue, roi, topCreators);
    
    // 6. 发送邮件（用 SendGrid）
    await sendEmail(merchant.email, 'Weekly Report', email);
    
    // 7. 保存到数据库
    return this.saveReport({ merchant_id, week_start, verified_customers: verifiedCount, total_revenue: revenue, roi });
  }
}
```

**CreatorRecruitmentService：**

```typescript
class CreatorRecruitmentService {
  // Tier 1：直接招募（来自 team network）
  async createTier1Creator(creator: CreatorProfile): Promise<CreatorTier1> {
    const tier1 = { ...creator, tier: 1, status: 'active', recruitment_source: 'direct_network' };
    return this.db.insert('creator_recruitment_funnel', tier1);
  }
  
  // Tier 2：社区参与（来自 community/referral）
  async createTier2Creator(creator: CreatorProfile): Promise<CreatorTier2> {
    const tier2 = { ...creator, tier: 2, status: 'prospect', recruitment_source: 'community' };
    return this.db.insert('creator_recruitment_funnel', tier2);
  }
  
  // Tier 3：激励驱动（来自 paid cohort）
  async createTier3Creator(creator: CreatorProfile): Promise<CreatorTier3> {
    const tier3 = { ...creator, tier: 3, status: 'prospect', recruitment_source: 'incentive' };
    return this.db.insert('creator_recruitment_funnel', tier3);
  }
  
  // 升级逻辑：T1→T2→T3 based on performance
  async upgradeCreatorTier(creator_id: string): Promise<void> {
    const current = await this.getCreator(creator_id);
    if (current.tier < 3 && current.performance_score >= tier_upgrade_threshold[current.tier]) {
      await this.db.update('creator_recruitment_funnel', { tier: current.tier + 1 }, { id: creator_id });
    }
  }
}
```

**Bull Queue 定时任务：**

```typescript
// /jobs/weekly-report-job.ts
const reportQueue = new Queue('weekly-reports');

// 每周五 21:00 执行
reportQueue.process('generate-weekly-reports', async (job) => {
  const merchants = await getAllMerchants();
  for (const merchant of merchants) {
    const service = new WeeklyMerchantReportService();
    await service.generateWeeklyReport(merchant.id, getWeekStart(new Date()));
  }
});

// 在 App 启动时注册 cron
scheduleJob('0 21 * * 5', () => {
  reportQueue.add('generate-weekly-reports', {});
});
```

**完成标准：**

- ✅ 周报邮件能正确生成（可以在 SendGrid dashboard 看到）
- ✅ 创作者招募三个 tier 的创建逻辑都工作
- ✅ Tier 升级逻辑有单元测试
- ✅ Bull Queue job 在指定时间执行（可用 console.log 验证）

---

### Week 6-7：Admin 仪表板 + Live Metrics

**目标：** Admin 能看到实时投资者指标，Demo Day 用的仪表板就位

**交付物：**

| 文件 | 说明 |
|------|------|
| `/app/admin/dashboard/page.tsx` | Admin 仪表板主页（Jiaming 做 UI） |
| `/components/admin/LiveMetricsCard.tsx` | 实时 KPI 卡片（Jiaming 做 UI） |
| `/components/admin/InvestorVerificationPackage.tsx` | 投资者验证包（Jiaming 做 UI） |
| `/api/admin/dashboard.ts` | Dashboard API（Jiaming 做后端） |
| `/lib/services/MetricsService.ts` | 指标计算（Jiaming 做后端） |

**Admin Dashboard 应显示的指标（实时，5分钟更新）：**

```
┌─────────────────────────────────────────────┐
│  Push Admin Dashboard                       │
├─────────────────────────────────────────────┤
│ 🟢 Active Merchants: 12                     │
│ 🟢 Active Creators: 80                      │
│ 🟢 Monthly Verified Customers: 487          │
│ 🟢 Monthly MRR: $12,450                     │
│ 🟢 AI Accuracy: 88.3%                       │
│ 🟢 SLR (Software Leverage Ratio): 16.5      │
│ 🟢 CAC Payback Period: 3.2 months           │
│ 🟢 Merchant Churn Rate: 5.2%                │
└─────────────────────────────────────────────┘
```

**UI 规范（Admin 专用，可用 Deep Space Blue）：**

- 卡片背景：White
- 标题：Deep Space Blue
- 数值：Molten Lava（红色，表示 important）
- 趋势箭头：Green (↑) / Red (↓)

**投资者验证包：**

```typescript
interface InvestorVerificationPackage {
  created_at: Date;
  metrics: {
    merchants: number;
    creators: number;
    verified_customers: number;
    monthly_mrr: number;
    ai_accuracy: number;
    ltv_cac_ratio: number;
  };
  proof: {
    supabase_db_snapshot: string; // 数据库备份链接
    stripe_mrr_report: string;    // Stripe 收入报告
    email_list: string[];;        // 所有创作者邮箱（去重）
  };
  signed_by: string; // Admin 签字
  signed_at: Date;
}
```

**完成标准：**

- ✅ Dashboard 页面加载正确，所有数字准确
- ✅ 5 分钟内指标自动刷新（使用 setInterval 或 Socket.io）
- ✅ 投资者验证包能生成（导出为 PDF）
- ✅ 响应式设计完美

---

### Week 8-9：Creator App 页面 + Loyalty Card 前端

**目标：** Creator 能登陆看到自己的 campaigns，Consumer 能看到 loyalty card 进度

**交付物：**

| 文件 | 说明 |
|------|------|
| `/app/creator/dashboard/page.tsx` | Creator Dashboard（Jiaming 做 UI） |
| `/components/creator/CampaignCard.tsx` | Campaign 卡片（可复用） |
| `/components/creator/LoyaltyCardWidget.tsx` | Loyalty card 展示（Jiaming 做 UI） |
| `/app/consumer/loyalty-card/[cardId]/page.tsx` | Consumer loyalty card 详情页（Jiaming 做 UI） |
| `/lib/hooks/useCreatorCampaigns.ts` | 创作者 campaigns hook（Jiaming 做） |

**Creator Dashboard 布局：**

```
┌──────────────────────────────────┐
│  Creator Home                    │
│  Hi, [Creator Name]!             │
├──────────────────────────────────┤
│ My Performance                   │
│ ├─ This Month: $1,250 earned     │
│ ├─ Conversion Rate: 12.3%        │
│ ├─ Customers Acquired: 45        │
│ └─ Tier: T2 (可升级至 T3)        │
├──────────────────────────────────┤
│ Active Campaigns                 │
│ ├─ [Merchant 1] Coffee Shop      │
│ │  Status: Running (5 days)      │
│ │  Customers: 23 | Earned: $575  │
│ │  [View Details]                │
│ ├─ [Merchant 2] Bakery           │
│ │  Status: Running (2 days)      │
│ │  Customers: 12 | Earned: $300  │
│ └─ [View Details]                │
├──────────────────────────────────┤
│ Referral Loyalty Cards           │
│ ├─ [Customer 1] Progress: ⬜⬜⬜ │
│ ├─ [Customer 2] Progress: ⬜⬜  │
│ └─ [View All]                    │
└──────────────────────────────────┘
```

**Consumer Loyalty Card 页面：**

```
┌──────────────────────────────────────┐
│  Your Loyalty Card                   │
│  ☕ Coffee Shop X Rewards            │
├──────────────────────────────────────┤
│ Progress: 7 / 10 stamps              │
│ ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜              │
├──────────────────────────────────────┤
│ Referred by: [Creator Name]          │
│ Created: Apr 18, 2026                │
├──────────────────────────────────────┤
│ [Unlock Reward] (disabled until 10)  │
│                                      │
│ Show this code to barista:           │
│ ┌──────────────────┐                │
│ │   QR Code        │                │
│ │   (scan to add   │                │
│ │    stamp)        │                │
│ └──────────────────┘                │
└──────────────────────────────────────┘
```

**Loyalty Card 数据流：**

1. Creator 被分配到商家的 campaign
2. Creator 与 customer 分享 referral link （或 QR code）
3. Customer 在商家扫码，系统创建 `loyalty_card` 记录
4. 每次消费，customer 扫码 → `stamp_count` += 1
5. 达到 10 stamps → 可兑换奖励（折扣/免费饮品）

**完成标准：**

- ✅ Creator Dashboard 加载正确，campaign 列表准确
- ✅ Loyalty Card 详情页能显示 progress bar
- ✅ QR code 生成正确（使用 `qrcode.react` npm package）
- ✅ Stamp 递增逻辑工作（点击 mock "add stamp" 按钮）

---

### Week 10-12：集成测试 + 部署 + 优化

**目标：** 所有功能整合，通过端到端测试，准备上线

**任务：**

1. **集成测试（E2E）：**
   - Creator 登陆 → 创建 campaign → customer 扫码 → loyalty card 更新
   - Merchant 登陆 → 看到 weekly report → 点击 appeal → creator 看到 appeal → merchant 同意
   - Admin 看仪表板 → 指标实时更新 → 导出投资者包

2. **性能测试：**
   - 1000+ merchants 同时拉数据时响应时间 < 500ms
   - Dashboard 页面加载时间 < 2s

3. **安全审计：**
   - SQL injection（Supabase 会自动防护）
   - XSS（Tailwind/React 已防护）
   - CORS 配置正确

4. **部署：**
   - Staging 环境部署完整测试
   - 创建 DB 备份
   - 准备 rollback 脚本

**测试清单（Lucy 主导）：**

- [ ] Creator signup → activate → earn money（完整路径）
- [ ] Merchant onboarding → view dashboard → 1st paying customer
- [ ] Consumer 扫码 → loyalty card 创建 → stamp increment
- [ ] Merchant appeal → creator 升级 → commission 调整
- [ ] Admin 数据导出 → PDF 正确生成
- [ ] 大数据集性能测试（10K+ records）
- [ ] 移动端全流程测试

**部署清单：**

- [ ] 所有代码通过 code review
- [ ] 所有测试通过（Jest + Cypress）
- [ ] Staging 环境稳定运行 24 小时
- [ ] Production DB backup 完成
- [ ] Rollback 脚本已备好
- [ ] 监控告警已配置（错误率、响应时间）
- [ ] 团队 demo 日期确认

---

## 5. 支持角色—Lucy/Prum

### Lucy（QA + DevOps）

**周度职责：**

| 周 | 任务 |
|----|------|
| W1 | 环境检查 + 本地测试环境搭建 |
| W2-3 | 单元测试覆盖率审计（Jest） |
| W4-5 | 集成测试编写（Cypress） |
| W6-7 | 性能测试 + Lighthouse 审计 |
| W8-9 | 移动端 E2E 测试 |
| W10-12 | 最终 QA + 部署脚本 |

**每周交付：**
- 测试报告（通过/失败/待修复）
- 性能指标（LCP/FID/CLS）
- 部署状态报告

### Prum/Milly（产品验证 + 数据）

**周度职责：**

| 周 | 任务 |
|----|------|
| W1-2 | Pilot 数据收集（Williamsburg 5 家咖啡店） |
| W3-4 | 商家反馈采集 + weekly report 验证 |
| W5-6 | Creator 招募漏斗数据 + tier 分布统计 |
| W7-8 | AI accuracy 指标验证（manual audit） |
| W9-10 | Neighborhood playbook 数据准备 |
| W11-12 | 融资数据包整理 |

**每周交付：**
- 商家满意度反馈
- Creator 激活指标
- AI 精度审计报告
- 收入/CAC 追踪

---

## 6. 共享开发规范

### 6.1 代码风格

**必须遵守：**

```typescript
// ✅ 好的代码
const useMerchantMetrics = (merchantId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['merchant', merchantId],
    queryFn: () => fetchMerchantMetrics(merchantId),
  });
  return { data, isLoading };
};

// ❌ 不好的代码
const useMerchantMetrics = (id) => {
  return fetch(`/api/merchant/${id}`).then(r => r.json());
};
```

**ESLint 规则：**
- 缩进：2 空格
- 分号：必须
- 引号：单引号优先
- 无 console.log（生产代码）

### 6.2 Git 提交规范

```
feat: Add weekly report widget
fix: Correct AI verification threshold
style: Update merchant dashboard colors
refactor: Extract MetricsCard component
test: Add E2E test for loyalty card flow
docs: Update API documentation

[注] 每个 commit 对应一个完整的功能，不要拆碎
```

### 6.3 分支管理

```
main（生产）
  ↑
staging（集成测试）
  ↑
feature/week-X-Z-dashboard
feature/week-X-jiaming-backend
```

每周五 17:00 merge feature → staging，周日晚 merge staging → main（如果 QA 通过）。

### 6.4 文件命名

```
组件：PascalCase（DashboardHeader.tsx）
hooks：camelCase with use prefix（useMerchantMetrics.ts）
utils：camelCase（formatCurrency.ts）
types：PascalCase（Merchant.ts）
```

### 6.5 数据类型定义

所有 API 响应都必须有 TypeScript 接口：

```typescript
// /types/merchant.ts
export interface MerchantMetricsWeekly {
  week_start: Date;
  verified_customers: number;
  total_revenue: number;
  roi: number;
  top_creators: CreatorSummary[];
}

export interface CreatorSummary {
  id: string;
  name: string;
  contribution_pct: number;
}
```

---

## 7. 交付标准与质量检查

### 7.1 每周五 Code Review Checklist

**Z 提交的商家页面：**

- [ ] UI 100% 遵循 Design.md（颜色、字体、间距）
- [ ] 响应式测试通过（desktop/tablet/mobile）
- [ ] Lighthouse score ≥ 80
- [ ] 无 console 错误
- [ ] 所有样式硬编码改为 Tailwind class
- [ ] 图表/表格数据格式正确（无 NaN、currency 格式统一）

**Jiaming 提交的后端 + Admin UI：**

- [ ] API 有完整的 TypeScript 接口
- [ ] 数据库查询加了索引（性能考虑）
- [ ] 错误处理完整（try-catch + 返回友好的错误消息）
- [ ] 敏感数据不 log（密码、token）
- [ ] 单元测试覆盖率 ≥ 70%

**Lucy 的 QA 验证：**

- [ ] 完整功能流可以走通
- [ ] 数据库数据准确（无重复、无 NULL）
- [ ] 性能指标达标（响应时间、加载速度）
- [ ] 移动端无破裂

### 7.2 部署前清单

**所有代码提交到 main 前：**

- [ ] Staging 环境测试通过（完整 E2E）
- [ ] DB migration 已备份
- [ ] Rollback 脚本已准备
- [ ] Monitoring/alerts 已配置
- [ ] 团队所有人 Slack 通知已发
- [ ] Commit message 有完整 description

### 7.3 每月审计

**每个月月初（下一个月初）：**

- 检查 Design.md 是否需要更新（新增颜色、组件等）
- 检查 TypeScript types 是否需要拓展
- 检查 API 契约是否有 breaking change
- 检查代码覆盖率趋势

---

## 8. 常见问题与故障排除

### Q1：我的 Supabase 连接失败

**排查步骤：**

1. 检查 `.env.local` 中 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是否正确
2. 运行 `npx supabase status`，确认本地 Supabase 容器运行
3. 如果用的是 cloud Supabase，检查网络连接 + IP whitelist

### Q2：我的样式不符合 Design.md

**解决方案：**

1. 打开 Design.md，找到相应的组件
2. 复制 Tailwind class 列表
3. 用 Find & Replace 更换你的代码中的颜色值（e.g., `bg-red-500` → `bg-[#c1121f]`）
4. 运行 `npm run lint:fix` 自动修复

### Q3：API 返回 500 错误

**调试步骤：**

1. 检查 server 日志（`npm run dev` 的终端输出）
2. 检查 Supabase 数据库是否有相关表
3. 检查 API 请求体格式（JSON schema）
4. 用 Postman 或 curl 直接测试 API

### Q4：我的创建时间不对

**常见原因：**

- 数据库时区设置（应该是 UTC）
- JavaScript Date 对象时区问题（用 `new Date().toISOString()` 发送给服务器）
- 前端显示时区（用用户本地时区显示，但存储 UTC）

---

## 9. 快速参考

### 9.1 技术栈速查

| 层 | 技术 | 版本 |
|----|------|------|
| 前端框架 | Next.js | 14+ |
| CSS | Tailwind | 3.3+ |
| UI 库 | shadcn/ui | - |
| 图表 | Recharts | 2.5+ |
| 状态管理 | Zustand / React Query | - |
| 数据库 | Supabase (PostgreSQL) | - |
| 认证 | Clerk + Supabase Auth | - |
| 后台任务 | Bull Queue | - |
| 邮件 | SendGrid | - |
| 云存储 | AWS S3 | - |

### 9.2 关键环境变量

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
SENDGRID_API_KEY=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### 9.3 常用命令

```bash
# 开发
npm run dev

# 类型检查
npm run type-check

# Lint 检查
npm run lint

# 自动修复
npm run lint:fix

# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 部署到 staging
npm run deploy:staging

# 部署到生产
npm run deploy:prod
```

---

## 10. 联系方式与支持

**技术问题：** #engineering Slack 频道  
**设计问题：** @Milly（Design lead）  
**数据问题：** @Prum（Analytics）  
**紧急问题：** @Jiaming（CTO）

---

**文档版本历史：**

| 版本 | 日期 | 更新 |
|------|------|------|
| v5.2.0 | 2026-04-19 | 初始版本，周度计划完成 |

**下一次审视日期：** 2026-05-03（Week 3 周末）
