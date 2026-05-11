"use client";

/* ============================================================
   /explore — public discover surface. v3 (2026-05-08)

   Public-facing version of /creator/discover. Mirrors the discover
   visual register — Liquid-Glass section grid with category-grouped
   campaign cards — but without creator-only affordances (saved set,
   application status, tier-locking). Anyone (no login required) can
   browse campaigns; CTAs route to /creator/login or /creator/signup.

   Single-file ~250 lines, reuses discover.css patterns directly.
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { MOCK_CAMPAIGNS, type Campaign } from "@/lib/mocks/campaigns";
import { Search, MapPin, Tag } from "lucide-react";
import "./explore.css";

const CATEGORIES = [
  "All",
  "FOOD & DRINK",
  "RETAIL",
  "WELLNESS",
  "BEAUTY",
  "FITNESS",
  "LIFESTYLE",
] as const;
type Category = (typeof CATEGORIES)[number];

type SectionGroup = {
  key: string;
  label: string;
  sublabel: string;
  accent: string;
  campaigns: Campaign[];
};

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = useMemo(() => {
    let list = MOCK_CAMPAIGNS;
    if (activeCategory !== "All") {
      list = list.filter((c) => c.category === activeCategory);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.merchantName.toLowerCase().includes(q) ||
          c.neighborhood.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, activeCategory]);

  const sections: SectionGroup[] = useMemo(() => {
    if (activeCategory !== "All" || query.trim()) return [];
    return [
      {
        key: "food",
        label: "Food & drink",
        sublabel: "NYC's tastiest creator picks",
        accent: "var(--brand-red, #c1121f)",
        campaigns: MOCK_CAMPAIGNS.filter(
          (c) => c.category === "FOOD & DRINK",
        ).slice(0, 6),
      },
      {
        key: "lifestyle",
        label: "Lifestyle & retail",
        sublabel: "Hand-picked stores + brands",
        accent: "var(--accent-blue, #0085ff)",
        campaigns: MOCK_CAMPAIGNS.filter(
          (c) => c.category === "LIFESTYLE" || c.category === "RETAIL",
        ).slice(0, 6),
      },
      {
        key: "wellness",
        label: "Wellness, beauty & fitness",
        sublabel: "For the health-aware creator",
        accent: "var(--champagne-deep, #8a704a)",
        campaigns: MOCK_CAMPAIGNS.filter(
          (c) =>
            c.category === "WELLNESS" ||
            c.category === "BEAUTY" ||
            c.category === "FITNESS",
        ).slice(0, 6),
      },
    ];
  }, [activeCategory, query]);

  return (
    <main className="explore-page" aria-label="Explore campaigns">
      <header className="explore-hero">
        <p className="explore-hero__eyebrow">Explore · public</p>
        <h1 className="explore-hero__title">Find your next gig</h1>
        <p className="explore-hero__sub">
          {MOCK_CAMPAIGNS.length} active campaigns across NYC ·{" "}
          <Link href="/creator/signup" className="explore-hero__link">
            Sign up to apply →
          </Link>
        </p>
      </header>

      <div className="explore-toolbar">
        <div className="explore-search-wrap">
          <Search size={16} strokeWidth={2} className="explore-search-icon" />
          <input
            type="search"
            className="explore-search-input"
            placeholder="Search campaigns, merchants, neighborhoods"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            aria-label="Search campaigns"
          />
        </div>
        <div className="explore-cat-strip" role="tablist">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={activeCategory === c}
              className={
                "explore-cat" + (activeCategory === c ? " is-active" : "")
              }
              onClick={() => setActiveCategory(c)}
            >
              {c === "All" ? "All" : c.toLowerCase().replace("&", "·")}
            </button>
          ))}
        </div>
      </div>

      {sections.length > 0 ? (
        <div className="explore-sections">
          {sections.map((g) => (
            <section
              key={g.key}
              className="explore-section"
              style={{ ["--section-accent" as string]: g.accent }}
            >
              <header className="explore-section-head">
                <div>
                  <h2 className="explore-section-title">{g.label}</h2>
                  <p className="explore-section-sublabel">{g.sublabel}</p>
                </div>
                <button
                  type="button"
                  className="explore-section-more"
                  onClick={() => {
                    if (g.key === "food") setActiveCategory("FOOD & DRINK");
                    if (g.key === "lifestyle") setActiveCategory("LIFESTYLE");
                    if (g.key === "wellness") setActiveCategory("WELLNESS");
                  }}
                >
                  See all →
                </button>
              </header>
              <div className="explore-section-row">
                {g.campaigns.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="explore-empty">
          <p className="explore-empty__title">No campaigns match</p>
          <p className="explore-empty__sub">
            Try a different category or clear your search.
          </p>
          <button
            type="button"
            className="explore-empty__btn"
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="explore-grid">
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </main>
  );
}

function CampaignCard({ campaign: c }: { campaign: Campaign }) {
  const tierAccent: Record<number, string> = {
    1: "var(--ink-5, #888)",
    2: "var(--champagne, #bfa170)",
    3: "var(--ink-4, #61605c)",
    4: "var(--brand-red, #c1121f)",
    5: "var(--accent-blue, #0085ff)",
    6: "var(--ink, #14130f)",
  };
  return (
    <Link
      href={`/creator/login?next=/creator/campaign/${c.id}`}
      className="explore-card"
    >
      <div className="explore-card-img-wrap">
        <NextImage
          src={c.images[0] ?? "/img/placeholder.png"}
          alt={c.title}
          width={400}
          height={280}
          className="explore-card-img"
          unoptimized
        />
        <span
          className="explore-card-tier-chip"
          style={{ background: tierAccent[c.minimumTier] }}
          aria-label={`Tier ${c.minimumTier}`}
        />
        <span className="explore-card-match">{c.matchScore}% match</span>
      </div>
      <div className="explore-card-body">
        <p className="explore-card-merchant">
          <Tag size={11} strokeWidth={2.25} />
          {c.merchantName}
        </p>
        <h3 className="explore-card-title">{c.title}</h3>
        <p className="explore-card-meta">
          <MapPin size={11} strokeWidth={2.25} />
          {c.neighborhood} · {c.distanceMi.toFixed(1)} mi
        </p>
        <div className="explore-card-foot">
          <span className="explore-card-pay">${c.cashPay}</span>
          <span className="explore-card-spots">
            {c.slotsRemaining}/{c.slotsTotal} spots
          </span>
        </div>
      </div>
    </Link>
  );
}
