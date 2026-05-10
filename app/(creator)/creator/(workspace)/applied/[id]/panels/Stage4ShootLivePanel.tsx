"use client";

/* ============================================================
   <Stage4ShootLivePanel> — slot is active, shoot in progress
   v3.1 · 2026-05-10 — real QR pixel grid + scan overlay
   ============================================================ */

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Sparkles, Zap } from "lucide-react";
import type { StagePanelProps } from "../StageRouter";

function useElapsed(slotIso?: string): string {
  const compute = () => {
    if (!slotIso) return "00:00";
    const ms = Date.now() - new Date(slotIso).getTime();
    if (ms < 0) return "00:00";
    const m = Math.floor(ms / 60_000);
    const s = Math.floor((ms % 60_000) / 1_000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const [elapsed, setElapsed] = useState(compute);
  useEffect(() => {
    const t = setInterval(() => {
      if (!slotIso) return;
      const ms = Date.now() - new Date(slotIso).getTime();
      if (ms < 0) {
        setElapsed("00:00");
        return;
      }
      const m = Math.floor(ms / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      setElapsed(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, 1_000);
    return () => clearInterval(t);
  }, [slotIso]);
  return elapsed;
}

// QR finder pattern (7x7)
const FINDER = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
] as const;

function seedBit(seed: string, x: number, y: number): boolean {
  let h = 5381;
  for (const c of seed) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
  h = (h ^ (x * 0x6b8b4567) ^ (y * 0x27220a95)) >>> 0;
  return (h & 1) === 1;
}

function QrGrid({ id, scanned }: { id: string; scanned: boolean }) {
  const SIZE = 21;
  const CELL = 8; // 21 × 8 = 168px — fits 200px box with 16px padding

  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let on: boolean;
      if (x < 7 && y < 7) {
        on = FINDER[y]![x] === 1;
      } else if (x >= SIZE - 7 && y < 7) {
        on = FINDER[y]![x - (SIZE - 7)] === 1;
      } else if (x < 7 && y >= SIZE - 7) {
        on = FINDER[y - (SIZE - 7)]![x] === 1;
      } else if (x === 6 || y === 6) {
        on = (x + y) % 2 === 0;
      } else {
        on = seedBit(id, x, y);
      }
      if (on) cells.push({ x, y });
    }
  }

  const dim = SIZE * CELL;
  const fill = scanned ? "#16a34a" : "#1a1916";

  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      aria-hidden
      style={{ display: "block" }}
    >
      {cells.map(({ x, y }) => (
        <rect
          key={`${x}-${y}`}
          x={x * CELL}
          y={y * CELL}
          width={CELL - 1}
          height={CELL - 1}
          fill={fill}
          rx={0.5}
          style={{ transition: "fill 0.4s ease" }}
        />
      ))}
    </svg>
  );
}

const SHOT_LIST = [
  { id: 0, label: "Wide establishing shot", tag: "Exterior" },
  { id: 1, label: "Product hero close-up", tag: "Product" },
  { id: 2, label: "Candid lifestyle moment", tag: "Lifestyle" },
];

export function Stage4ShootLivePanel({
  application,
  campaign,
}: StagePanelProps) {
  const elapsed = useElapsed(application.slotIso);
  const [shotsDone, setShotsDone] = useState<Set<number>>(new Set());
  const [scanned, setScanned] = useState(false);
  const [scanFlash, setScanFlash] = useState(false);

  function toggleShot(id: number) {
    setShotsDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleScan() {
    setScanFlash(true);
    setScanned(true);
    setTimeout(() => setScanFlash(false), 2500);
  }

  const qrId = application.qrCodeId ?? `qr_${application.id.slice(-6)}`;

  const elapsedMinutes = (() => {
    if (!application.slotIso) return 0;
    const ms = Date.now() - new Date(application.slotIso).getTime();
    return Math.max(0, Math.floor(ms / 60_000));
  })();
  const remainingMin = Math.max(0, 90 - elapsedMinutes);
  const progressPct = Math.min(100, ((90 - remainingMin) / 90) * 100);

  return (
    <section className="ad-panel-v3" aria-label="Live shoot">
      {/* ── Scan confirmation overlay ─────────────────────── */}
      {scanFlash && (
        <div className="ad-scan-overlay" role="alert" aria-live="assertive">
          <div className="ad-scan-overlay__inner">
            <div className="ad-scan-overlay__icon">
              <CheckCircle2 size={64} strokeWidth={1.25} />
            </div>
            <p className="ad-scan-overlay__title">Visit logged!</p>
            <p className="ad-scan-overlay__sub">
              QR confirmed · attribution started
            </p>
          </div>
        </div>
      )}

      <div className="ad-layout">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--red">
                <span className="ad-pill__dot" aria-hidden />
                LIVE NOW · {campaign.neighborhood}
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--timer ad-hero-v3__stat--red">
              {elapsed}
            </div>
            <h1 className="ad-hero-v3__title">Show your QR at the register</h1>
            <p className="ad-hero-v3__sub">Slot closes ~90 min after start.</p>
          </div>

          {/* Agent v3 */}
          <div className="ad-agent-v3">
            <div className="ad-agent-v3__head">
              <span className="ad-agent-v3__icon" aria-hidden>
                <Sparkles size={13} strokeWidth={2.25} />
              </span>
              <span className="ad-agent-v3__label">Agent</span>
              <span className="ad-agent-v3__timestamp">live</span>
            </div>
            <div className="ad-agent-v3__body">
              <p className="ad-agent-v3__prose">
                QR scan unlocks attribution. Wide establishing shot first —
                storefront in natural light from across the street. Then product
                hero close-up. You have <strong>{remainingMin}min</strong> in
                your window.
              </p>
            </div>
          </div>

          {/* Shot checklist card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">SHOT CHECKLIST</span>
              <ul className="ad-shots-v3" role="list">
                {SHOT_LIST.map((shot) => {
                  const done = shotsDone.has(shot.id);
                  return (
                    <li
                      key={shot.id}
                      className={`ad-shots-v3__item${done ? " is-done" : ""}`}
                    >
                      <button
                        type="button"
                        className="ad-shots-v3__check"
                        onClick={() => toggleShot(shot.id)}
                        aria-label={
                          done
                            ? `Mark ${shot.label} as not done`
                            : `Mark ${shot.label} as done`
                        }
                      >
                        {done ? (
                          <CheckCircle2 size={18} strokeWidth={2.5} />
                        ) : (
                          <Circle size={18} strokeWidth={2} />
                        )}
                      </button>
                      <div className="ad-shots-v3__body">
                        <span className="ad-shots-v3__label">{shot.label}</span>
                      </div>
                      <span className="ad-shots-v3__tag">{shot.tag}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────── */}
        <div className="ad-col-side">
          {/* QR code — visual centerpiece */}
          <div className="ad-qr-v3">
            <div
              className="ad-qr-v3__code"
              role="img"
              aria-label="QR code for merchant scan"
            >
              <QrGrid id={qrId} scanned={scanned} />
            </div>
            <span className="ad-qr-v3__id">{qrId}</span>
            <span className="ad-qr-v3__hint">
              Merchant scans this at the register to log your visit and start
              attribution.
            </span>
            {scanned ? (
              <span className="ad-qr-v3__scanned">
                <CheckCircle2 size={14} strokeWidth={2.5} />
                Scan confirmed!
              </span>
            ) : (
              <button
                type="button"
                className="ad-qr-v3__sim"
                onClick={handleScan}
              >
                Simulate scan (demo)
              </button>
            )}
          </div>

          {/* Time remaining card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">TIME REMAINING</span>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap
                    size={20}
                    strokeWidth={2}
                    style={{
                      color: "var(--brand-red, #c1121f)",
                      flexShrink: 0,
                    }}
                    aria-hidden
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-darky, sans-serif)",
                      fontSize: 32,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "var(--ink, #1a1916)",
                    }}
                  >
                    {remainingMin} min
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Slot time elapsed"
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "var(--surface-3, #ece9e0)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPct}%`,
                      background: "var(--brand-red, #c1121f)",
                      borderRadius: 3,
                      transition: "width 1s linear",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4, #9a9792)",
                    lineHeight: 1.4,
                  }}
                >
                  Slot auto-closes at T+90 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
