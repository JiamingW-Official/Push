"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import "@/styles/auth-split.css";
import "./login.css";

type LoginField = {
  email: string;
  password: string;
};

type FieldStatus = Partial<Record<keyof LoginField, "valid" | "error">>;

const EMPTY: LoginField = { email: "", password: "" };

function sanitizeError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong.";
  const msg = err.message.toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid credentials"))
    return "Invalid email or password.";
  if (msg.includes("user not found") || msg.includes("email not confirmed"))
    return "No creator account found with that email.";
  if (msg.includes("too many requests"))
    return "Too many attempts. Wait a moment and try again.";
  return err.message;
}

export default function CreatorLoginPage() {
  const router = useRouter();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [fields, setFields] = useState<LoginField>(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginField>>({});
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const set =
    (k: keyof LoginField) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));

  function handleBlur(k: keyof LoginField) {
    const v = fields[k];
    let ok = false;
    if (k === "email") ok = /\S+@\S+\.\S+/.test(v) && v.trim().length > 0;
    else if (k === "password") ok = v.length >= 1;
    setFieldStatus((p) => ({
      ...p,
      [k]: ok ? "valid" : errors[k] ? "error" : undefined,
    }));
  }

  function validate(): boolean {
    const errs: Partial<LoginField> = {};
    if (!fields.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      errs.email = "Please enter a valid email address.";
    if (!fields.password) errs.password = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
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
      const { error } = await supabase.auth.signInWithPassword({
        email: fields.email.trim(),
        password: fields.password,
      });
      if (error) throw error;
      router.push("/creator/dashboard");
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
      setIsPressed(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <a href="#login-form" className="skip-link">
        Skip to form
      </a>
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap" id="login-form">
            <div className="form-header">
              <span className="form-eyebrow">Creator Login</span>
              <h1 className="form-title">Welcome back.</h1>
              <p className="form-subtitle">Your campaigns are waiting.</p>
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
                {/* ── Email ──────────────────────────────────── */}
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <div className="field-wrap">
                    <input
                      id="email"
                      type="email"
                      value={fields.email}
                      onChange={set("email")}
                      onBlur={() => handleBlur("email")}
                      placeholder="you@example.com"
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

                {/* ── Password ───────────────────────────────── */}
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-action">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={fields.password}
                      onChange={set("password")}
                      onBlur={() => handleBlur("password")}
                      placeholder="Your password"
                      autoComplete="current-password"
                      aria-describedby={
                        errors.password ? "err-password" : undefined
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
                  {errors.password && (
                    <span className="error-msg" id="err-password">
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* ── Forgot password ────────────────────────── */}
                <div className="forgot-link">
                  <Link href="/creator/reset-password">Forgot password?</Link>
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
                      <span className="sr-only">Signing in&hellip;</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            <p className="form-footer">
              Don&apos;t have an account?{" "}
              <Link href="/creator/signup">Join as Creator &rarr;</Link>
              <br />
              Are you a merchant?{" "}
              <Link href="/merchant/login">Merchant login &rarr;</Link>
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

const LOGIN_TIERS = [
  { icon: "◎", label: "Seed", rate: "Free", desc: "Zero followers needed" },
  {
    icon: "◈",
    label: "Explorer",
    rate: "$12/campaign",
    desc: "2 active campaigns",
  },
  {
    icon: "◆",
    label: "Operator",
    rate: "$20 + 3%",
    desc: "Commission on walk-ins",
  },
  {
    icon: "◉",
    label: "Amplifier",
    rate: "$35/campaign",
    desc: "Priority matching",
  },
  {
    icon: "◑",
    label: "Luminary",
    rate: "$65/campaign",
    desc: "Brand partnerships",
  },
  {
    icon: "★",
    label: "Icon",
    rate: "$100+/campaign",
    desc: "Elite exclusives",
  },
];

function BrandPanel() {
  return (
    <div className="brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Your performance score
            <br />
            <em>is your currency.</em>
          </h2>
          <p className="brand-tagline">
            Every campaign you complete builds your Push Score &mdash; higher
            score means better brands, higher payouts, and commission income.
          </p>
        </div>

        {/* Tier journey preview */}
        <div className="auth-tier-preview">
          <span className="auth-tier-preview-label">YOUR TIER JOURNEY</span>
          {LOGIN_TIERS.map((t, i) => (
            <div key={t.label} className="auth-tier-item" data-active={i === 0}>
              <span className="auth-tier-icon" aria-hidden="true">
                {t.icon}
              </span>
              <div className="auth-tier-info">
                <span className="auth-tier-name">{t.label}</span>
                <span className="auth-tier-benefit">{t.desc}</span>
              </div>
              <span className="auth-tier-rate">{t.rate}</span>
            </div>
          ))}
          <p className="auth-motivation">
            From free product to $100/campaign &mdash; your score unlocks it
            all.
          </p>
        </div>
      </div>

      <Link href="/" className="brand-back">
        &larr; Back to home
      </Link>
    </div>
  );
}
