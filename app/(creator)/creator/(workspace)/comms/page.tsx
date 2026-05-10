import { redirect } from "next/navigation";

/* ============================================================
   /creator/comms — RETIRED v58 (2026-05-09).

   The comms dashboard was a stats panel (UNREAD WAITING / NEEDS YOU /
   SYSTEM / threads / avg reply / message volume) that duplicated info
   already surfaced elsewhere:
     · unread count → sidebar inbox-icon badge
     · threads list → /creator/inbox/messages
     · system events → /creator/inbox/system
     · avg-reply / volume → vanity, not action-driving

   Removing the intermediate dashboard so "Inbox" in the sidebar
   routes directly to the message list (the actual creator action).
   This file kept as a redirect so any deep links still resolve.
   ============================================================ */

export default function CommsRedirect() {
  redirect("/creator/inbox");
}
