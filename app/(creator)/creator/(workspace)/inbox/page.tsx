"use client";

/* ============================================================
   Inbox Hub — /creator/inbox (NOW view)
   Authority: Audit §五.4 — Hub 重做为"今日要做的事"
   Role: Replace the redundant 3-card snapshot with a unified
   urgency-ranked feed pulling from invites + messages +
   system. Answer the one question creator opens inbox to ask:
   "what do I need to do today?"
   ============================================================ */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  deriveNowItems,
  avatarBg as sharedAvatarBg,
  type NowSource,
  type NowItem,
} from "@/lib/inbox/seed";
import { useInboxState } from "@/lib/inbox/state";
import { PaneHeader, PaneSubCount, EmptyState } from "@/lib/workspace/chrome";
import "./inbox.css";

/* The Now feed is DERIVED from live context state — Accept an
   invite, mark a notification read, send a brand reply: the feed
   reorders/disappears here in real time. No parallel mock. */

/* ── Bucket: Right now (<6h) / Today (<24h) / This week (<7d) ── */

type BucketKey = "now" | "today" | "week";

function bucketOf(ms: number): BucketKey {
  if (ms < 6 * 60 * 60 * 1000) return "now";
  if (ms < 24 * 60 * 60 * 1000) return "today";
  return "week";
}

const BUCKETS: { key: BucketKey; title: string; sub: string }[] = [
  { key: "now", title: "Right now", sub: "next 6 hours" },
  { key: "today", title: "Today", sub: "before tomorrow" },
  { key: "week", title: "This week", sub: "lower urgency" },
];

/* Source → tag / dot color (matches System category palette) */
const SOURCE_TAG: Record<
  NowSource,
  {
    label: string;
    dot: string;
    intent: "alert" | "compliance" | "money" | "updates";
  }
> = {
  invite: { label: "INVITE", dot: "#93c5fd", intent: "updates" },
  message: { label: "REPLY", dot: "var(--ink)", intent: "updates" },
  system: { label: "DEADLINE", dot: "var(--brand-red)", intent: "alert" },
  compliance: { label: "FTC", dot: "var(--ga-orange)", intent: "compliance" },
};

const avatarBg = (initial?: string) => sharedAvatarBg(initial);

function urgencyLabel(ms: number) {
  if (ms <= 0) return "expired";
  const hrs = Math.floor(ms / (60 * 60 * 1000));
  if (hrs >= 24) return `${Math.floor(hrs / 24)}d left`;
  if (hrs >= 1) {
    const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hrs}h ${m}m`;
  }
  return `${Math.floor(ms / (60 * 1000))}m`;
}

/* ── Page ─────────────────────────────────────────────────── */

export default function InboxHubPage() {
  // Live ticker so urgency labels stay accurate
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const { invites, threads, notifications } = useInboxState();
  const items = useMemo(
    () => deriveNowItems({ invites, threads, notifications }),
    [invites, threads, notifications],
  );
  // deriveNowItems already sorts by urgencyMs ascending.
  const sorted = items;

  const grouped = useMemo(() => {
    const out: Record<BucketKey, NowItem[]> = { now: [], today: [], week: [] };
    for (const it of sorted) out[bucketOf(it.urgencyMs)].push(it);
    return out;
  }, [sorted]);

  const nowCount = grouped.now.length;
  const todayCount = grouped.today.length;
  const totalActionable = nowCount + todayCount;

  // Keyboard: J/K cycles items, 1/2/3 jumps to tabs
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t?.tagName === "INPUT" ||
        t?.tagName === "TEXTAREA" ||
        t?.isContentEditable
      )
        return;
      if (e.metaKey || e.ctrlKey) return;
      const map: Record<string, string> = {
        "1": "/creator/inbox/messages",
        "2": "/creator/inbox/invites",
        "3": "/creator/inbox/system",
      };
      if (map[e.key]) {
        e.preventDefault();
        window.location.assign(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      className="ib-content ib-now ib-now-pane"
      data-lenis-prevent
      aria-labelledby="ib-now-heading"
    >
      <PaneHeader
        title="Now"
        sub={
          totalActionable === 0 ? (
            <strong>All clear · nothing needs you today</strong>
          ) : (
            <>
              <PaneSubCount
                count={totalActionable}
                label={
                  totalActionable === 1
                    ? "thing on your plate"
                    : "things on your plate"
                }
              />
              {nowCount > 0 && <> · {nowCount} in next 6h</>}
            </>
          )
        }
      />

      {/* Buckets — each shows urgency band + count */}
      <div className="ib-now-buckets" data-tick={tick}>
        {BUCKETS.map((b) => {
          const list = grouped[b.key];
          if (list.length === 0) return null;

          return (
            <div
              key={b.key}
              className={`ib-now-bucket ib-now-bucket--${b.key}`}
            >
              <div className="ib-now-bucket-head">
                <h3 className="ib-now-bucket-title">{b.title}</h3>
                <span className="ib-now-bucket-sub">{b.sub}</span>
                <span className="ib-now-bucket-count">{list.length}</span>
                <span className="ib-now-bucket-line" aria-hidden />
              </div>

              <ul className="ib-now-list" role="list">
                {list.map((it) => {
                  const tag = SOURCE_TAG[it.source];
                  return (
                    <li key={it.id}>
                      <Link
                        href={it.href}
                        className={`ib-now-row ib-now-row--${tag.intent}`}
                        aria-label={`${it.title} — ${it.cta}`}
                      >
                        <span
                          className="ib-now-row-avatar"
                          aria-hidden
                          style={{ background: avatarBg(it.brandInitial) }}
                        >
                          {it.brandInitial ?? "·"}
                        </span>

                        <div className="ib-now-row-body">
                          <div className="ib-now-row-meta">
                            <span
                              className="ib-now-row-tag-dot"
                              aria-hidden
                              style={{ background: tag.dot }}
                            />
                            <span className="ib-now-row-tag">{tag.label}</span>
                            <span className="ib-now-row-sep" aria-hidden>
                              ·
                            </span>
                            <span className="ib-now-row-urgency">
                              {urgencyLabel(it.urgencyMs)}
                            </span>
                            {it.payoutHint && (
                              <>
                                <span className="ib-now-row-sep" aria-hidden>
                                  ·
                                </span>
                                <span className="ib-now-row-payout">
                                  {it.payoutHint}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="ib-now-row-title">{it.title}</p>
                          <p className="ib-now-row-body-text">{it.body}</p>
                        </div>

                        <span className="ib-now-row-cta" aria-hidden>
                          {it.cta} →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {totalActionable === 0 && (
          <div className="ib-now-empty">
            <p className="ib-now-empty-title">
              No deadlines, no pending replies.
            </p>
            <p className="ib-now-empty-body">
              Nothing on your plate right now — but{" "}
              <Link href="/creator/discover">3 new campaigns within 1mi</Link>{" "}
              are accepting applications.
            </p>
          </div>
        )}
      </div>

      {/* Footer hint — honest about what this view IS */}
      <p className="ib-now-foot">
        <span className="ib-now-foot-italic">Now ·</span>
        <span className="ib-now-foot-mono">
          merged from invites + messages + system. press <kbd>1</kbd> messages ·{" "}
          <kbd>2</kbd> invites · <kbd>3</kbd> system.
        </span>
      </p>
    </section>
  );
}
