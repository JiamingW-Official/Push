// Push Platform — Mock submission records for creator content workspace
// Linked to DEMO_CAMPAIGNS camp-001 through camp-008 from creator dashboard

export type ContentType = "post" | "story" | "reel" | "video" | "carousel";
export type Platform = "instagram" | "tiktok" | "xiaohongshu" | "youtube";
export type SubmissionStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected";

export type Attachment = {
  id: string;
  url: string;
  type: "image" | "video";
  filename: string;
  thumbnailUrl?: string;
};

export type MockSubmission = {
  id: string;
  campaignId: string;
  creatorId: string;
  contentType: ContentType;
  platform: Platform;
  attachments: Attachment[];
  caption: string;
  publicUrl: string;
  status: SubmissionStatus;
  reviewerNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
};

export const MOCK_SUBMISSIONS: MockSubmission[] = [
  {
    id: "sub-001",
    campaignId: "camp-001",
    creatorId: "demo-creator-001",
    contentType: "story",
    platform: "instagram",
    attachments: [
      {
        id: "att-001a",
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        type: "image",
        filename: "blank-street-morning.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      },
    ],
    caption:
      "Morning ritual unlocked at @blankstreetcoffee — the oat latte hit different today. #ad #blankstreet",
    publicUrl: "https://www.instagram.com/stories/alexcheneats/001/",
    status: "approved",
    submittedAt: "2026-04-05T09:30:00Z",
    reviewedAt: "2026-04-05T14:00:00Z",
  },
  {
    id: "sub-002",
    campaignId: "camp-002",
    creatorId: "demo-creator-001",
    contentType: "reel",
    platform: "instagram",
    attachments: [
      {
        id: "att-002a",
        url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        type: "image",
        filename: "superiority-burger-reel-thumb.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      },
    ],
    caption:
      "Best burger in NYC? The Classic at @superiorityburger is the one. Not up for debate. #ad #superiorityburger #nycfood",
    publicUrl: "https://www.instagram.com/reel/abc123/",
    status: "approved",
    submittedAt: "2026-03-22T11:00:00Z",
    reviewedAt: "2026-03-22T18:30:00Z",
  },
  {
    id: "sub-003",
    campaignId: "camp-003",
    creatorId: "demo-creator-001",
    contentType: "post",
    platform: "instagram",
    attachments: [
      {
        id: "att-003a",
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        type: "image",
        filename: "flamingo-estate-001.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      },
      {
        id: "att-003b",
        url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
        type: "image",
        filename: "flamingo-estate-002.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400",
      },
    ],
    caption:
      "The LA aesthetic has arrived in NYC. @flamingoestate opens their first Manhattan pop-up and it is immaculate. #ad #flamingoestate #nycpopup #lifestyle",
    publicUrl: "https://www.instagram.com/p/flamingo-nyc-001/",
    status: "pending_review",
    submittedAt: "2026-04-10T16:00:00Z",
  },
  {
    id: "sub-004",
    campaignId: "camp-003",
    creatorId: "demo-creator-001",
    contentType: "story",
    platform: "instagram",
    attachments: [
      {
        id: "att-004a",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        type: "image",
        filename: "flamingo-estate-story-1.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      },
      {
        id: "att-004b",
        url: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800",
        type: "image",
        filename: "flamingo-estate-story-2.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=400",
      },
      {
        id: "att-004c",
        url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
        type: "image",
        filename: "flamingo-estate-story-3.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
      },
    ],
    caption: "Three frames from the @flamingoestate NYC opening. #ad",
    publicUrl:
      "https://www.instagram.com/stories/alexcheneats/flamingo-estate/",
    status: "rejected",
    reviewerNotes:
      "Caption needs explicit #ad disclosure as the first hashtag. Please resubmit with #ad appearing before brand tags.",
    submittedAt: "2026-04-08T10:00:00Z",
    reviewedAt: "2026-04-09T09:00:00Z",
  },
  {
    id: "sub-005",
    campaignId: "camp-004",
    creatorId: "demo-creator-001",
    contentType: "story",
    platform: "instagram",
    attachments: [
      {
        id: "att-005a",
        url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        type: "image",
        filename: "brow-theory-before.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      },
      {
        id: "att-005b",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
        type: "image",
        filename: "brow-theory-after.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      },
    ],
    caption:
      "Before / after at @browtheorynyc — the difference is honestly insane. #ad #browtheory #beautynyc",
    publicUrl: "",
    status: "draft",
    submittedAt: "2026-04-12T14:30:00Z",
  },
  {
    id: "sub-006",
    campaignId: "camp-005",
    creatorId: "demo-creator-001",
    contentType: "post",
    platform: "instagram",
    attachments: [
      {
        id: "att-006a",
        url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
        type: "image",
        filename: "glossier-flagship-001.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      },
    ],
    caption:
      "The @glossier flagship in NYC is a beauty lover's dream. Cloud Paint, Balm Dotcom, Boy Brow — I got them all. #ad #glossier #beautyblogger",
    publicUrl: "https://www.instagram.com/p/glossier-nyc-001/",
    status: "approved",
    submittedAt: "2026-04-01T12:00:00Z",
    reviewedAt: "2026-04-01T20:00:00Z",
  },
  {
    id: "sub-007",
    campaignId: "camp-005",
    creatorId: "demo-creator-001",
    contentType: "video",
    platform: "youtube",
    attachments: [
      {
        id: "att-007a",
        url: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800",
        type: "image",
        filename: "glossier-youtube-thumb.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400",
      },
    ],
    caption:
      "Full Glossier NYC Flagship Haul + Review (2026) — Is the hype real? Honest thoughts from a longtime fan. #ad #glossier",
    publicUrl: "https://www.youtube.com/watch?v=glossier-haul-2026",
    status: "approved",
    submittedAt: "2026-04-03T15:00:00Z",
    reviewedAt: "2026-04-04T10:00:00Z",
  },
  {
    id: "sub-008",
    campaignId: "camp-006",
    creatorId: "demo-creator-001",
    contentType: "post",
    platform: "instagram",
    attachments: [
      {
        id: "att-008a",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        type: "image",
        filename: "lebecfin-popup.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      },
    ],
    caption:
      "The legendary Le Bec-Fin has finally arrived in NYC and it lives up to every bit of the reputation. #ad #lebecfin #nycfoodie #frenchfood",
    publicUrl: "https://www.instagram.com/p/lebecfin-nyc-001/",
    status: "approved",
    submittedAt: "2026-03-14T13:00:00Z",
    reviewedAt: "2026-03-14T19:00:00Z",
  },
  {
    id: "sub-009",
    campaignId: "camp-007",
    creatorId: "demo-creator-001",
    contentType: "reel",
    platform: "instagram",
    attachments: [
      {
        id: "att-009a",
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
        type: "image",
        filename: "kith-spring-001.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
      },
      {
        id: "att-009b",
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        type: "image",
        filename: "kith-spring-002.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
    ],
    caption:
      "Spring 2026 at @kith SoHo — the collection hits different in person. Styled for the streets, not just the 'gram. #ad #kith #kithnyc #streetwear",
    publicUrl: "https://www.instagram.com/reel/kith-spring-2026/",
    status: "pending_review",
    submittedAt: "2026-04-15T11:00:00Z",
  },
  {
    id: "sub-010",
    campaignId: "camp-007",
    creatorId: "demo-creator-001",
    contentType: "carousel",
    platform: "instagram",
    attachments: [
      {
        id: "att-010a",
        url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
        type: "image",
        filename: "kith-carousel-01.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400",
      },
      {
        id: "att-010b",
        url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800",
        type: "image",
        filename: "kith-carousel-02.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400",
      },
      {
        id: "att-010c",
        url: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800",
        type: "image",
        filename: "kith-carousel-03.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400",
      },
      {
        id: "att-010d",
        url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
        type: "image",
        filename: "kith-carousel-04.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400",
      },
      {
        id: "att-010e",
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
        type: "image",
        filename: "kith-carousel-05.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      },
    ],
    caption:
      "5 looks, 1 collection. KITH Spring 2026 styled for NYC. Swipe for the full edit. #ad #kith #fashion #nyc",
    publicUrl: "https://www.instagram.com/p/kith-spring-carousel/",
    status: "approved",
    submittedAt: "2026-04-13T10:00:00Z",
    reviewedAt: "2026-04-13T16:00:00Z",
  },
  {
    id: "sub-011",
    campaignId: "camp-008",
    creatorId: "demo-creator-001",
    contentType: "story",
    platform: "instagram",
    attachments: [
      {
        id: "att-011a",
        url: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=800",
        type: "image",
        filename: "chacha-matcha-morning.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400",
      },
    ],
    caption: "Morning matcha at @chachamatcha — the ritual is real. #ad",
    publicUrl:
      "https://www.instagram.com/stories/alexcheneats/chacha-matcha-001/",
    status: "approved",
    submittedAt: "2026-04-11T08:00:00Z",
    reviewedAt: "2026-04-11T13:00:00Z",
  },
  {
    id: "sub-012",
    campaignId: "camp-001",
    creatorId: "demo-creator-002",
    contentType: "reel",
    platform: "tiktok",
    attachments: [
      {
        id: "att-012a",
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        type: "image",
        filename: "blank-street-tiktok.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
      },
    ],
    caption:
      "POV: 7am Blank Street run before the city wakes up. @blankstreetcoffee #ad #coffeenyc #morningroutine",
    publicUrl: "https://www.tiktok.com/@creator002/video/blank-street",
    status: "approved",
    submittedAt: "2026-04-06T07:30:00Z",
    reviewedAt: "2026-04-06T12:00:00Z",
  },
  {
    id: "sub-013",
    campaignId: "camp-002",
    creatorId: "demo-creator-002",
    contentType: "video",
    platform: "tiktok",
    attachments: [
      {
        id: "att-013a",
        url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
        type: "image",
        filename: "superiority-tiktok.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
      },
    ],
    caption:
      "rating every burger at superiority burger (they're all incredible) #ad #superiorityburger #veganfood #nyc",
    publicUrl: "https://www.tiktok.com/@creator002/video/superiority-review",
    status: "rejected",
    reviewerNotes:
      "Video must show at least 3 menu items per brief. Currently only 1 item is featured. Please reshoot and resubmit.",
    submittedAt: "2026-03-23T14:00:00Z",
    reviewedAt: "2026-03-24T09:00:00Z",
  },
  {
    id: "sub-014",
    campaignId: "camp-003",
    creatorId: "demo-creator-003",
    contentType: "post",
    platform: "xiaohongshu",
    attachments: [
      {
        id: "att-014a",
        url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
        type: "image",
        filename: "flamingo-xhs-001.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400",
      },
      {
        id: "att-014b",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        type: "image",
        filename: "flamingo-xhs-002.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      },
    ],
    caption:
      "LA aesthetic meets NYC energy at Flamingo Estate popup #ad #纽约生活",
    publicUrl: "https://www.xiaohongshu.com/explore/flamingo-estate-nyc-001",
    status: "approved",
    submittedAt: "2026-04-09T11:00:00Z",
    reviewedAt: "2026-04-09T17:00:00Z",
  },
  {
    id: "sub-015",
    campaignId: "camp-004",
    creatorId: "demo-creator-003",
    contentType: "reel",
    platform: "instagram",
    attachments: [
      {
        id: "att-015a",
        url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        type: "image",
        filename: "brow-theory-reel.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      },
    ],
    caption:
      "Brow transformation unlocked at @browtheorynyc — best decision I have made this spring. #ad #browtheory #beautynyc #nycbeauty",
    publicUrl: "https://www.instagram.com/reel/brow-theory-spring/",
    status: "pending_review",
    submittedAt: "2026-04-14T09:00:00Z",
  },
  {
    id: "sub-016",
    campaignId: "camp-005",
    creatorId: "demo-creator-004",
    contentType: "carousel",
    platform: "instagram",
    attachments: [
      {
        id: "att-016a",
        url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
        type: "image",
        filename: "glossier-haul-01.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      },
      {
        id: "att-016b",
        url: "https://images.unsplash.com/photo-1631214524020-3c69888f5e38?w=800",
        type: "image",
        filename: "glossier-haul-02.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1631214524020-3c69888f5e38?w=400",
      },
      {
        id: "att-016c",
        url: "https://images.unsplash.com/photo-1549944093-34534ae4d30f?w=800",
        type: "image",
        filename: "glossier-haul-03.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1549944093-34534ae4d30f?w=400",
      },
    ],
    caption:
      "My Glossier NYC haul after spending way too long in the flagship. Worth every second. #ad #glossier #beautyhaul #skincare",
    publicUrl: "https://www.instagram.com/p/glossier-haul-carousel/",
    status: "approved",
    submittedAt: "2026-04-02T14:00:00Z",
    reviewedAt: "2026-04-02T20:00:00Z",
  },
  {
    id: "sub-017",
    campaignId: "camp-006",
    creatorId: "demo-creator-004",
    contentType: "post",
    platform: "instagram",
    attachments: [
      {
        id: "att-017a",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        type: "image",
        filename: "lebecfin-post.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      },
    ],
    caption:
      "Le Bec-Fin in NYC is not just a pop-up, it is an institution making its NYC debut. Get there before it is gone. #ad #lebecfin #frenchcuisine #nycfood",
    publicUrl: "https://www.instagram.com/p/lebecfin-nyc-debut/",
    status: "approved",
    submittedAt: "2026-03-13T18:00:00Z",
    reviewedAt: "2026-03-14T08:00:00Z",
  },
  {
    id: "sub-018",
    campaignId: "camp-007",
    creatorId: "demo-creator-004",
    contentType: "reel",
    platform: "instagram",
    attachments: [
      {
        id: "att-018a",
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        type: "image",
        filename: "kith-reel-thumb.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      },
    ],
    caption:
      "Spring in NYC means a KITH run. This season's collection is the one. #ad #kith #streetstyle #springfashion",
    publicUrl: "https://www.instagram.com/reel/kith-spring-04/",
    status: "approved",
    submittedAt: "2026-04-12T16:00:00Z",
    reviewedAt: "2026-04-13T09:00:00Z",
  },
  {
    id: "sub-019",
    campaignId: "camp-008",
    creatorId: "demo-creator-005",
    contentType: "story",
    platform: "instagram",
    attachments: [
      {
        id: "att-019a",
        url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
        type: "image",
        filename: "chacha-matcha-story.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
      },
    ],
    caption:
      "Matcha morning done right with @chachamatcha. #ad #matcha #wellness",
    publicUrl:
      "https://www.instagram.com/stories/creator005/chacha-matcha-morning/",
    status: "pending_review",
    submittedAt: "2026-04-16T08:30:00Z",
  },
  {
    id: "sub-020",
    campaignId: "camp-002",
    creatorId: "demo-creator-005",
    contentType: "video",
    platform: "tiktok",
    attachments: [
      {
        id: "att-020a",
        url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        type: "image",
        filename: "superiority-tiktok-2.jpg",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      },
    ],
    caption:
      "NYC's most underrated burger spot? @superiorityburger and I will fight anyone who disagrees. #ad #burger #nyc #foodtok",
    publicUrl:
      "https://www.tiktok.com/@creator005/video/superiority-nyc-review",
    status: "approved",
    submittedAt: "2026-03-25T13:00:00Z",
    reviewedAt: "2026-03-25T19:30:00Z",
  },
];
