import type { Metadata } from "next";
import Link from "next/link";

/* ── Static neighborhood data ──────────────────────────────── */

const HOOD_DATA: Record<
  string,
  {
    name: string;
    borough: string;
    creators: number;
    campaigns: number;
    verifiedVisits: number;
    avgEarnings: string;
    campaigns_list: { merchant: string; type: string; payout: string }[];
    top_creators: {
      initials: string;
      name: string;
      category: string;
      visits: number;
    }[];
    nearby: { slug: string; name: string; borough: string }[];
  }
> = {
  williamsburg: {
    name: "Williamsburg",
    borough: "Brooklyn",
    creators: 189,
    campaigns: 24,
    verifiedVisits: 4820,
    avgEarnings: "$47",
    campaigns_list: [
      {
        merchant: "Mable's Smokehouse",
        type: "Dine-in visit",
        payout: "$8/visit",
      },
      {
        merchant: "Rough Trade NYC",
        type: "Browse + scan",
        payout: "$5/visit",
      },
      {
        merchant: "Nitehawk Cinema",
        type: "Show attendance",
        payout: "$12/visit",
      },
      { merchant: "Marlow & Sons", type: "Lunch service", payout: "$9/visit" },
    ],
    top_creators: [
      {
        initials: "JK",
        name: "Jordan Kim",
        category: "Food & Drink",
        visits: 312,
      },
      { initials: "AL", name: "Ava Lee", category: "Lifestyle", visits: 287 },
      {
        initials: "MS",
        name: "Marcus Shaw",
        category: "Music & Culture",
        visits: 241,
      },
      { initials: "PR", name: "Priya Rao", category: "Fashion", visits: 198 },
      {
        initials: "TW",
        name: "Tyler Wu",
        category: "Food & Drink",
        visits: 176,
      },
    ],
    nearby: [
      { slug: "greenpoint", name: "Greenpoint", borough: "Brooklyn" },
      { slug: "bushwick", name: "Bushwick", borough: "Brooklyn" },
      { slug: "les", name: "LES", borough: "Manhattan" },
    ],
  },
};

/* Fallback for any slug not in the table above */
function getHood(slug: string) {
  if (HOOD_DATA[slug]) return HOOD_DATA[slug];
  // Generic fallback so static pages don't 404
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    name,
    borough: "NYC",
    creators: 88,
    campaigns: 11,
    verifiedVisits: 1240,
    avgEarnings: "$38",
    campaigns_list: [
      { merchant: "Local Café", type: "Morning visit", payout: "$6/visit" },
      { merchant: "Corner Store", type: "Browse + scan", payout: "$4/visit" },
      {
        merchant: "Neighborhood Bar",
        type: "Evening visit",
        payout: "$10/visit",
      },
    ],
    top_creators: [
      {
        initials: "AJ",
        name: "Alex Johnson",
        category: "Lifestyle",
        visits: 142,
      },
      {
        initials: "SK",
        name: "Sam Kim",
        category: "Food & Drink",
        visits: 118,
      },
      { initials: "RE", name: "Riley Evans", category: "Culture", visits: 97 },
      {
        initials: "MN",
        name: "Morgan Nguyen",
        category: "Fashion",
        visits: 84,
      },
      { initials: "CL", name: "Casey Lee", category: "Music", visits: 71 },
    ],
    nearby: [
      { slug: "williamsburg", name: "Williamsburg", borough: "Brooklyn" },
      { slug: "greenpoint", name: "Greenpoint", borough: "Brooklyn" },
    ],
  };
}

/* ── Static params ─────────────────────────────────────────── */

export function generateStaticParams() {
  return [
    "williamsburg",
    "greenpoint",
    "park-slope",
    "dumbo",
    "crown-heights",
    "cobble-hill",
    "bushwick",
    "red-hook",
    "les",
    "chinatown",
    "nolita",
    "greenwich-village",
    "soho",
    "tribeca",
    "astoria",
    "long-island-city",
    "ridgewood",
  ].map((slug) => ({ slug }));
}

/* ── Metadata ──────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hood = getHood(slug);
  return {
    title: `${hood.name}, ${hood.borough} | Push`,
    description: `${hood.creators} creators. ${hood.campaigns} active campaigns. ${hood.verifiedVisits.toLocaleString()} verified visits in ${hood.name}. Pay only when the visit is real.`,
  };
}

/* ── Page ──────────────────────────────────────────────────── */

export default async function NeighborhoodSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hood = getHood(slug);

  return (
    <main style={{ background: "var(--surface)", minHeight: "100vh" }}>
      {/* ═══ 01 — HERO (dark) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "clamp(96px,12vw,160px) clamp(24px,6vw,96px)",
        }}
        aria-labelledby="nhd-hero-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%" }}>
          {/* eyebrow row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              className="eyebrow"
              style={{
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "6px 16px",
              }}
            >
              (NYC · {hood.name.toUpperCase()})
            </span>
            {/* RIGHT badge */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px,5vw,72px)",
                  fontWeight: 900,
                  color: "var(--snow)",
                  lineHeight: 0.9,
                }}
              >
                {hood.creators}
              </div>
              <div
                className="eyebrow"
                style={{ color: "rgba(255,255,255,0.45)", marginTop: 8 }}
              >
                CREATORS · {hood.campaigns} CAMPAIGNS
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <Link
                href="/"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  textDecoration: "none",
                }}
              >
                Push
              </Link>
              {" / "}
              <Link
                href="/neighborhoods"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  textDecoration: "none",
                }}
              >
                Neighborhoods
              </Link>
              {" / "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                {hood.name}
              </span>
            </span>
          </nav>

          {/* H1 Darky — bottom-left anchored */}
          <h1
            id="nhd-hero-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px,7vw,120px)",
              fontWeight: 900,
              color: "var(--snow)",
              lineHeight: 0.92,
              margin: "0 0 48px",
            }}
          >
            {hood.name}.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 560,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {hood.borough} · {hood.verifiedVisits.toLocaleString()} verified
            visits · average creator earnings {hood.avgEarnings}/month. Pay only
            when the visit is real.
          </p>
        </div>
      </section>

      {/* ═══ 02 — STATS ROW ═══ */}
      <section
        style={{
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--hairline)",
          padding: "0 clamp(24px,6vw,96px)",
        }}
        aria-label="Neighborhood stats"
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 0,
          }}
        >
          {[
            { value: hood.creators.toString(), label: "Active Creators" },
            { value: hood.campaigns.toString(), label: "Campaigns" },
            {
              value: hood.verifiedVisits.toLocaleString(),
              label: "Verified Visits",
            },
            { value: hood.avgEarnings, label: "Avg. Creator Earnings" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "40px 0",
                borderRight: i < 3 ? "1px solid var(--hairline)" : "none",
                paddingRight: i < 3 ? 32 : 0,
                paddingLeft: i > 0 ? 32 : 0,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px,4vw,56px)",
                  fontWeight: 900,
                  color: "var(--ink)",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div className="eyebrow" style={{ color: "var(--ink-4)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 03 — FEATURED CAMPAIGNS (candy-panel) ═══ */}
      <section
        className="candy-panel"
        style={{
          background: "var(--panel-butter)",
          padding: "clamp(80px,10vw,128px) clamp(24px,6vw,96px)",
          borderBottom: "1px solid var(--hairline)",
        }}
        aria-labelledby="nhd-campaigns-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            className="eyebrow"
            style={{
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (FEATURED CAMPAIGNS)
          </span>
          <h2
            id="nhd-campaigns-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px,5.5vw,72px)",
              fontWeight: 900,
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: "0 0 64px",
            }}
          >
            Active in {hood.name}.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 24,
            }}
          >
            {hood.campaigns_list.map((campaign) => (
              <div
                key={campaign.merchant}
                className="click-shift"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <span className="eyebrow" style={{ color: "var(--ink-4)" }}>
                  {campaign.type}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "var(--ink)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {campaign.merchant}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                    paddingTop: 16,
                    borderTop: "1px solid var(--hairline)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--brand-red)",
                    }}
                  >
                    {campaign.payout}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--accent-blue)",
                      fontWeight: 600,
                    }}
                  >
                    Claim campaign →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 — TOP CREATORS (dark ink) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "clamp(80px,10vw,128px) clamp(24px,6vw,96px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        aria-labelledby="nhd-creators-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.35)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (TOP CREATORS)
          </span>
          <h2
            id="nhd-creators-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px,5.5vw,72px)",
              fontWeight: 900,
              color: "var(--snow)",
              lineHeight: 1.05,
              margin: "0 0 64px",
            }}
          >
            Running {hood.name} this month.
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {hood.top_creators.map((creator, i) => (
              <div
                key={creator.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 48px 1fr auto",
                  gap: "0 24px",
                  padding: "24px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  alignItems: "center",
                }}
              >
                {/* rank */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      i === 0 ? "var(--brand-red)" : "rgba(255,255,255,0.2)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* avatar */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--snow)",
                  }}
                >
                  {creator.initials}
                </div>
                {/* name + category */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--snow)",
                      marginBottom: 4,
                    }}
                  >
                    {creator.name}
                  </div>
                  <span
                    className="eyebrow"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {creator.category}
                  </span>
                </div>
                {/* visits */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "var(--snow)",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {creator.visits}
                  </div>
                  <span
                    className="eyebrow"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    visits this month
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 05 — NEARBY NEIGHBORHOODS ═══ */}
      {hood.nearby.length > 0 && (
        <section
          style={{
            background: "var(--surface-2)",
            padding: "clamp(80px,10vw,128px) clamp(24px,6vw,96px)",
            borderBottom: "1px solid var(--hairline)",
          }}
          aria-labelledby="nhd-nearby-heading"
        >
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <span
              className="eyebrow"
              style={{
                color: "var(--ink-4)",
                display: "block",
                marginBottom: 16,
              }}
            >
              (NEARBY)
            </span>
            <h2
              id="nhd-nearby-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px,4vw,56px)",
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1.05,
                margin: "0 0 48px",
              }}
            >
              Next block over.
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
              }}
            >
              {hood.nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/neighborhoods/${n.slug}`}
                  className="click-shift"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 10,
                    padding: "32px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span className="eyebrow" style={{ color: "var(--ink-4)" }}>
                    {n.borough}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "var(--ink)",
                      lineHeight: 1.2,
                    }}
                  >
                    {n.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--brand-red)",
                      fontWeight: 600,
                      marginTop: 8,
                    }}
                  >
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 06 — TICKET CTA ═══ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "clamp(80px,10vw,128px) clamp(24px,6vw,96px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            className="ticket-panel"
            style={{
              background: "var(--ga-orange)",
              borderRadius: 10,
              padding: "clamp(48px,6vw,80px) clamp(32px,4vw,64px)",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {/* grommet circles */}
            {[
              { top: "50%", left: 24, transform: "translateY(-50%)" },
              { top: "50%", right: 24, transform: "translateY(-50%)" },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--ink)",
                  ...pos,
                }}
              />
            ))}
            {/* perforation lines */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 48,
                right: 48,
                height: 0,
                borderTop: "2px dashed rgba(0,0,0,0.15)",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 48,
                right: 48,
                height: 0,
                borderBottom: "2px dashed rgba(0,0,0,0.15)",
              }}
            />

            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontSize: "clamp(40px,5vw,56px)",
                color: "var(--snow)",
                margin: "0 0 32px",
                lineHeight: 1.1,
              }}
            >
              Claim your spot in {hood.name}.
            </h2>
            <Link href="/creator/signup" className="btn-ink click-shift">
              Apply to the roster
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
