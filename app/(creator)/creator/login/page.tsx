"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import "@/styles/auth-split.css";
import "./login.css";

/* ── Types ───────────────────────────────────────────────── */

type LoginField = {
  email: string;
  password: string;
};

type FieldStatus = Partial<Record<keyof LoginField, "valid" | "error">>;
type Mode = "password" | "magic-link";

const EMPTY: LoginField = { email: "", password: "" };

/* ── Helpers ─────────────────────────────────────────────── */

function sanitizeError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong. Please try again.";
  const msg = err.message.toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid credentials"))
    return "Invalid email or password. Try again or use the magic link option below.";
  if (msg.includes("user not found") || msg.includes("email not confirmed"))
    return "No Push creator account found with that email.";
  if (msg.includes("too many requests") || msg.includes("rate limit"))
    return "Too many attempts. Give it a minute and try again.";
  if (msg.includes("network") || msg.includes("fetch"))
    return "Network hiccup. Check your connection and retry.";
  return err.message;
}

/* ── Page component ──────────────────────────────────────── */

export default function CreatorLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>("password");
  const [fields, setFields] = useState<LoginField>(EMPTY);
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginField>>({});
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [toast, setToast] = useState("");

  // Check for reset-password success toast via URL param.
  useEffect(() => {
    if (searchParams?.get("reset") === "success") {
      setToast("Password updated. Sign in with your new password.");
      const t = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  // Pre-fill remembered email.
  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("push-creator-remember")
          : null;
      if (saved) setFields((f) => ({ ...f, email: saved }));
    } catch {
      /* localStorage may be unavailable */
    }
  }, []);

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
    if (mode === "password" && !fields.password) errs.password = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleRetry() {
    setFormError("");
    submitBtnRef.current?.focus();
  }

  function switchMode(next: Mode) {
    setMode(next);
    setFormError("");
    setErrors({});
    setMagicLinkSent(false);
    // Keep the email so users don't have to retype.
    setTimeout(() => emailRef.current?.focus(), 100);
  }

  function handleInstagramMock() {
    alert(
      "Instagram sign-in is coming soon. For now, use email + password or request a magic link.",
    );
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

      if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({
          email: fields.email.trim(),
          password: fields.password,
        });
        if (error) throw error;

        // Remember-me handling.
        try {
          if (typeof window !== "undefined") {
            if (remember) {
              localStorage.setItem(
                "push-creator-remember",
                fields.email.trim(),
              );
            } else {
              localStorage.removeItem("push-creator-remember");
            }
          }
        } catch {
          /* localStorage may be unavailable */
        }

        router.push("/creator/dashboard");
      } else {
        // Magic-link flow: sends email with one-time login link.
        const { error } = await supabase.auth.signInWithOtp({
          email: fields.email.trim(),
          options: {
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/creator/dashboard`
                : undefined,
          },
        });
        if (error) throw error;
        setMagicLinkSent(true);
      }
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
      setIsPressed(false);
    } finally {
      setLoading(false);
    }
  }

  /* ── Magic-link success state ────────────────────────────── */

  if (magicLinkSent) {
    return (
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap">
            <div className="magic-sent" role="status" aria-live="polite">
              <div className="magic-sent-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <rect
                    x="6"
                    y="10"
                    width="36"
                    height="28"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M6 14 L24 28 L42 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <h1 className="magic-sent-title">Link on the way.</h1>
              <p className="magic-sent-body">
                We sent a one-time sign-in link to{" "}
                <strong>{fields.email}</strong>. It expires in 60 minutes. Check
                Promotions or Spam if it&apos;s missing after 2 minutes.
              </p>
              <button
                type="button"
                className="magic-sent-switch"
                onClick={() => switchMode("password")}
              >
                Use password instead
              </button>
              <Link href="/" className="magic-sent-back">
                &larr; Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ───────────────────────────────────────────── */

  return (
    <>
      <a href="#login-form" className="skip-link">
        Skip to form
      </a>
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap" id="login-form">
            {toast && (
              <div className="login-toast" role="status" aria-live="polite">
                {toast}
              </div>
            )}

            <div className="form-header">
              <span className="form-eyebrow">Creator Login</span>
              <h1 className="form-title">Welcome back.</h1>
              <p className="form-subtitle">
                Vertical AI for Local Commerce &mdash; your Customer Acquisition
                Engine is waiting.
              </p>
            </div>

            {/* ── Mode toggle ─────────────────────────────── */}
            <div
              className="mode-toggle"
              role="tablist"
              aria-label="Sign in method"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "password"}
                className={`mode-toggle-btn ${mode === "password" ? "mode-toggle-btn--active" : ""}`}
                onClick={() => switchMode("password")}
              >
                Password
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "magic-link"}
                className={`mode-toggle-btn ${mode === "magic-link" ? "mode-toggle-btn--active" : ""}`}
                onClick={() => switchMode("magic-link")}
              >
                Magic link
              </button>
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
                      name="email"
                      ref={emailRef}
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
                  {errors.email && (
                    <span className="error-msg" id="err-email" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* ── Password (only in password mode) ────── */}
                {mode === "password" && (
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
                        placeholder="Your password"
                        autoComplete="current-password"
                        required
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
                      <span
                        className="error-msg"
                        id="err-password"
                        role="alert"
                      >
                        {errors.password}
                      </span>
                    )}
                  </div>
                )}

                {/* ── Remember + Forgot (password mode only) ── */}
                {mode === "password" && (
                  <div className="login-meta-row">
                    <label className="remember-label">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    <div className="forgot-link">
                      <Link href="/creator/reset-password">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}

                {mode === "magic-link" && (
                  <p className="magic-hint">
                    We&apos;ll email you a one-time link &mdash; no password
                    needed. Works even if you&apos;ve forgotten yours.
                  </p>
                )}

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
                      <span className="sr-only">
                        {mode === "password" ? "Signing in…" : "Sending link…"}
                      </span>
                    </>
                  ) : mode === "password" ? (
                    "Sign In"
                  ) : (
                    "Email me a login link"
                  )}
                </button>

                {/* ── OAuth divider + Instagram mock ──────── */}
                <div className="oauth-divider" aria-hidden="true">
                  <span />
                  <span className="oauth-divider-label">or</span>
                  <span />
                </div>

                <button
                  type="button"
                  className="oauth-btn"
                  onClick={handleInstagramMock}
                >
                  <span className="oauth-btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                  </span>
                  <span>Sign up with Instagram</span>
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

/* ── Brand panel ─────────────────────────────────────────── */

function BrandPanel() {
  // Editorial placeholder stats — not connected to real data. Intentional.
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="brand-panel login-brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Welcome
            <br />
            <em>back.</em>
          </h2>
          <p className="brand-tagline">
            Vertical AI for Local Commerce. Your Customer Acquisition Engine
            tracks every verified walk-in, so every campaign you run compounds
            your Push Score.
          </p>
        </div>

        {/* Mini at-a-glance stat card (placeholder, editorial) */}
        <div className="login-stat-card" aria-label="Account snapshot preview">
          <div className="login-stat-row login-stat-row--primary">
            <span className="login-stat-label">Today · {today}</span>
            <span className="login-stat-value">$184.00</span>
          </div>
          <div className="login-stat-divider" aria-hidden="true" />
          <div className="login-stat-row">
            <span className="login-stat-label">Verified customers · 14d</span>
            <span className="login-stat-value login-stat-value--sm">47</span>
          </div>
          <div className="login-stat-row">
            <span className="login-stat-label">Active campaigns</span>
            <span className="login-stat-value login-stat-value--sm">3</span>
          </div>
          <div className="login-stat-row">
            <span className="login-stat-label">ConversionOracle fit</span>
            <span className="login-stat-value login-stat-value--sm">82%</span>
          </div>
          <p className="login-stat-foot">
            Sign in to see live numbers from your Williamsburg Coffee+ runs.
          </p>
        </div>
      </div>

      <Link href="/" className="brand-back">
        &larr; Back to home
      </Link>
    </div>
  );
}
