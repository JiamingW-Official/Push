"use client";

/* ============================================================
   /creator/campaign/[id] — campaign detail page
   v15 · 2026-05-09 — Airbnb-style stacked sections + sticky top
   jump bar. Inside the workspace layout (gets sidebar + shared
   SWR cache).

   Layout:
     ┌──────────────────────────────────────┬─────────────┐
     │  [hero image]                        │             │
     │  CATEGORY · NEIGHBORHOOD · DIST      │  Sticky     │
     │  Title (Darky)                       │  Pay /      │
     │  Merchant · brief                    │  Eligibility│
     │  [chips]                             │  / APPLY    │
     ├──────────────────────────────────────┤             │
     │  [STICKY: Brief · Cal · Loc · Refs]  │             │
     ├──────────────────────────────────────┤             │
     │  #brief    section                   │             │
     │  #calendar section (interactive)     │             │
     │  #location section                   │             │
     │  #references section                 │             │
     └──────────────────────────────────────┴─────────────┘

   Sticky top jump bar uses scrollIntoView for click + Intersection-
   Observer for active state. Bar is sticky relative to the dh-main
   scroll container (workspace layout's <main>).
   ============================================================ */

import { use, useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Calendar as CalendarIcon,
  FileText,
  Image as ImageIcon,
  Clock,
  Store,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Award,
  TrendingUp,
  Film,
  Camera,
  ScanLine,
  MessageSquare,
  LayoutGrid,
  Music,
  Layers,
  Search,
  Inbox,
  ListChecks,
  ArrowUpRight,
} from "lucide-react";
import { useLiveCampaign } from "@/lib/data/live-campaigns";
import { useApplicationForCampaign } from "@/lib/data/live-applications";
import { useApplyQuota } from "@/lib/services/apply-quota";
import { DEMO_CREATOR } from "@/lib/creator/demo-data";
import type { Campaign } from "@/lib/mocks/campaigns";
import { CampaignCalendar } from "./CampaignCalendar";
import { CampaignLocation } from "./CampaignLocation";
import { ApplyModal } from "./ApplyModal";
import { PhotoGallery } from "./PhotoGallery";
import { PostApplyState } from "./PostApplyState";
import { MoreLikeThisRail } from "./MoreLikeThisRail";
import "./campaign-detail.css";

type SectionKey =
  | "brief"
  | "calendar"
  | "location"
  | "references"
  | "merchant"
  | "rules";
const SECTIONS: SectionKey[] = [
  "brief",
  "calendar",
  "location",
  "references",
  "merchant",
  "rules",
];

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const campaign = useLiveCampaign(id);

  if (!campaign) {
    return (
      <main className="cd-empty" aria-label="Campaign not found">
        <div className="cd-empty__body">
          <h1 className="cd-empty__title">Campaign not found</h1>
          <p className="cd-empty__sub">
            ID <code>{id}</code> doesn&apos;t match any active campaign. It
            may have closed or expired.
          </p>
          <Link href="/creator/discover" className="cd-empty__cta">
            Browse campaigns
          </Link>
        </div>
      </main>
    );
  }

  return <CampaignDetailInner campaign={campaign} />;
}

function CampaignDetailInner({ campaign }: { campaign: Campaign }) {
  const [activeSection, setActiveSection] = useState<SectionKey>("brief");
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  /* v24 — subscribe to the live-applications store. If this user
     has already applied to this campaign, the page transforms into
     post-apply state: right rail swaps Pay/Eligibility for
     <PostApplyState />, the main column inserts MoreLikeThisRail
     above the brief, and the footer renders 3 next-step CTAs. */
  const application = useApplicationForCampaign(campaign.id);
  const hasApplied = application !== undefined;

  /* Phase 2 — tier-based daily apply quota. Computed from the
     creator's tier (DEMO_CREATOR.tier today, real session in prod)
     + their submitted applications. Drives both the visible quota
     line in the eligibility card and the disabled state on the
     Apply button. */
  const quota = useApplyQuota(DEMO_CREATOR.tier);
  const sectionRefs = useRef<Record<SectionKey, HTMLElement | null>>({
    brief: null,
    calendar: null,
    location: null,
    references: null,
    merchant: null,
    rules: null,
  });

  /* IntersectionObserver — set active section based on which is in
     view. Threshold tuned so sections become "active" once their top
     scrolls past the sticky jump bar zone. */
  useEffect(() => {
    const root = document.querySelector(".dh-main") as HTMLElement | null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveSection(visible.target.id as SectionKey);
        }
      },
      {
        root,
        // Top margin matches sticky jumpbar height + a little buffer so
        // the section in the upper third triggers active.
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0, 0.1, 0.5, 1],
      },
    );
    SECTIONS.forEach((s) => {
      const el = sectionRefs.current[s];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function jumpTo(key: SectionKey) {
    const el = sectionRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* Total est. earnings across deliverables. */
  const total = useMemo(() => {
    return campaign.deliverables.reduce(
      (sum, d) => sum + d.unitPay * d.count,
      0,
    );
  }, [campaign.deliverables]);

  const totalHours = useMemo(() => {
    return campaign.deliverables.reduce(
      (sum, d) => sum + (d.estHoursEach ?? 0) * d.count,
      0,
    );
  }, [campaign.deliverables]);

  const hourly = totalHours > 0 ? Math.round(total / totalHours) : null;

  const eligible = campaign.slotsRemaining > 0;
  /* v13 — slot is mandatory before applying. APPLY button stays
     disabled until the user picks one in the Calendar tab. Click
     Apply without slot → switch to Calendar tab automatically.
     Phase 2 — quota gate AND'd in: even with slot + eligible,
     daily/pending caps block the apply path with explanatory copy. */
  const canApply = eligible && selectedSlot !== null && quota.allowed;

  return (
    <main className="cd" aria-label={campaign.title}>
      {/* v11 — back link removed. Page opens in a new tab from
          /creator/discover so "back" is misleading; users close
          the tab to dismiss. Empty state below still gives a
          "Browse campaigns" CTA for deep-link users. */}
      <div className="cd__shell">
        {/* ── Main column ───────────────────────────────── */}
        <div className="cd__main">
          {/* v16 — Airbnb-style 5-tile hero gallery + lightbox.
              Replaces the single 280px hero. Big tile on left
              spans 2 rows; 4 small tiles on right in a 2x2. Click
              any → fullscreen lightbox with arrow nav. */}
          <PhotoGallery images={campaign.images} alt={campaign.title} />

          {/* Header block — eyebrow + title + brand line */}
          <header className="cd__header">
            <p className="cd__eyebrow">
              {campaign.category} · {campaign.neighborhood} ·{" "}
              {campaign.distanceMi.toFixed(1)}mi
            </p>
            <h1 className="cd__title">{campaign.title}</h1>
            <p className="cd__sub">
              <strong>{campaign.merchantName}</strong>
              {campaign.tagline && <> · {campaign.tagline}</>}
            </p>

            <div className="cd__chips">
              <span className="cd-chip cd-chip--success">
                Tier match · open to all
              </span>
              <span className="cd-chip">{campaign.format.replace("-", " ")}</span>
              <span className="cd-chip cd-chip--score">
                {campaign.matchScore}/100 match
              </span>
            </div>
          </header>

          {/* v17 — credibility highlights bar (Airbnb "Self check-in /
              Extra spacious / Superhost" pattern). 3 quick chips
              with icon discs giving creator immediate signal on
              campaign quality. Push-specific: tier match / merchant
              speed / pickup readiness. */}
          <CampaignHighlights campaign={campaign} />

          {/* v15 — Airbnb-style sticky jump bar. Anchors to vertical
              sections below; underline shows active section based on
              IntersectionObserver. Sticky relative to .dh-main scroll
              container provided by the workspace layout. */}
          <nav
            className="cd-jumpbar"
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
                className={`cd-jumpbar__link${activeSection === key ? " is-active" : ""}`}
              >
                {key === "brief" && <FileText size={14} strokeWidth={1.75} />}
                {key === "calendar" && (
                  <CalendarIcon size={14} strokeWidth={1.75} />
                )}
                {key === "location" && <MapPin size={14} strokeWidth={1.75} />}
                {key === "references" && (
                  <ImageIcon size={14} strokeWidth={1.75} />
                )}
                {key === "merchant" && <Store size={14} strokeWidth={1.75} />}
                {key === "rules" && <Shield size={14} strokeWidth={1.75} />}
                <span>
                  {key === "brief" && "Brief"}
                  {key === "calendar" && "Calendar"}
                  {key === "location" && "Location"}
                  {key === "references" && "References"}
                  {key === "merchant" && "Merchant"}
                  {key === "rules" && "Rules"}
                </span>
              </button>
            ))}
          </nav>

          {/* v24 — While-you-wait rail. Visible only in post-apply
              state. Sits between the jumpbar and the Brief section
              so it's the first thing the creator sees after applying,
              encouraging momentum into the next campaign. */}
          {hasApplied && (
            <MoreLikeThisRail
              campaign={campaign}
              excludeIds={new Set([campaign.id])}
            />
          )}

          {/* Stacked sections — all visible, scroll between them */}
          <section
            id="brief"
            ref={(el) => {
              sectionRefs.current.brief = el;
            }}
            className="cd-section"
            aria-label="Brief"
          >
            <BriefTab campaign={campaign} />
          </section>

          <section
            id="calendar"
            ref={(el) => {
              sectionRefs.current.calendar = el;
            }}
            className="cd-section"
            aria-label="Calendar"
          >
            <CampaignCalendar
              windows={campaign.shootWindows ?? []}
              selected={selectedSlot}
              onSelect={setSelectedSlot}
            />
          </section>

          <section
            id="location"
            ref={(el) => {
              sectionRefs.current.location = el;
            }}
            className="cd-section"
            aria-label="Location"
          >
            <CampaignLocation campaign={campaign} />
          </section>

          <section
            id="references"
            ref={(el) => {
              sectionRefs.current.references = el;
            }}
            className="cd-section"
            aria-label="References"
          >
            <ReferencesTab campaign={campaign} />
          </section>

          <section
            id="merchant"
            ref={(el) => {
              sectionRefs.current.merchant = el;
            }}
            className="cd-section"
            aria-label="Meet your merchant"
          >
            <MerchantSection campaign={campaign} />
          </section>

          <section
            id="rules"
            ref={(el) => {
              sectionRefs.current.rules = el;
            }}
            className="cd-section"
            aria-label="Things to know"
          >
            <RulesSection campaign={campaign} />
          </section>

          {/* v25 — post-apply 3-CTA footer moved INTO the left column
              so its width aligns to .cd__main (was full-width spanning
              both cols, which broke the L/R hierarchy). Right rail
              keeps state ownership; this footer = explore branches. */}
          {hasApplied && (
            <PostApplyFooter campaignId={campaign.id} />
          )}
        </div>

        {/* ── Sticky right rail ─────────────────────────── */}
        <aside className="cd__rail" aria-label={hasApplied ? "Application status" : "Pay anatomy and apply"}>
          {hasApplied && application ? (
            /* v24 — post-apply state. Pay/Eligibility/Apply replaced
               with status hero + slot pills + Add-to-calendar /
               Withdraw actions. */
            <PostApplyState campaign={campaign} application={application} />
          ) : (
            <>
              {/* Pay card — black anchor */}
              <div className="cd-pay">
                <p className="cd-pay__eyebrow">Pay anatomy</p>
                <p className="cd-pay__num">
                  ${campaign.cashPay}
                  <span className="cd-pay__unit">/ {campaign.payUnit}</span>
                </p>
                <p className="cd-pay__sub">
                  ~${total} total · ~${hourly ?? "?"}/hr est.
                </p>
                <ul className="cd-pay__rows">
                  <li className="cd-pay__row">
                    <span>Base cash</span>
                    <strong>${total}</strong>
                  </li>
                  <li className="cd-pay__row">
                    <span>Est. hours</span>
                    <strong>{totalHours.toFixed(1)}h</strong>
                  </li>
                  {hourly != null && (
                    <li className="cd-pay__row">
                      <span>Hourly rate</span>
                      <strong>${hourly}/hr</strong>
                    </li>
                  )}
                </ul>
              </div>

              {/* Eligibility card */}
              <div className="cd-elig">
                <p className="cd-elig__eyebrow">Eligibility</p>
                <h3 className="cd-elig__title">
                  {!quota.allowed
                    ? "Quota reached"
                    : eligible
                    ? "You qualify"
                    : "No slots left"}
                </h3>
                <ul className="cd-elig__list">
                  <li className="cd-elig__row">
                    <span className="cd-elig__dot cd-elig__dot--ok" />
                    <span className="cd-elig__lbl">Tier match</span>
                    <span className="cd-elig__val">
                      T{campaign.minimumTier} ≥ T1
                    </span>
                  </li>
                  <li className="cd-elig__row">
                    <span
                      className={`cd-elig__dot cd-elig__dot--${eligible ? "ok" : "block"}`}
                    />
                    <span className="cd-elig__lbl">Slots open</span>
                    <span className="cd-elig__val">
                      {campaign.slotsRemaining} of {campaign.slotsTotal}
                    </span>
                  </li>
                  {campaign.deadlineIso && (
                    <li className="cd-elig__row">
                      <span className="cd-elig__dot cd-elig__dot--warn" />
                      <span className="cd-elig__lbl">Deadline</span>
                      <span className="cd-elig__val">
                        {formatDeadline(campaign.deadlineIso)}
                      </span>
                    </li>
                  )}
                  {/* Phase 2 — tier-based daily quota line */}
                  <li className="cd-elig__row">
                    <span
                      className={`cd-elig__dot cd-elig__dot--${quota.allowed ? "ok" : "block"}`}
                    />
                    <span className="cd-elig__lbl">Today</span>
                    <span className="cd-elig__val">
                      {quota.tier.daily === null
                        ? "Unlimited"
                        : `${(quota.tier.daily ?? 0) - (quota.remainingDaily ?? 0)} of ${quota.tier.daily}`}
                    </span>
                  </li>
                </ul>
                {/* Quota progress bar — visual feedback under the row */}
                {quota.tier.daily !== null && (
                  <div
                    className="cd-elig__quota-bar"
                    role="progressbar"
                    aria-valuenow={(quota.tier.daily ?? 0) - (quota.remainingDaily ?? 0)}
                    aria-valuemin={0}
                    aria-valuemax={quota.tier.daily ?? 0}
                    aria-label={`${(quota.tier.daily ?? 0) - (quota.remainingDaily ?? 0)} of ${quota.tier.daily} daily applications used`}
                  >
                    <span
                      className={`cd-elig__quota-fill${!quota.allowed ? " is-full" : ""}`}
                      style={{
                        width: `${Math.min(100, (((quota.tier.daily ?? 0) - (quota.remainingDaily ?? 0)) / (quota.tier.daily || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                )}
                <p className="cd-elig__quota-foot">
                  <strong>{quota.tier.label}</strong>
                  {" · "}
                  {quota.allowed
                    ? `resets in ${quota.resetsAt}`
                    : `resets in ${quota.resetsAt}`}
                </p>
              </div>

              {/* Selected slot summary (only when calendar slot picked) */}
              {selectedSlot && (
                <div className="cd-slot-pick">
                  <p className="cd-slot-pick__eyebrow">Selected slot</p>
                  <p className="cd-slot-pick__date">
                    {formatLongDate(selectedSlot.date)}
                  </p>
                  <p className="cd-slot-pick__time">
                    <Clock size={11} strokeWidth={2.25} />
                    {selectedSlot.startTime} – {selectedSlot.endTime}
                  </p>
                  <button
                    type="button"
                    className="cd-slot-pick__clear"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* CTA stack — v13: slot required before apply.
                  Phase 2: quota gate also blocks. Button label
                  adapts to which gate is active. */}
              <div className="cd-cta-stack">
                <button
                  type="button"
                  className={`cd-btn cd-btn--primary${!canApply ? " is-disabled" : ""}`}
                  disabled={!canApply}
                  title={!quota.allowed ? quota.reason : undefined}
                  onClick={() => {
                    if (!selectedSlot) {
                      jumpTo("calendar");
                      return;
                    }
                    setApplyOpen(true);
                  }}
                >
                  {!quota.allowed
                    ? "Daily quota reached"
                    : selectedSlot
                    ? "Apply with this slot"
                    : "Pick a slot to apply"}
                </button>
                <button type="button" className="cd-btn cd-btn--ghost">
                  Save for later
                </button>
              </div>

              {!quota.allowed && (
                <p className="cd-fine cd-fine--block">
                  <strong>{quota.tier.label}</strong> · {quota.reason}
                </p>
              )}
              {quota.allowed && !selectedSlot && eligible && (
                <p className="cd-fine cd-fine--hint">
                  Pick a date and time in the <strong>Calendar</strong> section
                  below to unlock Apply.
                </p>
              )}
              {canApply && (
                <p className="cd-fine">
                  FTC disclosure required at submit. Standard #ad + partner tag.
                </p>
              )}
            </>
          )}
        </aside>
      </div>

      {applyOpen && selectedSlot && (
        <ApplyModal
          campaign={campaign}
          selectedSlot={selectedSlot}
          onClose={() => setApplyOpen(false)}
          onEditSlot={() => {
            setApplyOpen(false);
            jumpTo("calendar");
          }}
        />
      )}
    </main>
  );
}

/* ── Brief section ───────────────────────────────────────── */

function BriefTab({ campaign }: { campaign: Campaign }) {
  const mustInclude = campaign.briefMustInclude ?? [];
  const mustAvoid = campaign.briefMustAvoid ?? [];

  return (
    <div className="cd-brief">
      <h2 className="cd-section__title">What the merchant is asking for</h2>
      <p className="cd-brief__body">
        {campaign.briefBody ??
          campaign.tagline ??
          `${campaign.merchantName} is looking for a creator to capture ${campaign.category.toLowerCase()} content that feels native to ${campaign.neighborhood}.`}
      </p>

      {/* v23 — Must-include / Must-avoid as a 2-col rules card.
          Replaces the dense single-paragraph version that buried
          both lists. */}
      {(mustInclude.length > 0 || mustAvoid.length > 0) && (
        <div className="cd-brief-rules">
          {mustInclude.length > 0 && (
            <div className="cd-brief-rules__col">
              <p className="cd-brief-rules__col-eyebrow">
                <CheckCircle2 size={13} strokeWidth={2.25} />
                Must include
              </p>
              <ul className="cd-brief-rules__list">
                {mustInclude.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {mustAvoid.length > 0 && (
            <div className="cd-brief-rules__col cd-brief-rules__col--avoid">
              <p className="cd-brief-rules__col-eyebrow">
                <AlertCircle size={13} strokeWidth={2.25} />
                Must avoid
              </p>
              <ul className="cd-brief-rules__list">
                {mustAvoid.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* v23 — Deliverables as visual cards. Each card has:
          - icon disc per type (Reel/Story/Photo/Visit/etc.)
          - count × pay
          - type name
          - description
          - format chip
          - shot list */}
      <div className="cd-deliv-block">
        <h3 className="cd-section__title cd-section__title--sm">
          Deliverables · {campaign.deliverables.length} item
          {campaign.deliverables.length === 1 ? "" : "s"}
        </h3>
        <ul className="cd-deliv-grid">
          {campaign.deliverables.map((d, i) => (
            <DeliverableCard key={i} deliverable={d} />
          ))}
        </ul>
      </div>

      {campaign.pickupRequired && (
        <p className="cd-pickup-note">
          <strong>Pickup required.</strong> A printed QR card must be picked
          up at the merchant before the shoot. Address in the Location tab.
        </p>
      )}
    </div>
  );
}

/* ── v23 Deliverable card ─────────────────────────────────── */

function DeliverableCard({
  deliverable: d,
}: {
  deliverable: Campaign["deliverables"][number];
}) {
  const meta = deliverableIconMeta(d.type);
  const Icon = meta.icon;
  const totalPay = d.unitPay * d.count;
  const totalHours = (d.estHoursEach ?? 0) * d.count;
  return (
    <li className="cd-deliv-card">
      <div className="cd-deliv-card__head">
        <span
          className="cd-deliv-card__icon"
          style={{ background: meta.tint, color: meta.fg }}
          aria-hidden
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <div className="cd-deliv-card__head-text">
          <p className="cd-deliv-card__eyebrow">
            {d.count}× · ${totalPay} total
          </p>
          <h4 className="cd-deliv-card__type">{d.type}</h4>
        </div>
        <span className="cd-deliv-card__time">
          <Clock size={12} strokeWidth={2.25} />
          ~{totalHours.toFixed(totalHours < 10 ? 1 : 0)}h
        </span>
      </div>

      {d.description && (
        <p className="cd-deliv-card__desc">{d.description}</p>
      )}

      {d.format && (
        <p className="cd-deliv-card__format">
          <Layers size={12} strokeWidth={2.25} />
          {d.format}
        </p>
      )}

      {d.shotList && d.shotList.length > 0 && (
        <ul className="cd-deliv-card__shotlist">
          {d.shotList.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** Icon + tint per deliverable type (matched to enrichment keys). */
function deliverableIconMeta(type: string): {
  icon: LucideIcon;
  tint: string;
  fg: string;
} {
  const t = type.toLowerCase();
  if (t.includes("reel"))
    return { icon: Film, tint: "rgba(193, 18, 31, 0.10)", fg: "#a00f1a" };
  if (t.includes("story"))
    return { icon: ImageIcon, tint: "rgba(0, 133, 255, 0.10)", fg: "#0066cc" };
  if (t.includes("carousel"))
    return { icon: LayoutGrid, tint: "rgba(0, 133, 255, 0.10)", fg: "#0066cc" };
  if (t.includes("tiktok"))
    return { icon: Music, tint: "rgba(20, 19, 15, 0.06)", fg: "#14130f" };
  if (t.includes("post"))
    return { icon: ImageIcon, tint: "rgba(0, 133, 255, 0.10)", fg: "#0066cc" };
  if (t.includes("photo"))
    return { icon: Camera, tint: "rgba(191, 161, 112, 0.16)", fg: "#5c4a26" };
  if (t.includes("review"))
    return { icon: MessageSquare, tint: "rgba(45, 110, 74, 0.12)", fg: "#1f7a39" };
  if (t.includes("ugc"))
    return { icon: Film, tint: "rgba(20, 19, 15, 0.06)", fg: "#14130f" };
  // visit / scan / walk-in / fallback
  return { icon: ScanLine, tint: "rgba(45, 110, 74, 0.12)", fg: "#1f7a39" };
}

/* ── v17 Highlights bar (3 credibility chips) ────────────── */

function CampaignHighlights({ campaign }: { campaign: Campaign }) {
  const merchant = campaign.merchant;
  if (!merchant) return null;
  /* Compute Push-specific credibility chips. The 3 here are the
     ones a creator actually cares about pre-apply: how fast does
     the merchant respond, what's their track record, can a first-
     time creator apply. */
  const fastReply = merchant.avgResponseHours <= 12;
  const veteran = merchant.campaignsHosted >= 15;
  const openToAll = campaign.minimumTier === 1;
  return (
    <div className="cd-highlights" role="group" aria-label="Campaign highlights">
      <div className="cd-highlight">
        <span className="cd-highlight__icon" aria-hidden>
          <Zap size={18} strokeWidth={1.75} />
        </span>
        <div className="cd-highlight__body">
          <p className="cd-highlight__title">
            {fastReply ? "Quick reply" : "Standard reply"}
          </p>
          <p className="cd-highlight__sub">
            Avg ~{merchant.avgResponseHours}h to a decision
          </p>
        </div>
      </div>

      <div className="cd-highlight">
        <span className="cd-highlight__icon" aria-hidden>
          <Award size={18} strokeWidth={1.75} />
        </span>
        <div className="cd-highlight__body">
          <p className="cd-highlight__title">
            {veteran ? "Veteran merchant" : "Verified merchant"}
          </p>
          <p className="cd-highlight__sub">
            {merchant.campaignsHosted} campaigns hosted · ★ {merchant.starRating}
          </p>
        </div>
      </div>

      <div className="cd-highlight">
        <span className="cd-highlight__icon" aria-hidden>
          <CheckCircle2 size={18} strokeWidth={1.75} />
        </span>
        <div className="cd-highlight__body">
          <p className="cd-highlight__title">
            {openToAll ? "Open to first-timers" : `Tier ${campaign.minimumTier}+ only`}
          </p>
          <p className="cd-highlight__sub">
            {merchant.repeatCreatorPct}% creators repeat-book
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── v17 Meet your merchant section ──────────────────────── */

function MerchantSection({ campaign }: { campaign: Campaign }) {
  const merchant = campaign.merchant;
  if (!merchant) return null;
  const initial = campaign.merchantName.charAt(0).toUpperCase();
  return (
    <div className="cd-merchant">
      <h2 className="cd-section__title">Meet your merchant</h2>

      <div className="cd-merchant__row">
        {/* Left: identity card */}
        <div className="cd-merchant__id">
          <span className="cd-merchant__avatar" aria-hidden>
            {initial}
          </span>
          <div className="cd-merchant__id-text">
            <p className="cd-merchant__name">{campaign.merchantName}</p>
            <p className="cd-merchant__joined">
              Joined Push in {merchant.joinedYear}
            </p>
          </div>
        </div>

        {/* Right: stats grid */}
        <div className="cd-merchant__stats">
          <div className="cd-merchant__stat">
            <span className="cd-merchant__stat-num">
              ★ {merchant.starRating}
            </span>
            <span className="cd-merchant__stat-lbl">
              {merchant.reviewCount} reviews
            </span>
          </div>
          <div className="cd-merchant__stat">
            <span className="cd-merchant__stat-num">
              {merchant.campaignsHosted}
            </span>
            <span className="cd-merchant__stat-lbl">campaigns hosted</span>
          </div>
          <div className="cd-merchant__stat">
            <span className="cd-merchant__stat-num">
              {merchant.repeatCreatorPct}%
            </span>
            <span className="cd-merchant__stat-lbl">creators repeat</span>
          </div>
        </div>
      </div>

      <p className="cd-merchant__bio">{merchant.bio}</p>

      <div className="cd-merchant__signals">
        <span className="cd-merchant__signal">
          <Clock size={12} strokeWidth={2.25} />
          Replies within ~{merchant.avgResponseHours}h
        </span>
        <span className="cd-merchant__signal">
          <TrendingUp size={12} strokeWidth={2.25} />
          {merchant.avgResponseHours <= 12 ? "Fast-responder" : "Standard cadence"}
        </span>
      </div>
    </div>
  );
}

/* ── v17 Things to know section ──────────────────────────── */

function RulesSection({ campaign }: { campaign: Campaign }) {
  return (
    <div className="cd-rules">
      <h2 className="cd-section__title">Things to know</h2>

      <div className="cd-rules__grid">
        <div className="cd-rules__col">
          <p className="cd-rules__col-title">
            <CalendarIcon size={14} strokeWidth={1.75} />
            Cancellation
          </p>
          <ul className="cd-rules__list">
            <li>Free reschedule up to 24h before your slot.</li>
            <li>
              Cancel within 24h: counts against your reliability score.
            </li>
            <li>No-show: -15 Push Score + dispute review.</li>
          </ul>
        </div>

        <div className="cd-rules__col">
          <p className="cd-rules__col-title">
            <Shield size={14} strokeWidth={1.75} />
            Payment + verification
          </p>
          <ul className="cd-rules__list">
            <li>
              Payout clears 72h after merchant verifies the QR scan.
            </li>
            <li>
              Stripe Connect instant transfer — no holding period.
            </li>
            <li>
              ${campaign.cashPay} per {campaign.payUnit} · paid even if 0
              customers attributed (T1 Seed minimum-earning guarantee).
            </li>
          </ul>
        </div>

        <div className="cd-rules__col">
          <p className="cd-rules__col-title">
            <AlertCircle size={14} strokeWidth={1.75} />
            Disclosure + content rights
          </p>
          <ul className="cd-rules__list">
            <li>
              FTC: <code>#ad</code> + partner tag required at submit.
            </li>
            <li>
              You retain content rights. Merchant gets a 90-day usage
              license for paid campaigns.
            </li>
            <li>
              Disputed scans: 78% resolve in creator&apos;s favor with
              proof — check your QR scan record before flagging.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── References tab ──────────────────────────────────────── */

function ReferencesTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="cd-refs">
      <h2 className="cd-section__title">Visual direction</h2>
      <p className="cd-refs__sub">
        Reference frames the merchant likes. Use as inspiration, not literal
        recreation.
      </p>
      <div className="cd-refs__grid">
        {campaign.images.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={i} src={src} alt={`Reference ${i + 1}`} className="cd-refs__img" />
        ))}
      </div>
    </div>
  );
}

/* ── v24 Post-apply 3-CTA footer ──────────────────────────
   Three clear next steps so the user doesn't dead-end:
     1. Find more like this  → /creator/discover seeded with this id
     2. Track applications   → /creator/work/applied
     3. Prep for the shoot   → /creator/work/calendar focused on this id
   Layout is full-width below the two columns when in post-apply
   state. Primary red CTA on the left (highest-velocity action),
   ghost CTAs on the right.
*/
function PostApplyFooter({ campaignId }: { campaignId: string }) {
  return (
    <section className="cd-pa-foot" aria-label="Next steps">
      <div className="cd-pa-foot__head">
        <p className="cd-pa-foot__eyebrow">What now</p>
        <h3 className="cd-pa-foot__title">Three ways forward</h3>
      </div>
      <div className="cd-pa-foot__grid">
        <Link
          href={`/creator/discover?seed=${encodeURIComponent(campaignId)}&filter=similar`}
          className="cd-pa-foot__cta cd-pa-foot__cta--primary"
        >
          <span className="cd-pa-foot__cta-icon" aria-hidden>
            <Search size={18} strokeWidth={2} />
          </span>
          <span className="cd-pa-foot__cta-text">
            <span className="cd-pa-foot__cta-title">Find more like this</span>
            <span className="cd-pa-foot__cta-sub">
              Same neighborhood, same vibe — keep momentum
            </span>
          </span>
          <span className="cd-pa-foot__cta-arrow" aria-hidden>
            <ArrowUpRight size={14} strokeWidth={2.25} />
          </span>
        </Link>
        <Link
          href="/creator/work/applied"
          className="cd-pa-foot__cta cd-pa-foot__cta--ghost"
        >
          <span className="cd-pa-foot__cta-icon" aria-hidden>
            <Inbox size={18} strokeWidth={2} />
          </span>
          <span className="cd-pa-foot__cta-text">
            <span className="cd-pa-foot__cta-title">Track applications</span>
            <span className="cd-pa-foot__cta-sub">
              See every status across your pipeline
            </span>
          </span>
          <span className="cd-pa-foot__cta-arrow" aria-hidden>
            <ArrowUpRight size={14} strokeWidth={2.25} />
          </span>
        </Link>
        <Link
          href={`/creator/work/calendar?focus=${encodeURIComponent(campaignId)}`}
          className="cd-pa-foot__cta cd-pa-foot__cta--ghost"
        >
          <span className="cd-pa-foot__cta-icon" aria-hidden>
            <ListChecks size={18} strokeWidth={2} />
          </span>
          <span className="cd-pa-foot__cta-text">
            <span className="cd-pa-foot__cta-title">Prep for the shoot</span>
            <span className="cd-pa-foot__cta-sub">
              Day-before checklist + reminder
            </span>
          </span>
          <span className="cd-pa-foot__cta-arrow" aria-hidden>
            <ArrowUpRight size={14} strokeWidth={2.25} />
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ── Date formatters ─────────────────────────────────────── */

function formatDeadline(iso: string): string {
  const target = new Date(iso);
  const now = new Date("2026-05-09");
  const days = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "expired";
  if (days === 1) return "tomorrow";
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
