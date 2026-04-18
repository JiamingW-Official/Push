import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../neighborhoods.css";

/* ── Data ──────────────────────────────────────────────────── */

type HoodStatus = "active" | "queue";

interface CohortShop {
  name: string;
  block: string;
  note: string;
}

interface HoodDetail {
  slug: string;
  name: string;
  status: HoodStatus;
  category: string;
  heroSub: string;
  zips: string[];
  aov: string;
  addressable: string;
  launchCost: string;
  targetMRR: string;
  payback: string;
  pilotWindow: string;
  cohort: CohortShop[];
  creatorMix: { tier: string; count: number; note: string }[];
  timelineWeeks: { week: string; focus: string }[];
  pilotBriefTitle: string;
  pilotBriefDeliverables: string[];
}

const DETAILS: Record<string, HoodDetail> = {
  "williamsburg-coffee": {
    slug: "williamsburg-coffee",
    name: "Williamsburg Coffee+",
    status: "active",
    category: "Specialty coffee · bakery · brunch",
    heroSub:
      "Push's Template 0. Vertical AI for Local Commerce, live in Williamsburg Coffee+. Five pilot shops, sixty days, ConversionOracle™ locking the walk-in ground truth.",
    zips: ["11211", "11206", "11249"],
    aov: "$8 – $20",
    addressable: "~200 merchants",
    launchCost: "$8 – 12K",
    targetMRR: "$20 – 35K",
    payback: "5.1 months",
    pilotWindow: "Live · Month 0 – Month 2",
    cohort: [
      {
        name: "Sey Coffee",
        block: "Wythe & N 3rd · 11211",
        note: "Single-origin pour-over flagship, window seating drives dwell.",
      },
      {
        name: "Devoción",
        block: "Grand & Havemeyer · 11211",
        note: "Farm-direct Colombian roastery. Strong morning rush.",
      },
      {
        name: "Partners Coffee",
        block: "N 7th & Berry · 11249",
        note: "Williamsburg flagship, espresso-forward, wholesale anchor.",
      },
      {
        name: "Variety Coffee",
        block: "Graham & Moore · 11206",
        note: "Cold-brew destination, East Williamsburg anchor.",
      },
      {
        name: "Stumptown Williamsburg",
        block: "Wythe Hotel lobby · 11211",
        note: "All-day cafe + wholesale roast storefront.",
      },
    ],
    creatorMix: [
      {
        tier: "T1 Bronze",
        count: 8,
        note: "Neighborhood seeding, 11211 locals",
      },
      {
        tier: "T2 Steel",
        count: 7,
        note: "Verified operators, 50+ conversions",
      },
      {
        tier: "T3 Gold",
        count: 4,
        note: "Category authorities, coffee-geek voice",
      },
      { tier: "T5 Closer", count: 1, note: "Retainer + rev-share anchor" },
    ],
    timelineWeeks: [
      { week: "Week 1", focus: "ICP lock, 5 LOIs, QR printed" },
      {
        week: "Week 2",
        focus: "Campaign templates live, T1 operators onboarded",
      },
      { week: "Week 4", focus: "Claude Vision tuning to 92% auto-verify" },
      {
        week: "Week 6",
        focus: "SLR measure, cohort review, T5 Closer deployed",
      },
      {
        week: "Week 8",
        focus: "Expansion decision — Greenpoint queue triggered",
      },
    ],
    pilotBriefTitle: "Williamsburg Coffee+ · Pilot Brief",
    pilotBriefDeliverables: [
      "1 verified walk-in per creator, per 7-day window",
      "Receipt photo + QR scan · Claude Vision OCR verified",
      "Morning rush (7:00 – 10:00) or weekend brunch (10:00 – 13:00)",
      "Zero paid media · organic posting only · DisclosureBot compliant",
    ],
  },
  greenpoint: {
    slug: "greenpoint",
    name: "Greenpoint",
    status: "queue",
    category: "Specialty coffee · bakery · Polish legacy",
    heroSub:
      "Next ZIP cluster in the Playbook. Greenpoint inherits Williamsburg's ConversionOracle model — smaller cohort, same unit economics, lower acquisition cost.",
    zips: ["11222"],
    aov: "$8 – $22",
    addressable: "~110 merchants",
    launchCost: "$7 – 10K",
    targetMRR: "$16 – 28K",
    payback: "4.8 months (projected)",
    pilotWindow: "Queue · Month 3 – 4",
    cohort: [
      {
        name: "Sey Coffee (Greenpoint)",
        block: "Franklin & Freeman · 11222",
        note: "Sister location, already in Push directory.",
      },
      {
        name: "Variety Greenpoint",
        block: "Manhattan Ave · 11222",
        note: "Polish community anchor, heavy repeat traffic.",
      },
      {
        name: "TBD — LOI pending",
        block: "11222 pilot zone",
        note: "Three more slots to source in outbound Week 1.",
      },
    ],
    creatorMix: [
      { tier: "T1 Bronze", count: 6, note: "11222 locals, Greenpoint-born" },
      {
        tier: "T2 Steel",
        count: 5,
        note: "Verified from Williamsburg graduation",
      },
      { tier: "T3 Gold", count: 3, note: "Polish-community cultural fit" },
      { tier: "T5 Closer", count: 1, note: "Cross-neighborhood retainer" },
    ],
    timelineWeeks: [
      {
        week: "Week 1",
        focus: "LOIs + ICP confirm (inherits Williamsburg template)",
      },
      {
        week: "Week 2",
        focus: "Oracle model shimmed to Greenpoint walk-in data",
      },
      { week: "Week 4", focus: "Auto-verify target 93% (model already warm)" },
      { week: "Week 6", focus: "SLR ratio measured — expect ≥ 20 at launch" },
      { week: "Week 8", focus: "Bushwick queue triggered if SLR holds" },
    ],
    pilotBriefTitle: "Greenpoint · Pilot Brief (preview)",
    pilotBriefDeliverables: [
      "1 verified walk-in per creator, per 7-day window",
      "Identical spec to Williamsburg Coffee+ · shared Oracle model",
      "Target: 93% auto-verify at launch (Williamsburg clocked 92% at Week 4)",
      "DisclosureBot rulings inherit from Williamsburg corpus",
    ],
  },
  bushwick: {
    slug: "bushwick",
    name: "Bushwick",
    status: "queue",
    category: "Coffee · natural wine · bakery",
    heroSub:
      "Third on the board. Bushwick adds natural wine and bakery alongside coffee — category extension, same 12-step Playbook.",
    zips: ["11237", "11206"],
    aov: "$9 – $24",
    addressable: "~140 merchants",
    launchCost: "$8 – 11K",
    targetMRR: "$18 – 30K",
    payback: "5.0 months (projected)",
    pilotWindow: "Queue · Month 4 – 5",
    cohort: [
      {
        name: "Variety Coffee (Graham)",
        block: "Graham Ave · 11206",
        note: "Shared with Williamsburg Coffee+ — bridges the two beachheads.",
      },
      {
        name: "Little Skips East",
        block: "Myrtle Ave · 11237",
        note: "Morning coffee + bakery, Bushwick anchor.",
      },
      {
        name: "TBD — LOI pending",
        block: "11237 pilot zone",
        note: "Natural wine + bakery cohort to source.",
      },
    ],
    creatorMix: [
      { tier: "T1 Bronze", count: 6, note: "Bushwick-native micro creators" },
      { tier: "T2 Steel", count: 4, note: "Coffee + wine crossover voices" },
      { tier: "T3 Gold", count: 3, note: "Food-forward authority creators" },
      { tier: "T5 Closer", count: 1, note: "Cross-neighborhood retainer" },
    ],
    timelineWeeks: [
      { week: "Week 1", focus: "ICP expands — coffee + wine + bakery blended" },
      { week: "Week 2", focus: "Oracle retrain for multi-category walk-in" },
      { week: "Week 4", focus: "Auto-verify 90% target (fresh verticals)" },
      { week: "Week 6", focus: "SLR review — density compound test" },
      {
        week: "Week 8",
        focus: "Metro-wide decision — replicate into LES or Nolita",
      },
    ],
    pilotBriefTitle: "Bushwick · Pilot Brief (preview)",
    pilotBriefDeliverables: [
      "Mixed-category walk-ins: coffee, natural wine, bakery",
      "Receipt + QR + geo-match triple verification",
      "Expanded Oracle corpus covers wine + bakery walk-in flows",
      "Two-Segment Creator Economics — T1-T3 volume + T5 retainer",
    ],
  },
};

/* ── Static params ─────────────────────────────────────────── */

export function generateStaticParams() {
  return Object.keys(DETAILS).map((slug) => ({ slug }));
}

/* ── Metadata ──────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hood = DETAILS[slug];
  if (!hood) return {};

  const title = `${hood.name} — ${hood.status === "active" ? "Live pilot" : "Queue"} | Push Neighborhood Playbook`;
  const description = `${hood.name}: Vertical AI for Local Commerce. ${hood.category}. ZIP ${hood.zips.join("/")}. Launch cost ${hood.launchCost} → target ${hood.targetMRR} MRR by Month 6. ConversionOracle™ inside.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://withpush.co/neighborhoods/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `https://withpush.co/neighborhoods/${slug}`,
    },
  };
}

/* ── Page ─────────────────────────────────────────────────── */

export default async function NeighborhoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hood = DETAILS[slug];
  if (!hood) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: hood.name,
    description: hood.heroSub,
    url: `https://withpush.co/neighborhoods/${hood.slug}`,
    address: {
      "@type": "PostalAddress",
      postalCode: hood.zips.join(", "),
      addressRegion: "NY",
      addressCountry: "US",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollRevealInit />

      <main className="nh-page">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className={`nhd-hero nhd-hero--${hood.status}`}>
          <div className="container nhd-hero-inner">
            <nav className="nhd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Push</Link>
              <span className="nhd-breadcrumb-sep">/</span>
              <Link href="/neighborhoods">Neighborhoods</Link>
              <span className="nhd-breadcrumb-sep">/</span>
              <span style={{ color: "rgba(245,242,236,0.75)" }}>
                {hood.name}
              </span>
            </nav>

            <div className="nhd-hero-badgerow">
              <span
                className={`nhd-hero-status nhd-hero-status--${hood.status}`}
              >
                {hood.status === "active"
                  ? "Active · Template 0"
                  : "Pilot queue"}
              </span>
              <span className="nhd-hero-cat">{hood.category}</span>
            </div>

            <h1 className="nhd-hero-name">{hood.name}</h1>
            <p className="nhd-hero-desc">{hood.heroSub}</p>

            <div className="nhd-hero-chips">
              {hood.zips.map((z) => (
                <span key={z} className="nhd-hero-chip">
                  ZIP {z}
                </span>
              ))}
              <span className="nhd-hero-chip nhd-hero-chip--accent">
                AOV {hood.aov}
              </span>
            </div>
          </div>
        </section>

        {/* ── Unit-econ ─────────────────────────────────────── */}
        <section className="nhd-unit">
          <div className="container">
            <p className="nhd-section-label">Unit economics</p>
            <h2 className="nhd-section-heading">
              Numbers the Playbook holds to.
            </h2>
            <div className="nhd-unit-grid">
              <div className="nhd-unit-card">
                <div className="nhd-unit-label">Launch cost</div>
                <div className="nhd-unit-value">{hood.launchCost}</div>
                <div className="nhd-unit-note">
                  Ops + Pilot subsidy + creator recruitment, fully loaded.
                </div>
              </div>
              <div className="nhd-unit-card">
                <div className="nhd-unit-label">Month-6 MRR target</div>
                <div className="nhd-unit-value">{hood.targetMRR}</div>
                <div className="nhd-unit-note">
                  Steady-state recurring revenue once cohort converts.
                </div>
              </div>
              <div className="nhd-unit-card">
                <div className="nhd-unit-label">Payback</div>
                <div className="nhd-unit-value">{hood.payback}</div>
                <div className="nhd-unit-note">
                  Blended across pilot merchants converting to paid tier.
                </div>
              </div>
              <div className="nhd-unit-card">
                <div className="nhd-unit-label">Addressable</div>
                <div className="nhd-unit-value">{hood.addressable}</div>
                <div className="nhd-unit-note">
                  Coffee+ merchants inside ZIP {hood.zips.join(" · ")}.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cohort logos (name tiles stand in for logos) ── */}
        <section className="nhd-section">
          <div className="container">
            <p className="nhd-section-label">Pilot cohort</p>
            <h2 className="nhd-section-heading">
              {hood.status === "active"
                ? "Five shops locked."
                : "Cohort pipeline."}
            </h2>

            <div className="nhd-cohort-logos">
              {hood.cohort.map((s, i) => (
                <div
                  key={s.name}
                  className="nhd-cohort-logo reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="nhd-cohort-logo-name">{s.name}</div>
                  <div className="nhd-cohort-logo-block">{s.block}</div>
                  <p className="nhd-cohort-logo-note">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 60-day timeline ──────────────────────────────── */}
        <section className="nhd-timeline-v2">
          <div className="container">
            <p className="nhd-section-label">60-day cadence</p>
            <h2 className="nhd-section-heading">The ladder.</h2>

            <ol className="nhd-timeline-list">
              {hood.timelineWeeks.map((t, i) => (
                <li key={t.week} className="nhd-timeline-v2-item reveal">
                  <span className="nhd-timeline-v2-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="nhd-timeline-v2-body">
                    <div className="nhd-timeline-v2-week">{t.week}</div>
                    <div className="nhd-timeline-v2-focus">{t.focus}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Creator mix ──────────────────────────────────── */}
        <section className="nhd-section">
          <div className="container">
            <p className="nhd-section-label">Two-Segment Creator Economics</p>
            <h2 className="nhd-section-heading">Creator tier distribution.</h2>

            <div className="nhd-creator-mix">
              {hood.creatorMix.map((c, i) => (
                <div
                  key={c.tier}
                  className="nhd-creator-mix-card reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="nhd-creator-mix-tier">{c.tier}</div>
                  <div className="nhd-creator-mix-count">{c.count}</div>
                  <div className="nhd-creator-mix-note">{c.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pilot brief preview ─────────────────────────── */}
        <section className="nhd-brief">
          <div className="container">
            <p className="nhd-section-label">Pilot brief preview</p>
            <h2 className="nhd-section-heading">{hood.pilotBriefTitle}</h2>

            <div className="nhd-brief-widget reveal">
              <div className="nhd-brief-widget-head">
                <span className="nhd-brief-widget-stamp">
                  {hood.status === "active" ? "LIVE" : "QUEUED"}
                </span>
                <span className="nhd-brief-widget-window">
                  {hood.pilotWindow}
                </span>
              </div>
              <ul className="nhd-brief-widget-list">
                {hood.pilotBriefDeliverables.map((d, i) => (
                  <li key={i} className="nhd-brief-widget-item">
                    <span className="nhd-brief-widget-bullet" aria-hidden />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="nhd-cta-section">
          <div className="container nhd-cta-inner">
            <h2 className="nhd-cta-headline">
              {hood.status === "active"
                ? "Apply for the pilot."
                : "Queue up a shop."}
              <br />
              <em>{hood.name}.</em>
            </h2>
            <p className="nhd-cta-sub">
              Five-point-one month payback. ConversionOracle™ walk-in ground
              truth. Vertical AI for Local Commerce — priced per verified
              customer, not per post.
            </p>
            <div className="nhd-cta-actions">
              <Link href="/merchant/pilot" className="btn btn-primary">
                Apply for pilot
              </Link>
              <Link href="/neighborhood-playbook" className="btn btn-ghost">
                See the 12-step Playbook
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
