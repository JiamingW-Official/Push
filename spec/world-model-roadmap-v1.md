# Local Commerce World Model — R&D Roadmap v1 (v5.3)

**Version**: v1 (v5.3 authoritative)
**Status**: **Spec only** — 无代码、无 GPU、无 ML hire、无外部承诺。v5.3 只画路径。
**Owner**: Jiaming
**Scope**: 技术北极星 + 数据门槛 + 阶段路径 + 投资人叙事的严格边界
**Sibling docs**:
- `/spec/data-schema-v1.md` — 数据源底层字段 (P0-2)
- `/spec/multimodal-dataset-v1.md` — 创意到转化数据集 (P2-2)
- `/spec/consent-privacy-v1.md` — 合规 / algorithmic audit 基础 (P2-1)
- `.claude/skills/push-strategy/SKILL.md` § 1 — 投资人叙事 (P0-1 定位重写)

## 0. 读这份文档前必须内化的 2 条

1. "世界模型" 在 Push context 中是 **Wayve GAIA-1 / DeepMind Genie 意义上的窄场景 state-action-observation 生成模型**，预测 neighborhood 消费动态。**不是** LeCun JEPA，**不是** AGI，**不**与 OpenAI / Anthropic 模型层竞争
2. v5.3 阶段 LCWM 是**长期愿景叙事**，不是产品。对外现实标签永远是 "Physical-World Ground Truth Layer"。世界模型 ≈ 望远镜里看到的星，不是手里拿着的货

## 1. 定义 / 范围

**Local Commerce World Model (LCWM)**: 给定 state S_t + action A_t，预测 S_{t+1}。

- **State S_t**: neighborhood × 时段 × 天气 × 活动 × 商家库存 × 过去 7 天 creator 活动
- **Action A_t**: creator X 发布 creative Y，targeting neighborhood Z
- **Observation S_{t+1}**: 接下来 24 / 72 小时 foot traffic、实到转化、demographic 流动、retention

### 不是

- 物理世界动力学（**不是 LeCun JEPA**）
- 通用智能体（不是 AGI）
- Foundation model（不是 LLM）

### 是

- 特定场景预测模型，学习 NYC F&B neighborhood 层面的 "creator intervention → commerce outcome" 动态
- 类比：**Wayve** 学驾驶动态、**DeepMind Genie** 学 2D 游戏动态，Push 学本地 F&B 商业动态

## 2. 业务价值

一旦 LCWM 有预测能力:

| 受众 | LCWM 给他们什么 |
|---|---|
| **Creator** | "如果你发这条内容，这个 neighborhood，这个时段，我们预测 28 实到 +/- 8" |
| **Merchant** | "本周二下午雨天，推荐你让 creator X 来发 campaign，预期转化提升 22%" |
| **Agency** | "你这个 brand 想在 NYC F&B 做 campaign，最佳 creator 组合是 A+B+C，预期 7-day conversion $38K" |
| **Investor** | Push 拥有"商业物理学"预测能力，defensibility 抬升 2–3 档 |

## 3. 数据前置条件

LCWM 训练需要：

### 规模门槛

- 至少 **10,000 个 (state, action, outcome) triplet**
- 至少覆盖 **5 个 neighborhoods × 10 merchants**
- 至少 **12 个月**时间跨度（捕捉季节性）

### Push 达到门槛的预估

| 时点 | 累计 triplets | 能做什么 |
|---|---|---|
| Month 3 (Pilot EOW 3) | ~500 | 远不够 |
| **Month 12** | ~15,000 | 刚够 fine-tune |
| **Month 24** | ~80,000 | 训 proper 模型可能 |
| Month 36 | ~200,000+ | 商业可用 |

### 结论

LCWM 最早 **v6.0 (2027 年中)** 才有 prototype，**Series B (2028)** 才是商业产品。v5.3 只建路径，不建模型。

## 4. 技术路径

### Phase 0 (v5.3 → v5.5, Month 0–6): Data collection

- P0-2 schema 到位
- Multimodal dataset ETL（推到 v5.4）
- **无模型**

### Phase 1 (v5.6 → v6.0, Month 6–12): Baseline 预测模型

- 从简单 tabular model 开始（XGBoost / LightGBM）
- 预测 target: next-7-day merchant revenue given creator intervention
- **成功标志**: RMSE < 20% on validation set

### Phase 2 (v6.0+, Year 2): Foundation-model fine-tune

- Base: 开源 multimodal model（Qwen-VL 或 LLaVA）
- Fine-tune on Push multimodal dataset
- 添加 tabular context encoder
- **成功标志**: 胜过 Phase 1 baseline **5%+**

### Phase 3 (Series B+): World model proper

- Action-conditional 生成模型（类 Genie 2 / GAIA-2 架构）
- 输入: state embedding + action embedding
- 输出: next-state embedding + 可解码成预测 observation
- **成功标志**: counterfactual 预测（"如果 creator Y 改发这条内容会怎样"）可用

## 5. R&D 组织

| 阶段 | 人员 |
|---|---|
| v5.3 | 0 ML engineer；**只有 spec** |
| v5.4 – v5.5 (Month 3–6) | 1 ML data engineer（tabular pipeline） |
| v6 以后 | 3–5 人 ML team（1 research, 2 MLE, 1–2 data eng） |

### 外部协作（若 AI-depth answer 含学术合作）

- NYU Stern (commerce) + NYU Tandon (ML) 联合 research project
- Columbia DSI F&B commerce lab
- 发表 workshop paper 提升招聘吸引力（工作坊优于会议，周期更快，降低招聘 funnel 阻力）

## 6. 里程碑 & 指标

| Milestone | 时间 | Success criteria |
|---|---|---|
| M1: Dataset 1,000 triplets | 2026-10 | 质量 audit 95%+ |
| M2: Baseline tabular model | 2027-Q1 | RMSE < 25% |
| M3: Multimodal fine-tune prototype | 2027-Q3 | Beat M2 baseline 5% |
| M4: World model prototype | 2028-Q1 | Counterfactual 合理 |
| M5: Commercial API | 2028-Q3 | Paying customers 3+ |

M1–M2 未达标触发技术路径 review；M3 未达标可以容忍，只要 M2 baseline 仍 outperform 市场平均；M4 是 Series B 叙事的核心交付物。

## 7. 投资人 pitch 用法（严格）

### 能在 deck 里写

- "We are building the Local Commerce World Model — a predictive simulation of neighborhood consumer flow under creator interventions"
- "Path: Month 0–6 data collection → Month 6–12 baseline predictive model → Year 2 multimodal fine-tune → Year 3+ true world model"
- "Training data moat: only Push produces verified physical-world ground truth at neighborhood scale"

### 不能写

- "We are building AGI for commerce"
- "We'll compete with OpenAI"
- "We have a foundation model"
- "Our model is already [working / deployed / in production]"

### Matrix 1 同步（push-strategy SKILL.md）

Data-buyer audience 的 disallowed-claim 列已禁用 "foundation model" 语言 —— 本文档的"能 / 不能写"分区与那张表一致。任何 pitch deck 修改须两份同步。

## 8. Risk log

| Risk | Mitigation |
|---|---|
| Dataset 永远不够大（Pilot 规模太慢） | 加速 neighborhood saturation（P1-1 agency 合作带 merchant 池） |
| 开源 foundation model 突破让 fine-tune 路径过时 | 每季度 review 开源生态，随时调路径（Phase 2 本质就是 "最适配当时开源基底"，非某个特定模型） |
| 监管对 ML commerce 模型收紧（EU AI Act 覆盖到 US） | 现在就写 impact log + algorithmic audit flow（P2-1 覆盖部分） |
| ML engineer 招聘难 | Year 1 外包 + 学术合作，Year 2 fulltime |
| 竞品先训出类似模型 | Push 的 data moat 不可复制（physical-world label production）；模型层即使被抄，数据层仍独占 |

## 9. Cross-refs

- 数据源: P0-2 [`/spec/data-schema-v1.md`](./data-schema-v1.md)
- 多模态数据集: P2-2 [`/spec/multimodal-dataset-v1.md`](./multimodal-dataset-v1.md)
- Consent 合规 + algorithmic audit: P2-1 [`/spec/consent-privacy-v1.md`](./consent-privacy-v1.md)
- 投资人叙事措辞: `.claude/skills/push-strategy/SKILL.md` § 1（P0-1 重写）
- Agency 合作加速 merchant 池: P1-1 [`/spec/nyc-agency-playbook-v1.md`](./nyc-agency-playbook-v1.md) + P1-2 [`/spec/national-agency-pipeline-v1.md`](./national-agency-pipeline-v1.md)

## 10. 2026 年 v5.3 阶段不做的事

- ❌ **不写任何模型代码**
- ❌ 不建 GPU infra
- ❌ **不招** ML engineer（等 v5.5）
- ❌ 不向投资人承诺任何时间点之前的模型产出
- ❌ 不用 "world model" 标签在对外文案里替代 "ground truth layer" —— 世界模型是长期愿景，ground truth 是当前现实

## 11. Decision gates（跨阶段触发）

| Gate | 时间 | 触发动作 |
|---|---|---|
| Dataset 达到 1,000 triplets 但质量 audit < 90% | M1 | 暂停 neighborhood 扩张，先修数据管道 |
| Baseline tabular model RMSE > 30% | Phase 1 末 | Pivot：重新定义 prediction target（更窄 or 更聚合） |
| Fine-tune prototype 不胜过 baseline | Phase 2 末 | 延后 Phase 3，保持 baseline 商用；重评开源基底 |
| EU AI Act / 类似美国立法点到 "commerce-targeting ML" | 任何阶段 | 触发全面 audit；必要时 freeze 商用推理，仅内部研究使用 |
| Competitor 宣布类似产品 | 任何阶段 | 24 小时内 Jiaming + 法务评估是否真实威胁；若是，加速 dataset moat 而非模型 race |

## 12. Changelog

- **v1 (2026-04-20, v5.3)** — 初版 R&D 路线图；对齐 v5.3 Physical-World Ground Truth Layer 定位 + P0-2 schema + P2-1 consent + P2-2 multimodal dataset
