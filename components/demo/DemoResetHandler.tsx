"use client";

/* ============================================================
   <DemoResetHandler /> — listens for ?reset=1 to wipe demo data
   v1 · 2026-05-10

   Mounted once at the workspace layout level. On first client
   render checks the URL for `?reset=1`; if present, clears every
   `push-demo:*` localStorage key, force-reloads the page so the
   in-memory stores re-hydrate from a fresh empty state, and
   strips the param from the URL.

   Used by playtest testers to start fresh without DevTools.
   ============================================================ */

import { useEffect } from "react";
import { handleResetParam } from "@/lib/data/local-persist";

export function DemoResetHandler() {
  useEffect(() => {
    const wasReset = handleResetParam();
    if (wasReset) {
      // Force a hard reload so the live-* stores re-hydrate from
      // a now-empty localStorage. Without reload, stale in-memory
      // state from before the reset would persist this session.
      window.location.reload();
    }
  }, []);
  return null;
}
