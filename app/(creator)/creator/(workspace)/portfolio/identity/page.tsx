"use client";

import { useState, useEffect, useRef } from "react";
import { useCreatorProfile } from "@/lib/creator/hooks/useCreatorProfile";
import { useTierProgress } from "@/lib/creator/hooks/useTierProgress";
import { TIER_LABELS } from "@/lib/creator/constants";
import "./identity.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── Tier config ─────────────────────────────────────────── */
const TIER_COLOR: Record<string, string> = {
  seed: "#b8a99a",
  explorer: "#8c6239",
  operator: "#4a5568",
  proven: "#c9a96e",
  closer: "#9b111e",
  partner: "#1a1a2e",
};

const TIER_NEXT_BENEFITS: Record<string, string[]> = {
  seed: [
    "Access to paid campaigns ($15+/customer)",
    "Explorer badge on public profile",
    "Priority campaign matching",
  ],
  explorer: [
    "Unlock Operator campaigns ($25+/customer)",
    "Featured in brand scouting pool",
    "Detailed ConversionOracle™ analytics",
  ],
  operator: [
    "Access to Proven-tier campaigns ($40+/customer)",
    "Retainer negotiation eligibility",
    "Dedicated account manager",
  ],
  proven: [
    "Closer campaigns ($65+/customer)",
    "Equity participation options",
    "Two-Segment creator economics",
  ],
  closer: [
    "Partner status — highest payout tier",
    "Obsidian badge + profile spotlight",
    "Direct brand partnership access",
  ],
  partner: [],
};

/* ─── Niche tags ───────────────────────────────────────────── */
const ALL_NICHES = [
  "Food",
  "Coffee",
  "Lifestyle",
  "Beauty",
  "Fitness",
  "Retail",
  "Fashion",
  "Travel",
  "Family",
  "Culture",
  "Art",
  "Nightlife",
];

const DEFAULT_NICHES = ["Food", "Coffee", "Lifestyle"];

/* ─── Content style options ────────────────────────────────── */
const STYLE_OPTIONS = [
  { id: "foodie", label: "Foodie" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "review", label: "Review" },
  { id: "behind-scenes", label: "Behind-the-scenes" },
  { id: "documentary", label: "Documentary" },
  { id: "aesthetic", label: "Aesthetic" },
];

const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Daily" },
  { id: "3x", label: "3× / week" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-weekly" },
];

/* ─── Gallery placeholder colors ──────────────────────────── */
const GALLERY_COLORS = [
  "#c1121f22",
  "#003049",
  "#669bbc33",
  "#c9a96e44",
  "#78000033",
  "#4a556822",
];

/* ─── Completeness config ──────────────────────────────────── */
const CHECKLIST_ITEMS = [
  { id: "name", label: "Display name" },
  { id: "location", label: "Location set" },
  { id: "bio", label: "Bio / tagline" },
  { id: "niches", label: "Niche tags" },
  { id: "instagram", label: "Instagram handle" },
  { id: "tiktok", label: "TikTok handle" },
  { id: "style", label: "Content style selected" },
  { id: "gallery", label: "Gallery items added" },
];

/* ─── Score ring ───────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDash((score / 100) * circ), 80);
    return () => clearTimeout(t);
  }, [score, circ]);

  return (
    <div className="score-ring" aria-label={`ConversionOracle score: ${score}`}>
      <svg viewBox="0 0 100 100" className="score-ring__svg">
        <circle cx="50" cy="50" r={r} className="score-ring__track" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="score-ring__fill"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="score-ring__inner">
        <span className="score-ring__number">{score}</span>
        <span className="score-ring__label">Score</span>
      </div>
    </div>
  );
}

/* ─── Progress bar ─────────────────────────────────────────── */
function ProgressBar({ percent }: { percent: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 120);
    return () => clearTimeout(t);
  }, [percent]);
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemax={100}
    >
      <div className="progress-bar__fill" style={{ width: `${width}%` }} />
    </div>
  );
}

/* ─── Inline editable field ───────────────────────────────── */
function EditableField({
  value,
  placeholder,
  className,
  onSave,
}: {
  value: string;
  placeholder: string;
  className?: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onSave(draft.trim() || value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`editable-field__input ${className ?? ""}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
      />
    );
  }
  return (
    <button
      className={`editable-field ${className ?? ""} ${!value ? "editable-field--empty" : ""}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || placeholder}
      <span className="editable-field__icon" aria-hidden>
        ✎
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  Main page                                                  */
/* ═══════════════════════════════════════════════════════════ */
export default function PortfolioIdentityPage() {
  const { creator, loading } = useCreatorProfile();
  const progress = useTierProgress(creator);

  /* local editable state (mirrors creator fields for demo) */
  const [tagline, setTagline] = useState("");
  const [location, setLocation] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [selectedNiches, setSelectedNiches] =
    useState<string[]>(DEFAULT_NICHES);
  const [nicheEditMode, setNicheEditMode] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    "foodie",
    "review",
  ]);
  const [frequency, setFrequency] = useState("3x");

  /* scroll-reveal refs */
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!creator) return;
    setTagline(creator.bio ?? "");
    setLocation(creator.location ?? "Williamsburg, Brooklyn");
    setInstagramHandle(creator.instagram_handle ?? "");
    setTiktokHandle("");
  }, [creator]);

  /* scroll reveal observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    sectionsRef.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [loading]);

  /* GSAP ScrollTrigger animations — runs after data loads */
  useEffect(() => {
    if (loading || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero: Darky name fades up
    gsap.from(".identity-hero__name", {
      opacity: 0,
      y: 48,
      duration: 0.7,
      ease: "cubic.out",
      delay: 0.1,
    });
    gsap.from(".identity-hero__eyebrow", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.from(".identity-hero__tagline, .identity-hero__location", {
      opacity: 0,
      y: 16,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.2,
    });
    gsap.from(".tier-badge", {
      opacity: 0,
      scale: 0.88,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: 0.3,
    });
    // Score ring fade-in after badge
    gsap.from(".score-ring", {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "back.out(1.6)",
      delay: 0.45,
    });

    // Stats bar: each stat counts up from 0 to final value
    gsap.utils.toArray<Element>(".stat-card").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 28,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        delay: i * 0.08,
      });
      // Numeric count-up for the value spans
      const valueEl = el.querySelector(".stat-card__value");
      if (valueEl) {
        const raw = valueEl.textContent ?? "";
        const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
        const prefix = raw.startsWith("$") ? "$" : "";
        const suffix = raw.endsWith("k") ? "k" : "";
        if (!isNaN(num) && num > 0) {
          const obj = { val: 0 };
          gsap.to(obj, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            val: num,
            duration: 1.2,
            ease: "power2.out",
            delay: i * 0.1,
            onUpdate() {
              valueEl.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
            },
          });
        }
      }
    });

    // Gallery grid: sticky grid scroll pattern — items reveal as you scroll
    gsap.utils.toArray<Element>(".gallery-item").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%" },
        y: 20,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power3.out",
        delay: i * 0.06,
      });
    });

    // Section reveals
    gsap.utils.toArray<Element>(".identity-section").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 82%" },
        y: 32,
        opacity: 0,
        duration: 0.6,
        ease: "cubic.out",
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading]);

  const addRef = (i: number) => (el: HTMLElement | null) => {
    sectionsRef.current[i] = el;
  };

  /* ── derived ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="identity-loading">
        <div className="identity-skeleton identity-skeleton--hero" />
        <div className="identity-skeleton identity-skeleton--stats" />
        <div className="identity-skeleton identity-skeleton--section" />
      </div>
    );
  }

  if (!creator) return null;

  const tier = creator.tier;
  const tierLabel = TIER_LABELS[tier] ?? tier;
  const tierColor = TIER_COLOR[tier] ?? "var(--dark)";
  const isPartner = tier === "partner";
  const avgCustomerValue =
    creator.campaigns_completed > 0
      ? ((creator.earnings_total ?? 0) / creator.campaigns_completed).toFixed(0)
      : "—";

  /* completeness */
  const checkMap: Record<string, boolean> = {
    name: !!creator.name,
    location: !!location,
    bio: tagline.length > 10,
    niches: selectedNiches.length >= 2,
    instagram: !!instagramHandle,
    tiktok: !!tiktokHandle,
    style: selectedStyles.length > 0,
    gallery: true, // gallery always has placeholders
  };
  const completedCount = Object.values(checkMap).filter(Boolean).length;
  const completePct = Math.round(
    (completedCount / CHECKLIST_ITEMS.length) * 100,
  );

  /* tier next benefits */
  const nextBenefits = progress?.nextTier ? TIER_NEXT_BENEFITS[tier] : [];
  const nextTierLabel = progress?.nextTier
    ? TIER_LABELS[progress.nextTier]
    : null;

  /* gallery items from demo campaigns */
  const galleryItems = [
    { id: 1, label: "Coffee", color: GALLERY_COLORS[0] },
    { id: 2, label: "Food", color: GALLERY_COLORS[1] },
    { id: 3, label: "Lifestyle", color: GALLERY_COLORS[2] },
    { id: 4, label: "Beauty", color: GALLERY_COLORS[3] },
    { id: 5, label: "Retail", color: GALLERY_COLORS[4] },
    { id: 6, label: "+", color: GALLERY_COLORS[5] },
  ];

  const toggleNiche = (n: string) =>
    setSelectedNiches((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );

  const toggleStyle = (id: string) =>
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div className="identity-page">
      {/* ── 1. HERO ─────────────────────────────────────── */}
      <section className="identity-hero reveal" ref={addRef(0)}>
        <div
          className="identity-hero__bg"
          style={{ "--tier-color": tierColor } as React.CSSProperties}
        />

        <div className="identity-hero__content">
          <div className="identity-hero__left">
            <p className="identity-hero__eyebrow">Creator Identity</p>
            <h1
              className={`identity-hero__name${isPartner ? " identity-hero__name--obsidian" : ""}`}
            >
              {creator.name}
            </h1>
            <p className="identity-hero__location">{location}</p>

            {/* Tagline — editable */}
            <EditableField
              value={tagline}
              placeholder="Add a tagline — describe your content style…"
              className="identity-hero__tagline"
              onSave={setTagline}
            />
          </div>

          <div className="identity-hero__right">
            {/* Tier badge */}
            <div
              className={`tier-badge${isPartner ? " tier-badge--obsidian" : ""}`}
              style={{ "--tier-color": tierColor } as React.CSSProperties}
            >
              <span className="tier-badge__material">{tierLabel}</span>
              <span className="tier-badge__sub">Creator</span>
            </div>

            {/* Score ring */}
            <ScoreRing score={creator.push_score} />
          </div>
        </div>
      </section>

      {/* ── 2. NICHE TAGS ───────────────────────────────── */}
      <section
        className="identity-section identity-niches reveal"
        ref={addRef(1)}
      >
        <div className="identity-section__header">
          <span className="identity-section__label">Content Niches</span>
          <button
            className={`niche-edit-btn${nicheEditMode ? " niche-edit-btn--active" : ""}`}
            onClick={() => setNicheEditMode((v) => !v)}
          >
            {nicheEditMode ? "Done" : "Edit niches"}
          </button>
        </div>
        <div className="niche-chips">
          {(nicheEditMode ? ALL_NICHES : selectedNiches).map((n) => (
            <button
              key={n}
              className={`niche-chip${selectedNiches.includes(n) ? " niche-chip--active" : ""}${nicheEditMode ? " niche-chip--selectable" : ""}`}
              onClick={() => nicheEditMode && toggleNiche(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. STATS BAR ────────────────────────────────── */}
      <section className="identity-stats reveal" ref={addRef(2)}>
        <div className="stat-card">
          <span className="stat-card__value stat-card__value--gold">
            ${(creator.earnings_total ?? 0).toFixed(0)}
          </span>
          <span className="stat-card__label">Total Earned</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {creator.campaigns_completed * 7 + 14}
          </span>
          <span className="stat-card__label">Walk-ins Driven</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {creator.campaigns_completed}
          </span>
          <span className="stat-card__label">Campaigns</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value stat-card__value--gold">
            ${avgCustomerValue}
          </span>
          <span className="stat-card__label">Avg Customer Value</span>
        </div>
      </section>

      {/* ── 4. TIER PROGRESS ────────────────────────────── */}
      <section
        className="identity-section identity-tier-progress reveal"
        ref={addRef(3)}
      >
        <div className="identity-section__header">
          <span className="identity-section__label">Tier Progress</span>
        </div>

        <div className="tier-progress__current">
          <span className="tier-progress__badge" style={{ color: tierColor }}>
            {tierLabel}
          </span>
          {nextTierLabel && (
            <span className="tier-progress__arrow">→ {nextTierLabel}</span>
          )}
        </div>

        {progress && progress.nextTier && (
          <>
            <div className="tier-progress__meta">
              <span>
                {progress.progressPercent}% to {nextTierLabel}
              </span>
              <span>{progress.scoreToNext} pts needed</span>
            </div>
            <ProgressBar percent={progress.progressPercent} />

            {nextBenefits.length > 0 && (
              <div className="tier-progress__unlocks">
                <p className="tier-progress__unlocks-label">
                  What unlocks at {nextTierLabel}:
                </p>
                <ul className="tier-progress__benefits">
                  {nextBenefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {!progress?.nextTier && (
          <p className="tier-progress__top">
            You are at the top tier. Outstanding.
          </p>
        )}
      </section>

      {/* ── 5. CONTENT STYLE ────────────────────────────── */}
      <section
        className="identity-section identity-content-style reveal"
        ref={addRef(4)}
      >
        <div className="identity-section__header">
          <span className="identity-section__label">Content Style</span>
        </div>

        <div className="style-badges">
          {STYLE_OPTIONS.map((s) => (
            <button
              key={s.id}
              className={`style-badge${selectedStyles.includes(s.id) ? " style-badge--active" : ""}`}
              onClick={() => toggleStyle(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="platform-handles">
          <div className="handle-row">
            <span className="handle-row__platform">Instagram</span>
            <EditableField
              value={instagramHandle}
              placeholder="@handle"
              className="handle-row__field"
              onSave={setInstagramHandle}
            />
          </div>
          <div className="handle-row">
            <span className="handle-row__platform">TikTok</span>
            <EditableField
              value={tiktokHandle}
              placeholder="@handle"
              className="handle-row__field"
              onSave={setTiktokHandle}
            />
          </div>
        </div>

        <div className="posting-frequency">
          <p className="posting-frequency__label">Posting frequency</p>
          <div className="frequency-options">
            {FREQUENCY_OPTIONS.map((f) => (
              <button
                key={f.id}
                className={`freq-btn${frequency === f.id ? " freq-btn--active" : ""}`}
                onClick={() => setFrequency(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. GALLERY PREVIEW ──────────────────────────── */}
      <section
        className="identity-section identity-gallery reveal"
        ref={addRef(5)}
      >
        <div className="identity-section__header">
          <span className="identity-section__label">Recent Work</span>
          <button className="gallery-add-btn">+ Add more</button>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
              style={{ background: item.color }}
            >
              {item.id === 6 ? (
                <span className="gallery-item__add">+ Add</span>
              ) : (
                <span className="gallery-item__label">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. PROFILE COMPLETENESS ─────────────────────── */}
      <section
        className="identity-section identity-completeness reveal"
        ref={addRef(6)}
      >
        <div className="identity-section__header">
          <span className="identity-section__label">Profile Completeness</span>
          <span className="completeness-pct">{completePct}%</span>
        </div>

        <ProgressBar percent={completePct} />

        <div className="completeness-checklist">
          {CHECKLIST_ITEMS.map((item) => {
            const done = checkMap[item.id];
            return (
              <div
                key={item.id}
                className={`checklist-item${done ? " checklist-item--done" : ""}`}
              >
                <span className="checklist-item__icon" aria-hidden>
                  {done ? "✓" : "○"}
                </span>
                <span className="checklist-item__label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
