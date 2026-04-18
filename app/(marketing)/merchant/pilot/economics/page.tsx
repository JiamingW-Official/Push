"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../../../landing.css";
import "./economics.css";

/* ============================================================
   Pilot Economics Calculator (v5.1 P1-6)
   Transparent per-vertical pricing + Pilot-subsidy math.
   Authoritative numbers sourced from
   .claude/UPDATE_INSTRUCTIONS_v5_1.md §2 问题 2 & §3.
   ============================================================ */

type VerticalKey = "coffee" | "coffee_plus" | "dessert" | "fitness" | "beauty";

type Vertical = {
  key: VerticalKey;
  label: string;
  tagline: string;
  firstVisitRate: number; // Push charge per verified first-visit customer ($)
  aov: number; // Merchant avg order value ($)
  annualVisits: number; // Expected annual repeat visits
  breakevenVisit: number; // Visit # at which merchant recovers Push cost
  retV2: number; // Retention add-on: second-visit charge ($)
  retV3: number; // Retention add-on: third-visit charge ($)
  retLoyalty: number; // Loyalty opt-in one-time charge ($)
  grossMarginPct: number; // Push per-customer GM % (ref 27.9% for Coffee+)
  creatorPayout: number; // Avg creator payout per verified customer ($)
};

const VERTICALS: Record<VerticalKey, Vertical> = {
  coffee: {
    key: "coffee",
    label: "Pure coffee",
    tagline: "AOV $6 · 8 annual visits · breakeven visit 3",
    firstVisitRate: 15,
    aov: 6,
    annualVisits: 8,
    breakevenVisit: 3,
    retV2: 8,
    retV3: 6,
    retLoyalty: 4,
    grossMarginPct: 0.23,
    creatorPayout: 7,
  },
  coffee_plus: {
    key: "coffee_plus",
    label: "Williamsburg Coffee+",
    tagline: "AOV $14 · 4 annual visits · breakeven visit 2",
    firstVisitRate: 25,
    aov: 14,
    annualVisits: 4,
    breakevenVisit: 2,
    retV2: 8,
    retV3: 6,
    retLoyalty: 4,
    grossMarginPct: 0.279,
    creatorPayout: 12,
  },
  dessert: {
    key: "dessert",
    label: "Specialty dessert",
    tagline: "AOV $11 · 3 annual visits · breakeven visit 2",
    firstVisitRate: 22,
    aov: 11,
    annualVisits: 3,
    breakevenVisit: 2,
    retV2: 8,
    retV3: 6,
    retLoyalty: 4,
    grossMarginPct: 0.26,
    creatorPayout: 10,
  },
  fitness: {
    key: "fitness",
    label: "Boutique fitness",
    tagline: "AOV $55 · 5 annual visits · breakeven visit 2",
    firstVisitRate: 60,
    aov: 55,
    annualVisits: 5,
    breakevenVisit: 2,
    retV2: 24,
    retV3: 18,
    retLoyalty: 12,
    grossMarginPct: 0.3,
    creatorPayout: 28,
  },
  beauty: {
    key: "beauty",
    label: "Beauty service",
    tagline: "AOV $80 · 3 annual visits · breakeven visit 2",
    firstVisitRate: 85,
    aov: 80,
    annualVisits: 3,
    breakevenVisit: 2,
    retV2: 24,
    retV3: 18,
    retLoyalty: 12,
    grossMarginPct: 0.32,
    creatorPayout: 40,
  },
};

const PILOT_FREE_CUSTOMERS = 10; // First 10 AI-verified customers free per merchant
const MONTHLY_BASE_FEE = 500; // $500/mo min — kicks in once merchant exits Pilot
const V2_RATE = 0.4; // Share of first-visit customers that return (visit 2)
const V3_RATE = 0.2; // Share that complete visit 3
const LOYALTY_OPT_IN = 0.3; // Share that opt into loyalty list on visit 1

// Sensible slider defaults per vertical — high-AOV verticals run fewer customers/mo
const VERTICAL_DEFAULTS: Record<
  VerticalKey,
  { monthly: number; months: number; retention: number }
> = {
  coffee: { monthly: 30, months: 6, retention: 55 },
  coffee_plus: { monthly: 18, months: 6, retention: 60 },
  dessert: { monthly: 15, months: 6, retention: 50 },
  fitness: { monthly: 10, months: 6, retention: 65 },
  beauty: { monthly: 8, months: 6, retention: 70 },
};

/* ── Number formatters ───────────────────────────────────── */
const fmt$ = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const fmt$2 = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const fmtX = (n: number) =>
  `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}×`;
const fmtMo = (n: number) =>
  n >= 99
    ? "—"
    : `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })} mo`;

/* ============================================================
   Component
   ============================================================ */
export default function PilotEconomicsPage() {
  const [verticalKey, setVerticalKey] = useState<VerticalKey>("coffee_plus");
  const [monthlyVerified, setMonthlyVerified] = useState<number>(18);
  const [months, setMonths] = useState<number>(6);
  const [retentionPct, setRetentionPct] = useState<number>(60);

  const [openBlock, setOpenBlock] = useState<string | null>(null);
  const toggleBlock = (id: string) =>
    setOpenBlock((prev) => (prev === id ? null : id));

  /* ── Auto-adjust slider defaults when vertical changes ─── */
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const d = VERTICAL_DEFAULTS[verticalKey];
    setMonthlyVerified(d.monthly);
    setMonths(d.months);
    setRetentionPct(d.retention);
  }, [verticalKey]);

  /* ── GSAP parallax on hero lines (v5.1 polish) ─────────── */
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let mounted = true;
    let ctxCleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!mounted || !heroRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const el = heroRef.current!;
        const eyebrow = el.querySelector(".pe-hero-eyebrow");
        const l1 = el.querySelector(".pe-hero-l1");
        const l2 = el.querySelector(".pe-hero-l2");
        const l3 = el.querySelector(".pe-hero-l3");

        const makeTween = (target: Element | null, y: number) => {
          if (!target) return;
          gsap.to(target, {
            yPercent: y,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        };

        makeTween(eyebrow, -36);
        makeTween(l1, -24);
        makeTween(l2, -12);
        makeTween(l3, -4);
      }, heroRef);

      ctxCleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      ctxCleanup?.();
    };
  }, []);

  const v = VERTICALS[verticalKey];

  /* ── Derived math (memoized) ────────────────────────────── */
  const math = useMemo(() => {
    const retScale = retentionPct / 100;
    const effV2 = V2_RATE * retScale;
    const effV3 = V3_RATE * retScale;
    const effLoyalty = LOYALTY_OPT_IN * retScale;

    const totalVerified = monthlyVerified * months;
    const freeCustomers = Math.min(PILOT_FREE_CUSTOMERS, totalVerified);
    const paidCustomers = Math.max(0, totalVerified - freeCustomers);

    // Push revenue lines
    const firstVisitRevGross = totalVerified * v.firstVisitRate;
    const subsidyAbsorbed = freeCustomers * v.firstVisitRate;
    const firstVisitRevNet = paidCustomers * v.firstVisitRate;

    // Retention add-on: applies to ALL verified customers (software layer)
    const retentionRevPerCustomer =
      effV2 * v.retV2 + effV3 * v.retV3 + effLoyalty * v.retLoyalty;
    const retentionRevTotal = totalVerified * retentionRevPerCustomer;

    // Monthly base fee: kicks in once merchant crosses Pilot threshold
    // Approximate: merchant is in Pilot while total verified ≤ 10.
    // Months in Pilot = ceil(PILOT_FREE_CUSTOMERS / monthlyVerified), clamped.
    const monthsInPilot = Math.min(
      months,
      Math.ceil(PILOT_FREE_CUSTOMERS / Math.max(1, monthlyVerified)),
    );
    const monthsPaid = Math.max(0, months - monthsInPilot);
    const baseFeeRevenue = monthsPaid * MONTHLY_BASE_FEE;

    const pushRevenueTotal =
      firstVisitRevNet + retentionRevTotal + baseFeeRevenue;
    const merchantTotalSpend = pushRevenueTotal; // merchant pays what Push charges

    // Merchant-side
    // Simple linear: each verified customer makes annualVisits × (months/12) trips.
    const visitsPerCustomer = (v.annualVisits * months) / 12;
    const merchantRevenue = totalVerified * v.aov * visitsPerCustomer;
    const merchantROI =
      merchantTotalSpend > 0 ? merchantRevenue / merchantTotalSpend : 0;

    // Push GM
    const pushGrossMargin = pushRevenueTotal * v.grossMarginPct;

    // Month-to-payback: merchant months to earn back their spend from
    // incremental revenue. Monthly incremental revenue per active cohort:
    // Visits come in over time — we approximate month-to-payback as
    // merchantTotalSpend / (monthlyVerified × v.aov × v.annualVisits/12 × months(weighted)).
    // Simpler transparent form: merchant earns rev at rate
    // (monthlyVerified × v.aov × v.annualVisits / 12) per month steady state.
    const monthlyIncrementalRev =
      monthlyVerified * v.aov * (v.annualVisits / 12);
    const monthToPayback =
      monthlyIncrementalRev > 0
        ? merchantTotalSpend / monthlyIncrementalRev
        : 99;

    return {
      totalVerified,
      freeCustomers,
      paidCustomers,
      firstVisitRevGross,
      subsidyAbsorbed,
      firstVisitRevNet,
      retentionRevPerCustomer,
      retentionRevTotal,
      monthsInPilot,
      monthsPaid,
      baseFeeRevenue,
      pushRevenueTotal,
      merchantTotalSpend,
      visitsPerCustomer,
      merchantRevenue,
      merchantROI,
      pushGrossMargin,
      monthlyIncrementalRev,
      monthToPayback,
      effV2,
      effV3,
      effLoyalty,
    };
  }, [v, monthlyVerified, months, retentionPct]);

  /* ============================================================
     Render
     ============================================================ */
  return (
    <>
      <ScrollRevealInit />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section ref={heroRef} className="pe-hero" aria-labelledby="pe-h">
        <div className="container pe-hero-inner">
          <nav className="pe-crumb" aria-label="Breadcrumb">
            <Link href="/" className="pe-crumb-link">
              Home
            </Link>
            <span className="pe-crumb-sep" aria-hidden="true">
              /
            </span>
            <Link href="/merchant/pilot" className="pe-crumb-link">
              Pilot
            </Link>
            <span className="pe-crumb-sep" aria-hidden="true">
              /
            </span>
            <span className="pe-crumb-current">Economics</span>
          </nav>

          <div className="pe-hero-label">
            <span className="rule" />
            <span className="eyebrow pe-hero-eyebrow">
              Pilot Economics · Vertical AI for Local Commerce
            </span>
          </div>

          <h1 id="pe-h" className="pe-hero-h">
            <span className="pe-hero-l1">
              <span className="pe-hero-conn">Open book.</span>
            </span>
            <span className="pe-hero-l2">
              <span className="pe-hero-key">See every dollar.</span>
            </span>
            <span className="pe-hero-l3">
              <em className="pe-hero-accent">Then decide.</em>
            </span>
          </h1>

          <p className="pe-hero-sub">
            Pick your vertical. Plug in a monthly customer target. See exact
            Push cost, Pilot subsidy absorbed, merchant revenue, ROI multiple,
            and months-to-payback. No rounding, no surprise fees &mdash; the
            same numbers ConversionOracle uses internally.
          </p>
        </div>
      </section>

      {/* ── CALCULATOR ─────────────────────────────────────── */}
      <section className="pe-calc" aria-labelledby="pe-calc-h">
        <div className="container pe-calc-inner">
          {/* INPUTS ─────────────────────────────────────────── */}
          <div className="pe-inputs reveal">
            <div className="pe-section-tag">
              <span className="pe-section-tag-num">01</span>
              <span className="pe-section-tag-line" />
              <span className="pe-section-tag-label">Inputs</span>
            </div>
            <h2 id="pe-calc-h" className="pe-inputs-h">
              Your business,{" "}
              <span className="pe-h-light">your assumptions.</span>
            </h2>

            {/* Vertical */}
            <div className="pe-field">
              <label htmlFor="pe-vertical" className="pe-label">
                Vertical
              </label>
              <select
                id="pe-vertical"
                className="pe-select"
                value={verticalKey}
                onChange={(e) => setVerticalKey(e.target.value as VerticalKey)}
              >
                {Object.values(VERTICALS).map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="pe-field-hint">{v.tagline}</p>
            </div>

            {/* Monthly verified customers */}
            <div className="pe-field">
              <div className="pe-field-head">
                <label htmlFor="pe-verified" className="pe-label">
                  AI-verified customers / month
                </label>
                <output className="pe-field-value" htmlFor="pe-verified">
                  {monthlyVerified}
                </output>
              </div>
              <input
                id="pe-verified"
                type="range"
                min={1}
                max={100}
                step={1}
                value={monthlyVerified}
                onChange={(e) =>
                  setMonthlyVerified(Math.max(1, Number(e.target.value)))
                }
                className="pe-slider"
              />
              <div className="pe-slider-scale">
                <span>1</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Months running */}
            <div className="pe-field">
              <div className="pe-field-head">
                <label htmlFor="pe-months" className="pe-label">
                  Months running
                </label>
                <output className="pe-field-value" htmlFor="pe-months">
                  {months}
                </output>
              </div>
              <input
                id="pe-months"
                type="range"
                min={1}
                max={24}
                step={1}
                value={months}
                onChange={(e) => setMonths(Math.max(1, Number(e.target.value)))}
                className="pe-slider"
              />
              <div className="pe-slider-scale">
                <span>1</span>
                <span>6</span>
                <span>12</span>
                <span>18</span>
                <span>24</span>
              </div>
            </div>

            {/* Retention rate */}
            <div className="pe-field">
              <div className="pe-field-head">
                <label htmlFor="pe-retention" className="pe-label">
                  Retention rate
                </label>
                <output className="pe-field-value" htmlFor="pe-retention">
                  {retentionPct}%
                </output>
              </div>
              <input
                id="pe-retention"
                type="range"
                min={0}
                max={100}
                step={5}
                value={retentionPct}
                onChange={(e) =>
                  setRetentionPct(Math.max(0, Number(e.target.value)))
                }
                className="pe-slider"
              />
              <p className="pe-field-hint">
                Baseline: 60% (ConversionOracle Williamsburg Coffee+ cohort,
                Month 6).
              </p>
            </div>

            <div className="pe-inputs-locks">
              <p className="pe-locks-h">Locked parameters</p>
              <ul className="pe-locks-list">
                <li>
                  <span>Pilot subsidy</span>
                  <strong>First 10 AI-verified free</strong>
                </li>
                <li>
                  <span>Post-Pilot base fee</span>
                  <strong>$500 / month min</strong>
                </li>
                <li>
                  <span>Retention add-on</span>
                  <strong>
                    {fmt$(v.retV2)} / {fmt$(v.retV3)} / {fmt$(v.retLoyalty)}
                  </strong>
                </li>
                <li>
                  <span>Per-customer GM ref</span>
                  <strong>{Math.round(v.grossMarginPct * 1000) / 10}%</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* OUTPUTS ────────────────────────────────────────── */}
          <div
            className="pe-outputs reveal"
            style={{ transitionDelay: "80ms" }}
          >
            <div className="pe-section-tag">
              <span className="pe-section-tag-num">02</span>
              <span className="pe-section-tag-line" />
              <span className="pe-section-tag-label">Live output</span>
            </div>
            <h2 className="pe-outputs-h">
              Every line item.{" "}
              <span className="pe-h-light">Click to see the math.</span>
            </h2>

            {/* Output Card: Total Push revenue */}
            <OutputCard
              id="push-rev"
              eyebrow="Total Push revenue"
              value={fmt$(math.pushRevenueTotal)}
              tone="gold"
              open={openBlock === "push-rev"}
              onToggle={() => toggleBlock("push-rev")}
            >
              <ul className="pe-math">
                <li>
                  <span>Verified customers (paid after subsidy)</span>
                  <strong>
                    {math.paidCustomers.toLocaleString("en-US")} ×{" "}
                    {fmt$(v.firstVisitRate)} = {fmt$(math.firstVisitRevNet)}
                  </strong>
                </li>
                <li>
                  <span>
                    Retention add-on ({Math.round(math.effV2 * 100)}%→v2 ·{" "}
                    {Math.round(math.effV3 * 100)}%→v3 ·{" "}
                    {Math.round(math.effLoyalty * 100)}%→loyalty)
                  </span>
                  <strong>
                    {math.totalVerified.toLocaleString("en-US")} ×{" "}
                    {fmt$2(math.retentionRevPerCustomer)} ={" "}
                    {fmt$(math.retentionRevTotal)}
                  </strong>
                </li>
                <li>
                  <span>
                    Monthly base fee × post-Pilot months ({math.monthsPaid})
                  </span>
                  <strong>
                    {math.monthsPaid} × {fmt$(MONTHLY_BASE_FEE)} ={" "}
                    {fmt$(math.baseFeeRevenue)}
                  </strong>
                </li>
              </ul>
            </OutputCard>

            {/* Output Card: Pilot subsidy absorbed */}
            <OutputCard
              id="subsidy"
              eyebrow="Pilot subsidy absorbed"
              value={fmt$(math.subsidyAbsorbed)}
              tone="red"
              open={openBlock === "subsidy"}
              onToggle={() => toggleBlock("subsidy")}
            >
              <p className="pe-math-note">
                First 10 AI-verified customers per merchant are{" "}
                <strong>100% Push-absorbed</strong> (contract-capped, 30-day
                rolling). Customer 11 triggers Operator tier auto-flip.
              </p>
              <ul className="pe-math">
                <li>
                  <span>Free customers (first 10 cap)</span>
                  <strong>
                    min(10, {math.totalVerified}) = {math.freeCustomers}
                  </strong>
                </li>
                <li>
                  <span>Subsidy value</span>
                  <strong>
                    {math.freeCustomers} × {fmt$(v.firstVisitRate)} ={" "}
                    {fmt$(math.subsidyAbsorbed)}
                  </strong>
                </li>
                <li>
                  <span>Months in Pilot</span>
                  <strong>{math.monthsInPilot}</strong>
                </li>
              </ul>
            </OutputCard>

            {/* Output Card: Merchant total spend */}
            <OutputCard
              id="merchant-spend"
              eyebrow="Merchant total spend"
              value={fmt$(math.merchantTotalSpend)}
              tone="blue"
              open={openBlock === "merchant-spend"}
              onToggle={() => toggleBlock("merchant-spend")}
            >
              <p className="pe-math-note">
                What you pay Push after the Pilot subsidy. Equals Push revenue
                (no hidden margin between Push charge and merchant bill).
              </p>
              <ul className="pe-math">
                <li>
                  <span>First-visit charges (net of subsidy)</span>
                  <strong>{fmt$(math.firstVisitRevNet)}</strong>
                </li>
                <li>
                  <span>Retention add-on total</span>
                  <strong>{fmt$(math.retentionRevTotal)}</strong>
                </li>
                <li>
                  <span>Post-Pilot base fees</span>
                  <strong>{fmt$(math.baseFeeRevenue)}</strong>
                </li>
                <li className="pe-math-total">
                  <span>Total</span>
                  <strong>{fmt$(math.merchantTotalSpend)}</strong>
                </li>
              </ul>
            </OutputCard>

            {/* Output Card: Merchant estimated revenue */}
            <OutputCard
              id="merchant-rev"
              eyebrow="Merchant estimated revenue"
              value={fmt$(math.merchantRevenue)}
              tone="gold"
              open={openBlock === "merchant-rev"}
              onToggle={() => toggleBlock("merchant-rev")}
            >
              <p className="pe-math-note">
                Linear model: each verified customer makes{" "}
                <strong>{v.annualVisits} visits / year</strong> × AOV{" "}
                {fmt$(v.aov)}, prorated over the Pilot window.
              </p>
              <ul className="pe-math">
                <li>
                  <span>Total verified customers</span>
                  <strong>
                    {monthlyVerified} × {months} ={" "}
                    {math.totalVerified.toLocaleString("en-US")}
                  </strong>
                </li>
                <li>
                  <span>Visits per customer in window</span>
                  <strong>
                    {v.annualVisits} × ({months}/12) ={" "}
                    {math.visitsPerCustomer.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </li>
                <li>
                  <span>AOV</span>
                  <strong>{fmt$(v.aov)}</strong>
                </li>
                <li className="pe-math-total">
                  <span>Merchant revenue</span>
                  <strong>{fmt$(math.merchantRevenue)}</strong>
                </li>
              </ul>
            </OutputCard>

            {/* Output Card: Merchant ROI multiple */}
            <OutputCard
              id="roi"
              eyebrow="Merchant ROI multiple"
              value={fmtX(math.merchantROI)}
              tone="gold"
              open={openBlock === "roi"}
              onToggle={() => toggleBlock("roi")}
            >
              <ul className="pe-math">
                <li>
                  <span>Merchant revenue</span>
                  <strong>{fmt$(math.merchantRevenue)}</strong>
                </li>
                <li>
                  <span>Merchant spend</span>
                  <strong>{fmt$(math.merchantTotalSpend)}</strong>
                </li>
                <li className="pe-math-total">
                  <span>ROI</span>
                  <strong>{fmtX(math.merchantROI)}</strong>
                </li>
              </ul>
              <p className="pe-math-note pe-math-note--ghost">
                ROI &gt; {v.breakevenVisit}× means merchant recovers Push cost
                within the first {v.breakevenVisit} visits &mdash; the {v.label}{" "}
                breakeven target.
              </p>
            </OutputCard>

            {/* Output Card: Push gross margin */}
            <OutputCard
              id="push-gm"
              eyebrow="Push gross margin"
              value={fmt$(math.pushGrossMargin)}
              tone="blue"
              open={openBlock === "push-gm"}
              onToggle={() => toggleBlock("push-gm")}
            >
              <p className="pe-math-note">
                Reference: Coffee+ baseline per-customer GM 27.9% (Rev $25 −
                Creator $12 − Infra $2 − Ops $3 − PG $1.03 = $6.97). Vertical
                adjusts the take-rate around this anchor.
              </p>
              <ul className="pe-math">
                <li>
                  <span>Push revenue total</span>
                  <strong>{fmt$(math.pushRevenueTotal)}</strong>
                </li>
                <li>
                  <span>Vertical GM %</span>
                  <strong>{Math.round(v.grossMarginPct * 1000) / 10}%</strong>
                </li>
                <li className="pe-math-total">
                  <span>Push GM</span>
                  <strong>{fmt$(math.pushGrossMargin)}</strong>
                </li>
              </ul>
            </OutputCard>

            {/* Output Card: Months to payback */}
            <OutputCard
              id="payback"
              eyebrow="Months to payback"
              value={fmtMo(math.monthToPayback)}
              tone="red"
              open={openBlock === "payback"}
              onToggle={() => toggleBlock("payback")}
            >
              <p className="pe-math-note">
                When merchant&apos;s monthly incremental revenue from Push
                customers covers the cumulative Push spend.
              </p>
              <ul className="pe-math">
                <li>
                  <span>
                    Monthly incremental revenue ({monthlyVerified} new ×{" "}
                    {fmt$(v.aov)} × {v.annualVisits}/12)
                  </span>
                  <strong>{fmt$(math.monthlyIncrementalRev)}</strong>
                </li>
                <li>
                  <span>Merchant total spend</span>
                  <strong>{fmt$(math.merchantTotalSpend)}</strong>
                </li>
                <li className="pe-math-total">
                  <span>Payback</span>
                  <strong>{fmtMo(math.monthToPayback)}</strong>
                </li>
              </ul>
            </OutputCard>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────── */}
      <section className="pe-footer" aria-labelledby="pe-footer-h">
        <div className="container pe-footer-inner">
          <div className="pe-footer-copy">
            <div className="pe-section-tag">
              <span className="pe-section-tag-num">03</span>
              <span className="pe-section-tag-line" />
              <span className="pe-section-tag-label">Next step</span>
            </div>
            <h2 id="pe-footer-h" className="pe-footer-h">
              Numbers work?{" "}
              <span className="pe-h-light">Lock your Pilot slot.</span>
            </h2>
            <p className="pe-footer-sub">
              5 Williamsburg Coffee+ slots remain in the next 14 days. $0 Pilot,
              $1 LOI, 60-day commitment. ConversionOracle prepares your brief
              preview within 48 hours of approval.
            </p>
            <div className="pe-footer-ctas">
              <Link
                href={`/merchant/pilot?seed=${encodeURIComponent(
                  `${verticalKey}|${monthlyVerified}|${months}|${retentionPct}`,
                )}#apply`}
                className="btn-fill"
              >
                Apply with these numbers
              </Link>
              <Link href="/merchant/pilot" className="btn-outline-light">
                Back to pilot overview
              </Link>
            </div>
          </div>

          <aside className="pe-footer-note" aria-label="Sources">
            <p className="pe-footer-note-eyebrow">How these numbers are set</p>
            <ul className="pe-footer-note-list">
              <li>
                Per-vertical rate = merchant single-visit gross margin × ≤ 2
                (Push never charges more than ~2× what the merchant clears on
                one visit).
              </li>
              <li>
                Retention add-on is software-margin only &mdash; no creator cost
                recurrence on visits 2/3 or loyalty opt-in.
              </li>
              <li>
                Pilot subsidy cap is contract-bound: 10 customers per merchant,
                30-day rolling. Customer 11 hard-flips to Operator tier.
              </li>
              <li>
                GM reference for Coffee+: Rev $25 - Creator $12 - Infra $2 - Ops
                $3 - PG $1.03 = $6.97 (27.9%).
              </li>
              <li>
                Our north-star is Software Leverage Ratio (active campaigns per
                ops FTE) &mdash; not headcount. Target 25 by Month 12.
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   OutputCard — collapsible math panel
   ============================================================ */
type OutputCardProps = {
  id: string;
  eyebrow: string;
  value: string;
  tone: "gold" | "red" | "blue";
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function OutputCard({
  id,
  eyebrow,
  value,
  tone,
  open,
  onToggle,
  children,
}: OutputCardProps) {
  return (
    <div className={`pe-out pe-out--${tone} ${open ? "pe-out--open" : ""}`}>
      <button
        type="button"
        className="pe-out-head"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-body`}
      >
        <span className="pe-out-eyebrow">{eyebrow}</span>
        <span className="pe-out-value">{value}</span>
        <span className="pe-out-toggle" aria-hidden="true">
          {open ? "Hide math" : "Show math"}
        </span>
      </button>
      <div
        id={`${id}-body`}
        className="pe-out-body"
        role="region"
        aria-label={`${eyebrow} calculation`}
        hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}
