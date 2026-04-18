"use client";

import { useState } from "react";

/**
 * Retention Add-on tabs — Coffee tier ($8/$6/$4) vs Fitness tier ($24/$18/$12).
 * Two pill chips toggle between tier tables.
 * Chip radius = 50vh (Design.md filter-chip exception).
 */

type Tier = {
  id: "coffee" | "fitness";
  label: string;
  caption: string;
  rows: { event: string; window: string; rate: string }[];
};

const TIERS: Tier[] = [
  {
    id: "coffee",
    label: "Coffee tier",
    caption: "Coffee · Coffee+ · Dessert",
    rows: [
      { event: "Verified visit 2", window: "within 30 days", rate: "$8" },
      { event: "Verified visit 3", window: "within 60 days", rate: "$6" },
      { event: "Loyalty opt-in", window: "at first visit", rate: "$4" },
    ],
  },
  {
    id: "fitness",
    label: "Fitness · Beauty tier",
    caption: "Boutique fitness · Beauty service",
    rows: [
      { event: "Verified visit 2", window: "within 30 days", rate: "$24" },
      { event: "Verified visit 3", window: "within 60 days", rate: "$18" },
      { event: "Loyalty opt-in", window: "at first visit", rate: "$12" },
    ],
  },
];

export default function RetentionTabs() {
  const [active, setActive] = useState<Tier["id"]>("coffee");
  const current = TIERS.find((t) => t.id === active) ?? TIERS[0];

  return (
    <div className="pr-ret-wrap">
      <div
        className="pr-ret-tabs"
        role="tablist"
        aria-label="Select retention tier"
      >
        {TIERS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="pr-ret-table"
              className={`pr-ret-tab${isActive ? " pr-ret-tab--active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="pr-ret-caption">{current.caption}</p>

      <div
        id="pr-ret-table"
        className="pr-ret-table"
        role="tabpanel"
        aria-live="polite"
      >
        <div className="pr-ret-row pr-ret-row--head">
          <span className="pr-ret-col">Event</span>
          <span className="pr-ret-col">Window</span>
          <span className="pr-ret-col pr-ret-col--right">Rate</span>
        </div>
        {current.rows.map((row) => (
          <div key={row.event} className="pr-ret-row">
            <span className="pr-ret-col">{row.event}</span>
            <span className="pr-ret-col">{row.window}</span>
            <span className="pr-ret-col pr-ret-col--right pr-ret-rate">
              {row.rate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
