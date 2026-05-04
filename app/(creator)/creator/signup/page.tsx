"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
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

/* ── Shared input styles (v11) ───────────────────────────── */
/* Focus styles handled via signup.css .signup-input:focus */

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 16,
  padding: "12px 16px",
  border: "1px solid var(--ink-4)",
  borderRadius: 8,
  background: "var(--surface)",
  width: "100%",
  boxSizing: "border-box",
  color: "var(--ink)",
  outline: "none", // focus ring provided by CSS class
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  marginBottom: 8,
};

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
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          {/* Brand logo */}
          <div style={{ marginBottom: 32 }}>
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
          </div>

          {/* Success card — v11: 10px radius, shadow-2 */}
          <div
            style={{
              background: "var(--surface-2)",
              borderRadius: 10,
              padding: "48px 48px",
              textAlign: "center",
              boxShadow: "var(--shadow-2)",
            }}
          >
            {/* Checkmark */}
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
              }}
              aria-hidden="true"
            >
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                <path
                  d="M2 10L9 17L22 2"
                  stroke="var(--brand-red)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 900,
                color: "var(--ink)",
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              You&rsquo;re in.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                color: "var(--ink-3)",
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              We sent a confirmation link to{" "}
              <strong style={{ color: "var(--ink)" }}>{fields.email}</strong>.
              Verify your email to get your first campaign.
            </p>

            <Link
              href="/creator/discover"
              className="btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Explore campaigns
            </Link>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-4)",
              marginTop: 24,
              textAlign: "center",
            }}
          >
            Wrong email?{" "}
            <Link
              href="/creator/signup"
              style={{ color: "var(--brand-red)", textDecoration: "underline" }}
            >
              Start over
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── Main form ───────────────────────────────────────────── */

  return (
    <>
      <a
        href="#signup-form"
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
          padding: "48px 24px",
        }}
      >
        {/* Desktop left value prop */}
        <div
          style={{
            display: "none",
            flex: "0 0 360px",
            padding: "0 48px 0 0",
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: "column",
          }}
          className="signup-left-panel"
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 32,
              color: "var(--ink)",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              marginBottom: 48,
              display: "block",
            }}
          >
            PUSH
          </Link>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-4)",
              marginBottom: 16,
            }}
          >
            (WHY JOIN)
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 900,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Earn per verified visit.
          </h2>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "No follower minimum",
              "Cash paid within 48 hours",
              "200+ local campaigns",
            ].map((item) => (
              <li
                key={item}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  color: "var(--ink-3)",
                  paddingBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--brand-red)",
                    flexShrink: 0,
                  }}
                />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-4)",
              textDecoration: "none",
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ← Back to home
          </Link>
        </div>

        {/* Form column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ maxWidth: 480, width: "100%" }} id="signup-form">
            {/* Mobile brand header */}
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
              <span style={{ color: "var(--ink-4)", fontSize: 20 }}>·</span>
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
                Creator Signup
              </span>
            </div>

            {/* Form card — v11: 10px radius, surface-2, shadow-2 */}
            <div
              style={{
                background: "var(--surface-2)",
                borderRadius: 10,
                padding: "32px",
                boxShadow: "var(--shadow-2)",
              }}
            >
              {/* v11 eyebrow + H1 */}
              <span className="signup-eyebrow">(CREATE·YOUR·ACCOUNT)</span>
              <h1 className="signup-h1">Join Push</h1>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--ink-3)",
                  marginBottom: 32,
                  lineHeight: 1.5,
                }}
              >
                No follower minimum. No exclusivity. Just show up and create.
              </p>

              {/* Form-level error */}
              {formError && (
                <div
                  role="alert"
                  style={{
                    background: "var(--brand-red-tint)",
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
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      fontWeight: 600,
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
                {/* ── Section: Your Profile ── */}
                <SectionDivider label="Your Profile" />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <FormField
                    id="name"
                    label="Full Name"
                    error={touched.name ? errors.name : undefined}
                    isValid={fieldStatus.name === "valid"}
                  >
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
                      style={{
                        ...inputStyle,
                        borderColor:
                          touched.name && errors.name
                            ? "var(--brand-red)"
                            : fieldStatus.name === "valid"
                              ? "var(--brand-red)"
                              : "var(--ink-4)",
                      }}
                    />
                  </FormField>

                  <FormField
                    id="location"
                    label="City / Neighbourhood"
                    error={touched.location ? errors.location : undefined}
                    isValid={fieldStatus.location === "valid"}
                  >
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
                      style={{
                        ...inputStyle,
                        borderColor:
                          touched.location && errors.location
                            ? "var(--brand-red)"
                            : fieldStatus.location === "valid"
                              ? "var(--brand-red)"
                              : "var(--ink-4)",
                      }}
                    />
                  </FormField>
                </div>

                {/* ── Section: Create Account ── */}
                <SectionDivider label="Create Account" />

                <FormField
                  id="email"
                  label="Email"
                  error={touched.email ? errors.email : undefined}
                  isValid={fieldStatus.email === "valid"}
                  style={{ marginBottom: 16 }}
                >
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
                    style={{
                      ...inputStyle,
                      borderColor:
                        touched.email && errors.email
                          ? "var(--brand-red)"
                          : fieldStatus.email === "valid"
                            ? "var(--brand-red)"
                            : "var(--ink-4)",
                    }}
                  />
                </FormField>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <FormField
                    id="password"
                    label="Password"
                    error={touched.password ? errors.password : undefined}
                    isValid={fieldStatus.password === "valid"}
                  >
                    <div style={{ position: "relative" }}>
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
                        style={{
                          ...inputStyle,
                          paddingRight: 56,
                          borderColor:
                            touched.password && errors.password
                              ? "var(--brand-red)"
                              : fieldStatus.password === "valid"
                                ? "var(--brand-red)"
                                : "var(--ink-4)",
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
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--ink-4)",
                          padding: 0,
                        }}
                      >
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                    {/* Password strength */}
                    {fields.password && pwStrength && (
                      <div
                        id="pw-strength"
                        aria-live="polite"
                        style={{ marginTop: 8 }}
                      >
                        {/* v11: 4px height, surface-3 track, #22c55e strong */}
                        <div
                          style={{
                            height: 4,
                            background: "var(--surface-3)",
                            borderRadius: 2,
                            overflow: "hidden",
                            marginBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 2,
                              width:
                                pwStrength === "weak"
                                  ? "33%"
                                  : pwStrength === "fair"
                                    ? "66%"
                                    : "100%",
                              background:
                                pwStrength === "weak"
                                  ? "var(--brand-red)"
                                  : pwStrength === "fair"
                                    ? "var(--champagne-deep, #bfa170)"
                                    : "#22c55e",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color:
                              pwStrength === "weak"
                                ? "var(--brand-red)"
                                : pwStrength === "fair"
                                  ? "var(--champagne-deep, #bfa170)"
                                  : "#22c55e",
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
                  </FormField>

                  <FormField
                    id="confirm"
                    label="Confirm Password"
                    error={touched.confirm ? errors.confirm : undefined}
                    isValid={fieldStatus.confirm === "valid"}
                  >
                    <div style={{ position: "relative" }}>
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
                        style={{
                          ...inputStyle,
                          paddingRight: 56,
                          borderColor:
                            touched.confirm && errors.confirm
                              ? "var(--brand-red)"
                              : fieldStatus.confirm === "valid"
                                ? "var(--brand-red)"
                                : "var(--ink-4)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={
                          showConfirm
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--ink-4)",
                          padding: 0,
                        }}
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormField>
                </div>

                {/* ── Section: Creator Details ── */}
                <SectionDivider label="Creator Details" />

                <FormField
                  id="instagram"
                  label="Instagram Handle (optional)"
                  style={{ marginBottom: 16 }}
                >
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    value={fields.instagram}
                    onChange={set("instagram")}
                    onBlur={() => handleBlur("instagram")}
                    placeholder="@yourhandle"
                    style={inputStyle}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                      marginTop: 6,
                      display: "block",
                    }}
                  >
                    Helps match you with the right campaigns. We never post or
                    change anything.
                  </span>
                </FormField>

                <FormField
                  id="bio"
                  label="Bio (optional)"
                  style={{ marginBottom: 24 }}
                >
                  <div style={{ position: "relative" }}>
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
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: 80,
                        paddingBottom: 28,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 12,
                        bottom: 10,
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color:
                          bioRemaining <= 20
                            ? "var(--warning)"
                            : "var(--ink-4)",
                      }}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {bioRemaining}
                    </span>
                  </div>
                </FormField>

                {/* Trust line */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-4)",
                    textAlign: "center",
                    marginBottom: 24,
                    letterSpacing: "0.04em",
                  }}
                >
                  Free to join · No follower minimum · 200+ local campaigns
                </p>

                {/* Terms consent */}
                <div style={{ marginBottom: 24 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--ink-3)",
                      lineHeight: 1.5,
                    }}
                  >
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
                      style={{
                        marginTop: 2,
                        flexShrink: 0,
                        accentColor: "var(--brand-red)",
                      }}
                    />
                    <span>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        style={{
                          color: "var(--ink)",
                          textDecoration: "underline",
                        }}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        style={{
                          color: "var(--ink)",
                          textDecoration: "underline",
                        }}
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {termsError && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--brand-red)",
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {termsError}
                    </span>
                  )}
                </div>

                {/* Submit */}
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
                      <LoadingDots />
                      <span className="sr-only">Creating account…</span>
                    </>
                  ) : (
                    "Join Push — Start Earning"
                  )}
                </button>
              </form>
            </div>

            {/* Footer links */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-4)",
                textAlign: "center",
                marginTop: 24,
                lineHeight: 1.8,
              }}
            >
              Already have an account?{" "}
              <Link
                href="/creator/login"
                style={{
                  color: "var(--brand-red)",
                  textDecoration: "underline",
                }}
              >
                Sign in →
              </Link>
              <br />
              Want to list your business?{" "}
              <Link
                href="/merchant/signup"
                style={{
                  color: "var(--brand-red)",
                  textDecoration: "underline",
                }}
              >
                Merchant signup →
              </Link>
            </p>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Link
                href="/demo/creator"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                  textDecoration: "none",
                  borderBottom: "1px dashed var(--surface-3)",
                  paddingBottom: 2,
                }}
              >
                Try Demo Mode — no account needed →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
        marginTop: 8,
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--surface-3)" }} />
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-4)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--surface-3)" }} />
    </div>
  );
}

function FormField({
  id,
  label,
  error,
  isValid,
  style,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  isValid?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div style={style}>
      <label
        htmlFor={id}
        style={{
          ...labelStyle,
          color: isValid
            ? "var(--brand-red)"
            : error
              ? "var(--brand-red)"
              : "var(--ink-3)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          id={`err-${id}`}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--brand-red)",
            marginTop: 6,
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function LoadingDots() {
  return (
    <span
      aria-hidden="true"
      style={{ display: "flex", gap: 4, justifyContent: "center" }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "currentColor",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </span>
  );
}
