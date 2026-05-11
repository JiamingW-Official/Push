"use client";

/**
 * Creator-side outbound applications — SWR hook.
 *
 *   const { data, error, isLoading, mutate } = useCreatorApplications();
 *
 * Returns the creator's open applications waiting on merchant decision.
 * Each row carries the campaign data (title, merchant, neighborhood,
 * thumbnail, pay) plus application-specific state (status, applied
 * timestamp, response ETA).
 *
 * Data path:
 *   1. SWR fetches from /api/creator/applications (GET) when the route
 *      ships. Until then, the inline fetcher returns mock data derived
 *      from MOCK_CAMPAIGNS so the new pages work end-to-end.
 *   2. Production swap: replace the inline fetcher with the standard
 *      `fetcher` from "@/lib/data/fetcher" pointed at the real route.
 *      Hook signature stays identical — pages don't need to change.
 *
 * Realtime: not wired in v1. Add subscribeMessages-style polling once
 * the production endpoint exists (decisions arrive via merchant action,
 * so a 60s poll + on-focus revalidate is enough for now).
 */

import useSWR from "swr";

/* v16 — 11-state lifecycle. Drives the new /creator/applied/[id]
 *  stage-aware command surface. The 3 original states stay intact;
 *  8 new states map to the post-accept funnel (Phases 2-9).
 *
 *  Transitions:
 *    reviewing  → accepted | declined | withdrawn
 *    accepted   → pre_shoot (auto T-24h) | shoot_live (auto T-0)
 *    pre_shoot  → shoot_live (auto T-0)
 *    shoot_live → pending_upload (auto T+90min)
 *    pending_upload → submitted | (timeout → revision_requested)
 *    submitted  → revision_requested | verified
 *    revision_requested → submitted (re-upload)
 *    verified   → paid (auto T+72h)
 *    declined / withdrawn / paid — terminal
 */
export type ApplicationStatus =
  | "reviewing"
  | "declined"
  | "withdrawn"
  | "accepted"
  | "pre_shoot"
  | "shoot_live"
  | "pending_upload"
  | "submitted"
  | "revision_requested"
  | "verified"
  | "paid";

/* v13 — qualification quiz answers, all structured so merchant
   review surface can filter / sort / display them properly.
   Filled by the apply modal wizard on /campaign/[id]. */
export type QuizFamiliarity = "first" | "few" | "regular";
export type QuizSetup = "phone" | "phone-plus" | "pro";

/* v16 — per-deliverable submission row (Stage 5 upload mission
 *  control writes here; Stage 6 reads it back). */
export interface ApplicationSubmission {
  /** Index into campaign.deliverables[]. */
  deliverableIdx: number;
  /** Filenames the creator dropped (mock: name only, no real upload). */
  fileNames: string[];
  /** Caption / paste-ready post copy for this deliverable. */
  caption: string;
  /** One bool per shotList entry — creator self-validates before submit. */
  shotsConfirmed: boolean[];
  /** Required: creator confirmed #ad + partner tag included. */
  ftcChecked: boolean;
  /** Per-row review state once merchant decides. */
  reviewState?: "pending" | "approved" | "revision_requested";
}

/* v16 — merchant per-deliverable feedback (Stage 7). */
export interface ApplicationDecisionNote {
  deliverableIdx: number;
  state: "approved" | "revision_requested";
  note: string;
}

export type CreatorApplication = {
  /** Application id (production: app_xxx). Fallback: app-{campaignId}. */
  id: string;
  /** Campaign id the creator applied to. */
  campaignId: string;
  /** Campaign title at apply time. */
  campaignTitle: string;
  /** Merchant display name. */
  merchantName: string;
  /** Neighborhood + city ("Williamsburg, BK"). */
  neighborhood: string;
  /** Cash pay headline figure (per unit). */
  cashPay: number;
  /** Pay unit label (visit / post / reel / etc). */
  payUnit: string;
  /** Hero thumbnail URL. */
  thumbnailUrl: string;
  /** Decision state. */
  status: ApplicationStatus;
  /** Human "applied N ago" — server may compute this. */
  appliedAgo: string;
  /** Expected decision ETA string ("~12h", "—" if resolved). */
  responseEta: string;

  /** v13 — booked shoot slot (REQUIRED on new applications). ISO
   *  string `YYYY-MM-DDTHH:MM`. Optional only on legacy seed rows
   *  pre-v13 that don't have slot data. */
  slotIso?: string;
  /** v13 — quiz answer: familiarity with merchant. */
  familiarity?: QuizFamiliarity;
  /** v13 — quiz answer: creator's pitched content angle. */
  angle?: string;
  /** v13 — quiz answer: production setup tier. */
  setup?: QuizSetup;
  /** v13 — confirmed they can deliver by deadline. */
  confirmedDeliver?: boolean;
  /** v13 — confirmed FTC disclosure. */
  confirmedDisclose?: boolean;
  /** Server-side UUID from playtestApplications (used to poll approval status). */
  serverAppId?: string;

  /* ── v16 lifecycle timestamps ─────────────────────────────── */
  /** Stage 2 — merchant accepted at this time. */
  acceptedAt?: string;
  /** Stage 6 — creator submitted content at this time. */
  submittedAt?: string;
  /** Stage 7b — merchant approved everything at this time. */
  verifiedAt?: string;
  /** Stage 9 — Stripe transfer cleared at this time. */
  paidAt?: string;

  /* ── v16 lifecycle data ──────────────────────────────────── */
  /** Stage 2 — optional welcome note from merchant. */
  merchantNote?: string;
  /** Stage 4 — unique attribution QR code id (creator shows this at register). */
  qrCodeId?: string;
  /** Stage 4 — first scan event timestamp from merchant register. */
  attributionEventReceivedAt?: string;
  /** Stage 5 — per-deliverable submission rows. */
  submissions?: ApplicationSubmission[];
  /** Stage 7 — per-deliverable merchant feedback. */
  decisionNotes?: ApplicationDecisionNote[];
  /** Stage 2/3 — 6-item shoot-prep checklist state (indexed). */
  prepChecklist?: boolean[];
  /** Stage 8/9 — final payout in cents. */
  payoutCents?: number;
  /** Stage 9 — Stripe transfer reference. */
  transactionId?: string;
  /** Stage 9 — total verified scans attributed to this creator's content. */
  attributedScansCount?: number;
};

const SWR_KEY = "/api/creator/applications";

async function mockFetcher(): Promise<CreatorApplication[]> {
  /* Mock fallback while /api/creator/applications GET ships. Derives
     from MOCK_CAMPAIGNS for the seed list, then prepends any LIVE
     applications submitted via the /campaign/[id] apply modal. */
  const { MOCK_CAMPAIGNS } = await import("@/lib/mocks/campaigns");
  const { getLiveApplications } = await import("@/lib/data/live-applications");

  const STATUSES: ApplicationStatus[] = [
    "reviewing",
    "reviewing",
    "reviewing",
    "accepted",
    "declined",
  ];
  const APPLIED_AGO = ["2 hr ago", "5 hr ago", "1 d ago", "1 d ago", "2 d ago"];
  const RESPONSE_ETA = ["~12 h", "~9 h", "~24 h", "—", "—"];

  const seed: CreatorApplication[] = MOCK_CAMPAIGNS.slice(0, 5).map((c, i) => ({
    id: `app-${c.id}`,
    campaignId: c.id,
    campaignTitle: c.title,
    merchantName: c.merchantName,
    neighborhood: c.neighborhood,
    cashPay: c.cashPay,
    payUnit: c.payUnit,
    thumbnailUrl: c.images[0] ?? "",
    status: STATUSES[i] ?? "reviewing",
    appliedAgo: APPLIED_AGO[i] ?? "recent",
    responseEta: RESPONSE_ETA[i] ?? "—",
  }));

  // Fetch server-side playtest statuses so merchant approvals show up on creator side.
  const serverStatusMap: Record<string, string> = {};
  try {
    const res = await fetch("/api/creator/live-applications");
    if (res.ok) {
      const json = (await res.json()) as {
        applications: Array<{ campaignId: string; status: string }>;
      };
      for (const a of json.applications ?? []) {
        serverStatusMap[a.campaignId] = a.status;
      }
    }
  } catch {
    // best-effort
  }

  const playtestStatusMap: Record<string, ApplicationStatus> = {
    accepted: "accepted",
    declined: "declined",
    pending: "reviewing",
    shortlisted: "reviewing",
  };

  // Live applications first (just-applied rows go to the top).
  // Override status with server truth when merchant has made a decision.
  const live = getLiveApplications().map((app) => {
    const serverStatus = serverStatusMap[app.campaignId];
    if (serverStatus && playtestStatusMap[serverStatus]) {
      return { ...app, status: playtestStatusMap[serverStatus] };
    }
    return app;
  });
  // De-dup by campaignId — if user re-applies, live row replaces seed.
  const liveCampaignIds = new Set(live.map((a) => a.campaignId));
  const seedFiltered = seed.filter((a) => !liveCampaignIds.has(a.campaignId));
  return [...live, ...seedFiltered];
}

export function useCreatorApplications() {
  const { data, error, isLoading, mutate } = useSWR<CreatorApplication[]>(
    SWR_KEY,
    mockFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 60_000,
    },
  );

  return {
    data: data ?? [],
    error,
    isLoading,
    mutate,
  };
}
