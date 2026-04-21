/**
 * Push Admin — Finance Ledger API
 * GET /api/admin/finance/ledger
 *
 * Query params:
 *   page          number  (default 1)
 *   pageSize      number  (default 50, max 100)
 *   type          TransactionType  (optional)
 *   status        TransactionStatus (optional)
 *   from          ISO date string  (optional)
 *   to            ISO date string  (optional)
 *   amountMin     number  (optional)
 *   amountMax     number  (optional)
 *   search        string  (optional — matches counterparty / stripe_ref)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_LEDGER,
  computeMTD,
  computeMonthlyPnL,
  type TransactionType,
  type TransactionStatus,
} from "@/lib/admin/mock-ledger";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // ── Parse query params ───────────────────────────────────────────────────────
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50", 10)),
  );

  const typeFilter = searchParams.get("type") as TransactionType | null;
  const statusFilter = searchParams.get("status") as TransactionStatus | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const amountMin = searchParams.get("amountMin")
    ? parseFloat(searchParams.get("amountMin")!)
    : null;
  const amountMax = searchParams.get("amountMax")
    ? parseFloat(searchParams.get("amountMax")!)
    : null;
  const search = searchParams.get("search")?.toLowerCase() ?? null;

  // ── Filter ───────────────────────────────────────────────────────────────────
  let filtered = MOCK_LEDGER;

  if (typeFilter) {
    filtered = filtered.filter((e) => e.type === typeFilter);
  }

  if (statusFilter) {
    filtered = filtered.filter((e) => e.status === statusFilter);
  }

  if (from) {
    const fromDate = new Date(from);
    filtered = filtered.filter((e) => new Date(e.timestamp) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((e) => new Date(e.timestamp) <= toDate);
  }

  if (amountMin !== null) {
    filtered = filtered.filter((e) => Math.abs(e.amount) >= amountMin);
  }

  if (amountMax !== null) {
    filtered = filtered.filter((e) => Math.abs(e.amount) <= amountMax);
  }

  if (search) {
    filtered = filtered.filter(
      (e) =>
        e.counterparty.toLowerCase().includes(search) ||
        e.stripe_ref.toLowerCase().includes(search) ||
        (e.note ?? "").toLowerCase().includes(search),
    );
  }

  // ── Paginate ─────────────────────────────────────────────────────────────────
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const data = filtered.slice(offset, offset + pageSize);

  // ── Aggregates (always computed on full unfiltered set) ──────────────────────
  const mtd = computeMTD(MOCK_LEDGER);
  const monthlyPnL = computeMonthlyPnL(MOCK_LEDGER);

  // ── Stripe balance stub ──────────────────────────────────────────────────────
  const stripeBalance = {
    available: 8_412.5,
    pending: 2_140.0,
    reserved: 500.0,
    currency: "usd",
  };

  // ── Reconciliation stub ──────────────────────────────────────────────────────
  const reconciliation = {
    expectedBalance: 10_952.5,
    actualBankBalance: 10_897.33,
    discrepancy: -55.17,
    lastReconciled: "2026-04-16T18:00:00.000Z",
    status: "minor_discrepancy" as const,
  };

  // ── Next payout batch ────────────────────────────────────────────────────────
  const nextPayout = {
    scheduledAt: "2026-04-20T10:00:00.000Z",
    creatorCount: 8,
    estimatedTotal: 615,
  };

  return NextResponse.json({
    data,
    pagination: { page, pageSize, total, totalPages },
    meta: {
      mtd,
      monthlyPnL,
      stripeBalance,
      reconciliation,
      nextPayout,
    },
  });
}
