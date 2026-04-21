"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Campaign } from "@/lib/creator/types";
import type { CampaignPin } from "@/components/layout/MapView";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/creator/constants";
import type { SortKey } from "@/lib/creator/types";
import "./DiscoverFeed.css";

const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
  loading: () => <div className="discover-map-loading" />,
});

interface DiscoverFeedProps {
  campaigns: Campaign[];
  isAuthenticated?: boolean;
  agentBannerText?: string;
}

export default function DiscoverFeed({
  campaigns,
  isAuthenticated,
  agentBannerText,
}: DiscoverFeedProps) {
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [activeId, setActiveId] = useState<string | undefined>();
  const [hoveredId, setHoveredId] = useState<string | undefined>();

  const filtered = useMemo(() => {
    let result = [...campaigns];
    if (filter !== "All") result = result.filter((c) => c.category === filter);
    switch (sortKey) {
      case "highest-pay":
        return result.sort((a, b) => b.payout - a.payout);
      case "ending-soon":
        return result.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        });
      case "most-spots":
        return result.sort((a, b) => b.spots_remaining - a.spots_remaining);
      case "newest":
      default:
        return result;
    }
  }, [campaigns, filter, sortKey]);

  const mapCenter: [number, number] =
    filtered.length > 0
      ? [filtered[0].lat, filtered[0].lng]
      : [40.7218, -74.001];

  // Campaign satisfies CampaignPin: both share id, title, business_name, payout, lat, lng, spots_remaining, description, image, category
  const mapCampaigns: CampaignPin[] = filtered.map((c) => ({
    id: c.id,
    title: c.title,
    business_name: c.business_name,
    payout: c.payout,
    lat: c.lat,
    lng: c.lng,
    spots_remaining: c.spots_remaining,
    description: c.description,
    image: c.image,
    category: c.category,
  }));

  return (
    <div className="discover-feed">
      {agentBannerText && (
        <div className="discover-agent-banner">
          <span className="discover-agent-banner__text">{agentBannerText}</span>
        </div>
      )}

      <div className="discover-layout">
        {/* Left: Filter + List */}
        <div className="discover-panel">
          <div className="discover-filters">
            <div className="discover-filter-chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`discover-chip${filter === cat ? " discover-chip--active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              className="discover-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="discover-count">
            <span className="discover-count__num">{filtered.length}</span>
            <span className="discover-count__label">campaigns</span>
          </div>

          <ul className="discover-list" role="list">
            {filtered.map((c) => (
              <li
                key={c.id}
                className={`discover-row${hoveredId === c.id ? " discover-row--hover" : ""}`}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(undefined)}
              >
                <div className="discover-row__body">
                  <span className="discover-row__business">
                    {c.business_name}
                  </span>
                  <span className="discover-row__title">{c.title}</span>
                  <span className="discover-row__meta">
                    {c.category} &middot; {c.spots_remaining} spot
                    {c.spots_remaining !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="discover-row__right">
                  <span className="discover-row__payout">${c.payout}</span>
                  {isAuthenticated ? (
                    <Link
                      href={`/creator/work/campaign/${c.id}`}
                      className="discover-row__cta"
                    >
                      View
                    </Link>
                  ) : (
                    <Link href="/creator/signup" className="discover-row__cta">
                      Apply
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="discover-empty">
              <p className="discover-empty__title">No campaigns match.</p>
              <p className="discover-empty__body">Try clearing filters.</p>
            </div>
          )}
        </div>

        {/* Right: Map */}
        <div className="discover-map">
          <MapView
            campaigns={mapCampaigns}
            center={mapCenter}
            activeId={activeId ?? hoveredId}
            onPinClick={(id) =>
              setActiveId((prev) => (prev === id ? undefined : id))
            }
            onPopupClose={() => setActiveId(undefined)}
            showPricePills
            showPopups
            mono
          />
        </div>
      </div>
    </div>
  );
}
