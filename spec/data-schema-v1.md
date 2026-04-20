# Push Transaction Data Schema v1 (v5.3)

**Version**: v1 (v5.3 authoritative)
**Status**: Pre-pilot — must be live before Williamsburg Coffee+ QR system goes into production
**Last updated**: 2026-04-20
**Source-of-truth**: this document. Implementation: `supabase/migrations/20260506_push_transactions_v5_3.sql`

## 目的

为 **Physical-World Ground Truth 层**与未来 **Local Commerce World Model** 训练奠定 label 基础。

每一条 `push_transactions` 行是一条 "ad → physical conversion" label。schema 必须在 Month 0 就埋对字段 —— Month 6 再补就晚了，历史数据不可追溯。

设计原则：
1. **Day 1 multi-modal ready** — 所有训练未来 vertical model 所需维度全部埋点
2. **First-party only** — 绝不依赖 IDFA / GAID
3. **Consent-tier gated** — 每行有 consent_tier，决定能否出现在 data licensing aggregation
4. **Bias-audit ready** — demo 字段 opt-in 采集，但仅用于内部公平性审计

## 30+ 必采字段（按组）

### Identity (first-party, 5 字段)
- device_id_hash         TEXT NOT NULL — SHA256(device identifier), first-party, 非 IDFA
- creator_id             UUID NOT NULL
- merchant_id            UUID NOT NULL
- customer_id_hash       TEXT NOT NULL — anonymized
- transaction_id         UUID PK

### Timing (4 字段)
- claim_timestamp        TIMESTAMPTZ NOT NULL
- redeem_timestamp       TIMESTAMPTZ NULL — 未核销为 NULL
- time_to_redeem_sec     INTEGER GENERATED
- expiry_timestamp       TIMESTAMPTZ NOT NULL

### Location (opt-in, 5 字段)
- claim_gps_lat          NUMERIC(9,6) NULL
- claim_gps_lng          NUMERIC(9,6) NULL
- redeem_gps_lat         NUMERIC(9,6) NULL
- redeem_gps_lng         NUMERIC(9,6) NULL
- merchant_dwell_sec     INTEGER NULL

### Commerce context (5 字段)
- product_category       TEXT NOT NULL CHECK IN ('coffee','pastry','beverage','meal','retail','service','other')
- product_sku_hash       TEXT NULL
- order_total_cents      INTEGER NOT NULL
- campaign_id            UUID NOT NULL
- creative_content_hash  TEXT NOT NULL — 链到 creator 发布内容的 SHA256

### Consumer demo (opt-in, 4 字段)
- demo_age_bucket        TEXT NULL CHECK IN ('u18','18-24','25-34','35-44','45-54','55+')
- demo_gender            TEXT NULL CHECK IN ('m','f','nb','decline')
- demo_zip_home          TEXT NULL — 仅前 3 位以降低可识别性
- demo_ethnicity_bucket  TEXT NULL — for bias audit only, opt-in

### Behavioral (3 字段)
- is_first_visit         BOOLEAN NOT NULL
- cross_merchant_count   INTEGER NOT NULL DEFAULT 0 — Push 系统内历史
- referral_chain_depth   INTEGER NOT NULL DEFAULT 1

### Environmental context (3 字段)
- weather_code           TEXT NULL — 拉自 OpenWeather API, claim 时刻
- local_event_nearby     TEXT NULL — 10 分钟步行半径内活动
- hour_of_week           SMALLINT GENERATED — 0-167

### Compliance (3 字段)
- consent_version        TEXT NOT NULL — 记录用户同意的 privacy policy 版本
- ftc_disclosure_shown   BOOLEAN NOT NULL
- consent_tier           SMALLINT NOT NULL CHECK IN (1,2,3) — 1=基础归因 / 2=完整 / 3=商用授权

**合计：32 个字段**

## 索引

- idx_creator_claim (creator_id, claim_timestamp DESC)
- idx_merchant_redeem (merchant_id, redeem_timestamp DESC) WHERE redeem_timestamp IS NOT NULL
- idx_campaign_performance (campaign_id, redeem_timestamp)
- idx_device_cross_visit (device_id_hash, claim_timestamp)

## 隐私注意

- demo_ethnicity_bucket 只用于 bias audit，不出现在任何外部 aggregation
- demo_zip_home 只存前 3 位（e.g. "112" for 11249 / 11211 / 11206），不存完整 zip
- creative_content_hash 指向 object storage，原图 / 视频单独访问权限控制
- consent_tier=1 的行禁止参与 data licensing 任何 aggregation

## Retention

- 原始行级数据保留 24 个月
- Aggregation 视图（neighborhood 级、不可回溯到单行）永久保留
- consent 撤销后 30 天内硬删除

## 未来兼容

- 预留 `extras JSONB` 字段（不在 32 字段中），用于 v5.4+ mobile sensor 数据 staging

## 写入流程（关键守则）

1. 扫码核销流程（merchant QR scan）时必须写齐所有 `NOT NULL` 字段 — 否则整行 INSERT 失败
2. Opt-in 字段允许 NULL，但 `consent_tier` 必须在流程前采集
3. `time_to_redeem_sec` 和 `hour_of_week` 由 DB trigger 自动计算，不应由应用层写入
4. 所有写入走 service-role client；RLS 只允许 creator / merchant 读自己相关行

## 变更流程

- Schema 变更须走新的 migration 文件，不得修改已上线迁移
- 新加字段默认 NULL 或带 DEFAULT，保证历史行可回填
- 字段删除/重命名须 deprecation 窗口 ≥ 2 个 pilot 周期
- 变更须在本文件追加 changelog 行

## Changelog

- **v1 (2026-04-20, v5.3)** — 初版 32 字段 schema，对齐 v5.3 Physical-World Ground Truth Layer 定位
