"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ChecklistItem } from "@/components/onboarding/ChecklistItem";
import type { ChecklistItemStatus } from "@/components/onboarding/ChecklistItem";

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
    // ignore
  }
}

function stepStatus(id: StepId, p: Progress): ChecklistItemStatus {
  if (p.completed.includes(id)) return "done";
  if (p.skipped.includes(id)) return "skipped";
  if (id === p.activeStep) return "active";
  // unlock next step only after previous is done/skipped
  const prev = (id - 1) as StepId;
  if (id === 1) return "active";
  if (p.completed.includes(prev) || p.skipped.includes(prev)) return "active";
  return "locked";
}

/* ─────────────────────────────────────────────────────────────
   Shared input styles
   ───────────────────────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 16,
  /* 8px-grid: 12px vertical / 16px horizontal */
  padding: "12px 16px",
  border: "1px solid var(--ink-4)",
  borderRadius: 8,
  background: "var(--surface)",
  width: "100%",
  boxSizing: "border-box",
  color: "var(--ink)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  marginBottom: 8,
};

/* ─────────────────────────────────────────────────────────────
   Step action button row
   ───────────────────────────────────────────────────────────── */

function StepActions({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 24,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
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

  return (
    <div>
      {/* Avatar upload row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          padding: "16px",
          background: "var(--surface)",
          borderRadius: 10,
          border: "1px solid var(--hairline)",
        }}
      >
        <button
          type="button"
          aria-label="Upload profile photo"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "2px dashed var(--hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            fontSize: 20,
          }}
        >
          📷
        </button>
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            Add a profile photo
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
            }}
          >
            Helps brands recognize you
          </p>
        </div>
      </div>

      {/* Name + Handle row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <label htmlFor="cr-name" style={labelStyle}>
            Display name
          </label>
          <input
            id="cr-name"
            type="text"
            placeholder="How brands see you"
            value={profile.name}
            onChange={(e) =>
              onChange({ profile: { ...profile, name: e.target.value } })
            }
            autoComplete="name"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="cr-handle" style={labelStyle}>
            Handle
          </label>
          <input
            id="cr-handle"
            type="text"
            placeholder="@yourhandle"
            value={profile.handle}
            onChange={(e) =>
              onChange({ profile: { ...profile, handle: e.target.value } })
            }
            style={inputStyle}
          />
        </div>
      </div>

      {/* Neighborhood */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="cr-neighborhood" style={labelStyle}>
          NYC neighborhood
        </label>
        <input
          id="cr-neighborhood"
          type="text"
          placeholder="e.g. Williamsburg, LES, Astoria"
          value={profile.neighborhood}
          list="cr-neighborhoods"
          onChange={(e) =>
            onChange({ profile: { ...profile, neighborhood: e.target.value } })
          }
          style={inputStyle}
        />
        <datalist id="cr-neighborhoods">
          {NYC_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      {/* Bio */}
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="cr-bio" style={labelStyle}>
          Short bio
        </label>
        <div style={{ position: "relative" }}>
          <textarea
            id="cr-bio"
            placeholder="What makes your content unique?"
            value={profile.bio}
            maxLength={BIO_MAX}
            onChange={(e) =>
              onChange({ profile: { ...profile, bio: e.target.value } })
            }
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: 80,
              paddingBottom: 28,
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 12,
              bottom: 10,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: profile.bio.length >= BIO_MAX ? "#d97706" : "var(--ink-4)",
            }}
          >
            {profile.bio.length}/{BIO_MAX}
          </span>
        </div>
      </div>

      <StepActions>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
          disabled={!canProceed}
          style={{ opacity: canProceed ? 1 : 0.5 }}
        >
          Save profile →
        </button>
      </StepActions>
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

  function toggle(key: keyof typeof social) {
    onChange({ social: { ...social, [key]: !social[key] } });
  }

  return (
    <div>
      <div className="ob2-social-grid">
        {(
          [
            { key: "ig", label: "Instagram", icon: "📸" },
            { key: "tiktok", label: "TikTok", icon: "🎵" },
            { key: "red", label: "Xiaohongshu", icon: "📕" },
          ] as const
        ).map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={`ob2-social-btn${social[key] ? " ob2-social-btn--connected" : ""}`}
            aria-pressed={social[key]}
          >
            {/* 40×40 icon tile — v11 icon system */}
            <span className="ob2-social-icon-tile" aria-hidden="true">
              <span className="ob2-social-icon">{icon}</span>
            </span>
            <span className="ob2-social-label">{label}</span>
            {social[key] && (
              <span className="ob2-social-status">Connected</span>
            )}
          </button>
        ))}
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          marginBottom: 0,
        }}
      >
        OAuth stub — connect at least one account to match with campaigns.
      </p>

      <StepActions>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
          disabled={!anyConnected}
          style={{ opacity: anyConnected ? 1 : 0.5 }}
        >
          Confirm →
        </button>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
          Skip for now
        </button>
      </StepActions>
    </div>
  );
}

function IdentityStep({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "20px",
          background: "var(--surface)",
          borderRadius: 10,
          border: "1px solid var(--hairline)",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🪪</span>
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 4,
              }}
            >
              Identity verification
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
              }}
            >
              Required before your first paid campaign
            </p>
          </div>
        </div>
        <Link
          href="/creator/verify"
          className="btn-primary click-shift"
          style={{ textDecoration: "none", flexShrink: 0 }}
        >
          Verify →
        </Link>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          marginBottom: 0,
        }}
      >
        Takes under 2 minutes. We use Stripe Identity to keep campaigns safe.
      </p>
      <StepActions>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
          Skip for now
        </button>
      </StepActions>
    </div>
  );
}

function PayoutStep({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "20px",
          background: "var(--surface)",
          borderRadius: 10,
          border: "1px solid var(--hairline)",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>💳</span>
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 4,
              }}
            >
              Payout setup
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
              }}
            >
              Connect a bank or debit card to receive campaign earnings
            </p>
          </div>
        </div>
        <Link
          href="/creator/wallet"
          className="btn-primary click-shift"
          style={{ textDecoration: "none", flexShrink: 0 }}
        >
          Set up →
        </Link>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          marginBottom: 0,
        }}
      >
        Payments release within 48 hours of campaign completion.
      </p>
      <StepActions>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
          Skip for now
        </button>
      </StepActions>
    </div>
  );
}

function DiscoveryStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div>
      <div
        style={{
          padding: "24px",
          background: "var(--surface-2)",
          borderRadius: 10,
          border: "1px solid var(--hairline)",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            marginBottom: 8,
          }}
        >
          Guided tour
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 900,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          Find your first campaign in NYC.
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "var(--ink-3)",
            lineHeight: 1.6,
          }}
        >
          Browse live campaigns by neighborhood, category, or payout. Apply in
          one tap — brands review within 24 hours.
        </p>
      </div>

      <StepActions>
        <Link
          href="/creator/explore"
          className="btn-primary click-shift"
          style={{ textDecoration: "none" }}
        >
          Explore campaigns →
        </Link>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onComplete}
        >
          Mark as seen
        </button>
      </StepActions>
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
    },
    {
      key: "applications" as const,
      name: "Application updates",
      desc: "When brands accept or decline your application",
    },
    {
      key: "payments" as const,
      name: "Payment releases",
      desc: "When your earnings hit your wallet",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 8,
        }}
      >
        {items.map(({ key, name, desc }) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "16px",
              borderRadius: 8,
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 2,
                }}
              >
                {name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                }}
              >
                {desc}
              </p>
            </div>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: 44,
                height: 24,
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={notifs[key]}
                onChange={() => toggle(key)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                  position: "absolute",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 12,
                  background: notifs[key]
                    ? "var(--brand-red)"
                    : "var(--hairline)",
                  transition: "background 0.2s ease",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: notifs[key] ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--snow)",
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              />
            </label>
          </div>
        ))}
      </div>

      <StepActions>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
        >
          Save preferences →
        </button>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
          Skip
        </button>
      </StepActions>
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
    <div>
      <div
        style={{
          padding: "24px",
          background: "var(--surface-2)",
          borderRadius: 10,
          border: "1px solid var(--hairline)",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            marginBottom: 12,
          }}
        >
          Referral bonus
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 900,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Give $25.
          <br />
          Get <em>$25</em>.
        </h3>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={inviteLink}
            readOnly
            aria-label="Your invite link"
            style={{
              flex: 1,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              padding: "10px 14px",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
              background: "var(--surface)",
              color: "var(--ink-3)",
              outline: "none",
            }}
          />
          <button
            type="button"
            className="btn-primary click-shift"
            onClick={handleCopy}
            style={{ flexShrink: 0, whiteSpace: "nowrap" }}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          marginBottom: 0,
        }}
      >
        Both you and your friend earn $25 after their first completed campaign.
      </p>
      <StepActions>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
        >
          Done →
        </button>
      </StepActions>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step metadata
   ───────────────────────────────────────────────────────────── */

const STEPS: {
  id: StepId;
  title: string;
  description: string;
  skippable: boolean;
}[] = [
  {
    id: 1,
    title: "Profile basics",
    description: "Name, handle, neighborhood, and avatar",
    skippable: false,
  },
  {
    id: 2,
    title: "Social connect",
    description: "Link Instagram, TikTok, or Xiaohongshu",
    skippable: true,
  },
  {
    id: 3,
    title: "Identity verify",
    description: "Required for paid campaigns",
    skippable: true,
  },
  {
    id: 4,
    title: "Payout setup",
    description: "Connect your bank or debit card",
    skippable: true,
  },
  {
    id: 5,
    title: "First campaign discovery",
    description: "Explore live campaigns near you",
    skippable: true,
  },
  {
    id: 6,
    title: "Notification prefs",
    description: "Choose what updates you receive",
    skippable: true,
  },
  {
    id: 7,
    title: "Get your invite link",
    description: "Refer a friend — both get $25",
    skippable: false,
  },
];

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>(INITIAL);
  const [expandedStep, setExpandedStep] = useState<StepId | null>(1);
  const [mounted, setMounted] = useState(false);

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
    const nextStep = (id < TOTAL ? id + 1 : id) as StepId;
    const next: Progress = {
      ...progress,
      completed: [...progress.completed.filter((c) => c !== id), id],
      skipped: progress.skipped.filter((s) => s !== id),
      activeStep: nextStep,
    };
    save(next);
    setProgress(next);
    setExpandedStep(id === TOTAL ? null : nextStep);
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
  const isComplete = completedCount >= TOTAL;

  if (!mounted) return null;

  return (
    <OnboardingShell
      role="Creator"
      totalSteps={TOTAL}
      currentStep={progress.activeStep}
      completedSteps={completedCount}
      isComplete={isComplete}
      onDashboard={() => router.push("/creator/dashboard")}
    >
      {STEPS.map(({ id, title, description }) => {
        const status = stepStatus(id, progress);
        const isExpanded = expandedStep === id;

        return (
          <ChecklistItem
            key={id}
            index={id}
            total={TOTAL}
            title={title}
            description={description}
            status={status}
            isExpanded={isExpanded}
            onExpand={() => toggleExpand(id)}
          >
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
            {id === 5 && <DiscoveryStep onComplete={() => completeStep(5)} />}
            {id === 6 && (
              <NotifsStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(6)}
                onSkip={() => skipStep(6)}
              />
            )}
            {id === 7 && <InviteStep onComplete={() => completeStep(7)} />}
          </ChecklistItem>
        );
      })}
    </OnboardingShell>
  );
}
