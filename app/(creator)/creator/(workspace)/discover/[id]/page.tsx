"use client";

/* ============================================================
   /creator/discover/[id] — Stage 02 · Qualify
   v20 · 2026-05-08 — refactored onto Stage primitives. Layout,
   header, banner, cards, rail cards, buttons, eligibility rows,
   pay rows, risk flags, chips all imported from
   @/components/shared/stage. Stage-specific (hero img · deliv
   rows · meta grid · refs grid · big $/hr stat · mobile CTA)
   stays in detail.css.
   ============================================================ */

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_CAMPAIGNS, type TierLevel } from "@/lib/mocks/campaigns";
import {
  normalizePay,
  totalNormalizedPay,
  estimatedHours,
  effectiveHourlyRate,
} from "@/lib/services/pricing";
import {
  StageShell,
  StageHeader,
  StageChip,
  StageTwoCol,
  StageMain,
  StageRail,
  StageCard,
  StageRailCard,
  StageButton,
  StageButtonStack,
  StageEligRow,
  StagePayRow,
  StageRiskFlag,
} from "@/components/shared/stage";
import "./detail.css";

const CREATOR_TIER: TierLevel = 2;
const CREATOR_AVG_RATE = 42;

function tierLabel(t: TierLevel): string {
  return ["Open to all", "Bronze+", "Steel+", "Gold+", "Ruby+", "Obsidian only"][t - 1];
}

function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function QualifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === id);
  if (!c) notFound();

  const { headline, estimate } = normalizePay(c.cashPay, c.payUnit, c.deliverables);
  const totalPay = totalNormalizedPay(c.cashPay, c.deliverables);
  const totalHours = estimatedHours(c.deliverables);
  const hourly = effectiveHourlyRate(c.cashPay, c.deliverables);
  const ratePremium = hourly - CREATOR_AVG_RATE;
  const ratePremiumPct = Math.round((ratePremium / CREATOR_AVG_RATE) * 100);

  const tierOk = CREATOR_TIER >= c.minimumTier;
  const slotOk = c.slotsRemaining > 0;
  const days = daysUntil(c.deadlineIso);
  const deadlineTight = days !== null && days <= 3;
  const deadlineOk = days === null || days > 0;
  const eligible = tierOk && slotOk && deadlineOk;

  type Flag = { kind: "warn" | "ok" | "info"; copy: string };
  const flags: Flag[] = [];
  if (deadlineTight) flags.push({ kind: "warn", copy: `Tight deadline · only ${days} day${days === 1 ? "" : "s"} to deliver.` });
  if (c.slotsRemaining <= 2) flags.push({ kind: "warn", copy: `Only ${c.slotsRemaining} of ${c.slotsTotal} spots left — apply soon.` });
  if (c.distanceMi > 5 && c.format === "in-person") flags.push({ kind: "warn", copy: `${c.distanceMi}mi away · in-person · factor in transit.` });
  if (hourly > 60) flags.push({ kind: "ok", copy: `Above-average effective rate at $${hourly}/hr.` });
  if (c.matchScore >= 90) flags.push({ kind: "ok", copy: `Strong match · ${c.matchScore}/100 fit score.` });
  flags.push({ kind: "info", copy: "FTC disclosure required at Submit. Standard #ad + partner tag." });

  const formatLabel = c.format === "in-person" ? "In-person" : c.format === "remote" ? "Remote" : "Hybrid";

  return (
    <StageShell
      backHref="/creator/discover"
      backLabel="← Back to discover"
      ariaLabel="Campaign qualify view"
    >
      {/* Hero photograph — stage-specific */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="qual__hero" src={c.images[0]} alt="" />

      <StageHeader
        eyebrow={`${c.category} · ${c.neighborhood} · ${c.distanceMi}mi`}
        title={c.title}
        sub={
          <>
            <strong style={{ color: "var(--graphite)" }}>{c.merchantName}</strong>
            {c.tagline ? ` · ${c.tagline}` : ""}
          </>
        }
        chips={
          <>
            {tierOk ? (
              <StageChip tone="success">Tier match · {tierLabel(c.minimumTier)}</StageChip>
            ) : (
              <StageChip tone="accent">Tier locked · {tierLabel(c.minimumTier)}</StageChip>
            )}
            <StageChip>{formatLabel}</StageChip>
            {c.matchScore >= 85 && (
              <StageChip tone="champagne">{c.matchScore}/100 match</StageChip>
            )}
          </>
        }
      />

      <StageTwoCol>
        <StageMain>
          {/* Brief — full row (text-heavy, benefits from width) */}
          <StageCard eyebrow="Brief" title="What the merchant is asking for" full accent="blue">
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-3)", margin: 0 }}>
              {c.tagline ?? `${c.merchantName} wants ${c.deliverables.length === 1 ? "a single piece" : "a package"} of original ${c.category.toLowerCase()} content created on-site at their ${c.neighborhood} location. Standard creator brief — no scripts, but please tag the merchant and use the QR code at the register so attribution lands.`}
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-3)", margin: 0 }}>
              <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 700 }}>Must include:</strong>{" "}
              on-location shot · merchant tag · branded hashtag · QR scan moment.{" "}
              <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 700 }}>Must avoid:</strong>{" "}
              competitor brands in frame · price misquotes · #sponsored without partner tag.
            </p>
          </StageCard>

          {/* Deliverables */}
          <StageCard
            eyebrow="Deliverables"
            title={`${c.deliverables.length} item${c.deliverables.length === 1 ? "" : "s"} · ~${totalHours.toFixed(1)} hrs total`}
          >
            <ul className="qual__deliv-list">
              {c.deliverables.map((d, i) => (
                <li key={i} className="qual__deliv">
                  <span className="qual__deliv-count">{d.count}×</span>
                  <span className="qual__deliv-body">
                    <span className="qual__deliv-type">{d.type}</span>
                    <span className="qual__deliv-meta">~{d.estHoursEach}h each</span>
                  </span>
                  <span className="qual__deliv-pay">${d.unitPay}/ea</span>
                </li>
              ))}
            </ul>
          </StageCard>

          {/* Logistics meta */}
          <StageCard eyebrow="Logistics" title="Format · slots · tier · deadline">
            <div className="qual__meta-grid">
              <div className="qual__meta-item">
                <span className="qual__meta-label">Format</span>
                <span className="qual__meta-value">{formatLabel}</span>
              </div>
              <div className="qual__meta-item">
                <span className="qual__meta-label">Slots open</span>
                <span className="qual__meta-value">{c.slotsRemaining} of {c.slotsTotal}</span>
              </div>
              <div className="qual__meta-item">
                <span className="qual__meta-label">Tier required</span>
                <span className="qual__meta-value">{tierLabel(c.minimumTier)}</span>
              </div>
              <div className="qual__meta-item">
                <span className="qual__meta-label">Deadline</span>
                <span className="qual__meta-value">
                  {c.deadlineIso ? `${days}d · ${c.deadlineIso}` : "Open"}
                </span>
              </div>
            </div>
          </StageCard>

          {/* References — full row (3-thumb grid; without `full` it'd
              land alone in col 1 with empty col 2 in the auto 2-col grid) */}
          {c.images.length > 1 && (
            <StageCard eyebrow="Reference frames" title="Visual direction" full>
              <div className="qual__refs">
                {c.images.slice(0, 3).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} className="qual__ref" src={src} alt="" />
                ))}
              </div>
            </StageCard>
          )}
        </StageMain>

        <StageRail ariaLabel="Qualify summary">
          {/* Eligibility */}
          <StageRailCard
            label="Eligibility"
            heading={eligible ? "You qualify" : "Review before applying"}
          >
            <ul className="stg__elig-list">
              <StageEligRow
                status={tierOk ? "ok" : "block"}
                label="Tier match"
                meta={tierOk ? `T${CREATOR_TIER} ≥ T${c.minimumTier}` : `T${CREATOR_TIER} < T${c.minimumTier}`}
              />
              <StageEligRow
                status={slotOk ? "ok" : "block"}
                label="Slots open"
                meta={`${c.slotsRemaining} left`}
              />
              <StageEligRow
                status={deadlineOk ? (deadlineTight ? "warn" : "ok") : "block"}
                label="Deadline"
                meta={days !== null ? `${days}d` : "Open"}
              />
            </ul>
          </StageRailCard>

          {/* Pay anatomy — primary ink card */}
          <StageRailCard variant="primary" label="Pay anatomy">
            <h3 className="qual__pay-headline">{headline}</h3>
            {estimate && <p className="qual__pay-estimate">{estimate}</p>}
            <ul className="stg__pay-list">
              <StagePayRow label="Base cash" value={`$${c.cashPay.toFixed(0)}`} />
              <StagePayRow label="Total estimated" value={`$${totalPay.toFixed(0)}`} />
              <StagePayRow label="Est. hours" value={`${totalHours.toFixed(1)}h`} />
            </ul>
          </StageRailCard>

          {/* Effective $/hr */}
          <StageRailCard label="Effective hourly rate">
            <p className="qual__rate-num">${hourly}/hr</p>
            <p className="stg__rail-help">
              {ratePremium > 0 ? (
                <>
                  <strong style={{ color: "var(--success-dark)", fontFamily: "var(--font-display)", fontWeight: 700 }}>+${ratePremium}/hr</strong> vs your ${CREATOR_AVG_RATE}/hr avg
                  {ratePremiumPct > 0 ? ` · +${ratePremiumPct}%` : ""}
                </>
              ) : (
                <>${Math.abs(ratePremium)}/hr below your ${CREATOR_AVG_RATE}/hr avg</>
              )}
            </p>
          </StageRailCard>

          {/* Risk flags */}
          <StageRailCard label="Flags">
            <ul className="stg__risks">
              {flags.map((f, i) => (
                <StageRiskFlag key={i} kind={f.kind}>{f.copy}</StageRiskFlag>
              ))}
            </ul>
          </StageRailCard>

          {/* CTAs */}
          <StageButtonStack>
            <StageButton
              variant="primary"
              href={eligible ? `/creator/discover/${c.id}/apply` : undefined}
              disabled={!eligible}
            >
              Apply
            </StageButton>
            <StageButton variant="ghost">Save for later</StageButton>
          </StageButtonStack>
        </StageRail>
      </StageTwoCol>

      {/* Mobile bottom CTA strip */}
      <div className="qual__mobile-cta" role="group" aria-label="Apply actions">
        <button type="button" className="stg__btn stg__btn--ghost stg__btn--full">Save</button>
        <Link href={`/creator/discover/${c.id}/apply`} className="stg__btn stg__btn--primary stg__btn--full">
          Apply
        </Link>
      </div>
    </StageShell>
  );
}
