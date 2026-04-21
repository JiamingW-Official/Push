# EXEC-P5-3a — Data Pipeline Spike (Decision Doc)

**Status**: spike / research — NOT an implementation prompt.
**Timeframe**: kickoff 2026-04-25, conclude 2026-05-02 (one calendar week).
**Owner**: engineering (lead), data-science advisor (reviewer).
**Output**: a signed decision in §6 below, chosen from the three options in §3. That decision becomes the scope of the P5-3b implementation prompt (written 2026-05-02).

---

## 1. Why now

`push_transactions` starts filling with real rows on 2026-05-15 (Pilot W1). By 2026-06-30 we expect ~45 000 rows across ~8 merchants. Three downstream use cases each need different slices of this data and cannot all be served from Supabase Postgres without hurting OLTP latency:

1. **Ops weekly report** (Ops FTE utilization, SLR, conversion funnel) — aggregation query with 7-day rolling windows, runs every Monday.
2. **Creator dashboard tier progression** — per-creator 6-month earnings rolling, cross-merchant visit counts. Already partially served from Postgres; will cross the "painful" threshold around 100 k rows.
3. **Investor updates / pitch-deck refresh** — ad-hoc queries. Today these are served via the Supabase SQL Editor, which leaks access to live prod.

A warehouse layer decouples read-heavy analytics from write-heavy OLTP and gives us a second, narrower access-control surface for investor-grade queries.

---

## 2. Requirements

| ID | Requirement | Constraint |
|---|---|---|
| R1 | Sync latency `push_transactions → warehouse` | ≤ 1 h for batch; ≤ 60 s for CDC. Ops weekly and creator dashboard tolerate 1h; investor dashboard ad-hoc tolerates 1h. |
| R2 | Cost ceiling for Pilot | ≤ US$ 200/month total. Hard ceiling, not guideline. |
| R3 | Analyst access control | Separate SSO from Supabase. No-one with analyst access can mutate OLTP. |
| R4 | Retention | Warehouse mirrors OLTP's 24-month retention on `push_transactions`. Deletes propagate within 48 h. |
| R5 | PII handling | Warehouse columns that arrive hashed (device_id_hash, customer_id_hash) stay hashed. Columns NOT hashed in OLTP (demo_age_bucket, demo_ethnicity_bucket) must be bucketed to k ≥ 5 before exposure to any non-eng analyst. |
| R6 | Deploy contract | One `terraform apply` / CLI `create-stack` command stands up the whole thing. No click-ops. |
| R7 | Observability | Sync job failures emit to Sentry + a Slack `#data-alerts` channel (Slack webhook optional in Phase A, required by W+4). |

---

## 3. Option comparison

Three realistic options at our scale. All other options (Databricks, BigQuery with workflows, Redshift) are too expensive or too heavy for Pilot and are dismissed in §3d.

### 3a. Option A — Supabase → BigQuery via Fivetran

```
Supabase Postgres ──► Fivetran connector ──► GCP BigQuery
                        (CDC, 5-min polling)      (read via Looker Studio / dbt)
```

**Pros**:
- Zero code. Connector + warehouse set up in ~2 hours.
- Fivetran handles schema drift and type mapping.
- BigQuery is free for queries under 1 TiB/month; our Pilot data stays under 1 GB.

**Cons**:
- Fivetran starts at US$ 120/month (Starter, 500k monthly active rows). Our Pilot easily stays inside, but the bill jumps sharply past W1.
- Data leaves our Vercel + Supabase trust boundary; privacy counsel must sign off on transfer to a third-party processor.
- BigQuery's security model (IAM) is powerful but has a learning curve the team hasn't paid yet.

**Cost at Pilot volume**: Fivetran US$ 120 + BigQuery storage ~US$ 0.10 + query ~US$ 0 = **~US$ 120/month**. Room under R2.

### 3b. Option B — Supabase → Supabase logical replication → DuckDB on a VPS

```
Supabase Postgres ──► Supabase logical replication ──► t3.small EC2 running DuckDB
                                                    (nightly materialized refresh)
```

**Pros**:
- One additional cloud account (AWS) already held.
- DuckDB's file format opens from any tool, no vendor lock.
- Bill is deterministic: EC2 ~US$ 16/month, storage ~US$ 2/month, total ~US$ 20.
- Full control of data path; no third-party processor in the middle.

**Cons**:
- Logical replication from Supabase's managed Postgres requires `wal_level = logical`, which Supabase supports on all paid tiers but requires opening a support ticket to enable replication slots.
- Team has to maintain the EC2 + the replication consumer process (a small Node/Python daemon). When the daemon dies at 3 AM, we find out from the Monday report being empty.
- No off-the-shelf BI tool. Analysts have to write SQL against DuckDB's HTTP adapter or open a file locally.

**Cost at Pilot volume**: **~US$ 20/month**. Far under R2.

### 3c. Option C — Supabase-native Edge Functions → Supabase storage Parquet + DuckDB WASM

```
Supabase Postgres ──► scheduled Edge Function ──► Supabase Storage bucket (Parquet)
  (Mon/Wed/Fri 02:00 UTC)                        ──► DuckDB-WASM in a Next.js admin page
                                                      (read-only, in-browser query)
```

**Pros**:
- No new vendor. Everything stays in Supabase + our Vercel deploy.
- US$ 0 / month additional cost (storage bucket is included in Supabase free / Pro plans up to 100 GB).
- Parquet files compress our 45 k Pilot rows to ~3 MB; DuckDB-WASM opens a 3 MB Parquet in 400ms in-browser.
- Analyst access is gated by our existing admin session — no new SSO.
- Full replay / time-travel analytics are free because we keep every snapshot Parquet by date.

**Cons**:
- Batch-only; no CDC. Dashboard reflects yesterday's data at earliest.
- In-browser query means bigger-than-laptop-RAM queries (unlikely at Pilot, possible post-Pilot) just don't run.
- Edge Function scheduling uses Supabase's cron (recently GA, not battle-tested by us).
- Any schema change requires a matching Parquet schema migration. Manual for the first few, scriptable thereafter.

**Cost at Pilot volume**: **~US$ 0 / month** (all inside existing Supabase Pro). Well under R2.

### 3d. Options dismissed

- **Databricks** — overkill at Pilot scale, minimum spend US$ 300+/month.
- **Snowflake** — same, credit-based minimum.
- **AWS Redshift** — ops burden too high for our team size.
- **Supabase direct analytical queries** — would meet R1, R3, R4 but degrades OLTP latency under load; rejected.

---

## 4. Scoring matrix

Each requirement scored 1–5 per option (5 = best).

| Requirement | A (Fivetran+BQ) | B (DuckDB+EC2) | C (Parquet+WASM) |
|---|---:|---:|---:|
| R1 latency | 5 | 4 | 3 |
| R2 cost | 3 | 5 | 5 |
| R3 access control | 4 | 3 | 4 |
| R4 retention | 4 | 4 | 5 |
| R5 PII handling | 3 | 5 | 5 |
| R6 deploy contract | 5 | 3 | 4 |
| R7 observability | 4 | 2 | 3 |
| **Weighted total** | **4.0** | **3.7** | **4.1** |

Weights: R1=1.2 (latency), R2=1.5 (cost), R5=1.5 (PII), rest=1.0.

---

## 5. Open questions to resolve in the spike week (04-25 → 05-02)

Each question has an owner and a deadline inside the spike window.

1. **Can Supabase's Edge Function cron actually run reliably at our scale?** — benchmark 3 consecutive days of scheduled runs; expect zero failures. (Owner: engineering. Due 04-28.)
2. **Does Fivetran's privacy DPA satisfy the CCPA service-provider exception?** — legal reads the DPA + our privacy policy. (Owner: legal. Due 04-30.)
3. **How big is the Parquet snapshot at 90-day Pilot end volume (~135 k rows, 32 cols)?** — extrapolate from a synthetic dataset. Expect 8–15 MB. (Owner: engineering. Due 04-28.)
4. **What does the "analyst" persona actually need?** — one 30-minute interview with Ops (Milly) + one with the incoming ML advisor. Output: a top-10 query list. (Owner: founder. Due 04-29.)
5. **Canary cutoff: which option survives if the Pilot 6-month extension happens (~500 k rows)?** — run a scaled synthetic load in each option's sandbox. (Owner: engineering. Due 05-01.)

---

## 6. Decision template (complete before 2026-05-02)

> After spike research 2026-04-25 → 2026-05-02, the team selected **Option ___** because:
>
> - Primary driver: ___________________________________________________________
> - R5 (PII) compliance posture: _________________________________________________
> - Cost under R2: US$ ____ / month at Pilot volume, US$ ____ / month at Post-Pilot.
> - Identified risks + mitigations: _______________________________________________
>
> Implementation prompt (P5-3b) will be written the same day with the following scope lock:
> - Tables / buckets to create: ___________________________________________________
> - Sync mechanism: ______________________________________________________________
> - Query surface for analysts: ___________________________________________________
> - Observability path: ___________________________________________________________
>
> Signed: ________________________ (eng) / ________________________ (legal)

---

## 7. What the spike produces

- A populated §6 decision paragraph, signed by eng + legal.
- A 1-page query-list appendix (output of question #4).
- One smoke test per option run against a synthetic dataset, attached as `docs/v5.3-spike-evidence/`:
  - `option_a_fivetran_smoke.log`
  - `option_b_duckdb_ec2_smoke.log`
  - `option_c_parquet_wasm_smoke.log`
- A followup task `EXEC-P5-3b` — the concrete implementation prompt written against the chosen option, delivered same day as the decision.

---

## 8. What the spike is NOT

- Not an implementation. No ETL code runs against real data in this window.
- Not a vendor negotiation. If Option A is picked, contract-signing is a separate thread.
- Not a Pilot blocker. Pilot launches 2026-05-15 whether or not this spike concludes. The warehouse is a W+3 deliverable.

---

## 9. Rollback if spike fails

If §6 cannot be signed by 2026-05-02:

- Push defers the warehouse layer by one month.
- Ops weekly report stays on Supabase SQL Editor with a locked read-only analyst role (existing CLAUDE.md recommendation).
- Creator dashboard stays on Postgres; we add a `perf_indexes_v2` migration if the tier-progression query crosses 200ms p95.
- Re-run this spike document with different options (Clickhouse, Tinybird) as the next attempt.
