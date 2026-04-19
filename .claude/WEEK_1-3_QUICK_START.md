# Push v5.2 — Week 1-3 快速入门（对团队分发）

**发布日期：** 2026-04-19  
**下发时间：** 立即分发到各角色

---

## 📌 你的角色，你的任务清单

### 👤 Z（商家侧前端）

**读这个：** `/mnt/Push/.claude/WEEK_1_Z_DASHBOARD_PROMPT.md`

**3 句话总结：** 
- Week 1：搭建商家 Dashboard 框架（4 个 KPI 卡片 + 周度图表）
- 所有样式必须遵循 Design.md（Pearl Stone 背景、直角、CS Genio Mono 字体）
- 周五晚交付 7 个 .tsx 文件，无 console 错误

**关键日期：**
- 开始：Apr 19（周五）
- 检查：Apr 22（周一） - 展示进度截图
- 交付：Apr 25（周四晚） - 完整代码 review

**你需要做什么：**
```
1. npm install 最新代码
2. 创建 /types/merchant.ts
3. 创建 /lib/mocks/merchantData.ts
4. 创建 /lib/hooks/useMerchantMetrics.ts
5. 创建 4 个组件：DashboardHeader, MetricsCard, WeeklyChart, Dashboard 主页
6. 本地测试（npm run dev），确保无错误
7. 周五提交 pull request
```

---

### 👤 Jiaming（Admin + 后端 + Creator 页面）

**读这个：** `/mnt/Push/.claude/WEEK_1-3_JIAMING_BACKEND_PROMPT.md`

**3 句话总结：**
- Week 1：数据库迁移 6 张表 + API 框架（所有路由、TypeScript 接口）
- Week 2：AI 验证服务 + 周报生成服务（使用 mock，无外部 API）
- Week 3：创作者招募服务 + Admin Dashboard UI

**关键日期：**
- Week 1 交付（Apr 25 晚）：6 个 SQL 迁移、/lib/db/index.ts、所有 TypeScript 类型
- Week 2 交付（May 2 晚）：AIVerificationService + WeeklyMerchantReportService + API 端点
- Week 3 交付（May 9 晚）：CreatorRecruitmentService + Admin Dashboard

**你需要做什么（Week 1）：**
```
1. 创建 /migrations/001-006_*.sql（6 张表）
2. 创建 /lib/db/index.ts（CRUD 工具）
3. 创建 /types/database.ts（完整数据模型）
4. 创建 /api/health.ts（健康检查）
5. 创建 /api/merchant/dashboard.ts（仪表板数据）
6. 测试：npm run type-check，所有 TypeScript 无错
7. 测试：GET /api/health 返回 200
```

---

### 👤 Lucy（QA + 测试）

**读这个：** `/mnt/Push/.claude/WEEK_1-3_LUCY_QA_PROMPT.md`

**3 句话总结：**
- Week 1：建立手动测试框架和环境，完成 6 个手动测试用例
- Week 2-3：编写自动化测试（Jest + Cypress），运行性能审计
- 每周五晚提交 QA Report

**关键日期：**
- Week 1 完成（Apr 25）：6 个手动测试都 PASS，Lighthouse ≥ 75
- Week 2 完成（May 2）：单元测试覆盖率 ≥ 70%，8 个测试 PASS
- Week 3 完成（May 9）：E2E 测试 5+，每周 QA Report 提交

**你需要做什么（Week 1）：**
```
1. 建立 Jest 和 Cypress 配置
2. 创建 /tests/setup.ts（Mock 框架）
3. 创建 /tests/MANUAL_TEST_CASES.md（测试清单）
4. 完成手动测试（TC-001 至 TC-006）
5. 运行 Lighthouse 审计
6. 创建 /tests/BUG_TRACKER.md（bug 表）
7. 生成 Week 1 QA Report
```

---

### 👤 Prum & Milly（产品验证 + 数据）

**你们的职责（不需要代码）：**
- 每天与 Williamsburg 5 家咖啡店沟通，收集反馈
- 追踪 Pilot 指标（成交数、创作者激活率等）
- 每周五晚提交数据汇总给 Jiaming

**关键指标（保持在目标内）：**
- 目标：90 天后 12 paying merchants / 150 verified customers / $8K MRR / 80 active creators

---

## 🚀 今天就可以开始的 3 个步骤

### 第 1 步：环境检查（15 min，全员）

```bash
# 1. 克隆最新代码
git clone [repository-url]
cd Push

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
open http://localhost:3000
```

**如果卡住了：**
- Z & Jiaming：在 #engineering Slack 频道报告
- Prum & Milly：在 #operations 频道报告

---

### 第 2 步：读取设计系统（20 min，Z & Jiaming）

**文件：** `/mnt/Push/Design.md`

**必读内容（标记为已读）：**
- [ ] 品牌色 5 色列表
- [ ] 字体规范（Darky + CS Genio Mono）
- [ ] 间距规则（8px 网格）
- [ ] 组件规范（所有直角，无圆角）
- [ ] 示例组件代码

> 💡 **提示：** 如果 Design.md 中没有你需要的组件，不要自己新增颜色或字体。先在 Slack 问 Milly。

---

### 第 3 步：读取你的周度 Prompt（30-45 min）

- **Z：** 读 `WEEK_1_Z_DASHBOARD_PROMPT.md`，完整阅读，做笔记
- **Jiaming：** 读 `WEEK_1-3_JIAMING_BACKEND_PROMPT.md`，重点看 Step 1-6
- **Lucy：** 读 `WEEK_1-3_LUCY_QA_PROMPT.md`，关注 Step 1-4

> ⏱️ **预计时间：** 每个人 30-45 分钟。阅读后有问题在 Slack 问，不要自己猜。

---

## 📅 每周节奏（雷打不动）

### 周一 10:00 - 工作同步

**场景：** Slack 群组或短视频（Loom）  
**内容：** 每人 2-3 分钟报告进度
- 昨天完成了什么
- 今天的计划
- 遇到的阻塞

**谁汇报：** Z, Jiaming, Lucy（Prum & Milly 可选）

### 周五 17:00 - 代码审查

**场景：** GitHub pull request  
**流程：**
1. 开发者 16:00 前提交 PR（带清晰的 Description）
2. 17:00-17:30 同伴 code review（看代码质量）
3. 18:00-19:00 Lucy 做 QA 测试（手动和自动化）
4. 如果通过，20:00 merge to main

**检查清单（PR 提交前必读）：**
```
- [ ] npm run type-check 通过
- [ ] npm run lint 通过（无 warning）
- [ ] npm run test 通过（如果有单元测试）
- [ ] 本地 npm run dev 无错误
- [ ] 响应式布局测试（mobile/tablet/desktop）
- [ ] Design.md 合规性检查（颜色、字体、间距）
```

### 周日 20:00 - 部署

**流程：**
1. Jiaming 合并所有 PR 到 staging
2. Lucy 在 staging 做最终 E2E 测试（1 小时）
3. 如果全 PASS，部署到 production

---

## 🆘 遇到问题？快速排查

### Z：样式不对 / 组件破裂

**快速修复步骤：**
1. 打开 Design.md，找到对应的组件规范
2. 复制颜色代码（e.g., `bg-[#c1121f]`）
3. 替换你的代码中的颜色值
4. 运行 `npm run lint:fix` 自动修复格式
5. 对比截图和 Design.md，确保一致

**如果还不对：** 在 #engineering 发截图，问 Milly（设计 lead）

### Jiaming：数据库连接失败

**快速修复步骤：**
1. 检查 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL` 和 key
2. 运行 `npm run db:migrate` 手动执行迁移
3. 查看 Supabase 仪表板，确认表已创建
4. 测试：`curl http://localhost:3000/api/health`

**如果还不对：** 在 #engineering 发错误截图

### Lucy：测试找不到元素

**快速修复步骤：**
1. 打开浏览器 DevTools（F12）
2. 在 Console 运行：`document.querySelector('[data-testid="你-的-id"]')`
3. 如果返回 null，说明 HTML 中没有这个 data-testid
4. 让开发者添加 `data-testid="..."`

**如果 Cypress 失败：** 运行 `npx cypress open` 进入交互模式，逐步调试

---

## 📊 进度跟踪

**每周统计（周五 20:00）：**

| 角色 | 完成率 | 通过率 | Bug 数 | 下周计划 |
|------|--------|--------|--------|----------|
| Z | 85% | 90% | 2 | Week 2：Weekly Report |
| Jiaming | 80% | 95% | 1 | Week 2：AI Service |
| Lucy | 100% | 88% | 3 | Week 2：自动化测试 |

**目标（到 Week 12）：**
- 完成率：100%
- 通过率：≥ 95%
- Bug 数：< 5（关键）
- 所有指标达标（LTV/CAC 15.7x, SLR ≥ 12 等）

---

## 📞 问题升级路径

```
问题类型              第一联系人        升级对象          升级时间
─────────────────────────────────────────────────────────
技术/代码问题   →  同伴或 Slack  →  Jiaming      → 1 天无解
设计/样式问题   →  Milly              Jiaming      → 6 小时无解
数据/指标问题   →  Prum               Jiaming      → 2 小时无解
集成/部署问题   →  Lucy               Jiaming      → 即时
关键 Bug/堵塞   →  任何人             Jiaming      → 即时
```

---

## ✅ 成功标志（Week 1 完成时）

- [ ] Z：Dashboard 页面在 `/merchant/dashboard` 能访问，所有 KPI 卡片显示正确
- [ ] Jiaming：所有 6 张数据库表创建成功，`/api/health` 返回 200
- [ ] Lucy：6 个手动测试都 PASS，Lighthouse ≥ 75，没有 Critical 级别 bug
- [ ] 团队：周一同步进行，周五代码审查完成，日志清晰

---

## 🎯 最后的话

**这三周很紧张但很关键。**

- 你们在做的不是 side project，这是 Push 融资和扩张的基础。
- YC 会问我这些数据，你们的代码就是答案。
- 每个小时都很宝贵。不要等待，不要拖延，不要猜测 - 直接 Slack 问。

**记住三条金律：**
1. **Design.md First** - 任何前端代码前，先读 Design.md
2. **Tests First** - 代码提交前，自己先跑一遍测试
3. **Friday Review** - 周五 17:00 必须有东西拿出来看

**你们会做得很好。Go team! 🚀**

---

**Jiaming**  
CTO, Push  
2026-04-19

---

## 文件快速导航

```
核心文档位置：
├─ /mnt/Push/.claude/CLAUDE_CODE_V5_2_INSTRUCTIONS.md     (总体指令)
├─ /mnt/Push/.claude/WEEK_1_Z_DASHBOARD_PROMPT.md         (Z 的任务)
├─ /mnt/Push/.claude/WEEK_1-3_JIAMING_BACKEND_PROMPT.md   (Jiaming 的任务)
├─ /mnt/Push/.claude/WEEK_1-3_LUCY_QA_PROMPT.md           (Lucy 的任务)
├─ /mnt/Push/.claude/V5_2_IMPROVEMENTS_SPECIFICATION.md   (v5.2 规范书)
├─ /mnt/Push/Design.md                                      (设计系统 - 必读！)
└─ /mnt/Push/CLAUDE.md                                      (项目规则 - 必读！)
```

**打开方式：** 在 Claude Code 中输入文件路径，直接读取。或在编辑器中打开。

---

**预计项目完成日期：** 2026-07-18（12 周）  
**下一个 checkpoint：** 2026-05-02（Week 3 完成审查）
