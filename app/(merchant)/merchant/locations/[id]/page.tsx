import Link from "next/link";
import { EmptyState, KPICard, StatusBadge } from "@/components/merchant/shared";
import { api } from "@/lib/data/api-client";
import LocationsMap from "../LocationsMap";
import "../locations.css";

function formatRoi(scans: number, conversions: number): string {
  const roi = (conversions / Math.max(scans, 1)) * 6;
  return `${roi.toFixed(1)}x`;
}

function getOperatingHoursSummary(
  hours: Array<{ day: string; open: string; close: string; closed: boolean }>,
): string {
  const weekday = hours.filter(
    (entry) =>
      !entry.closed &&
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
        entry.day,
      ),
  );
  if (weekday.length === 0) return "Closed";
  return `${weekday[0].open} - ${weekday[weekday.length - 1].close} (Mon-Fri)`;
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = await api.merchant.getLocation(id);

  if (!location) {
    return (
      <section className="location-detail-page">
        <EmptyState
          title="Location not found"
          description="The location ID does not exist yet."
          ctaLabel="Back to locations"
          ctaHref="/merchant/locations"
        />
      </section>
    );
  }

  const manager = location.staff.find((member) =>
    member.role.toLowerCase().includes("manager"),
  );
  const scans30d = location.campaign_history[0]?.scans ?? location.scans_7d * 4;
  const conversions30d = location.conversions_30d;
  const roi = formatRoi(scans30d, conversions30d);
  const trendSeries = [42, 55, 50, 70, 68, 76, 62, 80, 74, 92, 88, 97];

  const totalScansAllTime = location.qr_codes.reduce(
    (sum, qr) => sum + qr.scans_total,
    0,
  );

  return (
    <section className="location-detail-page">
      {/* Photo Card Hero — Pattern § 8.7 + § 8.10
          Cover image + bottom gradient overlay carrying name / address / status / scans.
          Liquid-glass peek (§ 8.9.4) anchors the 30d ROI on the opposite corner. */}
      <header className="loc-hero" aria-label={`${location.name} hero`}>
        <div
          className="loc-hero__photo"
          role="img"
          aria-label={`${location.name} storefront`}
          style={{ backgroundImage: `url(${location.image_url})` }}
        />
        <div className="loc-hero__gradient" aria-hidden="true" />

        <aside
          className="lg-surface loc-hero__peek"
          aria-label="30-day return on ad spend"
        >
          <p className="loc-hero__peek-eyebrow">30D ROI</p>
          <p className="loc-hero__peek-value">{roi}</p>
          <p className="loc-hero__peek-meta">
            {scans30d.toLocaleString()} scans ·{" "}
            {conversions30d.toLocaleString()} conversions
          </p>
        </aside>

        <div className="loc-hero__overlay">
          <p className="loc-hero__eyebrow">LOCATION · {id.toUpperCase()}</p>
          <h1 className="loc-hero__title">{location.name}</h1>
          <p className="loc-hero__address">
            {location.address}, {location.city}, {location.state} {location.zip}
          </p>
          <div className="loc-hero__meta">
            <StatusBadge
              status={location.status === "open" ? "active" : "closed"}
            >
              {location.status === "open" ? "OPEN" : "CLOSED"}
            </StatusBadge>
            <span className="loc-hero__meta-divider" aria-hidden="true">
              ·
            </span>
            <span className="loc-hero__meta-text">
              {totalScansAllTime.toLocaleString()} scans all-time
            </span>
          </div>
          <div className="loc-hero__actions">
            <Link
              href={`/merchant/locations/${location.id}?tab=edit`}
              className="btn-primary loc-hero__cta"
            >
              Edit location
            </Link>
            <button
              type="button"
              className="btn-ghost loc-hero__cta loc-hero__cta--ghost"
            >
              Deactivate
            </button>
          </div>
        </div>
      </header>

      <div className="location-detail-layout">
        <div className="location-detail-main">
          <section className="location-section">
            <h2 className="location-section__title">Overview</h2>
            <div className="location-overview-grid">
              <article>
                <p className="location-overview-label">Manager</p>
                <p className="location-overview-value">
                  {manager?.name ?? "Unassigned"}
                </p>
              </article>
              <article>
                <p className="location-overview-label">Phone</p>
                <p className="location-overview-value">{location.phone}</p>
              </article>
              <article>
                <p className="location-overview-label">Hours</p>
                <p className="location-overview-value">
                  {getOperatingHoursSummary(location.hours)}
                </p>
              </article>
              <article>
                <p className="location-overview-label">Vertical</p>
                <p className="location-overview-value">Coffee & Cafe</p>
              </article>
            </div>
          </section>

          <section className="location-section">
            <h2 className="location-section__title">Performance</h2>
            <div
              className="location-trend-card"
              aria-label="30-day scans trend placeholder"
            >
              <p className="location-trend-card__label">Scans · Last 30 Days</p>
              <div
                className="location-trend-line"
                role="img"
                aria-label="Scan trend line chart placeholder"
              >
                {trendSeries.map((value, index) => (
                  <span key={index} style={{ height: `${value}%` }} />
                ))}
              </div>
            </div>
            <div className="location-kpi-grid">
              <KPICard label="Scans (30d)" value={scans30d} />
              <KPICard label="Conversions (30d)" value={conversions30d} />
              <KPICard label="ROI" value={roi} variant="accent" />
            </div>
          </section>

          <section className="location-section">
            <h2 className="location-section__title">Campaign Roster</h2>
            {location.campaign_history.length === 0 ? (
              <EmptyState
                title="No campaigns yet"
                description="Attach the first campaign to activate this venue."
              />
            ) : (
              <div className="location-campaign-list">
                {location.campaign_history.slice(0, 6).map((campaign) => (
                  <article key={campaign.id} className="location-campaign-item">
                    <div>
                      <p className="location-campaign-item__title">
                        {campaign.title}
                      </p>
                      <p className="location-campaign-item__meta">
                        {campaign.period}
                      </p>
                    </div>
                    <div className="location-campaign-item__right">
                      <StatusBadge status={campaign.status} />
                      <p className="location-campaign-item__meta">
                        {campaign.scans} scans
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="location-section">
            <h2 className="location-section__title">Scan Log</h2>
            {location.qr_codes.length === 0 ? (
              <EmptyState
                title="No scan logs"
                description="QR scans will populate this table once posters go live."
              />
            ) : (
              <div className="location-log-table-wrap">
                <table className="location-log-table">
                  <thead>
                    <tr>
                      <th>QR Label</th>
                      <th>Today</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {location.qr_codes.map((qr) => (
                      <tr key={qr.id}>
                        <td>{qr.label}</td>
                        <td>{qr.scans_today}</td>
                        <td>{qr.scans_total}</td>
                        <td>{qr.active ? "Active" : "Paused"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="location-detail-aside">
          <div className="location-sticky-card">
            <div className="location-sticky-map">
              <LocationsMap locations={[location]} selectedId={location.id} />
            </div>
            <p className="location-sticky-address">
              {location.address}, {location.city}, {location.state}{" "}
              {location.zip}
            </p>
            <Link
              href={`/merchant/qr-codes?location=${location.id}`}
              className="btn-primary location-sticky-btn"
            >
              Order QR Posters
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
