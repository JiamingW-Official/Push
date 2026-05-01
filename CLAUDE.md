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

## Design system (MANDATORY · v11 2026-04-25 late evening — Liquid-Glass Expansion + Image-First + 3-Tier Rule Classification)

Before touching any UI code, read [Design.md](./Design.md). **First read § 0 — Three-Tier Rule Classification.** Every rule in Design.md carries one of three tags: **🔒 STRICT** (identity — cross-page invariant, cannot deviate), **📐 STRUCTURED** (composition — pick one variant from the allowed set), **🎨 OPEN** (voice — editorial judgment within bounds). Implement top-down: obey STRICT, pick STRUCTURED variants, improvise within OPEN bounds.

v11 layers a Grain-Archive editorial register on top of the v10 N2W foundation; evening passes tightened grid / negative-space / button / color discipline; this late-evening pass added 3-Tier Classification, expanded Liquid Glass to 6 use cases, added Image-First Layout Patterns (4 modes). Every v10 N2W token preserved. **Marketing vs Product registers must NOT mix in the same viewport.** Every dimension snaps to 8px grid; every button uses one of the 5 unified variants in § 9; every color comes from the closed Allowed-Color List in § 2. Non-negotiables:

- **Closed Allowed-Color List** — production CSS may only use color tokens listed in Design.md § 2. Photos and SVG visual effects exempt. New colors require a documented PR update.
- **11-stop warm-gray ladder (v11 adds 3 new neutrals):** snow `#fff` → surface `#f8f4e8` → surface-2 `#f5f3ee` → surface-3 `#ece9e0` → **`--mist #d8d4c8`** (NEW) → ink-6 → ink-5 → ink-4 → ink-3 `#61605c` (body locked) → **`--char #3a3835`** (NEW — softer warm dark panel alternative) → **`--graphite #2c2a26`** (NEW — mid-strong heading color) → ink-2 → ink → obsidian `#000`. All UI text / dividers / dark surfaces sample only from this ladder.
- **3 brand colors, role-locked:** Brand Red `#c1121f` primary CTA / N2W Blue `#0085ff` secondary CTA / Champagne `#bfa170` ceremonial (≤3 instances per viewport).
- **3 editorial moments (≤1 per viewport):** Editorial Blue `#1e5fad` (footer-only) / Editorial Pink `#e8447d` (single CTA stamp) / GA Orange `#ff5e2b` (Ticket Panel + nav Home pill).
- **GA Tri-Color (nav-only):** Orange / `--ga-green #4ade80` / `--ga-sky #93c5fd`. Forbidden in section content / button / card.
- **iOS 26 continuous corner + selective `border-radius: 0`:** standard card 10px, button 8px, input 8px, Candy Panel 28px, Ticket Panel 10px, footer 40px rounded-top. **`border-radius: 0` permitted in 3 places only:** full-bleed Photo Card Hero, Editorial Hero Tile billboard, image-collage card. All other surfaces use the radii scale.
- **Strict 8px grid.** Every width / height / padding / margin / gap / top / left / right snaps to 8px. Half-grid (4px) only for hairlines and chip gaps. No `padding: 22px` / no eyeball spacing.
- **Column grid:** desktop 12 cols / 24px gutter / 64px outer margin / 1140px container max; iPad 8 cols / 20px / 48px; mobile 4 cols / 16px / 24px. Cell-span vocabulary in § 5.5 — no custom 7+5 splits.
- **Negative-space tokens locked per container** (§ 6 full table). Use values directly; never eyeball:
  - Hero title → subtitle 32px / subtitle → CTA 48px (desktop)
  - Eyebrow → H1/H2 16px / H1 → body 24px / body → CTA 32px
  - Card title → body 12px / body → footer 16px / card grid gap 24px
  - Icon (40px tile) → text 16px / inline icon (24px) → text 12px / eyebrow icon (12px) → text 8px
  - Adjacent buttons in row 16px desktop / 12px mobile
- **Corner-anchored titles (NEW v11):** Hero title hugs panel **bottom-left** (NOT centered); section titles hug **top-left**; footer Giant Wordmark hugs **bottom-left**. Centered titles only allowed inside Ticket Panel + Photo Card overlay + Modal.
- **v11 type scale — pushed larger this pass:** Magvix Hero `clamp(64,9vw,160)px` (was 96 max), Darky Display `clamp(56,8vw,128)px`, **Footer Giant Wordmark `clamp(140,18vw,320)px`** (was 240), H1 `clamp(40,5vw,72)px`, H2 `40px` (was 36), KPI numeral `clamp(40,5vw,72)px`. Body 18px / Caption 12px / Eyebrow 12px unchanged. Vertical rhythm = 8px-grid line-heights.
- **Three fonts, role-locked:** Magvix (Regular + Italic) hero / wordmark / Signature Divider (≤1 hero block per page). Darky display / heading / numerals / **Giant Footer Wordmark**. CS Genio Mono body / UI / labels / parenthetical eyebrow. Magvix never below 28px.
- **Unified button system — 5 variants, mandatory:**
  - **Filled Primary** — Brand Red fill + Snow text + 8px radius + 14×28 padding + mono 16px 600 uppercase 0.04em (mobile 12×24 + 14px)
  - **Filled Secondary** — N2W Blue fill + Snow text (other props identical to Primary)
  - **Filled Ink** — Ink fill + Snow text (Ticket Panel + dark surface only)
  - **Ghost** — transparent + 1px ink border + Ink text
  - **Pill** — surface-3 + Ink text + pill radius + 8×18 padding (filter chip / status / GA nav)
  - All buttons get bottom-right hover shift `translate(2px,2px)` → `translate(3px,3px) scale(0.98)`. **Sole exception: GA Tri-Color nav pill** (color-state only).
  - Editorial Pink is an optional 6th variant, ≤1 per page.
  - **Per-page custom buttons forbidden.** Every button on every page renders identically.
- **Page bg `#ffffff` Snow (v11.1 — was Ivory Cream) / body `#61605c` warm gray / Light Mode only.** All product UI page + card surfaces are pure white; cards defined by `--shadow-1/2/3` alone (no border). Cream tokens (`--surface` / `--surface-2` / `--surface-3`) reserved for Marketing register only.
- **Bottom-right hover shift** is the Push interaction signature on every clickable element. **Does NOT shift:** GA Tri-Color nav pills, Ticket Panel grommets + perforation, Footer Giant Wordmark, Magvix Italic Signature Divider, static badges, body text.
- **Modular Panel Discipline:** Marketing pages = 3-5 stacked panels, alternating warm/cool tone, ≤1 floating liquid-glass tile + ≤1 image card + ≤1 saturated editorial moment per panel.
- **Footer:** Editorial Blue rounded-top panel + 2 floating liquid-glass tiles peeking above + 3-column parenthetical eyebrow grid + **Darky 800 giant `clamp(140,18vw,320)px` "PUSH" bottom-left** (replaces v10 Magvix Italic wordmark).
- **GA Tri-Color Nav (global chrome every page):** sticky top, 32×32 Ink monogram (left) + 3 pills center (Home Orange / Active Green / Last Sky), CS Genio Mono 14px 600 uppercase 0.04em, no hover shift on pills.
- **Ticket Panel:** GA Orange fill + 10px radius + 4 ink-solid grommet circles (16px, 24px inset) + dashed 2px perforation lines top + bottom + Magvix Italic `clamp(40,5vw,56)px` centered headline + Filled Ink CTA + flat no-shadow + ≤1 per page + Marketing-only.
- **Mono Eyebrow with Parenthetical:** Marketing surfaces use `(LINKS)` `(CONNECT)` `(WHY THIS EXISTS)`; Product UI uses canonical `LINKS`. Two registers do not mix in the same viewport.
- **Magvix Italic Signature Divider:** between sections — `End of campaign · Fin ·` / `Posted · Scanned · Verified ·` style, 28-40px italic `--ink-3` + middle-dot separators, ≤2 per page, no hover.
- **Editorial Table (Cinema-Selects style):** mono 12px 700 uppercase parenthetical headers + Darky 18-20px 700 first column + mono 16px other columns + last column right-aligned + dotted hairline rows + table title top-left. Marketing-only; Dashboard tables keep v10 card-grid.
- **Photo Card with Bottom Gradient Overlay:** 4:5 or 1:1 image + 35% transparent→`rgba(0,0,0,0.78)` gradient + Darky 20px snow title + mono 12px snow metadata. Marketing-only; hover bodily shifts (no image zoom).
- **Min font size = 12px.** Documented exceptions: Footer Wordmark ≤320px, Hero Magvix ≤160px, KPI numeral ≤72px.
- **Mobile + iPad responsive — naturally adaptive, not redrawn:** same composition + same hierarchy across breakpoints, only spacing scale + column count adjust (mobile 4-col / iPad 8-col / desktop 12-col; section V padding 56→80→96px). Touch targets ≥44×44.
- **Icon system:** one icon family per page, every icon in 40×40 `--r-lg` (12px) tile with surface or ink background, internal icon 20-24px. Naked SVG on Candy Panel or Ticket Panel forbidden.
- **Motion:** GSAP ScrollTrigger + Lenis, iOS 26 spring `cubic-bezier(0.34, 1.56, 0.64, 1)`. Ticket Panel + Magvix Italic Divider + Giant Wordmark + GA nav do NOT animate.
- **Elevation:** iOS 26 three-layer soft shadow (`--shadow-1 / 2 / 3`) + glass morphism on sticky nav / modal / floating liquid-glass tile. **Flat (no shadow):** Ticket Panel, GA nav pills, Giant Wordmark, Editorial Hero Tile billboard.

**Marketing vs Product registers must NOT mix in the same viewport.** Override third-party component radii to match this scale (not to 0). Deviations from Design.md require user sign-off and a doc update in the same PR.

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
