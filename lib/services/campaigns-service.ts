"use client";

/* ============================================================
   campaigns-service.ts — single read/write surface for campaigns
   v1 · 2026-05-10

   The wizard, the discover feed, and the campaign detail page
   all read through this module. Today it forwards to the in-memory
   live-campaigns store; on pilot day we swap a single line in
   `getCampaignsAdapter()` to point at Supabase. Every consumer
   keeps working unchanged.

   Adapter contract (must match for every backend):
     - listCampaigns()              → Campaign[]
     - findCampaign(id)             → Campaign | undefined
     - findSimilar(campaign, opts)  → Campaign[]
     - createCampaign(input)        → Campaign
     - updateCampaign(id, patch)    → Campaign
     - publishCampaign(id)          → Campaign
   ============================================================ */

import type { Campaign } from "@/lib/mocks/campaigns";
import {
  getLiveCampaigns,
  findLiveCampaign,
  addLiveCampaign,
  findSimilarCampaigns,
} from "@/lib/data/live-campaigns";

/* ── Adapter interface ───────────────────────────────────── */

export interface CampaignsAdapter {
  list(): Campaign[];
  find(id: string): Campaign | undefined;
  similar(c: Campaign, opts?: { limit?: number; excludeIds?: Set<string> }): Campaign[];
  create(input: Campaign): Campaign;
  update(id: string, patch: Partial<Campaign>): Campaign;
  publish(id: string): Campaign;
}

/* ── In-memory adapter (today) ───────────────────────────── */

const memoryAdapter: CampaignsAdapter = {
  list: () => getLiveCampaigns(),
  find: (id) => findLiveCampaign(id),
  similar: (c, opts) => findSimilarCampaigns(c, opts),
  create: (input) => {
    addLiveCampaign(input);
    return input;
  },
  update: (id, patch) => {
    const existing = findLiveCampaign(id);
    if (!existing) throw new Error(`Campaign ${id} not found`);
    const merged: Campaign = { ...existing, ...patch, id: existing.id };
    addLiveCampaign(merged); // de-dups by id
    return merged;
  },
  publish: (id) => {
    // Mock has no draft/live distinction; this is a no-op that
    // returns the campaign as-is. Supabase impl flips status to 'live'.
    const existing = findLiveCampaign(id);
    if (!existing) throw new Error(`Campaign ${id} not found`);
    return existing;
  },
};

/* ── Supabase adapter (pilot-day swap) ───────────────────── */

/* Stub. Implement when Supabase migration applies (see
 *  supabase/migrations/20260510000000_creator_marketplace_core.sql).
 *  Swap `getCampaignsAdapter` to return this. */
//
// const supabaseAdapter: CampaignsAdapter = {
//   list: async () => {
//     const { data } = await supabase.from('campaigns').select('*').eq('status', 'live');
//     return (data ?? []).map(rowToCampaign);
//   },
//   ... etc
// };

/* ── Public API — what the rest of the app imports ───────── */

function getCampaignsAdapter(): CampaignsAdapter {
  // Single line to flip when production goes live.
  return memoryAdapter;
}

export const campaignsService = {
  list: () => getCampaignsAdapter().list(),
  find: (id: string) => getCampaignsAdapter().find(id),
  similar: (c: Campaign, opts?: { limit?: number; excludeIds?: Set<string> }) =>
    getCampaignsAdapter().similar(c, opts),
  create: (input: Campaign) => getCampaignsAdapter().create(input),
  update: (id: string, patch: Partial<Campaign>) =>
    getCampaignsAdapter().update(id, patch),
  publish: (id: string) => getCampaignsAdapter().publish(id),
};
