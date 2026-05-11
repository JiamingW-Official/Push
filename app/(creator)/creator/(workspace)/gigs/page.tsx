"use client";

/* ============================================================
   /creator/gigs — Mission Control hub. v2 (2026-05-08)

   Active-first hierarchy. The first thing the creator sees is
   committed work in flight (real money on the line); invites
   (opportunities) sit below as a secondary surface.

   Section order, top-to-bottom:
     1. HERO            — back · title · quick-links
     2. PRIORITY STRIP  — 4 colored KPI pills
     3. ACTIVE WORK     — stages 2-6, sorted by score (top 5 priority cards)
     4. NEW INVITES     — stage 1, sorted by expiry (top 3 compact cards)
     5. EVERYTHING ELSE — long-tail compact list (filterable via strip)
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Inbox, Briefcase, Archive } from "lucide-react";
import { useInvites, useActiveGigs } from "@/lib/data/hooks";
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
import "./gigs-hub.css";

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
const INVITE_PREVIEW_N = 3;

export default function GigsHubPage() {
  const { data: invites, isLoading: invitesLoading } = useInvites();
  const { data: actives, isLoading: activesLoading } = useActiveGigs();
  const [filter, setFilter] = useState<ActiveFilter>("all");

  const allItems: GigWithPriority[] = useMemo(() => {
    const merged = [...(invites ?? []), ...(actives ?? [])];
    const seen = new Set<string>();
    const unique = merged.filter((g) => {
      if (seen.has(g.id)) return false;
      seen.add(g.id);
      return true;
    });
    return enrich(unique);
  }, [invites, actives]);

  const counts = useMemo(() => countPriorities(allItems), [allItems]);

  // Active-first 3-bucket split (the heart of the new hierarchy)
  const buckets = useMemo(() => partitionByKind(allItems), [allItems]);

  // Top N active for the priority section (big cards)
  const activeTop = useMemo(
    () => buckets.active.slice(0, PRIORITY_TOP_N),
    [buckets.active],
  );
  const activeRest = useMemo(
    () => buckets.active.slice(PRIORITY_TOP_N),
    [buckets.active],
  );

  // Top N invites for the secondary section (compact cards)
  const inviteTop = useMemo(
    () => buckets.invites.slice(0, INVITE_PREVIEW_N),
    [buckets.invites],
  );
  const inviteRest = useMemo(
    () => buckets.invites.slice(INVITE_PREVIEW_N),
    [buckets.invites],
  );

  // Everything else (long tail) — for the bottom list
  const restLongTail = useMemo(
    () => [...activeRest, ...inviteRest, ...buckets.closed],
    [activeRest, inviteRest, buckets.closed],
  );

  // Filter applies across the long-tail list AND swaps the priority
  // section (when a filter is active, all sections collapse into the
  // filtered list to keep the page focused).
  const filtered = useMemo(() => {
    if (filter === "all") return null;
    const pred = FILTER_TO_URGENCY[filter];
    if (!pred) return null;
    return sortByPriority(allItems.filter(pred));
  }, [allItems, filter]);

  const isLoading = invitesLoading || activesLoading;
  const total = allItems.length;
  const totalActive = buckets.active.length;
  const totalInvites = buckets.invites.length;

  return (
    <main className="gigs-hub" aria-label="Gigs Mission Control">
      <header className="gigs-hub__hero">
        <Link href="/creator/work" className="hub-back">
          <ArrowLeft size={14} strokeWidth={2.25} />
          Work
        </Link>
        <div className="gigs-hub__title-row">
          <div>
            <h1 className="gigs-hub__title">Gigs</h1>
            <p className="gigs-hub__sub">
              Mission control · <strong>{totalActive} active</strong> ·{" "}
              {totalInvites} new invite{totalInvites === 1 ? "" : "s"} ·{" "}
              <span className="gigs-hub__refresh">
                <RefreshCw size={11} strokeWidth={2.25} />
                refreshed just now
              </span>
            </p>
          </div>
          <div className="gigs-hub__quick-links" aria-label="Detail surfaces">
            <Link href="/creator/gigs/active" className="gigs-hub__quick">
              <Briefcase size={12} strokeWidth={2.25} />
              Active
              <span>{totalActive}</span>
            </Link>
            <Link href="/creator/gigs/invites" className="gigs-hub__quick">
              <Inbox size={12} strokeWidth={2.25} />
              Invites
              <span>{totalInvites}</span>
            </Link>
            <Link href="/creator/gigs/history" className="gigs-hub__quick">
              <Archive size={12} strokeWidth={2.25} />
              History
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 1. Priority strip ─────────────────────────── */}
      <section className="gigs-hub__strip-wrap" aria-label="Priority overview">
        <PriorityStrip counts={counts} active={filter} onSelect={setFilter} />
      </section>

      {/* ── Filtered view (when a strip pill is selected) ─── */}
      {filter !== "all" && (
        <section className="gigs-hub__section" aria-label="Filtered gigs">
          <header className="gigs-hub__section-head">
            <p className="gigs-hub__section-eyebrow">
              Filtered · {filtered?.length ?? 0} match
            </p>
            <h2 className="gigs-hub__section-title">Matching gigs</h2>
          </header>
          {(filtered ?? []).length === 0 ? (
            <div className="gigs-hub__empty">
              <p>
                No gigs match this filter.
                <button
                  type="button"
                  className="gigs-hub__empty-clear"
                  onClick={() => setFilter("all")}
                >
                  Clear filter
                </button>
              </p>
            </div>
          ) : (
            <ul className="gigs-hub__list">
              {(filtered ?? []).map((it) => (
                <li key={it.gig.id}>
                  <GigCard item={it} variant="compact" />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── 2. ACTIVE WORK (top priority — what creator OWES) ── */}
      {filter === "all" && !isLoading && (
        <section className="gigs-hub__section" aria-label="Active work">
          <header className="gigs-hub__section-head">
            <p className="gigs-hub__section-eyebrow gigs-hub__section-eyebrow--active">
              <Briefcase size={11} strokeWidth={2.25} />
              Active work · {totalActive}
              {activeRest.length > 0 && (
                <span className="gigs-hub__section-tail">
                  · top {activeTop.length} shown
                </span>
              )}
            </p>
            <h2 className="gigs-hub__section-title">What you owe right now</h2>
          </header>
          {activeTop.length === 0 ? (
            <div className="gigs-hub__empty gigs-hub__empty--soft">
              <p>
                <strong>Nothing in flight.</strong> Pick up a new invite below
                to get rolling.
              </p>
            </div>
          ) : (
            <div className="gigs-hub__priority-stack">
              {activeTop.map((it) => (
                <GigCard key={it.gig.id} item={it} variant="priority" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── 3. NEW INVITES (secondary — opportunities) ─── */}
      {filter === "all" && !isLoading && totalInvites > 0 && (
        <section className="gigs-hub__section" aria-label="New invites">
          <header className="gigs-hub__section-head">
            <p className="gigs-hub__section-eyebrow gigs-hub__section-eyebrow--invites">
              <Inbox size={11} strokeWidth={2.25} />
              New invites · {totalInvites}
            </p>
            <div className="gigs-hub__section-titlerow">
              <h2 className="gigs-hub__section-title">Opportunities for you</h2>
              <Link href="/creator/gigs/invites" className="gigs-hub__see-all">
                Triage all →
              </Link>
            </div>
          </header>
          <ul className="gigs-hub__list">
            {inviteTop.map((it) => (
              <li key={it.gig.id}>
                <GigCard item={it} variant="compact" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 4. EVERYTHING ELSE (long tail) ─────────────── */}
      {filter === "all" && !isLoading && restLongTail.length > 0 && (
        <section className="gigs-hub__section" aria-label="Everything else">
          <header className="gigs-hub__section-head">
            <p className="gigs-hub__section-eyebrow">
              Everything else · {restLongTail.length}
            </p>
            <h2 className="gigs-hub__section-title">In flight + closed</h2>
          </header>
          <ul className="gigs-hub__list">
            {restLongTail.map((it) => (
              <li key={it.gig.id}>
                <GigCard item={it} variant="compact" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {isLoading && (
        <div className="gigs-hub__empty">
          <p>Loading your gigs…</p>
        </div>
      )}
    </main>
  );
}
