"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
import "@/styles/auth-split.css";
import "./login.css";

type LoginField = {
  email: string;
  password: string;
};

type FieldStatus = Partial<Record<keyof LoginField, "valid" | "error">>;

const EMPTY: LoginField = { email: "", password: "" };

function sanitizeError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong. Please try again.";
  const msg = err.message.toLowerCase();
  if (
    msg.includes("invalid login") ||
    msg.includes("invalid credentials") ||
    msg.includes("wrong password") ||
    msg.includes("incorrect password")
  )
    return "Invalid credentials. Check your password and try again.";
  if (
    msg.includes("user not found") ||
    msg.includes("no user found") ||
    msg.includes("email not confirmed") ||
    msg.includes("does not exist")
  )
    return "No account found with that email. Sign up to get started.";
  if (msg.includes("too many requests") || msg.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  return err.message;
}

export default function MerchantLoginPage() {
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
      router.push("/merchant/dashboard");
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
              <span className="form-eyebrow">Merchant Login</span>
              <h1 className="form-title">Welcome back.</h1>
              <p className="form-subtitle">
                Your campaigns are waiting. Log in to see who&apos;s driving
                results.
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
                  <Link href="/merchant/reset-password">Forgot password?</Link>
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
                    "Log In"
                  )}
                </button>
              </div>
            </form>

            <p className="form-footer">
              Don&apos;t have an account?{" "}
              <Link href="/merchant/signup">Sign up &rarr;</Link>
              <br />
              Are you a creator?{" "}
              <Link href="/creator/login">Creator login &rarr;</Link>
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
            Welcome
            <br />
            <em>back.</em>
          </h2>
          <p className="brand-tagline">
            Your campaigns are waiting. Log in to see exactly which creators are
            driving customers through your door — and who&apos;s worth more.
          </p>
          <blockquote className="brand-quote">
            &ldquo;I check Push every morning. It&apos;s the only marketing
            channel where I know the ROI before the day is over.&rdquo;
            <cite> — Marcus Lee, Restaurant Owner</cite>
          </blockquote>
        </div>

        <div className="brand-stats">
          {[
            { label: "Avg. cost per visit", value: "$2.40", pct: 24 },
            { label: "Creator attribution", value: "QR per post", pct: 100 },
            { label: "Merchants retained", value: "91% stay 6mo+", pct: 91 },
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
        &larr; Back to home
      </Link>
    </div>
  );
}
