"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { merchantMock } from "@/lib/data/api-client";
import {
  MOCK_APPLICATIONS,
  type MockApplication,
  type CreatorTier,
} from "@/lib/data/mock-applications";
import "../applicants.css";

/* ── Shared display helpers ─────────────────────────────── */

const TIER_DISPLAY: Record<CreatorTier, string> = {
  seed: "Clay",
  explorer: "Bronze",
  operator: "Steel",
  proven: "Gold",
  closer: "Ruby",
  partner: "Obsidian",
};

const TIER_FULL: Record<CreatorTier, string> = {
  seed: "Clay · Seed",
  explorer: "Bronze · Explorer",
  operator: "Steel · Operator",
  proven: "Gold · Proven",
  closer: "Ruby · Closer",
  partner: "Obsidian · Partner",
};

function subScore(seed: string, dimension: string): number {
  let h = 0;
  const s = `${seed}::${dimension}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return 55 + (Math.abs(h) % 41);
}

function relativeDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ── Mock past-campaign + disclosure data generators ────── */

type PastCampaign = {
  id: string;
  name: string;
  merchant: string;
  date: string;
  verifiedCustomers: number;
  payout: number;
  conversionRate: number;
};

function makePastCampaigns(app: MockApplication): PastCampaign[] {
  const completed = Math.max(0, app.creator.campaignsCompleted);
  const last5 = Math.min(5, completed);
  const merchants = [
    "Blank Street Coffee",
    "Partners Coffee",
    "Devoción",
    "Brooklyn Roasting",
    "Sey Coffee",
  ];
  const campaignNames = [
    "Morning Rush Reel",
    "Cold Brew Drop",
    "Latte Art Challenge",
    "Barista Behind the Bar",
    "Holiday Blend Launch",
  ];
  return Array.from({ length: last5 }, (_, i) => ({
    id: `past-${i}`,
    name: campaignNames[i % campaignNames.length],
    merchant: merchants[i % merchants.length],
    date: new Date(Date.now() - (i * 30 + 12) * 86400000).toLocaleDateString(
      "en-US",
      { month: "short", year: "numeric" },
    ),
    verifiedCustomers: Math.max(
      3,
      Math.round(
        app.creator.conversionRate * 250 * (1 - i * 0.08) +
          subScore(app.creator.id, `pc${i}`) / 20,
      ),
    ),
    payout: Math.round(
      app.creator.conversionRate * 800 * (1 - i * 0.05) +
        subScore(app.creator.id, `pp${i}`),
    ),
    conversionRate: Math.min(
      0.2,
      app.creator.conversionRate * (1 - i * 0.04) + i * 0.001,
    ),
  }));
}

type Disclosure = {
  id: string;
  platform: string;
  campaign: string;
  status: "passed" | "passed" | "passed";
  date: string;
  note: string;
};

function makeDisclosures(app: MockApplication): Disclosure[] {
  return [
    {
      id: "d1",
      platform: "Instagram Reel",
      campaign: app.campaignName,
      status: "passed",
      date: relativeDate(app.appliedAt),
      note: "DisclosureBot auto-inserted #ad before publish. FTC-compliant caption confirmed.",
    },
    {
      id: "d2",
      platform: "TikTok Short",
      campaign: "Cold Brew Drop · Partners Coffee",
      status: "passed",
      date: new Date(Date.now() - 45 * 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      note: "Paid-partnership label verified. Creator accepted DisclosureBot suggestion within 12 min.",
    },
    {
      id: "d3",
      platform: "Instagram Story",
      campaign: "Morning Rush Reel · Devoción",
      status: "passed",
      date: new Date(Date.now() - 78 * 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      note: "Disclosure copy drafted and approved. Zero manual revisions required.",
    },
  ];
}

type Decision = {
  id: string;
  at: string;
  actor: string;
  action: string;
  body: string;
  primary?: boolean;
};

function makeDecisions(app: MockApplication): Decision[] {
  const now = Date.now();
  const base: Decision[] = [
    {
      id: "dc1",
      at: relativeDate(app.appliedAt),
      actor: "Applicant",
      action: "Applied",
      body: `${app.creator.name} applied to "${app.campaignName}" with ConversionOracle™ match ${app.matchScore}.`,
    },
    {
      id: "dc2",
      at: new Date(
        new Date(app.appliedAt).getTime() + 3 * 3600_000,
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      actor: "ConversionOracle™",
      action: "Scored",
      body: `Predicted walk-ins = ${Math.round(app.matchScore * 0.6)} over 14-day window, based on Williamsburg Coffee+ beachhead baseline.`,
    },
    {
      id: "dc3",
      at: new Date(
        new Date(app.appliedAt).getTime() + 5 * 3600_000,
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      actor: "DisclosureBot",
      action: "Compliance pre-check",
      body: "FTC disclosure template queued. Creator has 3 prior clean disclosures on file.",
    },
  ];

  if (app.status === "accepted") {
    base.push({
      id: "dc4",
      at: new Date(now - 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      actor: "Merchant",
      action: "Approved",
      body: "Accepted into campaign. Creator notified via in-app + email.",
      primary: true,
    });
  } else if (app.status === "declined") {
    base.push({
      id: "dc4",
      at: new Date(now - 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      actor: "Merchant",
      action: "Rejected",
      body: "Application declined. Creator may re-apply to future campaigns.",
      primary: true,
    });
  } else if (app.status === "shortlisted") {
    base.push({
      id: "dc4",
      at: new Date(now - 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      actor: "Merchant",
      action: "Waitlisted",
      body: "Moved to waitlist. Will auto-promote if primary roster drops below capacity.",
      primary: true,
    });
  }

  return base;
}

/* ── Page ────────────────────────────────────────────────── */

export default function ApplicantDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const app = useMemo<MockApplication | undefined>(
    () => MOCK_APPLICATIONS.find((a) => a.id === id),
    [id],
  );

  if (!app) {
    return (
      <div className="ap-page">
        <a href="/merchant/applicants" className="ap-page__back">
          ← Back to Applicants
        </a>
        <div className="ap-empty" style={{ paddingTop: 120 }}>
          <div className="ap-empty__title">Applicant not found.</div>
          <div className="ap-empty__sub">
            The application id <code>{id}</code> doesn&apos;t exist. It may have
            been archived.
          </div>
        </div>
      </div>
    );
  }

  const tier = app.creator.tier;
  const pastCampaigns = makePastCampaigns(app);
  const disclosures = makeDisclosures(app);
  const decisions = makeDecisions(app);

  // Generate a larger portfolio (8 items) by cycling sample URLs
  const portfolio = Array.from(
    { length: 8 },
    (_, i) => app.sampleUrls[i % app.sampleUrls.length],
  );

  const subs = {
    consistency: subScore(app.creator.id, "consistency"),
    match: app.matchScore,
    reach: Math.min(
      95,
      Math.round(55 + Math.log10(app.creator.followers + 10) * 9),
    ),
    authenticity: subScore(app.creator.id, "authenticity"),
  };

  const handleDecide = (decision: "accept" | "decline" | "shortlist") => {
    if (decision === "shortlist") {
      merchantMock.batchDecide([app.id], "shortlist");
    } else {
      merchantMock.decideApplication(app.id, decision);
    }
    // Simple refresh via location; static demo.
    window.location.reload();
  };

  return (
    <div className="ap-page">
      <a href="/merchant/applicants" className="ap-page__back">
        ← Back to Applicants
      </a>

      {/* Tier header band */}
      <span className={`tier-header--${tier}`} aria-hidden />

      {/* Hero */}
      <div className="ap-page__hero">
        <div className={`ap-avatar-wrap ap-avatar-wrap--lg tier--${tier}`}>
          <img
            src={app.creator.avatar}
            alt={app.creator.name}
            className="ap-avatar ap-avatar--lg"
          />
        </div>
        <div className="ap-page__hero-ident">
          <div className="ap-page__hero-handle">{app.creator.handle}</div>
          <h1>{app.creator.name}</h1>
          <div className="ap-page__hero-meta">
            <span className={`tier-badge tier-badge--${tier}`}>
              {TIER_FULL[tier]}
            </span>
            <span className="ap-detail__applied">
              Applied {relativeDate(app.appliedAt)}
            </span>
            <span
              className={`ap-status ap-status--${app.status}`}
              style={{ fontSize: 10 }}
            >
              {app.status}
            </span>
          </div>
        </div>
        <div className="ap-page__hero-actions">
          <button
            className="ap-detail-btn ap-detail-btn--accept"
            onClick={() => handleDecide("accept")}
            disabled={app.status === "accepted"}
          >
            Approve
          </button>
          <button
            className="ap-detail-btn ap-detail-btn--waitlist"
            onClick={() => handleDecide("shortlist")}
            disabled={app.status === "shortlisted"}
          >
            Waitlist
          </button>
          <button
            className="ap-detail-btn ap-detail-btn--reject"
            onClick={() => handleDecide("decline")}
            disabled={app.status === "declined"}
          >
            Reject
          </button>
          <a
            href="/merchant/messages"
            className="ap-detail-btn ap-detail-btn--message"
          >
            Message
          </a>
        </div>
      </div>

      {/* Top stats — ConversionOracle hero */}
      <div className="ap-page__stats">
        <div className="ap-page__stat">
          <div className="ap-page__stat-value ap-page__stat-value--oracle">
            {app.matchScore}
          </div>
          <div className="ap-page__stat-label">ConversionOracle™ match</div>
        </div>
        <div className="ap-page__stat">
          <div className="ap-page__stat-value">
            {app.creator.campaignsCompleted}
          </div>
          <div className="ap-page__stat-label">Campaigns verified</div>
        </div>
        <div className="ap-page__stat">
          <div className="ap-page__stat-value">
            {(app.creator.conversionRate * 100).toFixed(1)}%
          </div>
          <div className="ap-page__stat-label">Avg. conversion</div>
        </div>
        <div className="ap-page__stat">
          <div className="ap-page__stat-value">
            {app.creator.followers >= 1000
              ? `${(app.creator.followers / 1000).toFixed(1)}K`
              : app.creator.followers}
          </div>
          <div className="ap-page__stat-label">Followers</div>
        </div>
      </div>

      {/* Bio + notes */}
      <section className="ap-page__section">
        <h2 className="ap-page__h2">About · cover note</h2>
        <p
          style={{
            color: "var(--graphite)",
            lineHeight: 1.65,
            marginBottom: 12,
            fontSize: 14,
          }}
        >
          {app.creator.bio}
        </p>
        <blockquote className="ap-detail__notes">
          &ldquo;{app.coverLetter}&rdquo;
        </blockquote>
      </section>

      {/* Sub-score breakdown */}
      <section className="ap-page__section">
        <h2 className="ap-page__h2">Creator score breakdown</h2>
        <div className="ap-detail__subs">
          {(
            [
              ["Consistency", subs.consistency],
              ["Match", subs.match],
              ["Reach", subs.reach],
              ["Authenticity", subs.authenticity],
            ] as [string, number][]
          ).map(([label, value]) => (
            <div key={label} className="ap-sub">
              <div className="ap-sub__head">
                <span className="ap-sub__label">{label}</span>
                <span className="ap-sub__value">{value}</span>
              </div>
              <div className="ap-sub__track">
                <span
                  className={`tier-progress--${tier}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full portfolio grid */}
      <section className="ap-page__section">
        <h2 className="ap-page__h2">Full portfolio</h2>
        <div className="ap-page__portfolio">
          {portfolio.map((url, i) => (
            <div key={i} className="ap-page__portfolio-item">
              <img src={url} alt={`Portfolio ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Past campaign history table */}
      <section className="ap-page__section">
        <h2 className="ap-page__h2">
          Past campaign history ({pastCampaigns.length})
        </h2>
        {pastCampaigns.length === 0 ? (
          <div
            style={{
              padding: 24,
              border: "1px solid var(--line)",
              background: "var(--surface-elevated)",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            No completed campaigns yet — this creator is new to Push.
          </div>
        ) : (
          <table className="ap-page__table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Merchant</th>
                <th>Date</th>
                <th>Verified</th>
                <th>Conv %</th>
                <th>Payout</th>
              </tr>
            </thead>
            <tbody>
              {pastCampaigns.map((pc) => (
                <tr key={pc.id}>
                  <td>{pc.name}</td>
                  <td>{pc.merchant}</td>
                  <td>{pc.date}</td>
                  <td>
                    <strong>{pc.verifiedCustomers}</strong>
                  </td>
                  <td>{(pc.conversionRate * 100).toFixed(1)}%</td>
                  <td>${pc.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* DisclosureBot compliance history */}
      <section className="ap-page__section">
        <h2 className="ap-page__h2">
          DisclosureBot compliance · last 3 disclosures
        </h2>
        <div className="ap-page__disclosures">
          {disclosures.map((d) => (
            <div key={d.id} className="ap-page__disclosure">
              <svg
                className="ap-page__disclosure-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <div className="ap-page__disclosure-title">
                  {d.platform} · {d.campaign}
                </div>
                <div className="ap-page__disclosure-meta">
                  {d.date} — {d.note}
                </div>
              </div>
              <span className="ap-page__disclosure-status">{d.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Decision history timeline */}
      <section className="ap-page__section">
        <h2 className="ap-page__h2">Decision history</h2>
        <ul className="ap-page__timeline">
          {decisions.map((d) => (
            <li key={d.id} className="ap-page__tl-item">
              <span
                className={`ap-page__tl-dot${d.primary ? " ap-page__tl-dot--primary" : ""}`}
                aria-hidden
              />
              <div className="ap-page__tl-time">
                {d.at} · {d.actor}
              </div>
              <div className="ap-page__tl-title">{d.action}</div>
              <div className="ap-page__tl-body">{d.body}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
