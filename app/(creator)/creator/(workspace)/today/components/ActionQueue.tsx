"use client";

import Link from "next/link";
import { PaneHeader, PaneSubCount, EmptyState } from "@/lib/workspace/chrome";
import { Button } from "@/lib/workspace/buttons";
import type { ActionItem } from "@/lib/today/briefing";

interface ActionQueueProps {
  actions: ActionItem[];
  onDismiss: (id: string) => void;
  onSnooze: (id: string, durationMs: number) => void;
}

const TWO_HOURS = 2 * 3600 * 1000;

function ActionIcon({ type }: { type: ActionItem["type"] }) {
  // Simple letter-based icon fallback
  const map: Record<ActionItem["type"], string> = {
    reply: "R",
    decide: "D",
    evidence: "E",
    post: "P",
  };
  return <span className="action-card-icon">{map[type]}</span>;
}

export default function ActionQueue({
  actions,
  onDismiss,
  onSnooze,
}: ActionQueueProps) {
  return (
    <section aria-label="Action queue">
      <PaneHeader
        title="On your plate"
        sub={
          actions.length > 0 ? (
            <PaneSubCount
              count={actions.length}
              label={actions.length === 1 ? "item" : "items"}
            />
          ) : undefined
        }
      />
      {actions.length === 0 ? (
        <EmptyState
          title="Nothing on your plate."
          body="No urgent replies, no expiring invites. Coast."
        />
      ) : (
        <ul className="action-list anim-stagger" role="list">
          {actions.map((action) => (
            <li key={action.id}>
              <div className="action-card">
                <ActionIcon type={action.type} />
                <div>
                  <p className="action-card-title">{action.title}</p>
                  <p className="action-card-meta" suppressHydrationWarning>
                    {action.meta}
                  </p>
                </div>
                <div className="action-card-actions">
                  <Link href={action.href}>
                    <Button variant="primary" size="sm">
                      Do →
                    </Button>
                  </Link>
                  <Button
                    variant="pill"
                    size="sm"
                    onClick={() => onSnooze(action.id, TWO_HOURS)}
                  >
                    Snooze 2h
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(action.id)}
                    aria-label={`Dismiss ${action.title}`}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
