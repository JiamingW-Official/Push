# Consent & Privacy Framework v1 (v5.3)

**Version**: v1 (v5.3 authoritative)
**Owner**: Jiaming
**Status**: Must ship before Williamsburg Coffee+ pilot goes live — without this the P0-2 schema is not legally usable
**Scope**: 3 consent tiers, consumer-facing UI copy, privacy-policy skeleton, CCPA/CPRA checklist, APRA pre-wiring, FTC alignment
**Sibling docs**:
- `/spec/data-schema-v1.md` — field-level definitions (P0-2)
- `/spec/data-licensing-tiers-v1.md` — downstream licensing product tiers (P1-4)
- `/spec/nyc-agency-playbook-v1.md` — agency LOI (P1-1)

## 0. Why this matters (and why it must ship Day 3)

Three concurrent goals:

1. **CCPA / CPRA 合规**（加州；pilot 在 NY，但用户可能全美）
2. **APRA 预备**（federal privacy bill，预期 2026–2027 通过）
3. **消费者信任**（P1-1 audit 里消费者视角仅 5.0，是目前弱项）

如果不在 Day 3 ship，Day 5 扫码上线就没有合法收集基础 —— P0-2 的 schema 全部作废。

## 1. 三层 Consent Tier

### Tier 1: Basic Attribution（最小集合）

**采集**:

- device_id_hash
- creator_id, merchant_id
- claim_timestamp, redeem_timestamp
- order_total_cents（粗粒度 bucket）
- campaign_id

**用途**: 仅限归因。**不参与任何 data licensing aggregation**。

### Tier 2: Full Context（默认推荐）

Tier 1 + 以下：

- GPS（claim + redeem）
- demo_age_bucket, demo_gender, demo_zip_home（前 3 位）
- product_category
- hour_of_week, weather_code

**用途**: Push 内部分析 + **aggregated** data licensing（最小 k = 5）。

### Tier 3: Commercial Data Sharing

Tier 2 + 以下：

- cross_merchant_count
- product_sku_hash
- demo_ethnicity_bucket（仅 bias audit）

**用途**: 参与 enterprise + media licensing（仍 aggregated，min k = 5）。

## 2. Consumer 扫码页文案（中英文）

### 中文

```
欢迎使用 Push

当你扫码领取优惠时，我们会收集以下数据：
- 你的扫码设备匿名 ID（不是 IDFA）
- 扫码和核销时间
- 订单金额

你可以选择是否让我们收集更多（更精准的推荐需要这些）:

[ ] 基础（仅归因）
[x] 完整上下文（推荐）— 加 GPS、年龄段、性别
[ ] 商用授权 — 加匿名画像，参与 aggregated 数据产品

[继续] [全部拒绝] [我的数据权利]
```

### English

```
Welcome to Push

When you scan to claim an offer, we collect:
- Your device's anonymous ID (not IDFA)
- Claim + redeem timestamps
- Order total

You can choose how much more we collect (more means sharper offers):

[ ] Basic (attribution only)
[x] Full context (recommended) — adds GPS, age bucket, gender
[ ] Commercial — adds anonymized profile for aggregated data products

[Continue] [Decline all] [Your data rights]
```

## 3. Privacy Policy 必备章节

1. **我们收集什么** — 按三层 tier 列举所有 32 字段（对齐 data-schema-v1）
2. **为什么收集** — 归因 / 推荐 / 商业产品
3. **与谁分享** — Agency / Brand / 媒体（**aggregated only**，min k = 5）
4. **你的权利**:
   - Access — 导出所有自己的数据
   - Deletion — 30 天内硬删
   - Opt-out of sale — CCPA required
   - Correction — 修改不准确的 demo 字段
5. **保留期限** — 行级 24 月，aggregation 永久（对齐 data-schema-v1 § Retention）
6. **联系** — privacy@push.nyc（须创建此邮箱）

## 4. CCPA / CPRA 合规 checklist

- [ ] "Do Not Sell My Personal Information" 链接放 landing page footer（即使没真卖也放 —— 法规要求显性链接）
- [ ] Privacy policy 明确列出 "Categories of personal information collected in the preceding 12 months"
- [ ] Consumer request 提交表单（web form）
- [ ] **45 天**响应时限 SOP（CCPA 法定）
- [ ] Employee training 记录（即使只有 Jiaming，也记录）
- [ ] Vendor agreement DPA 条款（Supabase / Vercel / Stripe / OpenWeather）
- [ ] Annual opt-out statistics report（CPRA 新增）

## 5. APRA 预备（federal bill 预期 2026–2027）

APRA 相对 CCPA 的核心差异：

- **数据最小化原则** — only what's necessary for stated purpose
- **Covered algorithmic decisions** 需 impact assessment
- **Third-party 转售** 需明示 consent

Push 预备动作：

- 每新加一个字段 都写 "why"（schema 变更 checklist）
- 每个 ML / 算法决策写 impact log（未来可 audit；push-metrics SKILL 里做）
- Third-party 转售默认 off，Tier 3 opt-in 才 on

## 6. FTC 16 CFR § 255 兼容

Consent 框架与 v5.1 DisclosureBot 协同：

- 每次 creator campaign 扫码页强制展示 `#广告` 披露
- Consent 页面也提醒消费者 "这是 creator 广告，不是编辑推荐"
- 合规标签必须在扫码落地**首屏可见**（不能折叠 / 滚动后出现）
- 见 push-attribution SKILL 的披露流程条款

## 7. 三层 tier 转化率预期

基于行业参考（Placer.ai / Branch.io 的类似机制）:

| Tier | 预期选择率 | 说明 |
|---|---|---|
| Tier 1 only | ~15% | 隐私敏感用户 |
| Tier 2 (default) | ~70% | 默认选中，多数不改 |
| Tier 3 | ~15% | 有奖励 / 折扣加持才选 |

Push 激励机制:

- Tier 2 默认选中（但视觉上明显可改 —— 不能暗箱默认）
- Tier 3 选中送 **$2 额外折扣**（一次性）
- 激励条款本身也写进 privacy policy（透明）

## 8. 硬边界（永不 crossable）

- ❌ 永远不在 Tier 1 / 2 / 3 任何一档采 payment card / bank account / SSN
- ❌ 永远不采 mic / camera raw stream
- ❌ 永远不把 location 精度 < 100m 的数据 aggregate 出去
- ❌ 永远不向 minor（< 18）推送 Tier 2 / 3；`demo_age_bucket = 'u18'` 自动降到 Tier 1 且 opt-out by default

## 9. 实现对接

### 数据库
- schema 层（P0-2 产出）已含 `consent_tier` SMALLINT CHECK (1,2,3) NOT NULL
- `consent_version` TEXT NOT NULL 记录用户同意时的 policy 版本
- aggregation 层 SQL 加 `WHERE consent_tier >= 2` 过滤（Tier 1 永除）；Tier 3-only aggregation 再加 `consent_tier = 3`

### 前端
- `components/customer/ConsentPicker.tsx` 作为扫码页 consent 选择组件
- Footer `COMPANY_LINKS` 增加 "Do Not Sell My Personal Information" 与 "Your Privacy Rights"
- Privacy page `app/(marketing)/legal/privacy` 扩章节对齐 § 3

### 后端
- 消费者扫码落地后 consent_tier 通过 server action 写入 `push_transactions` 行
- DSAR（data subject access request）走 `/api/privacy/dsar` 新 route（service-role，45 天 SLA）

## 10. Jiaming 手动动作（Claude Code 做不了）

- [ ] 创建 `privacy@push.nyc` 邮箱并接入 ticketing（CCPA 45 天 SLA）
- [ ] 找 Delaware / CA counsel review privacy policy v1 定稿（预算 $2–5K 一次性）
- [ ] 与 Supabase / Vercel / Stripe / OpenWeather 签 DPA（多数他们已有标准模板可直接签）
- [ ] 记录第一条 employee training（即使只有自己）

## Changelog

- **v1 (2026-04-20, v5.3)** — 初版 consent + privacy 框架；对齐 P0-2 schema + P1-4 licensing tiers
