"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  MOCK_PROFILES,
  type CreatorProfile,
  type GalleryItem,
  type PastCampaign,
} from "@/lib/portfolio/mock-profiles";
import {
  TIERS,
  TIER_ORDER,
  getNextTier,
  type CreatorTier,
} from "@/lib/tier-config";
import "./portfolio.css";

// Use maya-eats-nyc as the demo "logged-in" creator
const DEMO_PROFILE: CreatorProfile = MOCK_PROFILES[0];

type EditableHeader = {
  displayName: string;
  neighborhood: string;
  bio: string;
  instagramHandle: string;
  tiktokHandle: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function tierNormalized(tier: string): CreatorTier {
  const map: Record<string, CreatorTier> = {
    seed: "Seed",
    explorer: "Explorer",
    operator: "Operator",
    proven: "Proven",
    closer: "Closer",
    partner: "Partner",
    Seed: "Seed",
    Explorer: "Explorer",
    Operator: "Operator",
    Proven: "Proven",
    Closer: "Closer",
    Partner: "Partner",
  };
  return map[tier] ?? "Seed";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TierProgressBar({
  tier,
  score,
}: {
  tier: CreatorTier;
  score: number;
}) {
  const tierCfg = TIERS[tier];
  const nextTier = getNextTier(tier);
  const nextCfg = nextTier ? TIERS[nextTier] : null;
  const pct = nextCfg
    ? Math.min(
        100,
        Math.round(
          ((score - tierCfg.minScore) / (nextCfg.minScore - tierCfg.minScore)) *
            100,
        ),
      )
    : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {tier}
        </span>
        {nextTier && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-4)",
            }}
          >
            Next: {nextTier} ({nextCfg!.minScore - score} pts away)
          </span>
        )}
      </div>
      <div
        style={{
          height: 6,
          background: "var(--surface-3)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "var(--brand-red)",
            borderRadius: 3,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {TIER_ORDER.map((t) => {
          const active = TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(tier);
          return (
            <div
              key={t}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: active ? "var(--brand-red)" : "var(--surface-3)",
                  border: "1px solid var(--hairline)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  color: active ? "var(--ink-3)" : "var(--ink-4)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {t}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type GalleryFilter = "all" | "campaign" | "platform" | "date";

function GalleryEditor({
  items,
  onChange,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}) {
  const [addUrl, setAddUrl] = useState("");
  const [addCaption, setAddCaption] = useState("");
  const [filter, setFilter] = useState<GalleryFilter>("all");

  function addItem() {
    if (!addUrl.trim() || items.length >= 24) return;
    const newItem: GalleryItem = {
      id: `g${Date.now()}`,
      type:
        addUrl.includes("youtube") || addUrl.includes("vimeo")
          ? "video"
          : "image",
      url: addUrl.trim(),
      caption: addCaption.trim(),
      visible: true,
    };
    onChange([...items, newItem]);
    setAddUrl("");
    setAddCaption("");
  }

  function removeItem(id: string) {
    onChange(items.filter((i) => i.id !== id));
  }

  function toggleVisible(id: string) {
    onChange(
      items.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)),
    );
  }

  const FILTERS: { key: GalleryFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "campaign", label: "By Campaign" },
    { key: "platform", label: "By Platform" },
    { key: "date", label: "By Date" },
  ];

  // Filter is decorative in this demo (no campaign/platform metadata on GalleryItem)
  const visibleItems = items;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filter tabs — v11 btn-pill keyboard-navigable */}
      <div className="pf-filter-row" role="group" aria-label="Filter gallery">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`btn-pill${filter === key ? " btn-pill--active" : ""}`}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Photo-card grid */}
      <div className="pf-gallery-grid">
        {visibleItems.length === 0 ? (
          /* Empty state */
          <div className="pf-gallery-empty">
            <p className="pf-gallery-empty-title">No content yet</p>
            <p className="pf-gallery-empty-sub">
              Add your first post below — up to 24 items
            </p>
            <button
              type="button"
              className="btn-primary click-shift"
              onClick={() => {
                const el = document.querySelector<HTMLInputElement>(
                  ".pf-gallery-add input[type=url]",
                );
                el?.focus();
              }}
            >
              Add first post
            </button>
          </div>
        ) : (
          visibleItems.map((item) => (
            <div
              key={item.id}
              className={`pf-gallery-item${item.visible ? "" : " pf-gallery-item--hidden"}`}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.caption}
                  className="pf-gallery-img"
                />
              ) : (
                <div className="pf-gallery-video-placeholder">
                  <span className="pf-gallery-video-icon">▶</span>
                  <span className="pf-gallery-video-label">Video</span>
                </div>
              )}

              {/* Black gradient overlay */}
              <div className="pf-gallery-overlay" aria-hidden="true" />

              {/* Stats / caption at bottom */}
              <div className="pf-gallery-stats" aria-hidden="true">
                {item.caption && (
                  <p className="pf-gallery-caption">{item.caption}</p>
                )}
                <span className="pf-gallery-meta">
                  {item.visible ? "Visible" : "Hidden"}
                </span>
              </div>

              {/* Action buttons — appear on hover */}
              <div className="pf-gallery-item-actions">
                <button
                  type="button"
                  className="pf-gallery-action-btn"
                  onClick={() => toggleVisible(item.id)}
                  aria-label={item.visible ? "Hide post" : "Show post"}
                >
                  {item.visible ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  className="pf-gallery-action-btn pf-gallery-action-btn--danger"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove post"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new item form */}
      {items.length < 24 && (
        <div className="pf-gallery-add">
          <p className="pf-gallery-add-label">ADD ITEM ({items.length}/24)</p>
          <div className="pf-gallery-add-row">
            <input
              type="url"
              placeholder="Image URL or YouTube/Vimeo link"
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                background: "var(--surface)",
                border: "1px solid var(--mist)",
                borderRadius: 8,
                padding: "12px 16px",
                color: "var(--ink)",
                outline: "none",
                width: "100%",
                boxSizing: "border-box" as const,
              }}
            />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={addCaption}
              onChange={(e) => setAddCaption(e.target.value)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                background: "var(--surface)",
                border: "1px solid var(--mist)",
                borderRadius: 8,
                padding: "12px 16px",
                color: "var(--ink)",
                outline: "none",
                width: "100%",
                boxSizing: "border-box" as const,
              }}
            />
            <button
              type="button"
              className="btn-primary click-shift"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignsEditor({
  campaigns,
  onChange,
}: {
  campaigns: PastCampaign[];
  onChange: (campaigns: PastCampaign[]) => void;
}) {
  function toggleVisible(id: string) {
    onChange(
      campaigns.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
    );
  }

  const sorted = [...campaigns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {sorted.map((c) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0",
            borderBottom: "1px dotted var(--hairline)",
            opacity: c.visible ? 1 : 0.5,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              {c.brand}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
              }}
            >
              {c.neighborhood}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {[
              { label: "Earned", value: `$${c.earnings}` },
              { label: "Visits", value: c.verifiedVisits },
              { label: "Delivery", value: c.deliveryTime },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink)",
                    fontWeight: 600,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    color: "var(--ink-4)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
              }}
            >
              {c.date}
            </span>
            <button
              type="button"
              className="btn-ghost click-shift"
              onClick={() => toggleVisible(c.id)}
              style={{
                fontSize: 11,
                padding: "4px 12px",
                color: c.visible ? "var(--ink-3)" : "var(--ink-4)",
              }}
            >
              {c.visible ? "Visible" : "Hidden"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [profile] = useState<CreatorProfile>(DEMO_PROFILE);
  const [header, setHeader] = useState<EditableHeader>({
    displayName: profile.displayName,
    neighborhood: profile.neighborhood,
    bio: profile.bio,
    instagramHandle: profile.instagramHandle ?? "",
    tiktokHandle: profile.tiktokHandle ?? "",
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(profile.gallery);
  const [campaigns, setCampaigns] = useState<PastCampaign[]>(
    profile.pastCampaigns,
  );
  const [editingHeader, setEditingHeader] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const tier = tierNormalized(profile.tier);
  const publicUrl = `push.nyc/c/${profile.handle}`;

  function handleHeaderChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 500) return;
    setHeader((prev) => ({ ...prev, [name]: value }));
  }

  function saveHeader() {
    setEditingHeader(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function copyUrl() {
    navigator.clipboard.writeText(`https://${publicUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputStyle = {
    fontFamily: "var(--font-body)",
    fontSize: 14,
    color: "var(--ink)",
    background: "var(--surface)",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    padding: "10px 14px",
    outline: "none",
    width: "100%",
  } as React.CSSProperties;

  const labelStyle = {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    color: "var(--ink-4)",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100vh",
        paddingBottom: 96,
      }}
    >
      {/* Back nav */}
      <div
        style={{
          borderBottom: "1px solid var(--hairline)",
          padding: "16px 64px",
        }}
      >
        <Link
          href="/creator/dashboard"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-4)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          ← Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 64px" }}>
        {/* ── Page header ────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            paddingTop: 40,
            paddingBottom: 32,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              MY PORTFOLIO
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 700,
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {header.displayName}
            </h1>
          </div>

          {/* Share bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  color: "var(--ink-4)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Public URL
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink)",
                }}
              >
                {publicUrl}
              </span>
            </div>
            <button
              type="button"
              className="btn-ghost click-shift"
              onClick={copyUrl}
              style={{ whiteSpace: "nowrap" }}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={`/c/${profile.handle}`}
              className="btn-primary click-shift"
              target="_blank"
              style={{ whiteSpace: "nowrap" }}
            >
              Preview
            </Link>
          </div>
        </div>

        {saved && (
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-3)",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
              padding: "6px 16px",
              marginBottom: 16,
            }}
          >
            Changes saved
          </div>
        )}

        {/* ── Stats bar ──────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            { value: profile.totalCampaigns, label: "Total Campaigns" },
            {
              value: formatNumber(profile.verifiedVisits),
              label: "Verified Visits",
            },
            { value: profile.avgDeliveryTime, label: "Avg Delivery Time" },
            { value: profile.tierScore, label: "Tier Score" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Creator header card ───────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 32,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 24,
            }}
          >
            PROFILE HEADER
          </span>

          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            {/* Avatar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "var(--surface-3)",
                  border: "2px solid var(--hairline)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={header.displayName}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  getInitials(header.displayName)
                )}
              </div>
              <button
                type="button"
                className="btn-ghost click-shift"
                style={{ fontSize: 11, padding: "4px 12px" }}
              >
                Upload Photo
              </button>
            </div>

            {/* Identity */}
            <div style={{ flex: 1 }}>
              {editingHeader ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Display Name</label>
                      <input
                        name="displayName"
                        type="text"
                        style={inputStyle}
                        value={header.displayName}
                        onChange={handleHeaderChange}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Handle</label>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            color: "var(--ink-4)",
                            background: "var(--surface-3)",
                            border: "1px solid var(--hairline)",
                            borderRight: "none",
                            borderRadius: "8px 0 0 8px",
                            padding: "10px 12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          push.nyc/c/
                        </span>
                        <input
                          type="text"
                          style={{
                            ...inputStyle,
                            borderRadius: "0 8px 8px 0",
                            borderLeft: "none",
                          }}
                          value={profile.handle}
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>NYC Neighborhood</label>
                      <input
                        name="neighborhood"
                        type="text"
                        style={inputStyle}
                        value={header.neighborhood}
                        onChange={handleHeaderChange}
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Instagram</label>
                        <div style={{ display: "flex" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 13,
                              color: "var(--ink-4)",
                              background: "var(--surface-3)",
                              border: "1px solid var(--hairline)",
                              borderRight: "none",
                              borderRadius: "8px 0 0 8px",
                              padding: "10px 10px",
                            }}
                          >
                            @
                          </span>
                          <input
                            name="instagramHandle"
                            type="text"
                            style={{
                              ...inputStyle,
                              borderRadius: "0 8px 8px 0",
                              borderLeft: "none",
                            }}
                            value={header.instagramHandle}
                            onChange={handleHeaderChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>TikTok</label>
                        <div style={{ display: "flex" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 13,
                              color: "var(--ink-4)",
                              background: "var(--surface-3)",
                              border: "1px solid var(--hairline)",
                              borderRight: "none",
                              borderRadius: "8px 0 0 8px",
                              padding: "10px 10px",
                            }}
                          >
                            @
                          </span>
                          <input
                            name="tiktokHandle"
                            type="text"
                            style={{
                              ...inputStyle,
                              borderRadius: "0 8px 8px 0",
                              borderLeft: "none",
                            }}
                            value={header.tiktokHandle}
                            onChange={handleHeaderChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <label style={{ ...labelStyle, marginBottom: 0 }}>
                        Bio
                      </label>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                        }}
                      >
                        {header.bio.length}/500
                      </span>
                    </div>
                    <textarea
                      name="bio"
                      style={{ ...inputStyle, resize: "vertical" }}
                      value={header.bio}
                      onChange={handleHeaderChange}
                      rows={5}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="button"
                      className="btn-ghost click-shift"
                      onClick={() => setEditingHeader(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary click-shift"
                      onClick={saveHeader}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--ink)",
                      margin: "0 0 12px",
                    }}
                  >
                    {header.displayName}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {[
                      `@${profile.handle}`,
                      `NYC — ${header.neighborhood}`,
                      header.instagramHandle
                        ? `IG: @${header.instagramHandle}`
                        : null,
                      header.tiktokHandle
                        ? `TT: @${header.tiktokHandle}`
                        : null,
                    ]
                      .filter(Boolean)
                      .map((chip) => (
                        <span
                          key={chip}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--ink-3)",
                            background: "var(--surface-3)",
                            border: "1px solid var(--hairline)",
                            borderRadius: 40,
                            padding: "4px 12px",
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--ink-3)",
                      lineHeight: 1.6,
                      margin: "0 0 16px",
                      maxWidth: 560,
                    }}
                  >
                    {header.bio}
                  </p>
                  <button
                    type="button"
                    className="btn-ghost click-shift"
                    onClick={() => setEditingHeader(true)}
                  >
                    Edit Header
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tier & Progress ─────────────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 32,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 24,
            }}
          >
            TIER & PROGRESS
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 32,
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: 20,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                {tier}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {TIERS[tier].description}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <TierProgressBar tier={tier} score={profile.pushScore} />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-4)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  CURRENT BENEFITS
                </p>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {TIERS[tier].benefits.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink-3)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--brand-red)",
                          flexShrink: 0,
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                {TIERS[tier].upgradeHint && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--accent-blue)",
                      margin: "12px 0 0",
                    }}
                  >
                    {TIERS[tier].upgradeHint}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Content Gallery ──────────────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 32,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              CONTENT GALLERY
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
              }}
            >
              Add up to 24 items. Toggle visibility to show/hide on your public
              page.
            </span>
          </div>
          <GalleryEditor items={gallery} onChange={setGallery} />
        </div>

        {/* ── Past Campaigns ───────────────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 32,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              PAST CAMPAIGNS
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
              }}
            >
              Toggle visibility to control what appears on your public
              portfolio.
            </span>
          </div>
          <CampaignsEditor campaigns={campaigns} onChange={setCampaigns} />
        </div>

        {/* ── Merchant Testimonials ────────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 32,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 4,
              }}
            >
              MERCHANT TESTIMONIALS
            </span>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                margin: 0,
              }}
            >
              Testimonials are submitted by verified merchants — read-only.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {profile.testimonials.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    color: "var(--brand-red)",
                    fontSize: 14,
                    letterSpacing: 2,
                  }}
                >
                  {"★".repeat(t.rating)}
                  <span style={{ color: "var(--hairline)" }}>
                    {"★".repeat(5 - t.rating)}
                  </span>
                </div>
                <blockquote
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {t.merchant}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                    }}
                  >
                    {t.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
