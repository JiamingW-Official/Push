"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
import "@/styles/auth-split.css";
import "./signup.css";

type Goal = "customers" | "awareness" | "event";

type Field = {
  email: string;
  password: string;
  businessName: string;
  address: string;
  contactEmail: string;
  instagram: string;
};

type FieldStatus = Partial<Record<keyof Field, "valid" | "error">>;

const EMPTY: Field = {
  email: "",
  password: "",
  businessName: "",
  address: "",
  contactEmail: "",
  instagram: "",
};

/* ── Goal SVG icons ──────────────────────────────────────── */
const GoalIcon: Record<Goal, React.ReactNode> = {
  customers: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 14L14 4M14 4H8M14 4V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  awareness: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  ),
  event: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2.5L17 15.5H3L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const GOALS: { id: Goal; label: string; desc: string; number: string }[] = [
  {
    id: "customers",
    label: "Fill Seats",
    desc: "Get locals through the door this week",
    number: "01",
  },
  {
    id: "awareness",
    label: "Get Discovered",
    desc: "Show up in feeds of people who live nearby",
    number: "02",
  },
  {
    id: "event",
    label: "Sell Out the Launch",
    desc: "Event, new menu, or drop — creators amplify your moment",
    number: "03",
  },
];

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

export default function MerchantSignupPage() {
  const router = useRouter();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [fields, setFields] = useState<Field>(EMPTY);
  const [goal, setGoal] = useState<Goal>("customers");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<Field>>({});
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const goalRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-redirect after success email confirmation sent
  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          router.push("/merchant/dashboard");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [success, router]);

  const set = (k: keyof Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  function handleBlur(k: keyof Field) {
    const v = fields[k];
    let ok = false;
    if (k === "businessName") ok = v.trim().length > 0;
    else if (k === "address") ok = v.trim().length > 0;
    else if (k === "email") ok = /\S+@\S+\.\S+/.test(v) && v.trim().length > 0;
    else if (k === "password") ok = v.length >= 8;
    else if (k === "contactEmail") ok = !v || /\S+@\S+\.\S+/.test(v);
    else ok = true;
    setFieldStatus((p) => ({
      ...p,
      [k]: ok ? "valid" : errors[k] ? "error" : undefined,
    }));
  }

  function validate(): boolean {
    const errs: Partial<Field> = {};
    if (!fields.businessName.trim())
      errs.businessName =
        "Can't skip this — we need your business name to match creators.";
    if (!fields.address.trim())
      errs.address =
        "Can't skip this — we need your address to find nearby creators.";
    if (!fields.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      errs.email = "Please enter a valid email address.";
    if (fields.password.length < 8)
      errs.password = "Need at least 8 characters for security.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleGoalKey(e: React.KeyboardEvent, i: number) {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (i + 1) % GOALS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (i - 1 + GOALS.length) % GOALS.length;
    }
    if (next !== i) {
      setGoal(GOALS[next].id);
      goalRefs.current[next]?.focus();
    }
  }

  function handleRetry() {
    setFormError("");
    submitBtnRef.current?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsPressed(true);
    if (!validate()) {
      setIsPressed(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: fields.email.trim(),
        password: fields.password,
        options: { data: { role: "merchant" } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed — no user returned");

      const { error: profileError } = await supabase.from("merchants").insert({
        user_id: authData.user.id,
        business_name: fields.businessName.trim(),
        address: fields.address.trim(),
        contact_email: fields.contactEmail.trim() || fields.email.trim(),
        instagram: fields.instagram.trim().replace(/^@+/, "") || null,
        goal,
      });
      if (profileError) throw profileError;

      if (authData.session) {
        router.push("/merchant/dashboard");
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
      setIsPressed(false);
    } finally {
      setLoading(false);
    }
  }

  const pwStrength = getPasswordStrength(fields.password);

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
              <h2 className="success-heading">Check Your Email</h2>
              <p className="success-body">
                We sent a confirmation link to <strong>{fields.email}</strong>.
                Click it to log in and see creators already in your
                neighbourhood. Check Promotions or Spam if it&apos;s not there
                within 2 minutes.
              </p>
              <p className="success-redirect">
                Redirecting in {countdown}s&hellip;
              </p>
            </div>
            <p className="form-footer">
              Wrong email? <Link href="/merchant/signup">Start over</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="fomo-badge">32 merchants joined this week</span>
              <span className="form-eyebrow">Merchant Signup</span>
              <h1 className="form-title">Pay Only for Customers Who Walk In</h1>
              <p className="form-subtitle">
                Every creator includes a QR code. You see exactly who converts —
                before paying commission.
              </p>
            </div>

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
                  onClick={handleRetry}
                >
                  Try again
                </button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className={loading ? "form-loading" : ""}
            >
              <div className="form-grid">
                {/* ── Business ─────────────────────────────── */}
                <div className="form-divider">
                  <span className="form-divider-line" />
                  <span className="form-divider-label">Your Business</span>
                  <span className="form-divider-line" />
                </div>

                <div className="form-field">
                  <label htmlFor="businessName">Business Name</label>
                  <div className="field-wrap">
                    <input
                      id="businessName"
                      type="text"
                      value={fields.businessName}
                      onChange={set("businessName")}
                      onBlur={() => handleBlur("businessName")}
                      placeholder="e.g. Blue Bottle Coffee Williamsburg"
                      autoComplete="organization"
                      aria-describedby={
                        errors.businessName ? "err-businessName" : undefined
                      }
                    />
                    {fieldStatus.businessName === "valid" && (
                      <span className="field-dot" aria-hidden="true" />
                    )}
                  </div>
                  {errors.businessName && (
                    <span className="error-msg" id="err-businessName">
                      {errors.businessName}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="address">Business Address</label>
                  <div className="field-wrap">
                    <input
                      id="address"
                      type="text"
                      value={fields.address}
                      onChange={set("address")}
                      onBlur={() => handleBlur("address")}
                      placeholder="123 Main St, City, State"
                      autoComplete="street-address"
                      aria-describedby={
                        errors.address ? "err-address" : undefined
                      }
                    />
                    {fieldStatus.address === "valid" && (
                      <span className="field-dot" aria-hidden="true" />
                    )}
                  </div>
                  {errors.address && (
                    <span className="error-msg" id="err-address">
                      {errors.address}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contactEmail">
                      Notifications Email{" "}
                      <span className="label-optional">(optional)</span>
                    </label>
                    <div className="field-wrap">
                      <input
                        id="contactEmail"
                        type="email"
                        value={fields.contactEmail}
                        onChange={set("contactEmail")}
                        onBlur={() => handleBlur("contactEmail")}
                        placeholder="ops@yourbusiness.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="instagram">
                      Instagram{" "}
                      <span className="label-optional">(optional)</span>
                    </label>
                    <div className="field-wrap">
                      <input
                        id="instagram"
                        type="text"
                        value={fields.instagram}
                        onChange={set("instagram")}
                        onBlur={() => handleBlur("instagram")}
                        placeholder="@yourbusiness"
                      />
                    </div>
                    <span className="field-hint">
                      Matches you with creators in your niche. Read-only — we
                      never post, change anything, or sell access.
                    </span>
                  </div>
                </div>

                {/* ── Goal ─────────────────────────────────── */}
                <div className="form-divider">
                  <span className="form-divider-line" />
                  <span className="form-divider-label">Primary Goal</span>
                  <span className="form-divider-line" />
                </div>

                <div
                  className="goal-cards"
                  role="radiogroup"
                  aria-label="Primary campaign goal"
                >
                  {GOALS.map((g, i) => (
                    <button
                      key={g.id}
                      ref={(el) => {
                        goalRefs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={goal === g.id}
                      tabIndex={goal === g.id ? 0 : -1}
                      className={`goal-card ${goal === g.id ? "goal-card--active" : ""}`}
                      data-number={g.number}
                      onClick={() => setGoal(g.id)}
                      onKeyDown={(e) => handleGoalKey(e, i)}
                    >
                      <span className="goal-icon" aria-hidden="true">
                        {GoalIcon[g.id]}
                      </span>
                      <span className="goal-label">{g.label}</span>
                      <span className="goal-desc">{g.desc}</span>
                    </button>
                  ))}
                </div>

                {/* ── Account ──────────────────────────────── */}
                <div className="form-divider">
                  <span className="form-divider-line" />
                  <span className="form-divider-label">Create Account</span>
                  <span className="form-divider-line" />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <div className="field-wrap">
                    <input
                      id="email"
                      type="email"
                      value={fields.email}
                      onChange={set("email")}
                      onBlur={() => handleBlur("email")}
                      placeholder="you@yourbusiness.com"
                      autoComplete="email"
                      aria-describedby={errors.email ? "err-email" : undefined}
                    />
                    {fieldStatus.email === "valid" && (
                      <span className="field-dot" aria-hidden="true" />
                    )}
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
                      value={fields.password}
                      onChange={set("password")}
                      onBlur={() => handleBlur("password")}
                      placeholder="Min 8 characters"
                      autoComplete="new-password"
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
                      aria-label={showPw ? "Hide password" : "Show password"}
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
                  {errors.password && (
                    <span className="error-msg" id="err-password">
                      {errors.password}
                    </span>
                  )}
                  <span className="security-note">
                    Encrypted with industry-standard security
                  </span>
                </div>

                <p className="trust-line">
                  Pay only for verified foot traffic · No contracts · 200+ NYC
                  spots
                </p>

                <button
                  ref={submitBtnRef}
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={loading}
                  aria-busy={loading}
                  data-pressed={isPressed}
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
                    "Verify & Launch"
                  )}
                </button>
              </div>
            </form>

            <p className="form-footer">
              Already signed up? <Link href="/merchant/dashboard">Log in</Link>
              <br />
              Are you a creator?{" "}
              <Link href="/creator/signup">Creator signup →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function BrandPanel() {
  return (
    <div className="brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Real foot traffic,
            <br />
            not <em>guesses.</em>
          </h2>
          <p className="brand-tagline">
            Push gives you transaction-level attribution via QR codes. Know
            exactly which creator drove which customer — and pay only for what
            works.
          </p>
          <blockquote className="brand-quote">
            &ldquo;Push transformed how we track marketing. Now we actually know
            our ROI.&rdquo;
            <cite> — Sarah Chen, Café Owner</cite>
          </blockquote>
        </div>

        <div className="brand-stats">
          {[
            { label: "Monthly cost", value: "$19.99 / mo", pct: 10 },
            { label: "Median creator ROI", value: "35% margin", pct: 35 },
            { label: "How we track", value: "QR per creator", pct: 100 },
          ].map((s) => (
            <div key={s.label} className="stat-bar">
              <span className="stat-bar-label">{s.label}</span>
              <div className="stat-bar-track">
                <div className="stat-bar-fill" style={{ width: `${s.pct}%` }} />
              </div>
              <span className="stat-bar-value">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <Link href="/" className="brand-back">
        ← Back to home
      </Link>
    </div>
  );
}
