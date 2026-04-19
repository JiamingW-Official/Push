export type KycSocialAccount = {
  platform: "instagram" | "tiktok" | "xiaohongshu" | "youtube" | "twitter";
  connected: boolean;
  handle?: string;
  followers: number;
  recentPosts: string[];
};

export type KycDocument = {
  file?: File | null;
  name?: string;
  size?: number;
  dataUrl?: string;
  preview?: string | null;
  status?: "idle" | "uploading" | "done" | "error";
};

export type KycIdentity = {
  firstName: string;
  lastName: string;
  dob: string;
  ssnLast4: string;
  docType: "drivers_license" | "id_card" | "passport";
  frontDoc: KycDocument;
  backDoc: KycDocument;
  selfieDoc: KycDocument;
};

export type KycAddress = {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  proofDoc: KycDocument | null;
};

export type KycState = {
  socials: KycSocialAccount[];
  identity: KycIdentity;
  address: KycAddress;
};

// Synchronous — caller handles delay via setTimeout
export function mockOAuthConnect(
  platform: KycSocialAccount["platform"],
): KycSocialAccount {
  const seeds: Record<KycSocialAccount["platform"], number> = {
    instagram: 1,
    tiktok: 2,
    xiaohongshu: 3,
    youtube: 4,
    twitter: 5,
  };
  const seed = seeds[platform];
  const s = Math.sin(seed * 9301 + 49297) * 233280;
  const rand = s - Math.floor(s);
  return {
    platform,
    connected: true,
    handle: `@demo_${platform}`,
    followers: Math.round(4000 + rand * 46000),
    recentPosts: [],
  };
}

const emptyDoc = (): KycDocument => ({ status: "idle" });

export const MOCK_KYC_STATE: KycState = {
  socials: [
    { platform: "instagram", connected: false, followers: 0, recentPosts: [] },
    { platform: "tiktok", connected: false, followers: 0, recentPosts: [] },
    {
      platform: "xiaohongshu",
      connected: false,
      followers: 0,
      recentPosts: [],
    },
    { platform: "youtube", connected: false, followers: 0, recentPosts: [] },
    { platform: "twitter", connected: false, followers: 0, recentPosts: [] },
  ],
  identity: {
    firstName: "",
    lastName: "",
    dob: "",
    ssnLast4: "",
    docType: "drivers_license",
    frontDoc: emptyDoc(),
    backDoc: emptyDoc(),
    selfieDoc: emptyDoc(),
  },
  address: {
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    proofDoc: null,
  },
};
