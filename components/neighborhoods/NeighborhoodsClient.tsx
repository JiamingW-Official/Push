"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Neighborhood, Borough } from "@/lib/neighborhoods/mock-hoods";

type Props = {
  neighborhoods: Neighborhood[];
  boroughs: Borough[];
};

export default function NeighborhoodsClient({
  neighborhoods,
  boroughs,
}: Props) {
  const [activeBorough, setActiveBorough] = useState<Borough | "All">("All");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const filtered =
    activeBorough === "All"
      ? neighborhoods
      : neighborhoods.filter((n) => n.borough === activeBorough);

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = (entry.target as HTMLElement).dataset.slug;
            if (slug) {
              setRevealed((prev) => new Set([...prev, slug]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filtered]);

  // Borough counts
  const boroughCounts = boroughs.reduce<Record<string, number>>((acc, b) => {
    acc[b] = neighborhoods.filter((n) => n.borough === b).length;
    return acc;
  }, {});

  return (
    <>
      {/* Borough tabs */}
      <div className="nh-tabs-bar">
        <div className="container">
          <div className="nh-tabs-inner" role="tablist">
            <button
              role="tab"
              aria-selected={activeBorough === "All"}
              className={`nh-tab${activeBorough === "All" ? " active" : ""}`}
              onClick={() => setActiveBorough("All")}
            >
              All ({neighborhoods.length})
            </button>
            {boroughs.map((b) => (
              <button
                key={b}
                role="tab"
                aria-selected={activeBorough === b}
                className={`nh-tab${activeBorough === b ? " active" : ""}`}
                onClick={() => setActiveBorough(b)}
              >
                {b} ({boroughCounts[b] ?? 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="nh-grid-section">
        <div className="container">
          <div
            className="section-marker"
            data-num="04"
            style={{ marginTop: "var(--space-3)" }}
          >
            The wider list
          </div>
          <div className="nh-section-header">
            <h2 className="nh-section-title">
              {activeBorough === "All"
                ? "Every block we've mapped."
                : activeBorough}
              {activeBorough === "All" && (
                <>
                  {" "}
                  <span className="display-ghost">Pilot is three of them.</span>
                </>
              )}
            </h2>
            <span className="nh-section-count">
              {filtered.length} block{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="nh-grid">
            {filtered.map((n) => (
              <Link
                key={n.slug}
                href={`/neighborhoods/${n.slug}`}
                className={`nh-card reveal${revealed.has(n.slug) ? " visible" : ""}`}
                data-slug={n.slug}
                ref={(el) => {
                  if (el) cardRefs.current.set(n.slug, el);
                  else cardRefs.current.delete(n.slug);
                }}
                aria-label={`${n.name}, ${n.borough} — ${n.stats.activeCampaigns} active campaigns`}
              >
                {/* Image / placeholder */}
                <div className="nh-card-img-wrap">
                  <div className="nh-card-placeholder" aria-hidden="true">
                    <span className="nh-card-placeholder-text">
                      {n.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  </div>
                  <span className="nh-card-borough-chip">{n.borough}</span>
                </div>

                {/* Body */}
                <div className="nh-card-body">
                  <h3 className="nh-card-name">{n.name}</h3>

                  <div className="nh-card-meta">
                    <div className="nh-card-meta-item">
                      <span className="nh-card-meta-value">
                        {n.stats.activeMerchants}
                      </span>
                      <span className="nh-card-meta-label">Merchants</span>
                    </div>
                    <div className="nh-card-meta-item">
                      <span className="nh-card-meta-value">
                        {n.stats.activeCreators}
                      </span>
                      <span className="nh-card-meta-label">Creators</span>
                    </div>
                    <div className="nh-card-meta-item">
                      <span className="nh-card-meta-value">
                        {n.stats.activeCampaigns}
                      </span>
                      <span className="nh-card-meta-label">Campaigns</span>
                    </div>
                  </div>

                  <p className="nh-card-category">Top: {n.stats.topCategory}</p>

                  <span className="nh-card-cta">Walk {n.name} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
