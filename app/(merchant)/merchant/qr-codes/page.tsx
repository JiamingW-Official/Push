"use client";

import { useState, useMemo } from "react";
import PosterPreview from "@/components/merchant/qr/PosterPreview";
import {
  MOCK_QR_CODES,
  QR_STATS,
  ACTIVE_CAMPAIGNS_FOR_QR,
  POSTER_TYPE_LABELS,
  type QRCodeRecord,
  type PosterType,
} from "@/lib/attribution/mock-qr-codes-extended";
import "./qr-codes.css";

// TODO: use server-side QR generation
function qrImageUrl(id: string) {
  if (typeof window === "undefined") return "";
  const url = encodeURIComponent(`${window.location.origin}/scan/${id}`);
  return `https://api.qrserver.com/v1/create-qr-code/?data=${url}&size=56x56&color=003049&bgcolor=ffffff`;
}

/* ── Hourly heatmap (mock distribution) ─────────────────── */
const HOURLY_SCAN_WEIGHTS = [
  0, 0, 0, 0, 0, 0, 1, 2, 5, 8, 6, 4, 5, 4, 3, 2, 3, 4, 6, 7, 5, 3, 2, 1,
];

function HourlyHeatmap({ totalScans }: { totalScans: number }) {
  const maxWeight = Math.max(...HOURLY_SCAN_WEIGHTS);
  return (
    <div className="qr-heatmap">
      <div className="qr-heatmap__title">Scan distribution — hourly</div>
      <div className="qr-heatmap__grid">
        {HOURLY_SCAN_WEIGHTS.map((w, i) => {
          const intensity = maxWeight > 0 ? w / maxWeight : 0;
          const scans = Math.round(intensity * totalScans * 0.6);
          const bg =
            intensity === 0
              ? "var(--surface)"
              : `rgba(0,48,73,${0.08 + intensity * 0.72})`;
          return (
            <div
              key={i}
              className="qr-heatmap__cell"
              title={`${i}:00 — ~${scans} scans`}
              style={{ background: bg, border: "none" }}
            />
          );
        })}
      </div>
      <div className="qr-heatmap__labels">
        {["12am", "4am", "8am", "12pm", "4pm", "8pm"].map((l) => (
          <div key={l} className="qr-heatmap__label">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Detail slide-out panel ──────────────────────────────── */
function DetailPanel({
  qr,
  onClose,
}: {
  qr: QRCodeRecord;
  onClose: () => void;
}) {
  const cvr =
    qr.scan_count > 0
      ? Math.round((qr.conversion_count / qr.scan_count) * 100)
      : 0;

  return (
    <>
      <div className="qr-detail-overlay" onClick={onClose} />
      <div className="qr-detail-panel">
        <button className="qr-detail-close" onClick={onClose}>
          ← Close
        </button>

        <div className="qr-detail__campaign">{qr.campaign_name}</div>
        <div className="qr-detail__title">
          {POSTER_TYPE_LABELS[qr.poster_type]}
        </div>

        <div className="qr-detail__qr">
          <img
            src={qrImageUrl(qr.id)}
            alt="QR Code"
            width={160}
            height={160}
            style={{ display: "block", imageRendering: "pixelated" }}
          />
        </div>

        <div className="qr-detail__stats-row">
          <div className="qr-detail__stat">
            <div className="qr-detail__stat-value">{qr.scan_count}</div>
            <div className="qr-detail__stat-label">Scans</div>
          </div>
          <div className="qr-detail__stat">
            <div className="qr-detail__stat-value">{qr.conversion_count}</div>
            <div className="qr-detail__stat-label">Converted</div>
          </div>
          <div className="qr-detail__stat">
            <div className="qr-detail__stat-value">{cvr}%</div>
            <div className="qr-detail__stat-label">CVR</div>
          </div>
        </div>

        <HourlyHeatmap totalScans={qr.scan_count} />

        <div
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--text-muted)",
            paddingTop: "var(--space-3)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div>
            Created:{" "}
            {new Date(qr.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div style={{ marginTop: 4 }}>
            Last active:{" "}
            {new Date(qr.last_active_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div style={{ marginTop: 8, wordBreak: "break-all" }}>
            URL:{" "}
            <span style={{ color: "var(--tertiary)" }}>
              {typeof window !== "undefined"
                ? `${window.location.origin}${qr.scan_url}`
                : qr.scan_url}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── QR Card ─────────────────────────────────────────────── */
function QRCard({
  qr,
  onView,
  onToggle,
  onRegenerate,
}: {
  qr: QRCodeRecord;
  onView: () => void;
  onToggle: () => void;
  onRegenerate: () => void;
}) {
  const cvr =
    qr.scan_count > 0
      ? Math.round((qr.conversion_count / qr.scan_count) * 100)
      : 0;

  const lastActive = new Date(qr.last_active_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className={`qr-card${qr.disabled ? " qr-card--disabled" : ""}`}>
      {/* QR thumbnail */}
      <div className="qr-card__qr-thumb">
        <img
          src={qrImageUrl(qr.id)}
          alt="QR"
          width={56}
          height={56}
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Info */}
      <div className="qr-card__info">
        <div className="qr-card__campaign">{qr.campaign_name}</div>
        <div className="qr-card__meta">
          <span className="qr-card__poster-tag">
            {POSTER_TYPE_LABELS[qr.poster_type]}
          </span>
          <span
            className={`qr-card__status-dot${qr.disabled ? " qr-card__status-dot--disabled" : ""}`}
          />
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {qr.disabled ? "Disabled" : "Active"}
          </span>
        </div>
        <div className="qr-card__last-active">Last active {lastActive}</div>
      </div>

      {/* Stats */}
      <div className="qr-card__stats">
        <div className="qr-card__stat">
          <div className="qr-card__stat-value">{qr.scan_count}</div>
          <div className="qr-card__stat-label">Scans</div>
          <div className="qr-card__stat-cvr">{cvr}% CVR</div>
        </div>

        {/* Actions */}
        <div className="qr-card__actions">
          <button className="qr-action-btn" onClick={onView}>
            View
          </button>
          {qr.disabled ? (
            <button
              className="qr-action-btn qr-action-btn--enable"
              onClick={onToggle}
            >
              Enable
            </button>
          ) : (
            <button
              className="qr-action-btn qr-action-btn--danger"
              onClick={onToggle}
            >
              Disable
            </button>
          )}
          <button className="qr-action-btn" onClick={onRegenerate}>
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
const POSTER_TYPES: { value: PosterType; label: string; dim: string }[] = [
  { value: "a4", label: "A4 Poster", dim: "210×297mm" },
  { value: "table-tent", label: "Table Tent", dim: '4×6"' },
  { value: "window-sticker", label: "Window Sticker", dim: '8×8"' },
  { value: "cash-register", label: "Cash Register", dim: '3×3"' },
];

export default function QRCodesPage() {
  // Generator state
  const [selectedCampaignId, setSelectedCampaignId] = useState(
    ACTIVE_CAMPAIGNS_FOR_QR[0]?.id ?? "",
  );
  const [posterType, setPosterType] = useState<PosterType>("a4");
  const [heroMessage, setHeroMessage] = useState(
    "Earn rewards with your content",
  );
  const [subMessage, setSubMessage] = useState(
    "Scan to join our creator campaign",
  );
  const [generatedQrId, setGeneratedQrId] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  // List state
  const [codes, setCodes] = useState<QRCodeRecord[]>(MOCK_QR_CODES);
  const [filterCampaign, setFilterCampaign] = useState("all");
  const [filterPoster, setFilterPoster] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailQr, setDetailQr] = useState<QRCodeRecord | null>(null);

  // Derived: update hero/sub defaults when campaign changes
  const handleCampaignChange = (id: string) => {
    setSelectedCampaignId(id);
    const campaign = ACTIVE_CAMPAIGNS_FOR_QR.find((c) => c.id === id);
    if (campaign) {
      setHeroMessage("Earn rewards with your content");
      setSubMessage(`Scan to join the ${campaign.name} campaign`);
    }
    setGeneratedQrId(undefined);
  };

  // Generate & preview
  const handleGenerate = () => {
    if (!selectedCampaignId) return;
    setIsGenerating(true);
    // Simulate async generation
    setTimeout(() => {
      const newId = `qr-gen-${Date.now()}`;
      setGeneratedQrId(newId);

      // Write to localStorage for demo persistence
      const stored = JSON.parse(
        localStorage.getItem("push-generated-qrs") ?? "[]",
      );
      const campaign = ACTIVE_CAMPAIGNS_FOR_QR.find(
        (c) => c.id === selectedCampaignId,
      );
      const newRecord: QRCodeRecord = {
        id: newId,
        campaign_id: selectedCampaignId,
        campaign_name: campaign?.name ?? "Campaign",
        poster_type: posterType,
        hero_message: heroMessage,
        sub_message: subMessage,
        scan_url: `/scan/${newId}`,
        scan_count: 0,
        conversion_count: 0,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        disabled: false,
      };
      localStorage.setItem(
        "push-generated-qrs",
        JSON.stringify([newRecord, ...stored]),
      );
      setCodes((prev) => [newRecord, ...prev]);
      setIsGenerating(false);
    }, 600);
  };

  // Print poster
  // TODO: server-side PDF generation via @react-pdf/renderer or pdfkit
  const handleDownload = () => {
    window.print();
  };

  // Toggle disable
  const handleToggle = (id: string) => {
    setCodes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, disabled: !q.disabled } : q)),
    );
  };

  // Regenerate
  const handleRegenerate = (id: string) => {
    const newId = `qr-regen-${Date.now()}`;
    setCodes((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              id: newId,
              scan_count: 0,
              created_at: new Date().toISOString(),
              last_active_at: new Date().toISOString(),
            }
          : q,
      ),
    );
  };

  // Filtered list
  const filteredCodes = useMemo(() => {
    return codes.filter((q) => {
      if (filterCampaign !== "all" && q.campaign_id !== filterCampaign)
        return false;
      if (filterPoster !== "all" && q.poster_type !== filterPoster)
        return false;
      if (filterStatus === "active" && q.disabled) return false;
      if (filterStatus === "disabled" && !q.disabled) return false;
      return true;
    });
  }, [codes, filterCampaign, filterPoster, filterStatus]);

  const selectedCampaign = ACTIVE_CAMPAIGNS_FOR_QR.find(
    (c) => c.id === selectedCampaignId,
  );

  // All unique campaigns in list (including closed ones from mock)
  const allCampaignsInList = useMemo(() => {
    const seen = new Map<string, string>();
    codes.forEach((q) => seen.set(q.campaign_id, q.campaign_name));
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [codes]);

  return (
    <div className="qr-shell">
      {/* Nav */}
      <nav className="qr-nav">
        <a href="/" className="qr-nav__logo">
          Push<span>.</span>
        </a>
        <div className="qr-nav__center">
          <span className="qr-nav__title">QR Code Manager</span>
        </div>
        <a href="/merchant/dashboard" className="qr-nav__back">
          ← Dashboard
        </a>
      </nav>

      {/* Hero */}
      <section className="qr-hero">
        <div className="qr-hero__eyebrow">Merchant · QR Attribution</div>
        <div className="qr-hero__numbers">
          <div className="qr-big-number">
            <div className="qr-big-number__label">QR Codes Generated</div>
            <div className="qr-big-number__value">{codes.length}</div>
          </div>
          <div className="qr-hero__divider" />
          <div className="qr-big-number">
            <div className="qr-big-number__label">Scans This Month</div>
            <div className="qr-big-number__value qr-big-number__value--accent">
              {QR_STATS.scans_this_month}
            </div>
          </div>
        </div>
        <div className="qr-hero__verified">
          Verified conversions this month:{" "}
          <strong>{QR_STATS.verified_conversions_month}</strong>
        </div>
      </section>

      {/* Body */}
      <div className="qr-body">
        {/* Left: Generator */}
        <aside className="qr-generator">
          <div className="qr-generator__title">Generate QR</div>

          {/* Step 1: Campaign */}
          <div className="qr-step">
            <div className="qr-step__label">
              <span className="qr-step__num">1</span>
              Select Campaign
            </div>
            <div className="qr-select-wrapper">
              <select
                className="qr-select"
                value={selectedCampaignId}
                onChange={(e) => handleCampaignChange(e.target.value)}
              >
                {ACTIVE_CAMPAIGNS_FOR_QR.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Poster size */}
          <div className="qr-step">
            <div className="qr-step__label">
              <span className="qr-step__num">2</span>
              Poster Size
            </div>
            <div className="qr-poster-grid">
              {POSTER_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  className={`qr-poster-option${posterType === pt.value ? " selected" : ""}`}
                  onClick={() => {
                    setPosterType(pt.value);
                    setGeneratedQrId(undefined);
                  }}
                >
                  <div className="qr-poster-option__name">{pt.label}</div>
                  <div className="qr-poster-option__dim">{pt.dim}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Custom copy */}
          <div className="qr-step">
            <div className="qr-step__label">
              <span className="qr-step__num">3</span>
              Custom Copy
              <span
                style={{
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  fontSize: 9,
                }}
              >
                (optional)
              </span>
            </div>
            <input
              className="qr-input"
              placeholder="Hero message"
              value={heroMessage}
              onChange={(e) => setHeroMessage(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <textarea
              className="qr-textarea"
              placeholder="Sub message"
              value={subMessage}
              onChange={(e) => setSubMessage(e.target.value)}
            />
          </div>

          {/* Step 4: Generate */}
          <div className="qr-step">
            <div className="qr-step__label">
              <span className="qr-step__num">4</span>
              Generate &amp; Download
            </div>
            <button
              className="qr-generate-btn"
              onClick={handleGenerate}
              disabled={!selectedCampaignId || isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate & Preview"}
            </button>
          </div>

          {/* Poster preview (appears after generate) */}
          {generatedQrId && (
            <div className="qr-preview-section poster-print-target">
              <div className="qr-preview-section__label">Live Preview</div>
              <div className="qr-preview-container">
                <PosterPreview
                  posterType={posterType}
                  heroMessage={heroMessage}
                  subMessage={subMessage}
                  campaignName={selectedCampaign?.name ?? "Campaign"}
                  qrId={generatedQrId}
                />
              </div>
              {/* TODO: server-side PDF generation via @react-pdf/renderer or pdfkit */}
              <button className="qr-download-btn" onClick={handleDownload}>
                Download PDF (Print)
              </button>
            </div>
          )}
        </aside>

        {/* Right: Active QR list */}
        <main className="qr-list-panel">
          <div className="qr-list-header">
            <div className="qr-list-title">Active QR Codes</div>
            <span
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--text-muted)",
              }}
            >
              {filteredCodes.length} showing
            </span>
          </div>

          {/* Filters */}
          <div className="qr-filter-row">
            <select
              className="qr-filter-select"
              value={filterCampaign}
              onChange={(e) => setFilterCampaign(e.target.value)}
            >
              <option value="all">All campaigns</option>
              {allCampaignsInList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="qr-filter-select"
              value={filterPoster}
              onChange={(e) => setFilterPoster(e.target.value)}
            >
              <option value="all">All sizes</option>
              {POSTER_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>

            <button
              className={`qr-filter-btn${filterStatus === "all" ? " active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              All
            </button>
            <button
              className={`qr-filter-btn${filterStatus === "active" ? " active" : ""}`}
              onClick={() => setFilterStatus("active")}
            >
              Active
            </button>
            <button
              className={`qr-filter-btn${filterStatus === "disabled" ? " active" : ""}`}
              onClick={() => setFilterStatus("disabled")}
            >
              Disabled
            </button>
          </div>

          {/* List */}
          {filteredCodes.length === 0 ? (
            <div className="qr-empty">
              <div className="qr-empty__title">No QR codes found</div>
              <div
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--text-muted)",
                  marginTop: 8,
                }}
              >
                Adjust filters or generate a new QR code.
              </div>
            </div>
          ) : (
            filteredCodes.map((qr) => (
              <QRCard
                key={qr.id}
                qr={qr}
                onView={() => setDetailQr(qr)}
                onToggle={() => handleToggle(qr.id)}
                onRegenerate={() => handleRegenerate(qr.id)}
              />
            ))
          )}
        </main>
      </div>

      {/* Detail slide-out */}
      {detailQr && (
        <DetailPanel qr={detailQr} onClose={() => setDetailQr(null)} />
      )}
    </div>
  );
}
