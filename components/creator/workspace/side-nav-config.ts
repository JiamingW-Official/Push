export const SIDE_NAV = {
  inbox: [
    { href: "/creator/inbox", label: "All", icon: "inbox" },
    { href: "/creator/inbox/invites", label: "Invites", icon: "mail" },
    { href: "/creator/inbox/messages", label: "Messages", icon: "chat" },
    { href: "/creator/inbox/system", label: "System", icon: "bell" },
  ],
  work: [
    { href: "/creator/work/today", label: "Today", icon: "sun" },
    { href: "/creator/work/pipeline", label: "Pipeline", icon: "flow" },
    { href: "/creator/work/calendar", label: "Calendar", icon: "cal" },
    { href: "/creator/work/drafts", label: "Drafts", icon: "draft" },
  ],
  portfolio: [
    { href: "/creator/portfolio/identity", label: "Identity", icon: "id" },
    { href: "/creator/portfolio/earnings", label: "Earnings", icon: "cash" },
    { href: "/creator/portfolio/archive", label: "Archive", icon: "box" },
  ],
  discover: [],
} as const;

export type ZoneKey = keyof typeof SIDE_NAV;

export function getZoneFromPath(pathname: string): ZoneKey {
  if (pathname.startsWith("/creator/work")) return "work";
  if (pathname.startsWith("/creator/portfolio")) return "portfolio";
  if (pathname.startsWith("/creator/discover")) return "discover";
  return "inbox";
}
