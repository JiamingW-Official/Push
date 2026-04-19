"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import "./onboarding.css";

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY = "push-demo-creator-onboarding-progress";
const TOTAL = 7;

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Progress = {
  completed: StepId[];
  skipped: StepId[];
  activeStep: StepId;
  profile: {
    name: string;
    handle: string;
    neighborhood: string;
    bio: string;
  };
  social: { ig: boolean; tiktok: boolean; red: boolean };
  notifs: { matches: boolean; applications: boolean; payments: boolean };
};

const INITIAL: Progress = {
  completed: [],
  skipped: [],
  activeStep: 1,
  profile: { name: "", handle: "", neighborhood: "", bio: "" },
  social: { ig: false, tiktok: false, red: false },
  notifs: { matches: true, applications: true, payments: true },
};

const NYC_NEIGHBORHOODS = [
  "Williamsburg",
  "Bushwick",
  "LES",
  "East Village",
  "SoHo",
  "Astoria",
  "Crown Heights",
  "Harlem",
  "Greenpoint",
  "Bed-Stuy",
  "Park Slope",
  "Hell's Kitchen",
  "Chelsea",
  "Ridgewood",
  "Jackson Heights",
];

const BIO_MAX = 80;

/* ─────────────────────────────────────────────────────────────
   Step metadata
   ───────────────────────────────────────────────────────────── */

const STEPS: {
  id: StepId;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  skippable: boolean;
}[] = [
  {
    id: 1,
    title: "Profile basics",
    shortTitle: "Profile",
    description: "Name, handle, neighborhood, and avatar",
    eyebrow: "YOUR IDENTITY",
    skippable: false,
  },
  {
    id: 2,
    title: "Social connect",
    shortTitle: "Socials",
    description: "Link Instagram, TikTok, or Xiaohongshu",
    eyebrow: "REACH & AUDIENCE",
    skippable: true,
  },
  {
    id: 3,
    title: "Identity verify",
    shortTitle: "Verify",
    description: "Required for paid campaigns",
    eyebrow: "TRUST & SAFETY",
    skippable: true,
  },
  {
    id: 4,
    title: "Payout setup",
    shortTitle: "Payout",
    description: "Connect your bank or debit card",
    eyebrow: "GET PAID",
    skippable: true,
  },
  {
    id: 5,
    title: "First campaign discovery",
    shortTitle: "Explore",
    description: "Explore live campaigns near you",
    eyebrow: "LAUNCH",
    skippable: true,
  },
  {
    id: 6,
    title: "Notification prefs",
    shortTitle: "Alerts",
    description: "Choose what updates you receive",
    eyebrow: "STAY IN THE LOOP",
    skippable: true,
  },
  {
    id: 7,
    title: "Get your invite link",
    shortTitle: "Invite",
    description: "Refer a friend — both get $25",
    eyebrow: "GROW TOGETHER",
    skippable: false,
  },
];

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */

function load(): Progress {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    return { ...INITIAL, ...JSON.parse(raw) };
  } catch {
    return INITIAL;
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

/* ─────────────────────────────────────────────────────────────
   Step content components
   ───────────────────────────────────────────────────────────── */

function ProfileStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { profile } = progress;
  const canProceed =
    profile.name.trim().length > 0 &&
    profile.handle.trim().length > 0 &&
    profile.neighborhood.trim().length > 0;

  const completeness = [
    profile.name.trim().length > 0,
    profile.handle.trim().length > 0,
    profile.neighborhood.trim().length > 0,
    profile.bio.trim().length > 0,
  ].filter(Boolean).length;

  const completenessPercent = Math.round((completeness / 4) * 100);

  return (
    <div className="step-body">
      {/* Avatar upload */}
      <div className="avatar-zone">
        <button
          type="button"
          className="avatar-upload-btn"
          aria-label="Upload profile photo"
        >
          <span className="avatar-upload-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span className="avatar-upload-label">Drop photo</span>
          <span className="avatar-upload-hint">PNG, JPG up to 4MB</span>
        </button>
        <div className="avatar-meta">
          <p className="avatar-meta-title">Profile photo</p>
          <p className="avatar-meta-sub">Helps brands recognize your work</p>
          <div className="completeness-bar-wrap">
            <div className="completeness-bar">
              <div
                className="completeness-bar-fill"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            <span className="completeness-label">
              {completenessPercent}% complete
            </span>
          </div>
        </div>
      </div>

      {/* Name + Handle row */}
      <div className="field-row-2">
        <div className="field">
          <label className="field-label" htmlFor="cr-name">
            Display name
          </label>
          <div className="input-wrap">
            <input
              id="cr-name"
              className="field-input"
              type="text"
              placeholder="How brands see you"
              value={profile.name}
              onChange={(e) =>
                onChange({ profile: { ...profile, name: e.target.value } })
              }
              autoComplete="name"
            />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="cr-handle">
            Handle
          </label>
          <div className="input-wrap input-wrap--prefix">
            <span className="input-prefix">@</span>
            <input
              id="cr-handle"
              className="field-input field-input--prefixed"
              type="text"
              placeholder="yourhandle"
              value={profile.handle.replace(/^@/, "")}
              onChange={(e) =>
                onChange({ profile: { ...profile, handle: e.target.value } })
              }
            />
          </div>
        </div>
      </div>

      {/* Neighborhood */}
      <div className="field">
        <label className="field-label" htmlFor="cr-neighborhood">
          NYC neighborhood
        </label>
        <div className="input-wrap">
          <input
            id="cr-neighborhood"
            className="field-input"
            type="text"
            placeholder="e.g. Williamsburg, LES, Astoria"
            value={profile.neighborhood}
            list="cr-neighborhoods"
            onChange={(e) =>
              onChange({
                profile: { ...profile, neighborhood: e.target.value },
              })
            }
          />
        </div>
        <datalist id="cr-neighborhoods">
          {NYC_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      {/* Bio */}
      <div className="field">
        <label className="field-label" htmlFor="cr-bio">
          Short bio
        </label>
        <div className="textarea-wrap">
          <textarea
            id="cr-bio"
            className="field-textarea"
            placeholder="What makes your content unique?"
            value={profile.bio}
            maxLength={BIO_MAX}
            onChange={(e) =>
              onChange({ profile: { ...profile, bio: e.target.value } })
            }
          />
          <span
            className={`char-count${profile.bio.length >= BIO_MAX * 0.9 ? " char-count--warn" : ""}`}
          >
            {profile.bio.length}/{BIO_MAX}
          </span>
        </div>
      </div>

      <div className="step-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onComplete}
          disabled={!canProceed}
        >
          Save profile
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

function SocialStep({
  progress,
  onChange,
  onComplete,
  onSkip,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const { social } = progress;
  const anyConnected = social.ig || social.tiktok || social.red;
  const [showWhy, setShowWhy] = useState(false);

  const PLATFORMS = [
    {
      key: "ig" as const,
      label: "Instagram",
      handle: "@push_nyc",
      followers: "12.4K avg",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      color: "#E1306C",
    },
    {
      key: "tiktok" as const,
      label: "TikTok",
      handle: "@push_nyc",
      followers: "8.2K avg",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z" />
        </svg>
      ),
      color: "#010101",
    },
    {
      key: "red" as const,
      label: "小红书",
      handle: "@push_nyc",
      followers: "5.1K avg",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.59V13H9v-2h4V8.41L17.59 12 13 16.59z" />
        </svg>
      ),
      color: "#FF2442",
    },
  ];

  function toggle(key: keyof typeof social) {
    onChange({ social: { ...social, [key]: !social[key] } });
  }

  return (
    <div className="step-body">
      <div className="social-platforms">
        {PLATFORMS.map(({ key, label, followers, icon, color }) => (
          <button
            key={key}
            type="button"
            className={`social-tile${social[key] ? " social-tile--connected" : ""}`}
            onClick={() => toggle(key)}
          >
            <span
              className="social-tile-icon"
              style={{ color: social[key] ? color : undefined }}
            >
              {icon}
            </span>
            <div className="social-tile-info">
              <span className="social-tile-name">{label}</span>
              <span className="social-tile-stat">{followers}</span>
            </div>
            <span
              className={`social-tile-status${social[key] ? " social-tile-status--on" : ""}`}
            >
              {social[key] ? (
                <>
                  <span className="status-dot status-dot--green" />
                  Connected
                </>
              ) : (
                "Connect"
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Why we need this */}
      <button
        type="button"
        className="disclosure-toggle"
        onClick={() => setShowWhy(!showWhy)}
        aria-expanded={showWhy}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Why we need this
        <span className="disclosure-chevron">{showWhy ? "−" : "+"}</span>
      </button>
      {showWhy && (
        <div className="disclosure-body">
          <p>
            We use your follower count and engagement data to match you with
            campaigns that fit your reach. We never post on your behalf without
            explicit approval.
          </p>
        </div>
      )}

      <div className="step-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onComplete}
          disabled={!anyConnected}
        >
          Confirm
          <span className="btn-arrow">→</span>
        </button>
        <button type="button" className="btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function IdentityStep({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="step-body">
      <div className="kyc-grid">
        <div className="upload-zone">
          <div className="upload-zone-inner">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="9" cy="10" r="2" />
              <path d="M15 8h2M15 12h2M3 16l5-5 4 4 2-2 4 4" />
            </svg>
            <span className="upload-zone-label">Upload ID</span>
            <span className="upload-zone-hint">
              Passport or Driver's license
            </span>
          </div>
        </div>
        <div className="upload-zone">
          <div className="upload-zone-inner">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="upload-zone-label">Selfie</span>
            <span className="upload-zone-hint">Hold next to your ID</span>
          </div>
        </div>
      </div>

      <div className="trust-badge">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Your data is encrypted and never shared with third parties.
      </div>

      <div className="link-action-card">
        <div className="link-action-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="M15 8h2M15 12h2" />
          </svg>
        </div>
        <div className="link-action-info">
          <p className="link-action-title">Identity verification</p>
          <p className="link-action-sub">
            Required before your first paid campaign · Under 2 min via Stripe
            Identity
          </p>
        </div>
        <Link href="/creator/verify" className="btn-secondary">
          Verify →
        </Link>
      </div>

      <div className="step-actions">
        <button type="button" className="btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function PayoutStep({ onSkip }: { onSkip: () => void }) {
  const [activeTab, setActiveTab] = useState<"bank" | "paypal" | "venmo">(
    "bank",
  );

  return (
    <div className="step-body">
      {/* Earn rate callout */}
      <div className="earn-callout" aria-label="Earning potential">
        <span className="earn-callout-icon" aria-hidden="true">
          $
        </span>
        <div className="earn-callout-text">
          <span className="earn-callout-amount">$15–$85</span>
          <span className="earn-callout-label">
            per verified customer walk-in
          </span>
        </div>
      </div>

      {/* Payout method tabs */}
      <div className="payout-tabs">
        {(["bank", "paypal", "venmo"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`payout-tab${activeTab === tab ? " payout-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "bank" && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="10" width="18" height="11" rx="1" />
                <path d="M3 10l9-7 9 7" />
                <line x1="12" y1="10" x2="12" y2="21" />
                <line x1="7" y1="15" x2="7" y2="21" />
                <line x1="17" y1="15" x2="17" y2="21" />
              </svg>
            )}
            {tab === "paypal" && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.5 6.5C17.5 9.54 15.04 12 12 12H8.5L7 18H4L6.5 6H12C15.04 6 17.5 6.46 17.5 6.5z" />
                <path d="M20 9c0 3.04-2.46 5.5-5.5 5.5H11l-1.5 6H6.5l2.5-12H14C17.04 8.5 20 8.96 20 9z" />
              </svg>
            )}
            {tab === "venmo" && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 9l4 6 4-6" />
              </svg>
            )}
            <span>
              {tab === "bank" ? "Bank" : tab === "paypal" ? "PayPal" : "Venmo"}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="payout-form">
        {activeTab === "bank" && (
          <>
            <div className="field">
              <label className="field-label" htmlFor="routing">
                Routing number
              </label>
              <div className="input-wrap">
                <input
                  id="routing"
                  className="field-input"
                  type="text"
                  placeholder="9 digits"
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="account">
                Account number
              </label>
              <div className="input-wrap">
                <input
                  id="account"
                  className="field-input"
                  type="text"
                  placeholder="10–12 digits"
                />
              </div>
            </div>
          </>
        )}
        {activeTab === "paypal" && (
          <div className="field">
            <label className="field-label" htmlFor="paypal-email">
              PayPal email
            </label>
            <div className="input-wrap">
              <input
                id="paypal-email"
                className="field-input"
                type="email"
                placeholder="you@example.com"
              />
            </div>
          </div>
        )}
        {activeTab === "venmo" && (
          <div className="field">
            <label className="field-label" htmlFor="venmo-handle">
              Venmo handle
            </label>
            <div className="input-wrap input-wrap--prefix">
              <span className="input-prefix">@</span>
              <input
                id="venmo-handle"
                className="field-input field-input--prefixed"
                type="text"
                placeholder="yourhandle"
              />
            </div>
          </div>
        )}
      </div>

      <div className="trust-badge trust-badge--gold">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Payments processed within 48 hours of campaign completion.
      </div>

      <div className="step-actions">
        <Link href="/creator/wallet" className="btn-primary">
          Set up payout
          <span className="btn-arrow">→</span>
        </Link>
        <button type="button" className="btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function DiscoveryStep({ onComplete }: { onComplete: () => void }) {
  const CATEGORIES = [
    { emoji: "☕", name: "Coffee + Cafe", avg: "$32", campaigns: "14 active" },
    { emoji: "🍜", name: "Food + Drink", avg: "$28", campaigns: "22 active" },
    {
      emoji: "👟",
      name: "Retail + Fashion",
      avg: "$45",
      campaigns: "9 active",
    },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="step-body">
      {/* Earn rate callout */}
      <div className="earn-callout" aria-label="Earning potential">
        <span className="earn-callout-icon" aria-hidden="true">
          $
        </span>
        <div className="earn-callout-text">
          <span className="earn-callout-amount">$28–$45</span>
          <span className="earn-callout-label">
            avg payout per walk-in, this category
          </span>
        </div>
      </div>

      <div className="campaign-cards">
        {CATEGORIES.map(({ emoji, name, avg, campaigns }) => (
          <button
            key={name}
            type="button"
            className={`campaign-card${selected === name ? " campaign-card--selected" : ""}`}
            onClick={() => setSelected(name)}
          >
            <span className="campaign-card-ghost">{avg}</span>
            <span className="campaign-card-emoji">{emoji}</span>
            <span className="campaign-card-name">{name}</span>
            <span className="campaign-card-earn">{avg}</span>
            <span className="campaign-card-meta">{campaigns}</span>
          </button>
        ))}
      </div>

      <div className="discovery-callout">
        <p className="discovery-callout-eyebrow">HOW IT WORKS</p>
        <p className="discovery-callout-text">
          Browse live campaigns by neighborhood, category, or payout. Apply in
          one tap — brands review within 24 hours.
        </p>
      </div>

      <div className="step-actions">
        <Link href="/creator/explore" className="btn-primary">
          Explore campaigns
          <span className="btn-arrow">→</span>
        </Link>
        <button type="button" className="btn-ghost" onClick={onComplete}>
          Mark as seen
        </button>
      </div>
    </div>
  );
}

function NotifsStep({
  progress,
  onChange,
  onComplete,
  onSkip,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const { notifs } = progress;

  function toggle(key: keyof typeof notifs) {
    onChange({ notifs: { ...notifs, [key]: !notifs[key] } });
  }

  const items = [
    {
      key: "matches" as const,
      name: "Campaign matches",
      desc: "New campaigns that match your profile",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      key: "applications" as const,
      name: "Application updates",
      desc: "When brands accept or decline",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      key: "payments" as const,
      name: "Payment releases",
      desc: "When your earnings hit your wallet",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="step-body">
      <div className="notif-list">
        {items.map(({ key, name, desc, icon }) => (
          <div key={key} className="notif-row">
            <span className="notif-icon">{icon}</span>
            <div className="notif-info">
              <p className="notif-name">{name}</p>
              <p className="notif-desc">{desc}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifs[key]}
                onChange={() => toggle(key)}
              />
              <span className="toggle-track" />
            </label>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button type="button" className="btn-primary" onClick={onComplete}>
          Save preferences
          <span className="btn-arrow">→</span>
        </button>
        <button type="button" className="btn-ghost" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}

function InviteStep({ onComplete }: { onComplete: () => void }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://push.nyc/invite/YOU25";

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="step-body">
      <div className="invite-hero">
        <span className="invite-hero-eyebrow">Referral bonus</span>
        <h3 className="invite-hero-title">
          Give <em>$25</em>.<br />
          Get <em>$25</em>.
        </h3>
        <div className="invite-link-row">
          <input
            type="text"
            className="invite-link-input"
            value={inviteLink}
            readOnly
            aria-label="Your invite link"
          />
          <button
            type="button"
            className={`invite-copy-btn${copied ? " invite-copy-btn--copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
        <p className="invite-sub">
          Both you and your friend earn $25 after their first completed
          campaign.
        </p>
      </div>

      <div className="step-actions">
        <button type="button" className="btn-primary" onClick={onComplete}>
          Done
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Tier data (used in sidebar + complete screen)
   ───────────────────────────────────────────────────────────── */

const TIERS = [
  {
    key: "clay",
    name: "Clay",
    desc: "Starting out",
    earn: "$15–25/cust",
    color: "rgba(245,242,236,0.2)",
  },
  {
    key: "bronze",
    name: "Bronze",
    desc: "Building momentum",
    earn: "$25–35/cust",
    color: "#c9a96e",
  },
  {
    key: "steel",
    name: "Steel",
    desc: "Consistent closer",
    earn: "$35–50/cust",
    color: "#669bbc",
  },
  {
    key: "gold",
    name: "Gold",
    desc: "Local powerhouse",
    earn: "$50–65/cust",
    color: "#e8b84b",
  },
  {
    key: "ruby",
    name: "Ruby",
    desc: "Top performer",
    earn: "$65–75/cust",
    color: "#c1121f",
  },
  {
    key: "obsidian",
    name: "Obsidian",
    desc: "Elite: retainer+",
    earn: "$75–85+",
    color: "rgba(245,242,236,0.9)",
  },
];

/* ─────────────────────────────────────────────────────────────
   Sidebar Step List
   ───────────────────────────────────────────────────────────── */

function SidebarStepList({
  steps,
  progress,
  expandedStep,
  onStepClick,
}: {
  steps: typeof STEPS;
  progress: Progress;
  expandedStep: StepId | null;
  onStepClick: (id: StepId) => void;
}) {
  return (
    <nav className="sidebar-step-list" aria-label="Onboarding steps">
      {steps.map(({ id, shortTitle }) => {
        const isDone =
          progress.completed.includes(id) || progress.skipped.includes(id);
        const isActive = id === progress.activeStep;
        const isExpanded = expandedStep === id;
        const isLocked =
          !isDone &&
          !isActive &&
          !(
            progress.completed.includes((id - 1) as StepId) ||
            progress.skipped.includes((id - 1) as StepId) ||
            id === 1
          );

        return (
          <button
            key={id}
            type="button"
            className={[
              "sidebar-step",
              isDone ? "sidebar-step--done" : "",
              isActive ? "sidebar-step--active" : "",
              isExpanded ? "sidebar-step--expanded" : "",
              isLocked ? "sidebar-step--locked" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => !isLocked && onStepClick(id)}
            disabled={isLocked}
            aria-current={isExpanded ? "step" : undefined}
          >
            <span className="sidebar-step-marker" aria-hidden="true">
              {isDone ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : isActive ? (
                <span className="sidebar-step-active-dot" />
              ) : (
                <span className="sidebar-step-num">
                  {String(id).padStart(2, "0")}
                </span>
              )}
            </span>
            <span className="sidebar-step-label">{shortTitle}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   Complete screen
   ───────────────────────────────────────────────────────────── */

function CompleteScreen({ onDashboard }: { onDashboard?: () => void }) {
  return (
    <div className="complete-page">
      {/* Confetti particles */}
      <div className="confetti-wrap" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className={`confetti-particle confetti-particle--${i % 6}`}
          />
        ))}
      </div>

      <div className="complete-content">
        <div className="complete-rule" />
        <p className="complete-eyebrow">Creator profile · 7/7 complete</p>
        <h1 className="complete-hero">YOU&apos;RE IN.</h1>

        {/* Tier journey list — shows the path ahead */}
        <div className="complete-tier-list" role="list">
          {TIERS.map((tier, i) => (
            <div
              key={tier.key}
              className={`complete-tier-row complete-tier-row--${tier.key}${i === 0 ? " complete-tier-row--current" : ""}`}
              role="listitem"
            >
              <span
                className="complete-tier-dot"
                style={{ background: tier.color }}
                aria-hidden="true"
              />
              <span className="complete-tier-name">{tier.name}</span>
              <span className="complete-tier-desc">{tier.desc}</span>
              <span className="complete-tier-earn">{tier.earn}</span>
              {i === 0 && (
                <span
                  className="complete-tier-now"
                  aria-label="Your current tier"
                >
                  NOW
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="complete-sub">
          Welcome to the Push creator network.
          <br />
          Your first campaign match is already on its way.
        </p>

        <button type="button" className="complete-cta" onClick={onDashboard}>
          Go to dashboard
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────── */

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>(INITIAL);
  const [expandedStep, setExpandedStep] = useState<StepId | null>(1);
  const [mounted, setMounted] = useState(false);
  const [completingStep, setCompletingStep] = useState<StepId | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = load();
    setProgress(p);
    setExpandedStep(p.activeStep);
    setMounted(true);
  }, []);

  const update = useCallback((partial: Partial<Progress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...partial };
      save(next);
      return next;
    });
  }, []);

  function completeStep(id: StepId) {
    setCompletingStep(id);
    setTimeout(() => {
      const nextStep = (id < TOTAL ? id + 1 : id) as StepId;
      const next: Progress = {
        ...progress,
        completed: [...progress.completed.filter((c) => c !== id), id],
        skipped: progress.skipped.filter((s) => s !== id),
        activeStep: nextStep,
      };
      save(next);
      setProgress(next);
      setCompletingStep(null);
      setExpandedStep(id === TOTAL ? null : nextStep);
    }, 350);
  }

  function skipStep(id: StepId) {
    const nextStep = (id < TOTAL ? id + 1 : id) as StepId;
    const next: Progress = {
      ...progress,
      skipped: [...progress.skipped.filter((s) => s !== id), id],
      activeStep: nextStep,
    };
    save(next);
    setProgress(next);
    setExpandedStep(id === TOTAL ? null : nextStep);
  }

  function toggleExpand(id: StepId) {
    setExpandedStep((prev) => (prev === id ? null : id));
  }

  const completedCount = progress.completed.length + progress.skipped.length;
  const progressPercent = Math.round((completedCount / TOTAL) * 100);
  const isComplete = completedCount >= TOTAL;

  if (!mounted) return null;

  if (isComplete) {
    return (
      <CompleteScreen onDashboard={() => router.push("/creator/dashboard")} />
    );
  }

  const currentStepData = STEPS.find((s) => s.id === expandedStep) ?? STEPS[0];

  return (
    <div className="ob-page">
      {/* Global progress bar */}
      <div
        className="global-progress-bar"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="global-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="ob-layout">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="ob-sidebar">
          {/* Logo */}
          <div className="ob-sidebar-logo">
            <span className="ob-sidebar-logo-dot" aria-hidden="true" />
            <span className="ob-sidebar-logo-text">Push</span>
          </div>

          {/* Current step eyebrow */}
          {expandedStep && (
            <p className="ob-sidebar-current-step">{currentStepData.eyebrow}</p>
          )}

          {/* Vertical step list */}
          <SidebarStepList
            steps={STEPS}
            progress={progress}
            expandedStep={expandedStep}
            onStepClick={(id) => toggleExpand(id)}
          />

          {/* Tier journey */}
          <div className="tier-journey" aria-label="Tier progression">
            <p className="tier-journey-title">Your earning path</p>
            {TIERS.map((tier, i) => (
              <div key={tier.key}>
                <div
                  className={`tier-row tier-row--${tier.key}${i === 0 ? " tier-row--current" : ""}`}
                >
                  <span className="tier-row-dot" aria-hidden="true" />
                  <span className="tier-row-name">{tier.name}</span>
                  <span className="tier-row-earn">{tier.earn}</span>
                </div>
                {i < TIERS.length - 1 && (
                  <div className="tier-connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          {/* Social proof — upgraded */}
          <div className="ob-sidebar-social-proof-upgraded">
            <div className="sp-avatars-row" aria-hidden="true">
              {["#c1121f", "#669bbc", "#c9a96e", "#780000", "#003049"].map(
                (c, i) => (
                  <span
                    key={i}
                    className="sp-avatar"
                    style={{ background: c }}
                  />
                ),
              )}
            </div>
            <p className="sp-big-number">$2.4M</p>
            <p className="sp-desc">
              paid to creators. <strong>847 active</strong> this month.
            </p>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="ob-main" ref={mainRef}>
          {/* Hero section */}
          <section className="ob-hero" aria-label="Creator onboarding intro">
            <p className="ob-hero-eyebrow">Push Creator Network · NYC</p>
            <h1 className="ob-hero-headline">
              Your Score Is
              <span className="ob-hero-headline-accent">Your Salary.</span>
            </h1>
            <p className="ob-hero-subhead">
              Every walk-in you drive builds your{" "}
              <strong>ConversionOracle™</strong> score — and your per-customer
              rate.
            </p>

            {/* Stat strip */}
            <div className="ob-hero-stats" role="list">
              <div className="ob-hero-stat" role="listitem">
                <span className="ob-hero-stat-value">$15–$85</span>
                <span className="ob-hero-stat-label">
                  per customer you bring in
                </span>
              </div>
              <div className="ob-hero-stat" role="listitem">
                <span className="ob-hero-stat-value ob-hero-stat-value--white">
                  847
                </span>
                <span className="ob-hero-stat-label">active creators</span>
              </div>
              <div className="ob-hero-stat" role="listitem">
                <span className="ob-hero-stat-value">$2.4M</span>
                <span className="ob-hero-stat-label">paid out to creators</span>
              </div>
            </div>

            <button
              type="button"
              className="ob-hero-cta"
              onClick={() => {
                document
                  .querySelector(".ob-steps")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Start Earning
              <span className="btn-arrow">→</span>
            </button>
          </section>

          {/* How It Works strip */}
          <section className="ob-how-it-works" aria-label="How it works">
            <p className="ob-how-eyebrow">HOW IT WORKS</p>
            <div className="ob-how-steps">
              <div className="ob-how-step">
                <span className="ob-how-num">01</span>
                <h3 className="ob-how-title">Build your profile</h3>
                <p className="ob-how-desc">
                  Connect your socials and verify your identity — takes under 3
                  minutes.
                </p>
              </div>
              <div className="ob-how-step">
                <span className="ob-how-num">02</span>
                <h3 className="ob-how-title">Drive walk-ins</h3>
                <p className="ob-how-desc">
                  Post content, share your QR link, bring customers through the
                  door.
                </p>
                <span className="ob-how-earn">$15–$85 /visit</span>
              </div>
              <div className="ob-how-step">
                <span className="ob-how-num">03</span>
                <h3 className="ob-how-title">Score climbs, rate rises</h3>
                <p className="ob-how-desc">
                  ConversionOracle™ tracks every verified walk-in. Your tier
                  unlocks higher rates automatically.
                </p>
              </div>
            </div>
          </section>

          {/* Top bar */}
          <div className="ob-topbar">
            <span className="ob-topbar-eyebrow">
              <span className="ob-topbar-dot" aria-hidden="true" />
              {expandedStep
                ? `STEP ${String(expandedStep).padStart(2, "0")} OF ${String(TOTAL).padStart(2, "0")} · ${currentStepData.eyebrow}`
                : "ONBOARDING"}
            </span>
            <div className="ob-topbar-progress">
              <span className="ob-topbar-progress-label">
                {completedCount}/{TOTAL}
              </span>
              <div
                className="ob-dots"
                aria-label={`Step ${progress.activeStep} of ${TOTAL}`}
                role="status"
              >
                {Array.from({ length: TOTAL }, (_, i) => {
                  const n = (i + 1) as StepId;
                  const isDone =
                    progress.completed.includes(n) ||
                    progress.skipped.includes(n);
                  const isAct = n === progress.activeStep;
                  return (
                    <span
                      key={n}
                      className={[
                        "ob-dot",
                        isDone ? "ob-dot--done" : "",
                        isAct ? "ob-dot--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="ob-steps">
            {STEPS.map(({ id, title, description, eyebrow }) => {
              const isDone =
                progress.completed.includes(id) ||
                progress.skipped.includes(id);
              const isSkipped = progress.skipped.includes(id);
              const isActive =
                !isDone &&
                (id === progress.activeStep ||
                  progress.completed.includes((id - 1) as StepId) ||
                  progress.skipped.includes((id - 1) as StepId) ||
                  id === 1);
              const isLocked = !isDone && !isActive;
              const isExpanded = expandedStep === id;
              const isCompleting = completingStep === id;

              // Earn rate shown on payout step header
              const stepEarnRate =
                id === 4 ? "$15–85" : id === 5 ? "$15–85/visit" : null;

              return (
                <div
                  key={id}
                  className={[
                    "step-item",
                    isDone ? "step-item--done" : "",
                    isSkipped ? "step-item--skipped" : "",
                    isActive ? "step-item--active" : "",
                    isLocked ? "step-item--locked" : "",
                    isExpanded ? "step-item--expanded" : "",
                    isCompleting ? "step-item--completing" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <button
                    type="button"
                    className="step-header"
                    onClick={
                      isActive || isDone ? () => toggleExpand(id) : undefined
                    }
                    disabled={isLocked}
                    aria-expanded={isExpanded}
                  >
                    {/* Marker */}
                    <span className="step-marker" aria-hidden="true">
                      {isDone ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="step-marker-num">
                          {String(id).padStart(2, "0")}
                        </span>
                      )}
                    </span>

                    {/* Title */}
                    <span className="step-title-block">
                      <span className="step-eyebrow">{eyebrow}</span>
                      <span className="step-title">{title}</span>
                      <span className="step-desc">{description}</span>
                    </span>

                    {/* Earn rate badge — champagne, shown on active/expanded */}
                    {stepEarnRate && (
                      <span
                        className="step-earn-badge"
                        aria-label={`Earn ${stepEarnRate}`}
                      >
                        {stepEarnRate}
                      </span>
                    )}

                    {/* Status badge */}
                    <span
                      className={`step-badge step-badge--${isDone ? "done" : isSkipped ? "skipped" : isActive ? "active" : "locked"}`}
                    >
                      {isDone && !isSkipped
                        ? "Complete"
                        : isSkipped
                          ? "Skipped"
                          : isActive
                            ? "In progress"
                            : "Locked"}
                    </span>

                    {/* Chevron */}
                    {(isActive || isDone) && (
                      <span className="step-chevron" aria-hidden="true">
                        {isExpanded ? "−" : "+"}
                      </span>
                    )}
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="step-content">
                      {id === 1 && (
                        <ProfileStep
                          progress={progress}
                          onChange={update}
                          onComplete={() => completeStep(1)}
                        />
                      )}
                      {id === 2 && (
                        <SocialStep
                          progress={progress}
                          onChange={update}
                          onComplete={() => completeStep(2)}
                          onSkip={() => skipStep(2)}
                        />
                      )}
                      {id === 3 && <IdentityStep onSkip={() => skipStep(3)} />}
                      {id === 4 && <PayoutStep onSkip={() => skipStep(4)} />}
                      {id === 5 && (
                        <DiscoveryStep onComplete={() => completeStep(5)} />
                      )}
                      {id === 6 && (
                        <NotifsStep
                          progress={progress}
                          onChange={update}
                          onComplete={() => completeStep(6)}
                          onSkip={() => skipStep(6)}
                        />
                      )}
                      {id === 7 && (
                        <InviteStep onComplete={() => completeStep(7)} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
