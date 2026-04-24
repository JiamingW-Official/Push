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
    <div className="overview-shell">
      <header className="overview-titlebar">
        <div className="overview-titlebar__inner">
          <h1 className="overview-title">Your Dashboard</h1>
          <p className="overview-welcome">
            Welcome back,{" "}
            <span className="overview-welcome__name">{CREATOR_NAME}</span>
          </p>
        </div>
      </header>

      <main className="overview-main">
        <section className="overview-kpi-grid" aria-label="Key metrics">
          <MetricsCard
            label="Weekly Referrals"
            value={24}
            color="var(--primary)"
          />
          <MetricsCard
            label="Weekly Earnings"
            value="$180.00"
            color="var(--dark)"
          />
          <MetricsCard
            label="Performance Score"
            value="0.92"
            color="var(--tertiary)"
          />
        </section>

        <section className="overview-section" aria-label="Referral details">
          <div className="overview-section__header">
            <h2 className="overview-section__title">Referral Details</h2>
            <span className="overview-section__meta">
              {referrals.length} rows · mock data
            </span>
          </div>
          <ReferralTable data={referrals} />
        </section>

        <section className="overview-section" aria-label="Weekly leaderboard">
          <div className="overview-section__header">
            <h2 className="overview-section__title">Leaderboard — This Week</h2>
            <span className="overview-section__meta">
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
