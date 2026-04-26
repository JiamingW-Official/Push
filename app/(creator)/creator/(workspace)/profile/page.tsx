"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    color: string;
  }
> = {
  seed: {
    label: "Seed",
    minScore: 0,
    maxScore: 39,
    nextTier: "explorer",
    color: "var(--tier-seed)",
  },
  explorer: {
    label: "Explorer",
    minScore: 40,
    maxScore: 54,
    nextTier: "operator",
    color: "var(--tier-explorer)",
  },
  operator: {
    label: "Operator",
    minScore: 55,
    maxScore: 64,
    nextTier: "proven",
    color: "var(--tier-operator)",
  },
  proven: {
    label: "Proven",
    minScore: 65,
    maxScore: 77,
    nextTier: "closer",
    color: "var(--tier-proven)",
  },
  closer: {
    label: "Closer",
    minScore: 78,
    maxScore: 87,
    nextTier: "partner",
    color: "var(--tier-closer)",
  },
  partner: {
    label: "Partner",
    minScore: 88,
    maxScore: 100,
    nextTier: null,
    color: "var(--tier-partner)",
  },
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

function getCompletionRate(completed: number, accepted: number): string {
  if (accepted === 0) return "—";
  return `${Math.round((completed / accepted) * 100)}%`;
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
  const [form, setForm] = useState<FormState>({
    name: "",
    location: "",
    instagram_handle: "",
    tiktok_handle: "",
    bio: "",
    instagram_followers: "",
  });

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

    // Real auth flow
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
      // Simulate a short save delay in demo mode
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

  return (
    <>
      <div className="cw-page">
        <header className="cw-header">
          <div className="cw-header__left">
            <p className="cw-eyebrow cw-eyebrow--live">
              MY PROFILE · {tierCfg.label.toUpperCase()} TIER
            </p>
            <h1 className="cw-title">
              {creator.name?.split(" ")[0] || "Creator"}
            </h1>
          </div>
          <div className="cw-header__right">
            {saveSuccess && (
              <span className="cw-pill cw-pill--success">
                ✓ {isDemo ? "Saved (demo)" : "Profile updated"}
              </span>
            )}
            <Link href="/creator/portfolio" className="cw-pill">
              View public profile →
            </Link>
          </div>
        </header>

        <div className="profile-page">
          {/* ── 2-column layout ─────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 24,
              paddingTop: 32,
              alignItems: "start",
            }}
          >
            {/* LEFT: Identity card */}
            <div className="pf-identity-card">
              {/* Avatar */}
              <div
                className="pf-avatar"
                style={{ border: `3px solid ${tierCfg.color}` }}
              >
                <span className="pf-avatar-initials">
                  {getInitials(creator.name)}
                </span>
              </div>

              <div>
                <h2 className="pf-name">{creator.name}</h2>
                {creator.location && (
                  <p className="pf-location">{creator.location}</p>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <TierBadge tier={creator.tier} size="md" variant="subtle" />
              </div>

              {creator.bio && <p className="pf-bio">{creator.bio}</p>}

              {creator.instagram_handle && (
                <span className="pf-handle">@{creator.instagram_handle}</span>
              )}

              <p className="pf-member-since">Member since April 2026</p>

              <button
                className="btn-ghost click-shift"
                onClick={() => setEditOpen((v) => !v)}
                type="button"
                style={{ width: "100%" }}
              >
                {editOpen ? "Close Editor" : "Edit Profile"}
              </button>

              <Link href="/creator/portfolio" className="pf-preview-link">
                Preview Public Profile →
              </Link>
            </div>

            {/* RIGHT: Stats + Earnings + Tier */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Stats grid */}
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
                  <div key={stat.label} className="pf-stat-card">
                    <span className="pf-stat-value">{stat.value}</span>
                    <span className="pf-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Earnings card */}
              <div className="pf-earnings-card">
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
              </div>

              {/* Tier Journey */}
              <div className="pf-tier-card">
                <span className="pf-eyebrow">TIER JOURNEY</span>
                <TierJourney
                  currentTier={creator.tier}
                  currentScore={creator.push_score}
                />
                <div style={{ marginTop: 24 }}>
                  <TierBenefitsPanel
                    currentTier={creator.tier}
                    currentScore={creator.push_score}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Edit Form ─────────────────────────────────────── */}
          {editOpen && (
            <div className="pf-edit-card">
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
                <div className="pf-form-row" style={{ marginTop: 16 }}>
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
                  <div className="pf-avatar-notice-sm">
                    {getInitials(creator.name)}
                  </div>
                  <span className="pf-avatar-notice-text">
                    Profile photo upload coming soon
                  </span>
                </div>

                {/* Form actions */}
                <div className="pf-form-actions">
                  <button
                    type="button"
                    className="btn-ghost click-shift"
                    onClick={() => setEditOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary click-shift"
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
