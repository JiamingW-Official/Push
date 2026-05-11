"use client";

/* ============================================================
   merchant-campaigns.ts — localStorage-backed merchant campaign store
   v1 · 2026-05-11

   Bridges the merchant create flow (/merchant/campaigns/new) to the
   detail page (/merchant/campaigns/[id]) on Vercel, where serverless
   Lambda instances share no in-memory or /tmp state.

   On publish, the wizard saves result.data here via addMerchantCampaign().
   On detail load, CampaignDetailPageClient reads from here first if the
   server-side fetch returns null.

   SSR-safe: hydrate/persist both guard typeof window.
   ============================================================ */

import { hydrate, persist } from "@/lib/data/local-persist";
import type { Campaign } from "@/lib/data/types";

const STORAGE_KEY = "merchant_campaigns_v1";

let stored: Campaign[] = [];
let ready = false;

function init() {
  if (ready || typeof window === "undefined") return;
  stored = hydrate<Campaign[]>(STORAGE_KEY, []);
  ready = true;
}

/** Save or update a merchant campaign. Called after successful creation. */
export function addMerchantCampaign(c: Campaign): void {
  init();
  const idx = stored.findIndex((x) => x.id === c.id);
  if (idx >= 0) {
    stored = [...stored.slice(0, idx), c, ...stored.slice(idx + 1)];
  } else {
    stored = [c, ...stored];
  }
  persist(STORAGE_KEY, stored);
}

/** Look up a merchant campaign by id. Returns undefined if not found. */
export function findMerchantCampaign(id: string): Campaign | undefined {
  init();
  return stored.find((c) => c.id === id);
}
