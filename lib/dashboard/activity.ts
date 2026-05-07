// Merchant dashboard activity feed builder.
// Pulls events from the existing mock data files (applications, payments,
// disputes) and the campaigns currently rendered in the dashboard. Output
// is sorted desc by timestamp; the consumer (RecentActivity) trims the
// list to its visible cap.

import type {
  Application,
  Campaign,
} from "@/app/(merchant)/merchant/dashboard/types";
import type { ActivityEvent } from "@/components/dashboard/RecentActivity";
import { MOCK_APPLICATIONS } from "@/lib/data/mock-applications";
import { MOCK_MERCHANT_PAYMENTS_HISTORY } from "@/lib/data/mock-payments";
import { MOCK_DISPUTES } from "@/lib/disputes/mock-disputes";

interface BuildArgs {
  applications: Application[];
  campaigns: Campaign[];
}

const NEIGHBORHOODS = [
  "Bed-Stuy",
  "Williamsburg",
  "SoHo",
  "Park Slope",
  "Greenpoint",
  "LES",
];

function pickNeighborhood(seed: string): string {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return NEIGHBORHOODS[sum % NEIGHBORHOODS.length];
}

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(cents) / 100);
}

export function buildMerchantActivity({
  applications,
  campaigns,
}: BuildArgs): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  // ── applicant.applied — top 4 most-recent applications passed in ──────
  const appliedSorted = [...applications]
    .filter((a) => a.applied_at)
    .sort(
      (a, b) =>
        new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
    )
    .slice(0, 4);
  for (const app of appliedSorted) {
    events.push({
      id: `applied-${app.id}`,
      type: "applicant.applied",
      timestamp: app.applied_at,
      title: `${app.creator_name} applied to ${app.campaign_title}`,
      meta: app.creator_handle ? `@${app.creator_handle}` : undefined,
      href: `/merchant/applicants/?focus=${encodeURIComponent(app.id)}`,
    });
  }

  // ── redemption.verified — accepted-status mocks become verified scans ─
  // Read from MOCK_APPLICATIONS so we get coverage even when the dashboard
  // payload is empty. Cap at 3 to keep the feed balanced.
  const verifiedSeed = MOCK_APPLICATIONS.filter(
    (a) => a.status === "accepted",
  ).slice(0, 3);
  verifiedSeed.forEach((app, i) => {
    const cents = 800 + ((i * 700) % 2400);
    events.push({
      id: `verified-${app.id}`,
      type: "redemption.verified",
      timestamp: new Date(Date.now() - (i + 1) * 45 * 60_000).toISOString(),
      title: `QR scan verified · ${pickNeighborhood(app.id)} · ${formatUsd(cents)} cashback`,
      meta: app.campaignName,
      href: "/merchant/redeem",
    });
  });

  // ── campaign.launched — campaigns whose status moved to active ────────
  const launchedSorted = [...campaigns]
    .filter((c) => c.status === "active" && c.created_at)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 2);
  for (const campaign of launchedSorted) {
    events.push({
      id: `launched-${campaign.id}`,
      type: "campaign.launched",
      timestamp: campaign.created_at,
      title: `${campaign.title} went live`,
      meta:
        campaign.spots_total > 0
          ? `${campaign.spots_total} creator spots`
          : undefined,
      href: `/merchant/campaigns/${campaign.id}`,
    });
  }

  // ── dispute.opened — pull from the disputes mock ──────────────────────
  const recentDisputes = [...MOCK_DISPUTES]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 2);
  for (const dispute of recentDisputes) {
    events.push({
      id: `dispute-${dispute.id}`,
      type: "dispute.opened",
      timestamp: dispute.createdAt,
      title: `Disputed redemption from ${pickNeighborhood(dispute.id)}`,
      meta: `${dispute.campaignTitle} · ${formatUsd(dispute.amount * 100)}`,
      href: `/merchant/disputes/${dispute.id}`,
    });
  }

  // ── payment.toppedup — top-up rows from the merchant payments mock ────
  const topUps = MOCK_MERCHANT_PAYMENTS_HISTORY.filter(
    (p) => p.milestone_id === "topup",
  ).slice(0, 2);
  for (const payment of topUps) {
    events.push({
      id: `topup-${payment.id}`,
      type: "payment.toppedup",
      timestamp: payment.paid_at ?? payment.created_at,
      title: `${formatUsd(payment.amount)} wallet top-up`,
      meta: payment.description,
      href: "/merchant/billing",
    });
  }

  events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return events;
}
