/**
 * Mock invite data for development.
 * Production: fetch from /api/referrals/validate/[code]
 */

export type InviterTag = "creator" | "merchant";

export interface MockInvite {
  code: string;
  inviterName: string;
  inviterHandle: string;
  inviterAvatar: string; // initials fallback if no image
  inviterTier: string;
  inviterNeighborhood: string;
  tag: InviterTag;
  bonusLabel: string;
  bonusDetail: string;
  expiresInDays: number;
}

const MOCK_INVITES: Record<string, MockInvite> = {
  MAYA25: {
    code: "MAYA25",
    inviterName: "Maya Chen",
    inviterHandle: "@maya.eats.nyc",
    inviterAvatar: "MC",
    inviterTier: "Gold Creator",
    inviterNeighborhood: "Williamsburg",
    tag: "creator",
    bonusLabel: "$25 launch bonus",
    bonusDetail:
      "Credited to your Push wallet after your first verified campaign check-in.",
    expiresInDays: 14,
  },
  BIZ50: {
    code: "BIZ50",
    inviterName: "Jordan Park",
    inviterHandle: "@jordanpark.biz",
    inviterAvatar: "JP",
    inviterTier: "Partner Merchant",
    inviterNeighborhood: "SoHo",
    tag: "merchant",
    bonusLabel: "20% off your first month",
    bonusDetail:
      "Discount applied automatically when you subscribe to any Push plan.",
    expiresInDays: 30,
  },
  BKLYN10: {
    code: "BKLYN10",
    inviterName: "Alex Rivera",
    inviterHandle: "@bklyn.alexr",
    inviterAvatar: "AR",
    inviterTier: "Silver Creator",
    inviterNeighborhood: "Park Slope",
    tag: "creator",
    bonusLabel: "$25 launch bonus",
    bonusDetail:
      "Credited to your Push wallet after your first verified campaign check-in.",
    expiresInDays: 7,
  },
};

/**
 * Resolve invite code to inviter data.
 * Falls back to default Maya Chen if code is unknown.
 */
export function resolveInvite(code: string): MockInvite {
  const normalized = code.toUpperCase();
  return (
    MOCK_INVITES[normalized] ?? {
      code: normalized,
      inviterName: "Maya Chen",
      inviterHandle: "@maya.eats.nyc",
      inviterAvatar: "MC",
      inviterTier: "Gold Creator",
      inviterNeighborhood: "Williamsburg",
      tag: "creator",
      bonusLabel: "$25 launch bonus",
      bonusDetail:
        "Credited to your Push wallet after your first verified campaign check-in.",
      expiresInDays: 14,
    }
  );
}
