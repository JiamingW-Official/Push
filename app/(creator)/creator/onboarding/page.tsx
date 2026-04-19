"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY = "push-demo-creator-onboarding-v2";

const TOTAL_STEPS = 5;

type StepId = 1 | 2 | 3 | 4 | 5;

type Progress = {
  currentStep: StepId;
  completedSteps: number; // count of steps passed
  profile: {
    firstName: string;
    handle: string;
    neighborhood: string;
  };
  social: { ig: string; tiktok: string };
  niches: string[];
  payoutDone: boolean;
};

const INITIAL: Progress = {
  currentStep: 1,
  completedSteps: 0,
  profile: { firstName: "", handle: "", neighborhood: "" },
  social: { ig: "", tiktok: "" },
  niches: [],
  payoutDone: false,
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

const NICHE_OPTIONS: { emoji: string; label: string }[] = [
  { emoji: "☕", label: "Coffee" },
  { emoji: "🍜", label: "Food" },
  { emoji: "🍸", label: "Bars" },
  { emoji: "💅", label: "Beauty" },
  { emoji: "👗", label: "Fashion" },
  { emoji: "🏋️", label: "Fitness" },
  { emoji: "🎨", label: "Arts" },
  { emoji: "🏪", label: "Retail" },
  { emoji: "🌿", label: "Wellness" },
  { emoji: "🎵", label: "Music" },
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
    // ignore
  }
}

/* ─────────────────────────────────────────────────────────────
   Step screens
   ───────────────────────────────────────────────────────────── */

/** Step 1 — Name + photo */
function Step1Name({
  progress,
  onChange,
  onNext,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onNext: () => void;
}) {
  const { profile } = progress;
  const canProceed = profile.firstName.trim().length >= 1;

  return (
    <div className="ob2-step-card">
      <span className="ob2-step-icon" aria-hidden="true">
        👋
      </span>
      <h1 className="ob2-step-question">What should we call you?</h1>
      <p className="ob2-step-desc">
        We&apos;ll use your first name everywhere — on your profile, in messages
        from brands, and across your dashboard.
      </p>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="ob-firstname">
          First name
        </label>
        <input
          id="ob-firstname"
          className="ob2-input"
          type="text"
          placeholder="Alex"
          value={profile.firstName}
          onChange={(e) =>
            onChange({ profile: { ...profile, firstName: e.target.value } })
          }
          autoComplete="given-name"
          autoFocus
        />
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="ob-handle">
          Creator handle (optional)
        </label>
        <input
          id="ob-handle"
          className="ob2-input"
          type="text"
          placeholder="@yourhandle"
          value={profile.handle}
          onChange={(e) =>
            onChange({ profile: { ...profile, handle: e.target.value } })
          }
        />
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="ob-neighborhood">
          Your NYC neighborhood
        </label>
        <input
          id="ob-neighborhood"
          className="ob2-input"
          type="text"
          placeholder="e.g. Williamsburg, LES, Astoria"
          value={profile.neighborhood}
          list="ob-neighborhoods"
          onChange={(e) =>
            onChange({ profile: { ...profile, neighborhood: e.target.value } })
          }
        />
        <datalist id="ob-neighborhoods">
          {NYC_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      <button
        type="button"
        className="ob2-wizard-cta"
        onClick={onNext}
        disabled={!canProceed}
      >
        {canProceed
          ? `Hi ${profile.firstName.trim()}, let's go →`
          : "Get started →"}
      </button>

      <p className="ob2-wizard-signin">
        Already have an account? <Link href="/creator/login">Sign in</Link>
      </p>
    </div>
  );
}

/** Step 2 — Connect socials */
function Step2Socials({
  progress,
  onChange,
  onNext,
  onSkip,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const { social } = progress;
  const anyConnected =
    social.ig.trim().length > 0 || social.tiktok.trim().length > 0;
  const firstName = progress.profile.firstName.trim() || "you";

  return (
    <div className="ob2-step-card">
      <span className="ob2-step-icon" aria-hidden="true">
        📱
      </span>
      <h1 className="ob2-step-question">Where does {firstName} post?</h1>
      <p className="ob2-step-desc">
        Brands match with creators based on your platforms. Drop your handles —
        even one is enough to start getting campaign offers.
      </p>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="ob-ig">
          📸 Instagram handle
        </label>
        <input
          id="ob-ig"
          className="ob2-input"
          type="text"
          placeholder="@yourinstagram"
          value={social.ig}
          onChange={(e) =>
            onChange({ social: { ...social, ig: e.target.value } })
          }
        />
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="ob-tiktok">
          🎵 TikTok handle
        </label>
        <input
          id="ob-tiktok"
          className="ob2-input"
          type="text"
          placeholder="@yourtiktok"
          value={social.tiktok}
          onChange={(e) =>
            onChange({ social: { ...social, tiktok: e.target.value } })
          }
        />
      </div>

      <button
        type="button"
        className="ob2-wizard-cta"
        onClick={onNext}
        disabled={!anyConnected}
      >
        Looks good →
      </button>

      <button type="button" className="ob2-wizard-skip" onClick={onSkip}>
        I'll add this later
      </button>
    </div>
  );
}

/** Step 3 — Content style / niches */
function Step3Niches({
  progress,
  onChange,
  onNext,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onNext: () => void;
}) {
  const { niches } = progress;

  function toggle(label: string) {
    const next = niches.includes(label)
      ? niches.filter((n) => n !== label)
      : [...niches, label];
    onChange({ niches: next });
  }

  return (
    <div className="ob2-step-card">
      <span className="ob2-step-icon" aria-hidden="true">
        ✨
      </span>
      <h1 className="ob2-step-question">
        What kind of content do you love making?
      </h1>
      <p className="ob2-step-desc">
        Pick as many as you like. We&apos;ll surface campaigns that actually fit
        your vibe — not just whatever&apos;s paying most.
      </p>

      <div className="ob2-niche-grid">
        {NICHE_OPTIONS.map(({ emoji, label }) => (
          <button
            key={label}
            type="button"
            className={`ob2-niche-chip${niches.includes(label) ? " ob2-niche-chip--selected" : ""}`}
            onClick={() => toggle(label)}
          >
            <span aria-hidden="true">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="ob2-wizard-cta"
        onClick={onNext}
        disabled={niches.length === 0}
      >
        {niches.length > 0
          ? `${niches.length} niche${niches.length > 1 ? "s" : ""} selected →`
          : "Select at least one"}
      </button>
    </div>
  );
}

/** Step 4 — Payout setup */
function Step4Payout({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="ob2-step-card">
      <span className="ob2-step-icon" aria-hidden="true">
        💳
      </span>
      <h1 className="ob2-step-question">How should we pay you?</h1>
      <p className="ob2-step-desc">
        Connect a bank account or debit card. Payments release within 48 hours
        of a completed campaign — no waiting around.
      </p>

      <div className="ob2-link-step">
        <span className="ob2-link-step-icon">🏦</span>
        <div className="ob2-link-step-info">
          <p className="ob2-link-step-title">Bank or debit card</p>
          <p className="ob2-link-step-sub">
            Secure setup via Stripe — takes under 2 minutes
          </p>
        </div>
        <Link href="/creator/wallet" className="ob2-btn-secondary">
          Set up →
        </Link>
      </div>

      <p className="ob2-input-hint" style={{ marginBottom: 24 }}>
        You can always add this later from your wallet. You won&apos;t miss a
        payout.
      </p>

      <button type="button" className="ob2-wizard-cta" onClick={onNext}>
        All set →
      </button>

      <button type="button" className="ob2-wizard-skip" onClick={onSkip}>
        Skip for now
      </button>
    </div>
  );
}

/** Step 5 — Done / campaign preview */
const SEED_CAMPAIGNS = [
  {
    id: "c1",
    name: "Morning Coffee Story",
    merchant: "Blank Street Coffee",
    earn: "$18",
    color: "#003049",
    initials: "BS",
  },
  {
    id: "c2",
    name: "Lunch Reel Campaign",
    merchant: "Superiority Burger",
    earn: "$32",
    color: "#c1121f",
    initials: "SB",
  },
  {
    id: "c3",
    name: "Afternoon Lifestyle Post",
    merchant: "Flamingo Estate",
    earn: "$44",
    color: "#c9a96e",
    initials: "FE",
  },
];

function Step5Done({
  progress,
  onComplete,
}: {
  progress: Progress;
  onComplete: () => void;
}) {
  const firstName = progress.profile.firstName.trim() || "you";

  return (
    <div className="ob2-step-card">
      <span className="ob2-step-icon" aria-hidden="true">
        🎉
      </span>
      <h1 className="ob2-step-question">
        {firstName}, here&apos;s what&apos;s waiting for you.
      </h1>
      <p className="ob2-step-desc">
        These campaigns are live right now in your neighborhood. One tap to
        apply — brands review within 24 hours.
      </p>

      <div className="ob2-done-campaigns">
        {SEED_CAMPAIGNS.map((c) => (
          <Link
            key={c.id}
            href="/creator/explore"
            className="ob2-done-campaign-card"
          >
            <div
              className="ob2-done-campaign-logo"
              style={{ background: c.color }}
              aria-hidden="true"
            >
              {c.initials}
            </div>
            <div className="ob2-done-campaign-info">
              <p className="ob2-done-campaign-name">{c.name}</p>
              <p className="ob2-done-campaign-meta">{c.merchant}</p>
            </div>
            <span className="ob2-done-campaign-earn">{c.earn}</span>
          </Link>
        ))}
      </div>

      <button type="button" className="ob2-wizard-cta" onClick={onComplete}>
        Go to my dashboard →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>(INITIAL);
  const [mounted, setMounted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const p = load();
    setProgress(p);
    setMounted(true);
  }, []);

  const update = useCallback((partial: Partial<Progress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...partial };
      save(next);
      return next;
    });
  }, []);

  function advance() {
    const nextStep = Math.min(progress.currentStep + 1, TOTAL_STEPS) as StepId;
    update({
      currentStep: nextStep,
      completedSteps: Math.max(progress.completedSteps, progress.currentStep),
    });
  }

  function skip() {
    advance();
  }

  function handleComplete() {
    update({
      completedSteps: TOTAL_STEPS,
    });
    setIsComplete(true);
  }

  if (!mounted) return null;

  return (
    <OnboardingShell
      role="Creator"
      totalSteps={TOTAL_STEPS}
      currentStep={progress.currentStep}
      completedSteps={progress.completedSteps}
      isComplete={isComplete}
      onDashboard={() => router.push("/creator/dashboard")}
    >
      {progress.currentStep === 1 && (
        <Step1Name progress={progress} onChange={update} onNext={advance} />
      )}
      {progress.currentStep === 2 && (
        <Step2Socials
          progress={progress}
          onChange={update}
          onNext={advance}
          onSkip={skip}
        />
      )}
      {progress.currentStep === 3 && (
        <Step3Niches progress={progress} onChange={update} onNext={advance} />
      )}
      {progress.currentStep === 4 && (
        <Step4Payout onNext={advance} onSkip={skip} />
      )}
      {progress.currentStep === 5 && (
        <Step5Done progress={progress} onComplete={handleComplete} />
      )}
    </OnboardingShell>
  );
}
