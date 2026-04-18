"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ChecklistItem } from "@/components/onboarding/ChecklistItem";
import type { ChecklistItemStatus } from "@/components/onboarding/ChecklistItem";
import "./onboarding.css";

/* ─────────────────────────────────────────────────────────────
   v5.1 Merchant Onboarding — 8-step Customer Acquisition Engine setup
   Vertical AI for Local Commerce — Williamsburg Coffee+ beachhead
   Powered by ConversionOracle™ walk-in prediction + SLR tracking
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY = "push-merchant-onboarding-progress";
const TOTAL = 8;

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type VerticalId =
  | "coffee-pure"
  | "coffee-plus"
  | "dessert"
  | "fitness"
  | "beauty";

const VERTICAL_OPTIONS: { id: VerticalId; label: string; rate: number }[] = [
  { id: "coffee-pure", label: "Pure Coffee", rate: 15 },
  { id: "coffee-plus", label: "Williamsburg Coffee+ (beachhead)", rate: 25 },
  { id: "dessert", label: "Dessert & Bakery", rate: 22 },
  { id: "fitness", label: "Fitness & Wellness", rate: 60 },
  { id: "beauty", label: "Beauty & Salon", rate: 85 },
];

type IntegrationKey = "square" | "toast" | "shopify" | "meta";

type RoleKey = "owner" | "manager" | "staff";

type TeamMember = { email: string; role: RoleKey };

type Progress = {
  completed: StepId[];
  skipped: StepId[];
  activeStep: StepId;
  profile: {
    businessName: string;
    vertical: VerticalId;
    zip: string;
    logoName: string;
  };
  qr: {
    locationName: string;
    address: string;
    generated: boolean;
  };
  photos: string[]; // file names only — UI stub
  integrations: Record<IntegrationKey, boolean>;
  team: TeamMember[];
  billing: {
    cardLast4: string;
    billingZip: string;
    saved: boolean;
  };
  brief: {
    prompt: string;
    drafted: boolean;
  };
};

const INITIAL: Progress = {
  completed: [],
  skipped: [],
  activeStep: 1,
  profile: {
    businessName: "",
    vertical: "coffee-plus",
    zip: "11211",
    logoName: "",
  },
  qr: { locationName: "", address: "", generated: false },
  photos: [],
  integrations: {
    square: false,
    toast: false,
    shopify: false,
    meta: false,
  },
  team: [],
  billing: { cardLast4: "", billingZip: "", saved: false },
  brief: { prompt: "", drafted: false },
};

/* ─────────────────────────────────────────────────────────────
   Persistence
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
    /* ignore */
  }
}

function stepStatus(id: StepId, p: Progress): ChecklistItemStatus {
  if (p.completed.includes(id)) return "done";
  if (p.skipped.includes(id)) return "skipped";
  if (id === 1) return "active";
  const prev = (id - 1) as StepId;
  if (p.completed.includes(prev) || p.skipped.includes(prev)) return "active";
  return "locked";
}

function getVerticalLabel(id: VerticalId) {
  return VERTICAL_OPTIONS.find((v) => v.id === id)?.label ?? id;
}

function getVerticalRate(id: VerticalId) {
  return VERTICAL_OPTIONS.find((v) => v.id === id)?.rate ?? 25;
}

/* ─────────────────────────────────────────────────────────────
   STEP 1 — Business profile
   ───────────────────────────────────────────────────────────── */

function BusinessStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { profile } = progress;
  const canProceed =
    profile.businessName.trim().length > 0 && profile.zip.trim().length >= 5;

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ profile: { ...profile, logoName: file.name } });
    }
  }

  return (
    <div>
      <div className="ob2-field-row">
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="mb-name">
            Business name
          </label>
          <input
            id="mb-name"
            className="ob2-input"
            type="text"
            placeholder="e.g. Devoción Williamsburg"
            value={profile.businessName}
            onChange={(e) =>
              onChange({
                profile: { ...profile, businessName: e.target.value },
              })
            }
          />
        </div>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="mb-zip">
            ZIP code
          </label>
          <input
            id="mb-zip"
            className="ob2-input"
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="11211"
            value={profile.zip}
            onChange={(e) =>
              onChange({
                profile: { ...profile, zip: e.target.value.replace(/\D/g, "") },
              })
            }
          />
        </div>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="mb-vertical">
          Vertical
        </label>
        <select
          id="mb-vertical"
          className="ob2-input mo-select"
          value={profile.vertical}
          onChange={(e) =>
            onChange({
              profile: {
                ...profile,
                vertical: e.target.value as VerticalId,
              },
            })
          }
        >
          {VERTICAL_OPTIONS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} — ${v.rate}/verified customer
            </option>
          ))}
        </select>
        <p className="ob2-input-hint">
          Pricing follows the Vertical AI for Local Commerce rate card.
        </p>
      </div>

      <div className="ob2-field">
        <label className="ob2-label">Logo (optional)</label>
        <label className="mo-file">
          <input
            type="file"
            accept="image/*"
            className="mo-file-input"
            onChange={handleLogo}
          />
          <span className="mo-file-btn">Choose file</span>
          <span className="mo-file-name">
            {profile.logoName || "No file selected"}
          </span>
        </label>
      </div>

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
   STEP 2 — QR code generation
   ───────────────────────────────────────────────────────────── */

function QRStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { qr } = progress;
  const canGenerate =
    qr.locationName.trim().length > 0 && qr.address.trim().length > 0;

  const qrPayload = useMemo(() => {
    return `push-qr:${progress.profile.businessName || "merchant"}:${qr.locationName || "loc1"}`;
  }, [progress.profile.businessName, qr.locationName]);

  function generate() {
    onChange({ qr: { ...qr, generated: true } });
  }

  return (
    <div>
      <div className="ob2-field-row">
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="mb-loc-name">
            Primary location name
          </label>
          <input
            id="mb-loc-name"
            className="ob2-input"
            type="text"
            placeholder="e.g. Bedford Ave flagship"
            value={qr.locationName}
            onChange={(e) =>
              onChange({ qr: { ...qr, locationName: e.target.value } })
            }
          />
        </div>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="mb-addr">
            Street address
          </label>
          <input
            id="mb-addr"
            className="ob2-input"
            type="text"
            placeholder="69 Grand St, Brooklyn NY 11211"
            value={qr.address}
            onChange={(e) =>
              onChange({ qr: { ...qr, address: e.target.value } })
            }
          />
        </div>
      </div>

      {!qr.generated ? (
        <div className="ob2-step-actions">
          <button
            type="button"
            className="ob2-btn-primary"
            onClick={generate}
            disabled={!canGenerate}
          >
            Generate QR →
          </button>
        </div>
      ) : (
        <div className="mo-qr-result">
          <div className="mo-qr-preview" aria-label="QR code preview">
            <MockQRCode payload={qrPayload} />
          </div>
          <div className="mo-qr-info">
            <p className="mo-qr-title">{qr.locationName}</p>
            <p className="mo-qr-sub">{qr.address}</p>
            <p className="mo-qr-meta">
              QR payload: <code>{qrPayload}</code>
            </p>
            <div className="mo-qr-actions">
              <button
                type="button"
                className="ob2-btn-secondary"
                onClick={() => {
                  // stub download — just flash UI
                  const blob = new Blob([qrPayload], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${qr.locationName || "push-qr"}.png`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download PNG
              </button>
              <button
                type="button"
                className="ob2-btn-primary"
                onClick={onComplete}
              >
                Save & continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small inline SVG "QR-like" pattern — deterministic from payload
function MockQRCode({ payload }: { payload: string }) {
  const size = 21;
  const cells = useMemo(() => {
    const arr: boolean[][] = [];
    let h = 0;
    for (let i = 0; i < payload.length; i++) {
      h = (h * 31 + payload.charCodeAt(i)) | 0;
    }
    for (let y = 0; y < size; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < size; x++) {
        h = (h * 1103515245 + 12345) | 0;
        row.push(((h >>> 16) & 1) === 1);
      }
      arr.push(row);
    }
    // stamp three finder patterns
    const stamp = (sx: number, sy: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const edge = x === 0 || y === 0 || x === 6 || y === 6;
          const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          arr[sy + y][sx + x] = edge || core;
        }
      }
    };
    stamp(0, 0);
    stamp(size - 7, 0);
    stamp(0, size - 7);
    return arr;
  }, [payload]);

  const px = 8;
  return (
    <svg
      width={size * px}
      height={size * px}
      viewBox={`0 0 ${size * px} ${size * px}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <rect width={size * px} height={size * px} fill="#f5f2ec" />
      {cells.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${x}-${y}`}
              x={x * px}
              y={y * px}
              width={px}
              height={px}
              fill="#003049"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP 3 — Storefront photos
   ───────────────────────────────────────────────────────────── */

function PhotosStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { photos } = progress;

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const next = [...photos, ...files.map((f) => f.name)].slice(0, 5);
    onChange({ photos: next });
  }

  function remove(name: string) {
    onChange({ photos: photos.filter((p) => p !== name) });
  }

  const remaining = 5 - photos.length;

  return (
    <div>
      <p className="mo-oracle-callout">
        <span className="mo-oracle-pill">ConversionOracle™</span>
        Up to 5 storefront photos become the geo-validation baseline — so
        walk-in verification matches the real place, not a look-alike.
      </p>

      <label className="mo-photo-drop">
        <input
          type="file"
          accept="image/*"
          multiple
          className="mo-file-input"
          disabled={remaining === 0}
          onChange={handleFiles}
        />
        <span className="mo-photo-drop-title">
          {remaining > 0 ? "Upload storefront photos" : "Maximum reached"}
        </span>
        <span className="mo-photo-drop-sub">
          {remaining > 0
            ? `${remaining} slot${remaining === 1 ? "" : "s"} remaining · JPG / PNG`
            : "Remove one to add another"}
        </span>
      </label>

      {photos.length > 0 && (
        <ul className="mo-photo-list">
          {photos.map((name) => (
            <li key={name} className="mo-photo-item">
              <span className="mo-photo-ico" aria-hidden="true">
                IMG
              </span>
              <span className="mo-photo-name">{name}</span>
              <button
                type="button"
                className="mo-photo-remove"
                onClick={() => remove(name)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={photos.length === 0}
        >
          Save photos →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP 4 — Integrations (skippable)
   ───────────────────────────────────────────────────────────── */

function IntegrationsStep({
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
  const { integrations } = progress;

  function toggle(key: IntegrationKey) {
    onChange({
      integrations: { ...integrations, [key]: !integrations[key] },
    });
  }

  const tiles: { key: IntegrationKey; label: string; sub: string }[] = [
    { key: "square", label: "Square", sub: "POS sync" },
    { key: "toast", label: "Toast", sub: "Coffee shop POS" },
    { key: "shopify", label: "Shopify", sub: "Retail + online" },
    { key: "meta", label: "Meta / Instagram", sub: "Ads & reach data" },
  ];

  const anyConnected = Object.values(integrations).some(Boolean);

  return (
    <div>
      <div className="mo-int-grid">
        {tiles.map(({ key, label, sub }) => (
          <button
            key={key}
            type="button"
            className={`mo-int-tile${integrations[key] ? " mo-int-tile--connected" : ""}`}
            onClick={() => toggle(key)}
          >
            <span className="mo-int-name">{label}</span>
            <span className="mo-int-sub">{sub}</span>
            <span className="mo-int-state">
              {integrations[key] ? "Connected" : "Connect"}
            </span>
          </button>
        ))}
      </div>
      <p className="ob2-input-hint">
        Optional — enrich verification signals and unlock retention add-on.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!anyConnected}
        >
          Save integrations →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP 5 — Team invite (skippable)
   ───────────────────────────────────────────────────────────── */

function TeamStep({
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
  const { team } = progress;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleKey>("manager");

  function add() {
    const clean = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(clean)) return;
    if (team.some((t) => t.email === clean)) return;
    onChange({ team: [...team, { email: clean, role }] });
    setEmail("");
  }

  function remove(e: string) {
    onChange({ team: team.filter((t) => t.email !== e) });
  }

  return (
    <div>
      <div className="mo-team-row">
        <input
          type="email"
          className="ob2-input mo-team-email"
          placeholder="teammate@yourshop.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <select
          className="ob2-input mo-select mo-team-role"
          value={role}
          onChange={(e) => setRole(e.target.value as RoleKey)}
        >
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
        <button
          type="button"
          className="ob2-btn-secondary mo-team-add"
          onClick={add}
        >
          Add
        </button>
      </div>

      {team.length > 0 && (
        <ul className="mo-team-list">
          {team.map((t) => (
            <li key={t.email} className="mo-team-item">
              <span className="mo-team-mail">{t.email}</span>
              <span className="mo-team-tag">{t.role}</span>
              <button
                type="button"
                className="mo-photo-remove"
                onClick={() => remove(t.email)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="ob2-input-hint">
        Teammates get their own login and can run campaigns on your behalf.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={team.length === 0}
        >
          Save team →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP 6 — Billing
   ───────────────────────────────────────────────────────────── */

function BillingStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { billing } = progress;
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("");

  const digits = cardNumber.replace(/\D/g, "");
  const valid =
    digits.length >= 13 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3,4}$/.test(cvc) &&
    address.trim().length > 0;

  function handleSave() {
    if (!valid) return;
    onChange({
      billing: {
        cardLast4: digits.slice(-4),
        billingZip: address,
        saved: true,
      },
    });
    onComplete();
  }

  return (
    <div>
      <div className="mo-billing-note">
        <strong>Pre-Pilot LOI · $1 activation</strong>
        <span>
          Card on file for the $1 Letter-of-Intent charge. Pilot billing starts
          only after your first verified customer lands.
        </span>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="mb-card">
          Card number
        </label>
        <input
          id="mb-card"
          className="ob2-input"
          type="text"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>

      <div className="ob2-field-row">
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="mb-exp">
            Expiry (MM/YY)
          </label>
          <input
            id="mb-exp"
            className="ob2-input"
            type="text"
            inputMode="numeric"
            placeholder="09/27"
            maxLength={5}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="mb-cvc">
            CVC
          </label>
          <input
            id="mb-cvc"
            className="ob2-input"
            type="text"
            inputMode="numeric"
            placeholder="123"
            maxLength={4}
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
        </div>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="mb-billing-addr">
          Billing address
        </label>
        <input
          id="mb-billing-addr"
          className="ob2-input"
          type="text"
          placeholder="Street, City, State, ZIP"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {billing.saved && (
        <p className="mo-billing-saved">
          Card ending in <strong>•••• {billing.cardLast4}</strong> saved.
        </p>
      )}

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={handleSave}
          disabled={!valid}
        >
          Save payment method →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP 7 — First campaign brief
   ───────────────────────────────────────────────────────────── */

function BriefStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { brief, profile } = progress;
  const [prompt, setPrompt] = useState(brief.prompt);
  const [drafting, setDrafting] = useState(false);

  const draft = useMemo(() => {
    if (!brief.drafted) return null;
    const match = brief.prompt.match(/(\d+)/);
    const target = match ? parseInt(match[1], 10) : 20;
    const rate = getVerticalRate(profile.vertical);
    return {
      headline: `Bring ${target} verified customers to ${profile.businessName || "your shop"} in 14 days`,
      hook: `Editorial coffee run clip + drive-by CTA — ConversionOracle™ predicts ${Math.round(target * 1.12)} verified scans at ${rate > 25 ? "healthy" : "premium"} walk-in confidence.`,
      budget: target * rate,
      rate,
      confidence: 0.88,
    };
  }, [brief.drafted, brief.prompt, profile]);

  function runDraft() {
    const text = prompt.trim() || "20 new customers this month";
    onChange({ brief: { prompt: text, drafted: false } });
    setDrafting(true);
    setTimeout(() => {
      onChange({ brief: { prompt: text, drafted: true } });
      setDrafting(false);
    }, 900);
  }

  return (
    <div>
      <div className="ob2-field">
        <label className="ob2-label" htmlFor="mb-prompt">
          Tell the Customer Acquisition Engine your goal
        </label>
        <textarea
          id="mb-prompt"
          className="ob2-textarea"
          placeholder="e.g. 20 new customers this month"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={160}
        />
      </div>

      {!draft ? (
        <div className="ob2-step-actions">
          <button
            type="button"
            className="ob2-btn-primary"
            onClick={runDraft}
            disabled={drafting || prompt.trim().length < 3}
          >
            {drafting ? "ConversionOracle drafting…" : "Draft brief →"}
          </button>
        </div>
      ) : (
        <div className="mo-brief-card">
          <span className="mo-brief-pill">ConversionOracle™ auto-draft</span>
          <h4 className="mo-brief-headline">{draft.headline}</h4>
          <p className="mo-brief-hook">{draft.hook}</p>
          <dl className="mo-brief-stats">
            <div>
              <dt>Projected budget</dt>
              <dd>${draft.budget.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Vertical rate</dt>
              <dd>${draft.rate}/verified</dd>
            </div>
            <div>
              <dt>Oracle confidence</dt>
              <dd>{Math.round(draft.confidence * 100)}%</dd>
            </div>
          </dl>
          <div className="mo-brief-actions">
            <button
              type="button"
              className="ob2-btn-ghost"
              onClick={() =>
                onChange({ brief: { prompt: brief.prompt, drafted: false } })
              }
            >
              Re-draft
            </button>
            <button
              type="button"
              className="ob2-btn-primary"
              onClick={onComplete}
            >
              Approve brief →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP 8 — Launch summary
   ───────────────────────────────────────────────────────────── */

function LaunchStep({
  progress,
  onLaunch,
}: {
  progress: Progress;
  onLaunch: () => void;
}) {
  const brief = progress.brief;
  const vertical = getVerticalLabel(progress.profile.vertical);
  const match = brief.prompt.match(/(\d+)/);
  const target = match ? parseInt(match[1], 10) : 20;

  return (
    <div>
      <div className="mo-launch-grid">
        <div className="mo-launch-card">
          <span className="mo-launch-eyebrow">Campaign brief</span>
          <p className="mo-launch-line">{brief.prompt || "20 new customers"}</p>
          <p className="mo-launch-sub">{vertical}</p>
        </div>
        <div className="mo-launch-card">
          <span className="mo-launch-eyebrow">QR code</span>
          <p className="mo-launch-line">
            {progress.qr.locationName || "Primary location"}
          </p>
          <p className="mo-launch-sub">{progress.qr.address}</p>
        </div>
        <div className="mo-launch-card">
          <span className="mo-launch-eyebrow">Verification stack</span>
          <p className="mo-launch-line">QR + Claude Vision OCR + Geo-match</p>
          <p className="mo-launch-sub">
            &lt;8s per verified scan · 88% auto-verify rate target
          </p>
        </div>
        <div className="mo-launch-card">
          <span className="mo-launch-eyebrow">Your first SLR tick</span>
          <p className="mo-launch-line">1 active campaign</p>
          <p className="mo-launch-sub">
            Your Software Leverage Ratio (SLR) starts counting from launch.
            Month-12 target ≥ 25.
          </p>
        </div>
      </div>

      <p className="mo-launch-foot">
        Target: {target} verified customers · DisclosureBot compliance checks
        applied to every creator deliverable.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary mo-launch-cta"
          onClick={onLaunch}
        >
          Launch first campaign →
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
    title: "Business profile",
    description: "Name, vertical, ZIP, logo",
    skippable: false,
  },
  {
    id: 2,
    title: "Generate your first QR code",
    description: "Pick a primary location and mint a scannable QR",
    skippable: false,
  },
  {
    id: 3,
    title: "Storefront photos",
    description: "Geo-validation baseline for walk-in verification",
    skippable: false,
  },
  {
    id: 4,
    title: "Integrations",
    description: "Square, Toast, Shopify, Meta — optional enrichment",
    skippable: true,
  },
  {
    id: 5,
    title: "Invite your team",
    description: "Add teammates with owner / manager / staff access",
    skippable: true,
  },
  {
    id: 6,
    title: "Billing",
    description: "Card on file for the $1 Pre-Pilot LOI activation",
    skippable: false,
  },
  {
    id: 7,
    title: "Draft your first campaign brief",
    description: "One-line prompt → ConversionOracle™ auto-draft",
    skippable: false,
  },
  {
    id: 8,
    title: "Launch",
    description: "Review the stack and start your SLR clock",
    skippable: false,
  },
];

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */

export default function MerchantOnboardingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>(INITIAL);
  const [expandedStep, setExpandedStep] = useState<StepId | null>(1);
  const [mounted, setMounted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const p = load();
    setProgress(p);
    setExpandedStep(p.activeStep);
    setMounted(true);
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
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        completed: [...prev.completed.filter((c) => c !== id), id],
        skipped: prev.skipped.filter((s) => s !== id),
        activeStep: nextStep,
      };
      save(next);
      return next;
    });
    setExpandedStep(id === TOTAL ? null : nextStep);
  }

  function skipStep(id: StepId) {
    const nextStep = (id < TOTAL ? id + 1 : id) as StepId;
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        skipped: [...prev.skipped.filter((s) => s !== id), id],
        activeStep: nextStep,
      };
      save(next);
      return next;
    });
    setExpandedStep(id === TOTAL ? null : nextStep);
  }

  function toggleExpand(id: StepId) {
    setExpandedStep((prev) => (prev === id ? null : id));
  }

  function handleLaunch() {
    completeStep(8);
    setCelebrating(true);
    // Confetti runs via CSS — redirect after it plays
    window.setTimeout(() => {
      router.push("/merchant/dashboard");
    }, 1600);
  }

  const completedCount = progress.completed.length + progress.skipped.length;
  const isComplete = completedCount >= TOTAL;

  if (!mounted) return null;

  return (
    <>
      {celebrating && <ConfettiBurst />}
      <OnboardingShell
        role="Merchant"
        totalSteps={TOTAL}
        currentStep={progress.activeStep}
        completedSteps={completedCount}
        isComplete={isComplete}
        onDashboard={() => router.push("/merchant/dashboard")}
      >
        <div className="mo-banner" role="status">
          <span className="mo-banner-eyebrow">
            Vertical AI for Local Commerce
          </span>
          <p className="mo-banner-copy">
            Finish these 8 steps to stand up your Customer Acquisition Engine —
            ConversionOracle™ walk-in prediction goes live the moment you
            launch.
          </p>
          <div className="mo-banner-progress">
            <span className="mo-banner-count">
              {completedCount}/{TOTAL}
            </span>
            <div className="mo-banner-bar">
              <span
                className="mo-banner-bar-fill"
                style={{ width: `${(completedCount / TOTAL) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {STEPS.map(({ id, title, description }) => {
          const status = stepStatus(id, progress);
          const isExpanded = expandedStep === id;
          return (
            <ChecklistItem
              key={id}
              index={id}
              total={TOTAL}
              title={title}
              description={description}
              status={status}
              isExpanded={isExpanded}
              onExpand={() => toggleExpand(id)}
            >
              {id === 1 && (
                <BusinessStep
                  progress={progress}
                  onChange={update}
                  onComplete={() => completeStep(1)}
                />
              )}
              {id === 2 && (
                <QRStep
                  progress={progress}
                  onChange={update}
                  onComplete={() => completeStep(2)}
                />
              )}
              {id === 3 && (
                <PhotosStep
                  progress={progress}
                  onChange={update}
                  onComplete={() => completeStep(3)}
                />
              )}
              {id === 4 && (
                <IntegrationsStep
                  progress={progress}
                  onChange={update}
                  onComplete={() => completeStep(4)}
                  onSkip={() => skipStep(4)}
                />
              )}
              {id === 5 && (
                <TeamStep
                  progress={progress}
                  onChange={update}
                  onComplete={() => completeStep(5)}
                  onSkip={() => skipStep(5)}
                />
              )}
              {id === 6 && (
                <BillingStep
                  progress={progress}
                  onChange={update}
                  onComplete={() => completeStep(6)}
                />
              )}
              {id === 7 && (
                <BriefStep
                  progress={progress}
                  onChange={update}
                  onComplete={() => completeStep(7)}
                />
              )}
              {id === 8 && (
                <LaunchStep progress={progress} onLaunch={handleLaunch} />
              )}
            </ChecklistItem>
          );
        })}
      </OnboardingShell>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Confetti — CSS-only, no lib
   ───────────────────────────────────────────────────────────── */

function ConfettiBurst() {
  const pieces = Array.from({ length: 32 }, (_, i) => i);
  const colors = ["#c1121f", "#780000", "#003049", "#669bbc", "#c9a96e"];
  return (
    <div className="mo-confetti" aria-hidden="true">
      {pieces.map((i) => (
        <span
          key={i}
          className="mo-confetti-piece"
          style={{
            left: `${(i / pieces.length) * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 8) * 40}ms`,
            animationDuration: `${900 + (i % 5) * 120}ms`,
          }}
        />
      ))}
    </div>
  );
}
