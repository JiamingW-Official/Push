# Push — Workspace Guidelines

Single source of truth for code standards on this repo. Design standards live in [Design.md](./Design.md); everything else is here.

---

## Skills

Domain knowledge lives in `.claude/skills/`. Load only what a task needs. Start at `push-hub` and it routes to the right domain skill.

| Skill | Domain |
|---|---|
| `push-hub` | Router + quick-reference numbers |
| `push-strategy` | Positioning, agentic roadmap, competition |
| `push-creator` | 6-tier system, scoring, recruitment |
| `push-pricing` | Pricing tiers, unit economics |
| `push-attribution` | QR attribution, verification, anti-fraud |
| `push-campaign` | Campaign design, workflow, SLAs |
| `push-gtm` | Cold-start plan, acquisition, expansion |
| `push-metrics` | KPIs, dashboard, data model |
| `push-website` | Brand visuals, content standards |
| `push-brand-voice` | Voice, copy, messaging templates |
| `push-ui-template` | Page / section / component specs |

---

## Design system (MANDATORY · v7 2026-04-24)

Before touching any UI code, read [Design.md](./Design.md). Non-negotiables:

- **iOS 26 continuous corner** — radii from the `8 / 12 / 14 / 20 / 28 / 32 / pill / circle` scale. `border-radius: 0` is forbidden.
- **Ink + 2 brand accents + 6 category colors only** — `#0a0a0a` Ink (text/UI) + `#c1121f` Flag Red (primary action, brand) + `#bfa170` Champagne Gold (ceremonial, Partner). Category: `#b8624a` Dining / `#4a7a8c` Travel / `#b5807f` Beauty / `#5d4a6b` Fashion / `#7a8d6e` Fitness / `#8b3a4c` Entertainment. No new brand colors without updating Design.md.
- **Two fonts only** — Darky (display/headings) + CS Genio Mono (body/UI). Weight contrast is the core visual tool.
- **8px base grid** — section padding 72–128px responsive.
- **Background** — `#fbfaf7` Ivory Warm White. Never pure white, never Papaya Whip.
- **Light mode only.**
- **Interactions** — GSAP ScrollTrigger + Lenis. iOS 26 spring timing `cubic-bezier(0.34, 1.56, 0.64, 1)` on interactive press.
- **Elevation** — iOS 26 three-layer soft shadow (`--shadow-1 / 2 / 3`). Glass morphism allowed on sticky nav, modal overlay, toast. Retired: hard-offset `3px 3px 0 ...` Brutalist shadows.
- **Bold Modular** — few large 28–32px radius blocks per section, 96–128px breathing room. Not dense grids.

Override third-party component radii to match this scale (not to 0). Deviations from Design.md require user sign-off and a doc update in the same PR.

---

## Backend standards

### Supabase client usage

One directory, three clients, each with a single responsibility. Do not create new client-init code elsewhere.

| File | Key | Use from |
|---|---|---|
| `lib/db/browser.ts` → `createClient()` | anon/publishable | Client Components (`'use client'`) |
| `lib/db/server.ts` → `createServerSupabaseClient()` | anon + cookie session | Server Components, Route Handlers, Server Actions |
| `lib/db/index.ts` → `supabase`, `db.{select,insert,update,delete}` | service role (RLS bypass) | Server-only: cron, internal APIs, backend services |

`lib/db/server.ts` imports `next/headers` — never import it from a Client Component; Next will throw at build.

`lib/db/index.ts` hard-throws at boot in production if `SUPABASE_SERVICE_ROLE_KEY` is missing. This is intentional (fail closed, never silently downgrade to anon).

### API route conventions

All Route Handlers in `app/api/**/route.ts` follow the same shape. Use the helpers in [`lib/api/responses.ts`](./lib/api/responses.ts) — do not return raw `NextResponse.json(...)`.

```ts
import { success, badRequest, unauthorized, serverError } from "@/lib/api/responses";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await requireAdminSession(req);
  if (!session) return unauthorized();

  try {
    const merchants = await db.select("merchants");
    return success({ merchants });
  } catch (err) {
    return serverError("admin-merchants", err);
  }
}
```

Response envelopes:
- **Success (2xx):** `{ data, timestamp, ...extras }`
- **Client error (400):** `{ error: "message", ...hints }`
- **Auth errors (401/403/404):** `{ error: "message" }`
- **Server error (500):** `{ error: "Internal error", trace_id }` — the `trace_id` correlates with server logs; never leak Postgres text / stack traces to clients.

### Auth guards

Three audiences, three guards. Pick the right one at the top of every authenticated route.

| Guard | Gate | Returns |
|---|---|---|
| `requireAdminSession(req)` | Push internal team | 401 if missing |
| `requireCreatorSession(req)` | Authenticated creator | 401 if missing |
| `requireMerchantSession(req)` | Authenticated merchant | 401 if missing |

Internal service-to-service endpoints (`/api/internal/*` **and `/api/attribution/*`**) are gated in `middleware.ts` via `INTERNAL_API_SECRET` — do not re-gate them in the route itself. Callers pass the secret in the `x-internal-api-secret` header.

### Service layer

Domain logic lives in `lib/services/*.ts` as stateless modules (or classes of stateless methods). Routes are thin: parse input → call service → format response. Services do not import Next primitives.

### v5.3 ground-truth tables

The Physical-World Ground Truth Layer (v5.3-EXEC) adds five service-role-only tables on top of the v5.0 schema. All writes go through `lib/db/index.ts` (service role); RLS is enabled on every row but most carry no `authenticated`-role SELECT policy — backend code is the only intended reader.

| Table | Primary purpose | Writer path |
|---|---|---|
| `push_transactions` | 32-field ground-truth row per ad → physical conversion | `/api/attribution/redemption` (secret-gated) or `/api/merchant/redeem` (merchant-session) |
| `consent_events` | Append-only audit of consent-tier / disclosure events | (writer TBD — see P0-SEC-4 in the optimization audit) |
| `privacy_requests` | CCPA/GDPR DSAR intake ledger, 45-day SLA via `due_at` | `/api/privacy/dsar` |
| `oracle_audit` | One row per ConversionOracle decision, signal scores in JSONB | `AIVerificationService.saveOracleAudit()` (called from `/api/admin/oracle-trigger`) |
| `qr_codes` | Per-poster QR record, owned by a merchant | `/api/merchant/qr-codes` |

The existing v5.0 `ai_verifications` table is distinct — it's keyed to `qr_scans` (pre-v5.3 flow) and stays for compatibility. New code should use `oracle_audit`.

### Environment variables

Full contract in [docs/env-vars.md](./docs/env-vars.md). Rules:

- All reads go through the client modules (`lib/db/*`). Do not `process.env.XXX` inline in feature code.
- Production has hard throws for `SUPABASE_SERVICE_ROLE_KEY` (in `lib/db/index.ts`) and `INTERNAL_API_SECRET` (in `middleware.ts`). Never add silent fallbacks to these.
- `NEXT_PUBLIC_USE_MOCK="1"` only gates demo data in non-production builds. Do not ship production code that reads it.

### Logging

Use `console.error` only for unexpected errors in route handlers (shows up in Vercel runtime logs). Do not `console.log` for debugging in committed code — leave it in dev only.

---

## Git workflow

- **Branches:** `feat/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`. Delete after merge.
- **Commits:** Conventional Commits. Subject ≤70 chars. Body explains the *why*.
- **PRs:** `npm run type-check && npm run test && npm run build` must pass locally before push.
- **Never commit:** `.env.local`, `.next/`, `node_modules/`, `.claude/worktrees/`, `*-report.txt` (all gitignored).

---

## Development rules

- Simple and readable over clever. Don't over-engineer.
- Prefer vanilla CSS unless the user specifies a framework.
- Comments explain **why**, not **what**. Skip them if a well-named identifier already explains.
- Production builds must pass `build + type-check + tests`. If you're not running all three, you're not verifying.
- When in doubt: ask the user. Do not guess at product decisions.

---

## Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the full runbook.

Quick: `vercel --prod --yes` deploys current HEAD to production. `scripts/push-env-to-vercel.sh` syncs local env vars to Vercel production (idempotent).
