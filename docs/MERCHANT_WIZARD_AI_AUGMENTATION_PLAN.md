# Merchant Create-Campaign Wizard · AI Augmentation Plan

**Status:** PLAN ONLY (2026-05-10) — no code shipped yet.
**Source wizard:** `app/(merchant)/merchant/campaigns/new/page.tsx` (1819 lines, 6 steps).
**AI engine:** `lib/services/merchant-ai.ts` (already shipped).

The existing wizard is mature and not a stub. Adding AI helpers should
be a surgical augmentation, not a rewrite. This doc specifies the exact
injection points so the next session (or whoever picks this up) can
wire it in two hours of focused edits.

## Existing wizard map

The 6 steps are at known line ranges in the page:

| Step | Heading | Line | What the merchant fills |
|---|---|---|---|
| 1 | BASICS | 941-1017 | name, category, description |
| 2 | BUDGET | 1018-1133 | budget, tier, commissionSplit |
| 3 | DELIVERABLES | 1134-1230 | contentType, platform, dueDate |
| 4 | LOCATIONS | 1231-1329 | applicable_location_ids[] |
| 5 | HERO OFFER | 1330-1795 | hero_offer (deep config) |
| 6 | REVIEW | 1796+ | final review + submit |

State lives in a single `formData` object (line ~20) — adding AI
suggestions means writing into `setFormData` from helper buttons.

## Augmentation strategy — three injection points

### Injection 1 · Top-of-wizard agent strip
Mirror the apply modal v15 agent strip. Sits below the page title,
above the rail. Sparkles icon + Push AI narrative + Auto-fill button.

**Where:** insert above `<h2 className="cn-rail-heading">` (~line 920).

**Component:** new `<MerchantAgent />` in
`components/merchant/campaign-wizard/MerchantAgent.tsx`. Takes
`{ step, formData, setFormData, category, neighborhood, merchantName }`
and renders:
- Agent narrative (per step, mirroring apply modal `agentNarrative()`)
- Auto-fill button → calls all four `suggestX()` helpers + writes to formData

### Injection 2 · Step 1 (BASICS) — Suggest a draft for description
Inside the BASICS step, below the description textarea, add a small
`<AIBriefHelper />` component that:
- Reads current formData.description + ctx (category, neighborhood, vibe)
- Renders Suggest / Polish buttons (same shape as apply modal)
- Renders 4-dim strength meter (Length / Specific / Sensory / Local fit)
- Renders inline suggestion chips when text exists
- Writes back via setFormData on click

**Where:** inside the description input block in step 1 (around
line 990).

**Engine calls:**
```ts
import {
  suggestBrief,
  polishBrief,
  analyzeBrief,
  type BriefContext,
} from "@/lib/services/merchant-ai";

const ctx: BriefContext = {
  category: formData.category as MerchantCategory,
  neighborhood: merchantNeighborhood,
  merchantName: merchantName,
  vibe: formData.vibeHint, // optional new field
};
```

### Injection 3 · Step 2 + Step 3 (BUDGET + DELIVERABLES) — Smart pricing
Add an "AI suggested" pill above the budget input + deliverable rows
that calls `suggestPay(ctx, deliverables)` and `suggestDeliverables(ctx, budget)`
respectively. One-click apply writes to formData.

**Where:** above the budget slider (line ~1040) and above the
deliverables list (line ~1170).

**Engine calls:**
```ts
import { suggestPay, suggestDeliverables } from "@/lib/services/merchant-ai";

// In Step 2:
const payRec = suggestPay(ctx, formData.deliverables);
// Render: "Push AI recommends $185. Based on 3.2h effort + 15% Push premium."

// In Step 3:
const bundle = suggestDeliverables(ctx, parseInt(formData.budget));
// Render: "Push AI suggests 1 Visit + 1 Reel + 1 Story. Apply →"
```

## Naming + visual contract (match apply modal v15)

- Sparkle icon = `Sparkles` from lucide-react
- AI moment color = N2W blue `#0085ff` (do NOT use brand red, that's
  reserved for primary CTAs)
- Strength meter dot colors = green `#34c759` / amber `#ff9500` /
  gray `rgba(20, 19, 15, 0.18)` (same as apply modal)
- Loading spinner = `Loader2` with the existing `apply-mdl__spin`
  animation (or a copy under `cn-spin`)
- Button labels = "Suggest a draft" / "Polish" / "Auto-fill" (verbatim
  from apply modal — do NOT reword)

## Definition-of-done for B1

- [ ] `<MerchantAgent />` strip rendered on every step
- [ ] BASICS step has Suggest / Polish + strength meter under description
- [ ] BUDGET step shows Push-AI-recommended total with rationale
- [ ] DELIVERABLES step shows Push-AI-suggested bundle with one-click apply
- [ ] Auto-fill writes to all editable fields (description, budget, deliverables)
- [ ] Visual + interaction parity with the apply modal v15
- [ ] Type-check clean
- [ ] No regression on the existing 6-step happy path

## Estimated effort

- Component scaffolding (MerchantAgent, AIBriefHelper, AIPricingHelper): **3 hours**
- Wiring into existing page.tsx: **2 hours**
- CSS to match apply modal vocabulary: **1 hour**
- Type-check + manual QA: **1 hour**

**Total: ~7 hours focused work.** Do this in a single session for
state-management coherence.

## Why this isn't shipping today

The session that started "ABC 都开始做" budgeted only ~2 hours for B
after finishing A. Building three new components + integrating them
into a 1800-line wizard takes a clean session. The AI engine is
already shipped (`lib/services/merchant-ai.ts`) so when you're
ready to pick this up, every helper call is already there.
