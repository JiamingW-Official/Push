"use client";

import { useState, useEffect, useRef } from "react";
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

const DEMO_PROFILE: CreatorProfile = MOCK_PROFILES[0];

// Niche tags available for selection
const NICHE_OPTIONS = [
  "Food",
  "Lifestyle",
  "Beauty",
  "Fashion",
  "Fitness",
  "Travel",
  "Tech",
  "Art",
  "Music",
  "Coffee",
  "Wellness",
  "Local",
];

type EditableHeader = {
  displayName: string;
  neighborhood: string;
  bio: string;
  instagramHandle: string;
  tiktokHandle: string;
  niches: string[];
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
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
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

// ── Score Ring (SVG animated) ─────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!circleRef.current) return;
    const pct = score / 100;
    const offset = circumference * (1 - pct);
    circleRef.current.style.transition = "none";
    circleRef.current.style.strokeDashoffset = String(circumference);
    // Force reflow then animate
    void circleRef.current.getBoundingClientRect();
    circleRef.current.style.transition =
      "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)";
    circleRef.current.style.strokeDashoffset = String(offset);
  }, [score, circumference]);

  return (
    <div className="pf-score-ring-wrap">
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        className="pf-score-ring-svg"
      >
        <circle cx="64" cy="64" r={radius} className="pf-score-ring-track" />
        <circle
          ref={circleRef}
          cx="64"
          cy="64"
          r={radius}
          className="pf-score-ring-fill"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div className="pf-score-ring-center">
        <span className="pf-score-number">{score}</span>
        <span className="pf-score-label">SCORE</span>
      </div>
    </div>
  );
}

// ── Tier Progress Bar ─────────────────────────────────────────────────────────
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
            {nextCfg!.minScore - score} pts to {nextTier}
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

// ── Gallery Editor ────────────────────────────────────────────────────────────
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
                onClick={() =>
                  onChange(
                    items.map((i) =>
                      i.id === item.id ? { ...i, visible: !i.visible } : i,
                    ),
                  )
                }
              >
                {item.visible ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                className="pf-gallery-action-btn pf-gallery-action-btn--danger"
                onClick={() => onChange(items.filter((i) => i.id !== item.id))}
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

// ── Campaigns Editor ──────────────────────────────────────────────────────────
function CampaignsEditor({
  campaigns,
  onChange,
}: {
  campaigns: PastCampaign[];
  onChange: (c: PastCampaign[]) => void;
}) {
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
            onClick={() =>
              onChange(
                campaigns.map((x) =>
                  x.id === c.id ? { ...x, visible: !x.visible } : x,
                ),
              )
            }
          >
            {c.visible ? "Visible" : "Hidden"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Platform Tile ─────────────────────────────────────────────────────────────
function PlatformTile({
  name,
  icon,
  handle,
  followers,
  connected,
}: {
  name: string;
  icon: string;
  handle?: string;
  followers?: number;
  connected: boolean;
}) {
  return (
    <div
      className={`pf-platform-tile ${connected ? "pf-platform-tile--connected" : ""}`}
    >
      <div className="pf-platform-header">
        <span className="pf-platform-icon">{icon}</span>
        <span className="pf-platform-name">{name}</span>
        {connected && <span className="pf-platform-dot" />}
      </div>
      {connected ? (
        <>
          <div className="pf-platform-followers">
            {followers ? formatNumber(followers) : "—"}
          </div>
          <div className="pf-platform-handle">@{handle}</div>
        </>
      ) : (
        <button type="button" className="pf-platform-connect">
          Connect →
        </button>
      )}
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
    niches: ["Food", "Lifestyle", "Local"],
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(profile.gallery);
  const [campaigns, setCampaigns] = useState<PastCampaign[]>(
    profile.pastCampaigns,
  );
  const [editingHeader, setEditingHeader] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const tier = tierNormalized(profile.tier);
  const tierCfg = TIERS[tier];
  const publicUrl = `push.nyc/c/${profile.handle}`;

  // Niche from neighborhood
  const nicheStr = header.neighborhood.toUpperCase() + " · FOOD · LOCAL";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-reveal observer
  useEffect(() => {
    const els = document.querySelectorAll(".pf-reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("pf-reveal--in");
          }
        }),
      { threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function handleHeaderChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 280) return;
    setHeader((prev) => ({ ...prev, [name]: value }));
  }

  function toggleNiche(n: string) {
    setHeader((prev) => ({
      ...prev,
      niches: prev.niches.includes(n)
        ? prev.niches.filter((x) => x !== n)
        : [...prev.niches, n],
    }));
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
      {/* ── Sticky top bar ───────────────────────────────────────── */}
      <div className={`pf-topbar ${scrolled ? "pf-topbar--scrolled" : ""}`}>
        <div className="pf-topbar-inner">
          <div className="pf-topbar-url-group">
            <span className="pf-topbar-label">Public URL</span>
            <span className="pf-topbar-url">{publicUrl}</span>
          </div>
          <div className="pf-topbar-actions">
            {saved && <span className="pf-save-flash">Saved ✓</span>}
            <button type="button" className="pf-topbar-btn" onClick={copyUrl}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={`/c/${profile.handle}`}
              className="pf-topbar-btn pf-topbar-btn--primary"
              target="_blank"
            >
              Preview ↗
            </Link>
          </div>
        </div>
      </div>

      {/* ── HERO (editorial magazine style) ──────────────────────── */}
      <section className="pf-hero">
        <div className="pf-hero-dark-panel">
          <div className="pf-hero-content">
            {/* Avatar */}
            <div className="pf-hero-avatar-col">
              <div className="pf-avatar-frame">
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

            {/* Name + meta */}
            <div className="pf-hero-identity">
              <div className="pf-hero-eyebrow">YOUR PORTFOLIO</div>
              {editingHeader ? (
                <input
                  name="displayName"
                  type="text"
                  className="pf-hero-name-input"
                  value={header.displayName}
                  onChange={handleHeaderChange}
                  autoFocus
                />
              ) : (
                <h1 className="pf-hero-name">{header.displayName}</h1>
              )}
              <div className="pf-hero-niche-ghost">{nicheStr}</div>

              {/* Niche chips */}
              <div className="pf-niche-row">
                {(editingHeader ? NICHE_OPTIONS : header.niches).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`pf-niche-chip ${header.niches.includes(n) ? "pf-niche-chip--active" : ""}`}
                    onClick={editingHeader ? () => toggleNiche(n) : undefined}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tier badge — right panel */}
        <div className="pf-hero-tier-panel">
          <ScoreRing score={profile.pushScore} />
          <div className="pf-tier-badge-pill">
            <span className="pf-tier-badge-name">{tier}</span>
            <span className="pf-tier-badge-desc">{tierCfg.description}</span>
          </div>
          {!editingHeader ? (
            <button
              type="button"
              className="pf-edit-btn"
              onClick={() => setEditingHeader(true)}
            >
              EDIT PROFILE
            </button>
          ) : (
            <div className="pf-hero-edit-actions">
              <button
                type="button"
                className="pf-edit-cancel-btn"
                onClick={() => setEditingHeader(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pf-edit-save-btn"
                onClick={saveHeader}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats strip (horizontal) ──────────────────────────────── */}
      <section className="pf-stats-strip pf-reveal">
        {[
          {
            val: formatNumber(profile.verifiedVisits),
            unit: "scans",
            label: "TOTAL SCANS",
          },
          {
            val: `$${profile.pastCampaigns.reduce((s, c) => s + c.earnings, 0).toLocaleString()}`,
            unit: "",
            label: "TOTAL EARNED",
          },
          {
            val: String(profile.totalCampaigns),
            unit: "runs",
            label: "CAMPAIGNS",
          },
          { val: "4.9", unit: "★", label: "AVG RATING" },
        ].map((stat, i) => (
          <div key={i} className="pf-stat-col">
            <div className="pf-stat-value-row">
              <span className="pf-stat-big">{stat.val}</span>
              {stat.unit && <span className="pf-stat-unit">{stat.unit}</span>}
            </div>
            <span className="pf-stat-lbl">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ── Edit form (bio + social) when editing ─────────────────── */}
      {editingHeader && (
        <section className="pf-section pf-edit-form-section pf-reveal">
          <div className="pf-section-inner">
            <div className="pf-section-heading">
              <div className="pf-eyebrow">EDIT</div>
              <h2 className="pf-section-title">Profile Details</h2>
            </div>
            <div className="pf-header-form">
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
                  <span className="pf-char-count">{header.bio.length}/280</span>
                </label>
                <textarea
                  name="bio"
                  className="pf-input pf-textarea"
                  value={header.bio}
                  onChange={handleHeaderChange}
                  rows={4}
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
            </div>
          </div>
        </section>
      )}

      {/* ── Platforms (display mode only) ─────────────────────────── */}
      {!editingHeader && (
        <section className="pf-section pf-platforms-section pf-reveal">
          <div className="pf-section-inner">
            <div className="pf-section-heading">
              <div className="pf-eyebrow">01 — PLATFORMS</div>
              <h2 className="pf-section-title">Connected Accounts</h2>
            </div>
            <div className="pf-platforms-grid">
              <PlatformTile
                name="Instagram"
                icon="◎"
                handle={header.instagramHandle || undefined}
                followers={182000}
                connected={!!header.instagramHandle}
              />
              <PlatformTile
                name="TikTok"
                icon="◈"
                handle={header.tiktokHandle || undefined}
                followers={94000}
                connected={!!header.tiktokHandle}
              />
              <PlatformTile name="YouTube" icon="▶" connected={false} />
            </div>
          </div>
        </section>
      )}

      {/* ── Bio section ───────────────────────────────────────────── */}
      {!editingHeader && (
        <section className="pf-section pf-bio-section pf-reveal">
          <div className="pf-section-inner pf-section-inner--narrow">
            <div className="pf-section-heading">
              <div className="pf-eyebrow">02 — ABOUT</div>
              <h2 className="pf-section-title">Bio</h2>
            </div>
            <p className="pf-bio-text">{header.bio}</p>
          </div>
        </section>
      )}

      {/* ── Tier showcase ─────────────────────────────────────────── */}
      <section className="pf-section pf-tier-section pf-reveal">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">03 — TIER</div>
            <h2 className="pf-section-title">Tier &amp; Progress</h2>
          </div>
          <div className="pf-tier-showcase">
            <div className="pf-tier-badge-large">
              <span className="pf-tier-badge-name">{tier}</span>
              <span className="pf-tier-badge-desc">{tierCfg.description}</span>
            </div>
            <div className="pf-tier-progress-wrap">
              <TierProgressBar tier={tier} score={profile.pushScore} />
              <div className="pf-tier-benefits">
                <p className="pf-tier-benefits-heading">Current Benefits</p>
                <ul className="pf-tier-benefits-list">
                  {tierCfg.benefits.map((b, i) => (
                    <li key={i} className="pf-tier-benefit-item">
                      <span className="pf-tier-benefit-dot" />
                      {b}
                    </li>
                  ))}
                </ul>
                {tierCfg.upgradeHint && (
                  <p className="pf-tier-upgrade-hint">{tierCfg.upgradeHint}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content gallery ───────────────────────────────────────── */}
      <section className="pf-section pf-gallery-section pf-reveal">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">04 — GALLERY</div>
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
      <section className="pf-section pf-campaigns-section pf-reveal">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">05 — HISTORY</div>
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
      <section className="pf-section pf-testimonials-section pf-reveal">
        <div className="pf-section-inner">
          <div className="pf-section-heading">
            <div className="pf-eyebrow">06 — REPUTATION</div>
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
