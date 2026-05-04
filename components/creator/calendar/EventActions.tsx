"use client";

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
  return (
    <div className="cal-actions-row">
      {event.postUrl && !event.done && (
        <Link
          href={event.postUrl}
          className="btn-primary click-shift cal-btn-sm"
        >
          Submit
        </Link>
      )}
      <button
        className="btn-ghost click-shift cal-btn-sm"
        onClick={() => onMarkDone(event.id)}
        disabled={event.done}
      >
        {event.done ? "Done" : "Mark done"}
      </button>
      {!event.done && (
        <>
          <button
            className="btn-ghost click-shift cal-btn-sm"
            onClick={() => onAddNote(event.id)}
          >
            Note
          </button>
          <button
            className="btn-ghost click-shift cal-btn-sm"
            onClick={() => onMessageMerchant(event.campaignId)}
          >
            Message merchant
          </button>
          <button
            className="btn-ghost click-shift cal-btn-sm"
            onClick={() => onRequestExtension(event.id)}
          >
            Request extension
          </button>
        </>
      )}
    </div>
  );
}
