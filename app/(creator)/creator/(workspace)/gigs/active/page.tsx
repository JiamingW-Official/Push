"use client";

/* ============================================================
   /creator/gigs/active — Active gigs (committed work in flight).
   v2 (2026-05-08, modular GigCard rewrite, macOS 26 visuals)

   Shows ONLY stages 2-6 (accepted → verified). Stage 1 invites
   live at /creator/gigs/invites; stage 7 paid lives at /history.

   Layout:
     1. HERO              ← Gigs · "Active" + sub
     2. PRIORITY STRIP    overdue · today · stuck · — (no invites)
     3. URGENT NOW        priority cards (top 5 by score)
     4. ALL ACTIVE        compact rows (rest, filterable)
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Briefcase, Inbox } from "lucide-react";
import { useActiveGigs } from "@/lib/data/hooks";
import {
  enrich,
  countPriorities,
  partitionByKind,
  sortByPriority,
  type GigWithPriority,
} from "@/lib/creator/gigs/stage";
import { GigCard } from "@/components/creator/gigs/GigCard";
import {
  PriorityStrip,
  type ActiveFilter,
} from "@/components/creator/gigs/PriorityStrip";
import "@/components/creator/gigs/gig-modules.css";
import "./active-v2.css";

const FILTER_TO_URGENCY: Record<
  ActiveFilter,
  ((g: GigWithPriority) => boolean) | null
> = {
  all: null,
  overdue: (g) => g.priority.urgency === "overdue",
  today: (g) => g.priority.urgency === "today" || g.priority.urgency === "soon",
  invites: (g) => g.priority.urgency === "invite",
  stuck: (g) => g.priority.urgency === "stuck",
};

const PRIORITY_TOP_N = 5;

export default function ActiveGigsPage() {
  const { data: actives, isLoading } = useActiveGigs();
  const [filter, setFilter] = useState<ActiveFilter>("all");

  const items: GigWithPriority[] = useMemo(() => {
    const list = actives ?? [];
    const enriched = enrich(list);
    // Hub already partitions; here we only want stages 2-6.
    const buckets = partitionByKind(enriched);
    return buckets.active;
  }, [actives]);

  const counts = useMemo(() => countPriorities(items), [items]);
  const priorityTop = useMemo(() => items.slice(0, PRIORITY_TOP_N), [items]);
  const rest = useMemo(() => items.slice(PRIORITY_TOP_N), [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return null;
    const pred = FILTER_TO_URGENCY[filter];
    if (!pred) return null;
    return sortByPriority(items.filter(pred));
  }, [items, filter]);

  const total = items.length;

  return (
    <main className="acg" aria-label="Active gigs">
      <header className="acg__hero">
        <Link href="/creator/gigs" className="hub-back">
          <ArrowLeft size={14} strokeWidth={2.25} />
          Gigs
        </Link>
        <div className="acg__hero-row">
          <div>
            <h1 className="acg__title">Active</h1>
            <p className="acg__sub">
              <strong>{total}</strong> committed gig{total === 1 ? "" : "s"} in
              flight ·{" "}
              <span className="acg__refresh">
                <RefreshCw size={11} strokeWidth={2.25} />
                refreshed just now
              </span>
            </p>
          </div>
          <Link href="/creator/gigs/invites" className="acg__cta-secondary">
            <Inbox size={13} strokeWidth={2.25} />
            New invites →
          </Link>
        </div>
      </header>

      {/* ── Priority strip (filter) ─────────────────── */}
      <section className="acg__strip-wrap" aria-label="Priority overview">
        <PriorityStrip counts={counts} active={filter} onSelect={setFilter} />
      </section>

      {/* ── Filtered view ───────────────────────────── */}
      {filter !== "all" && (
        <section className="acg__section" aria-label="Filtered">
          <header className="acg__section-head">
            <p className="acg__section-eyebrow">
              Filtered · {filtered?.length ?? 0} match
            </p>
            <h2 className="acg__section-title">Matching active gigs</h2>
          </header>
          {(filtered ?? []).length === 0 ? (
            <div className="acg__empty">
              <p>
                No active gigs match this filter.{" "}
                <button
                  type="button"
                  className="acg__empty-clear"
                  onClick={() => setFilter("all")}
                >
                  Clear
                </button>
              </p>
            </div>
          ) : (
            <ul className="acg__list">
              {(filtered ?? []).map((it) => (
                <li key={it.gig.id}>
                  <GigCard item={it} variant="compact" />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── Empty state ─────────────────────────────── */}
      {filter === "all" && !isLoading && items.length === 0 && (
        <div className="acg__hero-empty">
          <Briefcase size={28} strokeWidth={1.5} />
          <h2 className="acg__hero-empty-title">
            Nothing in flight right now.
          </h2>
          <p className="acg__hero-empty-sub">
            Pick up a fresh invite to get rolling — they expire fast.
          </p>
          <Link href="/creator/gigs/invites" className="acg__hero-empty-cta">
            <Inbox size={13} strokeWidth={2.25} />
            Browse invites
          </Link>
        </div>
      )}

      {/* ── Urgent now (priority cards) ─────────────── */}
      {filter === "all" && priorityTop.length > 0 && (
        <section className="acg__section" aria-label="Urgent now">
          <header className="acg__section-head">
            <p className="acg__section-eyebrow acg__section-eyebrow--ink">
              <Briefcase size={11} strokeWidth={2.25} />
              Urgent now · top {priorityTop.length}
            </p>
            <h2 className="acg__section-title">What blocks your day</h2>
          </header>
          <div className="acg__priority-stack">
            {priorityTop.map((it) => (
              <GigCard key={it.gig.id} item={it} variant="priority" />
            ))}
          </div>
        </section>
      )}

      {/* ── Long-tail compact list ──────────────────── */}
      {filter === "all" && rest.length > 0 && (
        <section className="acg__section" aria-label="All active">
          <header className="acg__section-head">
            <p className="acg__section-eyebrow">
              Rest of your queue · {rest.length}
            </p>
            <h2 className="acg__section-title">Tracking & passive</h2>
          </header>
          <ul className="acg__list">
            {rest.map((it) => (
              <li key={it.gig.id}>
                <GigCard item={it} variant="compact" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {isLoading && (
        <div className="acg__empty">
          <p>Loading your active gigs…</p>
        </div>
      )}
    </main>
  );
}
