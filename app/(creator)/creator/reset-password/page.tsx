"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import "@/styles/auth-split.css";
import "./reset-password.css";

/* ── Types ───────────────────────────────────────────────── */

type FieldStatus = "valid" | "error" | undefined;
type Step = "request" | "sent" | "update";

/* ── Helpers ─────────────────────────────────────────────── */

function sanitizeError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong. Please try again.";
  const msg = err.message.toLowerCase();
  if (msg.includes("user not found") || msg.includes("not registered"))
    return "We couldn't find a Push account with that email.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Too many reset attempts. Wait a minute and try again.";
  if (msg.includes("expired") || msg.includes("invalid token"))
    return "This reset link expired. Request a new one below.";
  if (msg.includes("password") && msg.includes("short"))
    return "Password needs at least 8 characters.";
  if (msg.includes("same password") || msg.includes("new password"))
    return "New password can't match the old one.";
  if (msg.includes("network") || msg.includes("fetch"))
    return "Network hiccup. Check your connection and retry.";
  return err.message;
}

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

/* ── Page component ──────────────────────────────────────── */

export default function CreatorResetPasswordPage() {
  const router = useRouter();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // Step 1: request
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<FieldStatus>(undefined);
  const [emailError, setEmailError] = useState("");

  // Step 2: update (after redirect)
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [newPwError, setNewPwError] = useState("");
  const [confirmPwError, setConfirmPwError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Shared state
  const [step, setStep] = useState<Step>("request");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  /* ── Detect Supabase recovery redirect (hash token) ──────── */

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    // Supabase redirects with #access_token=...&type=recovery
    if (
      hash &&
      (hash.includes("type=recovery") || hash.includes("access_token="))
    ) {
      setStep("update");
    }
  }, []);

  /* ── Step 1 handlers (request reset email) ───────────────── */

  function handleEmailBlur() {
    const ok = /\S+@\S+\.\S+/.test(email) && email.trim().length > 0;
    setEmailStatus(ok ? "valid" : emailError ? "error" : undefined);
  }

  function validateEmail(): boolean {
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

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsPressed(true);
    if (!validateEmail()) {
      setIsPressed(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/creator/reset-password`
              : undefined,
        },
      );
      if (error) throw error;
      setStep("sent");
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
      setIsPressed(false);
    } finally {
      setLoading(false);
    }
  }

  /* ── Step 2 handlers (update password) ───────────────────── */

  function validateUpdate(): boolean {
    let ok = true;
    if (newPw.length < 8) {
      setNewPwError("At least 8 characters for security.");
      ok = false;
    } else {
      setNewPwError("");
    }
    if (confirmPw !== newPw) {
      setConfirmPwError("Passwords don't match.");
      ok = false;
    } else if (!confirmPw) {
      setConfirmPwError("Confirm your new password.");
      ok = false;
    } else {
      setConfirmPwError("");
    }
    return ok;
  }

  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsPressed(true);
    if (!validateUpdate()) {
      setIsPressed(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      // Clean hash, redirect to login with success query param.
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      router.push("/creator/login?reset=success");
    } catch (err: unknown) {
      setFormError(sanitizeError(err));
      setIsPressed(false);
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    setFormError("");
    submitBtnRef.current?.focus();
  }

  const pwStrength = getPasswordStrength(newPw);

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <>
      <a href="#reset-form" className="skip-link">
        Skip to form
      </a>
      <div className="page">
        <BrandPanel step={step} />
        <div className="form-panel">
          <div className="form-wrap" id="reset-form">
            {step === "sent" ? (
              <SentState
                email={email}
                onResend={() => {
                  setStep("request");
                  setFormError("");
                }}
              />
            ) : step === "update" ? (
              <UpdateState
                newPw={newPw}
                confirmPw={confirmPw}
                setNewPw={setNewPw}
                setConfirmPw={setConfirmPw}
                newPwError={newPwError}
                confirmPwError={confirmPwError}
                showPw={showPw}
                setShowPw={setShowPw}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                pwStrength={pwStrength}
                formError={formError}
                loading={loading}
                isPressed={isPressed}
                onSubmit={handleUpdateSubmit}
                onRetry={handleRetry}
                submitRef={submitBtnRef}
              />
            ) : (
              <RequestState
                email={email}
                setEmail={setEmail}
                emailStatus={emailStatus}
                emailError={emailError}
                formError={formError}
                loading={loading}
                isPressed={isPressed}
                onBlur={handleEmailBlur}
                onSubmit={handleRequestSubmit}
                onRetry={handleRetry}
                submitRef={submitBtnRef}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Step 1: Request state (default) ─────────────────────── */

type RequestStateProps = {
  email: string;
  setEmail: (v: string) => void;
  emailStatus: FieldStatus;
  emailError: string;
  formError: string;
  loading: boolean;
  isPressed: boolean;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onRetry: () => void;
  submitRef: React.RefObject<HTMLButtonElement | null>;
};

function RequestState({
  email,
  setEmail,
  emailStatus,
  emailError,
  formError,
  loading,
  isPressed,
  onBlur,
  onSubmit,
  onRetry,
  submitRef,
}: RequestStateProps) {
  return (
    <>
      <div className="form-header">
        <span className="form-eyebrow">Step 01 &middot; Request</span>
        <h1 className="form-title">Forgot your password?</h1>
        <p className="form-subtitle">
          Enter your email and we&apos;ll send a secure reset link. Takes under
          a minute.
        </p>
      </div>

      {formError && (
        <div
          className="form-error"
          role="alert"
          style={{ marginBottom: "var(--space-4)" }}
        >
          <span>{formError}</span>
          <button type="button" className="error-retry-btn" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        noValidate
        className={loading ? "form-loading" : ""}
      >
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="field-wrap">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={onBlur}
                placeholder="you@example.com"
                autoComplete="email"
                required
                aria-describedby={emailError ? "err-email" : undefined}
              />
              {emailStatus === "valid" && (
                <span className="field-dot" aria-hidden="true" />
              )}
            </div>
            {emailError && (
              <span className="error-msg" id="err-email" role="alert">
                {emailError}
              </span>
            )}
          </div>

          <button
            ref={submitRef}
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
                <span className="sr-only">Sending&hellip;</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </div>
      </form>

      <p className="form-footer">
        Remember it? <Link href="/creator/login">&larr; Back to login</Link>
      </p>
    </>
  );
}

/* ── Step "sent" state ───────────────────────────────────── */

function SentState({
  email,
  onResend,
}: {
  email: string;
  onResend: () => void;
}) {
  return (
    <div className="sent-state" role="status" aria-live="polite">
      <div className="sent-icon" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="24"
            cy="24"
            r="23"
            stroke="currentColor"
            strokeWidth="2"
          />
          <polyline
            points="14,25 22,33 35,17"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
          />
        </svg>
      </div>
      <h1 className="sent-title">Check your email</h1>
      <p className="sent-message">
        We sent a reset link to <strong>{email}</strong>. It expires in 60
        minutes. Check Promotions or Spam if it&apos;s not in your inbox within
        2 minutes.
      </p>
      <button type="button" className="sent-resend" onClick={onResend}>
        Use a different email
      </button>
      <Link href="/creator/login" className="sent-back">
        &larr; Back to login
      </Link>
    </div>
  );
}

/* ── Step 2: Update password ─────────────────────────────── */

type UpdateStateProps = {
  newPw: string;
  confirmPw: string;
  setNewPw: (v: string) => void;
  setConfirmPw: (v: string) => void;
  newPwError: string;
  confirmPwError: string;
  showPw: boolean;
  setShowPw: (fn: (v: boolean) => boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (fn: (v: boolean) => boolean) => void;
  pwStrength: "weak" | "fair" | "strong" | null;
  formError: string;
  loading: boolean;
  isPressed: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onRetry: () => void;
  submitRef: React.RefObject<HTMLButtonElement | null>;
};

function UpdateState({
  newPw,
  confirmPw,
  setNewPw,
  setConfirmPw,
  newPwError,
  confirmPwError,
  showPw,
  setShowPw,
  showConfirm,
  setShowConfirm,
  pwStrength,
  formError,
  loading,
  isPressed,
  onSubmit,
  onRetry,
  submitRef,
}: UpdateStateProps) {
  return (
    <>
      <div className="form-header">
        <span className="form-eyebrow">Step 02 &middot; Set new password</span>
        <h1 className="form-title">Choose a new password.</h1>
        <p className="form-subtitle">
          Minimum 8 characters. Mix letters, numbers, and symbols for a strong
          Vertical AI for Local Commerce account.
        </p>
      </div>

      {formError && (
        <div
          className="form-error"
          role="alert"
          style={{ marginBottom: "var(--space-4)" }}
        >
          <span>{formError}</span>
          <button type="button" className="error-retry-btn" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        noValidate
        className={loading ? "form-loading" : ""}
      >
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="new-password">New password</label>
            <div className="input-with-action">
              <input
                id="new-password"
                name="new-password"
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                required
                aria-describedby={
                  newPwError
                    ? "err-new-password"
                    : newPw
                      ? "new-pw-strength"
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
            {newPw && pwStrength && (
              <div
                className="pw-strength"
                id="new-pw-strength"
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
            {newPwError && (
              <span className="error-msg" id="err-new-password" role="alert">
                {newPwError}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="input-with-action">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
                required
                aria-describedby={
                  confirmPwError ? "err-confirm-password" : undefined
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
            {confirmPwError && (
              <span
                className="error-msg"
                id="err-confirm-password"
                role="alert"
              >
                {confirmPwError}
              </span>
            )}
          </div>

          <button
            ref={submitRef}
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
                <span className="sr-only">Saving…</span>
              </>
            ) : (
              "Save new password"
            )}
          </button>
        </div>
      </form>

      <p className="form-footer">
        <Link href="/creator/login">&larr; Back to login</Link>
      </p>
    </>
  );
}

/* ── Brand panel ─────────────────────────────────────────── */

function BrandPanel({ step }: { step: Step }) {
  const primaryCopy =
    step === "update"
      ? "Almost done."
      : step === "sent"
        ? "Check your inbox."
        : "Reset in under a minute.";

  const taglineCopy =
    step === "update"
      ? "Pick a fresh password. Your ConversionOracle campaigns and Push Score are unchanged."
      : "Vertical AI for Local Commerce keeps your account secure. We'll send a one-time link — never a password over email.";

  return (
    <div className="brand-panel reset-brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            {primaryCopy.split(" ").slice(0, -1).join(" ")}
            <br />
            <em>{primaryCopy.split(" ").slice(-1)[0]}</em>
          </h2>
          <p className="brand-tagline">{taglineCopy}</p>
        </div>

        <div className="brand-stats">
          {[
            { label: "Link expires in", value: "60 minutes", pct: 100 },
            { label: "Encrypted end-to-end", value: "TLS 1.3", pct: 100 },
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

        <div className="reset-step-pill">
          <span
            className={`reset-step-dot ${step === "request" ? "reset-step-dot--active" : "reset-step-dot--done"}`}
            aria-hidden="true"
          />
          <span className="reset-step-label">Request link</span>
          <span className="reset-step-sep" aria-hidden="true" />
          <span
            className={`reset-step-dot ${step === "update" ? "reset-step-dot--active" : step === "sent" ? "reset-step-dot--current" : ""}`}
            aria-hidden="true"
          />
          <span className="reset-step-label">Set new password</span>
        </div>
      </div>

      <Link href="/creator/login" className="brand-back">
        &larr; Back to login
      </Link>
    </div>
  );
}
