"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./portfolio.css";

// ────────────────────────────────────────────────────────────────────────────
// Demo data — static ~12 content pieces for the Customer Acquisition Engine
// portfolio. Mix of campaign-sourced + external work, multi-platform.
// v5.1 context: Williamsburg Coffee+ beachhead, ConversionOracle verification.
// ────────────────────────────────────────────────────────────────────────────

const DEMO_HANDLE = "maya-eats-nyc";

type Platform = "instagram" | "tiktok" | "xiaohongshu" | "link";
type Source = "campaign" | "external";
type CardVariant = "image" | "instagram" | "tiktok" | "link";

type ContentPiece = {
  id: string;
  variant: CardVariant;
  platform: Platform;
  source: Source;
  featured: boolean;
  title: string;
  caption: string;
  thumbUrl?: string;
  externalUrl?: string;
  handle?: string;
  campaignBrand?: string;
  addedDate: string;
  metrics: {
    likes: number;
    comments: number;
    reach: number;
    verifiedCustomers: number;
  };
};

const DEMO_CONTENT: ContentPiece[] = [
  {
    id: "p1",
    variant: "instagram",
    platform: "instagram",
    source: "campaign",
    featured: true,
    title: "Devoción Reel — Williamsburg Coffee+",
    caption:
      "Showed the barista pour routine at 7:42am. ConversionOracle flagged high walk-in intent by 11am.",
    thumbUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=640&q=70",
    handle: "maya.eats.nyc",
    campaignBrand: "Devoción",
    addedDate: "2026-04-02",
    metrics: {
      likes: 4280,
      comments: 142,
      reach: 38200,
      verifiedCustomers: 47,
    },
  },
  {
    id: "p2",
    variant: "tiktok",
    platform: "tiktok",
    source: "campaign",
    featured: true,
    title: "Partners Coffee POV — Bedford Ave",
    caption:
      "10-second cold brew POV. Verified customers up 31% over baseline.",
    thumbUrl:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=640&q=70",
    handle: "mayacoffee",
    campaignBrand: "Partners Coffee",
    addedDate: "2026-03-28",
    metrics: {
      likes: 12800,
      comments: 386,
      reach: 94500,
      verifiedCustomers: 62,
    },
  },
  {
    id: "p3",
    variant: "instagram",
    platform: "instagram",
    source: "campaign",
    featured: true,
    title: "Variety Coffee — matcha launch",
    caption:
      "Launch-day reel, tagged by Neighborhood Playbook as peak-traffic slot.",
    thumbUrl:
      "https://images.unsplash.com/photo-1577936999108-a30b1a6a6f22?w=640&q=70",
    handle: "maya.eats.nyc",
    campaignBrand: "Variety Coffee",
    addedDate: "2026-03-20",
    metrics: {
      likes: 5620,
      comments: 198,
      reach: 44100,
      verifiedCustomers: 38,
    },
  },
  {
    id: "p4",
    variant: "tiktok",
    platform: "tiktok",
    source: "campaign",
    featured: false,
    title: "Blank Street — iced chai run",
    caption:
      "Morning routine duet. Steady attribution on QR scans through lunch.",
    thumbUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=640&q=70",
    handle: "mayacoffee",
    campaignBrand: "Blank Street",
    addedDate: "2026-03-14",
    metrics: {
      likes: 9340,
      comments: 221,
      reach: 71800,
      verifiedCustomers: 29,
    },
  },
  {
    id: "p5",
    variant: "image",
    platform: "instagram",
    source: "external",
    featured: false,
    title: "Still life — oat flat white",
    caption: "Personal editorial shot. Added to show range.",
    thumbUrl:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=640&q=70",
    handle: "maya.eats.nyc",
    addedDate: "2026-03-10",
    metrics: { likes: 2100, comments: 54, reach: 18600, verifiedCustomers: 0 },
  },
  {
    id: "p6",
    variant: "instagram",
    platform: "instagram",
    source: "external",
    featured: true,
    title: "Sey Coffee — unbranded shot",
    caption: "Organic post before I joined the Customer Acquisition Engine.",
    thumbUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=640&q=70",
    handle: "maya.eats.nyc",
    externalUrl: "https://instagram.com/p/abc123",
    addedDate: "2026-02-28",
    metrics: { likes: 3150, comments: 89, reach: 24300, verifiedCustomers: 0 },
  },
  {
    id: "p7",
    variant: "link",
    platform: "link",
    source: "external",
    featured: false,
    title: "Eater NY feature — 8 new coffee shops",
    caption: "Quoted as a neighborhood voice on the Williamsburg beat.",
    externalUrl: "https://ny.eater.com/brooklyn-coffee-guide",
    addedDate: "2026-02-20",
    metrics: { likes: 0, comments: 0, reach: 0, verifiedCustomers: 0 },
  },
  {
    id: "p8",
    variant: "tiktok",
    platform: "tiktok",
    source: "external",
    featured: false,
    title: "Brooklyn coffee tier list",
    caption: "Solo ranking video. 6 shops, 60 seconds.",
    thumbUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=640&q=70",
    handle: "mayacoffee",
    externalUrl: "https://tiktok.com/@mayacoffee/video/7298",
    addedDate: "2026-02-12",
    metrics: {
      likes: 18200,
      comments: 512,
      reach: 142000,
      verifiedCustomers: 0,
    },
  },
  {
    id: "p9",
    variant: "instagram",
    platform: "xiaohongshu",
    source: "external",
    featured: false,
    title: "小红书 — Bushwick cafe 探店",
    caption: "Cross-platform cafe discovery post. 小红书 audience.",
    thumbUrl:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=640&q=70",
    handle: "maya_nyc",
    externalUrl: "https://xiaohongshu.com/note/abc",
    addedDate: "2026-02-04",
    metrics: { likes: 1840, comments: 67, reach: 12400, verifiedCustomers: 0 },
  },
  {
    id: "p10",
    variant: "image",
    platform: "instagram",
    source: "campaign",
    featured: false,
    title: "Oslo Coffee — cortado series",
    caption: "3-frame grid push. Secondary of a verified campaign.",
    thumbUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&q=70",
    handle: "maya.eats.nyc",
    campaignBrand: "Oslo Coffee",
    addedDate: "2026-01-24",
    metrics: { likes: 2760, comments: 74, reach: 21500, verifiedCustomers: 18 },
  },
  {
    id: "p11",
    variant: "instagram",
    platform: "instagram",
    source: "campaign",
    featured: false,
    title: "Café Integral — winter menu",
    caption: "Menu-switch campaign. QR scan attribution held through 10 days.",
    thumbUrl:
      "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=640&q=70",
    handle: "maya.eats.nyc",
    campaignBrand: "Café Integral",
    addedDate: "2026-01-14",
    metrics: {
      likes: 3980,
      comments: 121,
      reach: 31200,
      verifiedCustomers: 24,
    },
  },
  {
    id: "p12",
    variant: "link",
    platform: "link",
    source: "external",
    featured: false,
    title: "Brooklyn Magazine — creator economy op-ed",
    caption:
      "Essay on Two-Segment Creator Economics from my side of the Engine.",
    externalUrl: "https://bkmag.com/creator-essay",
    addedDate: "2026-01-04",
    metrics: { likes: 0, comments: 0, reach: 0, verifiedCustomers: 0 },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Utilities
// ────────────────────────────────────────────────────────────────────────────

type TabFilter = "all" | "campaigns" | "external" | "featured" | "recent";
type PlatformFilter = "all" | Platform;

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseHandleFromUrl(url: string): {
  platform: Platform;
  handle: string;
} {
  const u = url.trim().toLowerCase();
  if (u.includes("instagram.com")) {
    const m = u.match(/instagram\.com\/([^/?]+)/);
    return { platform: "instagram", handle: m?.[1] ?? "unknown" };
  }
  if (u.includes("tiktok.com")) {
    const m = u.match(/tiktok\.com\/@([^/?]+)/);
    return { platform: "tiktok", handle: m?.[1] ?? "unknown" };
  }
  if (u.includes("xiaohongshu.com") || u.includes("xhslink")) {
    return { platform: "xiaohongshu", handle: "note" };
  }
  return { platform: "link", handle: "external" };
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: Platform }) {
  // Decorative glyphs — not critical for a11y, labeled by parent
  if (platform === "instagram") {
    return (
      <span className="pf-pi pf-pi--ig" aria-hidden>
        IG
      </span>
    );
  }
  if (platform === "tiktok") {
    return (
      <span className="pf-pi pf-pi--tt" aria-hidden>
        TT
      </span>
    );
  }
  if (platform === "xiaohongshu") {
    return (
      <span className="pf-pi pf-pi--xhs" aria-hidden>
        XHS
      </span>
    );
  }
  return (
    <span className="pf-pi pf-pi--link" aria-hidden>
      &#x1F517;
    </span>
  );
}

function ContentCard({
  piece,
  selected,
  selectMode,
  onToggleFeature,
  onOpenDetail,
  onToggleSelect,
}: {
  piece: ContentPiece;
  selected: boolean;
  selectMode: boolean;
  onToggleFeature: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onToggleSelect: (id: string) => void;
}) {
  const variantClass = `pf-card pf-card--${piece.variant}`;
  const isLink = piece.variant === "link";

  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest("[data-no-open]")) return;
    if (selectMode) {
      onToggleSelect(piece.id);
      return;
    }
    onOpenDetail(piece.id);
  }

  return (
    <article
      className={`${variantClass} ${selected ? "pf-card--selected" : ""}`}
      onClick={handleClick}
    >
      {selectMode && (
        <label className="pf-card-checkbox" data-no-open>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(piece.id)}
          />
          <span aria-hidden />
        </label>
      )}

      <button
        type="button"
        className={`pf-card-feature ${piece.featured ? "pf-card-feature--on" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFeature(piece.id);
        }}
        aria-label={piece.featured ? "Unfeature" : "Feature on public profile"}
        aria-pressed={piece.featured}
        data-no-open
      >
        <span aria-hidden>&#9733;</span>
      </button>

      {isLink ? (
        <div className="pf-card-link-body">
          <span className="pf-card-link-icon" aria-hidden>
            &#x1F517;
          </span>
          <div className="pf-card-link-meta">
            <span className="pf-card-link-domain">
              {piece.externalUrl?.replace(/^https?:\/\//, "").split("/")[0] ??
                "external"}
            </span>
            <h3 className="pf-card-link-title">{piece.title}</h3>
            <p className="pf-card-link-caption">{piece.caption}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="pf-card-media">
            {piece.thumbUrl ? (
              <img
                src={piece.thumbUrl}
                alt={piece.title}
                className="pf-card-img"
                loading="lazy"
              />
            ) : (
              <div className="pf-card-placeholder" aria-hidden />
            )}
            <div className="pf-card-platform-badge">
              <PlatformIcon platform={piece.platform} />
            </div>
          </div>
          <div className="pf-card-body">
            <h3 className="pf-card-title">{piece.title}</h3>
            <p className="pf-card-caption">{piece.caption}</p>
            <div className="pf-card-metrics">
              <span>
                <strong>{formatNumber(piece.metrics.likes)}</strong> likes
              </span>
              <span>
                <strong>{formatNumber(piece.metrics.reach)}</strong> reach
              </span>
              {piece.metrics.verifiedCustomers > 0 && (
                <span className="pf-card-metric-verified">
                  <strong>{piece.metrics.verifiedCustomers}</strong> verified
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
}

function DetailPanel({
  piece,
  onClose,
  onToggleFeature,
}: {
  piece: ContentPiece;
  onClose: () => void;
  onToggleFeature: (id: string) => void;
}) {
  return (
    <>
      <div className="pf-panel-backdrop" onClick={onClose} aria-hidden />
      <aside
        className="pf-panel"
        role="dialog"
        aria-label={`Details for ${piece.title}`}
      >
        <header className="pf-panel-header">
          <div>
            <div className="pf-panel-eyebrow">
              <PlatformIcon platform={piece.platform} />
              <span>
                {piece.source === "campaign"
                  ? `Customer Acquisition Engine · ${piece.campaignBrand}`
                  : "External work"}
              </span>
            </div>
            <h2 className="pf-panel-title">{piece.title}</h2>
          </div>
          <button
            type="button"
            className="pf-panel-close"
            onClick={onClose}
            aria-label="Close detail panel"
          >
            &#215;
          </button>
        </header>

        {piece.thumbUrl && (
          <div className="pf-panel-media">
            <img src={piece.thumbUrl} alt={piece.title} />
          </div>
        )}

        <p className="pf-panel-caption">{piece.caption}</p>

        <div className="pf-panel-metrics">
          <div className="pf-panel-metric">
            <span className="pf-panel-metric-label">Likes</span>
            <span className="pf-panel-metric-value">
              {formatNumber(piece.metrics.likes)}
            </span>
          </div>
          <div className="pf-panel-metric">
            <span className="pf-panel-metric-label">Comments</span>
            <span className="pf-panel-metric-value">
              {formatNumber(piece.metrics.comments)}
            </span>
          </div>
          <div className="pf-panel-metric">
            <span className="pf-panel-metric-label">Reach</span>
            <span className="pf-panel-metric-value">
              {formatNumber(piece.metrics.reach)}
            </span>
          </div>
          <div className="pf-panel-metric pf-panel-metric--accent">
            <span className="pf-panel-metric-label">Verified customers</span>
            <span className="pf-panel-metric-value">
              {piece.metrics.verifiedCustomers}
            </span>
          </div>
        </div>

        <div className="pf-panel-meta-row">
          <span>Added {formatDate(piece.addedDate)}</span>
          {piece.handle && <span>@{piece.handle}</span>}
        </div>

        <div className="pf-panel-actions">
          <button
            type="button"
            className="pf-btn pf-btn--primary"
            onClick={() => onToggleFeature(piece.id)}
          >
            {piece.featured ? "Unfeature" : "Feature on profile"}
          </button>
          {piece.externalUrl && (
            <a
              href={piece.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-btn pf-btn--ghost"
            >
              Open source
            </a>
          )}
        </div>
      </aside>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [pieces, setPieces] = useState<ContentPiece[]>(DEMO_CONTENT);
  const [tab, setTab] = useState<TabFilter>("all");
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add External Work form state
  const [addUrl, setAddUrl] = useState("");
  const [addCaption, setAddCaption] = useState("");
  const [addPlatform, setAddPlatform] = useState<Platform>("instagram");
  const [addPreview, setAddPreview] = useState<{
    platform: Platform;
    handle: string;
  } | null>(null);

  // Derived stats
  const stats = useMemo(() => {
    const total = pieces.length;
    const campaignCount = pieces.filter((p) => p.source === "campaign").length;
    const externalCount = pieces.filter((p) => p.source === "external").length;
    const featuredCount = pieces.filter((p) => p.featured).length;
    return { total, campaignCount, externalCount, featuredCount };
  }, [pieces]);

  // Filtered list
  const filtered = useMemo(() => {
    const sorted = [...pieces].sort(
      (a, b) =>
        new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime(),
    );
    return sorted.filter((p) => {
      if (tab === "campaigns" && p.source !== "campaign") return false;
      if (tab === "external" && p.source !== "external") return false;
      if (tab === "featured" && !p.featured) return false;
      // "recent" and "all" don't filter by source; "recent" already sorted
      if (platform !== "all" && p.platform !== platform) return false;
      return true;
    });
  }, [pieces, tab, platform]);

  const externalOnly = useMemo(
    () =>
      pieces
        .filter((p) => p.source === "external")
        .sort(
          (a, b) =>
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime(),
        ),
    [pieces],
  );

  const openPiece = openId
    ? (pieces.find((p) => p.id === openId) ?? null)
    : null;

  // Handlers
  function toggleFeature(id: string) {
    setPieces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
    );
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function bulkFeature(val: boolean) {
    setPieces((prev) =>
      prev.map((p) => (selected.has(p.id) ? { ...p, featured: val } : p)),
    );
    exitSelectMode();
  }

  function bulkDelete() {
    setPieces((prev) => prev.filter((p) => !selected.has(p.id)));
    exitSelectMode();
  }

  function bulkExport() {
    // Static demo — would trigger a CSV/JSON export in production
    exitSelectMode();
  }

  function onUrlChange(val: string) {
    setAddUrl(val);
    if (val.trim().length > 8) {
      const parsed = parseHandleFromUrl(val);
      setAddPreview(parsed);
      setAddPlatform(parsed.platform);
    } else {
      setAddPreview(null);
    }
  }

  function submitExternal(e: React.FormEvent) {
    e.preventDefault();
    if (!addUrl.trim()) return;
    const variant: CardVariant =
      addPlatform === "instagram"
        ? "instagram"
        : addPlatform === "tiktok"
          ? "tiktok"
          : "link";
    const newPiece: ContentPiece = {
      id: `ext${Date.now()}`,
      variant,
      platform: addPlatform,
      source: "external",
      featured: false,
      title: addCaption.trim() || "Untitled external piece",
      caption: addCaption.trim() || "Added from external source.",
      externalUrl: addUrl.trim(),
      handle: addPreview?.handle,
      addedDate: new Date().toISOString().slice(0, 10),
      metrics: { likes: 0, comments: 0, reach: 0, verifiedCustomers: 0 },
    };
    setPieces((prev) => [newPiece, ...prev]);
    setAddUrl("");
    setAddCaption("");
    setAddPreview(null);
    setAddOpen(false);
  }

  function removeExternal(id: string) {
    setPieces((prev) => prev.filter((p) => p.id !== id));
  }

  const isEmpty = pieces.length === 0;
  const selectedCount = selected.size;

  return (
    <div className="pf-page">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="pf-hero">
        <div className="pf-hero-inner">
          <p className="pf-hero-eyebrow">Portfolio</p>
          <h1 className="pf-hero-title">Your portfolio.</h1>
          <p className="pf-hero-sub">
            Every piece you&apos;ve shipped through the Customer Acquisition
            Engine, plus your external work. Feature up to 6 for your public
            profile.
          </p>
          <div className="pf-hero-stats">
            <div className="pf-hero-stat">
              <span className="pf-hero-stat-n">{stats.total}</span>
              <span className="pf-hero-stat-l">Total pieces</span>
            </div>
            <div className="pf-hero-stat">
              <span className="pf-hero-stat-n">{stats.campaignCount}</span>
              <span className="pf-hero-stat-l">Campaign pieces</span>
            </div>
            <div className="pf-hero-stat">
              <span className="pf-hero-stat-n">{stats.externalCount}</span>
              <span className="pf-hero-stat-l">External pieces</span>
            </div>
            <div className="pf-hero-stat pf-hero-stat--accent">
              <span className="pf-hero-stat-n">{stats.featuredCount}</span>
              <span className="pf-hero-stat-l">Featured</span>
            </div>
          </div>
          <Link
            href={`/c/${DEMO_HANDLE}`}
            className="pf-hero-share"
            target="_blank"
          >
            Share public profile
            <span aria-hidden> &rarr;</span>
          </Link>
        </div>
      </section>

      {/* ── Featured bar ───────────────────────────────────────── */}
      {stats.featuredCount > 0 && (
        <div className="pf-featured-bar">
          <div className="pf-featured-bar-inner">
            <span className="pf-featured-bar-count">
              <strong>{stats.featuredCount}</strong>{" "}
              {stats.featuredCount === 1 ? "featured item" : "featured items"}
            </span>
            <span className="pf-featured-bar-note">
              Only the first 6 show on your public profile.
            </span>
          </div>
        </div>
      )}

      {/* ── Filter row ─────────────────────────────────────────── */}
      <div className="pf-filter-row">
        <div className="pf-filter-row-inner">
          <div
            className="pf-chip-group"
            role="tablist"
            aria-label="Source filter"
          >
            {(
              [
                { id: "all", label: "All" },
                { id: "campaigns", label: "Campaigns" },
                { id: "external", label: "External" },
                { id: "featured", label: "Featured" },
                { id: "recent", label: "Recent" },
              ] as { id: TabFilter; label: string }[]
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={tab === f.id}
                className={`pf-chip ${tab === f.id ? "pf-chip--on" : ""}`}
                onClick={() => setTab(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="pf-chip-group" aria-label="Platform filter">
            {(
              [
                { id: "all", label: "All" },
                { id: "instagram", label: "Instagram" },
                { id: "tiktok", label: "TikTok" },
                { id: "xiaohongshu", label: "Xiaohongshu" },
                { id: "link", label: "Link" },
              ] as { id: PlatformFilter; label: string }[]
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                className={`pf-chip pf-chip--sm ${platform === f.id ? "pf-chip--on" : ""}`}
                onClick={() => setPlatform(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="pf-filter-row-actions">
            <button
              type="button"
              className={`pf-btn pf-btn--ghost pf-btn--sm ${selectMode ? "pf-btn--active" : ""}`}
              onClick={() =>
                selectMode ? exitSelectMode() : setSelectMode(true)
              }
            >
              {selectMode ? "Done" : "Select"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Bulk actions bar ───────────────────────────────────── */}
      {selectMode && (
        <div
          className={`pf-bulk-bar ${selectedCount > 0 ? "pf-bulk-bar--active" : ""}`}
        >
          <div className="pf-bulk-bar-inner">
            <span className="pf-bulk-count">
              <strong>{selectedCount}</strong> selected
            </span>
            <div className="pf-bulk-actions">
              <button
                type="button"
                className="pf-btn pf-btn--ghost pf-btn--sm"
                disabled={selectedCount === 0}
                onClick={() => bulkFeature(true)}
              >
                Feature {selectedCount || ""}
              </button>
              <button
                type="button"
                className="pf-btn pf-btn--ghost pf-btn--sm"
                disabled={selectedCount === 0}
                onClick={() => bulkFeature(false)}
              >
                Unfeature {selectedCount || ""}
              </button>
              <button
                type="button"
                className="pf-btn pf-btn--ghost pf-btn--sm"
                disabled={selectedCount === 0}
                onClick={bulkExport}
              >
                Export {selectedCount || ""}
              </button>
              <button
                type="button"
                className="pf-btn pf-btn--danger pf-btn--sm"
                disabled={selectedCount === 0}
                onClick={bulkDelete}
              >
                Delete {selectedCount || ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Content grid or empty state ────────────────────────── */}
      <section className="pf-grid-section">
        <div className="pf-grid-section-inner">
          {isEmpty ? (
            <div className="pf-empty">
              <div className="pf-empty-mark" aria-hidden />
              <h2 className="pf-empty-title">Your portfolio is empty.</h2>
              <p className="pf-empty-sub">
                Complete your first Customer Acquisition Engine campaign and
                every verified piece will land here.
              </p>
              <Link href="/creator/explore" className="pf-btn pf-btn--primary">
                Find a campaign
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="pf-empty pf-empty--compact">
              <h2 className="pf-empty-title">No pieces match this filter.</h2>
              <p className="pf-empty-sub">
                Try a different tab or platform to see more of your work.
              </p>
            </div>
          ) : (
            <div className="pf-grid">
              {filtered.map((p) => (
                <ContentCard
                  key={p.id}
                  piece={p}
                  selected={selected.has(p.id)}
                  selectMode={selectMode}
                  onToggleFeature={toggleFeature}
                  onOpenDetail={setOpenId}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Add External Work ──────────────────────────────────── */}
      <section className="pf-add-section">
        <div className="pf-add-section-inner">
          <div className="pf-add-heading">
            <div>
              <p className="pf-hero-eyebrow">Add external work</p>
              <h2 className="pf-add-title">
                Pull in a post you already shipped.
              </h2>
              <p className="pf-add-sub">
                External work doesn&apos;t carry ConversionOracle verified
                customers, but it helps merchants read your range.
              </p>
            </div>
            <button
              type="button"
              className={`pf-btn pf-btn--primary ${addOpen ? "pf-btn--active" : ""}`}
              onClick={() => setAddOpen((v) => !v)}
              aria-expanded={addOpen}
            >
              {addOpen ? "Close" : "Add external work"}
            </button>
          </div>

          {addOpen && (
            <form className="pf-add-form" onSubmit={submitExternal}>
              <div className="pf-add-row">
                <label className="pf-add-label" htmlFor="add-platform">
                  Platform
                </label>
                <select
                  id="add-platform"
                  className="pf-input pf-select"
                  value={addPlatform}
                  onChange={(e) => setAddPlatform(e.target.value as Platform)}
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="xiaohongshu">Xiaohongshu</option>
                  <option value="link">Link (article / blog)</option>
                </select>
              </div>

              <div className="pf-add-row">
                <label className="pf-add-label" htmlFor="add-url">
                  URL
                </label>
                <input
                  id="add-url"
                  type="url"
                  className="pf-input"
                  placeholder="https://instagram.com/p/..."
                  value={addUrl}
                  onChange={(e) => onUrlChange(e.target.value)}
                />
                {addPreview && (
                  <p className="pf-add-preview">
                    Detected: <strong>{addPreview.platform}</strong> · handle{" "}
                    <strong>@{addPreview.handle}</strong>
                  </p>
                )}
              </div>

              <div className="pf-add-row">
                <label className="pf-add-label" htmlFor="add-caption">
                  Caption / notes
                </label>
                <textarea
                  id="add-caption"
                  className="pf-input pf-textarea"
                  placeholder="How this piece reflects your work"
                  value={addCaption}
                  onChange={(e) => setAddCaption(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="pf-add-actions">
                <button
                  type="button"
                  className="pf-btn pf-btn--ghost"
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pf-btn pf-btn--primary">
                  Add to portfolio
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── External work list ─────────────────────────────────── */}
      {externalOnly.length > 0 && (
        <section className="pf-ext-section">
          <div className="pf-ext-section-inner">
            <div className="pf-add-heading">
              <div>
                <p className="pf-hero-eyebrow">External work log</p>
                <h2 className="pf-add-title">
                  {externalOnly.length} external{" "}
                  {externalOnly.length === 1 ? "piece" : "pieces"}
                </h2>
              </div>
            </div>
            <ul className="pf-ext-list">
              {externalOnly.map((p) => (
                <li key={p.id} className="pf-ext-row">
                  <span className="pf-ext-icon">
                    <PlatformIcon platform={p.platform} />
                  </span>
                  <div className="pf-ext-body">
                    <span className="pf-ext-title">{p.title}</span>
                    {p.externalUrl && (
                      <a
                        href={p.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pf-ext-url"
                      >
                        {p.externalUrl.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                  <span className="pf-ext-date">{formatDate(p.addedDate)}</span>
                  <button
                    type="button"
                    className="pf-ext-remove"
                    onClick={() => removeExternal(p.id)}
                    aria-label={`Remove ${p.title}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Detail panel ───────────────────────────────────────── */}
      {openPiece && (
        <DetailPanel
          piece={openPiece}
          onClose={() => setOpenId(null)}
          onToggleFeature={toggleFeature}
        />
      )}
    </div>
  );
}
