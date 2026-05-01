"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Video,
  MapPin,
  Pencil,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/db/browser";
import { TierBadge } from "@/components/creator/TierBadge";
import { TierJourney } from "@/components/creator/TierJourney";
import { TierBenefitsPanel } from "@/components/creator/TierBenefitsPanel";
import "./profile.css";

// ── Types ────────────────────────────────────────────────────────────────────

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type Creator = {
  id: string;
  name: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  earnings_total: number;
  earnings_pending: number;
  instagram_followers?: number;
  tiktok_followers?: number;
};

type TabKey = "overview" | "social" | "preferences";

// ── Demo helpers ─────────────────────────────────────────────────────────────

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

const DEMO_CREATOR: Creator = {
  id: "demo-creator-001",
  name: "Alex Chen",
  instagram_handle: "alexcheneats",
  tiktok_handle: "",
  location: "Lower East Side NYC",
  bio: "NYC food & lifestyle creator. Always hunting for the next hidden gem.",
  avatar_url: undefined,
  tier: "operator",
  push_score: 71,
  campaigns_completed: 12,
  campaigns_accepted: 14,
  earnings_total: 340,
  earnings_pending: 0,
  instagram_followers: 4200,
  tiktok_followers: 0,
};

// ── Tier config ───────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<
  CreatorTier,
  {
    label: string;
    minScore: number;
    maxScore: number;
    nextTier: CreatorTier | null;
  }
> = {
  seed: { label: "Seed", minScore: 0, maxScore: 39, nextTier: "explorer" },
  explorer: {
    label: "Explorer",
    minScore: 40,
    maxScore: 54,
    nextTier: "operator",
  },
  operator: {
    label: "Operator",
    minScore: 55,
    maxScore: 64,
    nextTier: "proven",
  },
  proven: { label: "Proven", minScore: 65, maxScore: 77, nextTier: "closer" },
  closer: { label: "Closer", minScore: 78, maxScore: 87, nextTier: "partner" },
  partner: { label: "Partner", minScore: 88, maxScore: 100, nextTier: null },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

function formatFollowers(n?: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

function getCompletionRate(completed: number, accepted: number): string {
  if (accepted === 0) return "—";
  return `${Math.round((completed / accepted) * 100)}%`;
}

// Profile completeness — used by the floating liquid-glass tile.
// Counts the 5 user-fillable identity fields (name + location + bio + IG + IG followers).
// Tiktok is optional and excluded so that creators who only use IG can still hit 100%.
function getProfileCompleteness(c: Creator): {
  pct: number;
  missing: string[];
} {
  const checks: { key: string; ok: boolean }[] = [
    { key: "name", ok: Boolean(c.name?.trim()) },
    { key: "location", ok: Boolean(c.location?.trim()) },
    { key: "bio", ok: Boolean(c.bio?.trim() && c.bio.trim().length >= 20) },
    { key: "instagram_handle", ok: Boolean(c.instagram_handle?.trim()) },
    {
      key: "instagram_followers",
      ok: Boolean(c.instagram_followers && c.instagram_followers > 0),
    },
  ];
  const ok = checks.filter((c) => c.ok).length;
  return {
    pct: Math.round((ok / checks.length) * 100),
    missing: checks.filter((c) => !c.ok).map((c) => c.key),
  };
}

// ── Editable form state ───────────────────────────────────────────────────────

type FormState = {
  name: string;
  location: string;
  instagram_handle: string;
  tiktok_handle: string;
  bio: string;
  instagram_followers: string;
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreatorProfilePage() {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [form, setForm] = useState<FormState>({
    name: "",
    location: "",
    instagram_handle: "",
    tiktok_handle: "",
    bio: "",
    instagram_followers: "",
  });

  const editPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const demo = checkDemoMode();
    setIsDemo(demo);

    if (demo) {
      setCreator(DEMO_CREATOR);
      setForm({
        name: DEMO_CREATOR.name,
        location: DEMO_CREATOR.location ?? "",
        instagram_handle: DEMO_CREATOR.instagram_handle ?? "",
        tiktok_handle: DEMO_CREATOR.tiktok_handle ?? "",
        bio: DEMO_CREATOR.bio ?? "",
        instagram_followers: DEMO_CREATOR.instagram_followers
          ? String(DEMO_CREATOR.instagram_followers)
          : "",
      });
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.replace("/creator/signup");
        return;
      }

      const { data } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (data) {
        setCreator(data as Creator);
        setForm({
          name: data.name ?? "",
          location: data.location ?? "",
          instagram_handle: data.instagram_handle ?? "",
          tiktok_handle: data.tiktok_handle ?? "",
          bio: data.bio ?? "",
          instagram_followers: data.instagram_followers
            ? String(data.instagram_followers)
            : "",
        });
      }

      setLoading(false);
    }

    load();
  }, [router]);

  // Esc closes the edit panel
  useEffect(() => {
    if (!editOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setEditOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editOpen]);

  // Scroll the edit panel into view when it opens
  useEffect(() => {
    if (editOpen && editPanelRef.current) {
      editPanelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editOpen]);

  const completeness = useMemo(
    () => (creator ? getProfileCompleteness(creator) : { pct: 0, missing: [] }),
    [creator],
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 160) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (isDemo) {
      await new Promise((r) => setTimeout(r, 400));
      setSaving(false);
      setSaveSuccess(true);
      setEditOpen(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      return;
    }

    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      await supabase
        .from("creators")
        .update({
          name: form.name,
          location: form.location,
          instagram_handle: form.instagram_handle,
          tiktok_handle: form.tiktok_handle || null,
          bio: form.bio,
          instagram_followers: form.instagram_followers
            ? Number(form.instagram_followers)
            : null,
        })
        .eq("user_id", authUser.id);
    }

    setSaving(false);
    setSaveSuccess(true);
    setEditOpen(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  if (loading) {
    return <div className="profile-loading">Loading…</div>;
  }

  if (!creator) {
    return <div className="profile-loading">Creator not found.</div>;
  }

  const tierCfg = TIER_CONFIG[creator.tier];
  const initials = getInitials(creator.name);
  const isPartner = creator.tier === "partner";

  return (
    <div className="cw-page pf-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow">PROFILE</p>
          <h1 className="cw-title">
            {creator.name?.split(" ")[0] || "Creator"}
          </h1>
        </div>
        <div className="cw-header__right">
          {saveSuccess && (
            <span className="cw-pill cw-pill--success" role="status">
              <Check size={14} strokeWidth={2.25} aria-hidden />
              {isDemo ? "Saved (demo)" : "Profile updated"}
            </span>
          )}
          <Link href="/creator/portfolio" className="cw-pill">
            View public profile{" "}
            <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </header>

      <div className="profile-page">
        {/* ── 2-column layout ─────────────────────────────── */}
        <div className="pf-layout">
          {/* LEFT: Photo Card identity ─────────────────────── */}
          <aside className="pf-identity" aria-label="Identity">
            <div className="pf-photo-card">
              {/* Avatar surface — image when available, initials fallback */}
              <div
                className="pf-photo-card__surface"
                role="img"
                aria-label={`${creator.name} profile photo`}
              >
                {creator.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={creator.avatar_url}
                    alt=""
                    className="pf-photo-card__img"
                  />
                ) : (
                  <span className="pf-photo-card__initials" aria-hidden>
                    {initials}
                  </span>
                )}

                {/* Floating tier badge — pill, top-right (Photo Card Floating Badge § 8.9.6) */}
                <span
                  className={`pf-photo-card__badge${
                    isPartner ? " pf-photo-card__badge--ceremonial" : ""
                  }`}
                  aria-label={`Tier: ${tierCfg.label}`}
                >
                  {tierCfg.label}
                </span>

                {/* Bottom gradient + name overlay (§ 8.7) */}
                <div className="pf-photo-card__overlay">
                  <h2 className="pf-photo-card__name">{creator.name}</h2>
                  {creator.location && (
                    <span className="pf-photo-card__meta">
                      <MapPin size={12} strokeWidth={2} aria-hidden />
                      {creator.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary pf-edit-btn"
              onClick={() => setEditOpen((v) => !v)}
              aria-expanded={editOpen}
              aria-controls="pf-edit-panel"
            >
              <Pencil size={14} strokeWidth={2} aria-hidden />
              {editOpen ? "Close editor" : "Edit profile"}
            </button>

            {/* Quick handle row */}
            <div className="pf-handle-strip">
              {creator.instagram_handle ? (
                <a
                  className="pf-handle-row click-shift"
                  href={`https://instagram.com/${creator.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="pf-handle-row__icon">
                    <Camera size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="pf-handle-row__text">
                    <span className="pf-handle-row__handle">
                      @{creator.instagram_handle}
                    </span>
                    <span className="pf-handle-row__followers">
                      {formatFollowers(creator.instagram_followers)}
                    </span>
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  className="pf-handle-row pf-handle-row--empty click-shift"
                  onClick={() => setEditOpen(true)}
                >
                  <span className="pf-handle-row__icon">
                    <Camera size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="pf-handle-row__text">
                    <span className="pf-handle-row__handle">Add Instagram</span>
                    <span className="pf-handle-row__followers">required</span>
                  </span>
                </button>
              )}

              {creator.tiktok_handle ? (
                <a
                  className="pf-handle-row click-shift"
                  href={`https://tiktok.com/@${creator.tiktok_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="pf-handle-row__icon">
                    <Video size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="pf-handle-row__text">
                    <span className="pf-handle-row__handle">
                      @{creator.tiktok_handle}
                    </span>
                    <span className="pf-handle-row__followers">
                      {formatFollowers(creator.tiktok_followers)}
                    </span>
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  className="pf-handle-row pf-handle-row--empty click-shift"
                  onClick={() => setEditOpen(true)}
                >
                  <span className="pf-handle-row__icon">
                    <Video size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="pf-handle-row__text">
                    <span className="pf-handle-row__handle">Add TikTok</span>
                    <span className="pf-handle-row__followers">optional</span>
                  </span>
                </button>
              )}
            </div>

            <p className="pf-member-since">Member since April 2026</p>
          </aside>

          {/* RIGHT: Tabs + Stats + Earnings + Tier ────────── */}
          <div className="pf-main">
            {/* Segmented tab control */}
            <div
              className="pf-tabs"
              role="tablist"
              aria-label="Profile sections"
            >
              {[
                { key: "overview" as TabKey, label: "Overview" },
                { key: "social" as TabKey, label: "Social" },
                { key: "preferences" as TabKey, label: "Preferences" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === key}
                  aria-pressed={activeTab === key}
                  className={`pf-tab${activeTab === key ? " is-active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="pf-tabpanel" role="tabpanel">
                {/* Stats card with floating liquid-glass completeness tile */}
                <section className="pf-stats-card">
                  <span className="pf-eyebrow">PERFORMANCE</span>

                  <div className="pf-stats-grid">
                    {[
                      {
                        value: creator.campaigns_completed,
                        label: "Campaigns Completed",
                      },
                      {
                        value: getCompletionRate(
                          creator.campaigns_completed,
                          creator.campaigns_accepted,
                        ),
                        label: "Completion Rate",
                      },
                      {
                        value: formatCurrency(creator.earnings_total),
                        label: "Total Earned",
                      },
                      { value: creator.push_score, label: "Push Score" },
                    ].map((stat) => (
                      <div key={stat.label} className="pf-stat">
                        <span className="pf-stat__value">{stat.value}</span>
                        <span className="pf-stat__label">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Liquid-glass completeness tile (§ 8.9.3 Use Case 2) */}
                  <div
                    className="lg-surface pf-completeness"
                    aria-label={`Profile ${completeness.pct} percent complete`}
                  >
                    <span className="pf-completeness__numeral">
                      {completeness.pct}%
                    </span>
                    <span className="pf-completeness__label">
                      Profile complete
                    </span>
                    {completeness.pct < 100 && (
                      <button
                        type="button"
                        className="pf-completeness__cta"
                        onClick={() => setEditOpen(true)}
                      >
                        Finish setup →
                      </button>
                    )}
                  </div>
                </section>

                {/* Bio block */}
                <section className="pf-bio-card">
                  <span className="pf-eyebrow">ABOUT</span>
                  {creator.bio ? (
                    <p className="pf-bio">{creator.bio}</p>
                  ) : (
                    <button
                      type="button"
                      className="pf-empty-link"
                      onClick={() => setEditOpen(true)}
                    >
                      Add a short bio so brands know who you are.
                    </button>
                  )}
                </section>

                {/* Earnings */}
                <section className="pf-earnings-card">
                  <span className="pf-eyebrow">EARNINGS</span>
                  <div className="pf-earnings-grid">
                    {[
                      {
                        value: formatCurrency(creator.earnings_total),
                        label: "Total Earned",
                      },
                      {
                        value:
                          creator.earnings_pending > 0
                            ? formatCurrency(creator.earnings_pending)
                            : "—",
                        label: "Pending Payout",
                      },
                      { value: "—", label: "This Month" },
                    ].map((item) => (
                      <div key={item.label} className="pf-earnings-item">
                        <div className="pf-earnings-value">{item.value}</div>
                        <div className="pf-earnings-label">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Tier */}
                <section className="pf-tier-card">
                  <span className="pf-eyebrow">TIER</span>
                  <div className="pf-tier-card__head">
                    <TierBadge tier={creator.tier} size="md" variant="subtle" />
                    <span className="pf-tier-card__caption">
                      {tierCfg.nextTier
                        ? `Next: ${TIER_CONFIG[tierCfg.nextTier].label}`
                        : "Top tier"}
                    </span>
                  </div>
                  <TierJourney
                    currentTier={creator.tier}
                    currentScore={creator.push_score}
                  />
                  <div className="pf-tier-card__benefits">
                    <TierBenefitsPanel
                      currentTier={creator.tier}
                      currentScore={creator.push_score}
                    />
                  </div>
                </section>
              </div>
            )}

            {/* Tab: Social */}
            {activeTab === "social" && (
              <div className="pf-tabpanel" role="tabpanel">
                <section className="pf-social-card">
                  <span className="pf-eyebrow">CONNECTED PLATFORMS</span>
                  <div className="pf-social-grid">
                    <div
                      className={`pf-social-tile${
                        !creator.instagram_handle
                          ? " pf-social-tile--empty"
                          : ""
                      }`}
                    >
                      <div className="pf-social-tile__head">
                        <span className="pf-social-tile__icon">
                          <Camera size={20} strokeWidth={2} aria-hidden />
                        </span>
                        <span className="pf-social-tile__platform">
                          Instagram
                        </span>
                      </div>
                      {creator.instagram_handle ? (
                        <>
                          <span className="pf-social-tile__handle">
                            @{creator.instagram_handle}
                          </span>
                          <div className="pf-social-tile__stats">
                            <span className="pf-social-tile__stat">
                              {formatFollowers(creator.instagram_followers)}
                              <em>followers</em>
                            </span>
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="pf-empty-link"
                          onClick={() => setEditOpen(true)}
                        >
                          Connect Instagram →
                        </button>
                      )}
                    </div>

                    <div
                      className={`pf-social-tile${
                        !creator.tiktok_handle ? " pf-social-tile--empty" : ""
                      }`}
                    >
                      <div className="pf-social-tile__head">
                        <span className="pf-social-tile__icon">
                          <Video size={20} strokeWidth={2} aria-hidden />
                        </span>
                        <span className="pf-social-tile__platform">TikTok</span>
                      </div>
                      {creator.tiktok_handle ? (
                        <>
                          <span className="pf-social-tile__handle">
                            @{creator.tiktok_handle}
                          </span>
                          <div className="pf-social-tile__stats">
                            <span className="pf-social-tile__stat">
                              {formatFollowers(creator.tiktok_followers)}
                              <em>followers</em>
                            </span>
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="pf-empty-link"
                          onClick={() => setEditOpen(true)}
                        >
                          Connect TikTok →
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Tab: Preferences */}
            {activeTab === "preferences" && (
              <div className="pf-tabpanel" role="tabpanel">
                <section className="pf-pref-card">
                  <span className="pf-eyebrow">PREFERENCES</span>
                  <p className="pf-pref-empty">
                    Categories, neighborhoods, and brief preferences land here
                    next. For now, manage your basics in{" "}
                    <strong>Overview</strong>.
                  </p>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* ── Edit Form ─────────────────────────────────────── */}
        {editOpen && (
          <div
            className="pf-edit-card"
            id="pf-edit-panel"
            ref={editPanelRef}
            role="region"
            aria-label="Edit profile"
          >
            <span className="pf-edit-eyebrow">EDIT PROFILE</span>

            <form onSubmit={handleSave}>
              <div className="pf-form-grid">
                {/* Display Name */}
                <div className="pf-form-row">
                  <label className="pf-form-label" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="pf-input"
                  />
                </div>

                {/* Location */}
                <div className="pf-form-row">
                  <label className="pf-form-label" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Lower East Side NYC"
                    className="pf-input"
                  />
                </div>

                {/* Instagram Handle */}
                <div className="pf-form-row">
                  <label className="pf-form-label" htmlFor="instagram_handle">
                    Instagram Handle
                  </label>
                  <div className="pf-input-prefix-wrap">
                    <span className="pf-input-prefix">@</span>
                    <input
                      id="instagram_handle"
                      name="instagram_handle"
                      type="text"
                      value={form.instagram_handle}
                      onChange={handleChange}
                      placeholder="yourhandle"
                      className="pf-input pf-input--prefixed"
                    />
                  </div>
                </div>

                {/* TikTok Handle */}
                <div className="pf-form-row">
                  <label className="pf-form-label" htmlFor="tiktok_handle">
                    TikTok Handle{" "}
                    <span className="pf-form-label-meta">(optional)</span>
                  </label>
                  <div className="pf-input-prefix-wrap">
                    <span className="pf-input-prefix">@</span>
                    <input
                      id="tiktok_handle"
                      name="tiktok_handle"
                      type="text"
                      value={form.tiktok_handle}
                      onChange={handleChange}
                      placeholder="yourhandle"
                      className="pf-input pf-input--prefixed"
                    />
                  </div>
                </div>

                {/* Instagram Followers */}
                <div className="pf-form-row">
                  <label
                    className="pf-form-label"
                    htmlFor="instagram_followers"
                  >
                    Instagram Followers
                  </label>
                  <input
                    id="instagram_followers"
                    name="instagram_followers"
                    type="number"
                    min={0}
                    value={form.instagram_followers}
                    onChange={handleChange}
                    placeholder="e.g. 4200"
                    className="pf-input"
                  />
                </div>
              </div>

              {/* Bio — full width */}
              <div className="pf-form-row pf-form-row--full">
                <label className="pf-form-label" htmlFor="bio">
                  Bio
                  <span className="pf-form-label-count">
                    {form.bio.length}/160
                  </span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell brands a bit about yourself…"
                  rows={3}
                  maxLength={160}
                  className="pf-textarea"
                />
              </div>

              {/* Profile photo notice */}
              <div className="pf-avatar-notice">
                <div className="pf-avatar-notice-sm" aria-hidden>
                  {initials}
                </div>
                <span className="pf-avatar-notice-text">
                  Profile photo upload coming soon
                </span>
              </div>

              {/* Form actions */}
              <div className="pf-form-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
