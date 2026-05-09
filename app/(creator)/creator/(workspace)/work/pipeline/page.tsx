"use client";

/* ============================================================
   /creator/work/pipeline — 7-stage Kanban view
   v2 · 2026-05-08 night
   Rewrite — v1 used GigCard with absolute-positioned status pills
   that overlapped titles in narrow columns + linked to dead routes
   (/creator/gigs/invites · /creator/inbox · /creator/campaigns/...).
   v2 uses simple inline-pill cards built on Stage primitives, all
   links go to live stage detail pages, columns size to fit 1366+
   viewports without horizontal overflow.
   ============================================================ */

import { useMemo } from "react";
import Link from "next/link";
import { useInvites, useActiveGigs } from "@/lib/data/hooks";
import {
  enrich,
  type GigStage,
  type GigWithPriority,
} from "@/lib/creator/gigs/stage";
import {
  StageShell,
  StageHeader,
} from "@/components/shared/stage";
import "./pipeline.css";

const STAGES: { n: GigStage; key: string; label: string; tone: string }[] = [
  { n: 1, key: "invited",   label: "Invited",   tone: "blue" },
  { n: 2, key: "accepted",  label: "Accepted",  tone: "champagne" },
  { n: 3, key: "shoot",     label: "Shoot",     tone: "orange" },
  { n: 4, key: "posted",    label: "Posted",    tone: "ink" },
  { n: 5, key: "live",      label: "Live",      tone: "ink" },
  { n: 6, key: "verified",  label: "Verified",  tone: "ink" },
  { n: 7, key: "paid",      label: "Paid",      tone: "green" },
];

/* Stage 1-7 → href map. All routes verified live in v22. */
const STAGE_HREF: Record<GigStage, (id: string) => string> = {
  1: () => "/creator/work/applied",
  2: (id) => `/creator/work/confirmed/${id}`,
  3: (id) => `/creator/work/active/${id}`,
  4: (id) => `/creator/work/active/${id}`,
  5: (id) => `/creator/work/active/${id}`,
  6: (id) => `/creator/work/submit/${id}`,
  7: (id) => `/creator/work/wrap/${id}`,
};

function urgencyTone(item: GigWithPriority): "warn" | "info" | "ok" | "ink" {
  const u = item.priority?.urgency;
  if (u === "overdue" || u === "stuck" || u === "today") return "warn";
  if (u === "soon" || u === "invite") return "info";
  if (u === "live" || u === "done") return "ok";
  return "ink";
}

function urgencyLabel(item: GigWithPriority): string {
  const u = item.priority?.urgency;
  if (u === "overdue") return "OVERDUE";
  if (u === "stuck") return "STUCK";
  if (u === "today") return "TODAY";
  if (u === "soon") return "SOON";
  if (u === "invite") return "INVITE";
  if (u === "live") return "LIVE";
  if (u === "done") return "DONE";
  return "TRACK";
}

export default function PipelinePage() {
  const { data: invites } = useInvites();
  const { data: actives } = useActiveGigs();

  const all: GigWithPriority[] = useMemo(() => {
    const merged = [...(invites ?? []), ...(actives ?? [])];
    const seen = new Set<string>();
    const unique = merged.filter((g) => {
      if (seen.has(g.id)) return false;
      seen.add(g.id);
      return true;
    });
    return enrich(unique);
  }, [invites, actives]);

  const byStage = useMemo(() => {
    const m: Record<GigStage, GigWithPriority[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [],
    };
    for (const it of all) m[it.stage].push(it);
    return m;
  }, [all]);

  const total = all.length;

  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Pipeline · 7-stage kanban"
      showJourney={false}
      className="pipe"
    >
      <StageHeader
        eyebrow="Work · pipeline"
        title="Pipeline"
        sub={`${total} gigs across 7 stages · grouped by where they are right now. Tap any card to open its stage detail page. Tap a column header to filter.`}
      />

      <section className="pipe__board" aria-label="Pipeline columns">
        {STAGES.map((s) => {
          const items = byStage[s.n];
          return (
            <div key={s.key} className={`pipe__col pipe__col--${s.tone}`}>
              <header className="pipe__col-head">
                <span className="pipe__col-num">{s.n}</span>
                <span className="pipe__col-label">{s.label}</span>
                <span className="pipe__col-count">{items.length}</span>
              </header>
              {items.length === 0 ? (
                <p className="pipe__col-empty">—</p>
              ) : (
                <ul className="pipe__cards">
                  {items.map((it) => (
                    <li key={it.gig.id}>
                      <Link
                        href={STAGE_HREF[it.stage](it.gig.id)}
                        className="pipe__card"
                        prefetch={false}
                      >
                        <span className={`pipe__card-pill pipe__card-pill--${urgencyTone(it)}`}>
                          {urgencyLabel(it)}
                        </span>
                        <span className="pipe__card-title">{it.gig.brand}</span>
                        <span className="pipe__card-meta">
                          {it.gig.campaign}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </StageShell>
  );
}
