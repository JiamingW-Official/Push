"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SettingsShell, NavItem } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow, Channel } from "@/components/settings/ToggleRow";
import { SelectRow } from "@/components/settings/SelectRow";
import { InputRow } from "@/components/settings/InputRow";
import "@/components/settings/settings.css";

/* ── Demo detection ─────────────────────────────────────────── */
function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=merchant");
}

/* ── Types ──────────────────────────────────────────────────── */

type NotifChannel = { email: boolean; push: boolean; sms: boolean };

interface MerchantNotifSettings {
  newApplication: NotifChannel;
  campaignFilled: NotifChannel;
  proofSubmitted: NotifChannel;
  paymentProcessed: NotifChannel;
  campaignExpiring: NotifChannel;
  weeklyReport: NotifChannel;
  newQrScan: NotifChannel;
  creatorMilestone: NotifChannel;
  marketingUpdates: NotifChannel;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "viewer";
  lastActive: string | null;
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
  fullKey?: string;
}

interface MerchantSettings {
  legalName: string;
  dba: string;
  industry: string;
  website: string;
  logoUrl: string | null;
  notifications: MerchantNotifSettings;
  privacy: {
    showOnDirectory: boolean;
    adPreferences: boolean;
  };
}

/* ── Defaults ───────────────────────────────────────────────── */

const DEFAULT_SETTINGS: MerchantSettings = {
  legalName: "Procell Coffee LLC",
  dba: "Procell Coffee",
  industry: "food_beverage",
  website: "https://procellcoffee.com",
  logoUrl: null,
  notifications: {
    newApplication: { email: true, push: true, sms: false },
    campaignFilled: { email: true, push: true, sms: false },
    proofSubmitted: { email: true, push: true, sms: false },
    paymentProcessed: { email: true, push: false, sms: false },
    campaignExpiring: { email: true, push: true, sms: false },
    weeklyReport: { email: true, push: false, sms: false },
    newQrScan: { email: false, push: false, sms: false },
    creatorMilestone: { email: true, push: false, sms: false },
    marketingUpdates: { email: false, push: false, sms: false },
  },
  privacy: {
    showOnDirectory: true,
    adPreferences: true,
  },
};

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "tm_1",
    name: "Jordan Kim",
    email: "jordan@procellcoffee.com",
    role: "owner",
    lastActive: "2026-04-17T10:22:00Z",
  },
  {
    id: "tm_2",
    name: "Priya Mehta",
    email: "priya@procellcoffee.com",
    role: "admin",
    lastActive: "2026-04-16T15:45:00Z",
  },
  {
    id: "tm_3",
    name: "Marcus Osei",
    email: "marcus@procellcoffee.com",
    role: "viewer",
    lastActive: "2026-04-10T09:00:00Z",
  },
];

const DEFAULT_KEYS: ApiKey[] = [
  {
    id: "key_live_01",
    name: "Production",
    prefix: "pk_live_a3f9****",
    scopes: ["campaigns:read", "analytics:read"],
    createdAt: "2026-03-01T00:00:00Z",
    lastUsed: "2026-04-16T22:10:00Z",
  },
  {
    id: "key_live_02",
    name: "Webhook Integration",
    prefix: "pk_live_b7e2****",
    scopes: ["webhooks:write", "campaigns:read"],
    createdAt: "2026-04-02T00:00:00Z",
    lastUsed: null,
  },
];

const SETTINGS_KEY = "push-demo-merchant-settings";
const TEAM_KEY = "push-demo-merchant-team";
const KEYS_KEY = "push-demo-merchant-api-keys";

/* ── Nav ────────────────────────────────────────────────────── */

const NAV_ITEMS: NavItem[] = [
  { key: "business", label: "Business Profile", icon: "◉" },
  { key: "team", label: "Team", icon: "◈" },
  { key: "notifications", label: "Notifications", icon: "◎" },
  { key: "billing", label: "Billing", icon: "◇" },
  { key: "api-keys", label: "API Keys", icon: "◆" },
  { key: "privacy", label: "Privacy", icon: "●" },
  { key: "danger", label: "Danger Zone", icon: "⚑", danger: true },
];

const NOTIF_LABELS: Record<keyof MerchantNotifSettings, [string, string]> = {
  newApplication: [
    "New application",
    "A creator applied to one of your campaigns",
  ],
  campaignFilled: ["Campaign filled", "All spots on a campaign are taken"],
  proofSubmitted: [
    "Proof submitted",
    "A creator submitted content proof for review",
  ],
  paymentProcessed: [
    "Payment processed",
    "A payout to a creator has been processed",
  ],
  campaignExpiring: [
    "Campaign expiring",
    "A campaign deadline is within 48 hours",
  ],
  weeklyReport: [
    "Weekly report",
    "Summary of campaign activity, scans, and revenue",
  ],
  newQrScan: ["QR scan", "Real-time notification on each QR code scan"],
  creatorMilestone: [
    "Creator milestone",
    "A creator in your campaign reached a new milestone",
  ],
  marketingUpdates: [
    "Marketing emails",
    "Product updates and announcements from Push",
  ],
};

const ALL_SCOPES = [
  "campaigns:read",
  "campaigns:write",
  "analytics:read",
  "webhooks:write",
  "creators:read",
];

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

/* ── Invite modal ───────────────────────────────────────────── */

function InviteModal({
  onCancel,
  onInvite,
}: {
  onCancel: () => void;
  onInvite: (email: string, role: TeamMember["role"]) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("viewer");

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-modal__title">Invite team member</h3>
        <p className="confirm-modal__desc">
          They will receive an email invitation to join your Push workspace.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label className="confirm-modal__input-label">Email address</label>
            <input
              className="push-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              autoFocus
            />
          </div>
          <div>
            <label className="confirm-modal__input-label">Role</label>
            <select
              className="push-select"
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMember["role"])}
            >
              <option value="admin">Admin — full access</option>
              <option value="viewer">Viewer — read only</option>
            </select>
          </div>
        </div>
        <div className="confirm-modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            disabled={!email.includes("@")}
            onClick={() => onInvite(email, role)}
            style={{ opacity: email.includes("@") ? 1 : 0.4 }}
          >
            Send invite
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── New key modal ──────────────────────────────────────────── */

function NewKeyModal({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (name: string, scopes: string[]) => void;
}) {
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "campaigns:read",
  ]);

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-modal__title">Generate API key</h3>
        <p className="confirm-modal__desc">
          The full key is shown once. Store it securely — we cannot retrieve it
          later.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="confirm-modal__input-label">Key name</label>
            <input
              className="push-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production, Zapier integration"
              autoFocus
            />
          </div>
          <div>
            <label
              className="confirm-modal__input-label"
              style={{ marginBottom: 8 }}
            >
              Permissions
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_SCOPES.map((scope) => (
                <button
                  key={scope}
                  className={`channel-chip${selectedScopes.includes(scope) ? " channel-chip--on" : ""}`}
                  onClick={() => toggleScope(scope)}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="confirm-modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            disabled={!name.trim() || selectedScopes.length === 0}
            onClick={() => onCreate(name.trim(), selectedScopes)}
            style={{
              opacity: name.trim() && selectedScopes.length > 0 ? 1 : 0.4,
            }}
          >
            Generate key
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function MerchantSettingsPage() {
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(false);
  const [activeSection, setActiveSection] = useState("business");
  const [settings, setSettings] = useState<MerchantSettings>(DEFAULT_SETTINGS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(DEFAULT_KEYS);
  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [modal, setModal] = useState<
    | null
    | "deactivate"
    | "delete"
    | "invite"
    | "new-key"
    | { type: "revoke"; keyId: string }
    | { type: "remove"; memberId: string }
  >(null);

  /* load */
  useEffect(() => {
    const demo = checkDemoMode();
    setIsDemo(demo);
    if (demo) {
      try {
        const s = localStorage.getItem(SETTINGS_KEY);
        if (s) setSettings(JSON.parse(s));
        const t = localStorage.getItem(TEAM_KEY);
        if (t) setTeam(JSON.parse(t));
        const k = localStorage.getItem(KEYS_KEY);
        if (k) setApiKeys(JSON.parse(k));
      } catch {
        /* use defaults */
      }
    }
  }, []);

  const patch = useCallback(
    <K extends keyof MerchantSettings>(key: K, value: MerchantSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
      setSaveStatus("idle");
    },
    [],
  );

  const patchNotif = useCallback(
    (key: keyof MerchantNotifSettings, value: NotifChannel) => {
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
    <K extends keyof MerchantSettings["privacy"]>(
      key: K,
      value: MerchantSettings["privacy"][K],
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
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      localStorage.setItem(TEAM_KEY, JSON.stringify(team));
      localStorage.setItem(KEYS_KEY, JSON.stringify(apiKeys));
      await new Promise((r) => setTimeout(r, 500));
    } else {
      await fetch("/api/merchant/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    }
    setSaveStatus("saved");
    setDirty(false);
    setTimeout(() => setSaveStatus("idle"), 2500);
  }, [isDemo, settings, team, apiKeys]);

  const notifAny = (key: keyof MerchantNotifSettings) =>
    Object.values(settings.notifications[key]).some(Boolean);

  const toggleNotifMaster = (key: keyof MerchantNotifSettings, on: boolean) => {
    patchNotif(
      key,
      on
        ? { email: true, push: true, sms: false }
        : { email: false, push: false, sms: false },
    );
  };

  const toggleNotifChannel = (
    key: keyof MerchantNotifSettings,
    channel: Channel,
    value: boolean,
  ) => {
    patchNotif(key, { ...settings.notifications[key], [channel]: value });
  };

  const handleInvite = async (email: string, role: TeamMember["role"]) => {
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: email.split("@")[0],
      email,
      role,
      lastActive: null,
    };
    const updated = [...team, newMember];
    setTeam(updated);
    if (isDemo) localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
    setModal(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const updated = team.filter((m) => m.id !== memberId);
    setTeam(updated);
    if (isDemo) localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
    setModal(null);
  };

  const handleGenerateKey = async (name: string, scopes: string[]) => {
    const rawKey = `pk_live_${Math.random().toString(36).slice(2, 18)}${Math.random().toString(36).slice(2, 18)}`;
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name,
      prefix: `${rawKey.slice(0, 12)}****`,
      scopes,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      fullKey: rawKey,
    };
    const updated = [...apiKeys, newKey];
    setApiKeys(updated);
    setNewKeyRevealed(rawKey);
    if (isDemo)
      localStorage.setItem(
        KEYS_KEY,
        JSON.stringify(updated.map((k) => ({ ...k, fullKey: undefined }))),
      );
    setModal(null);
  };

  const handleRevokeKey = (keyId: string) => {
    const updated = apiKeys.filter((k) => k.id !== keyId);
    setApiKeys(updated);
    if (isDemo) localStorage.setItem(KEYS_KEY, JSON.stringify(updated));
    setModal(null);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const logoInitials = settings.dba
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /* ── Render sections ────────────────────────────────────── */

  const renderSection = () => {
    switch (activeSection) {
      case "business":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Business Profile</h1>
              <p className="settings-page-heading__sub">
                Your legal and public business information
              </p>
            </div>

            <SettingsSection title="Logo">
              <div className="avatar-upload">
                <div className="avatar-upload__preview">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" />
                  ) : (
                    <span className="avatar-upload__initials">
                      {logoInitials}
                    </span>
                  )}
                </div>
                <div className="avatar-upload__info">
                  <span className="avatar-upload__label">Business logo</span>
                  <span className="avatar-upload__hint">
                    PNG or SVG, min 200×200px
                  </span>
                  <button
                    className="btn btn--ghost btn--sm"
                    style={{ marginTop: 8 }}
                  >
                    Upload logo
                  </button>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Business Info">
              <InputRow
                label="Legal name"
                description="Registered legal entity name"
                value={settings.legalName}
                onChange={(v) => patch("legalName", v)}
                placeholder="LLC, Inc., etc."
              />
              <InputRow
                label="DBA / Display name"
                description="Name shown to creators on Push"
                value={settings.dba}
                onChange={(v) => patch("dba", v)}
                placeholder="Your brand name"
              />
              <SelectRow
                label="Industry"
                description="Primary business category"
                value={settings.industry}
                options={[
                  { value: "food_beverage", label: "Food & Beverage" },
                  { value: "retail", label: "Retail" },
                  { value: "health_wellness", label: "Health & Wellness" },
                  { value: "beauty", label: "Beauty & Personal Care" },
                  { value: "entertainment", label: "Entertainment & Events" },
                  { value: "fitness", label: "Fitness & Sports" },
                  { value: "tech", label: "Technology" },
                  { value: "other", label: "Other" },
                ]}
                onChange={(v) => patch("industry", v)}
              />
              <InputRow
                label="Website"
                description="Your public-facing business URL"
                value={settings.website}
                onChange={(v) => patch("website", v)}
                type="url"
                placeholder="https://yourbusiness.com"
              />
            </SettingsSection>
          </>
        );

      case "team":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Team</h1>
              <p className="settings-page-heading__sub">
                Manage who has access to your Push workspace
              </p>
            </div>
            <SettingsSection
              title="Members"
              description={`${team.length} member${team.length !== 1 ? "s" : ""}`}
            >
              <div style={{ overflowX: "auto" }}>
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Last active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <span className="team-member__name">
                            {member.name}
                          </span>
                          <span className="team-member__email">
                            {member.email}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`role-badge${member.role === "owner" ? " role-badge--owner" : ""}`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "var(--text-caption)",
                          }}
                        >
                          {formatDate(member.lastActive)}
                        </td>
                        <td>
                          {member.role !== "owner" && (
                            <button
                              className="btn btn--ghost btn--sm"
                              onClick={() =>
                                setModal({
                                  type: "remove",
                                  memberId: member.id,
                                })
                              }
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => setModal("invite")}
                >
                  + Invite member
                </button>
              </div>
            </SettingsSection>
          </>
        );

      case "notifications":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Notifications</h1>
              <p className="settings-page-heading__sub">
                Choose how Push contacts you about campaign activity
              </p>
            </div>
            <SettingsSection
              title="Campaign Activity"
              description="Creator applications, milestones, and deadlines"
            >
              {(
                [
                  "newApplication",
                  "campaignFilled",
                  "proofSubmitted",
                  "creatorMilestone",
                  "campaignExpiring",
                ] as (keyof MerchantNotifSettings)[]
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
              title="Payments & Reports"
              description="Financial activity and weekly summaries"
            >
              {(
                [
                  "paymentProcessed",
                  "weeklyReport",
                  "newQrScan",
                  "marketingUpdates",
                ] as (keyof MerchantNotifSettings)[]
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

      case "billing":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Billing</h1>
              <p className="settings-page-heading__sub">
                Manage your Push plan and invoices
              </p>
            </div>
            <SettingsSection title="Current Plan">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "var(--dark)",
                    }}
                  >
                    Growth
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "var(--text-small)",
                      color: "var(--text-muted)",
                    }}
                  >
                    $69/month · renews May 1, 2026
                  </span>
                </div>
                <button className="btn btn--ghost btn--sm">Change plan</button>
              </div>
            </SettingsSection>
            <SettingsSection title="Invoices">
              <p
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--graphite)",
                  padding: "16px 0",
                }}
              >
                Billing history is managed through Stripe. Visit the billing
                portal to view invoices, update payment methods, or download
                receipts.
              </p>
              <button className="btn btn--ghost btn--sm">
                Open billing portal
              </button>
            </SettingsSection>
          </>
        );

      case "api-keys":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">API Keys</h1>
              <p className="settings-page-heading__sub">
                Programmatic access to your Push data
              </p>
            </div>

            {/* Newly revealed key */}
            {newKeyRevealed && (
              <div className="api-key-reveal">
                <span className="api-key-reveal__warning">
                  Copy this key now — it will not be shown again.
                </span>
                <code className="api-key-reveal__value">{newKeyRevealed}</code>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    navigator.clipboard.writeText(newKeyRevealed);
                  }}
                >
                  Copy key
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  style={{ marginTop: 4 }}
                  onClick={() => setNewKeyRevealed(null)}
                >
                  Dismiss
                </button>
              </div>
            )}

            <SettingsSection
              title="Active Keys"
              description={`${apiKeys.length} key${apiKeys.length !== 1 ? "s" : ""} generated`}
            >
              {apiKeys.map((key) => (
                <div key={key.id} className="api-key-row">
                  <div className="api-key-row__header">
                    <span className="api-key-row__name">{key.name}</span>
                    <div className="api-key-actions">
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() =>
                          setModal({ type: "revoke", keyId: key.id })
                        }
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <code className="api-key-row__value">{key.prefix}</code>
                  </div>
                  <div className="api-key-row__meta">
                    <span className="api-key-row__created">
                      Created {formatDate(key.createdAt)} · Last used{" "}
                      {formatDate(key.lastUsed)}
                    </span>
                    {key.scopes.map((scope) => (
                      <span key={scope} className="scope-chip">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => setModal("new-key")}
                >
                  Generate new key
                </button>
              </div>
            </SettingsSection>
          </>
        );

      case "privacy":
        return (
          <>
            <div className="settings-page-heading">
              <h1 className="settings-page-heading__title">Privacy</h1>
              <p className="settings-page-heading__sub">
                Control your business data and public presence
              </p>
            </div>
            <SettingsSection title="Visibility">
              <ToggleRow
                label="Show on Push business directory"
                description="Let creators discover your business when browsing Push"
                checked={settings.privacy.showOnDirectory}
                onChange={(v) => patchPrivacy("showOnDirectory", v)}
              />
            </SettingsSection>
            <SettingsSection title="Data">
              <ToggleRow
                label="Ad preferences"
                description="Allow Push to use your campaign data to improve creator recommendations"
                checked={settings.privacy.adPreferences}
                onChange={(v) => patchPrivacy("adPreferences", v)}
              />
              <div style={{ paddingTop: 16 }}>
                <button className="btn btn--ghost btn--sm">
                  Export business data
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
                    Pause all active campaigns and hide your business profile.
                    Active creators in your campaigns will be notified. You can
                    reactivate at any time.
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
                    Permanently delete your Push merchant account, all campaign
                    data, creator relationships, and API keys. Any unpaid
                    creator payouts must be settled before deletion.
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
      title="Merchant"
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

      {/* Modals */}
      {modal === "invite" && (
        <InviteModal onCancel={() => setModal(null)} onInvite={handleInvite} />
      )}

      {modal === "new-key" && (
        <NewKeyModal
          onCancel={() => setModal(null)}
          onCreate={handleGenerateKey}
        />
      )}

      {modal !== null &&
        typeof modal === "object" &&
        modal.type === "revoke" && (
          <ConfirmModal
            title="Revoke API key?"
            description="This key will stop working immediately. Any integrations using it will break."
            confirmLabel="Revoke key"
            onCancel={() => setModal(null)}
            onConfirm={() =>
              handleRevokeKey(
                (modal as { type: "revoke"; keyId: string }).keyId,
              )
            }
          />
        )}

      {modal !== null &&
        typeof modal === "object" &&
        modal.type === "remove" && (
          <ConfirmModal
            title="Remove team member?"
            description="They will immediately lose access to your Push workspace."
            confirmLabel="Remove member"
            onCancel={() => setModal(null)}
            onConfirm={() =>
              handleRemoveMember(
                (modal as { type: "remove"; memberId: string }).memberId,
              )
            }
          />
        )}

      {modal === "deactivate" && (
        <ConfirmModal
          title="Deactivate your account?"
          description="All active campaigns will be paused and creators notified. You can reactivate at any time by logging in."
          confirmLabel="Deactivate account"
          onCancel={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            router.push("/merchant/dashboard");
          }}
        />
      )}

      {modal === "delete" && (
        <ConfirmModal
          title="Delete your merchant account?"
          description="All campaigns, creator relationships, API keys, and analytics data will be permanently deleted. Unpaid payouts must be settled first."
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
