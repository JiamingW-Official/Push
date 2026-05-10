"use client";

/* ============================================================
   /creator/discover/[id]/apply — Stage 03 · Apply
   v21 · 2026-05-08 — full-width 2-col layout with sticky right
   rail. Drops the 640px form-only narrow shell so the page
   doesn't feel like a different product than the bento dashboard.

     LEFT (form)  — 4 sequential steps · summary chip · CTA row
     RIGHT (rail) — Campaign re-affirm · Pay snapshot · Timeline
                    expectations · DisclosureBot info

   Submit → /creator/work/confirmed/[gigId] (POST /api/creator/apply
   with mock fallback for demo).
   ============================================================ */

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/lib/mocks/campaigns";
import {
  totalNormalizedPay,
  estimatedHours,
  effectiveHourlyRate,
} from "@/lib/services/pricing";
import {
  StageShell,
  StageHeader,
  StageStep,
  StageButton,
  StageTwoCol,
  StageMain,
  StageRail,
  StageRailCard,
  StagePayRow,
  StageEligRow,
} from "@/components/shared/stage";
import "./apply.css";

const PITCH_MAX = 140;

function nextWindows(): { iso: string; day: string; time: string }[] {
  const windows: { iso: string; day: string; time: string }[] = [];
  const today = new Date();
  const slots = [
    { hour: 10, label: "10:00 AM" },
    { hour: 14, label: "2:00 PM" },
    { hour: 18, label: "6:00 PM" },
  ];
  for (let i = 1; i <= 2; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    for (const s of slots) {
      const wd = new Date(d);
      wd.setHours(s.hour, 0, 0, 0);
      windows.push({ iso: wd.toISOString(), day, time: s.label });
    }
  }
  return windows;
}

export default function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === id);
  if (!c) notFound();
  const campaignId = c.id;

  const router = useRouter();

  const [pitch, setPitch] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [discloseOk, setDiscloseOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const windows = useMemo(() => nextWindows(), []);
  const totalPay = totalNormalizedPay(c.cashPay, c.deliverables);
  const totalHours = estimatedHours(c.deliverables);
  const hourly = effectiveHourlyRate(c.cashPay, c.deliverables);
  const counterClass =
    pitch.length > PITCH_MAX ? "apl__pitch-counter--over" :
    pitch.length > PITCH_MAX * 0.85 ? "apl__pitch-counter--warn" : "";

  const stepsDone =
    (pitch.trim().length > 0 ? 1 : 0) +
    (picked.length >= 1 ? 1 : 0) +
    (confirmed ? 1 : 0) +
    (discloseOk ? 1 : 0);

  const canSubmit =
    pitch.length <= PITCH_MAX &&
    picked.length >= 1 &&
    confirmed &&
    discloseOk &&
    !submitting;

  function togglePick(iso: string) {
    setPicked((prev) =>
      prev.includes(iso)
        ? prev.filter((p) => p !== iso)
        : prev.length >= 3
          ? prev
          : [...prev, iso],
    );
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/creator/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId }),
      });
      if (res.ok) {
        const data: { application_id?: string; success?: boolean } =
          await res.json().catch(() => ({}));
        router.push(`/creator/work/confirmed/${data.application_id ?? campaignId}`);
        return;
      }
      console.warn("[apply] POST /api/creator/apply non-OK", res.status);
    } catch (e) {
      console.warn("[apply] POST /api/creator/apply unavailable, mock redirect", e);
    }
    await new Promise((r) => setTimeout(r, 400));
    router.push(`/creator/work/confirmed/${campaignId}`);
  }

  return (
    <StageShell
      backHref={`/creator/campaign/${c.id}`}
      backLabel="← Back to brief"
      ariaLabel="Apply to campaign"
    >
      <StageHeader
        eyebrow="Stage 03 · Apply · ~60 seconds"
        title="Send your pitch."
        sub={`${c.merchantName} reviews applications within 24 hours. Pitch is optional but lifts acceptance ~28%. Pick at least one shoot window — the merchant locks in the slot that fits.`}
      />

      <StageTwoCol>
        {/* ── LEFT · form (single-column, 4 sequential steps) ── */}
        <StageMain className="stg__main--single apl__form">
          <StageStep
            n={1}
            label="Pitch · optional"
            title="Why you, in 140 characters."
            help='One sentence. The merchant&apos;s most-asked question is "does this creator know my brand?" — answer that.'
          >
            <div className="apl__pitch-wrap">
              <textarea
                className="apl__pitch"
                placeholder="e.g. Williamsburg local, weekly coffee shooter, 12 verified scans this month at 2 cafés on your block."
                maxLength={PITCH_MAX + 20}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                aria-label="Pitch text"
              />
              <p className={`apl__pitch-counter ${counterClass}`}>{pitch.length} / {PITCH_MAX}</p>
            </div>
          </StageStep>

          <StageStep
            n={2}
            label="Availability · required"
            title="Pick 1–3 windows."
            help='Merchant locks one. Pick conservatively — "I picked it but couldn&apos;t shoot" is the #1 dispute on Push.'
          >
            <div className="apl__dates">
              {windows.map((w) => {
                const on = picked.includes(w.iso);
                return (
                  <button
                    key={w.iso}
                    type="button"
                    className={`apl__date${on ? " is-on" : ""}`}
                    onClick={() => togglePick(w.iso)}
                    aria-pressed={on}
                  >
                    <span className="apl__date-day">{w.day}</span>
                    <span className="apl__date-time">{w.time}</span>
                  </button>
                );
              })}
            </div>
          </StageStep>

          <StageStep
            n={3}
            label="Confirm scope · required"
            title="Read-back the deliverables."
          >
            <label className="apl__confirm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span className="apl__confirm-text">
                I&apos;ll deliver{" "}
                {c.deliverables.map((d, i) => (
                  <span key={i}>
                    <strong>{d.count}× {d.type}</strong>
                    {i < c.deliverables.length - 1 ? " + " : ""}
                  </span>
                ))}{" "}
                within the merchant&apos;s deadline window. I understand the QR code at the register is the attribution mechanism — I will include it in at least one frame.
              </span>
            </label>
          </StageStep>

          <StageStep
            n={4}
            label="Disclosure · required"
            title="FTC compliance."
          >
            <div className="apl__ftc">
              <span className="apl__ftc-h">DisclosureBot will auto-check at Submit</span>
              <p>
                Every post must carry an FTC-compliant partner disclosure. Push&apos;s DisclosureBot checks for <strong>#ad</strong> + the merchant&apos;s partner tag at the Submit stage. If a post is missing disclosure, payment holds until corrected — this protects you and the merchant.
              </p>
              <label className="apl__ftc-check">
                <input
                  type="checkbox"
                  checked={discloseOk}
                  onChange={(e) => setDiscloseOk(e.target.checked)}
                />
                <span className="apl__confirm-text">
                  I understand my posts must include FTC disclosure (#ad + partner tag) before payout releases.
                </span>
              </label>
            </div>
          </StageStep>

          {/* CTA row — full-width, asymmetric */}
          <div className="apl__cta-row">
            <StageButton variant="ghost" full={false}>Save draft</StageButton>
            <button
              type="button"
              className="stg__btn stg__btn--primary stg__btn--full"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting ? "Sending…" : "Submit application"}
            </button>
          </div>
          <p className="apl__cta-meta">
            Merchant review · usually within 24 hours · we&apos;ll notify you when they reply
          </p>

          <Link href={`/creator/work/confirmed/${campaignId}`} prefetch={false} aria-hidden style={{ display: "none" }}>
            next
          </Link>
        </StageMain>

        {/* ── RIGHT · sticky rail (campaign re-affirm + economics + tips) ── */}
        <StageRail ariaLabel="Apply summary">
          {/* Campaign re-affirm — primary ink card */}
          <StageRailCard variant="primary" label="Applying to">
            <div className="apl__rail-summary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="apl__rail-img" src={c.images[0]} alt="" />
              <div className="apl__rail-summary-body">
                <span className="apl__rail-merchant">{c.merchantName}</span>
                <span className="apl__rail-title">{c.title}</span>
                <span className="apl__rail-loc">{c.neighborhood} · {c.distanceMi}mi</span>
              </div>
            </div>
          </StageRailCard>

          {/* Pay snapshot */}
          <StageRailCard label="Pay snapshot">
            <ul className="stg__pay-list">
              <StagePayRow label="Total payout" value={`$${totalPay.toFixed(0)}`} />
              <StagePayRow label="Est. hours" value={`${totalHours.toFixed(1)}h`} />
              <StagePayRow label="Effective rate" value={`$${hourly}/hr`} />
            </ul>
          </StageRailCard>

          {/* Step progress */}
          <StageRailCard label="Steps complete" heading={`${stepsDone} of 4`}>
            <ul className="stg__elig-list">
              <StageEligRow status={pitch.trim().length > 0 ? "ok" : "info"} label="Pitch" meta={pitch.trim().length > 0 ? `${pitch.length} chars` : "optional"} />
              <StageEligRow status={picked.length >= 1 ? "ok" : "warn"} label="Availability" meta={`${picked.length} window${picked.length === 1 ? "" : "s"}`} />
              <StageEligRow status={confirmed ? "ok" : "warn"} label="Scope confirmed" />
              <StageEligRow status={discloseOk ? "ok" : "warn"} label="FTC disclosure" />
            </ul>
          </StageRailCard>

          {/* Timeline */}
          <StageRailCard label="What happens next" help="Merchants reply within 24h on average. If accepted, you go straight to Confirmed with QR code + briefing pack ready.">
            <ul className="apl__timeline">
              <li><strong>Now</strong> · you submit</li>
              <li><strong>~24h</strong> · merchant reviews</li>
              <li><strong>If accepted</strong> · Confirmed page unlocks</li>
              <li><strong>Shoot day</strong> · capture & upload</li>
            </ul>
          </StageRailCard>

          {/* Tips */}
          <StageRailCard label="Tip">
            <p className="stg__rail-help">
              Creators who pitch with <strong style={{ color: "var(--ink)", fontFamily: "var(--font-display)", fontWeight: 700 }}>specific scan numbers</strong> from past gigs get accepted 1.4× faster. &ldquo;12 verified scans last month&rdquo; beats &ldquo;great content&rdquo; every time.
            </p>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
