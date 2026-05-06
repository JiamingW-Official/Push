# API Contracts — type-first specification

Audit § 6 mandate. Each domain hub gets a contract file that defines:

1. The TypeScript type for every endpoint's response
2. The request shape (query params, body)
3. A reference comment for which API route implements it

This is the **spec**, not the **implementation**. It exists so:

- Frontend can write hooks against a stable type even when the server is mock
- Backend has a single source of truth for what shape to return
- Changes get reviewed at the type level before code-level drift accumulates

When a real route lands, swap its inline JSON shape for the imported type.
When a contract changes, every consumer breaks at compile time — exactly
what we want for a pre-pilot product where contracts are still moving.

## Files

```
/lib/contracts/today.ts     — TODAY composite + briefing
/lib/contracts/work.ts      — WORK gigs / pipeline / drafts / calendar
/lib/contracts/money.ts     — MONEY earnings / milestones / payouts / tax
/lib/contracts/discover.ts  — DISCOVER browse / invites / trending / saved
/lib/contracts/comms.ts     — COMMS messages / notifications / disputes
/lib/contracts/identity.ts  — IDENTITY profile / tier / leaderboard
/lib/contracts/index.ts     — barrel
```

Per audit § 7.5: hub pages should be quiet (4-6 modules, big numerals);
detail pages own complexity. Contracts mirror that — module-shape types
return digest payloads; detail-shape types return paginated tables.
