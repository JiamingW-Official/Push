# Push v3.0 → v4.0 全面升级 — Claude Code Agent 执行指令

> **使用方法：** 将 `---` 以下的全部内容复制粘贴给 Claude Code agent。
> **工作目录：** `/Users/jiamingw/Documents/GitHub/Push`

---

你的任务是对 Push 项目执行 v3.0 → v4.0 的全面升级。这是一次体系级变更，涉及 creator tier 机制、定价、促销、归因、视觉身份等所有领域。

## 权威来源（已更新，不要修改）

以下 7 个文件是 v4.0 的权威真相来源，它们已经完成更新。**绝对不要修改这些文件**，所有其他文件的更新必须与这 7 个文件保持数字和概念一致：

1. `.claude/skills/push-creator/SKILL.md`
2. `.claude/skills/push-creator/scoring-model.md`
3. `.claude/skills/push-creator/recruitment-retention.md`
4. `.claude/skills/push-pricing/SKILL.md`
5. `.claude/skills/push-attribution/SKILL.md`
6. `.claude/skills/push-campaign/SKILL.md`
7. `Design.md`

**开始工作前，先读完这 7 个文件。** 它们包含所有 v4.0 的最终数字和设计决策。

## v4.0 变更清单（完整）

### A. 材质身份系统（Tier Identity）— 全新

每个 tier 不再使用 emoji（🌱🔍⚡✅🎯👑），改用材质名 + 主题色：

| Tier | 材质名 | 主题色 | Badge 处理 |
|------|--------|-------|-----------|
| Seed | **Clay** | `#b8a99a` (warm taupe) | 虚线描边（dashed），`#003049` 文字 |
| Explorer | **Bronze** | `#8c6239` (copper-bronze) | 实底填充，白色文字 |
| Operator | **Steel** | `#4a5568` (graphite) | 实底填充，白色文字 |
| Proven | **Gold** | `#c9a96e` (champagne gold) | 实底填充，`#003049` 文字 |
| Closer | **Ruby** | `#9b111e` (jewel red) | 实底 + badgeShimmer 动画 |
| Partner | **Obsidian** | `#1a1a2e` (volcanic black) | 实底 + badgeShimmer + obsidianPulse |

**规则：**
- 所有文档中 `Seed 🌱` → `Seed (Clay)`，`Explorer 🔍` → `Explorer (Bronze)`，以此类推
- 代码中使用 CSS 变量 `--tier-clay` / `--tier-bronze` / `--tier-steel` / `--tier-gold` / `--tier-ruby` / `--tier-obsidian`
- Badge 格式：`[Material] · [Tier Name]`（如 "Steel · Operator"）
- 6 个 tier 色彩各自独特，色相不重叠：taupe → bronze → graphite → gold → red → near-black
- 视觉 spec 详见 `Design.md` 的 "Tier Identity System v4.1" 章节

### B. Commission 混合模型 — 重大重设计

v3.0 只有百分比 commission（3%-10%），在本地 F&B $5-8 客单价下绝对值太低。

v4.0 改为 **百分比 + Referral Milestone Bonus**：

| Tier | Commission % | Milestone 阈值 | Milestone Bonus |
|------|-------------|---------------|----------------|
| Operator (Steel) | 3% | 30 txns/月 | +$15 |
| Proven (Gold) | 5% | 40 txns/月 | +$30 |
| Closer (Ruby) | 7% | 60 txns/月 | +$50 |
| Partner (Obsidian) | 10% | 80 txns/月 | +$80 |

**替换规则：**
- 所有提到 "5% bonus" / "10% bonus" / "15% bonus" → 替换为对应 tier 的 milestone bonus 具体数字
- 所有只写百分比没提 milestone 的 → 补充 milestone bonus 信息
- "commission 是行为拐点" → 保留，但补充 "percentage + milestone bonus 混合模型让 commission 在本地 F&B 场景下有实际价值"

### C. Campaign Difficulty Multiplier — 全新

Base pay 不再是模糊范围，而是 tier base rate × difficulty：

| Difficulty | Multiplier | 示例 |
|-----------|-----------|-----|
| Standard | 1.0x | 单帖 story，简单打卡 |
| Premium | 1.3x | Reel/TikTok，多地点，周末 |
| Complex | 1.6x | 视频系列，活动报道，多日 |

**固定 Base Rate（Standard 1.0x）：**
Seed=免费产品, Explorer=$12, Operator=$20, Proven=$32, Closer=$55, Partner=$100

**替换规则：**
- `$10-15/campaign` → `$12/campaign (Standard)` 或注明 "Base Rate × Campaign Difficulty Multiplier"
- `$15-25/campaign` → `$20/campaign (Standard)`
- 所有 base pay 范围 → 用固定 base rate + multiplier 解释

### D. Seed 升级门槛 — 降低

- ~~完成 3 个 campaign~~ → **完成 2 个 campaign + $5 bonus on 2nd completion**
- 升级条件：2 campaigns + provisional score ≥ 40 → auto-promote to Explorer

### E. Fast Track — 阈值修正

- ~~score ≥ 65 + avg merchant rating ≥ 4.0 → 跳过 Explorer 到 Operator~~
- → **score ≥ 55 + avg merchant rating ≥ 4.0 → 跳过 Explorer 到 Operator**
- 理由：55 与 Operator 门槛一致，不再高于目标 tier 要求

### F. 降级保护 — 时间制

- ~~score 低于门槛连续 3 个 campaign → 降级~~
- → **score 低于门槛 → 30 天 grace window；期间 commission 降至下一 tier 标准；30 天后仍未恢复则正式降级**

### G. 促销结构 — Two-Tier Offer System

- ~~"TGTG式限量促销"、"前20个免费"（固定数字）~~
- → **Two-Tier Offer System**：
  - **Hero Offer**（高价值，限量）：商家选 5/10/15/20 个名额，免费产品或深折
  - **Sustained Offer**（低价值，持续）：商家设持续折扣（如 15% off），Hero 用完后自动生效
- 默认建议：Starter=5 Hero+15%, Growth=10+20%, Pro=15-20+custom
- 两档 offer 的 redemption 都计入 creator 的 referral 交易数

### H. Proven "co-design rights" → Structured Campaign Feedback Form

- ~~"campaign co-design rights"~~
- → **Structured Campaign Feedback Form**：Proven+ 接受 campaign 时可提交建议（时间段/产品/内容角度），商家看到但不强制采纳

### I. Partner "platform governance" → Advisory Access

- ~~"投票决定新 campaign 类型、功能、tier 规则"~~
- → **Advisory Access**：月度产品反馈会 + 优先 beta 体验 + 给创始团队直接反馈。正式投票机制等 Partner 数量 ≥ 10 再启动。

### J. 教育/成长权益 — 全新

| Tier | 教育权益 |
|------|---------|
| Seed (Clay) | Welcome kit: "Your First Campaign" checklist + 3 example posts |
| Explorer (Bronze) | Content Creation Guide + Best Practices Library + **referral analytics dashboard** |
| Operator (Steel) | Data Literacy Tutorial（如何读 referral 数据、优化发帖时间） |
| Proven (Gold) | 每月 1-on-1 content review with Push team |
| Closer (Ruby) | 专属 account manager + strategy coaching |
| Partner (Obsidian) | Quarterly business review + media feature |

### K. 双向 Tier 联动 — 全新

商家→Creator（不变）+ Creator→Merchant preference（新增）：
- Proven (Gold)+：可设偏好优先 Growth/Pro 商家
- Closer (Ruby)+：可 filter 只接 Pro 商家
- Partner (Obsidian)：可设 exclusive merchant partnerships（1-3 家）

## 执行步骤

### Step 1: 读取权威来源
读完上面列出的 7 个文件，确认你理解所有 v4.0 数字和概念。

### Step 2: 全局搜索过时概念
在 `/Users/jiamingw/Documents/GitHub/Push` 目录下，搜索以下关键词（递归搜索所有 .md、.html、.js、.css、.json 文件）：

```bash
# Emoji 残留
grep -rn "🌱\|🔍\|⚡\|✅\|🎯\|👑" . --include="*.md" --include="*.html" --include="*.js" --include="*.css"

# v3.0 概念残留
grep -rn "v3\.0\|v3\.0" . --include="*.md"
grep -rn "3个campaign\|3 campaigns\|complete 3" . --include="*.md"
grep -rn "co-design rights\|co.design rights" . --include="*.md"
grep -rn "platform governance\|投票" . --include="*.md"
grep -rn "TGTG\|前.*个免费\|first.*free" . --include="*.md"
grep -rn "score ≥ 65\|score >= 65\|≥ 65" . --include="*.md"
grep -rn "3 consecutive campaigns\|3个campaign.*grace\|3-campaign" . --include="*.md"
grep -rn "5% bonus\|10% bonus\|15% bonus" . --include="*.md"
```

**排除**上面 7 个权威文件（它们已经正确）。

### Step 3: 逐文件更新

对每个有过时内容的文件：
1. 读取完整内容
2. 对照上面的变更清单 A-K 替换
3. 确保数字一致（base rate、commission、milestone、阈值）
4. 保持原文件语言（中文→中文，英文→英文）

**特别注意的文件：**
- `.claude/skills/push-hub/SKILL.md` — 主路由器，必须更新所有快速参考数字 + 加入材质名和颜色
- `.claude/skills/push-strategy/` — 所有子文件
- `.claude/skills/push-gtm/` — 所有子文件（cold-start-12week.md 等）
- `.claude/skills/push-metrics/SKILL.md` — KPI 目标数字
- `.claude/skills/push-brand-voice/` — messaging 模板中的 tier 引用
- `.claude/skills/push-website/SKILL.md` — 网站内容标准
- 项目根目录下任何 `.md` 文件

### Step 4: 一致性验证

更新完成后重新运行 Step 2 的所有 grep 命令。如果仍有残留（排除权威文件后），继续修复直到全部清零。

额外验证：
```bash
# 确认材质名已被使用
grep -rn "Clay\|Bronze\|Steel\|Gold\|Ruby\|Obsidian" .claude/skills/push-hub/SKILL.md

# 确认 milestone bonus 出现在 hub
grep -rn "Milestone Bonus\|milestone" .claude/skills/push-hub/SKILL.md

# 确认 Difficulty Multiplier 出现在 hub
grep -rn "Difficulty Multiplier\|1\.3x\|1\.6x" .claude/skills/push-hub/SKILL.md
```

### Step 5: 同步到 Push_Portal（如果存在）

检查 `/Users/jiamingw/Documents/GitHub/Push_Portal` 是否存在。如果存在，检查其中是否有引用 tier/pricing/commission 的 HTML/JS/CSS 文件，按同样规则更新。

### Step 6: Commit

```
refactor: upgrade Push system v3.0 → v4.0 with material tier identity

Tier Identity: Clay/Bronze/Steel/Gold/Ruby/Obsidian replace emojis
Commission: hybrid % + Referral Milestone Bonus ($15/$30/$50/$80)
Base Pay: fixed rates × Campaign Difficulty Multiplier (1.0x/1.3x/1.6x)
Seed upgrade: 3→2 campaigns + $5 bonus
Fast Track: score 65→55 (aligned with Operator entry)
Demotion: 3-campaign→30-day grace window
Promotion: Two-Tier Offer (Hero + Sustained) replaces TGTG model
Benefits: education/growth benefits added per tier
Bidirectional tier matching: creator ↔ merchant preference
Partner: governance voting → Advisory Access
```

## 约束

1. **绝对不修改** 7 个权威来源文件
2. 所有更新必须与权威来源的数字严格一致
3. 不确定的文件 → 跳过并列出供人工审查
4. 保持原文件语言
5. 遵循 `CLAUDE.md` 中的 Design System 规范
6. 遵循 `Design.md` 中的 Tier Identity System 视觉规范
7. 不要在代码中引入品牌 5 色以外的新颜色
8. 所有 `border-radius: 0`（Push 设计规范）
