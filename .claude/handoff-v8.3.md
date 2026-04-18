# Push v8.3 Session Handoff

**Date:** 2026-04-17
**Previous session achievement:** 3 waves of parallel-agent page generation produced ~56 new routes; `style/v8.2-premium-editorial` is 101 commits ahead of `main`.

---

## TL;DR for the next session

1. **Production is behind.** `main` holds the Wave-2 snapshot (PR #12 merged). Wave-3's 20 new features are only on `style/v8.2-premium-editorial` and in the preview deployment. Decide whether to open PR #13 now or keep iterating.
2. **No real backend is wired.** Every mock data file and API route under `lib/data/*`, `lib/admin/*`, `lib/*/mock-*.ts`, and `app/api/*/route.ts` is localStorage- or in-memory-backed, with `// TODO: wire to Supabase` comments. Supabase keys exist but no queries use them yet.
3. **Design system holds.** Every new page follows `Design.md`: `border-radius: 0`, 6 brand colors, Darky + CS Genio Mono, 8 px grid, Light mode only. Don't loosen this without updating `Design.md` first.

---

## Current state

### Branch
- **Working branch:** `style/v8.2-premium-editorial`
- **Main:** lags by 101 commits (last sync: PR #12 = Wave 2)
- **Last commit on branch:** `8dabdcd` — "fix: Unsplash/DiceBear image hosts + Next 16 async searchParams in /help"
- **Preview URL (latest):** https://push-git-style-v82-premium-editorial-jiamingws-projects.vercel.app/
- **Production URL:** https://push-git-main-jiamingws-projects.vercel.app/ (Wave 2 only)

### Build / typecheck
- `npx tsc --noEmit` — clean
- `npm run build` — green (Turbopack bundler, Next.js 16.2.3)
- `npm run dev` — runs on port 3000. Turbopack has intermittent persistent-cache races; clearing `.next/` on start resolves them
- `npm run start` (prod) — stable, recommended for smoke tests when dev flaps

### Tooling env notes
- Node v22.19.0. If `semver.satisfies is not a function` reappears, `rm -rf node_modules && npm install`
- `.claude/launch.json` has `autoPort: true` so preview_start won't collide with manual `npm run dev`
- Vercel team `team_liX7Ifi30IJ4Ty8PqTmuwYt3`, project `prj_Ejox9v7MkOwztAMVmA0i1srp1z3g`
- `gh` CLI is **not authenticated** — open PRs via browser or run `gh auth login`

---

## What shipped in the last 3 waves (56 routes)

### Wave 1 — A-group product core (8)
Creator: `/creator/explore`, `/creator/campaigns/[id]/post`, `/creator/messages`, `/creator/wallet`, `/creator/verify`, `/creator/disputes[/id]`
Merchant: `/merchant/messages`, `/merchant/applicants`, `/merchant/qr-codes`, `/merchant/disputes[/id]`

### Wave 2 — B+C+D groups (22)
Marketing: `/pricing`, `/how-it-works`, `/for-creators`, `/case-studies[/slug]`, `/about`, `/faq`, `/blog[/slug]`, `/changelog`, `/help[/slug]`, `/careers[/slug]`, `/api-docs`, `/press`, `/contact`, `/status`, `/legal/{privacy,terms,cookies,acceptable-use}`
Admin: `/admin` (overview), `/admin/fraud`, `/admin/verifications`, `/admin/disputes[/id]`, `/admin/cohorts[/id]`
Merchant: `/merchant/billing`
Cross: `/creator/settings`, `/merchant/settings`, global Cmd-K search overlay (`CommandK` component + provider in `app/layout.tsx`)

### Wave 3 — deep product + SEO (26)
Creator: `/creator/leaderboard`, `/creator/portfolio`, `/creator/calendar`, `/creator/onboarding` (upgraded)
Merchant: `/merchant/locations[/id]`, `/merchant/integrations[/slug]`, `/merchant/onboarding`
Admin: `/admin/users[/id]`, `/admin/campaigns[/id]`, `/admin/finance`, `/admin/audit-log` (partial — CSS only, no page.tsx; see "Technical debt")
Public: `/m/[slug]`, `/c/[handle]`, `/invite/[code]`
Marketing: `/security`, `/trust`, `/referrals`, `/neighborhoods[/slug]` (30 NYC hoods)
Developer: `/api-docs` (Wave 2), `/developer` portal folder was attempted but not merged — API routes removed, UI dropped. See "Technical debt"
SEO infra: `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml`, `app/changelog/feed.xml`, `app/rss/merchants`, root metadata upgrade
OG generator: `app/opengraph-image.tsx` upgraded + per-slug OG for blog/case-studies/neighborhoods/creator-profile (via `lib/og/template.tsx`)

---

## Architecture snapshot

### Route groups
```
app/
├── (marketing)/        — public marketing, full header/footer
├── (public)/           — public profiles (/m, /c, /invite), own layout
├── (creator)/          — demo/auth-gated creator portal
├── (merchant)/         — demo/auth-gated merchant portal
├── (admin)/            — demo/auth-gated admin portal (Deep Space Blue sidebar)
├── scan/[qrId]/        — QR attribution landing + verify
├── demo/               — demo role switcher (/demo, /demo/creator, /demo/merchant, /demo/admin)
└── api/                — mock endpoints organized by role
```

### Demo mode mechanics
- Cookie `push-demo-role=creator|merchant|admin` set by `/demo/<role>` pages
- `checkDemoMode()` helper in each dashboard; `DemoBanner` component mounted in (creator)/(merchant)/(admin) layouts
- `middleware.ts` redirects unauthenticated + non-demo users from protected routes to `/demo`

### Mock data layer
- `lib/data/{types,mock-store,api-client}.ts` — central abstraction with `api.creator.*`, `api.merchant.*`, `api.attribution.*` namespaces
- Toggle: `NEXT_PUBLIC_USE_MOCK=1` (default) reads localStorage, otherwise hits real `/api/*` routes
- Every real API route has a `// TODO: wire to Supabase` comment at the mock boundary

### Design tokens
- `app/globals.css` — 6 brand colors, Darky + CS Genio Mono font-face declarations, 8 px spacing scale
- All 1200 px legacy container overrides narrowed to 1080 px
- `prefers-reduced-motion` supported on every agent-generated page
- All image hosts whitelisted in `next.config.ts`: images.unsplash.com, plus.unsplash.com, api.qrserver.com, api.dicebear.com, avatars.githubusercontent.com

### Shared component libraries
- `components/ui/` — BigNumber, Button, StatCard, TierBadge, GhostText, SectionDivider, EmptyState (Wave 1)
- `components/messaging/` — MessageBubble, Composer, ConversationView, ThreadList, NewThreadModal
- `components/disputes/` — DisputeList, DisputeDetail, DisputeTimeline (legacy), AdminDisputeTimeline + AdminDecisionPanel (admin)
- `components/settings/` — SettingsShell, SettingsSection, ToggleRow, SelectRow, InputRow
- `components/onboarding/` — OnboardingShell, ChecklistItem, ProgressDots
- `components/search/` — CommandK, CommandKProvider (mounted at `app/layout.tsx`)
- `components/neighborhoods/` — NeighborhoodsMap, NeighborhoodDetailMap + `*Loader.tsx` wrappers (Next 16 `ssr:false` must live in client wrappers)
- `components/creator/CampaignDetailPanel.tsx` + `components/creator/verify/Step{Identity,Social,Address}.tsx` + `ReviewSummary.tsx`
- `components/merchant/campaign-wizard/{CategoryPicker,TierSelector}.tsx`, `components/merchant/qr/PosterPreview.tsx`

### Two disputes data schemas live in parallel (intentional)
- `lib/disputes/mock-disputes.ts` — camelCase, used by `/creator/disputes*` and `/merchant/disputes*`
- `lib/disputes/mock-admin-disputes.ts` — snake_case with admin-specific fields (severity, internal notes, outcome split), used by `/admin/disputes*` and `components/disputes/AdminDecisionPanel.tsx`
- `DisputeTimeline.tsx` (legacy) vs `AdminDisputeTimeline.tsx` (admin). If you unify these later, you'll need a schema adapter — the two views have genuinely different shape needs.

---

## Technical debt (must fix before production push)

1. **`/admin/audit-log`** — `audit-log.css` shipped without a `page.tsx`. The agent got truncated mid-write. The `app/api/admin/audit-log/route.ts` + `lib/admin/mock-audit.ts` exist. Write the page or remove the stray CSS and API.

2. **`/developer` portal** — Wave-3 agent created `app/api/developer/*` routes and `lib/developer/*` helpers but never wrote the UI (`app/(developer)/` never created, `app/(marketing)/developer/` never created). I removed the orphan API + lib files; if you want the portal, start fresh.

3. **`/creator/referrals` page** — agent wrote `referrals.css` only, no page. Removed. `/creator/referrals` in dashboard-nav is dead. Either scaffold a page or remove the nav link. Public marketing page `/referrals` exists and works.

4. **`app/opengraph-image.tsx` + per-slug OG images** — OG generator loads fonts from `public/fonts/`. If you have not committed the TTF files under `public/fonts/{Darky-900,CSGenioMono}.ttf`, the OG routes will error at request time. Verify: `ls public/fonts/`.

5. **Dispute schema duplication** — see above. Eventually either pick one schema and migrate, or build an adapter layer at the API boundary so admin and legacy views share storage.

6. **Middleware cookies** — demo cookie expires on session close. Set `Max-Age` if you want "I'm a creator" persistence across days.

7. **100 `// TODO: wire to Supabase` comments across the API layer.** Every real endpoint is a no-op that returns mock data. See "Real backend integration" below.

8. **Turbopack persistent cache races** — intermittent 500s in dev mode when `.next/` gets stale. `rm -rf .next` on dev start resolves it. Production build is stable.

9. **`.claude/worktrees/`** holds ~65 worktree directories from 3 waves of parallel agents. They're ignored by `.gitignore` but consume disk. Clean with `git worktree prune` + `rm -rf .claude/worktrees/*` when you don't need them.

---

## Decisions waiting on human input

- **PR #13 timing.** Merge `style/v8.2-premium-editorial` → `main` now, or keep iterating until Wave 4?
- **Real Supabase schema.** I haven't designed it — the mock types under `lib/data/types.ts` are a starting point but will need FK relationships and indexes.
- **Stripe Connect vs Custom.** `/creator/wallet` and `/admin/finance` both speak Stripe in comments but there's no Stripe account wired.
- **Real NYC merchants.** Mock data uses real neighborhood names + made-up business names. Decide when to replace with actual design-partner brands.
- **KYC vendor.** Stripe Identity vs Persona vs build-your-own. `/creator/verify` is wizard-complete but the admin `/admin/verifications` review queue assumes a 3-field schema; whatever vendor you pick will supply a different shape.
- **Dispute arbitration SLA.** Currently the admin queue shows "24h SLA" copy but no automation backs it. Needs a cron or Realtime trigger.

---

## Recommended priority for next session

### P0 — Ship what exists (1-2 hours)
1. Fix `/admin/audit-log` technical-debt item #1 (scaffold page or remove stray files)
2. Verify `public/fonts/` has Darky + CS Genio Mono TTFs; if not, commit them
3. Run `npm run build` clean; `npm run start`; smoke test all 56 routes (I have a curl loop in session history — ask or rebuild)
4. Open PR #13: `style/v8.2-premium-editorial` → `main`
5. Wait for Vercel production deploy, verify critical paths on prod URL

### P1 — Feature completion (1 week)
1. **Real Supabase schema + migrations.** Start with: `users`, `creators`, `merchants`, `campaigns`, `applications`, `qr_codes`, `scans`, `verifications`, `payments`, `disputes`, `notifications`. Generate typed client, replace mock API routes one at a time. See `lib/data/types.ts` for shape inspiration.
2. **Stripe Connect wire-up.** Creator payout onboarding + merchant subscription billing. Two separate Stripe flows.
3. **KYC vendor integration** (pick Stripe Identity for speed, Persona for better UX). Replace `/creator/verify` mock with real SDK.
4. **Real QR code generation** — currently using `api.qrserver.com` which is fine for demo but needs to be signed payloads server-side. See `lib/attribution/track.ts`.
5. **Email/SMS delivery** — `/api/contact`, `/api/notifications`, dispute notifications all log to console. Wire to Resend or Postmark.
6. **Mobile QA pass** — most pages have breakpoints but they weren't visually verified on device. Send through BrowserStack or physical device.
7. **SEO verification** — submit sitemap to Google Search Console, verify structured data on `/m/[slug]` LocalBusiness JSON-LD, check OG image rendering on Twitter Card Validator.

### P2 — Polish (ongoing)
1. **Onboarding completion rates.** Instrument each step; A/B test copy on the identity step (highest drop-off predicted).
2. **Fraud rules engine.** `/admin/fraud` currently shows 10 hard-coded rules. Move to a config table + live updates.
3. **Cohort analysis real data.** `/admin/cohorts` uses mock retention curves. Hook to real event stream (PostHog recommended).
4. **Blog CMS.** Current blog posts are hard-coded in `lib/blog/mock-posts.ts`. Move to MDX files or Sanity/Contentful if non-technical team needs to author.
5. **A11y audit.** Every agent followed `prefers-reduced-motion` but keyboard nav + screen reader testing not done.
6. **Performance.** Current pages are fine but `/neighborhoods` + `/admin/users` + `/admin/campaigns` load 100+ items. Add pagination or virtualization.

### P3 — Growth (post-launch)
1. **Referral attribution.** `/invite/[code]` sets a cookie; wire it through to signup → payout credit.
2. **Merchant self-serve campaign approval** — currently admin approves every campaign. Once fraud engine is trusted, auto-approve low-risk categories.
3. **Creator content moderation.** `/creator/campaigns/[id]/post` auto-approves; long term needs human-in-loop + ML pre-screen.
4. **Internationalization scaffolding.** Copy is English-only; `/demo` page has `EN / 中文` placeholder but i18n is not set up.
5. **More cities.** Architecture is NYC-tight (neighborhoods are hardcoded). Abstract geo layer before expanding.

---

## Critical file map

| Purpose | Path |
|---------|------|
| Design system source of truth | `Design.md` |
| Per-domain skills | `.claude/skills/push-{strategy,creator,merchant,pricing,attribution,campaign,gtm,metrics,website,brand-voice,ui-template}/` |
| Mock data layer | `lib/data/{types,mock-store,api-client}.ts` |
| Original landing | `app/(marketing)/page.tsx` + `landing.css` + `components/layout/LandingInteractivity.tsx` |
| Root layout (contains CommandKProvider + SmoothScroll) | `app/layout.tsx` |
| Middleware auth gate | `middleware.ts` |
| SEO infrastructure | `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts`, `app/changelog/feed.xml/route.ts`, `app/rss/merchants/route.ts` |
| OG image template | `lib/og/template.tsx` + per-route `opengraph-image.tsx` files |
| Dispute dual schema | `lib/disputes/mock-disputes.ts` (legacy) vs `lib/disputes/mock-admin-disputes.ts` (admin) |
| Component libraries | `components/{ui,messaging,disputes,settings,onboarding,search,neighborhoods,creator,merchant}/` |
| Previous handoff | `.claude/handoff-v8.2.md` |

---

## Commands you'll need

```bash
# Dev server (Turbopack; clear cache if routes 500)
pkill -9 -f "next dev\|next-server" 2>/dev/null
rm -rf .next
npm run dev

# Production build + serve (stable path for QA)
npm run build
npm run start

# Typecheck
npx tsc --noEmit

# Vercel deployments
# Via Vercel MCP: list_deployments for project prj_Ejox9v7MkOwztAMVmA0i1srp1z3g team team_liX7Ifi30IJ4Ty8PqTmuwYt3
# Or: gh pr create --base main --head style/v8.2-premium-editorial (after gh auth login)

# Demo roles for local testing
# Visit /demo, or set cookies directly:
# document.cookie = "push-demo-role=creator"  → visit /creator/dashboard
# document.cookie = "push-demo-role=merchant" → visit /merchant/dashboard
# document.cookie = "push-demo-role=admin"    → visit /admin

# Smoke-test all routes (paste into shell)
for p in / /pricing /how-it-works /for-creators /for-merchants /case-studies /about /faq /blog /changelog /help /careers /api-docs /press /contact /status /security /trust /referrals /neighborhoods /legal/privacy /legal/terms /creator/dashboard /creator/explore /creator/earnings /creator/wallet /creator/verify /creator/messages /creator/disputes /creator/analytics /creator/notifications /creator/settings /creator/leaderboard /creator/portfolio /creator/calendar /creator/onboarding /merchant/dashboard /merchant/applicants /merchant/qr-codes /merchant/messages /merchant/disputes /merchant/payments /merchant/billing /merchant/analytics /merchant/notifications /merchant/settings /merchant/campaigns/new /merchant/locations /merchant/integrations /merchant/onboarding /admin /admin/fraud /admin/verifications /admin/disputes /admin/cohorts /admin/users /admin/campaigns /admin/finance /m/blank-street-coffee-soho /c/maya-eats-nyc /invite/MAYA25 /scan/qr-bsc-001 /feed.xml /changelog/feed.xml /sitemap.xml /robots.txt; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 "http://localhost:3000$p")
  echo "$code  $p"
done
```

---

## First concrete action for the next session

1. `git status` — confirm clean
2. `git log main..HEAD --oneline | wc -l` — should read `101` (or more if work continued)
3. `npx tsc --noEmit` — should return nothing (clean)
4. Read this file (`.claude/handoff-v8.3.md`) top-to-bottom
5. Pick one from P0
6. Ask the user what's in their head before spawning agents again. The last session produced 60 pages of mocks; the user may prefer slow real-backend work over more surface.

---

## Gotchas the last session discovered the hard way

- **Worktree base drift.** When `Agent` tool creates an `isolation: worktree`, the base is sometimes not the current HEAD but an older merge-base. Three Wave-2 agents landed commits on unexpected branches; cherry-pick recovered them. If a worktree "Already up to date" but files are missing, check `git log --all --oneline --source | grep <feat name>`.
- **Writing files in worktree did NOT always commit them.** Agents sometimes stopped mid-`git commit`. Always verify `git log -1` in the worktree before assuming success.
- **Batch `git merge --theirs` is dangerous across schema changes.** The dispute data schema was replaced this way, and breaking every creator/merchant dispute page. Prefer per-file conflict resolution when the conflict touches a type definition.
- **Next.js 16 breaking changes hit us twice:** `params: Promise<>` in dynamic route handlers, and `ssr: false` dynamic imports must live in client components. Both are now fixed repo-wide; any new code must follow the same pattern.
- **Turbopack write races.** If dev server is running AND you run `rm -rf .next`, Turbopack will 500 until restart. Stop first, clear, start.
- **gh CLI not authenticated.** Either `gh auth login` or open PRs in browser. Don't burn time retrying gh commands.

---

## User preferences (carry forward)

- Reply in Chinese; code comments in English; git commits in English
- Concise output, no narration of process
- Small precise edits over large rewrites
- User is a UX design expert — expects premium, editorial, 2026 aesthetic
- Hates: AI slop, glassmorphism, aurora gradients, corporate template feel, too-centered layouts
- Loves: negative space, left-alignment, logical typography weight, bold 900s, readable ghost text, Apple-grade interactions

---

*End of handoff. Good luck.*
