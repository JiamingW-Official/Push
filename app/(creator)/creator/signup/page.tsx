"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
import "@/styles/auth-split.css";
import "./signup.css";

/* ── Types ───────────────────────────────────────────────── */

type Field = {
  name: string;
  location: string;
  email: string;
  password: string;
  confirm: string;
  instagram: string;
  bio: string;
};

type FieldStatus = Partial<Record<keyof Field, "valid" | "error">>;

const EMPTY: Field = {
  name: "",
  location: "",
  email: "",
  password: "",
  confirm: "",
  instagram: "",
  bio: "",
};

/* ── Tier progression data ───────────────────────────────── */

const TIERS = [
  { icon: "◎", label: "Spark", desc: "Just getting started" },
  { icon: "◈", label: "Explorer", desc: "First campaigns" },
  { icon: "◆", label: "Anchor", desc: "Regular earner" },
  { icon: "◉", label: "Amplifier", desc: "Trusted voice" },
  { icon: "◑", label: "Luminary", desc: "Top creator" },
  { icon: "★", label: "Icon", desc: "Elite tier" },
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
    if (k === "name") ok = v.trim().length > 0;
    else if (k === "location") ok = v.trim().length > 0;
    else if (k === "email") ok = /\S+@\S+\.\S+/.test(v) && v.trim().length > 0;
    else if (k === "password") ok = v.length >= 8;
    else if (k === "confirm") ok = v === fields.password && v.length > 0;
    else if (k === "instagram")
      ok = true; // optional
    else if (k === "bio")
      ok = true; // optional
    else ok = true;
    setFieldStatus((p) => ({
      ...p,
      [k]: ok ? "valid" : "error",
    }));
  }

  function validate(): boolean {
    const errs: Partial<Field> = {};
    if (!fields.name.trim())
      errs.name = "Please enter your full name so merchants know who you are.";
    if (!fields.location.trim())
      errs.location =
        "We need your city or neighbourhood to match you with local campaigns.";
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
      name: true,
      location: true,
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
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: fields.email.trim(),
        password: fields.password,
        options: { data: { role: "creator", name: fields.name } },
      });
      if (error) throw error;
      if (!data.user) throw new Error("Signup failed — no user returned");

      const { error: profileError } = await supabase.from("creators").insert({
        user_id: data.user.id,
        name: fields.name.trim(),
        location: fields.location.trim(),
        instagram_handle: fields.instagram.replace(/^@+/, "") || null,
        bio: fields.bio.trim() || null,
      });
      if (profileError) throw profileError;

      if (data.session) {
        router.push("/creator/onboarding");
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
  const bioRemaining = 160 - fields.bio.length;

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
                We sent a confirmation link to <strong>{fields.email}</strong>.
                Verify your email to get your first campaign. Check Promotions
                or Spam if it&apos;s not in your inbox within 2 minutes.
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
              <span className="form-eyebrow">Creator Signup</span>
              <h1 className="form-title">Start Earning.</h1>
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
                {/* ── Profile ──────────────────────────────── */}
                <div className="form-divider">
                  <span className="form-divider-line" />
                  <span className="form-divider-label">Your Profile</span>
                  <span className="form-divider-line" />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name">Full Name</label>
                    <div className="field-wrap">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={fields.name}
                        onChange={set("name")}
                        onBlur={() => handleBlur("name")}
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        aria-describedby={errors.name ? "err-name" : undefined}
                      />
                      {fieldStatus.name === "valid" && (
                        <span className="field-dot" aria-hidden="true" />
                      )}
                    </div>
                    {errors.name && touched.name && (
                      <span className="error-msg" id="err-name">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="location">City / Neighbourhood</label>
                    <div className="field-wrap">
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={fields.location}
                        onChange={set("location")}
                        onBlur={() => handleBlur("location")}
                        placeholder="e.g. Williamsburg, NYC"
                        autoComplete="address-level2"
                        required
                        aria-describedby={
                          errors.location ? "err-location" : undefined
                        }
                      />
                      {fieldStatus.location === "valid" && (
                        <span className="field-dot" aria-hidden="true" />
                      )}
                    </div>
                    {errors.location && touched.location && (
                      <span className="error-msg" id="err-location">
                        {errors.location}
                      </span>
                    )}
                  </div>
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

                {/* ── Creator details ───────────────────────── */}
                <div className="form-divider">
                  <span className="form-divider-line" />
                  <span className="form-divider-label">Creator Details</span>
                  <span className="form-divider-line" />
                </div>

                <div className="form-field">
                  <label htmlFor="instagram">
                    Instagram Handle{" "}
                    <span className="label-optional">(optional)</span>
                  </label>
                  <div className="field-wrap">
                    <input
                      id="instagram"
                      name="instagram"
                      type="text"
                      value={fields.instagram}
                      onChange={set("instagram")}
                      onBlur={() => handleBlur("instagram")}
                      placeholder="@yourhandle"
                    />
                    {fieldStatus.instagram === "valid" && fields.instagram && (
                      <span className="field-dot" aria-hidden="true" />
                    )}
                  </div>
                  <span className="field-hint">
                    Helps match you with the right campaigns. Read-only — we
                    never post or change anything.
                  </span>
                </div>

                <div className="form-field">
                  <label htmlFor="bio">
                    Bio <span className="label-optional">(optional)</span>
                  </label>
                  <div className="bio-wrap">
                    <textarea
                      id="bio"
                      rows={3}
                      value={fields.bio}
                      onChange={(e) => {
                        if (e.target.value.length <= 160) set("bio")(e);
                      }}
                      onBlur={() => handleBlur("bio")}
                      placeholder="Tell merchants about your content style, niche, or local area…"
                      maxLength={160}
                    />
                    <span
                      className={`bio-counter ${bioRemaining <= 20 ? "bio-counter--warn" : ""}`}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {bioRemaining}
                    </span>
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
                    "Join Push — Start Earning"
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

/* ── Signup brand panel tier data ────────────────────────── */

const SIGNUP_TIERS = [
  {
    icon: "◎",
    label: "Seed",
    rate: "Free",
    benefit: "Start free — zero followers needed",
    color: "var(--tertiary)",
  },
  {
    icon: "◈",
    label: "Explorer",
    rate: "$12/campaign",
    benefit: "$12/campaign — 2 active campaigns",
    color: "var(--surface)",
  },
  {
    icon: "◆",
    label: "Operator",
    rate: "$20 + 3%",
    benefit: "$20/campaign + 3% commission",
    color: "var(--primary)",
  },
];

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
            Join 40+ creators
            <br />
            <em>earning on Push.</em>
          </h2>
          <p className="brand-tagline">
            Push connects micro-creators like you with local businesses that
            need real foot traffic. Visit, post, earn &mdash; and build a score
            that unlocks better campaigns.
          </p>
        </div>

        {/* First 3 tier preview */}
        <div className="auth-tier-preview signup-tier-preview">
          <span className="auth-tier-preview-label">YOUR STARTING PATH</span>
          {SIGNUP_TIERS.map((t) => (
            <div key={t.label} className="auth-tier-item signup-tier-item">
              <span
                className="auth-tier-icon"
                aria-hidden="true"
                style={{ color: t.color }}
              >
                {t.icon}
              </span>
              <div className="auth-tier-info">
                <span className="auth-tier-name">{t.label}</span>
                <span className="auth-tier-benefit">{t.benefit}</span>
              </div>
              <span className="auth-tier-rate">{t.rate}</span>
            </div>
          ))}
          <p className="auth-motivation">
            Your Push Score starts building from day one.
          </p>
        </div>
      </div>

      <Link href="/" className="brand-back">
        &larr; Back to home
      </Link>
    </div>
  );
}
