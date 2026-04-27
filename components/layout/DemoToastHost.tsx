"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT, type DemoToastDetail, type ToastKind } from "@/lib/demo";

/**
 * Host for the `push:demo-toast` event stream. Mount once at the top of
 * every layout — it listens and renders a queue of stacking toasts.
 *
 * Visual spec:
 *   - Fixed bottom-right, 16px from edges.
 *   - Each toast is 320px wide, Design.md palette: Flag Red border + white
 *     text for errors; Deep Space Blue border + Pearl Stone bg for success.
 *   - Auto-dismiss at 3 s, pauseable on hover. Click anywhere to close.
 *   - Max 5 concurrent; oldest drops when full.
 */
const TOAST_TTL_MS = 3_000;
const MAX_VISIBLE = 5;

export function DemoToastHost() {
  const [items, setItems] = useState<DemoToastDetail[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const ce = e as CustomEvent<DemoToastDetail>;
      setItems((prev) => [...prev, ce.detail].slice(-MAX_VISIBLE));
      // Auto-dismiss
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== ce.detail.id));
      }, TOAST_TTL_MS);
    }
    window.addEventListener(TOAST_EVENT, onToast as EventListener);
    return () =>
      window.removeEventListener(TOAST_EVENT, onToast as EventListener);
  }, []);

  function dismiss(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        right: "16px",
        bottom: "16px",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
      }}
    >
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          style={toastStyle(t.kind)}
        >
          <span style={toastTag(t.kind)}>
            {t.kind === "error" ? "✗" : t.kind === "success" ? "✓" : "·"}
          </span>
          <span>{t.text}</span>
        </button>
      ))}
    </div>
  );
}

function toastStyle(kind: ToastKind): React.CSSProperties {
  const isError = kind === "error";
  return {
    pointerEvents: "auto",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "320px",
    padding: "12px 16px",
    border: `2px solid ${isError ? "var(--brand-red)" : "var(--ink)"}`,
    background: isError ? "var(--brand-red)" : "var(--surface)",
    color: isError ? "#fff" : "var(--ink)",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    textAlign: "left" as const,
    borderRadius: "var(--r-xl)",
    cursor: "pointer",
    boxShadow: "var(--shadow-2)",
  };
}

function toastTag(kind: ToastKind): React.CSSProperties {
  const isError = kind === "error";
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    background: isError ? "var(--surface-2)" : "var(--ink)",
    color: isError ? "var(--brand-red)" : "var(--surface)",
    fontWeight: 800,
    fontSize: "12px",
    flexShrink: 0,
  };
}
