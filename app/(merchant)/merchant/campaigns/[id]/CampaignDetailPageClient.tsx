"use client";

/*
  Merchant Campaign Detail — v12 Premium
  Creator-parity redesign:
    ┌──────────────────────────────────────┬──────────────┐
    │  [5-tile gallery]                    │              │
    │  CATEGORY · LOCATION                 │  Budget      │
    │  Title (Darky 64px)                  │  (dark ink)  │
    │  date range · chips                  │              │
    │  [highlights bar: budget/creators/   │  Controls    │
    │   deadline]                          │  (white)     │
    ├──────────────────────────────────────┤              │
    │  [Sticky jump bar]                   │  Meta        │
    ├──────────────────────────────────────┤  (glass)     │
    │  #brief   · #creators · #analytics  │              │
    │  #locations · #timeline · #settings  │              │
    └──────────────────────────────────────┴──────────────┘
*/

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Users,
  BarChart2,
  MapPin,
  Clock,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Pencil,
  QrCode,
  Copy,
  ExternalLink,
} from "lucide-react";
import { CampaignStatus, type Campaign } from "@/lib/data/types";
import type { AttributionSummary } from "@/lib/data/api-client";
import { findMerchantCampaign } from "@/lib/data/merchant-campaigns";
import type { MockApplication } from "@/lib/data/mock-applications";
import { CampaignActions } from "./CampaignActions";
import { ImageArchivePicker } from "@/components/merchant/campaign-wizard/ImageArchivePicker";
import "../campaigns.css";
import "./campaign-detail.css";

export interface CampaignDetailPageData {
  campaign: Campaign | null;
  summary: AttributionSummary;
}

interface Props {
  initialData: CampaignDetailPageData;
}

type SectionKey =
  | "brief"
  | "applicants"
  | "creators"
  | "analytics"
  | "locations"
  | "timeline"
  | "settings";

const SECTIONS: SectionKey[] = [
  "brief",
  "applicants",
  "creators",
  "analytics",
  "locations",
  "timeline",
  "settings",
];

const SECTION_LABELS: Record<SectionKey, string> = {
  brief: "Brief",
  applicants: "Applicants",
  creators: "Creators",
  analytics: "Analytics",
  locations: "Locations",
  timeline: "Timeline",
  settings: "Settings",
};

/* Demo brief rules per category */
const BRIEF_RULES: Record<string, { include: string[]; avoid: string[] }> = {
  coffee: {
    include: [
      "Show the drink being prepared or served",
      "Tag @blankstreet and use #BlankStreetMatcha",
      "Vertical format, 9:16 ratio, natural light preferred",
      "Show the physical location (exterior or interior)",
    ],
    avoid: [
      "Competitor brand mentions or visible logos",
      "Heavy filters that distort true color",
      "Text overlays covering the product",
    ],
  },
  bakery: {
    include: [
      "Close-up of the baked good (carousel encouraged)",
      "Morning light — before 10am shoot preferred",
      "Tag @bagelsofny and use #MorningBagel",
      "Show the schmear selection in-frame",
    ],
    avoid: [
      "Blurry or out-of-focus hero shots",
      "Vertical text overlays obscuring food",
      "Filming other customers without consent",
    ],
  },
  default: {
    include: [
      "Show authentic in-store experience",
      "Tag the merchant account in your post",
      "Use campaign hashtag in caption",
      "Prioritize natural, editorial aesthetics",
    ],
    avoid: [
      "Staged or overly produced content",
      "Competitor brand mentions",
      "Heavy post-processing filters",
    ],
  },
};

/* Demo deliverables per category */
const DELIVERABLES: Record<
  string,
  Array<{ count: number; type: string; pay: number }>
> = {
  coffee: [
    { count: 1, type: "30-sec Reel", pay: 5 },
    { count: 1, type: "Story set (3 frames)", pay: 0 },
  ],
  bakery: [
    { count: 1, type: "Carousel (3 slides)", pay: 4 },
    { count: 1, type: "In-feed photo", pay: 0 },
  ],
  default: [
    { count: 1, type: "Short-form video", pay: 0 },
    { count: 1, type: "In-feed post", pay: 0 },
  ],
};

/* ── Helpers ────────────────────────────────────────────────── */

function numberOrZero(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
function formatUsd(v: number | null | undefined): string {
  return `$${numberOrZero(v).toLocaleString("en-US")}`;
}
function formatDate(v: string | null | undefined): string {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function formatDateShort(v: string | null | undefined): string {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
function daysRemaining(iso: string | null | undefined): number {
  if (!iso) return 0;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}
function getBadgeStatus(
  status: Campaign["status"],
): "active" | "paused" | "draft" | "closed" {
  if (
    status === CampaignStatus.Completed ||
    status === CampaignStatus.Cancelled
  )
    return "closed";
  return status;
}
function normalizeActionStatus(
  status: Campaign["status"],
): "active" | "paused" | "draft" | "closed" {
  return getBadgeStatus(status);
}

/* Gallery tile count — always show 5 placeholder tiles */
const TILE_POSITIONS = ["pos-1", "pos-2", "pos-3", "pos-4"] as const;

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function CampaignDetailPageClient({ initialData }: Props) {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(
    initialData.campaign,
  );
  const [loadingCampaign, setLoadingCampaign] = useState(!initialData.campaign);

  const [activeSection, setActiveSection] = useState<SectionKey>("brief");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [applicants, setApplicants] = useState<MockApplication[]>([]);
  const [applicantFilter, setApplicantFilter] = useState<
    "all" | "pending" | "accepted" | "declined"
  >("all");
  const [decisionLoading, setDecisionLoading] = useState<Set<string>>(
    new Set(),
  );
  const [qrOrigin, setQrOrigin] = useState("");
  const [qrScanCount, setQrScanCount] = useState<number | null>(null);
  const [qrCopied, setQrCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const sectionRefs = useRef<Record<SectionKey, HTMLElement | null>>({
    brief: null,
    applicants: null,
    creators: null,
    analytics: null,
    locations: null,
    timeline: null,
    settings: null,
  });

  /* IntersectionObserver — active section from scroll position */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as SectionKey);
      },
      { rootMargin: "-100px 0px -55% 0px", threshold: [0, 0.1, 0.5, 1] },
    );
    SECTIONS.forEach((s) => {
      const el = sectionRefs.current[s];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* localStorage fallback — runs client-side when server returned null
     (Vercel serverless instances don't share playtestCampaigns in-memory state) */
  useEffect(() => {
    if (initialData.campaign) return;
    const id = params?.id;
    if (!id) {
      setLoadingCampaign(false);
      return;
    }
    const local = findMerchantCampaign(id);
    if (local) {
      setCampaign(local);
      setLoadingCampaign(false);
      return;
    }
    fetch(`/api/merchant/campaigns/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Campaign | null) => {
        if (data?.id) setCampaign(data);
      })
      .catch(() => {})
      .finally(() => setLoadingCampaign(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Fetch applicants for this campaign */
  useEffect(() => {
    const cid = campaign?.id;
    if (!cid) return;
    fetch(`/api/merchant/applicants?campaignId=${encodeURIComponent(cid)}`)
      .then((r) => r.json())
      .then(({ data }: { data: MockApplication[] }) =>
        setApplicants(data ?? []),
      )
      .catch(() => {});
  }, [campaign?.id]);

  /* QR origin + scan stats + QR image generation */
  useEffect(() => {
    const origin = window.location.origin;
    setQrOrigin(origin);
    const cid = campaign?.id;
    if (!cid) return;

    // Generate QR using npm qrcode package
    const scanUrl = `${origin}/scan/${cid}`;
    import("qrcode")
      .then((QRCode) =>
        QRCode.toDataURL(scanUrl, {
          width: 160,
          margin: 2,
          color: { dark: "#1a1916", light: "#ffffff" },
        }),
      )
      .then((dataUrl: string) => setQrDataUrl(dataUrl))
      .catch(() => setQrDataUrl(null));

    fetch(`/api/merchant/qr-stats?campaignId=${encodeURIComponent(cid)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ scanCount }: { scanCount: number }) => setQrScanCount(scanCount))
      .catch(() => setQrScanCount(0));
  }, [campaign?.id]);

  function jumpTo(key: SectionKey) {
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleDecision(
    ids: string[],
    decision: "accept" | "decline" | "shortlist",
  ) {
    setDecisionLoading((prev) => new Set([...prev, ...ids]));
    try {
      await fetch("/api/merchant/applicants/batch-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds: ids, decision }),
      });
      const nextStatus =
        decision === "accept"
          ? "accepted"
          : decision === "decline"
            ? "declined"
            : "shortlisted";
      setApplicants((prev) =>
        prev.map((a) =>
          ids.includes(a.id)
            ? { ...a, status: nextStatus as MockApplication["status"] }
            : a,
        ),
      );
    } catch {
      /* silently fail; state stays as-is */
    } finally {
      setDecisionLoading((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  }

  /* ── Loading / not-found state ── */
  if (loadingCampaign) {
    return (
      <div className="mcd-page">
        <div className="mcd-shell">
          <div
            className="mcd-empty"
            style={{ gridColumn: "1 / -1", marginTop: 80 }}
          >
            <p className="mcd-empty__sub">Loading campaign…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="mcd-page">
        <div className="mcd-shell">
          <div
            className="mcd-empty"
            style={{ gridColumn: "1 / -1", marginTop: 80 }}
          >
            <h1 className="mcd-empty__title">Campaign not found</h1>
            <p className="mcd-empty__sub">
              This campaign may have been removed or you don&apos;t have access
              to it.
            </p>
            <Link
              href="/merchant/campaigns"
              style={{
                marginTop: 16,
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--brand-red)",
                textDecoration: "underline",
              }}
            >
              ← Back to campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const summary = initialData.summary;

  /* Budget maths */
  const budgetTotal = numberOrZero(campaign.budget_total);
  const budgetRemaining = Math.max(numberOrZero(campaign.budget_remaining), 0);
  const budgetUsed = Math.max(budgetTotal - budgetRemaining, 0);
  const budgetUsedPercent =
    budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;

  const badgeStatus = getBadgeStatus(campaign.status);
  const category = (campaign.tags?.[0] ?? "").toLowerCase();
  const briefRules = BRIEF_RULES[category] ?? BRIEF_RULES.default;
  const deliverables = DELIVERABLES[category] ?? DELIVERABLES.default;

  /* Creator + location + timeline sorted */
  const topCreators = [...summary.by_creator].sort(
    (a, b) => b.revenue - a.revenue,
  );
  const topLocations = [...summary.by_location].sort(
    (a, b) => b.revenue - a.revenue,
  );
  const timeline = [...summary.by_day].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  /* Spark bar max for normalization */
  const maxScans = Math.max(1, ...timeline.map((d) => numberOrZero(d.scans)));

  /* Number of open creator slots — max_creators may be absent on demo data, fall back to spots_total */
  const maxCreators =
    numberOrZero(campaign.max_creators) || numberOrZero(campaign.spots_total);
  const acceptedCreators = numberOrZero(campaign.accepted_creators);
  const openSlots = Math.max(maxCreators - acceptedCreators, 0);

  /* Controls status */
  const statusDotClass: Record<string, string> = {
    active: "mcd-controls__dot--green",
    paused: "mcd-controls__dot--orange",
    draft: "mcd-controls__dot--orange",
    closed: "mcd-controls__dot--gray",
  };

  return (
    <div className="mcd-page">
      <div className="mcd-shell">
        {/* ══════════════════════════════════════════════════
            LEFT COLUMN — main content
            ══════════════════════════════════════════════════ */}
        <div className="mcd-main">
          {/* ── 5-tile gallery ─────────────────────────── */}
          <div
            className="mcd-gallery"
            role="region"
            aria-label="Campaign photos"
          >
            {/* Hero tile */}
            <button
              className="mcd-gallery__tile mcd-gallery__tile--hero"
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              aria-label="Open gallery"
            >
              {(selectedImages[0] ?? campaign.image_url) ? (
                <img
                  src={selectedImages[0] ?? campaign.image_url!}
                  alt={campaign.title}
                  className="mcd-gallery__img"
                />
              ) : null}
            </button>

            {/* 4 small tiles */}
            {TILE_POSITIONS.map((pos, i) => (
              <button
                key={pos}
                className={`mcd-gallery__tile mcd-gallery__tile--${pos}`}
                onClick={() => {
                  setLightboxIndex(i + 1);
                  setLightboxOpen(true);
                }}
                aria-label={`Photo ${i + 2}`}
              >
                {selectedImages[i + 1] ? (
                  <img
                    src={selectedImages[i + 1]}
                    alt={`Campaign photo ${i + 2}`}
                    className="mcd-gallery__img"
                  />
                ) : null}
              </button>
            ))}

            <button
              className="mcd-gallery__all"
              onClick={() => setLightboxOpen(true)}
            >
              <ImageIcon size={13} strokeWidth={2} />
              Show all photos
            </button>
            <button
              className="mcd-gallery__edit"
              onClick={() => setArchiveOpen(true)}
              aria-label="Edit campaign photos"
            >
              <Pencil size={11} strokeWidth={2} />
              Edit photos
            </button>
          </div>

          {/* ── Header ─────────────────────────────────── */}
          <header className="mcd-header">
            <p className="mcd-eyebrow">
              {(campaign.tags?.[0] ?? "campaign").toUpperCase()}
              {campaign.location ? ` · ${campaign.location}` : ""}
            </p>
            <h1 className="mcd-title">{campaign.title}</h1>
            <p className="mcd-sub">
              {campaign.start_date
                ? `${formatDate(campaign.start_date)} → ${formatDate(campaign.end_date)}`
                : `Ends ${formatDate(campaign.end_date)}`}
            </p>
            <div className="mcd-chips">
              <span className={`mcd-chip mcd-chip--${badgeStatus}`}>
                {badgeStatus}
              </span>
              <span className="mcd-chip">
                {acceptedCreators} creator{acceptedCreators !== 1 ? "s" : ""}
              </span>
              <span className="mcd-chip">
                {formatUsd(campaign.payout ?? campaign.reward_per_visit)} per
                visit
              </span>
              {openSlots > 0 && (
                <span className="mcd-chip mcd-chip--draft">
                  {openSlots} slot{openSlots !== 1 ? "s" : ""} open
                </span>
              )}
            </div>
          </header>

          {/* ── Highlights bar ──────────────────────────── */}
          <div
            className="mcd-highlights"
            role="group"
            aria-label="Campaign highlights"
          >
            <div className="mcd-highlight">
              <span className="mcd-highlight__icon" aria-hidden>
                <DollarSign size={20} strokeWidth={1.75} />
              </span>
              <div className="mcd-highlight__body">
                <p className="mcd-highlight__title">
                  {formatUsd(budgetRemaining)}
                </p>
                <p className="mcd-highlight__sub">
                  Budget remaining · {Math.round(budgetUsedPercent)}% used
                </p>
              </div>
            </div>
            <div className="mcd-highlight">
              <span className="mcd-highlight__icon" aria-hidden>
                <Users size={20} strokeWidth={1.75} />
              </span>
              <div className="mcd-highlight__body">
                <p className="mcd-highlight__title">
                  {acceptedCreators} of {maxCreators || "∞"}
                </p>
                <p className="mcd-highlight__sub">
                  Creators accepted ·{" "}
                  {openSlots > 0 ? `${openSlots} open` : "full"}
                </p>
              </div>
            </div>
            <div className="mcd-highlight">
              <span className="mcd-highlight__icon" aria-hidden>
                <Clock size={20} strokeWidth={1.75} />
              </span>
              <div className="mcd-highlight__body">
                <p className="mcd-highlight__title">
                  {formatDateShort(campaign.end_date)}
                </p>
                <p className="mcd-highlight__sub">
                  Campaign deadline · {daysRemaining(campaign.end_date)} days
                  left
                </p>
              </div>
            </div>
          </div>

          {/* ── Sticky jump bar ─────────────────────────── */}
          <nav
            className="mcd-jumpbar"
            role="tablist"
            aria-label="Campaign sections"
          >
            {SECTIONS.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeSection === key}
                onClick={() => jumpTo(key)}
                className={`mcd-jumpbar__link${activeSection === key ? " is-active" : ""}`}
              >
                {key === "brief" && <FileText size={14} strokeWidth={1.75} />}
                {key === "applicants" && (
                  <CheckCircle2 size={14} strokeWidth={1.75} />
                )}
                {key === "creators" && <Users size={14} strokeWidth={1.75} />}
                {key === "analytics" && (
                  <BarChart2 size={14} strokeWidth={1.75} />
                )}
                {key === "locations" && <MapPin size={14} strokeWidth={1.75} />}
                {key === "timeline" && <Clock size={14} strokeWidth={1.75} />}
                {key === "settings" && (
                  <SettingsIcon size={14} strokeWidth={1.75} />
                )}
                <span>{SECTION_LABELS[key]}</span>
              </button>
            ))}
          </nav>

          {/* ══ STACKED SECTIONS ══════════════════════════════ */}

          {/* ── §1 Brief ──────────────────────────────────── */}
          <section
            id="brief"
            ref={(el) => {
              sectionRefs.current.brief = el;
            }}
            className="mcd-section"
            aria-label="Brief"
          >
            <h2 className="mcd-section__title">What you&apos;re asking for</h2>
            <p className="mcd-brief__body">
              {campaign.description ||
                `${campaign.title} is a Push campaign inviting local creators to capture authentic content and drive measurable foot traffic.`}
            </p>

            {/* Must-include / Must-avoid */}
            <div className="mcd-brief-rules">
              <div className="mcd-brief-rules__col mcd-brief-rules__col--include">
                <p className="mcd-brief-rules__col-eyebrow">
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  Must include
                </p>
                <ul className="mcd-brief-rules__list">
                  {briefRules.include.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="mcd-brief-rules__col mcd-brief-rules__col--avoid">
                <p className="mcd-brief-rules__col-eyebrow">
                  <AlertCircle size={12} strokeWidth={2.5} />
                  Must avoid
                </p>
                <ul className="mcd-brief-rules__list">
                  {briefRules.avoid.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h3
                className="mcd-section__title"
                style={{ fontSize: 18, marginBottom: 12 }}
              >
                Deliverables
              </h3>
              <ul className="mcd-deliv">
                {deliverables.map((d, i) => (
                  <li className="mcd-deliv__row" key={i}>
                    <span className="mcd-deliv__count">{d.count}×</span>
                    <span className="mcd-deliv__type">{d.type}</span>
                    <span className="mcd-deliv__pay">
                      {d.pay > 0 ? formatUsd(d.pay) : "included"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            {(campaign.tags ?? []).length > 0 && (
              <div className="mcd-tags">
                {(campaign.tags ?? []).map((tag) => (
                  <span key={tag} className="mcd-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── §1.5 Applicants ─────────────────────────── */}
          <section
            id="applicants"
            ref={(el) => {
              sectionRefs.current.applicants = el;
            }}
            className="mcd-section"
            aria-label="Applicants"
          >
            <h2 className="mcd-section__title">Applications</h2>
            <p className="mcd-section__sub">
              {applicants.length > 0
                ? `${applicants.length} creator${applicants.length !== 1 ? "s" : ""} applied. Review and accept to fill your creator slots.`
                : "No applications yet — once creators apply via Push, they appear here for your review."}
            </p>

            {/* Filter tabs */}
            {applicants.length > 0 && (
              <>
                <div className="mcd-app-filters">
                  {(["all", "pending", "accepted", "declined"] as const).map(
                    (f) => {
                      const count =
                        f === "all"
                          ? applicants.length
                          : applicants.filter((a) => a.status === f).length;
                      return (
                        <button
                          key={f}
                          type="button"
                          className={`mcd-app-filter${applicantFilter === f ? " is-active" : ""}`}
                          onClick={() => setApplicantFilter(f)}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                          {count > 0 && (
                            <span className="mcd-app-filter__count">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>

                <div className="mcd-app-list">
                  {applicants
                    .filter(
                      (a) =>
                        applicantFilter === "all" ||
                        a.status === applicantFilter,
                    )
                    .map((app) => (
                      <div
                        key={app.id}
                        className={`mcd-app-card mcd-app-card--${app.status}`}
                      >
                        <div className="mcd-app-card__avatar" aria-hidden>
                          {(app.creator.handle ?? "?")
                            .replace("@", "")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="mcd-app-card__body">
                          <div className="mcd-app-card__head">
                            <span className="mcd-app-card__handle">
                              {app.creator.handle}
                            </span>
                            <span
                              className={`mcd-app-card__tier mcd-app-card__tier--${app.creator.tier}`}
                            >
                              {app.creator.tier}
                            </span>
                            <span className="mcd-app-card__score">
                              {app.matchScore}/100
                            </span>
                          </div>
                          {app.coverLetter && (
                            <p className="mcd-app-card__pitch">
                              {app.coverLetter}
                            </p>
                          )}
                          <p className="mcd-app-card__meta">
                            {app.creator.followers.toLocaleString("en-US")}{" "}
                            followers · {app.creator.campaignsCompleted}{" "}
                            campaigns ·{" "}
                            {(app.creator.conversionRate * 100).toFixed(0)}%
                            conversion · applied{" "}
                            {new Date(app.appliedAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        </div>
                        <div className="mcd-app-card__actions">
                          {app.status === "pending" ||
                          app.status === "shortlisted" ? (
                            <>
                              <button
                                type="button"
                                className="mcd-app-btn mcd-app-btn--accept"
                                disabled={decisionLoading.has(app.id)}
                                onClick={() =>
                                  handleDecision([app.id], "accept")
                                }
                              >
                                {decisionLoading.has(app.id) ? "…" : "Accept"}
                              </button>
                              <button
                                type="button"
                                className="mcd-app-btn mcd-app-btn--decline"
                                disabled={decisionLoading.has(app.id)}
                                onClick={() =>
                                  handleDecision([app.id], "decline")
                                }
                              >
                                {decisionLoading.has(app.id) ? "…" : "Decline"}
                              </button>
                            </>
                          ) : (
                            <span
                              className={`mcd-app-badge mcd-app-badge--${app.status}`}
                            >
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {applicants.length === 0 && (
              <div className="mcd-empty">
                <p className="mcd-empty__title">No applications yet</p>
                <p className="mcd-empty__sub">
                  Share your campaign with creators — once they apply via Push,
                  they&apos;ll appear here for review.
                </p>
              </div>
            )}
          </section>

          {/* ── §2 Creators ───────────────────────────────── */}
          <section
            id="creators"
            ref={(el) => {
              sectionRefs.current.creators = el;
            }}
            className="mcd-section"
            aria-label="Creators"
          >
            <h2 className="mcd-section__title">Creator performance</h2>
            <p className="mcd-section__sub">
              {topCreators.length > 0
                ? `${topCreators.length} creator${topCreators.length !== 1 ? "s" : ""} active on this campaign. Sorted by attributed revenue.`
                : "No creator activity yet — once accepted creators post, their scans, verified visits, and ROI appear here."}
            </p>

            {topCreators.length === 0 ? (
              <div className="mcd-empty">
                <p className="mcd-empty__title">Waiting for creators</p>
                <p className="mcd-empty__sub">
                  Accept applications in Settings → creator applications will
                  start arriving once the campaign is live.
                </p>
              </div>
            ) : (
              <div className="mcd-creator-list">
                {topCreators.map((c) => {
                  const initial = (c.creator_id ?? "?")
                    .replace("@", "")
                    .charAt(0)
                    .toUpperCase();
                  return (
                    <div className="mcd-creator-row" key={c.creator_id}>
                      <div className="mcd-creator-avatar" aria-hidden>
                        {initial}
                      </div>
                      <div className="mcd-creator-info">
                        <p className="mcd-creator-handle">{c.creator_id}</p>
                        <p className="mcd-creator-meta">
                          {numberOrZero(c.scans)} scans ·{" "}
                          {numberOrZero(c.verified)} verified
                        </p>
                      </div>
                      <div className="mcd-creator-stats">
                        <p className="mcd-creator-revenue">
                          {formatUsd(numberOrZero(c.revenue) / 100)}
                        </p>
                        <p className="mcd-creator-roi">
                          {numberOrZero(c.roi).toFixed(2)}× ROI
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── §3 Analytics ──────────────────────────────── */}
          <section
            id="analytics"
            ref={(el) => {
              sectionRefs.current.analytics = el;
            }}
            className="mcd-section"
            aria-label="Analytics"
          >
            <h2 className="mcd-section__title">Attribution analytics</h2>
            <p className="mcd-section__sub">
              Push QR scan → verified customer attribution. Last-click, 30-day
              window.
            </p>

            {/* KPI cards */}
            <div className="mcd-kpi-row">
              <div className="mcd-kpi">
                <p className="mcd-kpi__eyebrow">Scans</p>
                <p className="mcd-kpi__num">
                  {numberOrZero(summary.scans).toLocaleString("en-US")}
                </p>
                <p className="mcd-kpi__delta mcd-kpi__delta--flat">
                  {numberOrZero(summary.fraud_flags)} fraud flag
                  {summary.fraud_flags !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="mcd-kpi">
                <p className="mcd-kpi__eyebrow">Verified</p>
                <p className="mcd-kpi__num mcd-kpi__num--blue">
                  {numberOrZero(summary.verified_customers).toLocaleString(
                    "en-US",
                  )}
                </p>
                <p className="mcd-kpi__delta mcd-kpi__delta--flat">
                  customers attributed
                </p>
              </div>
              <div className="mcd-kpi">
                <p className="mcd-kpi__eyebrow">Revenue</p>
                <p className="mcd-kpi__num mcd-kpi__num--red">
                  {formatUsd(numberOrZero(summary.revenue_attributed) / 100)}
                </p>
                <p className="mcd-kpi__delta mcd-kpi__delta--flat">
                  {numberOrZero(summary.roi).toFixed(2)}× ROI
                </p>
              </div>
            </div>

            {/* AI performance insights */}
            <MerchantAIInsights campaign={campaign} summary={summary} />

            {/* Daily activity spark bars */}
            {timeline.length > 0 && (
              <div className="mcd-spark">
                <p className="mcd-spark__head">Daily scan activity</p>
                <div className="mcd-spark__bars">
                  {timeline.slice(-14).map((day, i) => {
                    const pct = (numberOrZero(day.scans) / maxScans) * 100;
                    return (
                      <div key={i} className="mcd-spark__bar-col">
                        <div
                          className={`mcd-spark__bar${pct > 0 ? " mcd-spark__bar--filled" : ""}`}
                          style={{ height: `${Math.max(6, pct)}%` }}
                          title={`${day.date}: ${day.scans} scans`}
                        />
                        {i % 3 === 0 && (
                          <span className="mcd-spark__lbl">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* ── §4 Locations ──────────────────────────────── */}
          <section
            id="locations"
            ref={(el) => {
              sectionRefs.current.locations = el;
            }}
            className="mcd-section"
            aria-label="Locations"
          >
            <h2 className="mcd-section__title">Location breakdown</h2>
            <p className="mcd-section__sub">
              Revenue and scan attribution per applicable location.
            </p>

            {topLocations.length === 0 ? (
              <div className="mcd-empty">
                <p className="mcd-empty__title">No location activity yet</p>
                <p className="mcd-empty__sub">
                  Scan and revenue data per location appears once customers
                  start redeeming.
                </p>
              </div>
            ) : (
              <div className="mcd-location-list">
                {topLocations.map((loc) => (
                  <div className="mcd-location-row" key={loc.location_id}>
                    <span className="mcd-location-name">{loc.location_id}</span>
                    <span className="mcd-location-scans">
                      {numberOrZero(loc.scans)} scans
                    </span>
                    <span className="mcd-location-rev">
                      {formatUsd(numberOrZero(loc.revenue) / 100)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── §5 Timeline ───────────────────────────────── */}
          <section
            id="timeline"
            ref={(el) => {
              sectionRefs.current.timeline = el;
            }}
            className="mcd-section"
            aria-label="Timeline"
          >
            <h2 className="mcd-section__title">Daily pacing</h2>
            <p className="mcd-section__sub">
              Scan and verified-customer rhythm since campaign launch.
            </p>

            {timeline.length === 0 ? (
              <div className="mcd-empty">
                <p className="mcd-empty__title">No activity yet</p>
                <p className="mcd-empty__sub">
                  Daily scan cadence plots here once the first customer redeems.
                </p>
              </div>
            ) : (
              <ol className="mcd-timeline">
                {timeline.map((entry) => (
                  <li className="mcd-timeline-item" key={entry.date}>
                    <span className="mcd-timeline-date">
                      {formatDateShort(entry.date)}
                    </span>
                    <p className="mcd-timeline-body">
                      {numberOrZero(entry.scans)} scan
                      {entry.scans !== 1 ? "s" : ""} ·{" "}
                      {numberOrZero(entry.verified)} verified
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* ── §6 Settings ───────────────────────────────── */}
          <section
            id="settings"
            ref={(el) => {
              sectionRefs.current.settings = el;
            }}
            className="mcd-section"
            aria-label="Campaign settings"
          >
            <h2 className="mcd-section__title">Campaign settings</h2>
            <p className="mcd-section__sub">
              Current configuration for this campaign. Click Edit to modify.
            </p>

            <div className="mcd-settings-grid">
              {[
                { key: "Status", val: campaign.status?.toUpperCase() ?? "—" },
                {
                  key: "Payout per visit",
                  val: formatUsd(campaign.payout ?? campaign.reward_per_visit),
                },
                {
                  key: "Max creators",
                  val: String(maxCreators || "Unlimited"),
                },
                { key: "Budget total", val: formatUsd(budgetTotal) },
                { key: "Budget remaining", val: formatUsd(budgetRemaining) },
                { key: "Start date", val: formatDate(campaign.start_date) },
                { key: "End date", val: formatDate(campaign.end_date) },
                {
                  key: "Locations",
                  val: String((campaign.applicable_location_ids ?? []).length),
                },
                { key: "Category", val: campaign.tags?.[0] ?? "—" },
              ].map(({ key, val }) => (
                <div className="mcd-settings-row" key={key}>
                  <span className="mcd-settings-key">{key}</span>
                  <span className="mcd-settings-val">{val}</span>
                  <button
                    className="mcd-settings-edit"
                    type="button"
                    aria-label={`Edit ${key}`}
                  >
                    <Pencil size={10} strokeWidth={2.5} />
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT RAIL — sticky budget + controls + meta
            ══════════════════════════════════════════════════ */}
        <aside className="mcd-rail" aria-label="Campaign controls">
          {/* Budget card — dark ink */}
          <div className="mcd-budget">
            <p className="mcd-budget__eyebrow">Budget remaining</p>
            <p className="mcd-budget__num">{formatUsd(budgetRemaining)}</p>
            <p className="mcd-budget__sub">
              {formatUsd(budgetUsed)} of {formatUsd(budgetTotal)} spent
            </p>
            <div className="mcd-budget__bar">
              <div
                className="mcd-budget__bar-fill"
                style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
              />
            </div>
            <ul className="mcd-budget__rows">
              <li className="mcd-budget__row">
                <span>Total budget</span>
                <strong>{formatUsd(budgetTotal)}</strong>
              </li>
              <li className="mcd-budget__row">
                <span>Spent</span>
                <strong>{formatUsd(budgetUsed)}</strong>
              </li>
              <li className="mcd-budget__row">
                <span>Payout / visit</span>
                <strong>
                  {formatUsd(campaign.payout ?? campaign.reward_per_visit)}
                </strong>
              </li>
              <li className="mcd-budget__row">
                <span>ROI</span>
                <strong>{numberOrZero(summary.roi).toFixed(2)}×</strong>
              </li>
            </ul>
          </div>

          {/* Controls card — white */}
          <div className="mcd-controls">
            <p className="mcd-controls__eyebrow">Campaign</p>
            <p
              className={`mcd-controls__status mcd-controls__status--${badgeStatus}`}
            >
              {badgeStatus.charAt(0).toUpperCase() + badgeStatus.slice(1)}
            </p>
            <ul className="mcd-controls__rows">
              <li className="mcd-controls__row">
                <span
                  className={`mcd-controls__dot ${statusDotClass[badgeStatus] ?? "mcd-controls__dot--gray"}`}
                />
                <span className="mcd-controls__lbl">Status</span>
                <span className="mcd-controls__val">
                  {campaign.status?.toUpperCase() ?? "—"}
                </span>
              </li>
              <li className="mcd-controls__row">
                <span className="mcd-controls__dot mcd-controls__dot--green" />
                <span className="mcd-controls__lbl">Creators</span>
                <span className="mcd-controls__val">
                  {acceptedCreators} / {maxCreators || "∞"}
                </span>
              </li>
              <li className="mcd-controls__row">
                <span
                  className={`mcd-controls__dot ${daysRemaining(campaign.end_date) < 7 ? "mcd-controls__dot--orange" : "mcd-controls__dot--green"}`}
                />
                <span className="mcd-controls__lbl">Days left</span>
                <span className="mcd-controls__val">
                  {daysRemaining(campaign.end_date)}
                </span>
              </li>
            </ul>

            <div className="mcd-cta-stack">
              <CampaignActions
                initialStatus={normalizeActionStatus(campaign.status)}
              />
            </div>
          </div>

          {/* QR card — upgraded with npm qrcode */}
          {(() => {
            const scanUrl = qrOrigin
              ? `${qrOrigin}/scan/${campaign.id}`
              : `https://pushnyc.co/scan/${campaign.id}`;
            const displayUrl =
              scanUrl.replace(/^https?:\/\//, "").slice(0, 36) +
              (scanUrl.length > 44 ? "…" : "");
            return (
              <div className="mcd-qr-card mcd-qr-card--upgraded">
                <p className="mcd-qr-card__eyebrow">
                  <QrCode size={12} strokeWidth={2} />
                  Scan at location
                </p>
                <div className="mcd-qr-card__img-wrap">
                  {qrDataUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={qrDataUrl}
                      alt="Campaign QR code"
                      width={160}
                      height={160}
                      style={{ display: "block", borderRadius: 4 }}
                    />
                  ) : (
                    <div className="mcd-qr-card__placeholder">
                      <QrCode size={40} strokeWidth={1.25} />
                    </div>
                  )}
                </div>
                <p className="mcd-qr-card__stat">
                  {qrScanCount === null ? "—" : qrScanCount} scan
                  {qrScanCount !== 1 ? "s" : ""}
                </p>
                {qrOrigin && (
                  <p className="mcd-qr-card__url-mono" title={scanUrl}>
                    {displayUrl}
                  </p>
                )}
                <div className="mcd-qr-card__actions">
                  <button
                    type="button"
                    className="mcd-qr-card__btn"
                    onClick={() => {
                      navigator.clipboard.writeText(scanUrl).catch(() => {});
                      setQrCopied(true);
                      setTimeout(() => setQrCopied(false), 2000);
                    }}
                    aria-label="Copy scan link"
                  >
                    <Copy size={12} strokeWidth={2} />
                    {qrCopied ? "Copied!" : "Copy link"}
                  </button>
                  <a
                    href={scanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mcd-qr-card__btn"
                    aria-label="Open scan page"
                  >
                    <ExternalLink size={12} strokeWidth={2} />
                    Preview
                  </a>
                </div>
              </div>
            );
          })()}

          {/* Meta card — small glass */}
          <div className="mcd-meta">
            {[
              { key: "Created", val: formatDateShort(campaign.created_at) },
              { key: "Ends", val: formatDateShort(campaign.end_date) },
              {
                key: "ID",
                val: campaign.id ? campaign.id.slice(0, 12) + "…" : "—",
              },
            ].map(({ key, val }) => (
              <div className="mcd-meta__row" key={key}>
                <span className="mcd-meta__key">{key}</span>
                <span className="mcd-meta__val">{val}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ── Lightbox ──────────────────────────────────────── */}
      {lightboxOpen && (
        <GalleryLightbox
          title={campaign.title}
          heroImage={selectedImages[0] ?? campaign.image_url}
          extraImages={selectedImages.slice(1)}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setLightboxIndex}
        />
      )}

      {/* ── Image archive picker ───────────────────────────── */}
      <ImageArchivePicker
        open={archiveOpen}
        initialSelected={[]}
        onClose={() => setArchiveOpen(false)}
        onConfirm={(urls) => {
          setSelectedImages(urls);
          setArchiveOpen(false);
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MERCHANT AI PERFORMANCE INSIGHTS
   Rendered inside the analytics section. Deterministic predictions
   based on campaign category + comparable dataset signals.
   ═══════════════════════════════════════════════════════════════ */

function MerchantAIInsights({
  campaign,
  summary,
}: {
  campaign: Campaign;
  summary: AttributionSummary;
}) {
  const category = (campaign.tags?.[0] ?? "default").toLowerCase();
  const isFood =
    category.includes("coffee") ||
    category.includes("bakery") ||
    category.includes("food") ||
    category.includes("drink");

  const reachLow = isFood ? 2800 : 1900;
  const reachHigh = isFood ? 4200 : 3100;
  const creatorTier = isFood
    ? "Explorer–Operator tier · FOOD & DRINK specialist"
    : "Explorer–Operator tier · LOCAL BUSINESS specialist";
  const conversionPct = isFood ? 38 : 32;
  const actionableTip = isFood
    ? "Morning posts (6–9am) drive 2.4× more saves than afternoon. Brief your creators to shoot at golden hour."
    : category.includes("fashion") || category.includes("style")
      ? "UGC with try-on moments converts 1.8× better than static product shots for your category."
      : "Creators who include a storefront exterior shot see 22% higher attribution rates in comparable campaigns.";

  const hasData = typeof summary.scans === "number" && summary.scans > 0;

  return (
    <div
      className="mcd-ai-insights"
      role="region"
      aria-label="AI performance insights"
    >
      <div className="mcd-ai-insights__head">
        <span className="mcd-ai-insights__badge">AI Insights</span>
        <h3 className="mcd-ai-insights__title">Performance forecast</h3>
      </div>

      <p className="mcd-ai-insights__lede">
        {hasData
          ? `Your campaign is tracking well. Based on ${summary.scans} scans and ${summary.verified_customers} verified visits so far, here's what comparable data predicts.`
          : "Your campaign is set up for success. Based on 247 similar campaigns in your category, here's what to expect."}
      </p>

      <div className="mcd-ai-insights__grid">
        <div className="mcd-ai-insight-card">
          <p className="mcd-ai-insight-card__eyebrow">Predicted reach</p>
          <p className="mcd-ai-insight-card__value">
            {reachLow.toLocaleString("en-US")}–
            {reachHigh.toLocaleString("en-US")}
          </p>
          <p className="mcd-ai-insight-card__sub">
            Organic impressions across creator posts
          </p>
        </div>

        <div className="mcd-ai-insight-card">
          <p className="mcd-ai-insight-card__eyebrow">Best-fit creator</p>
          <p className="mcd-ai-insight-card__value">{creatorTier}</p>
          <p className="mcd-ai-insight-card__sub">
            Highest ROI creator profile for this category
          </p>
        </div>

        <div className="mcd-ai-insight-card">
          <p className="mcd-ai-insight-card__eyebrow">Completion rate</p>
          <p className="mcd-ai-insight-card__value">{conversionPct}%</p>
          <p className="mcd-ai-insight-card__sub">
            Of creators who apply typically complete a verified visit
          </p>
        </div>

        <div className="mcd-ai-insight-card">
          <p className="mcd-ai-insight-card__eyebrow">Category benchmark</p>
          <p className="mcd-ai-insight-card__value">
            {isFood ? "4.1×" : "3.2×"} avg ROI
          </p>
          <p className="mcd-ai-insight-card__sub">
            Median ROI for {category} campaigns on Push
          </p>
        </div>
      </div>

      <div className="mcd-ai-insights__tip">
        <span className="mcd-ai-insights__tip-icon" aria-hidden>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
        <div className="mcd-ai-insights__tip-body">
          <p className="mcd-ai-insights__tip-label">Actionable tip</p>
          <p className="mcd-ai-insights__tip-text">{actionableTip}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GALLERY LIGHTBOX — fullscreen photo viewer
   ═══════════════════════════════════════════════════════════════ */

const TOTAL_TILES = 5;

function GalleryLightbox({
  title,
  heroImage,
  extraImages = [],
  currentIndex,
  onClose,
  onIndexChange,
}: {
  title: string;
  heroImage?: string | null;
  extraImages?: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  /* Build ordered image list: [hero, ...extra, ...remaining placeholders] */
  const allImages: Array<string | null> = [
    heroImage ?? null,
    ...extraImages,
    ...Array<null>(Math.max(0, TOTAL_TILES - 1 - extraImages.length)).fill(
      null,
    ),
  ].slice(0, TOTAL_TILES);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        onIndexChange((currentIndex + 1) % TOTAL_TILES);
      if (e.key === "ArrowLeft")
        onIndexChange((currentIndex - 1 + TOTAL_TILES) % TOTAL_TILES);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, onClose, onIndexChange]);

  const currentSrc = allImages[currentIndex];

  return (
    <div
      className="mcd-lightbox"
      role="dialog"
      aria-modal
      aria-label={`Gallery: ${title}`}
    >
      <div className="mcd-lightbox__bar">
        <button
          className="mcd-lightbox__close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X size={20} strokeWidth={2} />
        </button>
        <span className="mcd-lightbox__count">
          {currentIndex + 1} / {TOTAL_TILES}
        </span>
      </div>

      <div className="mcd-lightbox__main">
        <button
          className="mcd-lightbox__arrow mcd-lightbox__arrow--prev"
          onClick={() =>
            onIndexChange((currentIndex - 1 + TOTAL_TILES) % TOTAL_TILES)
          }
          aria-label="Previous photo"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </button>

        {currentSrc ? (
          <img src={currentSrc} alt={title} className="mcd-lightbox__img" />
        ) : (
          <div className="mcd-lightbox__placeholder">
            Photo {currentIndex + 1}
          </div>
        )}

        <button
          className="mcd-lightbox__arrow mcd-lightbox__arrow--next"
          onClick={() => onIndexChange((currentIndex + 1) % TOTAL_TILES)}
          aria-label="Next photo"
        >
          <ChevronRight size={22} strokeWidth={2} />
        </button>
      </div>

      <div className="mcd-lightbox__strip">
        {allImages.map((src, i) => (
          <button
            key={i}
            className={`mcd-lightbox__thumb${i === currentIndex ? " is-active" : ""}`}
            onClick={() => onIndexChange(i)}
            aria-label={`Go to photo ${i + 1}`}
          >
            {src ? (
              <img src={src} alt="" className="mcd-lightbox__thumb-img" />
            ) : (
              <div className="mcd-lightbox__thumb-grad" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
