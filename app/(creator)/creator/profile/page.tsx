"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
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
  email?: string;
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
  email: "alex@example.com",
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
    color: "#b8a99a",
  },
  explorer: {
    label: "Explorer",
    minScore: 40,
    maxScore: 54,
    nextTier: "operator",
    color: "#8c6239",
  },
  operator: {
    label: "Operator",
    minScore: 55,
    maxScore: 64,
    nextTier: "proven",
    color: "#4a5568",
  },
  proven: {
    label: "Proven",
    minScore: 65,
    maxScore: 77,
    nextTier: "closer",
    color: "#c9a96e",
  },
  closer: {
    label: "Closer",
    minScore: 78,
    maxScore: 87,
    nextTier: "partner",
    color: "#9b111e",
  },
  partner: {
    label: "Partner",
    minScore: 88,
    maxScore: 100,
    nextTier: null,
    color: "#1a1a2e",
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

// ── Toggle Component ──────────────────────────────────────────────────────────

function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="pf-toggle-switch" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="pf-toggle-track" />
      <span className="pf-toggle-thumb" />
    </label>
  );
}

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

  // Notification toggles state
  const [notifCampaigns, setNotifCampaigns] = useState(true);
  const [notifPayouts, setNotifPayouts] = useState(true);
  const [notifMessages, setNotifMessages] = useState(false);

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
    <div className="profile-page">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="profile-topbar">
        <Link href="/dashboard" className="profile-back-link">
          <span className="profile-back-arrow">←</span>
          Dashboard
        </Link>
        <span className="profile-topbar-title">Profile Settings</span>
        {saveSuccess && (
          <p className="save-toast">
            {isDemo ? "Saved (demo)" : "Profile updated"}
          </p>
        )}
      </div>

      {/* ── Hero Section ────────────────────────────────────── */}
      <div className="pf-hero">
        {/* Avatar */}
        <div className="pf-avatar" style={{ borderColor: tierCfg.color }}>
          <span className="pf-avatar-initials">
            {getInitials(creator.name)}
          </span>
        </div>

        {/* Identity */}
        <div className="pf-hero-identity">
          <h1 className="pf-name">{creator.name}</h1>
          <div className="pf-hero-meta-row">
            <TierBadge tier={creator.tier} size="md" variant="subtle" />
            {creator.location && (
              <span className="pf-meta-item">
                <span className="pf-meta-icon">◎</span>
                {creator.location}
              </span>
            )}
            {creator.instagram_handle && (
              <span className="pf-meta-item">
                <span className="pf-meta-icon">@</span>
                {creator.instagram_handle}
              </span>
            )}
          </div>
          {creator.bio && <p className="pf-bio">{creator.bio}</p>}
          <p className="pf-member-since">Member since April 2026</p>
        </div>

        {/* Push Score + Edit */}
        <div className="pf-hero-right">
          <div className="pf-score-display">
            <span className="pf-score-number">{creator.push_score}</span>
            <span className="pf-score-label">Push Score</span>
          </div>
          <button
            className="pf-edit-btn"
            onClick={() => setEditOpen((v) => !v)}
            type="button"
          >
            {editOpen ? "Close" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <div className="pf-stats-grid">
        <div className="pf-stat-card">
          <div className="pf-stat-value">{creator.campaigns_completed}</div>
          <div className="pf-stat-label">Campaigns Completed</div>
        </div>
        <div className="pf-stat-card">
          <div className="pf-stat-value">
            {getCompletionRate(
              creator.campaigns_completed,
              creator.campaigns_accepted,
            )}
          </div>
          <div className="pf-stat-label">Completion Rate</div>
        </div>
        <div className="pf-stat-card">
          <div className="pf-stat-value">
            {formatCurrency(creator.earnings_total)}
          </div>
          <div className="pf-stat-label">Total Earned</div>
        </div>
        <div className="pf-stat-card pf-stat-card--score">
          <div className="pf-stat-value">{creator.push_score}</div>
          <div className="pf-stat-label">
            Push Score
            <span className="pf-stat-tier-inline">
              <TierBadge
                tier={creator.tier}
                size="sm"
                variant="filled"
                showIcon={false}
              />
            </span>
          </div>
        </div>
      </div>

      {/* ── Earnings Summary ─────────────────────────────────── */}
      <div className="pf-earnings-section">
        <p className="pf-section-title">Earnings</p>
        <div className="pf-earnings-grid">
          <div className="pf-earnings-item">
            <span className="pf-earnings-value">
              {formatCurrency(creator.earnings_total)}
            </span>
            <span className="pf-earnings-label">Total Earned</span>
          </div>
          <div className="pf-earnings-item">
            <span className="pf-earnings-value">
              {creator.earnings_pending > 0
                ? formatCurrency(creator.earnings_pending)
                : "—"}
            </span>
            <span className="pf-earnings-label">Pending Payout</span>
          </div>
          <div className="pf-earnings-item">
            <span className="pf-earnings-value">—</span>
            <span className="pf-earnings-label">This Month</span>
          </div>
        </div>
      </div>

      {/* ── Tier & Score Section ─────────────────────────────── */}
      <div className="pf-tier-section">
        <p className="pf-section-title">Tier Journey</p>
        <TierJourney
          currentTier={creator.tier}
          currentScore={creator.push_score}
        />
        <div className="pf-benefits-wrap">
          <TierBenefitsPanel
            currentTier={creator.tier}
            currentScore={creator.push_score}
          />
        </div>
      </div>

      {/* ── Edit Form (collapsible) ──────────────────────────── */}
      {editOpen && (
        <div className="pf-edit-section">
          <p className="pf-section-title">Edit Profile</p>
          <div className="profile-form-card">
            <div className="profile-form-card-header">
              <span className="profile-form-card-header-title">
                Account Settings
              </span>
            </div>
            <form onSubmit={handleSave} className="profile-form">
              {/* ── Identity Section ── */}
              <div className="form-section">
                <p className="form-section-eyebrow">Identity</p>

                {/* Avatar notice */}
                <div
                  className="profile-avatar-notice"
                  style={{ marginBottom: 20 }}
                >
                  <div className="profile-avatar-sm">
                    {getInitials(creator.name)}
                  </div>
                  <div>
                    <span className="profile-avatar-notice-text">
                      Profile photo upload
                    </span>
                    <br />
                    <span className="profile-avatar-notice-badge">
                      Coming soon
                    </span>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-row">
                    <label className="form-label" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label" htmlFor="location">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className="form-input"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Lower East Side NYC"
                    />
                  </div>
                </div>

                <div className="form-row" style={{ marginTop: 16 }}>
                  <label className="form-label" htmlFor="bio">
                    Bio
                    <span className="form-label-chars">
                      {form.bio.length}/160
                    </span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-input form-textarea"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell brands a bit about yourself…"
                    maxLength={160}
                  />
                </div>
              </div>

              {/* ── Social Section ── */}
              <div className="form-section">
                <p className="form-section-eyebrow">Social Platforms</p>
                <div className="form-grid-2">
                  <div className="form-row">
                    <label className="form-label" htmlFor="instagram_handle">
                      Instagram
                    </label>
                    <div className="form-input-prefix-wrap">
                      <span className="form-input-prefix">@</span>
                      <input
                        id="instagram_handle"
                        name="instagram_handle"
                        type="text"
                        className="form-input form-input--prefixed"
                        value={form.instagram_handle}
                        onChange={handleChange}
                        placeholder="yourhandle"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label" htmlFor="tiktok_handle">
                      TikTok
                      <span className="form-label-optional">(optional)</span>
                    </label>
                    <div className="form-input-prefix-wrap">
                      <span className="form-input-prefix">@</span>
                      <input
                        id="tiktok_handle"
                        name="tiktok_handle"
                        type="text"
                        className="form-input form-input--prefixed"
                        value={form.tiktok_handle}
                        onChange={handleChange}
                        placeholder="yourhandle"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label" htmlFor="instagram_followers">
                      Instagram Followers
                    </label>
                    <input
                      id="instagram_followers"
                      name="instagram_followers"
                      type="number"
                      min={0}
                      className="form-input"
                      value={form.instagram_followers}
                      onChange={handleChange}
                      placeholder="e.g. 4200"
                    />
                  </div>
                </div>
              </div>

              {/* ── Contact Section ── */}
              <div className="form-section">
                <p className="form-section-eyebrow">Contact</p>
                <div className="form-grid-2">
                  <div className="form-row">
                    <label className="form-label" htmlFor="email_readonly">
                      Email
                    </label>
                    <input
                      id="email_readonly"
                      type="email"
                      className="form-input form-input--readonly"
                      value={creator.email ?? "—"}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* ── Notifications Section ── */}
              <div className="form-section">
                <p className="form-section-eyebrow">Notifications</p>
                <div className="pf-toggle-row">
                  <div className="pf-toggle-info">
                    <span className="pf-toggle-label">New Campaigns</span>
                    <span className="pf-toggle-desc">
                      Get notified when new campaigns match your tier
                    </span>
                  </div>
                  <Toggle
                    id="notif-campaigns"
                    checked={notifCampaigns}
                    onChange={setNotifCampaigns}
                  />
                </div>
                <div className="pf-toggle-row">
                  <div className="pf-toggle-info">
                    <span className="pf-toggle-label">Payout Updates</span>
                    <span className="pf-toggle-desc">
                      Notify when payouts are processed
                    </span>
                  </div>
                  <Toggle
                    id="notif-payouts"
                    checked={notifPayouts}
                    onChange={setNotifPayouts}
                  />
                </div>
                <div className="pf-toggle-row">
                  <div className="pf-toggle-info">
                    <span className="pf-toggle-label">Messages</span>
                    <span className="pf-toggle-desc">
                      Merchant and platform messages
                    </span>
                  </div>
                  <Toggle
                    id="notif-messages"
                    checked={notifMessages}
                    onChange={setNotifMessages}
                  />
                </div>
              </div>

              {/* Form actions */}
              <div className="pf-form-actions">
                <button
                  type="button"
                  className="pf-cancel-btn"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
