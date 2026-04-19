"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import "@/styles/auth-split.css";
import "./signup.css";

/* ── Types ───────────────────────────────────────────────── */

type Field = {
  email: string;
  zip: string;
  password: string;
  confirm: string;
};

type FieldStatus = Partial<Record<keyof Field, "valid" | "error">>;

const EMPTY: Field = {
  email: "",
  zip: "",
  password: "",
  confirm: "",
};

/* ── Tier progression data ───────────────────────────────── */

const TIERS = [
  { icon: "◎", label: "Seed", desc: "Free product campaigns" },
  { icon: "◈", label: "Explorer", desc: "First campaigns — $15+/booking" },
  { icon: "◆", label: "Operator", desc: "Commission kicks in" },
  { icon: "◉", label: "Proven", desc: "Trusted local voice" },
  { icon: "◑", label: "Closer", desc: "Top 10% of creators" },
  { icon: "★", label: "Partner", desc: "Elite — retainer + equity" },
];

/* ── Eligible ZIP codes (Williamsburg Coffee+) ───────────── */

const ELIGIBLE_ZIPS = ["11211", "11206", "11249"];

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

  const [segment, setSegment] = useState<"side-income" | "professional">(
    "side-income",
  );

  useEffect(() => {
    track("signup_started");
  }, []);
  const [fields, setFields] = useState<Field>(EMPTY);
  const [errors, setErrors] = useState<Partial<Field>>({});
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof Field, boolean>>>(
    {},
  );
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const set =
    (k: keyof Field) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));

  function handleBlur(k: keyof Field) {
    setTouched((t) => ({ ...t, [k]: true }));
    const v = fields[k];
    let ok = false;
    if (k === "email") ok = /\S+@\S+\.\S+/.test(v) && v.trim().length > 0;
    else if (k === "zip") ok = /^[0-9]{5}$/.test(v);
    else if (k === "password") ok = v.length >= 8;
    else if (k === "confirm") ok = v === fields.password && v.length > 0;
    else ok = true;
    setFieldStatus((p) => ({
      ...p,
      [k]: ok ? "valid" : "error",
    }));
  }

  function validate(): boolean {
    const errs: Partial<Field> = {};
    if (!fields.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      errs.email = "Please enter a valid email address.";
    if (fields.password.length < 8)
      errs.password = "Need at least 8 characters for security.";
    if (fields.confirm !== fields.password)
      errs.confirm = "Passwords don't match — double-check and try again.";
    setErrors(errs);
    if (!termsAgreed) {
      setTermsError("Please agree to the Terms & Privacy Policy to continue.");
    } else {
      setTermsError("");
    }
    // Mark all required fields as touched
    setTouched({
      email: true,
      password: true,
      confirm: true,
    });
    return Object.keys(errs).length === 0 && termsAgreed;
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
    track("signup_submitted", { segment });
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: fields.email.trim(),
        password: fields.password,
        options: { data: { role: "creator", segment } },
      });
      if (error) throw error;
      if (!data.user) throw new Error("Signup failed — no user returned");

      const { error: profileError } = await supabase.from("creators").insert({
        user_id: data.user.id,
        zip: fields.zip.trim() || null,
      });
      if (profileError) throw profileError;

      track("signup_success", { segment, hasSession: !!data.session });
      if (data.session) {
        router.push("/explore");
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

  /* ── Segment picker (closure over segment / setSegment) ── */

  function SegmentPicker() {
    const options = [
      {
        value: "side-income" as const,
        title: "I do this on weekends",
        sub: "$15–85 / booking · Seed → Explorer",
      },
      {
        value: "professional" as const,
        title: "This is my day job",
        sub: "retainer + equity · Operator → Partner",
      },
    ];
    return (
      <div
        className="segment-picker"
        role="radiogroup"
        aria-label="Choose your creator path"
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            role="radio"
            aria-checked={segment === opt.value}
            tabIndex={0}
            className={`segment-card${segment === opt.value ? " segment-card--active" : ""}`}
            onClick={() => {
              setSegment(opt.value);
              track("segment_selected", { segment: opt.value });
            }}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                setSegment(opt.value);
                track("segment_selected", { segment: opt.value });
              }
            }}
          >
            <p className="segment-card-title">{opt.title}</p>
            <p className="segment-card-sub">{opt.sub}</p>
          </div>
        ))}
      </div>
    );
  }

  /* ── Success state ───────────────────────────────────────── */

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
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap" id="signup-form">
            <div className="form-header">
              <span className="form-eyebrow">JOIN PUSH</span>
              <h1 className="form-title">
                Get paid for walking your neighborhood in.
              </h1>
              <p className="form-subtitle">
                No follower minimum. No exclusivity. Just show up and create.
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
                {/* ── Segment picker ────────────────────────── */}
                <SegmentPicker />

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
                      name="email"
                      type="email"
                      value={fields.email}
                      onChange={set("email")}
                      onBlur={() => handleBlur("email")}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      aria-describedby={errors.email ? "err-email" : undefined}
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
                  <label htmlFor="zip">ZIP Code</label>
                  <div className="field-wrap">
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{5}"
                      maxLength={5}
                      value={fields.zip}
                      onChange={set("zip")}
                      onBlur={() => handleBlur("zip")}
                      placeholder="e.g. 11211"
                      autoComplete="postal-code"
                    />
                  </div>
                  {fields.zip.length === 5 && (
                    <span
                      className={`zip-pill${ELIGIBLE_ZIPS.includes(fields.zip) ? " zip-pill--eligible" : " zip-pill--waitlist"}`}
                    >
                      {ELIGIBLE_ZIPS.includes(fields.zip)
                        ? "✓ Williamsburg Coffee+ live"
                        : "Not live yet — join waitlist"}
                    </span>
                  )}
                </div>

                <div className="form-row">
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
                </div>

                <p className="trust-line">
                  Free to join · No follower minimum · 200+ local campaigns
                </p>

                {/* Terms consent — required before signup */}
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
                    "Create account →"
                  )}
                </button>
              </div>
            </form>

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

            {/* ── Tier journey strip ────────────────────────── */}
            <div className="tier-preview">
              <span className="tier-preview-title">YOUR JOURNEY</span>
              <div className="tier-list">
                {TIERS.map((t, i) => (
                  <div key={t.label} className="tier-item" data-index={i}>
                    <span className="tier-icon" aria-hidden="true">
                      {t.icon}
                    </span>
                    <span className="tier-label">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Brand panel ─────────────────────────────────────────── */

function BrandPanel() {
  return (
    <div className="brand-panel signup-brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Get paid for walking
            <br />
            your neighborhood
            <br />
            <em>in.</em>
          </h2>
          <p className="brand-tagline">
            Push connects micro-creators like you with local businesses that
            need real foot traffic. Visit, post, earn &mdash; and build a score
            that unlocks better campaigns.
          </p>
        </div>

        <div className="editorial-stat">
          <span className="editorial-stat-number">14</span>
          <p className="editorial-stat-label">
            creators joined Williamsburg this week
          </p>
        </div>
      </div>

      <Link href="/" className="brand-back">
        &larr; Back to home
      </Link>
    </div>
  );
}
