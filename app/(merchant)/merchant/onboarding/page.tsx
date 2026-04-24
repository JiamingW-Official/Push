"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ChecklistItem } from "@/components/onboarding/ChecklistItem";
import type { ChecklistItemStatus } from "@/components/onboarding/ChecklistItem";

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY = "push-demo-merchant-onboarding-progress";

const TOTAL = 7;

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Push 6-color palette for brand color picker
const BRAND_COLORS = [
  { name: "Flag Red", hex: "#c1121f" },
  { name: "Molten Lava", hex: "#780000" },
  { name: "Pearl Stone", hex: "#f5f2ec" },
  { name: "Deep Space Blue", hex: "#003049" },
  { name: "Steel Blue", hex: "#669bbc" },
  { name: "Champagne Gold", hex: "#c9a96e" },
] as const;

const BUSINESS_CATEGORIES = [
  "Restaurant",
  "Café / Coffee",
  "Retail",
  "Beauty & Wellness",
  "Fitness",
  "Bar / Nightlife",
  "Grocery",
  "Other",
] as const;

const POS_INTEGRATIONS = [
  { name: "Toast", icon: "🍞", sub: "Restaurant POS" },
  { name: "Square", icon: "⬛", sub: "General retail" },
  { name: "Lightspeed", icon: "⚡", sub: "Retail & dining" },
  { name: "Clover", icon: "🍀", sub: "Small business" },
  { name: "Revel", icon: "🎯", sub: "Enterprise" },
  { name: "None / Manual", icon: "📋", sub: "Track manually" },
] as const;

type Progress = {
  completed: StepId[];
  skipped: StepId[];
  activeStep: StepId;
  biz: {
    legalName: string;
    category: string;
    website: string;
  };
  location: {
    address: string;
    neighborhood: string;
    city: string;
  };
  pos: string;
  brand: {
    primaryColor: string;
    secondaryColor: string;
  };
  team: string[];
};

const INITIAL: Progress = {
  completed: [],
  skipped: [],
  activeStep: 1,
  biz: { legalName: "", category: "", website: "" },
  location: { address: "", neighborhood: "", city: "New York, NY" },
  pos: "",
  brand: { primaryColor: "", secondaryColor: "" },
  team: [""],
};

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
  if (id === 1) return "active";
  const prev = (id - 1) as StepId;
  if (p.completed.includes(prev) || p.skipped.includes(prev)) return "active";
  return "locked";
}

/* ─────────────────────────────────────────────────────────────
   Step content components
   ───────────────────────────────────────────────────────────── */

function BizProfileStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { biz } = progress;
  const canProceed = biz.legalName.trim().length > 0 && biz.category.length > 0;

  return (
    <div>
      <div className="ob2-field">
        <label className="ob2-label" htmlFor="m-legal">
          Legal business name
        </label>
        <input
          id="m-legal"
          className="ob2-input"
          type="text"
          placeholder="As registered with the state"
          value={biz.legalName}
          onChange={(e) =>
            onChange({ biz: { ...biz, legalName: e.target.value } })
          }
        />
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="m-category">
          Category
        </label>
        <select
          id="m-category"
          className="ob2-select"
          value={biz.category}
          onChange={(e) =>
            onChange({ biz: { ...biz, category: e.target.value } })
          }
        >
          <option value="">Select a category</option>
          {BUSINESS_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="m-website">
          Website
          <span
            style={{
              fontWeight: 400,
              marginLeft: 6,
              color: "var(--text-muted)",
            }}
          >
            (optional)
          </span>
        </label>
        <input
          id="m-website"
          className="ob2-input"
          type="url"
          placeholder="https://yourbusiness.com"
          value={biz.website}
          onChange={(e) =>
            onChange({ biz: { ...biz, website: e.target.value } })
          }
        />
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

function LocationStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { location } = progress;
  const canProceed = location.address.trim().length > 0;

  return (
    <div>
      <div className="ob2-field">
        <label className="ob2-label" htmlFor="m-address">
          Street address
        </label>
        <input
          id="m-address"
          className="ob2-input"
          type="text"
          placeholder="123 Bedford Ave"
          value={location.address}
          onChange={(e) =>
            onChange({
              location: { ...location, address: e.target.value },
            })
          }
          autoComplete="street-address"
        />
      </div>

      <div className="ob2-field-row">
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="m-neighborhood">
            Neighborhood
          </label>
          <input
            id="m-neighborhood"
            className="ob2-input"
            type="text"
            placeholder="Williamsburg"
            value={location.neighborhood}
            onChange={(e) =>
              onChange({
                location: { ...location, neighborhood: e.target.value },
              })
            }
          />
        </div>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="m-city">
            City
          </label>
          <input
            id="m-city"
            className="ob2-input"
            type="text"
            value={location.city}
            onChange={(e) =>
              onChange({ location: { ...location, city: e.target.value } })
            }
          />
        </div>
      </div>

      <p className="ob2-input-hint">
        Additional locations can be added from your merchant dashboard.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!canProceed}
        >
          Add location →
        </button>
      </div>
    </div>
  );
}

function PosStep({
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
  return (
    <div>
      <div className="ob2-integrations-grid">
        {POS_INTEGRATIONS.map(({ name, icon, sub }) => (
          <button
            key={name}
            type="button"
            className={`ob2-integration-btn${progress.pos === name ? " ob2-integration-btn--selected" : ""}`}
            onClick={() => onChange({ pos: name })}
          >
            <span className="ob2-integration-icon">{icon}</span>
            <span className="ob2-integration-info">
              <span className="ob2-integration-name">{name}</span>
              <span className="ob2-integration-sub">{sub}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="ob2-input-hint">
        POS integration enables automatic attribution tracking for campaigns.
      </p>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!progress.pos}
        >
          Connect →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function BrandStep({
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
  const { brand } = progress;

  return (
    <div>
      {/* Logo upload */}
      <div className="ob2-upload-zone">
        <input type="file" accept="image/*" />
        <span className="ob2-upload-icon">🏷</span>
        <p className="ob2-upload-label">Upload your logo</p>
        <p className="ob2-upload-hint">PNG, SVG or JPG · max 2 MB</p>
      </div>

      {/* Primary color */}
      <div className="ob2-field">
        <p className="ob2-label">Primary brand color</p>
        <div className="ob2-color-grid">
          {BRAND_COLORS.map(({ name, hex }) => (
            <button
              key={hex}
              type="button"
              className={`ob2-color-swatch${brand.primaryColor === hex ? " ob2-color-swatch--selected" : ""}`}
              style={{ background: hex }}
              title={name}
              aria-label={`${name} ${brand.primaryColor === hex ? "(selected)" : ""}`}
              onClick={() =>
                onChange({ brand: { ...brand, primaryColor: hex } })
              }
            />
          ))}
        </div>
      </div>

      {/* Secondary color */}
      <div className="ob2-field">
        <p className="ob2-label">Secondary brand color</p>
        <div className="ob2-color-grid">
          {BRAND_COLORS.map(({ name, hex }) => (
            <button
              key={hex}
              type="button"
              className={`ob2-color-swatch${brand.secondaryColor === hex ? " ob2-color-swatch--selected" : ""}`}
              style={{ background: hex }}
              title={name}
              aria-label={`${name} ${brand.secondaryColor === hex ? "(selected)" : ""}`}
              onClick={() =>
                onChange({ brand: { ...brand, secondaryColor: hex } })
              }
            />
          ))}
        </div>
        <p className="ob2-input-hint">
          Colors are restricted to the Push brand palette for campaign
          consistency.
        </p>
      </div>

      <div className="ob2-step-actions">
        <button type="button" className="ob2-btn-primary" onClick={onComplete}>
          Save assets →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function CampaignStep({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <div className="ob2-tour-callout">
        <p className="ob2-tour-eyebrow">Quick start</p>
        <h3 className="ob2-tour-title">Launch your first campaign today.</h3>
        <p className="ob2-tour-desc">
          Set your offer, choose a neighborhood, and publish in under 5 minutes.
          NYC creators apply within hours.
        </p>
      </div>

      <div className="ob2-step-actions">
        <Link href="/merchant/campaigns/new" className="ob2-btn-primary">
          Create campaign →
        </Link>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Do this later
        </button>
      </div>
    </div>
  );
}

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

  function updateEmail(i: number, val: string) {
    const next = [...team];
    next[i] = val;
    onChange({ team: next });
  }

  function addRow() {
    onChange({ team: [...team, ""] });
  }

  function removeRow(i: number) {
    if (team.length === 1) {
      onChange({ team: [""] });
      return;
    }
    onChange({ team: team.filter((_, idx) => idx !== i) });
  }

  const hasAnyEmail = team.some((e) => e.trim().length > 0);

  return (
    <div>
      <div className="ob2-team-invites">
        {team.map((email, i) => (
          <div key={i} className="ob2-team-invite-row">
            <input
              type="email"
              className="ob2-team-invite-input"
              placeholder="teammate@email.com"
              value={email}
              onChange={(e) => updateEmail(i, e.target.value)}
              autoComplete="email"
            />
            <button
              type="button"
              className="ob2-team-invite-remove"
              onClick={() => removeRow(i)}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="ob2-add-row-btn" onClick={addRow}>
        + Add another
      </button>

      <div className="ob2-step-actions" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!hasAnyEmail}
        >
          Send invites →
        </button>
        <button type="button" className="ob2-btn-ghost" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function QrStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div>
      <div className="ob2-qr-callout">
        <div className="ob2-qr-placeholder">
          <span className="ob2-qr-icon">▣</span>
        </div>
        <div className="ob2-qr-info">
          <p className="ob2-qr-title">Your attribution QR code</p>
          <p className="ob2-qr-desc">
            Print and place at your location. Every scan ties back to the
            creator who drove the visit.
          </p>
        </div>
      </div>

      <div className="ob2-step-actions">
        <Link href="/merchant/qr-codes" className="ob2-btn-primary">
          Go to QR codes →
        </Link>
        <button type="button" className="ob2-btn-ghost" onClick={onComplete}>
          Finish setup
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
}[] = [
  {
    id: 1,
    title: "Business profile",
    description: "Legal name, category, and website",
  },
  {
    id: 2,
    title: "Add first location",
    description: "Street address and neighborhood",
  },
  {
    id: 3,
    title: "Connect POS",
    description: "Optional — enables automatic attribution",
  },
  {
    id: 4,
    title: "Brand assets",
    description: "Logo and brand colors",
  },
  {
    id: 5,
    title: "Create first campaign",
    description: "Launch in under 5 minutes",
  },
  {
    id: 6,
    title: "Invite team",
    description: "Add team members to your account",
  },
  {
    id: 7,
    title: "Print QR code",
    description: "Place at your location for attribution tracking",
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

  return (
    <OnboardingShell
      role="Merchant"
      totalSteps={TOTAL}
      currentStep={progress.activeStep}
      completedSteps={completedCount}
      isComplete={isComplete}
      onDashboard={() => router.push("/merchant/dashboard")}
    >
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
              <BizProfileStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(1)}
              />
            )}
            {id === 2 && (
              <LocationStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(2)}
              />
            )}
            {id === 3 && (
              <PosStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(3)}
                onSkip={() => skipStep(3)}
              />
            )}
            {id === 4 && (
              <BrandStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(4)}
                onSkip={() => skipStep(4)}
              />
            )}
            {id === 5 && <CampaignStep onSkip={() => skipStep(5)} />}
            {id === 6 && (
              <TeamStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(6)}
                onSkip={() => skipStep(6)}
              />
            )}
            {id === 7 && <QrStep onComplete={() => completeStep(7)} />}
          </ChecklistItem>
        );
      })}
    </OnboardingShell>
  );
}
