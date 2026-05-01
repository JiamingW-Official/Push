"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  EmptyState,
  FilterTabs,
  KPICard,
  PageHeader,
  StatusBadge,
} from "@/components/merchant/shared";
import LocationsMap from "./LocationsMap";
import "./locations.css";

type StatusFilter = "all" | "active" | "closed";
type LocationRecord = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  status: "open" | "closed";
  scans_7d: number;
  conversions_30d: number;
  campaign_history: Array<{ scans: number }>;
  lat: number;
  lng: number;
};

function formatRoi(location: LocationRecord): string {
  const roi = (location.conversions_30d / Math.max(location.scans_7d, 1)) * 6;
  return `${roi.toFixed(1)}x`;
}

function toStatusFilter(
  location: LocationRecord,
): Exclude<StatusFilter, "all"> {
  return location.status === "open" ? "active" : "closed";
}

export default function LocationsPageClient({
  locations,
}: {
  locations: LocationRecord[];
}) {
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    locations[0]?.id ?? null,
  );

  const cities = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(locations.map((location) => location.city))),
    ];
  }, [locations]);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const cityMatches = cityFilter === "all" || location.city === cityFilter;
      const statusMatches =
        statusFilter === "all" || toStatusFilter(location) === statusFilter;
      return cityMatches && statusMatches;
    });
  }, [cityFilter, locations, statusFilter]);

  const activeLocations = locations.filter(
    (location) => location.status === "open",
  ).length;
  const scansThisMonth = locations.reduce(
    (sum, location) =>
      sum + (location.campaign_history[0]?.scans ?? location.scans_7d * 4),
    0,
  );
  const topVenueByRoi = locations.length
    ? locations.reduce((top, location) => {
        const topRoi = Number.parseFloat(formatRoi(top));
        const currentRoi = Number.parseFloat(formatRoi(location));
        return currentRoi > topRoi ? location : top;
      }, locations[0])
    : null;

  const cityTabs = cities.map((city) => ({
    value: city,
    label: city === "all" ? "All Cities" : city,
    count:
      city === "all"
        ? locations.length
        : locations.filter((location) => location.city === city).length,
  }));

  const statusTabs = [
    { value: "all", label: "All Status", count: locations.length },
    {
      value: "active",
      label: "Active",
      count: locations.filter(
        (location) => toStatusFilter(location) === "active",
      ).length,
    },
    {
      value: "closed",
      label: "Closed",
      count: locations.filter(
        (location) => toStatusFilter(location) === "closed",
      ).length,
    },
  ];

  // Selected location object — drives the liquid-glass detail peek over the map
  const selectedLocation = useMemo(
    () =>
      filteredLocations.find((location) => location.id === selectedId) ?? null,
    [filteredLocations, selectedId],
  );

  return (
    <section className="locations-page">
      <PageHeader
        eyebrow="LOCATIONS"
        title="Locations"
        subtitle="Attribution-enabled venues where Push QR codes are live."
        action={
          <Link href="../locations/new" className="locations-add-link">
            + Add Location
          </Link>
        }
      />

      <div className="locations-kpi-row">
        <KPICard
          label="Active Locations"
          value={activeLocations}
          delta={`${Math.round((activeLocations / Math.max(locations.length, 1)) * 100)}% online`}
          delay={40}
        />
        <KPICard
          label="Scans This Month"
          value={scansThisMonth.toLocaleString()}
          delta="Across all venues"
          delay={100}
        />
        <KPICard
          label="Top Venue by ROI"
          value={topVenueByRoi ? formatRoi(topVenueByRoi) : "0.0x"}
          delta={topVenueByRoi?.name ?? "No locations"}
          variant="accent"
          delay={160}
        />
      </div>

      <div className="locations-filter-row">
        <FilterTabs
          tabs={cityTabs}
          value={cityFilter}
          onChange={setCityFilter}
        />
        <FilterTabs
          tabs={statusTabs}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as StatusFilter)}
        />
      </div>

      {filteredLocations.length === 0 ? (
        <div className="locations-empty-wrap">
          <EmptyState
            title="No matching locations"
            description="Try a different city or status filter to inspect live venues."
            ctaLabel="Reset filters"
            ctaOnClick={() => {
              setCityFilter("all");
              setStatusFilter("all");
            }}
          />
        </div>
      ) : (
        <div className="locations-main-grid">
          <aside className="locations-list-panel" aria-label="Location cards">
            <div className="locations-list-panel__heading">
              <span className="locations-list-panel__eyebrow">Venues</span>
              <span className="locations-list-panel__count">
                {filteredLocations.length} of {locations.length}
              </span>
            </div>

            {filteredLocations.map((location) => {
              const isSelected = location.id === selectedId;
              return (
                <div
                  key={location.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  className={`location-card${isSelected ? " location-card--selected" : ""}`}
                  onClick={() => setSelectedId(location.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(location.id);
                    }
                  }}
                >
                  <div className="location-card__top">
                    <div>
                      <p className="location-card__name">{location.name}</p>
                      <p
                        className="location-card__address"
                        title={`${location.address}, ${location.city}, ${location.state}`}
                      >
                        {location.address}, {location.city}, {location.state}
                      </p>
                    </div>
                    <StatusBadge
                      status={location.status === "open" ? "active" : "closed"}
                    />
                  </div>

                  <div className="location-card__meta">
                    <span className="location-card__meta-stat">
                      <strong>{location.scans_7d}</strong>
                      <span>scans · 7d</span>
                    </span>
                    <span className="location-card__meta-stat">
                      <strong>{formatRoi(location)}</strong>
                      <span>ROI</span>
                    </span>
                    <Link
                      href={`/merchant/locations/${location.id}`}
                      className="location-card__link"
                      onClick={(event) => event.stopPropagation()}
                    >
                      View →
                    </Link>
                  </div>
                </div>
              );
            })}
          </aside>

          <div className="locations-map-panel">
            <LocationsMap
              locations={filteredLocations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            {selectedLocation && (
              <article
                className="locations-detail-peek"
                aria-live="polite"
                aria-label={`Selected location: ${selectedLocation.name}`}
              >
                <span className="locations-detail-peek__eyebrow">
                  Selected Venue
                </span>
                <h3 className="locations-detail-peek__title">
                  {selectedLocation.name}
                </h3>
                <p className="locations-detail-peek__address">
                  {selectedLocation.address}, {selectedLocation.city},{" "}
                  {selectedLocation.state}
                </p>
                <div className="locations-detail-peek__row">
                  <div className="locations-detail-peek__metric">
                    <span className="locations-detail-peek__metric-value">
                      {selectedLocation.scans_7d.toLocaleString()}
                    </span>
                    <span className="locations-detail-peek__metric-label">
                      Scans · 7d
                    </span>
                  </div>
                  <div className="locations-detail-peek__metric">
                    <span className="locations-detail-peek__metric-value">
                      {formatRoi(selectedLocation)}
                    </span>
                    <span className="locations-detail-peek__metric-label">
                      ROI
                    </span>
                  </div>
                  <div className="locations-detail-peek__metric">
                    <span className="locations-detail-peek__metric-value">
                      {selectedLocation.status === "open" ? "Live" : "Paused"}
                    </span>
                    <span className="locations-detail-peek__metric-label">
                      Status
                    </span>
                  </div>
                </div>
                <Link
                  href={`/merchant/locations/${selectedLocation.id}`}
                  className="locations-detail-peek__cta"
                >
                  Open venue →
                </Link>
              </article>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
