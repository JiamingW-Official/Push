"use client";

/* =============================================================
   Push v5.1 — Creator Post Workspace (3-step Wizard)
   Vertical AI for Local Commerce · Customer Acquisition Engine

   Step 1  Visit Verification  — geofence + receipt + QR
   Step 2  Post Draft          — platform · DisclosureBot · preview
   Step 3  Submit              — ConversionOracle™ vision OCR (7s)

   Visual language: Flag Red / Molten Lava / Pearl Stone / Deep
   Space Blue / Steel Blue / Champagne Gold · border-radius 0 ·
   Darky + CS Genio Mono · 8px grid · Light Mode only.
   ============================================================= */

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ChangeEvent,
  type DragEvent as ReactDragEvent,
} from "react";
import { TierBadge } from "@/components/creator/TierBadge";
import "./post-workspace.css";

/* ── Types ───────────────────────────────────────────────── */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type Platform = "instagram" | "tiktok" | "xiaohongshu";

type StepKey = "visit" | "draft" | "submit";

type VerifyFlag = "pending" | "ok" | "fail";

type Campaign = {
  id: string;
  title: string;
  business_name: string;
  payout: number;
  deadline?: string | null;
  tier_required: CreatorTier;
  description: string;
  requirements: string[];
  category?: string;
  address?: string;
  /** merchant coordinates for geofence */
  lat?: number;
  lon?: number;
  /** ConversionOracle™ walk-in prediction baseline */
  predictedWalkIns?: number;
};

type LocalAttachment = {
  id: string;
  url: string;
  type: "image" | "video";
  filename: string;
  thumbnailUrl?: string;
};

/* ── Platform rules (DisclosureBot + character caps) ─────── */

const PLATFORM_RULES: Record<
  Platform,
  {
    label: string;
    short: string;
    charLimit: number;
    mediaMax: number;
    disclosures: string[];
    platformTag: string;
  }
> = {
  instagram: {
    label: "Instagram",
    short: "IG",
    charLimit: 2200,
    mediaMax: 10,
    disclosures: ["#ad", "#partnership"],
    platformTag: "Paid partnership tag active",
  },
  tiktok: {
    label: "TikTok",
    short: "TikTok",
    charLimit: 2200,
    mediaMax: 10,
    disclosures: ["#ad", "#partnership"],
    platformTag: "Branded Content toggle active",
  },
  xiaohongshu: {
    label: "Xiaohongshu",
    short: "Red",
    charLimit: 1000,
    mediaMax: 18,
    disclosures: ["#ad", "#partnership", "#合作"],
    platformTag: "合作笔记 tag active",
  },
};

const STEPS: { key: StepKey; label: string; eyebrow: string }[] = [
  { key: "visit", label: "Visit Verification", eyebrow: "Step 1" },
  { key: "draft", label: "Post Draft", eyebrow: "Step 2" },
  { key: "submit", label: "Submit & Verify", eyebrow: "Step 3" },
];

/* ── Demo campaign data ──────────────────────────────────── */

const DEMO_CAMPAIGNS: Record<string, Campaign> = {
  "camp-001": {
    id: "camp-001",
    title: "Morning Ritual Campaign",
    business_name: "Blank Street Coffee",
    payout: 18,
    deadline: "2026-04-30",
    tier_required: "seed",
    description:
      "Visit any Blank Street location, enjoy a drink, and share your experience on your story.",
    requirements: [
      "1 Instagram story tagging @blankstreetcoffee",
      "Visit during peak hours (7-10am)",
    ],
    category: "Coffee",
    address: "134 N 6th St, Brooklyn NY",
    lat: 40.718,
    lon: -73.958,
    predictedWalkIns: 14,
  },
  "camp-002": {
    id: "camp-002",
    title: "Best Burger in NYC Feature",
    business_name: "Superiority Burger",
    payout: 35,
    deadline: "2026-04-25",
    tier_required: "explorer",
    description:
      "Feature our award-winning veggie burgers in an authentic review.",
    requirements: [
      "1 Instagram Reel (min 30s)",
      "Tag @superiorityburger",
      "Must include the Classic Burger",
    ],
    category: "Food",
    address: "119 Ave A, New York NY",
    lat: 40.727,
    lon: -73.983,
    predictedWalkIns: 21,
  },
  "camp-003": {
    id: "camp-003",
    title: "LA Botanica Aesthetic Shoot",
    business_name: "Flamingo Estate",
    payout: 75,
    deadline: "2026-05-05",
    tier_required: "operator",
    description:
      "Capture the Flamingo Estate aesthetic at our NYC pop-up. Moody, editorial, nature-forward content.",
    requirements: [
      "2 feed posts + 3 stories",
      "Aesthetic must match brand guidelines (provided)",
      "Submit content for approval 48h before posting",
    ],
    category: "Lifestyle",
    address: "76 Wooster St, New York NY",
    lat: 40.723,
    lon: -74.002,
    predictedWalkIns: 8,
  },
  "camp-004": {
    id: "camp-004",
    title: "Brow Transformation Story",
    business_name: "Brow Theory",
    payout: 50,
    deadline: "2026-04-28",
    tier_required: "explorer",
    description:
      "Document your brow transformation at Brow Theory. Before/after content preferred.",
    requirements: [
      "Before & after Instagram stories",
      "1 feed post or Reel",
      "Tag @browtheorynyc",
    ],
    category: "Beauty",
    address: "255 Mulberry St, New York NY",
    lat: 40.724,
    lon: -73.995,
    predictedWalkIns: 11,
  },
  "camp-005": {
    id: "camp-005",
    title: "Glossier NYC Store Experience",
    business_name: "Glossier",
    payout: 120,
    deadline: "2026-05-10",
    tier_required: "proven",
    description: "Create editorial beauty content at the Glossier flagship.",
    requirements: [
      "3+ feed posts",
      "Dedicated YouTube or TikTok video (min 3 min)",
      "Engagement rate > 3%",
    ],
    category: "Beauty",
    address: "72 Spring St, New York NY",
    lat: 40.723,
    lon: -73.996,
    predictedWalkIns: 32,
  },
  "camp-006": {
    id: "camp-006",
    title: "Le Bec-Fin Pop-Up Review",
    business_name: "Le Bec Fin",
    payout: 20,
    deadline: "2026-04-22",
    tier_required: "seed",
    description:
      "Try the NYC pop-up of the legendary Philadelphia institution. Share an honest review.",
    requirements: ["1 Instagram story or post", "Tag location"],
    category: "Food",
    address: "219 Mulberry St, New York NY",
    lat: 40.724,
    lon: -73.995,
    predictedWalkIns: 9,
  },
  "camp-007": {
    id: "camp-007",
    title: "KITH x Creator Collab Series",
    business_name: "KITH",
    payout: 85,
    deadline: "2026-05-15",
    tier_required: "proven",
    description:
      "Exclusive creator collab at KITH SoHo. Style editorial campaign for Spring 2026 collection.",
    requirements: [
      "5+ high-quality feed posts",
      "2 Reels",
      "10k+ Instagram followers required",
    ],
    category: "Retail",
    address: "337 Lafayette St, New York NY",
    lat: 40.725,
    lon: -73.994,
    predictedWalkIns: 18,
  },
  "camp-008": {
    id: "camp-008",
    title: "Matcha Morning Ritual",
    business_name: "Cha Cha Matcha",
    payout: 22,
    deadline: "2026-04-29",
    tier_required: "seed",
    description: "Share your morning matcha ritual at Cha Cha Matcha.",
    requirements: ["2 Instagram stories", "Tag @chachamatcha"],
    category: "Coffee",
    address: "373 Broome St, New York NY",
    lat: 40.72,
    lon: -73.995,
    predictedWalkIns: 12,
  },
  "demo-campaign-001": {
    id: "demo-campaign-001",
    title: "Williamsburg Coffee+ Pilot",
    business_name: "Devoción Williamsburg",
    payout: 18,
    deadline: "2026-04-30",
    tier_required: "seed",
    description:
      "Featured in the Williamsburg Coffee+ beachhead — drive walk-ins during 8-11am peak.",
    requirements: [
      "1 IG story or Reel",
      "Include QR code in media frame",
      "Visit between 8-11am",
    ],
    category: "Coffee",
    address: "69 Grand St, Brooklyn NY",
    lat: 40.715,
    lon: -73.958,
    predictedWalkIns: 15,
  },
  "demo-campaign-002": {
    id: "demo-campaign-002",
    title: "Matcha Afternoon Drop",
    business_name: "Cha Cha Matcha",
    payout: 22,
    deadline: "2026-04-29",
    tier_required: "seed",
    description: "Afternoon ritual post at Cha Cha Matcha Williamsburg.",
    requirements: ["2 stories", "Tag @chachamatcha"],
    category: "Coffee",
    address: "373 Broome St, New York NY",
    lat: 40.72,
    lon: -73.995,
    predictedWalkIns: 12,
  },
  "demo-campaign-003": {
    id: "demo-campaign-003",
    title: "Brooklyn Coffee+ Editorial",
    business_name: "Sey Coffee",
    payout: 24,
    deadline: "2026-05-02",
    tier_required: "explorer",
    description: "Editorial shoot at Sey Coffee Bushwick.",
    requirements: ["1 carousel (3+ images)", "Tag @seycoffee"],
    category: "Coffee",
    address: "18 Van Dyke St, Brooklyn NY",
    lat: 40.705,
    lon: -73.938,
    predictedWalkIns: 10,
  },
};

/* ── Helpers ─────────────────────────────────────────────── */

function formatDeadlineCountdown(deadline?: string | null): {
  display: string;
  urgent: boolean;
} {
  if (!deadline) return { display: "No deadline", urgent: false };
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { display: "Expired", urgent: true };
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const urgent = days < 3;
  if (days === 0) return { display: `${hours}h`, urgent: true };
  return { display: `${days}d ${hours}h`, urgent };
}

/** haversine distance in meters */
function metersBetween(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ── Main component ──────────────────────────────────────── */

export default function PostWorkspaceClient() {
  const { id } = useParams<{ id: string }>();

  /* Campaign */
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  /* Wizard state */
  const [stepIdx, setStepIdx] = useState<number>(0);

  /* Step 1 — Visit verification */
  const [geoFlag, setGeoFlag] = useState<VerifyFlag>("pending");
  const [geoDistance, setGeoDistance] = useState<number | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [receiptFlag, setReceiptFlag] = useState<VerifyFlag>("pending");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFilename, setReceiptFilename] = useState<string>("");
  const [qrFlag, setQrFlag] = useState<VerifyFlag>("pending");

  /* Step 2 — Draft */
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [caption, setCaption] = useState("");
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);

  /* Step 3 — Submit / Oracle */
  type OracleStage = 0 | 1 | 2 | 3 | 4 | 5;
  const [oracleStage, setOracleStage] = useState<OracleStage>(0);
  const [submitted, setSubmitted] = useState(false);
  const [verdict, setVerdict] = useState<null | "auto_verified">(null);

  const oracleTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  /* ── Load campaign ───────────────────────────────────── */
  useEffect(() => {
    const c = DEMO_CAMPAIGNS[id] ?? null;
    setCampaign(c);
  }, [id]);

  /* ── Mock geofence check on step entry ───────────────── */
  useEffect(() => {
    if (stepIdx !== 0 || !campaign?.lat || !campaign?.lon) return;
    // Mock: current position 78m from merchant (within 200m fence)
    const mockLat = campaign.lat + 0.00055;
    const mockLon = campaign.lon - 0.00022;
    const dist = Math.round(
      metersBetween(
        { lat: campaign.lat, lon: campaign.lon },
        { lat: mockLat, lon: mockLon },
      ),
    );
    setCurrentCoords({ lat: mockLat, lon: mockLon });
    setGeoDistance(dist);
    setGeoFlag(dist <= 200 ? "ok" : "fail");
  }, [stepIdx, campaign]);

  /* Cleanup oracle timers */
  useEffect(() => {
    return () => {
      oracleTimers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  /* ── Derived ─────────────────────────────────────────── */
  const rules = PLATFORM_RULES[platform];
  const countdown = useMemo(
    () => formatDeadlineCountdown(campaign?.deadline),
    [campaign?.deadline],
  );
  const captionNearLimit = caption.length > rules.charLimit * 0.85;

  const merchantHandle = campaign
    ? `@${campaign.business_name.toLowerCase().replace(/\s+/g, "")}`
    : "";
  const autoDisclosures = [...rules.disclosures];

  /* Build rendered caption with disclosure prefixed if not present */
  const renderedCaption = useMemo(() => {
    const missing = autoDisclosures.filter(
      (tag) => !caption.toLowerCase().includes(tag.toLowerCase()),
    );
    if (missing.length === 0) return caption;
    const prefix = missing.join(" ");
    return caption.trim().length > 0 ? `${caption}\n\n${prefix}` : prefix;
  }, [caption, autoDisclosures]);

  const hashtagSuggestions = useMemo(() => {
    const base = [merchantHandle.replace("@", "#"), "#nyceats", "#coffee"];
    const byCat: Record<string, string[]> = {
      Coffee: ["#latteart", "#williamsburg", "#coffeegram"],
      Food: ["#nycfoodie", "#eeeeeats", "#eaternyc"],
      Beauty: ["#cleangirl", "#nycbeauty", "#skintok"],
      Retail: ["#streetwear", "#ootd", "#nyc"],
      Lifestyle: ["#slowliving", "#brooklyn", "#moodboard"],
    };
    const cat = campaign?.category ? (byCat[campaign.category] ?? []) : [];
    return Array.from(new Set([...base, ...cat])).filter(Boolean);
  }, [campaign?.category, merchantHandle]);

  const step1Ready =
    geoFlag === "ok" && receiptFlag === "ok" && qrFlag === "ok";
  const step2Ready = caption.trim().length >= 20 && attachments.length >= 1;

  /* ── Step 1 handlers ─────────────────────────────────── */
  function handleReceiptUpload(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setReceiptPreview(url);
    setReceiptFilename(f.name);
    // Simulate OCR verdict after 1s
    setReceiptFlag("pending");
    const t = setTimeout(() => setReceiptFlag("ok"), 900);
    oracleTimers.current.push(t);
  }

  function handleScanQR() {
    // Normally routes to /scan/[qrId] — here we flip the flag.
    setQrFlag("pending");
    const t = setTimeout(() => setQrFlag("ok"), 700);
    oracleTimers.current.push(t);
  }

  /* ── Step 2 media handlers ───────────────────────────── */
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const remaining = rules.mediaMax - attachments.length;
      if (remaining <= 0) return;
      const arr = Array.from(files).slice(0, remaining);
      arr.forEach((file) => {
        const isVideo = file.type.startsWith("video/");
        const url = URL.createObjectURL(file);
        const att: LocalAttachment = {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url,
          type: isVideo ? "video" : "image",
          filename: file.name,
          thumbnailUrl: isVideo ? undefined : url,
        };
        setAttachments((prev) => [...prev, att]);
      });
    },
    [attachments.length, rules.mediaMax],
  );

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
  }

  function handleDrop(e: ReactDragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }

  function removeAttachment(attId: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  }

  function handleMentionInsert() {
    if (!merchantHandle) return;
    setCaption((prev) =>
      prev.includes(merchantHandle)
        ? prev
        : `${prev}${prev ? " " : ""}${merchantHandle}`,
    );
    setMentionOpen(false);
  }

  function handleHashtagInsert(tag: string) {
    setCaption((prev) =>
      prev.toLowerCase().includes(tag.toLowerCase())
        ? prev
        : `${prev}${prev ? " " : ""}${tag}`,
    );
  }

  /* ── Step 3 — run Oracle pipeline ────────────────────── */
  function runOracle() {
    setSubmitted(true);
    setOracleStage(1);
    // 4 stages across ~7s total, verdict at ~7s
    const marks = [1400, 2800, 4500, 6000, 7000];
    const stages: OracleStage[] = [2, 3, 4, 5, 5];
    marks.forEach((ms, i) => {
      const t = setTimeout(() => {
        setOracleStage(stages[i]);
        if (i === marks.length - 1) setVerdict("auto_verified");
      }, ms);
      oracleTimers.current.push(t);
    });
  }

  /* ── Navigation ──────────────────────────────────────── */
  function gotoStep(n: number) {
    setStepIdx(Math.max(0, Math.min(STEPS.length - 1, n)));
  }

  if (!campaign) {
    return <div className="pw-loading">Loading workspace…</div>;
  }

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="pw pw--v51">
      {/* Top nav */}
      <nav className="pw-topbar">
        <Link href={`/creator/campaigns/${id}`} className="pw-back">
          &larr; Campaign
        </Link>
        <div className="pw-topbar-sep" />
        <span className="pw-topbar-title">{campaign.title}</span>
        <span className="pw-topbar-pill">
          ConversionOracle™ · live
          <span className="pw-topbar-dot" />
        </span>
      </nav>

      {/* Hero */}
      <section className="pw-hero">
        <div className="pw-hero-inner">
          <div className="pw-hero-left">
            <p className="pw-hero-merchant">{campaign.business_name}</p>
            <h1 className="pw-hero-title">{campaign.title}</h1>
            <div className="pw-hero-badges">
              <TierBadge
                tier={campaign.tier_required}
                size="sm"
                variant="outlined"
              />
              {campaign.category && (
                <span className="pw-chip pw-chip--category">
                  {campaign.category}
                </span>
              )}
              {campaign.payout > 0 && (
                <span className="pw-chip pw-chip--payout">
                  ${campaign.payout} / verified customer
                </span>
              )}
              {campaign.predictedWalkIns && (
                <span className="pw-chip pw-chip--oracle">
                  Oracle predicts ~{campaign.predictedWalkIns} walk-ins
                </span>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="pw-hero-deadline">
            <span className="pw-hero-deadline-eyebrow">Deadline in</span>
            <span
              className={`pw-hero-deadline-value${
                countdown.urgent ? " pw-hero-deadline-value--urgent" : ""
              }`}
            >
              {countdown.display}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div className="pw-stepper">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <button
                key={s.key}
                className={[
                  "pw-step",
                  done ? "pw-step--done" : "",
                  active ? "pw-step--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => gotoStep(i)}
                disabled={i > stepIdx + 1}
                aria-current={active ? "step" : undefined}
              >
                <span className="pw-step-num">{i + 1}</span>
                <span className="pw-step-labels">
                  <span className="pw-step-eyebrow">{s.eyebrow}</span>
                  <span className="pw-step-label">{s.label}</span>
                </span>
                {i < STEPS.length - 1 && <span className="pw-step-sep" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Body */}
      <div className="pw-body">
        {stepIdx === 0 && (
          <StepVisit
            campaign={campaign}
            geoFlag={geoFlag}
            geoDistance={geoDistance}
            currentCoords={currentCoords}
            receiptFlag={receiptFlag}
            receiptPreview={receiptPreview}
            receiptFilename={receiptFilename}
            qrFlag={qrFlag}
            onReceiptUpload={handleReceiptUpload}
            onScanQR={handleScanQR}
            onRetryGeo={() => {
              setGeoFlag("pending");
              setTimeout(() => setGeoFlag("ok"), 400);
            }}
          />
        )}

        {stepIdx === 1 && (
          <StepDraft
            campaign={campaign}
            platform={platform}
            setPlatform={setPlatform}
            rules={rules}
            caption={caption}
            setCaption={setCaption}
            renderedCaption={renderedCaption}
            attachments={attachments}
            isDragOver={isDragOver}
            setIsDragOver={setIsDragOver}
            onFileInput={handleFileInput}
            onDrop={handleDrop}
            onRemoveAttachment={removeAttachment}
            autoDisclosures={autoDisclosures}
            merchantHandle={merchantHandle}
            mentionOpen={mentionOpen}
            setMentionOpen={setMentionOpen}
            onMentionInsert={handleMentionInsert}
            captionNearLimit={captionNearLimit}
            hashtagSuggestions={hashtagSuggestions}
            onHashtagInsert={handleHashtagInsert}
          />
        )}

        {stepIdx === 2 && (
          <StepSubmit
            campaign={campaign}
            platform={platform}
            caption={renderedCaption}
            attachments={attachments}
            autoDisclosures={autoDisclosures}
            geoFlag={geoFlag}
            receiptFlag={receiptFlag}
            qrFlag={qrFlag}
            submitted={submitted}
            oracleStage={oracleStage}
            verdict={verdict}
            onSubmit={runOracle}
          />
        )}
      </div>

      {/* Footer nav */}
      <div className="pw-footer">
        <div className="pw-footer-inner">
          <button
            className="pw-nav-btn pw-nav-btn--ghost"
            onClick={() => gotoStep(stepIdx - 1)}
            disabled={stepIdx === 0 || submitted}
          >
            ← Back
          </button>

          <div className="pw-footer-hint">
            {stepIdx === 0 && "3-layer verify: geofence · receipt · QR"}
            {stepIdx === 1 &&
              `${caption.length} / ${rules.charLimit} chars · ${attachments.length} / ${rules.mediaMax} media`}
            {stepIdx === 2 &&
              (verdict === "auto_verified"
                ? "Oracle verdict complete"
                : submitted
                  ? "ConversionOracle™ running…"
                  : "Ready to submit")}
          </div>

          {stepIdx < STEPS.length - 1 && (
            <button
              className="pw-nav-btn pw-nav-btn--primary"
              onClick={() => gotoStep(stepIdx + 1)}
              disabled={
                (stepIdx === 0 && !step1Ready) || (stepIdx === 1 && !step2Ready)
              }
            >
              Next →
            </button>
          )}

          {stepIdx === STEPS.length - 1 && !submitted && (
            <button
              className="pw-nav-btn pw-nav-btn--primary"
              onClick={runOracle}
            >
              Submit to ConversionOracle™
            </button>
          )}

          {stepIdx === STEPS.length - 1 && verdict === "auto_verified" && (
            <Link
              href="/creator/post-campaign"
              className="pw-nav-btn pw-nav-btn--primary"
            >
              View submissions →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   STEP 1 — Visit Verification
   ============================================================= */
function StepVisit({
  campaign,
  geoFlag,
  geoDistance,
  currentCoords,
  receiptFlag,
  receiptPreview,
  receiptFilename,
  qrFlag,
  onReceiptUpload,
  onScanQR,
  onRetryGeo,
}: {
  campaign: Campaign;
  geoFlag: VerifyFlag;
  geoDistance: number | null;
  currentCoords: { lat: number; lon: number } | null;
  receiptFlag: VerifyFlag;
  receiptPreview: string | null;
  receiptFilename: string;
  qrFlag: VerifyFlag;
  onReceiptUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onScanQR: () => void;
  onRetryGeo: () => void;
}) {
  const oracleChecks = [
    { key: "geo", label: "Geo", flag: geoFlag },
    { key: "receipt", label: "Receipt", flag: receiptFlag },
    { key: "qr", label: "QR", flag: qrFlag },
  ];

  return (
    <section className="pw-step-panel">
      <header className="pw-step-header">
        <p className="pw-step-panel-eyebrow">Step 1 · Visit Verification</p>
        <h2 className="pw-step-panel-title">
          Are you at {campaign.business_name}?
        </h2>
        <p className="pw-step-panel-desc">
          The ConversionOracle™ uses a three-layer walk-in signal: geofence,
          receipt OCR, and merchant QR. All three must pass before you can
          publish.
        </p>
      </header>

      {/* Live Oracle status strip */}
      <div className="pw-oracle-strip">
        <span className="pw-oracle-strip-label">ConversionOracle™ status</span>
        <div className="pw-oracle-strip-flags">
          {oracleChecks.map((c) => (
            <span
              key={c.key}
              className={`pw-flag pw-flag--${c.flag}`}
              aria-label={`${c.label} ${c.flag}`}
            >
              <span className="pw-flag-dot" />
              {c.label} ·{" "}
              {c.flag === "ok" ? "✓" : c.flag === "fail" ? "✕" : "pending"}
            </span>
          ))}
        </div>
      </div>

      <div className="pw-visit-grid">
        {/* 1.1 Geofence card */}
        <div className={`pw-verify-card pw-verify-card--${geoFlag}`}>
          <div className="pw-verify-head">
            <span className="pw-verify-index">01</span>
            <div>
              <p className="pw-verify-title">Geofence (200m radius)</p>
              <p className="pw-verify-sub">
                We compare your location to the merchant&rsquo;s registered pin.
              </p>
            </div>
          </div>

          <div className="pw-geo-grid">
            <div className="pw-geo-block">
              <span className="pw-geo-label">Merchant</span>
              <span className="pw-geo-name">{campaign.business_name}</span>
              <span className="pw-geo-coord">
                {campaign.lat?.toFixed(4)}, {campaign.lon?.toFixed(4)}
              </span>
              {campaign.address && (
                <span className="pw-geo-addr">{campaign.address}</span>
              )}
            </div>
            <div className="pw-geo-block">
              <span className="pw-geo-label">You (mock GPS)</span>
              <span className="pw-geo-name">Current position</span>
              <span className="pw-geo-coord">
                {currentCoords
                  ? `${currentCoords.lat.toFixed(4)}, ${currentCoords.lon.toFixed(4)}`
                  : "— , —"}
              </span>
              <span className="pw-geo-addr">
                {geoDistance !== null ? `${geoDistance} m away` : ""}
              </span>
            </div>
          </div>

          {/* Minimalist range bar */}
          <div className="pw-geo-bar" aria-hidden="true">
            <div className="pw-geo-bar-track" />
            <div
              className="pw-geo-bar-fill"
              style={{
                width: `${Math.min(100, ((geoDistance ?? 200) / 200) * 100)}%`,
              }}
            />
            <span
              className="pw-geo-bar-pin"
              style={{
                left: `${Math.min(100, ((geoDistance ?? 200) / 200) * 100)}%`,
              }}
            />
            <span className="pw-geo-bar-label pw-geo-bar-label--start">0m</span>
            <span className="pw-geo-bar-label pw-geo-bar-label--end">
              200m fence
            </span>
          </div>

          <div className="pw-verify-footer">
            {geoFlag === "ok" && (
              <span className="pw-verify-verdict pw-verify-verdict--ok">
                ✓ Inside fence · {geoDistance}m from merchant
              </span>
            )}
            {geoFlag === "fail" && (
              <span className="pw-verify-verdict pw-verify-verdict--fail">
                ✕ Outside fence · move within 200m
              </span>
            )}
            {geoFlag === "pending" && (
              <span className="pw-verify-verdict pw-verify-verdict--pending">
                Reading GPS…
              </span>
            )}
            <button
              className="pw-verify-action"
              onClick={onRetryGeo}
              type="button"
            >
              Re-check
            </button>
          </div>
        </div>

        {/* 1.2 Receipt upload card */}
        <div className={`pw-verify-card pw-verify-card--${receiptFlag}`}>
          <div className="pw-verify-head">
            <span className="pw-verify-index">02</span>
            <div>
              <p className="pw-verify-title">Receipt photo</p>
              <p className="pw-verify-sub">
                Claude Vision parses date, amount, and merchant name.
              </p>
            </div>
          </div>

          {receiptPreview ? (
            <div className="pw-receipt-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={receiptPreview}
                alt={receiptFilename}
                className="pw-receipt-img"
              />
              <div className="pw-receipt-meta">
                <span className="pw-receipt-filename">{receiptFilename}</span>
                {receiptFlag === "ok" && (
                  <span className="pw-receipt-parsed">
                    Parsed · date & amount match campaign window
                  </span>
                )}
                {receiptFlag === "pending" && (
                  <span className="pw-receipt-parsed pw-receipt-parsed--pending">
                    Running OCR…
                  </span>
                )}
              </div>
            </div>
          ) : (
            <label className="pw-receipt-drop">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 4v11M5 10l6-6 6 6M3 18h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
              <span className="pw-receipt-drop-label">
                Upload receipt photo
              </span>
              <span className="pw-receipt-drop-sub">
                JPG / PNG / HEIC · Vision OCR will parse
              </span>
              <input
                type="file"
                accept="image/*"
                className="pw-receipt-input"
                onChange={onReceiptUpload}
                aria-label="Upload receipt photo"
              />
            </label>
          )}

          <div className="pw-verify-footer">
            {receiptFlag === "ok" && (
              <span className="pw-verify-verdict pw-verify-verdict--ok">
                ✓ Receipt matched
              </span>
            )}
            {receiptFlag === "pending" && !receiptPreview && (
              <span className="pw-verify-verdict pw-verify-verdict--pending">
                Waiting for upload
              </span>
            )}
          </div>
        </div>

        {/* 1.3 QR scan card */}
        <div className={`pw-verify-card pw-verify-card--${qrFlag}`}>
          <div className="pw-verify-head">
            <span className="pw-verify-index">03</span>
            <div>
              <p className="pw-verify-title">Merchant QR</p>
              <p className="pw-verify-sub">
                Scan the code at the counter — this is the only way to prove
                physical presence.
              </p>
            </div>
          </div>

          <div className="pw-qr-card">
            <div className="pw-qr-frame" aria-hidden="true">
              <svg viewBox="0 0 80 80" width="100%" height="100%">
                <rect x="0" y="0" width="80" height="80" fill="#f5f2ec" />
                {[...Array(64)].map((_, i) => {
                  const x = (i % 8) * 10;
                  const y = Math.floor(i / 8) * 10;
                  // pseudo-deterministic pattern
                  const v = (i * 37 + 7) % 5;
                  if (v < 2) return null;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={y}
                      width="10"
                      height="10"
                      fill="#003049"
                    />
                  );
                })}
                <rect x="0" y="0" width="20" height="20" fill="#003049" />
                <rect x="5" y="5" width="10" height="10" fill="#f5f2ec" />
                <rect x="60" y="0" width="20" height="20" fill="#003049" />
                <rect x="65" y="5" width="10" height="10" fill="#f5f2ec" />
                <rect x="0" y="60" width="20" height="20" fill="#003049" />
                <rect x="5" y="65" width="10" height="10" fill="#f5f2ec" />
              </svg>
            </div>
            <div className="pw-qr-info">
              <p className="pw-qr-label">QR ID</p>
              <p className="pw-qr-id">{`qr-${campaign.id.slice(-6)}-a1b2`}</p>
              <p className="pw-qr-hint">
                One-time nonce · expires in 90s after scan.
              </p>
              <button
                className="pw-qr-scan-btn"
                onClick={onScanQR}
                type="button"
                disabled={qrFlag === "ok" || qrFlag === "pending"}
              >
                {qrFlag === "ok"
                  ? "✓ Scanned"
                  : qrFlag === "pending"
                    ? "Scanning…"
                    : "Open scanner"}
              </button>
            </div>
          </div>

          <div className="pw-verify-footer">
            {qrFlag === "ok" && (
              <span className="pw-verify-verdict pw-verify-verdict--ok">
                ✓ QR nonce validated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DisclosureBot preview even in step 1 as foreshadow */}
      <div className="pw-fyi">
        <span className="pw-fyi-eyebrow">Coming next</span>
        <p className="pw-fyi-text">
          Once all three signals pass, the DisclosureBot auto-adds FTC-compliant
          disclosure to your caption and the ConversionOracle™ takes over the
          verdict in &lt; 8 seconds.
        </p>
      </div>
    </section>
  );
}

/* =============================================================
   STEP 2 — Post Draft
   ============================================================= */
function StepDraft({
  campaign,
  platform,
  setPlatform,
  rules,
  caption,
  setCaption,
  renderedCaption,
  attachments,
  isDragOver,
  setIsDragOver,
  onFileInput,
  onDrop,
  onRemoveAttachment,
  autoDisclosures,
  merchantHandle,
  mentionOpen,
  setMentionOpen,
  onMentionInsert,
  captionNearLimit,
  hashtagSuggestions,
  onHashtagInsert,
}: {
  campaign: Campaign;
  platform: Platform;
  setPlatform: (p: Platform) => void;
  rules: (typeof PLATFORM_RULES)[Platform];
  caption: string;
  setCaption: (v: string) => void;
  renderedCaption: string;
  attachments: LocalAttachment[];
  isDragOver: boolean;
  setIsDragOver: (v: boolean) => void;
  onFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: ReactDragEvent) => void;
  onRemoveAttachment: (id: string) => void;
  autoDisclosures: string[];
  merchantHandle: string;
  mentionOpen: boolean;
  setMentionOpen: (v: boolean) => void;
  onMentionInsert: () => void;
  captionNearLimit: boolean;
  hashtagSuggestions: string[];
  onHashtagInsert: (tag: string) => void;
}) {
  return (
    <section className="pw-step-panel">
      <header className="pw-step-header">
        <p className="pw-step-panel-eyebrow">Step 2 · Post Draft</p>
        <h2 className="pw-step-panel-title">
          Write your post. DisclosureBot handles compliance.
        </h2>
        <p className="pw-step-panel-desc">
          Choose a platform — we auto-enforce per-network character and media
          caps, and prepend the FTC-compliant disclosure to your final caption.
        </p>
      </header>

      {/* Platform tabs */}
      <div className="pw-platform-tabs" role="tablist">
        {(Object.keys(PLATFORM_RULES) as Platform[]).map((p) => {
          const r = PLATFORM_RULES[p];
          const active = platform === p;
          return (
            <button
              key={p}
              role="tab"
              aria-selected={active}
              className={`pw-platform-tab${active ? " pw-platform-tab--active" : ""}`}
              onClick={() => setPlatform(p)}
            >
              <span className="pw-platform-tab-label">{r.label}</span>
              <span className="pw-platform-tab-meta">
                {r.charLimit.toLocaleString()} chars · up to {r.mediaMax} media
              </span>
            </button>
          );
        })}
      </div>

      {/* DisclosureBot banner */}
      <div className="pw-disclosure-banner">
        <div className="pw-disclosure-banner-left">
          <span className="pw-disclosure-badge">DisclosureBot</span>
          <div className="pw-disclosure-text">
            <p className="pw-disclosure-heading">
              Required disclosure auto-added
            </p>
            <p className="pw-disclosure-detail">
              {autoDisclosures.map((t) => (
                <code key={t} className="pw-disclosure-code">
                  {t}
                </code>
              ))}
              <span className="pw-disclosure-platform-rule">
                {rules.platformTag}
              </span>
            </p>
          </div>
        </div>
        <span className="pw-disclosure-check" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7l3 3 5-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </span>
      </div>

      {/* Split: editor / preview */}
      <div className="pw-draft-grid">
        {/* Editor */}
        <div className="pw-editor">
          {/* Media upload */}
          <div className="pw-editor-section">
            <label className="pw-field-label">Media</label>
            {attachments.length > 0 && (
              <div className="pw-preview-grid">
                {attachments.map((att, i) => (
                  <div key={att.id} className="pw-preview-card">
                    {att.type === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={att.thumbnailUrl ?? att.url}
                        alt={att.filename}
                        className="pw-preview-img"
                      />
                    ) : (
                      <div className="pw-preview-img pw-preview-video">
                        VIDEO
                      </div>
                    )}
                    <span className="pw-preview-index">{i + 1}</span>
                    <button
                      className="pw-preview-remove"
                      onClick={() => onRemoveAttachment(att.id)}
                      aria-label={`Remove ${att.filename}`}
                      type="button"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`pw-dropzone${isDragOver ? " pw-dropzone--over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
            >
              <div className="pw-dropzone-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 2v10M4 7l5-5 5 5M2 15h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
              <span className="pw-dropzone-title">
                {attachments.length > 0
                  ? `Add more (${rules.mediaMax - attachments.length} left)`
                  : `Drop media or click — up to ${rules.mediaMax} files`}
              </span>
              <span className="pw-dropzone-sub">
                {platform === "xiaohongshu"
                  ? "Xiaohongshu supports 18 images / carousel"
                  : `${rules.label} carousel up to ${rules.mediaMax}`}
              </span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="pw-dropzone-input"
                onChange={onFileInput}
                aria-label="Upload media files"
                disabled={attachments.length >= rules.mediaMax}
              />
            </div>
          </div>

          {/* Caption */}
          <div className="pw-editor-section">
            <div className="pw-caption-head">
              <label className="pw-field-label" htmlFor="pw-caption">
                Caption
              </label>
              <div className="pw-caption-toolbar">
                <button
                  type="button"
                  className="pw-toolbar-btn"
                  onClick={() => setMentionOpen(!mentionOpen)}
                >
                  @mention
                </button>
                {mentionOpen && merchantHandle && (
                  <div className="pw-mention-pop">
                    <button
                      className="pw-mention-row"
                      onClick={onMentionInsert}
                      type="button"
                    >
                      <span className="pw-mention-handle">
                        {merchantHandle}
                      </span>
                      <span className="pw-mention-hint">
                        Merchant · auto-suggest
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pw-caption-wrap">
              <textarea
                id="pw-caption"
                className="pw-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={`Write your ${rules.label} caption. Tag ${merchantHandle}. DisclosureBot will auto-add ${autoDisclosures.join(" ")} when you submit.`}
                maxLength={rules.charLimit}
              />
              <span
                className={`pw-char-count${captionNearLimit ? " pw-char-count--warn" : ""}`}
              >
                {caption.length} / {rules.charLimit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Hashtag suggestions */}
          <div className="pw-editor-section">
            <label className="pw-field-label">
              Suggested hashtags
              <span className="pw-field-sub">
                Merchant required · trending in{" "}
                {campaign.category ?? "category"}
              </span>
            </label>
            <div className="pw-hashtag-row">
              {hashtagSuggestions.map((tag) => (
                <button
                  key={tag}
                  className="pw-hashtag-chip"
                  onClick={() => onHashtagInsert(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview pane */}
        <aside className="pw-preview-pane" aria-label="Post preview">
          <div className="pw-preview-head">
            <span className="pw-preview-platform">{rules.label}</span>
            <span className="pw-preview-live">Live preview</span>
          </div>

          <div className="pw-mock-card">
            <div className="pw-mock-top">
              <div className="pw-mock-avatar" aria-hidden="true">
                {campaign.business_name[0]}
              </div>
              <div className="pw-mock-header">
                <span className="pw-mock-merchant">
                  {campaign.business_name.toLowerCase().replace(/\s+/g, "")}
                </span>
                <span className="pw-mock-badge">
                  {rules.platformTag.split(" ")[0]}
                </span>
              </div>
            </div>

            <div className="pw-mock-media">
              {attachments[0] ? (
                attachments[0].type === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={attachments[0].thumbnailUrl ?? attachments[0].url}
                    alt=""
                    className="pw-mock-img"
                  />
                ) : (
                  <div className="pw-mock-img pw-mock-video">VIDEO</div>
                )
              ) : (
                <div className="pw-mock-placeholder">Your media here</div>
              )}
              {attachments.length > 1 && (
                <span className="pw-mock-count">1 / {attachments.length}</span>
              )}
            </div>

            <div className="pw-mock-caption">
              <RichCaption
                text={renderedCaption}
                disclosures={autoDisclosures}
              />
            </div>
          </div>

          <div className="pw-preview-foot">
            <span>
              Disclosures highlighted — DisclosureBot prepends anything you
              forgot.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* Small caption renderer that highlights @mentions, #hashtags, disclosures */
function RichCaption({
  text,
  disclosures,
}: {
  text: string;
  disclosures: string[];
}) {
  if (!text)
    return (
      <span className="pw-mock-caption-empty">
        Start typing — your caption will render here.
      </span>
    );
  const tokens = text.split(/(\s+)/);
  return (
    <>
      {tokens.map((tok, i) => {
        const lower = tok.toLowerCase();
        if (disclosures.some((d) => d.toLowerCase() === lower)) {
          return (
            <span key={i} className="pw-mock-token pw-mock-token--disclosure">
              {tok}
            </span>
          );
        }
        if (tok.startsWith("@")) {
          return (
            <span key={i} className="pw-mock-token pw-mock-token--mention">
              {tok}
            </span>
          );
        }
        if (tok.startsWith("#")) {
          return (
            <span key={i} className="pw-mock-token pw-mock-token--tag">
              {tok}
            </span>
          );
        }
        return <span key={i}>{tok}</span>;
      })}
    </>
  );
}

/* =============================================================
   STEP 3 — Submit & ConversionOracle™ verdict
   ============================================================= */
function StepSubmit({
  campaign,
  platform,
  caption,
  attachments,
  autoDisclosures,
  geoFlag,
  receiptFlag,
  qrFlag,
  submitted,
  oracleStage,
  verdict,
  onSubmit,
}: {
  campaign: Campaign;
  platform: Platform;
  caption: string;
  attachments: LocalAttachment[];
  autoDisclosures: string[];
  geoFlag: VerifyFlag;
  receiptFlag: VerifyFlag;
  qrFlag: VerifyFlag;
  submitted: boolean;
  oracleStage: number;
  verdict: null | "auto_verified";
  onSubmit: () => void;
}) {
  const ORACLE_STAGES = [
    { key: "parse", label: "Receipt parsing" },
    { key: "match", label: "Date & amount match" },
    { key: "recon", label: "Geo reconcile" },
    { key: "disclose", label: "Disclosure check" },
  ];

  const allVerified =
    geoFlag === "ok" && receiptFlag === "ok" && qrFlag === "ok";

  return (
    <section className="pw-step-panel">
      <header className="pw-step-header">
        <p className="pw-step-panel-eyebrow">Step 3 · Submit</p>
        <h2 className="pw-step-panel-title">
          Review & hand off to the Oracle.
        </h2>
        <p className="pw-step-panel-desc">
          The ConversionOracle™ pipeline runs Claude Vision, date/amount match,
          geo reconcile, and disclosure check. Auto-verified posts clear in
          under 8 seconds.
        </p>
      </header>

      {/* Review summary */}
      {!submitted && (
        <div className="pw-review-grid">
          <div className="pw-review-cell">
            <span className="pw-review-eyebrow">Payout</span>
            <span className="pw-review-value">${campaign.payout}</span>
            <span className="pw-review-sub">per verified customer</span>
          </div>

          <div className="pw-review-cell">
            <span className="pw-review-eyebrow">Platform</span>
            <span className="pw-review-value pw-review-value--small">
              {PLATFORM_RULES[platform].label}
            </span>
            <span className="pw-review-sub">
              {attachments.length} media · {caption.length} chars
            </span>
          </div>

          <div className="pw-review-cell">
            <span className="pw-review-eyebrow">Disclosure</span>
            <span className="pw-review-value pw-review-value--small">
              {autoDisclosures.join(" ")}
            </span>
            <span className="pw-review-sub">DisclosureBot · FTC compliant</span>
          </div>

          <div className="pw-review-cell">
            <span className="pw-review-eyebrow">Verification</span>
            <span
              className={`pw-review-value pw-review-value--small pw-review-value--${
                allVerified ? "ok" : "warn"
              }`}
            >
              {allVerified ? "3 / 3 signals" : "Incomplete"}
            </span>
            <span className="pw-review-sub">Geo · Receipt · QR</span>
          </div>
        </div>
      )}

      {/* Oracle pipeline */}
      {submitted && (
        <div className="pw-oracle-panel">
          <div className="pw-oracle-head">
            <span className="pw-oracle-badge">ConversionOracle™</span>
            <span className="pw-oracle-status">
              {verdict
                ? "verdict complete"
                : "running vision + reconcile pipeline"}
            </span>
          </div>

          <div className="pw-oracle-stages">
            {ORACLE_STAGES.map((s, i) => {
              const done = oracleStage > i + 1 || verdict !== null;
              const running = oracleStage === i + 1 && !verdict;
              return (
                <div
                  key={s.key}
                  className={[
                    "pw-oracle-stage",
                    done ? "pw-oracle-stage--done" : "",
                    running ? "pw-oracle-stage--running" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="pw-oracle-stage-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pw-oracle-stage-label">{s.label}</span>
                  <span className="pw-oracle-stage-status">
                    {done ? "✓" : running ? "…" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="pw-oracle-progress">
            <div
              className="pw-oracle-progress-fill"
              style={{
                width: `${verdict ? 100 : Math.min(100, (oracleStage / 4) * 100)}%`,
              }}
            />
          </div>

          {verdict === "auto_verified" && (
            <div className="pw-verdict">
              <div className="pw-confetti" aria-hidden="true" />
              <span className="pw-verdict-label">
                ConversionOracle™ verdict
              </span>
              <div className="pw-verdict-headline">
                auto_verified · +${campaign.payout}
              </div>
              <p className="pw-verdict-sub">
                Paid within 24h to your connected payout method. 30-day walk-in
                attribution window opens now — every verified customer unlocks
                an additional performance share.
              </p>
              <div className="pw-verdict-meta">
                <span>Elapsed 7.0s · Vision OCR + 3-layer reconcile</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Caption + media recap (only before submit) */}
      {!submitted && (
        <div className="pw-review-recap">
          <div className="pw-review-recap-col">
            <span className="pw-review-eyebrow">Caption preview</span>
            <div className="pw-review-caption">
              <RichCaption text={caption} disclosures={autoDisclosures} />
            </div>
          </div>
          <div className="pw-review-recap-col">
            <span className="pw-review-eyebrow">
              Media ({attachments.length})
            </span>
            <div className="pw-review-media-row">
              {attachments.length === 0 && (
                <span className="pw-review-empty">No media attached</span>
              )}
              {attachments.slice(0, 4).map((a) => (
                <div key={a.id} className="pw-review-media">
                  {a.type === "image" ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={a.thumbnailUrl ?? a.url}
                      alt=""
                      className="pw-review-media-img"
                    />
                  ) : (
                    <span className="pw-review-media-vid">VIDEO</span>
                  )}
                </div>
              ))}
              {attachments.length > 4 && (
                <span className="pw-review-media-more">
                  +{attachments.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {!submitted && (
        <div className="pw-submit-row">
          <button
            className="pw-submit-big"
            onClick={onSubmit}
            disabled={!allVerified}
            type="button"
          >
            Submit to ConversionOracle™ ·{" "}
            <span className="pw-submit-big-sub">
              verification in &lt; 8s · payout on approval
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
