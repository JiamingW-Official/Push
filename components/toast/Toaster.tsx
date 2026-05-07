"use client";

/**
 * App-wide toast system. FIFO with a 3-stack ceiling — the 4th
 * toast displaces the oldest. Mounted once per role layout so any
 * client component can call `useToast()` without per-page providers.
 *
 * Toast variants map to v12.2 design system colors:
 *   - "info"    : warm gray surface, ink text (neutral updates)
 *   - "success" : N2W blue accent (matches Filled Secondary)
 *   - "error"   : Brand Red accent (matches Filled Primary)
 *   - "warn"    : Champagne accent (ceremonial / cautionary)
 *   - "decline" : Editorial Pink (the existing invites decline-undo style)
 *
 * Stacking from bottom-right of viewport, 12px gap, spring slide-in,
 * fade-out exit. Each toast carries an optional Action (right-edge CTA
 * — "Undo", "Retry", "View") and auto-dismisses after `duration` ms
 * (info/success/warn/decline default 4500; error 8000; pass null to
 * require manual dismiss).
 *
 * API:
 *   const { toast, push, dismiss } = useToast();
 *   toast.success("Application approved");
 *   toast.error("Save failed", { actionLabel: "Retry", onAction: retry });
 *   toast.info("Live thread connected");
 *   toast.warn("Approaching daily quota");
 *   // legacy form still supported:
 *   push({ variant: "success", title: "..." });
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./Toaster.css";

export type ToastVariant = "info" | "success" | "error" | "warn" | "decline";

export type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  body?: string;
  /** Right-aligned button. Omit for narrative-only toasts. */
  action?: { label: string; onClick: () => void };
  /** ms before auto-dismiss. null = manual only. */
  duration?: number | null;
};

/** Convenience options for the `toast.<variant>(message, opts?)` shortcuts. */
export type ToastOptions = {
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Override auto-dismiss (ms). null = manual only. */
  duration?: number | null;
};

type ToastShortcutFn = (message: string, opts?: ToastOptions) => string;

export type ToastApi = {
  success: ToastShortcutFn;
  error: ToastShortcutFn;
  info: ToastShortcutFn;
  warn: ToastShortcutFn;
  decline: ToastShortcutFn;
};

type ToastContextValue = {
  push: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  toast: ToastApi;
};

/** Per-variant default auto-dismiss timing. */
const DURATION_BY_VARIANT: Record<ToastVariant, number> = {
  info: 4500,
  success: 4500,
  warn: 4500,
  decline: 4500,
  error: 8000,
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

      const duration =
        input.duration === undefined
          ? DURATION_BY_VARIANT[input.variant]
          : input.duration;
      if (duration !== null) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  const toast = useMemo<ToastApi>(() => {
    const make =
      (variant: ToastVariant): ToastShortcutFn =>
      (message, opts) =>
        push({
          variant,
          title: message,
          body: opts?.body,
          action:
            opts?.actionLabel && opts.onAction
              ? { label: opts.actionLabel, onClick: opts.onAction }
              : undefined,
          duration: opts?.duration,
        });
    return {
      success: make("success"),
      error: make("error"),
      info: make("info"),
      warn: make("warn"),
      decline: make("decline"),
    };
  }, [push]);

  /* Cleanup all timers on unmount — no leak on route change. */
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss, toast }}>
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
