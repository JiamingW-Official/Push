// Module-level singletons shared across API routes in the same Lambda instance.
// Demo-only: in-memory, no persistence. Good enough for a 15-minute live demo.

export interface RedemptionEntry {
  token: string;
  code: string;
  merchantName: string;
  offer: string;
  creatorHandle: string;
  reward: string;
  redeemedAt: string;
}

// token → latest RedemptionEntry (overwrites on re-scan)
export const redeemedTokens = new Map<string, RedemptionEntry>();
export const redemptionLog: RedemptionEntry[] = [];
