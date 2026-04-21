# Pilot Deploy Checklist — 2026-05-15 (v5.3-EXEC P4-1)

Three-stage go/no-go runbook for the 2026-05-15 Pilot launch. Each stage has
explicit owners, verification commands, and FREEZE triggers. Anyone can call
FREEZE; un-freeze requires documented fix.

---

## T-3 days (2026-05-12) — Code freeze + staging drill

**Owner**: engineering

- [ ] `git log origin/main --since="7 days ago"` scanned for surprise merges; all PRs have v5.3-EXEC prefix.
- [ ] `npm run type-check && npm test && npm run build && npm run e2e` — all four green locally.
- [ ] Staging Vercel deployment READY on `push-git-main-jiamingws-projects.vercel.app`.
- [ ] `curl -sS -o /dev/null -w "%{http_code}\n" https://push-six-flax.vercel.app/scan/qr-bsc-001` → `200`.
- [ ] `curl -X POST https://push-six-flax.vercel.app/api/internal/ai-verify -H 'content-type: application/json' -d '{}'` → `403` (gate working).
- [ ] `curl -sS https://push-six-flax.vercel.app/legal/do-not-sell | grep -c "Do Not Sell or Share"` → `≥1`.
- [ ] `supabase migration list --linked` — Local and Remote columns match for every row. No pending pushes.
- [ ] `supabase db execute "SELECT count(*) FROM push_transactions;"` returns a number (not an error).
- [ ] DisclosureBot spot-check: `POST /api/creator/disclosure/check` with caption `"Trying Blank Street latte #ad"` returns `verified: true`.
- [ ] Runbook posted in #pilot-war-room: who to page for DB / deploy / legal / payments.

**FREEZE TRIGGER**: any of the above fail → all non-critical merges blocked until resolved. Pilot date slips ≥24h for every hour past T-3 without resolution.

---

## T-1 day (2026-05-14) — Dry-run + warm-up

**Owner**: engineering + ops

- [ ] Internal team runs one real QR → scan → consent → redeem loop end-to-end in staging, with a real Supabase row written. Screenshot captured.
- [ ] `/admin/oracle-trigger` executed on the test transaction; `oracle_audit` row written.
- [ ] Merchant POS UI at `/merchant/redeem` exercised with a 4-char prefix; redemption lands in `push_transactions`.
- [ ] Moderation inbox (admin/disputes, admin/verifications, admin/fraud) cleared to zero backlog.
- [ ] INTERNAL_API_SECRET rotated if the prior value was shared outside the eng team in the last 30 days.
- [ ] Supabase daily backup confirmed running (Dashboard → Database → Backups, newest row in the last 24h).
- [ ] Pilot W1 merchant list (~5 shops) re-confirmed: campaigns in status=`active`, QR codes downloaded as A5 stickers, physical posters staged.
- [ ] On-call rotation populated for 2026-05-15 → 2026-05-22: primary, secondary, escalation.

**FREEZE TRIGGER**: real-row round-trip fails, or the admin moderation queues are non-empty → merchants do not receive the Pilot go-ahead email.

---

## T-0 day (2026-05-15) — Launch

**Owner**: engineering + ops + CEO

- [ ] 09:00 ET: final `vercel --prod --yes` from `main` (or auto-deploy from the final PR merge). Confirm deployment target=production, state=READY via `get_deployment` MCP.
- [ ] 09:15 ET: `curl https://push-six-flax.vercel.app/scan/<real-pilot-qr-id>` → 200, TTFB < 3s.
- [ ] 09:20 ET: smoke test all four prod URLs (`/`, `/legal/do-not-sell`, `/my-privacy`, `/scan/<qr>`). Latency under 1s for all.
- [ ] 09:30 ET: CEO sends launch email to 5 Pilot merchants.
- [ ] Hourly for first 8 hours: watch `get_runtime_logs` with `level=error` and `statusCode=5xx`. Any 5xx triggers immediate triage.
- [ ] End of day: count of `push_transactions` rows created today; target ≥ 10.
- [ ] Post-launch retro scheduled for 2026-05-22 10:00 ET.

**FREEZE TRIGGER during Pilot day**:
- Any 5xx error rate > 1% over any 10-minute window → rollback to previous deployment (`vercel rollback` or promote previous `dpl_*`).
- Any DisclosureBot false-positive that lets a creator post without `#ad` → manually suspend campaign + legal ping.
- Any consumer PII leak in server logs → immediate rotate of `SUPABASE_SERVICE_ROLE_KEY` + `INTERNAL_API_SECRET`.

---

## Rollback playbook

Last known-good production deployment is always findable via:

```bash
# List production deployments, newest first
# Find the one BEFORE the bad one; note its id (dpl_...)
# Then:
vercel rollback <url-of-good-deploy>
```

Or via MCP: `list_deployments` → pick previous `target: "production"` `state: "READY"` row → `vercel rollback <url>`.

Database rollback: there are no destructive migrations in the current set (every
CREATE uses `IF NOT EXISTS`, every column ADD uses `IF NOT EXISTS`), so rollback
of code alone is sufficient. If a data corruption incident occurs, Supabase
point-in-time restore is the fallback; the window is 7 days on the current tier.

---

## References

- v5.3-EXEC prompt pack: `/mnt/Project Push/v5_3_exec_prompts/`  (planning only)
- D15 hard gates: top of this repo's [CLAUDE.md](../CLAUDE.md)
- Incident comms template: `docs/v5_2_status/audits/05-investor-dry-run.md`
