"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ChecklistItem } from "@/components/onboarding/ChecklistItem";
import type { ChecklistItemStatus } from "@/components/onboarding/ChecklistItem";

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY = "push-demo-creator-onboarding-progress";

const TOTAL = 7;

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type SocialPlatform = "ig" | "tiktok" | "red";

type PayoutMethod = "venmo" | "cashapp" | "ach" | null;

type Progress = {
  completed: StepId[];
  skipped: StepId[];
  activeStep: StepId;
  profile: {
    name: string;
    handle: string;
    neighborhood: string;
    bio: string;
    avatar: string | null;
  };
  social: { ig: boolean; tiktok: boolean; red: boolean };
  identity: {
    idUploaded: boolean;
    selfieUploaded: boolean;
    liveCheckDone: boolean;
  };
  payout: { method: PayoutMethod; taxFormUploaded: boolean };
  discovery: { applied: string[] };
  notifs: { matches: boolean; applications: boolean; payments: boolean };
  callBooked: boolean;
};

const INITIAL: Progress = {
  completed: [],
  skipped: [],
  activeStep: 1,
  profile: { name: "", handle: "", neighborhood: "", bio: "", avatar: null },
  social: { ig: false, tiktok: false, red: false },
  identity: { idUploaded: false, selfieUploaded: false, liveCheckDone: false },
  payout: { method: null, taxFormUploaded: false },
  discovery: { applied: [] },
  notifs: { matches: true, applications: true, payments: true },
  callBooked: false,
};

const NYC_NEIGHBORHOODS = [
  "Williamsburg",
  "Bushwick",
  "LES",
  "East Village",
  "SoHo",
  "Astoria",
  "Crown Heights",
  "Harlem",
  "Greenpoint",
  "Bed-Stuy",
  "Park Slope",
  "Hell's Kitchen",
  "Chelsea",
  "Ridgewood",
  "Jackson Heights",
];

const BIO_MAX = 120;
const BIO_CHAMPAGNE = 60;
const BIO_WARN = 80;

const CAMPAIGNS = [
  {
    id: "sey",
    brand: "Sey Coffee",
    neighborhood: "East Williamsburg",
    brief: "Morning pour-over ritual content. Coffee+ vertical.",
    payout: "$42 per verified walk-in",
    photo: "linear-gradient(135deg, #c9a96e 0%, #669bbc 100%)",
    accent: "#c9a96e",
  },
  {
    id: "devocion",
    brand: "Devoción",
    neighborhood: "Williamsburg",
    brief: "Single-origin Colombian. Editorial shots preferred.",
    payout: "$38 per verified walk-in",
    photo: "linear-gradient(135deg, #780000 0%, #c1121f 100%)",
    accent: "#c1121f",
  },
  {
    id: "partners",
    brand: "Partners Coffee",
    neighborhood: "Greenpoint",
    brief: "Flight tasting reels. Weekend peak coverage.",
    payout: "$45 per verified walk-in",
    photo: "linear-gradient(135deg, #003049 0%, #669bbc 100%)",
    accent: "#003049",
  },
] as const;

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */

function load(): Progress {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    return { ...INITIAL, ...JSON.parse(raw) };
  } catch {
    return INITIAL;
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function stepStatus(id: StepId, p: Progress): ChecklistItemStatus {
  if (p.completed.includes(id)) return "done";
  if (p.skipped.includes(id)) return "skipped";
  if (id === p.activeStep) return "active";
  const prev = (id - 1) as StepId;
  if (id === 1) return "active";
  if (p.completed.includes(prev) || p.skipped.includes(prev)) return "active";
  return "locked";
}

/* ─────────────────────────────────────────────────────────────
   Step 1 — Profile basics
   ───────────────────────────────────────────────────────────── */

function ProfileStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { profile } = progress;
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canProceed =
    profile.name.trim().length > 0 &&
    profile.handle.trim().length > 0 &&
    profile.neighborhood.trim().length > 0;

  const filteredHoods = NYC_NEIGHBORHOODS.filter((n) =>
    n.toLowerCase().includes(profile.neighborhood.toLowerCase()),
  ).slice(0, 6);

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      onChange({ profile: { ...profile, avatar: url } });
    } catch {
      /* ignore */
    }
  }

  const bioLen = profile.bio.length;
  const bioCountClass =
    bioLen >= BIO_WARN
      ? "ob2-char-count ob2-char-count--warn"
      : bioLen >= BIO_CHAMPAGNE
        ? "ob2-char-count cr-char-count--champagne"
        : "ob2-char-count";

  return (
    <div>
      {/* Avatar — real preview */}
      <div className="ob2-avatar-row">
        <button
          type="button"
          className="ob2-avatar-btn cr-avatar-btn"
          aria-label="Upload profile photo"
          onClick={() => fileInputRef.current?.click()}
          style={
            profile.avatar
              ? {
                  backgroundImage: `url(${profile.avatar})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderStyle: "solid",
                }
              : undefined
          }
        >
          {!profile.avatar && <span aria-hidden="true">+</span>}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="cr-visually-hidden"
          onChange={handleAvatarPick}
        />
        <div className="ob2-avatar-info">
          <p className="ob2-avatar-title">
            {profile.avatar ? "Photo loaded" : "Add a profile photo"}
          </p>
          <p className="ob2-avatar-sub">
            {profile.avatar
              ? "Tap to replace"
              : "Helps Williamsburg Coffee+ merchants recognize you"}
          </p>
        </div>
      </div>

      <div className="ob2-field-row">
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="cr-name">
            Display name
          </label>
          <input
            id="cr-name"
            className="ob2-input"
            type="text"
            placeholder="How brands see you"
            value={profile.name}
            onChange={(e) =>
              onChange({ profile: { ...profile, name: e.target.value } })
            }
            autoComplete="name"
          />
        </div>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="cr-handle">
            Handle
          </label>
          <input
            id="cr-handle"
            className="ob2-input"
            type="text"
            placeholder="@yourhandle"
            value={profile.handle}
            onChange={(e) =>
              onChange({ profile: { ...profile, handle: e.target.value } })
            }
          />
        </div>
      </div>

      {/* Neighborhood — combobox */}
      <div className="ob2-field cr-combobox">
        <label className="ob2-label" htmlFor="cr-neighborhood">
          NYC neighborhood
        </label>
        <input
          id="cr-neighborhood"
          className="ob2-input"
          type="text"
          placeholder="e.g. Williamsburg, LES, Astoria"
          value={profile.neighborhood}
          onChange={(e) =>
            onChange({ profile: { ...profile, neighborhood: e.target.value } })
          }
          onFocus={() => setNeighborhoodOpen(true)}
          onBlur={() => setTimeout(() => setNeighborhoodOpen(false), 150)}
          autoComplete="off"
          aria-expanded={neighborhoodOpen}
          aria-autocomplete="list"
        />
        {neighborhoodOpen && filteredHoods.length > 0 && (
          <ul className="cr-combobox-list" role="listbox">
            {filteredHoods.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  className="cr-combobox-option"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange({
                      profile: { ...profile, neighborhood: n },
                    });
                    setNeighborhoodOpen(false);
                  }}
                >
                  {n}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="cr-bio">
          Short bio
        </label>
        <textarea
          id="cr-bio"
          className="ob2-textarea"
          placeholder="What makes your content unique?"
          value={profile.bio}
          maxLength={BIO_MAX}
          onChange={(e) =>
            onChange({ profile: { ...profile, bio: e.target.value } })
          }
        />
        <p className={bioCountClass}>
          {bioLen}/{BIO_MAX}
        </p>
      </div>

      {/* First impression preview — shown once basics filled */}
      {canProceed && (
        <div className="cr-first-impression">
          <p className="cr-first-impression-eyebrow">
            First impression preview
          </p>
          <div className="cr-first-impression-card">
            <div
              className="cr-first-impression-avatar"
              style={
                profile.avatar
                  ? {
                      backgroundImage: `url(${profile.avatar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
              aria-hidden="true"
            >
              {!profile.avatar && (profile.name?.[0]?.toUpperCase() ?? "P")}
            </div>
            <div className="cr-first-impression-body">
              <p className="cr-first-impression-name">
                {profile.name || "Your name"}
              </p>
              <p className="cr-first-impression-meta">
                {profile.handle || "@handle"} · {profile.neighborhood || "NYC"}
              </p>
              {profile.bio && (
                <p className="cr-first-impression-bio">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!canProceed}
        >
          Save profile →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 2 — Social connect (mock OAuth)
   ───────────────────────────────────────────────────────────── */

type OAuthState = "idle" | "loading" | "connected";

function SocialStep({
  progress,
  onChange,
  onComplete,
  onSkip,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const { social } = progress;
  const [pending, setPending] = useState<SocialPlatform | null>(null);
  const anyConnected = social.ig || social.tiktok || social.red;

  const platforms: {
    key: SocialPlatform;
    label: string;
    handle: string;
    accent: string;
  }[] = [
    { key: "ig", label: "Instagram", handle: "@you · IG", accent: "#c1121f" },
    { key: "tiktok", label: "TikTok", handle: "@you · TT", accent: "#003049" },
    {
      key: "red",
      label: "Xiaohongshu",
      handle: "@you · RED",
      accent: "#c9a96e",
    },
  ];

  function stateOf(key: SocialPlatform): OAuthState {
    if (social[key]) return "connected";
    if (pending === key) return "loading";
    return "idle";
  }

  function connect(key: SocialPlatform) {
    if (social[key] || pending) return;
    setPending(key);
    window.setTimeout(() => {
      onChange({ social: { ...social, [key]: true } });
      setPending(null);
    }, 800);
  }

  return (
    <div>
      <div className="cr-oauth-grid">
        {platforms.map(({ key, label, handle, accent }) => {
          const s = stateOf(key);
          return (
            <button
              key={key}
              type="button"
              className={`cr-oauth-card cr-oauth-card--${s}`}
              style={{ borderTopColor: accent }}
              onClick={() => connect(key)}
              disabled={pending !== null || social[key]}
              aria-busy={s === "loading"}
            >
              <span className="cr-oauth-brand">{label}</span>
              <span className="cr-oauth-handle">
                {s === "connected" ? handle : `Connect ${label}`}
              </span>
              <span className={`cr-oauth-state cr-oauth-state--${s}`}>
                {s === "loading" && (
                  <>
                    <span className="cr-spinner" aria-hidden="true" />
                    Authorizing…
                  </>
                )}
                {s === "connected" && (
                  <>
                    <span className="cr-verified-badge" aria-hidden="true">
                      ✓
                    </span>
                    Verified · Read-only
                  </>
                )}
                {s === "idle" && "OAuth (mock)"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="ob2-input-hint cr-hint-muted">
        Read-only · We never post for you. Used only for match scoring inside
        the Customer Acquisition Engine.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!anyConnected}
        >
          Confirm →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 3 — Identity verify (mock KYC)
   ───────────────────────────────────────────────────────────── */

function IdentityStep({
  progress,
  onChange,
  onComplete,
  onSkip,
  isPro,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
  onSkip: () => void;
  isPro: boolean;
}) {
  const { identity } = progress;
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const [idThumb, setIdThumb] = useState<string | null>(null);
  const [selfieThumb, setSelfieThumb] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  function pickFile(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "id" | "selfie",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      if (kind === "id") {
        setIdThumb(url);
        onChange({ identity: { ...identity, idUploaded: true } });
      } else {
        setSelfieThumb(url);
        onChange({ identity: { ...identity, selfieUploaded: true } });
      }
    } catch {
      /* ignore */
    }
  }

  function startLiveCheck() {
    if (countdown !== null) return;
    setCountdown(3);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      onChange({ identity: { ...identity, liveCheckDone: true } });
      setCountdown(null);
      return;
    }
    const t = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const allDone =
    identity.idUploaded && identity.selfieUploaded && identity.liveCheckDone;

  return (
    <div>
      {isPro && (
        <div className="cr-pro-required">
          <span className="cr-pro-required-badge">Required</span>
          <p className="cr-pro-required-copy">
            Partner contracts on the Customer Acquisition Engine need verified
            identity before the first campaign goes live.
          </p>
        </div>
      )}

      <div className="cr-kyc-grid">
        {/* ID upload */}
        <div
          className={`cr-kyc-tile${identity.idUploaded ? " cr-kyc-tile--done" : ""}`}
        >
          <p className="cr-kyc-eyebrow">01 · Government ID</p>
          <button
            type="button"
            className="cr-kyc-upload"
            onClick={() => idInputRef.current?.click()}
            style={
              idThumb
                ? {
                    backgroundImage: `url(${idThumb})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            aria-label="Upload ID photo"
          >
            {!idThumb && (
              <span className="cr-kyc-upload-label">
                Tap to upload
                <br />
                <small>Driver's license / passport</small>
              </span>
            )}
          </button>
          <input
            ref={idInputRef}
            type="file"
            accept="image/*"
            className="cr-visually-hidden"
            onChange={(e) => pickFile(e, "id")}
          />
        </div>

        {/* Selfie upload */}
        <div
          className={`cr-kyc-tile${identity.selfieUploaded ? " cr-kyc-tile--done" : ""}`}
        >
          <p className="cr-kyc-eyebrow">02 · Selfie</p>
          <button
            type="button"
            className="cr-kyc-upload"
            onClick={() => selfieInputRef.current?.click()}
            style={
              selfieThumb
                ? {
                    backgroundImage: `url(${selfieThumb})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            aria-label="Upload selfie"
          >
            {!selfieThumb && (
              <span className="cr-kyc-upload-label">
                Tap to upload
                <br />
                <small>Clear, well-lit photo</small>
              </span>
            )}
          </button>
          <input
            ref={selfieInputRef}
            type="file"
            accept="image/*"
            className="cr-visually-hidden"
            onChange={(e) => pickFile(e, "selfie")}
          />
        </div>
      </div>

      {/* Live-check */}
      <div
        className={`cr-kyc-live${identity.liveCheckDone ? " cr-kyc-live--done" : ""}`}
      >
        <div>
          <p className="cr-kyc-eyebrow">03 · Liveness check</p>
          <p className="cr-kyc-live-desc">
            {identity.liveCheckDone
              ? "Liveness captured."
              : countdown !== null
                ? `Hold still… ${countdown}s`
                : "3-second hold. We match your selfie to the live frame."}
          </p>
        </div>
        <button
          type="button"
          className="ob2-btn-secondary"
          onClick={startLiveCheck}
          disabled={countdown !== null || identity.liveCheckDone}
        >
          {identity.liveCheckDone
            ? "Captured ✓"
            : countdown !== null
              ? `${countdown}…`
              : "Start check"}
        </button>
      </div>

      {allDone && (
        <div className="cr-kyc-status">
          <span className="cr-kyc-status-dot" aria-hidden="true" />
          Verification in progress · 2–4 min typical
        </div>
      )}

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!allDone}
        >
          Submit for review →
        </button>
        {!isPro && (
          <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 4 — Payout setup
   ───────────────────────────────────────────────────────────── */

function PayoutStep({
  progress,
  onChange,
  onComplete,
  onSkip,
  isPro,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
  onSkip: () => void;
  isPro: boolean;
}) {
  const { payout } = progress;
  const taxInputRef = useRef<HTMLInputElement>(null);
  const [taxName, setTaxName] = useState<string | null>(null);

  function pickMethod(m: PayoutMethod) {
    onChange({ payout: { ...payout, method: m } });
  }

  function pickTaxFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setTaxName(file.name);
    onChange({ payout: { ...payout, taxFormUploaded: true } });
  }

  const methods: { key: PayoutMethod; label: string; desc: string }[] = isPro
    ? [
        {
          key: "ach",
          label: "ACH direct deposit",
          desc: "Retainer + performance — monthly wire",
        },
      ]
    : [
        { key: "venmo", label: "Venmo", desc: "Per-customer, 48h release" },
        {
          key: "cashapp",
          label: "Cash App",
          desc: "Per-customer, 48h release",
        },
        { key: "ach", label: "Bank (ACH)", desc: "1–2 day release, zero fees" },
      ];

  return (
    <div>
      <div className="cr-payout-grid">
        {methods.map(({ key, label, desc }) => (
          <button
            key={key}
            type="button"
            className={`cr-payout-card${payout.method === key ? " cr-payout-card--active" : ""}`}
            onClick={() => pickMethod(key)}
          >
            <span className="cr-payout-card-label">{label}</span>
            <span className="cr-payout-card-desc">{desc}</span>
            {payout.method === key && (
              <span className="cr-payout-card-check" aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {/* W-9 upload (pro only) */}
      {isPro && (
        <div className="cr-tax-box">
          <div>
            <p className="cr-tax-title">W-9 / 1099 pre-collection</p>
            <p className="cr-tax-desc">
              {payout.taxFormUploaded
                ? `Uploaded: ${taxName ?? "tax-form.pdf"}`
                : "PDF or image. Required before first retainer payout."}
            </p>
          </div>
          <button
            type="button"
            className="ob2-btn-secondary"
            onClick={() => taxInputRef.current?.click()}
          >
            {payout.taxFormUploaded ? "Replace" : "Upload"}
          </button>
          <input
            ref={taxInputRef}
            type="file"
            accept=".pdf,image/*"
            className="cr-visually-hidden"
            onChange={pickTaxFile}
          />
        </div>
      )}

      <p className="ob2-input-hint cr-hint-muted">
        Save anytime — you can add additional methods later from your wallet.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!payout.method}
        >
          Save payout →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 5 — Discovery (live-ish campaigns)
   ───────────────────────────────────────────────────────────── */

function DiscoveryStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const applied = progress.discovery.applied;

  function apply(id: string) {
    if (applied.includes(id)) return;
    onChange({
      discovery: { applied: [...applied, id] },
    });
  }

  return (
    <div>
      <div className="cr-campaigns-grid">
        {CAMPAIGNS.map((c) => {
          const isApplied = applied.includes(c.id);
          return (
            <article key={c.id} className="cr-campaign-card">
              <div
                className="cr-campaign-photo"
                style={{ backgroundImage: c.photo }}
                aria-hidden="true"
              >
                <span className="cr-campaign-photo-tag">{c.neighborhood}</span>
              </div>
              <div className="cr-campaign-body">
                <h4 className="cr-campaign-brand">{c.brand}</h4>
                <p className="cr-campaign-brief">{c.brief}</p>
                <p className="cr-campaign-payout" style={{ color: c.accent }}>
                  {c.payout}
                </p>
                <button
                  type="button"
                  className={`cr-campaign-cta${isApplied ? " cr-campaign-cta--applied" : ""}`}
                  onClick={() => apply(c.id)}
                  disabled={isApplied}
                >
                  {isApplied ? "Submitted ✓" : "Apply"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {applied.length > 0 && (
        <div className="cr-apply-celebrate">
          <strong>{applied.length}</strong> application
          {applied.length === 1 ? "" : "s"} submitted · check status in
          dashboard
        </div>
      )}

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={applied.length === 0}
        >
          Continue →
        </button>
        <Link href="/creator/explore" className="ob2-btn-ghost">
          Browse all campaigns
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 6 — Notifications (unchanged pattern)
   ───────────────────────────────────────────────────────────── */

function NotifsStep({
  progress,
  onChange,
  onComplete,
  onSkip,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const { notifs } = progress;

  function toggle(key: keyof typeof notifs) {
    onChange({ notifs: { ...notifs, [key]: !notifs[key] } });
  }

  const items = [
    {
      key: "matches" as const,
      name: "Campaign matches",
      desc: "New Coffee+ campaigns that match your Neighborhood Playbook",
    },
    {
      key: "applications" as const,
      name: "Application updates",
      desc: "When brands accept or decline your application",
    },
    {
      key: "payments" as const,
      name: "Payment releases",
      desc: "When your verified-customer earnings hit your wallet",
    },
  ];

  return (
    <div>
      {items.map(({ key, name, desc }) => (
        <div key={key} className="ob2-toggle-row">
          <div className="ob2-toggle-info">
            <p className="ob2-toggle-name">{name}</p>
            <p className="ob2-toggle-desc">{desc}</p>
          </div>
          <label className="ob2-toggle-switch">
            <input
              type="checkbox"
              checked={notifs[key]}
              onChange={() => toggle(key)}
            />
            <span className="ob2-toggle-track" />
          </label>
        </div>
      ))}

      <div className="ob2-step-actions" style={{ marginTop: 24 }}>
        <button type="button" className="ob2-btn-primary" onClick={onComplete}>
          Save preferences →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 7 — Invite link (side-income) / Strategy call (pro)
   ───────────────────────────────────────────────────────────── */

function InviteStep({
  progress,
  onChange,
  onComplete,
  isPro,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
  isPro: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://push.nyc/invite/YOU25";

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function bookCall() {
    onChange({ callBooked: true });
  }

  if (isPro) {
    return (
      <div>
        <div className="cr-callbook">
          <p className="cr-callbook-eyebrow">Partner-ops strategy call</p>
          <h3 className="cr-callbook-title">Book a 30-min intake call.</h3>
          <p className="cr-callbook-desc">
            Partner-ops will align your Two-Segment Creator Economics lane
            (retainer vs. rev-share vs. equity), pull in the relevant
            Williamsburg Coffee+ Neighborhood Playbook, and set your first
            campaign goal.
          </p>

          <div className="cr-callbook-slots" aria-hidden="true">
            <div className="cr-callbook-slot">Tue · 10:00 AM</div>
            <div className="cr-callbook-slot">Wed · 2:30 PM</div>
            <div className="cr-callbook-slot">Fri · 11:00 AM</div>
          </div>

          <button
            type="button"
            className={`ob2-btn-primary${progress.callBooked ? " cr-btn-booked" : ""}`}
            onClick={bookCall}
            disabled={progress.callBooked}
          >
            {progress.callBooked
              ? "Booked ✓ — invite sent to email"
              : "Open Cal.com ↗"}
          </button>
        </div>

        <div className="ob2-step-actions">
          <button
            type="button"
            className="ob2-btn-primary"
            onClick={onComplete}
            disabled={!progress.callBooked}
          >
            Finish setup →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ob2-invite-box cr-invite-box">
        <p className="ob2-invite-label">Referral bonus</p>
        <h3 className="ob2-invite-headline">
          Give $25.
          <br />
          Get <em>$25</em>.
        </h3>
        <div className="ob2-invite-link-row">
          <input
            type="text"
            className="ob2-invite-link-input"
            value={inviteLink}
            readOnly
            aria-label="Your invite link"
          />
          <button
            type="button"
            className="ob2-invite-copy-btn"
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="cr-share-row">
          <a
            className="cr-share-btn"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent("I'm on Push — the Customer Acquisition Engine for NYC. Join with my invite:")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X / Twitter"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
            <span>X</span>
          </a>
          <button
            type="button"
            className="cr-share-btn"
            onClick={handleCopy}
            aria-label="Copy link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                d="M9 3h10v14M5 7h10v14H5z"
              />
            </svg>
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <a
            className="cr-share-btn"
            href={`mailto:?subject=${encodeURIComponent("Join me on Push")}&body=${encodeURIComponent("I'm on Push — the Customer Acquisition Engine for NYC Coffee+. Use my invite: " + inviteLink)}`}
            aria-label="Share via email"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                d="M3 5h18v14H3zM3 5l9 8 9-8"
              />
            </svg>
            <span>Email</span>
          </a>
        </div>
      </div>
      <p className="ob2-input-hint cr-hint-muted">
        Both you and your friend earn $25 after their first verified walk-in.
      </p>
      <div className="ob2-step-actions">
        <button type="button" className="ob2-btn-primary" onClick={onComplete}>
          Done →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step metadata
   ───────────────────────────────────────────────────────────── */

const STEPS: {
  id: StepId;
  title: string;
  description: string;
  skippable: boolean;
}[] = [
  {
    id: 1,
    title: "Profile basics",
    description: "Name, handle, neighborhood, and avatar",
    skippable: false,
  },
  {
    id: 2,
    title: "Social connect",
    description: "Link Instagram, TikTok, or Xiaohongshu",
    skippable: true,
  },
  {
    id: 3,
    title: "Identity verify",
    description: "Required for paid campaigns",
    skippable: true,
  },
  {
    id: 4,
    title: "Payout setup",
    description: "Connect your bank or debit card",
    skippable: true,
  },
  {
    id: 5,
    title: "First campaign discovery",
    description: "Explore live campaigns near you",
    skippable: true,
  },
  {
    id: 6,
    title: "Notification prefs",
    description: "Choose what updates you receive",
    skippable: true,
  },
  {
    id: 7,
    title: "Get your invite link",
    description: "Refer a friend — both get $25",
    skippable: false,
  },
];

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */

type Segment = "side-income" | "professional";

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>(INITIAL);
  const [expandedStep, setExpandedStep] = useState<StepId | null>(1);
  const [mounted, setMounted] = useState(false);
  const [segment, setSegment] = useState<Segment>("side-income");

  useEffect(() => {
    const p = load();
    setProgress(p);
    setExpandedStep(p.activeStep);
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get("segment");
      const fromStorage = localStorage.getItem("push-creator-segment");
      const resolved =
        fromQuery === "professional" || fromStorage === "professional"
          ? "professional"
          : "side-income";
      setSegment(resolved);
      try {
        localStorage.setItem("push-creator-segment", resolved);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const update = useCallback((partial: Partial<Progress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...partial };
      save(next);
      return next;
    });
  }, []);

  function completeStep(id: StepId) {
    const nextStep = (id < TOTAL ? id + 1 : id) as StepId;
    const next: Progress = {
      ...progress,
      completed: [...progress.completed.filter((c) => c !== id), id],
      skipped: progress.skipped.filter((s) => s !== id),
      activeStep: nextStep,
    };
    save(next);
    setProgress(next);
    setExpandedStep(id === TOTAL ? null : nextStep);
  }

  function skipStep(id: StepId) {
    const nextStep = (id < TOTAL ? id + 1 : id) as StepId;
    const next: Progress = {
      ...progress,
      skipped: [...progress.skipped.filter((s) => s !== id), id],
      activeStep: nextStep,
    };
    save(next);
    setProgress(next);
    setExpandedStep(id === TOTAL ? null : nextStep);
  }

  function toggleExpand(id: StepId) {
    setExpandedStep((prev) => (prev === id ? null : id));
  }

  const completedCount = progress.completed.length + progress.skipped.length;
  const isComplete = completedCount >= TOTAL;

  if (!mounted) return null;

  const isPro = segment === "professional";

  return (
    <OnboardingShell
      role="Creator"
      totalSteps={TOTAL}
      currentStep={progress.activeStep}
      completedSteps={completedCount}
      isComplete={isComplete}
      onDashboard={() => router.push("/creator/dashboard")}
    >
      <div
        className={`ob2-segment-banner ob2-segment-banner--${segment}`}
        role="status"
      >
        <span className="ob2-segment-eyebrow">
          {isPro ? "Partner Track · T4–T6" : "Creator Track · T1–T3"}
        </span>
        <p className="ob2-segment-copy">
          {isPro ? (
            <>
              Welcome. Partner-ops will reach out within 2 business days to
              schedule a strategy call. Meanwhile, finish these steps so we can
              fast-track your intake into the Customer Acquisition Engine.
            </>
          ) : (
            <>
              Finish these 7 steps to unlock your first Williamsburg Coffee+
              campaign. Typical time-to-first-campaign: 48 hours.
            </>
          )}
        </p>
      </div>

      {/* All-complete banner (shown briefly once all steps done, before shell flips to celebrate) */}
      {isComplete && (
        <div className="cr-all-set" role="status">
          <div className="cr-confetti" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className={`cr-confetti-piece cr-confetti-piece--${i % 6}`}
              />
            ))}
          </div>
          <p className="cr-all-set-eyebrow">All set</p>
          <h3 className="cr-all-set-title">
            SLR counting starts now · Month-12 target 25
          </h3>
          <button
            type="button"
            className="ob2-btn-primary cr-pulse"
            onClick={() => router.push("/creator/dashboard")}
          >
            Go to dashboard →
          </button>
        </div>
      )}

      {STEPS.map(({ id, title, description }) => {
        const proDescriptions: Partial<Record<StepId, string>> = {
          3: "Required — Partner contracts need verified identity",
          4: "Retainer payout setup (monthly ACH)",
          7: "Book your strategy call with Partner-ops",
        };
        const effectiveDescription = isPro
          ? (proDescriptions[id] ?? description)
          : description;
        const status = stepStatus(id, progress);
        const isExpanded = expandedStep === id;

        return (
          <ChecklistItem
            key={id}
            index={id}
            total={TOTAL}
            title={title}
            description={effectiveDescription}
            status={status}
            isExpanded={isExpanded}
            onExpand={() => toggleExpand(id)}
          >
            {id === 1 && (
              <ProfileStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(1)}
              />
            )}
            {id === 2 && (
              <SocialStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(2)}
                onSkip={() => skipStep(2)}
              />
            )}
            {id === 3 && (
              <IdentityStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(3)}
                onSkip={() => skipStep(3)}
                isPro={isPro}
              />
            )}
            {id === 4 && (
              <PayoutStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(4)}
                onSkip={() => skipStep(4)}
                isPro={isPro}
              />
            )}
            {id === 5 && (
              <DiscoveryStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(5)}
              />
            )}
            {id === 6 && (
              <NotifsStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(6)}
                onSkip={() => skipStep(6)}
              />
            )}
            {id === 7 && (
              <InviteStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(7)}
                isPro={isPro}
              />
            )}
          </ChecklistItem>
        );
      })}
    </OnboardingShell>
  );
}
