"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";

type FieldStatus = "valid" | "error" | undefined;

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 16,
  padding: "12px 16px",
  border: "1px solid var(--hairline)",
  borderRadius: 8,
  background: "var(--surface)",
  width: "100%",
  boxSizing: "border-box",
  color: "var(--ink)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  marginBottom: 8,
};

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
      <a
        href="#reset-form"
        style={{
          position: "absolute",
          top: -40,
          left: 0,
          background: "var(--brand-red)",
          color: "var(--snow)",
          padding: "8px 16px",
          zIndex: 100,
          textDecoration: "none",
          fontFamily: "var(--font-body)",
          fontSize: 14,
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

      <div
        style={{
          minHeight: "100vh",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: 480, width: "100%" }} id="reset-form">
          {/* Brand header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 24,
                color: "var(--ink)",
                textDecoration: "none",
                letterSpacing: "-0.02em",
              }}
            >
              PUSH
            </Link>
            <span style={{ color: "var(--hairline)", fontSize: 20 }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-4)",
              }}
            >
              Password Reset
            </span>
          </div>

          {/* Form card */}
          <div
            style={{
              background: "var(--snow)",
              border: "1px solid var(--hairline)",
              borderRadius: 16,
              padding: "40px 48px",
            }}
          >
            {sent ? (
              /* ── Sent confirmation state ── */
              <div
                role="status"
                aria-live="polite"
                style={{ textAlign: "center" }}
              >
                {/* Envelope icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "2px solid var(--brand-red)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "var(--brand-red)",
                  }}
                  aria-hidden="true"
                >
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="22"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M1 4L12 12L23 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    fontWeight: 900,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                    marginBottom: 16,
                  }}
                >
                  Check your email.
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                    marginBottom: 32,
                  }}
                >
                  We sent a reset link to{" "}
                  <strong style={{ color: "var(--ink)" }}>{email}</strong>. The
                  link expires in 60 minutes.
                </p>
                <Link
                  href="/creator/login"
                  className="btn-ghost click-shift"
                  style={{ display: "inline-flex", textDecoration: "none" }}
                >
                  ← Back to login
                </Link>
              </div>
            ) : (
              /* ── Request state ── */
              <>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 40,
                    fontWeight: 900,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  Forgot your password?
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    color: "var(--ink-3)",
                    marginBottom: 32,
                    lineHeight: 1.5,
                  }}
                >
                  No worries. Enter your email and we&apos;ll send you a secure
                  reset link.
                </p>

                {/* Form-level error */}
                {formError && (
                  <div
                    role="alert"
                    style={{
                      background: "#fff0f0",
                      border: "1px solid #fca5a5",
                      borderRadius: 8,
                      padding: "12px 16px",
                      marginBottom: 24,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--ink)",
                      }}
                    >
                      {formError}
                    </span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className={loading ? "form-loading" : ""}
                >
                  {/* Email field */}
                  <div style={{ marginBottom: 24 }}>
                    <label
                      htmlFor="email"
                      style={{
                        ...labelStyle,
                        color:
                          emailStatus === "valid"
                            ? "var(--brand-red)"
                            : emailStatus === "error"
                              ? "#ef4444"
                              : "var(--ink-3)",
                      }}
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-describedby={emailError ? "err-email" : undefined}
                      style={{
                        ...inputStyle,
                        borderColor:
                          emailStatus === "error"
                            ? "#fca5a5"
                            : emailStatus === "valid"
                              ? "var(--brand-red)"
                              : "var(--hairline)",
                      }}
                    />
                    {emailError && (
                      <span
                        id="err-email"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "#ef4444",
                          marginTop: 6,
                          display: "block",
                        }}
                      >
                        {emailError}
                      </span>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-primary click-shift"
                    disabled={loading}
                    aria-busy={loading}
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
                        <span className="sr-only">Sending&hellip;</span>
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer link */}
          {!sent && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-4)",
                textAlign: "center",
                marginTop: 24,
              }}
            >
              Remember it?{" "}
              <Link
                href="/creator/login"
                style={{ color: "var(--ink-3)", textDecoration: "underline" }}
              >
                Log in →
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
