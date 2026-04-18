"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import "@/styles/auth-split.css";
import "./signup.css";

/* ── Types ───────────────────────────────────────────────── */

type Vertical = "coffee" | "coffee-plus" | "dessert" | "fitness" | "beauty";

type TeamSize = "1" | "2-5" | "6-15" | "16+";

type GoalTier = "10" | "20" | "50" | "custom";

type StepKey = 1 | 2 | 3;

type Account = {
  email: string;
  password: string;
  confirm: string;
};

type Business = {
  businessName: string;
  instagram: string;
  mapsUrl: string;
  vertical: Vertical | "";
  zip: string;
  teamSize: TeamSize | "";
};

type Verify = {
  phone: string;
  goal: GoalTier | "";
  goalCustom: string;
};

/* ── Constants ───────────────────────────────────────────── */

/** Williamsburg ZIP range for ICP auto-match. */
const WILLIAMSBURG_ZIPS = new Set(["11211", "11206", "11249"]);

const VERTICALS: { id: Vertical; label: string; hint: string }[] = [
  {
    id: "coffee-plus",
    label: "Coffee+ (beachhead)",
    hint: "AOV $8-20 — our current focus",
  },
  { id: "coffee", label: "Coffee (classic)", hint: "Espresso-only, AOV <$8" },
  { id: "dessert", label: "Dessert / Bakery", hint: "Waitlist — Q3 2026" },
  { id: "fitness", label: "Fitness / Wellness", hint: "Waitlist — Q4 2026" },
  { id: "beauty", label: "Beauty / Salon", hint: "Waitlist — Q4 2026" },
];

const TEAM_SIZES: { id: TeamSize; label: string }[] = [
  { id: "1", label: "Just me (1)" },
  { id: "2-5", label: "Small (2–5)" },
  { id: "6-15", label: "Mid (6–15)" },
  { id: "16+", label: "Multi-location (16+)" },
];

const GOAL_TIERS: { id: GoalTier; label: string; hint: string }[] = [
  { id: "10", label: "~10 customers / mo", hint: "Pilot test drive" },
  { id: "20", label: "~20 customers / mo", hint: "Steady trickle" },
  { id: "50", label: "~50 customers / mo", hint: "Rush-hour filler" },
  { id: "custom", label: "Custom target", hint: "Tell us below" },
];

const COHORT_MERCHANTS = [
  "Sey Coffee",
  "Devoción",
  "Partners Coffee",
  "Variety Coffee",
  "Bakeri",
];

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
    return "That email is already set up with Push. Just log in to access your campaigns.";
  if (
    msg.includes("password") &&
    (msg.includes("short") || msg.includes("weak"))
  )
    return "Need at least 8 characters. Try a mix of numbers and letters.";
  if (msg.includes("invalid email") || msg.includes("email"))
    return "Please enter a valid email address.";
  return err.message;
}

function isPilotEligible(vertical: Business["vertical"], zip: string): boolean {
  return vertical === "coffee-plus" && WILLIAMSBURG_ZIPS.has(zip.trim());
}

/* ── Page component ──────────────────────────────────────── */

export default function MerchantSignupPage() {
  const router = useRouter();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState<StepKey>(1);
  const [account, setAccount] = useState<Account>({
    email: "",
    password: "",
    confirm: "",
  });
  const [business, setBusiness] = useState<Business>({
    businessName: "",
    instagram: "",
    mapsUrl: "",
    vertical: "",
    zip: "",
    teamSize: "",
  });
  const [verify, setVerify] = useState<Verify>({
    phone: "",
    goal: "",
    goalCustom: "",
  });

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const pwStrength = getPasswordStrength(account.password);
  const pilotEligible = isPilotEligible(business.vertical, business.zip);
  const showIcpBanner =
    (step === 2 || step === 3) &&
    business.vertical &&
    business.zip &&
    !pilotEligible;

  /* ── Step 1 validation / submit (creates auth user) ──────── */
  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!account.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(account.email))
      errs.email = "Please enter a valid email address.";
    if (account.password.length < 8)
      errs.password = "Need at least 8 characters for security.";
    if (account.confirm !== account.password)
      errs.confirm = "Passwords don't match — double-check and try again.";
    if (!termsAgreed)
      errs.terms = "Please agree to the Terms & Privacy Policy to continue.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsPressed(true);
    if (!validateStep1()) {
      setIsPressed(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: account.email.trim(),
        password: account.password,
        options: { data: { role: "merchant" } },
      });
      if (error) throw error;
      if (!data.user) throw new Error("Signup failed — no user returned");
      setUserId(data.user.id);
      setStep(2);
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
    } finally {
      setLoading(false);
      setIsPressed(false);
    }
  }

  /* ── Step 2 validation / submit (saves business profile) ─ */
  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (!business.businessName.trim())
      errs.businessName =
        "Your business name matches you with nearby creators.";
    if (!business.mapsUrl.trim())
      errs.mapsUrl = "A Google Maps URL locks in your address for attribution.";
    if (!business.vertical)
      errs.vertical = "Pick your category so we can price you correctly.";
    if (!business.zip.trim()) errs.zip = "ZIP routes you to the right cohort.";
    else if (!/^\d{5}$/.test(business.zip.trim()))
      errs.zip = "5-digit US ZIP, please.";
    if (!business.teamSize)
      errs.teamSize = "Team size helps us pace onboarding.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submitStep2(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsPressed(true);
    if (!validateStep2()) {
      setIsPressed(false);
      return;
    }
    setLoading(true);
    try {
      // Best-effort profile save — don't block flow if schema differs.
      try {
        const supabase = createClient();
        await supabase.from("merchants").insert({
          user_id: userId,
          business_name: business.businessName.trim(),
          instagram: business.instagram.trim().replace(/^@+/, "") || null,
          maps_url: business.mapsUrl.trim(),
          vertical: business.vertical,
          zip: business.zip.trim(),
          team_size: business.teamSize,
        });
      } catch {
        /* schema mismatch — ignore and continue */
      }
      setStep(3);
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
    } finally {
      setLoading(false);
      setIsPressed(false);
    }
  }

  /* ── Step 3 validation / finalize ────────────────────────── */
  function validateStep3(): boolean {
    const errs: Record<string, string> = {};
    if (!verify.phone.trim())
      errs.phone = "We send SMS for campaign alerts only — no spam.";
    else if (verify.phone.replace(/\D/g, "").length < 10)
      errs.phone = "Please enter a valid phone number.";
    if (!verify.goal) errs.goal = "Pick a monthly customer target.";
    if (verify.goal === "custom" && !verify.goalCustom.trim())
      errs.goalCustom = "Tell us your target so we can size the campaign.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submitStep3(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsPressed(true);
    if (!validateStep3()) {
      setIsPressed(false);
      return;
    }
    setLoading(true);
    try {
      // Best-effort final profile update — don't block if schema drifts.
      try {
        const supabase = createClient();
        await supabase
          .from("merchants")
          .update({
            phone: verify.phone.trim(),
            monthly_goal:
              verify.goal === "custom" ? verify.goalCustom.trim() : verify.goal,
            plan_recommended: pilotEligible ? "pilot" : "operator",
          })
          .eq("user_id", userId);
      } catch {
        /* schema mismatch — ignore */
      }
      // If session exists (magic link dev), route straight to onboarding;
      // otherwise show email-verify panel.
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/merchant/onboarding");
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
    } finally {
      setLoading(false);
      setIsPressed(false);
    }
  }

  /* ── Success panel ──────────────────────────────────────── */
  if (success) {
    return (
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap">
            <div className="form-success" role="status" aria-live="polite">
              <div className="success-check" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
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
              <h2 className="success-heading">You&rsquo;re in the queue.</h2>
              <p className="success-body">
                We sent a confirmation link to <strong>{account.email}</strong>.
                Click it to unlock your Williamsburg Coffee+ cohort slot. Check
                Promotions or Spam if it&apos;s not there in 2 minutes.
              </p>
              <ul className="merchant-success-steps">
                <li>
                  <span className="merchant-success-n">01</span>
                  Verify your email (2 min)
                </li>
                <li>
                  <span className="merchant-success-n">02</span>
                  Complete onboarding — store hours, menu, QR (~5 min)
                </li>
                <li>
                  <span className="merchant-success-n">03</span>
                  Launch your first ConversionOracle campaign
                </li>
              </ul>
              <p className="form-footer">
                Wrong email? <Link href="/merchant/signup">Start over</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Stepper ─────────────────────────────────────────────── */
  const stepLabels = ["Account", "Business", "Verify + Goals"];

  return (
    <>
      <a href="#signup-form" className="skip-link">
        Skip to form
      </a>
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap" id="signup-form">
            <div className="form-header">
              <span className="form-eyebrow">
                Merchant Signup · Vertical AI for Local Commerce
              </span>
              <h1 className="form-title">
                {step === 1 && "Start Your Customer Acquisition Engine"}
                {step === 2 && "Tell us about your shop."}
                {step === 3 && "Last step: SMS + monthly target."}
              </h1>
              <p className="form-subtitle">
                {step === 1 &&
                  "Every creator carries a QR code. ConversionOracle™ verifies walk-ins — you pay only for real foot traffic."}
                {step === 2 &&
                  "Maps URL + vertical + ZIP locks in your cohort fit and pricing."}
                {step === 3 &&
                  "SMS for campaign alerts only. Plan preview appears below."}
              </p>
            </div>

            {/* Stepper — reuses pilot-stepper classes from pilot.css */}
            <ol
              className="pilot-stepper merchant-stepper"
              aria-label="Signup progress"
            >
              {stepLabels.map((label, i) => {
                const n = (i + 1) as StepKey;
                const cls =
                  n === step
                    ? "pilot-step pilot-step--active"
                    : n < step
                      ? "pilot-step pilot-step--done"
                      : "pilot-step";
                return (
                  <li
                    key={label}
                    className={cls}
                    aria-current={n === step ? "step" : undefined}
                  >
                    <span className="pilot-step-n">0{n}</span>
                    <span className="pilot-step-label">{label}</span>
                  </li>
                );
              })}
            </ol>

            {showIcpBanner && (
              <div className="icp-warning" role="alert">
                <strong>Williamsburg Coffee+ is our current beachhead.</strong>
                <span>
                  Your combo doesn&rsquo;t match the 60-day pilot cohort —
                  you&rsquo;ll join the Operator queue at{" "}
                  <strong>$500/mo + $15–85/customer</strong> by vertical.
                </span>
              </div>
            )}

            {formError && (
              <div
                className="form-error"
                role="alert"
                style={{ marginBottom: "var(--space-4)" }}
              >
                <span>{formError}</span>
              </div>
            )}

            {/* STEP 1 — Account */}
            {step === 1 && (
              <form
                onSubmit={submitStep1}
                noValidate
                className={loading ? "form-loading" : ""}
              >
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <div className="field-wrap">
                      <input
                        id="email"
                        type="email"
                        value={account.email}
                        onChange={(e) =>
                          setAccount((a) => ({ ...a, email: e.target.value }))
                        }
                        placeholder="you@yourbusiness.com"
                        autoComplete="email"
                        required
                        aria-describedby={
                          errors.email ? "err-email" : undefined
                        }
                      />
                    </div>
                    {errors.email && (
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
                        type={showPw ? "text" : "password"}
                        value={account.password}
                        onChange={(e) =>
                          setAccount((a) => ({
                            ...a,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Min 8 characters"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="input-action-btn"
                        onClick={() => setShowPw((v) => !v)}
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                    {account.password && pwStrength && (
                      <div className="pw-strength" aria-live="polite">
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
                    {errors.password && (
                      <span className="error-msg">{errors.password}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="confirm">Confirm password</label>
                    <div className="input-with-action">
                      <input
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        value={account.confirm}
                        onChange={(e) =>
                          setAccount((a) => ({ ...a, confirm: e.target.value }))
                        }
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        required
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
                    {errors.confirm && (
                      <span className="error-msg">{errors.confirm}</span>
                    )}
                  </div>

                  <div className="form-field terms-field">
                    <label className="terms-label">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
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
                        .
                      </span>
                    </label>
                    {errors.terms && (
                      <span className="error-msg">{errors.terms}</span>
                    )}
                  </div>

                  <button
                    ref={submitBtnRef}
                    type="submit"
                    className="btn btn-primary submit-btn"
                    disabled={loading}
                    aria-busy={loading}
                    data-pressed={isPressed}
                  >
                    {loading ? (
                      <span className="loader-dots" aria-hidden="true">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </span>
                    ) : (
                      "Continue \u2192"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2 — Business */}
            {step === 2 && (
              <form
                onSubmit={submitStep2}
                noValidate
                className={loading ? "form-loading" : ""}
              >
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="businessName">Business name</label>
                    <input
                      id="businessName"
                      type="text"
                      value={business.businessName}
                      onChange={(e) =>
                        setBusiness((b) => ({
                          ...b,
                          businessName: e.target.value,
                        }))
                      }
                      placeholder="e.g. Sey Coffee — Williamsburg"
                      autoComplete="organization"
                      required
                    />
                    {errors.businessName && (
                      <span className="error-msg">{errors.businessName}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="instagram">
                        Instagram handle{" "}
                        <span className="label-optional">(optional)</span>
                      </label>
                      <input
                        id="instagram"
                        type="text"
                        value={business.instagram}
                        onChange={(e) =>
                          setBusiness((b) => ({
                            ...b,
                            instagram: e.target.value,
                          }))
                        }
                        placeholder="@yourbusiness"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="mapsUrl">Google Maps URL</label>
                      <input
                        id="mapsUrl"
                        type="url"
                        value={business.mapsUrl}
                        onChange={(e) =>
                          setBusiness((b) => ({
                            ...b,
                            mapsUrl: e.target.value,
                          }))
                        }
                        placeholder="https://maps.app.goo.gl/..."
                        required
                      />
                      {errors.mapsUrl && (
                        <span className="error-msg">{errors.mapsUrl}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="vertical">Vertical</label>
                    <select
                      id="vertical"
                      className="merchant-select"
                      value={business.vertical}
                      onChange={(e) =>
                        setBusiness((b) => ({
                          ...b,
                          vertical: e.target.value as Vertical,
                        }))
                      }
                      required
                    >
                      <option value="">Pick your category…</option>
                      {VERTICALS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label} — {v.hint}
                        </option>
                      ))}
                    </select>
                    {errors.vertical && (
                      <span className="error-msg">{errors.vertical}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="zip">ZIP code</label>
                      <input
                        id="zip"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{5}"
                        maxLength={5}
                        value={business.zip}
                        onChange={(e) =>
                          setBusiness((b) => ({
                            ...b,
                            zip: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                        placeholder="11211"
                        autoComplete="postal-code"
                        required
                      />
                      {errors.zip && (
                        <span className="error-msg">{errors.zip}</span>
                      )}
                      {business.zip && WILLIAMSBURG_ZIPS.has(business.zip) && (
                        <span className="field-hint success-hint">
                          Williamsburg confirmed — cohort fit.
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      <label htmlFor="teamSize">Team size</label>
                      <select
                        id="teamSize"
                        className="merchant-select"
                        value={business.teamSize}
                        onChange={(e) =>
                          setBusiness((b) => ({
                            ...b,
                            teamSize: e.target.value as TeamSize,
                          }))
                        }
                        required
                      >
                        <option value="">Pick one…</option>
                        {TEAM_SIZES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      {errors.teamSize && (
                        <span className="error-msg">{errors.teamSize}</span>
                      )}
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setStep(1)}
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                      disabled={loading}
                      aria-busy={loading}
                      data-pressed={isPressed}
                    >
                      {loading ? (
                        <span className="loader-dots" aria-hidden="true">
                          <span className="dot" />
                          <span className="dot" />
                          <span className="dot" />
                        </span>
                      ) : (
                        "Continue \u2192"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3 — Verify + Goals */}
            {step === 3 && (
              <form
                onSubmit={submitStep3}
                noValidate
                className={loading ? "form-loading" : ""}
              >
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="phone">Phone (SMS alerts)</label>
                    <input
                      id="phone"
                      type="tel"
                      value={verify.phone}
                      onChange={(e) =>
                        setVerify((v) => ({ ...v, phone: e.target.value }))
                      }
                      placeholder="(718) 555-0199"
                      autoComplete="tel"
                      required
                    />
                    <span className="field-hint">
                      Used only for campaign launch alerts. No marketing SMS.
                    </span>
                    {errors.phone && (
                      <span className="error-msg">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="goal">Monthly customer target</label>
                    <div
                      className="goal-tier-grid"
                      role="radiogroup"
                      aria-label="Monthly customer target"
                    >
                      {GOAL_TIERS.map((t) => {
                        const active = verify.goal === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            className={`goal-tier ${active ? "goal-tier--active" : ""}`}
                            onClick={() =>
                              setVerify((v) => ({ ...v, goal: t.id }))
                            }
                          >
                            <span className="goal-tier-label">{t.label}</span>
                            <span className="goal-tier-hint">{t.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.goal && (
                      <span className="error-msg">{errors.goal}</span>
                    )}
                  </div>

                  {verify.goal === "custom" && (
                    <div className="form-field">
                      <label htmlFor="goalCustom">Your custom target</label>
                      <input
                        id="goalCustom"
                        type="text"
                        value={verify.goalCustom}
                        onChange={(e) =>
                          setVerify((v) => ({
                            ...v,
                            goalCustom: e.target.value,
                          }))
                        }
                        placeholder="e.g. 100 customers before summer"
                      />
                      {errors.goalCustom && (
                        <span className="error-msg">{errors.goalCustom}</span>
                      )}
                    </div>
                  )}

                  {/* Plan preview */}
                  <div
                    className={`plan-preview plan-preview--${pilotEligible ? "pilot" : "operator"}`}
                  >
                    <span className="plan-preview-eyebrow">
                      Recommended plan
                    </span>
                    {pilotEligible ? (
                      <>
                        <strong className="plan-preview-name">
                          Williamsburg Coffee+ Pilot — $0 for 60 days
                        </strong>
                        <p className="plan-preview-body">
                          First 10 merchants · 5 slots remain. ConversionOracle™
                          verifies every walk-in. No credit card required.
                        </p>
                        <ul className="plan-preview-terms">
                          <li>60-day exclusive window</li>
                          <li>Weekly readouts · SLR baseline tracking</li>
                          <li>Auto-convert to Operator at day 60 (opt-in)</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <strong className="plan-preview-name">
                          Operator &mdash; $500/mo min + $15&ndash;85/customer
                        </strong>
                        <p className="plan-preview-body">
                          Outside the Williamsburg Coffee+ cohort? You&rsquo;ll
                          join the Operator waitlist. Per-customer price varies
                          by vertical (coffee $15-25 · dessert $20-40 · fitness
                          $40-65 · beauty $50-85).
                        </p>
                        <ul className="plan-preview-terms">
                          <li>Retention Add-on available ($8-24/repeat)</li>
                          <li>ConversionOracle™ verification included</li>
                          <li>Queue position assigned after onboarding</li>
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setStep(2)}
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                      disabled={loading}
                      aria-busy={loading}
                      data-pressed={isPressed}
                    >
                      {loading ? (
                        <span className="loader-dots" aria-hidden="true">
                          <span className="dot" />
                          <span className="dot" />
                          <span className="dot" />
                        </span>
                      ) : pilotEligible ? (
                        "Claim Pilot Slot \u2192"
                      ) : (
                        "Join Operator Queue \u2192"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <p className="form-footer">
              Already signed up? <Link href="/merchant/login">Log in</Link>
              <br />
              Are you a creator?{" "}
              <Link href="/creator/signup">Creator signup &rarr;</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Brand panel ─────────────────────────────────────────── */

function BrandPanel() {
  return (
    <div className="brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Vertical AI for
            <br />
            <em>Local Commerce.</em>
          </h2>
          <p className="brand-tagline">
            Tell us how many customers you need. Push&rsquo;s Customer
            Acquisition Engine matches creators, verifies walk-ins via
            ConversionOracle™, and pays on outcomes.
          </p>

          <ul className="brand-bullets">
            <li>
              <span className="brand-bullet-dot" />
              Pay per verified walk-in &mdash; not per post.
            </li>
            <li>
              <span className="brand-bullet-dot" />
              ConversionOracle™ ground-truth, not attribution guesses.
            </li>
            <li>
              <span className="brand-bullet-dot" />
              DisclosureBot handles #ad compliance so creators can&rsquo;t skip
              it.
            </li>
          </ul>
        </div>

        <div className="cohort-panel">
          <span className="cohort-eyebrow">
            Williamsburg Coffee+ pilot cohort
          </span>
          <ul className="cohort-list">
            {COHORT_MERCHANTS.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="cohort-stat">
            <strong>First 10 merchants &middot; 5 slots remain.</strong>
            <span> AOV $8&ndash;20 &middot; 60-day exclusive window.</span>
          </p>
        </div>
      </div>

      <Link href="/" className="brand-back">
        &larr; Back to home
      </Link>
    </div>
  );
}
