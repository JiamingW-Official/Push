"use client";

/**
 * Creator Messages — v5.1 Vertical AI for Local Commerce
 *
 * Self-contained creator inbox. Not wired to shared /components/messaging
 * to avoid collateral impact on merchant messaging. Static demo data.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import "./messages.css";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

type ThreadKind = "merchant" | "ops" | "dispute" | "support";
type MessageSender = "self" | "other" | "system";

interface Message {
  id: string;
  sender: MessageSender;
  author?: string;
  text: string;
  time: string; // relative display string
}

interface Thread {
  id: string;
  kind: ThreadKind;
  name: string;
  handle: string;
  avatarInitials: string;
  tier?: string; // e.g. "T4 Signature" or "Williamsburg Coffee+"
  borderTone: "tier1" | "tier2" | "tier3" | "tier4" | "tier5" | "tier6" | "ops";
  preview: string;
  timestamp: string; // relative
  unread: number;
  sticky?: boolean;
  pinnedLabel?: string;
  otherTyping?: boolean;
  messages: Message[];
}

/* -------------------------------------------------------------------
   Demo data — 6 threads, varied states
   ------------------------------------------------------------------- */

const THREADS: Thread[] = [
  {
    id: "push-ops",
    kind: "ops",
    name: "Push Ops",
    handle: "@push-ops",
    avatarInitials: "PO",
    tier: "ConversionOracle™ · DisclosureBot · payments",
    borderTone: "ops",
    preview:
      "We respond within 24h. Ask about campaigns, verification, or payout.",
    timestamp: "live",
    unread: 0,
    sticky: true,
    pinnedLabel: "we respond within 24h",
    messages: [
      {
        id: "m1",
        sender: "other",
        author: "Push Ops",
        text: "Welcome to the Customer Acquisition Engine. Reach us here for DisclosureBot reviews, ConversionOracle™ questions, or payout issues.",
        time: "09:02",
      },
      {
        id: "m2",
        sender: "system",
        text: "SLA · We respond within 24h on business days.",
        time: "",
      },
      {
        id: "m3",
        sender: "other",
        author: "Push Ops",
        text: "Your April payout cleared — $340 across 17 verified walk-ins. Keep pushing Williamsburg Coffee+ pilots.",
        time: "Yesterday 4:12 PM",
      },
    ],
  },
  {
    id: "devocion",
    kind: "merchant",
    name: "Devoción Coffee",
    handle: "@devocion-wburg",
    avatarInitials: "DC",
    tier: "Williamsburg Coffee+ · AOV $11",
    borderTone: "tier4",
    preview: "We loved the reel — can you drop a follow-up on Friday?",
    timestamp: "2m",
    unread: 2,
    otherTyping: true,
    messages: [
      {
        id: "m1",
        sender: "other",
        author: "Devoción Coffee",
        text: "Hey! Your reel drove 12 verified walk-ins over the weekend. ConversionOracle™ flagged it as a high-intent creative.",
        time: "Mon 10:14 AM",
      },
      {
        id: "m2",
        sender: "self",
        author: "You",
        text: "Amazing — glad it landed. The cortado angle clearly works here.",
        time: "Mon 10:22 AM",
      },
      {
        id: "m3",
        sender: "system",
        text: "Campaign accepted — Neighborhood Playbook: Williamsburg Coffee+",
        time: "",
      },
      {
        id: "m4",
        sender: "other",
        author: "Devoción Coffee",
        text: "We loved the reel — can you drop a follow-up on Friday? Same menu focus.",
        time: "2m",
      },
      {
        id: "m5",
        sender: "other",
        author: "Devoción Coffee",
        text: "Happy to bump the rate if you can hit the 5pm window.",
        time: "2m",
      },
    ],
  },
  {
    id: "partners-coffee",
    kind: "merchant",
    name: "Partners Coffee",
    handle: "@partners-bk",
    avatarInitials: "PC",
    tier: "Williamsburg Coffee+ · AOV $9",
    borderTone: "tier3",
    preview: "Receipt uploaded — ConversionOracle™ verified walk-in.",
    timestamp: "38m",
    unread: 0,
    messages: [
      {
        id: "m1",
        sender: "other",
        author: "Partners Coffee",
        text: "Thanks for the visit! Did your friend grab the oat cortado too?",
        time: "Today 11:04 AM",
      },
      {
        id: "m2",
        sender: "self",
        author: "You",
        text: "Yes — both receipts uploaded. DisclosureBot passed the caption.",
        time: "Today 11:30 AM",
      },
      {
        id: "m3",
        sender: "system",
        text: "Payment processed — $18 (2 verified customers)",
        time: "",
      },
    ],
  },
  {
    id: "oslo-dispute",
    kind: "dispute",
    name: "Oslo Coffee",
    handle: "@oslo-williamsburg",
    avatarInitials: "OC",
    tier: "Dispute · Ops reviewing",
    borderTone: "tier2",
    preview: "Dispute filed — receipt OCR mismatch on April 14 visit.",
    timestamp: "2h",
    unread: 1,
    messages: [
      {
        id: "m1",
        sender: "system",
        text: "Dispute filed — receipt OCR mismatch on April 14 visit.",
        time: "",
      },
      {
        id: "m2",
        sender: "other",
        author: "Oslo Coffee",
        text: "The receipt you uploaded shows $4.25 but our register logged $6.50. Can you re-check?",
        time: "2h",
      },
      {
        id: "m3",
        sender: "self",
        author: "You",
        text: "Uploading a clearer photo now. Claude Vision should re-read the total.",
        time: "2h",
      },
    ],
  },
  {
    id: "variety",
    kind: "merchant",
    name: "Variety Coffee",
    handle: "@variety-grandst",
    avatarInitials: "VC",
    tier: "Williamsburg Coffee+ · AOV $8",
    borderTone: "tier1",
    preview:
      "Campaign invite — Spring matcha launch, 4 verified customers needed.",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m1",
        sender: "other",
        author: "Variety Coffee",
        text: "Spring matcha launch — looking for 4 verified walk-ins over the next 10 days. $15 per verified customer.",
        time: "Yesterday 3:40 PM",
      },
      {
        id: "m2",
        sender: "self",
        author: "You",
        text: "Sounds good — I'll draft two reels focused on the iced matcha.",
        time: "Yesterday 5:18 PM",
      },
    ],
  },
  {
    id: "support",
    kind: "support",
    name: "DisclosureBot Support",
    handle: "@push-support",
    avatarInitials: "DB",
    tier: "FTC compliance · creator education",
    borderTone: "tier5",
    preview: "Your caption needs #ad — we flagged line 2 before posting.",
    timestamp: "Tue",
    unread: 0,
    messages: [
      {
        id: "m1",
        sender: "other",
        author: "DisclosureBot",
        text: "Heads up — your draft caption missed the #ad tag. I auto-suggested a fix; approve or edit.",
        time: "Tue 2:02 PM",
      },
      {
        id: "m2",
        sender: "self",
        author: "You",
        text: "Approved. Thanks for catching it before publish.",
        time: "Tue 2:05 PM",
      },
      {
        id: "m3",
        sender: "system",
        text: "Compliance check passed · DisclosureBot",
        time: "",
      },
    ],
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "active", label: "Active campaigns" },
  { id: "dispute", label: "Disputes" },
  { id: "support", label: "Support" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const TEMPLATES = [
  "Thanks! Visiting tomorrow.",
  "Receipt uploaded.",
  "Need more info.",
];

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function CreatorMessagesPage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>(THREADS[0].id);
  const [composer, setComposer] = useState("");
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, Message[]>
  >(() => Object.fromEntries(THREADS.map((t) => [t.id, t.messages])));
  const [threadState, setThreadState] = useState<Thread[]>(THREADS);
  const [mobileView, setMobileView] = useState<"list" | "conversation">("list");

  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const threadRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* filter + search */
  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    const passesFilter = (t: Thread) => {
      if (filter === "all") return true;
      if (filter === "unread") return t.unread > 0;
      if (filter === "active") return t.kind === "merchant";
      if (filter === "dispute") return t.kind === "dispute";
      if (filter === "support") return t.kind === "support" || t.kind === "ops";
      return true;
    };
    const passesQuery = (t: Thread) => {
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.handle.toLowerCase().includes(q) ||
        t.preview.toLowerCase().includes(q)
      );
    };
    const list = threadState.filter((t) => passesFilter(t) && passesQuery(t));
    // sticky always floats top
    const sticky = list.filter((t) => t.sticky);
    const rest = list.filter((t) => !t.sticky);
    return [...sticky, ...rest];
  }, [filter, query, threadState]);

  const active = threadState.find((t) => t.id === activeId) ?? null;
  const activeMessages = active ? (messagesByThread[active.id] ?? []) : [];

  /* auto-scroll on new message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, activeMessages.length]);

  /* J/K nav + Enter to open (list pane only) */
  const handleListKey = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!filteredThreads.length) return;
      const idx = filteredThreads.findIndex((t) => t.id === activeId);
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next =
          filteredThreads[Math.min(idx + 1, filteredThreads.length - 1)];
        if (next) {
          setActiveId(next.id);
          threadRefs.current[next.id]?.focus();
        }
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = filteredThreads[Math.max(idx - 1, 0)];
        if (prev) {
          setActiveId(prev.id);
          threadRefs.current[prev.id]?.focus();
        }
      } else if (e.key === "Enter") {
        setMobileView("conversation");
      }
    },
    [filteredThreads, activeId],
  );

  const openThread = (id: string) => {
    setActiveId(id);
    setMobileView("conversation");
    setThreadState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)),
    );
  };

  /* composer */
  const autoResize = () => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const handleSend = () => {
    const trimmed = composer.trim();
    if (!trimmed || !active) return;
    const msg: Message = {
      id: `s-${Date.now()}`,
      sender: "self",
      author: "You",
      text: trimmed,
      time: "just now",
    };
    setMessagesByThread((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }));
    setComposer("");
    if (composerRef.current) composerRef.current.style.height = "auto";
  };

  const handleTemplate = (tpl: string) => {
    setComposer(tpl);
    setTimeout(autoResize, 0);
    composerRef.current?.focus();
  };

  const totalUnread = threadState.reduce((acc, t) => acc + t.unread, 0);

  return (
    <div
      className={`cmsg-shell ${mobileView === "conversation" ? "cmsg-mobile-conv" : ""}`}
    >
      {/* ==== Thread list pane ==== */}
      <aside
        className="cmsg-list"
        onKeyDown={handleListKey}
        tabIndex={-1}
        aria-label="Conversations"
      >
        <header className="cmsg-list-header">
          <div className="cmsg-title-row">
            <h1 className="cmsg-title">Messages</h1>
            {totalUnread > 0 && (
              <span className="cmsg-unread-pill">{totalUnread}</span>
            )}
          </div>
          <p className="cmsg-sub">
            Customer Acquisition Engine · Vertical AI for Local Commerce
          </p>
          <div className="cmsg-search">
            <span aria-hidden className="cmsg-search-icon">
              ⌕
            </span>
            <input
              type="search"
              placeholder="Search merchants, handles, messages"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="cmsg-search-input"
            />
          </div>
          <div className="cmsg-filters" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`cmsg-chip ${filter === f.id ? "is-active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="cmsg-threads" role="list">
          {filteredThreads.length === 0 && (
            <div className="cmsg-empty-list">
              No conversations match <em>{query || filter}</em>.
            </div>
          )}
          {filteredThreads.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  threadRefs.current[t.id] = el;
                }}
                role="listitem"
                onClick={() => openThread(t.id)}
                className={`cmsg-thread ${isActive ? "is-active" : ""} ${t.sticky ? "is-sticky" : ""}`}
              >
                {t.sticky && (
                  <span className="cmsg-sticky-tag">
                    Pinned · {t.pinnedLabel}
                  </span>
                )}
                <div className="cmsg-thread-row">
                  <div
                    className={`cmsg-avatar cmsg-tone-${t.borderTone}`}
                    aria-hidden
                  >
                    {t.avatarInitials}
                  </div>
                  <div className="cmsg-thread-body">
                    <div className="cmsg-thread-top">
                      <span
                        className={`cmsg-thread-name ${t.unread ? "is-unread" : ""}`}
                      >
                        {t.name}
                      </span>
                      <span className="cmsg-thread-time">{t.timestamp}</span>
                    </div>
                    <div className="cmsg-thread-handle">{t.handle}</div>
                    <div className="cmsg-thread-preview">{t.preview}</div>
                  </div>
                  {t.unread > 0 && (
                    <span
                      className="cmsg-dot"
                      aria-label={`${t.unread} unread`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <footer className="cmsg-list-foot">
          <span className="cmsg-kbd">J</span>
          <span className="cmsg-kbd">K</span>
          <span className="cmsg-foot-text">nav</span>
          <span className="cmsg-kbd">↵</span>
          <span className="cmsg-foot-text">open</span>
        </footer>
      </aside>

      {/* ==== Conversation pane ==== */}
      <section className="cmsg-conv" aria-label="Conversation">
        {active ? (
          <>
            <header className="cmsg-conv-header">
              <button
                type="button"
                className="cmsg-back"
                onClick={() => setMobileView("list")}
                aria-label="Back to conversations"
              >
                ‹ Back
              </button>
              <div
                className={`cmsg-avatar cmsg-avatar-sm cmsg-tone-${active.borderTone}`}
                aria-hidden
              >
                {active.avatarInitials}
              </div>
              <div className="cmsg-conv-ident">
                <div className="cmsg-conv-name">{active.name}</div>
                <div className="cmsg-conv-tier">{active.tier}</div>
              </div>
              <Link href="/creator/explore" className="cmsg-viewprofile">
                View profile →
              </Link>
            </header>

            <div ref={scrollRef} className="cmsg-scroll">
              {activeMessages.map((m) => {
                if (m.sender === "system") {
                  return (
                    <div key={m.id} className="cmsg-system">
                      <span>{m.text}</span>
                    </div>
                  );
                }
                const isSelf = m.sender === "self";
                return (
                  <div
                    key={m.id}
                    className={`cmsg-bubble-wrap ${isSelf ? "is-self" : "is-other"}`}
                  >
                    <div className="cmsg-bubble-name">{m.author}</div>
                    <div
                      className={`cmsg-bubble ${isSelf ? "is-self" : "is-other"}`}
                    >
                      {m.text}
                    </div>
                    <div className="cmsg-bubble-time">{m.time}</div>
                  </div>
                );
              })}
              {active.otherTyping && (
                <div className="cmsg-bubble-wrap is-other">
                  <div className="cmsg-bubble-name">{active.name}</div>
                  <div className="cmsg-bubble is-other cmsg-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            <div className="cmsg-quick">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => handleTemplate(tpl)}
                  className="cmsg-chip cmsg-chip-ghost"
                >
                  {tpl}
                </button>
              ))}
            </div>

            <form
              className="cmsg-composer"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <button
                type="button"
                className="cmsg-attach"
                aria-label="Attach file"
                title="Attach file (UI only)"
              >
                +
              </button>
              <textarea
                ref={composerRef}
                value={composer}
                onChange={(e) => {
                  setComposer(e.target.value);
                  autoResize();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Message ${active.name}…`}
                rows={1}
                className="cmsg-textarea"
              />
              <button
                type="submit"
                className="cmsg-send"
                disabled={!composer.trim()}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="cmsg-empty">
            <div className="cmsg-empty-inner">
              <div className="cmsg-empty-kicker">Inbox empty</div>
              <h2 className="cmsg-empty-title">No messages yet.</h2>
              <p className="cmsg-empty-copy">
                Start a conversation by applying to a campaign or contacting
                Push Ops for DisclosureBot, ConversionOracle™, or payments
                questions.
              </p>
              <Link href="/creator/explore" className="cmsg-cta">
                Explore Williamsburg Coffee+ campaigns →
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
