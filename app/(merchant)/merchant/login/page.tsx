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
    return "Invalid email or password.";
  if (
    msg.includes("user not found") ||
    msg.includes("no user found") ||
    msg.includes("email not confirmed") ||
    msg.includes("does not exist")
  )
    return "No account found with that email.";
  if (msg.includes("too many requests") || msg.includes("rate limit"))
    return "Too many attempts. Wait a moment and try again.";
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
      {/* Full-page layout */}
      <div
        style={{
          minHeight: "100vh",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 480,
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: 24,
                color: "var(--ink)",
                textDecoration: "none",
                letterSpacing: "-0.02em",
              }}
            >
              PUSH
            </Link>
          </div>

          {/* Form card — § 4 standard 10px radius, surface-2 fill */}
          <div
            id="login-form"
            className="merchant-login-card"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--mist)",
              borderRadius: "var(--r-md)",
              padding: "40px 48px",
              boxShadow: "var(--shadow-1)",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <span
                className="eyebrow"
                style={{
                  color: "var(--ink-3)",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Merchant Login
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(28px,4vw,36px)",
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  margin: "0 0 8px",
                }}
              >
                Welcome back.
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink-3)",
                  margin: 0,
                }}
              >
                Your campaigns are waiting. Log in to see who&apos;s driving
                results.
              </p>
            </div>

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
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--brand-red)",
                  }}
                >
                  {formError}
                </span>
                <button
                  type="button"
                  onClick={handleRetry}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--brand-red)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
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
              style={{ opacity: loading ? 0.7 : 1, transition: "opacity 0.2s" }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="eyebrow"
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "var(--ink-3)",
                    }}
                  >
                    Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="email"
                      type="email"
                      value={fields.email}
                      onChange={set("email")}
                      onBlur={() => handleBlur("email")}
                      placeholder="you@yourbusiness.com"
                      autoComplete="email"
                      aria-describedby={errors.email ? "err-email" : undefined}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                        padding: "12px 16px",
                        height: 48,
                        border: `1px solid ${errors.email ? "var(--brand-red)" : fieldStatus.email === "valid" ? "var(--brand-red)" : "var(--mist)"}`,
                        borderRadius: "var(--r-sm)",
                        background: "var(--surface)",
                        color: "var(--ink)",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                        transition:
                          "border-color 180ms var(--ease-spring), box-shadow 180ms var(--ease-spring)",
                      }}
                    />
                  </div>
                  {errors.email && (
                    <span
                      id="err-email"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--brand-red)",
                        display: "block",
                        marginTop: 6,
                      }}
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="eyebrow"
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "var(--ink-3)",
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
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                        padding: "12px 56px 12px 16px",
                        height: 48,
                        border: `1px solid ${errors.password ? "var(--brand-red)" : fieldStatus.password === "valid" ? "var(--brand-red)" : "var(--mist)"}`,
                        borderRadius: "var(--r-sm)",
                        background: "var(--surface)",
                        color: "var(--ink)",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                        transition:
                          "border-color 180ms var(--ease-spring), box-shadow 180ms var(--ease-spring)",
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
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--ink-3)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <span
                      id="err-password"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--brand-red)",
                        display: "block",
                        marginTop: 6,
                      }}
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Forgot password — Ghost button per § 9 */}
                <div style={{ textAlign: "right" }}>
                  <Link
                    href="/merchant/reset-password"
                    className="merchant-login-forgot click-shift"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  ref={submitBtnRef}
                  type="submit"
                  className="btn-primary click-shift"
                  disabled={loading}
                  aria-busy={loading}
                  data-pressed={isPressed}
                  style={{ width: "100%", marginTop: 4 }}
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

                {/* Terms / Privacy */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--ink-4)",
                    textAlign: "center",
                    margin: 0,
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
              </div>
            </form>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                textAlign: "center",
                marginTop: 24,
                lineHeight: 1.8,
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/merchant/signup"
                style={{
                  color: "var(--accent-blue)",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Sign up
              </Link>
              <br />
              Are you a creator?{" "}
              <Link
                href="/creator/login"
                style={{
                  color: "var(--accent-blue)",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Creator login
              </Link>
            </p>
          </div>

          <p style={{ textAlign: "center", marginTop: 24 }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                textDecoration: "none",
              }}
            >
              &larr; Back to home
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
