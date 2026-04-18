"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { SettingsShell, NavItem } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow, Channel } from "@/components/settings/ToggleRow";
import { SelectRow } from "@/components/settings/SelectRow";
import { InputRow } from "@/components/settings/InputRow";
import "@/components/settings/settings.css";

/* ── Demo detection ─────────────────────────────────────────── */
function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Types ──────────────────────────────────────────────────── */

type NotifChannel = { email: boolean; push: boolean; sms: boolean };

interface NotifSettings {
  newCampaignMatch: NotifChannel;
  applicationAccepted: NotifChannel;
  applicationRejected: NotifChannel;
  paymentReceived: NotifChannel;
  milestoneReminder: NotifChannel;
  weeklyDigest: NotifChannel;
  newFollowerOnPush: NotifChannel;
  campaignDeadlineWarning: NotifChannel;
  proofApproved: NotifChannel;
  proofRejected: NotifChannel;
  tierUpgrade: NotifChannel;
  marketingUpdates: NotifChannel;
}

interface CreatorSettings {
  displayName: string;
  bio: string;
  location: string;
  languages: string[];
  avatarUrl: string | null;
  notifications: NotifSettings;
  privacy: {
    publicProfile: boolean;
    showEarnings: boolean;
    adPreferences: boolean;
  };
  payouts: {
    method: string;
    threshold: number;
  };
}

/* ── Default data ───────────────────────────────────────────── */

const DEFAULT_SETTINGS: CreatorSettings = {
  displayName: "Alex Rivera",
  bio: "NYC-based lifestyle creator. I make content that actually converts.",
  location: "New York, NY",
  languages: ["English"],
  avatarUrl: null,
  notifications: {
    newCampaignMatch: { email: true, push: true, sms: false },
    applicationAccepted: { email: true, push: true, sms: false },
    applicationRejected: { email: true, push: false, sms: false },
    paymentReceived: { email: true, push: true, sms: true },
    milestoneReminder: { email: true, push: true, sms: false },
    weeklyDigest: { email: true, push: false, sms: false },
    newFollowerOnPush: { email: false, push: true, sms: false },
    campaignDeadlineWarning: { email: true, push: true, sms: false },
    proofApproved: { email: true, push: true, sms: false },
    proofRejected: { email: true, push: true, sms: false },
    tierUpgrade: { email: true, push: true, sms: false },
    marketingUpdates: { email: false, push: false, sms: false },
  },
  privacy: {
    publicProfile: true,
    showEarnings: false,
    adPreferences: true,
  },
  payouts: {
    method: "bank",
    threshold: 50,
  },
};

const STORAGE_KEY = "push-demo-creator-settings";

/* ── Nav ────────────────────────────────────────────────────── */

const NAV_ITEMS: NavItem[] = [
  { key: "profile", label: "Profile", icon: "◉" },
  { key: "account", label: "Account", icon: "◈" },
  { key: "notifications", label: "Notifications", icon: "◎" },
  { key: "payouts", label: "Payouts", icon: "◇" },
  { key: "privacy", label: "Privacy", icon: "◆" },
  { key: "danger", label: "Danger Zone", icon: "⚑", danger: true },
];

const NOTIF_LABELS: Record<keyof NotifSettings, [string, string]> = {
  newCampaignMatch: [
    "New campaign match",
    "A campaign matching your tier and niche is posted",
  ],
  applicationAccepted: [
    "Application accepted",
    "A merchant accepted your campaign application",
  ],
  applicationRejected: [
    "Application rejected",
    "A merchant declined your application",
  ],
  paymentReceived: [
    "Payment received",
    "Earnings are deposited to your account",
  ],
  milestoneReminder: [
    "Milestone reminder",
    "Reminder when a campaign milestone is due",
  ],
  weeklyDigest: [
    "Weekly digest",
    "Weekly summary of your activity and earnings",
  ],
  newFollowerOnPush: ["New follower", "Someone followed you on Push"],
  campaignDeadlineWarning: [
    "Deadline warning",
    "48h before a campaign deadline closes",
  ],
  proofApproved: ["Proof approved", "Merchant approved your submitted proof"],
  proofRejected: ["Proof rejected", "Merchant requested changes to your proof"],
  tierUpgrade: ["Tier upgrade", "Your Push score has unlocked a new tier"],
  marketingUpdates: [
    "Marketing emails",
    "Product updates, tips, and announcements from Push",
  ],
};

/* ── Confirm modal ──────────────────────────────────────────── */

function ConfirmModal({
  title,
  description,
  confirmWord,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmWord?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [input, setInput] = useState("");
  const ready = !confirmWord || input === confirmWord;

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-modal__title">{title}</h3>
        <p className="confirm-modal__desc">{description}</p>
        {confirmWord && (
          <div>
            <label className="confirm-modal__input-label">
              Type <strong>{confirmWord}</strong> to confirm
            </label>
            <input
              className="push-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={confirmWord}
              autoFocus
            />
          </div>
        )}
        <div className="confirm-modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn--danger"
            disabled={!ready}
            onClick={onConfirm}
            style={{ opacity: ready ? 1 : 0.4 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function CreatorSettingsPage() {
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState<CreatorSettings>(DEFAULT_SETTINGS);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [langInput, setLangInput] = useState("");
  const [modal, setModal] = useState<null | "deactivate" | "delete">(null);

  /* load */
  useEffect(() => {
    const demo = checkDemoMode();
    setIsDemo(demo);
    if (demo) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setSettings(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    } else {
      fetch("/api/creator/settings")
        .then((r) => r.json())
        .then((d: CreatorSettings) => setSettings(d))
        .catch(() => {
          /* use defaults */
        });
    }
  }, []);

  /* helpers */
  const patch = useCallback(
    <K extends keyof CreatorSettings>(key: K, value: CreatorSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
      setSaveStatus("idle");
    },
    [],
  );

  const patchNotif = useCallback(
    (key: keyof NotifSettings, value: NotifChannel) => {
      setSettings((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: value },
      }));
      setDirty(true);
      setSaveStatus("idle");
    },
    [],
  );

  const patchPrivacy = useCallback(
    <K extends keyof CreatorSettings["privacy"]>(
      key: K,
      value: CreatorSettings["privacy"][K],
    ) => {
      setSettings((prev) => ({
        ...prev,
        privacy: { ...prev.privacy, [key]: value },
      }));
      setDirty(true);
      setSaveStatus("idle");
    },
    [],
  );

  const save = useCallback(async () => {
    setSaveStatus("saving");
    if (isDemo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      await new Promise((r) => setTimeout(r, 500));
    } else {
      await fetch("/api/creator/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    }
    setSaveStatus("saved");
    setDirty(false);
    setTimeout(() => setSaveStatus("idle"), 2500);
  }, [isDemo, settings]);

  const addLang = (lang: string) => {
    const trimmed = lang.trim();
    if (!trimmed || settings.languages.includes(trimmed)) return;
    patch("languages", [...settings.languages, trimmed]);
    setLangInput("");
  };

  const removeLang = (lang: string) => {
    patch(
      "languages",
      settings.languages.filter((l) => l !== lang),
    );
  };

  const initials = settings.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /* notif toggle helper */
  const notifAny = (key: keyof NotifSettings) =>
    Object.values(settings.notifications[key]).some(Boolean);

  const toggleNotifMaster = (key: keyof NotifSettings, on: boolean) => {
    if (on) {
      patchNotif(key, { email: true, push: true, sms: false });
    } else {
      patchNotif(key, { email: false, push: false, sms: false });
    }
  };

  const toggleNotifChannel = (
    key: keyof NotifSettings,
    channel: Channel,
    value: boolean,
  ) => {
    patchNotif(key, { ...settings.notifications[key], [channel]: value });
  };

  /* ── Render sections ────────────────────────────────────── */

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Profile</h1>
              <p className="settings-page-heading__sub">
                Your public creator identity on Push
              </p>
            </div>

            <SettingsSection title="Photo">
              <div className="avatar-upload">
                <div className="avatar-upload__preview">
                  {settings.avatarUrl ? (
                    <img src={settings.avatarUrl} alt="Avatar" />
                  ) : (
                    <span className="avatar-upload__initials">{initials}</span>
                  )}
                </div>
                <div className="avatar-upload__info">
                  <span className="avatar-upload__label">Profile photo</span>
                  <span className="avatar-upload__hint">
                    JPG or PNG, max 4 MB
                  </span>
                  <button
                    className="btn btn--ghost btn--sm"
                    style={{ marginTop: 8 }}
                  >
                    Upload photo
                  </button>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Basic Info">
              <InputRow
                label="Display name"
                description="Shown to merchants on campaigns"
                value={settings.displayName}
                onChange={(v) => patch("displayName", v)}
                placeholder="Your name"
                maxLength={60}
              />
              <InputRow
                label="Bio"
                description="A short intro for your profile"
                value={settings.bio}
                onChange={(v) => patch("bio", v)}
                placeholder="Tell merchants who you are..."
                multiline
                maxLength={280}
              />
              <InputRow
                label="Location"
                description="City or neighborhood"
                value={settings.location}
                onChange={(v) => patch("location", v)}
                placeholder="e.g. New York, NY"
              />

              <div className="input-row">
                <div className="input-row__label-group">
                  <label className="input-row__label">Languages</label>
                  <span className="input-row__desc">
                    Languages you create content in
                  </span>
                </div>
                <div className="input-row__field">
                  <div className="tag-input-group">
                    {settings.languages.map((lang) => (
                      <span key={lang} className="tag-chip">
                        {lang}
                        <button
                          className="tag-chip__remove"
                          onClick={() => removeLang(lang)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      className="tag-input"
                      value={langInput}
                      onChange={(e) => setLangInput(e.target.value)}
                      placeholder="Add language…"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addLang(langInput);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>
          </>
        );

      case "account":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Account</h1>
              <p className="settings-page-heading__sub">
                Login credentials and security
              </p>
            </div>
            <SettingsSection title="Email">
              <InputRow
                label="Email address"
                description="Used for login and notifications"
                value="alex@example.com"
                onChange={() => {}}
                type="email"
                disabled
              />
              <div style={{ paddingTop: 12 }}>
                <button className="btn btn--ghost btn--sm">Change email</button>
              </div>
            </SettingsSection>
            <SettingsSection title="Password">
              <p
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--graphite)",
                  marginBottom: 12,
                }}
              >
                We will send a password reset link to your email address.
              </p>
              <button className="btn btn--ghost btn--sm">
                Send reset link
              </button>
            </SettingsSection>
          </>
        );

      case "notifications":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Notifications</h1>
              <p className="settings-page-heading__sub">
                Choose how and when Push contacts you
              </p>
            </div>
            <SettingsSection
              title="Activity"
              description="Campaign and earnings notifications"
            >
              {(
                [
                  "newCampaignMatch",
                  "applicationAccepted",
                  "applicationRejected",
                  "paymentReceived",
                  "milestoneReminder",
                  "campaignDeadlineWarning",
                  "proofApproved",
                  "proofRejected",
                  "tierUpgrade",
                ] as (keyof NotifSettings)[]
              ).map((key) => {
                const [label, desc] = NOTIF_LABELS[key];
                return (
                  <ToggleRow
                    key={key}
                    label={label}
                    description={desc}
                    checked={notifAny(key)}
                    onChange={(on) => toggleNotifMaster(key, on)}
                    channels={{
                      ...settings.notifications[key],
                      onChannelChange: (ch, val) =>
                        toggleNotifChannel(key, ch, val),
                    }}
                  />
                );
              })}
            </SettingsSection>
            <SettingsSection
              title="Digest & Marketing"
              description="Periodic summaries and Push communications"
            >
              {(
                [
                  "weeklyDigest",
                  "newFollowerOnPush",
                  "marketingUpdates",
                ] as (keyof NotifSettings)[]
              ).map((key) => {
                const [label, desc] = NOTIF_LABELS[key];
                return (
                  <ToggleRow
                    key={key}
                    label={label}
                    description={desc}
                    checked={notifAny(key)}
                    onChange={(on) => toggleNotifMaster(key, on)}
                    channels={{
                      ...settings.notifications[key],
                      onChannelChange: (ch, val) =>
                        toggleNotifChannel(key, ch, val),
                    }}
                  />
                );
              })}
            </SettingsSection>
          </>
        );

      case "payouts":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Payouts</h1>
              <p className="settings-page-heading__sub">
                How and when you get paid
              </p>
            </div>
            <SettingsSection title="Payout Method">
              <SelectRow
                label="Method"
                description="How we send your earnings"
                value={settings.payouts.method}
                options={[
                  { value: "bank", label: "Bank transfer (ACH)" },
                  { value: "paypal", label: "PayPal" },
                  { value: "venmo", label: "Venmo" },
                ]}
                onChange={(v) =>
                  patch("payouts", { ...settings.payouts, method: v })
                }
              />
              <SelectRow
                label="Minimum payout"
                description="We pay out when your balance reaches this amount"
                value={String(settings.payouts.threshold)}
                options={[
                  { value: "25", label: "$25" },
                  { value: "50", label: "$50" },
                  { value: "100", label: "$100" },
                  { value: "200", label: "$200" },
                ]}
                onChange={(v) =>
                  patch("payouts", {
                    ...settings.payouts,
                    threshold: Number(v),
                  })
                }
              />
            </SettingsSection>
            <SettingsSection title="Bank Account">
              <p
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--graphite)",
                  padding: "12px 0",
                }}
              >
                No bank account connected. Add one to receive ACH payouts.
              </p>
              <button className="btn btn--primary btn--sm">
                Connect bank account
              </button>
            </SettingsSection>
          </>
        );

      case "privacy":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Privacy</h1>
              <p className="settings-page-heading__sub">
                Control your data and public presence
              </p>
            </div>
            <SettingsSection title="Visibility">
              <ToggleRow
                label="Public profile"
                description="Your profile is discoverable by merchants on Push"
                checked={settings.privacy.publicProfile}
                onChange={(v) => patchPrivacy("publicProfile", v)}
              />
              <ToggleRow
                label="Show total earnings"
                description="Display your cumulative earnings badge on your public profile"
                checked={settings.privacy.showEarnings}
                onChange={(v) => patchPrivacy("showEarnings", v)}
              />
            </SettingsSection>
            <SettingsSection title="Data & Ads">
              <ToggleRow
                label="Ad preferences"
                description="Allow Push to use your activity data to improve campaign recommendations"
                checked={settings.privacy.adPreferences}
                onChange={(v) => patchPrivacy("adPreferences", v)}
              />
              <div style={{ paddingTop: 16 }}>
                <button className="btn btn--ghost btn--sm">
                  Export my data
                </button>
              </div>
            </SettingsSection>
          </>
        );

      case "danger":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Danger Zone</h1>
              <p className="settings-page-heading__sub">
                Irreversible actions — proceed carefully
              </p>
            </div>
            <SettingsSection danger title="Account Actions">
              <div className="danger-action">
                <div className="danger-action__text">
                  <span className="danger-action__title">
                    Deactivate account
                  </span>
                  <span className="danger-action__desc">
                    Temporarily disable your profile. Campaigns and applications
                    are paused. You can reactivate at any time.
                  </span>
                </div>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setModal("deactivate")}
                >
                  Deactivate
                </button>
              </div>
              <div className="danger-action">
                <div className="danger-action__text">
                  <span className="danger-action__title">Delete account</span>
                  <span className="danger-action__desc">
                    Permanently delete your Push account, all profile data,
                    application history, and earnings records. This cannot be
                    undone.
                  </span>
                </div>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => setModal("delete")}
                >
                  Delete
                </button>
              </div>
            </SettingsSection>
          </>
        );
    }
  };

  return (
    <SettingsShell
      title="Creator"
      navItems={NAV_ITEMS}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderSection()}

      {/* Save bar */}
      {dirty && (
        <div className="settings-save-bar">
          <span className="settings-save-bar__status">
            {saveStatus === "saving" ? "Saving…" : "You have unsaved changes"}
          </span>
          <div className="settings-save-bar__actions">
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setSettings(DEFAULT_SETTINGS);
                setDirty(false);
              }}
            >
              Discard
            </button>
            <button
              className="btn btn--primary btn--sm"
              onClick={save}
              disabled={saveStatus === "saving"}
            >
              Save changes
            </button>
          </div>
        </div>
      )}
      {saveStatus === "saved" && !dirty && (
        <div className="settings-save-bar">
          <span className="settings-save-bar__status settings-save-bar__status--saved">
            Changes saved
          </span>
        </div>
      )}

      {/* Deactivate modal */}
      {modal === "deactivate" && (
        <ConfirmModal
          title="Deactivate your account?"
          description="Your profile will be hidden from merchants and all pending applications paused. You can reactivate at any time by logging in."
          confirmLabel="Deactivate account"
          onCancel={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            router.push("/creator/dashboard");
          }}
        />
      )}

      {/* Delete modal */}
      {modal === "delete" && (
        <ConfirmModal
          title="Delete your account permanently?"
          description="All profile data, campaign history, and earnings records will be deleted. Any pending payouts will be forfeited. This action is irreversible."
          confirmWord="DELETE"
          confirmLabel="Permanently delete"
          onCancel={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            router.push("/");
          }}
        />
      )}
    </SettingsShell>
  );
}
