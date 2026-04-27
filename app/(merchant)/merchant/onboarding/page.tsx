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
  { name: "Deep Space Blue", hex: "var(--ink)" },
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
   Shared input style
   ───────────────────────────────────────────────────────────── */

const fieldInputStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 15,
  padding: "12px 16px",
  border: "1px solid var(--hairline)",
  borderRadius: 8,
  background: "var(--surface)",
  color: "var(--ink)",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  display: "block",
  marginBottom: 8,
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
  marginBottom: 20,
};

const hintStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: "var(--ink-4)",
  marginTop: 6,
};

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
      <div style={fieldStyle}>
        <label style={fieldLabelStyle} htmlFor="m-legal">
          Legal business name
        </label>
        <input
          id="m-legal"
          style={fieldInputStyle}
          type="text"
          placeholder="As registered with the state"
          value={biz.legalName}
          onChange={(e) =>
            onChange({ biz: { ...biz, legalName: e.target.value } })
          }
        />
      </div>

      <div style={fieldStyle}>
        <label style={fieldLabelStyle} htmlFor="m-category">
          Category
        </label>
        <select
          id="m-category"
          style={{ ...fieldInputStyle, appearance: "auto" }}
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

      <div style={fieldStyle}>
        <label style={fieldLabelStyle} htmlFor="m-website">
          Website{" "}
          <span style={{ fontWeight: 400, color: "var(--ink-4)" }}>
            (optional)
          </span>
        </label>
        <input
          id="m-website"
          style={fieldInputStyle}
          type="url"
          placeholder="https://yourbusiness.com"
          value={biz.website}
          onChange={(e) =>
            onChange({ biz: { ...biz, website: e.target.value } })
          }
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
          disabled={!canProceed}
          style={{ opacity: canProceed ? 1 : 0.4 }}
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
      <div style={fieldStyle}>
        <label style={fieldLabelStyle} htmlFor="m-address">
          Street address
        </label>
        <input
          id="m-address"
          style={fieldInputStyle}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <label style={fieldLabelStyle} htmlFor="m-neighborhood">
            Neighborhood
          </label>
          <input
            id="m-neighborhood"
            style={fieldInputStyle}
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
        <div>
          <label style={fieldLabelStyle} htmlFor="m-city">
            City
          </label>
          <input
            id="m-city"
            style={fieldInputStyle}
            type="text"
            value={location.city}
            onChange={(e) =>
              onChange({ location: { ...location, city: e.target.value } })
            }
          />
        </div>
      </div>

      <p style={hintStyle}>
        Additional locations can be added from your merchant dashboard.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
          disabled={!canProceed}
          style={{ opacity: canProceed ? 1 : 0.4 }}
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {POS_INTEGRATIONS.map(({ name, icon, sub }) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange({ pos: name })}
            style={{
              background:
                progress.pos === name ? "var(--surface-2)" : "var(--surface)",
              border: `1px solid ${progress.pos === name ? "var(--accent-blue)" : "var(--hairline)"}`,
              borderRadius: 10,
              padding: "16px 12px",
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink)",
                  display: "block",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                }}
              >
                {sub}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p style={hintStyle}>
        POS integration enables automatic attribution tracking for campaigns.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
          disabled={!progress.pos}
          style={{ opacity: progress.pos ? 1 : 0.4 }}
        >
          Connect →
        </button>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
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
      <div
        style={{
          border: "1px dashed var(--hairline)",
          borderRadius: 10,
          padding: "32px",
          textAlign: "center",
          marginBottom: 24,
          background: "var(--surface)",
          cursor: "pointer",
        }}
      >
        <input type="file" accept="image/*" style={{ display: "none" }} />
        <div
          style={{
            fontSize: 24,
            marginBottom: 8,
          }}
        >
          🏷
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink)",
            margin: "0 0 4px",
          }}
        >
          Upload your logo
        </p>
        <p style={hintStyle}>PNG, SVG or JPG · max 2 MB</p>
      </div>

      {/* Primary color */}
      <div style={{ marginBottom: 20 }}>
        <p style={fieldLabelStyle}>Primary brand color</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {BRAND_COLORS.map(({ name, hex }) => (
            <button
              key={hex}
              type="button"
              title={name}
              aria-label={`${name} ${brand.primaryColor === hex ? "(selected)" : ""}`}
              onClick={() =>
                onChange({ brand: { ...brand, primaryColor: hex } })
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: hex,
                border:
                  brand.primaryColor === hex
                    ? "3px solid var(--ink)"
                    : "2px solid var(--hairline)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "border-color 0.15s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Secondary color */}
      <div style={{ marginBottom: 20 }}>
        <p style={fieldLabelStyle}>Secondary brand color</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {BRAND_COLORS.map(({ name, hex }) => (
            <button
              key={hex}
              type="button"
              title={name}
              aria-label={`${name} ${brand.secondaryColor === hex ? "(selected)" : ""}`}
              onClick={() =>
                onChange({ brand: { ...brand, secondaryColor: hex } })
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: hex,
                border:
                  brand.secondaryColor === hex
                    ? "3px solid var(--ink)"
                    : "2px solid var(--hairline)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "border-color 0.15s",
              }}
            />
          ))}
        </div>
        <p style={hintStyle}>
          Colors are restricted to the Push brand palette for campaign
          consistency.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
        >
          Save assets →
        </button>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function CampaignStep({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <div
        style={{
          background: "var(--panel-sky, #e8f4fd)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: "24px",
          marginBottom: 24,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent-blue)",
            display: "block",
            marginBottom: 8,
          }}
        >
          Quick start
        </span>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 20,
            color: "var(--ink)",
            margin: "0 0 8px",
            letterSpacing: "-0.01em",
          }}
        >
          Launch your first campaign today.
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--ink-3)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Set your offer, choose a neighborhood, and publish in under 5 minutes.
          NYC creators apply within hours.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href="/merchant/campaigns/new"
          className="btn-primary click-shift"
        >
          Create campaign →
        </Link>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {team.map((email, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              placeholder="teammate@email.com"
              value={email}
              onChange={(e) => updateEmail(i, e.target.value)}
              autoComplete="email"
              style={{ ...fieldInputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              aria-label="Remove"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink-3)",
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                width: 40,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--accent-blue)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          marginBottom: 20,
        }}
      >
        + Add another
      </button>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          className="btn-primary click-shift"
          onClick={onComplete}
          disabled={!hasAnyEmail}
          style={{ opacity: hasAnyEmail ? 1 : 0.4 }}
        >
          Send invites →
        </button>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onSkip}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function QrStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div>
      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: "24px",
          marginBottom: 24,
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            flexShrink: 0,
          }}
        >
          ▣
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--ink)",
              margin: "0 0 8px",
            }}
          >
            Your attribution QR code
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-3)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Print and place at your location. Every scan ties back to the
            creator who drove the visit.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/merchant/qr-codes" className="btn-primary click-shift">
          Go to QR codes →
        </Link>
        <button
          type="button"
          className="btn-ghost click-shift"
          onClick={onComplete}
        >
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
