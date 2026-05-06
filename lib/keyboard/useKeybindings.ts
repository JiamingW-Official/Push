"use client";

import { useEffect } from "react";

export type KeyHandler = (e: KeyboardEvent) => void;

/**
 * Generic key-binding hook. Pass a map of keys → handlers. Listens at
 * the document level. Skips when the user is typing in an INPUT,
 * TEXTAREA, contentEditable, or any element marked data-no-keybinding.
 *
 * Single-letter keys are matched case-insensitively. Cmd/Ctrl
 * combinations should be expressed as e.g. "cmd+a" / "ctrl+k".
 */
export function useKeybindings(map: Record<string, KeyHandler>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        Boolean(target.closest("[data-no-keybinding]"));

      const key = e.key;
      const lower = key.length === 1 ? key.toLowerCase() : key;
      const cmd = e.metaKey || e.ctrlKey;
      const shift = e.shiftKey;

      const candidates: string[] = [];
      if (cmd && shift) candidates.push(`cmd+shift+${lower}`);
      if (cmd) candidates.push(`cmd+${lower}`);
      if (shift && lower.length === 1) candidates.push(`shift+${lower}`);
      candidates.push(lower);

      for (const c of candidates) {
        const handler = map[c];
        if (handler && !isField) {
          handler(e);
          return;
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [map]);
}

/**
 * Vim-style "g <letter>" sequences. Tracks the leader for ~1.5s after
 * `g` is pressed. Used by global navigation (g i → /gigs/invites etc.)
 *
 * Returns nothing — purely a side-effect hook.
 */
export function useGoSequence(map: Record<string, KeyHandler>) {
  useEffect(() => {
    let leader = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable ||
        Boolean(target?.closest("[data-no-keybinding]"));
      if (isField) return;

      const k = e.key.toLowerCase();

      if (!leader) {
        if (k === "g") {
          leader = true;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            leader = false;
          }, 1500);
        }
        return;
      }

      // Already in leader mode.
      const handler = map[k];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
      leader = false;
      if (timer) clearTimeout(timer);
      timer = null;
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (timer) clearTimeout(timer);
    };
  }, [map]);
}
