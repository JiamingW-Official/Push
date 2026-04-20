"use client";

import { useState } from "react";
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
    <div className="pf-tier-progress">
      <div className="pf-tier-progress-header">
        <span className="pf-tier-label">{tier}</span>
        {nextTier && (
          <span className="pf-tier-next">
            Next: {nextTier} ({nextCfg!.minScore - score} pts away)
          </span>
        )}
      </div>
      <div className="pf-tier-bar-track">
        <div className="pf-tier-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="pf-tier-tiers-row">
        {TIER_ORDER.map((t) => {
          const active = TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(tier);
          return (
            <div
              key={t}
              className={`pf-tier-pip ${active ? "pf-tier-pip--active" : ""}`}
            >
              <div className="pf-tier-pip-dot" />
              <span className="pf-tier-pip-label">{t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GalleryEditor({
  items,
  onChange,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}) {
  const [addUrl, setAddUrl] = useState("");
  const [addCaption, setAddCaption] = useState("");

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

  return (
    <div className="pf-gallery-editor">
      <div className="pf-gallery-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`pf-gallery-item ${!item.visible ? "pf-gallery-item--hidden" : ""}`}
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
            {item.caption && (
              <p className="pf-gallery-caption">{item.caption}</p>
            )}
            <div className="pf-gallery-item-actions">
              <button
                type="button"
                className="pf-gallery-action-btn"
                onClick={() => toggleVisible(item.id)}
              >
                {item.visible ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                className="pf-gallery-action-btn pf-gallery-action-btn--danger"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length < 24 && (
        <div className="pf-gallery-add">
          <p className="pf-gallery-add-label">Add item ({items.length}/24)</p>
          <div className="pf-gallery-add-row">
            <input
              type="url"
              className="pf-input"
              placeholder="Image URL or YouTube/Vimeo link"
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
            />
            <input
              type="text"
              className="pf-input"
              placeholder="Caption (optional)"
              value={addCaption}
              onChange={(e) => setAddCaption(e.target.value)}
            />
            <button type="button" className="btn pf-btn-add" onClick={addItem}>
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
    <div className="pf-campaigns-list">
      {sorted.map((c) => (
        <div
          key={c.id}
          className={`pf-campaign-row ${!c.visible ? "pf-campaign-row--hidden" : ""}`}
        >
          <div className="pf-campaign-row-main">
            <div className="pf-campaign-row-identity">
              <span className="pf-campaign-brand">{c.brand}</span>
              <span className="pf-campaign-location">{c.neighborhood}</span>
            </div>
            <div className="pf-campaign-row-stats">
              <span className="pf-campaign-stat">
                <span className="pf-campaign-stat-label">Earned</span>
                <span className="pf-campaign-stat-value">${c.earnings}</span>
              </span>
              <span className="pf-campaign-stat">
                <span className="pf-campaign-stat-label">Visits</span>
                <span className="pf-campaign-stat-value">
                  {c.verifiedVisits}
                </span>
              </span>
              <span className="pf-campaign-stat">
                <span className="pf-campaign-stat-label">Delivery</span>
                <span className="pf-campaign-stat-value">{c.deliveryTime}</span>
              </span>
              <span className="pf-campaign-date">{c.date}</span>
            </div>
          </div>
          <button
            type="button"
            className={`pf-campaign-toggle ${!c.visible ? "pf-campaign-toggle--off" : ""}`}
            onClick={() => toggleVisible(c.id)}
          >
            {c.visible ? "Visible" : "Hidden"}
          </button>
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

  return (
    <div className="pf-page">
      {/* ── Action bar (pearl stone sticky bar) ───────────────── */}
      <div className="pf-action-bar">
        <div className="pf-action-bar-inner">
          <div className="pf-action-url-group">
            <span className="pf-action-label">Public URL</span>
            <span className="pf-action-url">{publicUrl}</span>
          </div>
          <div className="pf-action-buttons">
            <button type="button" className="pf-btn-copy" onClick={copyUrl}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={`/c/${profile.handle}`}
              className="pf-btn-preview"
              target="_blank"
            >
              Preview
            </Link>
          </div>
        </div>
        {saved && <p className="pf-save-toast">Changes saved</p>}
      </div>

      {/* ── Header section ────────────────────────────────────────── */}
      <section className="pf-section pf-header-section">
        <div className="pf-section-inner">
          <div className="pf-eyebrow">Your Portfolio</div>
          <div className="pf-creator-header">
            {/* Avatar */}
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={header.displayName}
                    className="pf-avatar-img"
                  />
                ) : (
                  <span className="pf-avatar-initials">
                    {getInitials(header.displayName)}
                  </span>
                )}
              </div>
              <button type="button" className="pf-avatar-upload-btn">
                Upload Photo
              </button>
            </div>

            {/* Identity */}
            <div className="pf-creator-identity">
              {editingHeader ? (
                <div className="pf-header-form">
                  <div className="pf-form-row">
                    <label className="pf-form-label">Display Name</label>
                    <input
                      name="displayName"
                      type="text"
                      className="pf-input pf-input--large"
                      value={header.displayName}
                      onChange={handleHeaderChange}
                    />
                  </div>
                  <div className="pf-form-row">
                    <label className="pf-form-label">Handle</label>
                    <div className="pf-input-prefix-wrap">
                      <span className="pf-input-prefix">push.nyc/c/</span>
                      <input
                        type="text"
                        className="pf-input pf-input--prefixed"
                        value={profile.handle}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="pf-form-row">
                    <label className="pf-form-label">NYC Neighborhood</label>
                    <input
                      name="neighborhood"
                      type="text"
                      className="pf-input"
                      value={header.neighborhood}
                      onChange={handleHeaderChange}
                    />
                  </div>
                  <div className="pf-form-row">
                    <label className="pf-form-label">
                      Bio
                      <span className="pf-char-count">
                        {header.bio.length}/500
                      </span>
                    </label>
                    <textarea
                      name="bio"
                      className="pf-input pf-textarea"
                      value={header.bio}
                      onChange={handleHeaderChange}
                      rows={5}
                    />
                  </div>
                  <div className="pf-form-row pf-form-row--2col">
                    <div>
                      <label className="pf-form-label">Instagram</label>
                      <div className="pf-input-prefix-wrap">
                        <span className="pf-input-prefix">@</span>
                        <input
                          name="instagramHandle"
                          type="text"
                          className="pf-input pf-input--prefixed"
                          value={header.instagramHandle}
                          onChange={handleHeaderChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="pf-form-label">TikTok</label>
                      <div className="pf-input-prefix-wrap">
                        <span className="pf-input-prefix">@</span>
                        <input
                          name="tiktokHandle"
                          type="text"
                          className="pf-input pf-input--prefixed"
                          value={header.tiktokHandle}
                          onChange={handleHeaderChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pf-form-actions">
                    <button
                      type="button"
                      className="btn pf-btn-cancel"
                      onClick={() => setEditingHeader(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn pf-btn-save"
                      onClick={saveHeader}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pf-creator-identity-display">
                  <h1 className="pf-creator-name">{header.displayName}</h1>
                  <div className="pf-creator-meta">
                    <span className="pf-meta-chip pf-meta-chip--handle">
                      @{profile.handle}
                    </span>
                    <span className="pf-meta-chip">
                      NYC — {header.neighborhood}
                    </span>
                    {header.instagramHandle && (
                      <span className="pf-meta-chip">
                        IG: @{header.instagramHandle}
                      </span>
                    )}
                    {header.tiktokHandle && (
                      <span className="pf-meta-chip">
                        TT: @{header.tiktokHandle}
                      </span>
                    )}
                  </div>
                  <p className="pf-creator-bio">{header.bio}</p>
                  <button
                    type="button"
                    className="btn pf-btn-edit-header"
                    onClick={() => setEditingHeader(true)}
                  >
                    Edit Header
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats row (3-col: Campaigns / Earned / Avg Rating) ── */}
      <section className="pf-section pf-stats-section">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">02</div>
            <h2 className="pf-section-title">Your Numbers</h2>
          </div>
          <div className="pf-stats-strip">
            <div className="pf-stat-block">
              <div className="pf-stat-number">{profile.totalCampaigns}</div>
              <div className="pf-stat-label">Campaigns</div>
            </div>
            <div className="pf-stat-block">
              <div className="pf-stat-number">
                $
                {formatNumber(
                  profile.pastCampaigns.reduce((sum, c) => sum + c.earnings, 0),
                )}
              </div>
              <div className="pf-stat-label">Total Earned</div>
            </div>
            <div className="pf-stat-block">
              <div className="pf-stat-number">
                {profile.totalCampaigns > 0
                  ? (profile.tierScore / profile.totalCampaigns).toFixed(1)
                  : "—"}
              </div>
              <div className="pf-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tier showcase ─────────────────────────────────────────── */}
      <section className="pf-section pf-tier-section">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">03</div>
            <h2 className="pf-section-title">Tier & Progress</h2>
          </div>
          <div className="pf-tier-showcase">
            <div className="pf-tier-badge-large">
              <span className="pf-tier-badge-name">{tier}</span>
              <span className="pf-tier-badge-desc">
                {TIERS[tier].description}
              </span>
            </div>
            <div className="pf-tier-progress-wrap">
              <TierProgressBar tier={tier} score={profile.pushScore} />
              <div className="pf-tier-benefits">
                <p className="pf-tier-benefits-heading">Current Benefits</p>
                <ul className="pf-tier-benefits-list">
                  {TIERS[tier].benefits.map((b, i) => (
                    <li key={i} className="pf-tier-benefit-item">
                      <span className="pf-tier-benefit-dot" />
                      {b}
                    </li>
                  ))}
                </ul>
                {TIERS[tier].upgradeHint && (
                  <p className="pf-tier-upgrade-hint">
                    {TIERS[tier].upgradeHint}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content gallery ───────────────────────────────────────── */}
      <section className="pf-section pf-gallery-section">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">04</div>
            <h2 className="pf-section-title">Content Gallery</h2>
            <p className="pf-section-sub">
              Add up to 24 items. Toggle visibility to show/hide on your public
              page.
            </p>
          </div>
          <GalleryEditor items={gallery} onChange={setGallery} />
        </div>
      </section>

      {/* ── Past campaigns ────────────────────────────────────────── */}
      <section className="pf-section pf-campaigns-section">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">05</div>
            <h2 className="pf-section-title">Past Campaigns</h2>
            <p className="pf-section-sub">
              Toggle visibility to control what appears on your public
              portfolio.
            </p>
          </div>
          <CampaignsEditor campaigns={campaigns} onChange={setCampaigns} />
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="pf-section pf-testimonials-section">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">06</div>
            <h2 className="pf-section-title">Merchant Testimonials</h2>
            <p className="pf-section-sub">
              Testimonials are submitted by verified merchants — read-only.
            </p>
          </div>
          <div className="pf-testimonials-grid">
            {profile.testimonials.map((t) => (
              <div key={t.id} className="pf-testimonial-card">
                <div className="pf-testimonial-stars">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
                <blockquote className="pf-testimonial-quote">
                  "{t.quote}"
                </blockquote>
                <div className="pf-testimonial-attribution">
                  <span className="pf-testimonial-name">{t.merchant}</span>
                  <span className="pf-testimonial-role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
