"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   Editorial case-study index — v5.1 Vertical AI for Local Commerce
   Client component: filter chips + animated grid.
   Source of truth stays in @/lib/cases/mock-cases — v5.1-flavored
   fields are overlaid per-slug below so this page does not depend on
   schema changes in the shared mock file.
   ───────────────────────────────────────────────────────────── */

export interface IndexCase {
  slug: string;
  name: string;
  category:
    | "Coffee+"
    | "Dessert"
    | "Beauty"
    | "Fitness"
    | "Pizza"
    | "Bodega"
    | "Florals";
  // Editorial bucket for the filter chip (smaller set than raw category)
  filter: "coffee" | "dessert" | "beauty" | "fitness";
  aov: string;
  neighborhood: string;
  heroImage: string;
  headline: string;
  metric: string;
  // Featured card spans 2 cols on desktop
  featured?: boolean;
}

const CHIPS = [
  { id: "all", label: "All" },
  { id: "coffee", label: "Coffee+" },
  { id: "dessert", label: "Dessert" },
  { id: "beauty", label: "Beauty" },
  { id: "fitness", label: "Fitness" },
] as const;

type ChipId = (typeof CHIPS)[number]["id"];

// v5.1 portfolio — 6 cards (1 featured + 5 grid). Uses existing mock-cases
// slugs for the routes that already exist, plus 1 external slug pointing to
// the richer /case-studies/williamsburg-coffee-5 cohort detail.
const INDEX_CASES: IndexCase[] = [
  {
    slug: "williamsburg-coffee-5",
    name: "Williamsburg Coffee+ · First 5 Cohort",
    category: "Coffee+",
    filter: "coffee",
    aov: "AOV $8-20",
    neighborhood: "Williamsburg · 11211 / 11206 / 11249",
    heroImage:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80",
    headline: "Five coffee+ merchants, one 60-day beachhead.",
    metric: "72 verified customers · SLR 9.8 · auto-verify 91% · Week 6",
    featured: true,
  },
  {
    slug: "the-roast-room-chelsea",
    name: "The Roast Room",
    category: "Coffee+",
    filter: "coffee",
    aov: "AOV $8-15",
    neighborhood: "Chelsea, Manhattan",
    heroImage:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80",
    headline: "Single-origin trial converted by ConversionOracle™ matching.",
    metric: "+14 verified customers · SLR 11.2 · Week 1",
  },
  {
    slug: "bloom-florals-williamsburg",
    name: "Bloom Florals",
    category: "Dessert",
    filter: "dessert",
    aov: "AOV $24-48",
    neighborhood: "Williamsburg, Brooklyn",
    heroImage:
      "https://images.unsplash.com/photo-1487530811015-780e8734e6b0?w=1200&q=80",
    headline: "Aesthetic-led pastry pairing — creator tier 3 stack.",
    metric: "+31 verified orders · SLR 8.4 · Week 3",
  },
  {
    slug: "robertas-bed-stuy",
    name: "Roberta's Bed-Stuy",
    category: "Dessert",
    filter: "dessert",
    aov: "AOV $18-32",
    neighborhood: "Bed-Stuy, Brooklyn",
    heroImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80",
    headline: "Off-peak 4-6 PM turned into busiest daypart.",
    metric: "+72 verified walk-ins · SLR 6.1 · Week 4",
  },
  {
    slug: "bodega-azul-bushwick",
    name: "Bodega Azul",
    category: "Beauty",
    filter: "beauty",
    aov: "AOV $12-28",
    neighborhood: "Bushwick, Brooklyn",
    heroImage:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80",
    headline: "Neighborhood Playbook — long-run partnership economics.",
    metric: "+38 verified visits · SLR 7.3 · Week 5",
  },
  {
    slug: "push-pilates-dumbo",
    name: "Push Pilates",
    category: "Fitness",
    filter: "fitness",
    aov: "AOV $38-65",
    neighborhood: "DUMBO, Brooklyn",
    heroImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
    headline: "Seed-tier creators convert trials into full memberships.",
    metric: "+18 verified trials · SLR 9.0 · Week 4",
  },
];

export default function CaseStudiesGrid() {
  const [active, setActive] = useState<ChipId>("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? INDEX_CASES
        : INDEX_CASES.filter((c) => c.filter === active),
    [active],
  );

  return (
    <>
      {/* ── Filter chips ────────────────────────────────────── */}
      <div className="cs-chips" role="tablist" aria-label="Filter case studies">
        {CHIPS.map((chip) => {
          const isActive = active === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`cs-chip ${isActive ? "cs-chip--active" : ""}`}
              onClick={() => setActive(chip.id)}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* ── Editorial grid ──────────────────────────────────── */}
      <div className="cs-grid-v51" data-count={visible.length}>
        {visible.map((c, i) => (
          <Link
            key={c.slug}
            href={`/case-studies/${c.slug}`}
            className={`cs-card-v51 reveal ${c.featured ? "cs-card-v51--featured" : ""}`}
            style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}
          >
            <div className="cs-card-v51-image-wrap">
              <Image
                src={c.heroImage}
                alt={c.name}
                fill
                sizes={
                  c.featured
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 1024px) 100vw, 33vw"
                }
                className="cs-card-v51-image"
                priority={i < 2}
              />
              <div className="cs-card-v51-overlay" aria-hidden="true" />
            </div>

            <div className="cs-card-v51-body">
              <div className="cs-card-v51-eyebrow">
                <span className="cs-card-v51-cat">{c.category}</span>
                <span className="cs-card-v51-aov">{c.aov}</span>
              </div>

              <h2 className="cs-card-v51-title">{c.headline}</h2>

              <p className="cs-card-v51-name">
                <span className="cs-card-v51-name-rule" aria-hidden="true" />
                {c.name} · {c.neighborhood}
              </p>

              <p className="cs-card-v51-metric">{c.metric}</p>

              <span className="cs-card-v51-cta">
                Read
                <span className="cs-card-v51-cta-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="cs-empty">
          No case studies in this category yet. Pilot slots open for{" "}
          <Link href="/merchant/pilot">Williamsburg Coffee+ merchants</Link>.
        </p>
      )}
    </>
  );
}
