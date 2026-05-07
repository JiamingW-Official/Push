"use client";

// Tiny client island for the hero "Deactivate / Reactivate" toggle on the
// location detail page. Demo-mode: flips local state and fires a toast so
// the user gets immediate visible feedback while the real backend hook is
// stubbed.

import { useState } from "react";
import { useToast } from "@/components/toast/Toaster";

interface Props {
  locationId: string;
  initialStatus: "open" | "closed";
}

export default function LocationDeactivateButton({
  locationId,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState<"open" | "closed">(initialStatus);
  const toast = useToast();

  function handleToggle() {
    const nextStatus = status === "open" ? "closed" : "open";
    setStatus(nextStatus);
    toast.push({
      variant: nextStatus === "closed" ? "decline" : "success",
      title: nextStatus === "closed" ? "Location paused" : "Location reopened",
      body:
        nextStatus === "closed"
          ? `${locationId.toUpperCase()} is now hidden from active campaigns (demo).`
          : `${locationId.toUpperCase()} is back in rotation (demo).`,
    });
  }

  return (
    <button
      type="button"
      className="btn-ghost loc-hero__cta loc-hero__cta--ghost"
      onClick={handleToggle}
    >
      {status === "open" ? "Deactivate" : "Reactivate"}
    </button>
  );
}
