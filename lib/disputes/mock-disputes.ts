// Push — Mock Dispute Data
// 15 disputes covering all states and roles

import type { Dispute } from "./types";

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "D-2026-001",
    campaignId: "demo-campaign-001",
    campaignTitle: "Croissant Review — Weekend Special",
    merchantName: "Le Bec Fin Bakery",
    creatorName: "Alex Rivera",
    filedBy: "Alex Rivera",
    filedByRole: "creator",
    otherPartyName: "Le Bec Fin Bakery",
    otherPartyRole: "merchant",
    reason: "missing_payment",
    description:
      "I completed the campaign on April 2nd, submitted proof of visit and posted the content as required. The payment of $20 was never released. Campaign shows 'verified' on my end but payout is still pending after 12 days.",
    amount: 20,
    expectedOutcome: "Full $20 refund to creator wallet",
    status: "resolved",
    events: [
      {
        id: "evt-001-1",
        disputeId: "D-2026-001",
        type: "filed",
        authorRole: "creator",
        authorName: "Alex Rivera",
        message:
          "I completed the campaign on April 2nd, submitted proof of visit and posted the content as required. The payment of $20 was never released. Campaign shows 'verified' on my end but payout is still pending after 12 days.",
        createdAt: "2026-04-05T10:00:00Z",
      },
      {
        id: "evt-001-2",
        disputeId: "D-2026-001",
        type: "merchant_response",
        authorRole: "merchant",
        authorName: "Le Bec Fin Bakery",
        message:
          "We reviewed the submission. The QR scan was registered but our system shows the content was removed within 24 hours. Per campaign terms, content must remain live for 7 days.",
        createdAt: "2026-04-06T14:30:00Z",
      },
      {
        id: "evt-001-3",
        disputeId: "D-2026-001",
        type: "admin_message",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "We have reviewed both sides. Please provide a screenshot showing the content was live as of April 9th.",
        createdAt: "2026-04-07T09:00:00Z",
      },
      {
        id: "evt-001-4",
        disputeId: "D-2026-001",
        type: "creator_response",
        authorRole: "creator",
        authorName: "Alex Rivera",
        message:
          "Attaching screenshot from April 9th showing the post is still live.",
        evidence: [
          {
            id: "ev-001-1",
            disputeId: "D-2026-001",
            uploadedBy: "creator",
            type: "image",
            url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
            label: "Instagram post screenshot April 9",
            uploadedAt: "2026-04-07T11:45:00Z",
          },
        ],
        createdAt: "2026-04-07T11:45:00Z",
      },
      {
        id: "evt-001-5",
        disputeId: "D-2026-001",
        type: "admin_decision",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Based on the evidence provided, the content was live for the required 7-day period. We are releasing the $20 payment to Alex Rivera. This dispute is now resolved.",
        createdAt: "2026-04-08T10:00:00Z",
      },
    ],
    evidence: [
      {
        id: "ev-001-1",
        disputeId: "D-2026-001",
        uploadedBy: "creator",
        type: "image",
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
        label: "Instagram post screenshot April 9",
        uploadedAt: "2026-04-07T11:45:00Z",
      },
    ],
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-04-08T10:00:00Z",
    resolvedAt: "2026-04-08T10:00:00Z",
    outcome: "refund_creator",
    outcomeNote: "$20 released to creator wallet",
    relatedPaymentId: "demo-payout-001",
  },
  {
    id: "D-2026-002",
    campaignId: "demo-campaign-002",
    campaignTitle: "Matcha Review + Ambiance Video",
    merchantName: "Cha Cha Matcha",
    creatorName: "Alex Rivera",
    filedBy: "Alex Rivera",
    filedByRole: "creator",
    otherPartyName: "Cha Cha Matcha",
    otherPartyRole: "merchant",
    reason: "incorrect_amount",
    description:
      "The campaign listed a $25 base payout plus $5 bonus for video content. I submitted both photo and video proof. Only received $25, the $5 video bonus was not included.",
    amount: 5,
    expectedOutcome: "Additional $5 video bonus payment",
    status: "under_review",
    events: [
      {
        id: "evt-002-1",
        disputeId: "D-2026-002",
        type: "filed",
        authorRole: "creator",
        authorName: "Alex Rivera",
        message:
          "The campaign listed a $25 base payout plus $5 bonus for video content. I submitted both photo and video proof. Only received $25, the $5 video bonus was not included.",
        createdAt: "2026-04-09T15:00:00Z",
      },
      {
        id: "evt-002-2",
        disputeId: "D-2026-002",
        type: "status_change",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Dispute is now under review. We will respond within 48 hours.",
        createdAt: "2026-04-10T09:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-04-09T15:00:00Z",
    updatedAt: "2026-04-10T09:00:00Z",
    relatedPaymentId: "demo-payout-002",
  },
  {
    id: "D-2026-003",
    campaignId: "demo-campaign-003",
    campaignTitle: "Instagram Stories — Grand Opening",
    merchantName: "Flamingo Estate NYC",
    creatorName: "Alex Rivera",
    filedBy: "Flamingo Estate NYC",
    filedByRole: "merchant",
    otherPartyName: "Alex Rivera",
    otherPartyRole: "creator",
    reason: "content_violation",
    description:
      "The creator posted content that included a competitor brand in the background. Campaign guidelines explicitly prohibited this. The content was not revised after two requests.",
    amount: 75,
    expectedOutcome: "Withhold payment pending content revision or dismissal",
    status: "awaiting_response",
    events: [
      {
        id: "evt-003-1",
        disputeId: "D-2026-003",
        type: "filed",
        authorRole: "merchant",
        authorName: "Flamingo Estate NYC",
        message:
          "The creator posted content that included a competitor brand in the background. Campaign guidelines explicitly prohibited this. The content was not revised after two requests.",
        evidence: [
          {
            id: "ev-003-1",
            disputeId: "D-2026-003",
            uploadedBy: "merchant",
            type: "image",
            url: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=600",
            label: "Screenshot showing competitor branding",
            uploadedAt: "2026-04-10T16:00:00Z",
          },
        ],
        createdAt: "2026-04-10T16:00:00Z",
      },
      {
        id: "evt-003-2",
        disputeId: "D-2026-003",
        type: "admin_message",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Alex Rivera, please respond to this dispute within 72 hours with your explanation and any supporting evidence.",
        createdAt: "2026-04-11T09:00:00Z",
      },
    ],
    evidence: [
      {
        id: "ev-003-1",
        disputeId: "D-2026-003",
        uploadedBy: "merchant",
        type: "image",
        url: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=600",
        label: "Screenshot showing competitor branding",
        uploadedAt: "2026-04-10T16:00:00Z",
      },
    ],
    createdAt: "2026-04-10T16:00:00Z",
    updatedAt: "2026-04-11T09:00:00Z",
    relatedPaymentId: "demo-payout-005",
  },
  {
    id: "D-2026-004",
    campaignId: "demo-campaign-004",
    campaignTitle: "Before & After — Brow Lamination",
    merchantName: "Brow Theory",
    creatorName: "Alex Rivera",
    filedBy: "Alex Rivera",
    filedByRole: "creator",
    otherPartyName: "Brow Theory",
    otherPartyRole: "merchant",
    reason: "no_show_scan",
    description:
      "I visited the location on March 25th and the QR code at the entrance was not scanning. The staff confirmed the system was down. I have a photo of myself at the location as proof.",
    amount: 85,
    expectedOutcome: "Manual verification and full payment release",
    status: "open",
    events: [
      {
        id: "evt-004-1",
        disputeId: "D-2026-004",
        type: "filed",
        authorRole: "creator",
        authorName: "Alex Rivera",
        message:
          "I visited the location on March 25th and the QR code at the entrance was not scanning. The staff confirmed the system was down. I have a photo of myself at the location as proof.",
        evidence: [
          {
            id: "ev-004-1",
            disputeId: "D-2026-004",
            uploadedBy: "creator",
            type: "image",
            url: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=600",
            label: "Photo at Brow Theory location March 25",
            uploadedAt: "2026-04-14T10:00:00Z",
          },
        ],
        createdAt: "2026-04-14T10:00:00Z",
      },
    ],
    evidence: [
      {
        id: "ev-004-1",
        disputeId: "D-2026-004",
        uploadedBy: "creator",
        type: "image",
        url: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=600",
        label: "Photo at Brow Theory location March 25",
        uploadedAt: "2026-04-14T10:00:00Z",
      },
    ],
    createdAt: "2026-04-14T10:00:00Z",
    updatedAt: "2026-04-14T10:00:00Z",
    relatedScanId: "scan-brow-001",
  },
  {
    id: "D-2026-005",
    campaignId: "demo-campaign-005",
    campaignTitle: "Rooftop Bar Review — Sunset Series",
    merchantName: "230 Fifth Rooftop",
    creatorName: "Jordan Kim",
    filedBy: "230 Fifth Rooftop",
    filedByRole: "merchant",
    otherPartyName: "Jordan Kim",
    otherPartyRole: "creator",
    reason: "content_violation",
    description:
      "Creator posted at the wrong location and tagged our competitor. Campaign was for our rooftop specifically. We cannot approve payment for off-brand content.",
    amount: 120,
    expectedOutcome: "Withhold payment or require content replacement",
    status: "resolved",
    events: [
      {
        id: "evt-005-1",
        disputeId: "D-2026-005",
        type: "filed",
        authorRole: "merchant",
        authorName: "230 Fifth Rooftop",
        message:
          "Creator posted at the wrong location and tagged our competitor. Campaign was for our rooftop specifically.",
        createdAt: "2026-03-20T11:00:00Z",
      },
      {
        id: "evt-005-2",
        disputeId: "D-2026-005",
        type: "creator_response",
        authorRole: "creator",
        authorName: "Jordan Kim",
        message:
          "I was directed to the sister location by staff. I have the DM thread proving they told me to go to the other bar.",
        createdAt: "2026-03-21T08:00:00Z",
      },
      {
        id: "evt-005-3",
        disputeId: "D-2026-005",
        type: "admin_decision",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "After reviewing the communication thread, the merchant's own staff directed the creator to the alternate location. We are splitting the payout: $60 released to creator, $60 credited back to merchant.",
        createdAt: "2026-03-23T14:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-03-20T11:00:00Z",
    updatedAt: "2026-03-23T14:00:00Z",
    resolvedAt: "2026-03-23T14:00:00Z",
    outcome: "split",
    outcomeNote: "$60 to creator / $60 credited back to merchant",
  },
  {
    id: "D-2026-006",
    campaignId: "demo-campaign-006",
    campaignTitle: "Dumpling & Dim Sum Feature",
    merchantName: "Nom Wah Tea Parlor",
    creatorName: "Sam Chen",
    filedBy: "Sam Chen",
    filedByRole: "creator",
    otherPartyName: "Nom Wah Tea Parlor",
    otherPartyRole: "merchant",
    reason: "missing_payment",
    description:
      "Payment of $40 has been pending for 18 days. Campaign was marked complete and verified. No response from the merchant.",
    amount: 40,
    expectedOutcome: "Immediate payment release",
    status: "resolved",
    events: [
      {
        id: "evt-006-1",
        disputeId: "D-2026-006",
        type: "filed",
        authorRole: "creator",
        authorName: "Sam Chen",
        message:
          "Payment of $40 has been pending for 18 days. Campaign was marked complete and verified. No response from the merchant.",
        createdAt: "2026-03-10T09:00:00Z",
      },
      {
        id: "evt-006-2",
        disputeId: "D-2026-006",
        type: "admin_decision",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Campaign was verified on our end. Merchant failed to respond within the 5-day window. We are releasing the full $40 to Sam Chen per our payment guarantee policy.",
        createdAt: "2026-03-15T10:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-03-10T09:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
    resolvedAt: "2026-03-15T10:00:00Z",
    outcome: "refund_creator",
    outcomeNote: "$40 released under Push payment guarantee",
  },
  {
    id: "D-2026-007",
    campaignId: "demo-campaign-007",
    campaignTitle: "Sneaker Drop Coverage — Limited Edition",
    merchantName: "KITH Soho",
    creatorName: "Maya Torres",
    filedBy: "KITH Soho",
    filedByRole: "merchant",
    otherPartyName: "Maya Torres",
    otherPartyRole: "creator",
    reason: "no_show_scan",
    description:
      "Creator claimed to have visited but no QR scan was recorded in our system. We cannot verify the visit occurred.",
    amount: 200,
    expectedOutcome: "Dismiss dispute and withhold payment until verification",
    status: "under_review",
    events: [
      {
        id: "evt-007-1",
        disputeId: "D-2026-007",
        type: "filed",
        authorRole: "merchant",
        authorName: "KITH Soho",
        message:
          "Creator claimed to have visited but no QR scan was recorded. We cannot verify the visit occurred.",
        createdAt: "2026-04-12T13:00:00Z",
      },
      {
        id: "evt-007-2",
        disputeId: "D-2026-007",
        type: "status_change",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "We are reviewing QR scan logs and content timestamps. Response within 48 hours.",
        createdAt: "2026-04-13T09:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-04-12T13:00:00Z",
    updatedAt: "2026-04-13T09:00:00Z",
  },
  {
    id: "D-2026-008",
    campaignId: "demo-campaign-008",
    campaignTitle: "Coffee Shop Aesthetic — Morning Light",
    merchantName: "Partners Coffee",
    creatorName: "Leo Park",
    filedBy: "Leo Park",
    filedByRole: "creator",
    otherPartyName: "Partners Coffee",
    otherPartyRole: "merchant",
    reason: "incorrect_amount",
    description:
      "Was paid $30 but campaign listed $45 for Proven tier creators. My tier is Proven and I should have received the higher rate.",
    amount: 15,
    expectedOutcome: "Additional $15 to match Proven tier rate",
    status: "closed",
    events: [
      {
        id: "evt-008-1",
        disputeId: "D-2026-008",
        type: "filed",
        authorRole: "creator",
        authorName: "Leo Park",
        message:
          "Was paid $30 but campaign listed $45 for Proven tier creators. My tier is Proven and should have received the higher rate.",
        createdAt: "2026-03-01T10:00:00Z",
      },
      {
        id: "evt-008-2",
        disputeId: "D-2026-008",
        type: "merchant_response",
        authorRole: "merchant",
        authorName: "Partners Coffee",
        message:
          "Creator's tier was Explorer at the time of campaign acceptance, not Proven. The tier upgrade happened after the campaign was accepted.",
        createdAt: "2026-03-02T11:00:00Z",
      },
      {
        id: "evt-008-3",
        disputeId: "D-2026-008",
        type: "admin_decision",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Confirmed: creator's tier at time of application was Explorer. The $30 rate was correct per campaign terms. Dispute dismissed.",
        createdAt: "2026-03-04T09:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-04T09:00:00Z",
    resolvedAt: "2026-03-04T09:00:00Z",
    outcome: "dismissed",
    outcomeNote: "Creator tier at time of application was Explorer",
  },
  {
    id: "D-2026-009",
    campaignId: "demo-campaign-009",
    campaignTitle: "Brooklyn Brewery Tour Feature",
    merchantName: "Brooklyn Brewery",
    creatorName: "Zoe Williams",
    filedBy: "Zoe Williams",
    filedByRole: "creator",
    otherPartyName: "Brooklyn Brewery",
    otherPartyRole: "merchant",
    reason: "missing_payment",
    description:
      "Completed campaign on time, all content requirements met. Payment pending for 22 days with no communication from merchant.",
    amount: 65,
    expectedOutcome: "Full $65 payment release",
    status: "open",
    events: [
      {
        id: "evt-009-1",
        disputeId: "D-2026-009",
        type: "filed",
        authorRole: "creator",
        authorName: "Zoe Williams",
        message:
          "Completed campaign on time, all content requirements met. Payment pending for 22 days with no communication from merchant.",
        createdAt: "2026-04-15T08:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-04-15T08:00:00Z",
    updatedAt: "2026-04-15T08:00:00Z",
  },
  {
    id: "D-2026-010",
    campaignId: "demo-campaign-010",
    campaignTitle: "Chelsea Gallery Opening Night",
    merchantName: "Gagosian Chelsea",
    creatorName: "Emma Davis",
    filedBy: "Gagosian Chelsea",
    filedByRole: "merchant",
    otherPartyName: "Emma Davis",
    otherPartyRole: "creator",
    reason: "content_violation",
    description:
      "Creator's post included images of artwork without gallery consent. All artwork photography requires explicit written approval per campaign brief.",
    amount: 150,
    expectedOutcome: "Content removal and payment withheld",
    status: "resolved",
    events: [
      {
        id: "evt-010-1",
        disputeId: "D-2026-010",
        type: "filed",
        authorRole: "merchant",
        authorName: "Gagosian Chelsea",
        message:
          "Creator's post included images of artwork without gallery consent. Photography of artworks requires explicit written approval.",
        createdAt: "2026-03-25T15:00:00Z",
      },
      {
        id: "evt-010-2",
        disputeId: "D-2026-010",
        type: "creator_response",
        authorRole: "creator",
        authorName: "Emma Davis",
        message:
          "The campaign brief said 'capture the atmosphere of the opening.' I did not photograph individual artworks — only crowd scenes with art in the background.",
        createdAt: "2026-03-26T10:00:00Z",
      },
      {
        id: "evt-010-3",
        disputeId: "D-2026-010",
        type: "admin_decision",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "The campaign brief was ambiguous. Creator acted in good faith. We are releasing 50% ($75) to the creator and crediting 50% to the merchant.",
        createdAt: "2026-03-28T11:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-03-25T15:00:00Z",
    updatedAt: "2026-03-28T11:00:00Z",
    resolvedAt: "2026-03-28T11:00:00Z",
    outcome: "split",
    outcomeNote: "$75 to creator / $75 credited to merchant",
  },
  {
    id: "D-2026-011",
    campaignId: "demo-campaign-011",
    campaignTitle: "West Village Flower Shop Story",
    merchantName: "Bloom & Branch NYC",
    creatorName: "Noah Martinez",
    filedBy: "Noah Martinez",
    filedByRole: "creator",
    otherPartyName: "Bloom & Branch NYC",
    otherPartyRole: "merchant",
    reason: "other",
    description:
      "Merchant cancelled the campaign after I visited but before I posted. I did the visit and took photos. Requesting compensation for time and travel.",
    amount: 35,
    expectedOutcome: "Partial compensation for completed visit",
    status: "awaiting_response",
    events: [
      {
        id: "evt-011-1",
        disputeId: "D-2026-011",
        type: "filed",
        authorRole: "creator",
        authorName: "Noah Martinez",
        message:
          "Merchant cancelled the campaign after I visited but before I posted. I did the visit and took photos. Requesting compensation for time and travel.",
        createdAt: "2026-04-13T14:00:00Z",
      },
      {
        id: "evt-011-2",
        disputeId: "D-2026-011",
        type: "admin_message",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Bloom & Branch NYC, please respond to this dispute within 72 hours.",
        createdAt: "2026-04-14T09:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-04-13T14:00:00Z",
    updatedAt: "2026-04-14T09:00:00Z",
  },
  {
    id: "D-2026-012",
    campaignId: "demo-campaign-012",
    campaignTitle: "Nolita Pizza Review",
    merchantName: "L'industrie Pizzeria",
    creatorName: "Ava Johnson",
    filedBy: "Ava Johnson",
    filedByRole: "creator",
    otherPartyName: "L'industrie Pizzeria",
    otherPartyRole: "merchant",
    reason: "missing_payment",
    description:
      "Campaign verified 30 days ago. Multiple attempts to contact merchant through Push platform have gone unanswered. Payment of $28 still pending.",
    amount: 28,
    expectedOutcome: "Immediate payment release",
    status: "resolved",
    events: [
      {
        id: "evt-012-1",
        disputeId: "D-2026-012",
        type: "filed",
        authorRole: "creator",
        authorName: "Ava Johnson",
        message:
          "Campaign verified 30 days ago. Multiple attempts to contact merchant through Push platform have gone unanswered.",
        createdAt: "2026-02-20T10:00:00Z",
      },
      {
        id: "evt-012-2",
        disputeId: "D-2026-012",
        type: "admin_decision",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Merchant unresponsive for 30 days. Releasing $28 under Push Payment Guarantee. Merchant account flagged for review.",
        createdAt: "2026-02-22T10:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-22T10:00:00Z",
    resolvedAt: "2026-02-22T10:00:00Z",
    outcome: "refund_creator",
    outcomeNote: "Push Payment Guarantee activated",
  },
  {
    id: "D-2026-013",
    campaignId: "demo-campaign-013",
    campaignTitle: "Williamsburg Vintage Market Feature",
    merchantName: "Buffalo Exchange Brooklyn",
    creatorName: "Liam Brown",
    filedBy: "Buffalo Exchange Brooklyn",
    filedByRole: "merchant",
    otherPartyName: "Liam Brown",
    otherPartyRole: "creator",
    reason: "content_violation",
    description:
      "Creator did not follow the required caption template. The specific hashtags and handle tags were mandatory. Posted content is missing all required tags.",
    amount: 55,
    expectedOutcome: "Creator revises content within 24h or payment withheld",
    status: "closed",
    events: [
      {
        id: "evt-013-1",
        disputeId: "D-2026-013",
        type: "filed",
        authorRole: "merchant",
        authorName: "Buffalo Exchange Brooklyn",
        message:
          "Creator did not follow the required caption template. Posted content is missing all required hashtags and tags.",
        createdAt: "2026-02-14T11:00:00Z",
      },
      {
        id: "evt-013-2",
        disputeId: "D-2026-013",
        type: "creator_response",
        authorRole: "creator",
        authorName: "Liam Brown",
        message:
          "I have updated the caption with all required tags. Post has been edited. Please review the updated version.",
        createdAt: "2026-02-14T15:00:00Z",
      },
      {
        id: "evt-013-3",
        disputeId: "D-2026-013",
        type: "merchant_response",
        authorRole: "merchant",
        authorName: "Buffalo Exchange Brooklyn",
        message:
          "Reviewed updated content. Tags are now correct. We are satisfied and withdrawing the dispute.",
        createdAt: "2026-02-15T09:00:00Z",
      },
      {
        id: "evt-013-4",
        disputeId: "D-2026-013",
        type: "admin_decision",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "Merchant has withdrawn the dispute. Campaign payment released as agreed.",
        createdAt: "2026-02-15T11:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-02-14T11:00:00Z",
    updatedAt: "2026-02-15T11:00:00Z",
    resolvedAt: "2026-02-15T11:00:00Z",
    outcome: "refund_merchant",
    outcomeNote:
      "Merchant withdrew — creator revised content, payment released",
  },
  {
    id: "D-2026-014",
    campaignId: "demo-campaign-014",
    campaignTitle: "Lower East Side Cocktail Bar Review",
    merchantName: "Attaboy NYC",
    creatorName: "Sofia Lee",
    filedBy: "Sofia Lee",
    filedByRole: "creator",
    otherPartyName: "Attaboy NYC",
    otherPartyRole: "merchant",
    reason: "no_show_scan",
    description:
      "QR scan failed at door despite staff confirming I was eligible. I have a receipt from the bar showing I was there.",
    amount: 90,
    expectedOutcome: "Manual scan verification and payment release",
    status: "open",
    events: [
      {
        id: "evt-014-1",
        disputeId: "D-2026-014",
        type: "filed",
        authorRole: "creator",
        authorName: "Sofia Lee",
        message:
          "QR scan failed at door despite staff confirming I was eligible. I have a receipt from the bar showing I was there.",
        evidence: [
          {
            id: "ev-014-1",
            disputeId: "D-2026-014",
            uploadedBy: "creator",
            type: "image",
            url: "https://images.unsplash.com/photo-1514362453360-8f94243c9996?w=600",
            label: "Bar receipt showing visit",
            uploadedAt: "2026-04-16T19:00:00Z",
          },
        ],
        createdAt: "2026-04-16T19:00:00Z",
      },
    ],
    evidence: [
      {
        id: "ev-014-1",
        disputeId: "D-2026-014",
        uploadedBy: "creator",
        type: "image",
        url: "https://images.unsplash.com/photo-1514362453360-8f94243c9996?w=600",
        label: "Bar receipt showing visit",
        uploadedAt: "2026-04-16T19:00:00Z",
      },
    ],
    createdAt: "2026-04-16T19:00:00Z",
    updatedAt: "2026-04-16T19:00:00Z",
  },
  {
    id: "D-2026-015",
    campaignId: "demo-campaign-015",
    campaignTitle: "SoHo Boutique Fashion Feature",
    merchantName: "The Row SoHo",
    creatorName: "Carlos Rivera",
    filedBy: "The Row SoHo",
    filedByRole: "merchant",
    otherPartyName: "Carlos Rivera",
    otherPartyRole: "creator",
    reason: "incorrect_amount",
    description:
      "Creator invoiced for $250 but campaign payout was clearly stated as $180. Creator is disputing the correct payout amount.",
    amount: 70,
    expectedOutcome: "Enforce original $180 campaign rate",
    status: "under_review",
    events: [
      {
        id: "evt-015-1",
        disputeId: "D-2026-015",
        type: "filed",
        authorRole: "merchant",
        authorName: "The Row SoHo",
        message:
          "Creator invoiced for $250 but campaign payout was clearly stated as $180. We are disputing the amount.",
        createdAt: "2026-04-11T10:00:00Z",
      },
      {
        id: "evt-015-2",
        disputeId: "D-2026-015",
        type: "creator_response",
        authorRole: "creator",
        authorName: "Carlos Rivera",
        message:
          "The $250 reflects my Closer tier bonus rate which was verbally agreed upon during the onboarding call with your team.",
        createdAt: "2026-04-12T14:00:00Z",
      },
      {
        id: "evt-015-3",
        disputeId: "D-2026-015",
        type: "status_change",
        authorRole: "admin",
        authorName: "Push Support",
        message:
          "We are reviewing campaign terms and any off-platform communications. Response within 48 hours.",
        createdAt: "2026-04-13T09:00:00Z",
      },
    ],
    evidence: [],
    createdAt: "2026-04-11T10:00:00Z",
    updatedAt: "2026-04-13T09:00:00Z",
  },
];

// Filter disputes by role (creator or merchant context)
export function getDisputesForRole(
  role: "creator" | "merchant",
  userId = "demo-creator-001",
): Dispute[] {
  if (role === "creator") {
    // Show disputes where creator is involved
    return MOCK_DISPUTES.filter(
      (d) => d.filedByRole === "creator" || d.otherPartyRole === "creator",
    ).slice(0, 8);
  } else {
    // Show disputes where merchant is involved
    return MOCK_DISPUTES.filter(
      (d) => d.filedByRole === "merchant" || d.otherPartyRole === "merchant",
    ).slice(0, 8);
  }
}

export function getDisputeById(id: string): Dispute | undefined {
  return MOCK_DISPUTES.find((d) => d.id === id);
}

export function getDisputeStats(disputes: Dispute[]) {
  const open = disputes.filter((d) =>
    ["open", "awaiting_response"].includes(d.status),
  ).length;
  const resolved = disputes.filter((d) =>
    ["resolved", "closed"].includes(d.status),
  ).length;

  const resolvedWithTime = disputes.filter(
    (d) => d.resolvedAt && (d.status === "resolved" || d.status === "closed"),
  );
  let avgDays = 0;
  if (resolvedWithTime.length > 0) {
    const totalMs = resolvedWithTime.reduce((sum, d) => {
      const ms =
        new Date(d.resolvedAt!).getTime() - new Date(d.createdAt).getTime();
      return sum + ms;
    }, 0);
    avgDays = Math.round(totalMs / resolvedWithTime.length / 86400000);
  }

  return { open, resolved, avgDays };
}
