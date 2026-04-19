"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import "@/styles/auth-split.css";
import "./signup.css";

/* ── Types ───────────────────────────────────────────────── */

type Step = 1 | 2 | 3;

type Fields = {
  email: string;
  password: string;
  confirm: string;
  city: string;
  instagram: string;
  niches: string[];
};

type FieldStatus = Partial<
  Record<keyof Omit<Fields, "niches">, "valid" | "error">
>;

const NICHE_OPTIONS = [
  "Food",
  "Coffee",
  "Beauty",
  "Fashion",
  "Fitness",
  "Travel",
  "Art",
];

const TIERS = [
  {
    icon: "◎",
    label: "Clay",
    rate: "Start here",
    desc: "Free product campaigns — build your score",
    current: true,
  },
  {
    icon: "◈",
    label: "Bronze",
    rate: "$15+/booking",
    desc: "First paid campaigns unlock",
    current: false,
  },
  {
    icon: "◆",
    label: "Silver",
    rate: "$30+/booking",
    desc: "Commission kicks in — real earnings",
    current: false,
  },
  {
    icon: "◉",
    label: "Gold",
    rate: "$55+/booking",
    desc: "Trusted local voice",
    current: false,
  },
  {
    icon: "◑",
    label: "Platinum",
    rate: "$75+/booking",
    desc: "Top 10% of creators",
    current: false,
  },
  {
    icon: "★",
    label: "Diamond",
    rate: "Retainer + equity",
    desc: "Elite — $85+/booking + retainer",
    current: false,
  },
];

const EMPTY: Fields = {
  email: "",
  password: "",
  confirm: "",
  city: "",
  instagram: "",
  niches: [],
};

/* ── Helpers ─────────────────────────────────────────────── */

function getPasswordStrength(pwd: string): "weak" | "fair" | "strong" | null {
  if (!pwd) return null;
  const score = [
    pwd.length >= 8,
    /\d/.test(pwd),
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
  ].filter(Boolean).length;
  if (score < 2) return "weak";
  if (score === 2) return "fair";
  return "strong";
}

function sanitizeError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong. Please try again.";
  const msg = err.message.toLowerCase();
  if (
    msg.includes("already registered") ||
    msg.includes("user already exists") ||
    msg.includes("duplicate")
  )
    return "That email is already registered with Push. Just log in to access your account.";
  if (
    msg.includes("password") &&
    (msg.includes("short") || msg.includes("weak"))
  )
    return "Need at least 8 characters. Try a mix of letters, numbers, and symbols.";
  if (msg.includes("invalid email") || msg.includes("email"))
    return "Please enter a valid email address.";
  return err.message;
}

/* ── Page component ──────────────────────────────────────── */

export default function CreatorSignupPage() {
  const router = useRouter();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(
    {},
  );
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof Omit<Fields, "niches">, boolean>>
  >({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [stepTransition, setStepTransition] = useState(false);

  useEffect(() => {
    track("signup_started");
  }, []);

  /* ── Field helpers ─────────────────────────────────────── */

  const set =
    (k: keyof Omit<Fields, "niches">) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));

  function toggleNiche(niche: string) {
    setFields((f) => ({
      ...f,
      niches: f.niches.includes(niche)
        ? f.niches.filter((n) => n !== niche)
        : [...f.niches, niche],
    }));
  }

  function handleBlur(k: keyof Omit<Fields, "niches">) {
    setTouched((t) => ({ ...t, [k]: true }));
    const v = fields[k] as string;
    let ok = false;
    if (k === "email") ok = /\S+@\S+\.\S+/.test(v) && v.trim().length > 0;
    else if (k === "password") ok = v.length >= 8;
    else if (k === "confirm") ok = v === fields.password && v.length > 0;
    else ok = true;
    setFieldStatus((p) => ({ ...p, [k]: ok ? "valid" : "error" }));
  }

  /* ── Step validation ───────────────────────────────────── */

  function validateStep1(): boolean {
    const errs: Partial<Record<keyof Fields, string>> = {};
    if (!fields.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      errs.email = "Please enter a valid email address.";
    if (fields.password.length < 8)
      errs.password = "Need at least 8 characters for security.";
    if (fields.confirm !== fields.password)
      errs.confirm = "Passwords don't match — double-check and try again.";
    setErrors(errs);
    setTouched({ email: true, password: true, confirm: true });
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    // All step 2 fields are optional — just proceed
    return true;
  }

  /* ── Step transitions ──────────────────────────────────── */

  function goToStep(next: Step) {
    setStepTransition(true);
    setTimeout(() => {
      setStep(next);
      setStepTransition(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 180);
  }

  function handleNext() {
    setFormError("");
    if (step === 1) {
      if (!validateStep1()) return;
      track("signup_step1_complete");
      goToStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      track("signup_step2_complete");
      goToStep(3);
    }
  }

  function handleBack() {
    if (step > 1) goToStep((step - 1) as Step);
  }

  /* ── Final submit ──────────────────────────────────────── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!termsAgreed) {
      setTermsError("Please agree to the Terms & Privacy Policy to continue.");
      return;
    }
    setTermsError("");
    track("signup_submitted");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: fields.email.trim(),
        password: fields.password,
        options: {
          data: {
            role: "creator",
            city: fields.city.trim() || null,
            instagram: fields.instagram.trim() || null,
            niches: fields.niches,
          },
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error("Signup failed — no user returned");

      const { error: profileError } = await supabase.from("creators").insert({
        user_id: data.user.id,
        city: fields.city.trim() || null,
        instagram_handle: fields.instagram.trim() || null,
        niches: fields.niches,
      });
      if (profileError) throw profileError;

      track("signup_success", { hasSession: !!data.session });
      if (data.session) {
        router.push("/explore");
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
    } finally {
      setLoading(false);
    }
  }

  const pwStrength = getPasswordStrength(fields.password);

  /* ── Success state ───────────────────────────────────────── */

  if (success) {
    return (
      <div className="page">
        <BrandPanel step={step} />
        <div className="form-panel">
          <div className="form-wrap">
            <div className="form-success" role="status" aria-live="polite">
              <div className="success-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke="var(--tertiary)"
                    strokeWidth="2"
                  />
                  <path
                    d="M14 24L21 31L34 17"
                    stroke="var(--tertiary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="check-path"
                  />
                </svg>
              </div>
              <h2 className="success-heading">You&rsquo;re in!</h2>
              <p className="success-body">
                We sent a magic link to <strong>{fields.email}</strong>. Your
                first campaign match lands within 24h.
              </p>
              <Link href="/explore" className="btn btn-primary success-cta">
                Explore campaigns →
              </Link>
            </div>
            <p className="form-footer">
              Wrong email? <Link href="/creator/signup">Start over</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ───────────────────────────────────────────── */

  return (
    <>
      <a href="#signup-form" className="skip-link">
        Skip to form
      </a>
      <div className="page">
        <BrandPanel step={step} />
        <div className="form-panel">
          <div className="form-wrap" id="signup-form">
            {/* ── Step indicator ─────────────────────────── */}
            <StepIndicator current={step} total={3} />

            {/* ── Form header ────────────────────────────── */}
            <div className="form-header">
              <span className="form-eyebrow">JOIN PUSH — STEP {step} OF 3</span>
              <h1 className="form-title">
                {step === 1 && "Create your account."}
                {step === 2 && "Build your profile."}
                {step === 3 && "Your journey starts at Clay."}
              </h1>
              <p className="form-subtitle">
                {step === 1 &&
                  "Free to join · No follower minimum · No exclusivity."}
                {step === 2 &&
                  "Help us match you with the right campaigns. All optional."}
                {step === 3 &&
                  "Every creator starts at Clay. Here's how you level up."}
              </p>
            </div>

            {/* ── Global form error ──────────────────────── */}
            {formError && (
              <div
                className="form-error"
                role="alert"
                style={{ marginBottom: "var(--space-4)" }}
              >
                <span>{formError}</span>
                <button
                  type="button"
                  className="error-retry-btn"
                  onClick={() => setFormError("")}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* ── Step content ───────────────────────────── */}
            <div
              className={`step-content${stepTransition ? " step-content--exit" : ""}`}
            >
              {/* ─── STEP 1: Basic account info ─────────── */}
              {step === 1 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  noValidate
                >
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="email">Email</label>
                      <div className="field-wrap">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={fields.email}
                          onChange={set("email")}
                          onBlur={() => handleBlur("email")}
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                          aria-describedby={
                            errors.email ? "err-email" : undefined
                          }
                        />
                        {fieldStatus.email === "valid" && (
                          <span className="field-dot" aria-hidden="true" />
                        )}
                      </div>
                      {errors.email && touched.email && (
                        <span className="error-msg" id="err-email">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="password">Password</label>
                      <div className="input-with-action">
                        <input
                          id="password"
                          name="password"
                          type={showPw ? "text" : "password"}
                          value={fields.password}
                          onChange={set("password")}
                          onBlur={() => handleBlur("password")}
                          placeholder="Min 8 characters"
                          autoComplete="new-password"
                          required
                          aria-describedby={
                            errors.password
                              ? "err-password"
                              : fields.password
                                ? "pw-strength"
                                : undefined
                          }
                        />
                        <button
                          type="button"
                          className="input-action-btn"
                          onClick={() => setShowPw((v) => !v)}
                          aria-label={
                            showPw ? "Hide password" : "Show password"
                          }
                        >
                          {showPw ? "Hide" : "Show"}
                        </button>
                      </div>
                      {fields.password && pwStrength && (
                        <div
                          className="pw-strength"
                          id="pw-strength"
                          aria-live="polite"
                        >
                          <div className="pw-bar">
                            <div className={`pw-fill pw-fill--${pwStrength}`} />
                          </div>
                          <span className={`pw-label pw-label--${pwStrength}`}>
                            {pwStrength === "weak"
                              ? "Weak"
                              : pwStrength === "fair"
                                ? "Fair"
                                : "Strong — good to go"}
                          </span>
                        </div>
                      )}
                      {errors.password && touched.password && (
                        <span className="error-msg" id="err-password">
                          {errors.password}
                        </span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="confirm">Confirm Password</label>
                      <div className="input-with-action">
                        <input
                          id="confirm"
                          name="confirm"
                          type={showConfirm ? "text" : "password"}
                          value={fields.confirm}
                          onChange={set("confirm")}
                          onBlur={() => handleBlur("confirm")}
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          required
                          aria-describedby={
                            errors.confirm ? "err-confirm" : undefined
                          }
                        />
                        <button
                          type="button"
                          className="input-action-btn"
                          onClick={() => setShowConfirm((v) => !v)}
                          aria-label={
                            showConfirm
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirm ? "Hide" : "Show"}
                        </button>
                      </div>
                      {errors.confirm && touched.confirm && (
                        <span className="error-msg" id="err-confirm">
                          {errors.confirm}
                        </span>
                      )}
                    </div>

                    <p className="trust-line">
                      Free to join · No follower minimum · 200+ local campaigns
                    </p>

                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                    >
                      Continue →
                    </button>
                  </div>
                </form>
              )}

              {/* ─── STEP 2: Creator profile ────────────── */}
              {step === 2 && (
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="city">
                      City / Neighborhood{" "}
                      <span className="label-optional">(optional)</span>
                    </label>
                    <div className="field-wrap">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={fields.city}
                        onChange={set("city")}
                        placeholder="e.g. Williamsburg, Brooklyn"
                        autoComplete="address-level2"
                      />
                      {fields.city.length > 0 && (
                        <span className="field-dot" aria-hidden="true" />
                      )}
                    </div>
                    <span className="field-hint">
                      We match campaigns by neighborhood — more specific =
                      better matches.
                    </span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="instagram">
                      Instagram Handle{" "}
                      <span className="label-optional">(optional)</span>
                    </label>
                    <div className="field-wrap field-wrap--prefix">
                      <span className="field-prefix" aria-hidden="true">
                        @
                      </span>
                      <input
                        id="instagram"
                        name="instagram"
                        type="text"
                        value={fields.instagram}
                        onChange={set("instagram")}
                        placeholder="yourhandle"
                        autoComplete="username"
                        style={{ paddingLeft: "28px" }}
                      />
                    </div>
                    <span className="field-hint">
                      Brands browse creator profiles — adding yours helps you
                      get discovered.
                    </span>
                  </div>

                  <div className="form-field">
                    <label>
                      Content Niches{" "}
                      <span className="label-optional">
                        (pick any that fit)
                      </span>
                    </label>
                    <div
                      className="niche-chips"
                      role="group"
                      aria-label="Select content niches"
                    >
                      {NICHE_OPTIONS.map((niche) => (
                        <button
                          key={niche}
                          type="button"
                          className={`niche-chip filter-chip${
                            fields.niches.includes(niche)
                              ? " niche-chip--active"
                              : ""
                          }`}
                          onClick={() => toggleNiche(niche)}
                          aria-pressed={fields.niches.includes(niche)}
                        >
                          {niche}
                        </button>
                      ))}
                    </div>
                    <span className="field-hint">
                      Helps us surface campaigns you'll actually enjoy creating.
                    </span>
                  </div>

                  <div className="step-nav">
                    <button
                      type="button"
                      className="btn btn-ghost back-btn"
                      onClick={handleBack}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary submit-btn submit-btn--flex"
                      onClick={handleNext}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: Tier preview + submit ──────── */}
              {step === 3 && (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-grid">
                    {/* Tier journey */}
                    <div className="tier-journey">
                      {TIERS.map((tier, i) => (
                        <div
                          key={tier.label}
                          className={`tier-row${tier.current ? " tier-row--current" : ""}${
                            i > 0 ? " tier-row--locked" : ""
                          }`}
                        >
                          <div className="tier-row-icon" aria-hidden="true">
                            {tier.icon}
                          </div>
                          <div className="tier-row-body">
                            <div className="tier-row-top">
                              <span className="tier-row-name">
                                {tier.label}
                              </span>
                              <span className="tier-row-rate">{tier.rate}</span>
                            </div>
                            <span className="tier-row-desc">{tier.desc}</span>
                          </div>
                          {tier.current && (
                            <span
                              className="tier-row-you"
                              aria-label="You start here"
                            >
                              YOU START HERE
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="tier-upgrade-hint">
                      Tier upgrades automatically as you complete campaigns and
                      earn reviews. Top creators reach{" "}
                      <strong style={{ color: "var(--champagne)" }}>
                        $85+/booking
                      </strong>{" "}
                      within 90 days.
                    </p>

                    {/* Terms */}
                    <div className="form-field terms-field">
                      <label className="terms-label">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={termsAgreed}
                          onChange={(e) => {
                            setTermsAgreed(e.target.checked);
                            if (e.target.checked) setTermsError("");
                          }}
                          required
                        />
                        <span>
                          I agree to the{" "}
                          <Link href="/terms" target="_blank">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" target="_blank">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {termsError && (
                        <span className="error-msg">{termsError}</span>
                      )}
                    </div>

                    <div className="step-nav">
                      <button
                        type="button"
                        className="btn btn-ghost back-btn"
                        onClick={handleBack}
                        disabled={loading}
                      >
                        ← Back
                      </button>
                      <button
                        ref={submitBtnRef}
                        type="submit"
                        className="btn btn-primary submit-btn submit-btn--flex"
                        disabled={loading}
                        aria-busy={loading}
                      >
                        {loading ? (
                          <>
                            <span className="loader-dots" aria-hidden="true">
                              <span className="dot" />
                              <span className="dot" />
                              <span className="dot" />
                            </span>
                            <span className="sr-only">Creating account…</span>
                          </>
                        ) : (
                          "Join Push →"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* ── Footer ─────────────────────────────────── */}
            <p className="form-footer">
              Already have an account?{" "}
              <Link href="/creator/login">Sign in &rarr;</Link>
              <br />
              Want to list your business?{" "}
              <Link href="/merchant/signup">Merchant signup &rarr;</Link>
            </p>

            <Link href="/demo/creator" className="auth-demo-link">
              Try Demo Mode &mdash; no account needed &rarr;
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Step Indicator ──────────────────────────────────────── */

function StepIndicator({ current, total }: { current: Step; total: number }) {
  const labels = ["Account", "Profile", "Tiers"];
  return (
    <div className="step-indicator" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const n = (i + 1) as Step;
        const state =
          n < current ? "done" : n === current ? "active" : "pending";
        return (
          <div
            key={n}
            className={`step-indicator__item step-indicator__item--${state}`}
          >
            <div className="step-indicator__dot" aria-hidden="true">
              {state === "done" ? "✓" : n}
            </div>
            <span className="step-indicator__label">{labels[i]}</span>
            {i < total - 1 && (
              <div
                className={`step-indicator__line${state === "done" ? " step-indicator__line--done" : ""}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Brand panel ─────────────────────────────────────────── */

function BrandPanel({ step }: { step: Step }) {
  return (
    <div className="brand-panel signup-brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Start Earning
            <br />
            Today.
          </h2>
          <p
            className="brand-earning-tag"
            aria-label="Earn $15 to $85 per customer"
          >
            <span className="brand-earning-amount">$15–$85</span>
            <span className="brand-earning-unit">/customer</span>
          </p>
          <p className="brand-tagline">
            Push connects micro-creators like you with local businesses that
            need real foot traffic. Visit, post, earn &mdash; and build a score
            that unlocks better campaigns.
          </p>
        </div>

        {/* Social proof — changes by step */}
        <div className="editorial-stat">
          {step === 1 && (
            <>
              <span className="editorial-stat-number">14</span>
              <p className="editorial-stat-label">
                creators joined Williamsburg this week
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <span className="editorial-stat-number">200+</span>
              <p className="editorial-stat-label">
                active campaigns waiting for creators like you
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <span className="editorial-stat-number">90</span>
              <p className="editorial-stat-label">
                days to reach Gold tier — $55+/booking
              </p>
            </>
          )}
        </div>
      </div>

      <Link href="/" className="brand-back">
        &larr; Back to home
      </Link>
    </div>
  );
}
