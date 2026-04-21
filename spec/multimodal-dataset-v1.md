# Multimodal Creative-to-Conversion Dataset v1 (v5.3)

**Version**: v1 (v5.3 authoritative)
**Owner**: Jiaming
**Status**: **Spec only** — no code, no model training in v5.3. Implementation deferred to v5.4+.
**Purpose**: Ensure the pilot-era data pipeline correctly links creator creative content (video / image) to verified in-store conversions, so the resulting label corpus is usable for future multimodal model work without retroactive field archaeology.
**Sibling docs**:
- `/spec/data-schema-v1.md` — transaction-level schema (P0-2; provides `creative_content_hash` link key)
- `/spec/consent-privacy-v1.md` — consumer consent tiers (P2-1; gates aggregation participation)
- `/spec/top-tier-creator-cultivation-v1.md` — T4–T6 cultivation + RSA (P1-3; creator opt-in contract text)
- `/spec/data-licensing-tiers-v1.md` — downstream tiered licensing (P1-4; defines "aggregated insight" products that sit on top of this dataset)

## 0. Why this is Push's most unique asset

Push is the only scalable production source of **("creative content", "physical conversion")** paired labels globally. TikTok / IG have engagement; Placer.ai has foot traffic aggregates; neither has the link between a specific creator post and verified in-store redemption at device-level first-party ID.

This dataset underlies the **Physical-World Ground Truth Layer** positioning (see push-strategy § 1). Getting the schema right now prevents the Month-6 realization that half the fields are missing and un-backfillable.

## 1. 数据集形态

每条样本 = (creative_content, context, outcome) 三元组。

### Creative content（输入）

- 原始文件: video (mp4, mov) 或 image (jpg, png)
- 转录文本（video 自动 Whisper 转录）
- OCR 文本（image 中文字）
- Metadata: 发布平台（TikTok / IG / Xiaohongshu / 本地）, 发布时间, 时长, 分辨率
- Creator ID（**非匿名**，因为 label 需要 creator-level 追踪）
- Creative hash（SHA256，链到 `push_transactions.creative_content_hash`）

### Context（环境）

- Merchant / category
- Neighborhood（zip 前 3 位）
- Hour of week
- Weather code
- Local event nearby
- Price tier of merchant（Beachhead / Scale 类）

### Outcome（label，来自 push_transactions aggregation）

- `verified_conversions_24h` — 24h 内验证到店人数
- `verified_conversions_7d`
- `conversion_rate` — verified / estimated_reach
- `avg_redeem_delta_sec` — 平均扫码到到店时间
- `retention_rate_14d` — 14 天内回头率
- `demographic_distribution` — 到店消费者的 demo bucket 分布
- `revenue_per_conversion` — aggregated $

## 2. Storage 设计

### 冷热分层

- **热层 (Supabase)**: metadata + outcome，SQL 可查
- **冷层 (S3 或 Cloudflare R2)**: 原始 video / 图片文件
- **链接**: `push_transactions.creative_content_hash` → S3 path lookup

### 目录结构

```
s3://push-multimodal-v1/
  ├─ creatives/
  │   ├─ video/
  │   │   └─ [content_hash].mp4
  │   └─ image/
  │       └─ [content_hash].jpg
  ├─ transcripts/
  │   └─ [content_hash].json        # Whisper output
  ├─ ocr/
  │   └─ [content_hash].json        # OCR output
  └─ dataset_manifests/
      └─ [date_range].jsonl          # 训练样本索引
```

### 数据量预估

| Phase | 量级 | 存储 |
|---|---|---|
| Pilot Month 3 | ~200 creatives × 10MB avg | 2 GB |
| Month 6 | ~1,000 creatives | 10 GB |
| Month 12 | ~5,000 creatives | 50 GB |
| Month 24 | ~30,000 creatives | 300 GB — 仍在低成本 object storage 范围 |

## 3. Label quality gates

### 入集标准（只有满足才进 dataset）

- Creative `content_hash` 能链到至少 **10 条** `push_transactions`
- 7 天内 outcome 全采集完（conversion, retention, revenue 都 ready）
- Consumer `consent_tier >= 2`（提供足够 context 给 context / outcome 字段）

### 排除（不入集）

- Creative 被删除（DMCA / platform takedown）
- Creator 要求删除自己的内容（opt-out，见 § 5）
- Outcome 异常（suspected fraud；ConversionOracle 标红）

## 4. 使用权限

### Push 内部

- 用于 ML 研发、产品优化、归因模型改进
- 内部 access 要走 RBAC，非研发岗位默认无访问

### 第三方（**v5.4+** 才开放）

- **Enterprise brand**: 仅 aggregated insight（"此类创意平均转化 X%"），**不给 raw**
- **学术合作**: 匿名化后，带 IRB 审批可授权
- **永不**直接卖 raw video / image 文件

## 5. Creator 权利

- Creator 在 Push 发布 = 授予 Push **非独家**使用权 for ML 训练
- Creator 可随时 opt-out（撤销未来使用权）
- Creator 已进入训练集的历史数据，在 retraining 时自动排除（遵循 ML unlearning 最佳实践）
- Creator RSA / 合同中明确此条款（与 P1-3 top-tier-creator-cultivation 的 T5+ retainer 合同同步）

## 6. Future model 目标（仅愿景，不在 v5.3 实现）

### Near-term (v5.4 – v5.5)

Fine-tune 开源 multimodal model（例如 LLaVA, Qwen-VL）预测：

- 给定 creative + context → 24h conversion rate
- 给定 merchant + neighborhood → best creative style recommendation

### Long-term (Series A+)

Train Push-specific model

- 输入: creator history + creative + neighborhood + target demo
- 输出: probable conversion funnel，含 drop-off points

### 阶段 gate

v5.3 **只做 data engineering**。Model 训练必须等 Dataset Month 6+（至少 1,000 高质量样本）。

## 7. 隐私 / 合规兼容

- 原始 creative 可能包含消费者**面部** → 不 OK，训练前必须 **face detection + blur**
- OCR / transcript 可能包含 PII → 训练前 **NER** 移除
- Creator 面部 OK（因为已 consent 为 public-facing performer）
- Aggregated outcome 按 P2-1 consent framework **k ≥ 5** 处理
- Consent tier=1 行永不参与该 dataset（与 P1-4 licensing 一致，一条红线贯穿）

## 8. 实现时间线（**仅 spec，不在 v5.3 跑**）

| 版本 | 动作 |
|---|---|
| v5.3 | 本 spec + schema 到位（`creative_content_hash` 字段已在 P0-2 migration 中） |
| v5.4 Month 1–2 | ETL pipeline 搭建（creator 发布 → S3 存储 → metadata 入库） |
| v5.5 Month 3–4 | 首批 Whisper / OCR 批处理 |
| v6 之后 | 首个 fine-tune prototype |

## 9. Cross-refs

- 依赖 P0-2 schema（`push_transactions.creative_content_hash` 见 `/spec/data-schema-v1.md` § Commerce）
- 依赖 P2-1 consent（消费者数据 aggregation 权限见 `/spec/consent-privacy-v1.md`）
- 依赖 P1-3 creator cultivation（RSA 合同条款见 `/spec/top-tier-creator-cultivation-v1.md` § 3 经济锁定）
- 下游对接 P1-4 `/spec/data-licensing-tiers-v1.md`（aggregated insight 产品线站在本数据集上）

## 10. 不做的事（v5.3 内）

- ❌ **不实际训**任何模型
- ❌ **不搭** S3 pipeline（写在 spec 里，但代码推到 v5.4）
- ❌ **不做** Whisper / OCR 批处理
- ❌ **不开放**给第三方（任何 tier、任何形式）
- ❌ **不反向还原** individual identity（任何聚合视图都要通过 k ≥ 5 检查）

## 11. Jiaming 手动动作（Claude Code 做不了 / 暂不做）

- [ ] 选定 object storage 供应商（AWS S3 vs Cloudflare R2），估价到 Month 12
- [ ] 起草 creator RSA 关于 ML 训练授权的条款（counsel review 必须）
- [ ] v5.4 开 ETL pipeline 任务前，确认 pilot Month 3 creative 量是否到 200 的预期

## Changelog

- **v1 (2026-04-20, v5.3)** — 初版 multimodal dataset spec；对齐 Physical-World Ground Truth Layer 定位 + P0-2 schema + P2-1 consent + P1-4 licensing
