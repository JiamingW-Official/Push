"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "./faq.css";

/* ============================================================
   Push — FAQ Page (v5.1 Vertical AI for Local Commerce)
   ------------------------------------------------------------
   - Hero: "Common questions." + FAQ eyebrow
   - Client-side search (filters across all categories)
   - Filter chips (pill, 50vh — the one Design.md exception)
   - Accordion with <details>/<summary>-style behaviour via
     controlled React state (keyboard + aria accessible).
   - First item in each category opens by default.
   - Chevron rotates 180deg on expand (300ms, reduced-motion safe)
   - "Still have questions?" CTA => /contact
   ============================================================ */

type FaqCategory =
  | "pricing"
  | "verification"
  | "creator"
  | "merchant"
  | "legal";

type FaqEntry = {
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
};

const CATEGORY_LABELS: Record<FaqCategory, string> = {
  pricing: "Pricing",
  verification: "Verification",
  creator: "Creator",
  merchant: "Merchant",
  legal: "Legal",
};

/* ── FAQ content — grouped and ordered ───────────────────── */
const FAQ_ENTRIES: FaqEntry[] = [
  // Pricing
  {
    id: "pricing-1",
    category: "pricing",
    q: "How does the $0 Pilot work?",
    a: "The $0 Pilot is open to the first 10 Williamsburg Coffee+ merchants. You run a 60-day beachhead campaign with zero platform fees and zero per-customer fees for the first 10 AI-verified customers. After 10, standard vertical pricing kicks in ($15–$85 per AI-verified customer). You can exit any time before day 30 with no penalty.",
  },
  {
    id: "pricing-2",
    category: "pricing",
    q: "What's the per-customer rate?",
    a: "Push's Customer Acquisition Engine prices by vertical: Coffee+ AOV $8–$20 → $15 per AI-verified customer; Casual dining AOV $20–$45 → $30; Retail AOV $40–$120 → $55; Wellness AOV $80–$200 → $85. You only pay after ConversionOracle™ confirms a verified walk-in.",
  },
  {
    id: "pricing-3",
    category: "pricing",
    q: "What's Retention Add-on?",
    a: "Retention Add-on is an optional layer: $8–$24 per returning verified customer, stacked on top of the acquisition rate. ConversionOracle™ labels the second, third, and fourth visit and only charges when the customer walks in again. It's built for Coffee+ merchants whose real moat is habit.",
  },
  {
    id: "pricing-4",
    category: "pricing",
    q: "Can I cancel?",
    a: "Yes — month-to-month on the Operator plan, cancel any time via your Merchant Dashboard. The $0 Pilot has no cancellation fee. The Neighborhood plan is a 6-month engagement; early exit is pro-rated against remaining MRR target.",
  },
  {
    id: "pricing-5",
    category: "pricing",
    q: "What's the neighborhood plan?",
    a: "Neighborhood is Push's flagship: a fully managed Customer Acquisition Engine for an entire block or corridor. Custom $8–12K launch, $20–35K MRR target, dedicated Neighborhood Playbook, and shared ConversionOracle™ insights across co-located merchants. Williamsburg Coffee+ launches Q3 2026.",
  },

  // Verification
  {
    id: "verification-1",
    category: "verification",
    q: "How does ConversionOracle™ work?",
    a: "ConversionOracle™ is Push's walk-in prediction model, trained on ground-truth AI-verified customer events. Each visit passes a 3-layer stack: QR timestamp, Claude Vision receipt OCR, and geo-match within 2 miles. At 1,000 verified events the model is ±25% accurate; at 10,000 it tightens to ±15%. Meta and Google cannot train this — they don't see offline foot traffic.",
  },
  {
    id: "verification-2",
    category: "verification",
    q: "What's the auto-verify rate?",
    a: "About 78% of scans auto-verify in under 3 seconds — QR matches, OCR confidence ≥ 0.85, geo-match inside the 2-mile ring. The remaining 22% enter a human-in-loop queue reviewed within 4 hours. No merchant is ever charged for a rejected or unreviewed scan.",
  },
  {
    id: "verification-3",
    category: "verification",
    q: "What if a scan is rejected?",
    a: "Rejected scans are never charged. Creator, merchant, and customer each receive a transparency note explaining which layer failed (QR, OCR, or geo). Creators can dispute in-app within 72 hours — a human reviewer checks the evidence, and if overturned the payout is released and ConversionOracle™ learns from the correction.",
  },
  {
    id: "verification-4",
    category: "verification",
    q: "Do I need to train the model?",
    a: "No. ConversionOracle™ trains continuously on the Williamsburg Coffee+ beachhead ground truth. As a merchant you don't label anything — every verified scan, POS webhook, and repeat visit feeds the Vertical AI for Local Commerce stack automatically.",
  },

  // Creator
  {
    id: "creator-1",
    category: "creator",
    q: "Do I need followers?",
    a: "The floor is 5,000 followers for T1 (Seed) creators. Below that, you can still join the waitlist — we re-score accounts monthly. What matters more than raw count is engagement rate, audience geo-concentration in NYC, and posting consistency.",
  },
  {
    id: "creator-2",
    category: "creator",
    q: "How do tiers work?",
    a: "Push runs Two-Segment Creator Economics: T1–T3 (Seed / Explorer / Operator, 5K–50K followers) earn pay-per-verified-customer of $15–$85 by vertical. T4–T6 (30K+) move to a retainer-plus-performance model — $800–$3,500/mo retainer, per-customer performance bonus, 12-month referral rev-share (capped $500/mo per merchant), and an equity pool (0.02–0.2%, 4-year vest, performance-gated).",
  },
  {
    id: "creator-3",
    category: "creator",
    q: "When do I get paid?",
    a: "Weekly — every Thursday at 10am ET. Verified customer earnings have a 5-day clearing window to cover disputes; after that the amount is released to your connected bank or PayPal. Minimum payout is $25. You can track Pending, Cleared, and Paid balances live in the Creator App.",
  },
  {
    id: "creator-4",
    category: "creator",
    q: "Can I be in two cities?",
    a: "Yes. Creators are not locked to one metro — ConversionOracle™ attributes based on the customer's geo-match, not yours. But campaign eligibility is gated by audience concentration: if 70% of your engaged audience is in Brooklyn and 20% in LA, you'll see far more Williamsburg Coffee+ briefs than LA briefs until LA launches.",
  },

  // Merchant
  {
    id: "merchant-1",
    category: "merchant",
    q: "Am I eligible for the Pilot?",
    a: "The $0 Pilot is reserved for the first 10 Williamsburg Coffee+ merchants — independent coffee shops, specialty cafes, and hybrid coffee+retail venues in Williamsburg, Brooklyn. AOV between $8 and $20, single location or small multi, and willingness to share POS data for ConversionOracle™ training.",
  },
  {
    id: "merchant-2",
    category: "merchant",
    q: "What's Williamsburg Coffee+?",
    a: "Williamsburg Coffee+ is Push's beachhead — the first vertical × neighborhood pair where our Customer Acquisition Engine and ConversionOracle™ prove out. The 'Plus' covers adjacent offerings (pastries, retail, brunch) that raise AOV above pure coffee. 60 days, 10 merchants, a dense Neighborhood Playbook.",
  },
  {
    id: "merchant-3",
    category: "merchant",
    q: "Do I have to print a QR code?",
    a: "Optional. The primary scan point is the creator's content — customers scan from Instagram, TikTok, or a Story. A printed table-tent helps capture walk-ins who arrived offline but saw the creator post earlier; merchants who add one see about 14% incremental attribution. Push mails the poster for free on any Operator plan.",
  },
  {
    id: "merchant-4",
    category: "merchant",
    q: "How much time does onboarding take?",
    a: "About 35 minutes of your time. The first 10 minutes are a Calendly call with a Push operator; the next 25 minutes are self-serve inside the Merchant Dashboard — venue pin, AOV band, POS webhook (Square, Toast, or Shopify), and your acquisition goal. Campaigns go live within 48 hours.",
  },

  // Legal
  {
    id: "legal-1",
    category: "legal",
    q: "Do creators need to disclose?",
    a: "Yes — every Push post is subject to DisclosureBot, our FTC compliance layer. Posts are AI-pre-screened for 16 CFR Part 255 disclosure (#ad, Paid partnership, or platform-native tag) before they go live. Non-compliant posts are blocked with an automatic revision prompt. Compliance is infrastructure, not a checkbox.",
  },
  {
    id: "legal-2",
    category: "legal",
    q: "How do you handle customer PII?",
    a: "Push stores the minimum necessary: a hashed device fingerprint, coarse geo, and a receipt OCR token. No name, email, phone, or payment card data is stored on Push servers. Merchants receive aggregate ConversionOracle™ labels — never raw customer data. We are SOC 2 Type II in progress and CCPA/GDPR compliant.",
  },
  {
    id: "legal-3",
    category: "legal",
    q: "What if there's a dispute?",
    a: "Creators and merchants each have 72 hours to dispute any verification outcome. Disputes go to a human reviewer with the full 3-layer evidence trail and are resolved within 4 business hours. If the dispute is upheld, the payout is released (or refunded) and ConversionOracle™ updates its training signal.",
  },
  {
    id: "legal-4",
    category: "legal",
    q: "Are you FTC compliant?",
    a: "Yes. DisclosureBot enforces 16 CFR Part 255 on every post; Push carries $1M E&O insurance; and we commission a quarterly external audit on DisclosureBot outcomes. Our disclosure language is reviewed by outside counsel and updated when the FTC publishes new endorsement guides.",
  },
];

const FILTER_CHIPS: Array<{ key: FaqCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "pricing", label: "Pricing" },
  { key: "verification", label: "Verification" },
  { key: "creator", label: "Creator" },
  { key: "merchant", label: "Merchant" },
  { key: "legal", label: "Legal" },
];

const CATEGORY_ORDER: FaqCategory[] = [
  "pricing",
  "verification",
  "creator",
  "merchant",
  "legal",
];

/* ── Chevron icon ────────────────────────────────────────── */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className="faq-chevron"
      data-open={open}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

/* ── Search icon ─────────────────────────────────────────── */
function SearchGlass() {
  return (
    <svg
      className="faq-search-glass"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx={8.5} cy={8.5} r={5.5} />
      <path d="M15 15l-3-3" />
    </svg>
  );
}

/* ── Accordion item (controlled, keyboard-accessible) ────── */
function AccordionItem({
  entry,
  open,
  onToggle,
}: {
  entry: FaqEntry;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${entry.id}`;
  const triggerId = `faq-trigger-${entry.id}`;
  return (
    <div className="faq-item" data-open={open}>
      <h3 className="faq-item-heading">
        <button
          id={triggerId}
          type="button"
          className="faq-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="faq-trigger-q">{entry.q}</span>
          <Chevron open={open} />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="faq-panel"
        hidden={!open}
      >
        <p className="faq-answer">{entry.a}</p>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FaqCategory | "all">("all");

  // First item in each category is open by default. Open state keyed
  // by entry id so other expansions compose naturally.
  const defaultOpen = useMemo<Record<string, boolean>>(() => {
    const seen = new Set<FaqCategory>();
    const map: Record<string, boolean> = {};
    for (const entry of FAQ_ENTRIES) {
      if (!seen.has(entry.category)) {
        map[entry.id] = true;
        seen.add(entry.category);
      }
    }
    return map;
  }, []);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(defaultOpen);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ENTRIES.filter((entry) => {
      if (filter !== "all" && entry.category !== filter) return false;
      if (!q) return true;
      return (
        entry.q.toLowerCase().includes(q) || entry.a.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  const grouped = useMemo(() => {
    const map = new Map<FaqCategory, FaqEntry[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const entry of filtered) {
      map.get(entry.category)?.push(entry);
    }
    return map;
  }, [filtered]);

  function toggle(id: string) {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <main className="faq-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="faq-hero">
        <div className="faq-hero-inner">
          <p className="faq-eyebrow">FAQ</p>
          <h1 className="faq-headline">
            Common <em>questions.</em>
          </h1>
          <p className="faq-subhead">
            Answers on pricing, ConversionOracle™ verification, the Two-Segment
            creator model, and the Williamsburg Coffee+ beachhead.
          </p>

          {/* Search */}
          <div className="faq-search">
            <SearchGlass />
            <input
              type="search"
              className="faq-search-input"
              placeholder="Search FAQ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search FAQ"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                className="faq-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery("")}
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

          {/* Filter chips (pill 50vh exception) */}
          <div
            className="faq-chips"
            role="tablist"
            aria-label="Filter by category"
          >
            {FILTER_CHIPS.map((chip) => {
              const active = filter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="faq-chip"
                  data-active={active}
                  onClick={() => setFilter(chip.key)}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Accordion content ────────────────────────────── */}
      <section className="faq-content">
        <div className="faq-content-inner">
          {filtered.length === 0 ? (
            <div className="faq-empty">
              <p className="faq-empty-title">No questions match that search.</p>
              <p className="faq-empty-sub">
                Try a broader term or clear the filter to see every category.
              </p>
            </div>
          ) : (
            CATEGORY_ORDER.map((cat) => {
              const entries = grouped.get(cat) ?? [];
              if (entries.length === 0) return null;
              return (
                <section key={cat} className="faq-group">
                  <header className="faq-group-head">
                    <span className="faq-group-rule" aria-hidden="true" />
                    <h2 className="faq-group-title">{CATEGORY_LABELS[cat]}</h2>
                    <span className="faq-group-count">
                      {entries.length.toString().padStart(2, "0")}
                    </span>
                  </header>
                  <div className="faq-list">
                    {entries.map((entry) => (
                      <AccordionItem
                        key={entry.id}
                        entry={entry}
                        open={openMap[entry.id] ?? false}
                        onToggle={() => toggle(entry.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </section>

      {/* ── Still have questions CTA ─────────────────────── */}
      <section className="faq-cta">
        <div className="faq-cta-inner">
          <p className="faq-cta-eyebrow">Talk to a human</p>
          <h2 className="faq-cta-headline">
            Still have <span>questions?</span>
          </h2>
          <p className="faq-cta-body">
            Our Williamsburg Coffee+ onboarding team replies within 24 business
            hours. Tell us how many new customers you need — we&apos;ll show you
            the Neighborhood Playbook.
          </p>
          <div className="faq-cta-actions">
            <Link href="/contact" className="faq-cta-primary">
              Contact us
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </Link>
            <Link href="/help" className="faq-cta-secondary">
              Browse the help center
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
