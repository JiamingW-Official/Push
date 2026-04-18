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
      strokeWidth={1.8}
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
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <circle cx={8.5} cy={8.5} r={5.5} />
      <path d="M15 15l-3-3" />
    </svg>
  );
}

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
          {/* Answer */}
          <div>
            <p className="faq-item-answer">{item.answer}</p>

            {/* Helpful feedback */}
            <div className="faq-helpful">
              <span className="faq-helpful-label">Was this helpful?</span>
              {vote === null ? (
                <>
                  <button
                    className="faq-helpful-btn"
                    data-voted={vote === "yes" ? "yes" : undefined}
                    onClick={() => handleVote("yes")}
                  >
                    Yes
                  </button>
                  <button
                    className="faq-helpful-btn"
                    data-voted={vote === "no" ? "no" : undefined}
                    onClick={() => handleVote("no")}
                  >
                    No
                  </button>
                </>
              ) : (
                <span className="faq-helpful-thanks">
                  {vote === "yes"
                    ? "Thanks for your feedback!"
                    : "We'll work on improving this answer."}
                </span>
              )}
            </div>
          </div>

          {/* Related questions — desktop only */}
          {relatedItems.length > 0 && (
            <aside className="faq-related">
              <p className="faq-related-label">Related</p>
              <ul className="faq-related-list">
                {relatedItems.map((rel) => (
                  <li key={rel.id}>
                    <button
                      className="faq-related-link"
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                        cursor: "pointer",
                        padding: "6px 0",
                        borderBottom: "1px solid var(--line)",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-small)",
                        color: "var(--dark)",
                        lineHeight: 1.4,
                        transition: "color var(--t-fast)",
                        borderRadius: 0,
                      }}
                      onClick={() => onRelatedClick(rel.id)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--primary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--dark)";
                      }}
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
        // Sync URL
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
      // Switch to correct tab if needed
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
      // Search across ALL categories
      return FAQ_ITEMS.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q),
      );
    }
    return FAQ_ITEMS.filter((f) => f.category === activeCat);
  })();

  const isSearching = debouncedQuery.trim().length > 0;

  return (
    <main className="faq-page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="faq-hero">
        <div className="faq-hero-inner">
          <p className="faq-hero-eyebrow">Help Center</p>
          <h1 className="faq-hero-headline">
            Common <em>questions.</em>
          </h1>

          {/* Search */}
          <div className="faq-search-wrap">
            <label htmlFor="faq-search" className="faq-search-label">
              Search all topics
            </label>
            <div className="faq-search-field">
              <SearchIcon />
              <input
                id="faq-search"
                type="search"
                className="faq-search-input"
                placeholder="e.g. how do payouts work?"
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
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  >
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              )}
            </div>
            <p className="faq-search-meta">
              {isSearching
                ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${debouncedQuery}"`
                : ""}
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
        {/* Accordion list */}
        <div>
          {/* Section header */}
          {!isSearching && (
            <div
              className="faq-reveal"
              style={{ marginBottom: "var(--space-5)" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "var(--space-1)",
                }}
              >
                {CATEGORY_LABELS[activeCat]}
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--dark)",
                }}
              >
                {activeCat === "for-merchants" &&
                  "Everything merchants need to know"}
                {activeCat === "for-creators" && "Creator earnings & platform"}
                {activeCat === "pricing-payments" &&
                  "Pricing & payment details"}
                {activeCat === "attribution-qr" && "How attribution works"}
                {activeCat === "trust-safety" && "Trust, safety & compliance"}
              </h2>
            </div>
          )}

          {isSearching && filtered.length > 0 && (
            <div
              className="faq-reveal"
              style={{ marginBottom: "var(--space-5)" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  color: "var(--graphite)",
                }}
              >
                Showing results across all categories
              </p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="faq-empty faq-reveal">
              <p className="faq-empty-title">No results found</p>
              <p className="faq-empty-sub">
                Try a different search term, or browse a category above.
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
          <div className="faq-sidebar-card">
            <h3 className="faq-sidebar-title">Still have questions?</h3>
            <p className="faq-sidebar-sub">
              Our team responds within 24 hours on business days.
            </p>
            <Link href="/contact" className="faq-sidebar-link">
              Contact Support
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </Link>

            <div className="faq-sidebar-divider" />

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-caption)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "var(--space-2)",
              }}
            >
              Browse topics
            </p>
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

      {/* ── Still have questions CTA ──────────────────────────── */}
      <section className="faq-cta">
        <div className="faq-cta-inner faq-reveal">
          <p className="faq-cta-eyebrow">Get in touch</p>
          <h2 className="faq-cta-headline">
            Still have <span>questions?</span>
          </h2>
          <p className="faq-cta-body">
            Our team of experts is ready to help you understand how Push can
            work for your venue or creator profile. We respond within 24 hours.
          </p>
          <div className="faq-cta-actions">
            <Link href="/contact" className="faq-cta-btn-primary">
              Contact us
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </Link>
            <Link href="/explore" className="faq-cta-btn-secondary">
              Explore campaigns
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
