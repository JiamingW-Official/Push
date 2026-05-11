"use client";

/* ============================================================
   live-applications.ts — creator-side applied gigs (demo store)
   v16 · 2026-05-10 — adds 9-stage lifecycle methods

   In-memory list of applications the user has submitted via the
   `/campaign/[id]` apply modal. Three consumer surfaces:
     1. /creator/work/applied (SWR cache, mutated on write)
     2. /creator/campaign/[id] post-apply state (subscribes
        directly via useApplicationForCampaign so the page
        transforms in place without round-tripping the SWR layer)
     3. /creator/applied/[id] (v16) — per-application stage-aware
        command surface. Subscribes via useApplicationById and
        re-renders on every patch.

   Production: replace `LIVE` with the real /api/creator/applications
   POST endpoint. The hook signatures stay identical.
   ============================================================ */

import { mutate } from "swr";
import { useSyncExternalStore } from "react";
import type {
  CreatorApplication,
  QuizFamiliarity,
  QuizSetup,
  ApplicationStatus,
} from "@/lib/data/hooks/useCreatorApplications";
import type { Campaign } from "@/lib/mocks/campaigns";
import { hydrate, persist } from "@/lib/data/local-persist";

const SWR_KEY = "/api/creator/applications";
const STORAGE_KEY = "applications";

/* v14 — hydrated from localStorage on first browser read so demo
 *  data survives page refreshes. SSR returns []; the first client
 *  effect (any subscriber that calls into the store after mount)
 *  re-hydrates from storage. */
let LIVE: CreatorApplication[] = hydrate<CreatorApplication[]>(STORAGE_KEY, []);
let hydrated = typeof window !== "undefined";

function ensureHydrated(): void {
  // On first browser interaction after SSR, we may have an empty
  // LIVE because the module loaded server-side. Re-pull from storage.
  if (!hydrated && typeof window !== "undefined") {
    LIVE = hydrate<CreatorApplication[]>(STORAGE_KEY, []);
    hydrated = true;
  }
}

const subscribers = new Set<() => void>();

function notify() {
  persist(STORAGE_KEY, LIVE);
  for (const fn of subscribers) fn();
}

function subscribe(fn: () => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** Public read — used when seeding the SWR cache so freshly applied
 *  rows land at the top of the applied list. */
export function getLiveApplications(): CreatorApplication[] {
  ensureHydrated();
  return LIVE;
}

/** Find the latest application this creator has submitted for a
 *  given campaign, or undefined if they haven't applied yet. */
export function findApplicationForCampaign(
  campaignId: string,
): CreatorApplication | undefined {
  ensureHydrated();
  return LIVE.find((a) => a.campaignId === campaignId);
}

/** v16 — find application by its id (drives /creator/applied/[id]).
 *  Falls back to the demo seed list when no LIVE entry exists, so
 *  drilling into seeded campaigns works without first re-applying.
 *  Synthesized seeds are memoized for stable identity (required by
 *  useSyncExternalStore — getSnapshot must return the same reference
 *  on consecutive calls or React loops infinitely). */
const seedCache = new Map<string, CreatorApplication>();

export function findApplicationById(
  applicationId: string,
): CreatorApplication | undefined {
  ensureHydrated();
  const live = LIVE.find((a) => a.id === applicationId);
  if (live) {
    // LIVE shadows seed once materialized.
    seedCache.delete(applicationId);
    return live;
  }
  const cached = seedCache.get(applicationId);
  if (cached) return cached;
  const seed = synthesizeSeedApplication(applicationId);
  if (seed) seedCache.set(applicationId, seed);
  return seed;
}

/** v16 — build a CreatorApplication from MOCK_CAMPAIGNS for demo
 *  drill-in. Status mirrors useCreatorApplications.mockFetcher so
 *  the list pill matches what the panel renders. Reads only — once
 *  the user touches a seeded application (dev switcher / withdraw
 *  / etc.) we materialize it into LIVE. */
function synthesizeSeedApplication(
  applicationId: string,
): CreatorApplication | undefined {
  // Lazy-load to avoid a static import cycle (campaigns mocks are
  // larger than this module wants at boot).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MOCK_CAMPAIGNS } = require("@/lib/mocks/campaigns") as {
    MOCK_CAMPAIGNS: import("@/lib/mocks/campaigns").Campaign[];
  };
  const campaignId = applicationId.replace(/^app-/, "");
  const idx = MOCK_CAMPAIGNS.findIndex((c) => c.id === campaignId);
  if (idx < 0) return undefined;
  const c = MOCK_CAMPAIGNS[idx]!;
  const STATUSES: ApplicationStatus[] = [
    "reviewing",
    "reviewing",
    "reviewing",
    "accepted",
    "declined",
  ];
  const APPLIED_AGO = ["2 hr ago", "5 hr ago", "1 d ago", "1 d ago", "2 d ago"];
  const RESPONSE_ETA = ["~12 h", "~9 h", "~24 h", "—", "—"];
  return {
    id: applicationId,
    campaignId: c.id,
    campaignTitle: c.title,
    merchantName: c.merchantName,
    neighborhood: c.neighborhood,
    cashPay: c.cashPay,
    payUnit: c.payUnit,
    thumbnailUrl: c.images[0] ?? "",
    status: STATUSES[idx % STATUSES.length] ?? "reviewing",
    appliedAgo: APPLIED_AGO[idx % APPLIED_AGO.length] ?? "recent",
    responseEta: RESPONSE_ETA[idx % RESPONSE_ETA.length] ?? "—",
  };
}

/** v16 — materialize a seed application into LIVE so subsequent
 *  patches stick. No-op if already in LIVE. */
function materializeSeed(
  applicationId: string,
): CreatorApplication | undefined {
  ensureHydrated();
  if (LIVE.some((a) => a.id === applicationId)) {
    return LIVE.find((a) => a.id === applicationId);
  }
  const seed = synthesizeSeedApplication(applicationId);
  if (!seed) return undefined;
  LIVE = [seed, ...LIVE];
  notify();
  mutate(SWR_KEY);
  return seed;
}

/** Boolean shortcut. */
export function hasAppliedToCampaign(campaignId: string): boolean {
  return findApplicationForCampaign(campaignId) !== undefined;
}

/** React hook — subscribes to LIVE so the page re-renders the
 *  moment a new application is added (or withdrawn). Returns the
 *  application object if found, otherwise undefined. */
export function useApplicationForCampaign(
  campaignId: string,
): CreatorApplication | undefined {
  return useSyncExternalStore(
    subscribe,
    () => findApplicationForCampaign(campaignId),
    () => undefined, // SSR fallback — never applied at build time
  );
}

/** v16 — React hook for the /creator/applied/[id] surface.
 *  Re-renders on any patch / status change to the application.
 *  Server snapshot also calls findApplicationById so seed apps
 *  render on direct URL load without a hydration flash. */
export function useApplicationById(
  applicationId: string,
): CreatorApplication | undefined {
  return useSyncExternalStore(
    subscribe,
    () => findApplicationById(applicationId),
    () => findApplicationById(applicationId),
  );
}

/** Withdraw an existing application by its id. Surfaces removed
 *  from /work/applied and the campaign page reverts to apply mode. */
export function withdrawApplication(applicationId: string): void {
  const before = LIVE.length;
  LIVE = LIVE.filter((a) => a.id !== applicationId);
  if (LIVE.length !== before) {
    notify();
    mutate(SWR_KEY);
  }
}

/** v16 — generic patch. Used by every stage panel + dev switcher
 *  to mutate fields on a stored application. Re-notifies + revalidates
 *  SWR so all subscribers (campaign page, applied list, applied/[id])
 *  see the new state immediately. Materializes a seed entry first if
 *  the id corresponds to a demo seed not yet in LIVE. */
export function patchApplication(
  applicationId: string,
  patch: Partial<CreatorApplication>,
): CreatorApplication | undefined {
  ensureHydrated();
  if (!LIVE.some((a) => a.id === applicationId)) {
    materializeSeed(applicationId);
  }
  let next: CreatorApplication | undefined;
  LIVE = LIVE.map((a) => {
    if (a.id !== applicationId) return a;
    next = { ...a, ...patch };
    return next;
  });
  if (next) {
    notify();
    mutate(SWR_KEY);
  }
  return next;
}

/** v16 — dev switcher entry. Sets the stored status; downstream
 *  useApplicationStage hook respects this as the primary source of
 *  truth (overrides time-window auto-transitions). Stamps the
 *  matching lifecycle timestamp the first time we enter that stage
 *  so panels relying on acceptedAt / submittedAt / etc. have data
 *  to render against. */
export function setApplicationStage(
  applicationId: string,
  status: ApplicationStatus,
): CreatorApplication | undefined {
  const existing = findApplicationById(applicationId);
  if (!existing) return undefined;
  const nowIso = new Date().toISOString();
  const patch: Partial<CreatorApplication> = { status };

  // Stamp lifecycle timestamps lazily (only the first time we enter
  // each gate). Demo data needs these to render countdowns / receipts.
  if (status === "accepted" && !existing.acceptedAt) patch.acceptedAt = nowIso;
  if (status === "submitted" && !existing.submittedAt)
    patch.submittedAt = nowIso;
  if (status === "verified" && !existing.verifiedAt) patch.verifiedAt = nowIso;
  if (status === "paid" && !existing.paidAt) {
    patch.paidAt = nowIso;
    if (!existing.transactionId) {
      patch.transactionId = `txn_${Math.random().toString(36).slice(2, 10)}`;
    }
    if (!existing.payoutCents) {
      patch.payoutCents = existing.cashPay * 100;
    }
    if (!existing.attributedScansCount) {
      patch.attributedScansCount = 7 + ((existing.id.length * 13) % 18);
    }
  }
  // Stage 4 needs a QR id; stamp on first entry to shoot_live.
  if (status === "shoot_live" && !existing.qrCodeId) {
    patch.qrCodeId = `qr_${existing.id.slice(-6)}`;
  }

  return patchApplication(applicationId, patch);
}

/** React hook — returns all live (non-SSR) applications and re-renders
 *  whenever any application is added, patched, or withdrawn. */
export function useLiveApplicationsList(): CreatorApplication[] {
  return useSyncExternalStore(
    subscribe,
    () => getLiveApplications(),
    () => [],
  );
}

/** v13 — submit an application with the full quiz answer set. Slot
 *  is required; the wizard gates submit until everything is captured.
 *  Prepends to LIVE + revalidates SWR so /creator/work/applied picks
 *  it up. */
export function applyToCampaign(input: {
  campaign: Campaign;
  slotIso: string;
  familiarity?: QuizFamiliarity;
  angle?: string;
  setup?: QuizSetup;
  confirmedDeliver: boolean;
  confirmedDisclose: boolean;
}): CreatorApplication {
  const {
    campaign,
    slotIso,
    familiarity,
    angle,
    setup,
    confirmedDeliver,
    confirmedDisclose,
  } = input;

  const app: CreatorApplication = {
    id: `app-${campaign.id}-${Date.now()}`,
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    merchantName: campaign.merchantName,
    neighborhood: campaign.neighborhood,
    cashPay: campaign.cashPay,
    payUnit: campaign.payUnit,
    thumbnailUrl: campaign.images[0] ?? "",
    status: "reviewing",
    appliedAgo: "just now",
    responseEta: "~24 h",
    slotIso,
    familiarity,
    angle: angle?.trim() || undefined,
    setup,
    confirmedDeliver,
    confirmedDisclose,
  };

  LIVE = [app, ...LIVE];

  // Tell SWR to revalidate the applied-list cache so the new row
  // shows up on /creator/work/applied immediately.
  mutate(SWR_KEY);
  // Tell direct subscribers (campaign page useApplicationForCampaign)
  // so the page transforms into post-apply state instantly.
  notify();

  return app;
}
