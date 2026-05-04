"use client";

import { useMemo, useState } from "react";
import {
  EmptyState,
  FilterTabs,
  KPICard,
  PageHeader,
  StatusBadge,
} from "@/components/merchant/shared";
import "./qr-codes.css";

type PosterFilterType =
  | "all"
  | "a4"
  | "table-tent"
  | "window-sticker"
  | "cash-register";
type QRCodeRecord = Awaited<
  ReturnType<
    (typeof import("@/lib/data/api-client"))["api"]["merchant"]["qrCodes"]["list"]
  >
>[number];

const POSTER_TYPE_LABELS: Record<Exclude<PosterFilterType, "all">, string> = {
  a4: "A4 Poster",
  "table-tent": 'Table Tent 4×6"',
  "window-sticker": 'Window Sticker 8×8"',
  "cash-register": 'Cash Register 3×3"',
};

function slug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

const typeTabs = [
  { value: "all", label: "All types" },
  { value: "a4", label: "A4 Poster" },
  { value: "table-tent", label: 'Table Tent 4×6"' },
  { value: "window-sticker", label: 'Window Sticker 8×8"' },
  { value: "cash-register", label: 'Cash Register 3×3"' },
];

function formatCurrency(valueInCents: number): string {
  return `$${(valueInCents / 100).toLocaleString("en-US")}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function renderHandle(handle: string) {
  return handle.startsWith("@") ? handle.slice(1) : handle;
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function QRCodesClient({
  initialQRs,
}: {
  initialQRs: QRCodeRecord[];
}) {
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<PosterFilterType>("all");

  const campaignTabs = useMemo(
    () => [
      { value: "all", label: "All campaigns" },
      ...Array.from(new Set(initialQRs.map((item) => item.campaign_name))).map(
        (campaign) => ({
          value: slug(campaign),
          label: campaign,
        }),
      ),
    ],
    [initialQRs],
  );

  const filtered = useMemo(() => {
    return initialQRs.filter((item) => {
      const campaignMatch =
        campaignFilter === "all" || slug(item.campaign_name) === campaignFilter;
      const typeMatch = typeFilter === "all" || item.poster_type === typeFilter;
      return campaignMatch && typeMatch;
    });
  }, [campaignFilter, initialQRs, typeFilter]);

  const generatedCount = initialQRs.length;
  const totalScans = initialQRs.reduce((sum, item) => sum + item.scan_count, 0);
  const todayScans = initialQRs
    .filter((q) => isToday(q.last_active_at))
    .reduce((sum, item) => sum + Math.min(item.scan_count, 8), 0);

  return (
    <section className="qr-page">
      <PageHeader
        eyebrow="CREATIVE"
        title="QR Codes & Posters"
        subtitle="Print-ready QR codes that link each scan back to your Push campaigns."
        action={
          <button type="button" className="btn-primary">
            Generate new QR
          </button>
        }
      />

      <div className="qr-kpi-grid">
        <KPICard
          label="Generated"
          value={formatNumber(generatedCount)}
          delay={40}
        />
        <KPICard
          label="Total scans"
          value={formatNumber(totalScans)}
          delay={100}
        />
        <article className="qr-glass-tile" aria-label="Today's scans">
          <p className="qr-glass-eyebrow">TODAY&rsquo;S SCANS</p>
          <p className="qr-glass-stat">{formatNumber(todayScans)}</p>
          <p className="qr-glass-caption">
            Live counter — scans recorded since midnight.
          </p>
        </article>
      </div>

      {initialQRs.length === 0 ? (
        <div className="qr-empty-wrap">
          <EmptyState
            title="NO QR CODES YET"
            description="Accept an applicant in /merchant/applicants to auto-generate their QR code."
          />
        </div>
      ) : (
        <>
          <div className="qr-filters">
            <FilterTabs
              tabs={campaignTabs}
              value={campaignFilter}
              onChange={setCampaignFilter}
            />
            <FilterTabs
              tabs={typeTabs}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as PosterFilterType)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="qr-empty-wrap">
              <EmptyState
                title="No poster templates"
                description="Try a different campaign or QR type filter."
              />
            </div>
          ) : (
            <div className="qr-poster-grid" aria-label="Poster template grid">
              {filtered.map((item: QRCodeRecord) => (
                <article key={item.id} className="qr-poster-card">
                  <header className="qr-poster-head">
                    <span>{item.campaign_name}</span>
                    <span className="qr-poster-head__type">
                      {POSTER_TYPE_LABELS[item.poster_type]}
                    </span>
                  </header>

                  <StatusBadge status={item.disabled ? "paused" : "active"} />

                  <p className="qr-card__creator">
                    Creator:{" "}
                    <strong>@{renderHandle(item.creator_handle)}</strong>
                  </p>

                  <div className="qr-poster-code" aria-hidden="true">
                    <svg
                      viewBox="0 0 64 64"
                      width="96"
                      height="96"
                      fill="none"
                      role="img"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="60"
                        height="60"
                        stroke="#000"
                        strokeWidth="1"
                      />
                      <rect x="8" y="8" width="12" height="12" fill="#000" />
                      <rect x="44" y="8" width="12" height="12" fill="#000" />
                      <rect x="8" y="44" width="12" height="12" fill="#000" />
                      <rect x="26" y="26" width="4" height="4" fill="#000" />
                      <rect x="34" y="26" width="4" height="4" fill="#000" />
                      <rect x="26" y="34" width="4" height="4" fill="#000" />
                      <rect x="34" y="34" width="4" height="4" fill="#000" />
                    </svg>
                  </div>

                  <div
                    className="qr-card__stats"
                    aria-label="QR code performance"
                  >
                    <div className="qr-card__stat">
                      <span className="qr-card__stat-label">Scans</span>
                      <strong className="qr-card__stat-value">
                        {formatNumber(item.scan_count)}
                      </strong>
                    </div>
                    <div className="qr-card__stat">
                      <span className="qr-card__stat-label">Conversions</span>
                      <strong className="qr-card__stat-value">
                        {formatNumber(item.verified_customers)}
                      </strong>
                    </div>
                    <div className="qr-card__stat">
                      <span className="qr-card__stat-label">Revenue</span>
                      <strong className="qr-card__stat-value">
                        {formatCurrency(item.attributed_revenue)}
                      </strong>
                    </div>
                  </div>

                  <div className="qr-card__actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      aria-label={`Download QR for ${item.campaign_name}`}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      aria-label={`Print QR for ${item.campaign_name}`}
                    >
                      Print
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
