"use client";

import { useEffect, useState } from "react";

/*
 * Auto-looping 10s cycle:
 *   0.0s  QR scan complete
 *   1.2s  Claude Vision OCR complete
 *   3.8s  Geo-fence complete
 *   7.1s  Verdict: auto_verified
 *  10.0s  restart
 */

type Stage = {
  id: string;
  label: string;
  at: number; // seconds into the loop
  detail: string;
};

const STAGES: Stage[] = [
  {
    id: "qr",
    label: "QR scan",
    at: 0,
    detail: "payload verified · nonce consumed",
  },
  {
    id: "ocr",
    label: "Claude Vision OCR",
    at: 1.2,
    detail: "receipt read · 7 items matched · total $12.40 in-band",
  },
  {
    id: "geo",
    label: "Geo-fence 200m",
    at: 3.8,
    detail: "device at 47m · accuracy fix 14m",
  },
  {
    id: "verdict",
    label: "Verdict written",
    at: 7.1,
    detail: "auto_verified · creator paid · label in corpus",
  },
];

const LOOP_MS = 10_000;

export default function VerifyDemo() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const now = (Date.now() - start) % LOOP_MS;
      setElapsed(now / 1000);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="co-demo reveal">
      <div className="co-demo-bar-wrap">
        <div className="co-demo-bar">
          <div
            className="co-demo-bar-fill"
            style={{
              width: `${Math.min((elapsed / 7.1) * 100, 100).toFixed(1)}%`,
            }}
          />
        </div>
        <div className="co-demo-timer">
          t = <strong>{elapsed.toFixed(1)}s</strong> / 10.0s
        </div>
      </div>

      <ol className="co-demo-stages">
        {STAGES.map((stage, i) => {
          const done = elapsed >= stage.at;
          const active =
            done && (i === STAGES.length - 1 || elapsed < STAGES[i + 1].at);
          return (
            <li
              key={stage.id}
              className={`co-demo-stage${done ? " co-demo-stage--done" : ""}${
                active ? " co-demo-stage--active" : ""
              }`}
            >
              <span className="co-demo-check" aria-hidden="true">
                {done ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    <path d="M5 12 L10 17 L19 7" />
                  </svg>
                ) : (
                  <span className="co-demo-check-dot" />
                )}
              </span>

              <span className="co-demo-stage-body">
                <span className="co-demo-stage-label">{stage.label}</span>
                <span className="co-demo-stage-at">
                  t = {stage.at.toFixed(1)}s
                </span>
                <span className="co-demo-stage-detail">{stage.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <div
        className={`co-demo-verdict${
          elapsed >= 7.1 ? " co-demo-verdict--fired" : ""
        }`}
      >
        <span className="co-demo-verdict-k">Final verdict</span>
        <span className="co-demo-verdict-v">
          {elapsed >= 7.1 ? "auto_verified" : "pending..."}
        </span>
      </div>
    </div>
  );
}
