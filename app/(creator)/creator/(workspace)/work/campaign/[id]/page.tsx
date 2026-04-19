"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  milestone: string;
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
  milestone: "accepted",
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
  "timeline",
  "chat",
  "submit",
  "verify",
  "earnings",
] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_LABELS: Record<Section, string> = {
  brief: "Brief",
  timeline: "Timeline",
  chat: "Chat",
  submit: "Submit",
  verify: "Verify",
  earnings: "Earnings",
};

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

interface Props {
  params: Promise<{ id: string }>;
}

export default function CampaignThreadPage({ params }: Props) {
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaign] = useState<ThreadCampaign>(MOCK_CAMPAIGN);
  const [activeSection, setActiveSection] = useState<Section>("brief");
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
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

  const currentMilestoneIdx = getMilestoneIndex(campaign.milestone);

  return (
    <div className="thread-page">
      {/* Thread Header */}
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
          <span className="thread-header__status">{campaign.status}</span>
          <span className="thread-header__payout">${campaign.payout}</span>
        </div>
      </div>

      {/* Sticky Mini Nav */}
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

      {/* Thread Body */}
      <div className="thread-body">
        {/* Brief */}
        <section id="section-brief" className="thread-section">
          <span className="thread-section__label">01 / Brief</span>
          <h2 className="thread-section__title">What to do</h2>
          <p className="thread-section__text">{campaign.brief}</p>
          {campaign.requirements && campaign.requirements.length > 0 && (
            <ul className="thread-requirements">
              {campaign.requirements.map((r, i) => (
                <li key={i} className="thread-requirements__item">
                  {r}
                </li>
              ))}
            </ul>
          )}
          <div className="thread-deadline">
            <span className="thread-deadline__label">Deadline</span>
            <span className="thread-deadline__value">
              {formatDeadline(campaign.deadline)}
            </span>
          </div>
        </section>

        {/* Timeline */}
        <section id="section-timeline" className="thread-section">
          <span className="thread-section__label">02 / Timeline</span>
          <h2 className="thread-section__title">Milestones</h2>
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

        {/* Chat */}
        <section id="section-chat" className="thread-section">
          <span className="thread-section__label">03 / Chat</span>
          <h2 className="thread-section__title">Messages</h2>
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

        {/* Submit */}
        <section id="section-submit" className="thread-section">
          <span className="thread-section__label">04 / Submit</span>
          <h2 className="thread-section__title">Submit proof</h2>
          <div className="submit-form">
            <label className="submit-form__label" htmlFor="submit-url">
              Content URL
            </label>
            <input
              id="submit-url"
              className="submit-form__input"
              type="url"
              placeholder="https://www.instagram.com/p/..."
              value={submitUrl}
              onChange={(e) => setSubmitUrl(e.target.value)}
            />
            <div className="submit-form__dropzone">
              <span className="submit-form__dropzone-text">
                Drop screenshots here, or click to upload
              </span>
            </div>
            <button className="submit-form__btn" disabled={!submitUrl}>
              Submit for verification
            </button>
          </div>
        </section>

        {/* Verify */}
        <section id="section-verify" className="thread-section">
          <span className="thread-section__label">05 / Verify</span>
          <h2 className="thread-section__title">Verification status</h2>
          <div className="verify-status">
            <div className="verify-status__row">
              <span className="verify-status__check">◯</span>
              <span className="verify-status__item">Content URL submitted</span>
            </div>
            <div className="verify-status__row">
              <span className="verify-status__check">◯</span>
              <span className="verify-status__item">
                Disclosure check (DisclosureBot)
              </span>
            </div>
            <div className="verify-status__row">
              <span className="verify-status__check">◯</span>
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

        {/* Earnings */}
        <section id="section-earnings" className="thread-section">
          <span className="thread-section__label">06 / Earnings</span>
          <h2 className="thread-section__title">Your payout</h2>
          <div className="thread-earnings">
            <div className="thread-earnings__row">
              <span className="thread-earnings__label">Base payout</span>
              <span className="thread-earnings__amount">
                ${campaign.payout}
              </span>
            </div>
            <div className="thread-earnings__row thread-earnings__row--total">
              <span className="thread-earnings__label">Total</span>
              <span className="thread-earnings__amount thread-earnings__amount--total">
                ${campaign.payout}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Completion Overlay */}
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
