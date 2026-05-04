"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SettingsShell, NavGroup } from "@/components/settings/SettingsShell";
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

/* ── Nav (grouped, Instagram-style) ─────────────────────────── */

const NAV_GROUPS: NavGroup[] = [
  {
    label: "ACCOUNT",
    items: [
      { key: "profile", label: "Profile", icon: "◉" },
      { key: "account", label: "Account", icon: "◈" },
      { key: "notifications", label: "Notifications", icon: "◎" },
    ],
  },
  {
    label: "PAYOUTS",
    items: [{ key: "payouts", label: "Payouts", icon: "◇" }],
  },
  {
    label: "PRIVACY",
    items: [{ key: "privacy", label: "Privacy", icon: "◆" }],
  },
  {
    label: "ACCOUNT REMOVAL",
    items: [
      { key: "danger", label: "Delete or deactivate", icon: "⚑", danger: true },
    ],
  },
];

const NOTIF_LABELS: Record<keyof NotifSettings, [string, string]> = {
  newCampaignMatch: [
    "New campaign match",
    "A campaign that fits your tier and niche is posted",
  ],
  applicationAccepted: [
    "Application accepted",
    "A merchant accepted your application",
  ],
  applicationRejected: [
    "Application not selected",
    "A merchant moved on with another creator",
  ],
  paymentReceived: ["Payout received", "Earnings have landed in your account"],
  milestoneReminder: [
    "Milestone reminder",
    "Heads up when a campaign milestone is due",
  ],
  weeklyDigest: ["Weekly digest", "A summary of your week on Push"],
  newFollowerOnPush: ["New follower", "Someone followed you on Push"],
  campaignDeadlineWarning: [
    "Deadline approaching",
    "48 hours before a campaign closes",
  ],
  proofApproved: ["Proof approved", "Merchant signed off on your submission"],
  proofRejected: [
    "Proof needs changes",
    "Merchant requested edits before approval",
  ],
  tierUpgrade: ["Tier upgrade", "Your Push score unlocked a new tier"],
  marketingUpdates: [
    "Product updates",
    "Occasional tips and announcements from Push",
  ],
};

/* ── Confirm modal ──────────────────────────────────────────── */

function ConfirmModal({
  title,
  description,
  confirmWord,
  confirmLabel,
  destructive = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmWord?: string;
  confirmLabel: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [input, setInput] = useState("");
  const ready = !confirmWord || input === confirmWord;

  /* Esc to cancel — keyboard a11y */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="confirm-modal-backdrop" onClick={onCancel}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-modal-title" className="confirm-modal__title">
          {title}
        </h3>
        <p className="confirm-modal__desc">{description}</p>
        {confirmWord && (
          <div>
            <label
              className="confirm-modal__input-label"
              htmlFor="confirm-modal-input"
            >
              Type <strong>{confirmWord}</strong> to confirm
            </label>
            <input
              id="confirm-modal-input"
              className="push-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={confirmWord}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
        <div className="confirm-modal__actions">
          <button
            className="btn-ghost click-shift"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`${destructive ? "btn-primary" : "btn-ghost"} click-shift`}
            disabled={!ready}
            onClick={onConfirm}
            type="button"
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
                    <img src={settings.avatarUrl} alt="Profile photo" />
                  ) : (
                    <span
                      className="avatar-upload__initials"
                      aria-hidden="true"
                    >
                      {initials}
                    </span>
                  )}
                </div>
                <div className="avatar-upload__info">
                  <span className="avatar-upload__label">Profile photo</span>
                  <span className="avatar-upload__hint">
                    JPG or PNG · up to 4 MB
                  </span>
                  <button
                    type="button"
                    className="btn-ghost click-shift"
                    style={{ marginTop: 8 }}
                  >
                    Upload photo
                  </button>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Basics">
              <InputRow
                label="Display name"
                description="Shown to merchants on every campaign"
                value={settings.displayName}
                onChange={(v) => patch("displayName", v)}
                placeholder="Alex Rivera"
                maxLength={60}
              />
              <InputRow
                label="Bio"
                description="One or two lines about what you make"
                value={settings.bio}
                onChange={(v) => patch("bio", v)}
                placeholder="NYC-based lifestyle creator. Content that converts."
                multiline
                maxLength={280}
              />
              <InputRow
                label="Location"
                description="City or neighborhood"
                value={settings.location}
                onChange={(v) => patch("location", v)}
                placeholder="New York, NY"
              />

              <div className="input-row">
                <div className="input-row__label-group">
                  <label className="input-row__label" htmlFor="lang-input">
                    Languages
                  </label>
                  <span className="input-row__desc">
                    Languages you create in
                  </span>
                </div>
                <div className="input-row__field">
                  <div className="tag-input-group">
                    {settings.languages.map((lang) => (
                      <span key={lang} className="tag-chip">
                        {lang}
                        <button
                          type="button"
                          className="tag-chip__remove"
                          aria-label={`Remove ${lang}`}
                          onClick={() => removeLang(lang)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      id="lang-input"
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
                <button type="button" className="btn-ghost click-shift">
                  Change email
                </button>
              </div>
            </SettingsSection>
            <SettingsSection title="Password">
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                We will email you a reset link.
              </p>
              <button type="button" className="btn-ghost click-shift">
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
                Choose how and when Push reaches you
              </p>
            </div>
            <SettingsSection
              title="Activity"
              description="Campaigns, applications, and earnings"
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
              title="Digest & updates"
              description="Periodic summaries and product news"
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
            <SettingsSection title="Payout method">
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
            <SettingsSection title="Bank account">
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                  padding: "12px 0",
                  lineHeight: 1.5,
                }}
              >
                No bank account connected. Add one to receive ACH payouts.
              </p>
              <button type="button" className="btn-primary click-shift">
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
                description="Merchants can discover your profile on Push"
                checked={settings.privacy.publicProfile}
                onChange={(v) => patchPrivacy("publicProfile", v)}
              />
              <ToggleRow
                label="Show total earnings"
                description="Display a cumulative earnings badge on your public profile"
                checked={settings.privacy.showEarnings}
                onChange={(v) => patchPrivacy("showEarnings", v)}
              />
            </SettingsSection>
            <SettingsSection title="Data & ads">
              <ToggleRow
                label="Personalized recommendations"
                description="Use your activity to suggest more relevant campaigns"
                checked={settings.privacy.adPreferences}
                onChange={(v) => patchPrivacy("adPreferences", v)}
              />
              <div style={{ paddingTop: 16 }}>
                <button type="button" className="btn-ghost click-shift">
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
              <h1 className="settings-page-heading__title">
                Delete or deactivate
              </h1>
              <p className="settings-page-heading__sub">
                Pause your profile, or remove your account permanently
              </p>
            </div>
            <SettingsSection danger title="Account">
              <div className="danger-action">
                <div className="danger-action__text">
                  <span className="danger-action__title">
                    Deactivate account
                  </span>
                  <span className="danger-action__desc">
                    Temporarily hides your profile and pauses applications. You
                    can reactivate any time by signing in.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-ghost click-shift"
                  onClick={() => setModal("deactivate")}
                >
                  Deactivate
                </button>
              </div>
              <div className="danger-action">
                <div className="danger-action__text">
                  <span className="danger-action__title">Delete account</span>
                  <span className="danger-action__desc">
                    Removes your profile, application history, and earnings
                    records. This action is not reversible.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-primary click-shift"
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
      title="Settings"
      navGroups={NAV_GROUPS}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderSection()}

      {/* Save bar */}
      {dirty && (
        <div
          className="settings-save-bar"
          role="region"
          aria-label="Unsaved changes"
        >
          <span className="settings-save-bar__status">
            {saveStatus === "saving" ? "Saving…" : "Unsaved changes"}
          </span>
          <div className="settings-save-bar__actions">
            <button
              type="button"
              className="btn-ghost click-shift"
              onClick={() => {
                setSettings(DEFAULT_SETTINGS);
                setDirty(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary click-shift"
              onClick={save}
              disabled={saveStatus === "saving"}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {saveStatus === "saved" && !dirty && (
        <div className="settings-save-bar" role="status" aria-live="polite">
          <span className="settings-save-bar__status settings-save-bar__status--saved">
            Saved
          </span>
        </div>
      )}

      {/* Deactivate modal */}
      {modal === "deactivate" && (
        <ConfirmModal
          title="Deactivate your account?"
          description="Your profile will be hidden from merchants and pending applications paused. You can reactivate any time by signing in."
          confirmLabel="Deactivate"
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
          title="Delete your account?"
          description="Your profile, campaign history, and earnings records will be removed. Any pending payouts will be forfeited. This action is not reversible."
          confirmWord="DELETE"
          confirmLabel="Delete account"
          destructive
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
