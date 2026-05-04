"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";

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

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 16,
  lineHeight: 1.4,
  letterSpacing: "-0.125em",
  padding: "12px 16px",
  height: 48,
  border: "1px solid var(--mist)",
  borderRadius: "var(--r-sm)",
  background: "var(--surface)",
  width: "100%",
  boxSizing: "border-box",
  color: "var(--ink)",
  outline: "none",
  transition:
    "border-color 180ms var(--ease-spring), box-shadow 180ms var(--ease-spring)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--ink-4)",
  marginBottom: 8,
};

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
      {/* Skip link */}
      <a
        href="#login-form"
        style={{
          position: "absolute",
          top: -40,
          left: 0,
          background: "var(--brand-red)",
          color: "var(--snow)",
          padding: "8px 16px",
          zIndex: 100,
          textDecoration: "none",
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          fontWeight: 600,
        }}
        onFocus={(e) => {
          (e.target as HTMLAnchorElement).style.top = "0";
        }}
        onBlur={(e) => {
          (e.target as HTMLAnchorElement).style.top = "-40px";
        }}
      >
        Skip to form
      </a>

      {/* Split-screen wrapper */}
      <div
        className="login-split"
        style={{ minHeight: "100vh", display: "flex" }}
      >
        {/* ── Left: Dark editorial panel ── */}
        <div
          className="login-left"
          style={{
            width: "55%",
            background: "var(--char)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            overflow: "hidden",
          }}
        >
          {/* Top: brand mark + eyebrow */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: "-0.02em",
                color: "var(--snow)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--brand-red)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-hero)",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "var(--snow)",
                  flexShrink: 0,
                }}
              >
                P
              </span>
              PUSH
            </Link>

            {/* Canonical product eyebrow — no parentheses, product register */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.40)",
                marginTop: 40,
                marginBottom: 0,
              }}
            >
              CREATOR PLATFORM
            </p>
          </div>

          {/* Bottom: proof stats + giant wordmark */}
          <div>
            {/* Two KPI stats */}
            <div
              style={{
                display: "flex",
                gap: 40,
                marginBottom: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                { num: "1.4M+", label: "Verified Visits" },
                { num: "87%", label: "Creator Retention" },
              ].map((stat) => (
                <div key={stat.num}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      fontSize: "clamp(32px, 4vw, 56px)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1.0,
                      color: "var(--snow)",
                      margin: "0 0 8px",
                    }}
                  >
                    {stat.num}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.40)",
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Giant wordmark — bottom-left anchored per § 7.1 */}
            <p
              className="login-left-wordmark"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(64px, 10vw, 160px)",
                letterSpacing: "-0.05em",
                lineHeight: 0.85,
                color: "var(--snow)",
                margin: 0,
                userSelect: "none",
              }}
            >
              PUSH
            </p>
          </div>

          {/* Ghost watermark letter — decorative */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: "-0.05em",
              top: "10%",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(200px, 35vw, 480px)",
              letterSpacing: "-0.08em",
              lineHeight: 0.85,
              color: "rgba(255,255,255,0.03)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            P
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div
          className="login-right"
          style={{
            width: "45%",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "56px 48px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 400 }}>
            {/* Form header */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 40,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              Welcome back.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                lineHeight: 1.4,
                letterSpacing: "-0.125em",
                color: "var(--ink-3)",
                margin: "0 0 32px",
              }}
            >
              Your campaigns are waiting.
            </p>

            {/* Form card — § 4 standard 10px radius, surface-2 fill */}
            <div
              id="login-form"
              className="creator-login-card"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--mist)",
                borderRadius: "var(--r-md)",
                padding: 32,
                boxShadow: "var(--shadow-1)",
              }}
            >
              {/* Form-level error banner */}
              {formError && (
                <div
                  role="alert"
                  aria-live="polite"
                  style={{
                    background: "var(--brand-red-tint)",
                    border: "1px solid var(--brand-red)",
                    borderRadius: "var(--r-sm)",
                    padding: "12px 16px",
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      color: "var(--brand-red)",
                    }}
                  >
                    {formError}
                  </span>
                  <button
                    type="button"
                    onClick={handleRetry}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--brand-red)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      flexShrink: 0,
                    }}
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
                {/* Email field */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="email"
                    style={{
                      ...labelStyle,
                      color:
                        fieldStatus.email === "valid"
                          ? "var(--brand-red)"
                          : errors.email
                            ? "var(--brand-red)"
                            : "var(--ink-4)",
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={fields.email}
                    onChange={set("email")}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-describedby={errors.email ? "err-email" : undefined}
                    style={{
                      ...inputStyle,
                      borderColor: errors.email
                        ? "var(--brand-red)"
                        : fieldStatus.email === "valid"
                          ? "var(--brand-red)"
                          : "var(--hairline-2)",
                    }}
                  />
                  {errors.email && (
                    <span
                      id="err-email"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--brand-red)",
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password field */}
                <div style={{ marginBottom: 8 }}>
                  <label
                    htmlFor="password"
                    style={{
                      ...labelStyle,
                      color:
                        fieldStatus.password === "valid"
                          ? "var(--brand-red)"
                          : errors.password
                            ? "var(--brand-red)"
                            : "var(--ink-4)",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
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
                      style={{
                        ...inputStyle,
                        paddingRight: 56,
                        borderColor: errors.password
                          ? "var(--brand-red)"
                          : fieldStatus.password === "valid"
                            ? "var(--brand-red)"
                            : "var(--hairline-2)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ink-4)",
                        padding: 0,
                      }}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <span
                      id="err-password"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--brand-red)",
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Forgot password — Ghost button per § 9 */}
                <div style={{ textAlign: "right", marginBottom: 24 }}>
                  <Link
                    href="/creator/reset-password"
                    className="creator-login-forgot click-shift"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit button */}
                <button
                  ref={submitBtnRef}
                  type="submit"
                  className="btn-primary click-shift"
                  disabled={loading}
                  aria-busy={loading}
                  data-pressed={isPressed}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loading ? (
                    <>
                      <span
                        aria-hidden="true"
                        style={{
                          display: "flex",
                          gap: 4,
                          justifyContent: "center",
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "currentColor",
                              opacity: 0.6,
                            }}
                          />
                        ))}
                      </span>
                      <span className="sr-only">Signing in&hellip;</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Terms / Privacy — appears under primary CTA */}
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    letterSpacing: "0.02em",
                    color: "var(--ink-4)",
                    textAlign: "center",
                    margin: "16px 0 0",
                  }}
                >
                  By signing in, you agree to our{" "}
                  <Link
                    href="/legal/terms"
                    style={{
                      color: "var(--ink-3)",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy"
                    style={{
                      color: "var(--ink-3)",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>

            {/* Footer links below the card */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                lineHeight: 1.4,
                letterSpacing: "-0.125em",
                color: "var(--ink-4)",
                textAlign: "center",
                marginTop: 24,
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/creator/signup"
                style={{
                  color: "var(--brand-red)",
                  textDecoration: "underline",
                }}
              >
                Join as Creator →
              </Link>
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                lineHeight: 1.4,
                letterSpacing: "-0.125em",
                color: "var(--ink-4)",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Are you a merchant?{" "}
              <Link
                href="/merchant/login"
                style={{
                  color: "var(--brand-red)",
                  textDecoration: "underline",
                }}
              >
                Merchant login →
              </Link>
            </p>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Link
                href="/demo/creator"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--ink-5)",
                  textDecoration: "none",
                  borderBottom: "1px dashed var(--hairline)",
                  paddingBottom: 2,
                }}
              >
                Try Demo Mode — no account needed →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .login-split {
            flex-direction: column !important;
          }
          .login-left {
            width: 100% !important;
            min-height: 200px !important;
            padding: 32px 24px !important;
            /* collapse bottom section on mobile — show only logo + eyebrow */
            justify-content: flex-start !important;
            gap: 24px;
          }
          .login-left-wordmark {
            font-size: 56px !important;
          }
          .login-right {
            width: 100% !important;
            padding: 40px 24px !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </>
  );
}
