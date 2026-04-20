"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
import "@/styles/auth-split.css";
import "./reset-password.css";

type FieldStatus = "valid" | "error" | undefined;

export default function CreatorResetPasswordPage() {
  const router = useRouter(); // eslint-disable-line @typescript-eslint/no-unused-vars

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<FieldStatus>(undefined);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleBlur() {
    const ok = /\S+@\S+\.\S+/.test(email) && email.trim().length > 0;
    setEmailStatus(ok ? "valid" : emailError ? "error" : undefined);
  }

  function validate(): boolean {
    if (!email.trim()) {
      setEmailError("Required");
      setEmailStatus("error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      setEmailStatus("error");
      return false;
    }
    setEmailError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: window.location.origin + "/creator/update-password",
        },
      );
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <a href="#reset-form" className="skip-link">
        Skip to form
      </a>
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap" id="reset-form">
            {sent ? (
              <SentState email={email} />
            ) : (
              <RequestState
                email={email}
                setEmail={setEmail}
                emailStatus={emailStatus}
                emailError={emailError}
                formError={formError}
                loading={loading}
                onBlur={handleBlur}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Request state (default) ───────────────────────────────── */

type RequestStateProps = {
  email: string;
  setEmail: (v: string) => void;
  emailStatus: FieldStatus;
  emailError: string;
  formError: string;
  loading: boolean;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

function RequestState({
  email,
  setEmail,
  emailStatus,
  emailError,
  formError,
  loading,
  onBlur,
  onSubmit,
}: RequestStateProps) {
  return (
    <>
      <div className="form-header">
        <span className="form-eyebrow">Password Reset</span>
        <h1 className="form-title">Forgot your password?</h1>
        <p className="form-subtitle">
          No worries. Enter your email and we&apos;ll send you a secure reset
          link.
        </p>
      </div>

      {formError && (
        <div
          className="form-error"
          role="alert"
          style={{ marginBottom: "var(--space-4)" }}
        >
          <span>{formError}</span>
        </div>
      )}

      <form
        onSubmit={onSubmit}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={onBlur}
                placeholder="you@example.com"
                autoComplete="email"
                aria-describedby={emailError ? "err-email" : undefined}
              />
              {emailStatus === "valid" && (
                <span className="field-dot" aria-hidden="true" />
              )}
            </div>
            {emailError && (
              <span className="error-msg" id="err-email">
                {emailError}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary submit-btn"
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
                <span className="sr-only">Sending&hellip;</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </div>
      </form>

      <p className="form-footer">
        Remember it? <Link href="/creator/login">Log in &rarr;</Link>
      </p>
    </>
  );
}

/* ── Sent state ─────────────────────────────────────────────── */

function SentState({ email }: { email: string }) {
  return (
    <div className="sent-state" role="status" aria-live="polite">
      <div className="sent-icon" aria-hidden="true">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="20"
            cy="20"
            r="19"
            stroke="currentColor"
            strokeWidth="2"
          />
          <polyline
            points="12,21 18,27 29,14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
      <h1 className="sent-title">Check your email</h1>
      <p className="sent-message">
        We sent a reset link to <strong>{email}</strong>.
      </p>
      <Link href="/creator/login" className="sent-back">
        &larr; Back to login
      </Link>
    </div>
  );
}

/* ── Brand panel ────────────────────────────────────────────── */

function BrandPanel() {
  return (
    <div className="brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Password
            <br />
            <em>reset.</em>
          </h2>
          <p className="brand-tagline">
            We&apos;ll send you a secure link. Your campaigns and score are
            safely stored.
          </p>
        </div>

        <div className="brand-stats">
          {[
            { label: "Link expires in", value: "60 minutes", pct: 100 },
            { label: "Accounts secured", value: "100%", pct: 100 },
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

      <Link href="/creator/login" className="brand-back">
        &larr; Creator login
      </Link>
    </div>
  );
}
