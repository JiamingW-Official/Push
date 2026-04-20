# Claude Code: Push v5.2 Automation (May 4-8)

**Project:** Push — Vertical AI for Local Commerce  
**Task:** Automate May 4-8 pipeline to prepare for YC Demo Day (May 9)  
**Duration:** ~15-20 minutes  
**Difficulty:** Medium (mostly shell scripting + git operations)

---

## Context

Push is a Next.js 14 application with Supabase PostgreSQL backend. We've completed:
- ✅ Week 1: Database & API backend
- ✅ Week 2: AI verification & reporting  
- ✅ Week 3: Dashboards & UI (just completed)

**Now:** Automate the final pre-Demo Day steps:
- **May 4:** Code quality audit (lint, type-check, build, test)
- **May 5:** Merge Z's merchant dashboard improvements
- **May 6-8:** Deploy to Vercel production

The automation script (`scripts/automate-may-4-8.sh`) is already written. Your job is to execute it and handle any issues.

---

## Prerequisites

Before starting, verify these are in place:

### 1. Project Directory
```bash
cd /Users/jiamingw/Documents/GitHub/Push
pwd  # Should show: /Users/jiamingw/Documents/GitHub/Push
```

### 2. Node.js & npm
```bash
node --version   # Should be v18+
npm --version    # Should be v9+
```

### 3. Environment Variables
```bash
# File: /Users/jiamingw/Documents/GitHub/Push/.env.local
# Should contain:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...

cat .env.local | head -3  # Verify it exists
```

### 4. Vercel CLI
```bash
# Install if needed
npm install -g vercel

# Login (will open browser)
vercel login

# Verify:
vercel --version
vercel status  # Should show project info
```

### 5. Git Setup
```bash
# Verify git is available
git --version

# Check current branch (should be main or similar)
git branch

# Verify remotes
git remote -v  # Should show 'origin' pointing to GitHub
```

---

## Main Task: Run Automation

### Step 1: Make Script Executable
```bash
chmod +x scripts/automate-may-4-8.sh
```

### Step 2: Run Full Automation
```bash
bash scripts/automate-may-4-8.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Run May 4 quality audit
3. ✅ Run May 5 merchant dashboard integration
4. ✅ Run May 6-8 Vercel deployment
5. ✅ Generate automation-summary.txt

**Expected output:** Colorized progress with ✓/✗ indicators for each stage

---

## Stage Details & Troubleshooting

### Stage 1: May 4 Quality Audit

**What runs:**
```bash
npm run lint              # ESLint
npm run type-check        # TypeScript verification
npm run build             # Next.js build
npm run test              # Jest tests
```

**Success = all commands complete** (lint warnings OK, build must pass)

**If this fails:**

**Error: "Command not found: npm"**
```bash
# npm not installed or not in PATH
node --version  # Check Node is installed
npm install -g npm  # Update npm
```

**Error: "lint" script not found**
```bash
# Check package.json has the scripts
cat package.json | grep -A 10 '"scripts"'
```

**Error: "Module not found" during build**
```bash
# Dependencies missing
rm -rf node_modules
npm install
npm run build
```

**Error: TypeScript errors in type-check**
```bash
# Review type-check-report.txt
cat type-check-report.txt

# Fix any type issues, then retry:
npm run type-check
```

---

### Stage 2: May 5 Merchant Dashboard Integration

**What happens:**
```bash
# Fetches Z's merchant dashboard branch
git fetch origin merchant-dashboard-z

# Creates integration branch
git checkout -b integrate/merchant-dashboard-may-5

# Merges Z's work
git merge origin/merchant-dashboard-z --no-edit

# Verifies build still works
npm run build

# Commits
git commit -m "feat: integrate merchant dashboard polish"
```

**Success = merge complete, build passes**

**If this fails:**

**Error: "fatal: reference not a tree: origin/merchant-dashboard-z"**
```bash
# Z hasn't pushed the branch yet
git branch -a | grep merchant-dashboard  # Check what branches exist

# Wait for Z to push, then retry
git fetch origin
bash scripts/automate-may-4-8.sh  # Rerun full automation
```

**Error: Merge conflict**
```bash
# Merge conflicts detected - need manual resolution
git status  # See which files conflict

# Edit conflicting files to resolve them, then:
git add <resolved-files>
git commit -m "resolve: merchant dashboard merge conflicts"

# Verify build works
npm run build

# Then continue with deployment manually:
vercel --prod --skip-questions
```

**Error: Build fails after merge**
```bash
# Something in Z's code breaks the build
cat build-report.txt  # See the error

# Options:
# A) Abort merge and wait for Z to fix
git merge --abort

# B) Fix the issue yourself
# Edit the problematic files
npm run build  # Test again

# C) Or checkout a specific file from main
git checkout main -- <problem-file>
npm run build
```

---

### Stage 3: May 6-8 Vercel Deployment

**What happens:**
```bash
# Verifies/installs Vercel CLI
which vercel || npm install -g vercel

# Creates .vercelignore
cat > .vercelignore << 'EOF'
node_modules
.git
.env.local
*.md
.next/cache
coverage
EOF

# Checks environment variables
echo "Checking NEXT_PUBLIC_SUPABASE_URL..."

# Deploys to production
vercel --prod --skip-questions

# Tests production API
curl https://<your-domain>.vercel.app/api/health

# Saves production URL to .production-url
```

**Success = deployment completes, health check returns `{ "status": "ok" }`**

**If this fails:**

**Error: "Error: Not authenticated. Run `vercel login`"**
```bash
# Vercel CLI not authenticated
vercel login  # Will open browser, log in to Vercel
# Then retry:
bash scripts/automate-may-4-8.sh
```

**Error: "Error: No project found"**
```bash
# Vercel doesn't recognize this directory as a project
vercel link  # Link to existing Vercel project
# Or create new:
vercel  # Will prompt to create new project
```

**Error: "Error: Missing environment variable"**
```bash
# Check .env.local exists and has values
cat .env.local

# Verify in Vercel dashboard:
vercel env list

# If missing, add via CLI:
vercel env add NEXT_PUBLIC_SUPABASE_URL <value>
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY <value>
vercel env add SUPABASE_SERVICE_ROLE_KEY <value>

# Then retry deployment
vercel --prod --skip-questions
```

**Error: "Error: Build failed"**
```bash
# Check vercel-deploy.txt for details
cat vercel-deploy.txt | tail -50

# Common causes:
# 1. Next.js build error (check npm run build locally)
# 2. Missing dependency
# 3. API key issues

# Verify local build works first
npm run build

# If local build works, might be environment variable issue
vercel env list  # Check production env vars

# Retry deployment with verbose output
vercel --prod --debug
```

**Error: Health check fails after deploy**
```bash
# Give serverless functions time to warm up
sleep 180

# Retry health check
PROD_URL=$(cat .production-url 2>/dev/null || echo "https://your-domain.vercel.app")
curl -f "$PROD_URL/api/health" && echo "✓ Health check passed"

# Check logs
vercel logs --prod

# If still failing, check if routes exist
curl -v "$PROD_URL/api/health"  # See full response
```

---

## Final Checks

After automation completes successfully:

### 1. Verify All Outputs
```bash
# Should exist:
ls -la lint-report.txt type-check-report.txt build-report.txt test-report.txt
ls -la vercel-deploy.txt automation-summary.txt
ls -la .production-url
```

### 2. Check Production URL
```bash
# Get production URL
PROD_URL=$(cat .production-url)
echo "Production URL: $PROD_URL"

# Test health endpoint
curl "$PROD_URL/api/health"
# Expected: { "status": "ok", "timestamp": "..." }
```

### 3. Test in Browser
```bash
# Open in browser and verify:
open "$PROD_URL"  # Main navigation loads
open "$PROD_URL/admin/dashboard"  # Admin dashboard
open "$PROD_URL/creator/dashboard"  # Creator dashboard
open "$PROD_URL/merchant/dashboard"  # Merchant dashboard
open "$PROD_URL/customer/loyalty-card/demo-card-001"  # Loyalty card
```

### 4. Read Summary
```bash
cat automation-summary.txt
```

Should show:
```
✓ May 4: Code Quality Audit — PASSED
✓ May 5: Merchant Dashboard Integration — PASSED  
✓ May 6-8: Vercel Production Deployment — PASSED

Ready for Demo Day! 🚀
```

---

## Alternative: Run Stages Manually

If automation fails mid-way and you want to continue:

```bash
# Stage 1: Quality audit (if needed)
npm run lint && npm run type-check && npm run build && npm run test

# Stage 2: Integration (if needed)
git fetch origin merchant-dashboard-z
git checkout -b integrate/merchant-dashboard-may-5
git merge origin/merchant-dashboard-z
npm run build
git add -A
git commit -m "feat: integrate merchant dashboard polish"

# Stage 3: Deployment (if needed)
vercel --prod --skip-questions
curl "$(cat .production-url)/api/health"
```

---

## Success Criteria

✅ **Task complete when:**
1. All npm scripts pass (lint, type-check, build, test)
2. Merchant dashboard successfully merged
3. Production deployment succeeds
4. Health check passes on production URL
5. All 5 dashboards load in browser without errors
6. `automation-summary.txt` shows all stages PASSED

❌ **Do NOT consider complete if:**
- Any npm script fails
- Build fails
- Merge conflicts left unresolved
- Deployment fails or health check fails
- Any dashboard returns 404 or error

---

## Questions During Execution?

### Check These Files
```bash
cat lint-report.txt          # For ESLint issues
cat type-check-report.txt    # For TypeScript issues
cat build-report.txt         # For build errors
cat test-report.txt          # For test failures
cat vercel-deploy.txt        # For Vercel errors
vercel logs --prod           # For production runtime errors
```

### Git Status
```bash
git status                   # See current state
git log --oneline -5         # See recent commits
git branch -a                # See all branches
```

### Environment
```bash
echo $PATH                   # Check PATH
node --version && npm --version
which vercel
which git
```

---

## After Completion

1. **Commit automation artifacts**
   ```bash
   git add automation-summary.txt .production-url
   git commit -m "docs: add automation artifacts (May 4-8)"
   git push
   ```

2. **Notify team**
   - Production URL is in `.production-url`
   - Demo dashboard: `<production-url>`
   - Ready for May 9 YC Demo Day

3. **Next steps**
   - Final demo rehearsal
   - Test all dashboards on production
   - Prepare talking points for Demo Day

---

## TL;DR (Just Run It!)

```bash
cd /Users/jiamingw/Documents/GitHub/Push
chmod +x scripts/automate-may-4-8.sh
bash scripts/automate-may-4-8.sh
```

If it works: ✅ Done! Check production URL.  
If it fails: 📖 Read the error message and check troubleshooting above.

---

**Ready to start?** Run the script above. This Claude Code session will execute all automation.

Good luck! 🚀

---

**Generated:** 2026-04-20  
**For:** Push v5.2 YC Demo Day Prep  
**Status:** Ready to execute
