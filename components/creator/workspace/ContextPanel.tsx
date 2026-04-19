"use client";

import { useEffect, useState, type ReactNode } from "react";
import "./ContextPanel.css";

interface ContextPanelProps {
  children?: ReactNode;
  title?: string;
}

const STORAGE_KEY = "push-ws-context:collapsed";

export default function ContextPanel({ children, title = "Context" }: ContextPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {}
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {}
  }

  return (
    <div className={`ws-context-panel${collapsed ? " ws-context-panel--collapsed" : ""}`}>
      <div className="ws-context-header">
        {!collapsed && (
          <span className="ws-context-title">{title}</span>
        )}
        <button
          className="ws-context-toggle"
          onClick={toggle}
          aria-label={collapsed ? "Expand context panel" : "Collapse context panel"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            {collapsed
              ? <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              : <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
            }
          </svg>
        </button>
      </div>
      {!collapsed && (
        <div className="ws-context-body">
          {children ?? (
            <p className="ws-context-empty">
              Select an item to see details.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
