// Mock KYC state — reads/writes localStorage key "push-demo-kyc-status"
// TODO: wire to Supabase + Stripe Identity or Persona SDK

export type KycStatus = "unverified" | "in_review" | "verified" | "rejected";

export interface KycDocument {
  name: string;
  size: number;
  dataUrl?: string;
}

export interface KycIdentity {
  docType: "drivers_license" | "id_card" | "passport" | "";
  firstName: string;
  lastName: string;
  dob: string;
  ssnLast4: string;
  frontDoc: KycDocument | null;
  backDoc: KycDocument | null;
  selfieDoc: KycDocument | null;
}

export interface KycSocialAccount {
  platform: "instagram" | "tiktok" | "xiaohongshu" | "youtube" | "twitter";
  handle: string;
  followers: number;
  recentPosts: string[];
  connected: boolean;
}

export interface KycAddress {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  proofDoc: KycDocument | null;
}

export interface KycState {
  status: KycStatus;
  identity: KycIdentity;
  socials: KycSocialAccount[];
  address: KycAddress;
  submittedAt?: string;
  rejectionReason?: string;
}

const STORAGE_KEY = "push-demo-kyc-status";

const DEFAULT_SOCIALS: KycSocialAccount[] = [
  {
    platform: "instagram",
    handle: "",
    followers: 0,
    recentPosts: [],
    connected: false,
  },
  {
    platform: "tiktok",
    handle: "",
    followers: 0,
    recentPosts: [],
    connected: false,
  },
  {
    platform: "xiaohongshu",
    handle: "",
    followers: 0,
    recentPosts: [],
    connected: false,
  },
  {
    platform: "youtube",
    handle: "",
    followers: 0,
    recentPosts: [],
    connected: false,
  },
  {
    platform: "twitter",
    handle: "",
    followers: 0,
    recentPosts: [],
    connected: false,
  },
];

const DEFAULT_STATE: KycState = {
  status: "unverified",
  identity: {
    docType: "",
    firstName: "",
    lastName: "",
    dob: "",
    ssnLast4: "",
    frontDoc: null,
    backDoc: null,
    selfieDoc: null,
  },
  socials: DEFAULT_SOCIALS,
  address: {
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    proofDoc: null,
  },
};

export function loadKyc(): KycState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveKyc(state: Partial<KycState>): KycState {
  const current = loadKyc();
  const next = { ...current, ...state };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function resetKyc(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Simulate mock OAuth flow for a platform
export function mockOAuthConnect(
  platform: KycSocialAccount["platform"],
): KycSocialAccount {
  const mockData: Record<
    KycSocialAccount["platform"],
    Omit<KycSocialAccount, "platform" | "connected">
  > = {
    instagram: {
      handle: "@creator_demo",
      followers: 12400,
      recentPosts: [
        "https://picsum.photos/seed/ig1/120/120",
        "https://picsum.photos/seed/ig2/120/120",
        "https://picsum.photos/seed/ig3/120/120",
      ],
    },
    tiktok: {
      handle: "@creator.demo",
      followers: 38200,
      recentPosts: [
        "https://picsum.photos/seed/tt1/120/120",
        "https://picsum.photos/seed/tt2/120/120",
        "https://picsum.photos/seed/tt3/120/120",
      ],
    },
    xiaohongshu: {
      handle: "@创作者",
      followers: 6800,
      recentPosts: [
        "https://picsum.photos/seed/xhs1/120/120",
        "https://picsum.photos/seed/xhs2/120/120",
        "https://picsum.photos/seed/xhs3/120/120",
      ],
    },
    youtube: {
      handle: "@CreatorDemo",
      followers: 5100,
      recentPosts: [
        "https://picsum.photos/seed/yt1/120/120",
        "https://picsum.photos/seed/yt2/120/120",
        "https://picsum.photos/seed/yt3/120/120",
      ],
    },
    twitter: {
      handle: "@creator_demo",
      followers: 3900,
      recentPosts: [
        "https://picsum.photos/seed/tw1/120/120",
        "https://picsum.photos/seed/tw2/120/120",
        "https://picsum.photos/seed/tw3/120/120",
      ],
    },
  };
  return { platform, connected: true, ...mockData[platform] };
}

// Submit KYC — sets status to "in_review", then after 3s demo sets to "verified"
export function submitKyc(state: KycState): Promise<KycState> {
  return new Promise((resolve) => {
    const inReview = saveKyc({
      ...state,
      status: "in_review",
      submittedAt: new Date().toISOString(),
    });
    // Demo: auto-verify after 3s
    setTimeout(() => {
      saveKyc({ status: "verified" });
    }, 3000);
    resolve(inReview);
  });
}
