/**
 * Push API Client — mock stubs for client-side usage
 * Replace fetch calls with real endpoints as they are wired to Supabase + Stripe.
 */

import {
  MOCK_PAYOUT_METHODS,
  MOCK_WITHDRAWALS,
  MOCK_TAX_SUMMARY,
  MOCK_WALLET_BALANCE,
  type PayoutMethod,
  type Withdrawal,
  type TaxSummary,
  type WalletBalance,
} from "@/lib/wallet/mock-wallet";

// ── Creator mock namespace ─────────────────────────────────

export const creatorMock = {
  wallet: {
    /** Fetch current wallet balance */
    getBalance(): Promise<WalletBalance> {
      return Promise.resolve({ ...MOCK_WALLET_BALANCE });
    },

    /** Fetch all payout methods */
    getPayoutMethods(): Promise<PayoutMethod[]> {
      return Promise.resolve([...MOCK_PAYOUT_METHODS]);
    },

    /**
     * Add a new payout method
     * TODO: wire to POST /api/creator/payout-methods
     */
    addPayoutMethod(
      method: Omit<PayoutMethod, "id" | "addedAt">,
    ): Promise<PayoutMethod> {
      const created: PayoutMethod = {
        ...method,
        id: `pm-${Date.now()}`,
        addedAt: new Date().toISOString().split("T")[0],
      };
      return Promise.resolve(created);
    },

    /**
     * Update a payout method (e.g. set as default)
     * TODO: wire to PATCH /api/creator/payout-methods/[id]
     */
    updatePayoutMethod(
      id: string,
      patch: Partial<PayoutMethod>,
    ): Promise<PayoutMethod> {
      const method = MOCK_PAYOUT_METHODS.find((m) => m.id === id);
      if (!method) return Promise.reject(new Error("Method not found"));
      return Promise.resolve({ ...method, ...patch });
    },

    /**
     * Delete a payout method
     * TODO: wire to DELETE /api/creator/payout-methods/[id]
     */
    deletePayoutMethod(id: string): Promise<{ deleted: boolean }> {
      return Promise.resolve({ deleted: true });
    },

    /**
     * Fetch withdrawal history with optional filters
     * TODO: wire to GET /api/creator/withdrawals
     */
    getWithdrawals(filters?: {
      status?: string;
      method?: string;
      year?: string;
    }): Promise<Withdrawal[]> {
      let results = [...MOCK_WITHDRAWALS];
      if (filters?.status)
        results = results.filter((w) => w.status === filters.status);
      if (filters?.method)
        results = results.filter((w) => w.methodType === filters.method);
      if (filters?.year)
        results = results.filter((w) => w.date.startsWith(filters.year!));
      return Promise.resolve(results);
    },

    /**
     * Initiate a withdrawal
     * TODO: wire to POST /api/creator/withdrawals + Stripe Connect payout
     */
    initiateWithdrawal(amount: number, methodId: string): Promise<Withdrawal> {
      const method = MOCK_PAYOUT_METHODS.find((m) => m.id === methodId);
      const feeRate = method?.feeRate ?? 0;
      const flatFee =
        method?.type === "bank" ? 1.5 : method?.type === "paypal" ? 0.25 : 0;
      const fee = parseFloat((amount * feeRate + flatFee).toFixed(2));
      const withdrawal: Withdrawal = {
        id: `wd-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        methodId,
        methodType: method?.type ?? "bank",
        methodDetail: method?.detail ?? "—",
        amount,
        fee,
        net: parseFloat((amount - fee).toFixed(2)),
        status: "processing",
      };
      return Promise.resolve(withdrawal);
    },

    /**
     * Fetch tax summary for the current year
     * TODO: wire to GET /api/creator/tax
     */
    getTaxSummary(): Promise<TaxSummary> {
      return Promise.resolve({ ...MOCK_TAX_SUMMARY });
    },
  },
};
