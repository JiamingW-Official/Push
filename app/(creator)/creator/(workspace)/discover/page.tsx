"use client";

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  memo,
  useDeferredValue,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import NextImage from "next/image";
import "./discover.css";
import {
  MOCK_CAMPAIGNS,
  type Campaign,
  type TierLevel,
} from "@/lib/mocks/campaigns";
import {
  normalizePay,
  totalNormalizedPay,
  estimatedHours,
  effectiveHourlyRate,
} from "@/lib/services/pricing";

/* ── Dynamic MapView (Leaflet SSR guard) ──────────────────── */

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="disc-map-loading" />,
});

/* ── Types ────────────────────────────────────────────────── */

type SortKey =
  | "match"
  | "payout"
  | "rate"
  | "ending-soon"
  | "spots"
  | "closest";

/** Quick-intent toggles — 1-tap creator-meaningful pre-built filters. */
type QuickIntent = "near" | "soon" | "quick" | "top-rate" | "saved";
type ViewMode = "grid" | "split";
type PayRangeKey = "0-50" | "50-150" | "150+";
type FormatFilter = "in-person" | "remote" | "hybrid";
type StatusFilter = "new" | "saved" | "applied" | "all";
type ApplicationStatus = "none" | "in_review" | "accepted" | "rejected";

const CREATOR_TIER: TierLevel = 2;

/* ── Helpers ──────────────────────────────────────────────── */

function pluralize(n: number, word: string): string {
  return `${n} ${n === 1 ? word : `${word}s`}`;
}

function daysLeft(iso?: string): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function showSpotsBadge(remaining: number, total: number): boolean {
  return remaining <= 2 || remaining / total <= 0.2;
}

function tierChipLabel(minimumTier: TierLevel): string {
  const labels: Record<TierLevel, string> = {
    1: "Open to all",
    2: "Bronze+",
    3: "Steel+",
    4: "Gold+",
    5: "Ruby+",
    6: "Obsidian only",
  };
  return labels[minimumTier];
}

function tierDotColor(minimumTier: TierLevel): string {
  const colors: Record<TierLevel, string> = {
    1: "var(--ink-5)",
    2: "var(--champagne)",
    3: "var(--ink-4)",
    4: "var(--brand-red)",
    5: "var(--accent-blue)",
    6: "var(--ink)",
  };
  return colors[minimumTier];
}

function payRangeMatches(cashPay: number, ranges: PayRangeKey[]): boolean {
  if (!ranges.length) return true;
  return ranges.some((r) => {
    if (r === "0-50") return cashPay <= 50;
    if (r === "50-150") return cashPay > 50 && cashPay <= 150;
    return cashPay > 150;
  });
}

/* ── URL state helpers ────────────────────────────────────── */

/* ── localStorage persistence — remembers creator's pattern across sessions.
   URL params still win when present (share-link semantics). */

const STORED_PREFS_KEY = "push.discover.prefs.v1";

type StoredPrefs = {
  activeCategories: string[];
  quickIntents: string[];
  tierOnly: boolean;
  distanceMi: number;
  deadlineDays: number | null;
  sortKey: string;
};

function readStoredPrefs(): StoredPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORED_PREFS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPrefs>;
    return {
      activeCategories: Array.isArray(parsed.activeCategories)
        ? parsed.activeCategories
        : [],
      quickIntents: Array.isArray(parsed.quickIntents)
        ? parsed.quickIntents
        : [],
      tierOnly: parsed.tierOnly !== false,
      distanceMi: typeof parsed.distanceMi === "number" ? parsed.distanceMi : 5,
      deadlineDays:
        typeof parsed.deadlineDays === "number" ? parsed.deadlineDays : null,
      sortKey: typeof parsed.sortKey === "string" ? parsed.sortKey : "match",
    };
  } catch {
    return null;
  }
}

function writeStoredPrefs(prefs: StoredPrefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORED_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* localStorage might be disabled (incognito, quota); silent fail */
  }
}

function readUrlFilters() {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  return {
    query: p.get("q") ?? "",
    payRanges: (p.get("pay") ?? "").split(",").filter(Boolean) as PayRangeKey[],
    tierOnly: p.get("tier") !== "0",
    formats: (p.get("format") ?? "")
      .split(",")
      .filter(Boolean) as FormatFilter[],
    distanceMi: Number(p.get("dist") ?? 5),
    deadlineDays:
      p.get("deadline") === "week"
        ? 7
        : p.get("deadline") === "2week"
          ? 14
          : p.get("deadline") === "month"
            ? 30
            : null,
    statusFilter: (p.get("status") ?? "all") as StatusFilter,
    sortKey: (p.get("sort") ?? "match") as SortKey,
  };
}

function writeUrlFilters(state: {
  query: string;
  payRanges: PayRangeKey[];
  tierOnly: boolean;
  formats: FormatFilter[];
  distanceMi: number;
  deadlineDays: number | null;
  statusFilter: StatusFilter;
  sortKey: SortKey;
}) {
  const p = new URLSearchParams();
  if (state.query) p.set("q", state.query);
  if (state.payRanges.length) p.set("pay", state.payRanges.join(","));
  if (!state.tierOnly) p.set("tier", "0");
  if (state.formats.length) p.set("format", state.formats.join(","));
  if (state.distanceMi !== 5) p.set("dist", String(state.distanceMi));
  if (state.deadlineDays === 7) p.set("deadline", "week");
  else if (state.deadlineDays === 14) p.set("deadline", "2week");
  else if (state.deadlineDays === 30) p.set("deadline", "month");
  if (state.statusFilter !== "all") p.set("status", state.statusFilter);
  if (state.sortKey !== "match") p.set("sort", state.sortKey);
  const qs = p.toString();
  window.history.replaceState(
    null,
    "",
    qs ? `?${qs}` : window.location.pathname,
  );
}

/* ── Constants ────────────────────────────────────────────── */

const CATEGORIES = [
  { key: "ALL", label: "All" },
  { key: "FOOD & DRINK", label: "Food & drink" },
  { key: "FITNESS", label: "Fitness" },
  { key: "BEAUTY", label: "Beauty" },
  { key: "WELLNESS", label: "Wellness" },
  { key: "RETAIL", label: "Retail" },
  { key: "LIFESTYLE", label: "Lifestyle" },
];

/* Per-category accent palette — { accent · soft (chip glass tint) · glow (button halo) · deep (gradient bottom) }.
   Hex chosen to harmonize with Push brand tokens (Brand Red, GA Orange, Editorial Pink, Editorial Blue). */
type ThemePalette = {
  accent: string;
  soft: string;
  glow: string;
  deep: string;
};
const CATEGORY_THEMES: Record<string, ThemePalette> = {
  ALL: {
    accent: "#c1121f",
    soft: "rgba(193, 18, 31, 0.82)",
    glow: "rgba(193, 18, 31, 0.20)",
    deep: "#a21015",
  },
  "FOOD & DRINK": {
    accent: "#ff5e2b",
    soft: "rgba(255, 94, 43, 0.82)",
    glow: "rgba(255, 94, 43, 0.22)",
    deep: "#d94d20",
  },
  FITNESS: {
    accent: "#16a34a",
    soft: "rgba(22, 163, 74, 0.82)",
    glow: "rgba(22, 163, 74, 0.20)",
    deep: "#107a37",
  },
  BEAUTY: {
    accent: "#e8447d",
    soft: "rgba(232, 68, 125, 0.82)",
    glow: "rgba(232, 68, 125, 0.22)",
    deep: "#c0356a",
  },
  WELLNESS: {
    accent: "#0d9488",
    soft: "rgba(13, 148, 136, 0.82)",
    glow: "rgba(13, 148, 136, 0.20)",
    deep: "#0a7368",
  },
  RETAIL: {
    accent: "#7c3aed",
    soft: "rgba(124, 58, 237, 0.82)",
    glow: "rgba(124, 58, 237, 0.22)",
    deep: "#5b21b6",
  },
  LIFESTYLE: {
    accent: "#1e5fad",
    soft: "rgba(30, 95, 173, 0.82)",
    glow: "rgba(30, 95, 173, 0.22)",
    deep: "#194f8f",
  },
};

function getThemeStyle(cat: string): React.CSSProperties {
  const t = CATEGORY_THEMES[cat] ?? CATEGORY_THEMES.ALL;
  return {
    ["--theme-accent" as string]: t.accent,
    ["--theme-accent-soft" as string]: t.soft,
    ["--theme-accent-glow" as string]: t.glow,
    ["--theme-accent-deep" as string]: t.deep,
  };
}

const SORT_OPTIONS: { key: SortKey; label: string; tooltip: string }[] = [
  {
    key: "match",
    label: "Best for you",
    tooltip:
      "Composite of tier fit, distance, hourly rate, and urgency — tuned for one-shot decisions.",
  },
  {
    key: "rate",
    label: "Top hourly rate",
    tooltip:
      "Effective $/hour after normalizing total pay over estimated work hours.",
  },
  {
    key: "payout",
    label: "Highest total pay",
    tooltip: "Highest absolute pay first (ignores time investment).",
  },
  {
    key: "closest",
    label: "Closest first",
    tooltip: "Shortest distance from your saved location.",
  },
  {
    key: "ending-soon",
    label: "Ending soon",
    tooltip: "Soonest deadline first — for last-minute apply windows.",
  },
  {
    key: "spots",
    label: "Most spots",
    tooltip: "Most slots remaining first — better odds.",
  },
];

/** Quick-intent definitions. Each is a single creator-meaningful filter
 *  that maps to a campaign predicate. UI lives next to category strip. */
const QUICK_INTENTS: { key: QuickIntent; label: string; hint: string }[] = [
  { key: "near", label: "Near me", hint: "≤1 mi" },
  { key: "soon", label: "This week", hint: "≤7 days" },
  { key: "quick", label: "Quick wins", hint: "≤1 hr work" },
  { key: "top-rate", label: "Top rate", hint: "≥$80/hr" },
  { key: "saved", label: "Saved", hint: "Hearts only" },
];

/* ── Discover Page ────────────────────────────────────────── */

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [, startTransition] = useTransition();
  const [payRanges, setPayRanges] = useState<PayRangeKey[]>([]);
  const [tierOnly, setTierOnly] = useState(true);
  const [formats, setFormats] = useState<FormatFilter[]>([]);
  const [distanceMi, setDistanceMi] = useState(5);
  const [deadlineDays, setDeadlineDays] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  /** Multi-select categories. Empty set = "All" (no category filter).
   *  Single tap toggles inclusion. "All" pill clears the set. */
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(),
  );

  /** Quick-intent toggles — independent of category strip, AND-applied. */
  const [quickIntents, setQuickIntents] = useState<Set<QuickIntent>>(
    () => new Set(),
  );

  /** Active category for theme color. Picks first selected; falls back to ALL.
   *  Keeps existing themeStyle plumbing working without major surgery. */
  const activeCategory = useMemo(() => {
    if (activeCategories.size === 0) return "ALL";
    return Array.from(activeCategories)[0];
  }, [activeCategories]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortDropOpen, setSortDropOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [applications, setApplications] = useState<
    Record<string, ApplicationStatus>
  >({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const [filterAnchor, setFilterAnchor] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [sortAnchor, setSortAnchor] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const gearBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const sortDropRef = useRef<HTMLDivElement>(null);
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCardHover = useCallback((id: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setActiveId(id), 60);
  }, []);
  const handleCardLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
    setActiveId(null);
  }, []);

  /* On mount: URL params win, then localStorage, then defaults.
     URL is for sharing exact filter combos; localStorage remembers the
     creator's normal browsing pattern across sessions. */
  useEffect(() => {
    const urlF = readUrlFilters();
    const hasUrlState =
      typeof window !== "undefined" && window.location.search.length > 1;
    let stored: ReturnType<typeof readStoredPrefs> = null;
    if (!hasUrlState) {
      stored = readStoredPrefs();
    }
    const f = urlF;
    if (f) {
      if (f.query) setQuery(f.query);
      if (f.payRanges.length) setPayRanges(f.payRanges);
      if (!f.tierOnly) setTierOnly(false);
      if (f.formats.length) setFormats(f.formats);
      if (f.distanceMi !== 5) setDistanceMi(f.distanceMi);
      if (f.deadlineDays !== null) setDeadlineDays(f.deadlineDays);
      if (f.statusFilter !== "all") setStatusFilter(f.statusFilter);
      if (f.sortKey !== "match") setSortKey(f.sortKey);
    }
    if (stored) {
      if (stored.activeCategories.length)
        setActiveCategories(new Set(stored.activeCategories));
      if (stored.quickIntents.length)
        setQuickIntents(new Set(stored.quickIntents as QuickIntent[]));
      if (stored.tierOnly === false) setTierOnly(false);
      if (stored.distanceMi !== 5) setDistanceMi(stored.distanceMi);
      if (stored.deadlineDays !== null) setDeadlineDays(stored.deadlineDays);
      if (stored.sortKey !== "match") setSortKey(stored.sortKey as SortKey);
    }
    setTimeout(() => setIsLoading(false), 160);
  }, []);

  /* Persist to localStorage whenever creator-meaningful prefs change.
     Skipped during SSR / first hydration burst by checking `window`. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    writeStoredPrefs({
      activeCategories: Array.from(activeCategories),
      quickIntents: Array.from(quickIntents),
      tierOnly,
      distanceMi,
      deadlineDays,
      sortKey,
    });
  }, [
    activeCategories,
    quickIntents,
    tierOnly,
    distanceMi,
    deadlineDays,
    sortKey,
  ]);

  // Sync URL
  useEffect(() => {
    writeUrlFilters({
      query,
      payRanges,
      tierOnly,
      formats,
      distanceMi,
      deadlineDays,
      statusFilter,
      sortKey,
    });
  }, [
    query,
    payRanges,
    tierOnly,
    formats,
    distanceMi,
    deadlineDays,
    statusFilter,
    sortKey,
  ]);

  // Scroll active card into view
  useEffect(() => {
    if (!activeId || !scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLElement>(
      `[data-campaign-id="${activeId}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeId]);

  // Close filter popover on outside click (uses refs, not search-wrap, because popover is fixed-position)
  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !gearBtnRef.current?.contains(t) &&
        !popoverRef.current?.contains(t)
      ) {
        setFilterOpen(false);
        setFilterAnchor(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  // Close sort dropdown on outside click — checks both trigger and portaled drop
  useEffect(() => {
    if (!sortDropOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !sortTriggerRef.current?.contains(t) &&
        !sortDropRef.current?.contains(t)
      ) {
        setSortDropOpen(false);
        setSortAnchor(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortDropOpen]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (payRanges.length) n++;
    if (!tierOnly) n++;
    if (formats.length) n++;
    if (distanceMi !== 5) n++;
    if (deadlineDays !== null) n++;
    if (statusFilter !== "all") n++;
    return n;
  }, [payRanges, tierOnly, formats, distanceMi, deadlineDays, statusFilter]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setPayRanges([]);
    setTierOnly(true);
    setFormats([]);
    setDistanceMi(5);
    setDeadlineDays(null);
    setStatusFilter("all");
    setActiveCategories(new Set());
    setQuickIntents(new Set());
  }, []);

  /** Single-select category. Click "All" clears; click any other category
   *  makes it the sole active selection. Click an already-active chip
   *  deselects it (back to "All" implicitly). */
  const toggleCategory = useCallback((key: string) => {
    startTransition(() => {
      if (key === "ALL") {
        setActiveCategories(new Set());
        return;
      }
      setActiveCategories((prev) => {
        if (prev.has(key) && prev.size === 1) return new Set();
        return new Set([key]);
      });
    });
  }, []);

  /** Toggle a quick intent on/off. */
  const toggleQuickIntent = useCallback((key: QuickIntent) => {
    setQuickIntents((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Open filter anchored to gear button using fixed position — bypasses Leaflet stacking context
  const handleGearClick = useCallback(() => {
    if (filterOpen) {
      setFilterOpen(false);
      setFilterAnchor(null);
    } else if (gearBtnRef.current) {
      const r = gearBtnRef.current.getBoundingClientRect();
      setFilterAnchor({
        top: r.bottom + 8,
        right: window.innerWidth - r.right,
      });
      setFilterOpen(true);
    }
  }, [filterOpen]);

  /* Recalculate anchor on resize/scroll while popovers are open — without
     this they drift away from their trigger as the page reflows. */
  useEffect(() => {
    if (!filterOpen && !sortDropOpen) return;
    const reanchor = () => {
      if (filterOpen && gearBtnRef.current) {
        const r = gearBtnRef.current.getBoundingClientRect();
        setFilterAnchor({
          top: r.bottom + 8,
          right: window.innerWidth - r.right,
        });
      }
      if (sortDropOpen && sortTriggerRef.current) {
        const r = sortTriggerRef.current.getBoundingClientRect();
        setSortAnchor({
          top: r.bottom + 8,
          right: window.innerWidth - r.right,
        });
      }
    };
    window.addEventListener("resize", reanchor);
    window.addEventListener("scroll", reanchor, true);
    return () => {
      window.removeEventListener("resize", reanchor);
      window.removeEventListener("scroll", reanchor, true);
    };
  }, [filterOpen, sortDropOpen]);

  const handleApply = useCallback((id: string) => {
    setApplications((prev) => {
      if (prev[id] && prev[id] !== "none") return prev;
      return { ...prev, [id]: "in_review" };
    });
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* Two-tier filter: stable filters + sort happen first, only re-runs when
     campaign-shape filters change. The status post-pass (saved / applied)
     is cheap and reruns separately, so save/apply actions don't trigger
     a full re-filter+re-sort of the universe. */
  const baseFilteredCampaigns = useMemo(() => {
    let list = MOCK_CAMPAIGNS.filter((c) => c.cashPay > 0);
    if (deferredQuery.trim()) {
      const q = deferredQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.merchantName.toLowerCase().includes(q) ||
          c.neighborhood.toLowerCase().includes(q),
      );
    }
    /* Multi-select categories — empty set means "all". */
    if (activeCategories.size > 0) {
      list = list.filter((c) => activeCategories.has(c.category.toUpperCase()));
    }
    if (payRanges.length)
      list = list.filter((c) => payRangeMatches(c.cashPay, payRanges));
    if (tierOnly) list = list.filter((c) => c.minimumTier <= CREATOR_TIER);
    if (formats.length) list = list.filter((c) => formats.includes(c.format));
    if (distanceMi < 10) list = list.filter((c) => c.distanceMi <= distanceMi);
    if (deadlineDays !== null)
      list = list.filter(
        (c) => (daysLeft(c.deadlineIso) ?? 9999) <= deadlineDays,
      );

    /* Quick intents — composable creator-meaningful filters. AND-combined
       with the popover filters above. */
    if (quickIntents.has("near")) list = list.filter((c) => c.distanceMi <= 1);
    if (quickIntents.has("soon"))
      list = list.filter((c) => (daysLeft(c.deadlineIso) ?? 9999) <= 7);
    if (quickIntents.has("quick"))
      list = list.filter((c) => {
        const h = estimatedHours(c.deliverables);
        return h > 0 && h <= 1;
      });
    if (quickIntents.has("top-rate"))
      list = list.filter(
        (c) => effectiveHourlyRate(c.cashPay, c.deliverables) >= 80,
      );
    if (quickIntents.has("saved"))
      list = list.filter((c) => savedIds.has(c.id));

    switch (sortKey) {
      case "payout":
        list = [...list].sort(
          (a, b) =>
            totalNormalizedPay(b.cashPay, b.deliverables) -
            totalNormalizedPay(a.cashPay, a.deliverables),
        );
        break;
      case "rate":
        list = [...list].sort(
          (a, b) =>
            effectiveHourlyRate(b.cashPay, b.deliverables) -
            effectiveHourlyRate(a.cashPay, a.deliverables),
        );
        break;
      case "closest":
        list = [...list].sort((a, b) => a.distanceMi - b.distanceMi);
        break;
      case "ending-soon":
        list = [...list].sort(
          (a, b) =>
            (daysLeft(a.deadlineIso) ?? 9999) -
            (daysLeft(b.deadlineIso) ?? 9999),
        );
        break;
      case "spots":
        list = [...list].sort((a, b) => b.slotsRemaining - a.slotsRemaining);
        break;
      default:
        /* "Best for you" — composite ranking that creator can trust:
           - Tier eligibility is binary, already handled by tierOnly
           - Match score from server (matchScore field)
           - $/hr nudge (high-rate campaigns get +1pt per $20 over $50)
           - Urgency penalty doesn't apply (creators don't want time pressure)
           - Distance nudge (close < 1mi = +5pts)
           Capped at +/-15pts of base matchScore so server intent dominates. */
        list = [...list].sort((a, b) => {
          const composite = (c: Campaign) => {
            const rate = effectiveHourlyRate(c.cashPay, c.deliverables);
            const ratePts = rate > 50 ? Math.min(8, (rate - 50) / 20) : 0;
            const distPts = c.distanceMi <= 1 ? 5 : c.distanceMi <= 3 ? 2 : 0;
            return c.matchScore + ratePts + distPts;
          };
          return composite(b) - composite(a);
        });
    }
    return list;
  }, [
    deferredQuery,
    activeCategories,
    payRanges,
    tierOnly,
    formats,
    distanceMi,
    deadlineDays,
    quickIntents,
    savedIds,
    sortKey,
  ]);

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === "all") return baseFilteredCampaigns;
    return baseFilteredCampaigns.filter((c) => {
      if (statusFilter === "new")
        return !savedIds.has(c.id) && !applications[c.id];
      if (statusFilter === "saved") return savedIds.has(c.id);
      if (statusFilter === "applied") return !!applications[c.id];
      return true;
    });
  }, [baseFilteredCampaigns, statusFilter, savedIds, applications]);

  const mapCenter = useMemo((): [number, number] => {
    if (!filteredCampaigns.length) return [40.7278, -74.0];
    const lat =
      filteredCampaigns.reduce((s, c) => s + c.lat, 0) /
      filteredCampaigns.length;
    const lng =
      filteredCampaigns.reduce((s, c) => s + c.lng, 0) /
      filteredCampaigns.length;
    return [lat, lng];
  }, [filteredCampaigns]);

  const mapPins = useMemo(
    () =>
      filteredCampaigns.map((c) => ({
        id: c.id,
        title: c.title,
        merchantName: c.merchantName,
        neighborhood: c.neighborhood,
        category: c.category,
        slotsRemaining: c.slotsRemaining,
        slotsTotal: c.slotsTotal,
        lat: c.lat,
        lng: c.lng,
      })),
    [filteredCampaigns],
  );

  /** Pins for campaigns the creator can't apply to (tier gate failed). Empty
   *  set when "Only what I qualify for" is on, since those campaigns are
   *  already filtered out of the list. */
  const lockedIds = useMemo(() => {
    if (tierOnly) return new Set<string>();
    return new Set(
      filteredCampaigns
        .filter((c) => c.minimumTier > CREATOR_TIER)
        .map((c) => c.id),
    );
  }, [tierOnly, filteredCampaigns]);

  /* "All-locked" empty state: list is empty AND tierOnly is on AND turning
     it off would actually surface campaigns. Drives EmptyState variant. */
  const wouldShowIfTierOff = useMemo(() => {
    if (!tierOnly) return false;
    return MOCK_CAMPAIGNS.some(
      (c) => c.cashPay > 0 && c.minimumTier > CREATOR_TIER,
    );
  }, [tierOnly]);
  const isAllLockedEmpty =
    filteredCampaigns.length === 0 && tierOnly && wouldShowIfTierOff;

  /* Intent-driven sections — what creators actually decide between, not
     a duplicate of the category strip. Each row answers "should I do this
     tonight?" along a different axis: match · urgency · proximity · rate ·
     time investment · stretch goals. Order matters: most personal first. */
  const sectionGroups = useMemo(() => {
    const eligible = MOCK_CAMPAIGNS.filter(
      (c) => c.cashPay > 0 && c.minimumTier <= CREATOR_TIER,
    );

    const byCompositeMatch = [...eligible].sort((a, b) => {
      const score = (c: Campaign) => {
        const rate = effectiveHourlyRate(c.cashPay, c.deliverables);
        const ratePts = rate > 50 ? Math.min(8, (rate - 50) / 20) : 0;
        const distPts = c.distanceMi <= 1 ? 6 : c.distanceMi <= 2 ? 3 : 0;
        return c.matchScore + ratePts + distPts;
      };
      return score(b) - score(a);
    });

    const closingSoon = eligible
      .filter((c) => {
        const d = daysLeft(c.deadlineIso);
        return d !== null && d >= 0 && d <= 2;
      })
      .sort(
        (a, b) =>
          (daysLeft(a.deadlineIso) ?? 999) - (daysLeft(b.deadlineIso) ?? 999),
      );

    const walking = eligible
      .filter((c) => c.distanceMi <= 1)
      .sort((a, b) => a.distanceMi - b.distanceMi);

    const topRate = [...eligible].sort(
      (a, b) =>
        effectiveHourlyRate(b.cashPay, b.deliverables) -
        effectiveHourlyRate(a.cashPay, a.deliverables),
    );

    const quickWins = eligible.filter((c) => {
      const h = estimatedHours(c.deliverables);
      return h > 0 && h <= 1;
    });

    const stretchTier = MOCK_CAMPAIGNS.filter(
      (c) =>
        c.cashPay > 0 &&
        c.minimumTier > CREATOR_TIER &&
        c.minimumTier <= CREATOR_TIER + 2,
    ).sort((a, b) => b.matchScore - a.matchScore);

    return [
      {
        key: "picked",
        label: "Picked for you tonight",
        sublabel: "Composite of tier, distance, hourly rate, urgency",
        accent: "#c1121f",
        campaigns: byCompositeMatch.slice(0, 14),
      },
      {
        key: "closing",
        label: "Closing in 48 hours",
        sublabel: "Last call to apply — short windows, quiet competition",
        accent: "#ff5e2b",
        campaigns: closingSoon.slice(0, 14),
      },
      {
        key: "walking",
        label: "Within walking distance",
        sublabel: "Under one mile from your saved location",
        accent: "#16a34a",
        campaigns: walking.slice(0, 14),
      },
      {
        key: "top-rate",
        label: "Top hourly rate",
        sublabel: "Best $/hour ratios after deliverables × time normalize",
        accent: "#0d9488",
        campaigns: topRate.slice(0, 14),
      },
      {
        key: "quick",
        label: "Quick wins",
        sublabel: "One hour or less — short visits, in-and-out content",
        accent: "#7c3aed",
        campaigns: quickWins.slice(0, 14),
      },
      {
        key: "stretch",
        label: "Stretch tier",
        sublabel: "One tier above yours — applying signals ambition to brands",
        accent: "#1e5fad",
        campaigns: stretchTier.slice(0, 14),
      },
    ].filter((g) => g.campaigns.length >= 3);
  }, []);

  /** When a section's "See all →" is clicked, apply the matching filter
   *  combo so the flat grid below shows the full intent-filtered set. */
  const handleSectionSeeAll = useCallback(
    (key: string) => {
      switch (key) {
        case "closing":
          setDeadlineDays(2);
          setSortKey("ending-soon");
          break;
        case "walking":
          setDistanceMi(1);
          setSortKey("closest");
          break;
        case "top-rate":
          setSortKey("rate");
          break;
        case "quick":
          if (!quickIntents.has("quick")) toggleQuickIntent("quick");
          break;
        case "stretch":
          setTierOnly(false);
          break;
        default:
          /* "picked" is the default sort — no extra filter needed */
          setSortKey("match");
      }
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      if (typeof window !== "undefined")
        window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [quickIntents, toggleQuickIntent],
  );

  const legacyApps = useMemo(() => {
    const out: Record<string, "none" | "applied" | "pending"> = {};
    for (const [id, status] of Object.entries(applications)) {
      out[id] =
        status === "in_review"
          ? "applied"
          : status === "accepted"
            ? "pending"
            : "none";
    }
    return out;
  }, [applications]);

  /* ── Toolbar — 2-row Liquid Glass (shared across both views) ── */

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.key === sortKey)?.label ?? "Best match";

  const toolbar = (
    <div className="disc-toolbar">
      {/* Row 1: Search pill (with gear filter trigger) + view toggle */}
      <div className="disc-toolbar-row1">
        <div className="disc-search-wrap" ref={searchWrapRef}>
          {/* Magnifier */}
          <svg
            className="disc-search-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10.5 10.5L14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="search"
            className="disc-search-input"
            placeholder="Search campaigns, merchants, neighborhoods"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            aria-label="Search campaigns"
          />

          {/* Gear icon — fixed-position filter trigger (bypasses Leaflet z-index) */}
          <button
            type="button"
            ref={gearBtnRef}
            className={`disc-gear-btn${filterOpen ? " disc-gear-btn--active" : ""}`}
            aria-expanded={filterOpen}
            aria-haspopup="dialog"
            onClick={handleGearClick}
            aria-label={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ""}`}
          >
            {/* Filter slider icon — three horizontal rails with offset knobs (iOS-style) */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="2.5"
                y1="4"
                x2="13.5"
                y2="4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <line
                x1="2.5"
                y1="8"
                x2="13.5"
                y2="8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <line
                x1="2.5"
                y1="12"
                x2="13.5"
                y2="12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle
                cx="10"
                cy="4"
                r="1.7"
                fill="var(--bg-fill, #fff)"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <circle
                cx="5"
                cy="8"
                r="1.7"
                fill="var(--bg-fill, #fff)"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <circle
                cx="11"
                cy="12"
                r="1.7"
                fill="var(--bg-fill, #fff)"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
            {activeFilterCount > 0 && (
              <span
                className="disc-filter-count"
                aria-label={`${activeFilterCount} active`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* View toggle — icon-only glass capsule */}
        <div className="disc-view-toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={`disc-view-btn${viewMode === "grid" ? " disc-view-btn--active" : ""}`}
            aria-pressed={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 13 13"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="0.5"
                y="0.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="7.5"
                y="0.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="0.5"
                y="7.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="7.5"
                y="7.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`disc-view-btn${viewMode === "split" ? " disc-view-btn--active" : ""}`}
            aria-pressed={viewMode === "split"}
            onClick={() => setViewMode("split")}
            aria-label="Map view"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="9"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: Multi-select categories + sort dropdown */}
      <div className="disc-toolbar-row2">
        <div
          className="disc-cat-strip"
          role="tablist"
          aria-label="Category filter"
        >
          {CATEGORIES.map(({ key, label }) => {
            const isAll = key === "ALL";
            const isActive = isAll
              ? activeCategories.size === 0
              : activeCategories.has(key);
            /* Each chip carries its own category theme via inline vars,
               so multi-select shows Fitness in green next to Beauty in pink
               (instead of all chips inheriting a single page-wide accent). */
            const chipTheme = !isAll ? CATEGORY_THEMES[key] : undefined;
            const chipStyle: React.CSSProperties | undefined =
              chipTheme && isActive
                ? {
                    ["--cat-accent" as string]: chipTheme.accent,
                    ["--cat-accent-deep" as string]: chipTheme.deep,
                  }
                : undefined;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                className={`disc-cat-btn${isActive ? " disc-cat-btn--active" : ""}`}
                aria-selected={isActive}
                style={chipStyle}
                onClick={() => {
                  toggleCategory(key);
                  scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="disc-sort-meta">
          <span className="disc-sort-count">
            <strong>{filteredCampaigns.length}</strong>{" "}
            {activeFilterCount > 0 || query.trim() ? "matching" : "open"}
          </span>
          <span className="disc-sort-sep" aria-hidden="true">
            ·
          </span>
          <span className="disc-sort-label-text">Sort:</span>
          <div className="disc-sort-dropdown">
            <button
              ref={sortTriggerRef}
              type="button"
              className={`disc-sort-trigger${sortDropOpen ? " disc-sort-trigger--open" : ""}`}
              onClick={() => {
                if (sortDropOpen) {
                  setSortDropOpen(false);
                  setSortAnchor(null);
                } else if (sortTriggerRef.current) {
                  const r = sortTriggerRef.current.getBoundingClientRect();
                  setSortAnchor({
                    top: r.bottom + 8,
                    right: window.innerWidth - r.right,
                  });
                  setSortDropOpen(true);
                }
              }}
              aria-expanded={sortDropOpen}
              aria-haspopup="listbox"
            >
              {currentSortLabel}
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 4.5l3.5 3.5 3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {/* Dropdown is portaled to <body> — see SortDropPortal at end of component render */}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Split view ───────────────────────────────────────────── */

  const themeStyle = getThemeStyle(activeCategory);

  if (viewMode === "split") {
    return (
      <div
        className={`disc disc--split-mode${mapFullscreen ? " disc--map-fullscreen" : ""}`}
        data-cat={activeCategory}
        style={themeStyle}
      >
        {toolbar}

        <div className="disc-split">
          {/* Left: scrollable card list */}
          <div className="disc-split-list" data-lenis-prevent>
            <div className="disc-split-scroll" ref={scrollRef}>
              {filteredCampaigns.length === 0 ? (
                <div className="disc-split-empty">
                  <EmptyState
                    onClear={clearFilters}
                    variant={isAllLockedEmpty ? "all-locked" : "no-match"}
                    onTurnOffTier={() => setTierOnly(false)}
                  />
                </div>
              ) : (
                <div className="disc-split-grid">
                  {filteredCampaigns.map((c, i) => (
                    <CampaignCard
                      key={c.id}
                      c={c}
                      idx={i}
                      isActive={activeId === c.id}
                      appStatus={applications[c.id] ?? "none"}
                      saved={savedIds.has(c.id)}
                      locked={!tierOnly && c.minimumTier > CREATOR_TIER}
                      onHover={handleCardHover}
                      onLeave={handleCardLeave}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: map panel */}
          <div className="disc-split-map">
            <div className="disc-map-panel">
              <button
                type="button"
                className="disc-map-expand-btn"
                onClick={() => setMapFullscreen((v) => !v)}
                aria-label={
                  mapFullscreen ? "Exit fullscreen" : "Fullscreen map"
                }
              >
                {mapFullscreen ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="10" y1="14" x2="3" y2="21" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
              <MapView
                campaigns={mapPins}
                applications={legacyApps}
                onApply={handleApply}
                activeId={activeId}
                accent={CATEGORY_THEMES[activeCategory]?.accent}
                lockedIds={lockedIds}
              />
            </div>
          </div>
        </div>

        {/* Filter popover — rendered at disc container level so position:fixed escapes Leaflet stacking context */}
        {filterOpen && filterAnchor && (
          <FilterPopover
            ref={popoverRef}
            anchor={filterAnchor}
            themeStyle={themeStyle}
            quickIntents={quickIntents}
            toggleQuickIntent={toggleQuickIntent}
            payRanges={payRanges}
            setPayRanges={setPayRanges}
            tierOnly={tierOnly}
            setTierOnly={setTierOnly}
            formats={formats}
            setFormats={setFormats}
            distanceMi={distanceMi}
            setDistanceMi={setDistanceMi}
            deadlineDays={deadlineDays}
            setDeadlineDays={setDeadlineDays}
            filteredCount={filteredCampaigns.length}
            onClose={() => {
              setFilterOpen(false);
              setFilterAnchor(null);
            }}
            onClear={clearFilters}
          />
        )}

        {sortDropOpen && sortAnchor && (
          <SortDropPortal
            ref={sortDropRef}
            anchor={sortAnchor}
            themeStyle={themeStyle}
            sortKey={sortKey}
            onSelect={(k) => {
              setSortKey(k);
              setSortDropOpen(false);
              setSortAnchor(null);
            }}
          />
        )}
      </div>
    );
  }

  /* ── Grid view ────────────────────────────────────────────── */

  return (
    <div className="cw-page disc" data-cat={activeCategory} style={themeStyle}>
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow">
            Discover · {filteredCampaigns.length} open · NYC
          </p>
          <h1 className="cw-title">Find your next campaign</h1>
        </div>
      </header>

      {toolbar}

      {isLoading ? (
        <div className="disc-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          onClear={clearFilters}
          variant={isAllLockedEmpty ? "all-locked" : "no-match"}
          onTurnOffTier={() => setTierOnly(false)}
        />
      ) : activeCategories.size === 0 && !query.trim() ? (
        /* All-mode (no filter, no search) → Airbnb-style sections grouped by
           theme. Each section has its own colored eyebrow + horizontal row.
           Selecting a category collapses to flat grid below. */
        <div className="disc-sections">
          {sectionGroups.map((g) => (
            <section
              key={g.key}
              className="disc-section"
              style={{ ["--section-accent" as string]: g.accent }}
            >
              <header className="disc-section-head">
                <div className="disc-section-headline">
                  <h2 className="disc-section-title">{g.label}</h2>
                  <p className="disc-section-sublabel">{g.sublabel}</p>
                </div>
                <button
                  type="button"
                  className="disc-section-more"
                  onClick={() => handleSectionSeeAll(g.key)}
                >
                  See all
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 6h7M6.5 3l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </header>
              <div className="disc-section-row">
                {g.campaigns.map((c, i) => (
                  <CampaignCard
                    key={c.id}
                    c={c}
                    idx={i}
                    appStatus={applications[c.id] ?? "none"}
                    saved={savedIds.has(c.id)}
                    locked={!tierOnly && c.minimumTier > CREATOR_TIER}
                    onSave={toggleSave}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Filtered mode (one category selected OR a search query) →
           dense flat grid, 6 across at desktop. */
        <div className="disc-grid disc-grid--compact">
          {filteredCampaigns.map((c, i) => (
            <CampaignCard
              key={c.id}
              c={c}
              idx={i}
              appStatus={applications[c.id] ?? "none"}
              saved={savedIds.has(c.id)}
              locked={!tierOnly && c.minimumTier > CREATOR_TIER}
              onSave={toggleSave}
            />
          ))}
        </div>
      )}

      {filterOpen && filterAnchor && (
        <FilterPopover
          ref={popoverRef}
          anchor={filterAnchor}
          themeStyle={themeStyle}
          quickIntents={quickIntents}
          toggleQuickIntent={toggleQuickIntent}
          payRanges={payRanges}
          setPayRanges={setPayRanges}
          tierOnly={tierOnly}
          setTierOnly={setTierOnly}
          formats={formats}
          setFormats={setFormats}
          distanceMi={distanceMi}
          setDistanceMi={setDistanceMi}
          deadlineDays={deadlineDays}
          setDeadlineDays={setDeadlineDays}
          filteredCount={filteredCampaigns.length}
          onClose={() => {
            setFilterOpen(false);
            setFilterAnchor(null);
          }}
          onClear={clearFilters}
        />
      )}

      {sortDropOpen && sortAnchor && (
        <SortDropPortal
          ref={sortDropRef}
          anchor={sortAnchor}
          sortKey={sortKey}
          onSelect={(k) => {
            setSortKey(k);
            setSortDropOpen(false);
            setSortAnchor(null);
          }}
        />
      )}
    </div>
  );
}

/* ── Campaign Card ────────────────────────────────────────── */

const CampaignCard = memo(function CampaignCard({
  c,
  idx,
  appStatus,
  saved,
  onSave,
  onHover,
  onLeave,
  isActive,
  locked,
}: {
  c: Campaign;
  idx: number;
  appStatus: ApplicationStatus;
  saved: boolean;
  onSave: (id: string) => void;
  onHover?: (id: string) => void;
  onLeave?: () => void;
  isActive?: boolean;
  locked?: boolean;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const total = c.images.length;
  const dl = daysLeft(c.deadlineIso);

  /* Hover preload — when creator's pointer enters the card we know they
     might click the carousel arrow next. Warm the browser cache so the swap
     is instant instead of waiting on the network. */
  const handleCardEnter = useCallback(() => {
    onHover?.(c.id);
    if (typeof window === "undefined" || total <= 1) return;
    const nextSrc = c.images[(imgIdx + 1) % total];
    const preload = new window.Image();
    preload.src = nextSrc;
  }, [onHover, c.id, c.images, imgIdx, total]);
  const urgentBadge = showSpotsBadge(c.slotsRemaining, c.slotsTotal);
  const { headline, estimate } = normalizePay(
    c.cashPay,
    c.payUnit,
    c.deliverables,
  );
  const hourlyRate = effectiveHourlyRate(c.cashPay, c.deliverables);
  const isRejected = appStatus === "rejected";

  // Whole card is the click target → detail page. Save heart and carousel
  // arrows stop propagation so they don't trigger navigation.
  const detailHref = `/creator/discover/${c.id}`;

  const cardClassName = [
    "disc-card",
    isActive ? "disc-card--active" : "",
    isRejected ? "disc-card--rejected" : "",
    locked ? "disc-card--locked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const articleBody = (
    <>
      {/* Photo area */}
      <div className="disc-card-img-wrap">
        <NextImage
          className="disc-card-img"
          src={c.images[imgIdx]}
          alt=""
          fill
          sizes="(min-width: 1100px) 20vw, (min-width: 768px) 33vw, 50vw"
          priority={idx < 4}
          loading={idx < 4 ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZDhkNGM4Ii8+PC9zdmc+"
          style={{ objectFit: "cover" }}
        />

        {/* Tier chip — liquid glass, top-left */}
        <div className="disc-card-tier-chip">
          <span
            className="disc-card-tier-dot"
            style={{ background: tierDotColor(c.minimumTier) }}
            aria-hidden="true"
          />
          {tierChipLabel(c.minimumTier)}
        </div>

        {/* Save button — top-right, glass circle */}
        <button
          type="button"
          className={`disc-card-save${saved ? " disc-card-save--saved" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSave(c.id);
          }}
          aria-label={saved ? "Remove from saved" : "Save campaign"}
          aria-pressed={saved}
        >
          {saved ? "♥" : "♡"}
        </button>

        {/* Carousel arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              className="disc-card-arrow disc-card-arrow--prev"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImgIdx((i) => (i - 1 + total) % total);
              }}
              aria-label="Previous photo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 2L4 7L9 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="disc-card-arrow disc-card-arrow--next"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImgIdx((i) => (i + 1) % total);
              }}
              aria-label="Next photo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 2L10 7L5 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="disc-card-dots">
            {c.images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`disc-card-dot${i === imgIdx ? " disc-card-dot--active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImgIdx(i);
                }}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Rejected overlay */}
        {isRejected && (
          <span
            className="disc-card-not-selected"
            aria-label="Application not selected"
          >
            Not selected
          </span>
        )}

        {/* Title overlay — bottom-left. Tagline reveals on hover, lifting the title. */}
        <div className="disc-card-overlay">
          <h3 className="disc-card-overlay-title">{c.title}</h3>
          {c.tagline && (
            <p className="disc-card-overlay-tagline">
              <span>{c.tagline}</span>
            </p>
          )}
          <span className="disc-card-overlay-meta">
            {c.neighborhood} · {c.distanceMi}mi
          </span>
        </div>
      </div>

      {/* Below-photo content */}
      <div className="disc-card-content">
        <div className="disc-card-merchant-row">
          <span className="disc-card-merchant">{c.merchantName}</span>
          {dl !== null && dl > 0 && dl <= 7 && (
            <span className="disc-card-deadline">{dl}d left</span>
          )}
        </div>

        <div className="disc-card-pay-row">
          <span className="disc-card-pay-headline">
            {headline}
            {hourlyRate > 0 && (
              <span className="disc-card-pay-rate">~${hourlyRate}/hr</span>
            )}
          </span>
          {estimate && (
            <span className="disc-card-pay-estimate">{estimate}</span>
          )}
        </div>

        <div className="disc-card-specs">
          {pluralize(c.slotsRemaining, "slot")} ·{" "}
          {c.format === "in-person"
            ? "In-person"
            : c.format === "remote"
              ? "Remote"
              : "Hybrid"}
        </div>

        {urgentBadge && (
          <span className="disc-card-urgency">
            {c.slotsRemaining} {c.slotsRemaining === 1 ? "spot" : "spots"} left
          </span>
        )}

        {/* Locked badge — small inline tier-required pill, only on locked cards.
            Unlocked cards have no extra hint; cursor:pointer is enough. */}
        {locked && (
          <div className="disc-card-foot-hint disc-card-foot-hint--locked">
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="6.5"
                width="8"
                height="6"
                rx="1.2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            {tierChipLabel(c.minimumTier)} required
          </div>
        )}

        {/* Application status pill (in-review / accepted) — replaces the old
            Apply button. Sits below the specs, subtle and informational. */}
        {!isRejected && !locked && appStatus !== "none" && (
          <span
            className={`disc-card-status-pill disc-card-status-pill--${appStatus}`}
          >
            {appStatus === "in_review" ? "In review" : "Accepted"}
          </span>
        )}
      </div>
    </>
  );

  // Locked cards aren't clickable — the rest are wrapped in <a> for navigation.
  if (locked) {
    return (
      <article
        className={cardClassName}
        style={
          idx < 12 ? { animationDelay: `${idx * 30}ms` } : { animation: "none" }
        }
        data-campaign-id={c.id}
        onMouseEnter={handleCardEnter}
        onMouseLeave={() => onLeave?.()}
      >
        {articleBody}
      </article>
    );
  }

  return (
    <Link
      href={detailHref}
      prefetch={false}
      className="disc-card-link"
      onMouseEnter={handleCardEnter}
      onMouseLeave={() => onLeave?.()}
      aria-label={`View ${c.title}`}
    >
      <article
        className={cardClassName}
        style={
          idx < 12 ? { animationDelay: `${idx * 30}ms` } : { animation: "none" }
        }
        data-campaign-id={c.id}
      >
        {articleBody}
      </article>
    </Link>
  );
});

/* ── Skeleton Card ───────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="disc-skeleton" aria-hidden="true">
      <div className="disc-skeleton-img" />
      <div className="disc-skeleton-body">
        <div className="disc-skeleton-line disc-skeleton-line--sm" />
        <div className="disc-skeleton-line disc-skeleton-line--lg" />
        <div className="disc-skeleton-line disc-skeleton-line--md" />
        <div className="disc-skeleton-btn" />
      </div>
    </div>
  );
}

/* ── Empty State ─────────────────────────────────────────── */

function EmptyState({
  onClear,
  variant = "no-match",
  onTurnOffTier,
}: {
  onClear: () => void;
  /** "all-locked" — every available campaign is above creator's tier.
   *  "no-match" — generic filter-too-tight case. */
  variant?: "no-match" | "all-locked";
  onTurnOffTier?: () => void;
}) {
  const isAllLocked = variant === "all-locked";
  return (
    <div className="disc-empty" role="status">
      <div className="disc-empty-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {isAllLocked ? (
            <>
              <rect
                x="14"
                y="22"
                width="20"
                height="16"
                rx="2"
                stroke="var(--mist)"
                strokeWidth="2"
              />
              <path
                d="M18 22v-4a6 6 0 0 1 12 0v4"
                stroke="var(--mist)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="var(--mist)"
                strokeWidth="2"
              />
              <path
                d="M16 24h16M24 16v16"
                stroke="var(--mist)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </div>
      <h2 className="disc-empty-title">
        {isAllLocked ? "No campaigns at your tier yet" : "No campaigns match"}
      </h2>
      <p className="disc-empty-sub">
        {isAllLocked
          ? "Turn off Only what I qualify for to browse the full universe — applying to a stretch tier is sometimes how brands discover you."
          : "Try widening your filters. New campaigns post every day."}
      </p>
      {isAllLocked && onTurnOffTier ? (
        <button type="button" className="btn-ghost" onClick={onTurnOffTier}>
          Browse all campaigns
        </button>
      ) : (
        <button type="button" className="btn-ghost" onClick={onClear}>
          Reset filters
        </button>
      )}
    </div>
  );
}

/* ── Filter Popover (anchored, no backdrop) ──────────────── */

type FilterPopoverProps = {
  anchor: { top: number; right: number };
  themeStyle?: React.CSSProperties;
  quickIntents: Set<QuickIntent>;
  toggleQuickIntent: (k: QuickIntent) => void;
  payRanges: PayRangeKey[];
  setPayRanges: (v: PayRangeKey[]) => void;
  tierOnly: boolean;
  setTierOnly: (v: boolean) => void;
  formats: FormatFilter[];
  setFormats: (v: FormatFilter[]) => void;
  distanceMi: number;
  setDistanceMi: (v: number) => void;
  deadlineDays: number | null;
  setDeadlineDays: (v: number | null) => void;
  filteredCount: number;
  onClose: () => void;
  onClear: () => void;
};

const FilterPopover = forwardRef<HTMLDivElement, FilterPopoverProps>(
  function FilterPopover(
    {
      anchor,
      themeStyle,
      quickIntents,
      toggleQuickIntent,
      payRanges,
      setPayRanges,
      tierOnly,
      setTierOnly,
      formats,
      setFormats,
      distanceMi,
      setDistanceMi,
      deadlineDays,
      setDeadlineDays,
      filteredCount,
      onClose,
      onClear,
    }: FilterPopoverProps,
    ref,
  ) {
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    function togglePayRange(r: PayRangeKey) {
      setPayRanges(
        payRanges.includes(r)
          ? payRanges.filter((x) => x !== r)
          : [...payRanges, r],
      );
    }
    function toggleFormat(f: FormatFilter) {
      setFormats(
        formats.includes(f) ? formats.filter((x) => x !== f) : [...formats, f],
      );
    }

    const DISTANCES: { label: string; value: number }[] = [
      { label: "1 mi", value: 1 },
      { label: "5 mi", value: 5 },
      { label: "10 mi", value: 10 },
      { label: "NYC", value: 99 },
    ];

    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        ref={ref}
        className="disc-filter-popover-anchor"
        role="dialog"
        aria-modal="true"
        aria-label="Filter campaigns"
        style={{
          position: "fixed",
          top: anchor.top,
          right: anchor.right,
          zIndex: 9999,
          ...themeStyle,
        }}
      >
        <div className="disc-filter-popover-arrow" aria-hidden="true" />
        <div className="disc-filter-popover">
          {/* Header */}
          <div className="disc-filter-popover-header">
            <h2 className="disc-filter-popover-title">Filters</h2>
            <button
              type="button"
              className="disc-filter-clear-btn"
              onClick={onClear}
            >
              Clear all
            </button>
          </div>

          {/* Scrollable body */}
          <div className="disc-filter-popover-body">
            {/* Quick filters — 1-tap creator-meaningful pre-built combos.
                Lives at the top of the popover so it's the first thing
                creators see when refining. */}
            <div className="disc-filter-group">
              <span className="disc-filter-label">Quick filters</span>
              <div className="disc-filter-chips">
                {QUICK_INTENTS.map(({ key, label, hint }) => (
                  <button
                    key={key}
                    type="button"
                    className={`disc-chip${quickIntents.has(key) ? " disc-chip--active" : ""}`}
                    aria-pressed={quickIntents.has(key)}
                    onClick={() => toggleQuickIntent(key)}
                    title={hint}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pay range */}
            <div className="disc-filter-group">
              <span className="disc-filter-label">Pay range</span>
              <div className="disc-filter-chips">
                {(["0-50", "50-150", "150+"] as PayRangeKey[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`disc-chip${payRanges.includes(r) ? " disc-chip--active" : ""}`}
                    aria-pressed={payRanges.includes(r)}
                    onClick={() => togglePayRange(r)}
                  >
                    {r === "0-50"
                      ? "$1–50"
                      : r === "50-150"
                        ? "$50–150"
                        : "$150+"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier eligibility */}
            <div className="disc-filter-group">
              <div className="disc-filter-toggle-row">
                <div>
                  <span className="disc-filter-label">
                    Only what I qualify for
                  </span>
                  <p className="disc-filter-hint">
                    Bronze (T2){" "}
                    <abbr
                      title="Campaigns at your tier level or below"
                      className="disc-filter-info"
                    >
                      ⓘ
                    </abbr>
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={tierOnly}
                  className={`disc-toggle${tierOnly ? " disc-toggle--on" : ""}`}
                  onClick={() => setTierOnly(!tierOnly)}
                  aria-label="Show only eligible campaigns"
                >
                  <span className="disc-toggle-thumb" />
                </button>
              </div>
            </div>

            {/* Format */}
            <div className="disc-filter-group">
              <span className="disc-filter-label">Format</span>
              <div className="disc-filter-chips">
                {(["in-person", "remote", "hybrid"] as FormatFilter[]).map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      className={`disc-chip${formats.includes(f) ? " disc-chip--active" : ""}`}
                      aria-pressed={formats.includes(f)}
                      onClick={() => toggleFormat(f)}
                    >
                      {f === "in-person"
                        ? "In-person"
                        : f === "remote"
                          ? "Remote"
                          : "Hybrid"}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Distance */}
            <div className="disc-filter-group">
              <span className="disc-filter-label">Distance</span>
              <div className="disc-filter-chips">
                {DISTANCES.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    className={`disc-chip${distanceMi === value ? " disc-chip--active" : ""}`}
                    aria-pressed={distanceMi === value}
                    onClick={() => setDistanceMi(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div className="disc-filter-group">
              <span className="disc-filter-label">Deadline</span>
              <div className="disc-filter-chips">
                {([null, 7, 14, 30] as (number | null)[]).map((d) => {
                  const label =
                    d === null
                      ? "Any"
                      : d === 7
                        ? "This week"
                        : d === 14
                          ? "2 weeks"
                          : "Month";
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`disc-chip${deadlineDays === d ? " disc-chip--active" : ""}`}
                      aria-pressed={deadlineDays === d}
                      onClick={() => setDeadlineDays(d)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="disc-filter-popover-footer">
            <button
              type="button"
              className="disc-filter-show-btn"
              onClick={onClose}
            >
              Show {pluralize(filteredCount, "campaign")}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

/* ── Sort Dropdown Portal (anchored, escapes Leaflet stacking) ──── */

type SortDropPortalProps = {
  anchor: { top: number; right: number };
  themeStyle?: React.CSSProperties;
  sortKey: SortKey;
  onSelect: (k: SortKey) => void;
};

const SortDropPortal = forwardRef<HTMLDivElement, SortDropPortalProps>(
  function SortDropPortal({ anchor, themeStyle, sortKey, onSelect }, ref) {
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        ref={ref}
        className="disc-sort-drop"
        role="listbox"
        aria-label="Sort options"
        style={{
          position: "fixed",
          top: anchor.top,
          right: anchor.right,
          zIndex: 9999,
          ...themeStyle,
        }}
      >
        {SORT_OPTIONS.map(({ key, label, tooltip }) => (
          <button
            key={key}
            type="button"
            role="option"
            aria-selected={sortKey === key}
            className={`disc-sort-drop-item${sortKey === key ? " disc-sort-drop-item--active" : ""}`}
            data-tooltip={tooltip}
            onClick={() => onSelect(key)}
          >
            {sortKey === key && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {label}
          </button>
        ))}
      </div>,
      document.body,
    );
  },
);
