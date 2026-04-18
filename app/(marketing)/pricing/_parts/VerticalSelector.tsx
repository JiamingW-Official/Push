"use client";

import { useState } from "react";

/**
 * Vertical selector — pill chips + dynamic hero rate display.
 * Williamsburg Coffee+ beachhead uses Coffee+ as default.
 * Chip radius = 50vh (Design.md pill-shaped exception for filter chips).
 */

type VerticalChoice = {
  slug: string;
  label: string;
  rate: number;
  tagline: string;
};

const VERTICALS: VerticalChoice[] = [
  {
    slug: "coffee",
    label: "Coffee",
    rate: 15,
    tagline: "Pure coffee · $5–8 ticket · high volume",
  },
  {
    slug: "coffee-plus",
    label: "Coffee+",
    rate: 25,
    tagline: "Williamsburg beachhead · $10–20 ticket",
  },
  {
    slug: "dessert",
    label: "Dessert",
    rate: 22,
    tagline: "Specialty dessert · $6–15 ticket",
  },
  {
    slug: "fitness",
    label: "Fitness",
    rate: 60,
    tagline: "Boutique trial class · $30–90 ticket",
  },
  {
    slug: "beauty",
    label: "Beauty",
    rate: 85,
    tagline: "Service studio · $50–150 ticket",
  },
];

export default function VerticalSelector() {
  const [active, setActive] = useState<string>("coffee-plus");
  const current = VERTICALS.find((v) => v.slug === active) ?? VERTICALS[1];

  return (
    <div className="pr-vs-wrap">
      <div className="pr-vs-chips" role="tablist" aria-label="Select vertical">
        {VERTICALS.map((v) => {
          const isActive = v.slug === active;
          return (
            <button
              key={v.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="pr-vs-display"
              className={`pr-vs-chip${isActive ? " pr-vs-chip--active" : ""}`}
              onClick={() => setActive(v.slug)}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      <div
        id="pr-vs-display"
        className="pr-vs-display"
        role="tabpanel"
        aria-live="polite"
      >
        <span className="pr-vs-num">${current.rate}</span>
        <span className="pr-vs-unit">/verified customer</span>
      </div>

      <p className="pr-vs-caption">{current.tagline}</p>

      <div className="pr-vs-deep">
        <a
          href={`/pricing/${current.slug}`}
          className="pr-vs-deep-link"
          aria-label={`See ${current.label} unit economics`}
        >
          See {current.label.toLowerCase()} unit economics
          <span aria-hidden="true" className="pr-vs-deep-arrow">
            &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
