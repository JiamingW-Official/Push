"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { ChecklistItem } from "@/components/onboarding/ChecklistItem";
import type { ChecklistItemStatus } from "@/components/onboarding/ChecklistItem";
import "./agent-onboarding.css";

/* ─────────────────────────────────────────────────────────────
   v5.1 Goal-First Merchant Onboarding — Vertical AI for Local Commerce

   3 steps replace the legacy 7-step checklist:
     1. Tell the agent your goal (vertical-aware pricing)
     2. Review AI brief + ConversionOracle ROI prediction
     3. Approve & launch → dashboard
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY = "push-demo-merchant-onboarding-v51";

const TOTAL = 3;

type StepId = 1 | 2 | 3;

/* v5.1 Vertical AI for Local Commerce — 5 verticals, each with its own rate */
type VerticalId =
  | "coffee-pure"
  | "coffee-plus"
  | "dessert"
  | "fitness"
  | "beauty";

type Vertical = {
  id: VerticalId;
  label: string;
  rate: number;
  hint: string;
};

const VERTICALS: Vertical[] = [
  {
    id: "coffee-pure",
    label: "Pure Coffee",
    rate: 15,
    hint: "Specialty cafes, espresso bars — $15 per AI-verified customer",
  },
  {
    id: "coffee-plus",
    label: "Williamsburg Coffee+",
    rate: 25,
    hint: "Coffee + light food / retail hybrid — $25 per AI-verified customer (beachhead)",
  },
  {
    id: "dessert",
    label: "Dessert & Bakery",
    rate: 22,
    hint: "Bakeries, ice-cream, boba — $22 per AI-verified customer",
  },
  {
    id: "fitness",
    label: "Fitness & Wellness",
    rate: 60,
    hint: "Studios, gyms, yoga — $60 per AI-verified customer",
  },
  {
    id: "beauty",
    label: "Beauty & Salon",
    rate: 85,
    hint: "Nails, hair, lashes, skincare — $85 per AI-verified customer",
  },
];

const PILOT_VERTICAL: VerticalId = "coffee-plus";

function getVertical(id: VerticalId): Vertical {
  return VERTICALS.find((v) => v.id === id) ?? VERTICALS[1];
}

const GOAL_OPTIONS = [
  { value: "10", label: "10 new customers (1 week)" },
  { value: "20", label: "20 new customers (2 weeks)" },
  { value: "50", label: "50 new customers (1 month)" },
  { value: "100", label: "100 new customers (2 months)" },
];

type GoalForm = {
  businessName: string;
  vertical: VerticalId;
  zip: string;
  customerGoal: string;
  budget: string;
  timeframeDays: number;
};

type AgentMatch = {
  handle: string;
  tier: "Seed" | "Bronze" | "Steel" | "Gold" | "Ruby" | "Obsidian";
  tierColor: string;
  tierTextColor: string;
  score: number;
  estCustomers: number;
  reason: string;
};

type AgentResponse = {
  generatedAt: string;
  latencyMs: number;
  matches: AgentMatch[];
  brief: {
    headline: string;
    cta: string;
    tone: string;
    offerHook: string;
  };
  prediction: {
    estVerifiedCustomers: number;
    confidence: number;
    estSpend: number;
    estRevenueMultiplier: number;
    verticalRate: number;
    verticalLabel: string;
    predictedLiftPct: number;
    retentionAddonRevenue: number;
    oracleSource: "ConversionOracle";
  };
};

type Progress = {
  completed: StepId[];
  activeStep: StepId;
  goal: GoalForm;
  agent: AgentResponse | null;
};

const INITIAL: Progress = {
  completed: [],
  activeStep: 1,
  goal: {
    businessName: "",
    vertical: "coffee-plus",
    zip: "11211",
    customerGoal: "",
    budget: "",
    timeframeDays: 14,
  },
  agent: null,
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
    // ignore
  }
}

function stepStatus(id: StepId, p: Progress): ChecklistItemStatus {
  if (p.completed.includes(id)) return "done";
  if (id === 1) return "active";
  const prev = (id - 1) as StepId;
  if (p.completed.includes(prev)) return "active";
  return "locked";
}

/* ─────────────────────────────────────────────────────────────
   Mock agent — ConversionOracle-style response based on goal + vertical
   Phase 2 replaces this with a real /api/agent/match-creators call
   backed by the ConversionOracle model.
   ───────────────────────────────────────────────────────────── */

function runMockAgent(goal: GoalForm): Promise<AgentResponse> {
  return new Promise((resolve) => {
    const latency = 1400 + Math.random() * 900;
    setTimeout(() => {
      const target = parseInt(goal.customerGoal || "20", 10) || 20;
      const perCreator = Math.max(3, Math.round(target / 5));
      const vertical = getVertical(goal.vertical);
      const estVerified = target + 2;
      const estSpend = estVerified * vertical.rate;
      // ConversionOracle predicts lift: higher for beachhead vertical
      const predictedLiftPct =
        vertical.id === PILOT_VERTICAL
          ? 34
          : 18 + Math.round(Math.random() * 10);
      // Retention Add-on projection: assume 35% come back once, AOV proxy
      const retentionAddonRevenue = Math.round(estVerified * 0.35 * 12);
      resolve({
        generatedAt: new Date().toISOString(),
        latencyMs: Math.round(latency),
        matches: [
          {
            handle: "@maya.eats.nyc",
            tier: "Steel",
            tierColor: "#4a5568",
            tierTextColor: "#ffffff",
            score: 94,
            estCustomers: perCreator + 2,
            reason: "High coffee-niche density, 0.4mi from Williamsburg core",
          },
          {
            handle: "@brooklyn_bites",
            tier: "Gold",
            tierColor: "#c9a96e",
            tierTextColor: "#003049",
            score: 91,
            estCustomers: perCreator + 1,
            reason: "Proven tier, 18 verified coffee visits in last 60 days",
          },
          {
            handle: "@williamsburg.e",
            tier: "Steel",
            tierColor: "#4a5568",
            tierTextColor: "#ffffff",
            score: 89,
            estCustomers: perCreator,
            reason: "Local to 11211, mid-morning foot-traffic audience",
          },
          {
            handle: "@coffee.crawl",
            tier: "Bronze",
            tierColor: "#8c6239",
            tierTextColor: "#ffffff",
            score: 86,
            estCustomers: perCreator - 1,
            reason: "Explorer tier, rising in coffee content engagement",
          },
          {
            handle: "@sip.and.scroll",
            tier: "Bronze",
            tierColor: "#8c6239",
            tierTextColor: "#ffffff",
            score: 83,
            estCustomers: Math.max(2, perCreator - 2),
            reason: "Cold-brew niche, 0.7mi from Bedford Ave",
          },
        ],
        brief: {
          headline: `New in Williamsburg: ${goal.businessName || "your shop"} — try it on Push`,
          cta: "Scan the QR at the counter for $5 off your first drink",
          tone: "Editorial · warm · under-sold",
          offerHook: `ConversionOracle predicts +${predictedLiftPct}% walk-in lift vs. organic baseline (${vertical.label})`,
        },
        prediction: {
          estVerifiedCustomers: estVerified,
          confidence: 0.91,
          estSpend,
          estRevenueMultiplier: 3.2,
          verticalRate: vertical.rate,
          verticalLabel: vertical.label,
          predictedLiftPct,
          retentionAddonRevenue,
          oracleSource: "ConversionOracle",
        },
      });
    }, latency);
  });
}

/* ─────────────────────────────────────────────────────────────
   Step 1 — Tell the agent your goal
   ───────────────────────────────────────────────────────────── */

function GoalStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { goal } = progress;
  const canProceed =
    goal.businessName.trim().length > 0 &&
    goal.customerGoal.length > 0 &&
    goal.budget.trim().length > 0 &&
    goal.zip.trim().length > 0;

  function update<K extends keyof GoalForm>(key: K, value: GoalForm[K]) {
    onChange({ goal: { ...goal, [key]: value } });
  }

  const selectedVertical = getVertical(goal.vertical);
  const isPilotVertical = goal.vertical === PILOT_VERTICAL;

  return (
    <div>
      <p className="goal-step-intro">
        <strong>Vertical AI for Local Commerce.</strong> Tell the agent your
        vertical, your customer target, and your ZIP &mdash; ConversionOracle
        predicts your ROI before you commit a dollar. No brief writing. No RFP.
      </p>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="biz-name">
          Business name
        </label>
        <input
          id="biz-name"
          className="ob2-input"
          type="text"
          placeholder="Sey Coffee"
          value={goal.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          autoComplete="organization"
        />
      </div>

      <div className="ob2-field-row">
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="biz-vertical">
            Vertical
          </label>
          <select
            id="biz-vertical"
            className="ob2-select"
            value={goal.vertical}
            onChange={(e) => update("vertical", e.target.value as VerticalId)}
          >
            {VERTICALS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} &middot; ${v.rate}/customer
              </option>
            ))}
          </select>
          <p className="ob2-input-hint">{selectedVertical.hint}</p>
        </div>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="biz-zip">
            ZIP / Neighborhood
          </label>
          <input
            id="biz-zip"
            className="ob2-input"
            type="text"
            placeholder="11211 — Williamsburg"
            value={goal.zip}
            onChange={(e) => update("zip", e.target.value)}
          />
        </div>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="goal-target">
          How many new customers do you need?
        </label>
        <select
          id="goal-target"
          className="ob2-select"
          value={goal.customerGoal}
          onChange={(e) => update("customerGoal", e.target.value)}
        >
          <option value="">Select a target</option>
          {GOAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ob2-field">
        <label className="ob2-label" htmlFor="goal-budget">
          Monthly budget (USD)
        </label>
        <input
          id="goal-budget"
          className="ob2-input"
          type="number"
          min={500}
          step={100}
          placeholder="800"
          value={goal.budget}
          onChange={(e) => update("budget", e.target.value)}
        />
        {isPilotVertical ? (
          <p className="ob2-input-hint">
            <strong>$0 Pilot</strong> &mdash; first 10 customers free for
            Williamsburg Coffee+ merchants, then auto-flips to Operator at{" "}
            <strong>${selectedVertical.rate}/customer</strong>. $500/mo minimum
            applies once the Pilot converts.{" "}
            <Link href="/merchant/pilot/economics" className="ob2-inline-link">
              See full Pilot economics &rarr;
            </Link>
          </p>
        ) : (
          <p className="ob2-input-hint">
            Operator tier: $500/mo min +{" "}
            <strong>${selectedVertical.rate}/customer</strong> for{" "}
            {selectedVertical.label}. Only the Williamsburg Coffee+ beachhead
            vertical qualifies for the $0 Pilot today.{" "}
            <Link href="/merchant/pilot/economics" className="ob2-inline-link">
              See full Pilot economics &rarr;
            </Link>
          </p>
        )}
      </div>

      <div className="ob2-step-actions">
        <button
          type="button"
          className="ob2-btn-primary"
          onClick={onComplete}
          disabled={!canProceed}
        >
          Send to Customer Acquisition Engine &rarr;
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 2 — AI brief preview
   ───────────────────────────────────────────────────────────── */

function AgentPreviewStep({
  progress,
  onChange,
  onComplete,
}: {
  progress: Progress;
  onChange: (p: Partial<Progress>) => void;
  onComplete: () => void;
}) {
  const { goal, agent } = progress;
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await runMockAgent(goal);
      onChange({ agent: res });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Agent failed. Retry to try again.",
      );
    } finally {
      setRunning(false);
    }
  }, [goal, onChange]);

  useEffect(() => {
    if (!agent && !running) {
      start();
    }
    // Only run on mount / when agent cleared
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verticalForGoal = getVertical(goal.vertical);
  if (running || (!agent && !error)) {
    return (
      <div className="agent-pending">
        <div className="agent-pending-header">
          <span className="agent-pending-dot" />
          <span className="agent-pending-label">
            ConversionOracle &middot; Customer Acquisition Engine booting
          </span>
        </div>
        <div className="agent-pending-bar">
          <div className="agent-pending-bar-fill" />
        </div>
        <ul className="agent-pending-list">
          <li>Parsing goal &mdash; {goal.customerGoal} customers</li>
          <li>
            Scanning creator network for {verticalForGoal.label} &middot;{" "}
            {goal.zip}
          </li>
          <li>Ranking by score + geo + verified-conversion history</li>
          <li>
            ConversionOracle: running walk-in lift prediction vs. organic
            baseline
          </li>
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agent-error">
        <p>{error}</p>
        <button type="button" className="ob2-btn-primary" onClick={start}>
          Retry
        </button>
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="agent-preview">
      {/* Summary card */}
      <div className="agent-preview-summary">
        <div className="agent-preview-summary-head">
          <span className="agent-preview-summary-eyebrow">
            ConversionOracle result &middot;{" "}
            {(agent.latencyMs / 1000).toFixed(1)}s &middot;{" "}
            {agent.prediction.verticalLabel}
          </span>
        </div>
        <div className="agent-preview-summary-grid">
          <div className="agent-preview-summary-stat">
            <span className="agent-preview-summary-num">
              {agent.prediction.estVerifiedCustomers}
            </span>
            <span className="agent-preview-summary-label">
              Est. verified customers
            </span>
          </div>
          <div className="agent-preview-summary-stat">
            <span className="agent-preview-summary-num">
              +{agent.prediction.predictedLiftPct}%
            </span>
            <span className="agent-preview-summary-label">
              ConversionOracle predicted lift
            </span>
          </div>
          <div className="agent-preview-summary-stat">
            <span className="agent-preview-summary-num">
              ${agent.prediction.estSpend}
            </span>
            <span className="agent-preview-summary-label">
              Est. spend @ ${agent.prediction.verticalRate}/customer
            </span>
          </div>
          <div className="agent-preview-summary-stat">
            <span className="agent-preview-summary-num">
              {agent.prediction.estRevenueMultiplier.toFixed(1)}&times;
            </span>
            <span className="agent-preview-summary-label">Projected ROI</span>
          </div>
        </div>
      </div>

      {/* Matches */}
      <div className="agent-preview-section">
        <h4 className="agent-preview-h">Top 5 matches</h4>
        <ul className="agent-preview-matches">
          {agent.matches.map((m) => (
            <li key={m.handle} className="agent-preview-match">
              <div className="agent-preview-match-head">
                <span
                  className="agent-preview-match-dot"
                  style={{ background: m.tierColor }}
                  aria-hidden="true"
                />
                <span className="agent-preview-match-handle">{m.handle}</span>
                <span
                  className="agent-preview-match-tier"
                  style={{
                    background: m.tierColor,
                    color: m.tierTextColor,
                  }}
                >
                  {m.tier}
                </span>
                <span className="agent-preview-match-score">
                  {m.score}
                  <span className="agent-preview-match-score-l">score</span>
                </span>
                <span className="agent-preview-match-est">
                  +{m.estCustomers} customers
                </span>
              </div>
              <p className="agent-preview-match-reason">{m.reason}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Brief */}
      <div className="agent-preview-section">
        <h4 className="agent-preview-h">Draft brief</h4>
        <div className="agent-preview-brief">
          <dl>
            <dt>Headline</dt>
            <dd>{agent.brief.headline}</dd>
            <dt>CTA</dt>
            <dd>{agent.brief.cta}</dd>
            <dt>Tone</dt>
            <dd>{agent.brief.tone}</dd>
            <dt>Offer hook</dt>
            <dd>{agent.brief.offerHook}</dd>
          </dl>
        </div>
      </div>

      <div className="ob2-step-actions">
        <button type="button" className="ob2-btn-primary" onClick={onComplete}>
          Approve &amp; continue &rarr;
        </button>
        <button
          type="button"
          className="ob2-btn-ghost"
          onClick={() => {
            onChange({ agent: null });
            start();
          }}
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step 3 — Approve & launch
   ───────────────────────────────────────────────────────────── */

function ApproveStep({
  progress,
  onComplete,
}: {
  progress: Progress;
  onComplete: () => void;
}) {
  const { agent, goal } = progress;
  const vertical = getVertical(goal.vertical);
  const isPilot = goal.vertical === PILOT_VERTICAL;
  const billingLine = isPilot
    ? `$0 Pilot (first 10 customers free) → auto-flips to Operator at $${vertical.rate}/customer + $500/mo minimum`
    : `Operator tier · $500/mo min + $${vertical.rate} per AI-verified customer (${vertical.label})`;

  return (
    <div className="approve-step">
      <div className="approve-callout">
        <span className="approve-callout-eyebrow">Launch within 7 days</span>
        <h3 className="approve-callout-h">
          Campaign ready.{" "}
          <span className="approve-callout-h-light">
            Customer Acquisition Engine will schedule the network.
          </span>
        </h3>
        <p className="approve-callout-body">
          The agent queues your matched creators, hands each a unique QR, and
          monitors every scan through Claude Vision + geo verification.
          ConversionOracle retrains on every verified walk-in so next
          month&apos;s prediction gets sharper. You&apos;ll see the first
          AI-verified customer in your dashboard as soon as it happens.
        </p>
      </div>

      <ul className="approve-summary">
        <li>
          <span className="approve-summary-k">Business</span>
          <span className="approve-summary-v">
            {goal.businessName || "—"} &middot; {vertical.label}
          </span>
        </li>
        <li>
          <span className="approve-summary-k">Neighborhood</span>
          <span className="approve-summary-v">{goal.zip || "—"}</span>
        </li>
        <li>
          <span className="approve-summary-k">Target</span>
          <span className="approve-summary-v">
            {goal.customerGoal || "—"} verified customers
          </span>
        </li>
        <li>
          <span className="approve-summary-k">Matched creators</span>
          <span className="approve-summary-v">
            {agent
              ? `${agent.matches.length} (${agent.matches[0]?.tier} → ${agent.matches[agent.matches.length - 1]?.tier})`
              : "—"}
          </span>
        </li>
        <li>
          <span className="approve-summary-k">Est. spend</span>
          <span className="approve-summary-v">
            ${agent?.prediction.estSpend ?? 0} @ ${vertical.rate}/customer
          </span>
        </li>
        <li>
          <span className="approve-summary-k">Retention Add-on projection</span>
          <span className="approve-summary-v">
            +${agent?.prediction.retentionAddonRevenue ?? 0} /mo repeat-visit
            revenue (ConversionOracle, 90-day window)
          </span>
        </li>
        <li>
          <span className="approve-summary-k">Billing</span>
          <span className="approve-summary-v">{billingLine}</span>
        </li>
      </ul>

      <div className="ob2-step-actions">
        <button type="button" className="ob2-btn-primary" onClick={onComplete}>
          Launch campaign &rarr;
        </button>
        <Link href="/merchant/pilot/economics" className="ob2-btn-ghost">
          See full Pilot economics
        </Link>
        <Link href="/merchant/dashboard" className="ob2-btn-ghost">
          Dashboard now, launch later
        </Link>
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
    title: "Tell the agent your goal",
    description: "Customer count, budget, vertical, ZIP",
  },
  {
    id: 2,
    title: "Review the AI brief",
    description:
      "Matched creators + draft brief + ConversionOracle ROI prediction",
  },
  {
    id: 3,
    title: "Approve & launch",
    description: "Confirm the agent runs the campaign",
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
      activeStep: nextStep,
    };
    save(next);
    setProgress(next);
    setExpandedStep(id === TOTAL ? null : nextStep);
  }

  function toggleExpand(id: StepId) {
    setExpandedStep((prev) => (prev === id ? null : id));
  }

  const completedCount = progress.completed.length;
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
              <GoalStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(1)}
              />
            )}
            {id === 2 && (
              <AgentPreviewStep
                progress={progress}
                onChange={update}
                onComplete={() => completeStep(2)}
              />
            )}
            {id === 3 && (
              <ApproveStep
                progress={progress}
                onComplete={() => completeStep(3)}
              />
            )}
          </ChecklistItem>
        );
      })}
    </OnboardingShell>
  );
}
