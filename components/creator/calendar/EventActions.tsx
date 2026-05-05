"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CalendarEvent } from "@/lib/calendar/mock-events";

export interface EventActionsProps {
  event: CalendarEvent;
  onMarkDone: (id: string) => void;
  onAddNote: (id: string) => void;
  onMessageMerchant: (campaignId: string) => void;
  onRequestExtension: (id: string) => void;
}

export function EventActions({
  event,
  onMarkDone,
  onAddNote,
  onMessageMerchant,
  onRequestExtension,
}: EventActionsProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close overflow menu when clicking outside
  useEffect(() => {
    if (!overflowOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [overflowOpen]);

  return (
    <div className="cal-actions-row">
      {/* Primary CTA: Submit (if post URL exists and not done) */}
      {event.postUrl && !event.done ? (
        <Link
          href={event.postUrl}
          className="btn-primary click-shift cal-btn-sm"
        >
          Submit
        </Link>
      ) : (
        <button
          className="btn-ghost click-shift cal-btn-sm"
          onClick={() => onMarkDone(event.id)}
          disabled={event.done}
        >
          {event.done ? "Done ✓" : "Mark done"}
        </button>
      )}

      {/* Note — always visible secondary action */}
      {!event.done && (
        <button
          className="btn-ghost click-shift cal-btn-sm"
          onClick={() => onAddNote(event.id)}
        >
          Note
        </button>
      )}

      {/* ··· overflow for secondary actions */}
      {!event.done && (
        <div className="cal-actions-overflow" ref={menuRef}>
          <button
            className="btn-ghost click-shift cal-btn-sm cal-btn-overflow"
            onClick={() => setOverflowOpen((v) => !v)}
            aria-label="More actions"
            aria-expanded={overflowOpen}
          >
            ···
          </button>
          {overflowOpen && (
            <div className="cal-overflow-menu" role="menu">
              <button
                className="cal-overflow-item"
                role="menuitem"
                onClick={() => {
                  onMessageMerchant(event.campaignId);
                  setOverflowOpen(false);
                }}
              >
                Message merchant
              </button>
              <button
                className="cal-overflow-item"
                role="menuitem"
                onClick={() => {
                  onRequestExtension(event.id);
                  setOverflowOpen(false);
                }}
              >
                Request extension
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
