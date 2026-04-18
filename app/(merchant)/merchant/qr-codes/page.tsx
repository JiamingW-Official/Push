"use client";

import { useMemo, useState } from "react";
import "./qr-codes.css";

/* ============================================================
   Push — Merchant QR Codes Management
   v5.1 · Vertical AI for Local Commerce
   ConversionOracle™ attribution entrypoint
   ============================================================ */

/* ---------- Fixtures ---------------------------------------- */

type QRStatus = "active" | "paused" | "archived";

interface QRRecord {
  id: string;
  name: string;
  location: string;
  campaign: string;
  status: QRStatus;
  scansWeek: number;
  verifiedRate: number;
  lastScanMinutes: number; // minutes ago
  seed: number; // deterministic pattern seed
}

const LOCATIONS = [
  { id: "wburg-n6", label: "Williamsburg · N 6th St" },
  { id: "wburg-bedford", label: "Williamsburg · Bedford Ave" },
  { id: "wburg-grand", label: "Williamsburg · Grand St" },
] as const;

const CAMPAIGNS = [
  { id: "morning-rush", label: "Morning Rush — Weekday 7–10a" },
  { id: "weekend-pastry", label: "Weekend Pastry Pairing" },
  { id: "no-campaign", label: "No campaign (generic reward)" },
] as const;

const MOCK_QRS: QRRecord[] = [
  {
    id: "qr-001",
    name: "Counter · Morning Rush",
    location: LOCATIONS[0].label,
    campaign: CAMPAIGNS[0].label,
    status: "active",
    scansWeek: 42,
    verifiedRate: 94,
    lastScanMinutes: 12,
    seed: 17,
  },
  {
    id: "qr-002",
    name: "Window Sticker · Bedford",
    location: LOCATIONS[1].label,
    campaign: CAMPAIGNS[1].label,
    status: "active",
    scansWeek: 31,
    verifiedRate: 90,
    lastScanMinutes: 58,
    seed: 23,
  },
  {
    id: "qr-003",
    name: "Table Tent · Back Room",
    location: LOCATIONS[0].label,
    campaign: CAMPAIGNS[0].label,
    status: "active",
    scansWeek: 24,
    verifiedRate: 87,
    lastScanMinutes: 142,
    seed: 41,
  },
  {
    id: "qr-004",
    name: "Receipt Print · Grand",
    location: LOCATIONS[2].label,
    campaign: CAMPAIGNS[2].label,
    status: "active",
    scansWeek: 19,
    verifiedRate: 96,
    lastScanMinutes: 33,
    seed: 59,
  },
  {
    id: "qr-005",
    name: "Cash Register · N 6th",
    location: LOCATIONS[0].label,
    campaign: CAMPAIGNS[1].label,
    status: "paused",
    scansWeek: 11,
    verifiedRate: 82,
    lastScanMinutes: 1440 * 2, // 2d
    seed: 73,
  },
  {
    id: "qr-006",
    name: "Sidewalk A-Frame · Bedford",
    location: LOCATIONS[1].label,
    campaign: CAMPAIGNS[0].label,
    status: "active",
    scansWeek: 9,
    verifiedRate: 88,
    lastScanMinutes: 210,
    seed: 89,
  },
  {
    id: "qr-007",
    name: "Bag Sticker · Grand",
    location: LOCATIONS[2].label,
    campaign: CAMPAIGNS[1].label,
    status: "archived",
    scansWeek: 4,
    verifiedRate: 80,
    lastScanMinutes: 1440 * 9, // 9d
    seed: 101,
  },
  {
    id: "qr-008",
    name: "Loyalty Card · All Stores",
    location: LOCATIONS[0].label,
    campaign: CAMPAIGNS[2].label,
    status: "active",
    scansWeek: 3,
    verifiedRate: 92,
    lastScanMinutes: 1440, // 1d
    seed: 113,
  },
];

const SUMMARY = {
  totalQrs: 8,
  scansWeek: 143,
  verifiedConversions: 89,
  autoVerifyRate: 91,
};

/* ---------- QR SVG (visual placeholder, not functional) ----- */
// Deterministic "QR-looking" block pattern. 21×21 grid, 3 corner finder patterns,
// remaining cells filled via a seeded PRNG (~50% density).
function QRPreview({
  seed,
  size = 168,
  title,
}: {
  seed: number;
  size?: number;
  title?: string;
}) {
  const GRID = 21;
  const cell = size / GRID;

  // Seeded pseudo-random via mulberry32
  const mulberry32 = (a: number) => {
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // Finder pattern: 7x7 square with border, gap, center
  const isFinder = (r: number, c: number) => {
    const inTL = r < 7 && c < 7;
    const inTR = r < 7 && c >= GRID - 7;
    const inBL = r >= GRID - 7 && c < 7;
    return inTL || inTR || inBL;
  };

  const drawFinder = (r: number, c: number) => {
    // returns true if the cell should be filled for a finder pattern
    let lr = r,
      lc = c;
    if (c >= GRID - 7) lc = c - (GRID - 7);
    if (r >= GRID - 7) lr = r - (GRID - 7);
    // 7x7: outer ring filled, inner ring empty, 3x3 center filled
    const onOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6;
    const onInner =
      (lr === 1 || lr === 5 || lc === 1 || lc === 5) &&
      lr >= 1 &&
      lr <= 5 &&
      lc >= 1 &&
      lc <= 5;
    const onCenter = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    if (onOuter) return true;
    if (onInner) return false;
    if (onCenter) return true;
    return false;
  };

  const rng = mulberry32(seed);
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (isFinder(r, c)) {
        if (drawFinder(r, c)) cells.push({ x: c, y: r });
      } else {
        if (rng() < 0.5) cells.push({ x: c, y: r });
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title ?? "QR code preview"}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }}
    >
      <rect width={size} height={size} fill="#ffffff" />
      {cells.map((p, i) => (
        <rect
          key={i}
          x={p.x * cell}
          y={p.y * cell}
          width={cell}
          height={cell}
          fill="#003049"
        />
      ))}
    </svg>
  );
}

/* ---------- Utilities --------------------------------------- */
function relTime(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function toast(msg: string) {
  if (typeof window !== "undefined") window.alert(msg);
}

/* ---------- Summary stat block ------------------------------ */
function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="qr-summary__stat">
      <div className="qr-summary__value">{value}</div>
      <div className="qr-summary__label">{label}</div>
    </div>
  );
}

/* ---------- Filter chip ------------------------------------- */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`qr-chip${active ? " qr-chip--active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ---------- QR Card ----------------------------------------- */
function QRCard({
  qr,
  onExport,
  onEdit,
  onArchive,
  onPrint,
}: {
  qr: QRRecord;
  onExport: (kind: "png" | "svg" | "pdf") => void;
  onEdit: () => void;
  onArchive: () => void;
  onPrint: () => void;
}) {
  return (
    <article className={`qr-card qr-card--${qr.status}`}>
      <div className="qr-card__thumb">
        <QRPreview seed={qr.seed} size={168} title={qr.name} />
        <span className={`qr-card__status qr-card__status--${qr.status}`}>
          {qr.status}
        </span>
      </div>

      <div className="qr-card__body">
        <h3 className="qr-card__name">{qr.name}</h3>
        <div className="qr-card__meta">
          <span>{qr.location}</span>
          <span className="qr-card__meta-sep" aria-hidden="true">
            /
          </span>
          <span>{qr.campaign}</span>
        </div>
        <div className="qr-card__stats">
          <div>
            <div className="qr-card__stat-value">{qr.scansWeek}</div>
            <div className="qr-card__stat-label">Scans this week</div>
          </div>
          <div>
            <div className="qr-card__stat-value">{qr.verifiedRate}%</div>
            <div className="qr-card__stat-label">Verified rate</div>
          </div>
          <div>
            <div className="qr-card__stat-value qr-card__stat-value--muted">
              {relTime(qr.lastScanMinutes)}
            </div>
            <div className="qr-card__stat-label">Last scan</div>
          </div>
        </div>
      </div>

      <div className="qr-card__actions">
        <button
          type="button"
          className="qr-act-btn"
          onClick={() => onExport("png")}
        >
          PNG
        </button>
        <button
          type="button"
          className="qr-act-btn"
          onClick={() => onExport("svg")}
        >
          SVG
        </button>
        <button type="button" className="qr-act-btn" onClick={onPrint}>
          Printable PDF
        </button>
        <button type="button" className="qr-act-btn" onClick={onEdit}>
          Edit
        </button>
        <button
          type="button"
          className="qr-act-btn qr-act-btn--danger"
          onClick={onArchive}
        >
          {qr.status === "archived" ? "Restore" : "Archive"}
        </button>
      </div>
    </article>
  );
}

/* ---------- Printable layout (A6 poster) -------------------- */
function PrintablePoster({
  qr,
  shopName,
  onClose,
}: {
  qr: QRRecord;
  shopName: string;
  onClose: () => void;
}) {
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="qr-print-overlay" role="dialog" aria-modal="true">
      <div className="qr-print-toolbar">
        <button type="button" className="qr-ghost-btn" onClick={onClose}>
          Close
        </button>
        <button type="button" className="qr-primary-btn" onClick={handlePrint}>
          Print / Save PDF
        </button>
      </div>

      <div className="qr-poster-wrap">
        <div className="qr-poster" id="qr-poster-print">
          <div className="qr-poster__header">
            <span className="qr-poster__logo">
              Push<span>.</span>
            </span>
            <span className="qr-poster__tag">Customer Acquisition Engine</span>
          </div>

          <div className="qr-poster__qr">
            <QRPreview seed={qr.seed} size={360} title={qr.name} />
          </div>

          <div className="qr-poster__copy">
            <div className="qr-poster__line-eyebrow">Scan for a reward</div>
            <div className="qr-poster__line-shop">at {shopName}</div>
          </div>

          <div className="qr-poster__footer">
            <span>
              Attribution by ConversionOracle™ · Vertical AI for Local Commerce
            </span>
            <span className="qr-poster__id">{qr.id.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- New QR Flow (modal) ----------------------------- */
function NewQRModal({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: (rec: QRRecord) => void;
}) {
  const [locationId, setLocationId] = useState<string>(LOCATIONS[0].id);
  const [campaignId, setCampaignId] = useState<string>(CAMPAIGNS[0].id);
  const [nameOverride, setNameOverride] = useState("");

  const loc = LOCATIONS.find((l) => l.id === locationId) ?? LOCATIONS[0];
  const camp = CAMPAIGNS.find((c) => c.id === campaignId) ?? CAMPAIGNS[0];

  // Auto-suggest name
  const suggested = useMemo(() => {
    const shortLoc = loc.label.split("·")[1]?.trim() ?? loc.label;
    const shortCamp = camp.label.split("—")[0]?.trim() ?? camp.label;
    return `${shortCamp} · ${shortLoc}`;
  }, [loc, camp]);

  const finalName = nameOverride.trim() || suggested;
  const seed = useMemo(
    () => Array.from(finalName).reduce((acc, ch) => acc + ch.charCodeAt(0), 17),
    [finalName],
  );

  const handleSubmit = () => {
    const id = `qr-new-${Date.now()}`;
    onGenerate({
      id,
      name: finalName,
      location: loc.label,
      campaign: camp.label,
      status: "active",
      scansWeek: 0,
      verifiedRate: 0,
      lastScanMinutes: 0,
      seed,
    });
    toast(`QR exported · ${id}.png`);
    onClose();
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div
        className="qr-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="qr-modal__header">
          <div>
            <div className="qr-modal__eyebrow">
              Create · ConversionOracle™ entrypoint
            </div>
            <h2 className="qr-modal__title">New QR code</h2>
          </div>
          <button
            type="button"
            className="qr-ghost-btn"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="qr-modal__body">
          <div className="qr-modal__form">
            <div className="qr-field">
              <label className="qr-field__label" htmlFor="qr-loc">
                Location
              </label>
              <select
                id="qr-loc"
                className="qr-field__select"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                {LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="qr-field">
              <label className="qr-field__label" htmlFor="qr-camp">
                Campaign
              </label>
              <select
                id="qr-camp"
                className="qr-field__select"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
              >
                {CAMPAIGNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="qr-field">
              <label className="qr-field__label" htmlFor="qr-name">
                QR name
              </label>
              <input
                id="qr-name"
                className="qr-field__input"
                placeholder={suggested}
                value={nameOverride}
                onChange={(e) => setNameOverride(e.target.value)}
              />
              <div className="qr-field__hint">
                Auto-suggest: <strong>{suggested}</strong>
              </div>
            </div>

            <div className="qr-field__footer">
              <button
                type="button"
                className="qr-primary-btn"
                onClick={handleSubmit}
              >
                Generate QR
              </button>
              <button type="button" className="qr-ghost-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>

          <div className="qr-modal__preview">
            <div className="qr-modal__preview-label">Preview</div>
            <div className="qr-modal__preview-qr">
              <QRPreview seed={seed} size={260} title={finalName} />
            </div>
            <div className="qr-modal__preview-meta">
              <div className="qr-modal__preview-name">{finalName}</div>
              <div className="qr-modal__preview-sub">
                {loc.label} · {camp.label}
              </div>
            </div>
            <div className="qr-modal__print-hint">
              Print layout: A6 poster — Push logo, QR, "Scan for a reward at
              [shop]", ConversionOracle™ attribution line.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Page --------------------------------------- */
export default function QRCodesPage() {
  const [qrs, setQrs] = useState<QRRecord[]>(MOCK_QRS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | QRStatus>("all");
  const [sort, setSort] = useState<"scans" | "newest" | "oldest">("scans");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [printQr, setPrintQr] = useState<QRRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = qrs.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (locationFilter !== "all" && r.location !== locationFilter)
        return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.campaign.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    });

    out = [...out].sort((a, b) => {
      if (sort === "scans") return b.scansWeek - a.scansWeek;
      if (sort === "newest") return a.lastScanMinutes - b.lastScanMinutes;
      return b.lastScanMinutes - a.lastScanMinutes;
    });
    return out;
  }, [qrs, search, status, sort, locationFilter]);

  const allLocations = useMemo(() => {
    const set = new Set<string>();
    qrs.forEach((q) => set.add(q.location));
    return Array.from(set);
  }, [qrs]);

  const handleExport = (qr: QRRecord, kind: "png" | "svg" | "pdf") => {
    const ext = kind;
    toast(`QR exported · ${qr.id}.${ext}`);
  };

  const handleEdit = (qr: QRRecord) => {
    toast(`Editing · ${qr.name}`);
  };

  const handleArchive = (qr: QRRecord) => {
    setQrs((prev) =>
      prev.map((r) =>
        r.id === qr.id
          ? {
              ...r,
              status:
                r.status === "archived" ? "active" : ("archived" as QRStatus),
            }
          : r,
      ),
    );
  };

  const shopName = "Devoción — Williamsburg";

  return (
    <div className="qrc-shell">
      {/* Hero strip */}
      <section className="qrc-hero">
        <nav className="qrc-breadcrumb" aria-label="Breadcrumb">
          <a href="/merchant/dashboard" className="qrc-breadcrumb__link">
            Home
          </a>
          <span className="qrc-breadcrumb__sep">/</span>
          <span className="qrc-breadcrumb__current">QR codes</span>
        </nav>

        <div className="qrc-hero__eyebrow">
          ConversionOracle™ attribution entrypoint
        </div>

        <div className="qrc-hero__row">
          <h1 className="qrc-hero__title">Your QR codes</h1>
          <button
            type="button"
            className="qr-primary-btn qrc-hero__cta"
            onClick={() => setShowModal(true)}
          >
            + New QR code
          </button>
        </div>

        <p className="qrc-hero__note">
          Consumer-scans-merchant QR. Last-click attribution, 30-day window.
          Zero ops burden — verification runs on Push's Vertical AI for Local
          Commerce stack.
        </p>
      </section>

      {/* Summary stats */}
      <section className="qr-summary" aria-label="Summary">
        <SummaryStat value={String(SUMMARY.totalQrs)} label="Total QRs" />
        <SummaryStat
          value={String(SUMMARY.scansWeek)}
          label="Scans this week"
        />
        <SummaryStat
          value={String(SUMMARY.verifiedConversions)}
          label="Verified conversions"
        />
        <SummaryStat
          value={`${SUMMARY.autoVerifyRate}%`}
          label="Auto-verify rate"
        />
      </section>

      {/* Filter toolbar */}
      <section className="qr-toolbar" aria-label="Filter toolbar">
        <div className="qr-toolbar__search">
          <svg
            viewBox="0 0 20 20"
            width="16"
            height="16"
            aria-hidden="true"
            className="qr-toolbar__search-icon"
          >
            <circle
              cx="9"
              cy="9"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="14"
              y1="14"
              x2="18"
              y2="18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            className="qr-toolbar__search-input"
            type="search"
            placeholder="Search QR name, campaign, location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search QR codes"
          />
        </div>

        <div className="qr-toolbar__chips" role="tablist">
          <Chip active={status === "all"} onClick={() => setStatus("all")}>
            All
          </Chip>
          <Chip
            active={status === "active"}
            onClick={() => setStatus("active")}
          >
            Active
          </Chip>
          <Chip
            active={status === "paused"}
            onClick={() => setStatus("paused")}
          >
            Paused
          </Chip>
          <Chip
            active={status === "archived"}
            onClick={() => setStatus("archived")}
          >
            Archived
          </Chip>
        </div>

        <div className="qr-toolbar__controls">
          <label className="qr-toolbar__select-wrap">
            <span className="qr-toolbar__select-label">Sort</span>
            <select
              className="qr-toolbar__select"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
            >
              <option value="scans">Most scans</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>

          <label className="qr-toolbar__select-wrap">
            <span className="qr-toolbar__select-label">Location</span>
            <select
              className="qr-toolbar__select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All locations</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* QR grid */}
      <section className="qr-grid-wrap" aria-label="QR codes">
        {filtered.length === 0 ? (
          <div className="qr-empty">
            <div className="qr-empty__title">No QR codes match</div>
            <div className="qr-empty__sub">
              Adjust filters or create a new Williamsburg Coffee+ QR code.
            </div>
          </div>
        ) : (
          <div className="qr-grid">
            {filtered.map((qr) => (
              <QRCard
                key={qr.id}
                qr={qr}
                onExport={(k) => handleExport(qr, k)}
                onEdit={() => handleEdit(qr)}
                onArchive={() => handleArchive(qr)}
                onPrint={() => setPrintQr(qr)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer attribution caption */}
      <footer className="qrc-foot">
        <span>
          ConversionOracle™ 3-layer verify: QR + Claude Vision OCR + geo 200m.
        </span>
        <span>Software Leverage Ratio (SLR) amplified per location.</span>
      </footer>

      {showModal && (
        <NewQRModal
          onClose={() => setShowModal(false)}
          onGenerate={(rec) => setQrs((prev) => [rec, ...prev])}
        />
      )}

      {printQr && (
        <PrintablePoster
          qr={printQr}
          shopName={shopName}
          onClose={() => setPrintQr(null)}
        />
      )}
    </div>
  );
}
