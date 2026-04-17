import { NextResponse } from "next/server";
import {
  MOCK_CREATOR_TRANSACTIONS,
  type Transaction,
} from "@/lib/payments/mock-transactions";
import { aggregateBalances } from "@/lib/payments/calculate";

// TODO: wire to Stripe + Supabase
// GET /api/creator/earnings — returns earnings summary and transaction history

export async function GET() {
  // TODO: authenticate via Supabase session
  // const supabase = createServerClient(...)
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  function inRange(tx: Transaction, from: Date, to: Date): boolean {
    const d = new Date(tx.date);
    return d >= from && d <= to;
  }

  const thisMonthTxns = MOCK_CREATOR_TRANSACTIONS.filter((tx) =>
    inRange(tx, thisMonthStart, now),
  );
  const lastMonthTxns = MOCK_CREATOR_TRANSACTIONS.filter((tx) =>
    inRange(tx, lastMonthStart, lastMonthEnd),
  );
  const pendingTxns = MOCK_CREATOR_TRANSACTIONS.filter(
    (tx) => tx.status === "pending",
  );

  const thisMonthEarned = thisMonthTxns.reduce(
    (s, tx) => s + (tx.status === "paid" ? tx.netAmount : 0),
    0,
  );
  const lastMonthEarned = lastMonthTxns.reduce(
    (s, tx) => s + (tx.status === "paid" ? tx.netAmount : 0),
    0,
  );
  const pendingTotal = pendingTxns.reduce((s, tx) => s + tx.netAmount, 0);

  const balances = aggregateBalances(MOCK_CREATOR_TRANSACTIONS);

  // Active campaign milestones
  const activeMilestones = [
    {
      campaignId: "camp-003",
      campaign: "LA Botanica Aesthetic Shoot",
      merchant: "Flamingo Estate",
      totalPayout: 75,
      milestones: [
        { key: "scan", label: "Scan", done: true },
        { key: "verify", label: "Verify", done: true },
        { key: "content_posted", label: "Content Posted", done: false },
        { key: "paid", label: "Paid", done: false },
      ],
      currentMilestone: "content_posted",
    },
    {
      campaignId: "camp-004",
      campaign: "Brow Transformation Story",
      merchant: "Brow Theory",
      totalPayout: 50,
      milestones: [
        { key: "scan", label: "Scan", done: true },
        { key: "verify", label: "Verify", done: false },
        { key: "content_posted", label: "Content Posted", done: false },
        { key: "paid", label: "Paid", done: false },
      ],
      currentMilestone: "verify",
    },
  ];

  return NextResponse.json({
    summary: {
      thisMonthEarned: parseFloat(thisMonthEarned.toFixed(2)),
      lastMonthEarned: parseFloat(lastMonthEarned.toFixed(2)),
      delta: parseFloat((thisMonthEarned - lastMonthEarned).toFixed(2)),
      pendingNext: parseFloat(pendingTotal.toFixed(2)),
    },
    balances,
    activeMilestones,
    transactions: MOCK_CREATOR_TRANSACTIONS.slice(0, 30),
  });
}
