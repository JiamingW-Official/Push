"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./thread.css";

// Mock campaign data — real data loads from useApplications + campaign detail API
interface ThreadCampaign {
  id: string;
  merchantName: string;
  campaignTitle: string;
  tier: string;
  status: "active" | "submitted" | "verified" | "completed";
  payout: number;
  deadline?: string;
  brief?: string;
  requirements?: string[];
  hashtags?: string[];
  contentGuidelines?: string[];
  milestone: string;
  // Walk-in attribution data
  walkinCount: number;
  walkinEarned: number;
  qrCode?: string;
  // Key dates
  campaignStart?: string;
  submissionDue?: string;
  paymentDate?: string;
}

const MOCK_CAMPAIGN: ThreadCampaign = {
  id: "demo",
  merchantName: "Onyx Coffee Bar",
  campaignTitle: "Morning Ritual — Summer Edition",
  tier: "Explorer",
  status: "active",
  payout: 65,
  deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
  brief:
    "Visit Onyx Coffee Bar during morning hours (7am–11am) and create authentic content showing your experience with their ceremonial-grade matcha or signature espresso drinks.",
  requirements: [
    "Visit during 7am–11am window",
    "Feature at least one drink prominently",
    "Post to Instagram feed (not just Stories)",
    "Include location tag @onyxcoffeebar",
    "Disclose partnership with #ad or #sponsored",
  ],
  hashtags: ["#onyxcoffee", "#morningritual", "#williamsburgcoffee", "#ad"],
  contentGuidelines: [
    "Natural lighting preferred — avoid flash",
    "Show the drink in context (latte art, steam, etc.)",
    "Authentic caption — your real experience, not marketing copy",
    "Tag @onyxcoffeebar in the post, not just the caption",
  ],
  milestone: "accepted",
  walkinCount: 7,
  walkinEarned: 24,
  qrCode: "PUSH-OC-2024-XK9",
  campaignStart: new Date(Date.now() - 2 * 86400000).toISOString(),
  submissionDue: new Date(Date.now() + 3 * 86400000).toISOString(),
  paymentDate: new Date(Date.now() + 10 * 86400000).toISOString(),
};

const MILESTONES = [
  { id: "accepted", label: "Accepted" },
  { id: "scheduled", label: "Scheduled" },
  { id: "visited", label: "Visited" },
  { id: "proof_submitted", label: "Proof" },
  { id: "content_published", label: "Published" },
  { id: "verified", label: "Verified" },
  { id: "settled", label: "Paid" },
];

const SECTIONS = [
  "brief",
  "submission",
  "attribution",
  "earnings",
  "timeline",
  "chat",
] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_LABELS: Record<Section, string> = {
  brief: "Brief",
  submission: "Submit",
  attribution: "QR",
  earnings: "Earnings",
  timeline: "Timeline",
  chat: "Chat",
};

type SubmissionStatus = "draft" | "submitted" | "approved";

function getMilestoneIndex(id: string) {
  return MILESTONES.findIndex((m) => m.id === id);
}

function formatDeadline(iso?: string): string {
  if (!iso) return "No deadline";
  const d = new Date(iso);
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${diff} days left`;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function CampaignThreadPage({ params }: Props) {
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaign] = useState<ThreadCampaign>(MOCK_CAMPAIGN);
  const [activeSection, setActiveSection] = useState<Section>("brief");
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("draft");
  const searchParams = useSearchParams();

  useEffect(() => {
    params.then(({ id }) => setCampaignId(id));
  }, [params]);

  useEffect(() => {
    if (searchParams.get("celebrate") === "1") {
      setShowCelebrate(true);
    }
    const step = searchParams.get("step");
    if (step && SECTIONS.includes(step as Section)) {
      const el = document.getElementById(`section-${step}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  function scrollToSection(s: Section) {
    const el = document.getElementById(`section-${s}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(s);
  }

  function handleSubmit() {
    if (!submitUrl) return;
    setSubmissionStatus("submitted");
  }

  const currentMilestoneIdx = getMilestoneIndex(campaign.milestone);
  const totalEarned =
    campaign.walkinEarned +
    (submissionStatus === "approved" ? campaign.payout : 0);

  return (
    <div className="thread-page">
      {/* ── Thread Header ───────────────────────────────────────── */}
      <div className="thread-header">
        <div className="thread-header__left">
          <div className="thread-header__avatar">
            {campaign.merchantName[0]}
          </div>
          <div>
            <div className="thread-header__merchant">
              {campaign.merchantName}
            </div>
            <div className="thread-header__campaign">
              {campaign.campaignTitle}
            </div>
          </div>
        </div>
        <div className="thread-header__right">
          <span className="thread-header__tier">{campaign.tier}</span>
          <span
            className={`thread-header__status thread-header__status--${campaign.status}`}
          >
            {campaign.status}
          </span>
          <div className="thread-header__earn-wrap">
            <span className="thread-header__earn-label">Earn up to</span>
            <span className="thread-header__payout">${campaign.payout}</span>
          </div>
        </div>
      </div>

      {/* ── Sticky Mini Nav ─────────────────────────────────────── */}
      <nav className="thread-mininav" aria-label="Thread sections">
        {SECTIONS.map((s) => (
          <button
            key={s}
            className={`thread-mininav__item${activeSection === s ? " thread-mininav__item--active" : ""}`}
            onClick={() => scrollToSection(s)}
          >
            {SECTION_LABELS[s]}
          </button>
        ))}
      </nav>

      {/* ── Thread Body ─────────────────────────────────────────── */}
      <div className="thread-body">
        {/* 01 / Brief */}
        <section id="section-brief" className="thread-section">
          <span className="thread-section__label">01 / Brief</span>
          <h2 className="thread-section__title">What to post</h2>
          <p className="thread-section__text">{campaign.brief}</p>

          {/* Requirements */}
          {campaign.requirements && campaign.requirements.length > 0 && (
            <>
              <h3 className="thread-subsection__title">Requirements</h3>
              <ul className="thread-requirements">
                {campaign.requirements.map((r, i) => (
                  <li key={i} className="thread-requirements__item">
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Hashtags */}
          {campaign.hashtags && campaign.hashtags.length > 0 && (
            <div className="thread-hashtags">
              <span className="thread-hashtags__label">Required hashtags</span>
              <div className="thread-hashtags__list">
                {campaign.hashtags.map((tag) => (
                  <span key={tag} className="thread-hashtag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content guidelines */}
          {campaign.contentGuidelines &&
            campaign.contentGuidelines.length > 0 && (
              <div className="thread-guidelines">
                <span className="thread-guidelines__label">
                  Content guidelines
                </span>
                <ul className="thread-guidelines__list">
                  {campaign.contentGuidelines.map((g, i) => (
                    <li key={i} className="thread-guidelines__item">
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className="thread-deadline">
            <span className="thread-deadline__label">Deadline</span>
            <span className="thread-deadline__value">
              {formatDeadline(campaign.deadline)}
            </span>
          </div>
        </section>

        {/* 02 / My Submission */}
        <section id="section-submission" className="thread-section">
          <span className="thread-section__label">02 / Submit</span>
          <h2 className="thread-section__title">My submission</h2>

          {/* Status badge */}
          <div className="submission-status-bar">
            {(["draft", "submitted", "approved"] as SubmissionStatus[]).map(
              (s, i) => (
                <div
                  key={s}
                  className={`submission-step${submissionStatus === s ? " submission-step--active" : i < ["draft", "submitted", "approved"].indexOf(submissionStatus) ? " submission-step--done" : ""}`}
                >
                  <span className="submission-step__dot" />
                  <span className="submission-step__label">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                </div>
              ),
            )}
          </div>

          {submissionStatus === "approved" ? (
            <div className="submission-approved">
              <span className="submission-approved__icon">✓</span>
              <div>
                <div className="submission-approved__title">
                  Submission approved
                </div>
                <div className="submission-approved__sub">
                  Your content passed DisclosureBot verification. Payout is
                  processing.
                </div>
              </div>
            </div>
          ) : (
            <div className="submit-form">
              <label className="submit-form__label" htmlFor="submit-url">
                Content URL (Instagram, TikTok, YouTube…)
              </label>
              <input
                id="submit-url"
                className="submit-form__input"
                type="url"
                placeholder="https://www.instagram.com/p/..."
                value={submitUrl}
                onChange={(e) => setSubmitUrl(e.target.value)}
                disabled={submissionStatus === "submitted"}
              />
              <div className="submit-form__dropzone">
                <span className="submit-form__dropzone-text">
                  Drop screenshots here, or click to upload
                </span>
              </div>
              {submissionStatus === "submitted" ? (
                <div className="submit-form__submitted-note">
                  Submitted — awaiting merchant review
                </div>
              ) : (
                <button
                  className="submit-form__btn"
                  disabled={!submitUrl}
                  onClick={handleSubmit}
                >
                  Submit for verification
                </button>
              )}
            </div>
          )}

          {/* DisclosureBot checklist */}
          <div className="verify-status">
            <div
              className={`verify-status__row${submissionStatus !== "draft" ? " verify-status__row--done" : ""}`}
            >
              <span className="verify-status__check">
                {submissionStatus !== "draft" ? "✓" : "◯"}
              </span>
              <span className="verify-status__item">Content URL submitted</span>
            </div>
            <div
              className={`verify-status__row${submissionStatus === "approved" ? " verify-status__row--done" : ""}`}
            >
              <span className="verify-status__check">
                {submissionStatus === "approved" ? "✓" : "◯"}
              </span>
              <span className="verify-status__item">
                Disclosure check (DisclosureBot™)
              </span>
            </div>
            <div
              className={`verify-status__row${submissionStatus === "approved" ? " verify-status__row--done" : ""}`}
            >
              <span className="verify-status__check">
                {submissionStatus === "approved" ? "✓" : "◯"}
              </span>
              <span className="verify-status__item">
                QR attribution matched
              </span>
            </div>
            <div className="verify-status__row">
              <span className="verify-status__check">◯</span>
              <span className="verify-status__item">Payout approved</span>
            </div>
          </div>
        </section>

        {/* 03 / Attribution */}
        <section id="section-attribution" className="thread-section">
          <span className="thread-section__label">03 / QR Attribution</span>
          <h2 className="thread-section__title">Drive walk-ins</h2>
          <p className="thread-section__text">
            Every customer who scans your unique QR code and walks into{" "}
            {campaign.merchantName} is counted as your attribution. The more
            walk-ins, the more you earn.
          </p>

          {/* QR display */}
          <div className="qr-block">
            <div className="qr-block__code">
              <div className="qr-placeholder" aria-label="QR Code">
                <div className="qr-placeholder__inner">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    {/* Simulated QR corners */}
                    <rect
                      x="4"
                      y="4"
                      width="28"
                      height="28"
                      rx="0"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <rect
                      x="10"
                      y="10"
                      width="16"
                      height="16"
                      fill="currentColor"
                    />
                    <rect
                      x="48"
                      y="4"
                      width="28"
                      height="28"
                      rx="0"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <rect
                      x="54"
                      y="10"
                      width="16"
                      height="16"
                      fill="currentColor"
                    />
                    <rect
                      x="4"
                      y="48"
                      width="28"
                      height="28"
                      rx="0"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <rect
                      x="10"
                      y="54"
                      width="16"
                      height="16"
                      fill="currentColor"
                    />
                    {/* Dots grid */}
                    <rect
                      x="48"
                      y="48"
                      width="5"
                      height="5"
                      fill="currentColor"
                    />
                    <rect
                      x="56"
                      y="48"
                      width="5"
                      height="5"
                      fill="currentColor"
                    />
                    <rect
                      x="64"
                      y="48"
                      width="5"
                      height="5"
                      fill="currentColor"
                    />
                    <rect
                      x="48"
                      y="56"
                      width="5"
                      height="5"
                      fill="currentColor"
                    />
                    <rect
                      x="64"
                      y="56"
                      width="5"
                      height="5"
                      fill="currentColor"
                    />
                    <rect
                      x="56"
                      y="64"
                      width="5"
                      height="5"
                      fill="currentColor"
                    />
                    <rect
                      x="48"
                      y="64"
                      width="5"
                      height="5"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              <div className="qr-block__code-label">{campaign.qrCode}</div>
            </div>
            <div className="qr-block__info">
              <div className="qr-how">
                <div className="qr-how__title">How it works</div>
                <ol className="qr-how__list">
                  <li>Share your QR code in your post caption or Stories</li>
                  <li>
                    Followers scan → get a discount at {campaign.merchantName}
                  </li>
                  <li>
                    Each verified walk-in earns you a bonus on top of base pay
                  </li>
                  <li>
                    ConversionOracle™ matches scans to real in-store visits
                  </li>
                </ol>
              </div>
              <button className="qr-block__download">Download QR PNG</button>
            </div>
          </div>
        </section>

        {/* 04 / Earnings tracker */}
        <section id="section-earnings" className="thread-section">
          <span className="thread-section__label">04 / Earnings</span>
          <h2 className="thread-section__title">Your payout</h2>

          {/* Big earn-so-far number */}
          <div className="earnings-hero">
            <div className="earnings-hero__label">Earned so far</div>
            <div className="earnings-hero__amount">${totalEarned}</div>
            <div className="earnings-hero__sub">
              from {campaign.walkinCount} walk-ins attributed to you
            </div>
          </div>

          <div className="thread-earnings">
            <div className="thread-earnings__row">
              <div>
                <span className="thread-earnings__label">Walk-in bonus</span>
                <div className="thread-earnings__meta">
                  {campaign.walkinCount} verified walk-ins
                </div>
              </div>
              <span className="thread-earnings__amount">
                ${campaign.walkinEarned}
              </span>
            </div>
            <div className="thread-earnings__row">
              <div>
                <span className="thread-earnings__label">Base payout</span>
                <div className="thread-earnings__meta">Unlocks on approval</div>
              </div>
              <span className="thread-earnings__amount">
                ${submissionStatus === "approved" ? campaign.payout : "—"}
              </span>
            </div>
            <div className="thread-earnings__row thread-earnings__row--total">
              <span className="thread-earnings__label">Potential total</span>
              <span className="thread-earnings__amount thread-earnings__amount--total">
                ${campaign.walkinEarned + campaign.payout}
              </span>
            </div>
          </div>
        </section>

        {/* 05 / Timeline */}
        <section id="section-timeline" className="thread-section">
          <span className="thread-section__label">05 / Timeline</span>
          <h2 className="thread-section__title">Key dates</h2>

          {/* Key dates row */}
          <div className="thread-keydates">
            <div className="keydate-item">
              <span className="keydate-item__label">Campaign start</span>
              <span className="keydate-item__value">
                {formatDate(campaign.campaignStart)}
              </span>
            </div>
            <div className="keydate-item keydate-item--accent">
              <span className="keydate-item__label">Submission due</span>
              <span className="keydate-item__value">
                {formatDate(campaign.submissionDue)}
                <span className="keydate-item__countdown">
                  {formatDeadline(campaign.submissionDue)}
                </span>
              </span>
            </div>
            <div className="keydate-item">
              <span className="keydate-item__label">Payment date</span>
              <span className="keydate-item__value">
                {formatDate(campaign.paymentDate)}
              </span>
            </div>
          </div>

          {/* Milestone rail */}
          <div className="milestone-rail">
            {MILESTONES.map((m, idx) => {
              const state =
                idx < currentMilestoneIdx
                  ? "done"
                  : idx === currentMilestoneIdx
                    ? "active"
                    : "upcoming";
              return (
                <div
                  key={m.id}
                  className={`milestone-node milestone-node--${state}`}
                >
                  <div className="milestone-node__dot" />
                  <span className="milestone-node__label">{m.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 06 / Chat */}
        <section id="section-chat" className="thread-section">
          <span className="thread-section__label">06 / Chat</span>
          <h2 className="thread-section__title">
            Message {campaign.merchantName}
          </h2>

          {/* Quick CTA to inbox */}
          <Link
            href={`/creator/messages?merchant=${encodeURIComponent(campaign.merchantName)}&campaign=${campaignId ?? campaign.id}`}
            className="thread-inbox-link"
          >
            <span className="thread-inbox-link__icon">✉</span>
            <span>Open inbox thread with {campaign.merchantName}</span>
            <span className="thread-inbox-link__arrow">→</span>
          </Link>

          <div className="thread-chat">
            <div className="thread-chat__messages">
              <div className="thread-chat__message thread-chat__message--merchant">
                <span className="thread-chat__sender">
                  {campaign.merchantName}
                </span>
                <p className="thread-chat__text">
                  Hey! Looking forward to having you visit. Morning light is
                  best around 8–9am — feel free to grab a window seat.
                </p>
                <span className="thread-chat__time">2 days ago</span>
              </div>
            </div>
            <div className="thread-chat__input-row">
              <input
                className="thread-chat__input"
                type="text"
                placeholder="Message merchant..."
              />
              <button className="thread-chat__send">Send</button>
            </div>
            <p className="thread-chat__hint">
              <button className="thread-chat__suggest">Suggest reply</button>
            </p>
          </div>
        </section>
      </div>

      {/* ── Completion Overlay ──────────────────────────────────── */}
      {showCelebrate && (
        <div
          className="thread-celebrate"
          role="dialog"
          aria-label="Campaign completed"
        >
          <div className="thread-celebrate__panel">
            <h2 className="thread-celebrate__title">Campaign complete.</h2>
            <p className="thread-celebrate__body">
              ${campaign.payout} is on its way to your account.
            </p>
            <button
              className="thread-celebrate__close"
              onClick={() => setShowCelebrate(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
