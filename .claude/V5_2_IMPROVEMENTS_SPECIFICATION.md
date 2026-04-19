# Push v5.2 — 改进方案详细规范与执行计划

**文档版本：** v5.2.0  
**创建日期：** 2026-04-18  
**目标交付：** 12 周完整实现（Week 1-12）  
**受众：** Claude Code 开发者 + Team（Z, Jiaming, Admin, Creator）

---

## 📋 目录

1. v5.2 总体架构
2. 7 大解决方案详细规范
3. 人员分工与技术栈
4. 数据模型设计
5. API 设计清单
6. UI/UX 规范
7. 周度执行计划
8. 交付标准与 QA

---

## 1. v5.2 总体架构

### 核心改进目标
- ✅ 补全消费者体验（推荐人卡）
- ✅ 强化商家续约能力（Dashboard + Playbook）
- ✅ 优化创作者供给（3层招募漏斗）
- ✅ 降低 AI 风险（精度管理 + Appeal）
- ✅ 准备融资材料（Live metrics）

### 技术栈确认
```
Frontend:
  - Next.js 14 (App Router)
  - Tailwind CSS
  - Recharts (Dashboard charts)
  - React Query (Data fetching)

Backend:
  - Supabase (PostgreSQL + Auth + Realtime)
  - Edge Functions (Deno)
  - Clerk (Creator auth)

新增工具:
  - Socket.io (Live metrics updates)
  - Bull Queue (Background jobs for accuracy audit)
```

### 核心数据库表（v5.2新增）
```sql
-- 新增或修改的表

-- 推荐人卡相关
CREATE TABLE loyalty_cards (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  stamp_count INT DEFAULT 0,
  created_at TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES creators(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

-- 验证精度审计
CREATE TABLE ai_accuracy_audits (
  id UUID PRIMARY KEY,
  week_number INT,
  total_auto_verified INT,
  false_positive_count INT,
  false_negative_count INT,
  false_positive_rate DECIMAL(5,2),
  manual_approved INT,
  manual_rejected INT,
  creator_appeals INT,
  audit_date TIMESTAMP,
  notes TEXT
);

-- Merchant Dashboard 实时数据
CREATE TABLE merchant_metrics_weekly (
  id UUID PRIMARY KEY,
  merchant_id UUID NOT NULL,
  week_start DATE,
  verified_customers INT,
  total_revenue DECIMAL(10,2),
  creator_count INT,
  roi DECIMAL(5,2),
  created_at TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

-- Creator recruitment tracking
CREATE TABLE creator_recruitment_funnel (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL,
  tier INT (1-3), -- Tier 1/2/3
  status VARCHAR (prospect/early_operator/active/churn),
  signed_date TIMESTAMP,
  first_campaign_date TIMESTAMP,
  performance_score DECIMAL(5,2),
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

-- Appeal 流程
CREATE TABLE claim_appeals (
  id UUID PRIMARY KEY,
  transaction_id UUID NOT NULL,
  appealer_type VARCHAR (merchant/creator),
  appeal_reason TEXT,
  evidence_url VARCHAR,
  status VARCHAR (pending/approved/rejected),
  resolved_at TIMESTAMP,
  resolved_by_user_id UUID,
  FOREIGN KEY (transaction_id) REFERENCES verified_customers(id)
);

-- Neighborhood profile matrix
CREATE TABLE neighborhood_profiles (
  id UUID PRIMARY KEY,
  name VARCHAR (e.g., "Williamsburg"),
  population INT,
  median_age INT,
  avg_aov DECIMAL(8,2),
  seasonal_factor DECIMAL(3,2), -- 季节性系数，冬季0.75
  estimated_merchants INT,
  estimated_mrr DECIMAL(10,2),
  payback_months INT,
  status VARCHAR (planning/pilot/active/scaling),
  launch_date TIMESTAMP
);
```

---

## 2. 7 大解决方案详细规范

### 方案 1: 消费者激励层（推荐人卡）

#### 2.1.1 业务逻辑

```
顾客进店流程：

1. 菜单上 QR 码（设计规范见下）
   └─ 指向 push.app/loyalty/scan/[merchant_code]

2. 顾客扫码
   ├─ 识别 merchant + 推荐 creator
   ├─ 弹窗："你是由 @tara (T3 Creator) 推荐来的吗？"
   ├─ 顾客确认 → 手机号 + 同意条款
   └─ 获得虚拟推荐人卡

3. 首次消费
   ├─ 系统自动识别该顾客（手机号 lookup）
   ├─ 顾客 receipt 金额 ≥ $15 → 自动获得 1 stamp
   ├─ UI: 卡面显示 [推荐人头像] [1/5 stamps]
   └─ 推送给 creator: "你推荐的顾客已到访并消费"

4. 回访
   ├─ 第二次来店，系统再次识别
   ├─ receipt ≥ $15 → +1 stamp
   ├─ 5 stamps 达成 → 可兑换 free item（商家选定，如 free coffee）
   └─ 推送给 creator: "你的推荐转化为回头客"

5. Creator 侧反馈
   ├─ Day 1: 推荐被接受 notification
   ├─ Day 7: 2 人已回访
   ├─ Day 30: "你的 8 个推荐产生 $200 商家收入，你获得 $80"
   └─ Creator app 显示推荐人卡排行榜
```

#### 2.1.2 数据模型

```typescript
// loyalty_cards.ts

interface LoyaltyCard {
  id: string;
  customer_id: string; // 顾客手机号 hash
  creator_id: string;
  merchant_id: string;
  created_at: Date;
  
  // 卡片状态
  stamp_count: number; // 0-5
  redeemed_at?: Date; // 兑换时间
  
  // 关联的购买
  purchases: PurchaseRecord[];
}

interface PurchaseRecord {
  id: string;
  loyalty_card_id: string;
  merchant_id: string;
  amount: number; // receipt 金额
  recorded_at: Date;
  stamp_awarded: boolean; // 是否达到 $15 门槛
}

interface CreatorRecommendationMetrics {
  creator_id: string;
  week_start: Date;
  
  // 推荐数据
  total_recommendations: number;
  accepted_count: number; // 顾客扫码确认
  first_visit_count: number;
  repeat_visit_count: number;
  revenue_generated: number;
  creator_payout: number;
  
  // Engagement
  avg_stamp_count: number; // 平均获得多少 stamp
}
```

#### 2.1.3 API 设计

```
POST /api/loyalty/scan
  Request:
    {
      merchant_code: string,
      creator_id: string,
      customer_phone: string (opt)
    }
  Response:
    {
      card_id: string,
      merchant_name: string,
      creator_name: string,
      creator_avatar: string,
      stamp_count: number
    }

POST /api/loyalty/redeem
  Request:
    {
      card_id: string,
      reward_type: "free_coffee" | "free_item"
    }
  Response:
    {
      success: boolean,
      reward_claim_code: string,
      expires_at: Date
    }

GET /api/loyalty/cards/:card_id
  Response:
    {
      card: LoyaltyCard,
      purchases: PurchaseRecord[],
      reward_status: "in_progress" | "redeemable" | "redeemed"
    }

GET /api/creators/:creator_id/recommendations
  Response:
    {
      week_metrics: CreatorRecommendationMetrics[],
      total_revenue_this_month: number,
      total_payout_this_month: number
    }
```

#### 2.1.4 前端规范（Z 负责 - 商家页面）

**QR 码设计**
```
菜单上 QR 码样式:
┌─────────────────┐
│   [Logo]        │
│ 你是从 @tara    │
│ 推荐来的吗？    │
│                 │
│   [QR CODE]     │
│                 │
│ 扫码获得优惠卡  │
└─────────────────┘

文件：components/merchant/qr-code-card.tsx
- Size: 200px × 250px
- Styling: Brand colors (Flag Red #c1121f for border)
- QR内容: push.app/loyalty/scan/{merchant_code}?creator={creator_id}
```

**商家 Dashboard 上的推荐卡数据**
```
文件：app/merchant/dashboard/loyalty-section.tsx

显示内容:
┌─────────────────────────┐
│ 📊 推荐人卡效果 (本周)  │
├─────────────────────────┤
│ 扫码人数: 12            │
│ 首次到访: 8             │
│ 回头客: 3               │
│ 兑换奖励: 1             │
│ 推荐人卡收入: $200      │
│                         │
│ Top 3 推荐人:          │
│ 1. @tara: 5人 → $120   │
│ 2. @joe: 2人 → $50     │
│ 3. @mia: 1人 → $25     │
└─────────────────────────┘
```

#### 2.1.5 后端实现（Jiaming 负责 - Admin）

**Loyalty Card 创建与追踪**
```typescript
// services/loyalty-service.ts

export class LoyaltyService {
  async createCard(
    merchantId: string,
    creatorId: string,
    customerPhone: string
  ): Promise<LoyaltyCard> {
    // 去重：检查是否已有同样的 card
    const existing = await supabase
      .from('loyalty_cards')
      .select()
      .eq('customer_phone_hash', hash(customerPhone))
      .eq('merchant_id', merchantId)
      .single();
    
    if (existing) return existing; // 返回已有卡片
    
    // 创建新卡
    const card = await supabase
      .from('loyalty_cards')
      .insert({
        customer_phone_hash: hash(customerPhone),
        creator_id: creatorId,
        merchant_id: merchantId,
        stamp_count: 0,
        created_at: new Date()
      })
      .single();
    
    // 触发 notification 给 creator
    await this.notifyCreator(creatorId, 'recommendation_accepted', {
      merchant_name: await getMerchantName(merchantId),
      card_id: card.id
    });
    
    return card;
  }

  async recordPurchase(
    cardId: string,
    amount: number,
    receiptImage?: string
  ): Promise<void> {
    const card = await supabase
      .from('loyalty_cards')
      .select()
      .eq('id', cardId)
      .single();
    
    // 添加 purchase record
    await supabase
      .from('purchase_records')
      .insert({
        loyalty_card_id: cardId,
        merchant_id: card.merchant_id,
        amount,
        receipt_image_url: receiptImage,
        recorded_at: new Date()
      });
    
    // 检查是否达到 stamp 门槛 ($15)
    if (amount >= 15) {
      const newStampCount = card.stamp_count + 1;
      
      await supabase
        .from('loyalty_cards')
        .update({ stamp_count: newStampCount })
        .eq('id', cardId);
      
      // 检查是否达到 5 stamps
      if (newStampCount === 5) {
        await this.notifyCustomer(cardId, 'reward_ready', {
          reward_type: 'free_item'
        });
        await this.notifyCreator(card.creator_id, 'conversion_complete', {
          reward_type: 'free_item',
          customer_card_id: cardId
        });
      } else {
        await this.notifyCustomer(cardId, 'stamp_earned', {
          stamps: newStampCount,
          remaining: 5 - newStampCount
        });
      }
    }
  }

  async getWeeklyMetrics(
    creatorId: string,
    weekStart: Date
  ): Promise<CreatorRecommendationMetrics> {
    const weekEnd = addDays(weekStart, 7);
    
    const cards = await supabase
      .from('loyalty_cards')
      .select(`
        id,
        merchant_id,
        stamp_count,
        purchase_records (amount, recorded_at)
      `)
      .eq('creator_id', creatorId)
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString());
    
    // 计算指标
    const totalRecommendations = cards.length;
    const firstVisitCount = cards.filter(c => c.purchase_records?.length > 0).length;
    const repeatVisitCount = cards.filter(c => c.purchase_records?.length > 1).length;
    const totalRevenue = cards.reduce((sum, c) => 
      sum + (c.purchase_records?.reduce((s: number, p: any) => s + p.amount, 0) || 0)
    , 0);
    
    const creatorPayment = totalRevenue * 0.4; // 40% payout
    
    return {
      creator_id: creatorId,
      week_start: weekStart,
      total_recommendations: totalRecommendations,
      accepted_count: cards.length,
      first_visit_count: firstVisitCount,
      repeat_visit_count: repeatVisitCount,
      revenue_generated: totalRevenue,
      creator_payout: creatorPayment,
      avg_stamp_count: cards.reduce((sum, c) => sum + c.stamp_count, 0) / cards.length
    };
  }
}
```

---

### 方案 2: Merchant Retention Playbook

#### 2.2.1 业务逻辑

```
每周一 09:00 自动执行：

1. 数据收集（自动）
   ├─ Last 7 days verified customers
   ├─ Revenue calculation
   ├─ Creator breakdown
   ├─ ROI calculation (revenue / creator payout)
   └─ Trend vs previous week

2. 周报邮件发送
   ├─ 收件人：merchant_email
   ├─ 主题："{Merchant Name}, 上周你赚了 ${revenue} from Push"
   ├─ 内容：见邮件模板（下）
   └─ CTA：Dashboard link

3. Merchant 反馈分流
   ├─ 点击 Dashboard → 进入 page
   ├─ 选择"继续" → 标记为 satisfied
   ├─ 选择"需要调整" → 触发 Jiaming escalation call
   ├─ 选择"pause" → 触发 Prum 理解调查
   └─ No response 3 天后 → Follow-up SMS

4. Escalation SOP（若商家选"需要调整"）
   ├─ Jiaming 24h 内发 Zoom link
   ├─ Call agenda:
   │  ├─ 数据诊断（5 min）：谁带来的顾客？
   │  ├─ 原因分析（10 min）：creator 质量 vs 承接
   │  ├─ 改进计划（10 min）：换 creator / 调整 menu / 提升体验
   │  └─ 承诺（5 min）：下周同样时间再看
   └─ 记录 call notes → 发 follow-up email 确认

5. Pilot-to-Paid 转化检查
   ├─ 达到 Success 条件之一？
   │  ├─ 3 周内 ≥15 verified customers
   │  ├─ ROI ≥ 1.0x
   │  └─ 任一 day ≥ 5 customers
   ├─ 是 → 发"升级 offer" email
   │  └─ "$500/月 付费 tier，锁定 12 个月，优先 creator 分配"
   ├─ 否 → 继续 Pilot，可能 pause
   └─ 已转付费 → 继续周报，加 upsell 内容（Retention Add-on）
```

#### 2.2.2 数据模型

```typescript
interface WeeklyMerchantReport {
  merchant_id: string;
  week_start: Date;
  week_end: Date;
  
  // 核心指标
  verified_customers: number;
  total_revenue: number; // sum of all customer payments to Push
  creator_payout: number;
  roi: number; // revenue / creator_payout
  
  // Creator breakdown
  top_creators: Array<{
    creator_id: string;
    creator_name: string;
    customer_count: number;
    revenue: number;
    follower_count: number;
  }>;
  
  // 周对周对比
  wow_change: {
    customer_count_change: number; // +5, -2, etc
    revenue_change: number;
    roi_change: number;
  };
  
  // 报告状态
  email_sent_at?: Date;
  merchant_feedback?: 'continue' | 'adjust' | 'pause' | 'no_response';
  escalation_call_scheduled_at?: Date;
  
  // Pilot-to-Paid 检查
  pilot_success_criteria_met?: boolean;
  upgrade_offer_sent_at?: Date;
  conversion_status?: 'pilot' | 'paid' | 'churned';
}

interface EscalationCall {
  id: string;
  merchant_id: string;
  report_id: string;
  scheduled_at: Date;
  call_duration?: number; // 分钟
  
  // Call notes
  diagnosis: string; // 问题根因分析
  improvement_plan: string; // 改进计划
  commitment: string; // "下周同样时间再看"
  owner: string; // "Jiaming" | "Prum"
  
  // 后续行动
  follow_up_actions: string[];
  next_review_date: Date;
}
```

#### 2.2.3 API 设计

```
POST /api/merchants/:merchant_id/weekly-report
  (后端定时任务，每周一 09:00 调用)
  Response:
    {
      report_id: string,
      merchant_id: string,
      week_start: Date,
      email_sent: boolean,
      report_data: WeeklyMerchantReport
    }

GET /api/merchants/:merchant_id/weekly-report/:report_id
  (用于 email link 跳转)
  Response:
    {
      report: WeeklyMerchantReport,
      roi_status: "good" | "fair" | "needs_improvement",
      recommended_action: string
    }

POST /api/merchants/:merchant_id/feedback
  Request:
    {
      report_id: string,
      feedback: "continue" | "adjust" | "pause"
    }
  Response:
    {
      success: boolean,
      next_action: string // "no action needed" | "scheduling call" | etc
    }

POST /api/escalation-calls
  (Jiaming 手动或 system auto-trigger)
  Request:
    {
      merchant_id: string,
      scheduled_at: Date,
      reason: string
    }
  Response:
    {
      call_id: string,
      zoom_link: string,
      calendar_invite_sent: boolean
    }

PATCH /api/escalation-calls/:call_id
  (Call 结束后，Jiaming 提交 notes)
  Request:
    {
      call_duration: number,
      diagnosis: string,
      improvement_plan: string,
      commitment: string,
      follow_up_actions: string[],
      next_review_date: Date
    }
  Response:
    {
      success: boolean,
      follow_up_email_sent: boolean
    }
```

#### 2.2.4 前端规范（Z 负责 - 商家页面）

**周报邮件模板**
```html
<!-- emails/merchant-weekly-report.tsx -->

Subject: "{Merchant Name}, 上周你赚了 ${revenue} from Push 🎉"

Body:
┌──────────────────────────────────────────┐
│ 📊 上周数据快照                          │
├──────────────────────────────────────────┤
│ 新到访顾客：8                            │
│ Push 产生收入：$200                      │
│ 涉及的 creators：2 (@tara, @joe)       │
│ ROI 这周：1.6x ✅ (超过 1.0x!)          │
│                                          │
│ 🎯 对比前周                              │
│ ✓ +2 顾客（上周 6 个）                  │
│ ✓ +$50 收入（上周 $150）               │
│ ✓ ROI 持平（都是 1.6x）                │
│                                          │
│ 💫 最佳表现 Creator                      │
│ @tara: 4 个顾客 → $100                  │
│ 粉丝数：42K | 平均转化率：9.5%          │
│                                          │
│ [查看完整数据 Dashboard] [继续] [需要调整] [Pause]
│                                          │
└──────────────────────────────────────────┘

如果 Merchant 选 "需要调整":
  → 弹窗："我们来解决这个。Jiaming 会在今天给你发 Zoom link"
  → Jiaming 收到 notification，立即行动
```

**Merchant Dashboard 中的 Weekly Report Widget**
```tsx
// app/merchant/dashboard/weekly-report-widget.tsx

export function WeeklyReportWidget({ merchantId }: Props) {
  const { report } = useWeeklyReport(merchantId);
  
  return (
    <Card className="border-[#c1121f]">
      <CardHeader>
        <CardTitle>上周数据快照 (Mon-Sun)</CardTitle>
        <CardDescription>
          {report.week_start.toLocaleDateString()} - {report.week_end.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <StatBox 
            label="新顾客" 
            value={report.verified_customers}
            change={report.wow_change.customer_count_change}
            trend={report.wow_change.customer_count_change > 0 ? 'up' : 'down'}
          />
          <StatBox 
            label="收入" 
            value={`$${report.total_revenue}`}
            change={report.wow_change.revenue_change}
            trend={report.wow_change.revenue_change > 0 ? 'up' : 'down'}
          />
          <StatBox 
            label="ROI" 
            value={`${report.roi.toFixed(2)}x`}
            status={report.roi >= 1.0 ? 'good' : 'needs_improvement'}
          />
          <StatBox 
            label="Creators" 
            value={report.top_creators.length}
          />
        </div>
        
        {/* Top Creators List */}
        <div className="mt-6">
          <h4 className="font-bold mb-3">TOP CREATORS</h4>
          {report.top_creators.map(creator => (
            <CreatorRow 
              key={creator.creator_id}
              name={creator.creator_name}
              customers={creator.customer_count}
              revenue={creator.revenue}
              followers={creator.follower_count}
            />
          ))}
        </div>
        
        {/* Feedback Actions */}
        <div className="mt-6 pt-6 border-t flex gap-2">
          <Button 
            onClick={() => handleFeedback('continue')}
            variant="default"
          >
            继续 ✓
          </Button>
          <Button 
            onClick={() => handleFeedback('adjust')}
            variant="outline"
          >
            需要调整
          </Button>
          <Button 
            onClick={() => handleFeedback('pause')}
            variant="ghost"
          >
            Pause
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 2.2.5 后端实现（Jiaming）

**周报自动化任务**
```typescript
// services/merchant-weekly-report.ts

export class MerchantWeeklyReportService {
  constructor(
    private supabase: SupabaseClient,
    private emailService: EmailService,
    private slackService: SlackService
  ) {}

  async generateWeeklyReports() {
    // 每周一 09:00 UTC 执行
    const now = new Date();
    const weekStart = subDays(now, 7);
    
    // 获取所有活跃商家（Pilot 或 Paid）
    const merchants = await this.supabase
      .from('merchants')
      .select()
      .in('status', ['pilot', 'paid']);
    
    for (const merchant of merchants) {
      await this.generateReportForMerchant(merchant);
    }
  }

  private async generateReportForMerchant(merchant: any) {
    const weekStart = subDays(new Date(), 7);
    const weekEnd = new Date();
    
    // 查询该 merchant 的所有 verified customers（上周）
    const transactions = await this.supabase
      .from('verified_customers')
      .select(`
        id,
        creator_id,
        amount,
        created_at,
        creators (name, follower_count)
      `)
      .eq('merchant_id', merchant.id)
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString());
    
    // 计算指标
    const verifiedCustomers = transactions.length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const creatorPayout = totalRevenue * 0.4; // 40% payout
    const roi = totalRevenue > 0 ? totalRevenue / creatorPayout : 0;
    
    // Creator 分组
    const creatorBreakdown = {};
    transactions.forEach(t => {
      if (!creatorBreakdown[t.creator_id]) {
        creatorBreakdown[t.creator_id] = {
          name: t.creators.name,
          customer_count: 0,
          revenue: 0,
          follower_count: t.creators.follower_count
        };
      }
      creatorBreakdown[t.creator_id].customer_count += 1;
      creatorBreakdown[t.creator_id].revenue += t.amount;
    });
    
    const topCreators = Object.entries(creatorBreakdown)
      .sort((a, b) => b[1].customer_count - a[1].customer_count)
      .slice(0, 3)
      .map(([id, data]: any) => ({
        creator_id: id,
        ...data
      }));
    
    // 周对周对比
    const prevWeekStart = subDays(weekStart, 7);
    const prevWeekEnd = weekStart;
    const prevWeekTransactions = await this.supabase
      .from('verified_customers')
      .select('amount')
      .eq('merchant_id', merchant.id)
      .gte('created_at', prevWeekStart.toISOString())
      .lt('created_at', prevWeekEnd.toISOString());
    
    const prevWeekCustomers = prevWeekTransactions.length;
    const prevWeekRevenue = prevWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const wowChange = {
      customer_count_change: verifiedCustomers - prevWeekCustomers,
      revenue_change: totalRevenue - prevWeekRevenue,
      roi_change: (roi - (prevWeekRevenue > 0 ? prevWeekRevenue / (prevWeekRevenue * 0.4) : 0))
    };
    
    // 创建 report 记录
    const report = await this.supabase
      .from('merchant_weekly_reports')
      .insert({
        merchant_id: merchant.id,
        week_start: weekStart,
        week_end: weekEnd,
        verified_customers: verifiedCustomers,
        total_revenue: totalRevenue,
        creator_payout: creatorPayout,
        roi,
        top_creators: topCreators,
        wow_change: wowChange,
        email_sent_at: new Date(),
        merchant_feedback: null,
        conversion_status: merchant.status
      })
      .single();
    
    // 检查 Pilot-to-Paid 条件
    const pilotSuccessMetBy = this.checkPilotSuccessConditions(
      merchant,
      verifiedCustomers,
      totalRevenue,
      roi
    );
    
    // 发送邮件
    await this.emailService.sendWeeklyReport(merchant, report, pilotSuccessMetBy);
    
    // Slack 通知（给 Jiaming）
    await this.slackService.notifyMerchantWeeklyReport(merchant, report);
  }

  private checkPilotSuccessConditions(
    merchant: any,
    customerCount: number,
    totalRevenue: number,
    roi: number
  ): boolean {
    if (merchant.status === 'paid') return false; // 已是 paid
    
    // 条件：3 周内 ≥15 customers 或 ROI ≥ 1.0x 或 single day ≥ 5 customers
    // （这里简化，实际需要追踪 3 周累计）
    
    return customerCount >= 15 || roi >= 1.0;
  }

  async handleMerchantFeedback(
    merchantId: string,
    reportId: string,
    feedback: 'continue' | 'adjust' | 'pause'
  ) {
    const report = await this.supabase
      .from('merchant_weekly_reports')
      .update({ merchant_feedback: feedback })
      .eq('id', reportId)
      .single();
    
    if (feedback === 'adjust') {
      // 触发 Jiaming escalation call 流程
      await this.createEscalationCall(merchantId, reportId);
    } else if (feedback === 'pause') {
      // 通知 Prum 进行 churn 调查
      await this.slackService.notifyChurnRisk(merchantId, report);
    }
  }

  private async createEscalationCall(merchantId: string, reportId: string) {
    const call = await this.supabase
      .from('escalation_calls')
      .insert({
        merchant_id: merchantId,
        report_id: reportId,
        scheduled_at: addHours(new Date(), 24), // 24 小时内
        owner: 'jiaming'
      })
      .single();
    
    // 发送 Zoom link 给 merchant
    const merchant = await this.supabase
      .from('merchants')
      .select('email, name')
      .eq('id', merchantId)
      .single();
    
    const zoomLink = await this.generateZoomLink({
      topic: `Push 数据诊断 - ${merchant.name}`,
      scheduled_time: call.scheduled_at,
      duration: 30 // 分钟
    });
    
    await this.emailService.sendEscalationCallInvite(merchant, call, zoomLink);
  }
}
```

---

### 方案 3: Creator Supply 的分层招募和激励

#### 2.3.1 业务逻辑

```
Creator 招募分 3 个 Tier：

┌─ Tier 1: "Lucy's Direct Network"（Week 1-2）
│  ├─ 目标：15-20 人
│  ├─ 来源：Lucy 已认识的 creator
│  ├─ 流程：Lucy 一对一 DM / 电话
│  ├─ Onboarding：fast-track，直接签 Early Operator Agreement
│  ├─ 激励：Early Operator Agreement（见下）
│  └─ 成功标志：week 2 末 15-20 人签署
│
├─ Tier 2: "Creator Community"（Week 3-4）
│  ├─ 目标：15-20 人
│  ├─ 来源：
│  │  - TikTok Brooklyn creator group（Lucy 加入但不认识）
│  │  - Instagram local creator page（ask for shoutout）
│  │  - Reddit r/Brooklyn_Influencers
│  │  - Aspire/Grin 平台（search + cold DM）
│  ├─ 流程：Group Zoom (Lucy + Jiaming present)
│  │  - Batch 1 (Week 3 Mon): 10 people
│  │  - Batch 2 (Week 4 Mon): 10 people
│  ├─ Onboarding：完整 call（15 min/person）
│  ├─ 激励：Early Operator Agreement
│  └─ 成功标志：week 4 末 20+ 人签署
│
└─ Tier 3: "Incentive-Driven Growth"（Week 4+）
   ├─ 目标：5-10 人（overflow）
   ├─ 来源：Tier 1/2 creator 推荐
   ├─ 激励：Referral bonus（推荐成功 = $50 bonus）
   ├─ Onboarding：self-service + email support
   └─ 成功标志：week 4 末 5+ 人签署
```

#### 2.3.2 数据模型

```typescript
interface CreatorProfile {
  id: string;
  user_id: string; // Clerk auth
  
  // Basic info
  name: string;
  handle: string; // @username
  bio: string;
  avatar_url: string;
  
  // Platform presence
  follower_count_tiktok?: number;
  follower_count_instagram?: number;
  follower_count_other?: string; // "YouTube: 50K"
  
  // Push status
  status: 'prospect' | 'early_operator' | 't1' | 't2' | 't3' | 'churned';
  tier?: 1 | 2 | 3; // tier 1-3
  
  // Recruitment
  recruitment_tier: 1 | 2 | 3; // 来自哪一层
  recruited_by?: string; // creator_id（如果是 referral）
  signed_date?: Date;
  first_campaign_date?: Date;
  
  // Performance
  performance_score?: number; // 0-100，基于 conversion rate
  total_earnings?: number;
  monthly_earnings?: number;
  
  // Engagement
  campaigns_completed: number;
  verified_customers_delivered: number;
  avg_appeal_rejection_rate?: number; // 越低越好
  
  // Status tracking
  m2_m3_active?: boolean; // 是否在 Month 2-3 活跃
  created_at: Date;
  updated_at: Date;
}

interface EarlyOperatorAgreement {
  id: string;
  creator_id: string;
  merchant_id?: string; // optional，可能在签合同时还不清楚
  
  // Terms
  valid_from: Date;
  valid_until: Date; // usually +60 days
  
  // 承诺
  min_campaigns: number; // 至少 2 个
  min_posts_per_campaign: number; // 至少 1 个
  
  // 收入
  rate_per_customer: number; // $12
  completion_bonus: number; // $50
  
  // Status
  status: 'draft' | 'signed' | 'active' | 'completed' | 'failed';
  signed_at?: Date;
  
  // 失败条件
  termination_reason?: string;
  terminated_at?: Date;
}

interface CreatorActivationFunnel {
  week_number: number;
  total_prospects: number;
  
  // 各阶段的人数
  signed_early_operator: number;
  created_profile: number;
  uploaded_photo: number;
  received_first_assignment: number;
  posted_content: number;
  delivered_customers: number;
  
  // Retention
  active_m2_m3: number;
  
  // Churn
  churned_count: number;
  churn_reasons: { [reason: string]: number };
}

interface CreatorRecruitmentReferral {
  id: string;
  referrer_creator_id: string;
  referred_creator_id: string;
  
  // 状态
  status: 'pending' | 'approved' | 'rejected';
  referred_at: Date;
  
  // Bonus
  bonus_amount: number; // $50
  bonus_paid_at?: Date;
  
  // 条件：referred creator 需要至少跑 1 campaign
  referred_creator_campaign_count?: number;
}
```

#### 2.3.3 API 设计

```
GET /api/creators/recruitment/funnel
  (每周五更新，给 Jiaming 看)
  Response:
    {
      week: number,
      funnel: CreatorActivationFunnel,
      insights: {
        biggest_drop_stage: string, // 在哪一步 dropout 最多
        churn_top_reasons: string[],
        recommended_actions: string[]
      }
    }

POST /api/creators/recruit/tier-1
  (Lucy 手动调用，Tier 1 招募)
  Request:
    {
      creator_name: string,
      creator_handle: string,
      follower_count: number,
      platform: "tiktok" | "instagram" | "youtube"
    }
  Response:
    {
      creator_id: string,
      early_operator_agreement_id: string,
      draft_agreement_url: string // 让 Lucy 分享给 creator
    }

POST /api/creators/recruit/tier-2
  (Group Zoom 后，Jiaming 调用，Tier 2 招募)
  Request:
    {
      creators: Array<{
        name: string,
        handle: string,
        follower_count: number
      }>
    }
  Response:
    {
      recruitment_batch_id: string,
      created_count: number,
      agreement_links: string[]
    }

POST /api/creators/:creator_id/refer
  (Tier 1/2 creator 推荐 Tier 3)
  Request:
    {
      referred_creator_name: string,
      referred_creator_handle: string
    }
  Response:
    {
      referral_id: string,
      referral_bonus_amount: number
    }

POST /api/creators/:creator_id/upgrade-tier
  (从 Early Operator 升级到 T3 Operator)
  Request:
    {
      creator_id: string,
      new_tier: 3 // 先只支持升到 3
    }
  Response:
    {
      success: boolean,
      new_contract_url: string,
      monthly_base_salary: number
    }

GET /api/creators/:creator_id/performance-metrics
  Response:
    {
      campaigns_completed: number,
      verified_customers: number,
      total_earnings: number,
      monthly_earnings: number,
      appeal_rejection_rate: number,
      conversion_rate: number,
      performance_score: number,
      next_tier_eligibility: boolean
    }
```

#### 2.3.4 前端规范（Jiaming 负责 - Creator 页面）

**Creator 招募流程（Tier 1 - Lucy 侧）**
```tsx
// 文件：app/admin/recruitment/tier-1-recruit.tsx

export function Tier1RecruitmentView() {
  // Lucy 看这个页面，逐个添加 Tier 1 creator

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier 1 招募 - Lucy's Network</CardTitle>
        <CardDescription>直接认识的 creator，fast-track onboarding</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator Name</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 手动表单输入 */}
            <NewCreatorInputRow />
            
            {/* 已添加的 creator */}
            {creators.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>@{c.handle}</TableCell>
                <TableCell>{c.follower_count.toLocaleString()}</TableCell>
                <TableCell>{c.platform}</TableCell>
                <TableCell>
                  <Badge status={c.status}>
                    {c.status === 'draft' ? '草稿' : '已签署'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {c.status === 'draft' && (
                    <Button 
                      onClick={() => sendAgreement(c.id)}
                      size="sm"
                    >
                      发送合同
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Progress: {signedCount}/{totalCount} 签署完成
          </p>
          <ProgressBar value={(signedCount / totalCount) * 100} />
        </div>
      </CardContent>
    </Card>
  );
}
```

**Activation Funnel Dashboard（Jiaming 侧）**
```tsx
// 文件：app/admin/recruitment/activation-funnel.tsx

export function CreatorActivationFunnelView() {
  const { funnel, insights } = useCreatorFunnel();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Creator Activation Funnel - Week {week}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 漏斗图 */}
          <FunnelChart data={[
            { stage: 'Signed Early Op', count: funnel.signed_early_operator },
            { stage: 'Created Profile', count: funnel.created_profile },
            { stage: 'First Assignment', count: funnel.received_first_assignment },
            { stage: 'Posted Content', count: funnel.posted_content },
            { stage: 'Delivered Customers', count: funnel.delivered_customers },
            { stage: 'Active M2→M3', count: funnel.active_m2_m3 }
          ]} />
          
          {/* 最大掉队段 */}
          <Alert className="mt-6">
            <AlertCircle />
            <AlertTitle>最大掉队: {insights.biggest_drop_stage}</AlertTitle>
            <AlertDescription>
              {funnel[insights.biggest_drop_stage] - funnel[getNextStage(insights.biggest_drop_stage)]} 人在这步掉队
              <br />
              <br />
              建议行动:
              <ul className="list-disc ml-6 mt-2">
                {insights.recommended_actions.map(action => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      {/* Churn 原因分析 */}
      <Card>
        <CardHeader>
          <CardTitle>Churn 原因 ({funnel.churned_count} 人)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChurnReasonsChart data={funnel.churn_reasons} />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Creator 侧 - Tier 升级 UI（Creator App）**
```tsx
// 文件：app/creator/dashboard/tier-upgrade-section.tsx

export function TierUpgradeSection({ creatorId }: Props) {
  const { creator } = useCreator(creatorId);
  
  // 检查是否可升级
  const canUpgrade = 
    creator.tier === 'early_operator' &&
    creator.campaigns_completed >= 2 &&
    creator.verified_customers_delivered >= 10;
  
  return (
    <Card className="border-[#c1121f]">
      <CardHeader>
        <CardTitle>升级到 T3 Operator</CardTitle>
        <CardDescription>
          获得固定月薪 + 更高的单价
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 升级条件清单 */}
          <div>
            <h4 className="font-bold mb-3">升级条件</h4>
            <UpgradeChecklist
              items={[
                {
                  label: '完成 ≥ 2 个 campaign',
                  complete: creator.campaigns_completed >= 2
                },
                {
                  label: '送出 ≥ 10 个 verified customers',
                  complete: creator.verified_customers_delivered >= 10
                },
                {
                  label: '同意 12 个月续约承诺',
                  complete: false // 需要点击同意
                }
              ]}
            />
          </div>
          
          {/* 升级后的待遇 */}
          <div className="bg-[#fdf0d5] p-4 rounded">
            <h4 className="font-bold mb-3">升级后的待遇</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monthly base retainer:</span>
                <span className="font-bold">$200</span>
              </div>
              <div className="flex justify-between">
                <span>Per verified customer:</span>
                <span className="font-bold">$15 (was $12)</span>
              </div>
              <div className="flex justify-between">
                <span>Priority campaign access:</span>
                <span>✓</span>
              </div>
            </div>
          </div>
          
          {/* 升级按钮 */}
          {canUpgrade ? (
            <Button 
              onClick={() => upgradeToT3(creatorId)}
              className="w-full bg-[#c1121f]"
            >
              升级到 T3 Operator
            </Button>
          ) : (
            <Button disabled className="w-full">
              不符合升级条件（完成 {creator.campaigns_completed}/2 campaigns, 
              送出 {creator.verified_customers_delivered}/10 customers）
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 2.3.5 后端实现（Lucy + Jiaming）

**Creator 招募与 Tier 升级**
```typescript
// services/creator-recruitment.ts

export class CreatorRecruitmentService {
  constructor(
    private supabase: SupabaseClient,
    private emailService: EmailService,
    private slackService: SlackService
  ) {}

  // Tier 1 招募（Lucy 手动添加）
  async createTier1Creator(
    name: string,
    handle: string,
    followerCount: number,
    platform: string
  ): Promise<{ creatorId: string; agreementDraftUrl: string }> {
    // 创建 creator profile
    const creator = await this.supabase
      .from('creators')
      .insert({
        name,
        handle,
        follower_count_tiktok: platform === 'tiktok' ? followerCount : null,
        follower_count_instagram: platform === 'instagram' ? followerCount : null,
        status: 'early_operator',
        recruitment_tier: 1,
        signed_date: new Date()
      })
      .single();
    
    // 创建 Early Operator Agreement（草稿）
    const agreement = await this.supabase
      .from('early_operator_agreements')
      .insert({
        creator_id: creator.id,
        valid_from: new Date(),
        valid_until: addDays(new Date(), 60),
        min_campaigns: 2,
        min_posts_per_campaign: 1,
        rate_per_customer: 12,
        completion_bonus: 50,
        status: 'draft'
      })
      .single();
    
    // 生成合同 URL（给 Lucy 分享）
    const agreementUrl = `${process.env.NEXT_PUBLIC_URL}/creator/agreement/${agreement.id}`;
    
    return {
      creatorId: creator.id,
      agreementDraftUrl: agreementUrl
    };
  }

  // Tier 2 招募（Group Zoom 后）
  async createTier2Creators(
    creators: Array<{ name: string; handle: string; followerCount: number }>
  ): Promise<{ createdCount: number; agreementLinks: string[] }> {
    const agreementLinks = [];
    
    for (const creatorData of creators) {
      const creator = await this.supabase
        .from('creators')
        .insert({
          name: creatorData.name,
          handle: creatorData.handle,
          follower_count_instagram: creatorData.followerCount,
          status: 'early_operator',
          recruitment_tier: 2,
          signed_date: new Date()
        })
        .single();
      
      const agreement = await this.supabase
        .from('early_operator_agreements')
        .insert({
          creator_id: creator.id,
          valid_from: new Date(),
          valid_until: addDays(new Date(), 60),
          min_campaigns: 2,
          rate_per_customer: 12,
          completion_bonus: 50,
          status: 'draft'
        })
        .single();
      
      const url = `${process.env.NEXT_PUBLIC_URL}/creator/agreement/${agreement.id}`;
      agreementLinks.push(url);
    }
    
    return {
      createdCount: creators.length,
      agreementLinks
    };
  }

  // 获取 Creator Activation Funnel 数据
  async getActivationFunnel(weekNumber: number): Promise<CreatorActivationFunnel> {
    const weekStart = startOfWeek(addWeeks(new Date(), weekNumber - getCurrentWeek()));
    const weekEnd = endOfWeek(weekStart);
    
    // 各阶段计数
    const signedCount = await this.supabase
      .from('creators')
      .select()
      .eq('status', 'early_operator')
      .gte('signed_date', weekStart.toISOString())
      .lt('signed_date', weekEnd.toISOString());
    
    const createdProfileCount = await this.supabase
      .from('creators')
      .select()
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString())
      .not('avatar_url', 'is', null); // avatar 已上传 = profile 完整
    
    // ... 类似的查询获取其他阶段的数据
    
    return {
      week_number: weekNumber,
      total_prospects: signedCount.length,
      signed_early_operator: signedCount.length,
      // ... 其他阶段数据
    };
  }

  // Creator 升级到 T3
  async upgradeCreatorToT3(creatorId: string): Promise<void> {
    const creator = await this.supabase
      .from('creators')
      .select()
      .eq('id', creatorId)
      .single();
    
    // 验证升级条件
    const campaigns = await this.supabase
      .from('campaigns')
      .select()
      .eq('creator_id', creatorId);
    
    const customers = await this.supabase
      .from('verified_customers')
      .select()
      .eq('creator_id', creatorId);
    
    if (campaigns.length < 2 || customers.length < 10) {
      throw new Error('不符合升级条件');
    }
    
    // 更新 creator 状态
    await this.supabase
      .from('creators')
      .update({
        status: 't3',
        tier: 3,
        updated_at: new Date()
      })
      .eq('id', creatorId);
    
    // 创建新合同（T3 合同，包含 $200 月薪）
    const t3Contract = await this.supabase
      .from('t3_operator_contracts')
      .insert({
        creator_id: creatorId,
        monthly_base: 200,
        per_customer_rate: 15,
        valid_from: new Date(),
        valid_until: addDays(new Date(), 365),
        status: 'active'
      })
      .single();
    
    // 发送欢迎邮件
    await this.emailService.sendT3UpgradeWelcome(creator);
    
    // Slack 通知
    await this.slackService.notifyCreatorUpgrade(creator.name);
  }
}
```

---

### 方案 4: ConversionOracle 早期精度管理

#### 2.4.1 业务逻辑

```
AI 验证三层阈值（Week 1 部署）：

每个 verified customer claim 进来，计算 confidence score：

Score ≥ 0.85 (3 signals all match)
  ├─ Vision: 脸部特征识别 ✓
  ├─ OCR: Receipt 文字识别 ✓
  ├─ Geo: GPS 定位 ✓
  └─ 结果：Auto-verify，立即支付给 creator

Score 0.65-0.84 (2 of 3 match)
  ├─ 例如：Vision + Geo match，但 OCR 失败
  └─ 结果：Queue for manual review（1-hour SLA）
     ├─ Jiaming/Z 看实际照片
     ├─ 判断："这真的是这家店吗？"
     └─ 决议：approve / request appeal

Score < 0.65 (≤1 signal matches)
  ├─ 例如：只有 Vision match
  └─ 结果：Reject
     ├─ Creator 可 appeal（上传新证据）
     ├─ Appeal 条件：receipt photo + video
     └─ Jiaming 重新审查

双周精度审计（每周三下午）：
  ├─ 看 last 14 days 的所有 verified claims
  ├─ 统计：
  │  ├─ Auto-verify 假阳性数
  │  ├─ Manual review 准确率
  │  └─ Appeal 通过率
  ├─ 比较 vs tolerance (Month 1: ≤5% FP)
  ├─ 如果超 tolerance → 提高 threshold (0.85 → 0.90)
  └─ 更新 Slack 里的 accuracy dashboard
```

#### 2.4.2 数据模型

```typescript
interface VerifiedCustomerClaim {
  id: string;
  creator_id: string;
  merchant_id: string;
  
  // 声称的事实
  claimed_visit_time: Date;
  claimed_amount: number;
  
  // AI 验证信号
  vision_signal: {
    confidence: number; // 0-1
    detected_faces: number;
    location_recognized: boolean;
  };
  
  ocr_signal: {
    confidence: number; // 0-1
    merchant_name_match: boolean;
    receipt_amount_match: boolean;
    timestamp_match: boolean;
  };
  
  geo_signal: {
    confidence: number; // 0-1
    lat: number;
    lng: number;
    distance_to_store_meters: number;
  };
  
  // 综合判断
  overall_score: number; // 0-1
  verification_threshold: 'high' | 'medium' | 'low';
  
  // 验证结果
  status: 'auto_verified' | 'manual_review' | 'rejected' | 'appeal_pending' | 'appeal_approved';
  verified_at?: Date;
  verified_by?: string; // Jiaming/Z (manual cases)
  
  // Appeal 相关
  appeal_reason?: string;
  appeal_evidence_url?: string;
  appeal_resolved_at?: Date;
  appeal_approved?: boolean;
}

interface AIAccuracyAudit {
  id: string;
  week_number: number;
  audit_date: Date;
  
  // 统计数据
  total_auto_verified: number;
  total_manual_reviewed: number;
  total_rejected: number;
  total_appeals: number;
  
  // 精度指标
  false_positive_count: number;
  false_positive_rate: number; // FP / total_auto_verified
  false_negative_count: number;
  false_negative_rate: number; // FN / total_verified
  
  // Manual review 质量
  manual_approved: number;
  manual_rejected: number;
  
  // Appeal 处理
  appeal_approved_count: number;
  appeal_rejected_count: number;
  appeal_turnaround_hours: number; // 平均处理时间
  
  // 阈值调整
  threshold_adjusted: boolean;
  old_threshold?: number;
  new_threshold?: number;
  reason: string;
  
  // 备注
  notes: string;
}

interface MerchantAppeal {
  id: string;
  merchant_id: string;
  verified_customer_id: string;
  
  appeal_reason: string; // "这个顾客没来过" / 其他
  merchant_evidence: {
    pos_receipt?: string; // 没有这笔交易的 POS 记录
    notes?: string;
  };
  
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  resolved_at?: Date;
  resolved_by?: string;
  
  outcome: 'refund_merchant' | 'refund_creator' | 'split_50_50';
}
```

#### 2.4.3 API 设计

```
POST /api/verify/claim
  (Creator 提交一个 claim，包含 image)
  Request:
    {
      merchant_id: string,
      claimed_visit_time: Date,
      claimed_amount: number,
      image_url: string, // 已上传到 S3
      ocr_data?: { receipt_text: string }
    }
  Response:
    {
      claim_id: string,
      verification_status: 'auto_verified' | 'manual_review' | 'rejected',
      confidence_score: number,
      estimated_payout: number,
      next_step: string
    }

GET /api/verify/claims/:claim_id/status
  Response:
    {
      claim: VerifiedCustomerClaim,
      current_status: string,
      estimated_resolution_time?: string
    }

POST /api/verify/appeals
  (Creator 对被拒的 claim 进行 appeal)
  Request:
    {
      claim_id: string,
      appeal_reason: string,
      evidence_urls: string[] // 新上传的证据
    }
  Response:
    {
      appeal_id: string,
      status: 'submitted',
      estimated_resolution_date: Date
    }

POST /api/merchant/appeals
  (Merchant 对某个 verified claim 进行 appeal)
  Request:
    {
      claim_id: string,
      appeal_reason: string,
      evidence?: { pos_no_receipt?: boolean }
    }
  Response:
    {
      appeal_id: string,
      status: 'submitted',
      estimated_resolution_date: Date
    }

GET /api/verify/accuracy/audit/:week_number
  (Jiaming 在双周审计时调用)
  Response:
    {
      audit: AIAccuracyAudit,
      recommendations: string[]
    }

PATCH /api/verify/threshold
  (审计后，决定是否调整阈值)
  Request:
    {
      new_threshold: number, // e.g., 0.90
      reason: string
    }
  Response:
    {
      success: boolean,
      new_threshold: number,
      affected_claims_count: number // 多少个 pending claims 会受影响
    }
```

#### 2.4.4 前端规范

**Merchant Dashboard - Appeal Section**
```tsx
// app/merchant/dashboard/appeals-section.tsx

export function AppealsSection({ merchantId }: Props) {
  const { claims } = useVerifiedClaims(merchantId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>验证异议</CardTitle>
        <CardDescription>
          如果顾客没来或数据错误，可以提出异议
        </CardDescription>
      </CardHeader>
      <CardContent>
        {claims.map(claim => (
          <div key={claim.id} className="border-b pb-4 mb-4">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">@{claim.creator_name}</p>
                <p className="text-sm text-gray-600">
                  {claim.claimed_visit_time.toLocaleDateString()} - ${claim.claimed_amount}
                </p>
              </div>
              <Badge status={claim.status}>{claim.status}</Badge>
            </div>
            
            {claim.status === 'auto_verified' && (
              <Button 
                onClick={() => openAppealDialog(claim.id)}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                提出异议
              </Button>
            )}
          </div>
        ))}
        
        {/* Appeal Form Dialog */}
        <AppealDialog 
          claimId={selectedClaimId}
          onSubmit={submitAppeal}
        />
      </CardContent>
    </Card>
  );
}
```

**Creator App - Appeal Section**
```tsx
// app/creator/dashboard/appeals-section.tsx

export function CreatorAppealsSection({ creatorId }: Props) {
  const { rejectedClaims } = useRejectedClaims(creatorId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>被拒的验证</CardTitle>
        <CardDescription>
          提供更多证据来重新审查
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rejectedClaims.map(claim => (
          <div key={claim.id} className="border-b pb-4 mb-4">
            <p className="font-bold">{claim.merchant_name}</p>
            <p className="text-sm text-gray-600">
              {claim.claimed_visit_time.toLocaleDateString()} - ${claim.claimed_amount}
            </p>
            <p className="text-sm text-red-600 mt-2">
              ❌ 被拒：{claim.rejection_reason}
            </p>
            
            <Button 
              onClick={() => openAppealDialog(claim.id)}
              className="mt-3"
              size="sm"
            >
              提出申诉
            </Button>
          </div>
        ))}
        
        {/* Appeal Dialog */}
        <CreatorAppealDialog 
          claimId={selectedClaimId}
          onSubmit={submitAppeal}
        />
      </CardContent>
    </Card>
  );
}
```

**Admin Dashboard - Accuracy Audit**
```tsx
// app/admin/verify/accuracy-audit.tsx

export function AccuracyAuditView() {
  const { audit, recommendations } = useAccuracyAudit(currentWeek);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Week {audit.week_number} AI Accuracy Audit</CardTitle>
          <CardDescription>{audit.audit_date.toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatBox 
              label="Auto-verified" 
              value={audit.total_auto_verified}
              subtext={`FP rate: ${(audit.false_positive_rate * 100).toFixed(2)}%`}
              status={audit.false_positive_rate <= 0.05 ? 'good' : 'warning'}
            />
            <StatBox 
              label="Manual reviewed" 
              value={audit.total_manual_reviewed}
              subtext={`Approved: ${audit.manual_approved}`}
            />
            <StatBox 
              label="Appeals" 
              value={audit.total_appeals}
              subtext={`Approved: ${audit.appeal_approved_count}`}
            />
            <StatBox 
              label="Threshold" 
              value={audit.threshold_adjusted ? "调整过" : "保持"}
              subtext={audit.threshold_adjusted ? 
                `${audit.old_threshold} → ${audit.new_threshold}` : 
                `当前: 0.85`
              }
            />
          </div>
          
          {/* Recommendations */}
          <Alert className="mt-6">
            <AlertCircle />
            <AlertTitle>建议</AlertTitle>
            <AlertDescription>
              <ul className="list-disc ml-6 mt-2">
                {recommendations.map(rec => (
                  <li key={rec}>{rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          
          {/* Threshold Adjustment */}
          {audit.false_positive_rate > 0.05 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded">
              <h4 className="font-bold mb-2">需要调整阈值</h4>
              <p className="text-sm mb-4">
                假阳性率超过 5%，建议提高阈值到 0.90
              </p>
              <Button 
                onClick={() => adjustThreshold(0.90)}
                className="bg-[#c1121f]"
              >
                实施调整
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 2.4.5 后端实现

**AI 验证 + 精度追踪**
```typescript
// services/ai-verification.ts

export class AIVerificationService {
  constructor(
    private supabase: SupabaseClient,
    private anthropic: Anthropic,
    private slackService: SlackService
  ) {}

  async verifyCustomerClaim(
    creatorId: string,
    merchantId: string,
    claimedVisitTime: Date,
    claimedAmount: number,
    imageUrl: string,
    ocrData?: { receipt_text: string }
  ): Promise<VerifiedCustomerClaim> {
    // Step 1: Vision 识别
    const visionSignal = await this.runVisionAnalysis(imageUrl);
    
    // Step 2: OCR 识别
    const ocrSignal = await this.runOCRAnalysis(imageUrl, ocrData);
    
    // Step 3: Geo 检查
    const geoSignal = await this.runGeoAnalysis(merchantId, visionSignal);
    
    // Step 4: 综合打分
    const overallScore = this.calculateOverallScore(
      visionSignal,
      ocrSignal,
      geoSignal
    );
    
    // Step 5: 决定验证方式
    let verificationStatus: 'auto_verified' | 'manual_review' | 'rejected';
    if (overallScore >= 0.85) {
      verificationStatus = 'auto_verified';
    } else if (overallScore >= 0.65) {
      verificationStatus = 'manual_review';
    } else {
      verificationStatus = 'rejected';
    }
    
    // Step 6: 保存 claim
    const claim = await this.supabase
      .from('verified_customers')
      .insert({
        creator_id: creatorId,
        merchant_id: merchantId,
        claimed_visit_time: claimedVisitTime,
        claimed_amount: claimedAmount,
        image_url: imageUrl,
        vision_signal: visionSignal,
        ocr_signal: ocrSignal,
        geo_signal: geoSignal,
        overall_score: overallScore,
        status: verificationStatus,
        verified_at: verificationStatus === 'auto_verified' ? new Date() : null
      })
      .single();
    
    // Step 7: 如果 auto-verified，立即支付；如果 manual，加入队列
    if (verificationStatus === 'auto_verified') {
      await this.processPayout(creatorId, merchantId, claim.claimed_amount);
    } else if (verificationStatus === 'manual_review') {
      await this.slackService.notifyManualReviewQueue(claim);
    }
    
    return claim;
  }

  private async runVisionAnalysis(imageUrl: string) {
    // 使用 Claude Vision 分析图像
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: `Analyze this image for:
              1. Is there a person visible? (0-1 confidence)
              2. Is there a beverage or food item? (0-1 confidence)
              3. Is this clearly inside a coffee shop or restaurant? (0-1 confidence)
              4. Can you identify facial features of the person? (0-1 confidence)
              
              Return JSON: { person_confidence: number, product_confidence: number, location_confidence: number, face_confidence: number }`
            }
          ]
        }
      ]
    });
    
    // 解析回复
    const visionData = JSON.parse(message.content[0].type === 'text' ? message.content[0].text : '{}');
    
    return {
      confidence: (visionData.person_confidence + visionData.product_confidence + visionData.location_confidence) / 3,
      detected_faces: visionData.face_confidence > 0.7 ? 1 : 0,
      location_recognized: visionData.location_confidence > 0.6
    };
  }

  private async runOCRAnalysis(imageUrl: string, ocrData?: { receipt_text: string }) {
    // 如果已提供 OCR 数据，直接使用
    if (ocrData) {
      // 分析 receipt 文本
      const hasAmount = /\$?\d+\.\d{2}/.test(ocrData.receipt_text);
      const hasTime = /\d{1,2}:\d{2}/.test(ocrData.receipt_text);
      
      return {
        confidence: (hasAmount ? 0.7 : 0.2) + (hasTime ? 0.3 : 0),
        receipt_amount_match: hasAmount,
        timestamp_match: hasTime,
        merchant_name_match: true // 需要 merchant_name 比对逻辑
      };
    }
    
    // 否则用 Claude 进行 OCR
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: `Extract receipt information:
              1. Total amount (if visible)
              2. Merchant name (if visible)
              3. Timestamp (if visible)
              4. Item names (if visible)
              
              Return JSON: { amount: string, merchant_name: string, timestamp: string, items: string[] }`
            }
          ]
        }
      ]
    });
    
    const ocrResult = JSON.parse(message.content[0].type === 'text' ? message.content[0].text : '{}');
    
    return {
      confidence: (ocrResult.amount ? 0.5 : 0) + (ocrResult.merchant_name ? 0.3 : 0) + (ocrResult.timestamp ? 0.2 : 0),
      receipt_amount_match: !!ocrResult.amount,
      timestamp_match: !!ocrResult.timestamp,
      merchant_name_match: !!ocrResult.merchant_name
    };
  }

  private async runGeoAnalysis(merchantId: string, visionSignal: any) {
    // 注：实际需要从 image EXIF 或其他方式获取 GPS 数据
    // 这里假设有 GPS 信息
    
    const merchant = await this.supabase
      .from('merchants')
      .select('lat, lng')
      .eq('id', merchantId)
      .single();
    
    // 假设 visionSignal 中包含推断的位置
    // 实际需要从图像元数据或其他方式获取
    
    return {
      confidence: 0.8, // 需要实际实现
      lat: 0,
      lng: 0,
      distance_to_store_meters: 0
    };
  }

  private calculateOverallScore(vision: any, ocr: any, geo: any): number {
    // 加权平均
    return (vision.confidence * 0.4) + (ocr.confidence * 0.4) + (geo.confidence * 0.2);
  }

  private async processPayout(
    creatorId: string,
    merchantId: string,
    amount: number
  ): Promise<void> {
    // 计算 creator payout（40%）
    const payoutAmount = amount * 0.4;
    
    // 创建 payout record
    await this.supabase
      .from('creator_payouts')
      .insert({
        creator_id: creatorId,
        merchant_id: merchantId,
        amount: payoutAmount,
        status: 'pending',
        scheduled_for: addHours(new Date(), 48) // 48h payout
      });
  }

  // 处理 Merchant Appeal
  async processMerchantAppeal(
    claimId: string,
    appealReason: string,
    evidence?: any
  ): Promise<void> {
    // 创建 appeal record
    const appeal = await this.supabase
      .from('merchant_appeals')
      .insert({
        verified_customer_id: claimId,
        appeal_reason: appealReason,
        merchant_evidence: evidence,
        status: 'pending'
      })
      .single();
    
    // 通知 Jiaming 审核
    await this.slackService.notifyMerchantAppeal(appeal);
  }

  // 处理 Creator Appeal
  async processCreatorAppeal(
    claimId: string,
    appealReason: string,
    evidenceUrls: string[]
  ): Promise<void> {
    const appeal = await this.supabase
      .from('creator_appeals')
      .insert({
        verified_customer_id: claimId,
        appeal_reason: appealReason,
        appeal_evidence_urls: evidenceUrls,
        status: 'pending'
      })
      .single();
    
    await this.slackService.notifyCreatorAppeal(appeal);
  }

  // 生成双周精度审计
  async generateAccuracyAudit(weekNumber: number): Promise<AIAccuracyAudit> {
    const weekStart = startOfWeek(addWeeks(new Date(), weekNumber - getCurrentWeek()));
    const weekEnd = endOfWeek(weekStart);
    
    // 查询该周的所有 claims
    const claims = await this.supabase
      .from('verified_customers')
      .select()
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString());
    
    const autoVerified = claims.filter(c => c.status === 'auto_verified');
    const manualReviewed = claims.filter(c => c.status === 'manual_review');
    const rejected = claims.filter(c => c.status === 'rejected');
    
    // 统计假阳性（后来被商家 appeal 成功）
    const merchantAppeals = await this.supabase
      .from('merchant_appeals')
      .select()
      .eq('status', 'approved')
      .gte('resolved_at', weekStart.toISOString())
      .lt('resolved_at', weekEnd.toISOString());
    
    const falsePositiveRate = merchantAppeals.length / autoVerified.length;
    
    // 统计假阴性（creator appeal 成功）
    const creatorAppeals = await this.supabase
      .from('creator_appeals')
      .select()
      .eq('status', 'approved')
      .gte('resolved_at', weekStart.toISOString())
      .lt('resolved_at', weekEnd.toISOString());
    
    const falseNegativeRate = creatorAppeals.length / rejected.length;
    
    // 确定是否需要调整阈值
    const needsThresholdAdjustment = falsePositiveRate > 0.05;
    
    return {
      week_number: weekNumber,
      audit_date: new Date(),
      total_auto_verified: autoVerified.length,
      total_manual_reviewed: manualReviewed.length,
      total_rejected: rejected.length,
      total_appeals: merchantAppeals.length + creatorAppeals.length,
      false_positive_count: merchantAppeals.length,
      false_positive_rate: falsePositiveRate,
      false_negative_count: creatorAppeals.length,
      false_negative_rate: falseNegativeRate,
      manual_approved: manualReviewed.filter(c => c.status === 'manual_approved').length,
      manual_rejected: manualReviewed.filter(c => c.status === 'manual_rejected').length,
      appeal_approved_count: merchantAppeals.length + creatorAppeals.length,
      appeal_rejected_count: 0, // 待实现
      appeal_turnaround_hours: 2, // 平均处理时间（实际需要计算）
      threshold_adjusted: needsThresholdAdjustment,
      old_threshold: 0.85,
      new_threshold: needsThresholdAdjustment ? 0.90 : 0.85,
      reason: needsThresholdAdjustment ? '假阳性率超过 5%' : '保持阈值'
    };
  }

  // 应用新阈值
  async applyNewThreshold(newThreshold: number): Promise<void> {
    // 更新系统设置
    await this.supabase
      .from('system_settings')
      .update({
        verification_threshold_high: newThreshold
      })
      .eq('key', 'ai_verification');
    
    // Slack 通知
    await this.slackService.notifyThresholdAdjustment(newThreshold);
  }
}
```

---

### 方案 5: 季节性和地理扩张框架

[由于篇幅限制，详细内容见下一部分]

---

### 方案 6: Merchant Dashboard

[由于篇幅限制，详细内容见下一部分]

---

### 方案 7: Pre-Seed 融资证据链

[由于篇幅限制，详细内容见下一部分]

---

## 3. 人员分工与技术栈

```
┌─────────────────────────────────────────────────────────┐
│ 技术栈 + 人员分工                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 【Z 负责 - 商家页面】                                  │
│ ├─ Merchant Weekly Report Widget (app/merchant/...)    │
│ ├─ Merchant Dashboard Charts & Stats                  │
│ ├─ Weekly Report Email Template                       │
│ ├─ Escalation Call Booking UI                         │
│ └─ Merchant Appeal Form                               │
│                                                         │
│ 【Jiaming 负责 - Admin + 后端服务】                   │
│ ├─ Weekly Report Auto-generation (Cron)              │
│ ├─ Escalation Call SOP + Slack Workflow              │
│ ├─ AI Verification Pipeline (Claude Vision)          │
│ ├─ Accuracy Audit Automation                         │
│ ├─ Appeal Processing & Resolution                    │
│ ├─ Neighborhood Profiling & Playbook Docs           │
│ └─ Live Metrics Dashboard (Backend)                  │
│                                                         │
│ 【Lucy + Jiaming - Creator 招募】                     │
│ ├─ Tier 1 Recruitment (Lucy manual input)            │
│ ├─ Tier 2 Group Zoom Batch Creation                 │
│ ├─ Creator Activation Funnel Dashboard              │
│ ├─ Creator Tier Upgrade Logic                        │
│ └─ Creator Performance Metrics                       │
│                                                         │
│ 【用户 负责 - Creator + 其他页面】                    │
│ ├─ Creator App (全部页面)                             │
│ │  ├─ Creator Dashboard                              │
│ │  ├─ Campaign View & Posting                        │
│ │  ├─ Earnings Tracker                               │
│ │  ├─ Tier Upgrade Modal                             │
│ │  └─ Performance Metrics                            │
│ ├─ Loyalty Card (消费者侧)                            │
│ │  ├─ QR Code Scan Page                              │
│ │  ├─ Card View & Stamp Tracker                      │
│ │  ├─ Reward Redemption                              │
│ │  └─ Referral Tracking                              │
│ ├─ Admin Dashboard (其他非上述)                       │
│ │  ├─ Live Metrics Display (Frontend)               │
│ │  ├─ Creator Recruitment Funnel View               │
│ │  ├─ Accuracy Audit Results Display                │
│ │  └─ Investor Verification Package UI              │
│ └─ Landing Page / Marketing (如有变化)               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 周度执行计划 (Week 1-12)

### Week 1: 基础框架 + 方案 1-2 设计

```
【Z - 商家页面】
- [ ] 设计 Weekly Report Widget mockup
- [ ] 创建 merchant/dashboard/weekly-report-widget.tsx
- [ ] 创建 merchant/dashboard/appeals-section.tsx
- [ ] Merchant email template 前端实现

【Jiaming - Admin + 后端】
- [ ] 设计 loyalty_cards, ai_accuracy_audits 数据库表
- [ ] 实现 WeeklyMerchantReportService 基础（数据聚合）
- [ ] 实现 AIVerificationService 的三层阈值逻辑
- [ ] 创建 /api/loyalty/scan endpoint

【用户 - Creator + 消费者】
- [ ] 创建 Loyalty Card 消费者扫码页面
- [ ] 实现 QR 码生成与菜单设计
- [ ] Creator Dashboard 基础布局
- [ ] Loyalty Card View (消费者侧)

【Lucy】
- [ ] 整理 Tier 1 creator 列表（15-20 人）
- [ ] 准备招募脚本和 Early Operator Agreement 模板
```

### Week 2: 方案 1-3 第一阶段

```
【Z - 商家页面】
- [ ] 完成 Weekly Report Widget 的数据绑定
- [ ] 实现周报邮件点击事件处理
- [ ] Escalation Call booking UI
- [ ] QA 和测试

【Jiaming - Admin】
- [ ] 完成 WeeklyMerchantReportService（含邮件发送）
- [ ] 实现自动周报任务 (cron: 每周一 09:00)
- [ ] 实现 MerchantWeeklyReportService.handleMerchantFeedback()
- [ ] 创建 escalation-calls 表和相关 API

【用户 - Creator】
- [ ] 完成 Creator Tier Upgrade UI
- [ ] 实现 CreatorRecruitmentService (Tier 1 创建)
- [ ] 创建 creator/dashboard/tier-upgrade-section.tsx
- [ ] Creator Performance Metrics View

【Lucy】
- [ ] 开始 Tier 1 一对一招募（目标 10 人签署）
- [ ] 发送 Early Operator Agreement 草稿给 creator
```

### Week 3-4: 方案 2-3 持续 + 方案 4 开始

```
【Z - 商家页面】
- [ ] 实现 merchant/dashboard/appeals-section.tsx
- [ ] 完成所有 merchant 相关 UI
- [ ] Mobile responsive 检查

【Jiaming - Admin】
- [ ] 实现 CreatorRecruitmentService.createTier1/2Creators()
- [ ] 实现 CreatorRecruitmentService.getActivationFunnel()
- [ ] 完成 AIVerificationService (verifyCustomerClaim)
- [ ] 实现 /api/verify/accuracy/audit endpoint
- [ ] 创建 escalation call Slack workflow

【用户 - Creator】
- [ ] 实现 creator/dashboard/activation-funnel.tsx (Jiaming 用)
- [ ] 完成 Creator App 的所有页面
- [ ] 实现 loyalty card 相关的 creator 侧数据（recommendations metrics）
- [ ] Loyalty Card Dashboard for Creator

【Lucy + Jiaming】
- [ ] Week 3 Mon: 跑第一场 Group Zoom (Tier 2, 10 people)
- [ ] 处理签署的 agreement
- [ ] Week 4 Mon: 跑第二场 Group Zoom (Tier 2, 10 people)
```

### Week 5-6: 方案 4-5 + Pilot 数据收集

```
【Z - 商家页面】
- [ ] 在 Merchant Dashboard 加入 Pilot data widget
- [ ] 完成所有 merchant 页面的迭代

【Jiaming - Admin】
- [ ] 完成 AIVerificationService 的所有方法
- [ ] 实现精度审计自动化（双周任务）
- [ ] 开始 Pilot 数据分析（segment analysis）
- [ ] 实现 Neighborhood Profiling 逻辑

【用户 - Creator】
- [ ] 完成 Live Metrics Dashboard (Frontend)
- [ ] 实现 Investor Verification Package UI 组件
- [ ] 所有 creator 相关页面的完整实现

【Prum】
- [ ] 收集 Williamsburg Pilot 的初步数据（Week 5 end）
- [ ] 开始 Season 分析（哪些商家是 weekend brunch，哪些是 weekday coffee）
```

### Week 7-8: 融资材料 + 数据验证

```
【Z - 商家页面】
- [ ] 所有 merchant 页面的最终 polish
- [ ] Performance testing

【Jiaming - Admin】
- [ ] 完成 Neighborhood Playbook 文档
- [ ] 生成第一份双周精度审计报告
- [ ] 打包 Investor Verification Package
- [ ] Live metrics 数据实时更新

【用户 - Creator】
- [ ] 所有 creator 页面的完整测试
- [ ] Loyalty Card 完整流程测试
- [ ] Admin Dashboard 的完整数据展示

【融资准备】
- [ ] Jiaming 汇总所有证据（creator agreements, merchant contracts, accuracy reports）
- [ ] 用户准备 investor pitch materials
```

### Week 9-12: 最终完善 + 融资交付

```
【全员】
- [ ] Bug fixing 和优化
- [ ] 性能测试和优化
- [ ] 文档完善
- [ ] Pre-Seed 融资资料最终整理和提交
```

---

## 5. 交付标准与 QA

### Code Quality Standards

```
【前端代码规范】
- TypeScript 严格模式（strictNullChecks: true）
- React Hooks 组件（不用 class）
- 文件组织：
  └─ /app
     └─ /(role)
        └─ /[feature]
           ├─ page.tsx
           ├─ layout.tsx
           ├─ components.tsx
           └─ hooks.ts

【后端代码规范】
- Service 模式（单一职责）
- 错误处理（try-catch + logging）
- API response 统一格式：
  {
    success: boolean,
    data?: any,
    error?: { message: string, code: string },
    meta?: { timestamp: Date }
  }

【数据库】
- 所有表都有 created_at, updated_at
- 外键关系清晰
- Index 建在常用的 WHERE 和 JOIN 列
```

### Testing Standards

```
【必须写单测】
- 所有 Service 类的业务逻辑
- API endpoint 的 happy path 和 error cases
- 工具函数（如 calculateROI, getActivationFunnel）

【必须做集成测试】
- 完整的周报生成流程
- Creator 招募从签署到升级的流程
- AI 验证 + Appeal 的完整流程

【必须做 E2E 测试】
- Merchant：Pilot → Paid 转化
- Creator：Early Operator → T3 升级
- Loyalty Card：扫码 → 获得奖励
```

### Deployment Checklist

```
【每周部署前】
- [ ] 所有 tests passing
- [ ] Staging 环境数据和 prod 一致
- [ ] 无 console errors/warnings
- [ ] 性能 audit (Lighthouse > 80)
- [ ] 安全检查（无暴露的 secrets）
- [ ] Database migration 备份
- [ ] Rollback plan 书写
```

---

## 6. 代码交付 Checklist

每个 Claude Code 会话，交付物应包括：

```
✅ 代码
  ├─ 新增或修改的所有文件
  ├─ 数据库 migration 脚本（如有）
  └─ 部署说明（env vars, etc）

✅ 测试
  ├─ 单元测试代码（Jest）
  ├─ 集成测试覆盖的场景列表
  └─ 测试执行结果 (coverage report)

✅ 文档
  ├─ 代码注释（复杂逻辑）
  ├─ API 文档（新 endpoint）
  ├─ 数据库 schema 文档（新表）
  └─ 部署注意事项

✅ 验收
  ├─ 功能演示（视频或截图）
  ├─ 与本规范的一致性检查
  └─ Known issues（如有）
```

---

**文档结束**

**下一步：** 
1. 将本文档分成 7 个独立的"方案实现 spec"
2. 按 Week 1-12 分配给 Claude Code 逐个实现
3. 每周五进行集成测试和演示

