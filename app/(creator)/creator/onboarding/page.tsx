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
      {/* Avatar */}
      <div className="ob2-avatar-row">
        <button
          type="button"
          className="ob2-avatar-btn"
          aria-label="Upload profile photo"
        >
          📷
        </button>
        <div className="ob2-avatar-info">
          <p className="ob2-avatar-title">Add a profile photo</p>
          <p className="ob2-avatar-sub">Helps brands recognize you</p>
        </div>
      </div>

      <div className="ob2-field-row">
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="cr-name">
            Display name
          </label>
          <input
            id="cr-name"
            className="ob2-input"
            type="text"
            placeholder="How brands see you"
            value={profile.name}
            onChange={(e) =>
              onChange({ profile: { ...profile, name: e.target.value } })
            }
            autoComplete="name"
          />
        </div>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="cr-handle">
            Handle
          </label>
          <input
            id="cr-handle"
            className="ob2-input"
            type="text"
            placeholder="@yourhandle"
            value={profile.handle}
            onChange={(e) =>
              onChange({ profile: { ...profile, handle: e.target.value } })
            }
          />
        </div>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="cr-neighborhood">
          NYC neighborhood
        </label>
        <input
          id="cr-neighborhood"
          className="ob2-input"
          type="text"
          placeholder="e.g. Williamsburg, LES, Astoria"
          value={profile.neighborhood}
          list="cr-neighborhoods"
          onChange={(e) =>
            onChange({ profile: { ...profile, neighborhood: e.target.value } })
          }
        />
        <datalist id="cr-neighborhoods">
          {NYC_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="cr-bio">
          Short bio
        </label>
        <textarea
          id="cr-bio"
          className="ob2-textarea"
          placeholder="What makes your content unique?"
          value={profile.bio}
          maxLength={BIO_MAX}
          onChange={(e) =>
            onChange({ profile: { ...profile, bio: e.target.value } })
          }
        />
        <p
          className={`ob2-char-count${profile.bio.length >= BIO_MAX ? " ob2-char-count--warn" : ""}`}
        >
          {profile.bio.length}/{BIO_MAX}
        </p>
      </div>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!canProceed}
        >
          Save profile →
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
            className={`ob2-social-btn${social[key] ? " ob2-social-btn--connected" : ""}`}
            onClick={() => toggle(key)}
          >
            <span className="ob2-social-icon">{icon}</span>
            <span>{label}</span>
            {social[key] && (
              <span className="ob2-social-status">Connected</span>
            )}
          </button>
        ))}
      </div>
      <p className="ob2-input-hint">
        OAuth stub — connect at least one account to match with campaigns.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!anyConnected}
        >
          Confirm →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function IdentityStep({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <div className="ob2-link-step">
        <span className="ob2-link-step-icon">🪪</span>
        <div className="ob2-link-step-info">
          <p className="ob2-link-step-title">Identity verification</p>
          <p className="ob2-link-step-sub">
            Required before your first paid campaign
          </p>
        </div>
        <Link href="/creator/verify" className="ob2-btn-secondary">
          Verify →
        </Link>
      </div>
      <p className="ob2-input-hint">
        Takes under 2 minutes. We use Stripe Identity to keep campaigns safe.
      </p>
      <div className="ob2-step-actions">
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function PayoutStep({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <div className="ob2-link-step">
        <span className="ob2-link-step-icon">💳</span>
        <div className="ob2-link-step-info">
          <p className="ob2-link-step-title">Payout setup</p>
          <p className="ob2-link-step-sub">
            Connect a bank or debit card to receive campaign earnings
          </p>
        </div>
        <Link href="/creator/wallet" className="ob2-btn-secondary">
          Set up →
        </Link>
      </div>
      <p className="ob2-input-hint">
        Payments release within 48 hours of campaign completion.
      </p>
      <div className="ob2-step-actions">
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function DiscoveryStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div>
      <div className="ob2-tour-callout">
        <p className="ob2-tour-eyebrow">Guided tour</p>
        <h3 className="ob2-tour-title">Find your first campaign in NYC.</h3>
        <p className="ob2-tour-desc">
          Browse live campaigns by neighborhood, category, or payout. Apply in
          one tap — brands review within 24 hours.
        </p>
      </div>

      <div className="ob2-step-actions">
        <Link href="/creator/explore" className="ob2-btn-primary">
          Explore campaigns →
        </Link>
        <button type="button" className="ob2-btn-ghost" onClick={onComplete}>
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
      {items.map(({ key, name, desc }) => (
        <div key={key} className="ob2-toggle-row">
          <div className="ob2-toggle-info">
            <p className="ob2-toggle-name">{name}</p>
            <p className="ob2-toggle-desc">{desc}</p>
          </div>
          <label className="ob2-toggle-switch">
            <input
              type="checkbox"
              checked={notifs[key]}
              onChange={() => toggle(key)}
            />
            <span className="ob2-toggle-track" />
          </label>
        </div>
      ))}

      <div className="ob2-step-actions" style={{ marginTop: 24 }}>
        <button type="button" className="ob2-btn-primary" onClick={onComplete}>
          Save preferences →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
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
    <div>
      <div className="ob2-invite-box">
        <p className="ob2-invite-label">Referral bonus</p>
        <h3 className="ob2-invite-headline">
          Give $25.
          <br />
          Get <em>$25</em>.
        </h3>
        <div className="ob2-invite-link-row">
          <input
            type="text"
            className="ob2-invite-link-input"
            value={inviteLink}
            readOnly
            aria-label="Your invite link"
          />
          <button
            type="button"
            className="ob2-invite-copy-btn"
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
      <p className="ob2-input-hint">
        Both you and your friend earn $25 after their first completed campaign.
      </p>
      <div className="ob2-step-actions">
        <button type="button" className="ob2-btn-primary" onClick={onComplete}>
          Done →
        </button>
      </div>
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
