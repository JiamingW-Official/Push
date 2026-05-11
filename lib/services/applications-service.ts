"use client";

/* ============================================================
   applications-service.ts — apply / withdraw / status surface
   v1 · 2026-05-10

   Single read/write surface for creator applications. Today
   wraps the in-memory live-applications store; pilot-day swap
   points at Supabase via the same adapter interface.

   See campaigns-service.ts for the matching pattern. The
   contract here is intentionally narrow — we add lifecycle
   methods (accept, decline, schedule_shoot, submit_content,
   verify, pay) as the funnel UI ships in Phases 3-5.
   ============================================================ */

import type {
  CreatorApplication,
  QuizFamiliarity,
  QuizSetup,
} from "@/lib/data/hooks/useCreatorApplications";
import type { Campaign } from "@/lib/mocks/campaigns";
import {
  applyToCampaign,
  findApplicationForCampaign,
  hasAppliedToCampaign,
  withdrawApplication,
  getLiveApplications,
} from "@/lib/data/live-applications";

/* ── Adapter interface ───────────────────────────────────── */

export interface ApplicationsAdapter {
  list(): CreatorApplication[];
  findForCampaign(campaignId: string): CreatorApplication | undefined;
  hasApplied(campaignId: string): boolean;
  apply(input: ApplyInput): CreatorApplication;
  withdraw(applicationId: string): void;
}

export interface ApplyInput {
  campaign: Campaign;
  slotIso: string;
  familiarity?: QuizFamiliarity;
  angle?: string;
  setup?: QuizSetup;
  confirmedDeliver: boolean;
  confirmedDisclose: boolean;
}

/* ── In-memory adapter (today) ───────────────────────────── */

const memoryAdapter: ApplicationsAdapter = {
  list: () => getLiveApplications(),
  findForCampaign: (id) => findApplicationForCampaign(id),
  hasApplied: (id) => hasAppliedToCampaign(id),
  apply: (input) => applyToCampaign(input),
  withdraw: (id) => withdrawApplication(id),
};

/* ── Supabase adapter — implement on pilot day ───────────── */

// const supabaseAdapter: ApplicationsAdapter = {
//   list: () => { ... select('*').eq('creator_id', currentCreator.id) },
//   findForCampaign: (id) => { ... .single() },
//   hasApplied: (id) => !!findForCampaign(id),
//   apply: (input) => { ... insert + return row },
//   withdraw: (id) => { ... update status='withdrawn' },
// };

/* ── Public API ──────────────────────────────────────────── */

function getApplicationsAdapter(): ApplicationsAdapter {
  return memoryAdapter; // Flip to supabaseAdapter on go-live.
}

export const applicationsService = {
  list: () => getApplicationsAdapter().list(),
  findForCampaign: (id: string) => getApplicationsAdapter().findForCampaign(id),
  hasApplied: (id: string) => getApplicationsAdapter().hasApplied(id),
  apply: (input: ApplyInput) => getApplicationsAdapter().apply(input),
  withdraw: (id: string) => getApplicationsAdapter().withdraw(id),
};
