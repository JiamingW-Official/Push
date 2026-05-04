import MetricsCard from "@/components/creator/MetricsCard";
import ReferralTable, {
  type ReferralRow,
} from "@/components/creator/ReferralTable";
import LeaderboardTable, {
  type LeaderboardRow,
} from "@/components/creator/LeaderboardTable";
import "./overview.css";

// ---------------------------------------------------------------------------
// Mock data — Session 3-5 ships with static seed data. A later session can
// wire these arrays to a creator-scoped endpoint (e.g. /api/creator/kpi).
// ---------------------------------------------------------------------------

const CREATOR_NAME = "Lucy";

const referrals: ReferralRow[] = [
  {
    date: "2026-04-18T14:30:00Z",
    merchant_name: "Coffee Plus Downtown",
    customer_name: "John Doe",
    status: "verified",
    commission: 6.25,
  },
  {
    date: "2026-04-17T11:15:00Z",
    merchant_name: "Bagel Bakery Williamsburg",
    customer_name: "Sarah Smith",
    status: "pending",
    commission: 6.25,
  },
  {
    date: "2026-04-16T09:45:00Z",
    merchant_name: "Pasta Kitchen East",
    customer_name: "Michael Brown",
    status: "verified",
    commission: 6.25,
  },
  {
    date: "2026-04-15T16:20:00Z",
    merchant_name: "Coffee Plus Downtown",
    customer_name: "Emma Wilson",
    status: "rejected",
    commission: 0,
  },
  {
    date: "2026-04-14T13:00:00Z",
    merchant_name: "Pizza House",
    customer_name: "David Lee",
    status: "verified",
    commission: 6.25,
  },
  {
    date: "2026-04-13T18:05:00Z",
    merchant_name: "Sweet Leaf Matcha Bar",
    customer_name: "Sofia Garcia",
    status: "verified",
    commission: 6.25,
  },
  {
    date: "2026-04-12T10:30:00Z",
    merchant_name: "Bodega Tacos El Barrio",
    customer_name: "James Rivera",
    status: "pending",
    commission: 6.25,
  },
  {
    date: "2026-04-11T20:15:00Z",
    merchant_name: "Glow Studio Nail Lounge",
    customer_name: "Aisha Patel",
    status: "verified",
    commission: 6.25,
  },
  {
    date: "2026-04-10T12:45:00Z",
    merchant_name: "Pasta Kitchen East",
    customer_name: "Benjamin Cohen",
    status: "rejected",
    commission: 0,
  },
  {
    date: "2026-04-09T17:30:00Z",
    merchant_name: "Coffee Plus Downtown",
    customer_name: "Zoe Martinez",
    status: "verified",
    commission: 6.25,
  },
];

const leaderboard: LeaderboardRow[] = [
  {
    rank: 1,
    creator_name: "Alex",
    weekly_referrals: 42,
    weekly_earnings: 262.5,
  },
  {
    rank: 2,
    creator_name: "Lucy",
    weekly_referrals: 24,
    weekly_earnings: 150.0,
  },
  {
    rank: 3,
    creator_name: "Marcus",
    weekly_referrals: 19,
    weekly_earnings: 118.75,
  },
  {
    rank: 4,
    creator_name: "Jessica",
    weekly_referrals: 16,
    weekly_earnings: 100.0,
  },
  {
    rank: 5,
    creator_name: "Daniel",
    weekly_referrals: 14,
    weekly_earnings: 87.5,
  },
  {
    rank: 6,
    creator_name: "Emma",
    weekly_referrals: 12,
    weekly_earnings: 75.0,
  },
  {
    rank: 7,
    creator_name: "James",
    weekly_referrals: 11,
    weekly_earnings: 68.75,
  },
  {
    rank: 8,
    creator_name: "Sophie",
    weekly_referrals: 9,
    weekly_earnings: 56.25,
  },
  {
    rank: 9,
    creator_name: "Chris",
    weekly_referrals: 8,
    weekly_earnings: 50.0,
  },
  {
    rank: 10,
    creator_name: "Olivia",
    weekly_referrals: 7,
    weekly_earnings: 43.75,
  },
];

export default function CreatorOverviewPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface-2)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Page header — dark editorial */}
      <header
        style={{
          padding: "40px 40px 32px",
          background: "var(--char)",
          borderBottom: "2px solid var(--ink)",
          marginBottom: 0,
        }}
      >
        <p
          className="eyebrow"
          style={{
            color: "rgba(255,255,255,0.38)",
            marginBottom: 8,
            letterSpacing: "0.10em",
          }}
        >
          OVERVIEW
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(40px,5vw,72px)",
            color: "var(--snow)",
            margin: 0,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Welcome back, {CREATOR_NAME}.
        </h1>
      </header>

      <main
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "0 32px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* KPI row */}
        <section aria-label="Key metrics">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "24px",
              }}
            >
              <p
                className="eyebrow"
                style={{ color: "var(--ink-4)", marginBottom: 8 }}
              >
                WEEKLY REFERRALS
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(32px,4vw,56px)",
                  color: "var(--ink)",
                  margin: 0,
                  letterSpacing: "-0.04em",
                }}
              >
                24
              </p>
            </div>

            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "24px",
              }}
            >
              <p
                className="eyebrow"
                style={{ color: "var(--ink-4)", marginBottom: 8 }}
              >
                WEEKLY EARNINGS
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(32px,4vw,56px)",
                  color: "var(--ink)",
                  margin: 0,
                  letterSpacing: "-0.04em",
                }}
              >
                $180
              </p>
            </div>

            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "24px",
              }}
            >
              <p
                className="eyebrow"
                style={{ color: "var(--ink-4)", marginBottom: 8 }}
              >
                PERFORMANCE SCORE
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(32px,4vw,56px)",
                  color: "var(--ink)",
                  margin: 0,
                  letterSpacing: "-0.04em",
                }}
              >
                0.92
              </p>
            </div>
          </div>
        </section>

        {/* Referral details */}
        <section
          aria-label="Referral details"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--ink-4)", marginBottom: 4 }}
              >
                REFERRAL DETAILS
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                Recent Activity
              </h2>
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
              }}
            >
              {referrals.length} rows
            </span>
          </div>
          <ReferralTable data={referrals} />
        </section>

        {/* Leaderboard */}
        <section
          aria-label="Weekly leaderboard"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--ink-4)", marginBottom: 4 }}
              >
                LEADERBOARD
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                This Week
              </h2>
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
              }}
            >
              top {leaderboard.length}
            </span>
          </div>
          <LeaderboardTable
            data={leaderboard}
            currentCreatorName={CREATOR_NAME}
          />
        </section>
      </main>
    </div>
  );
}
