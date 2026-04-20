# Push v5.2 Deployment Guide

**Status:** Ready for YC Demo Day (May 9, 2026)

This guide covers automated deployment of Push v5.2 from May 4-8 through production release.

---

## Quick Start: Fully Automated Pipeline

```bash
# One command to run all May 4-8 automation
npm run demo-day:prep

# Or explicit:
npm run automate:may-4-8
```

**What runs automatically:**
- ✅ May 4: Code quality audit (lint, type-check, build, test)
- ✅ May 5: Merchant dashboard integration (merge Z's work)
- ✅ May 6-8: Vercel production deployment & smoke tests

**Expected duration:** ~15-20 minutes (depends on build time and Vercel deploy)

---

## Detailed Breakdown

### May 4: Code Quality Audit

**What happens:**
```bash
npm run lint          # ESLint check
npm run type-check    # TypeScript verification
npm run build         # Full Next.js build
npm run test          # Jest unit tests
```

**Outputs:**
- `lint-report.txt` — Linting results
- `type-check-report.txt` — Type checking results  
- `build-report.txt` — Build logs
- `test-report.txt` — Test results

**Pass criteria:**
- ✅ Type check: MUST PASS (no unresolved types)
- ✅ Build: MUST PASS (no build errors)
- ❌ Lint: Warnings OK, errors must be fixed
- ⚠️ Tests: Warnings OK (can use `--passWithNoTests`)

### May 5: Merchant Dashboard Integration

**What happens:**
1. Checks for `origin/merchant-dashboard-z` branch
2. Creates `integrate/merchant-dashboard-may-5` feature branch
3. Merges Z's merchant dashboard work
4. Verifies build succeeds
5. Commits changes with message: `feat: integrate merchant dashboard polish`

**If merge conflicts occur:**
```bash
# Manual resolution required
git status  # See conflicts
# Edit files to resolve
git add .
git commit -m "resolve: merchant dashboard merge conflicts"
```

**If Z hasn't pushed yet:**
- Script logs warning and continues
- Monitor for Z's push to `merchant-dashboard-z`
- Rerun automation once push is available

### May 6-8: Vercel Production Deployment

**Prerequisites:**
```bash
# Ensure Vercel CLI is installed
npm install -g vercel

# Login to Vercel
vercel login

# Ensure .env.local has production values:
NEXT_PUBLIC_SUPABASE_URL=<production-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-key>
SUPABASE_SERVICE_ROLE_KEY=<production-key>
```

**What happens:**
1. Installs/verifies Vercel CLI
2. Creates `.vercelignore` (excludes build artifacts, docs, test reports)
3. Verifies required environment variables are set
4. Deploys to Vercel production with `vercel --prod`
5. Extracts production URL
6. Runs health check on production API endpoint
7. Saves production URL to `.production-url` file

**Outputs:**
- `vercel-deploy.txt` — Full Vercel deployment logs
- `.production-url` — Production domain name
- Console output with live logs

**Health check verifies:**
```bash
curl https://<your-domain>.vercel.app/api/health
# Expected response: { "status": "ok" }
```

---

## Manual Steps (If Automation Fails)

### Option A: Run Each Stage Separately

```bash
# Stage 1: May 4 Quality Audit
npm run lint
npm run type-check
npm run build
npm run test

# Stage 2: May 5 Integration (if needed)
git checkout -b integrate/merchant-dashboard-may-5
git fetch origin merchant-dashboard-z
git merge origin/merchant-dashboard-z
npm run build
git add -A
git commit -m "feat: integrate merchant dashboard polish"

# Stage 3: May 6-8 Deployment
vercel --prod
```

### Option B: Rerun Specific Stages

```bash
# Just redeploy to Vercel (if code is ready)
vercel --prod

# Just run quality checks
npm run lint && npm run type-check && npm run build && npm run test

# Just merge merchant dashboard
git fetch origin merchant-dashboard-z
git merge origin/merchant-dashboard-z
npm run build
```

---

## Troubleshooting

### Build Fails
```bash
# Check for TypeScript errors
npm run type-check

# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Merge Conflicts on May 5
```bash
# If merchant dashboard merge conflicts:
git status  # Identify conflicting files
# Edit files to resolve conflicts
git add <resolved-files>
git commit -m "resolve: merchant dashboard conflicts"
npm run build  # Verify no new errors
```

### Vercel Deployment Fails
```bash
# Check Vercel status
vercel status

# Verify environment variables
vercel env list

# Check production logs
vercel logs --prod

# Redeploy
vercel --prod --skip-questions
```

### Health Check Fails After Deploy
```bash
# Give Vercel 2-3 minutes to warm up serverless functions
sleep 180

# Retry health check
curl https://<your-domain>.vercel.app/api/health

# Check production logs
vercel logs --prod
```

### Automation Script Permissions
```bash
# Make script executable
chmod +x scripts/automate-may-4-8.sh

# Or run with bash explicitly
bash scripts/automate-may-4-8.sh
```

---

## Environment Variables (Production)

Create or update `.env.local` with production Supabase credentials:

```bash
# .env.local (PRODUCTION)
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get these from:**
1. Supabase dashboard → Project settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

## Post-Deployment Checklist

After deployment completes, verify:

- [ ] Production URL is live and accessible
- [ ] Health check returns `{ "status": "ok" }`
- [ ] Admin dashboard loads and refreshes KPIs
- [ ] Creator dashboard loads and shows earnings
- [ ] Customer loyalty card renders punch interface
- [ ] Merchant dashboard shows campaigns
- [ ] API endpoints respond with < 500ms latency
- [ ] No console errors in browser DevTools
- [ ] Images/fonts load correctly
- [ ] Design colors are correct (Pearl Stone, brand colors)
- [ ] Mobile responsive works (test on phone/tablet)
- [ ] Lighthouse score > 90 (PageSpeed Insights)
- [ ] Form submissions work
- [ ] Navigation between dashboards works

---

## YC Demo Day Preparation (May 9)

### Pre-Demo Checks
```bash
# 1 hour before demo:
curl https://<your-domain>.vercel.app/api/health
# Should respond: { "status": "ok" }

# Check Vercel analytics
vercel analytics --prod

# Verify demo data is seeded
npm run seed

# Clear browser cache and test incognito window
open -a "Google Chrome" --args --incognito https://<your-domain>.vercel.app
```

### Demo Flow
1. Open main navigation: https://<your-domain>.vercel.app
2. Show 4 dashboards (Admin, Creator, Customer, Merchant)
3. Show real-time KPI updates (refresh every 30s)
4. Demonstrate AI verification flow
5. Show creator leaderboard and tier system
6. Demonstrate loyalty card punch mechanics
7. Show merchant campaign management
8. Explain unit economics: LTV $6,579 / CAC $420 / LTV:CAC 15.7x

---

## Rollback Plan (If Needed)

If production deployment has critical issues:

```bash
# Option 1: Revert to previous Vercel deployment
vercel rollback

# Option 2: Redeploy last working commit
git checkout <last-known-good-commit>
npm run build
vercel --prod

# Option 3: Manual git revert
git revert HEAD
npm run build
vercel --prod
```

---

## Monitoring Post-Deploy

```bash
# Watch production logs in real-time
vercel logs --prod --follow

# Check error rates
vercel analytics --prod

# Monitor response times
vercel analytics --prod --metric=responseTime
```

---

## Questions?

- **Build issues:** Check `build-report.txt`
- **Type errors:** Run `npm run type-check`
- **Linting:** Run `npm run lint`
- **Vercel issues:** Check `vercel-deploy.txt` or `vercel logs --prod`
- **Supabase issues:** Check Supabase dashboard → Logs

---

**Last Updated:** May 2026 | v5.2 RC  
**Next:** YC Demo Day Presentation (May 9, 2026) 🚀
