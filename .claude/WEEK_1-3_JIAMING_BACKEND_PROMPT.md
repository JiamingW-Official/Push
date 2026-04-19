# Push v5.2 — Week 1-3 Claude Code Prompt for Jiaming（后端 + Admin + Service 层）

**目标用户：** Jiaming（Admin UI + 后端服务 + Creator pages）  
**周期：** Week 1-3（Apr 18 - May 2）  
**交付：** 数据库迁移、API 框架、核心 Service 层、Admin Dashboard 初版  
**外部 API：** 无（全用 mock 和本地实现）  
**预计时间：** 48-56 小时

---

## 任务概述

你需要构建 Push v5.2 的整个后端基础设施和 Admin 管理界面。Week 1 重点是数据库和 API 框架，Week 2-3 是核心业务逻辑（AI 验证、周报生成、创作者招募）。

**三周交付物：**

```
Week 1：数据库 + API 框架
├─ /migrations/001-006_*.sql
├─ /api/health.ts
├─ /api/merchant/dashboard.ts
├─ /lib/db/index.ts
└─ /types/*.ts (完整的数据模型)

Week 2-3：服务层 + Admin UI
├─ /lib/services/AIVerificationService.ts
├─ /lib/services/WeeklyMerchantReportService.ts
├─ /lib/services/CreatorRecruitmentService.ts
├─ /api/internal/ai-verify.ts
├─ /api/internal/recruitment-sync.ts
├─ /app/admin/dashboard/page.tsx
└─ /components/admin/*.tsx
```

---

## Week 1：数据库迁移 + API 框架

### Step 1：数据库表设计（30 min）

**文件：** `/migrations/001_loyalty_cards.sql`

```sql
-- 推荐人卡表
CREATE TABLE IF NOT EXISTS loyalty_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  stamp_count INT DEFAULT 0,
  max_stamps INT DEFAULT 10,
  redeemed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (creator_id) REFERENCES creators(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  
  CONSTRAINT unique_card_per_customer_merchant UNIQUE (customer_id, merchant_id)
);

CREATE INDEX idx_loyalty_cards_customer ON loyalty_cards(customer_id);
CREATE INDEX idx_loyalty_cards_merchant ON loyalty_cards(merchant_id);
CREATE INDEX idx_loyalty_cards_creator ON loyalty_cards(creator_id);
```

**文件：** `/migrations/002_ai_accuracy_audits.sql`

```sql
-- AI 验证精度审计表
CREATE TABLE IF NOT EXISTS ai_accuracy_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INT NOT NULL,
  total_auto_verified INT DEFAULT 0,
  false_positive_count INT DEFAULT 0,
  false_negative_count INT DEFAULT 0,
  false_positive_rate DECIMAL(5,2) DEFAULT 0.00,
  false_negative_rate DECIMAL(5,2) DEFAULT 0.00,
  manual_approved INT DEFAULT 0,
  manual_rejected INT DEFAULT 0,
  creator_appeals INT DEFAULT 0,
  average_confidence DECIMAL(5,2),
  audit_date TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_week_audit UNIQUE (week_number)
);

CREATE INDEX idx_audits_week ON ai_accuracy_audits(week_number);
```

**文件：** `/migrations/003_merchant_metrics_weekly.sql`

```sql
-- 商家周报表
CREATE TABLE IF NOT EXISTS merchant_metrics_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  verified_customers INT DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0.00,
  roi DECIMAL(6,2) DEFAULT 0.00,
  creator_count INT DEFAULT 0,
  average_transaction DECIMAL(8,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  
  CONSTRAINT unique_merchant_week UNIQUE (merchant_id, week_start)
);

CREATE INDEX idx_metrics_merchant ON merchant_metrics_weekly(merchant_id);
CREATE INDEX idx_metrics_week_start ON merchant_metrics_weekly(week_start);
```

**文件：** `/migrations/004_creator_recruitment_funnel.sql`

```sql
-- 创作者招募漏斗表
CREATE TABLE IF NOT EXISTS creator_recruitment_funnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  tier INT CHECK (tier IN (1, 2, 3)),
  status VARCHAR(50) CHECK (status IN ('prospect', 'early_operator', 'active', 'churn')),
  recruitment_source VARCHAR(50) CHECK (recruitment_source IN ('direct_network', 'community', 'incentive')),
  signed_date TIMESTAMP,
  performance_score DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (creator_id) REFERENCES creators(id),
  
  CONSTRAINT unique_creator_recruitment UNIQUE (creator_id)
);

CREATE INDEX idx_recruitment_status ON creator_recruitment_funnel(status);
CREATE INDEX idx_recruitment_tier ON creator_recruitment_funnel(tier);
```

**文件：** `/migrations/005_claim_appeals.sql`

```sql
-- 申诉表（Creator 可以申诉被拒的 claims）
CREATE TABLE IF NOT EXISTS claim_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  claim_id UUID NOT NULL,
  appeal_reason TEXT NOT NULL,
  supporting_evidence_url TEXT,
  status VARCHAR(50) CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  merchant_decision TEXT,
  merchant_id_reviewer UUID,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (creator_id) REFERENCES creators(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (claim_id) REFERENCES verified_customer_claims(id)
);

CREATE INDEX idx_appeals_creator ON claim_appeals(creator_id);
CREATE INDEX idx_appeals_status ON claim_appeals(status);
```

**文件：** `/migrations/006_neighborhood_profiles.sql`

```sql
-- 邻域档案表（Pilot 管理）
CREATE TABLE IF NOT EXISTS neighborhood_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_name VARCHAR(100) NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  merchants_target INT DEFAULT 5,
  merchants_current INT DEFAULT 0,
  monthly_target_arr DECIMAL(10,2) DEFAULT 5000.00,
  monthly_current_arr DECIMAL(10,2) DEFAULT 0.00,
  pricing_tier VARCHAR(50),
  seasonality_factor DECIMAL(3,2) DEFAULT 1.00,
  status VARCHAR(50) CHECK (status IN ('planning', 'pilot', 'active', 'mature')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_neighborhood UNIQUE (neighborhood_name)
);

CREATE INDEX idx_neighborhood_status ON neighborhood_profiles(status);
```

**迁移运行脚本（可选）：** `/lib/db/migrate.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 注意：使用 service role key，权限更高
);

export async function runMigrations() {
  const migrationFiles = [
    '001_loyalty_cards.sql',
    '002_ai_accuracy_audits.sql',
    '003_merchant_metrics_weekly.sql',
    '004_creator_recruitment_funnel.sql',
    '005_claim_appeals.sql',
    '006_neighborhood_profiles.sql',
  ];

  for (const file of migrationFiles) {
    const sql = readFileSync(join(process.cwd(), 'migrations', file), 'utf-8');
    const { error } = await supabase.rpc('exec', { sql });
    if (error) {
      console.error(`Migration ${file} failed:`, error);
      throw error;
    }
    console.log(`✅ Migration ${file} successful`);
  }
}
```

---

### Step 2：数据库工具函数（20 min）

**文件：** `/lib/db/index.ts`

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 通用查询函数
export const db = {
  // 基础 CRUD
  async select<T>(table: string, filters?: Record<string, any>): Promise<T[]> {
    let query = supabase.from(table).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  },

  async selectOne<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data as T | null;
  },

  async insert<T>(table: string, data: Record<string, any>): Promise<T> {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return result as T;
  },

  async update<T>(table: string, id: string, data: Record<string, any>): Promise<T> {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result as T;
  },

  async delete(table: string, id: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
```

---

### Step 3：完整数据模型 TypeScript 接口（30 min）

**文件：** `/types/database.ts`

```typescript
// 推荐人卡
export interface LoyaltyCard {
  id: string;
  customer_id: string;
  creator_id: string;
  merchant_id: string;
  stamp_count: number;
  max_stamps: number;
  redeemed_at: string | null;
  created_at: string;
  updated_at: string;
}

// AI 验证结果
export interface VerifiedCustomerClaim {
  id: string;
  merchant_id: string;
  creator_id: string;
  customer_name: string;
  photo_url: string;
  receipt_url: string;
  merchant_lat: number;
  merchant_lon: number;
  customer_lat: number;
  customer_lon: number;
  ai_confidence_score: number;
  ai_decision: 'auto_verified' | 'manual_review_required' | 'rejected';
  manual_review_status: 'pending' | 'approved' | 'rejected' | null;
  claimed_at: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// AI 精度审计
export interface AIAccuracyAudit {
  id: string;
  week_number: number;
  total_auto_verified: number;
  false_positive_count: number;
  false_negative_count: number;
  false_positive_rate: number;
  false_negative_rate: number;
  manual_approved: number;
  manual_rejected: number;
  creator_appeals: number;
  average_confidence: number;
  audit_date: string;
  notes: string | null;
  created_at: string;
}

// 商家周报
export interface MerchantMetricsWeekly {
  id: string;
  merchant_id: string;
  week_start: string; // Date
  week_end: string;   // Date
  verified_customers: number;
  total_revenue: number;
  roi: number;
  creator_count: number;
  average_transaction: number;
  created_at: string;
  updated_at: string;
}

// 创作者招募
export interface CreatorRecruitmentFunnel {
  id: string;
  creator_id: string;
  tier: 1 | 2 | 3;
  status: 'prospect' | 'early_operator' | 'active' | 'churn';
  recruitment_source: 'direct_network' | 'community' | 'incentive';
  signed_date: string | null;
  performance_score: number;
  created_at: string;
  updated_at: string;
}

// 申诉
export interface ClaimAppeal {
  id: string;
  creator_id: string;
  merchant_id: string;
  claim_id: string;
  appeal_reason: string;
  supporting_evidence_url: string | null;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  merchant_decision: string | null;
  merchant_id_reviewer: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

// 邻域档案
export interface NeighborhoodProfile {
  id: string;
  neighborhood_name: string;
  latitude: number | null;
  longitude: number | null;
  merchants_target: number;
  merchants_current: number;
  monthly_target_arr: number;
  monthly_current_arr: number;
  pricing_tier: string | null;
  seasonality_factor: number;
  status: 'planning' | 'pilot' | 'active' | 'mature';
  created_at: string;
  updated_at: string;
}
```

---

### Step 4：API 框架和路由（30 min）

**文件：** `/api/health.ts`

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    // 检查数据库连接
    const { data, error } = await supabase.from('loyalty_cards').select('count', { count: 'exact' });
    
    if (error) {
      return NextResponse.json(
        { status: 'unhealthy', error: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: String(error) },
      { status: 503 }
    );
  }
}
```

**文件：** `/api/merchant/dashboard.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MerchantMetricsWeekly, MerchantMetricsWeekly as Merchant } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const merchantId = request.nextUrl.searchParams.get('merchant_id');
    
    if (!merchantId) {
      return NextResponse.json(
        { error: 'merchant_id is required' },
        { status: 400 }
      );
    }

    // 获取当周指标
    const currentWeek = new Date();
    const weekStart = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const { data: metrics, error } = await supabase
      .from('merchant_metrics_weekly')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('week_start', weekStartStr)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // 返回数据
    return NextResponse.json({
      merchant_id: merchantId,
      current_week: metrics || {
        verified_customers: 0,
        total_revenue: 0,
        roi: 0,
      },
      meta: {
        last_updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching merchant dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**API 路由结构：**

```
/api/
  /health.ts                        (GET: 健康检查)
  /merchant/
    /dashboard.ts                   (GET: 商家仪表板数据)
    /reports/
      /weekly.ts                    (GET: 周报)
    /appeals.ts                     (GET/POST: 申诉)
  /internal/
    /ai-verify.ts                   (POST: AI 验证)
    /recruitment-sync.ts            (POST: 招募漏斗同步)
  /admin/
    /metrics.ts                     (GET: 实时指标用于 Admin 仪表板)
```

---

### Step 5：环境变量和类型（10 min）

**文件：** `.env.local`（更新）

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
```

---

### Step 6：本地测试（20 min）

**测试清单：**

- [ ] 运行 `npm run dev`，无错误
- [ ] GET `/api/health` 返回 200 + `status: healthy`
- [ ] 数据库表都创建成功（在 Supabase 后台看得到）
- [ ] TypeScript 编译无错误（`npm run type-check`）
- [ ] ESLint 检查通过（`npm run lint`）

---

## Week 2-3：核心服务层 + Admin Dashboard

### Step 7：AI 验证服务（Week 2，40 min）

**文件：** `/lib/services/AIVerificationService.ts`

```typescript
import { db } from '@/lib/db';
import { VerifiedCustomerClaim, AIAccuracyAudit } from '@/types/database';

export interface VerificationResult {
  status: 'auto_verified' | 'manual_review_required' | 'rejected';
  confidence_score: number;
  reasoning: string;
}

export class AIVerificationService {
  /**
   * 验证客户声明
   * Week 2：使用 mock 分数，Week 3+ 可集成真实 API
   */
  async verifyCustomerClaim(claim: {
    merchant_id: string;
    creator_id: string;
    customer_name: string;
    photo_url: string;
    receipt_url: string;
    merchant_lat: number;
    merchant_lon: number;
    customer_lat: number;
    customer_lon: number;
  }): Promise<VerificationResult> {
    // Week 2：Mock 分数（模拟 Vision, OCR, Geo 分析）
    const visionScore = this.mockVisionAnalysis();
    const ocrScore = this.mockOCRAnalysis();
    const geoScore = this.mockGeoAnalysis(
      claim.merchant_lat,
      claim.merchant_lon,
      claim.customer_lat,
      claim.customer_lon
    );

    const finalScore = (visionScore + ocrScore + geoScore) / 3;

    let status: VerificationResult['status'];
    if (finalScore >= 0.85) {
      status = 'auto_verified';
    } else if (finalScore >= 0.65) {
      status = 'manual_review_required';
    } else {
      status = 'rejected';
    }

    return {
      status,
      confidence_score: parseFloat(finalScore.toFixed(3)),
      reasoning: `Vision: ${visionScore.toFixed(2)}, OCR: ${ocrScore.toFixed(2)}, Geo: ${geoScore.toFixed(2)}`,
    };
  }

  /**
   * Mock Vision 分析（真实版会调用 Google Cloud Vision API）
   */
  private mockVisionAnalysis(): number {
    // 返回 0.6 - 0.95 之间的随机分数
    return 0.6 + Math.random() * 0.35;
  }

  /**
   * Mock OCR 分析（真实版会调用 Google Cloud Vision OCR）
   */
  private mockOCRAnalysis(): number {
    // 返回 0.55 - 0.95 之间的随机分数
    return 0.55 + Math.random() * 0.4;
  }

  /**
   * Mock Geo 分析（检查 GPS 坐标）
   */
  private mockGeoAnalysis(
    merchantLat: number,
    merchantLon: number,
    customerLat: number,
    customerLon: number
  ): number {
    // 计算两点之间的距离（Haversine 公式）
    const distance = this.calculateDistance(merchantLat, merchantLon, customerLat, customerLon);
    
    // 如果距离 > 500m，分数低；否则高
    if (distance > 500) {
      return 0.3; // 可能不在地理范围内
    } else if (distance > 100) {
      return 0.7; // 合理距离
    } else {
      return 0.95; // 很接近
    }
  }

  /**
   * 计算两点之间的距离（返回米数）
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // 地球半径（米）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 保存验证结果到数据库
   */
  async saveVerification(
    claimId: string,
    result: VerificationResult
  ): Promise<void> {
    await db.update('verified_customer_claims', claimId, {
      ai_confidence_score: result.confidence_score,
      ai_decision: result.status,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * 获取周度精度审计数据
   */
  async getWeeklyAccuracyAudit(weekNumber: number): Promise<AIAccuracyAudit | null> {
    const audits = await db.select<AIAccuracyAudit>(
      'ai_accuracy_audits',
      { week_number: weekNumber }
    );
    return audits[0] || null;
  }

  /**
   * 记录周度审计（通常在周末自动运行）
   */
  async recordWeeklyAudit(weekNumber: number): Promise<AIAccuracyAudit> {
    // 获取该周的所有 claims
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // 周一
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // 下周一

    // 计算统计数据
    const { data: claims } = await supabase
      .from('verified_customer_claims')
      .select('ai_decision, manual_review_status')
      .gte('verified_at', startDate.toISOString())
      .lt('verified_at', endDate.toISOString());

    const totalAutoVerified = claims?.filter(c => c.ai_decision === 'auto_verified').length || 0;
    const manualReviewed = claims?.filter(c => c.manual_review_status).length || 0;

    // 创建审计记录
    return db.insert<AIAccuracyAudit>('ai_accuracy_audits', {
      week_number: weekNumber,
      total_auto_verified: totalAutoVerified,
      false_positive_count: 0, // Week 2 手动输入
      false_negative_count: 0,
      false_positive_rate: 0,
      false_negative_rate: 0,
      manual_approved: manualReviewed,
      manual_rejected: 0,
      creator_appeals: 0,
      average_confidence: 0.87,
      notes: `Week ${weekNumber} audit - automated`,
    });
  }
}
```

**API 端点：** `/api/internal/ai-verify.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AIVerificationService } from '@/lib/services/AIVerificationService';

const aiService = new AIVerificationService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await aiService.verifyCustomerClaim({
      merchant_id: body.merchant_id,
      creator_id: body.creator_id,
      customer_name: body.customer_name,
      photo_url: body.photo_url,
      receipt_url: body.receipt_url,
      merchant_lat: body.merchant_lat,
      merchant_lon: body.merchant_lon,
      customer_lat: body.customer_lat,
      customer_lon: body.customer_lon,
    });

    // 保存到数据库
    if (body.claim_id) {
      await aiService.saveVerification(body.claim_id, result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
```

---

### Step 8：商家周报服务（Week 2，30 min）

**文件：** `/lib/services/WeeklyMerchantReportService.ts`

```typescript
import { db } from '@/lib/db';
import { MerchantMetricsWeekly } from '@/types/database';
import { supabase } from '@/lib/db';

export interface MerchantWeeklyReport {
  merchant_id: string;
  week_start: string;
  verified_customers: number;
  total_revenue: number;
  roi: number;
  top_creators: Array<{
    name: string;
    contribution_count: number;
    contribution_pct: number;
  }>;
}

export class WeeklyMerchantReportService {
  /**
   * 生成商家周报（手动或定时）
   */
  async generateWeeklyReport(
    merchantId: string,
    weekStart: Date
  ): Promise<MerchantWeeklyReport> {
    // 计算周范围
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // 1. 获取本周的 verified customers
    const { data: customerClaims } = await supabase
      .from('verified_customer_claims')
      .select('*')
      .eq('merchant_id', merchantId)
      .gte('verified_at', weekStart.toISOString())
      .lt('verified_at', weekEnd.toISOString())
      .eq('manual_review_status', 'approved');

    const verifiedCount = customerClaims?.length || 0;

    // 2. 计算收入（简化版：verified_count * avg_price）
    const avgPrice = 12.5; // 假设平均价格
    const totalRevenue = verifiedCount * avgPrice;

    // 3. 计算 ROI（收入 / 获客成本）
    const acquisitionCost = 150; // 假设固定成本
    const roi = acquisitionCost > 0 ? (totalRevenue - acquisitionCost) / acquisitionCost * 100 : 0;

    // 4. 获取 Top creators
    const { data: creatorContributions } = await supabase
      .from('loyalty_cards')
      .select('creator_id, id')
      .eq('merchant_id', merchantId)
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString());

    // 计算创作者贡献度
    const creatorMap = new Map<string, number>();
    creatorContributions?.forEach(card => {
      const count = creatorMap.get(card.creator_id) || 0;
      creatorMap.set(card.creator_id, count + 1);
    });

    const topCreators = Array.from(creatorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([creatorId, count]) => ({
        name: `Creator ${creatorId.slice(0, 8)}`, // 简化版
        contribution_count: count,
        contribution_pct: (count / verifiedCount) * 100,
      }));

    // 5. 保存到数据库
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const report = await db.insert<MerchantMetricsWeekly>(
      'merchant_metrics_weekly',
      {
        merchant_id: merchantId,
        week_start: weekStartStr,
        week_end: weekEndStr,
        verified_customers: verifiedCount,
        total_revenue: totalRevenue,
        roi: parseFloat(roi.toFixed(2)),
        creator_count: creatorMap.size,
        average_transaction: verifiedCount > 0 ? totalRevenue / verifiedCount : 0,
      }
    );

    return {
      merchant_id: merchantId,
      week_start: weekStartStr,
      verified_customers: verifiedCount,
      total_revenue: totalRevenue,
      roi: parseFloat(roi.toFixed(2)),
      top_creators: topCreators,
    };
  }

  /**
   * 获取已生成的周报
   */
  async getWeeklyReport(merchantId: string, weekStart: string): Promise<MerchantMetricsWeekly | null> {
    const reports = await db.select<MerchantMetricsWeekly>(
      'merchant_metrics_weekly',
      { merchant_id: merchantId, week_start: weekStart }
    );
    return reports[0] || null;
  }

  /**
   * 生成周报邮件内容（简化版，Week 2 不发邮件）
   */
  private formatReportEmail(report: MerchantWeeklyReport): string {
    return `
Week Report - ${report.week_start}

Verified Customers: ${report.verified_customers}
Revenue: $${report.total_revenue.toFixed(2)}
ROI: ${report.roi.toFixed(1)}%

Top Creators:
${report.top_creators.map(c => `- ${c.name}: ${c.contribution_count} referrals (${c.contribution_pct.toFixed(1)}%)`).join('\n')}
    `;
  }
}
```

**API 端点：** `/api/merchant/reports/weekly.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { WeeklyMerchantReportService } from '@/lib/services/WeeklyMerchantReportService';

const reportService = new WeeklyMerchantReportService();

export async function GET(request: NextRequest) {
  try {
    const merchantId = request.nextUrl.searchParams.get('merchant_id');
    const weekStart = request.nextUrl.searchParams.get('week_start');

    if (!merchantId || !weekStart) {
      return NextResponse.json(
        { error: 'merchant_id and week_start are required' },
        { status: 400 }
      );
    }

    const report = await reportService.getWeeklyReport(merchantId, weekStart);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const report = await reportService.generateWeeklyReport(
      body.merchant_id,
      new Date(body.week_start)
    );

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### Step 9：创作者招募服务（Week 3，30 min）

**文件：** `/lib/services/CreatorRecruitmentService.ts`

```typescript
import { db } from '@/lib/db';
import { CreatorRecruitmentFunnel } from '@/types/database';

export type CreatorTier = 1 | 2 | 3;
export type RecruitmentSource = 'direct_network' | 'community' | 'incentive';

export class CreatorRecruitmentService {
  /**
   * 创建 Tier 1 创作者（直接招募）
   */
  async createTier1Creator(creatorId: string, source: RecruitmentSource): Promise<CreatorRecruitmentFunnel> {
    return db.insert<CreatorRecruitmentFunnel>('creator_recruitment_funnel', {
      creator_id: creatorId,
      tier: 1,
      status: 'active',
      recruitment_source: source,
      signed_date: new Date().toISOString(),
      performance_score: 0,
    });
  }

  /**
   * 创建 Tier 2 创作者（社区参与）
   */
  async createTier2Creator(creatorId: string, source: RecruitmentSource): Promise<CreatorRecruitmentFunnel> {
    return db.insert<CreatorRecruitmentFunnel>('creator_recruitment_funnel', {
      creator_id: creatorId,
      tier: 2,
      status: 'early_operator',
      recruitment_source: source,
      signed_date: null,
      performance_score: 0,
    });
  }

  /**
   * 创建 Tier 3 创作者（激励驱动）
   */
  async createTier3Creator(creatorId: string, source: RecruitmentSource): Promise<CreatorRecruitmentFunnel> {
    return db.insert<CreatorRecruitmentFunnel>('creator_recruitment_funnel', {
      creator_id: creatorId,
      tier: 3,
      status: 'prospect',
      recruitment_source: source,
      signed_date: null,
      performance_score: 0,
    });
  }

  /**
   * 升级创作者 tier（基于性能分数）
   */
  async upgradeCreatorTier(creatorId: string): Promise<CreatorRecruitmentFunnel | null> {
    const creator = await db.selectOne<CreatorRecruitmentFunnel>(
      'creator_recruitment_funnel',
      creatorId
    );

    if (!creator) return null;

    // 升级条件（简化版）
    const upgradeThreshold = {
      1: 50, // T1 -> T2 when score >= 50
      2: 75, // T2 -> T3 when score >= 75
    };

    if (creator.tier < 3) {
      const threshold = upgradeThreshold[creator.tier as keyof typeof upgradeThreshold];
      if (creator.performance_score >= threshold) {
        return db.update<CreatorRecruitmentFunnel>(
          'creator_recruitment_funnel',
          creatorId,
          {
            tier: Math.min(creator.tier + 1, 3) as CreatorTier,
            status: creator.tier === 1 ? 'early_operator' : 'active',
          }
        );
      }
    }

    return creator;
  }

  /**
   * 更新创作者性能分数
   */
  async updatePerformanceScore(creatorId: string, newScore: number): Promise<void> {
    await db.update('creator_recruitment_funnel', creatorId, {
      performance_score: Math.min(100, Math.max(0, newScore)),
    });

    // 检查是否需要升级
    await this.upgradeCreatorTier(creatorId);
  }

  /**
   * 获取创作者招募漏斗统计
   */
  async getFunnelStats(): Promise<{
    t1_count: number;
    t2_count: number;
    t3_count: number;
    active_count: number;
    churn_count: number;
  }> {
    const all = await db.select<CreatorRecruitmentFunnel>('creator_recruitment_funnel');

    return {
      t1_count: all.filter(c => c.tier === 1).length,
      t2_count: all.filter(c => c.tier === 2).length,
      t3_count: all.filter(c => c.tier === 3).length,
      active_count: all.filter(c => c.status === 'active').length,
      churn_count: all.filter(c => c.status === 'churn').length,
    };
  }
}
```

**API 端点：** `/api/internal/recruitment-sync.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { CreatorRecruitmentService } from '@/lib/services/CreatorRecruitmentService';

const recruitmentService = new CreatorRecruitmentService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, creator_id, new_score } = body;

    if (action === 'update_score') {
      await recruitmentService.updatePerformanceScore(creator_id, new_score);
      return NextResponse.json({ success: true });
    }

    if (action === 'upgrade') {
      const updated = await recruitmentService.upgradeCreatorTier(creator_id);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Recruitment sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### Step 10：Admin Dashboard UI（Week 3，40 min）

**文件：** `/app/admin/dashboard/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { CreatorRecruitmentService } from '@/lib/services/CreatorRecruitmentService';
import { AIVerificationService } from '@/lib/services/AIVerificationService';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    merchants: 0,
    creators: 0,
    verified_customers: 0,
    monthly_mrr: 0,
    ai_accuracy: 0,
    slr: 0,
  });

  const [funnelStats, setFunnelStats] = useState({
    t1_count: 0,
    t2_count: 0,
    t3_count: 0,
    active_count: 0,
  });

  useEffect(() => {
    // Mock 数据加载
    const loadMetrics = async () => {
      const recruitmentService = new CreatorRecruitmentService();
      const stats = await recruitmentService.getFunnelStats();
      
      setFunnelStats(stats);
      setMetrics({
        merchants: 12,
        creators: stats.active_count + stats.t2_count + stats.t3_count,
        verified_customers: 487,
        monthly_mrr: 12450,
        ai_accuracy: 88.3,
        slr: 16.5,
      });
    };

    loadMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f2ec] p-8">
      <h1 className="text-3xl font-bold text-[#003049] mb-12" style={{ fontFamily: 'Darky' }}>
        🔧 Admin Dashboard
      </h1>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <MetricCard label="Active Merchants" value={metrics.merchants} />
        <MetricCard label="Active Creators" value={metrics.creators} />
        <MetricCard label="Monthly Verified" value={metrics.verified_customers} />
        <MetricCard label="Monthly MRR" value={`$${metrics.monthly_mrr}`} />
        <MetricCard label="AI Accuracy" value={`${metrics.ai_accuracy}%`} />
        <MetricCard label="SLR" value={metrics.slr.toFixed(1)} />
      </div>

      {/* Funnel Stats */}
      <div className="bg-white border border-[#d0d0d0] p-8 rounded-none">
        <h2 className="text-lg font-bold text-[#003049] mb-6" style={{ fontFamily: 'Darky' }}>
          Creator Recruitment Funnel
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Tier 1 (Direct):</span>
            <span className="font-bold text-[#c1121f]">{funnelStats.t1_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tier 2 (Community):</span>
            <span className="font-bold text-[#c1121f]">{funnelStats.t2_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tier 3 (Incentive):</span>
            <span className="font-bold text-[#c1121f]">{funnelStats.t3_count}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span>Active:</span>
            <span className="font-bold text-green-600">{funnelStats.active_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-white border border-[#d0d0d0] p-8 rounded-none">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#c1121f]" style={{ fontFamily: 'Darky' }}>
        {value}
      </p>
    </div>
  );
}
```

---

## Week 1-3 完成清单

### Week 1：数据库 + 框架

✅ **数据库（6 张表）：**
- [ ] loyalty_cards
- [ ] ai_accuracy_audits
- [ ] merchant_metrics_weekly
- [ ] creator_recruitment_funnel
- [ ] claim_appeals
- [ ] neighborhood_profiles

✅ **API 框架：**
- [ ] `/api/health` 工作
- [ ] `/api/merchant/dashboard` 可调用
- [ ] 所有路由都有 TypeScript 类型

✅ **工具函数：**
- [ ] `/lib/db/index.ts` 基础 CRUD 封装
- [ ] `/types/database.ts` 所有数据模型完整

✅ **代码质量：**
- [ ] 无 TypeScript 错误
- [ ] ESLint 通过
- [ ] 可以本地运行 `npm run dev`

---

### Week 2-3：服务层 + Admin UI

✅ **Service 实现（3 个）：**
- [ ] `AIVerificationService` - 验证逻辑 + Mock 分数
- [ ] `WeeklyMerchantReportService` - 周报生成逻辑
- [ ] `CreatorRecruitmentService` - 创作者漏斗管理

✅ **API 端点（5 个）：**
- [ ] `/api/internal/ai-verify` 可接收请求
- [ ] `/api/merchant/reports/weekly` 可生成报告
- [ ] `/api/internal/recruitment-sync` 可更新性能分数
- [ ] 所有端点返回正确的 JSON 格式

✅ **Admin UI：**
- [ ] Admin Dashboard 页面在 `/admin/dashboard` 能访问
- [ ] 显示 6 个 KPI 卡片
- [ ] 显示创作者招募漏斗统计

✅ **单元测试：**
- [ ] AIVerificationService 有基础测试
- [ ] WeeklyMerchantReportService 有基础测试
- [ ] CreatorRecruitmentService 有基础测试

✅ **集成测试：**
- [ ] 完整流程可跑通：create creator → update score → check tier upgrade
- [ ] 完整流程可跑通：generate weekly report → query → verify data

---

## 提交清单（周五晚）

**Week 1 提交：**

```
/lib/db/index.ts
/lib/db/migrate.ts
/types/database.ts
/migrations/001-006_*.sql
/api/health.ts
/api/merchant/dashboard.ts
```

**Week 2 提交：**

```
/lib/services/AIVerificationService.ts
/lib/services/WeeklyMerchantReportService.ts
/api/internal/ai-verify.ts
/api/merchant/reports/weekly.ts
```

**Week 3 提交：**

```
/lib/services/CreatorRecruitmentService.ts
/api/internal/recruitment-sync.ts
/app/admin/dashboard/page.tsx
/components/admin/MetricCard.tsx
```

---

## 遇到问题？

**Q1：Supabase 连接失败**

A：检查 `.env.local` 中的 URL 和 key。确保 Supabase 项目已创建并有互联网连接。

**Q2：类型错误（`Cannot find module ...`）**

A：运行 `npm run type-check`，按错误提示添加缺失的类型定义。

**Q3：API 返回 500 错误**

A：检查 server 日志（`npm run dev` 的终端输出）。确保数据库表已创建。

---

**开始时间：** 2026-04-19（周五）  
**Week 1 检查点：** 2026-04-25（周四晚）  
**Week 2 检查点：** 2026-05-02（周四晚）  
**Week 3 检查点：** 2026-05-09（周四晚）
