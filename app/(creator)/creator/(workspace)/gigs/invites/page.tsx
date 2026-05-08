"use client";

/* ============================================================
   /creator/gigs/invites — Invite triage. v2 (2026-05-08)

   Complete redesign. Modular components from components/creator/gigs.
   Clear flow: hub-back → hero → priority strip → filter row →
   InviteCard list (left) | preview pane (right).

   Every invite shows:
     · 7-stage tracker (always at Stage 1 — Invited)
     · StatusPill with live countdown
     · 98% Watch match score + hover-able "why?" reasons
     · 3-tier payout ladder (Guaranteed → Target → Stretch)
     · NextActionBar with Accept / Decline / View brief
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles, Inbox } from "lucide-react";
import { useInvites } from "@/lib/data/hooks";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
import type { Invite } from "@/lib/inbox/seed";
import { InviteCard } from "@/components/creator/gigs/InviteCard";
import {
  PriorityStrip,
  type ActiveFilter,
} from "@/components/creator/gigs/PriorityStrip";
import "@/components/creator/gigs/gig-modules.css";
import "./invites-v2.css";

type SortKind = "smart" | "newest" | "expiring" | "match";

const SIX_HOURS = 6 * 60 * 60 * 1000;

export default function InvitesPage() {
  // ── Data ────────────────────────────────────────────────
  const ws = useWorkspaceState();
  const {
    data: serverInvites,
    error,
    isLoading,
  } = useInvites({ status: "all" });
  if (error) throw error;

  const invites: Invite[] = useMemo(() => {
    if (!serverInvites) return ws.invites;
    const localById = new Map(ws.invites.map((i) => [i.id, i]));
    return serverInvites.map((s) => localById.get(s.id) ?? s);
  }, [serverInvites, ws.invites]);

  const now = useNow();
  const pending = invites.filter((i) => i.status === "pending");

  // ── UI state ────────────────────────────────────────────
  const [filter, setFilter] = useState<ActiveFilter>("all");
  const [sort, setSort] = useState<SortKind>("smart");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // ── KPI counts ──────────────────────────────────────────
  const counts = useMemo(() => {
    if (!now) {
      return {
        overdue: 0,
        today: 0,
        invites: pending.length,
        stuck: 0,
        live: 0,
        total: pending.length,
      };
    }
    const overdue = pending.filter((i) => i.expiresAt - now <= 0).length;
    const today = pending.filter((i) => {
      const d = i.expiresAt - now;
      return d > 0 && d < SIX_HOURS;
    }).length;
    return {
      overdue,
      today,
      invites: pending.length,
      stuck: 0,
      live: 0,
      total: pending.length,
    };
  }, [pending, now]);

  // ── Top-recommended (highest match score) ───────────────
  const topRecommendedId = useMemo(() => {
    const candidates = pending.filter((i) => i.matchScore >= 95);
    if (candidates.length === 0) return null;
    return candidates.reduce((best, c) =>
      c.matchScore > best.matchScore ? c : best,
    ).id;
  }, [pending]);

  // ── Filtering + sorting ─────────────────────────────────
  const visible = useMemo(() => {
    let list = pending;

    if (filter === "overdue" && now)
      list = list.filter((i) => i.expiresAt - now <= 0);
    else if (filter === "today" && now)
      list = list.filter((i) => {
        const d = i.expiresAt - now;
        return d > 0 && d < SIX_HOURS;
      });
    else if (filter === "invites") list = pending;
    else if (filter === "stuck") list = [];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.brand.toLowerCase().includes(q) ||
          i.campaign.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      );
    }

    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "expiring":
          return a.expiresAt - b.expiresAt;
        case "newest":
          return b.expiresAt - a.expiresAt;
        case "match":
          return b.matchScore - a.matchScore;
        case "smart":
        default: {
          // Smart: urgent first (under 6h), then high-match, then by expiry asc
          const aUrgent = now ? a.expiresAt - now < SIX_HOURS : false;
          const bUrgent = now ? b.expiresAt - now < SIX_HOURS : false;
          if (aUrgent !== bUrgent) return aUrgent ? -1 : 1;
          if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
          return a.expiresAt - b.expiresAt;
        }
      }
    });
    return sorted;
  }, [pending, filter, query, sort, now]);

  const activeInvite =
    visible.find((i) => i.id === activeId) ?? visible[0] ?? null;

  // ── Handlers ────────────────────────────────────────────
  const handleAccept = (id: string) => {
    ws.acceptInvite(id);
  };
  const handleDecline = (id: string) => {
    ws.declineInvite(id);
  };

  return (
    <main className="invs" aria-label="Invites">
      {/* ── Hero ───────────────────────────────────── */}
      <header className="invs__hero">
        <Link href="/creator/gigs" className="hub-back">
          <ArrowLeft size={14} strokeWidth={2.25} />
          Gigs
        </Link>
        <div className="invs__hero-row">
          <div>
            <h1 className="invs__title">Invites</h1>
            <p className="invs__sub">
              {pending.length} open · {counts.today} urgent (next 6h) ·{" "}
              {pending.filter((i) => i.matchScore >= 90).length} high-match ·
              refreshed just now
            </p>
          </div>
        </div>
      </header>

      {/* ── Priority Strip ─────────────────────────── */}
      <section className="invs__strip-wrap">
        <PriorityStrip counts={counts} active={filter} onSelect={setFilter} />
      </section>

      {/* ── Filter + sort + search ─────────────────── */}
      <section className="invs__toolbar">
        <label className="invs__search">
          <Search size={14} strokeWidth={2.25} />
          <input
            type="search"
            placeholder="Find a brand, campaign, or category"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search invites"
          />
        </label>
        <div className="invs__sort" role="tablist" aria-label="Sort">
          {(["smart", "expiring", "match", "newest"] as SortKind[]).map((s) => (
            <button
              key={s}
              role="tab"
              type="button"
              aria-selected={sort === s}
              className={"invs__sort-btn" + (sort === s ? " is-active" : "")}
              onClick={() => setSort(s)}
            >
              {s === "smart"
                ? "Smart"
                : s === "expiring"
                  ? "Expiring"
                  : s === "match"
                    ? "Top match"
                    : "Newest"}
            </button>
          ))}
        </div>
      </section>

      {/* ── Two-col: list + preview ────────────────── */}
      <section className="invs__board">
        <ol className="invs__list" aria-label="Invite list">
          {isLoading && pending.length === 0 && (
            <li className="invs__empty">
              <Inbox size={20} strokeWidth={1.75} />
              <p>Loading invites…</p>
            </li>
          )}
          {!isLoading && visible.length === 0 && (
            <li className="invs__empty">
              <Inbox size={20} strokeWidth={1.75} />
              <p>
                {pending.length === 0
                  ? "No invites yet — keep your profile sharp and they'll come."
                  : "No invites match this filter."}
              </p>
              {filter !== "all" && (
                <button
                  type="button"
                  className="gigs-next__btn gigs-next__btn--ghost"
                  onClick={() => setFilter("all")}
                >
                  Clear filter
                </button>
              )}
            </li>
          )}
          {visible.map((invite) => (
            <li key={invite.id}>
              <InviteCard
                invite={invite}
                isRecommended={invite.id === topRecommendedId}
                isActive={invite.id === activeInvite?.id}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onSelect={(id) => setActiveId(id)}
              />
            </li>
          ))}
        </ol>

        {/* ── Preview pane ────────────────────────── */}
        <aside className="invs__preview" aria-label="Invite preview">
          {activeInvite ? (
            <article className="invs__preview-card">
              <header className="invs__preview-head">
                <p className="invs__preview-eyebrow">
                  <Sparkles size={11} strokeWidth={2.5} />
                  Brief preview
                </p>
                <h2 className="invs__preview-title">{activeInvite.brand}</h2>
                <p className="invs__preview-campaign">
                  {activeInvite.campaign}
                </p>
              </header>

              <dl className="invs__preview-meta">
                <div>
                  <dt>Category</dt>
                  <dd>{activeInvite.category}</dd>
                </div>
                <div>
                  <dt>Shoot window</dt>
                  <dd>{activeInvite.shootWindow}</dd>
                </div>
                <div>
                  <dt>QR pickup</dt>
                  <dd>{activeInvite.qrPickupAddr}</dd>
                </div>
              </dl>

              <p className="invs__preview-brief">{activeInvite.brief}</p>

              <Link
                href={activeInvite.briefHref}
                className="gigs-next__btn gigs-next__btn--primary invs__preview-cta"
              >
                Open full brief →
              </Link>
            </article>
          ) : (
            <div className="invs__preview-empty">
              <Inbox size={28} strokeWidth={1.5} />
              <p className="invs__preview-empty-title">
                Pick an invite to preview.
              </p>
              <p className="invs__preview-empty-sub">
                Tap any card on the left to see the full brief, payout ladder,
                and why-it-matches breakdown.
              </p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
