"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import "./onboarding.css";

/* ── Types ───────────────────────────────────────────────── */

type Step = 1 | 2 | 3 | 4 | 5;

interface CreatorState {
  schemaVersion: 1;
  onboarding: {
    completedSteps: number[];
    profile: {
      name: string;
      handle: string;
      location: string;
      instagram: string;
      bio: string;
    };
    social: { ig: boolean; tiktok: boolean; xhs: boolean };
    payout: {
      method: "venmo" | "cashapp" | "ach" | null;
      value: string;
      routing: string;
      account: string;
    };
    lightKyc: { idUploaded: boolean; selfieComplete: boolean };
    done: boolean;
    segment: "side-income" | "professional";
  };
}

/* ── Constants ───────────────────────────────────────────── */

const STORAGE_KEY = "push.creator.state";

const STEP_LABELS: Record<Step, string> = {
  1: "DISCOVER",
  2: "PROFILE",
  3: "SOCIAL",
  4: "PAYOUT",
  5: "LIGHT KYC",
};

/* ── Demo mode detection ─────────────────────────────────── */
function isDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Main Page ───────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Step 2 — Profile
  const [profile, setProfile] = useState({
    name: "",
    handle: "",
    location: "",
    instagram: "",
    bio: "",
  });

  // Step 3 — Social
  const [connectedSocials, setConnectedSocials] = useState({
    ig: false,
    tiktok: false,
    xhs: false,
  });

  // Step 4 — Payout
  const [payoutTab, setPayoutTab] = useState<"venmo" | "cashapp" | "ach">(
    "venmo",
  );
  const [payoutVenmo, setPayoutVenmo] = useState("");
  const [payoutCashapp, setPayoutCashapp] = useState("");
  const [payoutRouting, setPayoutRouting] = useState("");
  const [payoutAccount, setPayoutAccount] = useState("");

  // Step 5 — Light KYC
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieComplete, setSelfieComplete] = useState(false);
  const [selfieCountdown, setSelfieCountdown] = useState(0);

  // Segment from stored state
  const [segment, setSegment] = useState<"side-income" | "professional">(
    "side-income",
  );

  /* ── State hydration ─────────────────────────────────────── */

  useEffect(() => {
    // migrate legacy key
    const legacy = localStorage.getItem("push-onboarding-profile");
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name || "",
          location: parsed.location || "",
          bio: parsed.bio || "",
          instagram: parsed.instagram || "",
        }));
      } catch {
        // ignore
      }
      localStorage.removeItem("push-onboarding-profile");
    }

    // load new state
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const state: CreatorState = JSON.parse(stored);
        if (state.onboarding) {
          const ob = state.onboarding;
          if (ob.profile) setProfile(ob.profile);
          if (ob.social) setConnectedSocials(ob.social);
          if (ob.payout) {
            if (ob.payout.method) setPayoutTab(ob.payout.method);
            setPayoutVenmo(ob.payout.value || "");
            setPayoutRouting(ob.payout.routing || "");
            setPayoutAccount(ob.payout.account || "");
          }
          if (ob.lightKyc) {
            setIdUploaded(ob.lightKyc.idUploaded);
            setSelfieComplete(ob.lightKyc.selfieComplete);
          }
          if (ob.segment) setSegment(ob.segment);
          if (ob.done) setShowCompletion(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  /* ── State persistence ───────────────────────────────────── */

  function saveState(updates: Partial<CreatorState["onboarding"]>) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current: CreatorState = stored
      ? JSON.parse(stored)
      : {
          schemaVersion: 1,
          onboarding: {
            completedSteps: [],
            profile: {
              name: "",
              handle: "",
              location: "",
              instagram: "",
              bio: "",
            },
            social: { ig: false, tiktok: false, xhs: false },
            payout: { method: null, value: "", routing: "", account: "" },
            lightKyc: { idUploaded: false, selfieComplete: false },
            done: false,
            segment: "side-income",
          },
        };
    current.onboarding = { ...current.onboarding, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }

  /* ── Supabase helper ─────────────────────────────────────── */

  async function getUserId(): Promise<string | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  }

  /* ── Navigation ──────────────────────────────────────────── */

  function triggerStepTransition(nextStep: Step) {
    track("onboarding_step_completed", { step, label: STEP_LABELS[step] });
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      track("onboarding_step_entered", {
        step: nextStep,
        label: STEP_LABELS[nextStep],
      });
      setAnimating(false);
    }, 180);
  }

  function handleBack() {
    setError("");
    if (step > 1) triggerStepTransition((step - 1) as Step);
  }

  async function handleNext() {
    setError("");
    setSaving(true);
    try {
      if (step === 1) {
        // Discover — always valid
        saveState({ completedSteps: [1] });
        triggerStepTransition(2);
      } else if (step === 2) {
        if (!profile.name.trim() || !profile.location.trim()) {
          setError("Please fill in your display name and neighborhood.");
          setSaving(false);
          return;
        }
        saveState({ profile, completedSteps: [1, 2] });
        if (!isDemoMode()) {
          const supabase = createClient();
          const uid = await getUserId();
          if (uid)
            await supabase
              .from("creators")
              .update({
                name: profile.name,
                location: profile.location,
                bio: profile.bio,
              })
              .eq("id", uid);
        }
        triggerStepTransition(3);
      } else if (step === 3) {
        if (!connectedSocials.ig) {
          setError("Please connect your Instagram account to continue.");
          setSaving(false);
          return;
        }
        saveState({ social: connectedSocials, completedSteps: [1, 2, 3] });
        triggerStepTransition(4);
      } else if (step === 4) {
        const payoutFilled =
          (payoutTab === "venmo" && payoutVenmo.trim()) ||
          (payoutTab === "cashapp" && payoutCashapp.trim()) ||
          (payoutTab === "ach" && payoutRouting.trim() && payoutAccount.trim());
        if (!payoutFilled) {
          setError("Please fill in your payout details.");
          setSaving(false);
          return;
        }
        saveState({
          payout: {
            method: payoutTab,
            value: payoutTab === "venmo" ? payoutVenmo : payoutCashapp,
            routing: payoutRouting,
            account: payoutAccount,
          },
          completedSteps: [1, 2, 3, 4],
        });
        triggerStepTransition(5);
      } else if (step === 5) {
        if (!idUploaded || !selfieComplete) {
          setError("Please upload your ID and complete the selfie check.");
          setSaving(false);
          return;
        }
        saveState({
          lightKyc: { idUploaded, selfieComplete },
          completedSteps: [1, 2, 3, 4, 5],
          done: true,
        });
        if (!isDemoMode()) {
          const supabase = createClient();
          const uid = await getUserId();
          if (uid)
            await supabase
              .from("creators")
              .update({ is_active: true, onboarding_completed: true })
              .eq("id", uid);
        }
        track("onboarding_submitted", { segment });
        setShowCompletion(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSaving(false);
  }

  /* ── Step components ─────────────────────────────────────── */

  function DiscoverStep() {
    const campaigns = [
      {
        id: 1,
        merchant: "Banter Coffee",
        category: "Coffee & Café",
        payout: "$28",
        unit: "/ verified customer",
        spots: 3,
        color: "#780000",
      },
      {
        id: 2,
        merchant: "Girls Who Walk",
        category: "Fitness · Wellness",
        payout: "$45",
        unit: "/ verified customer",
        spots: 5,
        color: "#003049",
      },
      {
        id: 3,
        merchant: "Myrtle & Co.",
        category: "Retail · Lifestyle",
        payout: "$32",
        unit: "/ verified customer",
        spots: 2,
        color: "#003049",
      },
    ];
    return (
      <>
        <div className="ob-step-header">
          <span className="ob-step-tag">STEP 1 OF 5 · DISCOVER</span>
          <h1 className="ob-heading">
            See what&apos;s live
            <br />
            in Williamsburg.
          </h1>
          <p className="ob-subtext">
            Real campaigns. Real pay.
            <br />
            Finish setup to apply.
          </p>
        </div>
        <div className="ob-campaign-grid">
          {campaigns.map((c, i) => (
            <div
              key={c.id}
              className="ob-campaign-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="ob-campaign-top">
                <span className="ob-campaign-payout-big">{c.payout}</span>
                <span className="ob-campaign-payout-unit">{c.unit}</span>
              </div>
              <div className="ob-campaign-body">
                <p className="ob-campaign-merchant">{c.merchant}</p>
                <p className="ob-campaign-category">{c.category}</p>
              </div>
              <div className="ob-campaign-footer">
                <span className="ob-campaign-spots">{c.spots} spots left</span>
                <button
                  className="ob-campaign-apply"
                  disabled
                  title="Finish your profile to apply"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function ProfileStep() {
    const completeness = [profile.name, profile.location, profile.bio].filter(
      (s) => s.trim(),
    ).length;
    const pct = Math.round((completeness / 3) * 100);
    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot" aria-hidden="true" />
          STEP 2 OF 5 · PROFILE
        </span>
        <h1 className="ob-heading">Build your first impression.</h1>
        <p className="ob-subtext">This is what merchants see first.</p>

        <div
          className="ob-completeness"
          aria-label={`Profile ${pct}% complete`}
        >
          <div className="ob-completeness-track">
            <div
              className="ob-completeness-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="ob-completeness-label">{pct}% complete</span>
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
          <label className="ob-label" htmlFor="ob-handle">
            Handle
          </label>
          <input
            id="ob-handle"
            className="ob-input"
            type="text"
            placeholder="e.g. @coffee_jess"
            value={profile.handle}
            onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
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
          <label className="ob-label" htmlFor="ob-instagram">
            Instagram Handle
          </label>
          <input
            id="ob-instagram"
            className="ob-input"
            type="text"
            placeholder="@yourhandle"
            value={profile.instagram}
            onChange={(e) =>
              setProfile({ ...profile, instagram: e.target.value })
            }
          />
        </div>
        <div className="ob-field">
          <label className="ob-label" htmlFor="ob-bio">
            Short Bio <span className="ob-label-optional">(120 chars)</span>
          </label>
          <textarea
            id="ob-bio"
            className="ob-textarea"
            placeholder="What makes your content unique?"
            value={profile.bio}
            maxLength={120}
            rows={3}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
          <p
            className={`ob-char-count${profile.bio.length >= 120 ? " ob-char-count--warning" : ""}`}
          >
            {profile.bio.length}/120
          </p>
        </div>
      </>
    );
  }

  function SocialStep() {
    const platforms = [
      { key: "ig" as const, name: "Instagram", abbr: "IG", required: true },
      { key: "tiktok" as const, name: "TikTok", abbr: "TT", required: false },
      { key: "xhs" as const, name: "小红书", abbr: "XHS", required: false },
    ];
    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot" aria-hidden="true" />
          STEP 3 OF 5 · SOCIAL
        </span>
        <h1 className="ob-heading">Connect your socials.</h1>
        <p className="ob-subtext">Read-only. We never post on your behalf.</p>
        <div className="ob-platform-tiles">
          {platforms.map((p) => {
            const connected = connectedSocials[p.key];
            return (
              <div
                key={p.key}
                className={`ob-platform-tile${connected ? " ob-platform-tile--connected" : ""}`}
              >
                <span className="ob-platform-icon">{p.abbr}</span>
                <div className="ob-platform-info">
                  <p className="ob-platform-name">{p.name}</p>
                  <p className="ob-platform-req">
                    {p.required ? "Required" : "Optional"}
                  </p>
                </div>
                <button
                  type="button"
                  className={`ob-platform-btn${connected ? " ob-platform-btn--connected" : ""}`}
                  onClick={() =>
                    setConnectedSocials((prev) => ({
                      ...prev,
                      [p.key]: !prev[p.key],
                    }))
                  }
                  disabled={connected}
                >
                  {connected ? "Connected · Read only" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  function PayoutStep() {
    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot" aria-hidden="true" />
          STEP 4 OF 5 · PAYOUT
        </span>
        <h1 className="ob-heading">Set up payouts.</h1>
        <p className="ob-subtext">
          Payouts settle within 3 business days of a verified customer visit.
        </p>

        <div className="ob-payout-tabs" role="tablist">
          {(["venmo", "cashapp", "ach"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={payoutTab === tab}
              className={`ob-payout-tab${payoutTab === tab ? " ob-payout-tab--active" : ""}`}
              type="button"
              onClick={() => setPayoutTab(tab)}
            >
              {tab === "venmo"
                ? "Venmo"
                : tab === "cashapp"
                  ? "CashApp"
                  : "ACH Bank"}
            </button>
          ))}
        </div>

        <div className="ob-payout-panel">
          {payoutTab === "venmo" && (
            <div className="ob-field">
              <label className="ob-label" htmlFor="ob-venmo">
                Venmo Handle
              </label>
              <input
                id="ob-venmo"
                className="ob-input"
                type="text"
                placeholder="@your-venmo"
                value={payoutVenmo}
                onChange={(e) => setPayoutVenmo(e.target.value)}
              />
            </div>
          )}
          {payoutTab === "cashapp" && (
            <div className="ob-field">
              <label className="ob-label" htmlFor="ob-cashapp">
                CashApp $Cashtag
              </label>
              <input
                id="ob-cashapp"
                className="ob-input"
                type="text"
                placeholder="$YourCashTag"
                value={payoutCashapp}
                onChange={(e) => setPayoutCashapp(e.target.value)}
              />
            </div>
          )}
          {payoutTab === "ach" && (
            <>
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-routing">
                  Routing Number
                </label>
                <input
                  id="ob-routing"
                  className="ob-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{9}"
                  maxLength={9}
                  placeholder="9-digit routing number"
                  value={payoutRouting}
                  onChange={(e) => setPayoutRouting(e.target.value)}
                />
              </div>
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-account">
                  Account Number
                </label>
                <input
                  id="ob-account"
                  className="ob-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Account number"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                />
              </div>
              {segment === "professional" && (
                <div className="ob-field">
                  <label className="ob-label">
                    W-9 Upload{" "}
                    <span className="ob-label-optional">(Professional)</span>
                  </label>
                  <div
                    className="ob-upload-area"
                    onClick={() =>
                      alert("W-9 upload — connect to real file upload")
                    }
                  >
                    <p className="ob-upload-hint">Click to upload W-9 form</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  function LightKycStep() {
    function startSelfie() {
      setSelfieCountdown(3);
      const tick = setInterval(() => {
        setSelfieCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(tick);
            setSelfieComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return (
      <>
        <span className="ob-step-number">
          <span className="ob-step-dot ob-step-dot--gold" aria-hidden="true" />
          STEP 5 OF 5 · LIGHT KYC
        </span>
        <span className="ob-kyc-eyebrow">UNLOCKS EXPLORER TIER</span>
        <h1 className="ob-heading">Quick selfie check.</h1>
        <p className="ob-subtext">
          Confirms you&apos;re real. The deeper check only happens when you
          apply to Operator tier.
        </p>

        <div className="ob-field">
          <label className="ob-label">ID Document — Front</label>
          <div
            className={`ob-upload-area${idUploaded ? " ob-upload-area--done" : ""}`}
            onClick={() => setIdUploaded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIdUploaded(true);
            }}
            aria-label="Upload ID document front"
          >
            {idUploaded ? (
              <p className="ob-upload-done">ID uploaded</p>
            ) : (
              <p className="ob-upload-hint">
                Click or drag to upload · PNG / JPG / PDF
              </p>
            )}
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label">Selfie</label>
          {selfieComplete ? (
            <div className="ob-selfie-done">Selfie captured</div>
          ) : selfieCountdown > 0 ? (
            <div className="ob-selfie-countdown" aria-live="polite">
              Taking selfie in {selfieCountdown}…
            </div>
          ) : (
            <button
              type="button"
              className="ob-btn-secondary"
              onClick={startSelfie}
            >
              Take selfie (3s liveness)
            </button>
          )}
        </div>

        <details className="ob-kyc-why">
          <summary>Why we ask</summary>
          <p>
            FTC 5.5 compliance and platform safety. Reviewed by
            ConversionOracle, never stored beyond verification.
          </p>
        </details>
      </>
    );
  }

  /* ── Progress dots ───────────────────────────────────────── */

  function ProgressDots() {
    return (
      <div
        className="ob-progress-dots ob-progress-dots--mobile-only"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemax={5}
        aria-label={`Step ${step} of 5`}
      >
        {([1, 2, 3, 4, 5] as Step[]).map((s) => (
          <span
            key={s}
            className={`ob-dot${step >= s ? " ob-dot--active" : ""}`}
          />
        ))}
      </div>
    );
  }

  /* ── Completion screen ───────────────────────────────────── */

  if (showCompletion) {
    return (
      <div className="ob-page ob-page--completion">
        <div className="ob-completion">
          <div className="ob-completion-inner">
            <span className="ob-completion-eyebrow">YOU&apos;RE IN</span>
            <h1 className="ob-completion-hero">
              <span className="ob-completion-hero-thin">You&apos;re</span>
              <span className="ob-completion-hero-bold">live.</span>
            </h1>
            <p className="ob-completion-sub">
              SLR counting starts now · Month-12 target 25 · First match inside
              24h.
            </p>
            <button
              type="button"
              className="ob-completion-cta"
              onClick={() => router.push("/creator/dashboard")}
            >
              Go to dashboard →
            </button>
          </div>
          {/* CSS confetti rects */}
          <div className="ob-confetti" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className={`ob-confetti-piece ob-confetti-piece--${(i % 4) + 1}`}
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Layout ──────────────────────────────────────────────── */

  return (
    <div className="ob-page">
      {/* Left editorial sidebar */}
      <aside className="ob-sidebar" aria-label="Onboarding progress">
        <Link href="/" className="ob-sidebar-logo">
          Push
        </Link>

        <div className="ob-sidebar-content">
          <span className="ob-sidebar-eyebrow">CREATOR</span>
          <div className="ob-sidebar-tier">
            <span className="ob-sidebar-tier-badge">Clay · Seed</span>
          </div>

          {/* Vertical step list */}
          <nav className="ob-step-nav" aria-label="Steps">
            {([1, 2, 3, 4, 5] as Step[]).map((s) => (
              <div
                key={s}
                className={`ob-step-nav-item${step === s ? " ob-step-nav-item--active" : ""}${step > s ? " ob-step-nav-item--done" : ""}`}
                aria-current={step === s ? "step" : undefined}
              >
                <span className="ob-step-nav-num">0{s}</span>
                <span className="ob-step-nav-label">{STEP_LABELS[s]}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Editorial big number at bottom */}
        <div className="ob-sidebar-stat">
          <span className="ob-sidebar-big-num">
            {String(step).padStart(2, "0")}
          </span>
          <span className="ob-sidebar-big-label">/ 05 STEPS</span>
        </div>
      </aside>

      {/* Right content panel */}
      <main className="ob-main">
        <div className="ob-content">
          <ProgressDots />

          <div className={animating ? "ob-step-enter" : undefined}>
            {step === 1 && <DiscoverStep />}
            {step === 2 && <ProfileStep />}
            {step === 3 && <SocialStep />}
            {step === 4 && <PayoutStep />}
            {step === 5 && <LightKycStep />}
          </div>

          {error && (
            <p className="ob-error" role="alert">
              {error}
            </p>
          )}

          <div className="ob-nav">
            {step > 1 ? (
              <button
                type="button"
                className="ob-back-btn"
                onClick={handleBack}
              >
                ← Back
              </button>
            ) : (
              <Link href="/creator/dashboard" className="ob-back-btn">
                Skip for now
              </Link>
            )}
            <button
              type="button"
              className={`ob-next-btn${step === 5 ? " ob-next-btn--full" : ""}`}
              onClick={handleNext}
              disabled={
                saving || (step === 5 && (!idUploaded || !selfieComplete))
              }
            >
              {saving
                ? "Saving…"
                : step === 5
                  ? "Finish setup →"
                  : step === 1
                    ? "Continue →"
                    : "Next →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
