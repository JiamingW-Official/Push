"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/db/browser";
import { TierJourney } from "@/components/creator/TierJourney";
import "./onboarding.css";

/* ── Types ───────────────────────────────────────────────── */

type Step = 1 | 2 | 3 | 4;

type Profile = {
  name: string;
  location: string;
  instagram: string;
  bio: string;
  contentTypes: string[];
  availability: string[];
};

/* ── Constants ───────────────────────────────────────────── */

const CONTENT_TYPE_OPTIONS = [
  { label: "Food & Dining", value: "food_dining", icon: "", popular: true },
  { label: "Coffee & Cafés", value: "coffee_cafes", icon: "", popular: true },
  {
    label: "Beauty & Wellness",
    value: "beauty_wellness",
    icon: "",
    popular: false,
  },
  {
    label: "Retail & Fashion",
    value: "retail_fashion",
    icon: "",
    popular: false,
  },
  {
    label: "Fitness & Active",
    value: "fitness_active",
    icon: "",
    popular: false,
  },
  {
    label: "Lifestyle & City",
    value: "lifestyle_city",
    icon: "",
    popular: false,
  },
];

const AVAILABILITY_OPTIONS = [
  { label: "Mornings", value: "weekday_morning", group: "weekday" },
  { label: "Afternoons", value: "weekday_afternoon", group: "weekday" },
  { label: "Evenings", value: "weekday_evening", group: "weekday" },
  { label: "Mornings", value: "weekend_morning", group: "weekend" },
  { label: "Afternoons", value: "weekend_afternoon", group: "weekend" },
  { label: "Evenings", value: "weekend_evening", group: "weekend" },
];

/* First 3 tiers with benefits for the welcome preview */
const TIER_PREVIEWS = [
  {
    name: "Seed",
    emoji: "",
    benefit: "Free product campaigns",
    detail: "Build your portfolio",
    unlock: "You're here now",
    isCurrent: true,
  },
  {
    name: "Explorer",
    emoji: "",
    benefit: "$12 per campaign",
    detail: "Start earning cash",
    unlock: "2 campaigns + score ≥ 40",
    isCurrent: false,
  },
  {
    name: "Operator",
    emoji: "",
    benefit: "$20 + 3% attribution",
    detail: "Revenue share kicks in",
    unlock: "Score ≥ 55",
    isCurrent: false,
  },
];

const BIO_MAX = 80;

/* ── Demo mode detection ─────────────────────────────────── */
function isDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Completeness calculation (Step 1 only) ──────────────── */
function calcCompleteness(profile: Profile): number {
  let filled = 0;
  const fields: (keyof Profile)[] = ["name", "location", "bio"];
  fields.forEach((f) => {
    if (typeof profile[f] === "string" && (profile[f] as string).trim())
      filled++;
  });
  return Math.round((filled / fields.length) * 100);
}

/* ── Main Page ───────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    name: "",
    location: "",
    instagram: "",
    bio: "",
    contentTypes: [],
    availability: [],
  });

  // Pre-fill from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("push-onboarding-profile");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  /* ── Supabase save helpers ───────────────────────────────── */

  async function getUserId(): Promise<string | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  }

  async function saveStep1() {
    if (isDemoMode()) {
      localStorage.setItem("push-onboarding-profile", JSON.stringify(profile));
      return;
    }
    const supabase = createClient();
    const uid = await getUserId();
    if (!uid) return;
    await supabase
      .from("creators")
      .update({
        name: profile.name,
        location: profile.location,
        bio: profile.bio,
      })
      .eq("id", uid);
  }

  async function saveStep2() {
    localStorage.setItem("push-onboarding-profile", JSON.stringify(profile));
    if (isDemoMode()) return;
    const supabase = createClient();
    const uid = await getUserId();
    if (!uid) return;
    // Store as JSON text; gracefully skip if column doesn't exist
    try {
      await supabase
        .from("creators")
        .update({ content_types: JSON.stringify(profile.contentTypes) })
        .eq("id", uid);
    } catch {
      // column may not exist yet — localStorage fallback already done
    }
  }

  async function saveStep3() {
    localStorage.setItem("push-onboarding-profile", JSON.stringify(profile));
    if (isDemoMode()) return;
    const supabase = createClient();
    const uid = await getUserId();
    if (!uid) return;
    try {
      await supabase
        .from("creators")
        .update({ availability: JSON.stringify(profile.availability) })
        .eq("id", uid);
    } catch {
      // column may not exist yet
    }
  }

  async function saveStep4() {
    localStorage.removeItem("push-onboarding-profile");
    if (isDemoMode()) return;
    const supabase = createClient();
    const uid = await getUserId();
    if (!uid) return;
    await supabase.from("creators").update({ is_active: true }).eq("id", uid);
  }

  /* ── Navigation handlers ─────────────────────────────────── */

  function triggerStepTransition(nextStep: Step) {
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 180);
  }

  async function handleNext() {
    setError("");
    setSaving(true);
    try {
      if (step === 1) {
        if (!profile.name.trim() || !profile.location.trim()) {
          setError("Please fill in your name and neighborhood.");
          setSaving(false);
          return;
        }
        await saveStep1();
        triggerStepTransition(2);
      } else if (step === 2) {
        if (profile.contentTypes.length === 0) {
          setError("Select at least one content type.");
          setSaving(false);
          return;
        }
        await saveStep2();
        triggerStepTransition(3);
      } else if (step === 3) {
        if (profile.availability.length === 0) {
          setError("Select at least one availability slot.");
          setSaving(false);
          return;
        }
        await saveStep3();
        triggerStepTransition(4);
      } else if (step === 4) {
        await saveStep4();
        router.push("/creator/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSaving(false);
  }

  function handleBack() {
    setError("");
    if (step > 1) triggerStepTransition((step - 1) as Step);
  }

  function toggleChip(field: "contentTypes" | "availability", value: string) {
    setProfile((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  /* ── Render helpers ──────────────────────────────────────── */

  const completeness = calcCompleteness(profile);

  function ProgressDots() {
    return (
      <div className="ob-progress-dots" aria-label={`Step ${step} of 4`}>
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <span
            key={s}
            className={`ob-dot${step >= s ? " ob-dot--active" : ""}`}
          />
        ))}
      </div>
    );
  }

  /* ── Step 1 ──────────────────────────────────────────────── */

  function Step1() {
    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot" aria-hidden="true" />
          Step 1 of 4
        </span>
        <h1 className="ob-heading">
          Let's set you up for your first campaign.
        </h1>
        <p className="ob-subtext">
          Takes 2 minutes. The more we know, the better we match you.
        </p>

        {/* Avatar upload placeholder */}
        <div className="ob-avatar-row">
          <div
            className="ob-avatar-placeholder"
            aria-label="Upload profile photo"
          >
            <span className="ob-avatar-icon" aria-hidden="true">
              📷
            </span>
          </div>
          <div className="ob-avatar-hint">
            <p className="ob-avatar-hint-title">Add a photo</p>
            <p className="ob-avatar-hint-sub">This helps merchants find you</p>
          </div>
        </div>

        {/* Completeness bar */}
        <div
          className="ob-completeness"
          aria-label={`Profile ${completeness}% complete`}
        >
          <div className="ob-completeness-track">
            <div
              className="ob-completeness-fill"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <span className="ob-completeness-label">
            {completeness}% complete
          </span>
        </div>

        <div className="ob-field">
          <label className="ob-label" htmlFor="ob-name">
            Display Name
          </label>
          <input
            id="ob-name"
            className="ob-input"
            type="text"
            placeholder="How brands will see you"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            autoComplete="name"
          />
        </div>

        <div className="ob-field">
          <label className="ob-label" htmlFor="ob-location">
            Neighborhood
          </label>
          <input
            id="ob-location"
            className="ob-input"
            type="text"
            placeholder="e.g. Williamsburg, LES, Astoria"
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
          />
        </div>

        <div className="ob-field">
          <label className="ob-label" htmlFor="ob-bio">
            Short Bio
          </label>
          <textarea
            id="ob-bio"
            className="ob-textarea"
            placeholder="What makes your content unique?"
            value={profile.bio}
            maxLength={BIO_MAX}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
          <p
            className={`ob-char-count${profile.bio.length >= BIO_MAX ? " ob-char-count--warning" : ""}`}
          >
            {profile.bio.length}/{BIO_MAX}
          </p>
        </div>
      </>
    );
  }

  /* ── Step 2 ──────────────────────────────────────────────── */

  function Step2() {
    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot" aria-hidden="true" />
          Step 2 of 4
        </span>
        <h1 className="ob-heading">What do you create?</h1>
        <p className="ob-subtext">
          Select all that apply — we use these to match you with the right
          campaigns.
        </p>

        <div className="ob-chips">
          {CONTENT_TYPE_OPTIONS.map((opt) => {
            const isSelected = profile.contentTypes.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`ob-chip${isSelected ? " ob-chip--selected" : ""}`}
                onClick={() => toggleChip("contentTypes", opt.value)}
                aria-pressed={isSelected}
              >
                <span className="ob-chip-icon" aria-hidden="true">
                  {opt.icon}
                </span>
                <span className="ob-chip-label">{opt.label}</span>
                {opt.popular && <span className="ob-chip-badge">Popular</span>}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  /* ── Step 3 ──────────────────────────────────────────────── */

  function Step3() {
    const weekdayOptions = AVAILABILITY_OPTIONS.filter(
      (o) => o.group === "weekday",
    );
    const weekendOptions = AVAILABILITY_OPTIONS.filter(
      (o) => o.group === "weekend",
    );

    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot" aria-hidden="true" />
          Step 3 of 4
        </span>
        <h1 className="ob-heading">When can you create?</h1>
        <p className="ob-subtext">
          Helps us match you with time-sensitive campaigns in your area.
        </p>

        {/* Weekday group */}
        <div className="ob-calendar-section">
          <p className="ob-calendar-group-label">Weekdays</p>
          <div className="ob-calendar-grid">
            {weekdayOptions.map((opt) => {
              const isSelected = profile.availability.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`ob-calendar-cell${isSelected ? " ob-calendar-cell--selected" : ""}`}
                  onClick={() => toggleChip("availability", opt.value)}
                  aria-pressed={isSelected}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekend group */}
        <div className="ob-calendar-section">
          <p className="ob-calendar-group-label">Weekends</p>
          <div className="ob-calendar-grid">
            {weekendOptions.map((opt) => {
              const isSelected = profile.availability.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`ob-calendar-cell${isSelected ? " ob-calendar-cell--selected" : ""}`}
                  onClick={() => toggleChip("availability", opt.value)}
                  aria-pressed={isSelected}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  /* ── Step 4 ──────────────────────────────────────────────── */

  function Step4() {
    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot" aria-hidden="true" />
          Step 4 of 4
        </span>

        {/* Welcome hero */}
        <div className="ob-welcome-hero">
          <p className="ob-welcome-eyebrow">You're in.</p>
          <h1 className="ob-heading">You start at Seed.</h1>
          <p className="ob-subtext" style={{ marginBottom: 0 }}>
            Free product campaigns to build your portfolio — then level up as
            your impact grows.
          </p>
        </div>

        {/* TierJourney component — compact rail */}
        <div className="ob-tier-preview">
          <TierJourney currentTier="seed" currentScore={0} compact />
        </div>

        {/* Seed tier detail */}
        <div className="ob-seed-callout">
          <p className="ob-seed-callout-title">Seed — You're here</p>
          <p className="ob-seed-callout-desc">
            Free product campaigns &middot; Build your portfolio
          </p>
          <div className="ob-seed-callout-path">
            <span className="ob-seed-path-arrow">→</span>
            <span>
              Complete <strong>2 campaigns</strong> + score{" "}
              <strong>≥ 40</strong> to unlock Explorer (
              <strong>$12/campaign</strong>)
            </span>
          </div>
        </div>

        {/* What you'll unlock — first 3 tiers */}
        <div className="ob-unlock-section">
          <p className="ob-unlock-heading">What you'll unlock</p>
          <div className="ob-tier-cards">
            {TIER_PREVIEWS.map((tier) => (
              <div
                key={tier.name}
                className={`ob-tier-card${tier.isCurrent ? " ob-tier-card--current" : ""}`}
              >
                <div className="ob-tier-card-header">
                  <span className="ob-tier-card-emoji">{tier.emoji}</span>
                  <span className="ob-tier-card-name">{tier.name}</span>
                  {tier.isCurrent && (
                    <span className="ob-tier-card-now">NOW</span>
                  )}
                </div>
                <p className="ob-tier-card-benefit">{tier.benefit}</p>
                <p className="ob-tier-card-detail">{tier.detail}</p>
                <p className="ob-tier-card-unlock">
                  {tier.isCurrent ? tier.unlock : `Unlock: ${tier.unlock}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ── Layout ──────────────────────────────────────────────── */

  return (
    <div className="ob-page">
      <div className="ob-card">
        <ProgressDots />

        <div className={animating ? "ob-step-enter" : undefined}>
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        {error && <p className="ob-error">{error}</p>}

        <div className="ob-nav">
          {step > 1 ? (
            <button type="button" className="ob-back-btn" onClick={handleBack}>
              ← Back
            </button>
          ) : (
            <Link href="/creator/dashboard" className="ob-back-btn">
              Skip for now
            </Link>
          )}

          <button
            type="button"
            className={`ob-next-btn${step === 4 ? " ob-next-btn--full" : ""}`}
            onClick={handleNext}
            disabled={saving}
          >
            {saving
              ? "Saving…"
              : step === 4
                ? "Start Your First Campaign →"
                : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
