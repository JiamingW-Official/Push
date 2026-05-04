"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SettingsShell, NavItem } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow, Channel } from "@/components/settings/ToggleRow";
import { SelectRow } from "@/components/settings/SelectRow";
import { InputRow } from "@/components/settings/InputRow";
import { Modal, PageHeader, StatusBadge } from "@/components/merchant/shared";
import "@/components/settings/settings.css";

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

type SettingsSnapshot = {
  settings: MerchantSettings;
  team: TeamMember[];
  apiKeys: ApiKey[];
};

type SettingsApiResponse = {
  profile?: Record<string, unknown>;
  team?: { members?: unknown[] };
  api_keys?: { active?: unknown[] };
  notification_prefs?: Record<string, unknown>;
};

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

const SECTION_COPY: Record<string, { title: string; description: string }> = {
  business: {
    title: "Business Profile",
    description: "Your legal and public business information",
  },
  team: {
    title: "Team",
    description: "Manage who has access to your Push workspace",
  },
  notifications: {
    title: "Notifications",
    description: "Choose how Push contacts you about campaign activity",
  },
  billing: {
    title: "Billing",
    description: "Manage your Push plan and invoices",
  },
  "api-keys": {
    title: "API Keys",
    description: "Programmatic access to your Push data",
  },
  privacy: {
    title: "Privacy",
    description: "Control your business data and public presence",
  },
  danger: {
    title: "Danger Zone",
    description: "Irreversible actions — proceed carefully",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function mapNotificationPrefs(
  prefs: Record<string, unknown> | undefined,
): MerchantNotifSettings {
  if (!prefs) {
    return DEFAULT_SETTINGS.notifications;
  }

  const nested = isRecord(prefs.notifications) ? prefs.notifications : null;

  const resolveChannel = (
    key: keyof MerchantNotifSettings,
    fallback: NotifChannel,
    legacyKey?: string,
  ): NotifChannel => {
    const fromNested = nested && isRecord(nested[key]) ? nested[key] : null;
    if (fromNested) {
      return {
        email: toBoolean(fromNested.email, fallback.email),
        push: toBoolean(fromNested.push, fallback.push),
        sms: toBoolean(fromNested.sms, fallback.sms),
      };
    }

    const enabled = legacyKey
      ? toBoolean(prefs[legacyKey], fallback.email)
      : fallback.email;
    return { email: enabled, push: enabled, sms: fallback.sms };
  };

  return {
    newApplication: resolveChannel(
      "newApplication",
      DEFAULT_SETTINGS.notifications.newApplication,
      "new_applicant",
    ),
    campaignFilled: resolveChannel(
      "campaignFilled",
      DEFAULT_SETTINGS.notifications.campaignFilled,
    ),
    proofSubmitted: resolveChannel(
      "proofSubmitted",
      DEFAULT_SETTINGS.notifications.proofSubmitted,
    ),
    paymentProcessed: resolveChannel(
      "paymentProcessed",
      DEFAULT_SETTINGS.notifications.paymentProcessed,
    ),
    campaignExpiring: resolveChannel(
      "campaignExpiring",
      DEFAULT_SETTINGS.notifications.campaignExpiring,
      "campaign_end",
    ),
    weeklyReport: resolveChannel(
      "weeklyReport",
      DEFAULT_SETTINGS.notifications.weeklyReport,
    ),
    newQrScan: resolveChannel(
      "newQrScan",
      DEFAULT_SETTINGS.notifications.newQrScan,
    ),
    creatorMilestone: resolveChannel(
      "creatorMilestone",
      DEFAULT_SETTINGS.notifications.creatorMilestone,
    ),
    marketingUpdates: resolveChannel(
      "marketingUpdates",
      DEFAULT_SETTINGS.notifications.marketingUpdates,
    ),
  };
}

function normalizeTeamMember(value: unknown, index: number): TeamMember | null {
  if (!isRecord(value)) return null;

  return {
    id: typeof value.id === "string" ? value.id : `tm_${index + 1}`,
    name: typeof value.name === "string" ? value.name : "Unknown member",
    email: typeof value.email === "string" ? value.email : "",
    role:
      value.role === "owner" ||
      value.role === "admin" ||
      value.role === "viewer"
        ? value.role
        : "viewer",
    lastActive:
      typeof value.lastActive === "string"
        ? value.lastActive
        : typeof value.last_active === "string"
          ? value.last_active
          : null,
  };
}

function normalizeApiKey(value: unknown, index: number): ApiKey | null {
  if (!isRecord(value)) return null;

  const scopes = Array.isArray(value.scopes)
    ? value.scopes.filter((scope): scope is string => typeof scope === "string")
    : [];

  return {
    id: typeof value.id === "string" ? value.id : `key_${index + 1}`,
    name: typeof value.name === "string" ? value.name : "API Key",
    prefix:
      typeof value.prefix === "string"
        ? value.prefix
        : typeof value.key_preview === "string"
          ? value.key_preview
          : "pk_live_****",
    scopes,
    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : typeof value.created_at === "string"
          ? value.created_at
          : new Date().toISOString(),
    lastUsed:
      typeof value.lastUsed === "string"
        ? value.lastUsed
        : typeof value.last_used === "string"
          ? value.last_used
          : null,
  };
}

function buildSnapshotFromResponse(
  payload: SettingsApiResponse,
): SettingsSnapshot {
  const profile = isRecord(payload.profile) ? payload.profile : {};
  const notificationPrefs = isRecord(payload.notification_prefs)
    ? payload.notification_prefs
    : undefined;
  const teamMembers = Array.isArray(payload.team?.members)
    ? payload.team.members
        .map(normalizeTeamMember)
        .filter((member): member is TeamMember => member !== null)
    : DEFAULT_TEAM;
  const apiKeys = Array.isArray(payload.api_keys?.active)
    ? payload.api_keys.active
        .map(normalizeApiKey)
        .filter((key): key is ApiKey => key !== null)
    : DEFAULT_KEYS;

  return {
    settings: {
      legalName:
        typeof profile.legal_name === "string"
          ? profile.legal_name
          : typeof profile.display_name === "string"
            ? profile.display_name
            : DEFAULT_SETTINGS.legalName,
      dba:
        typeof profile.dba === "string"
          ? profile.dba
          : typeof profile.display_name === "string"
            ? profile.display_name
            : DEFAULT_SETTINGS.dba,
      industry:
        typeof profile.industry === "string"
          ? profile.industry
          : DEFAULT_SETTINGS.industry,
      website:
        typeof profile.website === "string"
          ? profile.website
          : DEFAULT_SETTINGS.website,
      logoUrl:
        typeof profile.logo_url === "string" && profile.logo_url.length > 0
          ? profile.logo_url
          : DEFAULT_SETTINGS.logoUrl,
      notifications: mapNotificationPrefs(notificationPrefs),
      privacy: isRecord(profile.privacy)
        ? {
            showOnDirectory: toBoolean(
              profile.privacy.showOnDirectory,
              DEFAULT_SETTINGS.privacy.showOnDirectory,
            ),
            adPreferences: toBoolean(
              profile.privacy.adPreferences,
              DEFAULT_SETTINGS.privacy.adPreferences,
            ),
          }
        : DEFAULT_SETTINGS.privacy,
    },
    team: teamMembers,
    apiKeys,
  };
}

function buildSectionPayload(
  activeSection: string,
  settings: MerchantSettings,
  team: TeamMember[],
  apiKeys: ApiKey[],
) {
  if (activeSection === "team") {
    return {
      section: "team" as const,
      data: { members: team },
    };
  }

  if (activeSection === "api-keys") {
    return {
      section: "api_keys" as const,
      data: {
        active: apiKeys.map(({ fullKey, ...key }) => key),
      },
    };
  }

  if (activeSection === "notifications") {
    return {
      section: "notification_prefs" as const,
      data: {
        notifications: settings.notifications,
        email: Object.values(settings.notifications).some(
          (channel) => channel.email,
        ),
        sms: Object.values(settings.notifications).some(
          (channel) => channel.sms,
        ),
        new_applicant: Object.values(
          settings.notifications.newApplication,
        ).some(Boolean),
        campaign_end: Object.values(
          settings.notifications.campaignExpiring,
        ).some(Boolean),
      },
    };
  }

  return {
    section: "profile" as const,
    data: {
      display_name: settings.dba || settings.legalName,
      legal_name: settings.legalName,
      dba: settings.dba,
      industry: settings.industry,
      website: settings.website,
      logo_url: settings.logoUrl ?? "",
      privacy: settings.privacy,
      billing_section: activeSection === "billing",
      danger_section: activeSection === "danger",
    },
  };
}

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
    <Modal
      open
      onClose={onCancel}
      title={title}
      size="md"
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={!ready}
            onClick={onConfirm}
            style={{ opacity: ready ? 1 : 0.4 }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="modal-copy">{description}</p>
      {confirmWord && (
        <div className="modal-field">
          <label className="label" htmlFor="confirm-word-input">
            Type <strong>{confirmWord}</strong> to confirm
          </label>
          <input
            id="confirm-word-input"
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
    </Modal>
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
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <Modal
      open
      onClose={onCancel}
      title="Invite team member"
      size="md"
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!emailValid}
            onClick={() => onInvite(email.trim(), role)}
            style={{ opacity: emailValid ? 1 : 0.4 }}
          >
            Send invite
          </button>
        </>
      }
    >
      <p className="modal-copy">
        They will receive an email invitation to join your Push workspace.
      </p>
      <div className="modal-stack">
        <div className="modal-field">
          <label className="label" htmlFor="invite-email-input">
            Email address
          </label>
          <input
            id="invite-email-input"
            className="push-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            autoFocus
            autoComplete="email"
            spellCheck={false}
          />
          {!emailValid && email.length > 0 && (
            <span className="input-row__desc" style={{ marginTop: 8 }}>
              Add a valid email address to send the invite
            </span>
          )}
        </div>
        <div className="modal-field">
          <label className="label" htmlFor="invite-role-select">
            Role
          </label>
          <select
            id="invite-role-select"
            className="push-select"
            value={role}
            onChange={(e) => setRole(e.target.value as TeamMember["role"])}
          >
            <option value="admin">Admin — full access</option>
            <option value="viewer">Viewer — read only</option>
          </select>
        </div>
      </div>
    </Modal>
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
  const ready = name.trim().length > 0 && selectedScopes.length > 0;

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  return (
    <Modal
      open
      onClose={onCancel}
      title="Generate API key"
      size="md"
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!ready}
            onClick={() => onCreate(name.trim(), selectedScopes)}
            style={{ opacity: ready ? 1 : 0.4 }}
          >
            Generate key
          </button>
        </>
      }
    >
      <p className="modal-copy">
        The full key is shown once. Store it securely — we cannot retrieve it
        later.
      </p>
      <div className="modal-stack modal-stack--lg">
        <div className="modal-field">
          <label className="label" htmlFor="new-key-name-input">
            Key name
          </label>
          <input
            id="new-key-name-input"
            className="push-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production, Zapier integration"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="modal-field">
          <label className="label">Permissions</label>
          <div
            className="scope-list"
            role="group"
            aria-label="API key permissions"
          >
            {ALL_SCOPES.map((scope) => {
              const on = selectedScopes.includes(scope);
              return (
                <button
                  type="button"
                  key={scope}
                  role="checkbox"
                  aria-checked={on}
                  className={`channel-chip${on ? " channel-chip--on" : ""}`}
                  onClick={() => toggleScope(scope)}
                >
                  {scope}
                </button>
              );
            })}
          </div>
          {selectedScopes.length === 0 && (
            <span className="input-row__desc" style={{ marginTop: 8 }}>
              Pick at least one permission for this key
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function MerchantSettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("business");
  const [settings, setSettings] = useState<MerchantSettings>(DEFAULT_SETTINGS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(DEFAULT_KEYS);
  const [savedSnapshot, setSavedSnapshot] = useState<SettingsSnapshot>({
    settings: DEFAULT_SETTINGS,
    team: DEFAULT_TEAM,
    apiKeys: DEFAULT_KEYS,
  });
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

  /* ── Field validation (non-blocking, inline) ─────────────── */
  const websiteValid =
    settings.website.trim().length === 0 ||
    /^https?:\/\/.+/i.test(settings.website.trim());
  const legalNameValid = settings.legalName.trim().length > 0;
  const dbaValid = settings.dba.trim().length > 0;
  const hasFieldError = !websiteValid || !legalNameValid || !dbaValid;

  const fieldDesc = (base: string, valid: boolean, hint: string) =>
    valid ? base : hint;

  /* load */
  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/merchant/settings");
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }

        const payload = (await response.json()) as SettingsApiResponse;
        if (cancelled) return;

        const snapshot = buildSnapshotFromResponse(payload);
        setSettings(snapshot.settings);
        setTeam(snapshot.team);
        setApiKeys(snapshot.apiKeys);
        setSavedSnapshot(snapshot);
      } catch {
        if (!cancelled) {
          setSavedSnapshot({
            settings: DEFAULT_SETTINGS,
            team: DEFAULT_TEAM,
            apiKeys: DEFAULT_KEYS,
          });
        }
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
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
    const payload = buildSectionPayload(activeSection, settings, team, apiKeys);
    const response = await fetch("/api/merchant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setSaveStatus("idle");
      return;
    }

    setSavedSnapshot({ settings, team, apiKeys });
    setSaveStatus("saved");
    setDirty(false);
    setTimeout(() => setSaveStatus("idle"), 2500);
  }, [activeSection, apiKeys, settings, team]);

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
    setTeam((prev) => [...prev, newMember]);
    setDirty(true);
    setSaveStatus("idle");
    setModal(null);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeam((prev) => prev.filter((member) => member.id !== memberId));
    setDirty(true);
    setSaveStatus("idle");
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
    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyRevealed(rawKey);
    setDirty(true);
    setSaveStatus("idle");
    setModal(null);
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
    setDirty(true);
    setSaveStatus("idle");
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
            <PageHeader
              eyebrow="SETTINGS"
              title={SECTION_COPY.business.title}
              subtitle={SECTION_COPY.business.description}
            />

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
                    type="button"
                    className="btn btn--ghost btn--sm settings-upload-btn"
                  >
                    Upload logo
                  </button>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Business Info">
              <InputRow
                label="Legal name"
                description={fieldDesc(
                  "Registered legal entity name",
                  legalNameValid,
                  "Legal name is required before saving",
                )}
                value={settings.legalName}
                onChange={(v) => patch("legalName", v)}
                placeholder="LLC, Inc., etc."
              />
              <InputRow
                label="DBA / Display name"
                description={fieldDesc(
                  "Name shown to creators on Push",
                  dbaValid,
                  "Display name is required before saving",
                )}
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
                description={fieldDesc(
                  "Your public-facing business URL",
                  websiteValid,
                  "Include https:// so links open correctly",
                )}
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
            <PageHeader
              eyebrow="SETTINGS"
              title={SECTION_COPY.team.title}
              subtitle={SECTION_COPY.team.description}
            />
            <SettingsSection
              title="Members"
              description={`${team.length} member${team.length !== 1 ? "s" : ""}`}
            >
              <div className="settings-table-scroll">
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
                          <StatusBadge
                            status={
                              member.role === "owner"
                                ? "active"
                                : member.role === "admin"
                                  ? "paused"
                                  : "draft"
                            }
                          >
                            {member.role}
                          </StatusBadge>
                        </td>
                        <td className="settings-table__date">
                          {formatDate(member.lastActive)}
                        </td>
                        <td>
                          {member.role !== "owner" && (
                            <button
                              type="button"
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
              <div className="settings-action-row">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setModal("invite")}
                >
                  Invite member
                </button>
              </div>
            </SettingsSection>
          </>
        );

      case "notifications":
        return (
          <>
            <PageHeader
              eyebrow="SETTINGS"
              title={SECTION_COPY.notifications.title}
              subtitle={SECTION_COPY.notifications.description}
            />
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
            <PageHeader
              eyebrow="SETTINGS"
              title={SECTION_COPY.billing.title}
              subtitle={SECTION_COPY.billing.description}
            />
            <SettingsSection title="Current Plan">
              <div className="settings-billing-row">
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    Growth
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: 8,
                      fontSize: "var(--text-small)",
                      color: "var(--ink-3)",
                    }}
                  >
                    $69/month · renews May 1, 2026
                  </span>
                </div>
                <button type="button" className="btn btn--ghost btn--sm">
                  Change plan
                </button>
              </div>
            </SettingsSection>
            <SettingsSection title="Invoices">
              <p
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--ink-3)",
                  padding: "16px 0",
                  margin: 0,
                }}
              >
                Billing history is managed through Stripe. Visit the billing
                portal to view invoices, update payment methods, or download
                receipts.
              </p>
              <button type="button" className="btn btn--ghost btn--sm">
                Open billing portal
              </button>
            </SettingsSection>
          </>
        );

      case "api-keys":
        return (
          <>
            <PageHeader
              eyebrow="SETTINGS"
              title={SECTION_COPY["api-keys"].title}
              subtitle={SECTION_COPY["api-keys"].description}
            />

            {/* Newly revealed key */}
            {newKeyRevealed && (
              <div className="settings-key-revealed" role="status">
                <span className="settings-key-revealed__warning">
                  Copy this key now — it will not be shown again
                </span>
                <code className="settings-key-revealed__code">
                  {newKeyRevealed}
                </code>
                <div className="settings-key-revealed__actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      navigator.clipboard.writeText(newKeyRevealed);
                    }}
                  >
                    Copy key
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => setNewKeyRevealed(null)}
                  >
                    Dismiss
                  </button>
                </div>
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
                        type="button"
                        className="settings-revoke-btn"
                        onClick={() =>
                          setModal({ type: "revoke", keyId: key.id })
                        }
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                  <div className="api-key-row__prefix">
                    <code className="api-key-row__value">{key.prefix}</code>
                  </div>
                  <div className="api-key-row__meta">
                    <span className="api-key-row__created">
                      Created {formatDate(key.createdAt)} · Last used{" "}
                      {formatDate(key.lastUsed)}
                    </span>
                    {key.scopes.map((scope) => (
                      <StatusBadge key={scope} status="draft">
                        {scope}
                      </StatusBadge>
                    ))}
                  </div>
                </div>
              ))}
              <div className="settings-action-row">
                <button
                  type="button"
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
            <PageHeader
              eyebrow="SETTINGS"
              title={SECTION_COPY.privacy.title}
              subtitle={SECTION_COPY.privacy.description}
            />
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
              <div className="settings-action-row">
                <button type="button" className="btn btn--ghost btn--sm">
                  Export business data
                </button>
              </div>
            </SettingsSection>
          </>
        );

      case "danger":
        return (
          <>
            <PageHeader
              eyebrow="SETTINGS"
              title={SECTION_COPY.danger.title}
              subtitle={SECTION_COPY.danger.description}
              action={<StatusBadge status="closed">closed</StatusBadge>}
            />
            <SettingsSection danger title="Account Actions">
              <div className="danger-action">
                <div className="danger-action__text">
                  <span className="danger-action__title">
                    Deactivate account
                  </span>
                  <span className="danger-action__desc">
                    Pauses active campaigns and hides your profile. Creators in
                    your campaigns will be notified. Reactivate at any time by
                    signing back in.
                  </span>
                </div>
                <button
                  type="button"
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
                    Permanently removes your merchant account, campaign data,
                    creator relationships, and API keys. Settle any unpaid
                    creator payouts before deletion.
                  </span>
                </div>
                <button
                  type="button"
                  className="settings-revoke-btn"
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
        <div className="settings-save-bar" role="status" aria-live="polite">
          <span className="settings-save-bar__status">
            {saveStatus === "saving"
              ? "Saving…"
              : hasFieldError
                ? "Fix highlighted fields to save"
                : "You have unsaved changes"}
          </span>
          <div className="settings-save-bar__actions">
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => {
                setSettings(savedSnapshot.settings);
                setTeam(savedSnapshot.team);
                setApiKeys(savedSnapshot.apiKeys);
                setDirty(false);
                setSaveStatus("idle");
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn--primary btn--sm"
              type="button"
              onClick={save}
              disabled={saveStatus === "saving" || hasFieldError}
              style={{
                opacity: saveStatus === "saving" || hasFieldError ? 0.4 : 1,
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      )}
      {saveStatus === "saved" && !dirty && (
        <div className="settings-save-bar" role="status" aria-live="polite">
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
            description="The key stops working immediately. Update any integrations using it before revoking."
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
            description="Their access ends as soon as you confirm."
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
          description="Active campaigns pause and creators are notified. Sign in any time to reactivate."
          confirmWord="DEACTIVATE"
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
          description="Campaigns, creator relationships, API keys, and analytics will be permanently deleted. Settle any unpaid payouts first."
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
