import { postJson } from "./types";

export type CashoutResult = {
  cashoutId: string;
  amount: number;
  method: "stripe_connect" | "venmo";
  status: "processing" | "paid";
  expectedAt: string;
};

/**
 * Initiate a payout from the cleared balance to the creator's chosen
 * destination. Routes to the existing /api/creator/cashout endpoint.
 *
 * Server-side guards (already in place):
 *   - amount ≥ MIN_CASHOUT
 *   - amount ≤ balances.cleared
 *   - method has a connected payment record
 */
export function cashout(input: {
  amount: number;
  method: "stripe_connect" | "venmo";
}) {
  return postJson<CashoutResult>("/api/creator/cashout", input);
}
