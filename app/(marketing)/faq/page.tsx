"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
  useLayoutEffect,
} from "react";
import {
  FAQ_ITEMS,
  CATEGORY_LABELS,
  type FaqCategory,
  type FaqItem,
} from "@/lib/faq/mock-faqs";
import "./faq.css";

/* ── Types ───────────────────────────────────────────────── */
type HelpfulVote = "yes" | "no" | null;

/* ── Chevron icon ─────────────────────────────────────────── */
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

/* ── Search icon ──────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <circle cx={8.5} cy={8.5} r={5.5} />
      <path d="M15 15l-3-3" />
    </svg>
  );
}

/* ── Per-category headline pair (Darky 800 + ghost) ───────── */
const CATEGORY_HEADLINES: Record<
  FaqCategory,
  { num: string; lead: string; ghost: string }
> = {
  "for-merchants": {
    num: "02",
    lead: "Merchant",
    ghost: "questions, answered.",
  },
  "for-creators": {
    num: "03",
    lead: "Creator",
    ghost: "questions, answered.",
  },
  "pricing-payments": {
    num: "04",
    lead: "Payment",
    ghost: "questions, answered.",
  },
  "attribution-qr": {
    num: "05",
    lead: "Verification",
    ghost: "questions, answered.",
  },
  "trust-safety": {
    num: "06",
    lead: "Legal",
    ghost: "questions, answered.",
  },
};

/* ── Accordion item ───────────────────────────────────────── */
function FaqAccordionItem({
  item,
  relatedItems,
  defaultOpen,
  onRelatedClick,
}: {
  item: FaqItem;
  relatedItems: FaqItem[];
  defaultOpen?: boolean;
  onRelatedClick: (id: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [vote, setVote] = useState<HelpfulVote>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Spring-like accordion — animate height via measured content height
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    if (open) {
      panel.style.height = inner.scrollHeight + "px";
    } else {
      panel.style.height = "0px";
    }
  }, [open]);

  // Re-measure on resize
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;
    const ro = new ResizeObserver(() => {
      panel.style.height = inner.scrollHeight + "px";
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, [open]);

  function handleVote(v: "yes" | "no") {
    if (vote !== null) return;
    setVote(v);
  }

  return (
    <div className="faq-item" data-open={open} id={`faq-${item.id}`}>
      <button
        className="faq-item-trigger"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="faq-item-question">{item.question}</span>
        <ChevronIcon className="faq-item-chevron" />
      </button>

      <div
        ref={panelRef}
        className="faq-item-panel"
        style={{ height: defaultOpen ? undefined : "0px" }}
        aria-hidden={!open}
      >
        <div ref={innerRef} className="faq-item-body">
          <div>
            <p className="faq-item-answer">{item.answer}</p>

            <div className="faq-helpful">
              <span className="faq-helpful-label">was this useful?</span>
              {vote === null ? (
                <>
                  <button
                    className="faq-helpful-btn"
                    onClick={() => handleVote("yes")}
                  >
                    yes
                  </button>
                  <button
                    className="faq-helpful-btn"
                    onClick={() => handleVote("no")}
                  >
                    no
                  </button>
                </>
              ) : (
                <span className="faq-helpful-thanks">
                  {vote === "yes"
                    ? "noted — thanks."
                    : "we'll sharpen the answer."}
                </span>
              )}
            </div>
          </div>

          {relatedItems.length > 0 && (
            <aside className="faq-related">
              <p className="faq-related-label">Related</p>
              <ul className="faq-related-list">
                {relatedItems.map((rel) => (
                  <li key={rel.id}>
                    <button
                      className="faq-related-link"
                      onClick={() => onRelatedClick(rel.id)}
                    >
                      {rel.question}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── All categories ordered ───────────────────────────────── */
const ALL_CATEGORIES: FaqCategory[] = [
  "for-merchants",
  "for-creators",
  "pricing-payments",
  "attribution-qr",
  "trust-safety",
];

/* ── Category counts ──────────────────────────────────────── */
const CATEGORY_COUNTS = ALL_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] = FAQ_ITEMS.filter((f) => f.category === cat).length;
    return acc;
  },
  {} as Record<FaqCategory, number>,
);

/* ── FAQ lookup map ───────────────────────────────────────── */
const FAQ_MAP = new Map(FAQ_ITEMS.map((f) => [f.id, f]));

/* ── Scroll-reveal hook ───────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".faq-reveal");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Inner page component (reads searchParams) ─────────────── */
function FaqPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive initial state from URL
  const initialQuery = searchParams.get("q") ?? "";
  const initialCat =
    (searchParams.get("cat") as FaqCategory | null) ?? "for-merchants";

  const [query, setQuery] = useState(initialQuery);
  const [activeCat, setActiveCat] = useState<FaqCategory>(initialCat);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useScrollReveal();

  // Debounce search query — 200ms
  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setDebouncedQuery(value);
        const params = new URLSearchParams();
        if (value) params.set("q", value);
        if (activeCat !== "for-merchants") params.set("cat", activeCat);
        const qs = params.toString();
        router.replace(`/faq${qs ? `?${qs}` : ""}`, { scroll: false });
      }, 200);
    },
    [activeCat, router],
  );

  // Tab switch — clear search, update URL
  const handleTabChange = useCallback(
    (cat: FaqCategory) => {
      setActiveCat(cat);
      setQuery("");
      setDebouncedQuery("");
      const params = new URLSearchParams();
      if (cat !== "for-merchants") params.set("cat", cat);
      const qs = params.toString();
      router.replace(`/faq${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router],
  );

  // Scroll to a specific FAQ (used by related links)
  const scrollToFaq = useCallback(
    (id: string) => {
      const item = FAQ_MAP.get(id);
      if (!item) return;
      if (item.category !== activeCat) {
        setActiveCat(item.category);
        setQuery("");
        setDebouncedQuery("");
      }
      setTimeout(() => {
        const el = document.getElementById(`faq-${id}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    },
    [activeCat],
  );

  // Filter items
  const filtered = (() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      return FAQ_ITEMS.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q),
      );
    }
    return FAQ_ITEMS.filter((f) => f.category === activeCat);
  })();

  const isSearching = debouncedQuery.trim().length > 0;
  const heading = CATEGORY_HEADLINES[activeCat];

  return (
    <main className="faq-page">
      {/* ── Hero — bg-hero-ink + grain + vignette ────────────── */}
      <section className="faq-hero bg-hero-ink grain-overlay bg-vignette">
        <div className="faq-hero-inner">
          {/* Top row: pill + eyebrow */}
          <div className="faq-hero-top">
            <span className="pill-lux" style={{ color: "#fff" }}>
              Pilot · SoHo / Tribeca / Chinatown
            </span>
            <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
              Opens June&nbsp;22
            </span>
          </div>

          {/* Section marker */}
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Common questions
          </div>

          {/* Headline: Darky 900 + ghost */}
          <h1 className="faq-hero-headline">
            The stuff
            <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
              .
            </span>
            <br />
            <span className="display-ghost faq-hero-ghost">
              people ask, often.
            </span>
          </h1>

          <p className="faq-hero-sub">
            Real questions from the venues and creators we've been on calls with
            the last six weeks. No sales-deck answers — just what actually
            happens during the pilot.
          </p>

          {/* Search */}
          <div className="faq-search-wrap">
            <label htmlFor="faq-search" className="faq-search-label">
              search across all topics
            </label>
            <div className="faq-search-field">
              <span className="faq-search-icon">
                <SearchIcon />
              </span>
              <input
                id="faq-search"
                type="search"
                className="faq-search-input"
                placeholder="e.g. when do creators get paid?"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  className="faq-search-clear"
                  aria-label="Clear search"
                  onClick={() => handleSearchChange("")}
                >
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  >
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              )}
            </div>
            <p className="faq-search-meta">
              {isSearching
                ? `${filtered.length} match${filtered.length !== 1 ? "es" : ""} for "${debouncedQuery}"`
                : `${FAQ_ITEMS.length} answers across ${ALL_CATEGORIES.length} categories.`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Category tabs (hidden during search) ─────────────── */}
      {!isSearching && (
        <nav className="faq-tabs-section" aria-label="FAQ categories">
          <div className="faq-tabs-inner" role="tablist">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCat === cat}
                className="faq-tab-btn"
                data-active={activeCat === cat}
                onClick={() => handleTabChange(cat)}
              >
                {CATEGORY_LABELS[cat]}
                <span className="faq-tab-count">{CATEGORY_COUNTS[cat]}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="faq-content">
        <div>
          {!isSearching && (
            <div className="faq-section-head faq-reveal">
              <div className="section-marker" data-num={heading.num}>
                {CATEGORY_LABELS[activeCat]}
              </div>
              <h2 className="faq-section-title">
                {heading.lead}
                <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
                  .
                </span>
                <br />
                <span className="display-ghost faq-section-ghost">
                  {heading.ghost}
                </span>
              </h2>
            </div>
          )}

          {isSearching && filtered.length > 0 && (
            <div className="faq-reveal faq-search-banner">
              <div
                className="section-marker"
                data-num="//"
                style={{ marginBottom: 0 }}
              >
                results across all categories
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="faq-empty faq-reveal">
              <p className="faq-empty-title">nothing matched.</p>
              <p className="faq-empty-sub">
                try a different word, or browse a category above.
              </p>
            </div>
          ) : (
            <div className="faq-accordion-list">
              {filtered.map((item, i) => {
                const relatedItems = item.related
                  .map((id) => FAQ_MAP.get(id))
                  .filter((r): r is FaqItem => r !== undefined)
                  .slice(0, 3);

                return (
                  <div key={item.id} className="faq-reveal">
                    <FaqAccordionItem
                      item={item}
                      relatedItems={relatedItems}
                      defaultOpen={i === 0}
                      onRelatedClick={scrollToFaq}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar — desktop only */}
        <aside className="faq-sidebar">
          <div className="faq-sidebar-card card-premium">
            <div
              className="section-marker"
              data-num="//"
              style={{ marginBottom: "var(--space-3)" }}
            >
              Direct line
            </div>
            <h3 className="faq-sidebar-title">
              still
              <span style={{ color: "var(--brand-red)" }}>?</span>
            </h3>
            <p className="faq-sidebar-sub">
              email Jiaming directly. Replies usually inside the same business
              day, never later than 24 hours.
            </p>
            <a href="mailto:jiaming@push.nyc" className="faq-sidebar-link">
              jiaming@push.nyc
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              >
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </a>

            <div className="faq-sidebar-divider" />

            <p className="faq-sidebar-topics-label">browse topics</p>
            <nav className="faq-sidebar-topics">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className="faq-sidebar-topic-btn"
                  data-active={!isSearching && activeCat === cat}
                  onClick={() => handleTabChange(cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {/* ── FTC divider ───────────────────────────────────────── */}
      <div className="faq-divider-wrap">
        <div className="divider-lux">FTC 16 CFR § 255 · enforced</div>
      </div>

      {/* ── Direct-line CTA ───────────────────────────────────── */}
      <section className="faq-cta bg-hero-ink grain-overlay bg-vignette">
        <div className="faq-cta-inner faq-reveal">
          <div
            className="section-marker"
            data-num="07"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Direct line
          </div>
          <h2 className="faq-cta-headline">
            Still unsure
            <span style={{ color: "var(--brand-red)" }}>?</span>
            <br />
            <span className="display-ghost faq-cta-ghost">email Jiaming.</span>
          </h2>
          <p className="faq-cta-body">
            One operator runs the inbox during the pilot. You'll get a real
            answer, usually inside the same business day.
          </p>
          <div className="faq-cta-actions">
            <a href="mailto:jiaming@push.nyc" className="faq-cta-btn-primary">
              jiaming@push.nyc
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              >
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </a>
            <Link href="/explore" className="faq-cta-btn-secondary">
              browse live campaigns
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Page export — wraps with Suspense for useSearchParams ──── */
export default function FaqPage() {
  return (
    <Suspense fallback={null}>
      <FaqPageInner />
    </Suspense>
  );
}
