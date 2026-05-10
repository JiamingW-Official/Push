"use client";

/* ============================================================
   <DevStageSwitcher> — floating playtest helper
   v1 · 2026-05-10

   Bottom-right floating pill. Lists all 11 lifecycle stages. Click
   one to setApplicationStage(id, status) — re-renders StageRouter
   into the matching panel. Persists via the existing live-
   applications localStorage path so refreshes keep the state.

   Visibility:
     - process.env.NODE_ENV !== 'production' → always visible
     - production → only when the URL contains ?dev=1

   This is a demo / playtest aid. Strip in production with the
   feature-flag below.
   ============================================================ */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown, Wand2 } from "lucide-react";
import type {
  CreatorApplication,
  ApplicationStatus,
} from "@/lib/data/hooks/useCreatorApplications";
import { setApplicationStage } from "@/lib/data/live-applications";
import { STAGE_LABEL, STAGE_TONE } from "@/lib/services/application-stage";

const STAGES: ApplicationStatus[] = [
  "reviewing",
  "accepted",
  "pre_shoot",
  "shoot_live",
  "pending_upload",
  "submitted",
  "revision_requested",
  "verified",
  "paid",
  "declined",
  "withdrawn",
];

export function DevStageSwitcher({
  application,
}: {
  application: CreatorApplication;
}) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const search = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Visibility gate: dev mode OR explicit ?dev=1.
  const isDev = process.env.NODE_ENV !== "production";
  const explicit = search?.get("dev") === "1";
  if (!isDev && !explicit) return null;

  return (
    <aside className="dev-switcher" aria-label="Stage switcher (dev only)">
      <button
        type="button"
        className="dev-switcher__head"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dev-switcher__head-icon" aria-hidden>
          <Wand2 size={12} strokeWidth={2.25} />
        </span>
        <span className="dev-switcher__head-text">
          Stage · <strong>{STAGE_LABEL[application.status]}</strong>
        </span>
        <span className="dev-switcher__head-chev" aria-hidden>
          {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </span>
      </button>
      {open && (
        <ul className="dev-switcher__list" role="listbox">
          {STAGES.map((s) => {
            const active = s === application.status;
            return (
              <li key={s}>
                <button
                  type="button"
                  className={`dev-switcher__row dev-switcher__row--${STAGE_TONE[s]}${
                    active ? " is-on" : ""
                  }`}
                  aria-pressed={active}
                  onClick={() => setApplicationStage(application.id, s)}
                >
                  <span className="dev-switcher__row-dot" aria-hidden />
                  <span className="dev-switcher__row-label">
                    {STAGE_LABEL[s]}
                  </span>
                  <span className="dev-switcher__row-key">{s}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
