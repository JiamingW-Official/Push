# Push v5.2 — Week 1-3 QA & Testing Prompt for Lucy

**目标用户：** Lucy（QA + 测试自动化）  
**周期：** Week 1-3（Apr 18 - May 2）  
**职责：** 测试环境设置、手动测试、自动化测试、性能审计  
**预计时间：** 24-32 小时

---

## 任务概述

作为 QA lead，你需要建立完整的测试框架、运行手动和自动化测试、追踪 bug，并在周五审查前确保代码质量达标。

**三周交付物：**

```
Week 1：测试环境 + 手动测试计划
├─ /tests/setup.ts
├─ /tests/unit/
├─ Test Case Documentation
└─ Bug Tracking Sheet

Week 2-3：自动化测试 + 性能审计
├─ /tests/e2e/*.spec.ts
├─ /tests/integration/*.spec.ts
├─ Lighthouse Reports
└─ Weekly QA Report
```

---

## Week 1：环境 + 测试框架

### Step 1：Jest 和 Cypress 环境搭建（20 min）

**检查项目配置：**

```bash
# 验证 Jest 是否已安装
npm list jest

# 验证 Cypress 是否已安装
npm list cypress

# 如果没有，安装：
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

npm install --save-dev cypress
```

**文件：** `/jest.config.js`（确保存在）

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'components/**/*.tsx',
    'app/**/*.tsx',
    '!**/*.d.ts',
  ],
};
```

**文件：** `/tests/setup.ts`

```typescript
import '@testing-library/jest-dom';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(() => ({
    userId: 'test-user-123',
    isLoaded: true,
    isSignedIn: true,
    signOut: jest.fn(),
  })),
}));

// Suppress Next.js console warnings
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('Warning: useLayoutEffect')) return;
    originalError(...args);
  };
}
```

---

### Step 2：Manual Test Cases 文档（30 min）

**文件：** `/tests/MANUAL_TEST_CASES.md`

这是 QA 在执行手动测试时使用的清单。按照这个清单逐一测试。

```markdown
# Push v5.2 Manual Test Cases

## Week 1：Dashboard 基础功能

### TC-001：Merchant Dashboard 页面加载
**步骤：**
1. 导航至 `/merchant/dashboard`
2. 确保页面加载（无报错）
3. 确保能看到 4 个 KPI 卡片

**预期结果：**
- [ ] 页面在 2 秒内加载
- [ ] 所有卡片都显示数值（非空）
- [ ] 无 console 错误

**实际结果：** ___________

---

### TC-002：Merchant Dashboard 响应式布局
**步骤：**
1. 用 Chrome DevTools 打开响应式设计模式
2. 在 mobile (375px)、tablet (768px)、desktop (1440px) 测试

**预期结果：**
- [ ] Mobile：4 个卡片垂直排列（1 列）
- [ ] Tablet：2 列布局
- [ ] Desktop：4 列布局
- [ ] 无横向滚动条

**实际结果：** ___________

---

### TC-003：KPI 卡片数据准确性
**步骤：**
1. 在 Dashboard 页面查看 KPI 卡片
2. 对比 mock 数据（见 /lib/mocks/merchantData.ts）

**预期结果：**
- [ ] Verified Customers：23
- [ ] Weekly Revenue：$287.50
- [ ] ROI：85.2%
- [ ] Avg Transaction：$12.50

**实际结果：** ___________

---

### TC-004：周度图表渲染
**步骤：**
1. 在 Dashboard 向下滚动找到 Weekly Chart
2. 验证图表显示正确

**预期结果：**
- [ ] 图表显示 7 条数据（每天一条）
- [ ] X 轴显示日期（Apr 14 - Apr 20）
- [ ] Y 轴显示金额和客户数
- [ ] 两条线（Revenue + Customers）都显示
- [ ] 线条颜色正确（Red + Blue）

**实际结果：** ___________

---

### TC-005：Top Creators 卡片
**步骤：**
1. 在 Dashboard 找到 Top Creators 部分
2. 验证数据和样式

**预期结果：**
- [ ] 显示最多 3 个创作者
- [ ] 每个卡片显示名字、头像、贡献度百分比
- [ ] 进度条准确（宽度 = 百分比）

**实际结果：** ___________

---

### TC-006：颜色和字体合规性
**步骤：**
1. 使用浏览器开发者工具检查元素
2. 验证样式遵循 Design.md

**预期结果（颜色）：**
- [ ] 背景：Pearl Stone `#f5f2ec`
- [ ] Header：Flag Red `#c1121f`
- [ ] 标题文字：Deep Space Blue `#003049`
- [ ] 数值文字：Molten Lava `#780000`

**预期结果（字体）：**
- [ ] 大标题：Darky
- [ ] 标签/数值：CS Genio Mono

**实际结果：** ___________

---

## Week 2-3：服务层和 API

### TC-101：AI 验证 API 调用
**步骤：**
1. 使用 curl 或 Postman 调用 `/api/internal/ai-verify`
2. 发送请求：
```json
{
  "merchant_id": "merchant_001",
  "creator_id": "creator_1",
  "customer_name": "John Doe",
  "photo_url": "https://...",
  "receipt_url": "https://...",
  "merchant_lat": 40.7128,
  "merchant_lon": -74.0060,
  "customer_lat": 40.7200,
  "customer_lon": -74.0050
}
```

**预期结果：**
- [ ] API 返回 200 OK
- [ ] 返回 JSON：`{ status, confidence_score, reasoning }`
- [ ] status 是 'auto_verified'、'manual_review_required' 或 'rejected'
- [ ] confidence_score 在 0-1 之间

**实际结果：** ___________

---

### TC-102：周报生成 API
**步骤：**
1. 调用 `POST /api/merchant/reports/weekly`
2. 请求体：
```json
{
  "merchant_id": "merchant_001",
  "week_start": "2026-04-14"
}
```

**预期结果：**
- [ ] API 返回 200 OK
- [ ] 包含字段：merchant_id, week_start, verified_customers, total_revenue, roi, top_creators
- [ ] 数据与数据库一致

**实际结果：** ___________

---

### TC-103：创作者招募更新
**步骤：**
1. 调用 `POST /api/internal/recruitment-sync`
2. 请求体（更新性能分数）：
```json
{
  "action": "update_score",
  "creator_id": "creator_1",
  "new_score": 60
}
```

**预期结果：**
- [ ] API 返回 200 OK 和 `{ success: true }`
- [ ] 数据库中 performance_score 更新为 60

**实际结果：** ___________

---

### TC-104：Admin Dashboard 显示
**步骤：**
1. 导航至 `/admin/dashboard`
2. 验证 KPI 和统计数据

**预期结果：**
- [ ] 显示 6 个 KPI 卡片
- [ ] Creator 招募漏斗统计显示
- [ ] 所有数据非空

**实际结果：** ___________

---
```

---

### Step 3：Bug 追踪表（10 min）

**文件：** `/tests/BUG_TRACKER.md`

```markdown
# Push v5.2 Bug Tracker

| Bug ID | Title | Component | Severity | Status | Assigned | Notes |
|--------|-------|-----------|----------|--------|----------|-------|
| BUG-001 | Dashboard 数值显示 NaN | MetricsCard | Critical | Open | Jiaming | Mock 数据格式错误 |
| BUG-002 | 图表不显示数据 | WeeklyChart | High | Open | Z | Recharts 配置问题 |
|  |  |  |  |  |  |  |

## Bug 提交流程

当发现 bug 时：
1. 在此表格添加一行
2. 给开发者发 Slack 消息（带 BUG ID 和链接）
3. 跟踪状态直至修复
4. 修复后运行回归测试
```

---

### Step 4：性能审计检查清单（20 min）

**文件：** `/tests/PERFORMANCE_CHECKLIST.md`

```markdown
# Performance & Lighthouse Checklist

## Week 1：Dashboard 性能

### 运行 Lighthouse 审计
```bash
npm run build
npm start
# 在浏览器打开 /merchant/dashboard
# 按 F12 → Lighthouse → Generate Report
```

### 目标指标

| 指标 | 目标 | 实际 |
|------|------|------|
| Performance | ≥ 80 | ___ |
| Accessibility | ≥ 90 | ___ |
| Best Practices | ≥ 85 | ___ |
| SEO | ≥ 90 | ___ |
| LCP (Largest Contentful Paint) | < 2.5s | ___ |
| FID (First Input Delay) | < 100ms | ___ |
| CLS (Cumulative Layout Shift) | < 0.1 | ___ |

### 问题排查

如果 Performance < 80：
1. 检查是否有未优化的图片
2. 检查是否有无谓的 JavaScript
3. 检查图表库是否加载过慢

## Week 2-3：API 性能

### API 响应时间目标

| 端点 | 目标 | 实际 |
|------|------|------|
| GET /api/health | < 100ms | ___ |
| GET /api/merchant/dashboard | < 500ms | ___ |
| POST /api/internal/ai-verify | < 1000ms | ___ |
| POST /api/merchant/reports/weekly | < 2000ms | ___ |

### 测试方法
```bash
curl -w "Time: %{time_total}s\n" https://localhost:3000/api/health
```
```

---

## Week 1 完成清单

✅ **测试环境：**
- [ ] Jest 和 Cypress 安装并配置
- [ ] Mock 框架就位（Supabase、Clerk）
- [ ] 可以运行 `npm test`（无错误）

✅ **手动测试：**
- [ ] 完成所有 TC-001 到 TC-006（6 个测试用例）
- [ ] 所有测试都 PASS（或 bug 已记录）

✅ **文档：**
- [ ] `/tests/MANUAL_TEST_CASES.md` 完成
- [ ] `/tests/BUG_TRACKER.md` 建立
- [ ] `/tests/PERFORMANCE_CHECKLIST.md` 建立

✅ **性能审计：**
- [ ] 运行 Lighthouse，Dashboard 性能 ≥ 75
- [ ] 记录所有指标

---

## Week 2-3：自动化测试 + 每周报告

### Step 5：单元测试编写（Week 2，30 min）

**文件：** `/tests/unit/services/AIVerificationService.test.ts`

```typescript
import { AIVerificationService } from '@/lib/services/AIVerificationService';

describe('AIVerificationService', () => {
  let service: AIVerificationService;

  beforeEach(() => {
    service = new AIVerificationService();
  });

  describe('verifyCustomerClaim', () => {
    it('should return auto_verified when confidence >= 0.85', async () => {
      const claim = {
        merchant_id: 'merchant_001',
        creator_id: 'creator_1',
        customer_name: 'John',
        photo_url: 'https://example.com/photo.jpg',
        receipt_url: 'https://example.com/receipt.jpg',
        merchant_lat: 40.7128,
        merchant_lon: -74.0060,
        customer_lat: 40.7130,
        customer_lon: -74.0061,
      };

      const result = await service.verifyCustomerClaim(claim);

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('confidence_score');
      expect(['auto_verified', 'manual_review_required', 'rejected']).toContain(result.status);
    });

    it('should return correct reasoning format', async () => {
      const claim = {
        merchant_id: 'merchant_001',
        creator_id: 'creator_1',
        customer_name: 'John',
        photo_url: 'https://example.com/photo.jpg',
        receipt_url: 'https://example.com/receipt.jpg',
        merchant_lat: 40.7128,
        merchant_lon: -74.0060,
        customer_lat: 40.7130,
        customer_lon: -74.0061,
      };

      const result = await service.verifyCustomerClaim(claim);

      expect(result.reasoning).toMatch(/Vision: \d+\.\d+, OCR: \d+\.\d+, Geo: \d+\.\d+/);
    });
  });
});
```

**文件：** `/tests/unit/services/WeeklyMerchantReportService.test.ts`

```typescript
import { WeeklyMerchantReportService } from '@/lib/services/WeeklyMerchantReportService';

describe('WeeklyMerchantReportService', () => {
  let service: WeeklyMerchantReportService;

  beforeEach(() => {
    service = new WeeklyMerchantReportService();
  });

  describe('generateWeeklyReport', () => {
    it('should generate report with correct structure', async () => {
      const merchantId = 'merchant_001';
      const weekStart = new Date('2026-04-14');

      const report = await service.generateWeeklyReport(merchantId, weekStart);

      expect(report).toHaveProperty('merchant_id');
      expect(report).toHaveProperty('week_start');
      expect(report).toHaveProperty('verified_customers');
      expect(report).toHaveProperty('total_revenue');
      expect(report).toHaveProperty('roi');
      expect(report).toHaveProperty('top_creators');
    });

    it('should calculate ROI correctly', async () => {
      const merchantId = 'merchant_001';
      const weekStart = new Date('2026-04-14');

      const report = await service.generateWeeklyReport(merchantId, weekStart);

      // ROI should be a number between -100 and 1000
      expect(typeof report.roi).toBe('number');
      expect(report.roi).toBeGreaterThanOrEqual(-100);
      expect(report.roi).toBeLessThan(1000);
    });

    it('should return top creators in descending order', async () => {
      const merchantId = 'merchant_001';
      const weekStart = new Date('2026-04-14');

      const report = await service.generateWeeklyReport(merchantId, weekStart);

      for (let i = 0; i < report.top_creators.length - 1; i++) {
        expect(report.top_creators[i].contribution_pct).toBeGreaterThanOrEqual(
          report.top_creators[i + 1].contribution_pct
        );
      }
    });
  });
});
```

**运行单元测试：**

```bash
npm test -- tests/unit/ --coverage
```

**覆盖率目标：** ≥ 70%

---

### Step 6：集成测试（E2E）- Week 3，30 min

**文件：** `/tests/e2e/merchant-dashboard.spec.ts`

使用 Cypress 自动化测试完整的用户流程：

```typescript
describe('Merchant Dashboard E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/merchant/dashboard');
  });

  it('should load dashboard and display KPI cards', () => {
    // 验证页面加载
    cy.get('h1').should('contain', 'This Week');

    // 验证 4 个 KPI 卡片都显示
    cy.get('[data-testid="metrics-card"]').should('have.length', 4);

    // 验证数据显示
    cy.get('[data-testid="verified-customers"]').should('contain', '23');
    cy.get('[data-testid="weekly-revenue"]').should('contain', '$287.50');
  });

  it('should display chart with correct data', () => {
    // 验证图表存在
    cy.get('[data-testid="weekly-chart"]').should('be.visible');

    // 验证图表有数据点（Recharts 会渲染 <text> 元素显示日期）
    cy.get('[data-testid="weekly-chart"] text').should('have.length.greaterThan', 5);
  });

  it('should show top creators', () => {
    cy.get('[data-testid="top-creators"]').should('be.visible');
    cy.get('[data-testid="creator-card"]').should('have.length.greaterThan', 0);

    // 验证创作者排序（第一个的贡献度 >= 第二个）
    cy.get('[data-testid="creator-pct"]')
      .first()
      .then(first => {
        const firstPct = parseFloat(first.text());
        cy.get('[data-testid="creator-pct"]')
          .eq(1)
          .then(second => {
            const secondPct = parseFloat(second.text());
            expect(firstPct).toBeGreaterThanOrEqual(secondPct);
          });
      });
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.get('[data-testid="metrics-card"]').first().should('be.visible');
    cy.get('body').should('not.have.css', 'overflow-x', 'auto'); // 无横向滚动
  });
});
```

**运行 E2E 测试：**

```bash
npx cypress open
# 在 UI 中选择测试文件并运行
```

或者：

```bash
npx cypress run --spec "tests/e2e/merchant-dashboard.spec.ts"
```

---

### Step 7：周度 QA 报告（Week 1-3，每周 30 min）

**文件：** `/tests/QA_REPORT_WEEK1.md`（每周更新）

```markdown
# QA Report - Week 1 (Apr 18-25)

## 测试覆盖

| 测试类型 | 用例数 | 通过 | 失败 | 堵塞 | 通过率 |
|---------|--------|------|------|------|--------|
| Manual | 6 | 5 | 1 | 0 | 83% |
| Unit | 8 | 8 | 0 | 0 | 100% |
| E2E | 3 | 2 | 1 | 0 | 67% |
| **总计** | **17** | **15** | **2** | **0** | **88%** |

## 关键发现

### 通过的测试 ✅
- Dashboard 页面加载（TC-001）
- KPI 卡片数据准确（TC-003）
- 响应式设计（TC-002）
- 颜色合规（TC-006）

### 失败的测试 ❌
- BUG-001：图表不显示数据（WeeklyChart）
  - 原因：Recharts 数据格式错误
  - 分配给：Z
  - 优先级：High
  - 预期修复：Apr 22

- BUG-002：Top Creators 排序错误（E2E）
  - 原因：贡献度计算逻辑问题
  - 分配给：Jiaming
  - 优先级：Medium
  - 预期修复：Apr 23

## 性能指标

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| Lighthouse Performance | ≥ 80 | 77 | ⚠️ |
| Dashboard 加载时间 | < 2s | 1.8s | ✅ |
| API /health 响应 | < 100ms | 45ms | ✅ |

## 建议

1. Z：修复 Recharts 数据格式，重新运行 TC-005
2. Jiaming：检查贡献度计算逻辑
3. 整体：优化 Lighthouse 性能，目标 ≥ 82

## 签字

- QA Lead：Lucy
- 日期：2026-04-25
- 下次审查：2026-05-02
```

---

## Week 2-3 完成清单

✅ **自动化测试：**
- [ ] 单元测试覆盖率 ≥ 70%
- [ ] E2E 测试 ≥ 5 个完整流程
- [ ] 所有测试可以在 CI/CD pipeline 中运行

✅ **Bug 管理：**
- [ ] 所有 bug 都有明确的优先级和分配
- [ ] 超过 SLA 的 bug 已升级
- [ ] 修复后的 bug 已做回归测试

✅ **性能：**
- [ ] Dashboard Lighthouse ≥ 82
- [ ] API 响应时间都在目标内
- [ ] 无内存泄漏（DevTools Profiler 检查）

✅ **报告：**
- [ ] 每周五都有 QA Report
- [ ] 所有数据准确且有源
- [ ] 趋势分析清晰（周度对比）

---

## 工具与环境

### 浏览器开发者工具

```
Chrome DevTools：
- Elements：检查 HTML 结构和样式
- Console：查看错误信息
- Performance：性能分析
- Network：API 响应时间
- Lighthouse：性能审计
```

### 测试工具命令

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- tests/unit/services/AIVerificationService.test.ts

# 带覆盖率的测试
npm test -- --coverage

# E2E 测试（交互模式）
npx cypress open

# E2E 测试（无头模式）
npx cypress run

# 性能审计
npm run build
npm start
# 然后在浏览器手动运行 Lighthouse
```

---

## Bug 优先级标准

| 优先级 | 定义 | SLA |
|--------|------|-----|
| Critical | 功能完全不工作 / 数据损坏 | 2 小时修复 |
| High | 主要功能受阻 / 明显的 UI 问题 | 24 小时修复 |
| Medium | 边缘功能受阻 / 轻微 UX 问题 | 3 天修复 |
| Low | 非关键功能 / 美观问题 | 5 天修复或 backlog |

---

## 周度检查清单（每周五）

- [ ] 运行所有单元测试，覆盖率 ≥ 70%
- [ ] 运行所有 E2E 测试，通过率 ≥ 90%
- [ ] 运行 Lighthouse，Performance ≥ 80
- [ ] 更新 BUG_TRACKER.md
- [ ] 生成 QA_REPORT_WEEK_X.md
- [ ] Slack 发送周度总结
- [ ] 标记所有修复的 bug 为 "verified"

---

**开始时间：** 2026-04-19（周五）  
**Week 1 完成：** 2026-04-25（周四晚）  
**Week 2 完成：** 2026-05-02（周四晚）  
**Week 3 完成：** 2026-05-09（周四晚）

所有报告应在周五晚上 6pm 前提交给 Jiaming。
