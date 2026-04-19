# Push v5.2 — Week 1 Claude Code Prompt for Z（商家 Dashboard 框架）

**目标用户：** Z（商家侧前端）  
**周期：** Week 1（Apr 18-25）  
**交付：** 商家 Dashboard 页面 + 基础组件 + DB 连接框架  
**外部 API：** 无（全用 mock 数据）  
**预计时间：** 16-20 小时

---

## 任务概述

你需要为 Push 商家侧构建首个 Dashboard 页面。商家登陆后会看到一个空的但结构完整的仪表板，显示本周的 KPI 卡片、图表框架，以及从 Supabase 拉取的历史数据。

**核心交付物：**

```
/app/merchant/dashboard/page.tsx          (主页面)
/components/merchant/DashboardHeader.tsx  (顶部导航)
/components/merchant/MetricsCard.tsx      (KPI 卡片)
/components/merchant/WeeklyChart.tsx      (Recharts 图表)
/lib/hooks/useMerchantMetrics.ts          (React Query hook)
/lib/mocks/merchantData.ts                (Mock 数据)
/types/merchant.ts                        (TypeScript 接口)
```

---

## 详细步骤

### Step 1：创建 TypeScript 接口（10 min）

**文件：** `/types/merchant.ts`

```typescript
// 商家基础信息
export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'T1' | 'T2' | 'T3';
  aoV: number; // Average Order Value
  verified_customers_cumulative: number;
  created_at: Date;
}

// 周度指标
export interface MerchantMetricsWeekly {
  week_start: Date;
  week_end: Date;
  verified_customers: number;      // 本周新增
  total_revenue: number;            // 本周总收入
  roi: number;                      // %
  average_transaction: number;
  top_creators: CreatorSummary[];
  daily_metrics: DailyMetric[];
}

export interface CreatorSummary {
  id: string;
  name: string;
  avatar_url?: string;
  contribution_count: number;
  contribution_pct: number;
}

export interface DailyMetric {
  date: Date;
  verified_customers: number;
  revenue: number;
  campaigns_active: number;
}

// API 响应类型
export interface MerchantDashboardResponse {
  merchant: Merchant;
  current_week: MerchantMetricsWeekly;
  previous_weeks: MerchantMetricsWeekly[];
  metadata: {
    last_updated: Date;
    data_source: 'mock' | 'database';
  };
}
```

---

### Step 2：创建 Mock 数据（15 min）

**文件：** `/lib/mocks/merchantData.ts`

```typescript
import { Merchant, MerchantMetricsWeekly, MerchantDashboardResponse } from '@/types/merchant';

export const mockMerchant: Merchant = {
  id: 'merchant_001',
  name: 'Brew Haven Coffee',
  email: 'owner@brewhaven.com',
  phone: '+1-555-0123',
  tier: 'T2',
  aoV: 12.5,
  verified_customers_cumulative: 187,
  created_at: new Date('2026-02-01'),
};

export const mockCurrentWeekMetrics: MerchantMetricsWeekly = {
  week_start: new Date('2026-04-14'),
  week_end: new Date('2026-04-20'),
  verified_customers: 23,
  total_revenue: 287.50,
  roi: 85.2,
  average_transaction: 12.50,
  top_creators: [
    {
      id: 'creator_1',
      name: 'Sarah Chen',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      contribution_count: 8,
      contribution_pct: 34.8,
    },
    {
      id: 'creator_2',
      name: 'Mike Johnson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      contribution_count: 5,
      contribution_pct: 21.7,
    },
    {
      id: 'creator_3',
      name: 'Alex Wong',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      contribution_count: 4,
      contribution_pct: 17.4,
    },
  ],
  daily_metrics: [
    { date: new Date('2026-04-14'), verified_customers: 3, revenue: 37.50, campaigns_active: 2 },
    { date: new Date('2026-04-15'), verified_customers: 4, revenue: 50.00, campaigns_active: 2 },
    { date: new Date('2026-04-16'), verified_customers: 5, revenue: 62.50, campaigns_active: 3 },
    { date: new Date('2026-04-17'), verified_customers: 4, revenue: 50.00, campaigns_active: 3 },
    { date: new Date('2026-04-18'), verified_customers: 3, revenue: 37.50, campaigns_active: 2 },
    { date: new Date('2026-04-19'), verified_customers: 2, revenue: 25.00, campaigns_active: 1 },
    { date: new Date('2026-04-20'), verified_customers: 2, revenue: 25.00, campaigns_active: 1 },
  ],
};

export const mockPreviousWeeksMetrics: MerchantMetricsWeekly[] = [
  {
    week_start: new Date('2026-04-07'),
    week_end: new Date('2026-04-13'),
    verified_customers: 19,
    total_revenue: 237.50,
    roi: 71.3,
    average_transaction: 12.50,
    top_creators: [],
    daily_metrics: [],
  },
  {
    week_start: new Date('2026-03-31'),
    week_end: new Date('2026-04-06'),
    verified_customers: 21,
    total_revenue: 262.50,
    roi: 79.1,
    average_transaction: 12.50,
    top_creators: [],
    daily_metrics: [],
  },
];

export const mockDashboardResponse: MerchantDashboardResponse = {
  merchant: mockMerchant,
  current_week: mockCurrentWeekMetrics,
  previous_weeks: mockPreviousWeeksMetrics,
  metadata: {
    last_updated: new Date(),
    data_source: 'mock',
  },
};

// 导出一个函数用来延迟返回数据（模拟网络延迟）
export const fetchMerchantDashboardMock = async (merchantId: string): Promise<MerchantDashboardResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // 500ms 延迟
  return mockDashboardResponse;
};
```

---

### Step 3：创建 React Query Hook（20 min）

**文件：** `/lib/hooks/useMerchantMetrics.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { MerchantDashboardResponse } from '@/types/merchant';
import { fetchMerchantDashboardMock } from '@/lib/mocks/merchantData';

export const useMerchantMetrics = (merchantId: string) => {
  return useQuery({
    queryKey: ['merchant', merchantId],
    queryFn: async () => {
      // Week 1：仅用 mock 数据
      // 实际环境会调用 /api/merchant/dashboard
      const data = await fetchMerchantDashboardMock(merchantId);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 分钟内不重新fetch
    gcTime: 10 * 60 * 1000,   // 10 分钟后回收
  });
};
```

---

### Step 4：创建 MetricsCard 组件（15 min）

**文件：** `/components/merchant/MetricsCard.tsx`

遵循 Design.md 规范：

```typescript
'use client';

interface MetricsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const MetricsCard = ({
  label,
  value,
  icon,
  trend,
  trendValue,
  variant = 'primary',
}: MetricsCardProps) => {
  // Design.md 规范：
  // - 背景：Pearl Stone #f5f2ec（primary）/ White #ffffff（secondary）
  // - 边框：直角，无圆角
  // - 文字：Darky（标题）+ CS Genio Mono（数值）
  // - 间距：8px 基础网格

  const bgColor = variant === 'secondary' ? 'bg-white' : 'bg-[#f5f2ec]';
  const textColor = 'text-[#003049]'; // Deep Space Blue
  const valueColor = 'text-[#780000]'; // Molten Lava

  return (
    <div className={`${bgColor} border border-[#d0d0d0] p-8 w-full`}>
      {/* 标签 + 图标 */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-medium tracking-wider" style={{ fontFamily: 'CS Genio Mono' }}>
          {label.toUpperCase()}
        </h3>
        {icon && <div className="text-[#669bbc]">{icon}</div>}
      </div>

      {/* 主数值 */}
      <div className="mb-4">
        <p className={`text-3xl font-bold ${valueColor}`} style={{ fontFamily: 'Darky' }}>
          {value}
        </p>
      </div>

      {/* 趋势 */}
      {trend && trendValue && (
        <div className="flex items-center gap-2">
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
          <span className="text-xs text-gray-600">{trendValue}</span>
        </div>
      )}
    </div>
  );
};
```

---

### Step 5：创建 DashboardHeader 组件（15 min）

**文件：** `/components/merchant/DashboardHeader.tsx`

```typescript
'use client';

import { useAuth } from '@clerk/nextjs';
import { Merchant } from '@/types/merchant';

interface DashboardHeaderProps {
  merchant: Merchant;
}

export const DashboardHeader = ({ merchant }: DashboardHeaderProps) => {
  const { signOut } = useAuth();

  return (
    <header className="bg-[#c1121f] text-white px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo + 商家名字 */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Darky' }}>
            ☕ Push
          </h1>
          <div className="border-l border-white/30 pl-4">
            <p className="text-lg font-semibold">{merchant.name}</p>
            <p className="text-sm text-white/80">Tier {merchant.tier}</p>
          </div>
        </div>

        {/* 右侧：快速操作 */}
        <div className="flex items-center gap-6">
          <div className="text-right text-sm">
            <p className="text-white/80">Logged in as</p>
            <p className="font-semibold">{merchant.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-white text-[#c1121f] px-6 py-2 font-medium hover:bg-gray-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
```

---

### Step 6：创建 WeeklyChart 组件（20 min）

**文件：** `/components/merchant/WeeklyChart.tsx`

使用 Recharts：

```typescript
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyMetric } from '@/types/merchant';

interface WeeklyChartProps {
  data: DailyMetric[];
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  // 格式化数据以供 Recharts 使用
  const chartData = data.map(metric => ({
    date: metric.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: metric.revenue,
    customers: metric.verified_customers,
  }));

  return (
    <div className="bg-white border border-[#d0d0d0] p-8 rounded-none">
      <h2 className="text-lg font-semibold mb-6 text-[#003049]" style={{ fontFamily: 'Darky' }}>
        Weekly Performance
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="0" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: 0,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#c1121f"
            strokeWidth={2}
            name="Revenue ($)"
            dot={{ fill: '#c1121f', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="customers"
            stroke="#669bbc"
            strokeWidth={2}
            name="Customers"
            dot={{ fill: '#669bbc', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

---

### Step 7：创建 Dashboard 主页面（25 min）

**文件：** `/app/merchant/dashboard/page.tsx`

```typescript
'use client';

import { useAuth } from '@clerk/nextjs';
import { useMerchantMetrics } from '@/lib/hooks/useMerchantMetrics';
import { DashboardHeader } from '@/components/merchant/DashboardHeader';
import { MetricsCard } from '@/components/merchant/MetricsCard';
import { WeeklyChart } from '@/components/merchant/WeeklyChart';

export default function MerchantDashboard() {
  const { userId } = useAuth();

  // Week 1：使用 mock merchant ID
  const merchantId = userId || 'merchant_001';
  const { data: dashboardData, isLoading, error } = useMerchantMetrics(merchantId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <p className="text-lg text-[#003049]">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <p className="text-lg text-[#c1121f]">Error loading dashboard</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <p className="text-lg text-[#003049]">No data available</p>
      </div>
    );
  }

  const { merchant, current_week } = dashboardData;

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      {/* Header */}
      <DashboardHeader merchant={merchant} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* 周度汇总 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#003049] mb-8" style={{ fontFamily: 'Darky' }}>
            This Week (Apr 14-20)
          </h2>

          {/* KPI 卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <MetricsCard
              label="Verified Customers"
              value={current_week.verified_customers}
              variant="primary"
              trend="up"
              trendValue="+21% vs last week"
            />
            <MetricsCard
              label="Weekly Revenue"
              value={`$${current_week.total_revenue.toFixed(2)}`}
              variant="secondary"
              trend="up"
              trendValue="+$50 vs last week"
            />
            <MetricsCard
              label="ROI"
              value={`${current_week.roi.toFixed(1)}%`}
              variant="primary"
              trend="up"
              trendValue="+14% vs last week"
            />
            <MetricsCard
              label="Avg Transaction"
              value={`$${current_week.average_transaction.toFixed(2)}`}
              variant="secondary"
            />
          </div>

          {/* 周度图表 */}
          <WeeklyChart data={current_week.daily_metrics} />
        </section>

        {/* Top Creators 预览 */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#003049] mb-6" style={{ fontFamily: 'Darky' }}>
            Top Creators This Week
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {current_week.top_creators.map(creator => (
              <div key={creator.id} className="bg-white border border-[#d0d0d0] p-6">
                <div className="flex items-center gap-4 mb-4">
                  {creator.avatar_url && (
                    <img
                      src={creator.avatar_url}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-[#003049]">{creator.name}</p>
                    <p className="text-sm text-gray-600">{creator.contribution_count} referrals</p>
                  </div>
                </div>
                <div className="w-full bg-[#f5f2ec] rounded-none h-2 mb-2">
                  <div
                    className="bg-[#669bbc] h-2"
                    style={{ width: `${creator.contribution_pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{creator.contribution_pct.toFixed(1)}% of week</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 border-t border-[#d0d0d0] pt-8">
          <p>Last updated: {dashboardData.metadata.last_updated.toLocaleString()}</p>
          <p>Data source: {dashboardData.metadata.data_source}</p>
        </div>
      </main>
    </div>
  );
}
```

---

### Step 8：添加路由与测试（15 min）

**确保文件结构：**

```
/app/merchant/
  /dashboard/
    page.tsx          ← 你创建的主页面
  layout.tsx          ← 需要确保存在（navigation, auth check）
```

**本地测试清单：**

- [ ] 运行 `npm run dev`，导航到 `/merchant/dashboard`
- [ ] 页面加载，显示 mock 数据（无红色错误）
- [ ] KPI 卡片显示正确的数值
- [ ] 图表正确渲染（7 条数据点）
- [ ] Top Creators 头像加载（DiceBear API）
- [ ] 响应式设计工作（打开 DevTools，缩放到 mobile）
- [ ] 所有样式遵循 Design.md（颜色、间距、字体）

---

### Step 9：ESLint + Prettier 检查（10 min）

```bash
npm run lint
npm run lint:fix
npm run type-check
```

**常见问题：**

- `Missing return type` → 在函数前加 `: JSX.Element`
- `Unused imports` → 删除未使用的导入
- `Missing dependency` → 检查 React Query 的 dependency array

---

## Week 1 完成标准

✅ **功能完整性：**
- [ ] Dashboard 页面在 `/merchant/dashboard` 能访问
- [ ] 从 mock 数据正确读取并展示
- [ ] 所有 4 个 KPI 卡片显示正确的数值
- [ ] 周度图表能正确展示 7 天的数据
- [ ] Top Creators 列表显示最多 3 人

✅ **设计一致性（Design.md）：**
- [ ] 背景色：Pearl Stone `#f5f2ec`
- [ ] Header 背景：Flag Red `#c1121f`，白字
- [ ] KPI 卡片文字：Deep Space Blue `#003049` 标题，Molten Lava `#780000` 数值
- [ ] 所有元素直角，无圆角（除非特殊）
- [ ] 间距都是 8px 的倍数（p-8, gap-8 等）
- [ ] 字体：Darky（标题）+ CS Genio Mono（标签/数值）

✅ **代码质量：**
- [ ] 无 console 错误或警告
- [ ] ESLint 检查通过
- [ ] TypeScript 类型检查通过（`npm run type-check`）
- [ ] 响应式在 mobile/tablet/desktop 都工作

✅ **性能：**
- [ ] 页面加载时间 < 2s
- [ ] Lighthouse score ≥ 75

---

## 提交清单

**周五晚上提交：**

```
/app/merchant/dashboard/page.tsx
/components/merchant/DashboardHeader.tsx
/components/merchant/MetricsCard.tsx
/components/merchant/WeeklyChart.tsx
/lib/hooks/useMerchantMetrics.ts
/lib/mocks/merchantData.ts
/types/merchant.ts
```

**提交说明：**

```
feat: Add merchant dashboard scaffold with KPI cards and weekly chart

- Create dashboard page at /merchant/dashboard
- Implement DashboardHeader with merchant info and logout
- Build reusable MetricsCard component (with trend indicators)
- Add WeeklyChart component using Recharts
- Create useMerchantMetrics React Query hook
- Mock data structure for current and previous weeks
- All styles follow Design.md (colors, spacing, fonts)
- Responsive design (mobile/tablet/desktop)
- All interfaces properly typed (TypeScript)
```

---

## 遇到问题？

**Q1：我的样式不对，颜色和 Design.md 不一样**

A：打开 Design.md，复制准确的 Tailwind 颜色代码。例如：`bg-[#c1121f]` 而不是 `bg-red-600`

**Q2：我的图表没有数据**

A：检查 `/lib/mocks/merchantData.ts` 中的 `daily_metrics` 数组是否有数据。确保日期格式正确。

**Q3：Recharts 不显示**

A：确保 `ResponsiveContainer` 的高度有设置（height={300}）。检查浏览器控制台是否有错误。

**Q4：我的响应式布局不工作**

A：使用 Tailwind 的 `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` 语法。在移动设备上测试（DevTools 或真实设备）。

---

## 下周预告（Week 2-3）

Z 将在 Week 2-3 中：
- 添加 Weekly Report Widget（展示上周的完整快照）
- 添加 Top Creators Table（可排序）
- 添加 Report 详情页面（可下载 PDF）
- 连接到真实 API endpoint（`/api/merchant/reports/weekly`）

Jiaming 会在 Week 2-3 提供：
- `/api/merchant/reports/weekly` endpoint
- `WeeklyMerchantReportService` 后端逻辑
- 周报数据库表和查询

---

**开始时间：** 2026-04-19（周五）  
**检查点：** 2026-04-22（周一） - 展示进度  
**最终 Review：** 2026-04-25（周四晚）
