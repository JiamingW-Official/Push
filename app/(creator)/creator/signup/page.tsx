"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import "@/styles/auth-split.css";
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

/* ── Tier progression data (v5.1 Two-Segment) ────────────── */

const TIERS = [
  { icon: "◎", label: "Seed", mat: "Clay", desc: "Side-income entry" },
  { icon: "◈", label: "Explorer", mat: "Bronze", desc: "Proven consistency" },
  { icon: "◆", label: "Operator", mat: "Steel", desc: "Cross-vertical access" },
  { icon: "◉", label: "Proven", mat: "Gold", desc: "$800/mo + perf bonus" },
  { icon: "◑", label: "Closer", mat: "Ruby", desc: "$1,800 + 15% rev-share" },
  { icon: "★", label: "Partner", mat: "Obsidian", desc: "$3,500 + equity" },
];

/* ── Two-Segment paths (v5.1) ────────────────────────────── */

type Segment = "side-income" | "professional";

const SEGMENTS: {
  id: Segment;
  label: string;
  tierRange: string;
  description: string;
  earnExample: string;
  targetFollowers: string;
}[] = [
  {
    id: "side-income",
    label: "Side-income creator",
    tierRange: "T1–T3 · Seed → Operator",
    description:
      "Pay-per-verified-customer. Visit shops, post, earn. Followers don't matter — verified visits do.",
    earnExample: "$12–$20 per verified customer",
    targetFollowers: "5K–50K followers (or none)",
  },
  {
    id: "professional",
    label: "Professional creator",
    tierRange: "T4–T6 · Proven → Partner",
    description:
      "Monthly retainer + performance + referral rev-share. Partner tier unlocks 0.05–0.2% equity.",
    earnExample: "$800–$3,500/mo base + bonuses",
    targetFollowers: "30K+ followers · track record",
  },
];

/* ── Creator spotlight quotes (BrandPanel rotation) ──────── */

const CREATOR_QUOTES: {
  quote: string;
  attribution: string;
  detail: string;
}[] = [
  {
    quote:
      "Five verified walk-ins in my first week. The ConversionOracle™ ping felt unreal.",
    attribution: "Maya L. · Williamsburg",
    detail: "Seed · Clay → Explorer · Bronze",
  },
  {
    quote:
      "Push pays per customer, not per like. First retainer month covered my rent.",
    attribution: "Jordan K. · Bushwick",
    detail: "Operator · Steel",
  },
  {
    quote:
      "My Partner-ops call mapped a 90-day plan. Equity unlocked at month three.",
    attribution: "Priya S. · Brooklyn",
    detail: "Partner · Obsidian",
  },
];

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

/* ── Page wrapper (Suspense boundary) ────────────────────── */

export default function CreatorSignupPage() {
  return (
    <Suspense fallback={<CreatorSignupFallback />}>
      <CreatorSignupInner />
    </Suspense>
  );
}

function CreatorSignupFallback() {
  return (
    <div className="page">
      <div className="brand-panel signup-brand-panel" />
      <div className="form-panel">
        <div className="form-wrap" />
      </div>
    </div>
  );
}

/* ── Page component (inner, uses useSearchParams) ────────── */

function CreatorSignupInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  /* Derive initial segment from ?segment= query param — accept aliases */
  const initialSegment: Segment = (() => {
    const q = searchParams.get("segment");
    if (q === "professional" || q === "pro") return "professional";
    if (q === "side-income" || q === "side") return "side-income";
    return "side-income";
  })();

  const [fields, setFields] = useState<Field>(EMPTY);
  const [segment, setSegment] = useState<Segment>(initialSegment);
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
  const [instagramMockShown, setInstagramMockShown] = useState(false);

  // Magic link mode — default ON for side-income, OFF for professional
  const [magicLinkMode, setMagicLinkMode] = useState(
    initialSegment === "side-income",
  );
  const [mlEmail, setMlEmail] = useState("");
  const [mlZip, setMlZip] = useState("");
  const [mlIg, setMlIg] = useState("");
  const [mlDisclosure, setMlDisclosure] = useState(false);
  const [mlSent, setMlSent] = useState(false);
  const [mlError, setMlError] = useState("");
  const [mlLoading, setMlLoading] = useState(false);

  const ELIGIBLE_ZIPS = new Set(["11211", "11206", "11249"]);
  const mlZipEligible = ELIGIBLE_ZIPS.has(mlZip.trim());

  /* Re-sync if the user changes the URL client-side */
  useEffect(() => {
    const q = searchParams.get("segment");
    if (q === "professional" || q === "pro") {
      setSegment("professional");
      setMagicLinkMode(false);
    } else if (q === "side-income" || q === "side") {
      setSegment("side-income");
      setMagicLinkMode(true);
    }
  }, [searchParams]);

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

  function handleInstagramMock() {
    if (typeof window !== "undefined") {
      window.alert("Demo mode · Instagram OAuth preview");
    }
    setInstagramMockShown(true);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMlError("");
    if (!mlEmail.trim() || !/\S+@\S+\.\S+/.test(mlEmail)) {
      setMlError("Please enter a valid email address.");
      return;
    }
    if (!mlZip.trim()) {
      setMlError("ZIP code is required to match you with local campaigns.");
      return;
    }
    if (!mlDisclosure) {
      setMlError("Please agree to DisclosureBot FTC compliance checks.");
      return;
    }
    setMlLoading(true);
    try {
      const supabase = createClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/creator/onboarding?segment=${segment}&zip=${encodeURIComponent(mlZip.trim())}${mlIg ? `&ig=${encodeURIComponent(mlIg.trim())}` : ""}`
          : `/creator/onboarding?segment=${segment}`;
      const { error } = await supabase.auth.signInWithOtp({
        email: mlEmail.trim(),
        options: {
          emailRedirectTo: redirectTo,
          data: { role: "creator", segment, zip: mlZip.trim() },
        },
      });
      if (error) throw error;
      setMlSent(true);
    } catch (err: unknown) {
      setMlError(sanitizeError(err));
    } finally {
      setMlLoading(false);
    }
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

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("push-creator-segment", segment);
        }
      } catch {
        /* localStorage may be unavailable */
      }

      if (data.session) {
        router.push(`/creator/onboarding?segment=${segment}`);
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

  /* Progressive reveal validity gates (v5.1 polish) */
  const nameLocValid =
    fields.name.trim().length > 0 && fields.location.trim().length > 0;
  const emailValid = /\S+@\S+\.\S+/.test(fields.email);
  const revealEmail = nameLocValid;
  const revealPassword = revealEmail && emailValid;

  /* ── Success state ───────────────────────────────────────── */

  if (success) {
    return (
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap">
            <div className="form-success" role="status" aria-live="polite">
              <div className="success-check" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke="var(--tertiary)"
                    strokeWidth="2"
                  />
                  <path
                    d="M14 24L21 31L34 17"
                    stroke="var(--tertiary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="check-path"
                  />
                </svg>
              </div>
              <h2 className="success-heading">You&rsquo;re in!</h2>
              <p className="success-body">
                We sent a confirmation link to <strong>{fields.email}</strong>.
                Verify your email to unlock your first campaign. Check
                Promotions or Spam if it&apos;s not in your inbox within 2
                minutes.
              </p>

              {/* ── 48h countdown strip ──────────────────────── */}
              <div className="success-countdown" aria-hidden="true">
                <span className="success-countdown-label">
                  What happens next
                </span>
                <span className="success-countdown-sep" />
                <span className="success-countdown-value">48h window</span>
              </div>

              <ul className="success-next-steps">
                <li>
                  <span className="success-step-n">01</span>
                  Verify your email (2 min)
                </li>
                <li>
                  <span className="success-step-n">02</span>
                  Complete your{" "}
                  {segment === "professional"
                    ? "Partner intake"
                    : "creator profile"}{" "}
                  (~4 min)
                </li>
                <li>
                  <span className="success-step-n">03</span>
                  {segment === "professional"
                    ? "Partner-ops schedules a strategy call"
                    : "Get matched to Williamsburg Coffee+ campaigns"}
                </li>
              </ul>

              {/* ── Segment-specific extra ───────────────────── */}
              {segment === "side-income" && (
                <div className="success-qr-card">
                  <div
                    className="success-qr-svg"
                    aria-label="Referral QR preview"
                  >
                    <svg viewBox="0 0 60 60" width="60" height="60">
                      <rect
                        width="60"
                        height="60"
                        fill="var(--surface-bright)"
                      />
                      {/* Finder patterns */}
                      <rect
                        x="4"
                        y="4"
                        width="14"
                        height="14"
                        fill="var(--dark)"
                      />
                      <rect
                        x="7"
                        y="7"
                        width="8"
                        height="8"
                        fill="var(--surface-bright)"
                      />
                      <rect
                        x="9"
                        y="9"
                        width="4"
                        height="4"
                        fill="var(--dark)"
                      />
                      <rect
                        x="42"
                        y="4"
                        width="14"
                        height="14"
                        fill="var(--dark)"
                      />
                      <rect
                        x="45"
                        y="7"
                        width="8"
                        height="8"
                        fill="var(--surface-bright)"
                      />
                      <rect
                        x="47"
                        y="9"
                        width="4"
                        height="4"
                        fill="var(--dark)"
                      />
                      <rect
                        x="4"
                        y="42"
                        width="14"
                        height="14"
                        fill="var(--dark)"
                      />
                      <rect
                        x="7"
                        y="45"
                        width="8"
                        height="8"
                        fill="var(--surface-bright)"
                      />
                      <rect
                        x="9"
                        y="47"
                        width="4"
                        height="4"
                        fill="var(--dark)"
                      />
                      {/* Data bits */}
                      <rect
                        x="24"
                        y="8"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="30"
                        y="8"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="24"
                        y="14"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="36"
                        y="14"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="22"
                        y="22"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="28"
                        y="22"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="34"
                        y="22"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="40"
                        y="22"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="22"
                        y="28"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="28"
                        y="28"
                        width="3"
                        height="3"
                        fill="var(--primary)"
                      />
                      <rect
                        x="34"
                        y="28"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="22"
                        y="34"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="30"
                        y="34"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="40"
                        y="34"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="24"
                        y="40"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="36"
                        y="40"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="28"
                        y="46"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="34"
                        y="46"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                      <rect
                        x="40"
                        y="46"
                        width="3"
                        height="3"
                        fill="var(--dark)"
                      />
                    </svg>
                  </div>
                  <div className="success-qr-info">
                    <span className="success-qr-label">Your referral code</span>
                    <span className="success-qr-code">YOU25</span>
                    <span className="success-qr-hint">
                      Shareable once your email is verified
                    </span>
                  </div>
                </div>
              )}

              {segment === "professional" && (
                <a
                  href="https://cal.com/push-partner-ops"
                  target="_blank"
                  rel="noreferrer"
                  className="success-partner-call"
                >
                  <span
                    className="success-partner-call-dot"
                    aria-hidden="true"
                  />
                  Book your Partner-ops call &rarr;
                  <span className="success-partner-call-mono">cal.com</span>
                </a>
              )}

              <div className="success-cta-row">
                <Link
                  href={`/creator/onboarding?segment=${segment}`}
                  className="btn btn-primary success-cta"
                >
                  Continue to onboarding &rarr;
                </Link>
                <Link href="/explore" className="success-secondary-link">
                  Browse campaigns first
                </Link>
              </div>
            </div>
            <p className="form-footer">
              Wrong email? <Link href="/creator/signup">Start over</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ───────────────────────────────────────────── */

  return (
    <>
      <a href="#signup-form" className="skip-link">
        Skip to form
      </a>
      <div className="page">
        <BrandPanel />
        <div className="form-panel">
          <div className="form-wrap" id="signup-form">
            <div className="form-header">
              <span className="form-eyebrow">Creator Signup</span>
              <h1 className="form-title">Start Earning.</h1>
              <p className="form-subtitle">
                No follower minimum. No exclusivity. Just show up and create.
              </p>
            </div>

            {/* ── Two-Segment picker (v5.1) ──────────────── */}
            <fieldset
              className="segment-picker"
              aria-describedby="segment-hint"
            >
              <legend className="segment-legend">
                <span className="segment-num">01</span>
                Pick your path &mdash; Two-Segment Creator Economics, switch
                later.
              </legend>
              <div className="segment-grid">
                {SEGMENTS.map((s) => {
                  const active = segment === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`segment-card segment-card--${s.id} ${active ? "segment-card--active" : ""}`}
                      onClick={() => setSegment(s.id)}
                    >
                      <span className="segment-card-tier">{s.tierRange}</span>
                      <span className="segment-card-label">{s.label}</span>
                      <span className="segment-card-desc">{s.description}</span>
                      <span className="segment-card-meta">
                        <span className="segment-card-earn">
                          {s.earnExample}
                        </span>
                        <span className="segment-card-aud">
                          {s.targetFollowers}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p id="segment-hint" className="segment-hint">
                {segment === "professional"
                  ? "Partner-ops reviews every professional application. Expect a 2-day response — ConversionOracle™ baseline pulled from your last 30 posts."
                  : "You're matched within 48h of email verification. ConversionOracle™ predicts walk-in lift before each campaign."}
              </p>
            </fieldset>

            {/* ── Form content: animated on segment / mode change ── */}
            <div
              key={`${segment}-${magicLinkMode ? "ml" : "pw"}-${mlSent ? "sent" : "form"}`}
              className="su-step-frame"
            >
              {/* ── Magic link form (side-income default) ─────── */}
              {magicLinkMode && segment === "side-income" && !mlSent && (
                <form
                  onSubmit={handleMagicLink}
                  noValidate
                  className="ml-form"
                  aria-label="Magic link signup"
                >
                  <div
                    className="form-divider"
                    style={{ marginBottom: "20px" }}
                  >
                    <span className="form-divider-line" />
                    <span className="form-divider-label">
                      Quick start — magic link
                    </span>
                    <span className="form-divider-line" />
                  </div>

                  {mlError && (
                    <p
                      className="form-error"
                      role="alert"
                      style={{ marginBottom: "16px" }}
                    >
                      {mlError}
                    </p>
                  )}

                  <div className="form-field">
                    <label htmlFor="ml-email">Email</label>
                    <div className="field-wrap">
                      <input
                        id="ml-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@email.com"
                        value={mlEmail}
                        onChange={(e) => setMlEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="ml-zip">
                      ZIP code
                      {mlZip.trim() && (
                        <span
                          className={
                            mlZipEligible
                              ? "zip-badge zip-badge--ok"
                              : "zip-badge zip-badge--wait"
                          }
                        >
                          {mlZipEligible ? "✓ Pilot eligible" : "Waitlist"}
                        </span>
                      )}
                    </label>
                    <div className="field-wrap">
                      <input
                        id="ml-zip"
                        type="text"
                        required
                        placeholder="11211"
                        maxLength={10}
                        value={mlZip}
                        onChange={(e) => setMlZip(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="ml-ig">
                      Instagram handle{" "}
                      <span className="field-optional">(optional)</span>
                    </label>
                    <div className="field-wrap">
                      <input
                        id="ml-ig"
                        type="text"
                        placeholder="@yourhandle"
                        value={mlIg}
                        onChange={(e) => setMlIg(e.target.value)}
                      />
                    </div>
                  </div>

                  <label className="disclosure-check">
                    <input
                      type="checkbox"
                      checked={mlDisclosure}
                      onChange={(e) => setMlDisclosure(e.target.checked)}
                      required
                    />
                    <span>
                      I agree to DisclosureBot FTC compliance checks on all
                      posts made through Push campaigns.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={mlLoading}
                  >
                    {mlLoading ? "Sending…" : "Send me a magic link →"}
                  </button>

                  <div className="ml-form-footer">
                    <button
                      type="button"
                      className="ml-switch-btn"
                      onClick={() => setMagicLinkMode(false)}
                    >
                      Use password instead
                    </button>
                    <Link
                      href="/creator/signup?segment=professional"
                      className="ml-switch-btn"
                    >
                      I have 30K+ followers — go to pro →
                    </Link>
                  </div>
                </form>
              )}

              {/* ── Magic link sent confirmation ──────────────── */}
              {magicLinkMode && segment === "side-income" && mlSent && (
                <div className="ml-sent" role="status" aria-live="polite">
                  <div className="ml-sent-icon" aria-hidden="true">
                    ✉
                  </div>
                  <h2 className="ml-sent-title">Check your inbox.</h2>
                  <p className="ml-sent-body">
                    We sent a magic link to <strong>{mlEmail}</strong>. Click it
                    to finish creating your account and start onboarding.
                  </p>
                  <p className="ml-sent-note">
                    No email? Check spam, or{" "}
                    <button
                      type="button"
                      className="ml-resend"
                      onClick={() => setMlSent(false)}
                    >
                      try again
                    </button>
                    .
                  </p>
                </div>
              )}

              {/* ── Password form toggle header ───────────────── */}
              {!magicLinkMode && segment === "side-income" && (
                <div
                  className="ml-form-footer"
                  style={{ marginBottom: "20px" }}
                >
                  <button
                    type="button"
                    className="ml-switch-btn"
                    onClick={() => setMagicLinkMode(true)}
                  >
                    ← Back to magic link
                  </button>
                </div>
              )}

              {formError && !magicLinkMode && (
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

              {(!magicLinkMode || segment === "professional") && (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className={loading ? "form-loading" : ""}
                >
                  <div className="form-grid">
                    {/* ── Profile ──────────────────────────────── */}
                    <div className="form-divider">
                      <span className="form-divider-line" />
                      <span className="form-divider-label">Your Profile</span>
                      <span className="form-divider-line" />
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="name">Full Name</label>
                        <div className="field-wrap">
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
                            aria-describedby={
                              errors.name ? "err-name" : undefined
                            }
                          />
                          {fieldStatus.name === "valid" && (
                            <span className="field-dot" aria-hidden="true" />
                          )}
                        </div>
                        {errors.name && touched.name && (
                          <span className="error-msg" id="err-name">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      <div className="form-field">
                        <label htmlFor="location">City / Neighbourhood</label>
                        <div className="field-wrap">
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
                          />
                          {fieldStatus.location === "valid" && (
                            <span className="field-dot" aria-hidden="true" />
                          )}
                        </div>
                        {errors.location && touched.location && (
                          <span className="error-msg" id="err-location">
                            {errors.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── Account ──────────────────────────────── */}
                    <div
                      className={`form-divider ${revealEmail ? "" : "is-locked"}`}
                    >
                      <span className="form-divider-line" />
                      <span className="form-divider-label">Create Account</span>
                      <span className="form-divider-line" />
                    </div>

                    <div
                      className={`form-field field-reveal ${revealEmail ? "is-visible" : ""}`}
                    >
                      <label htmlFor="email">Email</label>
                      <div className="field-wrap">
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
                          aria-describedby={
                            errors.email ? "err-email" : undefined
                          }
                        />
                        {fieldStatus.email === "valid" && (
                          <span className="field-dot" aria-hidden="true" />
                        )}
                      </div>
                      {errors.email && touched.email && (
                        <span className="error-msg" id="err-email">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div
                      className={`form-row field-reveal ${revealPassword ? "is-visible" : ""}`}
                    >
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
                          />
                          <button
                            type="button"
                            className="input-action-btn"
                            onClick={() => setShowPw((v) => !v)}
                            aria-label={
                              showPw ? "Hide password" : "Show password"
                            }
                          >
                            {showPw ? "Hide" : "Show"}
                          </button>
                        </div>
                        {fields.password && pwStrength && (
                          <div
                            className="pw-strength"
                            id="pw-strength"
                            aria-live="polite"
                          >
                            <div className="pw-bar">
                              <div
                                className={`pw-fill pw-fill--${pwStrength}`}
                              />
                            </div>
                            <span
                              className={`pw-label pw-label--${pwStrength}`}
                            >
                              {pwStrength === "weak"
                                ? "Weak"
                                : pwStrength === "fair"
                                  ? "Fair"
                                  : "Strong — good to go"}
                            </span>
                          </div>
                        )}
                        {errors.password && touched.password && (
                          <span className="error-msg" id="err-password">
                            {errors.password}
                          </span>
                        )}
                      </div>

                      <div className="form-field">
                        <label htmlFor="confirm">Confirm Password</label>
                        <div className="input-with-action">
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
                        {errors.confirm && touched.confirm && (
                          <span className="error-msg" id="err-confirm">
                            {errors.confirm}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── Instagram OAuth mock (above Creator Details) ──── */}
                    <button
                      type="button"
                      className={`ig-oauth-btn ${instagramMockShown ? "ig-oauth-btn--used" : ""}`}
                      onClick={handleInstagramMock}
                    >
                      <span className="ig-oauth-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="0"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <circle
                            cx="17.5"
                            cy="6.5"
                            r="1"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="ig-oauth-label">
                        Sign up with Instagram
                      </span>
                      <span className="ig-oauth-meta">Creator preset</span>
                    </button>
                    <span className="ig-oauth-hint">
                      Or continue with email below &mdash; same Creator outcome.
                    </span>

                    {/* ── Creator details ───────────────────────── */}
                    <div className="form-divider">
                      <span className="form-divider-line" />
                      <span className="form-divider-label">
                        Creator Details
                      </span>
                      <span className="form-divider-line" />
                    </div>

                    <div className="form-field">
                      <label htmlFor="instagram">
                        Instagram Handle{" "}
                        <span className="label-optional">(optional)</span>
                      </label>
                      <div className="field-wrap">
                        <input
                          id="instagram"
                          name="instagram"
                          type="text"
                          value={fields.instagram}
                          onChange={set("instagram")}
                          onBlur={() => handleBlur("instagram")}
                          placeholder="@yourhandle"
                        />
                        {fieldStatus.instagram === "valid" &&
                          fields.instagram && (
                            <span className="field-dot" aria-hidden="true" />
                          )}
                      </div>
                      <span className="field-hint">
                        Helps match you with the right campaigns. Read-only — we
                        never post or change anything.
                      </span>
                    </div>

                    <div className="form-field">
                      <label htmlFor="bio">
                        Bio <span className="label-optional">(optional)</span>
                      </label>
                      <div className="bio-wrap">
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
                        />
                        <span
                          className={`bio-counter ${bioRemaining <= 20 ? "bio-counter--warn" : ""}`}
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {bioRemaining}
                        </span>
                      </div>
                    </div>

                    <p className="trust-line">
                      Free to join · No follower minimum · 200+ local campaigns
                    </p>

                    {/* Terms consent — required before signup */}
                    <div className="form-field terms-field">
                      <label className="terms-label">
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
                        />
                        <span>
                          I agree to the{" "}
                          <Link href="/terms" target="_blank">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" target="_blank">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {termsError && (
                        <span className="error-msg">{termsError}</span>
                      )}
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
                          <span className="sr-only">Creating account…</span>
                        </>
                      ) : (
                        "Join Push — Start Earning"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
            {/* /su-step-frame */}

            <p className="form-footer">
              Already have an account?{" "}
              <Link href="/creator/login">Sign in &rarr;</Link>
              <br />
              Want to list your business?{" "}
              <Link href="/merchant/signup">Merchant signup &rarr;</Link>
            </p>

            <Link href="/demo/creator" className="auth-demo-link">
              Try Demo Mode &mdash; no account needed &rarr;
            </Link>

            {/* ── Tier journey strip ────────────────────────── */}
            <div className="tier-preview">
              <span className="tier-preview-title">YOUR JOURNEY</span>
              <div className="tier-list">
                {TIERS.map((t, i) => (
                  <div key={t.label} className="tier-item" data-index={i}>
                    <span className="tier-icon" aria-hidden="true">
                      {t.icon}
                    </span>
                    <span className="tier-label">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Signup brand panel tier data (v5.1 Two-Segment) ────── */

const SIGNUP_TIERS = [
  {
    icon: "◎",
    label: "Seed · Clay",
    rate: "$12/customer",
    benefit: "Side-income entry — zero followers needed",
    color: "#b8a99a",
  },
  {
    icon: "◆",
    label: "Operator · Steel",
    rate: "$20/customer",
    benefit: "Cross-vertical access + priority routing",
    color: "#4a5568",
  },
  {
    icon: "★",
    label: "Partner · Obsidian",
    rate: "$3,500/mo + equity",
    benefit: "Retainer + 20% rev-share + 0.05–0.2% pool",
    color: "#c9a96e",
  },
];

/* ── Brand panel ─────────────────────────────────────────── */

function BrandPanel() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);

  /* Creator spotlight rotation — 7s cycle, 300ms fade */
  useEffect(() => {
    const id = window.setInterval(() => {
      setQuoteFade(false);
      window.setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % CREATOR_QUOTES.length);
        setQuoteFade(true);
      }, 300);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const current = CREATOR_QUOTES[quoteIdx];

  return (
    <div className="brand-panel signup-brand-panel">
      <div className="brand-top">
        <Link href="/" className="brand-logo">
          Push
        </Link>

        <div>
          <h2 className="brand-headline">
            Join 40+ creators
            <br />
            <em>earning on Push.</em>
          </h2>
          <p className="brand-tagline">
            Push connects micro-creators like you with local businesses that
            need real foot traffic. Visit, post, earn &mdash; and build a score
            that unlocks better campaigns.
          </p>
        </div>

        {/* First 3 tier preview */}
        <div className="auth-tier-preview signup-tier-preview">
          <span className="auth-tier-preview-label">YOUR STARTING PATH</span>
          {SIGNUP_TIERS.map((t) => (
            <div key={t.label} className="auth-tier-item signup-tier-item">
              <span
                className="auth-tier-icon"
                aria-hidden="true"
                style={{ color: t.color }}
              >
                {t.icon}
              </span>
              <div className="auth-tier-info">
                <span className="auth-tier-name">{t.label}</span>
                <span className="auth-tier-benefit">{t.benefit}</span>
              </div>
              <span className="auth-tier-rate">{t.rate}</span>
            </div>
          ))}
          <p className="auth-motivation">
            Your Push Score starts building from day one.
          </p>

          {/* ── Creator spotlight rotation ─────────────────── */}
          <div
            className={`creator-spotlight ${quoteFade ? "is-fade-in" : "is-fade-out"}`}
            aria-live="polite"
          >
            <span className="creator-spotlight-label">CREATOR SPOTLIGHT</span>
            <p className="creator-spotlight-quote">
              &ldquo;{current.quote}&rdquo;
            </p>
            <span className="creator-spotlight-attribution">
              {current.attribution}
            </span>
            <span className="creator-spotlight-detail">{current.detail}</span>
          </div>

          {/* ── Push Score explainer chip ──────────────────── */}
          <div className="push-score-chip" aria-hidden="true">
            <span className="push-score-dot" />
            <span className="push-score-label">
              Your Push Score · builds from visit #1
            </span>
          </div>
        </div>
      </div>

      <Link href="/" className="brand-back">
        &larr; Back to home
      </Link>
    </div>
  );
}
