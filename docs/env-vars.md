# Environment Variables

Push uses Supabase for persistence and Vercel for hosting. Copy the template below to `.env.local` (never committed) and fill in from the Supabase dashboard.

> **Vercel deploys:** set these in **Project Settings → Environment Variables**, not in `.env.local`. Vercel does not read committed env files.

## Template

```bash
# ── Supabase (required) ──────────────────────────────────────────────
# Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxx

# Server-only. Bypasses RLS. Never expose to the browser.
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxxxxxx

# ── Site ─────────────────────────────────────────────────────────────
# Used for OG images, OAuth callbacks, canonical URLs
NEXT_PUBLIC_SITE_URL=https://push-six-flax.vercel.app

# ── Feature flags (optional) ─────────────────────────────────────────
# Set to "1" to force all API routes into mock mode (no DB calls)
NEXT_PUBLIC_USE_MOCK=0
```

## Key naming convention

| Pattern | Visibility | Usage |
|---|---|---|
| `NEXT_PUBLIC_*` | Browser + server | Publishable / public config |
| No prefix | Server only | Secrets, service-role keys, webhooks |

## Deprecated names

The codebase historically accepted two names for the service-role key. Going forward, **use `SUPABASE_SERVICE_ROLE_KEY` only** and remove `SUPABASE_SECRET_KEY` fallbacks.

## Checklist before shipping

- [ ] `.env.local` exists locally with all required keys
- [ ] Vercel → Project Settings has the same keys for **Production** and **Preview**
- [ ] No `.env*` file has been `git add`-ed (covered by `.gitignore`)
- [ ] `NEXT_PUBLIC_*` contains nothing secret
