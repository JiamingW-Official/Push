"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
import "@/styles/auth-split.css";
import "./signup.css";

type Goal = "customers" | "awareness" | "event";

type Field = {
  email: string;
  password: string;
  businessName: string;
  address: string;
  contactEmail: string;
  instagram: string;
};

type FieldStatus = Partial<Record<keyof Field, "valid" | "error">>;

const EMPTY: Field = {
  email: "",
  password: "",
  businessName: "",
  address: "",
  contactEmail: "",
  instagram: "",
};

/* ── Goal SVG icons ──────────────────────────────────────── */
const GoalIcon: Record<Goal, React.ReactNode> = {
  customers: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 14L14 4M14 4H8M14 4V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  awareness: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  ),
  event: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2.5L17 15.5H3L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const GOALS: { id: Goal; label: string; desc: string; number: string }[] = [
  {
    id: "customers",
    label: "Fill Seats",
    desc: "Get locals through the door this week",
    number: "01",
  },
  {
    id: "awareness",
    label: "Get Discovered",
    desc: "Show up in feeds of people who live nearby",
    number: "02",
  },
  {
    id: "event",
    label: "Sell Out the Launch",
    desc: "Event, new menu, or drop — creators amplify your moment",
    number: "03",
  },
];

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
    return "That email is already set up with Push. Just log in to access your campaigns.";
  if (
    msg.includes("password") &&
    (msg.includes("short") || msg.includes("weak"))
  )
    return "Need at least 8 characters. Try a mix of numbers and letters.";
  if (msg.includes("invalid email") || msg.includes("email"))
    return "Please enter a valid email address.";
  return err.message;
}

/* ── Shared input style helper (uses tokens; no hard-coded colors) ── */
function inputStyle(hasError: boolean, isValid: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-body)",
    fontSize: 16,
    padding: "12px 16px",
    border: `1px solid ${hasError ? "var(--brand-red)" : isValid ? "var(--ink-5)" : "var(--mist)"}`,
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
}

export default function MerchantSignupPage() {
  const router = useRouter();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [fields, setFields] = useState<Field>(EMPTY);
  const [goal, setGoal] = useState<Goal>("customers");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<Field>>({});
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const goalRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-redirect after success email confirmation sent
  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          router.push("/merchant/onboarding");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [success, router]);

  const set = (k: keyof Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  function handleBlur(k: keyof Field) {
    const v = fields[k];
    let ok = false;
    if (k === "businessName") ok = v.trim().length > 0;
    else if (k === "address") ok = v.trim().length > 0;
    else if (k === "email") ok = /\S+@\S+\.\S+/.test(v) && v.trim().length > 0;
    else if (k === "password") ok = v.length >= 8;
    else if (k === "contactEmail") ok = !v || /\S+@\S+\.\S+/.test(v);
    else ok = true;
    setFieldStatus((p) => ({
      ...p,
      [k]: ok ? "valid" : errors[k] ? "error" : undefined,
    }));
  }

  function validate(): boolean {
    const errs: Partial<Field> = {};
    if (!fields.businessName.trim())
      errs.businessName =
        "Can't skip this — we need your business name to match creators.";
    if (!fields.address.trim())
      errs.address =
        "Can't skip this — we need your address to find nearby creators.";
    if (!fields.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      errs.email = "Please enter a valid email address.";
    if (fields.password.length < 8)
      errs.password = "Need at least 8 characters for security.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleGoalKey(e: React.KeyboardEvent, i: number) {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (i + 1) % GOALS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (i - 1 + GOALS.length) % GOALS.length;
    }
    if (next !== i) {
      setGoal(GOALS[next].id);
      goalRefs.current[next]?.focus();
    }
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: fields.email.trim(),
        password: fields.password,
        options: { data: { role: "merchant" } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed — no user returned");

      const { error: profileError } = await supabase.from("merchants").insert({
        user_id: authData.user.id,
        business_name: fields.businessName.trim(),
        address: fields.address.trim(),
        contact_email: fields.contactEmail.trim() || fields.email.trim(),
        instagram: fields.instagram.trim().replace(/^@+/, "") || null,
        goal,
      });
      if (profileError) throw profileError;

      if (authData.session) {
        router.push("/merchant/onboarding");
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

  if (success) {
    return (
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
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-2xl)",
              padding: "48px",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 24px",
              }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 48 48" fill="none">
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="var(--accent-blue)"
                  strokeWidth="2"
                />
                <path
                  d="M14 24L21 31L34 17"
                  stroke="var(--accent-blue)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: 28,
                color: "var(--ink)",
                margin: "0 0 12px",
                letterSpacing: "-0.02em",
              }}
            >
              Check Your Email
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-3)",
                lineHeight: 1.6,
                margin: "0 0 16px",
              }}
            >
              We sent a confirmation link to <strong>{fields.email}</strong>.
              Click it to log in and see creators already in your neighbourhood.
              Check Promotions or Spam if it&apos;s not there within 2 minutes.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
              }}
            >
              Redirecting in {countdown}s&hellip;
            </p>
          </div>
          <p style={{ marginTop: 16 }}>
            <Link
              href="/merchant/signup"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                textDecoration: "none",
              }}
            >
              Wrong email? Start over
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <a href="#signup-form" className="skip-link">
        Skip to form
      </a>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--surface)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "48px 24px",
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 560 }}>
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

          {/* Form card */}
          <div
            id="signup-form"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-2xl)",
              padding: "40px 48px",
            }}
          >
            {/* Header — marketing register: parenthetical eyebrow + social proof chip */}
            <div style={{ marginBottom: 32 }}>
              <div className="fomo-badge">32 merchants joined this week</div>
              <span className="signup-eyebrow">Get Started</span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3.6vw, 40px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "var(--graphite)",
                  margin: "0 0 16px",
                }}
              >
                Pay only for customers who walk in.
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Every creator includes a QR code. You see exactly who converts —
                before paying commission.
              </p>

              {/* Marketing KPI strip — Darky numerals, social proof */}
              <div className="signup-kpis" aria-label="Push at a glance">
                <div>
                  <div className="signup-kpi-num">3.2x</div>
                  <div className="signup-kpi-label">Avg ROI</div>
                </div>
                <div>
                  <div className="signup-kpi-num">200+</div>
                  <div className="signup-kpi-label">NYC Spots</div>
                </div>
                <div>
                  <div className="signup-kpi-num">$0</div>
                  <div className="signup-kpi-label">Until Verified</div>
                </div>
              </div>
            </div>

            {formError && (
              <div
                role="alert"
                style={{
                  background: "rgba(193,18,31,0.06)",
                  border: "1px solid var(--brand-red)",
                  borderRadius: 8,
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
                {/* Section divider: Your Business */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "4px 0",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--hairline)",
                    }}
                  />
                  <span
                    className="eyebrow"
                    style={{ color: "var(--ink-4)", fontSize: 10 }}
                  >
                    Your Business
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--hairline)",
                    }}
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label
                    htmlFor="businessName"
                    className="eyebrow"
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "var(--ink-3)",
                    }}
                  >
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={fields.businessName}
                    onChange={set("businessName")}
                    onBlur={() => handleBlur("businessName")}
                    placeholder="e.g. Blue Bottle Coffee Williamsburg"
                    autoComplete="organization"
                    aria-describedby={
                      errors.businessName ? "err-businessName" : undefined
                    }
                    style={inputStyle(
                      !!errors.businessName,
                      fieldStatus.businessName === "valid",
                    )}
                  />
                  {errors.businessName && (
                    <span
                      id="err-businessName"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--brand-red)",
                        display: "block",
                        marginTop: 6,
                      }}
                    >
                      {errors.businessName}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="eyebrow"
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "var(--ink-3)",
                    }}
                  >
                    Business Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={fields.address}
                    onChange={set("address")}
                    onBlur={() => handleBlur("address")}
                    placeholder="123 Main St, City, State"
                    autoComplete="street-address"
                    aria-describedby={
                      errors.address ? "err-address" : undefined
                    }
                    style={inputStyle(
                      !!errors.address,
                      fieldStatus.address === "valid",
                    )}
                  />
                  {errors.address && (
                    <span
                      id="err-address"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--brand-red)",
                        display: "block",
                        marginTop: 6,
                      }}
                    >
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* Contact email + Instagram row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label
                      htmlFor="contactEmail"
                      className="eyebrow"
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "var(--ink-3)",
                      }}
                    >
                      Notifications Email{" "}
                      <span style={{ fontWeight: 400, color: "var(--ink-4)" }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={fields.contactEmail}
                      onChange={set("contactEmail")}
                      onBlur={() => handleBlur("contactEmail")}
                      placeholder="ops@yourbusiness.com"
                      autoComplete="email"
                      style={inputStyle(false, false)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="instagram"
                      className="eyebrow"
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "var(--ink-3)",
                      }}
                    >
                      Instagram{" "}
                      <span style={{ fontWeight: 400, color: "var(--ink-4)" }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="instagram"
                      type="text"
                      value={fields.instagram}
                      onChange={set("instagram")}
                      onBlur={() => handleBlur("instagram")}
                      placeholder="@yourbusiness"
                      style={inputStyle(false, false)}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                        display: "block",
                        marginTop: 6,
                      }}
                    >
                      Matches you with creators in your niche. Read-only — we
                      never post or sell access.
                    </span>
                  </div>
                </div>

                {/* Section divider: Primary Goal */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "4px 0",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--hairline)",
                    }}
                  />
                  <span
                    className="eyebrow"
                    style={{ color: "var(--ink-4)", fontSize: 10 }}
                  >
                    Primary Goal
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--hairline)",
                    }}
                  />
                </div>

                {/* Goal cards */}
                <div
                  role="radiogroup"
                  aria-label="Primary campaign goal"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 12,
                  }}
                >
                  {GOALS.map((g, i) => (
                    <button
                      key={g.id}
                      ref={(el) => {
                        goalRefs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={goal === g.id}
                      tabIndex={goal === g.id ? 0 : -1}
                      onClick={() => setGoal(g.id)}
                      onKeyDown={(e) => handleGoalKey(e, i)}
                      style={{
                        background:
                          goal === g.id ? "var(--surface-2)" : "var(--surface)",
                        border: `1px solid ${goal === g.id ? "var(--accent-blue)" : "var(--hairline)"}`,
                        borderRadius: 10,
                        padding: "16px 12px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "border-color 0.15s, background 0.15s",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          color:
                            goal === g.id
                              ? "var(--accent-blue)"
                              : "var(--ink-3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-hidden="true"
                      >
                        {GoalIcon[g.id]}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--ink)",
                        }}
                      >
                        {g.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                          lineHeight: 1.4,
                        }}
                      >
                        {g.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Section divider: Create Account */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "4px 0",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--hairline)",
                    }}
                  />
                  <span
                    className="eyebrow"
                    style={{ color: "var(--ink-4)", fontSize: 10 }}
                  >
                    Create Account
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--hairline)",
                    }}
                  />
                </div>

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
                  <input
                    id="email"
                    type="email"
                    value={fields.email}
                    onChange={set("email")}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@yourbusiness.com"
                    autoComplete="email"
                    aria-describedby={errors.email ? "err-email" : undefined}
                    style={inputStyle(
                      !!errors.email,
                      fieldStatus.email === "valid",
                    )}
                  />
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
                      placeholder="Min 8 characters"
                      autoComplete="new-password"
                      aria-describedby={
                        errors.password
                          ? "err-password"
                          : fields.password
                            ? "pw-strength"
                            : undefined
                      }
                      style={inputStyle(!!errors.password, false)}
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
                  {fields.password && pwStrength && (
                    <div
                      id="pw-strength"
                      aria-live="polite"
                      style={{ marginTop: 8 }}
                    >
                      <div
                        style={{
                          height: 3,
                          background: "var(--hairline)",
                          borderRadius: 2,
                          overflow: "hidden",
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 2,
                            background:
                              pwStrength === "weak"
                                ? "var(--brand-red)"
                                : pwStrength === "fair"
                                  ? "var(--warning)"
                                  : "var(--accent-blue)",
                            width:
                              pwStrength === "weak"
                                ? "33%"
                                : pwStrength === "fair"
                                  ? "66%"
                                  : "100%",
                            transition: "width 0.3s, background 0.3s",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color:
                            pwStrength === "weak"
                              ? "var(--brand-red)"
                              : pwStrength === "fair"
                                ? "var(--warning)"
                                : "var(--accent-blue)",
                        }}
                      >
                        {pwStrength === "weak"
                          ? "Weak"
                          : pwStrength === "fair"
                            ? "Fair"
                            : "Strong — good to go"}
                      </span>
                    </div>
                  )}
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
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      display: "block",
                      marginTop: 6,
                    }}
                  >
                    Encrypted with industry-standard security
                  </span>
                </div>

                {/* Magvix Italic signature divider — marketing only */}
                <p className="signup-signature" aria-hidden="true">
                  Verified · Tracked · Paid only when they show up
                </p>

                <button
                  ref={submitBtnRef}
                  type="submit"
                  className="btn-primary click-shift"
                  disabled={loading}
                  aria-busy={loading}
                  data-pressed={isPressed}
                  style={{ width: "100%" }}
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
                    "Create Merchant Account"
                  )}
                </button>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    textAlign: "center",
                    lineHeight: 1.6,
                    margin: "0",
                  }}
                >
                  By creating an account you agree to our{" "}
                  <Link
                    href="/terms"
                    style={{
                      color: "var(--ink-2)",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    style={{
                      color: "var(--ink-2)",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>

            <p className="signup-foot">
              Already have an account?{" "}
              <Link href="/merchant/login">Log in</Link>
              <br />
              Are you a creator?{" "}
              <Link href="/creator/signup">Creator signup</Link>
            </p>
          </div>

          <p className="signup-foot signup-foot--meta">
            <Link href="/">&larr; Back to home</Link>
          </p>
        </div>
      </div>
    </>
  );
}
