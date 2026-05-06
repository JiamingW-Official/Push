"use client";

/**
 * Workspace-wide toast system. FIFO with a 3-stack ceiling — the 4th
 * toast displaces the oldest. Lives at the top of the workspace shell so
 * any page can call `useToast().push(...)` without per-page providers.
 *
 * Toast types map to v12.2 design system colors:
 *   - "info"    : warm gray surface, ink text (default for neutral updates)
 *   - "success" : N2W blue accent (matches Filled Secondary)
 *   - "error"   : Brand Red accent (matches Filled Primary)
 *   - "decline" : Editorial Pink (the existing invites decline-undo style)
 *
 * Stacking from bottom of viewport upward, 16px gap, slide-up entrance,
 * fade-out exit. Each toast carries an optional Action (primary CTA on
 * the right edge — "Undo", "Retry", "View") and auto-dismisses after
 * `duration` ms (default 5000; pass null to require manual dismiss).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./Toaster.css";

export type ToastVariant = "info" | "success" | "error" | "decline";

export type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  body?: string;
  /** Right-aligned button. Omit for narrative-only toasts. */
  action?: { label: string; onClick: () => void };
  /** ms before auto-dismiss. null = manual only. Default 5000. */
  duration?: number | null;
};

type ToastContextValue = {
  push: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_STACK = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (input: Omit<Toast, "id">): string => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const toast: Toast = { id, ...input };

      setToasts((prev) => {
        const next = [...prev, toast];
        if (next.length > MAX_STACK) {
          // FIFO eviction — drop the oldest. Clear its timer too.
          const evicted = next.shift();
          if (evicted) {
            const timer = timers.current.get(evicted.id);
            if (timer) clearTimeout(timer);
            timers.current.delete(evicted.id);
          }
        }
        return next;
      });

      const duration = input.duration === undefined ? 5000 : input.duration;
      if (duration !== null) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  /* Cleanup all timers on unmount — no leak on route change. */
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div
        className="toaster"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.variant}`}>
            <div className="toast__body">
              <strong className="toast__title">{t.title}</strong>
              {t.body ? <span className="toast__msg">{t.body}</span> : null}
            </div>
            {t.action ? (
              <button
                type="button"
                className="toast__action"
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            ) : null}
            <button
              type="button"
              className="toast__close"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
