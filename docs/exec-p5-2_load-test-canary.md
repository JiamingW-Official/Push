# EXEC-P5-2 — Load Test + Vercel Canary (Prompt Spec)

**Status**: prompt written + locked in docs; execution begins Pilot W1 (2026-05-15 → 05-22).
**Executor**: whichever engineering session picks this up during W1; treat this file as a self-contained brief.
**Blocks**: W+2 (2026-05-22) go/no-go for scaling beyond the 5 Pilot merchants.

---

## 0. Boundary

This prompt modifies the same `/mnt/Push/` Next.js + Supabase repo as the earlier EXEC-P* prompts. Follow all the same boundary rules:

- **Design.md**: no new colors, no new fonts, no new radii. Observability dashboards live on Grafana Cloud, not in the Push UI, so nothing visible to end users should change.
- **CLAUDE.md**: backend standards apply to the load-test scripts too — if a script calls a Push endpoint, it uses the proper secret header, not a hardcoded fallback.
- **v5.1 numbers**: load-test thresholds derive from §3 below; do not write new "magic number" SLOs elsewhere in the repo.
- **v5.3 positioning**: no external messaging changes from load testing.

---

## 1. Goal

By 2026-05-22 (end of Pilot W1), produce a signed answer to:

> Can Push handle 10× the Pilot-launch day traffic without consumer-facing 5xx, and can we roll a new build to 10 % of traffic with a ≤ 60 s rollback path?

Concretely:

- **Load test**: simulate 10× W1 D1 traffic (see §3 for numeric targets) against prod-equivalent staging. All D15 hard-gate SLOs must hold.
- **Canary infrastructure**: Vercel canary that splits 10 % of real prod traffic onto the next build for N minutes before full promotion, with automatic rollback on an error-rate breach.

---

## 2. Deliverables checklist

Each item closes a PR with the corresponding commit prefix.

1. [ ] `scripts/load-test/k6-scan-landing.js` — k6 script hitting `/scan/[qrId]` with synthetic QR ids. (`feat(exec-p5-2a)`)
2. [ ] `scripts/load-test/k6-redemption-api.js` — k6 script POSTing to `/api/attribution/redemption` with valid secret header. (`feat(exec-p5-2b)`)
3. [ ] `scripts/load-test/k6-ops.sh` — wrapper that runs both k6 scripts against a specified BASE_URL, streams output to Grafana. (`feat(exec-p5-2c)`)
4. [ ] GitHub Action `.github/workflows/nightly-load-test.yml` — runs `k6-ops.sh` nightly against prod-equivalent staging at 03:00 ET. (`ci(exec-p5-2d)`)
5. [ ] `lib/canary/traffic-split.ts` — Vercel Edge Config reader; returns a boolean per-request `{ onCanary }`. (`feat(exec-p5-2e)`)
6. [ ] `middleware.ts` — reads traffic-split, sets `x-push-canary: 1` response header. Downstream routes read the flag to emit separate Sentry tags. (`feat(exec-p5-2e)`)
7. [ ] `scripts/canary/promote.sh` — CLI: takes a deployment URL, shifts 0→10→50→100 %, aborts on error-rate breach. (`feat(exec-p5-2f)`)
8. [ ] `scripts/canary/rollback.sh` — CLI: promotes the previous successful deployment back to 100 %. (`feat(exec-p5-2g)`)
9. [ ] Docs update: `docs/deploy-checklist-pilot-2026-05-15.md` T-3 checklist gains a "Run full k6 suite; all SLOs green" line. (`docs(exec-p5-2h)`)
10. [ ] Retrospective doc: `docs/v5.3-load-test-retro-2026-05-22.md` capturing observed p50/p95/p99, one-line root cause per breach, actions for W2. (`docs(exec-p5-2i)`)

---

## 3. SLO targets (the numbers)

All are per-endpoint unless noted. Baseline = W1 D1 observed (to be recorded during Pilot kickoff).

| Endpoint | W1 D1 baseline | 10× target | p50 | p95 | p99 | Error rate |
|---|---|---|---|---|---|---|
| `GET /scan/[qrId]` | ~20 rps | 200 rps | < 500 ms | < 2.0 s | < 3.0 s | < 0.5 % |
| `POST /api/attribution/redemption` | ~3 rps | 30 rps | < 300 ms | < 1.0 s | < 2.0 s | < 0.1 % |
| `GET /legal/do-not-sell` | ~1 rps | 10 rps | < 200 ms | < 500 ms | < 1.0 s | < 0.1 % |
| `GET /my-privacy` | ~1 rps | 10 rps | < 300 ms | < 800 ms | < 1.5 s | < 0.1 % |
| `POST /api/internal/email-send` | ~0.2 rps | 2 rps | < 500 ms | < 2.0 s | < 5.0 s | < 1.0 % |

**Notes on the SLO numbers**:

- p95 / p99 TTFB includes Vercel edge routing, lambda cold start (rare after warmup), Supabase round-trip.
- Error rate counted as 5xx from lambda. 4xx is expected (validation, unauth, rate-limit).
- `/api/attribution/redemption` gets a stricter error threshold because each failure is a lost ground-truth row with business value.
- `/api/internal/email-send` gets a looser threshold because Resend is an external dependency we don't own.

Any breach in the table above fails the 10× target. The load test's exit code is `0` only when every row is green.

---

## 4. k6 script skeletons (for reference, do not copy-paste blindly)

### 4a. `k6-scan-landing.js`

```js
import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 },   // ramp to half-target
    { duration: "3m", target: 200 },  // hold at 10× W1D1
    { duration: "1m", target: 0 },    // drain
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000", "p(99)<3000"],
    http_req_failed: ["rate<0.005"],
  },
};

const BASE = __ENV.PUSH_BASE_URL;
const QR_IDS = __ENV.PUSH_QR_IDS?.split(",") ?? ["qr-bsc-001"];

export default function () {
  const qr = QR_IDS[Math.floor(Math.random() * QR_IDS.length)];
  const res = http.get(`${BASE}/scan/${qr}`);
  check(res, { "scan:200": (r) => r.status === 200 });
}
```

### 4b. `k6-redemption-api.js`

POSTs a valid redemption payload with `x-internal-api-secret` header. Generates UUIDs + device ids client-side so each row is unique. Must use the Vercel preview environment with its own `INTERNAL_API_SECRET_PREVIEW`, never against prod.

---

## 5. Vercel canary mechanics

### 5a. Traffic split implementation

Vercel offers Edge Config + `x-vercel-weight` header. The implementation:

1. A single Edge Config key `canary_percent`, integer 0–100. Default 0.
2. `lib/canary/traffic-split.ts` reads that key at edge runtime. Each request computes a stable hash from the visitor's `x-forwarded-for + user-agent`; hash modulo 100 < `canary_percent` → the request routes to the canary deployment.
3. Non-canary requests route to the stable deployment alias `push-stable.vercel.app`. Canary requests route to the candidate deployment alias `push-canary.vercel.app`.
4. Each response carries `x-push-canary: 1` when routed to the candidate. Sentry captures this as a tag so error-rate diffs are visible per-cohort in the Sentry dashboard.

### 5b. Promote script logic

```
promote.sh <candidate_deployment_url>

1. Tag the current prod deployment as `push-stable`.
2. Tag the candidate as `push-canary`.
3. Set canary_percent = 10 via Edge Config.
4. Wait 10 min. Sample Sentry:
   error_rate_canary - error_rate_stable
   If delta > 0.5 %, abort → run rollback.sh.
5. Set canary_percent = 50. Wait 10 min, same check.
6. Set canary_percent = 100. Retag candidate as `push-stable`.
7. Emit a Slack message to #deploys.
```

### 5c. Rollback script

`rollback.sh` points the `push-stable` alias at the previous successful deployment (read from a Vercel API call), sets `canary_percent = 0`, and emits a Slack + Sentry "rollback" event.

Success criteria for rollback: from the moment an operator fires `rollback.sh`, traffic is fully restored to the previous deployment within **60 s**. (Vercel's alias-swap propagates edge-wide within ~15 s in practice; the 60 s budget is comfortable.)

---

## 6. What the retrospective must answer

`docs/v5.3-load-test-retro-2026-05-22.md` at the close of W1 contains:

1. **Observed numbers** — the same table as §3 with real columns filled in.
2. **Pass / fail per row** — explicit `✓` or `✗`.
3. **Root cause** — one sentence per failed row (e.g. "p99 on `/scan/...` blown because Leaflet tiles cold-loaded from an unbundled CDN; pre-fetching in layout.tsx fixes this; tracked as issue #NNN").
4. **Actions shipping in W2** — at most three, each with owner + deadline.
5. **Decision** — whether we extend Pilot to more merchants (Go) or hold at 5 (No-Go until the actions above close).

The retrospective goes into git so the next session can recover context cold.

---

## 7. Freeze triggers

- **Load test reveals 5xx rate > 1 % on `/api/attribution/redemption`** → every new deployment to prod blocked until root cause + mitigation land.
- **Canary promote script's error-rate diff check trips twice in one week** → cooldown: no new deploys for 48 h; engineering does a deep dive.
- **Sentry budget burn > 50 % of monthly allocation within the first 10 days** → cut `tracesSampleRate` in `sentry.*.config.ts` from 0.1 to 0.02 until budget recovers.

---

## 8. Out-of-scope for this prompt

- Full-chain chaos-engineering suite (fault injection at the middleware or Supabase level). That is P6 if we ever write it.
- Load testing merchant-auth'd paths from the POS page. Add in P5-2b if Pilot W1 reveals a POS hot path.
- Synthetic users for the creator dashboard (requires a session-auth harness we don't have). Add in P5-2c post-Pilot.
- Geographic latency tests (iad1 only for Pilot; more regions post-Pilot).

---

## 9. Success handoff

At end of W1:

1. §3 table is populated with real measurements, all rows green.
2. `canary_percent` has been flipped 0 → 10 → 50 → 100 at least once on a deploy without rollback.
3. One deliberate regression is committed to a branch, a canary promote is attempted, error-rate diff triggers, `rollback.sh` runs, prod stays on the previous build. Retro documents the drill.
4. GitHub Action is nightly and has run at least three consecutive green builds.

Only after all four land does P5-2 close.

---

## 10. Dependencies

| Upstream | Required state |
|---|---|
| P0-3 observability | Sentry env vars set in prod; middleware request-id flowing |
| P0-4 email infra | `email_log` table populated so email-send endpoint has ground-truth to load-test |
| P4-1 e2e | Playwright suite stays green; `npm run e2e` must pass before any canary promote |
| Deploy checklist | `docs/deploy-checklist-pilot-2026-05-15.md` exists and is being followed |

Downstream dependencies (things that unlock once P5-2 closes):

- P5-3b data pipeline implementation (needs stable traffic pattern as baseline).
- P5-4 multi-region expansion (needs canary muscle memory + rollback drill).
- Any Pilot expansion beyond 5 merchants.
