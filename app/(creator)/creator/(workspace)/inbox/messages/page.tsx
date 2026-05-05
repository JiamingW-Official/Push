"use client";

/* ============================================================
   Messages — v11 iMessage Two-Pane Layout
   Authority: Design.md § 0 STRUCTURED · § 9 (Filled Secondary
   N2W Blue for outgoing) · § 6 (negative-space tokens) ·
   § 4.3 (radii)
   Layout: thread list (left, 360px) + active conversation
   pane (right, flex-1) with bubbles + composer. Replaces the
   old "single column → click to navigate" pattern.
   ============================================================ */

import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
} from "react";
import { timeAgo } from "@/lib/notifications/useNotifications";
import {
  avatarBg,
  type Thread,
  type Message,
  type AttributionStatus,
  type MessageRole,
} from "@/lib/inbox/seed";
import { useInboxState } from "@/lib/inbox/state";
import Link from "next/link";
import {
  PaneHeader,
  PaneSubCount,
  EmptyState,
  FilterChips,
} from "@/lib/inbox/components";
import "../inbox.css";
import "./messages.css";

/* ── Page-local types ────────────────────────────────────────── */

type FilterKey = "all" | "unread" | "needs-reply";

const ROLE_LABEL: Record<MessageRole, string> = {
  merchant: "BRAND",
};

const GROUP_ORDER: Thread["group"][] = ["TODAY", "THIS WEEK", "EARLIER"];

/* ── Format a bubble timestamp like "Mon, Apr 27 at 13:18" ──── */
function formatBubbleStamp(iso: string) {
  const d = new Date(iso);
  const wd = d.toLocaleDateString(undefined, { weekday: "short" });
  const md = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const hm = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${wd}, ${md} at ${hm}`;
}

/* Group consecutive messages from the same sender — for tail trim */
type GroupedMsg = Message & {
  position: "single" | "top" | "mid" | "bottom";
  showStamp: boolean;
};
function groupMessages(msgs: Message[]): GroupedMsg[] {
  const out: GroupedMsg[] = [];
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];
    const prev = msgs[i - 1];
    const next = msgs[i + 1];
    const samePrev =
      prev &&
      prev.from === m.from &&
      new Date(m.at).getTime() - new Date(prev.at).getTime() < 5 * 60_000;
    const sameNext =
      next &&
      next.from === m.from &&
      new Date(next.at).getTime() - new Date(m.at).getTime() < 5 * 60_000;

    let position: GroupedMsg["position"];
    if (!samePrev && !sameNext) position = "single";
    else if (!samePrev && sameNext) position = "top";
    else if (samePrev && sameNext) position = "mid";
    else position = "bottom";

    // Show stamp at the start of every new sender-block, or every ~30 min gap
    const gap = prev
      ? new Date(m.at).getTime() - new Date(prev.at).getTime()
      : Infinity;
    const showStamp = !samePrev || gap > 30 * 60_000;

    out.push({ ...m, position, showStamp });
  }
  return out;
}

/* ── Icons ────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 10L13 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11 2.5l2.5 2.5L5 13.5H2.5V11L11 2.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 4.5C3 3.7 3.7 3 4.5 3h1.7c.4 0 .7.3.8.6L7.6 5c.1.3 0 .6-.2.8L6.4 6.7c.7 1.4 1.9 2.6 3.3 3.3l1-1c.2-.2.5-.3.8-.2l1.4.6c.3.1.6.4.6.8v1.7c0 .8-.7 1.5-1.5 1.5C7 13.4 3 9.4 3 4.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 7v4M8 5h.01"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 7l10-5-3.5 5L12 12 2 7z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M9 3L5 7l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.8l1.85 3.95 4.35.45-3.25 2.95.95 4.25L8 11.4l-3.9 2 .95-4.25L1.8 6.2l4.35-.45L8 1.8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

/* ── Attribution banner ─────────────────────────────────────
   Real agentic affordance — surfaces verified-scan progress
   and current/max payout for the campaign this conversation
   belongs to, so the creator can answer "how's it going?"
   without flipping to /campaigns. */

function AttributionBanner({
  campaign,
  attr,
}: {
  campaign: string;
  attr: AttributionStatus;
}) {
  const pct = Math.min(
    100,
    Math.round((attr.scansVerified / Math.max(1, attr.scansTarget)) * 100),
  );
  /* Deadline relative-time depends on Date.now() — defer to after
     hydration so SSR and client first paint match. */
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  const dl = new Date(attr.deadlineISO);
  const dlMs = now == null ? 0 : dl.getTime() - now;
  const dlDays = Math.round(dlMs / (24 * 60 * 60 * 1000));
  const dlLabel =
    now == null
      ? ""
      : dlMs <= 0
        ? "Deadline passed"
        : dlDays === 0
          ? "Due today"
          : `${dlDays}d to deadline`;
  const isComplete = attr.scansVerified >= attr.scansTarget;
  const isUrgent = now != null && dlMs > 0 && dlDays <= 2 && !isComplete;

  return (
    <div
      className={`msg-attr-banner${isComplete ? " is-complete" : ""}${isUrgent ? " is-urgent" : ""}`}
      aria-label={`Attribution status for ${campaign}`}
    >
      <div className="msg-attr-row">
        <span className="msg-attr-eyebrow">(ATTRIBUTION) · {campaign}</span>
        <span className="msg-attr-deadline" suppressHydrationWarning>
          {dlLabel}
        </span>
      </div>
      <div className="msg-attr-stats">
        <div className="msg-attr-stat">
          <span className="msg-attr-stat-num">
            {attr.scansVerified}
            <span className="msg-attr-stat-of">/ {attr.scansTarget}</span>
          </span>
          <span className="msg-attr-stat-label">verified scans</span>
        </div>
        <div className="msg-attr-stat">
          <span className="msg-attr-stat-num">
            ${attr.estPayout}
            <span className="msg-attr-stat-of">/ ${attr.maxPayout}</span>
          </span>
          <span className="msg-attr-stat-label">earned · max</span>
        </div>
      </div>
      <div className="msg-attr-bar" role="presentation">
        <span className="msg-attr-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {isUrgent && pct < 50 && (
        <p className="msg-attr-action">
          {attr.scansTarget - attr.scansVerified} more scans needed in{" "}
          {dlDays === 0 ? "< 1" : dlDays}d — post today to stay on track.
        </p>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export default function InboxMessagesPage() {
  /* Threads + thread mutations come from shared context now —
     mark-read, star toggle, send all propagate to the segmented
     nav badge + Hub Now view in real time. */
  const { threads, markThreadRead, toggleStar, sendMessage, notifications } =
    useInboxState();

  const [activeId, setActiveId] = useState<string | null>(
    threads[0]?.id ?? null,
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [composer, setComposer] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [draftChipUsed, setDraftChipUsed] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Auto-dismiss the small inline toast after 3s */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* Reset draft chips when the active thread changes */
  useEffect(() => {
    setDraftChipUsed(false);
  }, [activeId]);

  /* Phone button — voice calls aren't shipped yet, but the button
     reads honest copy + announces to screen readers. */
  const handleCall = useCallback(() => {
    setToast("Voice calls launching Q3 — message for now");
  }, []);

  /* Attach button — opens a real file picker. The selected file
     becomes a placeholder reference in the composer so the demo
     reads as "attachment queued for next send". */
  const handleAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setComposer((prev) => (prev ? `${prev} [📎 ${f.name}]` : `[📎 ${f.name}]`));
    setToast(`Attached ${f.name}`);
    composerRef.current?.focus();
    e.target.value = ""; // allow re-pick same file
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      setActiveId(id);
      markThreadRead(id);
    },
    [markThreadRead],
  );

  const needsReplyCount = useMemo(() => {
    const now = Date.now();
    return threads.filter((t) => {
      if (t.campaign === null) return false;
      const lastMsg = t.messages[t.messages.length - 1];
      if (!lastMsg || lastMsg.from !== "other") return false;
      return (
        t.unread || now - new Date(lastMsg.at).getTime() > 12 * 60 * 60 * 1000
      );
    }).length;
  }, [threads]);

  const filtered = useMemo(() => {
    let result = threads;
    if (filter === "unread") result = result.filter((t) => t.unread);
    else if (filter === "needs-reply") {
      const now = Date.now();
      result = result.filter((t) => {
        if (t.campaign === null) return false;
        const lastMsg = t.messages[t.messages.length - 1];
        if (!lastMsg || lastMsg.from !== "other") return false;
        return (
          t.unread || now - new Date(lastMsg.at).getTime() > 12 * 60 * 60 * 1000
        );
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.sender.toLowerCase().includes(q) ||
          t.preview.toLowerCase().includes(q),
      );
    }
    return result;
  }, [threads, filter, query]);

  const grouped = useMemo(() => {
    /* Starred threads bubble to the top in their own group,
       regardless of recency — audit P2 anchor pattern. */
    const starredThreads = filtered.filter((t) => t.starred);
    const dateGroups = GROUP_ORDER.map((label) => ({
      label,
      threads: filtered.filter((t) => t.group === label && !t.starred),
    })).filter((g) => g.threads.length > 0);

    return starredThreads.length > 0
      ? [{ label: "STARRED" as const, threads: starredThreads }, ...dateGroups]
      : dateGroups;
  }, [filtered]);

  const unreadCount = threads.filter((t) => t.unread).length;
  const active = useMemo(
    () => threads.find((t) => t.id === activeId) ?? null,
    [threads, activeId],
  );

  /* Rule-based draft reply chips — derived from last merchant message
     + campaign attribution state. No LLM, no theater. */
  const draftChips = useMemo<string[]>(() => {
    if (!active) return [];
    const last = active.messages[active.messages.length - 1];
    if (!last || last.from !== "other") return [];
    const chips: string[] = [];
    const text = last.text.toLowerCase();
    if (text.includes("?")) {
      chips.push("Sounds good — what time works for you?");
      chips.push("Sure! Planning to shoot this week.");
    }
    if (active.attribution) {
      const dlMs =
        new Date(active.attribution.deadlineISO).getTime() - Date.now();
      const dlDays = Math.round(dlMs / (24 * 60 * 60 * 1000));
      const behind =
        active.attribution.scansVerified < active.attribution.scansTarget;
      if (dlDays <= 2 && behind)
        chips.push("On it — shooting today to hit the target.");
      else if (active.attribution.scansVerified === 0)
        chips.push("Got it — picking up the QR and shooting this week.");
    }
    if (chips.length === 0) chips.push("Got it, thanks!");
    return chips.slice(0, 3);
  }, [active]);

  /* Check for an unsigned FTC disclosure on this thread's brand.
     Returns the sign href so the banner can link directly. */
  const hasPendingDisclosure = useMemo<string | null>(() => {
    if (!active?.campaign) return null;
    const senderFirst = active.sender.split(" ")[0].toLowerCase();
    const notif = notifications.find(
      (n) =>
        n.category === "compliance" &&
        !n.read &&
        n.title.toLowerCase().includes(senderFirst),
    );
    return notif?.nextAction?.href ?? notif?.href ?? null;
  }, [active, notifications]);

  const groupedMessages = useMemo(
    () => (active ? groupMessages(active.messages) : []),
    [active],
  );

  /* Auto-scroll to bottom of thread when active changes or new msg arrives */
  useLayoutEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [activeId, active?.messages.length]);

  /* "/" focuses composer; Esc clears search; J/K cycles list */
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTyping) return;

      if (filtered.length === 0) return;
      const idx = filtered.findIndex((t) => t.id === activeId);
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = filtered[Math.min(filtered.length - 1, idx + 1)];
        if (next) handleSelect(next.id);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = filtered[Math.max(0, idx - 1)];
        if (prev) handleSelect(prev.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered, activeId, handleSelect]);

  const handleSend = useCallback(() => {
    const text = composer.trim();
    if (!text || !activeId) return;
    sendMessage(activeId, text);
    setComposer("");
    composerRef.current?.focus();
  }, [composer, activeId, sendMessage]);

  const handleComposerKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section
      className={`ib-content msg-pane-layout${active ? " has-active" : ""}`}
      aria-label="Messages"
    >
      {/* ── Left pane: thread list ─────────────────────────── */}
      <aside className="msg-list-pane" aria-label="Conversations">
        <header className="msg-list-pane-header">
          <PaneHeader
            flush
            title="Messages"
            sub={
              unreadCount > 0 ? (
                <PaneSubCount count={unreadCount} label="unread" />
              ) : (
                <strong>All read</strong>
              )
            }
            actions={
              <button
                type="button"
                className="ib-icon-btn"
                aria-label="New conversation"
                title="New conversation"
              >
                <PencilIcon />
              </button>
            }
          />

          <label className="msg-list-search">
            <span className="msg-list-search-icon" aria-hidden>
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search conversations"
            />
          </label>

          <FilterChips
            ariaLabel="Filter conversations"
            active={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", hideCount: true },
              { value: "unread", label: "Unread", count: unreadCount },
              {
                value: "needs-reply",
                label: "Needs reply",
                count: needsReplyCount,
              },
            ]}
          />
        </header>

        <div className="msg-list-body" data-lenis-prevent>
          {grouped.length === 0 ? (
            <EmptyState
              title={query ? "No matches." : "Quiet for now."}
              body={
                query
                  ? `Nothing matches "${query}".`
                  : "New brand replies will land here."
              }
            />
          ) : (
            grouped.map((g) => (
              <div key={g.label}>
                <p className="msg-list-section-label">{g.label}</p>
                {g.threads.map((t) => {
                  const isActive = t.id === activeId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelect(t.id)}
                      aria-pressed={isActive}
                      className={[
                        "msg-list-row",
                        isActive ? "is-active" : "",
                        t.unread ? "is-unread" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {t.unread && (
                        <span className="msg-list-unread-dot" aria-hidden />
                      )}
                      <span
                        className="msg-list-avatar"
                        style={{ background: avatarBg(t.initial) }}
                        aria-hidden
                      >
                        {t.initial}
                        {t.online && (
                          <span
                            className="msg-list-avatar-online"
                            aria-hidden
                          />
                        )}
                      </span>
                      <span className="msg-list-row-body">
                        <span className="msg-list-row-top">
                          <span className="msg-list-row-name">
                            {t.starred && (
                              <span
                                className="msg-list-row-star"
                                aria-label="Starred"
                              >
                                ★
                              </span>
                            )}
                            {t.sender}
                          </span>
                          <span
                            className="msg-list-row-time"
                            suppressHydrationWarning
                          >
                            {timeAgo(t.createdAt)}
                          </span>
                        </span>
                        <span className="msg-list-row-preview">
                          {t.preview}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── Right pane: active conversation ───────────────── */}
      <section className="msg-thread-pane" aria-label="Conversation">
        {!active ? (
          <div className="msg-thread-empty">
            <span className="msg-thread-empty-icon" aria-hidden>
              <SearchIcon />
            </span>
            <h3 className="msg-thread-empty-title">Pick a conversation.</h3>
            <p className="msg-thread-empty-body">
              Tap any thread on the left to read it here. Use J / K to cycle.
            </p>
          </div>
        ) : (
          <>
            <header className="msg-thread-header">
              <button
                type="button"
                className="msg-thread-back-btn"
                onClick={() => setActiveId(null)}
                aria-label="Back to list"
              >
                <ChevronLeft />
              </button>
              <span
                className="msg-thread-header-avatar"
                style={{ background: avatarBg(active.initial) }}
                aria-hidden
              >
                {active.initial}
              </span>
              <div className="msg-thread-header-info">
                <p className="msg-thread-header-name">{active.sender}</p>
                <p className="msg-thread-header-meta">
                  {ROLE_LABEL[active.role]}
                  {active.online ? " · ONLINE" : ""}
                  {active.campaign ? ` · ${active.campaign.toUpperCase()}` : ""}
                </p>
              </div>
              <div className="msg-thread-header-actions">
                <button
                  type="button"
                  className={`msg-thread-icon-btn${active.starred ? " is-starred" : ""}`}
                  onClick={() => toggleStar(active.id)}
                  aria-label={
                    active.starred ? "Unstar conversation" : "Star conversation"
                  }
                  aria-pressed={!!active.starred}
                  title={
                    active.starred
                      ? "Unstar (anchor off)"
                      : "Star (anchor to top)"
                  }
                >
                  <StarIcon filled={!!active.starred} />
                </button>
                <button
                  type="button"
                  className="msg-thread-icon-btn"
                  aria-label="Voice call"
                  title="Voice call (launching Q3)"
                  onClick={handleCall}
                >
                  <PhoneIcon />
                </button>
                <button
                  type="button"
                  className={`msg-thread-icon-btn${infoOpen ? " is-active" : ""}`}
                  aria-label={
                    infoOpen
                      ? "Hide conversation info"
                      : "Show conversation info"
                  }
                  aria-pressed={infoOpen}
                  title="Conversation info"
                  onClick={() => setInfoOpen((v) => !v)}
                >
                  <InfoIcon />
                </button>
              </div>
            </header>

            {/* Attribution status banner — pinned just below header
                when this conversation is tied to an active campaign.
                Lets the creator answer "how's the campaign going?"
                without leaving the thread. P1 from audit. */}
            {active.attribution && active.campaign && (
              <AttributionBanner
                campaign={active.campaign}
                attr={active.attribution}
              />
            )}

            <div className="msg-thread-body" ref={bodyRef} data-lenis-prevent>
              {groupedMessages.map((m) => {
                const isSelf = m.from === "self";
                const groupedClass =
                  m.position === "top"
                    ? "is-grouped-top"
                    : m.position === "mid"
                      ? "is-grouped-mid"
                      : m.position === "bottom"
                        ? "is-grouped-bottom"
                        : "is-single";
                const showAvatar =
                  !isSelf &&
                  (m.position === "single" || m.position === "bottom");
                return (
                  <div key={m.id}>
                    {m.showStamp && (
                      <p className="msg-bubble-time" suppressHydrationWarning>
                        {formatBubbleStamp(m.at)}
                      </p>
                    )}
                    <div
                      className={[
                        "msg-bubble-row",
                        isSelf ? "is-self" : "",
                        groupedClass,
                        showAvatar ? "show-avatar" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className="msg-bubble-avatar"
                        style={{ background: avatarBg(active.initial) }}
                        aria-hidden
                      >
                        {active.initial}
                      </span>
                      <div
                        className={`msg-bubble msg-bubble--${isSelf ? "out" : "in"}`}
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Honest composer — no fake AI badge, no theatrical
                "suggested replies". Will return when grounded LLM
                generation lands (see audit P2). */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.heic,.png,.jpg,.jpeg"
              onChange={handleFile}
              style={{ display: "none" }}
              aria-hidden
            />
            {/* P1-A: MerchAgent draft reply chips — rule-based, no LLM */}
            {draftChips.length > 0 && !draftChipUsed && (
              <div className="msg-draft-chips" aria-label="Suggested replies">
                <span className="msg-draft-chips-label">Suggested</span>
                {draftChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="msg-draft-chip"
                    onClick={() => {
                      setComposer(chip);
                      setDraftChipUsed(true);
                      composerRef.current?.focus();
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            {/* P1-B: DisclosureBot — FTC warning when disclosure is pending */}
            {hasPendingDisclosure && (
              <div className="msg-disclosure-banner" role="alert">
                <span className="msg-disclosure-icon" aria-hidden>
                  ⚠
                </span>
                <span className="msg-disclosure-text">
                  FTC disclosure required before posting
                </span>
                <Link
                  href={hasPendingDisclosure}
                  className="msg-disclosure-link"
                >
                  Sign now →
                </Link>
              </div>
            )}
            <div className="msg-composer">
              <button
                type="button"
                className="msg-composer-attach"
                aria-label="Add attachment"
                title="Attach photo / scan-log / placement evidence"
                onClick={handleAttach}
              >
                <PlusIcon />
              </button>
              <textarea
                ref={composerRef}
                className="msg-composer-input"
                placeholder={`Message ${active.sender} · Enter to send`}
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                onKeyDown={handleComposerKey}
                rows={1}
                aria-label="Message"
              />
              <button
                type="button"
                className="msg-composer-send"
                onClick={handleSend}
                disabled={!composer.trim()}
                aria-label="Send"
                title="Send (Enter)"
              >
                <SendIcon />
              </button>
            </div>

            {/* Info panel — slides down from the header when toggled.
                Shows campaign details + brand contact info + shoot
                window. Replaces the fake decorative info button with
                a real reveal. */}
            {infoOpen && (
              <aside
                className="msg-info-panel"
                aria-label="Conversation details"
              >
                <button
                  type="button"
                  className="msg-info-close"
                  onClick={() => setInfoOpen(false)}
                  aria-label="Close info"
                >
                  ×
                </button>
                <p className="msg-info-eyebrow">(Conversation details)</p>
                <h3 className="msg-info-title">{active.sender}</h3>
                {active.campaign && (
                  <dl className="msg-info-list">
                    <div className="msg-info-row">
                      <dt>Campaign</dt>
                      <dd>{active.campaign}</dd>
                    </div>
                    {active.attribution && (
                      <>
                        <div className="msg-info-row">
                          <dt>Verified scans</dt>
                          <dd>
                            {active.attribution.scansVerified} /{" "}
                            {active.attribution.scansTarget}
                          </dd>
                        </div>
                        <div className="msg-info-row">
                          <dt>Earned · max</dt>
                          <dd>
                            ${active.attribution.estPayout} / $
                            {active.attribution.maxPayout}
                          </dd>
                        </div>
                        <div className="msg-info-row">
                          <dt>Deadline</dt>
                          <dd>
                            {new Date(
                              active.attribution.deadlineISO,
                            ).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </dd>
                        </div>
                      </>
                    )}
                    <div className="msg-info-row">
                      <dt>Status</dt>
                      <dd>{active.online ? "Active now" : "Offline"}</dd>
                    </div>
                  </dl>
                )}
                <p className="msg-info-foot">
                  Need to escalate? Push support is on it 24/7.
                </p>
              </aside>
            )}
          </>
        )}
      </section>

      {/* Inline toast for phone / attach feedback */}
      {toast && (
        <div className="msg-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </section>
  );
}
