"use client";

/* ============================================================
   /creator/work/drafts — Content WIP. v1 (2026-05-08)

   Drafts are the creator's WORK-IN-PROGRESS content (uploaded
   media, captions, disclosures) that haven't been posted yet.
   Distinct from /creator/gigs/invites (those are merchant
   offers); these are the creator's own files.

   Layout:
     - Hero
     - 3-up KPI ribbon: total drafts, due-soon, ready-to-post
     - Filter chips: All · Due 24h · Ready · Held
     - Card grid (one per draft) with: campaign, due date,
       progress (frames/captions/disclosure), CTA "Continue"
   ============================================================ */

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileEdit,
  Tag,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import "./drafts.css";

interface Draft {
  id: string;
  campaignId: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  dueAt: string; // ISO
  daysUntilDue: number;
  status: "ready" | "in-progress" | "held";
  /** Checklist items: 3 frames captured, caption written, disclosure added */
  checklist: { key: string; label: string; done: boolean }[];
}

const DRAFTS: Draft[] = [
  {
    id: "d1",
    campaignId: "devocion-cold-brew",
    brand: "Devoción",
    brandInitial: "D",
    campaign: "Cold Brew Summer",
    dueAt: "2026-05-09",
    daysUntilDue: 1,
    status: "in-progress",
    checklist: [
      { key: "frames", label: "3 frames captured", done: true },
      { key: "caption", label: "Caption written", done: true },
      { key: "disclosure", label: "FTC disclosure added", done: false },
      { key: "qr", label: "QR overlay placed", done: false },
    ],
  },
  {
    id: "d2",
    campaignId: "brow-theory",
    brand: "Brow Theory",
    brandInitial: "B",
    campaign: "Spring Beauty Campaign",
    dueAt: "2026-05-10",
    daysUntilDue: 2,
    status: "ready",
    checklist: [
      { key: "frames", label: "3 frames captured", done: true },
      { key: "caption", label: "Caption written", done: true },
      { key: "disclosure", label: "FTC disclosure added", done: true },
      { key: "qr", label: "QR overlay placed", done: true },
    ],
  },
  {
    id: "d3",
    campaignId: "sunday-brunch",
    brand: "Sunday in Brooklyn",
    brandInitial: "S",
    campaign: "Weekend Brunch Push",
    dueAt: "2026-05-12",
    daysUntilDue: 4,
    status: "in-progress",
    checklist: [
      { key: "frames", label: "3 frames captured", done: true },
      { key: "caption", label: "Caption written", done: false },
      { key: "disclosure", label: "FTC disclosure added", done: false },
      { key: "qr", label: "QR overlay placed", done: false },
    ],
  },
  {
    id: "d4",
    campaignId: "fort-greene",
    brand: "Fort Greene Coffee",
    brandInitial: "F",
    campaign: "Morning Ritual Series",
    dueAt: "2026-05-13",
    daysUntilDue: 5,
    status: "held",
    checklist: [
      { key: "frames", label: "3 frames captured", done: false },
      { key: "caption", label: "Caption written", done: false },
      { key: "disclosure", label: "FTC disclosure added", done: false },
      { key: "qr", label: "QR overlay placed", done: false },
    ],
  },
];

type Filter = "all" | "due-soon" | "ready" | "held";

const STATUS_LABEL: Record<Draft["status"], string> = {
  ready: "Ready to post",
  "in-progress": "In progress",
  held: "Held",
};

export default function DraftsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = {
    all: DRAFTS.length,
    "due-soon": DRAFTS.filter((d) => d.daysUntilDue <= 1).length,
    ready: DRAFTS.filter((d) => d.status === "ready").length,
    held: DRAFTS.filter((d) => d.status === "held").length,
  };

  const visible = useMemo(() => {
    let list = DRAFTS;
    if (filter === "due-soon") list = list.filter((d) => d.daysUntilDue <= 1);
    else if (filter === "ready")
      list = list.filter((d) => d.status === "ready");
    else if (filter === "held") list = list.filter((d) => d.status === "held");
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) =>
          d.brand.toLowerCase().includes(q) ||
          d.campaign.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, query]);

  return (
    <main className="dft" aria-label="Content drafts">
      <header className="dft__hero">
        <Link href="/creator/work" className="hub-back">
          <ArrowLeft size={14} strokeWidth={2.25} />
          Work
        </Link>
        <div className="dft__hero-row">
          <div>
            <h1 className="dft__title">Drafts</h1>
            <p className="dft__sub">
              <strong>{counts.all}</strong> WIP · {counts["due-soon"]} due in
              24h · {counts.ready} ready to post
            </p>
          </div>
        </div>
      </header>

      {/* ── KPI ribbon ─────────────────────────────────── */}
      <section className="dft__kpis" aria-label="Drafts overview">
        <article className="dft__kpi dft__kpi--ink">
          <FileEdit size={16} strokeWidth={2.25} className="dft__kpi-icon" />
          <span className="dft__kpi-num">{counts.all}</span>
          <span className="dft__kpi-lbl">
            All drafts
            <span className="dft__kpi-sub">in progress</span>
          </span>
        </article>
        <article className="dft__kpi dft__kpi--orange">
          <Clock size={16} strokeWidth={2.25} className="dft__kpi-icon" />
          <span className="dft__kpi-num">{counts["due-soon"]}</span>
          <span className="dft__kpi-lbl">
            Due 24h
            <span className="dft__kpi-sub">action needed</span>
          </span>
        </article>
        <article className="dft__kpi dft__kpi--green">
          <CheckCircle2
            size={16}
            strokeWidth={2.25}
            className="dft__kpi-icon"
          />
          <span className="dft__kpi-num">{counts.ready}</span>
          <span className="dft__kpi-lbl">
            Ready
            <span className="dft__kpi-sub">post now</span>
          </span>
        </article>
        <article className="dft__kpi dft__kpi--gold">
          <Tag size={16} strokeWidth={2.25} className="dft__kpi-icon" />
          <span className="dft__kpi-num">{counts.held}</span>
          <span className="dft__kpi-lbl">
            Held
            <span className="dft__kpi-sub">awaiting input</span>
          </span>
        </article>
      </section>

      {/* ── Filter + search ────────────────────────────── */}
      <section className="dft__toolbar">
        <div className="dft__filters" role="tablist" aria-label="Filter">
          {(
            [
              { key: "all", label: "All" },
              { key: "due-soon", label: "Due 24h" },
              { key: "ready", label: "Ready" },
              { key: "held", label: "Held" },
            ] as { key: Filter; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              role="tab"
              type="button"
              aria-selected={filter === f.key}
              className={
                "dft__filter-btn" + (filter === f.key ? " is-active" : "")
              }
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="dft__filter-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <label className="dft__search">
          <Search size={14} strokeWidth={2.25} />
          <input
            type="search"
            placeholder="Search brand or campaign"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search drafts"
          />
        </label>
      </section>

      {/* ── Cards grid ─────────────────────────────────── */}
      {visible.length === 0 ? (
        <div className="dft__empty">
          <FileEdit size={20} strokeWidth={1.75} />
          <p>
            No drafts match this filter.
            {(filter !== "all" || query) && (
              <button
                type="button"
                className="dft__empty-clear"
                onClick={() => {
                  setFilter("all");
                  setQuery("");
                }}
              >
                Clear
              </button>
            )}
          </p>
        </div>
      ) : (
        <div className="dft__grid">
          {visible.map((d) => {
            const done = d.checklist.filter((c) => c.done).length;
            const total = d.checklist.length;
            const pct = Math.round((done / total) * 100);
            const ready = pct === 100;
            return (
              <article
                key={d.id}
                className={"dft__card dft__card--" + d.status}
              >
                <header className="dft__card-head">
                  <span className="dft__card-avatar">{d.brandInitial}</span>
                  <div className="dft__card-title-block">
                    <h3 className="dft__card-brand">{d.brand}</h3>
                    <p className="dft__card-campaign">{d.campaign}</p>
                  </div>
                  <span
                    className={`dft__card-status dft__card-status--${d.status}`}
                  >
                    {STATUS_LABEL[d.status]}
                  </span>
                </header>

                <p className="dft__card-due">
                  <Clock size={11} strokeWidth={2.25} />
                  Due in <strong>{d.daysUntilDue}d</strong>
                </p>

                {/* Progress bar */}
                <div className="dft__progress">
                  <div className="dft__progress-track">
                    <div
                      className={
                        "dft__progress-fill" +
                        (ready ? " dft__progress-fill--full" : "")
                      }
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="dft__progress-meta">
                    <strong>{done}</strong> / {total} ·{" "}
                    {ready ? "complete" : `${total - done} to go`}
                  </span>
                </div>

                {/* Checklist */}
                <ul className="dft__checklist">
                  {d.checklist.map((c) => (
                    <li
                      key={c.key}
                      className={
                        "dft__check" + (c.done ? " is-done" : " is-todo")
                      }
                    >
                      <span className="dft__check-icon">
                        {c.done ? (
                          <CheckCircle2 size={13} strokeWidth={2.5} />
                        ) : (
                          <span className="dft__check-empty" aria-hidden />
                        )}
                      </span>
                      {c.label}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/creator/campaigns/${d.campaignId}`}
                  className={
                    "dft__card-cta" + (ready ? " dft__card-cta--ready" : "")
                  }
                >
                  {ready ? "Post now →" : "Continue editing →"}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
