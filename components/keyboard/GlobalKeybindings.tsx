"use client";

/**
 * Global keyboard layer mounted in /creator/(workspace)/layout.tsx.
 * Owns the "g <letter>" navigation shortcuts plus "?" for the cheatsheet.
 *
 * Page-scoped bindings (J/K navigate, A accept, etc.) are added at the
 * page level via useKeybindings(). This component handles only the
 * always-on global set.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoSequence, useKeybindings } from "@/lib/keyboard/useKeybindings";
import "./GlobalKeybindings.css";

export function GlobalKeybindings() {
  const router = useRouter();
  const [cheatsheet, setCheatsheet] = useState(false);

  /* "g <letter>" navigation. */
  useGoSequence({
    t: () => router.push("/creator/today"),
    i: () => router.push("/creator/gigs/invites"),
    a: () => router.push("/creator/gigs/active"),
    h: () => router.push("/creator/gigs/history"),
    e: () => router.push("/creator/earnings"),
    d: () => router.push("/creator/discover"),
    s: () => router.push("/creator/settings"),
  });

  /* Single-key globals. */
  useKeybindings({
    "?": () => setCheatsheet((v) => !v),
    Escape: () => setCheatsheet(false),
  });

  if (!cheatsheet) return null;

  return (
    <div
      className="kbd-cheatsheet"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCheatsheet(false);
      }}
    >
      <div className="kbd-cheatsheet__card">
        <header className="kbd-cheatsheet__head">
          <h2>Keyboard shortcuts</h2>
          <button
            type="button"
            className="kbd-cheatsheet__close"
            onClick={() => setCheatsheet(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="kbd-cheatsheet__body">
          <section>
            <h3>Global</h3>
            <ul>
              <li>
                <kbd>⌘</kbd>+<kbd>K</kbd>
                <span>Open command palette</span>
              </li>
              <li>
                <kbd>?</kbd>
                <span>This cheatsheet</span>
              </li>
              <li>
                <kbd>Esc</kbd>
                <span>Close any modal / drawer</span>
              </li>
            </ul>
          </section>

          <section>
            <h3>
              Go to (press <kbd>g</kbd> then a letter)
            </h3>
            <ul>
              <li>
                <kbd>g</kbd> <kbd>t</kbd>
                <span>Today</span>
              </li>
              <li>
                <kbd>g</kbd> <kbd>i</kbd>
                <span>Invites</span>
              </li>
              <li>
                <kbd>g</kbd> <kbd>a</kbd>
                <span>Active gigs</span>
              </li>
              <li>
                <kbd>g</kbd> <kbd>h</kbd>
                <span>History</span>
              </li>
              <li>
                <kbd>g</kbd> <kbd>e</kbd>
                <span>Earnings</span>
              </li>
              <li>
                <kbd>g</kbd> <kbd>d</kbd>
                <span>Discover</span>
              </li>
              <li>
                <kbd>g</kbd> <kbd>s</kbd>
                <span>Settings</span>
              </li>
            </ul>
          </section>

          <section>
            <h3>List pages (Invites / Active / History)</h3>
            <ul>
              <li>
                <kbd>↑</kbd> <kbd>↓</kbd>
                <span>Navigate cards</span>
              </li>
              <li>
                <kbd>J</kbd> <kbd>K</kbd>
                <span>Same as ↑ ↓</span>
              </li>
              <li>
                <kbd>/</kbd>
                <span>Focus search</span>
              </li>
              <li>
                <kbd>A</kbd>
                <span>Accept selected (Invites only)</span>
              </li>
              <li>
                <kbd>D</kbd>
                <span>Decline (Invites only)</span>
              </li>
              <li>
                <kbd>B</kbd>
                <span>View brief</span>
              </li>
              <li>
                <kbd>x</kbd>
                <span>Toggle bulk-select on row</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
