"use client";

/* ============================================================
   /creator/money/tax — W-9 → 1099-K → reconciled state machine.

   P2 audit: tax filing state machine. Three formal states:
     1. W-9 not filed yet
     2. W-9 filed (not yet reconciled with 1099)
     3. 1099 reconciled (forms downloadable)

   This is UI scaffolding — real W-9/1099 generation requires the
   accounting backend (Stripe Tax + IRS form rendering). Until that
   lands, we render the state UI with derived demo state.
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import { useEarnings } from "@/lib/data/hooks";
import {
  BentoModule,
  KpiBlock,
  ProgressBar,
  StatusPill,
} from "@/components/shared/primitives";
import "../money.css";
import "./tax.css";

type W9Status = "not-filed" | "filed" | "expired";
type Form1099Status = "unavailable" | "draft" | "ready" | "sent-to-irs";

function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const TAX_THRESHOLD_USD = 600;
const TAX_YEAR = 2026;

export default function MoneyTax() {
  const { data: earnings } = useEarnings();
  const lifetime =
    (earnings?.balances.paidOut ?? 0) +
    (earnings?.balances.cleared ?? 0) +
    (earnings?.balances.processing ?? 0);

  /* Derive state from earnings (demo). Real version would read from
     creators.tax_status DB column populated by the W-9 wizard. */
  const [w9, setW9] = useState<W9Status>("filed");
  const [form1099, setForm1099] = useState<Form1099Status>(
    lifetime >= TAX_THRESHOLD_USD ? "ready" : "unavailable",
  );

  const thresholdReached = lifetime >= TAX_THRESHOLD_USD;
  const stepProgress =
    w9 === "not-filed"
      ? 0
      : w9 === "filed" && form1099 === "unavailable"
        ? 1
        : w9 === "filed" && form1099 === "ready"
          ? 2
          : 3;

  /* Synthesized monthly chart — real backend will return per-month
     payouts. For demo, distribute lifetime evenly across 5 months. */
  const monthlyChart = Array.from({ length: 12 }).map((_, i) => {
    const m = i + 1;
    const isPast = m <= 5;
    return {
      monthLabel: new Date(2026, i, 1).toLocaleDateString("en-US", {
        month: "short",
      }),
      cents: isPast ? Math.round(lifetime / 5) * 100 : 0,
      isPast,
    };
  });
  const maxMonthCents = Math.max(...monthlyChart.map((m) => m.cents), 1);

  return (
    <main className="money-sub" aria-label="Tax">
      <Link href="/creator/money" className="money-sub__back">
        ← Money
      </Link>
      <h1 className="money-sub__title">Tax · {TAX_YEAR}</h1>
      <p className="money-sub__body">
        Push reports payouts ≥ ${TAX_THRESHOLD_USD}/year to the IRS as 1099-K.
        This page tracks your W-9 → 1099 → reconciled progression and lets you
        download forms once available.
      </p>

      {/* ── State machine progress ────────────────────────────── */}
      <section className="tax-state" aria-label="Tax filing state">
        <ProgressBar
          mode="segmented"
          step={stepProgress}
          total={4}
          stepLabels={["W-9 file", "Earn $600+", "1099 ready", "Filed"]}
          tone="ink"
          label="FILING STATUS"
        />
      </section>

      {/* ── 3-up bento ───────────────────────────────────────── */}
      <section className="tax-bento" aria-label="Tax modules">
        <BentoModule
          href="/creator/money/tax#w9"
          eyebrow="W-9 · TAXPAYER ID"
          span={4}
          live={w9 === "not-filed" ? "urgent" : "off"}
          sub={
            w9 === "filed"
              ? "Filed · valid through Dec 31, 2027"
              : "Required before any payout clears"
          }
        >
          <span className="tax-row-status">
            <StatusPill
              variant={w9 === "filed" ? "green" : "red"}
              label={w9 === "filed" ? "On file" : "Not filed"}
              dot
            />
          </span>
          {w9 !== "filed" ? (
            <button
              type="button"
              className="tax-cta"
              onClick={() => setW9("filed")}
            >
              File W-9 now
            </button>
          ) : null}
        </BentoModule>

        <BentoModule
          href="/creator/money/tax#earnings"
          eyebrow={`${TAX_YEAR} EARNINGS · 1099-K THRESHOLD`}
          span={4}
          live={thresholdReached ? "live" : "off"}
          sub={
            thresholdReached
              ? `Threshold reached · 1099-K will issue`
              : `$${fmtMoney(TAX_THRESHOLD_USD - lifetime)} until threshold`
          }
        >
          <KpiBlock
            eyebrow=""
            currency="$"
            value={fmtMoney(lifetime)}
            tone={thresholdReached ? "champagne" : "ink"}
            compact
          />
          <ProgressBar
            mode="linear"
            value={lifetime}
            max={TAX_THRESHOLD_USD}
            tone={thresholdReached ? "champagne" : "ink"}
          />
        </BentoModule>

        <BentoModule
          href="/creator/money/tax#1099"
          eyebrow="1099-K · DOWNLOAD"
          span={4}
          live={form1099 === "ready" ? "live" : "off"}
          sub={
            form1099 === "ready"
              ? "Available · download for your records"
              : form1099 === "unavailable"
                ? "Not yet · earn $600 to unlock"
                : "Generating…"
          }
        >
          <span className="tax-row-status">
            <StatusPill
              variant={
                form1099 === "ready"
                  ? "green"
                  : form1099 === "unavailable"
                    ? "neutral"
                    : "amber"
              }
              label={
                form1099 === "ready"
                  ? "Available"
                  : form1099 === "unavailable"
                    ? "Not yet"
                    : "Generating"
              }
              dot
            />
          </span>
          {form1099 === "ready" ? (
            <a
              href="#"
              className="tax-cta tax-cta--ghost"
              onClick={(e) => {
                e.preventDefault();
                setForm1099("sent-to-irs");
              }}
            >
              Download PDF
            </a>
          ) : null}
        </BentoModule>
      </section>

      {/* ── Monthly chart ─────────────────────────────────────── */}
      <section className="tax-chart-section" aria-label="Monthly payouts">
        <h2 className="tax-h2">Monthly payouts · {TAX_YEAR}</h2>
        <div
          className="tax-chart"
          role="img"
          aria-label="Monthly payout bar chart"
        >
          {monthlyChart.map((m) => (
            <div key={m.monthLabel} className="tax-chart__col">
              <div
                className={`tax-chart__bar${m.isPast ? " is-past" : ""}`}
                style={{
                  height: `${m.cents > 0 ? Math.max(8, (m.cents / maxMonthCents) * 100) : 4}%`,
                }}
                aria-hidden
              />
              <span className="tax-chart__month">{m.monthLabel}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Legal note ────────────────────────────────────────── */}
      <section className="tax-fineprint">
        <h3>About this report</h3>
        <p>
          Push reports gross payouts to the IRS using Form 1099-K when annual
          earnings reach ${TAX_THRESHOLD_USD}. Net amounts on this page exclude
          processing fees and any backup withholding required for unverified
          taxpayer IDs. Consult a tax professional — Push is not authorized to
          provide tax advice.
        </p>
        <ul>
          <li>
            <strong>W-9</strong> · Required before first payout clears. Stays
            valid for the life of your account unless name/EIN changes.
          </li>
          <li>
            <strong>1099-K</strong> · Generated annually in January for the
            prior tax year. Push files with the IRS and emails you a copy.
          </li>
          <li>
            <strong>Backup withholding</strong> · 24% federal hold applied if
            your W-9 has TIN mismatch. Resolved automatically on TIN update.
          </li>
        </ul>
      </section>
    </main>
  );
}
